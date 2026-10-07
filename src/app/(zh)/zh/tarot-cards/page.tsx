import type { Metadata } from 'next';

import { TarotPageView } from '@/components/tarot-cards/TarotPageView';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getNavLabels, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { buildBreadcrumbStructuredData } from '@/lib/site-page-models';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'zh';
const path = '/tarot-cards';
const localizedPath = getLocalizedPath(locale, path);
const copy = getTarotCopy(locale);
const siteConfig = getSiteConfig(locale);
const navLabels = getNavLabels(locale);

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: copy.pageTitle,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: absoluteUrl(localizedPath),
  description: copy.pageDescription,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: copy.metadataTitle,
  },
  description: copy.metadataDescription,
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: copy.pageTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function ChineseTarotCardsPage() {
  return (
    <>
      <StructuredData id={`tarot-cards-${locale}-jsonld`} data={structuredData} />
      <StructuredData
        id={`tarot-cards-${locale}-breadcrumb-jsonld`}
        data={buildBreadcrumbStructuredData(locale, [
          { name: navLabels.editor, path: '/' },
          { name: copy.navigationTitle, path },
        ])}
      />
      <TarotPageView locale={locale} />
    </>
  );
}
