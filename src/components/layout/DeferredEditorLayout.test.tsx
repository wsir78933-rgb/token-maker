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

  it('loads the editor immediately for direct editor links', async () => {
    window.history.replaceState(null, '', '/#editor-workspace');
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('editor-layout')).toBeDefined();
    });
  });
});
