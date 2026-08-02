import type { Metadata } from 'next';

import { CoatOfArmsMaker } from '@/components/coat-of-arms/CoatOfArmsMaker';
import { CoatMakerSeoContent } from '@/components/coat-of-arms/CoatMakerSeoContent';
import { buildCoatMakerWebApplicationStructuredData } from '@/components/coat-of-arms/coat-maker-seo-schema';
import { SiteFooter } from '@/components/site/SiteFooter';
import { StructuredData } from '@/components/site/StructuredData';
import { getCoatMakerSeoCopy } from '@/components/coat-of-arms/coat-maker-seo-copy';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'zh';
const path = '/coat-of-arms-maker';
const localizedPath = getLocalizedPath(locale, path);
const siteConfig = getSiteConfig(locale);
const seoCopy = getCoatMakerSeoCopy(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: seoCopy.metadataTitle,
  },
  description: seoCopy.metadataDescription,
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: seoCopy.metadataTitle,
    description: seoCopy.metadataDescription,
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary',
    title: seoCopy.metadataTitle,
    description: seoCopy.metadataDescription,
  },
};

export default function ChineseCoatOfArmsMakerPage() {
  return (
    <div lang="zh-CN" className="coat-maker-page">
      <StructuredData
        id="coat-maker-zh-web-application-jsonld"
        data={buildCoatMakerWebApplicationStructuredData(locale, localizedPath)}
      />
      <CoatOfArmsMaker locale={locale} />
      <CoatMakerSeoContent locale={locale} />
      <SiteFooter contentWidth="nearFull" currentPath={localizedPath} locale={locale} />
    </div>
  );
}
