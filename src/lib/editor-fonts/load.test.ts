import { describe, expect, it, vi } from 'vitest';

import type { TextBox } from '@/types/editor';
import { preloadEditorFonts, type EditorFontFaceSet } from './load';

function createTextBox(overrides: Partial<TextBox>): TextBox {
  return {
    id: 'caption',
    content: 'Token Maker',
    x: 256,
    y: 256,
    fontSize: 32,
    fontWeight: 400,
    color: '#ffffff',
    align: 'center',
    ...overrides,
  };
}

function createFontFaceSet(loadResults: readonly unknown[] = [{}]): EditorFontFaceSet {
  return {
    load: vi.fn().mockResolvedValue(loadResults),
  };
}

describe('preloadEditorFonts', () => {
  it('does not request FontFace loading for the system font', async () => {
    const fontFaceSet = createFontFaceSet();

    await preloadEditorFonts(
      [createTextBox({ fontId: 'system-sans' })],
      fontFaceSet,
    );

    expect(fontFaceSet.load).not.toHaveBeenCalled();
  });

  it('loads each local font once with its first non-empty text content', async () => {
    const fontFaceSet = createFontFaceSet();

    await preloadEditorFonts(
      [
        createTextBox({ id: 'empty', fontId: 'noto-serif-sc', content: '' }),
        createTextBox({ id: 'dragon', fontId: 'noto-serif-sc', content: '龙 Dragon' }),
        createTextBox({ id: 'shield', fontId: 'noto-serif-sc', content: '盾 Shield' }),
      ],
      fontFaceSet,
    );

    expect(fontFaceSet.load).toHaveBeenCalledTimes(1);
    expect(fontFaceSet.load).toHaveBeenCalledWith(
      '400 48px "Noto Serif SC", serif',
      '龙 Dragon',
    );
  });

  it('names the local font when no matching FontFace loads', async () => {
    const fontFaceSet = createFontFaceSet([]);

    await expect(
      preloadEditorFonts(
        [createTextBox({ fontId: 'zhi-mang-xing', content: '荣耀' })],
        fontFaceSet,
      ),
    ).rejects.toThrow('zhi-mang-xing');
  });

  it('names the resolved local font when the Font Loading API is unavailable', async () => {
    vi.stubGlobal('document', {});

    try {
      await expect(
        preloadEditorFonts([createTextBox({ fontId: 'noto-serif-sc' })]),
      ).rejects.toThrow(
        'Editor font loading is unavailable for font "noto-serif-sc"',
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
