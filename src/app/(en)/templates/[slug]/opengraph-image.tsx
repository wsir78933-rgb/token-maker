import { getTemplateDetailModel } from '@/lib/site-page-models';
import { createSeoImage, seoImageContentType, seoImageSize } from '@/lib/site-og-image';

export const size = seoImageSize;
export const contentType = seoImageContentType;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const locale = 'en';
  const { slug } = await params;
  const page = getTemplateDetailModel(locale, slug);

  return createSeoImage({
    locale,
    tone: 'templates',
    eyebrow: page?.intent ?? 'Template detail',
    title: page?.title ?? 'Token Maker template',
    description: page?.description ?? 'Choose the token format that fits your board, crop, and export needs.',
    chips: page ? page.signatureSetup.items.slice(0, 3) : ['Templates', 'Browser-based', 'PNG export'],
  });
}
