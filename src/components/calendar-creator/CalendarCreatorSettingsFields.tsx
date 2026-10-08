'use client';

import Image from 'next/image';
import type { ChangeEvent, ReactNode } from 'react';

import {
  CalendarInputError,
  parseCalendarDisasterProbability,
  parseCalendarInteger,
  parseCalendarMoonCycle,
} from '@/lib/calendar-creator/validation';
import {
  DISASTER_ICON_IDS,
  getCalendarIcon,
  getCalendarIconLabel,
} from '@/lib/calendar-creator/icons';
import type { CalendarMonthRule, CalendarMoonColor, CalendarSettings } from '@/lib/calendar-creator/types';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

export type CalendarCreatorCopy = ReturnType<typeof getCalendarCreatorCopy>;
export type CalendarCreatorFieldErrors = Readonly<Record<string, string>>;

export type CalendarCreatorMonthFieldsProps = {
  copy: CalendarCreatorCopy;
  settings: CalendarSettings;
  monthCountInput: string;
  uniformDaysInput: string;
  monthDayInputs: readonly string[];
  fieldErrors: CalendarCreatorFieldErrors;
  monthDetailsExpanded: boolean;
  showMonthDetailsToggle?: boolean;
  onMonthCountChange: (value: string) => void;
  onUniformDaysChange: (value: string) => void;
  onFillAllMonths: () => void;
  onMonthNameChange: (monthIndex: number, value: string) => void;
  onMonthDaysChange: (monthIndex: number, value: string) => void;
  onToggleMonthDetails: () => void;
};

export type CalendarCreatorWeekFieldsProps = {
  copy: CalendarCreatorCopy;
  settings: CalendarSettings;
  weekdayCountInput: string;
  fieldErrors: CalendarCreatorFieldErrors;
  weekDetailsExpanded: boolean;
  showWeekDetailsToggle?: boolean;
  onWeekdayCountChange: (value: string) => void;
  onWeekdayNameChange: (weekdayIndex: number, value: string) => void;
  onStartWeekdayChange: (value: string) => void;
  onToggleWeekDetails: () => void;
};

export type CalendarCreatorAdvancedFieldsProps = {
  copy: CalendarCreatorCopy;
  settings: CalendarSettings;
  moonCycleInputs: Readonly<Record<CalendarMoonColor, string>>;
  disasterProbabilityInput: string;
  fieldErrors: CalendarCreatorFieldErrors;
  locale: SiteLocale;
  showMoonFields?: boolean;
  showDisasterField?: boolean;
  onMoonCycleChange: (color: CalendarMoonColor, value: string) => void;
  onDisasterProbabilityChange: (value: string) => void;
};

function describeCalendarFieldError(error: unknown): string {
  if (error instanceof CalendarInputError) {
    return error.message;
  }

  throw error;
}

function replaceCalendarNumberTemplate(template: string, number: number): string {
  return template.replaceAll('{number}', String(number));
}

function calendarFieldError(fieldErrors: CalendarCreatorFieldErrors, fieldName: string): ReactNode {
  const message = fieldErrors[fieldName];
  if (message === undefined) {
    return null;
  }

  return (
    <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-200" role="alert">
      {message}
    </p>
  );
}

function CalendarLabeledInput({
  id,
  label,
  value,
  type = 'text',
  min,
  max,
  inputMode,
  step,
  placeholder,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  inputMode?: 'numeric' | 'decimal';
  step?: number | 'any';
  placeholder?: string;
  error: ReactNode;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-[var(--site-ink-strong)]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode ?? (type === 'number' ? 'numeric' : undefined)}
        min={min}
        max={max}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="mt-2 min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors placeholder:text-[var(--site-ink-soft)] focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
      />
      {error}
    </div>
  );
}

function CalendarDisclosureButton({
  label,
  expanded,
  onClick,
}: {
  label: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-left text-sm font-medium text-[var(--site-ink-strong)] transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-accent-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-[var(--site-ink-soft)]">
        {expanded ? '−' : '+'}
      </span>
    </button>
  );
}

export function CalendarCreatorMonthFields({
  copy,
  settings,
  monthCountInput,
  uniformDaysInput,
  monthDayInputs,
  fieldErrors,
  monthDetailsExpanded,
  showMonthDetailsToggle = true,
  onMonthCountChange,
  onUniformDaysChange,
  onFillAllMonths,
  onMonthNameChange,
  onMonthDaysChange,
  onToggleMonthDetails,
}: CalendarCreatorMonthFieldsProps) {
  const monthDetails = (
    <div className="space-y-3 rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(6rem,9rem)] gap-3 border-b border-[var(--site-border-soft)] pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--site-ink-soft)]">
        <span>{copy.monthName}</span>
        <span>{copy.monthDays}</span>
      </div>
      {settings.months.map((month: CalendarMonthRule, monthIndex: number) => {
        const monthNumber = monthIndex + 1;
        const nameField = `month-${monthNumber}-name`;
        const daysField = `month-${monthNumber}-days`;
        const fallbackName = replaceCalendarNumberTemplate(copy.monthFallback, monthNumber);

        return (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(6rem,9rem)] gap-3" key={monthNumber}>
            <div className="min-w-0">
              <label className="sr-only" htmlFor={`${nameField}-input`}>
                {copy.monthName} {monthNumber}
              </label>
              <input
                id={`${nameField}-input`}
                type="text"
                value={month.name}
                placeholder={fallbackName}
                onChange={(event) => onMonthNameChange(monthIndex, event.target.value)}
                className="min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors placeholder:text-[var(--site-ink-soft)] focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
              />
              {calendarFieldError(fieldErrors, nameField)}
            </div>
            <div className="min-w-0">
              <label className="sr-only" htmlFor={`${daysField}-input`}>
                {copy.monthDays} {monthNumber}
              </label>
              <input
                id={`${daysField}-input`}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={monthDayInputs[monthIndex] ?? String(month.dayCount)}
                onChange={(event) => onMonthDaysChange(monthIndex, event.target.value)}
                className="min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
              />
              {calendarFieldError(fieldErrors, daysField)}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="space-y-4" aria-labelledby="calendar-month-settings-title">
      <h3 id="calendar-month-settings-title" className="text-base font-semibold text-[var(--site-ink-strong)]">
        {copy.monthCount}
      </h3>
      <CalendarLabeledInput
        id="calendar-month-count"
        label={copy.monthCount}
        type="number"
        min={1}
        step={1}
        value={monthCountInput}
        error={calendarFieldError(fieldErrors, 'month-count')}
        onChange={(event) => onMonthCountChange(event.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <CalendarLabeledInput
          id="calendar-uniform-days"
          label={copy.uniformDays}
          type="number"
          min={0}
          step={1}
          value={uniformDaysInput}
          error={calendarFieldError(fieldErrors, 'uniform-days')}
          onChange={(event) => onUniformDaysChange(event.target.value)}
        />
        <button
          type="button"
          onClick={onFillAllMonths}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] px-4 text-sm font-semibold text-[var(--site-accent-strong)] transition-colors hover:bg-[var(--site-accent-bg)]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/40"
        >
          {copy.fillAllMonths}
        </button>
      </div>
      <p className="text-sm leading-6 text-[var(--site-ink-soft)]">{copy.uniformDraftHint}</p>
      {showMonthDetailsToggle ? (
        <>
          <CalendarDisclosureButton
            label={copy.monthDetails}
            expanded={monthDetailsExpanded}
            onClick={onToggleMonthDetails}
          />
          {monthDetailsExpanded ? monthDetails : null}
        </>
      ) : (
        monthDetails
      )}
    </section>
  );
}

export function CalendarCreatorWeekFields({
  copy,
  settings,
  weekdayCountInput,
  fieldErrors,
  weekDetailsExpanded,
  showWeekDetailsToggle = true,
  onWeekdayCountChange,
  onWeekdayNameChange,
  onStartWeekdayChange,
  onToggleWeekDetails,
}: CalendarCreatorWeekFieldsProps) {
  const weekdayFields = (
    <div className="space-y-3 rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3">
      {settings.weekdayNames.map((weekdayName, weekdayIndex) => {
        const weekdayNumber = weekdayIndex + 1;
        const fieldName = `weekday-${weekdayNumber}-name`;
        const fallbackName = replaceCalendarNumberTemplate(copy.weekdayFallback, weekdayNumber);

        return (
          <div className="min-w-0" key={weekdayNumber}>
            <label className="block text-sm font-medium text-[var(--site-ink-strong)]" htmlFor={`${fieldName}-input`}>
              {copy.weekdayName} {weekdayNumber}
            </label>
            <input
              id={`${fieldName}-input`}
              type="text"
              value={weekdayName}
              placeholder={fallbackName}
              onChange={(event) => onWeekdayNameChange(weekdayIndex, event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors placeholder:text-[var(--site-ink-soft)] focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
            />
            {calendarFieldError(fieldErrors, fieldName)}
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="space-y-4" aria-labelledby="calendar-week-settings-title">
      <h3 id="calendar-week-settings-title" className="text-base font-semibold text-[var(--site-ink-strong)]">
        {copy.weekdayCount}
      </h3>
      <CalendarLabeledInput
        id="calendar-weekday-count"
        label={copy.weekdayCount}
        type="number"
        min={1}
        step={1}
        value={weekdayCountInput}
        error={calendarFieldError(fieldErrors, 'weekday-count')}
        onChange={(event) => onWeekdayCountChange(event.target.value)}
      />
      <div className="min-w-0">
        <label className="block text-sm font-medium text-[var(--site-ink-strong)]" htmlFor="calendar-start-weekday">
          {copy.startWeekday}
        </label>
        <select
          id="calendar-start-weekday"
          value={String(settings.startWeekdayIndex)}
          onChange={(event) => onStartWeekdayChange(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] px-3 text-sm text-[var(--site-ink-strong)] outline-none transition-colors focus:border-[var(--site-accent-strong)] focus:ring-2 focus:ring-[var(--site-accent-strong)]/30"
        >
          {settings.weekdayNames.map((weekdayName, weekdayIndex) => (
            <option key={weekdayIndex} value={weekdayIndex}>
              {weekdayName.trim() || replaceCalendarNumberTemplate(copy.weekdayFallback, weekdayIndex + 1)}
            </option>
          ))}
        </select>
        {calendarFieldError(fieldErrors, 'start-weekday')}
      </div>
      {showWeekDetailsToggle ? (
        <>
          <CalendarDisclosureButton
            label={copy.weekDetails}
            expanded={weekDetailsExpanded}
            onClick={onToggleWeekDetails}
          />
          {weekDetailsExpanded ? weekdayFields : null}
        </>
      ) : (
        weekdayFields
      )}
    </section>
  );
}

export function CalendarCreatorAdvancedFields({
  copy,
  settings,
  moonCycleInputs,
  disasterProbabilityInput,
  fieldErrors,
  locale,
  showMoonFields = true,
  showDisasterField = true,
  onMoonCycleChange,
  onDisasterProbabilityChange,
}: CalendarCreatorAdvancedFieldsProps) {
  const moonFields: Array<{ color: CalendarMoonColor; label: string }> = [
    { color: 'white', label: copy.whiteMoon },
    { color: 'blue', label: copy.blueMoon },
    { color: 'red', label: copy.redMoon },
  ];

  return (
    <section className="space-y-5" aria-labelledby="calendar-advanced-settings-title">
      <h3 id="calendar-advanced-settings-title" className="text-base font-semibold text-[var(--site-ink-strong)]">
        {copy.optionalSettings}
      </h3>
      {showMoonFields ? (
        <div className="space-y-4">
          {moonFields.map(({ color, label }) => (
            <CalendarLabeledInput
              key={color}
              id={`calendar-${color}-moon-cycle`}
              label={`${label} · ${copy.cycleDays}`}
              type="number"
              min={0}
              step={1}
              value={moonCycleInputs[color] ?? (settings.moonCycles[color] === null ? '' : String(settings.moonCycles[color]))}
              placeholder={copy.cycleOff}
              error={calendarFieldError(fieldErrors, `${color}-moon-cycle`)}
              onChange={(event) => onMoonCycleChange(color, event.target.value)}
            />
          ))}
        </div>
      ) : null}
      {showDisasterField ? (
        <div className="min-w-0">
          <CalendarLabeledInput
            id="calendar-disaster-probability"
            label={copy.disasterChance}
            type="number"
            min={0}
            max={100}
            inputMode="decimal"
            step="any"
            value={disasterProbabilityInput}
            placeholder={copy.disasterOff}
            error={calendarFieldError(fieldErrors, 'disaster-probability')}
            onChange={(event) => onDisasterProbabilityChange(event.target.value)}
          />
          <p className="mt-2 text-sm leading-6 text-[var(--site-ink-soft)]">
            {copy.disasterPool}
          </p>
          <div
            className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8"
            aria-label={`${copy.disasterPool} (${DISASTER_ICON_IDS.length})`}
          >
            {DISASTER_ICON_IDS.map((iconId) => {
              const icon = getCalendarIcon(iconId);
              const iconLabel = getCalendarIconLabel(iconId, locale);
              return (
                <figure key={iconId} className="flex min-h-14 items-center justify-center rounded-lg border border-[var(--site-border-soft)] bg-white p-2">
                  <Image
                    src={icon.src}
                    alt={iconLabel}
                    title={iconLabel}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                  <figcaption className="sr-only">{iconLabel}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      ) : null}
      <p className="text-sm leading-6 text-[var(--site-ink-soft)]">{copy.automaticLayers}</p>
    </section>
  );
}

export function parseCalendarSettingsField(
  value: string,
  fieldName: string,
  minimum: number,
): number | CalendarInputError {
  try {
    return parseCalendarInteger(value, fieldName, minimum);
  } catch (error: unknown) {
    if (error instanceof CalendarInputError) {
      return error;
    }

    throw error;
  }
}

export function parseCalendarMoonSettingsField(value: string, fieldName: string): number | null | CalendarInputError {
  try {
    return parseCalendarMoonCycle(value, fieldName);
  } catch (error: unknown) {
    if (error instanceof CalendarInputError) {
      return error;
    }

    throw error;
  }
}

export function parseCalendarDisasterSettingsField(value: string, fieldName: string): number | null | CalendarInputError {
  try {
    return parseCalendarDisasterProbability(value, fieldName);
  } catch (error: unknown) {
    if (error instanceof CalendarInputError) {
      return error;
    }

    throw error;
  }
}

export { describeCalendarFieldError };
