import type { Metadata } from 'next';

import { ArmyBackgroundGalleryPageView } from '@/components/army-formation/ArmyBackgroundGalleryPageView';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'zh';
const path = '/army-formation-creator/backgrounds';
const localizedPath = '/zh/army-formation-creator/backgrounds';
const title = '军阵背景素材库 | 军阵编辑器';
const description = '浏览和预览 477 张军阵背景地图，按地形分类和素材来源筛选。';
const siteConfig = getSiteConfig(locale);
const socialImageUrl = getSeoImageUrl(locale, 'home');

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title,
    description,
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImageUrl],
  },
};

export default function ChineseArmyBackgroundGalleryPage() {
  return <ArmyBackgroundGalleryPageView locale="zh" />;
}
