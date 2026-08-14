export type ReferenceCatalogSection = 'shield' | 'charge' | 'top';

export const shieldReferenceCategories = ['shield', 'heater', 'french', 'banner', 'round', 'lozenge'] as const;
export type ShieldReferenceCategory = (typeof shieldReferenceCategories)[number];

export interface ReferenceCatalogEntry {
  readonly id: string;
  readonly section: 'shield';
  readonly category: ShieldReferenceCategory;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  /** Browser-local authored SVG, used for the card preview and selected shield. */
  readonly staticImageSrc: string;
  /** Keeps charge clipping compatible with the six existing shield families. */
  readonly svgPath: string;
}

interface ShieldMaterialCategoryRecord {
  readonly category: ShieldReferenceCategory;
  readonly count: number;
  readonly idPrefix: string;
  readonly folder: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly svgPath: string;
}

const shieldMaterialCategoryRecords: readonly ShieldMaterialCategoryRecord[] = [
  { category: 'shield', count: 111, idPrefix: 'shield', folder: 'shield', name: 'Shield material', nameZh: '盾牌素材', searchTerms: ['shield', 'kite', '纹章盾'], svgPath: 'M50 2 L86 18 V55 C86 81 69 97 50 108 C31 97 14 81 14 55 V18 Z' },
  { category: 'heater', count: 24, idPrefix: 'heater', folder: 'heater', name: 'Heater shield material', nameZh: '熨斗盾素材', searchTerms: ['shield', 'heater', '熨斗盾'], svgPath: 'M50 2 L94 16 V58 C94 80 76 94 50 108 C24 94 6 80 6 58 V16 Z' },
  { category: 'french', count: 36, idPrefix: 'french', folder: 'french', name: 'French shield material', nameZh: '法式盾素材', searchTerms: ['shield', 'french', '法式盾'], svgPath: 'M50 3 C76 3 93 14 93 35 V58 C93 77 78 92 50 108 C22 92 7 77 7 58 V35 C7 14 24 3 50 3 Z' },
  { category: 'banner', count: 32, idPrefix: 'banner', folder: 'banner', name: 'Banner shield material', nameZh: '旗帜盾素材', searchTerms: ['shield', 'banner', '旗帜盾'], svgPath: 'M8 8 H92 V91 L76 102 L60 91 L44 102 L28 91 L8 102 Z' },
  { category: 'round', count: 19, idPrefix: 'round', folder: 'round', name: 'Round shield material', nameZh: '圆盾素材', searchTerms: ['shield', 'round', '圆盾'], svgPath: 'M50 3 C76 3 96 21 96 45 C96 77 72 96 50 108 C28 96 4 77 4 45 C4 21 24 3 50 3 Z' },
  { category: 'lozenge', count: 12, idPrefix: 'lozenge', folder: 'lozenge', name: 'Lozenge shield material', nameZh: '菱形盾素材', searchTerms: ['shield', 'lozenge', '菱形盾'], svgPath: 'M50 2 L96 55 L50 108 L4 55 Z' },
];

const referenceCatalogEntries: readonly ReferenceCatalogEntry[] = shieldMaterialCategoryRecords.flatMap((record) => (
  Array.from({ length: record.count }, (_, index) => {
    const number = String(index + 1).padStart(3, '0');
    const id = `${record.idPrefix}-${number}`;
    return {
      id,
      section: 'shield',
      category: record.category,
      name: `${record.name} ${number}`,
      nameZh: `${record.nameZh} ${number}`,
      searchTerms: [...record.searchTerms, id],
      staticImageSrc: `/coat-assets/materials/shields/${record.folder}/${id}.svg`,
      svgPath: record.svgPath,
    };
  })
));

const referenceCatalogCategoriesBySection: Readonly<Record<ReferenceCatalogSection, readonly string[]>> = {
  shield: shieldReferenceCategories,
  charge: [],
  top: [],
};

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
  return referenceCatalogEntries
    .filter((entry) => entry.section === section && entry.category === category)
    .map((entry) => ({ ...entry, searchTerms: [...entry.searchTerms] }));
}

function isReferenceCatalogSection(value: unknown): value is ReferenceCatalogSection {
  return value === 'shield' || value === 'charge' || value === 'top';
}
