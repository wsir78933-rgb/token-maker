// @vitest-environment jsdom

import { readFile } from 'node:fs/promises';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HomeHero } from './HomeSeoContent';
import { InnerPageChrome } from './InnerPageChrome';
import { SharePageView } from './views/SharePageView';

let nextAnimationFrameId = 1;
const pendingAnimationFrames = new Map<number, FrameRequestCallback>();

function installAnimationFrameHarness() {
  nextAnimationFrameId = 1;
  pendingAnimationFrames.clear();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const animationFrameId = nextAnimationFrameId;
      nextAnimationFrameId += 1;
      pendingAnimationFrames.set(animationFrameId, callback);
      return animationFrameId;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((animationFrameId: number) => {
      pendingAnimationFrames.delete(animationFrameId);
    }),
  );
}

function flushPendingAnimationFrames() {
  while (pendingAnimationFrames.size > 0) {
    const nextPendingFrame = pendingAnimationFrames.entries().next();

    if (nextPendingFrame.done) {
      return;
    }

    const [animationFrameId, callback] = nextPendingFrame.value;
    pendingAnimationFrames.delete(animationFrameId);

    act(() => {
      callback(performance.now());
    });
  }
}

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

function expectTopbarNotToUseStickyPositioning(contentSiteTopbar: HTMLElement) {
  for (const stickyPositionClassName of ['sticky', 'top-0', 'md:sticky', 'md:top-0']) {
    expect(contentSiteTopbar.classList).not.toContain(stickyPositionClassName);
  }
}

describe('content site topbar visibility', () => {
  beforeEach(() => {
    installAnimationFrameHarness();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    setViewportWidth(1024);
    setWindowScrollY(0);
  });

  it('keeps the topbar shell server-renderable', async () => {
    const source = await readFile('src/components/site/ContentSiteTopbar.tsx', 'utf8');

    expect(source.startsWith("'use client'")).toBe(false);
    expect(source).toContain("from '@/components/site/TrackedEditorLink'");
  });

  it('keeps the homepage content navigation visible on desktop scroll', () => {
    setViewportWidth(1280);
    setWindowScrollY(0);

    render(<HomeHero locale="en" />);

    const contentSiteTopbar = getContentSiteTopbar();

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expectTopbarNotToUseStickyPositioning(contentSiteTopbar);

    dispatchScroll(180);
    flushPendingAnimationFrames();
    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expect(contentSiteTopbar.className).not.toContain('md:-translate-y-full');

    dispatchScroll(120);
    flushPendingAnimationFrames();
    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expect(contentSiteTopbar.className).not.toContain('md:-translate-y-full');
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
    flushPendingAnimationFrames();

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expectTopbarNotToUseStickyPositioning(contentSiteTopbar);
  });

  it('keeps inner content navigation visible on desktop scroll', () => {
    setViewportWidth(1280);
    setWindowScrollY(0);

    render(
      <InnerPageChrome locale="en" currentPath="/blog">
        <section>Blog content</section>
      </InnerPageChrome>,
    );

    const contentSiteTopbar = getContentSiteTopbar();

    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expectTopbarNotToUseStickyPositioning(contentSiteTopbar);

    dispatchScroll(180);
    flushPendingAnimationFrames();
    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expect(contentSiteTopbar.className).not.toContain('md:-translate-y-full');

    dispatchScroll(260);
    flushPendingAnimationFrames();
    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
    expect(contentSiteTopbar.className).not.toContain('md:-translate-y-full');

    dispatchScroll(0);
    flushPendingAnimationFrames();
    expect(contentSiteTopbar.getAttribute('data-scroll-hidden')).toBe('false');
  });

  it('keeps hub content shells scrollable with regular topbars', () => {
    render(
      <InnerPageChrome locale="en" currentPath="/dice-roller-dnd">
        <section>Dice roller content</section>
      </InnerPageChrome>,
    );

    const siteShell = screen.getByText('Dice roller content').closest('main');
    const contentSiteTopbar = getContentSiteTopbar();

    expectTopbarNotToUseStickyPositioning(contentSiteTopbar);
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
