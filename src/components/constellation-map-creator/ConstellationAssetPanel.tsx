'use client';

import Image from 'next/image';
import { useId, useRef, type KeyboardEvent } from 'react';

import { getConstellationAssets } from '@/lib/constellation-map-creator';
import type { ConstellationAssetCategory } from '@/lib/constellation-map-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

import type { ConstellationWorkspaceCopy } from '@/lib/constellation-map-creator/copy-types';

export interface ConstellationAssetPanelProps {
  locale: SiteLocale;
  copy: ConstellationWorkspaceCopy;
  category: ConstellationAssetCategory;
  onCategoryChange(category: ConstellationAssetCategory): void;
  onAddConstellation(assetId: string): void;
}

const ASSET_CATEGORIES: readonly ConstellationAssetCategory[] = ['image', 'plain', 'line'];

function assetName(locale: SiteLocale, nameEn: string, nameZh: string): string {
  return locale === 'zh' ? nameZh : nameEn;
}

function formatAssetCount(template: string, count: number): string {
  return template.includes('{count}') ? template.replace('{count}', String(count)) : template;
}

export function ConstellationAssetPanel({
  locale,
  copy,
  category,
  onCategoryChange,
  onAddConstellation,
}: ConstellationAssetPanelProps) {
  const panelId = useId();
  const tabReferences = useRef<Array<HTMLButtonElement | null>>([]);
  const assets = getConstellationAssets(category);

  function focusCategoryTab(categoryIndex: number): void {
    const nextCategory = ASSET_CATEGORIES[categoryIndex];
    const nextTab = tabReferences.current[categoryIndex];
    if (nextCategory === undefined || nextTab === null || nextTab === undefined) {
      throw new Error(`Constellation asset category tab is unavailable. Received index=${String(categoryIndex)}.`);
    }
    onCategoryChange(nextCategory);
    nextTab.focus();
  }

  function moveCategoryTab(event: KeyboardEvent<HTMLButtonElement>, categoryIndex: number): void {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (categoryIndex + 1) % ASSET_CATEGORIES.length;
    else if (event.key === 'ArrowLeft') nextIndex = (categoryIndex + ASSET_CATEGORIES.length - 1) % ASSET_CATEGORIES.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = ASSET_CATEGORIES.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    focusCategoryTab(nextIndex);
  }

  return (
    <section
      data-testid="constellation-asset-panel"
      aria-labelledby={`${panelId}-heading`}
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={`${panelId}-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
          {copy.assetsTitle}
        </h2>
        <span className="text-xs text-[var(--site-ink-soft)]" aria-live="polite">
          {formatAssetCount(copy.assetCount, assets.length)}
        </span>
      </div>

      <div role="tablist" aria-label={copy.assetsTitle} className="grid grid-cols-3 gap-1">
        {ASSET_CATEGORIES.map((assetCategory, index) => {
          const selected = category === assetCategory;
          const tabId = `${panelId}-${assetCategory}-tab`;
          return (
            <button
              key={assetCategory}
              id={tabId}
              ref={(button) => { tabReferences.current[index] = button; }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${panelId}-assets`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onCategoryChange(assetCategory)}
              onKeyDown={(event) => moveCategoryTab(event, index)}
              className="min-h-11 min-w-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-xs text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)] aria-selected:border-[var(--site-accent-strong)] aria-selected:bg-[var(--site-accent-bg)] aria-selected:font-semibold"
            >
              {copy.categoryLabels[assetCategory]}
            </button>
          );
        })}
      </div>

      <div id={`${panelId}-assets`} role="tabpanel" aria-labelledby={`${panelId}-${category}-tab`} tabIndex={0} className="min-h-0">
        <ul data-testid="constellation-asset-grid" aria-label={`${copy.categoryLabels[category]} (${assets.length})`} className="grid max-h-72 min-h-0 grid-cols-3 gap-2 overflow-y-auto overscroll-y-contain pr-1 lg:max-h-[32rem] lg:grid-cols-2">
          {assets.map((asset) => (
            <li key={asset.id} className="min-w-0">
              <button
                type="button"
                data-testid={`constellation-asset-${asset.id}`}
                aria-label={`${copy.categoryLabels[category]} ${String(asset.index)}: ${assetName(locale, asset.nameEn, asset.nameZh)}`}
                title={assetName(locale, asset.nameEn, asset.nameZh)}
                onClick={() => onAddConstellation(asset.id)}
                className="flex min-h-11 min-w-11 w-full flex-col items-center justify-center gap-1 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-1.5 transition-colors hover:border-[var(--site-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]"
              >
                <span className="flex aspect-square w-full min-w-0 shrink-0 items-center justify-center rounded-sm bg-[#111b30] p-1">
                  <Image
                    src={asset.src}
                    alt=""
                    width={asset.width}
                    height={asset.height}
                    unoptimized
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="line-clamp-2 min-h-[2.5em] w-full text-center text-[10px] leading-tight text-[var(--site-ink-soft)]">
                  {assetName(locale, asset.nameEn, asset.nameZh)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
