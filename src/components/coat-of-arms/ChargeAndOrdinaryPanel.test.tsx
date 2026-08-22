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

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'wolf' } });

    const lionCard = screen.getByRole('button', { name: 'Add charge: Wolf Rampant' });
    expect(lionCard.querySelector('img')?.getAttribute('src')).toBe('/coat-assets/materials/animals/wolf-rampant.webp');
    fireEvent.click(lionCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'material-animal-wolf-rampant',
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

  it('adds an ordinary from a hover-name gallery card without a visible Add label', () => {
    render(<ChargeAndOrdinaryPanel locale="en" selectedKind="ordinary" />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search library' }), { target: { value: 'gusset' } });
    const gussetPreview = screen.getAllByRole('presentation').find((preview) => (
      preview.getAttribute('src') === '/coat-assets/materials/ordinaries/gusset.webp'
    ));
    if (!gussetPreview) throw new Error('Missing Gusset WebP preview');
    expect(gussetPreview.getAttribute('src')).toBe('/coat-assets/materials/ordinaries/gusset.webp');
    const gussetCard = screen.getByRole('button', { name: 'Add Gusset' });
    expect(gussetCard.className).toContain('coat-gallery-card');
    expect(gussetCard.getAttribute('aria-label')).toBe('Add Gusset');
    const hoverName = gussetCard.querySelector('.coat-gallery-card-name');
    expect(hoverName?.textContent).toBe('Gusset');
    expect(hoverName?.getAttribute('aria-hidden')).toBe('true');
    expect(gussetCard.querySelector('button')).toBeNull();
    fireEvent.click(gussetCard);

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'ordinary',
      assetId: 'material-ordinary-gusset',
    });
  });
});
