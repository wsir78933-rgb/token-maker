// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

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
    const renderingContext = createRenderingContext();
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(renderingContext);
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
    expect(rendererMocks.drawBorder).toHaveBeenCalledWith(
      renderingContext,
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

function createRenderingContext(): CanvasRenderingContext2D {
  const gradient = { addColorStop: vi.fn() } as unknown as CanvasGradient;

  return {
    canvas: document.createElement('canvas'),
    clearRect: vi.fn(),
    clip: vi.fn(),
    createImageData: vi.fn((width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
    } as ImageData)),
    createLinearGradient: vi.fn(() => gradient),
    drawImage: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
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
    shadowBlur: 0,
    shadowColor: 'transparent',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    stroke: vi.fn(),
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D;
}

function renderRingToken(options: Parameters<typeof renderToken>[3]) {
  const renderingContext = createRenderingContext();
  const getContextSpy = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(renderingContext);
  const ringBorder = { id: 'inset-test-ring', name: 'Inset test', type: 'ring' as const };

  try {
    renderToken(
      document.createElement('canvas'),
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

  return { renderingContext, ringBorder };
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
    const renderingContext = createRenderingContext();
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
