import { getTemplateDetailModel } from '@/lib/site-page-models';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const locale = 'zh';
  const { slug } = await params;
  const page = getTemplateDetailModel(locale, slug);

  return createSeoImage({
    locale,
    tone: 'templates',
    eyebrow: page?.intent ?? '模板详情',
    title: page?.title ?? 'Token Maker 模板页',
    description: page?.description ?? '根据地图环境、裁切方式和导出需求，挑出更适合的 token 格式。',
    chips: page ? page.signatureSetup.items.slice(0, 3) : ['模板页', '浏览器内完成', 'PNG 导出'],
  });
}
