import {
  CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT,
} from './constants';
import { castleAssetImagePath, getCastleAsset } from './catalog';
import {
  CASTLE_LAYER_IDS,
  type CastleCanvasSettings,
  type CastlePalette,
  type CastlePiece,
  type CastleProject,
  type CastleSize,
} from './types';
import { validateCastleProject } from './project';

const MAX_CASTLE_CANVAS_DIMENSION = 8192;

export interface CastleImageLoader {
  loadImage(sourceUrl: string): Promise<CanvasImageSource>;
}

type CastlePngCanvas = {
  width: number;
  height: number;
  toBlob(callback: (blob: Blob | null) => void, type?: string): void;
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
    const serializedValue = JSON.stringify(value);
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `${Object.prototype.toString.call(value)} could not be described: ${error.message}`,
      );
    }

    throw error;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function requireDimension(value: unknown, fieldName: string, allowZero: boolean): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(
      `Castle ${fieldName} must be a finite integer. Received ${describeReceivedValue(value)}.`,
    );
  }

  if (value < 0 || value > MAX_CASTLE_CANVAS_DIMENSION || (!allowZero && value === 0)) {
    throw new Error(
      `Castle ${fieldName} must be ${allowZero ? '0 or ' : ''}an integer from 1 to ${MAX_CASTLE_CANVAS_DIMENSION}. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireCanvasSettings(settings: unknown): CastleCanvasSettings {
  if (!isObject(settings)) {
    throw new Error(
      `Castle canvas settings must be an object. Received ${describeReceivedValue(settings)}.`,
    );
  }

  if (typeof settings.backgroundColor !== 'string') {
    throw new Error(
      `Castle canvas backgroundColor must be a string. Received ${describeReceivedValue(settings.backgroundColor)}.`,
    );
  }

  if (settings.backgroundImageUrl !== null && typeof settings.backgroundImageUrl !== 'string') {
    throw new Error(
      `Castle canvas backgroundImageUrl must be a string or null. Received ${describeReceivedValue(settings.backgroundImageUrl)}.`,
    );
  }

  return {
    width: requireDimension(settings.width, 'canvas width', true),
    height: requireDimension(settings.height, 'canvas height', true),
    backgroundColor: settings.backgroundColor,
    backgroundImageUrl: settings.backgroundImageUrl as string | null,
  };
}

function requireCanvasSize(size: unknown): CastleSize {
  if (!isObject(size)) {
    throw new Error(`Castle canvas size must be an object. Received ${describeReceivedValue(size)}.`);
  }

  return {
    width: requireDimension(size.width, 'canvas export width', false),
    height: requireDimension(size.height, 'canvas export height', false),
  };
}

function requireAutomaticWidth(automaticWidth: unknown): number {
  const validatedWidth = requireDimension(automaticWidth, 'automatic canvas width', false);
  return validatedWidth;
}

export function resolveCastleCanvasSize(
  settings: CastleCanvasSettings,
  automaticWidth: number,
): CastleSize {
  const validatedSettings = requireCanvasSettings(settings);
  const validatedAutomaticWidth = requireAutomaticWidth(automaticWidth);
  const resolvedWidth =
    validatedSettings.width > 0 ? validatedSettings.width : validatedAutomaticWidth;
  const resolvedHeight =
    validatedSettings.height === 0
      ? CASTLE_CREATOR_DEFAULT_CANVAS_HEIGHT
      : validatedSettings.height;

  return requireCanvasSize({ width: resolvedWidth, height: resolvedHeight });
}

function requireCastleProject(project: unknown): CastleProject {
  try {
    return validateCastleProject(project);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Castle project cannot be rendered: ${error.message}`);
    }

    throw error;
  }
}

function requireCastleImageLoader(imageLoader: unknown): CastleImageLoader {
  if (!isObject(imageLoader) || typeof imageLoader.loadImage !== 'function') {
    throw new Error(
      `Castle image loader must expose loadImage(sourceUrl). Received ${describeReceivedValue(imageLoader)}.`,
    );
  }

  return imageLoader as unknown as CastleImageLoader;
}

function defaultCastleImageLoader(): CastleImageLoader {
  return {
    loadImage(sourceUrl: string): Promise<CanvasImageSource> {
      const ImageConstructor = globalThis.Image;
      if (typeof ImageConstructor !== 'function') {
        throw new Error(
          `Castle image ${JSON.stringify(sourceUrl)} cannot load because Image is not a function. Received typeof ${typeof ImageConstructor}.`,
        );
      }

      return new Promise((resolve, reject) => {
        const image = new ImageConstructor();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => {
          reject(new Error(`Castle image ${JSON.stringify(sourceUrl)} failed to load.`));
        };

        try {
          image.src = sourceUrl;
        } catch (error: unknown) {
          if (error instanceof Error) {
            reject(
              new Error(
                `Castle image ${JSON.stringify(sourceUrl)} failed to start loading: ${error.message}`,
              ),
            );
            return;
          }

          throw error;
        }
      });
    },
  };
}

async function loadCastleImage(
  imageLoader: CastleImageLoader,
  sourceUrl: string,
  ownerLabel: string,
): Promise<CanvasImageSource> {
  try {
    const image = await imageLoader.loadImage(sourceUrl);
    if (image === null || image === undefined) {
      throw new Error(`Image loader returned ${describeReceivedValue(image)}.`);
    }

    return image;
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : describeReceivedValue(error);
    throw new Error(
      `Castle ${ownerLabel} image ${JSON.stringify(sourceUrl)} could not be loaded: ${detail}`,
    );
  }
}

function requireRenderingCanvas(): HTMLCanvasElement {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    throw new Error('Castle rendering requires document.createElement("canvas").');
  }

  const canvas = document.createElement('canvas');
  if (canvas === null || typeof canvas.getContext !== 'function') {
    throw new Error(
      `Castle rendering canvas must expose getContext. Received ${describeReceivedValue(canvas)}.`,
    );
  }

  return canvas;
}

function requireRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Castle rendering could not obtain a 2d canvas context.');
  }

  if (typeof context.fillRect !== 'function' || typeof context.drawImage !== 'function') {
    throw new Error('Castle rendering 2d context must expose fillRect and drawImage.');
  }

  return context;
}

function visibleCastlePieces(project: CastleProject): CastlePiece[] {
  const visiblePieces: CastlePiece[] = [];

  for (const layerId of CASTLE_LAYER_IDS) {
    if (!project.visibleLayers[layerId]) {
      continue;
    }

    for (const piece of project.pieces) {
      if (piece.layerId === layerId) {
        visiblePieces.push(piece);
      }
    }
  }

  return visiblePieces;
}

function requireCastleAsset(assetId: string): void {
  try {
    const asset = getCastleAsset(assetId);
    if (asset === null || asset === undefined) {
      throw new Error(`Catalog returned ${describeReceivedValue(asset)}.`);
    }
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : describeReceivedValue(error);
    throw new Error(`Castle asset ${JSON.stringify(assetId)} is unavailable: ${detail}`);
  }
}

function castlePieceImageUrl(piece: CastlePiece): string {
  requireCastleAsset(piece.assetId);
  const palette: CastlePalette = {
    building: piece.buildingColor,
    roof: piece.roofColor,
  };

  try {
    const sourceUrl = castleAssetImagePath(piece.assetId, palette);
    if (typeof sourceUrl !== 'string' || sourceUrl.length === 0) {
      throw new Error(`Catalog returned ${describeReceivedValue(sourceUrl)}.`);
    }

    return sourceUrl;
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : describeReceivedValue(error);
    throw new Error(
      `Castle asset ${JSON.stringify(piece.assetId)} image path could not be resolved: ${detail}`,
    );
  }
}

function drawCastleBackground(
  context: CanvasRenderingContext2D,
  project: CastleProject,
  size: CastleSize,
): void {
  context.fillStyle = project.canvas.backgroundColor;
  context.fillRect(0, 0, size.width, size.height);
}

function requireCastleImageDimensions(
  image: CanvasImageSource,
  sourceUrl: string,
): { width: number; height: number } {
  if (!isObject(image)) {
    throw new Error(
      `Castle background image ${JSON.stringify(sourceUrl)} must expose dimensions. Received ${describeReceivedValue(image)}.`,
    );
  }

  const imageWidth =
    typeof image.naturalWidth === 'number' && image.naturalWidth > 0
      ? image.naturalWidth
      : image.width;
  const imageHeight =
    typeof image.naturalHeight === 'number' && image.naturalHeight > 0
      ? image.naturalHeight
      : image.height;
  if (
    typeof imageWidth !== 'number'
    || !Number.isFinite(imageWidth)
    || imageWidth <= 0
    || typeof imageHeight !== 'number'
    || !Number.isFinite(imageHeight)
    || imageHeight <= 0
  ) {
    throw new Error(
      `Castle background image ${JSON.stringify(sourceUrl)} has invalid dimensions. Received ${describeReceivedValue(imageWidth)}x${describeReceivedValue(imageHeight)}.`,
    );
  }

  return { width: imageWidth, height: imageHeight };
}

async function drawCastleBackgroundImage(
  context: CanvasRenderingContext2D,
  project: CastleProject,
  size: CastleSize,
  imageLoader: CastleImageLoader,
): Promise<void> {
  const sourceUrl = project.canvas.backgroundImageUrl;
  if (sourceUrl === null) {
    return;
  }

  const image = await loadCastleImage(imageLoader, sourceUrl, 'background');
  const imageDimensions = requireCastleImageDimensions(image, sourceUrl);
  const coverScale = Math.max(
    size.width / imageDimensions.width,
    size.height / imageDimensions.height,
  );
  const renderedWidth = imageDimensions.width * coverScale;
  const renderedHeight = imageDimensions.height * coverScale;
  const renderedX = (size.width - renderedWidth) / 2;
  const renderedY = (size.height - renderedHeight) / 2;
  try {
    context.drawImage(image, renderedX, renderedY, renderedWidth, renderedHeight);
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : describeReceivedValue(error);
    throw new Error(
      `Castle background image ${JSON.stringify(sourceUrl)} failed to draw: ${detail}`,
    );
  }
}

async function drawCastlePieces(
  context: CanvasRenderingContext2D,
  project: CastleProject,
  imageLoader: CastleImageLoader,
): Promise<void> {
  for (const piece of visibleCastlePieces(project)) {
    const sourceUrl = castlePieceImageUrl(piece);
    const image = await loadCastleImage(imageLoader, sourceUrl, `piece ${JSON.stringify(piece.id)}`);
    try {
      context.drawImage(image, piece.x, piece.y, piece.width, piece.height);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : describeReceivedValue(error);
      throw new Error(
        `Castle piece ${JSON.stringify(piece.id)} image ${JSON.stringify(sourceUrl)} failed to draw: ${detail}`,
      );
    }
  }
}

export async function renderCastleProject(
  project: CastleProject,
  size: CastleSize,
  imageLoader: CastleImageLoader = defaultCastleImageLoader(),
): Promise<HTMLCanvasElement> {
  const validatedProject = requireCastleProject(project);
  const validatedSize = requireCanvasSize(size);
  const validatedImageLoader = requireCastleImageLoader(imageLoader);
  const canvas = requireRenderingCanvas();
  canvas.width = validatedSize.width;
  canvas.height = validatedSize.height;
  if (canvas.width !== validatedSize.width || canvas.height !== validatedSize.height) {
    throw new Error(
      `Castle rendering canvas size must remain ${validatedSize.width}x${validatedSize.height}. Received ${canvas.width}x${canvas.height}.`,
    );
  }

  const context = requireRenderingContext(canvas);
  drawCastleBackground(context, validatedProject, validatedSize);
  await drawCastleBackgroundImage(context, validatedProject, validatedSize, validatedImageLoader);
  await drawCastlePieces(context, validatedProject, validatedImageLoader);
  return canvas;
}

function requirePngCanvas(canvas: unknown): CastlePngCanvas {
  if (!isObject(canvas)) {
    throw new Error(`Castle PNG canvas must be an object. Received ${describeReceivedValue(canvas)}.`);
  }

  const width = canvas.width;
  const height = canvas.height;
  requireDimension(width, 'PNG canvas width', false);
  requireDimension(height, 'PNG canvas height', false);
  if (typeof canvas.toBlob !== 'function') {
    throw new Error(
      `Castle PNG export requires canvas.toBlob. Received ${describeReceivedValue(canvas.toBlob)}.`,
    );
  }

  return canvas as unknown as CastlePngCanvas;
}

export function castleCanvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const validatedCanvas = requirePngCanvas(canvas);
  return new Promise((resolve, reject) => {
    try {
      validatedCanvas.toBlob((blob) => {
        if (blob === null) {
          reject(
            new Error(
              'Castle PNG export returned null. The canvas may be tainted by a cross-origin image or the browser may have rejected the export.',
            ),
          );
          return;
        }

        if (blob.type !== 'image/png') {
          reject(
            new Error(
              `Castle PNG blob type must be image/png. Received ${JSON.stringify(blob.type)}.`,
            ),
          );
          return;
        }

        resolve(blob);
      }, 'image/png');
    } catch (error: unknown) {
      if (error instanceof Error) {
        reject(
          new Error(
            `Castle PNG export failed; the canvas may be tainted by a cross-origin image: ${error.message}`,
          ),
        );
        return;
      }

      reject(
        new Error(
          `Castle PNG export failed; the canvas may be tainted by a cross-origin image: ${describeReceivedValue(error)}`,
        ),
      );
    }
  });
}
