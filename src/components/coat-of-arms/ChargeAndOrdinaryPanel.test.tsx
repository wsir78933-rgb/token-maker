// @vitest-environment jsdom

import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ChargeAndOrdinaryPanel } from './ChargeAndOrdinaryPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

describe('ChargeAndOrdinaryPanel', () => {
  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('uses one charge search to filter reference and original gallery cards', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="animal" selectedKind="charge" />);

    expect(screen.getAllByRole('searchbox')).toHaveLength(1);
    expect(screen.queryByLabelText('Search library')).toBeNull();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'lion' } });

    expect(screen.getByRole('button', { name: 'Add charge: Lion rampant' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Add charge: Lion' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Add charge: Heraldic wolf' })).toBeNull();
  });

  it('adds the exact selected WebP symbol variant instead of silently defaulting to variant A', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="symbol" selectedKind="charge" />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'sun emblem' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add charge: Sun emblem — B' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'symbol-charge-1',
      rasterVariantId: 'b',
    });
  });

  it('finds a semantic replacement animal by English and Chinese motif, then adds its preserved asset id', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="animal" selectedKind="charge" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search charges' });
    fireEvent.change(searchbox, { target: { value: 'eagle' } });
    expect(screen.getByRole('button', { name: 'Add charge: Eagle displayed' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '鹰' } });
    const eagleCard = screen.getByRole('button', { name: 'Add charge: Eagle displayed' });
    fireEvent.click(eagleCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'animal-charge-10',
    });
  });

  it('renders original animal charges as searchable gallery cards and adds the selected asset', () => {
    const galleryCopy = getCoatWorkbenchCopy('en').palettes.referenceGallery;
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="animal" selectedKind="charge" />);

    expect(screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Lion') }).querySelectorAll('path')).toHaveLength(4);
    const wingedDragonCard = screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Winged dragon') });
    expect(wingedDragonCard.querySelectorAll('path')).toHaveLength(4);

    fireEvent.change(screen.getByRole('searchbox', { name: galleryCopy.search.charge }), { target: { value: 'winged dragon' } });

    expect(screen.queryByRole('button', { name: galleryCopy.cardAction('charge', 'Lion') })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Winged dragon') }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'charge', assetId: 'winged-dragon' });
  });

  it('uses the Chinese workbench gallery action labels for original animal charges', () => {
    const galleryCopy = getCoatWorkbenchCopy('zh').palettes.referenceGallery;
    render(<ChargeAndOrdinaryPanel locale="zh" selectedChargeCategory="animal" selectedKind="charge" />);

    expect(screen.getByRole('button', { name: galleryCopy.cardAction('charge', '狮子') })).toBeDefined();

    fireEvent.change(screen.getByRole('searchbox', { name: galleryCopy.search.charge }), { target: { value: '翼龙' } });
    fireEvent.click(screen.getByRole('button', { name: galleryCopy.cardAction('charge', '翼龙') }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'charge', assetId: 'winged-dragon' });
  });

  it('clears a selected charge card after undo removes its selected layer', () => {
    const galleryCopy = getCoatWorkbenchCopy('en').palettes.referenceGallery;
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="animal" selectedKind="charge" />);

    const wingedDragonCard = screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Winged dragon') });
    fireEvent.click(wingedDragonCard);

    const selectedLayer = useCoatProjectStore.getState().project.layers.at(-1);
    if (!selectedLayer) throw new Error('Expected selected Winged dragon layer');
    expect(selectedLayer).toMatchObject({ type: 'charge', assetId: 'winged-dragon' });
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([selectedLayer.id]);
    expect(wingedDragonCard.getAttribute('aria-pressed')).toBe('true');

    act(() => useCoatProjectStore.getState().undo());

    expect(useCoatProjectStore.getState().project.layers.some((layer) => layer.type === 'charge' && layer.assetId === 'winged-dragon')).toBe(false);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([]);
    expect(screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Winged dragon') }).getAttribute('aria-pressed')).toBe('false');
  });

  it('clears a selected charge card when an external selection is not one current-category charge', () => {
    const galleryCopy = getCoatWorkbenchCopy('en').palettes.referenceGallery;
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="animal" selectedKind="charge" />);

    const wingedDragonCardName = galleryCopy.cardAction('charge', 'Winged dragon');
    fireEvent.click(screen.getByRole('button', { name: wingedDragonCardName }));

    const projectWithWingedDragon = useCoatProjectStore.getState().project;
    const wingedDragonLayer = projectWithWingedDragon.layers.at(-1);
    const defaultNonChargeLayer = projectWithWingedDragon.layers.find((layer) => layer.type === 'background');
    if (!wingedDragonLayer || !defaultNonChargeLayer) throw new Error('Expected Winged dragon and default background layers');
    expect(screen.getByRole('button', { name: wingedDragonCardName }).getAttribute('aria-pressed')).toBe('true');

    act(() => useCoatProjectStore.getState().setSelectedLayerIds([defaultNonChargeLayer.id]));
    expect(screen.getByRole('button', { name: wingedDragonCardName }).getAttribute('aria-pressed')).toBe('false');

    act(() => useCoatProjectStore.getState().setSelectedLayerIds([defaultNonChargeLayer.id, wingedDragonLayer.id]));
    expect(screen.getByRole('button', { name: wingedDragonCardName }).getAttribute('aria-pressed')).toBe('false');
  });

  it('renders an original object charge in the controlled object gallery', () => {
    const galleryCopy = getCoatWorkbenchCopy('en').palettes.referenceGallery;
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="object" selectedKind="charge" />);

    const objectGallery = within(screen.getByRole('list', { name: galleryCopy.library.charge }));
    expect(objectGallery.getByRole('button', { name: galleryCopy.cardAction('charge', 'Tower') })).toBeDefined();
    expect(objectGallery.queryByRole('button', { name: galleryCopy.cardAction('charge', 'Lion') })).toBeNull();
  });

  it('finds a semantic replacement object by English and Chinese motif, then adds its preserved asset id', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="object" selectedKind="charge" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search charges' });
    fireEvent.change(searchbox, { target: { value: 'watchtower' } });
    expect(screen.getByRole('button', { name: 'Add charge: Watchtower' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '塔' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add charge: Watchtower' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'object-charge-1',
    });
  });

  it('finds a semantic replacement plant by English and Chinese motif, then adds its preserved asset id', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="plant" selectedKind="charge" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search charges' });
    fireEvent.change(searchbox, { target: { value: 'oak' } });
    expect(screen.getByRole('button', { name: 'Add charge: Oak sprig' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '橡' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add charge: Oak sprig' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'plant-charge-1',
    });
  });

  it('finds a semantic replacement human by English and Chinese motif, then adds its preserved asset id', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="human" selectedKind="charge" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search charges' });
    fireEvent.change(searchbox, { target: { value: 'archer' } });
    expect(screen.getByRole('button', { name: 'Add charge: Standing archer' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '弓' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add charge: Standing archer' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'human-charge-1',
    });
  });

  it('finds a semantic replacement symbol by English and Chinese motif, then adds its A WebP variant', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="symbol" selectedKind="charge" />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search charges' });
    fireEvent.change(searchbox, { target: { value: 'sun' } });
    expect(screen.getByRole('button', { name: 'Add charge: Sun emblem — A' })).toBeDefined();

    fireEvent.change(searchbox, { target: { value: '日' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add charge: Sun emblem — A' }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'symbol-charge-1',
      rasterVariantId: 'a',
    });
  });
});
