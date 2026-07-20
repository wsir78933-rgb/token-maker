// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/script', () => ({
  default: ({
    id,
    nonce,
    strategy,
    dangerouslySetInnerHTML,
  }: {
    id: string;
    nonce?: string;
    strategy?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }) => (
    <script
      id={id}
      nonce={nonce}
      data-strategy={strategy}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ),
}));

describe('MicrosoftClarity', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('loads after the page has finished its critical rendering work with the request nonce', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { MicrosoftClarity } = await import('./MicrosoftClarity');

    render(<MicrosoftClarity nonce="request-nonce" />);

    expect(document.querySelector('#microsoft-clarity')?.getAttribute('data-strategy')).toBe('lazyOnload');
    expect(document.querySelector('#microsoft-clarity')?.getAttribute('nonce')).toBe('request-nonce');
  });

  it('rejects an empty nonce instead of emitting a CSP-blocked clarity script', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { MicrosoftClarity } = await import('./MicrosoftClarity');

    expect(() => render(<MicrosoftClarity nonce="" />)).toThrow(
      'MicrosoftClarity requires a non-empty CSP nonce; received value: '
    );
  });
});
