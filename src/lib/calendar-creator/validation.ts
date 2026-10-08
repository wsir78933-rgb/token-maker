import type {
  CalendarDay,
  CalendarDocument,
  CalendarMoonColor,
  CalendarMoonPhase,
  CalendarMonthRule,
  CalendarSettings,
} from './types';
import { getCalendarMoonIconId, isCalendarIconId } from './icons';

const CALENDAR_MOON_COLORS = ['white', 'blue', 'red'] as const satisfies readonly CalendarMoonColor[];
const CALENDAR_MOON_PHASES = ['full', 'new', 'firstQuarter', 'lastQuarter'] as const satisfies readonly CalendarMoonPhase[];
const CALENDAR_SETTINGS_FIELDS = [
  'year',
  'months',
  'weekdayNames',
  'startWeekdayIndex',
  'moonCycles',
  'disasterProbability',
] as const;
const CALENDAR_DOCUMENT_FIELDS = ['settings', 'days'] as const;
const CALENDAR_MONTH_FIELDS = ['name', 'dayCount'] as const;
const CALENDAR_DAY_FIELDS = [
  'dayOfYear',
  'monthIndex',
  'dayOfMonth',
  'weekdayIndex',
  'manualIconId',
  'moonIcons',
  'disasterIconId',
  'note',
] as const;
const CALENDAR_MOON_FIELDS = ['white', 'blue', 'red'] as const;

export class CalendarInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalendarInputError';
  }
}

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${error.message}).`;
    }

    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireRecord(value: unknown, valueName: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new CalendarInputError(
      `${valueName} must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireFieldNames(
  record: Record<string, unknown>,
  expectedFields: readonly string[],
  valueName: string,
): void {
  const receivedFields = Object.keys(record).sort();
  const sortedExpectedFields = [...expectedFields].sort();
  if (
    receivedFields.length !== sortedExpectedFields.length ||
    receivedFields.some((fieldName, index) => fieldName !== sortedExpectedFields[index])
  ) {
    throw new CalendarInputError(
      `${valueName} must contain exactly ${sortedExpectedFields.join(', ')} fields. Received ${describeReceivedValue(record)}.`,
    );
  }
}

function requireNonEmptyFieldName(fieldName: string): string {
  if (typeof fieldName !== 'string' || fieldName.trim() === '') {
    throw new CalendarInputError(
      `Calendar input field name must be a non-empty string. Received ${describeReceivedValue(fieldName)}.`,
    );
  }

  return fieldName;
}

function requireDefinedArrayEntry(
  values: readonly unknown[],
  index: number,
  valuesName: string,
): unknown {
  if (!Object.prototype.hasOwnProperty.call(values, index) || values[index] === undefined) {
    throw new CalendarInputError(
      `${valuesName}[${index}] must be defined. Received ${describeReceivedValue(values[index])}.`,
    );
  }

  return values[index];
}

function requireSafeInteger(value: unknown, fieldName: string, minimum: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) {
    throw new CalendarInputError(
      `${fieldName} must be a safe integer greater than or equal to ${minimum}. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function parseIntegerString(value: string, fieldName: string): number {
  const trimmedValue = value.trim();
  if (!/^-?\d+$/.test(trimmedValue)) {
    throw new CalendarInputError(
      `${fieldName} must contain an integer. Received ${describeReceivedValue(value)}.`,
    );
  }

  const parsedValue = Number(trimmedValue);
  if (!Number.isSafeInteger(parsedValue)) {
    throw new CalendarInputError(
      `${fieldName} must be a safe integer. Received ${describeReceivedValue(value)}.`,
    );
  }

  return parsedValue;
}

export function parseCalendarInteger(value: unknown, fieldName: string, minimum: number): number {
  const checkedFieldName = requireNonEmptyFieldName(fieldName);
  const checkedMinimum = requireSafeInteger(minimum, `${checkedFieldName} minimum`, Number.MIN_SAFE_INTEGER);
  const parsedValue = typeof value === 'string'
    ? parseIntegerString(value, checkedFieldName)
    : value;

  return requireSafeInteger(parsedValue, checkedFieldName, checkedMinimum);
}

function parseDecimalString(value: string, fieldName: string): number {
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    throw new CalendarInputError(
      `${fieldName} must contain a finite number or be blank only where blank is allowed. Received ${describeReceivedValue(value)}.`,
    );
  }

  const parsedValue = Number(trimmedValue);
  if (!Number.isFinite(parsedValue)) {
    throw new CalendarInputError(
      `${fieldName} must be a finite number. Received ${describeReceivedValue(value)}.`,
    );
  }

  return parsedValue;
}

function parseOptionalNumber(value: unknown, fieldName: string): number | null {
  const checkedFieldName = requireNonEmptyFieldName(fieldName);
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  const parsedValue = typeof value === 'string'
    ? parseDecimalString(value, checkedFieldName)
    : value;

  if (typeof parsedValue !== 'number' || !Number.isFinite(parsedValue)) {
    throw new CalendarInputError(
      `${checkedFieldName} must be a finite number or blank. Received ${describeReceivedValue(value)}.`,
    );
  }

  return parsedValue;
}

export function parseCalendarMoonCycle(value: unknown, fieldName: string): number | null {
  const checkedFieldName = requireNonEmptyFieldName(fieldName);
  const parsedValue = parseOptionalNumber(value, checkedFieldName);
  if (parsedValue === null || parsedValue === 0) {
    return null;
  }

  return parseCalendarInteger(parsedValue, checkedFieldName, 1);
}

export function parseCalendarDisasterProbability(
  value: unknown,
  fieldName = 'disasterProbability',
): number | null {
  const checkedFieldName = requireNonEmptyFieldName(fieldName);
  const parsedValue = parseOptionalNumber(value, checkedFieldName);
  if (parsedValue === null || parsedValue === 0) {
    return null;
  }

  if (parsedValue < 0 || parsedValue > 100) {
    throw new CalendarInputError(
      `${checkedFieldName} must be between 0 and 100. Received ${describeReceivedValue(value)}.`,
    );
  }

  return parsedValue;
}

function cloneMonthRule(value: CalendarMonthRule): CalendarMonthRule {
  return { name: value.name, dayCount: value.dayCount };
}

function requireMonthRule(value: unknown, monthIndex: number): CalendarMonthRule {
  const monthRecord = requireRecord(value, `Calendar month ${monthIndex + 1}`);
  requireFieldNames(monthRecord, CALENDAR_MONTH_FIELDS, `Calendar month ${monthIndex + 1}`);

  if (typeof monthRecord.name !== 'string') {
    throw new CalendarInputError(
      `Calendar month ${monthIndex + 1} name must be a string. Received ${describeReceivedValue(monthRecord.name)}.`,
    );
  }

  return {
    name: monthRecord.name,
    dayCount: requireSafeInteger(
      monthRecord.dayCount,
      `Calendar month ${monthIndex + 1} dayCount`,
      0,
    ),
  };
}

function requireMoonCycles(value: unknown): Record<CalendarMoonColor, number | null> {
  const moonRecord = requireRecord(value, 'Calendar moonCycles');
  requireFieldNames(moonRecord, CALENDAR_MOON_FIELDS, 'Calendar moonCycles');

  const moonCycles = {} as Record<CalendarMoonColor, number | null>;
  for (const color of CALENDAR_MOON_COLORS) {
    const cycleValue = moonRecord[color];
    if (cycleValue === null) {
      moonCycles[color] = null;
      continue;
    }

    moonCycles[color] = parseCalendarMoonCycle(cycleValue, `Calendar ${color} moon cycle`);
  }

  return moonCycles;
}

export function requireCalendarSettings(value: unknown): CalendarSettings {
  const settingsRecord = requireRecord(value, 'Calendar settings');
  requireFieldNames(settingsRecord, CALENDAR_SETTINGS_FIELDS, 'Calendar settings');

  const year = requireSafeInteger(settingsRecord.year, 'Calendar year', Number.MIN_SAFE_INTEGER);
  if (!Array.isArray(settingsRecord.months) || settingsRecord.months.length === 0) {
    throw new CalendarInputError(
      `Calendar months must be a non-empty array. Received ${describeReceivedValue(settingsRecord.months)}.`,
    );
  }

  const months: CalendarMonthRule[] = [];
  for (let monthIndex = 0; monthIndex < settingsRecord.months.length; monthIndex += 1) {
    const month = requireDefinedArrayEntry(settingsRecord.months, monthIndex, 'Calendar months');
    months.push(requireMonthRule(month, monthIndex));
  }
  const totalDayCount = months.reduce((total, month) => total + month.dayCount, 0);
  if (!Number.isSafeInteger(totalDayCount)) {
    throw new CalendarInputError(
      `Calendar total day count must be a safe integer. Received ${describeReceivedValue(totalDayCount)}.`,
    );
  }

  if (!Array.isArray(settingsRecord.weekdayNames) || settingsRecord.weekdayNames.length === 0) {
    throw new CalendarInputError(
      `Calendar weekdayNames must be a non-empty array. Received ${describeReceivedValue(settingsRecord.weekdayNames)}.`,
    );
  }

  const weekdayNames: string[] = [];
  for (let weekdayIndex = 0; weekdayIndex < settingsRecord.weekdayNames.length; weekdayIndex += 1) {
    const weekdayName = requireDefinedArrayEntry(settingsRecord.weekdayNames, weekdayIndex, 'Calendar weekdayNames');
    if (typeof weekdayName !== 'string') {
      throw new CalendarInputError(
        `Calendar weekday ${weekdayIndex + 1} name must be a string. Received ${describeReceivedValue(weekdayName)}.`,
      );
    }

    weekdayNames.push(weekdayName);
  }

  const startWeekdayIndex = requireSafeInteger(
    settingsRecord.startWeekdayIndex,
    'Calendar startWeekdayIndex',
    0,
  );
  if (startWeekdayIndex >= weekdayNames.length) {
    throw new CalendarInputError(
      `Calendar startWeekdayIndex must be smaller than weekdayNames length ${weekdayNames.length}. Received ${describeReceivedValue(settingsRecord.startWeekdayIndex)}.`,
    );
  }

  return {
    year,
    months: months.map(cloneMonthRule),
    weekdayNames,
    startWeekdayIndex,
    moonCycles: requireMoonCycles(settingsRecord.moonCycles),
    disasterProbability: parseCalendarDisasterProbability(
      settingsRecord.disasterProbability,
      'Calendar disasterProbability',
    ),
  };
}

function requireIconValue(value: unknown, valueName: string): number | null {
  if (value === null) {
    return null;
  }

  if (!isCalendarIconId(value)) {
    throw new CalendarInputError(
      `${valueName} must be a valid calendar icon id. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireMoonIconValue(
  value: unknown,
  color: CalendarMoonColor,
  dayOfYear: number,
): number | null {
  const iconValue = requireIconValue(value, `Calendar day ${dayOfYear} ${color} moon icon`);
  if (iconValue === null) {
    return null;
  }

  const colorIconIds = CALENDAR_MOON_PHASES.map((phase) => getCalendarMoonIconId(color, phase));
  if (!colorIconIds.includes(iconValue)) {
    throw new CalendarInputError(
      `Calendar day ${dayOfYear} ${color} moon icon must belong to the ${color} moon catalog. Received ${describeReceivedValue(value)}.`,
    );
  }

  return iconValue;
}

function requireMoonIconRecord(value: unknown, dayOfYear: number): Record<CalendarMoonColor, number | null> {
  const moonRecord = requireRecord(value, `Calendar day ${dayOfYear} moonIcons`);
  requireFieldNames(moonRecord, CALENDAR_MOON_FIELDS, `Calendar day ${dayOfYear} moonIcons`);

  const moonIcons = {} as Record<CalendarMoonColor, number | null>;
  for (const color of CALENDAR_MOON_COLORS) {
    moonIcons[color] = requireMoonIconValue(
      moonRecord[color],
      color,
      dayOfYear,
    );
  }

  return moonIcons;
}

function requireCalendarDay(value: unknown, dayIndex: number, settings: CalendarSettings): CalendarDay {
  const dayRecord = requireRecord(value, `Calendar day ${dayIndex + 1}`);
  requireFieldNames(dayRecord, CALENDAR_DAY_FIELDS, `Calendar day ${dayIndex + 1}`);

  const dayOfYear = requireSafeInteger(dayRecord.dayOfYear, 'Calendar day dayOfYear', 1);
  const monthIndex = requireSafeInteger(dayRecord.monthIndex, `Calendar day ${dayOfYear} monthIndex`, 0);
  if (monthIndex >= settings.months.length) {
    throw new CalendarInputError(
      `Calendar day ${dayOfYear} monthIndex must be smaller than month count ${settings.months.length}. Received ${describeReceivedValue(dayRecord.monthIndex)}.`,
    );
  }

  const dayOfMonth = requireSafeInteger(dayRecord.dayOfMonth, `Calendar day ${dayOfYear} dayOfMonth`, 1);
  if (dayOfMonth > settings.months[monthIndex].dayCount) {
    throw new CalendarInputError(
      `Calendar day ${dayOfYear} dayOfMonth must be within month ${monthIndex + 1}. Received ${describeReceivedValue(dayRecord.dayOfMonth)}.`,
    );
  }

  const weekdayIndex = requireSafeInteger(dayRecord.weekdayIndex, `Calendar day ${dayOfYear} weekdayIndex`, 0);
  if (weekdayIndex >= settings.weekdayNames.length) {
    throw new CalendarInputError(
      `Calendar day ${dayOfYear} weekdayIndex must be smaller than weekdayNames length ${settings.weekdayNames.length}. Received ${describeReceivedValue(dayRecord.weekdayIndex)}.`,
    );
  }

  if (typeof dayRecord.note !== 'string') {
    throw new CalendarInputError(
      `Calendar day ${dayOfYear} note must be a string. Received ${describeReceivedValue(dayRecord.note)}.`,
    );
  }

  return {
    dayOfYear,
    monthIndex,
    dayOfMonth,
    weekdayIndex,
    manualIconId: requireIconValue(dayRecord.manualIconId, `Calendar day ${dayOfYear} manual icon`),
    moonIcons: requireMoonIconRecord(dayRecord.moonIcons, dayOfYear),
    disasterIconId: requireIconValue(dayRecord.disasterIconId, `Calendar day ${dayOfYear} disaster icon`),
    note: dayRecord.note,
  };
}

function totalCalendarDays(settings: CalendarSettings): number {
  return settings.months.reduce((total, month) => total + month.dayCount, 0);
}

function expectedMonthIndexForDay(settings: CalendarSettings, dayOfYear: number): {
  monthIndex: number;
  dayOfMonth: number;
} {
  let remainingDay = dayOfYear;
  for (let monthIndex = 0; monthIndex < settings.months.length; monthIndex += 1) {
    const monthDayCount = settings.months[monthIndex].dayCount;
    if (remainingDay <= monthDayCount) {
      return { monthIndex, dayOfMonth: remainingDay };
    }

    remainingDay -= monthDayCount;
  }

  throw new CalendarInputError(
    `Calendar day ${dayOfYear} does not fit in the configured months. Received ${describeReceivedValue(dayOfYear)}.`,
  );
}

export function requireCalendarDocument(value: unknown): CalendarDocument {
  const documentRecord = requireRecord(value, 'Calendar document');
  requireFieldNames(documentRecord, CALENDAR_DOCUMENT_FIELDS, 'Calendar document');
  const settings = requireCalendarSettings(documentRecord.settings);
  if (!Array.isArray(documentRecord.days)) {
    throw new CalendarInputError(
      `Calendar document days must be an array. Received ${describeReceivedValue(documentRecord.days)}.`,
    );
  }

  const expectedDayCount = totalCalendarDays(settings);
  if (documentRecord.days.length !== expectedDayCount) {
    throw new CalendarInputError(
      `Calendar document days must contain ${expectedDayCount} entries. Received ${documentRecord.days.length}.`,
    );
  }

  const days: CalendarDay[] = [];
  for (let dayIndex = 0; dayIndex < documentRecord.days.length; dayIndex += 1) {
    const day = requireDefinedArrayEntry(documentRecord.days, dayIndex, 'Calendar document days');
    days.push(requireCalendarDay(day, dayIndex, settings));
  }
  for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
    const day = days[dayIndex];
    const expectedDayOfYear = dayIndex + 1;
    if (day.dayOfYear !== expectedDayOfYear) {
      throw new CalendarInputError(
        `Calendar document day ${dayIndex + 1} must have dayOfYear ${expectedDayOfYear}. Received ${describeReceivedValue(day.dayOfYear)}.`,
      );
    }

    const expectedCoordinates = expectedMonthIndexForDay(settings, expectedDayOfYear);
    const expectedWeekdayIndex =
      (settings.startWeekdayIndex + expectedDayOfYear - 1) % settings.weekdayNames.length;
    if (
      day.monthIndex !== expectedCoordinates.monthIndex ||
      day.dayOfMonth !== expectedCoordinates.dayOfMonth ||
      day.weekdayIndex !== expectedWeekdayIndex
    ) {
      throw new CalendarInputError(
        `Calendar day ${expectedDayOfYear} coordinates do not match settings. Received ${describeReceivedValue({
          monthIndex: day.monthIndex,
          dayOfMonth: day.dayOfMonth,
          weekdayIndex: day.weekdayIndex,
        })}.`,
      );
    }
  }

  return { settings, days };
}
