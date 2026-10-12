import { Suspense, type ReactNode } from 'react';

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { I18nProvider } from '@/lib/i18n';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { getHtmlLang } from '@/lib/site-metadata';
import { DEFAULT_THEME } from '@/lib/theme';

interface CoatMakerDocumentProps {
  children: ReactNode;
  locale: CoatLocale;
}

/**
 * The local-only editor has a separate document boundary so advertising
 * scripts are never emitted for its routes. Google Analytics and Microsoft
 * Clarity still load under the fixed CSP shared by cacheable public pages.
 */
export function CoatMakerDocument({ children, locale }: CoatMakerDocumentProps) {
  return (
    <html
      lang={getHtmlLang(locale)}
      data-theme={DEFAULT_THEME}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <MicrosoftClarity />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
