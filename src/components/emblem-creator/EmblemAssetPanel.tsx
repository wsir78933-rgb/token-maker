'use client';

import Image from 'next/image';
import { useId, useState, type FormEvent } from 'react';

import { listEmblemCatalogAssets } from '@/lib/emblem-creator/catalog';
import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { requireEmblemImageUrl } from '@/lib/emblem-creator/image-url';
import { getEmblemTargetLayer } from '@/lib/emblem-creator/project';
import type { EmblemAssetCategory, EmblemCatalogAsset, EmblemLayerId, EmblemLocale } from '@/lib/emblem-creator/types';

export interface EmblemAssetPanelProps {
  locale: EmblemLocale;
  copy: EmblemCreatorCopy;
  activeCategory: EmblemAssetCategory;
  activeLayerId: EmblemLayerId;
  onCategoryChange(category: EmblemAssetCategory): void;
  onAddCatalogAsset(asset: EmblemCatalogAsset, targetLayerId: EmblemLayerId): void;
  onAddImageUrl(url: string, targetLayerId: EmblemLayerId): Promise<void>;
}

const categories: readonly EmblemAssetCategory[] = ['body', 'detail', 'crest'];

function describeFailure(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  return String(reason);
}

export function EmblemAssetPanel({
  locale, copy, activeCategory, activeLayerId, onCategoryChange, onAddCatalogAsset, onAddImageUrl,
}: EmblemAssetPanelProps) {
  const headingId = useId();
  const urlInputId = useId();
  const [imageUrl, setImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const assets = listEmblemCatalogAssets(activeCategory);

  function addCatalogAsset(asset: EmblemCatalogAsset) {
    setError(null);
    try {
      onAddCatalogAsset(asset, getEmblemTargetLayer(asset.category, activeLayerId));
    } catch (reason) {
      setError(`${copy.errors.operationFailed}: ${asset.id} — ${describeFailure(reason)}`);
    }
  }

  async function addImageUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAddingImage) return;
    setError(null);
    let validatedUrl: string;
    let targetLayerId: EmblemLayerId;
    try {
      validatedUrl = requireEmblemImageUrl(imageUrl);
    } catch (reason) {
      setError(`${copy.errors.invalidImageUrl}: ${JSON.stringify(imageUrl)} — ${describeFailure(reason)}`);
      return;
    }
    try {
      targetLayerId = getEmblemTargetLayer(activeCategory, activeLayerId);
    } catch (reason) {
      setError(`${copy.errors.operationFailed}: ${activeCategory}/${activeLayerId} — ${describeFailure(reason)}`);
      return;
    }
    setIsAddingImage(true);
    try {
      await onAddImageUrl(validatedUrl, targetLayerId);
      setImageUrl('');
    } catch (reason) {
      setError(`${copy.errors.loadImageFailed}: ${validatedUrl} — ${describeFailure(reason)}`);
    } finally {
      setIsAddingImage(false);
    }
  }

  return (
    <section lang={locale} aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <h2 id={headingId} className="text-sm font-semibold">{copy.panels.assets}</h2>
      <div className="grid grid-cols-3 gap-1">
        {categories.map((category) => (
          <button key={category} type="button" aria-pressed={activeCategory === category}
            onClick={() => onCategoryChange(category)}
            className="min-w-0 rounded-md border border-border px-2 py-2 text-xs aria-pressed:border-primary aria-pressed:bg-primary/10">
            {copy.assets.categories[category]}
          </button>
        ))}
      </div>
      <ul aria-label={copy.assets.chooseAsset} className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto lg:max-h-[26rem] lg:grid-cols-3">
        {assets.map((asset) => (
          <li key={asset.id} className="min-w-0">
            <button type="button" aria-label={`${copy.assets.chooseAsset}: ${asset.name[locale]}`}
              title={asset.name[locale]} onClick={() => addCatalogAsset(asset)}
              className="flex aspect-square w-full items-center justify-center rounded-md border border-border bg-background p-2 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
              <Image src={asset.publicPath} alt="" width={asset.width} height={asset.height} unoptimized
                className="h-full w-full object-contain" />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={addImageUrl} className="flex min-w-0 flex-col gap-2">
        <label htmlFor={urlInputId} className="text-xs font-medium">{copy.assets.imageUrl}</label>
        <input id={urlInputId} type="text" inputMode="url" value={imageUrl} disabled={isAddingImage}
          onChange={(event) => setImageUrl(event.target.value)}
          className="w-full min-w-0 rounded-md border border-border bg-background px-2 py-2 text-sm" />
        <button type="submit" disabled={isAddingImage}
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">
          {isAddingImage ? copy.assets.addingImage : copy.assets.addImage}
        </button>
      </form>
      {error && <p role="alert" className="break-words text-xs text-destructive">{error}</p>}
    </section>
  );
}
