'use client';

import Image from 'next/image';
import { Dices } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { SiteLocale } from '@/lib/site-locale';
import { formatMixedDiceRequest, type SupportedDieSides } from '@/lib/dice/roller';
import { DICE_THEME, type DiceTrayPlayback } from '@/lib/dice/tray-css';

import { DiceAnimatedDie } from './DiceAnimatedDie';

interface DiceTrayProps {
  playback: DiceTrayPlayback | null;
  stagedGroups?: { sides: SupportedDieSides; count: number }[];
  stagedExpr?: string;
  locale: SiteLocale;
  title: string;
  getStagedDieAlt: (sides: SupportedDieSides) => string;
  getResultDieAlt: (sides: SupportedDieSides) => string;
  className?: string;
}

const breakdownLabelByLocale = {
  en: { breakdown: 'ROLL BREAKDOWN', outcome: 'OUTCOME', hint: 'Roll dice to see results here.', staged: 'Ready to roll' },
  zh: { breakdown: '投掷明细', outcome: '结果', hint: '先选择骰子，然后点击投掷。', staged: '准备投掷' },
} as const;

/**
 * DiceTray — replaces DiceTray3DLazy.
 *
 * Layout:
 * ┌─ header (title + expression) ──────────────────┐
 * │                                                │
 * │    [die]  [die]  [die]  …   (CSS animation)   │
 * │                                                │
 * ├─ footer ───────────────────────────────────────┤
 * │  ROLL BREAKDOWN  │  OUTCOME                   │
 * └────────────────────────────────────────────────┘
 */
export function DiceTray({
  playback,
  stagedGroups,
  stagedExpr,
  locale,
  title,
  getStagedDieAlt,
  getResultDieAlt,
  className,
}: DiceTrayProps) {
  const copy = breakdownLabelByLocale[locale];

  // Expand stagedGroups into individual dice for preview
  const stagedDice: { sides: SupportedDieSides; key: string }[] = [];
  if (stagedGroups) {
    for (const g of stagedGroups) {
      for (let i = 0; i < g.count; i++) {
        stagedDice.push({ sides: g.sides, key: `staged-${g.sides}-${i}` });
      }
    }
  }

  const hasPlayback = playback && playback.dice.length > 0;
  const hasStaged = stagedDice.length > 0;
  const isEmpty = !hasPlayback && !hasStaged;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden',
        'rounded-[28px] border border-white/10 bg-[#080910]',
        'shadow-[0_40px_120px_rgba(2,6,23,0.5)]',
        className,
      )}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-6 py-4">
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-stone-500">
          {title}
        </span>
        <span className="font-display text-[0.9rem] font-medium text-[#d7b46a] tracking-wide">
          {playback ? formatMixedDiceRequest({
            groups: playback.request.groups,
            modifier: playback.request.modifier,
          }) : (stagedExpr || '')}
        </span>
      </div>

      {/* ── Dice area ─────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[260px] flex-1 overflow-hidden pointer-events-none">

        {/* Background grid decoration */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {isEmpty ? (
          /* Empty state */
          <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
            <Dices className="h-10 w-10 text-stone-700" strokeWidth={1.2} />
            <p className="text-sm text-stone-600">{copy.hint}</p>
          </div>
        ) : hasPlayback ? (
          /* Rolled dice — animated scatter */
          <div className="absolute inset-0">
            {playback.dice.map((die) => (
              <DiceAnimatedDie key={die.id} die={die} getResultDieAlt={getResultDieAlt} />
            ))}
          </div>
        ) : (
          /* Staged dice — static preview grid */
          <div className="flex w-full flex-col items-center justify-center gap-4 px-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {stagedDice.map((d) => {
                const theme = DICE_THEME[d.sides];
                return (
                  <div
                    key={d.key}
                    className="relative flex flex-col items-center gap-1.5 transition-all duration-300"
                    style={{ animation: 'none' }}
                  >
                    <div
                      className="relative w-16 h-16 drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
                    >
                      <Image
                        src={`/dice/d${d.sides}.svg`}
                        alt={getStagedDieAlt(d.sides)}
                        fill
                        className="object-contain opacity-60"
                        unoptimized
                      />
                      {/* Subtle glow ring */}
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          boxShadow: `0 0 16px 4px ${theme.glow}`,
                          opacity: 0.25,
                        }}
                      />
                    </div>
                    <span className="font-display text-xs font-bold tracking-wider text-stone-500">
                      d{d.sides}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[0.72rem] uppercase tracking-[0.2em] text-stone-600 animate-pulse">
              {copy.staged}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer: Breakdown + Outcome ───────────────────────────────────── */}
      <div className="grid grid-cols-2 border-t border-white/[0.07]">

        {/* Roll breakdown */}
        <div className="border-r border-white/[0.07] px-5 py-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-stone-600">
            {copy.breakdown}
          </p>

          {playback ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {playback.result.allRolls.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/[0.06] px-2 text-sm font-semibold text-stone-200"
                >
                  {r.value}
                </span>
              ))}
              {playback.request.modifier !== 0 && (
                <span className="inline-flex h-7 items-center px-2 text-sm text-stone-500">
                  {playback.request.modifier > 0
                    ? `+${playback.request.modifier}`
                    : playback.request.modifier}
                </span>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-700">—</p>
          )}
        </div>

        {/* Outcome */}
        <div className="px-5 py-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-stone-600">
            {copy.outcome}
          </p>
          {playback ? (
            <>
              <p className="font-display mt-1 text-[2.6rem] leading-none tracking-tight text-stone-50">
                {playback.result.total}
              </p>
              <p className="mt-0.5 text-[0.78rem] text-stone-500">
                {formatMixedDiceRequest({
                  groups: playback.request.groups,
                  modifier: playback.request.modifier,
                })}
              </p>
            </>
          ) : (
            <p className="mt-2 font-display text-4xl text-stone-700">—</p>
          )}
        </div>

      </div>
    </div>
  );
}
