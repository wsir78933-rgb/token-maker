'use client';

import { createContext, useContext } from 'react';
import zh, { type I18nKey } from './zh';
import en from './en';
import type { SiteLocale } from '@/lib/site-locale';

const dictionaries: Record<SiteLocale, Record<string, string>> = { zh, en };

interface I18nContextValue {
  locale: SiteLocale;
  t: (key: I18nKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: (key) => dictionaries.en[key] || key,
});

export function I18nProvider({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: SiteLocale;
}>) {
  const dict = dictionaries[locale];

  return (
    <I18nContext.Provider
      value={{
        locale,
        t: (key) => dict[key] || key,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export type { I18nKey };
