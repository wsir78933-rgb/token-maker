// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TAROT_CARDS } from '@/lib/tarot-cards/cards';
import { getTarotSpread } from '@/lib/tarot-cards/spreads';
import type { TarotReading, TarotSpreadId } from '@/lib/tarot-cards/types';

import { TarotTable } from './TarotTable';

function createReading(
  spreadId: TarotSpreadId,
  revealedPositions: readonly number[] = [],
  selectedPosition: number | null = null,
): TarotReading {
  const spread = getTarotSpread(spreadId);
  return {
    mode: 'spread',
    spreadId,
    cards: spread.positions.map((position, index) => ({
      cardId: TAROT_CARDS[index]?.id ?? 'major-00-fool',
      position: position.number,
      reversed: position.number === 2 ? false : index % 2 === 1,
      revealed: revealedPositions.includes(position.number),
    })),
    selectedPosition,
  };
}

const singleReading: TarotReading = {
  mode: 'single',
  spreadId: null,
  cards: [
    {
      cardId: 'major-00-fool',
      position: 1,
      reversed: false,
      revealed: true,
    },
  ],
  selectedPosition: 1,
};

afterEach(() => {
  cleanup();
});

describe('TarotTable', () => {
  it('renders an empty controlled state without inventing a reading', () => {
    render(<TarotTable locale="en" reading={null} spread={getTarotSpread('celtic-cross')} onCardSelect={vi.fn()} />);

    expect(screen.getByTestId('tarot-table').getAttribute('data-mode')).toBe('empty');
    expect(screen.getByText('Choose a reading')).toBeTruthy();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('renders a single card at the intended portrait scale and reports selection', () => {
    const onCardSelect = vi.fn();
    render(<TarotTable locale="en" reading={singleReading} spread={null} onCardSelect={onCardSelect} />);

    const cardButton = screen.getByRole('button', { name: /The Fool.*愚者.*Upright/ });
    const figure = cardButton.closest('figure');
    expect(figure?.className).toContain('w-[min(250px,100%)]');
    expect(cardButton.className).toContain('aspect-[2/3]');
    expect(cardButton.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(cardButton);
    expect(onCardSelect).toHaveBeenCalledTimes(1);
    expect(onCardSelect).toHaveBeenCalledWith(1);
  });

  it('maps a spread by position, keeps hidden labels opaque, and exposes the mobile three-column grid', () => {
    const spread = getTarotSpread('annual');
    const reading = createReading('annual', [1, 7], 1);
    const onCardSelect = vi.fn();
    render(<TarotTable locale="en" reading={reading} spread={spread} onCardSelect={onCardSelect} />);

    const table = screen.getByTestId('tarot-table');
    const layoutCards = table.querySelectorAll('[data-position-layout]');
    expect(layoutCards).toHaveLength(13);
    expect(table.querySelector('.grid-cols-3')).toBeTruthy();
    expect(table.querySelector('[data-position-layout="13"]')).toBeTruthy();
    expect(table.querySelector('[data-position-layout="13"]')?.className).toContain(
      '@xl:w-[var(--tarot-card-width)]',
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(13);
    expect(screen.getAllByRole('button', { name: /Unrevealed/ })).toHaveLength(11);
    expect(screen.queryByText('The Magician')).toBeNull();

    const firstButton = screen.getByRole('button', { name: /The Fool.*愚者/ });
    expect(firstButton.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(firstButton);
    expect(onCardSelect).toHaveBeenCalledWith(1);
  });

  it('keeps natural desktop coordinate spacing for vertically stacked cards', () => {
    const spread = getTarotSpread('relationship');
    render(
      <TarotTable
        locale="en"
        reading={createReading('relationship')}
        spread={spread}
        onCardSelect={vi.fn()}
      />,
    );

    const table = screen.getByTestId('tarot-table');
    const surface = table.querySelector<HTMLElement>('div[aria-label*="Position"]');
    const firstPosition = table.querySelector<HTMLElement>('[data-position-layout="1"]');
    const secondPosition = table.querySelector<HTMLElement>('[data-position-layout="2"]');
    if (surface === null || firstPosition === null || secondPosition === null) {
      throw new Error('Relationship desktop layout did not render its surface or first positions.');
    }

    const firstTop = Number.parseFloat(firstPosition.style.getPropertyValue('--tarot-top'));
    const secondTop = Number.parseFloat(secondPosition.style.getPropertyValue('--tarot-top'));
    expect(Math.abs(firstTop - secondTop)).toBeGreaterThan(170);
    expect(surface.getAttribute('style')).toContain('--tarot-surface-height:');
    expect(Number.parseFloat(surface.style.getPropertyValue('--tarot-surface-height'))).toBeGreaterThan(1000);
  });

  it('fails fast when the controlled reading and spread cannot be joined', () => {
    const reading = createReading('celtic-cross');
    expect(() =>
      render(
        <TarotTable
          locale="en"
          reading={{ ...reading, spreadId: 'annual' }}
          spread={getTarotSpread('celtic-cross')}
          onCardSelect={vi.fn()}
        />,
      ),
    ).toThrow('does not match reading spreadId');
  });

  it.each([
    [Number.NaN, 'NaN'],
    [Number.POSITIVE_INFINITY, 'Infinity'],
  ] as const)('reports the exact invalid deal sequence value %s', (dealSequence, label) => {
    expect(() =>
      render(
        <TarotTable
          locale="en"
          reading={singleReading}
          spread={null}
          onCardSelect={vi.fn()}
          dealSequence={dealSequence}
        />,
      ),
    ).toThrow(`received ${label}`);
  });

  it('stagger-deals every spread card within the bounded effect window and remounts on a new sequence', () => {
    const spread = getTarotSpread('annual');
    const reading = createReading('annual');
    const onCardSelect = vi.fn();
    const { rerender } = render(
      <TarotTable
        locale="en"
        reading={reading}
        spread={spread}
        onCardSelect={onCardSelect}
        dealSequence={0}
        dealEffectsActive={false}
      />,
    );

    const table = screen.getByTestId('tarot-table');
    const firstFigure = table.querySelector('figure');
    if (firstFigure === null) throw new Error('Annual reading did not render a card figure.');

    rerender(
      <TarotTable
        locale="en"
        reading={reading}
        spread={spread}
        onCardSelect={onCardSelect}
        dealSequence={1}
        dealEffectsActive
      />,
    );

    const figures = Array.from(screen.getByTestId('tarot-table').querySelectorAll('figure'));
    expect(figures).toHaveLength(13);
    expect(figures.every((figure) => figure.getAttribute('data-deal-effect') === 'active')).toBe(true);
    expect(figures.every((figure) => !figure.querySelector('button')?.hasAttribute('disabled'))).toBe(true);
    expect(figures[0]?.getAttribute('data-deal-delay-ms')).toBe('0');
    expect(figures.at(-1)?.getAttribute('data-deal-delay-ms')).toBe('240');
    expect(figures.at(-1)).not.toBe(firstFigure);
  });
});
