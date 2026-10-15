import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST } from '../app/api/newsletter/route';
import { NextRequest } from 'next/server';

function createJsonRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/newsletter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describe('Newsletter API Route (/api/newsletter)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('rejects bot submission when honeypot field is filled', async () => {
    const req = createJsonRequest({
      email: 'valid@example.com',
      consent: true,
      honeypot: 'spam-bot-input',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid submission detected.');
  });

  it('rejects invalid or missing email', async () => {
    const req = createJsonRequest({
      email: 'not-an-email',
      consent: true,
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toBe('Please enter a valid email address.');
  });

  it('rejects submission when consent is not granted', async () => {
    const req = createJsonRequest({
      email: 'reader@example.com',
      consent: false,
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toContain('You must agree to receive editorial dispatches');
  });

  it('returns success for valid submission when using mock provider in development', async () => {
    process.env.NEWSLETTER_PROVIDER = 'mock';

    const req = createJsonRequest({
      email: 'reader@example.com',
      consent: true,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Thank you for subscribing');
  });

  it('fails closed when provider is missing in production environment', async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    delete process.env.NEWSLETTER_PROVIDER;
    delete process.env.NEWSLETTER_API_KEY;

    const req = createJsonRequest({
      email: 'reader@example.com',
      consent: true,
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toContain('Newsletter subscription service is currently unavailable');
  });
});
