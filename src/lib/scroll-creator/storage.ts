import { requireScrollProject } from './project';
import type { ScrollProject } from './types';

export const SCROLL_SAVE_STORAGE_KEY = 'tokenmaker.scroll-creator.saves';
export const SCROLL_SAVE_SLOT_COUNT = 4;

export type ScrollSaveSlot = {
  slot: 1 | 2 | 3 | 4;
  savedAt: string | null;
  project: ScrollProject | null;
};

type ScrollStorageReader = Pick<Storage, 'getItem'>;
type ScrollStorageWriter = Pick<Storage, 'getItem' | 'setItem'>;
type ScrollRecord = Record<string, unknown>;

const SCROLL_SAVE_SLOT_NUMBERS = [1, 2, 3, 4] as const;
const SCROLL_SAVE_SLOT_KEYS = ['slot', 'savedAt', 'project'] as const;

/**
 * Reads all four local save slots. A missing key is the only empty-state case;
 * a present malformed key is reported so the UI never silently loses a draft.
 */
export function readScrollSaveSlots(storage: ScrollStorageReader): ScrollSaveSlot[] {
  requireScrollStorageReader(storage);

  const rawSlots = readStoredSlotsValue(storage);
  if (rawSlots === null) {
    return createEmptyScrollSaveSlots();
  }

  const parsedSlots = parseStoredSlots(rawSlots);
  return requireStoredScrollSaveSlots(parsedSlots);
}

/**
 * Validates and writes one save slot, preserving the other three slots.
 */
export function saveScrollToSlot(
  storage: ScrollStorageWriter,
  slot: number,
  project: ScrollProject,
): ScrollSaveSlot[] {
  requireScrollStorageWriter(storage);
  const validatedSlot = requireScrollSaveSlotNumber(slot);
  const validatedProject = requireScrollProject(project);
  const slots = readScrollSaveSlots(storage);
  const updatedSlots = slots.map((saveSlot) =>
    saveSlot.slot === validatedSlot
      ? { slot: validatedSlot, savedAt: new Date().toISOString(), project: validatedProject }
      : saveSlot,
  );
  const serializedSlots = serializeScrollSaveSlots(updatedSlots);

  try {
    storage.setItem(SCROLL_SAVE_STORAGE_KEY, serializedSlots);
  } catch (error: unknown) {
    if (!(error instanceof Error)) throw error;
    throw new Error(
      `Scroll save storage setItem failed for key ${JSON.stringify(SCROLL_SAVE_STORAGE_KEY)} at slot ${validatedSlot}. Received ${describeScrollStorageValue(error)}.`,
      { cause: error },
    );
  }

  return updatedSlots;
}

function createEmptyScrollSaveSlots(): ScrollSaveSlot[] {
  return SCROLL_SAVE_SLOT_NUMBERS.map((slot) => ({ slot, savedAt: null, project: null }));
}

function readStoredSlotsValue(storage: ScrollStorageReader): string | null {
  let storedValue: string | null;
  try {
    storedValue = storage.getItem(SCROLL_SAVE_STORAGE_KEY);
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw error;
    }
    throw new Error(
      `Scroll save storage getItem failed for key ${JSON.stringify(SCROLL_SAVE_STORAGE_KEY)}. Received ${describeScrollStorageValue(error)}.`,
      { cause: error },
    );
  }
  if (storedValue !== null && typeof storedValue !== 'string') {
    throw new TypeError(
      `Scroll save storage getItem must return a string or null for key ${JSON.stringify(SCROLL_SAVE_STORAGE_KEY)}. Received ${describeScrollStorageValue(storedValue)}.`,
    );
  }
  return storedValue;
}

function parseStoredSlots(rawSlots: string): unknown {
  try {
    return JSON.parse(rawSlots) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(
        `Scroll save storage key ${JSON.stringify(SCROLL_SAVE_STORAGE_KEY)} contains invalid JSON. Received ${JSON.stringify(rawSlots.slice(0, 160))}.`,
        { cause: error },
      );
    }
    throw error;
  }
}

function requireStoredScrollSaveSlots(value: unknown): ScrollSaveSlot[] {
  if (!Array.isArray(value) || value.length !== SCROLL_SAVE_SLOT_COUNT) {
    throw new TypeError(
      `Scroll save storage key ${JSON.stringify(SCROLL_SAVE_STORAGE_KEY)} must contain exactly ${SCROLL_SAVE_SLOT_COUNT} slot records. Received ${describeScrollStorageValue(value)}.`,
    );
  }

  return value.map((slotValue, index) => requireStoredScrollSaveSlot(slotValue, index));
}

function requireStoredScrollSaveSlot(value: unknown, index: number): ScrollSaveSlot {
  const expectedSlot = SCROLL_SAVE_SLOT_NUMBERS[index];
  if (!isScrollRecord(value)) {
    throw new TypeError(
      `Scroll save storage slot ${expectedSlot} must be an object with slot, savedAt, and project fields. Received ${describeScrollStorageValue(value)}.`,
    );
  }
  requireExactScrollSaveSlotKeys(value, expectedSlot);

  if (value.slot !== expectedSlot) {
    throw new TypeError(
      `Scroll save storage slot ${expectedSlot}.slot must be ${expectedSlot}. Received ${describeScrollStorageValue(value.slot)}.`,
    );
  }

  const savedAt = requireScrollSaveTimestamp(value.savedAt, expectedSlot);
  const project = value.project === null ? null : requireScrollProject(value.project);
  if ((savedAt === null) !== (project === null)) {
    throw new TypeError(
      `Scroll save storage slot ${expectedSlot} must have both savedAt and project empty or both present. Received savedAt ${describeScrollStorageValue(savedAt)} and project ${describeScrollStorageValue(project)}.`,
    );
  }
  return { slot: expectedSlot, savedAt, project };
}

function requireScrollSaveTimestamp(value: unknown, slot: number): string | null {
  if (value === null) return null;
  const parsedTimestamp = typeof value === 'string' ? new Date(value) : null;
  const canonicalTimestamp = parsedTimestamp && Number.isFinite(parsedTimestamp.getTime())
    ? parsedTimestamp.toISOString()
    : null;
  if (typeof value !== 'string' || canonicalTimestamp !== value) {
    throw new TypeError(
      `Scroll save storage slot ${slot}.savedAt must be null or a canonical ISO timestamp. Received ${describeScrollStorageValue(value)}.`,
    );
  }
  return value;
}

function serializeScrollSaveSlots(slots: ScrollSaveSlot[]): string {
  const serializedSlots = JSON.stringify(slots);
  if (typeof serializedSlots !== 'string') {
    throw new TypeError(
      `Scroll save storage key ${JSON.stringify(SCROLL_SAVE_STORAGE_KEY)} could not be serialized. Received ${describeScrollStorageValue(slots)}.`,
    );
  }
  return serializedSlots;
}

function requireScrollStorageReader(storage: unknown): asserts storage is ScrollStorageReader {
  if (!isScrollRecord(storage)) {
    throw new TypeError(
      `Scroll save storage must be an object with getItem. Received ${describeScrollStorageValue(storage)}.`,
    );
  }
  if (typeof storage.getItem !== 'function') {
    throw new TypeError(
      `Scroll save storage getItem must be a function. Received ${describeScrollStorageValue(storage.getItem)}.`,
    );
  }
}

function requireScrollStorageWriter(storage: unknown): asserts storage is ScrollStorageWriter {
  requireScrollStorageReader(storage);
  const writerStorage = storage as ScrollRecord & Partial<ScrollStorageWriter>;
  if (typeof writerStorage.setItem !== 'function') {
    throw new TypeError(
      `Scroll save storage setItem must be a function. Received ${describeScrollStorageValue(writerStorage.setItem)}.`,
    );
  }
}

function requireScrollSaveSlotNumber(value: unknown): 1 | 2 | 3 | 4 {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= SCROLL_SAVE_SLOT_COUNT
  ) {
    return value as 1 | 2 | 3 | 4;
  }
  throw new RangeError(
    `Scroll save slot must be an integer from 1 to ${SCROLL_SAVE_SLOT_COUNT}. Received ${describeScrollStorageValue(value)}.`,
  );
}

function requireExactScrollSaveSlotKeys(record: ScrollRecord, slot: number): void {
  const receivedKeys = Object.keys(record).sort();
  const expectedKeys = [...SCROLL_SAVE_SLOT_KEYS].sort();
  if (
    receivedKeys.length !== expectedKeys.length ||
    receivedKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw new TypeError(
      `Scroll save storage slot ${slot} must contain exactly slot, savedAt, and project fields. Received ${describeScrollStorageValue(record)}.`,
    );
  }
}

function isScrollRecord(value: unknown): value is ScrollRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function describeScrollStorageValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value instanceof Error) return JSON.stringify(value.message || value.name);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return `array(length=${value.length})`;
  return Object.prototype.toString.call(value);
}
