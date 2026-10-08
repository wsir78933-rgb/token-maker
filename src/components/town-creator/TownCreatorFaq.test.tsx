// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getTownCreatorCopy } from '@/lib/town-creator/copy';

import { TownCreatorFaq } from './TownCreatorFaq';

afterEach(cleanup);

function requireHtmlElement(elementId: string): HTMLElement {
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Town creator FAQ element is missing. id=${JSON.stringify(elementId)}.`);
  }

  return element;
}

describe('TownCreatorFaq', () => {
  it.each(['en', 'zh'] as const)('renders closed localized FAQ items and relationships for %s', (locale) => {
    const faq = getTownCreatorCopy(locale).faq;

    render(<TownCreatorFaq faq={faq} />);

    const section = requireHtmlElement('town-creator-faq');
    const heading = requireHtmlElement('town-creator-faq-heading');
    const buttons = screen.getAllByRole('button');

    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(screen.getByRole('heading', { level: 2, name: faq.title })).toBe(heading);
    expect(buttons).toHaveLength(faq.items.length);

    buttons.forEach((button, itemIndex) => {
      const answerId = button.getAttribute('aria-controls');
      if (answerId === null) {
        throw new Error(`Town creator FAQ button is missing aria-controls at index ${itemIndex}.`);
      }

      const answer = requireHtmlElement(answerId);
      expect(button.getAttribute('type')).toBe('button');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(answer.hidden).toBe(true);
      expect(answer.getAttribute('aria-labelledby')).toBe(button.id);
    });
  });

  it('opens, switches, and closes one FAQ answer at a time', () => {
    const faq = getTownCreatorCopy('en').faq;
    render(<TownCreatorFaq faq={faq} />);

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const secondButton = buttons[1];
    if (!firstButton || !secondButton) {
      throw new Error(`Town creator FAQ needs at least two items. Received length ${buttons.length}.`);
    }

    const firstAnswerId = firstButton.getAttribute('aria-controls');
    const secondAnswerId = secondButton.getAttribute('aria-controls');
    if (firstAnswerId === null || secondAnswerId === null) {
      throw new Error('Town creator FAQ buttons must expose answer controls.');
    }

    const firstAnswer = requireHtmlElement(firstAnswerId);
    const secondAnswer = requireHtmlElement(secondAnswerId);

    fireEvent.click(firstButton);
    expect(firstButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstAnswer.hidden).toBe(false);
    expect(secondButton.getAttribute('aria-expanded')).toBe('false');
    expect(secondAnswer.hidden).toBe(true);

    fireEvent.click(secondButton);
    expect(firstButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstAnswer.hidden).toBe(true);
    expect(secondButton.getAttribute('aria-expanded')).toBe('true');
    expect(secondAnswer.hidden).toBe(false);

    fireEvent.click(secondButton);
    expect(secondButton.getAttribute('aria-expanded')).toBe('false');
    expect(secondAnswer.hidden).toBe(true);
  });

  it('fails fast when FAQ items are empty', () => {
    const faq = getTownCreatorCopy('en').faq;
    const emptyFaq = { ...faq, items: [] } as unknown as typeof faq;

    expect(() => render(<TownCreatorFaq faq={emptyFaq} />)).toThrowError(
      'Town creator FAQ items must not be empty. Received length 0.',
    );
  });
});
