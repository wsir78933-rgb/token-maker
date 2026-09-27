export type ArmyFormationImagePiece = {
  iconSvgMarkup: string;
  x: number;
  y: number;
  rotationDegrees: number;
  backgroundColor: string;
};

export type ArmyFormationImageScene = {
  widthPx: number;
  heightPx: number;
  fieldBackgroundColor: string;
  backgroundImageUrl: string;
  pieces: ArmyFormationImagePiece[];
};

type PieceBox = {
  widthPx: number;
  heightPx: number;
};

const FALLBACK_PIECE_WIDTH_PX = 50;
const FALLBACK_PIECE_HEIGHT_PX = 30;

export function buildArmyFormationSvg(scene: ArmyFormationImageScene): string {
  assertScene(scene);
  return renderBattlefieldSvg(scene);
}

function assertScene(scene: ArmyFormationImageScene): void {
  if (typeof scene !== 'object' || scene === null) {
    throw new Error(
      `Army formation creator scene must be an object. scene=${formatReceivedValue(scene)}`,
    );
  }

  assertFinitePositivePixelSize(scene.widthPx, scene.heightPx);
  assertFieldText('fieldBackgroundColor', scene.fieldBackgroundColor);
  assertFieldText('backgroundImageUrl', scene.backgroundImageUrl);
  assertPieces(scene.pieces);
}

function assertFinitePositivePixelSize(widthPx: number, heightPx: number): void {
  if (isFinitePositive(widthPx) && isFinitePositive(heightPx)) {
    return;
  }

  throw new Error(
    `Army formation creator image size must use finite positive widthPx and heightPx. widthPx=${formatReceivedValue(widthPx)} heightPx=${formatReceivedValue(heightPx)}`,
  );
}

function assertFieldText(
  fieldName: 'fieldBackgroundColor' | 'backgroundImageUrl',
  value: string,
): void {
  if (typeof value === 'string') {
    return;
  }

  throw new Error(
    `Army formation creator ${fieldName} must be a string. ${fieldName}=${formatReceivedValue(value)}`,
  );
}

function assertPieces(pieces: ArmyFormationImagePiece[]): void {
  if (!Array.isArray(pieces)) {
    throw new Error(
      `Army formation creator pieces must be an array. pieces=${formatReceivedValue(pieces)}`,
    );
  }

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    assertPiece(pieces[pieceIndex], pieceIndex);
  }
}

function assertPiece(
  piece: ArmyFormationImagePiece | undefined,
  pieceIndex: number,
): void {
  if (typeof piece !== 'object' || piece === null) {
    throw new Error(
      `Army formation creator piece must be an object. pieceIndex=${pieceIndex} piece=${formatReceivedValue(piece)}`,
    );
  }

  assertFiniteCoordinate('x', piece.x, pieceIndex);
  assertFiniteCoordinate('y', piece.y, pieceIndex);
  assertFiniteRotation(piece.rotationDegrees, pieceIndex);
  assertPieceText('backgroundColor', piece.backgroundColor, pieceIndex);
  assertPieceText('iconSvgMarkup', piece.iconSvgMarkup, pieceIndex);
}

function assertFiniteCoordinate(
  fieldName: 'x' | 'y',
  value: number,
  pieceIndex: number,
): void {
  if (Number.isFinite(value)) {
    return;
  }

  throw new Error(
    `Army formation creator piece ${fieldName} must be a finite number. pieceIndex=${pieceIndex} ${fieldName}=${formatReceivedValue(value)}`,
  );
}

function assertFiniteRotation(rotationDegrees: number, pieceIndex: number): void {
  if (Number.isFinite(rotationDegrees)) {
    return;
  }

  throw new Error(
    `Army formation creator piece rotationDegrees must be a finite number. pieceIndex=${pieceIndex} rotationDegrees=${formatReceivedValue(rotationDegrees)}`,
  );
}

function assertPieceText(
  fieldName: 'backgroundColor' | 'iconSvgMarkup',
  value: string,
  pieceIndex: number,
): void {
  if (typeof value === 'string') {
    return;
  }

  throw new Error(
    `Army formation creator piece ${fieldName} must be a string. pieceIndex=${pieceIndex} ${fieldName}=${formatReceivedValue(value)}`,
  );
}

function isFinitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function renderBattlefieldSvg(scene: ArmyFormationImageScene): string {
  const widthText = formatSvgNumber(scene.widthPx);
  const heightText = formatSvgNumber(scene.heightPx);
  const field = renderFieldRect(widthText, heightText, scene.fieldBackgroundColor);
  const backgroundImage = renderBackgroundImage(
    widthText,
    heightText,
    scene.backgroundImageUrl,
  );
  const pieces = renderPieces(scene.pieces);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthText}" height="${heightText}" viewBox="0 0 ${widthText} ${heightText}" overflow="hidden" role="img" aria-label="Army formation creator">${field}${backgroundImage}${pieces}</svg>`;
}

function renderFieldRect(
  widthText: string,
  heightText: string,
  fieldBackgroundColor: string,
): string {
  return `<rect width="${widthText}" height="${heightText}" fill="${escapeXmlAttribute(fieldBackgroundColor)}"/>`;
}

function renderBackgroundImage(
  widthText: string,
  heightText: string,
  backgroundImageUrl: string,
): string {
  if (backgroundImageUrl === '') {
    return '';
  }

  return `<image href="${escapeXmlAttribute(backgroundImageUrl)}" x="0" y="0" width="${widthText}" height="${heightText}" preserveAspectRatio="xMidYMid slice"/>`;
}

function renderPieces(pieces: ArmyFormationImagePiece[]): string {
  const pieceMarkup: string[] = [];
  for (const piece of pieces) {
    pieceMarkup.push(renderPiece(piece));
  }
  return pieceMarkup.join('');
}

function renderPiece(piece: ArmyFormationImagePiece): string {
  const box = readPieceBox(piece.iconSvgMarkup);
  const transform = renderPieceTransform(piece, box);
  const background = renderPieceBackground(box, piece.backgroundColor);
  const icon = iconMarkupForPiece(piece.iconSvgMarkup, box);
  return `<g transform="${transform}">${background}${icon}</g>`;
}

function renderPieceTransform(piece: ArmyFormationImagePiece, box: PieceBox): string {
  const xText = formatSvgNumber(piece.x);
  const yText = formatSvgNumber(piece.y);
  const rotationText = formatSvgNumber(piece.rotationDegrees);
  const centerXText = formatSvgNumber(box.widthPx / 2);
  const centerYText = formatSvgNumber(box.heightPx / 2);
  return `translate(${xText} ${yText}) rotate(${rotationText} ${centerXText} ${centerYText})`;
}

function renderPieceBackground(box: PieceBox, backgroundColor: string): string {
  return `<rect width="${formatSvgNumber(box.widthPx)}" height="${formatSvgNumber(box.heightPx)}" fill="${escapeXmlAttribute(backgroundColor)}"/>`;
}

function readPieceBox(iconSvgMarkup: string): PieceBox {
  const openTag = readFirstSvgOpenTag(stripXmlDeclaration(iconSvgMarkup));
  if (openTag === null) {
    return fallbackPieceBox();
  }

  const widthPx = readPositivePixelLength(readAttribute(openTag, 'width'));
  const heightPx = readPositivePixelLength(readAttribute(openTag, 'height'));
  if (widthPx !== null && heightPx !== null) {
    return { widthPx, heightPx };
  }

  const viewBox = readViewBoxSize(readAttribute(openTag, 'viewBox'));
  if (viewBox !== null) {
    return viewBox;
  }

  return fallbackPieceBox();
}

function fallbackPieceBox(): PieceBox {
  return {
    widthPx: FALLBACK_PIECE_WIDTH_PX,
    heightPx: FALLBACK_PIECE_HEIGHT_PX,
  };
}

function iconMarkupForPiece(iconSvgMarkup: string, box: PieceBox): string {
  const markup = stripXmlDeclaration(iconSvgMarkup).trim();
  const openTag = readFirstSvgOpenTag(markup);
  if (openTag === null) {
    return wrapIconFragment(markup, box);
  }

  if (svgOpenTagHasPixelSize(openTag)) {
    return markup;
  }

  return replaceFirstSvgOpenTag(markup, openTag, withPixelSize(openTag, box));
}

function svgOpenTagHasPixelSize(openTag: string): boolean {
  return (
    readPositivePixelLength(readAttribute(openTag, 'width')) !== null &&
    readPositivePixelLength(readAttribute(openTag, 'height')) !== null
  );
}

function withPixelSize(openTag: string, box: PieceBox): string {
  const withoutWidth = removeLengthAttribute(openTag, 'width');
  const withoutSize = removeLengthAttribute(withoutWidth, 'height');
  const pixelSizeAttributes = ` width="${formatSvgNumber(box.widthPx)}" height="${formatSvgNumber(box.heightPx)}"`;
  return withoutSize.replace(/^<svg\b/i, `<svg${pixelSizeAttributes}`);
}

function wrapIconFragment(markup: string, box: PieceBox): string {
  const widthText = formatSvgNumber(box.widthPx);
  const heightText = formatSvgNumber(box.heightPx);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthText}" height="${heightText}" viewBox="0 0 ${widthText} ${heightText}">${markup}</svg>`;
}

function replaceFirstSvgOpenTag(
  markup: string,
  openTag: string,
  replacement: string,
): string {
  const start = markup.indexOf(openTag);
  if (start === -1) {
    throw new Error(
      `Army formation creator could not find the icon svg tag. openTag=${openTag}`,
    );
  }

  return `${markup.slice(0, start)}${replacement}${markup.slice(start + openTag.length)}`;
}

function readFirstSvgOpenTag(markup: string): string | null {
  const match = /<svg\b[^>]*>/i.exec(markup);
  if (match === null) {
    return null;
  }

  return match[0];
}

function readAttribute(openTag: string, attributeName: string): string | null {
  const pattern = new RegExp(
    `(?:^|\\s)${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
    'i',
  );
  const match = pattern.exec(openTag);
  if (match === null) {
    return null;
  }

  const quotedValue = match[1] ?? match[2];
  if (quotedValue === undefined) {
    return null;
  }

  return quotedValue;
}

function removeLengthAttribute(openTag: string, attributeName: string): string {
  const pattern = new RegExp(
    `\\s${attributeName}\\s*=\\s*(?:"[^"]*"|'[^']*')`,
    'ig',
  );
  return openTag.replace(pattern, '');
}

function readPositivePixelLength(lengthText: string | null): number | null {
  if (lengthText === null) {
    return null;
  }

  const match = /^(-?(?:\d+(?:\.\d+)?|\.\d+))(px)?$/.exec(lengthText.trim());
  if (match === null) {
    return null;
  }

  const parsedLength = Number(match[1]);
  if (!isFinitePositive(parsedLength)) {
    return null;
  }

  return parsedLength;
}

function readViewBoxSize(viewBoxText: string | null): PieceBox | null {
  if (viewBoxText === null) {
    return null;
  }

  const viewBoxParts = viewBoxText.trim().split(/[\s,]+/);
  if (viewBoxParts.length !== 4) {
    return null;
  }

  const widthPx = Number(viewBoxParts[2]);
  const heightPx = Number(viewBoxParts[3]);
  if (!isFinitePositive(widthPx) || !isFinitePositive(heightPx)) {
    return null;
  }

  return { widthPx, heightPx };
}

function stripXmlDeclaration(markup: string): string {
  return markup.replace(/^\s*<\?xml\b[^?]*\?>\s*/i, '');
}

function formatSvgNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(
      `Army formation creator SVG number must be finite. value=${formatReceivedValue(value)}`,
    );
  }

  if (Object.is(value, -0)) {
    return '0';
  }

  return String(value);
}

function escapeXmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'number') {
    if (Object.is(value, -0)) {
      return '-0';
    }

    return String(value);
  }

  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  return Object.prototype.toString.call(value);
}
