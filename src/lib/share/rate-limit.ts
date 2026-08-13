import { createHash } from 'node:crypto';

const UPSTASH_FIXED_WINDOW_EVAL_SCRIPT = [
  'local requestCount = redis.call("INCR", KEYS[1])',
  'if requestCount == 1 then',
  '  redis.call("EXPIRE", KEYS[1], ARGV[1])',
  'end',
  'return { requestCount, redis.call("TTL", KEYS[1]) }',
].join('\n');

interface RateLimitCheck {
  key: string;
  maxRequests: number;
  windowSeconds: number;
}

interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(request: RateLimitCheck): Promise<RateLimitResult>;
}

interface UpstashRateLimiterOptions {
  url: string | undefined;
  token: string | undefined;
  fetchImpl?: typeof fetch;
}

interface UpstashEvalResponse {
  result?: unknown;
}

export class RateLimiterUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimiterUnavailableError';
  }
}

function requireUpstashUrl(value: string | undefined) {
  if (!value?.trim()) {
    throw new RateLimiterUnavailableError('UPSTASH_REDIS_REST_URL is not configured.');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch {
    throw new RateLimiterUnavailableError('UPSTASH_REDIS_REST_URL is invalid.');
  }

  if (parsedUrl.protocol !== 'https:' || parsedUrl.search || parsedUrl.hash) {
    throw new RateLimiterUnavailableError('UPSTASH_REDIS_REST_URL must be an HTTPS endpoint without a query or hash.');
  }

  return parsedUrl.toString();
}

function requireUpstashToken(value: string | undefined) {
  if (!value?.trim()) {
    throw new RateLimiterUnavailableError('UPSTASH_REDIS_REST_TOKEN is not configured.');
  }

  return value;
}

function validateRateLimitCheck({ key, maxRequests, windowSeconds }: RateLimitCheck) {
  if (!key.trim()) {
    throw new TypeError(`Rate limiter key must be a non-empty string; received ${JSON.stringify(key)}.`);
  }

  if (!Number.isSafeInteger(maxRequests) || maxRequests < 1) {
    throw new RangeError(`Rate limiter maxRequests must be a positive integer; received ${maxRequests}.`);
  }

  if (!Number.isSafeInteger(windowSeconds) || windowSeconds < 1) {
    throw new RangeError(`Rate limiter windowSeconds must be a positive integer; received ${windowSeconds}.`);
  }
}

function getUpstashEvalResult(payload: unknown) {
  const response = payload as UpstashEvalResponse;
  const result = response?.result;

  if (
    !Array.isArray(result) ||
    result.length !== 2 ||
    !Number.isSafeInteger(result[0]) ||
    result[0] < 1 ||
    !Number.isSafeInteger(result[1]) ||
    result[1] < 0
  ) {
    throw new RateLimiterUnavailableError('Upstash rate limiter returned an invalid EVAL response.');
  }

  return { requestCount: result[0], timeToLiveSeconds: result[1] };
}

export class UpstashRateLimiter implements RateLimiter {
  private readonly endpoint: string;
  private readonly token: string;
  private readonly fetchImpl: typeof fetch;

  constructor({ url, token, fetchImpl = fetch }: UpstashRateLimiterOptions) {
    this.endpoint = requireUpstashUrl(url);
    this.token = requireUpstashToken(token);
    this.fetchImpl = fetchImpl;
  }

  async check({ key, maxRequests, windowSeconds }: RateLimitCheck): Promise<RateLimitResult> {
    validateRateLimitCheck({ key, maxRequests, windowSeconds });

    let response: Response;
    try {
      response = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          'EVAL',
          UPSTASH_FIXED_WINDOW_EVAL_SCRIPT,
          1,
          key,
          String(windowSeconds),
        ]),
      });
    } catch {
      throw new RateLimiterUnavailableError('Upstash rate limiter request failed.');
    }

    if (!response.ok) {
      throw new RateLimiterUnavailableError(
        `Upstash rate limiter returned HTTP ${response.status}.`
      );
    }

    let responsePayload: unknown;
    try {
      responsePayload = await response.json();
    } catch {
      throw new RateLimiterUnavailableError('Upstash rate limiter returned invalid JSON.');
    }

    const { requestCount, timeToLiveSeconds } = getUpstashEvalResult(responsePayload);
    const limited = requestCount > maxRequests;

    return {
      limited,
      retryAfterSeconds: limited ? Math.max(timeToLiveSeconds, 1) : 0,
    };
  }
}

export function createUpstashRateLimiter(environment = process.env): RateLimiter {
  return new UpstashRateLimiter({
    url: environment.UPSTASH_REDIS_REST_URL,
    token: environment.UPSTASH_REDIS_REST_TOKEN,
  });
}

export function createRateLimitKey(prefix: string, value: string) {
  const hash = createHash('sha256').update(value).digest('hex').slice(0, 24);
  return `${prefix}:${hash}`;
}
