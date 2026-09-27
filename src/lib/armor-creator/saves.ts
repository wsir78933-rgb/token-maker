import { type ArmorSelection } from '@/lib/armor-creator/selection';

export const ARMOR_SAVE_STORAGE_KEY = 'tokenmaker.armor-creator.saves';

const ARMOR_SAVE_SLOT_COUNT = 4;
const ARMOR_SAVE_SLOT_NUMBERS = [1, 2, 3, 4] as const;
const ARMOR_SAVE_THUMBNAIL_PREFIX = 'data:image/png;base64,';
const STORED_ARMOR_SAVE_PREVIEW_LENGTH = 80;

export type ArmorSaveSlotNumber = (typeof ARMOR_SAVE_SLOT_NUMBERS)[number];

export type ArmorSaveStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export type ArmorSaveRecord = {
  snapshot: ArmorSelection;
  thumbnailDataUrl: string;
};

function stringifyFailureReason(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.length > 0) {
      return error.message;
    }

    return `${error.name} with empty message`;
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

function describeJsonReceivedValue(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    const returned = json === undefined ? 'undefined' : String(json);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: returned ${returned}).`;
  } catch (error: unknown) {
    const reason = stringifyFailureReason(error);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
  }
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

  return describeJsonReceivedValue(value);
}

function isArmorSaveSlotNumber(value: unknown): value is ArmorSaveSlotNumber {
  return ARMOR_SAVE_SLOT_NUMBERS.some((slotNumber) => slotNumber === value);
}

export function requireArmorSaveSlotNumber(value: unknown): ArmorSaveSlotNumber {
  if (isArmorSaveSlotNumber(value)) {
    return value;
  }

  throw new Error(
    `Armor save slot must be an integer from 1 to 4. Received ${describeReceivedValue(value)}.`,
  );
}

function requireArmorSaveStorage(storage: ArmorSaveStorage): ArmorSaveStorage {
  if (storage === null || typeof storage !== 'object' || Array.isArray(storage)) {
    throw new Error(`Armor save storage must be an object. Received ${describeReceivedValue(storage)}.`);
  }

  const candidate = storage as { getItem?: unknown; setItem?: unknown };

  if (typeof candidate.getItem !== 'function') {
    throw new Error(
      `Armor save storage getItem must be a function. Received ${describeReceivedValue(candidate.getItem)}.`,
    );
  }

  if (typeof candidate.setItem !== 'function') {
    throw new Error(
      `Armor save storage setItem must be a function. Received ${describeReceivedValue(candidate.setItem)}.`,
    );
  }

  return storage;
}

function emptyArmorSaveSlots(): Array<ArmorSaveRecord | null> {
  return [null, null, null, null];
}

function invalidStoredArmorSavesMessage(slot: ArmorSaveSlotNumber, raw: string): string {
  const preview = raw.slice(0, STORED_ARMOR_SAVE_PREVIEW_LENGTH);
  return `Armor save slot ${slot} has invalid JSON. Received ${JSON.stringify(preview)}.`;
}

function parseArmorSaveJson(raw: string, slot: ArmorSaveSlotNumber): unknown {
  try {
    return JSON.parse(raw);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(invalidStoredArmorSavesMessage(slot, raw));
    }

    throw error;
  }
}

function requireStoredArmorSaveEntries(parsed: unknown, raw: string, slot: ArmorSaveSlotNumber): unknown[] {
  if (!Array.isArray(parsed) || parsed.length !== ARMOR_SAVE_SLOT_COUNT) {
    throw new Error(invalidStoredArmorSavesMessage(slot, raw));
  }

  return parsed;
}

function requireArmorSaveSnapshot(slot: ArmorSaveSlotNumber, snapshot: unknown): ArmorSelection {
  if (snapshot === null || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new Error(
      `Armor save slot ${slot} snapshot is missing gender. Received ${describeReceivedValue(snapshot)}.`,
    );
  }

  const candidate = snapshot as { gender?: unknown; material?: unknown };

  if (candidate.gender === undefined || candidate.gender === null) {
    throw new Error(
      `Armor save slot ${slot} snapshot is missing gender. Received ${describeReceivedValue(candidate.gender)}.`,
    );
  }

  if (candidate.material === undefined || candidate.material === null) {
    throw new Error(
      `Armor save slot ${slot} snapshot is missing material. Received ${describeReceivedValue(candidate.material)}.`,
    );
  }

  return snapshot as ArmorSelection;
}

function receivedThumbnailStart(thumbnailDataUrl: unknown): string {
  if (typeof thumbnailDataUrl !== 'string') {
    return describeReceivedValue(thumbnailDataUrl);
  }

  return JSON.stringify(thumbnailDataUrl.slice(0, ARMOR_SAVE_THUMBNAIL_PREFIX.length));
}

function requireThumbnailDataUrl(slot: ArmorSaveSlotNumber, thumbnailDataUrl: unknown): string {
  if (typeof thumbnailDataUrl === 'string' && thumbnailDataUrl.startsWith(ARMOR_SAVE_THUMBNAIL_PREFIX)) {
    return thumbnailDataUrl;
  }

  throw new Error(
    `Armor save slot ${slot} thumbnail must start with ${JSON.stringify(ARMOR_SAVE_THUMBNAIL_PREFIX)}. Received ${receivedThumbnailStart(thumbnailDataUrl)}.`,
  );
}

function readStoredArmorSaveEntry(
  entry: unknown,
  slot: ArmorSaveSlotNumber,
  raw: string,
): ArmorSaveRecord | null {
  if (entry === null) {
    return null;
  }

  if (typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error(invalidStoredArmorSavesMessage(slot, raw));
  }

  const candidate = entry as { snapshot?: unknown; thumbnailDataUrl?: unknown };

  if (candidate.snapshot === undefined || candidate.thumbnailDataUrl === undefined) {
    throw new Error(invalidStoredArmorSavesMessage(slot, raw));
  }

  return {
    snapshot: requireArmorSaveSnapshot(slot, candidate.snapshot),
    thumbnailDataUrl: requireThumbnailDataUrl(slot, candidate.thumbnailDataUrl),
  };
}

function readRawArmorSaves(storage: ArmorSaveStorage, slot: ArmorSaveSlotNumber): string | null {
  const raw = storage.getItem(ARMOR_SAVE_STORAGE_KEY);

  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw !== 'string') {
    throw new Error(
      `Armor save slot ${slot} has invalid JSON. Received ${describeReceivedValue(raw)}.`,
    );
  }

  return raw;
}

function readArmorSaveSlots(
  storage: ArmorSaveStorage,
  slot: ArmorSaveSlotNumber,
): Array<ArmorSaveRecord | null> {
  const raw = readRawArmorSaves(storage, slot);

  if (raw === null) {
    return emptyArmorSaveSlots();
  }

  const parsed = parseArmorSaveJson(raw, slot);
  const entries = requireStoredArmorSaveEntries(parsed, raw, slot);

  return entries.map((entry, index) => {
    return readStoredArmorSaveEntry(entry, requireArmorSaveSlotNumber(index + 1), raw);
  });
}

function armorSaveSlotRecord(
  slots: Array<ArmorSaveRecord | null>,
  slot: ArmorSaveSlotNumber,
): ArmorSaveRecord | null {
  const record = slots[slot - 1];

  if (record === undefined) {
    throw new Error(`Armor save slot ${slot} is missing from the save array.`);
  }

  return record;
}

export function readArmorSaveSlot(storage: ArmorSaveStorage, slot: number): ArmorSaveRecord | null {
  const armorSaveStorage = requireArmorSaveStorage(storage);
  const slotNumber = requireArmorSaveSlotNumber(slot);
  return armorSaveSlotRecord(readArmorSaveSlots(armorSaveStorage, slotNumber), slotNumber);
}

export function armorSaveSlotIsFilled(storage: ArmorSaveStorage, slot: number): boolean {
  return readArmorSaveSlot(storage, slot) !== null;
}

function requireArmorSaveRecord(slot: ArmorSaveSlotNumber, record: ArmorSaveRecord): ArmorSaveRecord {
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error(`Armor save slot ${slot} record must be an object. Received ${describeReceivedValue(record)}.`);
  }

  const candidate = record as { snapshot?: unknown; thumbnailDataUrl?: unknown };

  return {
    snapshot: requireArmorSaveSnapshot(slot, candidate.snapshot),
    thumbnailDataUrl: requireThumbnailDataUrl(slot, candidate.thumbnailDataUrl),
  };
}

function replaceArmorSaveSlot(
  slots: Array<ArmorSaveRecord | null>,
  slot: ArmorSaveSlotNumber,
  record: ArmorSaveRecord,
): Array<ArmorSaveRecord | null> {
  const nextSlots = slots.slice();
  nextSlots[slot - 1] = record;
  return nextSlots;
}

function storeArmorSaveSlots(storage: ArmorSaveStorage, slots: Array<ArmorSaveRecord | null>): void {
  storage.setItem(ARMOR_SAVE_STORAGE_KEY, JSON.stringify(slots));
}

export function writeArmorSaveSlot(
  storage: ArmorSaveStorage,
  slot: number,
  record: ArmorSaveRecord,
): void {
  const armorSaveStorage = requireArmorSaveStorage(storage);
  const slotNumber = requireArmorSaveSlotNumber(slot);
  const armorSaveRecord = requireArmorSaveRecord(slotNumber, record);
  const slots = readArmorSaveSlots(armorSaveStorage, slotNumber);
  storeArmorSaveSlots(armorSaveStorage, replaceArmorSaveSlot(slots, slotNumber, armorSaveRecord));
}
