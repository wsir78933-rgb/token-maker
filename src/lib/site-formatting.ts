import type { SiteLocale } from '@/lib/site-locale';

export function formatPageDate(locale: SiteLocale, value: string) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}
