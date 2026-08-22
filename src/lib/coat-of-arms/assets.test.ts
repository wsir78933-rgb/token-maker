import { describe, expect, it } from 'vitest';
import { createCoatMakerShowcaseProject, createDefaultProject, createInitialCoatProject, getCoatAsset, listAssetsByKind, listShieldSilhouetteAssets, requireShieldSilhouetteAssetId } from './assets';
import type { ChargeAssetCategory } from './types';

const requiredChargeCategories: readonly ChargeAssetCategory[] = [
  'animal',
  'object',
  'plant',
  'human',
  'symbol',
];

describe('coat asset catalog', () => {
  it('exposes one bundled WebP material for every replacement category', () => {
    const wolf = getCoatAsset('material-animal-wolf-rampant');
    if (wolf.kind !== 'charge') throw new Error(`Expected an animal charge, received ${wolf.kind}`);

    expect(wolf.rasterSrc).toBe('/coat-assets/materials/animals/wolf-rampant.webp');
    expect(wolf.svgPath).toBeUndefined();
  });

  it('creates the target editor showcase with local bundled layers', () => {
    const project = createCoatMakerShowcaseProject('en');

    expect(project.canvas).toEqual({ width: 1800, height: 1080 });
    expect(project.layers).toMatchObject([
      { type: 'background', fill: '#FFFFFF' },
      { type: 'shield', assetId: 'heater-shield', field: { division: 'solid', colors: ['#F6C700'] }, transform: { x: 0, y: 0, scale: 0.935, rotation: 0 } },
      { type: 'charge', assetId: 'material-animal-dragon-passant', color: '#28753A' },
      { type: 'charge', assetId: 'material-animal-wolf-rampant', color: '#8A451B' },
    ]);
  });

  it('creates the initial coat-maker document on the 3:5 canvas with a smaller default heater', () => {
    const project = createInitialCoatProject();

    expect(project.canvas).toEqual({ width: 1800, height: 1080 });
    expect(project.layers[1]).toMatchObject({
      type: 'shield',
      assetId: 'heater-shield',
      transform: { x: 0, y: 0, scale: 0.935, rotation: 0 },
    });
  });

  it('exposes a local shield and a local WebP charge without a remote source', () => {
    const shield = getCoatAsset('heater-shield');
    const charge = getCoatAsset('material-animal-wolf-rampant');

    expect(shield.kind).toBe('shield');
    expect(charge.kind).toBe('charge');
    expect(shield.sourceUrl).toBeUndefined();
    expect(charge.sourceUrl).toBeUndefined();
  });

  it('keeps the two default animal materials as distinct local WebP files', () => {
    const dragon = getCoatAsset('material-animal-dragon-passant');
    const wolf = getCoatAsset('material-animal-wolf-rampant');

    if (dragon.kind !== 'charge' || wolf.kind !== 'charge') {
      throw new Error(`Expected charge assets, received ${dragon.kind} and ${wolf.kind}`);
    }

    expect(dragon.rasterSrc).toBe('/coat-assets/materials/animals/dragon-passant.webp');
    expect(wolf.rasterSrc).toBe('/coat-assets/materials/animals/wolf-rampant.webp');
    expect(dragon.rasterSrc).not.toBe(wolf.rasterSrc);
    expect(dragon.sourceUrl).toBeUndefined();
    expect(wolf.sourceUrl).toBeUndefined();
  });

  it('rejects an unknown asset id with the invalid id in the error', () => {
    expect(() => getCoatAsset('not-an-asset')).toThrow('not-an-asset');
  });

  it('rejects a non-string asset id with a stable domain error', () => {
    expect(() => getCoatAsset(Symbol('crown') as never)).toThrow(
      'Invalid coat asset id: Symbol(crown)',
    );
  });

  it('keeps categories available for the full editor workflow', () => {
    expect(listAssetsByKind('ordinary').length).toBeGreaterThan(0);
    expect(listAssetsByKind('charge').length).toBeGreaterThan(0);
  });

  it('keeps 17 base shields and registers 234 original SVG shield materials', () => {
    expect(listAssetsByKind('shield')).toHaveLength(251);
    expect(getCoatAsset('heater-002')).toMatchObject({
      kind: 'shield',
      staticImageSrc: '/coat-assets/materials/shields/heater/heater-002.svg',
    });
    expect(listAssetsByKind('charge')).toHaveLength(119);
    expect(listAssetsByKind('ordinary')).toHaveLength(27);
    expect(listAssetsByKind('top')).toHaveLength(57);
  });

  it('offers multiple local choices for every editor catalog category', () => {
    expect(listAssetsByKind('shield').length).toBeGreaterThan(2);
    expect(listAssetsByKind('ordinary').length).toBeGreaterThan(2);
    expect(listAssetsByKind('charge').length).toBeGreaterThan(2);
    expect(listAssetsByKind('pattern').length).toBeGreaterThan(2);
    expect(listAssetsByKind('background').length).toBeGreaterThan(2);
  });

  it('stocks a broad original local charge catalogue for every editor category', () => {
    const charges = listAssetsByKind('charge');

    expect(charges).toHaveLength(119);

    const expectedChargeCounts: Record<ChargeAssetCategory, number> = {
      animal: 18,
      object: 35,
      plant: 20,
      human: 22,
      symbol: 24,
    };
    for (const category of requiredChargeCategories) {
      expect(charges.filter((charge) => charge.category === category)).toHaveLength(expectedChargeCounts[category]);
    }

    for (const charge of charges) {
      expect(charge.sourceUrl).toBeUndefined();
      expect(charge.rasterSrc).toMatch(/^\/coat-assets\/materials\//);
      expect(charge.rasterSrc).toMatch(/\.webp$/);
      expect(charge.svgPath).toBeUndefined();
    }
  });

  it('replaces the ordinary and exterior defaults with their WebP catalogues', () => {
    expectRasterSource('material-ordinary-billetty', '/coat-assets/materials/ordinaries/billetty.webp');
    expectRasterSource('material-crown-archducal-coronet', '/coat-assets/materials/crowns/archducal-coronet.webp');
    expectRasterSource('material-mantle-astrakhan-mantle', '/coat-assets/materials/mantles/astrakhan-mantle.webp');
    expectRasterSource('material-supporter-paired-cockatrices', '/coat-assets/materials/supporters/paired-cockatrices.webp');
    expectRasterSource('material-other-bascinet-helm', '/coat-assets/materials/other/bascinet-helm.webp');
  });

  it('includes locally authored French, banner, and lozenge shield outlines', () => {
    const shieldIds = listAssetsByKind('shield').map((shield) => shield.id);

    expect(shieldIds).toEqual(expect.arrayContaining(['french-shield', 'banner-shield', 'lozenge-shield']));
  });

  it('keeps geometry on drawing assets and fill colors on backgrounds', () => {
    for (const asset of listAssetsByKind('shield')) {
        expect(asset.svgPath).toMatch(/^M/);
    }
    for (const kind of ['ordinary', 'charge'] as const) {
      for (const asset of listAssetsByKind(kind)) {
        expect(asset.rasterSrc).toMatch(/\.webp$/);
      }
    }

    for (const asset of listAssetsByKind('background')) {
      expect(asset.fill).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('narrows category results to the required local asset payload', () => {
    const shield = listAssetsByKind('shield')[0];
    const ordinary = listAssetsByKind('ordinary')[0];
    const background = listAssetsByKind('background')[0];
    const shieldKind: 'shield' = shield.kind;
    const ordinaryKind: 'ordinary' = ordinary.kind;

    expect(shieldKind).toBe('shield');
    expect(ordinaryKind).toBe('ordinary');
    expect(shield.svgPath).toMatch(/^M/);
    expect(background.fill).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('maps the checkered catalog asset to the field pattern it renders', () => {
    const checks = getCoatAsset('checkered-field');

    expect(checks.kind).toBe('pattern');
    if (checks.kind !== 'pattern') {
      throw new Error(`Expected pattern asset, received ${checks.kind}`);
    }
    expect(checks.fieldPattern).toBe('checks');
  });

  it('returns clones so callers cannot mutate the shared local catalog', () => {
    const firstShield = getCoatAsset('heater-shield');
    firstShield.name.en = 'Changed by caller';

    expect(getCoatAsset('heater-shield').name.en).toBe('Heater shield');
  });

  it('lists 17 local shield silhouettes with unique closed authored SVG paths', () => {
    expect(listShieldSilhouetteAssets().map((asset) => asset.id)).toEqual([
      'heater-shield',
      'round-shield',
      'kite-shield',
      'french-shield',
      'banner-shield',
      'lozenge-shield',
      'targe-shield',
      'buckler-shield',
      'scalloped-shield',
      'arched-shield',
      'pointed-shield',
      'ogee-shield',
      'embattled-shield',
      'notched-shield',
      'cuirass-shield',
      'swallowtail-shield',
      'oval-shield',
    ]);
    const silhouettes = listShieldSilhouetteAssets();
    expect(new Set(silhouettes.map((asset) => asset.id)).size).toBe(17);
    for (const asset of silhouettes) {
      expect(asset.svgPath.length).toBeGreaterThan(0);
      expect(asset.svgPath).toMatch(/^M/);
      expect(asset.svgPath).toMatch(/[Zz]\s*$/);
      const pathCoordinates = asset.svgPath.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
      expect(Math.min(...pathCoordinates), asset.id).toBeGreaterThanOrEqual(0);
      expect(Math.max(...pathCoordinates), asset.id).toBeLessThanOrEqual(110);
    }
  });

  it('rejects an unknown shield silhouette with the offending value', () => {
    expect(() => requireShieldSilhouetteAssetId('heater-001')).toThrow('heater-001');
  });

  it('rejects an invalid asset kind with the rejected value', () => {
    expect(() => listAssetsByKind('crest' as never)).toThrow('crest');
  });

  it('rejects an invalid project locale with the rejected value', () => {
    expect(() => createDefaultProject('fr' as never)).toThrow('fr');
  });

  it('creates a localized renderable project with a canvas and local background', () => {
    const project = createDefaultProject('zh');

    expect(project.locale).toBe('zh');
    expect(project.name).toBe('我的徽章');
    expect(project.canvas).toEqual({ width: 1800, height: 1080 });
    expect(project.palette).toEqual([]);
    expect(project.uploads).toEqual([]);
    expect(project.layers).toEqual([
      {
        id: expect.any(String),
        type: 'background',
        assetId: 'ivory-background',
        motif: 'solid',
        opacity: 1,
        visible: true,
        locked: false,
        groupId: null,
      },
      {
        id: expect.any(String),
        type: 'shield',
        assetId: 'heater-shield',
        field: {
          division: 'solid',
          colors: ['#1855A5'],
          pattern: 'solid',
        },
        transform: { x: 0, y: 0, scale: 0.935, rotation: 0 },
        visible: true,
        locked: false,
        groupId: null,
      },
    ]);
  });

  it('creates unique project and layer ids for independent editor documents', () => {
    const firstProject = createDefaultProject('en');
    const secondProject = createDefaultProject('en');
    const allIds = [
      firstProject.id,
      secondProject.id,
      ...firstProject.layers.map((layer) => layer.id),
      ...secondProject.layers.map((layer) => layer.id),
    ];

    expect(new Set(allIds).size).toBe(allIds.length);
    for (const id of allIds) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    }
  });

  it('persists local upload metadata alongside image layers without remote URLs', () => {
    const project = createDefaultProject('en');
    const persistedProject = {
      ...project,
      uploads: [
        {
          id: '0d4c8df0-2fb5-4e60-b33c-5d81a16f2bd4',
          mimeType: 'image/png',
          encoding: 'base64',
          data: 'iVBORw0KGgo=',
        },
      ],
      layers: [
        ...project.layers,
        {
          id: '6e47b470-70e1-48c2-8cb2-7e9bdc6ebed6',
          type: 'image',
          source: 'local-upload',
          uploadId: '0d4c8df0-2fb5-4e60-b33c-5d81a16f2bd4',
          mimeType: 'image/png',
          opacity: 1,
          transform: { x: 0, y: 0, scale: 1, rotation: 0 },
          visible: true,
          locked: false,
          groupId: null,
        },
      ],
    };
    const restoredProject = JSON.parse(JSON.stringify(persistedProject));

    expect(restoredProject.uploads[0]).toEqual(persistedProject.uploads[0]);
    expect(restoredProject.layers.at(-1)).toMatchObject({
      type: 'image',
      source: 'local-upload',
      uploadId: restoredProject.uploads[0].id,
    });
  });
});

function expectRasterSource(assetId: string, expectedSource: string): void {
  const asset = getCoatAsset(assetId);
  if (!('rasterSrc' in asset) || typeof asset.rasterSrc !== 'string') {
    throw new Error(`Expected WebP material asset: ${assetId}`);
  }
  expect(asset.rasterSrc).toBe(expectedSource);
}
