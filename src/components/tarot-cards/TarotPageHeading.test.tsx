// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TarotPageHeading } from '@/components/tarot-cards/TarotPageHeading';
import { TAROT_WORKSPACE_ID } from '@/lib/tarot-cards/constants';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import type { SiteLocale } from '@/lib/site-locale';

const originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'scrollIntoView',
);
const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');

function setReducedMotionPreference(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn(() => ({ matches }) as MediaQueryList),
  });
}

function setScrollIntoViewSpy(): ReturnType<typeof vi.fn> {
  const scrollIntoView = vi.fn();
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: scrollIntoView,
  });
  return scrollIntoView;
}

function renderTarotHeading(locale: SiteLocale, includeWorkspace = true): void {
  render(
    <>
      <TarotPageHeading locale={locale} />
      {includeWorkspace ? <div id={TAROT_WORKSPACE_ID} /> : null}
    </>,
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();

  if (originalScrollIntoViewDescriptor) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', originalScrollIntoViewDescriptor);
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  }

  if (originalMatchMediaDescriptor) {
    Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
  } else {
    Reflect.deleteProperty(window, 'matchMedia');
  }
});

describe('TarotPageHeading', () => {
  it.each(['en', 'zh'] as const)('renders the approved hero copy and native CTA for %s', (locale) => {
    const copy = getTarotCopy(locale);
    renderTarotHeading(locale);

    const heading = screen.getByRole('heading', { level: 1, name: copy.pageTitle });
    const button = screen.getByRole('button', { name: copy.heroAction });

    expect(heading.textContent).toBe(copy.pageTitle);
    expect(screen.getByText(copy.pageDescription)).toBeTruthy();
    expect(heading.querySelector('svg')).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.tabIndex).toBe(0);
  });

  it('scrolls to the tarot workspace with smooth behavior and starts the CTA bounce', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(false);
    const scrollIntoView = setScrollIntoViewSpy();
    renderTarotHeading('en');

    const button = screen.getByRole('button', { name: getTarotCopy('en').heroAction });
    fireEvent.click(button);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(button.classList.contains('is-bouncing')).toBe(true);

    vi.advanceTimersByTime(300);
    expect(button.classList.contains('is-bouncing')).toBe(false);
  });

  it('uses instant scrolling when reduced motion is enabled', () => {
    vi.useFakeTimers();
    setReducedMotionPreference(true);
    const scrollIntoView = setScrollIntoViewSpy();
    renderTarotHeading('zh');

    fireEvent.click(screen.getByRole('button', { name: getTarotCopy('zh').heroAction }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
  });

  it('fails fast when the tarot workspace is missing', () => {
    setReducedMotionPreference(false);
    setScrollIntoViewSpy();
    renderTarotHeading('en', false);

    const receivedErrors: Error[] = [];
    const captureError = (event: ErrorEvent) => {
      event.preventDefault();
      if (event.error instanceof Error) receivedErrors.push(event.error);
    };
    window.addEventListener('error', captureError);
    fireEvent.click(screen.getByRole('button', { name: getTarotCopy('en').heroAction }));
    window.removeEventListener('error', captureError);

    expect(receivedErrors.map((error) => error.message)).toContain(
      `Tarot cards workspace is missing. id=${JSON.stringify(TAROT_WORKSPACE_ID)}.`,
    );
  });
});
