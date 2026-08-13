import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { SHARE_MAX_IMAGE_BYTES, SHARE_SOCIAL_IMAGE_HEIGHT, SHARE_SOCIAL_IMAGE_WIDTH } from './constants';
import { parseShareUploadPayload } from './server-validation';

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

function createPngChunk(type: string, chunkData: Buffer<ArrayBufferLike> = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type);
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(chunkData.length);
  const checksumBuffer = Buffer.alloc(4);
  checksumBuffer.writeUInt32BE(calculateCrc32(Buffer.concat([typeBuffer, chunkData])));
  return Buffer.concat([lengthBuffer, typeBuffer, chunkData, checksumBuffer]);
}

function getPngChunks(pngBuffer: Buffer<ArrayBufferLike>) {
  const chunks: Array<{ type: string; chunkData: Buffer<ArrayBufferLike> }> = [];
  for (let offset = 8; offset < pngBuffer.length;) {
    const length = pngBuffer.readUInt32BE(offset);
    const type = pngBuffer.subarray(offset + 4, offset + 8).toString('ascii');
    chunks.push({ type, chunkData: pngBuffer.subarray(offset + 8, offset + 8 + length) });
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
    createPngChunk('IHDR', firstHeader.chunkData),
    ...firstFrameChunks
      .filter((chunk) => chunk.type === 'pHYs')
      .map((chunk) => createPngChunk(chunk.type, chunk.chunkData)),
    createPngChunk('acTL', Buffer.concat([createUint32Buffer(2), createUint32Buffer(0)])),
    createPngChunk('fcTL', createApngFrameControl(0, 1024, 1024)),
    ...firstFrameChunks
      .filter((chunk) => chunk.type === 'IDAT')
      .map((chunk) => createPngChunk(chunk.type, chunk.chunkData)),
    createPngChunk('fcTL', createApngFrameControl(1, 1024, 1024)),
    ...secondFrameChunks
      .filter((chunk) => chunk.type === 'IDAT')
      .map((chunk, index) => createPngChunk('fdAT', Buffer.concat([
        createUint32Buffer(index + 2),
        chunk.chunkData,
      ]))),
    createPngChunk('IEND'),
  ]);
}

describe('share upload payload validation', () => {
  it('accepts and re-encodes a PNG with the requested square export dimensions', async () => {
    const sourceImage = await createPngBuffer(1024, 1024);
    const result = await parseShareUploadPayload({
      image: sourceImage.toString('base64'),
      width: 1024,
      locale: 'zh',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.width).toBe(1024);
      expect(result.value.locale).toBe('zh');
      await expect(sharp(result.value.imageBuffer).metadata()).resolves.toMatchObject({
        format: 'png',
        width: 1024,
        height: 1024,
      });
    }
  });

  it('accepts the fixed social share image dimensions', async () => {
    const sourceImage = await createPngBuffer(SHARE_SOCIAL_IMAGE_WIDTH, SHARE_SOCIAL_IMAGE_HEIGHT);
    const result = await parseShareUploadPayload({
      image: sourceImage.toString('base64'),
      width: SHARE_SOCIAL_IMAGE_WIDTH,
      locale: 'en',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.width).toBe(SHARE_SOCIAL_IMAGE_WIDTH);
    }
  });

  it('rejects data URI payloads before image decoding', async () => {
    const sourceImage = await createPngBuffer(1024, 1024);
    const result = await parseShareUploadPayload({
      image: `data:image/png;base64,${sourceImage.toString('base64')}`,
      width: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects unsupported export widths', async () => {
    const sourceImage = await createPngBuffer(1024, 1024);
    const result = await parseShareUploadPayload({
      image: sourceImage.toString('base64'),
      width: 300,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects truncated PNG data even when it has a valid PNG signature', async () => {
    const truncatedPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const result = await parseShareUploadPayload({
      image: truncatedPng.toString('base64'),
      width: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects square PNG dimensions that do not match the declared export width', async () => {
    const sourceImage = await createPngBuffer(512, 512);
    const result = await parseShareUploadPayload({
      image: sourceImage.toString('base64'),
      width: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects social PNGs that are not exactly 1200 by 630', async () => {
    const sourceImage = await createPngBuffer(SHARE_SOCIAL_IMAGE_WIDTH, SHARE_SOCIAL_IMAGE_WIDTH);
    const result = await parseShareUploadPayload({
      image: sourceImage.toString('base64'),
      width: SHARE_SOCIAL_IMAGE_WIDTH,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects animated PNGs before Sharp can flatten them to a static image', async () => {
    const animatedPng = await createAnimatedPngBuffer();
    await expect(sharp(animatedPng, { animated: true }).metadata()).resolves.toMatchObject({
      format: 'png',
      width: 1024,
      height: 1024,
    });

    await expect(parseShareUploadPayload({
      image: animatedPng.toString('base64'),
      width: 1024,
    })).resolves.toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects image bytes above the source byte limit before decoding', async () => {
    const oversizedImage = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      Buffer.alloc(SHARE_MAX_IMAGE_BYTES + 1),
    ]);
    const result = await parseShareUploadPayload({
      image: oversizedImage.toString('base64'),
      width: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'image_too_large', status: 413 });
  });
});
