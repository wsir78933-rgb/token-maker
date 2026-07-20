import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/security/request-nonce', () => ({
  getRequestNonce: vi.fn(async () => 'layout-request-nonce'),
}));

vi.mock('@/components/analytics/GoogleAdSense', () => ({
  GoogleAdSense: ({ nonce }: { nonce: string }) =>
    createElement('script', { 'data-analytics': 'adsense', 'data-nonce': nonce }),
}));

vi.mock('@/components/analytics/GoogleAnalytics', () => ({
  GoogleAnalytics: ({ nonce }: { nonce: string }) =>
    createElement('script', { 'data-analytics': 'google-analytics', 'data-nonce': nonce }),
}));

vi.mock('@/components/analytics/MicrosoftClarity', () => ({
  MicrosoftClarity: ({ nonce }: { nonce: string }) =>
    createElement('script', { 'data-analytics': 'microsoft-clarity', 'data-nonce': nonce }),
}));

vi.mock('@/lib/i18n', () => ({
  I18nProvider: ({ children }: { children: ReactNode }) => children,
}));

interface RootLayoutProps {
  children: ReactNode;
}

type RootLayout = (props: RootLayoutProps) => Promise<ReactNode>;

async function renderLayout(rootLayout: RootLayout) {
  const layoutElement = await rootLayout({
    children: createElement('main', undefined, 'route content'),
  });
  return renderToStaticMarkup(layoutElement);
}

function expectAnalyticsScripts(
  markup: string,
  expectedAnalytics: readonly string[]
) {
  const renderedAnalytics = [...markup.matchAll(/data-analytics="([^"]+)"/g)].map(
    ([, analyticsName]) => analyticsName
  );

  expect(renderedAnalytics).toEqual(expectedAnalytics);
  expect(markup).toContain('data-nonce="layout-request-nonce"');
}

function expectAdSenseScriptInDocumentHead(markup: string) {
  const documentHeadEnd = markup.indexOf('</head>');
  const adSenseScriptIndex = markup.indexOf('data-analytics="adsense"');

  expect(adSenseScriptIndex).toBeGreaterThan(-1);
  expect(documentHeadEnd).toBeGreaterThan(adSenseScriptIndex);
}

describe('root layout route boundaries', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('renders AdSense, Analytics, and Clarity in normal English and Chinese route roots', async () => {
    const EnglishRootLayout = (await import('./(en)/layout')).default;
    const ChineseRootLayout = (await import('./(zh)/layout')).default;

    const englishMarkup = await renderLayout(EnglishRootLayout);
    const chineseMarkup = await renderLayout(ChineseRootLayout);

    expectAnalyticsScripts(
      englishMarkup,
      ['adsense', 'microsoft-clarity', 'google-analytics']
    );
    expectAnalyticsScripts(
      chineseMarkup,
      ['adsense', 'microsoft-clarity', 'google-analytics']
    );
    expectAdSenseScriptInDocumentHead(englishMarkup);
    expectAdSenseScriptInDocumentHead(chineseMarkup);
  });

  it('renders Analytics and Clarity but not AdSense in public-share route roots', async () => {
    const EnglishShareRootLayout = (await import('./(share-en)/layout')).default;
    const ChineseShareRootLayout = (await import('./(share-zh)/layout')).default;

    expectAnalyticsScripts(
      await renderLayout(EnglishShareRootLayout),
      ['microsoft-clarity', 'google-analytics']
    );
    expectAnalyticsScripts(
      await renderLayout(ChineseShareRootLayout),
      ['microsoft-clarity', 'google-analytics']
    );
  });

  it('keeps public-share pages below the root layouts without AdSense', () => {
    expect(existsSync(resolve(process.cwd(), 'src/app/(share-en)/share/[id]/page.tsx'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'src/app/(share-zh)/zh/share/[id]/page.tsx'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'src/app/(en)/share/[id]/page.tsx'))).toBe(false);
    expect(existsSync(resolve(process.cwd(), 'src/app/(zh)/zh/share/[id]/page.tsx'))).toBe(false);
  });
});
