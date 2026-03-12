import { getBlogPost } from '@/lib/blog-content';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const locale = 'en';
  const { slug } = await params;
  const post = getBlogPost(locale, slug);

  return createSeoImage({
    locale,
    tone: 'guides',
    eyebrow: post?.readingTime ?? 'Blog article',
    title: post?.title ?? 'Token Maker blog',
    description:
      post?.description ?? 'Read the workflow post before you set crop, frame, or export size.',
    chips: post ? [post.category, ...post.tags.slice(0, 2)] : ['Blog', 'Workflow', 'Export'],
  });
}
