import {
  WEAPON_PREVIEW_HEIGHT,
  WEAPON_PREVIEW_WIDTH,
  getWeaponLayerBox,
  WEAPON_LAYER_ORDER,
  requireWeaponCategory,
  requireWeaponPieceId,
  type WeaponCategory,
} from '@/lib/weapon-creator/catalog';
import { WEAPON_EXPORT_SCALE } from '@/lib/weapon-creator/constants';
import { weaponPieceImagePath } from '@/lib/weapon-creator/icons';
import {
  requireWeaponSelection,
  type WeaponSelection,
} from '@/lib/weapon-creator/selection';

export type WeaponLayerBox = ReturnType<typeof getWeaponLayerBox>;

export type WeaponRenderLayer = {
  category: WeaponCategory;
  pieceId: string;
  box: WeaponLayerBox;
};

export type WeaponDrawContext = {
  canvas: { width: number; height: number };
  clearRect: (x: number, y: number, width: number, height: number) => void;
  drawImage: (image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number) => void;
};

type WeaponPngCanvas = {
  width: number;
  height: number;
  toBlob: (callback: (blob: Blob | null) => void, type?: string) => void;
};

type WeaponCanvasScale = 1 | typeof WEAPON_EXPORT_SCALE;

type ValidatedWeaponDrawContext = {
  context: WeaponDrawContext;
  scale: WeaponCanvasScale;
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

function requireDrawFunction(context: Record<string, unknown>, functionName: string): void {
  if (typeof context[functionName] !== 'function') {
    throw new Error(
      `Weapon draw context ${functionName} must be a function. Received ${describeReceivedValue(context[functionName])}.`,
    );
  }
}

function weaponCanvasDimensions(scale: WeaponCanvasScale): { width: number; height: number } {
  return {
    width: WEAPON_PREVIEW_WIDTH * scale,
    height: WEAPON_PREVIEW_HEIGHT * scale,
  };
}

function requireWeaponCanvasScale(
  width: unknown,
  height: unknown,
  canvasLabel: string,
): WeaponCanvasScale {
  if (width === WEAPON_PREVIEW_WIDTH && height === WEAPON_PREVIEW_HEIGHT) {
    return 1;
  }

  const exportDimensions = weaponCanvasDimensions(WEAPON_EXPORT_SCALE);
  if (width === exportDimensions.width && height === exportDimensions.height) {
    return WEAPON_EXPORT_SCALE;
  }

  throw new Error(
    `${canvasLabel} size must be ${WEAPON_PREVIEW_WIDTH}x${WEAPON_PREVIEW_HEIGHT} or ${exportDimensions.width}x${exportDimensions.height}. Received ${describeReceivedValue(width)}x${describeReceivedValue(height)}.`,
  );
}

function requireWeaponDrawContext(context: unknown): ValidatedWeaponDrawContext {
  if (!isPlainObject(context)) {
    throw new Error(`Weapon draw context must be an object. Received ${describeReceivedValue(context)}.`);
  }

  if (!isPlainObject(context.canvas)) {
    throw new Error(
      `Weapon preview canvas must be an object. Received ${describeReceivedValue(context.canvas)}.`,
    );
  }

  const width = context.canvas.width;
  const height = context.canvas.height;
  const scale = requireWeaponCanvasScale(width, height, 'Weapon draw canvas');

  requireDrawFunction(context, 'clearRect');
  requireDrawFunction(context, 'drawImage');
  return { context: context as WeaponDrawContext, scale };
}

function requireCurrentPredicate(currentPredicate: unknown): () => boolean {
  if (currentPredicate === undefined) {
    return () => true;
  }

  if (typeof currentPredicate !== 'function') {
    throw new Error(
      `Weapon draw predicate must be a function. Received ${describeReceivedValue(currentPredicate)}.`,
    );
  }

  return () => {
    const allowed: unknown = (currentPredicate as () => unknown)();
    if (typeof allowed !== 'boolean') {
      throw new Error(
        `Weapon draw predicate must return a boolean. Received ${describeReceivedValue(allowed)}.`,
      );
    }

    return allowed;
  };
}

function createWeaponRenderLayer(category: WeaponCategory, pieceId: string): WeaponRenderLayer {
  const validCategory = requireWeaponCategory(category);
  const validPieceId = requireWeaponPieceId(pieceId);

  return {
    category: validCategory,
    pieceId: validPieceId,
    box: getWeaponLayerBox(validCategory),
  };
}

export function listWeaponRenderLayers(selection: WeaponSelection): WeaponRenderLayer[] {
  const currentSelection = requireWeaponSelection(selection);
  const layers: WeaponRenderLayer[] = [];

  for (const category of WEAPON_LAYER_ORDER) {
    const pieceId = currentSelection.equippedPieceIds[category];
    if (pieceId === undefined) {
      continue;
    }

    layers.push(createWeaponRenderLayer(category, pieceId));
  }

  return layers;
}

function layerSourceUrl(layer: WeaponRenderLayer): string {
  return weaponPieceImagePath(layer.pieceId);
}

function imageLoadError(layer: WeaponRenderLayer, sourceUrl: string, detail: string): Error {
  return new Error(
    `Weapon image for category ${JSON.stringify(layer.category)} and piece ${JSON.stringify(layer.pieceId)} could not be loaded from ${JSON.stringify(sourceUrl)}. ${detail}`,
  );
}

function loadWeaponImage(layer: WeaponRenderLayer): Promise<CanvasImageSource> {
  const sourceUrl = layerSourceUrl(layer);
  const ImageConstructor = globalThis.Image;
  if (typeof ImageConstructor !== 'function') {
    throw new Error(
      `Weapon image for piece ${JSON.stringify(layer.pieceId)} cannot be drawn from ${JSON.stringify(sourceUrl)} because Image is not a function. Received typeof ${typeof ImageConstructor}.`,
    );
  }

  return new Promise((resolve, reject) => {
    let image: HTMLImageElement;
    try {
      image = new ImageConstructor();
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      reject(imageLoadError(layer, sourceUrl, `The Image constructor failed. ${detail}`));
      return;
    }

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

function loadWeaponLayerImages(
  layers: readonly WeaponRenderLayer[],
): Promise<CanvasImageSource[]> {
  return Promise.all(layers.map((layer) => loadWeaponImage(layer)));
}

function drawLoadedWeaponLayers(
  context: WeaponDrawContext,
  layers: readonly WeaponRenderLayer[],
  loadedImages: readonly CanvasImageSource[],
  scale: WeaponCanvasScale,
): void {
  const canvasDimensions = weaponCanvasDimensions(scale);
  context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    const image = loadedImages[index];
    if (layer === undefined || image === undefined) {
      throw new Error(
        `Weapon layer image at index ${String(index)} is missing. Received layer ${describeReceivedValue(layer)} and image ${describeReceivedValue(image)}.`,
      );
    }

    try {
      context.drawImage(
        image,
        layer.box.x * scale,
        layer.box.y * scale,
        layer.box.width * scale,
        layer.box.height * scale,
      );
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      throw new Error(
        `Weapon layer for category ${JSON.stringify(layer.category)} and piece ${JSON.stringify(layer.pieceId)} failed to draw. ${detail}`,
      );
    }
  }
}

export async function drawWeaponLayers(
  context: WeaponDrawContext,
  selection: WeaponSelection,
  shouldApply?: () => boolean,
): Promise<void> {
  const validatedDrawContext = requireWeaponDrawContext(context);
  const allowDraw = requireCurrentPredicate(shouldApply);
  const currentSelection = requireWeaponSelection(selection);
  const layers = listWeaponRenderLayers(currentSelection);
  const loadedImages = await loadWeaponLayerImages(layers);

  if (!allowDraw()) {
    return;
  }

  drawLoadedWeaponLayers(
    validatedDrawContext.context,
    layers,
    loadedImages,
    validatedDrawContext.scale,
  );
}

function requireWeaponPngCanvas(canvas: unknown): WeaponPngCanvas {
  if (!isPlainObject(canvas)) {
    throw new Error(`Weapon PNG canvas must be an object. Received ${describeReceivedValue(canvas)}.`);
  }

  requireWeaponCanvasScale(canvas.width, canvas.height, 'Weapon PNG canvas');

  if (typeof canvas.toBlob !== 'function') {
    throw new Error(
      `Weapon PNG export requires canvas.toBlob. Received ${describeReceivedValue(canvas.toBlob)}.`,
    );
  }

  return canvas as WeaponPngCanvas;
}

function readWeaponPngBlob(canvas: WeaponPngCanvas): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob === null) {
          reject(new Error('Weapon PNG export returned null.'));
          return;
        }

        if (typeof blob !== 'object') {
          reject(
            new Error(`Weapon PNG export returned an invalid Blob. Received ${describeReceivedValue(blob)}.`),
          );
          return;
        }

        if (blob.type !== 'image/png') {
          reject(
            new Error(`Weapon PNG blob type must be image/png. Received ${JSON.stringify(blob.type)}.`),
          );
          return;
        }

        resolve(blob);
      }, 'image/png');
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      reject(
        new Error(
          `Weapon PNG export failed for ${canvas.width}x${canvas.height} canvas. ${detail}`,
        ),
      );
    }
  });
}

export function canvasToWeaponPng(canvas: WeaponPngCanvas): Promise<Blob> {
  return readWeaponPngBlob(requireWeaponPngCanvas(canvas));
}
