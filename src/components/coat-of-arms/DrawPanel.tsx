'use client';

import { useEffect } from 'react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale } from '@/lib/coat-of-arms/types';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Enables one local freehand vector stroke mode for the shared workbench canvas. */
export function DrawPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const drawingSettings = useCoatProjectStore((state) => state.drawingSettings);
  const setDrawingSettings = useCoatProjectStore((state) => state.setDrawingSettings);

  useEffect(() => () => {
    const latestState = useCoatProjectStore.getState();
    if (latestState.drawingSettings.isActive) {
      latestState.setDrawingSettings({ ...latestState.drawingSettings, isActive: false });
    }
  }, []);

  const setDrawingMode = (isActive: boolean) => {
    setDrawingSettings({ ...drawingSettings, isActive });
  };

  const toggleDrawingMode = () => {
    setDrawingMode(!drawingSettings.isActive);
  };

  const updateStrokeWidth = (value: string) => {
    setDrawingSettings({ ...drawingSettings, strokeWidth: Number(value) });
  };

  const updateDrawingColour = (value: string) => {
    setDrawingSettings({ ...drawingSettings, color: value });
  };

  const updateDrawingOpacity = (value: string) => {
    setDrawingSettings({ ...drawingSettings, opacity: Number(value) });
  };

  return (
    <section aria-label={copy.draw} className="coat-target-utility-form coat-target-draw-form">
      <h2 style={{ marginBottom: 0 }}>{copy.draw}</h2>
      <p>{copy.drawHelp}</p>
      <button
        aria-pressed={drawingSettings.isActive}
        className="coat-target-action-button coat-target-action-button--primary"
        type="button"
        onClick={toggleDrawingMode}
      >{copy.enableDrawingMode}</button>
      <input
        aria-label={copy.drawOnCanvas}
        checked={drawingSettings.isActive}
        className="sr-only"
        type="checkbox"
        onChange={(event) => setDrawingMode(event.target.checked)}
      />
      <label className="coat-target-form-field">
        <span>{copy.drawingStrokeWidth} <span>{drawingSettings.strokeWidth}px</span></span>
        <input aria-label={copy.drawingStrokeWidth} type="range" min="1" max="100" step="1" value={drawingSettings.strokeWidth} onChange={(event) => updateStrokeWidth(event.target.value)} />
      </label>
      <label className="coat-target-form-field">
        <span>{copy.drawingColour}</span>
        <input aria-label={copy.drawingColour} type="color" value={drawingSettings.color} onChange={(event) => updateDrawingColour(event.target.value)} />
      </label>
      <label className="coat-target-form-field">
        <span>{copy.drawingOpacity} <span>{formatOpacityPercent(drawingSettings.opacity)}</span></span>
        <input aria-label={copy.drawingOpacity} type="range" min="0" max="1" step="0.01" value={drawingSettings.opacity} onChange={(event) => updateDrawingOpacity(event.target.value)} />
      </label>
      <span className="coat-target-draw-preview-label">{copy.previewStroke}</span>
      <div aria-label={copy.previewStroke} className="coat-target-draw-preview" role="img">
        <svg aria-hidden="true" viewBox="0 0 200 40">
          <line
            x1="12"
            x2="188"
            y1="20"
            y2="20"
            stroke={drawingSettings.color}
            strokeLinecap="round"
            strokeWidth={Math.min(drawingSettings.strokeWidth, 32)}
            opacity={drawingSettings.opacity}
          />
        </svg>
      </div>
    </section>
  );
}

function formatOpacityPercent(opacity: number): string {
  return `${Math.round(opacity * 100)}%`;
}
