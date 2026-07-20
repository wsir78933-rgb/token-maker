// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/script', () => ({
  default: ({
    children,
    id,
    nonce,
    src,
  }: {
    children?: string;
    id?: string;
    nonce?: string;
    src?: string;
  }) => (
    <script id={id} nonce={nonce} data-src={src}>
      {children}
    </script>
  ),
}));

describe('GoogleAnalytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('attaches the request nonce to both executable analytics scripts', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');

    render(<GoogleAnalytics nonce="request-nonce" />);

    expect(document.querySelector('script[data-src*="googletagmanager.com"]')?.getAttribute('nonce')).toBe(
      'request-nonce'
    );
    expect(document.querySelector('#google-analytics')?.getAttribute('nonce')).toBe('request-nonce');
  });

  it('rejects an empty nonce instead of emitting CSP-blocked analytics scripts', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');

    expect(() => render(<GoogleAnalytics nonce="" />)).toThrow(
      'GoogleAnalytics requires a non-empty CSP nonce; received value: '
    );
  });
});
