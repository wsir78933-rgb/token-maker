'use client';

import { useId, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  NOTICE_BOARD_MAX_WIDTH,
  NOTICE_BOARD_MIN_WIDTH,
} from '@/lib/notice-board-creator/catalog';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import styles from './NoticeBoardCreatorWorkbench.module.css';

export type NoticeBoardSettingsDialogProps = {
  open: boolean;
  copy: NoticeBoardEditorCopy;
  boardWidth: number;
  dragEnabled: boolean;
  resizeEnabled: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyBoardWidth: (boardWidth: number) => void;
  onDragEnabledChange: (enabled: boolean) => void;
  onResizeEnabledChange: (enabled: boolean) => void;
};

export function NoticeBoardSettingsDialog({
  open,
  copy,
  boardWidth,
  dragEnabled,
  resizeEnabled,
  onOpenChange,
  onApplyBoardWidth,
  onDragEnabledChange,
  onResizeEnabledChange,
}: NoticeBoardSettingsDialogProps) {
  const settingsId = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialog} ${styles.settingsDialog}`}>
        <DialogClose className={styles.dialogClose} aria-label={copy.close} />
        <div className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>{copy.boardSettingsTitle}</DialogTitle>
          <DialogDescription className={styles.dialogDescription}>{copy.settingsHint}</DialogDescription>
        </div>
        <div className={styles.dialogBody}>
          <NoticeBoardBoardWidthControl
            key={open ? 'open' : 'closed'}
            copy={copy}
            boardWidth={boardWidth}
            onApplyBoardWidth={onApplyBoardWidth}
          />
          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxLabel} htmlFor={`${settingsId}-drag-enabled`}>
              <input
                id={`${settingsId}-drag-enabled`}
                type="checkbox"
                checked={dragEnabled}
                onChange={(event) => onDragEnabledChange(event.currentTarget.checked)}
              />
              <span>{copy.dragEnabled}</span>
            </label>
            <label className={styles.checkboxLabel} htmlFor={`${settingsId}-resize-enabled`}>
              <input
                id={`${settingsId}-resize-enabled`}
                type="checkbox"
                checked={resizeEnabled}
                onChange={(event) => onResizeEnabledChange(event.currentTarget.checked)}
              />
              <span>{copy.resizeEnabled}</span>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type NoticeBoardBoardWidthControlProps = {
  copy: NoticeBoardEditorCopy;
  boardWidth: number;
  onApplyBoardWidth: (boardWidth: number) => void;
};

function NoticeBoardBoardWidthControl({
  copy,
  boardWidth,
  onApplyBoardWidth,
}: NoticeBoardBoardWidthControlProps) {
  const settingsId = useId();
  const [boardWidthValue, setBoardWidthValue] = useState(String(boardWidth));
  const [widthError, setWidthError] = useState<string | null>(null);

  function applyBoardWidth(): void {
    const requestedWidth = Number(boardWidthValue);
    if (
      !Number.isInteger(requestedWidth) ||
      requestedWidth < NOTICE_BOARD_MIN_WIDTH ||
      requestedWidth > NOTICE_BOARD_MAX_WIDTH
    ) {
      setWidthError(
        `${copy.boardWidthInvalid(boardWidthValue)} ${NOTICE_BOARD_MIN_WIDTH}–${NOTICE_BOARD_MAX_WIDTH}.`,
      );
      return;
    }

    setWidthError(null);
    onApplyBoardWidth(requestedWidth);
  }

  return (
    <>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor={`${settingsId}-board-width`}>
          {copy.boardWidth}
        </label>
        <div className={styles.widthControls}>
          <input
            className={styles.input}
            id={`${settingsId}-board-width`}
            type="number"
            min={NOTICE_BOARD_MIN_WIDTH}
            max={NOTICE_BOARD_MAX_WIDTH}
            step={1}
            value={boardWidthValue}
            onChange={(event) => {
              setBoardWidthValue(event.currentTarget.value);
              setWidthError(null);
            }}
          />
          <button className={styles.primaryButton} type="button" onClick={applyBoardWidth}>
            {copy.apply}
          </button>
        </div>
      </div>
      {widthError !== null ? <p className={styles.feedbackError} role="alert">{widthError}</p> : null}
    </>
  );
}
