'use client';

import Image from 'next/image';
import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

import { getMapMakerAssetSrc, getMapMakerAssets } from '@/lib/map-maker';
import type {
  MapMakerAsset,
  MapMakerAssetCategory,
  MapMakerCoastlineGroup,
  MapMakerElementLayer,
} from '@/lib/map-maker';
import { getMapMakerAssetDisplayName, type MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import type { MapMakerEditTarget } from './MapMakerLayerPanel';
import styles from './MapMakerWorkbench.module.css';

type PaletteTab = 'tiles' | 'elements';
type PlacementMode = 'replace-base' | 'free-place';

export interface MapMakerAssetPaletteProps {
  copy: MapMakerWorkspaceCopy;
  editTarget: MapMakerEditTarget;
  targetLayer: MapMakerElementLayer;
  onEditTargetChange(target: MapMakerEditTarget): void;
  onTargetLayerChange(layer: MapMakerElementLayer): void;
  onReplaceSelectedTiles(assetId: string): void;
  onPlaceElement(assetId: string, layer: MapMakerElementLayer): void;
  onImageLoadError(url: string): void;
}

const COASTLINE_GROUPS: readonly {
  id: MapMakerCoastlineGroup;
  shape: 'convex' | 'concave' | 'side';
  direction: 'upperLeft' | 'upperRight' | 'lowerLeft' | 'lowerRight' | 'top' | 'right' | 'bottom' | 'left';
}[] = [
  { id: 'convex-upper-left', shape: 'convex', direction: 'upperLeft' },
  { id: 'convex-upper-right', shape: 'convex', direction: 'upperRight' },
  { id: 'convex-lower-left', shape: 'convex', direction: 'lowerLeft' },
  { id: 'convex-lower-right', shape: 'convex', direction: 'lowerRight' },
  { id: 'concave-upper-left', shape: 'concave', direction: 'upperLeft' },
  { id: 'concave-upper-right', shape: 'concave', direction: 'upperRight' },
  { id: 'concave-lower-left', shape: 'concave', direction: 'lowerLeft' },
  { id: 'concave-lower-right', shape: 'concave', direction: 'lowerRight' },
  { id: 'side-top', shape: 'side', direction: 'top' },
  { id: 'side-right', shape: 'side', direction: 'right' },
  { id: 'side-bottom', shape: 'side', direction: 'bottom' },
  { id: 'side-left', shape: 'side', direction: 'left' },
];

const PALETTE_TABS: readonly PaletteTab[] = ['tiles', 'elements'];
const ELEMENT_TARGETS: readonly MapMakerElementLayer[] = [1, 2];

function coastlineGroupLabel(
  group: (typeof COASTLINE_GROUPS)[number],
  copy: MapMakerWorkspaceCopy,
): string {
  return `${copy.materials.tileShapes[group.shape]} · ${copy.materials.tileDirections[group.direction]}`;
}

function getRequiredAsset(assets: readonly MapMakerAsset[], assetId: string): MapMakerAsset {
  const asset = assets.find((candidate) => candidate.id === assetId);
  if (asset === undefined) {
    throw new Error(`Map maker asset catalog is missing required base asset ${JSON.stringify(assetId)}.`);
  }
  return asset;
}

function assetAccessibleName(asset: MapMakerAsset, copy: MapMakerWorkspaceCopy): string {
  return getMapMakerAssetDisplayName(copy, asset);
}

function moveTabFocus(event: KeyboardEvent<HTMLButtonElement>, currentTab: PaletteTab, onChange: (tab: PaletteTab) => void, tabs: HTMLButtonElement[]): void {
  let nextIndex: number | null = null;
  const currentIndex = PALETTE_TABS.indexOf(currentTab);
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % PALETTE_TABS.length;
  else if (event.key === 'ArrowLeft') nextIndex = (currentIndex + PALETTE_TABS.length - 1) % PALETTE_TABS.length;
  else if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = PALETTE_TABS.length - 1;
  if (nextIndex === null) return;
  const nextTab = PALETTE_TABS[nextIndex];
  const nextButton = tabs[nextIndex];
  if (nextTab === undefined || nextButton === undefined) {
    throw new Error(`Map maker asset tab is missing at index ${String(nextIndex)}.`);
  }
  event.preventDefault();
  onChange(nextTab);
  nextButton.focus();
}

export function MapMakerAssetPalette(props: MapMakerAssetPaletteProps) {
  const panelId = useId();
  const [activeTab, setActiveTab] = useState<PaletteTab>('tiles');
  const [coastlineGroup, setCoastlineGroup] = useState<MapMakerCoastlineGroup>('convex-upper-left');
  const [elementCategory, setElementCategory] = useState<MapMakerAssetCategory>('geography');
  const [placementMode, setPlacementMode] = useState<PlacementMode>('free-place');
  const tabButtons: HTMLButtonElement[] = [];
  const assets = getMapMakerAssets();
  const tileAssets = useMemo(
    () => assets.filter((asset) => asset.category === 'coastline' && asset.coastlineGroup === coastlineGroup),
    [assets, coastlineGroup],
  );
  const landAsset = getRequiredAsset(assets, 'l0');
  const waterAsset = getRequiredAsset(assets, 's0');
  const selectedElementCategory = props.copy.materials.elementCategories.find((category) => category.id === elementCategory);
  if (selectedElementCategory === undefined) {
    throw new Error(`Map maker copy is missing element category ${JSON.stringify(elementCategory)}.`);
  }
  const elementAssets = assets.filter((asset) => asset.category === elementCategory);

  function selectTab(tab: PaletteTab): void {
    setActiveTab(tab);
  }

  function handleAssetClick(assetId: string): void {
    if (activeTab === 'tiles' || placementMode === 'replace-base') {
      props.onEditTargetChange('base');
      props.onReplaceSelectedTiles(assetId);
      return;
    }
    props.onEditTargetChange(props.targetLayer === 1 ? 'layer-1' : 'layer-2');
    props.onPlaceElement(assetId, props.targetLayer);
  }

function renderAssetButtons(items: readonly MapMakerAsset[], categoryLabel: string): ReactNode {
    return items.map((asset) => (
      <li key={asset.id} className={styles.assetListItem}>
        <button
          type="button"
          className={styles.assetButton}
          aria-label={`${categoryLabel}: ${assetAccessibleName(asset, props.copy)}`}
          title={assetAccessibleName(asset, props.copy)}
          onClick={() => handleAssetClick(asset.id)}
        >
          <Image
            src={getMapMakerAssetSrc(asset.id, 'preview')}
            alt=""
            width={asset.width}
            height={asset.height}
            unoptimized
            loading="lazy"
            className={styles.assetImage}
            onError={() => props.onImageLoadError(getMapMakerAssetSrc(asset.id, 'preview'))}
          />
        </button>
      </li>
    ));
  }

  const tabLabel = activeTab === 'tiles' ? props.copy.materials.tilesTab : props.copy.materials.elementsTab;

  return (
    <section aria-labelledby={`${panelId}-title`} className={styles.panelSection}>
      <header className={styles.panelHeader}>
        <h3 id={`${panelId}-title`} className={styles.panelTitle}>{props.copy.materials.title}</h3>
      </header>
      <div role="tablist" aria-label={props.copy.materials.title} className={styles.assetTabs}>
        {PALETTE_TABS.map((tab, index) => {
          const selected = tab === activeTab;
          const label = tab === 'tiles' ? props.copy.materials.tilesTab : props.copy.materials.elementsTab;
          return (
            <button
              key={tab}
              ref={(button) => { if (button !== null) tabButtons[index] = button; }}
              id={`${panelId}-${tab}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${panelId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={styles.tabButton}
              onClick={() => selectTab(tab)}
              onKeyDown={(event) => moveTabFocus(event, tab, selectTab, tabButtons)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div id={`${panelId}-panel`} role="tabpanel" aria-labelledby={`${panelId}-${activeTab}-tab`} className={styles.paletteContent}>
        {activeTab === 'tiles' ? (
          <>
            <label className={styles.fieldLabel}>
              <span>{props.copy.materials.tileShapes.convex} / {props.copy.materials.tileShapes.concave} / {props.copy.materials.tileShapes.side}</span>
              <select
                className={styles.select}
                value={coastlineGroup}
                onChange={(event) => setCoastlineGroup(event.currentTarget.value as MapMakerCoastlineGroup)}
              >
                {COASTLINE_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>{coastlineGroupLabel(group, props.copy)}</option>
                ))}
              </select>
            </label>
            <div className={styles.quickMaterials}>
              <button type="button" className={styles.quickMaterialButton} title={landAsset.name} onClick={() => handleAssetClick(landAsset.id)}>
                <Image src={getMapMakerAssetSrc(landAsset.id, 'preview')} alt="" width={landAsset.width} height={landAsset.height} unoptimized className={styles.quickMaterialImage} onError={() => props.onImageLoadError(getMapMakerAssetSrc(landAsset.id, 'preview'))} />
                <span>{props.copy.materials.land}</span>
              </button>
              <button type="button" className={styles.quickMaterialButton} title={waterAsset.name} onClick={() => handleAssetClick(waterAsset.id)}>
                <Image src={getMapMakerAssetSrc(waterAsset.id, 'preview')} alt="" width={waterAsset.width} height={waterAsset.height} unoptimized className={styles.quickMaterialImage} onError={() => props.onImageLoadError(getMapMakerAssetSrc(waterAsset.id, 'preview'))} />
                <span>{props.copy.materials.water}</span>
              </button>
            </div>
            <p className={styles.mutedText} aria-live="polite">{tileAssets.length} {tabLabel}</p>
            <ul className={styles.assetGrid} aria-label={tabLabel}>{renderAssetButtons(tileAssets, tabLabel)}</ul>
          </>
        ) : (
          <>
            <div role="group" aria-label={props.copy.materials.elementsTab} className={styles.categoryButtons}>
              {props.copy.materials.elementCategories.map((category) => (
                <button
                  key={category.id}
                  data-testid={`map-maker-category-${category.id}`}
                  type="button"
                  aria-pressed={elementCategory === category.id}
                  className={styles.categoryButton}
                  onClick={() => setElementCategory(category.id)}
                >
                  {category.label} <span>({category.count})</span>
                </button>
              ))}
            </div>
            <div className={styles.modeAndLayer}>
              <fieldset className={styles.modeFieldset}>
                <legend>{props.copy.materials.placementMode.title}</legend>
                <label><input type="radio" name={`${panelId}-placement`} checked={placementMode === 'replace-base'} onChange={() => setPlacementMode('replace-base')} /><span>{props.copy.materials.placementMode.replaceBase}</span></label>
                <label><input type="radio" name={`${panelId}-placement`} checked={placementMode === 'free-place'} onChange={() => setPlacementMode('free-place')} /><span>{props.copy.materials.placementMode.freePlace}</span></label>
              </fieldset>
              {placementMode === 'free-place' ? (
                <label className={styles.fieldLabel}>
                  <span>{props.copy.materials.placementMode.targetLayer}</span>
                  <select className={styles.select} value={props.targetLayer} onChange={(event) => props.onTargetLayerChange(Number(event.currentTarget.value) as MapMakerElementLayer)}>
                    {ELEMENT_TARGETS.map((layer) => <option key={layer} value={layer}>{layer}</option>)}
                  </select>
                </label>
              ) : null}
            </div>
            <p className={styles.mutedText} aria-live="polite">{elementAssets.length} {selectedElementCategory.label}</p>
            <ul className={styles.assetGrid} aria-label={selectedElementCategory.label}>{renderAssetButtons(elementAssets, selectedElementCategory.label)}</ul>
          </>
        )}
      </div>
      <p className={styles.panelHint}>{props.copy.materials.usageHint}</p>
      <p className={styles.panelHint}>{props.copy.materials.showMoreAssets}</p>
    </section>
  );
}
