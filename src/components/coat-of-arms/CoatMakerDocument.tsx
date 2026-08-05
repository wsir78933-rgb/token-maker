import type { ReactNode } from 'react';

import { I18nProvider } from '@/lib/i18n';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { getRequestNonce } from '@/lib/security/request-nonce';
import { getHtmlLang } from '@/lib/site-metadata';
import { DEFAULT_THEME } from '@/lib/theme';

interface CoatMakerDocumentProps {
  children: ReactNode;
  locale: CoatLocale;
}

/**
 * The local-only editor has a separate document boundary so third-party site
 * analytics and advertising scripts are never emitted for its routes.
 */
export async function CoatMakerDocument({ children, locale }: CoatMakerDocumentProps) {
  await getRequestNonce();

  return (
    <html
      lang={getHtmlLang(locale)}
      data-theme={DEFAULT_THEME}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
