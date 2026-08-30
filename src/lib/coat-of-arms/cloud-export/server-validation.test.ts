import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { COAT_EXPORT_MAX_FILE_BYTES } from './constants';
import { parseCoatExportUploadPayload } from './server-validation';

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

async function createJpegBuffer(width: number, height: number) {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 28, g: 25, b: 23 },
    },
  }).jpeg().toBuffer();
}

function createPdfBuffer() {
  return Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n');
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

describe('coat export upload payload validation', () => {
  it('accepts and re-encodes a PNG whose longest edge is an allowed export size', async () => {
    const sourceFile = await createPngBuffer(512, 307);
    const result = await parseCoatExportUploadPayload({
      file: sourceFile.toString('base64'),
      fileType: 'png',
      width: 512,
      height: 307,
      locale: 'zh',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fileType).toBe('png');
      expect(result.value.width).toBe(512);
      expect(result.value.height).toBe(307);
      expect(result.value.locale).toBe('zh');
      await expect(sharp(result.value.fileBuffer).metadata()).resolves.toMatchObject({
        format: 'png',
        width: 512,
        height: 307,
      });
    }
  });

  it('accepts and re-encodes a JPEG whose longest edge is an allowed export size', async () => {
    const sourceFile = await createJpegBuffer(1024, 576);
    const result = await parseCoatExportUploadPayload({
      file: sourceFile.toString('base64'),
      fileType: 'jpeg',
      width: 1024,
      height: 576,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fileType).toBe('jpeg');
      expect(result.value.width).toBe(1024);
      expect(result.value.height).toBe(576);
      expect(result.value.locale).toBe('en');
      await expect(sharp(result.value.fileBuffer).metadata()).resolves.toMatchObject({
        format: 'jpeg',
        width: 1024,
        height: 576,
      });
    }
  });

  it('accepts a PDF that starts with %PDF without re-encoding', async () => {
    const sourceFile = createPdfBuffer();
    const result = await parseCoatExportUploadPayload({
      file: sourceFile.toString('base64'),
      fileType: 'pdf',
      width: 2048,
      height: 1229,
      locale: 'fr',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fileType).toBe('pdf');
      expect(result.value.width).toBe(2048);
      expect(result.value.height).toBe(1229);
      expect(result.value.locale).toBe('en');
      expect(result.value.fileBuffer.equals(sourceFile)).toBe(true);
    }
  });

  it('rejects data URI payloads before decoding', async () => {
    const sourceFile = await createPngBuffer(512, 512);
    const result = await parseCoatExportUploadPayload({
      file: `data:image/png;base64,${sourceFile.toString('base64')}`,
      fileType: 'png',
      width: 512,
      height: 512,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_file', status: 400 });
  });

  it('rejects raster bytes whose metadata dimensions do not match the declared size', async () => {
    const sourceFile = await createPngBuffer(256, 256);
    const result = await parseCoatExportUploadPayload({
      file: sourceFile.toString('base64'),
      fileType: 'png',
      width: 512,
      height: 512,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_file', status: 400 });
  });

  it('rejects payloads whose longest edge is not an allowed export size', async () => {
    const sourceFile = await createPngBuffer(300, 400);
    const result = await parseCoatExportUploadPayload({
      file: sourceFile.toString('base64'),
      fileType: 'png',
      width: 300,
      height: 400,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_file', status: 400 });
  });

  it('rejects file bytes above the source byte limit before decoding', async () => {
    const oversizedFile = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      Buffer.alloc(COAT_EXPORT_MAX_FILE_BYTES + 1),
    ]);
    const result = await parseCoatExportUploadPayload({
      file: oversizedFile.toString('base64'),
      fileType: 'png',
      width: 1024,
      height: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'file_too_large', status: 413 });
  });

  it('rejects animated PNGs before Sharp can flatten them to a static image', async () => {
    const animatedPng = await createAnimatedPngBuffer();
    await expect(sharp(animatedPng, { animated: true }).metadata()).resolves.toMatchObject({
      format: 'png',
      width: 1024,
      height: 1024,
    });

    await expect(parseCoatExportUploadPayload({
      file: animatedPng.toString('base64'),
      fileType: 'png',
      width: 1024,
      height: 1024,
    })).resolves.toEqual({ ok: false, error: 'invalid_file', status: 400 });
  });

  it('rejects illegal fileType values', async () => {
    const sourceFile = await createPngBuffer(512, 512);
    const result = await parseCoatExportUploadPayload({
      file: sourceFile.toString('base64'),
      fileType: 'webp',
      width: 512,
      height: 512,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_file', status: 400 });
  });
});
