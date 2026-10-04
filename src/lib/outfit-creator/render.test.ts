import { afterEach, describe, expect, it } from 'vitest';

import { listOutfitRenderLayers, drawOutfitLayers } from '@/lib/outfit-creator/render';
import {
  createInitialOutfitSelection,
  toggleOutfitPiece,
} from '@/lib/outfit-creator/selection';

type RecordedDraw = {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

class TestImage {
  private imageSource = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  get src(): string {
    return this.imageSource;
  }

  set src(source: string) {
    this.imageSource = source;
    if (source.includes('shirt60')) {
      this.onerror?.();
      return;
    }

    this.onload?.();
  }
}

const originalImageConstructor = globalThis.Image;

afterEach(() => {
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

function createRecordingContext(): { context: Record<string, unknown>; draws: RecordedDraw[]; clearCalls: number } {
  const draws: RecordedDraw[] = [];
  let clearCalls = 0;
  const context: Record<string, unknown> = {
    canvas: { width: 600, height: 500 },
    clearRect: () => {
      clearCalls += 1;
    },
    drawImage: (image: TestImage, x: number, y: number, width: number, height: number) => {
      draws.push({ source: image.src, x, y, width, height });
    },
  };

  return { context, draws, get clearCalls() { return clearCalls; } };
}

function selectPieces(): ReturnType<typeof createInitialOutfitSelection> {
  let selection = createInitialOutfitSelection();
  for (const pieceId of [
    'jacket1',
    'shirt31',
    'pants2',
    'skirt3',
    'shoes4',
    'scarf5',
    'belt6',
    'gloves7',
  ]) {
    selection = toggleOutfitPiece(selection, pieceId);
  }

  return selection;
}

describe('outfit rendering', () => {
  it('always draws the body at the centered CSS frame', async () => {
    useTestImages();
    const recording = createRecordingContext();

    await drawOutfitLayers(recording.context as never, createInitialOutfitSelection());

    expect(recording.clearCalls).toBe(1);
    expect(recording.draws).toEqual([
      {
        source: '/armor-creator/male/body.png',
        x: 200,
        y: 50,
        width: 200,
        height: 400,
      },
    ]);
  });

  it('draws all selected layers from back to front with CSS sizes and y plus 50', async () => {
    useTestImages();
    const recording = createRecordingContext();
    const layers = listOutfitRenderLayers(selectPieces());

    expect(layers.map((layer) => layer.slot)).toEqual([
      'jacketBack',
      'shirtBack',
      'skirtBack',
      'shoesBack',
      'body',
      'pants',
      'shoes',
      'skirt',
      'shirt',
      'belt',
      'gloves',
      'jacket',
      'scarf',
    ]);

    await drawOutfitLayers(recording.context as never, selectPieces());

    expect(recording.draws.map(({ source }) => source)).toEqual([
      '/outfit-creator/nmale/bjacket1.png',
      '/outfit-creator/nmale/bshirt31.png',
      '/outfit-creator/nmale/bskirt3.png',
      '/outfit-creator/nmale/bshoes4.png',
      '/armor-creator/male/body.png',
      '/outfit-creator/nmale/pants2.png',
      '/outfit-creator/nmale/shoes4.png',
      '/outfit-creator/nmale/skirt3.png',
      '/outfit-creator/nmale/shirt31.png',
      '/outfit-creator/nmale/belt6.png',
      '/outfit-creator/nmale/gloves7.png',
      '/outfit-creator/nmale/jacket1.png',
      '/outfit-creator/nmale/scarf5.png',
    ]);
    expect(recording.draws[0]).toMatchObject({ x: 249, y: 127, width: 102, height: 227 });
    expect(recording.draws[4]).toMatchObject({ x: 200, y: 50, width: 200, height: 400 });
    expect(recording.draws[12]).toMatchObject({ x: 253, y: 128, width: 95, height: 106 });
  });

  it('does not paint stale work when the current predicate is false', async () => {
    useTestImages();
    const recording = createRecordingContext();

    await drawOutfitLayers(recording.context as never, createInitialOutfitSelection(), () => false);

    expect(recording.clearCalls).toBe(0);
    expect(recording.draws).toEqual([]);
  });

  it('rejects a failed image load with the path', async () => {
    useTestImages();

    await expect(
      drawOutfitLayers(
        createRecordingContext().context as never,
        toggleOutfitPiece(createInitialOutfitSelection(), 'shirt60'),
      ),
    ).rejects.toThrowError('/outfit-creator/nmale/bshirt60.png');
  });
});
