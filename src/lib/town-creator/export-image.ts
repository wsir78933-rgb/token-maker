import { getTownAssetVariant } from './catalog';
import { validateTownDocument } from './document';
import { buildTownSvg } from './render';
import type { TownDocument } from './types';

export type TownPngCanvasSurface = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

export type TownPngExportOptions = {
  assetSourceLoader?: (sourceUrl: string) => Promise<string>;
  imageLoader?: (source: string) => Promise<HTMLImageElement>;
  canvasFactory?: (width: number, height: number) => TownPngCanvasSurface;
  createObjectUrl?: (blob: Blob) => string;
  revokeObjectUrl?: (objectUrl: string) => void;
};

type TownVisibleVariantSource = {
  key: string;
  sourceUrl: string;
};

const TOWN_PUBLIC_ROOT = '/town-creator/';

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value instanceof Error) return `${value.name}: ${value.message || '(empty message)'}`;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? Object.prototype.toString.call(value) : serialized;
  } catch (serializationFailure: unknown) {
    if (serializationFailure instanceof Error) {
      return `${Object.prototype.toString.call(value)} (serialization failed: ${serializationFailure.message})`;
    }

    throw serializationFailure;
  }
}

function stringifyFailureReason(value: unknown): string {
  if (value instanceof Error) {
    return value.message.length > 0 ? value.message : `${value.name} with empty message`;
  }

  return describeReceivedValue(value);
}

function requireFetch(): typeof fetch {
  if (typeof fetch !== 'function') {
    throw new Error(`Town PNG export requires fetch. Received ${describeReceivedValue(typeof fetch === 'undefined' ? undefined : fetch)}.`);
  }

  return fetch;
}

function requireBrowserUrlApi(): Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'> {
  if (typeof URL !== 'function' || typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
    throw new Error('Town PNG export requires URL.createObjectURL and URL.revokeObjectURL browser APIs.');
  }

  return URL;
}

function resolveTownPublicPath(path: string): string {
  if (path.startsWith('/')) return path;
  return `${TOWN_PUBLIC_ROOT}${path}`;
}

function requireHttpResponse(response: Response, sourceUrl: string): Response {
  if (!response || typeof response.ok !== 'boolean') {
    throw new Error(
      `Town source URL ${JSON.stringify(sourceUrl)} returned an invalid fetch response. Received ${describeReceivedValue(response)}.`,
    );
  }
  if (!response.ok) {
    throw new Error(
      `Town source URL ${JSON.stringify(sourceUrl)} failed with HTTP ${response.status} ${response.statusText || '(no status text)'}.`,
    );
  }

  return response;
}

function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa !== 'function') {
    throw new Error('Town PNG export requires btoa to inline fetched image bytes. Received undefined.');
  }

  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return btoa(binary);
}

async function blobToDataUri(blob: Blob, sourceUrl: string): Promise<string> {
  if (blob.size <= 0) {
    throw new Error(`Town source URL ${JSON.stringify(sourceUrl)} returned an empty response body.`);
  }

  let bytes: ArrayBuffer;
  try {
    bytes = await blob.arrayBuffer();
  } catch (readFailure: unknown) {
    throw new Error(
      `Town source URL ${JSON.stringify(sourceUrl)} could not read its response body. Received ${stringifyFailureReason(readFailure)}.`,
      { cause: readFailure },
    );
  }

  const contentType = blob.type || 'application/octet-stream';
  return `data:${contentType};base64,${encodeBase64(new Uint8Array(bytes))}`;
}

async function loadTownSourceDataUri(sourceUrl: string): Promise<string> {
  if (sourceUrl.startsWith('data:')) return sourceUrl;

  let response: Response;
  try {
    response = await requireFetch()(sourceUrl);
  } catch (fetchFailure: unknown) {
    throw new Error(
      `Town source URL ${JSON.stringify(sourceUrl)} could not be fetched. Received ${stringifyFailureReason(fetchFailure)}.`,
      { cause: fetchFailure },
    );
  }

  const validResponse = requireHttpResponse(response, sourceUrl);
  let responseBlob: Blob;
  try {
    responseBlob = await validResponse.blob();
  } catch (readFailure: unknown) {
    throw new Error(
      `Town source URL ${JSON.stringify(sourceUrl)} could not be read after HTTP ${validResponse.status}. Received ${stringifyFailureReason(readFailure)}.`,
      { cause: readFailure },
    );
  }

  return blobToDataUri(responseBlob, sourceUrl);
}

function getVisibleVariantSources(document: TownDocument): TownVisibleVariantSource[] {
  const sourceByKey = new Map<string, TownVisibleVariantSource>();
  document.layers
    .filter((layer) => layer.visible)
    .flatMap((layer) => layer.objects)
    .forEach((townObject) => {
      const variant = getTownAssetVariant(townObject.assetId, townObject.material);
      const sourceUrl = resolveTownPublicPath(variant.png);
      if (!sourceByKey.has(variant.svg)) {
        sourceByKey.set(variant.svg, { key: variant.svg, sourceUrl });
      }
    });

  return [...sourceByKey.values()];
}

function getTownBackgroundSource(document: TownDocument): TownVisibleVariantSource | null {
  if (document.backgroundImageUrl === '') return null;

  return {
    key: document.backgroundImageUrl,
    sourceUrl: document.backgroundImageUrl,
  };
}

async function loadTownAssetSources(
  document: TownDocument,
  assetSourceLoader: (sourceUrl: string) => Promise<string>,
): Promise<Readonly<Record<string, string>>> {
  const sources = getVisibleVariantSources(document);
  const backgroundSource = getTownBackgroundSource(document);
  if (backgroundSource !== null && !sources.some((source) => source.key === backgroundSource.key)) {
    sources.push(backgroundSource);
  }

  const loadedSources = await Promise.all(
    sources.map(async (source) => ({
      key: source.key,
      dataUri: await assetSourceLoader(source.sourceUrl),
    })),
  );

  return Object.fromEntries(loadedSources.map((source) => [source.key, source.dataUri]));
}

function requireImageApi(): typeof Image {
  if (typeof Image !== 'function') {
    throw new Error(
      `Town PNG export requires the browser Image API. Received ${describeReceivedValue(typeof Image === 'undefined' ? undefined : Image)}.`,
    );
  }

  return Image;
}

function imageErrorReason(event: Event | string): string {
  if (typeof event === 'string') {
    return event.length > 0 ? event : 'browser emitted an empty image error message';
  }

  if (typeof ErrorEvent === 'function' && event instanceof ErrorEvent && event.message.length > 0) {
    return event.message;
  }

  return event.type || 'unknown image error';
}

async function loadTownRasterImage(source: string): Promise<HTMLImageElement> {
  const ImageConstructor = requireImageApi();
  return new Promise((resolve, reject) => {
    const image = new ImageConstructor();
    const finish = (): void => {
      image.onload = null;
      image.onerror = null;
    };

    image.onload = () => {
      finish();
      if (!Number.isFinite(image.naturalWidth) || image.naturalWidth <= 0 || !Number.isFinite(image.naturalHeight) || image.naturalHeight <= 0) {
        reject(
          new Error(
            `Town raster source ${JSON.stringify(source)} loaded with invalid natural dimensions ${image.naturalWidth} × ${image.naturalHeight}.`,
          ),
        );
        return;
      }
      resolve(image);
    };
    image.onerror = (event) => {
      finish();
      reject(new Error(`Town raster source ${JSON.stringify(source)} could not be loaded: ${imageErrorReason(event)}.`));
    };

    try {
      image.src = source;
    } catch (sourceFailure: unknown) {
      finish();
      reject(sourceFailure);
    }
  });
}

function createTownCanvas(width: number, height: number): TownPngCanvasSurface {
  if (typeof document === 'undefined') {
    throw new Error('Town PNG export requires document to create a canvas. Received undefined.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Town PNG export requires a 2D canvas context. Received null.');
  }

  return { canvas, context };
}

function encodeTownCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  if (typeof canvas.toBlob !== 'function') {
    throw new Error(`Town PNG export requires HTMLCanvasElement.toBlob. Received ${describeReceivedValue(canvas.toBlob)}.`);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((pngBlob) => {
      if (pngBlob === null) {
        reject(new Error('Town PNG export encoding returned null. Received null.'));
        return;
      }
      if (pngBlob.type !== 'image/png') {
        reject(new Error(`Town PNG export encoding returned MIME ${JSON.stringify(pngBlob.type)} instead of image/png.`));
        return;
      }
      if (pngBlob.size <= 0) {
        reject(new Error(`Town PNG export encoding returned an empty Blob. Received size=${pngBlob.size}.`));
        return;
      }

      resolve(pngBlob);
    }, 'image/png');
  });
}

function getDefaultObjectUrlFactory(): (blob: Blob) => string {
  return (blob) => requireBrowserUrlApi().createObjectURL(blob);
}

function getDefaultObjectUrlRevoker(): (objectUrl: string) => void {
  return (objectUrl) => requireBrowserUrlApi().revokeObjectURL(objectUrl);
}

export async function buildTownPng(
  document: TownDocument,
  options: TownPngExportOptions = {},
): Promise<Blob> {
  const validatedDocument = validateTownDocument(document);
  const assetSourceLoader = options.assetSourceLoader ?? loadTownSourceDataUri;
  const imageLoader = options.imageLoader ?? loadTownRasterImage;
  const canvasFactory = options.canvasFactory ?? createTownCanvas;
  const createObjectUrl = options.createObjectUrl ?? getDefaultObjectUrlFactory();
  const revokeObjectUrl = options.revokeObjectUrl ?? getDefaultObjectUrlRevoker();
  const assetSources = await loadTownAssetSources(validatedDocument, assetSourceLoader);
  const svgMarkup = buildTownSvg(validatedDocument, assetSources);
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  let svgObjectUrl: string | null = null;

  try {
    svgObjectUrl = createObjectUrl(svgBlob);
    if (typeof svgObjectUrl !== 'string' || svgObjectUrl.length === 0) {
      throw new Error(`Town PNG export object URL must be a non-empty string. Received ${describeReceivedValue(svgObjectUrl)}.`);
    }

    const image = await imageLoader(svgObjectUrl);
    const { canvas, context } = canvasFactory(validatedDocument.width, validatedDocument.height);
    context.drawImage(image, 0, 0, validatedDocument.width, validatedDocument.height);
    return await encodeTownCanvas(canvas);
  } finally {
    if (svgObjectUrl !== null) {
      revokeObjectUrl(svgObjectUrl);
    }
  }
}

export { loadTownSourceDataUri };
