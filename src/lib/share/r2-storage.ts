import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  SHARE_IMAGE_CACHE_CONTROL,
  getShareImageUrl,
  getShareObjectKey,
} from './constants';
import { getSharePublicBaseUrl } from './public-url';

interface ShareStorageEnv {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
}

function optionalEnv(key: string, fallback = '') {
  return process.env[key]?.trim() || fallback;
}

export function getShareStorageEnv(): ShareStorageEnv | null {
  const accountId = optionalEnv('R2_ACCOUNT_ID');
  const accessKeyId = optionalEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = optionalEnv('R2_SECRET_ACCESS_KEY');

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName: optionalEnv('R2_BUCKET_NAME', 'tokenmaker-shares'),
    publicBaseUrl: getSharePublicBaseUrl(),
  };
}

function createR2Client(env: ShareStorageEnv) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
  });
}

export async function uploadShareImage({
  env,
  id,
  imageBuffer,
}: {
  env: ShareStorageEnv;
  id: string;
  imageBuffer: Buffer;
}) {
  const client = createR2Client(env);
  const key = getShareObjectKey(id);

  await client.send(
    new PutObjectCommand({
      Bucket: env.bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png',
      CacheControl: SHARE_IMAGE_CACHE_CONTROL,
    })
  );

  return {
    key,
    imageUrl: getShareImageUrl(id, env.publicBaseUrl),
  };
}
