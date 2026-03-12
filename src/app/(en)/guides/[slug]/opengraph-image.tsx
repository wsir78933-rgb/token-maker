import { getGuideDetailModel } from '@/lib/site-page-models';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const locale = 'en';
  const { slug } = await params;
  const page = getGuideDetailModel(locale, slug);

  return createSeoImage({
    locale,
    tone: 'guides',
    eyebrow: page?.readTime ?? 'Guide article',
    title: page?.title ?? 'Token Maker guide',
    description: page?.description ?? 'Read the workflow guide before you set crop, frame, or export size.',
    chips: page ? [page.outcome, ...page.checklist.slice(0, 2)] : ['Guides', 'Checklist-led', 'Workflow'],
  });
}
