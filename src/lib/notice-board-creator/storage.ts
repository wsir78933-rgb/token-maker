import {
  parseNoticeBoardFile,
  serializeNoticeBoardFile,
} from './project';
import {
  NoticeBoardValidationError,
  type NoticeBoardProject,
  type NoticeBoardSlotIndex,
} from './types';

type NoticeBoardStorage = Pick<Storage, 'getItem' | 'setItem'>;

const NOTICE_BOARD_SLOT_INDEXES: readonly NoticeBoardSlotIndex[] = [1, 2, 3, 4];
const NOTICE_BOARD_SLOT_KEY_PREFIX = 'notice-board-creator:slot:';

export class NoticeBoardStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoticeBoardStorageError';
  }
}

export type NoticeBoardSlotReadResult =
  | {
      slotIndex: NoticeBoardSlotIndex;
      status: 'empty';
      project: null;
      error: null;
    }
  | {
      slotIndex: NoticeBoardSlotIndex;
      status: 'valid';
      project: NoticeBoardProject;
      error: null;
    }
  | {
      slotIndex: NoticeBoardSlotIndex;
      status: 'invalid';
      project: null;
      error: NoticeBoardStorageError;
    };

export function readNoticeBoardSlots(
  storage: NoticeBoardStorage,
): NoticeBoardSlotReadResult[] {
  requireNoticeBoardStorage(storage);
  return NOTICE_BOARD_SLOT_INDEXES.map((slotIndex) =>
    readNoticeBoardSlotResult(storage, slotIndex),
  );
}

export function saveNoticeBoardSlot(
  storage: NoticeBoardStorage,
  slotIndex: NoticeBoardSlotIndex,
  project: NoticeBoardProject,
): void {
  requireNoticeBoardStorage(storage);
  requireNoticeBoardSlotIndex(slotIndex);
  const slotKey = getNoticeBoardSlotKey(slotIndex);
  const serializedProject = serializeNoticeBoardFile(project);

  try {
    storage.setItem(slotKey, serializedProject);
  } catch (error) {
    throwKnownNoticeBoardStorageError(error, 'save', slotKey);
  }
}

export function loadNoticeBoardSlot(
  storage: NoticeBoardStorage,
  slotIndex: NoticeBoardSlotIndex,
): NoticeBoardProject | null {
  requireNoticeBoardStorage(storage);
  requireNoticeBoardSlotIndex(slotIndex);
  const slotResult = readNoticeBoardSlotResult(storage, slotIndex);
  if (slotResult.status === 'invalid') {
    throw slotResult.error;
  }
  return slotResult.project;
}

function readNoticeBoardSlotResult(
  storage: NoticeBoardStorage,
  slotIndex: NoticeBoardSlotIndex,
): NoticeBoardSlotReadResult {
  const slotKey = getNoticeBoardSlotKey(slotIndex);
  let serializedProject: string | null;
  try {
    serializedProject = storage.getItem(slotKey);
  } catch (error) {
    throwKnownNoticeBoardStorageError(error, 'read', slotKey);
  }

  if (serializedProject === null) {
    return { slotIndex, status: 'empty', project: null, error: null };
  }
  if (typeof serializedProject !== 'string') {
    throw new NoticeBoardStorageError(
      'Stored project for slot ' + slotIndex + ' must be a string or null; received ' +
        describeStorageValue(serializedProject),
    );
  }

  try {
    return {
      slotIndex,
      status: 'valid',
      project: parseNoticeBoardFile(serializedProject),
      error: null,
    };
  } catch (error) {
    if (error instanceof NoticeBoardValidationError) {
      const slotError = new NoticeBoardStorageError(
        'Stored project for slot ' + slotIndex + ' is invalid: ' + error.message,
      );
      return { slotIndex, status: 'invalid', project: null, error: slotError };
    }
    throw error;
  }
}

function requireNoticeBoardStorage(storage: NoticeBoardStorage): void {
  if (
    storage === null ||
    typeof storage !== 'object' ||
    typeof storage.getItem !== 'function' ||
    typeof storage.setItem !== 'function'
  ) {
    throw new NoticeBoardStorageError(
      'storage must provide getItem and setItem functions; received ' +
        describeStorageValue(storage),
    );
  }
}

function requireNoticeBoardSlotIndex(
  slotIndex: NoticeBoardSlotIndex,
): asserts slotIndex is NoticeBoardSlotIndex {
  if (!NOTICE_BOARD_SLOT_INDEXES.includes(slotIndex)) {
    throw new NoticeBoardStorageError(
      'slot index must be 1, 2, 3, or 4; received ' + describeStorageValue(slotIndex),
    );
  }
}

function getNoticeBoardSlotKey(slotIndex: NoticeBoardSlotIndex): string {
  return NOTICE_BOARD_SLOT_KEY_PREFIX + slotIndex;
}

function throwKnownNoticeBoardStorageError(
  error: unknown,
  operation: 'read' | 'save',
  slotKey: string,
): never {
  if (
    typeof DOMException !== 'undefined' &&
    error instanceof DOMException &&
    (error.name === 'SecurityError' || error.name === 'QuotaExceededError')
  ) {
    throw new NoticeBoardStorageError(
      'Could not ' + operation + ' local notice board slot ' + slotKey +
        ' because browser storage raised ' + error.name + ': ' + error.message,
    );
  }
  throw error;
}

function describeStorageValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'object') {
    const seenValues = new WeakSet<object>();
    const serializedValue = JSON.stringify(value, (_propertyName, nestedValue: unknown) => {
      if (typeof nestedValue === 'bigint') return nestedValue.toString() + 'n';
      if (nestedValue !== null && typeof nestedValue === 'object') {
        if (seenValues.has(nestedValue)) return '[Circular]';
        seenValues.add(nestedValue);
      }
      return nestedValue;
    });
    if (serializedValue === undefined) return Object.prototype.toString.call(value);
    if (serializedValue.length <= 240) return serializedValue;
    return serializedValue.slice(0, 237) + '...';
  }

  return Object.prototype.toString.call(value);
}
