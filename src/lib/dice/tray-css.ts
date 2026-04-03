/**
 * tray-css.ts — CSS 动画版骰子托盘类型层
 * 替换原来的 tray-3d.ts（去除所有 three.js / Rapier 物理依赖）
 */

import {
  rollMixedDice,
  formatMixedDiceRequest,
  type SupportedDieSides,
} from '@/lib/dice/roller';

// ─── Re-export ────────────────────────────────────────────────────────────────
export type { formatMixedDiceRequest };

// ─── Types ────────────────────────────────────────────────────────────────────

export type DiceSides = SupportedDieSides;

export interface DiceTrayRollRequest {
  rollId: string | number;
  groups: Array<{ sides: DiceSides; count: number }>;
  modifier: number;
  /** Optional seed for reproducible rolls (e.g. URL sharing) */
  seed?: number;
}

export interface DiceTrayDie {
  id: string;
  sides: DiceSides;
  value: number;
  /** CSS animation stagger offset in ms */
  delayMs: number;
}

export interface DiceTrayPlayback {
  request: DiceTrayRollRequest;
  dice: DiceTrayDie[];
  result: {
    total: number;
    allRolls: Array<{ value: number; sides: DiceSides }>;
  };
  headline: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface DiceThemeColors {
  bg: string;
  text: string;
  glow: string;
}

export const DICE_THEME: Record<DiceSides, DiceThemeColors> = {
  4:   { bg: '#8b21c0', text: '#fce8fa', glow: '#d946c7' },
  6:   { bg: '#c54810', text: '#fff2e8', glow: '#ff6820' },
  8:   { bg: '#0d7c73', text: '#f0fffe', glow: '#14b8a6' },
  10:  { bg: '#9a6800', text: '#fff7d6', glow: '#f0b820' },
  12:  { bg: '#1a4db0', text: '#e8f0ff', glow: '#3b82f6' },
  20:  { bg: '#8e1019', text: '#fce8e9', glow: '#ef4444' },
  100: { bg: '#1a6b32', text: '#e8fff0', glow: '#22c55e' },
};

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a brand new empty playback session.
 */
export function createEmptyPlayback(rollId: string, modifier = 0): DiceTrayPlayback {
  return {
    request: { rollId, groups: [], modifier },
    dice: [],
    result: { total: modifier, allRolls: [] },
    headline: modifier === 0 ? '0' : modifier.toString(),
  };
}

/**
 * Creates a DiceTrayPlayback from a roll request.
 * Returns null if there is nothing to roll.
 */
export function createDiceTrayPlayback(
  request: DiceTrayRollRequest,
): DiceTrayPlayback | null {
  const totalDice = request.groups.reduce((sum, g) => sum + g.count, 0);
  if (totalDice === 0 && request.modifier === 0) return null;

  const rng =
    request.seed !== undefined ? makeSeededRandom(request.seed) : Math.random;

  const rollResult = rollMixedDice(
    { groups: request.groups, modifier: request.modifier },
    rng,
  );

  const dice: DiceTrayDie[] = rollResult.allRolls.map((roll, i) => ({
    id: `${request.rollId}-${i}`,
    sides: roll.sides,
    value: roll.value,
    delayMs: i * 40, // Reduced stagger for faster visual
  }));

  return {
    request,
    dice,
    result: {
      total: rollResult.total,
      allRolls: rollResult.allRolls.map((r) => ({
        value: r.value,
        sides: r.sides,
      })),
    },
    headline: formatMixedDiceRequest({
      groups: request.groups,
      modifier: request.modifier,
    }),
  };
}

/**
 * Append a single die to an existing playback and roll it immediately.
 * Does not mutate the original playback.
 */
export function appendDieToPlayback(
  playback: DiceTrayPlayback,
  sides: DiceSides,
): DiceTrayPlayback {
  const value = Math.floor(Math.random() * sides) + 1;
  const dieId = `${playback.request.rollId}-append-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const newDie: DiceTrayDie = {
    id: dieId,
    sides,
    value,
    delayMs: 0, // Appended dice drop immediately
  };

  // Update request groups
  const newGroups = [...playback.request.groups];
  const groupIdx = newGroups.findIndex((g) => g.sides === sides);
  if (groupIdx >= 0) {
    newGroups[groupIdx] = { ...newGroups[groupIdx], count: newGroups[groupIdx].count + 1 };
  } else {
    newGroups.push({ sides, count: 1 });
  }
  // Sort groups by sides
  newGroups.sort((a, b) => a.sides - b.sides);

  const newRequest = { ...playback.request, groups: newGroups };

  return {
    request: newRequest,
    dice: [...playback.dice, newDie],
    result: {
      total: playback.result.total + value,
      allRolls: [...playback.result.allRolls, { value, sides }],
    },
    headline: formatMixedDiceRequest({
      groups: newGroups,
      modifier: playback.request.modifier,
    }),
  };
}

/**
 * Re-rolls all dice inside the current playback, assigning a new rollId.
 */
export function rerollPlayback(playback: DiceTrayPlayback, newRollId: string): DiceTrayPlayback {
  const nextRequest = { ...playback.request, rollId: newRollId };
  // fallback to empty if only modifier is present
  return createDiceTrayPlayback(nextRequest) || createEmptyPlayback(newRollId, playback.request.modifier);
}

/**
 * Update the modifier of an existing playback.
 */
export function updatePlaybackModifier(playback: DiceTrayPlayback, modifier: number): DiceTrayPlayback {
  const oldModifier = playback.request.modifier;
  const diff = modifier - oldModifier;
  return {
    ...playback,
    request: { ...playback.request, modifier },
    result: {
      ...playback.result,
      total: playback.result.total + diff,
    },
    headline: formatMixedDiceRequest({
      groups: playback.request.groups,
      modifier,
    }),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** LCG seeded random — matches original tray-3d.ts behaviour */
function makeSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223;
    return (s >>> 0) / 0x100000000;
  };
}
