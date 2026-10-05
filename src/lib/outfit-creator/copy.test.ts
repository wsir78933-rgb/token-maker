import { describe, expect, it } from 'vitest';

import { getOutfitCreatorCategoryLabel, getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';

const EXPECTED_CASE_STUDY_IMAGE_PATHS = [
  '/outfit-creator/cases/01-woodland-ranger.png',
  '/outfit-creator/cases/02-stealth-rogue.png',
  '/outfit-creator/cases/03-travelling-bard.png',
  '/outfit-creator/cases/04-academy-mage.png',
  '/outfit-creator/cases/05-tavern-keeper.png',
  '/outfit-creator/cases/06-caravan-merchant.png',
  '/outfit-creator/cases/07-court-diplomat.png',
  '/outfit-creator/cases/08-noble-heir.png',
  '/outfit-creator/cases/09-desert-traveller.png',
  '/outfit-creator/cases/10-northern-explorer.png',
  '/outfit-creator/cases/11-starship-pilot.png',
  '/outfit-creator/cases/12-space-station-engineer.png',
] as const;

function expectCompleteCaseStudies(copy: ReturnType<typeof getOutfitCreatorCopy>): void {
  expect(copy.caseStudies.title).not.toHaveLength(0);
  expect(copy.caseStudies.description).not.toHaveLength(0);
  expect(copy.caseStudies.groups).toHaveLength(3);
  expect(copy.caseStudies.groups.map((group) => group.id)).toEqual(['rpg', 'npcs', 'settings']);
  expect(copy.caseStudies.groups.map((group) => group.imagePosition)).toEqual([
    'right',
    'left',
    'right',
  ]);

  const caseStudyExamples = copy.caseStudies.groups.flatMap((group) => {
    expect(group.title).not.toHaveLength(0);
    expect(group.description).not.toHaveLength(0);
    expect(group.carouselLabel).not.toHaveLength(0);
    expect(group.previousLabel).not.toHaveLength(0);
    expect(group.nextLabel).not.toHaveLength(0);
    expect(group.examples).toHaveLength(4);

    return group.examples;
  });

  expect(caseStudyExamples).toHaveLength(12);
  expect(new Set(caseStudyExamples.map((example) => example.src)).size).toBe(12);
  expect(new Set(copy.caseStudies.groups.map((group) => group.carouselLabel)).size).toBe(3);
  expect(
    new Set(
      copy.caseStudies.groups.flatMap((group) => [group.previousLabel, group.nextLabel]),
    ).size,
  ).toBe(6);

  for (const example of caseStudyExamples) {
    expect(example.name).not.toHaveLength(0);
    expect(example.designation).not.toHaveLength(0);
    expect(example.quote).not.toHaveLength(0);
    expect(example.src).not.toHaveLength(0);
    expect(example.alt).not.toHaveLength(0);
  }
}

describe('getOutfitCreatorCopy', () => {
  it('provides the required English page and editor copy', () => {
    const copy = getOutfitCreatorCopy('en');

    expect(copy.navigationName).toBe('Outfit Creator');
    expect(copy.pageTitle).toContain('Outfit Creator');
    expect(copy.heading).toContain('Outfit Creator');
    expect(copy.description).not.toHaveLength(0);
    expect(copy.heroAction).not.toHaveLength(0);
    expect(copy.categoryLabels.jackets).toBe('Jackets');
    expect(copy.categoryLabels.shirts2).toBe('Shirts 2');
    expect(copy.featureOverview.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.faqItems).toHaveLength(5);
    expectCompleteCaseStudies(copy);
  });

  it('keeps the Chinese labels and behavior copy parallel to English', () => {
    const copy = getOutfitCreatorCopy('zh');

    expect(copy.navigationName).toBe('服装搭配工具');
    expect(copy.genderMale).toBe('男');
    expect(copy.genderFemale).toBe('女');
    expect(Object.keys(copy.categoryLabels)).toHaveLength(9);
    expect(copy.categoryLabels.jackets).toBe('夹克');
    expect(copy.categoryLabels.shirts2).toBe('衬衫 2');
    expect(copy.featureOverview.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.faqItems).toHaveLength(5);
    expectCompleteCaseStudies(copy);
  });

  it('keeps the twelve case study image paths and order parallel across locales', () => {
    const englishCaseStudies = getOutfitCreatorCopy('en').caseStudies;
    const chineseCaseStudies = getOutfitCreatorCopy('zh').caseStudies;
    const englishCaseStudyExamples = englishCaseStudies.groups.flatMap((group) => group.examples);
    const chineseCaseStudyExamples = chineseCaseStudies.groups.flatMap((group) => group.examples);

    expect(englishCaseStudyExamples.map((example) => example.src)).toEqual(
      EXPECTED_CASE_STUDY_IMAGE_PATHS,
    );
    expect(chineseCaseStudyExamples.map((example) => example.src)).toEqual(
      EXPECTED_CASE_STUDY_IMAGE_PATHS,
    );
    expect(chineseCaseStudyExamples.map((example) => example.src)).toEqual(
      englishCaseStudyExamples.map((example) => example.src),
    );
  });

  it('rejects unsupported locales and invalid save slot labels', () => {
    expect(() => getOutfitCreatorCopy('fr')).toThrow(/Unknown outfit creator locale/);
    expect(() => getOutfitCreatorCopy('en').outfitSlot(0)).toThrow(/Received 0/);
    expect(() => getOutfitCreatorCopy('en').outfitSlot(5)).toThrow(/Received 5/);
  });

  it('looks up a localized category label through the public copy API', () => {
    expect(getOutfitCreatorCategoryLabel('en', 'gloves')).toBe('Gloves');
    expect(getOutfitCreatorCategoryLabel('zh', 'gloves')).toBe('手套');
  });
});
