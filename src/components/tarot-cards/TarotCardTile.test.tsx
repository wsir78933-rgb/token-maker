// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTarotCard } from '@/lib/tarot-cards/cards';
import { getTarotSpread } from '@/lib/tarot-cards/spreads';
import type { TarotDealtCard } from '@/lib/tarot-cards/types';

import { TarotCardTile } from './TarotCardTile';

const position = getTarotSpread('celtic-cross').positions[0];
if (position === undefined) {
  throw new Error('Celtic Cross must define position 1 for the card tile test.');
}

const revealedCard: TarotDealtCard = {
  cardId: 'major-00-fool',
  position: 1,
  reversed: false,
  revealed: true,
};

const hiddenCard: TarotDealtCard = {
  ...revealedCard,
  revealed: false,
};

afterEach(() => {
  cleanup();
});

describe('TarotCardTile', () => {
  it.each(['en', 'zh'] as const)('keeps an unrevealed card opaque in %s', (locale) => {
    render(
      <TarotCardTile
        locale={locale}
        card={getTarotCard(hiddenCard.cardId)}
        dealtCard={hiddenCard}
        position={position}
        onSelect={vi.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /Unrevealed|未翻开/ });
    expect(button.getAttribute('aria-label')).not.toContain('The Fool');
    expect(button.getAttribute('aria-label')).not.toContain('愚者');
    expect(screen.getByAltText(/Unrevealed|未翻开/)).toBeTruthy();
    expect(screen.queryByText('The Fool')).toBeNull();
    expect(screen.queryByText('愚者')).toBeNull();
    expect(button.getAttribute('type')).toBe('button');
  });

  it('shows the localized card, polarity, and position when revealed', () => {
    const onSelect = vi.fn();

    render(
      <TarotCardTile
        locale="en"
        card={getTarotCard(revealedCard.cardId)}
        dealtCard={revealedCard}
        position={position}
        onSelect={onSelect}
        selected
        size="single"
      />,
    );

    const button = screen.getByRole('button', { name: /The Fool.*愚者.*Upright.*正位/ });
    expect(screen.getByText('The Fool · Upright')).toBeTruthy();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.className).toContain('aspect-[2/3]');
    expect(button.querySelector('img')?.getAttribute('src')).toContain('major-00-fool');

    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('keeps a fixed horizontal position horizontal and fails fast on mismatched input', () => {
    const crossingPosition = getTarotSpread('celtic-cross').positions[1];
    if (crossingPosition === undefined) {
      throw new Error('Celtic Cross must define position 2 for the card tile test.');
    }

    render(
      <TarotCardTile
        locale="en"
        card={getTarotCard(hiddenCard.cardId)}
        dealtCard={{ ...hiddenCard, position: 2 }}
        position={crossingPosition}
        onSelect={vi.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /Unrevealed/ });
    expect(button.className).toContain('aspect-[3/2]');
    expect(button.querySelector('[class*="rotate-90"]')).toBeTruthy();
    expect(button.querySelector('[data-card-image-frame="portrait-rotated"]')).toBeTruthy();
    expect(button.closest('[data-card-rotation]')?.getAttribute('data-card-rotation')).toBe('90');

    expect(() =>
      render(
        <TarotCardTile
          locale="en"
          card={getTarotCard(revealedCard.cardId)}
          dealtCard={{ ...revealedCard, cardId: 'major-01-magician' }}
          position={position}
          onSelect={vi.fn()}
        />,
      ),
    ).toThrow('does not match dealt card id');
  });

  it('rotates a revealed reversed portrait card through the image frame', () => {
    render(
      <TarotCardTile
        locale="en"
        card={getTarotCard(revealedCard.cardId)}
        dealtCard={{ ...revealedCard, reversed: true }}
        position={position}
        onSelect={vi.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /The Fool.*Reversed.*逆位/ });
    expect(button.querySelector('[class*="rotate-180"]')).toBeTruthy();
    expect(button.closest('[data-card-rotation]')?.getAttribute('data-card-rotation')).toBe('180');
  });

  it('keeps selection available during the finite dealing effect and keeps both card faces mounted', () => {
    const onSelect = vi.fn();

    render(
      <TarotCardTile
        locale="en"
        card={getTarotCard(hiddenCard.cardId)}
        dealtCard={hiddenCard}
        position={position}
        onSelect={onSelect}
        dealEffectsActive
        dealDelayMs={120}
      />,
    );

    const button = screen.getByRole('button', { name: /Unrevealed/ });
    const figure = button.closest('figure');
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(figure?.getAttribute('data-deal-effect')).toBe('active');
    expect(figure?.getAttribute('data-deal-delay-ms')).toBe('120');
    expect(button.querySelectorAll('[data-card-image-frame]')).toHaveLength(2);

    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
