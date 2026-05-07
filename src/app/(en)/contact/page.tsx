import type { Metadata } from 'next';

import { ContactPageView } from '@/components/site/views/ContactPageView';
import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'en';
const siteConfig = getSiteConfig(locale);
const title = 'Contact Token Maker';
const description =
  'Send feedback, bug reports, workflow questions, or missing token style requests to Token Maker.';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  alternates: {
    canonical: '/contact',
    languages: getLanguageAlternates('/contact'),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/contact'),
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function ContactPage() {
  return <ContactPageView locale="en" />;
}
