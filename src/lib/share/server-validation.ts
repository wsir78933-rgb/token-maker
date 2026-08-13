import {
  SHARE_MAX_IMAGE_PIXELS,
  SHARE_MAX_IMAGE_BYTES,
  getShareUploadDimensions,
  isShareUploadWidth,
  type ShareUploadWidth,
} from './constants';
import type { SiteLocale } from '@/lib/site-locale';
import sharp from 'sharp';

const PNG_SIGNATURE_LENGTH = 8;
const PNG_CHUNK_HEADER_LENGTH = 8;
const PNG_CHUNK_CRC_LENGTH = 4;
const PNG_CHUNK_LENGTH_OFFSET = 0;
const PNG_CHUNK_TYPE_OFFSET = 4;
const PNG_ANIMATION_CONTROL_CHUNK_TYPE = 'acTL';
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

function isAnimatedPng(imageBuffer: Buffer) {
  let offset = PNG_SIGNATURE_LENGTH;

  while (offset + PNG_CHUNK_HEADER_LENGTH + PNG_CHUNK_CRC_LENGTH <= imageBuffer.length) {
    const chunkDataLength = imageBuffer.readUInt32BE(offset + PNG_CHUNK_LENGTH_OFFSET);
    const chunkLength = PNG_CHUNK_HEADER_LENGTH + chunkDataLength + PNG_CHUNK_CRC_LENGTH;
    if (chunkLength > imageBuffer.length - offset) return false;

    const chunkTypeStart = offset + PNG_CHUNK_TYPE_OFFSET;
    const chunkType = imageBuffer.subarray(chunkTypeStart, chunkTypeStart + 4).toString('ascii');
    if (chunkType === PNG_ANIMATION_CONTROL_CHUNK_TYPE) return true;

    offset += chunkLength;
  }

  return false;
}

function normalizePayload(payload: unknown): ShareUploadPayload {
  return payload && typeof payload === 'object' ? (payload as ShareUploadPayload) : {};
}

function hasExpectedPngMetadata(
  metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>,
  expectedDimensions: { width: number; height: number },
) {
  return metadata.format === 'png'
    && metadata.width === expectedDimensions.width
    && metadata.height === expectedDimensions.height
    && (metadata.pages === undefined || metadata.pages === 1);
}

type SanitizedPngResult =
  | { ok: true; imageBuffer: Buffer }
  | { ok: false; error: ShareUploadError; status: 400 | 413 };

async function sanitizePngImage(
  sourceImageBuffer: Buffer,
  expectedDimensions: { width: number; height: number },
): Promise<SanitizedPngResult> {
  try {
    const pngDecoder = sharp(sourceImageBuffer, {
      animated: true,
      limitInputPixels: SHARE_MAX_IMAGE_PIXELS,
    });
    const metadata = await pngDecoder.metadata();
    if (!hasExpectedPngMetadata(metadata, expectedDimensions)) {
      return { ok: false, error: 'invalid_image', status: 400 };
    }

    const sanitizedImageBuffer = await pngDecoder.png().toBuffer();
    if (sanitizedImageBuffer.byteLength > SHARE_MAX_IMAGE_BYTES) {
      return { ok: false, error: 'image_too_large', status: 413 };
    }

    return { ok: true, imageBuffer: sanitizedImageBuffer };
  } catch (error) {
    if (error instanceof Error) return { ok: false, error: 'invalid_image', status: 400 };
    throw error;
  }
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
  if (!sourceImageBuffer || isAnimatedPng(sourceImageBuffer)) {
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
