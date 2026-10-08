import { describe, expect, it } from 'vitest';

import {
  clampScrollImageDrag,
  clampScrollPaperSize,
  requireScrollImageGeometry,
  requireScrollPaperBounds,
  resizeScrollImageGeometry,
} from './geometry';

describe('scroll image geometry', () => {
  it('requires finite positive dimensions and reports invalid values', () => {
    expect(requireScrollImageGeometry({ x: 4, y: 8, width: 80, height: 60 })).toEqual({
      x: 4,
      y: 8,
      width: 80,
      height: 60,
    });
    expect(() => requireScrollImageGeometry({ x: 0, y: 0, width: 0, height: 60 })).toThrow(
      'received 0',
    );
    expect(() => requireScrollPaperBounds({ width: Number.NaN, height: 865 })).toThrow(
      'received NaN',
    );
  });

  it('keeps dragged images inside the paper bounds', () => {
    expect(
      clampScrollImageDrag(
        { x: -50, y: 900, width: 200, height: 100 },
        { width: 600, height: 865 },
      ),
    ).toEqual({ x: 0, y: 765, width: 200, height: 100 });
  });

  it('rounds and clamps paper drag dimensions to the shared project limits', () => {
    expect(clampScrollPaperSize(160, 160)).toEqual({ width: 160, height: 160 });
    expect(clampScrollPaperSize(2_400, 3_600)).toEqual({ width: 2_400, height: 3_600 });
    expect(clampScrollPaperSize(159.49, 159.5)).toEqual({ width: 160, height: 160 });
    expect(clampScrollPaperSize(2_400.49, 3_600.5)).toEqual({ width: 2_400, height: 3_600 });
    expect(clampScrollPaperSize(1_000_000, -1_000_000)).toEqual({ width: 2_400, height: 160 });
  });

  it('fails fast for non-finite or non-number paper drag dimensions', () => {
    expect(() => clampScrollPaperSize(Number.NaN, 865)).toThrow('paper width');
    expect(() => clampScrollPaperSize(600, Number.POSITIVE_INFINITY)).toThrow('paper height');
    expect(() => clampScrollPaperSize('600' as never, 865)).toThrow('received "600"');
    expect(() => clampScrollPaperSize(600, null as never)).toThrow('received null');
  });

  it('resizes within minimum, maximum, and paper-edge limits', () => {
    expect(
      resizeScrollImageGeometry(
        { x: 100, y: 80, width: 100, height: 90 },
        { width: 800, height: 900 },
        { width: 600, height: 865 },
      ),
    ).toEqual({ x: 100, y: 80, width: 500, height: 785 });
    expect(
      resizeScrollImageGeometry(
        { x: 0, y: 0, width: 100, height: 100 },
        { width: -1_000, height: -1_000 },
        { width: 600, height: 865 },
      ),
    ).toEqual({ x: 0, y: 0, width: 8, height: 8 });
    expect(() =>
      resizeScrollImageGeometry(
        { x: 0, y: 0, width: 100, height: 100 },
        { width: Number.POSITIVE_INFINITY, height: 0 },
        { width: 600, height: 865 },
      ),
    ).toThrow('delta.width');
  });

  it('supports all four resize corners while keeping the opposite corner anchored', () => {
    const geometry = { x: 100, y: 100, width: 100, height: 100 };
    const delta = { width: 20, height: 30 };
    const paperBounds = { width: 600, height: 865 };

    expect(resizeScrollImageGeometry(geometry, delta, paperBounds, 'north-west')).toEqual({
      x: 80,
      y: 70,
      width: 120,
      height: 130,
    });
    expect(resizeScrollImageGeometry(geometry, delta, paperBounds, 'north-east')).toEqual({
      x: 100,
      y: 70,
      width: 120,
      height: 130,
    });
    expect(resizeScrollImageGeometry(geometry, delta, paperBounds, 'south-west')).toEqual({
      x: 80,
      y: 100,
      width: 120,
      height: 130,
    });
    expect(resizeScrollImageGeometry(geometry, delta, paperBounds, 'south-east')).toEqual({
      x: 100,
      y: 100,
      width: 120,
      height: 130,
    });
    expect(resizeScrollImageGeometry(geometry, delta, paperBounds)).toEqual(
      resizeScrollImageGeometry(geometry, delta, paperBounds, 'south-east'),
    );
  });

  it('clamps corner resizing to the anchored edge and rejects unknown corners', () => {
    expect(
      resizeScrollImageGeometry(
        { x: 100, y: 100, width: 100, height: 100 },
        { width: 1_000, height: 1_000 },
        { width: 600, height: 865 },
        'north-west',
      ),
    ).toEqual({ x: 0, y: 0, width: 200, height: 200 });
    expect(
      resizeScrollImageGeometry(
        { x: 100, y: 100, width: 100, height: 100 },
        { width: -1_000, height: -1_000 },
        { width: 600, height: 865 },
        'north-west',
      ),
    ).toEqual({ x: 192, y: 192, width: 8, height: 8 });
    expect(() =>
      resizeScrollImageGeometry(
        { x: 0, y: 0, width: 100, height: 100 },
        { width: 10, height: 10 },
        { width: 600, height: 865 },
        'middle' as never,
      ),
    ).toThrow('received "middle"');
  });
});
