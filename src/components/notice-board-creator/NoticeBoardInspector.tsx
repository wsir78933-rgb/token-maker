'use client';

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';

import { NOTICE_BOARD_FONTS } from '@/lib/notice-board-creator/catalog';
import { NOTICE_BOARD_MAX_NOTICE_TEXT_LENGTH } from '@/lib/notice-board-creator/project';
import type { BoardNotice, NoticeBoardProject, NoticeTextStyle } from '@/lib/notice-board-creator/types';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import styles from './NoticeBoardCreatorWorkbench.module.css';

export type NoticeBoardInspectorProps = {
  copy: NoticeBoardEditorCopy;
  project: NoticeBoardProject;
  selectedNotices: readonly BoardNotice[];
  multiSelectEnabled: boolean;
  focusNoticeTextOnSelection: boolean;
  noticeTextFocusRequestId: number;
  onClosePanel: () => void;
  onNoticeTextChange: (noticeId: string, text: string) => void;
  onApplyFormatting: (style: NoticeTextStyle) => void;
  onOpenFonts: () => void;
};

export function NoticeBoardInspector({
  copy,
  project,
  selectedNotices,
  multiSelectEnabled,
  focusNoticeTextOnSelection,
  noticeTextFocusRequestId,
  onClosePanel,
  onNoticeTextChange,
  onApplyFormatting,
  onOpenFonts,
}: NoticeBoardInspectorProps) {
  const inspectorId = useId();
  const noticeTextRef = useRef<HTMLTextAreaElement>(null);
  const firstSelectedNotice = selectedNotices[0] ?? null;
  const firstSelectedNoticeId = firstSelectedNotice?.id ?? null;
  const hasSingleSelectedNotice = selectedNotices.length === 1;
  const controlsDisabled = firstSelectedNotice === null;
  const [styleDraft, setStyleDraft] = useState<NoticeTextStyle | null>(
    () => firstSelectedNotice?.style ?? null,
  );
  const [fontSizeValidationError, setFontSizeValidationError] = useState<string | null>(null);
  const [lineHeightValidationError, setLineHeightValidationError] = useState<string | null>(null);
  const customFontFamilies = project.customFonts.map((font) => font.family);
  const fontFamilies = [...NOTICE_BOARD_FONTS, ...project.customFonts.map((font) => ({
    label: font.family,
    family: font.family,
  }))];

  useEffect(() => {
    if (
      noticeTextFocusRequestId === 0 ||
      !focusNoticeTextOnSelection ||
      multiSelectEnabled ||
      !hasSingleSelectedNotice ||
      firstSelectedNoticeId === null
    ) {
      return;
    }

    const noticeTextArea = noticeTextRef.current;
    if (noticeTextArea === null) {
      throw new Error(
        `Cannot focus notice text for selected notice id ${JSON.stringify(firstSelectedNoticeId)} because the textarea ref is null.`,
      );
    }
    noticeTextArea.focus({ preventScroll: true });
  }, [
    firstSelectedNoticeId,
    focusNoticeTextOnSelection,
    hasSingleSelectedNotice,
    multiSelectEnabled,
    noticeTextFocusRequestId,
  ]);

  function updateStyleDraft(stylePatch: Partial<NoticeTextStyle>): void {
    if (styleDraft === null) {
      throw new Error('Cannot edit formatting without a selected notice; received null style draft.');
    }
    setStyleDraft({ ...styleDraft, ...stylePatch });
  }

  function applyStyleDraft(): void {
    if (styleDraft === null) {
      throw new Error('Cannot apply formatting without a selected notice; received null style draft.');
    }
    if (fontSizeValidationError !== null) {
      throw new Error(`Cannot apply formatting: ${fontSizeValidationError}`);
    }
    if (lineHeightValidationError !== null) {
      throw new Error(`Cannot apply formatting: ${lineHeightValidationError}`);
    }
    onApplyFormatting(styleDraft);
  }

  return (
    <section className={styles.panel} aria-labelledby={`${inspectorId}-title`}>
      <header className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle} id={`${inspectorId}-title`}>{copy.editPanel}</h2>
          <p className={styles.panelHint} aria-live="polite">
            {copy.selectedNoticeCount(selectedNotices.length)}
          </p>
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

      {firstSelectedNotice === null ? (
        <p className={styles.emptyInspector}>{copy.noNoticeSelected}</p>
      ) : null}

      {multiSelectEnabled ? (
        <p className={styles.batchHint} role="status">
          {copy.batchFormattingOnly} {copy.applyFormattingHint}
        </p>
      ) : null}

      {!multiSelectEnabled && firstSelectedNotice !== null ? (
        <div className={`${styles.fieldGroup} ${styles.noticeTextField}`}>
          <label className={styles.fieldLabel} htmlFor={`${inspectorId}-notice-text`}>
            {copy.noticeText}
          </label>
          <textarea
            className={`${styles.textarea} ${styles.noticeTextArea}`}
            id={`${inspectorId}-notice-text`}
            ref={noticeTextRef}
            value={firstSelectedNotice.text}
            maxLength={NOTICE_BOARD_MAX_NOTICE_TEXT_LENGTH}
            autoFocus={focusNoticeTextOnSelection}
            onChange={(event) => onNoticeTextChange(firstSelectedNotice.id, event.currentTarget.value)}
          />
        </div>
      ) : null}

      <div className={styles.inspectorFields}>
        <div className={`${styles.fieldGroup} ${styles.fontFamilyField}`}>
          <div className={styles.fieldHeading}>
            <label className={styles.fieldLabel} htmlFor={`${inspectorId}-font-family`}>
              {copy.fontFamily}
            </label>
            <button className={`${styles.secondaryButton} ${styles.fontAddButton}`} type="button" onClick={onOpenFonts}>
              {copy.addFont}
            </button>
          </div>
          <select
            className={styles.select}
            id={`${inspectorId}-font-family`}
            value={styleDraft?.fontFamily ?? ''}
            disabled={controlsDisabled}
            onChange={(event) => updateStyleDraft({ fontFamily: event.currentTarget.value })}
          >
            {firstSelectedNotice === null ? <option value="">{copy.noNoticeSelected}</option> : null}
            {fontFamilies.map((fontFamily) => (
              <option key={fontFamily.family} value={fontFamily.family}>
                {fontFamily.label}{customFontFamilies.includes(fontFamily.family) ? ' · Google' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.fieldGroup} ${styles.fontStyleField}`}>
          <label className={styles.fieldLabel} htmlFor={`${inspectorId}-font-style`}>
            {copy.fontStyle}
          </label>
          <select
            className={styles.select}
            id={`${inspectorId}-font-style`}
            value={styleDraft?.fontStyle ?? 'normal'}
            disabled={controlsDisabled}
            onChange={(event) => updateStyleDraft({ fontStyle: event.currentTarget.value as NoticeTextStyle['fontStyle'] })}
          >
            <option value="normal">{copy.normal}</option>
            <option value="italic">{copy.italic}</option>
            <option value="bold">{copy.bold}</option>
            <option value="bold-italic">{copy.boldItalic}</option>
          </select>
        </div>

        <div className={`${styles.fieldGroup} ${styles.fontSizeField}`}>
            <NoticeBoardNumberField
              key={`${firstSelectedNoticeId ?? 'none'}-font-size`}
              id={`${inspectorId}-font-size`}
              label={copy.fontSize}
              value={styleDraft?.fontSize ?? firstSelectedNotice?.style.fontSize ?? 20}
              minimum={8}
              maximum={96}
              invalidValueMessage={copy.fontSizeInvalid}
              disabled={controlsDisabled}
              onValueChange={(value) => updateStyleDraft({ fontSize: value })}
              onValidationErrorChange={setFontSizeValidationError}
            />
        </div>
        <div className={`${styles.fieldGroup} ${styles.lineHeightField}`}>
            <NoticeBoardNumberField
              key={`${firstSelectedNoticeId ?? 'none'}-line-height`}
              id={`${inspectorId}-line-height`}
              label={copy.lineHeight}
              value={styleDraft?.lineHeight ?? firstSelectedNotice?.style.lineHeight ?? 20}
              minimum={8}
              maximum={192}
              invalidValueMessage={copy.lineHeightInvalid}
              disabled={controlsDisabled}
              onValueChange={(value) => updateStyleDraft({ lineHeight: value })}
              onValidationErrorChange={setLineHeightValidationError}
            />
        </div>

        <div className={`${styles.fieldGroup} ${styles.colorField}`}>
            <label className={styles.fieldLabel} htmlFor={`${inspectorId}-text-color`}>
              {copy.textColor}
            </label>
            <input
              className={styles.colorInput}
              id={`${inspectorId}-text-color`}
              type="color"
              value={styleDraft?.color ?? firstSelectedNotice?.style.color ?? '#1d0f03'}
              disabled={controlsDisabled}
              onChange={(event) => updateStyleDraft({ color: event.currentTarget.value })}
            />
        </div>
        <div className={`${styles.fieldGroup} ${styles.alignmentField}`}>
            <label className={styles.fieldLabel} htmlFor={`${inspectorId}-text-alignment`}>
              {copy.textAlignment}
            </label>
            <select
              className={styles.select}
              id={`${inspectorId}-text-alignment`}
              value={styleDraft?.textAlign ?? firstSelectedNotice?.style.textAlign ?? 'left'}
              disabled={controlsDisabled}
              onChange={(event) => updateStyleDraft({ textAlign: event.currentTarget.value as NoticeTextStyle['textAlign'] })}
            >
              <option value="left">{copy.left}</option>
              <option value="center">{copy.center}</option>
              <option value="right">{copy.right}</option>
            </select>
        </div>
      </div>

      <button
        className={`${styles.primaryButton} ${styles.applyFormattingButton}`}
        type="button"
        disabled={controlsDisabled || fontSizeValidationError !== null || lineHeightValidationError !== null}
        onClick={applyStyleDraft}
      >
        <span className={styles.desktopApplyFormattingLabel}>{copy.applyFormatting}</span>
        <span className={styles.mobileApplyFormattingLabel}>{copy.applyToSelectedNotices}</span>
      </button>
      <p className={styles.panelFootnote}>{copy.applyFormattingHint}</p>
    </section>
  );
}

type NoticeBoardNumberFieldProps = {
  id: string;
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  invalidValueMessage: (value: string) => string;
  disabled: boolean;
  onValueChange: (value: number) => void;
  onValidationErrorChange: (message: string | null) => void;
};

function NoticeBoardNumberField({
  id,
  label,
  value,
  minimum,
  maximum,
  invalidValueMessage,
  disabled,
  onValueChange,
  onValidationErrorChange,
}: NoticeBoardNumberFieldProps) {
  const [draftValue, setDraftValue] = useState(String(value));
  const [validationError, setValidationError] = useState<string | null>(null);
  const errorId = `${id}-error`;

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const enteredValue = event.currentTarget.value;
    setDraftValue(enteredValue);
    const parsedValue = Number(enteredValue);
    if (
      enteredValue.length === 0 ||
      !Number.isFinite(parsedValue) ||
      parsedValue < minimum ||
      parsedValue > maximum
    ) {
      const invalidValueError = invalidValueMessage(enteredValue);
      setValidationError(invalidValueError);
      onValidationErrorChange(invalidValueError);
      return;
    }

    setValidationError(null);
    onValidationErrorChange(null);
    onValueChange(parsedValue);
  }

  return (
    <>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      <input
        className={styles.input}
        id={id}
        type="number"
        min={minimum}
        max={maximum}
        step={1}
        value={draftValue}
        disabled={disabled}
        aria-invalid={validationError !== null}
        aria-describedby={validationError === null ? undefined : errorId}
        onChange={handleChange}
      />
      {validationError !== null ? (
        <p className={styles.inlineError} id={errorId} role="alert">{validationError}</p>
      ) : null}
    </>
  );
}
