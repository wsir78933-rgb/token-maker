import {
  SHARE_IMAGE_CACHE_CONTROL,
  SHARE_MAX_IMAGE_BYTES,
  getShareObjectKey,
  isShareId,
} from './constants';
import { getConfiguredShareImageUrl } from './public-url';

export class WorkersR2StorageError extends Error {
  readonly code = 'workers_r2_storage_error' as const;
  readonly status = 503 as const;

  constructor(message: string) {
    super(message);
    this.name = 'WorkersR2StorageError';
  }
}

export interface ShareBucketBinding {
  put(
    key: string,
    imageBytes: Uint8Array,
    options?: {
      httpMetadata?: {
        contentType?: string;
        cacheControl?: string;
      };
    },
  ): Promise<unknown>;
}

export interface UploadShareImageToBucketInput {
  bucket: ShareBucketBinding | null | undefined;
  id: unknown;
  imageBytes: unknown;
}

export interface UploadShareImageToBucketResult {
  key: string;
  imageUrl: string;
}

function serializeReceivedValue(value: unknown) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return JSON.stringify(value);
  }
  if (value === undefined) return 'undefined';
  return String(value);
}

function requireShareBucketBinding(bucket: unknown): ShareBucketBinding {
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

function requireShareId(id: unknown): asserts id is string {
  if (typeof id !== 'string' || !isShareId(id)) {
    throw new WorkersR2StorageError(
      `Invalid share id; received ${serializeReceivedValue(id)}`,
    );
  }
}

function requireShareImageBytes(imageBytes: unknown): asserts imageBytes is Uint8Array {
  if (!(imageBytes instanceof Uint8Array)) {
    throw new WorkersR2StorageError(
      `Invalid share image bytes; expected Uint8Array or Buffer, received ${serializeReceivedValue(imageBytes)}`,
    );
  }

  if (imageBytes.byteLength > SHARE_MAX_IMAGE_BYTES) {
    throw new WorkersR2StorageError(
      `Share image bytes exceed ${SHARE_MAX_IMAGE_BYTES} bytes; received ${imageBytes.byteLength} bytes`,
    );
  }
}

export async function uploadShareImageToBucket({
  bucket,
  id,
  imageBytes,
}: UploadShareImageToBucketInput): Promise<UploadShareImageToBucketResult> {
  const shareBucket = requireShareBucketBinding(bucket);
  requireShareId(id);
  requireShareImageBytes(imageBytes);

  const key = getShareObjectKey(id);

  await shareBucket.put(key, imageBytes, {
    httpMetadata: {
      contentType: 'image/png',
      cacheControl: SHARE_IMAGE_CACHE_CONTROL,
    },
  });

  return {
    key,
    imageUrl: getConfiguredShareImageUrl(id),
  };
}
