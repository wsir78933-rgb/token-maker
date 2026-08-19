import { describe, expect, it } from 'vitest';
import {
  getSelectionOverlayCenter,
  getTransformedLayerBounds,
  getTransformedSelectionBounds,
  sceneBoundsEqual,
  sceneBoundsFromClientRects,
} from './selection-bounds';

describe('selection-bounds', () => {
  it('keeps an identity transform on the full scene box and reports a zero overlay centre', () => {
    const bounds = getTransformedLayerBounds({ x: 0, y: 0, scale: 1, rotation: 0 });

    expect(bounds).toEqual({ x: 0, y: 0, width: 100, height: 110 });
    expect(getSelectionOverlayCenter(bounds)).toEqual({ x: 0, y: 0 });
  });

  it('moves the overlay centre with the layer translation used by existing canvas tests', () => {
    const bounds = getTransformedLayerBounds({ x: 40, y: 20, scale: 1, rotation: 0 });

    expect(getSelectionOverlayCenter(bounds)).toEqual({ x: 40, y: 20 });
  });

  it('scales the scene box around the editor pivot', () => {
    const bounds = getTransformedLayerBounds({ x: 0, y: 0, scale: 0.5, rotation: 0 });

    expect(bounds.x).toBeCloseTo(25);
    expect(bounds.y).toBeCloseTo(27.5);
    expect(bounds.width).toBeCloseTo(50);
    expect(bounds.height).toBeCloseTo(55);
    expect(getSelectionOverlayCenter(bounds)).toEqual({ x: 0, y: 0 });
  });

  it('uses the crop rectangle instead of the full scene when a crop is present', () => {
    const bounds = getTransformedLayerBounds({
      x: 0, y: 0, scale: 1, rotation: 0, crop: { x: 10, y: 20, width: 40, height: 30 },
    });

    expect(bounds).toEqual({ x: 10, y: 20, width: 40, height: 30 });
  });

  it('unions every selected transform into one overlay rectangle', () => {
    const bounds = getTransformedSelectionBounds([
      { x: 0, y: 0, scale: 1, rotation: 0, crop: { x: 0, y: 0, width: 20, height: 20 } },
      { x: 0, y: 0, scale: 1, rotation: 0, crop: { x: 30, y: 40, width: 10, height: 10 } },
    ]);

    expect(bounds).toEqual({ x: 0, y: 0, width: 40, height: 50 });
  });

  it('converts painted client rectangles back into scene bounds', () => {
    const bounds = sceneBoundsFromClientRects(
      { left: 0, top: 0, width: 200, height: 220 },
      [{ left: 20, top: 22, width: 40, height: 44 }],
    );

    expect(bounds).toEqual({ x: 10, y: 11, width: 20, height: 22 });
  });

  it('ignores zero-sized client rectangles so jsdom can fall back to transform bounds', () => {
    expect(sceneBoundsFromClientRects(
      { left: 0, top: 0, width: 100, height: 110 },
      [{ left: 10, top: 10, width: 0, height: 0 }],
    )).toBeNull();
  });

  it('rejects an empty transform list', () => {
    expect(() => getTransformedSelectionBounds([])).toThrow('Cannot compute selection bounds without transforms');
  });

  it('compares bounds by value', () => {
    expect(sceneBoundsEqual({ x: 1, y: 2, width: 3, height: 4 }, { x: 1, y: 2, width: 3, height: 4 })).toBe(true);
    expect(sceneBoundsEqual({ x: 1, y: 2, width: 3, height: 4 }, { x: 1, y: 2, width: 3, height: 5 })).toBe(false);
    expect(sceneBoundsEqual(null, null)).toBe(true);
  });
});
