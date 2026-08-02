// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

import { drawBorder } from './borders';
import type { BorderTemplate } from '@/types/editor';

const borderMocks = vi.hoisted(() => ({
  getCachedImage: vi.fn(),
}));

vi.mock('@/lib/utils/imageCache', () => ({
  getCachedImage: borderMocks.getCachedImage,
}));

function createRenderingContext(): CanvasRenderingContext2D {
  const gradient = { addColorStop: vi.fn() } as unknown as CanvasGradient;

  return {
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    closePath: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    createRadialGradient: vi.fn(() => gradient),
    drawImage: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    shadowBlur: 0,
    shadowColor: 'transparent',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  } as unknown as CanvasRenderingContext2D;
}

function renderImageBorderAtTwoInsetRatios(
  canvasContext: CanvasRenderingContext2D,
  border: BorderTemplate,
  borderImage: HTMLImageElement,
) {
  borderMocks.getCachedImage.mockReturnValue(borderImage);

  drawBorder(canvasContext, border, 200, '#ffffff', 1, false, undefined, 0.008);
  drawBorder(canvasContext, border, 200, '#ffffff', 1, false, undefined, 0.032);
}

describe('drawBorder image cache', () => {
  it('rebuilds depth and edge geometry when an image border inset ratio changes', () => {
    const canvasContext = createRenderingContext();
    const offscreenContext = createRenderingContext();
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(offscreenContext);
    const borderImage = {} as HTMLImageElement;
    const imageBorder: BorderTemplate = {
      id: 'image-inset-cache-test',
      name: 'Image inset cache test',
      type: 'image',
      isCustom: true,
      customImageUrl: 'data:image/png;base64,image-inset-cache-test',
    };

    try {
      renderImageBorderAtTwoInsetRatios(canvasContext, imageBorder, borderImage);
    } finally {
      getContextSpy.mockRestore();
      borderMocks.getCachedImage.mockReset();
    }

    const borderImageDrawCalls = vi
      .mocked(offscreenContext.drawImage)
      .mock.calls
      .filter(([source]) => source === borderImage);

    expect(borderImageDrawCalls).toEqual([
      [borderImage, 1.6, 1.6, 196.8, 196.8],
      [borderImage, 6.4, 6.4, 187.2, 187.2],
    ]);
    expect(offscreenContext.clearRect).toHaveBeenCalledTimes(4);
  });
});

describe('drawBorder flat polygon cache', () => {
  it('rebuilds an un-stroked flat polygon when the inset ratio changes', () => {
    const canvasContext = createRenderingContext();
    const offscreenContext = createRenderingContext();
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(offscreenContext);
    const flatPolygonBorder: BorderTemplate = {
      id: 'flat-polygon-inset-cache-test',
      name: 'Flat polygon inset cache test',
      type: 'flat-polygon',
      sides: 6,
      strokeWidth: 0,
    };

    try {
      drawBorder(canvasContext, flatPolygonBorder, 200, '#ffffff', 1, true, undefined, 0.008);
      drawBorder(canvasContext, flatPolygonBorder, 200, '#ffffff', 1, true, undefined, 0.032);
    } finally {
      getContextSpy.mockRestore();
    }

    expect(offscreenContext.beginPath).toHaveBeenCalledTimes(2);
  });
});
