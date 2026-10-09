'use client';

import { useId } from 'react';
import Image from 'next/image';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerExportDialogProps {
  copy: MapMakerWorkspaceCopy;
  open: boolean;
  busy: boolean;
  previewImageUrl: string | null;
  onOpenChange(open: boolean): void;
  onDownloadImage(): void;
}

export function MapMakerExportDialog(props: MapMakerExportDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const exportCopy = props.copy.export;

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId}>
        <div className={styles.dialogHeader}>
          <DialogTitle id={titleId} className={styles.dialogTitle}>{exportCopy.title}</DialogTitle>
          <DialogClose className={styles.dialogCloseButton} aria-label={props.copy.common.close}>×</DialogClose>
        </div>
        <DialogDescription id={descriptionId} className={styles.dialogDescription}>
          {exportCopy.autoPreviewNotice}
        </DialogDescription>
        {props.previewImageUrl !== null ? (
          <Image
            src={props.previewImageUrl}
            alt={exportCopy.previewAlt}
            width={1200}
            height={800}
            unoptimized
            className={styles.previewImage}
          />
        ) : (
          <div className={styles.previewLoading} role="status" aria-live="polite">
            {props.busy ? exportCopy.autoPreviewNotice : exportCopy.contentScope}
          </div>
        )}
        <p className={styles.scopeNote}>{exportCopy.contentScope}</p>
        <p className={styles.mutedText}>{exportCopy.excludedContent}</p>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.primaryButton} onClick={props.onDownloadImage} disabled={props.busy || props.previewImageUrl === null}>
            {exportCopy.downloadImage}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
