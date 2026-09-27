import {
  ARMOR_PREVIEW_HEIGHT,
  ARMOR_PREVIEW_WIDTH,
  pieceGender,
  pieceMaterial,
  pieceSlot,
  requireArmorGender,
  requireArmorMaterial,
  requireArmorPieceId,
  requireArmorSlot,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import { armorPieceSvg } from '@/lib/armor-creator/icons';
import type { ArmorSelection } from '@/lib/armor-creator/selection';

const ARMOR_RENDER_SLOTS = [
  'wing',
  'cloakBack',
  'body',
  'feetBack',
  'legs',
  'feet',
  'gloves',
  'chest',
  'cloakFront',
  'shoulderLeft',
  'shoulderRight',
  'helm',
  'crown',
] as const;

export type ArmorRenderSlot = (typeof ARMOR_RENDER_SLOTS)[number];

export type ArmorRenderLayer = {
  slot: ArmorRenderSlot;
  pieceId: string | null;
  mirror: boolean;
  flatChest: boolean;
};

type ArmorLayerBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ArmorDrawContext = {
  canvas: { width: number; height: number };
  clearRect: (x: number, y: number, width: number, height: number) => void;
  save: () => void;
  restore: () => void;
  translate: (x: number, y: number) => void;
  scale: (x: number, y: number) => void;
  drawImage: (image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number) => void;
};

type ArmorPngCanvas = {
  toBlob: (callback: (blob: Blob | null) => void, type?: string) => void;
};

const PIECE_SVG_SIZE = 64;

const ARMOR_LAYER_BOXES: Record<ArmorRenderSlot, ArmorLayerBox> = {
  wing: { x: 150, y: 100, width: 300, height: 220 },
  cloakBack: { x: 210, y: 120, width: 180, height: 300 },
  body: { x: 0, y: 0, width: ARMOR_PREVIEW_WIDTH, height: ARMOR_PREVIEW_HEIGHT },
  feetBack: { x: 235, y: 390, width: 130, height: 40 },
  legs: { x: 245, y: 275, width: 110, height: 140 },
  feet: { x: 225, y: 400, width: 150, height: 60 },
  gloves: { x: 175, y: 210, width: 250, height: 70 },
  chest: { x: 245, y: 130, width: 110, height: 130 },
  cloakFront: { x: 215, y: 145, width: 170, height: 250 },
  shoulderLeft: { x: 185, y: 125, width: 75, height: 75 },
  shoulderRight: { x: 340, y: 125, width: 75, height: 75 },
  helm: { x: 250, y: 24, width: 100, height: 100 },
  crown: { x: 245, y: 4, width: 110, height: 64 },
};

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireSelectionBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Armor selection ${fieldName} must be a boolean. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireEquippedPieceIds(value: unknown): Partial<Record<ArmorSlot, string>> {
  if (!isPlainObject(value)) {
    throw new Error(
      `Armor equipped pieces must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  const equippedPieceIds: Partial<Record<ArmorSlot, string>> = {};

  for (const key of Object.keys(value)) {
    const slot = requireArmorSlot(key);
    const pieceId = value[key];
    if (pieceId === undefined) {
      throw new Error(
        `Armor equipped piece for slot ${JSON.stringify(slot)} is undefined. Received ${describeReceivedValue(pieceId)}.`,
      );
    }

    const validPieceId = requireArmorPieceId(pieceId);
    const ownerSlot = pieceSlot(validPieceId);
    if (ownerSlot !== slot) {
      throw new Error(
        `Armor piece ${JSON.stringify(validPieceId)} is equipped on ${JSON.stringify(slot)} but belongs to ${JSON.stringify(ownerSlot)}.`,
      );
    }

    equippedPieceIds[slot] = validPieceId;
  }

  return equippedPieceIds;
}

function requireArmorSelection(selection: unknown): ArmorSelection {
  if (!isPlainObject(selection)) {
    throw new Error(
      `Armor selection must be an object. Received ${describeReceivedValue(selection)}.`,
    );
  }

  return {
    gender: requireArmorGender(selection.gender),
    material: requireArmorMaterial(selection.material),
    shoulderSymmetry: requireSelectionBoolean(selection.shoulderSymmetry, 'shoulderSymmetry'),
    chestCurve: requireSelectionBoolean(selection.chestCurve, 'chestCurve'),
    equippedPieceIds: requireEquippedPieceIds(selection.equippedPieceIds),
  };
}

function equippedPieceId(selection: ArmorSelection, slot: ArmorSlot): string | null {
  const pieceId = selection.equippedPieceIds[slot];
  if (pieceId === undefined) {
    return null;
  }

  return pieceId;
}

function chestIsFlat(selection: ArmorSelection, pieceId: string): boolean {
  if (selection.chestCurve !== false) {
    return false;
  }

  return pieceGender(pieceId) === 'female' && pieceMaterial(pieceId) === 'plate';
}

function emptyLayer(slot: ArmorRenderSlot): ArmorRenderLayer {
  return {
    slot,
    pieceId: null,
    mirror: false,
    flatChest: false,
  };
}

function pieceLayer(
  slot: ArmorSlot | 'feetBack',
  pieceId: string,
  mirror: boolean,
  flatChest: boolean,
): ArmorRenderLayer {
  return {
    slot,
    pieceId,
    mirror,
    flatChest,
  };
}

function feetBackLayer(selection: ArmorSelection): ArmorRenderLayer | null {
  const pieceId = equippedPieceId(selection, 'feet');
  if (pieceId === null) {
    return null;
  }

  return pieceLayer('feetBack', pieceId, false, false);
}

function equippedRenderLayer(selection: ArmorSelection, slot: ArmorSlot): ArmorRenderLayer | null {
  const pieceId = equippedPieceId(selection, slot);
  if (pieceId === null) {
    return null;
  }

  const flatChest = slot === 'chest' && chestIsFlat(selection, pieceId);
  return pieceLayer(slot, pieceId, slot === 'shoulderLeft', flatChest);
}

function renderLayerForSlot(selection: ArmorSelection, slot: ArmorRenderSlot): ArmorRenderLayer | null {
  if (slot === 'body') {
    return emptyLayer('body');
  }

  if (slot === 'feetBack') {
    return feetBackLayer(selection);
  }

  return equippedRenderLayer(selection, slot);
}

export function listArmorRenderLayers(selection: ArmorSelection): ArmorRenderLayer[] {
  const armorSelection = requireArmorSelection(selection);
  const layers: ArmorRenderLayer[] = [];

  for (const slot of ARMOR_RENDER_SLOTS) {
    const layer = renderLayerForSlot(armorSelection, slot);
    if (layer !== null) {
      layers.push(layer);
    }
  }

  return layers;
}

function layerBox(slot: ArmorRenderSlot): ArmorLayerBox {
  const box = ARMOR_LAYER_BOXES[slot];
  if (box.width < 1 || box.height < 1) {
    throw new Error(
      `Armor layer ${JSON.stringify(slot)} has an empty preview box ${box.width}x${box.height}.`,
    );
  }

  return box;
}

const FIGURE_SKIN = '#e6d3b1';
const FIGURE_TORSO = '#c4a574';
const FIGURE_STROKE = '#1a140f';

function figurePaint(fill: string): string {
  return `fill="${fill}" stroke="${FIGURE_STROKE}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
}

function figureLegsMarkup(): string {
  const paint = figurePaint(FIGURE_SKIN);
  return [
    `<path ${paint} d="M 248 250 C 244 320 246 390 250 430 C 254 456 236 472 286 474 L 324 474 L 330 430 L 318 280 L 300 248 Z"/>`,
    `<path ${paint} d="M 352 250 C 356 320 354 390 350 430 C 346 456 364 472 314 474 L 276 474 L 270 430 L 282 280 L 300 248 Z"/>`,
  ].join('');
}

function figureArmsMarkup(): string {
  const paint = figurePaint(FIGURE_SKIN);
  return [
    `<path ${paint} d="M 300 170 C 246 162 186 180 174 214 C 164 242 170 270 206 276 L 300 280 Z"/>`,
    `<path ${paint} d="M 300 170 C 354 162 414 180 426 214 C 436 242 430 270 394 276 L 300 280 Z"/>`,
  ].join('');
}

function figureNeckMarkup(): string {
  return `<path ${figurePaint(FIGURE_SKIN)} d="M 290 96 L 288 120 L 272 190 L 328 190 L 312 120 L 310 96 Z"/>`;
}

function figureTorsoMarkup(): string {
  return `<path ${figurePaint(FIGURE_TORSO)} d="M 284 164 C 248 160 224 170 216 188 L 226 250 C 236 280 254 302 274 306 L 326 306 C 346 302 364 280 374 250 L 384 188 C 376 170 352 160 316 164 Q 300 184 284 164 Z"/>`;
}

function figureHeadMarkup(): string {
  return `<ellipse cx="300" cy="74" rx="42" ry="46" ${figurePaint(FIGURE_SKIN)}/>`;
}

function bodySvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">',
    figureLegsMarkup(),
    figureArmsMarkup(),
    figureNeckMarkup(),
    figureTorsoMarkup(),
    figureHeadMarkup(),
    '</svg>',
  ].join('');
}

function svgWithPixelSize(svg: string, width: number, height: number, label: string): string {
  const openTagEnd = svg.indexOf('>');
  if (!svg.startsWith('<svg') || openTagEnd < 0) {
    throw new Error(
      `Armor SVG for ${JSON.stringify(label)} is not an <svg> element. Received ${JSON.stringify(svg.slice(0, 80))}.`,
    );
  }

  if (svg.slice(0, openTagEnd).includes('width=')) {
    return svg;
  }

  return `<svg width="${width}" height="${height}"${svg.slice(4)}`;
}

function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function loadSvgImage(svg: string, label: string): Promise<CanvasImageSource> {
  if (svg.length === 0) {
    throw new Error(`Armor SVG for ${JSON.stringify(label)} is empty.`);
  }

  const ImageConstructor = globalThis.Image;
  if (typeof ImageConstructor !== 'function') {
    throw new Error(
      `Armor SVG for ${JSON.stringify(label)} cannot be drawn because Image is not a function. Received typeof ${typeof ImageConstructor}.`,
    );
  }

  const sourceUrl = svgDataUrl(svg);
  return new Promise((resolve, reject) => {
    const image = new ImageConstructor();
    image.onload = () => resolve(image);
    image.onerror = () => {
      reject(
        new Error(
          `Armor SVG for ${JSON.stringify(label)} could not be decoded. Received label ${JSON.stringify(label)}.`,
        ),
      );
    };

    try {
      image.src = sourceUrl;
    } catch (error) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      reject(new Error(`Armor SVG for ${JSON.stringify(label)} could not be loaded. ${detail}`));
    }
  });
}

function requireLayerPieceId(layer: ArmorRenderLayer): string {
  if (layer.pieceId === null) {
    throw new Error(
      `Armor layer ${JSON.stringify(layer.slot)} is missing a piece id. Received ${describeReceivedValue(layer.pieceId)}.`,
    );
  }

  return layer.pieceId;
}

function pieceDrawError(pieceId: string, error: unknown): Error {
  const detail = error instanceof Error ? error.message : describeReceivedValue(error);
  if (detail.includes(pieceId) && error instanceof Error) {
    return error;
  }

  return new Error(`Armor piece ${JSON.stringify(pieceId)} failed to draw. ${detail}`);
}

async function loadLayerImage(layer: ArmorRenderLayer): Promise<CanvasImageSource> {
  if (layer.slot === 'body') {
    const svg = svgWithPixelSize(bodySvg(), ARMOR_PREVIEW_WIDTH, ARMOR_PREVIEW_HEIGHT, 'body');
    return loadSvgImage(svg, 'body');
  }

  const pieceId = requireLayerPieceId(layer);
  try {
    const svg = armorPieceSvg(pieceId, layer.flatChest ? { flatChest: true } : undefined);
    return await loadSvgImage(svgWithPixelSize(svg, PIECE_SVG_SIZE, PIECE_SVG_SIZE, pieceId), pieceId);
  } catch (error) {
    throw pieceDrawError(pieceId, error);
  }
}

async function loadLayerImages(layers: readonly ArmorRenderLayer[]): Promise<CanvasImageSource[]> {
  const images: CanvasImageSource[] = [];

  for (const layer of layers) {
    images.push(await loadLayerImage(layer));
  }

  return images;
}

function drawMirroredImage(
  context: ArmorDrawContext,
  image: CanvasImageSource,
  box: ArmorLayerBox,
): void {
  context.save();
  context.translate(box.x + box.width, box.y);
  context.scale(-1, 1);
  context.drawImage(image, 0, 0, box.width, box.height);
  context.restore();
}

function drawLayerImage(
  context: ArmorDrawContext,
  layer: ArmorRenderLayer,
  image: CanvasImageSource,
): void {
  const box = layerBox(layer.slot);
  if (layer.mirror) {
    drawMirroredImage(context, image, box);
    return;
  }

  context.drawImage(image, box.x, box.y, box.width, box.height);
}

function drawLoadedLayer(
  context: ArmorDrawContext,
  layer: ArmorRenderLayer,
  image: CanvasImageSource,
): void {
  if (layer.pieceId === null) {
    drawLayerImage(context, layer, image);
    return;
  }

  try {
    drawLayerImage(context, layer, image);
  } catch (error) {
    throw pieceDrawError(layer.pieceId, error);
  }
}

function requireDrawFunction(context: Record<string, unknown>, name: string): void {
  if (typeof context[name] !== 'function') {
    throw new Error(
      `Armor draw context ${name} must be a function. Received ${describeReceivedValue(context[name])}.`,
    );
  }
}

function requireDrawContext(context: unknown): ArmorDrawContext {
  if (!isPlainObject(context)) {
    throw new Error(`Armor draw context must be an object. Received ${describeReceivedValue(context)}.`);
  }

  if (!isPlainObject(context.canvas)) {
    throw new Error(
      `Armor preview canvas must be an object. Received ${describeReceivedValue(context.canvas)}.`,
    );
  }

  const width = context.canvas.width;
  const height = context.canvas.height;
  if (width !== ARMOR_PREVIEW_WIDTH || height !== ARMOR_PREVIEW_HEIGHT) {
    throw new Error(
      `Armor preview size must be ${ARMOR_PREVIEW_WIDTH}x${ARMOR_PREVIEW_HEIGHT}. Received ${describeReceivedValue(width)}x${describeReceivedValue(height)}.`,
    );
  }

  requireDrawFunction(context, 'clearRect');
  requireDrawFunction(context, 'save');
  requireDrawFunction(context, 'restore');
  requireDrawFunction(context, 'translate');
  requireDrawFunction(context, 'scale');
  requireDrawFunction(context, 'drawImage');
  return context as ArmorDrawContext;
}

export async function drawArmorLayers(
  context: ArmorDrawContext,
  selection: ArmorSelection,
): Promise<void> {
  const drawContext = requireDrawContext(context);
  const layers = listArmorRenderLayers(selection);
  const images = await loadLayerImages(layers);
  drawContext.clearRect(0, 0, ARMOR_PREVIEW_WIDTH, ARMOR_PREVIEW_HEIGHT);

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    const image = images[index];
    if (layer === undefined || image === undefined) {
      throw new Error(
        `Armor layer image at index ${String(index)} is missing. Received layer ${describeReceivedValue(layer)} and image ${describeReceivedValue(image)}.`,
      );
    }

    drawLoadedLayer(drawContext, layer, image);
  }
}

function requirePngCanvas(canvas: unknown): ArmorPngCanvas {
  if (!isPlainObject(canvas)) {
    throw new Error(`Armor PNG canvas must be an object. Received ${describeReceivedValue(canvas)}.`);
  }

  if (typeof canvas.toBlob !== 'function') {
    throw new Error(
      `Armor PNG export requires canvas.toBlob. Received ${describeReceivedValue(canvas.toBlob)}.`,
    );
  }

  return canvas as ArmorPngCanvas;
}

function readPngBlob(canvas: ArmorPngCanvas): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('Armor PNG export returned null.'));
        return;
      }

      if (blob.type !== 'image/png') {
        reject(
          new Error(
            `Armor PNG blob type must be image/png. Received ${JSON.stringify(blob.type)}.`,
          ),
        );
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

export function canvasToArmorPng(canvas: ArmorPngCanvas): Promise<Blob> {
  return readPngBlob(requirePngCanvas(canvas));
}
