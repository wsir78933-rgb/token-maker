'use client';

import { useId } from 'react';

import { NOTICE_PAPER_ASSETS } from '@/lib/notice-board-creator/catalog';
import type { NoticePaperId } from '@/lib/notice-board-creator/types';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import styles from './NoticeBoardCreatorWorkbench.module.css';

export type NoticeBoardPaletteProps = {
  copy: NoticeBoardEditorCopy;
  onAddPaper: (paperId: NoticePaperId) => void;
  onClosePanel: () => void;
};

export function NoticeBoardPalette({ copy, onAddPaper, onClosePanel }: NoticeBoardPaletteProps) {
  const paletteId = useId();

  return (
    <section className={styles.panel} aria-labelledby={`${paletteId}-title`}>
      <header className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle} id={`${paletteId}-title`}>{copy.papersTitle}</h2>
        </div>
        <button
          className={`${styles.secondaryButton} ${styles.mobilePanelClose}`}
          type="button"
          aria-label={copy.closePanel}
          onClick={onClosePanel}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div className={styles.paperGrid}>
        {NOTICE_PAPER_ASSETS.map((paperAsset, index) => (
          <button
            className={styles.paperChoice}
            key={paperAsset.id}
            type="button"
            aria-label={copy.addPaperLabel(index + 1)}
            onClick={() => onAddPaper(paperAsset.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Keep paper SVG previews as image elements for print-safe asset rendering. */}
            <img
              className={styles.paperThumbnail}
              src={paperAsset.src}
              width={paperAsset.width}
              height={paperAsset.height}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
            <span>{copy.paperCardLabel(index + 1)}</span>
          </button>
        ))}
      </div>
      <p className={`${styles.panelHint} ${styles.paperHintNote}`}>{copy.paperHint}</p>
    </section>
  );
}
