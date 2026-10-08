// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

import { buildTownPng } from './export-image';
import type { TownDocument } from './types';

function createDocument(): TownDocument {
  return {
    version: 1,
    width: 320,
    height: 240,
    backgroundColor: '#f8f4ec',
    backgroundImageUrl: '',
    activeLayer: 'middle',
    layers: [
      {
        id: 'lower',
        visible: true,
        objects: [{
          id: 'lower-house',
          assetId: 'buildings-house-01-cottage',
          material: 'wood',
          x: 8,
          y: 16,
          width: 64,
          height: 64,
          rotationDegrees: 0,
        }],
      },
      {
        id: 'middle',
        visible: false,
        objects: [{
          id: 'hidden-house',
          assetId: 'buildings-house-02-hip-cottage',
          material: 'stone',
          x: 120,
          y: 40,
          width: 64,
          height: 64,
          rotationDegrees: 0,
        }],
      },
      {
        id: 'upper',
        visible: true,
        objects: [
          {
            id: 'upper-road',
            assetId: 'roads-road1',
            material: 'neutral',
            x: 32,
            y: 128,
            width: 192,
            height: 64,
            rotationDegrees: 37,
          },
          {
            id: 'upper-ground',
            assetId: 'terrain-grass1',
            material: 'neutral',
            x: 0,
            y: 0,
            width: 160,
            height: 128,
            rotationDegrees: 0,
          },
        ],
      },
    ],
  };
}

function installCanvasSurface() {
  const drawImage = vi.fn();
  const toBlob = vi.fn((callback: BlobCallback) => callback(new Blob(['encoded PNG'], { type: 'image/png' })));
  const canvas = { toBlob } as unknown as HTMLCanvasElement;
  const context = { drawImage } as unknown as CanvasRenderingContext2D;
  const canvasFactory = vi.fn((width: number, height: number) => {
    void width;
    void height;
    return { canvas, context };
  });
  return { canvasFactory, drawImage, toBlob };
}

function createExportOptions() {
  const sourceLoader = vi.fn(async (sourceUrl: string) => `data:image/png;base64,${btoa(sourceUrl)}`);
  const imageLoader = vi.fn(async () => ({ naturalWidth: 320, naturalHeight: 240 } as HTMLImageElement));
  const createObjectUrl = vi.fn((blob: Blob) => {
    void blob;
    return 'blob:town-svg';
  });
  const revokeObjectUrl = vi.fn();
  const surface = installCanvasSurface();
  return {
    sourceLoader,
    imageLoader,
    createObjectUrl,
    revokeObjectUrl,
    ...surface,
    options: {
      assetSourceLoader: sourceLoader,
      imageLoader,
      createObjectUrl,
      revokeObjectUrl,
      canvasFactory: surface.canvasFactory,
    },
  };
}

describe('buildTownPng', () => {
  it('loads only visible assets, keeps rotation/repeat markup from shared SVG rendering, and draws the project canvas size', async () => {
    const document = createDocument();
    const exportHarness = createExportOptions();
    let renderedSvg = '';
    exportHarness.createObjectUrl.mockImplementation((blob: Blob) => {
      void blob.text().then((value: string) => {
        renderedSvg = value;
      });
      return 'blob:town-svg';
    });

    const png = await buildTownPng(document, exportHarness.options);

    expect(png.type).toBe('image/png');
    expect(exportHarness.canvasFactory).toHaveBeenCalledWith(320, 240);
    expect(exportHarness.drawImage).toHaveBeenCalledWith(
      expect.objectContaining({ naturalWidth: 320, naturalHeight: 240 }),
      0,
      0,
      320,
      240,
    );
    expect(exportHarness.sourceLoader).toHaveBeenCalledTimes(3);
    expect(exportHarness.sourceLoader.mock.calls.flat().join('|')).not.toContain('buildings-house-02-hip-cottage');
    expect(exportHarness.revokeObjectUrl).toHaveBeenCalledWith('blob:town-svg');

    await vi.waitFor(() => {
      expect(renderedSvg).toContain('transform="rotate(37 128 160)"');
      expect(renderedSvg).toContain('<pattern');
    });
  });

  it('inlines and preserves a remote background, then rejects the complete export if the background fetch fails', async () => {
    const document = createDocument();
    document.backgroundImageUrl = 'https://example.test/background.png';
    const exportHarness = createExportOptions();
    const sourceLoader = vi.fn(async (sourceUrl: string) => {
      if (sourceUrl === document.backgroundImageUrl) {
        return 'data:image/png;base64,YmFja2dyb3VuZA==';
      }
      return 'data:image/png;base64,YXNzZXQ=';
    });
    let renderedSvg = '';
    exportHarness.createObjectUrl.mockImplementation((blob: Blob) => {
      void blob.text().then((value: string) => {
        renderedSvg = value;
      });
      return 'blob:town-svg';
    });

    await buildTownPng(document, { ...exportHarness.options, assetSourceLoader: sourceLoader });
    await vi.waitFor(() => {
      expect(renderedSvg).toContain('href="data:image/png;base64,YmFja2dyb3VuZA=="');
    });

    const failedLoader = vi.fn(async (sourceUrl: string) => {
      if (sourceUrl === document.backgroundImageUrl) {
        throw new Error(`CORS denied ${sourceUrl}`);
      }
      return 'data:image/png;base64,YXNzZXQ=';
    });
    const failedCanvasFactory = vi.fn((width: number, height: number) => {
      void width;
      void height;
      return installCanvasSurface().canvasFactory(320, 240);
    });

    await expect(buildTownPng(document, { ...exportHarness.options, assetSourceLoader: failedLoader, canvasFactory: failedCanvasFactory })).rejects.toThrow('https://example.test/background.png');
    expect(failedCanvasFactory).not.toHaveBeenCalled();
  });

  it('reports the exact remote background URL and HTTP status from the default fetch loader', async () => {
    const document = createDocument();
    document.backgroundImageUrl = 'https://example.test/background.png';
    const exportHarness = createExportOptions();
    const fetchMock = vi.fn(async (sourceUrl: string) => {
      if (sourceUrl === document.backgroundImageUrl) {
        return {
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          blob: async () => new Blob(['missing'], { type: 'text/plain' }),
        } as Response;
      }

      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        blob: async () => new Blob(['asset'], { type: 'image/png' }),
      } as Response;
    });
    vi.stubGlobal('fetch', fetchMock);

    try {
      const defaultFetchOptions = {
        imageLoader: exportHarness.imageLoader,
        createObjectUrl: exportHarness.createObjectUrl,
        revokeObjectUrl: exportHarness.revokeObjectUrl,
        canvasFactory: exportHarness.canvasFactory,
      };
      await expect(buildTownPng(document, defaultFetchOptions)).rejects.toThrow(
        'Town source URL "https://example.test/background.png" failed with HTTP 503 Service Unavailable.',
      );
      expect(exportHarness.canvasFactory).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('rejects null PNG encoding and always releases the SVG object URL', async () => {
    const exportHarness = createExportOptions();
    exportHarness.toBlob.mockImplementation((callback) => callback(null));

    await expect(buildTownPng(createDocument(), exportHarness.options)).rejects.toThrow('returned null');
    expect(exportHarness.revokeObjectUrl).toHaveBeenCalledWith('blob:town-svg');
  });

  it('reports failed image loading with the blob URL and releases that URL', async () => {
    const exportHarness = createExportOptions();
    const imageLoader = vi.fn(async (source: string) => {
      throw new Error(`broken source ${source}`);
    });

    await expect(buildTownPng(createDocument(), { ...exportHarness.options, imageLoader })).rejects.toThrow('blob:town-svg');
    expect(exportHarness.revokeObjectUrl).toHaveBeenCalledWith('blob:town-svg');
    expect(exportHarness.canvasFactory).not.toHaveBeenCalled();
  });
});
