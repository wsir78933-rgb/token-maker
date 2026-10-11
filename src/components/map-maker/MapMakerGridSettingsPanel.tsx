import { useId } from 'react';

import type { MapMakerProjectSettings } from '@/lib/map-maker';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import styles from './MapMakerWorkbench.module.css';

export interface MapMakerGridSettingsPanelProps {
  copy: MapMakerWorkspaceCopy;
  settings: MapMakerProjectSettings;
  onSettingsChange(settings: Partial<MapMakerProjectSettings>): void;
}

export function MapMakerGridSettingsPanel(props: MapMakerGridSettingsPanelProps) {
  const headingId = useId();
  const viewCopy = props.copy.view;

  return (
    <section aria-labelledby={headingId} className={styles.panelSection}>
      <hr className={styles.sectionDivider} />
      <header className={styles.panelHeader}>
        <h3 id={headingId} className={styles.panelTitle}>{viewCopy.title}</h3>
      </header>
      <div className={styles.toggleGrid}>
        <label className={styles.toggleRow}>
          <span>{viewCopy.squareGrid}</span>
          <input type="checkbox" checked={props.settings.squareGridVisible} onChange={(event) => props.onSettingsChange({ squareGridVisible: event.currentTarget.checked })} />
        </label>
        <label className={styles.toggleRow}>
          <span>{viewCopy.hexGrid}</span>
          <input type="checkbox" checked={props.settings.hexGridVisible} onChange={(event) => props.onSettingsChange({ hexGridVisible: event.currentTarget.checked })} />
        </label>
        <label className={styles.fieldLabel}>
          <span>{viewCopy.hexSize}</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            max={15}
            step={0.1}
            value={props.settings.hexSizePercent}
            disabled={!props.settings.hexGridVisible}
            onChange={(event) => props.onSettingsChange({ hexSizePercent: Number(event.currentTarget.value) })}
          />
          <span className={styles.mutedText}>{viewCopy.hexRange}</span>
        </label>
        <label className={styles.toggleRow}>
          <span>{viewCopy.elementSnap}</span>
          <input type="checkbox" checked={props.settings.snapToGrid} onChange={(event) => props.onSettingsChange({ snapToGrid: event.currentTarget.checked })} />
        </label>
      </div>
    </section>
  );
}
