import { describe, expect, it } from 'vitest';

import { getCalendarCreatorCopy, type CalendarCreatorCopy } from './copy';
import type { SiteLocale } from '@/lib/site-locale';

const REQUIRED_COPY_KEYS: readonly (keyof CalendarCreatorCopy)[] = [
  'pageTitle',
  'pageDescription',
  'title',
  'description',
  'navigationTitle',
  'createTitle',
  'createDescription',
  'create',
  'update',
  'close',
  'returnToSettings',
  'resumeCalendar',
  'editSettingsTitle',
  'editSettingsDescription',
  'regenerateCalendar',
  'regenerateTitle',
  'regenerateDescription',
  'regenerateConfirm',
  'cancel',
  'save',
  'archives',
  'print',
  'continued',
  'help',
  'previousYear',
  'nextYear',
  'year',
  'monthCount',
  'uniformDays',
  'fillAllMonths',
  'monthName',
  'monthDays',
  'weekdayCount',
  'weekdayName',
  'startWeekday',
  'basicTab',
  'weekTab',
  'moonsTab',
  'disastersTab',
  'monthDetails',
  'weekDetails',
  'optionalSettings',
  'whiteMoon',
  'blueMoon',
  'redMoon',
  'cycleDays',
  'cycleOff',
  'disasterChance',
  'disasterOff',
  'disasterPool',
  'monthFallback',
  'weekdayFallback',
  'day',
  'daysUnit',
  'monthJump',
  'previousMonth',
  'nextMonth',
  'editDayHint',
  'multiSelect',
  'finishSelection',
  'selectedDates',
  'clearSelection',
  'dayNotes',
  'manualIcon',
  'ordinaryIcons',
  'moonIcons',
  'clearManual',
  'undoMarker',
  'automaticLayers',
  'slot',
  'emptySlot',
  'currentSlot',
  'open',
  'loaded',
  'saveHere',
  'saveAsHere',
  'updateCurrent',
  'localNotice',
  'completeSaveNotice',
  'unsaved',
  'saved',
  'unsavedTitle',
  'unsavedDescription',
  'discardContinue',
  'saveContinue',
  'overwriteTitle',
  'overwriteDescription',
  'confirmOverwrite',
  'saveTarget',
  'sourceSlotExcluded',
  'saveFailed',
  'loadFailed',
  'genericError',
  'noDates',
  'invalidValue',
  'rules',
  'yearEnterHint',
  'noSelection',
  'undoUnavailable',
  'notePlaceholder',
  'advancedOffHint',
  'defaultSummary',
  'uniformDraftHint',
  'rulesRebuildHint',
  'batchApplied',
  'saveLocationCleared',
];

function assertCompleteCopy(copy: CalendarCreatorCopy, locale: 'en' | 'zh'): void {
  for (const key of REQUIRED_COPY_KEYS) {
    expect(copy[key].trim(), `${locale}.${key}`).not.toBe('');
  }
}

describe('calendar creator copy', () => {
  it('returns complete English and Chinese interaction copy', () => {
    const englishCopy = getCalendarCreatorCopy('en');
    const chineseCopy = getCalendarCreatorCopy('zh');

    assertCompleteCopy(englishCopy, 'en');
    assertCompleteCopy(chineseCopy, 'zh');
    expect(englishCopy.pageTitle).not.toBe(chineseCopy.pageTitle);
    expect(englishCopy.navigationTitle).toBe('Fantasy Calendar Generator');
    expect(chineseCopy.navigationTitle).toBe('奇幻历法生成器');
  });

  it('keeps fallback templates and local save behavior explicit in both locales', () => {
    const englishCopy = getCalendarCreatorCopy('en');
    const chineseCopy = getCalendarCreatorCopy('zh');

    expect(englishCopy.monthFallback).toContain('{number}');
    expect(englishCopy.weekdayFallback).toContain('{number}');
    expect(chineseCopy.monthFallback).toContain('{number}');
    expect(chineseCopy.weekdayFallback).toContain('{number}');
    expect(englishCopy.localNotice.toLowerCase()).toContain('browser');
    expect(chineseCopy.localNotice).toContain('浏览器');
  });

  it('keeps page prose and obsolete timeline fields out of interaction copy', () => {
    const englishCopy = getCalendarCreatorCopy('en');

    expect(Object.hasOwn(englishCopy, 'timeline')).toBe(false);
    expect(Object.hasOwn(englishCopy, 'timelineHref')).toBe(false);
    expect(Object.hasOwn(englishCopy, 'helpTitle')).toBe(false);
    expect(Object.hasOwn(englishCopy, 'helpItems')).toBe(false);
    expect(Object.hasOwn(englishCopy, 'faqTitle')).toBe(false);
    expect(Object.hasOwn(englishCopy, 'faqItems')).toBe(false);
  });

  it('contains the bilingual settings return and regeneration copy', () => {
    const englishCopy = getCalendarCreatorCopy('en');
    const chineseCopy = getCalendarCreatorCopy('zh');

    expect(englishCopy.returnToSettings).toBe('Back to settings');
    expect(englishCopy.resumeCalendar).toBe('Back to calendar');
    expect(englishCopy.editSettingsTitle).toBe('Adjust calendar settings');
    expect(englishCopy.editSettingsDescription).toBe(
      'Your current calendar is kept while you edit settings. It changes only after you confirm regeneration.',
    );
    expect(englishCopy.regenerateCalendar).toBe('Regenerate calendar');
    expect(englishCopy.regenerateTitle).toBe('Regenerate this calendar?');
    expect(englishCopy.regenerateDescription).toBe(
      'The year will be rebuilt with the new settings. Current notes and manual icons will be cleared, and moon phases and disasters will be generated again. Saved archives will be kept.',
    );
    expect(englishCopy.regenerateConfirm).toBe('Confirm regeneration');

    expect(chineseCopy.returnToSettings).toBe('返回设置');
    expect(chineseCopy.resumeCalendar).toBe('返回历法');
    expect(chineseCopy.editSettingsTitle).toBe('修改历法设置');
    expect(chineseCopy.editSettingsDescription).toBe('调整参数时当前历法会保留，确认重新生成后才会更新。');
    expect(chineseCopy.regenerateCalendar).toBe('重新生成历法');
    expect(chineseCopy.regenerateTitle).toBe('重新生成历法？');
    expect(chineseCopy.regenerateDescription).toBe(
      '将按新设置重建整年，清除当前笔记和手动图标，并重新生成月相和灾害。已保存的存档不会被删除。',
    );
    expect(chineseCopy.regenerateConfirm).toBe('确认重新生成');
  });

  it('names the visible month controls in both locales', () => {
    const englishCopy = getCalendarCreatorCopy('en');
    const chineseCopy = getCalendarCreatorCopy('zh');

    expect(englishCopy.monthJump).toBe('Month');
    expect(englishCopy.previousMonth).toBe('Previous month');
    expect(englishCopy.nextMonth).toBe('Next month');
    expect(chineseCopy.monthJump).toBe('月份');
    expect(chineseCopy.previousMonth).toBe('上一月');
    expect(chineseCopy.nextMonth).toBe('下一月');
  });

  it('fails fast for an unsupported locale', () => {
    expect(() => getCalendarCreatorCopy('fr' as SiteLocale)).toThrowError(
      /^Unknown calendar creator locale\. Received "fr"\.$/,
    );
  });
});
