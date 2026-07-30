import type { Metadata } from 'next';

import { CoatOfArmsMaker } from '@/components/coat-of-arms/CoatOfArmsMaker';
import { SiteFooter } from '@/components/site/SiteFooter';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'zh';
const path = '/coat-of-arms-maker';
const localizedPath = getLocalizedPath(locale, path);
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: '纹章制作器 | 免费徽章编辑器',
  },
  description: '在浏览器本地制作纹章：编辑盾牌、颜色、图形、文字和图层，并导出 PNG 或 PDF。',
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title: '纹章制作器 | 免费徽章编辑器',
    description: '在浏览器本地制作纹章，支持盾牌、颜色、图形、文字、图层和本地导出。',
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function ChineseCoatOfArmsMakerPage() {
  return (
    <div lang="zh-CN" className="coat-maker-page">
      <CoatOfArmsMaker locale={locale} />
      <SiteFooter contentWidth="nearFull" currentPath={localizedPath} locale={locale} />
    </div>
  );
}
