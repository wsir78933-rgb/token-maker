'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ScrollCreatorCopy } from '@/lib/scroll-creator/copy';

import styles from './ScrollSettingsPanel.module.css';

export interface ScrollHelpDialogProps {
  copy: ScrollCreatorCopy;
  open: boolean;
  onClose: () => void;
}

export function ScrollHelpDialog({ copy, open, onClose }: ScrollHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <DialogTitle>{copy.helpTitle}</DialogTitle>
          <DialogClose aria-label={copy.closeDialog} />
        </div>
        <DialogDescription className={styles.helpText}>{copy.helpText}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
