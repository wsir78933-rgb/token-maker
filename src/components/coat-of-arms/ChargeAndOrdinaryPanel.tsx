'use client';

import { useState } from 'react';
import { getCoatAsset, listAssetsByKind } from '@/lib/coat-of-arms/assets';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { ChargeAssetCategory, CoatLocale, CoatProject, CoatRasterVariantId, GeometryCoatAssetKind } from '@/lib/coat-of-arms/types';
import { AssetLibraryPanel } from './AssetLibraryPanel';
import { ReferenceAssetGallery, type ReferenceAssetGalleryEntry } from './ReferenceAssetGallery';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

function chooseRandomAssetId(assetIds: string[]): string | undefined {
  return assetIds[Math.floor(Math.random() * assetIds.length)];
}

const chargeCategories: readonly ChargeAssetCategory[] = ['animal', 'object', 'plant', 'human', 'symbol'];
function listOriginalChargeGalleryEntries(category: ChargeAssetCategory): ReferenceAssetGalleryEntry[] {
  return listAssetsByKind('charge')
    .filter((asset) => asset.category === category)
    .map(createWebpChargeGalleryEntry);
}

function createWebpChargeGalleryEntry(
  asset: ReturnType<typeof listAssetsByKind<'charge'>>[number],
): ReferenceAssetGalleryEntry {
  if (!('rasterSrc' in asset) || typeof asset.rasterSrc !== 'string') {
    throw new Error(`Charge material has no WebP source: ${asset.id}`);
  }
  return {
    id: asset.id,
    name: asset.name.en,
    nameZh: asset.name.zh,
    searchTerms: asset.searchTerms ?? [],
    rasterSrc: asset.rasterSrc,
  };
}

function getSelectedChargeMaterial(
  project: CoatProject,
  selectedLayerIds: readonly string[],
  chargeCategory: ChargeAssetCategory,
): { assetId: string; rasterVariantId?: CoatRasterVariantId } | null {
  if (selectedLayerIds.length !== 1) return null;
  const selectedLayer = project.layers.find((layer) => layer.id === selectedLayerIds[0]);
  if (!selectedLayer || selectedLayer.type !== 'charge') return null;
  const selectedAsset = getCoatAsset(selectedLayer.assetId);
  return selectedAsset.kind === 'charge' && selectedAsset.category === chargeCategory
    ? { assetId: selectedAsset.id, ...(selectedLayer.rasterVariantId ? { rasterVariantId: selectedLayer.rasterVariantId } : {}) }
    : null;
}

interface ChargeAndOrdinaryPanelProps {
  locale: CoatLocale;
  selectedChargeCategory?: ChargeAssetCategory;
  selectedKind?: Extract<GeometryCoatAssetKind, 'charge' | 'ordinary'>;
}

/** Provides a searchable, locally bundled ordinary and charge catalogue. */
export function ChargeAndOrdinaryPanel({ locale, selectedChargeCategory, selectedKind }: ChargeAndOrdinaryPanelProps) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const { error, reportError, run } = usePanelCommandError(locale);
  const [uncontrolledKind, setUncontrolledKind] = useState<Extract<GeometryCoatAssetKind, 'charge' | 'ordinary'>>('charge');
  const [uncontrolledChargeCategory, setUncontrolledChargeCategory] = useState<ChargeAssetCategory>('animal');
  const [search, setSearch] = useState('');
  const kind = selectedKind ?? uncontrolledKind;
  const chargeCategory = selectedChargeCategory ?? uncontrolledChargeCategory;
  const isControlledByToolTree = selectedKind !== undefined && selectedChargeCategory !== undefined;
  const selectedChargeMaterial = getSelectedChargeMaterial(project, selectedLayerIds, chargeCategory);
  const addAsset = (assetId: string, rasterVariantId?: CoatRasterVariantId) => {
    if (!run({ type: 'add-layer', assetId, ...(rasterVariantId ? { rasterVariantId } : {}) }) || kind !== 'charge') return;
    const addedLayer = useCoatProjectStore.getState().project.layers.at(-1);
    if (!addedLayer || addedLayer.type !== 'charge' || addedLayer.assetId !== assetId) {
      reportError(new Error(`Unable to select added charge asset: ${assetId}`));
      return;
    }
    setSelectedLayerIds([addedLayer.id]);
  };
  const chooseRandom = () => {
    const assets = kind === 'charge'
      ? listAssetsByKind('charge').filter((asset) => asset.category === chargeCategory)
      : listAssetsByKind(kind);
    const assetId = chooseRandomAssetId(assets.map((asset) => asset.id));
    if (!assetId) { reportError(new Error(copy.noLocalAssets(kind === 'charge' ? copy.charges : copy.ordinaries))); return; }
    addAsset(assetId);
  };

  return (
    <section aria-label={copy.ordinariesAndCharges} className="space-y-2">
      <h2>{copy.ordinariesAndCharges}</h2>
      {error ? <p role="alert">{error}</p> : null}
      {!isControlledByToolTree ? <label>
        {copy.libraryCategory}
        <select aria-label={copy.libraryCategory} value={kind} onChange={(event) => setUncontrolledKind(event.target.value as Extract<GeometryCoatAssetKind, 'charge' | 'ordinary'>)}>
          <option value="charge">{copy.charges}</option>
          <option value="ordinary">{copy.ordinaries}</option>
        </select>
      </label> : null}
      {kind === 'charge' && !isControlledByToolTree ? <label>
        {copy.chargeCategory}
        <select aria-label={copy.chargeCategory} value={chargeCategory} onChange={(event) => setUncontrolledChargeCategory(event.target.value as ChargeAssetCategory)}>
          {chargeCategories.map((category) => <option key={category} value={category}>{copy.chargeCategories[category]}</option>)}
        </select>
      </label> : null}
      {kind !== 'charge' ? <label>
        {copy.searchLibrary}
        <input aria-label={copy.searchLibrary} value={search} onChange={(event) => setSearch(event.target.value)} />
      </label> : null}
      <button type="button" onClick={chooseRandom}>{copy.addRandom(kind === 'charge' ? copy.charges.toLowerCase() : copy.ordinaries.toLowerCase())}</button>
      {kind === 'charge' ? <ReferenceAssetGallery
        activeCategory={chargeCategory}
        additionalEntries={listOriginalChargeGalleryEntries(chargeCategory)}
        categories={isControlledByToolTree ? [chargeCategory] : chargeCategories}
        locale={locale}
        onActiveCategoryChange={isControlledByToolTree ? undefined : (category) => setUncontrolledChargeCategory(category as ChargeAssetCategory)}
        onSearchChange={setSearch}
        onSelect={addAsset}
        section="charge"
        search={search}
        selectedAssetId={selectedChargeMaterial?.assetId ?? null}
        selectedRasterVariantId={selectedChargeMaterial?.rasterVariantId}
        showCategoryFilter={!isControlledByToolTree}
      /> : null}
      {kind === 'ordinary' ? <AssetLibraryPanel kind={kind} locale={locale} search={search} onAdd={addAsset} /> : null}
    </section>
  );
}
