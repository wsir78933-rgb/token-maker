// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ReferenceAssetGallery, matchesCatalogSearch } from './ReferenceAssetGallery';
import { shieldReferenceCategories } from '@/lib/coat-of-arms/reference-catalog';

describe('ReferenceAssetGallery', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps all six shield category controls while every material list is empty', () => {
    const onSelect = vi.fn();
    render(
      <ReferenceAssetGallery
        categories={shieldReferenceCategories}
        locale="en"
        onSelect={onSelect}
        section="shield"
      />,
    );

    for (const categoryName of ['Heraldic shields', 'Heater shields', 'French shields', 'Banner shields', 'Round shields', 'Lozenge shields']) {
      fireEvent.click(screen.getByRole('button', { name: categoryName }));
      expect(screen.getByRole('status').textContent).toBe('No matching shields.');
      expect(screen.queryByRole('button', { name: /^Select shield:/ })).toBeNull();
    }
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('localizes the empty shield material state in Chinese', () => {
    render(
      <ReferenceAssetGallery
        categories={['shield']}
        locale="zh"
        onSelect={vi.fn()}
        section="shield"
      />,
    );

    expect(screen.getByRole('status').textContent).toBe('没有匹配的盾形。');
    expect(screen.queryByRole('button', { name: /^选择盾形：/ })).toBeNull();
  });

  it('shows and selects a single bundled WebP material outside the shield catalog', () => {
    const onSelect = vi.fn();
    render(
      <ReferenceAssetGallery
        additionalEntries={[{
          id: 'material-symbol-eternal-flame',
          name: 'Eternal Flame',
          nameZh: 'Eternal Flame',
          searchTerms: ['eternal', 'flame'],
          rasterSrc: '/coat-assets/materials/symbols/eternal-flame.webp',
        }]}
        categories={['symbol']}
        locale="en"
        onSelect={onSelect}
        section="charge"
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'eternal flame' } });
    const sunCard = screen.getByRole('button', { name: 'Add charge: Eternal Flame' });

    expect(sunCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/symbols/eternal-flame.webp');
    expect(sunCard.className).toContain('coat-gallery-card');
    expect(sunCard.getAttribute('aria-label')).toBe('Add charge: Eternal Flame');
    const hoverName = sunCard.querySelector('.coat-gallery-card-name');
    expect(hoverName?.textContent).toBe('Eternal Flame');
    expect(hoverName?.getAttribute('aria-hidden')).toBe('true');
    fireEvent.click(sunCard);
    expect(onSelect).toHaveBeenCalledWith('material-symbol-eternal-flame');
  });

  it('renders raster materials one page at a time and resets pagination after filter changes', () => {
    render(
      <ReferenceAssetGallery
        additionalEntries={createRasterMaterialEntries(25)}
        categories={['animal', 'object']}
        locale="en"
        onSelect={vi.fn()}
        section="charge"
      />,
    );

    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(24);
    expect(screen.getByRole('button', { name: 'Load more' })).toBeTruthy();
    expect(document.querySelector('.coat-reference-asset-gallery img')?.getAttribute('loading')).toBe('lazy');
    expect(document.querySelector('.coat-reference-asset-gallery img')?.getAttribute('decoding')).toBe('async');
    expect(document.querySelector('.coat-reference-asset-gallery img')?.getAttribute('width')).toBe('100');
    expect(document.querySelector('.coat-reference-asset-gallery img')?.getAttribute('height')).toBe('110');

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(25);

    fireEvent.click(screen.getByRole('button', { name: 'Objects' }));
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(24);
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(25);

    fireEvent.click(screen.getByRole('button', { name: 'Animals' }));
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(24);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'raster' } });
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(24);
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(25);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: '' } });
    expect(document.querySelectorAll('.coat-reference-asset-gallery img')).toHaveLength(24);
  });

  it('localizes the raster material pagination control', () => {
    render(
      <ReferenceAssetGallery
        additionalEntries={createRasterMaterialEntries(25)}
        categories={['animal']}
        locale="zh"
        onSelect={vi.fn()}
        section="charge"
      />,
    );

    expect(screen.getByRole('button', { name: '加载更多' })).toBeTruthy();
  });

  it('rejects a category outside its section', () => {
    expect(() => render(
      <ReferenceAssetGallery
        categories={['animal']}
        locale="en"
        onSelect={vi.fn()}
        section="shield"
      />,
    )).toThrow('Invalid reference category for shield: animal');
  });

  it('renders supplied shield entries through the same selection boundary', () => {
    render(
      <ReferenceAssetGallery
        additionalEntries={[{
          id: 'unexpected-shield-card',
          name: 'Unexpected shield card',
          nameZh: '意外盾形卡片',
          searchTerms: ['unexpected'],
        }]}
        categories={['shield']}
        locale="en"
        onSelect={vi.fn()}
        section="shield"
      />,
    );

    expect(screen.getByRole('button', { name: 'Select shield: Unexpected shield card' })).toBeDefined();
  });

  it('renders an empty compact shield gallery without duplicate category controls or previews', () => {
    render(
      <ReferenceAssetGallery
        categories={['shield']}
        locale="en"
        onSelect={vi.fn()}
        presentation="compact"
        section="shield"
        showCategoryFilter={false}
      />,
    );

    expect(screen.queryByRole('group', { name: 'Shield categories' })).toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery--compact')).not.toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery__grid--compact')).not.toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery__caption')).toBeNull();
    expect(document.querySelector('.coat-reference-asset-gallery__grid--compact clipPath')).toBeNull();
    expect(document.querySelector('.coat-target-search [data-search-glyph="true"]')).not.toBeNull();
  });

  it('overlays compact card names on hover without a rest caption', () => {
    render(
      <ReferenceAssetGallery
        additionalEntries={[{
          id: 'heater-shield',
          name: 'Heater shield',
          nameZh: '熨斗盾',
          searchTerms: ['heater'],
          rasterSrc: '/coat-assets/materials/shields/heater.webp',
        }]}
        categories={['shield']}
        locale="en"
        onSelect={vi.fn()}
        presentation="compact"
        section="shield"
        showCategoryFilter={false}
      />,
    );

    const shieldCard = screen.getByRole('button', { name: 'Select shield: Heater shield' });
    expect(shieldCard.className).toContain('coat-gallery-card');
    expect(shieldCard.querySelector('.coat-gallery-card-name')?.textContent).toBe('Heater shield');
  });

  it('matches a static WebP material by its name and terms', () => {
    const webpMaterial = {
      id: 'material-animal-wolf-rampant',
      name: 'Wolf Rampant',
      nameZh: 'Wolf Rampant',
      searchTerms: ['wolf', 'rampant'],
      rasterSrc: '/coat-assets/materials/animals/wolf-rampant.webp',
    };

    expect(matchesCatalogSearch(webpMaterial, 'wolf')).toBe(true);
    expect(matchesCatalogSearch(webpMaterial, 'rampant')).toBe(true);
    expect(matchesCatalogSearch(webpMaterial, 'shield')).toBe(false);
  });
});

function createRasterMaterialEntries(entryCount: number) {
  return Array.from({ length: entryCount }, (_, index) => ({
    id: `raster-material-${index + 1}`,
    name: `Raster material ${index + 1}`,
    nameZh: `光栅素材 ${index + 1}`,
    searchTerms: ['raster'],
    rasterSrc: `/coat-assets/materials/raster-${index + 1}.webp`,
  }));
}
