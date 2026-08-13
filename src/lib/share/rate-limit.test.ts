import { describe, expect, it } from 'vitest';
import {
  RateLimiterUnavailableError,
  UpstashRateLimiter,
  createRateLimitKey,
} from './rate-limit';

describe('createRateLimitKey', () => {
  it('hashes raw identifiers before storing them as limiter keys', () => {
    const key = createRateLimitKey('ip', '203.0.113.10');

    expect(key).toMatch(/^ip:[a-f0-9]{24}$/);
    expect(key).not.toContain('203.0.113.10');
  });
});

describe('UpstashRateLimiter', () => {
  it('returns a limited fixed-window result from an atomic EVAL response', async () => {
    const requests: Array<{ url: string; init: RequestInit | undefined }> = [];
    const limiter = new UpstashRateLimiter({
      url: 'https://example.upstash.io',
      token: 'test-token',
      fetchImpl: async (url, init) => {
        requests.push({ url: String(url), init });
        return new Response(JSON.stringify({ result: [21, 37] }), { status: 200 });
      },
    });

    await expect(
      limiter.check({ key: createRateLimitKey('share:ip', '203.0.113.10'), maxRequests: 20, windowSeconds: 60 })
    ).resolves.toEqual({ limited: true, retryAfterSeconds: 37 });

    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe('https://example.upstash.io/');
    expect(requests[0].init).toMatchObject({
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
    expect(JSON.parse(String(requests[0].init?.body))).toEqual([
      'EVAL',
      expect.any(String),
      1,
      createRateLimitKey('share:ip', '203.0.113.10'),
      '60',
    ]);
  });

  it('returns no retry delay when an atomic EVAL response remains within the limit', async () => {
    const limiter = new UpstashRateLimiter({
      url: 'https://example.upstash.io',
      token: 'test-token',
      fetchImpl: async () => new Response(JSON.stringify({ result: [20, 42] }), { status: 200 }),
    });

    await expect(
      limiter.check({ key: 'share:ip:hash', maxRequests: 20, windowSeconds: 60 })
    ).resolves.toEqual({ limited: false, retryAfterSeconds: 0 });
  });

  it('throws a specific unavailable error for missing Upstash configuration', () => {
    expect(
      () =>
        new UpstashRateLimiter({
          url: '',
          token: 'test-token',
        })
    ).toThrowError('UPSTASH_REDIS_REST_URL is not configured.');
  });

  it('throws a specific unavailable error for malformed Upstash EVAL responses', async () => {
    const limiter = new UpstashRateLimiter({
      url: 'https://example.upstash.io',
      token: 'test-token',
      fetchImpl: async () => new Response(JSON.stringify({ result: [1, 'sixty'] }), { status: 200 }),
    });

    await expect(
      limiter.check({ key: 'share:ip:hash', maxRequests: 20, windowSeconds: 60 })
    ).rejects.toBeInstanceOf(RateLimiterUnavailableError);
  });

  it('throws a specific unavailable error when Upstash rejects the EVAL command', async () => {
    const limiter = new UpstashRateLimiter({
      url: 'https://example.upstash.io',
      token: 'test-token',
      fetchImpl: async () => new Response(JSON.stringify({ error: 'NOAUTH Authentication required.' }), { status: 401 }),
    });

    await expect(
      limiter.check({ key: 'share:ip:hash', maxRequests: 20, windowSeconds: 60 })
    ).rejects.toThrowError('Upstash rate limiter returned HTTP 401.');
  });
});
