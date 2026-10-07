// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTarotCardMeaning } from '@/lib/tarot-cards/meanings';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import type { TarotDealtCard, TarotSpreadPosition } from '@/lib/tarot-cards/types';
import { TarotDetailsPanel } from './TarotDetailsPanel';

const spreadPosition: TarotSpreadPosition = {
  number: 1,
  label: { en: 'Present theme', zh: '当下主题' },
  description: { en: 'What is shaping the question now.', zh: '正在塑造这个问题的力量。' },
  x: 0,
  y: 0,
};

const revealedSingleCard: TarotDealtCard = {
  cardId: 'major-00-fool',
  position: 1,
  reversed: false,
  revealed: true,
};

const revealedSpreadCard: TarotDealtCard = {
  cardId: 'major-00-fool',
  position: 1,
  reversed: true,
  revealed: true,
};

afterEach(() => {
  cleanup();
});

describe('TarotDetailsPanel', () => {
  it.each(['en', 'zh'] as const)('renders the bilingual empty state in %s', (locale) => {
    const copy = getTarotCopy(locale);

    render(<TarotDetailsPanel locale={locale} selectedCard={null} position={null} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: copy.labels.details })).toBeTruthy();
    expect(screen.getByText(copy.messages.selectCardHint)).toBeTruthy();
    expect(screen.queryByTestId('tarot-position-meaning')).toBeNull();
    expect(screen.queryByTestId('tarot-card-image')).toBeNull();
  });

  it('renders all selected spread fields and both keyword groups', () => {
    const onClose = vi.fn();
    const meaning = getTarotCardMeaning(revealedSpreadCard.cardId);
    const copy = getTarotCopy('en');

    render(
      <TarotDetailsPanel
        locale="en"
        selectedCard={revealedSpreadCard}
        position={spreadPosition}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole('dialog', { name: copy.labels.selectedCard })).toBeTruthy();
    expect(screen.getByRole('heading', { name: copy.labels.selectedCard })).toBeTruthy();
    expect(screen.getByText('The Fool')).toBeTruthy();
    expect(screen.getByText(`${copy.labels.position}: 1`)).toBeTruthy();
    expect(screen.getByText(copy.labels.reversed)).toBeTruthy();
    expect(screen.getByText(spreadPosition.label.en)).toBeTruthy();
    expect(screen.getByText(spreadPosition.description.en)).toBeTruthy();
    expect(screen.getByText(copy.labels.positionMeaning)).toBeTruthy();
    expect(screen.getByText(copy.labels.uprightMeaning)).toBeTruthy();
    expect(screen.getByText(copy.labels.reversedMeaning)).toBeTruthy();
    expect(screen.getByText(meaning.upright.en)).toBeTruthy();
    expect(screen.getByText(meaning.reversed.en)).toBeTruthy();

    const cardImage = screen.getByTestId('tarot-card-image') as HTMLImageElement;
    expect(cardImage.getAttribute('width')).toBe('160');
    expect(cardImage.getAttribute('height')).toBe('240');
    expect(cardImage.className).toContain('object-contain');

    fireEvent.click(screen.getByRole('button', { name: copy.actions.close }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not invent a position meaning for a single card', () => {
    const copy = getTarotCopy('en');

    render(<TarotDetailsPanel locale="en" selectedCard={revealedSingleCard} position={null} onClose={vi.fn()} />);

    expect(screen.getByText('The Fool')).toBeTruthy();
    expect(screen.getByText(copy.labels.upright)).toBeTruthy();
    expect(screen.queryByText(copy.labels.positionMeaning)).toBeNull();
    expect(screen.queryByText(`${copy.labels.position}: 1`)).toBeNull();
  });

  it('keeps the desktop selected panel non-modal', () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    try {
      render(
        <TarotDetailsPanel
          locale="en"
          selectedCard={revealedSpreadCard}
          position={spreadPosition}
          onClose={vi.fn()}
        />,
      );

      expect(document.querySelector('[data-tarot-details-panel="true"]')?.tagName).toBe('ASIDE');
      expect(screen.queryByRole('dialog')).toBeNull();
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('uses the horizontal label for a fixed horizontal spread position', () => {
    const horizontalPosition: TarotSpreadPosition = { ...spreadPosition, fixedRotationDeg: 90 };

    render(
      <TarotDetailsPanel
        locale="en"
        selectedCard={revealedSpreadCard}
        position={horizontalPosition}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText(getTarotCopy('en').labels.horizontal)).toBeTruthy();
    expect(screen.queryByText(getTarotCopy('en').labels.reversed)).toBeNull();
    const cardImage = screen.getByTestId('tarot-card-image');
    expect(cardImage.className).toContain('absolute');
    expect(cardImage.className).toContain('rotate-90');
    expect(cardImage.parentElement?.className).toContain('md:h-[162px] md:w-[242px]');
  });

  it('closes a selected card on Escape without changing the selected card data', () => {
    const onClose = vi.fn();

    render(
      <TarotDetailsPanel
        locale="en"
        selectedCard={revealedSpreadCard}
        position={spreadPosition}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('tarot-selected-card').getAttribute('data-tarot-selected-card')).toBe('major-00-fool');
    expect(screen.getByTestId('tarot-card-image')).toBeTruthy();
  });

  it('fails fast for an unknown card id and an unrevealed selected card', () => {
    expect(() =>
      render(
        <TarotDetailsPanel
          locale="en"
          selectedCard={{ ...revealedSingleCard, cardId: 'unknown-card' }}
          position={null}
          onClose={vi.fn()}
        />,
      ),
    ).toThrow('Unknown tarot card id: "unknown-card".');

    expect(() =>
      render(
        <TarotDetailsPanel
          locale="en"
          selectedCard={{ ...revealedSingleCard, revealed: false }}
          position={null}
          onClose={vi.fn()}
        />,
      ),
    ).toThrow('revealed=false');
  });
});
