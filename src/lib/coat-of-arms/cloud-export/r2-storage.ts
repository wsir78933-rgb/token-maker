import type { ShareBucketBinding } from '@/lib/share/workers-r2-storage';
import { WorkersR2StorageError } from '@/lib/share/workers-r2-storage';
import {
  COAT_EXPORT_CACHE_CONTROL,
  getCoatExportContentType,
  getCoatExportObjectKey,
  type CoatCloudExportFileType,
} from './constants';

export interface UploadCoatExportObjectInput {
  bucket: ShareBucketBinding | null | undefined;
  id: string;
  fileType: CoatCloudExportFileType;
  fileBuffer: unknown;
}

function serializeReceivedValue(value: unknown) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return JSON.stringify(value);
  }
  if (value === undefined) return 'undefined';
  return String(value);
}

function requireCoatExportBucket(bucket: unknown): ShareBucketBinding {
  if (bucket == null) {
    throw new WorkersR2StorageError(
      `SHARE_BUCKET binding is missing; received ${serializeReceivedValue(bucket)}`,
    );
  }

  if (typeof bucket !== 'object') {
    throw new WorkersR2StorageError(
      `SHARE_BUCKET binding is invalid; received ${serializeReceivedValue(bucket)}`,
    );
  }

  const put = Reflect.get(bucket, 'put');
  if (typeof put !== 'function') {
    throw new WorkersR2StorageError(
      `SHARE_BUCKET binding is invalid; received put type ${typeof put}`,
    );
  }

  return bucket as ShareBucketBinding;
}

function requireCoatExportFileBytes(fileBuffer: unknown): asserts fileBuffer is Uint8Array {
  if (!(fileBuffer instanceof Uint8Array)) {
    throw new Error(
      `Invalid coat export file buffer: received ${serializeReceivedValue(fileBuffer)}`,
    );
  }
}

export async function uploadCoatExportObject({
  bucket,
  id,
  fileType,
  fileBuffer,
}: UploadCoatExportObjectInput): Promise<{ key: string }> {
  const shareBucket = requireCoatExportBucket(bucket);
  requireCoatExportFileBytes(fileBuffer);
  const key = getCoatExportObjectKey(id, fileType);

  await shareBucket.put(key, fileBuffer, {
    httpMetadata: {
      contentType: getCoatExportContentType(fileType),
      cacheControl: COAT_EXPORT_CACHE_CONTROL,
    },
  });

  return { key };
}
