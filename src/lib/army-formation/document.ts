export const ARMY_FORMATION_VERSION = 1 as const;

export const ARMY_BATTLEFIELD_COUNT = 4;

export const ARMY_PIECE_WIDTH = 50;

export const ARMY_PIECE_HEIGHT = 30;

export const ARMY_PLACEMENT_STEP_PX = 5;

const DEFAULT_BATTLEFIELD_HEIGHT_PX = 480;

const DEFAULT_BACKGROUND_COLOR = '#ffffff';

const MIN_BATTLEFIELD_HEIGHT_PX = 200;

const MAX_BATTLEFIELD_HEIGHT_PX = 2000;

const MAX_FIELD_WIDTH_PX = 20000;

export type ArmyFormationPiece = {
  id: string;
  iconId: string;
  x: number;
  y: number;
  rotationDegrees: number;
  backgroundColor: string;
};

export type ArmyPaletteSwatch = {
  id: string;
  color: string;
};

export type ArmyBattlefield = {
  pieces: readonly ArmyFormationPiece[];
  palette: readonly ArmyPaletteSwatch[];
  selectedPieceIds: readonly string[];
  selectedSwatchId: string | null;
  activeBackgroundColor: string;
  heightPx: number;
  fieldBackgroundColor: string;
  backgroundImageUrl: string;
};

export type ArmyFormationDocument = {
  version: typeof ARMY_FORMATION_VERSION;
  activeBattlefieldIndex: 0 | 1 | 2 | 3;
  battlefields: readonly [ArmyBattlefield, ArmyBattlefield, ArmyBattlefield, ArmyBattlefield];
};

type ArmyBattlefieldTuple = ArmyFormationDocument['battlefields'];

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

function formatReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    value === null
  ) {
    return String(value);
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      return String(value);
    }

    return serialized;
  } catch (error) {
    if (error instanceof TypeError) {
      return String(value);
    }

    throw error;
  }
}

function readPlainObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${formatReceivedValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function readNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string, received ${formatReceivedValue(value)}.`);
  }

  return value;
}

function readFiniteNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number, received ${formatReceivedValue(value)}.`);
  }

  return value;
}

function readArmyFormationPiecePoint(
  value: unknown,
): Readonly<{ x: number; y: number }> {
  const point = readPlainObject(value, 'Piece point');

  return {
    x: readFiniteNumber(point.x, 'Piece x'),
    y: readFiniteNumber(point.y, 'Piece y'),
  };
}

function readHexColor(value: unknown, label: string): string {
  if (typeof value !== 'string' || !HEX_COLOR_PATTERN.test(value)) {
    throw new Error(
      `${label} must be # followed by 6 hex digits, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readRotationDegrees(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(
      `Rotation degrees must be a finite number, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readBattlefieldHeightPx(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < MIN_BATTLEFIELD_HEIGHT_PX ||
    value > MAX_BATTLEFIELD_HEIGHT_PX
  ) {
    throw new Error(
      `Battlefield height must be a finite number from ${MIN_BATTLEFIELD_HEIGHT_PX} to ${MAX_BATTLEFIELD_HEIGHT_PX}, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readFieldWidthPx(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value > MAX_FIELD_WIDTH_PX) {
    throw new Error(
      `Field width must be a finite number no greater than ${MAX_FIELD_WIDTH_PX}, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readBackgroundImageUrl(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error(
      `Background image URL must be a string, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readBattlefieldStepDirection(value: unknown): -1 | 1 {
  if (value !== -1 && value !== 1) {
    throw new Error(
      `Battlefield step direction must be -1 or 1, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readVersion(value: unknown): typeof ARMY_FORMATION_VERSION {
  if (value !== ARMY_FORMATION_VERSION) {
    throw new Error(
      `Army formation document version must be ${ARMY_FORMATION_VERSION}, received ${formatReceivedValue(value)}.`,
    );
  }

  return ARMY_FORMATION_VERSION;
}

function readActiveBattlefieldIndex(value: unknown): 0 | 1 | 2 | 3 {
  if (value !== 0 && value !== 1 && value !== 2 && value !== 3) {
    throw new Error(
      `Active battlefield index must be 0, 1, 2, or 3, received ${formatReceivedValue(value)}.`,
    );
  }

  return value;
}

function readBattlefieldValues(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length !== ARMY_BATTLEFIELD_COUNT) {
    const received = Array.isArray(value) ? value.length : value;
    throw new Error(
      `Army formation document must contain ${ARMY_BATTLEFIELD_COUNT} battlefields, received ${formatReceivedValue(received)}.`,
    );
  }

  return value;
}

function requireBattlefieldTuple(battlefields: readonly ArmyBattlefield[]): ArmyBattlefieldTuple {
  if (battlefields.length !== ARMY_BATTLEFIELD_COUNT) {
    throw new Error(
      `Army formation document must contain ${ARMY_BATTLEFIELD_COUNT} battlefields, received ${formatReceivedValue(battlefields.length)}.`,
    );
  }

  const firstBattlefield = battlefields[0];
  const secondBattlefield = battlefields[1];
  const thirdBattlefield = battlefields[2];
  const fourthBattlefield = battlefields[3];

  if (
    firstBattlefield === undefined ||
    secondBattlefield === undefined ||
    thirdBattlefield === undefined ||
    fourthBattlefield === undefined
  ) {
    throw new Error(
      `Army formation document must contain ${ARMY_BATTLEFIELD_COUNT} battlefields, received ${formatReceivedValue(battlefields.length)}.`,
    );
  }

  return [firstBattlefield, secondBattlefield, thirdBattlefield, fourthBattlefield];
}

function readArmyFormationPiece(value: unknown, pieceIds: Set<string>): ArmyFormationPiece {
  const record = readPlainObject(value, 'Army formation piece');
  const id = readNonEmptyString(record.id, 'Piece id');

  if (pieceIds.has(id)) {
    throw new Error(`Army formation piece id ${JSON.stringify(id)} already exists.`);
  }

  pieceIds.add(id);

  return {
    id,
    iconId: readNonEmptyString(record.iconId, 'Icon id'),
    x: readFiniteNumber(record.x, 'Piece x'),
    y: readFiniteNumber(record.y, 'Piece y'),
    rotationDegrees: readRotationDegrees(record.rotationDegrees),
    backgroundColor: readHexColor(record.backgroundColor, 'Piece background color'),
  };
}

function readPieces(value: unknown): ArmyFormationPiece[] {
  if (!Array.isArray(value)) {
    throw new Error(`Pieces must be an array, received ${formatReceivedValue(value)}.`);
  }

  const pieceIds = new Set<string>();
  return value.map((entry) => readArmyFormationPiece(entry, pieceIds));
}

function readPaletteSwatch(value: unknown, swatchIds: Set<string>): ArmyPaletteSwatch {
  const record = readPlainObject(value, 'Palette swatch');
  const id = readNonEmptyString(record.id, 'Palette swatch id');

  if (swatchIds.has(id)) {
    throw new Error(`Army formation palette swatch id ${JSON.stringify(id)} already exists.`);
  }

  swatchIds.add(id);

  return {
    id,
    color: readHexColor(record.color, 'Palette color'),
  };
}

function readPalette(value: unknown): ArmyPaletteSwatch[] {
  if (!Array.isArray(value)) {
    throw new Error(`Palette must be an array, received ${formatReceivedValue(value)}.`);
  }

  const swatchIds = new Set<string>();
  return value.map((entry) => readPaletteSwatch(entry, swatchIds));
}

function readSelectedPieceIds(value: unknown, pieces: readonly ArmyFormationPiece[]): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Selected piece ids must be an array, received ${formatReceivedValue(value)}.`);
  }

  const pieceIds = new Set(pieces.map((piece) => piece.id));
  const seenSelectedIds = new Set<string>();
  const selectedPieceIds: string[] = [];

  for (const entry of value) {
    const pieceId = readNonEmptyString(entry, 'Selected piece id');

    if (!pieceIds.has(pieceId)) {
      throw new Error(`Army formation piece id ${JSON.stringify(pieceId)} was not found.`);
    }

    if (seenSelectedIds.has(pieceId)) {
      throw new Error(`Army formation piece id ${JSON.stringify(pieceId)} already exists.`);
    }

    seenSelectedIds.add(pieceId);
    selectedPieceIds.push(pieceId);
  }

  return selectedPieceIds;
}

function readSelectedSwatchId(value: unknown, palette: readonly ArmyPaletteSwatch[]): string | null {
  if (value === null) {
    return null;
  }

  const swatchId = readNonEmptyString(value, 'Selected palette swatch id');
  const swatchExists = palette.some((swatch) => swatch.id === swatchId);

  if (!swatchExists) {
    throw new Error(`Army formation palette swatch id ${JSON.stringify(swatchId)} was not found.`);
  }

  return swatchId;
}

function readBattlefield(value: unknown): ArmyBattlefield {
  const record = readPlainObject(value, 'Battlefield');
  const pieces = readPieces(record.pieces);
  const palette = readPalette(record.palette);

  return {
    pieces,
    palette,
    selectedPieceIds: readSelectedPieceIds(record.selectedPieceIds, pieces),
    selectedSwatchId: readSelectedSwatchId(record.selectedSwatchId, palette),
    activeBackgroundColor: readHexColor(record.activeBackgroundColor, 'Active background color'),
    heightPx: readBattlefieldHeightPx(record.heightPx),
    fieldBackgroundColor: readHexColor(record.fieldBackgroundColor, 'Field background color'),
    backgroundImageUrl: readBackgroundImageUrl(record.backgroundImageUrl),
  };
}

function readBattlefields(value: unknown): ArmyBattlefieldTuple {
  return requireBattlefieldTuple(readBattlefieldValues(value).map(readBattlefield));
}

function readArmyFormationDocument(value: unknown): ArmyFormationDocument {
  const record = readPlainObject(value, 'Army formation document');

  return {
    version: readVersion(record.version),
    activeBattlefieldIndex: readActiveBattlefieldIndex(record.activeBattlefieldIndex),
    battlefields: readBattlefields(record.battlefields),
  };
}

function parseSerializedDocument(serialized: unknown): unknown {
  if (typeof serialized !== 'string') {
    throw new Error(
      `Army formation document JSON is invalid, received ${formatReceivedValue(serialized)}.`,
    );
  }

  try {
    return JSON.parse(serialized);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Army formation document JSON is invalid, received ${JSON.stringify(serialized)}. ${error.message}`,
      );
    }

    throw error;
  }
}

function createEmptyBattlefield(): ArmyBattlefield {
  return {
    pieces: [],
    palette: [],
    selectedPieceIds: [],
    selectedSwatchId: null,
    activeBackgroundColor: DEFAULT_BACKGROUND_COLOR,
    heightPx: DEFAULT_BATTLEFIELD_HEIGHT_PX,
    fieldBackgroundColor: DEFAULT_BACKGROUND_COLOR,
    backgroundImageUrl: '',
  };
}

function createEmptyBattlefields(): ArmyBattlefieldTuple {
  return requireBattlefieldTuple([
    createEmptyBattlefield(),
    createEmptyBattlefield(),
    createEmptyBattlefield(),
    createEmptyBattlefield(),
  ]);
}

function withActiveBattlefield(
  document: ArmyFormationDocument,
  updateBattlefield: (battlefield: ArmyBattlefield) => ArmyBattlefield,
): ArmyFormationDocument {
  const battlefields = document.battlefields.map((battlefield, index) => {
    if (index !== document.activeBattlefieldIndex) {
      return battlefield;
    }

    return updateBattlefield(battlefield);
  });

  return {
    version: document.version,
    activeBattlefieldIndex: document.activeBattlefieldIndex,
    battlefields: requireBattlefieldTuple(battlefields),
  };
}

function pieceRectanglesOverlap(
  firstX: number,
  firstY: number,
  secondX: number,
  secondY: number,
): boolean {
  const separatedHorizontally =
    firstX + ARMY_PIECE_WIDTH <= secondX || secondX + ARMY_PIECE_WIDTH <= firstX;
  const separatedVertically =
    firstY + ARMY_PIECE_HEIGHT <= secondY || secondY + ARMY_PIECE_HEIGHT <= firstY;

  return !separatedHorizontally && !separatedVertically;
}

function pieceOriginIsBlocked(
  pieces: readonly ArmyFormationPiece[],
  originX: number,
  originY: number,
): boolean {
  return pieces.some((piece) => pieceRectanglesOverlap(piece.x, piece.y, originX, originY));
}

function findOpenPieceOrigin(
  pieces: readonly ArmyFormationPiece[],
  fieldWidthPx: number,
  fieldHeightPx: number,
): { x: number; y: number } {
  const maxX = fieldWidthPx - ARMY_PIECE_WIDTH;
  const maxY = fieldHeightPx - ARMY_PIECE_HEIGHT;

  for (let y = 0; y <= maxY; y += ARMY_PLACEMENT_STEP_PX) {
    for (let x = 0; x <= maxX; x += ARMY_PLACEMENT_STEP_PX) {
      if (!pieceOriginIsBlocked(pieces, x, y)) {
        return { x, y };
      }
    }
  }

  throw new Error(
    `No open position for a new piece on a field of width ${fieldWidthPx} and height ${fieldHeightPx} with existing piece count ${pieces.length}.`,
  );
}

function assertPieceIdAvailable(pieces: readonly ArmyFormationPiece[], pieceId: string): void {
  if (pieces.some((piece) => piece.id === pieceId)) {
    throw new Error(`Army formation piece id ${JSON.stringify(pieceId)} already exists.`);
  }
}

function requirePiece(pieces: readonly ArmyFormationPiece[], pieceId: string): ArmyFormationPiece {
  const piece = pieces.find((candidate) => candidate.id === pieceId);

  if (piece === undefined) {
    throw new Error(`Army formation piece id ${JSON.stringify(pieceId)} was not found.`);
  }

  return piece;
}

function requireSwatch(palette: readonly ArmyPaletteSwatch[], swatchId: string): ArmyPaletteSwatch {
  const swatch = palette.find((candidate) => candidate.id === swatchId);

  if (swatch === undefined) {
    throw new Error(`Army formation palette swatch id ${JSON.stringify(swatchId)} was not found.`);
  }

  return swatch;
}

function readPieceBackgroundColor(battlefield: ArmyBattlefield): string {
  if (battlefield.selectedSwatchId === null) {
    return DEFAULT_BACKGROUND_COLOR;
  }

  return requireSwatch(battlefield.palette, battlefield.selectedSwatchId).color;
}

function createArmyFormationPiece(
  pieceId: string,
  iconId: string,
  originX: number,
  originY: number,
  backgroundColor: string,
): ArmyFormationPiece {
  return {
    id: pieceId,
    iconId,
    x: originX,
    y: originY,
    rotationDegrees: 0,
    backgroundColor,
  };
}

function replaceBattlefieldPieces(
  battlefield: ArmyBattlefield,
  pieces: readonly ArmyFormationPiece[],
): ArmyBattlefield {
  return {
    ...battlefield,
    pieces,
  };
}

function appendPiece(
  battlefield: ArmyBattlefield,
  iconId: string,
  pieceId: string,
  fieldWidthPx: number,
): ArmyBattlefield {
  assertPieceIdAvailable(battlefield.pieces, pieceId);
  const origin = findOpenPieceOrigin(battlefield.pieces, fieldWidthPx, battlefield.heightPx);
  const piece = createArmyFormationPiece(
    pieceId,
    iconId,
    origin.x,
    origin.y,
    readPieceBackgroundColor(battlefield),
  );

  return replaceBattlefieldPieces(battlefield, [...battlefield.pieces, piece]);
}

function appendPieceAtPoint(
  battlefield: ArmyBattlefield,
  iconId: string,
  pieceId: string,
  point: Readonly<{ x: number; y: number }>,
): ArmyBattlefield {
  assertPieceIdAvailable(battlefield.pieces, pieceId);
  const piece = createArmyFormationPiece(
    pieceId,
    iconId,
    point.x,
    point.y,
    readPieceBackgroundColor(battlefield),
  );
  const battlefieldWithPiece = replaceBattlefieldPieces(battlefield, [...battlefield.pieces, piece]);

  return {
    ...battlefieldWithPiece,
    selectedPieceIds: [pieceId],
  };
}

function snapToPlacementGrid(coordinatePx: number): number {
  const snapped = Math.round(coordinatePx / ARMY_PLACEMENT_STEP_PX) * ARMY_PLACEMENT_STEP_PX;
  if (!Number.isFinite(snapped)) {
    throw new Error(
      `Piece coordinate snap produced a non-finite value. coordinate=${formatReceivedValue(coordinatePx)} snapped=${formatReceivedValue(snapped)}.`,
    );
  }

  if (Object.is(snapped, -0)) {
    return 0;
  }

  return snapped;
}

function assertPieceInsideField(
  requestedX: number,
  requestedY: number,
  snappedX: number,
  snappedY: number,
  fieldWidthPx: number,
  fieldHeightPx: number,
): void {
  const inside =
    snappedX >= 0 &&
    snappedY >= 0 &&
    snappedX + ARMY_PIECE_WIDTH <= fieldWidthPx &&
    snappedY + ARMY_PIECE_HEIGHT <= fieldHeightPx;

  if (!inside) {
    throw new Error(
      `Piece position x=${formatReceivedValue(requestedX)}, y=${formatReceivedValue(requestedY)} is outside a field of width ${fieldWidthPx} and height ${fieldHeightPx}.`,
    );
  }
}

function replacePieceOrigin(
  pieces: readonly ArmyFormationPiece[],
  pieceId: string,
  snappedX: number,
  snappedY: number,
): ArmyFormationPiece[] {
  return pieces.map((piece) =>
    piece.id === pieceId ? { ...piece, x: snappedX, y: snappedY } : piece,
  );
}

function movePiece(
  battlefield: ArmyBattlefield,
  pieceId: string,
  requestedX: number,
  requestedY: number,
  fieldWidthPx: number,
): ArmyBattlefield {
  const piece = requirePiece(battlefield.pieces, pieceId);
  const snappedX = snapToPlacementGrid(requestedX);
  const snappedY = snapToPlacementGrid(requestedY);
  assertPieceInsideField(
    requestedX,
    requestedY,
    snappedX,
    snappedY,
    fieldWidthPx,
    battlefield.heightPx,
  );

  return replaceBattlefieldPieces(
    battlefield,
    replacePieceOrigin(battlefield.pieces, piece.id, snappedX, snappedY),
  );
}

function movePieceAtPoint(
  battlefield: ArmyBattlefield,
  pieceId: string,
  point: Readonly<{ x: number; y: number }>,
): ArmyBattlefield {
  const piece = requirePiece(battlefield.pieces, pieceId);
  const snappedX = snapToPlacementGrid(point.x);
  const snappedY = snapToPlacementGrid(point.y);

  return replaceBattlefieldPieces(
    battlefield,
    replacePieceOrigin(battlefield.pieces, piece.id, snappedX, snappedY),
  );
}

function togglePieceSelection(battlefield: ArmyBattlefield, pieceId: string): ArmyBattlefield {
  const piece = requirePiece(battlefield.pieces, pieceId);
  const selectedPieceIds = battlefield.selectedPieceIds.includes(piece.id)
    ? battlefield.selectedPieceIds.filter((selectedPieceId) => selectedPieceId !== piece.id)
    : [...battlefield.selectedPieceIds, piece.id];

  return {
    ...battlefield,
    selectedPieceIds,
  };
}

function deleteSelectedPieces(battlefield: ArmyBattlefield): ArmyBattlefield {
  if (battlefield.selectedPieceIds.length === 0) {
    return battlefield;
  }

  const selectedPieceIds = new Set(battlefield.selectedPieceIds);

  return {
    ...battlefield,
    pieces: battlefield.pieces.filter((piece) => !selectedPieceIds.has(piece.id)),
    selectedPieceIds: [],
  };
}

function clearPieces(battlefield: ArmyBattlefield): ArmyBattlefield {
  return {
    ...battlefield,
    pieces: [],
    selectedPieceIds: [],
  };
}

function rotateSelectedPieces(
  battlefield: ArmyBattlefield,
  rotationDegrees: number,
): ArmyBattlefield {
  if (battlefield.selectedPieceIds.length === 0) {
    return battlefield;
  }

  const selectedPieceIds = new Set(battlefield.selectedPieceIds);

  return replaceBattlefieldPieces(
    battlefield,
    battlefield.pieces.map((piece) =>
      selectedPieceIds.has(piece.id)
        ? { ...piece, rotationDegrees: piece.rotationDegrees + rotationDegrees }
        : piece,
    ),
  );
}

function assertSwatchIdAvailable(palette: readonly ArmyPaletteSwatch[], swatchId: string): void {
  if (palette.some((swatch) => swatch.id === swatchId)) {
    throw new Error(`Army formation palette swatch id ${JSON.stringify(swatchId)} already exists.`);
  }
}

function appendSwatch(
  battlefield: ArmyBattlefield,
  swatchId: string,
  color: string,
): ArmyBattlefield {
  assertSwatchIdAvailable(battlefield.palette, swatchId);

  return {
    ...battlefield,
    palette: [...battlefield.palette, { id: swatchId, color }],
  };
}

function selectSwatch(battlefield: ArmyBattlefield, swatchId: string): ArmyBattlefield {
  const swatch = requireSwatch(battlefield.palette, swatchId);

  if (battlefield.selectedSwatchId === swatch.id) {
    return {
      ...battlefield,
      selectedSwatchId: null,
      activeBackgroundColor: DEFAULT_BACKGROUND_COLOR,
    };
  }

  return {
    ...battlefield,
    selectedSwatchId: swatch.id,
    activeBackgroundColor: swatch.color,
  };
}

function deleteSelectedSwatch(battlefield: ArmyBattlefield): ArmyBattlefield {
  if (battlefield.selectedSwatchId === null) {
    throw new Error(
      `Army formation palette swatch id ${formatReceivedValue(battlefield.selectedSwatchId)} was not found.`,
    );
  }

  const selectedSwatchId = battlefield.selectedSwatchId;
  requireSwatch(battlefield.palette, selectedSwatchId);

  return {
    ...battlefield,
    palette: battlefield.palette.filter((swatch) => swatch.id !== selectedSwatchId),
    selectedSwatchId: null,
    activeBackgroundColor: DEFAULT_BACKGROUND_COLOR,
  };
}

function replaceBattlefieldHeight(battlefield: ArmyBattlefield, heightPx: number): ArmyBattlefield {
  return {
    ...battlefield,
    heightPx,
  };
}

function replaceFieldBackgroundColor(battlefield: ArmyBattlefield, color: string): ArmyBattlefield {
  return {
    ...battlefield,
    fieldBackgroundColor: color,
  };
}

function replaceBackgroundImageUrl(
  battlefield: ArmyBattlefield,
  backgroundImageUrl: string,
): ArmyBattlefield {
  return {
    ...battlefield,
    backgroundImageUrl,
  };
}

function nextBattlefieldIndex(
  activeBattlefieldIndex: 0 | 1 | 2 | 3,
  direction: -1 | 1,
): 0 | 1 | 2 | 3 {
  const wrappedIndex =
    (activeBattlefieldIndex + direction + ARMY_BATTLEFIELD_COUNT) % ARMY_BATTLEFIELD_COUNT;

  return readActiveBattlefieldIndex(wrappedIndex);
}

export function createEmptyArmyFormationDocument(): ArmyFormationDocument {
  return {
    version: ARMY_FORMATION_VERSION,
    activeBattlefieldIndex: 0,
    battlefields: createEmptyBattlefields(),
  };
}

export function addArmyFormationPiece(
  document: ArmyFormationDocument,
  iconId: string,
  pieceId: string,
  fieldWidthPx: number,
): ArmyFormationDocument {
  const validatedIconId = readNonEmptyString(iconId, 'Icon id');
  const validatedPieceId = readNonEmptyString(pieceId, 'Piece id');
  const validatedFieldWidthPx = readFieldWidthPx(fieldWidthPx);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    appendPiece(battlefield, validatedIconId, validatedPieceId, validatedFieldWidthPx),
  );
}

export function addArmyFormationPieceAtPoint(
  document: ArmyFormationDocument,
  iconId: string,
  pieceId: string,
  point: Readonly<{ x: number; y: number }>,
): ArmyFormationDocument {
  const validatedIconId = readNonEmptyString(iconId, 'Icon id');
  const validatedPieceId = readNonEmptyString(pieceId, 'Piece id');
  const validatedPoint = readArmyFormationPiecePoint(point);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    appendPieceAtPoint(battlefield, validatedIconId, validatedPieceId, validatedPoint),
  );
}

export function moveArmyFormationPiece(
  document: ArmyFormationDocument,
  pieceId: string,
  x: number,
  y: number,
  fieldWidthPx: number,
): ArmyFormationDocument {
  const validatedPieceId = readNonEmptyString(pieceId, 'Piece id');
  const validatedX = readFiniteNumber(x, 'Piece x');
  const validatedY = readFiniteNumber(y, 'Piece y');
  const validatedFieldWidthPx = readFieldWidthPx(fieldWidthPx);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    movePiece(battlefield, validatedPieceId, validatedX, validatedY, validatedFieldWidthPx),
  );
}

export function moveArmyFormationPieceAtPoint(
  document: ArmyFormationDocument,
  pieceId: string,
  point: Readonly<{ x: number; y: number }>,
): ArmyFormationDocument {
  const validatedPieceId = readNonEmptyString(pieceId, 'Piece id');
  const validatedPoint = readArmyFormationPiecePoint(point);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    movePieceAtPoint(battlefield, validatedPieceId, validatedPoint),
  );
}

export function toggleArmyFormationPieceSelection(
  document: ArmyFormationDocument,
  pieceId: string,
): ArmyFormationDocument {
  const validatedPieceId = readNonEmptyString(pieceId, 'Piece id');

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    togglePieceSelection(battlefield, validatedPieceId),
  );
}

export function deleteSelectedArmyFormationPieces(
  document: ArmyFormationDocument,
): ArmyFormationDocument {
  return withActiveBattlefield(readArmyFormationDocument(document), deleteSelectedPieces);
}

export function clearArmyFormationPieces(document: ArmyFormationDocument): ArmyFormationDocument {
  return withActiveBattlefield(readArmyFormationDocument(document), clearPieces);
}

export function rotateSelectedArmyFormationPieces(
  document: ArmyFormationDocument,
  rotationDegrees: number,
): ArmyFormationDocument {
  const validatedRotationDegrees = readRotationDegrees(rotationDegrees);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    rotateSelectedPieces(battlefield, validatedRotationDegrees),
  );
}

export function addArmyPaletteSwatch(
  document: ArmyFormationDocument,
  swatchId: string,
  color: string,
): ArmyFormationDocument {
  const validatedSwatchId = readNonEmptyString(swatchId, 'Palette swatch id');
  const validatedColor = readHexColor(color, 'Palette color');

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    appendSwatch(battlefield, validatedSwatchId, validatedColor),
  );
}

export function selectArmyPaletteSwatch(
  document: ArmyFormationDocument,
  swatchId: string,
): ArmyFormationDocument {
  const validatedSwatchId = readNonEmptyString(swatchId, 'Palette swatch id');

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    selectSwatch(battlefield, validatedSwatchId),
  );
}

export function deleteSelectedArmyPaletteSwatch(
  document: ArmyFormationDocument,
): ArmyFormationDocument {
  return withActiveBattlefield(readArmyFormationDocument(document), deleteSelectedSwatch);
}

export function setArmyBattlefieldHeight(
  document: ArmyFormationDocument,
  heightPx: number,
): ArmyFormationDocument {
  const validatedHeightPx = readBattlefieldHeightPx(heightPx);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    replaceBattlefieldHeight(battlefield, validatedHeightPx),
  );
}

export function setArmyFieldBackgroundColor(
  document: ArmyFormationDocument,
  color: string,
): ArmyFormationDocument {
  const validatedColor = readHexColor(color, 'Field background color');

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    replaceFieldBackgroundColor(battlefield, validatedColor),
  );
}

export function setArmyBackgroundImageUrl(
  document: ArmyFormationDocument,
  backgroundImageUrl: string,
): ArmyFormationDocument {
  const validatedBackgroundImageUrl = readBackgroundImageUrl(backgroundImageUrl);

  return withActiveBattlefield(readArmyFormationDocument(document), (battlefield) =>
    replaceBackgroundImageUrl(battlefield, validatedBackgroundImageUrl),
  );
}

export function setArmyBackgroundImageUrlForBattlefield(
  document: ArmyFormationDocument,
  battlefieldIndex: number,
  backgroundImageUrl: string,
): ArmyFormationDocument {
  const current = readArmyFormationDocument(document);
  const validatedBattlefieldIndex = readActiveBattlefieldIndex(battlefieldIndex);
  const validatedBackgroundImageUrl = readBackgroundImageUrl(backgroundImageUrl);
  const battlefields = current.battlefields.map((battlefield, index) => {
    if (index !== validatedBattlefieldIndex) {
      return battlefield;
    }

    return replaceBackgroundImageUrl(battlefield, validatedBackgroundImageUrl);
  });

  return {
    version: current.version,
    activeBattlefieldIndex: current.activeBattlefieldIndex,
    battlefields: requireBattlefieldTuple(battlefields),
  };
}

export function stepArmyBattlefield(
  document: ArmyFormationDocument,
  direction: -1 | 1,
): ArmyFormationDocument {
  const validatedDirection = readBattlefieldStepDirection(direction);
  const current = readArmyFormationDocument(document);

  return {
    version: current.version,
    activeBattlefieldIndex: nextBattlefieldIndex(current.activeBattlefieldIndex, validatedDirection),
    battlefields: current.battlefields,
  };
}

export function serializeArmyFormationDocument(document: ArmyFormationDocument): string {
  return JSON.stringify(readArmyFormationDocument(document));
}

export function parseArmyFormationDocument(serialized: string): ArmyFormationDocument {
  return readArmyFormationDocument(parseSerializedDocument(serialized));
}
