import { describe, expect, it, vi } from 'vitest';
import {
  WorkersRateLimiterUnavailableError,
  checkWorkersRateLimit,
} from './workers-rate-limit';

describe('checkWorkersRateLimit', () => {
  it('throws a 503-identifiable error when the binding is missing', async () => {
    await expect(checkWorkersRateLimit(undefined, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message === 'Rate limiter binding is missing; received undefined',
    );
  });

  it('throws a 503-identifiable error when the binding has no limit function', async () => {
    await expect(checkWorkersRateLimit({ limit: 1 }, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message === 'Rate limiter binding is invalid; received limit type number',
    );
  });

  it('calls limit({ key }) and allows the request when success is true', async () => {
    const limit = vi.fn(async () => ({ success: true }));

    await expect(checkWorkersRateLimit({ limit }, 'share:ip:abc')).resolves.toEqual({
      limited: false,
      retryAfterSeconds: 0,
    });
    expect(limit).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith({ key: 'share:ip:abc' });
  });

  it('maps success=false to limited with Retry-After 60 seconds', async () => {
    const limit = vi.fn(async () => ({ success: false }));

    await expect(checkWorkersRateLimit({ limit }, 'share:ip:abc')).resolves.toEqual({
      limited: true,
      retryAfterSeconds: 60,
    });
    expect(limit).toHaveBeenCalledWith({ key: 'share:ip:abc' });
  });

  it('throws a 503-identifiable error when limit() returns a non-boolean success', async () => {
    const limit = vi.fn(async () => ({ success: 'yes' }));

    await expect(checkWorkersRateLimit({ limit }, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message
          === 'Rate limiter limit() returned a non-boolean success; received "yes"',
    );
  });

  it('throws a 503-identifiable error when limit() returns a non-object result', async () => {
    const limit = vi.fn(async () => 'ok');

    await expect(checkWorkersRateLimit({ limit }, 'share:ip:abc')).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersRateLimiterUnavailableError
        && error.status === 503
        && error.message
          === 'Rate limiter limit() returned an invalid result; received "ok"',
    );
  });

  it('propagates unknown exceptions from limit() without wrapping them', async () => {
    const unexpected = new Error('workerd exploded');
    const limit = vi.fn(async () => {
      throw unexpected;
    });

    await expect(checkWorkersRateLimit({ limit }, 'share:ip:abc')).rejects.toBe(unexpected);
  });

  it('rejects an empty key before calling the binding', async () => {
    const limit = vi.fn(async () => ({ success: true }));

    await expect(checkWorkersRateLimit({ limit }, '   ')).rejects.toThrow(
      'Rate limiter key must be a non-empty string; received "   "',
    );
    expect(limit).not.toHaveBeenCalled();
  });
});
