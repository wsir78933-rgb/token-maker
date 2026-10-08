'use client';

import { useId, useRef, type ChangeEvent } from 'react';

import type {
  ConstellationSaveSlot,
  ConstellationSaveSlots,
} from '@/lib/constellation-map-creator/types';
import type { ConstellationWorkspaceCopy } from '@/lib/constellation-map-creator/copy-types';

export interface ConstellationFilePanelProps {
  copy: ConstellationWorkspaceCopy;
  slots: ConstellationSaveSlots;
  generatedProjectText: string | null;
  selectedFileName: string | null;
  busy?: boolean;
  onSaveSlot(slot: ConstellationSaveSlot): void;
  onLoadSlot(slot: ConstellationSaveSlot): void;
  onGenerateProject(): void;
  onDownloadProject(): void;
  onChooseProjectFile(file: File): void;
  onLoadProject(): void;
}

const SAVE_SLOTS: readonly ConstellationSaveSlot[] = [1, 2, 3, 4, 5];

function slotLabel(template: string, slot: ConstellationSaveSlot): string {
  return template.replace('{number}', String(slot));
}

export function ConstellationFilePanel({
  copy,
  slots,
  generatedProjectText,
  selectedFileName,
  busy = false,
  onSaveSlot,
  onLoadSlot,
  onGenerateProject,
  onDownloadProject,
  onChooseProjectFile,
  onLoadProject,
}: ConstellationFilePanelProps) {
  const headingId = useId();
  const fileInputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);

  if (slots.length !== SAVE_SLOTS.length) {
    throw new Error(`Constellation save slots must contain ${String(SAVE_SLOTS.length)} entries. Received ${String(slots.length)}.`);
  }

  function chooseProjectFile(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file !== undefined) onChooseProjectFile(file);
  }

  return (
    <section data-testid="constellation-file-panel" aria-label={copy.filesTitle} aria-busy={busy} className="flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3 text-[var(--site-ink)]">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <section className="flex min-w-0 flex-col gap-2" aria-labelledby={`${headingId}-browser`}>
          <h3 id={`${headingId}-browser`} className="text-sm font-semibold text-[var(--site-ink-strong)]">{copy.browserSaves}</h3>
          <div className="flex min-w-0 flex-col gap-2">
            {SAVE_SLOTS.map((slot, index) => {
              const savedProject = slots[index];
              const occupied = savedProject !== null;
              const label = slotLabel(copy.slotLabel, slot);
              return (
                <div key={slot} title={copy.overwriteHint} className="flex min-w-0 flex-wrap items-center gap-2 rounded-md border border-[var(--site-border-soft)] bg-[var(--site-panel)] p-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <h4 className="min-w-0 truncate text-sm font-medium text-[var(--site-ink-strong)]">{label}</h4>
                    <span className="shrink-0 text-xs text-[var(--site-ink-soft)]">{occupied ? copy.occupiedSlot : copy.emptySlot}</span>
                  </div>
                  <div className="grid shrink-0 grid-cols-2 gap-2">
                    <button type="button" disabled={busy} aria-label={`${copy.save} ${label}`} onClick={() => onSaveSlot(slot)} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.save}</button>
                    <button type="button" disabled={busy || !occupied} aria-label={`${copy.load} ${label}`} onClick={() => onLoadSlot(slot)} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-3 py-2 text-sm hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.load}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-2 border-t border-[var(--site-border-soft)] pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0" aria-labelledby={`${headingId}-project`}>
          <h3 id={`${headingId}-project`} className="text-sm font-semibold text-[var(--site-ink-strong)]">{copy.projectTitle}</h3>
          <p className="text-xs leading-5 text-[var(--site-ink-soft)]">{copy.projectHint}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled={busy} onClick={onGenerateProject} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-sm hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.generateProject}</button>
            <button type="button" disabled={busy || generatedProjectText === null} onClick={onDownloadProject} className="min-h-11 rounded-md border border-[var(--site-accent-strong)] bg-[var(--site-accent-bg)] px-2 py-2 text-sm font-medium text-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.downloadProject}</button>
          </div>
          {generatedProjectText !== null ? <p role="status" aria-live="polite" className="text-xs text-[var(--site-ink-soft)]">{copy.generatedProject}</p> : null}

          <input ref={fileInput} id={fileInputId} type="file" accept=".txt,application/json,text/plain" aria-label={copy.chooseProject} className="hidden" disabled={busy} onChange={chooseProjectFile} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled={busy} aria-controls={fileInputId} onClick={() => fileInput.current?.click()} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-sm hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.chooseProject}</button>
            <button type="button" disabled={busy || selectedFileName === null} onClick={onLoadProject} className="min-h-11 rounded-md border border-[var(--site-border-soft)] px-2 py-2 text-sm hover:border-[var(--site-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50">{copy.loadProject}</button>
          </div>
          <p className="min-h-5 break-all text-xs text-[var(--site-ink-soft)]">{selectedFileName ?? copy.noFile}</p>
        </section>
      </div>
    </section>
  );
}
