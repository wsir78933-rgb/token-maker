// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
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
      data-script-nonce={nonce}
      data-strategy={strategy}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ),
}));

describe('MicrosoftClarity', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('loads after the page has finished its critical rendering work without a request nonce', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { MicrosoftClarity } = await import('./MicrosoftClarity');

    const { container } = render(<MicrosoftClarity />);

    expect(container.querySelector('#microsoft-clarity')?.getAttribute('data-strategy')).toBe('lazyOnload');
    expect(container.querySelector('#microsoft-clarity')?.getAttribute('nonce')).toBeNull();
    expect(container.querySelector('#microsoft-clarity')?.getAttribute('data-script-nonce')).toBeNull();
  });

  it('applies a request nonce to the Clarity loader script', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { MicrosoftClarity } = await import('./MicrosoftClarity');

    const { container } = render(<MicrosoftClarity nonce="coat-maker-nonce" />);

    expect(container.querySelector('#microsoft-clarity')?.getAttribute('data-script-nonce')).toBe(
      'coat-maker-nonce'
    );
  });

  it('fails fast when a request nonce is empty', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { MicrosoftClarity } = await import('./MicrosoftClarity');

    expect(() => render(<MicrosoftClarity nonce="" />)).toThrow(
      'MicrosoftClarity requires a non-empty CSP nonce; received value: '
    );
  });
});
