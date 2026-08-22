'use client';

/* The editor previews browser-local user-selectable WebP material directly. */
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Search } from 'lucide-react';
import { listAssetsByKind } from '@/lib/coat-of-arms/assets';
import type { CoatAsset, CoatLocale, CoatRasterVariant, CoatRasterVariantId } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy, tokenPaletteCategories, type TokenPaletteCategory } from './workbench-copy';

type TokenAsset = Extract<CoatAsset, { kind: 'charge' }>;
const featuredTokenAssetIds = new Set([
  'material-animal-griffin-rampant',
  'material-animal-wolf-rampant',
  'material-symbol-caduceus',
  'material-symbol-shooting-star',
  'material-symbol-sun-and-moon',
  'material-object-castle-tower',
  'material-object-mariner-anchor',
  'material-plant-fleur-de-lis',
  'material-plant-tudor-rose',
]);

interface TokenGalleryCard {
  readonly asset: TokenAsset;
  readonly rasterVariant?: CoatRasterVariant;
}

function matchesTokenSearch(
  asset: TokenAsset,
  rawQuery: string,
): boolean {
  const normalizedQuery = rawQuery.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) return true;
  return [asset.id, asset.name.en, asset.name.zh, ...(asset.searchTerms ?? [])]
    .join(' ')
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}

/** Presents the complete browser-local charge catalog as searchable token material. */
export function TargetTokenPalette({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).palettes.token;
  const { error, run } = usePanelCommandError(locale);
  const [activeCategory, setActiveCategory] = useState<TokenPaletteCategory>('featured');
  const [search, setSearch] = useState('');
  const tokenAssets = listAssetsByKind('charge').filter((asset) => (
    (activeCategory === 'featured' ? featuredTokenAssetIds.has(asset.id) : asset.category === activeCategory)
      && matchesTokenSearch(asset, search)
  ));
  const tokenCards = createTokenGalleryCards(tokenAssets);

  return (
    <section aria-label={copy.library} className="coat-target-token-library">
      <h2>{copy.heading}</h2>
      <p>{copy.description}</p>
      {error ? <p role="alert">{error}</p> : null}
      <div aria-label={copy.categoryFilter} className="flex flex-wrap gap-1" role="group">
        {tokenPaletteCategories.map((category) => <button
          aria-pressed={activeCategory === category}
          className={`rounded border border-[color:var(--coat-line)] px-2 py-1 text-xs ${activeCategory === category ? 'bg-[color:var(--coat-line)] text-[color:var(--coat-panel)]' : ''}`}
          key={category}
          onClick={() => setActiveCategory(category)}
          type="button"
        >{copy.categories[category]}</button>)}
      </div>
      <label className="coat-target-search">
        <Search aria-hidden="true" className="coat-target-search-icon" data-search-glyph="true" />
        <span className="sr-only">{copy.search}</span>
        <input aria-label={copy.search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} type="search" value={search} />
      </label>
      {tokenCards.length === 0 ? <p role="status">{copy.noResults}</p> : null}
      <div className="coat-target-token-grid">
        {tokenCards.map(({ asset, rasterVariant }) => {
          const cardName = rasterVariant
            ? `${asset.name[locale]} — ${rasterVariant.id.toUpperCase()}`
            : asset.name[locale];
          return <button
            aria-label={copy.addAsset(cardName)}
            className="coat-gallery-card"
            key={`${asset.id}-${rasterVariant?.id ?? 'vector'}`}
            onClick={() => run(createTokenLayerCommand(asset.id, rasterVariant?.id))}
            type="button"
          >
            {rasterVariant
              ? <img alt="" src={rasterVariant.src} />
              : asset.rasterSrc
                ? <img alt="" src={asset.rasterSrc} />
              : <svg aria-hidden="true" viewBox="0 0 100 110"><path d={asset.svgPath} fill="#e9e9e9" /></svg>}
            <span aria-hidden="true" className="coat-gallery-card-name">{cardName}</span>
          </button>
        })}
      </div>
    </section>
  );
}

function createTokenGalleryCards(tokenAssets: readonly TokenAsset[]): readonly TokenGalleryCard[] {
  return tokenAssets.flatMap((asset) => (
    asset.rasterVariants
      ? asset.rasterVariants.map((rasterVariant) => ({ asset, rasterVariant }))
      : [{ asset }]
  ));
}

function createTokenLayerCommand(assetId: string, rasterVariantId?: CoatRasterVariantId) {
  return {
    type: 'add-layer' as const,
    assetId,
    ...(rasterVariantId ? { rasterVariantId } : {}),
  };
}
