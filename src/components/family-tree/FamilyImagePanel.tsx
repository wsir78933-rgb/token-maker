'use client';

import { useId } from 'react';

import type { FamilyTreeCopy } from '@/lib/family-tree/copy';

import styles from './document.module.css';

export interface FamilyImagePanelProps {
  readonly copy: FamilyTreeCopy;
  readonly previewUrl: string | null;
  readonly busy: boolean;
  readonly whiteBackground: boolean;
  readonly previewWhiteBackground: boolean;
  readonly onRegenerate: () => void;
  readonly onSave: () => void;
  readonly onClose: () => void;
  readonly onWhiteBackgroundChange: (whiteBackground: boolean) => void;
}

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

function requirePreviewUrl(value: unknown): string | null {
  if (value === null) {
    return null;
  }

  if (
    typeof value === 'string' &&
    (value.startsWith('blob:') || /^data:image\/(?:png|jpeg|webp|gif);/i.test(value))
  ) {
    return value;
  }

  throw new Error(
    `Family tree preview URL must be null, a blob URL, or an image data URL. Received ${describeReceivedValue(value)}.`,
  );
}

function requireBoolean(value: unknown, valueName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(
      `${valueName} must be a boolean. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value;
}

function requireCallback(value: unknown, callbackName: string): () => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Family tree image panel ${callbackName} must be a function. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value as () => void;
}

function requireWhiteBackgroundChangeCallback(
  value: unknown,
): (whiteBackground: boolean) => void {
  if (typeof value !== 'function') {
    throw new Error(
      `Family tree image panel onWhiteBackgroundChange must be a function. Received ${describeReceivedValue(value)}.`,
    );
  }

  return value as (whiteBackground: boolean) => void;
}

export function FamilyImagePanel({
  copy,
  previewUrl,
  busy,
  whiteBackground,
  previewWhiteBackground,
  onRegenerate,
  onSave,
  onClose,
  onWhiteBackgroundChange,
}: FamilyImagePanelProps) {
  const panelId = useId();
  const checkedPreviewUrl = requirePreviewUrl(previewUrl);
  const checkedBusy = requireBoolean(busy, 'Family tree image panel busy state');
  const checkedWhiteBackground = requireBoolean(
    whiteBackground,
    'Family tree image panel white background state',
  );
  const checkedPreviewWhiteBackground = requireBoolean(
    previewWhiteBackground,
    'Family tree image panel preview white background state',
  );
  const checkedRegenerate = requireCallback(onRegenerate, 'onRegenerate');
  const checkedSave = requireCallback(onSave, 'onSave');
  const checkedClose = requireCallback(onClose, 'onClose');
  const checkedWhiteBackgroundChange = requireWhiteBackgroundChangeCallback(onWhiteBackgroundChange);

  function selectBackground(nextWhiteBackground: boolean): void {
    if (checkedBusy || nextWhiteBackground === checkedWhiteBackground) return;
    checkedWhiteBackgroundChange(nextWhiteBackground);
  }

  return (
    <section className={styles.panel} aria-labelledby={`${panelId}-title`}>
      <div className={styles.header}>
        <h2 id={`${panelId}-title`} className={styles.title}>
          {copy.generateImage}
        </h2>
        <button type="button" className={styles.closeButton} onClick={checkedClose} disabled={checkedBusy}>
          {copy.close}
        </button>
      </div>

      <p className={styles.hint}>{copy.imageHelp}</p>

      <section className={styles.imageSection} aria-labelledby={`${panelId}-preview-title`}>
        <h3 id={`${panelId}-preview-title`} className={styles.sectionTitle}>
          {copy.imagePreview}
        </h3>
        <div className={styles.previewOptions} role="group" aria-label={copy.imagePreview}>
          <button
            type="button"
            className={`${styles.button} ${styles.backgroundButton}`}
            aria-pressed={!checkedWhiteBackground}
            disabled={checkedBusy}
            onClick={() => selectBackground(false)}
          >
            {copy.transparentBackground}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.backgroundButton}`}
            aria-pressed={checkedWhiteBackground}
            disabled={checkedBusy}
            onClick={() => selectBackground(true)}
          >
            {copy.whiteBackground}
          </button>
        </div>
        {checkedPreviewUrl === null ? (
          <p className={styles.emptyPreview}>{copy.imageHelp}</p>
        ) : (
          <div
            className={`${styles.previewFrame} ${checkedPreviewWhiteBackground ? styles.previewFrameWhite : styles.previewFrameTransparent}`}
            data-preview-background={checkedPreviewWhiteBackground ? 'white' : 'transparent'}
          >
            {/* Blob and data URLs are generated locally by the workbench and never become remote image requests. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob/data URLs cannot use Next image optimization. */}
            <img className={styles.preview} src={checkedPreviewUrl} alt={copy.imagePreview} />
          </div>
        )}
        <div className={styles.imageActions}>
          <button type="button" className={styles.button} onClick={checkedRegenerate} disabled={checkedBusy}>
            {copy.regenerateImage}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={checkedSave}
            disabled={checkedBusy || checkedPreviewUrl === null}
          >
            {copy.saveImage}
          </button>
        </div>
      </section>
    </section>
  );
}
