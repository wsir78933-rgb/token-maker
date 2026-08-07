'use client';

/* The editor previews browser-local user-selectable WebP material directly. */
/* eslint-disable @next/next/no-img-element */

import { useId, useState } from 'react';
import { Search } from 'lucide-react';
import { buildFieldInteriorMarkup } from '@/lib/coat-of-arms/field';
import {
  getReferenceShieldCardField,
  type ReferenceCatalogEntry,
  listReferenceCatalogEntries,
  shieldReferenceCategories,
} from '@/lib/coat-of-arms/reference-catalog';
import type { CoatAssetGallerySection, CoatLocale, CoatRasterVariant, CoatRasterVariantId } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

const referenceCategoriesBySection: Record<CoatAssetGallerySection, readonly string[]> = {
  shield: shieldReferenceCategories,
  charge: ['animal', 'object', 'plant', 'human', 'symbol'],
  top: ['crown', 'mantle', 'supporter', 'other'],
};

export interface ReferenceAssetGalleryEntry {
  readonly id: string;
  readonly name: string;
  readonly nameZh: string;
  readonly searchTerms: readonly string[];
  readonly svgParts?: readonly ReferenceCatalogEntry['svgParts'][number][];
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
  onSelect: (assetId: string, rasterVariantId?: CoatRasterVariantId) => void;
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
  const [uncontrolledCategory, setUncontrolledCategory] = useState(categories[0]!);
  const compactThumbnailClipIdPrefix = useId();
  const activeCategory = controlledCategory ?? uncontrolledCategory;
  const [uncontrolledSearch, setUncontrolledSearch] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedRasterVariantId, setSelectedRasterVariantId] = useState<CoatRasterVariantId | undefined>();
  const search = controlledSearch ?? uncontrolledSearch;
  const activeSelectedAssetId = controlledSelectedAssetId === undefined ? selectedAssetId : controlledSelectedAssetId;
  const activeSelectedRasterVariantId = controlledSelectedAssetId === undefined
    ? selectedRasterVariantId
    : controlledSelectedRasterVariantId;
  const visibleEntries = [
    ...(section === 'shield' ? listReferenceCatalogEntries('shield', activeCategory).map(createReferenceGalleryEntry) : []),
    ...additionalEntries,
  ].filter((entry) => (
    matchesCatalogSearch(entry, search)
  ));
  const visibleCards = createReferenceGalleryCards(visibleEntries);

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
      {visibleCards.length === 0 ? <p role="status">{copy.noResults[section]}</p> : null}
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
                className="grid w-full gap-1 rounded border border-[color:var(--coat-line)] p-1 text-xs"
                onClick={() => {
                  if (controlledSelectedAssetId === undefined) {
                    setSelectedAssetId(entry.id);
                    setSelectedRasterVariantId(rasterVariant?.id);
                  }
                  if (rasterVariant) onSelect(entry.id, rasterVariant.id);
                  else onSelect(entry.id);
                }}
                type="button"
              >
                {presentation === 'compact' && section === 'shield'
                  ? <CompactShieldThumbnail clipIdPrefix={compactThumbnailClipIdPrefix} entry={entry} />
                    : rasterVariant
                    ? <img alt="" className="aspect-[10/11] w-full object-contain" src={rasterVariant.src} />
                    : entry.rasterSrc
                      ? <img alt="" className="aspect-[10/11] w-full object-contain" src={entry.rasterSrc} />
                    : <svg aria-hidden="true" className="aspect-[10/11] w-full" viewBox="0 0 100 110">
                      {entry.svgParts?.map((part, partIndex) => <path d={part.svgPath} fill={part.sourceColor} key={`${entry.id}-${partIndex}`} />)}
                    </svg>}
                {presentation === 'standard' ? <span className="coat-reference-asset-gallery__caption">{cardName}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function createReferenceGalleryEntry(entry: ReferenceCatalogEntry): ReferenceAssetGalleryEntry {
  return {
    id: entry.id,
    name: entry.name,
    nameZh: entry.nameZh,
    searchTerms: entry.searchTerms,
    svgParts: entry.svgParts,
  };
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

function CompactShieldThumbnail({ clipIdPrefix, entry }: { clipIdPrefix: string; entry: ReferenceAssetGalleryEntry }) {
  const shieldPath = entry.svgParts?.[0]?.svgPath;
  if (!shieldPath) throw new Error(`Shield catalog entry has no preview path: ${entry.id}`);
  const clipId = `coat-compact-shield-${clipIdPrefix}-${entry.id}`;
  const field = getReferenceShieldCardField(entry.id);
  const [baseColor, accentColor = baseColor] = field.colors;
  if (!baseColor) throw new Error(`Shield catalog entry has no field colour: ${entry.id}`);

  return <svg aria-hidden="true" className="aspect-[10/11] w-full" viewBox="0 0 100 110">
    <defs><clipPath id={clipId}><path d={shieldPath} /></clipPath></defs>
    <g
      clipPath={`url(#${clipId})`}
      data-shield-card-division={field.division}
      dangerouslySetInnerHTML={{ __html: buildFieldInteriorMarkup(field, clipId, [baseColor, accentColor]) }}
    />
    <path d={shieldPath} fill="none" stroke="#171717" strokeWidth="4" />
  </svg>;
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
    if (section === 'shield' && listReferenceCatalogEntries('shield', category).length === 0) {
      throw new Error(`Missing local reference catalog entries for ${section}: ${category}`);
    }
  }
}
