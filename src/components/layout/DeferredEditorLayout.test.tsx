// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: () => function MockEditorLayout() {
    return <div data-testid="editor-layout" />;
  },
}));

const intersectionObserverInstances: TrackingIntersectionObserver[] = [];
const observedRootMargins: string[] = [];
const viewportMediaQueryChangeListeners = new Set<(event: MediaQueryListEvent) => void>();
let isDesktopViewport = true;

class TrackingIntersectionObserver {
  private readonly callback: IntersectionObserverCallback;
  private isObserving = false;

  observe = vi.fn(() => {
    this.isObserving = true;
  });

  disconnect = vi.fn(() => {
    this.isObserving = false;
  });

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    intersectionObserverInstances.push(this);
    observedRootMargins.push(String(options?.rootMargin));
  }

  triggerIntersection(isIntersecting: boolean) {
    if (!this.isObserving) return;

    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function installViewportMatchMedia(isDesktop: boolean) {
  isDesktopViewport = isDesktop;
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => {
      return {
        get matches() {
          return media === '(min-width: 1280px)' && isDesktopViewport;
        },
        media,
        onchange: null,
        addEventListener: (
          eventName: string,
          listener: EventListenerOrEventListenerObject | null,
        ) => {
          if (eventName === 'change' && typeof listener === 'function') {
            viewportMediaQueryChangeListeners.add(listener as (event: MediaQueryListEvent) => void);
          }
        },
        removeEventListener: (
          eventName: string,
          listener: EventListenerOrEventListenerObject | null,
        ) => {
          if (eventName === 'change' && typeof listener === 'function') {
            viewportMediaQueryChangeListeners.delete(listener as (event: MediaQueryListEvent) => void);
          }
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  );
}

function changeViewport(isDesktop: boolean) {
  isDesktopViewport = isDesktop;
  const event = {
    matches: isDesktop,
    media: '(min-width: 1280px)',
  } as MediaQueryListEvent;

  viewportMediaQueryChangeListeners.forEach((listener) => listener(event));
}

describe('DeferredEditorLayout', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.resetModules();
    intersectionObserverInstances.length = 0;
    observedRootMargins.length = 0;
    viewportMediaQueryChangeListeners.clear();
    vi.stubGlobal('IntersectionObserver', TrackingIntersectionObserver);
    installViewportMatchMedia(true);
    window.history.replaceState(null, '', '/');
  });

  it('keeps the full editor out of the initial homepage render', async () => {
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(screen.getByTestId('deferred-editor-placeholder')).toBeDefined();
    expect(screen.queryByTestId('editor-layout')).toBeNull();
  });

  it('does not observe or mount the editor after passive mobile scrolling', async () => {
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();
    expect(intersectionObserverInstances).toHaveLength(0);
    expect(screen.queryByTestId('editor-layout')).toBeNull();
  });

  it('does not create a desktop observer while hydrating a mobile server render', async () => {
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');
    const container = document.createElement('div');
    container.innerHTML = renderToString(<DeferredEditorLayout />);
    document.body.append(container);

    let hydratedRoot: ReturnType<typeof hydrateRoot> | null = null;
    try {
      hydratedRoot = await act(async () => {
        const root = hydrateRoot(container, <DeferredEditorLayout />);
        await Promise.resolve();
        return root;
      });

      expect(intersectionObserverInstances).toHaveLength(0);
      expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();
    } finally {
      const rootToUnmount = hydratedRoot;
      if (rootToUnmount !== null) {
        await act(async () => {
          rootToUnmount.unmount();
        });
      }
      container.remove();
    }
  });

  it('keeps the desktop near-viewport preload contract', async () => {
    installViewportMatchMedia(true);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(observedRootMargins).toEqual(['120px 0px']);
  });

  it('switches observer ownership when the viewport crosses the desktop breakpoint', async () => {
    installViewportMatchMedia(true);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    const firstDesktopObserver = intersectionObserverInstances[0];
    expect(firstDesktopObserver).toBeDefined();

    act(() => {
      changeViewport(false);
    });

    expect(firstDesktopObserver.disconnect).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();

    firstDesktopObserver.triggerIntersection(true);
    expect(screen.queryByTestId('editor-layout')).toBeNull();

    act(() => {
      changeViewport(true);
    });

    expect(screen.queryByTestId('mobile-editor-launch')).toBeNull();
    expect(intersectionObserverInstances).toHaveLength(2);
    expect(observedRootMargins).toEqual(['120px 0px', '120px 0px']);
  });

  it('loads the editor after a mobile same-document editor hash navigation', async () => {
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();
    expect(screen.queryByTestId('editor-layout')).toBeNull();

    act(() => {
      window.location.hash = '#editor-workspace';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('editor-layout')).toBeDefined();
    });
    expect(screen.queryByTestId('mobile-editor-launch')).toBeNull();
  });

  it('does not load the editor for a non-editor hashchange after search is added later', async () => {
    vi.useFakeTimers();
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();

    act(() => {
      window.history.replaceState(null, '', '/?preset=rogue');
      window.location.hash = '#details';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId('editor-layout')).toBeNull();
    expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();
  });

  it('loads the editor for cold direct editor links', async () => {
    window.history.replaceState(null, '', '/#editor-workspace');
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('editor-layout')).toBeDefined();
    });
  });

  it.each(['preset', 'mask', 'border', 'borderTint', 'size'])(
    'loads the editor for a direct %s search parameter link on mobile',
    async (searchParamName) => {
      window.history.replaceState(null, '', `/?${searchParamName}=value`);
      installViewportMatchMedia(false);
      const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

      render(<DeferredEditorLayout />);

      await waitFor(() => {
        expect(screen.getByTestId('editor-layout')).toBeDefined();
      });
    },
  );

  it('shows mobile launch feedback before mounting the editor', async () => {
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    render(<DeferredEditorLayout />);

    fireEvent.click(screen.getByTestId('mobile-editor-launch'));

    expect(screen.getByTestId('mobile-editor-launch').textContent).toBe('Opening editor...');
    expect(screen.queryByTestId('editor-layout')).toBeNull();

    await waitFor(() => {
      expect(screen.getByTestId('editor-layout')).toBeDefined();
    });
  });

  it('cancels the mobile launch timer when unmounted', async () => {
    vi.useFakeTimers();
    installViewportMatchMedia(false);
    const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

    const { unmount } = render(<DeferredEditorLayout />);

    fireEvent.click(screen.getByTestId('mobile-editor-launch'));
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
