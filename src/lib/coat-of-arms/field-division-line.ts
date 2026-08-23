import { getFieldRegionPath } from './field-regions';
import type { FieldDivision, FieldDivisionLine, FieldDivisionLineStyle, FieldRegionId } from './types';

export const fieldDivisionLineStyles: readonly FieldDivisionLineStyle[] = [
  'straight',
  'wavy',
  'indented',
  'engrailed',
  'invected',
  'embattled',
  'dovetailed',
  'potenty',
  'embattled-grady',
  'urdy',
  'embattled-in-crosses',
];

export const lineStyleDivisions: readonly FieldDivision[] = [
  'per-pale',
  'per-fess',
  'per-bend',
  'per-bend-sinister',
];

export type HeraldicLinePoint = { x: number; y: number };

/** Returns whether the original editor exposes a configurable line for this division. */
export function supportsFieldDivisionLine(division: FieldDivision): boolean {
  return lineStyleDivisions.includes(division);
}

/**
 * Closed clip path for one field region, following the configured division
 * line. Straight style reuses the authored region path; other styles close
 * around the same private boundary geometry used by the two-colour renderer.
 */
export function fieldRegionDivisionLinePath(
  division: FieldDivision,
  regionId: FieldRegionId,
  divisionLine: FieldDivisionLine,
): string {
  if (regionId === 'overall') return getFieldRegionPath('overall');
  const usesSecondaryPath = regionUsesSecondaryDivisionPath(division, regionId);
  if (divisionLine.style === 'straight') return getFieldRegionPath(regionId);

  const boundaryPoints = buildBoundaryPoints(division, divisionLine);
  return usesSecondaryPath
    ? buildSecondaryPath(division, boundaryPoints)
    : buildComplementPath(division, boundaryPoints);
}

/**
 * Renders a two-colour field whose boundary is a locally authored heraldic
 * line. Undefined leaves callers to use their unchanged default geometry.
 */
export function renderConfiguredFieldDivision(
  division: FieldDivision,
  primaryColor: string,
  secondaryColor: string,
  divisionLine: FieldDivisionLine | undefined,
): string | undefined {
  if (!divisionLine || !supportsFieldDivisionLine(division)) return undefined;

  const boundaryPoints = buildBoundaryPoints(division, divisionLine);
  const secondaryPath = buildSecondaryPath(division, boundaryPoints);
  return `<rect width="100" height="110" fill="${primaryColor}"/><path data-field-division-line-style="${divisionLine.style}" data-field-division-line-frequency="${divisionLine.frequency}" data-field-division-line-amplitude="${divisionLine.amplitude}" d="${secondaryPath}" fill="${secondaryColor}"/>`;
}

function buildBoundaryPoints(division: FieldDivision, divisionLine: FieldDivisionLine): HeraldicLinePoint[] {
  const [start, end] = getLineEndpoints(division);
  return buildHeraldicLinePoints(start, end, divisionLine);
}

/** Builds reusable local heraldic edge points for field structures and divisions. */
export function buildHeraldicLinePoints(
  start: HeraldicLinePoint,
  end: HeraldicLinePoint,
  divisionLine: FieldDivisionLine,
): HeraldicLinePoint[] {
  assertHeraldicLineMeasurements(divisionLine);
  const xDistance = end.x - start.x;
  const yDistance = end.y - start.y;
  const lineLength = Math.hypot(xDistance, yDistance);
  const normal = { x: -yDistance / lineLength, y: xDistance / lineLength };
  const segmentCount = divisionLine.style === 'wavy'
    ? divisionLine.frequency * 12
    : divisionLine.frequency * 4;

  return Array.from({ length: segmentCount + 1 }, (_, index): HeraldicLinePoint => {
    const progress = index / segmentCount;
    const offset = getLineOffset(divisionLine.style, divisionLine.frequency, divisionLine.amplitude, progress);
    return {
      x: roundCoordinate(start.x + xDistance * progress + normal.x * offset),
      y: roundCoordinate(start.y + yDistance * progress + normal.y * offset),
    };
  });
}

function getLineEndpoints(division: FieldDivision): [HeraldicLinePoint, HeraldicLinePoint] {
  switch (division) {
    case 'per-pale': return [{ x: 50, y: 0 }, { x: 50, y: 110 }];
    case 'per-fess': return [{ x: 0, y: 55 }, { x: 100, y: 55 }];
    case 'per-bend': return [{ x: 100, y: 0 }, { x: 0, y: 110 }];
    case 'per-bend-sinister': return [{ x: 0, y: 0 }, { x: 100, y: 110 }];
    default: throw new Error(`Unsupported configured field division: ${division}`);
  }
}

function getLineOffset(
  style: FieldDivisionLineStyle,
  frequency: number,
  amplitude: number,
  progress: number,
): number {
  if (style === 'straight' || progress === 0 || progress === 1) return 0;
  const cycleProgress = progress * frequency;
  const cycleFraction = cycleProgress - Math.floor(cycleProgress);
  const triangularWave = 1 - 4 * Math.abs(cycleFraction - 0.5);

  switch (style) {
    case 'wavy': return amplitude * Math.sin(cycleProgress * Math.PI * 2);
    case 'indented': return amplitude * triangularWave;
    case 'engrailed': return -amplitude * Math.sin(cycleFraction * Math.PI);
    case 'invected': return amplitude * Math.sin(cycleFraction * Math.PI);
    case 'embattled': return cycleFraction < 0.5 ? -amplitude : amplitude;
    case 'dovetailed': return amplitude * (cycleFraction < 0.5 ? cycleFraction * 2 : (1 - cycleFraction) * 2);
    case 'potenty': return cycleFraction < 0.25 || cycleFraction >= 0.75 ? -amplitude : amplitude;
    case 'embattled-grady': return amplitude * (Math.floor(cycleFraction * 4) - 1.5) / 1.5;
    case 'urdy': return -amplitude * triangularWave;
    case 'embattled-in-crosses': return amplitude * (cycleFraction < 0.25 || (cycleFraction >= 0.5 && cycleFraction < 0.75) ? -1 : 1);
    default:
      throw new Error(`Unknown field division line style: ${String(style)}`);
  }
}

function assertHeraldicLineMeasurements(divisionLine: FieldDivisionLine): void {
  assertKnownDivisionLineStyle(divisionLine.style);
  assertDivisionLineRange(divisionLine.frequency, 'frequency', 1, 30);
  assertDivisionLineRange(divisionLine.amplitude, 'amplitude', 1, 20);
}

function assertKnownDivisionLineStyle(style: FieldDivisionLineStyle): void {
  if (!fieldDivisionLineStyles.includes(style)) {
    throw new Error(`Unknown field division line style: ${String(style)}`);
  }
}

function assertDivisionLineRange(value: number, label: string, minimum: number, maximum: number): void {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`Invalid field division line ${label}: ${String(value)}`);
  }
}

function regionUsesSecondaryDivisionPath(division: FieldDivision, regionId: FieldRegionId): boolean {
  switch (division) {
    case 'per-pale':
      if (regionId === 'sinister') return true;
      if (regionId === 'dexter') return false;
      break;
    case 'per-fess':
      if (regionId === 'base') return true;
      if (regionId === 'chief') return false;
      break;
    case 'per-bend':
      if (regionId === 'bend-upper') return true;
      if (regionId === 'bend-lower') return false;
      break;
    case 'per-bend-sinister':
      if (regionId === 'bend-sinister-upper') return true;
      if (regionId === 'bend-sinister-lower') return false;
      break;
  }
  throw new Error(`Unsupported field division line region ${regionId} for division ${division}`);
}

function buildSecondaryPath(division: FieldDivision, boundaryPoints: HeraldicLinePoint[]): string {
  const reverseBoundary = boundaryPoints.slice(0, -1).reverse().map(toSvgPoint).join(' L');
  switch (division) {
    case 'per-pale':
      return `M${toSvgPoint(boundaryPoints[0]!)} L${boundaryPoints.slice(1).map(toSvgPoint).join(' L')} L100 110 L100 0 Z`;
    case 'per-fess':
      return `M${toSvgPoint(boundaryPoints[0]!)} L${boundaryPoints.slice(1).map(toSvgPoint).join(' L')} L100 110 L0 110 Z`;
    case 'per-bend':
      return `M100 0 L0 0 L0 110 L${reverseBoundary} Z`;
    case 'per-bend-sinister':
      return `M0 0 L100 0 L100 110 L${reverseBoundary} Z`;
    default: throw new Error(`Unsupported configured field division: ${division}`);
  }
}

function buildComplementPath(division: FieldDivision, boundaryPoints: HeraldicLinePoint[]): string {
  const boundary = boundaryPoints.map(toSvgPoint).join(' L');
  switch (division) {
    case 'per-pale':
      return `M${boundary} L0 110 L0 0 Z`;
    case 'per-fess':
      return `M${boundary} L100 0 L0 0 Z`;
    case 'per-bend':
      return `M${boundary} L100 110 Z`;
    case 'per-bend-sinister':
      return `M${boundary} L0 110 Z`;
    default: throw new Error(`Unsupported configured field division: ${division}`);
  }
}

function toSvgPoint(point: HeraldicLinePoint): string {
  return `${point.x} ${point.y}`;
}

function roundCoordinate(value: number): number {
  return Math.round(value * 1000) / 1000;
}
