// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
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
    <script id={id} data-script-nonce={nonce} data-src={src}>
      {children}
    </script>
  ),
}));

describe('GoogleAnalytics', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('renders both executable analytics scripts without a request nonce', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');

    const { container } = render(<GoogleAnalytics />);

    expect(container.querySelector('script[data-src*="googletagmanager.com"]')?.getAttribute('nonce')).toBeNull();
    expect(container.querySelector('script[data-src*="googletagmanager.com"]')?.getAttribute('data-script-nonce')).toBeNull();
    expect(container.querySelector('#google-analytics')?.getAttribute('nonce')).toBeNull();
    expect(container.querySelector('#google-analytics')?.getAttribute('data-script-nonce')).toBeNull();
  });

  it('applies a request nonce to both executable analytics scripts', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');

    const { container } = render(<GoogleAnalytics nonce="coat-maker-nonce" />);

    expect(
      container.querySelector('script[data-src*="googletagmanager.com"]')?.getAttribute('data-script-nonce')
    ).toBe('coat-maker-nonce');
    expect(container.querySelector('#google-analytics')?.getAttribute('data-script-nonce')).toBe(
      'coat-maker-nonce'
    );
  });

  it('fails fast when a request nonce is empty', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');

    expect(() => render(<GoogleAnalytics nonce="" />)).toThrow(
      'GoogleAnalytics requires a non-empty CSP nonce; received value: '
    );
  });
});
