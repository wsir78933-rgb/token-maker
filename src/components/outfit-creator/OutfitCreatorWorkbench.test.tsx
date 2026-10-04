// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OutfitCreatorWorkbench } from '@/components/outfit-creator/OutfitCreatorWorkbench';
import { OUTFIT_PREVIEW_HEIGHT, OUTFIT_PREVIEW_WIDTH } from '@/lib/outfit-creator/catalog';
import { getOutfitCreatorCopy } from '@/lib/outfit-creator/copy';
import * as outfitRender from '@/lib/outfit-creator/render';
import { OUTFIT_SAVE_STORAGE_KEY, writeOutfitSaveSlot } from '@/lib/outfit-creator/saves';

vi.mock('@/lib/outfit-creator/render', () => ({
  canvasToOutfitPng: vi.fn(),
  drawOutfitLayers: vi.fn(),
}));

function installCanvasContext(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function mockContext(
    this: HTMLCanvasElement,
  ) {
    return {
      canvas: this,
      clearRect() {},
      save() {},
      restore() {},
      translate() {},
      scale() {},
      drawImage() {},
    } as unknown as CanvasRenderingContext2D;
  });
}

function installImmediateFileReader(): void {
  class ImmediateFileReader {
    result: string | ArrayBuffer | null = null;
    error: DOMException | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    readAsDataURL(blob: Blob): void {
      const marker = (blob as Blob & { marker?: string }).marker ?? 'thumbnail';
      this.result = `data:image/png;base64,${marker}`;
      this.onload?.();
    }
  }

  vi.stubGlobal('FileReader', ImmediateFileReader);
}

function mockPngBlob(marker: string): Blob {
  const blob = new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' });
  Object.defineProperty(blob, 'marker', { value: marker });
  return blob;
}

async function flushPendingReactWork(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('OutfitCreatorWorkbench', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    localStorage.clear();
    installCanvasContext();
    installImmediateFileReader();
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,AAAA',
    );
    vi.mocked(outfitRender.drawOutfitLayers).mockResolvedValue(undefined);
    vi.mocked(outfitRender.canvasToOutfitPng).mockResolvedValue(mockPngBlob('thumbnail'));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the bilingual editor with the expected preview dimensions', () => {
    render(<OutfitCreatorWorkbench locale="zh" />);

    expect(screen.getByRole('heading', { name: '预览' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '男' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '女' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '夹克' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '下载图片' })).toBeTruthy();

    const canvas = document.querySelector('canvas');
    expect(canvas?.width).toBe(OUTFIT_PREVIEW_WIDTH);
    expect(canvas?.height).toBe(OUTFIT_PREVIEW_HEIGHT);
  });

  it('toggles a category piece, keeps it when switching gender, and clears it', () => {
    render(<OutfitCreatorWorkbench locale="en" />);

    const jacket = screen.getByRole('button', { name: 'Jackets 1' });
    expect(jacket.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(jacket);
    expect(screen.getByRole('button', { name: 'Jackets 1' }).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Female' }));
    expect(screen.getByRole('button', { name: 'Female' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Jackets 1' }).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Jackets 1' }));
    expect(screen.getByRole('button', { name: 'Jackets 1' }).getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('button', { name: 'Jackets 1' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('does not redraw or animate when selecting the active gender again', async () => {
    render(<OutfitCreatorWorkbench locale="en" />);
    await flushPendingReactWork();
    const initialDrawCount = vi.mocked(outfitRender.drawOutfitLayers).mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: 'Male' }));
    await flushPendingReactWork();

    expect(outfitRender.drawOutfitLayers).toHaveBeenCalledTimes(initialDrawCount);
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
  });

  it('does not redraw or animate when clearing an already empty outfit', async () => {
    render(<OutfitCreatorWorkbench locale="en" />);
    await flushPendingReactWork();
    const initialDrawCount = vi.mocked(outfitRender.drawOutfitLayers).mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    await flushPendingReactWork();

    expect(outfitRender.drawOutfitLayers).toHaveBeenCalledTimes(initialDrawCount);
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
  });

  it('updates pieces, gender, and clear without a slot transition snapshot', async () => {
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: {},
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    render(<OutfitCreatorWorkbench locale="en" />);
    await flushPendingReactWork();

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
    await flushPendingReactWork();
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Jackets 1' }));
    await flushPendingReactWork();
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Female' }));
    await flushPendingReactWork();
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Jackets 1' }));
    await flushPendingReactWork();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    await flushPendingReactWork();
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
  });

  it('does not save or redraw when repeating no-op controls in an active empty slot', async () => {
    vi.useFakeTimers();
    const storageWriteSpy = vi.spyOn(Storage.prototype, 'setItem');
    const snapshotDataUrlSpy = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL');

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      await flushPendingReactWork();
      await act(async () => {
        vi.advanceTimersByTime(348);
      });

      expect(screen.getByRole('button', { name: 'Outfit 1' }).getAttribute('aria-pressed')).toBe('true');
      expect(storageWriteSpy).toHaveBeenCalledTimes(1);
      const stableDrawCount = vi.mocked(outfitRender.drawOutfitLayers).mock.calls.length;
      const stableStorageWriteCount = storageWriteSpy.mock.calls.length;
      const stableSnapshotCount = snapshotDataUrlSpy.mock.calls.length;

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      fireEvent.click(screen.getByRole('button', { name: 'Male' }));
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
      await flushPendingReactWork();

      expect(vi.mocked(outfitRender.drawOutfitLayers)).toHaveBeenCalledTimes(stableDrawCount);
      expect(storageWriteSpy).toHaveBeenCalledTimes(stableStorageWriteCount);
      expect(snapshotDataUrlSpy).toHaveBeenCalledTimes(stableSnapshotCount);
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('slides between two active outfit slots but not on the first slot activation', async () => {
    vi.useFakeTimers();
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 4, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-four',
    });

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();
      expect(outfitRender.drawOutfitLayers).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      await flushPendingReactWork();
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 4' }));
      await flushPendingReactWork();
      expect(document.querySelector('img[src^="data:image/"]')).not.toBeNull();
      expect(document.querySelector('canvas')?.className).toContain(
        'outfit-creator-outfit-slide-in',
      );

      await act(async () => {
        vi.advanceTimersByTime(16);
      });
      expect(document.querySelector('canvas')?.className).toContain(
        'outfit-creator-outfit-slide-in',
      );

      await act(async () => {
        vi.advanceTimersByTime(360);
      });
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('includes the Armor-matched reduced-motion CSS rule in the generated style', async () => {
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    render(<OutfitCreatorWorkbench locale="en" />);

    await waitFor(() => {
      expect(outfitRender.drawOutfitLayers).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
    await waitFor(() => {
      expect(outfitRender.drawOutfitLayers).toHaveBeenCalledTimes(2);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));

    await waitFor(() => {
      expect(outfitRender.drawOutfitLayers).toHaveBeenCalledTimes(3);
    });
    expect(document.querySelector('img[src^="data:image/"]')).not.toBeNull();
    const transitionStyle = Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .find((styleText) => styleText.includes('.outfit-creator-outfit-slide-in'));
    expect(transitionStyle).toContain('@media (prefers-reduced-motion: reduce)');
    expect(transitionStyle).toContain('.outfit-creator-outfit-slide-in');
    expect(transitionStyle).toContain('.outfit-creator-outfit-slide-out');
    expect(transitionStyle).toContain('animation-duration: 1ms;');
  });

  it('keeps the latest slot transition when another slot replaces an active transition', async () => {
    vi.useFakeTimers();
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    writeOutfitSaveSlot(localStorage, 3, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { pants: 'pants1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-three',
    });
    const pendingPreviewDrawResolutions: Array<() => void> = [];
    let connectedPreviewDrawCount = 0;

    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        return;
      }

      connectedPreviewDrawCount += 1;
      if (connectedPreviewDrawCount === 1) {
        return;
      }

      await new Promise<void>((resolve) => {
        pendingPreviewDrawResolutions.push(resolve);
      });
    });

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(1);
      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(1);
      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();
      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 3' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(1);

      await act(async () => {
        vi.advanceTimersByTime(360);
      });
      expect(document.querySelector('img[src^="data:image/"]')).not.toBeNull();

      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();
      await act(async () => {
        vi.advanceTimersByTime(16);
      });
      expect(document.querySelector('canvas')?.className).toContain(
        'outfit-creator-outfit-slide-in',
      );

      await act(async () => {
        vi.advanceTimersByTime(360);
      });
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the latest overlay when an old animation end arrives after a rapid slot switch', async () => {
    vi.useFakeTimers();
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    writeOutfitSaveSlot(localStorage, 3, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { pants: 'pants1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-three',
    });

    const pendingPreviewDrawResolutions: Array<() => void> = [];
    let connectedPreviewDrawCount = 0;
    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        return;
      }

      connectedPreviewDrawCount += 1;
      if (connectedPreviewDrawCount === 1) {
        return;
      }

      await new Promise<void>((resolve) => {
        pendingPreviewDrawResolutions.push(resolve);
      });
    });

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(1);
      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(1);
      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();

      const oldOverlayPreview = document.querySelector('img[aria-hidden="true"]');
      expect(oldOverlayPreview).not.toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 3' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(1);
      await flushPendingReactWork();

      const latestOverlayPreview = document.querySelector('img[aria-hidden="true"]');
      expect(latestOverlayPreview).not.toBeNull();
      expect(latestOverlayPreview).not.toBe(oldOverlayPreview);

      await act(async () => {
        oldOverlayPreview?.dispatchEvent(new Event('animationend', { bubbles: true }));
      });
      expect(document.querySelector('img[aria-hidden="true"]')).toBe(latestOverlayPreview);

      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();
      await act(async () => {
        vi.advanceTimersByTime(360);
      });
      expect(document.querySelector('img[aria-hidden="true"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('ignores a stale preview draw promise after a newer selection starts', async () => {
    vi.useFakeTimers();
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    const pendingPreviewDrawResolutions: Array<() => void> = [];
    let connectedPreviewDrawCount = 0;

    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        return;
      }

      connectedPreviewDrawCount += 1;
      if (connectedPreviewDrawCount === 1) {
        return;
      }

      await new Promise<void>((resolve) => {
        pendingPreviewDrawResolutions.push(resolve);
      });
    });

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
      expect(pendingPreviewDrawResolutions).toHaveLength(2);

      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();

      await act(async () => {
        vi.advanceTimersByTime(332);
      });
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();

      await act(async () => {
        pendingPreviewDrawResolutions.shift()?.();
        await Promise.resolve();
        await Promise.resolve();
      });
      await flushPendingReactWork();
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
      expect(document.querySelector('canvas')?.className).not.toContain(
        'outfit-creator-outfit-slide-in',
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('clears the transition snapshot and keeps the render error when the next draw rejects', async () => {
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });

    const previewError = new Error('slot two asset decode failed for /outfit-creator/female/shirt1.png');
    let connectedPreviewDrawCount = 0;
    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        return;
      }

      connectedPreviewDrawCount += 1;
      if (connectedPreviewDrawCount === 3) {
        throw previewError;
      }
    });

    render(<OutfitCreatorWorkbench locale="en" />);
    await flushPendingReactWork();

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
    await flushPendingReactWork();
    fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
    await flushPendingReactWork();

    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain(previewError.message);
  });

  it('does not capture a stale canvas after a failed outfit draw', async () => {
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    writeOutfitSaveSlot(localStorage, 3, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { pants: 'pants1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-three',
    });

    const previewError = new Error('slot two preview draw failed for /outfit-creator/female/shirt1.png');
    const snapshotDataUrlSpy = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL');
    let connectedPreviewDrawCount = 0;
    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        return;
      }

      connectedPreviewDrawCount += 1;
      if (connectedPreviewDrawCount === 3) {
        throw previewError;
      }
    });

    render(<OutfitCreatorWorkbench locale="en" />);
    await flushPendingReactWork();

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
    await flushPendingReactWork();
    fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
    await flushPendingReactWork();

    expect(snapshotDataUrlSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain(previewError.message);

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 3' }));
    await flushPendingReactWork();

    expect(snapshotDataUrlSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each([
    ['en', 'The previous outfit could not be captured for the transition animation.'],
    ['zh', '无法捕获上一套造型以播放切换动画。'],
  ] as const)('uses the localized snapshot fallback and continues drawing (%s)', async (locale, fallback) => {
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });

    render(<OutfitCreatorWorkbench locale={locale} />);
    await flushPendingReactWork();

    const snapshotFailure = { code: 'canvas-snapshot-failed' };
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementationOnce(() => {
      throw snapshotFailure;
    });

    fireEvent.click(screen.getByRole('button', { name: locale === 'en' ? 'Outfit 1' : '套装 1' }));
    await flushPendingReactWork();
    fireEvent.click(screen.getByRole('button', { name: locale === 'en' ? 'Outfit 2' : '套装 2' }));
    await flushPendingReactWork();

    expect(screen.getByRole('button', { name: locale === 'en' ? 'Outfit 2' : '套装 2' }).getAttribute('aria-pressed')).toBe('true');
    expect(outfitRender.drawOutfitLayers).toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(getOutfitCreatorCopy(locale).previewTransitionError);
    expect(screen.getByRole('alert').textContent).toContain(fallback);
    expect(screen.getByRole('alert').textContent).toContain('{"code":"canvas-snapshot-failed"}');
    expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
  });

  it('continues after the first snapshot failure and animates the next outfit', async () => {
    vi.useFakeTimers();
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    writeOutfitSaveSlot(localStorage, 3, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { pants: 'pants1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-three',
    });

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      const snapshotFailure = { code: 'first-canvas-snapshot-failed' };
      vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementationOnce(() => {
        throw snapshotFailure;
      });

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      await flushPendingReactWork();
      fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
      await flushPendingReactWork();

      expect(outfitRender.drawOutfitLayers).toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Outfit 2' }).getAttribute('aria-pressed')).toBe('true');
      expect(screen.getByRole('alert').textContent).toContain(
        getOutfitCreatorCopy('en').previewTransitionError,
      );
      expect(screen.getByRole('alert').textContent).toContain('{"code":"first-canvas-snapshot-failed"}');
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 3' }));
      await flushPendingReactWork();

      expect(outfitRender.drawOutfitLayers).toHaveBeenCalled();
      expect(document.querySelector('img[src^="data:image/"]')).not.toBeNull();

      await act(async () => {
        vi.advanceTimersByTime(16);
      });
      expect(document.querySelector('canvas')?.className).toContain(
        'outfit-creator-outfit-slide-in',
      );

      await act(async () => {
        vi.advanceTimersByTime(360);
      });
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('animates when switching between two saved outfit slots', async () => {
    vi.useFakeTimers();
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });

    try {
      render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      await flushPendingReactWork();
      fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
      await flushPendingReactWork();

      expect(screen.getByRole('button', { name: 'Outfit 2' }).getAttribute('aria-pressed')).toBe('true');
      expect(document.querySelector('img[src^="data:image/"]')).not.toBeNull();

      await act(async () => {
        vi.advanceTimersByTime(16);
      });
      expect(document.querySelector('canvas')?.className).toContain(
        'outfit-creator-outfit-slide-in',
      );

      await act(async () => {
        vi.advanceTimersByTime(360);
      });
      expect(document.querySelector('img[src^="data:image/"]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('clears pending transition timers when the workbench unmounts', async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'male',
        equippedPieceIds: { jacket: 'jacket1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    writeOutfitSaveSlot(localStorage, 2, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });

    try {
      const renderedWorkbench = render(<OutfitCreatorWorkbench locale="en" />);
      await flushPendingReactWork();

      fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
      await flushPendingReactWork();
      fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));
      await flushPendingReactWork();
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      const clearTimeoutCallsBeforeUnmount = clearTimeoutSpy.mock.calls.length;

      renderedWorkbench.unmount();
      await flushPendingReactWork();

      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(clearTimeoutCallsBeforeUnmount);
    } finally {
      vi.useRealTimers();
    }
  });

  it('writes an empty outfit slot using the dedicated storage key', async () => {
    render(<OutfitCreatorWorkbench locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));

    await waitFor(() => {
      const storedValue = localStorage.getItem(OUTFIT_SAVE_STORAGE_KEY);
      expect(storedValue).not.toBeNull();
      expect(JSON.parse(storedValue as string)).toHaveLength(4);
    });
  });

  it('switching to an empty outfit slot restores the initial selection', async () => {
    writeOutfitSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'female',
        equippedPieceIds: { shirt: 'shirt1' },
      },
      thumbnailDataUrl: 'data:image/png;base64,stored',
    });

    render(<OutfitCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));

    expect(screen.getByRole('button', { name: 'Female' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Shirts' }));
    expect(screen.getByRole('button', { name: 'Shirts 1' }).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Outfit 2' }));

    expect(screen.getByRole('button', { name: 'Male' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Shirts 1' }).getAttribute('aria-pressed')).toBe('false');

    await waitFor(() => {
      const storedValue = localStorage.getItem(OUTFIT_SAVE_STORAGE_KEY);
      expect(storedValue).not.toBeNull();
      const storedSlots = JSON.parse(storedValue as string) as Array<{
        snapshot: { gender: string; equippedPieceIds: Record<string, string> };
      } | null>;
      expect(storedSlots[1]?.snapshot).toEqual({
        gender: 'male',
        equippedPieceIds: {},
      });
    });
  });

  it('waits for an independent selection draw before downloading', async () => {
    const exportDraws: Array<{ canvas: HTMLCanvasElement; selection: unknown }> = [];
    const releaseExportDraws: Array<() => void> = [];
    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        exportDraws.push({ canvas, selection });
        await new Promise<void>((resolve) => {
          releaseExportDraws.push(resolve);
        });
      }
    });
    vi.mocked(outfitRender.canvasToOutfitPng).mockResolvedValue(mockPngBlob('download'));
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:outfit-export');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const downloads: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function mockClick(
      this: HTMLAnchorElement,
    ) {
      downloads.push(this.download);
    });

    render(<OutfitCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Jackets 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Download image' }));
    fireEvent.click(screen.getByRole('button', { name: 'Female' }));

    expect(exportDraws).toHaveLength(1);
    expect(exportDraws[0]?.canvas.isConnected).toBe(false);
    expect(exportDraws[0]?.canvas).not.toBe(document.querySelector('canvas'));
    expect((exportDraws[0]?.selection as { gender?: string }).gender).toBe('male');
    expect(
      (exportDraws[0]?.selection as { equippedPieceIds?: { jacket?: string } }).equippedPieceIds?.jacket,
    ).toBe('jacket1');
    expect(outfitRender.canvasToOutfitPng).not.toHaveBeenCalled();

    await act(async () => {
      releaseExportDraws[0]?.();
    });

    await waitFor(() => {
      expect(downloads).toEqual(['outfit.png']);
    });
  });

  it('only saves the latest snapshot and its matching thumbnail', async () => {
    const exportDraws: Array<{ canvas: HTMLCanvasElement; selection: unknown }> = [];
    const releaseExportDraws: Array<() => void> = [];
    const completedExportDraws: HTMLCanvasElement[] = [];
    vi.mocked(outfitRender.drawOutfitLayers).mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        exportDraws.push({ canvas, selection });
        await new Promise<void>((resolve) => {
          releaseExportDraws.push(resolve);
        });
        completedExportDraws.push(canvas);
      }
    });
    const pngBlobs = [mockPngBlob('jacket-thumbnail')];
    vi.mocked(outfitRender.canvasToOutfitPng).mockImplementation(async () => {
      const nextBlob = pngBlobs.shift();
      if (nextBlob === undefined) {
        throw new Error('Outfit test PNG blob queue is empty. Received undefined.');
      }

      return nextBlob;
    });

    render(<OutfitCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Outfit 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Jackets 1' }));

    expect(exportDraws).toHaveLength(2);
    expect(
      (exportDraws[0]?.selection as { equippedPieceIds?: { jacket?: string } }).equippedPieceIds?.jacket,
    ).toBeUndefined();
    expect(
      (exportDraws[1]?.selection as { equippedPieceIds?: { jacket?: string } }).equippedPieceIds?.jacket,
    ).toBe('jacket1');

    await act(async () => {
      releaseExportDraws[0]?.();
    });
    await waitFor(() => {
      expect(completedExportDraws).toHaveLength(1);
      expect(outfitRender.canvasToOutfitPng).not.toHaveBeenCalled();
    });
    expect(localStorage.getItem(OUTFIT_SAVE_STORAGE_KEY)).toBeNull();

    await act(async () => {
      releaseExportDraws[1]?.();
    });
    await waitFor(() => {
      expect(completedExportDraws).toHaveLength(2);
      expect(outfitRender.canvasToOutfitPng).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem(OUTFIT_SAVE_STORAGE_KEY)).toContain('jacket-thumbnail');
    });

    const storedSlots = JSON.parse(localStorage.getItem(OUTFIT_SAVE_STORAGE_KEY) as string) as Array<{
      snapshot: { equippedPieceIds: { jacket?: string } };
      thumbnailDataUrl: string;
    } | null>;
    expect(storedSlots[0]?.snapshot.equippedPieceIds.jacket).toBe('jacket1');
    expect(storedSlots[0]?.thumbnailDataUrl).toContain('jacket-thumbnail');
    expect(storedSlots[0]?.thumbnailDataUrl).not.toContain('empty-thumbnail');
  });
});
