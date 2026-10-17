import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

// We test the in-memory rate limiter directly since Upstash env vars are not
// set in the test environment, causing the factory to use the memory fallback.

// Helper to dynamically import a fresh rate limiter module per test suite
// so the in-memory stores are isolated between describe blocks.

function createJsonRequest(
  url: string,
  options?: { method?: string; body?: Record<string, unknown>; headers?: Record<string, string> }
): NextRequest {
  const { method = 'GET', body, headers = {} } = options || {};
  const reqHeaders = new Headers({
    'Content-Type': 'application/json',
    ...headers,
  });
  const init: { method: string; headers: Headers; body?: string } = {
    method,
    headers: reqHeaders,
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new NextRequest(url, init);
}

describe('Rate Limiting — IP Extraction', () => {
  let getClientIp: (req: NextRequest) => string;

  beforeEach(async () => {
    const mod = await import('../lib/rate-limit');
    getClientIp = mod.getClientIp;
  });

  it('extracts IP from cf-connecting-ip header (Cloudflare)', () => {
    const req = createJsonRequest('http://localhost:3000/api/test', {
      headers: { 'cf-connecting-ip': '203.0.113.50' },
    });
    expect(getClientIp(req)).toBe('203.0.113.50');
  });

  it('extracts first IP from x-forwarded-for header', () => {
    const req = createJsonRequest('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '198.51.100.10, 10.0.0.1, 172.16.0.1' },
    });
    expect(getClientIp(req)).toBe('198.51.100.10');
  });

  it('extracts IP from x-real-ip header', () => {
    const req = createJsonRequest('http://localhost:3000/api/test', {
      headers: { 'x-real-ip': '192.0.2.25' },
    });
    expect(getClientIp(req)).toBe('192.0.2.25');
  });

  it('falls back to 127.0.0.1 when no proxy headers are present', () => {
    const req = createJsonRequest('http://localhost:3000/api/test');
    expect(getClientIp(req)).toBe('127.0.0.1');
  });

  it('prioritises cf-connecting-ip over x-forwarded-for', () => {
    const req = createJsonRequest('http://localhost:3000/api/test', {
      headers: {
        'cf-connecting-ip': '203.0.113.99',
        'x-forwarded-for': '198.51.100.10',
      },
    });
    expect(getClientIp(req)).toBe('203.0.113.99');
  });

  it('rejects spoofed or malformed IPs and falls back to a valid IP or 127.0.0.1', () => {
    // Malicious injection attempt in cf-connecting-ip falls back to x-forwarded-for if valid
    const reqMalicious = createJsonRequest('http://localhost:3000/api/test', {
      headers: {
        'cf-connecting-ip': 'invalid-ip-injection; DROP TABLE',
        'x-forwarded-for': 'malicious-string, 198.51.100.22',
      },
    });
    expect(getClientIp(reqMalicious)).toBe('198.51.100.22');

    // Entirely garbage headers fallback safely to 127.0.0.1
    const reqAllGarbage = createJsonRequest('http://localhost:3000/api/test', {
      headers: {
        'cf-connecting-ip': '999.999.999.999',
        'x-real-ip': '<script>alert(1)</script>',
        'x-forwarded-for': 'garbage1, garbage2',
      },
    });
    expect(getClientIp(reqAllGarbage)).toBe('127.0.0.1');
  });
});

describe('Security — Timing-Safe Secret Verification', () => {
  let timingSafeEqualStr: (a: string | null | undefined, b: string | null | undefined) => boolean;

  beforeEach(async () => {
    const mod = await import('../lib/rate-limit');
    timingSafeEqualStr = mod.timingSafeEqualStr;
  });

  it('returns true for identically matching strings', () => {
    expect(timingSafeEqualStr('super-secret-key-123', 'super-secret-key-123')).toBe(true);
  });

  it('returns false for mismatched strings of identical length', () => {
    expect(timingSafeEqualStr('super-secret-key-123', 'super-secret-key-124')).toBe(false);
  });

  it('returns false for strings of different lengths without throwing error', () => {
    expect(timingSafeEqualStr('short', 'much-longer-secret-key')).toBe(false);
  });

  it('returns false when either or both arguments are empty, null, or undefined', () => {
    expect(timingSafeEqualStr('', 'secret')).toBe(false);
    expect(timingSafeEqualStr(null, 'secret')).toBe(false);
    expect(timingSafeEqualStr(undefined, 'secret')).toBe(false);
    expect(timingSafeEqualStr(undefined, undefined)).toBe(false);
  });
});

describe('Rate Limiting — Newsletter Endpoint (In-Memory)', () => {
  it('allows requests within the limit and blocks when exceeded', async () => {
    // Import the newsletter route handler — it uses the in-memory fallback
    // since UPSTASH_REDIS_REST_URL is not set in the test environment
    const { POST } = await import('../app/api/newsletter/route');

    const makeReq = () =>
      createJsonRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: { email: 'reader@example.com', consent: true },
        headers: { 'x-forwarded-for': '10.99.99.1' },
      });

    // The newsletter limiter allows 5 requests per 10 minutes.
    // First 5 should succeed (or return a non-429 status).
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeReq());
      expect(res.status).not.toBe(429);
    }

    // 6th request from the same IP should be rate limited
    const blockedRes = await POST(makeReq());
    expect(blockedRes.status).toBe(429);

    const body = await blockedRes.json();
    expect(body.error).toContain('Too many');

    // Verify rate limit headers
    expect(blockedRes.headers.get('Retry-After')).toBeTruthy();
    expect(blockedRes.headers.get('X-RateLimit-Limit')).toBe('5');
    expect(blockedRes.headers.get('X-RateLimit-Remaining')).toBe('0');
  });

  it('allows requests from different IPs independently', async () => {
    const { POST } = await import('../app/api/newsletter/route');

    // Exhaust limit for IP-A
    for (let i = 0; i < 5; i++) {
      const req = createJsonRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: { email: 'a@example.com', consent: true },
        headers: { 'x-forwarded-for': '10.88.88.1' },
      });
      await POST(req);
    }

    // IP-B should still be allowed
    const reqB = createJsonRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: { email: 'b@example.com', consent: true },
      headers: { 'x-forwarded-for': '10.88.88.2' },
    });
    const res = await POST(reqB);
    expect(res.status).not.toBe(429);
  });
});

describe('Rate Limiting — Search Endpoint (In-Memory)', () => {
  it('blocks search requests that exceed 30 per minute', async () => {
    const { GET } = await import('../app/api/search/route');

    const makeReq = () =>
      createJsonRequest('http://localhost:3000/api/search?q=test', {
        headers: { 'x-forwarded-for': '10.77.77.1' },
      });

    // Allow 30 requests
    for (let i = 0; i < 30; i++) {
      const res = await GET(makeReq());
      expect(res.status).not.toBe(429);
    }

    // 31st should be blocked
    const blockedRes = await GET(makeReq());
    expect(blockedRes.status).toBe(429);

    const body = await blockedRes.json();
    expect(body.error).toContain('rate limit');
  });

  it('includes public edge Cache-Control headers on successful search responses', async () => {
    const { GET } = await import('../app/api/search/route');

    const req = createJsonRequest('http://localhost:3000/api/search?q=technology', {
      headers: { 'x-forwarded-for': '10.77.77.2' },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const cacheHeader = res.headers.get('Cache-Control');
    expect(cacheHeader).toContain('s-maxage=60');
    expect(cacheHeader).toContain('stale-while-revalidate=300');
  });
});

describe('Security & Rate Limiting — Revalidation Webhook', () => {
  it('rejects unauthorized requests with 401 when secret does not match', async () => {
    const originalSecret = process.env.REVALIDATION_SECRET;
    process.env.REVALIDATION_SECRET = 'valid-revalidate-secret-2026';

    const { POST } = await import('../app/api/revalidate/route');

    const req = createJsonRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '10.66.66.1',
        'X-Revalidate-Secret': 'wrong-guessed-secret',
      },
      body: { slug: 'test-article' },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('Unauthorized');

    process.env.REVALIDATION_SECRET = originalSecret;
  });

  it('accepts revalidation requests when secret matches exactly', async () => {
    const originalSecret = process.env.REVALIDATION_SECRET;
    process.env.REVALIDATION_SECRET = 'valid-revalidate-secret-2026';

    const { POST } = await import('../app/api/revalidate/route');

    const req = createJsonRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '10.66.66.2',
        'X-Revalidate-Secret': 'valid-revalidate-secret-2026',
      },
      body: { slug: 'test-article' },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.revalidated).toBe(true);

    process.env.REVALIDATION_SECRET = originalSecret;
  });
});

