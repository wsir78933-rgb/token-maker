import { describe, expect, it } from 'vitest';

import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';

describe('scroll creator copy', () => {
  it('keeps the English and Simplified Chinese tool dictionaries in parity', () => {
    const englishCopy = getScrollCreatorCopy('en');
    const chineseCopy = getScrollCreatorCopy('zh');
    const englishKeys = Object.keys(englishCopy).sort();
    const chineseKeys = Object.keys(chineseCopy).sort();

    expect(chineseKeys).toEqual(englishKeys);

    for (const key of englishKeys) {
      const englishValue = englishCopy[key as keyof typeof englishCopy];
      const chineseValue = chineseCopy[key as keyof typeof chineseCopy];

      expect(typeof englishValue).toBe('string');
      expect(typeof chineseValue).toBe('string');
      expect(englishValue.trim()).not.toBe('');
      expect(chineseValue.trim()).not.toBe('');
    }
  });

  it('fails fast for an unsupported runtime locale', () => {
    expect(() => getScrollCreatorCopy('fr' as never)).toThrowError(
      'Unknown scroll creator locale. Received "fr".',
    );
  });

  it('exposes bilingual text overflow and print blocking guidance', () => {
    expect(getScrollCreatorCopy('en')).toMatchObject({
      textOverflowWarning:
        'Text exceeds the paper. Increase the paper height or reduce the font size. All text is preserved and can be scrolled within the text area.',
      printOverflowBlocked:
        'Text still exceeds the paper. Increase the paper height or reduce the font size before printing.',
    });
    expect(getScrollCreatorCopy('zh')).toMatchObject({
      textOverflowWarning: '正文超出纸张。请增加纸张高度或减小字号；全文已保留，可在正文区域内滚动编辑。',
      printOverflowBlocked: '正文仍超出纸张，请先增加纸张高度或减小字号后再打印。',
    });
  });
});
