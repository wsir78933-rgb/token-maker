import type { CoatField, FieldDivision, FieldPattern, FieldRegionId, FieldRegionStyle } from './types';
import { assertFieldPatternConfig } from './field-pattern';

export interface ResolvedFieldRegion {
  id: FieldRegionId;
  style: FieldRegionStyle & Required<Pick<FieldRegionStyle, 'colors' | 'pattern' | 'patternScale'>>;
}

const supportedRegionIds: Readonly<Record<FieldDivision, readonly FieldRegionId[]>> = {
  solid: ['overall'],
  'per-pale': ['dexter', 'sinister'],
  'per-fess': ['chief', 'base'],
  'per-bend': ['bend-upper', 'bend-lower'],
  'per-bend-sinister': ['bend-sinister-upper', 'bend-sinister-lower'],
  'per-chevron': ['chevron-chief', 'chevron-base'],
  quarterly: ['q1', 'q2', 'q3', 'q4'],
  gyronny: ['gyron-1', 'gyron-2', 'gyron-3', 'gyron-4', 'gyron-5', 'gyron-6', 'gyron-7', 'gyron-8'],
  'tierced-per-pale': ['tierced-pale-1', 'tierced-pale-2', 'tierced-pale-3'],
  'tierced-per-fess': ['tierced-fess-1', 'tierced-fess-2', 'tierced-fess-3'],
  'per-saltire': ['saltire-chief', 'saltire-dexter', 'saltire-base', 'saltire-sinister'],
  barry: ['bar-1', 'bar-2', 'bar-3', 'bar-4', 'bar-5'],
  paly: ['paly-1', 'paly-2', 'paly-3', 'paly-4', 'paly-5'],
  bendy: ['bend-1', 'bend-2', 'bend-3', 'bend-4', 'bend-5'],
};

/** Every persisted field region accepted by clipping, import, and editor controls. */
export const fieldRegionIds: readonly FieldRegionId[] = Object.freeze(
  [...new Set<FieldRegionId>(Object.values(supportedRegionIds).flat())],
);

/**
 * Field-coordinate paths are intentionally fixed, authored geometry. The
 * parent shield clip is applied by the field renderer, while each path below
 * is the exact interior area belonging to one persisted region id.
 */
const regionPaths: Readonly<Record<FieldRegionId, string>> = {
  overall: 'M0 0H100V110H0Z',
  dexter: 'M0 0H50V110H0Z',
  sinister: 'M50 0H100V110H50Z',
  chief: 'M0 0H100V55H0Z',
  base: 'M0 55H100V110H0Z',
  'bend-upper': 'M100 0H0V110Z',
  'bend-lower': 'M100 0V110H0Z',
  'bend-sinister-upper': 'M0 0H100V110Z',
  'bend-sinister-lower': 'M0 0V110H100Z',
  'chevron-chief': 'M0 0H100L50 55Z',
  'chevron-base': 'M0 0L50 55L100 0V110H0Z',
  q1: 'M0 0H50V55H0Z',
  q2: 'M50 0H100V55H50Z',
  q3: 'M0 55H50V110H0Z',
  q4: 'M50 55H100V110H50Z',
  'gyron-1': 'M50 55L0 0H50Z',
  'gyron-2': 'M50 55L50 0H100Z',
  'gyron-3': 'M50 55L100 0V55Z',
  'gyron-4': 'M50 55L100 55V110Z',
  'gyron-5': 'M50 55L100 110H50Z',
  'gyron-6': 'M50 55L50 110H0Z',
  'gyron-7': 'M50 55L0 110V55Z',
  'gyron-8': 'M50 55L0 55V0Z',
  'tierced-pale-1': 'M0 0H33.334V110H0Z',
  'tierced-pale-2': 'M33.334 0H66.667V110H33.334Z',
  'tierced-pale-3': 'M66.667 0H100V110H66.667Z',
  'tierced-fess-1': 'M0 0H100V36.667H0Z',
  'tierced-fess-2': 'M0 36.667H100V73.333H0Z',
  'tierced-fess-3': 'M0 73.333H100V110H0Z',
  'saltire-chief': 'M0 0H100L50 55Z',
  'saltire-dexter': 'M0 0V110L50 55Z',
  'saltire-base': 'M0 110H100L50 55Z',
  'saltire-sinister': 'M100 0V110L50 55Z',
  'bar-1': 'M0 0H100V22H0Z',
  'bar-2': 'M0 22H100V44H0Z',
  'bar-3': 'M0 44H100V66H0Z',
  'bar-4': 'M0 66H100V88H0Z',
  'bar-5': 'M0 88H100V110H0Z',
  'paly-1': 'M0 0H20V110H0Z',
  'paly-2': 'M20 0H40V110H20Z',
  'paly-3': 'M40 0H60V110H40Z',
  'paly-4': 'M60 0H80V110H60Z',
  'paly-5': 'M80 0H100V110H80Z',
  'bend-1': 'M0 66V110H40Z',
  'bend-2': 'M0 22V66L40 110H80Z',
  'bend-3': 'M0 0H20L100 88V110H80L0 22Z',
  'bend-4': 'M20 0H60L100 44V88Z',
  'bend-5': 'M60 0H100V44Z',
};

export function getFieldRegionIds(division: FieldDivision): readonly FieldRegionId[] {
  return supportedRegionIds[division];
}

export function getFieldRegionPath(regionId: FieldRegionId): string {
  return regionPaths[regionId];
}

/**
 * Resolves legacy shared fields to complete regional defaults without mutating
 * them, so persisted projects remain compatible when a user starts editing a
 * single region. The renderer keeps legacy output when `regions` is absent.
 */
export function resolveFieldRegions(field: CoatField): ResolvedFieldRegion[] {
  return getFieldRegionIds(field.division).map((regionId, index) => ({
    id: regionId,
    style: normalizeRegionStyle(
      field.regions?.[regionId] ?? getLegacyRegionStyle(field, index),
    ),
  }));
}

export function assertFieldRegions(
  division: FieldDivision,
  regions: unknown,
  divisionLine: unknown,
  validPatterns: readonly FieldPattern[],
): void {
  if (regions === undefined) return;
  if (!isRecord(regions)) throw new Error(`Invalid field regions: ${String(regions)}`);
  if (divisionLine !== undefined) {
    throw new Error(`Field regions do not support a configurable division line: ${division}`);
  }

  const supportedIds = getFieldRegionIds(division);
  for (const regionId of Object.keys(regions)) {
    if (!supportedIds.includes(regionId as FieldRegionId)) {
      throw new Error(`Invalid field region ${regionId} for division ${division}`);
    }
    assertFieldRegionStyle(regions[regionId], regionId, validPatterns);
  }
}

function getLegacyRegionStyle(field: CoatField, regionIndex: number): FieldRegionStyle {
  const useAccentColor = regionUsesAccentColor(field.division, regionIndex);
  const baseColor = useAccentColor ? (field.colors[1] ?? field.colors[0]!) : field.colors[0]!;
  return {
    colors: field.pattern === 'solid'
      ? [baseColor]
      : [baseColor, field.colors[1] ?? field.colors[0]!],
    pattern: field.pattern,
    ...(field.patternConfig === undefined ? {} : { patternConfig: { ...field.patternConfig } }),
  };
}

function regionUsesAccentColor(division: FieldDivision, regionIndex: number): boolean {
  if (division === 'solid') return false;
  if (division === 'quarterly') return regionIndex === 1 || regionIndex === 2;
  if (division === 'per-chevron') return regionIndex === 0;
  if (division === 'per-saltire') return regionIndex === 0 || regionIndex === 2;
  if (division === 'tierced-per-pale' || division === 'tierced-per-fess') return regionIndex === 1;
  return regionIndex % 2 === 1;
}

function normalizeRegionStyle(style: FieldRegionStyle): FieldRegionStyle & Required<Pick<FieldRegionStyle, 'colors' | 'pattern' | 'patternScale'>> {
  return {
    colors: [...style.colors],
    pattern: style.pattern,
    patternScale: style.patternScale ?? 1,
    ...(style.patternConfig === undefined ? {} : { patternConfig: { ...style.patternConfig } }),
  };
}

function assertFieldRegionStyle(style: unknown, regionId: string, validPatterns: readonly FieldPattern[]): void {
  if (!isRecord(style) || !Array.isArray(style.colors)) {
    throw new Error(`Invalid field region style: ${regionId}`);
  }
  assertExactKeys(style, ['colors', 'pattern', 'patternConfig', 'patternScale'], `field region ${regionId}`);
  if (!validPatterns.includes(style.pattern as FieldPattern)) {
    throw new Error(`Invalid field region pattern ${regionId}: ${String(style.pattern)}`);
  }
  assertFieldPatternConfig(style.pattern as FieldPattern, style.patternConfig, `field region pattern configuration ${regionId}`);
  const minimumColors = style.pattern === 'solid' ? 1 : 2;
  if (style.colors.length < minimumColors) {
    throw new Error(`Field region ${regionId} requires ${minimumColors} colors, received ${style.colors.length}`);
  }
  for (const color of style.colors) {
    if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new Error(`Invalid field region color ${regionId}: ${String(color)}`);
    }
  }
  if (style.patternScale !== undefined && (
    typeof style.patternScale !== 'number'
    || !Number.isFinite(style.patternScale)
    || style.patternScale < 0.25
    || style.patternScale > 4
  )) {
    throw new Error(`Invalid field region pattern scale ${regionId}: ${String(style.patternScale)}`);
  }
}

function assertExactKeys(value: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.includes(key)) throw new Error(`Unexpected ${label} property: ${key}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
