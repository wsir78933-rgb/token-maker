// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ShieldFieldPanel } from './ShieldFieldPanel';

function listShieldLayers() {
  return useCoatProjectStore.getState().project.layers.filter((layer) => layer.type === 'shield');
}

function getEditedShield() {
  const selectedLayerIds = useCoatProjectStore.getState().selectedLayerIds;
  const shieldLayers = listShieldLayers();
  const selectedShield = shieldLayers.find((layer) => selectedLayerIds.includes(layer.id));
  const shield = selectedShield ?? shieldLayers[0];
  if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
  return shield;
}

describe('ShieldFieldPanel escutcheon chrome', () => {
  afterEach(() => cleanup());

  it('shows Editing: Escutcheon 1 with the heater silhouette pressed on a default project', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    expect(screen.getByLabelText('Editing: Escutcheon 1')).toBeDefined();
    expect(screen.getByText('Editing:')).toBeDefined();
    expect(screen.getByText('Escutcheon 1')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Select escutcheon: Heater shield' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('applies the Round shield silhouette to the edited escutcheon', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Select escutcheon: Round shield' }));

    expect(getEditedShield().assetId).toBe('round-shield');
  });

  it('adds a second heater escutcheon, selects it, and shows Editing: Escutcheon 2', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: '+ Add New Escutcheon' }));

    const shieldLayers = listShieldLayers();
    const newestShield = shieldLayers.at(-1);
    if (!newestShield || newestShield.type !== 'shield') throw new Error('Expected newest shield layer');
    expect(shieldLayers).toHaveLength(2);
    expect(newestShield.assetId).toBe('heater-shield');
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([newestShield.id]);
    expect(screen.getByLabelText('Editing: Escutcheon 2')).toBeDefined();
  });

  it('shows Editing: Escutcheon 1 after the first shield is selected in the store', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: '+ Add New Escutcheon' }));
    const firstShield = listShieldLayers()[0];
    if (!firstShield) throw new Error('Expected first shield layer');

    act(() => useCoatProjectStore.getState().setSelectedLayerIds([firstShield.id]));

    expect(screen.getByLabelText('Editing: Escutcheon 1')).toBeDefined();
  });

  it('keeps only the Custom Shield Uploads file control and omits field extras', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    expect(screen.getByRole('heading', { name: 'Custom Shield Uploads' })).toBeDefined();
    expect(screen.getByText('Upload your own shield outline')).toBeDefined();
    expect(screen.getByLabelText('Upload custom shield mask')).toBeDefined();
    expect(screen.queryByLabelText('Custom shield mask')).toBeNull();
    expect(screen.queryByLabelText('Outline source')).toBeNull();
    expect(screen.queryByLabelText('Field division')).toBeNull();
    expect(screen.queryByLabelText('Field ornament')).toBeNull();
    expect(screen.queryByLabelText('Shield border width')).toBeNull();
  });

  it('clears a custom mask when a library silhouette is picked', () => {
    let project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'image-mask', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIi8+PC9zdmc+',
      },
    });
    project = applyProjectCommand(project, {
      type: 'set-custom-shield-mask', layerId: shield.id, uploadId: 'image-mask',
    });
    useCoatProjectStore.getState().replaceProject(project);
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Select escutcheon: Round shield' }));

    expect(getEditedShield().assetId).toBe('round-shield');
    expect(getEditedShield()).not.toHaveProperty('customMaskUploadId');
  });
});
