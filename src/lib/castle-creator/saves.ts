import {
  CASTLE_CREATOR_SAVE_SLOT_NUMBERS,
} from './constants';
import {
  type CastleProject,
  type CastleSaveSlotNumber,
} from './types';
import { validateCastleProject } from './project';

const CASTLE_SAVE_STORAGE_PREFIX = 'tokenmaker.castle-creator.save-slot';

export interface CastleSaveStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface CastleSaveRecord {
  version: 1;
  slotNumber: CastleSaveSlotNumber;
  project: CastleProject;
  updatedAt: string;
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
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `${Object.prototype.toString.call(value)} could not be described: ${error.message}`,
      );
    }

    throw error;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireCastleSaveSlotNumber(value: unknown): CastleSaveSlotNumber {
  if (CASTLE_CREATOR_SAVE_SLOT_NUMBERS.some((slotNumber) => slotNumber === value)) {
    return value as CastleSaveSlotNumber;
  }

  throw new Error(
    `Castle save slot must be an integer from 1 to 5. Received ${describeReceivedValue(value)}.`,
  );
}

function requireCastleSaveStorage(storage: unknown): CastleSaveStorage {
  if (!isPlainObject(storage)) {
    throw new Error(
      `Castle save storage must be an object. Received ${describeReceivedValue(storage)}.`,
    );
  }

  if (typeof storage.getItem !== 'function') {
    throw new Error(
      `Castle save storage getItem must be a function. Received ${describeReceivedValue(storage.getItem)}.`,
    );
  }

  if (typeof storage.setItem !== 'function') {
    throw new Error(
      `Castle save storage setItem must be a function. Received ${describeReceivedValue(storage.setItem)}.`,
    );
  }

  return storage as unknown as CastleSaveStorage;
}

function parseCastleSaveJson(rawValue: string, slotNumber: CastleSaveSlotNumber): unknown {
  try {
    return JSON.parse(rawValue);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Castle save slot ${slotNumber} has invalid JSON syntax. Received ${JSON.stringify(rawValue.slice(0, 120))}.`,
      );
    }

    throw error;
  }
}

function requireExactCastleSaveRecordKeys(record: Record<string, unknown>, slotNumber: CastleSaveSlotNumber): void {
  const expectedKeys = ['project', 'slotNumber', 'updatedAt', 'version'];
  const receivedKeys = Object.keys(record).sort();
  if (
    receivedKeys.length !== expectedKeys.length
    || receivedKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw new Error(
      `Castle save slot ${slotNumber} has invalid record keys. Received ${describeReceivedValue(receivedKeys)}; expected ${describeReceivedValue(expectedKeys)}.`,
    );
  }
}

function requireCastleSaveRecord(
  value: unknown,
  slotNumber: CastleSaveSlotNumber,
): CastleSaveRecord {
  if (!isPlainObject(value)) {
    throw new Error(
      `Castle save slot ${slotNumber} has an invalid save record. Received ${describeReceivedValue(value)}.`,
    );
  }

  requireExactCastleSaveRecordKeys(value, slotNumber);

  if (value.version !== 1) {
    throw new Error(
      `Castle save slot ${slotNumber} record version must be 1. Received ${describeReceivedValue(value.version)}.`,
    );
  }

  if (value.slotNumber !== slotNumber) {
    throw new Error(
      `Castle save slot ${slotNumber} record slotNumber must be ${slotNumber}. Received ${describeReceivedValue(value.slotNumber)}.`,
    );
  }

  if (typeof value.updatedAt !== 'string' || value.updatedAt.length === 0) {
    throw new Error(
      `Castle save slot ${slotNumber} record updatedAt must be a non-empty string. Received ${describeReceivedValue(value.updatedAt)}.`,
    );
  }

  let validatedProject: CastleProject;
  try {
    validatedProject = validateCastleProject(value.project);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Castle save slot ${slotNumber} project is invalid: ${error.message}`);
    }

    throw error;
  }

  return {
    version: 1,
    slotNumber,
    project: validatedProject,
    updatedAt: value.updatedAt,
  };
}

export function castleSaveStorageKey(slotNumber: CastleSaveSlotNumber): string {
  const validatedSlotNumber = requireCastleSaveSlotNumber(slotNumber);
  return `${CASTLE_SAVE_STORAGE_PREFIX}-${validatedSlotNumber}`;
}

export function readCastleSaveSlot(
  storage: CastleSaveStorage,
  slotNumber: CastleSaveSlotNumber,
): CastleSaveRecord | null {
  const validatedStorage = requireCastleSaveStorage(storage);
  const validatedSlotNumber = requireCastleSaveSlotNumber(slotNumber);
  const storageKey = castleSaveStorageKey(validatedSlotNumber);
  const rawValue = validatedStorage.getItem(storageKey);

  if (rawValue === null) {
    return null;
  }

  if (typeof rawValue !== 'string') {
    throw new Error(
      `Castle save slot ${validatedSlotNumber} storage value must be a string or null. Received ${describeReceivedValue(rawValue)}.`,
    );
  }

  return requireCastleSaveRecord(parseCastleSaveJson(rawValue, validatedSlotNumber), validatedSlotNumber);
}

export function writeCastleSaveSlot(
  storage: CastleSaveStorage,
  slotNumber: CastleSaveSlotNumber,
  project: CastleProject,
): CastleSaveRecord {
  const validatedStorage = requireCastleSaveStorage(storage);
  const validatedSlotNumber = requireCastleSaveSlotNumber(slotNumber);
  let validatedProject: CastleProject;
  try {
    validatedProject = validateCastleProject(project);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Castle save slot ${validatedSlotNumber} project is invalid: ${error.message}`);
    }

    throw error;
  }

  const record: CastleSaveRecord = {
    version: 1,
    slotNumber: validatedSlotNumber,
    project: validatedProject,
    updatedAt: new Date().toISOString(),
  };
  const serializedRecord = JSON.stringify(record);
  if (typeof serializedRecord !== 'string') {
    throw new Error(
      `Castle save slot ${validatedSlotNumber} could not be serialized. Received ${describeReceivedValue(record)}.`,
    );
  }

  validatedStorage.setItem(castleSaveStorageKey(validatedSlotNumber), serializedRecord);
  const readbackRecord = readCastleSaveSlot(validatedStorage, validatedSlotNumber);
  if (readbackRecord === null) {
    throw new Error(
      `Castle save slot ${validatedSlotNumber} write readback returned null after setItem succeeded.`,
    );
  }

  if (readbackRecord.updatedAt !== record.updatedAt) {
    throw new Error(
      `Castle save slot ${validatedSlotNumber} write readback updatedAt differs. Expected ${JSON.stringify(record.updatedAt)}, received ${JSON.stringify(readbackRecord.updatedAt)}.`,
    );
  }

  const readbackProject = JSON.stringify(readbackRecord.project);
  const writtenProject = JSON.stringify(record.project);
  if (readbackProject !== writtenProject) {
    throw new Error(
      `Castle save slot ${validatedSlotNumber} write readback project differs. Expected ${writtenProject}, received ${readbackProject}.`,
    );
  }

  return readbackRecord;
}
