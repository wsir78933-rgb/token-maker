import { listArmyAnimalIconsPart1 } from '@/lib/army-formation/icons/animals-1';
import { listArmyAnimalIconsPart2 } from '@/lib/army-formation/icons/animals-2';
import { listArmyHelmetIcons } from '@/lib/army-formation/icons/helmets';
import { listArmyNatoIconsPart1 } from '@/lib/army-formation/icons/nato-1';
import { listArmyNatoIconsPart2 } from '@/lib/army-formation/icons/nato-2';
import { listArmyNatoIconsPart3 } from '@/lib/army-formation/icons/nato-3';
import { listArmyVehicleIcons } from '@/lib/army-formation/icons/vehicles';
import { listArmyWeaponIcons } from '@/lib/army-formation/icons/weapons';

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
  const helmetIcons = collectCategoryIcons('helmet', listArmyHelmetIcons());
  const weaponIcons = collectCategoryIcons('weapon', listArmyWeaponIcons());
  const animalIcons = collectCategoryIcons('animal', [
    ...listArmyAnimalIconsPart1(),
    ...listArmyAnimalIconsPart2(),
  ]);
  const vehicleIcons = collectCategoryIcons('vehicle', listArmyVehicleIcons());
  const natoIcons = collectCategoryIcons('nato', [
    ...listArmyNatoIconsPart1(),
    ...listArmyNatoIconsPart2(),
    ...listArmyNatoIconsPart3(),
  ]);
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
