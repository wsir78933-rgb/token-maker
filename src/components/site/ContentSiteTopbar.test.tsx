// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ContentSiteTopbar } from './ContentSiteTopbar';

const topbarModel = {
  navigationLabel: 'Primary',
  featureMenuLabel: 'Blog',
  featureMenuHref: '/blog',
  featureMenuIsActive: true,
  featureMenuAccessibleName: 'Blog categories',
  features: [
    { href: '/blog/category/characters', title: 'Characters', description: 'Build a character.' },
    { href: '/blog/category/spells', title: 'Spells', description: 'Prepare spells.' },
  ],
  links: [
    { href: '/', label: 'Editor', isActive: false },
    { href: '/contact', label: 'Contact', isActive: false },
  ],
  localeSwitch: { href: '/zh', label: '中文' },
  primaryAction: { href: '/#editor-workspace', label: 'Start making tokens' },
  openMenuLabel: 'Open navigation',
  closeMenuLabel: 'Close navigation',
  menuDescription: 'Primary navigation links',
};

function renderContentSiteTopbar() {
  return render(
    <ContentSiteTopbar
      brandHref="/"
      brandName="Token Maker"
      brandSubtitle="Back to the editor"
      contentClassName="content"
      model={topbarModel}
      topbarClassName="topbar"
    />,
  );
}

function getBlogNavItem(): HTMLElement {
  const blogLink = screen.getByRole('link', { name: 'Blog' });
  const siteNavItem = blogLink.closest('.site-nav-item');
  if (!(siteNavItem instanceof HTMLElement)) {
    throw new Error(`Blog link is not inside .site-nav-item; href=${blogLink.getAttribute('href') ?? 'null'}`);
  }
  return siteNavItem;
}

function getSingleLink(linkName: string): HTMLElement {
  const links = screen.queryAllByRole('link', { name: linkName });
  if (links.length !== 1) {
    const names = links.map((link) => link.textContent ?? 'null').join(', ') || 'none';
    throw new Error(
      `Expected one link named ${JSON.stringify(linkName)}, found ${links.length}: ${names}.`,
    );
  }

  const link = links[0];
  if (!(link instanceof HTMLElement)) {
    throw new Error(
      `Link named ${JSON.stringify(linkName)} is not an HTMLElement. Received ${String(link)}.`,
    );
  }

  return link;
}

function getBlogControlWrapper(): HTMLElement {
  const siteNavItem = getBlogNavItem();
  const activeElements = [...siteNavItem.querySelectorAll('[data-active]')];
  if (activeElements.length !== 1) {
    const descriptions = activeElements
      .map((element) => `${element.tagName} class=${element.getAttribute('class') ?? 'null'}`)
      .join('; ') || 'none';
    throw new Error(
      `Expected one [data-active] element inside .site-nav-item, found ${activeElements.length}: ${descriptions}.`,
    );
  }

  const wrapper = activeElements[0];
  if (!(wrapper instanceof HTMLElement)) {
    throw new Error(
      `Blog control wrapper is not an HTMLElement. Received ${wrapper === undefined ? 'undefined' : wrapper.nodeName}.`,
    );
  }

  return wrapper;
}

describe('ContentSiteTopbar', () => {
  afterEach(() => {
    cleanup();
  });

  it('marks only the Blog link as a menu popup', () => {
    renderContentSiteTopbar();

    const blogLink = screen.getByRole('link', { name: 'Blog' });
    expect(blogLink.getAttribute('href')).toBe('/blog');
    expect(blogLink.getAttribute('aria-haspopup')).toBe('menu');
    expect(screen.getByRole('link', { name: 'Editor' }).getAttribute('aria-haspopup')).toBeNull();
  });

  it('opens the Blog nav item when the pointer enters it', () => {
    renderContentSiteTopbar();

    const siteNavItem = getBlogNavItem();
    fireEvent.mouseEnter(siteNavItem);

    expect(siteNavItem.getAttribute('data-open')).toBe('true');
  });

  it('renders the Characters category as a feature menuitem', () => {
    renderContentSiteTopbar();

    const charactersMenuitem = screen.getByRole('menuitem', { name: 'Characters' });
    expect(charactersMenuitem.getAttribute('href')).toBe('/blog/category/characters');
    expect(charactersMenuitem.classList.contains('site-nav-dropdown__link')).toBe(true);
    expect(charactersMenuitem.classList.contains('site-nav-dropdown__link--feature')).toBe(true);
    expect(charactersMenuitem.classList.contains('site-category-pill')).toBe(false);
  });

  it('keeps the Characters category description in the document', () => {
    renderContentSiteTopbar();

    expect(screen.getByText('Build a character.')).toBeDefined();
  });

  it('names the category menu Blog categories', () => {
    renderContentSiteTopbar();

    expect(screen.getByRole('menu', { name: 'Blog categories' })).toBeDefined();
  });

  it('links the primary action to the editor workspace', () => {
    renderContentSiteTopbar();

    expect(screen.getByRole('link', { name: 'Start making tokens' }).getAttribute('href')).toBe(
      '/#editor-workspace',
    );
  });

  it('closes the Blog nav item when Escape is pressed', () => {
    renderContentSiteTopbar();

    const siteNavItem = getBlogNavItem();
    fireEvent.mouseEnter(siteNavItem);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(siteNavItem.getAttribute('data-open')).toBe('false');
  });

  it('links the open mobile drawer to the blog index', () => {
    renderContentSiteTopbar();

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));

    const dialog = screen.getByRole('dialog');
    const blogLink = within(dialog).getByRole('link', { name: 'Blog' });
    expect(blogLink.getAttribute('href')).toBe('/blog');
    expect(within(dialog).getByRole('button', { name: 'Blog categories' })).toBeDefined();
  });

  it('moves focus into the mobile drawer and restores it after Escape', () => {
    renderContentSiteTopbar();

    const openButton = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open navigation' }));
  });

  it('wraps Tab focus within the mobile drawer', () => {
    renderContentSiteTopbar();

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const dialog = screen.getByRole('dialog');
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    lastFocusableElement.focus();
    fireEvent.keyDown(lastFocusableElement, { key: 'Tab' });
    expect(document.activeElement).toBe(firstFocusableElement);

    fireEvent.keyDown(firstFocusableElement, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastFocusableElement);
  });

  it('opens the desktop feature menu and focuses the first item with ArrowDown', () => {
    renderContentSiteTopbar();

    const blogLink = screen.getByRole('link', { name: 'Blog' });
    blogLink.focus();
    fireEvent.keyDown(blogLink, { key: 'ArrowDown' });

    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Characters' }));
  });

  it('gives the Editor link rounded-md and not a pill', () => {
    renderContentSiteTopbar();

    const editorLink = getSingleLink('Editor');
    expect(editorLink.classList.contains('rounded-md')).toBe(true);
    expect(editorLink.classList.contains('site-nav-pill')).toBe(false);
    expect(editorLink.classList.contains('rounded-full')).toBe(false);
  });

  it('gives the 中文 locale link rounded-lg and not a switch chip', () => {
    renderContentSiteTopbar();

    const localeLink = getSingleLink('中文');
    expect(localeLink.classList.contains('rounded-lg')).toBe(true);
    expect(localeLink.classList.contains('site-switch-chip')).toBe(false);
    expect(localeLink.classList.contains('rounded-full')).toBe(false);
  });

  it('gives the Start making tokens link rounded-lg and not a primary pill', () => {
    renderContentSiteTopbar();

    const primaryLink = getSingleLink('Start making tokens');
    expect(primaryLink.classList.contains('rounded-lg')).toBe(true);
    expect(primaryLink.classList.contains('site-cta-primary')).toBe(false);
    expect(primaryLink.classList.contains('rounded-full')).toBe(false);
  });

  it('gives the Blog control wrapper rounded-md and not a pill', () => {
    renderContentSiteTopbar();

    const blogControlWrapper = getBlogControlWrapper();
    expect(blogControlWrapper.classList.contains('rounded-md')).toBe(true);
    expect(blogControlWrapper.classList.contains('site-nav-pill')).toBe(false);
    expect(blogControlWrapper.classList.contains('rounded-full')).toBe(false);
  });
});
