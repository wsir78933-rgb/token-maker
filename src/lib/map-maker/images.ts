import { getMapMakerAsset, getMapMakerAssetSrc } from './catalog';
import {
  describeMapMakerValue,
  requireMapMakerImageUrl,
  requireMapMakerProject,
} from './validation';
import { MAP_MAKER_TILE_SIZE } from './types';
import type { MapMakerAssetUsage, MapMakerImageSource, MapMakerProject } from './types';

const IMAGE_LOAD_TIMEOUT_MS = 15_000;

type MapMakerResolvedImage = { url: string; expectedWidth: number | null; expectedHeight: number | null };

function describeMapMakerError(receivedError: unknown): string {
  if (receivedError instanceof Error) {
    const detail = receivedError.message.length > 0 ? receivedError.message : 'empty message';
    return `${receivedError.name}: ${detail}`;
  }
  return describeMapMakerValue(receivedError);
}

function imageErrorReason(receivedEvent: Event | string): string {
  if (typeof receivedEvent === 'string') {
    return receivedEvent.length > 0 ? receivedEvent : 'Browser emitted an image error without details.';
  }
  if (typeof ErrorEvent === 'function' && receivedEvent instanceof ErrorEvent && receivedEvent.message.length > 0) {
    return receivedEvent.message;
  }
  return `Browser emitted image ${receivedEvent.type} without further details.`;
}

function requireImageApi(): void {
  if (typeof Image !== 'function') {
    throw new Error(`Map Maker image loading requires the browser Image API. Received ${describeMapMakerValue(typeof Image === 'undefined' ? undefined : Image)}.`);
  }
}

export function preloadMapMakerImage(url: string): Promise<HTMLImageElement> {
  const validUrl = requireMapMakerImageUrl(url);
  requireImageApi();
  return new Promise((resolve, reject) => {
    let image: HTMLImageElement;
    try {
      image = new Image();
    } catch (error: unknown) {
      reject(
        new Error(
          `Map Maker image ${JSON.stringify(validUrl)} could not be created. Received ${describeMapMakerError(error)}.`,
          { cause: error },
        ),
      );
      return;
    }
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function finishLoading(): void {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      image.onload = null;
      image.onerror = null;
    }

    image.onload = () => {
      finishLoading();
      if (
        !Number.isInteger(image.naturalWidth) ||
        image.naturalWidth <= 0 ||
        !Number.isInteger(image.naturalHeight) ||
        image.naturalHeight <= 0
      ) {
        reject(
          new Error(
            `Map Maker image ${JSON.stringify(validUrl)} loaded with invalid natural dimensions ${image.naturalWidth} × ${image.naturalHeight}.`,
          ),
        );
        return;
      }
      resolve(image);
    };

    image.onerror = (receivedEvent) => {
      finishLoading();
      reject(
        new Error(`Map Maker image ${JSON.stringify(validUrl)} could not be loaded: ${imageErrorReason(receivedEvent)}.`),
      );
    };

    timeoutId = setTimeout(() => {
      finishLoading();
      reject(
        new Error(`Map Maker image ${JSON.stringify(validUrl)} did not load within ${IMAGE_LOAD_TIMEOUT_MS} ms. Received timeout.`),
      );
    }, IMAGE_LOAD_TIMEOUT_MS);

    image.crossOrigin = 'anonymous';
    try {
      image.src = validUrl;
    } catch (error: unknown) {
      finishLoading();
      reject(
        new Error(`Map Maker image ${JSON.stringify(validUrl)} could not start loading. Received ${describeMapMakerError(error)}.`, { cause: error }),
      );
    }
  });
}

function resolveMapMakerImageSource(source: MapMakerImageSource, usage: MapMakerAssetUsage): MapMakerResolvedImage {
  if (source.kind === 'url') {
    return { url: requireMapMakerImageUrl(source.url), expectedWidth: null, expectedHeight: null };
  }
  const asset = getMapMakerAsset(source.assetId);
  return {
    url: requireMapMakerImageUrl(getMapMakerAssetSrc(asset.id, usage)),
    expectedWidth: usage === 'element' ? asset.width : null,
    expectedHeight: usage === 'element' ? asset.height : null,
  };
}

function listProjectImages(project: MapMakerProject, visibleElementsOnly = false): MapMakerResolvedImage[] {
  const elements = visibleElementsOnly && !project.settings.elementsVisible ? [] : project.elements;
  const images = [
    ...project.baseTiles.map((tile) => resolveMapMakerImageSource(tile.source, 'tile')),
    ...elements.map((element) => resolveMapMakerImageSource(element.source, 'element')),
  ];
  const uniqueImages = new Map<string, MapMakerResolvedImage>();
  for (const image of images) {
    const existingImage = uniqueImages.get(image.url);
    if (existingImage === undefined) {
      uniqueImages.set(image.url, image);
      continue;
    }

    const hasConflictingKnownSizes =
      existingImage.expectedWidth !== null &&
      image.expectedWidth !== null &&
      (existingImage.expectedWidth !== image.expectedWidth || existingImage.expectedHeight !== image.expectedHeight);
    if (hasConflictingKnownSizes) {
      throw new Error(
        `Map Maker image ${JSON.stringify(image.url)} has conflicting natural size expectations. Received ${JSON.stringify([existingImage, image])}.`,
      );
    }
    uniqueImages.set(image.url, {
      url: image.url,
      expectedWidth: existingImage.expectedWidth ?? image.expectedWidth,
      expectedHeight: existingImage.expectedHeight ?? image.expectedHeight,
    });
  }
  return [...uniqueImages.values()];
}

function requireMatchingNaturalSize(image: HTMLImageElement, expectedImage: MapMakerResolvedImage): void {
  if (
    expectedImage.expectedWidth !== null &&
    expectedImage.expectedHeight !== null &&
    (image.naturalWidth !== expectedImage.expectedWidth || image.naturalHeight !== expectedImage.expectedHeight)
  ) {
    throw new Error(
      `Map Maker image ${JSON.stringify(expectedImage.url)} changed natural dimensions. Expected ${expectedImage.expectedWidth} × ${expectedImage.expectedHeight}, received ${image.naturalWidth} × ${image.naturalHeight}.`,
    );
  }
}

async function loadProjectImages(
  project: MapMakerProject,
  visibleElementsOnly = false,
): Promise<Map<string, HTMLImageElement>> {
  const expectedImages = listProjectImages(project, visibleElementsOnly);
  const loadedImages = await Promise.all(expectedImages.map(async (expectedImage) => {
    const image = await preloadMapMakerImage(expectedImage.url);
    requireMatchingNaturalSize(image, expectedImage);
    return [expectedImage.url, image] as const;
  }));
  return new Map(loadedImages);
}

export async function preloadMapMakerProject(project: MapMakerProject): Promise<void> {
  await loadProjectImages(requireMapMakerProject(project));
}

function createMapMakerCanvas(project: MapMakerProject): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    throw new Error(`Map Maker PNG export requires document.createElement. Received ${describeMapMakerValue(typeof document === 'undefined' ? undefined : document.createElement)}.`);
  }
  const canvas = document.createElement('canvas');
  canvas.width = project.columns * MAP_MAKER_TILE_SIZE;
  canvas.height = project.rows * MAP_MAKER_TILE_SIZE;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Map Maker PNG export requires a 2D canvas context. Received null.');
  }
  return { canvas, context };
}

function requireLoadedImage(
  images: ReadonlyMap<string, HTMLImageElement>,
  source: MapMakerImageSource,
  usage: MapMakerAssetUsage,
): HTMLImageElement {
  const imageUrl = resolveMapMakerImageSource(source, usage).url;
  const image = images.get(imageUrl);
  if (image === undefined) {
    throw new Error(`Map Maker image was not preloaded for ${JSON.stringify(imageUrl)}. Received undefined.`);
  }
  return image;
}

function drawMapMakerImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  flipHorizontal: boolean,
  flipVertical: boolean,
): void {
  if (rotation === 0 && !flipHorizontal && !flipVertical) {
    context.drawImage(image, x, y, width, height);
    return;
  }
  context.save();
  try {
    context.translate(x + width / 2, y + height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    context.drawImage(image, -width / 2, -height / 2, width, height);
  } finally {
    context.restore();
  }
}

function drawMapMakerBaseTiles(
  context: CanvasRenderingContext2D,
  project: MapMakerProject,
  images: ReadonlyMap<string, HTMLImageElement>,
): void {
  for (const tile of project.baseTiles) {
    const image = requireLoadedImage(images, tile.source, 'tile');
    drawMapMakerImage(
      context,
      image,
      tile.column * MAP_MAKER_TILE_SIZE,
      tile.row * MAP_MAKER_TILE_SIZE,
      MAP_MAKER_TILE_SIZE,
      MAP_MAKER_TILE_SIZE,
      tile.rotation,
      tile.flipHorizontal,
      tile.flipVertical,
    );
  }
}

function drawMapMakerElements(
  context: CanvasRenderingContext2D,
  project: MapMakerProject,
  images: ReadonlyMap<string, HTMLImageElement>,
): void {
  if (!project.settings.elementsVisible) return;
  for (const layer of [1, 2] as const) {
    for (const element of project.elements) {
      if (element.layer !== layer) continue;
      const image = requireLoadedImage(images, element.source, 'element');
      drawMapMakerImage(
        context,
        image,
        element.x,
        element.y,
        element.width,
        element.height,
        element.rotation,
        element.flipHorizontal,
        element.flipVertical,
      );
    }
  }
}

function encodeMapMakerPng(canvas: HTMLCanvasElement, imageUrls: readonly string[]): Promise<Blob> {
  if (typeof canvas.toBlob !== 'function') {
    throw new Error(`Map Maker PNG export requires HTMLCanvasElement.toBlob. Received ${describeMapMakerValue(canvas.toBlob)}.`);
  }
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((pngBlob) => {
        if (pngBlob === null) {
          reject(new Error('Map Maker PNG encoding returned null. Received null.'));
          return;
        }
        if (pngBlob.type !== 'image/png') {
          reject(new Error(`Map Maker PNG encoding returned the wrong MIME type. Received ${JSON.stringify(pngBlob.type)}.`));
          return;
        }
        if (pngBlob.size <= 0) {
          reject(new Error(`Map Maker PNG encoding returned an empty Blob. Received size=${pngBlob.size}.`));
          return;
        }
        resolve(pngBlob);
      }, 'image/png');
    } catch (error: unknown) {
      reject(
        new Error(
          `Map Maker PNG encoding failed for images ${JSON.stringify(imageUrls)}. Received ${describeMapMakerError(error)}.`,
          { cause: error },
        ),
      );
    }
  });
}

export async function buildMapMakerPng(project: MapMakerProject): Promise<Blob> {
  const validProject = requireMapMakerProject(project);
  const expectedImages = listProjectImages(validProject, true);
  const loadedImages = await loadProjectImages(validProject, true);
  const { canvas, context } = createMapMakerCanvas(validProject);
  drawMapMakerBaseTiles(context, validProject, loadedImages);
  drawMapMakerElements(context, validProject, loadedImages);
  return encodeMapMakerPng(canvas, expectedImages.map((image) => image.url));
}
