import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '../globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { I18nProvider } from '@/lib/i18n';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';

export const metadata: Metadata = createLocaleLayoutMetadata('zh');
export const viewport: Viewport = createSiteViewport();

export default function ChineseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getHtmlLang('zh')} className="dark scroll-smooth">
      <body className="antialiased">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <I18nProvider locale="zh">{children}</I18nProvider>
      </body>
    </html>
  );
}
