// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import { exportEmblemProjectPng } from '@/lib/emblem-creator/png-export';
import { createDefaultEmblemProject, parseEmblemProjectJson, serializeEmblemProject } from '@/lib/emblem-creator/project';
import type { EmblemElement, EmblemLayer, EmblemLayerId, EmblemProject } from '@/lib/emblem-creator/types';

type AffineMatrix = [number, number, number, number, number, number];
interface DrawnImage {
  url: string;
  corners: readonly (readonly [number, number])[];
}

function recordingContext() {
  let matrix: AffineMatrix = [1, 0, 0, 1, 0, 0];
  const savedMatrices: AffineMatrix[] = [];
  const drawings: DrawnImage[] = [];
  // Apply canvas matrices to actual draw rectangles so tests assert scene geometry.
  const context = {
    save: vi.fn(() => savedMatrices.push([...matrix])),
    restore: vi.fn(() => { matrix = savedMatrices.pop()!; }),
    translate: vi.fn((x: number, y: number) => {
      const [a, b, c, d, e, f] = matrix;
      matrix = [a, b, c, d, e + a * x + c * y, f + b * x + d * y];
    }),
    rotate: vi.fn((angle: number) => {
      const [a, b, c, d, e, f] = matrix;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      matrix = [a * cos + c * sin, b * cos + d * sin, c * cos - a * sin, d * cos - b * sin, e, f];
    }),
    scale: vi.fn((x: number, y: number) => {
      const [a, b, c, d, e, f] = matrix;
      matrix = [a * x, b * x, c * y, d * y, e, f];
    }),
    drawImage: vi.fn((image: HTMLImageElement, x: number, y: number, width: number, height: number) => {
      const [a, b, c, d, e, f] = matrix;
      const corners = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]].map(
        ([cornerX, cornerY]) => [a * cornerX + c * cornerY + e, b * cornerX + d * cornerY + f] as const,
      );
      drawings.push({ url: image.getAttribute('src')!, corners });
    }),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
  };
  return { context, drawings };
}

function element(id: string, transform: Partial<EmblemElement['transform']> = {}): EmblemElement {
  return {
    id,
    source: { kind: 'url', url: `/${id}.png`, naturalWidth: 80, naturalHeight: 40 },
    transform: { x: 512, y: 512, scale: 1, rotation: 0, mirrorX: false, ...transform },
  };
}

function projectWithLayers(layers: Partial<Record<EmblemLayerId, EmblemLayer>>): EmblemProject {
  const project = createDefaultEmblemProject();
  return { ...project, layers: { ...project.layers, ...layers } };
}

let canvasContext: ReturnType<typeof recordingContext>;
let requestedUrls: string[];
let failedImageUrl: string | null;
let loadedImageDimensions: { width: number; height: number };
let encodedCanvas: { width: number; height: number; nativeCanvas: boolean } | null;
let toBlob: MockInstance<HTMLCanvasElement['toBlob']>;
let pngBlob: Blob;

beforeEach(() => {
  canvasContext = recordingContext();
  requestedUrls = [];
  failedImageUrl = null;
  loadedImageDimensions = { width: 640, height: 320 };
  encodedCanvas = null;
  pngBlob = new Blob(['encoded PNG test payload'], { type: 'image/png' });
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    canvasContext.context as unknown as CanvasRenderingContext2D,
  );
  toBlob = vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (this: HTMLCanvasElement, callback) {
    encodedCanvas = { width: this.width, height: this.height, nativeCanvas: this instanceof HTMLCanvasElement };
    queueMicrotask(() => callback(pngBlob));
  });
  vi.stubGlobal('Image', vi.fn(function () {
    const image = document.createElement('img');
    Object.defineProperties(image, {
      // The default image has the saved source's aspect ratio, at a different resolution.
      naturalWidth: { value: loadedImageDimensions.width },
      naturalHeight: { value: loadedImageDimensions.height },
    });
    const nativeSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
    Object.defineProperty(image, 'src', {
      get: () => nativeSrc.get!.call(image),
      set: (url: string) => {
        requestedUrls.push(url);
        nativeSrc.set!.call(image, url);
        queueMicrotask(() => image.dispatchEvent(new Event(url === failedImageUrl ? 'error' : 'load')));
      },
    });
    return image;
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('exportEmblemProjectPng', () => {
  it('encodes a transparent 1024 × 1024 native canvas using only visible layers in back-to-front order', async () => {
    const project = projectWithLayers({
      crests: { visible: true, elements: [element('crest')] },
      details: { visible: true, elements: [element('detail-first'), element('detail-second')] },
      body1: { visible: true, elements: [element('body1')] },
      body2: { visible: false, elements: [element('hidden-broken')] },
      body3: { visible: true, elements: [element('body3')] },
      body4: { visible: true, elements: [element('body4')] },
    });
    failedImageUrl = '/hidden-broken.png';

    await expect(exportEmblemProjectPng(project)).resolves.toBe(pngBlob);
    const expectedOrder = ['/body4.png', '/body3.png', '/body1.png', '/detail-first.png', '/detail-second.png', '/crest.png'];
    expect(requestedUrls).toEqual(expectedOrder);
    expect(canvasContext.drawings.map((drawing) => drawing.url)).toEqual(expectedOrder);
    expect(encodedCanvas?.nativeCanvas).toBe(true);
    expect(encodedCanvas?.width).toBe(1024);
    expect(encodedCanvas?.height).toBe(1024);
    expect(canvasContext.context.fillRect).not.toHaveBeenCalled();
    expect(canvasContext.context.strokeRect).not.toHaveBeenCalled();
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
  });

  it.each([
    { naturalWidth: 200, naturalHeight: 100, savedWidth: 100, savedHeight: 100, rectangle: [-50, -25, 100, 50] },
    { naturalWidth: 100, naturalHeight: 200, savedWidth: 100, savedHeight: 100, rectangle: [-25, -50, 50, 100] },
    { naturalWidth: 200, naturalHeight: 100, savedWidth: 80, savedHeight: 40, rectangle: [-40, -20, 80, 40] },
  ])('centers the current $naturalWidth × $naturalHeight image inside a saved $savedWidth × $savedHeight viewport without stretching', async ({ naturalWidth, naturalHeight, savedWidth, savedHeight, rectangle }) => {
    loadedImageDimensions = { width: naturalWidth, height: naturalHeight };
    const fittedElement: EmblemElement = {
      ...element('fitted'),
      source: { kind: 'url', url: '/fitted.png', naturalWidth: savedWidth, naturalHeight: savedHeight },
    };
    const project = projectWithLayers({ details: { visible: true, elements: [fittedElement] } });
    const reopenedProject = parseEmblemProjectJson(serializeEmblemProject(project));

    await expect(exportEmblemProjectPng(reopenedProject)).resolves.toBe(pngBlob);

    const drawArguments = canvasContext.context.drawImage.mock.calls[0];
    expect(drawArguments[0].naturalWidth).toBe(naturalWidth);
    expect(drawArguments[0].naturalHeight).toBe(naturalHeight);
    expect(drawArguments.slice(1)).toEqual(rectangle);
  });

  it('draws matching aspect ratios about the saved center after rotation, uniform scale and horizontal mirror, then restores the next element', async () => {
    const project = projectWithLayers({
      details: { visible: true, elements: [
        element('transformed', { x: 300, y: 200, rotation: 90, scale: 2, mirrorX: true }),
        element('next', { x: 100, y: 100 }),
      ] },
    });

    await exportEmblemProjectPng(project);
    const expectedCorners = [[340, 280], [340, 120], [260, 120], [260, 280]];
    for (const [index, corner] of canvasContext.drawings[0].corners.entries()) {
      expect(corner[0]).toBeCloseTo(expectedCorners[index][0]);
      expect(corner[1]).toBeCloseTo(expectedCorners[index][1]);
    }
    expect(canvasContext.drawings[1].corners).toEqual([[60, 80], [140, 80], [140, 120], [60, 120]]);
    expect(canvasContext.context.save).toHaveBeenCalledTimes(2);
    expect(canvasContext.context.restore).toHaveBeenCalledTimes(2);
  });

  it('rotates, uniformly scales and mirrors the centered meet content, then restores the next element', async () => {
    loadedImageDimensions = { width: 200, height: 100 };
    const transformedElement: EmblemElement = {
      ...element('transformed-fit', { x: 300, y: 200, rotation: 90, scale: 2, mirrorX: true }),
      source: { kind: 'url', url: '/transformed-fit.png', naturalWidth: 100, naturalHeight: 100 },
    };
    const project = projectWithLayers({
      details: { visible: true, elements: [transformedElement, element('next', { x: 100, y: 100 })] },
    });

    await exportEmblemProjectPng(project);

    expect(canvasContext.context.drawImage.mock.calls[0].slice(1)).toEqual([-50, -25, 100, 50]);
    const expectedCorners = [[350, 300], [350, 100], [250, 100], [250, 300]];
    for (const [index, corner] of canvasContext.drawings[0].corners.entries()) {
      expect(corner[0]).toBeCloseTo(expectedCorners[index][0]);
      expect(corner[1]).toBeCloseTo(expectedCorners[index][1]);
    }
    expect(canvasContext.drawings[1].corners).toEqual([[60, 80], [140, 80], [140, 120], [60, 120]]);
    expect(canvasContext.context.save).toHaveBeenCalledTimes(2);
    expect(canvasContext.context.restore).toHaveBeenCalledTimes(2);
  });

  it('exports an empty project without requesting images or drawing an opaque background', async () => {
    await expect(exportEmblemProjectPng(createDefaultEmblemProject())).resolves.toBe(pngBlob);
    expect(requestedUrls).toEqual([]);
    expect(canvasContext.context.drawImage).not.toHaveBeenCalled();
    expect(canvasContext.context.fillRect).not.toHaveBeenCalled();
  });

  it('rejects an asynchronous image failure with its URL and never starts PNG encoding', async () => {
    failedImageUrl = '/broken.png';
    const project = projectWithLayers({ body4: { visible: true, elements: [element('broken')] } });

    await expect(exportEmblemProjectPng(project)).rejects.toThrow('/broken.png');
    expect(canvasContext.context.drawImage).not.toHaveBeenCalled();
    expect(toBlob).not.toHaveBeenCalled();
  });

  it('rejects asynchronous toBlob(null) with the source URLs instead of returning an empty Blob', async () => {
    toBlob.mockImplementation((callback) => queueMicrotask(() => callback(null)));
    const project = projectWithLayers({ body4: { visible: true, elements: [element('valid')] } });

    const exporting = exportEmblemProjectPng(project);
    await expect(exporting).rejects.toThrow('encoding returned null');
    await expect(exporting).rejects.toThrow('/valid.png');
  });

  it('reports a canvas SecurityError with its original cause and visible source URLs', async () => {
    const securityError = new DOMException('The canvas has been tainted by cross-origin data.', 'SecurityError');
    toBlob.mockImplementation(() => { throw securityError; });
    const project = projectWithLayers({ body4: { visible: true, elements: [element('cors')] } });

    await expect(exportEmblemProjectPng(project)).rejects.toMatchObject({
      message: expect.stringContaining('/cors.png'),
      cause: securityError,
    });
  });

  it('preserves unknown encoding failures and drawing failures while restoring canvas state', async () => {
    const unknownEncodingFailure = { reason: 'unexpected encoder failure' };
    toBlob.mockImplementation(() => { throw unknownEncodingFailure; });
    await expect(exportEmblemProjectPng(createDefaultEmblemProject())).rejects.toBe(unknownEncodingFailure);

    const drawingFailure = new Error('unexpected drawImage failure');
    canvasContext.context.drawImage.mockImplementation(() => { throw drawingFailure; });
    const project = projectWithLayers({ body4: { visible: true, elements: [element('draw-failed')] } });
    await expect(exportEmblemProjectPng(project)).rejects.toBe(drawingFailure);
    expect(canvasContext.context.restore).toHaveBeenCalledOnce();
  });

  it('rejects unusable encoder output', async () => {
    pngBlob = new Blob([], { type: 'image/png' });
    await expect(exportEmblemProjectPng(createDefaultEmblemProject())).rejects.toThrow('size=0');
    pngBlob = new Blob(['jpeg payload'], { type: 'image/jpeg' });
    await expect(exportEmblemProjectPng(createDefaultEmblemProject())).rejects.toThrow('image/jpeg');
  });

  it('rejects an invalid project before requesting any image or canvas encoding', async () => {
    const invalidProject = { ...createDefaultEmblemProject(), schemaVersion: 7 };
    await expect(exportEmblemProjectPng(invalidProject as unknown as EmblemProject)).rejects.toThrow('7');
    expect(requestedUrls).toEqual([]);
    expect(toBlob).not.toHaveBeenCalled();
  });

  it('rejects unavailable 2D context before loading images', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    await expect(exportEmblemProjectPng(createDefaultEmblemProject())).rejects.toThrow('2D canvas context is unavailable');
    expect(requestedUrls).toEqual([]);
  });
});
