const SHIELD_WIDTH = 100;
const SHIELD_HEIGHT = 110;
const MAX_CUSTOM_OUTLINE_LENGTH = 1024;

/**
 * An independently authored, intentionally simple starter silhouette. It uses
 * only coordinates from the fixed 100 by 110 shield coordinate system.
 */
export const DEFAULT_CUSTOM_SHIELD_OUTLINE_PATH = 'M50 0 L94 16 L94 58 L50 110 L6 58 L6 16 Z';

type OutlinePoint = { x: number; y: number };

/**
 * Accepts only a closed, bounded M/L/Z polygon and returns one canonical SVG
 * representation. Restricting this grammar keeps local project data safe to
 * embed directly in the SVG renderer.
 */
export function normalizeCustomShieldOutlinePath(path: unknown): string {
  if (typeof path !== 'string' || path.trim().length === 0 || path.length > MAX_CUSTOM_OUTLINE_LENGTH) {
    throw new Error(`Invalid custom shield outline path: ${String(path)}`);
  }

  const compactSource = path.replace(/[\s,]+/gu, '');
  if (!/^[MLZmlz+\-.0-9]+$/u.test(compactSource)) {
    throw new Error(`Invalid custom shield outline path: ${path}`);
  }
  const tokens = path.match(/[MLZmlz]|[+-]?(?:\d+(?:\.\d+)?|\.\d+)/gu);
  if (!tokens || tokens.join('') !== compactSource) {
    throw new Error(`Invalid custom shield outline path: ${path}`);
  }

  let tokenIndex = 0;
  const firstCommand = tokens[tokenIndex++];
  if (firstCommand?.toUpperCase() !== 'M') {
    throw new Error(`Invalid custom shield outline path: ${path}`);
  }

  const points: OutlinePoint[] = [readPoint(tokens, () => tokenIndex++, path)];
  let lineCount = 0;
  let isClosed = false;
  while (tokenIndex < tokens.length) {
    const command = tokens[tokenIndex++]!;
    if (command.toUpperCase() === 'L') {
      points.push(readPoint(tokens, () => tokenIndex++, path));
      lineCount += 1;
      continue;
    }
    if (command.toUpperCase() === 'Z' && tokenIndex === tokens.length) {
      isClosed = true;
      break;
    }
    throw new Error(`Invalid custom shield outline path: ${path}`);
  }

  if (!isClosed || lineCount < 2 || polygonArea(points) === 0) {
    throw new Error(`Invalid custom shield outline path: ${path}`);
  }
  return `M${formatCoordinate(points[0]!.x)} ${formatCoordinate(points[0]!.y)}${points.slice(1).map((point) => ` L${formatCoordinate(point.x)} ${formatCoordinate(point.y)}`).join('')} Z`;
}

/** Validates a persisted custom outline while retaining legacy library shields. */
export function assertCustomShieldOutlinePath(path: unknown): asserts path is string {
  normalizeCustomShieldOutlinePath(path);
}

function readPoint(tokens: string[], consume: () => number, sourcePath: string): OutlinePoint {
  const xToken = tokens[consume()];
  const yToken = tokens[consume()];
  if (!isNumericToken(xToken) || !isNumericToken(yToken)) {
    throw new Error(`Invalid custom shield outline path: ${sourcePath}`);
  }
  const x = Number(xToken);
  const y = Number(yToken);
  if (x < 0 || x > SHIELD_WIDTH || y < 0 || y > SHIELD_HEIGHT) {
    throw new Error(`Invalid custom shield outline path outside the 100 by 110 shield bounds: ${x} ${y}`);
  }
  return { x, y };
}

function isNumericToken(token: string | undefined): token is string {
  return token !== undefined && /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(token);
}

function polygonArea(points: OutlinePoint[]): number {
  let twiceArea = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index]!;
    const next = points[(index + 1) % points.length]!;
    twiceArea += current.x * next.y - next.x * current.y;
  }
  return Math.abs(twiceArea) / 2;
}

function formatCoordinate(value: number): string {
  return Object.is(value, -0) ? '0' : String(value);
}
