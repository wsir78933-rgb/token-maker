// @vitest-environment jsdom

import { describe, expect, it, vi, type MockInstance } from 'vitest';

import { getBorderById } from '@/lib/templates/borders';
import {
  getImageBorderInteriorMaskId,
  getTokenRenderAssetUrls,
  exportTokenAsPNG,
  preloadTokenRenderAssets,
  renderToken,
  shouldApplyImageBorderInteriorFallback,
} from './pipeline';
import type { EditorState } from '@/types/editor';

const renderAssetMocks = vi.hoisted(() => ({
  getCachedImage: vi.fn(),
  preloadEditorFonts: vi.fn(),
  preloadImageToCache: vi.fn(),
}));

const rendererMocks = vi.hoisted(() => ({
  createMaskPathWithInset: vi.fn(() => ({} as Path2D)),
  drawBorder: vi.fn(),
}));

vi.mock('@/lib/editor-fonts/load', () => ({
  preloadEditorFonts: renderAssetMocks.preloadEditorFonts,
}));

vi.mock('@/lib/utils/imageCache', () => ({
  getCachedImage: renderAssetMocks.getCachedImage,
  preloadImageToCache: renderAssetMocks.preloadImageToCache,
}));

vi.mock('./borders', () => ({
  drawBorder: rendererMocks.drawBorder,
}));

vi.mock('./masks', () => ({
  createMaskPathWithInset: rendererMocks.createMaskPathWithInset,
}));

function createState(overrides: Partial<EditorState>): EditorState {
  return {
    selectedBorderId: 'none',
    customBorders: [],
    selectedMaskId: 'circle',
    imageUrl: null,
    imageElement: null,
    imageLoadRevision: 0,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageScale: 1,
    borderLibraryMode: 'default',
    borderTint: '#ffffff',
    imageBorderTintEnabled: true,
    textColor: '#ffffff',
    overlayTint: '#000000',
    borderOpacity: 1,
    overlayOpacity: 0,
    textBoxes: [],
    selectedTextId: null,
    isImageSelected: false,
    exportSize: 512,
    activePresetId: null,
    renderRevision: 0,
    ...overrides,
  };
}

describe('getTokenRenderAssetUrls', () => {
  it('collects both image border and explicit mask assets for TFF borders', () => {
    expect(
      getTokenRenderAssetUrls(createState({ selectedBorderId: 'tff-gilded-ring' }))
    ).toEqual([
      '/borders/tff/tff-gilded-ring.webp',
      '/masks/tff/tff-gilded-ring.webp',
    ]);
  });

  it('collects custom image border assets before export', () => {
    const customImageUrl = 'data:image/png;base64,border';

    expect(
      getTokenRenderAssetUrls(
        createState({
          selectedBorderId: 'custom-border',
          customBorders: [
            {
              id: 'custom-border',
              name: 'Custom',
              type: 'image',
              isCustom: true,
              customImageUrl,
            },
          ],
        })
      )
    ).toEqual([customImageUrl]);
  });
});

describe('preloadTokenRenderAssets', () => {
  it('preloads image assets and selected local fonts before rendering', async () => {
    const state = createState({
      selectedBorderId: 'tff-gilded-ring',
      textBoxes: [
        {
          id: 'caption',
          content: '龙 Dragon',
          fontId: 'noto-serif-sc',
          x: 256,
          y: 256,
          fontSize: 32,
          fontWeight: 400,
          color: '#ffffff',
          align: 'center',
        },
      ],
    });
    renderAssetMocks.preloadEditorFonts.mockResolvedValue(undefined);
    renderAssetMocks.preloadImageToCache.mockResolvedValue(new Image());

    await preloadTokenRenderAssets(state);

    expect(renderAssetMocks.preloadEditorFonts).toHaveBeenCalledWith(state.textBoxes);
    expect(renderAssetMocks.preloadImageToCache).toHaveBeenCalledWith(
      '/borders/tff/tff-gilded-ring.webp',
    );
    expect(renderAssetMocks.preloadImageToCache).toHaveBeenCalledWith(
      '/masks/tff/tff-gilded-ring.webp',
    );
  });

  it('propagates the selected font loading failure', async () => {
    const fontLoadingError = new Error(
      'Editor font failed to load: "noto-serif-sc"',
    );
    renderAssetMocks.preloadEditorFonts.mockRejectedValue(fontLoadingError);

    await expect(preloadTokenRenderAssets(createState({ textBoxes: [] }))).rejects.toBe(
      fontLoadingError,
    );
  });
});

describe('exportTokenAsPNG', () => {
  it('does not render or produce a fallback PNG when font preloading fails', async () => {
    const fontLoadingError = new Error(
      'Editor font failed to load: "noto-serif-sc"',
    );
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const createElementSpy = vi.spyOn(document, 'createElement');
    const toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, 'toBlob');
    renderAssetMocks.preloadEditorFonts.mockRejectedValue(fontLoadingError);

    try {
      await expect(exportTokenAsPNG(createState({ textBoxes: [] }), 512)).resolves.toBeNull();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to preload token render assets.',
        fontLoadingError,
      );
      expect(createElementSpy).not.toHaveBeenCalledWith('canvas');
      expect(toBlobSpy).not.toHaveBeenCalled();
    } finally {
      consoleWarnSpy.mockRestore();
      createElementSpy.mockRestore();
      toBlobSpy.mockRestore();
    }
  });

  it('keeps the default border inset ratio for PNG export', async () => {
    const { contextByCanvas, getContextSpy } = spyOnGetContextPerCanvas();
    const toBlobSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation((callback) => callback(new Blob(['token'], { type: 'image/png' })));
    const ringBorder = { id: 'export-inset-test-ring', name: 'Export inset test', type: 'ring' as const };
    renderAssetMocks.preloadEditorFonts.mockResolvedValue(undefined);
    rendererMocks.createMaskPathWithInset.mockClear();
    rendererMocks.drawBorder.mockClear();

    try {
      await expect(
        exportTokenAsPNG(
          createState({
            selectedBorderId: ringBorder.id,
            customBorders: [ringBorder],
          }),
          200,
        ),
      ).resolves.toBeInstanceOf(Blob);
    } finally {
      getContextSpy.mockRestore();
      toBlobSpy.mockRestore();
    }

    expect(rendererMocks.createMaskPathWithInset).toHaveBeenCalledTimes(3);
    expect(rendererMocks.createMaskPathWithInset).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: 'circle' }),
      200,
      6.4,
    );
    const exportTargetCanvas = [...contextByCanvas.keys()][0];
    if (!exportTargetCanvas) {
      throw new Error('exportTokenAsPNG did not acquire a canvas rendering context');
    }

    expect(rendererMocks.drawBorder).toHaveBeenCalledWith(
      renderingContextFor(contextByCanvas, exportTargetCanvas, 'export-target'),
      ringBorder,
      200,
      '#ffffff',
      1,
      true,
      undefined,
      0.032,
    );
  });
});

describe('getImageBorderInteriorMaskId', () => {
  it('uses the linked mask as the final interior clip for preset image borders', () => {
    expect(
      getImageBorderInteriorMaskId(
        createState({ selectedMaskId: 'square' }),
        getBorderById('rogue-border-07')
      )
    ).toBe('circle');
  });
});

describe('shouldApplyImageBorderInteriorFallback', () => {
  it('does not expand the final mask when the border already encloses the portrait area', () => {
    expect(shouldApplyImageBorderInteriorFallback('circle', false)).toBe(false);
  });

  it('adds the interior fallback only when the border center is connected to the outside', () => {
    expect(shouldApplyImageBorderInteriorFallback('circle', true)).toBe(true);
  });
});

function createRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const gradient = { addColorStop: vi.fn() } as unknown as CanvasGradient;

  return {
    canvas,
    clearRect: vi.fn(),
    clip: vi.fn(),
    createImageData: vi.fn((width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
    } as ImageData)),
    createLinearGradient: vi.fn(() => gradient),
    drawImage: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
    font: '10px sans-serif',
    getImageData: vi.fn((_x: number, _y: number, width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
    } as ImageData)),
    globalCompositeOperation: 'source-over',
    globalAlpha: 1,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    lineCap: 'butt',
    lineJoin: 'miter',
    lineWidth: 1,
    putImageData: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    setTransform: vi.fn(),
    shadowBlur: 0,
    shadowColor: 'transparent',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    stroke: vi.fn(),
    strokeStyle: '',
    textAlign: 'start',
    textBaseline: 'alphabetic',
  } as unknown as CanvasRenderingContext2D;
}

function renderingContextFor(
  contextByCanvas: Map<HTMLCanvasElement, CanvasRenderingContext2D>,
  canvas: HTMLCanvasElement,
  canvasRole: string
): CanvasRenderingContext2D {
  const renderingContext = contextByCanvas.get(canvas);
  if (!renderingContext) {
    throw new Error(
      `Missing ${canvasRole} rendering context for canvas width=${String(canvas.width)}`
    );
  }
  return renderingContext;
}

function spyOnGetContextPerCanvas(options: { attachReset?: boolean } = {}) {
  const contextByCanvas = new Map<HTMLCanvasElement, CanvasRenderingContext2D>();
  const getContextSpy = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(function (this: HTMLCanvasElement) {
      const existingContext = contextByCanvas.get(this);
      if (existingContext) {
        return existingContext;
      }

      const renderingContext = createRenderingContext(this);
      if (options.attachReset) {
        renderingContext.reset = vi.fn(() => {
          renderingContext.imageSmoothingEnabled = false;
          renderingContext.imageSmoothingQuality = 'low';
        });
      }
      contextByCanvas.set(this, renderingContext);
      return renderingContext;
    });

  return { contextByCanvas, getContextSpy };
}

function createdCanvasElements(
  createElementSpy: MockInstance<typeof document.createElement>
): HTMLCanvasElement[] {
  return createElementSpy.mock.calls.flatMap((args, index) => {
    if (args[0] !== 'canvas') return [];
    const result = createElementSpy.mock.results[index];
    if (result.type !== 'return') return [];
    return [result.value as HTMLCanvasElement];
  });
}

function trackNumericPropertyWrites(
  target: HTMLCanvasElement,
  propertyName: 'width' | 'height'
): { assignCount: number } {
  const writes = { assignCount: 0 };
  let currentValue = target[propertyName];
  Object.defineProperty(target, propertyName, {
    configurable: true,
    get: () => currentValue,
    set: (value: number) => {
      writes.assignCount += 1;
      currentValue = value;
    },
  });
  return writes;
}

function renderRingToken(options: Parameters<typeof renderToken>[3]) {
  const targetCanvas = document.createElement('canvas');
  const { contextByCanvas, getContextSpy } = spyOnGetContextPerCanvas();
  const ringBorder = { id: 'inset-test-ring', name: 'Inset test', type: 'ring' as const };

  try {
    renderToken(
      targetCanvas,
      createState({
        selectedBorderId: ringBorder.id,
        customBorders: [ringBorder],
      }),
      200,
      options,
    );
  } finally {
    getContextSpy.mockRestore();
  }

  return {
    renderingContext: renderingContextFor(contextByCanvas, targetCanvas, 'target'),
    ringBorder,
  };
}

describe('renderToken border inset options', () => {
  it.each([
    {
      description: 'uses the default ratio when the option is omitted',
      options: { clipFinalOutputToMask: true },
      expectedInset: 6.4,
      expectedRatio: 0.032,
    },
    {
      description: 'uses the supplied ratio for every mask, shadow, and visible border',
      options: { borderInsetRatio: 0.008, clipFinalOutputToMask: true },
      expectedInset: 1.6,
      expectedRatio: 0.008,
    },
  ])('$description', ({ options, expectedInset, expectedRatio }) => {
    rendererMocks.createMaskPathWithInset.mockClear();
    rendererMocks.drawBorder.mockClear();

    const { renderingContext, ringBorder } = renderRingToken(options);

    expect(rendererMocks.createMaskPathWithInset).toHaveBeenCalledTimes(3);
    expect(rendererMocks.createMaskPathWithInset).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: 'circle' }),
      200,
      expectedInset,
    );
    expect(rendererMocks.createMaskPathWithInset).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: 'circle' }),
      200,
      expectedInset,
    );
    expect(rendererMocks.createMaskPathWithInset).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ id: 'circle' }),
      200,
      expectedInset,
    );
    expect(rendererMocks.drawBorder).toHaveBeenCalledWith(
      renderingContext,
      ringBorder,
      200,
      '#ffffff',
      1,
      true,
      undefined,
      expectedRatio,
    );
  });

  it('keeps image-border masks distinct for each inset ratio', () => {
    const renderingContext = createRenderingContext(document.createElement('canvas'));
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(renderingContext);
    const borderImage = {} as HTMLImageElement;
    const imageBorder = {
      id: 'inset-cache-image-border',
      name: 'Inset cache image border',
      type: 'image' as const,
      isCustom: true,
      customImageUrl: 'data:image/png;base64,inset-cache-image-border',
    };
    const state = createState({
      selectedBorderId: imageBorder.id,
      customBorders: [imageBorder],
    });
    renderAssetMocks.getCachedImage.mockReturnValue(borderImage);

    try {
      renderToken(document.createElement('canvas'), state, 200, {
        borderInsetRatio: 0.008,
        clipFinalOutputToMask: true,
      });
      renderToken(document.createElement('canvas'), state, 200, {
        borderInsetRatio: 0.016,
        clipFinalOutputToMask: true,
      });
    } finally {
      getContextSpy.mockRestore();
      renderAssetMocks.getCachedImage.mockReset();
    }

    expect(renderingContext.drawImage).toHaveBeenCalledWith(
      borderImage,
      1.6,
      1.6,
      196.8,
      196.8,
    );
    expect(renderingContext.drawImage).toHaveBeenCalledWith(
      borderImage,
      3.2,
      3.2,
      193.6,
      193.6,
    );
    expect(renderingContext.getImageData).toHaveBeenCalledTimes(2);
  });
});

describe('renderToken intermediate buffer reuse', () => {
  it('reuses one same-size base layer across consecutive renders of the same target', () => {
    const targetCanvas = document.createElement('canvas');
    const { getContextSpy } = spyOnGetContextPerCanvas();
    const createElementSpy = vi.spyOn(document, 'createElement');

    try {
      renderToken(targetCanvas, createState({}), 200);
      const canvasesAfterFirstRender = createdCanvasElements(createElementSpy);
      expect(canvasesAfterFirstRender).toHaveLength(1);

      renderToken(targetCanvas, createState({ overlayOpacity: 0.4, overlayTint: '#ff0000' }), 200);
      renderToken(targetCanvas, createState({}), 200);

      expect(createdCanvasElements(createElementSpy)).toEqual(canvasesAfterFirstRender);
      expect(canvasesAfterFirstRender[0].width).toBe(200);
      expect(canvasesAfterFirstRender[0].height).toBe(200);
    } finally {
      createElementSpy.mockRestore();
      getContextSpy.mockRestore();
    }
  });

  it('keeps a separate base layer for each target canvas', () => {
    const firstTarget = document.createElement('canvas');
    const secondTarget = document.createElement('canvas');
    const { contextByCanvas, getContextSpy } = spyOnGetContextPerCanvas();
    const createElementSpy = vi.spyOn(document, 'createElement');

    try {
      renderToken(firstTarget, createState({}), 180);
      renderToken(secondTarget, createState({}), 180);
      const [firstBaseLayer, secondBaseLayer] = createdCanvasElements(createElementSpy);

      expect(createdCanvasElements(createElementSpy)).toHaveLength(2);
      expect(firstBaseLayer).not.toBe(secondBaseLayer);
      expect(renderingContextFor(contextByCanvas, firstTarget, 'first-target').canvas).toBe(firstTarget);
      expect(renderingContextFor(contextByCanvas, secondTarget, 'second-target').canvas).toBe(secondTarget);
      expect(renderingContextFor(contextByCanvas, firstBaseLayer, 'first-base-layer').canvas).toBe(
        firstBaseLayer
      );
      expect(renderingContextFor(contextByCanvas, secondBaseLayer, 'second-base-layer').canvas).toBe(
        secondBaseLayer
      );

      renderToken(firstTarget, createState({}), 180);
      expect(createdCanvasElements(createElementSpy)).toHaveLength(2);
    } finally {
      createElementSpy.mockRestore();
      getContextSpy.mockRestore();
    }
  });

  it('skips same-size dimension writes when reset is available and still resizes on output change', () => {
    const targetCanvas = document.createElement('canvas');
    const { contextByCanvas, getContextSpy } = spyOnGetContextPerCanvas({ attachReset: true });
    const createElementSpy = vi.spyOn(document, 'createElement');

    try {
      renderToken(targetCanvas, createState({}), 128);
      const [baseLayer] = createdCanvasElements(createElementSpy);
      expect(baseLayer.width).toBe(128);
      expect(baseLayer.height).toBe(128);

      const targetContext = renderingContextFor(contextByCanvas, targetCanvas, 'target');
      const baseContext = renderingContextFor(contextByCanvas, baseLayer, 'base-layer');
      vi.mocked(targetContext.reset).mockClear();
      vi.mocked(baseContext.reset).mockClear();

      const targetWidthWrites = trackNumericPropertyWrites(targetCanvas, 'width');
      const targetHeightWrites = trackNumericPropertyWrites(targetCanvas, 'height');
      const baseWidthWrites = trackNumericPropertyWrites(baseLayer, 'width');
      const baseHeightWrites = trackNumericPropertyWrites(baseLayer, 'height');

      renderToken(targetCanvas, createState({}), 128);
      expect(createdCanvasElements(createElementSpy)).toHaveLength(1);
      expect(targetContext.reset).toHaveBeenCalledTimes(1);
      expect(baseContext.reset).toHaveBeenCalledTimes(1);
      expect(targetWidthWrites.assignCount).toBe(0);
      expect(targetHeightWrites.assignCount).toBe(0);
      expect(baseWidthWrites.assignCount).toBe(0);
      expect(baseHeightWrites.assignCount).toBe(0);
      expect(targetContext.imageSmoothingEnabled).toBe(true);
      expect(targetContext.imageSmoothingQuality).toBe('high');
      expect(baseContext.imageSmoothingEnabled).toBe(true);
      expect(baseContext.imageSmoothingQuality).toBe('high');

      renderToken(targetCanvas, createState({}), 256);
      expect(createdCanvasElements(createElementSpy)).toHaveLength(1);
      expect(targetWidthWrites.assignCount).toBe(1);
      expect(targetHeightWrites.assignCount).toBe(1);
      expect(baseWidthWrites.assignCount).toBe(1);
      expect(baseHeightWrites.assignCount).toBe(1);
      expect(baseLayer.width).toBe(256);
      expect(baseLayer.height).toBe(256);
    } finally {
      createElementSpy.mockRestore();
      getContextSpy.mockRestore();
    }
  });

  it('rewrites same-size canvas dimensions when reset is unavailable', () => {
    const targetCanvas = document.createElement('canvas');
    const { contextByCanvas, getContextSpy } = spyOnGetContextPerCanvas();
    const createElementSpy = vi.spyOn(document, 'createElement');

    try {
      renderToken(targetCanvas, createState({}), 96);
      const [baseLayer] = createdCanvasElements(createElementSpy);
      const targetContext = renderingContextFor(contextByCanvas, targetCanvas, 'target');
      const baseContext = renderingContextFor(contextByCanvas, baseLayer, 'base-layer');

      expect(targetContext.canvas).toBe(targetCanvas);
      expect(baseContext.canvas).toBe(baseLayer);
      expect(targetContext.reset).toBeUndefined();
      expect(baseContext.reset).toBeUndefined();

      targetContext.imageSmoothingEnabled = false;
      targetContext.imageSmoothingQuality = 'low';
      baseContext.imageSmoothingEnabled = false;
      baseContext.imageSmoothingQuality = 'low';

      const targetWidthWrites = trackNumericPropertyWrites(targetCanvas, 'width');
      const targetHeightWrites = trackNumericPropertyWrites(targetCanvas, 'height');
      const baseWidthWrites = trackNumericPropertyWrites(baseLayer, 'width');
      const baseHeightWrites = trackNumericPropertyWrites(baseLayer, 'height');

      renderToken(targetCanvas, createState({}), 96);

      expect(createdCanvasElements(createElementSpy)).toHaveLength(1);
      expect(targetWidthWrites.assignCount).toBe(1);
      expect(targetHeightWrites.assignCount).toBe(1);
      expect(baseWidthWrites.assignCount).toBe(1);
      expect(baseHeightWrites.assignCount).toBe(1);
      expect(targetCanvas.width).toBe(96);
      expect(baseLayer.width).toBe(96);
      expect(targetContext.imageSmoothingEnabled).toBe(true);
      expect(targetContext.imageSmoothingQuality).toBe('high');
      expect(baseContext.imageSmoothingEnabled).toBe(true);
      expect(baseContext.imageSmoothingQuality).toBe('high');
    } finally {
      createElementSpy.mockRestore();
      getContextSpy.mockRestore();
    }
  });

  it('still honors clipFinalOutputToMask and a custom border inset ratio while reusing the buffer', () => {
    rendererMocks.createMaskPathWithInset.mockClear();
    rendererMocks.drawBorder.mockClear();

    const targetCanvas = document.createElement('canvas');
    const { contextByCanvas, getContextSpy } = spyOnGetContextPerCanvas();
    const ringBorder = { id: 'reuse-inset-ring', name: 'Reuse inset', type: 'ring' as const };

    try {
      const state = createState({
        selectedBorderId: ringBorder.id,
        customBorders: [ringBorder],
      });
      const options = { borderInsetRatio: 0.008, clipFinalOutputToMask: true };

      renderToken(targetCanvas, state, 200, options);
      renderToken(targetCanvas, state, 200, options);
    } finally {
      getContextSpy.mockRestore();
    }

    expect(rendererMocks.createMaskPathWithInset).toHaveBeenCalledTimes(6);
    expect(rendererMocks.drawBorder).toHaveBeenNthCalledWith(
      2,
      renderingContextFor(contextByCanvas, targetCanvas, 'target'),
      ringBorder,
      200,
      '#ffffff',
      1,
      true,
      undefined,
      0.008,
    );
  });
});
