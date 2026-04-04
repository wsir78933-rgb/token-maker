import type { Metadata, Viewport } from 'next';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
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
    applicationName: siteConfig.name,
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: rootPath,
      siteName: siteConfig.name,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: getSeoImageUrl(locale, 'home'),
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      images: [getSeoImageUrl(locale, 'home')],
    },
    icons: {
      icon: [{ url: iconUrl, type: 'image/svg+xml', sizes: 'any' }],
      shortcut: [iconUrl],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function createSiteViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    interactiveWidget: 'resizes-content',
  };
}
