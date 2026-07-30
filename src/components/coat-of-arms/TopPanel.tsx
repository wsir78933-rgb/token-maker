'use client';

import { useState } from 'react';
import { listAssetsByKind } from '@/lib/coat-of-arms/assets';
import { listReferenceCatalogEntries } from '@/lib/coat-of-arms/reference-catalog';
import type { CoatAssetByKind, CoatLocale, CoatRasterVariantId, TopAssetCategory } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { ReferenceAssetGallery, type ReferenceAssetGalleryEntry } from './ReferenceAssetGallery';
import { getCoatWorkbenchCopy } from './workbench-copy';

const topCategories: readonly TopAssetCategory[] = ['crown', 'mantle', 'supporter', 'other'];
const referenceTopAssetIds = new Set(
  topCategories.flatMap((category) => listReferenceCatalogEntries('top', category).map((entry) => entry.id)),
);

interface TopPanelProps {
  locale: CoatLocale;
  selectedCategory?: TopAssetCategory;
}

/** Adds original, local top ornaments without any paid gate or remote asset dependency. */
export function TopPanel({ locale, selectedCategory }: TopPanelProps) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const { error, run } = usePanelCommandError(locale);
  const [uncontrolledCategory, setUncontrolledCategory] = useState<TopAssetCategory>('crown');
  const category = selectedCategory ?? uncontrolledCategory;
  const isTreeControlled = selectedCategory !== undefined;
  const topAssets = listAssetsByKind('top');
  const assetsInCategory = topAssets.filter((asset) => (
    asset.category === category && !referenceTopAssetIds.has(asset.id)
  ));
  const originalTopGalleryEntries = assetsInCategory.map(createTopGalleryEntry);

  return (
    <section aria-label={copy.top} className="space-y-2">
      <h2>{copy.top}</h2>
      {error ? <p role="alert">{error}</p> : null}
      {!isTreeControlled ? <label>
        {copy.topCategory}
        <select
          aria-label={copy.topCategory}
          value={category}
          onChange={(event) => setUncontrolledCategory(event.target.value as TopAssetCategory)}
        >
          {topCategories.map((topCategory) => (
            <option key={topCategory} value={topCategory}>{copy.topCategories[topCategory]}</option>
          ))}
        </select>
      </label> : null}
      <ReferenceAssetGallery
        activeCategory={category}
        additionalEntries={originalTopGalleryEntries}
        categories={isTreeControlled ? [category] : topCategories}
        locale={locale}
        onActiveCategoryChange={(nextCategory) => {
          if (!isTopAssetCategory(nextCategory)) throw new Error(`Invalid top ornament category: ${nextCategory}`);
          setUncontrolledCategory(nextCategory);
        }}
        onSelect={(assetId, rasterVariantId) => run(createTopLayerCommand(assetId, rasterVariantId))}
        section="top"
        showCategoryFilter={!isTreeControlled}
      />
    </section>
  );
}

function createTopGalleryEntry(asset: CoatAssetByKind<'top'>): ReferenceAssetGalleryEntry {
  return {
    id: asset.id,
    name: asset.name.en,
    nameZh: asset.name.zh,
    searchTerms: asset.searchTerms ?? [],
    svgParts: asset.svgParts ?? [{ svgPath: asset.svgPath, sourceColor: '#1F2937' }],
    ...(asset.rasterVariants ? { rasterVariants: asset.rasterVariants } : {}),
  };
}

function createTopLayerCommand(assetId: string, rasterVariantId?: CoatRasterVariantId) {
  return {
    type: 'add-layer' as const,
    assetId,
    ...(rasterVariantId ? { rasterVariantId } : {}),
  };
}

function isTopAssetCategory(value: string): value is TopAssetCategory {
  return topCategories.some((category) => category === value);
}
