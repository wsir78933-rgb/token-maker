'use client';

import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

import type { FamilyTreeCopy } from '@/lib/family-tree/copy';
import {
  FAMILY_TREE_CONNECTION_COLOR,
  FAMILY_TREE_CONNECTION_HANDLE_SIZE,
  FAMILY_TREE_CONNECTION_MIN_WIDTH,
  FAMILY_TREE_CONNECTION_STROKE_WIDTH,
  FAMILY_TREE_CONTENT_LEFT,
  FAMILY_TREE_GENERATION_ROW_HEIGHT,
  FAMILY_TREE_SCENE_TOP_PADDING,
  familyTreeAvatarBox,
  familyTreeConnectionY,
  familyTreeEndpointSegment,
  familyTreePersonBox,
  familyTreeSceneSize,
} from '@/lib/family-tree/layout';
import type {
  FamilyTreeConnection,
  FamilyTreeConnectionGap,
  FamilyTreeEndpointDirection,
  FamilyTreeEndpointStyle,
  FamilyTreePerson,
  FamilyTreeScene,
} from '@/lib/family-tree/scene';

import { FamilyAvatar } from './FamilyAvatar';
import styles from './canvas.module.css';

const ENDPOINT_DIRECTIONS: readonly FamilyTreeEndpointDirection[] = [
  'top',
  'bottom',
  'left',
  'right',
];
const ENDPOINT_STYLES: readonly FamilyTreeEndpointStyle[] = ['none', 'solid', 'dashed'];
const GENERATION_COPY_KEYS = [
  'generation1',
  'generation2',
  'generation3',
  'generation4',
] as const;
const CONNECTION_GAP_COPY_KEYS = [
  'generation1To2',
  'generation2To3',
  'generation3To4',
] as const;
const FAMILY_TREE_KEYBOARD_STEP = 16;

type PersonPointerGesture = {
  id: string;
  pointerId: number;
  startClientX: number;
  startX: number;
  moved: boolean;
};

type ConnectionPointerGesture = {
  id: string;
  pointerId: number;
  mode: 'move' | 'start' | 'end';
  startClientX: number;
  startX: number;
  startWidth: number;
  moved: boolean;
};

export interface FamilyTreeCanvasProps {
  scene: FamilyTreeScene;
  copy: FamilyTreeCopy;
  headerActions?: ReactNode;
  selectedConnectionId: string | null;
  onPersonSelect(personId: string | null): void;
  onPersonMove(personId: string, x: number): void;
  onPersonDelete(personId: string): void;
  onEndpointChange(
    personId: string,
    direction: FamilyTreeEndpointDirection,
    style: FamilyTreeEndpointStyle,
  ): void;
  onConnectionSelect(connectionId: string | null): void;
  onConnectionMove(connectionId: string, x: number): void;
  onConnectionResize(connectionId: string, x: number, width: number): void;
  onOpenConnections(): void;
}

function nextEndpointStyle(style: FamilyTreeEndpointStyle): FamilyTreeEndpointStyle {
  const currentIndex = ENDPOINT_STYLES.indexOf(style);
  if (currentIndex === -1) {
    throw new Error(`Family tree endpoint style is invalid, received ${JSON.stringify(style)}.`);
  }

  return ENDPOINT_STYLES[(currentIndex + 1) % ENDPOINT_STYLES.length] as FamilyTreeEndpointStyle;
}

function getGenerationLabel(copy: FamilyTreeCopy, generation: FamilyTreePerson['generation']): string {
  return copy.generations[GENERATION_COPY_KEYS[generation]];
}

function getConnectionGapLabel(copy: FamilyTreeCopy, gap: FamilyTreeConnectionGap): string {
  return copy.connectionGaps[CONNECTION_GAP_COPY_KEYS[gap]];
}

function getEndpointSegmentStyle(
  person: FamilyTreePerson,
  direction: FamilyTreeEndpointDirection,
  endpointStyle: Exclude<FamilyTreeEndpointStyle, 'none'>,
): CSSProperties {
  const segment = familyTreeEndpointSegment(person, direction);
  const isHorizontal = segment.start.y === segment.end.y;

  const lineStyle: CSSProperties = {
    left: `${Math.min(segment.start.x, segment.end.x)}px`,
    top: `${Math.min(segment.start.y, segment.end.y)}px`,
    width: `${isHorizontal ? Math.abs(segment.end.x - segment.start.x) : FAMILY_TREE_CONNECTION_STROKE_WIDTH}px`,
    height: `${isHorizontal ? FAMILY_TREE_CONNECTION_STROKE_WIDTH : Math.abs(segment.end.y - segment.start.y)}px`,
  };

  if (isHorizontal) {
    lineStyle.borderTopWidth = `${FAMILY_TREE_CONNECTION_STROKE_WIDTH}px`;
    lineStyle.borderTopColor = FAMILY_TREE_CONNECTION_COLOR;
    lineStyle.borderTopStyle = endpointStyle;
  } else {
    lineStyle.borderLeftWidth = `${FAMILY_TREE_CONNECTION_STROKE_WIDTH}px`;
    lineStyle.borderLeftColor = FAMILY_TREE_CONNECTION_COLOR;
    lineStyle.borderLeftStyle = endpointStyle;
  }

  return lineStyle;
}

function getConnectionStyle(connection: FamilyTreeConnection): CSSProperties {
  return {
    left: `${FAMILY_TREE_CONTENT_LEFT + connection.x}px`,
    top: `${familyTreeConnectionY(connection.gap) - FAMILY_TREE_CONNECTION_STROKE_WIDTH / 2}px`,
    width: `${connection.width}px`,
    height: `${FAMILY_TREE_CONNECTION_STROKE_WIDTH}px`,
    backgroundColor: FAMILY_TREE_CONNECTION_COLOR,
  };
}

function setPointerCaptureIfAvailable(element: Element, pointerId: number): void {
  const pointerCaptureElement = element as Element & {
    setPointerCapture?: (capturePointerId: number) => void;
  };
  pointerCaptureElement.setPointerCapture?.(pointerId);
}

function releasePointerCaptureIfAvailable(element: Element, pointerId: number): void {
  const pointerCaptureElement = element as Element & {
    releasePointerCapture?: (capturePointerId: number) => void;
  };
  pointerCaptureElement.releasePointerCapture?.(pointerId);
}

function clampPersonPosition(x: number): number {
  if (!Number.isFinite(x)) {
    throw new Error(`Family tree person position must be finite, received ${String(x)}.`);
  }
  return Math.max(0, x);
}

function clampConnectionPosition(x: number): number {
  if (!Number.isFinite(x)) {
    throw new Error(`Family tree connection position must be finite, received ${String(x)}.`);
  }
  return Math.max(0, x);
}

function moveConnectionWithKeyboard(
  connection: FamilyTreeConnection,
  key: string,
  onConnectionMove: (connectionId: string, x: number) => void,
): void {
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;

  const direction = key === 'ArrowLeft' ? -1 : 1;
  onConnectionMove(
    connection.id,
    clampConnectionPosition(connection.x + direction * FAMILY_TREE_KEYBOARD_STEP),
  );
}

function resizeConnectionWithKeyboard(
  connection: FamilyTreeConnection,
  edge: 'start' | 'end',
  key: string,
  onConnectionResize: (connectionId: string, x: number, width: number) => void,
): void {
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;

  const direction = key === 'ArrowLeft' ? -1 : 1;
  const delta = direction * FAMILY_TREE_KEYBOARD_STEP;
  if (edge === 'start') {
    const nextX = clampConnectionPosition(connection.x + delta);
    const nextWidth = connection.width - (nextX - connection.x);
    if (nextWidth >= FAMILY_TREE_CONNECTION_MIN_WIDTH) {
      onConnectionResize(connection.id, nextX, nextWidth);
    }
    return;
  }

  const nextWidth = connection.width + delta;
  if (nextWidth >= FAMILY_TREE_CONNECTION_MIN_WIDTH) {
    onConnectionResize(connection.id, connection.x, nextWidth);
  }
}

export function FamilyTreeCanvas({
  scene,
  copy,
  headerActions,
  selectedConnectionId,
  onPersonSelect,
  onPersonMove,
  onPersonDelete,
  onEndpointChange,
  onConnectionSelect,
  onConnectionMove,
  onConnectionResize,
  onOpenConnections,
}: FamilyTreeCanvasProps) {
  const personGestureRef = useRef<PersonPointerGesture | null>(null);
  const connectionGestureRef = useRef<ConnectionPointerGesture | null>(null);
  const suppressPersonClickRef = useRef(false);
  const suppressConnectionClickRef = useRef(false);
  const sceneSize = familyTreeSceneSize(scene);
  const selectedPerson = scene.selectedPersonId
    ? scene.generations.flat().find((person) => person.id === scene.selectedPersonId) ?? null
    : null;

  function startPersonGesture(event: PointerEvent<HTMLButtonElement>, person: FamilyTreePerson): void {
    if (event.button !== 0 || !event.isPrimary || personGestureRef.current) return;

    event.preventDefault();
    setPointerCaptureIfAvailable(event.currentTarget, event.pointerId);
    personGestureRef.current = {
      id: person.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startX: person.x,
      moved: false,
    };
  }

  function movePersonGesture(event: PointerEvent<HTMLButtonElement>): void {
    const gesture = personGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startClientX;
    if (!Number.isFinite(deltaX)) {
      throw new Error(`Family tree person pointer delta must be finite, received ${String(deltaX)}.`);
    }
    if (Math.abs(deltaX) > 2) gesture.moved = true;
    onPersonMove(gesture.id, clampPersonPosition(gesture.startX + deltaX));
  }

  function endPersonGesture(event: PointerEvent<HTMLButtonElement>): void {
    const gesture = personGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    releasePointerCaptureIfAvailable(event.currentTarget, event.pointerId);
    suppressPersonClickRef.current = gesture.moved;
    personGestureRef.current = null;
  }

  function handlePersonClick(personId: string): void {
    if (suppressPersonClickRef.current) {
      suppressPersonClickRef.current = false;
      return;
    }

    onPersonSelect(scene.selectedPersonId === personId ? null : personId);
  }

  function handlePersonKeyDown(event: KeyboardEvent<HTMLButtonElement>, person: FamilyTreePerson): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    onPersonMove(person.id, clampPersonPosition(person.x + direction * 16));
  }

  function startConnectionGesture(
    event: PointerEvent<HTMLElement>,
    connection: FamilyTreeConnection,
    mode: ConnectionPointerGesture['mode'],
  ): void {
    if (event.button !== 0 || !event.isPrimary || connectionGestureRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    setPointerCaptureIfAvailable(event.currentTarget, event.pointerId);
    connectionGestureRef.current = {
      id: connection.id,
      pointerId: event.pointerId,
      mode,
      startClientX: event.clientX,
      startX: connection.x,
      startWidth: connection.width,
      moved: false,
    };
  }

  function moveConnectionGesture(event: PointerEvent<HTMLElement>): void {
    const gesture = connectionGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startClientX;
    if (!Number.isFinite(deltaX)) {
      throw new Error(`Family tree connection pointer delta must be finite, received ${String(deltaX)}.`);
    }
    if (Math.abs(deltaX) > 2) gesture.moved = true;

    if (gesture.mode === 'move') {
      onConnectionMove(gesture.id, clampConnectionPosition(gesture.startX + deltaX));
      return;
    }

    if (gesture.mode === 'start') {
      const nextX = clampConnectionPosition(gesture.startX + deltaX);
      const nextWidth = gesture.startWidth - (nextX - gesture.startX);
      if (nextWidth >= FAMILY_TREE_CONNECTION_MIN_WIDTH) onConnectionResize(gesture.id, nextX, nextWidth);
      return;
    }

    const nextWidth = gesture.startWidth + deltaX;
    if (nextWidth >= FAMILY_TREE_CONNECTION_MIN_WIDTH) onConnectionResize(gesture.id, gesture.startX, nextWidth);
  }

  function endConnectionGesture(event: PointerEvent<HTMLElement>): void {
    const gesture = connectionGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    releasePointerCaptureIfAvailable(event.currentTarget, event.pointerId);
    suppressConnectionClickRef.current = gesture.moved;
    connectionGestureRef.current = null;
  }

  function handleConnectionClick(connectionId: string): void {
    if (suppressConnectionClickRef.current) {
      suppressConnectionClickRef.current = false;
      return;
    }

    onConnectionSelect(selectedConnectionId === connectionId ? null : connectionId);
  }

  function handleEndpointChange(direction: FamilyTreeEndpointDirection): void {
    if (!selectedPerson) return;
    onEndpointChange(selectedPerson.id, direction, nextEndpointStyle(selectedPerson.endpoints[direction]));
  }

  return (
    <section className={styles.canvasShell} aria-label={copy.familyCanvas}>
      <header className={styles.canvasHeader}>
        <div className={styles.canvasHeaderTitle}>
          <h2 className={styles.canvasTitle}>{copy.familyCanvas}</h2>
          <p className={styles.canvasHint}>{copy.canvasHint}</p>
        </div>
        <div className={styles.canvasHeaderActions}>
          {headerActions}
          <button className={styles.secondaryButton} type="button" onClick={onOpenConnections}>
            {copy.editConnections}
          </button>
        </div>
      </header>

      {selectedPerson ? (
        <div className={styles.contextBar} aria-label={copy.selectedPerson}>
          <span className={styles.contextName}>{selectedPerson.name || copy.unnamedPerson}</span>
          <div className={styles.endpointControls}>
            {ENDPOINT_DIRECTIONS.map((direction) => {
              const endpointStyle = selectedPerson.endpoints[direction];
              return (
                <button
                  className={`${styles.endpointButton} ${styles[`endpoint-${endpointStyle}`]}`}
                  key={direction}
                  type="button"
                  aria-label={`${copy.directions[direction]}: ${copy.endpointStyles[endpointStyle]}`}
                  aria-pressed={endpointStyle !== 'none'}
                  onClick={() => handleEndpointChange(direction)}
                >
                  {copy.directions[direction]}: {copy.endpointStyles[endpointStyle]}
                </button>
              );
            })}
          </div>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={() => onPersonDelete(selectedPerson.id)}
          >
            {copy.deletePerson}
          </button>
        </div>
      ) : null}

      <div className={styles.canvasViewport}>
        <div
          className={styles.scene}
          style={{
            width: `${sceneSize.width}px`,
            height: `${sceneSize.height}px`,
            '--family-tree-connection-color': FAMILY_TREE_CONNECTION_COLOR,
            '--family-tree-connection-stroke-width': `${FAMILY_TREE_CONNECTION_STROKE_WIDTH}px`,
          } as CSSProperties}
          role="group"
          aria-label={copy.familyCanvas}
        >
          {scene.generations.map((people, generation) => (
            <div
              className={styles.generationLabel}
              key={`generation-label-${generation}`}
              style={{
                top: `${FAMILY_TREE_SCENE_TOP_PADDING + generation * FAMILY_TREE_GENERATION_ROW_HEIGHT + 46}px`,
              }}
            >
              {getGenerationLabel(copy, generation as FamilyTreePerson['generation'])}
            </div>
          ))}

          {[0, 1, 2].map((gap) => (
            <div
              className={styles.gapRail}
              key={`gap-rail-${gap}`}
              style={{
                left: `${FAMILY_TREE_CONTENT_LEFT}px`,
                top: `${familyTreeConnectionY(gap as FamilyTreeConnectionGap)}px`,
                width: `${sceneSize.width - FAMILY_TREE_CONTENT_LEFT - 24}px`,
              }}
            />
          ))}

          {scene.connections.map((connection) => (
            <div
              className={`${styles.connection} ${selectedConnectionId === connection.id ? styles.connectionSelected : ''}`}
              key={connection.id}
              role="button"
              tabIndex={0}
              aria-pressed={selectedConnectionId === connection.id}
              aria-label={getConnectionGapLabel(copy, connection.gap)}
              style={getConnectionStyle(connection)}
              onClick={() => handleConnectionClick(connection.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleConnectionClick(connection.id);
                  return;
                }
                if (
                  selectedConnectionId === connection.id &&
                  (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
                ) {
                  event.preventDefault();
                  moveConnectionWithKeyboard(connection, event.key, onConnectionMove);
                }
              }}
              onPointerDown={(event) => startConnectionGesture(event, connection, 'move')}
              onPointerMove={moveConnectionGesture}
              onPointerUp={endConnectionGesture}
              onPointerCancel={endConnectionGesture}
            >
              {selectedConnectionId === connection.id && scene.resizeEnabled ? (
                <>
                  <span
                    className={styles.connectionHandle}
                    role="button"
                    tabIndex={0}
                    aria-label={`${getConnectionGapLabel(copy, connection.gap)} ${copy.directions.left}`}
                    style={{ width: `${FAMILY_TREE_CONNECTION_HANDLE_SIZE}px`, height: `${FAMILY_TREE_CONNECTION_HANDLE_SIZE}px` }}
                    onPointerDown={(event) => startConnectionGesture(event, connection, 'start')}
                    onPointerMove={moveConnectionGesture}
                    onPointerUp={endConnectionGesture}
                    onPointerCancel={endConnectionGesture}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                      event.preventDefault();
                      event.stopPropagation();
                      resizeConnectionWithKeyboard(connection, 'start', event.key, onConnectionResize);
                    }}
                  />
                  <span
                    className={`${styles.connectionHandle} ${styles.connectionHandleEnd}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${getConnectionGapLabel(copy, connection.gap)} ${copy.directions.right}`}
                    style={{ width: `${FAMILY_TREE_CONNECTION_HANDLE_SIZE}px`, height: `${FAMILY_TREE_CONNECTION_HANDLE_SIZE}px` }}
                    onPointerDown={(event) => startConnectionGesture(event, connection, 'end')}
                    onPointerMove={moveConnectionGesture}
                    onPointerUp={endConnectionGesture}
                    onPointerCancel={endConnectionGesture}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                      event.preventDefault();
                      event.stopPropagation();
                      resizeConnectionWithKeyboard(connection, 'end', event.key, onConnectionResize);
                    }}
                  />
                </>
              ) : null}
            </div>
          ))}

          {scene.generations.flatMap((people) => people).map((person) => {
            const personBox = familyTreePersonBox(person);
            const avatarBox = familyTreeAvatarBox(person);
            const selected = scene.selectedPersonId === person.id;
            return (
              <div key={person.id}>
                {ENDPOINT_DIRECTIONS.map((direction) => {
                  const endpointStyle = person.endpoints[direction];
                  if (endpointStyle === 'none') return null;
                  return (
                    <span
                      aria-hidden="true"
                      className={`${styles.endpointLine} ${styles[`endpoint-${endpointStyle}`]} ${direction === 'top' || direction === 'bottom' ? styles.endpointVertical : styles.endpointHorizontal}`}
                      data-endpoint-direction={direction}
                      data-endpoint-style={endpointStyle}
                      key={`${person.id}-${direction}`}
                      style={getEndpointSegmentStyle(person, direction, endpointStyle)}
                    />
                  );
                })}
                <button
                  className={`${styles.personCard} ${selected ? styles.personCardSelected : ''}`}
                  type="button"
                  aria-pressed={selected}
                  aria-label={person.name || copy.unnamedPerson}
                  style={{ left: `${personBox.x}px`, top: `${personBox.y}px` }}
                  onClick={() => handlePersonClick(person.id)}
                  onKeyDown={(event) => handlePersonKeyDown(event, person)}
                  onPointerDown={(event) => startPersonGesture(event, person)}
                  onPointerMove={movePersonGesture}
                  onPointerUp={endPersonGesture}
                  onPointerCancel={endPersonGesture}
                >
                  <span
                    className={styles.avatarFrame}
                    style={{
                      left: `${avatarBox.x - personBox.x}px`,
                      top: `${avatarBox.y - personBox.y}px`,
                    }}
                  >
                    <FamilyAvatar avatar={person.avatar} label={person.name || copy.unnamedPerson} />
                  </span>
                  <span className={styles.personName}>{person.name || copy.unnamedPerson}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
