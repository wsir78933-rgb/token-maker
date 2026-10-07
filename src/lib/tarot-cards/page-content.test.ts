import { describe, expect, it } from 'vitest';

import type { SiteLocale } from '@/lib/site-locale';

import { getTarotPageContent } from './page-content';

function collectTextLeaves(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'string') {
    return { [path]: value };
  }

  if (Array.isArray(value)) {
    const strings: Record<string, string> = {};
    value.forEach((entry, index) => {
      Object.assign(strings, collectTextLeaves(entry, `${path}.${index}`));
    });
    return strings;
  }

  if (value === null || typeof value !== 'object') {
    return {};
  }

  const strings: Record<string, string> = {};
  Object.entries(value).forEach(([key, entry]) => {
    const entryPath = path ? `${path}.${key}` : key;
    Object.assign(strings, collectTextLeaves(entry, entryPath));
  });
  return strings;
}

describe('getTarotPageContent', () => {
  it('keeps EN and ZH content structures parallel and nonempty', () => {
    const english = getTarotPageContent('en');
    const chinese = getTarotPageContent('zh');
    const englishText = collectTextLeaves(english);
    const chineseText = collectTextLeaves(chinese);

    expect(Object.keys(chineseText)).toEqual(Object.keys(englishText));
    expect(Object.values(englishText).every((value) => value.trim().length > 0)).toBe(true);
    expect(Object.values(chineseText).every((value) => value.trim().length > 0)).toBe(true);
    expect(english.features.description).toContain('RPG');
    expect(chinese.whatIs.description).toContain('创作提示');
  });

  it('exposes the six features, three steps, five comparison rows, and eight FAQs', () => {
    const expectedIcons = ['cards', 'spreads', 'flip', 'meanings', 'deck', 'inspiration'];

    for (const locale of ['en', 'zh'] as const) {
      const content = getTarotPageContent(locale);

      expect(content.features.items).toHaveLength(6);
      expect(content.features.items.map((item) => item.icon)).toEqual(expectedIcons);
      expect(content.howItWorks.steps).toHaveLength(3);
      expect(content.comparison.rows).toHaveLength(5);
      expect(content.faq.items).toHaveLength(8);
      expect(content.comparison.rows.every((row) => Object.values(row).every((value) => value.trim()))).toBe(true);
      expect(content.faq.items.every((item) => item.question.endsWith('?') || locale === 'zh')).toBe(true);
    }
  });

  it('rejects an unsupported runtime locale with its actual value', () => {
    expect(() => getTarotPageContent('fr' as SiteLocale)).toThrowError(
      'Unknown tarot page locale. Received "fr".',
    );
  });
});
