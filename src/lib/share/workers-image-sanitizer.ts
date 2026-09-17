import { decode, encode } from '@cf-wasm/png/workerd';
import { SHARE_MAX_IMAGE_BYTES, SHARE_MAX_IMAGE_PIXELS } from './constants';

const PNG_SIGNATURE = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
const PNG_SIGNATURE_LENGTH = PNG_SIGNATURE.byteLength;
const PNG_CHUNK_LENGTH_SIZE = 4;
const PNG_CHUNK_TYPE_SIZE = 4;
const PNG_CHUNK_CRC_SIZE = 4;
const PNG_CHUNK_HEADER_SIZE = PNG_CHUNK_LENGTH_SIZE + PNG_CHUNK_TYPE_SIZE;
const PNG_IHDR_DATA_LENGTH = 13;
const PNG_IHDR_WIDTH_OFFSET = PNG_SIGNATURE_LENGTH + PNG_CHUNK_HEADER_SIZE;
const PNG_IHDR_HEIGHT_OFFSET = PNG_IHDR_WIDTH_OFFSET + 4;
const PNG_ANIMATION_CONTROL_CHUNK_TYPE = 'acTL';
const PNG_HEADER_CHUNK_TYPE = 'IHDR';

export type SharePngSanitizeError = 'invalid_image' | 'image_too_large';

export type SharePngSanitizeResult =
  | { ok: true; imageBytes: Uint8Array }
  | { ok: false; error: SharePngSanitizeError; status: 400 | 413 };

export interface SharePngExpectedDimensions {
  width: number;
  height: number;
}

function requirePositiveIntegerDimension(dimensionName: 'width' | 'height', dimensionValue: number) {
  if (!Number.isInteger(dimensionValue) || dimensionValue <= 0) {
    throw new Error(
      `expectedDimensions.${dimensionName} must be a positive integer, received ${String(dimensionValue)}`,
    );
  }
}

function readUint32Be(imageBytes: Uint8Array, offset: number) {
  return (
    ((imageBytes[offset] << 24)
      | (imageBytes[offset + 1] << 16)
      | (imageBytes[offset + 2] << 8)
      | imageBytes[offset + 3])
    >>> 0
  );
}

function readChunkType(imageBytes: Uint8Array, offset: number) {
  return String.fromCharCode(
    imageBytes[offset],
    imageBytes[offset + 1],
    imageBytes[offset + 2],
    imageBytes[offset + 3],
  );
}

function hasPngSignature(imageBytes: Uint8Array) {
  if (imageBytes.byteLength < PNG_SIGNATURE_LENGTH) return false;
  for (let index = 0; index < PNG_SIGNATURE_LENGTH; index += 1) {
    if (imageBytes[index] !== PNG_SIGNATURE[index]) return false;
  }
  return true;
}

function readPngHeaderDimensions(imageBytes: Uint8Array) {
  const headerEndOffset = PNG_SIGNATURE_LENGTH + PNG_CHUNK_HEADER_SIZE + PNG_IHDR_DATA_LENGTH + PNG_CHUNK_CRC_SIZE;
  if (imageBytes.byteLength < headerEndOffset) return null;

  const chunkDataLength = readUint32Be(imageBytes, PNG_SIGNATURE_LENGTH);
  const chunkType = readChunkType(imageBytes, PNG_SIGNATURE_LENGTH + PNG_CHUNK_LENGTH_SIZE);
  if (chunkDataLength !== PNG_IHDR_DATA_LENGTH || chunkType !== PNG_HEADER_CHUNK_TYPE) {
    return null;
  }

  const width = readUint32Be(imageBytes, PNG_IHDR_WIDTH_OFFSET);
  const height = readUint32Be(imageBytes, PNG_IHDR_HEIGHT_OFFSET);
  if (width === 0 || height === 0) return null;

  return { width, height };
}

function containsAnimationControlChunk(imageBytes: Uint8Array) {
  let offset = PNG_SIGNATURE_LENGTH;

  while (offset + PNG_CHUNK_HEADER_SIZE + PNG_CHUNK_CRC_SIZE <= imageBytes.byteLength) {
    const chunkDataLength = readUint32Be(imageBytes, offset);
    if (chunkDataLength > imageBytes.byteLength) return false;

    const chunkLength = PNG_CHUNK_HEADER_SIZE + chunkDataLength + PNG_CHUNK_CRC_SIZE;
    if (chunkLength < PNG_CHUNK_HEADER_SIZE || chunkLength > imageBytes.byteLength - offset) {
      return false;
    }

    const chunkType = readChunkType(imageBytes, offset + PNG_CHUNK_LENGTH_SIZE);
    if (chunkType === PNG_ANIMATION_CONTROL_CHUNK_TYPE) return true;

    offset += chunkLength;
  }

  return false;
}

function invalidImageResult(): SharePngSanitizeResult {
  return { ok: false, error: 'invalid_image', status: 400 };
}

function imageTooLargeResult(): SharePngSanitizeResult {
  return { ok: false, error: 'image_too_large', status: 413 };
}

function resultFromDecoderFailure(error: unknown): SharePngSanitizeResult {
  if (error instanceof Error) return invalidImageResult();
  if (typeof error === 'string' && error.length > 0) return invalidImageResult();
  throw new Error(`PNG decoder or encoder failed with unexpected value: ${String(error)}`);
}

/**
 * Decode a standard PNG, enforce the share upload contract, and re-encode a
 * clean PNG. Uses the explicit @cf-wasm/png/workerd entry so the Worker bundle
 * loads Wasm as an external module asset instead of compiling a Node inline module.
 * A 2048×2048 round-trip took ~590ms wall in local workerd, so production
 * needs Workers Paid CPU (default 30s), not the Free 10ms limit.
 */
export function sanitizeSharePngBytes(
  sourceImageBytes: Uint8Array,
  expectedDimensions: SharePngExpectedDimensions,
): SharePngSanitizeResult {
  requirePositiveIntegerDimension('width', expectedDimensions.width);
  requirePositiveIntegerDimension('height', expectedDimensions.height);

  if (sourceImageBytes.byteLength > SHARE_MAX_IMAGE_BYTES) {
    return imageTooLargeResult();
  }

  if (!hasPngSignature(sourceImageBytes) || containsAnimationControlChunk(sourceImageBytes)) {
    return invalidImageResult();
  }

  const headerDimensions = readPngHeaderDimensions(sourceImageBytes);
  if (!headerDimensions) {
    return invalidImageResult();
  }

  const pixelCount = BigInt(headerDimensions.width) * BigInt(headerDimensions.height);
  if (pixelCount > BigInt(SHARE_MAX_IMAGE_PIXELS)) {
    return invalidImageResult();
  }

  if (
    headerDimensions.width !== expectedDimensions.width
    || headerDimensions.height !== expectedDimensions.height
  ) {
    return invalidImageResult();
  }

  try {
    const decodedPng = decode(sourceImageBytes);
    if (decodedPng.width !== expectedDimensions.width || decodedPng.height !== expectedDimensions.height) {
      return invalidImageResult();
    }

    const encodedPngBytes = encode(decodedPng.image, decodedPng.width, decodedPng.height, {
      color: decodedPng.colorType,
      depth: decodedPng.bitDepth,
    });

    if (encodedPngBytes.byteLength > SHARE_MAX_IMAGE_BYTES) {
      return imageTooLargeResult();
    }

    return { ok: true, imageBytes: encodedPngBytes };
  } catch (error) {
    return resultFromDecoderFailure(error);
  }
}
