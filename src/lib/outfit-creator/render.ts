import {
  OUTFIT_PREVIEW_HEIGHT,
  OUTFIT_PREVIEW_WIDTH,
  pieceSlot,
  requireOutfitGender,
  requireOutfitPieceId,
  requireOutfitSlot,
  type OutfitGender,
  type OutfitSlot,
} from '@/lib/outfit-creator/catalog';
import {
  backOutfitPieceImagePath,
  outfitBodyImagePath,
  outfitPieceImagePath,
} from '@/lib/outfit-creator/icons';
import type { OutfitSelection } from '@/lib/outfit-creator/selection';

export const OUTFIT_RENDER_SLOTS = [
  'jacketBack',
  'shirtBack',
  'skirtBack',
  'shoesBack',
  'body',
  'pants',
  'shoes',
  'skirt',
  'shirt',
  'belt',
  'gloves',
  'jacket',
  'scarf',
] as const;
export type OutfitRenderSlot = (typeof OUTFIT_RENDER_SLOTS)[number];

export type OutfitLayerBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OutfitRenderLayer = {
  slot: OutfitRenderSlot;
  pieceId: string | null;
  box: OutfitLayerBox;
  isBack: boolean;
};

export type OutfitDrawContext = {
  canvas: { width: number; height: number };
  clearRect: (x: number, y: number, width: number, height: number) => void;
  drawImage: (image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number) => void;
};

type OutfitPngCanvas = {
  toBlob: (callback: (blob: Blob | null) => void, type?: string) => void;
};

type OutfitBackRenderSlot = 'jacketBack' | 'shirtBack' | 'skirtBack' | 'shoesBack';

const OUTFIT_FRONT_SLOTS: readonly OutfitSlot[] = [
  'pants',
  'shoes',
  'skirt',
  'shirt',
  'belt',
  'gloves',
  'jacket',
  'scarf',
];

const OUTFIT_BACK_SLOT_BY_RENDER_SLOT: Record<OutfitBackRenderSlot, OutfitSlot> = {
  jacketBack: 'jacket',
  shirtBack: 'shirt',
  skirtBack: 'skirt',
  shoesBack: 'shoes',
};

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    if (typeof serialized === 'string') {
      return serialized;
    }

    return Object.prototype.toString.call(value);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const reason = error.message.length > 0 ? error.message : `${error.name} with empty message`;
      return `${Object.prototype.toString.call(value)} (JSON.stringify failed: ${reason}).`;
    }

    throw error;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireEquippedPieceIds(value: unknown): Partial<Record<OutfitSlot, string>> {
  if (!isPlainObject(value)) {
    throw new Error(
      `Outfit equipped pieces must be an object. Received ${describeReceivedValue(value)}.`,
    );
  }

  const equippedPieceIds: Partial<Record<OutfitSlot, string>> = {};
  for (const slotKey of Object.keys(value)) {
    const slot = requireOutfitSlot(slotKey);
    const receivedPieceId = value[slotKey];
    if (receivedPieceId === undefined) {
      throw new Error(
        `Outfit equipped piece for slot ${JSON.stringify(slot)} is undefined. Received ${describeReceivedValue(receivedPieceId)}.`,
      );
    }

    const pieceId = requireOutfitPieceId(receivedPieceId);
    const ownerSlot = pieceSlot(pieceId);
    if (ownerSlot !== slot) {
      throw new Error(
        `Outfit piece ${JSON.stringify(pieceId)} is equipped on ${JSON.stringify(slot)} but belongs to ${JSON.stringify(ownerSlot)}.`,
      );
    }

    equippedPieceIds[slot] = pieceId;
  }

  return equippedPieceIds;
}

function requireOutfitSelection(selection: unknown): OutfitSelection {
  if (!isPlainObject(selection)) {
    throw new Error(`Outfit selection must be an object. Received ${describeReceivedValue(selection)}.`);
  }

  return {
    gender: requireOutfitGender(selection.gender),
    equippedPieceIds: requireEquippedPieceIds(selection.equippedPieceIds),
  };
}

function originalLayerBox(slot: OutfitRenderSlot): OutfitLayerBox {
  if (slot === 'jacketBack') {
    return { x: 249, y: 77, width: 102, height: 227 };
  }

  if (slot === 'shirtBack') {
    return { x: 237, y: 92, width: 126, height: 234 };
  }

  if (slot === 'skirtBack') {
    return { x: 254, y: 189, width: 92, height: 172 };
  }

  if (slot === 'shoesBack') {
    return { x: 255, y: 322, width: 89, height: 39 };
  }

  if (slot === 'body') {
    return { x: 200, y: 0, width: 200, height: 400 };
  }

  if (slot === 'pants') {
    return { x: 257, y: 182, width: 85, height: 175 };
  }

  if (slot === 'shoes') {
    return { x: 245, y: 322, width: 109, height: 66 };
  }

  if (slot === 'skirt') {
    return { x: 249, y: 182, width: 102, height: 178 };
  }

  if (slot === 'shirt') {
    return { x: 231, y: 92, width: 136, height: 178 };
  }

  if (slot === 'belt') {
    return { x: 257, y: 182, width: 86, height: 37 };
  }

  if (slot === 'gloves') {
    return { x: 229, y: 180, width: 142, height: 48 };
  }

  if (slot === 'jacket') {
    return { x: 222, y: 77, width: 155, height: 203 };
  }

  if (slot === 'scarf') {
    return { x: 253, y: 78, width: 95, height: 106 };
  }

  const unexpectedSlot: never = slot;
  throw new Error(`Outfit render slot ${JSON.stringify(unexpectedSlot)} has no preview box.`);
}

function centeredLayerBox(slot: OutfitRenderSlot): OutfitLayerBox {
  const box = originalLayerBox(slot);
  return {
    ...box,
    y: box.y + 50,
  };
}

function equippedPieceId(
  equippedPieceIds: Partial<Record<OutfitSlot, string>>,
  slot: OutfitSlot,
): string | null {
  return equippedPieceIds[slot] ?? null;
}

function createRenderLayer(
  slot: OutfitRenderSlot,
  pieceId: string | null,
  isBack: boolean,
): OutfitRenderLayer {
  return {
    slot,
    pieceId,
    box: centeredLayerBox(slot),
    isBack,
  };
}

function renderBackLayer(
  selection: OutfitSelection,
  renderSlot: OutfitBackRenderSlot,
): OutfitRenderLayer | null {
  const slot = OUTFIT_BACK_SLOT_BY_RENDER_SLOT[renderSlot];
  const pieceId = equippedPieceId(selection.equippedPieceIds, slot);
  if (pieceId === null) {
    return null;
  }

  return createRenderLayer(renderSlot, pieceId, true);
}

function renderFrontLayer(selection: OutfitSelection, slot: OutfitSlot): OutfitRenderLayer | null {
  const pieceId = equippedPieceId(selection.equippedPieceIds, slot);
  if (pieceId === null) {
    return null;
  }

  return createRenderLayer(slot, pieceId, false);
}

export function listOutfitRenderLayers(selection: OutfitSelection): OutfitRenderLayer[] {
  const currentSelection = requireOutfitSelection(selection);
  const layers: OutfitRenderLayer[] = [];
  const backRenderSlots: readonly OutfitBackRenderSlot[] = [
    'jacketBack',
    'shirtBack',
    'skirtBack',
    'shoesBack',
  ];

  for (const renderSlot of backRenderSlots) {
    const layer = renderBackLayer(currentSelection, renderSlot);
    if (layer !== null) {
      layers.push(layer);
    }
  }

  layers.push(createRenderLayer('body', null, false));

  for (const slot of OUTFIT_FRONT_SLOTS) {
    const layer = renderFrontLayer(currentSelection, slot);
    if (layer !== null) {
      layers.push(layer);
    }
  }

  return layers;
}

function imageOwnerLabel(layer: OutfitRenderLayer): string {
  if (layer.pieceId === null) {
    return JSON.stringify(layer.slot);
  }

  return `piece ${JSON.stringify(layer.pieceId)}`;
}

function imageLoadError(layer: OutfitRenderLayer, sourceUrl: string, detail: string): Error {
  return new Error(
    `Outfit image for ${imageOwnerLabel(layer)} could not be loaded from ${JSON.stringify(sourceUrl)}. ${detail}`,
  );
}

function layerSourceUrl(layer: OutfitRenderLayer, gender: OutfitGender): string {
  if (layer.slot === 'body') {
    return outfitBodyImagePath(gender);
  }

  if (layer.pieceId === null) {
    throw new Error(
      `Outfit render layer ${JSON.stringify(layer.slot)} is missing a piece id. Received ${describeReceivedValue(layer.pieceId)}.`,
    );
  }

  const validPieceId = requireOutfitPieceId(layer.pieceId);
  const ownerSlot = pieceSlot(validPieceId);
  if (layer.isBack) {
    const backSlot = OUTFIT_BACK_SLOT_BY_RENDER_SLOT[layer.slot as OutfitBackRenderSlot];
    if (backSlot === undefined || ownerSlot !== backSlot) {
      throw new Error(
        `Outfit back layer ${JSON.stringify(layer.slot)} received piece ${JSON.stringify(validPieceId)} for slot ${JSON.stringify(ownerSlot)}.`,
      );
    }

    const sourceUrl = backOutfitPieceImagePath(gender, backSlot, validPieceId);
    if (sourceUrl === null) {
      throw new Error(
        `Outfit back layer ${JSON.stringify(layer.slot)} has no back image for piece ${JSON.stringify(validPieceId)}.`,
      );
    }

    return sourceUrl;
  }

  if (ownerSlot !== layer.slot) {
    throw new Error(
      `Outfit front layer ${JSON.stringify(layer.slot)} received piece ${JSON.stringify(validPieceId)} for slot ${JSON.stringify(ownerSlot)}.`,
    );
  }

  return outfitPieceImagePath(gender, validPieceId);
}

function loadOutfitImage(sourceUrl: string, layer: OutfitRenderLayer): Promise<CanvasImageSource> {
  const ImageConstructor = globalThis.Image;
  if (typeof ImageConstructor !== 'function') {
    throw new Error(
      `Outfit image for ${imageOwnerLabel(layer)} cannot be drawn from ${JSON.stringify(sourceUrl)} because Image is not a function. Received typeof ${typeof ImageConstructor}.`,
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
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      reject(imageLoadError(layer, sourceUrl, detail));
    }
  });
}

function loadLayerImages(
  layers: readonly OutfitRenderLayer[],
  gender: OutfitGender,
): Promise<CanvasImageSource[]> {
  return Promise.all(layers.map((layer) => loadOutfitImage(layerSourceUrl(layer, gender), layer)));
}

function requireDrawFunction(context: Record<string, unknown>, functionName: string): void {
  if (typeof context[functionName] !== 'function') {
    throw new Error(
      `Outfit draw context ${functionName} must be a function. Received ${describeReceivedValue(context[functionName])}.`,
    );
  }
}

function requireDrawContext(context: unknown): OutfitDrawContext {
  if (!isPlainObject(context)) {
    throw new Error(`Outfit draw context must be an object. Received ${describeReceivedValue(context)}.`);
  }

  if (!isPlainObject(context.canvas)) {
    throw new Error(
      `Outfit preview canvas must be an object. Received ${describeReceivedValue(context.canvas)}.`,
    );
  }

  const width = context.canvas.width;
  const height = context.canvas.height;
  if (width !== OUTFIT_PREVIEW_WIDTH || height !== OUTFIT_PREVIEW_HEIGHT) {
    throw new Error(
      `Outfit preview size must be ${OUTFIT_PREVIEW_WIDTH}x${OUTFIT_PREVIEW_HEIGHT}. Received ${describeReceivedValue(width)}x${describeReceivedValue(height)}.`,
    );
  }

  requireDrawFunction(context, 'clearRect');
  requireDrawFunction(context, 'drawImage');
  return context as OutfitDrawContext;
}

function requireCurrentPredicate(currentPredicate: unknown): () => boolean {
  if (currentPredicate === undefined) {
    return () => true;
  }

  if (typeof currentPredicate !== 'function') {
    throw new Error(
      `Outfit draw predicate must be a function. Received ${describeReceivedValue(currentPredicate)}.`,
    );
  }

  return () => {
    const allowed: unknown = (currentPredicate as () => unknown)();
    if (typeof allowed !== 'boolean') {
      throw new Error(
        `Outfit draw predicate must return a boolean. Received ${describeReceivedValue(allowed)}.`,
      );
    }

    return allowed;
  };
}

function drawLoadedLayers(
  context: OutfitDrawContext,
  layers: readonly OutfitRenderLayer[],
  images: readonly CanvasImageSource[],
): void {
  context.clearRect(0, 0, OUTFIT_PREVIEW_WIDTH, OUTFIT_PREVIEW_HEIGHT);

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    const image = images[index];
    if (layer === undefined || image === undefined) {
      throw new Error(
        `Outfit layer image at index ${String(index)} is missing. Received layer ${describeReceivedValue(layer)} and image ${describeReceivedValue(image)}.`,
      );
    }

    try {
      context.drawImage(image, layer.box.x, layer.box.y, layer.box.width, layer.box.height);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      if (layer.pieceId !== null && detail.includes(layer.pieceId) && error instanceof Error) {
        throw error;
      }

      const owner = layer.pieceId === null ? JSON.stringify(layer.slot) : JSON.stringify(layer.pieceId);
      throw new Error(`Outfit layer ${owner} failed to draw. ${detail}`);
    }
  }
}

export async function drawOutfitLayers(
  context: OutfitDrawContext,
  selection: OutfitSelection,
  isCurrent?: () => boolean,
): Promise<void> {
  const drawContext = requireDrawContext(context);
  const allowDraw = requireCurrentPredicate(isCurrent);
  const currentSelection = requireOutfitSelection(selection);
  const layers = listOutfitRenderLayers(currentSelection);
  const images = await loadLayerImages(layers, currentSelection.gender);

  if (!allowDraw()) {
    return;
  }

  drawLoadedLayers(drawContext, layers, images);
}

function requirePngCanvas(canvas: unknown): OutfitPngCanvas {
  if (!isPlainObject(canvas)) {
    throw new Error(`Outfit PNG canvas must be an object. Received ${describeReceivedValue(canvas)}.`);
  }

  if (typeof canvas.toBlob !== 'function') {
    throw new Error(
      `Outfit PNG export requires canvas.toBlob. Received ${describeReceivedValue(canvas.toBlob)}.`,
    );
  }

  return canvas as OutfitPngCanvas;
}

function readPngBlob(canvas: OutfitPngCanvas): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('Outfit PNG export returned null.'));
        return;
      }

      if (blob.type !== 'image/png') {
        reject(
          new Error(`Outfit PNG blob type must be image/png. Received ${JSON.stringify(blob.type)}.`),
        );
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

export function canvasToOutfitPng(canvas: OutfitPngCanvas): Promise<Blob> {
  return readPngBlob(requirePngCanvas(canvas));
}
