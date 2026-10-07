'use client';

import {
  useEffect,
  useMemo,
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
  addManualPlanet,
  clearManualPlanets,
  createManualSolarSystem,
  createSolarSaveSnapshot,
  deleteSelectedManualPlanet,
  restoreManualSolarSystem,
  setManualDraggingEnabled,
  setManualResizingEnabled,
  setManualStar,
  toggleManualPlanetSelection,
  updateManualPlanetDescription,
  updateManualPlanetTransform,
} from '@/lib/solar-system-creator/manual';
import {
  buildRandomSolarSystemPng,
  buildSolarSystemPng,
} from '@/lib/solar-system-creator/export-image';
import {
  loadSolarSaveSlot,
  readSolarSaveSlots,
  saveSolarSaveSlot,
  type SolarSaveSlot,
  type StorageLike,
} from '@/lib/solar-system-creator/saves';
import {
  createRandomSolarSystem,
  selectRandomPlanet as selectRandomSolarPlanet,
  updateRandomPlanetField,
} from '@/lib/solar-system-creator/random';
import type {
  ManualSolarPlanet,
  ManualSolarSystem,
  RandomSolarPlanet,
  RandomSolarSystem,
  SolarAssetCategory,
  SolarPlanetField,
  SolarPlanetTransform,
  SolarSaveSnapshot,
  SolarStarRange,
  SolarSystemLocale,
} from '@/lib/solar-system-creator/types';
import type { SolarSystemCopy } from '@/lib/solar-system-creator/copy';

import { SolarSystemAssetsPanel } from './SolarSystemAssetsPanel';
import { SolarSystemCanvas } from './SolarSystemCanvas';
import { SolarSystemExportPanel } from './SolarSystemExportPanel';
import { SolarSystemFilePanel } from './SolarSystemFilePanel';
import { SolarSystemPlanetDetailsPanel } from './SolarSystemPlanetDetailsPanel';
import { SolarSystemPrintDetails } from './SolarSystemPrintDetails';
import { SolarSystemRandomSettingsPanel } from './SolarSystemRandomSettingsPanel';

import styles from './SolarSystemCreatorWorkbench.module.css';

export interface SolarSystemCreatorWorkbenchProps {
  locale: SolarSystemLocale;
  copy: SolarSystemCopy;
}

type WorkbenchMode = 'random' | 'manual';
type MobilePanel = 'settings' | 'assets' | 'details' | 'files' | 'export';

const RANDOM_MOBILE_PANELS: readonly MobilePanel[] = ['settings', 'details', 'export'];
const MANUAL_MOBILE_PANELS: readonly MobilePanel[] = ['assets', 'details', 'files', 'export'];
const SAVE_SLOT_NUMBERS: readonly SolarSaveSlot[] = [1, 2, 3, 4, 5];

function formatPlanetLabel(template: string, index: number): string {
  return template.replaceAll('{number}', String(index));
}

function describeFailure(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message.length > 0 ? reason.message : `${reason.name} with an empty message.`;
  }

  if (typeof reason === 'string' && reason.length > 0) return reason;
  if (reason === undefined) return 'undefined';
  if (reason === null) return 'null';

  try {
    const serializedReason = JSON.stringify(reason);
    return typeof serializedReason === 'string'
      ? serializedReason
      : Object.prototype.toString.call(reason);
  } catch (serializationError: unknown) {
    if (serializationError instanceof Error && serializationError.message.length > 0) {
      return `${Object.prototype.toString.call(reason)} (JSON serialization failed: ${serializationError.message})`;
    }

    return Object.prototype.toString.call(reason);
  }
}

function requireBrowserStorage(): StorageLike {
  if (typeof window === 'undefined') {
    throw new Error('Solar save storage is unavailable outside a browser. Received window undefined.');
  }

  const browserStorage = window.localStorage;
  if (browserStorage === undefined || browserStorage === null) {
    throw new Error(
      `Solar save storage is unavailable. Received ${browserStorage === undefined ? 'undefined' : 'null'}.`,
    );
  }

  return browserStorage;
}

function createEmptyOccupiedSlots(): boolean[] {
  return SAVE_SLOT_NUMBERS.map(() => false);
}

function occupiedSlotsFromSnapshots(snapshots: readonly (SolarSaveSnapshot | null)[]): boolean[] {
  if (snapshots.length !== SAVE_SLOT_NUMBERS.length) {
    throw new Error(
      `Solar save slot read returned ${snapshots.length} entries; expected ${SAVE_SLOT_NUMBERS.length}.`,
    );
  }

  return snapshots.map((snapshot) => snapshot !== null);
}

function nextManualPlanetId(planets: readonly ManualSolarPlanet[]): string {
  const usedIds = new Set(planets.map((planet) => planet.id));
  let candidateNumber = 1;
  while (usedIds.has(`planet-${candidateNumber}`)) candidateNumber += 1;
  return `planet-${candidateNumber}`;
}

function nextPanelIndex(panel: MobilePanel, panels: readonly MobilePanel[], key: string): number | null {
  const currentIndex = panels.indexOf(panel);
  if (currentIndex < 0) return null;
  if (key === 'ArrowRight' || key === 'ArrowDown') return (currentIndex + 1) % panels.length;
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return (currentIndex + panels.length - 1) % panels.length;
  }
  if (key === 'Home') return 0;
  if (key === 'End') return panels.length - 1;
  return null;
}

function isNarrowSolarViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

function imageObjectUrl(blob: Blob): string {
  if (!(blob instanceof Blob)) {
    throw new Error(`Solar PNG builder returned a non-Blob value. Received ${Object.prototype.toString.call(blob)}.`);
  }

  if (typeof URL.createObjectURL !== 'function') {
    throw new Error('Solar image preview requires URL.createObjectURL. Received undefined.');
  }

  const objectUrl = URL.createObjectURL(blob);
  if (typeof objectUrl !== 'string' || objectUrl.length === 0) {
    throw new Error(`Solar image preview URL must be a non-empty string. Received ${JSON.stringify(objectUrl)}.`);
  }

  return objectUrl;
}

export function SolarSystemCreatorWorkbench({
  locale,
  copy,
}: SolarSystemCreatorWorkbenchProps) {
  const [mode, setMode] = useState<WorkbenchMode>('random');
  const [randomOptions, setRandomOptions] = useState({
    starRange: 'normal' as SolarStarRange,
    requestedPlanetCount: null as number | null,
  });
  const [randomSystem, setRandomSystem] = useState<RandomSolarSystem | null>(null);
  const [manualSystem, setManualSystem] = useState<ManualSolarSystem>(() => createManualSolarSystem());
  const [activeAssetCategory, setActiveAssetCategory] = useState<SolarAssetCategory>('type-1');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel | null>('settings');
  const [occupiedSlots, setOccupiedSlots] = useState<boolean[]>(() => createEmptyOccupiedSlots());
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [desktopFileDialogOpen, setDesktopFileDialogOpen] = useState(false);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);
  const mobilePanelRef = useRef<HTMLElement | null>(null);
  const mobilePanelTriggerRef = useRef<HTMLButtonElement | null>(null);
  const focusPanelOnOpenRef = useRef(false);
  const restoreMobileFocusRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setRandomSystem(
      createRandomSolarSystem(
        { starRange: 'normal', requestedPlanetCount: null },
        locale,
      ),
    );
    setActionError(null);
  }, [locale]);

  useEffect(() => {
    return () => {
      if (imageUrl !== null && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (mobilePanel === null) {
      if (restoreMobileFocusRef.current) {
        restoreMobileFocusRef.current = false;
        mobilePanelTriggerRef.current?.focus();
      }
      return;
    }

    if (focusPanelOnOpenRef.current) {
      focusPanelOnOpenRef.current = false;
      const closeButton = mobilePanelRef.current?.querySelector<HTMLElement>('[data-solar-panel-close="true"]');
      closeButton?.focus();
    }
  }, [mobilePanel]);

  useEffect(() => {
    if (mobilePanel === null) return undefined;

    function closeOnEscape(event: globalThis.KeyboardEvent): void {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      restoreMobileFocusRef.current = true;
      setMobilePanel(null);
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobilePanel]);

  const selectedRandomPlanet = useMemo(() => {
    if (randomSystem === null || randomSystem.selectedPlanetId === null) return undefined;
    return randomSystem.planets.find((planet) => planet.id === randomSystem.selectedPlanetId);
  }, [randomSystem]);

  const selectedManualPlanet = useMemo(() => {
    if (manualSystem.selectedPlanetId === null) return undefined;
    return manualSystem.planets.find((planet) => planet.id === manualSystem.selectedPlanetId);
  }, [manualSystem]);

  const canvasLabel = copy.canvasLabel;
  const helpTitle = copy.helpTitle;
  const closeLabel = copy.close;
  const detailsTitle = copy.detailsTitle;
  const settingsTitle = copy.settingsTitle;
  const assetsTitle = copy.assetsTitle;
  const filesTitle = copy.filesTitle;
  const exportTitle = copy.exportTitle;
  const imageGenerateLabel = copy.imageGenerate;
  const imageSaveHint = copy.imageSaveHint;
  const resizePlanetLabel = copy.resizePlanetLabel;
  const printLabel = copy.print;
  const randomModeLabel = copy.randomMode;
  const manualModeLabel = copy.manualMode;
  const draggingLabel = copy.dragging;
  const resizingLabel = copy.resizing;
  const clearAllLabel = copy.clearAll;
  const saveStatusLabel = copy.saved;
  const loadStatusLabel = copy.loaded;
  const operationErrorLabel = copy.errorLabel;
  const helpSteps = copy.helpSteps;

  function reportFailure(prefix: string, reason: unknown): void {
    if (!(reason instanceof Error)) throw reason;
    setActionStatus(null);
    setActionError(`${prefix} ${describeFailure(reason)}`);
  }

  function acquireBusy(): boolean {
    if (busyRef.current) {
      reportFailure(operationErrorLabel, new Error('Another solar system operation is already in progress.'));
      return false;
    }

    busyRef.current = true;
    setBusy(true);
    setActionError(null);
    setActionStatus(null);
    return true;
  }

  function releaseBusy(): void {
    busyRef.current = false;
    setBusy(false);
  }

  function refreshOccupiedSlots(): void {
    try {
      const snapshots = readSolarSaveSlots(requireBrowserStorage());
      setOccupiedSlots(occupiedSlotsFromSnapshots(snapshots));
      setActionError(null);
    } catch (reason: unknown) {
      reportFailure(operationErrorLabel, reason);
    }
  }

  function regenerateRandom(): void {
    const generatedSystem = createRandomSolarSystem(randomOptions, locale);
    setRandomSystem(generatedSystem);
    setActionError(null);
    setActionStatus(null);
  }

  function handleRandomStarRangeChange(starRange: SolarStarRange): void {
    setRandomOptions((currentOptions) => ({ ...currentOptions, starRange }));
    setActionError(null);
  }

  function handleRandomPlanetCountChange(requestedPlanetCount: number | null): void {
    setRandomOptions((currentOptions) => ({ ...currentOptions, requestedPlanetCount }));
    setActionError(null);
  }

  function handleRandomSelection(planetId: string | null): void {
    if (randomSystem === null) return;
    const nextSystem = selectRandomSolarPlanet(randomSystem, planetId);
    setRandomSystem(nextSystem);
    if (planetId !== null && nextSystem.selectedPlanetId === planetId) {
      openMobileDetailsForSelection();
    }
    setActionError(null);
  }

  function handleRandomFieldChange(field: SolarPlanetField, value: string): void {
    if (randomSystem === null || randomSystem.selectedPlanetId === null) return;
    setRandomSystem(
      updateRandomPlanetField(randomSystem, randomSystem.selectedPlanetId, field, value),
    );
    setActionError(null);
  }

  function handleManualAssetChoice(assetId: string): void {
    if (activeAssetCategory === 'star') {
      setManualSystem(setManualStar(manualSystem, assetId));
    } else {
      setManualSystem(addManualPlanet(manualSystem, assetId, nextManualPlanetId(manualSystem.planets)));
    }
    setActionError(null);
  }

  function handleManualSelection(planetId: string | null): void {
    if (planetId === null) {
      setManualSystem((currentSystem) => ({ ...currentSystem, selectedPlanetId: null }));
      return;
    }

    const nextSystem = toggleManualPlanetSelection(manualSystem, planetId);
    setManualSystem(nextSystem);
    if (nextSystem.selectedPlanetId === planetId) {
      openMobileDetailsForSelection();
    }
    setActionError(null);
  }

  function handleManualTransform(planetId: string, transform: SolarPlanetTransform): void {
    setManualSystem(updateManualPlanetTransform(manualSystem, planetId, transform));
    setActionError(null);
  }

  function handleManualDescriptionChange(description: string): void {
    if (manualSystem.selectedPlanetId === null) return;
    setManualSystem(
      updateManualPlanetDescription(manualSystem, manualSystem.selectedPlanetId, description),
    );
    setActionError(null);
  }

  function handleManualDelete(): void {
    setManualSystem(deleteSelectedManualPlanet(manualSystem));
    setActionError(null);
  }

  function handleManualClearAll(): void {
    setManualSystem(clearManualPlanets(manualSystem));
    setActionError(null);
  }

  function handleDraggingChange(enabled: boolean): void {
    setManualSystem(setManualDraggingEnabled(manualSystem, enabled));
    setActionError(null);
  }

  function handleResizingChange(enabled: boolean): void {
    setManualSystem(setManualResizingEnabled(manualSystem, enabled));
    setActionError(null);
  }

  function handleSaveSlot(slotNumber: SolarSaveSlot): void {
    if (!acquireBusy()) return;
    try {
      const snapshot = createSolarSaveSnapshot(manualSystem);
      const browserStorage = requireBrowserStorage();
      saveSolarSaveSlot(browserStorage, slotNumber, snapshot);
      setOccupiedSlots(occupiedSlotsFromSnapshots(readSolarSaveSlots(browserStorage)));
      setActionStatus(`${saveStatusLabel} ${slotNumber}`);
      setActionError(null);
    } catch (reason: unknown) {
      reportFailure(operationErrorLabel, reason);
    } finally {
      releaseBusy();
    }
  }

  function handleLoadSlot(slotNumber: SolarSaveSlot): void {
    if (!acquireBusy()) return;
    try {
      const snapshot = loadSolarSaveSlot(requireBrowserStorage(), slotNumber);
      if (snapshot === null) {
        throw new Error(`Solar save slot ${slotNumber} is empty. Received null.`);
      }

      setManualSystem(restoreManualSolarSystem(snapshot));
      setActionStatus(`${loadStatusLabel} ${slotNumber}`);
      setActionError(null);
    } catch (reason: unknown) {
      reportFailure(operationErrorLabel, reason);
    } finally {
      releaseBusy();
    }
  }

  async function handleGenerateImage(): Promise<void> {
    if (!acquireBusy()) return;
    const requestedMode = mode;
    try {
      let generatedPng: Blob;
      if (requestedMode === 'random') {
        if (randomSystem === null) {
          throw new Error('Random solar system is not ready for image export. Received null.');
        }
        generatedPng = await buildRandomSolarSystemPng(randomSystem);
      } else {
        generatedPng = await buildSolarSystemPng(createSolarSaveSnapshot(manualSystem));
      }
      if (!mountedRef.current) return;
      const nextImageUrl = imageObjectUrl(generatedPng);
      if (requestedMode === 'manual') {
        setManualSystem((currentSystem) => ({ ...currentSystem, selectedPlanetId: null }));
      }
      setImageUrl(nextImageUrl);
      setActionError(null);
      setActionStatus(null);
    } catch (reason: unknown) {
      reportFailure(operationErrorLabel, reason);
    } finally {
      releaseBusy();
    }
  }

  function handlePrint(): void {
    try {
      if (typeof window === 'undefined' || typeof window.print !== 'function') {
        throw new Error(`Solar print requires window.print. Received ${typeof window?.print}.`);
      }
      if (mode === 'random' && randomSystem === null) {
        throw new Error('Random solar system is not ready for print. Received null.');
      }

      setActionError(null);
      window.print();
    } catch (reason: unknown) {
      reportFailure(operationErrorLabel, reason);
    }
  }

  function openDesktopFiles(): void {
    refreshOccupiedSlots();
    setDesktopFileDialogOpen(true);
  }

  function openMobilePanel(
    panel: MobilePanel,
    trigger: HTMLButtonElement,
    focusCloseOnOpen = true,
  ): void {
    mobilePanelTriggerRef.current = trigger;
    focusPanelOnOpenRef.current = focusCloseOnOpen;
    restoreMobileFocusRef.current = false;
    setMobilePanel(panel);
    if (panel === 'files') refreshOccupiedSlots();
  }

  function openMobileDetailsForSelection(): void {
    if (!isNarrowSolarViewport() || mobilePanel === 'details') return;

    const detailsTrigger = document.getElementById('solar-system-mobile-tab-details');
    if (!(detailsTrigger instanceof HTMLButtonElement)) {
      throw new Error('Solar mobile details tab trigger is unavailable after a narrow viewport selection.');
    }

    openMobilePanel('details', detailsTrigger);
  }

  function closeMobilePanel(): void {
    focusPanelOnOpenRef.current = false;
    restoreMobileFocusRef.current = true;
    setMobilePanel(null);
  }

  function handleModeChange(nextMode: WorkbenchMode): void {
    mobilePanelTriggerRef.current = null;
    focusPanelOnOpenRef.current = false;
    restoreMobileFocusRef.current = false;
    setMode(nextMode);
    setMobilePanel(nextMode === 'random' ? 'settings' : null);
    setActionError(null);
    setActionStatus(null);
  }

  function handleModeTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentMode: WorkbenchMode,
  ): void {
    const modeOrder: readonly WorkbenchMode[] = ['random', 'manual'];
    const currentIndex = modeOrder.indexOf(currentMode);
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % modeOrder.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex + modeOrder.length - 1) % modeOrder.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = modeOrder.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextMode = modeOrder[nextIndex];
    if (nextMode === undefined) return;
    handleModeChange(nextMode);
    document.getElementById(`solar-system-mode-tab-${nextMode}`)?.focus();
  }

  function handleMobileTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    panel: MobilePanel,
    panels: readonly MobilePanel[],
  ): void {
    const nextIndex = nextPanelIndex(panel, panels, event.key);
    if (nextIndex === null) return;
    event.preventDefault();
    const nextPanel = panels[nextIndex];
    if (nextPanel === undefined) return;
    const nextTrigger = document.getElementById(`solar-system-mobile-tab-${nextPanel}`);
    if (!(nextTrigger instanceof HTMLButtonElement)) {
      throw new Error(`Solar mobile tab trigger is unavailable for ${JSON.stringify(nextPanel)}.`);
    }
    openMobilePanel(nextPanel, nextTrigger, false);
    nextTrigger.focus();
  }

  function panelTitle(panel: MobilePanel): string {
    if (panel === 'settings') return settingsTitle;
    if (panel === 'assets') return assetsTitle;
    if (panel === 'files') return filesTitle;
    if (panel === 'export') return exportTitle;
    return detailsTitle;
  }

  function planetLabel(index: number): string {
    return formatPlanetLabel(copy.planetLabel, index + 1);
  }

  function resizeLabel(index: number): string {
    return formatPlanetLabel(resizePlanetLabel, index + 1);
  }

  function renderRandomSettings(): ReactNode {
    return (
      <SolarSystemRandomSettingsPanel
        copy={copy}
        starRange={randomOptions.starRange}
        requestedPlanetCount={randomOptions.requestedPlanetCount}
        onStarRangeChange={handleRandomStarRangeChange}
        onPlanetCountChange={handleRandomPlanetCountChange}
        onRegenerate={regenerateRandom}
      />
    );
  }

  function renderAssets(): ReactNode {
    return (
      <SolarSystemAssetsPanel
        copy={copy}
        category={activeAssetCategory}
        onCategoryChange={setActiveAssetCategory}
        onChooseAsset={handleManualAssetChoice}
      />
    );
  }

  function renderDetails(): ReactNode {
    return (
      <SolarSystemPlanetDetailsPanel
        copy={copy}
        mode={mode}
        randomPlanet={selectedRandomPlanet}
        manualPlanet={selectedManualPlanet}
        onRandomFieldChange={handleRandomFieldChange}
        onDescriptionChange={handleManualDescriptionChange}
        onDeleteSelected={handleManualDelete}
      />
    );
  }

  function renderFiles(): ReactNode {
    return (
      <SolarSystemFilePanel
        copy={copy}
        occupiedSlots={occupiedSlots}
        onSave={handleSaveSlot}
        onLoad={handleLoadSlot}
        busy={busy}
      />
    );
  }

  function renderExport(): ReactNode {
    return (
      <SolarSystemExportPanel
        copy={copy}
        mode={mode}
        onGenerateImage={() => void handleGenerateImage()}
        onPrint={handlePrint}
        busy={busy}
      />
    );
  }

  const displayedPlanets: readonly (RandomSolarPlanet | ManualSolarPlanet)[] =
    mode === 'random' ? randomSystem?.planets ?? [] : manualSystem.planets;
  const displayedStarAssetId = mode === 'random' ? randomSystem?.starAssetId ?? null : manualSystem.starAssetId;
  const mobilePanels = mode === 'random' ? RANDOM_MOBILE_PANELS : MANUAL_MOBILE_PANELS;
  const activeMobilePanel = mobilePanel !== null && mobilePanels.includes(mobilePanel)
    ? mobilePanel
    : null;

  function renderActiveMobilePanel(): ReactNode {
    const activePanel = activeMobilePanel;
    const panelIsHidden = activePanel === null;

    let content: ReactNode;
    if (activePanel === 'settings') content = renderRandomSettings();
    else if (activePanel === 'assets') content = renderAssets();
    else if (activePanel === 'details') content = renderDetails();
    else if (activePanel === 'files') content = renderFiles();
    else if (activePanel === 'export') content = renderExport();
    else content = null;

    return (
      <section
        ref={mobilePanelRef}
        id="solar-system-mobile-panel"
        className={styles.mobilePanel}
        role="tabpanel"
        aria-labelledby={activePanel === null ? undefined : `solar-system-mobile-tab-${activePanel}`}
        hidden={panelIsHidden}
      >
        {activePanel === null ? null : (
          <>
            <div className={styles.mobilePanelHeader}>
              <h2 className={styles.panelTitle}>{panelTitle(activePanel)}</h2>
              <button
                type="button"
                className={styles.panelCloseButton}
                data-solar-panel-close="true"
                aria-label={closeLabel}
                onClick={closeMobilePanel}
              >
                ×
              </button>
            </div>
            <div className={styles.mobilePanelBody}>{content}</div>
          </>
        )}
      </section>
    );
  }

  return (
    <section
      className={styles.workbench}
      lang={locale}
      aria-label={copy.heading}
      data-testid="solar-system-creator-workbench"
    >
      <div className={styles.workbenchHeader} data-solar-print-hidden="true">
        <div className={styles.headerMain}>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{copy.navigationTitle}</p>
            <details className={styles.helpDetails}>
              <summary>{helpTitle}</summary>
              {helpSteps.length > 0 ? (
                <ol className={styles.helpSteps}>
                  {helpSteps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}
                </ol>
              ) : null}
            </details>
          </div>

          <div className={styles.fileActions}>
            {mode === 'manual' ? (
              <>
                <button type="button" className={styles.secondaryButton} onClick={openDesktopFiles} disabled={busy}>
                  {filesTitle}
                </button>
                <button type="button" className={styles.secondaryButton} onClick={() => void handleGenerateImage()} disabled={busy}>
                  {imageGenerateLabel}
                </button>
                <button type="button" className={styles.secondaryButton} onClick={handlePrint} disabled={busy}>
                  {printLabel}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => void handleGenerateImage()}
                  disabled={busy || randomSystem === null}
                >
                  {imageGenerateLabel}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handlePrint}
                  disabled={busy || randomSystem === null}
                >
                  {printLabel}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.modeTabs} role="tablist" aria-label={copy.heading}>
          <button
            type="button"
            role="tab"
            id="solar-system-mode-tab-random"
            aria-selected={mode === 'random'}
            aria-controls="solar-system-mode-panel"
            tabIndex={mode === 'random' ? 0 : -1}
            className={styles.modeTab}
            data-selected={mode === 'random' ? 'true' : 'false'}
            onClick={() => handleModeChange('random')}
            onKeyDown={(event) => handleModeTabKeyDown(event, 'random')}
          >
            {randomModeLabel}
          </button>
          <button
            type="button"
            role="tab"
            id="solar-system-mode-tab-manual"
            aria-selected={mode === 'manual'}
            aria-controls="solar-system-mode-panel"
            tabIndex={mode === 'manual' ? 0 : -1}
            className={styles.modeTab}
            data-selected={mode === 'manual' ? 'true' : 'false'}
            onClick={() => handleModeChange('manual')}
            onKeyDown={(event) => handleModeTabKeyDown(event, 'manual')}
          >
            {manualModeLabel}
          </button>
        </div>
      </div>

      {actionError !== null && !desktopFileDialogOpen ? (
        <p className={styles.alert} role="alert" data-solar-print-hidden="true">{actionError}</p>
      ) : null}
      {actionStatus !== null ? (
        <p className={styles.status} role="status" aria-live="polite" data-solar-print-hidden="true">{actionStatus}</p>
      ) : null}

      <div
        id="solar-system-mode-panel"
        className={styles.screenWorkspace}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`solar-system-mode-tab-${mode}`}
        data-solar-print-hidden="true"
      >
        <aside className={`${styles.sidePanel} ${styles.leftPanel}`} aria-label={mode === 'random' ? settingsTitle : assetsTitle}>
          {mode === 'random' ? renderRandomSettings() : renderAssets()}
        </aside>

        <section className={styles.canvasPanel} aria-label={canvasLabel}>
          <h2 className={styles.panelTitle}>{canvasLabel}</h2>
          <div className={styles.canvasViewport}>
            <SolarSystemCanvas
              starAssetId={displayedStarAssetId}
              planets={displayedPlanets}
              selectedPlanetId={mode === 'random' ? randomSystem?.selectedPlanetId ?? null : manualSystem.selectedPlanetId}
              interactive
              draggingEnabled={mode === 'manual' && manualSystem.draggingEnabled}
              resizingEnabled={mode === 'manual' && manualSystem.resizingEnabled}
              label={canvasLabel}
              planetLabel={planetLabel}
              resizeLabel={resizeLabel}
              onSelectPlanet={mode === 'random' ? handleRandomSelection : handleManualSelection}
              onPlanetTransform={mode === 'manual' ? handleManualTransform : undefined}
            />
          </div>

          {mode === 'manual' ? (
            <div className={styles.manualCanvasControls}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={manualSystem.draggingEnabled}
                  onChange={(event) => handleDraggingChange(event.currentTarget.checked)}
                />
                <span>{draggingLabel}</span>
              </label>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={manualSystem.resizingEnabled}
                  onChange={(event) => handleResizingChange(event.currentTarget.checked)}
                />
                <span>{resizingLabel}</span>
              </label>
              <button type="button" className={styles.dangerButton} onClick={handleManualClearAll} disabled={busy}>
                {clearAllLabel}
              </button>
            </div>
          ) : null}
        </section>

        <aside className={`${styles.sidePanel} ${styles.rightPanel}`} aria-label={detailsTitle}>
          {renderDetails()}
        </aside>
      </div>

      {mode === 'manual' ? (
        <p className={styles.imageHint} data-solar-print-hidden="true">{imageSaveHint}</p>
      ) : null}

      <div className={styles.mobileWorkspace} data-mobile-panel={activeMobilePanel ?? ''}>
        {renderActiveMobilePanel()}
        <nav
          className={styles.mobileBottomNav}
          data-panel-count={mobilePanels.length}
          role="tablist"
          aria-label={copy.heading}
        >
          {mobilePanels.map((panel) => {
            const panelButtonLabel = panelTitle(panel);
            const selected = mobilePanel === panel;
            return (
              <button
                key={panel}
                id={`solar-system-mobile-tab-${panel}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="solar-system-mobile-panel"
                tabIndex={selected || (mobilePanel === null && panel === mobilePanels[0]) ? 0 : -1}
                className={styles.mobileTab}
                data-selected={selected ? 'true' : 'false'}
                onClick={(event) => {
                  if (selected) closeMobilePanel();
                  else openMobilePanel(panel, event.currentTarget);
                }}
                onKeyDown={(event) => handleMobileTabKeyDown(event, panel, mobilePanels)}
              >
                {panelButtonLabel}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={styles.printArea}>
        <h2>{copy.heading}</h2>
        <SolarSystemCanvas
          starAssetId={displayedStarAssetId}
          planets={displayedPlanets}
          selectedPlanetId={null}
          interactive={false}
          draggingEnabled={false}
          resizingEnabled={false}
          label={canvasLabel}
          planetLabel={planetLabel}
          resizeLabel={resizeLabel}
          onSelectPlanet={() => undefined}
        />
        <div className={styles.printDescriptions}>
          {mode === 'random' ? (
            <SolarSystemPrintDetails
              copy={copy}
              mode="random"
              planets={randomSystem?.planets ?? []}
            />
          ) : (
            <SolarSystemPrintDetails
              copy={copy}
              mode="manual"
              planets={manualSystem.planets}
            />
          )}
        </div>
      </div>

      <Dialog open={desktopFileDialogOpen} onOpenChange={setDesktopFileDialogOpen}>
        <DialogContent className={styles.fileDialog}>
          <DialogTitle>{filesTitle}</DialogTitle>
          <DialogDescription>{copy.localSaveHint}</DialogDescription>
          {actionError !== null ? (
            <p className={styles.alert} role="alert">{actionError}</p>
          ) : null}
          <DialogClose
            className={styles.dialogClose}
            aria-label={closeLabel}
          />
          {renderFiles()}
        </DialogContent>
      </Dialog>

      <Dialog open={imageUrl !== null} onOpenChange={(open) => { if (!open) setImageUrl(null); }}>
        <DialogContent className={styles.imageDialog}>
          <DialogTitle>{copy.imageTitle}</DialogTitle>
          <DialogDescription>{imageSaveHint}</DialogDescription>
          <DialogClose
            className={styles.dialogClose}
            aria-label={closeLabel}
            onClick={() => setImageUrl(null)}
          />
          {imageUrl !== null ? (
            // A native image keeps the browser's save and long-press actions available.
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.generatedImage} src={imageUrl} alt={copy.imageTitle} />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default SolarSystemCreatorWorkbench;
