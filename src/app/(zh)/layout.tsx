import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import '../globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { I18nProvider } from '@/lib/i18n';
import { createLocaleLayoutMetadata, createSiteViewport, getHtmlLang } from '@/lib/site-metadata';
import { normalizeTheme } from '@/lib/theme';

export const metadata: Metadata = createLocaleLayoutMetadata('zh');
export const viewport: Viewport = createSiteViewport();

export default async function ChineseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = normalizeTheme(cookieStore.get('token-maker-theme')?.value);

  return (
    <html
      lang={getHtmlLang('zh')}
      data-theme={theme}
      className={`${theme === 'dark' ? 'dark ' : ''}scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <I18nProvider locale="zh">{children}</I18nProvider>
      </body>
    </html>
  );
}
