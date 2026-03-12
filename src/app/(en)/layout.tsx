import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { I18nProvider } from '@/lib/i18n';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';

export const metadata: Metadata = createLocaleLayoutMetadata('en');
export const viewport: Viewport = createSiteViewport();

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getHtmlLang('en')} className="dark scroll-smooth">
      <body className="antialiased">
        <I18nProvider locale="en">{children}</I18nProvider>
      </body>
    </html>
  );
}
