import type { Metadata } from 'next';

import { EmblemCreatorPageView } from '@/components/emblem-creator/EmblemCreatorPageView';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'zh';
const copy = getEmblemCreatorCopy(locale);
const siteConfig = getSiteConfig(locale);
const path = '/emblem-creator';
const localizedPath = getLocalizedPath(locale, path);

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

export default function ChineseEmblemCreatorPage() {
  return <EmblemCreatorPageView locale={locale} />;
}
