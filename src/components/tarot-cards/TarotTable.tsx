'use client';

import type { CSSProperties } from 'react';

import { TarotCardTile, type TarotCardCaptionPlacement } from '@/components/tarot-cards/TarotCardTile';
import { TarotSpreadMiniMap } from '@/components/tarot-cards/TarotSpreadPicker';
import { getTarotCard } from '@/lib/tarot-cards/cards';
import { getTarotCopy } from '@/lib/tarot-cards/copy';
import type {
  TarotCard,
  TarotDealtCard,
  TarotLocale,
  TarotReading,
  TarotSpread,
  TarotSpreadPosition,
} from '@/lib/tarot-cards/types';
import { cn } from '@/lib/utils';

export interface TarotTableProps {
  locale: TarotLocale;
  reading: TarotReading | null;
  spread: TarotSpread | null;
  onCardSelect: (position: number) => void;
  dealSequence?: number;
  dealEffectsActive?: boolean;
  className?: string;
}

interface ResolvedTarotPosition {
  position: TarotSpreadPosition;
  dealtCard: TarotDealtCard;
  card: TarotCard;
}

interface TarotSurfaceStyle extends CSSProperties {
  '--tarot-left'?: string;
  '--tarot-top'?: string;
  '--tarot-card-width'?: string;
  '--tarot-surface-height'?: string;
}

interface DesktopSpreadLayout {
  positions: ReadonlyMap<number, { left: string; top: string }>;
  height: number;
}

const MINIMUM_SHAPE_CONTAINER_WIDTH = 576;
const CAPTION_RESERVE = 88;
const DEAL_STAGGER_CAP_MS = 240;

const SINGLE_POSITION: TarotSpreadPosition = {
  number: 1,
  label: { en: 'Single card', zh: '单牌' },
  description: { en: 'The card drawn for this reading.', zh: '本次阅读抽到的牌。' },
  x: 0,
  y: 0,
};

function spreadCardWidth(positionCount: number): number {
  if (positionCount >= 13) return 64;
  if (positionCount >= 10) return 78;
  if (positionCount >= 8) return 88;
  return 100;
}

function cardVisualWidth(position: TarotSpreadPosition, cardWidth: number): number {
  return position.fixedRotationDeg === 90 ? cardWidth * 1.5 : cardWidth;
}

function isIntentionalCelticOverlap(
  spread: TarotSpread,
  position: TarotSpreadPosition,
  otherPosition: TarotSpreadPosition,
): boolean {
  return (
    spread.id === 'celtic-cross' &&
    ((position.number === 1 && otherPosition.number === 2) ||
      (position.number === 2 && otherPosition.number === 1))
  );
}

function cardsHorizontallyOverlapAtMinimumShapeWidth(
  position: TarotSpreadPosition,
  otherPosition: TarotSpreadPosition,
  cardWidth: number,
  xRange: number,
): boolean {
  const normalizedHorizontalDistance =
    (Math.abs(position.x - otherPosition.x) / xRange) * 0.8 * MINIMUM_SHAPE_CONTAINER_WIDTH;
  const requiredHorizontalDistance =
    (cardVisualWidth(position, cardWidth) + cardVisualWidth(otherPosition, cardWidth)) / 2;
  return normalizedHorizontalDistance < requiredHorizontalDistance;
}

function verticalSpacingGaps(
  spread: TarotSpread,
  cardWidth: number,
  xRange: number,
): readonly number[] {
  return spread.positions.flatMap((position, index) =>
    spread.positions.slice(index + 1).flatMap((otherPosition) => {
      if (position.y === otherPosition.y || isIntentionalCelticOverlap(spread, position, otherPosition)) {
        return [];
      }

      if (!cardsHorizontallyOverlapAtMinimumShapeWidth(position, otherPosition, cardWidth, xRange)) {
        return [];
      }

      return [Math.abs(position.y - otherPosition.y)];
    }),
  );
}

function createDesktopSpreadLayout(spread: TarotSpread, cardWidth: number): DesktopSpreadLayout {
  if (!Array.isArray(spread.positions) || spread.positions.length === 0) {
    throw new Error(`Tarot table spread ${JSON.stringify(spread.id)} has no positions.`);
  }

  const seenNumbers = new Set<number>();
  for (const position of spread.positions) {
    if (!Number.isInteger(position.number) || position.number < 1) {
      throw new RangeError(
        `Tarot table spread ${spread.id} position must be a positive integer; received ${JSON.stringify(position.number)}.`,
      );
    }
    if (seenNumbers.has(position.number)) {
      throw new Error(`Tarot table spread ${spread.id} contains duplicate position ${position.number}.`);
    }
    seenNumbers.add(position.number);
  }

  const xValues = spread.positions.map((position) => position.x);
  const yValues = spread.positions.map((position) => position.y);
  if (xValues.some((value) => !Number.isFinite(value)) || yValues.some((value) => !Number.isFinite(value))) {
    throw new Error(`Tarot table spread ${spread.id} contains a non-finite position coordinate.`);
  }

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const xRange = Math.max(maxX - minX, 1);
  const yRange = Math.max(maxY - minY, 1);

  const verticalGaps = verticalSpacingGaps(spread, cardWidth, xRange);
  const smallestVerticalGap = Math.min(...verticalGaps.filter((gap) => gap > 0), yRange);
  const cardFootprint = cardWidth * 1.5 + CAPTION_RESERVE;
  const verticalScale = Math.max(0.75, cardFootprint / smallestVerticalGap);
  const surfaceHeight = Math.max(600, yRange * verticalScale + cardFootprint + 48);
  const firstCardCenter = 24 + cardFootprint / 2;

  return {
    positions: new Map(
      spread.positions.map((position) => [
        position.number,
        {
          left: `${10 + ((position.x - minX) / xRange) * 80}%`,
          top: `${firstCardCenter + (position.y - minY) * verticalScale}px`,
        },
      ]),
    ),
    height: surfaceHeight,
  };
}

function readDealtCardAtPosition(
  reading: TarotReading,
  position: TarotSpreadPosition,
): TarotDealtCard {
  const dealtCard = reading.cards.find((candidate) => candidate.position === position.number);
  if (dealtCard === undefined) {
    throw new Error(
      `Tarot table reading is missing a card at position ${position.number}.`,
    );
  }

  return dealtCard;
}

function assertTableReadingCards(reading: TarotReading): void {
  if (!Array.isArray(reading.cards)) {
    throw new TypeError(`Tarot table reading cards must be an array; received ${typeof reading.cards}.`);
  }

  for (const [index, dealtCard] of reading.cards.entries()) {
    if (dealtCard === null || typeof dealtCard !== 'object') {
      throw new TypeError(`Tarot table reading cards[${index}] must be an object; received ${typeof dealtCard}.`);
    }
    if (typeof dealtCard.cardId !== 'string') {
      throw new TypeError(
        `Tarot table reading cards[${index}].cardId must be a string; received ${typeof dealtCard.cardId}.`,
      );
    }
    if (!Number.isInteger(dealtCard.position) || dealtCard.position < 1) {
      throw new RangeError(
        `Tarot table reading cards[${index}].position must be a positive integer; received ${JSON.stringify(dealtCard.position)}.`,
      );
    }
    if (typeof dealtCard.reversed !== 'boolean') {
      throw new TypeError(
        `Tarot table reading cards[${index}].reversed must be a boolean; received ${typeof dealtCard.reversed}.`,
      );
    }
    if (typeof dealtCard.revealed !== 'boolean') {
      throw new TypeError(
        `Tarot table reading cards[${index}].revealed must be a boolean; received ${typeof dealtCard.revealed}.`,
      );
    }
    getTarotCard(dealtCard.cardId);
  }
}

function resolveReadingPositions(
  reading: TarotReading,
  spread: TarotSpread | null,
): readonly ResolvedTarotPosition[] {
  assertTableReadingCards(reading);

  if (reading.mode === 'single') {
    if (reading.spreadId !== null) {
      throw new Error(
        `Single Tarot table reading must have a null spreadId; received ${JSON.stringify(reading.spreadId)}.`,
      );
    }

    if (reading.cards.length !== 1) {
      throw new Error(
        `Single Tarot table reading must contain exactly 1 card; received ${reading.cards.length}.`,
      );
    }

    const position = SINGLE_POSITION;
    const dealtCard = readDealtCardAtPosition(reading, position);
    return [{ position, dealtCard, card: getTarotCard(dealtCard.cardId) }];
  }

  if (spread === null) {
    throw new Error(
      `Tarot table requires a spread for spread reading ${JSON.stringify(reading.spreadId)}.`,
    );
  }

  if (reading.spreadId !== spread.id) {
    throw new Error(
      `Tarot table spread ${JSON.stringify(spread.id)} does not match reading spreadId ${JSON.stringify(reading.spreadId)}.`,
    );
  }

  if (reading.cards.length !== spread.positions.length) {
    throw new Error(
      `Tarot table reading for spread ${JSON.stringify(spread.id)} must contain ${spread.positions.length} cards; received ${reading.cards.length}.`,
    );
  }

  const seenPositions = new Set<number>();
  const resolved = spread.positions.map((position) => {
    if (seenPositions.has(position.number)) {
      throw new Error(`Tarot table spread ${spread.id} contains duplicate position ${position.number}.`);
    }
    seenPositions.add(position.number);

    const dealtCard = readDealtCardAtPosition(reading, position);
    return { position, dealtCard, card: getTarotCard(dealtCard.cardId) };
  });

  for (const dealtCard of reading.cards) {
    if (!seenPositions.has(dealtCard.position)) {
      throw new Error(
        `Tarot table reading contains position ${dealtCard.position}, which is not defined by spread ${spread.id}.`,
      );
    }
  }

  return resolved;
}

function readingTitle(locale: TarotLocale, reading: TarotReading, spread: TarotSpread | null): string {
  if (reading.mode === 'single') return getTarotCopy(locale).actions.single;
  if (spread === null) {
    throw new Error(`Tarot table cannot name spread ${JSON.stringify(reading.spreadId)} without a spread.`);
  }
  return `${spread.name[locale]} / ${spread.name[locale === 'en' ? 'zh' : 'en']}`;
}

function readingStatus(locale: TarotLocale, resolved: readonly ResolvedTarotPosition[]): string {
  const copy = getTarotCopy(locale);
  const revealedCount = resolved.filter(({ dealtCard }) => dealtCard.revealed).length;
  return `${copy.labels.revealed}: ${revealedCount} / ${resolved.length}`;
}

function captionPlacementForDesktopPosition(
  spread: TarotSpread | null,
  position: TarotSpreadPosition,
): TarotCardCaptionPlacement {
  if (spread?.id === 'celtic-cross' && position.number === 1) {
    return 'above';
  }

  return 'below';
}

function surfaceStyle(
  position: { left: string; top: string },
  cardWidth: number,
  surfaceHeight: number,
): TarotSurfaceStyle {
  return {
    '--tarot-left': position.left,
    '--tarot-top': position.top,
    '--tarot-card-width': `${cardWidth}px`,
    '--tarot-surface-height': `${surfaceHeight}px`,
  };
}

function dealDelayMs(positionIndex: number, positionCount: number): number {
  if (positionCount <= 1) return 0;
  return Math.round((positionIndex / (positionCount - 1)) * DEAL_STAGGER_CAP_MS);
}

export function TarotTable({
  locale,
  reading,
  spread,
  onCardSelect,
  dealSequence = 0,
  dealEffectsActive = false,
  className,
}: TarotTableProps) {
  if (typeof onCardSelect !== 'function') {
    throw new TypeError(`Tarot table onCardSelect must be a function; received ${typeof onCardSelect}.`);
  }

  if (!Number.isInteger(dealSequence) || dealSequence < 0) {
    throw new RangeError(
      `Tarot table dealSequence must be a non-negative integer; received ${String(dealSequence)}.`,
    );
  }

  if (typeof dealEffectsActive !== 'boolean') {
    throw new TypeError(
      `Tarot table dealEffectsActive must be a boolean; received ${typeof dealEffectsActive}.`,
    );
  }

  const copy = getTarotCopy(locale);

  if (reading === null) {
    return (
      <section
        className={cn(
          'min-w-0 rounded-[28px] border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-5 text-[var(--site-ink)] shadow-[var(--site-card-shadow)] sm:p-7',
          className,
        )}
        aria-label={copy.messages.emptyTitle}
        data-testid="tarot-table"
        data-mode="empty"
      >
        <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--site-border-soft)] bg-[var(--site-panel)] px-6 text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--site-accent-strong)]">
            {copy.labels.preview}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--site-ink-strong)]">
            {copy.messages.emptyTitle}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone-400">
            {copy.messages.emptyDescription}
          </p>
        </div>
      </section>
    );
  }

  const resolvedPositions = resolveReadingPositions(reading, spread);
  const title = readingTitle(locale, reading, spread);
  const status = readingStatus(locale, resolvedPositions);
  const cardWidth = reading.mode === 'spread'
    ? spreadCardWidth(resolvedPositions.length)
    : 250;
  const desktopLayout = reading.mode === 'spread' && spread !== null
    ? createDesktopSpreadLayout(spread, cardWidth)
    : null;
  const surfaceContainerStyle: TarotSurfaceStyle | undefined = desktopLayout === null
    ? undefined
    : { '--tarot-surface-height': `${desktopLayout.height}px` };

  return (
    <section
        className={cn(
          '@container min-w-0 rounded-[28px] border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-4 text-[var(--site-ink)] shadow-[var(--site-card-shadow)] sm:p-6 lg:p-7',
        className,
      )}
      aria-label={title}
      data-testid="tarot-table"
      data-mode={reading.mode}
    >
      <header className="flex min-w-0 flex-wrap items-end justify-between gap-3 border-b border-[var(--site-border-soft)] pb-4">
        <div className="min-w-0">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--site-accent-strong)]">
            {reading.mode === 'spread' ? copy.labels.position : copy.labels.cardName}
          </p>
          <h2 className="mt-2 truncate font-display text-xl font-semibold tracking-tight text-stone-100 sm:text-2xl">
            {title}
          </h2>
        </div>
        <p className="shrink-0 text-xs font-medium tabular-nums text-stone-500" aria-live="polite">
          {status}
        </p>
      </header>

      {reading.mode === 'single' ? (
        <div className="flex min-w-0 flex-col items-center px-2 py-8 sm:py-10">
          <TarotCardTile
            key={`${dealSequence}-${resolvedPositions[0].position.number}`}
            locale={locale}
            card={resolvedPositions[0].card}
            dealtCard={resolvedPositions[0].dealtCard}
            position={resolvedPositions[0].position}
            onSelect={onCardSelect}
            selected={reading.selectedPosition === 1}
            size="single"
            dealEffectsActive={dealEffectsActive}
            dealDelayMs={0}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 @xl:hidden">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                {copy.labels.preview}
              </p>
              <span className="text-xs tabular-nums text-stone-500">
                {resolvedPositions.length} {locale === 'en' ? 'cards / 张牌' : '张牌 / cards'}
              </span>
            </div>
            {spread ? (
              <TarotSpreadMiniMap
                spread={spread}
                label={`${copy.labels.preview}: ${spread.name.en} / ${spread.name.zh}`}
                className="min-h-28"
              />
            ) : null}
          </div>

          <div
            className={cn(
              'mt-5 grid min-w-0 grid-cols-3 gap-x-2.5 gap-y-6 sm:gap-x-4 sm:gap-y-7',
              '@xl:relative @xl:mt-6 @xl:block @xl:min-h-[var(--tarot-surface-height)] @xl:overflow-visible',
            )}
            style={surfaceContainerStyle}
            aria-label={`${title} · ${copy.labels.position}`}
          >
            {resolvedPositions.map(({ position, dealtCard, card }, positionIndex) => {
              const layoutPosition = desktopLayout?.positions.get(position.number);
              if (layoutPosition === undefined || desktopLayout === null) {
                throw new Error(
                  `Tarot table spread ${spread?.id ?? 'unknown'} is missing layout position ${position.number}.`,
                );
              }

              const desktopWidth = cardVisualWidth(position, cardWidth);
              return (
                <div
                  key={`${dealSequence}-${position.number}`}
                  className={cn(
                    'relative min-w-0 @xl:absolute @xl:w-[var(--tarot-card-width)] @xl:left-[var(--tarot-left)] @xl:top-[var(--tarot-top)] @xl:-translate-x-1/2 @xl:-translate-y-1/2',
                    position.fixedRotationDeg === 90 && '@xl:z-30',
                  )}
                  style={surfaceStyle(layoutPosition, desktopWidth, desktopLayout.height)}
                  data-position-layout={position.number}
                >
                  <TarotCardTile
                    locale={locale}
                    card={card}
                    dealtCard={dealtCard}
                    position={position}
                    onSelect={onCardSelect}
                    selected={reading.selectedPosition === position.number}
                    size="spread"
                    captionPlacement={captionPlacementForDesktopPosition(spread, position)}
                    dealEffectsActive={dealEffectsActive}
                    dealDelayMs={dealDelayMs(positionIndex, resolvedPositions.length)}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-stone-500 @xl:hidden">
            {copy.messages.selectCardHint}
          </p>
        </>
      )}
    </section>
  );
}
