import type { Metadata } from 'next';
import { EmblemCreator } from '@/components/emblem-creator/EmblemCreator';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'en';
const path = '/emblem-creator';
const localizedPath = getLocalizedPath(locale, path);
const siteConfig = getSiteConfig(locale);
const title = 'Emblem Creator | Token Maker';
const description = 'Build a custom emblem from a browsable library of shield bodies, details, crests, and uploaded images.';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: title },
  description,
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title,
    description,
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
  },
};

export default function EmblemCreatorPage() {
  return (
    <div lang="en" className="emblem-creator-page">
      <EmblemCreator locale={locale} />
    </div>
  );
}
