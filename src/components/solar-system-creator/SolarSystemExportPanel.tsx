'use client';

import { useId } from 'react';

import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';

export interface SolarSystemExportPanelProps {
  copy: SolarSystemCopy;
  mode: 'random' | 'manual';
  onGenerateImage: () => void;
  onPrint: () => void;
  busy?: boolean;
}

export function SolarSystemExportPanel({
  copy,
  mode,
  onGenerateImage,
  onPrint,
  busy = false,
}: SolarSystemExportPanelProps) {
  const panelId = useId();

  if (mode !== 'random' && mode !== 'manual') {
    throw new Error(`Solar export mode must be random or manual. Received ${String(mode)}.`);
  }

  const imageDescription = mode === 'random' ? copy.randomImageExcludesDetails : copy.imageExcludesDescription;
  const printDescription = mode === 'random' ? copy.randomPrintIncludesDetails : copy.printIncludesDescriptions;

  return (
    <section
      aria-labelledby={`${panelId}-heading`}
      aria-busy={busy}
      className="flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]"
    >
      <h2 id={`${panelId}-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
        {copy.exportTitle}
      </h2>

      <section aria-labelledby={`${panelId}-image-heading`} className="flex min-w-0 flex-col gap-2">
        <h3 id={`${panelId}-image-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
          {copy.imageTitle}
        </h3>
        <p className="text-xs text-[var(--site-ink)]">{copy.imageSaveHint}</p>
        <p className="text-xs text-[var(--site-ink)]">{imageDescription}</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => onGenerateImage()}
          className="min-h-11 w-full cursor-pointer rounded-md border border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] px-3 py-2 text-sm font-medium text-[var(--site-accent-strong)] transition-colors hover:bg-[var(--site-accent-strong)] hover:text-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? copy.generatingStatus : copy.imageGenerate}
        </button>
      </section>

      <section aria-labelledby={`${panelId}-print-heading`} className="flex min-w-0 flex-col gap-2">
        <h3 id={`${panelId}-print-heading`} className="text-sm font-semibold text-[var(--site-ink-strong)]">
          {copy.print}
        </h3>
        <p className="text-xs text-[var(--site-ink)]">{printDescription}</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => onPrint()}
          className="min-h-11 w-full cursor-pointer rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm text-[var(--site-ink)] transition-colors hover:border-[var(--site-accent-strong)] hover:bg-[var(--site-accent-strong)] hover:text-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.print}
        </button>
      </section>
    </section>
  );
}
