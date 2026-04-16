import type { Metadata } from 'next';

import { DiceRollerPageView } from '@/components/site/views/DiceRollerPageView';
import { getDiceRollerPageCopy, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'en';
const copy = getDiceRollerPageCopy(locale);
const siteConfig = getSiteConfig(locale);
const path = '/dice-roller-dnd';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: copy.metadataTitle,
  },
  description: copy.metadataDescription,
  keywords: [
    'dice roller dnd',
    'd20 roller',
    'dnd dice roller',
    '3d dice roller',
    'online dice roller',
  ],
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    url: path,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: copy.title,
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

export default function DiceRollerDndPage() {
  return <DiceRollerPageView locale={locale} />;
}
