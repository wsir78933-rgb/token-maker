// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import EnglishLanguageGeneratorPage, {
  metadata as englishMetadata,
} from './(en)/language-generator/page';
import ChineseLanguageGeneratorPage, {
  metadata as chineseMetadata,
} from './(zh)/zh/language-generator/page';
import { getLanguageGeneratorCopy } from '@/lib/language-generator/copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

const localizedLanguageGeneratorRoutes = [
  {
    locale: 'en' as const,
    PageComponent: EnglishLanguageGeneratorPage,
    metadata: englishMetadata,
    path: '/language-generator',
    switchedPath: '/zh/language-generator',
    openGraphLocale: 'en_US',
    navigationMenuLabel: 'Free tools',
    navigationTitle: 'Language Generator',
    switchLabel: '中文',
  },
  {
    locale: 'zh' as const,
    PageComponent: ChineseLanguageGeneratorPage,
    metadata: chineseMetadata,
    path: '/zh/language-generator',
    switchedPath: '/language-generator',
    openGraphLocale: 'zh_CN',
    navigationMenuLabel: '免费工具',
    navigationTitle: '语言生成器',
    switchLabel: 'English',
  },
];

afterEach(cleanup);

describe('language generator routes', () => {
  it.each(localizedLanguageGeneratorRoutes)('exports localized metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getLanguageGeneratorCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/language-generator',
        'en-US': '/language-generator',
        'zh-CN': '/zh/language-generator',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [{
        url: getSeoImageUrl(locale, 'home'),
        width: 1200,
        height: 630,
        alt: copy.pageTitle,
      }],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.pageTitle,
      description: copy.pageDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it.each(localizedLanguageGeneratorRoutes)('renders the $locale page inside shared site chrome', ({
    PageComponent,
    locale,
    navigationMenuLabel,
    navigationTitle,
    path,
    switchedPath,
    switchLabel,
  }) => {
    const copy = getLanguageGeneratorCopy(locale);
    const { container } = render(<PageComponent />);
    const pageHeading = screen.getByRole('heading', { level: 1, name: copy.title });
    const pageDescription = screen.getByText(copy.description);
    const workspace = screen.getByTestId('language-generator-workspace');
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('footer');

    if (!(topbar instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
      throw new Error(`Missing language generator site chrome for locale ${JSON.stringify(locale)}.`);
    }

    expect(screen.getByTestId('language-generator-page-heading').contains(pageHeading)).toBe(true);
    expect(screen.getByRole('navigation', { name: locale === 'zh' ? '面包屑' : 'Breadcrumb' })).toBeTruthy();
    expect(topbar.compareDocumentPosition(pageHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.compareDocumentPosition(workspace) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageDescription).toBeTruthy();
    expect(workspace.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const freeToolsLink = within(topbar).getByRole('link', { name: navigationMenuLabel });
    expect(freeToolsLink.getAttribute('href')).toBe(locale === 'zh' ? '/zh' : '/');
    expect(within(topbar).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(switchedPath);

    const freeToolsMenuItem = freeToolsLink.closest('.site-nav-item');
    if (!(freeToolsMenuItem instanceof HTMLElement)) {
      throw new Error(`Missing Free tools menu for locale ${JSON.stringify(locale)}.`);
    }

    fireEvent.mouseEnter(freeToolsMenuItem);
    const freeToolsMenu = within(freeToolsMenuItem).getByRole('menu', { name: navigationMenuLabel });
    expect(within(freeToolsMenu).getByRole('menuitem', { name: navigationTitle }).getAttribute('href')).toBe(path);
  });
});
