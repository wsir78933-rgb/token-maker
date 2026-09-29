import {
  parseArmyFormationDocument,
  serializeArmyFormationDocument,
  type ArmyFormationDocument,
} from '@/lib/army-formation/document';

export const ARMY_FORMATION_DOCUMENT_STORAGE_KEY = 'tokenmaker.army-formation-creator.document';

export type ArmyFormationDocumentStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function describeJsonReceivedValue(value: object): string {
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }

    return `${Object.prototype.toString.call(value)} (JSON.stringify returned ${String(json)}).`;
  } catch (failure: unknown) {
    const reason = failure instanceof Error ? failure.message : Object.prototype.toString.call(failure);
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

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  return describeJsonReceivedValue(value);
}

function requireArmyFormationDocumentStorage(
  storage: ArmyFormationDocumentStorage,
): ArmyFormationDocumentStorage {
  if (typeof storage !== 'object' || storage === null || Array.isArray(storage)) {
    throw new Error(
      `Army formation document storage must be an object, received ${describeReceivedValue(storage)}.`,
    );
  }

  if (typeof storage.getItem !== 'function') {
    throw new Error(
      `Army formation document storage getItem must be a function, received ${describeReceivedValue(storage.getItem)}.`,
    );
  }

  if (typeof storage.setItem !== 'function') {
    throw new Error(
      `Army formation document storage setItem must be a function, received ${describeReceivedValue(storage.setItem)}.`,
    );
  }

  if (typeof storage.removeItem !== 'function') {
    throw new Error(
      `Army formation document storage removeItem must be a function, received ${describeReceivedValue(storage.removeItem)}.`,
    );
  }

  return storage;
}

function readStoredArmyFormationText(storage: ArmyFormationDocumentStorage): string | null {
  const stored = storage.getItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
  if (stored === null) {
    return null;
  }

  if (typeof stored !== 'string') {
    throw new Error(
      `Army formation browser save must be a string, received ${describeReceivedValue(stored)}. Stored text: ${describeReceivedValue(stored)}`,
    );
  }

  return stored;
}

function readCauseMessage(cause: unknown): string {
  if (cause instanceof Error && cause.message.length > 0) {
    return cause.message;
  }

  return `Army formation browser save failed, received ${describeReceivedValue(cause)}.`;
}

function throwInvalidArmyFormationBrowserSave(storedText: string, cause: unknown): never {
  const causeOption = cause instanceof Error ? { cause } : undefined;
  throw new Error(
    `Army formation browser save is invalid, received ${JSON.stringify(storedText)}. ${readCauseMessage(cause)} Stored text: ${storedText}`,
    causeOption,
  );
}

function parseStoredArmyFormationDocument(storedText: string): ArmyFormationDocument {
  try {
    return parseArmyFormationDocument(storedText);
  } catch (cause) {
    throwInvalidArmyFormationBrowserSave(storedText, cause);
  }
}

export function readArmyFormationBrowserSave(
  storage: ArmyFormationDocumentStorage,
): ArmyFormationDocument | null {
  const validatedStorage = requireArmyFormationDocumentStorage(storage);
  const storedText = readStoredArmyFormationText(validatedStorage);
  if (storedText === null) {
    return null;
  }

  return parseStoredArmyFormationDocument(storedText);
}

export function writeArmyFormationBrowserSave(
  storage: ArmyFormationDocumentStorage,
  armyDocument: ArmyFormationDocument,
): void {
  const validatedStorage = requireArmyFormationDocumentStorage(storage);
  const serialized = serializeArmyFormationDocument(armyDocument);
  validatedStorage.setItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY, serialized);
}

export function removeArmyFormationBrowserSave(storage: ArmyFormationDocumentStorage): void {
  const validatedStorage = requireArmyFormationDocumentStorage(storage);
  validatedStorage.removeItem(ARMY_FORMATION_DOCUMENT_STORAGE_KEY);
}
