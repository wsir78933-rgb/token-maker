import type { Metadata } from 'next';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import type { SiteLocale } from '@/lib/site-locale';

export function getHtmlLang(locale: SiteLocale) {
  return locale === 'zh' ? 'zh-CN' : 'en';
}

export function createLocaleLayoutMetadata(locale: SiteLocale): Metadata {
  const siteConfig = getSiteConfig(locale);
  const rootPath = locale === 'zh' ? '/zh' : '/';
  const iconUrl = '/icon.svg?v=20260312b';

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    applicationName: siteConfig.name,
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: rootPath,
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
    },
    icons: {
      icon: [{ url: iconUrl, type: 'image/svg+xml', sizes: 'any' }],
      shortcut: [iconUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
