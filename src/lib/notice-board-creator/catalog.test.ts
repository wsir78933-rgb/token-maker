import { describe, expect, it } from 'vitest';

import {
  NOTICE_BOARD_FONTS,
  NOTICE_PAPER_ASSETS,
  isNoticePaperId,
} from '@/lib/notice-board-creator/catalog';

describe('notice board catalog', () => {
  it('exposes all twelve numbered paper templates with the reference proportions', () => {
    expect(NOTICE_PAPER_ASSETS.map((paper) => paper.id)).toEqual(
      Array.from({ length: 12 }, (_, index) => `paper-${String(index + 1).padStart(2, '0')}`),
    );
    expect(NOTICE_PAPER_ASSETS.every((paper) => paper.width === 347 && paper.height === 500)).toBe(true);
    expect(NOTICE_PAPER_ASSETS.map((paper) => paper.src)).toEqual(
      Array.from(
        { length: 12 },
        (_, index) => `/notice-board-creator/papers/paper-${String(index + 1).padStart(2, '0')}.png`,
      ),
    );
  });

  it('accepts only the twelve catalog paper ids', () => {
    expect(isNoticePaperId('paper-01')).toBe(true);
    expect(isNoticePaperId('paper-12')).toBe(true);
    expect(isNoticePaperId('paper-00')).toBe(false);
    expect(isNoticePaperId('paper-13')).toBe(false);
    expect(isNoticePaperId('paper-1')).toBe(false);
  });

  it('exposes the eight built-in font families', () => {
    expect(NOTICE_BOARD_FONTS.map((font) => font.label)).toEqual([
      'Trebuchet',
      'Verdana',
      'Courier New',
      'Lucida',
      'Impact',
      'Comic Sans',
      'Arial Black',
      'Times New Roman',
    ]);
    expect(NOTICE_BOARD_FONTS.every((font) => font.family.trim().length > 0)).toBe(true);
  });
});
