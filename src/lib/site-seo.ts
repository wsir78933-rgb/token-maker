import { absoluteUrl } from '@/lib/site-content';
import { getLocalizedPath, type SiteLocale } from '@/lib/site-locale';

export type SeoImageKind =
  | 'home'
  | 'faq'
  | 'privacy';

export function getSeoImagePath(locale: SiteLocale, kind: SeoImageKind) {
  switch (kind) {
    case 'home':
    case 'faq':
    case 'privacy':
      return getLocalizedPath(locale, '/opengraph-image');
    default:
      return getLocalizedPath(locale, '/opengraph-image');
  }
}

export function getSeoImageUrl(locale: SiteLocale, kind: SeoImageKind) {
  return absoluteUrl(getSeoImagePath(locale, kind));
}
