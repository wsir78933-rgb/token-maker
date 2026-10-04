'use client';

import Image from 'next/image';
import { useId, useState, type FormEvent } from 'react';

import { listEmblemCatalogAssets } from '@/lib/emblem-creator/catalog';
import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { requireEmblemImageUrl } from '@/lib/emblem-creator/image-url';
import { getEmblemTargetLayer } from '@/lib/emblem-creator/project';
import type { EmblemAssetCategory, EmblemCatalogAsset, EmblemLayerId, EmblemLocale, EmblemProject } from '@/lib/emblem-creator/types';

export interface EmblemAssetPanelProps {
  locale: EmblemLocale;
  copy: EmblemCreatorCopy;
  project: EmblemProject;
  activeCategory: EmblemAssetCategory;
  onCategoryChange(category: EmblemAssetCategory): void;
  onAddCatalogAsset(asset: EmblemCatalogAsset, targetLayerId: EmblemLayerId): void;
  onAddImageUrl(url: string, category: EmblemAssetCategory, targetLayerId: EmblemLayerId): Promise<void>;
}

const categories: readonly EmblemAssetCategory[] = ['body', 'detail', 'crest'];

function describeFailure(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  return String(reason);
}

function isBodyLayerCapacityError(reason: unknown): boolean {
  return reason instanceof RangeError && reason.message.startsWith('No empty body layer is available;');
}

export function EmblemAssetPanel({
  locale, copy, project, activeCategory, onCategoryChange, onAddCatalogAsset, onAddImageUrl,
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
      onAddCatalogAsset(asset, getEmblemTargetLayer(asset.category, project));
    } catch (reason) {
      const prefix = isBodyLayerCapacityError(reason) ? copy.errors.bodyLayersFull : copy.errors.operationFailed;
      setError(`${prefix}: ${asset.id} — ${describeFailure(reason)}`);
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
      targetLayerId = getEmblemTargetLayer(activeCategory, project);
    } catch (reason) {
      const prefix = isBodyLayerCapacityError(reason) ? copy.errors.bodyLayersFull : copy.errors.operationFailed;
      setError(`${prefix}: ${activeCategory} — ${describeFailure(reason)}`);
      return;
    }
    setIsAddingImage(true);
    try {
      await onAddImageUrl(validatedUrl, activeCategory, targetLayerId);
      setImageUrl('');
    } catch (reason) {
      const failure = describeFailure(reason);
      setError(failure.startsWith(copy.errors.bodyLayersFull)
        ? failure
        : `${copy.errors.loadImageFailed}: ${validatedUrl} — ${failure}`);
    } finally {
      setIsAddingImage(false);
    }
  }

  return (
    <section lang={locale} aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3 lg:h-full lg:min-h-0">
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
      <ul aria-label={copy.assets.chooseAsset} className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto lg:flex-1 lg:min-h-0 lg:max-h-none lg:content-start lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((asset) => (
          <li key={asset.id} className="min-w-0">
            <button type="button" aria-label={`${copy.assets.chooseAsset}: ${asset.name[locale]}`}
              title={asset.name[locale]} onClick={() => addCatalogAsset(asset)}
              className="flex aspect-square w-full items-center justify-center rounded-md border border-border bg-background p-2 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
              style={{
                backgroundColor: '#fffaf0',
              }}>
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
