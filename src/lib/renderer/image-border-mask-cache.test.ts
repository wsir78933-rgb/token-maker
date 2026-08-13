// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { CanvasByteBudgetLruCache } from './image-border-mask-cache';

describe('CanvasByteBudgetLruCache', () => {
  it('evicts the least-recently-used canvas and releases its backing store', () => {
    const cache = new CanvasByteBudgetLruCache(32);
    const leastRecentlyUsedCanvas = createCanvas(2, 2);
    const recentlyUsedCanvas = createCanvas(2, 2);
    const incomingCanvas = createCanvas(2, 2);

    cache.set('least-recently-used', leastRecentlyUsedCanvas);
    cache.set('recently-used', recentlyUsedCanvas);
    expect(cache.get('least-recently-used')).toBe(leastRecentlyUsedCanvas);

    cache.set('incoming', incomingCanvas);

    expect(cache.get('recently-used')).toBeUndefined();
    expect(recentlyUsedCanvas.width).toBe(0);
    expect(recentlyUsedCanvas.height).toBe(0);
    expect(cache.get('least-recently-used')).toBe(leastRecentlyUsedCanvas);
    expect(cache.get('incoming')).toBe(incomingCanvas);
  });

  it('evicts enough canvases to stay within its byte budget', () => {
    const cache = new CanvasByteBudgetLruCache(32);
    const firstCanvas = createCanvas(2, 2);
    const secondCanvas = createCanvas(2, 2);
    const largerCanvas = createCanvas(3, 2);

    cache.set('first', firstCanvas);
    cache.set('second', secondCanvas);
    cache.set('larger', largerCanvas);

    expect(cache.get('first')).toBeUndefined();
    expect(cache.get('second')).toBeUndefined();
    expect(firstCanvas.width).toBe(0);
    expect(secondCanvas.width).toBe(0);
    expect(cache.get('larger')).toBe(largerCanvas);
  });

  it('releases the replaced canvas backing store', () => {
    const cache = new CanvasByteBudgetLruCache(64);
    const replacedCanvas = createCanvas(2, 2);
    const replacementCanvas = createCanvas(3, 2);

    cache.set('border-mask', replacedCanvas);
    cache.set('border-mask', replacementCanvas);

    expect(replacedCanvas.width).toBe(0);
    expect(replacedCanvas.height).toBe(0);
    expect(cache.get('border-mask')).toBe(replacementCanvas);
  });
});

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
