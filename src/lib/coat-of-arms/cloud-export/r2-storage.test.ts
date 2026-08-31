import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CoatCloudExportFileType } from './constants';

const awsSdkMocks = vi.hoisted(() => ({
  send: vi.fn(async (command: unknown) => {
    void command;
    return {};
  }),
  putObjectCommandInputs: [] as Array<Record<string, unknown>>,
  s3ClientConfigs: [] as Array<Record<string, unknown>>,
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {
    constructor(config: Record<string, unknown>) {
      awsSdkMocks.s3ClientConfigs.push(config);
    }

    send(command: unknown) {
      return awsSdkMocks.send(command);
    }
  },
  PutObjectCommand: class {
    constructor(input: Record<string, unknown>) {
      awsSdkMocks.putObjectCommandInputs.push(input);
    }
  },
}));

import { uploadCoatExportObject } from './r2-storage';

function createCoatExportStorageEnv() {
  return {
    accountId: 'test-account',
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret',
    bucketName: 'tokenmaker-shares',
    publicBaseUrl: 'https://r2.tokenmaker.one',
  };
}

describe('uploadCoatExportObject', () => {
  beforeEach(() => {
    awsSdkMocks.send.mockClear();
    awsSdkMocks.send.mockResolvedValue({});
    awsSdkMocks.putObjectCommandInputs.length = 0;
    awsSdkMocks.s3ClientConfigs.length = 0;
  });

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
    'puts $fileType to R2 with coats/{id} key, content type, cache control, and body',
    async ({ fileType, expectedKey, expectedContentType }) => {
      const fileBuffer = Buffer.from(`coat-export-${fileType}`);
      const env = createCoatExportStorageEnv();

      const result = await uploadCoatExportObject({
        env,
        id: '0123456789',
        fileType,
        fileBuffer,
      });

      expect(result).toEqual({ key: expectedKey });
      expect(result).not.toHaveProperty('imageUrl');
      expect(result).not.toHaveProperty('shareUrl');
      expect(awsSdkMocks.s3ClientConfigs).toEqual([
        {
          region: 'auto',
          endpoint: 'https://test-account.r2.cloudflarestorage.com',
          credentials: {
            accessKeyId: 'test-access-key',
            secretAccessKey: 'test-secret',
          },
        },
      ]);
      expect(awsSdkMocks.putObjectCommandInputs).toEqual([
        {
          Bucket: 'tokenmaker-shares',
          Key: expectedKey,
          Body: fileBuffer,
          ContentType: expectedContentType,
          CacheControl: 'public, max-age=2592000, immutable',
        },
      ]);
      expect(awsSdkMocks.send).toHaveBeenCalledTimes(1);
    }
  );

  it('throws on invalid id and does not send PutObject', async () => {
    await expect(
      uploadCoatExportObject({
        env: createCoatExportStorageEnv(),
        id: 'short',
        fileType: 'png',
        fileBuffer: Buffer.from('png-bytes'),
      })
    ).rejects.toThrowError(/Invalid coat export id: "short"/);

    expect(awsSdkMocks.send).not.toHaveBeenCalled();
    expect(awsSdkMocks.putObjectCommandInputs).toHaveLength(0);
  });

  it('throws on invalid file type and includes the actual value', async () => {
    await expect(
      uploadCoatExportObject({
        env: createCoatExportStorageEnv(),
        id: '0123456789',
        fileType: 'webp' as CoatCloudExportFileType,
        fileBuffer: Buffer.from('webp-bytes'),
      })
    ).rejects.toThrowError(/webp/);

    expect(awsSdkMocks.send).not.toHaveBeenCalled();
  });

  it('throws on a non-buffer body and includes the actual value', async () => {
    await expect(
      uploadCoatExportObject({
        env: createCoatExportStorageEnv(),
        id: '0123456789',
        fileType: 'png',
        fileBuffer: 'not-a-buffer' as unknown as Buffer,
      })
    ).rejects.toThrowError(/Invalid coat export file buffer: "not-a-buffer"/);

    expect(awsSdkMocks.send).not.toHaveBeenCalled();
  });
});
