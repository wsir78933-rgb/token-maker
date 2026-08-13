// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ChargeAndOrdinaryPanel } from './ChargeAndOrdinaryPanel';

describe('ChargeAndOrdinaryPanel', () => {
  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('filters and adds a local WebP animal charge', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="animal" selectedKind="charge" />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'lion' } });

    const lionCard = screen.getByRole('button', { name: 'Add charge: Lion Rampant' });
    expect(lionCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/animals/lion-rampant.webp');
    fireEvent.click(lionCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'material-animal-lion-rampant',
    });
  });

  it('uses the same WebP gallery behavior for an object category', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedChargeCategory="object" selectedKind="charge" />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'castle' } });
    const castleCard = screen.getByRole('button', { name: 'Add charge: Castle Tower' });
    expect(castleCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/objects/castle-tower.webp');
    fireEvent.click(castleCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'material-object-castle-tower',
    });
  });

  it('adds an ordinary from one named card without a visible Add label', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedKind="ordinary" />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search library' }), { target: { value: 'bend' } });
    const bendPreview = screen.getAllByRole('presentation').find((preview) => (
      preview.getAttribute('src') === '/coat-assets/materials/ordinaries/bend.webp'
    ));
    if (!bendPreview) throw new Error('Missing Bend WebP preview');
    expect(bendPreview.getAttribute('src')).toBe('/coat-assets/materials/ordinaries/bend.webp');
    const bendCard = screen.getByRole('button', { name: 'Add Bend' });
    expect(bendCard.textContent).toBe('Bend');
    expect(bendCard.querySelector('button')).toBeNull();
    fireEvent.click(bendCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'ordinary',
      assetId: 'material-ordinary-bend',
    });
  });
});
