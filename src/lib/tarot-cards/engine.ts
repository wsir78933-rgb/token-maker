import { TAROT_CARDS, getTarotCard } from '@/lib/tarot-cards/cards';
import { getTarotSpread } from '@/lib/tarot-cards/spreads';

import type {
  TarotDealResult,
  TarotDealtCard,
  TarotReading,
  TarotSpread,
  TarotSpreadId,
  TarotSpreadPosition,
  TarotState,
} from '@/lib/tarot-cards/types';

const TAROT_DECK_SIZE = 78;
const TAROT_SPREAD_IDS: readonly TarotSpreadId[] = [
  'celtic-cross',
  'cross-and-triangle',
  'tetraktys',
  'planetary',
  'astrological',
  'relationship',
  'star-guide',
  'birthday',
  'mandala',
  'dream-exploration',
  'tree-of-life',
  'past-life',
  'true-love',
  'never-too-late',
  'annual',
];

type RandomSource = () => number;

export function createTarotState(random?: RandomSource): TarotState {
  const randomSource = requireRandomSource(random);
  const deckCardIds = readDeckCardIds();

  return {
    remainingCardIds: shuffleCardIds(deckCardIds, randomSource),
    reading: null,
  };
}

export function shuffleTarotDeck(state: TarotState, random?: RandomSource): TarotState {
  assertTarotState(state);

  const randomSource = requireRandomSource(random);
  const deckCardIds = readDeckCardIds();

  return {
    remainingCardIds: shuffleCardIds(deckCardIds, randomSource),
    reading: copyReading(state.reading),
  };
}

export function dealSingleCard(state: TarotState, random?: RandomSource): TarotDealResult {
  assertTarotState(state);

  const randomSource = requireRandomSource(random);
  if (state.remainingCardIds.length === 0) {
    return createDealFailure(state, 1, 'deck-exhausted');
  }

  const drawnCard = takeRandomCard(state.remainingCardIds, randomSource);
  const reading: TarotReading = {
    mode: 'single',
    spreadId: null,
    cards: [
      {
        cardId: drawnCard.cardId,
        position: 1,
        reversed: readRandomValue(randomSource) < 0.5,
        revealed: false,
      },
    ],
    selectedPosition: null,
  };

  return {
    ok: true,
    state: {
      remainingCardIds: drawnCard.remainingCardIds,
      reading,
    },
  };
}

export function dealTarotSpread(
  state: TarotState,
  spreadId: TarotSpreadId,
  random?: RandomSource,
): TarotDealResult {
  assertTarotState(state);

  const spread = readTarotSpread(spreadId);
  const required = spread.positions.length;
  const randomSource = requireRandomSource(random);

  if (state.remainingCardIds.length === 0) {
    return createDealFailure(state, required, 'deck-exhausted');
  }

  if (state.remainingCardIds.length < required) {
    return createDealFailure(state, required, 'insufficient-cards');
  }

  const availableCardIds = [...state.remainingCardIds];
  const cards: TarotDealtCard[] = [];

  for (const position of spread.positions) {
    const drawnCard = takeRandomCard(availableCardIds, randomSource);
    availableCardIds.splice(0, availableCardIds.length, ...drawnCard.remainingCardIds);

    cards.push({
      cardId: drawnCard.cardId,
      position: position.number,
      reversed: reversedForPosition(position, randomSource),
      revealed: false,
    });
  }

  return {
    ok: true,
    state: {
      remainingCardIds: availableCardIds,
      reading: {
        mode: 'spread',
        spreadId: spread.id,
        cards,
        selectedPosition: null,
      },
    },
  };
}

export function revealTarotCard(state: TarotState, position: number): TarotState {
  assertTarotState(state);

  if (!Number.isInteger(position) || position < 1) {
    throw new RangeError(`Tarot card position must be a positive integer; received ${describeValue(position)}.`);
  }

  if (state.reading === null) {
    throw new Error(`Cannot reveal Tarot card at position ${position}: there is no active reading.`);
  }

  const cardIndex = state.reading.cards.findIndex((card) => card.position === position);
  if (cardIndex === -1) {
    throw new Error(`Tarot reading has no card at position ${position}.`);
  }

  const cards = state.reading.cards.map((card, index) => {
    if (index !== cardIndex || card.revealed) {
      return { ...card };
    }

    return { ...card, revealed: true };
  });

  return {
    remainingCardIds: [...state.remainingCardIds],
    reading: {
      ...state.reading,
      cards,
      selectedPosition: position,
    },
  };
}

export function revealAllTarotCards(state: TarotState): TarotState {
  assertTarotState(state);

  if (state.reading === null) {
    return state;
  }

  return {
    remainingCardIds: [...state.remainingCardIds],
    reading: {
      ...state.reading,
      cards: state.reading.cards.map((card) => ({ ...card, revealed: true })),
    },
  };
}

function readDeckCardIds(): string[] {
  if (!Array.isArray(TAROT_CARDS)) {
    throw new Error(`Tarot card catalog must be an array; received ${describeValue(TAROT_CARDS)}.`);
  }

  if (TAROT_CARDS.length !== TAROT_DECK_SIZE) {
    throw new Error(
      `Tarot card catalog must contain ${TAROT_DECK_SIZE} cards; received ${TAROT_CARDS.length}.`,
    );
  }

  const cardIds: string[] = [];
  const seenCardIds = new Set<string>();

  for (const [index, card] of TAROT_CARDS.entries()) {
    if (card === null || typeof card !== 'object') {
      throw new Error(`Tarot card catalog entry ${index} must be an object; received ${describeValue(card)}.`);
    }

    const cardId = card.id;
    assertKnownCardId(cardId, `Tarot card catalog entry ${index}`);
    if (seenCardIds.has(cardId)) {
      throw new Error(`Tarot card catalog contains duplicate card id ${describeValue(cardId)}.`);
    }

    seenCardIds.add(cardId);
    cardIds.push(cardId);
  }

  return cardIds;
}

function requireRandomSource(random: RandomSource | undefined): RandomSource {
  if (random === undefined) {
    return Math.random;
  }

  if (typeof random !== 'function') {
    throw new TypeError(`Tarot random source must be a function; received ${describeValue(random)}.`);
  }

  return random;
}

function readRandomValue(random: RandomSource): number {
  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError(`Tarot random source must return a finite number in [0, 1); received ${describeValue(value)}.`);
  }

  return value;
}

function randomIndex(random: RandomSource, length: number): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError(`Tarot random index length must be a positive integer; received ${describeValue(length)}.`);
  }

  return Math.floor(readRandomValue(random) * length);
}

function shuffleCardIds(cardIds: readonly string[], random: RandomSource): string[] {
  const shuffledCardIds = [...cardIds];

  for (let index = shuffledCardIds.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(random, index + 1);
    [shuffledCardIds[index], shuffledCardIds[swapIndex]] = [
      shuffledCardIds[swapIndex],
      shuffledCardIds[index],
    ];
  }

  return shuffledCardIds;
}

function takeRandomCard(
  cardIds: readonly string[],
  random: RandomSource,
): { cardId: string; remainingCardIds: string[] } {
  const cardIndex = randomIndex(random, cardIds.length);
  const cardId = cardIds[cardIndex];
  if (cardId === undefined) {
    throw new Error(`Tarot card draw selected missing index ${cardIndex} from ${cardIds.length} cards.`);
  }

  const remainingCardIds = [...cardIds];
  remainingCardIds.splice(cardIndex, 1);
  return { cardId, remainingCardIds };
}

function reversedForPosition(position: TarotSpreadPosition, random: RandomSource): boolean {
  if (position.fixedRotationDeg === 90) {
    return false;
  }

  return readRandomValue(random) < 0.5;
}

function createDealFailure(
  state: TarotState,
  required: number,
  reason: 'insufficient-cards' | 'deck-exhausted',
): TarotDealResult {
  return {
    ok: false,
    state,
    reason,
    required,
    available: state.remainingCardIds.length,
  };
}

function copyReading(reading: TarotReading | null): TarotReading | null {
  if (reading === null) {
    return null;
  }

  return {
    ...reading,
    cards: reading.cards.map((card) => ({ ...card })),
  };
}

function assertTarotState(state: TarotState): void {
  const stateRecord = requireRecord(state, 'Tarot state');
  const remainingCardIds = stateRecord.remainingCardIds;
  if (!Array.isArray(remainingCardIds)) {
    throw new TypeError(
      `Tarot state remainingCardIds must be an array; received ${describeValue(remainingCardIds)}.`,
    );
  }

  const seenRemainingCardIds = new Set<string>();
  for (const [index, cardId] of remainingCardIds.entries()) {
    assertKnownCardId(cardId, `Tarot state remainingCardIds[${index}]`);
    if (seenRemainingCardIds.has(cardId)) {
      throw new Error(`Tarot state contains duplicate remaining card id ${describeValue(cardId)}.`);
    }

    seenRemainingCardIds.add(cardId);
  }

  const reading = stateRecord.reading;
  if (reading === null) {
    return;
  }

  assertTarotReading(reading);
}

function assertTarotReading(reading: unknown): asserts reading is TarotReading {
  const readingRecord = requireRecord(reading, 'Tarot reading');
  const mode = readingRecord.mode;
  const cards = readingRecord.cards;
  const selectedPosition = readingRecord.selectedPosition;

  if (mode !== 'single' && mode !== 'spread') {
    throw new Error(`Tarot reading mode must be "single" or "spread"; received ${describeValue(mode)}.`);
  }

  if (!Array.isArray(cards)) {
    throw new TypeError(`Tarot reading cards must be an array; received ${describeValue(cards)}.`);
  }

  if (selectedPosition !== null && typeof selectedPosition !== 'number') {
    throw new TypeError(
      `Tarot reading selectedPosition must be null or a number; received ${describeValue(selectedPosition)}.`,
    );
  }

  if (selectedPosition !== null && (!Number.isInteger(selectedPosition) || selectedPosition < 1)) {
    throw new RangeError(
      `Tarot reading selectedPosition must be null or a positive integer; received ${describeValue(selectedPosition)}.`,
    );
  }

  const dealtCards = cards.map((card, index) => readDealtCard(card, index));
  const cardIds = new Set<string>();
  const positions = new Set<number>();
  for (const card of dealtCards) {
    if (cardIds.has(card.cardId)) {
      throw new Error(`Tarot reading contains duplicate dealt card id ${describeValue(card.cardId)}.`);
    }

    if (positions.has(card.position)) {
      throw new Error(`Tarot reading contains duplicate position ${card.position}.`);
    }

    cardIds.add(card.cardId);
    positions.add(card.position);
  }

  if (mode === 'single') {
    assertSingleReading(readingRecord, dealtCards, selectedPosition);
    return;
  }

  const spreadId = readingRecord.spreadId;
  const spread = readTarotSpread(spreadId);
  if (dealtCards.length !== spread.positions.length) {
    throw new Error(
      `Tarot reading for spread ${describeValue(spread.id)} must contain ${spread.positions.length} cards; received ${dealtCards.length}.`,
    );
  }

  const spreadPositions = new Set(spread.positions.map((position) => position.number));
  for (const position of positions) {
    if (!spreadPositions.has(position)) {
      throw new Error(`Tarot reading contains position ${position}, which is not defined by spread ${spread.id}.`);
    }
  }

  if (selectedPosition !== null && !positions.has(selectedPosition)) {
    throw new Error(`Tarot reading selectedPosition ${selectedPosition} is not in spread ${spread.id}.`);
  }

  if (selectedPosition !== null) {
    const selectedCard = dealtCards.find((card) => card.position === selectedPosition);
    if (selectedCard === undefined) {
      throw new Error(`Tarot reading selectedPosition ${selectedPosition} has no dealt card.`);
    }

    if (!selectedCard.revealed) {
      throw new Error(
        `Tarot reading selectedPosition ${selectedPosition} points to a hidden card; reveal it before selecting.`,
      );
    }
  }
}

function readDealtCard(value: unknown, index: number): TarotDealtCard {
  const cardRecord = requireRecord(value, `Tarot reading cards[${index}]`);
  const cardId = cardRecord.cardId;
  assertKnownCardId(cardId, `Tarot reading cards[${index}]`);

  const position = cardRecord.position;
  if (typeof position !== 'number' || !Number.isInteger(position) || position < 1) {
    throw new RangeError(
      `Tarot reading cards[${index}] position must be a positive integer; received ${describeValue(position)}.`,
    );
  }

  const reversed = cardRecord.reversed;
  if (typeof reversed !== 'boolean') {
    throw new TypeError(
      `Tarot reading cards[${index}] reversed must be a boolean; received ${describeValue(cardRecord.reversed)}.`,
    );
  }

  const revealed = cardRecord.revealed;
  if (typeof revealed !== 'boolean') {
    throw new TypeError(
      `Tarot reading cards[${index}] revealed must be a boolean; received ${describeValue(cardRecord.revealed)}.`,
    );
  }

  return {
    cardId,
    position,
    reversed,
    revealed,
  };
}

function assertSingleReading(
  readingRecord: Record<string, unknown>,
  dealtCards: readonly TarotDealtCard[],
  selectedPosition: unknown,
): void {
  if (readingRecord.spreadId !== null) {
    throw new Error(
      `Single Tarot reading spreadId must be null; received ${describeValue(readingRecord.spreadId)}.`,
    );
  }

  if (dealtCards.length !== 1) {
    throw new Error(`Single Tarot reading must contain exactly 1 card; received ${dealtCards.length}.`);
  }

  const [card] = dealtCards;
  if (card.position !== 1) {
    throw new Error(`Single Tarot reading card position must be 1; received ${card.position}.`);
  }

  if (!card.revealed && selectedPosition !== null) {
    throw new Error(
      `Single Tarot reading selectedPosition ${describeValue(selectedPosition)} points to a hidden card; reveal it before selecting.`,
    );
  }

  if (selectedPosition !== null && selectedPosition !== 1) {
    throw new Error(`Single Tarot reading selectedPosition must be 1 or null; received ${describeValue(selectedPosition)}.`);
  }
}

function readTarotSpread(spreadId: unknown): TarotSpread {
  if (!isTarotSpreadId(spreadId)) {
    throw new Error(`Unknown Tarot spread id ${describeValue(spreadId)}.`);
  }

  const spread = getTarotSpread(spreadId);
  if (spread === undefined || spread === null) {
    throw new Error(`Tarot spread catalog has no spread for id ${describeValue(spreadId)}.`);
  }

  assertTarotSpread(spread);
  return spread;
}

function assertTarotSpread(spread: TarotSpread): void {
  if (!Array.isArray(spread.positions) || spread.positions.length === 0) {
    throw new Error(`Tarot spread ${describeValue(spread.id)} must define at least one position.`);
  }

  const seenPositions = new Set<number>();
  for (const [index, position] of spread.positions.entries()) {
    if (!Number.isInteger(position.number) || position.number < 1) {
      throw new RangeError(
        `Tarot spread ${spread.id} position ${index} must use a positive integer number; received ${describeValue(position.number)}.`,
      );
    }

    if (seenPositions.has(position.number)) {
      throw new Error(`Tarot spread ${spread.id} contains duplicate position ${position.number}.`);
    }

    if (position.fixedRotationDeg !== undefined && position.fixedRotationDeg !== 90) {
      throw new Error(
        `Tarot spread ${spread.id} position ${position.number} has unsupported fixedRotationDeg ${describeValue(position.fixedRotationDeg)}.`,
      );
    }

    seenPositions.add(position.number);
  }
}

function isTarotSpreadId(value: unknown): value is TarotSpreadId {
  return typeof value === 'string' && TAROT_SPREAD_IDS.includes(value as TarotSpreadId);
}

function assertKnownCardId(value: unknown, context: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${context} must contain a non-empty card id; received ${describeValue(value)}.`);
  }

  const card = getTarotCard(value);
  if (card === undefined || card === null) {
    throw new Error(`${context} contains unknown Tarot card id ${describeValue(value)}.`);
  }
}

function requireRecord(value: unknown, context: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${context} must be an object; received ${describeValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function describeValue(value: unknown): string {
  return typeof value === 'string' ? JSON.stringify(value) : String(value);
}
