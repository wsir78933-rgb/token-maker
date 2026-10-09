'use client';

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import { MapMakerAssetPalette } from './MapMakerAssetPalette';
import { MapMakerCanvas } from './MapMakerCanvas';
import { MapMakerExportDialog } from './MapMakerExportDialog';
import { MapMakerHelpDialog } from './MapMakerHelpDialog';
import { MapMakerLayerPanel, type MapMakerEditTarget } from './MapMakerLayerPanel';
import { MapMakerPropertiesPanel } from './MapMakerPropertiesPanel';
import { MapMakerSaveDialog } from './MapMakerSaveDialog';
import { MapMakerSizeDialog } from './MapMakerSizeDialog';
import { MapMakerToolbar } from './MapMakerToolbar';
import { useMapMakerWorkbench } from './useMapMakerWorkbench';
import styles from './MapMakerWorkbench.module.css';

type MobilePane = 'materials' | 'layers' | 'properties' | 'more' | null;
type ResizeSide = 'left' | 'right';
type PanelResizeGesture = { side: ResizeSide; pointerId: number; startX: number; startWidth: number };

const PANEL_WIDTH_MIN = 220;
const PANEL_WIDTH_MAX = 420;

function clampPanelWidth(width: number): number {
  if (!Number.isFinite(width)) {
    throw new Error(`Map Maker panel width must be finite. Received ${String(width)}.`);
  }
  return Math.max(PANEL_WIDTH_MIN, Math.min(PANEL_WIDTH_MAX, width));
}

function getSelectedLabelText(project: ReturnType<typeof useMapMakerWorkbench>['project'], selectedLabelIds: readonly string[]): string {
  if (selectedLabelIds.length !== 1) return '';
  const label = project.labels.find((candidate) => candidate.id === selectedLabelIds[0]);
  if (label === undefined) {
    throw new Error(`Map Maker selected label was not found. Received ${JSON.stringify(selectedLabelIds[0])}.`);
  }
  return label.text;
}

export function MapMakerWorkbench({ copy }: { copy: MapMakerWorkspaceCopy }) {
  const state = useMapMakerWorkbench(copy);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>(null);
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const panelResizeRef = useRef<PanelResizeGesture | null>(null);

  const selectedLabelText = getSelectedLabelText(state.project, state.selectedLabelIds);
  const canTransformBase = state.editTarget === 'base' && state.selectedCells.length > 0;
  const canTransformElements = (state.editTarget === 'layer-1' || state.editTarget === 'layer-2') && state.selectedElementIds.length > 0;
  const canTransformSelection = canTransformBase || canTransformElements;
  const canEditSingleLabel = state.editTarget === 'labels' && state.selectedLabelIds.length === 1;

  function handleResizePointerDown(side: ResizeSide, event: PointerEvent<HTMLButtonElement>): void {
    if (event.button !== 0 || event.isPrimary === false) return;
    event.preventDefault();
    panelResizeRef.current = {
      side,
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: side === 'left' ? leftPanelWidth : rightPanelWidth,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizePointerMove(event: PointerEvent<HTMLButtonElement>): void {
    const gesture = panelResizeRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId) return;
    const pointerDelta = event.clientX - gesture.startX;
    const nextWidth = clampPanelWidth(gesture.startWidth + (gesture.side === 'left' ? pointerDelta : -pointerDelta));
    if (gesture.side === 'left') setLeftPanelWidth(nextWidth);
    else setRightPanelWidth(nextWidth);
  }

  function handleResizePointerUp(event: PointerEvent<HTMLButtonElement>): void {
    const gesture = panelResizeRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId) return;
    panelResizeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleResizeKeyDown(side: ResizeSide, event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const movement = direction * (event.shiftKey ? 20 : 8) * (side === 'left' ? 1 : -1);
    if (side === 'left') setLeftPanelWidth((width) => clampPanelWidth(width + movement));
    else setRightPanelWidth((width) => clampPanelWidth(width + movement));
  }

  function handleEditTargetChange(editTarget: MapMakerEditTarget): void {
    state.setEditTarget(editTarget);
    setEditingLabelId(null);
  }

  function handleEditLabel(id: string): void {
    handleEditTargetChange('labels');
    state.handleSelectLabels([id]);
    setEditingLabelId(id);
  }

  function handleUpdateLabelText(id: string, text: string): void {
    state.handleUpdateLabelText(id, text);
  }

  function handleCancelLabelEdit(id: string): void {
    if (editingLabelId === id) setEditingLabelId(null);
  }

  function handleToggleLabelEdit(): void {
    if (state.selectedLabelIds.length !== 1) return;
    const selectedLabelId = state.selectedLabelIds[0] ?? null;
    setEditingLabelId((currentEditingId) => currentEditingId === selectedLabelId ? null : selectedLabelId);
  }

  function handleAddLabelAndEdit(): void {
    const labelId = state.handleAddLabel();
    if (labelId !== null) setEditingLabelId(labelId);
  }

  function handleOpenMobilePane(pane: Exclude<MobilePane, null>): void {
    setMobilePane((currentPane) => currentPane === pane ? null : pane);
  }

  function renderPanelResizeHandle(side: ResizeSide): ReactNode {
    const width = side === 'left' ? leftPanelWidth : rightPanelWidth;
    const label = side === 'left' ? copy.materials.title : copy.layers.title;
    return (
      <button
        type="button"
        role="separator"
        aria-label={label}
        aria-orientation="vertical"
        aria-valuemin={PANEL_WIDTH_MIN}
        aria-valuemax={PANEL_WIDTH_MAX}
        aria-valuenow={width}
        className={`${styles.panelResizeHandle} ${side === 'left' ? styles.leftResizeHandle : styles.rightResizeHandle}`}
        onPointerDown={(event) => handleResizePointerDown(side, event)}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
        onKeyDown={(event) => handleResizeKeyDown(side, event)}
      />
    );
  }

  const assetPalette = (
    <MapMakerAssetPalette
      copy={copy}
      editTarget={state.editTarget}
      targetLayer={state.targetLayer}
      onEditTargetChange={handleEditTargetChange}
      onTargetLayerChange={state.setTargetLayer}
      onReplaceSelectedTiles={state.handleReplaceSelectedTiles}
      onPlaceElement={state.handlePlaceElement}
      onImageLoadError={state.handleImageLoadError}
    />
  );
  const layerPanel = (
    <MapMakerLayerPanel
      copy={copy}
      editTarget={state.editTarget}
      elementsVisible={state.project.settings.elementsVisible}
      labelsVisible={state.project.settings.labelsVisible}
      selectedBaseTileCount={state.selectedCells.length}
      selectedElementCount={state.selectedElementIds.length}
      selectedLabelCount={state.selectedLabelIds.length}
      onEditTargetChange={handleEditTargetChange}
      onElementsVisibilityChange={(visible) => state.handleChangeSettings({ elementsVisible: visible })}
      onLabelsVisibilityChange={(visible) => state.handleChangeSettings({ labelsVisible: visible })}
      onClearLayerOne={() => state.handleClearLayer(1)}
      onClearLayerTwo={() => state.handleClearLayer(2)}
    />
  );
  const propertiesPanel = (
    <MapMakerPropertiesPanel
      copy={copy}
      editTarget={state.editTarget}
      selectedBaseTileCount={state.selectedCells.length}
      selectedElementCount={state.selectedElementIds.length}
      selectedLabelCount={state.selectedLabelIds.length}
      labelText={selectedLabelText}
      imageUrl={state.customImageUrl}
      busy={state.busy}
      settings={state.project.settings}
      onImageUrlChange={state.setCustomImageUrl}
      onApplyImage={() => void state.handleApplyCustomImage(state.customImageUrl)}
      onRestoreWater={state.handleRestoreSelectedTiles}
      onElementResizingChange={(enabled) => state.handleChangeSettings({ elementResizingEnabled: enabled })}
      onLabelResizingChange={(enabled) => state.handleChangeSettings({ labelResizingEnabled: enabled })}
      onLabelBordersChange={(enabled) => state.handleChangeSettings({ labelBordersEnabled: enabled })}
      onLabelTextChange={(value) => {
        const selectedLabelId = state.selectedLabelIds[0];
        if (selectedLabelId !== undefined) handleUpdateLabelText(selectedLabelId, value);
      }}
      onDeleteSelectedElements={state.handleDeleteSelectedElements}
      onDeleteSelectedLabels={state.handleDeleteSelectedLabels}
      onClearAllLabels={state.handleClearLabels}
      onSettingsChange={state.handleChangeSettings}
    />
  );

  return (
    <div className={styles.workbench}>
      <MapMakerToolbar
        copy={copy}
        columns={state.project.columns}
        rows={state.project.rows}
        onRandomGenerate={state.handleRandomGenerate}
        onOpenSize={() => setSizeDialogOpen(true)}
        onOpenReset={() => setSizeDialogOpen(true)}
        onOpenSave={() => setSaveDialogOpen(true)}
        onOpenExport={() => state.setExportOpen(true)}
        onOpenHelp={() => setHelpDialogOpen(true)}
      />

      {(state.actionError !== null || state.actionStatus !== null) ? (
        <p className={`${styles.feedback} ${state.actionError !== null ? styles.error : ''}`} role={state.actionError !== null ? 'alert' : 'status'} aria-live="polite">
          {state.actionError !== null ? `${copy.common.errorLabel}: ${state.actionError}` : state.actionStatus}
        </p>
      ) : null}

      <div
        className={styles.screenWorkspace}
        style={{ '--left-panel-width': `${leftPanelWidth}px`, '--right-panel-width': `${rightPanelWidth}px` } as CSSProperties}
      >
        <aside className={`${styles.panel} ${styles.assetPanel}`} aria-label={copy.materials.title}>
          {assetPalette}
          {renderPanelResizeHandle('left')}
        </aside>

        <section className={styles.canvasPanel} aria-label={copy.canvas.mapPreviewAlt}>
          <div className={styles.canvasToolbar}>
            <button type="button" className={`${styles.toggleButton} ${multiSelectEnabled ? styles.isPressed : ''}`} aria-pressed={multiSelectEnabled} onClick={() => setMultiSelectEnabled((enabled) => !enabled)}>
              {copy.canvas.multiSelect}
            </button>
            <button type="button" className={styles.secondaryButton} disabled={state.selectedCells.length + state.selectedElementIds.length + state.selectedLabelIds.length === 0} onClick={() => { state.clearSelection(); setEditingLabelId(null); }}>
              {copy.canvas.clearSelection}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleAddLabelAndEdit}>
              {copy.canvas.addLabel}
            </button>
            {canEditSingleLabel ? (
              <button
                type="button"
                data-map-maker-label-edit-toggle="true"
                className={styles.secondaryButton}
                onPointerDown={(event) => { if (editingLabelId === state.selectedLabelIds[0]) event.preventDefault(); }}
                onClick={handleToggleLabelEdit}
              >
                {editingLabelId === state.selectedLabelIds[0] ? copy.canvas.finishLabelEdit : copy.canvas.editLabel}
              </button>
            ) : null}
            {canTransformSelection ? (
              <>
                <button type="button" className={styles.secondaryButton} onClick={() => state.handleRotateSelected(90)}>{copy.canvas.rotate90}</button>
                <button type="button" className={styles.secondaryButton} onClick={() => state.handleRotateSelected(180)}>{copy.canvas.rotate180}</button>
                <button type="button" className={styles.secondaryButton} onClick={() => state.handleRotateSelected(270)}>{copy.canvas.rotate270}</button>
                <button type="button" className={styles.secondaryButton} onClick={state.handleMirrorSelected}>{copy.canvas.mirror}</button>
                <button type="button" className={styles.secondaryButton} onClick={state.handleRestoreSelected}>{copy.canvas.restore}</button>
              </>
            ) : null}
          </div>
          <p className={styles.canvasHint}>{state.editTarget === 'base' ? copy.canvas.baseTileHint : state.editTarget === 'labels' ? copy.canvas.labelEditHint : copy.canvas.elementDragHint}</p>
          <div className={styles.canvasViewport}>
            <MapMakerCanvas
              copy={copy}
              project={state.project}
              editTarget={state.editTarget}
              selectedCells={state.selectedCells}
              selectedElementIds={state.selectedElementIds}
              selectedLabelIds={state.selectedLabelIds}
              multiSelectEnabled={multiSelectEnabled}
              editingLabelId={editingLabelId}
              onSelectCells={state.handleSelectCells}
              onSelectElements={state.handleSelectElements}
              onSelectLabels={state.handleSelectLabels}
              onMoveElements={state.handleMoveElements}
              onMoveLabels={state.handleMoveLabels}
              onResizeElement={state.handleResizeElement}
              onResizeLabel={state.handleResizeLabel}
              onEditLabel={handleEditLabel}
              onUpdateLabelText={handleUpdateLabelText}
              onFinishLabelEdit={(id) => { if (editingLabelId === id) setEditingLabelId(null); }}
              onCancelLabelEdit={handleCancelLabelEdit}
              onImageLoadError={state.handleImageLoadError}
            />
          </div>
        </section>

        <aside className={`${styles.panel} ${styles.inspectorPanel}`} aria-label={`${copy.layers.title}, ${copy.properties.title}`}>
          {layerPanel}
          <hr className={styles.sectionDivider} />
          {propertiesPanel}
          {renderPanelResizeHandle('right')}
        </aside>
      </div>

      <nav className={styles.mobileBottomNav} aria-label={copy.title}>
        <button type="button" className={styles.tabButton} aria-pressed={mobilePane === 'materials'} onClick={() => handleOpenMobilePane('materials')}>{copy.materials.title}</button>
        <button type="button" className={styles.tabButton} aria-pressed={mobilePane === 'layers'} onClick={() => handleOpenMobilePane('layers')}>{copy.layers.title}</button>
        <button type="button" className={styles.tabButton} aria-pressed={mobilePane === 'properties'} onClick={() => handleOpenMobilePane('properties')}>{copy.properties.title}</button>
        <button type="button" className={styles.tabButton} aria-pressed={mobilePane === 'more'} onClick={() => handleOpenMobilePane('more')}>{copy.common.more}</button>
      </nav>

      <section
        className={styles.mobileSheet}
        role={mobilePane === null ? undefined : 'dialog'}
        aria-modal={mobilePane === null ? undefined : 'true'}
        aria-hidden={mobilePane === null}
        aria-label={mobilePane === 'materials' ? copy.materials.title : mobilePane === 'layers' ? copy.layers.title : mobilePane === 'properties' ? copy.properties.title : copy.common.more}
        hidden={mobilePane === null}
      >
          <header className={styles.mobileSheetHeader}>
            <strong>{mobilePane === 'materials' ? copy.materials.title : mobilePane === 'layers' ? copy.layers.title : mobilePane === 'properties' ? copy.properties.title : copy.common.more}</strong>
            <button type="button" className={styles.secondaryButton} onClick={() => setMobilePane(null)}>{copy.common.close}</button>
          </header>
          <div className={styles.mobileSheetBody}>
            <div className={styles.mobilePaneContent} hidden={mobilePane !== 'materials'}>{assetPalette}</div>
            <div className={styles.mobilePaneContent} hidden={mobilePane !== 'layers'}>{layerPanel}</div>
            <div className={styles.mobilePaneContent} hidden={mobilePane !== 'properties'}>{propertiesPanel}</div>
            <div className={styles.mobilePaneContent} hidden={mobilePane !== 'more'}>
              <div className={styles.mobileActions}>
                <button type="button" className={styles.secondaryButton} onClick={state.handleRandomGenerate}>{copy.actions.randomGenerate}</button>
                <button type="button" className={styles.secondaryButton} onClick={() => setSizeDialogOpen(true)}>{copy.actions.mapSize}</button>
                <button type="button" className={styles.secondaryButton} onClick={() => setSizeDialogOpen(true)}>{copy.actions.resetAndClear}</button>
                <button type="button" className={styles.secondaryButton} onClick={() => setSaveDialogOpen(true)}>{copy.actions.saveAndLoad}</button>
                <button type="button" className={styles.primaryButton} onClick={() => state.setExportOpen(true)}>{copy.actions.exportImage}</button>
                <button type="button" className={styles.secondaryButton} onClick={() => setHelpDialogOpen(true)}>{copy.actions.help}</button>
              </div>
            </div>
          </div>
      </section>

      <MapMakerSizeDialog
        key={`${sizeDialogOpen}:${state.project.columns}:${state.project.rows}`}
        copy={copy}
        open={sizeDialogOpen}
        columns={state.project.columns}
        rows={state.project.rows}
        busy={state.busy}
        onOpenChange={setSizeDialogOpen}
        onApplySize={(columns, rows) => { state.handleApplySize(columns, rows); setSizeDialogOpen(false); }}
        onResetMap={() => { state.handleResetMap(); setSizeDialogOpen(false); }}
        onClearLayerOne={() => state.handleClearLayer(1)}
        onClearLayerTwo={() => state.handleClearLayer(2)}
        onClearAllLabels={state.handleClearLabels}
      />
      <MapMakerSaveDialog
        copy={copy}
        open={saveDialogOpen}
        slots={state.slots}
        selectedFileName={state.selectedFileName}
        busy={state.busy}
        onOpenChange={setSaveDialogOpen}
        onSaveSlot={state.handleSaveSlot}
        onLoadSlot={(slot) => void state.handleLoadSlot(slot)}
        onDownloadProjectFile={state.handleDownloadProjectFile}
        onChooseProjectFile={state.handleChooseProjectFile}
        onLoadProjectFile={() => void state.handleLoadProjectFile()}
      />
      <MapMakerExportDialog
        copy={copy}
        open={state.exportOpen}
        busy={state.exportBusy}
        previewImageUrl={state.previewImageUrl}
        onOpenChange={state.setExportOpen}
        onDownloadImage={() => void state.handleDownloadImage()}
      />
      <MapMakerHelpDialog copy={copy} open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </div>
  );
}
