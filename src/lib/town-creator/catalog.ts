import townManifest from '../../../public/town-creator/manifest.json';

import type {
  TownAsset,
  TownAssetVariant,
  TownCategoryId,
  TownMaterial,
} from './types';

export type TownMaterialOption = {
  id: Exclude<TownMaterial, 'neutral'>;
  name: { en: string; zh: string };
};

export type TownCategory = {
  id: TownCategoryId;
  name: { en: string; zh: string };
  base: number;
  appearances: number;
};

const TOWN_MATERIAL_IDS = ['wood', 'stone', 'clay', 'sandstone'] as const;
const TOWN_CATEGORY_IDS = [
  'buildings',
  'defenses',
  'props',
  'roads',
  'terrain',
  'prefabs',
  'nature',
] as const;
const TOWN_RESIZE_MODES = ['regular', 'line', 'tile', 'connector'] as const;
const TOWN_PUBLIC_ROOT = '/town-creator/';

type TownMaterialId = (typeof TOWN_MATERIAL_IDS)[number];
type TownManifestCategoryId = (typeof TOWN_CATEGORY_IDS)[number];
type TownManifestResizeMode = (typeof TOWN_RESIZE_MODES)[number];

const HEX_SHA256_PATTERN = /^[0-9a-f]{64}$/;

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? String(value) : serialized;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `${Object.prototype.toString.call(value)} (${error.message})`;
    }

    throw error;
  }
}

function readPlainObject(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object, received ${describeReceivedValue(value)}.`);
  }

  return value as Record<string, unknown>;
}

function readNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string, received ${describeReceivedValue(value)}.`);
  }

  return value;
}

function readFinitePositiveNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(
      `${label} must be a finite number greater than 0, received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function readIntegerAtLeastZero(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(
      `${label} must be an integer greater than or equal to 0, received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function readTownMaterial(value: unknown, label: string): TownMaterial {
  if (value === 'neutral' || TOWN_MATERIAL_IDS.some((material) => material === value)) {
    return value as TownMaterial;
  }

  throw new Error(`${label} is not a supported town material, received ${describeReceivedValue(value)}.`);
}

function readTownMaterialId(value: unknown, label: string): TownMaterialId {
  if (TOWN_MATERIAL_IDS.some((material) => material === value)) {
    return value as TownMaterialId;
  }

  throw new Error(
    `${label} must be one of ${TOWN_MATERIAL_IDS.join(', ')}, received ${describeReceivedValue(value)}.`,
  );
}

function readTownCategoryId(value: unknown, label: string): TownManifestCategoryId {
  if (TOWN_CATEGORY_IDS.some((category) => category === value)) {
    return value as TownManifestCategoryId;
  }

  throw new Error(
    `${label} is not a supported town category, received ${describeReceivedValue(value)}.`,
  );
}

function readTownResizeMode(value: unknown, label: string): TownManifestResizeMode {
  if (TOWN_RESIZE_MODES.some((mode) => mode === value)) {
    return value as TownManifestResizeMode;
  }

  throw new Error(
    `${label} is not a supported town resize mode, received ${describeReceivedValue(value)}.`,
  );
}

function readBilingualName(value: unknown, label: string): { en: string; zh: string } {
  const name = readPlainObject(value, label);
  return {
    en: readNonEmptyString(name.en, `${label}.en`),
    zh: readNonEmptyString(name.zh, `${label}.zh`),
  };
}

function readPublicAssetPath(value: unknown, label: string): string {
  const relativePath = readNonEmptyString(value, label);

  if (
    relativePath.startsWith('/') ||
    relativePath.includes('..') ||
    relativePath.includes('\\') ||
    !/^(svg|png|thumbs)\/[A-Za-z0-9._/-]+\.(?:svg|png)$/.test(relativePath)
  ) {
    throw new Error(`${label} is not a safe town asset path, received ${describeReceivedValue(value)}.`);
  }

  return `${TOWN_PUBLIC_ROOT}${relativePath}`;
}

function readSha256(value: unknown, label: string): string {
  const hash = readNonEmptyString(value, label);
  if (!HEX_SHA256_PATTERN.test(hash)) {
    throw new Error(`${label} must be a lowercase SHA-256 hex string, received ${describeReceivedValue(value)}.`);
  }

  return hash;
}

function readHashFields(value: Record<string, unknown>, label: string): void {
  readSha256(value.sha256Svg, `${label}.sha256Svg`);
  readSha256(value.sha256Png, `${label}.sha256Png`);
  readSha256(value.sha256Thumbnail, `${label}.sha256Thumbnail`);
}

function readTownAssetVariant(value: unknown, label: string): TownAssetVariant {
  const variant = readPlainObject(value, label);
  const material = readTownMaterial(variant.material, `${label}.material`);

  readHashFields(variant, label);

  return Object.freeze({
    material,
    svg: readPublicAssetPath(variant.svg, `${label}.svg`),
    png: readPublicAssetPath(variant.png, `${label}.png`),
    thumbnail: readPublicAssetPath(variant.thumbnail, `${label}.thumbnail`),
  });
}

function readTownAsset(value: unknown, index: number): TownAsset {
  const label = `Town manifest asset ${index}`;
  const asset = readPlainObject(value, label);
  const id = readNonEmptyString(asset.id, `${label}.id`);
  const category = readTownCategoryId(asset.category, `${label}.category`);
  const name = readBilingualName(asset.name, `${label}.name`);
  const materialsValue = asset.materials;

  if (!Array.isArray(materialsValue)) {
    throw new Error(
      `${label}.materials must be an array, received ${describeReceivedValue(materialsValue)}.`,
    );
  }

  const materials = materialsValue.map((material, materialIndex) =>
    readTownMaterialId(material, `${label}.materials[${materialIndex}]`),
  );

  if (materials.length !== 0 && materials.length !== TOWN_MATERIAL_IDS.length) {
    throw new Error(
      `${label}.materials must contain either 0 or ${TOWN_MATERIAL_IDS.length} entries, received ${materials.length}.`,
    );
  }

  if (new Set(materials).size !== materials.length) {
    throw new Error(`${label}.materials contains duplicate material ids.`);
  }

  if (
    materials.length === TOWN_MATERIAL_IDS.length &&
    TOWN_MATERIAL_IDS.some((material) => !materials.includes(material))
  ) {
    throw new Error(`${label}.materials must contain all supported material ids.`);
  }

  const width = readFinitePositiveNumber(asset.width, `${label}.width`);
  const height = readFinitePositiveNumber(asset.height, `${label}.height`);
  const resizeMode = readTownResizeMode(asset.resizeMode, `${label}.resizeMode`);
  const variantsValue = asset.variants;

  if (!Array.isArray(variantsValue) || variantsValue.length === 0) {
    throw new Error(
      `${label}.variants must be a non-empty array, received ${describeReceivedValue(variantsValue)}.`,
    );
  }

  const variants = variantsValue.map((variant, variantIndex) =>
    readTownAssetVariant(variant, `${label}.variants[${variantIndex}]`),
  );
  const variantMaterials = variants.map((variant) => variant.material);

  if (new Set(variantMaterials).size !== variantMaterials.length) {
    throw new Error(`${label}.variants contains duplicate material ids.`);
  }

  const expectedMaterials: readonly TownMaterial[] =
    materials.length === 0 ? ['neutral'] : materials;
  if (
    variantMaterials.length !== expectedMaterials.length ||
    expectedMaterials.some((material) => !variantMaterials.includes(material))
  ) {
    throw new Error(`${label}.variants materials do not match ${label}.materials.`);
  }

  return Object.freeze({
    id,
    category,
    name: Object.freeze(name),
    materials: Object.freeze([...materials]),
    width,
    height,
    resizeMode,
    variants: Object.freeze(variants),
  });
}

function readManifestMaterials(value: unknown): readonly TownMaterialOption[] {
  if (!Array.isArray(value)) {
    throw new Error(`Town manifest materials must be an array, received ${describeReceivedValue(value)}.`);
  }

  if (value.length !== TOWN_MATERIAL_IDS.length) {
    throw new Error(
      `Town manifest materials must contain ${TOWN_MATERIAL_IDS.length} entries, received ${value.length}.`,
    );
  }

  const materials = value.map((entry, index) => {
    const label = `Town manifest material ${index}`;
    const material = readPlainObject(entry, label);
    const id = readTownMaterialId(material.id, `${label}.id`);
    const name = readBilingualName(material.name, `${label}.name`);
    return Object.freeze({ id, name: Object.freeze(name) });
  });

  if (new Set(materials.map((material) => material.id)).size !== materials.length) {
    throw new Error('Town manifest materials contains duplicate ids.');
  }

  return Object.freeze(materials);
}

function readManifestCategories(value: unknown): readonly TownCategory[] {
  if (!Array.isArray(value)) {
    throw new Error(`Town manifest categories must be an array, received ${describeReceivedValue(value)}.`);
  }

  if (value.length !== TOWN_CATEGORY_IDS.length) {
    throw new Error(
      `Town manifest categories must contain ${TOWN_CATEGORY_IDS.length} entries, received ${value.length}.`,
    );
  }

  const categories = value.map((entry, index) => {
    const label = `Town manifest category ${index}`;
    const category = readPlainObject(entry, label);
    const id = readTownCategoryId(category.id, `${label}.id`);
    const name = {
      en: readNonEmptyString(category.en, `${label}.en`),
      zh: readNonEmptyString(category.zh, `${label}.zh`),
    };

    return Object.freeze({
      id,
      name: Object.freeze(name),
      base: readIntegerAtLeastZero(category.base, `${label}.base`),
      appearances: readIntegerAtLeastZero(category.variants, `${label}.variants`),
    });
  });

  if (new Set(categories.map((category) => category.id)).size !== categories.length) {
    throw new Error('Town manifest categories contains duplicate ids.');
  }

  return Object.freeze(categories);
}

function readManifestCounts(value: unknown): {
  base: number;
  materialAware: number;
  fixedAppearance: number;
  appearances: number;
} {
  const counts = readPlainObject(value, 'Town manifest counts');
  return {
    base: readIntegerAtLeastZero(counts.base, 'Town manifest counts.base'),
    materialAware: readIntegerAtLeastZero(
      counts.materialAware,
      'Town manifest counts.materialAware',
    ),
    fixedAppearance: readIntegerAtLeastZero(
      counts.fixedAppearance,
      'Town manifest counts.fixedAppearance',
    ),
    appearances: readIntegerAtLeastZero(counts.appearances, 'Town manifest counts.appearances'),
  };
}

function readTownManifest(value: unknown): {
  materials: readonly TownMaterialOption[];
  categories: readonly TownCategory[];
  assets: readonly TownAsset[];
  counts: { base: number; materialAware: number; fixedAppearance: number; appearances: number };
} {
  const manifest = readPlainObject(value, 'Town manifest');
  const materials = readManifestMaterials(manifest.materials);
  const categories = readManifestCategories(manifest.categories);
  const counts = readManifestCounts(manifest.counts);
  const assetsValue = manifest.assets;

  if (!Array.isArray(assetsValue)) {
    throw new Error(`Town manifest assets must be an array, received ${describeReceivedValue(assetsValue)}.`);
  }

  const assets = assetsValue.map((asset, index) => readTownAsset(asset, index));
  if (new Set(assets.map((asset) => asset.id)).size !== assets.length) {
    throw new Error('Town manifest assets contains duplicate ids.');
  }

  const categoryIds = new Set(categories.map((category) => category.id));
  for (const asset of assets) {
    if (!categoryIds.has(asset.category)) {
      throw new Error(`Town asset ${JSON.stringify(asset.id)} references unknown category ${JSON.stringify(asset.category)}.`);
    }
  }

  const materialAwareCount = assets.filter((asset) => asset.materials.length > 0).length;
  const fixedAppearanceCount = assets.length - materialAwareCount;
  const appearanceCount = assets.reduce((total, asset) => total + asset.variants.length, 0);
  if (
    counts.base !== assets.length ||
    counts.materialAware !== materialAwareCount ||
    counts.fixedAppearance !== fixedAppearanceCount ||
    counts.appearances !== appearanceCount
  ) {
    throw new Error(
      `Town manifest counts do not match assets: received ${describeReceivedValue(counts)}; computed ${describeReceivedValue({
        base: assets.length,
        materialAware: materialAwareCount,
        fixedAppearance: fixedAppearanceCount,
        appearances: appearanceCount,
      })}.`,
    );
  }

  for (const category of categories) {
    const categoryAssets = assets.filter((asset) => asset.category === category.id);
    const categoryBase = categoryAssets.length;
    const categoryAppearances = categoryAssets.reduce(
      (total, asset) => total + asset.variants.length,
      0,
    );
    if (category.base !== categoryBase || category.appearances !== categoryAppearances) {
      throw new Error(
        `Town category ${JSON.stringify(category.id)} counts do not match assets: received ${describeReceivedValue({
          base: category.base,
          appearances: category.appearances,
        })}; computed ${describeReceivedValue({
          base: categoryBase,
          appearances: categoryAppearances,
        })}.`,
      );
    }
  }

  return { materials, categories, assets: Object.freeze(assets), counts };
}

const parsedTownManifest = readTownManifest(townManifest);

export const TOWN_MATERIALS: readonly TownMaterialOption[] = parsedTownManifest.materials;

export const TOWN_CATEGORIES: readonly TownCategory[] = parsedTownManifest.categories;

export const TOWN_ASSETS: readonly TownAsset[] = parsedTownManifest.assets;

const townAssetsById = new Map(TOWN_ASSETS.map((asset) => [asset.id, asset]));

export function getTownAsset(assetId: string): TownAsset {
  const asset = townAssetsById.get(assetId);
  if (asset !== undefined) {
    return asset;
  }

  throw new Error(`Unknown town asset id: ${describeReceivedValue(assetId)}.`);
}

export function getTownAssetVariant(assetId: string, material: TownMaterial): TownAssetVariant {
  const asset = getTownAsset(assetId);
  if (
    material !== 'neutral' &&
    !TOWN_MATERIAL_IDS.some((supportedMaterial) => supportedMaterial === material)
  ) {
    throw new Error(`Invalid town material. Received ${describeReceivedValue(material)}.`);
  }

  const variant = asset.variants.find((candidate) => candidate.material === material);
  if (variant !== undefined) {
    return variant;
  }

  throw new Error(
    `Town asset ${JSON.stringify(asset.id)} does not support material ${describeReceivedValue(material)}.`,
  );
}
