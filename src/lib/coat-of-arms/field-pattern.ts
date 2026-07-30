import type { FieldPattern, FieldPatternConfig, FieldStripeDirection } from './types';

export const fieldPatterns: readonly FieldPattern[] = [
  'solid', 'stripes', 'dots', 'checks', 'lozengy', 'crosses', 'waves',
  'masoned', 'honeycomb', 'fretty', 'scales', 'chevronelly', 'vair',
  'vair-in-pointe', 'vair-in-pale', 'paly-bendy', 'barry-bendy', 'gyronny',
  'papelonny', 'seme',
];

export type FieldPatternConfigControl = 'count' | 'direction' | 'rows' | 'bricks' | 'columns' | 'symbolSize';

const patternConfigControls: Readonly<Record<FieldPattern, readonly FieldPatternConfigControl[]>> = {
  solid: [], stripes: ['count', 'direction'], dots: [], checks: ['rows'], lozengy: ['columns'],
  crosses: [], waves: [], masoned: ['rows', 'bricks'], honeycomb: [], fretty: [], scales: [],
  chevronelly: ['count'], vair: ['rows'], 'vair-in-pointe': ['rows'], 'vair-in-pale': ['rows'],
  'paly-bendy': [], 'barry-bendy': [], gyronny: ['count'], papelonny: [], seme: ['count', 'symbolSize'],
};

const defaultPatternConfig: Readonly<Record<FieldPattern, FieldPatternConfig>> = {
  solid: {}, stripes: { count: 3, direction: 'bend' }, dots: {}, checks: { rows: 4 }, lozengy: { columns: 4 },
  crosses: {}, waves: {}, masoned: { rows: 5, bricks: 5 }, honeycomb: {}, fretty: {}, scales: {},
  chevronelly: { count: 3 }, vair: { rows: 3 }, 'vair-in-pointe': { rows: 3 }, 'vair-in-pale': { rows: 3 },
  'paly-bendy': {}, 'barry-bendy': {}, gyronny: { count: 4 }, papelonny: {}, seme: { count: 4, symbolSize: 4 },
};

const stripeDirections: readonly FieldStripeDirection[] = ['bend', 'bend-sinister', 'horizontal', 'vertical'];

export function getFieldPatternConfigControls(pattern: FieldPattern): readonly FieldPatternConfigControl[] {
  return patternConfigControls[pattern];
}

/** Validates persisted controls before SVG interpolation, rejecting wrong family keys and unsafe numeric values. */
export function assertFieldPatternConfig(
  pattern: FieldPattern,
  config: unknown,
  errorLabel = 'field pattern configuration',
): asserts config is FieldPatternConfig | undefined {
  if (config === undefined) return;
  if (!isRecord(config)) throw new Error(`Invalid ${errorLabel}: ${String(config)}`);

  const allowedControls = getFieldPatternConfigControls(pattern);
  for (const key of Object.keys(config)) {
    if (!allowedControls.includes(key as FieldPatternConfigControl)) {
      throw new Error(`Invalid ${errorLabel}: unsupported ${key} for ${pattern}`);
    }
  }
  for (const control of allowedControls) {
    const value = config[control];
    if (value === undefined) continue;
    assertPatternConfigValue(pattern, control, value, errorLabel);
  }
}

/** Returns immutable defaults for legacy projects while preserving only declared controls in serialized projects. */
export function resolveFieldPatternConfig(pattern: FieldPattern, config: FieldPatternConfig | undefined): FieldPatternConfig {
  assertFieldPatternConfig(pattern, config);
  return { ...defaultPatternConfig[pattern], ...config };
}

/** Deterministic diagnostic markup keeps render tests and independently clipped regions inspectable. */
export function getFieldPatternConfigAttribute(pattern: FieldPattern, config: FieldPatternConfig | undefined): string {
  if (config === undefined) return '';
  assertFieldPatternConfig(pattern, config);
  const serialized = getFieldPatternConfigControls(pattern)
    .filter((control) => config[control] !== undefined)
    .map((control) => `${control}:${String(config[control])}`)
    .join(';');
  return serialized ? ` data-field-pattern-config="${serialized}"` : '';
}

/** Locally authored SVG overlay for the target editor's extended pattern family. */
export function renderExtendedFieldPattern(
  pattern: FieldPattern,
  accentColor: string | undefined,
  patternConfig?: FieldPatternConfig,
): string | undefined {
  const config = resolveFieldPatternConfig(pattern, patternConfig);
  const attribute = getFieldPatternConfigAttribute(pattern, patternConfig);
  switch (pattern) {
    case 'chevronelly': return patternConfig === undefined
      ? `<g data-field-pattern="chevronelly" fill="none" stroke="${accentColor}" stroke-width="5"><path d="M-20 20L0 0L20 20L40 0L60 20L80 0L100 20L120 0M-20 55L0 35L20 55L40 35L60 55L80 35L100 55L120 35M-20 90L0 70L20 90L40 70L60 90L80 70L100 90L120 70"/></g>`
      : renderChevronelly(accentColor, config.count!, attribute);
    case 'vair': return renderVair(accentColor, config.rows!, attribute, 'vair');
    case 'vair-in-pointe': return renderVair(accentColor, config.rows!, attribute, 'vair-in-pointe');
    case 'vair-in-pale': return renderVair(accentColor, config.rows!, attribute, 'vair-in-pale');
    case 'paly-bendy': return `<g data-field-pattern="paly-bendy" fill="none" stroke="${accentColor}" stroke-width="8"><path d="M15 0V110M45 0V110M75 0V110M-30 0L70 110M10 0L110 110"/></g>`;
    case 'barry-bendy': return `<g data-field-pattern="barry-bendy" fill="none" stroke="${accentColor}" stroke-width="8"><path d="M0 20H100M0 55H100M0 90H100M-30 0L70 110M10 0L110 110"/></g>`;
    case 'gyronny': return renderGyronny(accentColor, config.count!, attribute);
    case 'papelonny': return `<g data-field-pattern="papelonny" fill="none" stroke="${accentColor}" stroke-width="5"><path d="M0 20Q12.5 0 25 20Q37.5 0 50 20Q62.5 0 75 20Q87.5 0 100 20M0 55Q12.5 35 25 55Q37.5 35 50 55Q62.5 35 75 55Q87.5 35 100 55M0 90Q12.5 70 25 90Q37.5 70 50 90Q62.5 70 75 90Q87.5 70 100 90"/></g>`;
    case 'seme': return renderSeme(accentColor, config.count!, config.symbolSize!, attribute);
    default: return undefined;
  }
}

function assertPatternConfigValue(pattern: FieldPattern, control: FieldPatternConfigControl, value: unknown, errorLabel: string): void {
  if (control === 'direction') {
    if (!stripeDirections.includes(value as FieldStripeDirection)) throw new Error(`Invalid ${errorLabel}: ${String(value)}`);
    return;
  }
  if (typeof value !== 'number' || !Number.isInteger(value) || !Number.isFinite(value)) {
    throw new Error(`Invalid ${errorLabel}: ${String(value)}`);
  }
  const bounds: Record<Exclude<FieldPatternConfigControl, 'direction'>, readonly [number, number]> = {
    count: pattern === 'gyronny' ? [4, 16] : [2, 12], rows: [2, 12], bricks: [2, 12], columns: [2, 12], symbolSize: [1, 20],
  };
  const [minimum, maximum] = bounds[control];
  if (value < minimum || value > maximum || (pattern === 'gyronny' && control === 'count' && value % 2 !== 0)) {
    throw new Error(`Invalid ${errorLabel}: ${String(value)}`);
  }
}

function renderChevronelly(accentColor: string | undefined, count: number, attribute: string): string {
  const rowHeight = 110 / count;
  const path = Array.from({ length: count }, (_, index) => {
    const y = index * rowHeight;
    const peak = y + rowHeight / 2;
    return `M-25 ${round(peak)}L0 ${round(y)}L25 ${round(peak)}L50 ${round(y)}L75 ${round(peak)}L100 ${round(y)}L125 ${round(peak)}`;
  }).join('');
  return `<g data-field-pattern="chevronelly"${attribute} fill="none" stroke="${accentColor}" stroke-width="5"><path d="${path}"/></g>`;
}

function renderVair(accentColor: string | undefined, rows: number, attribute: string, pattern: 'vair' | 'vair-in-pointe' | 'vair-in-pale'): string {
  const cellHeight = 110 / rows;
  const cellWidth = 25;
  const path = Array.from({ length: rows }, (_, rowIndex) => {
    const y = rowIndex * cellHeight;
    const offset = rowIndex % 2 === 0 ? 0 : cellWidth;
    return Array.from({ length: 5 }, (_, columnIndex) => {
      const x = columnIndex * cellWidth * 2 - offset;
      if (pattern === 'vair-in-pointe') return `M${round(x)} ${round(y)}H${round(x + cellWidth)}L${round(x + cellWidth / 2)} ${round(y + cellHeight)}`;
      if (pattern === 'vair-in-pale') return `M${round(x + 5)} ${round(y)}H${round(x + cellWidth - 5)}L${round(x + cellWidth / 2)} ${round(y + cellHeight / 2)}L${round(x + cellWidth - 5)} ${round(y + cellHeight)}H${round(x + 5)}L${round(x + cellWidth / 2)} ${round(y + cellHeight / 2)}`;
      return `M${round(x)} ${round(y)}H${round(x + cellWidth)}L${round(x + cellWidth - 6)} ${round(y + cellHeight / 2)}L${round(x + cellWidth + 6)} ${round(y + cellHeight)}H${round(x + 6)}L${round(x + cellWidth / 2)} ${round(y + cellHeight / 2)}Z`;
    }).join('');
  }).join('');
  return `<g data-field-pattern="${pattern}"${attribute} fill="${accentColor}"><path d="${path}"/></g>`;
}

function renderGyronny(accentColor: string | undefined, count: number, attribute: string): string {
  const wedges = Array.from({ length: count / 2 }, (_, index) => {
    const startAngle = (index * 2 * 360 / count) - 90;
    const endAngle = startAngle + 360 / count;
    return `<path d="M50 55L${polarPoint(startAngle)}L${polarPoint(endAngle)}Z"/>`;
  }).join('');
  return `<g data-field-pattern="gyronny"${attribute} fill="${accentColor}">${wedges}</g>`;
}

function renderSeme(accentColor: string | undefined, count: number, symbolSize: number, attribute: string): string {
  const spacingX = 100 / count;
  const spacingY = 110 / count;
  const symbols = Array.from({ length: count }, (_, rowIndex) => Array.from({ length: count }, (_, columnIndex) => {
    const offset = rowIndex % 2 === 0 ? spacingX / 2 : spacingX;
    return `<circle cx="${round(offset + columnIndex * spacingX)}" cy="${round(spacingY / 2 + rowIndex * spacingY)}" r="${symbolSize}"/>`;
  }).join('')).join('');
  return `<g data-field-pattern="seme"${attribute} fill="${accentColor}">${symbols}</g>`;
}

function polarPoint(angle: number): string {
  const radius = 200;
  return `${round(50 + Math.cos(angle * Math.PI / 180) * radius)} ${round(55 + Math.sin(angle * Math.PI / 180) * radius)}`;
}

function round(value: number): number { return Math.round(value * 100) / 100; }

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
