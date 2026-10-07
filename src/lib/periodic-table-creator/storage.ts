import { MAX_PERIODIC_TABLE_FILE_BYTES, PERIODIC_TABLE_SLOT_COUNT, type PeriodicTableDocument } from './types';
import { validateTableDocument } from './table';

export const PERIODIC_TABLE_STORAGE_KEY = 'tokenmaker.periodic-table-creator.slots';

export type PeriodicTableStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export type PeriodicTableStoredSlot = {
  document: PeriodicTableDocument;
  savedAt: string;
};

type PeriodicTableSlotArray = Array<PeriodicTableStoredSlot | null>;

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value instanceof Error) return `${value.name}: ${value.message || '(empty message)'}`;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? Object.prototype.toString.call(value) : serialized;
  } catch (serializationFailure: unknown) {
    if (serializationFailure instanceof Error) {
      return `${Object.prototype.toString.call(value)} (serialization failed: ${serializationFailure.message})`;
    }

    throw serializationFailure;
  }
}

function requirePeriodicTableStorage(storage: unknown): PeriodicTableStorage {
  if (storage === null || typeof storage !== 'object' || Array.isArray(storage)) {
    throw new Error(`Periodic table storage must be an object. Received ${describeReceivedValue(storage)}.`);
  }

  const candidate = storage as { getItem?: unknown; setItem?: unknown };
  if (typeof candidate.getItem !== 'function') {
    throw new Error(`Periodic table storage getItem must be a function. Received ${describeReceivedValue(candidate.getItem)}.`);
  }
  if (typeof candidate.setItem !== 'function') {
    throw new Error(`Periodic table storage setItem must be a function. Received ${describeReceivedValue(candidate.setItem)}.`);
  }

  return storage as PeriodicTableStorage;
}

function requirePeriodicTableSlotNumber(slotNumber: unknown): number {
  if (
    typeof slotNumber === 'number' &&
    Number.isInteger(slotNumber) &&
    slotNumber >= 1 &&
    slotNumber <= PERIODIC_TABLE_SLOT_COUNT
  ) {
    return slotNumber;
  }

  throw new Error(
    `Periodic table slot number must be an integer from 1 to ${PERIODIC_TABLE_SLOT_COUNT}. Received ${describeReceivedValue(slotNumber)}.`,
  );
}

function getUtf8ByteLength(serializedSlots: string): number {
  if (typeof TextEncoder !== 'function') {
    throw new Error('Periodic table storage requires TextEncoder. Received undefined.');
  }

  return new TextEncoder().encode(serializedSlots).byteLength;
}

function requireStorageByteLimit(serializedSlots: string): void {
  const byteLength = getUtf8ByteLength(serializedSlots);
  if (byteLength > MAX_PERIODIC_TABLE_FILE_BYTES) {
    throw new RangeError(
      `Periodic table storage is ${byteLength} UTF-8 bytes; the maximum is ${MAX_PERIODIC_TABLE_FILE_BYTES} bytes.`,
    );
  }
}

function createEmptyPeriodicTableSlots(): PeriodicTableSlotArray {
  return Array.from({ length: PERIODIC_TABLE_SLOT_COUNT }, () => null);
}

function clonePeriodicTableDocument(document: PeriodicTableDocument): PeriodicTableDocument {
  return {
    version: document.version,
    rows: document.rows,
    columns: document.columns,
    cells: document.cells.map((cell) => ({
      id: cell.id,
      text: { ...cell.text },
      style: { ...cell.style },
      selected: cell.selected,
    })),
  };
}

function clonePeriodicTableSlot(slot: PeriodicTableStoredSlot): PeriodicTableStoredSlot {
  return {
    document: clonePeriodicTableDocument(slot.document),
    savedAt: slot.savedAt,
  };
}

function requireSavedAt(value: unknown, slotNumber: number): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Periodic table slot ${slotNumber} savedAt must be a non-empty string. Received ${describeReceivedValue(value)}.`);
  }

  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(`Periodic table slot ${slotNumber} savedAt must be a valid date. Received ${JSON.stringify(value)}.`);
  }

  return value;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireExactSlotKeys(record: Record<string, unknown>, slotNumber: number): void {
  const keys = Object.keys(record).sort();
  if (keys.length !== 2 || keys[0] !== 'document' || keys[1] !== 'savedAt') {
    throw new Error(`Periodic table slot ${slotNumber} must contain only document and savedAt. Received ${describeReceivedValue(record)}.`);
  }
}

function requireStoredSlot(value: unknown, slotNumber: number): PeriodicTableStoredSlot | null {
  if (value === null) return null;
  if (!isPlainRecord(value)) {
    throw new Error(`Periodic table slot ${slotNumber} must be null or a save record. Received ${describeReceivedValue(value)}.`);
  }

  requireExactSlotKeys(value, slotNumber);
  const validatedDocument = validateTableDocument(value.document);
  return {
    document: clonePeriodicTableDocument(validatedDocument),
    savedAt: requireSavedAt(value.savedAt, slotNumber),
  };
}

function requireStoredSlots(value: unknown): PeriodicTableSlotArray {
  if (!Array.isArray(value) || value.length !== PERIODIC_TABLE_SLOT_COUNT) {
    throw new Error(`Periodic table storage must contain exactly ${PERIODIC_TABLE_SLOT_COUNT} slots. Received ${describeReceivedValue(value)}.`);
  }

  return value.map((slot, index) => requireStoredSlot(slot, index + 1));
}

function readRawPeriodicTableSlots(storage: PeriodicTableStorage): string | null {
  let rawSlots: string | null;
  try {
    rawSlots = storage.getItem(PERIODIC_TABLE_STORAGE_KEY);
  } catch (readFailure: unknown) {
    throw new Error(
      `Periodic table storage getItem failed for key ${JSON.stringify(PERIODIC_TABLE_STORAGE_KEY)}. Received ${describeReceivedValue(readFailure)}.`,
      { cause: readFailure },
    );
  }

  if (rawSlots === null) return null;
  if (typeof rawSlots !== 'string') {
    throw new Error(`Periodic table storage getItem returned an invalid value. Received ${describeReceivedValue(rawSlots)}.`);
  }

  requireStorageByteLimit(rawSlots);
  return rawSlots;
}

function parseStoredPeriodicTableSlots(rawSlots: string): PeriodicTableSlotArray {
  let parsedSlots: unknown;
  try {
    parsedSlots = JSON.parse(rawSlots) as unknown;
  } catch (parseFailure: unknown) {
    if (parseFailure instanceof SyntaxError) {
      throw new Error(
        `Periodic table storage contains invalid JSON. Received ${JSON.stringify(rawSlots.slice(0, 160))}.`,
        { cause: parseFailure },
      );
    }

    throw parseFailure;
  }

  return requireStoredSlots(parsedSlots);
}

function readPeriodicTableSlotArray(storage: PeriodicTableStorage): PeriodicTableSlotArray {
  const rawSlots = readRawPeriodicTableSlots(storage);
  if (rawSlots === null) return createEmptyPeriodicTableSlots();
  return parseStoredPeriodicTableSlots(rawSlots);
}

function serializePeriodicTableSlots(slots: PeriodicTableSlotArray): string {
  const serializedSlots = JSON.stringify(slots);
  if (typeof serializedSlots !== 'string') {
    throw new Error(`Periodic table storage could not be serialized. Received ${describeReceivedValue(slots)}.`);
  }

  requireStorageByteLimit(serializedSlots);
  return serializedSlots;
}

function writePeriodicTableSlotArray(storage: PeriodicTableStorage, slots: PeriodicTableSlotArray, slotNumber: number): void {
  const serializedSlots = serializePeriodicTableSlots(slots);
  try {
    storage.setItem(PERIODIC_TABLE_STORAGE_KEY, serializedSlots);
  } catch (writeFailure: unknown) {
    throw new Error(
      `Periodic table storage setItem failed for key ${JSON.stringify(PERIODIC_TABLE_STORAGE_KEY)} and slot ${slotNumber}. Received ${describeReceivedValue(writeFailure)}.`,
      { cause: writeFailure },
    );
  }
}

export function readPeriodicTableSlots(storage: PeriodicTableStorage): Array<PeriodicTableStoredSlot | null> {
  const validatedStorage = requirePeriodicTableStorage(storage);
  return readPeriodicTableSlotArray(validatedStorage).map((slot) => (slot === null ? null : clonePeriodicTableSlot(slot)));
}

export function savePeriodicTableSlot(
  storage: PeriodicTableStorage,
  slotNumber: number,
  document: PeriodicTableDocument,
): Array<PeriodicTableStoredSlot | null> {
  const validatedStorage = requirePeriodicTableStorage(storage);
  const validatedSlotNumber = requirePeriodicTableSlotNumber(slotNumber);
  validateTableDocument(document);
  const slots = readPeriodicTableSlotArray(validatedStorage);
  const savedSlot: PeriodicTableStoredSlot = {
    document: clonePeriodicTableDocument(document),
    savedAt: new Date().toISOString(),
  };
  slots[validatedSlotNumber - 1] = savedSlot;
  writePeriodicTableSlotArray(validatedStorage, slots, validatedSlotNumber);
  return slots.map((slot) => (slot === null ? null : clonePeriodicTableSlot(slot)));
}
