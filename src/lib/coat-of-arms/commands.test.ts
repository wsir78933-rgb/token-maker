import { describe, expect, it } from 'vitest';
import { createDefaultProject } from './assets';
import { applyProjectCommand, assertCoatProject, COAT_PROJECT_LIMITS, createRandomCoatProject } from './commands';
import { requireHeraldicSwatchGroup } from './heraldic-swatches';
import { applyProjectHistoryCommand, createProjectHistory, redoProject, undoProject } from './store';
import type { CoatLayer } from './types';

function encodeUtf8Base64(value: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
}

function encodeBytesBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function createLocalSvgUpload(id: string) {
  return {
    id,
    mimeType: 'image/svg+xml' as const,
    encoding: 'base64' as const,
    data: 'PHN2Zz48L3N2Zz4=',
  };
}

function createProjectWithMovableCharges() {
  return ['material-animal-wolf-rampant', 'material-symbol-shooting-star', 'material-object-castle-tower'].reduce(
    (project, assetId) => applyProjectCommand(project, { type: 'add-layer', assetId }),
    createDefaultProject('en'),
  );
}

function getLayerTransformX(layer: CoatLayer): number {
  if (layer.type === 'background') throw new Error(`Expected movable layer: ${layer.id}`);
  return layer.transform.x;
}

function heraldicSwatchHex(groupId: 'metals' | 'colours', swatchId: string): string {
  const swatch = requireHeraldicSwatchGroup(groupId).swatches.find((candidate) => candidate.id === swatchId);
  if (!swatch) throw new Error(`Unknown heraldic swatch: ${swatchId}`);
  return swatch.hex;
}

function sequentialRandomValues(values: number[]): () => number {
  let nextIndex = 0;
  return () => {
    const value = values[nextIndex];
    if (value === undefined) throw new Error(`Unexpected extra random draw at index: ${nextIndex}`);
    nextIndex += 1;
    return value;
  };
}

function expectChargeToFollowTinctureRule(fieldColors: readonly string[], chargeColor: string): void {
  const metalHexes = new Set(['or', 'argent'].map((swatchId) => heraldicSwatchHex('metals', swatchId)));
  const colourHexes = new Set(['sable', 'gules', 'azure', 'vert'].map((swatchId) => heraldicSwatchHex('colours', swatchId)));
  const fieldClasses = new Set(fieldColors.map((fieldColor) => {
    if (metalHexes.has(fieldColor)) return 'metal';
    if (colourHexes.has(fieldColor)) return 'colour';
    throw new Error(`Unexpected field tincture: ${fieldColor}`);
  }));
  expect(fieldClasses.size).toBe(1);
  if (metalHexes.has(chargeColor)) {
    expect(fieldClasses.has('colour')).toBe(true);
    return;
  }
  if (colourHexes.has(chargeColor)) {
    expect(fieldClasses.has('metal')).toBe(true);
    return;
  }
  throw new Error(`Unexpected charge tincture: ${chargeColor}`);
}

function requireShieldLayer(project: ReturnType<typeof createDefaultProject>, layerId: string) {
  const shield = project.layers.find((layer) => layer.id === layerId);
  if (!shield || shield.type !== 'shield') throw new Error(`Expected shield layer: ${layerId}`);
  return shield;
}

describe('coat project commands', () => {
  it('persists a bundled static WebP material without adding a local upload', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-layer', assetId: 'material-symbol-eternal-flame',
    });

    expect(project.layers.at(-1)).toMatchObject({
      type: 'charge',
      assetId: 'material-symbol-eternal-flame',
      transform: { x: 0, y: 0, scale: 0.6, rotation: 0 },
    });
    expect(project.layers.at(-1)).not.toHaveProperty('rasterVariantId');
    expect(project.uploads).toEqual([]);
  });

  it('persists only validated local typography choices on a text layer', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'HONOUR', color: '#F5E6A1', fontSize: 18,
      fontFamily: 'blackletter', fontStyle: 'italic', fontWeight: 'bold',
      alignment: 'center', path: { mode: 'none' },
    } as never);

    expect(project.layers.at(-1)).toMatchObject({
      type: 'text', fontFamily: 'blackletter', fontStyle: 'italic', fontWeight: 'bold',
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    });
    expect(() => applyProjectCommand(project, {
      type: 'add-text-layer', text: 'HONOUR', color: '#F5E6A1', fontSize: 18,
      fontFamily: 'remote-font', fontStyle: 'italic', fontWeight: 'bold',
      alignment: 'center', path: { mode: 'none' },
    } as never)).toThrow('font family');

    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    const updatedProject = applyProjectCommand(project, {
      type: 'update-layer', layerId: textLayer.id,
      patch: { fontStyle: 'normal', fontWeight: 'normal' },
    } as never);

    expect(updatedProject.layers.at(-1)).toMatchObject({ fontStyle: 'normal', fontWeight: 'normal' });
  });

  it('enforces the 8-200 integer font size range at every text data boundary', () => {
    const createTextCommand = (fontSize: number) => ({
      type: 'add-text-layer' as const, text: 'SIZE', color: '#F5E6A1', fontSize,
      alignment: 'center' as const, path: { mode: 'none' as const },
    });
    const project = createDefaultProject('en');

    expect(() => applyProjectCommand(project, createTextCommand(7))).toThrow('Invalid text font size: 7');
    expect(() => applyProjectCommand(project, createTextCommand(8))).not.toThrow();
    expect(() => applyProjectCommand(project, createTextCommand(8.5))).toThrow('Invalid text font size: 8.5');
    expect(() => applyProjectCommand(project, createTextCommand(200))).not.toThrow();
    expect(() => applyProjectCommand(project, createTextCommand(201))).toThrow('Invalid text font size: 201');

    const projectWithText = applyProjectCommand(project, createTextCommand(40));
    const textLayer = projectWithText.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    expect(() => applyProjectCommand(projectWithText, {
      type: 'update-layer', layerId: textLayer.id, patch: { fontSize: 201 },
    })).toThrow('Invalid text font size: 201');
    const persistedInvalidProject = {
      ...projectWithText,
      layers: projectWithText.layers.map((layer) => layer.type === 'text' ? { ...layer, fontSize: 7 } : layer),
    };
    expect(() => assertCoatProject(persistedInvalidProject)).toThrow('Invalid text font size: 7');
  });

  it('persists underline and validated stroke styling on text layers', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'STROKE', color: '#F5E6A1', fontSize: 40,
      underline: true, strokeColor: '#111111', strokeWidth: 2.5,
      alignment: 'center', path: { mode: 'none' },
    } as never);

    expect(project.layers.at(-1)).toMatchObject({
      type: 'text', underline: true, strokeColor: '#111111', strokeWidth: 2.5,
    });
    const textLayer = project.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: textLayer.id, patch: { strokeWidth: -0.5 },
    } as never)).toThrow('Invalid text stroke width: -0.5');
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: textLayer.id, patch: { strokeWidth: 1.25 },
    } as never)).toThrow('Invalid text stroke width step: 1.25');
  });

  it('adds a locally authored top ornament as an independently transformable layer', () => {
    const project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-crown-papal-crown' });

    expect(project.layers.at(-1)).toMatchObject({ type: 'top', assetId: 'material-crown-papal-crown', color: '#B11F24' });
  });

  it('persists independently positioned field ornaments inside the shield field', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withChief = applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{ id: 'chief-1', kind: 'chief', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0 }],
      },
    });

    expect(withChief.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      field: { ornaments: [{ id: 'chief-1', kind: 'chief', color: '#F5E6A1' }] },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: { ...shield.field, ornaments: [{ id: 'invalid', kind: 'chief', color: '#FFFFFF', x: 0, y: 0, scale: 0, rotation: 0 }] },
    } as never)).toThrow('field ornament scale');
  });

  it('persists type-specific structural geometry without loosening field validation', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'chief-geometry', kind: 'chief', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0,
          width: 88, height: 18, edge: { style: 'wavy', frequency: 4, amplitude: 5 },
        }],
      },
    } as never);

    expect(configured.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      field: { ornaments: [{ width: 88, height: 18, edge: { style: 'wavy', frequency: 4, amplitude: 5 } }] },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'invalid-pall', kind: 'pall', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0,
          width: 50,
        }],
      },
    } as never)).toThrow('does not support width');
  });

  it('persists validated geometry controls for the configurable field structures', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [
          { id: 'cross-geometry', kind: 'cross', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, crossHorizontalThickness: 18, crossVerticalThickness: 24, crossCenterX: 43, crossCenterY: 61 },
          { id: 'saltire-geometry', kind: 'saltire', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, saltireCenterX: 46, saltireCenterY: 60 },
          { id: 'chevron-geometry', kind: 'chevron', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, chevronPeakHeight: 31, chevronVerticalPosition: 57 },
          { id: 'pall-geometry', kind: 'pall', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, pallForkX: 54, pallForkY: 46 },
          { id: 'mountain-geometry', kind: 'mountain', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, mountainPeakCount: 4, mountainSteepness: 0.72 },
        ],
      },
    } as never);

    expect(configured.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      field: { ornaments: [
        { crossHorizontalThickness: 18, crossVerticalThickness: 24, crossCenterX: 43, crossCenterY: 61 },
        { saltireCenterX: 46, saltireCenterY: 60 },
        { chevronPeakHeight: 31, chevronVerticalPosition: 57 },
        { pallForkX: 54, pallForkY: 46 },
        { mountainPeakCount: 4, mountainSteepness: 0.72 },
      ] },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{ id: 'invalid-mountain', kind: 'mountain', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, mountainPeakCount: 2.5 }],
      },
    } as never)).toThrow('mountain peak count');
    expect(() => applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{ id: 'invalid-cross', kind: 'cross', color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0, pallForkX: 50 }],
      },
    } as never)).toThrow('does not support pall fork x');
  });

  it('persists local multi-colour amplitudes for one field structure', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'fess-colours', kind: 'fess', color: '#1855A5', x: 0, y: 0, scale: 1, rotation: 0,
          colors: ['#1855A5', '#F5E6A1', '#B11F24'], colorAmplitudes: [2, 1, 3],
        }],
      },
    } as never);

    expect(configured.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      field: { ornaments: [{ colors: ['#1855A5', '#F5E6A1', '#B11F24'], colorAmplitudes: [2, 1, 3] }] },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        ornaments: [{
          id: 'invalid-amplitudes', kind: 'fess', color: '#1855A5', x: 0, y: 0, scale: 1, rotation: 0,
          colors: ['#1855A5', '#F5E6A1'], colorAmplitudes: [1],
        }],
      },
    } as never)).toThrow('colorAmplitudes length');
  });

  it('uses a local custom background fill without replacing the selected background texture', () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!background || background.type !== 'background') throw new Error('Expected background layer');

    const customized = applyProjectCommand(project, {
      type: 'set-background', assetId: background.assetId, motif: 'honeycomb', opacity: 0.6, fill: '#004E89',
    });

    expect(customized.layers[0]).toMatchObject({ assetId: 'ivory-background', motif: 'honeycomb', opacity: 0.6, fill: '#004E89' });
  });

  it('rejects SVG part colour replacements for a bundled WebP material', () => {
    const withCrown = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-crown-papal-crown' });
    const crown = withCrown.layers.at(-1);
    if (!crown || crown.type !== 'top') throw new Error('Expected crown layer');

    expect(() => applyProjectCommand(withCrown, {
      type: 'update-layer', layerId: crown.id,
      patch: { colorReplacements: { '#F5E6A1': '#1855A5' } },
    })).toThrow('Invalid unsupported SVG part colour: #F5E6A1');
  });

  it('persists heater-002 shield colour replacements in the same patch that selects the material', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    const updated = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-002', colorReplacements: { '#B4282E': '#004E89' } },
    });

    expect(requireShieldLayer(updated, shield.id)).toMatchObject({
      assetId: 'heater-002',
      colorReplacements: { '#B4282E': '#004E89' },
    });
  });

  it('rejects an unknown heater-002 shield paint with the paint in the error', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    expect(() => applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-002', colorReplacements: { '#FFFFFF': '#004E89' } },
    })).toThrow('#FFFFFF');
  });

  it('copies heater-002 shield colour replacements onto a duplicated layer', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withReplacements = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-002', colorReplacements: { '#B4282E': '#004E89' } },
    });

    const duplicated = applyProjectCommand(withReplacements, {
      type: 'duplicate-layers',
      sourceLayerIds: [shield.id],
      newLayerIds: ['copied-heater-002'],
    });
    const sourceShield = requireShieldLayer(withReplacements, shield.id);
    if (!sourceShield.colorReplacements) throw new Error('Expected source colour replacements');
    sourceShield.colorReplacements['#B4282E'] = '#FFFFFF';

    expect(requireShieldLayer(duplicated, 'copied-heater-002')).toMatchObject({
      type: 'shield',
      assetId: 'heater-002',
      colorReplacements: { '#B4282E': '#004E89' },
    });
  });

  it('drops shield colour replacements when the material changes without a replacement patch', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withReplacements = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-002', colorReplacements: { '#B4282E': '#004E89' } },
    });

    const switched = applyProjectCommand(withReplacements, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-003' },
    });

    expect(requireShieldLayer(switched, shield.id)).toMatchObject({ assetId: 'heater-003' });
    expect(requireShieldLayer(switched, shield.id)).not.toHaveProperty('colorReplacements');
  });

  it('keeps supplied colour replacements when switching heater-002 to heater-003', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withReplacements = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-002', colorReplacements: { '#B4282E': '#004E89' } },
    });

    const switched = applyProjectCommand(withReplacements, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-003', colorReplacements: { '#2452A3': '#123456' } },
    });

    expect(requireShieldLayer(switched, shield.id)).toMatchObject({
      assetId: 'heater-003',
      colorReplacements: { '#2452A3': '#123456' },
    });
  });

  it('adds a validated local freehand drawing layer without external SVG input', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-drawing-layer', path: 'M 10 20 L 30 40 L 50 60', color: '#004E89', strokeWidth: 3,
    });

    expect(project.layers.at(-1)).toMatchObject({
      type: 'draw', path: 'M 10 20 L 30 40 L 50 60', color: '#004E89', strokeWidth: 3,
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    });
    expect(() => applyProjectCommand(project, {
      type: 'add-drawing-layer', path: 'M 10 20" onload="alert(1)', color: '#004E89', strokeWidth: 3,
    })).toThrow('drawing path');
  });

  it('duplicates selected layer kinds with new ids without breaking group contiguity', () => {
    const project = createDefaultProject('en');
    const withCharge = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    const sourceLayerIds = withCharge.layers.map((layer) => layer.id);

    const duplicated = applyProjectCommand(withCharge, {
      type: 'duplicate-layers',
      sourceLayerIds,
      newLayerIds: ['copy-background', 'copy-shield', 'copy-charge'],
    });

    expect(duplicated.layers.slice(-3)).toMatchObject([
      { id: 'copy-background', type: 'background', groupId: null, locked: false },
      { id: 'copy-shield', type: 'shield', groupId: null, locked: false },
      { id: 'copy-charge', type: 'charge', groupId: null, locked: false },
    ]);
    expect(() => applyProjectCommand(duplicated, {
      type: 'group-layers', groupId: 'copies', layerIds: ['copy-shield', 'copy-charge'],
    })).not.toThrow();
  });

  it('updates and removes multiple unlocked layers as one validated command', () => {
    const project = createDefaultProject('en');
    const withCharges = ['material-animal-wolf-rampant', 'material-symbol-shooting-star'].reduce(
      (currentProject, assetId) => applyProjectCommand(currentProject, { type: 'add-layer', assetId }),
      project,
    );
    const chargeIds = withCharges.layers.slice(-2).map((layer) => layer.id);

    const moved = applyProjectCommand(withCharges, {
      type: 'update-layers',
      updates: chargeIds.map((layerId) => ({
        layerId,
        patch: { transform: { x: 3, y: -2, scale: 1, rotation: 0 } },
      })),
    });
    const withoutCharges = applyProjectCommand(moved, { type: 'remove-layers', layerIds: chargeIds });

    expect(moved.layers.slice(-2)).toMatchObject([
      { transform: { x: 3, y: -2 } }, { transform: { x: 3, y: -2 } },
    ]);
    expect(withoutCharges.layers).toHaveLength(2);
  });

  it('duplicates every supported persisted layer kind without sharing nested transforms or text paths', () => {
    const withOrdinary = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-layer', assetId: 'material-ordinary-chevron',
    });
    const withCharge = applyProjectCommand(withOrdinary, { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    const withText = applyProjectCommand(withCharge, {
      type: 'add-text-layer', text: 'FORTUNE', color: '#F5E6A1', fontSize: 24,
      alignment: 'center', path: { mode: 'curve', curve: 'upper' },
    });
    const withUpload = applyProjectCommand(withText, {
      type: 'register-local-upload',
      upload: {
        id: 'copyable-svg', mimeType: 'image/svg+xml', encoding: 'base64',
        data: encodeUtf8Base64('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0H1V1Z"/></svg>'),
      },
    });
    const project = applyProjectCommand(withUpload, { type: 'add-image-layer', uploadId: 'copyable-svg' });
    const sourceLayerIds = project.layers.map((layer) => layer.id);
    const newLayerIds = sourceLayerIds.map((_, index) => `all-kind-copy-${index}`);

    const duplicated = applyProjectCommand(project, { type: 'duplicate-layers', sourceLayerIds, newLayerIds });

    expect(duplicated.layers.slice(-sourceLayerIds.length).map((layer) => layer.type)).toEqual(
      ['background', 'shield', 'ordinary', 'charge', 'text', 'image'],
    );
    expect(duplicated.layers.slice(-sourceLayerIds.length).every((layer) => !layer.locked && layer.groupId === null)).toBe(true);
  });
  it('places extra library shields at the library scale instead of the default heater scale', () => {
    const project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'round-shield' });

    expect(project.layers[1]).toMatchObject({ type: 'shield', assetId: 'heater-shield', transform: { scale: 0.935 } });
    expect(project.layers.at(-1)).toMatchObject({ type: 'shield', assetId: 'round-shield', transform: { x: 0, y: 0, scale: 0.6, rotation: 0 } });
  });

  it('creates unique independent instances when the same charge is added twice', () => {
    const initialProject = createDefaultProject('en');
    const once = applyProjectCommand(initialProject, {
      type: 'add-layer',
      assetId: 'material-animal-wolf-rampant',
    });
    const twice = applyProjectCommand(once, {
      type: 'add-layer',
      assetId: 'material-animal-wolf-rampant',
    });

    expect(twice.layers).toHaveLength(4);
    expect(twice.layers[2]?.id).not.toBe(twice.layers[3]?.id);
    expect(initialProject.layers).toHaveLength(2);
  });

  it('rejects updates to locked layers with the locked layer id', () => {
    const defaultProject = createDefaultProject('en');
    const projectWithLockedCharge = {
      ...defaultProject,
      layers: [
        ...defaultProject.layers,
        {
          id: 'charge-1',
          type: 'charge' as const,
          assetId: 'material-animal-wolf-rampant',
          color: '#B11F24',
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
          visible: true,
          locked: true,
          groupId: null,
        },
      ],
    };

    expect(() =>
      applyProjectCommand(projectWithLockedCharge, {
        type: 'update-layer',
        layerId: 'charge-1',
        patch: { transform: { x: 20, y: 20, scale: 1, rotation: 0 } },
      }),
    ).toThrow('charge-1');
  });

  it('updates only a valid unlocked layer and leaves the input document unchanged', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield || shield.type !== 'shield') {
      throw new Error('Expected default shield layer');
    }

    const updated = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { transform: { x: 20, y: -12, scale: 1.25, rotation: 15 } },
    });

    expect(updated.layers[1]).toMatchObject({
      id: shield.id,
      transform: { x: 20, y: -12, scale: 1.25, rotation: 15 },
    });
    expect(project.layers[1]).toMatchObject({
      transform: { x: 0, y: 0, scale: 0.935, rotation: 0 },
    });
  });

  it('persists bounded crop and horizontal or vertical flip controls on an unlocked element', () => {
    const withLion = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    const lion = withLion.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');

    const updated = applyProjectCommand(withLion, {
      type: 'update-layer', layerId: lion.id,
      patch: {
        transform: {
          x: 0, y: 0, scale: 1, rotation: 0,
          flipHorizontal: true, flipVertical: true,
          crop: { x: 12, y: 8, width: 64, height: 78 },
        },
      },
    });

    expect(updated.layers.at(-1)).toMatchObject({
      transform: { flipHorizontal: true, flipVertical: true, crop: { x: 12, y: 8, width: 64, height: 78 } },
    });
    expect(() => applyProjectCommand(withLion, {
      type: 'update-layer', layerId: lion.id,
      patch: { transform: { x: 0, y: 0, scale: 1, rotation: 0, crop: { x: 70, y: 8, width: 40, height: 78 } } },
    })).toThrow('horizontal bounds');
  });

  it('rejects a non-finite transform value with the rejected value', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield) throw new Error('Expected default shield layer');

    expect(() =>
      applyProjectCommand(project, {
        type: 'update-layer',
        layerId: shield.id,
        patch: { transform: { x: Number.NaN, y: 0, scale: 1, rotation: 0 } },
      }),
    ).toThrow('NaN');
  });

  it('does not retain a mutable transform patch supplied by the caller', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield) throw new Error('Expected default shield layer');
    const requestedTransform = { x: 20, y: 0, scale: 1, rotation: 0 };

    const updated = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { transform: requestedTransform },
    });
    requestedTransform.x = 999;

    expect(updated.layers[1]).toMatchObject({ transform: { x: 20, y: 0, scale: 1, rotation: 0 } });
  });

  it('removes, reorders, toggles, and groups only requested unlocked layers', () => {
    const original = createDefaultProject('en');
    const withCharges = applyProjectCommand(
      applyProjectCommand(original, { type: 'add-layer', assetId: 'material-animal-wolf-rampant' }),
      { type: 'add-layer', assetId: 'material-symbol-shooting-star' },
    );
    const lionId = withCharges.layers[2]?.id;
    const starId = withCharges.layers[3]?.id;
    if (!lionId || !starId) throw new Error('Expected two added charges');

    const grouped = applyProjectCommand(withCharges, {
      type: 'group-layers',
      groupId: 'heraldic-pair',
      layerIds: [lionId, starId],
    });
    const hidden = applyProjectCommand(grouped, {
      type: 'set-layer-visibility',
      layerId: lionId,
      visible: false,
    });
    const reordered = applyProjectCommand(hidden, {
      type: 'move-layer',
      layerId: starId,
      toIndex: 2,
    });
    const ungrouped = applyProjectCommand(reordered, {
      type: 'ungroup-layers',
      groupId: 'heraldic-pair',
    });
    const removed = applyProjectCommand(ungrouped, {
      type: 'remove-layer',
      layerId: lionId,
    });

    expect(grouped.layers.slice(2).map((layer) => layer.groupId)).toEqual([
      'heraldic-pair',
      'heraldic-pair',
    ]);
    expect(grouped.groups).toEqual([{ id: 'heraldic-pair', opacity: 1 }]);
    expect(hidden.layers[2]).toMatchObject({ id: lionId, visible: false });
    expect(reordered.layers[2]?.id).toBe(starId);
    expect(ungrouped.layers.slice(2).every((layer) => layer.groupId === null)).toBe(true);
    expect(removed.layers.map((layer) => layer.id)).not.toContain(lionId);
  });

  it('keeps a base shield and background while allowing a non-base layer to be removed', () => {
    const project = createDefaultProject('en');
    const background = project.layers[0];
    const shield = project.layers[1];
    if (!background || !shield) throw new Error('Expected default base layers');
    const withCharge = applyProjectCommand(project, { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    const charge = withCharge.layers.at(-1);
    if (!charge) throw new Error('Expected added charge');

    expect(() => applyProjectCommand(project, { type: 'remove-layer', layerId: background.id }))
      .toThrow(`base background layer: ${background.id}`);
    expect(() => applyProjectCommand(project, { type: 'remove-layer', layerId: shield.id }))
      .toThrow(`base shield layer: ${shield.id}`);
    expect(applyProjectCommand(withCharge, { type: 'remove-layer', layerId: charge.id }).layers)
      .toHaveLength(2);
  });

  it('rejects imported project data that omits its required base shield or background', () => {
    const project = createDefaultProject('en');
    const withoutBackground = { ...project, layers: project.layers.filter((layer) => layer.type !== 'background') };
    const withoutShield = { ...project, layers: project.layers.filter((layer) => layer.type !== 'shield') };

    expect(() => assertCoatProject(withoutBackground)).toThrow('base background layer');
    expect(() => assertCoatProject(withoutShield)).toThrow('base shield layer');
  });

  it('allows removing one shield only after another shield exists', () => {
    const project = createDefaultProject('en');
    const baseShield = project.layers[1];
    if (!baseShield) throw new Error('Expected default shield');
    const withSecondShield = applyProjectCommand(project, { type: 'add-layer', assetId: 'round-shield' });

    expect(applyProjectCommand(withSecondShield, {
      type: 'remove-layer',
      layerId: baseShield.id,
    }).layers.filter((layer) => layer.type === 'shield')).toHaveLength(1);
  });

  it('persists group opacity and removes metadata when a group dissolves', () => {
    const withCharges = applyProjectCommand(
      applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-wolf-rampant' }),
      { type: 'add-layer', assetId: 'material-symbol-shooting-star' },
    );
    const layerIds = withCharges.layers.slice(-2).map((layer) => layer.id);
    const grouped = applyProjectCommand(withCharges, {
      type: 'group-layers', groupId: 'pair', layerIds,
    });
    const translucent = applyProjectCommand(grouped, {
      type: 'set-group-opacity', groupId: 'pair', opacity: 0.35,
    });
    const dissolved = applyProjectCommand(translucent, {
      type: 'remove-layer', layerId: layerIds[0]!,
    });

    expect(translucent.groups).toEqual([{ id: 'pair', opacity: 0.35 }]);
    expect(dissolved.groups).toEqual([]);
    expect(dissolved.layers.find((layer) => layer.id === layerIds[1])?.groupId).toBeNull();
  });

  it('rejects non-contiguous layer selection when creating a composited group', () => {
    const withCharges = ['material-animal-wolf-rampant', 'material-symbol-shooting-star', 'material-object-castle-tower'].reduce(
      (project, assetId) => applyProjectCommand(project, { type: 'add-layer', assetId }),
      createDefaultProject('en'),
    );
    const firstId = withCharges.layers[2]?.id;
    const thirdId = withCharges.layers[4]?.id;
    if (!firstId || !thirdId) throw new Error('Expected three charges');

    expect(() => applyProjectCommand(withCharges, {
      type: 'group-layers', groupId: 'spaced', layerIds: [firstId, thirdId],
    })).toThrow('Non-contiguous group layer selection: spaced');
  });

  it('rejects a non-finite group opacity with the received value', () => {
    const project = createDefaultProject('en');

    expect(() => applyProjectCommand(project, {
      type: 'set-group-opacity', groupId: 'missing', opacity: Number.NaN,
    } as never)).toThrow('NaN');
  });

  it('updates shield fields, backgrounds, and project names through their dedicated commands', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield layer');

    const withField = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: { division: 'per-pale', colors: ['#B11F24', '#F5E6A1'], pattern: 'stripes' },
    });
    const withBackground = applyProjectCommand(withField, {
      type: 'set-background',
      assetId: 'azure-background',
    });
    const renamed = applyProjectCommand(withBackground, {
      type: 'set-project-name',
      name: 'Royal Arms',
    });

    expect(withField.layers[1]).toMatchObject({
      field: { division: 'per-pale', colors: ['#B11F24', '#F5E6A1'], pattern: 'stripes' },
    });
    expect(withBackground.layers[0]).toMatchObject({ assetId: 'azure-background' });
    expect(renamed.name).toBe('Royal Arms');
  });

  it('persists a quarterly field with individually configurable region patterns', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        division: 'quarterly',
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        regions: {
          q1: { colors: ['#B11F24'], pattern: 'solid' },
          q2: { colors: ['#1855A5', '#F5E6A1'], pattern: 'dots', patternScale: 0.5 },
          q3: { colors: ['#F5E6A1'], pattern: 'solid' },
          q4: { colors: ['#FFFFFF'], pattern: 'solid' },
        },
      },
    });

    expect(configured.layers[1]).toMatchObject({
      field: { regions: { q2: { colors: ['#1855A5', '#F5E6A1'], pattern: 'dots', patternScale: 0.5 } } },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        division: 'quarterly',
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        regions: { q1: { colors: ['#B11F24'], pattern: 'solid', patternScale: 0.2 } },
      },
    } as never)).toThrow('Invalid field region pattern scale q1: 0.2');
  });

  it('persists a valid configured field division line and rejects an out-of-range amplitude', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        division: 'per-fess',
        colors: ['#B11F24', '#F5E6A1'],
        divisionLine: { style: 'embattled', frequency: 4, amplitude: 8 },
      } as never,
    });

    expect(configured.layers[1]).toMatchObject({
      field: { divisionLine: { style: 'embattled', frequency: 4, amplitude: 8 } },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        division: 'per-fess',
        colors: ['#B11F24', '#F5E6A1'],
        divisionLine: { style: 'wavy', frequency: 3, amplitude: 21 },
      } as never,
    })).toThrow('21');
  });

  it('persists a per-pale field with a wavy division line and independent regions', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        division: 'per-pale',
        colors: ['#111111', '#222222'],
        pattern: 'solid',
        divisionLine: { style: 'wavy', frequency: 3, amplitude: 7 },
        regions: {
          dexter: { colors: ['#B11F24', '#F5E6A1'], pattern: 'dots' },
          sinister: { colors: ['#1855A5', '#FFFFFF'], pattern: 'checks' },
        },
      },
    });

    expect(configured.layers[1]).toMatchObject({
      field: {
        division: 'per-pale',
        divisionLine: { style: 'wavy', frequency: 3, amplitude: 7 },
        regions: {
          dexter: { colors: ['#B11F24', '#F5E6A1'], pattern: 'dots' },
          sinister: { colors: ['#1855A5', '#FFFFFF'], pattern: 'checks' },
        },
      },
    });
  });

  it('persists a charge field placement and clipping preference through its transform', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    const lion = project.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');

    project = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: lion.id,
      patch: { transform: { ...lion.transform, fieldPlacement: 'chief', clipToField: true } } as never,
    });

    expect(project.layers.at(-1)).toMatchObject({ transform: { fieldPlacement: 'chief', clipToField: true } });
  });

  it('accepts every locally editable shield field region as a precise charge clipping target', () => {
    let project = applyProjectCommand(createDefaultProject('en'), { type: 'add-layer', assetId: 'material-animal-wolf-rampant' });
    const lion = project.layers.at(-1);
    if (!lion || lion.type !== 'charge') throw new Error('Expected lion charge');

    project = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: lion.id,
      patch: { transform: { ...lion.transform, fieldRegionId: 'bend-lower', clipToField: true } } as never,
    });

    expect(project.layers.at(-1)).toMatchObject({ transform: { fieldRegionId: 'bend-lower', clipToField: true } });
  });

  it('changes the local canvas dimensions through a validated dedicated command', () => {
    const project = createDefaultProject('en');

    const resized = applyProjectCommand(project, {
      type: 'set-canvas-size', width: 1600, height: 900,
    });

    expect(resized.canvas).toEqual({ width: 1600, height: 900 });
    expect(() => applyProjectCommand(project, {
      type: 'set-canvas-size', width: 4097, height: 900,
    })).toThrow('4097');
  });

  it('locks a layer through its dedicated command and permits an explicit unlock', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield) throw new Error('Expected default shield layer');
    const locked = applyProjectCommand(project, {
      type: 'set-layer-lock',
      layerId: shield.id,
      locked: true,
    });

    expect(locked.layers[1]).toMatchObject({ id: shield.id, locked: true });
    expect(() =>
      applyProjectCommand(locked, { type: 'remove-layer', layerId: shield.id }),
    ).toThrow(shield.id);
    expect(
      applyProjectCommand(locked, {
        type: 'set-layer-lock',
        layerId: shield.id,
        locked: false,
      }).layers[1],
    ).toMatchObject({ id: shield.id, locked: false });
  });

  it('keeps immutable undo and redo checkpoints for command history', () => {
    const initialProject = createDefaultProject('en');
    const initialHistory = createProjectHistory(initialProject);
    const withCharge = applyProjectHistoryCommand(initialHistory, {
      type: 'add-layer',
      assetId: 'material-animal-wolf-rampant',
    });
    const undone = undoProject(withCharge);
    const redone = redoProject(undone);

    expect(withCharge.present.layers).toHaveLength(3);
    expect(undone.present).toEqual(initialProject);
    expect(redone.present).toEqual(withCharge.present);
    expect(initialHistory.present.layers).toHaveLength(2);
  });

  it('creates and removes aligned text layers with validated motto paths', () => {
    const project = createDefaultProject('en');
    const withMotto = applyProjectCommand(project, {
      type: 'add-text-layer',
      text: 'FORTUNE FAVOURS',
      color: '#F5E6A1',
      fontSize: 42,
      alignment: 'center',
      path: { mode: 'motto', curve: 'upper' },
    });
    const textLayer = withMotto.layers.at(-1);
    if (!textLayer || textLayer.type !== 'text') throw new Error('Expected text layer');

    expect(textLayer).toMatchObject({
      text: 'FORTUNE FAVOURS', fontFamily: 'serif', alignment: 'center', path: { mode: 'motto', curve: 'upper' },
    });
    expect(applyProjectCommand(withMotto, {
      type: 'update-layer', layerId: textLayer.id,
      patch: { text: 'COURAGE', fontFamily: 'cursive' },
    }).layers.at(-1)).toMatchObject({ text: 'COURAGE', fontFamily: 'cursive' });
    expect(applyProjectCommand(withMotto, {
      type: 'remove-text-layer', layerId: textLayer.id,
    }).layers).toHaveLength(2);
    expect(() => applyProjectCommand(project, {
      type: 'add-text-layer', text: 'Bad', color: '#FFFFFF', fontSize: 20,
      alignment: 'center', path: { mode: 'ring', curve: 'upper' },
    } as never)).toThrow('ring');
  });

  it('persists validated bezier control points and ring radii through text path patches', () => {
    let project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-text-layer', text: 'CURVE', color: '#FFFFFF', fontSize: 20,
      alignment: 'center', path: { mode: 'curve', curve: 'upper' },
    });
    const curveLayer = project.layers.at(-1);
    if (!curveLayer || curveLayer.type !== 'text') throw new Error('Expected curved text layer');
    project = applyProjectCommand(project, {
      type: 'update-layer', layerId: curveLayer.id,
      patch: { path: { mode: 'curve', curve: 'upper', controlX: 42.5, controlY: 36.25 } },
    });
    expect(project.layers.at(-1)).toMatchObject({ path: { controlX: 42.5, controlY: 36.25 } });
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: curveLayer.id,
      patch: { path: { mode: 'curve', curve: 'upper', controlX: 101, controlY: 36 } },
    })).toThrow('101');
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: curveLayer.id,
      patch: { path: { mode: 'curve', curve: 'upper', controlX: 42 } } as never,
    })).toThrow('control point');

    project = applyProjectCommand(project, {
      type: 'add-text-layer', text: 'RING', color: '#FFFFFF', fontSize: 20,
      alignment: 'center', path: { mode: 'ring', curve: 'clockwise' },
    });
    const ringLayer = project.layers.at(-1);
    if (!ringLayer || ringLayer.type !== 'text') throw new Error('Expected ring text layer');
    project = applyProjectCommand(project, {
      type: 'update-layer', layerId: ringLayer.id,
      patch: { path: { mode: 'ring', curve: 'clockwise', radius: 24.5 } },
    });
    expect(project.layers.at(-1)).toMatchObject({ path: { radius: 24.5 } });
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: ringLayer.id,
      patch: { path: { mode: 'ring', curve: 'clockwise', radius: 51 } },
    })).toThrow('51');
  });

  it('rejects unsupported text fonts instead of persisting browser-specific values', () => {
    const project = createDefaultProject('en');
    expect(() => applyProjectCommand(project, {
      type: 'add-text-layer', text: 'Arms', color: '#FFFFFF', fontSize: 20,
      alignment: 'center', path: { mode: 'none' }, fontFamily: 'fantasy',
    } as never)).toThrow('Invalid text font family');
  });

  it('registers an SVG upload before creating and removing an image layer', () => {
    const project = createDefaultProject('en');
    const withUpload = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'crest-svg', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=',
      },
    });
    const withImage = applyProjectCommand(withUpload, {
      type: 'add-image-layer', uploadId: 'crest-svg', opacity: 0.7,
      transform: { x: 4, y: 5, scale: 1.2, rotation: 0 },
    });
    const imageLayer = withImage.layers.at(-1);
    if (!imageLayer || imageLayer.type !== 'image') throw new Error('Expected image layer');

    expect(imageLayer).toMatchObject({ uploadId: 'crest-svg', mimeType: 'image/svg+xml', opacity: 0.7 });
    expect(() => applyProjectCommand(withImage, {
      type: 'remove-local-upload', uploadId: 'crest-svg',
    })).toThrow('crest-svg');
    const withoutImage = applyProjectCommand(withImage, {
      type: 'remove-image-layer', layerId: imageLayer.id,
    });
    expect(applyProjectCommand(withoutImage, {
      type: 'remove-local-upload', uploadId: 'crest-svg',
    }).uploads).toEqual([]);
  });

  it('uses a registered local upload as a custom shield mask and protects that upload from removal', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withUpload = applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: {
        id: 'custom-shield-mask', mimeType: 'image/svg+xml', encoding: 'base64',
        data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTEwIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
      },
    });
    const masked = applyProjectCommand(withUpload, {
      type: 'set-custom-shield-mask', layerId: shield.id, uploadId: 'custom-shield-mask',
    });

    expect(masked.layers[1]).toMatchObject({ type: 'shield', customMaskUploadId: 'custom-shield-mask' });
    expect(() => applyProjectCommand(masked, {
      type: 'remove-local-upload', uploadId: 'custom-shield-mask',
    })).toThrow('custom shield mask');
  });

  it('rejects text and local upload resources above the configured project limits', () => {
    const project = createDefaultProject('en');
    const tooLongText = 'A'.repeat(241);
    const tooLargePng = new Uint8Array(262_145);
    tooLargePng.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const tooLargePngBase64 = encodeBytesBase64(tooLargePng);

    expect(() => applyProjectCommand(project, {
      type: 'add-text-layer', text: tooLongText, color: '#FFFFFF', fontSize: 24,
      alignment: 'center', path: { mode: 'none' },
    })).toThrow('241; limit is 240');
    expect(() => applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: { id: 'too-large-png', mimeType: 'image/png', encoding: 'base64', data: tooLargePngBase64 },
    })).toThrow('262145; limit is 262144');
  });

  it('rejects an oversized local upload selection without changing the original project', () => {
    const project = createDefaultProject('en');
    const projectBeforeCommand = JSON.parse(JSON.stringify(project));
    const uploads = Array.from({ length: COAT_PROJECT_LIMITS.maxLocalUploadCount + 1 }, (_, index) => (
      createLocalSvgUpload(`selection-${index}`)
    ));

    expect(() => applyProjectCommand(project, { type: 'add-local-upload-images', uploads }))
      .toThrow(`Invalid local upload count: ${COAT_PROJECT_LIMITS.maxLocalUploadCount + 1}`);
    expect(project).toEqual(projectBeforeCommand);
  });

  it('rejects duplicate IDs in a local upload selection without changing the original project', () => {
    const project = createDefaultProject('en');
    const projectBeforeCommand = JSON.parse(JSON.stringify(project));
    const uploads = [createLocalSvgUpload('duplicate-id'), createLocalSvgUpload('duplicate-id')];

    expect(() => applyProjectCommand(project, { type: 'add-local-upload-images', uploads }))
      .toThrow('Duplicate local upload id: duplicate-id');
    expect(project).toEqual(projectBeforeCommand);
  });

  it('creates a valid original random project from local assets with deterministic input', () => {
    const project = createRandomCoatProject('zh', () => 0);
    const background = project.layers.find((layer) => layer.type === 'background');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    const charge = project.layers.find((layer) => layer.type === 'charge');
    if (!background || background.type !== 'background' || !shield || shield.type !== 'shield' || !charge || charge.type !== 'charge') {
      throw new Error('Expected background, shield, and charge layers');
    }

    expect(project.locale).toBe('zh');
    expect(project.uploads).toEqual([]);
    expect(project.layers.map((layer) => layer.type)).toEqual(['background', 'shield', 'charge']);
    expect(project.layers.some((layer) => layer.type === 'ordinary')).toBe(false);
    expect(background).toMatchObject({ motif: 'solid', fill: '#FFFFFF' });
    expect(shield).toMatchObject({
      assetId: 'heater-shield',
      field: { division: 'solid', pattern: 'solid', colors: [heraldicSwatchHex('metals', 'or')] },
      transform: { x: 0, y: 0, scale: 0.935, rotation: 0 },
    });
    expect(charge).toMatchObject({
      assetId: 'material-animal-aurochs-rampant',
      color: heraldicSwatchHex('colours', 'sable'),
      rasterTint: true,
      transform: { x: 0, y: 0, scale: 0.6, rotation: 0 },
    });
    expectChargeToFollowTinctureRule(shield.field.colors, charge.color);
    expect(assertCoatProject(project)).toBeUndefined();
  });

  it('builds a bipartite random field with two different same-class colours and a contrasting charge', () => {
    const project = createRandomCoatProject('en', sequentialRandomValues([
      0.7, 0, 0.5, 0, 0, 0, 0,
    ]));
    const shield = project.layers.find((layer) => layer.type === 'shield');
    const charge = project.layers.find((layer) => layer.type === 'charge');
    if (!shield || shield.type !== 'shield' || !charge || charge.type !== 'charge') {
      throw new Error('Expected shield and charge layers');
    }

    expect(project.layers.map((layer) => layer.type)).toEqual(['background', 'shield', 'charge']);
    expect(shield.assetId).toBe('heater-shield');
    expect(shield.field).toMatchObject({
      division: 'per-pale',
      pattern: 'solid',
      colors: [heraldicSwatchHex('colours', 'sable'), heraldicSwatchHex('colours', 'gules')],
    });
    expect(new Set(shield.field.colors).size).toBe(shield.field.colors.length);
    expect(charge.rasterTint).toBe(true);
    expectChargeToFollowTinctureRule(shield.field.colors, charge.color);
  });

  it('updates background settings and replaces matching colors across the project palette', () => {
    const project = createDefaultProject('en');
    const withPalette = applyProjectCommand(
      applyProjectCommand(project, { type: 'add-custom-palette-color', color: '#B11F24' }),
      { type: 'add-layer', assetId: 'material-animal-wolf-rampant' },
    );
    const withBackground = applyProjectCommand(withPalette, {
      type: 'set-background', assetId: 'azure-background', motif: 'dots', opacity: 0.5,
    });
    const replaced = applyProjectCommand(withBackground, {
      type: 'replace-all-colour', fromColor: '#B11F24', toColor: '#123456',
    });

    expect(withBackground.layers[0]).toMatchObject({ motif: 'dots', opacity: 0.5 });
    expect(replaced.palette).toContain('#123456');
    expect(replaced.layers.at(-1)).toMatchObject({ color: '#123456' });
    expect(applyProjectCommand(replaced, {
      type: 'remove-custom-palette-color', color: '#123456',
    }).palette).not.toContain('#123456');
  });

  it('remaps heater-002 shield colour replacement values with replace-all-colour', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withReplacements = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: {
        assetId: 'heater-002',
        colorReplacements: { '#B4282E': '#B11F24' },
        field: { ...shield.field, colors: ['#B11F24'] },
      },
    });

    const replaced = applyProjectCommand(withReplacements, {
      type: 'replace-all-colour', fromColor: '#B11F24', toColor: '#123456',
    });

    expect(requireShieldLayer(replaced, shield.id)).toMatchObject({
      colorReplacements: { '#B4282E': '#123456' },
      field: { colors: ['#123456'] },
    });
  });

  it('replaces a heater-002 paint through replace-layer-colour', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const withMaterial = applyProjectCommand(project, {
      type: 'update-layer',
      layerId: shield.id,
      patch: { assetId: 'heater-002' },
    });

    const replaced = applyProjectCommand(withMaterial, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#B4282E', toColor: '#004E89',
    });

    expect(requireShieldLayer(replaced, shield.id)).toMatchObject({
      colorReplacements: { '#B4282E': '#004E89' },
    });
  });

  it('replaces matching regional and structural shield colours without changing unrelated field data', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    const configured = applyProjectCommand(project, {
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        division: 'quarterly',
        colors: ['#B11F24', '#1855A5'],
        regions: {
          q1: { colors: ['#B11F24'], pattern: 'solid' },
          q2: { colors: ['#1855A5', '#B11F24'], pattern: 'stripes' },
        },
        ornaments: [{
          id: 'regional-colour-ornament', kind: 'fess', color: '#B11F24',
          colors: ['#F5E6A1', '#B11F24'], colorAmplitudes: [1, 2],
          x: 0, y: 0, scale: 1, rotation: 0,
        }],
        outline: { visible: true, color: '#B11F24', width: 2 },
      },
    });

    const replaced = applyProjectCommand(configured, {
      type: 'replace-all-colour', fromColor: '#b11f24', toColor: '#123456',
    });
    const replacedShield = replaced.layers.find((layer) => layer.id === shield.id);
    if (!replacedShield || replacedShield.type !== 'shield') throw new Error('Expected replaced shield layer');

    expect(replacedShield.field).toMatchObject({
      colors: ['#123456', '#1855A5'],
      regions: {
        q1: { colors: ['#123456'], pattern: 'solid' },
        q2: { colors: ['#1855A5', '#123456'], pattern: 'stripes' },
      },
      ornaments: [{
        color: '#123456', colors: ['#F5E6A1', '#123456'], colorAmplitudes: [1, 2],
      }],
      outline: { visible: true, color: '#123456', width: 2 },
    });
  });

  it('replaces every matching colour on only the selected shield layer without changing the palette or other layers', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const configured = applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: {
        ...shield.field,
        division: 'quarterly',
        colors: ['#B11F24', '#1855A5'],
        regions: { q1: { colors: ['#B11F24'], pattern: 'solid' } },
        ornaments: [{
          id: 'selected-colour-ornament', kind: 'fess', color: '#B11F24',
          colors: ['#F5E6A1', '#B11F24'], colorAmplitudes: [1, 1],
          x: 0, y: 0, scale: 1, rotation: 0,
        }],
        outline: { visible: true, color: '#B11F24', width: 2 },
      },
    });
    const withText = applyProjectCommand(configured, {
      type: 'add-text-layer', text: 'HONOUR', color: '#B11F24', fontSize: 24,
      alignment: 'center', path: { mode: 'none' },
    });
    const paletteBeforeReplacement = [...withText.palette];
    const textBeforeReplacement = withText.layers.at(-1);
    const replaced = applyProjectCommand(withText, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#b11f24', toColor: '#004E89',
    });
    const replacedShield = replaced.layers.find((layer) => layer.id === shield.id);

    if (!replacedShield || replacedShield.type !== 'shield') throw new Error('Expected replaced shield layer');
    expect(replacedShield.field).toMatchObject({
      colors: ['#B11F24', '#1855A5'],
      regions: {
        q1: { colors: ['#004E89'] }, q4: { colors: ['#004E89'] },
      },
      ornaments: [{ color: '#B11F24', colors: ['#F5E6A1', '#004E89'] }],
      outline: { visible: true, color: '#004E89', width: 2 },
    });
    expect(replacedShield.field.regions?.q2).toBeUndefined();
    expect(replacedShield.field.regions?.q3).toBeUndefined();
    expect(replaced.palette).toEqual(paletteBeforeReplacement);
    expect(replaced.layers.at(-1)).toEqual(textBeforeReplacement);
    expect(withText.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      field: { colors: ['#B11F24', '#1855A5'] },
    });
  });

  it('rejects locked, missing, unsupported, and source-missing selected layer colour replacements', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!shield || shield.type !== 'shield' || !background) throw new Error('Expected default base layers');
    const locked = applyProjectCommand(project, { type: 'set-layer-lock', layerId: shield.id, locked: true });

    expect(() => applyProjectCommand(locked, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#1855A5', toColor: '#004E89',
    })).toThrow(`Coat layer is locked: ${shield.id}`);
    expect(() => applyProjectCommand(project, {
      type: 'replace-layer-colour', layerId: 'missing-layer', fromColor: '#1855A5', toColor: '#004E89',
    })).toThrow('Unknown coat layer id: missing-layer');
    expect(() => applyProjectCommand(project, {
      type: 'replace-layer-colour', layerId: background.id, fromColor: '#1855A5', toColor: '#004E89',
    })).toThrow(`Layer does not support editable colour replacement: ${background.id}`);
    expect(() => applyProjectCommand(project, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#FFFFFF', toColor: '#004E89',
    })).toThrow(`Editable layer colour source not found: #FFFFFF on layer ${shield.id}`);
  });

  it('validates selected layer colour command keys and values before replacement', () => {
    const project = createDefaultProject('en');
    const shield = project.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');

    expect(() => applyProjectCommand(project, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#1855A', toColor: '#004E89',
    })).toThrow('Invalid source color: #1855A');
    expect(() => applyProjectCommand(project, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#1855A5', toColor: '#004E8',
    })).toThrow('Invalid replacement color: #004E8');
    expect(() => applyProjectCommand(project, {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#1855A5', toColor: '#004E89', extra: true,
    } as never)).toThrow('extra');
  });

  it('records one undoable selected layer colour replacement history step', () => {
    const initialProject = createDefaultProject('en');
    const shield = initialProject.layers.find((layer) => layer.type === 'shield');
    if (!shield || shield.type !== 'shield') throw new Error('Expected shield layer');
    const replacedHistory = applyProjectHistoryCommand(createProjectHistory(initialProject), {
      type: 'replace-layer-colour', layerId: shield.id, fromColor: '#1855A5', toColor: '#004E89',
    });
    const undoneHistory = undoProject(replacedHistory);
    const redoneHistory = redoProject(undoneHistory);

    expect(replacedHistory.past).toHaveLength(1);
    expect(replacedHistory.present.layers.find((layer) => layer.id === shield.id)).toMatchObject({
      field: { colors: ['#004E89'] },
    });
    expect(undoneHistory.present).toEqual(initialProject);
    expect(redoneHistory.present).toEqual(replacedHistory.present);
  });

  it('normalizes a dissolved group and rejects regrouping that would make members non-contiguous', () => {
    const base = createDefaultProject('en');
    const withCharges = ['material-animal-wolf-rampant', 'material-symbol-shooting-star', 'material-object-castle-tower', 'material-animal-wolf-rampant']
      .reduce((project, assetId) => applyProjectCommand(project, { type: 'add-layer', assetId }), base);
    const chargeIds = withCharges.layers.slice(2).map((layer) => layer.id);
    const firstGroup = applyProjectCommand(withCharges, {
      type: 'group-layers', groupId: 'first', layerIds: chargeIds.slice(0, 2),
    });
    const twoGroups = applyProjectCommand(firstGroup, {
      type: 'group-layers', groupId: 'second', layerIds: chargeIds.slice(2),
    });
    const afterRemove = applyProjectCommand(twoGroups, {
      type: 'remove-layer', layerId: chargeIds[0]!,
    });
    const regroupingCommand = {
      type: 'group-layers' as const, groupId: 'first', layerIds: [chargeIds[3]!],
    };

    expect(afterRemove.layers.find((layer) => layer.id === chargeIds[1])?.groupId).toBeNull();
    expect(() => applyProjectCommand(twoGroups, regroupingCommand)).toThrow(
      'Non-contiguous coat group membership: first',
    );
  });

  it('rejects unknown nested field and transform keys before changing a layer', () => {
    const project = createDefaultProject('en');
    const shield = project.layers[1];
    if (!shield) throw new Error('Expected default shield layer');

    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: shield.id,
      patch: { transform: { x: 0, y: 0, scale: 1, rotation: 0, skew: 5 } },
    } as never)).toThrow('skew');
    expect(() => applyProjectCommand(project, {
      type: 'set-field', layerId: shield.id,
      field: { division: 'solid', colors: ['#1855A5'], pattern: 'solid', remote: true },
    } as never)).toThrow('remote');
  });

  it.each([
    ['', 'empty Base64'],
    ['A', 'malformed Base64'],
    ['not base64!', 'non-Base64 characters'],
  ])('rejects %s local upload data', (data) => {
    const project = createDefaultProject('en');

    expect(() => applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: { id: 'unsafe-upload', mimeType: 'image/png', encoding: 'base64', data },
    })).toThrow('local upload data');
  });

  it('rejects bytes whose content does not match the declared local upload MIME type', () => {
    const project = createDefaultProject('en');
    const safeSvgBase64 = btoa('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

    expect(() => applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: { id: 'wrong-mime', mimeType: 'image/png', encoding: 'base64', data: safeSvgBase64 },
    })).toThrow('image/png');
  });

  it('accepts safe local SVG bytes and rejects executable or externally referenced SVG', () => {
    const project = createDefaultProject('en');
    const safeSvgBase64 = encodeUtf8Base64('\ufeff  <svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');
    const scriptSvgBase64 = btoa('<svg><script>alert(1)</script></svg>');
    const remoteSvgBase64 = btoa('<svg><image href="https://example.com/crest.svg"/></svg>');

    expect(applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: { id: 'safe-svg', mimeType: 'image/svg+xml', encoding: 'base64', data: safeSvgBase64 },
    }).uploads).toHaveLength(1);
    for (const [id, data] of [['script-svg', scriptSvgBase64], ['remote-svg', remoteSvgBase64]] as const) {
      expect(() => applyProjectCommand(project, {
        type: 'register-local-upload',
        upload: { id, mimeType: 'image/svg+xml', encoding: 'base64', data },
      })).toThrow('SVG');
    }
  });

  it.each([
    ['relative href', '<svg><image href="crest.svg"/></svg>'],
    ['xlink href', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#crest"/></svg>'],
    ['entity-obfuscated CSS', '<svg><path style="fill: url&#40;#paint&#41;"/></svg>'],
    ['style block', '<svg><style>path { fill: red; }</style><path d="M0 0"/></svg>'],
    ['event attribute', '<svg><path onload="alert(1)" d="M0 0"/></svg>'],
    ['foreign object', '<svg><foreignObject/></svg>'],
    ['doctype entity', '<!DOCTYPE svg [<!ENTITY x "y">]><svg><path d="M0 0"/></svg>'],
  ])('rejects unsafe local SVG with %s', (_label, svg) => {
    const project = createDefaultProject('en');

    expect(() => applyProjectCommand(project, {
      type: 'register-local-upload',
      upload: { id: 'unsafe-svg', mimeType: 'image/svg+xml', encoding: 'base64', data: btoa(svg) },
    })).toThrow('SVG');
  });

  it('aligns explicit movable layer ids to their shared horizontal centre', () => {
    const project = createProjectWithMovableCharges();
    const movableLayerIds = project.layers.filter((layer) => layer.type === 'charge').map((layer) => layer.id);
    const positioned = {
      ...project,
      layers: project.layers.map((layer) => {
        const xById = new Map([[movableLayerIds[0], 20], [movableLayerIds[1], 50], [movableLayerIds[2], 80]]);
        const x = xById.get(layer.id);
        if (x === undefined) return layer;
        if (layer.type === 'background') throw new Error(`Expected movable layer: ${layer.id}`);
        return { ...layer, transform: { ...layer.transform, x } };
      }),
    };

    const aligned = applyProjectCommand(positioned, {
      type: 'align-layer-ids', axis: 'horizontal-centre', layerIds: movableLayerIds,
    } as never);

    expect(aligned.layers.filter((layer) => movableLayerIds.includes(layer.id)).map(getLayerTransformX)).toEqual([50, 50, 50]);
  });

  it('distributes explicit movable layer ids while retaining their outer bounds', () => {
    const project = createProjectWithMovableCharges();
    const movableLayerIds = project.layers.filter((layer) => layer.type === 'charge').map((layer) => layer.id);
    const positioned = {
      ...project,
      layers: project.layers.map((layer) => {
        const xById = new Map([[movableLayerIds[0], 10], [movableLayerIds[1], 40], [movableLayerIds[2], 90]]);
        const x = xById.get(layer.id);
        if (x === undefined) return layer;
        if (layer.type === 'background') throw new Error(`Expected movable layer: ${layer.id}`);
        return { ...layer, transform: { ...layer.transform, x } };
      }),
    };

    const distributed = applyProjectCommand(positioned, {
      type: 'distribute-layer-ids', axis: 'horizontal', layerIds: movableLayerIds,
    } as never);

    expect(distributed.layers.filter((layer) => movableLayerIds.includes(layer.id)).map(getLayerTransformX)).toEqual([10, 50, 90]);
  });

  it('moves, groups, changes visibility and opacity, and resizes explicit movable layer ids', () => {
    const project = createProjectWithMovableCharges();
    const movableLayerIds = project.layers.filter((layer) => layer.type === 'charge').map((layer) => layer.id);
    const reordered = applyProjectCommand(project, {
      type: 'move-layer-ids', direction: 'front', layerIds: [movableLayerIds[0]!],
    } as never);
    const hidden = applyProjectCommand(reordered, {
      type: 'set-layer-ids-visibility', layerIds: [movableLayerIds[0]!], visible: false,
    } as never);
    const grouped = applyProjectCommand(hidden, {
      type: 'group-layer-ids', groupId: 'arranged-charges', layerIds: movableLayerIds.slice(1),
    } as never);
    const resized = applyProjectCommand(grouped, {
      type: 'resize-layer-ids', layerIds: [movableLayerIds[1]!], width: 160, height: 80, keepAspectRatio: true,
    } as never);
    const faded = applyProjectCommand(resized, {
      type: 'set-layer-ids-opacity', layerIds: [movableLayerIds[1]!], opacity: 0.4,
    } as never);
    const ungrouped = applyProjectCommand(faded, {
      type: 'ungroup-layer-ids', layerIds: [movableLayerIds[1]!],
    } as never);

    expect(ungrouped.layers.at(-1)).toMatchObject({ id: movableLayerIds[0], visible: false });
    expect(ungrouped.layers.find((layer) => layer.id === movableLayerIds[1])).toMatchObject({
      groupId: null, transform: { scaleX: 1.6, scaleY: 1.6, opacity: 0.4 },
    });
  });

  it('moves selected layers to the back without displacing the immutable background', () => {
    const project = createProjectWithMovableCharges();
    const background = project.layers.find((layer) => layer.type === 'background');
    const selectedCharge = project.layers.find((layer) => layer.type === 'charge');
    if (!background || !selectedCharge) throw new Error('Expected background and charge layers');

    const movedToBack = applyProjectCommand(project, {
      type: 'move-layer-ids', direction: 'back', layerIds: [selectedCharge.id],
    } as never);

    expect(movedToBack.layers.map((layer) => layer.id)).toEqual([
      background.id,
      selectedCharge.id,
      ...project.layers.filter((layer) => layer.id !== background.id && layer.id !== selectedCharge.id).map((layer) => layer.id),
    ]);
  });

  it('rejects empty, non-movable, unknown, and locked arrangement layer ids with the offending value', () => {
    const project = createProjectWithMovableCharges();
    const movableLayerId = project.layers.find((layer) => layer.type === 'charge')?.id;
    const backgroundLayerId = project.layers.find((layer) => layer.type === 'background')?.id;
    if (!movableLayerId || !backgroundLayerId) throw new Error('Expected movable and background layers');
    const locked = applyProjectCommand(project, { type: 'set-layer-lock', layerId: movableLayerId, locked: true });

    expect(() => applyProjectCommand(project, {
      type: 'align-layer-ids', axis: 'left', layerIds: [],
    } as never)).toThrow('[]');
    expect(() => applyProjectCommand(project, {
      type: 'align-layer-ids', axis: 'left', layerIds: [backgroundLayerId],
    } as never)).toThrow(backgroundLayerId);
    expect(() => applyProjectCommand(project, {
      type: 'align-layer-ids', axis: 'left', layerIds: ['missing-arrange-layer'],
    } as never)).toThrow('missing-arrange-layer');
    expect(() => applyProjectCommand(locked, {
      type: 'align-layer-ids', axis: 'left', layerIds: [movableLayerId],
    } as never)).toThrow(movableLayerId);
  });

  it('persists a validated local background gradient without accepting invalid colours or angles', () => {
    const project = createDefaultProject('en');
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!background || background.type !== 'background') throw new Error('Expected background layer');

    const withGradient = applyProjectCommand(project, {
      type: 'set-background', assetId: background.assetId, gradient: { angle: 45, startColor: '#004E89', endColor: '#B11F24' },
    } as never);

    expect(withGradient.layers[0]).toMatchObject({
      gradient: { angle: 45, startColor: '#004E89', endColor: '#B11F24' },
    });
    expect(() => applyProjectCommand(project, {
      type: 'set-background', assetId: background.assetId, gradient: { angle: -1, startColor: '#004E89', endColor: '#B11F24' },
    } as never)).toThrow('-1');
    expect(() => applyProjectCommand(project, {
      type: 'set-background', assetId: background.assetId, gradient: { angle: 45, startColor: 'bad-colour', endColor: '#B11F24' },
    } as never)).toThrow('bad-colour');
  });

  it('sets, clears, and duplicates a layer display name without requiring the layer to be unlocked', () => {
    const project = createProjectWithMovableCharges();
    const charge = project.layers.at(-1);
    const background = project.layers.find((layer) => layer.type === 'background');
    if (!charge || charge.type !== 'charge' || !background) throw new Error('Expected charge and background layers');
    const renamed = applyProjectCommand(project, {
      type: 'set-layer-display-name', layerId: charge.id, displayName: '  Dexter lion  ',
    });
    expect(renamed.layers.find((layer) => layer.id === charge.id)).toMatchObject({ displayName: 'Dexter lion' });

    const locked = applyProjectCommand(renamed, { type: 'set-layer-lock', layerId: charge.id, locked: true });
    const renamedWhileLocked = applyProjectCommand(locked, {
      type: 'set-layer-display-name', layerId: charge.id, displayName: 'Locked lion',
    });
    expect(renamedWhileLocked.layers.find((layer) => layer.id === charge.id)).toMatchObject({
      displayName: 'Locked lion', locked: true,
    });

    const renamedBackground = applyProjectCommand(renamed, {
      type: 'set-layer-display-name', layerId: background.id, displayName: 'Field',
    });
    expect(renamedBackground.layers.find((layer) => layer.id === background.id)).toMatchObject({ displayName: 'Field' });

    const duplicated = applyProjectCommand(renamed, {
      type: 'duplicate-layers', sourceLayerIds: [charge.id], newLayerIds: ['renamed-charge-copy'],
    });
    expect(duplicated.layers.find((layer) => layer.id === 'renamed-charge-copy')).toMatchObject({
      displayName: 'Dexter lion',
    });

    const cleared = applyProjectCommand(renamed, {
      type: 'set-layer-display-name', layerId: charge.id, displayName: '   ',
    });
    expect(cleared.layers.find((layer) => layer.id === charge.id)).not.toHaveProperty('displayName');
    expect(assertCoatProject(createDefaultProject('en'))).toBeUndefined();

    const tooLongName = 'x'.repeat(121);
    expect(() => applyProjectCommand(project, {
      type: 'set-layer-display-name', layerId: charge.id, displayName: tooLongName,
    })).toThrow(tooLongName);
    expect(() => applyProjectCommand(project, {
      type: 'set-layer-display-name', layerId: 'missing-rename-layer', displayName: 'Scout',
    })).toThrow('missing-rename-layer');
    expect(() => applyProjectCommand(project, {
      type: 'set-layer-display-name', layerId: charge.id, displayName: 12 as never,
    })).toThrow('12');
  });

  it('round-trips rasterTint on geometry layers and rejects illegal values with the actual value', () => {
    const project = applyProjectCommand(createDefaultProject('en'), {
      type: 'add-layer', assetId: 'material-symbol-alchemical-fire',
    });
    const charge = project.layers.at(-1);
    if (!charge || charge.type !== 'charge') throw new Error('Expected raster charge layer');
    expect(charge).not.toHaveProperty('rasterTint');

    const tinted = applyProjectCommand(project, {
      type: 'update-layer', layerId: charge.id, patch: { rasterTint: true },
    });
    expect(tinted.layers.at(-1)).toMatchObject({ rasterTint: true });

    const duplicated = applyProjectCommand(tinted, {
      type: 'duplicate-layers', sourceLayerIds: [charge.id], newLayerIds: ['tinted-charge-copy'],
    });
    expect(duplicated.layers.find((layer) => layer.id === 'tinted-charge-copy')).toMatchObject({
      rasterTint: true,
    });

    const untinted = applyProjectCommand(tinted, {
      type: 'update-layer', layerId: charge.id, patch: { rasterTint: false },
    });
    expect(untinted.layers.at(-1)).toMatchObject({ rasterTint: false });
    expect(assertCoatProject(tinted)).toBeUndefined();
    expect(assertCoatProject(untinted)).toBeUndefined();

    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: charge.id, patch: { rasterTint: 'yes' as never },
    })).toThrow('Invalid raster tint: yes');
    expect(() => applyProjectCommand(project, {
      type: 'update-layer', layerId: charge.id, patch: { rasterTint: 1 as never },
    })).toThrow('Invalid raster tint: 1');

    const persistedInvalidProject = {
      ...project,
      layers: project.layers.map((layer) => (
        layer.id === charge.id ? { ...layer, rasterTint: 'yes' as never } : layer
      )),
    };
    expect(() => assertCoatProject(persistedInvalidProject)).toThrow('Invalid raster tint: yes');
    expect(() => assertCoatProject({
      ...project,
      layers: project.layers.map((layer) => (
        layer.id === charge.id ? { ...layer, rasterTint: null as never } : layer
      )),
    })).toThrow('Invalid raster tint: null');
  });
});
