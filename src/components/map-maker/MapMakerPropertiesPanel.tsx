import { useId, type ReactNode } from 'react';
import type { MapMakerProjectSettings } from '@/lib/map-maker';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import type { MapMakerEditTarget } from './MapMakerLayerPanel';
import styles from './MapMakerWorkbench.module.css';

export interface MapMakerPropertiesPanelProps {
  copy: MapMakerWorkspaceCopy;
  editTarget: MapMakerEditTarget;
  selectedBaseTileCount: number;
  selectedElementCount: number;
  selectedLabelCount: number;
  labelText: string;
  imageUrl: string;
  busy: boolean;
  settings: MapMakerProjectSettings;
  onImageUrlChange(value: string): void;
  onApplyImage(): void;
  onRestoreWater(): void;
  onElementResizingChange(enabled: boolean): void;
  onLabelResizingChange(enabled: boolean): void;
  onLabelBordersChange(enabled: boolean): void;
  onLabelTextChange(value: string): void;
  onDeleteSelectedElements(): void;
  onDeleteSelectedLabels(): void;
  onClearAllLabels(): void;
}

function renderCustomImageControls(props: MapMakerPropertiesPanelProps, isDisabled: boolean) {
  const copy = props.copy.properties;
  return (
    <>
      <label className={styles.fieldLabel}>
        <span>{copy.customImageUrl}</span>
        <input
          className={styles.input}
          type="url"
          inputMode="url"
          placeholder={copy.imageUrlPlaceholder}
          value={props.imageUrl}
          onChange={(event) => props.onImageUrlChange(event.currentTarget.value)}
          disabled={props.busy}
        />
      </label>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.primaryButton} onClick={props.onApplyImage} disabled={props.busy || isDisabled}>
          {copy.applyCustomImage}
        </button>
        {props.editTarget === 'base' ? (
          <button type="button" className={styles.secondaryButton} onClick={props.onRestoreWater} disabled={props.busy || props.selectedBaseTileCount === 0}>
            {copy.restoreWater}
          </button>
        ) : null}
      </div>
      <p className={styles.panelHint}>{copy.customImageTargetHint}</p>
    </>
  );
}

function renderBaseProperties(props: MapMakerPropertiesPanelProps) {
  return renderCustomImageControls(props, props.selectedBaseTileCount === 0);
}

function renderElementProperties(props: MapMakerPropertiesPanelProps) {
  const copy = props.copy.properties;
  return (
    <>
      {renderCustomImageControls(props, props.selectedElementCount !== 1)}
      <label className={styles.toggleRow}>
        <span>{props.settings.elementResizingEnabled ? copy.allowResize : copy.preventResize}</span>
        <input
          type="checkbox"
          checked={props.settings.elementResizingEnabled}
          onChange={(event) => props.onElementResizingChange(event.currentTarget.checked)}
        />
      </label>
      <button
        type="button"
        className={styles.dangerButton}
        disabled={props.selectedElementCount === 0}
        onClick={props.onDeleteSelectedElements}
      >
        {copy.deleteSelectedElement}
      </button>
    </>
  );
}

function renderLabelProperties(props: MapMakerPropertiesPanelProps) {
  const copy = props.copy.properties;
  const multipleLabelsSelected = props.selectedLabelCount > 1;
  return (
    <>
      {multipleLabelsSelected ? (
        <p className={styles.mutedText}>{copy.multiLabelSelection}: {props.selectedLabelCount}</p>
      ) : props.selectedLabelCount === 1 ? (
        <label className={styles.fieldLabel}>
          <span>{copy.labelText}</span>
          <textarea
            className={styles.textarea}
            rows={3}
            value={props.labelText}
            onChange={(event) => props.onLabelTextChange(event.currentTarget.value)}
            placeholder={copy.labelTextPlaceholder}
          />
        </label>
      ) : null}
      <label className={styles.toggleRow}>
        <span>{copy.allowResize}</span>
        <input
          type="checkbox"
          checked={props.settings.labelResizingEnabled}
          onChange={(event) => props.onLabelResizingChange(event.currentTarget.checked)}
        />
      </label>
      <label className={styles.toggleRow}>
        <span>{copy.labelBorder}</span>
        <input
          type="checkbox"
          checked={props.settings.labelBordersEnabled}
          onChange={(event) => props.onLabelBordersChange(event.currentTarget.checked)}
        />
      </label>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.dangerButton} disabled={props.selectedLabelCount === 0} onClick={props.onDeleteSelectedLabels}>
          {copy.bulkDeleteLabels}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={props.onClearAllLabels}>
          {copy.clearAllLabels}
        </button>
      </div>
    </>
  );
}

export function MapMakerPropertiesPanel(props: MapMakerPropertiesPanelProps) {
  const headingId = useId();
  const { copy } = props;
  let targetProperties: ReactNode;
  if (props.editTarget === 'base') targetProperties = renderBaseProperties(props);
  else if (props.editTarget === 'layer-1' || props.editTarget === 'layer-2') targetProperties = renderElementProperties(props);
  else targetProperties = renderLabelProperties(props);

  return (
    <section aria-labelledby={headingId} className={styles.panelSection}>
      <header className={styles.panelHeader}>
        <h3 id={headingId} className={styles.panelTitle}>{copy.properties.title}</h3>
      </header>
      <div className={styles.contentStack}>{targetProperties}</div>
    </section>
  );
}
