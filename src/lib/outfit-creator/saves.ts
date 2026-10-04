import {
  requireOutfitGender,
  requireOutfitPieceId,
  requireOutfitSlot,
  pieceSlot,
  type OutfitGender,
  type OutfitSlot,
} from '@/lib/outfit-creator/catalog';
import type { OutfitSelection } from '@/lib/outfit-creator/selection';

export const OUTFIT_SAVE_STORAGE_KEY = 'tokenmaker.outfit-creator.saves';

const OUTFIT_SAVE_SLOT_COUNT = 4;
const OUTFIT_SAVE_SLOT_NUMBERS = [1, 2, 3, 4] as const;
const OUTFIT_SAVE_THUMBNAIL_PREFIX = 'data:image/png;base64,';
const STORED_OUTFIT_SAVE_PREVIEW_LENGTH = 80;

export type OutfitSaveSlotNumber = (typeof OUTFIT_SAVE_SLOT_NUMBERS)[number];

export type OutfitSaveStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export type OutfitSaveRecord = {
  snapshot: OutfitSelection;
  thumbnailDataUrl: string;
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

function isOutfitSaveSlotNumber(value: unknown): value is OutfitSaveSlotNumber {
  return OUTFIT_SAVE_SLOT_NUMBERS.some((slotNumber) => slotNumber === value);
}

export function requireOutfitSaveSlotNumber(value: unknown): OutfitSaveSlotNumber {
  if (isOutfitSaveSlotNumber(value)) {
    return value;
  }

  throw new Error(
    `Outfit save slot must be an integer from 1 to 4. Received ${describeReceivedValue(value)}.`,
  );
}

function requireOutfitSaveStorage(storage: unknown): OutfitSaveStorage {
  if (!isPlainObject(storage)) {
    throw new Error(
      `Outfit save storage must be an object. Received ${describeReceivedValue(storage)}.`,
    );
  }

  if (typeof storage.getItem !== 'function') {
    throw new Error(
      `Outfit save storage getItem must be a function. Received ${describeReceivedValue(storage.getItem)}.`,
    );
  }

  if (typeof storage.setItem !== 'function') {
    throw new Error(
      `Outfit save storage setItem must be a function. Received ${describeReceivedValue(storage.setItem)}.`,
    );
  }

  return storage as OutfitSaveStorage;
}

function emptyOutfitSaveSlots(): Array<OutfitSaveRecord | null> {
  return [null, null, null, null];
}

function invalidStoredOutfitJsonSyntaxMessage(slot: OutfitSaveSlotNumber, raw: string): string {
  const preview = raw.slice(0, STORED_OUTFIT_SAVE_PREVIEW_LENGTH);
  return `Outfit save slot ${slot} has invalid JSON syntax. Received ${JSON.stringify(preview)}.`;
}

function invalidStoredOutfitArrayMessage(
  slot: OutfitSaveSlotNumber,
  receivedValue: unknown,
): string {
  return `Outfit save slot ${slot} has an invalid save array. Received ${describeReceivedValue(receivedValue)}.`;
}

function invalidStoredOutfitRecordMessage(
  slot: OutfitSaveSlotNumber,
  receivedValue: unknown,
): string {
  return `Outfit save slot ${slot} has an invalid save record. Received ${describeReceivedValue(receivedValue)}.`;
}

function parseOutfitSaveJson(raw: string, slot: OutfitSaveSlotNumber): unknown {
  try {
    return JSON.parse(raw);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(invalidStoredOutfitJsonSyntaxMessage(slot, raw));
    }

    throw error;
  }
}

function requireOutfitSaveEntries(
  parsed: unknown,
  slot: OutfitSaveSlotNumber,
): unknown[] {
  if (!Array.isArray(parsed) || parsed.length !== OUTFIT_SAVE_SLOT_COUNT) {
    throw new Error(invalidStoredOutfitArrayMessage(slot, parsed));
  }

  return parsed;
}

function requireOutfitEquippedPieceIds(
  slotNumber: OutfitSaveSlotNumber,
  value: unknown,
): Partial<Record<OutfitSlot, string>> {
  if (!isPlainObject(value)) {
    throw new Error(
      `Outfit save slot ${slotNumber} snapshot equippedPieceIds must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  const equippedPieceIds: Partial<Record<OutfitSlot, string>> = {};
  for (const slotKey of Object.keys(value)) {
    let slot: OutfitSlot;
    try {
      slot = requireOutfitSlot(slotKey);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      throw new Error(`Outfit save slot ${slotNumber} snapshot has invalid slot ${JSON.stringify(slotKey)}: ${detail}`);
    }

    const receivedPieceId = value[slotKey];
    let pieceId: string;
    try {
      pieceId = requireOutfitPieceId(receivedPieceId);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      throw new Error(`Outfit save slot ${slotNumber} snapshot has invalid piece for ${JSON.stringify(slot)}: ${detail}`);
    }

    const ownerSlot = pieceSlot(pieceId);
    if (ownerSlot !== slot) {
      throw new Error(
        `Outfit save slot ${slotNumber} snapshot piece ${JSON.stringify(pieceId)} belongs to ${JSON.stringify(ownerSlot)}, not ${JSON.stringify(slot)}.`,
      );
    }

    equippedPieceIds[slot] = pieceId;
  }

  return equippedPieceIds;
}

function requireOutfitSaveSnapshot(
  slotNumber: OutfitSaveSlotNumber,
  snapshot: unknown,
): OutfitSelection {
  if (!isPlainObject(snapshot)) {
    throw new Error(
      `Outfit save slot ${slotNumber} snapshot must be an object. Received ${describeReceivedValue(snapshot)}.`,
    );
  }

  let gender: OutfitGender;
  try {
    gender = requireOutfitGender(snapshot.gender);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : describeReceivedValue(error);
    throw new Error(`Outfit save slot ${slotNumber} snapshot gender is invalid: ${detail}`);
  }

  return {
    gender,
    equippedPieceIds: requireOutfitEquippedPieceIds(slotNumber, snapshot.equippedPieceIds),
  };
}

function receivedThumbnailStart(thumbnailDataUrl: unknown): string {
  if (typeof thumbnailDataUrl !== 'string') {
    return describeReceivedValue(thumbnailDataUrl);
  }

  return JSON.stringify(thumbnailDataUrl.slice(0, OUTFIT_SAVE_THUMBNAIL_PREFIX.length));
}

function requireThumbnailDataUrl(
  slotNumber: OutfitSaveSlotNumber,
  thumbnailDataUrl: unknown,
): string {
  if (typeof thumbnailDataUrl === 'string' && thumbnailDataUrl.startsWith(OUTFIT_SAVE_THUMBNAIL_PREFIX)) {
    return thumbnailDataUrl;
  }

  throw new Error(
    `Outfit save slot ${slotNumber} thumbnail must start with ${JSON.stringify(OUTFIT_SAVE_THUMBNAIL_PREFIX)}. Received ${receivedThumbnailStart(thumbnailDataUrl)}.`,
  );
}

function readStoredOutfitSaveEntry(
  entry: unknown,
  slotNumber: OutfitSaveSlotNumber,
): OutfitSaveRecord | null {
  if (entry === null) {
    return null;
  }

  if (!isPlainObject(entry)) {
    throw new Error(invalidStoredOutfitRecordMessage(slotNumber, entry));
  }

  if (!Object.prototype.hasOwnProperty.call(entry, 'snapshot') ||
      !Object.prototype.hasOwnProperty.call(entry, 'thumbnailDataUrl')) {
    throw new Error(invalidStoredOutfitRecordMessage(slotNumber, entry));
  }

  return {
    snapshot: requireOutfitSaveSnapshot(slotNumber, entry.snapshot),
    thumbnailDataUrl: requireThumbnailDataUrl(slotNumber, entry.thumbnailDataUrl),
  };
}

function readRawOutfitSaves(storage: OutfitSaveStorage, slotNumber: OutfitSaveSlotNumber): string | null {
  const raw = storage.getItem(OUTFIT_SAVE_STORAGE_KEY);
  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw !== 'string') {
    throw new Error(
      `Outfit save slot ${slotNumber} has an invalid stored save value. Received ${describeReceivedValue(raw)}.`,
    );
  }

  return raw;
}

function readOutfitSaveSlots(
  storage: OutfitSaveStorage,
  slotNumber: OutfitSaveSlotNumber,
): Array<OutfitSaveRecord | null> {
  const raw = readRawOutfitSaves(storage, slotNumber);
  if (raw === null) {
    return emptyOutfitSaveSlots();
  }

  const entries = requireOutfitSaveEntries(parseOutfitSaveJson(raw, slotNumber), slotNumber);
  return entries.map((entry, index) => {
    return readStoredOutfitSaveEntry(entry, requireOutfitSaveSlotNumber(index + 1));
  });
}

function readOutfitSaveSlotRecord(
  slots: Array<OutfitSaveRecord | null>,
  slotNumber: OutfitSaveSlotNumber,
): OutfitSaveRecord | null {
  const record = slots[slotNumber - 1];
  if (record === undefined) {
    throw new Error(`Outfit save slot ${slotNumber} is missing from the save array.`);
  }

  return record;
}

export function readOutfitSaveSlot(
  storage: OutfitSaveStorage,
  slot: number,
): OutfitSaveRecord | null {
  const validStorage = requireOutfitSaveStorage(storage);
  const slotNumber = requireOutfitSaveSlotNumber(slot);
  return readOutfitSaveSlotRecord(readOutfitSaveSlots(validStorage, slotNumber), slotNumber);
}

export function outfitSaveSlotIsFilled(storage: OutfitSaveStorage, slot: number): boolean {
  return readOutfitSaveSlot(storage, slot) !== null;
}

function requireOutfitSaveRecord(
  slotNumber: OutfitSaveSlotNumber,
  record: OutfitSaveRecord,
): OutfitSaveRecord {
  if (!isPlainObject(record)) {
    throw new Error(
      `Outfit save slot ${slotNumber} record must be an object. Received ${describeReceivedValue(record)}.`,
    );
  }

  if (!Object.prototype.hasOwnProperty.call(record, 'snapshot')) {
    throw new Error(`Outfit save slot ${slotNumber} record is missing snapshot. Received undefined.`);
  }

  if (!Object.prototype.hasOwnProperty.call(record, 'thumbnailDataUrl')) {
    throw new Error(`Outfit save slot ${slotNumber} record is missing thumbnailDataUrl. Received undefined.`);
  }

  return {
    snapshot: requireOutfitSaveSnapshot(slotNumber, record.snapshot),
    thumbnailDataUrl: requireThumbnailDataUrl(slotNumber, record.thumbnailDataUrl),
  };
}

function replaceOutfitSaveSlot(
  slots: Array<OutfitSaveRecord | null>,
  slotNumber: OutfitSaveSlotNumber,
  record: OutfitSaveRecord,
): Array<OutfitSaveRecord | null> {
  const nextSlots = slots.slice();
  nextSlots[slotNumber - 1] = record;
  return nextSlots;
}

function storeOutfitSaveSlots(
  storage: OutfitSaveStorage,
  slots: Array<OutfitSaveRecord | null>,
): void {
  storage.setItem(OUTFIT_SAVE_STORAGE_KEY, JSON.stringify(slots));
}

export function writeOutfitSaveSlot(
  storage: OutfitSaveStorage,
  slot: number,
  record: OutfitSaveRecord,
): void {
  const validStorage = requireOutfitSaveStorage(storage);
  const slotNumber = requireOutfitSaveSlotNumber(slot);
  const validRecord = requireOutfitSaveRecord(slotNumber, record);
  const slots = readOutfitSaveSlots(validStorage, slotNumber);
  storeOutfitSaveSlots(validStorage, replaceOutfitSaveSlot(slots, slotNumber, validRecord));
}
