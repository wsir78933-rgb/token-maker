import { assertCoatProject } from './commands';
import {
  clearLocalUploadBlobStore,
  deleteLocalUploadBlobs,
  getLocalUploadBlob,
  requireLocalUploadDataUrl,
} from './local-upload-blobs';
import type { CoatProject, LocalUpload } from './types';

export const COAT_PROJECT_DRAFT_STORAGE_KEY = 'coat-of-arms-maker-draft';
export const MAX_COAT_PROJECT_DOCUMENT_BYTES = 1_048_576;
const PROJECT_DOCUMENT_VERSION = 1;

export type CoatProjectDraftInspection =
  | { status: 'missing' }
  | { status: 'available'; project: CoatProject }
  | { status: 'invalid'; error: string };

type IndexedDbLocalUpload = Extract<LocalUpload, { encoding: 'indexed-db' }>;

/** Writes a recoverable work-in-progress document to the draft key. */
export function saveProjectDraft(project: CoatProject): void {
  assertCoatProject(project);
  assertIndexedDbUploadsCachedForSave(project);
  const serializedDraft = JSON.stringify({ version: PROJECT_DOCUMENT_VERSION, project });
  assertSerializedProjectByteLength(serializedDraft);
  getBrowserStorage().setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, serializedDraft);
}

/** Returns a validated draft without deleting malformed browser data. */
export function loadProjectDraft(): CoatProject | null {
  const serializedDraft = getBrowserStorage().getItem(COAT_PROJECT_DRAFT_STORAGE_KEY);
  if (serializedDraft === null) return null;
  assertSerializedProjectByteLength(serializedDraft);
  let parsedDraft: unknown;
  try {
    parsedDraft = JSON.parse(serializedDraft);
  } catch {
    throw new Error('Invalid coat project draft JSON');
  }
  if (!isRecord(parsedDraft)) throw new Error('Invalid coat project draft record');
  assertExactKeys(parsedDraft, ['version', 'project'], 'coat project draft');
  if (parsedDraft.version !== PROJECT_DOCUMENT_VERSION) {
    throw new Error(`Unsupported coat project draft version: ${String(parsedDraft.version)}`);
  }
  assertCoatProject(parsedDraft.project);
  return cloneProject(parsedDraft.project);
}

/** Inspects a draft for recovery UI without deleting bytes or throwing during render. */
export function inspectProjectDraft(): CoatProjectDraftInspection {
  try {
    const project = loadProjectDraft();
    return project ? { status: 'available', project } : { status: 'missing' };
  } catch (caught) {
    return { status: 'invalid', error: caught instanceof Error ? caught.message : String(caught) };
  }
}

export async function discardProjectDraft(): Promise<void> {
  const serializedDraft = getBrowserStorage().getItem(COAT_PROJECT_DRAFT_STORAGE_KEY);
  if (serializedDraft === null) return;

  let loadedProject: CoatProject | null;
  try {
    loadedProject = loadProjectDraft();
  } catch {
    await clearLocalUploadBlobStore();
    getBrowserStorage().removeItem(COAT_PROJECT_DRAFT_STORAGE_KEY);
    return;
  }

  const indexedDbUploadIds = loadedProject === null
    ? []
    : indexedDbUploadsInProject(loadedProject).map((upload) => upload.id);
  if (indexedDbUploadIds.length > 0) {
    await deleteLocalUploadBlobs(indexedDbUploadIds);
  }
  getBrowserStorage().removeItem(COAT_PROJECT_DRAFT_STORAGE_KEY);
}

/** Loads IndexedDB blobs into memory so SVG render can read data URLs. */
export async function hydrateLocalUploadBlobsForProject(project: CoatProject): Promise<void> {
  assertCoatProject(project);
  for (const upload of indexedDbUploadsInProject(project)) {
    const blob = await getLocalUploadBlob(upload.id);
    if (blob.size !== upload.byteLength) {
      throw new Error(
        `Invalid local upload byteLength for ${upload.id}: ${upload.byteLength}; blob.size is ${blob.size}`,
      );
    }
  }
}

export function hasCoatProjectBrowserStorage(): boolean {
  return typeof globalThis.localStorage !== 'undefined';
}

function assertIndexedDbUploadsCachedForSave(project: CoatProject): void {
  for (const upload of indexedDbUploadsInProject(project)) {
    requireLocalUploadDataUrl(upload.id);
  }
}

function indexedDbUploadsInProject(project: CoatProject): IndexedDbLocalUpload[] {
  return project.uploads.filter((upload): upload is IndexedDbLocalUpload => upload.encoding === 'indexed-db');
}

function assertSerializedProjectByteLength(serializedProject: string): void {
  const serializedByteLength = getUtf8ByteLength(serializedProject);
  if (serializedByteLength > MAX_COAT_PROJECT_DOCUMENT_BYTES) {
    throw new Error(`Invalid coat project document byte length: ${serializedByteLength}; limit is ${MAX_COAT_PROJECT_DOCUMENT_BYTES}`);
  }
}

function getUtf8ByteLength(value: string): number {
  if (typeof TextEncoder !== 'function') throw new Error('UTF-8 encoder is unavailable for coat project storage');
  return new TextEncoder().encode(value).byteLength;
}

function cloneProject(project: CoatProject): CoatProject {
  return JSON.parse(JSON.stringify(project)) as CoatProject;
}

function getBrowserStorage(): Storage {
  const browserStorage = globalThis.localStorage;
  if (!browserStorage) throw new Error('Browser localStorage is unavailable for coat project storage');
  return browserStorage;
}

function assertExactKeys(record: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const recordKey of Object.keys(record)) {
    if (!allowedKeys.includes(recordKey)) throw new Error(`Invalid ${label} property: ${recordKey}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
