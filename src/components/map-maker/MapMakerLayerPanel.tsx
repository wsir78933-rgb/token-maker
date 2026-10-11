import { useId, type ReactNode } from 'react';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export type MapMakerEditTarget = 'base' | 'layer-1' | 'layer-2' | 'labels';

export interface MapMakerLayerPanelProps {
  copy: MapMakerWorkspaceCopy;
  collapseControl?: ReactNode;
  editTarget: MapMakerEditTarget;
  elementsVisible: boolean;
  labelsVisible: boolean;
  selectedBaseTileCount: number;
  selectedElementCount: number;
  selectedLabelCount: number;
  onEditTargetChange(target: MapMakerEditTarget): void;
  onElementsVisibilityChange(visible: boolean): void;
  onLabelsVisibilityChange(visible: boolean): void;
  onClearLayerOne(): void;
  onClearLayerTwo(): void;
}

const EDIT_TARGETS: readonly MapMakerEditTarget[] = ['base', 'layer-1', 'layer-2', 'labels'];

function targetLabel(target: MapMakerEditTarget, copy: MapMakerWorkspaceCopy): string {
  if (target === 'base') return copy.layers.baseMap;
  if (target === 'layer-1') return copy.layers.elementLayerOne;
  if (target === 'layer-2') return copy.layers.elementLayerTwo;
  return copy.layers.labels;
}

function selectedCount(target: MapMakerEditTarget, props: MapMakerLayerPanelProps): number {
  if (target === 'base') return props.selectedBaseTileCount;
  if (target === 'labels') return props.selectedLabelCount;
  return props.selectedElementCount;
}

function selectedCountLabel(target: MapMakerEditTarget, copy: MapMakerWorkspaceCopy): string {
  if (target === 'base') return copy.layers.selectedBaseTileCount;
  if (target === 'labels') return copy.layers.selectedLabelCount;
  return copy.layers.selectedElementCount;
}

export function MapMakerLayerPanel(props: MapMakerLayerPanelProps) {
  const headingId = useId();
  const { copy, editTarget } = props;
  const layerCopy = copy.layers;
  const activeCount = selectedCount(editTarget, props);

  return (
    <section aria-labelledby={headingId} className={styles.panelSection}>
      <header className={styles.panelHeader}>
        <h3 id={headingId} className={styles.panelTitle}>{layerCopy.title}</h3>
        {props.collapseControl}
      </header>
      <p className={styles.panelHint}>{layerCopy.editHint}</p>
      <div className={styles.layerChoices} role="group" aria-label={layerCopy.title}>
        {EDIT_TARGETS.map((target) => {
          const selected = editTarget === target;
          return (
            <button
              key={target}
              type="button"
              className={styles.layerChoice}
              aria-pressed={selected}
              onClick={() => props.onEditTargetChange(target)}
            >
              <span>{targetLabel(target, copy)}</span>
              {selected ? <strong className={styles.editingBadge}>{layerCopy.editingSuffix}</strong> : null}
            </button>
          );
        })}
      </div>

      <div className={styles.selectionSummary} role="status" aria-live="polite">
        <strong>{activeCount > 0 ? layerCopy.selectedObject : layerCopy.emptySelection}</strong>
        <span className={styles.mutedText}>{selectedCountLabel(editTarget, copy)}: {activeCount}</span>
        {activeCount > 0 ? <span className={styles.mutedText}>{layerCopy.deselectHint}</span> : null}
      </div>

      <h4 className={styles.subsectionTitle}>{layerCopy.visibilityTitle}</h4>
      <label className={styles.toggleRow}>
        <span>{layerCopy.showElements}</span>
        <input
          type="checkbox"
          checked={props.elementsVisible}
          onChange={(event) => props.onElementsVisibilityChange(event.currentTarget.checked)}
        />
      </label>
      <label className={styles.toggleRow}>
        <span>{layerCopy.showLabels}</span>
        <input
          type="checkbox"
          checked={props.labelsVisible}
          onChange={(event) => props.onLabelsVisibilityChange(event.currentTarget.checked)}
        />
      </label>

      <div className={styles.buttonRow}>
        <button type="button" className={styles.secondaryButton} onClick={props.onClearLayerOne}>
          {layerCopy.clearLayerOne}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={props.onClearLayerTwo}>
          {layerCopy.clearLayerTwo}
        </button>
      </div>
    </section>
  );
}
