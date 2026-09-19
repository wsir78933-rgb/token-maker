export class WorkersRateLimiterUnavailableError extends Error {
  readonly status = 503 as const;

  constructor(message: string) {
    super(message);
    this.name = 'WorkersRateLimiterUnavailableError';
  }
}

export interface WorkersRateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

const WORKERS_RATE_LIMIT_RETRY_AFTER_SECONDS = 60;

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

function requireRateLimiterBinding(rateLimiter: unknown): {
  limit: (options: { key: string }) => Promise<unknown>;
} {
  if (rateLimiter == null) {
    throw new WorkersRateLimiterUnavailableError(
      `Rate limiter binding is missing; received ${serializeReceivedValue(rateLimiter)}`,
    );
  }

  if (typeof rateLimiter !== 'object') {
    throw new WorkersRateLimiterUnavailableError(
      `Rate limiter binding is invalid; received ${serializeReceivedValue(rateLimiter)}`,
    );
  }

  const limit = Reflect.get(rateLimiter, 'limit');
  if (typeof limit !== 'function') {
    throw new WorkersRateLimiterUnavailableError(
      `Rate limiter binding is invalid; received limit type ${typeof limit}`,
    );
  }

  return rateLimiter as { limit: (options: { key: string }) => Promise<unknown> };
}

export async function checkWorkersRateLimit(
  rateLimiter: unknown,
  key: string,
): Promise<WorkersRateLimitResult> {
  requireNonEmptyRateLimitKey(key);
  const rateLimiterBinding = requireRateLimiterBinding(rateLimiter);
  const outcome = await rateLimiterBinding.limit({ key });

  if (outcome == null || typeof outcome !== 'object') {
    throw new WorkersRateLimiterUnavailableError(
      `Rate limiter limit() returned an invalid result; received ${serializeReceivedValue(outcome)}`,
    );
  }

  const success = Reflect.get(outcome, 'success');
  if (typeof success !== 'boolean') {
    throw new WorkersRateLimiterUnavailableError(
      `Rate limiter limit() returned a non-boolean success; received ${serializeReceivedValue(success)}`,
    );
  }

  if (success) {
    return { limited: false, retryAfterSeconds: 0 };
  }

  return { limited: true, retryAfterSeconds: WORKERS_RATE_LIMIT_RETRY_AFTER_SECONDS };
}

export const checkWorkersShareRateLimit = checkWorkersRateLimit;
export type WorkersShareRateLimitResult = WorkersRateLimitResult;
