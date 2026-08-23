// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createDefaultProject, listShieldSilhouetteAssets, NEWLY_PLACED_LIBRARY_ASSET_SCALE } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand } from '@/lib/coat-of-arms/commands';
import { getFieldPatternConfigControls } from '@/lib/coat-of-arms/field-pattern';
import { resolveFieldRegions } from '@/lib/coat-of-arms/field-regions';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { ShieldFieldPanel } from './ShieldFieldPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

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

function renderDefaultEnglishPanel() {
  useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  render(<ShieldFieldPanel locale="en" />);
}

function listDivisionThumbButtons() {
  return within(screen.getByRole('region', { name: 'Division of the Field' })).getAllByRole('button');
}

function requireDetailsAccordion(title: string): HTMLDetailsElement {
  const accordion = screen.getByText(title).closest('details');
  if (!(accordion instanceof HTMLDetailsElement)) throw new Error(`Expected details accordion titled: ${title}`);
  return accordion;
}

function requireNewestCharge() {
  const addedCharge = useCoatProjectStore.getState().project.layers.at(-1);
  if (!addedCharge || addedCharge.type !== 'charge') {
    throw new Error(`Expected added escutcheon charge, got: ${addedCharge?.type ?? 'missing layer'}`);
  }
  return addedCharge;
}

function requireResolvedRegionPatternScale(regionId: 'dexter') {
  const region = resolveFieldRegions(getEditedShield().field).find((candidate) => candidate.id === regionId);
  if (!region) throw new Error(`Expected resolved field region: ${regionId}`);
  return region.style.patternScale;
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
    expect(screen.queryByRole('combobox', { name: 'Overall' })).toBeNull();
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

    fireEvent.click(screen.getByRole('button', { name: 'Barry' }));
    expect(getEditedShield().field).toMatchObject({ pattern: 'barry', colors: ['#1855A5', '#B11F24'] });
    fireEvent.click(screen.getByRole('button', { name: 'None' }));
    expect(getEditedShield().field.pattern).toBe('solid');
    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));
    expect(getEditedShield().field).toMatchObject({ division: 'per-pale', colors: ['#1855A5', '#B11F24'] });
    const dexterAccordion = screen.getByText('Dexter (Left Side)').closest('details');
    if (!dexterAccordion) throw new Error('Expected Dexter accordion');
    expect(screen.getByText('Overall (on top)')).toBeDefined();
    expect(screen.getByText('Sinister (Right Side)')).toBeDefined();
    fireEvent.click(within(dexterAccordion).getByRole('button', { name: 'Barry' }));
    expect(getEditedShield().field.regions?.dexter).toMatchObject({ pattern: 'barry' });
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

    const quarter2Accordion = screen.getByText('Quarter 2 (Upper Right)').closest('details');
    if (!quarter2Accordion) throw new Error('Expected Quarter 2 accordion');
    fireEvent.click(within(quarter2Accordion).getByRole('button', { name: 'Barry' }));

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

  it('keeps seven division thumbs and toggles Bend Sinister through per-bend-sinister', () => {
    renderDefaultEnglishPanel();

    expect(listDivisionThumbButtons()).toHaveLength(7);
    expect(screen.queryByLabelText('Bend Sinister')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Per Bend' }));

    expect(getEditedShield().field.division).toBe('per-bend');
    expect(listDivisionThumbButtons()).toHaveLength(7);
    const bendSinister = screen.getByLabelText('Bend Sinister') as HTMLInputElement;
    expect(bendSinister.checked).toBe(false);
    fireEvent.click(bendSinister);

    expect(getEditedShield().field.division).toBe('per-bend-sinister');
    expect(listDivisionThumbButtons()).toHaveLength(7);
    expect((screen.getByLabelText('Bend Sinister') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByLabelText('Bend Sinister'));

    expect(getEditedShield().field.division).toBe('per-bend');
    expect((screen.getByLabelText('Bend Sinister') as HTMLInputElement).checked).toBe(false);
  });

  it('writes a wavy division line, keeps it on Per Fess, and deletes it on Per Chevron or solid', () => {
    renderDefaultEnglishPanel();

    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));
    const divisionLineStyle = screen.getByRole('combobox', { name: 'Division Line Style' });
    fireEvent.change(divisionLineStyle, { target: { value: 'wavy' } });

    const wavyLine = getEditedShield().field.divisionLine;
    if (!wavyLine) throw new Error('Expected divisionLine after selecting Wavy');
    expect(wavyLine.style).toBe('wavy');
    expect(Number.isFinite(wavyLine.frequency)).toBe(true);
    expect(wavyLine.frequency).toBeGreaterThanOrEqual(1);
    expect(wavyLine.frequency).toBeLessThanOrEqual(30);
    expect(Number.isFinite(wavyLine.amplitude)).toBe(true);
    expect(wavyLine.amplitude).toBeGreaterThanOrEqual(1);
    expect(wavyLine.amplitude).toBeLessThanOrEqual(20);
    const keptLine = { ...wavyLine };

    fireEvent.click(screen.getByRole('button', { name: 'Per Fess' }));
    expect(getEditedShield().field.division).toBe('per-fess');
    expect(getEditedShield().field.divisionLine).toEqual(keptLine);

    fireEvent.click(screen.getByRole('button', { name: 'Per Chevron' }));
    expect(getEditedShield().field.division).toBe('per-chevron');
    expect(getEditedShield().field).not.toHaveProperty('divisionLine');

    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Division Line Style' }), { target: { value: 'wavy' } });
    expect(getEditedShield().field.divisionLine?.style).toBe('wavy');
    fireEvent.click(screen.getByRole('button', { name: 'Undivided' }));
    expect(getEditedShield().field.division).toBe('solid');
    expect(getEditedShield().field).not.toHaveProperty('divisionLine');
  });

  it('keeps a wavy division line after editing a Per Pale region variation and frequency', () => {
    renderDefaultEnglishPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Division Line Style' }), { target: { value: 'wavy' } });

    const dexterAccordion = requireDetailsAccordion('Dexter (Left Side)');
    fireEvent.click(within(dexterAccordion).getByRole('button', { name: 'Barry' }));

    expect(getEditedShield().field.divisionLine?.style).toBe('wavy');
    expect(getEditedShield().field.regions?.dexter?.pattern).toBe('barry');

    fireEvent.change(screen.getByLabelText('Division line frequency'), { target: { value: '8' } });
    expect(getEditedShield().field.regions?.dexter).toBeDefined();
    expect(getEditedShield().field.regions?.dexter?.pattern).toBe('barry');
    expect(getEditedShield().field.divisionLine).toMatchObject({ style: 'wavy', frequency: 8 });
  });

  it('does not write a division line when editing a Per Chevron region', () => {
    renderDefaultEnglishPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Per Chevron' }));

    const chevronChiefAccordion = requireDetailsAccordion('Chief (Upper Section)');
    fireEvent.click(within(chevronChiefAccordion).getByRole('button', { name: 'Barry' }));

    expect(getEditedShield().field.division).toBe('per-chevron');
    expect(getEditedShield().field).not.toHaveProperty('divisionLine');
    expect(getEditedShield().field.regions?.['chevron-chief']?.pattern).toBe('barry');
  });

  it('puts Per Pale variation in region accordions, not in Overall (on top)', () => {
    renderDefaultEnglishPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));

    const overallAccordion = requireDetailsAccordion('Overall (on top)');
    const dexterAccordion = requireDetailsAccordion('Dexter (Left Side)');
    requireDetailsAccordion('Sinister (Right Side)');
    expect(within(overallAccordion).queryByRole('region', { name: 'Variation of the Field' })).toBeNull();
    expect(within(overallAccordion).getByRole('button', { name: 'Add Charge' })).toBeDefined();
    expect(within(within(dexterAccordion).getByRole('region', { name: 'Variation of the Field' })).getAllByRole('button')).toHaveLength(17);
  });

  it('writes Keep pattern to field as patternScale 2 then 1, and hides it on Per Chevron', () => {
    renderDefaultEnglishPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));

    const dexterAccordion = requireDetailsAccordion('Dexter (Left Side)');
    const keepPattern = within(dexterAccordion).getByLabelText('Keep pattern to field') as HTMLInputElement;
    expect(keepPattern.checked).toBe(true);
    fireEvent.click(keepPattern);
    expect(getEditedShield().field.regions?.dexter?.patternScale).toBe(2);
    expect(requireResolvedRegionPatternScale('dexter')).toBe(2);

    fireEvent.click(within(dexterAccordion).getByLabelText('Keep pattern to field'));
    expect(getEditedShield().field.regions?.dexter?.patternScale ?? 1).toBe(1);
    expect(requireResolvedRegionPatternScale('dexter')).toBe(1);

    fireEvent.click(screen.getByRole('button', { name: 'Per Chevron' }));
    expect(screen.queryByLabelText('Keep pattern to field')).toBeNull();
  });

  it('exposes only engine patternConfig keys for Masoned and no Pieces control for Barry', () => {
    renderDefaultEnglishPanel();
    const copy = getCoatWorkbenchCopy('en').panels;
    const masonedControls = getFieldPatternConfigControls('masoned');
    if (masonedControls.length === 0) throw new Error('Expected Masoned patternConfig controls from the engine');

    fireEvent.click(screen.getByRole('button', { name: 'Masoned' }));
    expect(screen.getAllByRole('spinbutton')).toHaveLength(masonedControls.length);
    for (const control of masonedControls) {
      expect(screen.getByLabelText(copy.fieldPatternControl('masoned', control))).toBeDefined();
    }
    expect(screen.queryByLabelText(/pieces/i)).toBeNull();
    fireEvent.change(screen.getByLabelText(copy.fieldPatternControl('masoned', 'rows')), { target: { value: '8' } });
    expect(getEditedShield().field.pattern).toBe('masoned');
    expect(getEditedShield().field.patternConfig).toMatchObject({ rows: 8 });

    fireEvent.click(screen.getByRole('button', { name: 'Barry' }));
    expect(getEditedShield().field.pattern).toBe('barry');
    expect(getFieldPatternConfigControls('barry')).toEqual([]);
    expect(screen.queryAllByRole('spinbutton')).toHaveLength(0);
    expect(screen.queryByLabelText(/pieces/i)).toBeNull();
  });

  it('scopes a per-region Add Charge to that region at the library scale', () => {
    renderDefaultEnglishPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Per Pale' }));
    const shieldId = getEditedShield().id;
    fireEvent.click(within(requireDetailsAccordion('Dexter (Left Side)')).getByRole('button', { name: 'Add Charge' }));

    const addedCharge = requireNewestCharge();
    expect(addedCharge.transform.fieldRegionId).toBe('dexter');
    expect(addedCharge.transform.fieldShieldLayerId).toBe(shieldId);
    expect(addedCharge.transform.scale).toBe(NEWLY_PLACED_LIBRARY_ASSET_SCALE);
    expect(addedCharge.transform.clipToField).toBe(true);
  });

  it('renders bright gold and red FieldPreview colours on the division thumbs', () => {
    renderDefaultEnglishPanel();
    const previewMarkup = screen.getByRole('group', { name: 'Division of the Field' }).innerHTML;
    expect(previewMarkup).toContain('#F5E6A1');
    expect(previewMarkup).toContain('#B11F24');
    expect(previewMarkup).not.toContain('#A0822B');
    expect(previewMarkup).not.toContain('#98343A');
  });
});
