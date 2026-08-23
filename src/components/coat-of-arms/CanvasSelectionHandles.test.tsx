// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { chromium } from '@playwright/test';
import { renderToString } from 'react-dom/server';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { SELECTION_SCENE_HEIGHT, SELECTION_SCENE_WIDTH } from '@/lib/coat-of-arms/selection-bounds';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import {
  CanvasSelectionHandles,
  CanvasTextPathOverlay,
  type CanvasTextPathGuide,
} from './CanvasSelectionHandles';

const WIDE_ARTBOARD = { width: 1800, height: 1080 };
const WIDE_SHORT_ARTBOARD = { width: 800, height: 400 };
const HANDLE_BUTTON_SIZE = 24;

const selectionBounds = { x: 20, y: 30, width: 40, height: 20 };

const curveOverlay: CanvasTextPathGuide = {
  mode: 'curve',
  handles: [
    { kind: 'curve-start', point: { x: 10, y: 72 } },
    { kind: 'curve-control', point: { x: 50, y: 30 } },
    { kind: 'curve-end', point: { x: 90, y: 72 } },
  ],
  curve: {
    start: { x: 10, y: 72 },
    control: { x: 50, y: 30 },
    end: { x: 90, y: 72 },
  },
};

const compactCurveOverlay: CanvasTextPathGuide = {
  mode: 'curve',
  handles: [
    { kind: 'curve-start', point: { x: 30, y: 56 } },
    { kind: 'curve-control', point: { x: 50, y: 42 } },
    { kind: 'curve-end', point: { x: 70, y: 56 } },
  ],
  curve: {
    start: { x: 30, y: 56 },
    control: { x: 50, y: 42 },
    end: { x: 70, y: 56 },
  },
};

const ringOverlay: CanvasTextPathGuide = {
  mode: 'ring',
  handles: [{ kind: 'ring-radius', point: { x: 50, y: 10 } }],
  ring: { center: { x: 50, y: 50 }, radius: 40 },
};

function renderHandles(
  props: Partial<Parameters<typeof CanvasSelectionHandles>[0]> = {},
) {
  useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  useCoatProjectStore.getState().setSelectedLayerIds([]);
  return render(
    <CanvasSelectionHandles
      locale="en"
      selectionBounds={selectionBounds}
      showResizeHandles={false}
      showRotateHandle
      showTextBoxWidthHandles={false}
      onResizeKeyDown={() => undefined}
      onResizePointerDown={() => undefined}
      onRotateKeyDown={() => undefined}
      onRotatePointerDown={() => undefined}
      onTextBoxWidthPointerDown={() => undefined}
      {...props}
    />,
  );
}

function renderTextPathOverlay(
  overlay: CanvasTextPathGuide,
  onPointerDown: Parameters<typeof CanvasTextPathOverlay>[0]['onPointerDown'] = () => undefined,
  artboardSize?: { width: number; height: number },
) {
  const width = artboardSize?.width ?? SELECTION_SCENE_WIDTH;
  const height = artboardSize?.height ?? SELECTION_SCENE_HEIGHT;
  const view = render(
    <div style={{ position: 'relative', width, height }}>
      <CanvasTextPathOverlay
        locale="en"
        overlay={overlay}
        onPointerDown={onPointerDown}
      />
    </div>,
  );
  const artboard = view.container.firstElementChild;
  if (!(artboard instanceof HTMLElement)) {
    throw new Error('Missing text path overlay artboard');
  }
  if (artboardSize) {
    mockTextPathOverlayLayout(artboard, artboardSize.width, artboardSize.height);
  }
  return view;
}

function mockTextPathOverlayLayout(
  artboard: HTMLElement,
  width: number,
  height: number,
): void {
  if (!(width > 0) || !(height > 0)) {
    throw new Error(`Invalid text path overlay layout size: ${width}x${height}`);
  }
  const overlay = artboard.firstElementChild;
  if (!(overlay instanceof HTMLElement)) {
    throw new Error('Missing text path overlay root');
  }
  const svg = overlay.querySelector('svg');
  if (!(svg instanceof SVGElement)) {
    throw new Error('Missing text path guide svg');
  }
  const meetBox = overlay.querySelector('[data-text-path-meet-box]');
  if (!(meetBox instanceof HTMLElement) || meetBox === overlay) {
    throw new Error('Text path guide svg must live in a meet box inside the overlay');
  }
  if (svg.parentElement !== meetBox) {
    throw new Error('Text path guide svg must be a child of the meet box');
  }
  stubClientRect(artboard, { left: 0, top: 0, width, height });
  stubClientRect(overlay, { left: 0, top: 0, width, height });
  const meetRect = svgMeetContentRect(width, height);
  stubClientRect(meetBox, meetRect);
  stubClientRect(svg, meetRect);
  const handles = [...meetBox.querySelectorAll('[data-text-path-handle]')];
  if (handles.length === 0) {
    throw new Error('Missing text path handles inside the meet box');
  }
  for (const handle of handles) {
    if (!(handle instanceof HTMLElement)) {
      throw new Error(`Invalid text path handle element: ${String(handle)}`);
    }
    if (handle.parentElement !== meetBox) {
      throw new Error(`Text path handle ${handle.getAttribute('data-text-path-handle')} is not a child of the meet box`);
    }
    const centerX = meetRect.left + requireStylePercent(handle, 'left') * meetRect.width;
    const centerY = meetRect.top + requireStylePercent(handle, 'top') * meetRect.height;
    stubClientRect(handle, {
      left: centerX - HANDLE_BUTTON_SIZE / 2,
      top: centerY - HANDLE_BUTTON_SIZE / 2,
      width: HANDLE_BUTTON_SIZE,
      height: HANDLE_BUTTON_SIZE,
    });
  }
}

function svgMeetContentRect(width: number, height: number): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const scale = Math.min(width / SELECTION_SCENE_WIDTH, height / SELECTION_SCENE_HEIGHT);
  const contentWidth = SELECTION_SCENE_WIDTH * scale;
  const contentHeight = SELECTION_SCENE_HEIGHT * scale;
  return {
    left: (width - contentWidth) / 2,
    top: (height - contentHeight) / 2,
    width: contentWidth,
    height: contentHeight,
  };
}

function stubClientRect(
  element: Element,
  rect: { left: number; top: number; width: number; height: number },
): void {
  const box = {
    x: rect.left,
    y: rect.top,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON: () => box,
  };
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(box as DOMRect);
}

function requireStylePercent(element: HTMLElement, property: 'left' | 'top'): number {
  const raw = element.style[property];
  if (!raw.endsWith('%')) {
    throw new Error(`Expected ${property} percentage on text path handle, got: ${JSON.stringify(raw)}`);
  }
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${property} percentage on text path handle: ${raw}`);
  }
  return value / 100;
}

function elementCenter(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function scenePointOnSvgMeet(svg: SVGElement, point: { x: number; y: number }): { x: number; y: number } {
  const viewBox = svg.getAttribute('viewBox');
  const expectedViewBox = `0 0 ${SELECTION_SCENE_WIDTH} ${SELECTION_SCENE_HEIGHT}`;
  if (viewBox !== expectedViewBox) {
    throw new Error(`Unexpected text path svg viewBox: ${JSON.stringify(viewBox)}; expected ${expectedViewBox}`);
  }
  const rect = svg.getBoundingClientRect();
  return {
    x: rect.left + (point.x / SELECTION_SCENE_WIDTH) * rect.width,
    y: rect.top + (point.y / SELECTION_SCENE_HEIGHT) * rect.height,
  };
}

function requireGuideSvg(mode: 'curve' | 'ring'): SVGElement {
  const guide = document.querySelector(`[data-text-path-guide="${mode}"]`);
  const svg = guide?.closest('svg');
  if (!(svg instanceof SVGElement)) {
    throw new Error(`Missing ${mode} text path guide svg`);
  }
  return svg;
}

const TEXT_PATH_OVERLAY_LAYOUT_CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; }
.absolute { position: absolute; }
.relative { position: relative; }
.inset-0 { inset: 0; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.h-full { height: 100%; }
.w-full { width: 100%; }
.w-auto { width: auto; }
.max-h-full { max-height: 100%; }
.max-w-full { max-width: 100%; }
.h-6 { height: 1.5rem; }
.w-6 { width: 1.5rem; }
.overflow-visible { overflow: visible; }
[class*="-translate-x-1/2"][class*="-translate-y-1/2"] { transform: translate(-50%, -50%); }
`;

async function measureHandleAgainstGuideInBrowser(options: {
  overlay: CanvasTextPathGuide;
  handleName: string;
  scenePoint: { x: number; y: number };
  artboard: { width: number; height: number };
}): Promise<{ handleCenter: { x: number; y: number }; guidePoint: { x: number; y: number } }> {
  const markup = renderToString(
    <div id="text-path-artboard" style={{ position: 'relative', width: options.artboard.width, height: options.artboard.height }}>
      <CanvasTextPathOverlay
        locale="en"
        overlay={options.overlay}
        onPointerDown={() => undefined}
      />
    </div>,
  );
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: options.artboard.width + 40, height: options.artboard.height + 40 },
    });
    await page.setContent(`<!doctype html><html><head><style>${TEXT_PATH_OVERLAY_LAYOUT_CSS}</style></head><body>${markup}</body></html>`);
    return await page.evaluate(({ handleName, scenePoint }) => {
      const artboard = document.getElementById('text-path-artboard');
      const handle = document.querySelector(`[aria-label="${handleName}"]`);
      const guide = document.querySelector('[data-text-path-guide="curve"]');
      const svg = guide?.closest('svg');
      if (!(artboard instanceof HTMLElement)) {
        throw new Error('Missing text path artboard in browser fixture');
      }
      if (!(handle instanceof HTMLElement)) {
        throw new Error(`Missing text path handle: ${handleName}`);
      }
      if (!(svg instanceof SVGSVGElement)) {
        throw new Error('Missing text path guide svg in browser fixture');
      }
      const ctm = svg.getScreenCTM();
      if (!ctm) {
        throw new Error('Missing text path svg screen CTM');
      }
      const mapped = svg.createSVGPoint();
      mapped.x = scenePoint.x;
      mapped.y = scenePoint.y;
      const guidePoint = mapped.matrixTransform(ctm);
      const handleRect = handle.getBoundingClientRect();
      return {
        handleCenter: { x: handleRect.left + handleRect.width / 2, y: handleRect.top + handleRect.height / 2 },
        guidePoint: { x: guidePoint.x, y: guidePoint.y },
      };
    }, { handleName: options.handleName, scenePoint: options.scenePoint });
  } finally {
    await browser.close();
  }
}

function selectionBoundingRect() {
  const selection = screen.getByLabelText('Selected layer controls');
  return [...selection.children].find((node) => {
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    return node.className.includes('inset-0') && node.className.includes('border-2');
  });
}

describe('CanvasSelectionHandles', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders left and right blue width bars for straight text', () => {
    renderHandles({ showTextBoxWidthHandles: true });

    const left = screen.getByRole('button', { name: 'Adjust straight text width left' });
    const right = screen.getByRole('button', { name: 'Adjust straight text width right' });
    expect(left.getAttribute('data-text-box-width-handle')).toBe('left');
    expect(right.getAttribute('data-text-box-width-handle')).toBe('right');
    expect(left.querySelector('span')?.className).toContain('bg-[#7eb6ff]');
    expect(screen.getByRole('button', { name: 'Rotate selected layer' })).toBeDefined();
    expect(document.querySelectorAll('[data-resize-handle]')).toHaveLength(0);
    expect(selectionBoundingRect()).toBeDefined();
  });

  it('omits the selection bounding rect when showBoundingRect is false', () => {
    renderHandles({ showBoundingRect: false });

    expect(selectionBoundingRect()).toBeUndefined();
  });

  it('keeps the floating toolbar inside the selection box by default', () => {
    renderHandles();

    const controls = screen.getByLabelText('Selected layer controls');
    const toolbar = screen.getByRole('toolbar', { name: 'Selected element actions' });
    expect(controls.contains(toolbar)).toBe(true);
    expect(toolbar.className).toContain('bottom-full');
    expect(toolbar.className).toContain('mb-14');
  });

  it('omits the floating toolbar from the selection box when hidden', () => {
    renderHandles({ showSelectionToolbar: false });

    const controls = screen.getByLabelText('Selected layer controls');
    expect(screen.queryByRole('toolbar', { name: 'Selected element actions' })).toBeNull();
    expect(controls.querySelector('[data-coat-editor-overlay="selection-toolbar"]')).toBeNull();
  });
});

describe('CanvasTextPathOverlay', () => {
  afterEach(() => {
    cleanup();
  });

  it('draws a dashed quadratic in the full scene viewBox', () => {
    renderTextPathOverlay(curveOverlay);

    expect(screen.getByRole('button', { name: 'Adjust curved text start point' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Adjust curved text control point' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Adjust curved text end point' })).toBeDefined();
    const guide = document.querySelector('[data-text-path-guide="curve"]');
    expect(guide?.getAttribute('d')).toBe('M10 72 Q50 30 90 72');
    expect(guide?.getAttribute('stroke')).toBe('#7eb6ff');
    expect(guide?.getAttribute('stroke-dasharray')).toBe('3 3');
    const svg = guide?.closest('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 100 110');
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
  });

  it('places a scene point at (50, 55) on the canvas center', () => {
    renderTextPathOverlay({
      ...curveOverlay,
      handles: [
        { kind: 'curve-start', point: { x: 10, y: 72 } },
        { kind: 'curve-control', point: { x: 50, y: 55 } },
        { kind: 'curve-end', point: { x: 90, y: 72 } },
      ],
    }, undefined, WIDE_ARTBOARD);

    const control = screen.getByRole('button', { name: 'Adjust curved text control point' });
    expect(control.style.left).toBe('50%');
    expect(control.style.top).toBe('50%');
    const center = elementCenter(control);
    expect(center.x).toBeCloseTo(WIDE_ARTBOARD.width / 2, 5);
    expect(center.y).toBeCloseTo(WIDE_ARTBOARD.height / 2, 5);
  });

  it('places the curve start handle on the guide point of a 1800×1080 artboard', () => {
    const start = curveOverlay.curve.start;
    renderTextPathOverlay(curveOverlay, undefined, WIDE_ARTBOARD);

    const svg = requireGuideSvg('curve');
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${SELECTION_SCENE_WIDTH} ${SELECTION_SCENE_HEIGHT}`);
    expect(svg.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
    const meetBox = svg.parentElement;
    if (!(meetBox instanceof HTMLElement)) {
      throw new Error('Missing text path meet box');
    }
    expect(meetBox.getAttribute('data-text-path-meet-box')).toBe('');
    expect(meetBox.style.aspectRatio).toBe(`${SELECTION_SCENE_WIDTH} / ${SELECTION_SCENE_HEIGHT}`);
    expect(meetBox.className).toContain('max-h-full');
    expect(meetBox.className).toContain('max-w-full');
    expect(meetBox.parentElement?.className).toContain('items-center');
    expect(meetBox.parentElement?.className).toContain('justify-center');

    const handle = screen.getByRole('button', { name: 'Adjust curved text start point' });
    expect(handle.parentElement).toBe(meetBox);
    const handleCenter = elementCenter(handle);
    const guidePoint = scenePointOnSvgMeet(svg, start);
    expect(handleCenter.x).toBeCloseTo(guidePoint.x, 5);
    expect(handleCenter.y).toBeCloseTo(guidePoint.y, 5);

    const naiveArtboardX = (start.x / SELECTION_SCENE_WIDTH) * WIDE_ARTBOARD.width;
    expect(Math.abs(naiveArtboardX - guidePoint.x)).toBeGreaterThan(150);
    expect(Math.abs(handleCenter.x - naiveArtboardX)).toBeGreaterThan(150);
    expect(Math.abs(handleCenter.x - guidePoint.x)).toBeLessThan(1);
  });

  it('places the compact curve start handle on the guide point of an 800×400 artboard', () => {
    const start = compactCurveOverlay.curve.start;
    renderTextPathOverlay(compactCurveOverlay, undefined, WIDE_SHORT_ARTBOARD);

    const svg = requireGuideSvg('curve');
    const handle = screen.getByRole('button', { name: 'Adjust curved text start point' });
    const handleCenter = elementCenter(handle);
    const guidePoint = scenePointOnSvgMeet(svg, start);
    expect(handleCenter.x).toBeCloseTo(guidePoint.x, 5);
    expect(handleCenter.y).toBeCloseTo(guidePoint.y, 5);
    const naiveArtboardX = (start.x / SELECTION_SCENE_WIDTH) * WIDE_SHORT_ARTBOARD.width;
    expect(Math.abs(handleCenter.x - naiveArtboardX)).toBeGreaterThan(1);
    expect(Math.abs(handleCenter.x - guidePoint.x)).toBeLessThan(1);
  });

  it('keeps the start handle on the dashed guide in a real 800×400 layout', async () => {
    const start = curveOverlay.curve.start;
    const measured = await measureHandleAgainstGuideInBrowser({
      overlay: curveOverlay,
      handleName: 'Adjust curved text start point',
      scenePoint: start,
      artboard: WIDE_SHORT_ARTBOARD,
    });
    expect(Math.abs(measured.handleCenter.x - measured.guidePoint.x)).toBeLessThan(1);
    expect(Math.abs(measured.handleCenter.y - measured.guidePoint.y)).toBeLessThan(1);
    const naiveArtboardX = (start.x / SELECTION_SCENE_WIDTH) * WIDE_SHORT_ARTBOARD.width;
    expect(Math.abs(naiveArtboardX - measured.guidePoint.x)).toBeGreaterThan(150);
  }, 30_000);

  it('draws one radius handle on a dashed ring', () => {
    const onPointerDown = vi.fn();
    renderTextPathOverlay(ringOverlay, onPointerDown);

    expect(screen.getByRole('button', { name: 'Adjust ring text radius and position' }).getAttribute('data-text-path-handle')).toBe('ring-radius');
    const guide = document.querySelector('[data-text-path-guide="ring"]');
    expect(guide?.getAttribute('cx')).toBe('50');
    expect(guide?.getAttribute('cy')).toBe('50');
    expect(guide?.getAttribute('r')).toBe('40');
    expect(guide?.getAttribute('stroke')).toBe('#7eb6ff');
    expect(guide?.getAttribute('stroke-dasharray')).toBe('3 3');
    expect(guide?.closest('svg')?.getAttribute('viewBox')).toBe('0 0 100 110');
  });
});
