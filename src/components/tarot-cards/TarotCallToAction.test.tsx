// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TarotCallToAction } from '@/components/tarot-cards/TarotCallToAction';
import { TAROT_WORKSPACE_ID } from '@/lib/tarot-cards/constants';
import { getTarotPageContent } from '@/lib/tarot-cards/page-content';

const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
const originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'scrollIntoView',
);

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

function renderTarotCallToAction(locale: 'en' | 'zh', includeWorkspace = true): void {
  render(
    <>
      <TarotCallToAction copy={getTarotPageContent(locale).callToAction} />
      {includeWorkspace ? <div id={TAROT_WORKSPACE_ID} /> : null}
    </>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();

  if (originalMatchMediaDescriptor) {
    Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
  } else {
    Reflect.deleteProperty(window, 'matchMedia');
  }

  if (originalScrollIntoViewDescriptor) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', originalScrollIntoViewDescriptor);
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  }
});

describe('TarotCallToAction', () => {
  it.each(['en', 'zh'] as const)('renders localized copy and a workspace anchor for %s', (locale) => {
    const copy = getTarotPageContent(locale).callToAction;
    renderTarotCallToAction(locale);

    const heading = screen.getByRole('heading', { level: 2, name: copy.title });
    const link = screen.getByRole('button', { name: copy.action });

    expect(screen.getByText(copy.description)).toBeTruthy();
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe(`#${TAROT_WORKSPACE_ID}`);
    expect(link.getAttribute('aria-disabled')).toBeNull();
    expect(link.className).toContain('h-11');
    expect(link.className).toContain('rounded-full');
    expect(heading.closest('section')?.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('scrolls to the workspace with smooth behavior without dealing a card', () => {
    setReducedMotionPreference(false);
    const scrollIntoView = setScrollIntoViewSpy();
    renderTarotCallToAction('en');

    const link = screen.getByRole('button', { name: getTarotPageContent('en').callToAction.action });
    const clickWasNotCanceled = fireEvent.click(link);

    expect(clickWasNotCanceled).toBe(false);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('uses instant behavior when reduced motion is enabled', () => {
    setReducedMotionPreference(true);
    const scrollIntoView = setScrollIntoViewSpy();
    renderTarotCallToAction('zh');

    fireEvent.click(screen.getByRole('button', { name: getTarotPageContent('zh').callToAction.action }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
  });

  it('preserves modified anchor navigation', () => {
    setReducedMotionPreference(false);
    const scrollIntoView = setScrollIntoViewSpy();
    renderTarotCallToAction('en');

    const link = screen.getByRole('button', { name: getTarotPageContent('en').callToAction.action });

    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('fails fast with the workspace id and received value when the target is missing', () => {
    setReducedMotionPreference(false);
    setScrollIntoViewSpy();
    renderTarotCallToAction('en', false);

    const receivedErrors: Error[] = [];
    const captureError = (event: ErrorEvent) => {
      event.preventDefault();
      if (event.error instanceof Error) receivedErrors.push(event.error);
    };
    window.addEventListener('error', captureError);
    fireEvent.click(screen.getByRole('button', { name: getTarotPageContent('en').callToAction.action }));
    window.removeEventListener('error', captureError);

    expect(receivedErrors.map((error) => error.message)).toContain(
      `Tarot workspace target is missing. id=${JSON.stringify(TAROT_WORKSPACE_ID)}. Received null.`,
    );
  });
});
