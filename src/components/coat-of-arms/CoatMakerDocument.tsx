import { Suspense, type ReactNode } from 'react';

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
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
 * The local-only editor has a separate document boundary so advertising
 * scripts are never emitted for its routes. Google Analytics and Microsoft
 * Clarity still load, using the request nonce required by this document's CSP.
 */
export async function CoatMakerDocument({ children, locale }: CoatMakerDocumentProps) {
  const nonce = await getRequestNonce();

  return (
    <html
      lang={getHtmlLang(locale)}
      data-theme={DEFAULT_THEME}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <MicrosoftClarity nonce={nonce} />
        <Suspense fallback={null}>
          <GoogleAnalytics nonce={nonce} />
        </Suspense>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
