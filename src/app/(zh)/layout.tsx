import type { Metadata } from 'next';
import '../globals.css';
import { I18nProvider } from '@/lib/i18n';
import { createLocaleLayoutMetadata, getHtmlLang } from '@/lib/site-metadata';

export const metadata: Metadata = createLocaleLayoutMetadata('zh');

export default function ChineseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getHtmlLang('zh')} className="dark scroll-smooth">
      <body className="antialiased">
        <I18nProvider locale="zh">{children}</I18nProvider>
      </body>
    </html>
  );
}
