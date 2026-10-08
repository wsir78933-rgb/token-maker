'use client';

import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';

import { getCalendarMonthRows } from '@/lib/calendar-creator/calendar';
import { getCalendarCreatorCopy } from '@/lib/calendar-creator/copy';
import { getCalendarIcon, getCalendarIconLabel } from '@/lib/calendar-creator/icons';
import type { CalendarDay, CalendarDocument, CalendarIconId } from '@/lib/calendar-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

import styles from './CalendarCreatorGrid.module.css';

export interface CalendarCreatorGridProps {
  locale: SiteLocale;
  document: CalendarDocument;
  visibleMonthIndex: number;
  selectedDayIds: readonly number[];
  activeDayId: number | null;
  mobileMultiSelect: boolean;
  onEditDay: (dayOfYear: number) => void;
  onToggleDay: (dayOfYear: number) => void;
}

type CalendarIconLayer = {
  id: CalendarIconId | null;
  key: string;
  label: string;
};

function replaceNumber(template: string, number: number): string {
  return template.replace('{number}', String(number));
}

function readMonthName(copy: ReturnType<typeof getCalendarCreatorCopy>, name: string, monthIndex: number): string {
  return name.trim().length > 0
    ? name
    : replaceNumber(copy.monthFallback, monthIndex + 1);
}

function readWeekdayName(copy: ReturnType<typeof getCalendarCreatorCopy>, name: string, weekdayIndex: number): string {
  return name.trim().length > 0
    ? name
    : replaceNumber(copy.weekdayFallback, weekdayIndex + 1);
}

function getDayLabel(
  copy: ReturnType<typeof getCalendarCreatorCopy>,
  monthName: string,
  day: CalendarDay,
): string {
  return `${monthName} · ${copy.day} ${day.dayOfMonth} · #${day.dayOfYear}`;
}

function readVisibleMonthIndex(visibleMonthIndex: number, monthCount: number): number | null {
  if (!Number.isSafeInteger(visibleMonthIndex) || visibleMonthIndex < 0 || visibleMonthIndex >= monthCount) {
    return null;
  }

  return visibleMonthIndex;
}

function throwInvalidVisibleMonthIndex(visibleMonthIndex: number, monthCount: number): never {
  throw new Error(
    `Calendar grid visibleMonthIndex must be a safe integer from 0 to ${String(monthCount - 1)}. Received ${String(visibleMonthIndex)}.`,
  );
}

function getVisibleMonthDayIds(calendarDocument: CalendarDocument, visibleMonthIndex: number): number[] {
  return calendarDocument.days
    .filter((day) => day.monthIndex === visibleMonthIndex)
    .map((day) => day.dayOfYear);
}

function getFocusTargetDayId(
  dayIds: readonly number[],
  currentDayId: number,
  key: string,
  weekLength: number,
): number | null {
  const currentIndex = dayIds.indexOf(currentDayId);
  if (currentIndex === -1) {
    throw new Error(`Calendar grid cannot move focus from unknown day ${String(currentDayId)}.`);
  }

  if (key === 'Home') {
    return dayIds[0] ?? null;
  }

  if (key === 'End') {
    return dayIds[dayIds.length - 1] ?? null;
  }

  const offsetByKey: Readonly<Record<string, number>> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -weekLength,
    ArrowDown: weekLength,
  };
  const offset = offsetByKey[key];
  if (offset === undefined) {
    return null;
  }

  const targetIndex = currentIndex + offset;
  return targetIndex >= 0 && targetIndex < dayIds.length
    ? dayIds[targetIndex] ?? null
    : currentDayId;
}

function getDayIconLayers(copy: ReturnType<typeof getCalendarCreatorCopy>, day: CalendarDay): CalendarIconLayer[] {
  return [
    { id: day.manualIconId, key: 'manual', label: copy.manualIcon },
    { id: day.moonIcons.white, key: 'white-moon', label: copy.whiteMoon },
    { id: day.moonIcons.blue, key: 'blue-moon', label: copy.blueMoon },
    { id: day.moonIcons.red, key: 'red-moon', label: copy.redMoon },
    { id: day.disasterIconId, key: 'disaster', label: copy.disasterPool },
  ];
}

function IconLayer({ layer, locale }: { layer: CalendarIconLayer; locale: SiteLocale }) {
  if (layer.id === null) {
    return null;
  }

  const icon = getCalendarIcon(layer.id);
  const iconLabel = getCalendarIconLabel(layer.id, locale);

  return (
    <img
      alt={`${layer.label}: ${iconLabel}`}
      className={styles.icon}
      height={24}
      src={icon.src}
      title={`${layer.label}: ${iconLabel}`}
      width={24}
    />
  );
}

function DayCell({
  copy,
  day,
  isActive,
  isSelected,
  locale,
  mobileMultiSelect,
  monthName,
  onDayKeyDown,
  onDayFocus,
  weekdayNames,
  dayButtonRef,
  tabIndex,
  onEditDay,
  onToggleDay,
}: {
  copy: ReturnType<typeof getCalendarCreatorCopy>;
  day: CalendarDay;
  isActive: boolean;
  isSelected: boolean;
  locale: SiteLocale;
  mobileMultiSelect: boolean;
  monthName: string;
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, dayOfYear: number) => void;
  onDayFocus: (dayOfYear: number) => void;
  weekdayNames: readonly string[];
  dayButtonRef: (button: HTMLButtonElement | null) => void;
  tabIndex: number;
  onEditDay: (dayOfYear: number) => void;
  onToggleDay: (dayOfYear: number) => void;
}) {
  const dayLabel = getDayLabel(copy, monthName, day);
  const dayIconLayers = getDayIconLayers(copy, day);
  const dayClassName = [
    styles.dayCell,
    isActive ? styles.activeDay : '',
    isSelected ? styles.selectedDay : '',
  ].filter(Boolean).join(' ');

  function stopCheckboxPropagation(event: MouseEvent<HTMLInputElement>): void {
    event.stopPropagation();
  }

  return (
    <article
      aria-current={isActive ? 'date' : undefined}
      aria-label={dayLabel}
      aria-selected={isSelected}
      className={dayClassName}
      data-active={isActive ? 'true' : 'false'}
      data-calendar-day={day.dayOfYear}
      data-selected={isSelected ? 'true' : 'false'}
      role="gridcell"
    >
      <input
        aria-label={`${copy.multiSelect}: ${dayLabel}`}
        checked={isSelected}
        className={`${styles.dayCheckbox} ${mobileMultiSelect ? styles.mobileCheckboxVisible : ''}`}
        onChange={() => onToggleDay(day.dayOfYear)}
        onClick={stopCheckboxPropagation}
        tabIndex={-1}
        type="checkbox"
      />
      <button
        aria-label={`${copy.editDayHint}: ${dayLabel}`}
        className={styles.dayBody}
        onFocus={() => onDayFocus(day.dayOfYear)}
        onKeyDown={(event) => onDayKeyDown(event, day.dayOfYear)}
        ref={dayButtonRef}
        tabIndex={tabIndex}
        onClick={() => onEditDay(day.dayOfYear)}
        type="button"
      >
        <span className={styles.dayHeading}>
          <span className={styles.dayNumber}>{day.dayOfMonth}</span>
          <span className={styles.weekdayName}>
            {readWeekdayName(copy, weekdayNames[day.weekdayIndex] ?? '', day.weekdayIndex)}
          </span>
        </span>
        <span aria-label={copy.automaticLayers} className={styles.iconLayers}>
          {dayIconLayers.map((layer) => (
            <IconLayer key={`${layer.key}-${layer.id ?? 'empty'}`} layer={layer} locale={locale} />
          ))}
        </span>
        {day.note.length > 0 ? <span className={styles.notePreview}>{day.note}</span> : null}
      </button>
    </article>
  );
}

function EmptyMonth({ copy }: { copy: ReturnType<typeof getCalendarCreatorCopy> }) {
  return <p className={styles.emptyMonth}>{copy.noDates}</p>;
}

export function CalendarCreatorGrid({
  locale,
  document,
  visibleMonthIndex,
  selectedDayIds,
  activeDayId,
  mobileMultiSelect,
  onEditDay,
  onToggleDay,
}: CalendarCreatorGridProps) {
  const copy = getCalendarCreatorCopy(locale);
  const monthCount = document.settings.months.length;
  const checkedMonthIndex = readVisibleMonthIndex(visibleMonthIndex, monthCount);
  const dayIds = useMemo(() => {
    if (checkedMonthIndex === null) {
      return [];
    }

    return getVisibleMonthDayIds(document, checkedMonthIndex);
  }, [checkedMonthIndex, document]);
  const selectedDayIdSet = new Set(selectedDayIds);
  const weekLength = document.settings.weekdayNames.length;
  const gridStyle = { '--calendar-week-length': weekLength } as CSSProperties;
  const firstDayId = dayIds[0] ?? null;
  const initialFocusedDayId = activeDayId !== null && dayIds.includes(activeDayId)
    ? activeDayId
    : firstDayId;
  const [focusedDayId, setFocusedDayId] = useState<number | null>(initialFocusedDayId);
  const dayButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const rovingDayId = focusedDayId !== null && dayIds.includes(focusedDayId)
    ? focusedDayId
    : initialFocusedDayId;
  if (checkedMonthIndex === null) {
    throwInvalidVisibleMonthIndex(visibleMonthIndex, monthCount);
  }

  const visibleMonth = document.settings.months[checkedMonthIndex];
  if (visibleMonth === undefined) {
    throw new Error(
      `Calendar grid month ${String(checkedMonthIndex)} is missing. Received month count ${String(monthCount)}.`,
    );
  }

  function rememberDayButton(dayOfYear: number, button: HTMLButtonElement | null): void {
    if (button === null) {
      dayButtonRefs.current.delete(dayOfYear);
      return;
    }

    dayButtonRefs.current.set(dayOfYear, button);
  }

  function moveDayFocus(dayOfYear: number, key: string): void {
    const targetDayId = getFocusTargetDayId(dayIds, dayOfYear, key, weekLength);
    if (targetDayId === null || targetDayId === dayOfYear) {
      return;
    }

    setFocusedDayId(targetDayId);
    dayButtonRefs.current.get(targetDayId)?.focus();
  }

  function handleDayFocus(dayOfYear: number): void {
    setFocusedDayId(dayOfYear);
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, dayOfYear: number): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEditDay(dayOfYear);
      return;
    }

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      onToggleDay(dayOfYear);
      return;
    }

    if (event.key === 'Home' || event.key === 'End' || event.key.startsWith('Arrow')) {
      event.preventDefault();
      moveDayFocus(dayOfYear, event.key);
    }
  }

  const monthRows = getCalendarMonthRows(document, checkedMonthIndex);
  const monthName = readMonthName(copy, visibleMonth.name, checkedMonthIndex);

  return (
    <section
      aria-label={copy.title}
      className={styles.grid}
      data-calendar-grid
      data-calendar-screen-only
      data-calendar-week-length={weekLength}
      style={gridStyle}
    >
      <section
        aria-labelledby={`calendar-month-${checkedMonthIndex}`}
        className={styles.month}
        data-calendar-month={checkedMonthIndex}
      >
        <header className={styles.monthHeader}>
          <h2 id={`calendar-month-${checkedMonthIndex}`} className={styles.monthTitle}>{monthName}</h2>
          <span className={styles.monthDayCount}>{visibleMonth.dayCount} {copy.daysUnit}</span>
        </header>
        <div className={styles.monthScroller}>
          <div className={styles.weekdayRow} role="row" style={gridStyle}>
            {document.settings.weekdayNames.map((weekdayName, weekdayIndex) => (
              <span className={styles.weekdayCell} key={`${checkedMonthIndex}-weekday-${weekdayIndex}`} role="columnheader">
                {readWeekdayName(copy, weekdayName, weekdayIndex)}
              </span>
            ))}
          </div>
          {monthRows.length === 0 ? (
            <EmptyMonth copy={copy} />
          ) : (
            <div className={styles.monthRows} role="grid">
              {monthRows.map((row, rowIndex) => (
                <div className={styles.weekRow} key={`${checkedMonthIndex}-row-${rowIndex}`} role="row" style={gridStyle}>
                  {row.map((day, columnIndex) => day === null ? (
                    <span aria-hidden="true" className={styles.emptyCell} key={`${checkedMonthIndex}-${rowIndex}-${columnIndex}`} />
                  ) : (
                    <DayCell
                      copy={copy}
                      day={day}
                      isActive={activeDayId === day.dayOfYear}
                      isSelected={selectedDayIdSet.has(day.dayOfYear)}
                      key={day.dayOfYear}
                      locale={locale}
                      mobileMultiSelect={mobileMultiSelect}
                      monthName={monthName}
                      onDayKeyDown={handleDayKeyDown}
                      onDayFocus={handleDayFocus}
                      onEditDay={onEditDay}
                      onToggleDay={onToggleDay}
                      dayButtonRef={(button) => rememberDayButton(day.dayOfYear, button)}
                      weekdayNames={document.settings.weekdayNames}
                      tabIndex={rovingDayId === day.dayOfYear ? 0 : -1}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
