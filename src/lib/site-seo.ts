import { absoluteUrl } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export type SeoImageKind =
  | 'home'
  | 'templates'
  | 'guides'
  | 'faq'
  | 'privacy'
  | 'template-detail'
  | 'guide-detail';

export function getSeoImagePath(locale: SiteLocale, kind: SeoImageKind, slug?: string) {
  switch (kind) {
    case 'home':
      return getLocalizedPath(locale, '/opengraph-image');
    case 'templates':
      return getLocalizedPath(locale, '/templates/opengraph-image');
    case 'guides':
      return getLocalizedPath(locale, '/blog/opengraph-image');
    case 'faq':
      return getLocalizedPath(locale, '/opengraph-image');
    case 'privacy':
      return getLocalizedPath(locale, '/opengraph-image');
    case 'template-detail':
      if (!slug) {
        throw new Error('slug is required for template-detail SEO image path');
      }
      return getLocalizedPath(locale, `/templates/${slug}/opengraph-image`);
    case 'guide-detail':
      if (!slug) {
        throw new Error('slug is required for guide-detail SEO image path');
      }
      return getLocalizedPath(locale, `/blog/${slug}/opengraph-image`);
    default:
      return getLocalizedPath(locale, '/opengraph-image');
  }
}

export function getSeoImageUrl(locale: SiteLocale, kind: SeoImageKind, slug?: string) {
  return absoluteUrl(getSeoImagePath(locale, kind, slug));
}
