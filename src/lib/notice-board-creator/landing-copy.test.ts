import { describe, expect, it } from 'vitest';

import { getNoticeBoardCreatorLandingCopy } from '@/lib/notice-board-creator/landing-copy';

describe('notice board creator landing copy', () => {
  it.each(['en', 'zh'] as const)('provides complete localized sections for %s', (locale) => {
    const copy = getNoticeBoardCreatorLandingCopy(locale);

    expect(copy.navigationName.trim()).not.toHaveLength(0);
    expect(copy.pageTitle.trim()).not.toHaveLength(0);
    expect(copy.pageDescription.trim()).not.toHaveLength(0);
    expect(copy.heading.trim()).not.toHaveLength(0);
    expect(copy.heroAction.trim()).not.toHaveLength(0);
    expect(copy.whatIsTitle.trim()).not.toHaveLength(0);
    expect(copy.whatIsDescription.trim()).not.toHaveLength(0);
    expect(copy.featuresTitle.trim()).not.toHaveLength(0);
    expect(copy.featuresSubtitle.trim()).not.toHaveLength(0);
    expect(copy.comparisonTitle.trim()).not.toHaveLength(0);
    expect(copy.comparisonDescription.trim()).not.toHaveLength(0);
    expect(copy.comparisonTableLabel.trim()).not.toHaveLength(0);
    expect(copy.comparisonDimensionHeading.trim()).not.toHaveLength(0);
    expect(copy.noticeBoardCreatorHeading.trim()).not.toHaveLength(0);
    expect(copy.rollForFantasyHeading.trim()).not.toHaveLength(0);
    expect(copy.helpWantedHeading.trim()).not.toHaveLength(0);
    expect(copy.features).toHaveLength(6);
    expect(copy.howToUseSteps).toHaveLength(3);
    expect(copy.comparisonRows).toHaveLength(4);
    expect(copy.faqItems).toHaveLength(5);
    expect(copy.comparisonDescription.length).toBeLessThanOrEqual(locale === 'en' ? 200 : 90);

    for (const feature of copy.features) {
      expect(feature.title.trim()).not.toHaveLength(0);
      expect(feature.description.trim()).not.toHaveLength(0);
    }
    for (const step of copy.howToUseSteps) {
      expect(step.title.trim()).not.toHaveLength(0);
      expect(step.description.trim()).not.toHaveLength(0);
    }
    for (const row of copy.comparisonRows) {
      expect(row.dimension.trim()).not.toHaveLength(0);
      for (const comparisonCell of [row.noticeBoardCreator, row.rollForFantasy, row.helpWanted]) {
        expect(comparisonCell.status).toMatch(/^(supported|unsupported|limited)$/);
        expect(comparisonCell.label.trim()).not.toHaveLength(0);
      }
    }
    for (const item of copy.faqItems) {
      expect(item.question.trim()).not.toHaveLength(0);
      expect(item.answer.trim()).not.toHaveLength(0);
    }
  });

  it('keeps the English and Chinese comparison structure aligned', () => {
    const englishCopy = getNoticeBoardCreatorLandingCopy('en');
    const chineseCopy = getNoticeBoardCreatorLandingCopy('zh');

    expect(chineseCopy.features.map((feature) => feature.icon)).toEqual(
      englishCopy.features.map((feature) => feature.icon),
    );
    expect(chineseCopy.howToUseSteps).toHaveLength(englishCopy.howToUseSteps.length);
    expect(chineseCopy.comparisonRows.map((row) => row.dimension)).toEqual([
      '编辑无需关闭缩放',
      '键盘移动与缩放',
      'TXT 恢复自定义字体配置',
      '中英文编辑界面',
    ]);
    expect(englishCopy.comparisonRows).toHaveLength(chineseCopy.comparisonRows.length);
    expect(chineseCopy.faqItems).toHaveLength(englishCopy.faqItems.length);
  });

  it('compares the three tools on four verified workflow advantages', () => {
    const englishCopy = getNoticeBoardCreatorLandingCopy('en');
    const chineseCopy = getNoticeBoardCreatorLandingCopy('zh');

    expect(englishCopy.comparisonDimensionHeading).toBe('Feature');
    expect(chineseCopy.comparisonDimensionHeading).toBe('对比功能');
    expect(englishCopy.comparisonTitle).toBe(
      'Notice Board Creator vs. RollForFantasy vs. Help Wanted!',
    );
    expect(chineseCopy.comparisonTitle).toBe(
      '奇幻任务公告板 vs. RollForFantasy vs. Help Wanted!',
    );
    expect(englishCopy.comparisonDescription).toBe(
      'Fewer editing steps, precise layout controls, and font settings that stay with your project.',
    );
    expect(chineseCopy.comparisonDescription).toBe(
      '少切换操作，更精细地排版，让字体配置随项目一起保留。',
    );
    const englishComparisonStatusRows = englishCopy.comparisonRows.map((row) => [
      row.noticeBoardCreator.status,
      row.rollForFantasy.status,
      row.helpWanted.status,
    ]);
    const chineseComparisonStatusRows = chineseCopy.comparisonRows.map((row) => [
      row.noticeBoardCreator.status,
      row.rollForFantasy.status,
      row.helpWanted.status,
    ]);

    expect(englishCopy.comparisonRows.map((row) => row.dimension)).toEqual([
      'Edit without disabling resize',
      'Keyboard move & resize',
      'Custom font settings in TXT',
      'English & Chinese editor',
    ]);
    expect(chineseComparisonStatusRows).toEqual(englishComparisonStatusRows);
    expect(englishComparisonStatusRows).toEqual([
      ['supported', 'limited', 'unsupported'],
      ['supported', 'unsupported', 'unsupported'],
      ['supported', 'limited', 'unsupported'],
      ['supported', 'limited', 'limited'],
    ]);
    expect(englishCopy.comparisonRows.map((row) => [
      row.noticeBoardCreator.label,
      row.rollForFantasy.label,
      row.helpWanted.label,
    ])).toEqual([
      ['Supported', 'Disable resize first', 'No notice text editor'],
      ['Supported', 'No keyboard layout controls', 'No manual layout controls'],
      ['Supported', 'Re-add font links', 'No custom-font settings'],
      ['Supported', 'English UI', 'English UI'],
    ]);
    expect(chineseCopy.comparisonRows.map((row) => [
      row.noticeBoardCreator.label,
      row.rollForFantasy.label,
      row.helpWanted.label,
    ])).toEqual([
      ['支持', '需先关闭缩放', '无公告正文编辑入口'],
      ['支持', '无键盘排版控件', '无手动排版控件'],
      ['支持', '需重加字体链接', '无自定义字体设置'],
      ['支持', '英文界面', '英文界面'],
    ]);
  });

  it('rejects an unsupported locale with the received value', () => {
    expect(() => getNoticeBoardCreatorLandingCopy('fr')).toThrow('Unknown notice board creator locale');
    expect(() => getNoticeBoardCreatorLandingCopy('fr')).toThrow('"fr"');
  });
});
