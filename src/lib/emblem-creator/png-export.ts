import { loadEmblemImage } from '@/lib/emblem-creator/image-loading';
import { assertEmblemProject } from '@/lib/emblem-creator/project';
import {
  EMBLEM_CANVAS,
  EMBLEM_LAYER_ORDER,
  type EmblemElement,
  type EmblemProject,
} from '@/lib/emblem-creator/types';

function createExportCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = EMBLEM_CANVAS.width;
  canvas.height = EMBLEM_CANVAS.height;
  return canvas;
}

function requireCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error(`Cannot export emblem PNG: 2D canvas context is unavailable for ${canvas.width} × ${canvas.height}.`);
  }
  return context;
}

function visibleElementsInDrawOrder(project: EmblemProject): EmblemElement[] {
  return [...EMBLEM_LAYER_ORDER].reverse().flatMap((layerId) => {
    const layer = project.layers[layerId];
    return layer.visible ? [...layer.elements] : [];
  });
}

function drawElement(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  element: EmblemElement,
): void {
  const { x, y, rotation, scale, mirrorX } = element.transform;
  const { naturalWidth, naturalHeight } = element.source;
  // Match the Canvas SVG image's xMidYMid meet viewport.
  const fitScale = Math.min(naturalWidth / image.naturalWidth, naturalHeight / image.naturalHeight);
  const contentWidth = image.naturalWidth * fitScale;
  const contentHeight = image.naturalHeight * fitScale;
  context.save();
  try {
    context.translate(x, y);
    context.rotate(rotation * Math.PI / 180);
    context.scale(mirrorX ? -scale : scale, scale);
    context.drawImage(image, -contentWidth / 2, -contentHeight / 2, contentWidth, contentHeight);
  } finally {
    context.restore();
  }
}

async function drawProject(
  context: CanvasRenderingContext2D,
  elements: readonly EmblemElement[],
): Promise<void> {
  for (const element of elements) {
    const image = await loadEmblemImage(element.source.url);
    drawElement(context, image, element);
  }
}

function encodePng(canvas: HTMLCanvasElement, elements: readonly EmblemElement[]): Promise<Blob> {
  const imageUrls = JSON.stringify(elements.map((element) => element.source.url));
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob === null) {
          reject(new Error(`Emblem PNG encoding returned null for ${canvas.width} × ${canvas.height}; image URLs: ${imageUrls}.`));
          return;
        }
        if (blob.size === 0 || blob.type !== 'image/png') {
          reject(new Error(`Emblem PNG encoding returned invalid Blob: size=${blob.size}, type=${JSON.stringify(blob.type)}; image URLs: ${imageUrls}.`));
          return;
        }
        resolve(blob);
      }, 'image/png');
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'SecurityError') {
        reject(new Error(`Cannot export emblem PNG because the canvas is not origin-clean; image URLs: ${imageUrls}; ${error.message}`, { cause: error }));
        return;
      }
      reject(error);
    }
  });
}

export async function exportEmblemProjectPng(project: EmblemProject): Promise<Blob> {
  assertEmblemProject(project);
  const canvas = createExportCanvas();
  const context = requireCanvasContext(canvas);
  const elements = visibleElementsInDrawOrder(project);
  await drawProject(context, elements);
  return encodePng(canvas, elements);
}
