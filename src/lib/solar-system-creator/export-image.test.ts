// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSolarAsset } from './catalog';
import { buildRandomSolarSystemPng, buildSolarSystemPng } from './export-image';
import type { RandomSolarSystem, SolarSaveSnapshot } from './types';

vi.mock('./catalog', () => ({
  getSolarAsset: vi.fn((assetId: string) => ({
    id: assetId,
    category: assetId.startsWith('star-') ? 'star' : 'type-1',
    index: 1,
    src: `/${assetId}.png`,
  })),
}));

type RecordedDraw = {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type CanvasHarness = {
  fillRect: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  strokeRect: ReturnType<typeof vi.fn>;
  canvases: HTMLCanvasElement[];
  drawings: RecordedDraw[];
};

class ImmediateImage {
  naturalWidth = 100;
  naturalHeight = 100;
  onload: (() => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  private imageSource = '';

  get src(): string {
    return this.imageSource;
  }

  set src(imageSource: string) {
    this.imageSource = imageSource;
    queueMicrotask(() => {
      if (imageSource.includes('broken')) {
        this.onerror?.(new Event('error'));
        return;
      }

      this.onload?.();
    });
  }
}

function createSnapshot(starAssetId: string | null = 'star-1'): SolarSaveSnapshot {
  return {
    starAssetId,
    planets: [
      {
        id: 'planet-1',
        assetId: 'type-1-7',
        x: 212,
        y: 84,
        width: 52,
        height: 52,
        description: 'This description belongs in print media, not the image.',
      },
      {
        id: 'planet-2',
        assetId: 'type-2-3',
        x: 420,
        y: 276,
        width: 40,
        height: 40,
        description: 'Second description must stay outside the PNG.',
      },
    ],
  };
}

function createRandomSystem(starAssetId = 'star-7'): RandomSolarSystem {
  const planetFields = {
    environment: 'Gentle',
    atmosphere: 'Thin',
    surfaceMap: 'Yes',
    dayHours: '24',
    gravity: '1g',
    orbitYears: '1',
    moons: '1',
    axialTilt: '0°',
  };

  return {
    starAssetId,
    planets: [
      {
        id: 'planet-1',
        assetId: 'type-3-9',
        x: 212,
        y: 84,
        width: 52,
        height: 52,
        fields: { ...planetFields },
      },
      {
        id: 'planet-2',
        assetId: 'type-5-22',
        x: 420,
        y: 276,
        width: 40,
        height: 40,
        fields: { ...planetFields, environment: 'Hostile' },
      },
    ],
    selectedPlanetId: 'planet-2',
  };
}

function installCanvasHarness(): CanvasHarness {
  const fillRect = vi.fn();
  const drawings: RecordedDraw[] = [];
  const fillText = vi.fn();
  const strokeRect = vi.fn();
  const drawImage = vi.fn((image: ImmediateImage, x: number, y: number, width: number, height: number) => {
    drawings.push({ source: image.src, x, y, width, height });
  });
  const canvases: HTMLCanvasElement[] = [];

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (this: HTMLCanvasElement) {
    canvases.push(this);
    return {
      canvas: this,
      fillStyle: '',
      fillRect,
      fillText,
      drawImage,
      strokeRect,
    } as unknown as CanvasRenderingContext2D;
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
    callback(new Blob(['encoded PNG'], { type: 'image/png' }));
  });
  vi.stubGlobal('Image', ImmediateImage);

  return { fillRect, drawImage, fillText, strokeRect, canvases, drawings };
}

describe('buildSolarSystemPng', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSolarAsset).mockImplementation((assetId: string) => ({
      id: assetId,
      category: assetId.startsWith('star-') ? 'star' : 'type-1',
      index: 1,
      src: `/${assetId}.png`,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the black 800 × 400 canvas with star and planet geometry as a PNG', async () => {
    const harness = installCanvasHarness();

    const png = await buildSolarSystemPng(createSnapshot());

    expect(png.type).toBe('image/png');
    expect(png.size).toBeGreaterThan(0);
    expect(harness.canvases).toHaveLength(1);
    expect(harness.canvases[0]).toMatchObject({ width: 800, height: 400 });
    expect(harness.fillRect).toHaveBeenCalledWith(0, 0, 800, 400);
    expect(harness.drawings).toEqual([
      { source: '/star-1.png', x: 0, y: 0, width: 175, height: 400 },
      { source: '/type-1-7.png', x: 212, y: 84, width: 52, height: 52 },
      { source: '/type-2-3.png', x: 420, y: 276, width: 40, height: 40 },
    ]);
    expect(harness.drawings.map((drawing) => drawing.source).join('|')).not.toContain('description');
  });

  it('allows a snapshot without a star and still renders its black canvas and planets', async () => {
    const harness = installCanvasHarness();

    await buildSolarSystemPng(createSnapshot(null));

    expect(harness.drawings).toEqual([
      { source: '/type-1-7.png', x: 212, y: 84, width: 52, height: 52 },
      { source: '/type-2-3.png', x: 420, y: 276, width: 40, height: 40 },
    ]);
    expect(vi.mocked(getSolarAsset)).not.toHaveBeenCalledWith('');
  });

  it('renders the random system star and planet geometry without fields or a selection frame', async () => {
    const harness = installCanvasHarness();

    const png = await buildRandomSolarSystemPng(createRandomSystem());

    expect(png.type).toBe('image/png');
    expect(harness.canvases[0]).toMatchObject({ width: 800, height: 400 });
    expect(harness.drawings).toEqual([
      { source: '/star-7.png', x: 0, y: 0, width: 175, height: 400 },
      { source: '/type-3-9.png', x: 212, y: 84, width: 52, height: 52 },
      { source: '/type-5-22.png', x: 420, y: 276, width: 40, height: 40 },
    ]);
    expect(harness.fillText).not.toHaveBeenCalled();
    expect(harness.strokeRect).not.toHaveBeenCalled();
    expect(harness.drawings.map((drawing) => drawing.source).join('|')).not.toContain('Gentle');
  });

  it('uses the current random star asset when the random system changes', async () => {
    const harness = installCanvasHarness();

    await buildRandomSolarSystemPng(createRandomSystem('star-12'));
    expect(harness.drawings[0]).toEqual({
      source: '/star-12.png',
      x: 0,
      y: 0,
      width: 175,
      height: 400,
    });

    harness.drawings.length = 0;
    await buildRandomSolarSystemPng(createRandomSystem('star-39'));
    expect(harness.drawings[0]).toEqual({
      source: '/star-39.png',
      x: 0,
      y: 0,
      width: 175,
      height: 400,
    });
  });

  it('rejects an invalid random system before creating browser canvas output', async () => {
    const harness = installCanvasHarness();
    const invalidSystem = {
      ...createRandomSystem('type-1-1'),
    } as unknown as RandomSolarSystem;

    await expect(buildRandomSolarSystemPng(invalidSystem)).rejects.toThrow('"type-1-1"');
    expect(harness.canvases).toHaveLength(0);
  });

  it('rejects a failed local image load with the source path', async () => {
    installCanvasHarness();
    vi.mocked(getSolarAsset).mockImplementation((assetId: string) => ({
      id: assetId,
      category: 'type-1',
      index: 1,
      src: '/broken.png',
    }));

    await expect(buildSolarSystemPng(createSnapshot())).rejects.toThrow('/broken.png');
  });

  it('rejects null PNG encoding output and does not return an empty Blob', async () => {
    installCanvasHarness();
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(null);
    });

    await expect(buildSolarSystemPng(createSnapshot())).rejects.toThrow('returned null');
  });

  it('rejects a non-PNG encoder result with its MIME type', async () => {
    installCanvasHarness();
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(new Blob(['jpeg'], { type: 'image/jpeg' }));
    });

    await expect(buildSolarSystemPng(createSnapshot())).rejects.toThrow('image/jpeg');
  });

  it('validates snapshot boundaries before browser work', async () => {
    const harness = installCanvasHarness();
    const invalidSnapshot = {
      ...createSnapshot(),
      planets: [{ ...createSnapshot().planets[0], width: 0, height: 0 }],
    } as unknown as SolarSaveSnapshot;

    await expect(buildSolarSystemPng(invalidSnapshot)).rejects.toThrow('greater than 0');
    expect(harness.canvases).toHaveLength(0);
  });
});
