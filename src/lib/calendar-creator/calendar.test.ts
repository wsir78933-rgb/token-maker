import { describe, expect, it } from 'vitest';

import {
  createCalendar,
  createDefaultCalendarSettings,
  getAdjacentYearSettings,
  getCalendarMonthRows,
} from '@/lib/calendar-creator/calendar';
import type { CalendarSettings } from '@/lib/calendar-creator/types';

function createFixtureSettings(): CalendarSettings {
  return {
    year: 2000,
    months: [
      { name: 'Month 1', dayCount: 8 },
      { name: 'Month 2', dayCount: 5 },
      { name: 'Month 3', dayCount: 4 },
      { name: 'Month 4', dayCount: 3 },
    ],
    weekdayNames: ['Day 1', 'Day 2', 'Day 3'],
    startWeekdayIndex: 1,
    moonCycles: { white: null, blue: null, red: null },
    disasterProbability: null,
  };
}

describe('calendar generation', () => {
  it('creates the 120-day default calendar with cumulative date numbers', () => {
    const calendar = createCalendar(createDefaultCalendarSettings(), () => 0.5);

    expect(calendar.settings.months).toHaveLength(4);
    expect(calendar.days).toHaveLength(120);
    expect(calendar.days[0]).toMatchObject({
      dayOfYear: 1,
      monthIndex: 0,
      dayOfMonth: 1,
      weekdayIndex: 0,
    });
    expect(calendar.days[29]).toMatchObject({ dayOfYear: 30, monthIndex: 0, dayOfMonth: 30 });
    expect(calendar.days[30]).toMatchObject({ dayOfYear: 31, monthIndex: 1, dayOfMonth: 1 });
    expect(calendar.days.at(-1)).toMatchObject({ dayOfYear: 120, monthIndex: 3, dayOfMonth: 30 });
  });

  it('supports unequal month lengths and zero-day months', () => {
    const settings = createFixtureSettings();
    settings.months[1].dayCount = 0;
    const calendar = createCalendar(settings, () => 0.5);

    expect(calendar.days).toHaveLength(15);
    expect(calendar.days[8]).toMatchObject({
      dayOfYear: 9,
      monthIndex: 2,
      dayOfMonth: 1,
      weekdayIndex: 0,
    });
    expect(getCalendarMonthRows(calendar, 1)).toEqual([]);
    expect(getCalendarMonthRows(calendar, 2)).toHaveLength(2);
    expect(getCalendarMonthRows(calendar, 2)[0]).toEqual([
      calendar.days[8],
      calendar.days[9],
      calendar.days[10],
    ]);
  });

  it('keeps weekday continuity across adjacent years', () => {
    const settings = createFixtureSettings();
    const nextYearSettings = getAdjacentYearSettings(settings, 1);
    const previousYearSettings = getAdjacentYearSettings(settings, -1);

    expect(nextYearSettings).toMatchObject({ year: 2001, startWeekdayIndex: 0 });
    expect(previousYearSettings).toMatchObject({ year: 1999, startWeekdayIndex: 2 });
    expect(getAdjacentYearSettings({ ...settings, months: settings.months.map((month) => ({ ...month, dayCount: 0 })) }, 1))
      .toMatchObject({ year: 2001, startWeekdayIndex: 1 });
  });

  it('creates the source-priority moon phases for short and normal cycles', () => {
    const settings = createFixtureSettings();
    settings.months = [{ name: 'Month 1', dayCount: 8 }];
    settings.moonCycles = { white: 4, blue: 2, red: 3 };
    const calendar = createCalendar(settings, () => 0.5);

    expect(calendar.days.map((day) => day.moonIcons.white)).toEqual([51, 49, 50, 48, 51, 49, 50, 48]);
    expect(calendar.days.map((day) => day.moonIcons.blue)).toEqual([71, 70, 71, 70, 71, 70, 71, 70]);
    expect(calendar.days.map((day) => day.moonIcons.red)).toEqual([77, null, 76, 77, null, 76, 77, null]);

    const cycleOneCalendar = createCalendar({ ...settings, moonCycles: { white: 1, blue: null, red: null } }, () => 0.5);
    expect(cycleOneCalendar.days.every((day) => day.moonIcons.white === 48)).toBe(true);
  });

  it('injects disaster randomness and preserves the fixed eight-icon pool', () => {
    const settings = createFixtureSettings();
    settings.months = [{ name: 'Month 1', dayCount: 2 }];
    settings.disasterProbability = 100;
    const randomValues = [0.1, 0, 0.9, 0.999];
    let randomIndex = 0;
    const calendar = createCalendar(settings, () => randomValues[randomIndex++] ?? 0);

    expect(calendar.days.map((day) => day.disasterIconId)).toEqual([15, 69]);

    const disabledCalendar = createCalendar({ ...settings, disasterProbability: null }, () => {
      throw new Error('Random source must not be called while disasters are disabled.');
    });
    expect(disabledCalendar.days.every((day) => day.disasterIconId === null)).toBe(true);

    const zeroProbabilityCalendar = createCalendar({ ...settings, disasterProbability: 0 }, () => {
      throw new Error('Random source must not be called while disasters are disabled.');
    });
    expect(zeroProbabilityCalendar.days.every((day) => day.disasterIconId === null)).toBe(true);
  });

  it('uses the competitor inclusive 0.5 percent threshold for disaster occurrence', () => {
    const settings = createFixtureSettings();
    settings.months = [{ name: 'Month 1', dayCount: 1 }];
    settings.disasterProbability = 0.5;

    const belowThreshold = createCalendar(settings, () => 0.004);
    const atThreshold = createCalendar(settings, () => 0.005);
    const aboveThreshold = createCalendar(settings, () => 0.006);

    expect(belowThreshold.days[0]?.disasterIconId).toBe(15);
    expect(atThreshold.days[0]?.disasterIconId).toBe(15);
    expect(aboveThreshold.days[0]?.disasterIconId).toBeNull();
  });

  it('can deterministically select every source disaster icon', () => {
    const settings = createFixtureSettings();
    settings.months = [{ name: 'Month 1', dayCount: 8 }];
    settings.disasterProbability = 100;
    const iconSelectionUnits = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.999];
    const randomValues = iconSelectionUnits.flatMap((iconSelectionUnit) => [0, iconSelectionUnit]);
    let randomIndex = 0;

    const calendar = createCalendar(settings, () => randomValues[randomIndex++] ?? 0);

    expect(calendar.days.map((day) => day.disasterIconId)).toEqual([15, 61, 62, 63, 65, 67, 68, 69]);
  });

  it('rerolls automatic disasters and clears manual content on rebuild', () => {
    const settings = createFixtureSettings();
    settings.months = [{ name: 'Month 1', dayCount: 1 }];
    settings.disasterProbability = 100;
    const calendar = createCalendar(settings, () => 0);
    calendar.days[0].manualIconId = 32;
    calendar.days[0].note = 'old note';

    const rebuiltCalendar = createCalendar(calendar.settings, () => 0.999);

    expect(rebuiltCalendar.days[0]).toMatchObject({
      manualIconId: null,
      note: '',
      disasterIconId: 69,
    });
  });
});
