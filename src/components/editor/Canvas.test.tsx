// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';
import { useHistoryStore } from '@/lib/store/history';
import { exportTokenAsPNG, renderToken } from '@/lib/renderer/pipeline';
import { getCurrentEditorState } from './editor-store-hooks';
import { downloadCurrentToken } from './export-token';

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
  exportTokenAsPNG: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
}));

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

vi.mock('./TextCanvasOverlay', () => ({
  TextCanvasOverlay: () => <div data-testid="text-overlay" />,
}));

vi.mock('./ImageUploader', () => ({
  ImageUploader: () => <div data-testid="image-uploader" />,
}));

vi.mock('@/lib/analytics', () => ({
  trackDownloadPng: vi.fn(),
  trackShareDialogOpen: vi.fn(),
  trackShareDialogSuppressed: vi.fn(),
  trackUseBatchMode: vi.fn(),
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
import { ControlPanel } from './ControlPanel';

const renderTokenMock = vi.mocked(renderToken);
const exportTokenAsPNGMock = vi.mocked(exportTokenAsPNG);

function resetStore() {
  useEditorStore.getState().resetAll();
  useHistoryStore.getState().clearHistory();
}

let nextAnimationFrameId = 1;
const pendingAnimationFrames = new Map<number, FrameRequestCallback>();

function installAnimationFrameHarness() {
  nextAnimationFrameId = 1;
  pendingAnimationFrames.clear();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const animationFrameId = nextAnimationFrameId;
      nextAnimationFrameId += 1;
      pendingAnimationFrames.set(animationFrameId, callback);
      return animationFrameId;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((animationFrameId: number) => {
      pendingAnimationFrames.delete(animationFrameId);
    }),
  );
}

function flushPendingAnimationFrames() {
  const queuedAnimationFrames = [...pendingAnimationFrames.entries()];
  pendingAnimationFrames.clear();

  act(() => {
    const animationFrameTime = performance.now();
    for (const [, callback] of queuedAnimationFrames) {
      callback(animationFrameTime);
    }
  });
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

function dispatchCommittedPreviewWheel(
  targetElement: Element,
  deltaY: number,
  deltaMode: number = WheelEvent.DOM_DELTA_PIXEL,
) {
  const wheelResult = dispatchWheelEvent(targetElement, deltaY, deltaMode);
  flushPendingAnimationFrames();
  return wheelResult;
}

function dispatchDiscreteWindowEvent(eventName: 'click' | 'pointerdown' | 'keydown') {
  act(() => {
    if (eventName === 'keydown') {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'z', ctrlKey: true }),
      );
      return;
    }

    if (eventName === 'pointerdown') {
      window.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
      return;
    }

    window.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

function countImageScaleChanges(runStoreUpdates: () => void) {
  let imageScaleChangeCount = 0;
  const unsubscribeFromImageScale = useEditorStore.subscribe((state, previousState) => {
    if (state.imageScale !== previousState.imageScale) {
      imageScaleChangeCount += 1;
    }
  });

  runStoreUpdates();
  unsubscribeFromImageScale();
  return imageScaleChangeCount;
}

describe('Canvas', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    i18nMockState.locale = 'en';
    i18nMockState.messages = {};
    resizeObserverInstances.length = 0;
    viewportMediaQueryChangeListeners.clear();
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    installAnimationFrameHarness();
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
    exportTokenAsPNGMock.mockClear();
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

    expect(useEditorStore.getState().imageOffsetX).toBe(0);
    expect(useEditorStore.getState().imageOffsetY).toBe(0);
    expect(pendingAnimationFrames.size).toBe(1);

    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageOffsetX).toBe(50);
    expect(useEditorStore.getState().imageOffsetY).toBe(20);

    fireEvent.pointerMove(canvas, { clientX: 160, clientY: 130 });
    expect(useEditorStore.getState().imageOffsetX).toBe(50);
    expect(useEditorStore.getState().imageOffsetY).toBe(20);

    fireEvent.pointerUp(canvas, { clientX: 160, clientY: 130 });
    expect(useEditorStore.getState().imageOffsetX).toBe(60);
    expect(useEditorStore.getState().imageOffsetY).toBe(30);
    expect(pendingAnimationFrames.size).toBe(0);
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

    const { wheelEvent, wasNotPrevented } = dispatchCommittedPreviewWheel(canvas, -100);

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
    const { wheelEvent, wasNotPrevented } = dispatchCommittedPreviewWheel(canvas, -100);

    expect(wasNotPrevented).toBe(false);
    expect(wheelEvent.defaultPrevented).toBe(true);
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);
  });

  it('zooms out when the wheel scrolls down inside the preview canvas', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    dispatchCommittedPreviewWheel(canvas, 100);

    expect(useEditorStore.getState().imageScale).toBeLessThan(1);
  });

  it('normalizes pixel, line, and page wheel deltas before zooming', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchCommittedPreviewWheel(canvas, -48, WheelEvent.DOM_DELTA_PIXEL);
    const pixelDeltaScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchCommittedPreviewWheel(canvas, -3, WheelEvent.DOM_DELTA_LINE);
    const lineDeltaScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchCommittedPreviewWheel(canvas, -1, WheelEvent.DOM_DELTA_PAGE);
    const pageDeltaScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchCommittedPreviewWheel(canvas, -100, WheelEvent.DOM_DELTA_PIXEL);
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
    dispatchCommittedPreviewWheel(canvas, deltaY);

    expect(useEditorStore.getState().imageScale).toBe(expectedScale);
  });

  it('scales touchpad and mouse wheel deltas proportionally without a giant-event jump', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    dispatchCommittedPreviewWheel(canvas, -20);
    const touchpadZoomFactor = useEditorStore.getState().imageScale;

    dispatchCommittedPreviewWheel(canvas, -100);
    const mouseZoomFactor = useEditorStore.getState().imageScale / touchpadZoomFactor;

    dispatchCommittedPreviewWheel(canvas, -10_000);
    const cappedZoomFactor = useEditorStore.getState().imageScale / (touchpadZoomFactor * mouseZoomFactor);

    expect(mouseZoomFactor).toBeGreaterThan(touchpadZoomFactor);
    expect(cappedZoomFactor).toBeCloseTo(mouseZoomFactor);
  });

  it('commits multiple same-frame wheel events once with the accumulated scale', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchCommittedPreviewWheel(canvas, -100);
    const firstWheelScale = useEditorStore.getState().imageScale;
    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    dispatchCommittedPreviewWheel(canvas, -100);
    dispatchCommittedPreviewWheel(canvas, -100);
    const sequentialTwoWheelScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    const previewCallsBeforeSameFrameWheels = renderTokenMock.mock.calls.length;
    const sameFrameScaleChanges = countImageScaleChanges(() => {
      dispatchWheelEvent(canvas, -100);
      dispatchWheelEvent(canvas, -100);
      expect(useEditorStore.getState().imageScale).toBe(1);
      expect(pendingAnimationFrames.size).toBe(1);
      expect(renderTokenMock.mock.calls.length).toBe(previewCallsBeforeSameFrameWheels);
      flushPendingAnimationFrames();
    });

    expect(sameFrameScaleChanges).toBe(1);
    expect(useEditorStore.getState().imageScale).toBeCloseTo(sequentialTwoWheelScale);
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(firstWheelScale);
    expect(renderTokenMock.mock.calls.length).toBe(previewCallsBeforeSameFrameWheels + 1);
    expect(pendingAnimationFrames.size).toBe(0);
  });

  it('commits later wheel events on a new animation frame', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    const scaleChanges = countImageScaleChanges(() => {
      dispatchWheelEvent(canvas, -100);
      flushPendingAnimationFrames();
      const scaleAfterFirstFrame = useEditorStore.getState().imageScale;
      dispatchWheelEvent(canvas, -100);
      expect(useEditorStore.getState().imageScale).toBe(scaleAfterFirstFrame);
      flushPendingAnimationFrames();
    });

    expect(scaleChanges).toBe(2);
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);
  });

  it('keeps same-frame zoom-in and zoom-out from jumping past the scale limits', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 4.99 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchCommittedPreviewWheel(canvas, -10_000);
    dispatchCommittedPreviewWheel(canvas, 10_000);
    const sequentialUpperBoundScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(4.99);
    });
    dispatchWheelEvent(canvas, -10_000);
    dispatchWheelEvent(canvas, 10_000);
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBeCloseTo(sequentialUpperBoundScale);
    expect(useEditorStore.getState().imageScale).toBeLessThanOrEqual(5);

    act(() => {
      useEditorStore.getState().setImageScale(0.11);
    });
    dispatchCommittedPreviewWheel(canvas, 10_000);
    dispatchCommittedPreviewWheel(canvas, -10_000);
    const sequentialLowerBoundScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(0.11);
    });
    dispatchWheelEvent(canvas, 10_000);
    dispatchWheelEvent(canvas, -10_000);
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBeCloseTo(sequentialLowerBoundScale);
    expect(useEditorStore.getState().imageScale).toBeGreaterThanOrEqual(0.1);
  });

  it('keeps drag offset rAF and wheel scale rAF independent on the same frame', () => {
    const img = new Image();
    useEditorStore.setState({
      imageUrl: 'blob:test',
      imageElement: img,
      imageScale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
    });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 150, clientY: 120 });
    dispatchWheelEvent(canvas, -100);

    expect(useEditorStore.getState().imageOffsetX).toBe(0);
    expect(useEditorStore.getState().imageOffsetY).toBe(0);
    expect(useEditorStore.getState().imageScale).toBe(1);
    expect(pendingAnimationFrames.size).toBe(2);

    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageOffsetX).toBe(50);
    expect(useEditorStore.getState().imageOffsetY).toBe(20);
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);

    fireEvent.pointerUp(canvas, { clientX: 150, clientY: 120 });
    expect(useEditorStore.getState().imageOffsetX).toBe(50);
    expect(useEditorStore.getState().imageOffsetY).toBe(20);
  });

  it('does not schedule a scale commit for wheel events outside the preview or on an empty canvas', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    const { rerender } = render(<Canvas />);
    const workspace = screen.getByTestId('canvas-workspace');
    dispatchWheelEvent(workspace, -100);

    expect(pendingAnimationFrames.size).toBe(0);
    expect(useEditorStore.getState().imageScale).toBe(1);

    act(() => {
      useEditorStore.getState().clearImage();
    });
    rerender(<Canvas />);
    const imageUploader = screen.getByTestId('image-uploader');
    dispatchWheelEvent(imageUploader, -100);

    expect(pendingAnimationFrames.size).toBe(0);
    expect(useEditorStore.getState().imageScale).toBe(1);
  });

  it('cancels a pending wheel commit on unmount so the old frame cannot write later', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    const { unmount } = render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    dispatchWheelEvent(canvas, -100);
    expect(pendingAnimationFrames.size).toBe(1);

    unmount();

    expect(pendingAnimationFrames.size).toBe(0);
    expect(useEditorStore.getState().imageScale).toBe(1);
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBe(1);
  });

  it('does not let a pending wheel frame overwrite a new image, reset, or external scale', () => {
    const firstImage = new Image();
    const replacementImage = new Image();
    useEditorStore.setState({
      imageUrl: 'blob:test',
      imageElement: firstImage,
      imageScale: 1,
    });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchWheelEvent(canvas, -100);
    act(() => {
      useEditorStore.getState().setImage('blob:replacement', replacementImage);
    });
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBe(1);
    expect(useEditorStore.getState().imageElement).toBe(replacementImage);

    dispatchWheelEvent(canvas, -100);
    dispatchDiscreteWindowEvent('click');
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);
    act(() => {
      useEditorStore.getState().resetPosition();
    });
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBe(1);

    dispatchWheelEvent(canvas, -100);
    act(() => {
      useEditorStore.getState().setImageScale(3);
    });
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBe(3);

    dispatchWheelEvent(canvas, -100);
    act(() => {
      useEditorStore.getState().clearImage();
    });
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageElement).toBeNull();
    expect(useEditorStore.getState().imageScale).toBe(3);
  });

  it('commits a pending wheel before pointerDown selection instead of dropping the zoom', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();

    dispatchWheelEvent(canvas, -100);
    expect(useEditorStore.getState().imageScale).toBe(1);
    expect(pendingAnimationFrames.size).toBe(1);

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 });

    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);
    expect(useEditorStore.getState().selectedTextId).toBeNull();
    expect(useEditorStore.getState().isImageSelected).toBe(true);
    expect(pendingAnimationFrames.size).toBe(0);
  });

  it('keeps a pending wheel when only border or color changes, then commits it on the animation frame', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchWheelEvent(canvas, -100);
    act(() => {
      useEditorStore.getState().setBorderTint('#ff0000');
      useEditorStore.getState().setOverlayTint('#00ff00');
    });

    expect(pendingAnimationFrames.size).toBe(1);
    expect(useEditorStore.getState().imageScale).toBe(1);
    expect(useEditorStore.getState().borderTint).toBe('#ff0000');
    expect(useEditorStore.getState().overlayTint).toBe('#00ff00');

    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1);
    expect(useEditorStore.getState().borderTint).toBe('#ff0000');
  });

  it('commits a pending wheel before a public export read without waiting for rAF', async () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchWheelEvent(canvas, -100);
    expect(getCurrentEditorState().imageScale).toBe(1);

    dispatchDiscreteWindowEvent('pointerdown');
    const editorStateAfterPointerDown = getCurrentEditorState();
    expect(editorStateAfterPointerDown.imageScale).toBeGreaterThan(1);
    expect(pendingAnimationFrames.size).toBe(0);

    await downloadCurrentToken((key) => key);
    expect(exportTokenAsPNGMock).toHaveBeenCalledTimes(1);
    expect(exportTokenAsPNGMock.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ imageScale: editorStateAfterPointerDown.imageScale }),
    );
  });

  it('commits a pending wheel on keydown so undo restores the pre-wheel scale', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    act(() => {
      useEditorStore.getState().setImageScale(2);
      useHistoryStore.getState().commit();
    });

    dispatchWheelEvent(canvas, -100);
    expect(useEditorStore.getState().imageScale).toBe(2);

    dispatchDiscreteWindowEvent('keydown');
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(2);

    act(() => {
      useHistoryStore.getState().undo();
    });
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageScale).toBe(2);
  });

  it('does not let a pending wheel frame overwrite a same-tick resetAll', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchWheelEvent(canvas, -100);
    act(() => {
      useEditorStore.getState().resetAll();
    });
    flushPendingAnimationFrames();
    expect(useEditorStore.getState().imageElement).toBeNull();
    expect(useEditorStore.getState().imageScale).toBe(1);
  });

  it('keeps wheel coalescing after StrictMode effect replay', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(
      <StrictMode>
        <Canvas />
      </StrictMode>,
    );
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;

    dispatchCommittedPreviewWheel(canvas, -100);
    const singleWheelScale = useEditorStore.getState().imageScale;

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });
    const scaleChanges = countImageScaleChanges(() => {
      dispatchWheelEvent(canvas, -100);
      dispatchWheelEvent(canvas, -100);
      expect(pendingAnimationFrames.size).toBe(1);
      flushPendingAnimationFrames();
    });

    expect(scaleChanges).toBe(1);
    expect(useEditorStore.getState().imageScale).toBeCloseTo(singleWheelScale * singleWheelScale);
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

  it('keeps focused ControlPanel scale slider ArrowRight aligned with a flushed wheel', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    const sequentialEditor = render(
      <>
        <ControlPanel />
        <Canvas />
      </>,
    );
    const sequentialSlider = screen.getByRole('slider', { name: 'imageScale' });
    const sequentialCanvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    act(() => {
      sequentialSlider.focus();
    });
    dispatchCommittedPreviewWheel(sequentialCanvas, -100);
    const scaleAfterSequentialWheel = useEditorStore.getState().imageScale;
    fireEvent.keyDown(sequentialSlider, { key: 'ArrowRight' });
    const sequentialScaleAfterArrow = useEditorStore.getState().imageScale;
    sequentialEditor.unmount();

    expect(scaleAfterSequentialWheel).toBeGreaterThan(1.05);
    expect(sequentialScaleAfterArrow).toBeGreaterThan(scaleAfterSequentialWheel);
    expect(sequentialScaleAfterArrow).toBeGreaterThan(1.16);
    expect(sequentialScaleAfterArrow).not.toBeCloseTo(1.01, 5);

    act(() => {
      useEditorStore.getState().setImageScale(1);
    });

    const pendingEditor = render(
      <>
        <ControlPanel />
        <Canvas />
      </>,
    );
    const pendingSlider = screen.getByRole('slider', { name: 'imageScale' });
    const pendingCanvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    act(() => {
      pendingSlider.focus();
    });
    dispatchWheelEvent(pendingCanvas, -100);
    expect(useEditorStore.getState().imageScale).toBe(1);
    expect(pendingAnimationFrames.size).toBe(1);

    fireEvent.keyDown(pendingSlider, { key: 'ArrowRight' });

    expect(pendingAnimationFrames.size).toBe(0);
    expect(useEditorStore.getState().imageScale).toBeCloseTo(sequentialScaleAfterArrow);
    expect(useEditorStore.getState().imageScale).toBeGreaterThan(1.16);
    expect(useEditorStore.getState().imageScale).not.toBeCloseTo(1.01, 5);

    const flushSyncLifecycleWarnings = consoleErrorSpy.mock.calls.filter((callArgs) =>
      callArgs.some((arg) => String(arg).includes('flushSync was called from inside a lifecycle method')),
    );
    expect(flushSyncLifecycleWarnings).toEqual([]);
    consoleErrorSpy.mockRestore();
    pendingEditor.unmount();
  });

  it('does not extra-commit scale on ordinary clicks and keydowns when no wheel is pending', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1 });

    render(
      <>
        <ControlPanel />
        <Canvas />
      </>,
    );
    const slider = screen.getByRole('slider', { name: 'imageScale' });
    const scaleChangesWithoutPendingWheel = countImageScaleChanges(() => {
      fireEvent.click(slider);
      fireEvent.keyDown(document.body, { key: 'a', bubbles: true });
      dispatchDiscreteWindowEvent('click');
      dispatchDiscreteWindowEvent('pointerdown');
      dispatchDiscreteWindowEvent('keydown');
    });

    expect(scaleChangesWithoutPendingWheel).toBe(0);
    expect(useEditorStore.getState().imageScale).toBe(1);
    expect(pendingAnimationFrames.size).toBe(0);

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(useEditorStore.getState().imageScale).toBeCloseTo(1.01);
    expect(pendingAnimationFrames.size).toBe(0);
  });
});
