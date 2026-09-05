import { describe, expect, test } from 'vitest';

import sitemap from '@/app/sitemap';

const DND_BLESS_SLUG = 'dnd-bless';
const DND_THUNDERCLAP_SLUG = 'dnd-thunderclap';
const DND_FIND_FAMILIAR_SLUG = 'dnd-find-familiar';
const DND_HEX_SLUG = 'dnd-hex';
const DND_GLAIVE_SLUG = 'dnd-glaive';
const PALADIN_2024_SPELLS_DND_SLUG = 'paladin-2024-spells-dnd';
const DND_SILVERY_BARBS_SLUG = 'dnd-silvery-barbs';
const DND_SHORTSWORD_SLUG = 'dnd-shortsword';
const RAPIER_DND_SLUG = 'rapier-dnd';
const DND_SWORD_SHEATHS_SLUG = 'dnd-sword-sheaths';
const DND_5E_ARMORER_SLUG = 'dnd-5e-armorer';
const DND_DEATH_KNIGHT_SLUG = 'dnd-death-knight';
const DND_FLUMPH_SLUG = 'dnd-flumph';
const DWELF_DND_SLUG = 'dwelf-dnd';
const DND_DAGGER_SLUG = 'dnd-dagger';
const FIREBOLT_DND_5E_SLUG = 'firebolt-dnd-5e';
const SPECTATOR_DND_SLUG = 'spectator-dnd';
const DND_QUARTERSTAFF_SLUG = 'dnd-quarterstaff';
const DND_MAUL_SLUG = 'dnd-maul';
const DND_GNOME_NAMES_SLUG = 'dnd-gnome-names';
const DND_SHATTER_5E_SLUG = 'dnd-shatter-5e';
const DND_RACES_SLUG = 'dnd-races';
const DND_ALIGNMENT_CHART_SLUG = 'dnd-alignment-chart';
const DND_MEANING_SLUG = 'dnd-meaning';
const DND_LANGUAGES_SLUG = 'dnd-languages';
const DND_STATS_SLUG = 'dnd-stats';
const DND_ARTIFICER_SLUG = 'dnd-artificer';
const DND_PALADIN_SLUG = 'dnd-paladin';
const PLAYERS_HANDBOOK_DND_5E_SLUG = 'players-handbook-dnd-5e';
const DND_CHARACTER_SHEET_SLUG = 'dnd-character-sheet';
const DND_CLASSES_COMPARISON_SLUG = 'dnd-classes-comparison';
const DND_BACKGROUNDS_SLUG = 'dnd-backgrounds';
const DND_DRUID_SLUG = 'dnd-druid';

function findSitemapEntry(url: string) {
  const sitemapEntry = sitemap().find((entry) => entry.url === url);

  if (!sitemapEntry) {
    throw new Error(`Expected sitemap entry for ${url}.`);
  }

  return sitemapEntry;
}

describe('blog sitemap entries', () => {
  test('includes bilingual dnd druid routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_DRUID_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_DRUID_SLUG}`);
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_DRUID_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_DRUID_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_DRUID_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-28'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-28'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd backgrounds routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_BACKGROUNDS_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_BACKGROUNDS_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_BACKGROUNDS_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_BACKGROUNDS_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_BACKGROUNDS_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-26'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-26'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd classes comparison routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_CLASSES_COMPARISON_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_CLASSES_COMPARISON_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_CLASSES_COMPARISON_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_CLASSES_COMPARISON_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_CLASSES_COMPARISON_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-25'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-25'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd character sheet routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_CHARACTER_SHEET_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_CHARACTER_SHEET_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_CHARACTER_SHEET_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_CHARACTER_SHEET_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_CHARACTER_SHEET_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-24'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-24'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test("includes bilingual Player's Handbook routes with alternates", () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${PLAYERS_HANDBOOK_DND_5E_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${PLAYERS_HANDBOOK_DND_5E_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${PLAYERS_HANDBOOK_DND_5E_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${PLAYERS_HANDBOOK_DND_5E_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${PLAYERS_HANDBOOK_DND_5E_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-19'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-19'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd paladin routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_PALADIN_SLUG}`);
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_PALADIN_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_PALADIN_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_PALADIN_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_PALADIN_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-18'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-18'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd artificer routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_ARTIFICER_SLUG}`);
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_ARTIFICER_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_ARTIFICER_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_ARTIFICER_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_ARTIFICER_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-17'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-17'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd stats routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_STATS_SLUG}`);
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_STATS_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_STATS_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_STATS_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_STATS_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-15'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-15'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd languages routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_LANGUAGES_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_LANGUAGES_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_LANGUAGES_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_LANGUAGES_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_LANGUAGES_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-14'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-14'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd meaning routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_MEANING_SLUG}`);
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_MEANING_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_MEANING_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_MEANING_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_MEANING_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-12'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-12'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd alignment chart routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_ALIGNMENT_CHART_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_ALIGNMENT_CHART_SLUG}`,
    );
    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_ALIGNMENT_CHART_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_ALIGNMENT_CHART_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_ALIGNMENT_CHART_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-11'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-11'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd races routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_RACES_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_RACES_SLUG}`,
    );

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_RACES_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_RACES_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_RACES_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-10'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-10'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual Shatter blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_SHATTER_5E_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_SHATTER_5E_SLUG}`,
    );

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_SHATTER_5E_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_SHATTER_5E_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_SHATTER_5E_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-08'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-08'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd gnome names blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(
      `https://www.tokenmaker.one/blog/${DND_GNOME_NAMES_SLUG}`,
    );
    const chineseEntry = findSitemapEntry(
      `https://www.tokenmaker.one/zh/blog/${DND_GNOME_NAMES_SLUG}`,
    );

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_GNOME_NAMES_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_GNOME_NAMES_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_GNOME_NAMES_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-06'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-06'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd maul blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_MAUL_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_MAUL_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_MAUL_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_MAUL_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_MAUL_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-05'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-05'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd quarterstaff blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_QUARTERSTAFF_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_QUARTERSTAFF_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_QUARTERSTAFF_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_QUARTERSTAFF_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_QUARTERSTAFF_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-03'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-03'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual spectator dnd blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${SPECTATOR_DND_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${SPECTATOR_DND_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${SPECTATOR_DND_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${SPECTATOR_DND_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${SPECTATOR_DND_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-08-02'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-08-02'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual Fire Bolt blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${FIREBOLT_DND_5E_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${FIREBOLT_DND_5E_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${FIREBOLT_DND_5E_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${FIREBOLT_DND_5E_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${FIREBOLT_DND_5E_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-29'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-29'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd dagger blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_DAGGER_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_DAGGER_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_DAGGER_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_DAGGER_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_DAGGER_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-28'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-28'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dwelf dnd blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DWELF_DND_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DWELF_DND_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DWELF_DND_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DWELF_DND_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DWELF_DND_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-27'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-27'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd flumph blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_FLUMPH_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_FLUMPH_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_FLUMPH_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_FLUMPH_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_FLUMPH_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-26'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-26'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd death knight blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_DEATH_KNIGHT_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_DEATH_KNIGHT_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_DEATH_KNIGHT_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_DEATH_KNIGHT_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_DEATH_KNIGHT_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-22'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-22'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd 5e armorer blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_5E_ARMORER_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_5E_ARMORER_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_5E_ARMORER_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_5E_ARMORER_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_5E_ARMORER_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-20'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-20'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd sword sheaths blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_SWORD_SHEATHS_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_SWORD_SHEATHS_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_SWORD_SHEATHS_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_SWORD_SHEATHS_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_SWORD_SHEATHS_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-19'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-19'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('keeps fifth blog hub pages current after publishing the handbook guide', () => {
    const englishEntry = findSitemapEntry('https://www.tokenmaker.one/blog/page/5');
    const chineseEntry = findSitemapEntry('https://www.tokenmaker.one/zh/blog/page/5');

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/page/5',
      'en-US': 'https://www.tokenmaker.one/blog/page/5',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/page/5',
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-09-05'));
    expect(englishEntry.changeFrequency).toBe('weekly');
    expect(englishEntry.priority).toBe(0.55);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-09-05'));
    expect(chineseEntry.changeFrequency).toBe('weekly');
    expect(chineseEntry.priority).toBe(0.55);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('keeps sixth blog hub pages current after publishing the backgrounds guide', () => {
    const englishEntry = findSitemapEntry('https://www.tokenmaker.one/blog/page/6');
    const chineseEntry = findSitemapEntry('https://www.tokenmaker.one/zh/blog/page/6');

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/blog/page/6',
      'en-US': 'https://www.tokenmaker.one/blog/page/6',
      'zh-CN': 'https://www.tokenmaker.one/zh/blog/page/6',
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-09-05'));
    expect(englishEntry.changeFrequency).toBe('weekly');
    expect(englishEntry.priority).toBe(0.55);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-09-05'));
    expect(chineseEntry.changeFrequency).toBe('weekly');
    expect(chineseEntry.priority).toBe(0.55);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

  test('includes bilingual dnd thunderclap blog routes with alternates', () => {
    const englishEntry = findSitemapEntry(`https://www.tokenmaker.one/blog/${DND_THUNDERCLAP_SLUG}`);
    const chineseEntry = findSitemapEntry(`https://www.tokenmaker.one/zh/blog/${DND_THUNDERCLAP_SLUG}`);

    const expectedAlternates = {
      'x-default': `https://www.tokenmaker.one/blog/${DND_THUNDERCLAP_SLUG}`,
      'en-US': `https://www.tokenmaker.one/blog/${DND_THUNDERCLAP_SLUG}`,
      'zh-CN': `https://www.tokenmaker.one/zh/blog/${DND_THUNDERCLAP_SLUG}`,
    };

    expect(englishEntry.lastModified).toEqual(new Date('2026-07-17'));
    expect(englishEntry.changeFrequency).toBe('monthly');
    expect(englishEntry.priority).toBe(0.6);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);

    expect(chineseEntry.lastModified).toEqual(new Date('2026-07-17'));
    expect(chineseEntry.changeFrequency).toBe('monthly');
    expect(chineseEntry.priority).toBe(0.6);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });

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

describe('coat maker sitemap entries', () => {
  test('includes bilingual coat maker routes with language alternates', () => {
    const englishEntry = findSitemapEntry('https://www.tokenmaker.one/coat-of-arms-maker');
    const chineseEntry = findSitemapEntry('https://www.tokenmaker.one/zh/coat-of-arms-maker');

    const expectedAlternates = {
      'x-default': 'https://www.tokenmaker.one/coat-of-arms-maker',
      'en-US': 'https://www.tokenmaker.one/coat-of-arms-maker',
      'zh-CN': 'https://www.tokenmaker.one/zh/coat-of-arms-maker',
    };

    expect(englishEntry.changeFrequency).toBe('weekly');
    expect(englishEntry.priority).toBe(0.8);
    expect(englishEntry.alternates?.languages).toEqual(expectedAlternates);
    expect(chineseEntry.changeFrequency).toBe('weekly');
    expect(chineseEntry.priority).toBe(0.8);
    expect(chineseEntry.alternates?.languages).toEqual(expectedAlternates);
  });
});
