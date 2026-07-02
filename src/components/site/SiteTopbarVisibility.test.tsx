// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomeHero } from './HomeSeoContent';
import { InnerPageChrome } from './InnerPageChrome';
import { SharePageView } from './views/SharePageView';

function setViewportWidth(viewportWidth: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: viewportWidth,
  });
}

function setWindowScrollY(scrollY: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(window, 'pageYOffset', {
    configurable: true,
    value: scrollY,
  });
}

function dispatchScroll(scrollY: number) {
  act(() => {
    setWindowScrollY(scrollY);
    window.dispatchEvent(new Event('scroll'));
  });
}

function getContentSiteTopbar() {
  const contentSiteTopbar = document.querySelector('.site-topbar');

  if (!(contentSiteTopbar instanceof HTMLElement)) {
    throw new Error('Content site topbar was not found');
  }

  return contentSiteTopbar;
}

describe('content site topbar visibility', () => {
  afterEach(() => {
    cleanup();
    setViewportWidth(1024);
    setWindowScrollY(0);
  });

  it('hides the homepage content navigation on desktop downward scroll and shows it on upward scroll', () => {
    setViewportWidth(1280);
    setWindowScrollY(0);

    render(<HomeHero locale="en" />);

    const contentSiteTopbar = getContentSiteTopbar();

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');

    dispatchScroll(180);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('true');

    dispatchScroll(120);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
  });

  it('keeps inner content navigation visible on mobile downward scroll', () => {
    setViewportWidth(390);
    setWindowScrollY(0);

    render(
      <InnerPageChrome locale="en" currentPath="/dice-roller-dnd">
        <section>Dice roller content</section>
      </InnerPageChrome>,
    );

    const contentSiteTopbar = getContentSiteTopbar();

    dispatchScroll(180);
    dispatchScroll(360);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
  });

  it('hides inner content navigation on desktop downward scroll and restores it on upward scroll or at the top', () => {
    setViewportWidth(1280);
    setWindowScrollY(0);

    render(
      <InnerPageChrome locale="en" currentPath="/blog">
        <section>Blog content</section>
      </InnerPageChrome>,
    );

    const contentSiteTopbar = getContentSiteTopbar();

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');

    dispatchScroll(180);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('true');

    dispatchScroll(120);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');

    dispatchScroll(260);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('true');

    dispatchScroll(0);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
  });

  it('shows a hidden desktop content navigation when a topbar link receives focus', () => {
    setViewportWidth(1280);
    setWindowScrollY(0);

    render(<HomeHero locale="en" />);

    const contentSiteTopbar = getContentSiteTopbar();

    dispatchScroll(180);

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('true');

    fireEvent.focus(screen.getByRole('link', { name: 'Blog' }));

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
  });

  it('keeps hub content shells compatible with sticky topbars', () => {
    render(
      <InnerPageChrome locale="en" currentPath="/dice-roller-dnd">
        <section>Dice roller content</section>
      </InnerPageChrome>,
    );

    const siteShell = screen.getByText('Dice roller content').closest('main');

    expect(siteShell?.className).toContain('site-shell--allow-sticky');
    expect(siteShell?.className).not.toContain('overflow-hidden');
  });

  it('does not attach the content topbar behavior to share pages', () => {
    render(<SharePageView locale="en" imageUrl="https://example.com/token.png" />);

    expect(document.querySelector('.site-topbar')).toBeNull();
    expect(screen.getByRole('link', { name: /token maker/i })).toBeDefined();

    dispatchScroll(180);

    expect(document.querySelector('.site-topbar')).toBeNull();
  });
});
