import {
  assertSolarSaveSnapshot,
} from './manual';
import type { SolarSaveSnapshot } from './types';

export const SOLAR_SYSTEM_SAVE_STORAGE_KEY = 'tokenmaker.solar-system-creator.saves';
export const SOLAR_SYSTEM_SAVE_SLOT_COUNT = 5;

const SOLAR_SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5] as const;
const SOLAR_SNAPSHOT_FIELD_NAMES = ['planets', 'starAssetId'] as const;
const SOLAR_PLANET_FIELD_NAMES = [
  'assetId',
  'description',
  'height',
  'id',
  'width',
  'x',
  'y',
] as const;

export type SolarSaveSlot = (typeof SOLAR_SAVE_SLOT_NUMBERS)[number];
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function stringifyFailureReason(receivedValue: unknown): string {
  if (receivedValue instanceof Error) {
    return receivedValue.message.length > 0
      ? receivedValue.message
      : `${receivedValue.name} with empty message`;
  }

  if (typeof receivedValue === 'string') return receivedValue;
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  return Object.prototype.toString.call(receivedValue);
}

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';

  if (
    typeof receivedValue === 'number' ||
    typeof receivedValue === 'boolean' ||
    typeof receivedValue === 'bigint'
  ) {
    return String(receivedValue);
  }

  try {
    const serializedValue = JSON.stringify(receivedValue);
    return serializedValue === undefined
      ? Object.prototype.toString.call(receivedValue)
      : serializedValue;
  } catch (error: unknown) {
    return `${Object.prototype.toString.call(receivedValue)} (JSON.stringify failed: ${stringifyFailureReason(error)}).`;
  }
}

function isRecord(receivedValue: unknown): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireStorage(receivedStorage: unknown): StorageLike {
  if (!isRecord(receivedStorage)) {
    throw new Error(
      `Solar save storage must be an object. Received ${describeReceivedValue(receivedStorage)}.`,
    );
  }

  if (typeof receivedStorage.getItem !== 'function') {
    throw new Error(
      `Solar save storage getItem must be a function. Received ${describeReceivedValue(receivedStorage.getItem)}.`,
    );
  }

  if (typeof receivedStorage.setItem !== 'function') {
    throw new Error(
      `Solar save storage setItem must be a function. Received ${describeReceivedValue(receivedStorage.setItem)}.`,
    );
  }

  return receivedStorage as StorageLike;
}

function isSolarSaveSlot(receivedSlot: unknown): receivedSlot is SolarSaveSlot {
  return SOLAR_SAVE_SLOT_NUMBERS.some((slotNumber) => slotNumber === receivedSlot);
}

export function requireSolarSaveSlot(receivedSlot: unknown): SolarSaveSlot {
  if (isSolarSaveSlot(receivedSlot)) return receivedSlot;

  throw new Error(
    `Solar save slot must be an integer from 1 to ${SOLAR_SYSTEM_SAVE_SLOT_COUNT}. Received ${describeReceivedValue(receivedSlot)}.`,
  );
}

function requireExactFields(
  receivedValue: Record<string, unknown>,
  expectedFieldNames: readonly string[],
  valueLabel: string,
): void {
  const actualFieldNames = Object.keys(receivedValue).sort();
  const sortedExpectedFieldNames = [...expectedFieldNames].sort();
  const hasExpectedFields =
    actualFieldNames.length === sortedExpectedFieldNames.length &&
    actualFieldNames.every((fieldName, fieldIndex) => fieldName === sortedExpectedFieldNames[fieldIndex]);

  if (!hasExpectedFields) {
    throw new Error(
      `${valueLabel} must contain exactly ${sortedExpectedFieldNames.join(', ')}. Received ${describeReceivedValue(receivedValue)}.`,
    );
  }
}

function requireSolarSaveSnapshot(
  receivedSnapshot: unknown,
  slotNumber: SolarSaveSlot,
): SolarSaveSnapshot {
  if (!isRecord(receivedSnapshot)) {
    throw new Error(
      `Solar save slot ${slotNumber} snapshot must be an object. Received ${describeReceivedValue(receivedSnapshot)}.`,
    );
  }

  requireExactFields(receivedSnapshot, SOLAR_SNAPSHOT_FIELD_NAMES, `Solar save slot ${slotNumber} snapshot`);

  if (!Array.isArray(receivedSnapshot.planets)) {
    throw new Error(
      `Solar save slot ${slotNumber} snapshot planets must be an array. Received ${describeReceivedValue(receivedSnapshot.planets)}.`,
    );
  }

  receivedSnapshot.planets.forEach((receivedPlanet, planetIndex) => {
    if (!isRecord(receivedPlanet)) {
      throw new Error(
        `Solar save slot ${slotNumber} planet ${planetIndex + 1} must be an object. Received ${describeReceivedValue(receivedPlanet)}.`,
      );
    }

    requireExactFields(
      receivedPlanet,
      SOLAR_PLANET_FIELD_NAMES,
      `Solar save slot ${slotNumber} planet ${planetIndex + 1}`,
    );
  });

  try {
    assertSolarSaveSnapshot(receivedSnapshot);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Solar save slot ${slotNumber} snapshot is invalid: ${error.message}`,
        { cause: error },
      );
    }

    throw error;
  }

  return receivedSnapshot;
}

function createEmptySolarSaveSlots(): Array<SolarSaveSnapshot | null> {
  return Array.from({ length: SOLAR_SYSTEM_SAVE_SLOT_COUNT }, () => null);
}

function readStorageText(
  storage: StorageLike,
  slotNumber: SolarSaveSlot | undefined,
): string | null {
  let storedText: string | null;
  try {
    storedText = storage.getItem(SOLAR_SYSTEM_SAVE_STORAGE_KEY);
  } catch (error: unknown) {
    const slotContext = slotNumber === undefined ? 'while reading all slots' : `while reading slot ${slotNumber}`;
    throw new Error(
      `Solar save storage getItem failed for key ${JSON.stringify(SOLAR_SYSTEM_SAVE_STORAGE_KEY)} ${slotContext}. Received ${stringifyFailureReason(error)}.`,
      { cause: error },
    );
  }

  if (storedText === null) return null;
  if (typeof storedText !== 'string') {
    throw new Error(
      `Solar save storage getItem returned an invalid value for key ${JSON.stringify(SOLAR_SYSTEM_SAVE_STORAGE_KEY)}. Received ${describeReceivedValue(storedText)}.`,
    );
  }

  return storedText;
}

function parseStoredJson(storedText: string, slotNumber: SolarSaveSlot | undefined): unknown {
  try {
    return JSON.parse(storedText) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      const slotContext = slotNumber === undefined ? 'all slots' : `slot ${slotNumber}`;
      throw new Error(
        `Solar save ${slotContext} contains invalid JSON. Received ${JSON.stringify(storedText.slice(0, 120))}.`,
        { cause: error },
      );
    }

    throw error;
  }
}

function readSolarSaveSlotsFromStorage(
  storage: StorageLike,
  requestedSlot: SolarSaveSlot | undefined,
): Array<SolarSaveSnapshot | null> {
  const storedText = readStorageText(storage, requestedSlot);
  if (storedText === null) return createEmptySolarSaveSlots();

  const parsedValue = parseStoredJson(storedText, requestedSlot);
  if (!Array.isArray(parsedValue) || parsedValue.length !== SOLAR_SYSTEM_SAVE_SLOT_COUNT) {
    throw new Error(
      `Solar save storage key ${JSON.stringify(SOLAR_SYSTEM_SAVE_STORAGE_KEY)} must contain exactly ${SOLAR_SYSTEM_SAVE_SLOT_COUNT} slots. Received ${describeReceivedValue(parsedValue)}.`,
    );
  }

  return parsedValue.map((receivedEntry, entryIndex) => {
    const slotNumber = requireSolarSaveSlot(entryIndex + 1);
    return receivedEntry === null
      ? null
      : requireSolarSaveSnapshot(receivedEntry, slotNumber);
  });
}

function writeStorageText(storage: StorageLike, serializedSlots: string, slotNumber: SolarSaveSlot): void {
  try {
    storage.setItem(SOLAR_SYSTEM_SAVE_STORAGE_KEY, serializedSlots);
  } catch (error: unknown) {
    throw new Error(
      `Solar save storage setItem failed for key ${JSON.stringify(SOLAR_SYSTEM_SAVE_STORAGE_KEY)} while writing slot ${slotNumber}. Received ${stringifyFailureReason(error)}.`,
      { cause: error },
    );
  }
}

export function readSolarSaveSlots(storage: StorageLike): Array<SolarSaveSnapshot | null> {
  const validStorage = requireStorage(storage);
  return readSolarSaveSlotsFromStorage(validStorage, undefined);
}

export function saveSolarSaveSlot(
  storage: StorageLike,
  slot: number,
  snapshot: SolarSaveSnapshot,
): void {
  const validStorage = requireStorage(storage);
  const slotNumber = requireSolarSaveSlot(slot);
  const validSnapshot = requireSolarSaveSnapshot(snapshot, slotNumber);
  const saveSlots = readSolarSaveSlotsFromStorage(validStorage, slotNumber);

  saveSlots[slotNumber - 1] = validSnapshot;
  writeStorageText(validStorage, JSON.stringify(saveSlots), slotNumber);
}

export function loadSolarSaveSlot(
  storage: StorageLike,
  slot: number,
): SolarSaveSnapshot | null {
  const validStorage = requireStorage(storage);
  const slotNumber = requireSolarSaveSlot(slot);
  const saveSlots = readSolarSaveSlotsFromStorage(validStorage, slotNumber);
  const savedSnapshot = saveSlots[slotNumber - 1];

  if (savedSnapshot === undefined) {
    throw new Error(`Solar save slot ${slotNumber} is missing from the save array.`);
  }

  return savedSnapshot;
}
