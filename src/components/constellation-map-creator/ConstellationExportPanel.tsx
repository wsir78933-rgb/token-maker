'use client';

import type { ConstellationProject } from '@/lib/constellation-map-creator/types';
import type { ConstellationWorkspaceCopy } from '@/lib/constellation-map-creator/copy-types';

export interface ConstellationExportPanelProps {
  copy: ConstellationWorkspaceCopy;
  project: ConstellationProject;
  previewImageUrl: string | null;
  busy?: boolean;
  onGenerateImage(): Promise<void>;
  onDownloadImage(): void;
}

function formatActualSize(template: string, width: number, height: number): string {
  return template.replace('{width}', String(width)).replace('{height}', String(height));
}

export function ConstellationExportPanel({
  copy,
  project,
  previewImageUrl,
  busy = false,
  onGenerateImage,
  onDownloadImage,
}: ConstellationExportPanelProps) {
  return (
    <section data-testid="constellation-export-panel" aria-label={copy.exportTitle} aria-busy={busy} className="flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]">
      <p className="text-xs font-medium text-[var(--site-ink-strong)]">{formatActualSize(copy.actualSize, project.width, project.height)}</p>
      <div className="flex min-h-40 min-w-0 items-center justify-center overflow-hidden rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-2">
        {previewImageUrl !== null ? (
          // eslint-disable-next-line @next/next/no-img-element -- the generated Blob URL must be shown at its exact output dimensions.
          <img data-testid="constellation-export-preview" src={previewImageUrl} alt={copy.exportReady} className="max-h-[28rem] max-w-full object-contain" />
        ) : <p className="text-xs text-[var(--site-ink-soft)]">{copy.exportReady}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={busy} onClick={() => void onGenerateImage()} className="min-h-11 rounded-md border border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] px-3 py-2 text-sm font-medium text-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{busy ? copy.busy : copy.generateImage}</button>
        <button type="button" disabled={busy || previewImageUrl === null} onClick={onDownloadImage} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">{copy.downloadImage}</button>
      </div>
    </section>
  );
}
