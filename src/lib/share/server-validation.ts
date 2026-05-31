import {
  SHARE_MAX_IMAGE_BYTES,
  isShareExportWidth,
  type ShareExportWidth,
} from './constants';
import type { SiteLocale } from '@/lib/site-locale';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
export type ShareUploadError = 'invalid_image' | 'image_too_large';

export interface ParsedShareUpload {
  imageBuffer: Buffer;
  width: ShareExportWidth;
  locale: SiteLocale;
}

export type ShareUploadParseResult =
  | { ok: true; value: ParsedShareUpload }
  | { ok: false; error: ShareUploadError; status: 400 | 413 };

interface ShareUploadPayload {
  image?: unknown;
  width?: unknown;
  locale?: unknown;
}

function normalizeLocale(value: unknown): SiteLocale {
  return value === 'zh' ? 'zh' : 'en';
}

function isPng(buffer: Buffer) {
  return buffer.length >= PNG_SIGNATURE.length && buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
}

function isBase64String(value: string) {
  if (value.length === 0 || value.length % 4 !== 0) return false;

  let paddingStarted = false;
  let paddingCount = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const isPadding = char === '=';

    if (isPadding) {
      paddingStarted = true;
      paddingCount += 1;
      if (paddingCount > 2 || index < value.length - 2) {
        return false;
      }
      continue;
    }

    if (paddingStarted) {
      return false;
    }

    const code = char.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    const isDigit = code >= 48 && code <= 57;
    const isSymbol = char === '+' || char === '/';

    if (!isUpper && !isLower && !isDigit && !isSymbol) {
      return false;
    }
  }

  return true;
}

function decodeBase64Image(value: string) {
  const normalized = value.trim();
  if (normalized.startsWith('data:') || !isBase64String(normalized)) {
    return null;
  }

  return Buffer.from(normalized, 'base64');
}

function normalizePayload(payload: unknown): ShareUploadPayload {
  return payload && typeof payload === 'object' ? (payload as ShareUploadPayload) : {};
}

export function parseShareUploadPayload(payload: unknown): ShareUploadParseResult {
  const normalizedPayload = normalizePayload(payload);

  if (typeof normalizedPayload.image !== 'string') {
    return { ok: false, error: 'invalid_image', status: 400 };
  }

  if (!isShareExportWidth(normalizedPayload.width)) {
    return { ok: false, error: 'invalid_image', status: 400 };
  }

  const imageBuffer = decodeBase64Image(normalizedPayload.image);
  if (!imageBuffer || !isPng(imageBuffer)) {
    return { ok: false, error: 'invalid_image', status: 400 };
  }

  if (imageBuffer.byteLength > SHARE_MAX_IMAGE_BYTES) {
    return { ok: false, error: 'image_too_large', status: 413 };
  }

  return {
    ok: true,
    value: {
      imageBuffer,
      width: normalizedPayload.width,
      locale: normalizeLocale(normalizedPayload.locale),
    },
  };
}
