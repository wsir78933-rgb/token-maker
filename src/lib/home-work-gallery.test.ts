import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const expectedImageIds = [
  '-CHRu5fo-1',
  '-H4obUacwq',
  '-J-dX21qv_',
  '-S78ERrRn-',
  '-YtfWbsZBu',
  '-kMpbrlqs2',
  '-oR8l_VTsQ',
  '04I6TlEWQP',
  '0HCPcqWx2d',
  '0Mu4b0sBAY',
  '0NM7e8o0aJ',
  '0_IaTVSOa0',
  '0bmBL-1G0X',
  '0k-6UsJzfB',
  '0yJc-ZgsHP',
  '1AWcSOmW1a',
  '1irw8Z5hC1',
  '22t2gS4KtX',
  '2943TclzYk',
  '2dUk1xDhem',
  '3_5ByLuSkp',
  '3uLXUQNVJv',
  '4f8zZkiHbB',
  '6A4e-G8MAO',
  '6ziZT2lISs',
  '71kFxqhnvJ',
  '7PVrRB8ksj',
  '7cquGVmQpI',
  '7hgwUJLrPa',
  '7ipNZJZFHg',
  '7wvHaPVmE7',
  '8CiwupmkaG',
  '8X3B97x95s',
  '9MH4p7Zj9D',
  '9cmVcfPKB4',
  'AFUbRwgzOh',
  'AFmMVkNXbC',
  'AKc0tJkLcD',
  'APIb3pwKwf',
  'BAfleWr-fb',
  'Ceudcj6AE9',
  'D6mPbznFDt',
  'DEHtMCcCha',
  'E5_caSnIay',
  'EphTNtls6x',
  'HGP42GSeIu',
  'HwaVPKu8Ax',
  'PyoSh650-U',
  'TegdmBxfdu',
  'X1bOjNtRDB',
  'iW2cbrWZmT',
  'q5XmZRWfoR',
  'r7LvEhEAmW',
  'x61xA2Sglg',
] as const;

const expectedImagePaths = expectedImageIds.map((imageId) => `/work-gallery/${imageId}.png`);
const expectedPreviewPaths = expectedImageIds.map((imageId) => `/work-gallery/${imageId}.webp`);

const publicWorkGalleryDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/work-gallery');

function getPngDimensions(pngPath: string) {
  const pngBuffer = readFileSync(pngPath);

  if (pngBuffer.length < 24) {
    throw new Error(`PNG is too small to contain an IHDR header: ${pngPath}`);
  }

  const pngSignature = '89504e470d0a1a0a';

  if (pngBuffer.subarray(0, 8).toString('hex') !== pngSignature) {
    throw new Error(`Invalid PNG signature: ${pngPath}`);
  }

  return {
    width: pngBuffer.readUInt32BE(16),
    height: pngBuffer.readUInt32BE(20),
  };
}

function getWebpDimensions(webpPath: string) {
  const webpBuffer = readFileSync(webpPath);

  if (webpBuffer.length < 30) {
    throw new Error(`WebP is too small to contain a header: ${webpPath}`);
  }

  if (webpBuffer.toString('ascii', 0, 4) !== 'RIFF' || webpBuffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Invalid WebP signature: ${webpPath}`);
  }

  const chunkType = webpBuffer.toString('ascii', 12, 16);

  if (chunkType === 'VP8X') {
    return {
      width: 1 + webpBuffer.readUIntLE(24, 3),
      height: 1 + webpBuffer.readUIntLE(27, 3),
    };
  }

  if (chunkType === 'VP8L') {
    if (webpBuffer[20] !== 0x2f) {
      throw new Error(`Invalid VP8L signature: ${webpPath}`);
    }

    const dimensionBits = webpBuffer.readUInt32LE(21);

    return {
      width: (dimensionBits & 0x3fff) + 1,
      height: ((dimensionBits >> 14) & 0x3fff) + 1,
    };
  }

  throw new Error(`Unsupported WebP chunk ${chunkType}: ${webpPath}`);
}

async function loadHomeWorkGalleryModule() {
  return import('./home-work-gallery');
}

describe('home work gallery manifest', () => {
  it('exports the exact gallery manifest contract', async () => {
    const {
      HOME_WORK_GALLERY_BATCH_SIZE,
      HOME_WORK_GALLERY_IMAGES,
      HOME_WORK_GALLERY_INITIAL_COUNT,
    } = await loadHomeWorkGalleryModule();

    expect(HOME_WORK_GALLERY_INITIAL_COUNT).toBe(12);
    expect(HOME_WORK_GALLERY_BATCH_SIZE).toBe(12);
    expect(HOME_WORK_GALLERY_IMAGES).toHaveLength(54);
    expect(HOME_WORK_GALLERY_IMAGES.map((image) => image.id)).toEqual(expectedImageIds);
    expect(HOME_WORK_GALLERY_IMAGES.map((image) => image.src)).toEqual(expectedImagePaths);
    expect(HOME_WORK_GALLERY_IMAGES.map((image) => image.previewSrc)).toEqual(expectedPreviewPaths);
    expect(new Set(HOME_WORK_GALLERY_IMAGES.map((image) => image.id)).size).toBe(54);
    expect(new Set(HOME_WORK_GALLERY_IMAGES.map((image) => image.src)).size).toBe(54);
    expect(new Set(HOME_WORK_GALLERY_IMAGES.map((image) => image.previewSrc)).size).toBe(54);

    for (const image of HOME_WORK_GALLERY_IMAGES) {
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.src.endsWith('.png')).toBe(true);
      expect(image.previewSrc.endsWith('.webp')).toBe(true);
      expect(image.src.startsWith('/work-gallery/')).toBe(true);
      expect(image.previewSrc.startsWith('/work-gallery/')).toBe(true);
      expect(image.previewSrc).not.toBe(image.src);
    }
  });

  it('exports localized copy for both supported locales', async () => {
    const { getHomeWorkGalleryCopy } = await loadHomeWorkGalleryModule();

    expect(getHomeWorkGalleryCopy('en')).toEqual({
      eyebrow: 'Token gallery',
      title: 'Find a Token You Want to Drop Into Your Campaign',
      description:
        'Explore 54 ready-made results across heroes, monsters, borders, and visual styles. When one fits your campaign, download it directly and bring it to the table.',
      loadMoreLabel: 'View More',
      downloadLabel: 'Download work',
      artworkLabel: 'Fantasy token artwork',
      countSeparator: 'of',
    });
    expect(getHomeWorkGalleryCopy('zh')).toEqual({
      eyebrow: '作品展示',
      title: '找到一枚让你想立刻带进战役的 Token',
      description:
        '从 54 个英雄、怪物、边框和视觉风格各异的成品中寻找灵感。遇到适合自己战役的作品，可以直接下载并带到跑团桌上。',
      loadMoreLabel: '查看更多',
      downloadLabel: '下载作品',
      artworkLabel: '奇幻 Token 作品',
      countSeparator: '/',
    });
  });

  it('matches the public work gallery directory and real PNG and WebP dimensions to the manifest', async () => {
    const { HOME_WORK_GALLERY_IMAGES } = await loadHomeWorkGalleryModule();
    const pngFileNames = HOME_WORK_GALLERY_IMAGES.map((image) => path.basename(image.src)).sort();
    const webpFileNames = HOME_WORK_GALLERY_IMAGES.map((image) => path.basename(image.previewSrc)).sort();
    const publicWorkGalleryFileNames = readdirSync(publicWorkGalleryDirectory).sort();

    expect(publicWorkGalleryFileNames).toEqual([...pngFileNames, ...webpFileNames].sort());

    for (const image of HOME_WORK_GALLERY_IMAGES) {
      const pngPath = path.join(publicWorkGalleryDirectory, path.basename(image.src));
      const webpPath = path.join(publicWorkGalleryDirectory, path.basename(image.previewSrc));
      const pngDimensions = getPngDimensions(pngPath);
      const webpDimensions = getWebpDimensions(webpPath);

      expect(pngDimensions).toEqual({ width: 1200, height: 630 });
      expect(webpDimensions).toEqual({ width: 1200, height: 630 });
    }
  });
});
