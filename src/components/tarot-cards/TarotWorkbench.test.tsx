// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TarotWorkbench } from '@/components/tarot-cards/TarotWorkbench';
import {
  TAROT_CARD_FLIP_DURATION_MS,
  TAROT_DEAL_EFFECT_DURATION_MS,
} from '@/lib/tarot-cards/constants';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { TAROT_SPREADS } from '@/lib/tarot-cards/spreads';
import type {
  TarotDealtCard,
  TarotLocale,
  TarotReading,
  TarotSpread,
  TarotSpreadId,
  TarotSpreadPosition,
} from '@/lib/tarot-cards/types';

vi.mock(
  '@/components/tarot-cards/TarotTable',
  () => ({
    TarotTable({
      locale,
      reading,
      spread,
      onCardSelect,
      dealSequence = 0,
      dealEffectsActive = false,
    }: {
      locale: TarotLocale;
      reading: TarotReading | null;
      spread: TarotSpread | null;
      onCardSelect: (position: number) => void;
      dealSequence?: number;
      dealEffectsActive?: boolean;
    }) {
      if (reading === null) {
        return <div data-testid="tarot-empty-table">{spread?.name[locale]}</div>;
      }

      return (
        <div data-testid="tarot-table">
          <span
            data-testid="tarot-deal-effect"
            data-deal-sequence={dealSequence}
            data-deal-effects-active={dealEffectsActive ? 'true' : 'false'}
          />
          {reading.cards.map((card) => (
            <button
              key={card.position}
              type="button"
              data-testid={`tarot-card-${card.position}`}
              onClick={() => onCardSelect(card.position)}
            >
              {card.cardId} · {card.revealed ? 'revealed' : 'hidden'}
            </button>
          ))}
        </div>
      );
    },
  }),
);

vi.mock(
  '@/components/tarot-cards/TarotSpreadPicker',
  () => ({
    TarotSpreadPicker({
      locale,
      selectedSpreadId,
      onSelectSpread,
    }: {
      locale: TarotLocale;
      selectedSpreadId: TarotSpreadId;
      onSelectSpread: (id: TarotSpreadId) => void;
    }) {
      return (
        <div data-testid="tarot-spread-picker">
          {TAROT_SPREADS.map((spread) => (
            <button
              key={spread.id}
              type="button"
              data-testid={`tarot-spread-${spread.id}`}
              aria-pressed={selectedSpreadId === spread.id}
              onClick={() => onSelectSpread(spread.id)}
            >
              {spread.name[locale]}
            </button>
          ))}
        </div>
      );
    },
  }),
);

vi.mock(
  '@/components/tarot-cards/TarotDetailsPanel',
  () => ({
    TarotDetailsPanel({
      locale,
      selectedCard,
      position,
      onClose,
    }: {
      locale: TarotLocale;
      selectedCard: TarotDealtCard | null;
      position: TarotSpreadPosition | null;
      onClose: () => void;
    }) {
      const copy = getTarotCopy(locale);
      return (
        <div data-testid="tarot-details-panel">
          <p data-testid="tarot-details-value">
            {selectedCard === null ? 'empty' : `${selectedCard.cardId} · ${position?.number ?? 1}`}
          </p>
          <button type="button" onClick={onClose}>{copy.actions.close}</button>
        </div>
      );
    },
  }),
);

vi.mock(
  '@/components/tarot-cards/TarotHelpPanel',
  () => ({
    TarotHelpPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
      if (!open) return null;
      return (
        <div role="dialog">
          <button type="button" onClick={() => onOpenChange(false)}>close help</button>
        </div>
      );
    },
  }),
);

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function advanceTimers(durationMs: number): void {
  act(() => {
    vi.advanceTimersByTime(durationMs);
  });
}

function copyFor(locale: TarotLocale = 'en') {
  return getTarotCopy(locale);
}

function remainingCount(): string {
  return screen.getByTestId('tarot-remaining-count').textContent ?? '';
}

function dealButton(locale: TarotLocale = 'en'): HTMLElement {
  return screen.getByRole('button', { name: copyFor(locale).actions.dealSpread });
}

function clickMode(locale: TarotLocale, mode: 'single' | 'spread'): void {
  const copy = copyFor(locale);
  fireEvent.click(screen.getByRole('tab', { name: mode === 'single' ? copy.actions.single : copy.actions.spread }));
}

describe('TarotWorkbench', () => {
  it('keeps preview selection free and only consumes cards after an explicit deal', () => {
    const copy = copyFor();
    render(<TarotWorkbench locale="en" />);

    expect(remainingCount()).toBe('78 / 78');
    fireEvent.click(screen.getByRole('button', { name: copy.actions.changeSpread }));
    expect(screen.getByTestId('tarot-spread-picker')).toBeTruthy();
    fireEvent.click(screen.getByTestId('tarot-spread-relationship'));
    expect(remainingCount()).toBe('78 / 78');
    expect(screen.getByTestId('tarot-selected-spread').textContent).toBe('Relationship');
  });

  it.each(['en', 'zh'] as const)('deals a hidden single card, reveals it before opening details, and redeals in %s', (locale) => {
    vi.useFakeTimers();
    const copy = copyFor(locale);
    render(<TarotWorkbench locale={locale} />);
    clickMode(locale, 'single');

    fireEvent.click(screen.getByTestId('tarot-deal-button'));
    expect(remainingCount()).toBe('77 / 78');
    expect(screen.getByTestId('tarot-card-1').textContent).toContain('hidden');
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
    expect(screen.getByTestId('tarot-deal-effect').dataset.dealSequence).toBe('1');
    expect(screen.getByTestId('tarot-deal-effect').dataset.dealEffectsActive).toBe('true');

    advanceTimers(TAROT_DEAL_EFFECT_DURATION_MS);
    const firstCardId = screen.getByTestId('tarot-card-1').textContent;
    fireEvent.click(screen.getByTestId('tarot-card-1'));
    expect(screen.getByTestId('tarot-card-1').textContent).toContain('revealed');
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
    advanceTimers(TAROT_CARD_FLIP_DURATION_MS - 1);
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
    advanceTimers(1);
    expect(screen.getByTestId('tarot-details-value').textContent).not.toBe('empty');

    fireEvent.click(screen.getByRole('button', { name: copy.actions.redeal }));
    expect(remainingCount()).toBe('76 / 78');
    expect(screen.getByTestId('tarot-card-1').textContent).toContain('hidden');
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
    expect(screen.getByTestId('tarot-card-1').textContent).not.toBe(firstCardId);
    expect(screen.getByTestId('tarot-deal-effect').dataset.dealSequence).toBe('2');
  });

  it('cancels a pending hidden-card detail when a successful redeal replaces the reading', () => {
    vi.useFakeTimers();
    const copy = copyFor();
    render(<TarotWorkbench locale="en" />);
    clickMode('en', 'single');

    fireEvent.click(screen.getByTestId('tarot-deal-button'));
    advanceTimers(TAROT_DEAL_EFFECT_DURATION_MS);
    fireEvent.click(screen.getByTestId('tarot-card-1'));
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');

    fireEvent.click(screen.getByRole('button', { name: copy.actions.redeal }));
    expect(screen.getByTestId('tarot-card-1').textContent).toContain('hidden');
    advanceTimers(TAROT_CARD_FLIP_DURATION_MS);
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
  });

  it('reveals one spread card on click, reveals all without selecting another card, and closes details with focus return', async () => {
    vi.useFakeTimers();
    const copy = copyFor();
    render(<TarotWorkbench locale="en" />);
    fireEvent.click(dealButton());

    expect(remainingCount()).toBe('68 / 78');
    const firstCard = screen.getByTestId('tarot-card-1');
    expect(firstCard.textContent).toContain('hidden');
    fireEvent.click(firstCard);
    expect(firstCard.textContent).toContain('revealed');
    expect(screen.getByTestId('tarot-revealed-count').textContent).toBe('1 / 10');
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
    advanceTimers(TAROT_CARD_FLIP_DURATION_MS);
    expect(screen.getByTestId('tarot-details-value').textContent).not.toBe('empty');

    fireEvent.click(screen.getByRole('button', { name: copy.actions.revealAll }));
    expect(screen.getByTestId('tarot-revealed-count').textContent).toBe('10 / 10');
    expect(screen.getByTestId('tarot-details-value').textContent).not.toBe('empty');

    fireEvent.click(screen.getByRole('button', { name: copy.actions.close }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(document.activeElement).toBe(firstCard);
  });

  it('keeps the reading and revealed state when the deck is shuffled', () => {
    const copy = copyFor();
    render(<TarotWorkbench locale="en" />);
    fireEvent.click(dealButton());
    const firstCard = screen.getByTestId('tarot-card-1');
    fireEvent.click(firstCard);
    const firstCardText = firstCard.textContent;

    fireEvent.click(screen.getByRole('button', { name: copy.actions.shuffle }));
    expect(remainingCount()).toBe('78 / 78');
    expect(screen.getByTestId('tarot-card-1').textContent).toBe(firstCardText);
    expect(screen.getByTestId('tarot-revealed-count').textContent).toBe('1 / 10');
    expect(screen.getByRole('status').textContent).toBe(copy.messages.shuffled);
  });

  it('hides stale details while previewing another mode and preserves the old reading until deal', () => {
    vi.useFakeTimers();
    render(<TarotWorkbench locale="en" />);
    clickMode('en', 'single');
    fireEvent.click(screen.getByTestId('tarot-deal-button'));
    advanceTimers(TAROT_DEAL_EFFECT_DURATION_MS);
    fireEvent.click(screen.getByTestId('tarot-card-1'));
    advanceTimers(TAROT_CARD_FLIP_DURATION_MS);
    const beforePreview = remainingCount();
    expect(screen.getByTestId('tarot-details-value').textContent).not.toBe('empty');

    clickMode('en', 'spread');
    expect(remainingCount()).toBe(beforePreview);
    expect(screen.getByTestId('tarot-details-value').textContent).toBe('empty');
    expect(screen.getByTestId('tarot-spread-picker')).toBeTruthy();
  });

  it('retains the previous result and reports required and available counts on exhaustion', () => {
    vi.useFakeTimers();
    const copy = copyFor();
    render(<TarotWorkbench locale="en" />);
    clickMode('en', 'single');

    for (let index = 0; index < 78; index += 1) {
      fireEvent.click(screen.getByTestId('tarot-deal-button'));
    }

    expect(remainingCount()).toBe('0 / 78');
    advanceTimers(TAROT_DEAL_EFFECT_DURATION_MS);
    const sequenceBeforeFailure = screen.getByTestId('tarot-deal-effect').dataset.dealSequence;
    const previousCard = screen.getByTestId('tarot-card-1').textContent;
    fireEvent.click(screen.getByTestId('tarot-deal-button'));

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain(copy.messages.exhaustedTitle);
    expect(alert.textContent).toContain('0');
    expect(alert.textContent).toContain('1');
    expect(remainingCount()).toBe('0 / 78');
    expect(screen.getByTestId('tarot-card-1').textContent).toBe(previousCard);
    expect(screen.getByTestId('tarot-deal-effect').dataset.dealSequence).toBe(sequenceBeforeFailure);
    expect(screen.getByTestId('tarot-deal-effect').dataset.dealEffectsActive).toBe('false');
    expect(within(alert).getByRole('button', { name: copy.actions.shuffle })).toBeTruthy();

    fireEvent.click(within(alert).getByRole('button', { name: copy.actions.shuffle }));
    expect(remainingCount()).toBe('78 / 78');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each(['en', 'zh'] as const)('keeps localized tab names and supports arrow-key tab movement in %s', (locale) => {
    const copy = copyFor(locale);
    render(<TarotWorkbench locale={locale} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual([copy.actions.single, copy.actions.spread]);

    const spreadTab = screen.getByRole('tab', { name: copy.actions.spread });
    fireEvent.keyDown(spreadTab, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: copy.actions.single }).getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: copy.actions.single }));
    expect(screen.getByRole('tab', { name: copy.actions.spread }).textContent).toBe(copy.actions.spread);
  });

  it('opens and closes the help panel through its controlled boundary', () => {
    const copy = copyFor();
    render(<TarotWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: copy.actions.help }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'close help' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
