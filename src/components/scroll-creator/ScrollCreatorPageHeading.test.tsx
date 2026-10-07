// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCROLL_CREATOR_EDITOR_ID } from '@/lib/scroll-creator/constants';

import {
  getScrollCreatorHeroTitleParts,
  ScrollCreatorPageHeading,
} from './ScrollCreatorPageHeading';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ScrollCreatorPageHeading', () => {
  it.each(['en', 'zh'] as const)('renders the localized title emphasis and action for %s', (locale) => {
    render(<ScrollCreatorPageHeading locale={locale} />);

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('scrolls the CTA to the real editor target and uses automatic behavior for reduced motion', () => {
    const scrollIntoView = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true }) as MediaQueryList));
    render(
      <>
        <ScrollCreatorPageHeading locale="en" />
        <div id={SCROLL_CREATOR_EDITOR_ID} />
      </>,
    );
    const editor = document.getElementById(SCROLL_CREATOR_EDITOR_ID);
    if (editor === null) {
      throw new Error(`Test editor target is missing. id=${JSON.stringify(SCROLL_CREATOR_EDITOR_ID)}.`);
    }
    editor.scrollIntoView = scrollIntoView;

    fireEvent.click(screen.getByRole('button', { name: 'Create a Scroll' }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('fails fast with the locale, title, and keyword when emphasis is missing', () => {
    expect(() => getScrollCreatorHeroTitleParts('Unrelated title', 'en')).toThrow(
      'locale="en" title="Unrelated title" keyword="Parchment Scroll Creator"',
    );
  });

  it('fails fast when the editor target is missing', () => {
    render(<ScrollCreatorPageHeading locale="en" />);

    const receivedErrors: string[] = [];
    const captureError = (event: ErrorEvent): void => {
      event.preventDefault();
      receivedErrors.push(event.error instanceof Error ? event.error.message : String(event.error));
    };
    window.addEventListener('error', captureError);
    fireEvent.click(screen.getByRole('button', { name: 'Create a Scroll' }));
    window.removeEventListener('error', captureError);

    expect(receivedErrors.some((message) => message.includes(`id="${SCROLL_CREATOR_EDITOR_ID}"`))).toBe(true);
  });
});
