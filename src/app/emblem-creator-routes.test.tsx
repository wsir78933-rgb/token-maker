// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';
import EnglishEmblemCreatorPage, { metadata as englishMetadata } from './(en)/emblem-creator/page';
import ChineseEmblemCreatorPage, { metadata as chineseMetadata } from './(zh)/zh/emblem-creator/page';

const localizedRoutes = [
  {
    locale: 'en' as const,
    Page: EnglishEmblemCreatorPage,
    metadata: englishMetadata,
    path: '/emblem-creator',
    switchedPath: '/zh/emblem-creator',
    heading: 'Emblem Creator',
    menuLabel: 'Free tools',
    switchLabel: '中文',
    openGraphLocale: 'en_US',
  },
  {
    locale: 'zh' as const,
    Page: ChineseEmblemCreatorPage,
    metadata: chineseMetadata,
    path: '/zh/emblem-creator',
    switchedPath: '/emblem-creator',
    heading: '徽标制作工具',
    menuLabel: '免费工具',
    switchLabel: 'English',
    openGraphLocale: 'zh_CN',
  },
];

describe('emblem creator routes', () => {
  afterEach(cleanup);

  it.each(localizedRoutes)('provides canonical, hreflang and social metadata for $locale', ({
    locale,
    metadata,
    path,
    openGraphLocale,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const metadataBase = metadata.metadataBase;
    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.pageTitle });
    expect(metadata.description).toBe(copy.pageDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/emblem-creator',
        'en-US': '/emblem-creator',
        'zh-CN': '/zh/emblem-creator',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [{ url: getSeoImageUrl(locale, 'home'), width: 1200, height: 630, alt: copy.pageTitle }],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.pageTitle,
      description: copy.pageDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it.each(localizedRoutes)('keeps site chrome and the $locale H1 outside the real workbench', ({
    locale,
    Page,
    heading,
    path,
    switchedPath,
    menuLabel,
    switchLabel,
  }) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container } = render(<Page />);
    const pageHeading = screen.getByRole('heading', { level: 1, name: heading });
    const editor = screen.getByRole('region', { name: copy.editorTitle });
    const topbar = container.querySelector('.site-topbar');
    const footer = container.querySelector('footer');
    if (!(topbar instanceof HTMLElement) || !(footer instanceof HTMLElement)) {
      throw new Error(`Missing emblem site chrome for locale ${JSON.stringify(locale)}.`);
    }

    for (const outsideElement of [topbar, pageHeading, footer]) {
      expect(editor.contains(outsideElement)).toBe(false);
    }
    expect(topbar.compareDocumentPosition(editor) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.compareDocumentPosition(editor) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(editor.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(pageHeading.parentElement?.children).toHaveLength(2);
    expect(screen.queryByText(copy.description)).toBeNull();
    expect(screen.queryByText(copy.pageDescription)).toBeNull();
    expect(within(editor).queryByRole('heading', { level: 1 })).toBeNull();

    const freeToolsLink = within(topbar).getByRole('link', { name: menuLabel });
    expect(freeToolsLink.closest('[data-active]')?.getAttribute('data-active')).toBe('true');
    const menuItem = freeToolsLink.closest('.site-nav-item');
    if (!(menuItem instanceof HTMLElement)) {
      throw new Error(`Missing FreeTools menu for locale ${JSON.stringify(locale)}.`);
    }
    fireEvent.mouseEnter(menuItem);
    const menu = within(menuItem).getByRole('menu', { name: menuLabel });
    expect(within(menu).getByRole('menuitem', { name: heading }).getAttribute('href')).toBe(path);
    expect(within(topbar).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(switchedPath);
  });
});
