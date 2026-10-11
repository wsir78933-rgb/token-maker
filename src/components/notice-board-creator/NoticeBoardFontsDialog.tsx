'use client';

import { useId, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { NoticeBoardFontError, parseGoogleFontInputs } from '@/lib/notice-board-creator/fonts';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';
import type { NoticeBoardFont } from '@/lib/notice-board-creator/types';

import styles from './NoticeBoardCreatorWorkbench.module.css';

export type NoticeBoardFontsDialogProps = {
  open: boolean;
  copy: NoticeBoardEditorCopy;
  customFonts: readonly NoticeBoardFont[];
  onOpenChange: (open: boolean) => void;
  onAddFont: (font: NoticeBoardFont) => void;
};

export function NoticeBoardFontsDialog({
  open,
  copy,
  customFonts,
  onOpenChange,
  onAddFont,
}: NoticeBoardFontsDialogProps) {
  const fontsDialogId = useId();
  const [linkCode, setLinkCode] = useState('');
  const [familyDeclaration, setFamilyDeclaration] = useState('');
  const [fontError, setFontError] = useState<string | null>(null);
  const [fontStatus, setFontStatus] = useState<string | null>(null);

  function addGoogleFont(): void {
    setFontError(null);
    setFontStatus(null);
    try {
      const font = parseGoogleFontInputs(linkCode, familyDeclaration);
      onAddFont(font);
      setFontStatus(copy.fontAddedSuccessfully);
      setLinkCode('');
      setFamilyDeclaration('');
    } catch (fontFailure: unknown) {
      if (fontFailure instanceof NoticeBoardFontError) {
        setFontError(`${copy.errorTitle} ${fontFailure.message}`);
        return;
      }
      throw fontFailure;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialog} ${styles.fontsDialog}`}>
        <DialogClose className={styles.dialogClose} aria-label={copy.close} />
        <div className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>{copy.addGoogleFont}</DialogTitle>
          <DialogDescription className={styles.dialogDescription}>{copy.customFontHint}</DialogDescription>
          <a
            className={styles.fontLibraryLink}
            href="https://fonts.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.browseGoogleFonts}
          </a>
        </div>
        <div className={styles.dialogBody}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`${fontsDialogId}-link-code`}>
              {copy.fontLinkCode}
            </label>
            <textarea
              className={styles.textarea}
              id={`${fontsDialogId}-link-code`}
              value={linkCode}
              onChange={(event) => setLinkCode(event.currentTarget.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={`${fontsDialogId}-family-declaration`}>
              {copy.fontFamilyDeclaration}
            </label>
            <input
              className={styles.input}
              id={`${fontsDialogId}-family-declaration`}
              type="text"
              value={familyDeclaration}
              onChange={(event) => setFamilyDeclaration(event.currentTarget.value)}
              autoComplete="off"
            />
          </div>
          <div className={styles.dialogActions}>
            <button className={styles.primaryButton} type="button" onClick={addGoogleFont}>
              {copy.addFontToList}
            </button>
          </div>
          {fontError !== null ? <p className={styles.feedbackError} role="alert">{fontError}</p> : null}
          {fontStatus !== null ? <p className={styles.feedbackSuccess} role="status">{fontStatus}</p> : null}
          <h3 className={styles.slotSectionTitle}>{copy.addedFonts}</h3>
          {customFonts.length > 0 ? (
            <ul className={styles.fontList}>
              {customFonts.map((font) => (
                <li key={font.stylesheetUrl}>
                  <strong>{font.family}</strong>
                  <span className={styles.fontUrl}>{font.stylesheetUrl}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.dialogHint}>{copy.noCustomFonts}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
