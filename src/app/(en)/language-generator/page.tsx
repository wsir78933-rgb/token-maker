import type { Metadata } from 'next';

import { LanguageGeneratorPageView } from '@/components/language-generator/LanguageGeneratorPageView';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'en';
const path = '/language-generator';
const copy = getLanguageGeneratorCopy(locale);
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: copy.pageTitle },
  description: copy.pageDescription,
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: copy.pageTitle,
    description: copy.pageDescription,
    url: path,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
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

export default function LanguageGeneratorPage() {
  return <LanguageGeneratorPageView locale={locale} />;
}
