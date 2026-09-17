export class WorkersRateLimiterUnavailableError extends Error {
  readonly status = 503 as const;

  constructor(message: string) {
    super(message);
    this.name = 'WorkersRateLimiterUnavailableError';
  }
}

export interface WorkersShareRateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

const SHARE_RATE_LIMIT_RETRY_AFTER_SECONDS = 60;

function serializeReceivedValue(value: unknown) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return JSON.stringify(value);
  }
  if (value === undefined) return 'undefined';
  return String(value);
}

function requireNonEmptyRateLimitKey(key: string) {
  if (!key.trim()) {
    throw new TypeError(`Rate limiter key must be a non-empty string; received ${JSON.stringify(key)}`);
  }
}

function requireShareRateLimiterBinding(shareRateLimiter: unknown): {
  limit: (options: { key: string }) => Promise<unknown>;
} {
  if (shareRateLimiter == null) {
    throw new WorkersRateLimiterUnavailableError(
      `SHARE_RATE_LIMITER binding is missing; received ${String(shareRateLimiter)}`,
    );
  }

  if (typeof shareRateLimiter !== 'object') {
    throw new WorkersRateLimiterUnavailableError(
      `SHARE_RATE_LIMITER binding is invalid; received ${serializeReceivedValue(shareRateLimiter)}`,
    );
  }

  const limit = Reflect.get(shareRateLimiter, 'limit');
  if (typeof limit !== 'function') {
    throw new WorkersRateLimiterUnavailableError(
      `SHARE_RATE_LIMITER binding is invalid; received limit type ${typeof limit}`,
    );
  }

  return shareRateLimiter as { limit: (options: { key: string }) => Promise<unknown> };
}

export async function checkWorkersShareRateLimit(
  shareRateLimiter: unknown,
  key: string,
): Promise<WorkersShareRateLimitResult> {
  requireNonEmptyRateLimitKey(key);
  const shareRateLimiterBinding = requireShareRateLimiterBinding(shareRateLimiter);
  const outcome = await shareRateLimiterBinding.limit({ key });

  if (outcome == null || typeof outcome !== 'object') {
    throw new WorkersRateLimiterUnavailableError(
      `SHARE_RATE_LIMITER.limit() returned an invalid result; received ${serializeReceivedValue(outcome)}`,
    );
  }

  const success = Reflect.get(outcome, 'success');
  if (typeof success !== 'boolean') {
    throw new WorkersRateLimiterUnavailableError(
      `SHARE_RATE_LIMITER.limit() returned a non-boolean success; received ${serializeReceivedValue(success)}`,
    );
  }

  if (success) {
    return { limited: false, retryAfterSeconds: 0 };
  }

  return { limited: true, retryAfterSeconds: SHARE_RATE_LIMIT_RETRY_AFTER_SECONDS };
}
