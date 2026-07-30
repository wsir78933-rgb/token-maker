import type { FieldDivision, FieldDivisionLine, FieldDivisionLineStyle } from './types';

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
  }
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

function toSvgPoint(point: HeraldicLinePoint): string {
  return `${point.x} ${point.y}`;
}

function roundCoordinate(value: number): number {
  return Math.round(value * 1000) / 1000;
}
