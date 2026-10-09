import { type CastleProject } from './types';
import { validateCastleProject } from './project';

export const MAX_CASTLE_PROJECT_FILE_BYTES = 2 * 1024 * 1024;

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

function requireProjectFileText(value: unknown): string {
  if (typeof value !== 'string') {
    throw new TypeError(
      `Castle project file must be a JSON string. Received ${describeReceivedValue(value)}.`,
    );
  }

  const byteLength = new TextEncoder().encode(value).byteLength;
  if (byteLength > MAX_CASTLE_PROJECT_FILE_BYTES) {
    throw new RangeError(
      `Castle project file exceeds ${MAX_CASTLE_PROJECT_FILE_BYTES} bytes. Received ${byteLength} bytes.`,
    );
  }

  return value;
}

function validateProject(value: unknown, sourceLabel: string): CastleProject {
  try {
    return validateCastleProject(value);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Castle ${sourceLabel} is invalid: ${error.message}`);
    }

    throw error;
  }
}

export function serializeCastleProject(project: CastleProject): string {
  const validatedProject = validateProject(project, 'project');
  const serializedProject = JSON.stringify(validatedProject);
  if (typeof serializedProject !== 'string') {
    throw new Error(
      `Castle project could not be serialized. Received ${describeReceivedValue(validatedProject)}.`,
    );
  }

  const serializedBytes = new TextEncoder().encode(serializedProject).byteLength;
  if (serializedBytes > MAX_CASTLE_PROJECT_FILE_BYTES) {
    throw new RangeError(
      `Castle project exceeds ${MAX_CASTLE_PROJECT_FILE_BYTES} bytes after serialization. Received ${serializedBytes} bytes.`,
    );
  }

  return serializedProject;
}

export function parseCastleProjectFile(text: string): CastleProject {
  const serializedProject = requireProjectFileText(text);
  let parsedProject: unknown;

  try {
    parsedProject = JSON.parse(serializedProject);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(
        `Castle project file has invalid JSON syntax. Received ${JSON.stringify(serializedProject.slice(0, 120))}.`,
      );
    }

    throw error;
  }

  return validateProject(parsedProject, 'project file');
}
