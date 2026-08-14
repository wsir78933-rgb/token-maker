'use client';

import { useState } from 'react';
import { listAssetsByKind } from '@/lib/coat-of-arms/assets';
import {
  listReferenceCatalogEntries,
  shieldReferenceCategories,
  type ShieldReferenceCategory,
} from '@/lib/coat-of-arms/reference-catalog';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { ReferenceAssetGallery } from './ReferenceAssetGallery';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

interface TargetShieldPaletteProps {
  activeCategory?: ShieldReferenceCategory;
  locale: CoatLocale;
  onActiveCategoryChange?: (category: ShieldReferenceCategory) => void;
}

/**
 * Target-style shield browser for bundled original SVG material.
 */
export function TargetShieldPalette({
  activeCategory: controlledActiveCategory,
  locale,
  onActiveCategoryChange,
}: TargetShieldPaletteProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const project = useCoatProjectStore((state) => state.project);
  const { error, run } = usePanelCommandError(locale);
  const [uncontrolledActiveCategory, setUncontrolledActiveCategory] = useState<ShieldReferenceCategory>('heater');
  const activeCategory = controlledActiveCategory ?? uncontrolledActiveCategory;
  const shield = project.layers.find((layer) => layer.type === 'shield');
  if (!shield || shield.type !== 'shield') throw new Error('Shield palette requires a project shield layer');
  const entries = listReferenceCatalogEntries('shield', activeCategory).map((entry) => ({
    id: entry.id,
    name: entry.name,
    nameZh: entry.nameZh,
    searchTerms: entry.searchTerms,
    rasterSrc: entry.staticImageSrc,
  }));

  const requestActiveCategory = (nextCategory: ShieldReferenceCategory) => {
    if (controlledActiveCategory === undefined) setUncontrolledActiveCategory(nextCategory);
    onActiveCategoryChange?.(nextCategory);
  };

  return (
    <section aria-label={copy.palettes.shield.library} className="coat-target-shield-library">
      {error ? <p role="alert">{error}</p> : null}
      <ReferenceAssetGallery
        activeCategory={activeCategory}
        additionalEntries={entries}
        categories={shieldReferenceCategories}
        locale={locale}
        onActiveCategoryChange={(category) => requestActiveCategory(category as ShieldReferenceCategory)}
        onSelect={(assetId) => run({ type: 'update-layer', layerId: shield.id, patch: { assetId } })}
        presentation="compact"
        selectedAssetId={shield.assetId}
        section="shield"
        showCategoryFilter={false}
      />
    </section>
  );
}

export function listTargetShieldPaletteAssets() {
  return listAssetsByKind('shield');
}
