'use client';

import { useId, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerSizeDialogProps {
  copy: MapMakerWorkspaceCopy;
  open: boolean;
  columns: number;
  rows: number;
  busy: boolean;
  onOpenChange(open: boolean): void;
  onApplySize(columns: number, rows: number): void;
  onResetMap(): void;
  onClearLayerOne(): void;
  onClearLayerTwo(): void;
  onClearAllLabels(): void;
}

function validDimension(value: string, minimum: number, maximum: number): boolean {
  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue >= minimum && numericValue <= maximum;
}

export function MapMakerSizeDialog(props: MapMakerSizeDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [columns, setColumns] = useState(String(props.columns));
  const [rows, setRows] = useState(String(props.rows));
  const sizeCopy = props.copy.size;

  const dimensionsAreValid = validDimension(columns, sizeCopy.minimumWidth, sizeCopy.maximumWidth)
    && validDimension(rows, sizeCopy.minimumHeight, sizeCopy.maximumHeight);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId}>
        <div className={styles.dialogHeader}>
          <DialogTitle id={titleId} className={styles.dialogTitle}>{sizeCopy.title}</DialogTitle>
          <DialogClose className={styles.dialogCloseButton} aria-label={props.copy.common.close}>×</DialogClose>
        </div>
        <DialogDescription id={descriptionId} className={styles.dialogDescription}>{sizeCopy.resizeWarning}</DialogDescription>
        <form
          className={styles.dialogContent}
          onSubmit={(event) => {
            event.preventDefault();
            if (!dimensionsAreValid) {
              throw new Error(`Map size is outside the allowed range. Received columns=${JSON.stringify(columns)}, rows=${JSON.stringify(rows)}.`);
            }
            props.onApplySize(Number(columns), Number(rows));
          }}
        >
          <div className={styles.splitFields}>
            <label className={styles.fieldLabel}>
              <span>{sizeCopy.width} ({sizeCopy.minimumWidth}–{sizeCopy.maximumWidth} {sizeCopy.gridUnit})</span>
              <input className={styles.input} type="number" min={sizeCopy.minimumWidth} max={sizeCopy.maximumWidth} step={1} required value={columns} onChange={(event) => setColumns(event.currentTarget.value)} />
            </label>
            <label className={styles.fieldLabel}>
              <span>{sizeCopy.height} ({sizeCopy.minimumHeight}–{sizeCopy.maximumHeight} {sizeCopy.gridUnit})</span>
              <input className={styles.input} type="number" min={sizeCopy.minimumHeight} max={sizeCopy.maximumHeight} step={1} required value={rows} onChange={(event) => setRows(event.currentTarget.value)} />
            </label>
          </div>
          <div className={styles.dialogActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => props.onOpenChange(false)}>{sizeCopy.cancel}</button>
            <button type="submit" className={styles.primaryButton} disabled={props.busy || !dimensionsAreValid}>{sizeCopy.applySize}</button>
          </div>
        </form>
        <hr className={styles.sectionDivider} />
        <section className={styles.dialogContent} aria-labelledby={`${titleId}-clear`}>
          <h3 id={`${titleId}-clear`} className={styles.subsectionTitle}>{sizeCopy.resetAndClearTitle}</h3>
          <p className={styles.mutedText}>{sizeCopy.resetSummary}</p>
          <div className={styles.clearActionGrid}>
            <button type="button" className={styles.dangerButton} disabled={props.busy} onClick={props.onResetMap}>{sizeCopy.resetMap}</button>
            <button type="button" className={styles.secondaryButton} disabled={props.busy} onClick={props.onClearLayerOne}>{sizeCopy.clearLayerOne}</button>
            <button type="button" className={styles.secondaryButton} disabled={props.busy} onClick={props.onClearLayerTwo}>{sizeCopy.clearLayerTwo}</button>
            <button type="button" className={styles.secondaryButton} disabled={props.busy} onClick={props.onClearAllLabels}>{sizeCopy.clearAllLabels}</button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
