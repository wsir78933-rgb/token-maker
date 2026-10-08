'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';

import {
  CONSTELLATION_MAX_DIMENSION,
  type ConstellationBackground,
} from '@/lib/constellation-map-creator/types';
import type { ConstellationWorkspaceCopy } from '@/lib/constellation-map-creator/copy-types';

export interface ConstellationSettingsPanelProps {
  copy: ConstellationWorkspaceCopy;
  width: number;
  height: number;
  background: ConstellationBackground;
  backgroundSizeMismatch: boolean;
  busy?: boolean;
  onSizeChange(width: number, height: number): void;
  onColorChange(color: string): void;
  onTransparentBaseChange(transparent: boolean): void;
  onApplyBackgroundImage(url: string): Promise<void>;
  onRemoveBackgroundImage(): void;
  onClearObjects(): void;
}

function parseDimension(rawValue: string, label: string): number {
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 1 || value > CONSTELLATION_MAX_DIMENSION) {
    throw new Error(`${label} must be an integer from 1 to ${String(CONSTELLATION_MAX_DIMENSION)}. Received ${JSON.stringify(rawValue)}.`);
  }
  return value;
}

function requireHexColor(value: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Constellation background color must be a six-digit hex value. Received ${JSON.stringify(value)}.`);
  }
  return value;
}

function formatSizeMismatch(
  template: string,
  mapWidth: number,
  mapHeight: number,
  imageWidth: number,
  imageHeight: number,
): string {
  return template
    .replace('{imageWidth}', String(imageWidth))
    .replace('{imageHeight}', String(imageHeight))
    .replace('{width}', String(mapWidth))
    .replace('{height}', String(mapHeight));
}

export function ConstellationSettingsPanel({
  copy,
  width,
  height,
  background,
  backgroundSizeMismatch,
  busy = false,
  onSizeChange,
  onColorChange,
  onTransparentBaseChange,
  onApplyBackgroundImage,
  onRemoveBackgroundImage,
  onClearObjects,
}: ConstellationSettingsPanelProps) {
  const headingId = useId();
  const [widthDraft, setWidthDraft] = useState(String(width));
  const [heightDraft, setHeightDraft] = useState(String(height));
  const [colorDraft, setColorDraft] = useState(background.color);
  const [backgroundUrlDraft, setBackgroundUrlDraft] = useState(background.imageUrl ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setWidthDraft(String(width)), [width]);
  useEffect(() => setHeightDraft(String(height)), [height]);
  useEffect(() => setColorDraft(background.color), [background.color]);
  useEffect(() => setBackgroundUrlDraft(background.imageUrl ?? ''), [background.imageUrl]);

  function applySize(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    try {
      onSizeChange(parseDimension(widthDraft, copy.width), parseDimension(heightDraft, copy.height));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  function applyColor(): void {
    try {
      onColorChange(requireHexColor(colorDraft));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  async function applyBackgroundImage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      if (backgroundUrlDraft.trim().length === 0) {
        throw new Error(`Background image URL must not be empty. Received ${JSON.stringify(backgroundUrlDraft)}.`);
      }
      await onApplyBackgroundImage(backgroundUrlDraft);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  return (
    <section data-testid="constellation-settings-panel" aria-labelledby={headingId} className="flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]">
      <h2 id={headingId} className="text-sm font-semibold text-[var(--site-ink-strong)]">{copy.settingsTitle}</h2>

      <form onSubmit={applySize} className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">
            {copy.width}
            <input value={widthDraft} onChange={(event) => setWidthDraft(event.target.value)} inputMode="numeric" type="text" className="min-h-11 w-full rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-2 py-2 text-sm" />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">
            {copy.height}
            <input value={heightDraft} onChange={(event) => setHeightDraft(event.target.value)} inputMode="numeric" type="text" className="min-h-11 w-full rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-2 py-2 text-sm" />
          </label>
        </div>
        <button type="submit" disabled={busy} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm font-medium hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.applySize}</button>
      </form>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-[var(--site-ink-strong)]">{copy.backgroundColor}</h3>
        <div className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-2">
          <input aria-label={copy.backgroundColor} type="color" value={/^#[0-9a-f]{6}$/i.test(colorDraft) ? colorDraft : '#000000'} onChange={(event) => { setColorDraft(event.target.value); }} className="h-11 w-12 cursor-pointer rounded-md border border-[var(--site-border-soft)] bg-transparent p-1" />
          <input aria-label={copy.backgroundColor} value={colorDraft} onChange={(event) => setColorDraft(event.target.value)} type="text" className="min-h-11 min-w-0 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-2 py-2 text-sm" />
          <button type="button" disabled={busy} onClick={applyColor} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.applyColor}</button>
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={background.transparent} disabled={busy} onChange={(event) => onTransparentBaseChange(event.currentTarget.checked)} />
          <span>{copy.transparentBase}</span>
        </label>
        <p className="text-xs leading-5 text-[var(--site-ink-soft)]">{copy.transparentHint}</p>
      </div>

      <form noValidate onSubmit={(event) => void applyBackgroundImage(event)} className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-[var(--site-ink-strong)]">{copy.backgroundImage}</h3>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {copy.backgroundUrl}
          <input value={backgroundUrlDraft} onChange={(event) => setBackgroundUrlDraft(event.target.value)} type="text" placeholder="https://..." className="min-h-11 min-w-0 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] px-2 py-2 text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button type="submit" disabled={busy} className="min-h-11 rounded-md border border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] px-2 py-2 text-sm font-medium text-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.applyImage}</button>
          <button type="button" disabled={busy || background.imageUrl === null} onClick={onRemoveBackgroundImage} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">{copy.removeImage}</button>
        </div>
        {backgroundSizeMismatch && background.imageWidth !== null && background.imageHeight !== null ? (
          <p role="alert" className="text-xs leading-5 text-[var(--site-ink-soft)]">
            {formatSizeMismatch(copy.sizeMismatch, width, height, background.imageWidth, background.imageHeight)}
          </p>
        ) : null}
      </form>

      <div className="mt-auto flex flex-col gap-2 border-t border-[var(--site-border-soft)] pt-3">
        <button type="button" disabled={busy} onClick={onClearObjects} className="min-h-11 rounded-md border border-[var(--destructive)] px-3 py-2 text-sm text-[var(--destructive)] disabled:cursor-not-allowed disabled:opacity-50">{copy.clearObjects}</button>
        <p className="text-xs leading-5 text-[var(--site-ink-soft)]">{copy.clearHint}</p>
      </div>
      {error !== null ? <p role="alert" className="break-words text-xs text-[var(--destructive)]">{copy.errorLabel}: {error}</p> : null}
    </section>
  );
}
