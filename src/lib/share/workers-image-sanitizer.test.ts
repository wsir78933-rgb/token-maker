import sharp from 'sharp';
import { describe, expect, it, vi } from 'vitest';
import { decode } from '@cf-wasm/png';
import {
  SHARE_MAX_IMAGE_BYTES,
  SHARE_SOCIAL_IMAGE_HEIGHT,
  SHARE_SOCIAL_IMAGE_WIDTH,
} from './constants';
import { sanitizeSharePngBytes } from './workers-image-sanitizer';

vi.mock('@cf-wasm/png/workerd', async () => import('@cf-wasm/png/node'));

async function createPngBuffer(width: number, height: number) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 28, g: 25, b: 23, alpha: 1 },
    },
  }).png().toBuffer();
}

function calculateCrc32(value: Buffer<ArrayBufferLike>) {
  let crc = 0xffffffff;
  for (const byte of value) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPngChunk(type: string, chunkPayload: Buffer<ArrayBufferLike> = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type);
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(chunkPayload.length);
  const checksumBuffer = Buffer.alloc(4);
  checksumBuffer.writeUInt32BE(calculateCrc32(Buffer.concat([typeBuffer, chunkPayload])));
  return Buffer.concat([lengthBuffer, typeBuffer, chunkPayload, checksumBuffer]);
}

function getPngChunks(pngBuffer: Buffer<ArrayBufferLike>) {
  const chunks: Array<{ type: string; chunkPayload: Buffer<ArrayBufferLike> }> = [];
  for (let offset = 8; offset < pngBuffer.length;) {
    const length = pngBuffer.readUInt32BE(offset);
    const type = pngBuffer.subarray(offset + 4, offset + 8).toString('ascii');
    chunks.push({ type, chunkPayload: pngBuffer.subarray(offset + 8, offset + 8 + length) });
    offset += length + 12;
  }
  return chunks;
}

function createUint32Buffer(value: number) {
  const result = Buffer.alloc(4);
  result.writeUInt32BE(value);
  return result;
}

function createApngFrameControl(sequenceNumber: number, width: number, height: number) {
  return Buffer.concat([
    createUint32Buffer(sequenceNumber),
    createUint32Buffer(width),
    createUint32Buffer(height),
    createUint32Buffer(0),
    createUint32Buffer(0),
    Buffer.from([0, 10, 0, 100, 0, 0]),
  ]);
}

async function createAnimatedPngBuffer() {
  const createFrame = (background: { r: number; g: number; b: number; alpha: number }) => sharp({
    create: { width: 1024, height: 1024, channels: 4, background },
  }).png().toBuffer();
  const [firstFrame, secondFrame] = await Promise.all([
    createFrame({ r: 255, g: 0, b: 0, alpha: 1 }),
    createFrame({ r: 0, g: 0, b: 255, alpha: 1 }),
  ]);
  const firstFrameChunks = getPngChunks(firstFrame);
  const secondFrameChunks = getPngChunks(secondFrame);
  const firstHeader = firstFrameChunks.find((chunk) => chunk.type === 'IHDR');
  if (!firstHeader) throw new Error('Expected generated PNG to contain an IHDR chunk.');

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    createPngChunk('IHDR', firstHeader.chunkPayload),
    ...firstFrameChunks
      .filter((chunk) => chunk.type === 'pHYs')
      .map((chunk) => createPngChunk(chunk.type, chunk.chunkPayload)),
    createPngChunk('acTL', Buffer.concat([createUint32Buffer(2), createUint32Buffer(0)])),
    createPngChunk('fcTL', createApngFrameControl(0, 1024, 1024)),
    ...firstFrameChunks
      .filter((chunk) => chunk.type === 'IDAT')
      .map((chunk) => createPngChunk(chunk.type, chunk.chunkPayload)),
    createPngChunk('fcTL', createApngFrameControl(1, 1024, 1024)),
    ...secondFrameChunks
      .filter((chunk) => chunk.type === 'IDAT')
      .map((chunk, index) => createPngChunk('fdAT', Buffer.concat([
        createUint32Buffer(index + 2),
        chunk.chunkPayload,
      ]))),
    createPngChunk('IEND'),
  ]);
}

function createHeaderOnlyPng(width: number, height: number) {
  const ihdrPayload = Buffer.alloc(13);
  ihdrPayload.writeUInt32BE(width, 0);
  ihdrPayload.writeUInt32BE(height, 4);
  ihdrPayload[8] = 8;
  ihdrPayload[9] = 6;
  ihdrPayload[10] = 0;
  ihdrPayload[11] = 0;
  ihdrPayload[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    createPngChunk('IHDR', ihdrPayload),
    createPngChunk('IDAT'),
    createPngChunk('IEND'),
  ]);
}

describe('workers PNG sanitizer', () => {
  it('accepts and re-encodes a PNG with the requested square export dimensions', async () => {
    const sourcePng = await createPngBuffer(1024, 1024);
    const result = sanitizeSharePngBytes(sourcePng, { width: 1024, height: 1024 });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.imageBytes.byteLength).toBeGreaterThan(8);
    expect(result.imageBytes.byteLength).toBeLessThanOrEqual(SHARE_MAX_IMAGE_BYTES);
    await expect(sharp(Buffer.from(result.imageBytes)).metadata()).resolves.toMatchObject({
      format: 'png',
      width: 1024,
      height: 1024,
    });
    expect(getPngChunks(Buffer.from(result.imageBytes)).some((chunk) => chunk.type === 'acTL')).toBe(false);
  });

  it('accepts the fixed social share image dimensions', async () => {
    const sourcePng = await createPngBuffer(SHARE_SOCIAL_IMAGE_WIDTH, SHARE_SOCIAL_IMAGE_HEIGHT);
    const result = sanitizeSharePngBytes(sourcePng, {
      width: SHARE_SOCIAL_IMAGE_WIDTH,
      height: SHARE_SOCIAL_IMAGE_HEIGHT,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    await expect(sharp(Buffer.from(result.imageBytes)).metadata()).resolves.toMatchObject({
      format: 'png',
      width: SHARE_SOCIAL_IMAGE_WIDTH,
      height: SHARE_SOCIAL_IMAGE_HEIGHT,
    });
  });

  it('accepts every square export size including the 2048 pixel ceiling', async () => {
    for (const size of [256, 512, 1024, 2048]) {
      const sourcePng = await createPngBuffer(size, size);
      const result = sanitizeSharePngBytes(sourcePng, { width: size, height: size });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      await expect(sharp(Buffer.from(result.imageBytes)).metadata()).resolves.toMatchObject({
        format: 'png',
        width: size,
        height: size,
      });
    }
  });

  it('rejects truncated PNG data even when it has a valid PNG signature', () => {
    const truncatedPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(sanitizeSharePngBytes(truncatedPng, { width: 1024, height: 1024 })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('rejects non-PNG bytes', () => {
    expect(sanitizeSharePngBytes(Buffer.from('not-a-png'), { width: 1024, height: 1024 })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('rejects square PNG dimensions that do not match the declared export width', async () => {
    const sourcePng = await createPngBuffer(512, 512);
    expect(sanitizeSharePngBytes(sourcePng, { width: 1024, height: 1024 })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('rejects social PNGs that are not exactly 1200 by 630', async () => {
    const sourcePng = await createPngBuffer(SHARE_SOCIAL_IMAGE_WIDTH, SHARE_SOCIAL_IMAGE_WIDTH);
    expect(sanitizeSharePngBytes(sourcePng, {
      width: SHARE_SOCIAL_IMAGE_WIDTH,
      height: SHARE_SOCIAL_IMAGE_HEIGHT,
    })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('rejects animated PNGs even though @cf-wasm/png would decode the first frame', async () => {
    const animatedPng = await createAnimatedPngBuffer();
    const decodedFirstFrame = decode(animatedPng);
    expect(decodedFirstFrame).toMatchObject({ width: 1024, height: 1024 });

    expect(sanitizeSharePngBytes(animatedPng, { width: 1024, height: 1024 })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('rejects image bytes above the source byte limit before decoding', () => {
    const oversizedImage = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      Buffer.alloc(SHARE_MAX_IMAGE_BYTES + 1),
    ]);
    expect(sanitizeSharePngBytes(oversizedImage, { width: 1024, height: 1024 })).toEqual({
      ok: false,
      error: 'image_too_large',
      status: 413,
    });
  });

  it('rejects PNGs whose declared pixel count exceeds 2048 by 2048', () => {
    const oversizedHeaderPng = createHeaderOnlyPng(2049, 2048);
    expect(sanitizeSharePngBytes(oversizedHeaderPng, { width: 2049, height: 2048 })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('rejects a PNG whose IDAT cannot be decoded even when the header matches', () => {
    const truncatedIdatPng = createHeaderOnlyPng(256, 256);
    expect(sanitizeSharePngBytes(truncatedIdatPng, { width: 256, height: 256 })).toEqual({
      ok: false,
      error: 'invalid_image',
      status: 400,
    });
  });

  it('throws when expected dimensions are not positive integers', async () => {
    const sourcePng = await createPngBuffer(256, 256);
    expect(() => sanitizeSharePngBytes(sourcePng, { width: 0, height: 256 })).toThrow(
      'expectedDimensions.width must be a positive integer, received 0',
    );
    expect(() => sanitizeSharePngBytes(sourcePng, { width: 256, height: 1.5 })).toThrow(
      'expectedDimensions.height must be a positive integer, received 1.5',
    );
  });
});
