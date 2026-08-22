// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject, listShieldSilhouetteAssets, NEWLY_PLACED_LIBRARY_ASSET_SCALE } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { resolveFieldRegions } from '@/lib/coat-of-arms/field-regions';
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

  it('renders the reference escutcheon panel structure and all 17 silhouette assets', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    const panel = screen.getByRole('region', { name: 'Shield & field' });
    const library = screen.getByText('Escutcheon').closest('details');
    const silhouetteButtons = screen.getAllByRole('button', { name: /^Select escutcheon:/ });

    expect(panel.classList.contains('coat-escutcheon-panel')).toBe(true);
    expect(screen.getByLabelText('Editing: Escutcheon 1').classList.contains('coat-escutcheon-editing-card')).toBe(true);
    const addEscutcheonButton = screen.getByRole('button', { name: 'Add New Escutcheon' });
    expect(addEscutcheonButton.classList.contains('coat-escutcheon-add-button')).toBe(true);
    expect(addEscutcheonButton.querySelector('svg')).not.toBeNull();
    expect(library).not.toBeNull();
    expect(library?.classList.contains('coat-escutcheon-library')).toBe(true);
    expect(screen.getByRole('group', { name: 'Escutcheon shapes' }).classList.contains('coat-escutcheon-grid')).toBe(true);
    expect(listShieldSilhouetteAssets()).toHaveLength(17);
    expect(silhouetteButtons).toHaveLength(17);
    expect(silhouetteButtons.every((button) => button.classList.contains('coat-escutcheon-option'))).toBe(true);
  });

  it('keeps the escutcheon library collapsible and exposes the custom upload card', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    const library = screen.getByText('Escutcheon').closest('details');
    if (!library) throw new Error('Expected the escutcheon library details element');
    expect(library.open).toBe(true);
    fireEvent.click(screen.getByText('Escutcheon'));
    expect(library.open).toBe(false);

    expect(screen.getByRole('heading', { name: 'Custom Shield Uploads' }).closest('div')?.classList.contains('coat-custom-shield-uploads')).toBe(true);
  });

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

    fireEvent.click(screen.getByRole('button', { name: 'Add New Escutcheon' }));

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
    fireEvent.click(screen.getByRole('button', { name: 'Add New Escutcheon' }));
    const firstShield = listShieldLayers()[0];
    if (!firstShield) throw new Error('Expected first shield layer');

    act(() => useCoatProjectStore.getState().setSelectedLayerIds([firstShield.id]));

    expect(screen.getByLabelText('Editing: Escutcheon 1')).toBeDefined();
  });

  it('renders the Custom division and variation controls with the required choices', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    const divisionSection = screen.getByRole('region', { name: 'Division of the Field' });
    const variationSection = screen.getByRole('region', { name: 'Variation of the Field' });
    expect(screen.getByRole('combobox', { name: 'Overall' })).toBeDefined();
    expect(within(divisionSection).getAllByRole('button')).toHaveLength(7);
    expect(within(variationSection).getAllByRole('button')).toHaveLength(17);
    expect(screen.getByRole('region', { name: 'Colors' })).toBeDefined();
    expect(screen.getByRole('region', { name: 'Charges' })).toBeDefined();
    expect(screen.getByLabelText('Line Width').getAttribute('min')).toBe('0');
    expect(screen.getByLabelText('Line Width').getAttribute('max')).toBe('25');
    expect((screen.getByLabelText('Show Border') as HTMLInputElement).checked).toBe(true);
  });

  it('dispatches validated divisions and all 17 variation choices to the edited escutcheon', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));
    expect(getEditedShield().field).toMatchObject({ division: 'per-pale', colors: ['#1855A5', '#B11F24'] });
    fireEvent.click(screen.getByRole('button', { name: 'Barry' }));
    expect(getEditedShield().field).toMatchObject({ pattern: 'barry', colors: ['#1855A5', '#B11F24'] });
    fireEvent.click(screen.getByRole('button', { name: 'None' }));
    expect(getEditedShield().field.pattern).toBe('solid');
    expect(getEditedShield().field.colors).toHaveLength(2);
  });

  it('preserves inherited quarterly regions when editing one explicit target', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const quarterlyProject = applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: {
        division: 'quarterly', colors: ['#1855A5', '#B11F24'], pattern: 'solid',
        regions: { q1: { colors: ['#123456'], pattern: 'solid' } },
      },
    });
    useCoatProjectStore.getState().replaceProject(quarterlyProject);
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Overall' }), { target: { value: 'q2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Barry' }));

    const editedShield = getEditedShield();
    expect(editedShield.field.regions).toEqual(expect.objectContaining({ q1: expect.any(Object), q2: expect.any(Object) }));
    expect(editedShield.field.regions).not.toHaveProperty('q3');
    expect(editedShield.field.regions).not.toHaveProperty('q4');
    const parentChanged = applyProjectCommand(useCoatProjectStore.getState().project, {
      type: 'set-field', layerId: editedShield.id,
      field: { ...editedShield.field, colors: ['#ABCDEF', '#FEDCBA'] },
    });
    const parentChangedShield = parentChanged.layers.find((layer): layer is typeof editedShield => layer.id === editedShield.id);
    if (!parentChangedShield || parentChangedShield.type !== 'shield') throw new Error('Expected changed shield layer');
    const resolvedRegions = resolveFieldRegions(parentChangedShield.field);
    expect(resolvedRegions.find((region) => region.id === 'q3')?.style.colors).toEqual(['#FEDCBA']);
    expect(resolvedRegions.find((region) => region.id === 'q4')?.style.colors).toEqual(['#ABCDEF']);
  });

  it('scopes embedded colors and charges to the edited escutcheon', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);
    const shieldId = getEditedShield().id;

    fireEvent.change(screen.getByLabelText('Escutcheon colour: #1855A5'), { target: { value: '#123456' } });
    expect(getEditedShield().field.colors).toContain('#123456');
    fireEvent.click(screen.getByRole('button', { name: 'Add Charge' }));

    const addedCharge = useCoatProjectStore.getState().project.layers.at(-1);
    expect(addedCharge).toMatchObject({
      type: 'charge',
      transform: {
        scale: NEWLY_PLACED_LIBRARY_ASSET_SCALE,
        fieldShieldLayerId: shieldId,
        fieldRegionId: 'overall',
        clipToField: true,
      },
    });
    if (!addedCharge || addedCharge.type !== 'charge') {
      throw new Error(`Expected added escutcheon charge, got: ${addedCharge?.type ?? 'missing layer'}`);
    }
    expect(addedCharge.transform.scale).toBe(NEWLY_PLACED_LIBRARY_ASSET_SCALE);
    expect(NEWLY_PLACED_LIBRARY_ASSET_SCALE).toBe(0.6);
    expect(useCoatProjectStore.getState().selectedLayerIds).toEqual([shieldId]);
  });

  it('persists the 0-25 line width and border visibility controls', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.change(screen.getByLabelText('Line Width'), { target: { value: '25' } });
    expect(getEditedShield().field.outline).toMatchObject({ width: 25, visible: true });
    fireEvent.click(screen.getByLabelText('Show Border'));
    expect(getEditedShield().field.outline).toMatchObject({ width: 25, visible: false });
  });

  it('keeps the displayed default line width when toggling the border', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    const lineWidth = screen.getByLabelText('Line Width') as HTMLInputElement;
    expect(lineWidth.value).toBe('9');
    fireEvent.click(screen.getByLabelText('Show Border'));

    expect(getEditedShield().field.outline).toMatchObject({ width: 9, visible: false });
  });

  it('uses the effective overall target after switching to another shield', () => {
    const project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'round-shield' });
    const secondShield = project.layers.at(-1);
    if (!secondShield || secondShield.type !== 'shield') throw new Error('Expected second shield layer');
    useCoatProjectStore.getState().replaceProject(project);
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Per Cross' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Overall' }), { target: { value: 'q1' } });
    act(() => useCoatProjectStore.getState().setSelectedLayerIds([secondShield.id]));
    fireEvent.click(screen.getByRole('button', { name: 'Barry' }));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(getEditedShield().field.pattern).toBe('barry');
  });

  it('keeps an embedded charge attached to the second edited escutcheon', () => {
    useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
    render(<ShieldFieldPanel locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Add New Escutcheon' }));
    const secondShield = getEditedShield();
    fireEvent.click(screen.getByRole('button', { name: 'Add Charge' }));

    const addedCharge = useCoatProjectStore.getState().project.layers.at(-1);
    expect(addedCharge).toMatchObject({
      type: 'charge',
      transform: {
        scale: NEWLY_PLACED_LIBRARY_ASSET_SCALE,
        fieldShieldLayerId: secondShield.id,
      },
    });
    expect(screen.getByLabelText('Editing: Escutcheon 2')).toBeDefined();
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
