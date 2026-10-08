import { describe, expect, it } from 'vitest';

import { createCalendar } from './calendar';
import {
  CALENDAR_SAVE_SLOT_COUNT,
  CALENDAR_SAVE_STORAGE_KEY,
  CalendarStorageError,
  loadCalendarSaveSlot,
  readCalendarSaveSlots,
  saveCalendarSaveSlot,
} from './storage';
import type { CalendarDocument, CalendarSaveSlotNumber, CalendarSettings } from './types';

type MemoryStorage = Pick<Storage, 'getItem' | 'setItem'>;

function createMemoryStorage(): MemoryStorage & {
  failReads: boolean;
  failWrites: boolean;
} {
  const storedValues = new Map<string, string>();
  return {
    failReads: false,
    failWrites: false,
    getItem(key) {
      if (this.failReads) {
        throw new Error('read unavailable');
      }

      return storedValues.get(key) ?? null;
    },
    setItem(key, value) {
      if (this.failWrites) {
        throw new Error('quota exceeded');
      }

      storedValues.set(key, value);
    },
  };
}

function createStorageDocument(): CalendarDocument {
  const settings: CalendarSettings = {
    year: -12,
    months: [
      { name: 'First', dayCount: 8 },
      { name: 'Second', dayCount: 5 },
      { name: 'Third', dayCount: 4 },
      { name: 'Fourth', dayCount: 3 },
    ],
    weekdayNames: ['One', 'Two', 'Three'],
    startWeekdayIndex: 1,
    moonCycles: { white: 4, blue: 4, red: 4 },
    disasterProbability: 100,
  };
  const document = createCalendar(settings, () => 0.5);
  document.days[0].manualIconId = 32;
  document.days[0].note = 'Stored note';
  return document;
}

function readStoredPayload(storage: MemoryStorage): unknown {
  const serializedPayload = storage.getItem(CALENDAR_SAVE_STORAGE_KEY);
  return serializedPayload === null ? null : JSON.parse(serializedPayload) as unknown;
}

function expectCalendarStorageError(
  action: () => unknown,
  expectedMessage: string,
  expectedCauseMessage?: string,
): void {
  let capturedFailure: unknown;
  try {
    action();
  } catch (failure: unknown) {
    capturedFailure = failure;
  }

  expect(capturedFailure).toBeInstanceOf(CalendarStorageError);
  if (!(capturedFailure instanceof CalendarStorageError)) {
    throw new Error(`Expected CalendarStorageError, received ${String(capturedFailure)}.`);
  }

  expect(capturedFailure.message).toContain(expectedMessage);
  if (expectedCauseMessage !== undefined) {
    expect(capturedFailure.cause).toBeInstanceOf(Error);
    expect(String(capturedFailure.cause)).toContain(expectedCauseMessage);
  }
}

describe('calendar save storage', () => {
  it('uses one key and four empty slots before the first save', () => {
    const storage = createMemoryStorage();

    expect(CALENDAR_SAVE_SLOT_COUNT).toBe(4);
    expect(readCalendarSaveSlots(storage)).toEqual([null, null, null, null]);
    expect(storage.getItem(CALENDAR_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('round trips all slots with complete realized calendar state and clones values', () => {
    const storage = createMemoryStorage();
    const document = createStorageDocument();
    const timestamps = [
      '2026-10-06T00:00:01.000Z',
      '2026-10-06T00:00:02.000Z',
      '2026-10-06T00:00:03.000Z',
      '2026-10-06T00:00:04.000Z',
    ];

    for (const [index, savedAt] of timestamps.entries()) {
      saveCalendarSaveSlot(storage, (index + 1) as CalendarSaveSlotNumber, document, savedAt);
    }

    const slots = readCalendarSaveSlots(storage);
    expect(slots).toHaveLength(4);
    expect(slots.every((record) => record?.version === 1)).toBe(true);
    expect(slots[0]?.savedAt).toBe(timestamps[0]);
    expect(slots[0]?.document.days[0]).toMatchObject({
      manualIconId: 32,
      note: 'Stored note',
      disasterIconId: expect.any(Number),
    });
    expect(slots[0]?.document.days[0].moonIcons.white).not.toBeNull();
    expect(slots[0]?.document.days[0].moonIcons.blue).not.toBeNull();
    expect(slots[0]?.document.days[0].moonIcons.red).not.toBeNull();
    expect(loadCalendarSaveSlot(storage, 4)).toEqual(document);

    const loadedDocument = loadCalendarSaveSlot(storage, 1);
    loadedDocument.days[0].note = 'Mutated outside storage';
    expect(loadCalendarSaveSlot(storage, 1).days[0].note).toBe('Stored note');

    const storedPayload = readStoredPayload(storage) as Array<Record<string, unknown>>;
    expect(storedPayload).toHaveLength(4);
    expect(storedPayload[0]).toMatchObject({ version: 1, savedAt: timestamps[0] });
    expect(JSON.stringify(storedPayload[0])).toContain('Stored note');
  });

  it('rejects empty slots, invalid slot values, bad JSON, bad versions and bad timestamps', () => {
    const storage = createMemoryStorage();

    expectCalendarStorageError(
      () => loadCalendarSaveSlot(storage, 1),
      'slot 1 is empty',
      'slot 1 is empty',
    );
    expect(() => loadCalendarSaveSlot(storage, 0 as CalendarSaveSlotNumber)).toThrowError('Received 0');
    expect(() => saveCalendarSaveSlot(storage, 5 as CalendarSaveSlotNumber, createStorageDocument()))
      .toThrowError('Received 5');

    storage.setItem(CALENDAR_SAVE_STORAGE_KEY, '{broken');
    expectCalendarStorageError(
      () => readCalendarSaveSlots(storage),
      'invalid JSON',
      'SyntaxError',
    );

    storage.setItem(CALENDAR_SAVE_STORAGE_KEY, JSON.stringify([null, null, null]));
    expectCalendarStorageError(
      () => readCalendarSaveSlots(storage),
      'exactly 4 slots',
      'Received [null,null,null]',
    );

    const invalidRecord = {
      version: 2,
      savedAt: '2026-10-06T00:00:00.000Z',
      document: createStorageDocument(),
    };
    storage.setItem(
      CALENDAR_SAVE_STORAGE_KEY,
      JSON.stringify([invalidRecord, null, null, null]),
    );
    expectCalendarStorageError(
      () => readCalendarSaveSlots(storage),
      'version must be 1',
      'Received 2',
    );

    storage.setItem(
      CALENDAR_SAVE_STORAGE_KEY,
      JSON.stringify([{ ...invalidRecord, version: 1, savedAt: 'tomorrow' }, null, null, null]),
    );
    expectCalendarStorageError(
      () => readCalendarSaveSlots(storage),
      'canonical ISO timestamp',
      'Received "tomorrow"',
    );
  });

  it('reports read and write failures and preserves the previous serialized payload', () => {
    const readFailureStorage = createMemoryStorage();
    readFailureStorage.failReads = true;
    expect(() => readCalendarSaveSlots(readFailureStorage)).toThrowError(CalendarStorageError);
    try {
      readCalendarSaveSlots(readFailureStorage);
    } catch (error: unknown) {
      expect(error).toMatchObject({
        name: 'CalendarStorageError',
        cause: expect.objectContaining({ message: 'read unavailable' }),
      });
      expect(String(error)).toContain(CALENDAR_SAVE_STORAGE_KEY);
    }

    const storage = createMemoryStorage();
    saveCalendarSaveSlot(storage, 1, createStorageDocument(), '2026-10-06T00:00:00.000Z');
    const previousPayload = storage.getItem(CALENDAR_SAVE_STORAGE_KEY);
    storage.failWrites = true;
    expect(() => saveCalendarSaveSlot(storage, 2, createStorageDocument(), '2026-10-06T00:00:01.000Z'))
      .toThrowError(CalendarStorageError);
    expect(storage.getItem(CALENDAR_SAVE_STORAGE_KEY)).toBe(previousPayload);
  });

  it('validates before writing and rejects invalid icon and document payloads', () => {
    const storage = createMemoryStorage();
    const document = createStorageDocument();
    saveCalendarSaveSlot(storage, 1, document, '2026-10-06T00:00:00.000Z');
    const previousPayload = storage.getItem(CALENDAR_SAVE_STORAGE_KEY);

    const invalidIconDocument = {
      ...document,
      days: document.days.map((calendarDay, index) => index === 0
        ? { ...calendarDay, manualIconId: 999 }
        : calendarDay),
    };
    expect(() => saveCalendarSaveSlot(
      storage,
      2,
      invalidIconDocument,
      '2026-10-06T00:00:01.000Z',
    )).toThrowError('Received 999');
    expect(storage.getItem(CALENDAR_SAVE_STORAGE_KEY)).toBe(previousPayload);

    const rawPayload = JSON.parse(previousPayload ?? 'null') as Array<Record<string, unknown>>;
    rawPayload[0].document = {
      ...(rawPayload[0].document as Record<string, unknown>),
      days: [],
    };
    storage.setItem(CALENDAR_SAVE_STORAGE_KEY, JSON.stringify(rawPayload));
    expectCalendarStorageError(
      () => readCalendarSaveSlots(storage),
      'document days must contain 20 entries',
      'Received 0',
    );

    rawPayload[0].document = createStorageDocument();
    (rawPayload[0].document as Record<string, unknown>).days = (
      (rawPayload[0].document as Record<string, unknown>).days as Array<Record<string, unknown>>
    ).map((calendarDay, index) => index === 0
      ? { ...calendarDay, manualIconId: 999 }
      : calendarDay);
    storage.setItem(CALENDAR_SAVE_STORAGE_KEY, JSON.stringify(rawPayload));
    expectCalendarStorageError(
      () => readCalendarSaveSlots(storage),
      'manual icon',
      'Received 999',
    );
  });
});
