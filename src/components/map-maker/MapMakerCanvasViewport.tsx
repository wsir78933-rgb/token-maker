'use client';

import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

import {
  MAP_MAKER_MAX_COLUMNS,
  MAP_MAKER_MAX_ROWS,
  MAP_MAKER_MIN_COLUMNS,
  MAP_MAKER_MIN_ROWS,
  MAP_MAKER_TILE_SIZE,
} from '@/lib/map-maker';

import styles from './MapMakerWorkbench.module.css';

type MapMakerCanvasViewportProps = {
  columns: number;
  rows: number;
  viewportRef: RefObject<HTMLDivElement | null>;
  feedback?: ReactNode;
  children: ReactNode;
};

function requireMapMakerDimension(
  value: number,
  dimensionName: 'columns' | 'rows',
  minimum: number,
  maximum: number,
): number {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`Map Maker canvas ${dimensionName} must be an integer from ${minimum} to ${maximum}. Received ${String(value)}.`);
  }
  return value;
}

function getDisplayScale(viewportWidth: number, mapWidth: number): number {
  if (!Number.isFinite(viewportWidth) || viewportWidth < 0) {
    throw new RangeError(`Map Maker canvas viewport clientWidth must be a non-negative finite number. Received ${String(viewportWidth)}.`);
  }
  if (!Number.isFinite(mapWidth) || mapWidth <= 0) {
    throw new RangeError(`Map Maker canvas width must be a positive finite number. Received ${String(mapWidth)}.`);
  }
  if (viewportWidth === 0) return 1;
  return Math.max(1, viewportWidth / mapWidth);
}

export function MapMakerCanvasViewport({
  columns,
  rows,
  viewportRef,
  feedback,
  children,
}: MapMakerCanvasViewportProps) {
  const mapWidth = requireMapMakerDimension(columns, 'columns', MAP_MAKER_MIN_COLUMNS, MAP_MAKER_MAX_COLUMNS) * MAP_MAKER_TILE_SIZE;
  const mapHeight = requireMapMakerDimension(rows, 'rows', MAP_MAKER_MIN_ROWS, MAP_MAKER_MAX_ROWS) * MAP_MAKER_TILE_SIZE;
  const [displayScale, setDisplayScale] = useState(1);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (viewportElement === null) {
      throw new Error('Map Maker canvas viewport must be mounted before display scaling. Received null.');
    }
    const ResizeObserverConstructor = globalThis.ResizeObserver;
    if (typeof ResizeObserverConstructor !== 'function') {
      throw new Error(`Map Maker canvas display scaling requires ResizeObserver. Received ${String(ResizeObserverConstructor)}.`);
    }

    const updateDisplayScale = (): void => {
      const nextScale = getDisplayScale(viewportElement.clientWidth, mapWidth);
      setDisplayScale((currentScale) => currentScale === nextScale ? currentScale : nextScale);
    };

    updateDisplayScale();
    const viewportResizeObserver = new ResizeObserverConstructor(updateDisplayScale);
    viewportResizeObserver.observe(viewportElement);
    return () => viewportResizeObserver.disconnect();
  }, [mapWidth, viewportRef]);

  const displayFrameStyle: CSSProperties = {
    width: `${mapWidth * displayScale}px`,
    height: `${mapHeight * displayScale}px`,
  };
  const scaledContentStyle: CSSProperties = {
    width: `${mapWidth}px`,
    height: `${mapHeight}px`,
    transform: `scale(${displayScale})`,
  };

  return (
    <div className={styles.canvasPreviewFrame} data-testid="map-maker-preview-frame">
      {feedback !== undefined && feedback !== null ? (
        <div className={styles.canvasFeedback}>{feedback}</div>
      ) : null}
      <div ref={viewportRef} className={styles.canvasViewport} data-testid="map-maker-canvas-viewport">
        <div
          className={styles.canvasDisplayFrame}
          data-testid="map-maker-display-frame"
          data-map-maker-display-scale={displayScale}
          data-map-maker-frame-width={mapWidth * displayScale}
          data-map-maker-frame-height={mapHeight * displayScale}
          style={displayFrameStyle}
        >
          <div className={styles.canvasScaledContent} style={scaledContentStyle}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
