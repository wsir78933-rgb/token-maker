import { describe, expect, it } from 'vitest';
import { getCloudflareConnectingIp } from './workers-client-ip';

function headers(values: Record<string, string>) {
  return new Headers(values);
}

describe('getCloudflareConnectingIp', () => {
  it('reads a valid IPv4 from CF-Connecting-IP', () => {
    expect(
      getCloudflareConnectingIp(
        headers({
          'CF-Connecting-IP': '203.0.113.10',
        }),
      ),
    ).toBe('203.0.113.10');
  });

  it('reads a valid IPv6 from CF-Connecting-IP', () => {
    expect(
      getCloudflareConnectingIp(
        headers({
          'cf-connecting-ip': '2001:db8::1',
        }),
      ),
    ).toBe('2001:db8::1');
  });

  it('ignores Vercel and other client-IP headers when CF-Connecting-IP is present', () => {
    expect(
      getCloudflareConnectingIp(
        headers({
          'cf-connecting-ip': '203.0.113.1',
          'x-vercel-forwarded-for': '198.51.100.9',
          'true-client-ip': '203.0.113.2',
          'x-real-ip': '203.0.113.3',
          'x-forwarded-for': '203.0.113.4',
        }),
      ),
    ).toBe('203.0.113.1');
  });

  it('ignores the Vercel client IP header when CF-Connecting-IP is absent', () => {
    expect(
      getCloudflareConnectingIp(
        headers({
          'x-vercel-forwarded-for': '203.0.113.10',
        }),
      ),
    ).toBe('anonymous');
  });

  it('falls back to anonymous when CF-Connecting-IP is missing', () => {
    expect(getCloudflareConnectingIp(headers({}))).toBe('anonymous');
  });

  it('falls back to anonymous for an empty CF-Connecting-IP header', () => {
    expect(getCloudflareConnectingIp(headers({ 'cf-connecting-ip': '   ' }))).toBe('anonymous');
  });

  it('falls back to anonymous for an illegal CF-Connecting-IP value', () => {
    expect(
      getCloudflareConnectingIp(headers({ 'cf-connecting-ip': 'unknown, 203.0.113.10' })),
    ).toBe('anonymous');
  });
});
