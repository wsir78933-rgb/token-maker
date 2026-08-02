// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

import { getBorderById } from '@/lib/templates/borders';
import {
  getImageBorderInteriorMaskId,
  getTokenRenderAssetUrls,
  exportTokenAsPNG,
  preloadTokenRenderAssets,
  shouldApplyImageBorderInteriorFallback,
} from './pipeline';
import type { EditorState } from '@/types/editor';

const renderAssetMocks = vi.hoisted(() => ({
  preloadEditorFonts: vi.fn(),
  preloadImageToCache: vi.fn(),
}));

vi.mock('@/lib/editor-fonts/load', () => ({
  preloadEditorFonts: renderAssetMocks.preloadEditorFonts,
}));

vi.mock('@/lib/utils/imageCache', () => ({
  getCachedImage: vi.fn(),
  preloadImageToCache: renderAssetMocks.preloadImageToCache,
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
