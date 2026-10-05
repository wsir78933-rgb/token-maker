'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { LanguageGeneratorCopy } from '@/lib/language-generator/copy';
import type { LanguageRules } from '@/lib/language-generator/types';

import styles from './LanguageGeneratorPageView.module.css';

export interface LanguageGeneratorSaveSlotsDialogProps {
  copy: LanguageGeneratorCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: Array<LanguageRules | null>;
  onSave: (slotNumber: number) => void;
  onLoad: (slotNumber: number) => void;
  errorMessage: string | null;
  statusMessage: string | null;
}

const LANGUAGE_SAVE_SLOT_COUNT = 8;

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

  try {
    const serializedValue = JSON.stringify(value);
    return typeof serializedValue === 'string'
      ? serializedValue
      : Object.prototype.toString.call(value);
  } catch (serializationFailure: unknown) {
    if (serializationFailure instanceof Error && serializationFailure.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (serialization failed: ${serializationFailure.message})`;
    }

    throw serializationFailure;
  }
}

function requireLanguageSaveSlots(value: unknown): asserts value is Array<LanguageRules | null> {
  if (!Array.isArray(value)) {
    throw new Error(
      `Language save slots must be an array with ${LANGUAGE_SAVE_SLOT_COUNT} entries. Received ${describeReceivedValue(value)}.`,
    );
  }

  if (value.length !== LANGUAGE_SAVE_SLOT_COUNT) {
    throw new Error(
      `Language save slots must contain ${LANGUAGE_SAVE_SLOT_COUNT} entries. Received ${value.length}.`,
    );
  }

  for (let slotIndex = 0; slotIndex < value.length; slotIndex += 1) {
    const slotRecord = value[slotIndex];
    if (slotRecord === null) {
      continue;
    }

    if (typeof slotRecord !== 'object' || Array.isArray(slotRecord)) {
      throw new Error(
        `Language save slot ${slotIndex + 1} must be null or a rules object. Received ${describeReceivedValue(slotRecord)}.`,
      );
    }
  }
}

function requireLanguageSaveSlotNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= LANGUAGE_SAVE_SLOT_COUNT) {
    return value;
  }

  throw new Error(
    `Language save slot number must be an integer from 1 to ${LANGUAGE_SAVE_SLOT_COUNT}. Received ${describeReceivedValue(value)}.`,
  );
}

function requireOptionalMessage(value: unknown, fieldName: 'errorMessage' | 'statusMessage'): string | null {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw new Error(
    `Language save dialog ${fieldName} must be null or a non-empty string. Received ${describeReceivedValue(value)}.`,
  );
}

function slotStateLabel(copy: LanguageGeneratorCopy, savedRules: LanguageRules | null): string {
  return savedRules === null ? copy.emptySlotLabel : copy.storedSlotLabel;
}

export function LanguageGeneratorSaveSlotsDialog({
  copy,
  open,
  onOpenChange,
  slots,
  onSave,
  onLoad,
  errorMessage,
  statusMessage,
}: LanguageGeneratorSaveSlotsDialogProps) {
  requireLanguageSaveSlots(slots);
  const checkedErrorMessage = requireOptionalMessage(errorMessage, 'errorMessage');
  const checkedStatusMessage = requireOptionalMessage(statusMessage, 'statusMessage');
  const [pendingReplacementSlot, setPendingReplacementSlot] = useState<number | null>(null);

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen) {
      setPendingReplacementSlot(null);
    }

    onOpenChange(nextOpen);
  }

  function handleSave(slotNumber: number): void {
    const checkedSlotNumber = requireLanguageSaveSlotNumber(slotNumber);
    const savedRules = slots[checkedSlotNumber - 1];

    if (savedRules === null) {
      onSave(checkedSlotNumber);
      return;
    }

    setPendingReplacementSlot(checkedSlotNumber);
  }

  function handleLoad(slotNumber: number): void {
    const checkedSlotNumber = requireLanguageSaveSlotNumber(slotNumber);
    const savedRules = slots[checkedSlotNumber - 1];

    if (savedRules === null) {
      throw new Error(
        `Language save slot ${checkedSlotNumber} cannot be loaded because it is empty. Received null.`,
      );
    }

    onLoad(checkedSlotNumber);
  }

  function confirmReplacement(): void {
    if (pendingReplacementSlot === null) {
      throw new Error('Language save replacement requires a pending slot number. Received null.');
    }

    const checkedSlotNumber = requireLanguageSaveSlotNumber(pendingReplacementSlot);
    onSave(checkedSlotNumber);
    setPendingReplacementSlot(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${styles.storageDialog} max-w-4xl p-4 sm:p-6`}>
        <div className="flex min-h-0 flex-1 flex-col">
          <DialogTitle className="pr-12 text-stone-50">{copy.storageTitle}</DialogTitle>
          <DialogDescription className="mt-2 max-w-2xl leading-6 text-stone-300">
            {copy.storageDescription}
          </DialogDescription>
          <DialogClose
            aria-label={copy.closeButton}
            className="size-11 min-h-11 min-w-11 border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] text-stone-300 hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel)] hover:text-stone-50"
          />

          <div className="min-h-0 flex-1 overflow-y-auto pt-5">
            {checkedErrorMessage !== null ? (
              <p
                role="alert"
                className="mb-4 break-words rounded-lg border border-red-300/30 bg-red-950/30 p-3 text-sm leading-6 text-red-100"
              >
                <span className="font-semibold">{copy.storageErrorLabel}</span>{' '}
                {checkedErrorMessage}
              </p>
            ) : null}
            {checkedStatusMessage !== null ? (
              <p
                role="status"
                aria-live="polite"
                className="mb-4 rounded-lg border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] p-3 text-sm leading-6 text-stone-100"
              >
                {checkedStatusMessage}
              </p>
            ) : null}

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {slots.map((savedRules, index) => {
                const slotNumber = index + 1;
                const savedLabel = slotStateLabel(copy, savedRules);

                return (
                  <article
                    key={slotNumber}
                    className="min-w-0 rounded-xl border border-[var(--site-border-soft)] bg-[var(--site-panel-deep)] p-3"
                    data-language-save-slot={slotNumber}
                  >
                    <h3 className="text-sm font-semibold text-stone-50">
                      {copy.storageTitle} {slotNumber}
                    </h3>
                    <p className="mt-2 min-h-11 text-sm leading-6 text-stone-300">{savedLabel}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-2 text-sm font-medium text-stone-200 transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60"
                        onClick={() => handleSave(slotNumber)}
                      >
                        {copy.saveButton}
                      </button>
                      <button
                        type="button"
                        disabled={savedRules === null}
                        className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-2 text-sm font-medium text-stone-200 transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60 disabled:cursor-not-allowed disabled:opacity-45"
                        onClick={() => handleLoad(slotNumber)}
                      >
                        {copy.loadButton}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {pendingReplacementSlot !== null ? (
              <div
                role="alertdialog"
                aria-label={copy.replaceSlotTitle}
                className="mt-5 rounded-xl border border-[var(--site-border-strong)] bg-[var(--site-accent-bg)] p-4"
              >
                <h3 className="text-base font-semibold text-stone-50">{copy.replaceSlotTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {copy.replaceSlotDescription}
                </p>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--site-border-soft)] px-4 text-sm font-medium text-stone-200 transition-colors hover:border-[var(--site-border-strong)] hover:bg-[var(--site-panel-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60"
                    onClick={() => setPendingReplacementSlot(null)}
                  >
                    {copy.cancelButton}
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--site-accent-strong)] px-4 text-sm font-semibold text-stone-950 transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent-strong)]/60"
                    onClick={confirmReplacement}
                  >
                    {copy.replaceSlotButton}
                  </button>
                </div>
              </div>
            ) : null}

            <p className="mt-5 text-sm leading-6 text-stone-300">{copy.loadHint}</p>
            <p className="mt-2 text-xs leading-5 text-stone-400">{copy.localStorageHint}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
