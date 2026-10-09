import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  addMapMakerElement,
  buildMapMakerPng,
  createDefaultMapMakerProject,
  getMapMakerAssets,
  preloadMapMakerImage,
  preloadMapMakerProject,
  replaceMapMakerBaseTiles,
  updateMapMakerSettings,
} from './index';
import type { MapMakerElement, MapMakerImageSource } from './types';

type FakeMapMakerBrowser = {
  canvas: {
    width: number;
    height: number;
    getContext: ReturnType<typeof vi.fn>;
    toBlob: ReturnType<typeof vi.fn>;
  };
  context: {
    drawImage: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    restore: ReturnType<typeof vi.fn>;
    translate: ReturnType<typeof vi.fn>;
    rotate: ReturnType<typeof vi.fn>;
    scale: ReturnType<typeof vi.fn>;
  };
  loadedImageUrls: string[];
};

function installFakeMapMakerBrowser(failedImageUrl?: string): FakeMapMakerBrowser {
  const loadedImageUrls: string[] = [];
  const context = {
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => context),
    toBlob: vi.fn((callback: BlobCallback, mimeType?: string) => callback(new Blob(['map'], { type: mimeType }))),
  };

  class FakeImage {
    naturalWidth = 80;
    naturalHeight = 80;
    onload: ((event: Event) => void) | null = null;
    onerror: ((event: Event | string) => void) | null = null;
    crossOrigin: string | null = null;
    private imageUrl = '';

    set src(receivedUrl: string) {
      this.imageUrl = receivedUrl;
      loadedImageUrls.push(receivedUrl);
      if (receivedUrl === failedImageUrl) {
        this.onerror?.('CORS denied');
        return;
      }
      this.onload?.(new Event('load'));
    }

    get src(): string {
      return this.imageUrl;
    }
  }

  vi.stubGlobal('Image', FakeImage);
  vi.stubGlobal('document', { createElement: () => canvas });
  return { canvas, context, loadedImageUrls };
}

function createMapMakerElement(source: MapMakerImageSource): MapMakerElement {
  return {
    id: 'mountain-one',
    source,
    layer: 2,
    x: 10,
    y: 20,
    width: 30,
    height: 40,
    rotation: 90,
    flipHorizontal: true,
    flipVertical: false,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Map Maker image loading and PNG export', () => {
  it('preloads HTTPS custom image URLs with anonymous CORS mode', async () => {
    const browser = installFakeMapMakerBrowser();
    const image = await preloadMapMakerImage('https://images.example.test/mountain.png');

    expect(image.crossOrigin).toBe('anonymous');
    expect(browser.loadedImageUrls).toEqual(['https://images.example.test/mountain.png']);
  });

  it('loads project images before drawing transformed base tiles and visible elements', async () => {
    const browser = installFakeMapMakerBrowser();
    const geographyAsset = getMapMakerAssets().find((asset) => asset.category === 'geography');
    if (geographyAsset === undefined) throw new Error('Map Maker PNG test requires a geography asset.');
    const project = addMapMakerElement(createDefaultMapMakerProject(), createMapMakerElement({ kind: 'asset', assetId: geographyAsset.id }));

    const pngBlob = await buildMapMakerPng(project);

    expect(pngBlob.type).toBe('image/png');
    expect(browser.canvas.width).toBe(840);
    expect(browser.canvas.height).toBe(420);
    expect(browser.loadedImageUrls).toHaveLength(2);
    expect(browser.context.drawImage).toHaveBeenCalledTimes(73);
    expect(browser.context.save).toHaveBeenCalledTimes(1);
    expect(browser.context.translate).toHaveBeenCalledWith(25, 40);
    expect(browser.context.rotate).toHaveBeenCalledWith(Math.PI / 2);
    expect(browser.context.scale).toHaveBeenCalledWith(-1, 1);
    expect(browser.context.drawImage).toHaveBeenLastCalledWith(
      expect.objectContaining({ src: browser.loadedImageUrls[1] }),
      -15,
      -20,
      30,
      40,
    );
    expect(browser.context.restore).toHaveBeenCalledTimes(1);
  });

  it('merges tile and element natural-size checks when real catalog assets share one image URL', async () => {
    const waterFillProject = addMapMakerElement(
      createDefaultMapMakerProject(),
      createMapMakerElement({ kind: 'asset', assetId: 'water-fill' }),
    );
    const waterBrowser = installFakeMapMakerBrowser();
    await preloadMapMakerProject(waterFillProject);
    expect(waterBrowser.loadedImageUrls).toEqual(['/map-maker/assets/s0.png']);
    const waterPng = await buildMapMakerPng(waterFillProject);
    expect(waterPng.type).toBe('image/png');
    expect(waterBrowser.loadedImageUrls).toEqual([
      '/map-maker/assets/s0.png',
      '/map-maker/assets/s0.png',
    ]);

    const landProject = replaceMapMakerBaseTiles(
      createDefaultMapMakerProject(),
      [{ column: 0, row: 0 }],
      { kind: 'asset', assetId: 'l0' },
    );
    const landProjectWithElement = addMapMakerElement(
      landProject,
      createMapMakerElement({ kind: 'asset', assetId: 'geography-land' }),
    );
    const landBrowser = installFakeMapMakerBrowser();
    await preloadMapMakerProject(landProjectWithElement);
    expect(landBrowser.loadedImageUrls).toEqual([
      '/map-maker/assets/l0.png',
      '/map-maker/assets/s0.png',
    ]);
    const landPng = await buildMapMakerPng(landProjectWithElement);
    expect(landPng.type).toBe('image/png');
    expect(landBrowser.loadedImageUrls).toEqual([
      '/map-maker/assets/l0.png',
      '/map-maker/assets/s0.png',
      '/map-maker/assets/l0.png',
      '/map-maker/assets/s0.png',
    ]);
  });

  it('omits hidden elements from PNG output and rejects image load failures', async () => {
    const hiddenElementSource = { kind: 'url', url: 'https://images.example.test/hidden.png' } as const;
    const hiddenProject = updateMapMakerSettings(
      addMapMakerElement(createDefaultMapMakerProject(), createMapMakerElement(hiddenElementSource)),
      { elementsVisible: false },
    );
    const browser = installFakeMapMakerBrowser();
    await buildMapMakerPng(hiddenProject);
    expect(browser.context.drawImage).toHaveBeenCalledTimes(72);
    expect(browser.loadedImageUrls).not.toContain(hiddenElementSource.url);

    installFakeMapMakerBrowser('https://images.example.test/broken.png');
    const failedProject = {
      ...createDefaultMapMakerProject(),
      baseTiles: createDefaultMapMakerProject().baseTiles.map((tile, index) => index === 0
        ? { ...tile, source: { kind: 'url' as const, url: 'https://images.example.test/broken.png' } }
        : tile),
    };
    await expect(buildMapMakerPng(failedProject)).rejects.toThrow(/could not be loaded: CORS denied/);
  });
});
