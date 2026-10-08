import { describe, expect, it } from 'vitest';

import { resizeTownObject, snapTownPoint } from './geometry';
import type { TownObject } from './types';

const BASE_OBJECT: TownObject = {
  id: 'object-1',
  assetId: 'buildings-house-01-cottage',
  material: 'wood',
  x: 100,
  y: 80,
  width: 100,
  height: 50,
  rotationDegrees: 15,
};

describe('town geometry', () => {
  it('snaps both coordinates to five pixels without mutating the point', () => {
    const point = { x: 12.4, y: 17.6 };
    expect(snapTownPoint(point, true)).toEqual({ x: 10, y: 20 });
    expect(snapTownPoint(point, false)).toEqual(point);
    expect(point).toEqual({ x: 12.4, y: 17.6 });
  });

  it('keeps regular and connector objects proportional around the dragged edge', () => {
    const regular = resizeTownObject(BASE_OBJECT, 'regular', { width: 2, height: 1 }, { dx: 20, dy: 0 }, 'e');
    const connector = resizeTownObject(BASE_OBJECT, 'connector', { width: 2, height: 1 }, { dx: 0, dy: 20 }, 's');

    expect(regular).toMatchObject({ x: 100, width: 120, height: 60, y: 75, rotationDegrees: 15 });
    expect(connector).toMatchObject({ x: 80, y: 80, width: 140, height: 70, rotationDegrees: 15 });
    expect(regular.width / regular.height).toBe(2);
    expect(connector.width / connector.height).toBe(2);
    expect(BASE_OBJECT).toEqual({
      id: 'object-1',
      assetId: 'buildings-house-01-cottage',
      material: 'wood',
      x: 100,
      y: 80,
      width: 100,
      height: 50,
      rotationDegrees: 15,
    });
  });

  it('changes only line length while restoring the intrinsic line height', () => {
    const resized = resizeTownObject(
      { ...BASE_OBJECT, height: 28 },
      'line',
      { width: 128, height: 16 },
      { dx: 40, dy: 100 },
      'e',
    );

    expect(resized).toMatchObject({ x: 100, y: 80, width: 140, height: 16, rotationDegrees: 15 });
  });

  it('allows tile width and height to change independently and clamps to a usable size', () => {
    const resized = resizeTownObject(BASE_OBJECT, 'tile', { width: 64, height: 64 }, { dx: 20, dy: -100 }, 'se');
    const clamped = resizeTownObject(BASE_OBJECT, 'tile', { width: 64, height: 64 }, { dx: 1000, dy: 1000 }, 'nw');

    expect(resized).toMatchObject({ x: 100, y: 80, width: 120, height: 8 });
    expect(clamped.width).toBe(8);
    expect(clamped.height).toBe(8);
  });

  it('fails fast for invalid geometry boundaries', () => {
    expect(() => snapTownPoint({ x: Number.NaN, y: 0 }, true)).toThrow('finite');
    expect(() => snapTownPoint({ x: 0, y: 0 }, 'yes' as never)).toThrow('boolean');
    expect(() => resizeTownObject(BASE_OBJECT, 'wrong' as never, { width: 1, height: 1 }, { dx: 0, dy: 0 }, 'e')).toThrow('resize mode');
    expect(() => resizeTownObject(BASE_OBJECT, 'tile', { width: 0, height: 1 }, { dx: 0, dy: 0 }, 'e')).toThrow('greater than 0');
    expect(() => resizeTownObject(BASE_OBJECT, 'tile', { width: 1, height: 1 }, { dx: Number.NaN, dy: 0 }, 'e')).toThrow('finite');
    expect(() => resizeTownObject(BASE_OBJECT, 'tile', { width: 1, height: 1 }, { dx: 0, dy: 0 }, 'south-east' as never)).toThrow('resize handle');
  });

  it('accepts a real catalog asset and material at the public resize boundary', () => {
    const resized = resizeTownObject(
      BASE_OBJECT,
      'regular',
      { width: 2, height: 1 },
      { dx: 10, dy: 0 },
      'e',
    );

    expect(resized.assetId).toBe('buildings-house-01-cottage');
    expect(resized.material).toBe('wood');
  });

  it('fails fast for an unknown catalog asset', () => {
    expect(() => resizeTownObject(
      { ...BASE_OBJECT, assetId: 'missing-town-asset' },
      'tile',
      { width: 64, height: 64 },
      { dx: 0, dy: 0 },
      'se',
    )).toThrow('Unknown town asset id');
  });

  it('fails fast when a fixed terrain asset receives a material variant it does not support', () => {
    expect(() => resizeTownObject(
      { ...BASE_OBJECT, assetId: 'terrain-grass1' },
      'tile',
      { width: 64, height: 64 },
      { dx: 0, dy: 0 },
      'se',
    )).toThrow('does not support material');
  });
});
