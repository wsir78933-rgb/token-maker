import { describe, expect, it, vi } from 'vitest';
import type { CoatCloudExportFileType } from './constants';
import { uploadCoatExportObject } from './r2-storage';
import { WorkersR2StorageError } from '@/lib/share/workers-r2-storage';

function createFakeR2Bucket() {
  return {
    put: vi.fn(async () => null),
  };
}

describe('uploadCoatExportObject', () => {
  it.each([
    {
      fileType: 'png' as const,
      expectedKey: 'coats/0123456789.png',
      expectedContentType: 'image/png',
    },
    {
      fileType: 'jpeg' as const,
      expectedKey: 'coats/0123456789.jpg',
      expectedContentType: 'image/jpeg',
    },
    {
      fileType: 'pdf' as const,
      expectedKey: 'coats/0123456789.pdf',
      expectedContentType: 'application/pdf',
    },
  ])(
    'puts $fileType to SHARE_BUCKET with coats/{id} key, content type, cache control, and body',
    async ({ fileType, expectedKey, expectedContentType }) => {
      const fileBuffer = Buffer.from(`coat-export-${fileType}`);
      const bucket = createFakeR2Bucket();

      const result = await uploadCoatExportObject({
        bucket,
        id: '0123456789',
        fileType,
        fileBuffer,
      });

      expect(result).toEqual({ key: expectedKey });
      expect(result).not.toHaveProperty('imageUrl');
      expect(result).not.toHaveProperty('shareUrl');
      expect(bucket.put).toHaveBeenCalledTimes(1);
      expect(bucket.put).toHaveBeenCalledWith(expectedKey, fileBuffer, {
        httpMetadata: {
          contentType: expectedContentType,
          cacheControl: 'public, max-age=2592000, immutable',
        },
      });
    },
  );

  it('throws on invalid id and does not call R2', async () => {
    const bucket = createFakeR2Bucket();

    await expect(
      uploadCoatExportObject({
        bucket,
        id: 'short',
        fileType: 'png',
        fileBuffer: Buffer.from('png-bytes'),
      }),
    ).rejects.toThrowError(/Invalid coat export id: "short"/);

    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('throws on invalid file type and includes the actual value', async () => {
    const bucket = createFakeR2Bucket();

    await expect(
      uploadCoatExportObject({
        bucket,
        id: '0123456789',
        fileType: 'webp' as CoatCloudExportFileType,
        fileBuffer: Buffer.from('webp-bytes'),
      }),
    ).rejects.toThrowError(/webp/);

    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('throws on a non-byte body and includes the actual value', async () => {
    const bucket = createFakeR2Bucket();

    await expect(
      uploadCoatExportObject({
        bucket,
        id: '0123456789',
        fileType: 'png',
        fileBuffer: 'not-a-buffer',
      }),
    ).rejects.toThrowError(/Invalid coat export file buffer: received "not-a-buffer"/);

    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('fails fast when SHARE_BUCKET is missing', async () => {
    await expect(
      uploadCoatExportObject({
        bucket: undefined,
        id: '0123456789',
        fileType: 'png',
        fileBuffer: Buffer.from('png-bytes'),
      }),
    ).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof WorkersR2StorageError
        && error.message === 'SHARE_BUCKET binding is missing; received undefined',
    );
  });
});
