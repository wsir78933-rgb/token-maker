import { validateTownDocument } from './document';
import type { TownDocument, TownLayer, TownObject } from './types';

export const TOWN_SAVE_STORAGE_KEY = 'tokenmaker.town-creator.slots';
export const TOWN_SAVE_SLOT_COUNT = 5;

const TOWN_SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5] as const;
const TOWN_SAVE_ENTRY_KEYS = ['document', 'savedAt'] as const;

export type TownSaveSlotNumber = (typeof TOWN_SAVE_SLOT_NUMBERS)[number];

export type TownStorage = Pick<Storage, 'getItem' | 'setItem'>;

export type TownStoredSlot = {
  document: TownDocument;
  savedAt: string;
};

type TownSaveSlotArray = Array<TownStoredSlot | null>;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

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

function stringifyFailureReason(value: unknown): string {
  if (value instanceof Error) {
    return value.message.length > 0 ? value.message : `${value.name} with empty message`;
  }

  return describeReceivedValue(value);
}

function requireTownStorage(receivedStorage: unknown): TownStorage {
  if (!isPlainRecord(receivedStorage)) {
    throw new Error(`Town save storage must be an object. Received ${describeReceivedValue(receivedStorage)}.`);
  }
  if (typeof receivedStorage.getItem !== 'function') {
    throw new Error(
      `Town save storage getItem must be a function. Received ${describeReceivedValue(receivedStorage.getItem)}.`,
    );
  }
  if (typeof receivedStorage.setItem !== 'function') {
    throw new Error(
      `Town save storage setItem must be a function. Received ${describeReceivedValue(receivedStorage.setItem)}.`,
    );
  }

  return receivedStorage as TownStorage;
}

function requireTownSaveSlotNumber(receivedSlot: unknown): TownSaveSlotNumber {
  if (TOWN_SAVE_SLOT_NUMBERS.some((slotNumber) => slotNumber === receivedSlot)) {
    return receivedSlot as TownSaveSlotNumber;
  }

  throw new Error(
    `Town save slot must be an integer from 1 to ${TOWN_SAVE_SLOT_COUNT}. Received ${describeReceivedValue(receivedSlot)}.`,
  );
}

function requireExactKeys(record: Record<string, unknown>, expectedKeys: readonly string[], valueLabel: string): void {
  const receivedKeys = Object.keys(record).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  const matches =
    receivedKeys.length === sortedExpectedKeys.length &&
    receivedKeys.every((key, index) => key === sortedExpectedKeys[index]);

  if (!matches) {
    throw new Error(
      `${valueLabel} must contain exactly ${sortedExpectedKeys.join(', ')}. Received ${describeReceivedValue(record)}.`,
    );
  }
}

function requireNonEmptyString(value: unknown, valueLabel: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${valueLabel} must be a non-empty string. Received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function requireSavedAt(value: unknown, slotNumber: TownSaveSlotNumber): string {
  const savedAt = requireNonEmptyString(value, `Town save slot ${slotNumber} savedAt`);
  if (!Number.isFinite(Date.parse(savedAt))) {
    throw new Error(`Town save slot ${slotNumber} savedAt must be a valid date. Received ${JSON.stringify(savedAt)}.`);
  }

  return savedAt;
}

function cloneTownObject(townObject: TownObject): TownObject {
  return { ...townObject };
}

function cloneTownLayer(townLayer: TownLayer): TownLayer {
  return {
    id: townLayer.id,
    visible: townLayer.visible,
    objects: townLayer.objects.map(cloneTownObject),
  };
}

function cloneTownDocument(townDocument: TownDocument): TownDocument {
  return {
    version: townDocument.version,
    width: townDocument.width,
    height: townDocument.height,
    backgroundColor: townDocument.backgroundColor,
    backgroundImageUrl: townDocument.backgroundImageUrl,
    activeLayer: townDocument.activeLayer,
    layers: townDocument.layers.map(cloneTownLayer),
  };
}

function cloneTownStoredSlot(storedSlot: TownStoredSlot): TownStoredSlot {
  return {
    document: cloneTownDocument(storedSlot.document),
    savedAt: storedSlot.savedAt,
  };
}

function cloneTownSaveSlots(slots: TownSaveSlotArray): TownSaveSlotArray {
  return slots.map((slot) => (slot === null ? null : cloneTownStoredSlot(slot)));
}

function getUtf8ByteLength(value: string): number {
  if (typeof TextEncoder !== 'function') {
    throw new Error('Town save storage requires TextEncoder. Received undefined.');
  }

  return new TextEncoder().encode(value).byteLength;
}

function readRawTownSaveSlots(storage: TownStorage): string | null {
  let rawSlots: string | null;
  try {
    rawSlots = storage.getItem(TOWN_SAVE_STORAGE_KEY);
  } catch (readFailure: unknown) {
    throw new Error(
      `Town save storage getItem failed for key ${JSON.stringify(TOWN_SAVE_STORAGE_KEY)}. Received ${stringifyFailureReason(readFailure)}.`,
      { cause: readFailure },
    );
  }

  if (rawSlots === null) return null;
  if (typeof rawSlots !== 'string') {
    throw new Error(`Town save storage getItem returned an invalid value. Received ${describeReceivedValue(rawSlots)}.`);
  }

  getUtf8ByteLength(rawSlots);
  return rawSlots;
}

function parseTownSaveSlots(rawSlots: string): TownSaveSlotArray {
  let parsedSlots: unknown;
  try {
    parsedSlots = JSON.parse(rawSlots) as unknown;
  } catch (parseFailure: unknown) {
    if (parseFailure instanceof SyntaxError) {
      throw new Error(
        `Town save storage contains invalid JSON. Received ${JSON.stringify(rawSlots.slice(0, 160))}.`,
        { cause: parseFailure },
      );
    }

    throw parseFailure;
  }

  if (!Array.isArray(parsedSlots) || parsedSlots.length !== TOWN_SAVE_SLOT_COUNT) {
    throw new Error(
      `Town save storage must contain exactly ${TOWN_SAVE_SLOT_COUNT} slots. Received ${describeReceivedValue(parsedSlots)}.`,
    );
  }

  return parsedSlots.map((receivedSlot, slotIndex) => {
    const slotNumber = requireTownSaveSlotNumber(slotIndex + 1);
    if (receivedSlot === null) return null;
    if (!isPlainRecord(receivedSlot)) {
      throw new Error(
        `Town save slot ${slotNumber} must be null or a save record. Received ${describeReceivedValue(receivedSlot)}.`,
      );
    }

    requireExactKeys(receivedSlot, TOWN_SAVE_ENTRY_KEYS, `Town save slot ${slotNumber}`);
    return {
      document: validateTownDocument(receivedSlot.document),
      savedAt: requireSavedAt(receivedSlot.savedAt, slotNumber),
    };
  });
}

function readTownSaveSlotArray(storage: TownStorage): TownSaveSlotArray {
  const rawSlots = readRawTownSaveSlots(storage);
  if (rawSlots === null) {
    return Array.from({ length: TOWN_SAVE_SLOT_COUNT }, () => null);
  }

  return parseTownSaveSlots(rawSlots);
}

function serializeTownSaveSlots(slots: TownSaveSlotArray): string {
  const serializedSlots = JSON.stringify(slots);
  if (typeof serializedSlots !== 'string') {
    throw new Error(`Town save slots could not be serialized. Received ${describeReceivedValue(slots)}.`);
  }

  getUtf8ByteLength(serializedSlots);
  return serializedSlots;
}

function writeTownSaveSlotArray(storage: TownStorage, slots: TownSaveSlotArray, slotNumber: TownSaveSlotNumber): void {
  const serializedSlots = serializeTownSaveSlots(slots);
  try {
    storage.setItem(TOWN_SAVE_STORAGE_KEY, serializedSlots);
  } catch (writeFailure: unknown) {
    throw new Error(
      `Town save storage setItem failed for key ${JSON.stringify(TOWN_SAVE_STORAGE_KEY)} and slot ${slotNumber}. Received ${stringifyFailureReason(writeFailure)}.`,
      { cause: writeFailure },
    );
  }
}

export function serializeTownDocument(document: TownDocument): string {
  const validatedDocument = validateTownDocument(document);
  const serializedDocument = JSON.stringify(validatedDocument, null, 2);
  if (typeof serializedDocument !== 'string') {
    throw new Error(`Town document could not be serialized. Received ${describeReceivedValue(validatedDocument)}.`);
  }

  return `${serializedDocument}\n`;
}

export function parseTownDocument(serializedDocument: string): TownDocument {
  if (typeof serializedDocument !== 'string') {
    throw new Error(`Town project file must be a string. Received ${describeReceivedValue(serializedDocument)}.`);
  }

  let parsedDocument: unknown;
  try {
    parsedDocument = JSON.parse(serializedDocument) as unknown;
  } catch (parseFailure: unknown) {
    if (parseFailure instanceof SyntaxError) {
      throw new Error(
        `Town project file contains invalid JSON. Received ${JSON.stringify(serializedDocument.slice(0, 160))}.`,
        { cause: parseFailure },
      );
    }

    throw parseFailure;
  }

  return validateTownDocument(parsedDocument);
}

export function readTownSaveSlots(storage: TownStorage): Array<TownStoredSlot | null> {
  const validatedStorage = requireTownStorage(storage);
  return cloneTownSaveSlots(readTownSaveSlotArray(validatedStorage));
}

export function saveTownSlot(
  storage: TownStorage,
  slotNumber: number,
  document: TownDocument,
): Array<TownStoredSlot | null> {
  const validatedStorage = requireTownStorage(storage);
  const validatedSlotNumber = requireTownSaveSlotNumber(slotNumber);
  const validatedDocument = validateTownDocument(document);
  const slots = readTownSaveSlotArray(validatedStorage);
  slots[validatedSlotNumber - 1] = {
    document: cloneTownDocument(validatedDocument),
    savedAt: new Date().toISOString(),
  };
  writeTownSaveSlotArray(validatedStorage, slots, validatedSlotNumber);
  return cloneTownSaveSlots(slots);
}

export function loadTownSlot(storage: TownStorage, slotNumber: number): TownDocument | null {
  const validatedStorage = requireTownStorage(storage);
  const validatedSlotNumber = requireTownSaveSlotNumber(slotNumber);
  const slots = readTownSaveSlotArray(validatedStorage);
  const slot = slots[validatedSlotNumber - 1];
  if (slot === null) return null;
  return cloneTownDocument(slot.document);
}
