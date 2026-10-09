// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastlePiece, CastlePoint, CastleProject, CastleSize } from '@/lib/castle-creator/types';
import { CastleCanvas } from './CastleCanvas';

vi.mock('@/lib/castle-creator/catalog', () => ({
  getCastleAsset: (assetId: string) => ({
    id: assetId,
    category: 'walls',
    number: 1,
    width: 200,
    height: 100,
  }),
  castleAssetImagePath: (assetId: string, palette: { building: number; roof: number }) => (
    `/castle-creator/${assetId}-b${palette.building}-r${palette.roof}.png`
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const CANVAS_SIZE: CastleSize = { width: 1000, height: 500 };

function createPiece(id: string, layerId: CastlePiece['layerId'], x = 100): CastlePiece {
  return {
    id,
    assetId: `asset-${id}`,
    layerId,
    x,
    y: 100,
    width: 200,
    height: 100,
    buildingColor: 1,
    roofColor: 1,
  };
}

function createProject(overrides: Partial<CastleProject> = {}): CastleProject {
  return {
    version: 1,
    pieces: [createPiece('lower-piece', 'lower'), createPiece('middle-piece', 'middle', 300), createPiece('upper-piece', 'upper', 500)],
    activeLayer: 'lower',
    visibleLayers: { lower: true, middle: true, upper: true },
    canvas: { width: 1000, height: 500, backgroundColor: '#ffffff', backgroundImageUrl: null },
    palette: { building: 1, roof: 1 },
    snapEnabled: false,
    resizeEnabled: true,
    ...overrides,
  };
}

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) } as DOMRect;
}

function renderCanvas(overrides: {
  locale?: SiteLocale;
  project?: CastleProject;
  selectedPieceId?: string | null;
  onMovePiece?: (pieceId: string, position: CastlePoint) => void;
  onResizePiece?: (pieceId: string, width: number) => void;
  onSelectPiece?: (pieceId: string | null) => void;
} = {}) {
  const project = overrides.project ?? createProject();
  const props = {
    locale: overrides.locale ?? ('en' as SiteLocale),
    project,
    selectedPieceId: overrides.selectedPieceId ?? null,
    size: CANVAS_SIZE,
    onMovePiece: overrides.onMovePiece ?? vi.fn<(pieceId: string, position: CastlePoint) => void>(),
    onResizePiece: overrides.onResizePiece ?? vi.fn<(pieceId: string, width: number) => void>(),
    onSelectPiece: overrides.onSelectPiece ?? vi.fn<(pieceId: string | null) => void>(),
  };
  const rendered = render(<CastleCanvas {...props} />);
  const canvas = screen.getByRole('application', { name: getCastleCreatorCopy(props.locale).editor.canvasLabel });
  const svg = canvas.querySelector('svg');
  if (!(svg instanceof SVGSVGElement)) throw new Error('Castle canvas SVG is missing.');
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 300, 200));
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 300, 200));
  svg.setPointerCapture = vi.fn();
  svg.releasePointerCapture = vi.fn();
  svg.hasPointerCapture = vi.fn(() => true);
  act(() => {
    fireEvent(window, new Event('resize'));
  });
  return { ...rendered, canvas, svg, props };
}

describe('CastleCanvas', () => {
  it('draws visible layers in lower-to-upper order and omits hidden layers', () => {
    const { container } = renderCanvas({
      project: createProject({ visibleLayers: { lower: true, middle: false, upper: true } }),
    });

    expect([...container.querySelectorAll('[data-castle-piece-id]')].map((element) => element.getAttribute('data-castle-piece-id')))
      .toEqual(['lower-piece', 'upper-piece']);
    expect(container.querySelector('[data-castle-layer-id="middle"]')).toBeNull();
  });

  it('shows a centered non-interactive hint when the canvas has no visible pieces', () => {
    const { container } = renderCanvas({
      project: createProject({ visibleLayers: { lower: false, middle: false, upper: false } }),
    });
    const hint = container.querySelector('[data-castle-empty-hint]');
    if (!(hint instanceof HTMLElement)) throw new Error('Empty canvas hint is missing.');

    expect(hint.textContent).toBe(getCastleCreatorCopy('en').editor.emptyCanvasHint);
    expect(hint.classList.contains('pointer-events-none')).toBe(true);
    expect(container.querySelector('[data-castle-piece-id="lower-piece"]')).toBeNull();
  });

  it('selects a piece, moves its body without resizing, and clears on blank canvas', () => {
    const onSelectPiece = vi.fn();
    const onMovePiece = vi.fn();
    const onResizePiece = vi.fn();
    const { canvas, svg, container } = renderCanvas({ onSelectPiece, onMovePiece, onResizePiece });
    const piece = container.querySelector('[data-castle-piece-id="lower-piece"]');
    if (!piece) throw new Error('Lower piece is missing.');
    expect(piece.classList.contains('cursor-grab')).toBe(true);
    expect(piece.classList.contains('active:cursor-grabbing')).toBe(true);

    fireEvent.pointerDown(piece, { pointerId: 7, pointerType: 'mouse', clientX: 30, clientY: 55 });
    expect(onSelectPiece).toHaveBeenCalledWith('lower-piece');
    expect(document.activeElement).toBe(svg);
    fireEvent.pointerMove(svg, { pointerId: 7, pointerType: 'mouse', clientX: 45, clientY: 55 });
    expect(onMovePiece).toHaveBeenLastCalledWith('lower-piece', { x: 150, y: 100 });
    expect(onResizePiece).not.toHaveBeenCalled();
    fireEvent.pointerUp(svg, { pointerId: 7, pointerType: 'mouse', clientX: 45, clientY: 55 });
    expect(svg.setPointerCapture).toHaveBeenCalledWith(7);

    fireEvent.pointerDown(svg, { pointerId: 8, pointerType: 'mouse', clientX: 1, clientY: 1 });
    expect(onSelectPiece).toHaveBeenLastCalledWith(null);
    expect(onSelectPiece).toHaveBeenCalledTimes(2);
    expect(canvas.getAttribute('aria-label')).toBe(getCastleCreatorCopy('en').editor.canvasLabel);
  });

  it('passes free negative scene positions to the parent without clamping', () => {
    const onMovePiece = vi.fn<(pieceId: string, position: CastlePoint) => void>();
    const freePositionPiece = { ...createPiece('free-position-piece', 'lower'), x: 0, y: 0 };
    const { canvas } = renderCanvas({
      project: createProject({ pieces: [freePositionPiece] }),
      selectedPieceId: freePositionPiece.id,
      onMovePiece,
    });

    fireEvent.keyDown(canvas, { key: 'ArrowLeft' });
    expect(onMovePiece).toHaveBeenCalledWith('free-position-piece', { x: -5, y: 0 });
  });

  it('shows one desktop resize handle outside the piece and reports width changes from the scaled pointer delta', () => {
    const onResizePiece = vi.fn();
    const { svg, container } = renderCanvas({ selectedPieceId: 'lower-piece', onResizePiece });
    const handles = container.querySelectorAll('[data-castle-resize-handle]');
    expect([...handles].map((handle) => handle.getAttribute('data-castle-resize-handle')))
      .toEqual(['end']);

    const endHandle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!endHandle) throw new Error('Desktop end resize handle is missing.');
    expect(endHandle.classList.contains('cursor-nwse-resize')).toBe(true);
    expect((endHandle as HTMLElement).style.cursor).toBe('nwse-resize');
    expect(endHandle.querySelector('span')?.getAttribute('style')).toContain('width: 16px');
    expect((endHandle as HTMLElement).style.left).toBe('90px');
    expect((endHandle as HTMLElement).style.top).toBe('85px');
    expect(Number.parseFloat((endHandle as HTMLElement).style.left) + 44).toBeLessThanOrEqual(300);
    expect(Number.parseFloat((endHandle as HTMLElement).style.top) + 44).toBeLessThanOrEqual(175);
    expect(
      Number.parseFloat((endHandle as HTMLElement).style.left) >= 90
      || Number.parseFloat((endHandle as HTMLElement).style.left) + 44 <= 30,
    ).toBe(true);
    expect(
      Number.parseFloat((endHandle as HTMLElement).style.top) >= 85
      || Number.parseFloat((endHandle as HTMLElement).style.top) + 44 <= 55,
    ).toBe(true);

    fireEvent.pointerDown(endHandle, { pointerId: 9, pointerType: 'mouse', clientX: 90, clientY: 55 });
    fireEvent.pointerMove(svg, { pointerId: 9, pointerType: 'mouse', clientX: 105, clientY: 55 });
    expect(onResizePiece).toHaveBeenLastCalledWith('lower-piece', 250);
  });

  it('moves the single resize handle to another available outside position near the canvas edge', () => {
    const edgePiece = { ...createPiece('edge-piece', 'lower', 800), y: 400 };
    const { container } = renderCanvas({
      project: createProject({ pieces: [edgePiece] }),
      selectedPieceId: edgePiece.id,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Edge resize handle is missing.');

    const left = Number.parseFloat(handle.style.left);
    const top = Number.parseFloat(handle.style.top);
    expect(left).toBe(196);
    expect(top).toBe(101);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(top).toBeGreaterThanOrEqual(25);
    expect(left + 44).toBeLessThanOrEqual(300);
    expect(top + 44).toBeLessThanOrEqual(175);
    expect(left).toBeLessThanOrEqual(240);
    expect(top).toBeLessThanOrEqual(145);
  });

  it('avoids every visible piece body before using the bottom fallback', () => {
    const selectedPiece = createPiece('selected-piece', 'lower');
    const blockingPiece = { ...createPiece('blocking-piece', 'middle', 250), y: 200 };
    const { canvas, container } = renderCanvas({
      project: createProject({ pieces: [selectedPiece, blockingPiece] }),
      selectedPieceId: selectedPiece.id,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Multi-piece resize handle is missing.');

    expect(canvas.style.marginBottom).toBe('52px');
    expect(handle.style.left).toBe('46px');
    expect(handle.style.top).toBe('183px');
  });

  it('keeps the 44px hit area clear of another visible piece when a later slot is available', () => {
    const selectedPiece = createPiece('selected-piece-with-neighbor', 'lower');
    const blockingPiece = {
      ...createPiece('small-blocking-piece', 'middle', 300),
      y: 200,
      width: 50,
      height: 50,
    };
    const { canvas, container } = renderCanvas({
      project: createProject({ pieces: [selectedPiece, blockingPiece] }),
      selectedPieceId: selectedPiece.id,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Neighbor resize handle is missing.');

    expect(canvas.style.marginBottom).toBe('');
    expect(handle.style.left).toBe('38px');
    expect(handle.style.top).toBe('85px');
    expect(Number.parseFloat(handle.style.left) + 44).toBeLessThanOrEqual(90);
  });

  it('keeps a clickable resize handle below a piece that fills the canvas', () => {
    const onResizePiece = vi.fn();
    const fullCanvasPiece = {
      ...createPiece('full-canvas-piece', 'lower', 0),
      y: 0,
      width: CANVAS_SIZE.width,
      height: CANVAS_SIZE.height,
    };
    const { canvas, svg, container } = renderCanvas({
      project: createProject({ pieces: [fullCanvasPiece] }),
      selectedPieceId: fullCanvasPiece.id,
      onResizePiece,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Full-canvas resize handle is missing.');
    const handleLeft = Number.parseFloat(handle.style.left);
    const handleTop = Number.parseFloat(handle.style.top);

    expect(canvas.classList.contains('overflow-visible')).toBe(true);
    expect(canvas.style.marginBottom).toBe('52px');
    expect(svg.classList.contains('overflow-hidden')).toBe(true);
    expect(svg.classList.contains('rounded-[inherit]')).toBe(true);
    expect(handleLeft).toBe(256);
    expect(handleTop).toBe(183);
    expect(handle.style.width).toBe('44px');
    expect(handle.style.height).toBe('44px');

    fireEvent.pointerDown(handle, { pointerId: 10, pointerType: 'mouse', clientX: 278, clientY: 205 });
    fireEvent.pointerMove(svg, { pointerId: 10, pointerType: 'mouse', clientX: 293, clientY: 205 });
    expect(onResizePiece).toHaveBeenCalledWith('full-canvas-piece', expect.any(Number));
  });

  it('uses only the visible clipped paint when an oversized piece crosses the canvas edge', () => {
    const oversizedPiece = {
      ...createPiece('oversized-piece', 'lower', 900),
      y: 400,
      width: 300,
      height: 200,
    };
    const { canvas, container } = renderCanvas({
      project: createProject({ pieces: [oversizedPiece] }),
      selectedPieceId: oversizedPiece.id,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Oversized resize handle is missing.');

    expect(handle.style.left).toBe('226px');
    expect(handle.style.top).toBe('101px');
    expect(canvas.style.marginBottom).toBe('');
  });

  it('uses one 44px hit target on mobile and hides all resize controls when resizing is disabled', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }));
    const { container, rerender, props } = renderCanvas({ selectedPieceId: 'lower-piece' });
    const canvas = container.querySelector('[role="application"]');
    if (!(canvas instanceof HTMLElement)) throw new Error('Castle canvas host is missing.');
    expect(canvas.classList.contains('h-[228px]')).toBe(true);
    expect(canvas.classList.contains('md:h-auto')).toBe(true);
    const mobileHandle = container.querySelector('[data-castle-resize-handle="end"]');
    expect(container.querySelectorAll('[data-castle-resize-handle]')).toHaveLength(1);
    if (!(mobileHandle instanceof HTMLElement)) throw new Error('Mobile resize handle is not an HTML element.');
    expect(mobileHandle.style.width).toBe('44px');
    expect(mobileHandle.style.height).toBe('44px');

    rerender(<CastleCanvas {...props} project={createProject({ resizeEnabled: false })} selectedPieceId="lower-piece" />);
    expect(container.querySelector('[data-castle-resize-controls]')).toBeNull();
  });

  it('uses cover-style slicing for the background image preview', () => {
    const { svg } = renderCanvas({
      project: createProject({
        canvas: { width: 1000, height: 500, backgroundColor: '#ffffff', backgroundImageUrl: '/castle-background.png' },
      }),
    });
    const backgroundImage = svg.querySelector('image');
    if (!backgroundImage) throw new Error('Background image preview is missing.');
    expect(backgroundImage.getAttribute('preserveAspectRatio')).toBe('xMidYMid slice');
  });

  it('moves the selected visible piece with keyboard arrows and resizes from a focused handle', () => {
    const onMovePiece = vi.fn();
    const onResizePiece = vi.fn();
    const { canvas, svg, container } = renderCanvas({ selectedPieceId: 'lower-piece', onMovePiece, onResizePiece });
    fireEvent.keyDown(canvas, { key: 'ArrowRight' });
    expect(onMovePiece).toHaveBeenCalledWith('lower-piece', { x: 105, y: 100 });

    const endHandle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!endHandle) throw new Error('Keyboard resize handle is missing.');
    fireEvent.pointerDown(endHandle, { pointerId: 11, pointerType: 'mouse', clientX: 112, clientY: 107 });
    expect(document.activeElement).toBe(endHandle);
    fireEvent.pointerUp(svg, { pointerId: 11, pointerType: 'mouse', clientX: 112, clientY: 107 });
    fireEvent.keyDown(endHandle, { key: 'ArrowRight' });
    expect(onResizePiece).toHaveBeenCalledWith('lower-piece', 205);
    expect(onMovePiece).toHaveBeenCalledTimes(1);
  });

  it('grows when dragging a handle that has moved to the visible top-left side', () => {
    const onResizePiece = vi.fn();
    const edgePiece = { ...createPiece('top-left-handle-piece', 'lower', 800), y: 400 };
    const { svg, container } = renderCanvas({
      project: createProject({ pieces: [edgePiece] }),
      selectedPieceId: edgePiece.id,
      onResizePiece,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Top-left resize handle is missing.');

    expect(handle.classList.contains('cursor-nwse-resize')).toBe(true);
    fireEvent.pointerDown(handle, { pointerId: 12, pointerType: 'mouse', clientX: 218, clientY: 123 });
    fireEvent.pointerMove(svg, { pointerId: 12, pointerType: 'mouse', clientX: 203, clientY: 108 });
    expect(onResizePiece).toHaveBeenLastCalledWith(edgePiece.id, 300);
  });

  it('uses the opposite diagonal cursor and direction when the handle moves to the top-right side', () => {
    const onResizePiece = vi.fn();
    const edgePiece = { ...createPiece('top-right-handle-piece', 'lower', 0), y: 400 };
    const { svg, container } = renderCanvas({
      project: createProject({ pieces: [edgePiece] }),
      selectedPieceId: edgePiece.id,
      onResizePiece,
    });
    const handle = container.querySelector('[data-castle-resize-handle="end"]');
    if (!(handle instanceof HTMLElement)) throw new Error('Top-right resize handle is missing.');

    expect(handle.classList.contains('cursor-nesw-resize')).toBe(true);
    fireEvent.pointerDown(handle, { pointerId: 13, pointerType: 'mouse', clientX: 112, clientY: 123 });
    fireEvent.pointerMove(svg, { pointerId: 13, pointerType: 'mouse', clientX: 127, clientY: 108 });
    expect(onResizePiece).toHaveBeenLastCalledWith(edgePiece.id, 300);
  });

  it('sizes a small SVG move hit target to at least 44 CSS pixels at a 0.3 display scale', () => {
    const smallPiece = { ...createPiece('small-piece', 'lower'), width: 40, height: 30 };
    const { container } = renderCanvas({
      project: createProject({ pieces: [smallPiece] }),
    });
    const moveHitTarget = container.querySelector('[data-castle-move-hit-target="small-piece"]');
    if (!moveHitTarget) throw new Error('Small piece move hit target is missing.');

    expect(Number(moveHitTarget.getAttribute('width'))).toBeCloseTo(44 / 0.3, 6);
    expect(Number(moveHitTarget.getAttribute('width')) * 0.3).toBeCloseTo(44, 6);
  });
});
