// @vitest-environment node

import { renderToString } from 'react-dom/server';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';

vi.mock('next/image', async () => {
  const { createElement } = await import('react');
  return {
    default: ({ src, alt, ...imageProps }: { src: string; alt: string }) =>
      createElement('img', { ...imageProps, alt, src }),
  };
});

import { CoatOfArmsMaker } from './CoatOfArmsMaker';

vi.mock('@/components/ui/button', async () => {
  const { createElement, forwardRef } = await import('react');
  const Button = forwardRef<HTMLButtonElement, {
    children?: ReactNode;
    className?: string;
    size?: string;
    variant?: string;
  } & ComponentPropsWithoutRef<'button'>>(function ServerSafeTestButton(
    { children, size: _size, variant: _variant, ...buttonProps },
    ref,
  ) {
    void _size;
    void _variant;
    return createElement('button', { ...buttonProps, ref }, children);
  });

  return { Button };
});

const browserApiNames = ['window', 'document', 'localStorage'] as const;

function renderWithoutBrowserApiAccess() {
  const originalDescriptors = browserApiNames.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const);
  for (const name of browserApiNames) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      get: () => { throw new Error(`Server rendering accessed browser API: ${name}`); },
    });
  }
  try {
    return renderToString(<CoatOfArmsMaker locale="en" />);
  } finally {
    for (const [name, descriptor] of originalDescriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete (globalThis as Record<string, unknown>)[name];
    }
  }
}

describe('CoatOfArmsMaker server render', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
  });

  it('does not read a browser recovery draft during the Node server render', () => {
    const initialServerSnapshot = useCoatProjectStore.getInitialState();
    const readDraft = vi.spyOn(initialServerSnapshot, 'readDraft')
      .mockReturnValue({ ...createDefaultProject('en'), name: 'Draft that must wait' });

    const markup = renderWithoutBrowserApiAccess();

    expect(readDraft).not.toHaveBeenCalled();
    expect(markup).not.toContain('Draft available');
  });

  it('renders the recovery-pending workbench in Node without browser APIs', () => {
    const markup = renderWithoutBrowserApiAccess();

    expect(markup).toContain('coat-workbench-content');
    expect(markup).toContain('inert');
  });

  it('keeps public navigation outside the recovery-pending inert workspace', () => {
    const markup = renderWithoutBrowserApiAccess();

    expect(markup.indexOf('site-topbar')).toBeGreaterThan(-1);
    expect(markup.indexOf('site-topbar')).toBeLessThan(markup.indexOf('coat-workbench-content'));
  });

  it('renders the default project name as non-heading text', () => {
    const markup = renderToString(<CoatOfArmsMaker locale="zh" />);

    expect(markup).not.toContain('<h1');
    expect(markup).toContain('<span class="sr-only">我的徽章</span>');
  });
});
