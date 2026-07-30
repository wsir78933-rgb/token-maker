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

  return (
    <section aria-label={copy.draw} className="space-y-2">
      <h2>{copy.draw}</h2>
      <p>{copy.drawHelp}</p>
      <label>
        {copy.drawingColour}
        <input aria-label={copy.drawingColour} type="color" value={drawingSettings.color} onChange={(event) => setDrawingSettings({ ...drawingSettings, color: event.target.value })} />
      </label>
      <label>
        {copy.drawingStrokeWidth}
        <input aria-label={copy.drawingStrokeWidth} type="range" min="0.5" max="20" step="0.5" value={drawingSettings.strokeWidth} onChange={(event) => setDrawingSettings({ ...drawingSettings, strokeWidth: Number(event.target.value) })} />
      </label>
      <label>
        <input aria-label={copy.drawOnCanvas} checked={drawingSettings.isActive} type="checkbox" onChange={(event) => setDrawingSettings({ ...drawingSettings, isActive: event.target.checked })} />
        {copy.drawOnCanvas}
      </label>
    </section>
  );
}
