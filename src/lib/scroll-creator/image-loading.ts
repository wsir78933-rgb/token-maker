import { requireScrollImageUrl as requireProjectImageUrl } from './project';

export const SCROLL_IMAGE_LOAD_TIMEOUT_MS = 15_000;

export type ScrollImageDimensions = {
  width: number;
  height: number;
};

/** Returns the domain-validated URL used by the image loader and image elements. */
export function requireScrollImageUrl(url: string): string {
  return requireProjectImageUrl(url, 'Scroll image URL');
}

/**
 * Loads an image through the browser's normal image pipeline and returns its
 * intrinsic dimensions. This intentionally avoids canvas/CORS requirements.
 */
export async function loadScrollImage(url: string): Promise<ScrollImageDimensions> {
  const imageUrl = requireScrollImageUrl(url);
  if (typeof Image !== 'function') {
    throw new Error(
      `Cannot load scroll image ${JSON.stringify(imageUrl)}: browser Image API is unavailable.`,
    );
  }

  return new Promise<ScrollImageDimensions>((resolve, reject) => {
    const image = new Image();
    let finished = false;
    const timeout = setTimeout(() => {
      finishImageLoad();
      reject(
        new Error(
          `Scroll image ${JSON.stringify(imageUrl)} did not load within ${SCROLL_IMAGE_LOAD_TIMEOUT_MS} ms.`,
        ),
      );
    }, SCROLL_IMAGE_LOAD_TIMEOUT_MS);

    function finishImageLoad(): void {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
    }

    image.onload = () => {
      finishImageLoad();
      const dimensions = readImageDimensions(image);
      if (dimensions === null) {
        reject(
          new Error(
            `Scroll image ${JSON.stringify(imageUrl)} loaded with invalid natural dimensions ${image.naturalWidth} × ${image.naturalHeight}.`,
          ),
        );
        return;
      }
      resolve(dimensions);
    };
    image.onerror = (event) => {
      finishImageLoad();
      reject(
        new Error(
          `Cannot load scroll image ${JSON.stringify(imageUrl)}: ${describeImageLoadEvent(event)}.`,
        ),
      );
    };

    try {
      image.src = imageUrl;
    } catch (error: unknown) {
      finishImageLoad();
      if (!(error instanceof Error)) {
        reject(error);
        return;
      }
      reject(
        new Error(
          `Cannot request scroll image ${JSON.stringify(imageUrl)}. Received ${describeImageValue(error)}.`,
          { cause: error },
        ),
      );
    }
  });
}

function readImageDimensions(image: HTMLImageElement): ScrollImageDimensions | null {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return null;
  }
  return { width, height };
}

function describeImageLoadEvent(event: Event | string): string {
  if (typeof event === 'string') return event;
  if (typeof ErrorEvent !== 'undefined' && event instanceof ErrorEvent && event.message) {
    return event.message;
  }
  return event.type.length > 0
    ? `browser emitted an image ${JSON.stringify(event.type)} event without further details`
    : 'browser emitted an image error without further details';
}

function describeImageValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value instanceof Error) return JSON.stringify(value.message || value.name);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return `array(length=${value.length})`;
  return Object.prototype.toString.call(value);
}
