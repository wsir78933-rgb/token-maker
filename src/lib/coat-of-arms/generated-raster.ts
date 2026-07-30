import type { CoatRasterVariant } from './types';

export interface BundledRasterVariantInput {
  readonly assetId: string;
  readonly category: string;
  readonly semanticKey?: string;
}

const localSymbolAssetIds = new Set([
  'eight-point-star',
  'crescent-moon',
  'sunburst',
  'cross-pattee',
  'compass-rose',
  'heraldic-heart',
  'triquetra-knot',
  'sun-wheel',
  'three-pronged-trident',
  'lozenge-star',
]);

const localOtherAssetIds = new Set([
  'heraldic-helm',
  'laurel-wreath',
  'scroll-compartment',
]);

/**
 * A material becomes visible in the library only after both generated files
 * have passed chroma-key and WebP transparency validation. This prevents a
 * partially generated batch from producing broken image cards in the editor.
 */
const availableBundledRasterStems = new Set([
  'symbol-sun-plain',
  'symbol-sun-crossed',
  'symbol-sun-rayed',
  'exterior-tournament-plain',
]);

/**
 * Returns the two original WebP files assigned to a target material.
 * The only accepted stems are catalog semantic keys or a fixed local asset ID,
 * so callers cannot turn an asset ID into an arbitrary public URL.
 */
export function getBundledRasterVariants(
  input: BundledRasterVariantInput,
): readonly [CoatRasterVariant, CoatRasterVariant] | undefined {
  const rasterDirectory = getRasterDirectory(input);
  const rasterStem = getRasterStem(input);
  if (!rasterDirectory || !rasterStem || !availableBundledRasterStems.has(rasterStem)) return undefined;

  return [
    { id: 'a', src: `/coat-assets/generated/${rasterDirectory}/${rasterStem}-a.webp` },
    { id: 'b', src: `/coat-assets/generated/${rasterDirectory}/${rasterStem}-b.webp` },
  ];
}

function getRasterDirectory(input: BundledRasterVariantInput): 'symbols' | 'top-other' | undefined {
  if (input.category === 'symbol') return 'symbols';
  if (input.category === 'other') return 'top-other';
  return undefined;
}

function getRasterStem(input: BundledRasterVariantInput): string | undefined {
  if (input.category === 'symbol') {
    if (isSafeSemanticKey(input.semanticKey, 'symbol-') || localSymbolAssetIds.has(input.assetId)) {
      return input.semanticKey ?? input.assetId;
    }
    return undefined;
  }
  if (input.category === 'other') {
    if (isSafeSemanticKey(input.semanticKey, 'exterior-') || localOtherAssetIds.has(input.assetId)) {
      return input.semanticKey ?? input.assetId;
    }
  }
  return undefined;
}

function isSafeSemanticKey(value: string | undefined, requiredPrefix: string): value is string {
  return typeof value === 'string'
    && value.startsWith(requiredPrefix)
    && /^[a-z0-9-]+$/.test(value);
}
