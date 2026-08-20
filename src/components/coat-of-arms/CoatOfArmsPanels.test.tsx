// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createDefaultProject } from '@/lib/coat-of-arms/assets';
import { applyProjectCommand, COAT_PROJECT_LIMITS } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatProject } from '@/lib/coat-of-arms/types';
import { CoatOfArmsPanels } from './CoatOfArmsPanels';
import { createValidatedLocalUpload, validateLocalUploadFile } from './UploadPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

let nextId = 0;

function projectWithTwoRedLayers(): CoatProject {
  const withLion = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
  const withStar = applyProjectCommand(withLion, { type: 'add-layer', assetId: 'material-symbol-eight-point-star' });
  return {
    ...withStar,
    layers: withStar.layers.map((layer) => (
      layer.type === 'charge' ? { ...layer, color: '#B11F24' } : layer
    )),
  };
}

function projectWithRegionalAndStructuralShieldColours(): CoatProject {
  const project = createDefaultProject('en');
  const shield = project.layers.find((layer) => layer.type === 'shield');
  if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

  return applyProjectCommand(project, {
    type: 'set-field',
    layerId: shield.id,
    field: {
      ...shield.field,
      division: 'quarterly',
      colors: ['#1855A5', '#F5E6A1'],
      regions: {
        q1: { colors: ['#123456'], pattern: 'solid' },
        q2: { colors: ['#234567', '#345678'], pattern: 'stripes' },
      },
      ornaments: [{
        id: 'colour-swatch-ornament', kind: 'fess', color: '#456789',
        colors: ['#56789A', '#6789AB'], colorAmplitudes: [1, 2],
        x: 0, y: 0, scale: 1, rotation: 0,
      }],
      outline: { visible: true, color: '#789ABC', width: 2 },
    },
  });
}

function renderPanels(localeOrProject: 'en' | 'zh' | CoatProject = 'en', project?: CoatProject) {
  const locale = typeof localeOrProject === 'string' ? localeOrProject : localeOrProject.locale;
  const currentProject = typeof localeOrProject === 'string'
    ? project ?? createDefaultProject(locale)
    : localeOrProject;
  useCoatProjectStore.getState().replaceProject(currentProject);
  return render(<CoatOfArmsPanels locale={locale} />);
}

function getLayer(layerId: string) {
  const layer = useCoatProjectStore.getState().project.layers.find((candidate) => candidate.id === layerId);
  if (!layer) throw new Error(`Expected layer ${layerId}`);
  return layer;
}

function findAssetLayerIndex(assetId: string): number {
  return useCoatProjectStore.getState().project.layers.findIndex((layer) => (
    'assetId' in layer && layer.assetId === assetId
  ));
}

function revealAllGalleryCards(locale: 'en' | 'zh') {
  const loadMoreLabel = locale === 'zh' ? '加载更多' : 'Load more';
  while (true) {
    const loadMoreButtons = screen.queryAllByRole('button', { name: loadMoreLabel });
    if (loadMoreButtons.length === 0) return;
    loadMoreButtons.forEach((button) => fireEvent.click(button));
  }
}

describe('CoatOfArmsPanels', () => {
  beforeEach(() => {
    nextId = 0;
    vi.stubGlobal('crypto', { randomUUID: () => `panel-id-${nextId++}` });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('adds a charge from the library and exposes it in layers', async () => {
    renderPanels();
    revealAllGalleryCards('en');

    const lionCard = screen.getByRole('button', { name: getCoatWorkbenchCopy('en').palettes.referenceGallery.cardAction('charge', 'Lion Rampant') });
    expect(lionCard.querySelector('img')).not.toBeNull();
    fireEvent.click(lionCard);

    expect(screen.getByRole('listitem', { name: /lion/i })).toBeDefined();
  });

  it('adds the selected Lion Rampant WebP material as an independent layer', () => {
    renderPanels();
    revealAllGalleryCards('en');

    fireEvent.click(screen.getByRole('button', { name: 'Add charge: Lion Rampant' }));

    expect(useCoatProjectStore.getState().project.layers.filter((layer) => (
      layer.type === 'charge' && layer.assetId === 'material-animal-lion-rampant'
    ))).toHaveLength(1);
  });

  it('labels a local freehand vector layer as a drawing rather than an uploaded image', () => {
    const projectWithDrawing = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-drawing-layer', path: 'M 10 20 L 30 40', color: '#004E89', strokeWidth: 3,
    });
    renderPanels(projectWithDrawing);

    expect(screen.getByRole('listitem', { name: 'Drawing' })).toBeDefined();
  });

  it('uses English-only panel labels and accessible controls', () => {
    renderPanels('en');
    revealAllGalleryCards('en');

    expect(screen.getByRole('heading', { name: 'Custom Shield Uploads' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Select escutcheon: Heater shield' })).toBeDefined();
    expect(screen.getByRole('button', { name: getCoatWorkbenchCopy('en').palettes.referenceGallery.cardAction('charge', 'Lion Rampant') })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Add motto' })).toBeDefined();
    expect(screen.getByRole('list', { name: 'Coat layers' })).toBeDefined();
    expect((screen.getByLabelText('Motto text') as HTMLInputElement).value).toBe('FORTUNE FAVOURS');
  });

  it('uses Chinese-only panel labels and accessible controls', () => {
    renderPanels('zh');
    revealAllGalleryCards('zh');

    expect(screen.getByRole('heading', { name: '自定义盾形上传' })).toBeDefined();
    expect(screen.getByRole('button', { name: '选择盾形：熨斗盾' })).toBeDefined();
    expect(screen.getByRole('button', { name: getCoatWorkbenchCopy('zh').palettes.referenceGallery.cardAction('charge', 'Lion Rampant') })).toBeDefined();
    expect(screen.getByRole('button', { name: '添加格言' })).toBeDefined();
    expect(screen.getByRole('list', { name: '徽章图层' })).toBeDefined();
  });

  it('uses a Chinese default motto rather than the English default', () => {
    renderPanels('zh');

    expect((screen.getByLabelText('格言文字') as HTMLInputElement).value).toBe('勇气与荣耀');
  });

  it('matches the displayed local upload limit before reading a file', () => {
    renderPanels('en');

    expect(screen.getByText(/maximum 256 KB/i)).toBeDefined();
    expect(() => validateLocalUploadFile({
      name: 'oversized.png', type: 'image/png', size: COAT_PROJECT_LIMITS.maxLocalUploadBytes + 1,
    })).toThrow(`Invalid upload file size: ${COAT_PROJECT_LIMITS.maxLocalUploadBytes + 1}`);

    cleanup();
    renderPanels('zh');
    expect(screen.getByText(/最大 256 KB/)).toBeDefined();
  });

  it('creates a browser-local custom shield upload from a validated SVG file', async () => {
    const file = new File([
      '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="110" fill="white"/></svg>',
    ], 'shield-mask.svg', { type: 'image/svg+xml' });

    await expect(createValidatedLocalUpload(file)).resolves.toMatchObject({
      id: 'panel-id-0', mimeType: 'image/svg+xml', encoding: 'base64',
    });
  });

  it('searches the ordinary catalogue and adds a random local charge', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText(/library category/i), { target: { value: 'ordinary' } });
    fireEvent.change(screen.getByLabelText(/search library/i), { target: { value: 'chevron' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Chevron' }));
    fireEvent.change(screen.getByLabelText(/library category/i), { target: { value: 'charge' } });
    vi.spyOn(Math, 'random').mockReturnValue(0);
    fireEvent.click(screen.getByRole('button', { name: /add random charge/i }));

    expect(useCoatProjectStore.getState().project.layers.slice(-2)).toMatchObject([
      { type: 'ordinary', assetId: 'material-ordinary-chevron' }, { type: 'charge', assetId: 'material-animal-alligator-passant' },
    ]);
  });

  it('filters original charge gallery cards by their heraldic category', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText('Charge category'), { target: { value: 'plant' } });
    revealAllGalleryCards('en');

    const galleryCopy = getCoatWorkbenchCopy('en').palettes.referenceGallery;
    expect(screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Oak Leaf') })).toBeDefined();
    expect(screen.queryByRole('button', { name: galleryCopy.cardAction('charge', 'Lion Rampant') })).toBeNull();
  });

  it('renders a searchable original charge as a gallery card', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText('Charge category'), { target: { value: 'plant' } });
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'oak' } });

    const galleryCopy = getCoatWorkbenchCopy('en').palettes.referenceGallery;
    expect(screen.getByRole('button', { name: galleryCopy.cardAction('charge', 'Oak Leaf') }).querySelector('img')).not.toBeNull();
    expect(screen.queryByRole('button', { name: galleryCopy.cardAction('charge', 'Lion Rampant') })).toBeNull();
  });

  it('uses localized gallery action labels for bundled WebP charge cards in Chinese', () => {
    renderPanels('zh');
    revealAllGalleryCards('zh');

    const lionCard = screen.getByRole('button', { name: getCoatWorkbenchCopy('zh').palettes.referenceGallery.cardAction('charge', 'Lion Rampant') });
    expect(lionCard.querySelector('img')).not.toBeNull();
  });

  it('finds a bundled charge from its search terms', () => {
    renderPanels();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search charges' }), { target: { value: 'rampant' } });

    expect(screen.getByRole('button', { name: getCoatWorkbenchCopy('en').palettes.referenceGallery.cardAction('charge', 'Lion Rampant') })).toBeDefined();
  });

  it('updates every matching colour when the replace-colour action is confirmed', async () => {
    renderPanels(projectWithTwoRedLayers());

    fireEvent.change(screen.getByLabelText(/replace colour from/i), { target: { value: '#B11F24' } });
    fireEvent.change(screen.getByLabelText(/replace colour with/i), { target: { value: '#004E89' } });
    fireEvent.click(screen.getByRole('button', { name: /replace all colours/i }));

    const charges = useCoatProjectStore.getState().project.layers.filter((layer) => layer.type === 'charge');
    expect(charges.map((layer) => layer.color)).toEqual(['#004E89', '#004E89']);
  });

  it('lists colours authored by every shield region, structural ornament, and outline', () => {
    renderPanels(projectWithRegionalAndStructuralShieldColours());

    const usedColours = within(screen.getByRole('list', { name: 'Used colours' }));
    for (const colour of ['#123456', '#234567', '#345678', '#456789', '#56789A', '#6789AB', '#789ABC']) {
      expect(usedColours.getByText(colour)).toBeDefined();
    }
  });

  it('edits the background fill independently from its selected library base', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText('Custom background colour'), { target: { value: '#004E89' } });

    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', assetId: 'ivory-background', fill: '#004e89' });
  });

  it('updates the whole layer colour for a static WebP ornament without exposing SVG part controls', () => {
    const withCrown = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-crown-royal-crown' });
    const crown = withCrown.layers.at(-1);
    if (!crown || crown.type !== 'top') throw new Error('Expected crown layer');
    renderPanels(withCrown);

    expect(screen.queryByLabelText(`Colour for ${crown.id} part #F5E6A1`)).toBeNull();
    fireEvent.change(screen.getByLabelText(`Colour for ${crown.id}`), { target: { value: '#1855A5' } });

    expect(getLayer(crown.id)).toMatchObject({ color: '#1855a5' });
    expect(getLayer(crown.id)).not.toHaveProperty('colorReplacements');
  });

  it('uses commands to update shield fields, backgrounds, text, and local layers', async () => {
    renderPanels();
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    fireEvent.click(screen.getByRole('button', { name: 'Select escutcheon: Round shield' }));
    fireEvent.change(screen.getByLabelText(/background motif/i), { target: { value: 'dots' } });
    fireEvent.click(screen.getByLabelText(/transparent export background/i));
    fireEvent.click(screen.getByLabelText(/background visible/i));
    fireEvent.change(screen.getByLabelText(/motto text/i), { target: { value: 'FORTUNE' } });
    fireEvent.click(screen.getByRole('button', { name: /add motto/i }));

    expect(getLayer(shield.id)).toMatchObject({ assetId: 'round-shield' });
    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', motif: 'dots', opacity: 0, visible: false });
    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'text', text: 'FORTUNE' });
  });

  it('exposes a direct local custom shield upload control', () => {
    renderPanels();

    expect(screen.getByLabelText('Upload custom shield mask')).toBeDefined();
  });

  it('uploads a custom shield mask locally and selects it for the shield', async () => {
    renderPanels();
    const shield = useCoatProjectStore.getState().project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const file = new File([
      '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="110" fill="white"/></svg>',
    ], 'shield-mask.svg', { type: 'image/svg+xml' });

    fireEvent.change(screen.getByLabelText('Upload custom shield mask'), { target: { files: [file] } });

    await waitFor(() => {
      const uploadedMaskId = useCoatProjectStore.getState().project.uploads[0]?.id;
      expect(uploadedMaskId).toBeDefined();
      expect(getLayer(shield.id)).toMatchObject({ type: 'shield', customMaskUploadId: uploadedMaskId });
    });
    expect(useCoatProjectStore.getState().project.uploads).toHaveLength(1);
  });

  it('does not expose crop editor controls for a selected layer', () => {
    const project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const lion = project.layers.at(-1);
    if (!lion) throw new Error('Expected lion charge');
    renderPanels(project);
    fireEvent.click(screen.getByLabelText(new RegExp(`Select layer ${lion.id}`)));

    expect(screen.getByRole('group', { name: 'Position' })).toBeDefined();
    expect(screen.queryByRole('group', { name: 'Flip selected layer' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Flip & crop' })).toBeNull();
    expect(screen.queryByLabelText('Crop left')).toBeNull();
    expect(screen.queryByLabelText('Crop top')).toBeNull();
    expect(screen.queryByLabelText('Crop width')).toBeNull();
    expect(screen.queryByLabelText('Crop height')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Reset crop' })).toBeNull();
  });

  it('sets a selected charge’s precise field region and clipping in the position controls', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const shield = project.layers.find((layer) => layer.type === 'shield');
    const lion = project.layers.at(-1);
    if (!shield || shield.type !== 'shield' || !lion || lion.type !== 'charge') throw new Error('Expected shield and lion charge');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: { ...shield.field, division: 'per-fess', colors: ['#1855A5', '#F5E6A1'] },
    });
    renderPanels(project);
    fireEvent.click(screen.getByLabelText(new RegExp(`Select layer ${lion.id}`)));

    fireEvent.change(screen.getByLabelText('Field placement'), { target: { value: 'chief' } });
    fireEvent.click(screen.getByLabelText('Clip charge to field'));

    expect(getLayer(lion.id)).toMatchObject({ transform: { fieldRegionId: 'chief', clipToField: true } });
  });

  it('offers the current shield division’s detailed regions for local charge clipping', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const shield = project.layers.find((layer) => layer.type === 'shield');
    const lion = project.layers.at(-1);
    if (!shield || shield.type !== 'shield' || !lion || lion.type !== 'charge') throw new Error('Expected shield and lion charge');
    project = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: { ...shield.field, division: 'per-bend', colors: ['#1855A5', '#F5E6A1'] },
    });
    renderPanels(project);
    fireEvent.click(screen.getByLabelText(new RegExp(`Select layer ${lion.id}`)));

    fireEvent.change(screen.getByLabelText('Field placement'), { target: { value: 'bend-lower' } });

    expect(getLayer(lion.id)).toMatchObject({ transform: { fieldRegionId: 'bend-lower' } });
  });

  it('applies local canvas dimensions through the settings panel', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText('Width'), { target: { value: '1600' } });
    fireEvent.change(screen.getByLabelText('Height'), { target: { value: '900' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(useCoatProjectStore.getState().project.canvas).toEqual({ width: 1600, height: 900 });
  });

  it('makes the extended target background patterns available in background controls', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText('Background motif'), { target: { value: 'papelonny' } });

    expect(useCoatProjectStore.getState().project.layers[0]).toMatchObject({ type: 'background', motif: 'papelonny' });
  });

  it('shows command validation errors from invalid colour and text inputs', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText(/custom palette colour/i), { target: { value: 'not-a-colour' } });
    fireEvent.click(screen.getByRole('button', { name: /save custom colour/i }));
    expect(screen.getByRole('alert').textContent).toMatch(/not-a-colour/i);

    fireEvent.change(screen.getByLabelText(/typography size/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /add motto/i }));
    expect(screen.getAllByRole('alert').at(-1)?.textContent).toMatch(/0/);
  });

  it('keeps Chinese panel validation errors localized while preserving the invalid value', () => {
    renderPanels('zh');

    fireEvent.change(screen.getByLabelText('自定义调色板颜色'), { target: { value: 'not-a-colour' } });
    fireEvent.click(screen.getByRole('button', { name: '保存自定义颜色' }));

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('编辑操作失败');
    expect(alert.textContent).toContain('not-a-colour');
    expect(alert.textContent).not.toContain('Invalid custom palette color');
  });

  it('creates a ring text layer with its chosen typography controls', () => {
    renderPanels();

    fireEvent.change(screen.getByLabelText(/motto text/i), { target: { value: 'RING' } });
    fireEvent.change(screen.getByLabelText(/typography size/i), { target: { value: '32' } });
    fireEvent.change(screen.getByLabelText(/text path/i), { target: { value: 'ring-clockwise' } });
    fireEvent.click(screen.getByRole('button', { name: /add motto/i }));

    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({
      type: 'text', text: 'RING', fontSize: 32, path: { mode: 'ring', curve: 'clockwise' },
    });
  });

  it('shows the group-contiguity command error instead of silently changing layers', async () => {
    const project = ['material-animal-lion-rampant', 'material-symbol-eight-point-star', 'material-object-castle-tower'].reduce(
      (current, assetId) => applyProjectCommand(current, { type: 'add-layer', assetId }),
      createDefaultProject('en'),
    );
    renderPanels(project);
    const layerIds = useCoatProjectStore.getState().project.layers.slice(-3).map((layer) => layer.id);

    fireEvent.click(screen.getByLabelText(new RegExp(`Select layer ${layerIds[0]}`)));
    fireEvent.click(screen.getByLabelText(new RegExp(`Select layer ${layerIds[2]}`)));
    fireEvent.click(screen.getByRole('button', { name: 'Group selected layers' }));

    expect(screen.getByRole('alert').textContent).toMatch(/non-contiguous/i);
    expect(useCoatProjectStore.getState().project.groups).toEqual([]);
  });

  it('shows group opacity only for a selected single group and updates that group without changing layer opacity', () => {
    const withLion = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    const withPair = applyProjectCommand(withLion, { type: 'add-layer', assetId: 'material-symbol-eight-point-star' });
    const groupLayerIds = withPair.layers.slice(-2).map((layer) => layer.id);
    const groupedProject = applyProjectCommand(withPair, {
      type: 'group-layers', groupId: 'opacity-group', layerIds: groupLayerIds,
    });
    renderPanels(groupedProject);

    expect(screen.queryByLabelText('Group opacity')).toBeNull();

    fireEvent.click(screen.getByLabelText(new RegExp(`Select layer ${groupLayerIds[0]}`)));
    const opacityInput = screen.getByLabelText('Group opacity') as HTMLInputElement;
    expect(opacityInput.value).toBe('100');
    const firstLayerBeforeOpacityChange = getLayer(groupLayerIds[0]);
    const secondLayerBeforeOpacityChange = getLayer(groupLayerIds[1]);

    fireEvent.change(opacityInput, { target: { value: '35' } });

    expect(useCoatProjectStore.getState().project.groups).toContainEqual({ id: 'opacity-group', opacity: 0.35 });
    expect(getLayer(groupLayerIds[0])).toEqual(firstLayerBeforeOpacityChange);
    expect(getLayer(groupLayerIds[1])).toEqual(secondLayerBeforeOpacityChange);
  });

  it('uses an ordinary list and unique layer action names', () => {
    renderPanels(projectWithTwoRedLayers());

    expect(screen.getByRole('list', { name: /coat layers/i })).toBeDefined();
    expect(screen.getByRole('listitem', { name: /lion/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /move lion .*up/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /hide lion/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /lock lion/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /delete lion/i })).toBeDefined();
  });

  it('renames a layer from the list and uses the new name for later actions', () => {
    renderPanels(projectWithTwoRedLayers());

    fireEvent.change(screen.getByLabelText('Rename Lion Rampant'), { target: { value: 'Dexter lion' } });
    fireEvent.blur(screen.getByLabelText('Rename Lion Rampant'));

    const renamedLayer = useCoatProjectStore.getState().project.layers.find((layer) => (
      'assetId' in layer && layer.assetId === 'material-animal-lion-rampant'
    ));
    expect(renamedLayer).toMatchObject({ displayName: 'Dexter lion' });
    expect(screen.getByRole('listitem', { name: 'Dexter lion' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Move Dexter lion up' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Move Lion Rampant up' })).toBeNull();
  });

  it('moves a charge toward and away from the visual top in project paint order', () => {
    renderPanels(projectWithTwoRedLayers());

    fireEvent.click(screen.getByRole('button', { name: 'Move Lion Rampant up' }));

    expect(findAssetLayerIndex('material-animal-lion-rampant')).toBe(3);
    expect(findAssetLayerIndex('material-symbol-eight-point-star')).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'Move Lion Rampant down' }));

    expect(findAssetLayerIndex('material-animal-lion-rampant')).toBe(2);
    expect(findAssetLayerIndex('material-symbol-eight-point-star')).toBe(3);
  });

  it('moves a grouped layer as one contiguous block in the layer panel', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-lion-rampant' });
    project = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-symbol-eight-point-star' });
    project = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-plant-oak-leaf' });
    const groupedLayerIds = project.layers.slice(2, 4).map((layer) => layer.id);
    project = applyProjectCommand(project, { type: 'group-layers', groupId: 'panel-group', layerIds: groupedLayerIds });
    renderPanels(project);

    fireEvent.click(screen.getByRole('button', { name: 'Move Lion Rampant up' }));

    expect(useCoatProjectStore.getState().project.layers.slice(2).map((layer) => (
      'assetId' in layer ? layer.assetId : layer.type
    ))).toEqual(['material-plant-oak-leaf', 'material-animal-lion-rampant', 'material-symbol-eight-point-star']);
  });

  it('rejects unsafe client upload metadata before it can dispatch an image command', async () => {
    renderPanels();
    const input = screen.getByLabelText(/upload crest image/i);
    const unsafeFile = new File(['<svg><script>alert(1)</script></svg>'], 'unsafe.svg', { type: 'image/svg+xml' });

    fireEvent.change(input, { target: { files: [unsafeFile] } });

    expect((await screen.findByRole('alert')).textContent).toMatch(/unsafe|svg/i);
    expect(useCoatProjectStore.getState().project.uploads).toHaveLength(0);
  });

  it('keeps Chinese upload validation errors localized without exposing raw SVG errors', async () => {
    renderPanels('zh');
    const unsafeFile = new File(['<svg><script>alert(1)</script></svg>'], 'unsafe.svg', { type: 'image/svg+xml' });

    fireEvent.change(screen.getByLabelText('上传徽章图片'), { target: { files: [unsafeFile] } });

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('编辑操作失败');
    expect(alert.textContent).not.toContain('Unsafe local SVG content');
    expect(useCoatProjectStore.getState().project.uploads).toHaveLength(0);
  });

  it('rejects malformed SVG before it persists an upload', async () => {
    renderPanels();
    const malformedSvg = new File(['<svg><path d="M0 0">'], 'broken.svg', { type: 'image/svg+xml' });

    fireEvent.change(screen.getByLabelText(/upload crest image/i), { target: { files: [malformedSvg] } });

    expect((await screen.findByRole('alert')).textContent).toMatch(/svg|xml|malformed/i);
    expect(useCoatProjectStore.getState().project.uploads).toHaveLength(0);
  });

  it('rejects a signature-shaped raster that the browser cannot decode before persistence', async () => {
    vi.stubGlobal('createImageBitmap', async () => { throw new Error('image decode failed'); });
    renderPanels();
    const corruptPng = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'broken.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText(/upload crest image/i), { target: { files: [corruptPng] } });

    expect((await screen.findByRole('alert')).textContent).toMatch(/decode|image/i);
    expect(useCoatProjectStore.getState().project.uploads).toHaveLength(0);
  });

  it('decodes and adds a valid local raster image layer', async () => {
    vi.stubGlobal('createImageBitmap', async () => ({ close: () => undefined }));
    renderPanels();
    const png = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'crest.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText(/upload crest image/i), { target: { files: [png] } });

    expect((await screen.findByRole('status')).textContent).toMatch(/added local image/i);
    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'image', mimeType: 'image/png' });
  });

  it('adds every selected local image in one atomic upload action', async () => {
    renderPanels();
    const firstSvg = new File([
      '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="gold"/></svg>',
    ], 'sun.svg', { type: 'image/svg+xml' });
    const secondSvg = new File([
      '<svg xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L90 10 L50 90 Z" fill="navy"/></svg>',
    ], 'mountain.svg', { type: 'image/svg+xml' });
    const input = screen.getByLabelText(/upload crest image/i) as HTMLInputElement;

    expect(input.multiple).toBe(true);
    fireEvent.change(input, { target: { files: [firstSvg, secondSvg] } });

    await waitFor(() => {
      const project = useCoatProjectStore.getState().project;
      expect(project.uploads).toHaveLength(2);
      expect(project.layers.filter((layer) => layer.type === 'image')).toHaveLength(2);
    });
    expect(useCoatProjectStore.getState().history.past).toHaveLength(1);
    expect(screen.getByRole('status').textContent).toMatch(/added 2 local images/i);
  });

  it('keeps the upload library unchanged when one selected file is unsafe', async () => {
    renderPanels();
    const validSvg = new File([
      '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="green"/></svg>',
    ], 'safe.svg', { type: 'image/svg+xml' });
    const unsafeSvg = new File([
      '<svg><script>alert(1)</script></svg>',
    ], 'unsafe.svg', { type: 'image/svg+xml' });

    fireEvent.change(screen.getByLabelText(/upload crest image/i), { target: { files: [validSvg, unsafeSvg] } });

    expect((await screen.findByRole('alert')).textContent).toMatch(/unsafe|svg/i);
    expect(useCoatProjectStore.getState().project.uploads).toHaveLength(0);
    expect(useCoatProjectStore.getState().project.layers.filter((layer) => layer.type === 'image')).toHaveLength(0);
    expect(useCoatProjectStore.getState().history.past).toHaveLength(0);
  });

  it('reuses an existing local upload as another image layer', () => {
    let project = createDefaultProject('en');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'reusable-crest', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      },
    });
    project = applyProjectCommand(project, { type: 'add-image-layer', uploadId: 'reusable-crest' });
    renderPanels(project);

    fireEvent.click(screen.getByRole('button', { name: 'Add local image 1' }));

    expect(useCoatProjectStore.getState().project.layers.filter((layer) => (
      layer.type === 'image' && layer.uploadId === 'reusable-crest'
    ))).toHaveLength(2);
  });

  it('removes an unreferenced local upload from the upload library', () => {
    let project = createDefaultProject('en');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'unused-crest', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      },
    });
    renderPanels(project);

    fireEvent.click(screen.getByRole('button', { name: 'Remove local upload 1' }));

    expect(useCoatProjectStore.getState().project.uploads).toEqual([]);
    expect(screen.queryByRole('listitem', { name: 'Local upload 1 (image/svg+xml)' })).toBeNull();
  });

  it('keeps a referenced upload listed and reports its removal failure', () => {
    let project = createDefaultProject('en');
    project = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'referenced-crest', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      },
    });
    project = applyProjectCommand(project, { type: 'add-image-layer', uploadId: 'referenced-crest' });
    renderPanels(project);

    fireEvent.click(screen.getByRole('button', { name: 'Remove local upload 1' }));

    expect(screen.getByRole('alert').textContent).toContain('Local upload is still referenced by an image layer: referenced-crest');
    expect(screen.getByRole('listitem', { name: 'Local upload 1 (image/svg+xml)' })).toBeDefined();
    expect(useCoatProjectStore.getState().project.uploads.map((upload) => upload.id)).toEqual(['referenced-crest']);
  });
});
