import type { SiteLocale } from '@/lib/site-locale';
import sharp from 'sharp';
import {
  COAT_EXPORT_LONGEST_EDGES,
  COAT_EXPORT_MAX_FILE_BYTES,
  isCoatExportLongestEdge,
  type CoatCloudExportFileType,
} from './constants';

const PNG_SIGNATURE_LENGTH = 8;
const PNG_CHUNK_HEADER_LENGTH = 8;
const PNG_CHUNK_CRC_LENGTH = 4;
const PNG_CHUNK_LENGTH_OFFSET = 0;
const PNG_CHUNK_TYPE_OFFSET = 4;
const PNG_ANIMATION_CONTROL_CHUNK_TYPE = 'acTL';
const PDF_HEADER_BYTES = Buffer.from('%PDF');
const COAT_EXPORT_MAX_LONGEST_EDGE = Math.max(...COAT_EXPORT_LONGEST_EDGES);
const COAT_EXPORT_MAX_INPUT_PIXELS = COAT_EXPORT_MAX_LONGEST_EDGE * COAT_EXPORT_MAX_LONGEST_EDGE;

export type CoatExportUploadError = 'invalid_file' | 'file_too_large';

export interface ParsedCoatExportUpload {
  fileBuffer: Buffer;
  fileType: CoatCloudExportFileType;
  width: number;
  height: number;
  locale: SiteLocale;
}

export type CoatExportUploadParseResult =
  | { ok: true; value: ParsedCoatExportUpload }
  | { ok: false; error: CoatExportUploadError; status: 400 | 413 };

interface CoatExportUploadPayload {
  file?: unknown;
  fileType?: unknown;
  width?: unknown;
  height?: unknown;
  locale?: unknown;
}

type SanitizedRasterFileResult =
  | { ok: true; fileBuffer: Buffer }
  | { ok: false; error: CoatExportUploadError; status: 400 | 413 };

function normalizeLocale(value: unknown): SiteLocale {
  return value === 'zh' ? 'zh' : 'en';
}

function isCoatCloudExportFileType(value: unknown): value is CoatCloudExportFileType {
  return value === 'png' || value === 'jpeg' || value === 'pdf';
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
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

function decodeBase64File(value: string) {
  const normalized = value.trim();
  if (normalized.startsWith('data:') || !isBase64String(normalized)) {
    return null;
  }

  return Buffer.from(normalized, 'base64');
}

function isAnimatedPng(fileBuffer: Buffer) {
  let offset = PNG_SIGNATURE_LENGTH;

  while (offset + PNG_CHUNK_HEADER_LENGTH + PNG_CHUNK_CRC_LENGTH <= fileBuffer.length) {
    const chunkDataLength = fileBuffer.readUInt32BE(offset + PNG_CHUNK_LENGTH_OFFSET);
    const chunkLength = PNG_CHUNK_HEADER_LENGTH + chunkDataLength + PNG_CHUNK_CRC_LENGTH;
    if (chunkLength > fileBuffer.length - offset) return false;

    const chunkTypeStart = offset + PNG_CHUNK_TYPE_OFFSET;
    const chunkType = fileBuffer.subarray(chunkTypeStart, chunkTypeStart + 4).toString('ascii');
    if (chunkType === PNG_ANIMATION_CONTROL_CHUNK_TYPE) return true;

    offset += chunkLength;
  }

  return false;
}

function isPdfFileBuffer(fileBuffer: Buffer) {
  return (
    fileBuffer.byteLength >= PDF_HEADER_BYTES.byteLength
    && fileBuffer.subarray(0, PDF_HEADER_BYTES.byteLength).equals(PDF_HEADER_BYTES)
  );
}

function normalizePayload(payload: unknown): CoatExportUploadPayload {
  return payload && typeof payload === 'object' ? (payload as CoatExportUploadPayload) : {};
}

function hasExpectedRasterMetadata(
  metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>,
  fileType: 'png' | 'jpeg',
  expectedWidth: number,
  expectedHeight: number,
) {
  if (metadata.format !== fileType) return false;
  if (metadata.width !== expectedWidth) return false;
  if (metadata.height !== expectedHeight) return false;
  if (fileType === 'png' && metadata.pages !== undefined && metadata.pages !== 1) return false;
  return true;
}

async function sanitizeRasterExportFile(
  sourceFileBuffer: Buffer,
  fileType: 'png' | 'jpeg',
  expectedWidth: number,
  expectedHeight: number,
): Promise<SanitizedRasterFileResult> {
  try {
    const decoder = sharp(sourceFileBuffer, {
      animated: fileType === 'png',
      limitInputPixels: COAT_EXPORT_MAX_INPUT_PIXELS,
    });
    const metadata = await decoder.metadata();
    if (!hasExpectedRasterMetadata(metadata, fileType, expectedWidth, expectedHeight)) {
      return { ok: false, error: 'invalid_file', status: 400 };
    }

    const sanitizedFileBuffer = fileType === 'png'
      ? await decoder.png().toBuffer()
      : await decoder.jpeg().toBuffer();
    if (sanitizedFileBuffer.byteLength > COAT_EXPORT_MAX_FILE_BYTES) {
      return { ok: false, error: 'file_too_large', status: 413 };
    }

    return { ok: true, fileBuffer: sanitizedFileBuffer };
  } catch (error) {
    if (error instanceof Error) return { ok: false, error: 'invalid_file', status: 400 };
    throw error;
  }
}

export async function parseCoatExportUploadPayload(
  payload: unknown
): Promise<CoatExportUploadParseResult> {
  const normalizedPayload = normalizePayload(payload);

  if (typeof normalizedPayload.file !== 'string') {
    return { ok: false, error: 'invalid_file', status: 400 };
  }

  if (!isCoatCloudExportFileType(normalizedPayload.fileType)) {
    return { ok: false, error: 'invalid_file', status: 400 };
  }

  const width = normalizedPayload.width;
  const height = normalizedPayload.height;
  if (
    !isPositiveInteger(width)
    || !isPositiveInteger(height)
    || !isCoatExportLongestEdge(Math.max(width, height))
  ) {
    return { ok: false, error: 'invalid_file', status: 400 };
  }

  const sourceFileBuffer = decodeBase64File(normalizedPayload.file);
  if (!sourceFileBuffer) {
    return { ok: false, error: 'invalid_file', status: 400 };
  }

  if (normalizedPayload.fileType === 'png' && isAnimatedPng(sourceFileBuffer)) {
    return { ok: false, error: 'invalid_file', status: 400 };
  }

  if (sourceFileBuffer.byteLength > COAT_EXPORT_MAX_FILE_BYTES) {
    return { ok: false, error: 'file_too_large', status: 413 };
  }

  if (normalizedPayload.fileType === 'pdf') {
    if (!isPdfFileBuffer(sourceFileBuffer)) {
      return { ok: false, error: 'invalid_file', status: 400 };
    }

    return {
      ok: true,
      value: {
        fileBuffer: sourceFileBuffer,
        fileType: 'pdf',
        width,
        height,
        locale: normalizeLocale(normalizedPayload.locale),
      },
    };
  }

  const sanitizedRasterFile = await sanitizeRasterExportFile(
    sourceFileBuffer,
    normalizedPayload.fileType,
    width,
    height,
  );
  if (!sanitizedRasterFile.ok) {
    return sanitizedRasterFile;
  }

  return {
    ok: true,
    value: {
      fileBuffer: sanitizedRasterFile.fileBuffer,
      fileType: normalizedPayload.fileType,
      width,
      height,
      locale: normalizeLocale(normalizedPayload.locale),
    },
  };
}
