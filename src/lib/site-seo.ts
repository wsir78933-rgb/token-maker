import { absoluteUrl } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export type SeoImageKind =
  | 'home'
  | 'templates'
  | 'faq'
  | 'privacy'
  | 'template-detail';

export function getSeoImagePath(locale: SiteLocale, kind: SeoImageKind, slug?: string) {
  switch (kind) {
    case 'home':
    case 'faq':
    case 'privacy':
      return '/opengraph-image.png';
    case 'templates':
      return getLocalizedPath(locale, '/templates/opengraph-image');
    case 'template-detail':
      if (!slug) {
        throw new Error('slug is required for template-detail SEO image path');
      }
      return getLocalizedPath(locale, `/templates/${slug}/opengraph-image`);
    default:
      return getLocalizedPath(locale, '/opengraph-image');
  }
}

export function getSeoImageUrl(locale: SiteLocale, kind: SeoImageKind, slug?: string) {
  return absoluteUrl(getSeoImagePath(locale, kind, slug));
}
