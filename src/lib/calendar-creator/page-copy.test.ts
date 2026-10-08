import { describe, expect, it } from 'vitest';

import {
  getCalendarCreatorPageCopy,
  type CalendarCreatorPageCopy,
} from './page-copy';
import { getCalendarCreatorCopy } from './copy';
import type { SiteLocale } from '@/lib/site-locale';

const REQUIRED_PAGE_GROUPS = [
  'whatIs',
  'features',
  'howItWorks',
  'comparison',
  'cta',
  'faq',
] as const satisfies readonly (keyof CalendarCreatorPageCopy)[];

const REQUIRED_COMPARISON_FIELDS = [
  'label',
  'tokenMaker',
  'rollForFantasy',
  'spreadsheet',
] as const;

function assertNonEmptyText(text: string, label: string): void {
  expect(text.trim(), label).not.toBe('');
}

function assertPageCopyShape(pageCopy: CalendarCreatorPageCopy, locale: 'en' | 'zh'): void {
  expect(Object.keys(pageCopy)).toEqual(REQUIRED_PAGE_GROUPS);

  assertNonEmptyText(pageCopy.whatIs.eyebrow, `${locale}.whatIs.eyebrow`);
  assertNonEmptyText(pageCopy.whatIs.title, `${locale}.whatIs.title`);
  expect(pageCopy.whatIs.paragraphs, `${locale}.whatIs.paragraphs`).toHaveLength(2);
  expect(pageCopy.whatIs.audiences, `${locale}.whatIs.audiences`).toHaveLength(3);

  assertNonEmptyText(pageCopy.features.eyebrow, `${locale}.features.eyebrow`);
  assertNonEmptyText(pageCopy.features.title, `${locale}.features.title`);
  assertNonEmptyText(pageCopy.features.description, `${locale}.features.description`);
  expect(pageCopy.features.items, `${locale}.features.items`).toHaveLength(6);

  assertNonEmptyText(pageCopy.howItWorks.eyebrow, `${locale}.howItWorks.eyebrow`);
  assertNonEmptyText(pageCopy.howItWorks.title, `${locale}.howItWorks.title`);
  assertNonEmptyText(pageCopy.howItWorks.description, `${locale}.howItWorks.description`);
  expect(pageCopy.howItWorks.steps, `${locale}.howItWorks.steps`).toHaveLength(3);

  assertNonEmptyText(pageCopy.comparison.eyebrow, `${locale}.comparison.eyebrow`);
  assertNonEmptyText(pageCopy.comparison.title, `${locale}.comparison.title`);
  assertNonEmptyText(pageCopy.comparison.description, `${locale}.comparison.description`);
  assertNonEmptyText(pageCopy.comparison.tableLabel, `${locale}.comparison.tableLabel`);
  assertNonEmptyText(pageCopy.comparison.criterionLabel, `${locale}.comparison.criterionLabel`);
  assertNonEmptyText(pageCopy.comparison.tokenMakerLabel, `${locale}.comparison.tokenMakerLabel`);
  assertNonEmptyText(pageCopy.comparison.rollForFantasyLabel, `${locale}.comparison.rollForFantasyLabel`);
  assertNonEmptyText(pageCopy.comparison.spreadsheetLabel, `${locale}.comparison.spreadsheetLabel`);
  expect(pageCopy.comparison.rows, `${locale}.comparison.rows.length`).toHaveLength(6);
  for (const [rowIndex, comparisonRow] of pageCopy.comparison.rows.entries()) {
    expect(Object.keys(comparisonRow)).toEqual(REQUIRED_COMPARISON_FIELDS);
    for (const field of REQUIRED_COMPARISON_FIELDS) {
      assertNonEmptyText(comparisonRow[field], `${locale}.comparison.rows[${rowIndex}].${field}`);
    }
  }

  assertNonEmptyText(pageCopy.cta.eyebrow, `${locale}.cta.eyebrow`);
  assertNonEmptyText(pageCopy.cta.title, `${locale}.cta.title`);
  assertNonEmptyText(pageCopy.cta.description, `${locale}.cta.description`);
  assertNonEmptyText(pageCopy.cta.buttonLabel, `${locale}.cta.buttonLabel`);

  assertNonEmptyText(pageCopy.faq.eyebrow, `${locale}.faq.eyebrow`);
  assertNonEmptyText(pageCopy.faq.title, `${locale}.faq.title`);
  assertNonEmptyText(pageCopy.faq.description, `${locale}.faq.description`);
  expect(pageCopy.faq.items, `${locale}.faq.items`).toHaveLength(12);
  for (const [itemIndex, faqItem] of pageCopy.faq.items.entries()) {
    assertNonEmptyText(faqItem.question, `${locale}.faq.items[${itemIndex}].question`);
    assertNonEmptyText(faqItem.answer, `${locale}.faq.items[${itemIndex}].answer`);
  }
}

describe('calendar creator page copy', () => {
  it('keeps the public shape and required paired section counts in both locales', () => {
    const englishPageCopy = getCalendarCreatorPageCopy('en');
    const chinesePageCopy = getCalendarCreatorPageCopy('zh');

    assertPageCopyShape(englishPageCopy, 'en');
    assertPageCopyShape(chinesePageCopy, 'zh');
    expect(englishPageCopy.whatIs.paragraphs).toHaveLength(chinesePageCopy.whatIs.paragraphs.length);
    expect(englishPageCopy.whatIs.audiences).toHaveLength(chinesePageCopy.whatIs.audiences.length);
    expect(englishPageCopy.features.items).toHaveLength(chinesePageCopy.features.items.length);
    expect(englishPageCopy.howItWorks.steps).toHaveLength(chinesePageCopy.howItWorks.steps.length);
    expect(englishPageCopy.comparison.rows).toHaveLength(chinesePageCopy.comparison.rows.length);
    expect(englishPageCopy.faq.items).toHaveLength(chinesePageCopy.faq.items.length);
  });

  it('keeps the documented boundaries visible in the page copy', () => {
    const englishPageCopy = getCalendarCreatorPageCopy('en');
    const chinesePageCopy = getCalendarCreatorPageCopy('zh');

    expect(englishPageCopy.whatIs.title).toBe('What is a Fantasy Calendar Generator?');
    expect(chinesePageCopy.whatIs.title).toBe('什么是奇幻历法生成器？');
    expect(englishPageCopy.features.items[4]?.description).toContain('four browser-local slots');
    expect(englishPageCopy.features.items[5]?.description).toContain('native PNG export is not provided');
    expect(englishPageCopy.faq.items[2]?.answer).toContain('Current notes and manual icons are cleared');
    expect(englishPageCopy.faq.items[5]?.answer).toContain('latest manual icon change');
    expect(englishPageCopy.faq.items[0]?.answer).toContain('free to use');
    expect(englishPageCopy.faq.items[1]?.answer).toContain('set to 0');
    expect(englishPageCopy.faq.items[9]?.answer).toBe(
      `Yes. Tap ${getCalendarCreatorCopy('en').multiSelect}, choose several dates, then tap ${getCalendarCreatorCopy('en').finishSelection} to open their editor and apply an icon.`,
    );
    expect(englishPageCopy.faq.items[10]?.answer).toContain('interface displays a default name');
    expect(chinesePageCopy.features.items[4]?.description).toContain('四个浏览器本地槽位');
    expect(chinesePageCopy.features.items[5]?.description).toContain('不提供原生 PNG 导出');
    expect(chinesePageCopy.faq.items[2]?.answer).toContain('清除当前笔记和手动图标');
    expect(chinesePageCopy.faq.items[5]?.answer).toContain('最近一次手动图标修改');
    expect(chinesePageCopy.faq.items[0]?.answer).toContain('免费创建');
    expect(chinesePageCopy.faq.items[1]?.answer).toContain('设为 0');
    expect(chinesePageCopy.faq.items[9]?.answer).toBe(
      `可以。点击“${getCalendarCreatorCopy('zh').multiSelect}”，勾选多个日期，再点击“${getCalendarCreatorCopy('zh').finishSelection}”打开编辑面板，选择图标即可批量应用。`,
    );
    expect(chinesePageCopy.faq.items[10]?.answer).toContain('界面会显示');
  });

  it('keeps the competitor comparison aligned with the verified calendar workflow', () => {
    const englishComparison = getCalendarCreatorPageCopy('en').comparison;
    const chineseComparison = getCalendarCreatorPageCopy('zh').comparison;

    expect(englishComparison.title).toBe('Fantasy Calendar Generator vs Roll for Fantasy vs Spreadsheets');
    expect(englishComparison.rows[0]?.tokenMaker).toBe('Ready to create with defaults');
    expect(englishComparison.rows[0]?.rollForFantasy).toBe('Month lengths need manual entry');
    expect(englishComparison.rows[3]?.rollForFantasy).toBe('Changing years clears notes and icons');
    expect(englishComparison.rows[5]?.tokenMaker).toBe('Batch marking on phones too');
    expect(chineseComparison.title).toBe('奇幻历法生成器 vs Roll for Fantasy vs 电子表格');
    expect(chineseComparison.rows[0]?.tokenMaker).toBe('默认值直接创建');
    expect(chineseComparison.rows[0]?.rollForFantasy).toBe('需逐月填写');
    expect(chineseComparison.rows[3]?.rollForFantasy).toBe('换年会清除笔记和图标');
    expect(chineseComparison.rows[5]?.tokenMaker).toBe('手机也能批量标记');
  });

  it('fails fast for an unsupported locale', () => {
    expect(() => getCalendarCreatorPageCopy('fr' as SiteLocale)).toThrowError(
      /^Unknown calendar creator page copy locale\. Received "fr"\.$/,
    );
  });
});
