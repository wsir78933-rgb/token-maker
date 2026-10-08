export type CalendarIconId = number;

export type CalendarMoonColor = 'white' | 'blue' | 'red';

export type CalendarMoonPhase = 'full' | 'new' | 'firstQuarter' | 'lastQuarter';

export type CalendarMonthRule = {
  name: string;
  dayCount: number;
};

export type CalendarSettings = {
  year: number;
  months: CalendarMonthRule[];
  weekdayNames: string[];
  startWeekdayIndex: number;
  moonCycles: Record<CalendarMoonColor, number | null>;
  disasterProbability: number | null;
};

export type CalendarDay = {
  dayOfYear: number;
  monthIndex: number;
  dayOfMonth: number;
  weekdayIndex: number;
  manualIconId: CalendarIconId | null;
  moonIcons: Record<CalendarMoonColor, CalendarIconId | null>;
  disasterIconId: CalendarIconId | null;
  note: string;
};

export type CalendarDocument = {
  settings: CalendarSettings;
  days: CalendarDay[];
};

export type CalendarSaveSlotNumber = 1 | 2 | 3 | 4;

export type CalendarSaveRecord = {
  version: 1;
  savedAt: string;
  document: CalendarDocument;
};

export type CalendarManualUndo = {
  changes: {
    dayOfYear: number;
    previousIconId: CalendarIconId | null;
  }[];
};
