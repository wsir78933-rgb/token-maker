import { describe, expect, it } from 'vitest';

import { TOWN_ASSETS, TOWN_CATEGORIES, TOWN_MATERIALS } from './catalog';
import { getTownCreatorCopy, TOWN_CREATOR_EDITOR_ID, type TownCreatorCopy } from './copy';

const ENGLISH_TITLE = 'Fantasy Town Generator | Create Town Maps Online';
const ENGLISH_DESCRIPTION =
  'Create fantasy town maps for D&D, tabletop RPGs, and worldbuilding. Design bustling towns, frontier villages, and mysterious places for your next adventure.';
const CHINESE_TITLE = '奇幻城镇生成器｜在线创建城镇地图';
const CHINESE_DESCRIPTION =
  '使用奇幻城镇生成器，为 D&D、TRPG 和世界观创作搭建城镇地图。自由组合建筑、道路、城墙与地形，打造繁华城镇、边境小镇或充满秘密的冒险据点。';

function expectTownCopyString(value: string): void {
  expect(value.trim()).not.toBe('');
}

function expectTownCopyShape(copy: TownCreatorCopy): void {
  expect(copy.heading).toContain(copy.heroEmphasis);
  expectTownCopyString(copy.heroAction);
  expectTownCopyString(copy.whatIs.title);
  expectTownCopyString(copy.whatIs.description);
  expectTownCopyString(copy.featureOverview.title);
  expectTownCopyString(copy.featureOverview.subtitle);
  expect(copy.featureOverview.features).toHaveLength(6);
  expectTownCopyString(copy.howItWorks.title);
  expectTownCopyString(copy.howItWorks.description);
  expect(copy.howItWorks.steps).toHaveLength(3);
  expectTownCopyString(copy.toolComparison.title);
  expectTownCopyString(copy.toolComparison.description);
  expectTownCopyString(copy.toolComparison.columns.aspect);
  expectTownCopyString(copy.toolComparison.columns.town);
  expectTownCopyString(copy.toolComparison.columns.handDrawn);
  expectTownCopyString(copy.toolComparison.columns.imageEditor);
  expect(copy.toolComparison.rows).toHaveLength(5);
  expectTownCopyString(copy.cta.title);
  expectTownCopyString(copy.cta.description);
  expectTownCopyString(copy.cta.action);
  expectTownCopyString(copy.faq.eyebrow);
  expectTownCopyString(copy.faq.title);
  expectTownCopyString(copy.faq.description);
  expect(copy.faq.items).toHaveLength(8);

  for (const feature of copy.featureOverview.features) {
    expectTownCopyString(feature.title);
    expectTownCopyString(feature.description);
  }

  for (const step of copy.howItWorks.steps) {
    expectTownCopyString(step.title);
    expectTownCopyString(step.description);
  }

  for (const row of copy.toolComparison.rows) {
    expectTownCopyString(row.aspect);
    expectTownCopyString(row.town);
    expectTownCopyString(row.handDrawn);
    expectTownCopyString(row.imageEditor);
  }

  for (const item of copy.faq.items) {
    expectTownCopyString(item.question);
    expectTownCopyString(item.answer);
  }

  const featureText = copy.featureOverview.features
    .map((feature) => `${feature.title} ${feature.description}`)
    .join(' ');
  const appearanceCount = TOWN_ASSETS.reduce(
    (count, asset) => count + asset.variants.length,
    0,
  );

  expect(featureText).toContain(String(TOWN_ASSETS.length));
  expect(featureText).toContain(String(TOWN_CATEGORIES.length));
  expect(featureText).toContain(String(TOWN_MATERIALS.length));
  expect(featureText).toContain(String(appearanceCount));
}

describe('town creator copy', () => {
  it('provides the English navigation and editor copy', () => {
    const copy = getTownCreatorCopy('en');

    expect(copy.navTitle).toBe('Town Creator');
    expect(copy.pageTitle).toBe(ENGLISH_TITLE);
    expect(copy.pageDescription).toBe(ENGLISH_DESCRIPTION);
    expect(copy.heading).toBe('Fantasy Town Generator Create Town Maps Online');
    expect(copy.description).toBe(ENGLISH_DESCRIPTION);
    expect(copy.heroEmphasis).toBe('Fantasy Town Generator');
    expectTownCopyShape(copy);
  });

  it('provides the Chinese navigation and editor copy', () => {
    const copy = getTownCreatorCopy('zh');

    expect(copy.navTitle).toBe('城镇创建器');
    expect(copy.pageTitle).toBe(CHINESE_TITLE);
    expect(copy.pageDescription).toBe(CHINESE_DESCRIPTION);
    expect(copy.heading).toBe('奇幻城镇生成器在线创建城镇地图');
    expect(copy.description).toBe(CHINESE_DESCRIPTION);
    expect(copy.heroEmphasis).toBe('奇幻城镇生成器');
    expectTownCopyShape(copy);
  });

  it('keeps both locales structurally complete and rejects unknown locales', () => {
    const englishKeys = Object.keys(getTownCreatorCopy('en')).sort();
    const chineseCopy = getTownCreatorCopy('zh');

    expect(Object.keys(chineseCopy).sort()).toEqual(englishKeys);
    expectTownCopyShape(chineseCopy);
    expect(TOWN_CREATOR_EDITOR_ID).toBe('town-creator-editor');
    expect(() => getTownCreatorCopy('fr')).toThrowError(
      /^Unknown town creator locale: "fr"\.$/,
    );
  });
});
