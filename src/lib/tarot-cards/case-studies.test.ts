import { describe, expect, it } from 'vitest';

import { getTarotCard } from './cards';
import { getTarotCaseStudies } from './case-studies';
import type { SiteLocale } from '@/lib/site-locale';

const CASE_CARD_IDS = [
  'cups-08',
  'major-02-high-priestess',
  'major-09-hermit',
  'swords-07',
  'major-13-death',
  'swords-05',
  'major-11-justice',
  'wands-05',
  'major-18-moon',
  'major-16-tower',
  'major-07-chariot',
  'major-14-temperance',
] as const;

describe('getTarotCaseStudies', () => {
  it('keeps the three bilingual case groups aligned with their approved image positions', () => {
    const english = getTarotCaseStudies('en');
    const chinese = getTarotCaseStudies('zh');

    expect(english.title).toContain('case studies');
    expect(chinese.title).toContain('创作案例');
    expect(english.groups.map((group) => group.id)).toEqual(['characters', 'worlds', 'adventures']);
    expect(chinese.groups.map((group) => group.id)).toEqual(english.groups.map((group) => group.id));
    expect(english.groups.map((group) => group.imagePosition)).toEqual(['left', 'right', 'left']);
    expect(chinese.groups.map((group) => group.imagePosition)).toEqual(
      english.groups.map((group) => group.imagePosition),
    );
    expect(english.groups.every((group) => group.examples.length === 4)).toBe(true);
    expect(chinese.groups.every((group) => group.examples.length === 4)).toBe(true);
  });

  it('uses twelve real upright cards and keeps the prompt structure in both locales', () => {
    for (const locale of ['en', 'zh'] as const) {
      const content = getTarotCaseStudies(locale);
      const examples = content.groups.flatMap((group) => group.examples);

      expect(examples).toHaveLength(CASE_CARD_IDS.length);
      expect(examples.map((example) => example.src)).toEqual(
        CASE_CARD_IDS.map((cardId) => getTarotCard(cardId).imageSrc),
      );

      examples.forEach((example, index) => {
        const card = getTarotCard(CASE_CARD_IDS[index]);

        expect(example.designation).toContain(card.name[locale]);
        expect(example.alt).toContain(card.name[locale]);
        expect(example.designation).toContain(locale === 'en' ? 'Upright' : '正位');
        expect(example.quote).toContain(locale === 'en' ? 'Key card prompt:' : '关键牌提示：');
        expect(example.quote).toContain(locale === 'en' ? 'Story setting:' : '故事设定：');
      });
    }
  });

  it('rejects an unsupported runtime locale with its actual value', () => {
    expect(() => getTarotCaseStudies('fr' as SiteLocale)).toThrowError(
      'Unknown tarot case studies locale. Received "fr".',
    );
  });
});
