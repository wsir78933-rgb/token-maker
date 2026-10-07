'use client';

import type { CSSProperties } from 'react';

import { getTarotCopy } from '@/lib/tarot-cards/copy';
import { getTarotSpread, TAROT_SPREADS } from '@/lib/tarot-cards/spreads';
import type {
  TarotLocale,
  TarotSpread,
  TarotSpreadId,
} from '@/lib/tarot-cards/types';
import { cn } from '@/lib/utils';

export interface TarotSpreadPickerProps {
  locale: TarotLocale;
  selectedSpreadId: TarotSpreadId | null;
  onSelectSpread: (id: TarotSpreadId) => void;
  className?: string;
}

export interface TarotSpreadMiniMapProps {
  spread: TarotSpread;
  className?: string;
  label?: string;
}

interface NormalizedPosition {
  left: number;
  top: number;
}

function assertSpreadPositions(spread: TarotSpread): void {
  if (!Array.isArray(spread.positions) || spread.positions.length === 0) {
    throw new Error(`Tarot spread ${JSON.stringify(spread.id)} has no positions to preview.`);
  }

  const seenNumbers = new Set<number>();
  for (const position of spread.positions) {
    if (!Number.isInteger(position.number) || position.number < 1) {
      throw new RangeError(
        `Tarot spread ${spread.id} preview position must be a positive integer; received ${JSON.stringify(position.number)}.`,
      );
    }

    if (seenNumbers.has(position.number)) {
      throw new Error(`Tarot spread ${spread.id} preview contains duplicate position ${position.number}.`);
    }
    seenNumbers.add(position.number);

    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      throw new Error(
        `Tarot spread ${spread.id} position ${position.number} has invalid preview coordinates: x=${JSON.stringify(position.x)}, y=${JSON.stringify(position.y)}.`,
      );
    }
  }
}

function normalizeSpreadPositions(spread: TarotSpread): ReadonlyMap<number, NormalizedPosition> {
  assertSpreadPositions(spread);

  const xValues = spread.positions.map((position) => position.x);
  const yValues = spread.positions.map((position) => position.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const xRange = Math.max(maxX - minX, 1);
  const yRange = Math.max(maxY - minY, 1);

  return new Map(
    spread.positions.map((position) => [
      position.number,
      {
        left: 12 + ((position.x - minX) / xRange) * 76,
        top: 12 + ((position.y - minY) / yRange) * 76,
      },
    ]),
  );
}

function miniMarkerStyle(normalized: NormalizedPosition): CSSProperties {
  return {
    left: `${normalized.left}%`,
    top: `${normalized.top}%`,
    transform: 'translate(-50%, -50%)',
  };
}

function localizedSpreadName(locale: TarotLocale, spread: TarotSpread): string {
  return `${spread.name[locale]} / ${spread.name[locale === 'en' ? 'zh' : 'en']}`;
}

export function TarotSpreadMiniMap({ spread, className, label }: TarotSpreadMiniMapProps) {
  const normalizedPositions = normalizeSpreadPositions(spread);

  return (
    <div
      className={cn(
        'relative isolate min-h-20 w-full overflow-hidden rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-2',
        className,
      )}
      aria-label={label ?? `${spread.name.en} / ${spread.name.zh}`}
      data-spread-preview={spread.id}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,var(--site-accent-bg),transparent_66%)]" />
      {spread.positions.map((position) => {
        const normalized = normalizedPositions.get(position.number);
        if (normalized === undefined) {
          throw new Error(`Tarot spread ${spread.id} preview is missing position ${position.number}.`);
        }

        return (
          <span
            key={position.number}
            aria-hidden="true"
            className={cn(
              'absolute inline-flex h-7 w-5 items-center justify-center rounded-[0.3rem] border border-[var(--site-border-strong)] bg-[var(--site-panel)] text-[0.58rem] font-semibold tabular-nums text-[var(--site-accent-strong)] shadow-sm',
              position.fixedRotationDeg === 90 && 'h-5 w-7',
            )}
            style={miniMarkerStyle(normalized)}
            data-position-number={position.number}
          >
            {String(position.number).padStart(2, '0')}
          </span>
        );
      })}
    </div>
  );
}

function spreadButtonLabel(locale: TarotLocale, spread: TarotSpread): string {
  const copy = getTarotCopy(locale);
  const count = spread.positions.length;
  return `${copy.labels.chooseSpread}: ${localizedSpreadName(locale, spread)} · ${count} ${locale === 'en' ? 'cards / 张牌' : '张牌 / cards'}`;
}

function selectedSpread(selectedSpreadId: TarotSpreadId | null): TarotSpread | null {
  if (selectedSpreadId === null) return null;
  return getTarotSpread(selectedSpreadId);
}

export function TarotSpreadPicker({
  locale,
  selectedSpreadId,
  onSelectSpread,
  className,
}: TarotSpreadPickerProps) {
  if (typeof onSelectSpread !== 'function') {
    throw new TypeError(
      `Tarot spread picker onSelectSpread must be a function; received ${typeof onSelectSpread}.`,
    );
  }

  const copy = getTarotCopy(locale);
  const selectedSpreadValue = selectedSpread(selectedSpreadId);

  return (
    <section
      className={cn(
        'min-w-0 rounded-[24px] border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-4 text-[var(--site-ink)] shadow-[var(--site-card-shadow)] sm:p-5',
        className,
      )}
      aria-labelledby="tarot-spread-picker-title"
      data-testid="tarot-spread-picker"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--site-accent-strong)]">
            {copy.labels.preview}
          </p>
          <h2 id="tarot-spread-picker-title" className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--site-ink-strong)]">
            {copy.labels.chooseSpread}
          </h2>
        </div>
        {selectedSpreadValue ? (
          <span className="shrink-0 rounded-full border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] px-2.5 py-1 text-xs font-medium text-[var(--site-accent-strong)]">
            {selectedSpreadValue.positions.length}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TAROT_SPREADS.map((spread) => {
          const selected = spread.id === selectedSpreadId;
          return (
            <button
              key={spread.id}
              type="button"
              aria-label={spreadButtonLabel(locale, spread)}
              aria-pressed={selected}
              onClick={() => onSelectSpread(spread.id)}
              className={cn(
                'group flex min-h-11 min-w-0 flex-col rounded-2xl border p-2.5 text-left transition duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent-strong)]',
                'hover:-translate-y-0.5 hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-bg)]',
                selected
                  ? 'border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] ring-1 ring-[var(--site-accent-strong)]'
                  : 'border-[var(--site-border-soft)] bg-[var(--site-panel)]',
              )}
              data-selected={selected ? 'true' : 'false'}
              data-spread-id={spread.id}
            >
              <TarotSpreadMiniMap
                spread={spread}
                label={`${copy.labels.preview}: ${localizedSpreadName(locale, spread)}`}
                className="min-h-[5.25rem] transition group-hover:border-[var(--site-accent-strong)]"
              />
              <span className="mt-2 block truncate font-display text-sm font-semibold text-[var(--site-ink-strong)]">
                {spread.name[locale]}
              </span>
              <span className="mt-0.5 block truncate text-xs text-stone-500">
                {spread.name[locale === 'en' ? 'zh' : 'en']} · {spread.positions.length}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
