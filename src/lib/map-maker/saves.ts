import {
  cloneMapMakerProject,
  describeMapMakerValue,
  isMapMakerRecord,
  requireMapMakerProject,
} from './validation';
import { serializeMapMakerProject } from './project-file';
import {
  MAP_MAKER_MAX_PROJECT_BYTES,
  MAP_MAKER_SAVE_SLOT_COUNT,
} from './types';
import type {
  MapMakerProject,
  MapMakerSaveSlot,
  MapMakerSaveSlots,
  MapMakerSavedProject,
} from './types';

export const MAP_MAKER_SAVE_STORAGE_KEY = 'tokenmaker.map-maker.saves';

type MapMakerStorage = Pick<Storage, 'getItem' | 'setItem'>;

function stringifyMapMakerError(receivedError: unknown): string {
  if (receivedError instanceof Error) {
    return receivedError.message.length > 0 ? receivedError.message : receivedError.name;
  }
  return describeMapMakerValue(receivedError);
}

function requireMapMakerStorage(receivedStorage: unknown): MapMakerStorage {
  if (!isMapMakerRecord(receivedStorage)) {
    throw new Error(`Map Maker save storage must be an object. Received ${describeMapMakerValue(receivedStorage)}.`);
  }
  if (typeof receivedStorage.getItem !== 'function') {
    throw new Error(
      `Map Maker save storage getItem must be a function. Received ${describeMapMakerValue(receivedStorage.getItem)}.`,
    );
  }
  if (typeof receivedStorage.setItem !== 'function') {
    throw new Error(
      `Map Maker save storage setItem must be a function. Received ${describeMapMakerValue(receivedStorage.setItem)}.`,
    );
  }
  return receivedStorage as MapMakerStorage;
}

function resolveMapMakerStorage(receivedStorage: MapMakerStorage | undefined): MapMakerStorage {
  if (receivedStorage !== undefined) return requireMapMakerStorage(receivedStorage);
  try {
    if (!('localStorage' in globalThis)) {
      throw new Error('globalThis.localStorage is unavailable. Received undefined.');
    }
    return requireMapMakerStorage(globalThis.localStorage);
  } catch (error: unknown) {
    throw new Error(
      `Map Maker save storage could not access globalThis.localStorage. Received ${stringifyMapMakerError(error)}.`,
      { cause: error },
    );
  }
}

function requireMapMakerSlot(receivedSlot: unknown): MapMakerSaveSlot {
  if (
    typeof receivedSlot === 'number' &&
    Number.isInteger(receivedSlot) &&
    receivedSlot >= 1 &&
    receivedSlot <= MAP_MAKER_SAVE_SLOT_COUNT
  ) {
    return receivedSlot as MapMakerSaveSlot;
  }
  throw new Error(
    `Map Maker save slot must be an integer from 1 to ${MAP_MAKER_SAVE_SLOT_COUNT}. Received ${describeMapMakerValue(receivedSlot)}.`,
  );
}

function requireSavedAt(receivedSavedAt: unknown, slot: number): string {
  if (typeof receivedSavedAt !== 'string' || receivedSavedAt.length === 0 || !Number.isFinite(Date.parse(receivedSavedAt))) {
    throw new Error(
      `Map Maker save slot ${slot} savedAt must be a valid non-empty date string. Received ${describeMapMakerValue(receivedSavedAt)}.`,
    );
  }
  return receivedSavedAt;
}

function requireSavedProject(receivedValue: unknown, slot: number): MapMakerSavedProject {
  if (!isMapMakerRecord(receivedValue)) {
    throw new Error(
      `Map Maker save slot ${slot} must be null or a project record. Received ${describeMapMakerValue(receivedValue)}.`,
    );
  }
  const fields = Object.keys(receivedValue).sort();
  if (fields.length !== 2 || fields[0] !== 'project' || fields[1] !== 'savedAt') {
    throw new Error(
      `Map Maker save slot ${slot} must contain exactly project and savedAt. Received ${describeMapMakerValue(receivedValue)}.`,
    );
  }
  const project = requireMapMakerProject(receivedValue.project);
  serializeMapMakerProject(project);
  return {
    project,
    savedAt: requireSavedAt(receivedValue.savedAt, slot),
  };
}

function parseMapMakerSaveSlots(storedText: string): MapMakerSaveSlots {
  const encodedText = new TextEncoder().encode(storedText);
  const maxStorageBytes = MAP_MAKER_MAX_PROJECT_BYTES * MAP_MAKER_SAVE_SLOT_COUNT;
  if (encodedText.byteLength > maxStorageBytes) {
    throw new Error(
      `Map Maker save storage must be at most ${maxStorageBytes} bytes. Received ${encodedText.byteLength} bytes.`,
    );
  }

  let receivedSlots: unknown;
  try {
    receivedSlots = JSON.parse(storedText) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Map Maker save storage contains invalid JSON. Received ${JSON.stringify(storedText.slice(0, 120))}.`,
        { cause: error },
      );
    }
    throw error;
  }

  if (!Array.isArray(receivedSlots) || receivedSlots.length !== MAP_MAKER_SAVE_SLOT_COUNT) {
    throw new Error(
      `Map Maker save storage must contain exactly ${MAP_MAKER_SAVE_SLOT_COUNT} slots. Received ${describeMapMakerValue(receivedSlots)}.`,
    );
  }
  return receivedSlots.map((receivedSlot, index) =>
    receivedSlot === null ? null : requireSavedProject(receivedSlot, index + 1),
  );
}

function readMapMakerStorageText(storage: MapMakerStorage): string | null {
  let storedText: string | null;
  try {
    storedText = storage.getItem(MAP_MAKER_SAVE_STORAGE_KEY);
  } catch (error: unknown) {
    throw new Error(
      `Map Maker save storage getItem failed for key ${JSON.stringify(MAP_MAKER_SAVE_STORAGE_KEY)}. Received ${stringifyMapMakerError(error)}.`,
      { cause: error },
    );
  }
  if (storedText === null) return null;
  if (typeof storedText !== 'string') {
    throw new Error(
      `Map Maker save storage getItem must return a string or null. Received ${describeMapMakerValue(storedText)}.`,
    );
  }
  return storedText;
}

function readMapMakerSaveSlotsFromStorage(storage: MapMakerStorage): MapMakerSaveSlots {
  const storedText = readMapMakerStorageText(storage);
  if (storedText === null) return Array.from({ length: MAP_MAKER_SAVE_SLOT_COUNT }, () => null);
  return parseMapMakerSaveSlots(storedText);
}

function writeMapMakerSaveSlots(storage: MapMakerStorage, slots: MapMakerSaveSlots, slot: number): MapMakerSaveSlots {
  const serializedSlots = JSON.stringify(slots);
  const maxStorageBytes = MAP_MAKER_MAX_PROJECT_BYTES * MAP_MAKER_SAVE_SLOT_COUNT;
  const encodedSlots = new TextEncoder().encode(serializedSlots);
  if (encodedSlots.byteLength > maxStorageBytes) {
    throw new Error(
      `Map Maker save storage must be at most ${maxStorageBytes} bytes. Received ${encodedSlots.byteLength} bytes.`,
    );
  }

  try {
    storage.setItem(MAP_MAKER_SAVE_STORAGE_KEY, serializedSlots);
  } catch (error: unknown) {
    throw new Error(
      `Map Maker save storage setItem failed for slot ${slot} and key ${JSON.stringify(MAP_MAKER_SAVE_STORAGE_KEY)}. Received ${stringifyMapMakerError(error)}.`,
      { cause: error },
    );
  }

  const storedTextAfterWrite = readMapMakerStorageText(storage);
  if (storedTextAfterWrite === null) {
    throw new Error(`Map Maker save storage readback returned null after saving slot ${slot}. Received null.`);
  }
  const readbackSlots = parseMapMakerSaveSlots(storedTextAfterWrite);
  if (JSON.stringify(readbackSlots) !== JSON.stringify(slots)) {
    throw new Error(
      `Map Maker save storage readback did not match slot ${slot}. Received ${describeMapMakerValue(readbackSlots)}.`,
    );
  }
  return readbackSlots;
}

export function readMapMakerSaveSlots(storage?: MapMakerStorage): MapMakerSaveSlots {
  const resolvedStorage = resolveMapMakerStorage(storage);
  return readMapMakerSaveSlotsFromStorage(resolvedStorage).map((savedProject) =>
    savedProject === null
      ? null
      : { project: cloneMapMakerProject(savedProject.project), savedAt: savedProject.savedAt },
  );
}

export function saveMapMakerSlot(
  slot: MapMakerSaveSlot,
  project: MapMakerProject,
  storage?: MapMakerStorage,
): MapMakerSaveSlots {
  const validSlot = requireMapMakerSlot(slot);
  const validProject = requireMapMakerProject(project);
  serializeMapMakerProject(validProject);
  const resolvedStorage = resolveMapMakerStorage(storage);
  const slots = readMapMakerSaveSlotsFromStorage(resolvedStorage).map((savedProject) =>
    savedProject === null
      ? null
      : { project: cloneMapMakerProject(savedProject.project), savedAt: savedProject.savedAt },
  );
  slots[validSlot - 1] = { project: validProject, savedAt: new Date().toISOString() };
  return writeMapMakerSaveSlots(resolvedStorage, slots, validSlot);
}

export function loadMapMakerSlot(slot: MapMakerSaveSlot, storage?: MapMakerStorage): MapMakerProject {
  const validSlot = requireMapMakerSlot(slot);
  const resolvedStorage = resolveMapMakerStorage(storage);
  const savedProject = readMapMakerSaveSlotsFromStorage(resolvedStorage)[validSlot - 1];
  if (savedProject === null || savedProject === undefined) {
    throw new Error(`Map Maker save slot ${validSlot} is empty. Received ${describeMapMakerValue(savedProject)}.`);
  }
  return cloneMapMakerProject(savedProject.project);
}
