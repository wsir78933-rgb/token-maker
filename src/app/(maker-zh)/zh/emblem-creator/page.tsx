import type { Metadata } from 'next';
import { EmblemCreator } from '@/components/emblem-creator/EmblemCreator';
import { getSiteConfig, getSiteUrl } from '@/lib/site-content';
import { getLanguageAlternates, getLocalizedPath } from '@/lib/site-locale';

const locale = 'zh';
const path = '/emblem-creator';
const localizedPath = getLocalizedPath(locale, path);
const siteConfig = getSiteConfig(locale);
const title = '徽章编辑器 | Token Maker';
const description = '从盾体、细节、徽饰素材和本地图片组合并导出自定义徽章。';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: title },
  description,
  alternates: {
    canonical: localizedPath,
    languages: getLanguageAlternates(path),
  },
  openGraph: {
    title,
    description,
    url: localizedPath,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function ChineseEmblemCreatorPage() {
  return (
    <div lang="zh-CN" className="emblem-creator-page">
      <EmblemCreator locale={locale} />
    </div>
  );
}
