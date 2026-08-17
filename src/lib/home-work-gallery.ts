import type { SiteLocale } from '@/lib/site-locale';

export interface HomeWorkGalleryImage {
  readonly id: string;
  readonly src: string;
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

export const HOME_WORK_GALLERY_IMAGES: readonly HomeWorkGalleryImage[] = [
  { id: '-CHRu5fo-1', src: '/work-gallery/-CHRu5fo-1.png', width: 1200, height: 630 },
  { id: '-H4obUacwq', src: '/work-gallery/-H4obUacwq.png', width: 1200, height: 630 },
  { id: '-J-dX21qv_', src: '/work-gallery/-J-dX21qv_.png', width: 1200, height: 630 },
  { id: '-S78ERrRn-', src: '/work-gallery/-S78ERrRn-.png', width: 1200, height: 630 },
  { id: '-YtfWbsZBu', src: '/work-gallery/-YtfWbsZBu.png', width: 1200, height: 630 },
  { id: '-kMpbrlqs2', src: '/work-gallery/-kMpbrlqs2.png', width: 1200, height: 630 },
  { id: '-oR8l_VTsQ', src: '/work-gallery/-oR8l_VTsQ.png', width: 1200, height: 630 },
  { id: '04I6TlEWQP', src: '/work-gallery/04I6TlEWQP.png', width: 1200, height: 630 },
  { id: '0HCPcqWx2d', src: '/work-gallery/0HCPcqWx2d.png', width: 1200, height: 630 },
  { id: '0Mu4b0sBAY', src: '/work-gallery/0Mu4b0sBAY.png', width: 1200, height: 630 },
  { id: '0NM7e8o0aJ', src: '/work-gallery/0NM7e8o0aJ.png', width: 1200, height: 630 },
  { id: '0_IaTVSOa0', src: '/work-gallery/0_IaTVSOa0.png', width: 1200, height: 630 },
  { id: '0bmBL-1G0X', src: '/work-gallery/0bmBL-1G0X.png', width: 1200, height: 630 },
  { id: '0k-6UsJzfB', src: '/work-gallery/0k-6UsJzfB.png', width: 1200, height: 630 },
  { id: '0yJc-ZgsHP', src: '/work-gallery/0yJc-ZgsHP.png', width: 1200, height: 630 },
  { id: '1AWcSOmW1a', src: '/work-gallery/1AWcSOmW1a.png', width: 1200, height: 630 },
  { id: '1irw8Z5hC1', src: '/work-gallery/1irw8Z5hC1.png', width: 1200, height: 630 },
  { id: '22t2gS4KtX', src: '/work-gallery/22t2gS4KtX.png', width: 1200, height: 630 },
  { id: '2943TclzYk', src: '/work-gallery/2943TclzYk.png', width: 1200, height: 630 },
  { id: '2dUk1xDhem', src: '/work-gallery/2dUk1xDhem.png', width: 1200, height: 630 },
  { id: '3_5ByLuSkp', src: '/work-gallery/3_5ByLuSkp.png', width: 1200, height: 630 },
  { id: '3uLXUQNVJv', src: '/work-gallery/3uLXUQNVJv.png', width: 1200, height: 630 },
  { id: '4f8zZkiHbB', src: '/work-gallery/4f8zZkiHbB.png', width: 1200, height: 630 },
  { id: '6A4e-G8MAO', src: '/work-gallery/6A4e-G8MAO.png', width: 1200, height: 630 },
  { id: '6ziZT2lISs', src: '/work-gallery/6ziZT2lISs.png', width: 1200, height: 630 },
  { id: '71kFxqhnvJ', src: '/work-gallery/71kFxqhnvJ.png', width: 1200, height: 630 },
  { id: '7PVrRB8ksj', src: '/work-gallery/7PVrRB8ksj.png', width: 1200, height: 630 },
  { id: '7cquGVmQpI', src: '/work-gallery/7cquGVmQpI.png', width: 1200, height: 630 },
  { id: '7hgwUJLrPa', src: '/work-gallery/7hgwUJLrPa.png', width: 1200, height: 630 },
  { id: '7ipNZJZFHg', src: '/work-gallery/7ipNZJZFHg.png', width: 1200, height: 630 },
  { id: '7wvHaPVmE7', src: '/work-gallery/7wvHaPVmE7.png', width: 1200, height: 630 },
  { id: '8CiwupmkaG', src: '/work-gallery/8CiwupmkaG.png', width: 1200, height: 630 },
  { id: '8X3B97x95s', src: '/work-gallery/8X3B97x95s.png', width: 1200, height: 630 },
  { id: '9MH4p7Zj9D', src: '/work-gallery/9MH4p7Zj9D.png', width: 1200, height: 630 },
  { id: '9cmVcfPKB4', src: '/work-gallery/9cmVcfPKB4.png', width: 1200, height: 630 },
  { id: 'AFUbRwgzOh', src: '/work-gallery/AFUbRwgzOh.png', width: 1200, height: 630 },
  { id: 'AFmMVkNXbC', src: '/work-gallery/AFmMVkNXbC.png', width: 1200, height: 630 },
  { id: 'AKc0tJkLcD', src: '/work-gallery/AKc0tJkLcD.png', width: 1200, height: 630 },
  { id: 'APIb3pwKwf', src: '/work-gallery/APIb3pwKwf.png', width: 1200, height: 630 },
  { id: 'BAfleWr-fb', src: '/work-gallery/BAfleWr-fb.png', width: 1200, height: 630 },
  { id: 'Ceudcj6AE9', src: '/work-gallery/Ceudcj6AE9.png', width: 1200, height: 630 },
  { id: 'D6mPbznFDt', src: '/work-gallery/D6mPbznFDt.png', width: 1200, height: 630 },
  { id: 'DEHtMCcCha', src: '/work-gallery/DEHtMCcCha.png', width: 1200, height: 630 },
  { id: 'E5_caSnIay', src: '/work-gallery/E5_caSnIay.png', width: 1200, height: 630 },
  { id: 'EphTNtls6x', src: '/work-gallery/EphTNtls6x.png', width: 1200, height: 630 },
  { id: 'HGP42GSeIu', src: '/work-gallery/HGP42GSeIu.png', width: 1200, height: 630 },
  { id: 'HwaVPKu8Ax', src: '/work-gallery/HwaVPKu8Ax.png', width: 1200, height: 630 },
  { id: 'PyoSh650-U', src: '/work-gallery/PyoSh650-U.png', width: 1200, height: 630 },
  { id: 'TegdmBxfdu', src: '/work-gallery/TegdmBxfdu.png', width: 1200, height: 630 },
  { id: 'X1bOjNtRDB', src: '/work-gallery/X1bOjNtRDB.png', width: 1200, height: 630 },
  { id: 'iW2cbrWZmT', src: '/work-gallery/iW2cbrWZmT.png', width: 1200, height: 630 },
  { id: 'q5XmZRWfoR', src: '/work-gallery/q5XmZRWfoR.png', width: 1200, height: 630 },
  { id: 'r7LvEhEAmW', src: '/work-gallery/r7LvEhEAmW.png', width: 1200, height: 630 },
  { id: 'x61xA2Sglg', src: '/work-gallery/x61xA2Sglg.png', width: 1200, height: 630 },
];

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
