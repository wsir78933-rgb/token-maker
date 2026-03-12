import type { Metadata } from 'next';
import { EditorLayout } from '@/components/layout/EditorLayout';
import { HomeHero, HomeSeoContent } from '@/components/site/HomeSeoContent';
import { StructuredData } from '@/components/site/StructuredData';
import { absoluteUrl, getFaqItems, getSiteConfig } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';

const locale = 'zh';
const siteConfig = getSiteConfig(locale);

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/zh',
    languages: getLanguageAlternates('/'),
  },
};

export default function ChineseHomePage() {
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
        url: absoluteUrl('/zh'),
        description: siteConfig.description,
        featureList: ['浏览器制章编辑器', '圆形、方形和多边形遮罩', '边框与配色控制', '文字叠加与 PNG 导出', '本地优先图片流程'],
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
      <StructuredData id="homepage-zh-jsonld" data={structuredData} />
      <main lang="zh-CN" className="min-h-screen bg-[#07090d]">
        <HomeHero locale="zh" />
        <EditorLayout />
        <HomeSeoContent locale="zh" />
      </main>
    </>
  );
}
