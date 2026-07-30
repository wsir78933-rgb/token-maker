import type { CoatField, FieldDivision, FieldPattern, FieldPatternConfig } from './types';
import { renderConfiguredFieldDivision } from './field-division-line';
import { assertFieldPatternConfig, fieldPatterns, getFieldPatternConfigAttribute, renderExtendedFieldPattern, resolveFieldPatternConfig } from './field-pattern';
import { assertFieldRegions, getFieldRegionPath, resolveFieldRegions } from './field-regions';

const SHIELD_VIEW_BOX = '0 0 100 110';
const validDivisions: readonly FieldDivision[] = [
  'solid',
  'per-pale',
  'per-fess',
  'per-bend',
  'per-bend-sinister',
  'per-chevron',
  'quarterly',
  'gyronny',
  'tierced-per-pale',
  'tierced-per-fess',
  'per-saltire',
  'barry',
  'paly',
  'bendy',
];
const validPatterns: readonly FieldPattern[] = fieldPatterns;

/**
 * Pass the owning shield layer id when composing multiple field SVGs into one
 * document. The default is deterministic for standalone rendering.
 */
export interface FieldSvgOptions {
  clipPathId?: string;
}

/**
 * Builds a standalone shield field SVG. A composed renderer should pass a
 * stable, layer-specific `clipPathId` to prevent document-level ID collisions.
 */
export function buildFieldSvg(
  projectField: CoatField,
  shieldPath: string,
  options: FieldSvgOptions = {},
): string {
  const fieldColors = getFieldColors(projectField);
  assertShieldPath(shieldPath);
  const validOptions = validateFieldSvgOptions(options);
  const clipPathId = getClipPathId(validOptions.clipPathId);

  const fieldMarkup = buildFieldInteriorMarkup(projectField, clipPathId, fieldColors);

  return `<svg viewBox="${SHIELD_VIEW_BOX}" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${clipPathId}"><path d="${shieldPath}"/></clipPath></defs><g clip-path="url(#${clipPathId})">${fieldMarkup}</g></svg>`;
}

/** Renders a validated field interior for both standalone and composed shield SVGs. */
export function buildFieldInteriorMarkup(
  projectField: CoatField,
  clipPathId: string,
  knownFieldColors?: string[],
): string {
  const fieldColors = knownFieldColors ?? getFieldColors(projectField);
  if (projectField.regions !== undefined) return buildRegionalFieldMarkup(projectField, clipPathId);

  const clippedField = renderConfiguredFieldDivision(
    projectField.division,
    fieldColors[0]!,
    fieldColors[1] ?? fieldColors[0]!,
    projectField.divisionLine,
  ) ?? buildDivisionMarkup(projectField.division, fieldColors);
  return `${clippedField}${buildPatternOverlay(projectField.pattern, fieldColors, projectField.patternConfig)}`;
}

function getFieldColors(projectField: CoatField): string[] {
  assertCoatField(projectField);
  assertFieldDivision(projectField.division);
  assertFieldPattern(projectField.pattern);
  assertFieldPatternConfig(projectField.pattern, projectField.patternConfig);
  assertFieldRegions(projectField.division, projectField.regions, projectField.divisionLine, validPatterns);

  if (!Array.isArray(projectField.colors)) {
    throw new Error(`Invalid field colors: ${String(projectField.colors)}`);
  }

  const requiredColorCount = projectField.division === 'solid' ? 1 : 2;
  if (projectField.colors.length < requiredColorCount) {
    throw new Error(
      `Field division ${projectField.division} requires ${requiredColorCount} colors, received ${projectField.colors.length}`,
    );
  }
  if (projectField.pattern !== 'solid' && projectField.colors.length < 2) {
    throw new Error(
      `Field pattern ${projectField.pattern} requires an accent color, received ${projectField.colors.length} colors`,
    );
  }

  for (const fieldColor of projectField.colors) {
    if (typeof fieldColor !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(fieldColor)) {
      throw new Error(`Invalid field color: ${String(fieldColor)}`);
    }
  }
  return projectField.colors;
}

function buildRegionalFieldMarkup(projectField: CoatField, clipPathId: string): string {
  return resolveFieldRegions(projectField).map(({ id, style }) => {
    const regionPath = getFieldRegionPath(id);
    const regionClipId = `${clipPathId}-region-${id}`;
    const [baseColor] = style.colors;
    const patternMarkup = buildPatternOverlay(style.pattern, style.colors, style.patternConfig);
    const patternTransform = style.patternScale === 1
      ? ''
      : ` transform="translate(50 55) scale(${style.patternScale}) translate(-50 -55)"`;
    return `<defs><clipPath id="${regionClipId}"><path d="${regionPath}"/></clipPath></defs><g data-field-region="${id}" data-field-region-pattern="${style.pattern}" data-field-region-pattern-scale="${style.patternScale}"><path d="${regionPath}" fill="${baseColor}"/><g clip-path="url(#${regionClipId})"${patternTransform}>${patternMarkup}</g></g>`;
  }).join('');
}

function assertCoatField(projectField: CoatField): void {
  if (!projectField || typeof projectField !== 'object') {
    throw new Error(`Invalid coat field: ${String(projectField)}`);
  }
}

function assertFieldDivision(division: unknown): asserts division is FieldDivision {
  if (!validDivisions.includes(division as FieldDivision)) {
    throw new Error(`Invalid field division: ${String(division)}`);
  }
}

function assertFieldPattern(pattern: unknown): asserts pattern is FieldPattern {
  if (!validPatterns.includes(pattern as FieldPattern)) {
    throw new Error(`Invalid field pattern: ${String(pattern)}`);
  }
}

function assertShieldPath(shieldPath: string): void {
  if (typeof shieldPath !== 'string' || !isSupportedShieldPath(shieldPath)) {
    throw new Error(`Invalid shield path: ${String(shieldPath)}`);
  }
}

function isSupportedShieldPath(shieldPath: string): boolean {
  if (!/^[MLHVCZ0-9, .\-\n\r]+$/.test(shieldPath) || !shieldPath.startsWith('M')) {
    return false;
  }

  const pathSegments = [...shieldPath.matchAll(/([MLHVCZ])([^MLHVCZ]*)/g)];
  if (pathSegments.length < 3 || pathSegments.at(-1)?.[1] !== 'Z') {
    return false;
  }

  return pathSegments.every((pathSegment) => hasValidSegmentArguments(pathSegment));
}

function hasValidSegmentArguments(pathSegment: RegExpMatchArray): boolean {
  const [, command, argumentText] = pathSegment;
  const coordinateValues = argumentText.match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  const remainingText = argumentText
    .replace(/-?(?:\d+\.?\d*|\.\d+)/g, '')
    .replace(/[\s,]/g, '');
  if (remainingText) {
    return false;
  }

  const expectedArgumentCount: Record<string, number> = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    Z: 0,
  };
  return coordinateValues.length === expectedArgumentCount[command];
}

function validateFieldSvgOptions(options: FieldSvgOptions): FieldSvgOptions {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error(`Invalid field SVG options: ${String(options)}`);
  }
  if (options.clipPathId !== undefined && typeof options.clipPathId !== 'string') {
    throw new Error(`Invalid field SVG options: ${String(options)}`);
  }
  return options;
}

function getClipPathId(clipPathId: string | undefined): string {
  if (clipPathId === undefined) {
    return 'coat-field-clip';
  }
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(clipPathId)) {
    throw new Error(`Invalid clip path id: ${clipPathId}`);
  }
  return clipPathId;
}

function buildDivisionMarkup(division: FieldDivision, colors: string[]): string {
  const [primaryColor, secondaryColor] = colors;

  switch (division) {
    case 'solid':
      return `<rect width="100" height="110" fill="${primaryColor}"/>`;
    case 'per-pale':
      return `<rect width="50" height="110" fill="${primaryColor}"/><rect x="50" width="50" height="110" fill="${secondaryColor}"/>`;
    case 'per-fess':
      return `<rect width="100" height="55" fill="${primaryColor}"/><rect y="55" width="100" height="55" fill="${secondaryColor}"/>`;
    case 'per-bend':
      return `<rect width="100" height="110" fill="${primaryColor}"/><path d="M100 0 H0 V110 Z" fill="${secondaryColor}"/>`;
    case 'per-bend-sinister':
      return `<rect width="100" height="110" fill="${primaryColor}"/><path d="M0 0 H100 V110 Z" fill="${secondaryColor}"/>`;
    case 'per-chevron':
      return `<rect width="100" height="110" fill="${primaryColor}"/><path d="M0 0 H100 L50 55 Z" fill="${secondaryColor}"/>`;
    case 'quarterly':
      return `<rect width="50" height="55" fill="${primaryColor}"/><rect x="50" width="50" height="55" fill="${secondaryColor}"/><rect y="55" width="50" height="55" fill="${secondaryColor}"/><rect x="50" y="55" width="50" height="55" fill="${primaryColor}"/>`;
    case 'gyronny':
      return `<rect width="100" height="110" fill="${primaryColor}"/><polygon points="50,55 0,0 100,0" fill="${secondaryColor}"/><polygon points="50,55 100,110 0,110" fill="${secondaryColor}"/><polygon points="50,55 0,110 0,0" fill="${secondaryColor}"/><polygon points="50,55 100,0 100,110" fill="${secondaryColor}"/>`;
    case 'tierced-per-pale':
      return `<rect width="33.334" height="110" fill="${primaryColor}"/><rect x="33.334" width="33.333" height="110" fill="${secondaryColor}"/><rect x="66.667" width="33.333" height="110" fill="${primaryColor}"/>`;
    case 'tierced-per-fess':
      return `<rect width="100" height="36.667" fill="${primaryColor}"/><rect y="36.667" width="100" height="36.666" fill="${secondaryColor}"/><rect y="73.333" width="100" height="36.667" fill="${primaryColor}"/>`;
    case 'per-saltire':
      return `<rect width="100" height="110" fill="${primaryColor}"/><polygon points="0,0 100,0 50,55" fill="${secondaryColor}"/><polygon points="0,110 100,110 50,55" fill="${secondaryColor}"/>`;
    case 'barry':
      return `<rect width="100" height="22" fill="${primaryColor}"/><rect y="22" width="100" height="22" fill="${secondaryColor}"/><rect y="44" width="100" height="22" fill="${primaryColor}"/><rect y="66" width="100" height="22" fill="${secondaryColor}"/><rect y="88" width="100" height="22" fill="${primaryColor}"/>`;
    case 'paly':
      return `<rect width="20" height="110" fill="${primaryColor}"/><rect x="20" width="20" height="110" fill="${secondaryColor}"/><rect x="40" width="20" height="110" fill="${primaryColor}"/><rect x="60" width="20" height="110" fill="${secondaryColor}"/><rect x="80" width="20" height="110" fill="${primaryColor}"/>`;
    case 'bendy':
      return `<rect width="100" height="110" fill="${primaryColor}"/><path d="M-55 0H-30L70 110H45ZM-5 0H20L120 110H95Z" fill="${secondaryColor}"/>`;
  }
}

function buildPatternOverlay(pattern: FieldPattern, colors: string[], patternConfig?: FieldPatternConfig): string {
  const [, accentColor] = colors;
  const extendedPattern = renderExtendedFieldPattern(pattern, accentColor, patternConfig);
  if (extendedPattern !== undefined) return extendedPattern;
  const config = resolveFieldPatternConfig(pattern, patternConfig);
  const attribute = getFieldPatternConfigAttribute(pattern, patternConfig);

  switch (pattern) {
    case 'solid':
      return '';
    case 'stripes': {
      const count = config.count!;
      const direction = config.direction!;
      const strokeWidth = direction === 'horizontal' ? 110 / count / 2 : direction === 'vertical' ? 100 / count / 2 : 100 / count / 1.4;
      const path = Array.from({ length: count }, (_, index) => {
        if (direction === 'horizontal') return `M0 ${round((index + 0.5) * 110 / count)}H100`;
        if (direction === 'vertical') return `M${round((index + 0.5) * 100 / count)} 0V110`;
        const x = round(-100 + index * 300 / Math.max(1, count - 1));
        return direction === 'bend-sinister' ? `M${x} 110L${x + 110} 0` : `M${x} 0L${x + 110} 110`;
      }).join('');
      return `<g data-field-pattern="stripes"${attribute} fill="none" stroke="${accentColor}" stroke-width="${round(strokeWidth)}"><path d="${path}"/></g>`;
    }
    case 'dots':
      return `<g fill="${accentColor}"><circle cx="20" cy="20" r="5"/><circle cx="50" cy="45" r="5"/><circle cx="80" cy="20" r="5"/><circle cx="20" cy="75" r="5"/><circle cx="80" cy="75" r="5"/></g>`;
    case 'checks': {
      const rows = config.rows!;
      const columns = Math.max(2, Math.round(rows * 100 / 110));
      const cellWidth = 100 / columns;
      const cellHeight = 110 / rows;
      const cells = Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => (
        (row + column) % 2 === 0 ? `<rect x="${round(column * cellWidth)}" y="${round(row * cellHeight)}" width="${round(cellWidth)}" height="${round(cellHeight)}"/>` : ''
      )).join('')).join('');
      return `<g data-field-pattern="checks"${attribute} fill="${accentColor}">${cells}</g>`;
    }
    case 'lozengy': {
      const columns = config.columns!;
      const cellWidth = 100 / columns;
      const rowHeight = cellWidth * 1.1;
      const rows = Math.ceil(110 / rowHeight) + 1;
      const diamonds = Array.from({ length: rows }, (_, row) => Array.from({ length: columns + 1 }, (_, column) => {
        const cx = (column - 0.5 + (row % 2 ? 0.5 : 0)) * cellWidth;
        const cy = row * rowHeight;
        return `<polygon points="${round(cx)},${round(cy - rowHeight / 2)} ${round(cx + cellWidth / 2)},${round(cy)} ${round(cx)},${round(cy + rowHeight / 2)} ${round(cx - cellWidth / 2)},${round(cy)}"/>`;
      }).join('')).join('');
      return `<g data-field-pattern="lozengy"${attribute} fill="none" stroke="${accentColor}" stroke-width="3">${diamonds}</g>`;
    }
    case 'crosses':
      return `<g stroke="${accentColor}" stroke-width="6"><path d="M25 8V32M13 20H37M75 8V32M63 20H87M25 58V82M13 70H37M75 58V82M63 70H87"/></g>`;
    case 'waves':
      return `<path d="M0 20 Q12.5 8 25 20 T50 20 T75 20 T100 20 M0 55 Q12.5 43 25 55 T50 55 T75 55 T100 55 M0 90 Q12.5 78 25 90 T50 90 T75 90 T100 90" fill="none" stroke="${accentColor}" stroke-width="7"/>`;
    case 'masoned': {
      const rows = config.rows!;
      const bricks = config.bricks!;
      const rowHeight = 110 / rows;
      const brickWidth = 100 / bricks;
      const horizontal = Array.from({ length: rows - 1 }, (_, index) => `M0 ${round((index + 1) * rowHeight)}H100`).join('');
      const vertical = Array.from({ length: rows }, (_, row) => Array.from({ length: bricks - 1 }, (_, column) => {
        const x = (column + 1) * brickWidth - (row % 2 ? brickWidth / 2 : 0);
        return `M${round(x)} ${round(row * rowHeight)}V${round((row + 1) * rowHeight)}`;
      }).join('')).join('');
      return `<g data-field-pattern="masoned"${attribute} fill="none" stroke="${accentColor}" stroke-width="3"><path d="${horizontal}${vertical}"/></g>`;
    }
    case 'honeycomb':
      return `<g fill="none" stroke="${accentColor}" stroke-width="3"><polygon points="18,5 30,12 30,26 18,33 6,26 6,12"/><polygon points="42,5 54,12 54,26 42,33 30,26 30,12"/><polygon points="66,5 78,12 78,26 66,33 54,26 54,12"/><polygon points="30,33 42,40 42,54 30,61 18,54 18,40"/><polygon points="54,33 66,40 66,54 54,61 42,54 42,40"/></g>`;
    case 'fretty':
      return `<path d="M-20 0L80 110M10 0L110 110M-20 110L80 0M10 110L110 0" fill="none" stroke="${accentColor}" stroke-width="6"/>`;
    case 'scales':
      return `<g fill="none" stroke="${accentColor}" stroke-width="3"><circle cx="15" cy="18" r="11"/><circle cx="38" cy="18" r="11"/><circle cx="61" cy="18" r="11"/><circle cx="84" cy="18" r="11"/><circle cx="26" cy="38" r="11"/><circle cx="49" cy="38" r="11"/><circle cx="72" cy="38" r="11"/></g>`;
    default:
      throw new Error(`Unsupported field pattern: ${pattern}`);
  }
}

function round(value: number): number { return Math.round(value * 100) / 100; }
