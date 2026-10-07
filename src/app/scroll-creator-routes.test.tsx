// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/scroll-creator/ScrollCreatorWorkbench', () => ({
  ScrollCreatorWorkbench: ({ locale }: { locale: 'en' | 'zh' }) => (
    <div role="region" aria-label={`Scroll editor ${locale}`} />
  ),
}));

import { metadata as englishMetadata } from '@/app/(en)/scroll-creator/page';
import { metadata as chineseMetadata } from '@/app/(zh)/zh/scroll-creator/page';
import { ScrollCreatorPageView } from '@/components/scroll-creator/ScrollCreatorPageView';
import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { SCROLL_CREATOR_EDITOR_ID } from '@/lib/scroll-creator/constants';

afterEach(() => {
  cleanup();
});

describe('Scroll Creator routes', () => {
  it('exposes English canonical, language alternates, and page metadata', () => {
    const copy = getScrollCreatorCopy('en');

    expect(englishMetadata.alternates).toEqual({
      canonical: '/scroll-creator',
      languages: {
        'x-default': '/scroll-creator',
        'en-US': '/scroll-creator',
        'zh-CN': '/zh/scroll-creator',
      },
    });
    expect(englishMetadata.title).toEqual({ absolute: copy.pageTitle });
    expect(englishMetadata.description).toBe(copy.pageDescription);
    expect(englishMetadata.openGraph).toMatchObject({
      url: '/scroll-creator',
      locale: 'en_US',
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
    expect(englishMetadata.twitter).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
  });

  it('exposes Chinese canonical, language alternates, and page metadata', () => {
    const copy = getScrollCreatorCopy('zh');

    expect(chineseMetadata.alternates).toEqual({
      canonical: '/zh/scroll-creator',
      languages: {
        'x-default': '/scroll-creator',
        'en-US': '/scroll-creator',
        'zh-CN': '/zh/scroll-creator',
      },
    });
    expect(chineseMetadata.title).toEqual({ absolute: copy.pageTitle });
    expect(chineseMetadata.description).toBe(copy.pageDescription);
    expect(chineseMetadata.openGraph).toMatchObject({
      url: '/zh/scroll-creator',
      locale: 'zh_CN',
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
    expect(chineseMetadata.twitter).toMatchObject({
      title: copy.pageTitle,
      description: copy.pageDescription,
    });
  });

  it.each(['en', 'zh'] as const)('renders the localized hero and workbench for %s', (locale) => {
    const copy = getScrollCreatorCopy(locale);
    render(<ScrollCreatorPageView locale={locale} />);

    expect(screen.getByRole('heading', { level: 1, name: copy.heroTitle })).toBeDefined();
    expect(screen.getByText(copy.heroDescription)).toBeDefined();
    expect(screen.getByRole('button', { name: copy.heroAction })).toBeDefined();
    expect(document.getElementById(SCROLL_CREATOR_EDITOR_ID)).toBeDefined();
    expect(screen.getByRole('region', { name: `Scroll editor ${locale}` })).toBeDefined();
  });
});
