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

function getContentSecurityPolicyDirective(contentSecurityPolicy: string, directiveName: string) {
  const directive = contentSecurityPolicy
    .split('; ')
    .find((contentSecurityPolicyDirective) => contentSecurityPolicyDirective.startsWith(`${directiveName} `));

  if (!directive) {
    throw new Error(`Content-Security-Policy directive is missing: ${directiveName}`);
  }

  return directive;
}

describe('security headers', () => {
  it('allows production analytics resources that are injected on the live site', async () => {
    const contentSecurityPolicy = await getContentSecurityPolicyHeader();
    const connectSrc = getContentSecurityPolicyDirective(contentSecurityPolicy, 'connect-src');

    expect(contentSecurityPolicy).toContain('https://scripts.clarity.ms');
    expect(contentSecurityPolicy).toContain('https://c.clarity.ms');
    expect(contentSecurityPolicy).toContain('https://static.cloudflareinsights.com');
    expect(connectSrc).toContain('https://www.google-analytics.com');
    expect(connectSrc).toContain('https://www.googletagmanager.com');
    expect(connectSrc).toContain('https://cloudflareinsights.com');
    expect(connectSrc).toContain('https://*.clarity.ms');
  });

  it('allows YouTube thumbnail images for lite video embeds', async () => {
    const contentSecurityPolicy = await getContentSecurityPolicyHeader();
    const imgSrc = getContentSecurityPolicyDirective(contentSecurityPolicy, 'img-src');

    expect(imgSrc).toContain('https://i.ytimg.com');
  });
});
