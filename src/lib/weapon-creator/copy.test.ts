import { describe, expect, it } from 'vitest';

import {
  getWeaponCreatorCategoryLabel,
  getWeaponCreatorCopy,
} from '@/lib/weapon-creator/copy';

const WEAPON_CATEGORY_IDS = [
  'hilts',
  'pommels',
  'crossguards',
  'blade',
  'handle',
  'axe',
  'mace',
  'hammer',
  'bow',
  'bowhandle',
  'bowtip',
  'stafftop',
  'staffbtm',
  'staff',
  'scythe',
  'polearm',
  'spear',
] as const;

const EXPECTED_CASE_STUDY_IMAGE_PATHS = [
  '/weapon-creator/cases/01-warden-greatblade.png',
  '/weapon-creator/cases/02-moonlit-duelist.png',
  '/weapon-creator/cases/03-storm-lancer.png',
  '/weapon-creator/cases/04-ember-witch-staff.png',
  '/weapon-creator/cases/05-tavern-mercenary.png',
  '/weapon-creator/cases/06-royal-armourer.png',
  '/weapon-creator/cases/07-caravan-guard.png',
  '/weapon-creator/cases/08-ruin-keeper.png',
  '/weapon-creator/cases/09-frostbound-relic.png',
  '/weapon-creator/cases/10-skyship-navigator.png',
  '/weapon-creator/cases/11-thorn-court-sceptre.png',
  '/weapon-creator/cases/12-deep-road-scythe.png',
] as const;

function expectCompleteCaseStudies(copy: ReturnType<typeof getWeaponCreatorCopy>): void {
  expect(copy.caseStudies.title).not.toHaveLength(0);
  expect(copy.caseStudies.description).not.toHaveLength(0);
  expect(copy.caseStudies.groups).toHaveLength(3);
  expect(copy.caseStudies.groups.map((group) => group.id)).toEqual(['rpg', 'npcs', 'settings']);
  expect(copy.caseStudies.groups.map((group) => group.imagePosition)).toEqual([
    'right',
    'left',
    'right',
  ]);

  const examples = copy.caseStudies.groups.flatMap((group) => {
    expect(group.title).not.toHaveLength(0);
    expect(group.description).not.toHaveLength(0);
    expect(group.carouselLabel).not.toHaveLength(0);
    expect(group.previousLabel).not.toHaveLength(0);
    expect(group.nextLabel).not.toHaveLength(0);
    expect(group.examples).toHaveLength(4);

    return group.examples;
  });

  expect(examples).toHaveLength(12);
  expect(new Set(examples.map((example) => example.src)).size).toBe(12);
  expect(new Set(copy.caseStudies.groups.map((group) => group.carouselLabel)).size).toBe(3);
  expect(
    new Set(copy.caseStudies.groups.flatMap((group) => [group.previousLabel, group.nextLabel])).size,
  ).toBe(6);

  for (const example of examples) {
    expect(example.name).not.toHaveLength(0);
    expect(example.designation).not.toHaveLength(0);
    expect(example.quote).not.toHaveLength(0);
    expect(example.src).toMatch(/^\/weapon-creator\/cases\/\d{2}-[a-z0-9-]+\.png$/);
    expect(example.alt).not.toHaveLength(0);
  }
}

describe('getWeaponCreatorCopy', () => {
  it('provides complete English page and editor copy', () => {
    const copy = getWeaponCreatorCopy('en');

    expect(copy.navigationName).toBe('Weapon Creator');
    expect(copy.pageTitle).toContain('Weapon Creator');
    expect(copy.heading).toContain('Weapon Creator');
    expect(copy.description).not.toHaveLength(0);
    expect(copy.heroAction).not.toHaveLength(0);
    expect(Object.keys(copy.categoryLabels)).toEqual(WEAPON_CATEGORY_IDS);
    expect(copy.categoryLabels.hilts).toBe('Hilts');
    expect(copy.categoryLabels.spear).toBe('Spear parts');
    expect(copy.previewLabel).toBe('Weapon preview');
    expect(copy.featureOverview.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.faqItems).toHaveLength(5);
    expectCompleteCaseStudies(copy);
  });

  it('keeps Chinese labels and behavior copy parallel to English', () => {
    const copy = getWeaponCreatorCopy('zh');

    expect(copy.navigationName).toBe('武器制作器');
    expect(Object.keys(copy.categoryLabels)).toEqual(WEAPON_CATEGORY_IDS);
    expect(copy.categoryLabels.hilts).toBe('剑握柄');
    expect(copy.categoryLabels.spear).toBe('长矛部件');
    expect(copy.previewLabel).toBe('武器预览');
    expect(copy.featureOverview.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.faqItems).toHaveLength(5);
    expectCompleteCaseStudies(copy);
  });

  it('keeps case-study paths and order parallel across locales', () => {
    const englishExamples = getWeaponCreatorCopy('en').caseStudies.groups.flatMap(
      (group) => group.examples,
    );
    const chineseExamples = getWeaponCreatorCopy('zh').caseStudies.groups.flatMap(
      (group) => group.examples,
    );

    expect(englishExamples.map((example) => example.src)).toEqual(EXPECTED_CASE_STUDY_IMAGE_PATHS);
    expect(chineseExamples.map((example) => example.src)).toEqual(EXPECTED_CASE_STUDY_IMAGE_PATHS);
    expect(chineseExamples.map((example) => example.src)).toEqual(
      englishExamples.map((example) => example.src),
    );
  });

  it('rejects unsupported locales and invalid weapon slot labels', () => {
    expect(() => getWeaponCreatorCopy('fr')).toThrow(/Unknown weapon creator locale/);
    expect(() => getWeaponCreatorCopy('en').weaponSlot(0)).toThrow(/Received 0/);
    expect(() => getWeaponCreatorCopy('en').weaponSlot(5)).toThrow(/Received 5/);
  });

  it('looks up localized category labels through the public copy API', () => {
    expect(getWeaponCreatorCategoryLabel('en', 'hilts')).toBe('Hilts');
    expect(getWeaponCreatorCategoryLabel('zh', 'hilts')).toBe('剑握柄');
  });
});
