'use client';

import { useId, useState, type FormEvent } from 'react';
import Image from 'next/image';

import { SCROLL_FONT_OPTIONS, SCROLL_PAPERS } from '@/lib/scroll-creator/catalog';
import type { ScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import {
  SCROLL_MAX_HEIGHT,
  SCROLL_MAX_WIDTH,
  SCROLL_MIN_HEIGHT,
  SCROLL_MIN_WIDTH,
} from '@/lib/scroll-creator/types';
import type {
  ScrollProject,
  ScrollTab,
  ScrollTextStyle,
} from '@/lib/scroll-creator/types';

import styles from './ScrollSettingsPanel.module.css';

export interface ScrollSettingsPanelProps {
  project: ScrollProject;
  copy: ScrollCreatorCopy;
  activeTab: ScrollTab;
  paperResizing: boolean;
  imagesVisible: boolean;
  imagesDraggable: boolean;
  imagesResizable: boolean;
  selectedImageIds: readonly string[];
  imagePending: boolean;
  fontPending: boolean;
  onPaperChoice: (id: string) => void;
  onPaperResizingChange: (enabled: boolean) => void;
  onPaperSizeChange: (width: number, height: number) => void;
  onPaperSizeReset: () => void;
  onTextStyleChange: (patch: Partial<ScrollTextStyle>) => void;
  onImageVisibilityChange: (enabled: boolean) => void;
  onImageDraggingChange: (enabled: boolean) => void;
  onImageResizingChange: (enabled: boolean) => void;
  onAddImage: (url: string) => Promise<void>;
  onDeleteSelectedImages: () => void;
  onAddFont: (source: string, family: string) => Promise<void>;
}

type SettingsError = {
  field: string;
  message: string;
};

function describeInputValue(value: string): string {
  return JSON.stringify(value);
}

function requireFontSize(value: string): number {
  const parsedValue = Number(value);
  if (value.trim() === '' || !Number.isFinite(parsedValue)) {
    throw new Error(`fontSize must be a finite number from 8 to 96; received ${describeInputValue(value)}.`);
  }

  if (parsedValue < 8 || parsedValue > 96) {
    throw new Error(`fontSize must be from 8 to 96; received ${describeInputValue(value)}.`);
  }

  return parsedValue;
}

function requireScrollDimensionDraft(value: string, label: string, minimum: number, maximum: number): number {
  const parsedValue = Number(value);
  if (value.trim() === '' || !Number.isFinite(parsedValue)) {
    throw new Error(
      `${label} must be a finite number from ${minimum} to ${maximum}; received ${describeInputValue(value)}.`,
    );
  }

  if (parsedValue < minimum || parsedValue > maximum) {
    throw new Error(
      `${label} must be from ${minimum} to ${maximum}; received ${describeInputValue(value)}.`,
    );
  }

  return parsedValue;
}

function getSelectedImageLabel(copy: ScrollCreatorCopy, count: number): string {
  return `${copy.selectedImages} ${count}`;
}

interface FontSizeDraftFieldProps {
  inputId: string;
  copy: ScrollCreatorCopy;
  value: number;
  onCommit: (value: number) => void;
  onInvalid: (reason: Error) => void;
}

function FontSizeDraftField({ inputId, copy, value, onCommit, onInvalid }: FontSizeDraftFieldProps) {
  const [draftState, setDraftState] = useState({ externalValue: value, draft: String(value) });
  if (draftState.externalValue !== value) {
    setDraftState({ externalValue: value, draft: String(value) });
  }
  const displayedDraft = draftState.externalValue === value ? draftState.draft : String(value);

  function validateDraft(nextDraft: string): void {
    try {
      onCommit(requireFontSize(nextDraft));
    } catch (reason) {
      if (reason instanceof Error) {
        onInvalid(reason);
        return;
      }

      throw reason;
    }
  }

  return (
    <input
      id={inputId}
      className={styles.input}
      type="number"
      min={8}
      max={96}
      step={1}
      value={displayedDraft}
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraftState({ externalValue: value, draft: nextDraft });
        validateDraft(nextDraft);
      }}
      onBlur={() => {
        try {
          const validFontSize = requireFontSize(displayedDraft);
          onCommit(validFontSize);
        } catch (reason) {
          if (reason instanceof Error) {
            onInvalid(reason);
            return;
          }

          throw reason;
        }
      }}
      aria-label={copy.fontSize}
    />
  );
}

interface ScrollDimensionFieldProps {
  inputId: string;
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  onCommit: (value: number) => void;
  onInvalid: (reason: Error) => void;
}

function ScrollDimensionField({
  inputId,
  label,
  value,
  minimum,
  maximum,
  onCommit,
  onInvalid,
}: ScrollDimensionFieldProps) {
  const [draftState, setDraftState] = useState({ externalValue: value, draft: String(value) });
  if (draftState.externalValue !== value) {
    setDraftState({ externalValue: value, draft: String(value) });
  }
  const displayedDraft = draftState.externalValue === value ? draftState.draft : String(value);

  function commitDraft(): void {
    try {
      onCommit(requireScrollDimensionDraft(displayedDraft, label, minimum, maximum));
    } catch (reason) {
      if (reason instanceof Error) {
        onInvalid(reason);
        return;
      }

      throw reason;
    }
  }

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={inputId} className={styles.fieldLabel}>{label}</label>
      <input
        id={inputId}
        className={styles.input}
        type="number"
        min={minimum}
        max={maximum}
        step={1}
        value={displayedDraft}
        onChange={(event) => setDraftState({ externalValue: value, draft: event.target.value })}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitDraft();
          }
        }}
      />
    </div>
  );
}

export function ScrollSettingsPanel({
  project,
  copy,
  activeTab,
  paperResizing,
  imagesVisible,
  imagesDraggable,
  imagesResizable,
  selectedImageIds,
  imagePending,
  fontPending,
  onPaperChoice,
  onPaperResizingChange,
  onPaperSizeChange,
  onPaperSizeReset,
  onTextStyleChange,
  onImageVisibilityChange,
  onImageDraggingChange,
  onImageResizingChange,
  onAddImage,
  onDeleteSelectedImages,
  onAddFont,
}: ScrollSettingsPanelProps) {
  const panelId = useId();
  const imageUrlId = `${panelId}-image-url`;
  const fontSourceId = `${panelId}-font-source`;
  const fontNameId = `${panelId}-font-name`;
  const fontSizeId = `${panelId}-font-size`;
  const colorId = `${panelId}-font-color`;
  const paperWidthId = `${panelId}-paper-width`;
  const paperHeightId = `${panelId}-paper-height`;
  const [imageUrl, setImageUrl] = useState('');
  const [fontSource, setFontSource] = useState('');
  const [fontName, setFontName] = useState('');
  const [settingsError, setSettingsError] = useState<SettingsError | null>(null);
  const [paperSizeRevision, setPaperSizeRevision] = useState(0);

  function resetPaperSize(): void {
    onPaperSizeReset();
    setPaperSizeRevision((revision) => revision + 1);
    setSettingsError(null);
  }

  function applyTextStyle(patch: Partial<ScrollTextStyle>, field: string): void {
    try {
      onTextStyleChange(patch);
      setSettingsError(null);
    } catch (reason) {
      if (reason instanceof Error) {
        setSettingsError({ field, message: reason.message });
        return;
      }

      throw reason;
    }
  }

  async function submitImage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl.length === 0) {
      setSettingsError({ field: copy.imageUrl, message: `Received ${describeInputValue(imageUrl)}.` });
      return;
    }

    try {
      await onAddImage(trimmedUrl);
      setImageUrl('');
      setSettingsError(null);
    } catch (reason) {
      if (reason instanceof Error) {
        setSettingsError({ field: copy.imageUrl, message: reason.message });
        return;
      }

      throw reason;
    }
  }

  async function submitFont(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmedSource = fontSource.trim();
    const trimmedName = fontName.trim();
    if (trimmedSource.length === 0) {
      setSettingsError({ field: copy.fontSource, message: `Received ${describeInputValue(fontSource)}.` });
      return;
    }
    if (trimmedName.length === 0) {
      setSettingsError({ field: copy.fontName, message: `Received ${describeInputValue(fontName)}.` });
      return;
    }

    try {
      await onAddFont(trimmedSource, trimmedName);
      setFontSource('');
      setFontName('');
      setSettingsError(null);
    } catch (reason) {
      if (reason instanceof Error) {
        setSettingsError({ field: copy.fontSource, message: reason.message });
        return;
      }

      throw reason;
    }
  }

  function renderPaperSettings() {
    return (
      <section className={styles.section} aria-labelledby={`${panelId}-paper-heading`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 id={`${panelId}-paper-heading`} className={styles.sectionTitle}>{copy.paperTitle}</h2>
            <p className={styles.sectionHint}>{copy.paperHint}</p>
          </div>
        </div>

        <div className={styles.paperGrid}>
          {SCROLL_PAPERS.map((paper, index) => {
            const isSelected = project.paperId === paper.id;
            return (
              <button
                key={paper.id}
                type="button"
                className={`${styles.paperChoice} ${isSelected ? styles.paperChoiceSelected : ''}`}
                aria-label={`${copy.paperChoice} ${index + 1}`}
                aria-pressed={isSelected}
                data-scroll-paper-id={paper.id}
                onClick={() => onPaperChoice(paper.id)}
              >
                <Image src={paper.src} alt="" className={styles.paperThumbnail} width={96} height={138} />
                <span>{index + 1}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.paperResizeControls}>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={paperResizing}
              onChange={(event) => onPaperResizingChange(event.target.checked)}
            />
            <span>{copy.paperResize}</span>
          </label>
          <button
            type="button"
            className={`${styles.toggleButton} ${styles.resetButton}`}
            onClick={resetPaperSize}
          >
            {copy.paperSizeReset}
          </button>
        </div>

        {paperResizing ? (
          <div className={styles.paperSizeFields}>
            <ScrollDimensionField
              key={`width-${paperSizeRevision}`}
              inputId={paperWidthId}
              label={copy.paperWidth}
              value={project.width}
              minimum={SCROLL_MIN_WIDTH}
              maximum={SCROLL_MAX_WIDTH}
              onCommit={(width) => {
                onPaperSizeChange(width, project.height);
                setSettingsError(null);
              }}
              onInvalid={(reason) => setSettingsError({ field: copy.paperWidth, message: reason.message })}
            />
            <ScrollDimensionField
              key={`height-${paperSizeRevision}`}
              inputId={paperHeightId}
              label={copy.paperHeight}
              value={project.height}
              minimum={SCROLL_MIN_HEIGHT}
              maximum={SCROLL_MAX_HEIGHT}
              onCommit={(height) => {
                onPaperSizeChange(project.width, height);
                setSettingsError(null);
              }}
              onInvalid={(reason) => setSettingsError({ field: copy.paperHeight, message: reason.message })}
            />
          </div>
        ) : null}
      </section>
    );
  }

  function renderTextSettings() {
    const selectedFont = project.textStyle.fontFamily;
    return (
      <section className={styles.section} aria-labelledby={`${panelId}-text-heading`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 id={`${panelId}-text-heading`} className={styles.sectionTitle}>{copy.textTitle}</h2>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor={`${panelId}-font-family`} className={styles.fieldLabel}>{copy.fontFamily}</label>
          <select
            id={`${panelId}-font-family`}
            className={styles.input}
            value={selectedFont}
            onChange={(event) => applyTextStyle({ fontFamily: event.target.value }, copy.fontFamily)}
          >
            {SCROLL_FONT_OPTIONS.map((font) => (
              <option key={font.family} value={font.family}>{font.name}</option>
            ))}
            {project.customFonts.map((font) => (
              <option key={font.family} value={font.family}>{font.family}</option>
            ))}
          </select>
        </div>

        <div className={styles.twoColumnFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor={fontSizeId} className={styles.fieldLabel}>{copy.fontSize}</label>
            <FontSizeDraftField
              inputId={fontSizeId}
              copy={copy}
              value={project.textStyle.fontSize}
              onCommit={(fontSize) => applyTextStyle({ fontSize }, copy.fontSize)}
              onInvalid={(reason) => setSettingsError({ field: copy.fontSize, message: reason.message })}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor={colorId} className={styles.fieldLabel}>{copy.textColor}</label>
            <input
              id={colorId}
              className={styles.colorInput}
              type="color"
              value={project.textStyle.color}
              onChange={(event) => applyTextStyle({ color: event.target.value }, copy.textColor)}
            />
          </div>
        </div>

        <div
          className={`${styles.buttonGroup} ${styles.twoButtonGroup}`}
          role="group"
          aria-label={`${copy.bold} / ${copy.italic}`}
        >
          <button
            type="button"
            className={styles.toggleButton}
            aria-pressed={project.textStyle.bold}
            onClick={() => applyTextStyle({ bold: !project.textStyle.bold }, copy.bold)}
          >
            <strong>B</strong> {copy.bold}
          </button>
          <button
            type="button"
            className={styles.toggleButton}
            aria-pressed={project.textStyle.italic}
            onClick={() => applyTextStyle({ italic: !project.textStyle.italic }, copy.italic)}
          >
            <em>I</em> {copy.italic}
          </button>
        </div>

        <div
          className={styles.buttonGroup}
          role="group"
          aria-label={`${copy.alignLeft} / ${copy.alignCenter} / ${copy.alignRight}`}
        >
          {(['left', 'center', 'right'] as const).map((align) => {
            const label = align === 'left' ? copy.alignLeft : align === 'center' ? copy.alignCenter : copy.alignRight;
            return (
              <button
                key={align}
                type="button"
                className={styles.toggleButton}
                aria-pressed={project.textStyle.align === align}
                onClick={() => applyTextStyle({ align }, label)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <details className={styles.advancedSection}>
          <summary className={styles.advancedSummary}>{copy.advancedFonts}</summary>
          <p className={styles.fontHint}>{copy.fontHint}</p>
          <a
            className={styles.fontLink}
            href="https://fonts.google.com/"
            target="_blank"
            rel="noreferrer"
          >
            {copy.googleFontsLink}
          </a>
          <form className={styles.advancedForm} onSubmit={submitFont}>
            <div className={styles.fieldGroup}>
              <label htmlFor={fontSourceId} className={styles.fieldLabel}>{copy.fontSource}</label>
              <input
                id={fontSourceId}
                className={styles.input}
                value={fontSource}
                placeholder={copy.fontSourcePlaceholder}
                onChange={(event) => setFontSource(event.target.value)}
                disabled={fontPending}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor={fontNameId} className={styles.fieldLabel}>{copy.fontName}</label>
              <input
                id={fontNameId}
                className={styles.input}
                value={fontName}
                placeholder={copy.fontNamePlaceholder}
                onChange={(event) => setFontName(event.target.value)}
                disabled={fontPending}
              />
            </div>
            <button type="submit" className={styles.primaryButton} disabled={fontPending}>
              {fontPending ? copy.fontLoading : copy.addFont}
            </button>
          </form>
        </details>
      </section>
    );
  }

  function renderImageSettings() {
    return (
      <section className={styles.section} aria-labelledby={`${panelId}-image-heading`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 id={`${panelId}-image-heading`} className={styles.sectionTitle}>{copy.imageTitle}</h2>
            <p className={styles.sectionHint}>{copy.imageHint}</p>
          </div>
        </div>

        <form className={styles.imageForm} onSubmit={submitImage}>
          <label htmlFor={imageUrlId} className={styles.fieldLabel}>{copy.imageUrl}</label>
          <div className={styles.inlineForm}>
            <input
              id={imageUrlId}
              className={styles.input}
              type="url"
              value={imageUrl}
              placeholder={copy.imageUrlPlaceholder}
              onChange={(event) => setImageUrl(event.target.value)}
              disabled={imagePending}
            />
            <button type="submit" className={styles.primaryButton} disabled={imagePending}>
              {imagePending ? copy.imageLoading : copy.addImage}
            </button>
          </div>
        </form>

        <div className={styles.switchList}>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={imagesVisible}
              onChange={(event) => onImageVisibilityChange(event.target.checked)}
            />
            <span>{copy.showImages}</span>
          </label>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={imagesDraggable}
              onChange={(event) => onImageDraggingChange(event.target.checked)}
            />
            <span>{copy.dragImages}</span>
          </label>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={imagesResizable}
              onChange={(event) => onImageResizingChange(event.target.checked)}
            />
            <span>{copy.resizeImages}</span>
          </label>
        </div>

        <div className={styles.selectionToolbar}>
          <span className={styles.selectionLabel}>{getSelectedImageLabel(copy, selectedImageIds.length)}</span>
          <button
            type="button"
            className={styles.dangerButton}
            disabled={selectedImageIds.length === 0}
            onClick={onDeleteSelectedImages}
          >
            {copy.deleteSelected}
          </button>
        </div>
      </section>
    );
  }

  const paperTabIsActive = activeTab === 'paper';

  return (
    <div className={styles.panel} data-scroll-settings-tab={activeTab}>
      <div className={styles.panelTabs}>
        <div
          className={paperTabIsActive ? styles.paperPanel : `${styles.paperPanel} ${styles.paperPanelHidden}`}
          data-scroll-settings-panel="paper"
          aria-hidden={!paperTabIsActive}
          inert={!paperTabIsActive}
        >
          {renderPaperSettings()}
        </div>
        {activeTab === 'text' ? (
          <div className={styles.overlayPanel} data-scroll-settings-panel="text">
            {renderTextSettings()}
          </div>
        ) : null}
        {activeTab === 'images' ? (
          <div className={styles.overlayPanel} data-scroll-settings-panel="images">
            {renderImageSettings()}
          </div>
        ) : null}
      </div>
      {settingsError ? (
        <p role="alert" className={styles.errorMessage}>
          {copy.operationFailed}: {settingsError.field} — {settingsError.message}
        </p>
      ) : null}
    </div>
  );
}
