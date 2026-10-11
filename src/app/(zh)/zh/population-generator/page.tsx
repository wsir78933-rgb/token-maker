import type { Metadata } from 'next';

import { PopulationGeneratorPageView } from '@/components/population-generator/PopulationGeneratorPageView';
import {
  getPopulationPageCopy,
  POPULATION_GENERATOR_PATH,
} from '@/lib/population-generator/page-copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'zh';
const localizedPath = getLocalizedPath(locale, POPULATION_GENERATOR_PATH);
const copy = getPopulationPageCopy(locale);
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: copy.pageTitle },
  description: copy.pageDescription,
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(POPULATION_GENERATOR_PATH),
  },
  openGraph: {
    title: copy.pageTitle,
    description: copy.pageDescription,
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
    title: copy.pageTitle,
    description: copy.pageDescription,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function ChinesePopulationGeneratorPage() {
  return <PopulationGeneratorPageView locale={locale} />;
}
