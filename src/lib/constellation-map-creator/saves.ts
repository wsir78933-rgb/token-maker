import {
  CONSTELLATION_MAX_FILE_BYTES,
  CONSTELLATION_SAVE_KEY,
} from './types';
import {
  cloneConstellationProject,
  describeConstellationValue,
  isConstellationRecord,
  requireConstellationProject,
} from './validation';
import type {
  ConstellationProject,
  ConstellationSaveSlot,
  ConstellationSaveSlots,
  ConstellationSavedProject,
} from './types';

export const CONSTELLATION_SAVE_SLOT_COUNT = 5;

const CONSTELLATION_SAVE_SLOT_NUMBERS = [1, 2, 3, 4, 5] as const;
const CONSTELLATION_SAVED_PROJECT_FIELDS = ['project', 'savedAt'] as const;

type ConstellationStorage = Pick<Storage, 'getItem' | 'setItem'>;

function stringifyConstellationError(receivedError: unknown): string {
  if (receivedError instanceof Error) {
    return receivedError.message.length > 0 ? receivedError.message : receivedError.name;
  }

  return describeConstellationValue(receivedError);
}

function requireConstellationStorage(
  receivedStorage: unknown,
): ConstellationStorage {
  if (!isConstellationRecord(receivedStorage)) {
    throw new Error(
      `Constellation save storage must be an object. Received ${describeConstellationValue(receivedStorage)}.`,
    );
  }
  if (typeof receivedStorage.getItem !== 'function') {
    throw new Error(
      `Constellation save storage getItem must be a function. Received ${describeConstellationValue(receivedStorage.getItem)}.`,
    );
  }
  if (typeof receivedStorage.setItem !== 'function') {
    throw new Error(
      `Constellation save storage setItem must be a function. Received ${describeConstellationValue(receivedStorage.setItem)}.`,
    );
  }

  return receivedStorage as ConstellationStorage;
}

function resolveConstellationStorage(
  receivedStorage: ConstellationStorage | undefined,
): ConstellationStorage {
  if (receivedStorage !== undefined) return requireConstellationStorage(receivedStorage);
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    throw new Error(
      `Constellation save storage was not supplied and globalThis.localStorage is unavailable. Received undefined.`,
    );
  }

  return requireConstellationStorage(globalThis.localStorage);
}

function isConstellationSaveSlot(receivedSlot: unknown): receivedSlot is ConstellationSaveSlot {
  return CONSTELLATION_SAVE_SLOT_NUMBERS.includes(receivedSlot as ConstellationSaveSlot);
}

function requireConstellationSaveSlot(receivedSlot: unknown): ConstellationSaveSlot {
  if (!isConstellationSaveSlot(receivedSlot)) {
    throw new Error(
      `Constellation save slot must be an integer from 1 to ${CONSTELLATION_SAVE_SLOT_COUNT}. Received ${describeConstellationValue(receivedSlot)}.`,
    );
  }

  return receivedSlot;
}

function requireExactConstellationSaveFields(
  receivedRecord: Record<string, unknown>,
  valueLabel: string,
): void {
  const actualFieldNames = Object.keys(receivedRecord).sort();
  const expectedFieldNames = [...CONSTELLATION_SAVED_PROJECT_FIELDS].sort();
  if (
    actualFieldNames.length !== expectedFieldNames.length ||
    actualFieldNames.some((fieldName, index) => fieldName !== expectedFieldNames[index])
  ) {
    throw new Error(
      `${valueLabel} must contain exactly project and savedAt. Received ${describeConstellationValue(receivedRecord)}.`,
    );
  }
}

function requireSavedAt(receivedSavedAt: unknown, valueLabel: string): string {
  if (typeof receivedSavedAt !== 'string' || receivedSavedAt.length === 0) {
    throw new Error(
      `${valueLabel} savedAt must be a non-empty string. Received ${describeConstellationValue(receivedSavedAt)}.`,
    );
  }

  if (!Number.isFinite(Date.parse(receivedSavedAt))) {
    throw new Error(
      `${valueLabel} savedAt must be a valid date string. Received ${JSON.stringify(receivedSavedAt)}.`,
    );
  }

  return receivedSavedAt;
}

function cloneSavedConstellationProject(
  savedProject: ConstellationSavedProject,
): ConstellationSavedProject {
  return { project: cloneConstellationProject(savedProject.project), savedAt: savedProject.savedAt };
}

function createEmptyConstellationSaveSlots(): ConstellationSaveSlots {
  return Array.from({ length: CONSTELLATION_SAVE_SLOT_COUNT }, () => null);
}

function requireSavedConstellationProject(
  receivedValue: unknown,
  slotNumber: ConstellationSaveSlot,
): ConstellationSavedProject {
  const valueLabel = `Constellation save slot ${slotNumber}`;
  if (!isConstellationRecord(receivedValue)) {
    throw new Error(
      `${valueLabel} must be null or an object. Received ${describeConstellationValue(receivedValue)}.`,
    );
  }

  requireExactConstellationSaveFields(receivedValue, valueLabel);
  const project = requireConstellationProject(receivedValue.project);
  const savedAt = requireSavedAt(receivedValue.savedAt, valueLabel);
  return { project, savedAt };
}

function parseConstellationSaveSlots(storedText: string): ConstellationSaveSlots {
  const encodedStoredText = new TextEncoder().encode(storedText);
  if (encodedStoredText.byteLength > CONSTELLATION_MAX_FILE_BYTES * CONSTELLATION_SAVE_SLOT_COUNT) {
    throw new Error(
      `Constellation save storage must be at most ${CONSTELLATION_MAX_FILE_BYTES * CONSTELLATION_SAVE_SLOT_COUNT} bytes. Received ${encodedStoredText.byteLength} bytes.`,
    );
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(storedText) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Constellation save storage contains invalid JSON. Received ${JSON.stringify(storedText.slice(0, 120))}.`,
        { cause: error },
      );
    }

    throw error;
  }

  if (!Array.isArray(parsedValue) || parsedValue.length !== CONSTELLATION_SAVE_SLOT_COUNT) {
    throw new Error(
      `Constellation save storage must contain exactly ${CONSTELLATION_SAVE_SLOT_COUNT} slots. Received ${describeConstellationValue(parsedValue)}.`,
    );
  }

  return parsedValue.map((receivedSlot, slotIndex) => {
    const slotNumber = (slotIndex + 1) as ConstellationSaveSlot;
    if (receivedSlot === null) return null;
    return requireSavedConstellationProject(receivedSlot, slotNumber);
  });
}

function readConstellationStorageText(storage: ConstellationStorage): string | null {
  let storedText: string | null;
  try {
    storedText = storage.getItem(CONSTELLATION_SAVE_KEY);
  } catch (error: unknown) {
    throw new Error(
      `Constellation save storage getItem failed for key ${JSON.stringify(CONSTELLATION_SAVE_KEY)}. Received ${stringifyConstellationError(error)}.`,
      { cause: error },
    );
  }

  if (storedText === null) return null;
  if (typeof storedText !== 'string') {
    throw new Error(
      `Constellation save storage getItem returned a non-string value. Received ${describeConstellationValue(storedText)}.`,
    );
  }

  return storedText;
}

function readConstellationSaveSlotsFromStorage(
  storage: ConstellationStorage,
): ConstellationSaveSlots {
  const storedText = readConstellationStorageText(storage);
  if (storedText === null) return createEmptyConstellationSaveSlots();
  return parseConstellationSaveSlots(storedText);
}

function writeConstellationSaveSlots(
  storage: ConstellationStorage,
  saveSlots: ConstellationSaveSlots,
  slotNumber: ConstellationSaveSlot,
): ConstellationSaveSlots {
  const serializedSlots = JSON.stringify(saveSlots);
  const encodedSlots = new TextEncoder().encode(serializedSlots);
  const maxStorageBytes = CONSTELLATION_MAX_FILE_BYTES * CONSTELLATION_SAVE_SLOT_COUNT;
  if (encodedSlots.byteLength > maxStorageBytes) {
    throw new Error(
      `Constellation save storage must be at most ${maxStorageBytes} bytes. Received ${encodedSlots.byteLength} bytes.`,
    );
  }

  try {
    storage.setItem(CONSTELLATION_SAVE_KEY, serializedSlots);
  } catch (error: unknown) {
    throw new Error(
      `Constellation save storage setItem failed for slot ${slotNumber} and key ${JSON.stringify(CONSTELLATION_SAVE_KEY)}. Received ${stringifyConstellationError(error)}.`,
      { cause: error },
    );
  }

  const storedTextAfterWrite = readConstellationStorageText(storage);
  if (storedTextAfterWrite === null) {
    throw new Error(
      `Constellation save storage readback returned null after saving slot ${slotNumber}. Received null.`,
    );
  }

  const readbackSlots = parseConstellationSaveSlots(storedTextAfterWrite);
  if (JSON.stringify(readbackSlots) !== JSON.stringify(saveSlots)) {
    throw new Error(
      `Constellation save storage readback did not match slot ${slotNumber}. Received ${JSON.stringify(readbackSlots)}.`,
    );
  }

  return readbackSlots;
}

export function readConstellationSaveSlots(
  storage?: ConstellationStorage,
): ConstellationSaveSlots {
  const resolvedStorage = resolveConstellationStorage(storage);
  return readConstellationSaveSlotsFromStorage(resolvedStorage).map((savedProject) =>
    savedProject === null ? null : cloneSavedConstellationProject(savedProject),
  );
}

export function saveConstellationSlot(
  slot: ConstellationSaveSlot,
  project: ConstellationProject,
  storage?: ConstellationStorage,
): ConstellationSaveSlots {
  const validSlot = requireConstellationSaveSlot(slot);
  const validProject = requireConstellationProject(project);
  const resolvedStorage = resolveConstellationStorage(storage);
  const currentSlots = readConstellationSaveSlotsFromStorage(resolvedStorage);
  const nextSlots = currentSlots.map((savedProject) =>
    savedProject === null ? null : cloneSavedConstellationProject(savedProject),
  );
  nextSlots[validSlot - 1] = {
    project: validProject,
    savedAt: new Date().toISOString(),
  };
  return writeConstellationSaveSlots(resolvedStorage, nextSlots, validSlot);
}

export function loadConstellationSlot(
  slot: ConstellationSaveSlot,
  storage?: ConstellationStorage,
): ConstellationProject {
  const validSlot = requireConstellationSaveSlot(slot);
  const resolvedStorage = resolveConstellationStorage(storage);
  const savedProject = readConstellationSaveSlotsFromStorage(resolvedStorage)[validSlot - 1];
  if (savedProject === null || savedProject === undefined) {
    throw new Error(
      `Constellation save slot ${validSlot} is empty. Received ${describeConstellationValue(savedProject)}.`,
    );
  }

  return cloneConstellationProject(savedProject.project);
}
