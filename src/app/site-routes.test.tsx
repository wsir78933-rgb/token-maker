// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import EnglishAboutPage, { metadata as englishAboutMetadata } from './(en)/about/page';
import EnglishChangelogPage, { metadata as englishChangelogMetadata } from './(en)/changelog/page';
import ChineseAboutPage, { metadata as chineseAboutMetadata } from './(zh)/zh/about/page';
import ChineseChangelogPage, {
  metadata as chineseChangelogMetadata,
} from './(zh)/zh/changelog/page';
import {
  generateStaticParams as generateEnglishBlogPostStaticParams,
} from './(en)/blog/[slug]/page';
import {
  generateStaticParams as generateChineseBlogPostStaticParams,
} from './(zh)/zh/blog/[slug]/page';
import {
  generateStaticParams as generateEnglishBlogPaginationStaticParams,
} from './(en)/blog/page/[page]/page';
import {
  generateStaticParams as generateChineseBlogPaginationStaticParams,
} from './(zh)/zh/blog/page/[page]/page';

const DND_THUNDERCLAP_SLUG = 'dnd-thunderclap';

describe('trust page routes', () => {
  afterEach(() => {
    cleanup();
  });

  it.each([
    {
      routeLabel: 'English About',
      PageComponent: EnglishAboutPage,
      metadata: englishAboutMetadata,
      canonical: '/about',
      title: 'About Token Maker',
      h1: 'About Token Maker',
    },
    {
      routeLabel: 'English Changelog',
      PageComponent: EnglishChangelogPage,
      metadata: englishChangelogMetadata,
      canonical: '/changelog',
      title: 'Token Maker Changelog',
      h1: 'Token Maker Changelog',
    },
    {
      routeLabel: 'Chinese About',
      PageComponent: ChineseAboutPage,
      metadata: chineseAboutMetadata,
      canonical: '/zh/about',
      title: '关于 Token Maker',
      h1: '关于 Token Maker',
    },
    {
      routeLabel: 'Chinese Changelog',
      PageComponent: ChineseChangelogPage,
      metadata: chineseChangelogMetadata,
      canonical: '/zh/changelog',
      title: 'Token Maker 更新记录',
      h1: 'Token Maker 更新记录',
    },
  ])('exports metadata and renders the H1 for $routeLabel', ({ PageComponent, metadata, canonical, title, h1 }) => {
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.title).toBe(title);

    render(<PageComponent />);

    expect(screen.getByRole('heading', { level: 1, name: h1 })).not.toBeNull();
  });
});

describe('blog static routes', () => {
  it('emits bilingual Thunderclap detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_THUNDERCLAP_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_THUNDERCLAP_SLUG });
  });

  it('emits bilingual fourth-page pagination params', () => {
    expect(generateEnglishBlogPaginationStaticParams()).toContainEqual({ page: '4' });
    expect(generateChineseBlogPaginationStaticParams()).toContainEqual({ page: '4' });
  });
});
