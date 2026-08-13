import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { I18nProvider } from '@/lib/i18n';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';
import { DEFAULT_THEME } from '@/lib/theme';

export const metadata: Metadata = createLocaleLayoutMetadata('zh');
export const viewport: Viewport = createSiteViewport();

export default function ChineseShareRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={getHtmlLang('zh')}
      data-theme={DEFAULT_THEME}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <I18nProvider locale="zh">{children}</I18nProvider>
      </body>
    </html>
  );
}
