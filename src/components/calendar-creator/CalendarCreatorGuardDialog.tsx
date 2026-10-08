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

export type CalendarCreatorGuardDialogProps = {
  copy: CalendarCreatorCopy;
  open: boolean;
  slots: ReadonlyArray<CalendarSaveRecord | null>;
  sourceSlot: CalendarSaveSlotNumber | null;
  title: string;
  description: string;
  continueLabel?: string;
  actionError: string | null;
  actionErrorKind: CalendarCreatorErrorKind;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onDiscard: () => void;
  onSaveContinue: (slotNumber: CalendarSaveSlotNumber) => void;
};

const CALENDAR_SAVE_SLOT_COUNT = 4;

function requireGuardSlots(
  slots: ReadonlyArray<CalendarSaveRecord | null>,
): ReadonlyArray<CalendarSaveRecord | null> {
  if (slots.length !== CALENDAR_SAVE_SLOT_COUNT) {
    throw new Error(
      `Calendar guard slots must contain ${CALENDAR_SAVE_SLOT_COUNT} entries. Received ${slots.length}.`,
    );
  }

  return slots;
}

function requireGuardSlotNumber(value: number): CalendarSaveSlotNumber {
  if (!Number.isInteger(value) || value < 1 || value > CALENDAR_SAVE_SLOT_COUNT) {
    throw new Error(
      `Calendar guard slot number must be an integer from 1 to ${CALENDAR_SAVE_SLOT_COUNT}. Received ${String(value)}.`,
    );
  }

  return value as CalendarSaveSlotNumber;
}

export function CalendarCreatorGuardDialog({
  copy,
  open,
  slots,
  sourceSlot,
  title,
  description,
  continueLabel,
  actionError,
  actionErrorKind,
  onOpenChange,
  onCancel,
  onDiscard,
  onSaveContinue,
}: CalendarCreatorGuardDialogProps) {
  const checkedSlots = requireGuardSlots(slots);
  const [pendingReplacementSlot, setPendingReplacementSlot] = useState<CalendarSaveSlotNumber | null>(null);

  function requestSaveContinue(slotNumber: number): void {
    const checkedSlot = requireGuardSlotNumber(slotNumber);
    if (sourceSlot === checkedSlot) {
      throw new Error(
        `Calendar save-and-continue cannot target source slot ${checkedSlot}. Received ${String(sourceSlot)}.`,
      );
    }

    if (checkedSlots[checkedSlot - 1] !== null) {
      setPendingReplacementSlot(checkedSlot);
      return;
    }

    onSaveContinue(checkedSlot);
  }

  function confirmSaveContinue(): void {
    if (pendingReplacementSlot === null) {
      throw new Error('Calendar save-and-continue replacement requires a pending slot. Received null.');
    }

    const checkedSlot = requireGuardSlotNumber(pendingReplacementSlot);
    if (sourceSlot === checkedSlot) {
      throw new Error(
        `Calendar save-and-continue cannot overwrite source slot ${checkedSlot}. Received ${String(sourceSlot)}.`,
      );
    }

    onSaveContinue(checkedSlot);
    setPendingReplacementSlot(null);
  }

  const availableSaveTargetCount = checkedSlots.filter(
    (_savedRecord, index) => sourceSlot !== index + 1,
  ).length;
  const actionErrorPrefix = actionErrorKind === 'load'
    ? copy.loadFailed
    : actionErrorKind === 'save' ? copy.saveFailed : '';
  const discardContinueLabel = continueLabel ?? copy.discardContinue;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setPendingReplacementSlot(null);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className={`${styles.calendarCreatorDialog} max-w-2xl p-4 sm:p-6`}>
        <DialogTitle className="pr-12">{title}</DialogTitle>
        <DialogDescription className="mt-2 leading-6">{description}</DialogDescription>
        <DialogClose aria-label={copy.close} />

        <div className={styles.dialogBody}>
          {actionError !== null ? (
            <p role="alert" className={`${styles.message} ${styles.messageError}`}>
              {actionErrorPrefix.length > 0 ? `${actionErrorPrefix} ` : ''}{actionError}
            </p>
          ) : null}

          <div className={styles.guardActions}>
            <button type="button" onClick={onCancel}>
              {copy.cancel}
            </button>
            <button type="button" onClick={onDiscard}>
              {discardContinueLabel}
            </button>
          </div>

          <section className={styles.guardSave}>
            <h3>{copy.saveContinue}</h3>
            <p>{copy.saveTarget}</p>
            {availableSaveTargetCount === 0 ? (
              <p role="alert" className={`${styles.message} ${styles.messageError}`}>
                {copy.sourceSlotExcluded}
              </p>
            ) : null}
            <div className={styles.slotList}>
              {checkedSlots.map((savedRecord, index) => {
                const slotNumber = requireGuardSlotNumber(index + 1);
                const sourceSlotDisabled = sourceSlot === slotNumber;
                return (
                  <article key={slotNumber} className={styles.slot}>
                    <div>
                      <h4>{copy.slot} {slotNumber}</h4>
                      <p>{savedRecord === null ? copy.emptySlot : copy.currentSlot}</p>
                    </div>
                    <button
                      type="button"
                      disabled={sourceSlotDisabled}
                      onClick={() => requestSaveContinue(slotNumber)}
                    >
                      {copy.saveContinue}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

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
                <button type="button" onClick={confirmSaveContinue}>
                  {copy.confirmOverwrite}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
