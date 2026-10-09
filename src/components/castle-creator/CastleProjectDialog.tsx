'use client';

import { useId, useRef, type ChangeEvent, type RefObject } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CastleCreatorCopy } from '@/lib/castle-creator/copy';

export interface CastleProjectDialogProps {
  copy: CastleCreatorCopy;
  busy: boolean;
  error: string | null;
  finalFocus?: RefObject<HTMLElement | null> | (() => HTMLElement | null);
  onClose(): void;
  onNewProject(): void;
  onExportProject(): void;
  onImportProject(file: File): Promise<void>;
}

export function CastleProjectDialog({
  copy,
  busy,
  error,
  finalFocus,
  onClose,
  onNewProject,
  onExportProject,
  onImportProject,
}: CastleProjectDialogProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (selectedFile) await onImportProject(selectedFile);
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        aria-labelledby="castle-project-dialog-title"
        className="max-w-xl p-4 sm:p-6"
        finalFocus={finalFocus}
        data-castle-dialog="project"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle id="castle-project-dialog-title" className="pr-12 text-lg">{copy.projectFiles.heading}</DialogTitle>
            <DialogDescription className="mt-1">{copy.projectFiles.description}</DialogDescription>
          </div>
          <button type="button" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted" onClick={onClose}>
            {copy.saves.closeLabel}
          </button>
        </div>

        {error ? (
          <p role="alert" className="mt-4 break-words rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button type="button" className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" disabled={busy} onClick={onNewProject}>
            {copy.projectFiles.newProjectLabel}
          </button>
          <button type="button" className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" disabled={busy} onClick={onExportProject}>
            {copy.projectFiles.exportLabel}
          </button>
          <button type="button" className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" disabled={busy} onClick={() => fileInputRef.current?.click()}>
            {copy.projectFiles.importLabel}
          </button>
        </div>
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept=".json,application/json"
          aria-label={copy.projectFiles.importInputLabel}
          className="sr-only"
          disabled={busy}
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
}
