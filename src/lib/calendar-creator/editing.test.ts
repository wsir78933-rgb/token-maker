import { describe, expect, it } from 'vitest';

import { createCalendar } from './calendar';
import {
  applyCalendarManualIcon,
  toggleCalendarDaySelection,
  undoCalendarManualIcon,
  updateCalendarDayNote,
} from './editing';
import type { CalendarDocument, CalendarSettings } from './types';

function createEditingDocument(): CalendarDocument {
  const settings: CalendarSettings = {
    year: 2000,
    months: [
      { name: 'First', dayCount: 8 },
      { name: 'Second', dayCount: 5 },
      { name: 'Third', dayCount: 4 },
      { name: 'Fourth', dayCount: 3 },
    ],
    weekdayNames: ['One', 'Two', 'Three'],
    startWeekdayIndex: 1,
    moonCycles: { white: 4, blue: null, red: null },
    disasterProbability: 100,
  };

  return createCalendar(settings, () => 0.5);
}

describe('calendar editing', () => {
  it('toggles selected days immutably while preserving selection order', () => {
    const selectedDayIds = [3, 5] as const;

    expect(toggleCalendarDaySelection(selectedDayIds, 8)).toEqual([3, 5, 8]);
    expect(toggleCalendarDaySelection(selectedDayIds, 3)).toEqual([5]);
    expect(selectedDayIds).toEqual([3, 5]);
    expect(() => toggleCalendarDaySelection([3, 3], 8)).toThrowError('duplicate 3');
    expect(() => toggleCalendarDaySelection([3], 0)).toThrowError('Received 0');
  });

  it('applies a manual icon to multiple days and undoes only that manual layer', () => {
    const originalDocument = createEditingDocument();
    const originalDayOne = originalDocument.days[0];
    const originalDayTwo = originalDocument.days[1];
    const { document: editedDocument, undo } = applyCalendarManualIcon(
      originalDocument,
      [1, 2],
      32,
    );

    expect(originalDocument.days[0]).toEqual(originalDayOne);
    expect(originalDocument.days[1]).toEqual(originalDayTwo);
    expect(editedDocument.days[0].manualIconId).toBe(32);
    expect(editedDocument.days[1].manualIconId).toBe(32);
    expect(editedDocument.days[0].moonIcons).toEqual(originalDayOne.moonIcons);
    expect(editedDocument.days[0].disasterIconId).toBe(originalDayOne.disasterIconId);
    expect(undo).toEqual({
      changes: [
        { dayOfYear: 1, previousIconId: null },
        { dayOfYear: 2, previousIconId: null },
      ],
    });

    const undoneDocument = undoCalendarManualIcon(editedDocument, undo);
    expect(undoneDocument).toEqual(originalDocument);
    expect(editedDocument).not.toBe(originalDocument);
  });

  it('clears only manual icons and updates notes without mutating the document', () => {
    const originalDocument = createEditingDocument();
    const withManualIcon = applyCalendarManualIcon(originalDocument, [1], 32).document;
    const withNote = updateCalendarDayNote(withManualIcon, 1, 'Festival');
    const cleared = applyCalendarManualIcon(withNote, [1], null).document;

    expect(cleared.days[0].manualIconId).toBeNull();
    expect(cleared.days[0].note).toBe('Festival');
    expect(cleared.days[0].moonIcons).toEqual(originalDocument.days[0].moonIcons);
    expect(cleared.days[0].disasterIconId).toBe(originalDocument.days[0].disasterIconId);
    expect(withManualIcon.days[0].manualIconId).toBe(32);
    expect(() => updateCalendarDayNote(cleared, 99, 'Missing')).toThrowError('does not exist');
    expect(() => applyCalendarManualIcon(cleared, [1], 999)).toThrowError('Received 999');
  });

  it('rejects malformed manual undo values and selections outside the document', () => {
    const document = createEditingDocument();

    expect(() => applyCalendarManualIcon(document, [99], 32)).toThrowError('does not exist');
    expect(() => undoCalendarManualIcon(document, { changes: [{ dayOfYear: 1, previousIconId: 999 }] }))
      .toThrowError('Received 999');
    expect(() => undoCalendarManualIcon(document, { changes: [{ dayOfYear: 0, previousIconId: null }] }))
      .toThrowError('Received 0');
  });
});
