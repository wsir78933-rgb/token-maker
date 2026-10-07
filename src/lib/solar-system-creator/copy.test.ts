import { describe, expect, it } from 'vitest';

import { getSolarSystemCopy } from './copy';
import type { SolarAssetCategory, SolarPlanetField, SolarStarRange } from './types';

const STAR_RANGES: readonly SolarStarRange[] = ['normal', 'include-blue', 'only-blue'];
const ASSET_CATEGORIES: readonly SolarAssetCategory[] = [
  'star',
  'type-1',
  'type-2',
  'type-3',
  'type-4',
  'type-5',
];
const PLANET_FIELDS: readonly SolarPlanetField[] = [
  'environment',
  'atmosphere',
  'surfaceMap',
  'dayHours',
  'gravity',
  'orbitYears',
  'moons',
  'axialTilt',
];
const FEATURE_ICONS = ['assets', 'random', 'details', 'manual', 'saves', 'export'] as const;

describe('solar system copy', () => {
  it.each(['en', 'zh'] as const)('provides the complete serializable contract in %s', (locale) => {
    const copy = getSolarSystemCopy(locale);

    expect(copy.heroAction).toBeTruthy();
    expect(copy.pageContent.whatIsTitle).toBeTruthy();
    expect(copy.pageContent.whatIsDescription).toBeTruthy();
    expect(copy.pageContent.featureOverviewTitle).toBeTruthy();
    expect(copy.pageContent.featureOverviewDescription).toBeTruthy();
    expect(copy.pageContent.featureItems).toHaveLength(FEATURE_ICONS.length);
    expect(copy.pageContent.featureItems.map((item) => item.icon)).toEqual(FEATURE_ICONS);
    expect(copy.pageContent.toolComparison.title).toBeTruthy();
    expect(copy.pageContent.toolComparison.description).toBeTruthy();
    expect(copy.pageContent.toolComparison.tableLabel).toBeTruthy();
    expect(copy.pageContent.toolComparison.dimensionHeading).toBeTruthy();
    expect(copy.pageContent.toolComparison.solarSystemCreatorHeading).toBeTruthy();
    expect(copy.pageContent.toolComparison.photoshopHeading).toBeTruthy();
    expect(copy.pageContent.toolComparison.illustratorHeading).toBeTruthy();
    expect(copy.pageContent.toolComparison.rows).toHaveLength(5);
    for (const row of copy.pageContent.toolComparison.rows) {
      expect(row.dimension).toBeTruthy();
      expect(row.solarSystemCreator).toBeTruthy();
      expect(row.photoshop).toBeTruthy();
      expect(row.illustrator).toBeTruthy();
    }
    expect(copy.pageContent.howItWorksEyebrow).toBeTruthy();
    expect(copy.pageContent.howItWorksTitle).toBeTruthy();
    expect(copy.pageContent.howItWorksSteps).toHaveLength(3);
    expect(copy.pageContent.ctaTitle).toBeTruthy();
    expect(copy.pageContent.ctaDescription).toBeTruthy();
    expect(copy.pageContent.ctaAction).toBeTruthy();
    expect(copy.pageContent.faqEyebrow).toBeTruthy();
    expect(copy.pageContent.faqTitle).toBeTruthy();
    expect(copy.pageContent.faqDescription).toBeTruthy();
    expect(copy.pageContent.faqItems).toHaveLength(5);
    for (const feature of copy.pageContent.featureItems) {
      expect(feature.title).toBeTruthy();
      expect(feature.description).toBeTruthy();
    }
    for (const step of copy.pageContent.howItWorksSteps) {
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    }
    for (const faqItem of copy.pageContent.faqItems) {
      expect(faqItem.question).toBeTruthy();
      expect(faqItem.answer).toBeTruthy();
    }
    expect(copy.planetLabel).toContain('{number}');
    expect(copy.resizePlanetLabel).toContain('{number}');
    expect(copy.slotLabel).toContain('{number}');
    expect(copy.helpSteps).toHaveLength(4);
    for (const range of STAR_RANGES) {
      expect(copy.starRangeLabels[range]).toBeTruthy();
    }
    for (const category of ASSET_CATEGORIES) {
      expect(copy.categoryLabels[category]).toBeTruthy();
    }
    for (const field of PLANET_FIELDS) {
      expect(copy.fieldLabels[field]).toBeTruthy();
      expect(typeof copy.units[field]).toBe('string');
    }

    const serializedCopy = JSON.stringify(copy);
    expect(serializedCopy).toBeTruthy();
    expect(JSON.parse(serializedCopy)).toEqual(copy);
  });

  it('keeps English and Chinese labels distinct while preserving the same field keys', () => {
    const english = getSolarSystemCopy('en');
    const chinese = getSolarSystemCopy('zh');

    expect(chinese.heading).not.toBe(english.heading);
    expect(english.pageTitle).toBe('Free Solar System Creator – Build Your Own Planetary System');
    expect(english.pageDescription).toBe(
      'Design your own planetary system with our solar system creator. Choose from 240 star and planet assets, generate a random system, or arrange planets your way.',
    );
    expect(english.pageTitle).toHaveLength(59);
    expect(english.pageDescription).toHaveLength(158);
    expect(english.heroAction).toBe('Try Solar System Creator');
    expect(english.pageContent.whatIsDescription).toContain('science-fiction and fantasy novel authors');
    expect(english.pageContent.whatIsDescription).toContain('TRPG players and DMs/GMs');
    expect(chinese.pageTitle).toBe('免费太阳系创建器 – 打造你的行星系统');
    expect(chinese.pageDescription).toBe(
      '使用太阳系创建器打造专属的行星系统。从 240 款恒星与行星素材中自由选择，随机生成太阳系，或按你的构想手动摆放行星。',
    );
    expect(chinese.pageTitle).toHaveLength(19);
    expect(chinese.pageDescription).toHaveLength(59);
    expect(chinese.heroAction).toBe('试用太阳系创建器');
    expect(chinese.pageContent.whatIsDescription).toContain('科幻与奇幻小说作者');
    expect(chinese.pageContent.whatIsDescription).toContain('TRPG 玩家和 DM/GM');
    expect(chinese.pageContent.featureItems.map((item) => item.icon)).toEqual(
      english.pageContent.featureItems.map((item) => item.icon),
    );
    expect(chinese.pageContent.toolComparison.rows).toHaveLength(english.pageContent.toolComparison.rows.length);
    expect(Object.keys(chinese.pageContent.toolComparison)).toEqual(
      Object.keys(english.pageContent.toolComparison),
    );
    expect(chinese.pageContent.toolComparison.rows.map((row) => row.dimension)).toEqual([
      '素材准备',
      '创建方式',
      '行星资料',
      '保存和继续',
      '输出',
    ]);
    expect(english.pageContent.toolComparison.rows.map((row) => row.dimension)).toEqual([
      'Asset preparation',
      'Creation method',
      'Planet details',
      'Save and continue',
      'Output',
    ]);
    expect(chinese.pageContent.howItWorksSteps).toHaveLength(english.pageContent.howItWorksSteps.length);
    expect(chinese.pageContent.faqItems).toHaveLength(english.pageContent.faqItems.length);
    expect(english.exportTitle).toBe('Export');
    expect(chinese.exportTitle).toBe('导出');
    expect(english.randomImageExcludesDetails).toBe('The image does not include planet details.');
    expect(chinese.randomImageExcludesDetails).toBe('图像不包含行星资料。');
    expect(english.randomPrintIncludesDetails).toBe('Print includes all eight details for every planet.');
    expect(chinese.randomPrintIncludesDetails).toBe('打印包含全部行星的8项资料。');
    expect(english.helpSteps.join(' ')).toContain('Random mode can generate an image or print all eight details');
    expect(chinese.helpSteps.join(' ')).toContain('随机模式可以生成不含行星资料的图片');
    expect(english.resizePlanetLabel).toBe('Resize planet {number}');
    expect(chinese.resizePlanetLabel).toBe('调整行星 {number} 的大小');
    expect(Object.keys(chinese.fieldLabels)).toEqual(Object.keys(english.fieldLabels));
    expect(Object.keys(chinese.categoryLabels)).toEqual(Object.keys(english.categoryLabels));
  });

  it('rejects a runtime locale outside the SiteLocale union', () => {
    expect(() => getSolarSystemCopy('fr' as never)).toThrow('must be en or zh');
  });
});
