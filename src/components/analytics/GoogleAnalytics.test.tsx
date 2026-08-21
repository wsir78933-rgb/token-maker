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

  it('renders both executable analytics scripts without a request nonce', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');

    render(<GoogleAnalytics />);

    expect(document.querySelector('script[data-src*="googletagmanager.com"]')?.getAttribute('nonce')).toBeNull();
    expect(document.querySelector('#google-analytics')?.getAttribute('nonce')).toBeNull();
  });
});
