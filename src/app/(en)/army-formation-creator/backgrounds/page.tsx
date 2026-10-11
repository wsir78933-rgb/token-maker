import type { Metadata } from 'next';

import { ArmyBackgroundGalleryPageView } from '@/components/army-formation/ArmyBackgroundGalleryPageView';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'en';
const path = '/army-formation-creator/backgrounds';
const title = 'Battle Map Background Library | Army Formation Creator';
const description =
  'Browse and preview 477 battle maps for the Army Formation Creator. Filter maps by terrain category and source.';
const siteConfig = getSiteConfig(locale);
const socialImageUrl = getSeoImageUrl(locale, 'home');

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title,
    description,
    url: path,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImageUrl],
  },
};

export default function ArmyBackgroundGalleryPage() {
  return <ArmyBackgroundGalleryPageView locale="en" />;
}
