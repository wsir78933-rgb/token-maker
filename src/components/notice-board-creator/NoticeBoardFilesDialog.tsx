'use client';

import { useId, useState, type ChangeEvent } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { NOTICE_BOARD_MAX_PROJECT_FILE_BYTES } from '@/lib/notice-board-creator/project';
import type { NoticeBoardSlotIndex } from '@/lib/notice-board-creator/types';
import type { NoticeBoardSlotReadResult } from '@/lib/notice-board-creator/storage';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import styles from './NoticeBoardCreatorWorkbench.module.css';

const NOTICE_BOARD_SLOT_INDEXES: readonly NoticeBoardSlotIndex[] = [1, 2, 3, 4];

export type NoticeBoardFilesDialogProps = {
  open: boolean;
  copy: NoticeBoardEditorCopy;
  slots: readonly NoticeBoardSlotReadResult[] | null;
  error: string | null;
  status: string | null;
  onOpenChange: (open: boolean) => void;
  onRefreshSlots: () => void;
  onSaveSlot: (slotIndex: NoticeBoardSlotIndex) => void;
  onLoadSlot: (slotIndex: NoticeBoardSlotIndex) => void;
  onSaveTxt: () => void;
  onLoadTxt: (fileText: string, fileName: string) => void;
  onPrint: () => void;
};

export function NoticeBoardFilesDialog({
  open,
  copy,
  slots,
  error,
  status,
  onOpenChange,
  onRefreshSlots,
  onSaveSlot,
  onLoadSlot,
  onSaveTxt,
  onLoadTxt,
  onPrint,
}: NoticeBoardFilesDialogProps) {
  const filesDialogId = useId();
  const [fileReadError, setFileReadError] = useState<string | null>(null);
  const fileInputId = `${filesDialogId}-txt-file`;

  async function handleTxtFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const fileInput = event.currentTarget;
    const selectedFile = fileInput.files?.[0];
    fileInput.value = '';
    if (selectedFile === undefined) return;

    setFileReadError(null);
    if (selectedFile.size > NOTICE_BOARD_MAX_PROJECT_FILE_BYTES) {
      setFileReadError(
        copy.fileTooLarge(
          selectedFile.name,
          selectedFile.size,
          NOTICE_BOARD_MAX_PROJECT_FILE_BYTES,
        ),
      );
      return;
    }

    try {
      const fileText = await selectedFile.text();
      onLoadTxt(fileText, selectedFile.name);
    } catch (fileFailure: unknown) {
      if (
        typeof DOMException !== 'undefined' &&
        fileFailure instanceof DOMException &&
        (fileFailure.name === 'AbortError' || fileFailure.name === 'NotReadableError')
      ) {
        setFileReadError(
          `${copy.errorTitle} ${JSON.stringify(selectedFile.name)}: ${fileFailure.name}: ${fileFailure.message}`,
        );
        return;
      }
      throw fileFailure;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialog} ${styles.filesDialog}`}>
        <DialogClose className={styles.dialogClose} aria-label={copy.close} />
        <div className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>{copy.filesTitle}</DialogTitle>
          <DialogDescription className={styles.dialogDescription}>{copy.saveOpenHint}</DialogDescription>
        </div>
        <div className={styles.dialogBody}>
          <h3 className={styles.slotSectionTitle}>{copy.saveSlots}</h3>
          {slots === null ? (
            <div className={styles.slotUnavailable}>
              <p>{copy.storageUnavailable}</p>
              <button className={styles.secondaryButton} type="button" onClick={onRefreshSlots}>
                {copy.retry}
              </button>
            </div>
          ) : (
            <div className={styles.slotGrid}>
              {NOTICE_BOARD_SLOT_INDEXES.map((slotIndex) => {
                const slotResult = slots.find((result) => result.slotIndex === slotIndex);
                if (slotResult === undefined) {
                  throw new Error(`Saved slot results are missing slot ${slotIndex}.`);
                }
                return (
                  <section className={styles.slotCard} key={slotIndex}>
                    <h4 className={styles.slotHeading}>{copy.slotLabel(slotIndex)}</h4>
                    {slotResult.status === 'invalid' ? (
                      <p className={styles.slotState} role="alert">{slotResult.error.message}</p>
                    ) : (
                      <p className={styles.slotState}>
                        {slotResult.status === 'empty' ? copy.emptySlot : copy.savedSlot}
                      </p>
                    )}
                    <div className={styles.slotButtons}>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        aria-label={copy.saveSlot(slotIndex)}
                        onClick={() => onSaveSlot(slotIndex)}
                      >
                        {copy.saveSlot(slotIndex)}
                      </button>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        aria-label={copy.loadSlot(slotIndex)}
                        disabled={slotResult.status !== 'valid'}
                        onClick={() => onLoadSlot(slotIndex)}
                      >
                        {copy.loadSlot(slotIndex)}
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <div className={styles.outputSection}>
            <h3 className={styles.slotSectionTitle}>{copy.saveOpen}</h3>
            <div className={styles.dialogActions}>
              <button className={styles.primaryButton} type="button" onClick={onSaveTxt}>
                {copy.saveTxt}
              </button>
              <label className={styles.fileInputLabel} htmlFor={fileInputId}>
                <input
                  className={styles.fileInput}
                  id={fileInputId}
                  type="file"
                  accept=".txt,text/plain"
                  aria-label={copy.loadTxtFile}
                  onChange={handleTxtFileChange}
                />
                <span>{copy.loadTxt}</span>
              </label>
              <button className={styles.secondaryButton} type="button" onClick={onPrint}>
                {copy.browserPrint}
              </button>
            </div>
            <p className={styles.dialogHint}>{copy.screenshotInstructions}</p>
          </div>

          {error !== null ? <p className={styles.feedbackError} role="alert">{error}</p> : null}
          {fileReadError !== null ? <p className={styles.feedbackError} role="alert">{fileReadError}</p> : null}
          {status !== null ? <p className={styles.feedbackSuccess} role="status">{status}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
