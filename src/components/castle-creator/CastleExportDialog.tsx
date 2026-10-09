'use client';

/* The preview is an object URL produced by the browser canvas and cannot use the site image loader. */
/* eslint-disable @next/next/no-img-element */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastleSize } from '@/lib/castle-creator/types';
import type { RefObject } from 'react';

export interface CastleExportDialogProps {
  copy: CastleCreatorCopy;
  previewUrl: string | null;
  exportSize: CastleSize | null;
  isExporting: boolean;
  error: string | null;
  finalFocus?: RefObject<HTMLElement | null> | (() => HTMLElement | null);
  onClose(): void;
  onDownload(): void;
}

export function CastleExportDialog({
  copy,
  previewUrl,
  exportSize,
  isExporting,
  error,
  finalFocus,
  onClose,
  onDownload,
}: CastleExportDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        aria-labelledby="castle-export-dialog-title"
        className="max-h-[min(42rem,calc(100vh-2rem))] max-w-2xl overflow-y-auto p-4 sm:p-6"
        finalFocus={finalFocus}
        data-castle-dialog="export"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle id="castle-export-dialog-title" className="pr-12 text-lg">{copy.png.dialogTitle}</DialogTitle>
            <DialogDescription className="mt-1">{copy.png.formatLabel}</DialogDescription>
          </div>
          <button type="button" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted" onClick={onClose}>
            {copy.png.closeLabel}
          </button>
        </div>

        {error ? (
          <p role="alert" className="mt-4 break-words rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-sm font-medium">{copy.png.previewLabel}</p>
          {previewUrl ? (
            <img src={previewUrl} alt={copy.png.previewLabel} className="mt-3 max-h-80 w-full rounded-md border border-border object-contain" />
          ) : (
            <p role="status" className="mt-3 text-sm text-muted-foreground">
              {isExporting ? copy.png.loadingLabel : copy.png.exportError}
            </p>
          )}
          {exportSize ? (
            <p className="mt-3 text-xs text-muted-foreground">{exportSize.width} × {exportSize.height}px</p>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{copy.png.visibleLayersOnlyLabel}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-muted" onClick={onClose}>
            {copy.png.returnLabel}
          </button>
          <button type="button" className="min-h-11 rounded-md border border-primary bg-primary px-3 text-sm text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50" disabled={previewUrl === null || isExporting} onClick={onDownload}>
            {copy.png.downloadLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
