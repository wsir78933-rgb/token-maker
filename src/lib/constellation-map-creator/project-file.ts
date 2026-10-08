import {
  CONSTELLATION_MAX_FILE_BYTES,
} from './types';
import {
  describeConstellationValue,
  requireConstellationFileText,
  requireConstellationProject,
} from './validation';
import type { ConstellationProject } from './types';

export const CONSTELLATION_PROJECT_SCHEMA_VERSION = 1;

type SerializedConstellationProject = {
  schemaVersion: typeof CONSTELLATION_PROJECT_SCHEMA_VERSION;
  project: ConstellationProject;
};

function isConstellationRecord(
  receivedValue: unknown,
): receivedValue is Record<string, unknown> {
  return receivedValue !== null && typeof receivedValue === 'object' && !Array.isArray(receivedValue);
}

function requireExactSerializedProjectFields(
  receivedRecord: Record<string, unknown>,
): void {
  const actualFieldNames = Object.keys(receivedRecord).sort();
  const expectedFieldNames = ['project', 'schemaVersion'];
  if (
    actualFieldNames.length !== expectedFieldNames.length ||
    actualFieldNames.some((fieldName, index) => fieldName !== expectedFieldNames[index])
  ) {
    throw new Error(
      `Constellation project file must contain exactly project and schemaVersion. Received ${describeConstellationValue(receivedRecord)}.`,
    );
  }
}

function parseConstellationJson(receivedText: string): unknown {
  try {
    return JSON.parse(receivedText) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Constellation project file contains invalid JSON. Received ${JSON.stringify(receivedText.slice(0, 120))}.`,
        { cause: error },
      );
    }

    throw error;
  }
}

export function serializeConstellationProject(project: ConstellationProject): string {
  const validProject = requireConstellationProject(project);
  const serializedProject: SerializedConstellationProject = {
    schemaVersion: CONSTELLATION_PROJECT_SCHEMA_VERSION,
    project: validProject,
  };
  const projectText = JSON.stringify(serializedProject);
  const encodedProjectText = new TextEncoder().encode(projectText);
  if (encodedProjectText.byteLength > CONSTELLATION_MAX_FILE_BYTES) {
    throw new Error(
      `Constellation project file must be at most ${CONSTELLATION_MAX_FILE_BYTES} bytes. Received ${encodedProjectText.byteLength} bytes.`,
    );
  }

  return projectText;
}

export function parseConstellationProject(receivedText: string): ConstellationProject {
  const projectText = requireConstellationFileText(receivedText);
  const parsedValue = parseConstellationJson(projectText);
  if (!isConstellationRecord(parsedValue)) {
    throw new Error(
      `Constellation project file root must be an object. Received ${describeConstellationValue(parsedValue)}.`,
    );
  }

  requireExactSerializedProjectFields(parsedValue);
  if (parsedValue.schemaVersion !== CONSTELLATION_PROJECT_SCHEMA_VERSION) {
    throw new Error(
      `Constellation project file schemaVersion must be ${CONSTELLATION_PROJECT_SCHEMA_VERSION}. Received ${describeConstellationValue(parsedValue.schemaVersion)}.`,
    );
  }

  return requireConstellationProject(parsedValue.project);
}

