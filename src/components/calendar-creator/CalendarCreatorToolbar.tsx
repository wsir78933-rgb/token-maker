'use client';

import { CornerUpLeft } from 'lucide-react';

import type { CalendarDocument, CalendarSaveSlotNumber } from '@/lib/calendar-creator/types';

type CalendarCreatorCopy = ReturnType<
  typeof import('@/lib/calendar-creator/copy').getCalendarCreatorCopy
>;

export type CalendarCreatorToolbarProps = {
  copy: CalendarCreatorCopy;
  document: CalendarDocument;
  boundSlot: CalendarSaveSlotNumber | null;
  dirty: boolean;
  yearInput: string;
  onYearInputChange: (value: string) => void;
  onYearInputCommit: () => void;
  onYearChange: (direction: -1 | 1) => void;
  onOpenSettings: () => void;
  onSave: () => void;
  onOpenArchives: () => void;
  onPrint: () => void;
  onOpenHelp: () => void;
  onCreateNew: () => void;
  onReturnToSettings: () => void;
  visibleMonthIndex: number;
  onSelectMonth: (monthIndex: number) => void;
};

function monthLabel(
  copy: CalendarCreatorCopy,
  monthName: string,
  monthIndex: number,
): string {
  const trimmedName = monthName.trim();
  if (trimmedName.length > 0) {
    return trimmedName;
  }

  return copy.monthFallback.replace('{number}', String(monthIndex + 1));
}

function requireToolbarMonthIndex(monthIndex: number, monthCount: number): number {
  if (!Number.isSafeInteger(monthCount) || monthCount < 1) {
    throw new Error(
      `Calendar toolbar month count must be a safe integer of at least 1. Received ${String(monthCount)}.`,
    );
  }

  if (!Number.isSafeInteger(monthIndex) || monthIndex < 0 || monthIndex >= monthCount) {
    throw new Error(
      `Calendar toolbar month index must be a safe integer from 0 to ${monthCount - 1}. Received ${String(monthIndex)}.`,
    );
  }

  return monthIndex;
}

function slotLabel(
  copy: CalendarCreatorCopy,
  boundSlot: CalendarSaveSlotNumber | null,
): string {
  if (boundSlot === null) {
    return copy.save;
  }

  return `${copy.updateCurrent} · ${copy.slot} ${boundSlot}`;
}

export function CalendarCreatorToolbar({
  copy,
  document: calendarDocument,
  boundSlot,
  dirty,
  yearInput,
  onYearInputChange,
  onYearInputCommit,
  onYearChange,
  onOpenSettings,
  onSave,
  onOpenArchives,
  onPrint,
  onOpenHelp,
  onCreateNew,
  onReturnToSettings,
  visibleMonthIndex,
  onSelectMonth,
}: CalendarCreatorToolbarProps) {
  const monthCount = calendarDocument.settings.months.length;
  const selectedMonthIndex = requireToolbarMonthIndex(visibleMonthIndex, monthCount);

  return (
    <header className="calendar-creator-toolbar" data-calendar-screen-only>
      <div className="calendar-creator-toolbar__heading">
        <div className="calendar-creator-toolbar__leading">
          <div>
            <p className="calendar-creator-toolbar__eyebrow">{copy.title}</p>
            <p className="calendar-creator-toolbar__status" role="status" aria-live="polite">
              {dirty ? copy.unsaved : copy.saved}
              {` · ${calendarDocument.days.length} ${copy.daysUnit}`}
              {boundSlot === null ? '' : ` · ${copy.slot} ${boundSlot}`}
            </p>
          </div>
          <button
            type="button"
            className="calendar-creator-toolbar__back"
            aria-label={copy.returnToSettings}
            title={copy.returnToSettings}
            onClick={onReturnToSettings}
          >
            <CornerUpLeft aria-hidden="true" size={16} />
          </button>
        </div>

        <div className="calendar-creator-toolbar__actions" aria-label={copy.title}>
          <button type="button" onClick={onCreateNew}>
            {copy.create}
          </button>
          <button type="button" onClick={onOpenSettings}>
            {copy.rules}
          </button>
          <button type="button" onClick={onOpenArchives}>
            {copy.archives}
          </button>
          <button type="button" onClick={onPrint}>
            {copy.print}
          </button>
          <button type="button" onClick={onOpenHelp}>
            {copy.help}
          </button>
        </div>
      </div>

      <div className="calendar-creator-toolbar__controls">
        <div className="calendar-creator-year-control">
          <button
            type="button"
            aria-label={copy.previousYear}
            onClick={() => onYearChange(-1)}
          >
            −
          </button>
          <label>
            <span>{copy.year}</span>
            <input
              type="text"
              inputMode="numeric"
              value={yearInput}
              aria-label={copy.year}
              onChange={(event) => onYearInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onYearInputCommit();
                }
              }}
            />
          </label>
          <button
            type="button"
            aria-label={copy.nextYear}
            onClick={() => onYearChange(1)}
          >
            +
          </button>
        </div>

        <div className="calendar-creator-month-jump">
          <button
            type="button"
            aria-label={copy.previousMonth}
            disabled={selectedMonthIndex === 0}
            onClick={() => onSelectMonth(selectedMonthIndex - 1)}
          >
            −
          </button>
          <label>
            <span>{copy.monthJump}</span>
            <select
              value={String(selectedMonthIndex)}
              aria-label={copy.monthJump}
              onChange={(event) => {
                onSelectMonth(Number(event.target.value));
              }}
            >
              {calendarDocument.settings.months.map((month, monthIndex) => (
                <option key={monthIndex} value={monthIndex}>
                  {monthLabel(copy, month.name, monthIndex)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            aria-label={copy.nextMonth}
            disabled={selectedMonthIndex === monthCount - 1}
            onClick={() => onSelectMonth(selectedMonthIndex + 1)}
          >
            +
          </button>
        </div>

        <button type="button" className="calendar-creator-toolbar__primary" onClick={onSave}>
          {slotLabel(copy, boundSlot)}
        </button>
      </div>
    </header>
  );
}
