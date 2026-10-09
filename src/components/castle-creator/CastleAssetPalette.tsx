'use client';

/* Castle thumbnails are local catalogue resources and intentionally use img for lazy loading. */
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import {
  castleAssetImagePath,
  listCastleAssets,
} from '@/lib/castle-creator/catalog';
import {
  CASTLE_BUILDING_COLORS,
  CASTLE_CATEGORIES,
  CASTLE_ROOF_COLORS,
  type CastleAsset,
  type CastleBuildingColor,
  type CastleCategory,
  type CastlePalette,
  type CastleRoofColor,
} from '@/lib/castle-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

export interface CastleAssetPaletteProps {
  locale: SiteLocale;
  category: CastleCategory;
  palette: CastlePalette;
  onCategoryChange: (category: CastleCategory) => void;
  onPaletteChange: (palette: CastlePalette) => void;
  onAddAsset: (asset: CastleAsset) => void;
}

type PaletteSheet = 'category' | 'palette' | null;

const MOBILE_THUMBNAIL_WIDTH = 76;
const MOBILE_THUMBNAIL_HEIGHT = 56;

export function CastleAssetPalette({
  locale,
  category,
  palette,
  onCategoryChange,
  onPaletteChange,
  onAddAsset,
}: CastleAssetPaletteProps) {
  const copy = getCastleCreatorCopy(locale);
  const [openSheet, setOpenSheet] = useState<PaletteSheet>(null);
  const [failedImagePaths, setFailedImagePaths] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const assets = useMemo(() => listCastleAssets(category), [category]);
  const categoryLabel = copy.library.categoryLabels[category];
  const selectedPaletteColor = category === 'buildingRoofs' ? palette.roof : palette.building;

  const runCallback = (callback: () => void): boolean => {
    setErrorMessage(null);
    try {
      callback();
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return false;
      }
      throw error;
    }
  };

  const reportImageFailure = (imagePath: string) => {
    setFailedImagePaths((currentPaths) => {
      if (currentPaths.has(imagePath)) return currentPaths;
      return new Set([...currentPaths, imagePath]);
    });
  };

  const selectCategory = (nextCategory: CastleCategory) => {
    if (runCallback(() => onCategoryChange(nextCategory))) {
      setOpenSheet(null);
    }
  };

  const updateBuildingColor = (building: CastleBuildingColor) => {
    runCallback(() => onPaletteChange({ ...palette, building }));
  };

  const updateRoofColor = (roof: CastleRoofColor) => {
    runCallback(() => onPaletteChange({ ...palette, roof }));
  };

  return (
    <section
      aria-label={copy.library.heading}
      className="flex h-[244px] max-h-[244px] min-h-0 w-full flex-col rounded-lg border border-white/10 bg-black/20 p-2 text-stone-100 md:h-auto md:max-h-none md:w-64 md:flex-none md:p-3"
      data-castle-asset-palette="true"
    >
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-stone-50">{copy.library.heading}</h2>
          <p className="hidden truncate text-xs text-stone-400 md:block">
            {copy.library.totalCountLabel(getTotalAssetCount())}
          </p>
          <p className="truncate text-[10px] leading-3 text-stone-500 md:hidden" data-castle-mobile-scroll-note>
            {copy.library.mobileScrollNote}
          </p>
        </div>
        <div className="flex shrink-0 gap-1 md:hidden">
          <button
            aria-label={categoryLabel}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 min-w-0 max-w-[8rem] items-center justify-center rounded-md border border-white/15 px-2 text-xs text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
            type="button"
            onClick={() => setOpenSheet('category')}
          >
            <span className="min-w-0 truncate">{categoryLabel}</span>
          </button>
          <button
            aria-label={copy.library.paletteColorLabel(category, selectedPaletteColor)}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/15 px-2 text-xs text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
            type="button"
            onClick={() => setOpenSheet('palette')}
          >
            {copy.library.paletteToggleLabel} {selectedPaletteColor}
          </button>
        </div>
      </header>

      <div className="mt-3 hidden space-y-3 md:block">
        <CategoryOptions
          category={category}
          copy={copy}
          onCategoryChange={selectCategory}
        />
        <PaletteOptions
          category={category}
          copy={copy}
          palette={palette}
          onBuildingColorChange={updateBuildingColor}
          onRoofColorChange={updateRoofColor}
        />
      </div>

      <div
        aria-label={categoryLabel}
        className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
        data-castle-asset-scroll="true"
      >
        {assets.length === 0 ? (
          <p className="py-6 text-center text-xs text-stone-400">{copy.library.emptyHint}</p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-[repeat(4,76px)] justify-between gap-1 p-0 md:grid-cols-3 md:justify-normal">
            {assets.map((asset) => (
              <AssetButton
                asset={asset}
                copy={copy}
                failedImagePaths={failedImagePaths}
                key={asset.id}
                onAddAsset={(selectedAsset) => runCallback(() => onAddAsset(selectedAsset))}
                onImageError={reportImageFailure}
                palette={palette}
              />
            ))}
          </ul>
        )}
      </div>

      {failedImagePaths.size > 0 ? (
        <p
          aria-live="polite"
          className="mt-2 max-h-10 shrink-0 overflow-y-auto break-all text-xs text-amber-200"
          data-castle-image-error="true"
          role="alert"
        >
          {[...failedImagePaths].join(' · ')}
        </p>
      ) : null}

      {errorMessage ? (
        <p aria-live="polite" className="mt-2 break-words text-xs text-rose-200" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {openSheet ? (
        <MobileOptionsSheet
          copy={copy}
          openSheet={openSheet}
          category={category}
          palette={palette}
          onClose={() => setOpenSheet(null)}
          onCategoryChange={selectCategory}
          onBuildingColorChange={updateBuildingColor}
          onRoofColorChange={updateRoofColor}
        />
      ) : null}
    </section>
  );
}

function AssetButton({
  asset,
  copy,
  failedImagePaths,
  onAddAsset,
  onImageError,
  palette,
}: {
  asset: CastleAsset;
  copy: ReturnType<typeof getCastleCreatorCopy>;
  failedImagePaths: ReadonlySet<string>;
  onAddAsset: (asset: CastleAsset) => void;
  onImageError: (imagePath: string) => void;
  palette: CastlePalette;
}) {
  const imagePath = castleAssetImagePath(asset.id, palette);
  const imageFailed = failedImagePaths.has(imagePath);
  const imageAlt = copy.library.assetImageAlt(asset.category, asset.number);
  const actionLabel = `${copy.library.addAsset}: ${imageAlt}`;

  return (
    <li className="min-w-0">
      <button
        aria-label={actionLabel}
        className="group flex h-14 min-h-14 w-full min-w-0 flex-col items-center justify-center rounded-md border border-white/10 bg-white/[0.03] p-0 text-left text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200 hover:border-white/30 md:h-[50px] md:min-h-[50px]"
        type="button"
        onClick={() => onAddAsset(asset)}
      >
        {imageFailed ? (
          <span
            aria-label={imagePath}
            className="flex h-[50px] w-full items-center justify-center overflow-hidden break-all px-1 text-[10px] leading-3 text-amber-200 md:h-[44px]"
            role="img"
          >
            {imagePath}
          </span>
        ) : (
          <img
            alt=""
            className="h-[50px] w-full object-contain md:h-[44px]"
            decoding="async"
            height={MOBILE_THUMBNAIL_HEIGHT}
            loading="lazy"
            src={imagePath}
            width={MOBILE_THUMBNAIL_WIDTH}
            onError={() => onImageError(imagePath)}
          />
        )}
        <span aria-hidden="true" className="sr-only">
          {copy.library.repeatAssetLabel}
        </span>
      </button>
    </li>
  );
}

function CategoryOptions({
  category,
  copy,
  onCategoryChange,
}: {
  category: CastleCategory;
  copy: ReturnType<typeof getCastleCreatorCopy>;
  onCategoryChange: (category: CastleCategory) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-xs font-medium text-stone-400">{copy.library.categoryPanelHeading}</legend>
      <div className="grid grid-cols-2 gap-1" role="radiogroup">
        {CASTLE_CATEGORIES.map((option) => {
          const isSelected = option === category;
          const label = copy.library.categoryLabels[option];
          return (
            <button
              aria-checked={isSelected}
              aria-label={`${label} · ${copy.library.categoryCountLabel(option)}`}
              className={`${optionClassName(isSelected)} relative`}
              role="radio"
              title={copy.library.categoryCountLabel(option)}
              type="button"
              key={option}
              onClick={() => onCategoryChange(option)}
            >
              <span className="min-w-0 truncate">{label}</span>
              {isSelected ? <span aria-hidden="true" className="absolute right-2">✓</span> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function PaletteOptions({
  category,
  copy,
  palette,
  onBuildingColorChange,
  onRoofColorChange,
}: {
  category: CastleCategory;
  copy: ReturnType<typeof getCastleCreatorCopy>;
  palette: CastlePalette;
  onBuildingColorChange: (color: CastleBuildingColor) => void;
  onRoofColorChange: (color: CastleRoofColor) => void;
}) {
  const isRoofPalette = category === 'buildingRoofs';
  return (
    <div className="space-y-2">
      <fieldset>
        <legend className="mb-1 text-xs font-medium text-stone-400">{copy.library.paletteHeading(category)}</legend>
        <div className={`grid gap-1 ${isRoofPalette ? 'grid-cols-5' : 'grid-cols-4'}`} role="radiogroup">
          {isRoofPalette
            ? CASTLE_ROOF_COLORS.map((color) => (
              <PaletteButton
                key={`roof-${color}`}
                label={copy.library.paletteColorLabel(category, color)}
                selected={palette.roof === color}
                onClick={() => onRoofColorChange(color)}
              />
            ))
            : CASTLE_BUILDING_COLORS.map((color) => (
              <PaletteButton
                key={`building-${color}`}
                label={copy.library.paletteColorLabel(category, color)}
                selected={palette.building === color}
                onClick={() => onBuildingColorChange(color)}
              />
            ))}
        </div>
      </fieldset>
      {category === 'gates' ? (
        <p className="text-xs leading-4 text-stone-500">{copy.library.gatePaletteNote}</p>
      ) : null}
      <p className="text-xs leading-4 text-stone-500">{copy.library.paletteNote}</p>
    </div>
  );
}

function PaletteButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-checked={selected}
      aria-label={label}
      className={optionClassName(selected)}
      role="radio"
      type="button"
      onClick={onClick}
    >
      <span aria-hidden="true" className="size-4 rounded-full border border-white/20 bg-stone-500" />
      <span aria-hidden="true" className="text-[10px]">{label.replace(/\D/g, '')}</span>
      {selected ? <span aria-hidden="true">✓</span> : null}
    </button>
  );
}

function MobileOptionsSheet({
  copy,
  openSheet,
  category,
  palette,
  onClose,
  onCategoryChange,
  onBuildingColorChange,
  onRoofColorChange,
}: {
  copy: ReturnType<typeof getCastleCreatorCopy>;
  openSheet: Exclude<PaletteSheet, null>;
  category: CastleCategory;
  palette: CastlePalette;
  onClose: () => void;
  onCategoryChange: (category: CastleCategory) => void;
  onBuildingColorChange: (color: CastleBuildingColor) => void;
  onRoofColorChange: (color: CastleRoofColor) => void;
}) {
  return (
    <Dialog open onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent
        className="max-h-[min(624px,calc(100dvh-1.5rem))] w-full max-w-[390px] overflow-y-auto rounded-t-2xl border-white/15 bg-stone-950 p-3 text-stone-100 sm:rounded-t-2xl sm:p-3"
        data-castle-options-sheet={openSheet}
      >
        <div className="flex items-center justify-between gap-3">
          <DialogTitle className="text-sm font-semibold text-stone-50">
            {openSheet === 'category' ? copy.library.categoryPanelHeading : copy.library.paletteHeading(category)}
          </DialogTitle>
          <button
            aria-label={copy.library.categoryPanelCloseLabel}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/15 px-3 text-xs text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
            type="button"
            onClick={onClose}
          >
            {copy.library.categoryPanelCloseLabel}
          </button>
        </div>
        <DialogDescription className="sr-only">
          {openSheet === 'category'
            ? copy.library.categoryPanelSummary(CASTLE_CATEGORIES.length, getTotalAssetCount())
            : copy.library.paletteNote}
        </DialogDescription>
        {openSheet === 'category' ? (
          <div className="mt-3">
            <CategoryOptions
              category={category}
              copy={copy}
              onCategoryChange={onCategoryChange}
            />
          </div>
        ) : (
          <div className="mt-3">
            <PaletteOptions
              category={category}
              copy={copy}
              palette={palette}
              onBuildingColorChange={onBuildingColorChange}
              onRoofColorChange={onRoofColorChange}
            />
          </div>
        )}
        <button
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white/15 px-3 text-xs text-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
          type="button"
          onClick={onClose}
        >
          {copy.library.categoryPanelReturnLabel}
        </button>
      </DialogContent>
    </Dialog>
  );
}

function optionClassName(selected: boolean): string {
  return [
    'inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-md border px-2 text-left text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200',
    selected
      ? 'border-stone-200 bg-stone-100 text-stone-950'
      : 'border-white/10 bg-white/[0.03] text-stone-200 hover:border-white/30',
  ].join(' ');
}


function getTotalAssetCount(): number {
  return CASTLE_CATEGORIES.reduce((totalAssetCount, category) => (
    totalAssetCount + listCastleAssets(category).length
  ), 0);
}
