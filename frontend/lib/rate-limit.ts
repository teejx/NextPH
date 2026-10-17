import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Rate Limiting — Dual Engine (Upstash Redis · In-Memory Fallback)
// ---------------------------------------------------------------------------
//
// Production:  Uses @upstash/ratelimit with a sliding-window algorithm backed
//              by Upstash Redis. Set UPSTASH_REDIS_REST_URL and
//              UPSTASH_REDIS_REST_TOKEN in your environment.
//
// Development: Falls back to an in-memory sliding-window Map with automatic
//              TTL cleanup so local dev & Vitest work without Redis.
// ---------------------------------------------------------------------------

// ── Types ───────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp (seconds) when the window resets
}

interface RateLimitConfig {
  /** Unique namespace prefix to isolate counters between endpoints */
  prefix: string;
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

// ── IP Extraction ───────────────────────────────────────────────────────────

/**
 * Safely extract the client IP from the request.
 * Checks standard proxy/CDN headers in priority order.
 */
export function getClientIp(req: NextRequest): string {
  // Cloudflare
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  // Vercel / generic reverse proxy
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // Fallback — should not be relied on in production behind a proxy
  return '127.0.0.1';
}

// ── In-Memory Sliding Window (Development Fallback) ─────────────────────────

interface SlidingWindowEntry {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private store = new Map<string, SlidingWindowEntry>();
  private readonly config: RateLimitConfig;

  // Run cleanup every 60 seconds to prevent unbounded memory growth
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Only schedule cleanup in long-lived processes (not in test runners)
    if (typeof globalThis !== 'undefined' && typeof setInterval === 'function') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
      // Prevent the interval from keeping the process alive
      if (this.cleanupInterval && typeof this.cleanupInterval === 'object' && 'unref' in this.cleanupInterval) {
        this.cleanupInterval.unref();
      }
    }
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const key = `${this.config.prefix}:${identifier}`;
    const now = Date.now();
    const windowMs = this.config.windowSeconds * 1000;
    const windowStart = now - windowMs;

    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.store.set(key, entry);
    }

    // Evict timestamps outside the current window
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

    if (entry.timestamps.length >= this.config.limit) {
      // Rate limited — calculate when the oldest request in the window expires
      const oldestInWindow = entry.timestamps[0];
      const resetMs = oldestInWindow + windowMs;

      return {
        success: false,
        limit: this.config.limit,
        remaining: 0,
        reset: Math.ceil(resetMs / 1000),
      };
    }

    // Allow the request
    entry.timestamps.push(now);
    const resetMs = entry.timestamps[0] + windowMs;

    return {
      success: true,
      limit: this.config.limit,
      remaining: this.config.limit - entry.timestamps.length,
      reset: Math.ceil(resetMs / 1000),
    };
  }

  private cleanup() {
    const now = Date.now();
    const windowMs = this.config.windowSeconds * 1000;

    for (const [key, entry] of this.store.entries()) {
      entry.timestamps = entry.timestamps.filter((ts) => ts > now - windowMs);
      if (entry.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

// ── Upstash Redis Rate Limiter (Production) ─────────────────────────────────

let upstashAvailable: boolean | null = null;

async function createUpstashLimiter(config: RateLimitConfig) {
  // Lazy-import to avoid build errors when the env vars are absent
  const { Ratelimit } = await import('@upstash/ratelimit');
  const { Redis } = await import('@upstash/redis');

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  return new Ratelimit({
    redis,
    prefix: config.prefix,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSeconds} s`),
    analytics: true,
  });
}

// ── Factory: Create a Rate Limiter for a Given Config ───────────────────────

function createRateLimiter(config: RateLimitConfig) {
  // Cache for the Upstash instance (lazily initialised on first call)
  let upstashInstance: Awaited<ReturnType<typeof createUpstashLimiter>> | null = null;

  // In-memory fallback is always ready
  const memoryLimiter = new InMemoryRateLimiter(config);

  return async function rateLimitCheck(identifier: string): Promise<RateLimitResult> {
    // Determine availability once
    if (upstashAvailable === null) {
      upstashAvailable = Boolean(
        process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      );
    }

    // ── Production: Upstash Redis ───────────────────────────────────────
    if (upstashAvailable) {
      try {
        if (!upstashInstance) {
          upstashInstance = await createUpstashLimiter(config);
        }

        const result = await upstashInstance.limit(identifier);

        return {
          success: result.success,
          limit: result.limit,
          remaining: result.remaining,
          reset: Math.ceil(result.reset / 1000),
        };
      } catch (error) {
        // If Redis is temporarily unreachable, fail open (allow the request)
        // but log the error for observability
        console.error(`[Rate Limit] Upstash error for ${config.prefix}:`, error);
        return {
          success: true,
          limit: config.limit,
          remaining: config.limit,
          reset: Math.ceil(Date.now() / 1000) + config.windowSeconds,
        };
      }
    }

    // ── Development: In-Memory ──────────────────────────────────────────
    return memoryLimiter.check(identifier);
  };
}

// ── Preset Rate Limiters ────────────────────────────────────────────────────

/** Newsletter subscription — 5 requests per 10 minutes per IP */
export const newsletterRateLimit = createRateLimiter({
  prefix: 'rl:newsletter',
  limit: 5,
  windowSeconds: 600,
});

/** Search queries — 30 requests per 1 minute per IP */
export const searchRateLimit = createRateLimiter({
  prefix: 'rl:search',
  limit: 30,
  windowSeconds: 60,
});

/** Revalidation webhook — 10 requests per 1 minute per IP */
export const revalidateRateLimit = createRateLimiter({
  prefix: 'rl:revalidate',
  limit: 10,
  windowSeconds: 60,
});

/** Contact form — 3 requests per 15 minutes per IP */
export const contactRateLimit = createRateLimiter({
  prefix: 'rl:contact',
  limit: 3,
  windowSeconds: 900,
});

// ── Response Helper ─────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';

/**
 * Returns a standardised 429 Too Many Requests response with rate-limit
 * headers and a human-readable JSON body.
 */
export function rateLimitResponse(result: RateLimitResult, message?: string): NextResponse {
  const retryAfter = Math.max(0, result.reset - Math.ceil(Date.now() / 1000));

  return NextResponse.json(
    {
      error: message || 'Too many requests. Please wait before trying again.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  );
}
