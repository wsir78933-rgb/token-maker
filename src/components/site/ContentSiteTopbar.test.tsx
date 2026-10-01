// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ContentSiteTopbar } from './ContentSiteTopbar';

const topbarModel = {
  navigationLabel: 'Primary',
  freeToolsMenuLabel: 'Free tools',
  freeToolsMenuHref: '/',
  freeToolsMenuIsActive: true,
  freeToolsMenuAccessibleName: 'Free tools',
  freeTools: [
    { href: '/', title: 'Token Maker' },
    { href: '/coat-of-arms-maker', title: 'Coat of Arms Maker' },
    { href: '/armor-creator', title: 'Armor Creator' },
    { href: '/army-formation-creator', title: 'Army Formation Creator' },
  ],
  featureMenuLabel: 'Blog',
  featureMenuHref: '/blog',
  featureMenuIsActive: true,
  featureMenuAccessibleName: 'Blog categories',
  features: [
    { href: '/blog/category/characters', title: 'Characters', description: 'Build a character.' },
    { href: '/blog/category/spells', title: 'Spells', description: 'Prepare spells.' },
  ],
  links: [
    { href: '/dice-roller-dnd', label: 'Dice Roller', isActive: false },
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

function getFeatureMenuitem(itemName: string): HTMLElement {
  const menuItem = screen.getByRole('menuitem', { name: itemName });
  if (!(menuItem instanceof HTMLElement)) {
    throw new Error(
      `Feature menuitem ${JSON.stringify(itemName)} is not an HTMLElement. Received ${String(menuItem)}.`,
    );
  }

  return menuItem;
}

function openFeatureMenuOnFirstItem(): HTMLElement {
  const blogLink = screen.getByRole('link', { name: 'Blog' });
  blogLink.focus();
  fireEvent.keyDown(blogLink, { key: 'ArrowDown' });
  return getFeatureMenuitem('Characters');
}

// jsdom does not move focus on Tab. This checks the handler left the browser default alone.
function expectFeatureMenuTabLeavesWithoutStealingFocus(target: HTMLElement, shiftKey = false): void {
  const activeElementBeforeTab = document.activeElement;
  const tabDefaultWasNotCanceled = fireEvent.keyDown(target, { key: 'Tab', shiftKey });

  expect(tabDefaultWasNotCanceled).toBe(true);
  expect(getBlogNavItem().getAttribute('data-open')).toBe('false');
  expect(document.activeElement).toBe(activeElementBeforeTab);
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

  it('marks the Free tools and Blog links as menu popups', () => {
    renderContentSiteTopbar();

    const freeToolsLink = screen.getByRole('link', { name: 'Free tools' });
    const blogLink = screen.getByRole('link', { name: 'Blog' });
    expect(freeToolsLink.getAttribute('href')).toBe('/');
    expect(freeToolsLink.getAttribute('aria-haspopup')).toBe('menu');
    expect(blogLink.getAttribute('href')).toBe('/blog');
    expect(blogLink.getAttribute('aria-haspopup')).toBe('menu');
    expect(screen.getByRole('link', { name: 'Dice Roller' }).getAttribute('aria-haspopup')).toBeNull();
  });

  it('opens the Free tools nav item when the pointer enters it', () => {
    renderContentSiteTopbar();

    const freeToolsLink = screen.getByRole('link', { name: 'Free tools' });
    const siteNavItem = freeToolsLink.closest('.site-nav-item');
    if (!(siteNavItem instanceof HTMLElement)) {
      throw new Error('Free tools link is not inside .site-nav-item');
    }

    fireEvent.mouseEnter(siteNavItem);

    expect(siteNavItem.getAttribute('data-open')).toBe('true');
  });

  it('keeps the Free tools menu open when its toggle is clicked after pointer entry', () => {
    renderContentSiteTopbar();

    const freeToolsLink = screen.getByRole('link', { name: 'Free tools' });
    const freeToolsToggle = screen.getByRole('button', { name: 'Free tools' });
    const siteNavItem = freeToolsLink.closest('.site-nav-item');
    if (!(siteNavItem instanceof HTMLElement)) {
      throw new Error('Free tools link is not inside .site-nav-item');
    }

    fireEvent.mouseEnter(siteNavItem);
    fireEvent.click(freeToolsToggle);

    expect(freeToolsToggle.getAttribute('aria-expanded')).toBe('true');
    expect(siteNavItem.getAttribute('data-open')).toBe('true');
  });

  it('renders all four free tools with their existing paths', () => {
    renderContentSiteTopbar();

    expect(screen.getByRole('menuitem', { name: 'Token Maker' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('menuitem', { name: 'Coat of Arms Maker' }).getAttribute('href')).toBe(
      '/coat-of-arms-maker',
    );
    expect(screen.getByRole('menuitem', { name: 'Armor Creator' }).getAttribute('href')).toBe('/armor-creator');
    expect(screen.getByRole('menuitem', { name: 'Army Formation Creator' }).getAttribute('href')).toBe(
      '/army-formation-creator',
    );
  });

  it('names the Free tools menu', () => {
    renderContentSiteTopbar();

    expect(screen.getByRole('menu', { name: 'Free tools' })).toBeDefined();
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

  it('links the open mobile drawer to the free tools and renders all tool items', () => {
    renderContentSiteTopbar();

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('link', { name: 'Free tools' }).getAttribute('href')).toBe('/');
    const freeToolsAccordion = within(dialog).getByRole('button', { name: 'Free tools' });
    expect(freeToolsAccordion).toBeDefined();
    fireEvent.click(freeToolsAccordion);
    const freeToolsItem = freeToolsAccordion.closest('[data-slot="accordion-item"]');
    if (!(freeToolsItem instanceof HTMLElement)) {
      throw new Error('Free tools accordion trigger is not inside an accordion item');
    }

    expect(within(freeToolsItem).getByRole('link', { name: 'Token Maker' }).getAttribute('href')).toBe('/');
    expect(within(freeToolsItem).getByRole('link', { name: 'Coat of Arms Maker' }).getAttribute('href')).toBe(
      '/coat-of-arms-maker',
    );
    expect(within(freeToolsItem).getByRole('link', { name: 'Armor Creator' }).getAttribute('href')).toBe(
      '/armor-creator',
    );
    expect(within(freeToolsItem).getByRole('link', { name: 'Army Formation Creator' }).getAttribute('href')).toBe(
      '/army-formation-creator',
    );
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

  it('moves ArrowDown into the feature menu when focus already opened it', () => {
    renderContentSiteTopbar();

    const blogLink = screen.getByRole('link', { name: 'Blog' });
    fireEvent.focus(blogLink);
    expect(getBlogNavItem().getAttribute('data-open')).toBe('true');

    fireEvent.keyDown(blogLink, { key: 'ArrowDown' });

    expect(document.activeElement).toBe(getFeatureMenuitem('Characters'));
  });

  it('keeps closed feature menuitems out of the tab order', () => {
    renderContentSiteTopbar();

    expect(getFeatureMenuitem('Characters').getAttribute('tabindex')).toBe('-1');
    expect(getFeatureMenuitem('Spells').getAttribute('tabindex')).toBe('-1');
  });

  it('cycles feature menuitems with ArrowUp, ArrowDown, Home, and End', () => {
    renderContentSiteTopbar();

    const charactersMenuitem = openFeatureMenuOnFirstItem();
    const spellsMenuitem = getFeatureMenuitem('Spells');
    expect(charactersMenuitem.getAttribute('tabindex')).toBe('-1');
    expect(spellsMenuitem.getAttribute('tabindex')).toBe('-1');

    fireEvent.keyDown(charactersMenuitem, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(spellsMenuitem);

    fireEvent.keyDown(spellsMenuitem, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(charactersMenuitem);

    fireEvent.keyDown(charactersMenuitem, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(spellsMenuitem);

    fireEvent.keyDown(spellsMenuitem, { key: 'Home' });
    expect(document.activeElement).toBe(charactersMenuitem);

    fireEvent.keyDown(charactersMenuitem, { key: 'End' });
    expect(document.activeElement).toBe(spellsMenuitem);
  });

  it('opens the feature menu on the last item with ArrowUp', () => {
    renderContentSiteTopbar();

    const blogLink = screen.getByRole('link', { name: 'Blog' });
    blogLink.focus();
    fireEvent.keyDown(blogLink, { key: 'ArrowUp' });

    expect(document.activeElement).toBe(getFeatureMenuitem('Spells'));
  });

  it('restores the feature menu trigger when Escape closes the menu', () => {
    renderContentSiteTopbar();

    const charactersMenuitem = openFeatureMenuOnFirstItem();
    const escapeDefaultWasCanceled = fireEvent.keyDown(charactersMenuitem, { key: 'Escape' });

    expect(escapeDefaultWasCanceled).toBe(false);
    expect(getBlogNavItem().getAttribute('data-open')).toBe('false');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Blog categories' }));
    expect(charactersMenuitem.getAttribute('tabindex')).toBe('-1');
    expect(getFeatureMenuitem('Spells').getAttribute('tabindex')).toBe('-1');
  });

  it('closes the feature menu on Tab and Shift+Tab without canceling the key or moving focus', () => {
    renderContentSiteTopbar();

    const charactersMenuitem = openFeatureMenuOnFirstItem();
    expectFeatureMenuTabLeavesWithoutStealingFocus(charactersMenuitem);
    expect(charactersMenuitem.getAttribute('tabindex')).toBe('-1');
    expect(getFeatureMenuitem('Spells').getAttribute('tabindex')).toBe('-1');

    openFeatureMenuOnFirstItem();
    const spellsMenuitem = getFeatureMenuitem('Spells');
    fireEvent.keyDown(getFeatureMenuitem('Characters'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(spellsMenuitem);
    expectFeatureMenuTabLeavesWithoutStealingFocus(spellsMenuitem, true);
  });

  it('closes the feature menu when Tab leaves the trigger and keeps it open inside the trigger', () => {
    renderContentSiteTopbar();

    const blogLink = screen.getByRole('link', { name: 'Blog' });
    act(() => {
      blogLink.focus();
    });
    expect(document.activeElement).toBe(blogLink);
    expect(getBlogNavItem().getAttribute('data-open')).toBe('true');

    const tabInsideTriggerWasNotCanceled = fireEvent.keyDown(blogLink, { key: 'Tab' });
    expect(tabInsideTriggerWasNotCanceled).toBe(true);
    expect(getBlogNavItem().getAttribute('data-open')).toBe('true');
    expect(document.activeElement).toBe(blogLink);

    expectFeatureMenuTabLeavesWithoutStealingFocus(blogLink, true);

    fireEvent.focus(blogLink);
    const blogCategoriesButton = screen.getByRole('button', { name: 'Blog categories' });
    act(() => {
      blogCategoriesButton.focus();
    });
    expect(getBlogNavItem().getAttribute('data-open')).toBe('true');
    expect(document.activeElement).toBe(blogCategoriesButton);
    expectFeatureMenuTabLeavesWithoutStealingFocus(blogCategoriesButton);
  });

  it('does not restore the feature menu toggle when Tab follows Escape while the menu was closed', () => {
    renderContentSiteTopbar();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(getBlogNavItem().getAttribute('data-open')).toBe('false');

    const charactersMenuitem = openFeatureMenuOnFirstItem();
    expect(document.activeElement).toBe(charactersMenuitem);

    expectFeatureMenuTabLeavesWithoutStealingFocus(charactersMenuitem);
    expect(document.activeElement).not.toBe(screen.getByRole('button', { name: 'Blog categories' }));
  });

  it('closes the feature menu on Tab without canceling the key or focusing a hidden stop', () => {
    renderContentSiteTopbar();

    const hiddenStop = document.createElement('button');
    hiddenStop.type = 'button';
    hiddenStop.id = 'hidden-tab-stop';
    hiddenStop.hidden = true;
    hiddenStop.tabIndex = 0;
    hiddenStop.textContent = 'hidden between';
    getBlogNavItem().insertAdjacentElement('afterend', hiddenStop);

    const charactersMenuitem = openFeatureMenuOnFirstItem();
    expect(hiddenStop.tabIndex).toBe(0);
    expect(document.activeElement).toBe(charactersMenuitem);

    expectFeatureMenuTabLeavesWithoutStealingFocus(charactersMenuitem);
    expect(document.activeElement).not.toBe(hiddenStop);
  });

  it('does not move focus to the feature menu toggle when the pointer leaves after Escape while closed', () => {
    vi.useFakeTimers();
    try {
      renderContentSiteTopbar();

      const contactLink = getSingleLink('Contact');
      contactLink.focus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(getBlogNavItem().getAttribute('data-open')).toBe('false');

      const siteNavItem = getBlogNavItem();
      fireEvent.mouseEnter(siteNavItem);
      expect(siteNavItem.getAttribute('data-open')).toBe('true');
      expect(document.activeElement).toBe(contactLink);

      fireEvent.mouseLeave(siteNavItem);
      act(() => {
        vi.advanceTimersByTime(120);
      });

      expect(siteNavItem.getAttribute('data-open')).toBe('false');
      expect(document.activeElement).toBe(contactLink);
    } finally {
      vi.useRealTimers();
    }
  });

  it('gives the Dice Roller link rounded-md and not a pill', () => {
    renderContentSiteTopbar();

    const diceRollerLink = getSingleLink('Dice Roller');
    expect(diceRollerLink.classList.contains('rounded-md')).toBe(true);
    expect(diceRollerLink.classList.contains('site-nav-pill')).toBe(false);
    expect(diceRollerLink.classList.contains('rounded-full')).toBe(false);
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
