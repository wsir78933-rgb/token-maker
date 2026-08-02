// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';
import { renderToken } from '@/lib/renderer/pipeline';

const i18nMockState = vi.hoisted(() => ({
  locale: 'en' as 'en' | 'zh',
  messages: {} as Record<string, string>,
}));

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => i18nMockState.messages[key] ?? key,
    locale: i18nMockState.locale,
  }),
}));

vi.mock('@/lib/renderer/pipeline', () => ({
  renderToken: vi.fn(),
  drawCheckerboard: vi.fn(),
}));

vi.mock('./TextCanvasOverlay', () => ({
  TextCanvasOverlay: () => <div data-testid="text-overlay" />,
}));

vi.mock('./ImageUploader', () => ({
  ImageUploader: () => <div data-testid="image-uploader" />,
}));

const resizeObserverInstances: MockResizeObserver[] = [];
const viewportMediaQueryChangeListeners = new Set<(event: MediaQueryListEvent) => void>();
let isDesktopViewport = true;

class MockResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObserverInstances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  triggerWidth(width: number) {
    this.callback(
      [{ contentRect: { width } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
}

function installViewportMatchMedia(isDesktop: boolean) {
  isDesktopViewport = isDesktop;
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((media: string) => ({
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
    })),
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

import { Canvas } from './Canvas';

const renderTokenMock = vi.mocked(renderToken);

function resetStore() {
  useEditorStore.getState().resetAll();
}

function dispatchWheelEvent(
  targetElement: Element,
  deltaY: number,
  deltaMode: number = WheelEvent.DOM_DELTA_PIXEL,
) {
  const wheelEvent = new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    deltaY,
    deltaMode,
  });
  let wasNotPrevented = true;
  act(() => {
    wasNotPrevented = targetElement.dispatchEvent(wheelEvent);
  });

  return { wheelEvent, wasNotPrevented };
}

describe('Canvas', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    i18nMockState.locale = 'en';
    i18nMockState.messages = {};
    resizeObserverInstances.length = 0;
    viewportMediaQueryChangeListeners.clear();
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    installViewportMatchMedia(true);
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 3,
    });
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      clip: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      scale: vi.fn(),
      translate: vi.fn(),
      setTransform: vi.fn(),
      globalCompositeOperation: 'source-over',
      fillStyle: '',
      canvas: { width: 512, height: 512 },
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    localStorageMock = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    };
    vi.stubGlobal('localStorage', localStorageMock);
    renderTokenMock.mockClear();
    resetStore();
  });

  afterEach(() => {
    cleanup();
    resetStore();
    vi.unstubAllGlobals();
  });

  it('shows ImageUploader when no image is loaded', () => {
    render(<Canvas />);
    expect(screen.getByTestId('image-uploader')).toBeDefined();
  });

  it('shows canvas and text overlay when image is loaded', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas />);
    expect(screen.queryByTestId('image-uploader')).toBeNull();
    expect(screen.getAllByTestId('text-overlay').length).toBeGreaterThan(0);
  });

  it('displays current scale percentage', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1.5 });

    render(<Canvas />);
    expect(screen.getAllByText('150%').length).toBeGreaterThan(0);
  });

  it('uses the localized image scale label in the canvas overlay', () => {
    i18nMockState.locale = 'zh';
    i18nMockState.messages = { imageScale: '缩放' };
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1.5 });

    render(<Canvas />);

    expect(screen.getByText('缩放')).toBeDefined();
    expect(screen.queryByText('Scale')).toBeNull();
  });

  it('keeps editable text out of the base preview canvas render state', () => {
    const img = new Image();
    useEditorStore.setState({
      imageUrl: 'blob:test',
      imageElement: img,
      textBoxes: [
        {
          id: 'txt-1',
          content: 'Hero',
          x: 256,
          y: 256,
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
        },
      ],
    });

    render(<Canvas />);

    const previewRenderState = renderTokenMock.mock.calls.at(-1)?.[1];
    expect(previewRenderState?.textBoxes).toEqual([]);
  });

  it('passes the reduced border inset ratio to the batch preview renderer', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas previewMode="batch" />);

    expect(renderTokenMock.mock.calls.at(-1)?.[3]).toEqual(
      expect.objectContaining({ borderInsetRatio: 0.008 }),
    );
  });

  it('leaves the renderer border inset ratio unset in the default preview', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas />);

    expect(renderTokenMock.mock.calls.at(-1)?.[3]).not.toHaveProperty('borderInsetRatio');
  });

  it.each([
    {
      description: 'caps the mobile editor preview backing canvas',
      isDesktopEditorLayout: false,
      expectedBackingSize: 1024,
    },
    {
      description: 'keeps the full desktop preview backing canvas resolution',
      isDesktopEditorLayout: true,
      expectedBackingSize: 1536,
    },
  ])('$description', async ({ isDesktopEditorLayout, expectedBackingSize }) => {
    installViewportMatchMedia(isDesktopEditorLayout);
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas />);

    act(() => {
      resizeObserverInstances[0]?.triggerWidth(512);
    });

    await waitFor(() => {
      expect(renderTokenMock.mock.calls.at(-1)?.[2]).toBe(expectedBackingSize);
    });
  });

  it.each([
    {
      description: 'caps a fixed-size preview after changing from desktop to mobile',
      initialDesktopLayout: true,
      initialBackingSize: 1536,
      nextDesktopLayout: false,
      nextBackingSize: 1024,
    },
    {
      description: 'restores the full backing resolution after changing from mobile to desktop',
      initialDesktopLayout: false,
      initialBackingSize: 1024,
      nextDesktopLayout: true,
      nextBackingSize: 1536,
    },
  ])(
    '$description',
    async ({ initialDesktopLayout, initialBackingSize, nextDesktopLayout, nextBackingSize }) => {
      installViewportMatchMedia(initialDesktopLayout);
      const img = new Image();
      useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

      render(<Canvas />);

      act(() => {
        resizeObserverInstances[0]?.triggerWidth(512);
      });

      await waitFor(() => {
        expect(renderTokenMock.mock.calls.at(-1)?.[2]).toBe(initialBackingSize);
      });

      act(() => {
        changeViewport(nextDesktopLayout);
      });

      await waitFor(() => {
        expect(renderTokenMock.mock.calls.at(-1)?.[2]).toBe(nextBackingSize);
      });
    },
  );

  it('starts drag on pointer down and updates offset on move', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageOffsetX: 0, imageOffsetY: 0 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    expect(canvas).not.toBeNull();

    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 150, clientY: 120 });
    fireEvent.pointerUp(canvas, { clientX: 150, clientY: 120 });
  });

  it('zooms the image and prevents page scrolling when the wheel is used over the preview canvas', () => {
    const img = new Image();
    useEditorStore.setState({
      imageUrl: 'blob:test',
      imageElement: img,
      imageScale: 1,
      imageOffsetX: 48,
      imageOffsetY: -24,
    });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    expect(canvas).not.toBeNull();

    const { wheelEvent, wasNotPrevented } = dispatchWheelEvent(canvas, -100);

    expect(wasNotPrevented).toBe(false);
    expect(wheelEvent.defaultPrevented).toBe(true);
    const editorStateAfterWheel = useEditorStore.getState();
    expect(editorStateAfterWheel.imageScale).toBeGreaterThan(1);
    expect(editorStateAfterWheel.imageOffsetX).toBe(48);
    expect(editorStateAfterWheel.imageOffsetY).toBe(-24);
  });

  it('leaves wheel events outside the square preview canvas untouched', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const workspace = screen.getByTestId('canvas-workspace');
    const { wheelEvent, wasNotPrevented } = dispatchWheelEvent(workspace, -100);

    expect(wasNotPrevented).toBe(true);
    expect(wheelEvent.defaultPrevented).toBe(false);
    expect(useEditorStore.getState().imageScale).toBe(1);
  });

  it('leaves wheel events inside an empty preview canvas untouched', () => {
    render(<Canvas />);
    const imageUploader = screen.getByTestId('image-uploader');
    const { wheelEvent, wasNotPrevented } = dispatchWheelEvent(imageUploader, -100);

    expect(wasNotPrevented).toBe(true);
    expect(wheelEvent.defaultPrevented).toBe(false);
    expect(useEditorStore.getState().imageScale).toBe(1);
  });

  it('zooms the image and prevents page scrolling when the wheel is used over a batch preview canvas', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas previewMode="batch" />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    const { wheelEvent, wasNotPrevented } = dispatchWheelEvent(canvas, -100);

    expect(wasNotPrevented).toBe(false);
    expect(wheelEvent.defaultPrevented).toBe(true);
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);
  });

  it('zooms out when the wheel scrolls down inside the preview canvas', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    dispatchWheelEvent(canvas, 100);

    expect(useEditorStore.getState().imageScale).toBeLessThan(1);
  });

  it('normalizes pixel, line, and page wheel deltas before zooming', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchWheelEvent(canvas, -48, WheelEvent.DOM_DELTA_PIXEL);
    const pixelDeltaScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchWheelEvent(canvas, -3, WheelEvent.DOM_DELTA_LINE);
    const lineDeltaScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchWheelEvent(canvas, -1, WheelEvent.DOM_DELTA_PAGE);
    const pageDeltaScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchWheelEvent(canvas, -100, WheelEvent.DOM_DELTA_PIXEL);
    const cappedPixelDeltaScale = useEditorStore.getState().imageScale;

    expect(lineDeltaScale).toBeCloseTo(pixelDeltaScale);
    expect(pageDeltaScale).toBeCloseTo(cappedPixelDeltaScale);
  });

  it.each([
    { description: 'upper', initialScale: 4.99, deltaY: -10_000, expectedScale: 5 },
    { description: 'lower', initialScale: 0.11, deltaY: 10_000, expectedScale: 0.1 },
  ])('keeps image scale at the $description boundary', ({ initialScale, deltaY, expectedScale }) => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: initialScale });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    dispatchWheelEvent(canvas, deltaY);

    expect(useEditorStore.getState().imageScale).toBe(expectedScale);
  });

  it('scales touchpad and mouse wheel deltas proportionally without a giant-event jump', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    dispatchWheelEvent(canvas, -20);
    const touchpadZoomFactor = useEditorStore.getState().imageScale;

    dispatchWheelEvent(canvas, -100);
    const mouseZoomFactor = useEditorStore.getState().imageScale / touchpadZoomFactor;

    dispatchWheelEvent(canvas, -10_000);
    const cappedZoomFactor = useEditorStore.getState().imageScale / (touchpadZoomFactor * mouseZoomFactor);

    expect(mouseZoomFactor).toBeGreaterThan(touchpadZoomFactor);
    expect(cappedZoomFactor).toBeCloseTo(mouseZoomFactor);
  });

  it('keeps async asset refresh active after StrictMode effect replay', async () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(
      <StrictMode>
        <Canvas />
      </StrictMode>
    );

    expect(renderTokenMock).toHaveBeenCalled();
    const options = renderTokenMock.mock.calls.at(-1)?.[3];
    expect(options?.onAssetChange).toBeDefined();

    const callsBeforeRefresh = renderTokenMock.mock.calls.length;
    act(() => {
      options?.onAssetChange?.();
    });

    await waitFor(() => {
      expect(renderTokenMock.mock.calls.length).toBeGreaterThan(callsBeforeRefresh);
    });
  });

  it('uses a narrower height-bound preview frame in batch mode', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas previewMode="batch" />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    const previewFrame = canvas.parentElement;

    expect(previewFrame?.className).toContain('max-h-[16rem]');
    expect(previewFrame?.className).toContain('sm:max-h-[20rem]');
    expect(previewFrame?.className).toContain('xl:max-h-[22rem]');
    expect(previewFrame?.className).not.toContain('max-h-[28rem]');
    expect(previewFrame?.className).not.toContain('max-w-[512px]');
  });

  it('uses the expanded desktop preview only in default mode', () => {
    const { rerender } = render(<Canvas />);
    const defaultWorkspace = screen.getByTestId('canvas-workspace');
    const defaultPreviewFrame = defaultWorkspace.firstElementChild;

    expect(defaultWorkspace.className).toContain('xl:p-3');
    expect(defaultPreviewFrame?.className).toContain('max-w-[640px]');

    rerender(<Canvas previewMode="batch" />);
    const batchWorkspace = screen.getByTestId('canvas-workspace');
    const batchPreviewFrame = batchWorkspace.firstElementChild;

    expect(batchWorkspace.className).not.toContain('xl:p-3');
    expect(batchPreviewFrame?.className).not.toContain('max-w-[640px]');
  });
});
