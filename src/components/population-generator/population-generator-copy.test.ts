import { describe, expect, it } from 'vitest';

import { getPopulationGeneratorCopy } from './population-generator-copy';

describe('population generator count copy', () => {
  it('uses one neutral count in English and Chinese', () => {
    const english = getPopulationGeneratorCopy('en');
    const chinese = getPopulationGeneratorCopy('zh');

    expect(english.professionCountHeader).toBe('Count');
    expect(chinese.professionCountHeader).toBe('数量');
    expect(english.professionCountField(4)).toBe('Count 4');
    expect(chinese.professionCountField(4)).toBe('数量 4');
    expect(english.hideZeroCounts).toBe('Hide zero counts');
    expect(chinese.hideZeroCounts).toBe('隐藏零数量');
    expect(english.professionNote).toContain('one count');
    expect(english.professionNote).toContain('people');
    expect(english.professionNote).toContain('institutions');
    expect(chinese.professionNote).toContain('一个数量');
    expect(chinese.professionNote).toContain('从业人数');
    expect(chinese.professionNote).toContain('机构数');
    expect(english.helpEdits).toContain('one count');
    expect(english.helpEdits).toContain('people or institutions');
    expect(english.helpProfessions).toContain('one count');
    expect(english.helpProfessions).toContain('institutions');
    expect(chinese.helpSummary).toContain('数量');
    expect(chinese.helpEdits).toContain('一个数量');
    expect(chinese.helpEdits).toContain('从业人数或机构数');
    expect(chinese.helpAgriculture).toContain('隐藏零数量');
    expect(chinese.helpProfessions).toContain('一个数量');
    expect(chinese.helpProfessions).toContain('从业人数或机构数');
    expect(english.professionCountHeader).not.toMatch(/person count and an institution count/i);
    expect(chinese.professionCountHeader).not.toBe('人数');
    expect(chinese.professionCountField(1)).not.toContain('人数');
  });

  it('adds the same static help labels in English and Chinese', () => {
    const english = getPopulationGeneratorCopy('en');
    const chinese = getPopulationGeneratorCopy('zh');
    const labelKeys = [
      'helpRulesTitle',
      'helpRangesTitle',
      'helpNumbersTitle',
      'helpSavingTitle',
      'helpSizeColumn',
      'helpRangeColumn',
      'helpUnavailable',
    ] as const;

    expect(english.helpRulesTitle).toBe('Generation rules');
    expect(chinese.helpRulesTitle).toBe('生成规则');
    expect(english.helpRangesTitle).toBe('Population ranges');
    expect(chinese.helpRangesTitle).toBe('人口范围');
    expect(english.helpNumbersTitle).toBe('Understanding the numbers');
    expect(chinese.helpNumbersTitle).toBe('数字解释');
    expect(english.helpSavingTitle).toBe('Saving your results');
    expect(chinese.helpSavingTitle).toBe('保存说明');
    expect(english.helpSizeColumn).toBe('Size');
    expect(chinese.helpSizeColumn).toBe('规模');
    expect(english.helpRangeColumn).toBe('Range');
    expect(chinese.helpRangeColumn).toBe('范围');
    expect(english.helpUnavailable).toBe('Not offered');
    expect(chinese.helpUnavailable).toBe('不提供');
    expect(english.helpTitle).toBe('How to use these numbers');
    expect(chinese.helpTitle).toBe('使用说明与数字解释');
    expect(english.helpSummary).toBe('Names, labels, and counts can be edited separately.');
    expect(chinese.helpSummary).toBe('字段与职业名称、数量可编辑。');
    expect(english.helpRange('Medieval', 'Village 0–1,000')).toBe('Medieval: Village 0–1,000.');
    expect(chinese.helpRange('中世纪', '村庄 0–1,000')).toBe('中世纪：村庄 0–1,000。');

    for (const labelKey of labelKeys) {
      expect(english[labelKey].trim()).not.toBe('');
      expect(chinese[labelKey].trim()).not.toBe('');
      expect(english[labelKey]).not.toBe(chinese[labelKey]);
    }
  });
});
