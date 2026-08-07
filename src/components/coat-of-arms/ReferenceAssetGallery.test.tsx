// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ReferenceAssetGallery, matchesCatalogSearch } from './ReferenceAssetGallery';
import { listReferenceCatalogEntries } from '@/lib/coat-of-arms/reference-catalog';

describe('ReferenceAssetGallery', () => {
  afterEach(() => {
    cleanup();
  });

  it('filters the shield gallery by its localized category and local search name', () => {
    const onSelect = vi.fn();
    render(
      <ReferenceAssetGallery
        categories={['shield', 'heater']}
        locale="zh"
        onSelect={onSelect}
        section="shield"
      />,
    );

    expect(screen.getByRole('group', { name: '盾形类别' })).toBeTruthy();
    expect(screen.queryByRole('tablist')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '熨斗盾' }));
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索盾形' }), { target: { value: '尖顶' } });
    fireEvent.click(screen.getByRole('button', { name: '选择盾形：尖顶纹章盾' }));

    expect(onSelect).toHaveBeenCalledWith('pointed-heraldic-shield');
    expect(screen.getByRole('button', { name: '熨斗盾' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '选择盾形：尖顶纹章盾' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('shows and selects a single bundled WebP material outside the shield catalog', () => {
    const onSelect = vi.fn();
    render(
      <ReferenceAssetGallery
        additionalEntries={[{
          id: 'material-symbol-radiant-sun',
          name: 'Radiant Sun',
          nameZh: 'Radiant Sun',
          searchTerms: ['radiant', 'sun'],
          rasterSrc: '/coat-assets/materials/symbols/radiant-sun.webp',
        }]}
        categories={['symbol']}
        locale="en"
        onSelect={onSelect}
        section="charge"
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'radiant sun' } });
    const sunCard = screen.getByRole('button', { name: 'Add charge: Radiant Sun' });

    expect(sunCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/symbols/radiant-sun.webp');
    fireEvent.click(sunCard);
    expect(onSelect).toHaveBeenCalledWith('material-symbol-radiant-sun');
  });

  it('announces a localized empty result and rejects a category outside its section', () => {
    render(
      <ReferenceAssetGallery
        categories={['shield']}
        locale="en"
        onSelect={vi.fn()}
        section="shield"
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search shields' }), { target: { value: 'not-in-local-catalog' } });

    expect(screen.getByRole('status').textContent).toBe('No matching shields.');
    expect(() => render(
      <ReferenceAssetGallery
        categories={['animal']}
        locale="en"
        onSelect={vi.fn()}
        section="shield"
      />,
    )).toThrow('Invalid reference category for shield: animal');
  });

  it('renders a compact shield gallery without duplicate category chips or visible asset captions', () => {
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
    expect(document.querySelector('.coat-reference-asset-gallery__grid--compact clipPath')).not.toBeNull();
  });

  it('renders each compact shield card with the field it applies to the canvas', () => {
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

    expect(
      screen.getByRole('button', { name: 'Select shield: Rimmed Norman kite shield' })
        .querySelector('[data-shield-card-division="per-pale"]'),
    ).not.toBeNull();
  });

  it('renders a barry card with the same five field bands applied to the canvas', () => {
    render(
      <ReferenceAssetGallery
        categories={['heater']}
        locale="en"
        onSelect={vi.fn()}
        presentation="compact"
        section="shield"
        showCategoryFilter={false}
      />,
    );

    const barryField = screen.getByRole('button', { name: 'Select shield: Scalloped Broad heater shield' })
      .querySelector('[data-shield-card-division="barry"]');

    expect(barryField).not.toBeNull();
    expect(barryField?.querySelectorAll('rect')).toHaveLength(5);
  });

  it('uses a semantic search glyph instead of a text-symbol search marker', () => {
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

    expect(document.querySelector('.coat-target-search [data-search-glyph="true"]')).not.toBeNull();
  });

  it('matches localized, English proper-name, and English search-term catalog queries deterministically', () => {
    const pointedShield = listReferenceCatalogEntries('shield', 'heater').find((entry) => entry.id === 'pointed-heraldic-shield');
    if (!pointedShield) throw new Error('Expected pointed local shield catalog entry');

    expect(matchesCatalogSearch(pointedShield, '  尖顶  ')).toBe(true);
    expect(matchesCatalogSearch(pointedShield, 'Pointed heraldic shield')).toBe(true);
    expect(matchesCatalogSearch(pointedShield, 'heater')).toBe(true);
  });

  it('matches semantic kite shield names in English and Chinese', () => {
    const normanKiteShield = listReferenceCatalogEntries('shield', 'shield').find((entry) => entry.id === 'heraldic-shield-1');
    if (!normanKiteShield) throw new Error('Expected preserved Norman kite shield reference entry');

    expect(matchesCatalogSearch(normanKiteShield, 'norman')).toBe(true);
    expect(matchesCatalogSearch(normanKiteShield, '诺曼')).toBe(true);
  });

  it('matches semantic heater shield names in English and Chinese', () => {
    const barrelHeaterShield = listReferenceCatalogEntries('shield', 'heater').find((entry) => entry.id === 'heater-shield-2');
    if (!barrelHeaterShield) throw new Error('Expected preserved Barrel heater shield reference entry');

    expect(matchesCatalogSearch(barrelHeaterShield, 'barrel')).toBe(true);
    expect(matchesCatalogSearch(barrelHeaterShield, '桶')).toBe(true);
  });

  it('matches semantic French shield names in English and Chinese', () => {
    const bourbonFrenchShield = listReferenceCatalogEntries('shield', 'french').find((entry) => entry.id === 'french-shield-1');
    if (!bourbonFrenchShield) throw new Error('Expected preserved Bourbon French shield reference entry');

    expect(matchesCatalogSearch(bourbonFrenchShield, 'bourbon')).toBe(true);
    expect(matchesCatalogSearch(bourbonFrenchShield, '波旁')).toBe(true);
  });

  it('matches semantic Banner shield names in English and Chinese', () => {
    const pennonBannerShield = listReferenceCatalogEntries('shield', 'banner').find((entry) => entry.id === 'banner-shield-1');
    if (!pennonBannerShield) throw new Error('Expected preserved Pennon Banner shield reference entry');

    expect(matchesCatalogSearch(pennonBannerShield, 'pennon')).toBe(true);
    expect(matchesCatalogSearch(pennonBannerShield, '三角旗')).toBe(true);
  });

  it('matches semantic Round shield names in English and Chinese', () => {
    const medallionRoundShield = listReferenceCatalogEntries('shield', 'round').find((entry) => entry.id === 'round-shield-1');
    if (!medallionRoundShield) throw new Error('Expected preserved Medallion round shield reference entry');

    expect(matchesCatalogSearch(medallionRoundShield, 'medallion')).toBe(true);
    expect(matchesCatalogSearch(medallionRoundShield, '勋章')).toBe(true);
  });

  it('matches semantic Lozenge shield names in English and Chinese', () => {
    const diamondLozengeShield = listReferenceCatalogEntries('shield', 'lozenge').find((entry) => entry.id === 'lozenge-shield-1');
    if (!diamondLozengeShield) throw new Error('Expected preserved Diamond lozenge shield reference entry');

    expect(matchesCatalogSearch(diamondLozengeShield, 'diamond')).toBe(true);
    expect(matchesCatalogSearch(diamondLozengeShield, '钻形')).toBe(true);
  });

  it('matches a static WebP material by its name and terms', () => {
    const webpMaterial = {
      id: 'material-animal-lion-rampant',
      name: 'Lion Rampant',
      nameZh: 'Lion Rampant',
      searchTerms: ['lion', 'rampant'],
      rasterSrc: '/coat-assets/materials/animals/lion-rampant.webp',
    };

    expect(matchesCatalogSearch(webpMaterial, 'lion')).toBe(true);
    expect(matchesCatalogSearch(webpMaterial, 'rampant')).toBe(true);
    expect(matchesCatalogSearch(webpMaterial, 'shield')).toBe(false);
  });
});
