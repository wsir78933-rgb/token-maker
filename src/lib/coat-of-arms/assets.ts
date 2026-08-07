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
import { webpMaterialAssets } from './webp-material-catalog';
import {
  type ReferenceCatalogEntry,
  type ReferenceCatalogSection,
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from './reference-catalog';

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

const referenceCatalogSectionCategories: readonly {
  readonly section: ReferenceCatalogSection;
  readonly categories: readonly string[];
}[] = [
  { section: 'shield', categories: shieldReferenceCategories },
];

const coatAssets: readonly CoatAsset[] = [
  ...localCoatAssets,
  ...webpMaterialAssets,
  ...createReferenceCatalogCoatAssets(),
];

function createReferenceCatalogCoatAssets(): readonly CoatAsset[] {
  return referenceCatalogSectionCategories.flatMap(({ section, categories }) => (
    categories.flatMap((category) => (
      listReferenceCatalogEntries(section, category).map(createReferenceCatalogCoatAsset)
    ))
  ));
}

function createReferenceCatalogCoatAsset(entry: ReferenceCatalogEntry): CoatAsset {
  if (entry.section !== 'shield') {
    throw new Error(`Unsupported non-shield reference catalog section: ${entry.section}`);
  }
  return {
    id: entry.id,
    kind: 'shield',
    name: { en: entry.name, zh: entry.nameZh },
    searchTerms: [...entry.searchTerms],
    svgPath: entry.svgParts.map((part) => part.svgPath).join(' '),
    svgParts: entry.svgParts.map((part) => ({ ...part })),
  };
}

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
  if (!('svgParts' in asset) || !asset.svgParts) return [];
  return [...new Set(asset.svgParts.map((part) => part.sourceColor))];
}

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
    assetId: 'material-animal-alligator-passant',
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
    canvas: { width: 1200, height: 1200 },
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
    scale: 1,
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
