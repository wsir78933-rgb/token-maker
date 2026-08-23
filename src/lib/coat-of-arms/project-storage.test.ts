// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProject } from './assets';
import {
  clearLocalUploadBlobMemoryForTests,
  getLocalUploadBlob,
  putLocalUploadBlob,
  requireLocalUploadDataUrl,
} from './local-upload-blobs';
import {
  COAT_PROJECT_DRAFT_STORAGE_KEY,
  MAX_COAT_PROJECT_DOCUMENT_BYTES,
  discardProjectDraft,
  hydrateLocalUploadBlobsForProject,
  loadProjectDraft,
  saveProjectDraft,
} from './project-storage';
import type { CoatProject } from './types';

describe('coat project local storage', () => {
  beforeEach(() => {
    localStorage.clear();
    clearLocalUploadBlobMemoryForTests();
  });

  afterEach(() => {
    clearLocalUploadBlobMemoryForTests();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('stores a recoverable draft without using a Token Maker key', async () => {
    const draftProject = { ...createDefaultProject('zh'), name: '未保存草稿' };
    saveProjectDraft(draftProject);

    expect(COAT_PROJECT_DRAFT_STORAGE_KEY).toBe('coat-of-arms-maker-draft');
    expect(COAT_PROJECT_DRAFT_STORAGE_KEY).not.toContain('token-maker');
    const loadedDraft = loadProjectDraft();
    expect(loadedDraft).toEqual(draftProject);
    expect(loadedDraft).not.toBe(draftProject);
    await discardProjectDraft();
    expect(loadProjectDraft()).toBeNull();
  });

  it('fails fast and preserves malformed local drafts until an explicit discard', () => {
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, '{');
    expect(() => loadProjectDraft()).toThrow('Invalid coat project draft JSON');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe('{');

    const invalidDraft = JSON.stringify({ version: 1, project: { remoteUrl: 'https://example.com' } });
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, invalidDraft);
    expect(() => loadProjectDraft()).toThrow('remoteUrl');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe(invalidDraft);
  });

  it('rejects an oversized draft document', () => {
    const oversizedProject = { ...createDefaultProject('en'), id: `id-${'x'.repeat(1_048_576)}` };

    expect(() => saveProjectDraft(oversizedProject)).toThrow('limit is 1048576');
  });

  it('round-trips persisted group metadata through a draft', () => {
    const project = { ...createDefaultProject('en'), groups: [{ id: 'pair', opacity: 0.45 }] };
    const groupedProject = {
      ...project,
      layers: project.layers.map((layer, index) => (
        index === 0 || index === 1 ? { ...layer, groupId: 'pair' } : layer
      )),
    };
    saveProjectDraft(groupedProject);

    expect(loadProjectDraft()?.groups).toEqual([{ id: 'pair', opacity: 0.45 }]);
  });

  it('round-trips rasterTint through a local draft without changing omitted layers', () => {
    const baseProject = createDefaultProject('en');
    const project = {
      ...baseProject,
      layers: [
        ...baseProject.layers,
        {
          id: 'tinted-charge',
          type: 'charge' as const,
          assetId: 'material-symbol-alchemical-fire',
          color: '#1855A5',
          rasterTint: true,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
          visible: true,
          locked: false,
          groupId: null,
        },
        {
          id: 'untinted-ordinary',
          type: 'ordinary' as const,
          assetId: 'material-ordinary-gusset',
          color: '#B11F24',
          rasterTint: false,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
          visible: true,
          locked: false,
          groupId: null,
        },
      ],
    };
    saveProjectDraft(project);

    const loadedDraft = loadProjectDraft();
    expect(loadedDraft).toEqual(project);
    expect(loadedDraft?.layers.find((layer) => layer.id === 'tinted-charge')).toMatchObject({ rasterTint: true });
    expect(loadedDraft?.layers.find((layer) => layer.id === 'untinted-ordinary')).toMatchObject({ rasterTint: false });
    expect(loadedDraft?.layers.find((layer) => layer.type === 'shield')).not.toHaveProperty('rasterTint');
  });

  it('rejects a draft whose rasterTint is not a boolean', () => {
    const baseProject = createDefaultProject('en');
    const invalidDraft = JSON.stringify({
      version: 1,
      project: {
        ...baseProject,
        layers: [
          ...baseProject.layers,
          {
            id: 'invalid-tint-charge',
            type: 'charge',
            assetId: 'material-symbol-alchemical-fire',
            color: '#1855A5',
            rasterTint: 'yes',
            transform: { x: 0, y: 0, scale: 1, rotation: 0 },
            visible: true,
            locked: false,
            groupId: null,
          },
        ],
      },
    });
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, invalidDraft);

    expect(() => loadProjectDraft()).toThrow('Invalid raster tint: yes');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe(invalidDraft);
  });

  it('saves an indexed-db upload without embedding image bytes even when byteLength is 2000000', async () => {
    const uploadId = 'indexed-large';
    const blob = pngBlob(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]));
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'large.png',
      blob,
    });
    const project = projectWithIndexedDbUpload(uploadId, 2_000_000);

    saveProjectDraft(project);

    const serializedDraft = localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY);
    if (serializedDraft === null) throw new Error('Expected a saved coat project draft');
    expect(new TextEncoder().encode(serializedDraft).byteLength).toBeLessThan(MAX_COAT_PROJECT_DOCUMENT_BYTES);
    const parsedDraft: unknown = JSON.parse(serializedDraft);
    if (!isRecord(parsedDraft) || !isRecord(parsedDraft.project) || !Array.isArray(parsedDraft.project.uploads)) {
      throw new Error(`Invalid saved coat project draft: ${serializedDraft}`);
    }
    expect(parsedDraft.project.uploads).toEqual([
      { id: uploadId, mimeType: 'image/png', encoding: 'indexed-db', byteLength: 2_000_000 },
    ]);
    expect(parsedDraft.project.uploads[0]).not.toHaveProperty('data');
    expect(loadProjectDraft()?.uploads[0]).toEqual({
      id: uploadId, mimeType: 'image/png', encoding: 'indexed-db', byteLength: 2_000_000,
    });
  });

  it('throws when saving an indexed-db upload that is missing from the memory cache', () => {
    const uploadId = 'missing-cache';
    const project = projectWithIndexedDbUpload(uploadId, 12);

    expect(() => saveProjectDraft(project)).toThrow(uploadId);
  });

  it('hydrates an indexed-db blob from IndexedDB after the memory cache is cleared', async () => {
    installMemoryIndexedDb();
    const uploadId = 'hydrate-roundtrip';
    const blob = pngBlob(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 9, 8, 7]));
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'roundtrip.png',
      blob,
    });
    const project = projectWithIndexedDbUpload(uploadId, blob.size);
    saveProjectDraft(project);
    clearLocalUploadBlobMemoryForTests();
    expect(() => requireLocalUploadDataUrl(uploadId)).toThrow(uploadId);

    const loadedDraft = loadProjectDraft();
    if (!loadedDraft) throw new Error('Expected a loaded coat project draft');
    await hydrateLocalUploadBlobsForProject(loadedDraft);

    expect(requireLocalUploadDataUrl(uploadId).startsWith('data:image/png;base64,')).toBe(true);
  });

  it('throws when a hydrated blob size does not match the indexed-db byteLength', async () => {
    installMemoryIndexedDb();
    const uploadId = 'hydrate-mismatch';
    const blob = pngBlob(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 4, 5]));
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'mismatch.png',
      blob,
    });
    const project = projectWithIndexedDbUpload(uploadId, blob.size + 1);
    saveProjectDraft(project);
    clearLocalUploadBlobMemoryForTests();

    await expect(hydrateLocalUploadBlobsForProject(project)).rejects.toThrow(uploadId);
    await expect(hydrateLocalUploadBlobsForProject(project)).rejects.toThrow(String(blob.size));
    await expect(hydrateLocalUploadBlobsForProject(project)).rejects.toThrow(String(blob.size + 1));
  });

  it('deletes indexed-db blobs when a draft is discarded so a later get throws', async () => {
    installMemoryIndexedDb();
    const uploadId = 'discarded-blob';
    const blob = pngBlob(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 2, 2]));
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'discard.png',
      blob,
    });
    saveProjectDraft(projectWithIndexedDbUpload(uploadId, blob.size));

    await discardProjectDraft();

    expect(loadProjectDraft()).toBeNull();
    await expect(getLocalUploadBlob(uploadId)).rejects.toThrow(uploadId);
    expect(() => requireLocalUploadDataUrl(uploadId)).toThrow(uploadId);
  });

  it('clears stored blobs when discarding an invalid draft instead of skipping them', async () => {
    installMemoryIndexedDb();
    const uploadId = 'orphaned-invalid-draft';
    const blob = pngBlob(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 3, 3]));
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'orphaned.png',
      blob,
    });
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, '{');

    await discardProjectDraft();

    expect(loadProjectDraft()).toBeNull();
    await expect(getLocalUploadBlob(uploadId)).rejects.toThrow(uploadId);
    expect(() => requireLocalUploadDataUrl(uploadId)).toThrow(uploadId);
  });

  it('does not remove an invalid draft key when clearing blobs fails', async () => {
    localStorage.setItem(COAT_PROJECT_DRAFT_STORAGE_KEY, '{');
    vi.stubGlobal('indexedDB', {
      open() {
        const request: {
          result: undefined;
          error: Error;
          onsuccess: (() => void) | null;
          onerror: (() => void) | null;
          onupgradeneeded: (() => void) | null;
          onblocked: (() => void) | null;
        } = {
          result: undefined,
          error: new Error('QuotaExceededError'),
          onsuccess: null,
          onerror: null,
          onupgradeneeded: null,
          onblocked: null,
        };
        queueMicrotask(() => {
          request.onerror?.();
        });
        return request;
      },
    });

    await expect(discardProjectDraft()).rejects.toThrow('QuotaExceededError');
    expect(localStorage.getItem(COAT_PROJECT_DRAFT_STORAGE_KEY)).toBe('{');
  });
});

function projectWithIndexedDbUpload(uploadId: string, byteLength: number): CoatProject {
  return {
    ...createDefaultProject('en'),
    uploads: [
      {
        id: uploadId,
        mimeType: 'image/png',
        encoding: 'indexed-db',
        byteLength,
      },
    ],
  };
}

function pngBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: 'image/png' });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

interface MemoryIndexedDbRecord {
  uploadId: string;
  mimeType: string;
  byteLength: number;
  blob: Blob;
}

interface MemoryIdbRequest<T> {
  result: T;
  error: Error | null;
  onsuccess: (() => void) | null;
  onerror: (() => void) | null;
  onupgradeneeded: (() => void) | null;
}

function succeedOnMicrotask<T>(result: T): MemoryIdbRequest<T> {
  const request: MemoryIdbRequest<T> = {
    result,
    error: null,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
  };
  queueMicrotask(() => {
    request.onsuccess?.();
  });
  return request;
}

function installMemoryIndexedDb(): Map<string, MemoryIndexedDbRecord> {
  const recordsByUploadId = new Map<string, MemoryIndexedDbRecord>();
  const objectStoreNames = new Set<string>();
  const objectStore = {
    put(record: MemoryIndexedDbRecord) {
      recordsByUploadId.set(record.uploadId, record);
      return succeedOnMicrotask(record.uploadId);
    },
    get(uploadId: string) {
      return succeedOnMicrotask(recordsByUploadId.get(uploadId));
    },
    delete(uploadId: string) {
      recordsByUploadId.delete(uploadId);
      return succeedOnMicrotask(undefined);
    },
    getAllKeys() {
      return succeedOnMicrotask([...recordsByUploadId.keys()]);
    },
    clear() {
      recordsByUploadId.clear();
      return succeedOnMicrotask(undefined);
    },
  };
  const database = {
    objectStoreNames: {
      contains(name: string) {
        return objectStoreNames.has(name);
      },
    },
    createObjectStore(name: string) {
      objectStoreNames.add(name);
      return objectStore;
    },
    transaction() {
      return {
        objectStore() {
          return objectStore;
        },
        error: null,
        onerror: null as (() => void) | null,
        onabort: null as (() => void) | null,
      };
    },
    close() {},
  };

  vi.stubGlobal('indexedDB', {
    open() {
      const request: MemoryIdbRequest<typeof database> & { onblocked: (() => void) | null } = {
        result: database,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
        onblocked: null,
      };
      queueMicrotask(() => {
        request.onupgradeneeded?.();
        request.onsuccess?.();
      });
      return request;
    },
  });

  return recordsByUploadId;
}
