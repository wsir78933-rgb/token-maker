import { afterEach, describe, expect, it } from 'vitest';

import {
  WEAPON_LAYER_ORDER,
  getWeaponLayerBox,
} from '@/lib/weapon-creator/catalog';
import { WEAPON_EXPORT_SCALE } from '@/lib/weapon-creator/constants';
import { weaponPieceImagePath } from '@/lib/weapon-creator/icons';
import {
  canvasToWeaponPng,
  drawWeaponLayers,
  listWeaponRenderLayers,
} from '@/lib/weapon-creator/render';
import {
  createInitialWeaponSelection,
  toggleWeaponPiece,
} from '@/lib/weapon-creator/selection';

type RecordedDraw = {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

class TestImage {
  static deferLoads = false;
  static deferredImages: TestImage[] = [];

  private imageSource = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  get src(): string {
    return this.imageSource;
  }

  set src(source: string) {
    this.imageSource = source;
    if (TestImage.deferLoads) {
      TestImage.deferredImages.push(this);
      return;
    }

    this.finishLoading();
  }

  static flushDeferredImages(): void {
    const deferredImages = [...TestImage.deferredImages];
    TestImage.deferredImages = [];
    for (const image of deferredImages) {
      image.finishLoading();
    }
  }

  private finishLoading(): void {
    if (this.imageSource.includes('/blade2-4x.png')) {
      this.onerror?.();
      return;
    }

    this.onload?.();
  }
}

const originalImageConstructor = globalThis.Image;

afterEach(() => {
  TestImage.deferLoads = false;
  TestImage.deferredImages = [];
  Object.defineProperty(globalThis, 'Image', {
    configurable: true,
    writable: true,
    value: originalImageConstructor,
  });
});

function useTestImages(): void {
  Object.defineProperty(globalThis, 'Image', {
    configurable: true,
    writable: true,
    value: TestImage,
  });
}

function createRecordingContext(
  width = 800,
  height = 635,
): {
  context: Record<string, unknown>;
  draws: RecordedDraw[];
  get clearCalls(): number;
} {
  const draws: RecordedDraw[] = [];
  let clearCalls = 0;
  const context: Record<string, unknown> = {
    canvas: { width, height },
    clearRect: () => {
      clearCalls += 1;
    },
    drawImage: (image: TestImage, x: number, y: number, width: number, height: number) => {
      draws.push({ source: image.src, x, y, width, height });
    },
  };

  return {
    context,
    draws,
    get clearCalls() {
      return clearCalls;
    },
  };
}

function selectWeaponPieces() {
  let selection = createInitialWeaponSelection();
  for (const pieceId of ['blade1', 'axe2', 'stick3', 'grip4', 'polearm5']) {
    selection = toggleWeaponPiece(selection, pieceId);
  }

  return selection;
}

describe('weapon rendering', () => {
  it('keeps an empty selection transparent while clearing the complete source canvas', async () => {
    useTestImages();
    const recording = createRecordingContext();

    await drawWeaponLayers(recording.context as never, createInitialWeaponSelection());

    expect(recording.clearCalls).toBe(1);
    expect(recording.draws).toEqual([]);
  });

  it('draws selected pieces in the source layer order and exact CSS boxes with accepted 4x paths', async () => {
    useTestImages();
    const selection = selectWeaponPieces();
    const recording = createRecordingContext();

    expect(listWeaponRenderLayers(selection).map((layer) => layer.category)).toEqual([
      'blade',
      'axe',
      'handle',
      'hilts',
      'polearm',
    ]);
    expect(WEAPON_LAYER_ORDER.indexOf('blade')).toBeLessThan(WEAPON_LAYER_ORDER.indexOf('polearm'));

    await drawWeaponLayers(recording.context as never, selection);

    expect(recording.draws.map(({ source }) => source)).toEqual([
      weaponPieceImagePath('blade1'),
      weaponPieceImagePath('axe2'),
      weaponPieceImagePath('stick3'),
      weaponPieceImagePath('grip4'),
      weaponPieceImagePath('polearm5'),
    ]);
    expect(recording.draws).toEqual([
      { source: weaponPieceImagePath('blade1'), ...getWeaponLayerBox('blade') },
      { source: weaponPieceImagePath('axe2'), ...getWeaponLayerBox('axe') },
      { source: weaponPieceImagePath('stick3'), ...getWeaponLayerBox('handle') },
      { source: weaponPieceImagePath('grip4'), ...getWeaponLayerBox('hilts') },
      { source: weaponPieceImagePath('polearm5'), ...getWeaponLayerBox('polearm') },
    ].map(({ source, x, y, width, height }) => ({ source, x, y, width, height })));
  });

  it('uses the same accepted 4x image paths and scales every layer box on the export canvas', async () => {
    useTestImages();
    const selection = selectWeaponPieces();
    const recording = createRecordingContext(3200, 2540);

    await drawWeaponLayers(recording.context as never, selection);

    expect(recording.draws.map(({ source }) => source)).toEqual([
      weaponPieceImagePath('blade1'),
      weaponPieceImagePath('axe2'),
      weaponPieceImagePath('stick3'),
      weaponPieceImagePath('grip4'),
      weaponPieceImagePath('polearm5'),
    ]);
    expect(recording.draws).toEqual([
      { source: weaponPieceImagePath('blade1'), ...getWeaponLayerBox('blade') },
      { source: weaponPieceImagePath('axe2'), ...getWeaponLayerBox('axe') },
      { source: weaponPieceImagePath('stick3'), ...getWeaponLayerBox('handle') },
      { source: weaponPieceImagePath('grip4'), ...getWeaponLayerBox('hilts') },
      { source: weaponPieceImagePath('polearm5'), ...getWeaponLayerBox('polearm') },
    ].map(({ source, x, y, width, height }) => ({
      source,
      x: x * WEAPON_EXPORT_SCALE,
      y: y * WEAPON_EXPORT_SCALE,
      width: width * WEAPON_EXPORT_SCALE,
      height: height * WEAPON_EXPORT_SCALE,
    })));
  });

  it('does not clear or paint a stale selection after asynchronous image loading', async () => {
    useTestImages();
    TestImage.deferLoads = true;
    const recording = createRecordingContext();
    let isCurrent = true;

    const drawingPromise = drawWeaponLayers(
      recording.context as never,
      toggleWeaponPiece(createInitialWeaponSelection(), 'blade1'),
      () => isCurrent,
    );
    await Promise.resolve();
    isCurrent = false;
    TestImage.flushDeferredImages();
    await drawingPromise;

    expect(recording.clearCalls).toBe(0);
    expect(recording.draws).toEqual([]);
  });

  it('rejects a failed image load with the local source path', async () => {
    useTestImages();

    await expect(
      drawWeaponLayers(
        createRecordingContext().context as never,
        toggleWeaponPiece(createInitialWeaponSelection(), 'blade2'),
      ),
    ).rejects.toThrowError('/weapon-creator/high-resolution/blade2-4x.png');
  });

  it('rejects a draw canvas with the wrong source dimensions', async () => {
    useTestImages();
    const recording = createRecordingContext();
    recording.context.canvas = { width: 799, height: 635 };

    await expect(
      drawWeaponLayers(recording.context as never, createInitialWeaponSelection()),
    ).rejects.toThrowError('799x635');
  });
});

describe('weapon PNG export', () => {
  it('returns the requested PNG blob from the source canvas', async () => {
    const pngBlob = new Blob(['weapon'], { type: 'image/png' });
    const canvas = {
      width: 800,
      height: 635,
      toBlob(callback: (blob: Blob | null) => void, type?: string) {
        expect(type).toBe('image/png');
        callback(pngBlob);
      },
    };

    await expect(canvasToWeaponPng(canvas)).resolves.toBe(pngBlob);
  });

  it('accepts the 4x export canvas dimensions', async () => {
    const pngBlob = new Blob(['weapon'], { type: 'image/png' });
    const canvas = {
      width: 3200,
      height: 2540,
      toBlob(callback: (blob: Blob | null) => void, type?: string) {
        expect(type).toBe('image/png');
        callback(pngBlob);
      },
    };

    await expect(canvasToWeaponPng(canvas)).resolves.toBe(pngBlob);
  });

  it('rejects null and non-PNG encoder results', async () => {
    const nullCanvas = {
      width: 800,
      height: 635,
      toBlob(callback: (blob: Blob | null) => void) {
        callback(null);
      },
    };
    const jpegCanvas = {
      width: 800,
      height: 635,
      toBlob(callback: (blob: Blob | null) => void) {
        callback(new Blob(['weapon'], { type: 'image/jpeg' }));
      },
    };

    await expect(canvasToWeaponPng(nullCanvas)).rejects.toThrowError('returned null');
    await expect(canvasToWeaponPng(jpegCanvas)).rejects.toThrowError('image/png');
  });

  it('rejects a PNG canvas with incorrect dimensions before encoding', async () => {
    const canvas = {
      width: 800,
      height: 634,
      toBlob: () => {
        throw new Error('toBlob should not be called');
      },
    };

    expect(() => canvasToWeaponPng(canvas)).toThrowError('800x634');
  });
});
