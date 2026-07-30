// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';

import EnglishAboutPage, { metadata as englishAboutMetadata } from './(en)/about/page';
import EnglishChangelogPage, { metadata as englishChangelogMetadata } from './(en)/changelog/page';
import ChineseAboutPage, { metadata as chineseAboutMetadata } from './(zh)/zh/about/page';
import ChineseChangelogPage, {
  metadata as chineseChangelogMetadata,
} from './(zh)/zh/changelog/page';
import EnglishCoatOfArmsMakerPage, {
  metadata as englishCoatOfArmsMakerMetadata,
} from './(maker-en)/coat-of-arms-maker/page';
import ChineseCoatOfArmsMakerPage, {
  metadata as chineseCoatOfArmsMakerMetadata,
} from './(maker-zh)/zh/coat-of-arms-maker/page';
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
const DND_SWORD_SHEATHS_SLUG = 'dnd-sword-sheaths';
const DND_5E_ARMORER_SLUG = 'dnd-5e-armorer';
const DND_FLUMPH_SLUG = 'dnd-flumph';
const DWELF_DND_SLUG = 'dwelf-dnd';
const DND_DAGGER_SLUG = 'dnd-dagger';

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

describe('coat maker routes', () => {
  beforeEach(() => {
    localStorage.clear();
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);
  });

  afterEach(() => {
    cleanup();
  });

  it.each([
    {
      PageComponent: EnglishCoatOfArmsMakerPage,
      canonical: '/coat-of-arms-maker',
      metadata: englishCoatOfArmsMakerMetadata,
      workspaceName: 'Coat maker workspace',
    },
    {
      PageComponent: ChineseCoatOfArmsMakerPage,
      canonical: '/zh/coat-of-arms-maker',
      metadata: chineseCoatOfArmsMakerMetadata,
      workspaceName: '徽章制作工作台',
    },
  ])('renders the localized coat maker workspace with canonical metadata', ({
    PageComponent,
    canonical,
    metadata,
    workspaceName,
  }) => {
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.alternates?.languages).toEqual({
      'x-default': '/coat-of-arms-maker',
      'en-US': '/coat-of-arms-maker',
      'zh-CN': '/zh/coat-of-arms-maker',
    });

    render(<PageComponent />);

    expect(screen.getByRole('main', { name: workspaceName })).not.toBeNull();
  });

  it('server-renders the Chinese default project heading for the untouched initial document', () => {
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);

    const markup = renderToStaticMarkup(<ChineseCoatOfArmsMakerPage />);

    expect(markup).toContain('<h1 class="sr-only">我的徽章</h1>');
  });

  it('keeps the local Coat Maker product title in English metadata', () => {
    expect(englishCoatOfArmsMakerMetadata.title).toEqual({
      absolute: 'Coat Maker | Free Coat of Arms Editor',
    });
  });

  it.each([
    {
      PageComponent: EnglishCoatOfArmsMakerPage,
      exportLabel: 'Export',
      brandText: 'TOKEN',
      removedArtworkLinkLabel: 'User Artwork',
      helpCenterLabel: 'Help Center',
      helpCenterHref: '/faq',
      changelogLabel: 'Changelog',
      changelogHref: '/changelog',
    },
    {
      PageComponent: ChineseCoatOfArmsMakerPage,
      exportLabel: '导出',
      brandText: 'TOKEN',
      removedArtworkLinkLabel: '用户作品',
      helpCenterLabel: '帮助中心',
      helpCenterHref: '/zh/faq',
      changelogLabel: '更新日志',
      changelogHref: '/zh/changelog',
    },
  ])('renders the local editor header chrome for $exportLabel', ({
    PageComponent,
    exportLabel,
    brandText,
    removedArtworkLinkLabel,
    helpCenterLabel,
    helpCenterHref,
    changelogLabel,
    changelogHref,
  }) => {
    render(<PageComponent />);
    const prohibitedReferenceBrand = ['Coa', 'Maker'].join('');
    const editorHeader = document.querySelector<HTMLElement>('header.coat-target-appbar');
    if (!editorHeader) throw new Error('Coat maker header is unavailable');

    expect(screen.getAllByText(brandText, { exact: false }).some((element) => element.closest('header'))).toBe(true);
    expect(screen.queryByRole('link', { name: removedArtworkLinkLabel })).toBeNull();
    expect(within(editorHeader).getByRole('link', { name: helpCenterLabel }).getAttribute('href')).toBe(helpCenterHref);
    expect(within(editorHeader).getByRole('link', { name: changelogLabel }).getAttribute('href')).toBe(changelogHref);
    const siteFooter = screen.getByRole('contentinfo');
    expect(within(siteFooter).getByRole('navigation', { name: PageComponent === ChineseCoatOfArmsMakerPage ? '页脚导航' : 'Footer navigation' })).toBeDefined();
    expect(screen.getByRole('button', { name: exportLabel })).not.toBeNull();
    expect(screen.queryByText(prohibitedReferenceBrand, { exact: false })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Coat Maker' })).toBeNull();
  });
});

describe('blog static routes', () => {
  it('emits bilingual dagger detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_DAGGER_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_DAGGER_SLUG });
  });

  it('emits bilingual dwelf dnd detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DWELF_DND_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DWELF_DND_SLUG });
  });

  it('emits bilingual Armorer detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_5E_ARMORER_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_5E_ARMORER_SLUG });
  });

  it('emits bilingual sword-sheath detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_SWORD_SHEATHS_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_SWORD_SHEATHS_SLUG });
  });

  it('emits bilingual Thunderclap detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_THUNDERCLAP_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_THUNDERCLAP_SLUG });
  });

  it('emits bilingual flumph detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_FLUMPH_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_FLUMPH_SLUG });
  });

  it('emits bilingual fourth-page pagination params', () => {
    expect(generateEnglishBlogPaginationStaticParams()).toContainEqual({ page: '4' });
    expect(generateChineseBlogPaginationStaticParams()).toContainEqual({ page: '4' });
  });
});
