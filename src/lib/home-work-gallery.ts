import type { SiteLocale } from '@/lib/site-locale';

export interface HomeWorkGalleryImage {
  readonly id: string;
  readonly src: string;
  readonly previewSrc: string;
  readonly width: number;
  readonly height: number;
}

export interface HomeWorkGalleryCopy {
  eyebrow: string;
  title: string;
  description: string;
  loadMoreLabel: string;
  downloadLabel: string;
  artworkLabel: string;
  countSeparator: string;
}

export const HOME_WORK_GALLERY_INITIAL_COUNT = 12;
export const HOME_WORK_GALLERY_BATCH_SIZE = 12;

const homeWorkGalleryImageIds = [
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

function createHomeWorkGalleryImage(imageId: string): HomeWorkGalleryImage {
  if (!/^[A-Za-z0-9_-]+$/.test(imageId)) {
    throw new Error(`Invalid home work gallery image id: ${imageId}`);
  }

  return {
    id: imageId,
    src: `/work-gallery/${imageId}.png`,
    previewSrc: `/work-gallery/${imageId}.webp`,
    width: 1200,
    height: 630,
  };
}

export const HOME_WORK_GALLERY_IMAGES: readonly HomeWorkGalleryImage[] = homeWorkGalleryImageIds.map(
  createHomeWorkGalleryImage,
);

const homeWorkGalleryCopyByLocale: Record<SiteLocale, HomeWorkGalleryCopy> = {
  en: {
    eyebrow: 'Token gallery',
    title: 'Find a Token You Want to Drop Into Your Campaign',
    description: 'Explore 54 ready-made results across heroes, monsters, borders, and visual styles. When one fits your campaign, download it directly and bring it to the table.',
    loadMoreLabel: 'View More',
    downloadLabel: 'Download work',
    artworkLabel: 'Fantasy token artwork',
    countSeparator: 'of',
  },
  zh: {
    eyebrow: '作品展示',
    title: '找到一枚让你想立刻带进战役的 Token',
    description: '从 54 个英雄、怪物、边框和视觉风格各异的成品中寻找灵感。遇到适合自己战役的作品，可以直接下载并带到跑团桌上。',
    loadMoreLabel: '查看更多',
    downloadLabel: '下载作品',
    artworkLabel: '奇幻 Token 作品',
    countSeparator: '/',
  },
};

export function getHomeWorkGalleryCopy(locale: SiteLocale): HomeWorkGalleryCopy {
  const homeWorkGalleryCopy = homeWorkGalleryCopyByLocale[locale];

  if (!homeWorkGalleryCopy) {
    throw new Error(`Unsupported home work gallery locale: ${locale}`);
  }

  return homeWorkGalleryCopy;
}
