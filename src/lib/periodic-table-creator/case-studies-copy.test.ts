import { describe, expect, it } from 'vitest';

import { getPeriodicTableCaseStudiesCopy } from '@/lib/periodic-table-creator/case-studies-copy';

const expectedGroupCaseIds = [
  ['elemental-schools', 'arcane-crystals', 'forbidden-elements', 'enchantment-gems'],
  ['forge-metals', 'organic-materials', 'forest-herbarium', 'creature-components', 'alchemical-reagents'],
  ['stellar-minerals', 'energy-media', 'engineering-alloys'],
] as const;

function flattenCaseExamples(locale: 'en' | 'zh') {
  return getPeriodicTableCaseStudiesCopy(locale).groups.flatMap((group) => group.examples);
}

describe('getPeriodicTableCaseStudiesCopy', () => {
  it('provides the confirmed three groups and twelve unique case ids', () => {
    const copy = getPeriodicTableCaseStudiesCopy('en');

    expect(copy.groups).toHaveLength(3);
    expect(copy.groups.map((group) => group.examples.length)).toEqual([4, 5, 3]);
    expect(copy.groups.map((group) => group.imagePosition)).toEqual(['left', 'right', 'left']);
    expect(copy.groups.map((group) => group.examples.map((example) => example.caseId))).toEqual(
      expectedGroupCaseIds,
    );

    const examples = flattenCaseExamples('en');
    expect(examples).toHaveLength(12);
    expect(new Set(examples.map((example) => example.caseId)).size).toBe(12);

    for (const example of examples) {
      expect(example.name).not.toHaveLength(0);
      expect(example.quote).not.toHaveLength(0);
      expect(example.designation).not.toHaveLength(0);
      expect(example.alt).toMatch(/[A-Za-z]/);
      expect(example.alt).not.toMatch(/[\u3400-\u9fff]/);
    }

    for (const example of flattenCaseExamples('zh')) {
      expect(example.alt).toMatch(/[\u3400-\u9fff]/);
    }
  });

  it('keeps English and Chinese metadata aligned and preserves approved case copy', () => {
    const englishExamples = flattenCaseExamples('en');
    const chineseExamples = flattenCaseExamples('zh');

    expect(chineseExamples.map((example) => example.caseId)).toEqual(
      englishExamples.map((example) => example.caseId),
    );

    expect(englishExamples[0]).toMatchObject({
      caseId: 'elemental-schools',
      name: 'Elemental Schools',
      quote: 'Map the six schools of Aetherfall magic from first spark to realm-shaping practice.',
    });
    expect(chineseExamples[0]).toMatchObject({
      caseId: 'elemental-schools',
      name: '元素学派表',
      quote: '把以太陨落的六个魔法学派按从初火到塑界阶段整理出来。',
    });
  });

  it('keeps the bilingual controls usable', () => {
    for (const locale of ['en', 'zh'] as const) {
      const copy = getPeriodicTableCaseStudiesCopy(locale);

      expect(copy.title).not.toHaveLength(0);
      expect(copy.description).toContain(locale === 'en' ? '24-entry' : '24 格');
      expect(copy.useCase).not.toHaveLength(0);
      expect(copy.downloadTemplate).not.toHaveLength(0);
      expect(copy.loadingCase).not.toHaveLength(0);
      expect(copy.caseLoaded).toContain('{name}');
      expect(copy.previousLabel).not.toHaveLength(0);
      expect(copy.nextLabel).not.toHaveLength(0);
    }

    expect(getPeriodicTableCaseStudiesCopy('en').downloadTemplate).toBe('Download TXT template');
    expect(getPeriodicTableCaseStudiesCopy('zh').downloadTemplate).toBe('下载 TXT 模板');
    expect(getPeriodicTableCaseStudiesCopy('en').useCase).toBe('Use this case');
    expect(getPeriodicTableCaseStudiesCopy('zh').useCase).toBe('使用此案例');
  });

  it('fails fast for an unsupported locale', () => {
    expect(() => getPeriodicTableCaseStudiesCopy('fr' as never)).toThrow(
      'Unknown periodic table case studies locale. Received "fr".',
    );
  });
});
