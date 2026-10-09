import { describe, expect, test } from 'vitest';

import { getMapMakerPageCopy } from '@/lib/map-maker/page-copy';
import type { MapMakerFeatureIcon } from '@/lib/map-maker/page-copy';
import type { SiteLocale } from '@/lib/site-locale';

const expectedFeatureIcons = [
  'coastline',
  'random',
  'elements',
  'labels',
  'saves',
  'export',
] as const satisfies readonly MapMakerFeatureIcon[];

function pageCopyShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(pageCopyShape);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, pageCopyShape(child)]),
    );
  }

  return typeof value === 'string' ? 'string' : typeof value;
}

function requireNonEmptyPageCopy(value: unknown, path = 'pageCopy'): void {
  if (Array.isArray(value)) {
    value.forEach((child, index) => requireNonEmptyPageCopy(child, `${path}[${index}]`));
    return;
  }

  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      requireNonEmptyPageCopy(child, `${path}.${key}`);
    }
    return;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    throw new Error(`Map maker page copy ${path} must not be empty. Received ${JSON.stringify(value)}.`);
  }
}

describe('map maker page copy', () => {
  test('keeps all six content sections populated and structurally aligned in English and Chinese', () => {
    const englishCopy = getMapMakerPageCopy('en');
    const chineseCopy = getMapMakerPageCopy('zh');

    expect(pageCopyShape(englishCopy)).toEqual(pageCopyShape(chineseCopy));
    requireNonEmptyPageCopy(englishCopy);
    requireNonEmptyPageCopy(chineseCopy);

    expect(englishCopy.features.items).toHaveLength(6);
    expect(chineseCopy.features.items).toHaveLength(6);
    expect(englishCopy.features.items.map((item) => item.icon)).toEqual(expectedFeatureIcons);
    expect(chineseCopy.features.items.map((item) => item.icon)).toEqual(expectedFeatureIcons);

    expect(englishCopy.howItWorks.steps).toHaveLength(3);
    expect(chineseCopy.howItWorks.steps).toHaveLength(3);
    const englishStepCopy = englishCopy.howItWorks.steps.map((step) => `${step.title} ${step.description}`);
    const chineseStepCopy = chineseCopy.howItWorks.steps.map((step) => `${step.title} ${step.description}`);
    expect(englishStepCopy[0]).toMatch(/coast/i);
    expect(englishStepCopy[1]).toMatch(/feature|label/i);
    expect(englishStepCopy[2]).toMatch(/save|download/i);
    expect(chineseStepCopy[0]).toMatch(/海岸|底图/);
    expect(chineseStepCopy[1]).toMatch(/元素|地点/);
    expect(chineseStepCopy[2]).toMatch(/保存|下载/);

    expect(englishCopy.comparison.rows).toHaveLength(5);
    expect(chineseCopy.comparison.rows).toHaveLength(5);
    const englishComparisonDimensions = englishCopy.comparison.rows.map((row) => row.dimension);
    const chineseComparisonDimensions = chineseCopy.comparison.rows.map((row) => row.dimension);
    expect(englishComparisonDimensions[0]).toMatch(/material|prepar/i);
    expect(englishComparisonDimensions[1]).toMatch(/ease|getting.?started|onboarding|beginner|learning.?curve/i);
    expect(englishComparisonDimensions[2]).toMatch(/coastline/i);
    expect(englishComparisonDimensions[3]).toMatch(/quick|random|draft|starting/i);
    expect(englishComparisonDimensions[4]).toMatch(/sav(?:e|ing)|continu/i);
    expect(chineseComparisonDimensions).toEqual([
      '素材准备',
      '上手门槛',
      '海岸线制作',
      '快速起稿',
      '保存与继续编辑',
    ]);
    const englishLearningCurveRow = englishCopy.comparison.rows[1];
    const chineseLearningCurveRow = chineseCopy.comparison.rows[1];
    if (englishLearningCurveRow === undefined || chineseLearningCurveRow === undefined) {
      throw new Error('Map maker comparison learning-curve row at index 1 is missing.');
    }
    expect(englishLearningCurveRow.photoshop).toMatch(/familiar(?:ity)?/i);
    expect(englishLearningCurveRow.illustrator).toMatch(/familiar(?:ity)?/i);
    expect(chineseLearningCurveRow.photoshop).toMatch(/需(?:要)?熟悉/);
    expect(chineseLearningCurveRow.illustrator).toMatch(/需(?:要)?熟悉/);
    expect(englishLearningCurveRow.mapMaker).toMatch(
      /select (?:a )?cell.*choose.*tile.*replace/i,
    );
    expect(chineseLearningCurveRow.mapMaker).toMatch(/点选格子.*替换拼块/);
    const englishMapMakerComparisonCopy = englishCopy.comparison.rows
      .map((row) => row.mapMaker)
      .join(' ');
    const chineseMapMakerComparisonCopy = chineseCopy.comparison.rows
      .map((row) => row.mapMaker)
      .join(' ');
    expect(englishMapMakerComparisonCopy).not.toMatch(/\bpng\b/i);
    expect(chineseMapMakerComparisonCopy).not.toMatch(/png/i);
    const expectedComparisonRowFields = Array.from({ length: 5 }, () => [
      'dimension',
      'illustrator',
      'mapMaker',
      'photoshop',
    ]);
    expect(englishCopy.comparison.rows.map((row) => Object.keys(row).sort())).toEqual(
      expectedComparisonRowFields,
    );
    expect(chineseCopy.comparison.rows.map((row) => Object.keys(row).sort())).toEqual(
      expectedComparisonRowFields,
    );

    expect(englishCopy.faq.items).toHaveLength(5);
    expect(chineseCopy.faq.items).toHaveLength(5);

    const englishCoastlineFaq = `${englishCopy.faq.items[0]?.question} ${englishCopy.faq.items[0]?.answer}`;
    const chineseCoastlineFaq = `${chineseCopy.faq.items[0]?.question} ${chineseCopy.faq.items[0]?.answer}`;
    const englishElementsFaq = `${englishCopy.faq.items[1]?.question} ${englishCopy.faq.items[1]?.answer}`;
    const chineseElementsFaq = `${chineseCopy.faq.items[1]?.question} ${chineseCopy.faq.items[1]?.answer}`;
    const englishMobileFaq = `${englishCopy.faq.items[4]?.question} ${englishCopy.faq.items[4]?.answer}`;
    const chineseMobileFaq = `${chineseCopy.faq.items[4]?.question} ${chineseCopy.faq.items[4]?.answer}`;

    expect(englishCoastlineFaq).toMatch(/coastline/i);
    expect(englishCoastlineFaq).toMatch(/replace/i);
    expect(chineseCoastlineFaq).toMatch(/海岸线/);
    expect(chineseCoastlineFaq).toMatch(/替换/);
    expect(englishElementsFaq).toMatch(/features|buildings|plants|ships/i);
    expect(chineseElementsFaq).toMatch(/自然地理|建筑|植被|水域|航海/);
    expect(englishMobileFaq).toMatch(/phone/i);
    expect(chineseMobileFaq).toMatch(/手机/);

    const englishPngFaq = `${englishCopy.faq.items[2]?.question} ${englishCopy.faq.items[2]?.answer}`;
    const chinesePngFaq = `${chineseCopy.faq.items[2]?.question} ${chineseCopy.faq.items[2]?.answer}`;
    const englishSaveFaq = `${englishCopy.faq.items[3]?.question} ${englishCopy.faq.items[3]?.answer}`;
    const chineseSaveFaq = `${chineseCopy.faq.items[3]?.question} ${chineseCopy.faq.items[3]?.answer}`;

    expect(englishPngFaq).toMatch(/png/i);
    expect(chinesePngFaq).toMatch(/png/i);
    expect(englishPngFaq).toMatch(/visible/i);
    expect(englishPngFaq).toMatch(/elements?/i);
    expect(englishPngFaq).toMatch(/labels?/i);
    expect(englishPngFaq).toMatch(/grid/i);
    expect(englishPngFaq).toMatch(/not|exclude/i);
    expect(chinesePngFaq).toMatch(/当前显示|可见/);
    expect(chinesePngFaq).toMatch(/元素/);
    expect(chinesePngFaq).toMatch(/标签/);
    expect(chinesePngFaq).toMatch(/网格|方格线/);
    expect(chinesePngFaq).toMatch(/不包含|不含|未包括/);
    expect(englishSaveFaq).toMatch(/\b(?:8|eight)\b/i);
    expect(englishSaveFaq).toMatch(/slot|project file/i);
    expect(englishSaveFaq).toMatch(/json/i);
    expect(englishSaveFaq).not.toMatch(/Roll\s*For\s*Fantasy/i);
    expect(chineseSaveFaq).toMatch(/8|八|槽|存档/);
    expect(chineseSaveFaq).toMatch(/工程文件|项目文件/);
    expect(chineseSaveFaq).toMatch(/json/i);
    expect(chineseSaveFaq).not.toContain('兼容');
  });

  test('fails with the unexpected locale value', () => {
    expect(() => getMapMakerPageCopy('fr' as SiteLocale)).toThrow(
      'Unknown map maker page-copy locale: "fr".',
    );
  });
});
