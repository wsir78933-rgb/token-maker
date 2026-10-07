import { getSolarAsset } from './catalog';
import { assertSolarSaveSnapshot } from './manual';
import { assertRandomSolarSystem } from './random';
import {
  SOLAR_CANVAS_HEIGHT,
  SOLAR_CANVAS_WIDTH,
  SOLAR_STAR_HEIGHT,
  SOLAR_STAR_WIDTH,
  type RandomSolarSystem,
  type SolarSaveSnapshot,
} from './types';

const SOLAR_CANVAS_BACKGROUND = '#000000';

function describeReceivedValue(receivedValue: unknown): string {
  if (typeof receivedValue === 'string') return JSON.stringify(receivedValue);
  if (receivedValue === undefined) return 'undefined';
  if (receivedValue === null) return 'null';
  if (
    typeof receivedValue === 'number' ||
    typeof receivedValue === 'boolean' ||
    typeof receivedValue === 'bigint'
  ) {
    return String(receivedValue);
  }

  try {
    const serializedValue = JSON.stringify(receivedValue);
    return serializedValue === undefined
      ? Object.prototype.toString.call(receivedValue)
      : serializedValue;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `${Object.prototype.toString.call(receivedValue)} (JSON.stringify failed: ${error.message}).`;
    }

    throw error;
  }
}

function requireRenderableSnapshot(receivedSnapshot: SolarSaveSnapshot): SolarSaveSnapshot {
  assertSolarSaveSnapshot(receivedSnapshot);
  return receivedSnapshot;
}

function requireRenderableRandomSystem(
  receivedSystem: RandomSolarSystem,
): RandomSolarSystem {
  assertRandomSolarSystem(receivedSystem);
  return receivedSystem;
}

function requireAssetSource(assetId: string): string {
  const asset = getSolarAsset(assetId);
  if (typeof asset.src !== 'string' || asset.src.length === 0) {
    throw new Error(
      `Solar asset ${JSON.stringify(assetId)} must provide a non-empty image source. Received ${describeReceivedValue(asset.src)}.`,
    );
  }

  return asset.src;
}

function imageErrorReason(event: Event | string): string {
  if (typeof event === 'string') {
    return event.length > 0
      ? event
      : 'Browser emitted an image error event without further details.';
  }

  if (typeof ErrorEvent === 'function' && event instanceof ErrorEvent && event.message.length > 0) {
    return event.message;
  }

  return `Browser emitted an image ${event.type} event without further details.`;
}

function loadSolarImage(imageSource: string): Promise<HTMLImageElement> {
  if (typeof Image !== 'function') {
    throw new Error(
      `Solar PNG export requires the browser Image API. Received ${describeReceivedValue(typeof Image === 'undefined' ? undefined : Image)}.`,
    );
  }

  return new Promise((resolve, reject) => {
    const image = new Image();

    function finishLoading(): void {
      image.onload = null;
      image.onerror = null;
    }

    image.onload = () => {
      finishLoading();
      if (
        !Number.isFinite(image.naturalWidth) ||
        image.naturalWidth <= 0 ||
        !Number.isFinite(image.naturalHeight) ||
        image.naturalHeight <= 0
      ) {
        reject(
          new Error(
            `Solar image ${JSON.stringify(imageSource)} loaded with invalid natural dimensions ${image.naturalWidth} × ${image.naturalHeight}.`,
          ),
        );
        return;
      }

      resolve(image);
    };

    image.onerror = (event) => {
      finishLoading();
      reject(
        new Error(
          `Solar image ${JSON.stringify(imageSource)} could not be loaded: ${imageErrorReason(event)}.`,
        ),
      );
    };

    try {
      image.src = imageSource;
    } catch (error: unknown) {
      finishLoading();
      reject(error);
    }
  });
}

async function drawSolarImage(
  context: CanvasRenderingContext2D,
  imageSource: string,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<void> {
  const image = await loadSolarImage(imageSource);
  context.drawImage(image, x, y, width, height);
}

type SolarImagePlacement = {
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

async function drawSolarSystemImages(
  context: CanvasRenderingContext2D,
  starAssetId: string | null,
  planets: readonly SolarImagePlacement[],
): Promise<void> {
  if (starAssetId !== null) {
    await drawSolarImage(
      context,
      requireAssetSource(starAssetId),
      0,
      0,
      SOLAR_STAR_WIDTH,
      SOLAR_STAR_HEIGHT,
    );
  }

  for (const planet of planets) {
    await drawSolarImage(
      context,
      requireAssetSource(planet.assetId),
      planet.x,
      planet.y,
      planet.width,
      planet.height,
    );
  }
}

function createSolarCanvas(): {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
} {
  if (typeof document === 'undefined') {
    throw new Error(
      `Solar PNG export requires document. Received ${describeReceivedValue(undefined)}.`,
    );
  }

  const canvas = document.createElement('canvas');
  canvas.width = SOLAR_CANVAS_WIDTH;
  canvas.height = SOLAR_CANVAS_HEIGHT;

  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Solar PNG export requires a 2D canvas context. Received null.');
  }

  context.fillStyle = SOLAR_CANVAS_BACKGROUND;
  context.fillRect(0, 0, SOLAR_CANVAS_WIDTH, SOLAR_CANVAS_HEIGHT);

  return { canvas, context };
}

function encodeSolarCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  if (typeof canvas.toBlob !== 'function') {
    throw new Error(
      `Solar PNG export requires HTMLCanvasElement.toBlob. Received ${describeReceivedValue(canvas.toBlob)}.`,
    );
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((pngBlob) => {
      if (pngBlob === null) {
        reject(new Error('Solar PNG export encoding returned null. Received null.'));
        return;
      }

      if (pngBlob.type !== 'image/png') {
        reject(
          new Error(
            `Solar PNG export encoding returned the wrong MIME type. Received ${JSON.stringify(pngBlob.type)}.`,
          ),
        );
        return;
      }

      if (pngBlob.size <= 0) {
        reject(
          new Error(
            `Solar PNG export encoding returned an empty Blob. Received size=${pngBlob.size}.`,
          ),
        );
        return;
      }

      resolve(pngBlob);
    }, 'image/png');
  });
}

export async function buildSolarSystemPng(
  snapshot: SolarSaveSnapshot,
): Promise<Blob> {
  const validSnapshot = requireRenderableSnapshot(snapshot);
  const { canvas, context } = createSolarCanvas();
  await drawSolarSystemImages(context, validSnapshot.starAssetId, validSnapshot.planets);

  return encodeSolarCanvas(canvas);
}

export async function buildRandomSolarSystemPng(
  system: RandomSolarSystem,
): Promise<Blob> {
  const validSystem = requireRenderableRandomSystem(system);
  const { canvas, context } = createSolarCanvas();
  await drawSolarSystemImages(context, validSystem.starAssetId, validSystem.planets);

  return encodeSolarCanvas(canvas);
}
