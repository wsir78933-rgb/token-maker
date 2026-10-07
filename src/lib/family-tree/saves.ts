import {
  parseFamilyTreeDocument,
  serializeFamilyTreeDocument,
  type FamilyTreeDocument,
} from '@/lib/family-tree/document';
import { FAMILY_TREE_SAVE_SLOT_COUNT } from '@/lib/family-tree/scene';

export const FAMILY_TREE_SAVE_STORAGE_KEY = 'tokenmaker.family-tree.saves';

const FAMILY_TREE_SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5] as const;

export type FamilyTreeSaveSlotNumber = (typeof FAMILY_TREE_SAVE_SLOT_NUMBERS)[number];

export type FamilyTreeSaveStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export type FamilyTreeSaveSlots = readonly [
  FamilyTreeDocument | null,
  FamilyTreeDocument | null,
  FamilyTreeDocument | null,
  FamilyTreeDocument | null,
  FamilyTreeDocument | null,
];

type PlainRecord = Record<string, unknown>;

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol' ||
    typeof value === 'function'
  ) {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? String(value) : serialized;
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason})`;
  }
}

function requirePlainRecord(value: unknown, label: string): PlainRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${formatReceivedValue(value)}.`);
  }

  return value as PlainRecord;
}

function requireFamilyTreeSaveStorage(value: unknown): FamilyTreeSaveStorage {
  const record = requirePlainRecord(value, 'Family tree save storage');

  if (typeof record.getItem !== 'function') {
    throw new Error(
      `Family tree save storage getItem must be a function, received ${formatReceivedValue(record.getItem)}.`,
    );
  }

  if (typeof record.setItem !== 'function') {
    throw new Error(
      `Family tree save storage setItem must be a function, received ${formatReceivedValue(record.setItem)}.`,
    );
  }

  return record as FamilyTreeSaveStorage;
}

function requireSaveSlotNumber(value: unknown): FamilyTreeSaveSlotNumber {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    FAMILY_TREE_SAVE_SLOT_NUMBERS.includes(value as FamilyTreeSaveSlotNumber)
  ) {
    return value as FamilyTreeSaveSlotNumber;
  }

  throw new Error(
    `Family tree save slot must be an integer from 1 to ${FAMILY_TREE_SAVE_SLOT_COUNT}, received ${formatReceivedValue(value)}.`,
  );
}

function emptyFamilyTreeSaveSlots(): FamilyTreeSaveSlots {
  return [null, null, null, null, null];
}

function requireStoredText(rawValue: unknown): string | null {
  if (rawValue === null) {
    return null;
  }

  if (typeof rawValue !== 'string') {
    throw new Error(
      `Family tree save storage value for key ${JSON.stringify(FAMILY_TREE_SAVE_STORAGE_KEY)} must be a string or null, received ${formatReceivedValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function parseStoredSlots(serializedSlots: string): FamilyTreeSaveSlots {
  let parsedSlots: unknown;
  try {
    parsedSlots = JSON.parse(serializedSlots) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Family tree save storage contains invalid JSON syntax. Received ${JSON.stringify(serializedSlots.slice(0, 160))}.`,
        { cause: error },
      );
    }

    throw error;
  }

  if (!Array.isArray(parsedSlots) || parsedSlots.length !== FAMILY_TREE_SAVE_SLOT_COUNT) {
    const received = Array.isArray(parsedSlots) ? parsedSlots.length : parsedSlots;
    throw new Error(
      `Family tree save storage must contain ${FAMILY_TREE_SAVE_SLOT_COUNT} slots, received ${formatReceivedValue(received)}.`,
    );
  }

  const slots = parsedSlots.map((slotValue, index) => {
    const slotNumber = (index + 1) as FamilyTreeSaveSlotNumber;
    if (slotValue === null) {
      return null;
    }

    if (typeof slotValue !== 'object' || slotValue === null || Array.isArray(slotValue)) {
      throw new Error(
        `Family tree save slot ${slotNumber} must be a document or null, received ${formatReceivedValue(slotValue)}.`,
      );
    }

    try {
      return parseFamilyTreeDocument(JSON.stringify(slotValue));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Family tree save slot ${slotNumber} is invalid. ${error.message}`,
          { cause: error },
        );
      }

      throw error;
    }
  });

  const firstSlot = slots[0];
  const secondSlot = slots[1];
  const thirdSlot = slots[2];
  const fourthSlot = slots[3];
  const fifthSlot = slots[4];

  if (
    firstSlot === undefined ||
    secondSlot === undefined ||
    thirdSlot === undefined ||
    fourthSlot === undefined ||
    fifthSlot === undefined
  ) {
    throw new Error(
      `Family tree save storage must contain ${FAMILY_TREE_SAVE_SLOT_COUNT} slots, received ${slots.length}.`,
    );
  }

  return [firstSlot, secondSlot, thirdSlot, fourthSlot, fifthSlot];
}

function readStoredFamilyTreeSaveSlots(storage: FamilyTreeSaveStorage): FamilyTreeSaveSlots {
  const serializedSlots = requireStoredText(storage.getItem(FAMILY_TREE_SAVE_STORAGE_KEY));
  if (serializedSlots === null) {
    return emptyFamilyTreeSaveSlots();
  }

  return parseStoredSlots(serializedSlots);
}

function replaceFamilyTreeSaveSlot(
  slots: FamilyTreeSaveSlots,
  slot: FamilyTreeSaveSlotNumber,
  document: FamilyTreeDocument,
): FamilyTreeSaveSlots {
  const nextSlots = [...slots] as [
    FamilyTreeDocument | null,
    FamilyTreeDocument | null,
    FamilyTreeDocument | null,
    FamilyTreeDocument | null,
    FamilyTreeDocument | null,
  ];
  nextSlots[slot - 1] = document;
  return nextSlots;
}

function storeFamilyTreeSaveSlots(
  storage: FamilyTreeSaveStorage,
  slots: FamilyTreeSaveSlots,
): void {
  storage.setItem(FAMILY_TREE_SAVE_STORAGE_KEY, JSON.stringify(slots));
}

export function requireFamilyTreeSaveSlotNumber(value: unknown): FamilyTreeSaveSlotNumber {
  return requireSaveSlotNumber(value);
}

export function readFamilyTreeSaveSlots(
  storage: FamilyTreeSaveStorage,
): FamilyTreeSaveSlots {
  return readStoredFamilyTreeSaveSlots(requireFamilyTreeSaveStorage(storage));
}

export function readFamilyTreeSaveSlot(
  storage: FamilyTreeSaveStorage,
  slot: number,
): FamilyTreeDocument | null {
  const validatedSlot = requireSaveSlotNumber(slot);
  return readFamilyTreeSaveSlots(storage)[validatedSlot - 1] ?? null;
}

export function familyTreeSaveSlotIsFilled(
  storage: FamilyTreeSaveStorage,
  slot: number,
): boolean {
  return readFamilyTreeSaveSlot(storage, slot) !== null;
}

export function writeFamilyTreeSaveSlot(
  storage: FamilyTreeSaveStorage,
  slot: number,
  document: FamilyTreeDocument,
): void {
  const validatedStorage = requireFamilyTreeSaveStorage(storage);
  const validatedSlot = requireSaveSlotNumber(slot);
  const serializedDocument = serializeFamilyTreeDocument(document);
  const currentSlots = readStoredFamilyTreeSaveSlots(validatedStorage);
  const validatedDocument = parseFamilyTreeDocument(serializedDocument);

  storeFamilyTreeSaveSlots(
    validatedStorage,
    replaceFamilyTreeSaveSlot(currentSlots, validatedSlot, validatedDocument),
  );
}
