import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

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
});
