// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { getBorderById } from '@/lib/templates/borders';
import {
  getImageBorderInteriorMaskId,
  getTokenRenderAssetUrls,
  shouldApplyImageBorderInteriorFallback,
} from './pipeline';
import type { EditorState } from '@/types/editor';

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
