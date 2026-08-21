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

  it('loads after the page has finished its critical rendering work without a request nonce', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { MicrosoftClarity } = await import('./MicrosoftClarity');

    render(<MicrosoftClarity />);

    expect(document.querySelector('#microsoft-clarity')?.getAttribute('data-strategy')).toBe('lazyOnload');
    expect(document.querySelector('#microsoft-clarity')?.getAttribute('nonce')).toBeNull();
  });
});
