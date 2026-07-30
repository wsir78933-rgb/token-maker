import type { Metadata } from 'next';

import { CoatOfArmsMaker } from '@/components/coat-of-arms/CoatOfArmsMaker';
import { SiteFooter } from '@/components/site/SiteFooter';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'en';
const path = '/coat-of-arms-maker';
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: 'Coat Maker | Free Coat of Arms Editor',
  },
  description:
    'Create a custom coat of arms locally with shields, colours, charges, text, layers, and PNG or PDF export.',
  alternates: {
    canonical: path,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: 'Coat Maker | Free Coat of Arms Editor',
    description:
      'Create a custom coat of arms locally with shields, colours, charges, text, layers, and export tools.',
    url: path,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
  },
};

export default function CoatOfArmsMakerPage() {
  return (
    <div lang="en" className="coat-maker-page">
      <CoatOfArmsMaker locale={locale} />
      <SiteFooter contentWidth="nearFull" currentPath={path} locale={locale} />
    </div>
  );
}
