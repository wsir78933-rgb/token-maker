import {
  requireWeaponSelection,
  type WeaponSelection,
} from '@/lib/weapon-creator/selection';

export const WEAPON_SAVE_STORAGE_KEY = 'tokenmaker.weapon-creator.saves';

const WEAPON_SAVE_SLOT_COUNT = 4;
const WEAPON_SAVE_SLOT_NUMBERS = [1, 2, 3, 4] as const;
const WEAPON_SAVE_THUMBNAIL_PREFIX = 'data:image/png;base64,';
const STORED_WEAPON_SAVE_PREVIEW_LENGTH = 80;

export type WeaponSaveSlotNumber = (typeof WEAPON_SAVE_SLOT_NUMBERS)[number];

export type WeaponSaveRecord = {
  snapshot: WeaponSelection;
  thumbnailDataUrl: string;
};

export type WeaponSaveStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

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
    if (typeof serialized === 'string') {
      return serialized;
    }

    return Object.prototype.toString.call(value);
  } catch (error: unknown) {
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${stringifyFailureReason(error)}).`;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isWeaponSaveSlotNumber(value: unknown): value is WeaponSaveSlotNumber {
  return WEAPON_SAVE_SLOT_NUMBERS.some((slotNumber) => slotNumber === value);
}

export function requireWeaponSaveSlotNumber(value: unknown): WeaponSaveSlotNumber {
  if (isWeaponSaveSlotNumber(value)) {
    return value;
  }

  throw new Error(
    `Weapon save slot must be an integer from 1 to 4. Received ${describeReceivedValue(value)}.`,
  );
}

function requireWeaponSaveStorage(storage: unknown): WeaponSaveStorage {
  if (!isPlainObject(storage)) {
    throw new Error(
      `Weapon save storage must be an object. Received ${describeReceivedValue(storage)}.`,
    );
  }

  if (typeof storage.getItem !== 'function') {
    throw new Error(
      `Weapon save storage getItem must be a function. Received ${describeReceivedValue(storage.getItem)}.`,
    );
  }

  if (typeof storage.setItem !== 'function') {
    throw new Error(
      `Weapon save storage setItem must be a function. Received ${describeReceivedValue(storage.setItem)}.`,
    );
  }

  return storage as WeaponSaveStorage;
}

function emptyWeaponSaveSlots(): Array<WeaponSaveRecord | null> {
  return [null, null, null, null];
}

function invalidStoredWeaponJsonSyntaxMessage(slotNumber: WeaponSaveSlotNumber, raw: string): string {
  const preview = raw.slice(0, STORED_WEAPON_SAVE_PREVIEW_LENGTH);
  return `Weapon save slot ${slotNumber} has invalid JSON syntax. Received ${JSON.stringify(preview)}.`;
}

function invalidStoredWeaponArrayMessage(
  slotNumber: WeaponSaveSlotNumber,
  receivedValue: unknown,
): string {
  return `Weapon save slot ${slotNumber} has an invalid save array. Received ${describeReceivedValue(receivedValue)}.`;
}

function invalidStoredWeaponRecordMessage(
  slotNumber: WeaponSaveSlotNumber,
  receivedValue: unknown,
): string {
  return `Weapon save slot ${slotNumber} has an invalid save record. Received ${describeReceivedValue(receivedValue)}.`;
}

function parseWeaponSaveJson(raw: string, slotNumber: WeaponSaveSlotNumber): unknown {
  try {
    return JSON.parse(raw);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(invalidStoredWeaponJsonSyntaxMessage(slotNumber, raw));
    }

    throw error;
  }
}

function requireWeaponSaveEntries(
  parsed: unknown,
  slotNumber: WeaponSaveSlotNumber,
): unknown[] {
  if (!Array.isArray(parsed) || parsed.length !== WEAPON_SAVE_SLOT_COUNT) {
    throw new Error(invalidStoredWeaponArrayMessage(slotNumber, parsed));
  }

  return parsed;
}

function requireWeaponSaveSnapshot(
  slotNumber: WeaponSaveSlotNumber,
  snapshot: unknown,
): WeaponSelection {
  try {
    return requireWeaponSelection(snapshot);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Weapon save slot ${slotNumber} snapshot is invalid: ${error.message}`);
    }

    throw error;
  }
}

function receivedThumbnailStart(thumbnailDataUrl: unknown): string {
  if (typeof thumbnailDataUrl !== 'string') {
    return describeReceivedValue(thumbnailDataUrl);
  }

  return JSON.stringify(thumbnailDataUrl.slice(0, WEAPON_SAVE_THUMBNAIL_PREFIX.length));
}

function requireThumbnailDataUrl(
  slotNumber: WeaponSaveSlotNumber,
  thumbnailDataUrl: unknown,
): string {
  if (typeof thumbnailDataUrl === 'string' && thumbnailDataUrl.startsWith(WEAPON_SAVE_THUMBNAIL_PREFIX)) {
    return thumbnailDataUrl;
  }

  throw new Error(
    `Weapon save slot ${slotNumber} thumbnail must start with ${JSON.stringify(WEAPON_SAVE_THUMBNAIL_PREFIX)}. Received ${receivedThumbnailStart(thumbnailDataUrl)}.`,
  );
}

function readStoredWeaponSaveEntry(
  entry: unknown,
  slotNumber: WeaponSaveSlotNumber,
): WeaponSaveRecord | null {
  if (entry === null) {
    return null;
  }

  if (!isPlainObject(entry)) {
    throw new Error(invalidStoredWeaponRecordMessage(slotNumber, entry));
  }

  if (!Object.prototype.hasOwnProperty.call(entry, 'snapshot') ||
      !Object.prototype.hasOwnProperty.call(entry, 'thumbnailDataUrl')) {
    throw new Error(invalidStoredWeaponRecordMessage(slotNumber, entry));
  }

  return {
    snapshot: requireWeaponSaveSnapshot(slotNumber, entry.snapshot),
    thumbnailDataUrl: requireThumbnailDataUrl(slotNumber, entry.thumbnailDataUrl),
  };
}

function readRawWeaponSaves(storage: WeaponSaveStorage, slotNumber: WeaponSaveSlotNumber): string | null {
  const raw = storage.getItem(WEAPON_SAVE_STORAGE_KEY);
  if (raw === null) {
    return null;
  }

  if (typeof raw !== 'string') {
    throw new Error(
      `Weapon save slot ${slotNumber} has an invalid stored save value. Received ${describeReceivedValue(raw)}.`,
    );
  }

  return raw;
}

function readWeaponSaveSlots(
  storage: WeaponSaveStorage,
  slotNumber: WeaponSaveSlotNumber,
): Array<WeaponSaveRecord | null> {
  const raw = readRawWeaponSaves(storage, slotNumber);
  if (raw === null) {
    return emptyWeaponSaveSlots();
  }

  const entries = requireWeaponSaveEntries(parseWeaponSaveJson(raw, slotNumber), slotNumber);
  return entries.map((entry, index) => {
    return readStoredWeaponSaveEntry(entry, requireWeaponSaveSlotNumber(index + 1));
  });
}

function readWeaponSaveSlotRecord(
  slots: Array<WeaponSaveRecord | null>,
  slotNumber: WeaponSaveSlotNumber,
): WeaponSaveRecord | null {
  const record = slots[slotNumber - 1];
  if (record === undefined) {
    throw new Error(`Weapon save slot ${slotNumber} is missing from the save array.`);
  }

  return record;
}

export function readWeaponSaveSlot(
  storage: WeaponSaveStorage,
  slot: number,
): WeaponSaveRecord | null {
  const validStorage = requireWeaponSaveStorage(storage);
  const slotNumber = requireWeaponSaveSlotNumber(slot);
  return readWeaponSaveSlotRecord(readWeaponSaveSlots(validStorage, slotNumber), slotNumber);
}

function requireWeaponSaveRecord(
  slotNumber: WeaponSaveSlotNumber,
  record: unknown,
): WeaponSaveRecord {
  if (!isPlainObject(record)) {
    throw new Error(
      `Weapon save slot ${slotNumber} record must be an object. Received ${describeReceivedValue(record)}.`,
    );
  }

  if (!Object.prototype.hasOwnProperty.call(record, 'snapshot')) {
    throw new Error(`Weapon save slot ${slotNumber} record is missing snapshot. Received undefined.`);
  }

  if (!Object.prototype.hasOwnProperty.call(record, 'thumbnailDataUrl')) {
    throw new Error(`Weapon save slot ${slotNumber} record is missing thumbnailDataUrl. Received undefined.`);
  }

  return {
    snapshot: requireWeaponSaveSnapshot(slotNumber, record.snapshot),
    thumbnailDataUrl: requireThumbnailDataUrl(slotNumber, record.thumbnailDataUrl),
  };
}

function replaceWeaponSaveSlot(
  slots: Array<WeaponSaveRecord | null>,
  slotNumber: WeaponSaveSlotNumber,
  record: WeaponSaveRecord,
): Array<WeaponSaveRecord | null> {
  const nextSlots = slots.slice();
  nextSlots[slotNumber - 1] = record;
  return nextSlots;
}

function storeWeaponSaveSlots(
  storage: WeaponSaveStorage,
  slots: Array<WeaponSaveRecord | null>,
): void {
  storage.setItem(WEAPON_SAVE_STORAGE_KEY, JSON.stringify(slots));
}

export function writeWeaponSaveSlot(
  storage: WeaponSaveStorage,
  slot: number,
  record: WeaponSaveRecord,
): void {
  const validStorage = requireWeaponSaveStorage(storage);
  const slotNumber = requireWeaponSaveSlotNumber(slot);
  const validRecord = requireWeaponSaveRecord(slotNumber, record);
  const slots = readWeaponSaveSlots(validStorage, slotNumber);
  storeWeaponSaveSlots(validStorage, replaceWeaponSaveSlot(slots, slotNumber, validRecord));
}
