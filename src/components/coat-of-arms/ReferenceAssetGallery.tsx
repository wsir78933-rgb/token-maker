'use client';

/* The editor previews browser-local user-selectable WebP material directly. */
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  shieldReferenceCategories,
} from '@/lib/coat-of-arms/reference-catalog';
import type { CoatAssetGallerySection, CoatLocale, CoatRasterVariant, CoatRasterVariantId, CoatSvgPart } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

const referenceCategoriesBySection: Record<CoatAssetGallerySection, readonly string[]> = {
  shield: shieldReferenceCategories,
  charge: ['animal', 'object', 'plant', 'human', 'symbol'],
  top: ['crown', 'mantle', 'supporter', 'other'],
};
const REFERENCE_ASSET_PAGE_SIZE = 24;

export interface ReferenceAssetGalleryEntry {
  readonly id: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly svgParts?: readonly CoatSvgPart[];
  readonly rasterSrc?: string;
  readonly rasterVariants?: readonly [CoatRasterVariant, CoatRasterVariant];
}

interface ReferenceAssetGalleryCard {
  readonly entry: ReferenceAssetGalleryEntry;
  readonly rasterVariant?: CoatRasterVariant;
}

interface ReferenceAssetGalleryProps {
  activeCategory?: string;
  additionalEntries?: readonly ReferenceAssetGalleryEntry[];
  section: CoatAssetGallerySection;
  categories: readonly string[];
  locale: CoatLocale;
  onActiveCategoryChange?: (category: string) => void;
  onSearchChange?: (search: string) => void;
  onSelect?: (assetId: string, rasterVariantId?: CoatRasterVariantId) => void;
  presentation?: 'standard' | 'compact';
  search?: string;
  selectedAssetId?: string | null;
  selectedRasterVariantId?: CoatRasterVariantId;
  showCategoryFilter?: boolean;
}

/** Returns whether one local catalog entry contains the normalized search query. */
export function matchesCatalogSearch(entry: ReferenceAssetGalleryEntry, rawQuery: string): boolean {
  const normalizedQuery = rawQuery.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) return true;
  return [entry.id, entry.name, entry.nameZh, ...entry.searchTerms]
    .join(' ')
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}

/**
 * Renders locally bundled catalog entries only. Panels own command dispatch;
 * the gallery reports a selected asset ID through its one callback boundary.
 */
export function ReferenceAssetGallery({
  activeCategory: controlledCategory,
  additionalEntries = [],
  categories,
  locale,
  onActiveCategoryChange,
  onSearchChange,
  onSelect,
  presentation = 'standard',
  search: controlledSearch,
  selectedAssetId: controlledSelectedAssetId,
  selectedRasterVariantId: controlledSelectedRasterVariantId,
  section,
  showCategoryFilter = true,
}: ReferenceAssetGalleryProps) {
  const copy = getCoatWorkbenchCopy(locale).palettes.referenceGallery;
  assertReferenceGalleryCategories(section, categories, copy.categories[section]);
  if (controlledCategory !== undefined && !categories.includes(controlledCategory)) {
    throw new Error(`Invalid controlled reference category for ${section}: ${controlledCategory}`);
  }
  if (!onSelect && additionalEntries.length > 0) {
    throw new Error(`Reference gallery requires a selection callback for ${section}`);
  }
  const [uncontrolledCategory, setUncontrolledCategory] = useState(categories[0]!);
  const activeCategory = controlledCategory ?? uncontrolledCategory;
  const [uncontrolledSearch, setUncontrolledSearch] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedRasterVariantId, setSelectedRasterVariantId] = useState<CoatRasterVariantId | undefined>();
  const search = controlledSearch ?? uncontrolledSearch;
  const activeFilterKey = `${activeCategory}\u0000${search}`;
  const [visibleCardState, setVisibleCardState] = useState(() => ({
    filterKey: activeFilterKey,
    count: REFERENCE_ASSET_PAGE_SIZE,
  }));
  const visibleCardCount = visibleCardState.filterKey === activeFilterKey
    ? visibleCardState.count
    : REFERENCE_ASSET_PAGE_SIZE;
  const activeSelectedAssetId = controlledSelectedAssetId === undefined ? selectedAssetId : controlledSelectedAssetId;
  const activeSelectedRasterVariantId = controlledSelectedAssetId === undefined
    ? selectedRasterVariantId
    : controlledSelectedRasterVariantId;
  const visibleEntries = additionalEntries.filter((entry) => (
    matchesCatalogSearch(entry, search)
  ));
  const filteredCards = createReferenceGalleryCards(visibleEntries);
  const visibleCards = filteredCards.slice(0, visibleCardCount);

  return (
    <section aria-label={copy.library[section]} className={`coat-reference-asset-gallery${presentation === 'compact' ? ' coat-reference-asset-gallery--compact' : ''}`}>
      {showCategoryFilter ? <div aria-label={copy.categoryFilter[section]} className="flex flex-wrap gap-1" role="group">
        {categories.map((category) => (
          <button
            aria-pressed={activeCategory === category}
            className={`rounded border border-[color:var(--coat-line)] px-2 py-1 text-xs ${activeCategory === category ? 'bg-[color:var(--coat-line)] text-[color:var(--coat-panel)]' : ''}`}
            key={category}
            onClick={() => {
              setUncontrolledCategory(category);
              onActiveCategoryChange?.(category);
            }}
            type="button"
          >
            {copy.categories[section][category]}
          </button>
        ))}
      </div> : null}
      <label className="coat-target-search">
        <Search aria-hidden="true" className="coat-target-search-icon" data-search-glyph="true" />
        <span className="sr-only">{copy.search[section]}</span>
        <input
          aria-label={copy.search[section]}
          onChange={(event) => {
            const nextSearch = event.target.value;
            if (controlledSearch === undefined) setUncontrolledSearch(nextSearch);
            onSearchChange?.(nextSearch);
          }}
          placeholder={copy.search[section]}
          type="search"
          value={search}
        />
      </label>
      {filteredCards.length === 0 ? <p role="status">{copy.noResults[section]}</p> : null}
      <ul aria-label={copy.library[section]} className={`m-0 grid list-none gap-1 p-0${presentation === 'compact' ? ' coat-reference-asset-gallery__grid--compact' : ' grid-cols-3'}`}>
        {visibleCards.map(({ entry, rasterVariant }) => {
          const assetName = locale === 'zh' ? entry.nameZh : entry.name;
          const cardName = rasterVariant ? `${assetName} — ${rasterVariant.id.toUpperCase()}` : assetName;
          const isSelected = activeSelectedAssetId === entry.id
            && (rasterVariant === undefined || activeSelectedRasterVariantId === rasterVariant.id);
          return (
            <li key={`${entry.id}-${rasterVariant?.id ?? 'vector'}`}>
              <button
                aria-label={copy.cardAction(section, cardName)}
                aria-pressed={isSelected}
                className="coat-gallery-card grid w-full rounded border border-[color:var(--coat-line)] p-1 text-xs"
                onClick={() => {
                  if (controlledSelectedAssetId === undefined) {
                    setSelectedAssetId(entry.id);
                    setSelectedRasterVariantId(rasterVariant?.id);
                  }
                  if (rasterVariant) onSelect?.(entry.id, rasterVariant.id);
                  else onSelect?.(entry.id);
                }}
                type="button"
              >
                {rasterVariant
                    ? <img alt="" className="aspect-[10/11] w-full object-contain" decoding="async" height={110} loading="lazy" src={rasterVariant.src} width={100} />
                    : entry.rasterSrc
                      ? <img alt="" className="aspect-[10/11] w-full object-contain" decoding="async" height={110} loading="lazy" src={entry.rasterSrc} width={100} />
                    : <svg aria-hidden="true" className="aspect-[10/11] w-full" viewBox="0 0 100 110">
                      {entry.svgParts?.map((part, partIndex) => <path d={part.svgPath} fill={part.sourceColor} key={`${entry.id}-${partIndex}`} />)}
                    </svg>}
                <span aria-hidden="true" className="coat-gallery-card-name coat-reference-asset-gallery__caption">{cardName}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {filteredCards.length > visibleCards.length ? <button
        className="rounded border border-[color:var(--coat-line)] px-2 py-1 text-xs"
        onClick={() => setVisibleCardState({
          filterKey: activeFilterKey,
          count: visibleCardCount + REFERENCE_ASSET_PAGE_SIZE,
        })}
        type="button"
      >
        {copy.loadMore}
      </button> : null}
    </section>
  );
}

function createReferenceGalleryCards(
  entries: readonly ReferenceAssetGalleryEntry[],
): readonly ReferenceAssetGalleryCard[] {
  return entries.flatMap((entry) => (
    entry.rasterVariants
      ? entry.rasterVariants.map((rasterVariant) => ({ entry, rasterVariant }))
      : [{ entry }]
  ));
}

function assertReferenceGalleryCategories(
  section: CoatAssetGallerySection,
  categories: readonly string[],
  categoryCopy: Readonly<Record<string, string>>,
) {
  const validCategories = referenceCategoriesBySection[section];
  if (!validCategories) throw new Error(`Invalid reference catalog section: ${String(section)}`);
  if (categories.length === 0) throw new Error(`Invalid reference categories for ${section}: []`);
  for (const category of categories) {
    if (!validCategories.includes(category) || !categoryCopy[category]) {
      throw new Error(`Invalid reference category for ${section}: ${category}`);
    }
  }
}
