// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { getToolDirectoryLinks } from '@/lib/tool-directory';

import { HomeSeoContent } from './HomeSeoContent';
import { InnerPageChrome } from './InnerPageChrome';
import { SiteFooter } from './SiteFooter';
import { SharePageView } from './views/SharePageView';

function getFooterContentShellClassList() {
  const footerContentShell = screen.getByRole('contentinfo').firstElementChild;

  if (!footerContentShell) {
    throw new Error('Footer content shell was not found in the rendered footer');
  }

  return Array.from(footerContentShell.classList);
}

function getFooterNavigation() {
  return within(screen.getByRole('contentinfo')).getByRole('navigation', { name: 'Footer navigation' });
}

function getFooterSectionList(navigationLabel: string, sectionTitle: string) {
  const footerNavigation = within(screen.getByRole('contentinfo')).getByRole('navigation', { name: navigationLabel });
  const footerSectionHeadings = within(footerNavigation).getAllByRole('heading');
  const footerSectionIndex = footerSectionHeadings.findIndex((footerSectionHeading) => {
    return footerSectionHeading.textContent?.trim() === sectionTitle;
  });

  if (footerSectionIndex === -1) {
    throw new Error(`Footer section heading was not found for "${sectionTitle}"`);
  }

  const footerSectionLinkList = footerNavigation.querySelectorAll('ul').item(footerSectionIndex);

  if (!footerSectionLinkList) {
    throw new Error(`Footer section link list was not found for "${sectionTitle}"`);
  }

  return footerSectionLinkList;
}

function getFooterSectionLinks(navigationLabel: string, sectionTitle: string) {
  return within(getFooterSectionList(navigationLabel, sectionTitle)).getAllByRole('link').map((footerLink) => ({
    name: footerLink.textContent?.trim(),
    href: footerLink.getAttribute('href'),
  }));
}

function getFooterSectionHeaderClassList(sectionTitle: string) {
  const sectionHeading = screen.getByRole('heading', { name: sectionTitle });
  const sectionHeader = sectionHeading.parentElement;

  if (!sectionHeader) {
    throw new Error(`Footer section header was not found for "${sectionTitle}"`);
  }

  return Array.from(sectionHeader.classList);
}

describe('SiteFooter', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders localized English links using current Token Maker pages', () => {
    render(<SiteFooter locale="en" currentPath="/privacy" />);

    expect(screen.getByRole('contentinfo')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Tools' })).toBeDefined();
    expect(screen.getByRole('link', { name: /token maker home/i }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: 'Token Maker' }).getAttribute('href')).toBe('/#editor-workspace');
    expect(screen.getByRole('link', { name: 'D&D Dice Roller' }).getAttribute('href')).toBe('/dice-roller-dnd');
    expect(screen.getByRole('link', { name: 'Coat of Arms Maker' }).getAttribute('href')).toBe('/coat-of-arms-maker');
    expect(screen.queryByRole('link', { name: 'Dice Roller' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Square Token Maker' })).toBeNull();
    expect(getFooterSectionLinks('Footer navigation', 'Tools')).toEqual(
      getToolDirectoryLinks('en').map((toolLink) => ({
        name: toolLink.name,
        href: toolLink.href,
      })),
    );
    expect(getFooterSectionLinks('Footer navigation', 'Tools')).toHaveLength(21);
    expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('href')).toBe('/blog');
    expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/about');
    expect(screen.getByRole('link', { name: 'Changelog' }).getAttribute('href')).toBe('/changelog');
    expect(screen.getByRole('link', { name: 'FAQ' }).getAttribute('href')).toBe('/faq');
    expect(screen.getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe('/privacy');
    expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('/contact');
    expect(getFooterSectionLinks('Footer navigation', 'Learn')).toEqual([
      { name: 'Blog', href: '/blog' },
      { name: 'About', href: '/about' },
      { name: 'Changelog', href: '/changelog' },
    ]);
    expect(getFooterSectionLinks('Footer navigation', 'Support')).toEqual([
      { name: 'FAQ', href: '/faq' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Contact', href: '/contact' },
    ]);
    expect(screen.queryByRole('link', { name: 'stardewvalleyplanner.art' })).toBeNull();
  });

  it('renders localized Chinese links without adding dependencies', () => {
    render(<SiteFooter locale="zh" currentPath="/about" />);

    expect(screen.getByRole('heading', { name: '工具' })).toBeDefined();
    expect(screen.getByRole('link', { name: /token maker 首页/i }).getAttribute('href')).toBe('/zh');
    expect(screen.getByRole('link', { name: 'Token Maker 头像制作器' }).getAttribute('href')).toBe('/zh#editor-workspace');
    expect(screen.getByRole('link', { name: 'D&D 骰子掷骰器' }).getAttribute('href')).toBe('/zh/dice-roller-dnd');
    expect(screen.getByRole('link', { name: '纹章制作器' }).getAttribute('href')).toBe('/zh/coat-of-arms-maker');
    expect(screen.queryByRole('link', { name: 'Token Maker 编辑器' })).toBeNull();
    expect(screen.queryByRole('link', { name: '骰子工具' })).toBeNull();
    expect(screen.queryByRole('link', { name: '方形 Token 制作器' })).toBeNull();
    expect(getFooterSectionLinks('页脚导航', '工具')).toEqual(
      getToolDirectoryLinks('zh').map((toolLink) => ({
        name: toolLink.name,
        href: toolLink.href,
      })),
    );
    expect(getFooterSectionLinks('页脚导航', '工具')).toHaveLength(21);
    expect(screen.getByRole('link', { name: '博客' }).getAttribute('href')).toBe('/zh/blog');
    expect(screen.getByRole('link', { name: '关于' }).getAttribute('href')).toBe('/zh/about');
    expect(screen.getByRole('link', { name: '更新记录' }).getAttribute('href')).toBe('/zh/changelog');
    expect(screen.getByRole('link', { name: '常见问题' }).getAttribute('href')).toBe('/zh/faq');
    expect(screen.getByRole('link', { name: '隐私' }).getAttribute('href')).toBe('/zh/privacy');
    expect(screen.getByRole('link', { name: '联系' }).getAttribute('href')).toBe('/zh/contact');
    expect(getFooterSectionLinks('页脚导航', '了解')).toEqual([
      { name: '博客', href: '/zh/blog' },
      { name: '关于', href: '/zh/about' },
      { name: '更新记录', href: '/zh/changelog' },
    ]);
    expect(getFooterSectionLinks('页脚导航', '支持')).toEqual([
      { name: '常见问题', href: '/zh/faq' },
      { name: '隐私', href: '/zh/privacy' },
      { name: '联系', href: '/zh/contact' },
    ]);
    expect(screen.queryByRole('link', { name: 'stardewvalleyplanner.art' })).toBeNull();
  });

  it('marks the current footer link for assistive technology', () => {
    render(<SiteFooter locale="en" currentPath="/blog/dnd-counterspell" />);

    expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Token Maker' }).hasAttribute('aria-current')).toBe(false);
  });

  it('uses a bounded wide footer content shell', () => {
    render(<SiteFooter locale="en" currentPath="/" />);

    const footerContentShellClassList = getFooterContentShellClassList();

    expect(footerContentShellClassList).toContain('mx-auto');
    expect(footerContentShellClassList).toContain('w-full');
    expect(footerContentShellClassList).toContain('max-w-[92rem]');
    expect(footerContentShellClassList).not.toContain('max-w-6xl');
  });

  it('keeps the same bounded desktop shell when near full width is requested', () => {
    render(<SiteFooter locale="en" currentPath="/" contentWidth="nearFull" />);

    const footerContentShellClassList = getFooterContentShellClassList();

    expect(footerContentShellClassList).toContain('mx-auto');
    expect(footerContentShellClassList).toContain('w-full');
    expect(footerContentShellClassList).toContain('max-w-[92rem]');
    expect(footerContentShellClassList).toContain('lg:px-8');
    expect(footerContentShellClassList).not.toContain('max-w-6xl');
  });

  it('places all 21 tools on their own multi-column row', () => {
    render(<SiteFooter locale="en" currentPath="/" />);

    const footerNavigationClassList = Array.from(getFooterNavigation().classList);
    const toolsListClassList = Array.from(getFooterSectionList('Footer navigation', 'Tools').classList);
    const toolsBlock = screen.getByRole('heading', { name: 'Tools' }).parentElement?.parentElement;
    const learnColumn = screen.getByRole('heading', { name: 'Learn' }).parentElement?.parentElement;
    const compactColumns = learnColumn?.parentElement;
    const toolsHeaderClassList = getFooterSectionHeaderClassList('Tools');

    expect(footerNavigationClassList).toContain('lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,32rem)]');
    expect(Array.from(compactColumns?.classList ?? [])).toContain('grid-cols-2');
    expect(toolsBlock?.classList.contains('lg:col-span-2')).toBe(true);
    expect(toolsListClassList).toContain('grid');
    expect(toolsListClassList).toContain('grid-cols-2');
    expect(toolsListClassList).toContain('sm:grid-cols-3');
    expect(toolsListClassList).toContain('lg:grid-cols-4');
    expect(toolsHeaderClassList).toContain('flex-row');
    expect(toolsHeaderClassList).toContain('text-left');
    expect(toolsHeaderClassList).not.toContain('flex-col');

    for (const sectionTitle of ['Learn', 'Support']) {
      const sectionHeaderClassList = getFooterSectionHeaderClassList(sectionTitle);

      expect(sectionHeaderClassList).toContain('flex-col');
      expect(sectionHeaderClassList).toContain('items-center');
      expect(sectionHeaderClassList).toContain('text-center');
      expect(sectionHeaderClassList).toContain('sm:flex-row');
      expect(sectionHeaderClassList).toContain('sm:text-left');
    }
  });

  it('renders the shared footer on content shells, not on share pages', () => {
    render(<HomeSeoContent locale="en" />);

    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeDefined();
    expect(within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Token Maker' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Coat of Arms Maker' })).toBeDefined();
    const homeFooterContentShellClassList = getFooterContentShellClassList();

    expect(homeFooterContentShellClassList).toContain('max-w-[92rem]');

    cleanup();

    render(
      <InnerPageChrome locale="en" currentPath="/blog/dnd-counterspell">
        <section>Blog detail content</section>
      </InnerPageChrome>,
    );

    const innerFooter = screen.getByRole('contentinfo');

    expect(screen.getByText('Blog detail content')).toBeDefined();
    expect(screen.queryByRole('navigation', { name: 'Support pages' })).toBeNull();
    expect(within(innerFooter).getByRole('link', { name: 'Blog' }).getAttribute('aria-current')).toBe('page');
    const innerFooterContentShellClassList = getFooterContentShellClassList();

    expect(innerFooterContentShellClassList).toContain('max-w-[92rem]');
    expect(innerFooterContentShellClassList).toContain('lg:px-8');
    expect(innerFooterContentShellClassList).not.toContain('max-w-6xl');
    expect(homeFooterContentShellClassList).toContain('lg:px-8');

    cleanup();

    render(<SharePageView locale="en" imageUrl="https://example.com/token.png" />);

    expect(screen.queryByRole('navigation', { name: 'Footer navigation' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Coat of Arms Maker' })).toBeNull();
  });

  it('does not render the support strip above the homepage footer in either locale', () => {
    render(<HomeSeoContent locale="en" />);

    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeDefined();
    expect(screen.queryByRole('navigation', { name: 'Support pages' })).toBeNull();

    cleanup();

    render(<HomeSeoContent locale="zh" />);

    expect(screen.getByRole('navigation', { name: '页脚导航' })).toBeDefined();
    expect(screen.queryByRole('navigation', { name: '支持页面导航' })).toBeNull();
  });
});
