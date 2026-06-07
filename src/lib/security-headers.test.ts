import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';

async function getContentSecurityPolicyHeader() {
  if (typeof nextConfig.headers !== 'function') {
    throw new Error('nextConfig.headers must be a function to define security headers');
  }

  const routeHeaders = await nextConfig.headers();
  const contentSecurityPolicyHeader = routeHeaders
    .flatMap((routeHeader) => routeHeader.headers)
    .find((header) => header.key === 'Content-Security-Policy');

  if (!contentSecurityPolicyHeader) {
    throw new Error('Content-Security-Policy header is missing from nextConfig.headers()');
  }

  return contentSecurityPolicyHeader.value;
}

describe('security headers', () => {
  it('allows production analytics resources that are injected on the live site', async () => {
    const contentSecurityPolicy = await getContentSecurityPolicyHeader();

    expect(contentSecurityPolicy).toContain('https://scripts.clarity.ms');
    expect(contentSecurityPolicy).toContain('https://c.clarity.ms');
    expect(contentSecurityPolicy).toContain('https://static.cloudflareinsights.com');
    expect(contentSecurityPolicy).toContain('https://cloudflareinsights.com');
  });
});
