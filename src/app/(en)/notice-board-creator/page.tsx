import type { Metadata } from 'next';

import { NoticeBoardCreatorPageView } from '@/components/notice-board-creator/NoticeBoardCreatorPageView';
import { getNoticeBoardCreatorLandingCopy } from '@/lib/notice-board-creator/landing-copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'en';
const pageCopy = getNoticeBoardCreatorLandingCopy(locale);
const siteConfig = getSiteConfig(locale);
const path = '/notice-board-creator';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: pageCopy.pageTitle,
  },
  description: pageCopy.pageDescription,
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: pageCopy.pageTitle,
    description: pageCopy.pageDescription,
    url: path,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: pageCopy.pageTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageCopy.pageTitle,
    description: pageCopy.pageDescription,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function NoticeBoardCreatorPage() {
  return <NoticeBoardCreatorPageView locale={locale} />;
}
