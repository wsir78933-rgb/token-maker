import type { Metadata } from 'next';
import { EditorLayout } from '@/components/layout/EditorLayout';
import { EditorShowcaseSection } from '@/components/site/HomeShowcase';
import { HomeHero, HomeSeoContent } from '@/components/site/HomeSeoContent';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getFaqItems, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'en';
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
    languages: getLanguageAlternates('/'),
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    type: 'website',
    images: [
      {
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function Home() {
  const faqItems = getFaqItems(locale).slice(0, 3);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: siteConfig.name,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        url: absoluteUrl('/'),
        description: siteConfig.description,
        featureList: [
          'Browser-based VTT token maker',
          'Circle, square, and polygon masks',
          'Border and tint controls',
          'Text overlays and transparent PNG export',
          'Local-first tabletop image workflow',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData id="homepage-jsonld" data={structuredData} />
      <main lang="en" className="site-shell site-shell--home min-h-screen">
        <HomeHero locale="en" />
        <EditorLayout />
        <EditorShowcaseSection locale="en" />
        <HomeSeoContent locale="en" />
      </main>
    </>
  );
}
