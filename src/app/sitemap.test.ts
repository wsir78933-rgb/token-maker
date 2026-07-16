import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';

const DND_BLESS_SLUG = 'dnd-bless';
const DND_FIND_FAMILIAR_SLUG = 'dnd-find-familiar';
const DND_HEX_SLUG = 'dnd-hex';
const DND_GLAIVE_SLUG = 'dnd-glaive';
const PALADIN_2024_SPELLS_DND_SLUG = 'paladin-2024-spells-dnd';
const DND_SILVERY_BARBS_SLUG = 'dnd-silvery-barbs';
const DND_SHORTSWORD_SLUG = 'dnd-shortsword';
const RAPIER_DND_SLUG = 'rapier-dnd';

function findSitemapEntry(url: string) {
  const sitemapEntry = sitemap().find((entry) => entry.url === url);

  if (!sitemapEntry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return sitemapEntry;
}

describe('blog sitemap entries', () => {
  test('includes bilingual dnd find familiar blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_FIND_FAMILIAR_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_FIND_FAMILIAR_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_FIND_FAMILIAR_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_FIND_FAMILIAR_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_FIND_FAMILIAR_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-16'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-16'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd hex blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_HEX_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_HEX_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_HEX_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_HEX_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_HEX_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-15'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-15'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual paladin 2024 spells blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${PALADIN_2024_SPELLS_DND_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${PALADIN_2024_SPELLS_DND_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${PALADIN_2024_SPELLS_DND_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${PALADIN_2024_SPELLS_DND_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${PALADIN_2024_SPELLS_DND_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-14'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-14'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd glaive blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_GLAIVE_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_GLAIVE_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_GLAIVE_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_GLAIVE_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_GLAIVE_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-14'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-14'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd silvery barbs blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_SILVERY_BARBS_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_SILVERY_BARBS_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_SILVERY_BARBS_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_SILVERY_BARBS_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_SILVERY_BARBS_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-11'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-11'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd shortsword blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_SHORTSWORD_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_SHORTSWORD_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_SHORTSWORD_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_SHORTSWORD_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_SHORTSWORD_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-10'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-10'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd bless blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_BLESS_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_BLESS_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_BLESS_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_BLESS_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_BLESS_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-09'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-09'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual rapier dnd blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${RAPIER_DND_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${RAPIER_DND_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${RAPIER_DND_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${RAPIER_DND_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${RAPIER_DND_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-08'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-08'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });
});
