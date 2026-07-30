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

  it('shows and selects each original WebP alternative for a replaced symbol material', () => {
    const onSelect = vi.fn();
    render(
      <ReferenceAssetGallery
        categories={['symbol']}
        locale="en"
        onSelect={onSelect}
        section="charge"
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'sun emblem' } });
    const variantA = screen.getByRole('button', { name: 'Add charge: Sun emblem — A' });
    const variantB = screen.getByRole('button', { name: 'Add charge: Sun emblem — B' });

    expect(variantA.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/generated/symbols/symbol-sun-plain-a.webp');
    expect(variantB.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/generated/symbols/symbol-sun-plain-b.webp');
    fireEvent.click(variantB);
    expect(onSelect).toHaveBeenCalledWith('symbol-charge-1', 'b');
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

  it('matches semantic animal motif, pose, and Chinese motif queries', () => {
    const animalEntries = listReferenceCatalogEntries('charge', 'animal');
    const lion = animalEntries.find((entry) => entry.id === 'lion-rampant');
    const eagle = animalEntries.find((entry) => entry.id === 'animal-charge-10');
    if (!lion || !eagle) throw new Error('Expected preserved semantic animal reference entries');

    expect(matchesCatalogSearch(lion, 'lion')).toBe(true);
    expect(matchesCatalogSearch(eagle, 'eagle')).toBe(true);
    expect(matchesCatalogSearch(eagle, '鹰')).toBe(true);
  });

  it('matches semantic object motif and Chinese object queries', () => {
    const watchtower = listReferenceCatalogEntries('charge', 'object').find((entry) => entry.id === 'object-charge-1');
    if (!watchtower) throw new Error('Expected preserved watchtower reference entry');

    expect(matchesCatalogSearch(watchtower, 'watchtower')).toBe(true);
    expect(matchesCatalogSearch(watchtower, '塔')).toBe(true);
  });

  it('matches semantic plant motif and Chinese plant queries', () => {
    const oakSprig = listReferenceCatalogEntries('charge', 'plant').find((entry) => entry.id === 'plant-charge-1');
    if (!oakSprig) throw new Error('Expected preserved oak sprig reference entry');

    expect(matchesCatalogSearch(oakSprig, 'oak')).toBe(true);
    expect(matchesCatalogSearch(oakSprig, '橡')).toBe(true);
  });

  it('matches semantic human motif and Chinese human queries', () => {
    const standingArcher = listReferenceCatalogEntries('charge', 'human').find((entry) => entry.id === 'human-charge-1');
    if (!standingArcher) throw new Error('Expected preserved standing archer reference entry');

    expect(matchesCatalogSearch(standingArcher, 'archer')).toBe(true);
    expect(matchesCatalogSearch(standingArcher, '弓')).toBe(true);
  });

  it('matches semantic symbol motif and Chinese symbol queries', () => {
    const sunEmblem = listReferenceCatalogEntries('charge', 'symbol').find((entry) => entry.id === 'symbol-charge-1');
    if (!sunEmblem) throw new Error('Expected preserved sun emblem reference entry');

    expect(matchesCatalogSearch(sunEmblem, 'sun')).toBe(true);
    expect(matchesCatalogSearch(sunEmblem, '日')).toBe(true);
  });

  it('matches semantic crown motif and Chinese crown queries', () => {
    const imperialCrown = listReferenceCatalogEntries('top', 'crown').find((entry) => entry.id === 'crown-exterior-1');
    if (!imperialCrown) throw new Error('Expected preserved imperial crown reference entry');

    expect(matchesCatalogSearch(imperialCrown, 'imperial')).toBe(true);
    expect(matchesCatalogSearch(imperialCrown, '帝')).toBe(true);
  });

  it('matches semantic mantle motif and Chinese mantle queries', () => {
    const regalMantle = listReferenceCatalogEntries('top', 'mantle').find((entry) => entry.id === 'mantle-exterior-1');
    if (!regalMantle) throw new Error('Expected preserved regal mantle reference entry');

    expect(matchesCatalogSearch(regalMantle, 'regal')).toBe(true);
    expect(matchesCatalogSearch(regalMantle, '王')).toBe(true);
  });

  it('matches semantic supporter motif and Chinese supporter queries', () => {
    const stagSupporters = listReferenceCatalogEntries('top', 'supporter').find((entry) => entry.id === 'supporter-exterior-1');
    if (!stagSupporters) throw new Error('Expected preserved stag supporters reference entry');

    expect(matchesCatalogSearch(stagSupporters, 'stag')).toBe(true);
    expect(matchesCatalogSearch(stagSupporters, '鹿')).toBe(true);
  });

  it('matches semantic exterior motif and Chinese exterior queries', () => {
    const tournamentHelm = listReferenceCatalogEntries('top', 'other').find((entry) => entry.id === 'other-exterior-1');
    if (!tournamentHelm) throw new Error('Expected preserved tournament helm reference entry');

    expect(matchesCatalogSearch(tournamentHelm, 'tournament')).toBe(true);
    expect(matchesCatalogSearch(tournamentHelm, '盔')).toBe(true);
  });
});
