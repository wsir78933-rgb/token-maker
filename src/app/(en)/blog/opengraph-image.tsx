import { getGuidesHubModel } from '@/lib/site-page-models';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

export default function Image() {
  const locale = 'en';
  const model = getGuidesHubModel(locale);

  return createSeoImage({
    locale,
    tone: 'guides',
    eyebrow: 'Blog',
    title: model.title,
    description: model.description,
    chips: model.stats.map((item) => item.value),
  });
}
