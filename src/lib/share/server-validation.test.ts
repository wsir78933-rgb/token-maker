import { describe, expect, it } from 'vitest';
import { SHARE_MAX_IMAGE_BYTES } from './constants';
import { parseShareUploadPayload } from './server-validation';

const pngBytes = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d,
]);

describe('share upload payload validation', () => {
  it('accepts a base64 PNG payload', () => {
    const result = parseShareUploadPayload({
      image: pngBytes.toString('base64'),
      width: 1024,
      locale: 'zh',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.width).toBe(1024);
      expect(result.value.locale).toBe('zh');
      expect(result.value.imageBuffer.subarray(0, 8).equals(pngBytes.subarray(0, 8))).toBe(true);
    }
  });

  it('rejects data URI payloads', () => {
    const result = parseShareUploadPayload({
      image: `data:image/png;base64,${pngBytes.toString('base64')}`,
      width: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects unsupported export widths', () => {
    const result = parseShareUploadPayload({
      image: pngBytes.toString('base64'),
      width: 300,
    });

    expect(result).toEqual({ ok: false, error: 'invalid_image', status: 400 });
  });

  it('rejects oversized PNG payloads', () => {
    const oversized = Buffer.concat([
      pngBytes.subarray(0, 8),
      Buffer.alloc(SHARE_MAX_IMAGE_BYTES + 1),
    ]);

    const result = parseShareUploadPayload({
      image: oversized.toString('base64'),
      width: 1024,
    });

    expect(result).toEqual({ ok: false, error: 'image_too_large', status: 413 });
  });
});
