import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getFamilyTreeCaseStudiesCopy } from '@/lib/family-tree/case-studies';
import type { SiteLocale } from '@/lib/site-locale';

const EXPECTED_GROUPS = [
  { id: 'novel-families', imagePosition: 'right' as const },
  { id: 'worldbuilding-lineages', imagePosition: 'left' as const },
  { id: 'trpg-backgrounds', imagePosition: 'right' as const },
] as const;

const EXPECTED_IMAGE_SOURCES = [
  '/family-tree/cases/01-royal-succession.png',
  '/family-tree/cases/02-family-alliance.png',
  '/family-tree/cases/03-missing-heir.png',
  '/family-tree/cases/04-merchant-family.png',
  '/family-tree/cases/05-elven-lineage.png',
  '/family-tree/cases/06-dwarven-clan.png',
  '/family-tree/cases/07-half-elf-ancestry.png',
  '/family-tree/cases/08-orc-family.png',
  '/family-tree/cases/09-adventurer-background.png',
  '/family-tree/cases/10-village-npc-families.png',
  '/family-tree/cases/11-adoptive-family.png',
  '/family-tree/cases/12-warlock-bloodline.png',
] as const;

function flattenExamples(locale: SiteLocale) {
  return getFamilyTreeCaseStudiesCopy(locale).groups.flatMap((caseGroup) => caseGroup.examples);
}

describe('getFamilyTreeCaseStudiesCopy', () => {
  it.each(['en', 'zh'] as const)('provides three four-example groups for %s', (locale) => {
    const copy = getFamilyTreeCaseStudiesCopy(locale);

    expect(copy.groups).toHaveLength(3);
    expect(copy.groups.map(({ id, imagePosition }) => ({ id, imagePosition }))).toEqual(EXPECTED_GROUPS);
    expect(copy.groups.every((caseGroup) => caseGroup.examples.length === 4)).toBe(true);
    expect(copy.title.trim()).not.toBe('');
    expect(copy.description.trim()).not.toBe('');
  });

  it('assigns all twelve requested image paths exactly once', () => {
    const imageSources = flattenExamples('en').map((example) => example.src);

    expect(imageSources).toEqual(EXPECTED_IMAGE_SOURCES);
    expect(new Set(imageSources).size).toBe(12);
  });

  it('keeps the image assignment and layout shared across locales', () => {
    const englishExamples = flattenExamples('en');
    const chineseExamples = flattenExamples('zh');
    const englishGroups = getFamilyTreeCaseStudiesCopy('en').groups;
    const chineseGroups = getFamilyTreeCaseStudiesCopy('zh').groups;

    expect(chineseGroups.map(({ id, imagePosition }) => ({ id, imagePosition }))).toEqual(
      englishGroups.map(({ id, imagePosition }) => ({ id, imagePosition })),
    );
    expect(chineseExamples.map((example) => example.src)).toEqual(
      englishExamples.map((example) => example.src),
    );
  });

  it('provides non-empty accessible copy for every example', () => {
    for (const example of flattenExamples('en').concat(flattenExamples('zh'))) {
      expect(example.name.trim()).not.toBe('');
      expect(example.designation.trim()).not.toBe('');
      expect(example.quote.trim()).not.toBe('');
      expect(example.alt?.trim()).not.toBe('');
    }
  });

  it('fails fast for an unsupported locale', () => {
    expect(() => getFamilyTreeCaseStudiesCopy('fr' as SiteLocale)).toThrowError(
      'Unknown family tree case studies locale: "fr".',
    );
  });

  it('requires every requested image file to exist in public', () => {
    for (const source of EXPECTED_IMAGE_SOURCES) {
      const publicAssetPath = resolve(process.cwd(), 'public', source.slice(1));
      if (!existsSync(publicAssetPath)) {
        throw new Error(`Family tree case study image is missing: ${publicAssetPath}`);
      }
    }
  });
});
