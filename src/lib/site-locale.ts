export type SiteLocale = 'en' | 'zh';

export const DEFAULT_LOCALE: SiteLocale = 'en';
export const LOCALES: SiteLocale[] = ['en', 'zh'];

export function isSiteLocale(value: string): value is SiteLocale {
  return LOCALES.includes(value as SiteLocale);
}

export function getLocalizedPath(locale: SiteLocale, path = '/') {
  if (locale === 'en') {
    return path;
  }

  if (path === '/') {
    return '/zh';
  }

  return `/zh${path}`;
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === '/zh') {
    return '/';
  }

  if (pathname.startsWith('/zh/')) {
    return pathname.slice(3);
  }

  return pathname;
}

export function switchLocalePath(pathname: string, locale: SiteLocale) {
  return getLocalizedPath(locale, stripLocalePrefix(pathname));
}

export function getLanguageAlternates(path = '/') {
  const englishPath = getLocalizedPath('en', path);

  return {
    'x-default': englishPath,
    'en-US': englishPath,
    'zh-CN': getLocalizedPath('zh', path),
  };
}
