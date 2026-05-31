import { describe, expect, it } from 'vitest';
import { getClientIp } from './client-ip';

function headers(values: Record<string, string>) {
  return new Headers(values);
}

describe('getClientIp', () => {
  it('prefers Cloudflare client IP headers over proxy headers', () => {
    expect(
      getClientIp(
        headers({
          'cf-connecting-ip': '203.0.113.1',
          'true-client-ip': '203.0.113.2',
          'x-real-ip': '203.0.113.3',
          'x-forwarded-for': '203.0.113.4',
        })
      )
    ).toBe('203.0.113.1');
  });

  it('uses the first valid forwarded IP candidate', () => {
    expect(
      getClientIp(
        headers({
          'x-forwarded-for': 'unknown, 203.0.113.10:443, 203.0.113.11',
        })
      )
    ).toBe('203.0.113.10');
  });

  it('supports bracketed IPv6 candidates', () => {
    expect(getClientIp(headers({ 'x-real-ip': '[2001:db8::1]:443' }))).toBe('2001:db8::1');
  });

  it('falls back to anonymous when no valid client IP is present', () => {
    expect(getClientIp(headers({ 'x-real-ip': 'not-an-ip' }))).toBe('anonymous');
  });
});
