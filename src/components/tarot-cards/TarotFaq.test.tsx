// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { TarotFaq } from '@/components/tarot-cards/TarotFaq';
import { getTarotPageContent } from '@/lib/tarot-cards/page-content';

afterEach(() => {
  cleanup();
});

describe('TarotFaq', () => {
  it.each(['en', 'zh'] as const)('renders localized heading and all FAQ items for %s', (locale) => {
    const copy = getTarotPageContent(locale).faq;
    render(<TarotFaq copy={copy} />);

    expect(screen.getByText(copy.eyebrow)).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: copy.title })).toBeTruthy();
    expect(screen.getByText(copy.description)).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(copy.items.length);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();

    copy.items.forEach((item) => {
      expect(screen.getByRole('button', { name: item.question })).toBeTruthy();
      expect(screen.getByText(item.answer).closest('[hidden]')).not.toBeNull();
    });
  });

  it('keeps one panel open, closes it on repeated activation, and keeps native keyboard semantics', () => {
    const copy = getTarotPageContent('en').faq;
    render(<TarotFaq copy={copy} />);

    const firstTrigger = screen.getByRole('button', { name: copy.items[0].question });
    const secondTrigger = screen.getByRole('button', { name: copy.items[1].question });
    const firstPanelId = firstTrigger.getAttribute('aria-controls');
    const secondPanelId = secondTrigger.getAttribute('aria-controls');

    expect(firstTrigger).toBeInstanceOf(HTMLButtonElement);
    expect(firstTrigger.getAttribute('type')).toBe('button');
    expect(firstTrigger.tabIndex).toBe(0);
    expect(firstTrigger.className).toContain('min-h-11');
    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(firstPanelId).not.toBeNull();
    expect(secondPanelId).not.toBeNull();
    expect(firstPanelId).not.toBe(secondPanelId);
    expect(document.getElementById(firstPanelId as string)?.hidden).toBe(true);

    firstTrigger.focus();
    expect(document.activeElement).toBe(firstTrigger);
    fireEvent.click(firstTrigger);

    expect(firstTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(firstPanelId as string)?.hidden).toBe(false);
    expect(document.getElementById(firstPanelId as string)?.getAttribute('aria-labelledby')).toBe(
      firstTrigger.id,
    );
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(secondTrigger);

    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(firstPanelId as string)?.hidden).toBe(true);
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(secondPanelId as string)?.hidden).toBe(false);

    fireEvent.click(secondTrigger);

    expect(secondTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(secondPanelId as string)?.hidden).toBe(true);
  });

  it('keeps ids unique across FAQ instances', () => {
    const copy = getTarotPageContent('zh').faq;
    render(
      <>
        <TarotFaq copy={copy} />
        <TarotFaq copy={copy} />
      </>,
    );

    const triggers = screen.getAllByRole('button');
    const panelIds = triggers.map((trigger) => trigger.getAttribute('aria-controls'));

    expect(new Set(panelIds).size).toBe(panelIds.length);
    expect(panelIds.every((panelId) => panelId !== null && document.getElementById(panelId) !== null)).toBe(
      true,
    );
  });

  it('fails fast when the FAQ items are empty', () => {
    const copy = getTarotPageContent('en').faq;
    const emptyCopy = { ...copy, items: [] };

    expect(() => render(<TarotFaq copy={emptyCopy} />)).toThrow(
      'Tarot FAQ items must not be empty. Received length 0.',
    );
  });
});
