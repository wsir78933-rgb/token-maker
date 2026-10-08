'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  addConstellation,
  addConstellationStar,
  bringConstellationToFront,
  buildConstellationPng,
  clearConstellationObjects,
  createDefaultConstellationProject,
  getConstellationAsset,
  loadConstellationImage,
  loadConstellationSlot,
  parseConstellationProject,
  preloadConstellationProject,
  readConstellationSaveSlots,
  removeConstellationObject,
  removeConstellationBackgroundImage,
  resizeConstellationCanvas,
  saveConstellationSlot,
  serializeConstellationProject,
  setConstellationBackgroundColor,
  setConstellationBackgroundImage,
  setConstellationTransparentBase,
  transformConstellationObject,
} from '@/lib/constellation-map-creator';
import type { ConstellationWorkspaceCopy } from '@/lib/constellation-map-creator/copy-types';
import {
  CONSTELLATION_MAX_FILE_BYTES,
  type ConstellationAssetCategory,
  type ConstellationProject,
  type ConstellationSaveSlot,
  type ConstellationSaveSlots,
  type ConstellationTransform,
} from '@/lib/constellation-map-creator/types';
import { getConstellationMapCopy } from '@/lib/constellation-map-creator/copy';
import type { SiteLocale } from '@/lib/site-locale';

import { ConstellationAssetPanel } from './ConstellationAssetPanel';
import { ConstellationExportPanel } from './ConstellationExportPanel';
import { ConstellationFilePanel } from './ConstellationFilePanel';
import { ConstellationHelpDialog } from './ConstellationHelpDialog';
import { ConstellationMapCreatorCanvas } from './ConstellationMapCreatorCanvas';
import { ConstellationSettingsPanel } from './ConstellationSettingsPanel';
import styles from './ConstellationMapCreatorWorkbench.module.css';

export interface ConstellationMapCreatorWorkbenchProps {
  locale: SiteLocale;
}

type MobilePanel = 'assets' | 'settings' | 'files' | 'export';
const MOBILE_PANELS: readonly MobilePanel[] = ['assets', 'settings', 'files', 'export'];

function replaceCount(template: string, count: number): string {
  return template.replace('{count}', String(count));
}

function replaceNumber(template: string, number: ConstellationSaveSlot): string {
  return template.replace('{number}', String(number));
}

function describeFailure(reason: unknown): string {
  if (reason instanceof Error) return reason.message || `${reason.name} with an empty message.`;
  if (typeof reason === 'string') return reason;
  if (reason === undefined) return 'undefined';
  if (reason === null) return 'null';
  return String(reason);
}

function requireDownloadApi(): typeof URL {
  if (typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
    throw new Error(`Constellation download requires URL.createObjectURL and URL.revokeObjectURL. Received create=${typeof URL.createObjectURL}, revoke=${typeof URL.revokeObjectURL}.`);
  }
  return URL;
}

function downloadBlob(blob: Blob, fileName: string): void {
  if (!(blob instanceof Blob)) {
    throw new Error(`Constellation download requires a Blob. Received ${Object.prototype.toString.call(blob)}.`);
  }
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    throw new Error(`Constellation download requires document.createElement. Received ${typeof document?.createElement}.`);
  }
  const urlApi = requireDownloadApi();
  const objectUrl = urlApi.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    urlApi.revokeObjectURL(objectUrl);
  }
}

function createObjectId(): string {
  if (typeof globalThis.crypto?.randomUUID !== 'function') {
    throw new Error(`Constellation object creation requires crypto.randomUUID. Received ${typeof globalThis.crypto?.randomUUID}.`);
  }
  return globalThis.crypto.randomUUID();
}

function emptySaveSlots(): ConstellationSaveSlots {
  return [null, null, null, null, null];
}

function nextPanelIndex(panel: MobilePanel, key: string): number | null {
  const currentIndex = MOBILE_PANELS.indexOf(panel);
  if (currentIndex < 0) return null;
  if (key === 'ArrowRight' || key === 'ArrowDown') return (currentIndex + 1) % MOBILE_PANELS.length;
  if (key === 'ArrowLeft' || key === 'ArrowUp') return (currentIndex + MOBILE_PANELS.length - 1) % MOBILE_PANELS.length;
  if (key === 'Home') return 0;
  if (key === 'End') return MOBILE_PANELS.length - 1;
  return null;
}

export function ConstellationMapCreatorWorkbench({ locale }: ConstellationMapCreatorWorkbenchProps) {
  const copy: ConstellationWorkspaceCopy = getConstellationMapCopy(locale).workspace;
  const [project, setProject] = useState<ConstellationProject>(() => createDefaultConstellationProject());
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ConstellationAssetCategory>('image');
  const [draggingEnabled, setDraggingEnabled] = useState(true);
  const [resizingEnabled, setResizingEnabled] = useState(true);
  const [slots, setSlots] = useState<ConstellationSaveSlots>(() => emptySaveSlots());
  const [generatedProjectText, setGeneratedProjectText] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel | null>(null);
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const latestProjectRef = useRef(project);
  const exportGenerationRef = useRef(0);
  const previewImageUrlRef = useRef<string | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreMobileFocusRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    try {
      const currentSlots = readConstellationSaveSlots();
      if (!ignore) setSlots(currentSlots);
    } catch (reason) {
      if (!ignore) setActionError(describeFailure(reason));
    }
    return () => { ignore = true; };
  }, []);

  useEffect(() => () => {
    const urlApi = typeof URL.createObjectURL === 'function' && typeof URL.revokeObjectURL === 'function' ? URL : null;
    if (previewImageUrlRef.current !== null && urlApi !== null) urlApi.revokeObjectURL(previewImageUrlRef.current);
  }, []);

  useEffect(() => {
    if (mobilePanel === null) {
      if (restoreMobileFocusRef.current) {
        restoreMobileFocusRef.current = false;
        mobilePanelTriggerRef.current?.focus();
      }
      return undefined;
    }
    mobilePanelRef.current?.querySelector<HTMLElement>('[data-constellation-panel-close="true"]')?.focus();
    return undefined;
  }, [mobilePanel]);

  function invalidateGeneratedOutputs(): void {
    exportGenerationRef.current += 1;
    setGeneratedProjectText(null);
    const currentUrl = previewImageUrlRef.current;
    if (currentUrl !== null) {
      requireDownloadApi().revokeObjectURL(currentUrl);
      previewImageUrlRef.current = null;
      setPreviewImageUrl(null);
    }
  }

  function commitProject(nextProject: ConstellationProject): void {
    latestProjectRef.current = nextProject;
    setProject(nextProject);
    invalidateGeneratedOutputs();
  }

  function reportFailure(reason: unknown): void {
    setActionError(describeFailure(reason));
    setActionStatus(null);
  }

  function reportInteractionError(message: string): void {
    setActionError(message);
    setActionStatus(null);
  }

  function handleSelectObject(objectId: string | null): void {
    if (objectId === null) {
      setSelectedObjectId(null);
      return;
    }
    if (selectedObjectId === objectId) {
      setSelectedObjectId(null);
      return;
    }
    try {
      commitProject(bringConstellationToFront(latestProjectRef.current, objectId));
      setSelectedObjectId(objectId);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleObjectTransform(objectId: string, transform: ConstellationTransform): void {
    try {
      commitProject(transformConstellationObject(latestProjectRef.current, objectId, transform));
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleAddConstellation(assetId: string): void {
    try {
      const asset = getConstellationAsset(assetId);
      const objectId = createObjectId();
      commitProject(addConstellation(latestProjectRef.current, asset.id, objectId));
      setSelectedObjectId(objectId);
      if (mobilePanel !== null) closeMobilePanel();
      setActionStatus(copy.addedObject);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleAddStar(): void {
    try {
      const objectId = createObjectId();
      commitProject(addConstellationStar(latestProjectRef.current, objectId));
      setSelectedObjectId(objectId);
      setActionStatus(copy.addedObject);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleDeleteSelected(): void {
    if (selectedObjectId === null) return;
    try {
      commitProject(removeConstellationObject(latestProjectRef.current, selectedObjectId));
      setSelectedObjectId(null);
      setActionStatus(copy.deletedObject);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleClearObjects(): void {
    try {
      commitProject(clearConstellationObjects(latestProjectRef.current));
      setSelectedObjectId(null);
      setActionStatus(copy.clearedObjects);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleSizeChange(width: number, height: number): void {
    try {
      commitProject(resizeConstellationCanvas(latestProjectRef.current, width, height));
      setActionStatus(copy.settingsApplied);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleColorChange(color: string): void {
    try {
      commitProject(setConstellationBackgroundColor(latestProjectRef.current, color));
      setActionStatus(copy.settingsApplied);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleTransparentBaseChange(transparent: boolean): void {
    try {
      commitProject(setConstellationTransparentBase(latestProjectRef.current, transparent));
      setActionStatus(copy.settingsApplied);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  async function handleApplyBackgroundImage(url: string): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      const image = await loadConstellationImage(url);
      commitProject(setConstellationBackgroundImage(
        latestProjectRef.current,
        url,
        image.naturalWidth,
        image.naturalHeight,
      ));
      setActionStatus(copy.settingsApplied);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
      throw reason;
    } finally {
      setBusy(false);
    }
  }

  function handleRemoveBackgroundImage(): void {
    try {
      commitProject(removeConstellationBackgroundImage(latestProjectRef.current));
      setActionStatus(copy.settingsApplied);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleSaveSlot(slot: ConstellationSaveSlot): void {
    try {
      saveConstellationSlot(slot, latestProjectRef.current);
      setSlots(readConstellationSaveSlots());
      setActionStatus(replaceNumber(copy.savedSlot, slot));
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  async function handleLoadSlot(slot: ConstellationSaveSlot): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      const savedProject = loadConstellationSlot(slot);
      await preloadConstellationProject(savedProject);
      commitProject(savedProject);
      setSelectedObjectId(null);
      setActionStatus(replaceNumber(copy.loadedSlot, slot));
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setBusy(false);
    }
  }

  function handleGenerateProject(): void {
    try {
      const serializedProject = serializeConstellationProject(latestProjectRef.current);
      setGeneratedProjectText(serializedProject);
      setActionStatus(copy.generatedProject);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleDownloadProject(): void {
    if (generatedProjectText === null) {
      reportFailure(new Error(`Constellation project download requires generated project text. Received null.`));
      return;
    }
    try {
      downloadBlob(new Blob([generatedProjectText], { type: 'application/json' }), 'constellation-project.txt');
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleChooseProjectFile(file: File): void {
    if (!(file instanceof File)) {
      reportFailure(new Error(`Constellation project file must be a File. Received ${Object.prototype.toString.call(file)}.`));
      return;
    }
    setSelectedFile(file);
    setActionError(null);
  }

  async function handleLoadProject(): Promise<void> {
    if (selectedFile === null || busy) return;
    setBusy(true);
    try {
      if (selectedFile.size > CONSTELLATION_MAX_FILE_BYTES) {
        throw new Error(`Constellation project file ${JSON.stringify(selectedFile.name)} is ${String(selectedFile.size)} bytes; maximum is ${String(CONSTELLATION_MAX_FILE_BYTES)}.`);
      }
      const parsedProject = parseConstellationProject(await selectedFile.text());
      await preloadConstellationProject(parsedProject);
      commitProject(parsedProject);
      setSelectedObjectId(null);
      setActionStatus(copy.loadedProject);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateImage(): Promise<void> {
    if (busy) return;
    const generation = exportGenerationRef.current;
    const projectAtClick = latestProjectRef.current;
    setBusy(true);
    try {
      const pngBlob = await buildConstellationPng(projectAtClick);
      if (generation !== exportGenerationRef.current) return;
      const urlApi = requireDownloadApi();
      const nextUrl = urlApi.createObjectURL(pngBlob);
      const previousUrl = previewImageUrlRef.current;
      if (previousUrl !== null) urlApi.revokeObjectURL(previousUrl);
      previewImageUrlRef.current = nextUrl;
      setPreviewImageUrl(nextUrl);
      setActionStatus(null);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setBusy(false);
    }
  }

  function handleDownloadImage(): void {
    if (previewImageUrlRef.current === null) {
      reportFailure(new Error(`Constellation image download requires a generated preview. Received null.`));
      return;
    }
    try {
      const anchor = document.createElement('a');
      anchor.href = previewImageUrlRef.current;
      anchor.download = 'constellation-map.png';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function openMobilePanel(panel: MobilePanel, trigger: HTMLButtonElement): void {
    mobilePanelTriggerRef.current = trigger;
    setMobilePanel(panel);
  }

  function closeMobilePanel(): void {
    restoreMobileFocusRef.current = true;
    setMobilePanel(null);
  }

  function handleMobilePanelKeyDown(event: KeyboardEvent<HTMLButtonElement>, panel: MobilePanel): void {
    const nextIndex = nextPanelIndex(panel, event.key);
    if (nextIndex === null) return;
    event.preventDefault();
    const nextPanel = MOBILE_PANELS[nextIndex];
    if (nextPanel === undefined) throw new Error(`Constellation mobile panel is missing at index ${String(nextIndex)}.`);
    openMobilePanel(nextPanel, event.currentTarget);
  }

  function mobilePanelTitle(panel: MobilePanel): string {
    if (panel === 'assets') return copy.assetsTitle;
    if (panel === 'settings') return copy.settingsTitle;
    if (panel === 'files') return copy.filesTitle;
    return copy.exportTitle;
  }

  function renderFeedback(): ReactNode {
    return (
      <>
        {actionError !== null ? <p role="alert" className={styles.alert}>{copy.errorLabel}: {actionError}</p> : null}
        {actionStatus !== null ? <p role="status" aria-live="polite" className={styles.status}>{actionStatus}</p> : null}
      </>
    );
  }

  function renderFiles(): ReactNode {
    return (
      <ConstellationFilePanel
        copy={copy}
        slots={slots}
        generatedProjectText={generatedProjectText}
        selectedFileName={selectedFile?.name ?? null}
        busy={busy}
        onSaveSlot={handleSaveSlot}
        onLoadSlot={(slot) => void handleLoadSlot(slot)}
        onGenerateProject={handleGenerateProject}
        onDownloadProject={handleDownloadProject}
        onChooseProjectFile={handleChooseProjectFile}
        onLoadProject={() => void handleLoadProject()}
      />
    );
  }

  function renderExport(): ReactNode {
    return (
      <ConstellationExportPanel
        copy={copy}
        project={project}
        previewImageUrl={previewImageUrl}
        busy={busy}
        onGenerateImage={handleGenerateImage}
        onDownloadImage={handleDownloadImage}
      />
    );
  }

  function renderMobilePanel(): ReactNode {
    if (mobilePanel === null) return null;
    let content: ReactNode;
    if (mobilePanel === 'assets') {
      content = <ConstellationAssetPanel locale={locale} copy={copy} category={activeCategory} onCategoryChange={setActiveCategory} onAddConstellation={handleAddConstellation} />;
    } else if (mobilePanel === 'settings') {
      content = <ConstellationSettingsPanel copy={copy} width={project.width} height={project.height} background={project.background} backgroundSizeMismatch={project.background.imageWidth !== null && project.background.imageHeight !== null && (project.background.imageWidth !== project.width || project.background.imageHeight !== project.height)} busy={busy} onSizeChange={handleSizeChange} onColorChange={handleColorChange} onTransparentBaseChange={handleTransparentBaseChange} onApplyBackgroundImage={handleApplyBackgroundImage} onRemoveBackgroundImage={handleRemoveBackgroundImage} onClearObjects={handleClearObjects} />;
    } else if (mobilePanel === 'files') {
      content = renderFiles();
    } else {
      content = renderExport();
    }
    return (
      <Dialog open onOpenChange={(open) => { if (!open) closeMobilePanel(); }}>
        <DialogContent ref={mobilePanelRef} id={`constellation-mobile-${mobilePanel}`} data-testid={`constellation-mobile-${mobilePanel}`} className={styles.mobileSheet}>
          <div className={styles.mobileSheetHeader}>
            <DialogTitle className={styles.panelTitle}>{mobilePanelTitle(mobilePanel)}</DialogTitle>
            <button type="button" data-constellation-panel-close="true" aria-label={copy.close} onClick={closeMobilePanel} className={styles.panelCloseButton}>×</button>
          </div>
          <DialogDescription className={mobilePanel === 'files' || mobilePanel === 'export' ? 'shrink-0 px-4 pt-3 text-xs' : 'sr-only'}>{mobilePanel === 'files' ? copy.browserHint : mobilePanel === 'export' ? copy.exportHint : copy.workspaceTitle}</DialogDescription>
          <div className={styles.mobileSheetBody}>
            {renderFeedback()}
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const selectedCount = selectedObjectId === null ? 0 : 1;
  const backgroundSizeMismatch = project.background.imageWidth !== null && project.background.imageHeight !== null && (project.background.imageWidth !== project.width || project.background.imageHeight !== project.height);

  return (
    <section data-testid="constellation-map-creator-workbench" lang={locale} aria-label={copy.workspaceTitle} className={styles.workbench}>
      <header className={styles.workbenchHeader}>
        <div className={styles.headerMain}>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{copy.workspaceTitle}</p>
            <h2 className={styles.headerTitle}>{copy.canvasLabel}</h2>
          </div>
          <div className={styles.fileActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setFilesDialogOpen(true)} disabled={busy}>{copy.filesTitle}</button>
            <button type="button" className={styles.secondaryButton} onClick={() => setExportDialogOpen(true)} disabled={busy}>{copy.exportTitle}</button>
            <button type="button" className={styles.secondaryButton} onClick={() => setHelpDialogOpen(true)} disabled={busy}>{copy.help}</button>
          </div>
        </div>
      </header>

      {renderFeedback()}

      <div className={styles.screenWorkspace}>
        <aside className={`${styles.sidePanel} ${styles.leftPanel}`} aria-label={copy.assetsTitle}>
          <ConstellationAssetPanel locale={locale} copy={copy} category={activeCategory} onCategoryChange={setActiveCategory} onAddConstellation={handleAddConstellation} />
        </aside>

        <section className={styles.canvasPanel} aria-label={copy.canvasLabel}>
          <div className={styles.canvasToolbar}>
            <button type="button" className={styles.secondaryButton} disabled={busy} onClick={handleAddStar}>{copy.addStar}</button>
            <button type="button" className={styles.dangerButton} disabled={busy || selectedObjectId === null} onClick={handleDeleteSelected}>{copy.deleteSelected}</button>
            <label className={styles.toggleLabel}><input type="checkbox" checked={draggingEnabled} disabled={busy} onChange={(event) => setDraggingEnabled(event.currentTarget.checked)} /><span>{copy.dragging}</span></label>
            <label className={styles.toggleLabel}><input type="checkbox" checked={resizingEnabled} disabled={busy} onChange={(event) => setResizingEnabled(event.currentTarget.checked)} /><span>{copy.resizing}</span></label>
            <span className={styles.selectedCount}>{replaceCount(copy.selectedCount, selectedCount)}</span>
          </div>
          <div className={styles.canvasViewport} style={{ aspectRatio: `${String(project.width)} / ${String(project.height)}` }}>
            <ConstellationMapCreatorCanvas
              project={project}
              selectedObjectId={selectedObjectId}
              draggingEnabled={draggingEnabled}
              resizingEnabled={resizingEnabled}
              label={copy.canvasLabel}
              objectLabel={copy.objectLabel}
              resizeLabel={copy.resizeLabel}
              rotateLabel={copy.rotateLabel}
              onSelectObject={handleSelectObject}
              onObjectTransform={handleObjectTransform}
              onInteractionError={reportInteractionError}
            />
          </div>
          <p className={styles.canvasHint}>{copy.canvasHint}</p>
        </section>

        <aside className={`${styles.sidePanel} ${styles.rightPanel}`} aria-label={copy.settingsTitle}>
          <ConstellationSettingsPanel copy={copy} width={project.width} height={project.height} background={project.background} backgroundSizeMismatch={backgroundSizeMismatch} busy={busy} onSizeChange={handleSizeChange} onColorChange={handleColorChange} onTransparentBaseChange={handleTransparentBaseChange} onApplyBackgroundImage={handleApplyBackgroundImage} onRemoveBackgroundImage={handleRemoveBackgroundImage} onClearObjects={handleClearObjects} />
        </aside>
      </div>

      <div className={styles.mobileWorkspace}>
        {renderMobilePanel()}
        <nav className={styles.mobileBottomNav} aria-label={copy.workspaceTitle}>
          {MOBILE_PANELS.map((panel) => {
            const selected = mobilePanel === panel;
            return (
              <button
                key={panel}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={selected}
                aria-controls={selected ? `constellation-mobile-${panel}` : undefined}
                className={styles.mobileTab}
                data-selected={selected ? 'true' : 'false'}
                onClick={(event) => selected ? closeMobilePanel() : openMobilePanel(panel, event.currentTarget)}
                onKeyDown={(event) => handleMobilePanelKeyDown(event, panel)}
              >
                {mobilePanelTitle(panel)}
              </button>
            );
          })}
        </nav>
      </div>

      <Dialog open={filesDialogOpen} onOpenChange={setFilesDialogOpen}>
        <DialogContent className={styles.fileDialog}>
          <DialogTitle>{copy.filesTitle}</DialogTitle>
          <DialogDescription>{copy.browserHint}</DialogDescription>
          {renderFeedback()}
          <DialogClose aria-label={copy.close} className={styles.dialogClose} />
          {renderFiles()}
        </DialogContent>
      </Dialog>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className={styles.imageDialog}>
          <DialogTitle>{copy.exportTitle}</DialogTitle>
          <DialogDescription>{copy.exportHint}</DialogDescription>
          {renderFeedback()}
          <DialogClose aria-label={copy.close} className={styles.dialogClose} />
          {renderExport()}
          <button type="button" className={styles.secondaryButton} onClick={() => setExportDialogOpen(false)}>{copy.backToEditor}</button>
        </DialogContent>
      </Dialog>

      <ConstellationHelpDialog copy={copy} open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </section>
  );
}

export default ConstellationMapCreatorWorkbench;
