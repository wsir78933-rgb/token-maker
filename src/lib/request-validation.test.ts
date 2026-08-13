import { describe, expect, it } from 'vitest';
import {
  getJsonContentTypeError,
  getSameOriginError,
  readRequestBodyWithinLimit,
} from './request-validation';

describe('getJsonContentTypeError', () => {
  it('accepts application JSON with an optional charset', () => {
    expect(getJsonContentTypeError(new Headers({ 'content-type': 'application/json' }))).toBeNull();
    expect(
      getJsonContentTypeError(new Headers({ 'content-type': 'application/json; charset=utf-8' }))
    ).toBeNull();
  });

  it('returns an explicit error code for a non-JSON media type', () => {
    expect(getJsonContentTypeError(new Headers({ 'content-type': 'text/plain' }))).toBe(
      'invalid_content_type'
    );
  });

  it('returns an explicit error code for unsupported JSON parameters', () => {
    expect(
      getJsonContentTypeError(new Headers({ 'content-type': 'application/json; profile=public' }))
    ).toBe('invalid_content_type');
  });
});

describe('getSameOriginError', () => {
  it('accepts an Origin that exactly matches the request origin', () => {
    expect(
      getSameOriginError({
        headers: new Headers({ Origin: 'https://www.tokenmaker.one' }),
        nextUrl: new URL('https://www.tokenmaker.one/api/share'),
      })
    ).toBeNull();
  });

  it('returns an explicit error code when Origin differs by scheme or host', () => {
    expect(
      getSameOriginError({
        headers: new Headers({ Origin: 'http://www.tokenmaker.one' }),
        nextUrl: new URL('https://www.tokenmaker.one/api/share'),
      })
    ).toBe('invalid_origin');
  });
});

describe('readRequestBodyWithinLimit', () => {
  it('returns an explicit body error before accessing a declared oversized stream', async () => {
    const request = {
      headers: new Headers({ 'content-length': '4' }),
      get body(): ReadableStream<Uint8Array> {
        throw new Error('The body stream must not be accessed when Content-Length exceeds the limit.');
      },
    };

    await expect(readRequestBodyWithinLimit(request, 3)).resolves.toEqual({
      ok: false,
      error: 'body_too_large',
    });
  });

  it('returns an explicit body error after streamed chunks exceed the limit', async () => {
    const streamRequestInit: RequestInit & { duplex: 'half' } = {
      method: 'POST',
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('abc'));
          controller.enqueue(new TextEncoder().encode('d'));
          controller.close();
        },
      }),
      duplex: 'half',
    };
    const request = new Request('https://www.tokenmaker.one/api/contact', {
      ...streamRequestInit,
    });

    await expect(readRequestBodyWithinLimit(request, 3)).resolves.toEqual({
      ok: false,
      error: 'body_too_large',
    });
  });

  it('returns the complete byte sequence within the configured limit', async () => {
    const request = new Request('https://www.tokenmaker.one/api/contact', {
      method: 'POST',
      body: '{"name":"Ada"}',
    });

    await expect(readRequestBodyWithinLimit(request, 32)).resolves.toEqual({
      ok: true,
      value: new TextEncoder().encode('{"name":"Ada"}'),
    });
  });
});
