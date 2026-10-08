import type {
  CalendarDocument,
  CalendarSaveRecord,
  CalendarSaveSlotNumber,
} from './types';
import { isCalendarIconId } from './icons';
import { CalendarInputError, requireCalendarDocument } from './validation';

export const CALENDAR_SAVE_STORAGE_KEY = 'tokenmaker.calendar-creator.saves';
export const CALENDAR_SAVE_SLOT_COUNT = 4;

const CALENDAR_SAVE_SLOT_NUMBERS = [1, 2, 3, 4] as const;
const CALENDAR_SAVE_VERSION = 1;

export class CalendarStorageError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'CalendarStorageError';
  }
}

function createStoredPayloadError(
  message: string,
  cause: unknown = new Error(message),
): CalendarStorageError {
  return new CalendarStorageError(message, cause);
}

function stringifyFailureReason(error: unknown): string {
  if (error instanceof Error) {
    return error.message.length > 0 ? error.message : `${error.name} with empty message`;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error === undefined) {
    return 'undefined';
  }

  if (error === null) {
    return 'null';
  }

  if (typeof error === 'number' || typeof error === 'boolean' || typeof error === 'bigint') {
    return String(error);
  }

  return Object.prototype.toString.call(error);
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
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string'
      ? serialized
      : Object.prototype.toString.call(value);
  } catch (error: unknown) {
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${stringifyFailureReason(error)}).`;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireReadableStorage(storage: unknown): Pick<Storage, 'getItem'> {
  if (!isRecord(storage)) {
    throw new Error(
      `Calendar storage must be an object. Received ${describeReceivedValue(storage)}.`,
    );
  }

  if (typeof storage.getItem !== 'function') {
    throw new Error(
      `Calendar storage getItem must be a function. Received ${describeReceivedValue(storage.getItem)}.`,
    );
  }

  return storage as Pick<Storage, 'getItem'>;
}

function requireWritableStorage(storage: unknown): Pick<Storage, 'getItem' | 'setItem'> {
  const readableStorage = requireReadableStorage(storage);
  if (!isRecord(storage) || typeof storage.setItem !== 'function') {
    throw new Error(
      `Calendar storage setItem must be a function. Received ${describeReceivedValue(
        isRecord(storage) ? storage.setItem : undefined,
      )}.`,
    );
  }

  return {
    getItem: readableStorage.getItem.bind(storage),
    setItem: storage.setItem.bind(storage),
  };
}

function requireCalendarSaveSlotNumber(value: unknown): CalendarSaveSlotNumber {
  if (CALENDAR_SAVE_SLOT_NUMBERS.includes(value as CalendarSaveSlotNumber)) {
    return value as CalendarSaveSlotNumber;
  }

  throw new Error(
    `Calendar save slot must be an integer from 1 to ${CALENDAR_SAVE_SLOT_COUNT}. Received ${describeReceivedValue(value)}.`,
  );
}

function createEmptySaveSlots(): Array<CalendarSaveRecord | null> {
  return Array.from({ length: CALENDAR_SAVE_SLOT_COUNT }, () => null);
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

function cloneCalendarSaveRecord(record: CalendarSaveRecord): CalendarSaveRecord {
  return {
    version: CALENDAR_SAVE_VERSION,
    savedAt: record.savedAt,
    document: cloneCalendarDocument(record.document),
  };
}

function formatStorageFailure(
  operation: 'getItem' | 'setItem',
  slot: CalendarSaveSlotNumber | undefined,
  error: unknown,
): CalendarStorageError {
  const slotDescription = slot === undefined ? 'while reading all save slots' : `for save slot ${slot}`;
  return new CalendarStorageError(
    `Calendar storage ${operation} failed for key ${JSON.stringify(CALENDAR_SAVE_STORAGE_KEY)} ${slotDescription}. Received ${JSON.stringify(stringifyFailureReason(error))}.`,
    error,
  );
}

function readSerializedCalendarSaves(
  storage: Pick<Storage, 'getItem'>,
  slot: CalendarSaveSlotNumber | undefined,
): string | null {
  let serializedSaves: string | null;
  try {
    serializedSaves = storage.getItem(CALENDAR_SAVE_STORAGE_KEY);
  } catch (error: unknown) {
    throw formatStorageFailure('getItem', slot, error);
  }

  if (serializedSaves !== null && typeof serializedSaves !== 'string') {
    throw createStoredPayloadError(
      `Calendar storage getItem returned an invalid value for key ${JSON.stringify(CALENDAR_SAVE_STORAGE_KEY)}. Received ${describeReceivedValue(serializedSaves)}.`,
      new Error(
        `Calendar storage getItem returned ${describeReceivedValue(serializedSaves)}.`,
      ),
    );
  }

  return serializedSaves;
}

function parseSerializedCalendarSaves(serializedSaves: string | null): unknown {
  if (serializedSaves === null) {
    return createEmptySaveSlots();
  }

  try {
    return JSON.parse(serializedSaves) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw createStoredPayloadError(
        `Calendar save storage contains invalid JSON. Received ${JSON.stringify(serializedSaves.slice(0, 160))}.`,
        error,
      );
    }

    throw error;
  }
}

function requireExactFields(
  value: Record<string, unknown>,
  expectedFields: readonly string[],
  context: string,
): void {
  const receivedFields = Object.keys(value).sort();
  const sortedExpectedFields = [...expectedFields].sort();
  if (
    receivedFields.length !== sortedExpectedFields.length ||
    receivedFields.some((field, index) => field !== sortedExpectedFields[index])
  ) {
    throw createStoredPayloadError(
      `${context} must contain exactly ${sortedExpectedFields.join(', ')}. Received ${describeReceivedValue(value)}.`,
    );
  }
}

function requireCalendarSaveTimestamp(value: unknown, context: string): string {
  if (typeof value !== 'string') {
    throw createStoredPayloadError(
      `${context} savedAt must be an ISO timestamp string. Received ${describeReceivedValue(value)}.`,
    );
  }

  const parsedTimestamp = new Date(value);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
    Number.isNaN(parsedTimestamp.getTime()) ||
    parsedTimestamp.toISOString() !== value
  ) {
    throw createStoredPayloadError(
      `${context} savedAt must be a canonical ISO timestamp. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function validateStoredCalendarIconIds(
  document: CalendarDocument,
  context: string,
): void {
  for (const calendarDay of document.days) {
    const iconValues: Array<[string, unknown]> = [
      ['manualIconId', calendarDay.manualIconId],
      ['white moon icon', calendarDay.moonIcons.white],
      ['blue moon icon', calendarDay.moonIcons.blue],
      ['red moon icon', calendarDay.moonIcons.red],
      ['disasterIconId', calendarDay.disasterIconId],
    ];
    for (const [iconName, iconValue] of iconValues) {
      if (iconValue !== null && !isCalendarIconId(iconValue)) {
        throw createStoredPayloadError(
          `${context} day ${calendarDay.dayOfYear} ${iconName} must be null or a valid calendar icon ID. Received ${describeReceivedValue(iconValue)}.`,
        );
      }
    }
  }
}

function validateStoredCalendarDocument(
  value: unknown,
  context: string,
): CalendarDocument {
  let validatedDocument: CalendarDocument;
  try {
    validatedDocument = requireCalendarDocument(value);
  } catch (error: unknown) {
    if (error instanceof CalendarInputError) {
      throw createStoredPayloadError(
        `${context} document is invalid: ${error.message}`,
        error,
      );
    }

    throw error;
  }

  validateStoredCalendarIconIds(validatedDocument, context);
  return cloneCalendarDocument(validatedDocument);
}

function validateStoredCalendarRecord(
  value: unknown,
  slot: CalendarSaveSlotNumber,
): CalendarSaveRecord {
  const context = `Calendar save slot ${slot}`;
  if (!isRecord(value)) {
    throw createStoredPayloadError(
      `${context} must contain a save record or null. Received ${describeReceivedValue(value)}.`,
    );
  }

  requireExactFields(value, ['document', 'savedAt', 'version'], context);
  if (value.version !== CALENDAR_SAVE_VERSION) {
    throw createStoredPayloadError(
      `${context} version must be ${CALENDAR_SAVE_VERSION}. Received ${describeReceivedValue(value.version)}.`,
    );
  }

  return {
    version: CALENDAR_SAVE_VERSION,
    savedAt: requireCalendarSaveTimestamp(value.savedAt, context),
    document: validateStoredCalendarDocument(value.document, context),
  };
}

function validateSerializedCalendarSlots(value: unknown): Array<CalendarSaveRecord | null> {
  if (!Array.isArray(value) || value.length !== CALENDAR_SAVE_SLOT_COUNT) {
    throw createStoredPayloadError(
      `Calendar save storage must contain exactly ${CALENDAR_SAVE_SLOT_COUNT} slots. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value.map((slotValue, index) => {
    const slot = (index + 1) as CalendarSaveSlotNumber;
    return slotValue === null ? null : validateStoredCalendarRecord(slotValue, slot);
  });
}

function readCalendarSlotsWithSerializedValue(
  storage: Pick<Storage, 'getItem'>,
): { slots: Array<CalendarSaveRecord | null>; serializedSaves: string | null } {
  const serializedSaves = readSerializedCalendarSaves(storage, undefined);
  const parsedSaves = parseSerializedCalendarSaves(serializedSaves);
  return {
    slots: validateSerializedCalendarSlots(parsedSaves),
    serializedSaves,
  };
}

export function readCalendarSaveSlots(
  storage: Pick<Storage, 'getItem'>,
): Array<CalendarSaveRecord | null> {
  const readableStorage = requireReadableStorage(storage);
  return readCalendarSlotsWithSerializedValue(readableStorage).slots;
}

export function loadCalendarSaveSlot(
  storage: Pick<Storage, 'getItem'>,
  slot: CalendarSaveSlotNumber,
): CalendarDocument {
  const validatedSlot = requireCalendarSaveSlotNumber(slot);
  const slots = readCalendarSaveSlots(storage);
  const record = slots[validatedSlot - 1];
  if (record === null) {
    throw createStoredPayloadError(
      `Calendar save slot ${validatedSlot} is empty. Received ${describeReceivedValue(record)}.`,
    );
  }

  return cloneCalendarDocument(record.document);
}

export function saveCalendarSaveSlot(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  slot: CalendarSaveSlotNumber,
  document: CalendarDocument,
  savedAt = new Date().toISOString(),
): CalendarSaveRecord {
  const validatedSlot = requireCalendarSaveSlotNumber(slot);
  const writableStorage = requireWritableStorage(storage);
  const { slots, serializedSaves } = readCalendarSlotsWithSerializedValue(writableStorage);
  const validatedDocument = validateStoredCalendarDocument(
    document,
    `Calendar save slot ${validatedSlot}`,
  );
  const validatedSavedAt = requireCalendarSaveTimestamp(
    savedAt,
    `Calendar save slot ${validatedSlot}`,
  );
  const record: CalendarSaveRecord = {
    version: CALENDAR_SAVE_VERSION,
    savedAt: validatedSavedAt,
    document: validatedDocument,
  };
  const nextSlots = [...slots];
  nextSlots[validatedSlot - 1] = cloneCalendarSaveRecord(record);
  const nextSerializedSaves = JSON.stringify(nextSlots);

  try {
    writableStorage.setItem(CALENDAR_SAVE_STORAGE_KEY, nextSerializedSaves);
  } catch (error: unknown) {
    if (serializedSaves !== null) {
      try {
        writableStorage.setItem(CALENDAR_SAVE_STORAGE_KEY, serializedSaves);
      } catch (restoreError: unknown) {
        throw new CalendarStorageError(
          `Calendar storage setItem failed for key ${JSON.stringify(CALENDAR_SAVE_STORAGE_KEY)} while saving slot ${validatedSlot}, and restoring the previous serialized payload also failed. Received ${JSON.stringify(stringifyFailureReason(restoreError))}.`,
          restoreError,
        );
      }
    }

    throw formatStorageFailure('setItem', validatedSlot, error);
  }

  return cloneCalendarSaveRecord(record);
}
