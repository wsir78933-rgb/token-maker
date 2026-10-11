'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import styles from './NoticeBoardCreatorWorkbench.module.css';

export type NoticeBoardHelpDialogProps = {
  open: boolean;
  copy: NoticeBoardEditorCopy;
  onOpenChange: (open: boolean) => void;
};

export function NoticeBoardHelpDialog({ open, copy, onOpenChange }: NoticeBoardHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialog} ${styles.helpDialog}`}>
        <DialogClose className={styles.dialogClose} aria-label={copy.close} />
        <div className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>{copy.helpTitle}</DialogTitle>
          <DialogDescription className={styles.dialogDescription}>{copy.helpDescription}</DialogDescription>
        </div>
        <div className={styles.dialogBody}>
          <ul className={styles.helpList}>
            <li>{copy.selectionInstruction}</li>
            <li>{copy.batchFormattingOnly} {copy.applyFormattingHint}</li>
            <li>{copy.saveOpenHint}</li>
            <li>{copy.printInstructions}</li>
            <li>{copy.screenshotInstructions}</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
