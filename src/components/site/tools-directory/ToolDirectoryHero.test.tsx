// @vitest-environment jsdom

import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { ToolDirectoryHero } from './ToolDirectoryHero';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const COMPACT_VIEWPORT_QUERY = '(max-width: 767px)';

type BrowserTestOptions = {
  reducedMotion?: boolean;
  compactViewport?: boolean;
  stageVisible?: boolean;
};

function createMediaQueryList(media: string, matches: boolean): MediaQueryList {
  return {
    media,
    matches,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList;
}

function createIntersectionObserverMock(stageVisible: boolean) {
  return vi.fn(function TestIntersectionObserver(callback: IntersectionObserverCallback) {
    const observer = {
      root: null,
      rootMargin: '0px',
      thresholds: [0],
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn(() => []),
    } as unknown as IntersectionObserver;

    observer.observe = vi.fn((target: Element) => {
      callback([{ target, isIntersecting: stageVisible } as IntersectionObserverEntry], observer);
    });

    return observer;
  });
}

function installBrowserApis({
  reducedMotion = false,
  compactViewport = false,
  stageVisible = true,
}: BrowserTestOptions = {}) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((media: string) => {
      if (media === REDUCED_MOTION_QUERY) return createMediaQueryList(media, reducedMotion);
      if (media === COMPACT_VIEWPORT_QUERY) return createMediaQueryList(media, compactViewport);

      throw new Error(`ToolDirectoryHero test received unexpected media query: ${media}`);
    }),
  );
  vi.stubGlobal('IntersectionObserver', createIntersectionObserverMock(stageVisible));
}

function readArtworkPositions() {
  const artworkFrames = document.querySelectorAll<HTMLElement>('[data-testid="tool-directory-hero"] [data-artwork-id]');
  return [...artworkFrames].map((frame) => [frame.dataset.artworkId, frame.dataset.position]);
}

function getNextImageSourcePath(imageSource: string | null) {
  if (!imageSource) {
    throw new Error('ToolDirectoryHero test could not find a source URL for its artwork image');
  }

  const sourcePath = new URL(imageSource, 'http://tools.local').searchParams.get('url');
  if (!sourcePath) {
    throw new Error(`ToolDirectoryHero test received an image URL without a source path: ${imageSource}`);
  }

  return sourcePath;
}

async function advanceCarouselBy(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function readRotationTimerIds(
  setTimeoutSpy: Mock<typeof window.setTimeout>,
): ReturnType<typeof window.setTimeout>[] {
  return setTimeoutSpy.mock.calls.flatMap(([, delay], callIndex) => {
    if (delay !== 5_000) return [];

    const timerResult = setTimeoutSpy.mock.results[callIndex];
    if (!timerResult || timerResult.type !== 'return') {
      throw new Error(`ToolDirectoryHero timer call ${callIndex} did not return a timer id`);
    }

    return [timerResult.value];
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  installBrowserApis();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ToolDirectoryHero', () => {
  it.each([
    {
      locale: 'en' as const,
      heading: 'Free tabletop & fantasy creation tools',
      hrefs: ['/', '/coat-of-arms-maker', '/weapon-creator', '/coat-of-arms-maker', '/'],
      firstAlt: 'Fantasy character token artwork 1',
    },
    {
      locale: 'zh' as const,
      heading: '免费的桌游与 奇幻创作工具',
      hrefs: ['/zh', '/zh/coat-of-arms-maker', '/zh/weapon-creator', '/zh/coat-of-arms-maker', '/zh'],
      firstAlt: '奇幻角色 Token 成品 1',
    },
  ])('renders the initial artwork fan and localized links for $locale', ({ locale, heading, hrefs, firstAlt }) => {
    const { container } = render(<ToolDirectoryHero locale={locale} />);

    expect(screen.getByRole('heading', { name: heading })).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('group', { name: locale === 'en' ? 'Featured tool artwork carousel' : '精选工具作品轮播' })).toBeTruthy();
    expect(readArtworkPositions()).toEqual([
      ['token-0', '2'],
      ['greyforge', '3'],
      ['greatblade', '4'],
      ['astral-academy', '0'],
      ['token-1', '1'],
    ]);
    expect([...container.querySelectorAll<HTMLAnchorElement>('[data-artwork-id] a')].map((link) => link.getAttribute('href'))).toEqual(
      hrefs,
    );
    expect(
      getNextImageSourcePath(container.querySelector<HTMLImageElement>(`img[alt="${firstAlt}"]`)?.getAttribute('src') ?? null),
    ).toBe('/work-gallery/-CHRu5fo-1.webp');
  });

  it('rotates whole cards every five seconds and cleans up its Strict Mode timer', async () => {
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    render(
      <StrictMode>
        <ToolDirectoryHero locale="en" />
      </StrictMode>,
    );

    const carousel = screen.getByRole('group', { name: 'Featured tool artwork carousel' });

    expect(carousel.getAttribute('data-rotation')).toBe('0');
    expect(readRotationTimerIds(setTimeoutSpy)).toHaveLength(1);
    await advanceCarouselBy(4_999);
    expect(carousel.getAttribute('data-rotation')).toBe('0');
    await advanceCarouselBy(1);
    expect(carousel.getAttribute('data-rotation')).toBe('1');
    expect(readArtworkPositions()).toEqual([
      ['token-0', '1'],
      ['greyforge', '2'],
      ['greatblade', '3'],
      ['astral-academy', '4'],
      ['token-1', '0'],
    ]);
    expect(readRotationTimerIds(setTimeoutSpy)).toHaveLength(2);

    cleanup();
    const nextRotationTimerId = readRotationTimerIds(setTimeoutSpy).at(-1);
    if (nextRotationTimerId === undefined) {
      throw new Error('ToolDirectoryHero test could not find the timer scheduled after its first rotation');
    }
    expect(clearTimeoutSpy).toHaveBeenCalledWith(nextRotationTimerId);
  });

  it('pauses while a pointer or keyboard focus is inside the artwork stage', async () => {
    render(<ToolDirectoryHero locale="en" />);

    const carousel = screen.getByRole('group', { name: 'Featured tool artwork carousel' });
    const artworkLink = screen.getByRole('link', { name: 'Token Maker artwork 1, open the related tool' });

    fireEvent.pointerEnter(carousel, { pointerType: 'mouse' });
    await advanceCarouselBy(5_000);
    expect(carousel.getAttribute('data-rotation')).toBe('0');

    fireEvent.pointerLeave(carousel, { pointerType: 'mouse' });
    act(() => artworkLink.focus());
    expect(document.activeElement).toBe(artworkLink);
    expect(carousel.getAttribute('data-motion-paused')).toBe('true');
    await advanceCarouselBy(5_000);
    expect(carousel.getAttribute('data-rotation')).toBe('0');

    act(() => artworkLink.blur());
    expect(carousel.getAttribute('data-motion-paused')).toBe('false');
    await advanceCarouselBy(5_000);
    expect(carousel.getAttribute('data-rotation')).toBe('1');
  });

  it('keeps the carousel still when reduced motion is preferred or the stage is offscreen', async () => {
    installBrowserApis({ reducedMotion: true });
    const reducedMotionView = render(<ToolDirectoryHero locale="en" />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('group', { name: 'Featured tool artwork carousel' }).getAttribute('data-motion-paused')).toBe('true');
    await advanceCarouselBy(10_000);
    expect(screen.getByRole('group', { name: 'Featured tool artwork carousel' }).getAttribute('data-rotation')).toBe('0');

    reducedMotionView.unmount();
    installBrowserApis({ stageVisible: false });
    render(<ToolDirectoryHero locale="en" />);
    expect(screen.getByRole('group', { name: 'Featured tool artwork carousel' }).getAttribute('data-motion-paused')).toBe('true');
    await advanceCarouselBy(10_000);
    expect(screen.getByRole('group', { name: 'Featured tool artwork carousel' }).getAttribute('data-rotation')).toBe('0');
  });

  it('pauses while the document is hidden and resumes after it becomes visible', async () => {
    render(<ToolDirectoryHero locale="en" />);

    const carousel = screen.getByRole('group', { name: 'Featured tool artwork carousel' });
    const documentHidden = vi.spyOn(document, 'hidden', 'get');

    documentHidden.mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(carousel.getAttribute('data-motion-paused')).toBe('true');
    await advanceCarouselBy(5_000);
    expect(carousel.getAttribute('data-rotation')).toBe('0');

    documentHidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(carousel.getAttribute('data-motion-paused')).toBe('false');
    await advanceCarouselBy(5_000);
    expect(carousel.getAttribute('data-rotation')).toBe('1');
  });

  it('removes the two far cards from the mobile tab and accessibility trees', () => {
    installBrowserApis({ compactViewport: true });
    const { container } = render(<ToolDirectoryHero locale="en" />);

    expect(screen.getAllByRole('link')).toHaveLength(3);
    const hiddenArtworkFrames = container.querySelectorAll<HTMLElement>('[aria-hidden="true"][data-artwork-id]');
    expect([...hiddenArtworkFrames].map((frame) => frame.dataset.position).sort()).toEqual(['0', '4']);
    expect([...hiddenArtworkFrames].every((frame) => frame.querySelector('a')?.tabIndex === -1)).toBe(true);
  });

  it('does not enable autoplay when required browser observation APIs are unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<ToolDirectoryHero locale="en" />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('group', { name: 'Featured tool artwork carousel' }).getAttribute('data-motion-paused')).toBe('true');
    await advanceCarouselBy(10_000);
    expect(screen.getByRole('group', { name: 'Featured tool artwork carousel' }).getAttribute('data-rotation')).toBe('0');
    expect(vi.getTimerCount()).toBe(0);
  });
});
