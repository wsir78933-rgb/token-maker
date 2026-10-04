// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EMBLEM_CREATOR_EDITOR_ID,
  EmblemCreatorPageHeading,
} from '@/components/emblem-creator/EmblemCreatorPageHeading';
import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';

const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  Element.prototype.scrollIntoView = originalScrollIntoView;
  document.getElementById(EMBLEM_CREATOR_EDITOR_ID)?.remove();
});

describe('EmblemCreatorPageHeading', () => {
  it.each(['en', 'zh'] as const)('renders the localized page title and description for %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const visibleTitle = locale === 'zh' ? copy.pageTitle.replace(' | ', ' ') : copy.pageTitle;

    render(
      <EmblemCreatorPageHeading
        locale={locale}
        copy={{
          pageTitle: copy.pageTitle,
          pageDescription: copy.pageDescription,
          heroAction: copy.heroAction,
        }}
      />,
    );

    const heading = screen.getByRole('heading', { level: 1, name: visibleTitle });
    expect(heading.textContent).toBe(visibleTitle);
    expect(heading.textContent).not.toContain('|');
    const emphasizedTitle = heading.querySelector('span > span');
    expect(emphasizedTitle?.className).toContain('font-display');
    expect(emphasizedTitle?.className).toContain('italic');
    expect(emphasizedTitle?.className).toContain('tracking-normal');
    expect(screen.getByText(copy.pageDescription)).toBeTruthy();
    expect(screen.getByRole('button', { name: copy.heroAction })).toBeTruthy();
    expect(heading.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(heading.closest('section')?.className).toContain('min-h-screen');
    expect(document.querySelector('style')?.textContent).toContain('prefers-reduced-motion');
  });

  it('smoothly scrolls to the editor and removes the bounce class after the animation', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView as typeof Element.prototype.scrollIntoView;
    const editor = document.createElement('div');
    editor.id = EMBLEM_CREATOR_EDITOR_ID;
    document.body.append(editor);

    const copy = getEmblemCreatorCopy('en');
    render(
      <EmblemCreatorPageHeading
        locale="en"
        copy={{
          pageTitle: copy.pageTitle,
          pageDescription: copy.pageDescription,
          heroAction: copy.heroAction,
        }}
      />,
    );

    const action = screen.getByRole('button', { name: copy.heroAction });
    fireEvent.click(action);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(action.className).toContain('is-bouncing');
    vi.advanceTimersByTime(300);
    expect(action.className).not.toContain('is-bouncing');
  });

  it('fails fast when the editor anchor is missing', () => {
    const copy = getEmblemCreatorCopy('zh');
    render(
      <EmblemCreatorPageHeading
        locale="zh"
        copy={{
          pageTitle: copy.pageTitle,
          pageDescription: copy.pageDescription,
          heroAction: copy.heroAction,
        }}
      />,
    );

    const receivedErrors: Error[] = [];
    const captureError = (event: ErrorEvent) => {
      event.preventDefault();
      if (event.error instanceof Error) receivedErrors.push(event.error);
    };
    window.addEventListener('error', captureError);
    const action = screen.getByRole('button', { name: copy.heroAction });
    fireEvent.click(action);
    window.removeEventListener('error', captureError);

    expect(receivedErrors.map((error) => error.message)).toContain(
      `Emblem creator editor is missing. id=${JSON.stringify(EMBLEM_CREATOR_EDITOR_ID)}.`,
    );
    expect(action.className).not.toContain('is-bouncing');
  });
});
