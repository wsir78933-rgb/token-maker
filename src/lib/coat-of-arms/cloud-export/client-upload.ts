import {
  assertCoatCloudExportFileType,
  isCoatExportLongestEdge,
  type CoatCloudExportFileType,
} from './constants';
import type { CoatLocale } from '@/lib/coat-of-arms/types';

type CoatExportUploadErrorCode =
  | 'invalid_json'
  | 'invalid_file'
  | 'file_too_large'
  | 'rate_limited'
  | 'rate_limiter_unavailable'
  | 'storage_not_configured'
  | 'invalid_content_type'
  | 'invalid_origin'
  | 'upload_failed'
  | 'network_error'
  | 'unknown_error';

export class CoatExportUploadError extends Error {
  constructor(
    public readonly code: CoatExportUploadErrorCode,
    public readonly status?: number
  ) {
    super(code);
    this.name = 'CoatExportUploadError';
  }
}

const allowedCoatExportUploadErrorCodes: readonly CoatExportUploadErrorCode[] = [
  'invalid_json',
  'invalid_file',
  'file_too_large',
  'rate_limited',
  'rate_limiter_unavailable',
  'storage_not_configured',
  'invalid_content_type',
  'invalid_origin',
  'upload_failed',
];

function normalizeCoatExportLocale(value: unknown): CoatLocale {
  return value === 'zh' ? 'zh' : 'en';
}

function assertCoatExportDimension(
  dimensionName: 'width' | 'height',
  value: unknown
): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid coat export ${dimensionName}: ${String(value)}`);
  }
}

function assertCoatExportFileBlob(file: unknown): asserts file is Blob {
  if (!(file instanceof Blob)) {
    throw new Error(
      `Coat export file must be a Blob; received ${typeof file === 'object' ? JSON.stringify(file) : String(file)}`
    );
  }
  if (file.size === 0) {
    throw new Error(`Coat export file is empty; received 0 bytes`);
  }
}

function blobToRawBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIndex = result.indexOf(',');
      if (commaIndex === -1) {
        reject(
          new Error(
            `Coat export file base64 encoding missing data URL comma; received "${result.slice(0, 32)}"`
          )
        );
        return;
      }
      const rawBase64 = result.slice(commaIndex + 1);
      if (rawBase64.length === 0) {
        reject(new Error(`Coat export file is empty after base64 encoding; blob size ${file.size}`));
        return;
      }
      if (rawBase64.startsWith('data:')) {
        reject(
          new Error(
            `Coat export file base64 must not include a data: prefix; received prefix "${rawBase64.slice(0, 32)}"`
          )
        );
        return;
      }
      resolve(rawBase64);
    };
    reader.onerror = () => reject(new CoatExportUploadError('network_error'));
    reader.readAsDataURL(file);
  });
}

function normalizeCoatExportUploadErrorCode(value: unknown): CoatExportUploadErrorCode {
  const errorCode = typeof value === 'string' ? value : '';
  return allowedCoatExportUploadErrorCodes.includes(errorCode as CoatExportUploadErrorCode)
    ? (errorCode as CoatExportUploadErrorCode)
    : 'unknown_error';
}

export async function uploadCoatExportToCloud({
  file,
  fileType,
  width,
  height,
  locale,
}: {
  file: Blob;
  fileType: CoatCloudExportFileType;
  width: number;
  height: number;
  locale?: unknown;
}): Promise<void> {
  assertCoatExportFileBlob(file);
  assertCoatCloudExportFileType(fileType);
  assertCoatExportDimension('width', width);
  assertCoatExportDimension('height', height);
  const longestEdge = Math.max(width, height);
  if (!isCoatExportLongestEdge(longestEdge)) {
    throw new Error(`Invalid coat export longest edge: ${String(longestEdge)}`);
  }

  const fileBase64 = await blobToRawBase64(file);
  const normalizedLocale = normalizeCoatExportLocale(locale);

  let response: Response;
  try {
    response = await fetch('/api/coat-export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: fileBase64,
        fileType,
        width,
        height,
        locale: normalizedLocale,
      }),
    });
  } catch {
    throw new CoatExportUploadError('network_error');
  }

  const result = (await response.json().catch(() => null)) as
    | { ok?: unknown; error?: unknown }
    | null;

  if (!response.ok) {
    throw new CoatExportUploadError(normalizeCoatExportUploadErrorCode(result?.error), response.status);
  }

  if (!result || result.ok !== true) {
    throw new CoatExportUploadError('unknown_error', response.status);
  }
}
