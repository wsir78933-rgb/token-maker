'use client';

import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

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
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { CalendarMoonColor, CalendarSettings } from '@/lib/calendar-creator/types';
import { CalendarInputError, requireCalendarSettings } from '@/lib/calendar-creator/validation';
import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorSettingsProps = {
  locale: SiteLocale;
  settings: CalendarSettings;
  onApply: (settings: CalendarSettings) => void;
  onClose: () => void;
};

type CalendarCreatorSettingsTab = 'basic' | 'week' | 'moons' | 'disasters';

type CalendarCreatorSettingsDraft = {
  settings: CalendarSettings;
  yearInput: string;
  monthCountInput: string;
  uniformDaysInput: string;
  monthDayInputs: string[];
  weekdayCountInput: string;
  moonCycleInputs: Record<CalendarMoonColor, string>;
  disasterProbabilityInput: string;
};

const CALENDAR_CREATOR_TABS: readonly CalendarCreatorSettingsTab[] = [
  'basic',
  'week',
  'moons',
  'disasters',
];

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

function createSettingsDraft(settings: CalendarSettings): CalendarCreatorSettingsDraft {
  const checkedSettings = requireCalendarSettings(settings);
  return {
    settings: cloneCalendarSettings(checkedSettings),
    yearInput: String(checkedSettings.year),
    monthCountInput: String(checkedSettings.months.length),
    uniformDaysInput: String(checkedSettings.months[0]?.dayCount ?? 0),
    monthDayInputs: checkedSettings.months.map((month) => String(month.dayCount)),
    weekdayCountInput: String(checkedSettings.weekdayNames.length),
    moonCycleInputs: {
      white: checkedSettings.moonCycles.white === null ? '' : String(checkedSettings.moonCycles.white),
      blue: checkedSettings.moonCycles.blue === null ? '' : String(checkedSettings.moonCycles.blue),
      red: checkedSettings.moonCycles.red === null ? '' : String(checkedSettings.moonCycles.red),
    },
    disasterProbabilityInput:
      checkedSettings.disasterProbability === null ? '' : String(checkedSettings.disasterProbability),
  };
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

function getCalendarInputMessage(error: unknown): string {
  if (error instanceof CalendarInputError) {
    return error.message;
  }

  throw error;
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

function removeErrorsAfterWeekdayResize(
  fieldErrors: CalendarCreatorFieldErrors,
  weekdayCount: number,
): CalendarCreatorFieldErrors {
  const nextErrors = { ...fieldErrors };
  for (const fieldName of Object.keys(nextErrors)) {
    const weekdayMatch = /^weekday-(\d+)-name$/.exec(fieldName);
    if (weekdayMatch !== null && Number(weekdayMatch[1]) > weekdayCount) {
      delete nextErrors[fieldName];
    }
  }

  delete nextErrors.form;
  return nextErrors;
}

function tabLabelKey(tab: CalendarCreatorSettingsTab): 'basicTab' | 'weekTab' | 'moonsTab' | 'disastersTab' {
  if (tab === 'basic') {
    return 'basicTab';
  }

  if (tab === 'week') {
    return 'weekTab';
  }

  if (tab === 'moons') {
    return 'moonsTab';
  }

  return 'disastersTab';
}

function tabPanelId(tab: CalendarCreatorSettingsTab): string {
  return `calendar-settings-panel-${tab}`;
}

function tabButtonId(tab: CalendarCreatorSettingsTab): string {
  return `calendar-settings-tab-${tab}`;
}

function getAdjacentTab(
  currentTab: CalendarCreatorSettingsTab,
  direction: -1 | 1,
): CalendarCreatorSettingsTab {
  const currentIndex = CALENDAR_CREATOR_TABS.indexOf(currentTab);
  return CALENDAR_CREATOR_TABS[
    (currentIndex + direction + CALENDAR_CREATOR_TABS.length) % CALENDAR_CREATOR_TABS.length
  ];
}

function CalendarCreatorSettingsPanel({
  locale,
  settings,
  onApply,
  onClose,
}: CalendarCreatorSettingsProps) {
  const copy = useMemo(() => getCalendarCreatorCopy(locale), [locale]);
  const [draft, setDraft] = useState<CalendarCreatorSettingsDraft>(() => createSettingsDraft(settings));
  const [fieldErrors, setFieldErrors] = useState<CalendarCreatorFieldErrors>({});
  const [activeTab, setActiveTab] = useState<CalendarCreatorSettingsTab>('basic');
  const [monthDetailsExpanded, setMonthDetailsExpanded] = useState(true);
  const [weekDetailsExpanded, setWeekDetailsExpanded] = useState(true);
  const tabButtonRefs = useRef<Record<CalendarCreatorSettingsTab, HTMLButtonElement | null>>({
    basic: null,
    week: null,
    moons: null,
    disasters: null,
  });

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
      delete nextErrors.form;
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
    setError(`month-${monthIndex + 1}-name`, null);
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
    setError('start-weekday', null);
    setFieldErrors((currentErrors) => removeErrorsAfterWeekdayResize(currentErrors, parsedCount));
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
    setError(`weekday-${weekdayIndex + 1}-name`, null);
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

  function handleApply(): void {
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    try {
      onApply(requireCalendarSettings(draft.settings));
    } catch (error: unknown) {
      if (error instanceof CalendarInputError) {
        setError('form', getCalendarInputMessage(error));
        return;
      }

      throw error;
    }
  }

  function handleTabKeyDown(
    tab: CalendarCreatorSettingsTab,
    event: KeyboardEvent<HTMLButtonElement>,
  ): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextTab = getAdjacentTab(tab, 1);
      setActiveTab(nextTab);
      tabButtonRefs.current[nextTab]?.focus();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const nextTab = getAdjacentTab(tab, -1);
      setActiveTab(nextTab);
      tabButtonRefs.current[nextTab]?.focus();
    }
  }

  function renderActiveTab(): ReactNode {
    if (activeTab === 'basic') {
      return (
        <div className="space-y-8">
          <div className="min-w-0">
            <label className="block text-sm font-medium text-[var(--site-ink-strong)]" htmlFor="calendar-settings-year">
              {copy.year}
            </label>
            <input
              id="calendar-settings-year"
              type="number"
              value={draft.yearInput}
              onChange={(event) => updateYear(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
            />
            {fieldErrors.year !== undefined ? (
              <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-200" role="alert">
                {fieldErrors.year}
              </p>
            ) : null}
          </div>
          <CalendarCreatorMonthFields
            copy={copy}
            settings={draft.settings}
            monthCountInput={draft.monthCountInput}
            uniformDaysInput={draft.uniformDaysInput}
            monthDayInputs={draft.monthDayInputs}
            fieldErrors={fieldErrors}
            monthDetailsExpanded={monthDetailsExpanded}
            showMonthDetailsToggle={false}
            onMonthCountChange={updateMonthCount}
            onUniformDaysChange={updateUniformDays}
            onFillAllMonths={fillAllMonths}
            onMonthNameChange={updateMonthName}
            onMonthDaysChange={updateMonthDays}
            onToggleMonthDetails={() => setMonthDetailsExpanded((expanded) => !expanded)}
          />
        </div>
      );
    }

    if (activeTab === 'week') {
      return (
        <CalendarCreatorWeekFields
          copy={copy}
          settings={draft.settings}
          weekdayCountInput={draft.weekdayCountInput}
          fieldErrors={fieldErrors}
          weekDetailsExpanded={weekDetailsExpanded}
          showWeekDetailsToggle={false}
          onWeekdayCountChange={updateWeekdayCount}
          onWeekdayNameChange={updateWeekdayName}
          onStartWeekdayChange={updateStartWeekday}
          onToggleWeekDetails={() => setWeekDetailsExpanded((expanded) => !expanded)}
        />
      );
    }

    return (
      <CalendarCreatorAdvancedFields
        copy={copy}
        settings={draft.settings}
        moonCycleInputs={draft.moonCycleInputs}
        disasterProbabilityInput={draft.disasterProbabilityInput}
        fieldErrors={fieldErrors}
        locale={locale}
        showMoonFields={activeTab === 'moons'}
        showDisasterField={activeTab === 'disasters'}
        onMoonCycleChange={updateMoonCycle}
        onDisasterProbabilityChange={updateDisasterProbability}
      />
    );
  }

  const formError = fieldErrors.form;

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className={`${styles.settingsDialog} max-w-5xl p-0`}
      >
        <div
          data-testid="calendar-creator-settings"
          className="min-w-0 overflow-hidden"
        >
          <div className={styles.settingsBody}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--site-accent-strong)]">
              {copy.rules}
            </p>
            <DialogTitle id="calendar-creator-settings-title" className="mt-2 pr-12 font-display text-3xl leading-tight text-[var(--site-ink-strong)] sm:text-4xl">
              {copy.update}
            </DialogTitle>
            <DialogDescription className="mt-3 max-w-3xl text-sm leading-7 text-[var(--site-ink)] sm:text-base">
              {copy.rulesRebuildHint}
            </DialogDescription>
            <DialogClose aria-label={copy.close} />

            {formError !== undefined ? (
              <p className="mt-5 rounded-lg border border-red-300/30 bg-red-950/20 p-3 text-sm leading-6 text-red-800 dark:text-red-100" role="alert">
                {formError}
              </p>
            ) : null}

            <div className={styles.settingsTabs} role="tablist" aria-label={copy.rules}>
              {CALENDAR_CREATOR_TABS.map((tab) => {
                const isActive = activeTab === tab;
                const label = copy[tabLabelKey(tab)];
                return (
                  <button
                    key={tab}
                    ref={(button) => {
                      tabButtonRefs.current[tab] = button;
                    }}
                    id={tabButtonId(tab)}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={tabPanelId(tab)}
                    tabIndex={isActive ? 0 : -1}
                    className={isActive ? `${styles.settingsTab} ${styles.settingsTabActive}` : styles.settingsTab}
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={(event) => handleTabKeyDown(tab, event)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div
              id={tabPanelId(activeTab)}
              role="tabpanel"
              aria-labelledby={tabButtonId(activeTab)}
              tabIndex={0}
              className={styles.settingsTabPanel}
            >
              {renderActiveTab()}
            </div>
          </div>

          <footer className={styles.settingsFooter}>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-4 text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
            >
              {copy.close}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--site-accent-strong)] px-5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40 dark:text-stone-950"
            >
              {copy.update}
            </button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CalendarCreatorSettings(props: CalendarCreatorSettingsProps) {
  const settingsResetKey = JSON.stringify(props.settings);
  return <CalendarCreatorSettingsPanel key={settingsResetKey} {...props} />;
}

export default CalendarCreatorSettings;
