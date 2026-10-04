// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
  ARMY_BACKGROUND_IMAGE_WEBP_QUALITY,
  compressArmyFormationBackgroundImage,
} from '@/lib/army-formation/background-image-upload';

const COMPRESSED_WEBP_DATA_URL = 'data:image/webp;base64,compressed';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function createBackgroundImageFile(): File {
  return new File([new Uint8Array([1])], 'field.png', { type: 'image/png' });
}

function createImageBitmapMock(width: number, height: number) {
  const close = vi.fn();
  const imageBitmap = { width, height, close } as unknown as ImageBitmap;
  const createImageBitmap = vi.fn().mockResolvedValue(imageBitmap);

  vi.stubGlobal('createImageBitmap', createImageBitmap);

  return { imageBitmap, close, createImageBitmap };
}

function mockCompressionCanvas() {
  const canvas = document.createElement('canvas');
  const drawImage = vi.fn();
  const canvasContext = { drawImage } as unknown as CanvasRenderingContext2D;

  vi.spyOn(document, 'createElement').mockReturnValue(canvas);
  vi.spyOn(canvas, 'getContext').mockReturnValue(canvasContext);
  const toDataURL = vi.spyOn(canvas, 'toDataURL').mockReturnValue(COMPRESSED_WEBP_DATA_URL);

  return { canvas, drawImage, toDataURL };
}

describe('compressArmyFormationBackgroundImage', () => {
  it('等比缩小超大横图到 2048×1536 并使用指定 WebP 质量', async () => {
    const { imageBitmap, close } = createImageBitmapMock(4000, 3000);
    const { canvas, drawImage, toDataURL } = mockCompressionCanvas();

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
      ARMY_BACKGROUND_IMAGE_MAX_DIMENSION_PX,
    );

    expect(result).toEqual({ status: 'compressed', dataUrl: COMPRESSED_WEBP_DATA_URL });
    expect(canvas.width).toBe(2048);
    expect(canvas.height).toBe(1536);
    expect(drawImage).toHaveBeenCalledWith(imageBitmap, 0, 0, 2048, 1536);
    expect(toDataURL).toHaveBeenCalledWith('image/webp', ARMY_BACKGROUND_IMAGE_WEBP_QUALITY);
    expect(ARMY_BACKGROUND_IMAGE_WEBP_QUALITY).toBe(0.92);
    expect(close).toHaveBeenCalledOnce();
  });

  it.each([
    { label: '横图', source: [4000, 3000], expected: [2048, 1536] },
    { label: '竖图', source: [3000, 4000], expected: [1536, 2048] },
    { label: '方图', source: [4000, 4000], expected: [2048, 2048] },
  ])('保持$label比例并限制到2048像素长边', async ({ source, expected }) => {
    createImageBitmapMock(source[0], source[1]);
    const { canvas } = mockCompressionCanvas();

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      8192,
      8192,
    );

    expect(result.status).toBe('compressed');
    expect(canvas.width).toBe(expected[0]);
    expect(canvas.height).toBe(expected[1]);
  });

  it('不会放大低分辨率图片', async () => {
    createImageBitmapMock(640, 480);
    const { canvas } = mockCompressionCanvas();

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      2048,
      2048,
    );

    expect(result.status).toBe('compressed');
    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(480);
  });

  it('解码失败时返回带具体错误的拒绝结果', async () => {
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn().mockRejectedValue(new Error('decoder rejected image')),
    );

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      2048,
      2048,
    );

    expect(result).toMatchObject({ status: 'rejected', reason: 'decode-failed' });
    if (result.status === 'rejected') {
      expect(result.received).toContain('field.png');
      expect(result.received).toContain('Error: decoder rejected image');
    }
  });

  it('编码失败时返回带具体错误的拒绝结果并释放 ImageBitmap', async () => {
    const { close } = createImageBitmapMock(4000, 3000);
    const { toDataURL } = mockCompressionCanvas();
    toDataURL.mockImplementation(() => {
      throw new Error('encoder rejected image');
    });

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      2048,
      2048,
    );

    expect(result).toMatchObject({ status: 'rejected', reason: 'compression-failed' });
    if (result.status === 'rejected') {
      expect(result.received).toContain('Error: encoder rejected image');
    }
    expect(close).toHaveBeenCalledOnce();
  });

  it.each([
    { width: Number.NaN, height: 1200, received: 'NaN×1200 px' },
    { width: Number.POSITIVE_INFINITY, height: 1200, received: 'Infinity×1200 px' },
    { width: 0, height: 1200, received: '0×1200 px' },
    { width: 1200, height: -1, received: '1200×-1 px' },
  ])('拒绝非有限或非正的解码尺寸 $received', async ({ width, height, received }) => {
    const { close } = createImageBitmapMock(width, height);

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      2048,
      2048,
    );

    expect(result).toMatchObject({ status: 'rejected', reason: 'decode-failed' });
    if (result.status === 'rejected') {
      expect(result.received).toContain(received);
    }
    expect(close).toHaveBeenCalledOnce();
  });

  it('拒绝超过20 MiB的文件而不尝试解码', async () => {
    const file = createBackgroundImageFile();
    Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 + 1 });
    const createImageBitmap = vi.fn();
    vi.stubGlobal('createImageBitmap', createImageBitmap);

    const result = await compressArmyFormationBackgroundImage(file, 2048, 2048);

    expect(result).toEqual({
      status: 'rejected',
      reason: 'file-too-large',
      received: `${20 * 1024 * 1024 + 1} bytes`,
    });
    expect(createImageBitmap).not.toHaveBeenCalled();
  });

  it('缺少 createImageBitmap 时返回明确的 API 边界错误', async () => {
    vi.stubGlobal('createImageBitmap', undefined);

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      2048,
      2048,
    );

    expect(result).toMatchObject({ status: 'rejected', reason: 'decode-failed' });
    if (result.status === 'rejected') {
      expect(result.received).toContain(
        'createImageBitmap to be a function, received undefined',
      );
    }
  });

  it('解码 API 返回非对象时报告实际返回值', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(undefined));

    const result = await compressArmyFormationBackgroundImage(
      createBackgroundImageFile(),
      2048,
      2048,
    );

    expect(result).toMatchObject({ status: 'rejected', reason: 'decode-failed' });
    if (result.status === 'rejected') {
      expect(result.received).toContain('createImageBitmap returned undefined');
    }
  });

  it.each([
    { maxWidthPx: Number.NaN, maxHeightPx: 2048, received: 'width must be positive, received NaN' },
    { maxWidthPx: 2048, maxHeightPx: Number.POSITIVE_INFINITY, received: 'height must be positive, received Infinity' },
    { maxWidthPx: 0, maxHeightPx: 2048, received: 'width must be positive, received 0' },
  ])('非法最大尺寸错误包含实际值：$received', async ({ maxWidthPx, maxHeightPx, received }) => {
    await expect(
      compressArmyFormationBackgroundImage(createBackgroundImageFile(), maxWidthPx, maxHeightPx),
    ).rejects.toThrow(received);
  });
});
