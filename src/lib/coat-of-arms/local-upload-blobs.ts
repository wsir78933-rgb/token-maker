import type { CoatProject } from './types';

const LOCAL_UPLOAD_BLOB_DATABASE_NAME = 'coat-of-arms-local-upload-blobs';
const LOCAL_UPLOAD_BLOB_OBJECT_STORE_NAME = 'blobs';
const LOCAL_UPLOAD_BLOB_DATABASE_VERSION = 1;
const LOCAL_UPLOAD_BLOB_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'] as const;

type LocalUploadBlobMimeType = (typeof LOCAL_UPLOAD_BLOB_MIME_TYPES)[number];

export interface PutLocalUploadBlobInput {
  uploadId: string;
  mimeType: string;
  fileName: string;
  blob: Blob;
}

interface PersistedLocalUploadBlobRecord {
  uploadId: string;
  mimeType: LocalUploadBlobMimeType;
  byteLength: number;
  blob: Blob;
}

const localUploadBlobsByUploadId = new Map<string, Blob>();
const localUploadDataUrlsByUploadId = new Map<string, string>();

/** Stores an original local-upload Blob in memory and, when present, IndexedDB. */
export async function putLocalUploadBlob(input: PutLocalUploadBlobInput): Promise<void> {
  const { uploadId, mimeType, fileName, blob } = requirePutLocalUploadBlobInput(input);
  const dataUrl = await readLocalUploadBlobAsDataUrl({ uploadId, mimeType, fileName, blob });
  if (hasIndexedDb()) {
    await persistLocalUploadBlobRecord({ uploadId, mimeType, byteLength: blob.size, blob }, fileName);
  }
  cacheLocalUploadBlobInMemory(uploadId, blob, dataUrl);
}

/** Returns the original Blob from memory, or IndexedDB after refilling the memory cache. */
export async function getLocalUploadBlob(uploadId: string): Promise<Blob> {
  const knownUploadId = requireNonEmptyUploadId(uploadId);
  const memoryBlob = localUploadBlobsByUploadId.get(knownUploadId);
  if (memoryBlob) return memoryBlob;
  if (!hasIndexedDb()) {
    throw new Error(`Unknown local upload blob: ${knownUploadId}`);
  }
  const persistedRecord = await readPersistedLocalUploadBlobRecord(knownUploadId);
  if (persistedRecord === null) {
    throw new Error(`Unknown local upload blob: ${knownUploadId}`);
  }
  const dataUrl = await readLocalUploadBlobAsDataUrl({
    uploadId: knownUploadId,
    mimeType: persistedRecord.mimeType,
    blob: persistedRecord.blob,
  });
  cacheLocalUploadBlobInMemory(knownUploadId, persistedRecord.blob, dataUrl);
  return persistedRecord.blob;
}

/** Synchronous data URL for SVG render. Throws unless the upload is already in the memory cache. */
export function requireLocalUploadDataUrl(uploadId: string): string {
  const knownUploadId = requireNonEmptyUploadId(uploadId);
  const dataUrl = localUploadDataUrlsByUploadId.get(knownUploadId);
  if (typeof dataUrl !== 'string') {
    throw new Error(`Unknown local upload data URL: ${knownUploadId}`);
  }
  return dataUrl;
}

/** Drops one upload from memory and IndexedDB. A missing IndexedDB key is success. */
export async function deleteLocalUploadBlob(uploadId: string): Promise<void> {
  const knownUploadId = requireNonEmptyUploadId(uploadId);
  forgetLocalUploadBlobInMemory(knownUploadId);
  if (!hasIndexedDb()) return;
  await deletePersistedLocalUploadBlob(knownUploadId);
}

/** Deletes each upload id in order through deleteLocalUploadBlob. */
export async function deleteLocalUploadBlobs(uploadIds: readonly string[]): Promise<void> {
  if (!Array.isArray(uploadIds)) {
    throw new Error(`Invalid local upload id list: ${String(uploadIds)}`);
  }
  if (uploadIds.length === 0) {
    throw new Error(`Invalid local upload id list length: ${uploadIds.length}`);
  }
  for (const uploadId of uploadIds) {
    await deleteLocalUploadBlob(uploadId);
  }
}

/** Deletes stored blobs whose upload ids are not referenced by any remaining project. */
export async function deleteLocalUploadBlobsNotInProjects(projects: readonly CoatProject[]): Promise<void> {
  if (!Array.isArray(projects)) {
    throw new Error(`Invalid coat project list: ${String(projects)}`);
  }
  const referencedUploadIds = new Set<string>();
  for (const project of projects) {
    for (const uploadId of indexedDbUploadIdsInProject(project)) {
      referencedUploadIds.add(uploadId);
    }
  }
  const unreferencedUploadIds = (await listStoredLocalUploadIds()).filter(
    (uploadId) => !referencedUploadIds.has(uploadId),
  );
  if (unreferencedUploadIds.length === 0) return;
  await deleteLocalUploadBlobs(unreferencedUploadIds);
}

/** Drops every in-memory and IndexedDB local-upload blob. */
export async function clearLocalUploadBlobStore(): Promise<void> {
  if (hasIndexedDb()) {
    await clearPersistedLocalUploadBlobs();
  }
  localUploadBlobsByUploadId.clear();
  localUploadDataUrlsByUploadId.clear();
}

/** Test-only: clears in-memory Blob and data URL maps. Does not touch IndexedDB. */
export function clearLocalUploadBlobMemoryForTests(): void {
  localUploadBlobsByUploadId.clear();
  localUploadDataUrlsByUploadId.clear();
}

function requirePutLocalUploadBlobInput(input: PutLocalUploadBlobInput): {
  uploadId: string;
  mimeType: LocalUploadBlobMimeType;
  fileName: string;
  blob: Blob;
} {
  const uploadId = requireNonEmptyUploadId(input.uploadId);
  const fileName = requireNonEmptyFileName(input.fileName);
  const mimeType = requireLocalUploadBlobMimeType(input.mimeType);
  const blob = requirePositiveSizeBlob(input.blob, { uploadId, fileName, mimeType });
  return { uploadId, mimeType, fileName, blob };
}

function requireNonEmptyUploadId(uploadId: unknown): string {
  if (typeof uploadId !== 'string' || uploadId.length === 0) {
    throw new Error(`Invalid uploadId: ${String(uploadId)}`);
  }
  return uploadId;
}

function requireNonEmptyFileName(fileName: unknown): string {
  if (typeof fileName !== 'string' || fileName.length === 0) {
    throw new Error(`Invalid fileName: ${String(fileName)}`);
  }
  return fileName;
}

function requireLocalUploadBlobMimeType(mimeType: unknown): LocalUploadBlobMimeType {
  if (typeof mimeType !== 'string' || !isLocalUploadBlobMimeType(mimeType)) {
    throw new Error(`Unsupported local upload mimeType: ${String(mimeType)}`);
  }
  return mimeType;
}

function isLocalUploadBlobMimeType(mimeType: string): mimeType is LocalUploadBlobMimeType {
  return (LOCAL_UPLOAD_BLOB_MIME_TYPES as readonly string[]).includes(mimeType);
}

function requirePositiveSizeBlob(
  blob: unknown,
  context: { uploadId: string; fileName: string; mimeType: LocalUploadBlobMimeType },
): Blob {
  if (!(blob instanceof Blob)) {
    throw new Error(
      `Invalid local upload blob for ${context.uploadId}; fileName is ${context.fileName}; mimeType is ${context.mimeType}; blob is ${String(blob)}`,
    );
  }
  if (!Number.isSafeInteger(blob.size) || blob.size <= 0) {
    throw new Error(
      `Invalid local upload byteLength: ${String(blob.size)}; uploadId is ${context.uploadId}; fileName is ${context.fileName}; mimeType is ${context.mimeType}`,
    );
  }
  return blob;
}

function readLocalUploadBlobAsDataUrl(input: {
  uploadId: string;
  mimeType: LocalUploadBlobMimeType;
  fileName?: string;
  blob: Blob;
}): Promise<string> {
  const { uploadId, mimeType, fileName, blob } = input;
  if (typeof FileReader !== 'function') {
    throw new Error(
      `FileReader is unavailable for local upload ${formatLocalUploadErrorContext({ uploadId, mimeType, fileName, byteLength: blob.size })}`,
    );
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(
        new Error(
          `Unable to read local upload ${formatLocalUploadErrorContext({ uploadId, mimeType, fileName, byteLength: blob.size })} as data URL; ${domErrorMessage(reader.error)}`,
        ),
      );
    };
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(
          new Error(
            `Invalid local upload data URL result for ${formatLocalUploadErrorContext({ uploadId, mimeType, fileName, byteLength: blob.size })}; result is ${String(reader.result)}`,
          ),
        );
        return;
      }
      const expectedPrefix = `data:${mimeType};base64,`;
      if (!reader.result.startsWith(expectedPrefix)) {
        reject(
          new Error(
            `Invalid local upload data URL for ${formatLocalUploadErrorContext({ uploadId, mimeType, fileName, byteLength: blob.size })}; result is ${reader.result.slice(0, 80)}`,
          ),
        );
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

function formatLocalUploadErrorContext(input: {
  uploadId: string;
  mimeType: string;
  fileName?: string;
  byteLength: number;
}): string {
  const fileNameClause = input.fileName === undefined ? '' : `; fileName is ${input.fileName}`;
  return `${input.uploadId}${fileNameClause}; mimeType is ${input.mimeType}; byteLength is ${input.byteLength}`;
}

function cacheLocalUploadBlobInMemory(uploadId: string, blob: Blob, dataUrl: string): void {
  localUploadBlobsByUploadId.set(uploadId, blob);
  localUploadDataUrlsByUploadId.set(uploadId, dataUrl);
}

function forgetLocalUploadBlobInMemory(uploadId: string): void {
  localUploadBlobsByUploadId.delete(uploadId);
  localUploadDataUrlsByUploadId.delete(uploadId);
}

function indexedDbUploadIdsInProject(project: CoatProject): string[] {
  if (!isRecord(project) || !Array.isArray(project.uploads)) {
    throw new Error(`Invalid coat project uploads: ${String(project)}`);
  }
  const uploadIds: string[] = [];
  for (const upload of project.uploads) {
    if (!isRecord(upload)) {
      throw new Error(`Invalid local upload: ${String(upload)}`);
    }
    if (upload.encoding !== 'indexed-db') continue;
    if (typeof upload.id !== 'string' || upload.id.length === 0) {
      throw new Error(`Invalid uploadId: ${String(upload.id)}`);
    }
    uploadIds.push(upload.id);
  }
  return uploadIds;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function listStoredLocalUploadIds(): Promise<string[]> {
  const storedUploadIds = new Set<string>(localUploadBlobsByUploadId.keys());
  if (!hasIndexedDb()) return [...storedUploadIds];
  for (const uploadId of await listPersistedLocalUploadIds()) {
    storedUploadIds.add(uploadId);
  }
  return [...storedUploadIds];
}

function hasIndexedDb(): boolean {
  return typeof globalThis.indexedDB === 'object' && globalThis.indexedDB !== null;
}

async function persistLocalUploadBlobRecord(
  record: PersistedLocalUploadBlobRecord,
  fileName: string,
): Promise<void> {
  try {
    const database = await openLocalUploadBlobDatabase();
    try {
      await runLocalUploadBlobStoreRequest(database, 'readwrite', (objectStore) => objectStore.put(record));
    } finally {
      database.close();
    }
  } catch (caught) {
    throw new Error(
      `Unable to persist local upload blob ${record.uploadId}; fileName is ${fileName}; mimeType is ${record.mimeType}; byteLength is ${record.byteLength}; ${unknownErrorMessage(caught)}`,
    );
  }
}

async function readPersistedLocalUploadBlobRecord(uploadId: string): Promise<PersistedLocalUploadBlobRecord | null> {
  try {
    const database = await openLocalUploadBlobDatabase();
    let persistedValue: unknown;
    try {
      persistedValue = await runLocalUploadBlobStoreRequest(database, 'readonly', (objectStore) =>
        objectStore.get(uploadId),
      );
    } finally {
      database.close();
    }
    if (persistedValue === undefined) return null;
    return requirePersistedLocalUploadBlobRecord(persistedValue, uploadId);
  } catch (caught) {
    throw new Error(`Unable to read local upload blob ${uploadId}; ${unknownErrorMessage(caught)}`);
  }
}

async function deletePersistedLocalUploadBlob(uploadId: string): Promise<void> {
  try {
    const database = await openLocalUploadBlobDatabase();
    try {
      await runLocalUploadBlobStoreRequest(database, 'readwrite', (objectStore) => objectStore.delete(uploadId));
    } finally {
      database.close();
    }
  } catch (caught) {
    throw new Error(`Unable to delete local upload blob ${uploadId}; ${unknownErrorMessage(caught)}`);
  }
}

async function listPersistedLocalUploadIds(): Promise<string[]> {
  try {
    const database = await openLocalUploadBlobDatabase();
    let persistedKeys: unknown;
    try {
      persistedKeys = await runLocalUploadBlobStoreRequest(database, 'readonly', (objectStore) => objectStore.getAllKeys());
    } finally {
      database.close();
    }
    if (!Array.isArray(persistedKeys)) {
      throw new Error(`Invalid persisted local upload id list: ${String(persistedKeys)}`);
    }
    return persistedKeys.map((uploadId) => {
      if (typeof uploadId !== 'string' || uploadId.length === 0) {
        throw new Error(`Invalid persisted local upload id: ${String(uploadId)}`);
      }
      return uploadId;
    });
  } catch (caught) {
    throw new Error(`Unable to list local upload blobs; ${unknownErrorMessage(caught)}`);
  }
}

async function clearPersistedLocalUploadBlobs(): Promise<void> {
  try {
    const database = await openLocalUploadBlobDatabase();
    try {
      await runLocalUploadBlobStoreRequest(database, 'readwrite', (objectStore) => objectStore.clear());
    } finally {
      database.close();
    }
  } catch (caught) {
    throw new Error(`Unable to clear local upload blob store; ${unknownErrorMessage(caught)}`);
  }
}

function requirePersistedLocalUploadBlobRecord(value: unknown, uploadId: string): PersistedLocalUploadBlobRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid persisted local upload blob record for ${uploadId}: ${String(value)}`);
  }
  const record = value as Record<string, unknown>;
  if (record.uploadId !== uploadId) {
    throw new Error(`Invalid persisted local upload blob id for ${uploadId}: ${String(record.uploadId)}`);
  }
  if (typeof record.mimeType !== 'string' || !isLocalUploadBlobMimeType(record.mimeType)) {
    throw new Error(`Unsupported persisted local upload mimeType for ${uploadId}: ${String(record.mimeType)}`);
  }
  if (!(record.blob instanceof Blob)) {
    throw new Error(`Invalid persisted local upload blob for ${uploadId}: ${String(record.blob)}`);
  }
  if (!Number.isSafeInteger(record.blob.size) || record.blob.size <= 0) {
    throw new Error(`Invalid persisted local upload byteLength for ${uploadId}: ${String(record.blob.size)}`);
  }
  if (record.byteLength !== record.blob.size) {
    throw new Error(
      `Invalid persisted local upload byteLength for ${uploadId}: ${String(record.byteLength)}; blob.size is ${record.blob.size}`,
    );
  }
  return {
    uploadId,
    mimeType: record.mimeType,
    byteLength: record.blob.size,
    blob: record.blob,
  };
}

function openLocalUploadBlobDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let openRequest: IDBOpenDBRequest;
    try {
      openRequest = globalThis.indexedDB.open(LOCAL_UPLOAD_BLOB_DATABASE_NAME, LOCAL_UPLOAD_BLOB_DATABASE_VERSION);
    } catch (caught) {
      reject(caught instanceof Error ? caught : new Error(String(caught)));
      return;
    }
    openRequest.onerror = () => {
      reject(new Error(`IndexedDB open failed: ${domErrorMessage(openRequest.error)}`));
    };
    openRequest.onblocked = () => {
      reject(new Error(`IndexedDB open blocked for ${LOCAL_UPLOAD_BLOB_DATABASE_NAME}`));
    };
    openRequest.onupgradeneeded = () => {
      const database = openRequest.result;
      if (!database.objectStoreNames.contains(LOCAL_UPLOAD_BLOB_OBJECT_STORE_NAME)) {
        database.createObjectStore(LOCAL_UPLOAD_BLOB_OBJECT_STORE_NAME, { keyPath: 'uploadId' });
      }
    };
    openRequest.onsuccess = () => {
      resolve(openRequest.result);
    };
  });
}

function runLocalUploadBlobStoreRequest<T>(
  database: IDBDatabase,
  mode: IDBTransactionMode,
  startRequest: (objectStore: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(LOCAL_UPLOAD_BLOB_OBJECT_STORE_NAME, mode);
    transaction.onerror = () => {
      reject(new Error(`IndexedDB transaction failed: ${domErrorMessage(transaction.error)}`));
    };
    transaction.onabort = () => {
      reject(new Error(`IndexedDB transaction aborted: ${domErrorMessage(transaction.error)}`));
    };
    const request = startRequest(transaction.objectStore(LOCAL_UPLOAD_BLOB_OBJECT_STORE_NAME));
    request.onerror = () => {
      reject(new Error(`IndexedDB request failed: ${domErrorMessage(request.error)}`));
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function domErrorMessage(error: DOMException | Error | null): string {
  if (error == null) return 'unknown error';
  if (typeof error.message === 'string' && error.message.length > 0) return error.message;
  if (typeof error.name === 'string' && error.name.length > 0) return error.name;
  return String(error);
}

function unknownErrorMessage(caught: unknown): string {
  if (caught instanceof Error) return caught.message;
  return String(caught);
}
