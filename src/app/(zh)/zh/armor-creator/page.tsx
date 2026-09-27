import type { Metadata } from 'next';

import { ArmorCreatorPageView } from '@/components/armor-creator/ArmorCreatorPageView';
import { getArmorCreatorCopy } from '@/lib/armor-creator/copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'zh';
const copy = getArmorCreatorCopy(locale);
const siteConfig = getSiteConfig(locale);
const path = '/armor-creator';
const localizedPath = '/zh/armor-creator';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: copy.pageTitle,
  },
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

export default function ChineseArmorCreatorPage() {
  return <ArmorCreatorPageView locale={locale} />;
}
