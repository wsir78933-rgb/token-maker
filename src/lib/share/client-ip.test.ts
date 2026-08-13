import { describe, expect, it } from 'vitest';
import { getClientIp } from './client-ip';

function headers(values: Record<string, string>) {
  return new Headers(values);
}

describe('getClientIp', () => {
  it('uses the Vercel client IP header and normalizes an IPv4 port', () => {
    expect(
      getClientIp(
        headers({
          'x-vercel-forwarded-for': '203.0.113.10:443',
        })
      )
    ).toBe('203.0.113.10');
  });

  it('normalizes a bracketed IPv6 port from the Vercel header', () => {
    expect(
      getClientIp(
        headers({
          'x-vercel-forwarded-for': '[2001:db8::1]:443',
        })
      )
    ).toBe('2001:db8::1');
  });

  it('ignores untrusted client-IP headers when the Vercel header is absent', () => {
    expect(
      getClientIp(
        headers({
          'cf-connecting-ip': '203.0.113.1',
          'true-client-ip': '203.0.113.2',
          'x-real-ip': '203.0.113.3',
          'x-forwarded-for': '203.0.113.4',
        })
      )
    ).toBe('anonymous');
  });

  it('falls back to anonymous for a malformed Vercel client IP header', () => {
    expect(getClientIp(headers({ 'x-vercel-forwarded-for': 'unknown, 203.0.113.10' }))).toBe(
      'anonymous'
    );
  });
});
