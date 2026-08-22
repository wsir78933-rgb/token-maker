import type {
  BackgroundLayer,
  CanvasTransform,
  ChargeLayer,
  CoatAsset,
  CoatAssetByKind,
  CoatAssetKind,
  CoatLayer,
  CoatLocale,
  CoatProject,
  ShieldLayer,
} from './types';
import { createLocalCoatId } from './id';
import { isShieldMaterialAssetId, getShieldMaterialPaintColours } from './shield-material-paints';
import { listReferenceCatalogEntries, shieldReferenceCategories } from './reference-catalog';
import { webpMaterialAssets } from './webp-material-catalog';

export const shieldSilhouetteAssetIds = [
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
] as const;

export type ShieldSilhouetteAssetId = typeof shieldSilhouetteAssetIds[number];

const validAssetKinds: readonly CoatAssetKind[] = [
  'shield',
  'ordinary',
  'charge',
  'top',
  'pattern',
  'background',
];
const validLocales: readonly CoatLocale[] = ['en', 'zh'];
const initialCoatProjectIds = {
  project: '00000000-0000-4000-8000-000000000001',
  backgroundLayer: '00000000-0000-4000-8000-000000000002',
  shieldLayer: '00000000-0000-4000-8000-000000000003',
  dragonLayer: '00000000-0000-4000-8000-000000000004',
  lionLayer: '00000000-0000-4000-8000-000000000005',
} as const;

const localCoatAssets: readonly CoatAsset[] = [
  {
    id: 'heater-shield',
    kind: 'shield',
    name: { en: 'Heater shield', zh: '熨斗盾' },
    svgPath: 'M50 2 L94 16 V58 C94 80 76 94 50 108 C24 94 6 80 6 58 V16 Z',
  },
  {
    id: 'round-shield',
    kind: 'shield',
    name: { en: 'Round shield', zh: '圆盾' },
    svgPath: 'M50 3 C76 3 96 21 96 45 C96 77 72 96 50 108 C28 96 4 77 4 45 C4 21 24 3 50 3 Z',
  },
  {
    id: 'kite-shield',
    kind: 'shield',
    name: { en: 'Kite shield', zh: '鸢盾' },
    svgPath: 'M50 2 L86 18 V55 C86 81 69 97 50 108 C31 97 14 81 14 55 V18 Z',
  },
  {
    id: 'french-shield',
    kind: 'shield',
    name: { en: 'French shield', zh: '法式盾' },
    svgPath: 'M50 3 C76 3 93 14 93 35 V58 C93 77 78 92 50 108 C22 92 7 77 7 58 V35 C7 14 24 3 50 3 Z',
  },
  {
    id: 'banner-shield',
    kind: 'shield',
    name: { en: 'Banner shield', zh: '旗帜盾' },
    svgPath: 'M8 8 H92 V91 L76 102 L60 91 L44 102 L28 91 L8 102 Z',
  },
  {
    id: 'lozenge-shield',
    kind: 'shield',
    name: { en: 'Lozenge shield', zh: '菱形盾' },
    svgPath: 'M50 2 L96 55 L50 108 L4 55 Z',
  },
  {
    id: 'targe-shield',
    kind: 'shield',
    name: { en: 'Targe shield', zh: '圆肩盾' },
    svgPath: 'M12 8 H88 V57 C88 78 73 95 50 108 C27 95 12 78 12 57 Z',
  },
  {
    id: 'buckler-shield',
    kind: 'shield',
    name: { en: 'Buckler shield', zh: '小圆盾' },
    svgPath: 'M50 6 C72 6 88 20 88 40 L84 72 C80 90 64 102 50 110 C36 102 20 90 16 72 L12 40 C12 20 28 6 50 6 Z',
  },
  {
    id: 'scalloped-shield',
    kind: 'shield',
    name: { en: 'Scalloped shield', zh: '波边盾' },
    svgPath: 'M14 8 H86 V38 C86 47 81 47 78 54 C75 61 83 66 80 75 C77 87 66 98 50 108 C34 98 23 87 20 75 C17 66 25 61 22 54 C19 47 14 47 14 38 Z',
  },
  {
    id: 'arched-shield',
    kind: 'shield',
    name: { en: 'Arched shield', zh: '拱顶盾' },
    svgPath: 'M16 10 H84 V46 C84 72 72 94 50 110 C28 94 16 72 16 46 Z',
  },
  {
    id: 'pointed-shield',
    kind: 'shield',
    name: { en: 'Pointed shield', zh: '尖底盾' },
    svgPath: 'M50 4 C64 11 78 18 82 31 C85 55 73 87 50 110 C27 87 15 55 18 31 C22 18 36 11 50 4 Z',
  },
  {
    id: 'ogee-shield',
    kind: 'shield',
    name: { en: 'Ogee shield', zh: '曲线盾' },
    svgPath: 'M10 12 C22 12 33 13 40 7 C44 3 56 3 60 7 C67 13 78 12 90 12 V53 C90 78 74 97 50 110 C26 97 10 78 10 53 Z',
  },
  {
    id: 'embattled-shield',
    kind: 'shield',
    name: { en: 'Embattled shield', zh: '城垛盾' },
    svgPath: 'M12 10 H30 V4 H45 V10 H55 V4 H70 V10 H88 V54 C88 79 72 96 50 110 C28 96 12 79 12 54 Z',
  },
  {
    id: 'notched-shield',
    kind: 'shield',
    name: { en: 'Notched shield', zh: '缺口盾' },
    svgPath: 'M10 10 H90 V34 C90 40 84 41 84 47 C84 53 90 54 90 60 V72 C86 89 70 100 50 110 C30 100 14 89 10 72 V60 C10 54 16 53 16 47 C16 41 10 40 10 34 Z',
  },
  {
    id: 'cuirass-shield',
    kind: 'shield',
    name: { en: 'Cuirass shield', zh: '胸甲盾' },
    svgPath: 'M8 12 C20 8 33 10 42 14 C47 16 53 16 58 14 C67 10 80 8 92 12 V56 C92 82 75 99 50 110 C25 99 8 82 8 56 Z',
  },
  {
    id: 'swallowtail-shield',
    kind: 'shield',
    name: { en: 'Swallowtail shield', zh: '燕尾盾' },
    svgPath: 'M10 8 H90 V82 L70 72 L50 110 L30 72 L10 82 Z',
  },
  {
    id: 'oval-shield',
    kind: 'shield',
    name: { en: 'Oval shield', zh: '椭圆盾' },
    svgPath: 'M50 4 C75 4 90 23 90 54 C90 86 73 103 50 110 C27 103 10 86 10 54 C10 23 25 4 50 4 Z',
  },
  {
    id: 'striped-field',
    kind: 'pattern',
    name: { en: 'Stripes', zh: '条纹' },
    fieldPattern: 'stripes',
  },
  {
    id: 'dotted-field',
    kind: 'pattern',
    name: { en: 'Dots', zh: '圆点' },
    fieldPattern: 'dots',
  },
  {
    id: 'checkered-field',
    kind: 'pattern',
    name: { en: 'Checks', zh: '棋盘格' },
    fieldPattern: 'checks',
  },
  {
    id: 'azure-background',
    kind: 'background',
    name: { en: 'Azure', zh: '蔚蓝' },
    fill: '#1855A5',
  },
  {
    id: 'ivory-background',
    kind: 'background',
    name: { en: 'Ivory', zh: '象牙白' },
    fill: '#F5E6A1',
  },
  {
    id: 'crimson-background',
    kind: 'background',
    name: { en: 'Crimson', zh: '深红' },
    fill: '#B11F24',
  },
];

const coatAssets: readonly CoatAsset[] = [
  ...localCoatAssets,
  ...webpMaterialAssets,
  ...shieldReferenceCategories.flatMap((category) => listReferenceCatalogEntries('shield', category).map((entry) => ({
    id: entry.id,
    kind: 'shield' as const,
    name: { en: entry.name, zh: entry.nameZh },
    searchTerms: [...entry.searchTerms],
    svgPath: entry.svgPath,
    staticImageSrc: entry.staticImageSrc,
  }))),
];

export function getCoatAsset(assetId: string): CoatAsset {
  if (typeof assetId !== 'string') {
    throw new Error(`Invalid coat asset id: ${String(assetId)}`);
  }
  const coatAsset = coatAssets.find((candidate) => candidate.id === assetId);
  if (!coatAsset) {
    throw new Error(`Unknown coat asset id: ${assetId}`);
  }
  return cloneCoatAsset(coatAsset);
}

export function listShieldSilhouetteAssets(): CoatAssetByKind<'shield'>[] {
  return shieldSilhouetteAssetIds.map((assetId) => {
    const asset = getCoatAsset(assetId);
    if (asset.kind !== 'shield' || !('svgPath' in asset) || typeof asset.svgPath !== 'string') {
      throw new Error(`Shield silhouette is missing an SVG path: ${assetId}`);
    }
    return asset;
  });
}

export function requireShieldSilhouetteAssetId(assetId: string): ShieldSilhouetteAssetId {
  if (!shieldSilhouetteAssetIds.includes(assetId as ShieldSilhouetteAssetId)) {
    throw new Error(`Unknown shield silhouette: ${JSON.stringify(assetId)}`);
  }
  return assetId as ShieldSilhouetteAssetId;
}

export function listAssetsByKind<Kind extends CoatAssetKind>(
  kind: Kind,
): CoatAssetByKind<Kind>[] {
  assertAssetKind(kind);
  return coatAssets
    .filter(
      (coatAsset): coatAsset is CoatAssetByKind<Kind> => coatAsset.kind === kind,
    )
    .map((coatAsset) => cloneCoatAsset(coatAsset));
}

/** Returns the authored SVG source colours that can safely be replaced for one local vector asset. */
export function getAssetColorSources(assetId: string): string[] {
  const asset = getCoatAsset(assetId);
  if (asset.kind === 'shield' && isShieldMaterialAssetId(asset.id)) {
    return getShieldMaterialPaintColours(asset.id);
  }
  if (!('svgParts' in asset) || !asset.svgParts) return [];
  return [...new Set(asset.svgParts.map((part) => part.sourceColor))];
}

/** Product default canvas. Matches Settings preset 3-5. */
export const DEFAULT_COAT_CANVAS_WIDTH = 1800;
export const DEFAULT_COAT_CANVAS_HEIGHT = 1080;

/** Default heater height ≈ 90% of an 1800×1080 canvas. */
export const DEFAULT_SHIELD_SCALE = 0.935;

/** Newly placed library shield/ordinary/charge/top. Longer side ≈ 60% of canvas height. */
export const NEWLY_PLACED_LIBRARY_ASSET_SCALE = 0.6;

export function createDefaultProject(locale: CoatLocale): CoatProject {
  return createProjectWithIds(locale, {
    project: createLocalCoatId(),
    backgroundLayer: createLocalCoatId(),
    shieldLayer: createLocalCoatId(),
  });
}

/**
 * Creates the first canvas shown by the dedicated Coat Maker route. It uses
 * only bundled original geometry while matching the source editor's familiar
 * gold shield and layered-creature composition.
 */
export function createCoatMakerShowcaseProject(locale: CoatLocale): CoatProject {
  const project = createDefaultProject(locale);
  const background = project.layers.find((layer): layer is BackgroundLayer => layer.type === 'background');
  const shield = project.layers.find((layer): layer is ShieldLayer => layer.type === 'shield');
  if (!background || !shield) throw new Error('Default coat project is missing required showcase layers');
  return { ...project, layers: createShowcaseLayers(background, shield, createLocalCoatId(), createLocalCoatId()) };
}

function createShowcaseLayers(
  background: BackgroundLayer,
  shield: ShieldLayer,
  dragonLayerId: string,
  lionLayerId: string,
): CoatLayer[] {
  const dragon: ChargeLayer = {
    id: dragonLayerId,
    type: 'charge',
    assetId: 'material-animal-dragon-passant',
    color: '#28753A',
    transform: { x: 0, y: -12, scale: 0.75, rotation: 0 },
    ...createDefaultLayerMetadata(),
  };
  const lion: ChargeLayer = {
    id: lionLayerId,
    type: 'charge',
    assetId: 'material-animal-wolf-rampant',
    color: '#8A451B',
    transform: { x: 0, y: 9, scale: 0.72, rotation: 0 },
    ...createDefaultLayerMetadata(),
  };
  return [
    { ...background, fill: '#FFFFFF' },
    { ...shield, field: { division: 'solid', colors: ['#F6C700'], pattern: 'solid' } },
    dragon,
    lion,
  ];
}

/** Uses stable IDs only for the document rendered by both server and browser before effects run. */
export function createInitialCoatProject(): CoatProject {
  const project = createProjectWithIds('en', initialCoatProjectIds);
  const background = project.layers.find((layer): layer is BackgroundLayer => layer.type === 'background');
  const shield = project.layers.find((layer): layer is ShieldLayer => layer.type === 'shield');
  if (!background || !shield) throw new Error('Initial coat project is missing required showcase layers');
  return {
    ...project,
    layers: createShowcaseLayers(background, shield, initialCoatProjectIds.dragonLayer, initialCoatProjectIds.lionLayer),
  };
}

function createProjectWithIds(
  locale: CoatLocale,
  ids: { project: string; backgroundLayer: string; shieldLayer: string },
): CoatProject {
  assertLocale(locale);
  const backgroundLayer: BackgroundLayer = {
    id: ids.backgroundLayer,
    type: 'background',
    assetId: 'ivory-background',
    motif: 'solid',
    opacity: 1,
    ...createDefaultLayerMetadata(),
  };
  const shieldLayer: ShieldLayer = {
    id: ids.shieldLayer,
    type: 'shield',
    assetId: 'heater-shield',
    field: {
      division: 'solid',
      colors: ['#1855A5'],
      pattern: 'solid',
    },
    transform: createCenteredTransform(),
    ...createDefaultLayerMetadata(),
  };

  return {
    id: ids.project,
    locale,
    name: getDefaultProjectName(locale),
    canvas: { width: DEFAULT_COAT_CANVAS_WIDTH, height: DEFAULT_COAT_CANVAS_HEIGHT },
    palette: [],
    uploads: [],
    groups: [],
    layers: [backgroundLayer, shieldLayer],
  };
}

export function getDefaultProjectName(locale: CoatLocale): string {
  assertLocale(locale);
  return locale === 'zh' ? '我的徽章' : 'My Coat of Arms';
}

function cloneCoatAsset<Asset extends CoatAsset>(coatAsset: Asset): Asset {
  return {
    ...coatAsset,
    name: { ...coatAsset.name },
    ...('searchTerms' in coatAsset && coatAsset.searchTerms ? { searchTerms: [...coatAsset.searchTerms] } : {}),
    ...('svgParts' in coatAsset && coatAsset.svgParts ? { svgParts: coatAsset.svgParts.map((part) => ({ ...part })) } : {}),
    ...('rasterVariants' in coatAsset && coatAsset.rasterVariants ? { rasterVariants: coatAsset.rasterVariants.map((variant) => ({ ...variant })) } : {}),
  } as Asset;
}

function createCenteredTransform(): CanvasTransform {
  return {
    x: 0,
    y: 0,
    scale: DEFAULT_SHIELD_SCALE,
    rotation: 0,
  };
}

function assertAssetKind(kind: unknown): asserts kind is CoatAssetKind {
  if (!validAssetKinds.includes(kind as CoatAssetKind)) {
    throw new Error(`Invalid coat asset kind: ${String(kind)}`);
  }
}

function assertLocale(locale: unknown): asserts locale is CoatLocale {
  if (!validLocales.includes(locale as CoatLocale)) {
    throw new Error(`Invalid coat locale: ${String(locale)}`);
  }
}

function createDefaultLayerMetadata() {
  return {
    visible: true,
    locked: false,
    groupId: null,
  };
}
