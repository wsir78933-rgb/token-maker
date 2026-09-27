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

function halfPoint(point: number): number {
  if (!Number.isInteger(point) || point < 6 || point > 18 || point % 2 !== 0) {
    throw new Error(`Armor point ${String(point)} cannot be split into a whole coordinate.`);
  }

  return point / 2;
}

function rectHole(x: number, y: number, width: number, height: number): string {
  const right = x + width;
  const bottom = y + height;
  return `M${formatCoord(x)} ${formatCoord(y)}L${formatCoord(right)} ${formatCoord(y)}L${formatCoord(right)} ${formatCoord(bottom)}L${formatCoord(x)} ${formatCoord(bottom)}z`;
}

function cutBands(
  x: number,
  top: number,
  width: number,
  bandCount: number,
  bandHeight: number,
  bandStep: number,
): string[] {
  if (!Number.isInteger(bandCount) || bandCount < 1 || bandCount > 3) {
    throw new Error(`Armor band count ${String(bandCount)} is outside 1..3.`);
  }

  if (!Number.isInteger(width) || width < 2) {
    throw new Error(`Armor band width ${String(width)} is too small.`);
  }

  if (!Number.isInteger(bandHeight) || bandHeight < 1) {
    throw new Error(`Armor band height ${String(bandHeight)} is too small.`);
  }

  if (!Number.isInteger(bandStep) || bandStep < bandHeight) {
    throw new Error(
      `Armor band step ${String(bandStep)} is shorter than band height ${String(bandHeight)}.`,
    );
  }

  const bands: string[] = [];
  for (let band = 0; band < bandCount; band += 1) {
    bands.push(rectHole(x, top + band * bandStep, width, bandHeight));
  }

  return bands;
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

function upperArcPoints(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  segments: number,
): Array<[number, number]> {
  if (!Number.isInteger(segments) || segments < 4) {
    throw new Error(`Arc segments ${String(segments)} is below 4.`);
  }

  if (!Number.isInteger(radiusX) || !Number.isInteger(radiusY) || radiusX < 4 || radiusY < 4) {
    throw new Error(`Arc radii ${String(radiusX)}, ${String(radiusY)} are too small.`);
  }

  const points: Array<[number, number]> = [];
  for (let step = 0; step <= segments; step += 1) {
    const theta = Math.PI - (Math.PI * step) / segments;
    const x = Math.round(centerX + radiusX * Math.cos(theta));
    const y = Math.round(centerY - radiusY * Math.sin(theta));
    const previous = points[points.length - 1];
    if (previous !== undefined && previous[0] === x && previous[1] === y) {
      continue;
    }

    points.push([x, y]);
  }

  if (points.length < 4) {
    throw new Error(
      `Arc at ${String(centerX)},${String(centerY)} collapsed to ${String(points.length)} points.`,
    );
  }

  return points;
}

function ellipsePoints(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  segments: number,
): Array<[number, number]> {
  if (!Number.isInteger(segments) || segments < 6) {
    throw new Error(`Ellipse segments ${String(segments)} is below 6.`);
  }

  if (!Number.isInteger(radiusX) || !Number.isInteger(radiusY) || radiusX < 3 || radiusY < 3) {
    throw new Error(`Ellipse radii ${String(radiusX)}, ${String(radiusY)} are too small.`);
  }

  const points: Array<[number, number]> = [];
  for (let step = 0; step < segments; step += 1) {
    const theta = (2 * Math.PI * step) / segments;
    const x = Math.round(centerX + radiusX * Math.cos(theta));
    const y = Math.round(centerY + radiusY * Math.sin(theta));
    const previous = points[points.length - 1];
    if (previous !== undefined && previous[0] === x && previous[1] === y) {
      continue;
    }

    points.push([x, y]);
  }

  if (points.length < 6) {
    throw new Error(
      `Ellipse at ${String(centerX)},${String(centerY)} collapsed to ${String(points.length)} points.`,
    );
  }

  return points;
}

function reversedPoints(points: readonly (readonly [number, number])[]): Array<[number, number]> {
  return points.map(([x, y]) => [x, y]).reverse();
}

function visorBars(
  x: number,
  width: number,
  openingTop: number,
  openingHeight: number,
  barCount: number,
): string {
  const barHeight = 2;
  if (!Number.isInteger(barCount) || barCount < 1 || barCount > 3) {
    throw new Error(`Visor bar count ${String(barCount)} is outside 1..3.`);
  }

  const gapCount = barCount + 1;
  const leftover = openingHeight - barCount * barHeight;
  if (leftover < gapCount) {
    throw new Error(
      `Visor opening height ${String(openingHeight)} cannot fit ${String(barCount)} bars.`,
    );
  }

  const gap = Math.floor(leftover / gapCount);
  const extra = leftover - gapCount * gap;
  const bars: string[] = [];
  for (let bar = 0; bar < barCount; bar += 1) {
    const y = openingTop + extra + gap + bar * (barHeight + gap);
    bars.push(
      filledPolygon(
        [
          [x, y],
          [x + width, y],
          [x + width, y + barHeight],
          [x, y + barHeight],
        ],
        [],
      ),
    );
  }

  return bars.join('');
}

function helmHalfWidth(width: number): number {
  if (!Number.isInteger(width) || (width - 20) % 4 !== 0) {
    throw new Error(`Helm width ${String(width)} is outside the armor width steps.`);
  }

  const halfWidth = 26 + (width - 20) / 4;
  if (halfWidth < 8 || halfWidth > 30) {
    throw new Error(
      `Helm half width ${String(halfWidth)} is outside 8..30 for piece width ${String(width)}.`,
    );
  }

  return halfWidth;
}

const HELM_SHOULDER_Y = 16;

function helmCrownRadiusY(point: number): number {
  const rise = halfPoint(point);
  const top = 5 - (rise - 3) / 2;
  const radiusY = HELM_SHOULDER_Y - top;
  if (!Number.isInteger(radiusY) || radiusY < 4) {
    throw new Error(
      `Helm crown radius ${String(radiusY)} is invalid for point ${String(point)}.`,
    );
  }

  return radiusY;
}

function helmCrownRadiusX(width: number, point: number): number {
  const halfWidth = helmHalfWidth(width);
  const rise = halfPoint(point);
  const inset = (rise - 3) / 2;
  if (!Number.isInteger(inset)) {
    throw new Error(`Helm crown inset ${String(inset)} is invalid for point ${String(point)}.`);
  }

  const radiusX = halfWidth - inset;
  if (radiusX < 4) {
    throw new Error(
      `Helm crown radius ${String(radiusX)} is too small for piece width ${String(width)} and point ${String(point)}.`,
    );
  }

  return radiusX;
}

function helmVisorWidth(width: number): number {
  const widthHalf = width / 2;
  if (!Number.isInteger(widthHalf)) {
    throw new Error(`Helm visor width is invalid for piece width ${String(width)}.`);
  }

  const visorWidth = widthHalf - 2;
  if (visorWidth < 6) {
    throw new Error(
      `Helm visor width ${String(visorWidth)} is too small for piece width ${String(width)}.`,
    );
  }

  return visorWidth;
}

function helmVisorLeft(visorWidth: number): number {
  const visorLeft = 32 - visorWidth / 2;
  if (!Number.isInteger(visorLeft)) {
    throw new Error(
      `Helm visor left ${String(visorLeft)} is invalid for visor width ${String(visorWidth)}.`,
    );
  }

  return visorLeft;
}

function helmMarkup(metrics: PieceShapeMetrics): string {
  const halfWidth = helmHalfWidth(metrics.width);
  const left = 32 - halfWidth;
  const right = 32 + halfWidth;
  const arc = reversedPoints(
    upperArcPoints(
      32,
      HELM_SHOULDER_Y,
      helmCrownRadiusX(metrics.width, metrics.point),
      helmCrownRadiusY(metrics.point),
      8,
    ),
  );
  const visorWidth = helmVisorWidth(metrics.width);
  const visorLeft = helmVisorLeft(visorWidth);
  const visorTop = 26;
  const visorHeight = 12;
  const shell = filledPolygon(
    [
      [left, 58],
      [right, 58],
      [right, HELM_SHOULDER_Y],
      ...arc,
      [left, HELM_SHOULDER_Y],
    ],
    [rectHole(visorLeft, visorTop, visorWidth, visorHeight)],
  );

  return shell + visorBars(visorLeft, visorWidth, visorTop, visorHeight, metrics.stripeCount);
}

function chestShoulderPoints(
  left: number,
  right: number,
  neckY: number,
): Array<[number, number]> {
  return [
    [left, 12],
    [left + 6, 12],
    [28, neckY],
    [36, neckY],
    [right - 6, 12],
    [right, 12],
  ];
}

function pointedChestMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const right = left + metrics.width;
  const swell = halfPoint(metrics.point);
  const body = filledPolygon(
    [
      ...chestShoulderPoints(left, right, 20),
      [right + swell, 30],
      [right - 2, 44],
      [left + 2, 44],
      [left - swell, 30],
    ],
    [],
  );
  return body + fauldMarkup(left, right, metrics.stripeCount, false);
}

function flatChestMarkup(metrics: PieceShapeMetrics): string {
  const left = shapeLeft(metrics.width);
  const right = left + metrics.width;
  const body = filledPolygon(
    [
      ...chestShoulderPoints(left, right, 14 + halfPoint(metrics.point)),
      [right - 2, 44],
      [left + 2, 44],
    ],
    [],
  );
  return body + fauldMarkup(left, right, metrics.stripeCount, true);
}

function fauldMarkup(left: number, right: number, plateCount: number, flatChest: boolean): string {
  if (!Number.isInteger(plateCount) || plateCount < 1 || plateCount > 3) {
    throw new Error(`Fauld plate count ${String(plateCount)} is outside 1..3.`);
  }

  const plates: string[] = [];
  for (let plate = 0; plate < plateCount; plate += 1) {
    const inset = flatChest ? 2 : 3 + plate * 2;
    const plateLeft = left + inset;
    const plateRight = right - inset;
    const plateWidth = plateRight - plateLeft;
    if (plateWidth < 6) {
      throw new Error(
        `Fauld plate ${String(plate)} width ${String(plateWidth)} is too small for span ${String(right - left)}.`,
      );
    }

    const y = 46 + plate * 5;
    plates.push(
      filledPolygon(
        [
          [plateLeft, y],
          [plateRight, y],
          [plateRight - 1, y + 3],
          [plateLeft + 1, y + 3],
        ],
        [],
      ),
    );
  }

  return plates.join('');
}

function chestMarkup(metrics: PieceShapeMetrics, flatChest: boolean): string {
  if (flatChest) {
    return flatChestMarkup(metrics);
  }

  return pointedChestMarkup(metrics);
}

function bootShaftWidth(width: number): number {
  if (!Number.isInteger(width) || (width - 20) % 2 !== 0) {
    throw new Error(`Boot width ${String(width)} is not an even armor width.`);
  }

  return 14 + (width - 20) / 2;
}

function feetMarkup(metrics: PieceShapeMetrics): string {
  const shaftWidth = bootShaftWidth(metrics.width);
  const toeLength = 12 + metrics.point;
  const total = shaftWidth + toeLength;
  const left = shapeLeft(total);
  const shaftRight = left + shaftWidth;
  const toeRight = left + total;
  return filledPolygon(
    [
      [left, 6],
      [shaftRight, 6],
      [shaftRight, 26],
      [toeRight - 8, 32],
      [toeRight, 40],
      [toeRight, 48],
      [left + 10, 48],
      [left + 10, 58],
      [left, 58],
    ],
    cutBands(left + 3, 12, shaftWidth - 6, metrics.stripeCount, 2, 5),
  );
}

function rivetHoles(left: number, right: number, y: number, rivetCount: number): string[] {
  if (!Number.isInteger(rivetCount) || rivetCount < 1 || rivetCount > 3) {
    throw new Error(`Pauldron rivet count ${String(rivetCount)} is outside 1..3.`);
  }

  const span = right - left;
  if (span < 12) {
    throw new Error(`Pauldron rim span ${String(span)} is too small for rivets.`);
  }

  const holes: string[] = [];
  for (let rivet = 0; rivet < rivetCount; rivet += 1) {
    const centerX = left + Math.round(((rivet + 1) * span) / (rivetCount + 1));
    holes.push(rectHole(centerX - 1, y, 3, 3));
  }

  return holes;
}

function shoulderMarkup(metrics: PieceShapeMetrics): string {
  const radiusX = metrics.width / 2 + 4;
  const radiusY = 6 + halfPoint(metrics.point);
  const baseY = 44;
  const arc = reversedPoints(upperArcPoints(32, baseY, radiusX, radiusY, 8));
  const rimLeft = 32 - radiusX;
  const rimRight = 32 + radiusX;
  return filledPolygon(
    [
      [rimLeft, baseY + 8],
      [rimRight, baseY + 8],
      [rimRight, baseY],
      ...arc,
      [rimLeft, baseY],
    ],
    rivetHoles(rimLeft + 4, rimRight - 4, baseY + 3, metrics.stripeCount),
  );
}

function legShinWidth(width: number): number {
  const shinWidth = (width - 6) / 2;
  if (!Number.isInteger(shinWidth) || shinWidth < 6) {
    throw new Error(`Greave width ${String(shinWidth)} is too small for piece width ${String(width)}.`);
  }

  return shinWidth;
}

function legMarkup(x: number, shinWidth: number, kneeRy: number, bandCount: number): string {
  const kneeRx = Math.max(4, Math.floor(shinWidth / 2));
  const centerX = x + Math.floor(shinWidth / 2);
  const knee = filledPolygon(ellipsePoints(centerX, 16, kneeRx, kneeRy, 8), []);
  const shin = filledPolygon(
    [
      [x + 1, 20],
      [x + shinWidth - 1, 20],
      [x + shinWidth - 2, 52],
      [x + 2, 52],
    ],
    cutBands(x + 2, 30, shinWidth - 4, bandCount, 2, 6),
  );
  const foot = filledPolygon(
    [
      [x - 1, 50],
      [x + shinWidth + 1, 50],
      [x + shinWidth + 2, 60],
      [x - 2, 60],
    ],
    [],
  );
  return knee + shin + foot;
}

function legsMarkup(metrics: PieceShapeMetrics): string {
  const shinWidth = legShinWidth(metrics.width);
  const left = shapeLeft(metrics.width);
  const kneeRy = 4 + Math.floor(halfPoint(metrics.point) / 2);
  return (
    legMarkup(left, shinWidth, kneeRy, metrics.stripeCount) +
    legMarkup(left + shinWidth + 6, shinWidth, kneeRy, metrics.stripeCount)
  );
}

function glovesMarkup(metrics: PieceShapeMetrics): string {
  const palmWidth = metrics.width;
  const thumbReach = metrics.point;
  const palmLeft = shapeLeft(palmWidth + thumbReach) + thumbReach;
  const palmRight = palmLeft + palmWidth;
  const centerX = palmLeft + palmWidth / 2;
  const radiusX = palmWidth / 2;
  if (!Number.isInteger(centerX) || !Number.isInteger(radiusX)) {
    throw new Error(
      `Gauntlet center ${String(centerX)} is invalid for palm width ${String(palmWidth)}.`,
    );
  }

  const mitten = filledPolygon(
    [
      [palmLeft, 40],
      [palmLeft, 26],
      ...upperArcPoints(centerX, 26, radiusX, 12, 6),
      [palmRight, 40],
    ],
    [],
  );
  const thumbRx = Math.floor(thumbReach / 2);
  const thumb = filledPolygon(ellipsePoints(palmLeft - thumbRx, 32, thumbRx, 7, 8), []);
  const cuff = filledPolygon(
    [
      [palmLeft - 2, 36],
      [palmRight + 2, 36],
      [palmRight + 4, 58],
      [palmLeft - 4, 58],
    ],
    cutBands(palmLeft + 4, 44, palmWidth - 8, metrics.stripeCount, 2, 4),
  );
  return mitten + thumb + cuff;
}

function cloakPanelWidth(width: number): number {
  if (!Number.isInteger(width) || (width - 20) % 2 !== 0) {
    throw new Error(`Cloak panel width is invalid for piece width ${String(width)}.`);
  }

  return 10 + (width - 20) / 2;
}

function cloakFrontPanel(x: number, panelWidth: number, hemDrop: number, openOnRight: boolean): string {
  if (openOnRight) {
    return filledPolygon(
      [
        [x, 20],
        [x + panelWidth, 14],
        [x + panelWidth, 46],
        [x + Math.floor(panelWidth / 2), 46 + Math.floor(hemDrop / 2)],
        [x, 46 + hemDrop],
      ],
      [],
    );
  }

  return filledPolygon(
    [
      [x, 14],
      [x + panelWidth, 20],
      [x + panelWidth, 46 + hemDrop],
      [x + Math.ceil(panelWidth / 2), 46 + Math.floor(hemDrop / 2)],
      [x, 46],
    ],
    [],
  );
}

function collarGems(centerX: number, gemCount: number): string[] {
  const gemWidth = 2;
  const gap = 2;
  const span = gemCount * gemWidth + (gemCount - 1) * gap;
  let x = centerX - Math.floor(span / 2);
  const gems: string[] = [];
  for (let gem = 0; gem < gemCount; gem += 1) {
    gems.push(rectHole(x, 12, gemWidth, 2));
    x += gemWidth + gap;
  }

  return gems;
}

function cloakFrontMarkup(metrics: PieceShapeMetrics): string {
  const panelWidth = cloakPanelWidth(metrics.width);
  const gap = 8;
  const total = panelWidth * 2 + gap;
  const left = shapeLeft(total);
  const rightPanel = left + panelWidth + gap;
  const centerX = left + panelWidth + gap / 2;
  const collar = filledPolygon(
    [
      [left + 2, 18],
      [centerX - 4, 10],
      [centerX, 6],
      [centerX + 4, 10],
      [rightPanel + panelWidth - 2, 18],
      [rightPanel + panelWidth - 6, 20],
      [left + 6, 20],
    ],
    collarGems(centerX, metrics.stripeCount),
  );
  return (
    cloakFrontPanel(left, panelWidth, metrics.point, true) +
    cloakFrontPanel(rightPanel, panelWidth, metrics.point, false) +
    collar
  );
}

function cloakHemScallops(
  left: number,
  right: number,
  scallopCount: number,
): Array<[number, number]> {
  if (!Number.isInteger(scallopCount) || scallopCount < 1 || scallopCount > 3) {
    throw new Error(`Cloak hem scallop count ${String(scallopCount)} is outside 1..3.`);
  }

  const span = right - left;
  const base = Math.floor(span / scallopCount);
  let remainder = span % scallopCount;
  const points: Array<[number, number]> = [];
  let x = right;
  for (let scallop = 0; scallop < scallopCount; scallop += 1) {
    const scallopWidth = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) {
      remainder -= 1;
    }

    if (scallopWidth < 6) {
      throw new Error(
        `Cloak scallop width ${String(scallopWidth)} is too small for span ${String(span)}.`,
      );
    }

    const next = x - scallopWidth;
    points.push([next + Math.floor(scallopWidth / 2), 62]);
    points.push([next, 54]);
    x = next;
  }

  if (x !== left) {
    throw new Error(`Cloak hem ended at ${String(x)} instead of ${String(left)}.`);
  }

  return points;
}

function cloakBackMarkup(metrics: PieceShapeMetrics): string {
  const shoulderWidth = metrics.width - 4;
  const hemWidth = metrics.width + 12;
  const shoulderLeft = shapeLeft(shoulderWidth);
  const shoulderRight = shoulderLeft + shoulderWidth;
  const hemLeft = shapeLeft(hemWidth);
  const hemRight = hemLeft + hemWidth;
  const hood = upperArcPoints(32, 24, 8, 6 + halfPoint(metrics.point), 6);
  return filledPolygon(
    [
      [shoulderLeft, 32],
      ...hood,
      [shoulderRight, 32],
      [hemRight, 54],
      ...cloakHemScallops(hemLeft, hemRight, metrics.stripeCount),
    ],
    [],
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
  const baseY = 40;
  const tipY = 30 - metrics.point;
  const centerTine = Math.floor(tineCount / 2);
  const points: Array<[number, number]> = [[left, baseY]];

  for (let tine = 0; tine < tineCount; tine += 1) {
    const valleyX = left + tine * tineWidth;
    const nextValleyX = valleyX + tineWidth;
    const tipX = valleyX + Math.floor(tineWidth / 2);
    const raisedTipY = tine === centerTine ? tipY - 6 : tipY;
    if (tipX <= valleyX || tipX >= nextValleyX) {
      throw new Error(
        `Crown tine ${String(tine)} collapsed at ${String(valleyX)}, ${String(tipX)}, ${String(nextValleyX)} for width ${String(metrics.width)}.`,
      );
    }

    points.push([tipX, raisedTipY]);
    points.push([nextValleyX, baseY]);
  }

  const tines = filledPolygon(points, []);
  const band = filledPolygon(
    [
      [left, baseY],
      [left + crownWidth, baseY],
      [left + crownWidth, baseY + 10],
      [left, baseY + 10],
    ],
    [],
  );
  return tines + band;
}

function wingRootMarkup(): string {
  return filledPolygon(
    [
      [10, 36],
      [20, 30],
      [22, 48],
      [10, 52],
    ],
    [],
  );
}

function wingFeatherPoints(
  feather: number,
  featherCount: number,
  reach: number,
  lift: number,
): Array<[number, number]> {
  const halfLength = Math.min(16, 8 + Math.round((reach * (feather + 1)) / (featherCount * 2)));
  const reachStep = (reach - 20) / 4;
  if (!Number.isInteger(reachStep)) {
    throw new Error(`Wing reach ${String(reach)} is outside the armor width steps.`);
  }

  const angle = -0.32 - feather * 0.2;
  const centerX = 18 + reachStep + Math.round(halfLength * Math.cos(angle));
  const centerY = 50 - lift + Math.round(halfLength * Math.sin(angle));
  const points: Array<[number, number]> = [];
  for (let step = 0; step < 8; step += 1) {
    const theta = (2 * Math.PI * step) / 8;
    const localX = halfLength * Math.cos(theta);
    const localY = 4 * Math.sin(theta);
    const x = Math.round(centerX + localX * Math.cos(angle) - localY * Math.sin(angle));
    const y = Math.round(centerY + localX * Math.sin(angle) + localY * Math.cos(angle));
    const previous = points[points.length - 1];
    if (previous !== undefined && previous[0] === x && previous[1] === y) {
      continue;
    }

    points.push([x, y]);
  }

  if (points.length < 6) {
    throw new Error(
      `Wing feather ${String(feather)} collapsed to ${String(points.length)} points.`,
    );
  }

  return points;
}

function wingFeatherMarkup(feather: number, featherCount: number, reach: number, lift: number): string {
  return filledPolygon(wingFeatherPoints(feather, featherCount, reach, lift), []);
}

function wingMarkup(metrics: PieceShapeMetrics): string {
  const featherCount = metrics.stripeCount + 2;
  const reach = metrics.width;
  const lift = halfPoint(metrics.point);
  const feathers: string[] = [wingRootMarkup()];
  for (let feather = 0; feather < featherCount; feather += 1) {
    feathers.push(wingFeatherMarkup(feather, featherCount, reach, lift));
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

  throw new Error(`flatChest requires female plate chest. Received ${JSON.stringify(pieceId)}.`);
}

export function armorPieceSvg(pieceId: string, options?: ArmorPieceSvgOptions): string {
  const validPieceId = requireArmorPieceId(pieceId);
  const flatChest = readFlatChest(options);
  if (flatChest) {
    requireFemalePlateChest(validPieceId);
  }

  return renderArmorPieceSvg(validPieceId, flatChest);
}
