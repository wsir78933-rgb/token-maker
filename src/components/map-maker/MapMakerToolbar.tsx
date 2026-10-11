import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerToolbarProps {
  copy: MapMakerWorkspaceCopy;
  columns: number;
  rows: number;
  onOpenHelp(): void;
}

export function MapMakerToolbar({
  copy,
  columns,
  rows,
  onOpenHelp,
}: MapMakerToolbarProps) {
  const actions = copy.actions;
  const dimensions = copy.mapDimensions;

  return (
    <div className={styles.toolbar} aria-label={copy.title} data-testid="map-maker-toolbar">
      <div className={styles.toolbarActions} aria-hidden="true" />
      <p className={styles.dimensions}>
        <span>{columns} × {rows}</span> {dimensions.gridUnit}
      </p>
      <div className={styles.toolbarActions}>
        <button type="button" className={styles.iconButton} aria-label={actions.help} onClick={onOpenHelp}>
          ?
        </button>
      </div>
    </div>
  );
}
