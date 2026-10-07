'use client';

import type { FamilyTreeCopy } from '@/lib/family-tree/copy';
import type {
  FamilyTreeConnection,
  FamilyTreeConnectionGap,
  FamilyTreeEndpointDirection,
  FamilyTreeEndpointStyle,
  FamilyTreePerson,
} from '@/lib/family-tree/scene';

import styles from './canvas.module.css';

const ENDPOINT_DIRECTIONS: readonly FamilyTreeEndpointDirection[] = [
  'top',
  'bottom',
  'left',
  'right',
];
const ENDPOINT_STYLES: readonly FamilyTreeEndpointStyle[] = ['none', 'solid', 'dashed'];
const CONNECTION_GAPS: readonly FamilyTreeConnectionGap[] = [0, 1, 2];
const CONNECTION_GAP_COPY_KEYS = [
  'generation1To2',
  'generation2To3',
  'generation3To4',
] as const;

export interface FamilyConnectionEditorProps {
  selectedPerson: FamilyTreePerson | null;
  connections: readonly FamilyTreeConnection[];
  copy: FamilyTreeCopy;
  selectedConnectionId: string | null;
  resizeEnabled: boolean;
  onEndpointChange(direction: FamilyTreeEndpointDirection, style: FamilyTreeEndpointStyle): void;
  onAddConnection(gap: FamilyTreeConnectionGap): void;
  onConnectionSelect(connectionId: string | null): void;
  onResizeEnabledChange(enabled: boolean): void;
  onClearConnections(): void;
}

function getConnectionGapLabel(copy: FamilyTreeCopy, gap: FamilyTreeConnectionGap): string {
  return copy.connectionGaps[CONNECTION_GAP_COPY_KEYS[gap]];
}

export function FamilyConnectionEditor({
  selectedPerson,
  connections,
  copy,
  selectedConnectionId,
  resizeEnabled,
  onEndpointChange,
  onAddConnection,
  onConnectionSelect,
  onResizeEnabledChange,
  onClearConnections,
}: FamilyConnectionEditorProps) {
  return (
    <section className={styles.connectionEditor} aria-label={copy.connectionEditor}>
      <header className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>{copy.connectionEditor}</h2>
          <p className={styles.editorHint}>{copy.endpointHint}</p>
        </div>
      </header>

      <div className={styles.endpointEditor}>
        <h3 className={styles.subheading}>{selectedPerson ? selectedPerson.name || copy.unnamedPerson : copy.selectedPerson}</h3>
        {selectedPerson ? (
          ENDPOINT_DIRECTIONS.map((direction) => (
            <div className={styles.endpointRow} key={direction}>
              <span className={styles.endpointLabel}>{copy.directions[direction]}</span>
              <div className={styles.endpointChoiceGroup} role="group" aria-label={copy.directions[direction]}>
                {ENDPOINT_STYLES.map((style) => (
                  <button
                    className={`${styles.endpointChoice} ${styles[`endpoint-${style}`]}`}
                    key={style}
                    type="button"
                    aria-pressed={selectedPerson.endpoints[direction] === style}
                    onClick={() => onEndpointChange(direction, style)}
                  >
                    {copy.endpointStyles[style]}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>{copy.selectedPerson}</p>
        )}
      </div>

      <div className={styles.connectionEditorSection}>
        <h3 className={styles.subheading}>{copy.connectionEditor}</h3>
        <div className={styles.connectionAddGrid}>
          {CONNECTION_GAPS.map((gap) => (
            <button
              className={styles.primaryButton}
              key={gap}
              type="button"
              onClick={() => onAddConnection(gap)}
            >
              {copy.addConnection}: {getConnectionGapLabel(copy, gap)}
            </button>
          ))}
        </div>

        {connections.length > 0 ? (
          <div className={styles.connectionList} aria-label={copy.dragConnectionHint}>
            {connections.map((connection) => (
              <button
                className={styles.connectionListItem}
                key={connection.id}
                type="button"
                aria-pressed={selectedConnectionId === connection.id}
                onClick={() => onConnectionSelect(selectedConnectionId === connection.id ? null : connection.id)}
              >
                {getConnectionGapLabel(copy, connection.gap)} · {connections.filter((item) => item.gap === connection.gap).indexOf(connection) + 1}
              </button>
            ))}
          </div>
        ) : null}

        <button
          className={styles.toggleButton}
          type="button"
          aria-pressed={resizeEnabled}
          onClick={() => onResizeEnabledChange(!resizeEnabled)}
        >
          {resizeEnabled ? copy.resizeEnabled : copy.resizeDisabled}
        </button>
        <p className={styles.editorHint}>{copy.dragConnectionHint}</p>
        <button className={styles.dangerButton} type="button" onClick={onClearConnections}>
          {copy.clearConnections}
        </button>
      </div>
    </section>
  );
}
