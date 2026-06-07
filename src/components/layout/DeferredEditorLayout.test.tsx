// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: () => function MockEditorLayout() {
    return <div data-testid="editor-layout" />;
  },
}));

class IdleIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
}

describe('DeferredEditorLayout', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('IntersectionObserver', IdleIntersectionObserver);
    window.history.replaceState(null, '', '/');
  });

  it('keeps the full editor out of the initial homepage render', async () => {
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(screen.getByTestId('deferred-editor-placeholder')).toBeDefined();
    expect(screen.queryByTestId('editor-layout')).toBeNull();
  });

  it('does not preload the full editor while it is still far below the mobile viewport', async () => {
    const observedRootMargins: string[] = [];
    class CapturingIntersectionObserver extends IdleIntersectionObserver {
      constructor(
        _callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        super();
        observedRootMargins.push(String(options?.rootMargin));
      }
    }
    vi.stubGlobal('IntersectionObserver', CapturingIntersectionObserver);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(observedRootMargins).toEqual(['120px 0px']);
  });

  it('loads the editor immediately for direct editor links', async () => {
    window.history.replaceState(null, '', '/#editor-workspace');
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('editor-layout')).toBeDefined();
    });
  });
});
