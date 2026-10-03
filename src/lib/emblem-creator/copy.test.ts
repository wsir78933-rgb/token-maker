import { describe, expect, it } from 'vitest';

import { getEmblemCreatorCopy } from './copy';
import type { EmblemLocale } from './types';

function collectCopyStrings(value: object, prefix = ''): Record<string, string> {
  const strings: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === 'string') strings[path] = entry;
    else Object.assign(strings, collectCopyStrings(entry, path));
  }
  return strings;
}

describe('emblem creator copy', () => {
  it('provides matching nonempty EN/ZH fields and the public category/layer keys', () => {
    const english = getEmblemCreatorCopy('en');
    const chinese = getEmblemCreatorCopy('zh');
    const englishStrings = collectCopyStrings(english);
    const chineseStrings = collectCopyStrings(chinese);

    expect(Object.keys(chineseStrings)).toEqual(Object.keys(englishStrings));
    for (const copy of [english, chinese]) {
      expect(Object.values(collectCopyStrings(copy)).every((value) => value.trim().length > 0)).toBe(true);
      expect(Object.keys(copy.assets.categories)).toEqual(['body', 'detail', 'crest']);
      expect(Object.keys(copy.layers.names)).toEqual(['crests', 'details', 'body1', 'body2', 'body3', 'body4']);
    }
    expect(english.heading).toBe('Emblem Creator');
    expect(chinese.heading).toBe('徽标制作工具');
    expect(chinese.errors.invalidImageUrl).not.toBe(english.errors.invalidImageUrl);
    expect(chinese.properties.invalidNumber).not.toBe(english.properties.invalidNumber);
  });

  it('rejects an unsupported runtime locale with its actual value', () => {
    expect(() => getEmblemCreatorCopy('fr' as EmblemLocale)).toThrow('"fr"');
  });
});
