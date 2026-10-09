import type { Metadata } from 'next';

import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath, isSiteLocale, type SiteLocale } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const TOOL_DIRECTORY_PATH = '/tools';

const toolDirectoryCopyByLocale = {
  en: {
    title: 'Free Tabletop and Fantasy Tools',
    description:
      "Explore Token Maker's free tools for tabletop and fantasy projects, from character tokens and heraldry to maps, weapons, calendars, and more.",
  },
  zh: {
    title: '免费桌游与奇幻创作工具',
    description: '浏览 Token Maker 的桌游与奇幻创作工具，从角色 Token 和纹章到地图、武器与日历制作。',
  },
} as const;

export function getToolDirectoryMetadata(locale: SiteLocale): Metadata {
  if (!isSiteLocale(locale)) {
    throw new Error(`Tool directory metadata locale is invalid. Received ${JSON.stringify(locale)}.`);
  }

  const toolDirectoryCopy = toolDirectoryCopyByLocale[locale];
  const siteConfig = getSiteConfig(locale);
  const canonicalPath = getLocalizedPath(locale, TOOL_DIRECTORY_PATH);
  const imageUrl = getSeoImageUrl(locale, 'home');

  return {
    metadataBase: new URL(getSiteUrl()),
    title: toolDirectoryCopy.title,
    description: toolDirectoryCopy.description,
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates(TOOL_DIRECTORY_PATH),
    },
    openGraph: {
      title: `${toolDirectoryCopy.title} | ${siteConfig.name}`,
      description: toolDirectoryCopy.description,
      url: absoluteUrl(canonicalPath),
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: toolDirectoryCopy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${toolDirectoryCopy.title} | ${siteConfig.name}`,
      description: toolDirectoryCopy.description,
      images: [imageUrl],
    },
  };
}
