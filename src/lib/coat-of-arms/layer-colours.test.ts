import { afterEach, describe, expect, it, vi } from 'vitest';
import * as assetLibrary from './assets';
import { resolveFieldRegions } from './field-regions';
import { getEditableLayerColours, replaceEditableLayerColour } from './layer-colours';
import type { CoatLayer, OrdinaryLayer, ShieldLayer } from './types';

const layerMetadata = { visible: true, locked: false, groupId: null } as const;
const transform = { x: 0, y: 0, scale: 1, rotation: 0 } as const;

afterEach(() => {
  vi.restoreAllMocks();
});

function createShieldLayer(): ShieldLayer {
  return {
    id: 'shield-layer', type: 'shield', assetId: 'heater-shield', ...layerMetadata, transform,
    field: {
      division: 'quarterly', colors: ['#b11f24', '#1855A5'], pattern: 'solid',
      regions: {
        q1: { colors: ['#B11F24', '#CAFE00'], pattern: 'solid' },
        q2: { colors: ['#1855A5', '#123456'], pattern: 'stripes' },
      },
      ornaments: [{
        id: 'fess', kind: 'fess', color: '#f5e6a1', colors: ['#123456', '#B11F24'],
        x: 0, y: 0, scale: 1, rotation: 0,
      }],
    },
  };
}

function createMultipartLayer(): OrdinaryLayer {
  return {
    id: 'multipart-layer', type: 'ordinary', assetId: 'multipart-ordinary', color: '#B11F24',
    colorReplacements: { '#222222': '#1855A5' }, ...layerMetadata, transform,
  };
}

function mockMultipartOrdinaryAsset(): void {
  vi.spyOn(assetLibrary, 'getCoatAsset').mockReturnValue({
    id: 'multipart-ordinary', kind: 'ordinary', name: { en: 'Multipart ordinary', zh: '多部件普通图形' },
    svgPath: 'M0 0',
    svgParts: [
      { svgPath: 'M0 0', sourceColor: '#111111' },
      { svgPath: 'M1 1', sourceColor: '#222222' },
      { svgPath: 'M2 2', sourceColor: '#222222' },
      { svgPath: 'M3 3', sourceColor: '#b11f24' },
    ],
  });
}

describe('editable rendered layer colours', () => {
  it('extracts resolved shield regions and gradient ornament colours in rendered order with case-insensitive deduplication', () => {
    expect(getEditableLayerColours(createShieldLayer())).toEqual([
      '#B11F24', '#1855A5', '#123456', '#1E293B',
    ]);
  });

  it('uses only the rendered legacy field slots for solid, divided, and patterned fields', () => {
    const layer = createShieldLayer();
    const legacySolidLayer: ShieldLayer = {
      ...layer,
      field: { ...layer.field, division: 'solid', pattern: 'solid', colors: ['#111111', '#222222', '#333333'], regions: undefined },
    };
    const legacyDividedLayer: ShieldLayer = {
      ...legacySolidLayer,
      field: { ...legacySolidLayer.field, division: 'per-pale', colors: ['#111111', '#222222', '#333333'] },
    };
    const legacyPatternedLayer: ShieldLayer = {
      ...legacySolidLayer,
      field: { ...legacySolidLayer.field, pattern: 'stripes', colors: ['#111111', '#222222', '#333333'] },
    };

    expect(getEditableLayerColours(legacySolidLayer)).toEqual(['#111111', '#123456', '#B11F24', '#1E293B']);
    expect(getEditableLayerColours(legacyDividedLayer)).toEqual(['#111111', '#222222', '#123456', '#B11F24', '#1E293B']);
    expect(getEditableLayerColours(legacyPatternedLayer)).toEqual(['#111111', '#222222', '#123456', '#B11F24', '#1E293B']);

    const solidReplacement = replaceEditableLayerColour(legacySolidLayer, '#111111', '#004E89');
    if (solidReplacement.type !== 'shield') throw new Error('Expected legacy solid shield replacement');
    expect(solidReplacement.field.colors).toEqual(['#004E89', '#222222', '#333333']);
    expect(() => replaceEditableLayerColour(legacySolidLayer, '#333333', '#004E89')).toThrow(
      'Editable layer colour source not found: #333333 on layer shield-layer',
    );
  });

  it('uses only fully explicit rendered regions instead of inactive legacy field and gradient fallback colours', () => {
    const layer = createShieldLayer();
    const fullyRegionalLayer: ShieldLayer = {
      ...layer,
      field: {
        ...layer.field,
        colors: ['#AAAAAA', '#BBBBBB'],
        regions: {
          q1: { colors: ['#111111'], pattern: 'solid' },
          q2: { colors: ['#222222'], pattern: 'solid' },
          q3: { colors: ['#333333'], pattern: 'solid' },
          q4: { colors: ['#444444'], pattern: 'solid' },
        },
        ornaments: [{
          id: 'gradient-fess', kind: 'fess', color: '#F5E6A1', colors: ['#123456', '#654321'],
          x: 0, y: 0, scale: 1, rotation: 0,
        }],
      },
    };

    expect(getEditableLayerColours(fullyRegionalLayer)).toEqual([
      '#111111', '#222222', '#333333', '#444444', '#123456', '#654321', '#1E293B',
    ]);
    expect(() => replaceEditableLayerColour(fullyRegionalLayer, '#BBBBBB', '#004E89')).toThrow(
      'Editable layer colour source not found: #BBBBBB on layer shield-layer',
    );
    const replaced = replaceEditableLayerColour(fullyRegionalLayer, '#222222', '#004E89');
    if (replaced.type !== 'shield') throw new Error('Expected fully regional shield replacement');
    expect(replaced.field).toMatchObject({
      colors: ['#AAAAAA', '#BBBBBB'],
      regions: { q2: { colors: ['#004E89'] } },
      ornaments: [{ color: '#F5E6A1', colors: ['#123456', '#654321'] }],
    });
  });

  it('uses only the first two colours of a patterned region and preserves its inactive extra colour', () => {
    const layer = createShieldLayer();
    const patternedRegionalLayer: ShieldLayer = {
      ...layer,
      field: {
        ...layer.field,
        regions: {
          q1: { colors: ['#111111', '#222222', '#333333'], pattern: 'stripes' },
          q2: { colors: ['#444444'], pattern: 'solid' },
          q3: { colors: ['#555555'], pattern: 'solid' },
          q4: { colors: ['#666666'], pattern: 'solid' },
        },
      },
    };

    expect(getEditableLayerColours(patternedRegionalLayer)).toEqual([
      '#111111', '#222222', '#444444', '#555555', '#666666', '#123456', '#B11F24', '#1E293B',
    ]);
    const replaced = replaceEditableLayerColour(patternedRegionalLayer, '#222222', '#004E89');
    if (replaced.type !== 'shield') throw new Error('Expected patterned regional shield replacement');
    expect(replaced.field.regions?.q1?.colors).toEqual(['#111111', '#004E89', '#333333']);
    expect(() => replaceEditableLayerColour(patternedRegionalLayer, '#333333', '#004E89')).toThrow(
      'Editable layer colour source not found: #333333 on layer shield-layer',
    );
  });

  it('extracts the effective colours of multipart vectors in source-part order', () => {
    mockMultipartOrdinaryAsset();

    expect(getEditableLayerColours(createMultipartLayer())).toEqual(['#B11F24', '#1855A5']);
  });

  it('extracts text and drawing colours', () => {
    const textLayer: CoatLayer = {
      id: 'text-layer', type: 'text', text: 'HONOUR', color: '#F5E6A1', fontSize: 24,
      alignment: 'center', path: { mode: 'none' }, ...layerMetadata, transform,
    };
    const drawLayer: CoatLayer = {
      id: 'draw-layer', type: 'draw', path: 'M 0 0 L 1 1', color: '#004E89', strokeWidth: 3,
      ...layerMetadata, transform,
    };

    expect(getEditableLayerColours(textLayer)).toEqual(['#F5E6A1']);
    expect(getEditableLayerColours(drawLayer)).toEqual(['#004E89']);
  });

  it('returns no editable colours for bundled raster, static shield, image, and background layers', () => {
    const rasterLayer: CoatLayer = {
      id: 'raster-layer', type: 'ordinary', assetId: 'material-ordinary-chevron', color: '#B11F24',
      ...layerMetadata, transform,
    };
    const staticShieldLayer = { ...createShieldLayer(), assetId: 'heater-002' };
    const imageLayer: CoatLayer = {
      id: 'image-layer', type: 'image', source: 'local-upload', uploadId: 'upload', mimeType: 'image/png', opacity: 1,
      ...layerMetadata, transform,
    };
    const backgroundLayer: CoatLayer = {
      id: 'background-layer', type: 'background', assetId: 'azure-background', motif: 'solid', opacity: 1,
      ...layerMetadata,
    };

    expect(getEditableLayerColours(rasterLayer)).toEqual([]);
    expect(getEditableLayerColours(staticShieldLayer)).toEqual([]);
    expect(getEditableLayerColours(imageLayer)).toEqual([]);
    expect(getEditableLayerColours(backgroundLayer)).toEqual([]);
  });

  it('materializes only matching implicit shield regions and preserves unmatched region fallbacks', () => {
    const replaced = replaceEditableLayerColour(createShieldLayer(), '#b11f24', '#004E89');
    if (replaced.type !== 'shield') throw new Error('Expected shield replacement');

    expect(replaced.field.colors).toEqual(['#b11f24', '#1855A5']);
    expect(replaced.field.regions).toEqual({
      q1: { colors: ['#004E89', '#CAFE00'], pattern: 'solid' },
      q2: { colors: ['#1855A5', '#123456'], pattern: 'stripes' },
      q4: { colors: ['#004E89'], pattern: 'solid', patternScale: 1 },
    });
    expect(replaced.field.ornaments).toMatchObject([{ color: '#f5e6a1', colors: ['#123456', '#004E89'] }]);
    expect(replaced.field.regions?.q3).toBeUndefined();
    expect(resolveFieldRegions({ ...replaced.field, colors: ['#112233', '#445566'] }).find((region) => region.id === 'q3')?.style.colors).toEqual(['#445566']);
    expect(replaced.field.outline).toBeUndefined();

    const outlineReplaced = replaceEditableLayerColour(createShieldLayer(), '#1e293b', '#004E89');
    if (outlineReplaced.type !== 'shield') throw new Error('Expected shield outline replacement');
    expect(outlineReplaced.field.outline).toEqual({ visible: true, color: '#004E89', width: 1.5 });
  });

  it('replaces every multipart source part with the requested effective colour', () => {
    mockMultipartOrdinaryAsset();

    const replaced = replaceEditableLayerColour(createMultipartLayer(), '#1855a5', '#F5E6A1');

    expect(replaced).toMatchObject({ colorReplacements: { '#222222': '#F5E6A1' } });
  });

  it('rejects a multipart replacement that would override an unmatched first part sharing the source colour', () => {
    vi.spyOn(assetLibrary, 'getCoatAsset').mockReturnValue({
      id: 'shared-first-source', kind: 'ordinary', name: { en: 'Shared source', zh: '共享源色' },
      svgPath: 'M0 0',
      svgParts: [
        { svgPath: 'M0 0', sourceColor: '#111111' },
        { svgPath: 'M1 1', sourceColor: '#111111' },
      ],
    });
    const layer: OrdinaryLayer = {
      ...createMultipartLayer(), id: 'shared-first-layer', assetId: 'shared-first-source',
      color: '#B11F24', colorReplacements: undefined,
    };

    expect(() => replaceEditableLayerColour(layer, '#111111', '#F5E6A1')).toThrow(
      'Cannot replace multipart layer colour without changing first part: layer shared-first-layer, from #111111, source #111111',
    );
    expect(layer.color).toBe('#B11F24');
    expect(layer.colorReplacements).toBeUndefined();
  });

  it('rejects a replacement colour that the layer does not render', () => {
    expect(() => replaceEditableLayerColour(createShieldLayer(), '#FFFFFF', '#004E89')).toThrow(
      'Editable layer colour source not found: #FFFFFF on layer shield-layer',
    );
  });
});
