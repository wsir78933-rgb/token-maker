// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { getSiteUrl } from '@/lib/site-content';
import { getSeoImageUrl } from '@/lib/site-seo';

import EnglishTarotCardsPage, { metadata as englishMetadata } from './(en)/tarot-cards/page';
import ChineseTarotCardsPage, { metadata as chineseMetadata } from './(zh)/zh/tarot-cards/page';

type JsonLdRecord = Record<string, unknown>;

const localizedRoutes = [
  {
    locale: 'en' as const,
    Page: EnglishTarotCardsPage,
    metadata: englishMetadata,
    path: '/tarot-cards',
    switchedPath: '/zh/tarot-cards',
    openGraphLocale: 'en_US',
    menuLabel: 'Free tools',
    switchLabel: '中文',
  },
  {
    locale: 'zh' as const,
    Page: ChineseTarotCardsPage,
    metadata: chineseMetadata,
    path: '/zh/tarot-cards',
    switchedPath: '/tarot-cards',
    openGraphLocale: 'zh_CN',
    menuLabel: '免费工具',
    switchLabel: 'English',
  },
];

function findJsonLdByType(value: unknown, type: string): JsonLdRecord | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findJsonLdByType(item, type);
      if (match) return match;
    }
    return undefined;
  }

  if (!value || typeof value !== 'object') return undefined;

  const record = value as JsonLdRecord;
  if (record['@type'] === type) return record;

  for (const nestedValue of Object.values(record)) {
    const match = findJsonLdByType(nestedValue, type);
    if (match) return match;
  }

  return undefined;
}

function readJsonLdDocuments(): unknown[] {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => {
    if (!script.textContent) {
      throw new Error('Tarot cards page contains an empty JSON-LD script.');
    }

    return JSON.parse(script.textContent) as unknown;
  });
}

describe('tarot cards routes', () => {
  afterEach(cleanup);

  it.each(localizedRoutes)('exports localized metadata for $locale', ({ locale, metadata, path, openGraphLocale }) => {
    const copy = getTarotCopy(locale);
    const metadataBase = metadata.metadataBase;

    expect(typeof metadataBase === 'string' ? metadataBase : metadataBase?.href).toBe(`${getSiteUrl()}/`);
    expect(metadata.title).toEqual({ absolute: copy.metadataTitle });
    expect(metadata.description).toBe(copy.metadataDescription);
    expect(metadata.alternates).toEqual({
      canonical: path,
      languages: {
        'x-default': '/tarot-cards',
        'en-US': '/tarot-cards',
        'zh-CN': '/zh/tarot-cards',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      url: path,
      type: 'website',
      locale: openGraphLocale,
      images: [
        {
          url: getSeoImageUrl(locale, 'home'),
          width: 1200,
          height: 630,
          alt: copy.pageTitle,
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      images: [getSeoImageUrl(locale, 'home')],
    });
  });

  it.each(localizedRoutes)('renders the localized page shell, navigation, and JSON-LD for $locale', ({
    locale,
    Page,
    path,
    switchedPath,
    menuLabel,
    switchLabel,
  }) => {
    const copy = getTarotCopy(locale);
    render(<Page />);

    expect(screen.getByRole('heading', { level: 1, name: copy.pageTitle })).toBeTruthy();
    expect(screen.getByText(copy.pageDescription)).toBeTruthy();

    const topbar = document.querySelector('.site-topbar');
    if (!(topbar instanceof HTMLElement)) {
      throw new Error(`Tarot cards page is missing the site topbar for ${JSON.stringify(locale)}.`);
    }

    const freeToolsLink = within(topbar).getByRole('link', { name: menuLabel });
    const freeToolsNavItem = freeToolsLink.closest('.site-nav-item');
    if (!(freeToolsNavItem instanceof HTMLElement)) {
      throw new Error(`Tarot cards Free tools menu is missing for ${JSON.stringify(locale)}.`);
    }

    fireEvent.mouseEnter(freeToolsNavItem);
    const freeToolsMenu = within(freeToolsNavItem).getByRole('menu', { name: menuLabel });
    expect(within(freeToolsMenu).getByRole('menuitem', { name: copy.navigationTitle }).getAttribute('href')).toBe(
      path,
    );
    expect(within(topbar).getByRole('link', { name: switchLabel }).getAttribute('href')).toBe(switchedPath);
    expect(freeToolsLink.closest('[data-active]')?.getAttribute('data-active')).toBe('true');

    const jsonLdDocuments = readJsonLdDocuments();
    const webApplication = jsonLdDocuments
      .map((document) => findJsonLdByType(document, 'WebApplication'))
      .find((structuredData): structuredData is JsonLdRecord => structuredData !== undefined);
    const breadcrumb = jsonLdDocuments
      .map((document) => findJsonLdByType(document, 'BreadcrumbList'))
      .find((structuredData): structuredData is JsonLdRecord => structuredData !== undefined);

    expect(webApplication).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: copy.pageTitle,
      url: `${getSiteUrl()}${path}`,
      description: copy.pageDescription,
    });
    expect(breadcrumb).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
    });
    expect(
      (breadcrumb?.itemListElement as Array<{ name: string }> | undefined)?.map((item) => item.name),
    ).toEqual([locale === 'zh' ? '令牌制作器' : 'Token Maker', copy.navigationTitle]);
  });
});
