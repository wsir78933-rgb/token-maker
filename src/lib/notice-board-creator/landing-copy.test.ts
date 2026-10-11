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
      for (const comparisonCell of [row.rollForFantasy, row.helpWanted]) {
        expect(comparisonCell.source?.href).toMatch(/^https:\/\//u);
        expect(comparisonCell.source?.label.trim()).not.toHaveLength(0);
        expect(comparisonCell.source?.checkedOn).toBe('2026-10-11');
      }
      expect(row.rollForFantasy.source?.href).toBe(
        'https://rollforfantasy.com/tools/notice-board-creator.php',
      );
      expect(row.helpWanted.source?.href).toBe(
        'https://www.fairway3games.com/projects/help-wanted/',
      );
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
      '编辑或替换公告文字',
      '移动与缩放公告',
      '添加自定义字体',
      '公开产品页语言',
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
      'Open each official link to check text/resize requirements, documented movement, font setup, and job replacement. These are vendor-page notes, not hands-on tests; checked 2026-10-11.',
    );
    expect(chineseCopy.comparisonDescription).toBe(
      '可打开官方链接核对文字与缩放要求、移动方式、字体设置和任务替换说明。以下为官方页面记载，并非实际交互测试；核验日期：2026-10-11。',
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
      'Edit or replace notice text',
      'Move and resize notices',
      'Add a custom font',
      'Public product page language',
    ]);
    expect(chineseComparisonStatusRows).toEqual(englishComparisonStatusRows);
    expect(englishComparisonStatusRows).toEqual([
      ['supported', 'limited', 'limited'],
      ['supported', 'supported', 'limited'],
      ['supported', 'supported', 'limited'],
      ['supported', 'limited', 'limited'],
    ]);
    expect(englishCopy.comparisonRows.map((row) => [
      row.noticeBoardCreator.label,
      row.rollForFantasy.label,
      row.helpWanted.label,
    ])).toEqual([
      ['Edit text with resize enabled', 'Toggle resize off before adding text', 'Generate a board and replace one notice'],
      ['Drag or use keyboard controls', 'Official instructions describe dragging and resizing', 'Manual move and resize controls are not described on this project page.'],
      ['Add Google Fonts to a project', 'Add a Google Fonts link and family', 'Custom font controls are not described on this page'],
      ['English and Chinese pages', 'Official tool instructions are in English', 'Official project page is in English'],
    ]);
    expect(chineseCopy.comparisonRows.map((row) => [
      row.noticeBoardCreator.label,
      row.rollForFantasy.label,
      row.helpWanted.label,
    ])).toEqual([
      ['缩放开启时仍可编辑文字', '添加文字前需关闭缩放', '生成公告板并单独替换一条任务'],
      ['拖动或使用键盘控件', '官方说明记录了拖动与缩放', '项目页未介绍手动移动或缩放控件。'],
      ['可将 Google Fonts 加入项目', '添加 Google Fonts 链接和字体族名称', '官方页面未介绍自定义字体控件'],
      ['提供中英文页面', '官方工具说明为英文', '官方项目页为英文'],
    ]);
    expect(englishCopy.comparisonSourceCheckedLabel).toBe('Checked');
    expect(chineseCopy.comparisonSourceCheckedLabel).toBe('核验日期');
  });

  it('rejects an unsupported locale with the received value', () => {
    expect(() => getNoticeBoardCreatorLandingCopy('fr')).toThrow('Unknown notice board creator locale');
    expect(() => getNoticeBoardCreatorLandingCopy('fr')).toThrow('"fr"');
  });
});
