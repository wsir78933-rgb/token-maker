import { requireEmblemImageUrl } from '@/lib/emblem-creator/image-url';

const IMAGE_LOAD_TIMEOUT_MS = 15_000;

function imageErrorReason(event: Event | string): string {
  if (typeof event === 'string') return event;
  if (event instanceof ErrorEvent && event.message) return event.message;
  return `Browser emitted an image ${event.type} event without further details.`;
}

export async function loadEmblemImage(url: string): Promise<HTMLImageElement> {
  const imageUrl = requireEmblemImageUrl(url);
  if (typeof Image !== 'function') {
    throw new Error(`Cannot load emblem image ${JSON.stringify(imageUrl)}: browser Image API is unavailable.`);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    function finishLoading(): void {
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
    }

    image.onload = () => {
      finishLoading();
      if (
        !Number.isFinite(image.naturalWidth) || image.naturalWidth <= 0 ||
        !Number.isFinite(image.naturalHeight) || image.naturalHeight <= 0
      ) {
        reject(new Error(
          `Emblem image ${JSON.stringify(imageUrl)} loaded with invalid natural dimensions ${image.naturalWidth} × ${image.naturalHeight}.`,
        ));
        return;
      }
      resolve(image);
    };
    image.onerror = (event) => {
      finishLoading();
      reject(new Error(`Cannot load emblem image ${JSON.stringify(imageUrl)}: ${imageErrorReason(event)}`));
    };

    const timeout = setTimeout(() => {
      finishLoading();
      reject(new Error(`Emblem image ${JSON.stringify(imageUrl)} did not load within ${IMAGE_LOAD_TIMEOUT_MS} ms.`));
    }, IMAGE_LOAD_TIMEOUT_MS);

    try {
      image.src = imageUrl;
    } catch (error: unknown) {
      finishLoading();
      reject(error);
    }
  });
}
