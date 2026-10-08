import { describe, expect, it } from 'vitest';

import {
  CalendarInputError,
  parseCalendarDisasterProbability,
  parseCalendarInteger,
  parseCalendarMoonCycle,
  requireCalendarDocument,
  requireCalendarSettings,
} from '@/lib/calendar-creator/validation';
import { createCalendar, createDefaultCalendarSettings } from '@/lib/calendar-creator/calendar';

describe('calendar validation', () => {
  it('parses required integers and reports received values', () => {
    expect(parseCalendarInteger(' -12 ', 'year', Number.MIN_SAFE_INTEGER)).toBe(-12);
    expect(parseCalendarInteger(0, 'dayCount', 0)).toBe(0);
    expect(() => parseCalendarInteger('1.5', 'dayCount', 0)).toThrowError('"1.5"');
    expect(() => parseCalendarInteger(-1, 'dayCount', 0)).toThrowError('Received -1');
    expect(() => parseCalendarInteger(Number.MAX_SAFE_INTEGER + 1, 'year', Number.MIN_SAFE_INTEGER)).toThrowError(
      'Received 9007199254740992',
    );
  });

  it('treats blank and zero optional values as disabled', () => {
    expect(parseCalendarMoonCycle('', 'white moon')).toBeNull();
    expect(parseCalendarMoonCycle(null, 'white moon')).toBeNull();
    expect(parseCalendarMoonCycle('0', 'white moon')).toBeNull();
    expect(parseCalendarMoonCycle('4', 'white moon')).toBe(4);
    expect(parseCalendarDisasterProbability('', 'disaster')).toBeNull();
    expect(parseCalendarDisasterProbability(0, 'disaster')).toBeNull();
    expect(parseCalendarDisasterProbability('0.5', 'disaster')).toBe(0.5);
    expect(parseCalendarDisasterProbability(0.5)).toBe(0.5);
    expect(parseCalendarDisasterProbability(100, 'disaster')).toBe(100);
    expect(() => parseCalendarMoonCycle('1.5', 'white moon')).toThrowError('Received 1.5');
    expect(() => parseCalendarDisasterProbability(100.1, 'disaster')).toThrowError('Received 100.1');
  });

  it('accepts negative years and normalizes disabled numeric options', () => {
    const settings = createDefaultCalendarSettings();
    const checkedSettings = requireCalendarSettings({
      ...settings,
      year: -12,
      moonCycles: { white: 0, blue: null, red: 4 },
      disasterProbability: 0,
    });

    expect(checkedSettings.year).toBe(-12);
    expect(checkedSettings.moonCycles).toEqual({ white: null, blue: null, red: 4 });
    expect(checkedSettings.disasterProbability).toBeNull();
  });

  it('rejects malformed settings and documents with concrete values', () => {
    const settings = createDefaultCalendarSettings();
    expect(() => requireCalendarSettings({ ...settings, months: [] })).toThrowError('Received []');
    expect(() => requireCalendarSettings({ ...settings, startWeekdayIndex: 3 })).toThrowError('Received 3');
    expect(() => requireCalendarSettings({ ...settings, months: new Array(4) })).toThrowError(
      'Calendar months[0] must be defined. Received undefined.',
    );
    expect(() => requireCalendarSettings({ ...settings, weekdayNames: new Array(3) })).toThrowError(
      'Calendar weekdayNames[0] must be defined. Received undefined.',
    );
    expect(() => requireCalendarSettings({
      ...settings,
      months: [
        { name: 'Large', dayCount: Number.MAX_SAFE_INTEGER },
        { name: 'Overflow', dayCount: 1 },
      ],
    })).toThrowError('Calendar total day count must be a safe integer');

    const document = createCalendar(settings, () => 0.5);
    const invalidDays = document.days.slice(0, -1);
    expect(() => requireCalendarDocument({ ...document, days: invalidDays })).toThrowError('Received 119');
    const sparseDays = new Array(document.days.length);
    expect(() => requireCalendarDocument({ ...document, days: sparseDays })).toThrowError(
      'Calendar document days[0] must be defined. Received undefined.',
    );
    const explicitUndefinedDays: unknown[] = document.days.slice();
    explicitUndefinedDays[0] = undefined;
    expect(() => requireCalendarDocument({ ...document, days: explicitUndefinedDays })).toThrowError(
      'Calendar document days[0] must be defined. Received undefined.',
    );

    const invalidMoonDocument = {
      ...document,
      days: document.days.map((day, dayIndex) => dayIndex === 0
        ? { ...day, moonIcons: { ...day.moonIcons, white: 1 } }
        : day),
    };
    expect(() => requireCalendarDocument(invalidMoonDocument)).toThrowError('white moon catalog');
    expect(() => requireCalendarDocument(null)).toThrowError(CalendarInputError);
  });
});
