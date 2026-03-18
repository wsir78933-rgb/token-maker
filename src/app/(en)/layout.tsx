import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '../globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { ThemeInitScript } from '@/components/theme/ThemeInitScript';
import { I18nProvider } from '@/lib/i18n';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';
import { DEFAULT_THEME } from '@/lib/theme';

export const metadata: Metadata = createLocaleLayoutMetadata('en');
export const viewport: Viewport = createSiteViewport();

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={getHtmlLang('en')}
      data-theme={DEFAULT_THEME}
      className={`${DEFAULT_THEME === 'dark' ? 'dark ' : ''}scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeInitScript />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <I18nProvider locale="en">{children}</I18nProvider>
      </body>
    </html>
  );
}
