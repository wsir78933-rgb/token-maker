'use client';

import { useId, useState } from 'react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { EMBLEM_LAYER_ORDER, type EmblemLayerId, type EmblemLocale, type EmblemProject } from '@/lib/emblem-creator/types';

export interface EmblemLayerPanelProps {
  locale: EmblemLocale;
  project: EmblemProject;
  copy: EmblemCreatorCopy;
  activeLayerId: EmblemLayerId;
  onActiveLayerChange(layerId: EmblemLayerId): void;
  onVisibilityChange(layerId: EmblemLayerId, visible: boolean): void;
  onClearActiveLayer(): void;
}

export function EmblemLayerPanel({
  locale, project, copy, activeLayerId, onActiveLayerChange, onVisibilityChange, onClearActiveLayer,
}: EmblemLayerPanelProps) {
  const headingId = useId();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  function runLayerAction(layerId: EmblemLayerId, action: () => void) {
    setError(null);
    setStatus(null);
    try {
      action();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      setError(`${copy.errors.operationFailed}: ${copy.layers.names[layerId]} — ${message}`);
    }
  }

  return (
    <section lang={locale} aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <h2 id={headingId} className="text-sm font-semibold">{copy.panels.layers}</h2>
      <button type="button" onClick={() => runLayerAction(activeLayerId, () => {
        onClearActiveLayer();
        setStatus(`${copy.layers.names[activeLayerId]}: ${copy.layers.emptyLayer}`);
      })}
        className="rounded-md border border-border px-2 py-2 text-xs text-destructive">{copy.layers.clearActiveLayer}</button>
      <ol className="flex flex-col gap-1">
        {EMBLEM_LAYER_ORDER.filter((layerId) => project.layers[layerId].elements.length > 0).map((layerId) => {
          const layer = project.layers[layerId];
          const name = copy.layers.names[layerId];
          const visibilityLabel = layer.visible ? copy.layers.hideLayer : copy.layers.showLayer;
          return (
            <li key={layerId} className="flex min-w-0 items-center gap-1">
              <button type="button" aria-pressed={activeLayerId === layerId}
                onClick={() => runLayerAction(layerId, () => onActiveLayerChange(layerId))}
                className="min-w-0 flex-1 rounded-md border border-border px-2 py-2 text-left text-xs aria-pressed:border-primary aria-pressed:bg-primary/10">
                {name}
              </button>
              <button type="button" aria-label={`${visibilityLabel}: ${name}`} aria-pressed={layer.visible}
                onClick={() => runLayerAction(layerId, () => onVisibilityChange(layerId, !layer.visible))}
                className="shrink-0 rounded-md border border-border px-2 py-2 text-xs">
                {visibilityLabel}
              </button>
            </li>
          );
        })}
      </ol>
      {status && <p role="status" className="text-xs text-muted-foreground">{status}</p>}
      {error && <p role="alert" className="break-words text-xs text-destructive">{error}</p>}
    </section>
  );
}
