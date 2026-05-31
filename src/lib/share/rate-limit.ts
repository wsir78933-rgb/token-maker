import { createHash } from 'node:crypto';

interface MemoryRateLimiterOptions {
  cleanupIntervalMs: number;
  maxBuckets: number;
  maxRequests: number;
  windowMs: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export function createRateLimitKey(prefix: string, value: string) {
  const hash = createHash('sha256').update(value).digest('hex').slice(0, 24);
  return `${prefix}:${hash}`;
}

export class MemoryRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();
  private lastCleanupAt = 0;

  constructor(private readonly options: MemoryRateLimiterOptions) {}

  isLimited(key: string, now = Date.now()) {
    this.cleanup(now);

    const bucket = this.buckets.get(key);
    if (bucket && bucket.resetAt > now && bucket.count >= this.options.maxRequests) {
      return true;
    }

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.options.windowMs });
      return false;
    }

    bucket.count += 1;
    return false;
  }

  private cleanup(now: number) {
    if (
      this.buckets.size < this.options.maxBuckets &&
      now - this.lastCleanupAt < this.options.cleanupIntervalMs
    ) {
      return;
    }

    this.lastCleanupAt = now;
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }

    if (this.buckets.size <= this.options.maxBuckets) return;

    const staleKeys = Array.from(this.buckets.entries())
      .sort(([, a], [, b]) => a.resetAt - b.resetAt)
      .slice(0, this.buckets.size - this.options.maxBuckets)
      .map(([key]) => key);

    staleKeys.forEach((key) => this.buckets.delete(key));
  }
}
