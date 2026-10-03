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
  { category: 'shield', count: 111, idPrefix: 'shield', folder: 'shield', name: 'Shield material', nameZh: '盾牌素材', searchTerms: ['shield', 'kite', '纹章盾'], svgPath: 'M 50 8.642857 Q 67.285714 14.535714 86.142857 18.857143 L 85.357143 53.035714 C 84.571429 75.428571 71.214286 90.75 50 100.571429 C 28.785714 90.75 15.428571 75.428571 14.642857 53.035714 L 13.857143 18.857143 Q 32.714286 14.535714 50 8.642857 Z' },
  { category: 'heater', count: 24, idPrefix: 'heater', folder: 'heater', name: 'Heater shield material', nameZh: '熨斗盾素材', searchTerms: ['shield', 'heater', '熨斗盾'], svgPath: 'M 13.857143 9.428571 H 86.142857 V 45.964286 C 86.142857 70.321429 70.428571 86.821429 50 102.142857 C 29.571429 86.821429 13.857143 70.321429 13.857143 45.964286 Z' },
  { category: 'french', count: 36, idPrefix: 'french', folder: 'french', name: 'French shield material', nameZh: '法式盾素材', searchTerms: ['shield', 'french', '法式盾'], svgPath: 'M 12.285714 9.428571 H 87.714286 V 76.214286 Q 87.714286 88.785714 75.928571 88.785714 H 61 Q 54.714286 88.785714 50 98.214286 Q 45.285714 88.785714 39 88.785714 H 24.071429 Q 12.285714 88.785714 12.285714 76.214286 Z' },
  { category: 'banner', count: 32, idPrefix: 'banner', folder: 'banner', name: 'Banner shield material', nameZh: '旗帜盾素材', searchTerms: ['shield', 'banner', '旗帜盾'], svgPath: 'M 16.214286 9.428571 H 83.785714 V 101.357143 L 50 80.928571 L 16.214286 101.357143 Z' },
  { category: 'round', count: 19, idPrefix: 'round', folder: 'round', name: 'Round shield material', nameZh: '圆盾素材', searchTerms: ['shield', 'round', '圆盾'], svgPath: 'M 50 15.714286 A 39.285714 39.285714 0 1 0 50 94.285714 A 39.285714 39.285714 0 1 0 50 15.714286 Z' },
  { category: 'lozenge', count: 12, idPrefix: 'lozenge', folder: 'lozenge', name: 'Lozenge shield material', nameZh: '菱形盾素材', searchTerms: ['shield', 'lozenge', '菱形盾'], svgPath: 'M 50 7.071429 L 87.714286 55 L 50 102.928571 L 12.285714 55 Z' },
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
