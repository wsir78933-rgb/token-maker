import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '../globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GoogleAdSense } from '@/components/analytics/GoogleAdSense';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';
import { I18nProvider } from '@/lib/i18n';
import { getRequestNonce } from '@/lib/security/request-nonce';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';
import { DEFAULT_THEME } from '@/lib/theme';

export const metadata: Metadata = createLocaleLayoutMetadata('en');
export const viewport: Viewport = createSiteViewport();

export default async function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getRequestNonce();

  return (
    <html
      lang={getHtmlLang('en')}
      data-theme={DEFAULT_THEME}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <GoogleAdSense nonce={nonce} />
      </head>
      <body className="antialiased">
        <MicrosoftClarity nonce={nonce} />
        <Suspense fallback={null}>
          <GoogleAnalytics nonce={nonce} />
        </Suspense>
        <I18nProvider locale="en">{children}</I18nProvider>
      </body>
    </html>
  );
}
