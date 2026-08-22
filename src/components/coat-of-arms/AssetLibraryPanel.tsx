'use client';

/* Material thumbnails use the local bundled WebP source directly. */
/* eslint-disable @next/next/no-img-element */

import { listAssetsByKind } from '@/lib/coat-of-arms/assets';
import type { CoatAssetKind, CoatLocale, GeometryCoatAssetKind } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

interface AssetLibraryPanelProps {
  kind: GeometryCoatAssetKind;
  locale: CoatLocale;
  search: string;
  onAdd: (assetId: string) => void;
  allowedAssetIds?: readonly string[];
}

/** Renders locally bundled heraldic geometry only; no remote asset source is accepted. */
export function AssetLibraryPanel({ kind, locale, search, onAdd, allowedAssetIds }: AssetLibraryPanelProps) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const normalizedSearch = search.trim().toLowerCase();
  const allowedAssetIdSet = allowedAssetIds ? new Set(allowedAssetIds) : null;
  const assets = listAssetsByKind(kind).filter((asset) => (
    (!allowedAssetIdSet || allowedAssetIdSet.has(asset.id))
    && (!normalizedSearch || getSearchableAssetText(asset).includes(normalizedSearch))
  ));

  const libraryName = kind === 'charge' ? copy.charges : copy.ordinaries;

  return (
    <ul aria-label={copy.assetLibrary(libraryName)} className="m-0 grid list-none grid-cols-3 gap-1 p-0">
      {assets.map((asset) => {
        const cardName = asset.name[locale];
        return (
          <li key={asset.id}>
            <button
              aria-label={copy.addAsset(cardName)}
              className="coat-gallery-card grid w-full rounded border border-[color:var(--coat-line)] p-1 text-xs"
              onClick={() => onAdd(asset.id)}
              type="button"
            >
              {asset.rasterSrc ? <img
                alt=""
                className="aspect-[10/11] w-full object-contain"
                decoding="async"
                height={110}
                loading="lazy"
                src={asset.rasterSrc}
                width={100}
              /> : <svg
                aria-hidden="true"
                className="aspect-[10/11] w-full"
                viewBox="0 0 100 110"
              >
                <path d={asset.svgPath} fill="currentColor" />
              </svg>}
              <span aria-hidden="true" className="coat-gallery-card-name">{cardName}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function getSearchableAssetText(asset: ReturnType<typeof listAssetsByKind<GeometryCoatAssetKind>>[number]): string {
  return [asset.id, asset.name.en, asset.name.zh, ...(asset.searchTerms ?? [])].join(' ').toLowerCase();
}

export function listPanelAssets(kind: CoatAssetKind) {
  return listAssetsByKind(kind);
}
