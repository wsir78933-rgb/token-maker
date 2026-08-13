import { renderCoatSceneSvg } from './scene-svg';
import type { CoatProject } from './types';

export const COAT_EXPORT_SIZES = [256, 512, 1024, 2048] as const;
const DEFAULT_COAT_JPEG_QUALITY = 0.92;

type CoatExportSize = (typeof COAT_EXPORT_SIZES)[number];

interface CoatExportDimensions {
  width: number;
  height: number;
}

export async function exportCoatPng(project: CoatProject, size: number): Promise<Blob> {
  assertExportSize(size);
  const canvas = await renderProjectToCanvas(project, getProjectExportDimensions(project, size));
  return canvasToPngBlob(canvas);
}

export async function exportCoatJpeg(
  project: CoatProject,
  size: number,
  quality = DEFAULT_COAT_JPEG_QUALITY,
): Promise<Blob> {
  assertExportSize(size);
  assertJpegQuality(quality);
  const canvas = await renderProjectToCanvas(project, getProjectExportDimensions(project, size));
  return canvasToJpegBlob(canvas, quality);
}

export async function exportCoatPdf(project: CoatProject, size: number): Promise<Blob> {
  assertExportSize(size);
  const dimensions = getProjectExportDimensions(project, size);
  const canvas = await renderProjectToCanvas(project, dimensions);
  if (typeof canvas.toDataURL !== 'function') {
    throw new Error('Coat PDF export failed: canvas data URL is unavailable');
  }

  let imageDataUrl: string;
  try {
    imageDataUrl = canvas.toDataURL('image/png');
  } catch (error) {
    throw new Error(`Coat PDF export failed while encoding PNG: ${getErrorMessage(error)}`);
  }
  if (typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/png')) {
    throw new Error('Coat PDF export failed: canvas did not produce a PNG data URL');
  }

  try {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait', unit: 'px', format: [dimensions.width, dimensions.height] });
    pdf.addImage(imageDataUrl, 'PNG', 0, 0, dimensions.width, dimensions.height);
    const pdfBlob = pdf.output('blob');
    if (!(pdfBlob instanceof Blob) || pdfBlob.size === 0) {
      throw new Error('jsPDF returned an empty Blob');
    }
    return pdfBlob;
  } catch (error) {
    throw new Error(`Coat PDF export failed: ${getErrorMessage(error)}`);
  }
}

export async function exportCoatBatch(projects: CoatProject[], size: number): Promise<Blob> {
  assertExportSize(size);
  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error(`Invalid coat export projects: ${String(projects)}`);
  }

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const usedNames = new Set<string>();
  for (const [index, project] of projects.entries()) {
    const png = await exportCoatPng(project, size);
    const fileName = getUniqueProjectFileName(project.name, index, usedNames);
    zip.file(fileName, await png.arrayBuffer());
  }

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    if (!(zipBlob instanceof Blob) || zipBlob.size === 0) {
      throw new Error('JSZip returned an empty Blob');
    }
    return zipBlob;
  } catch (error) {
    throw new Error(`Coat batch ZIP export failed: ${getErrorMessage(error)}`);
  }
}

export function printCoatScene(project: CoatProject, size: number): void {
  assertExportSize(size);
  const printWindow = globalThis.window?.open('', '_blank');
  if (!printWindow) {
    throw new Error('Coat print failed: browser popup was blocked');
  }

  try {
    const svg = renderCoatSceneSvg(project, getProjectExportDimensions(project, size));
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><title>Coat of Arms</title><style>html,body{margin:0;background:#fff}svg{display:block;width:100%;height:auto}</style></head><body>${svg}</body></html>`);
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, { once: true });
    printWindow.document.close();
  } catch (error) {
    printWindow.close();
    throw new Error(`Coat print failed while preparing popup: ${getErrorMessage(error)}`);
  }
}

async function renderProjectToCanvas(project: CoatProject, dimensions: CoatExportDimensions): Promise<HTMLCanvasElement> {
  const documentApi = globalThis.document;
  const imageConstructor = globalThis.Image;
  const urlApi = globalThis.URL;
  if (!documentApi || !imageConstructor || !urlApi || typeof urlApi.createObjectURL !== 'function') {
    throw new Error('Coat image export failed: browser canvas and image APIs are unavailable');
  }

  const canvas = documentApi.createElement('canvas');
  if (!isCanvasLike(canvas)) {
    throw new Error('Coat image export failed: browser did not create a canvas');
  }
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Coat image export failed: browser canvas context is unavailable');
  }

  const svg = renderCoatSceneSvg(project, dimensions);
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = urlApi.createObjectURL(svgBlob);
  try {
    const image = await loadImage(imageConstructor, objectUrl);
    context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
    return canvas;
  } catch (error) {
    throw new Error(`Coat image export failed while decoding SVG: ${getErrorMessage(error)}`);
  } finally {
    urlApi.revokeObjectURL?.(objectUrl);
  }
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  if (typeof canvas.toBlob !== 'function') {
    return Promise.reject(new Error('Coat PNG export failed: canvas Blob encoding is unavailable'));
  }
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((pngBlob) => {
        if (!pngBlob || pngBlob.size === 0 || pngBlob.type !== 'image/png') {
          reject(new Error('Coat PNG export failed: canvas produced an empty PNG Blob'));
          return;
        }
        resolve(pngBlob);
      }, 'image/png');
    } catch (error) {
      reject(new Error(`Coat PNG export failed while encoding canvas: ${getErrorMessage(error)}`));
    }
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  if (typeof canvas.toBlob !== 'function') {
    return Promise.reject(new Error('Coat JPEG export failed: canvas Blob encoding is unavailable'));
  }
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((jpegBlob) => {
        if (!jpegBlob || jpegBlob.size === 0 || jpegBlob.type !== 'image/jpeg') {
          reject(new Error('Coat JPEG export failed: canvas produced an empty JPEG Blob'));
          return;
        }
        resolve(jpegBlob);
      }, 'image/jpeg', quality);
    } catch (error) {
      reject(new Error(`Coat JPEG export failed while encoding canvas: ${getErrorMessage(error)}`));
    }
  });
}

function loadImage(
  ImageConstructor: typeof Image,
  sourceUrl: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new ImageConstructor();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('browser image decoder rejected SVG'));
    try {
      image.src = sourceUrl;
    } catch (error) {
      reject(new Error(`browser image decoder could not load SVG: ${getErrorMessage(error)}`));
    }
  });
}

function getUniqueProjectFileName(projectName: string, index: number, usedNames: Set<string>): string {
  const safeBaseName = projectName
    .trim()
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 80) || `coat-${index + 1}`;
  let fileName = `${safeBaseName}.png`;
  let suffix = 2;
  while (usedNames.has(fileName)) {
    fileName = `${safeBaseName}-${suffix}.png`;
    suffix += 1;
  }
  usedNames.add(fileName);
  return fileName;
}

function assertExportSize(size: unknown): asserts size is CoatExportSize {
  if (!COAT_EXPORT_SIZES.includes(size as CoatExportSize)) {
    throw new Error(`Unsupported coat export size: ${String(size)}`);
  }
}

/** Maps the selected longest-edge export size onto the project's own canvas ratio. */
function getProjectExportDimensions(project: CoatProject, size: CoatExportSize): CoatExportDimensions {
  const longestCanvasEdge = Math.max(project.canvas.width, project.canvas.height);
  const scale = size / longestCanvasEdge;
  return {
    width: Math.max(1, Math.round(project.canvas.width * scale)),
    height: Math.max(1, Math.round(project.canvas.height * scale)),
  };
}

function assertJpegQuality(quality: unknown): asserts quality is number {
  if (typeof quality !== 'number' || !Number.isFinite(quality) || quality < 0 || quality > 1) {
    throw new Error(`Invalid coat JPEG quality: ${String(quality)}`);
  }
}

function isCanvasLike(value: unknown): value is HTMLCanvasElement {
  return Boolean(value)
    && typeof (value as HTMLCanvasElement).getContext === 'function'
    && typeof (value as HTMLCanvasElement).toBlob === 'function';
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
