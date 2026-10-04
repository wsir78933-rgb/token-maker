import { describe, expect, it } from 'vitest';

import {
  DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
  MAX_ARMY_FORMATION_BACKGROUND_SCALE,
  MIN_ARMY_FORMATION_BACKGROUND_SCALE,
  toArmyFormationMapPoint,
  translateArmyFormationBackgroundTransform,
  zoomArmyFormationBackgroundTransformAtPoint,
} from '@/lib/army-formation/background-image-geometry';

describe('toArmyFormationMapPoint', () => {
  it('returns viewport coordinates unchanged for the identity transform', () => {
    expect(toArmyFormationMapPoint(DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM, 37, -12)).toEqual({
      x: 37,
      y: -12,
    });
  });

  it('removes positive and negative translation from viewport coordinates', () => {
    expect(toArmyFormationMapPoint({ scale: 1, offsetXPx: 34, offsetYPx: -27 }, 50, 25)).toEqual({
      x: 16,
      y: 52,
    });
    expect(toArmyFormationMapPoint({ scale: 1, offsetXPx: -34, offsetYPx: 27 }, 50, 25)).toEqual({
      x: 84,
      y: -2,
    });
  });

  it.each([
    { scale: MIN_ARMY_FORMATION_BACKGROUND_SCALE, viewXPx: 20, viewYPx: -5, x: 80, y: -20 },
    { scale: 2, viewXPx: 20, viewYPx: -6, x: 10, y: -3 },
    { scale: MAX_ARMY_FORMATION_BACKGROUND_SCALE, viewXPx: 24, viewYPx: -16, x: 3, y: -2 },
  ])('divides viewport coordinates by the supported scale $scale', ({ scale, viewXPx, viewYPx, x, y }) => {
    expect(toArmyFormationMapPoint({ scale, offsetXPx: 0, offsetYPx: 0 }, viewXPx, viewYPx)).toEqual({
      x,
      y,
    });
  });

  it('rejects invalid transforms and non-finite viewport coordinates with their values', () => {
    expect(() => toArmyFormationMapPoint({ scale: 0.24, offsetXPx: 0, offsetYPx: 0 }, 0, 0)).toThrow(
      'transform.scale must be between 0.25 and 8; received 0.24.',
    );
    expect(() =>
      toArmyFormationMapPoint(DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM, Number.NaN, 0),
    ).toThrow('viewXPx must be a finite number; received NaN.');
    expect(() =>
      toArmyFormationMapPoint(DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM, 0, Number.POSITIVE_INFINITY),
    ).toThrow('viewYPx must be a finite number; received Infinity.');
  });

  it('rejects overflow while calculating viewport deltas and map coordinates', () => {
    expect(() =>
      toArmyFormationMapPoint(
        { scale: 1, offsetXPx: -Number.MAX_VALUE, offsetYPx: 0 },
        Number.MAX_VALUE,
        0,
      ),
    ).toThrow('view delta xPx must be a finite number; received Infinity.');
    expect(() =>
      toArmyFormationMapPoint(
        { scale: MIN_ARMY_FORMATION_BACKGROUND_SCALE, offsetXPx: 0, offsetYPx: 0 },
        0,
        Number.MAX_VALUE,
      ),
    ).toThrow('mapPoint.y must be a finite number; received Infinity.');
  });
});

describe('translateArmyFormationBackgroundTransform', () => {
  it('keeps the default transform immutable', () => {
    expect(Object.isFrozen(DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM)).toBe(true);
    expect(Reflect.set(DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM, 'scale', 2)).toBe(false);
    expect(DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM.scale).toBe(1);
  });

  it('translates the identity transform in battlefield coordinates', () => {
    expect(
      translateArmyFormationBackgroundTransform(
        DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
        37,
        -12,
      ),
    ).toEqual({ scale: 1, offsetXPx: 37, offsetYPx: -12 });
  });

  it('rejects invalid values and offset overflow with the received value', () => {
    expect(() =>
      translateArmyFormationBackgroundTransform(
        { scale: 1, offsetXPx: Number.MAX_VALUE, offsetYPx: 0 },
        Number.MAX_VALUE,
        0,
      ),
    ).toThrow('translated offsetXPx must be a finite number; received Infinity.');
    expect(() =>
      translateArmyFormationBackgroundTransform(
        DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
        Number.NaN,
        0,
      ),
    ).toThrow('deltaXPx must be a finite number; received NaN.');
  });
});

describe('zoomArmyFormationBackgroundTransformAtPoint', () => {
  it('keeps the anchored battlefield coordinate in place over repeated zooms', () => {
    const point = { xPx: 310, yPx: 420 };
    let transform = translateArmyFormationBackgroundTransform(
      DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
      -120,
      60,
    );
    const anchoredMapPoint = toArmyFormationMapPoint(transform, point.xPx, point.yPx);

    for (const scaleFactor of [1.7, 0.4, 2.2]) {
      transform = zoomArmyFormationBackgroundTransformAtPoint(transform, point, scaleFactor);
      const mapPoint = toArmyFormationMapPoint(transform, point.xPx, point.yPx);
      expect(mapPoint.x).toBeCloseTo(anchoredMapPoint.x);
      expect(mapPoint.y).toBeCloseTo(anchoredMapPoint.y);
    }
  });

  it('uses the clamped scale ratio so anchors remain fixed at both scale limits', () => {
    const point = { xPx: 310, yPx: 420 };
    const atMinimum = zoomArmyFormationBackgroundTransformAtPoint(
      { scale: 0.3, offsetXPx: 35, offsetYPx: -42 },
      point,
      0.1,
    );
    const atMaximum = zoomArmyFormationBackgroundTransformAtPoint(
      { scale: 4, offsetXPx: 35, offsetYPx: -42 },
      point,
      5,
    );

    expect(atMinimum.scale).toBe(MIN_ARMY_FORMATION_BACKGROUND_SCALE);
    expect(atMaximum.scale).toBe(MAX_ARMY_FORMATION_BACKGROUND_SCALE);
    expect((point.xPx - atMinimum.offsetXPx) / atMinimum.scale).toBeCloseTo(
      (point.xPx - 35) / 0.3,
    );
    expect((point.yPx - atMinimum.offsetYPx) / atMinimum.scale).toBeCloseTo(
      (point.yPx + 42) / 0.3,
    );
    expect((point.xPx - atMaximum.offsetXPx) / atMaximum.scale).toBeCloseTo(
      (point.xPx - 35) / 4,
    );
    expect((point.yPx - atMaximum.offsetYPx) / atMaximum.scale).toBeCloseTo(
      (point.yPx + 42) / 4,
    );
  });

  it('rejects invalid transforms, points, and scale factors with the received value', () => {
    expect(() =>
      zoomArmyFormationBackgroundTransformAtPoint(
        { scale: 0.24, offsetXPx: 0, offsetYPx: 0 },
        { xPx: 0, yPx: 0 },
        1,
      ),
    ).toThrow('transform.scale must be between 0.25 and 8; received 0.24.');
    expect(() =>
      zoomArmyFormationBackgroundTransformAtPoint(
        DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
        { xPx: Number.NaN, yPx: 0 },
        1,
      ),
    ).toThrow('point.xPx must be a finite number; received NaN.');
    expect(() =>
      zoomArmyFormationBackgroundTransformAtPoint(
        DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
        { xPx: 0, yPx: 0 },
        0,
      ),
    ).toThrow('scaleFactor must be greater than 0; received 0.');
    expect(() =>
      zoomArmyFormationBackgroundTransformAtPoint(
        DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
        { xPx: 0, yPx: 0 },
        -2,
      ),
    ).toThrow('scaleFactor must be greater than 0; received -2.');
    expect(() =>
      zoomArmyFormationBackgroundTransformAtPoint(
        DEFAULT_ARMY_FORMATION_BACKGROUND_TRANSFORM,
        { xPx: 0, yPx: 0 },
        Number.POSITIVE_INFINITY,
      ),
    ).toThrow('scaleFactor must be a finite number; received Infinity.');
  });

  it('rejects overflow while calculating the anchored offset', () => {
    expect(() =>
      zoomArmyFormationBackgroundTransformAtPoint(
        { scale: 1, offsetXPx: -Number.MAX_VALUE, offsetYPx: 0 },
        { xPx: Number.MAX_VALUE, yPx: 0 },
        8,
      ),
    ).toThrow('anchor delta xPx must be a finite number; received Infinity.');
  });
});
