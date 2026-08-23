// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultProject } from './assets';
import {
  clearLocalUploadBlobMemoryForTests,
  clearLocalUploadBlobStore,
  deleteLocalUploadBlob,
  deleteLocalUploadBlobs,
  deleteLocalUploadBlobsNotInProjects,
  getLocalUploadBlob,
  putLocalUploadBlob,
  requireLocalUploadDataUrl,
} from './local-upload-blobs';

afterEach(() => {
  clearLocalUploadBlobMemoryForTests();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('local upload blob store', () => {
  it('puts a blob then exposes a matching data URL and the same byte length', async () => {
    const blob = pngBlob(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]));

    await putLocalUploadBlob({
      uploadId: 'upload-png',
      mimeType: 'image/png',
      fileName: 'crest.png',
      blob,
    });

    const dataUrl = requireLocalUploadDataUrl('upload-png');
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    expect(decodeDataUrlBytes(dataUrl, 'image/png')).toEqual(new Uint8Array(await blob.arrayBuffer()));

    const storedBlob = await getLocalUploadBlob('upload-png');
    expect(storedBlob.size).toBe(blob.size);
    expect(storedBlob).toBe(blob);
  });

  it('round-trips jpeg, webp and svg mime types in the data URL prefix', async () => {
    await putLocalUploadBlob({
      uploadId: 'upload-jpeg',
      mimeType: 'image/jpeg',
      fileName: 'crest.jpg',
      blob: typedBlob('image/jpeg', new Uint8Array([0xff, 0xd8, 0xff])),
    });
    await putLocalUploadBlob({
      uploadId: 'upload-webp',
      mimeType: 'image/webp',
      fileName: 'crest.webp',
      blob: typedBlob('image/webp', new Uint8Array([0x52, 0x49, 0x46, 0x46])),
    });
    await putLocalUploadBlob({
      uploadId: 'upload-svg',
      mimeType: 'image/svg+xml',
      fileName: 'crest.svg',
      blob: typedBlob('image/svg+xml', new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>')),
    });

    expect(requireLocalUploadDataUrl('upload-jpeg').startsWith('data:image/jpeg;base64,')).toBe(true);
    expect(requireLocalUploadDataUrl('upload-webp').startsWith('data:image/webp;base64,')).toBe(true);
    expect(requireLocalUploadDataUrl('upload-svg').startsWith('data:image/svg+xml;base64,')).toBe(true);
  });

  it('throws after delete with the missing uploadId', async () => {
    const blob = pngBlob(new Uint8Array([1, 2, 3, 4]));
    await putLocalUploadBlob({
      uploadId: 'to-delete',
      mimeType: 'image/png',
      fileName: 'gone.png',
      blob,
    });

    await deleteLocalUploadBlob('to-delete');

    await expect(getLocalUploadBlob('to-delete')).rejects.toThrow('Unknown local upload blob: to-delete');
    expect(() => requireLocalUploadDataUrl('to-delete')).toThrow('Unknown local upload data URL: to-delete');
  });

  it('throws for a missing get with the uploadId', async () => {
    await expect(getLocalUploadBlob('missing-upload')).rejects.toThrow('Unknown local upload blob: missing-upload');
  });

  it('rejects an empty uploadId with the received value', async () => {
    await expect(
      putLocalUploadBlob({
        uploadId: '',
        mimeType: 'image/png',
        fileName: 'crest.png',
        blob: pngBlob(new Uint8Array([1])),
      }),
    ).rejects.toThrow('Invalid uploadId: ');
  });

  it('rejects an empty fileName with the received value', async () => {
    await expect(
      putLocalUploadBlob({
        uploadId: 'upload-empty-name',
        mimeType: 'image/png',
        fileName: '',
        blob: pngBlob(new Uint8Array([1])),
      }),
    ).rejects.toThrow('Invalid fileName: ');
  });

  it('rejects an unsupported mimeType with the received value', async () => {
    await expect(
      putLocalUploadBlob({
        uploadId: 'upload-gif',
        mimeType: 'image/gif',
        fileName: 'crest.gif',
        blob: typedBlob('image/gif', new Uint8Array([1, 2, 3])),
      }),
    ).rejects.toThrow('Unsupported local upload mimeType: image/gif');
  });

  it('rejects a zero-size blob with the received byteLength', async () => {
    await expect(
      putLocalUploadBlob({
        uploadId: 'upload-empty',
        mimeType: 'image/png',
        fileName: 'empty.png',
        blob: pngBlob(new Uint8Array()),
      }),
    ).rejects.toThrow('Invalid local upload byteLength: 0');
    await expect(
      putLocalUploadBlob({
        uploadId: 'upload-empty',
        mimeType: 'image/png',
        fileName: 'empty.png',
        blob: pngBlob(new Uint8Array()),
      }),
    ).rejects.toThrow('upload-empty');
  });

  it('does not throw when deleting a missing uploadId', async () => {
    await expect(deleteLocalUploadBlob('never-stored')).resolves.toBeUndefined();
  });

  it('deletes several upload ids one by one and rejects an empty list', async () => {
    await putLocalUploadBlob({
      uploadId: 'one',
      mimeType: 'image/png',
      fileName: 'one.png',
      blob: pngBlob(new Uint8Array([1])),
    });
    await putLocalUploadBlob({
      uploadId: 'two',
      mimeType: 'image/png',
      fileName: 'two.png',
      blob: pngBlob(new Uint8Array([2])),
    });

    await deleteLocalUploadBlobs(['one', 'two']);

    await expect(getLocalUploadBlob('one')).rejects.toThrow('Unknown local upload blob: one');
    await expect(getLocalUploadBlob('two')).rejects.toThrow('Unknown local upload blob: two');
    await expect(deleteLocalUploadBlobs([])).rejects.toThrow('Invalid local upload id list length: 0');
  });

  it('throws when FileReader fails, including uploadId, fileName, mimeType and byteLength', async () => {
    vi.stubGlobal(
      'FileReader',
      class FailingFileReader {
        result = null;
        error = new Error('read aborted');
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        readAsDataURL() {
          this.onerror?.();
        }
      },
    );
    const blob = pngBlob(new Uint8Array([9, 8, 7, 6]));

    await expect(
      putLocalUploadBlob({
        uploadId: 'unreadable',
        mimeType: 'image/png',
        fileName: 'broken.png',
        blob,
      }),
    ).rejects.toThrow(/unreadable/);
    await expect(
      putLocalUploadBlob({
        uploadId: 'unreadable',
        mimeType: 'image/png',
        fileName: 'broken.png',
        blob,
      }),
    ).rejects.toThrow('broken.png');
    await expect(
      putLocalUploadBlob({
        uploadId: 'unreadable',
        mimeType: 'image/png',
        fileName: 'broken.png',
        blob,
      }),
    ).rejects.toThrow('image/png');
    await expect(
      putLocalUploadBlob({
        uploadId: 'unreadable',
        mimeType: 'image/png',
        fileName: 'broken.png',
        blob,
      }),
    ).rejects.toThrow(String(blob.size));
    await expect(
      putLocalUploadBlob({
        uploadId: 'unreadable',
        mimeType: 'image/png',
        fileName: 'broken.png',
        blob,
      }),
    ).rejects.toThrow('read aborted');
  });

  it('refills memory from IndexedDB after the in-memory maps are cleared', async () => {
    const recordsByUploadId = installMemoryIndexedDb();
    const blob = pngBlob(new Uint8Array([4, 5, 6, 7, 8]));

    await putLocalUploadBlob({
      uploadId: 'persisted',
      mimeType: 'image/png',
      fileName: 'persisted.png',
      blob,
    });
    expect(recordsByUploadId.get('persisted')?.byteLength).toBe(blob.size);

    clearLocalUploadBlobMemoryForTests();
    expect(() => requireLocalUploadDataUrl('persisted')).toThrow('Unknown local upload data URL: persisted');

    const restoredBlob = await getLocalUploadBlob('persisted');
    expect(restoredBlob.size).toBe(blob.size);
    expect(requireLocalUploadDataUrl('persisted').startsWith('data:image/png;base64,')).toBe(true);
  });

  it('throws IndexedDB open errors with uploadId, fileName, mimeType and byteLength', async () => {
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
    const blob = pngBlob(new Uint8Array([1, 2, 3, 4, 5]));

    await expect(
      putLocalUploadBlob({
        uploadId: 'quota-upload',
        mimeType: 'image/png',
        fileName: 'huge.png',
        blob,
      }),
    ).rejects.toThrow('quota-upload');
    await expect(
      putLocalUploadBlob({
        uploadId: 'quota-upload',
        mimeType: 'image/png',
        fileName: 'huge.png',
        blob,
      }),
    ).rejects.toThrow('huge.png');
    await expect(
      putLocalUploadBlob({
        uploadId: 'quota-upload',
        mimeType: 'image/png',
        fileName: 'huge.png',
        blob,
      }),
    ).rejects.toThrow('image/png');
    await expect(
      putLocalUploadBlob({
        uploadId: 'quota-upload',
        mimeType: 'image/png',
        fileName: 'huge.png',
        blob,
      }),
    ).rejects.toThrow(String(blob.size));
    await expect(
      putLocalUploadBlob({
        uploadId: 'quota-upload',
        mimeType: 'image/png',
        fileName: 'huge.png',
        blob,
      }),
    ).rejects.toThrow('QuotaExceededError');
  });

  it('deletes stored blobs that remaining projects do not reference', async () => {
    installMemoryIndexedDb();
    const keptBlob = pngBlob(new Uint8Array([1, 2, 3, 4]));
    const droppedBlob = pngBlob(new Uint8Array([5, 6, 7, 8]));
    await putLocalUploadBlob({
      uploadId: 'keep-me',
      mimeType: 'image/png',
      fileName: 'keep.png',
      blob: keptBlob,
    });
    await putLocalUploadBlob({
      uploadId: 'drop-me',
      mimeType: 'image/png',
      fileName: 'drop.png',
      blob: droppedBlob,
    });

    await deleteLocalUploadBlobsNotInProjects([
      {
        ...createDefaultProject('en'),
        uploads: [
          {
            id: 'keep-me',
            mimeType: 'image/png',
            encoding: 'indexed-db',
            byteLength: keptBlob.size,
          },
        ],
      },
    ]);

    expect((await getLocalUploadBlob('keep-me')).size).toBe(keptBlob.size);
    await expect(getLocalUploadBlob('drop-me')).rejects.toThrow('drop-me');
  });

  it('clears every stored blob from memory and IndexedDB', async () => {
    const recordsByUploadId = installMemoryIndexedDb();
    const blob = pngBlob(new Uint8Array([9, 8, 7, 6]));
    await putLocalUploadBlob({
      uploadId: 'clear-all',
      mimeType: 'image/png',
      fileName: 'clear.png',
      blob,
    });

    await clearLocalUploadBlobStore();

    expect(recordsByUploadId.size).toBe(0);
    await expect(getLocalUploadBlob('clear-all')).rejects.toThrow('clear-all');
    expect(() => requireLocalUploadDataUrl('clear-all')).toThrow('clear-all');
  });
});

function pngBlob(bytes: Uint8Array): Blob {
  return typedBlob('image/png', bytes);
}

function typedBlob(mimeType: string, bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: mimeType });
}

function decodeDataUrlBytes(dataUrl: string, mimeType: string): Uint8Array {
  const prefix = `data:${mimeType};base64,`;
  const base64 = dataUrl.slice(prefix.length);
  const binary = globalThis.atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
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
