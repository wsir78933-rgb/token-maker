'use client';

import { getEditableLayerColours } from '@/lib/coat-of-arms/layer-colours';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLayer, CoatLocale } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

/** Exposes the editable rendered colours for exactly one unlocked selected layer. */
export function SelectedElementColourStrip({ locale }: { locale: CoatLocale }) {
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const selectedLayer = selectedLayerIds.length === 1
    ? project.layers.find((layer) => layer.id === selectedLayerIds[0])
    : undefined;

  if (!selectedLayer || selectedLayer.locked) return null;

  const editableColours = getEditableLayerColours(selectedLayer);
  if (editableColours.length === 0) return null;

  return <SelectedElementColourStripControls editableColours={editableColours} key={selectedLayer.id} locale={locale} selectedLayer={selectedLayer} />;
}

interface SelectedElementColourStripControlsProps {
  editableColours: string[];
  locale: CoatLocale;
  selectedLayer: CoatLayer;
}

function SelectedElementColourStripControls({
  editableColours,
  locale,
  selectedLayer,
}: SelectedElementColourStripControlsProps) {
  const { error, run } = usePanelCommandError(locale);
  const copy = getCoatWorkbenchCopy(locale).shell;

  return (
    <div aria-label={copy.selectedElementColours} className="coat-target-selected-element-colour-strip" role="group">
      {editableColours.map((fromColor, colourIndex) => (
        <input
          aria-label={copy.changeElementColour(fromColor)}
          key={`${selectedLayer.id}-colour-${colourIndex}`}
          onChange={(event) => {
            const toColor = event.currentTarget.value;
            if (fromColor.toUpperCase() === toColor.toUpperCase()) return;
            run({ type: 'replace-layer-colour', layerId: selectedLayer.id, fromColor, toColor });
          }}
          type="color"
          value={fromColor}
        />
      ))}
      {error ? <p className="coat-target-selected-element-colour-error" role="alert">{error}</p> : null}
    </div>
  );
}
