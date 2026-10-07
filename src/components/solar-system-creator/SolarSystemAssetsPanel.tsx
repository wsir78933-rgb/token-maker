'use client';

import { useId, useRef, type KeyboardEvent } from 'react';
import Image from 'next/image';

import { listSolarAssets } from '@/lib/solar-system-creator/catalog';
import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';
import type { SolarAssetCategory } from '@/lib/solar-system-creator/types';

export interface SolarSystemAssetsPanelProps {
  copy: SolarSystemCopy;
  category: SolarAssetCategory;
  onCategoryChange: (category: SolarAssetCategory) => void;
  onChooseAsset: (assetId: string) => void;
}

const SOLAR_ASSET_CATEGORIES: readonly SolarAssetCategory[] = [
  'star',
  'type-1',
  'type-2',
  'type-3',
  'type-4',
  'type-5',
];

export function SolarSystemAssetsPanel({
  copy,
  category,
  onCategoryChange,
  onChooseAsset,
}: SolarSystemAssetsPanelProps) {
  const panelId = useId();
  const tabReferences = useRef<Array<HTMLButtonElement | null>>([]);
  const activeTabId = `${panelId}-${category}-tab`;
  const activePanelId = `${panelId}-panel`;
  const assets = listSolarAssets(category);

  function focusCategoryTab(categoryIndex: number): void {
    const targetCategory = SOLAR_ASSET_CATEGORIES[categoryIndex];
    if (targetCategory === undefined) {
      throw new Error(`Solar asset category index is out of range. Received ${categoryIndex}.`);
    }

    const targetTab = tabReferences.current[categoryIndex];
    if (targetTab === null || targetTab === undefined) {
      throw new Error(`Solar asset category tab is unavailable at index ${categoryIndex}.`);
    }

    onCategoryChange(targetCategory);
    targetTab.focus();
  }

  function moveCategoryTab(event: KeyboardEvent<HTMLButtonElement>, categoryIndex: number): void {
    let nextCategoryIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextCategoryIndex = (categoryIndex + 1) % SOLAR_ASSET_CATEGORIES.length;
    } else if (event.key === 'ArrowLeft') {
      nextCategoryIndex = (categoryIndex + SOLAR_ASSET_CATEGORIES.length - 1) % SOLAR_ASSET_CATEGORIES.length;
    } else if (event.key === 'Home') {
      nextCategoryIndex = 0;
    } else if (event.key === 'End') {
      nextCategoryIndex = SOLAR_ASSET_CATEGORIES.length - 1;
    }

    if (nextCategoryIndex === null) return;
    event.preventDefault();
    focusCategoryTab(nextCategoryIndex);
  }

  return (
    <section
      aria-labelledby={`${panelId}-heading`}
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={`${panelId}-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
          {copy.assetsTitle}
        </h2>
        <span className="text-xs text-[var(--site-ink-soft)]" aria-live="polite">
          {copy.categoryLabels[category]} · {assets.length}
        </span>
      </div>

      <div
        role="tablist"
        aria-label={copy.assetsTitle}
        className="grid grid-cols-3 gap-1"
      >
        {SOLAR_ASSET_CATEGORIES.map((assetCategory, index) => {
          const tabId = `${panelId}-${assetCategory}-tab`;
          const selected = category === assetCategory;

          return (
            <button
              key={assetCategory}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={activePanelId}
              tabIndex={selected ? 0 : -1}
              ref={(element) => {
                tabReferences.current[index] = element;
              }}
              onClick={() => onCategoryChange(assetCategory)}
              onKeyDown={(event) => moveCategoryTab(event, index)}
              className="min-h-11 min-w-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-xs text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)] aria-selected:border-[var(--site-accent-strong)] aria-selected:bg-[var(--site-accent-bg)] aria-selected:font-semibold"
            >
              {copy.categoryLabels[assetCategory]}
            </button>
          );
        })}
      </div>

      <div
        id={activePanelId}
        role="tabpanel"
        aria-labelledby={activeTabId}
        tabIndex={0}
        className="min-h-0"
      >
        <ul
          aria-label={`${copy.categoryLabels[category]} (${assets.length})`}
          className="grid max-h-72 min-h-0 grid-cols-3 gap-2 overflow-y-auto overscroll-y-contain pr-1"
        >
          {assets.map((asset) => (
            <li key={asset.id} className="min-w-0">
              <button
                type="button"
                aria-label={`${copy.categoryLabels[category]} ${asset.index}`}
                title={asset.id}
                onClick={() => onChooseAsset(asset.id)}
                className="flex min-h-11 min-w-11 aspect-square w-full items-center justify-center rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-2 transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
              >
                <Image
                  src={asset.src}
                  alt=""
                  width={128}
                  height={128}
                  unoptimized
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
