import { ROLLFORFANTASY_ASSETS } from './rollforfantasy-assets';
import { LEGACY_EMBLEM_CATALOG_ASSETS } from './legacy-catalog';
import type { EmblemAssetCategory, EmblemCatalogAsset } from './types';

export function listEmblemCatalogAssets(
  category: EmblemAssetCategory,
): readonly EmblemCatalogAsset[] {
  if (category !== 'body' && category !== 'detail' && category !== 'crest') {
    throw new Error(`Invalid emblem asset category: ${String(category)}`);
  }

  return ROLLFORFANTASY_ASSETS.filter((asset) => asset.category === category);
}

export function getEmblemCatalogAsset(assetId: string): EmblemCatalogAsset {
  const asset =
    ROLLFORFANTASY_ASSETS.find((candidate) => candidate.id === assetId) ??
    LEGACY_EMBLEM_CATALOG_ASSETS.find((candidate) => candidate.id === assetId);
  if (!asset) {
    throw new Error(`Unknown emblem catalog asset id: ${String(assetId)}`);
  }

  return asset;
}
