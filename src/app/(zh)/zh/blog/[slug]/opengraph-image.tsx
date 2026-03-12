import { getGuideDetailModel } from '@/lib/site-page-models';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const locale = 'zh';
  const { slug } = await params;
  const page = getGuideDetailModel(locale, slug);

  return createSeoImage({
    locale,
    tone: 'guides',
    eyebrow: page?.readTime ?? '博客文章',
    title: page?.title ?? 'Token Maker 博客',
    description: page?.description ?? '在设置裁切、边框和导出尺寸之前，先把判断逻辑读清楚。',
    chips: page ? [page.outcome, ...page.checklist.slice(0, 2)] : ['博客', '清单驱动', '工作流'],
  });
}
