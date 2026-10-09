import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerToolbarProps {
  copy: MapMakerWorkspaceCopy;
  columns: number;
  rows: number;
  onRandomGenerate(): void;
  onOpenSize(): void;
  onOpenReset(): void;
  onOpenSave(): void;
  onOpenExport(): void;
  onOpenHelp(): void;
}

export function MapMakerToolbar({
  copy,
  columns,
  rows,
  onRandomGenerate,
  onOpenSize,
  onOpenReset,
  onOpenSave,
  onOpenExport,
  onOpenHelp,
}: MapMakerToolbarProps) {
  const actions = copy.actions;
  const dimensions = copy.mapDimensions;

  return (
    <div className={styles.toolbar} aria-label={copy.title}>
      <div className={styles.toolbarActions}>
        <button type="button" className={styles.secondaryButton} onClick={onRandomGenerate}>
          {actions.randomGenerate}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onOpenSize}>
          {actions.mapSize}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onOpenReset}>
          {actions.resetAndClear}
        </button>
      </div>
      <p className={styles.dimensions}>
        <span>{columns} × {rows}</span> {dimensions.gridUnit}
      </p>
      <div className={styles.toolbarActions}>
        <button type="button" className={styles.secondaryButton} onClick={onOpenSave}>
          {actions.saveAndLoad}
        </button>
        <button type="button" className={styles.primaryButton} onClick={onOpenExport}>
          {actions.exportImage}
        </button>
        <button type="button" className={styles.iconButton} aria-label={actions.help} onClick={onOpenHelp}>
          ?
        </button>
      </div>
    </div>
  );
}
