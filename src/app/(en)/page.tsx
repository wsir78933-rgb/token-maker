import type { Metadata } from 'next';
import { EditorLayout } from '@/components/layout/EditorLayout';
import { HomeHero, HomeSeoContent } from '@/components/site/HomeSeoContent';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getFaqItems, getSiteConfig } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'en';
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
    languages: getLanguageAlternates('/'),
  },
};

export default function Home() {
  const faqItems = getFaqItems(locale);
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
          'Browser-based token editor',
          'Circle, square, and polygon masks',
          'Border and tint controls',
          'Text overlays and PNG export',
          'Local-first image workflow',
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
      <main lang="en" className="min-h-screen bg-[#07090d]">
        <HomeHero locale="en" />
        <EditorLayout />
        <HomeSeoContent locale="en" />
      </main>
    </>
  );
}
