import type { Metadata } from 'next';

import { ContactPageView } from '@/components/site/views/ContactPageView';
import { absoluteUrl, getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates } from '@/lib/site-locale';
import { getSeoImageUrl } from '@/lib/site-seo';

const locale = 'zh';
const siteConfig = getSiteConfig(locale);
const title = '联系 Token Maker';
const description = '向 Token Maker 反馈 bug、工作流问题、缺少的 token 样式，或实际使用建议。';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: `${title} | ${siteConfig.name}`,
  description,
  alternates: {
    canonical: '/zh/contact',
    languages: getLanguageAlternates('/contact'),
  },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: absoluteUrl('/zh/contact'),
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [getSeoImageUrl(locale, 'home')],
  },
};

export default function ChineseContactPage() {
  return <ContactPageView locale="zh" />;
}
