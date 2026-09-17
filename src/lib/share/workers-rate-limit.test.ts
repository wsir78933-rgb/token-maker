import { describe, expect, it, vi } from 'vitest';
import {
  WorkersRateLimiterUnavailableError,
  checkWorkersShareRateLimit,
} from './workers-rate-limit';

describe('checkWorkersShareRateLimit', () => {
  it('throws a 503-identifiable error when SHARE_RATE_LIMITER is missing', async () => {
    await expect(checkWorkersShareRateLimit(undefined, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message === 'SHARE_RATE_LIMITER binding is missing; received undefined',
    );
  });

  it('throws a 503-identifiable error when SHARE_RATE_LIMITER has no limit function', async () => {
    await expect(checkWorkersShareRateLimit({ limit: 1 }, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message === 'SHARE_RATE_LIMITER binding is invalid; received limit type number',
    );
  });

  it('calls limit({ key }) and allows the request when success is true', async () => {
    const limit = vi.fn(async () => ({ success: true }));

    await expect(checkWorkersShareRateLimit({ limit }, 'share:ip:abc')).resolves.toEqual({
      limited: false,
      retryAfterSeconds: 0,
    });
    expect(limit).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith({ key: 'share:ip:abc' });
  });

  it('maps success=false to limited with Retry-After 60 seconds', async () => {
    const limit = vi.fn(async () => ({ success: false }));

    await expect(checkWorkersShareRateLimit({ limit }, 'share:ip:abc')).resolves.toEqual({
      limited: true,
      retryAfterSeconds: 60,
    });
    expect(limit).toHaveBeenCalledWith({ key: 'share:ip:abc' });
  });

  it('throws a 503-identifiable error when limit() returns a non-boolean success', async () => {
    const limit = vi.fn(async () => ({ success: 'yes' }));

    await expect(checkWorkersShareRateLimit({ limit }, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message
          === 'SHARE_RATE_LIMITER.limit() returned a non-boolean success; received "yes"',
    );
  });

  it('throws a 503-identifiable error when limit() returns a non-object result', async () => {
    const limit = vi.fn(async () => 'ok');

    await expect(checkWorkersShareRateLimit({ limit }, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message
          === 'SHARE_RATE_LIMITER.limit() returned an invalid result; received "ok"',
    );
  });

  it('propagates unknown exceptions from limit() without wrapping them', async () => {
    const unexpected = new Error('workerd exploded');
    const limit = vi.fn(async () => {
      throw unexpected;
    });

    await expect(checkWorkersShareRateLimit({ limit }, 'share:ip:abc')).rejects.toBe(unexpected);
  });

  it('rejects an empty key before calling the binding', async () => {
    const limit = vi.fn(async () => ({ success: true }));

    await expect(checkWorkersShareRateLimit({ limit }, '   ')).rejects.toThrow(
      'Rate limiter key must be a non-empty string; received "   "',
    );
    expect(limit).not.toHaveBeenCalled();
  });
});
