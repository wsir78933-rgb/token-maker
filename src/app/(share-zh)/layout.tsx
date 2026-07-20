import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '../globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { I18nProvider } from '@/lib/i18n';
import { getRequestNonce } from '@/lib/security/request-nonce';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';
import { DEFAULT_THEME } from '@/lib/theme';

export const metadata: Metadata = createLocaleLayoutMetadata('zh');
export const viewport: Viewport = createSiteViewport();

export default async function ChineseShareRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getRequestNonce();

  return (
    <html
      lang={getHtmlLang('zh')}
      data-theme={DEFAULT_THEME}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <MicrosoftClarity nonce={nonce} />
        <Suspense fallback={null}>
          <GoogleAnalytics nonce={nonce} />
        </Suspense>
        <I18nProvider locale="zh">{children}</I18nProvider>
      </body>
    </html>
  );
}
