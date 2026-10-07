'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import type { ScrollSaveSlot } from '@/lib/scroll-creator/storage';

import styles from './ScrollSettingsPanel.module.css';

export interface ScrollSaveDialogProps {
  copy: ScrollCreatorCopy;
  mode: 'save' | 'load';
  open: boolean;
  slots: ScrollSaveSlot[];
  busy: boolean;
  onClose: () => void;
  onSave: (slot: number) => void;
  onLoad: (slot: number) => void;
}

const SCROLL_SAVE_SLOT_COUNT = 4;

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return Object.prototype.toString.call(value);
}

function requireScrollSaveSlots(value: unknown): ScrollSaveSlot[] {
  if (!Array.isArray(value)) {
    throw new TypeError(
      `Scroll save slots must be an array with ${SCROLL_SAVE_SLOT_COUNT} entries. Received ${describeReceivedValue(value)}.`,
    );
  }

  if (value.length !== SCROLL_SAVE_SLOT_COUNT) {
    throw new RangeError(
      `Scroll save slots must contain ${SCROLL_SAVE_SLOT_COUNT} entries. Received ${value.length}.`,
    );
  }

  value.forEach((slotRecord, index) => {
    if (slotRecord === null || typeof slotRecord !== 'object' || Array.isArray(slotRecord)) {
      throw new TypeError(
        `Scroll save slot ${index + 1} must be a slot record. Received ${describeReceivedValue(slotRecord)}.`,
      );
    }

    if (slotRecord.slot !== index + 1) {
      throw new TypeError(
        `Scroll save slot ${index + 1} must have slot number ${index + 1}. Received ${describeReceivedValue(slotRecord.slot)}.`,
      );
    }

    if (slotRecord.savedAt !== null && typeof slotRecord.savedAt !== 'string') {
      throw new TypeError(
        `Scroll save slot ${index + 1}.savedAt must be null or a string. Received ${describeReceivedValue(slotRecord.savedAt)}.`,
      );
    }
  });

  return value;
}

function requireScrollDialogMode(value: string): 'save' | 'load' {
  if (value === 'save' || value === 'load') {
    return value;
  }

  throw new TypeError(`Scroll save dialog mode must be "save" or "load". Received ${JSON.stringify(value)}.`);
}

export function ScrollSaveDialog({
  copy,
  mode,
  open,
  slots,
  busy,
  onClose,
  onSave,
  onLoad,
}: ScrollSaveDialogProps) {
  const checkedSlots = requireScrollSaveSlots(slots);
  const checkedMode = requireScrollDialogMode(mode);
  const title = checkedMode === 'save' ? copy.saveTitle : copy.loadTitle;

  function chooseSaveSlot(slot: number): void {
    if (busy) {
      return;
    }
    if (!Number.isInteger(slot) || slot < 1 || slot > SCROLL_SAVE_SLOT_COUNT) {
      throw new RangeError(`Scroll save slot number must be from 1 to ${SCROLL_SAVE_SLOT_COUNT}. Received ${slot}.`);
    }
    onSave(slot);
  }

  function chooseLoadSlot(slotRecord: ScrollSaveSlot): void {
    if (busy) {
      return;
    }
    if (slotRecord.project === null) {
      throw new Error(`Scroll save slot ${slotRecord.slot} cannot be loaded because it is empty. Received null.`);
    }
    onLoad(slotRecord.slot);
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className={styles.dialog} aria-busy={busy}>
        <div className={styles.dialogHeader}>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose aria-label={copy.closeDialog} />
        </div>
        <DialogDescription className={styles.dialogDescription}>{copy.localSaveHint}</DialogDescription>

        <div className={styles.slotList}>
          {checkedSlots.map((slotRecord) => {
            const hasProject = slotRecord.project !== null;
            return (
              <article key={slotRecord.slot} className={styles.slotCard} data-scroll-save-slot={slotRecord.slot}>
                <div className={styles.slotSummary}>
                  <h3 className={styles.slotTitle}>{copy.slotLabel} {slotRecord.slot}</h3>
                  <p className={styles.slotStatus}>
                    {hasProject && slotRecord.savedAt ? `${copy.savedAt}: ${slotRecord.savedAt}` : copy.emptySlot}
                  </p>
                </div>
                <div className={styles.slotActions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={busy}
                    onClick={() => chooseSaveSlot(slotRecord.slot)}
                  >
                    {copy.saveHere}
                  </button>
                  <button
                    type="button"
                    className={styles.toggleButton}
                    disabled={busy || !hasProject}
                    onClick={() => chooseLoadSlot(slotRecord)}
                  >
                    {copy.loadHere}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
