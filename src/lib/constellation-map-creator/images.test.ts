import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  addConstellation,
  addConstellationStar,
  buildConstellationPng,
  createDefaultConstellationProject,
  loadConstellationImage,
  preloadConstellationProject,
  setConstellationBackgroundImage,
  setConstellationTransparentBase,
  transformConstellationObject,
} from './index';
import type { ConstellationObject } from './types';

type DrawCall = [unknown, number, number, number, number];
type BlobEncodingMode = 'valid' | 'null' | 'wrong-type' | 'empty' | 'security-error';
type FakeImageMode = 'load' | 'broken' | 'hanging' | 'zero-dimensions' | 'changed-background-dimensions';
type AffineMatrix = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};
type RecordedDraw = {
  image: unknown;
  x: number;
  y: number;
  width: number;
  height: number;
  matrix: AffineMatrix;
};
type CanvasPoint = {
  x: number;
  y: number;
};

function identityMatrix(): AffineMatrix {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

function cloneMatrix(matrix: AffineMatrix): AffineMatrix {
  return { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f };
}

function multiplyMatrix(current: AffineMatrix, next: AffineMatrix): AffineMatrix {
  return {
    a: current.a * next.a + current.c * next.b,
    b: current.b * next.a + current.d * next.b,
    c: current.a * next.c + current.c * next.d,
    d: current.b * next.c + current.d * next.d,
    e: current.a * next.e + current.c * next.f + current.e,
    f: current.b * next.e + current.d * next.f + current.f,
  };
}

function translationMatrix(x: number, y: number): AffineMatrix {
  return { a: 1, b: 0, c: 0, d: 1, e: x, f: y };
}

function clockwiseRotationMatrix(radians: number): AffineMatrix {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return { a: cosine, b: sine, c: -sine, d: cosine, e: 0, f: 0 };
}

class FakeImage {
  static loadedImages = new Set<FakeImage>();
  static lastCreated: FakeImage | undefined;
  static mode: FakeImageMode = 'load';
  onload: (() => void) | null = null;
  onerror: ((event: Event | string) => void) | null = null;
  crossOrigin: string | null = null;
  naturalWidth = 98;
  naturalHeight = 93;
  private imageSource = '';

  constructor() {
    FakeImage.lastCreated = this;
  }

  get src(): string {
    return this.imageSource;
  }

  set src(imageSource: string) {
    this.imageSource = imageSource;
    FakeImage.loadedImages.add(this);
    queueMicrotask(() => {
      if (FakeImage.mode === 'hanging') {
        return;
      }
      if (FakeImage.mode === 'broken' || imageSource.includes('broken')) {
        this.onerror?.('network failure');
        return;
      }
      if (FakeImage.mode === 'zero-dimensions') {
        this.naturalWidth = 0;
        this.naturalHeight = 0;
      } else if (
        FakeImage.mode === 'changed-background-dimensions' &&
        imageSource.includes('background')
      ) {
        this.naturalWidth = 640;
        this.naturalHeight = 480;
      } else if (imageSource.includes('background')) {
        this.naturalWidth = 1200;
        this.naturalHeight = 800;
      } else if (imageSource.includes('star.svg')) {
        this.naturalWidth = 20;
        this.naturalHeight = 20;
      }
      this.onload?.();
    });
  }
}

function installCanvasHarness(options: {
  contextAvailable?: boolean;
  blobEncodingMode?: BlobEncodingMode;
} = {}) {
  const previousImage = globalThis.Image;
  const previousDocument = (globalThis as typeof globalThis & { document?: unknown }).document;
  const drawCalls: DrawCall[] = [];
  const draws: RecordedDraw[] = [];
  const fillCalls: unknown[][] = [];
  const fillMatrices: AffineMatrix[] = [];
  const decorationCalls: string[] = [];
  const matrixStack: AffineMatrix[] = [];
  let canvasMatrix = identityMatrix();
  const context = options.contextAvailable === false
    ? null
    : {
        fillStyle: '',
        fillRect: (...args: unknown[]) => {
          fillCalls.push(args);
          fillMatrices.push(cloneMatrix(canvasMatrix));
        },
        save: () => {
          matrixStack.push(cloneMatrix(canvasMatrix));
        },
        restore: () => {
          const previousMatrix = matrixStack.pop();
          if (previousMatrix === undefined) {
            throw new Error('Constellation canvas mock restore was called without a matching save.');
          }
          canvasMatrix = previousMatrix;
        },
        translate: (x: number, y: number) => {
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            throw new Error(
              `Constellation canvas mock translate received non-finite values. Received x=${String(x)}, y=${String(y)}.`,
            );
          }
          canvasMatrix = multiplyMatrix(canvasMatrix, translationMatrix(x, y));
        },
        rotate: (radians: number) => {
          if (!Number.isFinite(radians)) {
            throw new Error(
              `Constellation canvas mock rotate received a non-finite angle. Received ${String(radians)}.`,
            );
          }
          canvasMatrix = multiplyMatrix(canvasMatrix, clockwiseRotationMatrix(radians));
        },
        stroke: () => {
          decorationCalls.push('stroke');
        },
        strokeRect: () => {
          decorationCalls.push('strokeRect');
        },
        drawImage: (...args: unknown[]) => {
          if (args.length !== 5) {
            throw new Error(
              `Constellation canvas mock expected drawImage(image, x, y, width, height). Received ${String(args.length)} arguments.`,
            );
          }
          const [image, x, y, width, height] = args;
          if (
            typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof width !== 'number' ||
            typeof height !== 'number' ||
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(width) ||
            !Number.isFinite(height)
          ) {
            throw new Error(
              `Constellation canvas mock drawImage destination must be finite numbers. Received ${JSON.stringify([x, y, width, height])}.`,
            );
          }
          draws.push({
            image,
            x,
            y,
            width,
            height,
            matrix: cloneMatrix(canvasMatrix),
          });
          drawCalls.push([image, x, y, width, height]);
        },
      };
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob: vi.fn((callback: BlobCallback) => {
      const blobEncodingMode = options.blobEncodingMode ?? 'valid';
      if (blobEncodingMode === 'security-error') {
        throw new DOMException('Canvas is tainted by a cross-origin image.', 'SecurityError');
      }
      if (blobEncodingMode === 'null') {
        callback(null);
        return;
      }
      if (blobEncodingMode === 'wrong-type') {
        callback(new Blob(['jpeg'], { type: 'image/jpeg' }));
        return;
      }
      if (blobEncodingMode === 'empty') {
        callback(new Blob([], { type: 'image/png' }));
        return;
      }
      callback(new Blob(['png'], { type: 'image/png' }));
    }),
  } as unknown as HTMLCanvasElement;

  Object.defineProperty(globalThis, 'Image', { configurable: true, writable: true, value: FakeImage });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value: { createElement: vi.fn(() => canvas) },
  });

  return {
    canvas,
    drawCalls,
    draws,
    fillCalls,
    fillMatrices,
    decorationCalls,
    currentMatrix: () => cloneMatrix(canvasMatrix),
    transformStackDepth: () => matrixStack.length,
    restore() {
      Object.defineProperty(globalThis, 'Image', {
        configurable: true,
        writable: true,
        value: previousImage,
      });
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: previousDocument,
      });
    },
  };
}

function requireRecordedDraw(draws: readonly RecordedDraw[], index: number): RecordedDraw {
  const draw = draws[index];
  if (draw === undefined) {
    throw new Error(
      `Recorded canvas draw ${String(index)} is missing. Received ${String(draws.length)} draws.`,
    );
  }
  return draw;
}

function mappedDrawCorners(draw: RecordedDraw): CanvasPoint[] {
  const localCorners = [
    [draw.x, draw.y],
    [draw.x + draw.width, draw.y],
    [draw.x + draw.width, draw.y + draw.height],
    [draw.x, draw.y + draw.height],
  ] as const;
  return localCorners.map(([localX, localY]) => ({
    x: draw.matrix.a * localX + draw.matrix.c * localY + draw.matrix.e,
    y: draw.matrix.b * localX + draw.matrix.d * localY + draw.matrix.f,
  }));
}

function centerRotatedCorners(placement: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}): CanvasPoint[] {
  const rotationDegrees = placement.rotation ?? 0;
  if (!Number.isFinite(rotationDegrees)) {
    throw new Error(
      `Expected constellation rotation must be a finite number of degrees. Received ${String(rotationDegrees)}.`,
    );
  }
  const centerX = placement.x + placement.width / 2;
  const centerY = placement.y + placement.height / 2;
  const radians = (rotationDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const localOffsets = [
    [-placement.width / 2, -placement.height / 2],
    [placement.width / 2, -placement.height / 2],
    [placement.width / 2, placement.height / 2],
    [-placement.width / 2, placement.height / 2],
  ] as const;
  return localOffsets.map(([offsetX, offsetY]) => ({
    x: centerX + offsetX * cosine - offsetY * sine,
    y: centerY + offsetX * sine + offsetY * cosine,
  }));
}

function expectCanvasPoints(
  actualPoints: readonly CanvasPoint[],
  expectedPoints: readonly CanvasPoint[],
): void {
  expect(actualPoints).toHaveLength(expectedPoints.length);
  for (const [index, expectedPoint] of expectedPoints.entries()) {
    const actualPoint = actualPoints[index];
    if (actualPoint === undefined) {
      throw new Error(`Canvas point ${String(index)} is missing.`);
    }
    expect(actualPoint.x).toBeCloseTo(expectedPoint.x, 8);
    expect(actualPoint.y).toBeCloseTo(expectedPoint.y, 8);
  }
}

function expectIdentityMatrix(matrix: AffineMatrix): void {
  expect(matrix.a).toBeCloseTo(1, 8);
  expect(matrix.b).toBeCloseTo(0, 8);
  expect(matrix.c).toBeCloseTo(0, 8);
  expect(matrix.d).toBeCloseTo(1, 8);
  expect(matrix.e).toBeCloseTo(0, 8);
  expect(matrix.f).toBeCloseTo(0, 8);
}

function recordedImageSrc(image: unknown): string {
  if (
    typeof image === 'object' &&
    image !== null &&
    'src' in image &&
    typeof image.src === 'string'
  ) {
    return image.src;
  }
  throw new Error(
    `Recorded canvas image src must be a string. Received ${Object.prototype.toString.call(image)}.`,
  );
}

function recordedImageNaturalSize(image: unknown): { width: number; height: number } {
  if (
    typeof image !== 'object' ||
    image === null ||
    !('naturalWidth' in image) ||
    !('naturalHeight' in image) ||
    typeof image.naturalWidth !== 'number' ||
    typeof image.naturalHeight !== 'number'
  ) {
    throw new Error(
      `Recorded canvas image is missing natural dimensions. Received ${Object.prototype.toString.call(image)}.`,
    );
  }
  return { width: image.naturalWidth, height: image.naturalHeight };
}

function constellationObjectWithoutRotation(object: ConstellationObject): ConstellationObject {
  return {
    id: object.id,
    kind: object.kind,
    assetId: object.assetId,
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
  };
}

afterEach(() => {
  FakeImage.mode = 'load';
  FakeImage.lastCreated = undefined;
  vi.useRealTimers();
});

describe('constellation image loading and PNG export', () => {
  it('waits for the image load event and sets anonymous CORS mode', async () => {
    const previousImage = globalThis.Image;
    Object.defineProperty(globalThis, 'Image', { configurable: true, writable: true, value: FakeImage });
    try {
      const image = await loadConstellationImage('/constellation-map-creator/assets/image/image-01.svg');
      expect(image.crossOrigin).toBe('anonymous');
      expect(image.naturalWidth).toBe(98);
    } finally {
      Object.defineProperty(globalThis, 'Image', {
        configurable: true,
        writable: true,
        value: previousImage,
      });
    }
  });

  it('waits for all project images and exports at actual size without a selection border', async () => {
    const harness = installCanvasHarness();
    try {
      let project = createDefaultConstellationProject();
      project = addConstellation(project, 'image-1', 'constellation-1');
      project = addConstellationStar(project, 'star-1');
      project = setConstellationBackgroundImage(project, '/background.png', 1200, 800);

      const pngBlob = await buildConstellationPng(project);

      expect(pngBlob.type).toBe('image/png');
      expect(pngBlob.size).toBeGreaterThan(0);
      expect(harness.canvas.width).toBe(900);
      expect(harness.canvas.height).toBe(600);
      expect(harness.drawCalls).toHaveLength(3);
      expect(harness.drawCalls[0]?.slice(1)).toEqual([0, 0, 1200, 800]);
      expect(harness.drawCalls[1]?.slice(1)).toEqual([0, 0, 98, 93]);
      expect(harness.drawCalls[2]?.slice(1)).toEqual([0, 0, 20, 20]);
      expect(harness.draws).toHaveLength(3);
      for (const draw of harness.draws) {
        expectIdentityMatrix(draw.matrix);
      }
      expect(harness.decorationCalls).toEqual([]);
      expect(harness.transformStackDepth()).toBe(0);
      expectIdentityMatrix(harness.currentMatrix());
    } finally {
      harness.restore();
    }
  });

  it('reports failed image loads with the concrete URL', async () => {
    const previousImage = globalThis.Image;
    Object.defineProperty(globalThis, 'Image', { configurable: true, writable: true, value: FakeImage });
    try {
      await expect(loadConstellationImage('/broken.svg')).rejects.toThrow('/broken.svg');
    } finally {
      Object.defineProperty(globalThis, 'Image', {
        configurable: true,
        writable: true,
        value: previousImage,
      });
    }
  });

  it('times out a hanging image and cleans up both event handlers', async () => {
    const harness = installCanvasHarness();
    vi.useFakeTimers();
    FakeImage.mode = 'hanging';
    try {
      const imagePromise = loadConstellationImage('/hanging.svg');
      const rejectionExpectation = expect(imagePromise).rejects.toThrow('hanging.svg');

      await vi.advanceTimersByTimeAsync(15_000);

      await rejectionExpectation;
      expect(FakeImage.lastCreated?.onload).toBeNull();
      expect(FakeImage.lastCreated?.onerror).toBeNull();
    } finally {
      harness.restore();
    }
  });

  it('rejects images that report zero natural dimensions', async () => {
    const harness = installCanvasHarness();
    FakeImage.mode = 'zero-dimensions';
    try {
      await expect(loadConstellationImage('/zero.svg')).rejects.toThrow(
        'invalid natural dimensions 0 × 0',
      );
    } finally {
      harness.restore();
    }
  });

  it('fails fast when the canvas has no 2D context', async () => {
    const harness = installCanvasHarness({ contextAvailable: false });
    try {
      await expect(buildConstellationPng(createDefaultConstellationProject())).rejects.toThrow(
        '2D canvas context',
      );
    } finally {
      harness.restore();
    }
  });

  it.each([
    ['null', 'returned null'],
    ['wrong-type', 'wrong MIME type'],
    ['empty', 'empty Blob'],
  ] as const)('rejects a %s PNG encoder result', async (blobEncodingMode, expectedMessage) => {
    const harness = installCanvasHarness({ blobEncodingMode });
    try {
      await expect(buildConstellationPng(createDefaultConstellationProject())).rejects.toThrow(
        expectedMessage,
      );
    } finally {
      harness.restore();
    }
  });

  it('reports a SecurityError with the background URL context', async () => {
    const harness = installCanvasHarness({ blobEncodingMode: 'security-error' });
    try {
      let project = createDefaultConstellationProject();
      project = setConstellationBackgroundImage(project, '/background.png', 1200, 800);
      await expect(buildConstellationPng(project)).rejects.toThrow(
        'encoding failed for background image "/background.png". Received SecurityError: Canvas is tainted by a cross-origin image.',
      );
    } finally {
      harness.restore();
    }
  });

  it('does not fill a transparent base but still draws the background image', async () => {
    const harness = installCanvasHarness();
    try {
      let project = createDefaultConstellationProject();
      project = setConstellationTransparentBase(project, true);
      project = setConstellationBackgroundImage(project, '/background.png', 1200, 800);
      await buildConstellationPng(project);

      expect(harness.fillCalls).toHaveLength(0);
      expect(harness.drawCalls).toHaveLength(1);
      expect(harness.drawCalls[0]?.slice(1)).toEqual([0, 0, 1200, 800]);
      expectIdentityMatrix(requireRecordedDraw(harness.draws, 0).matrix);
    } finally {
      harness.restore();
    }
  });

  it('rejects preloading and exporting when the saved background natural size changed', async () => {
    FakeImage.mode = 'changed-background-dimensions';
    let project = createDefaultConstellationProject();
    project = setConstellationBackgroundImage(project, '/background.png', 1200, 800);
    const harness = installCanvasHarness();
    try {
      await expect(preloadConstellationProject(project)).rejects.toThrow(
        'Expected 1200 × 800, received 640 × 480',
      );
      await expect(buildConstellationPng(project)).rejects.toThrow(
        'Expected 1200 × 800, received 640 × 480',
      );
    } finally {
      harness.restore();
    }
  });

  it('rotates each object around its center and restores before the next draw', async () => {
    const clockwiseQuarterTurnCorners = [
      { x: 15, y: -5 },
      { x: 15, y: 15 },
      { x: 5, y: 15 },
      { x: 5, y: -5 },
    ];
    const angledPlacement = { x: 30.5, y: 12.25, width: 80, height: 50, rotation: 33.5 };
    const harness = installCanvasHarness();
    try {
      let project = createDefaultConstellationProject();
      project = setConstellationBackgroundImage(project, '/background.png', 1200, 800);
      project = addConstellationStar(project, 'star-1');
      project = addConstellation(project, 'image-1', 'constellation-1');
      project = addConstellation(project, 'image-2', 'constellation-2');
      project = transformConstellationObject(project, 'star-1', {
        x: 0,
        y: 0,
        width: 20,
        height: 10,
        rotation: 90,
      });
      project = transformConstellationObject(project, 'constellation-1', angledPlacement);
      project = transformConstellationObject(project, 'constellation-2', {
        x: 140,
        y: 70,
        width: 98,
        height: 93,
        rotation: 0,
      });

      const pngBlob = await buildConstellationPng(project);

      expect(pngBlob.type).toBe('image/png');
      expect(pngBlob.size).toBeGreaterThan(0);
      expect(harness.canvas.width).toBe(900);
      expect(harness.canvas.height).toBe(600);
      expect(harness.fillCalls).toEqual([[0, 0, 900, 600]]);
      const backgroundFillMatrix = harness.fillMatrices[0];
      if (backgroundFillMatrix === undefined) {
        throw new Error('Constellation background fill matrix is missing.');
      }
      expectIdentityMatrix(backgroundFillMatrix);
      expect(harness.decorationCalls).toEqual([]);
      expect(harness.draws).toHaveLength(4);

      const backgroundDraw = requireRecordedDraw(harness.draws, 0);
      const quarterTurnDraw = requireRecordedDraw(harness.draws, 1);
      const angledDraw = requireRecordedDraw(harness.draws, 2);
      const uprightDraw = requireRecordedDraw(harness.draws, 3);

      expect(recordedImageSrc(backgroundDraw.image)).toBe('/background.png');
      expect(recordedImageNaturalSize(backgroundDraw.image)).toEqual({ width: 1200, height: 800 });
      expect([backgroundDraw.x, backgroundDraw.y, backgroundDraw.width, backgroundDraw.height]).toEqual([
        0, 0, 1200, 800,
      ]);
      expectIdentityMatrix(backgroundDraw.matrix);
      expectCanvasPoints(mappedDrawCorners(backgroundDraw), [
        { x: 0, y: 0 },
        { x: 1200, y: 0 },
        { x: 1200, y: 800 },
        { x: 0, y: 800 },
      ]);

      expect(recordedImageSrc(quarterTurnDraw.image)).toContain('star.svg');
      expect(recordedImageNaturalSize(quarterTurnDraw.image)).toEqual({ width: 20, height: 20 });
      expect(quarterTurnDraw.width).toBe(20);
      expect(quarterTurnDraw.height).toBe(10);
      expectCanvasPoints(centerRotatedCorners({ x: 0, y: 0, width: 20, height: 10, rotation: 90 }), clockwiseQuarterTurnCorners);
      expectCanvasPoints(mappedDrawCorners(quarterTurnDraw), clockwiseQuarterTurnCorners);

      expect(recordedImageSrc(angledDraw.image)).toContain('image-01.svg');
      expect(recordedImageNaturalSize(angledDraw.image)).toEqual({ width: 98, height: 93 });
      expect(angledDraw.width).toBe(80);
      expect(angledDraw.height).toBe(50);
      expectCanvasPoints(mappedDrawCorners(angledDraw), centerRotatedCorners(angledPlacement));

      expect(recordedImageSrc(uprightDraw.image)).toContain('image-02.svg');
      expect([uprightDraw.x, uprightDraw.y, uprightDraw.width, uprightDraw.height]).toEqual([140, 70, 98, 93]);
      expectIdentityMatrix(uprightDraw.matrix);
      expectCanvasPoints(mappedDrawCorners(uprightDraw), [
        { x: 140, y: 70 },
        { x: 238, y: 70 },
        { x: 238, y: 163 },
        { x: 140, y: 163 },
      ]);
      expect(harness.transformStackDepth()).toBe(0);
      expectIdentityMatrix(harness.currentMatrix());
    } finally {
      harness.restore();
    }
  });

  it('draws an object with no rotation field at its original upright rectangle', async () => {
    const harness = installCanvasHarness();
    try {
      let project = createDefaultConstellationProject();
      project = addConstellation(project, 'image-1', 'constellation-1');
      project = transformConstellationObject(project, 'constellation-1', {
        x: 40,
        y: 18,
        width: 98,
        height: 93,
        rotation: 90,
      });
      const rotatedObject = project.objects[0];
      if (rotatedObject === undefined) {
        throw new Error('Constellation rotation fixture is missing constellation-1.');
      }
      project = {
        ...project,
        objects: [constellationObjectWithoutRotation(rotatedObject)],
      };

      await buildConstellationPng(project);

      expect(harness.canvas.width).toBe(900);
      expect(harness.canvas.height).toBe(600);
      const objectDraw = requireRecordedDraw(harness.draws, 0);
      expect([objectDraw.x, objectDraw.y, objectDraw.width, objectDraw.height]).toEqual([40, 18, 98, 93]);
      expectIdentityMatrix(objectDraw.matrix);
      expectCanvasPoints(mappedDrawCorners(objectDraw), centerRotatedCorners({
        x: 40,
        y: 18,
        width: 98,
        height: 93,
        rotation: 0,
      }));
      expect(harness.transformStackDepth()).toBe(0);
    } finally {
      harness.restore();
    }
  });

  it('keeps a transparent base and an unrotated background image when an object is rotated', async () => {
    const harness = installCanvasHarness();
    try {
      let project = createDefaultConstellationProject();
      project = setConstellationTransparentBase(project, true);
      project = setConstellationBackgroundImage(project, '/background.png', 1200, 800);
      project = addConstellation(project, 'image-1', 'constellation-1');
      project = transformConstellationObject(project, 'constellation-1', {
        x: 40,
        y: 18,
        width: 98,
        height: 93,
        rotation: 90,
      });

      await buildConstellationPng(project);

      expect(harness.fillCalls).toHaveLength(0);
      expect(harness.decorationCalls).toEqual([]);
      expect(harness.canvas.width).toBe(900);
      expect(harness.canvas.height).toBe(600);
      const backgroundDraw = requireRecordedDraw(harness.draws, 0);
      const objectDraw = requireRecordedDraw(harness.draws, 1);
      expect([backgroundDraw.x, backgroundDraw.y, backgroundDraw.width, backgroundDraw.height]).toEqual([
        0, 0, 1200, 800,
      ]);
      expectIdentityMatrix(backgroundDraw.matrix);
      expect(recordedImageNaturalSize(backgroundDraw.image)).toEqual({ width: 1200, height: 800 });
      expect(objectDraw.width).toBe(98);
      expect(objectDraw.height).toBe(93);
      expectCanvasPoints(mappedDrawCorners(objectDraw), centerRotatedCorners({
        x: 40,
        y: 18,
        width: 98,
        height: 93,
        rotation: 90,
      }));
      expectIdentityMatrix(harness.currentMatrix());
    } finally {
      harness.restore();
    }
  });
});
