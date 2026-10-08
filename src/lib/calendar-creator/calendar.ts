import type {
  CalendarDay,
  CalendarDocument,
  CalendarMoonColor,
  CalendarMoonPhase,
  CalendarSettings,
} from './types';
import {
  DISASTER_ICON_IDS,
  getCalendarMoonIconId,
} from './icons';
import {
  CalendarInputError,
  requireCalendarDocument,
  requireCalendarSettings,
} from './validation';

const CALENDAR_MOON_COLORS = ['white', 'blue', 'red'] as const satisfies readonly CalendarMoonColor[];

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

function createMoonIconRecord(): Record<CalendarMoonColor, number | null> {
  return { white: null, blue: null, red: null };
}

function createCalendarDay(
  dayOfYear: number,
  monthIndex: number,
  dayOfMonth: number,
  weekdayIndex: number,
): CalendarDay {
  return {
    dayOfYear,
    monthIndex,
    dayOfMonth,
    weekdayIndex,
    manualIconId: null,
    moonIcons: createMoonIconRecord(),
    disasterIconId: null,
    note: '',
  };
}

function totalCalendarDays(settings: CalendarSettings): number {
  return settings.months.reduce((total, month) => total + month.dayCount, 0);
}

function requireRandomSource(random: unknown): (() => number) {
  if (typeof random !== 'function') {
    throw new CalendarInputError(
      `Calendar random source must be a function. Received ${String(random)}.`,
    );
  }

  return random as () => number;
}

function nextRandomUnit(random: () => number): number {
  const randomUnit = random();
  if (typeof randomUnit !== 'number' || !Number.isFinite(randomUnit) || randomUnit < 0 || randomUnit >= 1) {
    throw new CalendarInputError(
      `Calendar random source must return a finite number from 0 inclusive to 1 exclusive. Received ${String(randomUnit)}.`,
    );
  }

  return randomUnit;
}

function createMoonIconId(color: CalendarMoonColor, phase: CalendarMoonPhase): number {
  return getCalendarMoonIconId(color, phase);
}

function getMoonPhase(cycleDay: number, cycleLength: number): CalendarMoonPhase | null {
  const quarterCycle = Math.floor(cycleLength / 4);
  const halfCycle = Math.floor(cycleLength / 2);
  const thirdCycle = halfCycle + quarterCycle;

  if (cycleDay === cycleLength) {
    return 'full';
  }

  if (cycleDay === halfCycle) {
    return 'new';
  }

  if (cycleDay === quarterCycle) {
    return 'firstQuarter';
  }

  if (cycleDay === thirdCycle) {
    return 'lastQuarter';
  }

  return null;
}

function addMoonIcons(
  day: CalendarDay,
  dayOfYear: number,
  settings: CalendarSettings,
): void {
  for (const color of CALENDAR_MOON_COLORS) {
    const cycleLength = settings.moonCycles[color];
    if (cycleLength === null) {
      continue;
    }

    const cycleDay = dayOfYear % cycleLength === 0 ? cycleLength : dayOfYear % cycleLength;
    const phase = getMoonPhase(cycleDay, cycleLength);
    if (phase !== null) {
      day.moonIcons[color] = createMoonIconId(color, phase);
    }
  }
}

function addDisasterIcon(
  day: CalendarDay,
  settings: CalendarSettings,
  random: () => number,
): void {
  const probability = settings.disasterProbability;
  if (probability === null) {
    return;
  }

  const occurrenceUnit = nextRandomUnit(random);
  if (occurrenceUnit * 100 > probability) {
    return;
  }

  const iconIndex = Math.floor(nextRandomUnit(random) * DISASTER_ICON_IDS.length);
  day.disasterIconId = DISASTER_ICON_IDS[iconIndex];
}

export function createDefaultCalendarSettings(): CalendarSettings {
  return {
    year: 2000,
    months: [
      { name: '', dayCount: 30 },
      { name: '', dayCount: 30 },
      { name: '', dayCount: 30 },
      { name: '', dayCount: 30 },
    ],
    weekdayNames: ['', '', ''],
    startWeekdayIndex: 0,
    moonCycles: { white: null, blue: null, red: null },
    disasterProbability: null,
  };
}

export function createCalendar(
  settings: CalendarSettings,
  random: () => number = Math.random,
): CalendarDocument {
  const checkedSettings = requireCalendarSettings(settings);
  const randomSource = requireRandomSource(random);
  const days: CalendarDay[] = [];
  let dayOfYear = 1;

  for (let monthIndex = 0; monthIndex < checkedSettings.months.length; monthIndex += 1) {
    const monthDayCount = checkedSettings.months[monthIndex].dayCount;
    for (let dayOfMonth = 1; dayOfMonth <= monthDayCount; dayOfMonth += 1) {
      const day = createCalendarDay(
        dayOfYear,
        monthIndex,
        dayOfMonth,
        (checkedSettings.startWeekdayIndex + dayOfYear - 1) % checkedSettings.weekdayNames.length,
      );
      addMoonIcons(day, dayOfYear, checkedSettings);
      addDisasterIcon(day, checkedSettings, randomSource);
      days.push(day);
      dayOfYear += 1;
    }
  }

  return { settings: checkedSettings, days };
}

export function getAdjacentYearSettings(
  settings: CalendarSettings,
  direction: -1 | 1,
): CalendarSettings {
  const checkedSettings = requireCalendarSettings(settings);
  if (direction !== -1 && direction !== 1) {
    throw new CalendarInputError(
      `Calendar year direction must be -1 or 1. Received ${String(direction)}.`,
    );
  }

  const nextYear = checkedSettings.year + direction;
  if (!Number.isSafeInteger(nextYear)) {
    throw new CalendarInputError(
      `Calendar adjacent year must be a safe integer. Received ${String(nextYear)} from year ${String(checkedSettings.year)} and direction ${String(direction)}.`,
    );
  }

  const totalDays = totalCalendarDays(checkedSettings);
  const nextStartWeekdayIndex = totalDays === 0
    ? checkedSettings.startWeekdayIndex
    : (
      (checkedSettings.startWeekdayIndex + direction * (totalDays % checkedSettings.weekdayNames.length)) %
        checkedSettings.weekdayNames.length +
      checkedSettings.weekdayNames.length
    ) % checkedSettings.weekdayNames.length;

  return {
    ...cloneCalendarSettings(checkedSettings),
    year: nextYear,
    startWeekdayIndex: nextStartWeekdayIndex,
  };
}

function requireMonthIndex(monthIndex: number, monthCount: number): number {
  if (!Number.isSafeInteger(monthIndex) || monthIndex < 0 || monthIndex >= monthCount) {
    throw new CalendarInputError(
      `Calendar month index must be a safe integer from 0 to ${monthCount - 1}. Received ${String(monthIndex)}.`,
    );
  }

  return monthIndex;
}

export function getCalendarMonthRows(
  document: CalendarDocument,
  monthIndex: number,
): (CalendarDay | null)[][] {
  const checkedDocument = requireCalendarDocument(document);
  const checkedMonthIndex = requireMonthIndex( monthIndex, checkedDocument.settings.months.length);
  const monthDayCount = checkedDocument.settings.months[checkedMonthIndex].dayCount;
  if (monthDayCount === 0) {
    return [];
  }

  const daysBeforeMonth = checkedDocument.settings.months
    .slice(0, checkedMonthIndex)
    .reduce((total, month) => total + month.dayCount, 0);
  const leadingEmptyCount =
    (checkedDocument.settings.startWeekdayIndex + daysBeforeMonth) % checkedDocument.settings.weekdayNames.length;
  const rowCount = Math.ceil((leadingEmptyCount + monthDayCount) / checkedDocument.settings.weekdayNames.length);
  const monthDays = checkedDocument.days.filter((day) => day.monthIndex === checkedMonthIndex);
  const rows: (CalendarDay | null)[][] = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const row: (CalendarDay | null)[] = [];
    for (let columnIndex = 0; columnIndex < checkedDocument.settings.weekdayNames.length; columnIndex += 1) {
      const calendarCellIndex = rowIndex * checkedDocument.settings.weekdayNames.length + columnIndex;
      const monthDayIndex = calendarCellIndex - leadingEmptyCount;
      row.push(monthDayIndex >= 0 && monthDayIndex < monthDays.length ? monthDays[monthDayIndex] : null);
    }
    rows.push(row);
  }

  return rows;
}
