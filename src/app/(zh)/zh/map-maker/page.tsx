import type { Metadata } from 'next';

import { MapMakerPageView } from '@/components/map-maker/MapMakerPageView';
import { getMapMakerCopy } from '@/lib/map-maker/copy';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'zh' as const;
const path = '/map-maker';
const localizedPath = getLocalizedPath(locale, path);
const copy = getMapMakerCopy(locale);
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: copy.pageTitle },
  description: copy.pageDescription,
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: copy.pageTitle,
    description: copy.pageDescription,
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
    images: [{ url: getSeoImageUrl(locale, 'home'), width: 1200, height: 630, alt: copy.pageTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.pageTitle,
    description: copy.pageDescription,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function ChineseMapMakerPage() {
  return <MapMakerPageView locale={locale} />;
}
