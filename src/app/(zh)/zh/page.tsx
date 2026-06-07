import type { Metadata } from 'next';
import { DeferredEditorLayout } from '@/components/layout/DeferredEditorLayout';
import { EditorShowcaseSection } from '@/components/site/HomeShowcase';
import { HomeHero, HomeSeoContent } from '@/components/site/HomeSeoContent';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'zh';
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/zh',
    languages: getLanguageAlternates('/'),
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/zh'),
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
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

export default function ChineseHomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: absoluteUrl('/zh'),
    description: siteConfig.description,
    featureList: ['浏览器 VTT Token 制作器', '圆形、方形和多边形遮罩', '边框与配色控制', '文字叠加与透明 PNG Token 导出', '本地优先图片流程'],
  };

  return (
    <>
      <StructuredData id="homepage-zh-jsonld" data={structuredData} />
      <main lang="zh-CN" className="site-shell site-shell--home min-h-screen">
        <HomeHero locale="zh" />
        <DeferredEditorLayout />
        <EditorShowcaseSection locale="zh" />
        <HomeSeoContent locale="zh" />
      </main>
    </>
  );
}
