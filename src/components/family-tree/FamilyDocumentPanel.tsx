'use client';

import { useId, type ChangeEvent } from 'react';

import type { FamilyTreeCopy } from '@/lib/family-tree/copy';
import type { FamilyTreeSaveSlotNumber } from '@/lib/family-tree/saves';

import styles from './document.module.css';

export type FamilyTreeSaveSlotsState = readonly [boolean, boolean, boolean, boolean, boolean];

export interface FamilyDocumentPanelProps {
  readonly copy: FamilyTreeCopy;
  readonly slots: FamilyTreeSaveSlotsState;
  readonly selectedFile: File | null;
  readonly busy: boolean;
  readonly onSaveSlot: (slotNumber: FamilyTreeSaveSlotNumber) => void;
  readonly onLoadSlot: (slotNumber: FamilyTreeSaveSlotNumber) => void;
  readonly onSaveFile: () => void;
  readonly onChooseFile: (file: File | null) => void;
  readonly onLoadFile: () => void;
  readonly onClose: () => void;
}

const FAMILY_TREE_SAVE_SLOT_NUMBERS: readonly FamilyTreeSaveSlotNumber[] = [1, 2, 3, 4, 5];

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
    return serializedValue === undefined ? Object.prototype.toString.call(value) : serializedValue;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${error.message})`;
    }

    throw error;
  }
}

function requireFamilyTreeSaveSlots(value: unknown): FamilyTreeSaveSlotsState {
  if (!Array.isArray(value)) {
    throw new Error(
      `Family tree save slots must be an array with 5 entries. Received ${describeReceivedValue(value)}.`,
    );
  }

  if (value.length !== FAMILY_TREE_SAVE_SLOT_NUMBERS.length) {
    throw new Error(
      `Family tree save slots must contain 5 entries. Received ${value.length}.`,
    );
  }

  for (const [index, slotState] of value.entries()) {
    if (typeof slotState !== 'boolean') {
      throw new Error(
        `Family tree save slot ${index + 1} must be a boolean. Received ${describeReceivedValue(slotState)}.`,
      );
    }
  }

  return [value[0], value[1], value[2], value[3], value[4]];
}

function requireBoolean(value: unknown, fieldName: 'busy'): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Family tree document panel ${fieldName} must be a boolean. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireSelectedFile(value: unknown): File | null {
  if (value === null) {
    return null;
  }

  if (typeof File !== 'undefined' && value instanceof File) {
    return value;
  }

  throw new Error(
    `Family tree selected file must be a File or null. Received ${describeReceivedValue(value)}.`,
  );
}

function requireCallback(value: unknown, callbackName: string): () => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Family tree document panel ${callbackName} must be a function. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value as () => void;
}

function requireSlotCallback(
  value: unknown,
  callbackName: 'onSaveSlot' | 'onLoadSlot',
): (slotNumber: FamilyTreeSaveSlotNumber) => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Family tree document panel ${callbackName} must be a function. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value as (slotNumber: FamilyTreeSaveSlotNumber) => void;
}

function requireFileCallback(
  value: unknown,
  callbackName: 'onChooseFile',
): (file: File | null) => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Family tree document panel ${callbackName} must be a function. Received ${describeReceivedValue(value)}.`,
    );
  }

  return (file: File | null) => {
    if (file !== null && !(typeof File !== 'undefined' && file instanceof File)) {
      throw new Error(
        `Family tree selected file must be a File or null. Received ${describeReceivedValue(file)}.`,
      );
    }

    (value as (selectedFile: File | null) => void)(file);
  };
}

function slotLabel(copy: FamilyTreeCopy, slotNumber: FamilyTreeSaveSlotNumber): string {
  const label = copy.saveSlots[`slot${slotNumber}` as keyof FamilyTreeCopy['saveSlots']];
  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(
      `Family tree save slot ${slotNumber} label must be a non-empty string. Received ${describeReceivedValue(label)}.`,
    );
  }

  return label;
}

function handleFileSelection(
  event: ChangeEvent<HTMLInputElement>,
  onChooseFile: (file: File | null) => void,
): void {
  const selectedFile = event.currentTarget.files?.[0] ?? null;
  onChooseFile(selectedFile);
}

export function FamilyDocumentPanel({
  copy,
  slots,
  selectedFile,
  busy,
  onSaveSlot,
  onLoadSlot,
  onSaveFile,
  onChooseFile,
  onLoadFile,
  onClose,
}: FamilyDocumentPanelProps) {
  const fileInputId = useId();
  const checkedSlots = requireFamilyTreeSaveSlots(slots);
  const checkedFile = requireSelectedFile(selectedFile);
  const checkedBusy = requireBoolean(busy, 'busy');
  const checkedSaveSlot = requireSlotCallback(onSaveSlot, 'onSaveSlot');
  const checkedLoadSlot = requireSlotCallback(onLoadSlot, 'onLoadSlot');
  const checkedSaveFile = requireCallback(onSaveFile, 'onSaveFile');
  const checkedChooseFile = requireFileCallback(onChooseFile, 'onChooseFile');
  const checkedLoadFile = requireCallback(onLoadFile, 'onLoadFile');
  const checkedClose = requireCallback(onClose, 'onClose');

  return (
    <section className={styles.panel} aria-labelledby={`${fileInputId}-title`}>
      <div className={styles.header}>
        <h2 id={`${fileInputId}-title`} className={styles.title}>
          {copy.saveLoad}
        </h2>
        <button type="button" className={styles.closeButton} onClick={checkedClose} disabled={checkedBusy}>
          {copy.close}
        </button>
      </div>

      <div className={styles.slotGrid}>
        {FAMILY_TREE_SAVE_SLOT_NUMBERS.map((slotNumber, index) => {
          const filled = checkedSlots[index];
          if (filled === undefined) {
            throw new Error(`Family tree save slot ${slotNumber} is missing from the validated slots.`);
          }

          return (
            <article className={styles.slot} key={slotNumber} data-family-tree-save-slot={slotNumber}>
              <div className={styles.slotHeader}>
                <h3 className={styles.slotName}>{slotLabel(copy, slotNumber)}</h3>
                <span className={styles.slotState}>{filled ? copy.savedSlot : copy.emptySlot}</span>
              </div>
              <div className={styles.slotActions}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => checkedSaveSlot(slotNumber)}
                  disabled={checkedBusy}
                >
                  {copy.save}
                </button>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => checkedLoadSlot(slotNumber)}
                  disabled={checkedBusy || !filled}
                >
                  {copy.load}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <section className={styles.fileSection} aria-labelledby={`${fileInputId}-file-title`}>
        <h3 id={`${fileInputId}-file-title`} className={styles.sectionTitle}>
          {copy.localFile}
        </h3>
        <p className={styles.hint}>{copy.loadReplacesHint}</p>
        <div className={styles.fileControls}>
          <button type="button" className={styles.button} onClick={checkedSaveFile} disabled={checkedBusy}>
            {copy.saveFile}
          </button>
        </div>
        <label htmlFor={fileInputId} className={styles.sectionTitle}>
          {copy.chooseFile}
        </label>
        <input
          id={fileInputId}
          className={styles.fileInput}
          type="file"
          accept=".txt,.json,text/plain,application/json"
          onChange={(event) => handleFileSelection(event, checkedChooseFile)}
          disabled={checkedBusy}
        />
        <p className={styles.fileName}>{checkedFile?.name ?? copy.noFile}</p>
        <div className={styles.fileControls}>
          <button
            type="button"
            className={styles.button}
            onClick={checkedLoadFile}
            disabled={checkedBusy || checkedFile === null}
          >
            {copy.loadFile}
          </button>
        </div>
      </section>
    </section>
  );
}
