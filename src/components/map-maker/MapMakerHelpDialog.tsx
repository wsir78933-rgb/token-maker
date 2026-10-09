'use client';

import { useId } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerHelpDialogProps {
  copy: MapMakerWorkspaceCopy;
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function MapMakerHelpDialog(props: MapMakerHelpDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId}>
        <div className={styles.dialogHeader}>
          <DialogTitle id={titleId} className={styles.dialogTitle}>{props.copy.help.title}</DialogTitle>
          <DialogClose className={styles.dialogCloseButton} aria-label={props.copy.common.close}>×</DialogClose>
        </div>
        <DialogDescription id={descriptionId} className={styles.dialogDescription}>{props.copy.title}</DialogDescription>
        <ol className={styles.helpSteps}>
          {props.copy.help.steps.map((step, index) => (
            <li key={`${index}-${step.title}`}>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
