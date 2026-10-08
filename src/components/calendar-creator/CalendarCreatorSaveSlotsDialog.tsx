'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CalendarSaveRecord, CalendarSaveSlotNumber } from '@/lib/calendar-creator/types';

import styles from './CalendarCreatorWorkbench.module.css';
import type { CalendarCreatorErrorKind } from './useCalendarCreator';

type CalendarCreatorCopy = ReturnType<
  typeof import('@/lib/calendar-creator/copy').getCalendarCreatorCopy
>;

export type CalendarCreatorSaveSlotsMode = 'manage' | 'save' | 'open';

export type CalendarCreatorSaveSlotsDialogProps = {
  copy: CalendarCreatorCopy;
  open: boolean;
  mode: CalendarCreatorSaveSlotsMode;
  slots: ReadonlyArray<CalendarSaveRecord | null>;
  sourceSlot: CalendarSaveSlotNumber | null;
  errorKind: Exclude<CalendarCreatorErrorKind, null> | null;
  errorMessage: string | null;
  statusMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSave: (slotNumber: CalendarSaveSlotNumber) => void;
  onLoad: (slotNumber: CalendarSaveSlotNumber) => void;
};

const CALENDAR_SAVE_SLOT_COUNT = 4;

function requireSlotList(
  slots: ReadonlyArray<CalendarSaveRecord | null>,
): ReadonlyArray<CalendarSaveRecord | null> {
  if (slots.length !== CALENDAR_SAVE_SLOT_COUNT) {
    throw new Error(
      `Calendar save slots must contain ${CALENDAR_SAVE_SLOT_COUNT} entries. Received ${slots.length}.`,
    );
  }

  return slots;
}

function requireSlotNumber(value: number): CalendarSaveSlotNumber {
  if (!Number.isInteger(value) || value < 1 || value > CALENDAR_SAVE_SLOT_COUNT) {
    throw new Error(
      `Calendar save slot number must be an integer from 1 to ${CALENDAR_SAVE_SLOT_COUNT}. Received ${String(value)}.`,
    );
  }

  return value as CalendarSaveSlotNumber;
}

function describeSlot(copy: CalendarCreatorCopy, savedRecord: CalendarSaveRecord | null): string {
  if (savedRecord === null) {
    return copy.emptySlot;
  }

  const savedYear = savedRecord.document.settings.year;
  const savedAt = new Date(savedRecord.savedAt);
  if (Number.isNaN(savedAt.getTime())) {
    throw new Error(
      `Calendar save record timestamp must be a valid date for display. Received ${JSON.stringify(savedRecord.savedAt)}.`,
    );
  }

  return `${copy.currentSlot} · ${savedYear} · ${savedAt.toLocaleDateString()}`;
}

export function CalendarCreatorSaveSlotsDialog({
  copy,
  open,
  mode,
  slots,
  sourceSlot,
  errorKind,
  errorMessage,
  statusMessage,
  onOpenChange,
  onSave,
  onLoad,
}: CalendarCreatorSaveSlotsDialogProps) {
  const checkedSlots = requireSlotList(slots);
  const [pendingReplacementSlot, setPendingReplacementSlot] = useState<CalendarSaveSlotNumber | null>(null);

  function handleSaveRequest(slotNumber: number): void {
    const checkedSlot = requireSlotNumber(slotNumber);
    const isBoundCurrentSlot = mode === 'manage' && sourceSlot === checkedSlot;
    if (sourceSlot === checkedSlot && !isBoundCurrentSlot) {
      throw new Error(
        `Calendar save slot ${checkedSlot} cannot be selected as a save target while it is the source slot. Received ${String(sourceSlot)}.`,
      );
    }

    if (isBoundCurrentSlot) {
      onSave(checkedSlot);
      return;
    }

    if (checkedSlots[checkedSlot - 1] !== null) {
      setPendingReplacementSlot(checkedSlot);
      return;
    }

    onSave(checkedSlot);
  }

  function handleLoadRequest(slotNumber: number): void {
    const checkedSlot = requireSlotNumber(slotNumber);
    if (checkedSlots[checkedSlot - 1] === null) {
      throw new Error(
        `Calendar save slot ${checkedSlot} cannot be opened because it is empty. Received null.`,
      );
    }

    onLoad(checkedSlot);
  }

  function confirmReplacement(): void {
    if (pendingReplacementSlot === null) {
      throw new Error('Calendar save replacement requires a pending slot. Received null.');
    }

    const checkedSlot = requireSlotNumber(pendingReplacementSlot);
    if (sourceSlot === checkedSlot) {
      throw new Error(
        `Calendar save replacement cannot target source slot ${checkedSlot}. Received ${String(sourceSlot)}.`,
      );
    }

    onSave(checkedSlot);
    setPendingReplacementSlot(null);
  }

  const saveControlsVisible = mode === 'manage' || mode === 'save';
  const openControlsVisible = mode === 'manage' || mode === 'open';

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setPendingReplacementSlot(null);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className={`${styles.calendarCreatorDialog} max-w-4xl p-4 sm:p-6`}>
        <DialogTitle className="pr-12">{copy.archives}</DialogTitle>
        <DialogDescription className="mt-2 leading-6">
          {copy.localNotice}
        </DialogDescription>
        <DialogClose aria-label={copy.close} />

        <div className={styles.dialogBody}>
          {errorMessage !== null ? (
            <p role="alert" className={`${styles.message} ${styles.messageError}`}>
              {errorKind === 'load' ? copy.loadFailed : copy.saveFailed} {errorMessage}
            </p>
          ) : null}
          {statusMessage !== null ? (
            <p role="status" className={styles.message}>
              {statusMessage}
            </p>
          ) : null}

          <div className={styles.slotList}>
            {checkedSlots.map((savedRecord, index) => {
              const slotNumber = requireSlotNumber(index + 1);
              const sourceSlotDisabled = mode === 'save' && sourceSlot === slotNumber;
              const isBoundCurrentSlot = mode === 'manage' && sourceSlot === slotNumber;
              return (
                <article key={slotNumber} className={styles.slot} data-calendar-save-slot={slotNumber}>
                  <div>
                    <h3>{copy.slot} {slotNumber}</h3>
                    <p>{describeSlot(copy, savedRecord)}</p>
                    {sourceSlotDisabled ? <small>{copy.sourceSlotExcluded}</small> : null}
                  </div>
                  <div className={styles.slotActions}>
                    {saveControlsVisible ? (
                      <button
                        type="button"
                        disabled={sourceSlotDisabled}
                        onClick={() => handleSaveRequest(slotNumber)}
                      >
                        {isBoundCurrentSlot
                          ? copy.updateCurrent
                          : savedRecord === null ? copy.saveHere : copy.saveAsHere}
                      </button>
                    ) : null}
                    {openControlsVisible ? (
                      <button
                        type="button"
                        disabled={savedRecord === null}
                        onClick={() => handleLoadRequest(slotNumber)}
                      >
                        {copy.open}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          {pendingReplacementSlot !== null ? (
            <div
              className={styles.confirmation}
              role="alertdialog"
              aria-label={copy.overwriteTitle}
            >
              <h3>{copy.overwriteTitle}</h3>
              <p>{copy.overwriteDescription}</p>
              <div className={styles.confirmationActions}>
                <button type="button" onClick={() => setPendingReplacementSlot(null)}>
                  {copy.cancel}
                </button>
                <button type="button" onClick={confirmReplacement}>
                  {copy.confirmOverwrite}
                </button>
              </div>
            </div>
          ) : null}

          <p className={styles.dialogHint}>{copy.completeSaveNotice}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
