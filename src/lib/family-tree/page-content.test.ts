import { describe, expect, it } from 'vitest';

import {
  getFamilyTreePageContent,
  type FamilyTreePageContent,
  type FamilyTreePageFeatureIcon,
} from './page-content';
import type { SiteLocale } from '@/lib/site-locale';

const EXPECTED_TOP_LEVEL_KEYS = [
  'whatIs',
  'features',
  'toolComparison',
  'howItWorks',
  'callToAction',
  'faq',
] as const;

const EXPECTED_TOOL_COMPARISON_ROW_KEYS = [
  'dimension',
  'familyTreeMaker',
  'canva',
  'drawio',
] as const;

const EXPECTED_FEATURE_ICONS: readonly FamilyTreePageFeatureIcon[] = [
  'portrait',
  'profile',
  'generations',
  'connections',
  'save',
  'export',
];

function findFeatureByIcon(
  content: FamilyTreePageContent,
  icon: FamilyTreePageFeatureIcon,
): FamilyTreePageContent['features']['items'][number] {
  const feature = content.features.items.find((item) => item.icon === icon);
  if (!feature) {
    throw new Error(`Expected family tree feature ${JSON.stringify(icon)} to be present.`);
  }

  return feature;
}

describe('family tree page content', () => {
  it('keeps the EN/ZH content contract and item counts aligned', () => {
    const english = getFamilyTreePageContent('en');
    const chinese = getFamilyTreePageContent('zh');

    expect(Object.keys(english)).toEqual(EXPECTED_TOP_LEVEL_KEYS);
    expect(Object.keys(chinese)).toEqual(EXPECTED_TOP_LEVEL_KEYS);
    expect(Object.keys(chinese)).toEqual(Object.keys(english));
    expect(Object.keys(chinese.whatIs)).toEqual(Object.keys(english.whatIs));
    expect(Object.keys(chinese.features)).toEqual(Object.keys(english.features));
    expect(Object.keys(chinese.toolComparison)).toEqual(Object.keys(english.toolComparison));
    expect(Object.keys(chinese.howItWorks)).toEqual(Object.keys(english.howItWorks));
    expect(Object.keys(chinese.callToAction)).toEqual(Object.keys(english.callToAction));
    expect(Object.keys(chinese.faq)).toEqual(Object.keys(english.faq));

    expect(english.whatIs.paragraphs).toHaveLength(3);
    expect(chinese.whatIs.paragraphs).toHaveLength(3);
    expect(english.features.items).toHaveLength(6);
    expect(chinese.features.items).toHaveLength(6);
    expect(english.features.items.map((item) => item.icon)).toEqual(EXPECTED_FEATURE_ICONS);
    expect(chinese.features.items.map((item) => item.icon)).toEqual(EXPECTED_FEATURE_ICONS);
    expect(english.toolComparison.rows).toHaveLength(5);
    expect(chinese.toolComparison.rows).toHaveLength(5);
    expect(english.toolComparison.rows.map((row) => Object.keys(row))).toEqual(
      chinese.toolComparison.rows.map((row) => Object.keys(row)),
    );
    for (const row of [...english.toolComparison.rows, ...chinese.toolComparison.rows]) {
      expect(Object.keys(row)).toEqual(EXPECTED_TOOL_COMPARISON_ROW_KEYS);
    }
    expect(english.toolComparison.familyTreeMakerHeading).toBe('Fantasy Family Tree Maker');
    expect(chinese.toolComparison.familyTreeMakerHeading).toBe('人物家谱制作器');
    expect(english.howItWorks.steps).toHaveLength(4);
    expect(chinese.howItWorks.steps).toHaveLength(4);
    expect(english.faq.items).toHaveLength(8);
    expect(chinese.faq.items).toHaveLength(8);
    expect(english.features.items.map((item) => Object.keys(item))).toEqual(
      chinese.features.items.map((item) => Object.keys(item)),
    );
    expect(english.howItWorks.steps.map((step) => Object.keys(step))).toEqual(
      chinese.howItWorks.steps.map((step) => Object.keys(step)),
    );
    expect(english.faq.items.map((item) => Object.keys(item))).toEqual(
      chinese.faq.items.map((item) => Object.keys(item)),
    );
  });

  it('states the implemented family tree capabilities and limits', () => {
    const english = getFamilyTreePageContent('en');
    const chinese = getFamilyTreePageContent('zh');

    expect(english.whatIs.paragraphs[1]).toContain('canvas shows each person’s portrait and name');
    expect(english.whatIs.paragraphs[1]).toContain('age and description');
    expect(english.howItWorks.steps[0].description).toContain('randomize a portrait');
    expect(english.howItWorks.steps[1].description).toContain('Select one of four generations');
    expect(english.howItWorks.steps[2].description).toContain('between-generation connection');
    expect(chinese.whatIs.paragraphs[1]).toContain('画布会显示每个人物的头像和姓名');
    expect(chinese.whatIs.paragraphs[1]).toContain('年龄与描述作为人物资料备注');
    expect(chinese.howItWorks.steps[0].description).toContain('随机生成头像');
    expect(chinese.howItWorks.steps[1].description).toContain('先选择四代中的一代');
    expect(chinese.howItWorks.steps[2].description).toContain('设置人物的端点样式');

    expect(findFeatureByIcon(english, 'portrait').description).toContain('eight avatar categories');
    expect(findFeatureByIcon(english, 'generations').description).toContain('four generations');
    expect(findFeatureByIcon(english, 'connections').description).toContain('none, solid, or dashed');
    expect(findFeatureByIcon(english, 'save').description).toContain('five manual browser save slots');
    expect(findFeatureByIcon(english, 'save').description).toContain('TXT file');
    expect(findFeatureByIcon(english, 'export').description).toContain('transparent background by default');
    expect(findFeatureByIcon(english, 'export').description).toContain('white background');

    expect(findFeatureByIcon(chinese, 'portrait').description).toContain('八类头像部件');
    expect(findFeatureByIcon(chinese, 'generations').description).toContain('四代');
    expect(findFeatureByIcon(chinese, 'connections').description).toContain('无、实线或虚线');
    expect(findFeatureByIcon(chinese, 'save').description).toContain('五个手动浏览器存档槽');
    expect(findFeatureByIcon(chinese, 'save').description).toContain('TXT 文件');
    expect(findFeatureByIcon(chinese, 'export').description).toContain('透明背景');
    expect(findFeatureByIcon(chinese, 'export').description).toContain('白色背景');

    expect(english.faq.items.some((item) => item.answer.includes('There is no automatic save'))).toBe(true);
    expect(english.faq.items.some((item) => item.answer.includes('cannot restore the editable tree'))).toBe(true);
    expect(chinese.faq.items.some((item) => item.answer.includes('没有自动存档'))).toBe(true);
    expect(chinese.faq.items.some((item) => item.answer.includes('不能恢复可编辑家谱'))).toBe(true);
  });

  it('rejects an unsupported locale with the received value', () => {
    expect(() => getFamilyTreePageContent('fr' as SiteLocale)).toThrowError(
      /^Unknown family tree page content locale: "fr"\.$/,
    );
  });
});
