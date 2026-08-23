'use client';

import { useState, type ReactNode } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Copy, Eye, EyeOff, Italic, Lock, LockOpen, Minus, Plus, Trash2, Underline } from 'lucide-react';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLayerPatch } from '@/lib/coat-of-arms/commands';
import { assertTextFontAvailable, listTextFontOptions } from '@/lib/coat-of-arms/text-font-registry';
import type { CoatLocale, TextAlignment, TextFontFamily, TextLayer, TextPathFacing, TextPathLayout, TextPathPlacement, TextPathSpacing } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { getCoatWorkbenchCopy } from './workbench-copy';

type EditableRingTextPath = {
  mode: 'ring';
  radius: number;
  facing: TextPathFacing;
  layout: TextPathLayout;
  spacing: TextPathSpacing;
};

type RingToolbarCopy = ReturnType<typeof getCoatWorkbenchCopy>['panels']['textFeature']['toolbar'];

function getSelectedTextLayer(project: ReturnType<typeof useCoatProjectStore.getState>['project'], selectedLayerIds: string[]): TextLayer | null {
  if (selectedLayerIds.length !== 1) return null;
  const selectedLayer = project.layers.find((layer) => layer.id === selectedLayerIds[0]);
  return selectedLayer?.type === 'text' ? selectedLayer : null;
}

function requireFontSize(value: unknown): number {
  const fontSize = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(fontSize) || fontSize < 8 || fontSize > 200) {
    throw new Error(`Invalid text font size (expected 8-200): ${String(value)}`);
  }
  return fontSize;
}

function requireTextStrokeWidth(value: unknown): number {
  const strokeWidth = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(strokeWidth) || strokeWidth < 0) {
    throw new Error(`Invalid text stroke width: ${String(value)}`);
  }
  if (!Number.isInteger(strokeWidth * 2)) throw new Error(`Invalid text stroke width step: ${String(value)}`);
  return strokeWidth;
}

function requireTextAlignment(value: string): TextAlignment {
  if (value !== 'left' && value !== 'center' && value !== 'right') throw new Error(`Invalid text alignment: ${value}`);
  return value;
}

function requireEditableRingPath(path: TextPathPlacement): EditableRingTextPath {
  if (path.mode !== 'ring') throw new Error(`Invalid ring toolbar path mode: ${path.mode}`);
  if (!('facing' in path) || !('layout' in path) || !('spacing' in path) || typeof path.radius !== 'number') {
    throw new Error(`Invalid ring text path: ${JSON.stringify(path)}`);
  }
  if (path.facing !== 'in' && path.facing !== 'out') throw new Error(`Invalid text path facing: ${String(path.facing)}`);
  if (path.layout !== 'full' && path.layout !== 'arc') throw new Error(`Invalid text path layout: ${String(path.layout)}`);
  if (path.spacing !== 'natural' && path.spacing !== 'even') throw new Error(`Invalid text path spacing: ${String(path.spacing)}`);
  return { mode: 'ring', radius: path.radius, facing: path.facing, layout: path.layout, spacing: path.spacing };
}

/** Contextual live controls for one selected text layer. */
export function TextSelectionToolbar({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale);
  const textCopy = copy.panels.textFeature;
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const { error, reportError, run } = usePanelCommandError(locale);
  const selectedTextLayer = getSelectedTextLayer(project, selectedLayerIds);
  const [stylesOpen, setStylesOpen] = useState(false);

  if (!selectedTextLayer) return null;

  const strokeColor = selectedTextLayer.strokeColor ?? '#000000';
  const strokeWidth = selectedTextLayer.strokeWidth ?? 0;
  const canEdit = !selectedTextLayer.locked;
  const ringPath = selectedTextLayer.path.mode === 'ring' ? requireEditableRingPath(selectedTextLayer.path) : null;

  const updateSelectedText = (patch: CoatLayerPatch): boolean => {
    if (!canEdit) return false;
    return run({ type: 'update-layer', layerId: selectedTextLayer.id, patch });
  };
  const updateFont = (fontId: TextFontFamily) => {
    try {
      assertTextFontAvailable(fontId);
      updateSelectedText({ fontFamily: fontId });
    } catch (caught) {
      reportError(caught);
    }
  };
  const updateFontSize = (value: unknown) => {
    try { updateSelectedText({ fontSize: requireFontSize(value) }); } catch (caught) { reportError(caught); }
  };
  const updateStrokeWidth = (value: unknown) => {
    try { updateSelectedText({ strokeWidth: requireTextStrokeWidth(value) }); } catch (caught) { reportError(caught); }
  };
  const updateAlignment = (value: string) => {
    try { updateSelectedText({ alignment: requireTextAlignment(value) }); } catch (caught) { reportError(caught); }
  };
  const updateRingPath = (path: EditableRingTextPath) => {
    try {
      updateSelectedText({ path: requireEditableRingPath(path) });
    } catch (caught) {
      reportError(caught);
    }
  };
  const toggleLock = () => {
    run({ type: 'set-layer-lock', layerId: selectedTextLayer.id, locked: !selectedTextLayer.locked });
  };
  const toggleVisibility = () => {
    run({ type: 'set-layer-visibility', layerId: selectedTextLayer.id, visible: !selectedTextLayer.visible });
  };
  const duplicateSelectedText = () => {
    const newLayerId = createLocalCoatId();
    if (run({ type: 'duplicate-layers', sourceLayerIds: [selectedTextLayer.id], newLayerIds: [newLayerId] })) {
      setSelectedLayerIds([newLayerId]);
    }
  };
  const deleteSelectedText = () => {
    if (run({ type: 'remove-layers', layerIds: [selectedTextLayer.id] })) setSelectedLayerIds([]);
  };

  return (
    <div aria-label={copy.canvas.selectedLayerToolbar} className="relative flex min-w-0 flex-1 items-center gap-1 overflow-visible text-[color:var(--coat-text)]" data-text-selection-toolbar="true" role="toolbar">
      <select aria-label={textCopy.toolbar.font} className="inline-flex min-h-9 min-w-[8.8rem] max-w-[11rem] rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-2 py-1.5 text-left text-xs" disabled={!canEdit} value={selectedTextLayer.fontFamily ?? 'cardinal'} onChange={(event) => updateFont(event.target.value as TextFontFamily)}>
        {listTextFontOptions().map((option) => <option key={option.id} value={option.id}>{option.label[locale]}</option>)}
      </select>
      <div className="inline-flex items-center rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)]">
        <button aria-label={textCopy.toolbar.decreaseFontSize} className="inline-flex h-9 w-8 items-center justify-center" disabled={!canEdit || selectedTextLayer.fontSize <= 8} type="button" onClick={() => updateFontSize(selectedTextLayer.fontSize - 1)}><Minus aria-hidden="true" className="h-4 w-4" /></button>
        <input aria-label={textCopy.toolbar.fontSize} className="h-9 w-12 border-x border-[color:var(--coat-line)] bg-transparent text-center text-sm" disabled={!canEdit} max="200" min="8" step="1" type="number" value={selectedTextLayer.fontSize} onChange={(event) => updateFontSize(event.target.value)} />
        <button aria-label={textCopy.toolbar.increaseFontSize} className="inline-flex h-9 w-8 items-center justify-center" disabled={!canEdit || selectedTextLayer.fontSize >= 200} type="button" onClick={() => updateFontSize(selectedTextLayer.fontSize + 1)}><Plus aria-hidden="true" className="h-4 w-4" /></button>
      </div>
      <label aria-label={textCopy.toolbar.textColour} className="relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)]" style={{ backgroundColor: selectedTextLayer.color }}>
        <span className="sr-only">{textCopy.toolbar.textColour}</span>
        <input aria-label={`${textCopy.toolbar.textColour} picker`} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" disabled={!canEdit} type="color" value={selectedTextLayer.color.toLowerCase()} onChange={(event) => { updateSelectedText({ color: event.target.value }); }} />
      </label>
      {ringPath ? (
        <RingPathControls copy={textCopy.toolbar} disabled={!canEdit} path={ringPath} onPathChange={updateRingPath} />
      ) : (
        <>
          <ToolbarToggle label={textCopy.toolbar.bold} pressed={selectedTextLayer.fontWeight === 'bold'} disabled={!canEdit} onClick={() => updateSelectedText({ fontWeight: selectedTextLayer.fontWeight === 'bold' ? 'normal' : 'bold' })}><Bold aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
          <ToolbarToggle label={textCopy.toolbar.italic} pressed={selectedTextLayer.fontStyle === 'italic'} disabled={!canEdit} onClick={() => updateSelectedText({ fontStyle: selectedTextLayer.fontStyle === 'italic' ? 'normal' : 'italic' })}><Italic aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
          <ToolbarToggle label={textCopy.toolbar.underline} pressed={selectedTextLayer.underline === true} disabled={!canEdit} onClick={() => updateSelectedText({ underline: selectedTextLayer.underline !== true })}><Underline aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
          <div aria-label={textCopy.toolbar.alignment} className="inline-flex items-center gap-0.5" role="group">
            <ToolbarToggle label={textCopy.toolbar.left} pressed={selectedTextLayer.alignment === 'left'} disabled={!canEdit} onClick={() => updateAlignment('left')}><AlignLeft aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
            <ToolbarToggle label={textCopy.toolbar.center} pressed={selectedTextLayer.alignment === 'center'} disabled={!canEdit} onClick={() => updateAlignment('center')}><AlignCenter aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
            <ToolbarToggle label={textCopy.toolbar.right} pressed={selectedTextLayer.alignment === 'right'} disabled={!canEdit} onClick={() => updateAlignment('right')}><AlignRight aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
          </div>
        </>
      )}
      <div className="relative shrink-0">
        <ToolbarToggle label={textCopy.toolbar.styles} pressed={stylesOpen} disabled={!canEdit} onClick={() => setStylesOpen((open) => !open)}><span aria-hidden="true" className="text-base">T</span></ToolbarToggle>
        {stylesOpen ? <div aria-label={textCopy.toolbar.styles} className="absolute right-0 top-full z-50 mt-1 grid w-64 gap-2 rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel)] p-3 shadow-xl" role="dialog">
          <label className="grid gap-1 text-xs text-[color:var(--coat-muted)]"><span>{textCopy.toolbar.strokeColour}</span><input aria-label={textCopy.toolbar.strokeColour} className="h-9 w-full cursor-pointer rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-1" disabled={!canEdit} type="color" value={strokeColor.toLowerCase()} onChange={(event) => updateSelectedText({ strokeColor: event.target.value })} /></label>
          <label className="grid gap-1 text-xs text-[color:var(--coat-muted)]"><span>{textCopy.toolbar.strokeWidth}</span><input aria-label={textCopy.toolbar.strokeWidth} className="min-h-9 rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-stage)] px-2 text-sm text-[color:var(--coat-text)]" disabled={!canEdit} min="0" step="0.5" type="number" value={strokeWidth} onChange={(event) => updateStrokeWidth(event.target.value)} /></label>
        </div> : null}
      </div>
      <div className="ml-auto inline-flex items-center gap-0.5">
        <ToolbarToggle label={selectedTextLayer.locked ? textCopy.toolbar.unlock : textCopy.toolbar.lock} pressed={selectedTextLayer.locked} disabled={false} onClick={toggleLock}>{selectedTextLayer.locked ? <LockOpen aria-hidden="true" className="h-4 w-4" /> : <Lock aria-hidden="true" className="h-4 w-4" />}</ToolbarToggle>
        <ToolbarToggle label={selectedTextLayer.visible ? textCopy.toolbar.hide : textCopy.toolbar.show} pressed={!selectedTextLayer.visible} disabled={false} onClick={toggleVisibility}>{selectedTextLayer.visible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}</ToolbarToggle>
        <ToolbarToggle label={textCopy.toolbar.duplicate} disabled={!canEdit} onClick={duplicateSelectedText}><Copy aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
        <ToolbarToggle label={textCopy.toolbar.delete} disabled={false} onClick={deleteSelectedText}><Trash2 aria-hidden="true" className="h-4 w-4" /></ToolbarToggle>
      </div>
      {error ? <p aria-live="polite" className="absolute right-0 top-full z-50 mt-1 rounded bg-[color:var(--coat-panel)] px-2 py-1 text-xs text-[color:var(--coat-danger)]" role="alert">{error}</p> : null}
    </div>
  );
}

function RingPathControls({
  copy,
  disabled,
  onPathChange,
  path,
}: {
  copy: RingToolbarCopy;
  disabled: boolean;
  onPathChange: (path: EditableRingTextPath) => void;
  path: EditableRingTextPath;
}) {
  const replaceRingPath = (patch: Partial<Pick<EditableRingTextPath, 'facing' | 'layout' | 'spacing'>>): EditableRingTextPath => ({
    mode: 'ring',
    radius: path.radius,
    facing: patch.facing ?? path.facing,
    layout: patch.layout ?? path.layout,
    spacing: patch.spacing ?? path.spacing,
  });
  return (
    <div className="inline-flex items-center gap-0.5" role="group">
      <ToolbarToggle label={copy.in.ariaLabel} pressed={path.facing === 'in'} disabled={disabled} className="min-w-9 px-1.5 text-xs font-semibold" onClick={() => onPathChange(replaceRingPath({ facing: 'in' }))}>{copy.in.label}</ToolbarToggle>
      <ToolbarToggle label={copy.out.ariaLabel} pressed={path.facing === 'out'} disabled={disabled} className="min-w-9 px-1.5 text-xs font-semibold" onClick={() => onPathChange(replaceRingPath({ facing: 'out' }))}>{copy.out.label}</ToolbarToggle>
      <ToolbarToggle label={copy.arc.ariaLabel} pressed={path.layout === 'arc'} disabled={disabled} className="min-w-9 px-1.5 text-xs font-semibold" onClick={() => onPathChange(replaceRingPath({ layout: path.layout === 'arc' ? 'full' : 'arc' }))}>{copy.arc.label}</ToolbarToggle>
      <ToolbarToggle label={copy.even.ariaLabel} pressed={path.spacing === 'even'} disabled={disabled} className="min-w-9 px-1.5 text-xs font-semibold" onClick={() => onPathChange(replaceRingPath({ spacing: path.spacing === 'even' ? 'natural' : 'even' }))}>{copy.even.label}</ToolbarToggle>
    </div>
  );
}

function ToolbarToggle({ children, className, disabled, label, onClick, pressed }: { children: ReactNode; className?: string; disabled: boolean; label: string; onClick: () => void; pressed?: boolean }) {
  return <button aria-label={label} aria-pressed={pressed} className={`inline-flex h-9 shrink-0 items-center justify-center rounded border border-transparent text-[color:var(--coat-text)] hover:border-[color:var(--coat-line)] hover:bg-[color:var(--coat-active)] disabled:cursor-not-allowed disabled:opacity-40 ${className ?? 'w-9'}`} disabled={disabled} type="button" onClick={onClick}>{children}</button>;
}
