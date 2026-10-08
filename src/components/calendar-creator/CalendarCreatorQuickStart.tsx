'use client';

import { useMemo, useState } from 'react';

import {
  CalendarCreatorAdvancedFields,
  CalendarCreatorMonthFields,
  CalendarCreatorWeekFields,
  describeCalendarFieldError,
  parseCalendarDisasterSettingsField,
  parseCalendarMoonSettingsField,
  parseCalendarSettingsField,
  type CalendarCreatorFieldErrors,
} from './CalendarCreatorSettingsFields';
import styles from './CalendarCreatorSettings.module.css';
import { createDefaultCalendarSettings } from '@/lib/calendar-creator/calendar';
import type { CalendarMoonColor, CalendarSettings } from '@/lib/calendar-creator/types';
import { CalendarInputError, requireCalendarSettings } from '@/lib/calendar-creator/validation';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorQuickStartProps = {
  locale: SiteLocale;
  onCreate: (settings: CalendarSettings) => void;
  onOpenHelp: () => void;
  initialSettings?: CalendarSettings;
  onReturnToCalendar?: () => void;
  onOpenArchives?: () => void;
};

type CalendarCreatorQuickStartDraft = {
  settings: CalendarSettings;
  yearInput: string;
  monthCountInput: string;
  uniformDaysInput: string;
  monthDayInputs: string[];
  weekdayCountInput: string;
  moonCycleInputs: Record<CalendarMoonColor, string>;
  disasterProbabilityInput: string;
};

function cloneCalendarSettings(settings: CalendarSettings): CalendarSettings {
  return {
    year: settings.year,
    months: settings.months.map((month) => ({ ...month })),
    weekdayNames: [...settings.weekdayNames],
    startWeekdayIndex: settings.startWeekdayIndex,
    moonCycles: { ...settings.moonCycles },
    disasterProbability: settings.disasterProbability,
  };
}

function createQuickStartDraftFromSettings(sourceSettings: CalendarSettings): CalendarCreatorQuickStartDraft {
  const checkedSettings = requireCalendarSettings(sourceSettings);
  const settings = cloneCalendarSettings(checkedSettings);
  return {
    settings,
    yearInput: String(settings.year),
    monthCountInput: String(settings.months.length),
    uniformDaysInput: String(settings.months[0]?.dayCount ?? 0),
    monthDayInputs: settings.months.map((month) => String(month.dayCount)),
    weekdayCountInput: String(settings.weekdayNames.length),
    moonCycleInputs: {
      white: settings.moonCycles.white === null ? '' : String(settings.moonCycles.white),
      blue: settings.moonCycles.blue === null ? '' : String(settings.moonCycles.blue),
      red: settings.moonCycles.red === null ? '' : String(settings.moonCycles.red),
    },
    disasterProbabilityInput:
      settings.disasterProbability === null ? '' : String(settings.disasterProbability),
  };
}

function createQuickStartDraft(
  initialSettings: CalendarSettings | undefined,
  isReturnMode: boolean,
): CalendarCreatorQuickStartDraft {
  if (!isReturnMode) {
    return createQuickStartDraftFromSettings(createDefaultCalendarSettings());
  }

  if (initialSettings === undefined) {
    throw new Error(
      'Calendar quick-start return mode requires initialSettings. Received undefined.',
    );
  }

  return createQuickStartDraftFromSettings(initialSettings);
}

function resizeMonthRules(
  months: CalendarSettings['months'],
  requestedCount: number,
  newMonthDayCount: number,
): CalendarSettings['months'] {
  return Array.from({ length: requestedCount }, (_, monthIndex) => {
    const existingMonth = months[monthIndex];
    return existingMonth === undefined
      ? { name: '', dayCount: newMonthDayCount }
      : { ...existingMonth };
  });
}

function resizeWeekdayNames(weekdayNames: string[], requestedCount: number): string[] {
  return Array.from({ length: requestedCount }, (_, weekdayIndex) => weekdayNames[weekdayIndex] ?? '');
}

function getDraftTotalDayCount(settings: CalendarSettings): number {
  return settings.months.reduce((totalDayCount, month) => totalDayCount + month.dayCount, 0);
}

function getCalendarInputMessage(error: unknown): string {
  if (error instanceof CalendarInputError) {
    return error.message;
  }

  throw error;
}

function createFieldError(
  fieldErrors: CalendarCreatorFieldErrors,
  fieldName: string,
  message: string | null,
): CalendarCreatorFieldErrors {
  const nextErrors = { ...fieldErrors };
  if (message === null) {
    delete nextErrors[fieldName];
  } else {
    nextErrors[fieldName] = message;
  }

  if (fieldName !== 'form') {
    delete nextErrors.form;
  }

  return nextErrors;
}

function removeErrorsAfterMonthResize(
  fieldErrors: CalendarCreatorFieldErrors,
  monthCount: number,
): CalendarCreatorFieldErrors {
  const nextErrors = { ...fieldErrors };
  for (const fieldName of Object.keys(nextErrors)) {
    const monthMatch = /^month-(\d+)-(?:name|days)$/.exec(fieldName);
    if (monthMatch !== null && Number(monthMatch[1]) > monthCount) {
      delete nextErrors[fieldName];
    }
  }

  delete nextErrors.form;
  return nextErrors;
}

export function CalendarCreatorQuickStart({
  locale,
  onCreate,
  onOpenHelp,
  initialSettings,
  onReturnToCalendar,
  onOpenArchives,
}: CalendarCreatorQuickStartProps) {
  const copy = useMemo(() => getCalendarCreatorCopy(locale), [locale]);
  const isReturnMode = onReturnToCalendar !== undefined;
  const [draft, setDraft] = useState<CalendarCreatorQuickStartDraft>(() =>
    createQuickStartDraft(initialSettings, isReturnMode),
  );
  const [fieldErrors, setFieldErrors] = useState<CalendarCreatorFieldErrors>({});
  const [monthDetailsExpanded, setMonthDetailsExpanded] = useState(false);
  const [weekDetailsExpanded, setWeekDetailsExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  function setError(fieldName: string, message: string | null): void {
    setFieldErrors((currentErrors) => createFieldError(currentErrors, fieldName, message));
  }

  function updateYear(value: string): void {
    setDraft((currentDraft) => ({ ...currentDraft, yearInput: value }));
    const parsedYear = parseCalendarSettingsField(value, 'Calendar year', Number.MIN_SAFE_INTEGER);
    if (parsedYear instanceof CalendarInputError) {
      setError('year', describeCalendarFieldError(parsedYear));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: { ...currentDraft.settings, year: parsedYear },
    }));
    setError('year', null);
  }

  function updateMonthCount(value: string): void {
    setDraft((currentDraft) => ({ ...currentDraft, monthCountInput: value }));
    const parsedCount = parseCalendarSettingsField(value, 'Calendar month count', 1);
    if (parsedCount instanceof CalendarInputError) {
      setError('month-count', describeCalendarFieldError(parsedCount));
      return;
    }

    setDraft((currentDraft) => {
      const fallbackDayCount = parseCalendarSettingsField(
        currentDraft.uniformDaysInput,
        'Calendar uniform days',
        0,
      );
      const newMonthDayCount = fallbackDayCount instanceof CalendarInputError
        ? currentDraft.settings.months[0]?.dayCount ?? 0
        : fallbackDayCount;
      const months = resizeMonthRules(currentDraft.settings.months, parsedCount, newMonthDayCount);
      return {
        ...currentDraft,
        settings: { ...currentDraft.settings, months },
        monthDayInputs: months.map((month) => String(month.dayCount)),
      };
    });
    setError('month-count', null);
    setFieldErrors((currentErrors) => removeErrorsAfterMonthResize(currentErrors, parsedCount));
  }

  function updateUniformDays(value: string): void {
    setDraft((currentDraft) => ({ ...currentDraft, uniformDaysInput: value }));
    const parsedDays = parseCalendarSettingsField(value, 'Calendar uniform days', 0);
    if (parsedDays instanceof CalendarInputError) {
      setError('uniform-days', describeCalendarFieldError(parsedDays));
      return;
    }

    setError('uniform-days', null);
  }

  function fillAllMonths(): void {
    const parsedDays = parseCalendarSettingsField(
      draft.uniformDaysInput,
      'Calendar uniform days',
      0,
    );
    if (parsedDays instanceof CalendarInputError) {
      setError('uniform-days', describeCalendarFieldError(parsedDays));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: {
        ...currentDraft.settings,
        months: currentDraft.settings.months.map((month) => ({ ...month, dayCount: parsedDays })),
      },
      monthDayInputs: currentDraft.settings.months.map(() => String(parsedDays)),
    }));
    setError('uniform-days', null);
    setFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      draft.settings.months.forEach((_, monthIndex) => delete nextErrors[`month-${monthIndex + 1}-days`]);
      return nextErrors;
    });
  }

  function updateMonthName(monthIndex: number, value: string): void {
    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: {
        ...currentDraft.settings,
        months: currentDraft.settings.months.map((month, index) =>
          index === monthIndex ? { ...month, name: value } : month,
        ),
      },
    }));
  }

  function updateMonthDays(monthIndex: number, value: string): void {
    setDraft((currentDraft) => ({
      ...currentDraft,
      monthDayInputs: currentDraft.monthDayInputs.map((dayCount, index) =>
        index === monthIndex ? value : dayCount,
      ),
    }));
    const parsedDays = parseCalendarSettingsField(value, `Calendar month ${monthIndex + 1} days`, 0);
    if (parsedDays instanceof CalendarInputError) {
      setError(`month-${monthIndex + 1}-days`, describeCalendarFieldError(parsedDays));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: {
        ...currentDraft.settings,
        months: currentDraft.settings.months.map((month, index) =>
          index === monthIndex ? { ...month, dayCount: parsedDays } : month,
        ),
      },
    }));
    setError(`month-${monthIndex + 1}-days`, null);
  }

  function updateWeekdayCount(value: string): void {
    setDraft((currentDraft) => ({ ...currentDraft, weekdayCountInput: value }));
    const parsedCount = parseCalendarSettingsField(value, 'Calendar weekday count', 1);
    if (parsedCount instanceof CalendarInputError) {
      setError('weekday-count', describeCalendarFieldError(parsedCount));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: {
        ...currentDraft.settings,
        weekdayNames: resizeWeekdayNames(currentDraft.settings.weekdayNames, parsedCount),
        startWeekdayIndex: Math.min(currentDraft.settings.startWeekdayIndex, parsedCount - 1),
      },
    }));
    setError('weekday-count', null);
  }

  function updateWeekdayName(weekdayIndex: number, value: string): void {
    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: {
        ...currentDraft.settings,
        weekdayNames: currentDraft.settings.weekdayNames.map((weekdayName, index) =>
          index === weekdayIndex ? value : weekdayName,
        ),
      },
    }));
  }

  function updateStartWeekday(value: string): void {
    const parsedIndex = parseCalendarSettingsField(value, 'Calendar start weekday index', 0);
    if (parsedIndex instanceof CalendarInputError) {
      setError('start-weekday', describeCalendarFieldError(parsedIndex));
      return;
    }

    if (parsedIndex >= draft.settings.weekdayNames.length) {
      const invalidIndex = new CalendarInputError(
        `Calendar start weekday index must be smaller than weekday count ${draft.settings.weekdayNames.length}. Received ${JSON.stringify(value)}.`,
      );
      setError('start-weekday', describeCalendarFieldError(invalidIndex));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: { ...currentDraft.settings, startWeekdayIndex: parsedIndex },
    }));
    setError('start-weekday', null);
  }

  function updateMoonCycle(color: CalendarMoonColor, value: string): void {
    setDraft((currentDraft) => ({
      ...currentDraft,
      moonCycleInputs: { ...currentDraft.moonCycleInputs, [color]: value },
    }));
    const parsedCycle = parseCalendarMoonSettingsField(value, `Calendar ${color} moon cycle`);
    if (parsedCycle instanceof CalendarInputError) {
      setError(`${color}-moon-cycle`, describeCalendarFieldError(parsedCycle));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: {
        ...currentDraft.settings,
        moonCycles: { ...currentDraft.settings.moonCycles, [color]: parsedCycle },
      },
    }));
    setError(`${color}-moon-cycle`, null);
  }

  function updateDisasterProbability(value: string): void {
    setDraft((currentDraft) => ({ ...currentDraft, disasterProbabilityInput: value }));
    const parsedProbability = parseCalendarDisasterSettingsField(value, 'Calendar disaster probability');
    if (parsedProbability instanceof CalendarInputError) {
      setError('disaster-probability', describeCalendarFieldError(parsedProbability));
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      settings: { ...currentDraft.settings, disasterProbability: parsedProbability },
    }));
    setError('disaster-probability', null);
  }

  function handleCreate(): void {
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    try {
      onCreate(requireCalendarSettings(draft.settings));
    } catch (error: unknown) {
      if (error instanceof CalendarInputError) {
        setError('form', getCalendarInputMessage(error));
        return;
      }

      throw error;
    }
  }

  const formError = fieldErrors.form;
  const quickStartTitle = isReturnMode ? copy.editSettingsTitle : copy.createTitle;
  const quickStartDescription = isReturnMode ? copy.editSettingsDescription : copy.createDescription;
  const quickStartSubmitLabel = isReturnMode ? copy.regenerateCalendar : copy.create;

  return (
    <section
      aria-labelledby="calendar-creator-quick-start-title"
      className="min-w-0 overflow-hidden rounded-3xl border border-[var(--site-border-soft)] bg-[var(--site-panel)] shadow-[var(--site-card-shadow)]"
      data-testid="calendar-creator-quick-start"
    >
      <div className={styles.quickStartBody}>
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--site-accent-strong)]">
            {isReturnMode ? copy.update : copy.create}
          </p>
          <h2 id="calendar-creator-quick-start-title" className="mt-2 font-display text-3xl leading-tight text-[var(--site-ink-strong)] sm:text-4xl">
            {quickStartTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--site-ink)] sm:text-base">
            {quickStartDescription}
          </p>
        </header>

        {formError !== undefined ? (
          <p className="mt-5 rounded-lg border border-red-300/30 bg-red-950/20 p-3 text-sm leading-6 text-red-800 dark:text-red-100" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="min-w-0">
              <label className="block text-sm font-medium text-[var(--site-ink-strong)]" htmlFor="calendar-quick-start-year">
                {copy.year}
              </label>
              <input
                id="calendar-quick-start-year"
                type="number"
                value={draft.yearInput}
                onChange={(event) => updateYear(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
              />
              {fieldErrors.year !== undefined ? <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-200" role="alert">{fieldErrors.year}</p> : null}
            </div>
            <CalendarCreatorMonthFields
              copy={copy}
              settings={draft.settings}
              monthCountInput={draft.monthCountInput}
              uniformDaysInput={draft.uniformDaysInput}
              monthDayInputs={draft.monthDayInputs}
              fieldErrors={fieldErrors}
              monthDetailsExpanded={monthDetailsExpanded}
              onMonthCountChange={updateMonthCount}
              onUniformDaysChange={updateUniformDays}
              onFillAllMonths={fillAllMonths}
              onMonthNameChange={updateMonthName}
              onMonthDaysChange={updateMonthDays}
              onToggleMonthDetails={() => setMonthDetailsExpanded((expanded) => !expanded)}
            />
          </div>

          <div className="space-y-8">
            <CalendarCreatorWeekFields
              copy={copy}
              settings={draft.settings}
              weekdayCountInput={draft.weekdayCountInput}
              fieldErrors={fieldErrors}
              weekDetailsExpanded={weekDetailsExpanded}
              onWeekdayCountChange={updateWeekdayCount}
              onWeekdayNameChange={updateWeekdayName}
              onStartWeekdayChange={updateStartWeekday}
              onToggleWeekDetails={() => setWeekDetailsExpanded((expanded) => !expanded)}
            />
            <section className="space-y-4" aria-labelledby="calendar-quick-start-optional-title">
              <button
                id="calendar-quick-start-optional-title"
                type="button"
                aria-expanded={advancedExpanded}
                onClick={() => setAdvancedExpanded((expanded) => !expanded)}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-left text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-accent-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
              >
                <span>{copy.optionalSettings}</span>
                <span aria-hidden="true" className="text-[var(--site-ink-soft)]">{advancedExpanded ? '−' : '+'}</span>
              </button>
              {advancedExpanded ? (
                <CalendarCreatorAdvancedFields
                  copy={copy}
                  settings={draft.settings}
                  moonCycleInputs={draft.moonCycleInputs}
                  disasterProbabilityInput={draft.disasterProbabilityInput}
                  fieldErrors={fieldErrors}
                  locale={locale}
                  onMoonCycleChange={updateMoonCycle}
                  onDisasterProbabilityChange={updateDisasterProbability}
                />
              ) : null}
            </section>
          </div>
        </div>
      </div>

      <footer className={styles.settingsFooter}>
        <div className={`${styles.footerMeta} flex-wrap`}>
          {onReturnToCalendar !== undefined ? (
            <button
              type="button"
              onClick={onReturnToCalendar}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-4 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
            >
              {copy.resumeCalendar}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onOpenHelp}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-4 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
          >
            {copy.help}
          </button>
          <p
            className="text-sm font-medium text-[var(--site-ink-soft)]"
            data-testid="calendar-creator-total-days"
            aria-live="polite"
          >
            {getDraftTotalDayCount(draft.settings)} {copy.daysUnit}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {onOpenArchives !== undefined && onReturnToCalendar === undefined ? (
            <button
              type="button"
              onClick={onOpenArchives}
              data-calendar-screen-only
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-4 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
            >
              {copy.archives}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--site-accent-strong)] px-5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40 dark:text-stone-950"
          >
            {quickStartSubmitLabel}
          </button>
        </div>
      </footer>
    </section>
  );
}

export default CalendarCreatorQuickStart;
