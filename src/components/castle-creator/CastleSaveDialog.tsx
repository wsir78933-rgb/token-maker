'use client';

import type { CastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastleSaveSlotNumber } from '@/lib/castle-creator/types';
import type { RefObject } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

export type CastleSaveSlotState = {
  slotNumber: CastleSaveSlotNumber;
  status: 'occupied' | 'empty' | 'error';
  updatedAt: string | null;
  pieceCount: number | null;
  error: string | null;
};

export interface CastleSaveDialogProps {
  copy: CastleCreatorCopy;
  activeSlot: CastleSaveSlotNumber | null;
  slots: readonly CastleSaveSlotState[];
  busy: boolean;
  overwriteSlot: CastleSaveSlotNumber | null;
  error: string | null;
  finalFocus?: RefObject<HTMLElement | null> | (() => HTMLElement | null);
  onClose(): void;
  onSaveSlot(slotNumber: CastleSaveSlotNumber): void;
  onLoadSlot(slotNumber: CastleSaveSlotNumber): void;
  onCancelOverwrite(): void;
  onConfirmOverwrite(): void;
}

function slotStatusLabel(copy: CastleCreatorCopy, slot: CastleSaveSlotState): string {
  if (slot.status === 'occupied') return copy.saves.occupiedSlotStatus;
  if (slot.status === 'empty') return copy.saves.emptySlotStatus;
  return slot.error ?? copy.saves.saveLoadError;
}

export function CastleSaveDialog({
  copy,
  activeSlot,
  slots,
  busy,
  overwriteSlot,
  error,
  finalFocus,
  onClose,
  onSaveSlot,
  onLoadSlot,
  onCancelOverwrite,
  onConfirmOverwrite,
}: CastleSaveDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        aria-labelledby="castle-save-dialog-title"
        className="max-h-[min(42rem,calc(100vh-2rem))] max-w-2xl overflow-y-auto p-4 sm:p-6"
        finalFocus={finalFocus}
        data-castle-dialog="saves"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle id="castle-save-dialog-title" className="pr-12 text-lg">
              {copy.saves.dialogTitle}
            </DialogTitle>
            <DialogDescription className="mt-1">{copy.saves.localHeading}</DialogDescription>
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {slots.map((slot) => {
            const isActive = activeSlot === slot.slotNumber;
            const isOccupied = slot.status === 'occupied';
            return (
              <article
                key={slot.slotNumber}
                className={`rounded-lg border p-3 ${isActive ? 'border-primary bg-primary/5' : 'border-border'}`}
                data-castle-save-slot={slot.slotNumber}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{copy.saves.slotLabel(slot.slotNumber)}</h3>
                    <p className="mt-1 break-words text-xs text-muted-foreground">{slotStatusLabel(copy, slot)}</p>
                    {slot.pieceCount !== null ? (
                      <p className="mt-1 text-xs text-muted-foreground">{copy.saves.pieceCountLabel(slot.pieceCount)}</p>
                    ) : null}
                    {slot.updatedAt ? (
                      <time className="mt-1 block text-xs text-muted-foreground" dateTime={slot.updatedAt}>
                        {slot.updatedAt}
                      </time>
                    ) : null}
                  </div>
                  {isActive ? <span className="text-xs font-medium text-primary">{copy.saves.currentSlotLabel}</span> : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="min-h-11 rounded-md border border-border px-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={busy}
                    onClick={() => onSaveSlot(slot.slotNumber)}
                  >
                    {copy.saves.saveLabel}
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-md border border-border px-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={busy || !isOccupied}
                    onClick={() => onLoadSlot(slot.slotNumber)}
                  >
                    {isOccupied ? copy.saves.loadLabel : copy.saves.loadDisabledLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{copy.saves.storageNote}</p>

        {overwriteSlot !== null ? (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4" data-castle-overwrite-confirmation>
            <h3 className="font-semibold">{copy.saves.overwriteTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{copy.saves.overwriteDescription(overwriteSlot)}</p>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button type="button" className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-muted" disabled={busy} onClick={onCancelOverwrite}>
                {copy.saves.overwriteCancelLabel}
              </button>
              <button type="button" className="min-h-11 rounded-md border border-destructive bg-destructive px-3 text-sm text-destructive-foreground hover:bg-destructive/90" disabled={busy} onClick={onConfirmOverwrite}>
                {copy.saves.overwriteConfirmLabel}
              </button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
