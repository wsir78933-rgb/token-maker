import { describe, expect, it } from 'vitest';
import { createFreehandPath, appendFreehandPoint } from './drawing';

describe('freehand drawing helpers', () => {
  it('creates a deterministic SVG-safe M/L path from local scene points', () => {
    expect(createFreehandPath([{ x: 10, y: 20 }, { x: 30.125, y: 40.5 }]))
      .toBe('M 10 20 L 30.13 40.5');
  });

  it('caps a sampled local stroke and ignores points too close to the previous point', () => {
    const firstPoints = [{ x: 10, y: 20 }];
    expect(appendFreehandPoint(firstPoints, { x: 10.1, y: 20.1 })).toEqual(firstPoints);
    expect(appendFreehandPoint(firstPoints, { x: 11, y: 20 })).toEqual([{ x: 10, y: 20 }, { x: 11, y: 20 }]);
  });

  it('rejects malformed scene coordinates before they can form a path', () => {
    expect(() => createFreehandPath([{ x: Number.NaN, y: 20 }, { x: 30, y: 40 }])).toThrow('NaN');
  });
});
