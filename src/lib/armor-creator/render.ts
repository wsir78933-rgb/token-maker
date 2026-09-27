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
  type ArmorGender,
  type ArmorMaterial,
  type ArmorSlot,
} from '@/lib/armor-creator/catalog';
import { armorBodyImagePath, armorPieceImagePath } from '@/lib/armor-creator/icons';
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

function fixedLayerBox(slot: ArmorRenderSlot): ArmorLayerBox | null {
  if (slot === 'wing') {
    return { x: 0, y: 0, width: 600, height: 500 };
  }

  if (slot === 'cloakBack') {
    return { x: 219, y: 215, width: 175, height: 260 };
  }

  if (slot === 'body') {
    return { x: 200, y: 102, width: 200, height: 400 };
  }

  if (slot === 'legs') {
    return { x: 239, y: 280, width: 120, height: 180 };
  }

  if (slot === 'gloves') {
    return { x: 220, y: 249, width: 160, height: 90 };
  }

  if (slot === 'crown') {
    return { x: 269, y: 121, width: 60, height: 60 };
  }

  return null;
}

function requireWornMaterial(layer: ArmorRenderLayer): ArmorMaterial {
  const pieceId = requireLayerPieceId(layer);
  const material = pieceMaterial(pieceId);
  if (material === null) {
    throw new Error(
      `Armor piece ${JSON.stringify(pieceId)} on ${JSON.stringify(layer.slot)} has no material. Received null.`,
    );
  }

  return material;
}

function helmLayerBox(material: ArmorMaterial): ArmorLayerBox {
  if (material === 'plate') {
    return { x: 250, y: 105, width: 100, height: 100 };
  }

  if (material === 'leather') {
    return { x: 250, y: 112, width: 100, height: 100 };
  }

  if (material === 'cloth') {
    return { x: 250, y: 106, width: 100, height: 120 };
  }

  throw new Error(`Armor helm material ${JSON.stringify(material)} has no preview box.`);
}

function chestLayerBox(material: ArmorMaterial): ArmorLayerBox {
  if (material === 'plate') {
    return { x: 231, y: 179, width: 135, height: 135 };
  }

  if (material === 'leather') {
    return { x: 230, y: 177, width: 135, height: 166 };
  }

  if (material === 'cloth') {
    return { x: 222, y: 183, width: 155, height: 300 };
  }

  throw new Error(`Armor chest material ${JSON.stringify(material)} has no preview box.`);
}

function cloakFrontLayerBox(material: ArmorMaterial): ArmorLayerBox {
  if (material === 'plate') {
    return { x: 254, y: 164, width: 90, height: 90 };
  }

  if (material === 'leather') {
    return { x: 235, y: 164, width: 130, height: 110 };
  }

  if (material === 'cloth') {
    return { x: 255, y: 188, width: 90, height: 95 };
  }

  throw new Error(`Armor cloak front material ${JSON.stringify(material)} has no preview box.`);
}

function feetLayerBox(material: ArmorMaterial): ArmorLayerBox {
  if (material === 'plate' || material === 'leather') {
    return { x: 239, y: 402, width: 120, height: 120 };
  }

  if (material === 'cloth') {
    return { x: 238, y: 402, width: 120, height: 120 };
  }

  throw new Error(`Armor feet material ${JSON.stringify(material)} has no preview box.`);
}

function shoulderLayerBox(
  slot: 'shoulderLeft' | 'shoulderRight',
  material: ArmorMaterial,
): ArmorLayerBox {
  const x = slot === 'shoulderLeft' ? 208 : 302;
  if (material === 'plate' || material === 'leather') {
    return { x, y: 151, width: 90, height: 90 };
  }

  if (material === 'cloth') {
    return { x, y: 151, width: 90, height: 110 };
  }

  throw new Error(`Armor shoulder material ${JSON.stringify(material)} has no preview box.`);
}

function materialLayerBox(layer: ArmorRenderLayer): ArmorLayerBox {
  const material = requireWornMaterial(layer);
  const slot = layer.slot;

  if (slot === 'helm') {
    return helmLayerBox(material);
  }

  if (slot === 'chest') {
    return chestLayerBox(material);
  }

  if (slot === 'cloakFront') {
    return cloakFrontLayerBox(material);
  }

  if (slot === 'feet' || slot === 'feetBack') {
    return feetLayerBox(material);
  }

  if (slot === 'shoulderLeft' || slot === 'shoulderRight') {
    return shoulderLayerBox(slot, material);
  }

  throw new Error(
    `Armor layer ${JSON.stringify(slot)} has no preview box for material ${JSON.stringify(material)}.`,
  );
}

function requirePositiveBox(slot: ArmorRenderSlot, box: ArmorLayerBox): ArmorLayerBox {
  if (box.width < 1 || box.height < 1) {
    throw new Error(
      `Armor layer ${JSON.stringify(slot)} has an empty preview box ${box.width}x${box.height}.`,
    );
  }

  return box;
}

function layerBox(layer: ArmorRenderLayer): ArmorLayerBox {
  const fixedBox = fixedLayerBox(layer.slot);
  if (fixedBox !== null) {
    return requirePositiveBox(layer.slot, fixedBox);
  }

  return requirePositiveBox(layer.slot, materialLayerBox(layer));
}

function requireLayerPieceId(layer: ArmorRenderLayer): string {
  if (layer.pieceId === null) {
    throw new Error(
      `Armor layer ${JSON.stringify(layer.slot)} is missing a piece id. Received ${describeReceivedValue(layer.pieceId)}.`,
    );
  }

  return layer.pieceId;
}

function imageOwnerLabel(layer: ArmorRenderLayer): string {
  if (layer.pieceId === null) {
    return JSON.stringify(layer.slot);
  }

  return `piece ${JSON.stringify(layer.pieceId)}`;
}

function imageLoadError(layer: ArmorRenderLayer, sourceUrl: string, detail: string): Error {
  return new Error(
    `Armor image for ${imageOwnerLabel(layer)} could not be loaded from ${JSON.stringify(sourceUrl)}. ${detail}`,
  );
}

function rethrowWithPieceId(pieceId: string, error: unknown): never {
  const detail = error instanceof Error ? error.message : describeReceivedValue(error);
  if (error instanceof Error && detail.includes(pieceId)) {
    throw error;
  }

  throw new Error(`Armor piece ${JSON.stringify(pieceId)} image path failed. ${detail}`);
}

function requireImagePath(sourceUrl: unknown, layer: ArmorRenderLayer): string {
  if (typeof sourceUrl === 'string' && sourceUrl.length > 0) {
    return sourceUrl;
  }

  throw new Error(
    `Armor image path for ${imageOwnerLabel(layer)} must be a non-empty string. Received ${describeReceivedValue(sourceUrl)}.`,
  );
}

function pieceImagePath(layer: ArmorRenderLayer, pieceId: string): string {
  if (layer.slot === 'feetBack') {
    return armorPieceImagePath(pieceId, { feetBack: true });
  }

  if (layer.flatChest) {
    return armorPieceImagePath(pieceId, { flatChest: true });
  }

  return armorPieceImagePath(pieceId);
}

function layerSourceUrl(layer: ArmorRenderLayer, gender: ArmorGender): string {
  if (layer.slot === 'body') {
    return requireImagePath(armorBodyImagePath(gender), layer);
  }

  const pieceId = requireLayerPieceId(layer);
  let sourceUrl: unknown;
  try {
    sourceUrl = pieceImagePath(layer, pieceId);
  } catch (error: unknown) {
    rethrowWithPieceId(pieceId, error);
  }

  return requireImagePath(sourceUrl, layer);
}

function loadArmorImage(sourceUrl: string, layer: ArmorRenderLayer): Promise<CanvasImageSource> {
  const ImageConstructor = globalThis.Image;
  if (typeof ImageConstructor !== 'function') {
    throw new Error(
      `Armor image for ${imageOwnerLabel(layer)} cannot be drawn from ${JSON.stringify(sourceUrl)} because Image is not a function. Received typeof ${typeof ImageConstructor}.`,
    );
  }

  return new Promise((resolve, reject) => {
    const image = new ImageConstructor();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(imageLoadError(layer, sourceUrl, 'The image failed to decode.'));
    };

    try {
      image.src = sourceUrl;
    } catch (error) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      reject(imageLoadError(layer, sourceUrl, detail));
    }
  });
}

function loadLayerImage(layer: ArmorRenderLayer, gender: ArmorGender): Promise<CanvasImageSource> {
  return loadArmorImage(layerSourceUrl(layer, gender), layer);
}

function loadLayerImages(
  layers: readonly ArmorRenderLayer[],
  gender: ArmorGender,
): Promise<CanvasImageSource[]> {
  return Promise.all(layers.map((layer) => loadLayerImage(layer, gender)));
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
  const box = layerBox(layer);
  if (layer.mirror) {
    drawMirroredImage(context, image, box);
    return;
  }

  context.drawImage(image, box.x, box.y, box.width, box.height);
}

function pieceDrawError(pieceId: string, error: unknown): Error {
  const detail = error instanceof Error ? error.message : describeReceivedValue(error);
  if (detail.includes(pieceId) && error instanceof Error) {
    return error;
  }

  return new Error(`Armor piece ${JSON.stringify(pieceId)} failed to draw. ${detail}`);
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

function requireShouldDraw(shouldDraw: unknown): () => boolean {
  if (shouldDraw === undefined) {
    return () => true;
  }

  if (typeof shouldDraw !== 'function') {
    throw new Error(
      `Armor draw predicate must be a function. Received ${describeReceivedValue(shouldDraw)}.`,
    );
  }

  return () => {
    const allowed: unknown = (shouldDraw as () => unknown)();
    if (typeof allowed !== 'boolean') {
      throw new Error(
        `Armor draw predicate must return a boolean. Received ${describeReceivedValue(allowed)}.`,
      );
    }

    return allowed;
  };
}

function paintArmorLayers(
  context: ArmorDrawContext,
  layers: readonly ArmorRenderLayer[],
  images: readonly CanvasImageSource[],
): void {
  context.clearRect(0, 0, ARMOR_PREVIEW_WIDTH, ARMOR_PREVIEW_HEIGHT);

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    const image = images[index];
    if (layer === undefined || image === undefined) {
      throw new Error(
        `Armor layer image at index ${String(index)} is missing. Received layer ${describeReceivedValue(layer)} and image ${describeReceivedValue(image)}.`,
      );
    }

    drawLoadedLayer(context, layer, image);
  }
}

export async function drawArmorLayers(
  context: ArmorDrawContext,
  selection: ArmorSelection,
  shouldDraw?: () => boolean,
): Promise<void> {
  const drawContext = requireDrawContext(context);
  const allowDraw = requireShouldDraw(shouldDraw);
  const layers = listArmorRenderLayers(selection);
  const gender = requireArmorGender(selection.gender);
  const images = await loadLayerImages(layers, gender);
  if (!allowDraw()) {
    return;
  }

  paintArmorLayers(drawContext, layers, images);
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
