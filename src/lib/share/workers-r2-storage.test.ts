import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  SHARE_IMAGE_CACHE_CONTROL,
  SHARE_MAX_IMAGE_BYTES,
} from './constants';
import {
  uploadShareImageToBucket,
  WorkersR2StorageError,
} from './workers-r2-storage';

function createFakeR2Bucket() {
  return {
    put: vi.fn(async () => null),
  };
}

describe('uploadShareImageToBucket', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('fails fast with a recognizable error when SHARE_BUCKET is missing', async () => {
    await expect(
      uploadShareImageToBucket({
        bucket: undefined,
        id: 'abc123def4',
        imageBytes: Uint8Array.of(1, 2, 3),
      }),
    ).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersR2StorageError
        && error.code === 'workers_r2_storage_error'
        && error.message === 'SHARE_BUCKET binding is missing; received undefined',
    );
  });

  it('fails fast on an invalid share id and does not call R2', async () => {
    const bucket = createFakeR2Bucket();

    await expect(
      uploadShareImageToBucket({
        bucket,
        id: 'short',
        imageBytes: Uint8Array.of(1, 2, 3),
      }),
    ).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersR2StorageError
        && error.message === 'Invalid share id; received "short"',
    );
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('fails fast on invalid image bytes and includes the received value', async () => {
    const bucket = createFakeR2Bucket();

    await expect(
      uploadShareImageToBucket({
        bucket,
        id: 'abc123def4',
        imageBytes: 'not-bytes',
      }),
    ).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersR2StorageError
        && error.message.includes('"not-bytes"'),
    );
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('fails fast when image bytes exceed the 5 MiB limit', async () => {
    const bucket = createFakeR2Bucket();
    const imageBytes = new Uint8Array(SHARE_MAX_IMAGE_BYTES + 1);

    await expect(
      uploadShareImageToBucket({
        bucket,
        id: 'abc123def4',
        imageBytes,
      }),
    ).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersR2StorageError
        && error.message.includes(`${SHARE_MAX_IMAGE_BYTES + 1} bytes`),
    );
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('writes shares/{id}.png with PNG cache metadata and returns the configured image URL', async () => {
    const bucket = createFakeR2Bucket();
    const imageBytes = Uint8Array.of(0x89, 0x50, 0x4e, 0x47);
    process.env = {
      ...originalEnv,
      R2_PUBLIC_BASE_URL: 'https://cdn.example.test/',
    };

    await expect(
      uploadShareImageToBucket({
        bucket,
        id: 'abc123def4',
        imageBytes,
      }),
    ).resolves.toEqual({
      key: 'shares/abc123def4.png',
      imageUrl: 'https://cdn.example.test/shares/abc123def4.png',
    });

    expect(bucket.put).toHaveBeenCalledTimes(1);
    expect(bucket.put).toHaveBeenCalledWith(
      'shares/abc123def4.png',
      imageBytes,
      {
        httpMetadata: {
          contentType: 'image/png',
          cacheControl: SHARE_IMAGE_CACHE_CONTROL,
        },
      },
    );
  });

  it('accepts a Node Buffer without copying it before the R2 put', async () => {
    const bucket = createFakeR2Bucket();
    const imageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

    await uploadShareImageToBucket({
      bucket,
      id: 'abc123def4',
      imageBytes: imageBuffer,
    });

    expect(bucket.put).toHaveBeenCalledWith(
      'shares/abc123def4.png',
      imageBuffer,
      expect.any(Object),
    );
  });

  it('propagates an unknown R2 put exception unchanged', async () => {
    const bucket = createFakeR2Bucket();
    const unexpected = new Error('R2 put failed');
    bucket.put.mockRejectedValueOnce(unexpected);

    await expect(
      uploadShareImageToBucket({
        bucket,
        id: 'abc123def4',
        imageBytes: Uint8Array.of(1, 2, 3),
      }),
    ).rejects.toBe(unexpected);
  });
});
