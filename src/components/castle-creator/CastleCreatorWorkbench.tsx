'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { CastleAssetPalette } from '@/components/castle-creator/CastleAssetPalette';
import { CastleCanvas } from '@/components/castle-creator/CastleCanvas';
import { CastleDocumentToolbar } from '@/components/castle-creator/CastleDocumentToolbar';
import { CastleExportDialog } from '@/components/castle-creator/CastleExportDialog';
import { CastleProjectDialog } from '@/components/castle-creator/CastleProjectDialog';
import { CastleSaveDialog, type CastleSaveSlotState } from '@/components/castle-creator/CastleSaveDialog';
import { CastleSettingsPanel } from '@/components/castle-creator/CastleSettingsPanel';
import { getCastleAsset } from '@/lib/castle-creator/catalog';
import {
  CASTLE_CREATOR_SAVE_SLOT_NUMBERS,
} from '@/lib/castle-creator/constants';
import { getCastleCreatorCopy } from '@/lib/castle-creator/copy';
import {
  addCastlePiece,
  CASTLE_PROJECT_LIMITS,
  bringCastlePieceToFront,
  clearCastleLayer,
  clearCastlePieces,
  copyCastlePiece,
  createCastleProject,
  deleteCastlePiece,
  moveCastlePiece,
  moveCastlePieceToLayer,
  resizeCastlePiece,
  setCastleActiveLayer,
  setCastleCanvasSettings,
  setCastleLayerVisibility,
  validateCastleProject,
} from '@/lib/castle-creator/project';
import {
  castleCanvasToPngBlob,
  renderCastleProject,
  resolveCastleCanvasSize,
} from '@/lib/castle-creator/render';
import {
  castleSaveStorageKey,
  readCastleSaveSlot,
  writeCastleSaveSlot,
} from '@/lib/castle-creator/saves';
import {
  MAX_CASTLE_PROJECT_FILE_BYTES,
  parseCastleProjectFile,
  serializeCastleProject,
} from '@/lib/castle-creator/project-file';
import type {
  CastleAsset,
  CastleCategory,
  CastleLayerId,
  CastlePalette,
  CastlePiece,
  CastlePoint,
  CastleProject,
  CastleSaveSlotNumber,
  CastleSize,
} from '@/lib/castle-creator/types';
import { type SiteLocale } from '@/lib/site-locale';

type MobileTab = 'assets' | 'edit' | 'settings';

const MOBILE_TABS: readonly MobileTab[] = ['assets', 'edit', 'settings'];
const AUTOMATIC_CANVAS_WIDTH_FALLBACK = 1000;

interface ExportPreview {
  url: string;
  blob: Blob;
  size: CastleSize;
}

function describeCastleError(reason: unknown): string {
  if (reason instanceof Error) return `${reason.name}: ${reason.message}`;
  if (typeof reason === 'string') return reason;
  return String(reason);
}

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element
    && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') !== null;
}

function getBrowserStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Castle browser save storage is unavailable during server rendering.');
  }
  if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
    throw new Error('Castle browser save storage does not expose localStorage.getItem.');
  }
  return window.localStorage;
}

function createCastlePieceId(assetId: string, sequence: number): string {
  const cryptoSource = globalThis.crypto;
  if (cryptoSource && typeof cryptoSource.randomUUID === 'function') {
    return `${assetId}-${cryptoSource.randomUUID()}`;
  }
  return `${assetId}-piece-${sequence}`;
}

function downloadCastleBlob(blob: Blob, fileName: string): void {
  if (typeof URL.createObjectURL !== 'function') {
    throw new Error(`Castle download ${JSON.stringify(fileName)} cannot start because URL.createObjectURL is unavailable.`);
  }
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  try {
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }
}

function readSlotStates(storage: Storage): CastleSaveSlotState[] {
  return CASTLE_CREATOR_SAVE_SLOT_NUMBERS.map((slotNumber) => {
    try {
      const record = readCastleSaveSlot(storage, slotNumber);
      if (record === null) {
        return { slotNumber, status: 'empty', updatedAt: null, pieceCount: null, error: null };
      }
      return {
        slotNumber,
        status: 'occupied',
        updatedAt: record.updatedAt,
        pieceCount: record.project.pieces.length,
        error: null,
      };
    } catch (reason) {
      return {
        slotNumber,
        status: 'error',
        updatedAt: null,
        pieceCount: null,
        error: describeCastleError(reason),
      };
    }
  });
}

function createErrorSlotStates(error: string): CastleSaveSlotState[] {
  return CASTLE_CREATOR_SAVE_SLOT_NUMBERS.map((slotNumber) => ({
    slotNumber,
    status: 'error',
    updatedAt: null,
    pieceCount: null,
    error,
  }));
}

function selectedCastlePiece(project: CastleProject, pieceId: string | null) {
  return pieceId === null ? undefined : project.pieces.find((piece) => piece.id === pieceId);
}

function tabLabel(
  copy: ReturnType<typeof getCastleCreatorCopy>,
  tab: MobileTab,
): string {
  if (tab === 'assets') return copy.editor.mobileTabLabels.library;
  if (tab === 'edit') return copy.editor.mobileTabLabels.editor;
  return copy.editor.mobileTabLabels.settings;
}

function PieceSizeControl({
  piece,
  originalWidth,
  locale,
  disabled,
  onResizePiece,
}: {
  piece: CastlePiece;
  originalWidth: number;
  locale: SiteLocale;
  disabled: boolean;
  onResizePiece(pieceId: string, width: number): void;
}) {
  const inputId = useId();
  const editorCopy = getCastleCreatorCopy(locale).editor;
  const widthLimit = CASTLE_PROJECT_LIMITS.maxPieceDimension * Math.min(1, piece.width / piece.height);
  const [maximumWidth, setMaximumWidth] = useState(() => Math.min(widthLimit, Math.max(originalWidth * 4, piece.width)));
  if (piece.width > maximumWidth) setMaximumWidth(piece.width);
  const percentage = Math.round(piece.width / originalWidth * 1000) / 10;

  return (
    <div className="mt-3" data-castle-piece-size>
      <div className="flex items-center justify-between gap-2 text-xs">
        <label htmlFor={inputId}>{editorCopy.sizeLabel}</label>
        <output htmlFor={inputId} className="tabular-nums">{percentage}%</output>
      </div>
      <input
        id={inputId}
        type="range"
        className="block h-11 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        min={Math.min(1, piece.width)}
        max={maximumWidth}
        step="any"
        value={piece.width}
        aria-valuetext={`${percentage}%`}
        disabled={disabled}
        onChange={(event) => onResizePiece(piece.id, Number(event.currentTarget.value))}
      />
      <p className="text-xs leading-5 text-muted-foreground">{editorCopy.sizeScaleHint}</p>
    </div>
  );
}

function PieceActions({
  locale,
  project,
  selectedPieceId,
  disabled,
  onCopy,
  onDelete,
  onBringToFront,
  onResizePiece,
}: {
  locale: SiteLocale;
  project: CastleProject;
  selectedPieceId: string | null;
  disabled: boolean;
  onCopy(): void;
  onDelete(): void;
  onBringToFront(): void;
  onResizePiece(pieceId: string, width: number): void;
}) {
  const copy = getCastleCreatorCopy(locale);
  const selectedPiece = selectedCastlePiece(project, selectedPieceId);
  const editorCopy = copy.editor;
  const selectedAsset = selectedPiece ? getCastleAsset(selectedPiece.assetId) : null;
  return (
    <section className="rounded-lg border border-border bg-card p-3" data-castle-piece-actions>
      <h2 className="text-sm font-semibold">{selectedPiece ? editorCopy.selectedPieceHeading : editorCopy.pieceHeading}</h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {selectedPiece ? editorCopy.selectionStatus : editorCopy.selectionDisabledStatus}
      </p>
      {selectedPiece && selectedAsset ? (
        <p className="mt-2 break-words text-xs text-muted-foreground">
          {copy.library.assetImageAlt(selectedAsset.category, selectedAsset.number)}
        </p>
      ) : null}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" className="min-h-11 rounded-md border border-border px-2 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" disabled={disabled || !selectedPiece} onClick={onCopy}>
          {editorCopy.copyLabel}
        </button>
        <button type="button" className="min-h-11 rounded-md border border-border px-2 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" disabled={disabled || !selectedPiece} onClick={onDelete}>
          {editorCopy.deleteLabel}
        </button>
        <button type="button" className="min-h-11 rounded-md border border-border px-2 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" disabled={disabled || !selectedPiece} onClick={onBringToFront}>
          {editorCopy.bringToFrontLabel}
        </button>
      </div>
      {selectedPiece && selectedAsset ? (
        <PieceSizeControl
          key={selectedPiece.id}
          piece={selectedPiece}
          originalWidth={selectedAsset.width}
          locale={locale}
          disabled={disabled || !project.resizeEnabled}
          onResizePiece={onResizePiece}
        />
      ) : null}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{editorCopy.copyNote}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{editorCopy.resizeHint}</p>
    </section>
  );
}

export function CastleCreatorWorkbench({ locale }: { locale: SiteLocale }) {
  const copy = getCastleCreatorCopy(locale);
  const [project, setProject] = useState<CastleProject>(() => createCastleProject());
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CastleCategory>('walls');
  const [mobileTab, setMobileTab] = useState<MobileTab>('assets');
  const [activeSlot, setActiveSlot] = useState<CastleSaveSlotNumber | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [automaticCanvasWidth, setAutomaticCanvasWidth] = useState(AUTOMATIC_CANVAS_WIDTH_FALLBACK);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [slotStates, setSlotStates] = useState<CastleSaveSlotState[]>([]);
  const [overwriteSlot, setOverwriteSlot] = useState<CastleSaveSlotNumber | null>(null);
  const [exportPreview, setExportPreview] = useState<ExportPreview | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const exportPreviewRef = useRef<ExportPreview | null>(null);
  const projectRef = useRef(project);
  const activeSlotRef = useRef(activeSlot);
  const automaticCanvasWidthRef = useRef(automaticCanvasWidth);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const mobileTabButtonRefs = useRef<Record<MobileTab, HTMLButtonElement | null>>({
    assets: null,
    edit: null,
    settings: null,
  });
  const saveDialogTriggerRef = useRef<HTMLElement | null>(null);
  const browserSavesTriggerRef = useRef<HTMLButtonElement>(null);
  const projectTriggerRef = useRef<HTMLButtonElement>(null);
  const pngTriggerRef = useRef<HTMLButtonElement>(null);
  const pieceSequenceRef = useRef(0);

  const busy = isSaving || isLoading || isExporting;
  const canvasSize = useMemo(
    () => resolveCastleCanvasSize(project.canvas, automaticCanvasWidth),
    [automaticCanvasWidth, project.canvas],
  );

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  useEffect(() => {
    automaticCanvasWidthRef.current = automaticCanvasWidth;
  }, [automaticCanvasWidth]);

  useEffect(() => {
    const canvasHost = canvasHostRef.current;
    if (!canvasHost) return undefined;
    const measureCanvasWidth = () => {
      const measuredWidth = Math.round(canvasHost.clientWidth);
      if (measuredWidth <= 0) return;
      setAutomaticCanvasWidth((currentWidth) => currentWidth === measuredWidth ? currentWidth : measuredWidth);
    };
    measureCanvasWidth();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measureCanvasWidth) : null;
    observer?.observe(canvasHost);
    window.addEventListener('resize', measureCanvasWidth);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureCanvasWidth);
    };
  }, []);

  useEffect(() => () => {
    if (exportPreviewRef.current) URL.revokeObjectURL(exportPreviewRef.current.url);
  }, []);

  function applyProjectChange(nextProject: CastleProject, clearSelection = false) {
    if (busy) return;
    const validatedProject = validateCastleProject(nextProject);
    projectRef.current = validatedProject;
    setProject(validatedProject);
    setHasUnsavedChanges(true);
    if (clearSelection) setSelectedPieceId(null);
    setError(null);
  }

  function applyProjectOperation(operation: (currentProject: CastleProject) => CastleProject): boolean {
    try {
      applyProjectChange(operation(projectRef.current));
      return true;
    } catch (reason) {
      setError(`${copy.editor.interactionError}: ${describeCastleError(reason)}`);
      return false;
    }
  }

  function addAsset(asset: CastleAsset) {
    if (busy) return;
    try {
      const currentProject = projectRef.current;
      const pieceId = createCastlePieceId(asset.id, pieceSequenceRef.current);
      pieceSequenceRef.current += 1;
      const position: CastlePoint = { x: 0, y: 0 };
      const nextProject = addCastlePiece(currentProject, asset, pieceId, position);
      applyProjectChange(nextProject);
      setSelectedPieceId(pieceId);
    } catch (reason) {
      setError(`${copy.editor.pieceHeading}: ${describeCastleError(reason)}`);
    }
  }

  function handleMovePiece(pieceId: string, position: CastlePoint) {
    if (busy) return;
    applyProjectOperation((currentProject) => moveCastlePiece(currentProject, pieceId, position));
  }

  function handleMovePieceToLayer(pieceId: string, layerId: CastleLayerId) {
    if (busy || selectedPieceId !== pieceId) return;
    applyProjectOperation((currentProject) => moveCastlePieceToLayer(currentProject, pieceId, layerId));
  }

  function handleResizePiece(pieceId: string, width: number) {
    if (busy) return;
    applyProjectOperation((currentProject) => resizeCastlePiece(currentProject, pieceId, width));
  }

  function handleCopyPiece() {
    if (busy) return;
    const sourcePieceId = selectedPieceId;
    if (sourcePieceId === null) return;
    try {
      const sourcePiece = selectedCastlePiece(projectRef.current, sourcePieceId);
      if (!sourcePiece) {
        throw new Error(`Castle piece ${JSON.stringify(sourcePieceId)} cannot be copied because it is missing.`);
      }
      const newPieceId = createCastlePieceId(sourcePiece.assetId, pieceSequenceRef.current);
      pieceSequenceRef.current += 1;
      const nextProject = copyCastlePiece(projectRef.current, sourcePieceId, newPieceId);
      applyProjectChange(nextProject);
      setSelectedPieceId(newPieceId);
    } catch (reason) {
      setError(`${copy.editor.copyLabel}: ${describeCastleError(reason)}`);
    }
  }

  function handleDeletePiece() {
    if (busy) return;
    if (selectedPieceId === null) return;
    if (applyProjectOperation((currentProject) => deleteCastlePiece(currentProject, selectedPieceId))) {
      setSelectedPieceId(null);
    }
  }

  function handleBringPieceToFront() {
    if (busy) return;
    if (selectedPieceId === null) return;
    applyProjectOperation((currentProject) => bringCastlePieceToFront(currentProject, selectedPieceId));
  }

  function handleKeyboardDelete(event: KeyboardEvent<HTMLElement>) {
    if (busy || selectedPieceId === null || isEditableTarget(event.target)) return;
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    if (event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    handleDeletePiece();
  }

  function handleOpenSaveDialog() {
    const focusedElement = document.activeElement;
    if (focusedElement instanceof HTMLElement && focusedElement.closest('[data-castle-action="quick-save"], [data-castle-action="browser-saves"]')) {
      saveDialogTriggerRef.current = focusedElement;
    } else {
      saveDialogTriggerRef.current = browserSavesTriggerRef.current;
    }
    try {
      const storage = getBrowserStorage();
      setSlotStates(readSlotStates(storage));
      setOverwriteSlot(null);
      setError(null);
    } catch (reason) {
      const message = `${copy.saves.saveLoadError}: ${describeCastleError(reason)}`;
      setSlotStates(createErrorSlotStates(message));
      setError(message);
    }
    setSaveDialogOpen(true);
  }

  function handleWriteSlot(slotNumber: CastleSaveSlotNumber, allowOverwrite: boolean) {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const storage = getBrowserStorage();
      const hasStoredSlotValue = storage.getItem(castleSaveStorageKey(slotNumber)) !== null;
      if (hasStoredSlotValue && !allowOverwrite) {
        setOverwriteSlot(slotNumber);
        return;
      }
      const savedRecord = writeCastleSaveSlot(storage, slotNumber, projectRef.current);
      setActiveSlot(savedRecord.slotNumber);
      activeSlotRef.current = savedRecord.slotNumber;
      setHasUnsavedChanges(false);
      setSlotStates(readSlotStates(storage));
      setOverwriteSlot(null);
      setError(null);
      setSaveDialogOpen(false);
    } catch (reason) {
      setError(`${copy.saves.saveLoadError}: ${describeCastleError(reason)}`);
    } finally {
      setIsSaving(false);
    }
  }

  function handleSaveSlot(slotNumber: CastleSaveSlotNumber) {
    handleWriteSlot(slotNumber, false);
  }

  function handleConfirmOverwrite() {
    if (overwriteSlot === null) return;
    handleWriteSlot(overwriteSlot, true);
  }

  function handleQuickSave() {
    const currentSlot = activeSlotRef.current;
    if (currentSlot === null) {
      handleOpenSaveDialog();
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      const storage = getBrowserStorage();
      const savedRecord = writeCastleSaveSlot(storage, currentSlot, projectRef.current);
      setActiveSlot(savedRecord.slotNumber);
      activeSlotRef.current = savedRecord.slotNumber;
      setHasUnsavedChanges(false);
      setSlotStates(readSlotStates(storage));
      setError(null);
    } catch (reason) {
      setError(`${copy.saves.saveLoadError}: ${describeCastleError(reason)}`);
    } finally {
      setIsSaving(false);
    }
  }

  function handleLoadSlot(slotNumber: CastleSaveSlotNumber) {
    try {
      const record = readCastleSaveSlot(getBrowserStorage(), slotNumber);
      if (record === null) {
        throw new Error(`Castle save slot ${slotNumber} is empty and cannot be loaded.`);
      }
      const loadedProject = validateCastleProject(record.project);
      projectRef.current = loadedProject;
      setProject(loadedProject);
      setSelectedPieceId(null);
      setActiveSlot(record.slotNumber);
      activeSlotRef.current = record.slotNumber;
      setHasUnsavedChanges(false);
      setError(null);
      setSaveDialogOpen(false);
    } catch (reason) {
      setError(`${copy.saves.saveLoadError}: ${describeCastleError(reason)}`);
    }
  }

  async function handleImportProjectFile(file: File): Promise<void> {
    if (file.size > MAX_CASTLE_PROJECT_FILE_BYTES) {
      setError(`${copy.projectFiles.importError}: ${JSON.stringify(file.name)} is ${file.size} bytes; maximum is ${MAX_CASTLE_PROJECT_FILE_BYTES} bytes.`);
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    try {
      const importedProject = parseCastleProjectFile(await file.text());
      projectRef.current = importedProject;
      setProject(importedProject);
      setSelectedPieceId(null);
      setActiveSlot(null);
      activeSlotRef.current = null;
      setHasUnsavedChanges(true);
      setError(null);
      setProjectDialogOpen(false);
    } catch (reason) {
      setError(`${copy.projectFiles.importError}: ${JSON.stringify(file.name)} — ${describeCastleError(reason)}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewProject() {
    const newProject = createCastleProject();
    projectRef.current = newProject;
    setProject(newProject);
    setSelectedPieceId(null);
    setActiveSlot(null);
    activeSlotRef.current = null;
    setHasUnsavedChanges(true);
    setError(null);
    setProjectDialogOpen(false);
  }

  function handleClearAll() {
    if (busy) return;
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm(copy.settings.clearAllConfirmDescription)) return;
    }
    applyProjectChange(clearCastlePieces(projectRef.current), true);
  }

  function handleExportProject() {
    try {
      const serializedProject = serializeCastleProject(projectRef.current);
      downloadCastleBlob(new Blob([serializedProject], { type: 'application/json' }), 'castle-project.json');
      setError(null);
      setProjectDialogOpen(false);
    } catch (reason) {
      setError(`${copy.projectFiles.exportLabel}: ${describeCastleError(reason)}`);
    }
  }

  async function handleExportPng() {
    if (isExporting) return;
    setIsExporting(true);
    setExportError(null);
    setError(null);
    try {
      const snapshot = validateCastleProject(projectRef.current);
      const exportSize = resolveCastleCanvasSize(snapshot.canvas, automaticCanvasWidthRef.current);
      const renderedCanvas = await renderCastleProject(snapshot, exportSize);
      const pngBlob = await castleCanvasToPngBlob(renderedCanvas);
      if (typeof URL.createObjectURL !== 'function') {
        throw new Error('Castle PNG preview cannot be created because URL.createObjectURL is unavailable.');
      }
      const previewUrl = URL.createObjectURL(pngBlob);
      if (exportPreviewRef.current) URL.revokeObjectURL(exportPreviewRef.current.url);
      const nextPreview = { url: previewUrl, blob: pngBlob, size: exportSize };
      exportPreviewRef.current = nextPreview;
      setExportPreview(nextPreview);
      setExportDialogOpen(true);
    } catch (reason) {
      const message = `${copy.png.exportError}: ${describeCastleError(reason)}`;
      setExportError(message);
      setError(message);
    } finally {
      setIsExporting(false);
    }
  }

  function handleCloseExportDialog() {
    setExportDialogOpen(false);
    if (exportPreviewRef.current) URL.revokeObjectURL(exportPreviewRef.current.url);
    exportPreviewRef.current = null;
    setExportPreview(null);
  }

  function handleDownloadPng() {
    const preview = exportPreview;
    if (!preview) return;
    try {
      downloadCastleBlob(preview.blob, 'castle.png');
      setExportError(null);
    } catch (reason) {
      setExportError(`${copy.png.exportError}: ${describeCastleError(reason)}`);
    }
  }

  function handleOpenHelp() {
    const helpHeading = document.getElementById('castle-creator-how-to-use-heading');
    if (helpHeading && typeof helpHeading.scrollIntoView === 'function') {
      helpHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function moveMobileTab(event: KeyboardEvent<HTMLButtonElement>, currentTab: MobileTab) {
    const currentIndex = MOBILE_TABS.indexOf(currentTab);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % MOBILE_TABS.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex + MOBILE_TABS.length - 1) % MOBILE_TABS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = MOBILE_TABS.length - 1;
    else return;
    event.preventDefault();
    const nextTab = MOBILE_TABS[nextIndex];
    setMobileTab(nextTab);
    mobileTabButtonRefs.current[nextTab]?.focus();
  }

  const statusLabel = activeSlot !== null && !hasUnsavedChanges
    ? copy.toolbar.savedStatus(activeSlot)
    : copy.toolbar.unsavedStatus;
  const selectedPiece = selectedCastlePiece(project, selectedPieceId);

  return (
    <section
      aria-label={copy.editor.workspaceLabel}
      aria-busy={busy}
      className="min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm"
      data-castle-workbench
      onKeyDown={handleKeyboardDelete}
    >
      <div className="flex min-h-7 items-center justify-between gap-3 border-b border-border px-3 py-2 text-xs text-muted-foreground sm:px-4" data-castle-status-row id="castle-status-row">
        <span className="min-w-0 truncate">{statusLabel} · {copy.editor.activeLayerLabel(project.activeLayer)}</span>
        <span className="shrink-0">{copy.saves.pieceCountLabel(project.pieces.length)} · {canvasSize.width} × {canvasSize.height}px</span>
      </div>

      <CastleDocumentToolbar
        activeSlot={activeSlot}
        copy={copy}
        disabled={busy}
        isExporting={isExporting}
        isSaving={isSaving}
        pngTriggerRef={pngTriggerRef}
        onExportPng={() => void handleExportPng()}
        onOpenHelp={handleOpenHelp}
        onOpenProjectFiles={() => { setProjectDialogOpen(true); setError(null); }}
        onOpenSaves={handleOpenSaveDialog}
        onQuickSave={handleQuickSave}
        projectTriggerRef={projectTriggerRef}
        browserSavesTriggerRef={browserSavesTriggerRef}
      />

      {error ? (
        <p role="alert" className="mx-3 mt-3 break-words rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive sm:mx-4">
          {error}
        </p>
      ) : null}

      <div className="grid min-w-0 gap-3 p-2 sm:p-4 md:min-h-[36rem] md:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,312px)]">
        <aside className="relative order-2 hidden min-h-0 min-w-0 md:order-1 md:block md:overflow-hidden" data-castle-left-panel>
          <div className="h-full min-h-0 overflow-hidden md:absolute md:inset-0 [&>section]:h-full">
            <CastleAssetPalette
              category={activeCategory}
              locale={locale}
              onAddAsset={addAsset}
              onCategoryChange={setActiveCategory}
              onPaletteChange={(palette: CastlePalette) => applyProjectChange({ ...projectRef.current, palette })}
              palette={project.palette}
            />
          </div>
        </aside>

        <div className="order-1 min-w-0 md:order-2 md:col-start-2 md:row-start-1" data-castle-canvas-region>
          <div className="mb-2 grid grid-cols-2 gap-2" data-castle-canvas-options>
            <button
              type="button"
              className="min-h-11 min-w-0 rounded-md border border-border px-2 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
              aria-pressed={project.snapEnabled}
              onClick={() => applyProjectChange({ ...projectRef.current, snapEnabled: !projectRef.current.snapEnabled })}
            >
              {copy.editor.snapLabel}: {project.snapEnabled ? copy.editor.snapEnabledLabel : copy.editor.snapDisabledLabel}
            </button>
            <button
              type="button"
              className="min-h-11 min-w-0 rounded-md border border-border px-2 text-xs hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
              aria-pressed={project.resizeEnabled}
              onClick={() => applyProjectChange({ ...projectRef.current, resizeEnabled: !projectRef.current.resizeEnabled })}
            >
              {copy.editor.resizeLabel}: {project.resizeEnabled ? copy.editor.resizeEnabledLabel : copy.editor.resizeDisabledLabel}
            </button>
          </div>
          <p className="h-4 truncate text-[11px] leading-4 text-muted-foreground">{copy.editor.aspectRatioHint}</p>
          <div ref={canvasHostRef} className="min-h-0 w-full" data-castle-canvas-host>
            <CastleCanvas
              locale={locale}
              onMovePiece={handleMovePiece}
              onResizePiece={handleResizePiece}
              onSelectPiece={setSelectedPieceId}
              project={project}
              selectedPieceId={selectedPieceId}
              size={canvasSize}
            />
          </div>
          <p className="mt-2 hidden text-xs leading-5 text-muted-foreground md:block">{copy.editor.canvasHint}</p>
        </div>

        <div className="relative order-3 min-h-0 min-w-0 md:col-start-3 md:row-start-1 md:overflow-y-auto" data-castle-right-panel>
          <div className="md:hidden" data-castle-mobile-tabs>
            <div role="tablist" aria-label={copy.editor.workspaceLabel} className="grid grid-cols-3 gap-1">
              {MOBILE_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  ref={(button) => { mobileTabButtonRefs.current[tab] = button; }}
                  aria-selected={mobileTab === tab}
                  tabIndex={mobileTab === tab ? 0 : -1}
                  className="min-h-11 min-w-0 rounded-md border border-border px-2 text-xs aria-selected:border-primary aria-selected:bg-primary/10"
                  onClick={() => setMobileTab(tab)}
                  onKeyDown={(event) => moveMobileTab(event, tab)}
                >
                  {tabLabel(copy, tab)}
                </button>
              ))}
            </div>
            <div className="mt-2 max-h-[244px] min-h-[244px] overflow-y-auto" data-castle-mobile-drawer>
              {mobileTab === 'assets' ? (
                <CastleAssetPalette
                  category={activeCategory}
                  locale={locale}
                  onAddAsset={addAsset}
                  onCategoryChange={setActiveCategory}
                  onPaletteChange={(palette: CastlePalette) => applyProjectChange({ ...projectRef.current, palette })}
                  palette={project.palette}
                />
              ) : null}
              {mobileTab === 'edit' ? (
                <PieceActions disabled={busy} locale={locale} onBringToFront={handleBringPieceToFront} onCopy={handleCopyPiece} onDelete={handleDeletePiece} onResizePiece={handleResizePiece} project={project} selectedPieceId={selectedPieceId} />
              ) : null}
              {mobileTab === 'settings' ? (
                <CastleSettingsPanel
                  locale={locale}
                  selectedPiece={selectedPiece ?? null}
                  onMovePieceToLayer={handleMovePieceToLayer}
                  disabled={busy}
                  onActiveLayerChange={(layerId: CastleLayerId) => applyProjectChange(setCastleActiveLayer(projectRef.current, layerId))}
                  onCanvasSettingsChange={(settings) => applyProjectChange(setCastleCanvasSettings(projectRef.current, settings))}
                  onClearAll={handleClearAll}
                  onClearLayer={(layerId: CastleLayerId) => {
                    applyProjectChange(clearCastleLayer(projectRef.current, layerId), selectedPiece?.layerId === layerId);
                  }}
                  onLayerVisibilityChange={(layerId: CastleLayerId, visible: boolean) => applyProjectChange(setCastleLayerVisibility(projectRef.current, layerId, visible), selectedPiece?.layerId === layerId && !visible)}
                  project={project}
                />
              ) : null}
            </div>
          </div>

          <div className="hidden space-y-3 md:absolute md:inset-x-0 md:top-0 md:block">
            <PieceActions disabled={busy} locale={locale} onBringToFront={handleBringPieceToFront} onCopy={handleCopyPiece} onDelete={handleDeletePiece} onResizePiece={handleResizePiece} project={project} selectedPieceId={selectedPieceId} />
            <CastleSettingsPanel
              locale={locale}
              selectedPiece={selectedPiece ?? null}
              onMovePieceToLayer={handleMovePieceToLayer}
              disabled={busy}
              onActiveLayerChange={(layerId: CastleLayerId) => applyProjectChange(setCastleActiveLayer(projectRef.current, layerId))}
              onCanvasSettingsChange={(settings) => applyProjectChange(setCastleCanvasSettings(projectRef.current, settings))}
              onClearAll={handleClearAll}
              onClearLayer={(layerId: CastleLayerId) => {
                applyProjectChange(clearCastleLayer(projectRef.current, layerId), selectedPiece?.layerId === layerId);
              }}
              onLayerVisibilityChange={(layerId: CastleLayerId, visible: boolean) => applyProjectChange(setCastleLayerVisibility(projectRef.current, layerId, visible), selectedPiece?.layerId === layerId && !visible)}
              project={project}
            />
          </div>
        </div>
      </div>

      {saveDialogOpen ? (
        <CastleSaveDialog
          activeSlot={activeSlot}
          busy={busy}
          copy={copy}
          error={error}
          finalFocus={() => saveDialogTriggerRef.current ?? browserSavesTriggerRef.current}
          onCancelOverwrite={() => setOverwriteSlot(null)}
          onClose={() => { setSaveDialogOpen(false); setOverwriteSlot(null); }}
          onConfirmOverwrite={handleConfirmOverwrite}
          onLoadSlot={handleLoadSlot}
          onSaveSlot={handleSaveSlot}
          overwriteSlot={overwriteSlot}
          slots={slotStates}
        />
      ) : null}

      {projectDialogOpen ? (
        <CastleProjectDialog
          busy={busy}
          copy={copy}
          error={error}
          finalFocus={() => projectTriggerRef.current}
          onClose={() => setProjectDialogOpen(false)}
          onExportProject={handleExportProject}
          onImportProject={handleImportProjectFile}
          onNewProject={handleNewProject}
        />
      ) : null}

      {exportDialogOpen ? (
        <CastleExportDialog
          copy={copy}
          error={exportError}
          exportSize={exportPreview?.size ?? null}
          finalFocus={() => pngTriggerRef.current}
          isExporting={isExporting}
          onClose={handleCloseExportDialog}
          onDownload={handleDownloadPng}
          previewUrl={exportPreview?.url ?? null}
        />
      ) : null}
    </section>
  );
}
