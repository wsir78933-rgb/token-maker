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

  return (
    <ul aria-label={copy.assetLibrary(kind === 'charge' ? copy.charges : copy.ordinaries)} className="grid gap-2 sm:grid-cols-2">
      {assets.map((asset) => (
        <li key={asset.id} className="flex items-center justify-between gap-2 rounded border border-[color:var(--site-border-soft)] p-2">
          {asset.rasterSrc ? <img
            alt=""
            className="h-10 w-10 shrink-0 rounded bg-[color:var(--site-panel-strong)] object-contain p-1"
            src={asset.rasterSrc}
          /> : <svg
            aria-label={copy.previewAsset(asset.name[locale])}
            className="h-10 w-10 shrink-0 rounded bg-[color:var(--site-panel-strong)] p-1 text-[color:var(--site-accent-strong)]"
            viewBox="0 0 100 110"
          >
            <path d={asset.svgPath} fill="currentColor" />
          </svg>}
          <span className="min-w-0 flex-1">{asset.name[locale]}</span>
          <button type="button" onClick={() => onAdd(asset.id)}>
            {copy.addAsset(asset.name[locale])}
          </button>
        </li>
      ))}
    </ul>
  );
}

function getSearchableAssetText(asset: ReturnType<typeof listAssetsByKind<GeometryCoatAssetKind>>[number]): string {
  return [asset.id, asset.name.en, asset.name.zh, ...(asset.searchTerms ?? [])].join(' ').toLowerCase();
}

export function listPanelAssets(kind: CoatAssetKind) {
  return listAssetsByKind(kind);
}
