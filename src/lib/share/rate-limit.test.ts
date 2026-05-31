import { describe, expect, it } from 'vitest';
import { MemoryRateLimiter, createRateLimitKey } from './rate-limit';

describe('MemoryRateLimiter', () => {
  it('allows the configured request count and limits the next request', () => {
    const limiter = new MemoryRateLimiter({
      maxRequests: 2,
      windowMs: 60_000,
      maxBuckets: 100,
      cleanupIntervalMs: 60_000,
    });

    expect(limiter.isLimited('ip:test', 1_000)).toBe(false);
    expect(limiter.isLimited('ip:test', 2_000)).toBe(false);
    expect(limiter.isLimited('ip:test', 3_000)).toBe(true);
  });

  it('resets the bucket after the window expires', () => {
    const limiter = new MemoryRateLimiter({
      maxRequests: 1,
      windowMs: 60_000,
      maxBuckets: 100,
      cleanupIntervalMs: 60_000,
    });

    expect(limiter.isLimited('ip:test', 1_000)).toBe(false);
    expect(limiter.isLimited('ip:test', 2_000)).toBe(true);
    expect(limiter.isLimited('ip:test', 61_001)).toBe(false);
  });
});

describe('createRateLimitKey', () => {
  it('hashes raw identifiers before storing them as limiter keys', () => {
    const key = createRateLimitKey('ip', '203.0.113.10');

    expect(key).toMatch(/^ip:[a-f0-9]{24}$/);
    expect(key).not.toContain('203.0.113.10');
  });
});
