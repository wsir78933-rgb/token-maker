import { getConstellationObjectSrc } from './objects';
import {
  describeConstellationValue,
  requireConstellationImageDimensions,
  requireConstellationImageUrl,
  requireConstellationProject,
} from './validation';
import type {
  ConstellationObject,
  ConstellationProject,
} from './types';

const CONSTELLATION_IMAGE_LOAD_TIMEOUT_MS = 15_000;

function describeConstellationThrownError(receivedError: unknown): string {
  if (receivedError instanceof Error) {
    const detail = receivedError.message.length > 0 ? receivedError.message : 'empty message';
    return `${receivedError.name}: ${detail}`;
  }

  if (
    receivedError !== null &&
    typeof receivedError === 'object' &&
    'name' in receivedError &&
    'message' in receivedError
  ) {
    return `${String(receivedError.name)}: ${String(receivedError.message)}`;
  }

  return describeConstellationValue(receivedError);
}

function imageErrorReason(receivedEvent: Event | string): string {
  if (typeof receivedEvent === 'string') {
    return receivedEvent.length > 0
      ? receivedEvent
      : 'Browser emitted an image error without further details.';
  }

  if (
    typeof ErrorEvent === 'function' &&
    receivedEvent instanceof ErrorEvent &&
    receivedEvent.message.length > 0
  ) {
    return receivedEvent.message;
  }

  return `Browser emitted an image ${receivedEvent.type} event without further details.`;
}

function requireConstellationImageApi(): void {
  if (typeof Image !== 'function') {
    throw new Error(
      `Constellation image loading requires the browser Image API. Received ${describeConstellationValue(typeof Image === 'undefined' ? undefined : Image)}.`,
    );
  }
}

export function loadConstellationImage(url: string): Promise<HTMLImageElement> {
  const validUrl = requireConstellationImageUrl(url);
  requireConstellationImageApi();

  return new Promise((resolve, reject) => {
    const image = new Image();
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
            `Constellation image ${JSON.stringify(validUrl)} loaded with invalid natural dimensions ${image.naturalWidth} × ${image.naturalHeight}.`,
          ),
        );
        return;
      }

      resolve(image);
    };

    image.onerror = (receivedEvent) => {
      finishLoading();
      reject(
        new Error(
          `Constellation image ${JSON.stringify(validUrl)} could not be loaded: ${imageErrorReason(receivedEvent)}.`,
        ),
      );
    };

    timeoutId = setTimeout(() => {
      finishLoading();
      reject(
        new Error(
          `Constellation image ${JSON.stringify(validUrl)} did not load within ${CONSTELLATION_IMAGE_LOAD_TIMEOUT_MS} ms. Received timeout.`,
        ),
      );
    }, CONSTELLATION_IMAGE_LOAD_TIMEOUT_MS);

    image.crossOrigin = 'anonymous';
    try {
      image.src = validUrl;
    } catch (error: unknown) {
      finishLoading();
      reject(
        new Error(
          `Constellation image ${JSON.stringify(validUrl)} could not start loading. Received ${describeConstellationThrownError(error)}.`,
          { cause: error },
        ),
      );
    }
  });
}

function listConstellationProjectImageSources(
  project: ConstellationProject,
): string[] {
  const imageSources = project.objects.map((object) => getConstellationObjectSrc(object));
  if (project.background.imageUrl !== null) {
    imageSources.push(project.background.imageUrl);
  }

  return [...new Set(imageSources)];
}

function requireMatchingBackgroundNaturalDimensions(
  project: ConstellationProject,
  image: HTMLImageElement,
): void {
  if (project.background.imageUrl === null) return;
  const storedDimensions = requireConstellationImageDimensions(
    project.background.imageWidth,
    project.background.imageHeight,
  );
  if (
    image.naturalWidth !== storedDimensions.width ||
    image.naturalHeight !== storedDimensions.height
  ) {
    throw new Error(
      `Constellation background image natural dimensions changed for ${JSON.stringify(project.background.imageUrl)}. Expected ${storedDimensions.width} × ${storedDimensions.height}, received ${image.naturalWidth} × ${image.naturalHeight}.`,
    );
  }
}

export async function preloadConstellationProject(
  project: ConstellationProject,
): Promise<void> {
  const validProject = requireConstellationProject(project);
  const imageSources = listConstellationProjectImageSources(validProject);
  const loadedImages = await Promise.all(imageSources.map((imageSource) => loadConstellationImage(imageSource)));
  const backgroundImageSource = validProject.background.imageUrl;
  if (backgroundImageSource !== null) {
    const backgroundImageIndex = imageSources.indexOf(backgroundImageSource);
    const backgroundImage = loadedImages[backgroundImageIndex];
    if (backgroundImage === undefined) {
      throw new Error(
        `Constellation background image preload did not return ${JSON.stringify(backgroundImageSource)}. Received undefined.`,
      );
    }
    requireMatchingBackgroundNaturalDimensions(validProject, backgroundImage);
  }
}

function createConstellationCanvas(
  project: ConstellationProject,
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    throw new Error(
      `Constellation PNG export requires document.createElement. Received ${describeConstellationValue(typeof document === 'undefined' ? undefined : document.createElement)}.`,
    );
  }

  const canvas = document.createElement('canvas');
  canvas.width = project.width;
  canvas.height = project.height;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Constellation PNG export requires a 2D canvas context. Received null.');
  }

  return { canvas, context };
}

function loadProjectImages(
  project: ConstellationProject,
): Promise<Map<string, HTMLImageElement>> {
  const imageSources = listConstellationProjectImageSources(project);
  return Promise.all(
    imageSources.map(async (imageSource) => [imageSource, await loadConstellationImage(imageSource)] as const),
  ).then((loadedImages) => new Map(loadedImages));
}

function drawConstellationBackground(
  context: CanvasRenderingContext2D,
  project: ConstellationProject,
  loadedImages: Map<string, HTMLImageElement>,
): void {
  if (!project.background.transparent) {
    context.fillStyle = project.background.color;
    context.fillRect(0, 0, project.width, project.height);
  }

  const backgroundImageSource = project.background.imageUrl;
  if (backgroundImageSource === null) return;
  const backgroundImage = loadedImages.get(backgroundImageSource);
  if (backgroundImage === undefined) {
    throw new Error(
      `Constellation background image was not preloaded. Received ${JSON.stringify(backgroundImageSource)}.`,
    );
  }
  requireMatchingBackgroundNaturalDimensions(project, backgroundImage);
  context.drawImage(
    backgroundImage,
    0,
    0,
    backgroundImage.naturalWidth,
    backgroundImage.naturalHeight,
  );
}

function readConstellationObjectRotationDegrees(object: ConstellationObject): number {
  if (object.rotation === undefined) return 0;
  if (typeof object.rotation !== 'number' || !Number.isFinite(object.rotation)) {
    throw new Error(
      `Constellation object ${JSON.stringify(object.id)} rotation must be a finite number of degrees. Received ${describeConstellationValue(object.rotation)}.`,
    );
  }

  return object.rotation;
}

function drawConstellationObjectImage(
  context: CanvasRenderingContext2D,
  object: ConstellationObject,
  image: HTMLImageElement,
): void {
  const rotationDegrees = readConstellationObjectRotationDegrees(object);
  if (rotationDegrees === 0) {
    context.drawImage(image, object.x, object.y, object.width, object.height);
    return;
  }

  const centerX = object.x + object.width / 2;
  const centerY = object.y + object.height / 2;
  context.save();
  try {
    context.translate(centerX, centerY);
    // Positive degrees are clockwise, the same direction as CanvasRenderingContext2D.rotate.
    context.rotate((rotationDegrees * Math.PI) / 180);
    context.drawImage(
      image,
      -object.width / 2,
      -object.height / 2,
      object.width,
      object.height,
    );
  } finally {
    context.restore();
  }
}

function drawConstellationObjects(
  context: CanvasRenderingContext2D,
  objects: readonly ConstellationObject[],
  loadedImages: Map<string, HTMLImageElement>,
): void {
  for (const object of objects) {
    const imageSource = getConstellationObjectSrc(object);
    const image = loadedImages.get(imageSource);
    if (image === undefined) {
      throw new Error(
        `Constellation object image was not preloaded for object ${JSON.stringify(object.id)}. Received ${JSON.stringify(imageSource)}.`,
      );
    }
    drawConstellationObjectImage(context, object, image);
  }
}

function encodeConstellationPng(
  canvas: HTMLCanvasElement,
  backgroundImageUrl: string | null,
): Promise<Blob> {
  if (typeof canvas.toBlob !== 'function') {
    throw new Error(
      `Constellation PNG export requires HTMLCanvasElement.toBlob. Received ${describeConstellationValue(canvas.toBlob)}.`,
    );
  }

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((pngBlob) => {
        if (pngBlob === null) {
          reject(new Error('Constellation PNG export encoding returned null. Received null.'));
          return;
        }
        if (pngBlob.type !== 'image/png') {
          reject(
            new Error(
              `Constellation PNG export encoding returned the wrong MIME type. Received ${JSON.stringify(pngBlob.type)}.`,
            ),
          );
          return;
        }
        if (pngBlob.size <= 0) {
          reject(
            new Error(
              `Constellation PNG export encoding returned an empty Blob. Received size=${pngBlob.size}.`,
            ),
          );
          return;
        }
        resolve(pngBlob);
      }, 'image/png');
    } catch (error: unknown) {
      reject(
        new Error(
          `Constellation PNG export encoding failed for background image ${JSON.stringify(backgroundImageUrl)}. Received ${describeConstellationThrownError(error)}.`,
          { cause: error },
        ),
      );
    }
  });
}

export async function buildConstellationPng(project: ConstellationProject): Promise<Blob> {
  const validProject = requireConstellationProject(project);
  const { canvas, context } = createConstellationCanvas(validProject);
  const loadedImages = await loadProjectImages(validProject);
  drawConstellationBackground(context, validProject, loadedImages);
  drawConstellationObjects(context, validProject.objects, loadedImages);
  return encodeConstellationPng(canvas, validProject.background.imageUrl);
}
