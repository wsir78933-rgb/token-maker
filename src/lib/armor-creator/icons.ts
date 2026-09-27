import {
  pieceGender,
  pieceIndex,
  pieceMaterial,
  pieceSlot,
  requireArmorPieceId,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';

type ArmorPieceSvgOptions = {
  flatChest?: boolean;
};

type PieceShapeMetrics = {
  width: number;
  point: number;
  stripeCount: number;
};

const PIECE_WIDTHS = [20, 24, 28, 32, 36] as const;
const PIECE_POINTS = [6, 10, 14, 18] as const;
const PIECE_STRIPE_COUNTS = [1, 2, 3] as const;
const STRIPE_THICKNESS = 3;
const STRIPE_STEP = 5;

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  const json = JSON.stringify(value);
  if (typeof json === 'string') {
    return json;
  }

  return Object.prototype.toString.call(value);
}

function formatCoord(value: number): string {
  if (!Number.isInteger(value)) {
    throw new Error(`SVG coordinate must be an integer. Received ${String(value)}.`);
  }

  if (value < 0 || value > 64) {
    throw new Error(`SVG coordinate ${String(value)} is outside 0..64.`);
  }

  return String(value);
}

function shapeLeft(width: number): number {
  if (!Number.isInteger(width) || width < 2 || width > 60) {
    throw new Error(`Armor shape width ${String(width)} is outside 2..60.`);
  }

  return Math.floor((64 - width) / 2);
}

function metricValue<T>(values: readonly T[], step: number, label: string): T {
  const value = values[step % values.length];
  if (value === undefined) {
    throw new Error(`Missing armor ${label} for step ${String(step)}.`);
  }

  return value;
}

function pieceShapeMetrics(index: number): PieceShapeMetrics {
  if (!Number.isInteger(index) || index < 1 || index > 30) {
    throw new Error(`Armor piece index ${String(index)} is outside 1..30.`);
  }

  const step = index - 1;
  return {
    width: metricValue(PIECE_WIDTHS, step, 'width'),
    point: metricValue(PIECE_POINTS, step, 'point'),
    stripeCount: metricValue(PIECE_STRIPE_COUNTS, step, 'stripe count'),
  };
}

function rectHole(x: number, y: number, width: number, height: number): string {
  const right = x + width;
  const bottom = y + height;
  return `M${formatCoord(x)} ${formatCoord(y)}L${formatCoord(right)} ${formatCoord(y)}L${formatCoord(right)} ${formatCoord(bottom)}L${formatCoord(x)} ${formatCoord(bottom)}z`;
}

function stripeHoles(x: number, top: number, width: number, stripeCount: number): string[] {
  if (!Number.isInteger(stripeCount) || stripeCount < 1 || stripeCount > 3) {
    throw new Error(`Armor stripe count ${String(stripeCount)} is outside 1..3.`);
  }

  if (!Number.isInteger(width) || width < 2) {
    throw new Error(`Armor stripe width ${String(width)} is too small.`);
  }

  const holes: string[] = [];
  for (let stripe = 0; stripe < stripeCount; stripe += 1) {
    holes.push(rectHole(x, top + stripe * STRIPE_STEP, width, STRIPE_THICKNESS));
  }

  return holes;
}

function filledPolygon(
  points: readonly (readonly [number, number])[],
  holes: readonly string[],
): string {
  if (points.length < 3) {
    throw new Error(`SVG polygon needs at least 3 points. Received ${String(points.length)}.`);
  }

  const outer = points
    .map(([x, y], pointIndex) => {
      const command = pointIndex === 0 ? 'M' : 'L';
      return `${command}${formatCoord(x)} ${formatCoord(y)}`;
    })
    .join('');

  return `<path fill="currentColor" fill-rule="evenodd" d="${outer}z${holes.join('')}"/>`;
}

function helmMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const right = left + metrics.width;
  return filledPolygon(
    [
      [left, 50],
      [left, 28],
      [32, 20 - metrics.point],
      [right, 28],
      [right, 50],
    ],
    stripeHoles(left + 4, 36, metrics.width - 8, metrics.stripeCount),
  );
}

function pointedChestMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const right = left + metrics.width;
  return filledPolygon(
    [
      [left, 10],
      [right, 10],
      [right - 4, 40],
      [32, 40 + metrics.point],
      [left + 4, 40],
    ],
    stripeHoles(left + 4, 16, metrics.width - 8, metrics.stripeCount),
  );
}

function flatChestMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const right = left + metrics.width;
  const stripeTop = 20 + metrics.point / 2;
  return filledPolygon(
    [
      [left, 12],
      [right, 12],
      [right, 52],
      [left, 52],
    ],
    stripeHoles(left + 4, stripeTop, metrics.width - 8, metrics.stripeCount),
  );
}

function chestMarkup(metrics: PieceShapeMetrics, flatChest: boolean): string {
  if (flatChest) {
    return flatChestMarkup(metrics);
  }

  return pointedChestMarkup(metrics);
}

function feetMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const shaftRight = left + metrics.width / 2;
  const right = left + metrics.width;
  return filledPolygon(
    [
      [left, 10],
      [shaftRight, 10],
      [shaftRight, 34],
      [right, 34],
      [right, 34 + metrics.point],
      [left, 34 + metrics.point],
    ],
    stripeHoles(left + 2, 16, metrics.width / 2 - 4, metrics.stripeCount),
  );
}

function shoulderMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const right = left + metrics.width;
  return filledPolygon(
    [
      [left, 46],
      [left, 24],
      [left + 8, 22 - metrics.point],
      [right, 28],
      [right, 46],
    ],
    stripeHoles(left + 4, 32, metrics.width - 8, metrics.stripeCount),
  );
}

function legsMarkup(metrics: PieceShapeMetrics): string {
  const total = metrics.width + metrics.point;
  const left = shapeLeft(total);
  const right = left + metrics.width;
  const greave = filledPolygon(
    [
      [left, 6],
      [right, 6],
      [right - 4, 58],
      [left + 4, 58],
    ],
    stripeHoles(left + 4, 12, metrics.width - 12, metrics.stripeCount),
  );
  const knee = filledPolygon(
    [
      [right - 2, 30],
      [right + metrics.point, 36],
      [right - 2, 42],
    ],
    [],
  );
  return greave + knee;
}

function glovesMarkup(metrics: PieceShapeMetrics): string {
  const palmWidth = metrics.width - 8;
  const left = shapeLeft(palmWidth + metrics.point);
  const right = left + palmWidth;
  const palm = filledPolygon(
    [
      [left, 16],
      [right, 16],
      [right, 50],
      [left, 50],
    ],
    stripeHoles(left + 3, 34, palmWidth - 6, metrics.stripeCount),
  );
  const thumb = filledPolygon(
    [
      [right, 20],
      [right + metrics.point, 28],
      [right, 36],
    ],
    [],
  );
  return palm + thumb;
}

function cloakTopWidth(width: number): number {
  const topWidth = width - 8;
  if (!Number.isInteger(topWidth) || topWidth < 8 || topWidth % 2 !== 0) {
    throw new Error(
      `Cloak top width ${String(topWidth)} is invalid for piece width ${String(width)}.`,
    );
  }

  return topWidth;
}

function cloakFrontMarkup(metrics: PieceShapeMetrics): string {
  const topWidth = cloakTopWidth(metrics.width);
  const topLeft = shapeLeft(topWidth);
  const hemLeft = shapeLeft(metrics.width);
  const hemRight = hemLeft + metrics.width;
  return filledPolygon(
    [
      [topLeft, 8],
      [topLeft + topWidth, 8],
      [hemRight, 54],
      [32, 54 - metrics.point],
      [hemLeft, 54],
    ],
    stripeHoles(topLeft + 2, 14, topWidth - 4, metrics.stripeCount),
  );
}

function cloakBackMarkup(metrics: PieceShapeMetrics): string {
  const topWidth = cloakTopWidth(metrics.width);
  const topLeft = shapeLeft(topWidth);
  const hemLeft = shapeLeft(metrics.width);
  const hemRight = hemLeft + metrics.width;
  return filledPolygon(
    [
      [topLeft, 8],
      [topLeft + topWidth, 8],
      [hemRight, 42],
      [32, 42 + metrics.point],
      [hemLeft, 42],
    ],
    stripeHoles(topLeft + 2, 14, topWidth - 4, metrics.stripeCount),
  );
}

function crownTineWidth(width: number): number {
  const tineWidth = 4 + (width - 20) / 4;
  if (!Number.isInteger(tineWidth) || tineWidth < 4) {
    throw new Error(
      `Crown tine width ${String(tineWidth)} is invalid for piece width ${String(width)}.`,
    );
  }

  return tineWidth;
}

function crownMarkup(metrics: PieceShapeMetrics): string {
  const tineWidth = crownTineWidth(metrics.width);
  const tineCount = metrics.stripeCount + 2;
  const crownWidth = tineWidth * tineCount;
  const left = shapeLeft(crownWidth);
  const baseY = 44;
  const tipY = 32 - metrics.point;
  const points: Array<[number, number]> = [[left, baseY]];

  for (let tine = 0; tine < tineCount; tine += 1) {
    const valleyX = left + tine * tineWidth;
    const nextValleyX = valleyX + tineWidth;
    const tipX = valleyX + Math.floor(tineWidth / 2);
    if (tipX <= valleyX || tipX >= nextValleyX) {
      throw new Error(
        `Crown tine ${String(tine)} collapsed at ${String(valleyX)}, ${String(tipX)}, ${String(nextValleyX)} for width ${String(metrics.width)}.`,
      );
    }

    points.push([tipX, tipY]);
    points.push([nextValleyX, baseY]);
  }

  const tines = filledPolygon(points, []);
  const band = filledPolygon(
    [
      [left, baseY],
      [left + crownWidth, baseY],
      [left + crownWidth, baseY + 8],
      [left, baseY + 8],
    ],
    [],
  );
  return tines + band;
}

function wingFeatherGap(width: number, featherCount: number): number {
  const gap = Math.round(width / featherCount);
  if (!Number.isInteger(gap) || gap < 4) {
    throw new Error(
      `Wing feather gap ${String(gap)} is too small for width ${String(width)} and feather count ${String(featherCount)}.`,
    );
  }

  return gap;
}

function wingMarkup(metrics: PieceShapeMetrics): string {
  const featherCount = metrics.stripeCount + 1;
  const gap = wingFeatherGap(metrics.width, featherCount);
  const feathers: string[] = [];

  for (let feather = 0; feather < featherCount; feather += 1) {
    const rootY = 50 - feather * 4;
    feathers.push(
      filledPolygon(
        [
          [12, rootY],
          [16 + gap * (feather + 1), rootY - 10 - metrics.point],
          [22, rootY - 4],
        ],
        [],
      ),
    );
  }

  return feathers.join('');
}

function markupForSlot(slot: ArmorSlot, metrics: PieceShapeMetrics, flatChest: boolean): string {
  if (slot === 'helm') {
    return helmMarkup(metrics);
  }

  if (slot === 'chest') {
    return chestMarkup(metrics, flatChest);
  }

  if (slot === 'feet') {
    return feetMarkup(metrics);
  }

  if (slot === 'shoulderLeft' || slot === 'shoulderRight') {
    return shoulderMarkup(metrics);
  }

  if (slot === 'legs') {
    return legsMarkup(metrics);
  }

  if (slot === 'gloves') {
    return glovesMarkup(metrics);
  }

  if (slot === 'cloakFront') {
    return cloakFrontMarkup(metrics);
  }

  if (slot === 'cloakBack') {
    return cloakBackMarkup(metrics);
  }

  if (slot === 'crown') {
    return crownMarkup(metrics);
  }

  if (slot === 'wing') {
    return wingMarkup(metrics);
  }

  throw new Error(`Unsupported armor slot ${JSON.stringify(slot)}.`);
}

function wrapArmorSvg(markup: string, pieceId: string): string {
  if (markup.length === 0) {
    throw new Error(
      `Armor piece SVG markup for ${JSON.stringify(pieceId)} is empty. Received "".`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${markup}</svg>`;
}

function renderArmorPieceSvg(pieceId: string, flatChest: boolean): string {
  const metrics = pieceShapeMetrics(pieceIndex(pieceId));
  return wrapArmorSvg(markupForSlot(pieceSlot(pieceId), metrics, flatChest), pieceId);
}

function readFlatChest(options: unknown): boolean {
  if (options === undefined) {
    return false;
  }

  if (typeof options !== 'object' || options === null || Array.isArray(options)) {
    throw new Error(
      `Armor SVG options must be an object. Received ${describeReceivedValue(options)}.`,
    );
  }

  const flatChest = (options as { flatChest?: unknown }).flatChest;
  if (flatChest === undefined || flatChest === false) {
    return false;
  }

  if (flatChest === true) {
    return true;
  }

  throw new Error(`flatChest must be a boolean. Received ${describeReceivedValue(flatChest)}.`);
}

function requireFemalePlateChest(pieceId: string): void {
  if (
    pieceGender(pieceId) === 'female' &&
    pieceMaterial(pieceId) === 'plate' &&
    pieceSlot(pieceId) === 'chest'
  ) {
    return;
  }

  throw new Error(
    `flatChest requires female plate chest. Received ${JSON.stringify(pieceId)}.`,
  );
}

export function armorPieceSvg(pieceId: string, options?: ArmorPieceSvgOptions): string {
  const validPieceId = requireArmorPieceId(pieceId);
  const flatChest = readFlatChest(options);
  if (flatChest) {
    requireFemalePlateChest(validPieceId);
  }

  return renderArmorPieceSvg(validPieceId, flatChest);
}
