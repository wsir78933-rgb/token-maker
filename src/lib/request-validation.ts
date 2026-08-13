export type RequestValidationErrorCode =
  | 'invalid_content_type'
  | 'invalid_origin'
  | 'body_too_large';

export type RequestBodyReadResult =
  | { ok: true; value: Uint8Array }
  | { ok: false; error: 'body_too_large' };

interface RequestWithNextUrl {
  headers: Headers;
  nextUrl: Pick<URL, 'origin'>;
}

interface RequestWithReadableBody {
  headers: Headers;
  body: ReadableStream<Uint8Array> | null;
}

const JSON_CONTENT_TYPE_PATTERN = /^application\/json(?:\s*;\s*charset\s*=\s*(?:[A-Za-z0-9!#$&^_.+-]+|"(?:[^"\\]|\\.)*"))?\s*$/i;

function getDeclaredContentLength(headers: Headers) {
  const value = headers.get('content-length');
  if (!value || !/^\d+$/.test(value)) return null;

  const length = Number(value);
  return Number.isSafeInteger(length) ? length : null;
}

function validateMaximumBodyBytes(maxBytes: number) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError(`Maximum request body bytes must be a non-negative integer; received ${maxBytes}.`);
  }
}

export function getJsonContentTypeError(headers: Headers): Extract<
  RequestValidationErrorCode,
  'invalid_content_type'
> | null {
  const contentType = headers.get('content-type');
  return contentType && JSON_CONTENT_TYPE_PATTERN.test(contentType)
    ? null
    : 'invalid_content_type';
}

export function getSameOriginError({
  headers,
  nextUrl,
}: RequestWithNextUrl): Extract<RequestValidationErrorCode, 'invalid_origin'> | null {
  return headers.get('origin') === nextUrl.origin ? null : 'invalid_origin';
}

export async function readRequestBodyWithinLimit(
  request: RequestWithReadableBody,
  maxBytes: number
): Promise<RequestBodyReadResult> {
  validateMaximumBodyBytes(maxBytes);

  const declaredContentLength = getDeclaredContentLength(request.headers);
  if (declaredContentLength !== null && declaredContentLength > maxBytes) {
    return { ok: false, error: 'body_too_large' };
  }

  if (!request.body) {
    return { ok: true, value: new Uint8Array() };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, error: 'body_too_large' };
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const value = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    value.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, value };
}
