'use client';

import { useCallback, useEffect, useId, useState } from 'react';

import { CastleSelectedPieceLayers } from '@/components/castle-creator/CastleSelectedPieceLayers';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import { CASTLE_LAYER_IDS } from '@/lib/castle-creator/types';
import type {
  CastleCanvasSettings,
  CastleLayerId,
  CastlePiece,
  CastleProject,
} from '@/lib/castle-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

export interface CastleSettingsPanelProps {
  locale: SiteLocale;
  project: CastleProject;
  selectedPiece: CastlePiece | null;
  onActiveLayerChange: (layerId: CastleLayerId) => void;
  onLayerVisibilityChange: (layerId: CastleLayerId, visible: boolean) => void;
  onClearLayer: (layerId: CastleLayerId) => void;
  onCanvasSettingsChange: (settings: CastleCanvasSettings) => void;
  onMovePieceToLayer: (pieceId: string, layerId: CastleLayerId) => void;
  disabled?: boolean;
  onClearAll: () => void;
}

export function CastleSettingsPanel({
  locale,
  project,
  selectedPiece,
  onActiveLayerChange,
  onLayerVisibilityChange,
  onClearLayer,
  onCanvasSettingsChange,
  onMovePieceToLayer,
  disabled = false,
  onClearAll,
}: CastleSettingsPanelProps) {
  const copy = getCastleCreatorCopy(locale);
  const [layersExpanded, setLayersExpanded] = useState(false);
  const [canvasSettingsExpanded, setCanvasSettingsExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(project.canvas.backgroundImageUrl ?? '');
  const [canvasWidth, setCanvasWidth] = useState(String(project.canvas.width));
  const [canvasHeight, setCanvasHeight] = useState(String(project.canvas.height));
  const layersId = useId();
  const canvasSettingsId = useId();
  const layersContentId = `${layersId}-layers`;
  const canvasSettingsContentId = `${canvasSettingsId}-canvas`;
  const backgroundImageInputId = useId();

  useEffect(() => {
    let isCurrentProject = true;
    void Promise.resolve().then(() => {
      if (!isCurrentProject) return;
      setBackgroundImageUrl(project.canvas.backgroundImageUrl ?? '');
      setCanvasWidth(String(project.canvas.width));
      setCanvasHeight(String(project.canvas.height));
    });
    return () => {
      isCurrentProject = false;
    };
  }, [project.canvas.backgroundColor, project.canvas.backgroundImageUrl, project.canvas.height, project.canvas.width]);

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

  const applyBackgroundImage = () => {
    runCallback(() => onCanvasSettingsChange({
      ...project.canvas,
      backgroundImageUrl: normalizeBackgroundImageUrl(backgroundImageUrl),
    }));
  };

  const applyBackgroundColor = (backgroundColor: string) => {
    runCallback(() => onCanvasSettingsChange({
      ...project.canvas,
      backgroundColor,
    }));
  };

  const applyCanvasDimensions = () => {
    try {
      const width = parseCanvasDimension(canvasWidth, copy.settings.canvasWidthLabel);
      const height = parseCanvasDimension(canvasHeight, copy.settings.canvasHeightLabel);
      runCallback(() => onCanvasSettingsChange({
        ...project.canvas,
        width,
        height,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }
      throw error;
    }
  };

  return (
    <section
      aria-label={copy.settings.panelHeading}
      className="mt-0 h-[244px] max-h-[244px] min-h-0 overflow-y-auto overscroll-contain rounded-lg border border-white/10 bg-black/20 text-stone-100 md:mt-3 md:h-auto md:max-h-none md:overflow-visible md:overscroll-auto"
      data-castle-settings-scroll="true"
      data-castle-settings-panel="true"
    >
      <div className="px-3 pb-3 pt-3">
        <h2 className="text-sm font-semibold text-stone-50">{copy.settings.panelHeading}</h2>
        <p className="mt-1 text-xs leading-5 text-stone-400">{copy.settings.panelHint}</p>
      </div>
      {errorMessage ? (
        <p className="mx-3 mb-3 break-words text-xs text-rose-200" role="alert">{errorMessage}</p>
      ) : null}

      <div
        className="border-t border-white/10 px-3 py-3"
      >
        <SectionToggle
          contentId={layersContentId}
          expanded={layersExpanded}
          label={copy.settings.layersHeading}
          onToggle={() => setLayersExpanded((expanded) => !expanded)}
        />
        {layersExpanded ? (
          <section aria-labelledby={`${layersContentId}-label`} id={layersContentId}>
            <p className="mt-1 text-xs leading-5 text-stone-500">{copy.settings.scrollHint}</p>
            <LayerControls
              copy={copy}
              locale={locale}
              project={project}
              selectedPiece={selectedPiece}
              disabled={disabled}
              onMovePieceToLayer={(pieceId, layerId) => (
                runCallback(() => onMovePieceToLayer(pieceId, layerId))
              )}
              onActiveLayerChange={(layerId) => runCallback(() => onActiveLayerChange(layerId))}
              onLayerVisibilityChange={(layerId, visible) => (
                runCallback(() => onLayerVisibilityChange(layerId, visible))
              )}
              onClearLayer={(layerId) => runCallback(() => onClearLayer(layerId))}
            />
          </section>
        ) : null}

        <SectionToggle
          contentId={canvasSettingsContentId}
          expanded={canvasSettingsExpanded}
          label={copy.settings.canvasHeading}
          onToggle={() => setCanvasSettingsExpanded((expanded) => !expanded)}
        />
        {canvasSettingsExpanded ? (
          <section aria-labelledby={`${canvasSettingsContentId}-label`} id={canvasSettingsContentId}>
            <p className="mt-1 text-xs leading-5 text-stone-500">{copy.settings.scrollHint}</p>
            <CanvasControls
              backgroundColor={project.canvas.backgroundColor}
              backgroundImageInputId={backgroundImageInputId}
              backgroundImageUrl={backgroundImageUrl}
              canvasHeight={canvasHeight}
              canvasWidth={canvasWidth}
              copy={copy}
              onBackgroundColorChange={applyBackgroundColor}
              onBackgroundImageUrlChange={setBackgroundImageUrl}
              onCanvasHeightChange={setCanvasHeight}
              onCanvasWidthChange={setCanvasWidth}
              onApplyBackgroundImage={applyBackgroundImage}
              onApplyCanvasDimensions={applyCanvasDimensions}
            />
            <button
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-rose-300/40 px-3 py-2 text-sm text-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200 hover:border-rose-200"
              type="button"
              onClick={() => runCallback(onClearAll)}
            >
              {copy.settings.clearAllConfirmLabel}
            </button>
          </section>
        ) : null}
      </div>
    </section>
  );
}

function SectionToggle({
  contentId,
  expanded,
  label,
  onToggle,
}: {
  contentId: string;
  expanded: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      aria-controls={contentId}
      aria-expanded={expanded}
      aria-label={label}
      className="mt-1 flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-white/10 px-3 py-2 text-left text-sm font-semibold text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200 hover:border-white/30"
      id={`${contentId}-label`}
      type="button"
      onClick={onToggle}
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-xs text-stone-400">
        {expanded ? '−' : '+'}
      </span>
    </button>
  );
}

function LayerControls({
  copy,
  locale,
  project,
  selectedPiece,
  disabled,
  onMovePieceToLayer,
  onActiveLayerChange,
  onLayerVisibilityChange,
  onClearLayer,
}: {
  copy: ReturnType<typeof getCastleCreatorCopy>;
  locale: SiteLocale;
  project: CastleProject;
  selectedPiece: CastlePiece | null;
  disabled: boolean;
  onMovePieceToLayer: (pieceId: string, layerId: CastleLayerId) => boolean;
  onActiveLayerChange: (layerId: CastleLayerId) => void;
  onLayerVisibilityChange: (layerId: CastleLayerId, visible: boolean) => void;
  onClearLayer: (layerId: CastleLayerId) => void;
}) {
  const [dragTarget, setDragTarget] = useState<{
    pieceId: string;
    sourceLayer: CastleLayerId;
    targetLayer: CastleLayerId;
  } | null>(null);
  const dragTargetLayer = !disabled
    && selectedPiece
    && dragTarget?.pieceId === selectedPiece.id
    && dragTarget.sourceLayer === selectedPiece.layerId
    ? dragTarget.targetLayer
    : null;
  const selectedPieceId = selectedPiece?.id;
  const selectedPieceLayerId = selectedPiece?.layerId;

  const updatePieceLayerDropTarget = useCallback((targetLayer: CastleLayerId | null) => {
    if (!targetLayer || !selectedPieceId || !selectedPieceLayerId || disabled) {
      setDragTarget(null);
      return;
    }

    setDragTarget({
      pieceId: selectedPieceId,
      sourceLayer: selectedPieceLayerId,
      targetLayer,
    });
  }, [disabled, selectedPieceId, selectedPieceLayerId]);

  const moveSelectedPieceToLayer = useCallback((pieceId: string, targetLayer: CastleLayerId) => {
    if (selectedPieceId !== pieceId || selectedPieceLayerId === targetLayer) return false;
    return onMovePieceToLayer(pieceId, targetLayer);
  }, [onMovePieceToLayer, selectedPieceId, selectedPieceLayerId]);

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-stone-50">{copy.settings.layersHeading}</legend>
      <ul aria-label={copy.settings.layersHeading} className="mt-2 space-y-1">
        {CASTLE_LAYER_IDS.map((layerId) => {
          const isActive = project.activeLayer === layerId;
          const isVisible = project.visibleLayers[layerId];
          const layerLabel = copy.editor.layerLabels[layerId];
          return (
            <li
              className={[
                'rounded-md transition-colors',
                dragTargetLayer === layerId ? 'ring-2 ring-amber-200/80' : '',
              ].join(' ')}
              data-castle-layer-target={layerId}
              key={layerId}
            >
              <div
                className={[
                  'flex min-h-11 items-center gap-1 rounded-md border px-1',
                  isActive ? 'border-stone-200 bg-white/[0.1]' : 'border-white/10 bg-white/[0.03]',
                ].join(' ')}
              >
                <button
                  aria-label={copy.editor.activeLayerLabel(layerId)}
                  aria-pressed={isActive}
                  className="min-h-11 min-w-0 flex-1 truncate text-left text-sm text-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
                  type="button"
                  onClick={() => onActiveLayerChange(layerId)}
                >
                  {layerLabel}
                </button>
                {selectedPiece?.layerId === layerId ? (
                  <CastleSelectedPieceLayers
                    key={`${selectedPiece.id}:${selectedPiece.layerId}:${disabled ? 'disabled' : 'enabled'}`}
                    disabled={disabled}
                    locale={locale}
                    onDragTargetLayerChange={updatePieceLayerDropTarget}
                    onMovePieceToLayer={moveSelectedPieceToLayer}
                    selectedPiece={selectedPiece}
                    visibleLayers={project.visibleLayers}
                  />
                ) : null}
                <label className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 text-xs text-stone-400">
                  <span className="sr-only">{copy.settings.layerVisibilityLabel}: {layerLabel}</span>
                  <input
                    aria-label={`${copy.settings.layerVisibilityLabel}: ${layerLabel}`}
                    checked={isVisible}
                    className="size-4 accent-stone-100"
                    type="checkbox"
                    onChange={(event) => onLayerVisibilityChange(layerId, event.currentTarget.checked)}
                  />
                  <span aria-hidden="true">{isVisible ? '◉' : '○'}</span>
                </label>
                <button
                  aria-label={`${copy.settings.clearLayerLabel}: ${layerLabel}`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 text-xs text-stone-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200 hover:bg-white/[0.08]"
                  type="button"
                  onClick={() => onClearLayer(layerId)}
                >
                  {copy.settings.clearLayerLabel}
                </button>
              </div>
              {!isVisible ? (
                <p className="mt-0.5 px-2 text-[10px] leading-4 text-amber-100/80">
                  {copy.settings.hiddenLayerHint}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {selectedPiece ? (
        <p className="mt-1 whitespace-nowrap text-xs leading-5 text-stone-400">{copy.settings.pieceLayerDragHint}</p>
      ) : (
        <p className="mt-2 text-xs leading-5 text-stone-400">{copy.settings.pieceLayerEmptyHint}</p>
      )}
    </fieldset>
  );
}

function CanvasControls({
  backgroundColor,
  backgroundImageInputId,
  backgroundImageUrl,
  canvasHeight,
  canvasWidth,
  copy,
  onBackgroundColorChange,
  onBackgroundImageUrlChange,
  onCanvasHeightChange,
  onCanvasWidthChange,
  onApplyBackgroundImage,
  onApplyCanvasDimensions,
}: {
  backgroundColor: string;
  backgroundImageInputId: string;
  backgroundImageUrl: string;
  canvasHeight: string;
  canvasWidth: string;
  copy: ReturnType<typeof getCastleCreatorCopy>;
  onBackgroundColorChange: (backgroundColor: string) => void;
  onBackgroundImageUrlChange: (backgroundImageUrl: string) => void;
  onCanvasHeightChange: (canvasHeight: string) => void;
  onCanvasWidthChange: (canvasWidth: string) => void;
  onApplyBackgroundImage: () => void;
  onApplyCanvasDimensions: () => void;
}) {
  return (
    <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
      <h3 className="text-sm font-semibold text-stone-50">{copy.settings.canvasHeading}</h3>
      <div className="space-y-1">
        <label className="block text-xs text-stone-300" htmlFor={backgroundImageInputId}>
          {copy.settings.backgroundImageUrlLabel}
        </label>
        <div className="flex gap-2">
          <input
            aria-label={copy.settings.backgroundImageUrlLabel}
            className="min-h-11 min-w-0 flex-1 rounded-md border border-white/15 bg-black/20 px-2 text-sm text-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-200"
            id={backgroundImageInputId}
            type="url"
            value={backgroundImageUrl}
            onChange={(event) => onBackgroundImageUrlChange(event.currentTarget.value)}
          />
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-3 text-xs text-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
            type="button"
            onClick={onApplyBackgroundImage}
          >
            {copy.settings.backgroundImageApplyLabel}
          </button>
        </div>
      </div>

      <label className="flex min-h-11 items-center justify-between gap-3 text-sm text-stone-200">
        <span>{copy.settings.backgroundColorLabel}</span>
        <input
          aria-label={copy.settings.backgroundColorLabel}
          className="size-11 rounded-md border border-white/15 bg-transparent p-1"
          type="color"
          value={backgroundColor}
          onChange={(event) => onBackgroundColorChange(event.currentTarget.value)}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-stone-50">{copy.settings.canvasHeading}</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs text-stone-300">
            <span className="block">{copy.settings.canvasWidthLabel}</span>
            <input
              aria-label={copy.settings.canvasWidthLabel}
              className="min-h-11 w-full rounded-md border border-white/15 bg-black/20 px-2 text-sm text-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-200"
              inputMode="numeric"
              min="0"
              step="1"
              type="number"
              value={canvasWidth}
              onChange={(event) => onCanvasWidthChange(event.currentTarget.value)}
            />
          </label>
          <label className="space-y-1 text-xs text-stone-300">
            <span className="block">{copy.settings.canvasHeightLabel}</span>
            <input
              aria-label={copy.settings.canvasHeightLabel}
              className="min-h-11 w-full rounded-md border border-white/15 bg-black/20 px-2 text-sm text-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-200"
              inputMode="numeric"
              min="0"
              step="1"
              type="number"
              value={canvasHeight}
              onChange={(event) => onCanvasHeightChange(event.currentTarget.value)}
            />
          </label>
        </div>
        <button
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white/15 px-3 text-sm text-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200 hover:border-white/30"
          type="button"
          onClick={onApplyCanvasDimensions}
        >
          {copy.settings.applyCanvasSizeLabel}
        </button>
        <p className="mt-1 text-xs leading-5 text-stone-500">{copy.settings.defaultCanvasSizeLabel}</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">{copy.settings.canvasCoordinatesHint}</p>
      </fieldset>
    </div>
  );
}

function normalizeBackgroundImageUrl(value: string): string | null {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function parseCanvasDimension(rawValue: string, fieldLabel: string): number {
  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue) || !Number.isInteger(numericValue) || numericValue < 0) {
    throw new Error(
      `${fieldLabel} must be a finite non-negative integer. Received ${JSON.stringify(rawValue)}.`,
    );
  }
  return numericValue;
}
