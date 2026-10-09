// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { castleSaveStorageKey, readCastleSaveSlot } from '@/lib/castle-creator/saves';
import { serializeCastleProject } from '@/lib/castle-creator/project-file';
import { createCastleProject } from '@/lib/castle-creator/project';
import type { CastleProject } from '@/lib/castle-creator/types';
import { CastleCreatorWorkbench } from './CastleCreatorWorkbench';

vi.mock('@/lib/castle-creator/catalog', () => ({
  getCastleAsset: (assetId: string) => ({
    id: assetId,
    category: 'walls',
    number: 1,
    width: 200,
    height: 100,
  }),
  listCastleAssets: () => [],
  castleAssetImagePath: (assetId: string) => `/castle/${assetId}.svg`,
}));

vi.mock('./CastleAssetPalette', () => ({
  CastleAssetPalette: ({ onAddAsset }: { onAddAsset: (asset: { id: string; category: 'walls'; number: number; width: number; height: number }) => void }) => (
    <button
      type="button"
      data-castle-test-add
      onClick={() => onAddAsset({ id: 'wall-1', category: 'walls', number: 1, width: 200, height: 100 })}
    >
      Add test asset
    </button>
  ),
}));

vi.mock('./CastleCanvas', () => ({
  CastleCanvas: ({ project, selectedPieceId, onResizePiece }: {
    project: CastleProject;
    selectedPieceId: string | null;
    onResizePiece(pieceId: string, width: number): void;
  }) => (
    <div role="application" aria-label="Castle preview" data-castle-test-canvas>
      {selectedPieceId && project.resizeEnabled ? (
        <button type="button" onClick={() => onResizePiece(selectedPieceId, 1200)}>Resize test piece</button>
      ) : null}
    </div>
  ),
}));

vi.mock('./CastleSettingsPanel', () => ({
  CastleSettingsPanel: ({ onClearAll }: { onClearAll: () => void }) => (
    <button type="button" onClick={onClearAll}>Clear all test</button>
  ),
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('CastleCreatorWorkbench', () => {
  it.each([
    { locale: 'en' as const, sizeLabel: 'Size', resizeToggle: 'Allow resizing: On' },
    { locale: 'zh' as const, sizeLabel: '大小', resizeToggle: '允许缩放: 开' },
  ])('resizes proportionally with the $locale size slider and respects the resizing switch', async ({ locale, sizeLabel, resizeToggle }) => {
    const { container } = render(<CastleCreatorWorkbench locale={locale} />);
    fireEvent.click(container.querySelector('[data-castle-test-add]') as HTMLButtonElement);
    const sizeSlider = screen.getByRole('slider', { name: sizeLabel });
    expect(sizeSlider.getAttribute('aria-valuetext')).toBe('100%');
    fireEvent.change(sizeSlider, { target: { value: '300' } });
    expect(sizeSlider.getAttribute('aria-valuetext')).toBe('150%');

    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);
    const firstSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) throw new Error('First castle save slot is missing.');
    fireEvent.click(firstSlot.querySelector('button') as HTMLButtonElement);
    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());
    expect(readCastleSaveSlot(window.localStorage, 1)?.project.pieces[0]).toMatchObject({
      width: 300,
      height: 150,
      x: 400,
      y: 267.5,
      layerId: 'lower',
      buildingColor: 1,
      roofColor: 1,
    });

    fireEvent.click(screen.getByRole('button', { name: resizeToggle }));
    expect((sizeSlider as HTMLInputElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('tab', { name: locale === 'en' ? 'Edit' : '编辑' }));
    const mobileAndDesktopSliders = screen.getAllByRole('slider', { name: sizeLabel });
    expect(mobileAndDesktopSliders.length).toBe(2);
    expect(mobileAndDesktopSliders.every((slider) => (slider as HTMLInputElement).disabled)).toBe(true);
  });

  it('represents sizes beyond 400% and keeps the slider range stable while shrinking', () => {
    const { container } = render(<CastleCreatorWorkbench locale="en" />);
    fireEvent.click(container.querySelector('[data-castle-test-add]') as HTMLButtonElement);
    fireEvent.click(screen.getByRole('button', { name: 'Resize test piece' }));
    const sizeSlider = screen.getByRole('slider', { name: 'Size' }) as HTMLInputElement;
    expect(sizeSlider.value).toBe('1200');
    expect(sizeSlider.max).toBe('1200');
    expect(sizeSlider.getAttribute('aria-valuetext')).toBe('600%');
    fireEvent.change(sizeSlider, { target: { value: '600' } });
    expect(sizeSlider.value).toBe('600');
    expect(sizeSlider.max).toBe('1200');
  });

  it('opens the five-slot manager for the first save and stores a readable record', async () => {
    const { container } = render(<CastleCreatorWorkbench locale="en" />);
    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(document.body.querySelectorAll('[data-castle-save-slot]').length).toBe(5);

    const firstSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) throw new Error('First castle save slot is missing.');
    fireEvent.click(firstSlot.querySelector('button') as HTMLButtonElement);

    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());
    const record = readCastleSaveSlot(window.localStorage, 1);
    expect(record?.slotNumber).toBe(1);
    expect(record?.project.pieces.length).toBe(0);
  });

  it('saves directly to the active slot on repeat save and preserves the five-slot contract', async () => {
    const { container } = render(<CastleCreatorWorkbench locale="en" />);
    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);
    const firstSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) throw new Error('First castle save slot is missing.');
    fireEvent.click(firstSlot.querySelector('button') as HTMLButtonElement);
    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());

    fireEvent.click(container.querySelector('[data-castle-test-add]') as HTMLButtonElement);
    await waitFor(() => expect(container.querySelector('[data-castle-status-row]')?.textContent).toContain('1 pieces'));
    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);

    await waitFor(() => {
      const record = readCastleSaveSlot(window.localStorage, 1);
      expect(record?.project.pieces.length).toBe(1);
    });
    expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull();
  });

  it('clears the active slot when importing a valid editable project file', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { container } = render(<CastleCreatorWorkbench locale="en" />);
    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);
    const firstSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) throw new Error('First castle save slot is missing.');
    fireEvent.click(firstSlot.querySelector('button') as HTMLButtonElement);
    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());

    fireEvent.click(container.querySelector('[data-castle-action="project-files"]') as HTMLButtonElement);
    const input = screen.getByLabelText('Project file');
    const file = new File([serializeCastleProject(createCastleProject())], 'castle-project.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const quickSaveButton = container.querySelector('[data-castle-action="quick-save"]');
      expect(quickSaveButton?.getAttribute('aria-label')).toBe('Save');
    });
  });

  it('requires overwrite confirmation before repairing a corrupted slot', async () => {
    window.localStorage.setItem(castleSaveStorageKey(1), '{broken');
    const { container } = render(<CastleCreatorWorkbench locale="en" />);
    fireEvent.click(container.querySelector('[data-castle-action="browser-saves"]') as HTMLButtonElement);

    const firstSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) throw new Error('First castle save slot is missing.');
    expect(firstSlot.textContent).toContain('invalid JSON syntax');
    const saveButton = firstSlot.querySelector('button');
    if (!(saveButton instanceof HTMLButtonElement)) throw new Error('Corrupted slot save button is missing.');
    expect(saveButton.disabled).toBe(false);
    fireEvent.click(saveButton);

    expect(document.body.querySelector('[data-castle-overwrite-confirmation]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm overwrite' }));

    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());
    const repairedRecord = readCastleSaveSlot(window.localStorage, 1);
    expect(repairedRecord?.slotNumber).toBe(1);
    expect(repairedRecord?.project.pieces.length).toBe(0);
  });

  it('keeps the loaded slot active after clearing pieces so quick save remains direct', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { container } = render(<CastleCreatorWorkbench locale="en" />);
    fireEvent.click(container.querySelector('[data-castle-test-add]') as HTMLButtonElement);
    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);
    const firstSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(firstSlot instanceof HTMLElement)) throw new Error('First castle save slot is missing.');
    fireEvent.click(firstSlot.querySelector('button') as HTMLButtonElement);
    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());

    fireEvent.click(container.querySelector('[data-castle-action="browser-saves"]') as HTMLButtonElement);
    const loadedSlot = document.body.querySelector('[data-castle-save-slot="1"]');
    if (!(loadedSlot instanceof HTMLElement)) throw new Error('Loaded castle save slot is missing.');
    fireEvent.click(loadedSlot.querySelectorAll('button')[1] as HTMLButtonElement);
    await waitFor(() => expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull());

    fireEvent.click(screen.getByRole('button', { name: 'Clear all test' }));
    await waitFor(() => expect(container.querySelector('[data-castle-status-row]')?.textContent).toContain('0 pieces'));
    fireEvent.click(container.querySelector('[data-castle-action="quick-save"]') as HTMLButtonElement);

    await waitFor(() => {
      const record = readCastleSaveSlot(window.localStorage, 1);
      expect(record?.project.pieces.length).toBe(0);
    });
    expect(document.body.querySelector('[data-castle-dialog="saves"]')).toBeNull();
  });

  it('moves mobile tab focus with consecutive ArrowRight navigation', () => {
    render(<CastleCreatorWorkbench locale="en" />);
    const tabs = screen.getAllByRole('tab');
    const [partsTab, editTab, settingsTab] = tabs;

    partsTab.focus();
    fireEvent.keyDown(partsTab, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(editTab);
    expect(editTab.getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(editTab, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(settingsTab);
    expect(settingsTab.getAttribute('aria-selected')).toBe('true');
  });
});
