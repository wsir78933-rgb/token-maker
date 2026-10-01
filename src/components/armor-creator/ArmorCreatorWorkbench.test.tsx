// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ArmorCreatorWorkbench } from '@/components/armor-creator/ArmorCreatorWorkbench';
import { ARMOR_PREVIEW_HEIGHT, ARMOR_PREVIEW_WIDTH } from '@/lib/armor-creator/catalog';
import * as armorIcons from '@/lib/armor-creator/icons';
import * as armorRender from '@/lib/armor-creator/render';
import { ARMOR_SAVE_STORAGE_KEY, writeArmorSaveSlot } from '@/lib/armor-creator/saves';
import { type ArmorSelection } from '@/lib/armor-creator/selection';

function buttonByExactName(name: string): HTMLElement {
  return screen.getByRole('button', { name: (accessibleName) => accessibleName === name });
}

function pieceImage(name: string): HTMLImageElement {
  const image = buttonByExactName(name).querySelector('img');
  if (!(image instanceof HTMLImageElement)) {
    throw new Error(`Armor test expected an image inside ${JSON.stringify(name)}. Received ${String(image)}.`);
  }

  return image;
}

function installCanvas2d(onClear?: () => void): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function mockContext(
    this: HTMLCanvasElement,
  ) {
    return {
      canvas: this,
      clearRect() {
        onClear?.();
      },
      save() {},
      restore() {},
      translate() {},
      scale() {},
      drawImage() {},
    } as unknown as CanvasRenderingContext2D;
  });
}

type PendingArmorImage = {
  succeed: () => void;
  fail: () => void;
};

function installImmediateFileReader(): void {
  class ImmediateFileReader {
    result: string | ArrayBuffer | null = null;
    error: DOMException | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    readAsDataURL(): void {
      this.result = 'data:image/png;base64,QkJCQg==';
      this.onload?.();
    }
  }

  vi.stubGlobal('FileReader', ImmediateFileReader);
}

function installManualArmorImages(): PendingArmorImage[] {
  const pendingImages: PendingArmorImage[] = [];

  vi.stubGlobal(
    'Image',
    class ManualArmorImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_source: string) {
        pendingImages.push({
          succeed: () => {
            this.onload?.();
          },
          fail: () => {
            this.onerror?.();
          },
        });
      }
    },
  );

  return pendingImages;
}

describe('ArmorCreatorWorkbench', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('初始能看到预览和男性', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    expect(screen.getByRole('heading', { name: '预览' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '男' })).toBeTruthy();
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.width).toBe(ARMOR_PREVIEW_WIDTH);
    expect(canvas?.height).toBe(ARMOR_PREVIEW_HEIGHT);
  });

  it('点第一件头盔后该按钮为选中', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const firstHelm = screen.getByRole('button', { name: '头盔 1' });
    expect(firstHelm.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(firstHelm);

    expect(screen.getByRole('button', { name: '头盔 1' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('男性时胸甲曲线是 disabled', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const chestCurve = screen.getByRole('button', { name: '胸甲曲线' }) as HTMLButtonElement;
    expect(chestCurve.disabled).toBe(true);
  });

  it('空的套装 2 可以点，按钮里没有缩略图', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const outfitTwo = buttonByExactName('套装 2') as HTMLButtonElement;
    expect(outfitTwo.disabled).toBe(false);
    expect(outfitTwo.querySelector('img')).toBeNull();
  });

  it('点套装时装备不是对象，提示里带上原值', () => {
    const snapshot = {
      gender: 'male',
      material: 'plate',
      shoulderSymmetry: false,
      chestCurve: true,
      equippedPieceIds: ['nope'],
    } as unknown as ArmorSelection;

    writeArmorSaveSlot(localStorage, 1, {
      snapshot,
      thumbnailDataUrl: 'data:image/png;base64,AAAA',
    });

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '套装 1' }));

    expect(screen.getByRole('alert').textContent).toBe(
      'Armor outfit slot 1 equippedPieceIds must be a non-array object. Received ["nope"].',
    );
  });

  it('英文界面仍有 Preview、Male 和 Download image', () => {
    render(<ArmorCreatorWorkbench locale="en" />);

    expect(screen.getByRole('heading', { name: 'Preview' })).toBeTruthy();
    expect(screen.getByRole('button', { name: (accessibleName) => accessibleName === 'Male' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download image' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Outfit 1' })).toBeTruthy();
  });

  it('编辑器仍是左选择右预览，并保留原有按钮', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const preview = screen.getByRole('heading', { name: '预览' }).closest('section');
    expect(preview?.className).toContain('lg:order-2');
    expect(preview?.className).toContain('lg:w-[480px]');
    expect(preview?.className).not.toContain('sticky');
    expect(preview?.parentElement?.parentElement?.className).toContain('rounded-2xl');
    expect(preview?.parentElement?.parentElement?.className).toContain('bg-[var(--site-panel)]');

    for (const name of [
      '男',
      '女',
      '板甲',
      '头盔',
      '左右肩对称',
      '胸甲曲线',
      '清空',
      '套装 1',
      '套装 2',
      '套装 3',
      '套装 4',
      '下载图片',
    ]) {
      expect(buttonByExactName(name)).toBeTruthy();
    }

    expect(screen.queryByRole('button', { name: (accessibleName) => accessibleName === '保存 1' })).toBeNull();
    expect(screen.queryByRole('button', { name: (accessibleName) => accessibleName === '读取 2' })).toBeNull();

    const male = buttonByExactName('男');
    const plate = buttonByExactName('板甲');
    const outfitOne = buttonByExactName('套装 1');
    const shoulderSymmetry = buttonByExactName('左右肩对称');
    const clearEquipment = buttonByExactName('清空');
    const downloadImage = buttonByExactName('下载图片');
    expect(preview?.contains(male)).toBe(false);
    expect(preview?.contains(plate)).toBe(false);
    expect(preview?.contains(shoulderSymmetry)).toBe(true);
    expect(preview?.contains(clearEquipment)).toBe(true);
    expect(preview?.contains(downloadImage)).toBe(true);
    expect(male.parentElement).toBe(buttonByExactName('女').parentElement);
    expect(male.parentElement?.className).toBe('grid grid-cols-2 gap-2');
    expect(plate.parentElement).toBe(buttonByExactName('布甲').parentElement);
    expect(plate.parentElement?.className).toBe('grid grid-cols-3 gap-2');
    expect(plate.parentElement).not.toBe(clearEquipment.parentElement);
    expect(outfitOne.compareDocumentPosition(shoulderSymmetry) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(shoulderSymmetry.parentElement?.className).toBe('grid grid-cols-4 gap-2');
    expect(shoulderSymmetry.parentElement).toBe(clearEquipment.parentElement);
    expect(shoulderSymmetry.parentElement).toBe(downloadImage.parentElement);
    expect(male.className).toContain('w-full');
    expect(plate.className).toContain('w-full');
    expect(shoulderSymmetry.className).toContain('w-full');
    expect(downloadImage.className).toContain('w-full');
  });

  it('部件缩略图使用本地 PNG，并保持比例，左肩水平翻转', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const helm = pieceImage('头盔 1');
    expect(helm.getAttribute('src')).toBe(armorIcons.armorPieceImagePath('male:plate:helm:1'));
    expect(helm.className).toContain('object-contain');
    expect(helm.className).not.toContain('-scale-x-100');
    expect(buttonByExactName('头盔 1').querySelector('svg')).toBeNull();

    fireEvent.click(buttonByExactName('左肩'));
    const leftShoulder = pieceImage('左肩 1');
    expect(leftShoulder.getAttribute('src')).toBe(
      armorIcons.armorPieceImagePath('male:plate:shoulderLeft:1'),
    );
    expect(leftShoulder.className).toContain('object-contain');
    expect(leftShoulder.className).toContain('-scale-x-100');
    expect(leftShoulder.closest('span')?.className).toContain('bg-[#fffaf4]');
    expect(leftShoulder.closest('span')?.className).toContain('border-[var(--site-accent-strong)]');

    fireEvent.click(buttonByExactName('右肩'));
    const rightShoulder = pieceImage('右肩 1');
    expect(rightShoulder.getAttribute('src')).toBe(
      armorIcons.armorPieceImagePath('male:plate:shoulderRight:1'),
    );
    expect(rightShoulder.className).toContain('object-contain');
    expect(rightShoulder.className).not.toContain('-scale-x-100');
  });

  it('女性板甲关闭胸甲曲线后，胸甲缩略图用 bchest', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    fireEvent.click(buttonByExactName('女'));
    fireEvent.click(buttonByExactName('胸甲'));

    const curvedChest = pieceImage('胸甲 1');
    const curvedPath = armorIcons.armorPieceImagePath('female:plate:chest:1');
    expect(curvedChest.getAttribute('src')).toBe(curvedPath);
    expect(curvedPath).not.toContain('bchest');

    fireEvent.click(buttonByExactName('胸甲曲线'));

    const chestButtons = screen.getAllByRole('button', { name: /^胸甲 \d+$/ });
    expect(chestButtons).toHaveLength(30);
    for (const chestButton of chestButtons) {
      const source = chestButton.querySelector('img')?.getAttribute('src');
      expect(source).toContain('bchest');
    }

    expect(pieceImage('胸甲 1').getAttribute('src')).toBe(
      armorIcons.armorPieceImagePath('female:plate:chest:1', { flatChest: true }),
    );

    fireEvent.click(buttonByExactName('皮甲'));
    expect(pieceImage('胸甲 1').getAttribute('src')).toBe(
      armorIcons.armorPieceImagePath('female:leather:chest:1'),
    );
    expect(pieceImage('胸甲 1').getAttribute('src')).not.toContain('bchest');
    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('预览底用米色和金边，让黑线稿看得见', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const canvas = document.querySelector('canvas');
    expect(canvas?.className).toContain('bg-[#fffaf4]');
    expect(canvas?.className).not.toContain('bg-black');
    expect(canvas?.parentElement?.className).toContain('bg-[#fffaf4]');
    expect(canvas?.parentElement?.className).toContain('border-[var(--site-accent-strong)]');
    expect(canvas?.parentElement?.className).not.toContain('bg-black');
  });

  it('过期绘制失败不会盖住后来的成功', async () => {
    let clearCount = 0;
    installCanvas2d(() => {
      clearCount += 1;
    });
    const pendingImages = installManualArmorImages();

    render(<ArmorCreatorWorkbench locale="zh" />);
    expect(pendingImages).toHaveLength(1);

    fireEvent.click(buttonByExactName('女'));
    expect(pendingImages).toHaveLength(2);

    await act(async () => {
      pendingImages[0]?.fail();
    });
    expect(screen.queryByRole('alert')).toBeNull();

    await act(async () => {
      pendingImages[1]?.succeed();
    });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(clearCount).toBe(1);
  });

  it('过期绘制成功不会清掉当前这张图的错误', async () => {
    let clearCount = 0;
    installCanvas2d(() => {
      clearCount += 1;
    });
    const pendingImages = installManualArmorImages();

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('女'));

    await act(async () => {
      pendingImages[1]?.fail();
    });
    const alertText = screen.getByRole('alert').textContent ?? '';
    expect(alertText).toContain(armorIcons.armorBodyImagePath('female'));
    expect(alertText).not.toContain(armorIcons.armorBodyImagePath('male'));

    await act(async () => {
      pendingImages[0]?.succeed();
    });
    expect(screen.getByRole('alert').textContent).toBe(alertText);
    expect(clearCount).toBe(0);
  });

  it('下载先画点击时的选择，快速换性别也不会导出新装', async () => {
    installCanvas2d();
    const exportDraws: Array<{ canvas: HTMLCanvasElement; selection: ArmorSelection }> = [];
    let releaseExport = () => {};
    vi.spyOn(armorRender, 'drawArmorLayers').mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        exportDraws.push({ canvas, selection });
        await new Promise<void>((resolve) => {
          releaseExport = resolve;
        });
      }
    });
    const pngCanvases: HTMLCanvasElement[] = [];
    vi.spyOn(armorRender, 'canvasToArmorPng').mockImplementation(async (canvas) => {
      pngCanvases.push(canvas as HTMLCanvasElement);
      return new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' });
    });
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:armor-export');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const downloads: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function mockClick(
      this: HTMLAnchorElement,
    ) {
      downloads.push(this.download);
    });

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('头盔 1'));
    fireEvent.click(buttonByExactName('下载图片'));
    fireEvent.click(buttonByExactName('女'));

    expect(exportDraws).toHaveLength(1);
    expect(exportDraws[0]?.selection.gender).toBe('male');
    expect(exportDraws[0]?.selection.equippedPieceIds.helm).toBe('male:plate:helm:1');
    expect(exportDraws[0]?.canvas.isConnected).toBe(false);
    expect(exportDraws[0]?.canvas).not.toBe(document.querySelector('canvas'));
    expect(pngCanvases).toHaveLength(0);

    await act(async () => {
      releaseExport();
    });

    await waitFor(() => {
      expect(downloads).toEqual(['armor.png']);
    });
    expect(pngCanvases).toEqual([exportDraws[0]?.canvas]);
    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toBeNull();
  });

  it('还没点套装时，改性别、材质、装备、肩对称和清空都不写存档', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    fireEvent.click(buttonByExactName('女'));
    fireEvent.click(buttonByExactName('皮甲'));
    fireEvent.click(buttonByExactName('头盔 1'));
    fireEvent.click(buttonByExactName('左右肩对称'));
    fireEvent.click(buttonByExactName('清空'));

    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toBeNull();
    expect(buttonByExactName('女').getAttribute('aria-pressed')).toBe('true');
    expect(buttonByExactName('头盔 1').getAttribute('aria-pressed')).toBe('false');
  });

  it('自动保存画出点击当时的选择，旧写回不会盖住后来的写回', async () => {
    installCanvas2d();
    installImmediateFileReader();
    const exportDraws: Array<{ canvas: HTMLCanvasElement; selection: ArmorSelection }> = [];
    const releaseExports: Array<() => void> = [];
    vi.spyOn(armorRender, 'drawArmorLayers').mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        exportDraws.push({ canvas, selection });
        await new Promise<void>((resolve) => {
          releaseExports.push(resolve);
        });
      }
    });
    const pngCanvases: HTMLCanvasElement[] = [];
    vi.spyOn(armorRender, 'canvasToArmorPng').mockImplementation(async (canvas) => {
      pngCanvases.push(canvas as HTMLCanvasElement);
      return new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' });
    });
    vi.spyOn(window, 'confirm').mockImplementation(() => {
      throw new Error('Outfit autosave must not ask to replace a save. Received a confirm call.');
    });

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('套装 1'));
    await act(async () => {
      releaseExports[0]?.();
    });
    await waitFor(() => {
      expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toContain('"equippedPieceIds":{}');
    });

    fireEvent.click(buttonByExactName('头盔 1'));
    fireEvent.click(buttonByExactName('头盔 1'));

    expect(exportDraws[1]?.selection.equippedPieceIds.helm).toBe('male:plate:helm:1');
    expect(exportDraws[1]?.canvas.isConnected).toBe(false);
    expect(exportDraws[2]?.selection.equippedPieceIds.helm).toBeUndefined();
    expect(pngCanvases).toHaveLength(1);

    await act(async () => {
      releaseExports[1]?.();
    });

    expect(pngCanvases).toEqual([exportDraws[0]?.canvas, exportDraws[1]?.canvas]);
    const savedAfterStaleHelmWrite = localStorage.getItem(ARMOR_SAVE_STORAGE_KEY);
    expect(savedAfterStaleHelmWrite).toContain('"equippedPieceIds":{}');
    expect(savedAfterStaleHelmWrite).not.toContain('male:plate:helm:1');
    expect(screen.queryByRole('alert')).toBeNull();

    await act(async () => {
      releaseExports[2]?.();
    });

    const saved = localStorage.getItem(ARMOR_SAVE_STORAGE_KEY);
    expect(saved).toContain('"gender":"male"');
    expect(saved).toContain('"equippedPieceIds":{}');
    expect(saved).not.toContain('male:plate:helm:1');
    expect(pngCanvases).toEqual([
      exportDraws[0]?.canvas,
      exportDraws[1]?.canvas,
      exportDraws[2]?.canvas,
    ]);
    expect(buttonByExactName('头盔 1').getAttribute('aria-pressed')).toBe('false');
  });

  it('空套装的旧写回不能盖住后来的头盔写回', async () => {
    installCanvas2d();
    installImmediateFileReader();
    const exportDraws: Array<{ canvas: HTMLCanvasElement; selection: ArmorSelection }> = [];
    const releaseExports: Array<() => void> = [];
    vi.spyOn(armorRender, 'drawArmorLayers').mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        exportDraws.push({ canvas, selection });
        await new Promise<void>((resolve) => {
          releaseExports.push(resolve);
        });
      }
    });
    vi.spyOn(armorRender, 'canvasToArmorPng').mockResolvedValue(
      new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' }),
    );
    vi.spyOn(window, 'confirm').mockImplementation(() => {
      throw new Error('Outfit autosave must not ask to replace a save. Received a confirm call.');
    });

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('套装 1'));
    fireEvent.click(buttonByExactName('头盔 1'));

    expect(exportDraws[0]?.selection.equippedPieceIds).toEqual({});
    expect(exportDraws[1]?.selection.equippedPieceIds.helm).toBe('male:plate:helm:1');
    expect(buttonByExactName('头盔 1').getAttribute('aria-pressed')).toBe('true');

    await act(async () => {
      releaseExports[0]?.();
    });

    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();

    await act(async () => {
      releaseExports[1]?.();
    });

    const saved = localStorage.getItem(ARMOR_SAVE_STORAGE_KEY);
    expect(saved).toContain('male:plate:helm:1');
    expect(saved).toContain('"gender":"male"');
    expect(buttonByExactName('头盔 1').getAttribute('aria-pressed')).toBe('true');
  });

  it('套装写回还没落盘时再点同一格，不会读回旧快照', async () => {
    installCanvas2d();
    installImmediateFileReader();
    const exportDraws: ArmorSelection[] = [];
    let releaseExport = () => {};
    vi.spyOn(armorRender, 'drawArmorLayers').mockImplementation(async (context, selection) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        exportDraws.push(selection);
        await new Promise<void>((resolve) => {
          releaseExport = resolve;
        });
      }
    });
    vi.spyOn(armorRender, 'canvasToArmorPng').mockResolvedValue(
      new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' }),
    );
    vi.spyOn(window, 'confirm').mockImplementation(() => {
      throw new Error('Outfit autosave must not ask to replace a save. Received a confirm call.');
    });
    writeArmorSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'female',
        material: 'leather',
        shoulderSymmetry: true,
        chestCurve: false,
        equippedPieceIds: { chest: 'female:leather:chest:2' },
      },
      thumbnailDataUrl: 'data:image/png;base64,AAAA',
    });
    const getItem = vi.spyOn(Storage.prototype, 'getItem');

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('套装 1'));
    expect(buttonByExactName('女').getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(buttonByExactName('男'));
    expect(exportDraws).toHaveLength(1);
    expect(exportDraws[0]?.gender).toBe('male');
    expect(buttonByExactName('男').getAttribute('aria-pressed')).toBe('true');

    const storageReads = getItem.mock.calls.filter((call) => call[0] === ARMOR_SAVE_STORAGE_KEY).length;
    expect(storageReads).toBeGreaterThan(0);
    fireEvent.click(buttonByExactName('套装 1'));

    expect(buttonByExactName('男').getAttribute('aria-pressed')).toBe('true');
    expect(buttonByExactName('女').getAttribute('aria-pressed')).toBe('false');
    expect(exportDraws).toHaveLength(1);
    expect(getItem.mock.calls.filter((call) => call[0] === ARMOR_SAVE_STORAGE_KEY).length).toBe(
      storageReads,
    );
    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toContain('data:image/png;base64,AAAA');
    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toContain('"gender":"female"');
    expect(screen.queryByRole('alert')).toBeNull();

    await act(async () => {
      releaseExport();
    });

    const saved = localStorage.getItem(ARMOR_SAVE_STORAGE_KEY);
    expect(saved).toContain('"gender":"male"');
    expect(saved).not.toContain('data:image/png;base64,AAAA');
    expect(buttonByExactName('男').getAttribute('aria-pressed')).toBe('true');
  });

  it('点套装 1 会换成这一格保存的人物，并且不询问替换', async () => {
    installCanvas2d();
    vi.spyOn(armorRender, 'drawArmorLayers').mockResolvedValue(undefined);
    const canvasToPng = vi.spyOn(armorRender, 'canvasToArmorPng').mockResolvedValue(
      new Blob([Uint8Array.from([137, 80, 78, 71])], { type: 'image/png' }),
    );
    vi.spyOn(window, 'confirm').mockImplementation(() => {
      throw new Error('Outfit autosave must not ask to replace a save. Received a confirm call.');
    });
    writeArmorSaveSlot(localStorage, 1, {
      snapshot: {
        gender: 'female',
        material: 'leather',
        shoulderSymmetry: true,
        chestCurve: false,
        equippedPieceIds: {},
      },
      thumbnailDataUrl: 'data:image/png;base64,AAAA',
    });

    const savedBeforeClick = localStorage.getItem(ARMOR_SAVE_STORAGE_KEY);
    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('套装 1'));

    expect(buttonByExactName('女').getAttribute('aria-pressed')).toBe('true');
    expect(buttonByExactName('皮甲').getAttribute('aria-pressed')).toBe('true');
    expect(buttonByExactName('套装 1').getAttribute('aria-pressed')).toBe('true');
    expect(buttonByExactName('套装 2').getAttribute('aria-pressed')).toBe('false');

    await act(async () => {
      await Promise.resolve();
    });
    expect(canvasToPng).not.toHaveBeenCalled();
    expect(localStorage.getItem(ARMOR_SAVE_STORAGE_KEY)).toBe(savedBeforeClick);
    expect(savedBeforeClick).toContain('data:image/png;base64,AAAA');
    expect(savedBeforeClick).toContain('"gender":"female"');
    expect(savedBeforeClick).toContain('"material":"leather"');
  });

  it('自动保存画布失败时提示原始错误', async () => {
    installCanvas2d();
    vi.spyOn(armorRender, 'drawArmorLayers').mockImplementation(async (context) => {
      const canvas = context.canvas as HTMLCanvasElement;
      if (!canvas.isConnected) {
        throw new Error('Armor export canvas failed for outfit slot 1.');
      }
    });

    render(<ArmorCreatorWorkbench locale="zh" />);
    fireEvent.click(buttonByExactName('套装 1'));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Armor export canvas failed for outfit slot 1.',
    );
  });

  it('绘制失败时提示带上原始错误', async () => {
    installCanvas2d();
    vi.spyOn(armorRender, 'drawArmorLayers').mockRejectedValue(
      new Error('Armor piece "male:plate:helm:9" failed to draw.'),
    );

    render(<ArmorCreatorWorkbench locale="zh" />);

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Armor piece "male:plate:helm:9" failed to draw.',
    );
  });

  it('图片地址离开本站时，按钮上能看到这个地址', () => {
    vi.spyOn(armorIcons, 'armorPieceImagePath').mockReturnValue('https://r2.example.com/helm.png');

    render(<ArmorCreatorWorkbench locale="zh" />);

    expect(buttonByExactName('头盔 1').textContent).toContain('https://r2.example.com/helm.png');
    expect(buttonByExactName('头盔 1').querySelector('img')).toBeNull();
  });

  it('缩略图加载失败时能看到失败的地址', () => {
    render(<ArmorCreatorWorkbench locale="zh" />);

    const helm = pieceImage('头盔 1');
    const source = helm.getAttribute('src');
    fireEvent.error(helm);

    expect(buttonByExactName('头盔 1').textContent).toContain(source);
    expect(buttonByExactName('头盔 1').getAttribute('aria-label')).toBe('头盔 1');
  });
});
