'use client';

import { useId } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MapMakerSaveSlot, MapMakerSaveSlots } from '@/lib/map-maker';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerSaveDialogProps {
  copy: MapMakerWorkspaceCopy;
  open: boolean;
  slots: MapMakerSaveSlots;
  selectedFileName: string | null;
  busy: boolean;
  onOpenChange(open: boolean): void;
  onSaveSlot(slot: MapMakerSaveSlot): void;
  onLoadSlot(slot: MapMakerSaveSlot): void;
  onDownloadProjectFile(): void;
  onChooseProjectFile(file: File): void;
  onLoadProjectFile(): void;
}

const SAVE_SLOTS: readonly MapMakerSaveSlot[] = [1, 2, 3, 4, 5, 6, 7, 8];

export function MapMakerSaveDialog(props: MapMakerSaveDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const saveCopy = props.copy.save;

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId}>
        <div className={styles.dialogHeader}>
          <DialogTitle id={titleId} className={styles.dialogTitle}>{saveCopy.title}</DialogTitle>
          <DialogClose className={styles.dialogCloseButton} aria-label={props.copy.common.close}>×</DialogClose>
        </div>
        <DialogDescription id={descriptionId} className={styles.dialogDescription}>
          {saveCopy.loadWarning}
        </DialogDescription>
        <section className={styles.dialogContent} aria-labelledby={`${titleId}-slots`}>
          <h3 id={`${titleId}-slots`} className={styles.subsectionTitle}>{saveCopy.browserSlotsTitle}</h3>
          <div className={styles.saveSlotGrid}>
            {SAVE_SLOTS.map((slotNumber, index) => {
              const slot = props.slots[index];
              const saved = slot !== null && slot !== undefined;
              return (
                <article key={slotNumber} className={styles.saveSlot}>
                  <h4 className={styles.saveSlotTitle}>{saveCopy.slotNumber} {slotNumber}</h4>
                  <p className={styles.mutedText}>{saved ? saveCopy.slotSaved : saveCopy.slotEmpty}</p>
                  <div className={styles.slotActions}>
                    <button type="button" className={styles.primaryButton} disabled={props.busy} onClick={() => props.onSaveSlot(slotNumber)}>
                      {saveCopy.saveToSlot}
                    </button>
                    <button type="button" className={styles.secondaryButton} disabled={props.busy || !saved} onClick={() => props.onLoadSlot(slotNumber)}>
                      {saveCopy.loadFromSlot}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <hr className={styles.sectionDivider} />
        <section className={styles.dialogContent} aria-labelledby={`${titleId}-file`}>
          <h3 id={`${titleId}-file`} className={styles.subsectionTitle}>{saveCopy.projectFileTitle}</h3>
          <p className={styles.mutedText}>{saveCopy.projectFileDescription}</p>
          <div className={styles.dialogActions}>
            <button type="button" className={styles.secondaryButton} disabled={props.busy} onClick={props.onDownloadProjectFile}>
              {saveCopy.downloadProjectFile}
            </button>
            <label className={styles.fileChoiceButton}>
              <span>{saveCopy.chooseProjectFile}</span>
              <input
                className={styles.visuallyHiddenInput}
                type="file"
                accept=".txt,text/plain"
                disabled={props.busy}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file instanceof File) props.onChooseProjectFile(file);
                }}
              />
            </label>
            <button type="button" className={styles.primaryButton} disabled={props.busy || props.selectedFileName === null} onClick={props.onLoadProjectFile}>
              {saveCopy.loadProjectFile}
            </button>
          </div>
          <p className={styles.mutedText} aria-live="polite">
            {props.selectedFileName === null ? saveCopy.noProjectFileSelected : `${saveCopy.selectedProjectFile}: ${props.selectedFileName}`}
          </p>
        </section>
      </DialogContent>
    </Dialog>
  );
}
