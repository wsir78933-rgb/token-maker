import {
  SHARE_MAX_IMAGE_BYTES,
  getShareUploadDimensions,
  isShareUploadWidth,
  type ShareUploadWidth,
} from './constants';
import type { SiteLocale } from '@/lib/site-locale';
import {
  sanitizeSharePngBytes,
  type SharePngSanitizeResult,
} from './workers-image-sanitizer';
export type ShareUploadError = 'invalid_image' | 'image_too_large';

export interface ParsedShareUpload {
  imageBuffer: Buffer;
  width: ShareUploadWidth;
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

type SanitizedPngResult =
  | { ok: true; imageBuffer: Buffer }
  | { ok: false; error: ShareUploadError; status: 400 | 413 };

function sanitizePngImage(
  sourceImageBuffer: Buffer,
  expectedDimensions: { width: number; height: number },
): SanitizedPngResult {
  const sanitizedPng: SharePngSanitizeResult = sanitizeSharePngBytes(
    sourceImageBuffer,
    expectedDimensions,
  );
  if (!sanitizedPng.ok) {
    return sanitizedPng;
  }

  return { ok: true, imageBuffer: Buffer.from(sanitizedPng.imageBytes) };
}

export async function parseShareUploadPayload(payload: unknown): Promise<ShareUploadParseResult> {
  const normalizedPayload = normalizePayload(payload);

  if (typeof normalizedPayload.image !== 'string') {
    return { ok: false, error: 'invalid_image', status: 400 };
  }

  if (!isShareUploadWidth(normalizedPayload.width)) {
    return { ok: false, error: 'invalid_image', status: 400 };
  }

  const sourceImageBuffer = decodeBase64Image(normalizedPayload.image);
  if (!sourceImageBuffer) {
    return { ok: false, error: 'invalid_image', status: 400 };
  }

  if (sourceImageBuffer.byteLength > SHARE_MAX_IMAGE_BYTES) {
    return { ok: false, error: 'image_too_large', status: 413 };
  }

  const sanitizedPng = await sanitizePngImage(
    sourceImageBuffer,
    getShareUploadDimensions(normalizedPayload.width),
  );
  if (!sanitizedPng.ok) {
    return sanitizedPng;
  }

  return {
    ok: true,
    value: {
      imageBuffer: sanitizedPng.imageBuffer,
      width: normalizedPayload.width,
      locale: normalizeLocale(normalizedPayload.locale),
    },
  };
}
