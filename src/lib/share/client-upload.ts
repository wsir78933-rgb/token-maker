import type { SiteLocale } from '@/lib/site-locale';
import type { ShareUploadWidth } from './constants';

export interface ShareUploadResponse {
  id: string;
  shareUrl: string;
  imageUrl: string;
}

export type ShareUploadError =
  | 'invalid_json'
  | 'invalid_image'
  | 'image_too_large'
  | 'rate_limited'
  | 'storage_not_configured'
  | 'upload_failed'
  | 'network_error'
  | 'unknown_error';

export class ShareUploadRequestError extends Error {
  constructor(
    public readonly code: ShareUploadError,
    public readonly status?: number
  ) {
    super(code);
    this.name = 'ShareUploadRequestError';
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const [, base64 = ''] = result.split(',');
      resolve(base64);
    };
    reader.onerror = () => reject(new ShareUploadRequestError('network_error'));
    reader.readAsDataURL(blob);
  });
}

function normalizeUploadError(value: unknown): ShareUploadError {
  const code = typeof value === 'string' ? value : '';
  const allowed: ShareUploadError[] = [
    'invalid_json',
    'invalid_image',
    'image_too_large',
    'rate_limited',
    'storage_not_configured',
    'upload_failed',
  ];

  return allowed.includes(code as ShareUploadError) ? (code as ShareUploadError) : 'unknown_error';
}

export async function uploadTokenForShare({
  blob,
  width,
  locale,
}: {
  blob: Blob;
  width: ShareUploadWidth;
  locale: SiteLocale;
}): Promise<ShareUploadResponse> {
  const image = await blobToBase64(blob);

  let response: Response;
  try {
    response = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, width, locale }),
    });
  } catch {
    throw new ShareUploadRequestError('network_error');
  }

  const result = (await response.json().catch(() => null)) as
    | (Partial<ShareUploadResponse> & { error?: unknown })
    | null;

  if (!response.ok) {
    throw new ShareUploadRequestError(normalizeUploadError(result?.error), response.status);
  }

  if (
    !result ||
    typeof result.id !== 'string' ||
    typeof result.shareUrl !== 'string' ||
    typeof result.imageUrl !== 'string'
  ) {
    throw new ShareUploadRequestError('unknown_error', response.status);
  }

  return {
    id: result.id,
    shareUrl: result.shareUrl,
    imageUrl: result.imageUrl,
  };
}
