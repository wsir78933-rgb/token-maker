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
const FIREBOLT_DND_5E_SLUG = 'firebolt-dnd-5e';
const SPECTATOR_DND_SLUG = 'spectator-dnd';
const DND_QUARTERSTAFF_SLUG = 'dnd-quarterstaff';
const DND_MAUL_SLUG = 'dnd-maul';
const DND_SHATTER_5E_SLUG = 'dnd-shatter-5e';
const DND_MEANING_SLUG = 'dnd-meaning';
const DND_LANGUAGES_SLUG = 'dnd-languages';

function getStructuredDataTypes(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(getStructuredDataTypes);
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const record = value as Record<string, unknown>;
  const currentType = typeof record['@type'] === 'string' ? [record['@type']] : [];

  return [...currentType, ...Object.values(record).flatMap(getStructuredDataTypes)];
}

function parseServerMarkup(markup: string): Document {
  return new DOMParser().parseFromString(markup, 'text/html');
}

function getRouteStructuredData(serverDocument: Document, scriptId: string): Record<string, unknown> {
  const structuredDataScript = serverDocument.getElementById(scriptId);

  expect(structuredDataScript).not.toBeNull();

  return JSON.parse(structuredDataScript?.textContent ?? '{}') as Record<string, unknown>;
}

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

  it('server-renders the Chinese default project name as non-heading text', () => {
    useCoatProjectStore.setState(useCoatProjectStore.getInitialState(), true);

    const markup = renderToStaticMarkup(<ChineseCoatOfArmsMakerPage />);

    expect(markup).toContain('<span class="sr-only">我的徽章</span>');
    expect(markup).not.toContain('<h1 class="sr-only">我的徽章</h1>');
  });

  it('uses the complete English keyphrase in the Coat Maker metadata title', () => {
    expect(englishCoatOfArmsMakerMetadata.title).toEqual({
      absolute: 'Coat of Arms Maker — Free Online Heraldry Creator',
    });
  });

  it.each([
    {
      PageComponent: EnglishCoatOfArmsMakerPage,
      canonical: '/coat-of-arms-maker',
      contentHeading: 'Coat of Arms Maker',
      metadata: englishCoatOfArmsMakerMetadata,
      metadataTitle: 'Coat of Arms Maker — Free Online Heraldry Creator',
      schemaDescription:
        'Use this free coat of arms maker to customize shields, colours, charges, text, and layers in your browser, then export PNG, JPEG, or PDF files.',
      schemaFeatures: [
        'Shield styles and field patterns',
        'Charges, text, layers, and drawing tools',
        'Local project saving and export options',
      ],
      schemaId: 'coat-maker-en-web-application-jsonld',
      twitterDescription:
        'Use this free coat of arms maker to customize shields, colours, charges, text, and layers in your browser, then export PNG, JPEG, or PDF files.',
      twitterTitle: 'Coat of Arms Maker — Free Online Heraldry Creator',
      projectName: 'My Coat of Arms',
      workspaceName: 'Coat maker workspace',
    },
    {
      PageComponent: ChineseCoatOfArmsMakerPage,
      canonical: '/zh/coat-of-arms-maker',
      contentHeading: '纹章制作器',
      metadata: chineseCoatOfArmsMakerMetadata,
      metadataTitle: '纹章制作器 | 免费徽章编辑器',
      schemaDescription: '使用这款免费纹章制作器，在浏览器中自定义盾牌、颜色、图形、文字和图层，并导出 PNG、JPEG 或 PDF 文件。',
      schemaFeatures: [
        '盾牌样式与底纹',
        '图形、文字、图层和绘图工具',
        '本地项目保存与导出选项',
      ],
      schemaId: 'coat-maker-zh-web-application-jsonld',
      twitterDescription: '使用这款免费纹章制作器，在浏览器中自定义盾牌、颜色、图形、文字和图层，并导出 PNG、JPEG 或 PDF 文件。',
      twitterTitle: '纹章制作器 | 免费徽章编辑器',
      projectName: '我的徽章',
      workspaceName: '徽章制作工作台',
    },
  ])('renders localized SEO content, metadata, and WebApplication JSON-LD for $canonical', ({
    PageComponent,
    canonical,
    contentHeading,
    metadata,
    metadataTitle,
    projectName,
    schemaDescription,
    schemaFeatures,
    schemaId,
    twitterDescription,
    twitterTitle,
    workspaceName,
  }) => {
    const serverDocument = parseServerMarkup(renderToStaticMarkup(<PageComponent />));
    const workbench = serverDocument.querySelector(`main[aria-label="${workspaceName}"]`);
    const contentRoot = serverDocument.querySelector('[data-testid="coat-maker-seo-content"]');
    const footer = serverDocument.querySelector('footer');
    const projectNameElement = Array.from(serverDocument.querySelectorAll('.coat-workbench-content .sr-only'))
      .find((element) => element.textContent === projectName);
    const structuredDataScripts = Array.from(serverDocument.querySelectorAll('script[type="application/ld+json"]'));
    const structuredData = getRouteStructuredData(serverDocument, schemaId);
    const routeStructuredDataTypes = getStructuredDataTypes(structuredData);

    if (workbench === null) {
      throw new Error('SSR route is missing the workbench element.');
    }

    if (contentRoot === null) {
      throw new Error('SSR route is missing the SEO content element.');
    }

    if (footer === null) {
      throw new Error('SSR route is missing the footer element.');
    }

    expect(workbench).not.toBeNull();
    expect(contentRoot).not.toBeNull();
    expect(footer).not.toBeNull();
    expect(serverDocument.querySelectorAll('h1')).toHaveLength(1);
    expect(serverDocument.querySelector('h1')?.textContent).toBe(contentHeading);
    expect(projectNameElement?.tagName).toBe('SPAN');
    expect(Array.from(serverDocument.querySelectorAll('h1')).some((heading) => heading.textContent === projectName)).toBe(false);
    expect(workbench.compareDocumentPosition(contentRoot) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(contentRoot.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(structuredDataScripts).toHaveLength(1);
    expect(metadata.title).toEqual({ absolute: metadataTitle });
    expect(metadata.description).toBe(schemaDescription);
    expect(metadata.openGraph).toMatchObject({ title: metadataTitle, description: schemaDescription });
    expect(metadata.openGraph).not.toHaveProperty('images');
    expect(structuredData).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: contentHeading,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url: `https://www.tokenmaker.one${canonical}`,
      description: schemaDescription,
      featureList: schemaFeatures,
    });
    expect(structuredData['@type']).toBe('WebApplication');
    expect(routeStructuredDataTypes).not.toContain('HowTo');
    expect(routeStructuredDataTypes).not.toContain('FAQPage');
    expect(metadata.twitter).toMatchObject({
      card: 'summary',
      title: twitterTitle,
      description: twitterDescription,
    });
    expect(metadata.twitter).not.toHaveProperty('images');
  });

  it.each([
    {
      PageComponent: EnglishCoatOfArmsMakerPage,
      exportLabel: 'Export',
      removedArtworkLinkLabel: 'User Artwork',
      sharedNavigationLinks: [
        { label: 'Editor', href: '/' },
        { label: 'Dice Roller', href: '/dice-roller-dnd' },
        { label: 'Coat Maker', href: '/coat-of-arms-maker' },
        { label: 'Blog', href: '/blog' },
      ],
      localeSwitchLabel: '中文',
      localeSwitchHref: '/zh/coat-of-arms-maker',
    },
    {
      PageComponent: ChineseCoatOfArmsMakerPage,
      exportLabel: '导出',
      removedArtworkLinkLabel: '用户作品',
      sharedNavigationLinks: [
        { label: '编辑器', href: '/zh' },
        { label: '骰子', href: '/zh/dice-roller-dnd' },
        { label: '纹章制作器', href: '/zh/coat-of-arms-maker' },
        { label: '博客', href: '/zh/blog' },
      ],
      localeSwitchLabel: 'English',
      localeSwitchHref: '/coat-of-arms-maker',
    },
  ])('renders the shared site navigation and editor workspace chrome for $exportLabel', ({
    PageComponent,
    exportLabel,
    removedArtworkLinkLabel,
    sharedNavigationLinks,
    localeSwitchLabel,
    localeSwitchHref,
  }) => {
    render(<PageComponent />);
    const prohibitedReferenceBrand = ['Coa', 'Maker'].join('');
    const sharedTopbar = document.querySelector<HTMLElement>('.site-topbar');
    if (!sharedTopbar) throw new Error('Coat maker site topbar is unavailable');
    expect(sharedTopbar.parentElement).toBe(screen.getByRole('main'));

    expect(screen.queryByRole('link', { name: removedArtworkLinkLabel })).toBeNull();
    for (const link of sharedNavigationLinks) {
      expect(within(sharedTopbar).getByRole('link', { name: link.label }).getAttribute('href')).toBe(link.href);
    }
    expect(within(sharedTopbar).getByRole('link', { name: localeSwitchLabel }).getAttribute('href')).toBe(localeSwitchHref);
    const siteFooter = screen.getByRole('contentinfo');
    expect(within(siteFooter).getByRole('navigation', { name: PageComponent === ChineseCoatOfArmsMakerPage ? '页脚导航' : 'Footer navigation' })).toBeDefined();
    expect(screen.getByRole('button', { name: exportLabel })).not.toBeNull();
    expect(screen.queryByText(prohibitedReferenceBrand, { exact: false })).toBeNull();
  });
});

describe('blog static routes', () => {
  it('emits bilingual dnd languages detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_LANGUAGES_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_LANGUAGES_SLUG });
  });

  it('emits bilingual dnd meaning detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_MEANING_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_MEANING_SLUG });
  });

  it('emits bilingual dnd alignment chart detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: 'dnd-alignment-chart' });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: 'dnd-alignment-chart' });
  });

  it('emits bilingual dnd races detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: 'dnd-races' });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: 'dnd-races' });
  });

  it('emits bilingual Shatter detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_SHATTER_5E_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_SHATTER_5E_SLUG });
  });

  it('emits bilingual Maul detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_MAUL_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_MAUL_SLUG });
  });

  it('emits bilingual Quarterstaff detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: DND_QUARTERSTAFF_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: DND_QUARTERSTAFF_SLUG });
  });

  it('emits bilingual Spectator detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: SPECTATOR_DND_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: SPECTATOR_DND_SLUG });
  });

  it('emits bilingual Fire Bolt detail params', () => {
    expect(generateEnglishBlogPostStaticParams()).toContainEqual({ slug: FIREBOLT_DND_5E_SLUG });
    expect(generateChineseBlogPostStaticParams()).toContainEqual({ slug: FIREBOLT_DND_5E_SLUG });
  });

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

  it('emits bilingual fifth-page pagination params', () => {
    expect(generateEnglishBlogPaginationStaticParams()).toContainEqual({ page: '5' });
    expect(generateChineseBlogPaginationStaticParams()).toContainEqual({ page: '5' });
  });
});
