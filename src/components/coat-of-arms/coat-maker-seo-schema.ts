import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import { absoluteUrl } from '@/lib/site-content';
import type { SiteLocale } from '@/lib/site-locale';

export function buildCoatMakerWebApplicationStructuredData(locale: SiteLocale, localizedPath: string) {
  const copy = getCoatMakerSeoCopy(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: copy.heading,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: absoluteUrl(localizedPath),
    description: copy.metadataDescription,
    featureList: copy.webApplicationFeatureNames,
  };
}
