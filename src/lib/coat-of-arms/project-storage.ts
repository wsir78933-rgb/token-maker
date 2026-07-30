import { getCoatAsset } from './assets';
import { assertCoatProject } from './commands';
import type { CoatProject } from './types';

export const COAT_PROJECT_STORAGE_KEY = 'coat-of-arms-maker-storage';
export const COAT_PROJECT_DRAFT_STORAGE_KEY = 'coat-of-arms-maker-draft';
export const MAX_COAT_PROJECT_DOCUMENT_BYTES = 1_048_576;
const PROJECT_DOCUMENT_VERSION = 1;

export interface CoatProjectRecord {
  id: string;
  name: string;
  project: CoatProject;
}

export type CoatProjectDraftInspection =
  | { status: 'missing' }
  | { status: 'available'; project: CoatProject }
  | { status: 'invalid'; error: string };

interface StoredProjectCollection {
  version: number;
  records: CoatProjectRecord[];
}

export function saveProjectRecord(record: CoatProjectRecord): void {
  assertProjectRecord(record);
  assertProjectDocumentByteLength(record.project);
  const storedCollection = readStoredProjectCollection();
  const remainingRecords = storedCollection.records.filter((candidate) => candidate.id !== record.id);
  writeStoredProjectCollection({
    version: PROJECT_DOCUMENT_VERSION,
    records: [...remainingRecords, cloneProjectRecord(record)],
  });
}

export function loadProjectRecord(projectId: string): CoatProjectRecord | null {
  assertNonEmptyString(projectId, 'project record id');
  const storedCollection = readStoredProjectCollection();
  const record = storedCollection.records.find((candidate) => candidate.id === projectId);
  return record ? cloneProjectRecord(record) : null;
}

export function listProjectRecords(): CoatProjectRecord[] {
  return readStoredProjectCollection().records.map(cloneProjectRecord);
}

export function deleteProjectRecord(projectId: string): void {
  assertNonEmptyString(projectId, 'project record id');
  const storedCollection = readStoredProjectCollection();
  if (!storedCollection.records.some((record) => record.id === projectId)) {
    throw new Error(`Unknown project record id: ${projectId}`);
  }
  writeStoredProjectCollection({
    version: PROJECT_DOCUMENT_VERSION,
    records: storedCollection.records.filter((record) => record.id !== projectId),
  });
}

export function exportProjectDocument(project: CoatProject): string {
  assertCoatProject(project);
  const serializedProject = JSON.stringify({ version: PROJECT_DOCUMENT_VERSION, ...project });
  assertSerializedProjectByteLength(serializedProject);
  return serializedProject;
}

export function importProjectDocument(serializedProject: string): CoatProject {
  if (typeof serializedProject !== 'string') {
    throw new Error(`Invalid serialized coat project: ${String(serializedProject)}`);
  }
  assertSerializedProjectByteLength(serializedProject);
  let parsedDocument: unknown;
  try {
    parsedDocument = JSON.parse(serializedProject);
  } catch {
    throw new Error('Invalid serialized coat project JSON');
  }
  if (!isRecord(parsedDocument)) throw new Error(`Invalid serialized coat project: ${String(parsedDocument)}`);
  assertExactKeys(parsedDocument, ['version', 'id', 'locale', 'name', 'canvas', 'palette', 'uploads', 'groups', 'layers'], 'coat project document');
  if (parsedDocument.version !== PROJECT_DOCUMENT_VERSION) {
    throw new Error(`Unsupported coat project document version: ${String(parsedDocument.version)}`);
  }
  assertDocumentAssetReferences(parsedDocument.layers);
  const project = { ...parsedDocument };
  delete project.version;
  assertCoatProject(project);
  return cloneProject(project);
}

/** Writes a recoverable work-in-progress document without touching named saved projects. */
export function saveProjectDraft(project: CoatProject): void {
  assertCoatProject(project);
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

export function discardProjectDraft(): void {
  getBrowserStorage().removeItem(COAT_PROJECT_DRAFT_STORAGE_KEY);
}

export function hasCoatProjectBrowserStorage(): boolean {
  return typeof globalThis.localStorage !== 'undefined';
}

function assertProjectRecord(record: unknown): asserts record is CoatProjectRecord {
  if (!isRecord(record)) throw new Error(`Invalid coat project record: ${String(record)}`);
  assertExactKeys(record, ['id', 'name', 'project'], 'coat project record');
  assertNonEmptyString(record.id, 'project record id');
  assertNonEmptyString(record.name, 'project record name');
  assertCoatProject(record.project);
  assertProjectDocumentByteLength(record.project);
  if (record.id !== record.project.id) {
    throw new Error(`Project record id does not match project id: ${record.id}`);
  }
}

function readStoredProjectCollection(): StoredProjectCollection {
  const serializedCollection = getBrowserStorage().getItem(COAT_PROJECT_STORAGE_KEY);
  if (serializedCollection === null) return { version: PROJECT_DOCUMENT_VERSION, records: [] };
  let parsedCollection: unknown;
  try {
    parsedCollection = JSON.parse(serializedCollection);
  } catch {
    throw new Error(`Invalid stored coat project collection: ${COAT_PROJECT_STORAGE_KEY}`);
  }
  if (!isRecord(parsedCollection)) throw new Error(`Invalid stored coat project collection ${COAT_PROJECT_STORAGE_KEY}: ${String(parsedCollection)}`);
  assertExactKeys(parsedCollection, ['version', 'records'], 'stored coat project collection');
  if (parsedCollection.version !== PROJECT_DOCUMENT_VERSION || !Array.isArray(parsedCollection.records)) {
    throw new Error(`Invalid stored coat project collection ${COAT_PROJECT_STORAGE_KEY} version or shape: ${String(parsedCollection.version)}`);
  }
  const recordIds = new Set<string>();
  for (const record of parsedCollection.records) {
    assertProjectRecord(record);
    if (recordIds.has(record.id)) throw new Error(`Duplicate stored project record id: ${record.id}`);
    recordIds.add(record.id);
  }
  return { version: PROJECT_DOCUMENT_VERSION, records: parsedCollection.records.map(cloneProjectRecord) };
}

function writeStoredProjectCollection(collection: StoredProjectCollection): void {
  getBrowserStorage().setItem(COAT_PROJECT_STORAGE_KEY, JSON.stringify(collection));
}

function assertProjectDocumentByteLength(project: CoatProject): void {
  assertSerializedProjectByteLength(JSON.stringify({ version: PROJECT_DOCUMENT_VERSION, ...project }));
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

function assertDocumentAssetReferences(layers: unknown): void {
  if (!Array.isArray(layers)) return;
  for (const layer of layers) {
    if (!isRecord(layer) || typeof layer.assetId !== 'string') continue;
    getCoatAsset(layer.assetId);
  }
}

function cloneProjectRecord(record: CoatProjectRecord): CoatProjectRecord {
  return { id: record.id, name: record.name, project: cloneProject(record.project) };
}

function cloneProject(project: CoatProject): CoatProject {
  return JSON.parse(JSON.stringify(project)) as CoatProject;
}

function getBrowserStorage(): Storage {
  const browserStorage = globalThis.localStorage;
  if (!browserStorage) throw new Error('Browser localStorage is unavailable for coat project storage');
  return browserStorage;
}

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(`Invalid ${label}: ${String(value)}`);
}

function assertExactKeys(record: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const recordKey of Object.keys(record)) {
    if (!allowedKeys.includes(recordKey)) throw new Error(`Invalid ${label} property: ${recordKey}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
