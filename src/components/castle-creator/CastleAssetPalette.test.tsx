// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import type {
  CastleAsset,
  CastleCategory,
  CastlePalette,
} from '@/lib/castle-creator/types';
import { CastleAssetPalette } from './CastleAssetPalette';

const testAssets: readonly CastleAsset[] = [
  { id: 'walls-1', category: 'walls', number: 1, width: 72, height: 50 },
  { id: 'walls-2', category: 'walls', number: 2, width: 72, height: 50 },
  { id: 'buildings-1', category: 'buildings', number: 1, width: 72, height: 50 },
];

vi.mock('@/lib/castle-creator/catalog', () => ({
  castleAssetImagePath: (assetId: string, palette: CastlePalette) => (
    `/castle/${assetId}-b${palette.building}-r${palette.roof}.svg`
  ),
  listCastleAssets: (category: CastleCategory) => testAssets.filter((asset) => asset.category === category),
}));

describe('CastleAssetPalette', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses localized catalogue labels and adds the same asset repeatedly', () => {
    const onAddAsset = vi.fn();
    const copy = getCastleCreatorCopy('zh');
    render(
      <CastleAssetPalette
        category="walls"
        locale="zh"
        onAddAsset={onAddAsset}
        onCategoryChange={vi.fn()}
        onPaletteChange={vi.fn()}
        palette={{ building: 1, roof: 1 }}
      />,
    );

    const addButton = screen.getByRole('button', {
      name: `${copy.library.addAsset}: ${copy.library.assetImageAlt('walls', 1)}`,
    });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(onAddAsset).toHaveBeenCalledTimes(2);
    expect(onAddAsset).toHaveBeenNthCalledWith(1, testAssets[0]);
    expect(screen.getByRole('region', { name: copy.library.heading })).toBeDefined();
    expect(screen.getByText(copy.library.mobileScrollNote)).toBeDefined();
  });

  it('closes the category sheet immediately after selection', () => {
    const onCategoryChange = vi.fn();
    render(
      <CastleAssetPalette
        category="walls"
        locale="en"
        onAddAsset={vi.fn()}
        onCategoryChange={onCategoryChange}
        onPaletteChange={vi.fn()}
        palette={{ building: 1, roof: 1 }}
      />,
    );

    const categoryButton = screen.getByRole('button', { name: 'Walls' });
    expect(categoryButton.textContent).toContain('Walls');
    fireEvent.click(categoryButton);
    const dialog = screen.getByRole('dialog');
    const buildingOptions = within(dialog).getAllByRole('radio', { name: /Buildings/ });
    fireEvent.click(buildingOptions.at(-1)!);

    expect(onCategoryChange).toHaveBeenCalledWith('buildings');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows category names and reveals the item count on hover', () => {
    const copy = getCastleCreatorCopy('en');
    render(
      <CastleAssetPalette
        category="walls"
        locale="en"
        onAddAsset={vi.fn()}
        onCategoryChange={vi.fn()}
        onPaletteChange={vi.fn()}
        palette={{ building: 1, roof: 1 }}
      />,
    );

    const wallsCategory = screen.getByRole('radio', {
      name: `Walls · ${copy.library.categoryCountLabel('walls')}`,
    });

    expect(wallsCategory.getAttribute('title')).toBe(copy.library.categoryCountLabel('walls'));
    expect(wallsCategory.textContent).toContain('Walls');
    expect(wallsCategory.textContent).not.toContain('94');
    expect(wallsCategory.textContent).not.toContain('pieces');
  });

  it('applies the active colour immediately without resetting the other palette', () => {
    const onPaletteChange = vi.fn();
    const copy = getCastleCreatorCopy('en');
    render(
      <CastleAssetPalette
        category="walls"
        locale="en"
        onAddAsset={vi.fn()}
        onCategoryChange={vi.fn()}
        onPaletteChange={onPaletteChange}
        palette={{ building: 1, roof: 5 }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: copy.library.paletteColorLabel('walls', 1) }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('radiogroup')).toHaveLength(1);
    expect(within(dialog).getAllByRole('radio')).toHaveLength(4);
    fireEvent.click(within(dialog).getByRole('radio', { name: copy.library.paletteColorLabel('walls', 2) }));

    expect(onPaletteChange).toHaveBeenCalledExactlyOnceWith({ building: 2, roof: 5 });
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(copy.library.categoryPanelReturnLabel).toBe('Back to parts');

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', {
      name: copy.library.categoryPanelReturnLabel,
    }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the shared dialog from Escape', () => {
    const copy = getCastleCreatorCopy('en');
    render(
      <CastleAssetPalette
        category="walls"
        locale="en"
        onAddAsset={vi.fn()}
        onCategoryChange={vi.fn()}
        onPaletteChange={vi.fn()}
        palette={{ building: 1, roof: 1 }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: copy.library.paletteColorLabel('walls', 1) }));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(copy.library.categoryPanelCloseLabel).toBe('Back');
  });

  it('switches the available colour group without losing either palette selection', () => {
    const copy = getCastleCreatorCopy('en');
    const onPaletteChange = vi.fn();
    const paletteProps = {
      locale: 'en' as const,
      onAddAsset: vi.fn(),
      onCategoryChange: vi.fn(),
      onPaletteChange,
      palette: { building: 4, roof: 2 } as CastlePalette,
    };
    const { rerender } = render(<CastleAssetPalette {...paletteProps} category="walls" />);

    const wallsGroup = screen.getByRole('group', { name: 'Walls · 4 colours' });
    expect(within(wallsGroup).getAllByRole('radio')).toHaveLength(4);
    expect(within(wallsGroup).getByRole('radio', {
      name: copy.library.paletteColorLabel('walls', 4),
    }).getAttribute('aria-checked')).toBe('true');

    rerender(<CastleAssetPalette {...paletteProps} category="buildingRoofs" />);
    expect(screen.queryByRole('group', { name: 'Walls · 4 colours' })).toBeNull();
    const roofGroup = screen.getByRole('group', { name: 'Building roofs · 5 colours' });
    expect(within(roofGroup).getAllByRole('radio')).toHaveLength(5);
    expect(within(roofGroup).getByRole('radio', {
      name: copy.library.paletteColorLabel('buildingRoofs', 2),
    }).getAttribute('aria-checked')).toBe('true');

    rerender(<CastleAssetPalette {...paletteProps} category="walls" />);
    expect(screen.queryByRole('group', { name: 'Building roofs · 5 colours' })).toBeNull();
    expect(screen.getByRole('radio', {
      name: copy.library.paletteColorLabel('walls', 4),
    }).getAttribute('aria-checked')).toBe('true');
    expect(onPaletteChange).not.toHaveBeenCalled();
  });

  it('offers five roof colours in the Chinese mobile sheet and preserves the building colour', () => {
    const copy = getCastleCreatorCopy('zh');
    const onPaletteChange = vi.fn();
    render(
      <CastleAssetPalette
        category="buildingRoofs"
        locale="zh"
        onAddAsset={vi.fn()}
        onCategoryChange={vi.fn()}
        onPaletteChange={onPaletteChange}
        palette={{ building: 4, roof: 1 }}
      />,
    );

    fireEvent.click(screen.getByRole('button', {
      name: copy.library.paletteColorLabel('buildingRoofs', 1),
    }));
    const dialog = screen.getByRole('dialog', { name: '建筑屋顶配色 · 5 色' });
    expect(within(dialog).getAllByRole('radiogroup')).toHaveLength(1);
    expect(within(dialog).getAllByRole('radio')).toHaveLength(5);
    fireEvent.click(within(dialog).getByRole('radio', { name: '建筑屋顶配色 5' }));

    expect(onPaletteChange).toHaveBeenCalledExactlyOnceWith({ building: 4, roof: 5 });
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('explains the fixed door colours only when the gates category is active', () => {
    const paletteProps = {
      locale: 'zh' as const,
      onAddAsset: vi.fn(),
      onCategoryChange: vi.fn(),
      onPaletteChange: vi.fn(),
      palette: { building: 1, roof: 5 } as CastlePalette,
    };
    const { rerender } = render(<CastleAssetPalette {...paletteProps} category="gates" />);

    const gateGroup = screen.getByRole('group', { name: '城门配色 · 4 色' });
    expect(within(gateGroup).getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByText('门件保持原色。')).toBeDefined();

    rerender(<CastleAssetPalette {...paletteProps} category="walls" />);
    expect(screen.queryByText('门件保持原色。')).toBeNull();
  });

  it('reports the concrete failed image path instead of leaving a blank card', () => {
    const copy = getCastleCreatorCopy('en');
    const onAddAsset = vi.fn();
    const { container } = render(
      <CastleAssetPalette
        category="walls"
        locale="en"
        onAddAsset={onAddAsset}
        onCategoryChange={vi.fn()}
        onPaletteChange={vi.fn()}
        palette={{ building: 1, roof: 1 }}
      />,
    );

    const image = container.querySelector('img');
    if (!image) throw new Error('Expected a castle asset image in the palette.');
    fireEvent.error(image);

    expect(screen.getByRole('alert').textContent).toContain('/castle/walls-1-b1-r1.svg');
    expect(screen.getByRole('alert').className).toContain('max-h-10');
    expect(screen.getByRole('alert').className).toContain('shrink-0');
    expect(screen.getByRole('alert').className).toContain('overflow-y-auto');
    expect(screen.getByRole('img', { name: '/castle/walls-1-b1-r1.svg' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', {
      name: `${copy.library.addAsset}: ${copy.library.assetImageAlt('walls', 2)}`,
    }));
    expect(onAddAsset).toHaveBeenCalledWith(testAssets[1]);
    expect(copy.library.assetImageAlt('walls', 1)).toBe('Walls part 1');
  });
});
