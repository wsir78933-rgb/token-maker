'use client';

import { useId, useRef, type ChangeEvent } from 'react';

import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';

export interface EmblemDocumentToolbarProps {
  copy: EmblemCreatorCopy;
  disabled: boolean;
  isExporting: boolean;
  onOpenProject(file: File): Promise<void>;
  onSaveProject(): void;
  onExportPng(): Promise<void>;
}

export function EmblemDocumentToolbar({
  copy, disabled, isExporting, onOpenProject, onSaveProject, onExportPng,
}: EmblemDocumentToolbarProps) {
  const fileInputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);

  async function openSelectedFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    // Reset before awaiting so the same file can be opened again after an error.
    event.currentTarget.value = '';
    if (file) await onOpenProject(file);
  }

  const buttonClass = 'min-w-0 rounded-md border border-border bg-background px-2 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50 sm:px-3 sm:text-sm';

  return (
    <div className="flex min-w-0 flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <h2 className="text-sm font-semibold sm:text-base">{copy.editorTitle}</h2>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        <input ref={fileInput} id={fileInputId} type="file" accept=".json,application/json"
          aria-label={copy.toolbar.openProject} className="hidden" disabled={disabled}
          onChange={openSelectedFile} />
        <button type="button" disabled={disabled} aria-controls={fileInputId}
          onClick={() => fileInput.current?.click()} className={buttonClass}>
          {copy.toolbar.openProject}
        </button>
        <button type="button" disabled={disabled} onClick={onSaveProject} className={buttonClass}>
          {copy.toolbar.saveProject}
        </button>
        <button type="button" disabled={disabled} onClick={onExportPng} className={buttonClass}>
          {isExporting ? copy.toolbar.exporting : copy.toolbar.exportPng}
        </button>
      </div>
    </div>
  );
}
