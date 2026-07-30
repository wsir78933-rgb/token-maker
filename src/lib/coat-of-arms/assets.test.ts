import { describe, expect, it } from 'vitest';
import { createCoatMakerShowcaseProject, createDefaultProject, getCoatAsset, listAssetsByKind } from './assets';
import type { ChargeAssetCategory } from './types';

const requiredChargeCategories: readonly ChargeAssetCategory[] = [
  'animal',
  'object',
  'plant',
  'human',
  'symbol',
];

describe('coat asset catalog', () => {
  it('gives every replaced symbol material two locally bundled WebP variants', () => {
    const sun = getCoatAsset('symbol-charge-1');
    if (sun.kind !== 'charge') throw new Error(`Expected a symbol charge, received ${sun.kind}`);

    expect(sun.rasterVariants).toEqual([
      { id: 'a', src: '/coat-assets/generated/symbols/symbol-sun-plain-a.webp' },
      { id: 'b', src: '/coat-assets/generated/symbols/symbol-sun-plain-b.webp' },
    ]);
  });

  it('creates the target editor showcase with local bundled layers', () => {
    const project = createCoatMakerShowcaseProject('en');

    expect(project.layers).toMatchObject([
      { type: 'background', fill: '#FFFFFF' },
      { type: 'shield', assetId: 'heater-shield', field: { division: 'solid', colors: ['#F6C700'] } },
      { type: 'charge', assetId: 'winged-dragon', color: '#28753A' },
      { type: 'charge', assetId: 'golden-lion', color: '#8A451B' },
    ]);
  });

  it('exposes a local shield and a local charge without a remote source', () => {
    const shield = getCoatAsset('heater-shield');
    const charge = getCoatAsset('golden-lion');

    expect(shield.kind).toBe('shield');
    expect(charge.kind).toBe('charge');
    expect(shield.sourceUrl).toBeUndefined();
    expect(charge.sourceUrl).toBeUndefined();
  });

  it('keeps the two default animal materials as distinct locally authored silhouettes', () => {
    const dragon = getCoatAsset('winged-dragon');
    const lion = getCoatAsset('golden-lion');

    if (dragon.kind !== 'charge' || lion.kind !== 'charge') {
      throw new Error(`Expected charge assets, received ${dragon.kind} and ${lion.kind}`);
    }

    expect(dragon.svgPath).toContain('C');
    expect(lion.svgPath).toContain('C');
    expect(dragon.svgPath).not.toBe(lion.svgPath);
    expect(dragon.sourceUrl).toBeUndefined();
    expect(lion.sourceUrl).toBeUndefined();
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

  it('makes reference shield, charge, and exterior categories available through the public asset lookup', () => {
    expect(listAssetsByKind('shield')).toHaveLength(234);
    expect(listAssetsByKind('charge')).toHaveLength(813);
    expect(listAssetsByKind('top')).toHaveLength(245);
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

    expect(charges).toHaveLength(813);

    for (const category of requiredChargeCategories) {
      expect(charges.filter((charge) => charge.category === category).length).toBeGreaterThanOrEqual(10);
    }

    for (const charge of charges) {
      expect(charge.sourceUrl).toBeUndefined();
      expect(charge.svgPath).toMatch(/^M/);
      expect(charge.svgPath).not.toMatch(/(?:https?:|www\.|data:|url\()/i);
    }
  });

  it('offers a wider local ordinary and exterior collection without replacing existing defaults', () => {
    const ordinaryIds = listAssetsByKind('ordinary').map((asset) => asset.id);
    const topIds = listAssetsByKind('top').map((asset) => asset.id);

    expect(ordinaryIds).toEqual(expect.arrayContaining([
      'diagonal-band', 'chevron', 'horizontal-band', 'vertical-pale', 'cross-ordinary',
      'saltire-ordinary', 'bordure-ordinary', 'pile-ordinary',
    ]));
    expect(topIds).toEqual(expect.arrayContaining([
      'royal-crown', 'ceremonial-mantle', 'lion-supporter', 'heraldic-helm',
      'ducal-coronet', 'laurel-wreath', 'griffin-supporter', 'scroll-compartment',
    ]));
  });

  it('includes locally authored French, banner, and lozenge shield outlines', () => {
    const shieldIds = listAssetsByKind('shield').map((shield) => shield.id);

    expect(shieldIds).toEqual(expect.arrayContaining(['french-shield', 'banner-shield', 'lozenge-shield']));
  });

  it('keeps geometry on drawing assets and fill colors on backgrounds', () => {
    for (const kind of ['shield', 'ordinary', 'charge'] as const) {
      for (const asset of listAssetsByKind(kind)) {
        expect(asset.svgPath).toMatch(/^M/);
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
    expect(project.canvas).toEqual({ width: 1200, height: 1200 });
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
        transform: { x: 0, y: 0, scale: 1, rotation: 0 },
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
