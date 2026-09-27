import type { Metadata } from 'next';

import { ArmyFormationCreatorPageView } from '@/components/army-formation/ArmyFormationCreatorPageView';
import { getArmyFormationCreatorCopy } from '@/lib/army-formation/copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'zh';
const copy = getArmyFormationCreatorCopy(locale);
const siteConfig = getSiteConfig(locale);
const path = '/army-formation-creator';
const localizedPath = '/zh/army-formation-creator';

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

export default function ChineseArmyFormationCreatorPage() {
  return <ArmyFormationCreatorPageView locale={locale} />;
}
