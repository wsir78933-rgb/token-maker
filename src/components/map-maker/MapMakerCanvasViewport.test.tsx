// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react';
import { createRef, type ReactNode, type RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MapMakerCanvasViewport } from './MapMakerCanvasViewport';

let viewportClientWidths: number[] = [];
let originalClientWidthDescriptor: PropertyDescriptor | undefined;
const resizeObservers: ControlledResizeObserver[] = [];

class ControlledResizeObserver implements ResizeObserver {
  readonly observedElements: Element[] = [];
  readonly disconnect = vi.fn(() => {});
  readonly observe = vi.fn((element: Element) => {
    this.observedElements.push(element);
  });
  readonly unobserve = vi.fn((element: Element) => {
    const observedIndex = this.observedElements.indexOf(element);
    if (observedIndex >= 0) this.observedElements.splice(observedIndex, 1);
  });

  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObservers.push(this);
  }

  takeRecords(): ResizeObserverEntry[] {
    return [];
  }

  notify(): void {
    const observedElement = this.observedElements[0];
    if (observedElement === undefined) {
      throw new Error('Expected a ResizeObserver target before notifying the viewport.');
    }
    this.callback([{ target: observedElement } as ResizeObserverEntry], this);
  }
}

function installViewportClientWidth(): void {
  originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.dataset.testid !== 'map-maker-canvas-viewport') {
        return originalClientWidthDescriptor?.get?.call(this) ?? 0;
      }

      const viewportElements = Array.from(document.querySelectorAll('[data-testid="map-maker-canvas-viewport"]'));
      const viewportIndex = viewportElements.indexOf(this);
      const clientWidth = viewportClientWidths[viewportIndex];
      if (clientWidth === undefined) {
        throw new Error(`Expected a clientWidth fixture for viewport index ${viewportIndex}.`);
      }
      return clientWidth;
    },
  });
}

function restoreViewportClientWidth(): void {
  if (originalClientWidthDescriptor === undefined) {
    Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
  } else {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidthDescriptor);
  }
  originalClientWidthDescriptor = undefined;
}

function setViewportClientWidths(...clientWidths: number[]): void {
  viewportClientWidths = clientWidths;
}

function getResizeObserverFor(viewportElement: HTMLElement): ControlledResizeObserver {
  const viewportObserver = [...resizeObservers].reverse().find((observer) => observer.observedElements.includes(viewportElement));
  if (viewportObserver === undefined) {
    throw new Error('Expected a ResizeObserver attached to the rendered map viewport.');
  }
  return viewportObserver;
}

function renderCanvasViewport(
  columns: number,
  rows: number,
  viewportRef: RefObject<HTMLDivElement | null>,
  children: ReactNode = <div data-testid="map-maker-canvas" />,
  feedback?: ReactNode,
) {
  return render(
    <MapMakerCanvasViewport
      columns={columns}
      rows={rows}
      viewportRef={viewportRef}
      feedback={feedback}
    >
      {children}
    </MapMakerCanvasViewport>,
  );
}

beforeEach(() => {
  viewportClientWidths = [];
  resizeObservers.length = 0;
  installViewportClientWidth();
  vi.stubGlobal('ResizeObserver', ControlledResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  restoreViewportClientWidth();
  viewportClientWidths = [];
  resizeObservers.length = 0;
});

describe('MapMakerCanvasViewport', () => {
  it('updates display scale and frame dimensions when the viewport and map size change', () => {
    setViewportClientWidths(1050);
    const viewportRef = createRef<HTMLDivElement>();
    const { rerender } = renderCanvasViewport(12, 6, viewportRef);
    const viewport = screen.getByTestId('map-maker-canvas-viewport');
    const displayFrame = screen.getByTestId('map-maker-display-frame');
    const initialObserver = getResizeObserverFor(viewport);

    expect(viewportRef.current).toBe(viewport);
    expect(displayFrame.getAttribute('data-map-maker-display-scale')).toBe('1.25');
    expect(displayFrame.getAttribute('data-map-maker-frame-width')).toBe('1050');
    expect(displayFrame.getAttribute('data-map-maker-frame-height')).toBe('525');
    expect(displayFrame.style.width).toBe('1050px');
    expect(displayFrame.style.height).toBe('525px');

    setViewportClientWidths(1680);
    act(() => initialObserver.notify());
    expect(displayFrame.getAttribute('data-map-maker-display-scale')).toBe('2');
    expect(displayFrame.style.width).toBe('1680px');
    expect(displayFrame.style.height).toBe('840px');

    setViewportClientWidths(700);
    rerender(
      <MapMakerCanvasViewport columns={10} rows={4} viewportRef={viewportRef}>
        <div data-testid="map-maker-canvas" />
      </MapMakerCanvasViewport>,
    );
    expect(initialObserver.disconnect).toHaveBeenCalledTimes(1);
    const resizedMapObserver = getResizeObserverFor(viewport);
    expect(displayFrame.getAttribute('data-map-maker-display-scale')).toBe('1');
    expect(displayFrame.getAttribute('data-map-maker-frame-width')).toBe('700');
    expect(displayFrame.getAttribute('data-map-maker-frame-height')).toBe('280');
    expect(displayFrame.style.width).toBe('700px');
    expect(displayFrame.style.height).toBe('280px');

    setViewportClientWidths(1400);
    act(() => resizedMapObserver.notify());
    expect(displayFrame.getAttribute('data-map-maker-display-scale')).toBe('2');
    expect(displayFrame.getAttribute('data-map-maker-frame-width')).toBe('1400');
    expect(displayFrame.getAttribute('data-map-maker-frame-height')).toBe('560');
  });

  it('keeps a map at its natural scale in a narrower viewport and gives maps independent refs', () => {
    setViewportClientWidths(350, 1400);
    const narrowViewportRef = createRef<HTMLDivElement>();
    const wideViewportRef = createRef<HTMLDivElement>();

    render(
      <>
        <MapMakerCanvasViewport columns={10} rows={6} viewportRef={narrowViewportRef}>
          <div data-testid="narrow-map" />
        </MapMakerCanvasViewport>
        <MapMakerCanvasViewport columns={10} rows={6} viewportRef={wideViewportRef}>
          <div data-testid="wide-map" />
        </MapMakerCanvasViewport>
      </>,
    );

    const viewportElements = screen.getAllByTestId('map-maker-canvas-viewport');
    const displayFrames = screen.getAllByTestId('map-maker-display-frame');
    expect(narrowViewportRef.current).toBe(viewportElements[0]);
    expect(wideViewportRef.current).toBe(viewportElements[1]);
    expect(narrowViewportRef.current).not.toBe(wideViewportRef.current);
    expect(displayFrames[0]?.getAttribute('data-map-maker-display-scale')).toBe('1');
    expect(displayFrames[0]?.getAttribute('data-map-maker-frame-width')).toBe('700');
    expect(displayFrames[1]?.getAttribute('data-map-maker-display-scale')).toBe('2');
    expect(displayFrames[1]?.getAttribute('data-map-maker-frame-width')).toBe('1400');
  });

  it('keeps a hidden zero-width viewport at scale one until it receives visible width', () => {
    setViewportClientWidths(0);
    const viewportRef = createRef<HTMLDivElement>();
    renderCanvasViewport(12, 6, viewportRef);
    const viewport = screen.getByTestId('map-maker-canvas-viewport');
    const displayFrame = screen.getByTestId('map-maker-display-frame');
    const viewportObserver = getResizeObserverFor(viewport);

    expect(displayFrame.getAttribute('data-map-maker-display-scale')).toBe('1');
    expect(displayFrame.style.width).toBe('840px');

    setViewportClientWidths(1050);
    act(() => viewportObserver.notify());
    expect(displayFrame.getAttribute('data-map-maker-display-scale')).toBe('1.25');
    expect(displayFrame.style.width).toBe('1050px');
  });

  it('keeps feedback above the scroll viewport and outside the scaled display frame', () => {
    setViewportClientWidths(1050);
    const viewportRef = createRef<HTMLDivElement>();
    renderCanvasViewport(12, 6, viewportRef, undefined, <p role="status">Map ready.</p>);

    const previewFrame = screen.getByTestId('map-maker-preview-frame');
    const feedback = screen.getByRole('status');
    const feedbackRow = feedback.parentElement;
    const viewport = screen.getByTestId('map-maker-canvas-viewport');
    const displayFrame = screen.getByTestId('map-maker-display-frame');

    expect(feedbackRow?.parentElement).toBe(previewFrame);
    expect(feedbackRow?.nextElementSibling).toBe(viewport);
    expect(previewFrame.contains(feedback)).toBe(true);
    expect(displayFrame.contains(feedback)).toBe(false);
  });

  it('disconnects its ResizeObserver when the viewport unmounts', () => {
    setViewportClientWidths(840);
    const viewportRef = createRef<HTMLDivElement>();
    const { unmount } = renderCanvasViewport(12, 6, viewportRef);
    const viewportObserver = getResizeObserverFor(screen.getByTestId('map-maker-canvas-viewport'));

    unmount();

    expect(viewportObserver.disconnect).toHaveBeenCalledTimes(1);
  });

  it.each([
    { clientWidth: -1, receivedValue: '-1' },
    { clientWidth: Number.NaN, receivedValue: 'NaN' },
    { clientWidth: Number.POSITIVE_INFINITY, receivedValue: 'Infinity' },
  ])('rejects viewport clientWidth $receivedValue with its value', ({ clientWidth, receivedValue }) => {
    setViewportClientWidths(clientWidth);
    const viewportRef = createRef<HTMLDivElement>();

    expect(() => renderCanvasViewport(12, 6, viewportRef)).toThrow(`Received ${receivedValue}`);
  });

  it('rejects map columns outside the supported range with the received value', () => {
    setViewportClientWidths(840);
    const viewportRef = createRef<HTMLDivElement>();

    expect(() => renderCanvasViewport(5, 6, viewportRef)).toThrow('Received 5');
  });
});
