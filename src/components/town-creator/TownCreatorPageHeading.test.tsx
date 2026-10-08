// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTownCreatorCopy, TOWN_CREATOR_EDITOR_ID } from '@/lib/town-creator/copy';

import { TownCreatorPageHeading } from './TownCreatorPageHeading';

function getHeroProps(locale: 'en' | 'zh') {
  const copy = getTownCreatorCopy(locale);

  return {
    locale,
    heading: copy.heading,
    description: copy.description,
    emphasis: copy.heroEmphasis,
    action: copy.heroAction,
  };
}

const englishProps = getHeroProps('en');
const chineseProps = getHeroProps('zh');

afterEach(() => {
  document.getElementById(TOWN_CREATOR_EDITOR_ID)?.remove();
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('TownCreatorPageHeading', () => {
  it('renders the emphasized keyword, description, and CTA for both locales', () => {
    const { unmount } = render(<TownCreatorPageHeading {...englishProps} />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(englishProps.heading);
    expect(screen.getByRole('heading', { level: 1 }).querySelector('span')?.textContent).toBe(
      englishProps.emphasis,
    );
    expect(screen.getByText(englishProps.description)).toBeTruthy();
    expect(screen.getByRole('button', { name: englishProps.action })).toBeTruthy();

    unmount();
    render(<TownCreatorPageHeading {...chineseProps} />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(chineseProps.heading);
    expect(screen.getByRole('heading', { level: 1 }).querySelector('span')?.textContent).toBe(
      chineseProps.emphasis,
    );
    expect(screen.getByRole('button', { name: chineseProps.action })).toBeTruthy();
  });

  it('scrolls to the public editor id with smooth behavior by default', () => {
    const editor = document.createElement('div');
    editor.id = TOWN_CREATOR_EDITOR_ID;
    editor.scrollIntoView = vi.fn();
    document.body.append(editor);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: false })),
    });
    render(<TownCreatorPageHeading {...englishProps} />);

    fireEvent.click(screen.getByRole('button', { name: englishProps.action }));

    expect(editor.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('uses auto scroll behavior when reduced motion is requested', () => {
    const editor = document.createElement('div');
    editor.id = TOWN_CREATOR_EDITOR_ID;
    editor.scrollIntoView = vi.fn();
    document.body.append(editor);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    });
    render(<TownCreatorPageHeading {...englishProps} />);

    fireEvent.click(screen.getByRole('button', { name: englishProps.action }));

    expect(editor.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
  });

  it('fails fast when the editor is missing', () => {
    render(<TownCreatorPageHeading {...englishProps} />);
    const receivedErrors: Error[] = [];
    const handleError = (event: ErrorEvent) => {
      if (event.error instanceof Error) {
        receivedErrors.push(event.error);
      }
      event.preventDefault();
    };
    window.addEventListener('error', handleError);

    fireEvent.click(screen.getByRole('button', { name: englishProps.action }));

    window.removeEventListener('error', handleError);
    expect(receivedErrors[0]?.message).toBe(
      `Town creator editor is missing. id=${JSON.stringify(TOWN_CREATOR_EDITOR_ID)}.`,
    );
  });

  it('fails fast when the emphasized keyword is absent from the heading', () => {
    expect(() =>
      render(
        <TownCreatorPageHeading
          {...englishProps}
          emphasis="Missing keyword"
        />,
      ),
    ).toThrow('Town creator hero heading is missing emphasis');
  });
});
