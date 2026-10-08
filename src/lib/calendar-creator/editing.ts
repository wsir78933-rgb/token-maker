import type {
  CalendarDocument,
  CalendarIconId,
  CalendarManualUndo,
} from './types';
import { isCalendarIconId } from './icons';
import { requireCalendarDocument } from './validation';

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
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string'
      ? serialized
      : Object.prototype.toString.call(value);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
  }
}

function requireDayOfYear(value: unknown, fieldName: string): number {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 1) {
    return value;
  }

  throw new Error(
    `${fieldName} must be a positive safe integer. Received ${describeReceivedValue(value)}.`,
  );
}

function requireSelectedDayIds(selectedDayIds: readonly number[]): number[] {
  if (!Array.isArray(selectedDayIds)) {
    throw new Error(
      `Selected calendar day IDs must be an array. Received ${describeReceivedValue(selectedDayIds)}.`,
    );
  }

  const validatedDayIds: number[] = [];
  const seenDayIds = new Set<number>();
  for (const selectedDayId of selectedDayIds) {
    const validatedDayId = requireDayOfYear(selectedDayId, 'Selected calendar day ID');
    if (seenDayIds.has(validatedDayId)) {
      throw new Error(
        `Selected calendar day IDs must be unique. Received duplicate ${describeReceivedValue(validatedDayId)}.`,
      );
    }

    seenDayIds.add(validatedDayId);
    validatedDayIds.push(validatedDayId);
  }

  return validatedDayIds;
}

function requireManualIconId(value: unknown, fieldName: string): CalendarIconId | null {
  if (value === null) {
    return null;
  }

  if (isCalendarIconId(value)) {
    return value;
  }

  throw new Error(
    `${fieldName} must be null or a valid calendar icon ID. Received ${describeReceivedValue(value)}.`,
  );
}

function cloneCalendarDocument(document: CalendarDocument): CalendarDocument {
  return {
    settings: {
      ...document.settings,
      months: document.settings.months.map((monthRule) => ({ ...monthRule })),
      weekdayNames: [...document.settings.weekdayNames],
      moonCycles: { ...document.settings.moonCycles },
    },
    days: document.days.map((calendarDay) => ({
      ...calendarDay,
      moonIcons: { ...calendarDay.moonIcons },
    })),
  };
}

function requireDocumentDay(
  document: CalendarDocument,
  dayOfYear: number,
): CalendarDocument['days'][number] {
  const calendarDay = document.days.find((day) => day.dayOfYear === dayOfYear);
  if (calendarDay === undefined) {
    throw new Error(
      `Calendar day ${describeReceivedValue(dayOfYear)} does not exist in the document.`,
    );
  }

  return calendarDay;
}

function requireValidatedDocument(document: CalendarDocument): CalendarDocument {
  return requireCalendarDocument(document);
}

export function toggleCalendarDaySelection(
  selectedDayIds: readonly number[],
  dayOfYear: number,
): number[] {
  const validatedDayIds = requireSelectedDayIds(selectedDayIds);
  const validatedDayOfYear = requireDayOfYear(dayOfYear, 'Calendar day of year');
  const selectedDayIndex = validatedDayIds.indexOf(validatedDayOfYear);

  if (selectedDayIndex === -1) {
    return [...validatedDayIds, validatedDayOfYear];
  }

  return validatedDayIds.filter((_, index) => index !== selectedDayIndex);
}

export function applyCalendarManualIcon(
  document: CalendarDocument,
  selectedDayIds: readonly number[],
  iconId: CalendarIconId | null,
): { document: CalendarDocument; undo: CalendarManualUndo } {
  const validatedDocument = requireValidatedDocument(document);
  const validatedDayIds = requireSelectedDayIds(selectedDayIds);
  const validatedIconId = requireManualIconId(iconId, 'Calendar manual icon ID');

  const undoChanges = validatedDayIds.map((dayOfYear) => ({
    dayOfYear,
    previousIconId: requireDocumentDay(validatedDocument, dayOfYear).manualIconId,
  }));
  const selectedDayIdSet = new Set(validatedDayIds);
  const nextDocument = cloneCalendarDocument(validatedDocument);
  nextDocument.days = nextDocument.days.map((calendarDay) =>
    selectedDayIdSet.has(calendarDay.dayOfYear)
      ? { ...calendarDay, manualIconId: validatedIconId }
      : calendarDay,
  );

  return {
    document: nextDocument,
    undo: { changes: undoChanges },
  };
}

function requireUndoChanges(value: unknown): CalendarManualUndo['changes'] {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    !('changes' in value) ||
    !Array.isArray(value.changes)
  ) {
    throw new Error(
      `Calendar manual undo must contain a changes array. Received ${describeReceivedValue(value)}.`,
    );
  }

  const validatedChanges: CalendarManualUndo['changes'] = [];
  const seenDayIds = new Set<number>();
  for (const change of value.changes) {
    if (
      change === null ||
      typeof change !== 'object' ||
      Array.isArray(change) ||
      !('dayOfYear' in change) ||
      !('previousIconId' in change)
    ) {
      throw new Error(
        `Calendar manual undo change must contain dayOfYear and previousIconId. Received ${describeReceivedValue(change)}.`,
      );
    }

    const dayOfYear = requireDayOfYear(change.dayOfYear, 'Calendar manual undo dayOfYear');
    if (seenDayIds.has(dayOfYear)) {
      throw new Error(
        `Calendar manual undo day IDs must be unique. Received duplicate ${describeReceivedValue(dayOfYear)}.`,
      );
    }

    seenDayIds.add(dayOfYear);
    validatedChanges.push({
      dayOfYear,
      previousIconId: requireManualIconId(
        change.previousIconId,
        `Calendar manual undo previousIconId for day ${dayOfYear}`,
      ),
    });
  }

  return validatedChanges;
}

export function undoCalendarManualIcon(
  document: CalendarDocument,
  undo: CalendarManualUndo,
): CalendarDocument {
  const validatedDocument = requireValidatedDocument(document);
  const validatedChanges = requireUndoChanges(undo);
  const nextDocument = cloneCalendarDocument(validatedDocument);

  for (const change of validatedChanges) {
    const calendarDay = requireDocumentDay(nextDocument, change.dayOfYear);
    calendarDay.manualIconId = change.previousIconId;
  }

  return nextDocument;
}

export function updateCalendarDayNote(
  document: CalendarDocument,
  dayOfYear: number,
  note: string,
): CalendarDocument {
  const validatedDocument = requireValidatedDocument(document);
  const validatedDayOfYear = requireDayOfYear(dayOfYear, 'Calendar day of year');
  if (typeof note !== 'string') {
    throw new Error(
      `Calendar day note must be a string. Received ${describeReceivedValue(note)}.`,
    );
  }

  const nextDocument = cloneCalendarDocument(validatedDocument);
  const calendarDay = requireDocumentDay(nextDocument, validatedDayOfYear);
  calendarDay.note = note;
  return nextDocument;
}
