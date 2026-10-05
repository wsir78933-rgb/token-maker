// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WeaponCreatorWorkbench } from '@/components/weapon-creator/WeaponCreatorWorkbench';
import {
  WEAPON_PREVIEW_HEIGHT,
  WEAPON_PREVIEW_WIDTH,
} from '@/lib/weapon-creator/catalog';
import { WEAPON_EXPORT_SCALE } from '@/lib/weapon-creator/constants';
import * as weaponRender from '@/lib/weapon-creator/render';
import {
  WEAPON_SAVE_STORAGE_KEY,
  writeWeaponSaveSlot,
} from '@/lib/weapon-creator/saves';

vi.mock('@/lib/weapon-creator/render', () => ({
  canvasToWeaponPng: vi.fn(),
  drawWeaponLayers: vi.fn(),
}));

function installCanvasContext(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function mockContext(
    this: HTMLCanvasElement,
  ) {
    return {
      canvas: this,
      clearRect() {},
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

type DeferredPromise<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

function createDeferredPromise<T>(): DeferredPromise<T> {
  let resolvePromise: DeferredPromise<T>['resolve'] | undefined;
  let rejectPromise: DeferredPromise<T>['reject'] | undefined;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  if (resolvePromise === undefined || rejectPromise === undefined) {
    throw new Error('Deferred test promise did not expose resolve and reject functions.');
  }

  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
}

describe('WeaponCreatorWorkbench', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    localStorage.clear();
    installCanvasContext();
    installImmediateFileReader();
    vi.mocked(weaponRender.drawWeaponLayers).mockResolvedValue(undefined);
    vi.mocked(weaponRender.canvasToWeaponPng).mockResolvedValue(mockPngBlob('thumbnail'));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the bilingual editor with a blank 800 by 635 preview', () => {
    render(<WeaponCreatorWorkbench locale="zh" />);

    expect(screen.getByRole('heading', { name: '武器预览' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '剑握柄' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '下载 PNG' })).toBeTruthy();

    const canvas = document.querySelector('canvas');
    expect(canvas?.width).toBe(WEAPON_PREVIEW_WIDTH);
    expect(canvas?.height).toBe(WEAPON_PREVIEW_HEIGHT);

    const initialSelection = vi.mocked(weaponRender.drawWeaponLayers).mock.calls[0]?.[1];
    expect(initialSelection).toEqual({ equippedPieceIds: {} });
  });

  it('replaces and removes a part within the same category', () => {
    render(<WeaponCreatorWorkbench locale="en" />);

    const firstHilt = screen.getByRole('button', { name: 'Hilts 1' });
    const secondHilt = screen.getByRole('button', { name: 'Hilts 2' });
    expect(firstHilt.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(firstHilt);
    expect(firstHilt.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(secondHilt);
    expect(firstHilt.getAttribute('aria-pressed')).toBe('false');
    expect(secondHilt.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(secondHilt);
    expect(secondHilt.getAttribute('aria-pressed')).toBe('false');
  });

  it('loads a saved weapon slot and writes an empty slot on first activation', async () => {
    writeWeaponSaveSlot(localStorage, 1, {
      snapshot: { equippedPieceIds: { blade: 'blade2' } },
      thumbnailDataUrl: 'data:image/png;base64,stored',
    });

    render(<WeaponCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));

    expect(screen.getByRole('button', { name: 'Weapon 1' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Blades' }));
    expect(screen.getByRole('button', { name: 'Blades 2' }).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Weapon 2' }));
    await waitFor(() => {
      const storedValue = localStorage.getItem(WEAPON_SAVE_STORAGE_KEY);
      expect(storedValue).not.toBeNull();
      expect(JSON.parse(storedValue as string)).toHaveLength(4);
    });
  });

  it('keeps only the latest thumbnail write when a slot changes quickly', async () => {
    const pendingExportDraws: Array<{
      canvas: HTMLCanvasElement;
      release: () => void;
    }> = [];
    vi.mocked(weaponRender.drawWeaponLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        await new Promise<void>((resolve) => {
          pendingExportDraws.push({ canvas, release: resolve });
        });
      }
    });

    render(<WeaponCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades 1' }));

    expect(pendingExportDraws).toHaveLength(2);
    expect(pendingExportDraws.map(({ canvas }) => [canvas.width, canvas.height])).toEqual([
      [WEAPON_PREVIEW_WIDTH, WEAPON_PREVIEW_HEIGHT],
      [WEAPON_PREVIEW_WIDTH, WEAPON_PREVIEW_HEIGHT],
    ]);

    await act(async () => {
      pendingExportDraws.shift()?.release();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(localStorage.getItem(WEAPON_SAVE_STORAGE_KEY)).toBeNull();

    await act(async () => {
      pendingExportDraws.shift()?.release();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      const storedValue = localStorage.getItem(WEAPON_SAVE_STORAGE_KEY);
      expect(storedValue).toContain('blade1');
      const storedSlots = JSON.parse(storedValue as string) as Array<{
        snapshot: { equippedPieceIds: { blade?: string } };
      } | null>;
      expect(storedSlots[0]?.snapshot.equippedPieceIds.blade).toBe('blade1');
    });
  });

  it('restores the latest in-session selection after a pending save and rapid 1 to 2 to 1 switch', async () => {
    const pendingExportDraws: Array<{
      selection: unknown;
      release: () => void;
    }> = [];
    vi.mocked(weaponRender.drawWeaponLayers).mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        await new Promise<void>((resolve) => {
          pendingExportDraws.push({ selection, release: resolve });
        });
      }
    });

    render(<WeaponCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));

    expect(screen.getByRole('button', { name: 'Blades 1' }).getAttribute('aria-pressed')).toBe('true');

    while (pendingExportDraws.length > 0) {
      await act(async () => {
        pendingExportDraws.shift()?.release();
        await Promise.resolve();
        await Promise.resolve();
      });
    }

    await waitFor(() => {
      const storedValue = localStorage.getItem(WEAPON_SAVE_STORAGE_KEY);
      expect(storedValue).not.toBeNull();
      const storedSlots = JSON.parse(storedValue as string) as Array<{
        snapshot: { equippedPieceIds: { blade?: string } };
      } | null>;
      expect(storedSlots[0]?.snapshot.equippedPieceIds.blade).toBe('blade1');
    });
  });

  it('keeps a rejected slot-one save attached to slot one while slot two is active and shows it after returning', async () => {
    writeWeaponSaveSlot(localStorage, 2, {
      snapshot: { equippedPieceIds: {} },
      thumbnailDataUrl: 'data:image/png;base64,slot-two',
    });
    const failedSlotOneSave = createDeferredPromise<void>();
    let detachedDrawCount = 0;
    vi.mocked(weaponRender.drawWeaponLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        detachedDrawCount += 1;
        if (detachedDrawCount === 1) {
          await failedSlotOneSave.promise;
        }
      }
    });

    render(<WeaponCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 2' }));

    const slotOneFailure = new Error('slot 1 thumbnail render failed for blade1');
    await act(async () => {
      failedSlotOneSave.reject(slotOneFailure);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));
    expect(screen.getByRole('alert').textContent).toContain(slotOneFailure.message);
  });

  it.each([
    ['success', 'download completed'],
    ['failure', 'download failed after the save error'],
  ] as const)('does not let an old pending download %s replace a newer save error', async (outcome, downloadFailureMessage) => {
    writeWeaponSaveSlot(localStorage, 1, {
      snapshot: { equippedPieceIds: {} },
      thumbnailDataUrl: 'data:image/png;base64,slot-one',
    });
    const pendingDownloadPng = createDeferredPromise<Blob>();
    const saveFailure = new Error('slot 1 save failed after the download started');
    let rejectNextDetachedDraw = false;
    vi.mocked(weaponRender.drawWeaponLayers).mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected && rejectNextDetachedDraw) {
        rejectNextDetachedDraw = false;
        throw saveFailure;
      }
    });
    vi.mocked(weaponRender.canvasToWeaponPng).mockResolvedValue(mockPngBlob('autosave'));
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:weapon-export');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<WeaponCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Weapon 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades 1' }));
    await waitFor(() => {
      expect(localStorage.getItem(WEAPON_SAVE_STORAGE_KEY)).toContain('blade1');
    });

    vi.mocked(weaponRender.canvasToWeaponPng).mockImplementationOnce(
      () => pendingDownloadPng.promise,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));

    rejectNextDetachedDraw = true;
    fireEvent.click(screen.getByRole('button', { name: 'Blades 2' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(saveFailure.message);
    });

    await act(async () => {
      if (outcome === 'success') {
        pendingDownloadPng.resolve(mockPngBlob('download'));
      } else {
        pendingDownloadPng.reject(new Error(downloadFailureMessage));
      }
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(saveFailure.message);
    });
  });

  it('downloads a separately rendered current selection', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:weapon-export');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const downloadedNames: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function mockClick(
      this: HTMLAnchorElement,
    ) {
      downloadedNames.push(this.download);
    });

    render(<WeaponCreatorWorkbench locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Blades' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blades 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));

    await waitFor(() => {
      expect(downloadedNames).toEqual(['weapon.png']);
    });

    const exportDraw = vi
      .mocked(weaponRender.drawWeaponLayers)
      .mock.calls.find(([context]) => !(context.canvas as HTMLCanvasElement).isConnected);
    expect(exportDraw?.[1]).toEqual({ equippedPieceIds: { blade: 'blade1' } });
    expect(exportDraw?.[0].canvas.width).toBe(WEAPON_PREVIEW_WIDTH * WEAPON_EXPORT_SCALE);
    expect(exportDraw?.[0].canvas.height).toBe(WEAPON_PREVIEW_HEIGHT * WEAPON_EXPORT_SCALE);
    expect(weaponRender.canvasToWeaponPng).toHaveBeenCalled();
  });
});
