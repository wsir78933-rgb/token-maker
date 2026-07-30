import type { CoatField, CoatSvgPart } from './types';

export type ReferenceCatalogSection = 'shield' | 'charge' | 'top';

export const shieldReferenceCategories = ['shield', 'heater', 'french', 'banner', 'round', 'lozenge'] as const;
export type ShieldReferenceCategory = (typeof shieldReferenceCategories)[number];

export interface ReferenceCatalogEntry {
  readonly id: string;
  readonly section: ReferenceCatalogSection;
  readonly category: string;
  readonly name: string;
  readonly nameZh: string;
  readonly licenseId: ReferenceCatalogLicenseId;
  readonly searchTerms: readonly string[];
  readonly svgParts: readonly CoatSvgPart[];
  /** Semantic identity for kite shields; consumers do not need this internal catalog detail. */
  readonly shieldSemanticKey?: string;
  /** Semantic identity for heater shields; consumers do not need this internal catalog detail. */
  readonly heaterSemanticKey?: string;
  /** Semantic identity for French shields; consumers do not need this internal catalog detail. */
  readonly frenchSemanticKey?: string;
  /** Semantic identity for banner shields; consumers do not need this internal catalog detail. */
  readonly bannerSemanticKey?: string;
  /** Semantic identity for round shields; consumers do not need this internal catalog detail. */
  readonly roundSemanticKey?: string;
  /** Semantic identity for lozenge shields; consumers do not need this internal catalog detail. */
  readonly lozengeSemanticKey?: string;
  /** Semantic identity for animal charges; consumers do not need this internal catalog detail. */
  readonly semanticKey?: string;
  /** Semantic identity for object charges; consumers do not need this internal catalog detail. */
  readonly objectSemanticKey?: string;
  /** Semantic identity for plant charges; consumers do not need this internal catalog detail. */
  readonly plantSemanticKey?: string;
  /** Semantic identity for human charges; consumers do not need this internal catalog detail. */
  readonly humanSemanticKey?: string;
  /** Semantic identity for symbol charges; consumers do not need this internal catalog detail. */
  readonly symbolSemanticKey?: string;
  /** Semantic identity for crown exteriors; consumers do not need this internal catalog detail. */
  readonly crownSemanticKey?: string;
  /** Semantic identity for mantle exteriors; consumers do not need this internal catalog detail. */
  readonly mantleSemanticKey?: string;
  /** Semantic identity for supporter exteriors; consumers do not need this internal catalog detail. */
  readonly supporterSemanticKey?: string;
  /** Semantic identity for other heraldic exteriors; consumers do not need this internal catalog detail. */
  readonly exteriorSemanticKey?: string;
  readonly sourceUrl?: never;
}

type ReferenceCatalogLicenseId = 'CC0-1.0' | 'MIT';

interface ReferenceCatalogLicenseRecord {
  readonly id: ReferenceCatalogLicenseId;
  readonly title: string;
  readonly scope: string;
}

interface ReferenceCatalogSeed {
  readonly section: ReferenceCatalogSection;
  readonly category: string;
  readonly count: number;
  readonly idPrefix: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly licenseId: ReferenceCatalogLicenseId;
  readonly featuredEntries?: readonly ReferenceCatalogFeaturedEntry[];
}

interface ReferenceCatalogFeaturedEntry {
  readonly id: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
}

const referenceCatalogLicenseRecords: readonly ReferenceCatalogLicenseRecord[] = [
  {
    id: 'CC0-1.0',
    title: 'CC0 1.0 Universal',
    scope: 'Original parametric SVG geometry authored for this bundled local catalog.',
  },
  {
    id: 'MIT',
    title: 'MIT License',
    scope: 'Bundled deterministic catalog generator and its original SVG geometry.',
  },
];

const referenceCatalogEntryKeys = [
  'id',
  'section',
  'category',
  'name',
  'nameZh',
  'licenseId',
  'searchTerms',
  'svgParts',
] as const;
const referenceCatalogShieldEntryKeys = [...referenceCatalogEntryKeys, 'shieldSemanticKey'] as const;
const referenceCatalogHeaterEntryKeys = [...referenceCatalogEntryKeys, 'heaterSemanticKey'] as const;
const referenceCatalogFrenchEntryKeys = [...referenceCatalogEntryKeys, 'frenchSemanticKey'] as const;
const referenceCatalogBannerEntryKeys = [...referenceCatalogEntryKeys, 'bannerSemanticKey'] as const;
const referenceCatalogRoundEntryKeys = [...referenceCatalogEntryKeys, 'roundSemanticKey'] as const;
const referenceCatalogLozengeEntryKeys = [...referenceCatalogEntryKeys, 'lozengeSemanticKey'] as const;
const referenceCatalogAnimalEntryKeys = [...referenceCatalogEntryKeys, 'semanticKey'] as const;
const referenceCatalogObjectEntryKeys = [...referenceCatalogEntryKeys, 'objectSemanticKey'] as const;
const referenceCatalogPlantEntryKeys = [...referenceCatalogEntryKeys, 'plantSemanticKey'] as const;
const referenceCatalogHumanEntryKeys = [...referenceCatalogEntryKeys, 'humanSemanticKey'] as const;
const referenceCatalogSymbolEntryKeys = [...referenceCatalogEntryKeys, 'symbolSemanticKey'] as const;
const referenceCatalogCrownEntryKeys = [...referenceCatalogEntryKeys, 'crownSemanticKey'] as const;
const referenceCatalogMantleEntryKeys = [...referenceCatalogEntryKeys, 'mantleSemanticKey'] as const;
const referenceCatalogSupporterEntryKeys = [...referenceCatalogEntryKeys, 'supporterSemanticKey'] as const;
const referenceCatalogExteriorEntryKeys = [...referenceCatalogEntryKeys, 'exteriorSemanticKey'] as const;
const referenceCatalogSvgPartKeys = ['svgPath', 'sourceColor'] as const;
const remoteReferencePattern = /(?:mailto:|https?:|\/\/|www\.|data:|url\(|(?:^|[\s("'=@])(?:[a-z0-9-]+\.)+[a-z]{2,}(?=[\s)\]}'",.;!/:?#]|$)|(?:^|[\s("'=])(?:\d{1,3}\.){3}\d{1,3}(?=[\s)\]}'",.;!/:?#]|$))/i;

const referenceCatalogSeeds: readonly ReferenceCatalogSeed[] = [
  {
    section: 'shield',
    category: 'shield',
    count: 51,
    idPrefix: 'heraldic-shield',
    name: 'Heraldic shield',
    nameZh: '纹章盾',
    searchTerms: ['shield', 'escutcheon', '纹章盾'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'shield',
    category: 'heater',
    count: 57,
    idPrefix: 'heater-shield',
    name: 'Heater shield',
    nameZh: '熨斗盾',
    searchTerms: ['shield', 'heater', '尖顶', '盾形'],
    licenseId: 'CC0-1.0',
    featuredEntries: [
      {
        id: 'pointed-heraldic-shield',
        name: 'Pointed heraldic shield',
        nameZh: '尖顶纹章盾',
        searchTerms: ['shield', 'heater', 'pointed', '尖顶', '纹章盾'],
      },
    ],
  },
  {
    section: 'shield',
    category: 'french',
    count: 30,
    idPrefix: 'french-shield',
    name: 'French shield',
    nameZh: '法式盾',
    searchTerms: ['shield', 'french', '法式', '盾形'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'shield',
    category: 'banner',
    count: 30,
    idPrefix: 'banner-shield',
    name: 'Banner shield',
    nameZh: '旗帜盾',
    searchTerms: ['shield', 'banner', '旗帜', '盾形'],
    licenseId: 'MIT',
  },
  {
    section: 'shield',
    category: 'round',
    count: 30,
    idPrefix: 'round-shield',
    name: 'Round shield',
    nameZh: '圆盾',
    searchTerms: ['shield', 'round', '圆形', '盾形'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'shield',
    category: 'lozenge',
    count: 30,
    idPrefix: 'lozenge-shield',
    name: 'Lozenge shield',
    nameZh: '菱形盾',
    searchTerms: ['shield', 'lozenge', '菱形', '盾形'],
    licenseId: 'MIT',
  },
  {
    section: 'charge',
    category: 'animal',
    count: 369,
    idPrefix: 'animal-charge',
    name: 'Heraldic animal motif',
    nameZh: '纹章动物母题',
    searchTerms: ['animal', 'heraldic', '动物', '纹章'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'charge',
    category: 'object',
    count: 105,
    idPrefix: 'object-charge',
    name: 'Heraldic object motif',
    nameZh: '纹章器物母题',
    searchTerms: ['object', 'heraldic', '器物', '纹章'],
    licenseId: 'MIT',
  },
  {
    section: 'charge',
    category: 'plant',
    count: 96,
    idPrefix: 'plant-charge',
    name: 'Heraldic plant motif',
    nameZh: '纹章植物母题',
    searchTerms: ['plant', 'heraldic', '植物', '纹章'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'charge',
    category: 'human',
    count: 96,
    idPrefix: 'human-charge',
    name: 'Heraldic human motif',
    nameZh: '纹章人物母题',
    searchTerms: ['human', 'heraldic', '人物', '纹章'],
    licenseId: 'MIT',
  },
  {
    section: 'charge',
    category: 'symbol',
    count: 97,
    idPrefix: 'symbol-charge',
    name: 'Heraldic symbol motif',
    nameZh: '纹章符号母题',
    searchTerms: ['symbol', 'heraldic', '符号', '纹章'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'top',
    category: 'crown',
    count: 73,
    idPrefix: 'crown-exterior',
    name: 'Heraldic crown motif',
    nameZh: '纹章冠冕母题',
    searchTerms: ['crown', 'heraldic', '冠冕', '纹章'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'top',
    category: 'mantle',
    count: 55,
    idPrefix: 'mantle-exterior',
    name: 'Heraldic mantle motif',
    nameZh: '纹章斗篷母题',
    searchTerms: ['mantle', 'heraldic', '斗篷', '纹章'],
    licenseId: 'MIT',
  },
  {
    section: 'top',
    category: 'supporter',
    count: 54,
    idPrefix: 'supporter-exterior',
    name: 'Heraldic supporter motif',
    nameZh: '纹章护持者母题',
    searchTerms: ['supporter', 'heraldic', '护持者', '纹章'],
    licenseId: 'CC0-1.0',
  },
  {
    section: 'top',
    category: 'other',
    count: 55,
    idPrefix: 'other-exterior',
    name: 'Heraldic exterior motif',
    nameZh: '纹章外饰母题',
    searchTerms: ['top', 'exterior', 'heraldic', 'motif', '纹章', '外饰', '母题'],
    licenseId: 'MIT',
  },
];

type KiteShieldMotifPartId = keyof typeof kiteShieldMotifSvgParts;
type KiteShieldVariantId = keyof typeof kiteShieldVariantRecords;

interface KiteShieldMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: KiteShieldMotifPartId;
}

/** Original local kite-shield outlines and inset details for the named shield collection. */
const kiteShieldMotifSvgParts = {
  norman: [
    'M50 3 L86 19 V56 C86 81 68 98 50 108 C32 98 14 81 14 56 V19 Z',
    'M31 24 H69 V31 H31 Z M45 31 H55 V88 H45 Z',
  ],
  saxon: [
    'M50 5 L82 18 V61 C82 82 66 99 50 107 C34 99 18 82 18 61 V18 Z',
    'M28 26 H72 V33 H28 Z M35 42 H65 V49 H35 Z M42 58 H58 V87 H42 Z',
  ],
  varangian: [
    'M50 2 L89 21 L84 62 C82 82 66 99 50 109 C34 99 18 82 16 62 L11 21 Z',
    'M25 29 L50 18 L75 29 L68 36 L50 29 L32 36 Z M46 40 H54 V92 H46 Z',
  ],
  byzantine: [
    'M50 4 C65 5 78 10 86 20 V57 C86 80 70 97 50 108 C30 97 14 80 14 57 V20 C22 10 35 5 50 4 Z',
    'M31 27 C37 20 44 23 50 31 C56 23 63 20 69 27 M44 39 H56 V75 H44 M34 53 H66',
  ],
  crusader: [
    'M50 3 L84 18 V55 C84 79 68 97 50 108 C32 97 16 79 16 55 V18 Z',
    'M44 23 H56 V46 H72 V58 H56 V88 H44 V58 H28 V46 H44 Z',
  ],
  gothic: [
    'M50 1 L80 16 V58 C80 83 65 100 50 109 C35 100 20 83 20 58 V16 Z',
    'M38 24 L50 14 L62 24 L57 31 H43 Z M45 34 H55 V84 H45 Z M32 48 H68',
  ],
  viking: [
    'M50 5 L88 23 L80 61 C76 82 63 99 50 107 C37 99 24 82 20 61 L12 23 Z',
    'M24 32 L39 26 L50 36 L61 26 L76 32 L65 42 L50 46 L35 42 Z M44 51 H56 V83 H44 Z',
  ],
  teutonic: [
    'M50 4 L87 18 V59 C87 81 70 98 50 108 C30 98 13 81 13 59 V18 Z',
    'M43 21 H57 V44 H74 V57 H57 V90 H43 V57 H26 V44 H43 Z',
  ],
  falcon: [
    'M50 4 L90 24 L82 58 C79 81 65 98 50 108 C35 98 21 81 18 58 L10 24 Z',
    'M22 34 L39 40 L35 51 L25 47 M78 34 L61 40 L65 51 L75 47 M45 52 H55 V86 H45 Z',
  ],
  aegis: [
    'M50 4 C71 4 87 21 87 45 C87 77 68 98 50 108 C32 98 13 77 13 45 C13 21 29 4 50 4 Z',
    'M50 20 A18 18 0 1 0 50 56 A18 18 0 0 0 50 20 Z M45 38 H55 V83 H45 Z',
  ],
  sentinel: [
    'M50 2 L78 15 V61 C78 85 64 101 50 109 C36 101 22 85 22 61 V15 Z',
    'M34 26 H66 V33 H34 Z M42 40 H58 V47 H42 Z M46 54 H54 V91 H46 Z',
  ],
  river: [
    'M50 4 L85 20 V57 C85 81 68 98 50 108 C32 98 15 81 15 57 V20 Z',
    'M28 35 C36 29 42 41 50 35 C58 29 64 41 72 35 M28 53 C36 47 42 59 50 53 C58 47 64 59 72 53 M45 66 H55 V87 H45 Z',
  ],
  mountain: [
    'M50 3 L86 20 V57 C86 81 69 98 50 108 C31 98 14 81 14 57 V20 Z',
    'M26 63 L42 38 L50 51 L59 31 L75 63 Z M45 63 H55 V87 H45 Z',
  ],
  compass: [
    'M50 4 L84 18 V57 C84 80 68 97 50 108 C32 97 16 80 16 57 V18 Z',
    'M50 23 L57 47 L76 53 L57 59 L50 84 L43 59 L24 53 L43 47 Z M47 48 H53 V58 H47 Z',
  ],
  star: [
    'M50 3 L86 19 V58 C86 82 69 98 50 108 C31 98 14 82 14 58 V19 Z',
    'M50 20 L56 39 L76 39 L60 51 L66 71 L50 59 L34 71 L40 51 L24 39 L44 39 Z',
  ],
  oak: [
    'M50 4 L83 18 V58 C83 81 68 98 50 108 C32 98 17 81 17 58 V18 Z',
    'M30 33 C23 27 30 18 38 25 C38 16 50 17 47 28 M70 33 C77 27 70 18 62 25 C62 16 50 17 53 28 M45 42 H55 V86 H45 Z',
  ],
  torch: [
    'M50 3 L85 20 V57 C85 80 68 98 50 108 C32 98 15 80 15 57 V20 Z',
    'M45 89 V49 C39 42 43 31 50 21 C57 31 61 42 55 49 V89 H45 Z M37 89 H63 V96 H37 Z',
  ],
} as const;

const kiteShieldVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  rimmed: { prefix: 'Rimmed', prefixZh: '镶边', searchTerms: ['rimmed', 'rim', '镶边', '边框'], svgPath: 'M20 23 L50 9 L80 23 V58 C80 78 66 94 50 103 C34 94 20 78 20 58 Z' },
  notched: { prefix: 'Notched', prefixZh: '刻缺', searchTerms: ['notched', 'notch', '刻缺', '缺口'], svgPath: 'M44 11 L50 18 L56 11 M20 59 L27 66 L20 73 M80 59 L73 66 L80 73' },
} as const;
const kiteShieldVariantIds = ['plain', 'rimmed', 'notched'] as const satisfies readonly KiteShieldVariantId[];

const kiteShieldMotifRecords: readonly KiteShieldMotifRecord[] = [
  { key: 'norman', name: 'Norman kite shield', nameZh: '诺曼鸢盾', searchTerms: ['norman', 'norman kite', '诺曼', '鸢盾'], partId: 'norman' },
  { key: 'saxon', name: 'Saxon kite shield', nameZh: '撒克逊鸢盾', searchTerms: ['saxon', 'saxon kite', '撒克逊', '鸢盾'], partId: 'saxon' },
  { key: 'varangian', name: 'Varangian kite shield', nameZh: '瓦兰吉鸢盾', searchTerms: ['varangian', 'varangian kite', '瓦兰吉', '鸢盾'], partId: 'varangian' },
  { key: 'byzantine', name: 'Byzantine kite shield', nameZh: '拜占庭鸢盾', searchTerms: ['byzantine', 'byzantine kite', '拜占庭', '鸢盾'], partId: 'byzantine' },
  { key: 'crusader', name: 'Crusader kite shield', nameZh: '十字军鸢盾', searchTerms: ['crusader', 'crusader kite', '十字军', '鸢盾'], partId: 'crusader' },
  { key: 'gothic', name: 'Gothic kite shield', nameZh: '哥特鸢盾', searchTerms: ['gothic', 'gothic kite', '哥特', '鸢盾'], partId: 'gothic' },
  { key: 'viking', name: 'Viking kite shield', nameZh: '维京鸢盾', searchTerms: ['viking', 'viking kite', '维京', '鸢盾'], partId: 'viking' },
  { key: 'teutonic', name: 'Teutonic kite shield', nameZh: '条顿鸢盾', searchTerms: ['teutonic', 'teutonic kite', '条顿', '鸢盾'], partId: 'teutonic' },
  { key: 'falcon', name: 'Falcon kite shield', nameZh: '隼翼鸢盾', searchTerms: ['falcon', 'falcon kite', '隼翼', '鸢盾'], partId: 'falcon' },
  { key: 'aegis', name: 'Aegis kite shield', nameZh: '神盾鸢盾', searchTerms: ['aegis', 'aegis kite', '神盾', '鸢盾'], partId: 'aegis' },
  { key: 'sentinel', name: 'Sentinel kite shield', nameZh: '守望鸢盾', searchTerms: ['sentinel', 'sentinel kite', '守望', '鸢盾'], partId: 'sentinel' },
  { key: 'river', name: 'River kite shield', nameZh: '川流鸢盾', searchTerms: ['river', 'river kite', '川流', '鸢盾'], partId: 'river' },
  { key: 'mountain', name: 'Mountain kite shield', nameZh: '山岳鸢盾', searchTerms: ['mountain', 'mountain kite', '山岳', '鸢盾'], partId: 'mountain' },
  { key: 'compass', name: 'Compass kite shield', nameZh: '罗盘鸢盾', searchTerms: ['compass', 'compass kite', '罗盘', '鸢盾'], partId: 'compass' },
  { key: 'star', name: 'Star kite shield', nameZh: '星芒鸢盾', searchTerms: ['star', 'star kite', '星芒', '鸢盾'], partId: 'star' },
  { key: 'oak', name: 'Oak kite shield', nameZh: '橡叶鸢盾', searchTerms: ['oak', 'oak kite', '橡叶', '鸢盾'], partId: 'oak' },
  { key: 'torch', name: 'Torch kite shield', nameZh: '火炬鸢盾', searchTerms: ['torch', 'torch kite', '火炬', '鸢盾'], partId: 'torch' },
];

const kiteShieldCatalogSemanticKeys = new Set(
  kiteShieldMotifRecords.flatMap((motif) => kiteShieldVariantIds.map((variantId) => `shield-${motif.key}-${variantId}`)),
);
if (kiteShieldCatalogSemanticKeys.size !== 51) {
  throw new Error(`Invalid kite shield semantic vocabulary size: ${kiteShieldCatalogSemanticKeys.size}`);
}

type HeaterShieldMotifPartId = keyof typeof heaterShieldMotifSvgParts;
type HeaterShieldVariantId = keyof typeof heaterShieldVariantRecords;

interface HeaterShieldMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: HeaterShieldMotifPartId;
}

/** Original local heater-shield outlines and inset details for the named shield collection. */
const heaterShieldMotifSvgParts = {
  barrel: [
    'M50 4 L91 19 V59 C91 80 74 96 50 108 C26 96 9 80 9 59 V19 Z',
    'M28 27 C36 20 44 24 50 33 C56 24 64 20 72 27 M44 37 H56 V87 H44 Z',
  ],
  broad: [
    'M50 5 L95 18 V61 C95 81 76 96 50 108 C24 96 5 81 5 61 V18 Z',
    'M22 28 H78 V35 H22 Z M31 45 H69 V52 H31 Z M45 59 H55 V88 H45 Z',
  ],
  crescent: [
    'M50 4 L89 20 V58 C89 80 72 97 50 108 C28 97 11 80 11 58 V20 Z',
    'M57 29 C40 30 35 51 49 60 C39 56 37 39 47 31 C51 28 55 28 57 29 M45 64 H55 V89 H45 Z',
  ],
  chapel: [
    'M50 4 L87 18 V58 C87 81 70 98 50 108 C30 98 13 81 13 58 V18 Z',
    'M31 47 V35 L41 25 L50 35 L59 25 L69 35 V47 Z M44 47 H56 V87 H44 Z',
  ],
  crossbow: [
    'M50 5 L90 20 V60 C90 81 73 97 50 108 C27 97 10 81 10 60 V20 Z',
    'M25 41 C37 30 63 30 75 41 L70 48 C59 40 41 40 30 48 Z M47 38 H53 V86 H47 Z M40 58 H60',
  ],
  leaf: [
    'M50 4 L88 19 V57 C88 80 71 98 50 108 C29 98 12 80 12 57 V19 Z',
    'M50 24 C35 31 35 47 46 52 C39 43 43 33 50 28 C57 33 61 43 54 52 C65 47 65 31 50 24 M45 55 H55 V89 H45 Z',
  ],
  mason: [
    'M50 4 L92 18 V59 C92 80 74 97 50 108 C26 97 8 80 8 59 V18 Z',
    'M24 31 H42 V40 H24 Z M58 31 H76 V40 H58 Z M33 48 H50 V57 H33 Z M50 48 H67 V57 H50 Z M45 64 H55 V88 H45 Z',
  ],
  naval: [
    'M50 5 L89 20 V58 C89 80 72 97 50 108 C28 97 11 80 11 58 V20 Z',
    'M30 39 C39 32 43 43 50 39 C57 35 61 46 70 39 M27 54 C37 48 43 60 50 54 C57 48 63 60 73 54 M45 65 H55 V88 H45 Z',
  ],
  ridge: [
    'M50 3 L86 17 V59 C86 82 70 99 50 108 C30 99 14 82 14 59 V17 Z',
    'M30 31 L50 20 L70 31 L64 38 L50 30 L36 38 Z M44 42 H56 V88 H44 Z M33 56 H67',
  ],
  royal: [
    'M50 4 L90 19 V58 C90 80 73 97 50 108 C27 97 10 80 10 58 V19 Z',
    'M32 35 L38 23 L46 31 L50 17 L54 31 L62 23 L68 35 Z M44 43 H56 V88 H44 Z',
  ],
  spearhead: [
    'M50 2 L87 19 V59 C87 81 70 98 50 108 C30 98 13 81 13 59 V19 Z',
    'M50 19 L59 40 L50 61 L41 40 Z M45 61 H55 V90 H45 Z M32 51 H68',
  ],
  sunburst: [
    'M50 5 L90 19 V59 C90 80 73 97 50 108 C27 97 10 80 10 59 V19 Z',
    'M50 30 A12 12 0 1 0 50 54 A12 12 0 0 0 50 30 Z M50 18 V27 M31 25 L38 32 M69 25 L62 32 M27 45 H36 M73 45 H64 M45 60 H55 V88 H45 Z',
  ],
  tower: [
    'M50 4 L88 18 V58 C88 81 71 98 50 108 C29 98 12 81 12 58 V18 Z',
    'M35 65 V35 H42 V28 H49 V35 H58 V28 H65 V65 Z M43 47 H48 V55 H43 Z M52 47 H57 V55 H52 Z M45 65 H55 V88 H45 Z',
  ],
  wolf: [
    'M50 4 L91 19 V58 C91 80 74 97 50 108 C26 97 9 80 9 58 V19 Z',
    'M37 48 L31 33 L42 39 L50 27 L58 39 L69 33 L63 48 L60 61 H40 Z M44 52 H48 M52 52 H56 M45 65 H55 V88 H45 Z',
  ],
} as const;

const heaterShieldVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  rimmed: { prefix: 'Rimmed', prefixZh: '镶边', searchTerms: ['rimmed', 'rim', '镶边', '边框'], svgPath: 'M18 24 L50 10 L82 24 V59 C82 79 67 94 50 104 C33 94 18 79 18 59 Z' },
  scalloped: { prefix: 'Scalloped', prefixZh: '波边', searchTerms: ['scalloped', 'scallop', '波边', '扇边'], svgPath: 'M24 27 C31 23 36 29 42 25 C48 21 53 29 58 25 C64 29 69 23 76 27 M42 85 C45 81 48 86 50 90 C52 86 55 81 58 85' },
  barred: { prefix: 'Barred', prefixZh: '横条', searchTerms: ['barred', 'bar', '横条', '横纹'], svgPath: 'M28 42 H72 V49 H28 M31 58 H69 V65 H31 M37 74 H63 V81 H37' },
} as const;
const heaterShieldVariantIds = ['plain', 'rimmed', 'scalloped', 'barred'] as const satisfies readonly HeaterShieldVariantId[];

const heaterShieldMotifRecords: readonly HeaterShieldMotifRecord[] = [
  { key: 'barrel', name: 'Barrel heater shield', nameZh: '桶形熨斗盾', searchTerms: ['barrel', 'barrel heater', '桶形', '熨斗盾', '桶'], partId: 'barrel' },
  { key: 'broad', name: 'Broad heater shield', nameZh: '宽面熨斗盾', searchTerms: ['broad', 'broad heater', '宽面', '熨斗盾'], partId: 'broad' },
  { key: 'crescent', name: 'Crescent heater shield', nameZh: '新月熨斗盾', searchTerms: ['crescent', 'crescent heater', '新月', '熨斗盾'], partId: 'crescent' },
  { key: 'chapel', name: 'Chapel heater shield', nameZh: '礼拜堂熨斗盾', searchTerms: ['chapel', 'chapel heater', '礼拜堂', '熨斗盾'], partId: 'chapel' },
  { key: 'crossbow', name: 'Crossbow heater shield', nameZh: '弩形熨斗盾', searchTerms: ['crossbow', 'crossbow heater', '弩形', '熨斗盾'], partId: 'crossbow' },
  { key: 'leaf', name: 'Leaf heater shield', nameZh: '叶纹熨斗盾', searchTerms: ['leaf', 'leaf heater', '叶纹', '熨斗盾'], partId: 'leaf' },
  { key: 'mason', name: 'Mason heater shield', nameZh: '砖砌熨斗盾', searchTerms: ['mason', 'mason heater', '砖砌', '熨斗盾'], partId: 'mason' },
  { key: 'naval', name: 'Naval heater shield', nameZh: '海军熨斗盾', searchTerms: ['naval', 'naval heater', '海军', '熨斗盾'], partId: 'naval' },
  { key: 'ridge', name: 'Ridge heater shield', nameZh: '脊线熨斗盾', searchTerms: ['ridge', 'ridge heater', '脊线', '熨斗盾'], partId: 'ridge' },
  { key: 'royal', name: 'Royal heater shield', nameZh: '王室熨斗盾', searchTerms: ['royal', 'royal heater', '王室', '熨斗盾'], partId: 'royal' },
  { key: 'spearhead', name: 'Spearhead heater shield', nameZh: '矛尖熨斗盾', searchTerms: ['spearhead', 'spearhead heater', '矛尖', '熨斗盾'], partId: 'spearhead' },
  { key: 'sunburst', name: 'Sunburst heater shield', nameZh: '日芒熨斗盾', searchTerms: ['sunburst', 'sunburst heater', '日芒', '熨斗盾'], partId: 'sunburst' },
  { key: 'tower', name: 'Tower heater shield', nameZh: '塔楼熨斗盾', searchTerms: ['tower', 'tower heater', '塔楼', '熨斗盾'], partId: 'tower' },
  { key: 'wolf', name: 'Wolf heater shield', nameZh: '狼首熨斗盾', searchTerms: ['wolf', 'wolf heater', '狼首', '熨斗盾'], partId: 'wolf' },
];

const heaterSpecialSemanticKey = 'heater-pointed-heraldic';
const heaterSpecialSvgParts = [
  'M50 3 L94 17 V59 C94 80 76 95 50 108 C24 95 6 80 6 59 V17 Z',
  'M42 27 H58 V35 H42 Z M46 35 H54 V89 H46 Z',
] as const;
const heaterCatalogSemanticKeys = new Set([
  ...heaterShieldMotifRecords.flatMap((motif) => heaterShieldVariantIds.map((variantId) => `heater-${motif.key}-${variantId}`)),
  heaterSpecialSemanticKey,
]);
if (heaterCatalogSemanticKeys.size !== 57) {
  throw new Error(`Invalid heater shield semantic vocabulary size: ${heaterCatalogSemanticKeys.size}`);
}

type FrenchShieldMotifPartId = keyof typeof frenchShieldMotifSvgParts;
type FrenchShieldVariantId = keyof typeof frenchShieldVariantRecords;

interface FrenchShieldMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: FrenchShieldMotifPartId;
}

/** Original local French-shield outlines and inset details for the named shield collection. */
const frenchShieldMotifSvgParts = {
  bourbon: [
    'M50 5 C74 5 91 17 91 39 V61 C91 81 74 96 50 108 C26 96 9 81 9 61 V39 C9 17 26 5 50 5 Z',
    'M32 29 L39 20 L46 30 L50 16 L54 30 L61 20 L68 29 L62 38 H38 Z M45 38 H55 V88 H45 Z',
  ],
  chateau: [
    'M50 4 C76 4 93 18 93 40 V60 C93 81 75 97 50 108 C25 97 7 81 7 60 V40 C7 18 24 4 50 4 Z',
    'M29 65 V36 H37 V28 H45 V36 H55 V28 H63 V36 H71 V65 Z M38 47 H45 V55 H38 Z M55 47 H62 V55 H55 Z M45 65 H55 V88 H45 Z',
  ],
  fleur: [
    'M50 5 C73 5 90 17 90 39 V60 C90 80 73 96 50 108 C27 96 10 80 10 60 V39 C10 17 27 5 50 5 Z',
    'M50 23 C42 16 33 23 37 32 C30 30 26 39 34 44 C40 47 43 43 45 40 L45 61 H55 L55 40 C57 43 60 47 66 44 C74 39 70 30 63 32 C67 23 58 16 50 23 M42 69 H58 V88 H42 Z',
  ],
  gallant: [
    'M50 4 C75 4 92 17 92 40 V61 C92 81 75 97 50 108 C25 97 8 81 8 61 V40 C8 17 25 4 50 4 Z',
    'M39 29 L50 18 L61 29 L56 36 L63 48 L56 58 L59 88 H41 L44 58 L37 48 L44 36 Z M45 48 H55',
  ],
  louvre: [
    'M50 5 C76 5 94 18 94 41 V59 C94 81 76 97 50 108 C24 97 6 81 6 59 V41 C6 18 24 5 50 5 Z',
    'M27 38 L50 20 L73 38 L67 45 H33 Z M34 45 H66 V65 H34 Z M42 51 H48 V59 H42 Z M52 51 H58 V59 H52 Z M45 65 H55 V88 H45 Z',
  ],
  merlet: [
    'M50 4 C74 4 91 17 91 40 V60 C91 81 74 97 50 108 C26 97 9 81 9 60 V40 C9 17 26 4 50 4 Z',
    'M28 36 C37 28 45 35 50 42 C55 35 63 28 72 36 L66 44 L74 51 L65 56 L57 50 L55 88 H45 L43 50 L35 56 L26 51 L34 44 Z',
  ],
  oriflamme: [
    'M50 5 C75 5 92 18 92 40 V60 C92 81 75 97 50 108 C25 97 8 81 8 60 V40 C8 18 25 5 50 5 Z',
    'M39 25 H61 V33 H55 V70 L64 77 L55 83 L50 77 L45 83 L36 77 L45 70 V33 H39 Z M33 38 H45 M55 38 H67 M33 51 H45 M55 51 H67',
  ],
  parisian: [
    'M50 4 C77 4 94 18 94 41 V60 C94 82 76 98 50 109 C24 98 6 82 6 60 V41 C6 18 23 4 50 4 Z',
    'M31 35 L39 23 L47 35 L50 18 L53 35 L61 23 L69 35 L64 43 H36 Z M40 43 H60 V62 H40 Z M45 62 H55 V89 H45 Z',
  ],
  rosace: [
    'M50 5 C74 5 90 17 90 39 V61 C90 81 73 96 50 108 C27 96 10 81 10 61 V39 C10 17 26 5 50 5 Z',
    'M50 25 A17 17 0 1 0 50 59 A17 17 0 0 0 50 25 Z M50 32 A10 10 0 1 1 50 52 A10 10 0 0 1 50 32 Z M45 62 H55 V88 H45 Z',
  ],
  valois: [
    'M50 4 C75 4 93 18 93 40 V61 C93 82 75 98 50 109 C25 98 7 82 7 61 V40 C7 18 25 4 50 4 Z',
    'M31 34 L38 24 L45 32 L50 17 L55 32 L62 24 L69 34 L64 42 H36 Z M41 49 H59 V57 H41 Z M45 57 H55 V89 H45 Z',
  ],
} as const;

const frenchShieldVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  rimmed: { prefix: 'Rimmed', prefixZh: '镶边', searchTerms: ['rimmed', 'rim', '镶边', '边框'], svgPath: 'M17 28 C17 16 31 11 50 11 C69 11 83 16 83 28 V60 C83 78 69 92 50 102 C31 92 17 78 17 60 Z' },
  pierced: { prefix: 'Pierced', prefixZh: '镂孔', searchTerms: ['pierced', 'pierce', 'perforated', '镂孔', '穿孔'], svgPath: 'M50 32 A8 8 0 1 0 50 48 A8 8 0 0 0 50 32 Z M43 63 H57 V70 H43 Z' },
} as const;
const frenchShieldVariantIds = ['plain', 'rimmed', 'pierced'] as const satisfies readonly FrenchShieldVariantId[];

const frenchShieldMotifRecords: readonly FrenchShieldMotifRecord[] = [
  { key: 'bourbon', name: 'Bourbon French shield', nameZh: '波旁法式盾', searchTerms: ['bourbon', 'bourbon French', '波旁', '法式盾'], partId: 'bourbon' },
  { key: 'chateau', name: 'Chateau French shield', nameZh: '城堡法式盾', searchTerms: ['chateau', 'castle French', '城堡', '法式盾'], partId: 'chateau' },
  { key: 'fleur', name: 'Fleur French shield', nameZh: '百合花饰法式盾', searchTerms: ['fleur', 'fleur-de-lis', '百合', '花饰', '法式盾'], partId: 'fleur' },
  { key: 'gallant', name: 'Gallant French shield', nameZh: '骑士法式盾', searchTerms: ['gallant', 'knight French', '骑士', '法式盾'], partId: 'gallant' },
  { key: 'louvre', name: 'Louvre French shield', nameZh: '卢浮法式盾', searchTerms: ['louvre', 'louvre French', '卢浮', '法式盾'], partId: 'louvre' },
  { key: 'merlet', name: 'Merlet French shield', nameZh: '雏燕法式盾', searchTerms: ['merlet', 'martlet', '雏燕', '法式盾'], partId: 'merlet' },
  { key: 'oriflamme', name: 'Oriflamme French shield', nameZh: '圣旗法式盾', searchTerms: ['oriflamme', 'banner French', '圣旗', '法式盾'], partId: 'oriflamme' },
  { key: 'parisian', name: 'Parisian French shield', nameZh: '巴黎法式盾', searchTerms: ['parisian', 'paris French', '巴黎', '法式盾'], partId: 'parisian' },
  { key: 'rosace', name: 'Rosace French shield', nameZh: '蔷薇窗法式盾', searchTerms: ['rosace', 'rose window', '蔷薇窗', '法式盾'], partId: 'rosace' },
  { key: 'valois', name: 'Valois French shield', nameZh: '瓦卢瓦法式盾', searchTerms: ['valois', 'valois French', '瓦卢瓦', '法式盾'], partId: 'valois' },
];

const frenchCatalogSemanticKeys = new Set(
  frenchShieldMotifRecords.flatMap((motif) => frenchShieldVariantIds.map((variantId) => `french-${motif.key}-${variantId}`)),
);
if (frenchCatalogSemanticKeys.size !== 30) {
  throw new Error(`Invalid French shield semantic vocabulary size: ${frenchCatalogSemanticKeys.size}`);
}

type BannerShieldMotifPartId = keyof typeof bannerShieldMotifSvgParts;
type BannerShieldVariantId = keyof typeof bannerShieldVariantRecords;

interface BannerShieldMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: BannerShieldMotifPartId;
}

/** Original local banner-shield outlines and inset details for the named shield collection. */
const bannerShieldMotifSvgParts = {
  pennon: [
    'M10 12 H90 V79 L72 90 L55 83 L37 90 L10 79 Z',
    'M22 25 H67 L58 35 H22 Z M28 41 H60 L51 51 H28 Z M35 57 H53 L44 67 H35 Z',
  ],
  gonfalon: [
    'M12 10 H88 V81 L67 91 L50 83 L33 91 L12 81 Z',
    'M22 23 H78 V30 H22 Z M27 38 H73 V45 H27 Z M32 53 H68 V60 H32 Z M37 68 H63 V75 H37 Z',
  ],
  standard: [
    'M8 12 H92 V78 L76 86 L60 80 L44 87 L28 80 L8 88 Z',
    'M19 28 H81 V35 H19 Z M28 43 H72 V50 H28 Z M37 58 H63 V65 H37 Z',
  ],
  swallowtail: [
    'M9 12 H91 V82 L70 72 L50 91 L30 72 L9 82 Z',
    'M21 27 H79 V34 H21 Z M28 41 H72 V48 H28 Z M35 55 H65 V62 H35 Z',
  ],
  oriflamme: [
    'M11 11 H89 V78 L75 87 L62 80 L50 91 L38 80 L25 87 L11 78 Z',
    'M24 25 H76 V33 H24 Z M30 42 H70 V50 H30 Z M38 59 H62 V67 H38 Z',
  ],
  guidon: [
    'M10 13 H90 V76 L73 88 L50 81 L27 88 L10 76 Z',
    'M22 26 H65 L57 35 H22 Z M28 42 H59 L51 51 H28 Z M35 58 H53 L45 67 H35 Z',
  ],
  streamer: [
    'M8 11 H92 V77 L81 87 L69 80 L58 90 L46 81 L34 90 L22 80 L8 87 Z',
    'M20 25 H80 V32 H20 Z M27 40 H73 V47 H27 Z M34 55 H66 V62 H34 Z',
  ],
  ensign: [
    'M9 12 H91 V80 L76 89 L61 81 L50 90 L39 81 L24 89 L9 80 Z',
    'M22 27 H78 V34 H22 Z M29 43 H71 V50 H29 Z M36 59 H64 V66 H36 Z',
  ],
  vexillum: [
    'M11 10 H89 V82 L70 90 L50 82 L30 90 L11 82 Z',
    'M20 22 H80 V29 H20 Z M26 37 H74 V44 H26 Z M32 52 H68 V59 H32 Z M38 67 H62 V74 H38 Z',
  ],
  ribbon: [
    'M9 12 H91 V78 L75 89 L60 81 L50 91 L40 81 L25 89 L9 78 Z',
    'M22 26 C36 20 43 33 50 27 C57 33 64 20 78 26 M22 43 C36 37 43 50 50 44 C57 50 64 37 78 43 M31 60 C40 56 45 65 50 61 C55 65 60 56 69 60',
  ],
} as const;

const bannerShieldVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  fringed: { prefix: 'Fringed', prefixZh: '流苏', searchTerms: ['fringed', 'fringe', '流苏', '穗边'], svgPath: 'M16 76 L21 86 L26 76 L31 86 L36 76 L41 86 L46 76 L51 86 L56 76 L61 86 L66 76 L71 86 L76 76 L81 86 L86 76' },
  notched: { prefix: 'Notched', prefixZh: '刻缺', searchTerms: ['notched', 'notch', '刻缺', '缺口'], svgPath: 'M43 13 L50 21 L57 13 M22 66 L29 73 L36 66 M64 66 L71 73 L78 66' },
} as const;
const bannerShieldVariantIds = ['plain', 'fringed', 'notched'] as const satisfies readonly BannerShieldVariantId[];

const bannerShieldMotifRecords: readonly BannerShieldMotifRecord[] = [
  { key: 'pennon', name: 'Pennon banner shield', nameZh: '三角旗帜盾', searchTerms: ['pennon', 'pennon banner', '三角旗', '旗帜盾'], partId: 'pennon' },
  { key: 'gonfalon', name: 'Gonfalon banner shield', nameZh: '垂幡旗帜盾', searchTerms: ['gonfalon', 'gonfalon banner', '垂幡', '旗帜盾'], partId: 'gonfalon' },
  { key: 'standard', name: 'Standard banner shield', nameZh: '军旗旗帜盾', searchTerms: ['standard', 'standard banner', '军旗', '旗帜盾'], partId: 'standard' },
  { key: 'swallowtail', name: 'Swallowtail banner shield', nameZh: '燕尾旗帜盾', searchTerms: ['swallowtail', 'swallowtail banner', '燕尾', '旗帜盾'], partId: 'swallowtail' },
  { key: 'oriflamme', name: 'Oriflamme banner shield', nameZh: '圣焰旗帜盾', searchTerms: ['oriflamme', 'oriflamme banner', '圣焰', '旗帜盾'], partId: 'oriflamme' },
  { key: 'guidon', name: 'Guidon banner shield', nameZh: '骑旗旗帜盾', searchTerms: ['guidon', 'guidon banner', '骑旗', '旗帜盾'], partId: 'guidon' },
  { key: 'streamer', name: 'Streamer banner shield', nameZh: '飘带旗帜盾', searchTerms: ['streamer', 'streamer banner', '飘带', '旗帜盾'], partId: 'streamer' },
  { key: 'ensign', name: 'Ensign banner shield', nameZh: '舰旗旗帜盾', searchTerms: ['ensign', 'ensign banner', '舰旗', '旗帜盾'], partId: 'ensign' },
  { key: 'vexillum', name: 'Vexillum banner shield', nameZh: '罗马军旗帜盾', searchTerms: ['vexillum', 'roman banner', '罗马军旗', '旗帜盾'], partId: 'vexillum' },
  { key: 'ribbon', name: 'Ribbon banner shield', nameZh: '绶带旗帜盾', searchTerms: ['ribbon', 'ribbon banner', '绶带', '旗帜盾'], partId: 'ribbon' },
];

const bannerCatalogSemanticKeys = new Set(
  bannerShieldMotifRecords.flatMap((motif) => bannerShieldVariantIds.map((variantId) => `banner-${motif.key}-${variantId}`)),
);
if (bannerCatalogSemanticKeys.size !== 30) {
  throw new Error(`Invalid Banner shield semantic vocabulary size: ${bannerCatalogSemanticKeys.size}`);
}

type RoundShieldMotifPartId = keyof typeof roundShieldMotifSvgParts;
type RoundShieldVariantId = keyof typeof roundShieldVariantRecords;

interface RoundShieldMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: RoundShieldMotifPartId;
}

/** Original local round-shield silhouettes and inset details for the named shield collection. */
const roundShieldMotifSvgParts = {
  medallion: [
    'M50 5 A45 45 0 1 0 50 95 A45 45 0 1 0 50 5 Z',
    'M50 21 A29 29 0 1 0 50 79 A29 29 0 1 0 50 21 Z M45 37 H55 V63 H45 Z',
  ],
  orb: [
    'M50 4 C77 4 96 24 96 51 C96 78 77 98 50 98 C23 98 4 78 4 51 C4 24 23 4 50 4 Z',
    'M24 51 H76 M50 25 V77 M34 35 L66 67 M66 35 L34 67',
  ],
  oculus: [
    'M50 7 C76 7 93 25 93 51 C93 77 76 95 50 95 C24 95 7 77 7 51 C7 25 24 7 50 7 Z',
    'M50 25 A26 26 0 1 0 50 77 A26 26 0 0 0 50 25 Z M43 43 H57 V59 H43 Z',
  ],
  rondel: [
    'M50 4 L75 11 L93 29 L96 52 L86 76 L64 93 L39 95 L15 82 L4 58 L8 32 L26 11 Z',
    'M50 23 L62 38 L76 51 L62 64 L50 79 L38 64 L24 51 L38 38 Z',
  ],
  aureole: [
    'M50 6 C79 6 94 22 94 51 C94 80 79 96 50 96 C21 96 6 80 6 51 C6 22 21 6 50 6 Z',
    'M50 18 L55 35 L72 35 L58 46 L64 63 L50 53 L36 63 L42 46 L28 35 L45 35 Z',
  ],
  cartouche: [
    'M25 8 H75 C87 8 94 17 94 30 V70 C94 83 87 92 75 92 H25 C13 92 6 83 6 70 V30 C6 17 13 8 25 8 Z',
    'M24 32 C32 24 39 34 50 28 C61 34 68 24 76 32 M24 51 C32 43 39 53 50 47 C61 53 68 43 76 51 M42 64 H58 V76 H42 Z',
  ],
  rosette: [
    'M50 5 C60 5 63 14 69 17 C76 14 85 20 84 30 C93 34 94 45 87 51 C94 58 91 70 82 73 C82 84 71 89 63 84 C57 93 43 93 37 84 C29 89 18 84 18 73 C9 70 6 58 13 51 C6 45 7 34 16 30 C15 20 24 14 31 17 C37 14 40 5 50 5 Z',
    'M50 28 A23 23 0 1 0 50 74 A23 23 0 0 0 50 28 Z M46 42 H54 V60 H46 Z',
  ],
  porthole: [
    'M50 4 C76 4 95 24 95 51 C95 78 76 98 50 98 C24 98 5 78 5 51 C5 24 24 4 50 4 Z',
    'M50 18 A33 33 0 1 0 50 84 A33 33 0 0 0 50 18 Z M47 25 H53 V32 H47 M68 48 H75 V54 H68 M47 70 H53 V77 H47 M25 48 H32 V54 H25',
  ],
  disc: [
    'M50 8 C78 8 92 22 92 50 C92 78 78 92 50 92 C22 92 8 78 8 50 C8 22 22 8 50 8 Z',
    'M22 50 C30 37 40 35 50 43 C60 35 70 37 78 50 C70 63 60 65 50 57 C40 65 30 63 22 50 Z M45 61 H55 V76 H45 Z',
  ],
  moon: [
    'M50 5 C77 5 95 24 95 51 C95 78 77 97 50 97 C23 97 5 78 5 51 C5 24 23 5 50 5 Z',
    'M57 24 C39 26 31 48 45 61 C35 56 32 40 42 30 C48 24 54 22 57 24 M44 66 H56 V78 H44 Z',
  ],
} as const;

const roundShieldVariantRecords = {
  round: { prefix: '', prefixZh: '', searchTerms: ['round', 'circular', '圆形', '圆盾'] },
  oval: { prefix: 'Oval', prefixZh: '椭圆', searchTerms: ['oval', 'elliptical', '椭圆', '椭圆盾'], svgPath: 'M50 11 C75 11 87 25 87 51 C87 77 75 91 50 91 C25 91 13 77 13 51 C13 25 25 11 50 11 Z' },
  rimmed: { prefix: 'Rimmed', prefixZh: '镶边', searchTerms: ['rimmed', 'rim', '镶边', '圆角'], svgPath: 'M50 13 A38 38 0 1 0 50 89 A38 38 0 1 0 50 13 Z' },
} as const;
const roundShieldVariantIds = ['round', 'oval', 'rimmed'] as const satisfies readonly RoundShieldVariantId[];

const roundShieldMotifRecords: readonly RoundShieldMotifRecord[] = [
  { key: 'medallion', name: 'Medallion round shield', nameZh: '勋章圆盾', searchTerms: ['medallion', 'medallion round', '勋章', '圆盾'], partId: 'medallion' },
  { key: 'orb', name: 'Orb round shield', nameZh: '宝球圆盾', searchTerms: ['orb', 'orb round', '宝球', '圆盾'], partId: 'orb' },
  { key: 'oculus', name: 'Oculus round shield', nameZh: '圆窗圆盾', searchTerms: ['oculus', 'oculus round', '圆窗', '圆盾'], partId: 'oculus' },
  { key: 'rondel', name: 'Rondel round shield', nameZh: '棱圆圆盾', searchTerms: ['rondel', 'faceted round', '棱圆', '圆盾'], partId: 'rondel' },
  { key: 'aureole', name: 'Aureole round shield', nameZh: '光环圆盾', searchTerms: ['aureole', 'halo round', '光环', '圆盾'], partId: 'aureole' },
  { key: 'cartouche', name: 'Cartouche round shield', nameZh: '圆角饰框盾', searchTerms: ['cartouche', 'rounded frame', '圆角', '饰框', '圆盾'], partId: 'cartouche' },
  { key: 'rosette', name: 'Rosette round shield', nameZh: '花环圆盾', searchTerms: ['rosette', 'rosette round', '花环', '圆盾'], partId: 'rosette' },
  { key: 'porthole', name: 'Porthole round shield', nameZh: '舷窗圆盾', searchTerms: ['porthole', 'porthole round', '舷窗', '圆盾'], partId: 'porthole' },
  { key: 'disc', name: 'Disc round shield', nameZh: '圆盘圆盾', searchTerms: ['disc', 'disc round', '圆盘', '圆盾'], partId: 'disc' },
  { key: 'moon', name: 'Moon round shield', nameZh: '新月圆盾', searchTerms: ['moon', 'moon round', '新月', '圆盾'], partId: 'moon' },
];

const roundCatalogSemanticKeys = new Set(
  roundShieldMotifRecords.flatMap((motif) => roundShieldVariantIds.map((variantId) => `round-${motif.key}-${variantId}`)),
);
if (roundCatalogSemanticKeys.size !== 30) {
  throw new Error(`Invalid Round shield semantic vocabulary size: ${roundCatalogSemanticKeys.size}`);
}

type LozengeShieldMotifPartId = keyof typeof lozengeShieldMotifSvgParts;
type LozengeShieldVariantId = keyof typeof lozengeShieldVariantRecords;

interface LozengeShieldMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: LozengeShieldMotifPartId;
}

/** Original local lozenge-shield silhouettes and inset details for the named shield collection. */
const lozengeShieldMotifSvgParts = {
  diamond: [
    'M50 4 L94 55 L50 106 L6 55 Z',
    'M50 23 L72 55 L50 87 L28 55 Z M45 45 H55 V65 H45 Z',
  ],
  pendant: [
    'M50 3 L91 46 L78 77 L50 107 L22 77 L9 46 Z',
    'M50 22 L68 47 L61 64 L50 82 L39 64 L32 47 Z M45 42 H55 V61 H45',
  ],
  chamfer: [
    'M50 5 L80 19 L94 55 L80 91 L50 105 L20 91 L6 55 L20 19 Z',
    'M50 25 L66 39 L66 61 L50 77 L34 61 L34 39 Z M45 43 H55 V61 H45',
  ],
  gem: [
    'M50 4 L84 29 L94 56 L75 88 L50 106 L25 88 L6 56 L16 29 Z',
    'M18 30 H82 L75 44 H25 Z M25 44 L50 83 L75 44 M45 57 H55 V71 H45',
  ],
  kite: [
    'M50 3 L86 34 L79 73 L50 107 L21 73 L14 34 Z',
    'M50 23 L68 43 L61 63 L50 85 L39 63 L32 43 Z M45 42 H55 V65 H45',
  ],
  prism: [
    'M50 5 L88 37 L82 72 L50 106 L18 72 L12 37 Z',
    'M50 20 L72 44 L50 86 L28 44 Z M28 44 H72 M50 20 V86 M45 51 H55 V66 H45',
  ],
  tile: [
    'M50 6 L91 55 L50 104 L9 55 Z',
    'M50 20 L79 55 L50 90 L21 55 Z M31 55 H69 M50 31 V79 M45 46 H55 V64 H45',
  ],
  rosette: [
    'M50 4 L78 19 L94 49 L83 79 L50 106 L17 79 L6 49 L22 19 Z',
    'M50 27 L58 43 L75 45 L62 57 L66 74 L50 65 L34 74 L38 57 L25 45 L42 43 Z',
  ],
  crest: [
    'M50 3 L82 24 L92 56 L72 88 L50 107 L28 88 L8 56 L18 24 Z',
    'M35 38 L42 25 L49 35 L50 18 L51 35 L58 25 L65 38 L59 47 H41 Z M45 50 H55 V75 H45',
  ],
  filigree: [
    'M50 5 L90 55 L50 105 L10 55 Z',
    'M50 22 C39 31 39 45 48 51 C41 48 35 55 42 63 C46 67 49 63 50 59 C51 63 54 67 58 63 C65 55 59 48 52 51 C61 45 61 31 50 22 M44 67 H56 V82 H44 Z',
  ],
} as const;

const lozengeShieldVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  rimmed: { prefix: 'Rimmed', prefixZh: '镶边', searchTerms: ['rimmed', 'rim', '镶边', '边框'], svgPath: 'M50 13 L82 55 L50 97 L18 55 Z' },
  inset: { prefix: 'Inset', prefixZh: '内嵌', searchTerms: ['inset', 'beveled', '内嵌', '倒角'], svgPath: 'M50 31 L66 55 L50 79 L34 55 Z' },
} as const;
const lozengeShieldVariantIds = ['plain', 'rimmed', 'inset'] as const satisfies readonly LozengeShieldVariantId[];

const lozengeShieldMotifRecords: readonly LozengeShieldMotifRecord[] = [
  { key: 'diamond', name: 'Diamond lozenge shield', nameZh: '钻形菱形盾', searchTerms: ['diamond', 'diamond lozenge', '钻形', '菱形盾'], partId: 'diamond' },
  { key: 'pendant', name: 'Pendant lozenge shield', nameZh: '悬饰菱形盾', searchTerms: ['pendant', 'pendant lozenge', '悬饰', '菱形盾'], partId: 'pendant' },
  { key: 'chamfer', name: 'Chamfered lozenge shield', nameZh: '倒角菱形盾', searchTerms: ['chamfered', 'chamfer lozenge', '倒角', '菱形盾'], partId: 'chamfer' },
  { key: 'gem', name: 'Gem lozenge shield', nameZh: '宝石菱形盾', searchTerms: ['gem', 'gem lozenge', '宝石', '菱形盾'], partId: 'gem' },
  { key: 'kite', name: 'Kite lozenge shield', nameZh: '鸢形菱形盾', searchTerms: ['kite', 'kite lozenge', '鸢形', '菱形盾'], partId: 'kite' },
  { key: 'prism', name: 'Prism lozenge shield', nameZh: '棱镜菱形盾', searchTerms: ['prism', 'prism lozenge', '棱镜', '菱形盾'], partId: 'prism' },
  { key: 'tile', name: 'Tile lozenge shield', nameZh: '瓦片菱形盾', searchTerms: ['tile', 'tile lozenge', '瓦片', '菱形盾'], partId: 'tile' },
  { key: 'rosette', name: 'Rosette lozenge shield', nameZh: '花饰菱形盾', searchTerms: ['rosette', 'rosette lozenge', '花饰', '菱形盾'], partId: 'rosette' },
  { key: 'crest', name: 'Crest lozenge shield', nameZh: '冠脊菱形盾', searchTerms: ['crest', 'crest lozenge', '冠脊', '菱形盾'], partId: 'crest' },
  { key: 'filigree', name: 'Filigree lozenge shield', nameZh: '花丝菱形盾', searchTerms: ['filigree', 'filigree lozenge', '花丝', '菱形盾'], partId: 'filigree' },
];

const lozengeCatalogSemanticKeys = new Set(
  lozengeShieldMotifRecords.flatMap((motif) => lozengeShieldVariantIds.map((variantId) => `lozenge-${motif.key}-${variantId}`)),
);
if (lozengeCatalogSemanticKeys.size !== 30) {
  throw new Error(`Invalid Lozenge shield semantic vocabulary size: ${lozengeCatalogSemanticKeys.size}`);
}

type AnimalMotifPartId = keyof typeof animalMotifSvgParts;
type AnimalPoseId = keyof typeof animalPoseRecords;
type AnimalOrnamentId = keyof typeof animalOrnamentRecords;

interface AnimalMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: AnimalMotifPartId;
  readonly poseIds: readonly [AnimalPoseId, AnimalPoseId, AnimalPoseId];
}

/** Original, local silhouette parts grouped by zoologically related heraldic motifs. */
const animalMotifSvgParts = {
  feline: 'M14 76 L25 60 L24 43 L34 32 L45 36 L56 29 L67 37 L80 41 L88 55 L78 63 L81 88 H70 L63 68 H49 L40 90 H30 L34 68 L22 82 Z M28 43 L24 27 L38 34 Z',
  canine: 'M13 78 L26 61 L25 44 L34 29 L43 38 L56 35 L66 42 L82 47 L88 60 L77 65 L80 89 H69 L62 70 H49 L39 90 H29 L34 68 L20 82 Z M65 42 L74 29 L75 45 Z',
  bear: 'M15 76 L23 56 L28 39 L38 31 L49 37 L61 35 L73 44 L85 55 L78 68 L81 90 H67 L61 70 H48 L40 91 H27 L31 68 L18 83 Z M33 37 L30 25 L42 32 Z',
  stag: 'M16 79 L28 62 L28 42 L39 33 L49 39 L60 34 L70 43 L82 48 L87 60 L77 65 L79 89 H68 L61 70 H49 L40 91 H29 L34 69 L20 83 Z M35 35 L30 17 L37 21 L40 12 L44 30 M58 35 L64 17 L67 24 L74 15 L68 39',
  goat: 'M16 78 L27 61 L27 43 L37 31 L48 38 L58 34 L69 43 L82 49 L87 61 L77 66 L80 90 H69 L62 70 H49 L40 91 H29 L34 69 L20 83 Z M37 33 C29 24 30 14 40 16 C45 18 43 26 39 29 M58 35 C66 26 71 17 64 13 C58 12 56 22 60 30',
  horse: 'M15 78 L27 61 L26 43 L38 27 L47 37 L58 32 L68 42 L82 48 L88 60 L77 66 L80 90 H69 L62 70 H49 L40 91 H29 L34 69 L20 83 Z M38 30 L31 17 L43 24 M66 42 L75 30 L74 47 Z',
  boar: 'M14 78 L25 62 L24 46 L34 35 L47 39 L59 37 L71 45 L85 51 L89 63 L79 68 L80 90 H69 L61 70 H48 L40 91 H29 L34 69 L20 83 Z M70 48 L83 41 L78 54 L88 55 L78 60',
  hare: 'M17 80 L27 64 L28 45 L38 31 L48 39 L59 36 L69 46 L81 52 L85 63 L76 67 L78 89 H67 L60 70 H49 L40 91 H30 L35 69 L22 83 Z M36 35 L31 11 L40 14 L43 32 M48 38 L48 12 L56 17 L54 38',
  otter: 'M12 75 C20 63 27 53 39 49 L52 42 L68 46 L84 59 L77 67 L88 80 L76 84 L64 72 L51 69 L40 89 L29 89 L34 68 L20 82 Z M25 57 L17 42 L31 49 Z',
  eagle: 'M50 14 L60 31 L82 21 L73 43 L93 51 L70 58 L78 84 L57 68 L50 94 L43 68 L22 84 L30 58 L7 51 L27 43 L18 21 L40 31 Z M46 31 L50 21 L54 31 L50 40 Z',
  owl: 'M24 83 L27 47 L18 33 L34 38 L41 21 L50 34 L59 21 L66 38 L82 33 L73 47 L76 83 L63 91 L50 82 L37 91 Z M34 48 L43 44 L47 51 L40 57 Z M66 48 L57 44 L53 51 L60 57 Z',
  raven: 'M17 81 L28 61 L25 42 L37 32 L48 38 L59 33 L70 42 L86 48 L76 57 L83 77 L68 72 L61 90 L51 72 L40 90 L32 72 L19 82 Z M68 43 L88 35 L78 49 Z',
  swan: 'M19 84 C23 67 29 55 40 49 C35 38 39 23 52 18 C64 16 73 25 68 34 L59 38 C62 45 69 48 78 53 L85 73 L70 69 L62 90 L51 70 L41 90 L33 71 Z M50 28 L58 21 L56 34 Z',
  crane: 'M23 88 L31 63 L29 41 L40 31 L49 39 L60 35 L70 43 L82 50 L75 61 L80 88 H68 L61 70 L52 92 H44 L43 69 L34 88 Z M41 33 L46 13 L51 29 M66 43 L80 23 L75 48 Z',
  fish: 'M11 55 L28 42 L45 34 L65 37 L82 28 L78 47 L92 55 L78 63 L82 82 L65 73 L45 76 L28 68 Z M38 52 L45 47 L51 54 L45 61 Z',
  turtle: 'M18 61 L27 43 L44 35 L62 37 L77 48 L82 61 L73 75 L61 82 L44 80 L29 72 Z M31 45 L20 34 L24 53 M69 47 L82 36 L77 56 M37 78 L32 91 M61 80 L67 91',
  dragon: 'M14 82 L25 68 L34 59 L29 43 L18 34 L38 39 L35 25 L49 34 L59 27 L70 37 L82 29 L77 43 L88 54 L76 63 L73 84 L63 76 L57 92 L50 76 L39 85 L27 86 L34 75 Z M47 54 L59 13 L68 44 L85 27 L73 61 Z',
  griffin: 'M17 83 L27 65 L26 44 L38 32 L48 38 L58 31 L67 42 L82 47 L87 59 L76 64 L75 85 L64 76 L58 92 L50 76 L40 90 L30 88 L34 69 L21 83 Z M51 48 L59 14 L68 42 L84 25 L72 56 Z M64 42 L84 35 L73 49 Z',
  unicorn: 'M16 79 L27 62 L26 43 L38 29 L48 38 L58 32 L68 42 L82 48 L87 60 L77 66 L80 90 H69 L62 70 H49 L40 91 H29 L34 69 L20 83 Z M39 31 L50 7 L48 34',
  serpent: 'M19 84 C16 72 26 66 37 62 C49 58 62 55 67 44 C72 33 65 23 55 25 C48 26 47 35 52 39 C45 42 38 39 38 32 C38 18 54 11 68 18 C85 26 85 47 73 59 C62 70 48 71 38 76 C31 79 30 84 35 90 Z M65 28 L79 20 L72 34 Z',
  bat: 'M12 56 L29 42 L27 26 L42 35 L50 20 L58 35 L73 26 L71 42 L88 56 L76 62 L81 82 L64 73 L56 91 L50 75 L44 91 L36 73 L19 82 L24 62 Z M45 44 L50 38 L55 44 L50 51 Z',
} as const;

const animalPoseRecords = {
  rampant: { name: 'rampant', nameZh: '跃立', searchTerms: ['rampant', '跃立'], svgPath: 'M43 66 L35 50 L26 48 L29 57 L39 62 L31 73 L22 70 L20 79 L37 84 L48 73 Z' },
  passant: { name: 'passant', nameZh: '行走', searchTerms: ['passant', '行走'], svgPath: 'M35 71 L23 81 L17 78 L29 65 L41 64 L50 72 L65 70 L76 81 L70 86 L60 78 L48 80 Z' },
  guardant: { name: 'guardant', nameZh: '回首', searchTerms: ['guardant', '回首'], svgPath: 'M31 44 L39 35 L49 39 L52 49 L43 55 L33 52 Z M38 43 L42 40 L45 44 L42 48 Z' },
  displayed: { name: 'displayed', nameZh: '展翅', searchTerms: ['displayed', '展翅'], svgPath: 'M49 47 L31 18 L36 45 L12 36 L27 55 L8 63 L39 61 L50 76 L61 61 L92 63 L73 55 L88 36 L64 45 L69 18 Z' },
  rising: { name: 'rising', nameZh: '振翅', searchTerms: ['rising', '振翅'], svgPath: 'M47 54 L29 22 L31 51 L13 47 L29 65 L44 64 L53 43 L76 19 L68 52 L88 48 L69 68 L56 65 Z' },
  volant: { name: 'volant', nameZh: '飞翔', searchTerms: ['volant', '飞翔'], svgPath: 'M19 62 L40 49 L48 28 L55 48 L82 35 L68 57 L90 61 L64 67 L54 82 L47 66 L25 75 Z' },
  naiant: { name: 'naiant', nameZh: '游弋', searchTerms: ['naiant', '游弋'], svgPath: 'M21 64 L34 53 L45 58 L55 49 L69 56 L81 47 L76 63 L88 70 L70 73 L59 67 L46 74 L34 67 Z' },
  hauriant: { name: 'hauriant', nameZh: '直立游姿', searchTerms: ['hauriant', '直立游姿'], svgPath: 'M48 19 L58 34 L53 46 L63 57 L55 72 L50 91 L44 72 L37 57 L46 46 L42 34 Z' },
  embowed: { name: 'embowed', nameZh: '弯曲', searchTerms: ['embowed', '弯曲'], svgPath: 'M24 75 C28 49 41 42 58 43 C70 44 77 53 78 67 L66 68 C64 58 58 54 51 55 C40 57 38 66 37 80 Z' },
  segreant: { name: 'segreant', nameZh: '展翼跃立', searchTerms: ['segreant', '展翼跃立'], svgPath: 'M43 67 L29 36 L31 60 L11 48 L28 72 L18 82 L37 84 L48 74 L59 84 L82 82 L72 71 L90 48 L69 60 L72 36 L57 67 Z' },
} as const;

const animalOrnamentRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素纹'] },
  crowned: { prefix: 'Crowned', prefixZh: '加冕', searchTerms: ['crowned', 'crown', '加冕', '冠冕'], svgPath: 'M35 28 L40 17 L48 25 L54 12 L61 25 L70 16 L67 32 H38 Z' },
  'oak-bearing': { prefix: 'Oak-bearing', prefixZh: '衔橡枝', searchTerms: ['oak-bearing', 'oak', '橡树', '橡枝', '衔橡枝'], svgPath: 'M23 69 C37 61 53 59 72 48 L74 53 C57 64 41 70 25 75 Z M55 58 C49 49 57 45 62 51 C65 57 60 60 55 58 M43 65 C37 56 45 52 50 58 C53 64 48 67 43 65' },
} as const;
const animalOrnamentIds = ['plain', 'crowned', 'oak-bearing'] as const satisfies readonly AnimalOrnamentId[];

const landAnimalPoseIds = ['rampant', 'passant', 'guardant'] as const satisfies AnimalMotifRecord['poseIds'];
const birdAnimalPoseIds = ['displayed', 'rising', 'volant'] as const satisfies AnimalMotifRecord['poseIds'];
const waterAnimalPoseIds = ['naiant', 'hauriant', 'embowed'] as const satisfies AnimalMotifRecord['poseIds'];
const mythicalAnimalPoseIds = ['segreant', 'rampant', 'displayed'] as const satisfies AnimalMotifRecord['poseIds'];

const animalMotifRecords: readonly AnimalMotifRecord[] = [
  { key: 'lion', name: 'Lion', nameZh: '雄狮', searchTerms: ['lion', '狮子', '雄狮'], partId: 'feline', poseIds: landAnimalPoseIds },
  { key: 'eagle', name: 'Eagle', nameZh: '鹰', searchTerms: ['eagle', '鹰'], partId: 'eagle', poseIds: birdAnimalPoseIds },
  { key: 'tiger', name: 'Tiger', nameZh: '老虎', searchTerms: ['tiger', '虎', '老虎'], partId: 'feline', poseIds: landAnimalPoseIds },
  { key: 'leopard', name: 'Leopard', nameZh: '豹', searchTerms: ['leopard', '豹'], partId: 'feline', poseIds: landAnimalPoseIds },
  { key: 'panther', name: 'Panther', nameZh: '黑豹', searchTerms: ['panther', '黑豹'], partId: 'feline', poseIds: landAnimalPoseIds },
  { key: 'wolf', name: 'Wolf', nameZh: '狼', searchTerms: ['wolf', '狼'], partId: 'canine', poseIds: landAnimalPoseIds },
  { key: 'fox', name: 'Fox', nameZh: '狐狸', searchTerms: ['fox', '狐狸'], partId: 'canine', poseIds: landAnimalPoseIds },
  { key: 'bear', name: 'Bear', nameZh: '熊', searchTerms: ['bear', '熊'], partId: 'bear', poseIds: landAnimalPoseIds },
  { key: 'stag', name: 'Stag', nameZh: '雄鹿', searchTerms: ['stag', 'deer', '鹿', '雄鹿'], partId: 'stag', poseIds: landAnimalPoseIds },
  { key: 'deer', name: 'Deer', nameZh: '鹿', searchTerms: ['deer', '鹿'], partId: 'stag', poseIds: landAnimalPoseIds },
  { key: 'antelope', name: 'Antelope', nameZh: '羚羊', searchTerms: ['antelope', '羚羊'], partId: 'stag', poseIds: landAnimalPoseIds },
  { key: 'ram', name: 'Ram', nameZh: '公羊', searchTerms: ['ram', 'sheep', '羊', '公羊'], partId: 'goat', poseIds: landAnimalPoseIds },
  { key: 'ibex', name: 'Ibex', nameZh: '野山羊', searchTerms: ['ibex', '野山羊'], partId: 'goat', poseIds: landAnimalPoseIds },
  { key: 'goat', name: 'Goat', nameZh: '山羊', searchTerms: ['goat', '山羊'], partId: 'goat', poseIds: landAnimalPoseIds },
  { key: 'horse', name: 'Horse', nameZh: '骏马', searchTerms: ['horse', '马', '骏马'], partId: 'horse', poseIds: landAnimalPoseIds },
  { key: 'mule', name: 'Mule', nameZh: '骡', searchTerms: ['mule', '骡'], partId: 'horse', poseIds: landAnimalPoseIds },
  { key: 'boar', name: 'Boar', nameZh: '野猪', searchTerms: ['boar', '猪', '野猪'], partId: 'boar', poseIds: landAnimalPoseIds },
  { key: 'hare', name: 'Hare', nameZh: '野兔', searchTerms: ['hare', '野兔'], partId: 'hare', poseIds: landAnimalPoseIds },
  { key: 'rabbit', name: 'Rabbit', nameZh: '兔子', searchTerms: ['rabbit', '兔', '兔子'], partId: 'hare', poseIds: landAnimalPoseIds },
  { key: 'otter', name: 'Otter', nameZh: '水獭', searchTerms: ['otter', '水獭'], partId: 'otter', poseIds: landAnimalPoseIds },
  { key: 'beaver', name: 'Beaver', nameZh: '河狸', searchTerms: ['beaver', '河狸'], partId: 'otter', poseIds: landAnimalPoseIds },
  { key: 'falcon', name: 'Falcon', nameZh: '猎鹰', searchTerms: ['falcon', '鹰', '猎鹰'], partId: 'eagle', poseIds: birdAnimalPoseIds },
  { key: 'hawk', name: 'Hawk', nameZh: '鹰隼', searchTerms: ['hawk', '鹰', '鹰隼'], partId: 'eagle', poseIds: birdAnimalPoseIds },
  { key: 'owl', name: 'Owl', nameZh: '猫头鹰', searchTerms: ['owl', '猫头鹰'], partId: 'owl', poseIds: birdAnimalPoseIds },
  { key: 'raven', name: 'Raven', nameZh: '渡鸦', searchTerms: ['raven', '乌鸦', '渡鸦'], partId: 'raven', poseIds: birdAnimalPoseIds },
  { key: 'swan', name: 'Swan', nameZh: '天鹅', searchTerms: ['swan', '天鹅'], partId: 'swan', poseIds: birdAnimalPoseIds },
  { key: 'crane', name: 'Crane', nameZh: '鹤', searchTerms: ['crane', '鹤'], partId: 'crane', poseIds: birdAnimalPoseIds },
  { key: 'pelican', name: 'Pelican', nameZh: '鹈鹕', searchTerms: ['pelican', '鹈鹕'], partId: 'swan', poseIds: birdAnimalPoseIds },
  { key: 'dolphin', name: 'Dolphin', nameZh: '海豚', searchTerms: ['dolphin', '海豚'], partId: 'fish', poseIds: waterAnimalPoseIds },
  { key: 'salmon', name: 'Salmon', nameZh: '鲑鱼', searchTerms: ['salmon', '鱼', '鲑鱼'], partId: 'fish', poseIds: waterAnimalPoseIds },
  { key: 'carp', name: 'Carp', nameZh: '鲤鱼', searchTerms: ['carp', '鱼', '鲤鱼'], partId: 'fish', poseIds: waterAnimalPoseIds },
  { key: 'turtle', name: 'Turtle', nameZh: '海龟', searchTerms: ['turtle', '龟', '海龟'], partId: 'turtle', poseIds: waterAnimalPoseIds },
  { key: 'dragon', name: 'Dragon', nameZh: '龙', searchTerms: ['dragon', '龙'], partId: 'dragon', poseIds: mythicalAnimalPoseIds },
  { key: 'griffin', name: 'Griffin', nameZh: '狮鹫', searchTerms: ['griffin', '狮鹫'], partId: 'griffin', poseIds: mythicalAnimalPoseIds },
  { key: 'phoenix', name: 'Phoenix', nameZh: '凤凰', searchTerms: ['phoenix', '凤凰'], partId: 'eagle', poseIds: birdAnimalPoseIds },
  { key: 'unicorn', name: 'Unicorn', nameZh: '独角兽', searchTerms: ['unicorn', '独角兽'], partId: 'unicorn', poseIds: mythicalAnimalPoseIds },
  { key: 'wyvern', name: 'Wyvern', nameZh: '双足飞龙', searchTerms: ['wyvern', '飞龙', '双足飞龙'], partId: 'dragon', poseIds: mythicalAnimalPoseIds },
  { key: 'serpent', name: 'Serpent', nameZh: '巨蛇', searchTerms: ['serpent', '蛇', '巨蛇'], partId: 'serpent', poseIds: waterAnimalPoseIds },
  { key: 'basilisk', name: 'Basilisk', nameZh: '蛇怪', searchTerms: ['basilisk', '蛇怪'], partId: 'serpent', poseIds: mythicalAnimalPoseIds },
  { key: 'seahorse', name: 'Sea horse', nameZh: '海马', searchTerms: ['sea horse', 'seahorse', '海马'], partId: 'fish', poseIds: waterAnimalPoseIds },
  { key: 'bat', name: 'Bat', nameZh: '蝙蝠', searchTerms: ['bat', '蝙蝠'], partId: 'bat', poseIds: birdAnimalPoseIds },
];

const animalCatalogSemanticKeys = new Set(
  animalMotifRecords.flatMap((motif) => motif.poseIds.flatMap((poseId) => (
    animalOrnamentIds.map((ornamentId) => `${motif.key}-${poseId}-${ornamentId}`)
  ))),
);
if (animalCatalogSemanticKeys.size !== 369) {
  throw new Error(`Invalid animal semantic vocabulary size: ${animalCatalogSemanticKeys.size}`);
}

type ObjectMotifPartId = keyof typeof objectMotifSvgParts;
type ObjectVariantId = keyof typeof objectVariantRecords;

interface ObjectMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: ObjectMotifPartId;
}

/** Original local parts for each named object, with a structural detail per motif. */
const objectMotifSvgParts = {
  watchtower: [
    'M20 91 V39 L30 25 H70 L80 39 V91 Z M14 39 H86 V48 H14 Z',
    'M37 91 V66 H63 V91 M32 54 H42 V63 H32 Z M58 54 H68 V63 H58 Z',
  ],
  sword: [
    'M47 13 H53 L58 70 L50 91 L42 70 Z',
    'M28 68 H72 V76 H55 L60 91 H40 L45 76 H28 Z',
  ],
  key: [
    'M19 51 A16 16 0 1 0 45 39 L83 39 V51 H74 V61 H63 V70 H51 V51 H45 A16 16 0 0 0 19 51 Z',
    'M29 43 A8 8 0 1 0 29 59 A8 8 0 0 0 29 43 Z M55 45 H78 V50 H55 Z',
  ],
  anchor: [
    'M45 20 A5 5 0 1 0 55 20 A5 5 0 0 0 45 20 M46 30 H54 V72 C66 68 76 58 80 46 L88 51 C82 74 68 88 50 92 C32 88 18 74 12 51 L20 46 C24 58 34 68 46 72 Z',
    'M28 39 H72 V47 H28 Z M38 79 L50 91 L62 79',
  ],
  hammer: [
    'M20 30 H76 L84 40 L76 50 H20 L12 40 Z M45 50 H55 V91 H45 Z',
    'M25 34 H71 V46 H25 Z M39 73 H61 V81 H39 Z',
  ],
  lantern: [
    'M28 36 H72 L78 48 V84 L66 92 H34 L22 84 V48 Z M36 36 V25 H64 V36',
    'M35 52 H65 V79 H35 Z M43 58 H57 V73 H43 Z',
  ],
  book: [
    'M16 28 C30 21 42 23 50 31 C58 23 70 21 84 28 V84 C70 77 58 79 50 88 C42 79 30 77 16 84 Z',
    'M50 31 V88 M24 38 C33 34 41 37 46 42 M76 38 C67 34 59 37 54 42',
  ],
  chalice: [
    'M27 20 H73 V43 C73 59 64 70 55 74 V84 H70 V92 H30 V84 H45 V74 C36 70 27 59 27 43 Z',
    'M35 28 H65 V42 C65 54 59 62 50 66 C41 62 35 54 35 42 Z M42 84 H58',
  ],
  bell: [
    'M28 80 V53 C28 34 38 21 50 21 C62 21 72 34 72 53 V80 L82 87 V92 H18 V87 Z',
    'M44 14 H56 V22 H44 Z M45 80 H55 V88 H45 Z',
  ],
  wheel: [
    'M50 14 A36 36 0 1 0 50 86 A36 36 0 0 0 50 14 Z M50 39 A11 11 0 1 0 50 61 A11 11 0 0 0 50 39 Z',
    'M47 18 H53 V39 H47 Z M47 61 H53 V82 H47 Z M18 47 H39 V53 H18 Z M61 47 H82 V53 H61 Z',
  ],
  ship: [
    'M15 76 H85 L73 91 H27 Z M48 22 H54 V76 H48 Z M54 30 L79 57 H54 Z',
    'M47 31 L24 62 H47 Z M27 80 H73 L68 86 H32 Z',
  ],
  helmet: [
    'M25 50 C25 28 38 17 57 18 C73 20 81 33 80 51 L75 77 H25 Z',
    'M32 51 H75 L68 60 H43 V70 H31 Z M47 18 H55 V50 H47 Z',
  ],
  gate: [
    'M16 91 V38 L28 24 H72 L84 38 V91 H64 V57 H36 V91 Z',
    'M25 42 H75 V50 H25 Z M30 57 H36 V81 H30 Z M64 57 H70 V81 H64 Z',
  ],
  compass: [
    'M50 13 A37 37 0 1 0 50 87 A37 37 0 0 0 50 13 Z M50 29 L63 50 L50 71 L37 50 Z',
    'M47 21 H53 V33 H47 Z M47 67 H53 V79 H47 Z M29 47 H41 V53 H29 Z M59 47 H71 V53 H59 Z',
  ],
  lyre: [
    'M27 91 V52 C27 30 37 18 50 18 C63 18 73 30 73 52 V91 H61 V54 C61 42 57 34 50 34 C43 34 39 42 39 54 V91 Z',
    'M23 91 H77 V98 H23 Z M45 38 H48 V87 H45 Z M52 38 H55 V87 H52 Z',
  ],
} as const;

const objectVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  crowned: { prefix: 'Crowned', prefixZh: '加冕', searchTerms: ['crowned', 'crown', '加冕', '冠冕'], svgPath: 'M35 28 L40 17 L48 25 L54 12 L61 25 L70 16 L67 32 H38 Z' },
  flaming: { prefix: 'Flaming', prefixZh: '烈焰', searchTerms: ['flaming', 'flame', '烈焰', '火焰'], svgPath: 'M50 15 C38 31 59 36 47 54 C62 45 67 31 58 20 C57 34 48 37 50 15 Z' },
  wreathed: { prefix: 'Wreathed', prefixZh: '花环', searchTerms: ['wreathed', 'wreath', '花环'], svgPath: 'M24 78 C16 57 23 39 35 31 L39 38 C29 47 26 61 31 73 M76 78 C84 57 77 39 65 31 L61 38 C71 47 74 61 69 73 M28 48 L19 43 M31 58 L21 56 M72 48 L81 43 M69 58 L79 56' },
  starred: { prefix: 'Starred', prefixZh: '星饰', searchTerms: ['starred', 'star', '星饰', '星'], svgPath: 'M50 16 L55 29 L69 29 L58 38 L62 52 L50 44 L38 52 L42 38 L31 29 L45 29 Z' },
  bannered: { prefix: 'Bannered', prefixZh: '旗饰', searchTerms: ['bannered', 'banner', '旗饰', '旗帜'], svgPath: 'M70 20 V67 H44 L51 56 L44 45 H62 V20 Z' },
  rayed: { prefix: 'Rayed', prefixZh: '光芒', searchTerms: ['rayed', 'rays', '光芒', '放射'], svgPath: 'M50 14 V28 M50 72 V86 M14 50 H28 M72 50 H86 M24 24 L34 34 M66 66 L76 76 M76 24 L66 34 M34 66 L24 76' },
} as const;
const objectVariantIds = ['plain', 'crowned', 'flaming', 'wreathed', 'starred', 'bannered', 'rayed'] as const satisfies readonly ObjectVariantId[];

const objectMotifRecords: readonly ObjectMotifRecord[] = [
  { key: 'watchtower', name: 'Watchtower', nameZh: '瞭望塔', searchTerms: ['watchtower', 'tower', '塔', '瞭望塔'], partId: 'watchtower' },
  { key: 'sword', name: 'Sword', nameZh: '宝剑', searchTerms: ['sword', 'blade', '剑', '宝剑'], partId: 'sword' },
  { key: 'key', name: 'Key', nameZh: '钥匙', searchTerms: ['key', '钥匙'], partId: 'key' },
  { key: 'anchor', name: 'Anchor', nameZh: '锚', searchTerms: ['anchor', '锚'], partId: 'anchor' },
  { key: 'hammer', name: 'Hammer', nameZh: '战锤', searchTerms: ['hammer', 'mallet', '锤', '战锤'], partId: 'hammer' },
  { key: 'lantern', name: 'Lantern', nameZh: '提灯', searchTerms: ['lantern', 'lamp', '灯', '提灯'], partId: 'lantern' },
  { key: 'book', name: 'Book', nameZh: '典籍', searchTerms: ['book', 'tome', '书', '典籍'], partId: 'book' },
  { key: 'chalice', name: 'Chalice', nameZh: '圣杯', searchTerms: ['chalice', 'cup', '杯', '圣杯'], partId: 'chalice' },
  { key: 'bell', name: 'Bell', nameZh: '钟', searchTerms: ['bell', '钟'], partId: 'bell' },
  { key: 'wheel', name: 'Wheel', nameZh: '车轮', searchTerms: ['wheel', '车轮'], partId: 'wheel' },
  { key: 'ship', name: 'Ship', nameZh: '帆船', searchTerms: ['ship', 'sailing ship', '船', '帆船'], partId: 'ship' },
  { key: 'helmet', name: 'Helmet', nameZh: '头盔', searchTerms: ['helmet', 'helm', '盔', '头盔'], partId: 'helmet' },
  { key: 'gate', name: 'Gate', nameZh: '城门', searchTerms: ['gate', 'portcullis', '门', '城门'], partId: 'gate' },
  { key: 'compass', name: 'Compass', nameZh: '罗盘', searchTerms: ['compass', '罗盘'], partId: 'compass' },
  { key: 'lyre', name: 'Lyre', nameZh: '竖琴', searchTerms: ['lyre', 'harp', '琴', '竖琴'], partId: 'lyre' },
];

const objectCatalogSemanticKeys = new Set(
  objectMotifRecords.flatMap((motif) => objectVariantIds.map((variantId) => `object-${motif.key}-${variantId}`)),
);
if (objectCatalogSemanticKeys.size !== 105) {
  throw new Error(`Invalid object semantic vocabulary size: ${objectCatalogSemanticKeys.size}`);
}

type PlantMotifPartId = keyof typeof plantMotifSvgParts;
type PlantVariantId = keyof typeof plantVariantRecords;

interface PlantMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: PlantMotifPartId;
}

/** Original local botanical parts for each named plant, with a distinct vein, bloom, or grain detail. */
const plantMotifSvgParts = {
  oak: [
    'M48 91 V56 C37 52 25 45 27 33 C28 25 37 23 42 30 C43 17 55 15 59 29 C65 22 75 25 75 35 C75 46 61 52 52 56 V91 Z',
    'M50 55 L37 37 M50 55 L64 35 M50 66 L39 55 M50 66 L61 53',
  ],
  rose: [
    'M50 16 C37 16 28 25 31 37 C20 39 18 53 29 58 C24 69 37 77 47 70 L50 91 L55 70 C66 77 79 69 73 58 C84 53 82 39 69 37 C72 25 63 16 50 16 Z',
    'M50 26 C43 31 43 40 50 45 C57 40 57 31 50 26 Z M50 54 V88 M50 68 L36 61 M50 76 L63 68',
  ],
  lily: [
    'M50 12 L58 37 L79 27 L66 48 L89 54 L65 60 L72 84 L54 67 L50 94 L46 67 L28 84 L35 60 L11 54 L34 48 L21 27 L42 37 Z',
    'M47 48 L50 28 L53 48 M37 61 L50 54 L63 61 M46 70 H54',
  ],
  wheat: [
    'M48 91 V24 H52 V91 M48 36 L29 25 L33 20 L48 29 M52 44 L71 30 L75 35 L52 51 M48 56 L27 43 L31 38 L48 48 M52 65 L73 51 L77 56 L52 72',
    'M38 22 L43 29 L38 36 L33 29 Z M62 28 L67 35 L62 42 L57 35 Z M36 43 L41 50 L36 57 L31 50 Z M64 51 L69 58 L64 65 L59 58 Z',
  ],
  laurel: [
    'M50 91 C31 79 22 60 29 33 L37 36 C31 56 38 70 50 80 C62 70 69 56 63 36 L71 33 C78 60 69 79 50 91 Z',
    'M35 43 L23 37 M37 53 L22 51 M41 63 L27 68 M65 43 L77 37 M63 53 L78 51 M59 63 L73 68',
  ],
  ivy: [
    'M50 91 C39 76 34 62 41 49 C29 48 22 40 27 30 C34 21 43 27 46 35 C48 21 59 19 65 28 C71 38 64 47 55 49 C65 61 61 77 50 91 Z',
    'M50 87 V50 M50 57 L35 43 M50 66 L64 50 M50 74 L38 65 M50 80 L61 72',
  ],
  pine: [
    'M50 12 L82 82 H66 L78 91 H22 L34 82 H18 Z',
    'M50 20 V91 M50 34 H34 M50 47 H70 M50 61 H28 M50 74 H76',
  ],
  lotus: [
    'M50 18 C39 29 34 40 38 53 C27 46 19 51 21 63 C25 77 41 82 50 70 C59 82 75 77 79 63 C81 51 73 46 62 53 C66 40 61 29 50 18 Z',
    'M50 28 V69 M37 56 L50 64 L63 56 M50 77 V91 H39 L50 82 L61 91 H50',
  ],
  thistle: [
    'M50 16 C37 20 30 34 36 46 L22 42 L31 56 L19 64 L36 67 L31 82 L45 75 L50 92 L55 75 L69 82 L64 67 L81 64 L69 56 L78 42 L64 46 C70 34 63 20 50 16 Z',
    'M45 47 L50 23 L55 47 M50 51 V88 M50 68 L38 78 M50 74 L63 82',
  ],
  grapevine: [
    'M50 91 V42 C36 40 25 31 30 20 C35 11 45 17 50 27 C55 17 65 11 70 20 C75 31 64 40 50 42 Z',
    'M44 54 A6 6 0 1 0 44 66 A6 6 0 0 0 44 54 Z M56 54 A6 6 0 1 0 56 66 A6 6 0 0 0 56 54 Z M50 66 A6 6 0 1 0 50 78 A6 6 0 0 0 50 66 Z',
  ],
  sunflower: [
    'M50 15 L58 34 L79 24 L68 44 L90 50 L68 57 L79 78 L58 67 L50 90 L42 67 L21 78 L32 57 L10 50 L32 44 L21 24 L42 34 Z',
    'M42 43 A8 8 0 1 0 42 59 A8 8 0 0 0 42 43 Z M48 59 V91 M48 74 L35 65 M48 81 L61 72',
  ],
  maple: [
    'M50 12 L57 34 L77 24 L70 43 L90 47 L72 58 L82 75 L61 69 L50 92 L39 69 L18 75 L28 58 L10 47 L30 43 L23 24 L43 34 Z',
    'M50 37 V89 M50 55 L33 48 M50 62 L67 51 M50 70 L39 66 M50 76 L61 70',
  ],
  olive: [
    'M50 91 C38 72 29 51 32 23 L40 25 C38 46 43 65 50 78 C57 65 62 46 60 25 L68 23 C71 51 62 72 50 91 Z',
    'M39 37 L25 31 M41 49 L24 48 M45 61 L30 66 M61 37 L75 31 M59 49 L76 48 M55 61 L70 66',
  ],
  shamrock: [
    'M50 91 V60 C42 69 27 64 27 51 C27 41 38 38 45 45 C43 33 57 33 55 45 C62 38 73 41 73 51 C73 64 58 69 50 60 Z',
    'M50 56 L40 48 M50 56 L60 48 M50 69 H43 M50 76 H58',
  ],
  fern: [
    'M50 91 V16 M48 31 L29 19 L25 25 L48 42 M52 31 L71 19 L75 25 L52 42 M48 51 L24 39 L20 45 L48 62 M52 51 L76 39 L80 45 L52 62 M48 72 L30 62 L26 68 L48 81 M52 72 L70 62 L74 68 L52 81',
    'M46 22 H54 V88 H46 Z M35 28 L42 34 M65 28 L58 34 M31 50 L41 56 M69 50 L59 56',
  ],
  barley: [
    'M48 91 V20 H52 V91 M48 29 L34 18 L30 24 L48 38 M52 37 L67 24 L71 30 L52 46 M48 50 L32 39 L28 45 L48 59 M52 59 L69 46 L73 52 L52 68',
    'M38 18 L45 24 L38 30 L32 24 Z M62 24 L68 30 L62 36 L56 30 Z M36 39 L43 45 L36 51 L30 45 Z M64 46 L70 52 L64 58 L58 52 Z',
  ],
} as const;

const plantVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素纹'] },
  crossed: { prefix: 'Crossed', prefixZh: '交叉', searchTerms: ['crossed', '交叉'], svgPath: 'M24 80 L76 28 L82 34 L30 86 Z M24 28 L76 80 L70 86 L18 34 Z' },
  wreathed: { prefix: 'Wreathed', prefixZh: '花环', searchTerms: ['wreathed', 'wreath', '花环'], svgPath: 'M23 77 C14 57 22 38 36 30 L40 37 C29 47 27 61 32 72 M77 77 C86 57 78 38 64 30 L60 37 C71 47 73 61 68 72 M29 48 L19 43 M31 59 L20 58 M71 48 L81 43 M69 59 L80 58' },
  crowned: { prefix: 'Crowned', prefixZh: '加冕', searchTerms: ['crowned', 'crown', '加冕', '冠冕'], svgPath: 'M35 28 L40 17 L48 25 L54 12 L61 25 L70 16 L67 32 H38 Z' },
  starred: { prefix: 'Starred', prefixZh: '星饰', searchTerms: ['starred', 'star', '星饰', '星'], svgPath: 'M50 15 L55 29 L70 29 L58 38 L62 53 L50 44 L38 53 L42 38 L30 29 L45 29 Z' },
  rayed: { prefix: 'Rayed', prefixZh: '光芒', searchTerms: ['rayed', 'rays', '光芒', '放射'], svgPath: 'M50 13 V27 M50 73 V87 M13 50 H27 M73 50 H87 M24 24 L34 34 M66 66 L76 76 M76 24 L66 34 M34 66 L24 76' },
} as const;
const plantVariantIds = ['plain', 'crossed', 'wreathed', 'crowned', 'starred', 'rayed'] as const satisfies readonly PlantVariantId[];

const plantMotifRecords: readonly PlantMotifRecord[] = [
  { key: 'oak', name: 'Oak sprig', nameZh: '橡枝', searchTerms: ['oak', 'oak sprig', '橡树', '橡枝'], partId: 'oak' },
  { key: 'rose', name: 'Rose', nameZh: '玫瑰', searchTerms: ['rose', '玫瑰'], partId: 'rose' },
  { key: 'lily', name: 'Lily', nameZh: '百合', searchTerms: ['lily', '百合'], partId: 'lily' },
  { key: 'wheat', name: 'Wheat sheaf', nameZh: '麦穗', searchTerms: ['wheat', 'sheaf', '麦', '麦穗'], partId: 'wheat' },
  { key: 'laurel', name: 'Laurel branch', nameZh: '月桂枝', searchTerms: ['laurel', '月桂', '月桂枝'], partId: 'laurel' },
  { key: 'ivy', name: 'Ivy vine', nameZh: '常春藤', searchTerms: ['ivy', 'vine', '常春藤'], partId: 'ivy' },
  { key: 'pine', name: 'Pine tree', nameZh: '松树', searchTerms: ['pine', '松', '松树'], partId: 'pine' },
  { key: 'lotus', name: 'Lotus', nameZh: '莲花', searchTerms: ['lotus', '莲', '莲花'], partId: 'lotus' },
  { key: 'thistle', name: 'Thistle', nameZh: '蓟', searchTerms: ['thistle', '蓟'], partId: 'thistle' },
  { key: 'grapevine', name: 'Grapevine', nameZh: '葡萄藤', searchTerms: ['grapevine', 'grape', '葡萄', '葡萄藤'], partId: 'grapevine' },
  { key: 'sunflower', name: 'Sunflower', nameZh: '向日葵', searchTerms: ['sunflower', '向日葵'], partId: 'sunflower' },
  { key: 'maple', name: 'Maple leaf', nameZh: '枫叶', searchTerms: ['maple', 'leaf', '枫', '枫叶'], partId: 'maple' },
  { key: 'olive', name: 'Olive branch', nameZh: '橄榄枝', searchTerms: ['olive', '橄榄', '橄榄枝'], partId: 'olive' },
  { key: 'shamrock', name: 'Shamrock', nameZh: '三叶草', searchTerms: ['shamrock', 'clover', '三叶草'], partId: 'shamrock' },
  { key: 'fern', name: 'Fern frond', nameZh: '蕨叶', searchTerms: ['fern', 'frond', '蕨', '蕨叶'], partId: 'fern' },
  { key: 'barley', name: 'Barley sheaf', nameZh: '大麦穗', searchTerms: ['barley', 'sheaf', '大麦', '大麦穗'], partId: 'barley' },
];

const plantCatalogSemanticKeys = new Set(
  plantMotifRecords.flatMap((motif) => plantVariantIds.map((variantId) => `plant-${motif.key}-${variantId}`)),
);
if (plantCatalogSemanticKeys.size !== 96) {
  throw new Error(`Invalid plant semantic vocabulary size: ${plantCatalogSemanticKeys.size}`);
}

type HumanMotifPartId = keyof typeof humanMotifSvgParts;
type HumanVariantId = keyof typeof humanVariantRecords;

interface HumanMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: HumanMotifPartId;
}

/** Original local figure, profession, and posture parts for named human charges. */
const humanMotifSvgParts = {
  archer: [
    'M47 14 A8 8 0 1 0 53 14 A8 8 0 0 0 47 14 M43 31 L56 31 L62 62 L54 80 H46 L38 62 Z',
    'M64 29 C80 41 80 61 64 73 M65 31 L34 52 L65 66 M34 52 H77',
  ],
  knight: [
    'M38 20 L45 12 H58 L66 24 V39 H35 V24 Z M40 42 H60 L68 79 H32 Z',
    'M26 45 H41 V78 H26 Z M61 35 L66 35 L57 88 L52 88 Z',
  ],
  sailor: [
    'M39 17 H61 L66 25 H34 Z M44 28 A7 7 0 1 0 56 28 A7 7 0 0 0 44 28 M39 40 H61 L67 78 H33 Z',
    'M35 49 H65 M36 59 H64 M38 69 H62 M28 84 C40 77 60 77 72 84',
  ],
  mason: [
    'M44 16 A7 7 0 1 0 56 16 A7 7 0 0 0 44 16 M39 32 H61 L67 80 H33 Z',
    'M20 51 H43 V69 H20 Z M56 45 L81 36 L84 44 L59 54 Z',
  ],
  smith: [
    'M43 15 A7 7 0 1 0 57 15 A7 7 0 0 0 43 15 M38 31 H62 L69 81 H31 Z',
    'M21 45 L28 39 L48 57 L42 63 Z M63 60 H84 L78 72 H60 Z',
  ],
  farmer: [
    'M34 21 L42 12 H58 L66 21 L59 28 H41 Z M43 31 A7 7 0 1 0 57 31 A7 7 0 0 0 43 31 M38 43 H62 L68 82 H32 Z',
    'M70 28 L75 24 L83 76 L78 80 Z M67 74 H87',
  ],
  scholar: [
    'M37 17 H63 L58 25 H42 Z M44 28 A7 7 0 1 0 56 28 A7 7 0 0 0 44 28 M39 42 H61 L66 80 H34 Z',
    'M18 53 C28 48 37 50 45 57 C53 50 62 48 72 53 V76 C62 71 53 73 45 80 C37 73 28 71 18 76 Z',
  ],
  monk: [
    'M50 12 C34 18 31 36 38 46 L29 84 H71 L62 46 C69 36 66 18 50 12 Z',
    'M47 27 H53 V39 H61 V45 H53 V57 H47 V45 H39 V39 H47 Z',
  ],
  dancer: [
    'M44 17 A6 6 0 1 0 56 17 A6 6 0 0 0 44 17 M47 31 H53 L60 55 L51 61 L43 51 Z',
    'M43 56 L24 84 H76 Z M44 39 L27 28 L23 34 L42 48 M55 38 L72 23 L77 29 L60 49',
  ],
  runner: [
    'M43 18 A7 7 0 1 0 57 18 A7 7 0 0 0 43 18 M43 34 L57 39 L51 56 L39 51 Z',
    'M43 51 L24 72 L31 78 L49 62 L63 83 L71 79 L54 53 M42 41 L24 47 L22 40 L39 34',
  ],
  wrestler: [
    'M43 15 A7 7 0 1 0 57 15 A7 7 0 0 0 43 15 M36 31 H64 L69 60 L60 82 H40 L31 60 Z',
    'M36 39 L18 55 L23 63 L42 51 M64 39 L82 55 L77 63 L58 51 M37 76 H63',
  ],
  standardbearer: [
    'M44 16 A7 7 0 1 0 56 16 A7 7 0 0 0 44 16 M38 32 H62 L68 81 H32 Z',
    'M68 13 V88 H63 V13 Z M68 17 H87 L78 30 L87 43 H68 Z',
  ],
  pilgrim: [
    'M43 17 A7 7 0 1 0 57 17 A7 7 0 0 0 43 17 M39 32 H61 L72 82 H28 Z',
    'M22 25 L27 21 L40 43 L35 47 Z M68 27 L73 23 L82 83 L77 87 Z',
  ],
  herald: [
    'M44 16 A7 7 0 1 0 56 16 A7 7 0 0 0 44 16 M38 32 H62 L68 81 H32 Z',
    'M55 38 L84 29 L88 39 L60 48 Z M79 28 L87 20 L90 23 L84 32',
  ],
  shepherd: [
    'M43 16 A7 7 0 1 0 57 16 A7 7 0 0 0 43 16 M38 32 H62 L67 81 H33 Z',
    'M72 17 C89 17 89 39 75 39 V34 C82 34 82 23 72 23 Z M72 18 V87 H67 V18',
  ],
  musician: [
    'M44 16 A7 7 0 1 0 56 16 A7 7 0 0 0 44 16 M39 32 H61 L67 81 H33 Z',
    'M57 48 C67 41 76 48 73 59 C70 69 59 68 55 60 C51 52 48 45 43 43 L46 38 C54 40 61 45 64 51',
  ],
} as const;

const humanVariantRecords = {
  standing: { prefix: 'Standing', prefixZh: '站立', searchTerms: ['standing', 'upright', '站立', '直立'] },
  marching: { prefix: 'Marching', prefixZh: '行进', searchTerms: ['marching', 'stride', '行进', '步行'], svgPath: 'M21 87 H79 M34 82 L44 88 M59 82 L49 88' },
  kneeling: { prefix: 'Kneeling', prefixZh: '跪姿', searchTerms: ['kneeling', 'kneel', '跪姿', '跪下'], svgPath: 'M30 82 H70 M36 76 L48 82 H62' },
  saluting: { prefix: 'Saluting', prefixZh: '致敬', searchTerms: ['saluting', 'salute', '致敬', '敬礼'], svgPath: 'M61 27 L72 18 L76 23 L66 34' },
  crowned: { prefix: 'Crowned', prefixZh: '加冕', searchTerms: ['crowned', 'crown', '加冕', '冠冕'], svgPath: 'M35 27 L40 16 L48 24 L54 11 L61 24 L70 16 L67 31 H38 Z' },
  shielded: { prefix: 'Shield-bearing', prefixZh: '持盾', searchTerms: ['shield-bearing', 'shielded', 'shield', '持盾', '盾牌'], svgPath: 'M18 42 H35 V77 C35 84 29 89 26 91 C23 89 18 84 18 77 Z' },
} as const;
const humanVariantIds = ['standing', 'marching', 'kneeling', 'saluting', 'crowned', 'shielded'] as const satisfies readonly HumanVariantId[];

const humanMotifRecords: readonly HumanMotifRecord[] = [
  { key: 'archer', name: 'Archer', nameZh: '弓手', searchTerms: ['archer', 'bow', '箭手', '弓手'], partId: 'archer' },
  { key: 'knight', name: 'Knight', nameZh: '骑士', searchTerms: ['knight', 'armour', '骑士', '铠甲'], partId: 'knight' },
  { key: 'sailor', name: 'Sailor', nameZh: '水手', searchTerms: ['sailor', 'mariner', '水手', '航海'], partId: 'sailor' },
  { key: 'mason', name: 'Mason', nameZh: '石匠', searchTerms: ['mason', 'stoneworker', '石匠', '砌筑'], partId: 'mason' },
  { key: 'smith', name: 'Smith', nameZh: '铁匠', searchTerms: ['smith', 'blacksmith', '铁匠', '锻造'], partId: 'smith' },
  { key: 'farmer', name: 'Farmer', nameZh: '农夫', searchTerms: ['farmer', 'cultivator', '农夫', '耕作'], partId: 'farmer' },
  { key: 'scholar', name: 'Scholar', nameZh: '学者', searchTerms: ['scholar', 'reader', '学者', '读书人'], partId: 'scholar' },
  { key: 'monk', name: 'Monk', nameZh: '修士', searchTerms: ['monk', 'friar', '修士', '僧侣'], partId: 'monk' },
  { key: 'dancer', name: 'Dancer', nameZh: '舞者', searchTerms: ['dancer', 'dance', '舞者', '舞蹈'], partId: 'dancer' },
  { key: 'runner', name: 'Runner', nameZh: '跑者', searchTerms: ['runner', 'running', '跑者', '奔跑'], partId: 'runner' },
  { key: 'wrestler', name: 'Wrestler', nameZh: '摔跤手', searchTerms: ['wrestler', 'wrestling', '摔跤手', '角力'], partId: 'wrestler' },
  { key: 'standardbearer', name: 'Standard-bearer', nameZh: '旗手', searchTerms: ['standard-bearer', 'banner bearer', '旗手', '旗帜'], partId: 'standardbearer' },
  { key: 'pilgrim', name: 'Pilgrim', nameZh: '朝圣者', searchTerms: ['pilgrim', 'traveller', '朝圣者', '旅者'], partId: 'pilgrim' },
  { key: 'herald', name: 'Herald', nameZh: '号角使者', searchTerms: ['herald', 'trumpeter', '号角', '使者'], partId: 'herald' },
  { key: 'shepherd', name: 'Shepherd', nameZh: '牧人', searchTerms: ['shepherd', 'herdsman', '牧人', '牧羊'], partId: 'shepherd' },
  { key: 'musician', name: 'Musician', nameZh: '乐师', searchTerms: ['musician', 'lute player', '乐师', '琴师'], partId: 'musician' },
];

const humanCatalogSemanticKeys = new Set(
  humanMotifRecords.flatMap((motif) => humanVariantIds.map((variantId) => `human-${motif.key}-${variantId}`)),
);
if (humanCatalogSemanticKeys.size !== 96) {
  throw new Error(`Invalid human semantic vocabulary size: ${humanCatalogSemanticKeys.size}`);
}

type SymbolMotifPartId = keyof typeof symbolMotifSvgParts;
type SymbolVariantId = keyof typeof symbolVariantRecords;

interface SymbolMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: SymbolMotifPartId;
}

/** Original local geometry for the named heraldic signs in the symbol catalogue. */
const symbolMotifSvgParts = {
  sun: [
    'M50 8 L56 29 L70 15 L69 35 L87 28 L76 43 L94 50 L76 57 L87 72 L69 65 L70 85 L56 71 L50 92 L44 71 L30 85 L31 65 L13 72 L24 57 L6 50 L24 43 L13 28 L31 35 L30 15 L44 29 Z',
    'M50 35 A15 15 0 1 0 50 65 A15 15 0 0 0 50 35 Z M47 42 H53 V58 H47 Z M42 47 H58 V53 H42 Z',
  ],
  moon: [
    'M61 14 C39 17 26 34 29 54 C32 75 51 87 70 80 C56 75 47 63 47 49 C47 33 53 21 61 14 Z',
    'M64 28 L68 37 L78 37 L70 43 L73 53 L64 47 L55 53 L58 43 L50 37 L60 37 Z',
  ],
  cross: [
    'M42 13 H58 V39 H84 V57 H58 V87 H42 V57 H16 V39 H42 Z',
    'M44 20 H56 V33 H44 Z M44 64 H56 V80 H44 Z M22 42 H36 V54 H22 Z M64 42 H78 V54 H64 Z',
  ],
  fleurdelis: [
    'M50 12 C40 18 39 31 45 39 C35 38 24 44 23 56 C22 69 36 75 47 65 V91 H53 V65 C64 75 78 69 77 56 C76 44 65 38 55 39 C61 31 60 18 50 12 Z',
    'M32 74 H68 V84 H32 Z M45 47 L50 32 L55 47 M36 55 L45 58 M64 55 L55 58',
  ],
  heart: [
    'M50 87 L19 54 C4 37 14 16 32 16 C41 16 47 21 50 28 C53 21 59 16 68 16 C86 16 96 37 81 54 Z',
    'M28 35 C34 28 42 31 45 38 M72 35 C66 28 58 31 55 38 M38 61 L50 72 L62 61',
  ],
  thunderbolt: [
    'M55 8 L23 53 H45 L38 92 L78 40 H55 Z',
    'M59 17 L46 44 H60 L50 73 M29 59 H43 M61 59 H74',
  ],
  spiral: [
    'M50 10 C77 10 92 33 86 58 C80 84 48 94 27 76 C6 58 15 23 41 20 C64 17 75 42 65 59 C55 76 29 68 34 48 C38 32 61 35 60 50 C59 61 44 61 44 51 C44 46 50 44 53 47',
    'M20 82 L31 72 M69 28 L79 18 M75 76 L86 86 M25 24 L14 14',
  ],
  triquetra: [
    'M50 14 C67 14 77 31 70 45 C82 47 88 61 79 72 C68 85 49 78 50 63 C42 78 23 85 21 72 C12 61 18 47 30 45 C23 31 33 14 50 14 Z',
    'M50 28 C39 35 39 48 50 55 C61 48 61 35 50 28 Z M31 51 C42 48 50 56 50 68 M69 51 C58 48 50 56 50 68',
  ],
  hourglass: [
    'M22 16 H78 V28 C78 43 66 47 57 52 C66 57 78 61 78 76 V88 H22 V76 C22 61 34 57 43 52 C34 47 22 43 22 28 Z',
    'M29 21 H71 M29 83 H71 M37 31 C42 39 47 43 50 47 C53 43 58 39 63 31 M37 73 C42 65 47 61 50 57 C53 61 58 65 63 73',
  ],
  torch: [
    'M44 46 C31 35 41 16 50 8 C51 22 65 25 61 39 C59 45 55 49 50 52 C56 40 47 37 50 24 C42 33 42 41 44 46 Z M41 49 H59 L56 89 H44 Z',
    'M34 89 H66 V96 H34 Z M38 60 H62 V68 H38 Z M44 72 H56',
  ],
  compass: [
    'M50 9 L59 36 L82 18 L64 42 L91 50 L64 58 L82 82 L59 64 L50 91 L41 64 L18 82 L36 58 L9 50 L36 42 L18 18 L41 36 Z',
    'M50 29 L61 50 L50 71 L39 50 Z M47 17 H53 V36 H47 Z M47 64 H53 V83 H47 Z',
  ],
  comet: [
    'M64 16 L69 36 L88 28 L77 46 L94 52 L76 57 L83 77 L66 67 L56 88 L51 67 L32 76 L39 57 L19 52 L38 46 L27 28 L47 36 L52 16 Z',
    'M50 42 C33 44 20 54 12 72 C27 62 39 60 54 61 M54 61 C62 56 67 49 64 42',
  ],
  eye: [
    'M10 50 C24 27 39 17 50 17 C61 17 76 27 90 50 C76 73 61 83 50 83 C39 83 24 73 10 50 Z',
    'M50 32 A18 18 0 1 0 50 68 A18 18 0 0 0 50 32 Z M46 42 A7 7 0 1 0 46 56 A7 7 0 0 0 46 42 Z',
  ],
  rune: [
    'M31 14 V88 M31 18 L72 44 L31 61 L72 86',
    'M46 31 L61 42 M46 61 L61 72 M23 28 H39 M23 74 H39',
  ],
  ouroboros: [
    'M51 10 C76 10 91 29 89 52 C87 76 68 90 48 88 C28 86 15 70 15 50 C15 30 28 16 48 14 L42 26 L55 21 L62 31 L51 34 C38 34 30 41 30 52 C30 64 39 73 50 73 C62 73 73 64 73 51 C73 41 67 33 58 30 L65 18 C78 25 84 38 84 51',
    'M42 26 L50 14 L62 22 M84 51 L75 58 L72 46 M18 55 L27 62 L31 51',
  ],
  beacon: [
    'M44 31 H56 L63 86 H37 Z M41 86 H59 V94 H41 Z',
    'M50 9 V24 M25 18 L36 29 M75 18 L64 29 M15 43 H32 M68 43 H85 M22 68 L35 60 M78 68 L65 60',
  ],
} as const;

const symbolVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素式'] },
  crossed: { prefix: 'Crossed', prefixZh: '交叉', searchTerms: ['crossed', '交叉'], svgPath: 'M19 80 L78 21 L84 27 L25 86 Z M19 27 L78 86 L72 92 L13 33 Z' },
  rayed: { prefix: 'Rayed', prefixZh: '放射', searchTerms: ['rayed', 'rays', '放射', '光芒'], svgPath: 'M50 7 V21 M50 79 V93 M7 50 H21 M79 50 H93 M19 19 L29 29 M71 71 L81 81 M81 19 L71 29 M29 71 L19 81' },
  crowned: { prefix: 'Crowned', prefixZh: '加冕', searchTerms: ['crowned', 'crown', '加冕', '冠冕'], svgPath: 'M35 29 L40 18 L48 26 L54 13 L61 26 L70 18 L67 33 H38 Z' },
  encircled: { prefix: 'Encircled', prefixZh: '环绕', searchTerms: ['encircled', 'ring', '环绕', '圆环'], svgPath: 'M50 10 A40 40 0 1 0 50 90 A40 40 0 0 0 50 10 Z M50 16 A34 34 0 1 1 50 84 A34 34 0 0 1 50 16 Z' },
  pierced: { prefix: 'Pierced', prefixZh: '穿刺', searchTerms: ['pierced', 'piercing', '穿刺', '箭矢'], svgPath: 'M15 77 L77 15 L84 22 L22 84 Z M73 14 H89 V30 H83 V24 H77 V18 H73 Z' },
} as const;
const symbolVariantIds = ['plain', 'crossed', 'rayed', 'crowned', 'encircled', 'pierced'] as const satisfies readonly SymbolVariantId[];

const symbolMotifRecords: readonly SymbolMotifRecord[] = [
  { key: 'sun', name: 'Sun emblem', nameZh: '日轮徽记', searchTerms: ['sun', 'sun emblem', '太阳', '日轮'], partId: 'sun' },
  { key: 'moon', name: 'Crescent moon', nameZh: '新月', searchTerms: ['moon', 'crescent', '月亮', '新月'], partId: 'moon' },
  { key: 'cross', name: 'Cross sign', nameZh: '十字记号', searchTerms: ['cross', 'cross sign', '十字', '十字记号'], partId: 'cross' },
  { key: 'fleurdelis', name: 'Fleur-de-lis', nameZh: '鸢尾花饰', searchTerms: ['fleur-de-lis', 'lily', '鸢尾', '鸢尾花饰'], partId: 'fleurdelis' },
  { key: 'heart', name: 'Heart seal', nameZh: '心形印记', searchTerms: ['heart', 'heart seal', '心形', '爱心'], partId: 'heart' },
  { key: 'thunderbolt', name: 'Thunderbolt', nameZh: '闪电', searchTerms: ['thunderbolt', 'lightning', '闪电', '雷霆'], partId: 'thunderbolt' },
  { key: 'spiral', name: 'Spiral mark', nameZh: '螺旋纹', searchTerms: ['spiral', 'spiral mark', '螺旋', '旋纹'], partId: 'spiral' },
  { key: 'triquetra', name: 'Triquetra knot', nameZh: '三角结', searchTerms: ['triquetra', 'knot', '三角结', '凯尔特结'], partId: 'triquetra' },
  { key: 'hourglass', name: 'Hourglass sign', nameZh: '沙漏记号', searchTerms: ['hourglass', 'time', '沙漏', '时间'], partId: 'hourglass' },
  { key: 'torch', name: 'Torch emblem', nameZh: '火炬徽记', searchTerms: ['torch', 'flame', '火炬', '火焰'], partId: 'torch' },
  { key: 'compass', name: 'Compass rose', nameZh: '罗盘玫瑰', searchTerms: ['compass', 'compass rose', '罗盘', '方位'], partId: 'compass' },
  { key: 'comet', name: 'Comet sign', nameZh: '彗星记号', searchTerms: ['comet', 'star trail', '彗星', '星轨'], partId: 'comet' },
  { key: 'eye', name: 'Watchful eye', nameZh: '守望之眼', searchTerms: ['eye', 'watchful eye', '眼睛', '守望'], partId: 'eye' },
  { key: 'rune', name: 'Rune mark', nameZh: '符文', searchTerms: ['rune', 'rune mark', '符文', '古文字'], partId: 'rune' },
  { key: 'ouroboros', name: 'Ouroboros ring', nameZh: '衔尾蛇环', searchTerms: ['ouroboros', 'serpent ring', '衔尾蛇', '循环'], partId: 'ouroboros' },
  { key: 'beacon', name: 'Beacon sign', nameZh: '烽火徽记', searchTerms: ['beacon', 'signal', '烽火', '信号'], partId: 'beacon' },
];

const symbolSpecialEntry = {
  semanticKey: 'symbol-alchemy-seal',
  name: 'Alchemical seal',
  nameZh: '炼金印记',
  searchTerms: ['alchemy', 'alchemical seal', '炼金', '印记'],
  svgParts: [
    'M50 11 L83 30 V70 L50 89 L17 70 V30 Z',
    'M50 25 A25 25 0 1 0 50 75 A25 25 0 0 0 50 25 Z M50 33 L62 54 L38 54 Z',
  ],
} as const;

const symbolCatalogSemanticKeys = new Set([
  ...symbolMotifRecords.flatMap((motif) => symbolVariantIds.map((variantId) => `symbol-${motif.key}-${variantId}`)),
  symbolSpecialEntry.semanticKey,
]);
if (symbolCatalogSemanticKeys.size !== 97) {
  throw new Error(`Invalid symbol semantic vocabulary size: ${symbolCatalogSemanticKeys.size}`);
}

type CrownMotifPartId = keyof typeof crownMotifSvgParts;
type CrownVariantId = keyof typeof crownVariantRecords;

interface CrownMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: CrownMotifPartId;
}

/** Original local silhouette and band details for each named crown and coronet. */
const crownMotifSvgParts = {
  imperial: [
    'M18 76 L24 31 L39 52 L50 14 L61 52 L76 31 L82 76 Z',
    'M16 76 H84 V90 H16 Z M28 78 A5 5 0 1 0 28 88 A5 5 0 0 0 28 78 M45 78 A5 5 0 1 0 45 88 A5 5 0 0 0 45 78 M62 78 A5 5 0 1 0 62 88 A5 5 0 0 0 62 78',
  ],
  ducal: [
    'M20 77 L27 38 L42 55 L50 25 L58 55 L73 38 L80 77 Z',
    'M18 77 H82 V89 H18 Z M31 66 A6 6 0 1 0 31 78 A6 6 0 0 0 31 66 M63 66 A6 6 0 1 0 63 78 A6 6 0 0 0 63 66',
  ],
  mural: [
    'M18 76 V42 H30 V28 H42 V42 H58 V28 H70 V42 H82 V76 Z',
    'M16 76 H84 V90 H16 Z M28 52 H38 V62 H28 Z M62 52 H72 V62 H62 Z',
  ],
  naval: [
    'M18 75 L25 42 L38 53 L50 27 L62 53 L75 42 L82 75 Z',
    'M17 75 H83 V89 H17 Z M25 34 C31 24 39 26 40 38 M60 38 C61 26 69 24 75 34 M31 46 H41 M59 46 H69',
  ],
  celestial: [
    'M18 77 L25 36 L39 55 L50 18 L61 55 L75 36 L82 77 Z',
    'M16 77 H84 V90 H16 Z M47 28 C36 31 36 48 48 50 C41 45 42 34 47 28 M64 37 L68 44 L76 44 L70 49 L72 57 L64 52 L57 57 L59 49 L53 44 L61 44 Z',
  ],
  floral: [
    'M18 78 L26 51 C31 37 39 38 43 52 C45 31 55 31 57 52 C61 38 69 37 74 51 L82 78 Z',
    'M16 78 H84 V90 H16 Z M29 53 A7 7 0 1 0 29 67 A7 7 0 0 0 29 53 M43 46 A7 7 0 1 0 43 60 A7 7 0 0 0 43 46 M57 53 A7 7 0 1 0 57 67 A7 7 0 0 0 57 53',
  ],
  laurel: [
    'M17 77 C18 39 34 18 50 25 C66 18 82 39 83 77 Z',
    'M16 77 H84 V90 H16 Z M29 45 L20 37 M32 55 L20 53 M38 65 L25 70 M71 45 L80 37 M68 55 L80 53 M62 65 L75 70',
  ],
  oak: [
    'M18 78 C20 48 34 22 50 32 C66 22 80 48 82 78 Z',
    'M16 78 H84 V90 H16 Z M28 48 C20 42 25 32 33 38 C34 29 44 30 42 40 M72 48 C80 42 75 32 67 38 C66 29 56 30 58 40 M45 35 A4 4 0 1 0 45 43 A4 4 0 0 0 45 35',
  ],
  thorn: [
    'M18 78 C25 45 35 28 50 33 C65 28 75 45 82 78 Z',
    'M16 78 H84 V90 H16 Z M24 57 L31 48 L32 61 M37 43 L44 33 L45 47 M55 47 L56 33 L63 43 M68 61 L69 48 L76 57',
  ],
  pearl: [
    'M18 78 C20 47 34 29 50 29 C66 29 80 47 82 78 Z',
    'M16 78 H84 V90 H16 Z M23 59 A5 5 0 1 0 23 69 A5 5 0 0 0 23 59 M35 46 A5 5 0 1 0 35 56 A5 5 0 0 0 35 46 M47 40 A5 5 0 1 0 47 50 A5 5 0 0 0 47 40 M59 46 A5 5 0 1 0 59 56 A5 5 0 0 0 59 46 M71 59 A5 5 0 1 0 71 69 A5 5 0 0 0 71 59',
  ],
  antler: [
    'M18 78 L26 48 L38 55 L50 24 L62 55 L74 48 L82 78 Z',
    'M16 78 H84 V90 H16 Z M32 53 L24 35 M35 47 L39 30 M68 53 L76 35 M65 47 L61 30',
  ],
  flame: [
    'M18 78 L26 50 C19 38 29 27 34 20 C35 34 43 36 41 50 C45 42 52 33 51 18 C61 31 65 43 61 55 C68 43 76 42 75 28 C84 43 84 61 82 78 Z',
    'M16 78 H84 V90 H16 Z M34 62 C28 53 36 45 39 40 C40 51 47 52 43 62 M57 62 C53 52 60 45 62 38 C68 51 67 57 64 62',
  ],
} as const;

const crownVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素冠'] },
  arched: { prefix: 'Arched', prefixZh: '拱顶', searchTerms: ['arched', 'arch', '拱顶', '冠拱'], svgPath: 'M30 74 C30 26 70 26 70 74 H63 C63 37 37 37 37 74 Z' },
  jewelled: { prefix: 'Jewelled', prefixZh: '宝石饰', searchTerms: ['jewelled', 'jewel', '宝石', '珠宝'], svgPath: 'M44 57 L50 49 L56 57 L50 65 Z M27 68 L32 62 L37 68 L32 74 Z M63 68 L68 62 L73 68 L68 74 Z' },
  winged: { prefix: 'Winged', prefixZh: '翼饰', searchTerms: ['winged', 'wings', '翼饰', '翅膀'], svgPath: 'M38 64 C22 62 15 51 13 36 C25 42 33 46 41 56 M62 64 C78 62 85 51 87 36 C75 42 67 46 59 56' },
  veiled: { prefix: 'Veiled', prefixZh: '垂纱', searchTerms: ['veiled', 'veil', '垂纱', '面纱'], svgPath: 'M24 63 C31 72 30 87 25 94 H39 V67 M76 63 C69 72 70 87 75 94 H61 V67' },
  rayed: { prefix: 'Rayed', prefixZh: '光芒', searchTerms: ['rayed', 'rays', '光芒', '放射'], svgPath: 'M50 7 V20 M21 18 L31 28 M79 18 L69 28 M10 47 H25 M90 47 H75 M16 73 L30 66 M84 73 L70 66' },
} as const;
const crownVariantIds = ['plain', 'arched', 'jewelled', 'winged', 'veiled', 'rayed'] as const satisfies readonly CrownVariantId[];

const crownMotifRecords: readonly CrownMotifRecord[] = [
  { key: 'imperial', name: 'Imperial crown', nameZh: '帝王冠', searchTerms: ['imperial', 'imperial crown', '帝王', '帝王冠'], partId: 'imperial' },
  { key: 'ducal', name: 'Ducal coronet', nameZh: '公爵冠', searchTerms: ['ducal', 'ducal coronet', '公爵', '公爵冠'], partId: 'ducal' },
  { key: 'mural', name: 'Mural crown', nameZh: '城垣冠', searchTerms: ['mural', 'mural crown', '城垣', '城冠'], partId: 'mural' },
  { key: 'naval', name: 'Naval crown', nameZh: '海军冠', searchTerms: ['naval', 'naval crown', '海军', '舰队'], partId: 'naval' },
  { key: 'celestial', name: 'Celestial crown', nameZh: '星月冠', searchTerms: ['celestial', 'celestial crown', '星月', '天穹'], partId: 'celestial' },
  { key: 'floral', name: 'Floral coronet', nameZh: '花冠', searchTerms: ['floral', 'floral coronet', '花冠', '花饰'], partId: 'floral' },
  { key: 'laurel', name: 'Laurel crown', nameZh: '月桂冠', searchTerms: ['laurel', 'laurel crown', '月桂', '桂冠'], partId: 'laurel' },
  { key: 'oak', name: 'Oak crown', nameZh: '橡叶冠', searchTerms: ['oak', 'oak crown', '橡树', '橡叶'], partId: 'oak' },
  { key: 'thorn', name: 'Thorn crown', nameZh: '荆棘冠', searchTerms: ['thorn', 'thorn crown', '荆棘', '刺冠'], partId: 'thorn' },
  { key: 'pearl', name: 'Pearl coronet', nameZh: '珍珠冠', searchTerms: ['pearl', 'pearl coronet', '珍珠', '珠冠'], partId: 'pearl' },
  { key: 'antler', name: 'Antler crown', nameZh: '鹿角冠', searchTerms: ['antler', 'antler crown', '鹿角', '角冠'], partId: 'antler' },
  { key: 'flame', name: 'Flame crown', nameZh: '焰冠', searchTerms: ['flame', 'flame crown', '火焰', '焰冠'], partId: 'flame' },
];

const crownSpecialEntry = {
  semanticKey: 'crown-victory-wreath',
  name: 'Victory wreath',
  nameZh: '胜利花环',
  searchTerms: ['victory', 'victory wreath', '胜利', '花环'],
  svgParts: [
    'M50 91 C28 81 17 59 26 30 L35 34 C29 55 35 70 50 81 C65 70 71 55 65 34 L74 30 C83 59 72 81 50 91 Z',
    'M33 45 L20 37 M35 56 L20 54 M40 68 L27 74 M67 45 L80 37 M65 56 L80 54 M60 68 L73 74',
  ],
} as const;

const crownCatalogSemanticKeys = new Set([
  ...crownMotifRecords.flatMap((motif) => crownVariantIds.map((variantId) => `crown-${motif.key}-${variantId}`)),
  crownSpecialEntry.semanticKey,
]);
if (crownCatalogSemanticKeys.size !== 73) {
  throw new Error(`Invalid crown semantic vocabulary size: ${crownCatalogSemanticKeys.size}`);
}

type MantleMotifPartId = keyof typeof mantleMotifSvgParts;
type MantleVariantId = keyof typeof mantleVariantRecords;

interface MantleMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: MantleMotifPartId;
}

/** Original local drapery silhouettes and textile details for named mantle exteriors. */
const mantleMotifSvgParts = {
  regal: [
    'M14 18 C28 9 40 13 50 28 C60 13 72 9 86 18 L80 84 L66 65 L58 94 L50 78 L42 94 L34 65 L20 84 Z',
    'M22 29 C34 22 42 27 50 39 C58 27 66 22 78 29 M31 44 L40 76 M69 44 L60 76',
  ],
  ermine: [
    'M16 20 C29 12 41 16 50 30 C59 16 71 12 84 20 L76 88 L61 70 L50 96 L39 70 L24 88 Z',
    'M31 37 L36 44 L31 51 L26 44 Z M50 48 L55 55 L50 62 L45 55 Z M69 37 L74 44 L69 51 L64 44 Z M38 69 L43 76 L38 83 L33 76 Z M62 69 L67 76 L62 83 L57 76 Z',
  ],
  sable: [
    'M19 16 C30 18 40 21 50 35 C60 21 70 18 81 16 L77 90 L62 72 L50 98 L38 72 L23 90 Z',
    'M28 30 C35 42 39 58 38 79 M72 30 C65 42 61 58 62 79 M44 42 H56 M42 57 H58',
  ],
  brocade: [
    'M13 22 C27 10 39 14 50 31 C61 14 73 10 87 22 L79 87 L65 68 L50 95 L35 68 L21 87 Z',
    'M31 38 L38 45 L31 52 L24 45 Z M50 48 L57 55 L50 62 L43 55 Z M69 38 L76 45 L69 52 L62 45 Z M40 67 L47 74 L40 81 L33 74 Z M60 67 L67 74 L60 81 L53 74 Z',
  ],
  fur: [
    'M15 19 C28 11 41 14 50 29 C59 14 72 11 85 19 L78 85 L64 67 L50 95 L36 67 L22 85 Z',
    'M20 29 C27 34 28 42 23 47 C30 45 34 50 31 56 C37 53 42 58 39 64 M80 29 C73 34 72 42 77 47 C70 45 66 50 69 56 C63 53 58 58 61 64',
  ],
  ribbon: [
    'M17 18 C30 10 42 14 50 28 C58 14 70 10 83 18 L75 90 L60 72 L50 97 L40 72 L25 90 Z',
    'M25 35 C37 27 45 35 50 43 C55 35 63 27 75 35 L67 46 C59 41 55 48 50 55 C45 48 41 41 33 46 Z M47 55 H53 V82 H47 Z',
  ],
  tasselled: [
    'M14 19 C28 9 40 14 50 30 C60 14 72 9 86 19 L80 83 L65 66 L58 94 L50 79 L42 94 L35 66 L20 83 Z',
    'M24 78 V91 M31 74 V89 M69 74 V89 M76 78 V91 M20 91 A4 4 0 1 0 20 99 A4 4 0 0 0 20 91 M72 91 A4 4 0 1 0 72 99 A4 4 0 0 0 72 91',
  ],
  scalloped: [
    'M16 17 C30 10 41 15 50 30 C59 15 70 10 84 17 L78 82 C73 80 68 85 63 82 C58 80 55 86 50 83 C45 86 42 80 37 82 C32 85 27 80 22 82 Z',
    'M24 44 C31 48 37 48 42 43 M58 43 C63 48 69 48 76 44 M31 61 C37 65 43 65 47 60 M53 60 C57 65 63 65 69 61',
  ],
  sunburst: [
    'M15 20 C29 10 41 15 50 30 C59 15 71 10 85 20 L78 88 L63 70 L50 97 L37 70 L22 88 Z',
    'M50 42 A11 11 0 1 0 50 64 A11 11 0 0 0 50 42 Z M50 27 V38 M50 68 V79 M29 53 H40 M60 53 H71 M35 38 L43 46 M65 38 L57 46 M35 68 L43 60 M65 68 L57 60',
  ],
  vine: [
    'M16 19 C29 10 41 15 50 30 C59 15 71 10 84 19 L78 87 L63 69 L50 96 L37 69 L22 87 Z',
    'M30 82 C27 62 36 51 44 55 C39 43 46 35 52 43 C58 35 65 43 60 55 C68 51 77 62 70 82 M40 57 L33 47 M60 57 L67 47 M45 69 L36 65 M55 69 L64 65',
  ],
  cloud: [
    'M14 21 C28 9 40 14 50 30 C60 14 72 9 86 21 L80 86 L65 68 L50 96 L35 68 L20 86 Z',
    'M26 45 C26 37 37 35 41 42 C43 32 57 32 59 42 C63 35 74 37 74 45 C74 53 64 55 59 50 C57 59 43 59 41 50 C36 55 26 53 26 45 Z M34 67 C34 61 42 59 46 64 C49 57 58 59 59 66 C64 62 70 66 68 72 H32 C30 66 36 62 34 67 Z',
  ],
} as const;

const mantleVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  lined: { prefix: 'Lined', prefixZh: '内衬', searchTerms: ['lined', 'lining', '内衬', '衬里'], svgPath: 'M24 28 C34 22 42 31 50 42 C58 31 66 22 76 28 L70 35 C62 31 57 42 50 51 C43 42 38 31 30 35 Z' },
  clasped: { prefix: 'Clasped', prefixZh: '扣饰', searchTerms: ['clasped', 'clasp', '扣饰', '胸针'], svgPath: 'M43 31 A7 7 0 1 0 57 31 A7 7 0 0 0 43 31 Z M47 31 H53 V45 H47 Z' },
  trimmed: { prefix: 'Trimmed', prefixZh: '滚边', searchTerms: ['trimmed', 'trim', '滚边', '镶边'], svgPath: 'M17 20 C30 10 41 15 50 30 C59 15 70 10 83 20 M24 86 L38 69 L50 96 L62 69 L76 86' },
  embroidered: { prefix: 'Embroidered', prefixZh: '刺绣', searchTerms: ['embroidered', 'embroidery', '刺绣', '绣纹'], svgPath: 'M50 45 L54 53 L63 53 L56 59 L59 68 L50 63 L41 68 L44 59 L37 53 L46 53 Z' },
} as const;
const mantleVariantIds = ['plain', 'lined', 'clasped', 'trimmed', 'embroidered'] as const satisfies readonly MantleVariantId[];

const mantleMotifRecords: readonly MantleMotifRecord[] = [
  { key: 'regal', name: 'Regal mantle', nameZh: '王室斗篷', searchTerms: ['regal', 'regal mantle', '王室', '王室斗篷'], partId: 'regal' },
  { key: 'ermine', name: 'Ermine mantle', nameZh: '白貂斗篷', searchTerms: ['ermine', 'ermine mantle', '白貂', '貂皮'], partId: 'ermine' },
  { key: 'sable', name: 'Sable mantle', nameZh: '紫貂斗篷', searchTerms: ['sable', 'sable mantle', '紫貂', '深色'], partId: 'sable' },
  { key: 'brocade', name: 'Brocade mantle', nameZh: '锦缎斗篷', searchTerms: ['brocade', 'brocade mantle', '锦缎', '织锦'], partId: 'brocade' },
  { key: 'fur', name: 'Fur mantle', nameZh: '毛皮斗篷', searchTerms: ['fur', 'fur mantle', '毛皮', '皮草'], partId: 'fur' },
  { key: 'ribbon', name: 'Ribbon mantle', nameZh: '缎带斗篷', searchTerms: ['ribbon', 'ribbon mantle', '缎带', '飘带'], partId: 'ribbon' },
  { key: 'tasselled', name: 'Tasselled mantle', nameZh: '流苏斗篷', searchTerms: ['tasselled', 'tassel', '流苏', '穗饰'], partId: 'tasselled' },
  { key: 'scalloped', name: 'Scalloped mantle', nameZh: '波边斗篷', searchTerms: ['scalloped', 'scallop', '波边', '扇边'], partId: 'scalloped' },
  { key: 'sunburst', name: 'Sunburst mantle', nameZh: '日芒斗篷', searchTerms: ['sunburst', 'sun', '日芒', '太阳'], partId: 'sunburst' },
  { key: 'vine', name: 'Vine mantle', nameZh: '藤蔓斗篷', searchTerms: ['vine', 'vine mantle', '藤蔓', '叶蔓'], partId: 'vine' },
  { key: 'cloud', name: 'Cloud mantle', nameZh: '云纹斗篷', searchTerms: ['cloud', 'cloud mantle', '云纹', '云彩'], partId: 'cloud' },
];

const mantleCatalogSemanticKeys = new Set(
  mantleMotifRecords.flatMap((motif) => mantleVariantIds.map((variantId) => `mantle-${motif.key}-${variantId}`)),
);
if (mantleCatalogSemanticKeys.size !== 55) {
  throw new Error(`Invalid mantle semantic vocabulary size: ${mantleCatalogSemanticKeys.size}`);
}

type SupporterMotifPartId = keyof typeof supporterMotifSvgParts;
type SupporterVariantId = keyof typeof supporterVariantRecords;

interface SupporterMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: SupporterMotifPartId;
}

/** Original local paired-animal compositions for named heraldic supporters. */
const supporterMotifSvgParts = {
  stag: [
    'M14 89 L20 60 L12 48 L23 40 L20 23 L34 17 L43 29 L48 47 V89 H35 L32 68 L25 89 Z M86 89 L80 60 L88 48 L77 40 L80 23 L66 17 L57 29 L52 47 V89 H65 L68 68 L75 89 Z',
    'M22 31 L14 23 L25 22 L19 12 L30 17 M78 31 L86 23 L75 22 L81 12 L70 17 M44 55 H56 V77 H44 Z',
  ],
  eagle: [
    'M11 54 L30 18 L38 42 L48 52 V89 H35 L30 66 L19 75 L24 55 Z M89 54 L70 18 L62 42 L52 52 V89 H65 L70 66 L81 75 L76 55 Z',
    'M18 58 L35 51 L28 66 M82 58 L65 51 L72 66 M45 41 L50 29 L55 41 M44 61 H56 V78 H44 Z',
  ],
  wolf: [
    'M14 89 L20 59 L12 50 L25 43 L20 24 L33 18 L44 30 L48 49 V89 H35 L31 70 L24 89 Z M86 89 L80 59 L88 50 L75 43 L80 24 L67 18 L56 30 L52 49 V89 H65 L69 70 L76 89 Z',
    'M23 39 L30 35 L34 41 M77 39 L70 35 L66 41 M28 53 L40 57 M72 53 L60 57 M44 61 H56 V78 H44 Z',
  ],
  bear: [
    'M13 89 L18 55 L11 43 L23 38 L22 22 L34 17 L45 31 L48 53 V89 H33 L30 70 L23 89 Z M87 89 L82 55 L89 43 L77 38 L78 22 L66 17 L55 31 L52 53 V89 H67 L70 70 L77 89 Z',
    'M24 29 A5 5 0 1 0 24 39 A5 5 0 0 0 24 29 M66 29 A5 5 0 1 0 66 39 A5 5 0 0 0 66 29 M44 62 H56 V80 H44 Z',
  ],
  unicorn: [
    'M14 89 L20 60 L13 48 L24 41 L20 25 L34 18 L44 31 L48 50 V89 H35 L31 70 L24 89 Z M86 89 L80 60 L87 48 L76 41 L80 25 L66 18 L56 31 L52 50 V89 H65 L69 70 L76 89 Z',
    'M27 25 L23 8 L34 21 M73 25 L77 8 L66 21 M22 45 L36 50 M78 45 L64 50 M44 62 H56 V79 H44 Z',
  ],
  horse: [
    'M14 89 L20 58 L13 48 L25 39 L23 23 L36 18 L45 32 L48 52 V89 H35 L31 69 L24 89 Z M86 89 L80 58 L87 48 L75 39 L77 23 L64 18 L55 32 L52 52 V89 H65 L69 69 L76 89 Z',
    'M25 27 L21 15 L31 21 M75 27 L79 15 L69 21 M24 55 L39 59 M76 55 L61 59 M44 63 H56 V80 H44 Z',
  ],
  boar: [
    'M13 89 L19 58 L11 50 L24 42 L22 27 L35 21 L45 34 L48 53 V89 H34 L30 70 L23 89 Z M87 89 L81 58 L89 50 L76 42 L78 27 L65 21 L55 34 L52 53 V89 H66 L70 70 L77 89 Z',
    'M20 45 L36 48 L27 55 M80 45 L64 48 L73 55 M24 33 L30 37 M76 33 L70 37 M44 63 H56 V80 H44 Z',
  ],
  dragon: [
    'M12 89 L20 61 L11 48 L25 40 L19 20 L35 30 L45 16 L48 51 V89 H34 L30 69 L23 89 Z M88 89 L80 61 L89 48 L75 40 L81 20 L65 30 L55 16 L52 51 V89 H66 L70 69 L77 89 Z',
    'M18 51 L33 44 L26 59 M82 51 L67 44 L74 59 M26 31 L18 22 L31 25 M74 31 L82 22 L69 25 M44 63 H56 V80 H44 Z',
  ],
  lynx: [
    'M14 89 L20 59 L12 48 L24 40 L21 21 L35 17 L44 32 L48 51 V89 H35 L31 69 L24 89 Z M86 89 L80 59 L88 48 L76 40 L79 21 L65 17 L56 32 L52 51 V89 H65 L69 69 L76 89 Z',
    'M25 27 L20 12 L31 20 M75 27 L80 12 L69 20 M23 43 L36 47 M77 43 L64 47 M44 62 H56 V79 H44 Z',
  ],
} as const;

const supporterVariantRecords = {
  flanking: { prefix: '', prefixZh: '', searchTerms: ['flanking', 'paired', '拱卫', '成对'] },
  rampant: { prefix: 'Rampant', prefixZh: '立姿', searchTerms: ['rampant', 'rearing', '立姿', '昂立'], svgPath: 'M17 74 L27 62 L31 74 M83 74 L73 62 L69 74' },
  seated: { prefix: 'Seated', prefixZh: '坐姿', searchTerms: ['seated', 'sitting', '坐姿', '安坐'], svgPath: 'M18 83 H39 V90 H18 M61 83 H82 V90 H61' },
  crowned: { prefix: 'Crowned', prefixZh: '加冕', searchTerms: ['crowned', 'crown', '加冕', '冠冕'], svgPath: 'M20 27 L24 17 L30 24 L35 13 L40 24 L44 17 L42 31 H22 M80 27 L76 17 L70 24 L65 13 L60 24 L56 17 L58 31 H78' },
  bannered: { prefix: 'Bannered', prefixZh: '执旗', searchTerms: ['bannered', 'banner', '执旗', '旗帜'], svgPath: 'M12 18 V71 H17 V18 Z M17 20 H36 L29 31 L36 42 H17' },
  wreathed: { prefix: 'Wreathed', prefixZh: '花环饰', searchTerms: ['wreathed', 'wreath', '花环', '月桂'], svgPath: 'M19 79 C12 61 18 43 32 35 L36 42 C25 51 23 63 28 75 M81 79 C88 61 82 43 68 35 L64 42 C75 51 77 63 72 75' },
} as const;
const supporterVariantIds = ['flanking', 'rampant', 'seated', 'crowned', 'bannered', 'wreathed'] as const satisfies readonly SupporterVariantId[];

const supporterMotifRecords: readonly SupporterMotifRecord[] = [
  { key: 'stag', name: 'Stag supporters', nameZh: '双鹿护持', searchTerms: ['stag', 'stag supporters', '鹿', '双鹿'], partId: 'stag' },
  { key: 'eagle', name: 'Eagle supporters', nameZh: '双鹰护持', searchTerms: ['eagle', 'eagle supporters', '鹰', '双鹰'], partId: 'eagle' },
  { key: 'wolf', name: 'Wolf supporters', nameZh: '双狼护持', searchTerms: ['wolf', 'wolf supporters', '狼', '双狼'], partId: 'wolf' },
  { key: 'bear', name: 'Bear supporters', nameZh: '双熊护持', searchTerms: ['bear', 'bear supporters', '熊', '双熊'], partId: 'bear' },
  { key: 'unicorn', name: 'Unicorn supporters', nameZh: '独角兽护持', searchTerms: ['unicorn', 'unicorn supporters', '独角兽', '双角兽'], partId: 'unicorn' },
  { key: 'horse', name: 'Horse supporters', nameZh: '双马护持', searchTerms: ['horse', 'horse supporters', '马', '双马'], partId: 'horse' },
  { key: 'boar', name: 'Boar supporters', nameZh: '双野猪护持', searchTerms: ['boar', 'boar supporters', '野猪', '双野猪'], partId: 'boar' },
  { key: 'dragon', name: 'Dragon supporters', nameZh: '双龙护持', searchTerms: ['dragon', 'dragon supporters', '龙', '双龙'], partId: 'dragon' },
  { key: 'lynx', name: 'Lynx supporters', nameZh: '山猫护持', searchTerms: ['lynx', 'lynx supporters', '山猫', '双山猫'], partId: 'lynx' },
];

const supporterCatalogSemanticKeys = new Set(
  supporterMotifRecords.flatMap((motif) => supporterVariantIds.map((variantId) => `supporter-${motif.key}-${variantId}`)),
);
if (supporterCatalogSemanticKeys.size !== 54) {
  throw new Error(`Invalid supporter semantic vocabulary size: ${supporterCatalogSemanticKeys.size}`);
}

type ExteriorMotifPartId = keyof typeof exteriorMotifSvgParts;
type ExteriorVariantId = keyof typeof exteriorVariantRecords;

interface ExteriorMotifRecord {
  readonly key: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly partId: ExteriorMotifPartId;
}

/** Original local silhouettes and details for named heraldic exterior ornaments. */
const exteriorMotifSvgParts = {
  tournament: [
    'M23 77 V50 C23 30 36 17 50 17 C64 17 77 30 77 50 V77 H23 Z M32 45 C32 31 40 26 50 26 C60 26 68 31 68 45 V55 H32 Z',
    'M27 77 H73 V88 H27 Z M45 37 H55 V48 H45 Z M39 62 H61 V69 H39 Z',
  ],
  laurel: [
    'M50 88 C27 81 16 59 25 29 L33 33 C27 52 32 70 50 80 C68 70 73 52 67 33 L75 29 C84 59 73 81 50 88 Z',
    'M31 42 L20 35 M34 53 L20 50 M39 64 L26 70 M69 42 L80 35 M66 53 L80 50 M61 64 L74 70',
  ],
  scroll: [
    'M17 37 C28 24 42 29 50 39 C58 29 72 24 83 37 V69 C72 81 58 76 50 67 C42 76 28 81 17 69 Z',
    'M19 39 C9 42 10 56 20 57 C10 58 9 72 20 75 M81 39 C91 42 90 56 80 57 C90 58 91 72 80 75 M36 51 H64 M36 61 H64',
  ],
  pennant: [
    'M24 16 V89 H31 V16 Z M31 21 H79 L64 38 L79 55 H31 Z',
    'M38 31 L48 38 L38 45 Z M55 31 L65 38 L55 45 Z M31 89 A7 7 0 1 0 31 96 A7 7 0 0 0 31 89',
  ],
  knot: [
    'M20 50 C20 31 42 31 50 50 C58 31 80 31 80 50 C80 69 58 69 50 50 C42 69 20 69 20 50 Z',
    'M28 50 C28 41 40 41 50 50 C60 41 72 41 72 50 C72 59 60 59 50 50 C40 59 28 59 28 50 Z M44 50 H56 V79 H44 Z',
  ],
  plume: [
    'M50 84 C29 63 28 32 46 12 C44 29 54 36 50 52 C58 32 70 27 78 19 C74 44 64 67 50 84 Z',
    'M47 84 L52 24 M37 61 C46 58 54 49 60 37 M43 72 C54 66 63 56 68 44 M38 84 H62 V92 H38 Z',
  ],
  torch: [
    'M44 90 V51 C37 42 41 28 50 16 C59 28 63 42 56 51 V90 H44 Z',
    'M35 90 H65 V96 H35 Z M50 16 C42 10 45 3 51 0 C57 8 60 13 50 16 M44 60 H56 M44 70 H56',
  ],
  collar: [
    'M18 37 C23 76 39 87 50 87 C61 87 77 76 82 37 L73 34 C69 64 59 76 50 76 C41 76 31 64 27 34 Z',
    'M22 39 L33 47 M27 55 L39 59 M38 70 L47 73 M78 39 L67 47 M73 55 L61 59 M62 70 L53 73 M45 86 L50 95 L55 86 Z',
  ],
  rosette: [
    'M50 15 L58 31 L75 25 L69 42 L86 50 L69 58 L75 75 L58 69 L50 86 L42 69 L25 75 L31 58 L14 50 L31 42 L25 25 L42 31 Z',
    'M50 36 A14 14 0 1 0 50 64 A14 14 0 0 0 50 36 Z M45 76 L40 94 L50 86 L60 94 L55 76',
  ],
  winged: [
    'M50 78 L39 63 L42 41 L50 28 L58 41 L61 63 Z M39 58 C23 56 13 44 11 25 C25 32 35 38 42 49 M61 58 C77 56 87 44 89 25 C75 32 65 38 58 49',
    'M43 60 H57 V82 H43 Z M47 39 H53 V50 H47 Z M35 66 L22 73 M65 66 L78 73',
  ],
  canopy: [
    'M15 38 C27 14 42 12 50 29 C58 12 73 14 85 38 L79 78 L65 65 L50 88 L35 65 L21 78 Z',
    'M22 40 C34 32 42 36 50 47 C58 36 66 32 78 40 M31 63 L40 82 M69 63 L60 82 M47 29 H53 V44 H47',
  ],
} as const;

const exteriorVariantRecords = {
  plain: { prefix: '', prefixZh: '', searchTerms: ['plain', '素面'] },
  gilded: { prefix: 'Gilded', prefixZh: '鎏金', searchTerms: ['gilded', 'gold', '鎏金', '金饰'], svgPath: 'M43 35 L50 27 L57 35 L50 43 Z M43 67 L50 59 L57 67 L50 75 Z' },
  ribboned: { prefix: 'Ribboned', prefixZh: '缎带饰', searchTerms: ['ribboned', 'ribbon', '缎带', '飘带'], svgPath: 'M22 79 C32 72 40 77 50 84 C60 77 68 72 78 79 L72 87 C64 83 57 88 50 93 C43 88 36 83 28 87 Z' },
  rayed: { prefix: 'Rayed', prefixZh: '放射饰', searchTerms: ['rayed', 'rays', '放射', '光芒'], svgPath: 'M50 6 V19 M24 16 L33 27 M76 16 L67 27 M11 46 H25 M89 46 H75 M18 73 L30 65 M82 73 L70 65' },
  wreathed: { prefix: 'Wreathed', prefixZh: '花环饰', searchTerms: ['wreathed', 'wreath', '花环', '月桂'], svgPath: 'M28 78 C17 64 17 45 30 33 M72 78 C83 64 83 45 70 33 M23 51 L14 45 M28 62 L17 61 M77 51 L86 45 M72 62 L83 61' },
} as const;
const exteriorVariantIds = ['plain', 'gilded', 'ribboned', 'rayed', 'wreathed'] as const satisfies readonly ExteriorVariantId[];

const exteriorMotifRecords: readonly ExteriorMotifRecord[] = [
  { key: 'tournament', name: 'Tournament helm', nameZh: '比武头盔', searchTerms: ['tournament', 'tournament helm', 'helm', '头盔', '盔'], partId: 'tournament' },
  { key: 'laurel', name: 'Laurel garland', nameZh: '月桂花环', searchTerms: ['laurel', 'laurel garland', 'garland', '月桂', '花环'], partId: 'laurel' },
  { key: 'scroll', name: 'Ribbon scroll', nameZh: '饰带卷轴', searchTerms: ['scroll', 'ribbon scroll', '卷轴', '饰带'], partId: 'scroll' },
  { key: 'pennant', name: 'Pennant standard', nameZh: '三角旗帜', searchTerms: ['pennant', 'standard', 'flag', '旗帜', '三角旗'], partId: 'pennant' },
  { key: 'knot', name: 'Heraldic knot', nameZh: '纹章饰结', searchTerms: ['knot', 'heraldic knot', '饰结', '结饰'], partId: 'knot' },
  { key: 'plume', name: 'Feather plume', nameZh: '羽饰盔羽', searchTerms: ['plume', 'feather plume', '羽饰', '盔羽'], partId: 'plume' },
  { key: 'torch', name: 'Torch sconce', nameZh: '火炬壁托', searchTerms: ['torch', 'torch sconce', '火炬', '壁托'], partId: 'torch' },
  { key: 'collar', name: 'Chain collar', nameZh: '链式项圈', searchTerms: ['collar', 'chain collar', 'chain', '项圈', '链饰'], partId: 'collar' },
  { key: 'rosette', name: 'Rosette badge', nameZh: '玫瑰花徽', searchTerms: ['rosette', 'rosette badge', '花徽', '玫瑰'], partId: 'rosette' },
  { key: 'winged', name: 'Winged badge', nameZh: '翼饰徽章', searchTerms: ['winged', 'winged badge', 'wings', '翼饰', '翅膀'], partId: 'winged' },
  { key: 'canopy', name: 'Canopy drape', nameZh: '华盖帷幕', searchTerms: ['canopy', 'canopy drape', '华盖', '帷幕'], partId: 'canopy' },
];

const exteriorCatalogSemanticKeys = new Set(
  exteriorMotifRecords.flatMap((motif) => exteriorVariantIds.map((variantId) => `exterior-${motif.key}-${variantId}`)),
);
if (exteriorCatalogSemanticKeys.size !== 55) {
  throw new Error(`Invalid exterior semantic vocabulary size: ${exteriorCatalogSemanticKeys.size}`);
}

const referenceCatalogEntries = referenceCatalogSeeds.flatMap((seed) => (
  seed.section === 'shield' && seed.category === 'shield'
    ? createKiteShieldCatalogEntries(seed)
    : seed.section === 'shield' && seed.category === 'heater'
      ? createHeaterShieldCatalogEntries(seed)
      : seed.section === 'shield' && seed.category === 'french'
        ? createFrenchShieldCatalogEntries(seed)
        : seed.section === 'shield' && seed.category === 'banner'
          ? createBannerShieldCatalogEntries(seed)
          : seed.section === 'shield' && seed.category === 'round'
            ? createRoundShieldCatalogEntries(seed)
            : seed.section === 'shield' && seed.category === 'lozenge'
              ? createLozengeShieldCatalogEntries(seed)
              : seed.section === 'charge' && seed.category === 'animal'
                ? createAnimalCatalogEntries(seed)
                : seed.section === 'charge' && seed.category === 'object'
                  ? createObjectCatalogEntries(seed)
                  : seed.section === 'charge' && seed.category === 'plant'
                    ? createPlantCatalogEntries(seed)
                    : seed.section === 'charge' && seed.category === 'human'
                      ? createHumanCatalogEntries(seed)
                      : seed.section === 'charge' && seed.category === 'symbol'
                        ? createSymbolCatalogEntries(seed)
                        : seed.section === 'top' && seed.category === 'crown'
                          ? createCrownCatalogEntries(seed)
                          : seed.section === 'top' && seed.category === 'mantle'
                            ? createMantleCatalogEntries(seed)
                            : seed.section === 'top' && seed.category === 'supporter'
                              ? createSupporterCatalogEntries(seed)
                              : seed.section === 'top' && seed.category === 'other'
                                ? createExteriorCatalogEntries(seed)
                                : createCatalogEntries(seed)
));
const referenceCatalogCategoriesBySection: Readonly<Record<ReferenceCatalogSection, readonly string[]>> = {
  shield: shieldReferenceCategories,
  charge: ['animal', 'object', 'plant', 'human', 'symbol'],
  top: ['crown', 'mantle', 'supporter', 'other'],
};

type ReferenceShieldCardDesign = Pick<CoatField, 'division' | 'colors' | 'pattern'>;

/**
 * Local field compositions rendered by the shield card browser. They use a
 * compact, original heraldic palette so a card represents a complete shield
 * choice rather than a duplicate outline with no visible field change.
 */
const referenceShieldCardDesigns: readonly ReferenceShieldCardDesign[] = [
  { division: 'solid', colors: ['#F7C900'], pattern: 'solid' },
  { division: 'per-pale', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
  { division: 'per-fess', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
  { division: 'solid', colors: ['#C7202B', '#F7C900'], pattern: 'checks' },
  { division: 'per-bend', colors: ['#F7C900', '#C7202B'], pattern: 'solid' },
  { division: 'per-chevron', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
  { division: 'paly', colors: ['#F7C900', '#C7202B'], pattern: 'solid' },
  { division: 'barry', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
  { division: 'quarterly', colors: ['#F7C900', '#C7202B'], pattern: 'solid' },
  { division: 'per-saltire', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
  { division: 'bendy', colors: ['#F7C900', '#C7202B'], pattern: 'solid' },
  { division: 'gyronny', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
  { division: 'solid', colors: ['#F7C900', '#C7202B'], pattern: 'lozengy' },
  { division: 'solid', colors: ['#C7202B', '#F7C900'], pattern: 'fretty' },
  { division: 'tierced-per-pale', colors: ['#F7C900', '#C7202B'], pattern: 'solid' },
  { division: 'tierced-per-fess', colors: ['#C7202B', '#F7C900'], pattern: 'solid' },
];

export function listReferenceCatalogEntries(
  section: ReferenceCatalogSection,
  category: string,
): readonly ReferenceCatalogEntry[] {
  if (!isReferenceCatalogSection(section)) {
    throw new Error(`Invalid reference catalog section: ${String(section)}`);
  }
  if (!referenceCatalogCategoriesBySection[section].includes(category)) {
    throw new Error(`Invalid reference catalog category for ${section}: ${category}`);
  }
  return referenceCatalogEntries.filter(
    (entry) => entry.section === section && entry.category === category,
  );
}

/** Returns the complete local field composition represented by one shield card. */
export function getReferenceShieldCardField(assetId: string): CoatField {
  if (typeof assetId !== 'string') {
    throw new Error(`Invalid reference shield asset id: ${String(assetId)}`);
  }
  const shieldEntry = referenceCatalogEntries.find((entry) => (
    entry.section === 'shield' && entry.id === assetId
  ));
  if (!shieldEntry) {
    throw new Error(`Unknown reference shield asset id: ${assetId}`);
  }
  const categoryEntries = listReferenceCatalogEntries('shield', shieldEntry.category);
  const categoryIndex = categoryEntries.findIndex((entry) => entry.id === assetId);
  if (categoryIndex < 0) {
    throw new Error(`Missing reference shield catalog index for asset id: ${assetId}`);
  }
  const cardDesign = referenceShieldCardDesigns[categoryIndex % referenceShieldCardDesigns.length];
  if (!cardDesign) {
    throw new Error(`Missing reference shield card design for asset id: ${assetId}`);
  }
  return {
    division: cardDesign.division,
    colors: [...cardDesign.colors],
    pattern: cardDesign.pattern,
  };
}

export function assertReferenceCatalogEntry(entry: unknown): asserts entry is ReferenceCatalogEntry {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Invalid local catalog entry: ${String(entry)}`);
  }
  if ('sourceUrl' in entry) {
    throw new Error(`Invalid local catalog source: ${JSON.stringify(entry)}`);
  }
  const isKiteShieldCatalogEntry = (
    'section' in entry
    && entry.section === 'shield'
    && 'category' in entry
    && entry.category === 'shield'
  );
  const isHeaterShieldCatalogEntry = (
    'section' in entry
    && entry.section === 'shield'
    && 'category' in entry
    && entry.category === 'heater'
  );
  const isFrenchShieldCatalogEntry = (
    'section' in entry
    && entry.section === 'shield'
    && 'category' in entry
    && entry.category === 'french'
  );
  const isBannerShieldCatalogEntry = (
    'section' in entry
    && entry.section === 'shield'
    && 'category' in entry
    && entry.category === 'banner'
  );
  const isRoundShieldCatalogEntry = (
    'section' in entry
    && entry.section === 'shield'
    && 'category' in entry
    && entry.category === 'round'
  );
  const isLozengeShieldCatalogEntry = (
    'section' in entry
    && entry.section === 'shield'
    && 'category' in entry
    && entry.category === 'lozenge'
  );
  const isAnimalCatalogEntry = (
    'section' in entry
    && entry.section === 'charge'
    && 'category' in entry
    && entry.category === 'animal'
  );
  const isObjectCatalogEntry = (
    'section' in entry
    && entry.section === 'charge'
    && 'category' in entry
    && entry.category === 'object'
  );
  const isPlantCatalogEntry = (
    'section' in entry
    && entry.section === 'charge'
    && 'category' in entry
    && entry.category === 'plant'
  );
  const isHumanCatalogEntry = (
    'section' in entry
    && entry.section === 'charge'
    && 'category' in entry
    && entry.category === 'human'
  );
  const isSymbolCatalogEntry = (
    'section' in entry
    && entry.section === 'charge'
    && 'category' in entry
    && entry.category === 'symbol'
  );
  const isCrownCatalogEntry = (
    'section' in entry
    && entry.section === 'top'
    && 'category' in entry
    && entry.category === 'crown'
  );
  const isMantleCatalogEntry = (
    'section' in entry
    && entry.section === 'top'
    && 'category' in entry
    && entry.category === 'mantle'
  );
  const isSupporterCatalogEntry = (
    'section' in entry
    && entry.section === 'top'
    && 'category' in entry
    && entry.category === 'supporter'
  );
  const isExteriorCatalogEntry = (
    'section' in entry
    && entry.section === 'top'
    && 'category' in entry
    && entry.category === 'other'
  );
  const expectedEntryKeys = isKiteShieldCatalogEntry
    ? referenceCatalogShieldEntryKeys
    : isHeaterShieldCatalogEntry
      ? referenceCatalogHeaterEntryKeys
      : isFrenchShieldCatalogEntry
        ? referenceCatalogFrenchEntryKeys
        : isBannerShieldCatalogEntry
          ? referenceCatalogBannerEntryKeys
          : isRoundShieldCatalogEntry
            ? referenceCatalogRoundEntryKeys
            : isLozengeShieldCatalogEntry
              ? referenceCatalogLozengeEntryKeys
              : isAnimalCatalogEntry
                ? referenceCatalogAnimalEntryKeys
                : isObjectCatalogEntry
                  ? referenceCatalogObjectEntryKeys
                  : isPlantCatalogEntry
                    ? referenceCatalogPlantEntryKeys
                    : isHumanCatalogEntry
                      ? referenceCatalogHumanEntryKeys
                      : isSymbolCatalogEntry
                        ? referenceCatalogSymbolEntryKeys
                        : isCrownCatalogEntry
                          ? referenceCatalogCrownEntryKeys
                          : isMantleCatalogEntry
                            ? referenceCatalogMantleEntryKeys
                            : isSupporterCatalogEntry
                              ? referenceCatalogSupporterEntryKeys
                              : isExteriorCatalogEntry
                                ? referenceCatalogExteriorEntryKeys
                                : referenceCatalogEntryKeys;
  if (
    !hasExactKeys(entry, expectedEntryKeys)
    || !('id' in entry) || typeof entry.id !== 'string' || !isLocalReferenceValue(entry.id) || entry.id.length === 0
    || !('section' in entry) || !isReferenceCatalogSection(entry.section)
    || !('category' in entry) || typeof entry.category !== 'string' || !isLocalReferenceValue(entry.category) || entry.category.length === 0
    || !('name' in entry) || typeof entry.name !== 'string' || !isLocalReferenceValue(entry.name) || entry.name.length === 0
    || !('nameZh' in entry) || typeof entry.nameZh !== 'string' || !isLocalReferenceValue(entry.nameZh) || entry.nameZh.length === 0
    || !('searchTerms' in entry) || !isStringArray(entry.searchTerms)
    || !('svgParts' in entry) || !isLocalSvgParts(entry.svgParts)
  ) {
    if (isKiteShieldCatalogEntry && (!('shieldSemanticKey' in entry) || !isKiteShieldSemanticKey(entry.shieldSemanticKey))) {
      throw new Error(`Invalid local catalog shield semantic key: ${JSON.stringify(entry)}`);
    }
    if (isHeaterShieldCatalogEntry && (!('heaterSemanticKey' in entry) || !isHeaterShieldSemanticKey(entry.heaterSemanticKey))) {
      throw new Error(`Invalid local catalog heater semantic key: ${JSON.stringify(entry)}`);
    }
    if (isFrenchShieldCatalogEntry && (!('frenchSemanticKey' in entry) || !isFrenchShieldSemanticKey(entry.frenchSemanticKey))) {
      throw new Error(`Invalid local catalog French semantic key: ${JSON.stringify(entry)}`);
    }
    if (isBannerShieldCatalogEntry && (!('bannerSemanticKey' in entry) || !isBannerShieldSemanticKey(entry.bannerSemanticKey))) {
      throw new Error(`Invalid local catalog Banner semantic key: ${JSON.stringify(entry)}`);
    }
    if (isRoundShieldCatalogEntry && (!('roundSemanticKey' in entry) || !isRoundShieldSemanticKey(entry.roundSemanticKey))) {
      throw new Error(`Invalid local catalog Round semantic key: ${JSON.stringify(entry)}`);
    }
    if (isLozengeShieldCatalogEntry && (!('lozengeSemanticKey' in entry) || !isLozengeShieldSemanticKey(entry.lozengeSemanticKey))) {
      throw new Error(`Invalid local catalog Lozenge semantic key: ${JSON.stringify(entry)}`);
    }
    if (isAnimalCatalogEntry && (!('semanticKey' in entry) || !isAnimalSemanticKey(entry.semanticKey))) {
      throw new Error(`Invalid local catalog semantic key: ${JSON.stringify(entry)}`);
    }
    if (isObjectCatalogEntry && (!('objectSemanticKey' in entry) || !isObjectSemanticKey(entry.objectSemanticKey))) {
      throw new Error(`Invalid local catalog object semantic key: ${JSON.stringify(entry)}`);
    }
    if (isPlantCatalogEntry && (!('plantSemanticKey' in entry) || !isPlantSemanticKey(entry.plantSemanticKey))) {
      throw new Error(`Invalid local catalog plant semantic key: ${JSON.stringify(entry)}`);
    }
    if (isHumanCatalogEntry && (!('humanSemanticKey' in entry) || !isHumanSemanticKey(entry.humanSemanticKey))) {
      throw new Error(`Invalid local catalog human semantic key: ${JSON.stringify(entry)}`);
    }
    if (isSymbolCatalogEntry && (!('symbolSemanticKey' in entry) || !isSymbolSemanticKey(entry.symbolSemanticKey))) {
      throw new Error(`Invalid local catalog symbol semantic key: ${JSON.stringify(entry)}`);
    }
    if (isCrownCatalogEntry && (!('crownSemanticKey' in entry) || !isCrownSemanticKey(entry.crownSemanticKey))) {
      throw new Error(`Invalid local catalog crown semantic key: ${JSON.stringify(entry)}`);
    }
    if (isMantleCatalogEntry && (!('mantleSemanticKey' in entry) || !isMantleSemanticKey(entry.mantleSemanticKey))) {
      throw new Error(`Invalid local catalog mantle semantic key: ${JSON.stringify(entry)}`);
    }
    if (isSupporterCatalogEntry && (!('supporterSemanticKey' in entry) || !isSupporterSemanticKey(entry.supporterSemanticKey))) {
      throw new Error(`Invalid local catalog supporter semantic key: ${JSON.stringify(entry)}`);
    }
    if (isExteriorCatalogEntry && (!('exteriorSemanticKey' in entry) || !isExteriorSemanticKey(entry.exteriorSemanticKey))) {
      throw new Error(`Invalid local catalog exterior semantic key: ${JSON.stringify(entry)}`);
    }
    throw new Error(`Invalid local catalog entry: ${JSON.stringify(entry)}`);
  }
  if (!('licenseId' in entry) || !isReferenceCatalogLicenseId(entry.licenseId)) {
    throw new Error(`Invalid local catalog license: ${JSON.stringify(entry)}`);
  }
  if (isKiteShieldCatalogEntry && (!('shieldSemanticKey' in entry) || !isKiteShieldSemanticKey(entry.shieldSemanticKey))) {
    throw new Error(`Invalid local catalog shield semantic key: ${JSON.stringify(entry)}`);
  }
  if (isHeaterShieldCatalogEntry && (!('heaterSemanticKey' in entry) || !isHeaterShieldSemanticKey(entry.heaterSemanticKey))) {
    throw new Error(`Invalid local catalog heater semantic key: ${JSON.stringify(entry)}`);
  }
  if (isFrenchShieldCatalogEntry && (!('frenchSemanticKey' in entry) || !isFrenchShieldSemanticKey(entry.frenchSemanticKey))) {
    throw new Error(`Invalid local catalog French semantic key: ${JSON.stringify(entry)}`);
  }
  if (isBannerShieldCatalogEntry && (!('bannerSemanticKey' in entry) || !isBannerShieldSemanticKey(entry.bannerSemanticKey))) {
    throw new Error(`Invalid local catalog Banner semantic key: ${JSON.stringify(entry)}`);
  }
  if (isRoundShieldCatalogEntry && (!('roundSemanticKey' in entry) || !isRoundShieldSemanticKey(entry.roundSemanticKey))) {
    throw new Error(`Invalid local catalog Round semantic key: ${JSON.stringify(entry)}`);
  }
  if (isLozengeShieldCatalogEntry && (!('lozengeSemanticKey' in entry) || !isLozengeShieldSemanticKey(entry.lozengeSemanticKey))) {
    throw new Error(`Invalid local catalog Lozenge semantic key: ${JSON.stringify(entry)}`);
  }
  if (isAnimalCatalogEntry && (!('semanticKey' in entry) || !isAnimalSemanticKey(entry.semanticKey))) {
    throw new Error(`Invalid local catalog semantic key: ${JSON.stringify(entry)}`);
  }
  if (isObjectCatalogEntry && (!('objectSemanticKey' in entry) || !isObjectSemanticKey(entry.objectSemanticKey))) {
    throw new Error(`Invalid local catalog object semantic key: ${JSON.stringify(entry)}`);
  }
  if (isPlantCatalogEntry && (!('plantSemanticKey' in entry) || !isPlantSemanticKey(entry.plantSemanticKey))) {
    throw new Error(`Invalid local catalog plant semantic key: ${JSON.stringify(entry)}`);
  }
  if (isHumanCatalogEntry && (!('humanSemanticKey' in entry) || !isHumanSemanticKey(entry.humanSemanticKey))) {
    throw new Error(`Invalid local catalog human semantic key: ${JSON.stringify(entry)}`);
  }
  if (isSymbolCatalogEntry && (!('symbolSemanticKey' in entry) || !isSymbolSemanticKey(entry.symbolSemanticKey))) {
    throw new Error(`Invalid local catalog symbol semantic key: ${JSON.stringify(entry)}`);
  }
  if (isCrownCatalogEntry && (!('crownSemanticKey' in entry) || !isCrownSemanticKey(entry.crownSemanticKey))) {
    throw new Error(`Invalid local catalog crown semantic key: ${JSON.stringify(entry)}`);
  }
  if (isMantleCatalogEntry && (!('mantleSemanticKey' in entry) || !isMantleSemanticKey(entry.mantleSemanticKey))) {
    throw new Error(`Invalid local catalog mantle semantic key: ${JSON.stringify(entry)}`);
  }
  if (isSupporterCatalogEntry && (!('supporterSemanticKey' in entry) || !isSupporterSemanticKey(entry.supporterSemanticKey))) {
    throw new Error(`Invalid local catalog supporter semantic key: ${JSON.stringify(entry)}`);
  }
  if (isExteriorCatalogEntry && (!('exteriorSemanticKey' in entry) || !isExteriorSemanticKey(entry.exteriorSemanticKey))) {
    throw new Error(`Invalid local catalog exterior semantic key: ${JSON.stringify(entry)}`);
  }
}

function createKiteShieldCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = kiteShieldMotifRecords.length * kiteShieldVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid kite shield motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = kiteShieldMotifRecords.flatMap((motif) => kiteShieldVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = kiteShieldVariantRecords[variantId];
    const shieldSemanticKey = `shield-${motif.key}-${variantId}`;
    if (semanticKeys.has(shieldSemanticKey)) {
      throw new Error(`Duplicate kite shield catalog semantic key: ${shieldSemanticKey}`);
    }
    semanticKeys.add(shieldSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatKiteShieldCatalogName(motif, variant),
      nameZh: formatKiteShieldCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        shieldSemanticKey,
      ],
      svgParts: [
        ...kiteShieldMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createKiteShieldVariantSvgParts(variant),
      ],
      shieldSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete kite shield motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createHeaterShieldCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = (heaterShieldMotifRecords.length * heaterShieldVariantIds.length) + 1;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid heater shield motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }
  const [pointedHeraldicSeed] = seed.featuredEntries ?? [];
  if (
    !pointedHeraldicSeed
    || pointedHeraldicSeed.id !== 'pointed-heraldic-shield'
    || pointedHeraldicSeed.name !== 'Pointed heraldic shield'
    || pointedHeraldicSeed.nameZh !== '尖顶纹章盾'
  ) {
    throw new Error(`Invalid featured heater shield seed: ${JSON.stringify(seed.featuredEntries)}`);
  }

  const semanticKeys = new Set<string>([heaterSpecialSemanticKey]);
  let variantNumber = 2;
  const namedEntries = heaterShieldMotifRecords.flatMap((motif) => heaterShieldVariantIds.map((variantId) => {
    const variant = heaterShieldVariantRecords[variantId];
    const heaterSemanticKey = `heater-${motif.key}-${variantId}`;
    if (semanticKeys.has(heaterSemanticKey)) {
      throw new Error(`Duplicate heater shield catalog semantic key: ${heaterSemanticKey}`);
    }
    semanticKeys.add(heaterSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatHeaterShieldCatalogName(motif, variant),
      nameZh: formatHeaterShieldCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        heaterSemanticKey,
      ],
      svgParts: [
        ...heaterShieldMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createHeaterShieldVariantSvgParts(variant),
      ],
      heaterSemanticKey,
    };
    variantNumber += 1;
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  const pointedHeraldicEntry: ReferenceCatalogEntry = {
    id: pointedHeraldicSeed.id,
    section: seed.section,
    category: seed.category,
    name: pointedHeraldicSeed.name,
    nameZh: pointedHeraldicSeed.nameZh,
    licenseId: seed.licenseId,
    searchTerms: [...pointedHeraldicSeed.searchTerms, heaterSpecialSemanticKey],
    svgParts: heaterSpecialSvgParts.map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
    heaterSemanticKey: heaterSpecialSemanticKey,
  };
  assertReferenceCatalogEntry(pointedHeraldicEntry);
  const entries = [pointedHeraldicEntry, ...namedEntries];

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete heater shield motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createFrenchShieldCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = frenchShieldMotifRecords.length * frenchShieldVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid French shield motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = frenchShieldMotifRecords.flatMap((motif) => frenchShieldVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = frenchShieldVariantRecords[variantId];
    const frenchSemanticKey = `french-${motif.key}-${variantId}`;
    if (semanticKeys.has(frenchSemanticKey)) {
      throw new Error(`Duplicate French shield catalog semantic key: ${frenchSemanticKey}`);
    }
    semanticKeys.add(frenchSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatFrenchShieldCatalogName(motif, variant),
      nameZh: formatFrenchShieldCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        frenchSemanticKey,
      ],
      svgParts: [
        ...frenchShieldMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createFrenchShieldVariantSvgParts(variant),
      ],
      frenchSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete French shield motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createBannerShieldCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = bannerShieldMotifRecords.length * bannerShieldVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid Banner shield motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = bannerShieldMotifRecords.flatMap((motif) => bannerShieldVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = bannerShieldVariantRecords[variantId];
    const bannerSemanticKey = `banner-${motif.key}-${variantId}`;
    if (semanticKeys.has(bannerSemanticKey)) {
      throw new Error(`Duplicate Banner shield catalog semantic key: ${bannerSemanticKey}`);
    }
    semanticKeys.add(bannerSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatBannerShieldCatalogName(motif, variant),
      nameZh: formatBannerShieldCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        bannerSemanticKey,
      ],
      svgParts: [
        ...bannerShieldMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createBannerShieldVariantSvgParts(variant),
      ],
      bannerSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete Banner shield motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createRoundShieldCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = roundShieldMotifRecords.length * roundShieldVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid Round shield motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = roundShieldMotifRecords.flatMap((motif) => roundShieldVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = roundShieldVariantRecords[variantId];
    const roundSemanticKey = `round-${motif.key}-${variantId}`;
    if (semanticKeys.has(roundSemanticKey)) {
      throw new Error(`Duplicate Round shield catalog semantic key: ${roundSemanticKey}`);
    }
    semanticKeys.add(roundSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatRoundShieldCatalogName(motif, variant),
      nameZh: formatRoundShieldCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        roundSemanticKey,
      ],
      svgParts: [
        ...roundShieldMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createRoundShieldVariantSvgParts(variant),
      ],
      roundSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete Round shield motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createLozengeShieldCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = lozengeShieldMotifRecords.length * lozengeShieldVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid Lozenge shield motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = lozengeShieldMotifRecords.flatMap((motif) => lozengeShieldVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = lozengeShieldVariantRecords[variantId];
    const lozengeSemanticKey = `lozenge-${motif.key}-${variantId}`;
    if (semanticKeys.has(lozengeSemanticKey)) {
      throw new Error(`Duplicate Lozenge shield catalog semantic key: ${lozengeSemanticKey}`);
    }
    semanticKeys.add(lozengeSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatLozengeShieldCatalogName(motif, variant),
      nameZh: formatLozengeShieldCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        lozengeSemanticKey,
      ],
      svgParts: [
        ...lozengeShieldMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createLozengeShieldVariantSvgParts(variant),
      ],
      lozengeSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete Lozenge shield motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createAnimalCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = animalMotifRecords.length * 3 * 3;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid animal motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = animalMotifRecords.flatMap((motif) => motif.poseIds.flatMap((poseId) => (
    animalOrnamentIds.map((ornamentId) => {
      variantNumber += 1;
      const pose = animalPoseRecords[poseId];
      const ornament = animalOrnamentRecords[ornamentId];
      const semanticKey = `${motif.key}-${poseId}-${ornamentId}`;
      if (semanticKeys.has(semanticKey)) {
        throw new Error(`Duplicate animal catalog semantic key: ${semanticKey}`);
      }
      semanticKeys.add(semanticKey);

      const entry: ReferenceCatalogEntry = {
        id: variantNumber === 1 ? 'lion-rampant' : `${seed.idPrefix}-${variantNumber}`,
        section: seed.section,
        category: seed.category,
        name: formatAnimalCatalogName(motif, pose, ornament),
        nameZh: formatAnimalCatalogNameZh(motif, pose, ornament),
        licenseId: seed.licenseId,
        searchTerms: [
          ...motif.searchTerms,
          pose.name,
          pose.nameZh,
          ...pose.searchTerms,
          ...ornament.searchTerms,
          semanticKey,
        ],
        svgParts: [
          { svgPath: animalMotifSvgParts[motif.partId], sourceColor: '#1F2937' },
          { svgPath: createAnimalMotifSignatureSvgPath(motif.key), sourceColor: '#1F2937' },
          { svgPath: pose.svgPath, sourceColor: '#1F2937' },
          ...createAnimalOrnamentSvgParts(ornament),
        ],
        semanticKey,
      };
      assertReferenceCatalogEntry(entry);
      return entry;
    })
  )));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete animal motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createObjectCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = objectMotifRecords.length * objectVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid object motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = objectMotifRecords.flatMap((motif) => objectVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = objectVariantRecords[variantId];
    const objectSemanticKey = `object-${motif.key}-${variantId}`;
    if (semanticKeys.has(objectSemanticKey)) {
      throw new Error(`Duplicate object catalog semantic key: ${objectSemanticKey}`);
    }
    semanticKeys.add(objectSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatObjectCatalogName(motif, variant),
      nameZh: formatObjectCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        objectSemanticKey,
      ],
      svgParts: [
        ...objectMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createObjectVariantSvgParts(variant),
      ],
      objectSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete object motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createPlantCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = plantMotifRecords.length * plantVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid plant motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = plantMotifRecords.flatMap((motif) => plantVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = plantVariantRecords[variantId];
    const plantSemanticKey = `plant-${motif.key}-${variantId}`;
    if (semanticKeys.has(plantSemanticKey)) {
      throw new Error(`Duplicate plant catalog semantic key: ${plantSemanticKey}`);
    }
    semanticKeys.add(plantSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatPlantCatalogName(motif, variant),
      nameZh: formatPlantCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        plantSemanticKey,
      ],
      svgParts: [
        ...plantMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createPlantVariantSvgParts(variant),
      ],
      plantSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete plant motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createHumanCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = humanMotifRecords.length * humanVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid human motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = humanMotifRecords.flatMap((motif) => humanVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = humanVariantRecords[variantId];
    const humanSemanticKey = `human-${motif.key}-${variantId}`;
    if (semanticKeys.has(humanSemanticKey)) {
      throw new Error(`Duplicate human catalog semantic key: ${humanSemanticKey}`);
    }
    semanticKeys.add(humanSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatHumanCatalogName(motif, variant),
      nameZh: formatHumanCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        humanSemanticKey,
      ],
      svgParts: [
        ...humanMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createHumanVariantSvgParts(variant),
      ],
      humanSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete human motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createSymbolCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = symbolMotifRecords.length * symbolVariantIds.length + 1;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid symbol motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const motifEntries = symbolMotifRecords.flatMap((motif) => symbolVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = symbolVariantRecords[variantId];
    const symbolSemanticKey = `symbol-${motif.key}-${variantId}`;
    if (semanticKeys.has(symbolSemanticKey)) {
      throw new Error(`Duplicate symbol catalog semantic key: ${symbolSemanticKey}`);
    }
    semanticKeys.add(symbolSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatSymbolCatalogName(motif, variant),
      nameZh: formatSymbolCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        symbolSemanticKey,
      ],
      svgParts: [
        ...symbolMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createSymbolVariantSvgParts(variant),
      ],
      symbolSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (semanticKeys.has(symbolSpecialEntry.semanticKey)) {
    throw new Error(`Duplicate symbol catalog semantic key: ${symbolSpecialEntry.semanticKey}`);
  }
  semanticKeys.add(symbolSpecialEntry.semanticKey);
  const specialEntry: ReferenceCatalogEntry = {
    id: `${seed.idPrefix}-${variantNumber + 1}`,
    section: seed.section,
    category: seed.category,
    name: symbolSpecialEntry.name,
    nameZh: symbolSpecialEntry.nameZh,
    licenseId: seed.licenseId,
    searchTerms: [...symbolSpecialEntry.searchTerms, symbolSpecialEntry.semanticKey],
    svgParts: symbolSpecialEntry.svgParts.map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
    symbolSemanticKey: symbolSpecialEntry.semanticKey,
  };
  assertReferenceCatalogEntry(specialEntry);
  const entries = [...motifEntries, specialEntry];

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete symbol motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createCrownCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = crownMotifRecords.length * crownVariantIds.length + 1;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid crown motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const motifEntries = crownMotifRecords.flatMap((motif) => crownVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = crownVariantRecords[variantId];
    const crownSemanticKey = `crown-${motif.key}-${variantId}`;
    if (semanticKeys.has(crownSemanticKey)) {
      throw new Error(`Duplicate crown catalog semantic key: ${crownSemanticKey}`);
    }
    semanticKeys.add(crownSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatCrownCatalogName(motif, variant),
      nameZh: formatCrownCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        crownSemanticKey,
      ],
      svgParts: [
        ...crownMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createCrownVariantSvgParts(variant),
      ],
      crownSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (semanticKeys.has(crownSpecialEntry.semanticKey)) {
    throw new Error(`Duplicate crown catalog semantic key: ${crownSpecialEntry.semanticKey}`);
  }
  semanticKeys.add(crownSpecialEntry.semanticKey);
  const specialEntry: ReferenceCatalogEntry = {
    id: `${seed.idPrefix}-${variantNumber + 1}`,
    section: seed.section,
    category: seed.category,
    name: crownSpecialEntry.name,
    nameZh: crownSpecialEntry.nameZh,
    licenseId: seed.licenseId,
    searchTerms: [...crownSpecialEntry.searchTerms, crownSpecialEntry.semanticKey],
    svgParts: crownSpecialEntry.svgParts.map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
    crownSemanticKey: crownSpecialEntry.semanticKey,
  };
  assertReferenceCatalogEntry(specialEntry);
  const entries = [...motifEntries, specialEntry];

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete crown motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createMantleCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = mantleMotifRecords.length * mantleVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid mantle motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = mantleMotifRecords.flatMap((motif) => mantleVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = mantleVariantRecords[variantId];
    const mantleSemanticKey = `mantle-${motif.key}-${variantId}`;
    if (semanticKeys.has(mantleSemanticKey)) {
      throw new Error(`Duplicate mantle catalog semantic key: ${mantleSemanticKey}`);
    }
    semanticKeys.add(mantleSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatMantleCatalogName(motif, variant),
      nameZh: formatMantleCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        mantleSemanticKey,
      ],
      svgParts: [
        ...mantleMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createMantleVariantSvgParts(variant),
      ],
      mantleSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete mantle motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createSupporterCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = supporterMotifRecords.length * supporterVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid supporter motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = supporterMotifRecords.flatMap((motif) => supporterVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = supporterVariantRecords[variantId];
    const supporterSemanticKey = `supporter-${motif.key}-${variantId}`;
    if (semanticKeys.has(supporterSemanticKey)) {
      throw new Error(`Duplicate supporter catalog semantic key: ${supporterSemanticKey}`);
    }
    semanticKeys.add(supporterSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatSupporterCatalogName(motif, variant),
      nameZh: formatSupporterCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        supporterSemanticKey,
      ],
      svgParts: [
        ...supporterMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createSupporterVariantSvgParts(variant),
      ],
      supporterSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete supporter motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function createExteriorCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const expectedVariantCount = exteriorMotifRecords.length * exteriorVariantIds.length;
  if (seed.count !== expectedVariantCount) {
    throw new Error(`Invalid exterior motif catalog count: ${seed.count}; expected ${expectedVariantCount}`);
  }

  let variantNumber = 0;
  const semanticKeys = new Set<string>();
  const entries = exteriorMotifRecords.flatMap((motif) => exteriorVariantIds.map((variantId) => {
    variantNumber += 1;
    const variant = exteriorVariantRecords[variantId];
    const exteriorSemanticKey = `exterior-${motif.key}-${variantId}`;
    if (semanticKeys.has(exteriorSemanticKey)) {
      throw new Error(`Duplicate exterior catalog semantic key: ${exteriorSemanticKey}`);
    }
    semanticKeys.add(exteriorSemanticKey);

    const entry: ReferenceCatalogEntry = {
      id: `${seed.idPrefix}-${variantNumber}`,
      section: seed.section,
      category: seed.category,
      name: formatExteriorCatalogName(motif, variant),
      nameZh: formatExteriorCatalogNameZh(motif, variant),
      licenseId: seed.licenseId,
      searchTerms: [
        ...motif.searchTerms,
        ...variant.searchTerms,
        exteriorSemanticKey,
      ],
      svgParts: [
        ...exteriorMotifSvgParts[motif.partId].map((svgPath) => ({ svgPath, sourceColor: '#1F2937' })),
        ...createExteriorVariantSvgParts(variant),
      ],
      exteriorSemanticKey,
    };
    assertReferenceCatalogEntry(entry);
    return entry;
  }));

  if (entries.length !== seed.count || semanticKeys.size !== seed.count) {
    throw new Error(`Incomplete exterior motif catalog: ${entries.length}/${semanticKeys.size}/${seed.count}`);
  }
  return entries;
}

function formatKiteShieldCatalogName(
  motif: KiteShieldMotifRecord,
  variant: (typeof kiteShieldVariantRecords)[KiteShieldVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatKiteShieldCatalogNameZh(
  motif: KiteShieldMotifRecord,
  variant: (typeof kiteShieldVariantRecords)[KiteShieldVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatHeaterShieldCatalogName(
  motif: HeaterShieldMotifRecord,
  variant: (typeof heaterShieldVariantRecords)[HeaterShieldVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatHeaterShieldCatalogNameZh(
  motif: HeaterShieldMotifRecord,
  variant: (typeof heaterShieldVariantRecords)[HeaterShieldVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatFrenchShieldCatalogName(
  motif: FrenchShieldMotifRecord,
  variant: (typeof frenchShieldVariantRecords)[FrenchShieldVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatFrenchShieldCatalogNameZh(
  motif: FrenchShieldMotifRecord,
  variant: (typeof frenchShieldVariantRecords)[FrenchShieldVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatBannerShieldCatalogName(
  motif: BannerShieldMotifRecord,
  variant: (typeof bannerShieldVariantRecords)[BannerShieldVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatBannerShieldCatalogNameZh(
  motif: BannerShieldMotifRecord,
  variant: (typeof bannerShieldVariantRecords)[BannerShieldVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatRoundShieldCatalogName(
  motif: RoundShieldMotifRecord,
  variant: (typeof roundShieldVariantRecords)[RoundShieldVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatRoundShieldCatalogNameZh(
  motif: RoundShieldMotifRecord,
  variant: (typeof roundShieldVariantRecords)[RoundShieldVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatLozengeShieldCatalogName(
  motif: LozengeShieldMotifRecord,
  variant: (typeof lozengeShieldVariantRecords)[LozengeShieldVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatLozengeShieldCatalogNameZh(
  motif: LozengeShieldMotifRecord,
  variant: (typeof lozengeShieldVariantRecords)[LozengeShieldVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatAnimalCatalogName(
  motif: AnimalMotifRecord,
  pose: (typeof animalPoseRecords)[AnimalPoseId],
  ornament: (typeof animalOrnamentRecords)[AnimalOrnamentId],
): string {
  return [ornament.prefix, motif.name, pose.name].filter(Boolean).join(' ');
}

function formatAnimalCatalogNameZh(
  motif: AnimalMotifRecord,
  pose: (typeof animalPoseRecords)[AnimalPoseId],
  ornament: (typeof animalOrnamentRecords)[AnimalOrnamentId],
): string {
  return `${ornament.prefixZh}${pose.nameZh}${motif.nameZh}`;
}

function formatObjectCatalogName(
  motif: ObjectMotifRecord,
  variant: (typeof objectVariantRecords)[ObjectVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatObjectCatalogNameZh(
  motif: ObjectMotifRecord,
  variant: (typeof objectVariantRecords)[ObjectVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatPlantCatalogName(
  motif: PlantMotifRecord,
  variant: (typeof plantVariantRecords)[PlantVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatPlantCatalogNameZh(
  motif: PlantMotifRecord,
  variant: (typeof plantVariantRecords)[PlantVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatHumanCatalogName(
  motif: HumanMotifRecord,
  variant: (typeof humanVariantRecords)[HumanVariantId],
): string {
  return `${variant.prefix} ${motif.name.toLowerCase()}`;
}

function formatHumanCatalogNameZh(
  motif: HumanMotifRecord,
  variant: (typeof humanVariantRecords)[HumanVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatSymbolCatalogName(
  motif: SymbolMotifRecord,
  variant: (typeof symbolVariantRecords)[SymbolVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatSymbolCatalogNameZh(
  motif: SymbolMotifRecord,
  variant: (typeof symbolVariantRecords)[SymbolVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatCrownCatalogName(
  motif: CrownMotifRecord,
  variant: (typeof crownVariantRecords)[CrownVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatCrownCatalogNameZh(
  motif: CrownMotifRecord,
  variant: (typeof crownVariantRecords)[CrownVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatMantleCatalogName(
  motif: MantleMotifRecord,
  variant: (typeof mantleVariantRecords)[MantleVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatMantleCatalogNameZh(
  motif: MantleMotifRecord,
  variant: (typeof mantleVariantRecords)[MantleVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatSupporterCatalogName(
  motif: SupporterMotifRecord,
  variant: (typeof supporterVariantRecords)[SupporterVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatSupporterCatalogNameZh(
  motif: SupporterMotifRecord,
  variant: (typeof supporterVariantRecords)[SupporterVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function formatExteriorCatalogName(
  motif: ExteriorMotifRecord,
  variant: (typeof exteriorVariantRecords)[ExteriorVariantId],
): string {
  return [variant.prefix, motif.name].filter(Boolean).join(' ');
}

function formatExteriorCatalogNameZh(
  motif: ExteriorMotifRecord,
  variant: (typeof exteriorVariantRecords)[ExteriorVariantId],
): string {
  return `${variant.prefixZh}${motif.nameZh}`;
}

function createKiteShieldVariantSvgParts(
  variant: (typeof kiteShieldVariantRecords)[KiteShieldVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createHeaterShieldVariantSvgParts(
  variant: (typeof heaterShieldVariantRecords)[HeaterShieldVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createFrenchShieldVariantSvgParts(
  variant: (typeof frenchShieldVariantRecords)[FrenchShieldVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createBannerShieldVariantSvgParts(
  variant: (typeof bannerShieldVariantRecords)[BannerShieldVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createRoundShieldVariantSvgParts(
  variant: (typeof roundShieldVariantRecords)[RoundShieldVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createLozengeShieldVariantSvgParts(
  variant: (typeof lozengeShieldVariantRecords)[LozengeShieldVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createAnimalOrnamentSvgParts(
  ornament: (typeof animalOrnamentRecords)[AnimalOrnamentId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in ornament)) return [];
  return [{ svgPath: ornament.svgPath, sourceColor: '#1F2937' }];
}

function createObjectVariantSvgParts(
  variant: (typeof objectVariantRecords)[ObjectVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createPlantVariantSvgParts(
  variant: (typeof plantVariantRecords)[PlantVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createHumanVariantSvgParts(
  variant: (typeof humanVariantRecords)[HumanVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createSymbolVariantSvgParts(
  variant: (typeof symbolVariantRecords)[SymbolVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createCrownVariantSvgParts(
  variant: (typeof crownVariantRecords)[CrownVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createMantleVariantSvgParts(
  variant: (typeof mantleVariantRecords)[MantleVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createSupporterVariantSvgParts(
  variant: (typeof supporterVariantRecords)[SupporterVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

function createExteriorVariantSvgParts(
  variant: (typeof exteriorVariantRecords)[ExteriorVariantId],
): readonly CoatSvgPart[] {
  if (!('svgPath' in variant)) return [];
  return [{ svgPath: variant.svgPath, sourceColor: '#1F2937' }];
}

/**
 * Keeps related species visually distinct when they intentionally share a
 * broader body-family silhouette (for example lion, tiger, and leopard).
 */
function createAnimalMotifSignatureSvgPath(motifKey: string): string {
  const points = [...motifKey].map((character, index) => {
    const alphabetOffset = character.charCodeAt(0) - 97;
    return `${18 + index * 6} ${18 + ((alphabetOffset * 7 + index * 11) % 20)}`;
  });
  const firstPoint = points[0];
  if (!firstPoint) throw new Error(`Invalid animal motif key: ${motifKey}`);
  return `M${firstPoint} L${points.slice(1).join(' L')} L${18 + motifKey.length * 6} 42 Z`;
}

function createCatalogEntries(seed: ReferenceCatalogSeed): readonly ReferenceCatalogEntry[] {
  const featuredEntries = seed.featuredEntries ?? [];
  const generatedCount = seed.count - featuredEntries.length;
  if (generatedCount < 0) {
    throw new Error(`Invalid local catalog seed count for ${seed.section}/${seed.category}: ${seed.count}`);
  }

  return [
    ...featuredEntries.map((featuredEntry, index) => createCatalogEntry(seed, featuredEntry, index)),
    ...Array.from({ length: generatedCount }, (_, index) => {
      const variantNumber = index + featuredEntries.length + 1;
      return createCatalogEntry(seed, {
        id: `${seed.idPrefix}-${variantNumber}`,
        name: `${seed.name} ${variantNumber}`,
        nameZh: `${seed.nameZh} ${variantNumber}`,
        searchTerms: seed.searchTerms,
      }, variantNumber - 1);
    }),
  ];
}

function createCatalogEntry(
  seed: ReferenceCatalogSeed,
  variant: ReferenceCatalogFeaturedEntry,
  variantIndex: number,
): ReferenceCatalogEntry {
  const entry: ReferenceCatalogEntry = {
    id: variant.id,
    section: seed.section,
    category: seed.category,
    name: variant.name,
    nameZh: variant.nameZh,
    licenseId: seed.licenseId,
    searchTerms: variant.searchTerms,
    svgParts: [{
      svgPath: createParametricSvgPath(seed.section, seed.category, variantIndex),
      sourceColor: '#1F2937',
    }],
  };
  assertReferenceCatalogEntry(entry);
  return entry;
}

function createParametricSvgPath(
  section: ReferenceCatalogSection,
  category: string,
  variantIndex: number,
): string {
  if (section === 'shield') return createShieldSvgPath(category, variantIndex);
  if (section === 'charge') return createChargeSvgPath(category, variantIndex);
  return createTopSvgPath(category, variantIndex);
}

function createShieldSvgPath(category: string, variantIndex: number): string {
  const serial = variantIndex + 1;
  const edgeInset = serial * 0.12;
  const pointShift = ((serial % 9) - 4) * 0.45;
  const lowerPoint = 108 - ((serial % 7) * 0.7);

  if (category === 'shield') {
    return `M${50 + pointShift} ${2 + (serial % 4) * 0.35} L${86 - edgeInset} ${18 + (serial % 5)} V${55 + (serial % 8)} C${86 - edgeInset} ${81 - (serial % 6)} ${69 - edgeInset / 2} ${97 - (serial % 5)} 50 ${lowerPoint} C${31 + edgeInset / 2} ${97 - (serial % 5)} ${14 + edgeInset} ${81 - (serial % 6)} ${14 + edgeInset} ${55 + (serial % 8)} V${18 + (serial % 5)} Z`;
  }
  if (category === 'heater') {
    return `M${50 + pointShift} ${2 + (serial % 5) * 0.28} L${94 - edgeInset} ${16 + (serial % 7) * 0.7} V${58 + (serial % 7)} C${94 - edgeInset} ${80 - (serial % 5)} ${76 - edgeInset / 2} ${94 - (serial % 6)} 50 ${lowerPoint} C${24 + edgeInset / 2} ${94 - (serial % 6)} ${6 + edgeInset} ${80 - (serial % 5)} ${6 + edgeInset} ${58 + (serial % 7)} V${16 + (serial % 7) * 0.7} Z`;
  }
  if (category === 'french') {
    return `M${50 + pointShift} ${3 + (serial % 4) * 0.3} C${76 - edgeInset / 2} ${3 + (serial % 4) * 0.3} ${93 - edgeInset} ${14 + (serial % 7)} ${93 - edgeInset} ${35 + (serial % 8)} V${58 + (serial % 5)} C${93 - edgeInset} ${77 - (serial % 6)} ${78 - edgeInset / 2} ${92 - (serial % 7)} 50 ${lowerPoint} C${22 + edgeInset / 2} ${92 - (serial % 7)} ${7 + edgeInset} ${77 - (serial % 6)} ${7 + edgeInset} ${58 + (serial % 5)} V${35 + (serial % 8)} C${7 + edgeInset} ${14 + (serial % 7)} ${24 + edgeInset / 2} ${3 + (serial % 4) * 0.3} ${50 + pointShift} ${3 + (serial % 4) * 0.3} Z`;
  }
  if (category === 'banner') {
    const notchDepth = 7 + (serial % 12) * 0.55;
    return `M${8 + edgeInset / 2} ${8 + (serial % 5)} H${92 - edgeInset / 2} V${91 - (serial % 6)} L${76 - edgeInset / 3} ${102 - notchDepth} L60 ${91 - (serial % 6)} L44 ${102 - notchDepth} L${28 + edgeInset / 3} ${91 - (serial % 6)} L${8 + edgeInset / 2} ${102 - notchDepth} Z`;
  }
  if (category === 'round') {
    return `M${50 + pointShift} ${3 + (serial % 5) * 0.35} C${76 - edgeInset / 2} ${3 + (serial % 5) * 0.35} ${96 - edgeInset} ${21 + (serial % 6)} ${96 - edgeInset} ${45 + (serial % 7)} C${96 - edgeInset} ${77 - (serial % 5)} ${72 - edgeInset / 2} ${96 - (serial % 5)} 50 ${lowerPoint} C${28 + edgeInset / 2} ${96 - (serial % 5)} ${4 + edgeInset} ${77 - (serial % 5)} ${4 + edgeInset} ${45 + (serial % 7)} C${4 + edgeInset} ${21 + (serial % 6)} ${24 + edgeInset / 2} ${3 + (serial % 5) * 0.35} ${50 + pointShift} ${3 + (serial % 5) * 0.35} Z`;
  }
  if (category === 'lozenge') {
    return `M${50 + pointShift} ${2 + (serial % 6) * 0.5} L${96 - edgeInset} ${55 + (serial % 9) * 0.35} L${50 - pointShift} ${108 - (serial % 7) * 0.65} L${4 + edgeInset} ${55 - (serial % 9) * 0.35} Z`;
  }
  throw new Error(`Invalid reference shield category: ${category}`);
}

function createChargeSvgPath(category: string, variantIndex: number): string {
  const serialOffset = (variantIndex + 1) / 100;
  const radius = 17 + ((variantIndex * 7) % 18) + serialOffset;
  const innerRadius = 6 + ((variantIndex * 11) % 9) + serialOffset / 3;
  const left = 50 - radius;
  const right = 50 + radius;
  const top = 50 - radius;
  const bottom = 50 + radius;

  if (category === 'animal') {
    return `M50 ${top} C${right} ${top} ${right + 7} 43 ${right - 2} 56 C${right - 5} ${bottom - 2} 66 ${bottom} 50 ${bottom} C34 ${bottom} ${left + 5} ${bottom - 2} ${left + 2} 56 C${left - 7} 43 ${left} ${top} 50 ${top} Z M${50 - innerRadius} 44 L50 ${31 + (variantIndex % 12)} L${50 + innerRadius} 44 L${50 + innerRadius - 3} 62 H${50 - innerRadius + 3} Z`;
  }
  return `M50 ${top} L${50 + innerRadius} ${50 - innerRadius} L${right} 50 L${50 + innerRadius} ${50 + innerRadius} L50 ${bottom} L${50 - innerRadius} ${50 + innerRadius} L${left} 50 L${50 - innerRadius} ${50 - innerRadius} Z`;
}

function createTopSvgPath(category: string, variantIndex: number): string {
  const serialOffset = (variantIndex + 1) / 100;
  const inset = 14 + ((variantIndex * 5) % 12) + serialOffset;

  return `M${inset} 48 C${inset} 30 34 28 41 42 C46 34 54 34 59 42 C66 28 ${100 - inset} 30 ${100 - inset} 48 C${100 - inset} 64 66 64 59 52 C54 60 46 60 41 52 C34 64 ${inset} 64 ${inset} 48 Z M24 70 C39 78 61 78 76 70 L82 82 C63 94 37 94 18 82 Z`;
}

function isReferenceCatalogSection(value: unknown): value is ReferenceCatalogSection {
  return typeof value === 'string'
    && isLocalReferenceValue(value)
    && (value === 'shield' || value === 'charge' || value === 'top');
}

function isReferenceCatalogLicenseId(value: unknown): value is ReferenceCatalogLicenseId {
  return typeof value === 'string'
    && isLocalReferenceValue(value)
    && referenceCatalogLicenseRecords.some((record) => record.id === value);
}

function isKiteShieldSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^shield-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && kiteShieldCatalogSemanticKeys.has(value);
}

function isHeaterShieldSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^heater-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && heaterCatalogSemanticKeys.has(value);
}

function isFrenchShieldSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^french-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && frenchCatalogSemanticKeys.has(value);
}

function isBannerShieldSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^banner-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && bannerCatalogSemanticKeys.has(value);
}

function isRoundShieldSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^round-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && roundCatalogSemanticKeys.has(value);
}

function isLozengeShieldSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^lozenge-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && lozengeCatalogSemanticKeys.has(value);
}

function isAnimalSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^[a-z]+(?:-[a-z0-9]+){2,}$/.test(value)
    && isLocalReferenceValue(value)
    && animalCatalogSemanticKeys.has(value);
}

function isObjectSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^object-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && objectCatalogSemanticKeys.has(value);
}

function isPlantSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^plant-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && plantCatalogSemanticKeys.has(value);
}

function isHumanSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^human-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && humanCatalogSemanticKeys.has(value);
}

function isSymbolSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^symbol-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && symbolCatalogSemanticKeys.has(value);
}

function isCrownSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^crown-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && crownCatalogSemanticKeys.has(value);
}

function isMantleSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^mantle-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && mantleCatalogSemanticKeys.has(value);
}

function isSupporterSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^supporter-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && supporterCatalogSemanticKeys.has(value);
}

function isExteriorSemanticKey(value: unknown): value is string {
  return typeof value === 'string'
    && /^exterior-[a-z]+-[a-z]+$/.test(value)
    && isLocalReferenceValue(value)
    && exteriorCatalogSemanticKeys.has(value);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => (
    typeof item === 'string' && isLocalReferenceValue(item)
  ));
}

function isLocalSvgParts(value: unknown): value is readonly CoatSvgPart[] {
  return Array.isArray(value) && value.length > 0 && value.every((part) => (
    !!part
    && typeof part === 'object'
    && hasExactKeys(part, referenceCatalogSvgPartKeys)
    && 'svgPath' in part
    && typeof part.svgPath === 'string'
    && part.svgPath.startsWith('M')
    && isLocalReferenceValue(part.svgPath)
    && 'sourceColor' in part
    && typeof part.sourceColor === 'string'
    && isLocalReferenceValue(part.sourceColor)
  ));
}

function hasExactKeys(value: object, expectedKeys: readonly string[]): boolean {
  const ownKeys = Reflect.ownKeys(value);
  return ownKeys.length === expectedKeys.length && expectedKeys.every((key) => ownKeys.includes(key));
}

function isLocalReferenceValue(value: string): boolean {
  return !remoteReferencePattern.test(value);
}
