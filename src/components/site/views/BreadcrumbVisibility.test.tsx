// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BlogHubPageView } from './BlogHubPageView';
import { DiceRollerPageView } from './DiceRollerPageView';
import { TemplatePageView } from './TemplatePageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

interface BreadcrumbStructuredData {
  itemListElement: Array<{ name: string; item: string }>;
}

function readStructuredData(scriptId: string) {
  const structuredDataScript = document.getElementById(scriptId);

  if (!structuredDataScript?.textContent) {
    throw new Error(`Expected structured data script ${scriptId} to render.`);
  }

  return JSON.parse(structuredDataScript.textContent) as BreadcrumbStructuredData;
}

function readAllBreadcrumbLists() {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).flatMap((script) => {
    if (!script.textContent) {
      return [];
    }

    const structuredData = JSON.parse(script.textContent) as {
      '@type'?: string;
      '@graph'?: Array<{ '@type'?: string }>;
    };

    if (structuredData['@type'] === 'BreadcrumbList') {
      return [structuredData];
    }

    return structuredData['@graph']?.filter((entry) => entry['@type'] === 'BreadcrumbList') ?? [];
  });
}

function getBreadcrumbPaths(scriptId: string) {
  return readStructuredData(scriptId).itemListElement.map((item) => new URL(item.item).pathname);
}

describe('content page breadcrumb visibility', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the localized current page for a Chinese blog pagination route', () => {
    render(<BlogHubPageView locale="zh" page={2} />);

    const breadcrumbNavigation = screen.getByRole('navigation', { name: '面包屑' });

    expect(within(breadcrumbNavigation).getByRole('link', { name: '编辑器' }).getAttribute('href')).toBe('/zh');
    expect(within(breadcrumbNavigation).getByRole('link', { name: '博客' }).getAttribute('href')).toBe('/zh/blog');
    expect(within(breadcrumbNavigation).getByText('第 2 页')).not.toBeNull();
    expect(within(breadcrumbNavigation).queryByRole('link', { name: '第 2 页' })).toBeNull();
    expect(readStructuredData('blog-hub-breadcrumb-zh-2').itemListElement.map((item) => item.name)).toEqual([
      '编辑器',
      '博客',
      '第 2 页',
    ]);
    expect(getBreadcrumbPaths('blog-hub-breadcrumb-zh-2')).toEqual(['/zh', '/zh/blog', '/zh/blog/page/2']);
  });

  it.each([
    {
      locale: 'en' as const,
      navigationLabel: 'Breadcrumb',
      editor: 'Editor',
      blog: 'Blog',
      rootPath: '/',
      breadcrumbScriptId: 'blog-hub-breadcrumb-en-1',
    },
    {
      locale: 'zh' as const,
      navigationLabel: '面包屑',
      editor: '编辑器',
      blog: '博客',
      rootPath: '/zh',
      breadcrumbScriptId: 'blog-hub-breadcrumb-zh-1',
    },
  ])('renders the two-level blog breadcrumb for $locale', ({ locale, navigationLabel, editor, blog, rootPath, breadcrumbScriptId }) => {
    render(<BlogHubPageView locale={locale} />);

    const breadcrumbNavigation = screen.getByRole('navigation', { name: navigationLabel });

    expect(within(breadcrumbNavigation).getByRole('link', { name: editor }).getAttribute('href')).toBe(rootPath);
    expect(within(breadcrumbNavigation).getByText(blog)).not.toBeNull();
    expect(within(breadcrumbNavigation).queryByRole('link', { name: blog })).toBeNull();
    expect(readStructuredData(breadcrumbScriptId).itemListElement.map((item) => item.name)).toEqual([editor, blog]);
    expect(getBreadcrumbPaths(breadcrumbScriptId)).toEqual([rootPath, `${rootPath === '/' ? '' : rootPath}/blog`]);
  });

  it.each([
    {
      locale: 'en' as const,
      navigationLabel: 'Breadcrumb',
      editor: 'Editor',
      diceRoller: 'Dice Roller',
      rootPath: '/',
      breadcrumbScriptId: 'dice-roller-dnd-en-breadcrumb-jsonld',
    },
    {
      locale: 'zh' as const,
      navigationLabel: '面包屑',
      editor: '编辑器',
      diceRoller: '骰子',
      rootPath: '/zh',
      breadcrumbScriptId: 'dice-roller-dnd-zh-breadcrumb-jsonld',
    },
  ])('renders the $locale dice roller breadcrumb with the shared navigation labels', ({
    locale,
    navigationLabel,
    editor,
    diceRoller,
    rootPath,
    breadcrumbScriptId,
  }) => {
    render(<DiceRollerPageView locale={locale} />);

    const breadcrumbNavigation = screen.getByRole('navigation', { name: navigationLabel });

    expect(within(breadcrumbNavigation).getByRole('link', { name: editor }).getAttribute('href')).toBe(rootPath);
    expect(within(breadcrumbNavigation).getByText(diceRoller)).not.toBeNull();
    expect(within(breadcrumbNavigation).queryByRole('link', { name: diceRoller })).toBeNull();
    expect(readStructuredData(breadcrumbScriptId).itemListElement.map((item) => item.name)).toEqual([editor, diceRoller]);
    expect(getBreadcrumbPaths(breadcrumbScriptId)).toEqual([rootPath, `${rootPath === '/' ? '' : rootPath}/dice-roller-dnd`]);
  });

  it('renders one two-level template breadcrumb without an unlinked templates segment', () => {
    render(<TemplatePageView locale="zh" slug="square-token-maker" />);

    const breadcrumbNavigation = screen.getByRole('navigation', { name: '面包屑' });

    expect(within(breadcrumbNavigation).getByRole('link', { name: '编辑器' }).getAttribute('href')).toBe('/zh');
    expect(within(breadcrumbNavigation).queryByText('模板页')).toBeNull();
    expect(within(breadcrumbNavigation).getByText('方形 Token 制作器，适合 VTT 网格地图与 NPC 头像')).not.toBeNull();
    expect(
      within(breadcrumbNavigation).queryByRole('link', { name: '方形 Token 制作器，适合 VTT 网格地图与 NPC 头像' }),
    ).toBeNull();
    expect(readStructuredData('template-zh-square-token-maker-breadcrumb-jsonld').itemListElement.map((item) => item.name)).toEqual([
      '编辑器',
      '方形 Token 制作器，适合 VTT 网格地图与 NPC 头像',
    ]);
    expect(readAllBreadcrumbLists()).toHaveLength(1);
  });
});
