'use client';

import { useId, useState, type FormEvent } from 'react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { EMBLEM_CANVAS, EMBLEM_LAYER_ORDER, type EmblemElement, type EmblemElementTransform, type EmblemLocale, type EmblemProject } from '@/lib/emblem-creator/types';

export interface EmblemPropertiesPanelProps {
  locale: EmblemLocale;
  project: EmblemProject;
  copy: EmblemCreatorCopy;
  selectedElementId: string | null;
  showEditBounds: boolean;
  onElementTransform(elementId: string, transform: EmblemElementTransform): void;
  onDeleteSelected(): void;
  onEditBoundsChange(show: boolean): void;
}

interface NumericPropertyProps {
  label: string;
  value: number;
  copy: EmblemCreatorCopy;
  positive?: boolean;
  coordinateLimit?: number;
  applyLabel?: string;
  onCommit(value: number): void;
}

function requireNumericProperty(rawValue: string, label: string, copy: EmblemCreatorCopy, positive: boolean, coordinateLimit?: number): number {
  const number = Number(rawValue);
  if (rawValue.trim() === '' || !Number.isFinite(number)) {
    throw new Error(`${copy.properties.invalidNumber}: ${label} = ${JSON.stringify(rawValue)}`);
  }
  if (positive && number <= 0) {
    throw new Error(`${copy.properties.positiveSize}: ${label} = ${JSON.stringify(rawValue)}`);
  }
  if (coordinateLimit !== undefined && (number < 0 || number > coordinateLimit)) {
    throw new Error(`${copy.properties.coordinateRange} ${coordinateLimit}: ${label} = ${JSON.stringify(rawValue)}`);
  }
  return number;
}

function NumericProperty({ label, value, copy, positive = false, coordinateLimit, applyLabel, onCommit }: NumericPropertyProps) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState<string | null>(null);

  function commitDraft() {
    try {
      onCommit(requireNumericProperty(draft, label, copy, positive, coordinateLimit));
      setError(null);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      setError(`${copy.errors.operationFailed}: ${label} = ${JSON.stringify(draft)} — ${message}`);
    }
  }

  function submitProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitDraft();
  }

  return (
    <form onSubmit={submitProperty} className="flex min-w-0 flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-medium">{label}</label>
      <input id={inputId} type="text" inputMode="decimal" value={draft} aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => { setDraft(event.target.value); setError(null); }}
        onBlur={applyLabel ? undefined : commitDraft}
        className="w-full min-w-0 rounded-md border border-border bg-background px-2 py-2 text-sm" />
      {applyLabel && <button type="submit" className="rounded-md border border-border px-2 py-2 text-xs">{applyLabel}</button>}
      {error && <p id={errorId} role="alert" className="break-words text-xs text-destructive">{error}</p>}
    </form>
  );
}

function findSelectedElement(project: EmblemProject, selectedElementId: string | null): EmblemElement | undefined {
  if (selectedElementId === null) return undefined;
  for (const layerId of EMBLEM_LAYER_ORDER) {
    const element = project.layers[layerId].elements.find((entry) => entry.id === selectedElementId);
    if (element) return element;
  }
  return undefined;
}

export function EmblemPropertiesPanel({
  locale, project, copy, selectedElementId, showEditBounds, onElementTransform, onDeleteSelected, onEditBoundsChange,
}: EmblemPropertiesPanelProps) {
  const headingId = useId();
  const [actionError, setActionError] = useState<string | null>(null);
  const selected = findSelectedElement(project, selectedElementId);

  function setTransformProperty(property: 'x' | 'y' | 'scale' | 'rotation', value: number) {
    if (!selected) throw new Error(`${copy.properties.emptySelection} ${String(selectedElementId)}`);
    if (!Number.isFinite(value) || (property === 'scale' && value <= 0)) {
      throw new Error(`${copy.properties.invalidNumber}: ${property} = ${String(value)}`);
    }
    onElementTransform(selected.id, { ...selected.transform, [property]: value });
  }

  function runSelectedAction(action: () => void) {
    setActionError(null);
    try {
      action();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      setActionError(`${copy.errors.operationFailed}: ${String(selectedElementId)} — ${message}`);
    }
  }

  return (
    <section lang={locale} aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <h2 id={headingId} className="text-sm font-semibold">{copy.panels.properties}</h2>
      {selected ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <NumericProperty key={`${selected.id}:x:${selected.transform.x}`} label={copy.properties.x}
              value={selected.transform.x} copy={copy} coordinateLimit={EMBLEM_CANVAS.width} onCommit={(value) => setTransformProperty('x', value)} />
            <NumericProperty key={`${selected.id}:y:${selected.transform.y}`} label={copy.properties.y}
              value={selected.transform.y} copy={copy} coordinateLimit={EMBLEM_CANVAS.height} onCommit={(value) => setTransformProperty('y', value)} />
            <NumericProperty key={`${selected.id}:width:${selected.transform.scale}`} label={copy.properties.width}
              value={selected.source.naturalWidth * selected.transform.scale} copy={copy} positive
              onCommit={(value) => setTransformProperty('scale', value / selected.source.naturalWidth)} />
            <NumericProperty key={`${selected.id}:height:${selected.transform.scale}`} label={copy.properties.height}
              value={selected.source.naturalHeight * selected.transform.scale} copy={copy} positive
              onCommit={(value) => setTransformProperty('scale', value / selected.source.naturalHeight)} />
          </div>
          <NumericProperty key={`${selected.id}:rotation:${selected.transform.rotation}`} label={copy.properties.rotation}
            value={selected.transform.rotation} copy={copy} applyLabel={copy.properties.applyRotation}
            onCommit={(value) => setTransformProperty('rotation', value)} />
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={selected.transform.mirrorX}
              onClick={() => runSelectedAction(() => onElementTransform(selected.id, { ...selected.transform, mirrorX: !selected.transform.mirrorX }))}
              className="rounded-md border border-border px-2 py-2 text-xs aria-pressed:bg-primary/10">
              {copy.properties.mirror}
            </button>
            <button type="button" onClick={() => runSelectedAction(onDeleteSelected)}
              className="rounded-md border border-border px-2 py-2 text-xs text-destructive">{copy.properties.deleteSelected}</button>
          </div>
        </>
      ) : <p className="text-sm text-muted-foreground">{copy.properties.emptySelection}</p>}
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={showEditBounds} onChange={(event) => runSelectedAction(() => onEditBoundsChange(event.target.checked))} />
        {copy.properties.showEditBounds}
      </label>
      {actionError && <p role="alert" className="break-words text-xs text-destructive">{actionError}</p>}
    </section>
  );
}
