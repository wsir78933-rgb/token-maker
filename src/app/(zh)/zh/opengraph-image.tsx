import { getHomeCopy, getSiteConfig } from '@/lib/site-content';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

export default function Image() {
  const locale = 'zh';
  const siteConfig = getSiteConfig(locale);
  const copy = getHomeCopy(locale);

  return createSeoImage({
    locale,
    tone: 'home',
    eyebrow: copy.heroEyebrow,
    title: siteConfig.title,
    description: siteConfig.description,
    chips: [copy.heroSecondaryCta, '本地优先', 'PNG 导出'],
  });
}
