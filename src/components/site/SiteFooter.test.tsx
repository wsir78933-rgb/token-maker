// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
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

function getFooterSectionLinks(navigationLabel: string, sectionTitle: string) {
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

  return within(footerSectionLinkList).getAllByRole('link').map((footerLink) => ({
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

function getFooterNavigationTextOrder() {
  return Array.from(getFooterNavigation().querySelectorAll('h2, a'))
    .map((footerNavigationElement) => footerNavigationElement.textContent?.trim())
    .filter((textContent): textContent is string => Boolean(textContent));
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
    expect(screen.getByRole('link', { name: 'Dice Roller' }).getAttribute('href')).toBe('/dice-roller-dnd');
    expect(screen.getByRole('link', { name: 'Coat of Arms Maker' }).getAttribute('href')).toBe('/coat-of-arms-maker');
    expect(screen.queryByRole('link', { name: 'Square Token Maker' })).toBeNull();
    expect(getFooterSectionLinks('Footer navigation', 'Tools')).toEqual([
      { name: 'Token Maker', href: '/#editor-workspace' },
      { name: 'Dice Roller', href: '/dice-roller-dnd' },
      { name: 'Coat of Arms Maker', href: '/coat-of-arms-maker' },
    ]);
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
    expect(screen.getByRole('link', { name: 'Token Maker 编辑器' }).getAttribute('href')).toBe('/zh#editor-workspace');
    expect(screen.getByRole('link', { name: '骰子工具' }).getAttribute('href')).toBe('/zh/dice-roller-dnd');
    expect(screen.getByRole('link', { name: '纹章制作器' }).getAttribute('href')).toBe('/zh/coat-of-arms-maker');
    expect(screen.queryByRole('link', { name: '方形 Token 制作器' })).toBeNull();
    expect(getFooterSectionLinks('页脚导航', '工具')).toEqual([
      { name: 'Token Maker 编辑器', href: '/zh#editor-workspace' },
      { name: '骰子工具', href: '/zh/dice-roller-dnd' },
      { name: '纹章制作器', href: '/zh/coat-of-arms-maker' },
    ]);
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

  it('keeps footer sections in a three-column icon grid on mobile', () => {
    render(<SiteFooter locale="en" currentPath="/" />);

    const footerNavigationClassList = Array.from(getFooterNavigation().classList);
    const footerNavigationTextOrder = getFooterNavigationTextOrder();
    const firstFooterLinkIndex = footerNavigationTextOrder.indexOf('Token Maker');

    expect(footerNavigationClassList).toContain('grid-cols-3');
    expect(footerNavigationClassList).toContain('gap-x-3');
    expect(footerNavigationClassList).toContain('gap-y-4');
    expect(footerNavigationClassList).toContain('sm:gap-x-8');
    expect(firstFooterLinkIndex).toBeGreaterThan(-1);

    for (const sectionTitle of ['Tools', 'Learn', 'Support']) {
      const sectionHeaderClassList = getFooterSectionHeaderClassList(sectionTitle);

      expect(sectionHeaderClassList).toContain('flex-col');
      expect(sectionHeaderClassList).toContain('items-center');
      expect(sectionHeaderClassList).toContain('text-center');
      expect(sectionHeaderClassList).toContain('sm:flex-row');
      expect(sectionHeaderClassList).toContain('sm:text-left');
      expect(footerNavigationTextOrder.indexOf(sectionTitle)).toBeLessThan(firstFooterLinkIndex);
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
