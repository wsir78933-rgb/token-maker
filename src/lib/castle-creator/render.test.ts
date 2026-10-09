import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  castleCanvasToPngBlob,
  renderCastleProject,
  resolveCastleCanvasSize,
} from '@/lib/castle-creator/render';
import type { CastleImageLoader } from '@/lib/castle-creator/render';
import type { CastleProject } from '@/lib/castle-creator/types';

vi.mock('@/lib/castle-creator/catalog', () => ({
  getCastleAsset: vi.fn((assetId: string) => ({
    id: assetId,
    category: 'walls',
    number: 1,
    width: 32,
    height: 32,
  })),
  castleAssetImagePath: vi.fn(
    (assetId: string, palette: { building: number; roof: number }) =>
      `/castle/${assetId}-building${palette.building}-roof${palette.roof}.svg`,
  ),
}));

type DrawCall = {
  image: unknown;
  x: number;
  y: number;
  width: number;
  height: number;
};

class RecordingCanvas {
  width = 0;
  height = 0;
  readonly drawCalls: DrawCall[] = [];
  readonly fillCalls: Array<[number, number, number, number]> = [];
  fillStyle = '';

  getContext(): CanvasRenderingContext2D {
    return {
      fillStyle: this.fillStyle,
      fillRect: (x: number, y: number, width: number, height: number) => {
        this.fillCalls.push([x, y, width, height]);
      },
      drawImage: (image: CanvasImageSource, x: number, y: number, width: number, height: number) => {
        this.drawCalls.push({ image, x, y, width, height });
      },
    } as unknown as CanvasRenderingContext2D;
  }

  toBlob(callback: (blob: Blob | null) => void, type?: string): void {
    callback(new Blob(['castle'], { type: type ?? 'image/png' }));
  }
}

const originalDocument = globalThis.document;

afterEach(() => {
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: originalDocument,
  });
});

function createProject(): CastleProject {
  return {
    version: 1,
    pieces: [],
    activeLayer: 'lower',
    visibleLayers: { lower: true, middle: true, upper: true },
    canvas: {
      width: 0,
      height: 635,
      backgroundColor: '#ffffff',
      backgroundImageUrl: null,
    },
    palette: { building: 1, roof: 1 },
    snapEnabled: false,
    resizeEnabled: true,
  };
}

function createRecordingCanvas(): RecordingCanvas {
  const canvas = new RecordingCanvas();
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement: (tagName: string) => {
        if (tagName !== 'canvas') {
          throw new Error(`Unexpected element ${tagName}.`);
        }

        return canvas;
      },
    },
  });
  return canvas;
}

function createImageLoader(): CastleImageLoader & { sourceUrls: string[] } {
  const sourceUrls: string[] = [];
  return {
    sourceUrls,
    loadImage: async (sourceUrl) => {
      sourceUrls.push(sourceUrl);
      return {
        sourceUrl,
        naturalWidth: 200,
        naturalHeight: 100,
      } as unknown as CanvasImageSource;
    },
  };
}

describe('castle rendering', () => {
  it('resolves automatic width and the 635px default height', () => {
    expect(
      resolveCastleCanvasSize(
        {
          width: 0,
          height: 0,
          backgroundColor: '#ffffff',
          backgroundImageUrl: null,
        },
        1200,
      ),
    ).toEqual({ width: 1200, height: 635 });
    expect(
      resolveCastleCanvasSize(
        {
          width: 800,
          height: 700,
          backgroundColor: '#ffffff',
          backgroundImageUrl: null,
        },
        1200,
      ),
    ).toEqual({ width: 800, height: 700 });
  });

  it('draws background, visible layers, and pieces in deterministic order with piece palettes', async () => {
    const canvas = createRecordingCanvas();
    const project = createProject();
    project.canvas.backgroundColor = '#f0f0f0';
    project.canvas.backgroundImageUrl = 'https://example.test/background.png';
    project.pieces = [
      {
        id: 'upper-piece',
        assetId: 'walls-3',
        layerId: 'upper',
        x: 30,
        y: 40,
        width: 70,
        height: 80,
        buildingColor: 4,
        roofColor: 5,
      },
      {
        id: 'lower-first',
        assetId: 'walls-1',
        layerId: 'lower',
        x: 10,
        y: 20,
        width: 50,
        height: 60,
        buildingColor: 2,
        roofColor: 3,
      },
      {
        id: 'middle-hidden',
        assetId: 'walls-2',
        layerId: 'middle',
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        buildingColor: 1,
        roofColor: 1,
      },
      {
        id: 'lower-second',
        assetId: 'walls-1',
        layerId: 'lower',
        x: 15,
        y: 25,
        width: 55,
        height: 65,
        buildingColor: 3,
        roofColor: 2,
      },
    ];
    project.visibleLayers.middle = false;
    const imageLoader = createImageLoader();

    await renderCastleProject(project, { width: 400, height: 300 }, imageLoader);

    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(300);
    expect(canvas.fillCalls).toEqual([[0, 0, 400, 300]]);
    expect(imageLoader.sourceUrls).toEqual([
      'https://example.test/background.png',
      '/castle/walls-1-building2-roof3.svg',
      '/castle/walls-1-building3-roof2.svg',
      '/castle/walls-3-building4-roof5.svg',
    ]);
    expect(canvas.drawCalls.map(({ image }) => (image as { sourceUrl: string }).sourceUrl)).toEqual(
      imageLoader.sourceUrls,
    );
    expect(canvas.drawCalls[0]).toMatchObject({ x: -100, y: 0, width: 600, height: 300 });
    expect(canvas.drawCalls.slice(1).map(({ x, y, width, height }) => [x, y, width, height])).toEqual([
      [10, 20, 50, 60],
      [15, 25, 55, 65],
      [30, 40, 70, 80],
    ]);
  });

  it('fails background loading with the URL instead of exporting blank content', async () => {
    createRecordingCanvas();
    const project = createProject();
    project.canvas.backgroundImageUrl = 'https://example.test/background.png';
    const imageLoader: CastleImageLoader = {
      loadImage: async () => {
        throw new Error('network rejected');
      },
    };

    await expect(renderCastleProject(project, { width: 100, height: 100 }, imageLoader)).rejects.toThrow(
      'https://example.test/background.png',
    );
  });

  it('exports only a valid PNG blob with native canvas dimensions', async () => {
    const canvas = new RecordingCanvas();
    canvas.width = 800;
    canvas.height = 635;

    const pngBlob = await castleCanvasToPngBlob(canvas as unknown as HTMLCanvasElement);

    expect(pngBlob.type).toBe('image/png');
    expect(() => castleCanvasToPngBlob({ width: 0, height: 635, toBlob: vi.fn() } as never)).toThrow(
      'PNG canvas width',
    );
  });

  it('rejects a null PNG callback as a possible tainted canvas', async () => {
    const taintedCanvas = {
      width: 100,
      height: 100,
      toBlob(callback: (blob: Blob | null) => void) {
        callback(null);
      },
    };

    await expect(castleCanvasToPngBlob(taintedCanvas as never)).rejects.toThrow('tainted');
  });
});
