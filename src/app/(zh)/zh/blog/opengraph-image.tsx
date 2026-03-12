import { getPublishedBlogPosts } from '@/lib/blog-content';
import { getBlogIndexCopy } from '@/lib/blog-seo';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

export default function Image() {
  const locale = 'zh';
  const copy = getBlogIndexCopy(locale);
  const posts = getPublishedBlogPosts(locale);

  return createSeoImage({
    locale,
    tone: 'guides',
    eyebrow: copy.eyebrow,
    title: copy.title,
    description: copy.description,
    chips: posts.slice(0, 3).map((post) => post.category),
  });
}
