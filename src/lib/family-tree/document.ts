import {
  FAMILY_TREE_VERSION,
  createInitialFamilyTreeScene,
  requireFamilyTreeScene,
  type FamilyTreeScene,
} from '@/lib/family-tree/scene';

export const FAMILY_TREE_DOCUMENT_VERSION = FAMILY_TREE_VERSION;

export type FamilyTreeDocument = {
  version: typeof FAMILY_TREE_DOCUMENT_VERSION;
  scene: FamilyTreeScene;
};

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

function requireExactDocumentFields(record: PlainRecord): void {
  const actualFields = Object.keys(record).sort();
  const expectedFields = ['scene', 'version'];

  if (
    actualFields.length !== expectedFields.length ||
    actualFields.some((field, index) => field !== expectedFields[index])
  ) {
    throw new Error(
      `Family tree document must contain exactly scene and version. Received ${formatReceivedValue(record)}.`,
    );
  }
}

function requireDocumentVersion(value: unknown): typeof FAMILY_TREE_DOCUMENT_VERSION {
  if (value !== FAMILY_TREE_DOCUMENT_VERSION) {
    throw new Error(
      `Family tree document version must be ${FAMILY_TREE_DOCUMENT_VERSION}, received ${formatReceivedValue(value)}.`,
    );
  }

  return FAMILY_TREE_DOCUMENT_VERSION;
}

function requireDocumentRecord(value: unknown): FamilyTreeDocument {
  const record = requirePlainRecord(value, 'Family tree document');
  requireExactDocumentFields(record);

  return {
    version: requireDocumentVersion(record.version),
    scene: requireFamilyTreeScene(record.scene),
  };
}

function requireSerializedDocument(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error(
      `Family tree document text must be a string, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function parseSerializedDocument(serialized: string): unknown {
  try {
    return JSON.parse(serialized) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Family tree document contains invalid JSON syntax. Received ${JSON.stringify(serialized.slice(0, 160))}.`,
        { cause: error },
      );
    }

    throw error;
  }
}

export function createInitialFamilyTreeDocument(): FamilyTreeDocument {
  return {
    version: FAMILY_TREE_DOCUMENT_VERSION,
    scene: createInitialFamilyTreeScene(),
  };
}

export function createFamilyTreeDocument(scene: FamilyTreeScene): FamilyTreeDocument {
  const validatedScene = requireFamilyTreeScene(scene);

  return {
    version: FAMILY_TREE_DOCUMENT_VERSION,
    scene: validatedScene,
  };
}

export function requireFamilyTreeDocument(value: unknown): FamilyTreeDocument {
  return requireDocumentRecord(value);
}

export function serializeFamilyTreeDocument(document: FamilyTreeDocument): string {
  return JSON.stringify(requireFamilyTreeDocument(document));
}

export function parseFamilyTreeDocument(serialized: string): FamilyTreeDocument {
  const validatedSerialized = requireSerializedDocument(serialized);
  return requireFamilyTreeDocument(parseSerializedDocument(validatedSerialized));
}
