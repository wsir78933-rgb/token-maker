// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TOWN_ASSETS } from '@/lib/town-creator/catalog';
import type { TownMaterial } from '@/lib/town-creator/types';

import { readTownCategoryId, TownAssetLibrary } from './TownAssetLibrary';

const CATEGORY_COUNTS = [
  ['buildings', 'Buildings · 40', '建筑 · 40', 40],
  ['defenses', 'Defenses · 15', '城防 · 15', 15],
  ['props', 'Props · 28', '配件 · 28', 28],
  ['roads', 'Roads · 26', '道路 · 26', 26],
  ['terrain', 'Terrain · 22', '地面 · 22', 22],
  ['prefabs', 'Prefabs · 24', '预制屋 · 24', 24],
  ['nature', 'Nature · 37', '自然 · 37', 37],
] as const;

afterEach(() => {
  cleanup();
});

function renderLibrary(locale: 'en' | 'zh', selectedMaterial: TownMaterial = 'wood') {
  const onMaterialChange = vi.fn();
  const onAddAsset = vi.fn();
  const view = render(
    <TownAssetLibrary
      locale={locale}
      assets={TOWN_ASSETS}
      selectedMaterial={selectedMaterial}
      onMaterialChange={onMaterialChange}
      onAddAsset={onAddAsset}
    />,
  );
  return { ...view, onMaterialChange, onAddAsset };
}

function requireSelect(name: string): HTMLSelectElement {
  const select = screen.getByRole('combobox', { name });
  if (!(select instanceof HTMLSelectElement)) {
    throw new Error(`Expected ${JSON.stringify(name)} to be a select, received ${select.tagName}.`);
  }
  return select;
}

function assetButtons(locale: 'en' | 'zh'): HTMLButtonElement[] {
  const prefix = locale === 'zh' ? '添加到当前图层:' : 'Add to active layer:';
  return screen.getAllByRole('button', { name: new RegExp(`^${prefix}`) }).map((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      throw new Error(`Asset control is not a button, received ${button.tagName}.`);
    }
    return button;
  });
}

describe('TownAssetLibrary', () => {
  it('lists every category count and shows that category’s full asset set', () => {
    renderLibrary('en');
    const select = requireSelect('Category');
    expect(within(select).getAllByRole('option').map((option) => option.textContent)).toEqual(
      CATEGORY_COUNTS.map(([, englishLabel]) => englishLabel),
    );

    for (const [category, , , count] of CATEGORY_COUNTS) {
      fireEvent.change(select, { target: { value: category } });
      expect(assetButtons('en')).toHaveLength(count);
    }
  });

  it('uses the same seven category counts in Chinese', () => {
    renderLibrary('zh');
    const select = requireSelect('分类');
    expect(within(select).getAllByRole('option').map((option) => option.textContent)).toEqual(
      CATEGORY_COUNTS.map(([, , chineseLabel]) => chineseLabel),
    );
    expect(screen.getByRole('heading', { name: '素材' })).toBeTruthy();
  });

  it('searches English names, Chinese names, and asset IDs without dropping the other category counts', () => {
    const english = renderLibrary('en');
    fireEvent.change(screen.getByLabelText('Search assets'), { target: { value: 'buildings-house-01-cottage' } });
    expect(assetButtons('en').map((button) => button.getAttribute('aria-label'))).toEqual([
      'Add to active layer: Cottage',
    ]);
    expect(within(requireSelect('Category')).getByRole('option', { name: 'Nature · 37' })).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Search assets'), { target: { value: '小屋' } });
    expect(screen.getByRole('button', { name: 'Add to active layer: Cottage' })).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Search assets'), { target: { value: 'not-a-real-asset' } });
    expect(screen.getByText('No assets match this search.')).toBeTruthy();
    english.unmount();

    renderLibrary('zh');
    fireEvent.change(requireSelect('分类'), { target: { value: 'props' } });
    fireEvent.change(screen.getByLabelText('搜索素材'), { target: { value: 'Cottage' } });
    expect(screen.queryByRole('button', { name: '添加到当前图层: 祭坛' })).toBeNull();
    fireEvent.change(screen.getByLabelText('搜索素材'), { target: { value: '麻袋' } });
    expect(screen.getByRole('button', { name: '添加到当前图层: 麻袋' })).toBeTruthy();
  });

  it('shows neutral for fixed assets and the selected material only as a label for new assets', () => {
    const { onMaterialChange, onAddAsset, rerender } = renderLibrary('en');
    fireEvent.change(requireSelect('Category'), { target: { value: 'props' } });

    expect(screen.getByRole('button', { name: 'Add to active layer: Sack' }).textContent).toContain('Neutral');
    expect(screen.getByRole('button', { name: 'Add to active layer: Altar' }).textContent).toContain('Wood');
    expect(screen.getByText('Material changes apply to new assets only. Existing objects keep their material; fixed assets stay neutral.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Stone' }));
    expect(onMaterialChange).toHaveBeenCalledWith('stone');
    rerender(
      <TownAssetLibrary
        locale="en"
        assets={TOWN_ASSETS}
        selectedMaterial="stone"
        onMaterialChange={onMaterialChange}
        onAddAsset={onAddAsset}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add to active layer: Sack' }).textContent).toContain('Neutral');
    expect(screen.getByRole('button', { name: 'Add to active layer: Altar' }).textContent).toContain('Stone');

    const sack = TOWN_ASSETS.find((asset) => asset.id === 'props-sack');
    if (!sack) {
      throw new Error('Expected props-sack in the town catalog.');
    }
    fireEvent.click(screen.getByRole('button', { name: 'Add to active layer: Sack' }));
    expect(onAddAsset).toHaveBeenCalledWith(sack);
  });

  it('rejects a category value outside the seven library categories', () => {
    expect(readTownCategoryId('nature')).toBe('nature');
    expect(() => readTownCategoryId('glass')).toThrow(
      'Town asset category is not a library category, received "glass".',
    );
    expect(() => readTownCategoryId('')).toThrow(
      'Town asset category is not a library category, received "".',
    );
  });
});
