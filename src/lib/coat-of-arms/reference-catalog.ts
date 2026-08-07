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

const referenceCatalogEntries = referenceCatalogSeeds.flatMap((seed) => {
  if (seed.section !== 'shield') {
    throw new Error('Invalid reference catalog seed section: ' + seed.section);
  }
  if (seed.category === 'shield') return createKiteShieldCatalogEntries(seed);
  if (seed.category === 'heater') return createHeaterShieldCatalogEntries(seed);
  if (seed.category === 'french') return createFrenchShieldCatalogEntries(seed);
  if (seed.category === 'banner') return createBannerShieldCatalogEntries(seed);
  if (seed.category === 'round') return createRoundShieldCatalogEntries(seed);
  if (seed.category === 'lozenge') return createLozengeShieldCatalogEntries(seed);
  throw new Error('Invalid reference shield category: ' + seed.category);
});

const referenceCatalogCategoriesBySection: Readonly<Record<ReferenceCatalogSection, readonly string[]>> = {
  shield: shieldReferenceCategories,
  charge: [],
  top: [],
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
    throw new Error('Invalid local catalog entry: ' + String(entry));
  }
  if ('sourceUrl' in entry) {
    throw new Error('Invalid local catalog source: ' + JSON.stringify(entry));
  }

  const isKiteShieldCatalogEntry = 'section' in entry && entry.section === 'shield' && 'category' in entry && entry.category === 'shield';
  const isHeaterShieldCatalogEntry = 'section' in entry && entry.section === 'shield' && 'category' in entry && entry.category === 'heater';
  const isFrenchShieldCatalogEntry = 'section' in entry && entry.section === 'shield' && 'category' in entry && entry.category === 'french';
  const isBannerShieldCatalogEntry = 'section' in entry && entry.section === 'shield' && 'category' in entry && entry.category === 'banner';
  const isRoundShieldCatalogEntry = 'section' in entry && entry.section === 'shield' && 'category' in entry && entry.category === 'round';
  const isLozengeShieldCatalogEntry = 'section' in entry && entry.section === 'shield' && 'category' in entry && entry.category === 'lozenge';
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
    assertShieldSemanticKey(entry, isKiteShieldCatalogEntry, isHeaterShieldCatalogEntry, isFrenchShieldCatalogEntry, isBannerShieldCatalogEntry, isRoundShieldCatalogEntry, isLozengeShieldCatalogEntry);
    throw new Error('Invalid local catalog entry: ' + JSON.stringify(entry));
  }
  if (!('licenseId' in entry) || !isReferenceCatalogLicenseId(entry.licenseId)) {
    throw new Error('Invalid local catalog license: ' + JSON.stringify(entry));
  }
  assertShieldSemanticKey(entry, isKiteShieldCatalogEntry, isHeaterShieldCatalogEntry, isFrenchShieldCatalogEntry, isBannerShieldCatalogEntry, isRoundShieldCatalogEntry, isLozengeShieldCatalogEntry);
}

function assertShieldSemanticKey(
  entry: object,
  isKiteShieldCatalogEntry: boolean,
  isHeaterShieldCatalogEntry: boolean,
  isFrenchShieldCatalogEntry: boolean,
  isBannerShieldCatalogEntry: boolean,
  isRoundShieldCatalogEntry: boolean,
  isLozengeShieldCatalogEntry: boolean,
): void {
  if (isKiteShieldCatalogEntry && (!('shieldSemanticKey' in entry) || !isKiteShieldSemanticKey(entry.shieldSemanticKey))) {
    throw new Error('Invalid local catalog shield semantic key: ' + JSON.stringify(entry));
  }
  if (isHeaterShieldCatalogEntry && (!('heaterSemanticKey' in entry) || !isHeaterShieldSemanticKey(entry.heaterSemanticKey))) {
    throw new Error('Invalid local catalog heater semantic key: ' + JSON.stringify(entry));
  }
  if (isFrenchShieldCatalogEntry && (!('frenchSemanticKey' in entry) || !isFrenchShieldSemanticKey(entry.frenchSemanticKey))) {
    throw new Error('Invalid local catalog French semantic key: ' + JSON.stringify(entry));
  }
  if (isBannerShieldCatalogEntry && (!('bannerSemanticKey' in entry) || !isBannerShieldSemanticKey(entry.bannerSemanticKey))) {
    throw new Error('Invalid local catalog Banner semantic key: ' + JSON.stringify(entry));
  }
  if (isRoundShieldCatalogEntry && (!('roundSemanticKey' in entry) || !isRoundShieldSemanticKey(entry.roundSemanticKey))) {
    throw new Error('Invalid local catalog Round semantic key: ' + JSON.stringify(entry));
  }
  if (isLozengeShieldCatalogEntry && (!('lozengeSemanticKey' in entry) || !isLozengeShieldSemanticKey(entry.lozengeSemanticKey))) {
    throw new Error('Invalid local catalog Lozenge semantic key: ' + JSON.stringify(entry));
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
