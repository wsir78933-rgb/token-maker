import { describe, expect, it } from 'vitest';
import { snapCanvasDrag, type CanvasSnapBounds } from './canvas-snapping';

const PAGE_BOUNDS: CanvasSnapBounds = { x: 0, y: 0, width: 100, height: 110 };
const CANVAS_CLIENT_SIZE = { width: 400, height: 440 };

describe('snapCanvasDrag', () => {
  it('snaps the moving selection centre to the page centre', () => {
    const result = snapCanvasDrag({
      selectionBounds: { x: 10, y: 20, width: 20, height: 20 },
      proposedDelta: { x: 29, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [],
      canvasClientSize: CANVAS_CLIENT_SIZE,
      snappingEnabled: true,
      altKey: false,
    });

    expect(result.delta).toEqual({ x: 30, y: 0 });
    expect(result.guides).toContainEqual({ axis: 'x', position: 50, start: 0, end: 110 });
  });

  it('snaps a moving selection edge to a page edge', () => {
    const result = snapCanvasDrag({
      selectionBounds: { x: 10, y: 20, width: 20, height: 20 },
      proposedDelta: { x: 69, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [],
      canvasClientSize: CANVAS_CLIENT_SIZE,
      snappingEnabled: true,
      altKey: false,
    });

    expect(result.delta.x).toBe(70);
    expect(result.guides).toContainEqual({ axis: 'x', position: 100, start: 0, end: 110 });
  });

  it('snaps to the transformed bounding box of another layer', () => {
    const result = snapCanvasDrag({
      selectionBounds: { x: 0, y: 10, width: 10, height: 10 },
      proposedDelta: { x: 36, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [{ id: 'other-layer', bounds: { x: 47, y: 30, width: 20, height: 20 } }],
      canvasClientSize: CANVAS_CLIENT_SIZE,
      snappingEnabled: true,
      altKey: false,
    });

    expect(result.delta.x).toBe(37);
    expect(result.guides).toContainEqual({ axis: 'x', position: 47, start: 10, end: 50 });
  });

  it('does not snap outside the CSS pixel threshold', () => {
    const result = snapCanvasDrag({
      selectionBounds: { x: 0, y: 10, width: 10, height: 10 },
      proposedDelta: { x: 38, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [{ id: 'other-layer', bounds: { x: 50, y: 30, width: 20, height: 20 } }],
      canvasClientSize: CANVAS_CLIENT_SIZE,
      snappingEnabled: true,
      altKey: false,
    });

    expect(result.delta.x).toBe(38);
    expect(result.guides.filter((guide) => guide.axis === 'x')).toEqual([]);
  });

  it('uses Alt to temporarily reverse the snapping switch', () => {
    const baseRequest = {
      selectionBounds: { x: 10, y: 20, width: 20, height: 20 },
      proposedDelta: { x: 29, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [],
      canvasClientSize: CANVAS_CLIENT_SIZE,
    } as const;

    expect(snapCanvasDrag({ ...baseRequest, snappingEnabled: true, altKey: true }).delta.x).toBe(29);
    expect(snapCanvasDrag({ ...baseRequest, snappingEnabled: false, altKey: true }).delta.x).toBe(30);
  });

  it('returns one delta that preserves spacing across a multi-selection', () => {
    const result = snapCanvasDrag({
      selectionBounds: { x: 10, y: 20, width: 30, height: 20 },
      proposedDelta: { x: 9, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [],
      canvasClientSize: CANVAS_CLIENT_SIZE,
      snappingEnabled: true,
      altKey: false,
    });
    const layerXs = [10, 30].map((x) => x + result.delta.x);

    expect(result.delta.x).toBe(10);
    expect(layerXs).toEqual([20, 40]);
  });

  it('fails fast with the invalid numeric value in the error', () => {
    expect(() => snapCanvasDrag({
      selectionBounds: { x: Number.NaN, y: 0, width: 10, height: 10 },
      proposedDelta: { x: 0, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [],
      canvasClientSize: CANVAS_CLIENT_SIZE,
      snappingEnabled: true,
      altKey: false,
    })).toThrow('Invalid selection bounds x: NaN');

    expect(() => snapCanvasDrag({
      selectionBounds: { x: 0, y: 0, width: 10, height: 10 },
      proposedDelta: { x: 0, y: 0 },
      pageBounds: PAGE_BOUNDS,
      layerTargets: [],
      canvasClientSize: { width: 0, height: 440 },
      snappingEnabled: true,
      altKey: false,
    })).toThrow('Invalid canvas client width: 0');
  });
});
