import { getBlogPost } from '@/lib/blog-content';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const locale = 'zh';
  const { slug } = await params;
  const post = getBlogPost(locale, slug);

  return createSeoImage({
    locale,
    tone: 'guides',
    eyebrow: post?.readingTime ?? '博客文章',
    title: post?.title ?? 'Token Maker 博客',
    description:
      post?.description ?? '在设置裁切、边框和导出尺寸之前，先把判断逻辑读清楚。',
    chips: post ? [post.category, ...post.tags.slice(0, 2)] : ['博客', '工作流', '导出'],
  });
}
