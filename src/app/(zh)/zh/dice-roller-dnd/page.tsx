import type { Metadata } from 'next';

import { DiceRollerPageView } from '@/components/site/views/DiceRollerPageView';
import { getDiceRollerPageCopy, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'zh';
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
    'd20 掷骰',
    'dnd 掷骰器',
    '3d 骰子',
    '在线掷骰',
  ],
  alternates: {
    canonical: '/zh/dice-roller-dnd',
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    url: '/zh/dice-roller-dnd',
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
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

export default function ChineseDiceRollerDndPage() {
  return <DiceRollerPageView locale={locale} />;
}
