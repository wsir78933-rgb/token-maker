// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Faq1, type Faq1Props } from '@/components/armor-creator/Faq1';

const FAQ1_PROPS = {
  eyebrow: 'Armor Creator FAQ',
  title: 'Frequently asked questions',
  description: 'Answers to common questions about the armor creator.',
  items: [
    { question: 'Can I combine armor pieces?', answer: 'Yes, combine pieces to create a look.' },
    { question: 'Can I download my design?', answer: 'Yes, download the finished design.' },
  ],
  className: 'faq-extra-class',
} satisfies Faq1Props;

afterEach(() => {
  cleanup();
});

describe('Faq1', () => {
  it('renders the supplied centered heading, description, and FAQ content', () => {
    const { container } = render(<Faq1 {...FAQ1_PROPS} />);

    expect(screen.getByText(FAQ1_PROPS.eyebrow)).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: FAQ1_PROPS.title })).toBeTruthy();
    expect(screen.getByText(FAQ1_PROPS.description)).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: FAQ1_PROPS.items[0].question })).toBeTruthy();
    expect(container.firstElementChild?.className).toContain('faq-extra-class');
  });

  it('keeps panel relationships accurate and closes the previously open item', () => {
    render(<Faq1 {...FAQ1_PROPS} />);

    const firstTrigger = screen.getByRole('button', { name: FAQ1_PROPS.items[0].question });
    const secondTrigger = screen.getByRole('button', { name: FAQ1_PROPS.items[1].question });
    const firstChevron = firstTrigger.querySelector('svg');
    const firstPanelId = firstTrigger.getAttribute('aria-controls');
    const secondPanelId = secondTrigger.getAttribute('aria-controls');

    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(firstChevron?.classList.contains('rotate-180')).toBe(false);
    expect(firstPanelId).not.toBeNull();
    expect(secondPanelId).not.toBeNull();
    expect(document.getElementById(firstPanelId as string)?.getAttribute('aria-labelledby')).toBe(
      firstTrigger.id,
    );
    expect(document.getElementById(firstPanelId as string)?.hidden).toBe(true);

    fireEvent.click(firstTrigger);

    expect(firstTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(firstChevron?.classList.contains('rotate-180')).toBe(true);
    expect(document.getElementById(firstPanelId as string)?.hidden).toBe(false);
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(secondPanelId as string)?.hidden).toBe(true);

    fireEvent.click(secondTrigger);

    expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(firstPanelId as string)?.hidden).toBe(true);
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(secondPanelId as string)?.hidden).toBe(false);

    fireEvent.click(secondTrigger);

    expect(secondTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(secondPanelId as string)?.hidden).toBe(true);
  });

  it('uses focusable native buttons and unique panel ids across instances', () => {
    render(
      <>
        <Faq1 {...FAQ1_PROPS} />
        <Faq1 {...FAQ1_PROPS} />
      </>,
    );

    const triggers = screen.getAllByRole('button');
    const panelIds = triggers.map((trigger) => trigger.getAttribute('aria-controls'));

    expect(triggers.every((trigger) => trigger instanceof HTMLButtonElement)).toBe(true);
    expect(triggers.every((trigger) => (trigger as HTMLButtonElement).type === 'button')).toBe(true);
    expect(triggers.every((trigger) => trigger.tabIndex === 0)).toBe(true);
    expect(new Set(panelIds).size).toBe(panelIds.length);
    expect(panelIds.every((panelId) => panelId !== null && document.getElementById(panelId) !== null)).toBe(
      true,
    );

    const keyboardFocusableTrigger = triggers[0] as HTMLButtonElement;
    keyboardFocusableTrigger.focus();
    expect(document.activeElement).toBe(keyboardFocusableTrigger);
    fireEvent.click(keyboardFocusableTrigger);
    expect(keyboardFocusableTrigger.getAttribute('aria-expanded')).toBe('true');
  });
});
