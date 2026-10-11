import type { Metadata } from 'next';

import { CoatMakerPageHeading } from '@/components/coat-of-arms/CoatMakerPageHeading';
import { CoatOfArmsMaker } from '@/components/coat-of-arms/CoatOfArmsMaker';
import { CoatMakerSeoContent } from '@/components/coat-of-arms/CoatMakerSeoContent';
import { buildCoatMakerWebApplicationStructuredData } from '@/components/coat-of-arms/coat-maker-seo-schema';
import { SiteFooter } from '@/components/site/SiteFooter';
import { StructuredData } from '@/components/site/StructuredData';
import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'en';
const path = '/coat-of-arms-maker';
const localizedPath = getLocalizedPath(locale, path);
const siteConfig = getSiteConfig(locale);
const seoCopy = getCoatMakerSeoCopy(locale);
const socialImageUrl = absoluteUrl('/coat-of-arms-maker/hero/tool-made/ivory/crimson-lion.webp');

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: seoCopy.metadataTitle,
  },
  description: seoCopy.metadataDescription,
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: seoCopy.metadataTitle,
    description: seoCopy.metadataDescription,
    url: path,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: socialImageUrl,
        width: 1120,
        height: 1400,
        alt: seoCopy.metadataTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoCopy.metadataTitle,
    description: seoCopy.metadataDescription,
    images: [socialImageUrl],
  },
};

export default function CoatOfArmsMakerPage() {
  return (
    <div lang="en" className="coat-maker-page">
      <StructuredData
        id="coat-maker-en-web-application-jsonld"
        data={buildCoatMakerWebApplicationStructuredData(locale, localizedPath)}
      />
      <CoatOfArmsMaker locale={locale} pageHeading={<CoatMakerPageHeading locale={locale} />} />
      <CoatMakerSeoContent locale={locale} />
      <SiteFooter contentWidth="nearFull" currentPath={localizedPath} locale={locale} />
    </div>
  );
}
