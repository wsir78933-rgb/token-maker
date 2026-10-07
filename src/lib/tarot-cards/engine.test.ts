import { describe, expect, it } from 'vitest';

import { TAROT_CARDS } from '@/lib/tarot-cards/cards';
import {
  createTarotState,
  dealSingleCard,
  dealTarotSpread,
  revealAllTarotCards,
  revealTarotCard,
  shuffleTarotDeck,
} from '@/lib/tarot-cards/engine';
import { getTarotSpread } from '@/lib/tarot-cards/spreads';
import type { TarotSpreadId, TarotState } from '@/lib/tarot-cards/types';

const CELTIC_CROSS_ID: TarotSpreadId = 'celtic-cross';

function createSequenceRandom(values: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index];
    index += 1;
    return value ?? values[values.length - 1] ?? 0;
  };
}

function requireSuccessfulState(result: ReturnType<typeof dealSingleCard> | ReturnType<typeof dealTarotSpread>): TarotState {
  if (!result.ok) {
    throw new Error(`Expected a successful Tarot deal, received ${result.reason}.`);
  }

  return result.state;
}

describe('Tarot state creation and deck cycles', () => {
  it('creates a shuffled 78-card deck with no reading', () => {
    const state = createTarotState(createSequenceRandom([0]));
    const cardIds = state.remainingCardIds;

    expect(cardIds).toHaveLength(78);
    expect(new Set(cardIds).size).toBe(78);
    expect(new Set(cardIds)).toEqual(new Set(TAROT_CARDS.map((card) => card.id)));
    expect(state.reading).toBeNull();
  });

  it('starts a fresh 78-card cycle while preserving a hidden single reading', () => {
    const firstState = requireSuccessfulState(dealSingleCard(createTarotState(() => 0), () => 0));
    const shuffledState = shuffleTarotDeck(firstState, () => 0);

    expect(shuffledState.remainingCardIds).toHaveLength(78);
    expect(shuffledState.reading).toEqual(firstState.reading);
    expect(shuffledState.reading?.cards[0]?.revealed).toBe(false);
    expect(shuffledState.reading?.selectedPosition).toBeNull();
    expect(shuffledState.remainingCardIds).toContain(firstState.reading?.cards[0]?.cardId);
    expect(firstState.remainingCardIds).toHaveLength(77);
  });

  it('rejects random values outside [0, 1) and includes the actual value', () => {
    expect(() => createTarotState(() => 1)).toThrowError('received 1');
    expect(() => createTarotState(() => -0.1)).toThrowError('received -0.1');
    expect(() => createTarotState(() => Number.NaN)).toThrowError('received NaN');
  });
});

describe('Tarot deals', () => {
  it('deals one hidden card with injected upright orientation and no selection', () => {
    const initialState = createTarotState(() => 0);
    const result = dealSingleCard(initialState, createSequenceRandom([0, 0.99]));

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.state.remainingCardIds).toHaveLength(77);
    expect(result.state.reading).toEqual({
      mode: 'single',
      spreadId: null,
      cards: [
        {
          cardId: initialState.remainingCardIds[0],
          position: 1,
          reversed: false,
          revealed: false,
        },
      ],
      selectedPosition: null,
    });
    expect(initialState).toEqual({ remainingCardIds: initialState.remainingCardIds, reading: null });
  });

  it('deals a reversed single card when the injected orientation draw is below one half', () => {
    const result = dealSingleCard(createTarotState(() => 0), createSequenceRandom([0, 0]));

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.state.reading?.cards[0]?.reversed).toBe(true);
    expect(result.state.reading?.cards[0]?.revealed).toBe(false);
    expect(result.state.reading?.selectedPosition).toBeNull();
  });

  it('deals a spread hidden, without replacement, and fixes Celtic Cross position 2 upright', () => {
    const initialState = createTarotState(() => 0);
    const result = dealTarotSpread(initialState, CELTIC_CROSS_ID, () => 0);
    const spread = getTarotSpread(CELTIC_CROSS_ID);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.state.remainingCardIds).toHaveLength(78 - spread.positions.length);
    expect(result.state.reading?.mode).toBe('spread');
    expect(result.state.reading?.spreadId).toBe(CELTIC_CROSS_ID);
    expect(result.state.reading?.selectedPosition).toBeNull();
    expect(result.state.reading?.cards).toHaveLength(spread.positions.length);
    expect(result.state.reading?.cards.every((card) => !card.revealed)).toBe(true);
    expect(result.state.reading?.cards.find((card) => card.position === 2)?.reversed).toBe(false);
    expect(
      result.state.reading?.cards
        .filter((card) => card.position !== 2)
        .every((card) => card.reversed),
    ).toBe(true);
    expect(new Set(result.state.reading?.cards.map((card) => card.cardId)).size).toBe(
      spread.positions.length,
    );
  });

  it('returns insufficient-cards without consuming a partial deal', () => {
    const fullState = createTarotState(() => 0);
    const limitedState: TarotState = {
      remainingCardIds: fullState.remainingCardIds.slice(0, 2),
      reading: null,
    };
    let randomCalls = 0;

    const result = dealTarotSpread(limitedState, CELTIC_CROSS_ID, () => {
      randomCalls += 1;
      throw new Error('Random source must not be called for an insufficient deal.');
    });

    expect(result).toEqual({
      ok: false,
      state: limitedState,
      reason: 'insufficient-cards',
      required: 10,
      available: 2,
    });
    expect(result.state).toBe(limitedState);
    expect(randomCalls).toBe(0);
  });

  it('returns deck-exhausted without changing the state', () => {
    const exhaustedState: TarotState = { remainingCardIds: [], reading: null };
    const result = dealSingleCard(exhaustedState, () => 0);

    expect(result).toEqual({
      ok: false,
      state: exhaustedState,
      reason: 'deck-exhausted',
      required: 1,
      available: 0,
    });
    expect(result.state).toBe(exhaustedState);
  });

  it('replaces the old spread reading and clears its selection on a successful redeal', () => {
    const firstState = requireSuccessfulState(
      dealTarotSpread(createTarotState(() => 0), CELTIC_CROSS_ID, () => 0),
    );
    const selectedState = revealTarotCard(firstState, 1);
    const secondResult = dealTarotSpread(selectedState, CELTIC_CROSS_ID, () => 0);

    expect(secondResult.ok).toBe(true);
    if (!secondResult.ok) return;

    expect(secondResult.state.reading?.selectedPosition).toBeNull();
    expect(secondResult.state.reading?.cards.every((card) => !card.revealed)).toBe(true);
    expect(secondResult.state.remainingCardIds).toHaveLength(78 - 10 - 10);
  });

  it('redeals a fresh single card hidden and clears the previous selection', () => {
    const firstState = requireSuccessfulState(
      dealSingleCard(createTarotState(() => 0), createSequenceRandom([0, 0.99])),
    );
    const selectedState = revealTarotCard(firstState, 1);
    const secondResult = dealSingleCard(selectedState, createSequenceRandom([0, 0]));

    expect(secondResult.ok).toBe(true);
    if (!secondResult.ok) return;

    expect(secondResult.state.reading?.cards).toHaveLength(1);
    expect(secondResult.state.reading?.cards[0]?.revealed).toBe(false);
    expect(secondResult.state.reading?.selectedPosition).toBeNull();
    expect(secondResult.state.remainingCardIds).toHaveLength(76);
  });
});

describe('Tarot card reveal operations', () => {
  it('reveals and selects a hidden card, then selects an already revealed card', () => {
    const dealtState = requireSuccessfulState(
      dealTarotSpread(createTarotState(() => 0), CELTIC_CROSS_ID, () => 0),
    );
    const firstReveal = revealTarotCard(dealtState, 1);
    const secondReveal = revealTarotCard(firstReveal, 2);

    expect(firstReveal.reading?.cards.find((card) => card.position === 1)?.revealed).toBe(true);
    expect(firstReveal.reading?.selectedPosition).toBe(1);
    expect(secondReveal.reading?.cards.find((card) => card.position === 1)?.revealed).toBe(true);
    expect(secondReveal.reading?.cards.find((card) => card.position === 2)?.revealed).toBe(true);
    expect(secondReveal.reading?.selectedPosition).toBe(2);
    expect(dealtState.reading?.cards.every((card) => !card.revealed)).toBe(true);
  });

  it('reveals a hidden single card without consuming another card', () => {
    const dealtState = requireSuccessfulState(
      dealSingleCard(createTarotState(() => 0), createSequenceRandom([0, 0.99])),
    );
    const revealedState = revealTarotCard(dealtState, 1);

    expect(revealedState.remainingCardIds).toEqual(dealtState.remainingCardIds);
    expect(revealedState.reading?.cards[0]?.revealed).toBe(true);
    expect(revealedState.reading?.selectedPosition).toBe(1);
    expect(dealtState.reading?.cards[0]?.revealed).toBe(false);
    expect(dealtState.reading?.selectedPosition).toBeNull();
  });

  it('reveals all cards without consuming the deck or selecting a new position', () => {
    const dealtState = requireSuccessfulState(
      dealTarotSpread(createTarotState(() => 0), CELTIC_CROSS_ID, () => 0),
    );
    const selectedState = revealTarotCard(dealtState, 1);
    const revealedState = revealAllTarotCards(selectedState);

    expect(revealedState.remainingCardIds).toEqual(selectedState.remainingCardIds);
    expect(revealedState.reading?.cards.every((card) => card.revealed)).toBe(true);
    expect(revealedState.reading?.selectedPosition).toBe(1);
    expect(selectedState.reading?.cards.some((card) => !card.revealed)).toBe(true);
  });

  it('reveals a hidden single card without selecting it', () => {
    const dealtState = requireSuccessfulState(
      dealSingleCard(createTarotState(() => 0), createSequenceRandom([0, 0.99])),
    );
    const revealedState = revealAllTarotCards(dealtState);

    expect(revealedState.remainingCardIds).toEqual(dealtState.remainingCardIds);
    expect(revealedState.reading?.cards[0]?.revealed).toBe(true);
    expect(revealedState.reading?.selectedPosition).toBeNull();
  });

  it('rejects a spread state whose selected position still points to a hidden card', () => {
    const dealtState = requireSuccessfulState(
      dealTarotSpread(createTarotState(() => 0), CELTIC_CROSS_ID, () => 0),
    );
    if (dealtState.reading === null) {
      throw new Error('Expected the Celtic Cross deal to create a reading.');
    }

    const invalidState: TarotState = {
      remainingCardIds: dealtState.remainingCardIds,
      reading: {
        ...dealtState.reading,
        selectedPosition: 1,
      },
    };

    expect(() => shuffleTarotDeck(invalidState, () => 0)).toThrowError(
      'selectedPosition 1 points to a hidden card',
    );
  });

  it('returns a no-op for revealAll with no active reading', () => {
    const state = createTarotState(() => 0);

    expect(revealAllTarotCards(state)).toBe(state);
  });
});

describe('Tarot input validation', () => {
  it('rejects unknown card ids and spread ids with the received value', () => {
    const state = createTarotState(() => 0);

    expect(() => dealSingleCard({ remainingCardIds: ['missing-card'], reading: null }, () => 0)).toThrowError(
      'missing-card',
    );
    expect(() => dealTarotSpread(state, 'missing-spread' as TarotSpreadId, () => 0)).toThrowError(
      'missing-spread',
    );
    expect(() => revealTarotCard(state, 99)).toThrowError('99');
  });

  it('rejects malformed state fields with their actual values', () => {
    expect(() => dealSingleCard({ remainingCardIds: [''], reading: null }, () => 0)).toThrowError('received ""');
    expect(() => revealTarotCard({ remainingCardIds: [], reading: null }, 1)).toThrowError(
      'there is no active reading',
    );
  });
});
