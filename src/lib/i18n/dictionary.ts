import type { SiteLocale } from '@/lib/site-locale';

export function getI18nDictionary<T>(
  locale: string,
  dictionary: Readonly<Partial<Record<SiteLocale, T>>>,
  dictionaryName: string,
): T {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(
      `Unknown locale for ${dictionaryName} dictionary: ${JSON.stringify(locale)}.`,
    );
  }

  const messages = dictionary[locale];
  if (messages === undefined) {
    throw new Error(
      `${dictionaryName} dictionary is missing locale ${JSON.stringify(locale)}.`,
    );
  }

  return messages;
}
