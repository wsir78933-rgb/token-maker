import { describeMapMakerValue, requireMapMakerProject } from './validation';
import { MAP_MAKER_MAX_PROJECT_BYTES } from './types';
import type { MapMakerProject } from './types';

export const MAP_MAKER_PROJECT_SCHEMA_VERSION = 1;

type SerializedMapMakerProject = {
  schemaVersion: typeof MAP_MAKER_PROJECT_SCHEMA_VERSION;
  project: MapMakerProject;
};

function requireMapMakerProjectText(receivedText: unknown): string {
  if (typeof receivedText !== 'string') {
    throw new Error(`Map Maker project file must be text. Received ${describeMapMakerValue(receivedText)}.`);
  }
  const textByteLength = new TextEncoder().encode(receivedText).byteLength;
  if (textByteLength > MAP_MAKER_MAX_PROJECT_BYTES) {
    throw new Error(
      `Map Maker project file must be at most ${MAP_MAKER_MAX_PROJECT_BYTES} bytes. Received ${textByteLength} bytes.`,
    );
  }
  return receivedText;
}

export function serializeMapMakerProject(project: MapMakerProject): string {
  const validProject = requireMapMakerProject(project);
  const serializedProject: SerializedMapMakerProject = {
    schemaVersion: MAP_MAKER_PROJECT_SCHEMA_VERSION,
    project: validProject,
  };
  return requireMapMakerProjectText(JSON.stringify(serializedProject));
}

function parseMapMakerJson(receivedText: string): unknown {
  try {
    return JSON.parse(receivedText) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Map Maker project file contains invalid JSON. Received ${JSON.stringify(receivedText.slice(0, 120))}.`,
        { cause: error },
      );
    }
    throw error;
  }
}

function requireSerializedMapMakerProject(receivedValue: unknown): SerializedMapMakerProject {
  if (
    receivedValue === null ||
    typeof receivedValue !== 'object' ||
    Array.isArray(receivedValue)
  ) {
    throw new Error(`Map Maker project file root must be an object. Received ${describeMapMakerValue(receivedValue)}.`);
  }
  const projectRecord = receivedValue as Record<string, unknown>;
  const actualFields = Object.keys(projectRecord).sort();
  if (actualFields.length !== 2 || actualFields[0] !== 'project' || actualFields[1] !== 'schemaVersion') {
    throw new Error(
      `Map Maker project file must contain exactly project and schemaVersion. Received ${describeMapMakerValue(projectRecord)}.`,
    );
  }
  if (projectRecord.schemaVersion !== MAP_MAKER_PROJECT_SCHEMA_VERSION) {
    throw new Error(
      `Map Maker project file schemaVersion must be ${MAP_MAKER_PROJECT_SCHEMA_VERSION}. Received ${describeMapMakerValue(projectRecord.schemaVersion)}.`,
    );
  }
  return {
    schemaVersion: MAP_MAKER_PROJECT_SCHEMA_VERSION,
    project: requireMapMakerProject(projectRecord.project),
  };
}

export function parseMapMakerProject(receivedText: string): MapMakerProject {
  const projectText = requireMapMakerProjectText(receivedText);
  return requireSerializedMapMakerProject(parseMapMakerJson(projectText)).project;
}
