import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { getShareStorageEnv } from '@/lib/share/r2-storage';
import {
  COAT_EXPORT_CACHE_CONTROL,
  getCoatExportContentType,
  getCoatExportObjectKey,
  type CoatCloudExportFileType,
} from './constants';

type CoatExportStorageEnv = NonNullable<ReturnType<typeof getShareStorageEnv>>;

function createCoatExportR2Client(env: CoatExportStorageEnv) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
  });
}

export async function uploadCoatExportObject({
  env,
  id,
  fileType,
  fileBuffer,
}: {
  env: CoatExportStorageEnv;
  id: string;
  fileType: CoatCloudExportFileType;
  fileBuffer: Buffer;
}): Promise<{ key: string }> {
  if (!Buffer.isBuffer(fileBuffer)) {
    throw new Error(`Invalid coat export file buffer: "${String(fileBuffer)}"`);
  }

  const key = getCoatExportObjectKey(id, fileType);
  const client = createCoatExportR2Client(env);

  await client.send(
    new PutObjectCommand({
      Bucket: env.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: getCoatExportContentType(fileType),
      CacheControl: COAT_EXPORT_CACHE_CONTROL,
    })
  );

  return { key };
}
