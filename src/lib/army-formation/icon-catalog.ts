export const ARMY_FORMATION_ICON_CATEGORY_IDS = [
  'helmet',
  'weapon',
  'animal',
  'vehicle',
  'nato',
] as const;

export const ARMY_FORMATION_ICON_TOTAL_COUNT = 292;

export type ArmyFormationIconCategoryId = (typeof ARMY_FORMATION_ICON_CATEGORY_IDS)[number];

export type ArmyFormationCatalogIcon = {
  id: string;
  categoryId: ArmyFormationIconCategoryId;
  svgMarkup: string;
};

const ARMY_FORMATION_ICON_CATEGORY_COUNTS: Record<ArmyFormationIconCategoryId, number> = {
  helmet: 39,
  weapon: 23,
  animal: 60,
  vehicle: 26,
  nato: 144,
};

const ARMY_FORMATION_ASSET_ROOT = '/army-formation-icons/roll-for-fantasy';
const ARMY_FORMATION_ICON_WIDTH = 50;
const ARMY_FORMATION_ICON_HEIGHT = 30;

type SourceArmyFormationIcon = {
  id: string;
  svgMarkup: string;
};

type BuiltArmyFormationIconCatalog = {
  icons: readonly ArmyFormationCatalogIcon[];
  byCategory: ReadonlyMap<ArmyFormationIconCategoryId, readonly ArmyFormationCatalogIcon[]>;
  byId: ReadonlyMap<string, ArmyFormationCatalogIcon>;
};

let builtCatalog: BuiltArmyFormationIconCatalog | null = null;

function isArmyFormationIconCategoryId(categoryId: string): categoryId is ArmyFormationIconCategoryId {
  return ARMY_FORMATION_ICON_CATEGORY_IDS.some((candidate) => candidate === categoryId);
}

function requireArmyFormationIconCategoryId(categoryId: string): ArmyFormationIconCategoryId {
  if (isArmyFormationIconCategoryId(categoryId)) {
    return categoryId;
  }

  throw new Error(`Unknown army formation icon category: ${JSON.stringify(categoryId)}`);
}

function assertCategoryCountSum(): void {
  let sum = 0;
  for (const categoryId of ARMY_FORMATION_ICON_CATEGORY_IDS) {
    sum += ARMY_FORMATION_ICON_CATEGORY_COUNTS[categoryId];
  }

  if (sum !== ARMY_FORMATION_ICON_TOTAL_COUNT) {
    throw new Error(
      `Army formation icon category counts must add up to ${ARMY_FORMATION_ICON_TOTAL_COUNT}, received ${sum}.`,
    );
  }
}

function formatAssetNumber(value: number, width: number): string {
  return String(value).padStart(width, '0');
}

function assetSvgMarkup(filename: string): string {
  return `<svg width="${ARMY_FORMATION_ICON_WIDTH}" height="${ARMY_FORMATION_ICON_HEIGHT}" viewBox="0 0 ${ARMY_FORMATION_ICON_WIDTH} ${ARMY_FORMATION_ICON_HEIGHT}"><image href="${ARMY_FORMATION_ASSET_ROOT}/${filename}" x="0" y="0" width="${ARMY_FORMATION_ICON_WIDTH}" height="${ARMY_FORMATION_ICON_HEIGHT}" preserveAspectRatio="none"/></svg>`;
}

function buildIndexedAssetIcons(
  categoryId: Exclude<ArmyFormationIconCategoryId, 'animal' | 'nato'>,
  assetPrefix: string,
  count: number,
): SourceArmyFormationIcon[] {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const idPrefix = categoryId === 'helmet' ? 'helmet' : categoryId === 'weapon' ? 'weapon' : 'vehicle';
    const id = `${idPrefix}-${formatAssetNumber(number, 2)}`;
    return {
      id,
      svgMarkup: assetSvgMarkup(`${assetPrefix}${number}.png`),
    };
  });
}

function buildAnimalAssetIcons(): SourceArmyFormationIcon[] {
  return Array.from({ length: ARMY_FORMATION_ICON_CATEGORY_COUNTS.animal }, (_, index) => {
    const number = index + 1;
    const assetPrefix = number <= 36 ? 'animal' : 'ani';
    return {
      id: `animal-${formatAssetNumber(number, 2)}`,
      svgMarkup: assetSvgMarkup(`${assetPrefix}${number}.png`),
    };
  });
}

function buildNatoAssetIcons(): SourceArmyFormationIcon[] {
  const groups = [
    { assetPrefix: 'nfr', firstIconNumber: 1 },
    { assetPrefix: 'nhs', firstIconNumber: 37 },
    { assetPrefix: 'nnt', firstIconNumber: 73 },
    { assetPrefix: 'nun', firstIconNumber: 109 },
  ] as const;

  return groups.flatMap(({ assetPrefix, firstIconNumber }) =>
    Array.from({ length: 36 }, (_, index) => {
      const iconNumber = firstIconNumber + index;
      return {
        id: `nato-${formatAssetNumber(iconNumber, 3)}`,
        svgMarkup: assetSvgMarkup(`${assetPrefix}${index + 1}.png`),
      };
    }),
  );
}

function toCatalogIcon(
  categoryId: ArmyFormationIconCategoryId,
  sourceIcon: SourceArmyFormationIcon,
): ArmyFormationCatalogIcon {
  if (typeof sourceIcon.id !== 'string' || sourceIcon.id.length === 0) {
    throw new Error(
      `Army formation icon id must be a non-empty string, received ${JSON.stringify(sourceIcon.id)}.`,
    );
  }

  if (typeof sourceIcon.svgMarkup !== 'string' || sourceIcon.svgMarkup.trim().length === 0) {
    throw new Error(
      `Army formation icon ${JSON.stringify(sourceIcon.id)} has empty svg markup.`,
    );
  }

  return Object.freeze({
    id: sourceIcon.id,
    categoryId,
    svgMarkup: sourceIcon.svgMarkup,
  });
}

function assertCategoryCount(
  categoryId: ArmyFormationIconCategoryId,
  icons: readonly ArmyFormationCatalogIcon[],
): void {
  const expectedCount = ARMY_FORMATION_ICON_CATEGORY_COUNTS[categoryId];
  if (icons.length !== expectedCount) {
    throw new Error(
      `Army formation ${categoryId} icon count must be ${expectedCount}, received ${icons.length}.`,
    );
  }
}

function collectCategoryIcons(
  categoryId: ArmyFormationIconCategoryId,
  sourceIcons: readonly SourceArmyFormationIcon[],
): readonly ArmyFormationCatalogIcon[] {
  const icons = sourceIcons.map((sourceIcon) => toCatalogIcon(categoryId, sourceIcon));
  assertCategoryCount(categoryId, icons);
  return Object.freeze(icons);
}

function assertCatalogTotal(icons: readonly ArmyFormationCatalogIcon[]): void {
  if (icons.length !== ARMY_FORMATION_ICON_TOTAL_COUNT) {
    throw new Error(
      `Army formation icon catalog must contain ${ARMY_FORMATION_ICON_TOTAL_COUNT} icons, received ${icons.length}.`,
    );
  }
}

function assertUniqueCatalogIds(icons: readonly ArmyFormationCatalogIcon[]): void {
  const seenIds = new Set<string>();
  for (const icon of icons) {
    if (seenIds.has(icon.id)) {
      throw new Error(`Army formation icon id ${JSON.stringify(icon.id)} already exists.`);
    }

    seenIds.add(icon.id);
  }
}

function buildCategoryMap(
  helmetIcons: readonly ArmyFormationCatalogIcon[],
  weaponIcons: readonly ArmyFormationCatalogIcon[],
  animalIcons: readonly ArmyFormationCatalogIcon[],
  vehicleIcons: readonly ArmyFormationCatalogIcon[],
  natoIcons: readonly ArmyFormationCatalogIcon[],
): ReadonlyMap<ArmyFormationIconCategoryId, readonly ArmyFormationCatalogIcon[]> {
  return new Map<ArmyFormationIconCategoryId, readonly ArmyFormationCatalogIcon[]>([
    ['helmet', helmetIcons],
    ['weapon', weaponIcons],
    ['animal', animalIcons],
    ['vehicle', vehicleIcons],
    ['nato', natoIcons],
  ]);
}

function buildIconIdMap(
  icons: readonly ArmyFormationCatalogIcon[],
): ReadonlyMap<string, ArmyFormationCatalogIcon> {
  const byId = new Map<string, ArmyFormationCatalogIcon>();
  for (const icon of icons) {
    byId.set(icon.id, icon);
  }

  return byId;
}

function buildArmyFormationIconCatalog(): BuiltArmyFormationIconCatalog {
  assertCategoryCountSum();
  const helmetIcons = collectCategoryIcons(
    'helmet',
    buildIndexedAssetIcons('helmet', 'helm', ARMY_FORMATION_ICON_CATEGORY_COUNTS.helmet),
  );
  const weaponIcons = collectCategoryIcons(
    'weapon',
    buildIndexedAssetIcons('weapon', 'wep', ARMY_FORMATION_ICON_CATEGORY_COUNTS.weapon),
  );
  const animalIcons = collectCategoryIcons('animal', buildAnimalAssetIcons());
  const vehicleIcons = collectCategoryIcons(
    'vehicle',
    buildIndexedAssetIcons('vehicle', 'siege', ARMY_FORMATION_ICON_CATEGORY_COUNTS.vehicle),
  );
  const natoIcons = collectCategoryIcons('nato', buildNatoAssetIcons());
  const icons = Object.freeze([
    ...helmetIcons,
    ...weaponIcons,
    ...animalIcons,
    ...vehicleIcons,
    ...natoIcons,
  ]);
  assertCatalogTotal(icons);
  assertUniqueCatalogIds(icons);

  return {
    icons,
    byCategory: buildCategoryMap(helmetIcons, weaponIcons, animalIcons, vehicleIcons, natoIcons),
    byId: buildIconIdMap(icons),
  };
}

function loadArmyFormationIconCatalog(): BuiltArmyFormationIconCatalog {
  if (builtCatalog === null) {
    builtCatalog = buildArmyFormationIconCatalog();
  }

  return builtCatalog;
}

export function listArmyFormationIconCategories(): readonly ArmyFormationIconCategoryId[] {
  return ARMY_FORMATION_ICON_CATEGORY_IDS;
}

export function listArmyFormationIconsInCategory(
  categoryId: string,
): readonly ArmyFormationCatalogIcon[] {
  const validatedCategoryId = requireArmyFormationIconCategoryId(categoryId);
  const icons = loadArmyFormationIconCatalog().byCategory.get(validatedCategoryId);
  if (icons === undefined) {
    throw new Error(
      `Army formation icon category ${JSON.stringify(validatedCategoryId)} is missing from the catalog.`,
    );
  }

  return icons;
}

export function listArmyFormationIconCatalog(): readonly ArmyFormationCatalogIcon[] {
  return loadArmyFormationIconCatalog().icons;
}

export function requireArmyFormationCatalogIcon(iconId: string): ArmyFormationCatalogIcon {
  if (typeof iconId !== 'string' || iconId.length === 0) {
    throw new Error(`Icon id must be a non-empty string, received ${JSON.stringify(iconId)}.`);
  }

  const icon = loadArmyFormationIconCatalog().byId.get(iconId);
  if (icon === undefined) {
    throw new Error(`Army formation icon id ${JSON.stringify(iconId)} was not found.`);
  }

  return icon;
}
