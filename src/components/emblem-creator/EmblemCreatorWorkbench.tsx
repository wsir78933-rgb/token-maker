'use client';

import { useId, useReducer, useRef, useState, type KeyboardEvent } from 'react';

import { EmblemAssetPanel } from '@/components/emblem-creator/EmblemAssetPanel';
import { EmblemCanvas } from '@/components/emblem-creator/EmblemCanvas';
import { EmblemDocumentToolbar } from '@/components/emblem-creator/EmblemDocumentToolbar';
import { EmblemLayerPanel } from '@/components/emblem-creator/EmblemLayerPanel';
import { EmblemPropertiesPanel } from '@/components/emblem-creator/EmblemPropertiesPanel';
import { getEmblemCatalogAsset } from '@/lib/emblem-creator/catalog';
import type { EmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { loadEmblemImage } from '@/lib/emblem-creator/image-loading';
import { requireEmblemImageUrl } from '@/lib/emblem-creator/image-url';
import { exportEmblemProjectPng } from '@/lib/emblem-creator/png-export';
import {
  applyEmblemProjectCommand, createDefaultEmblemProject, createEmblemElement,
  getEmblemTargetLayer, parseEmblemProjectJson, serializeEmblemProject,
} from '@/lib/emblem-creator/project';
import {
  EMBLEM_LAYER_ORDER, MAX_EMBLEM_PROJECT_FILE_BYTES,
  type EmblemAssetCategory, type EmblemCatalogAsset, type EmblemElement,
  type EmblemElementTransform, type EmblemLayerId, type EmblemLocale,
  type EmblemProject, type EmblemProjectCommand,
} from '@/lib/emblem-creator/types';

export interface EmblemCreatorWorkbenchProps {
  locale: EmblemLocale;
  copy: EmblemCreatorCopy;
}

type MobilePanel = 'assets' | 'properties' | 'layers';
const mobilePanels: readonly MobilePanel[] = ['assets', 'properties', 'layers'];

interface WorkbenchState {
  project: EmblemProject;
  selectedElementId: string | null;
  activeLayerId: EmblemLayerId;
  error: string | null;
}

type WorkbenchAction =
  | { type: 'command'; command: EmblemProjectCommand; errorPrefix: string }
  | { type: 'add'; element: EmblemElement; layerId: EmblemLayerId; errorPrefix: string }
  | { type: 'replace'; project: EmblemProject }
  | { type: 'select'; elementId: string | null }
  | { type: 'activate-layer'; layerId: EmblemLayerId }
  | { type: 'error'; message: string | null };

function describeError(reason: unknown): string {
  if (reason instanceof Error) return `${reason.name}: ${reason.message}`;
  if (typeof reason === 'object' && reason !== null) {
    // Inspect own fields without invoking getters or serialization hooks on an unknown rejection.
    const fields = Object.entries(Object.getOwnPropertyDescriptors(reason)).map(([key, descriptor]) => {
      if (!('value' in descriptor)) return `${JSON.stringify(key)}: [accessor]`;
      const value: unknown = descriptor.value;
      let description: string;
      if (typeof value === 'string') description = JSON.stringify(value);
      else if (value !== null && (typeof value === 'object' || typeof value === 'function')) description = `[${typeof value}]`;
      else description = String(value);
      return `${JSON.stringify(key)}: ${description}`;
    });
    if (fields.length > 0) return `{${fields.join(', ')}}`;
  }
  return String(reason);
}

function findElement(project: EmblemProject, elementId: string | null): EmblemElement | undefined {
  if (elementId === null) return undefined;
  for (const layerId of EMBLEM_LAYER_ORDER) {
    const element = project.layers[layerId].elements.find((candidate) => candidate.id === elementId);
    if (element) return element;
  }
  return undefined;
}

function reduceWorkbench(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  if (action.type === 'error') return { ...state, error: action.message };
  if (action.type === 'select') return { ...state, selectedElementId: action.elementId };
  if (action.type === 'activate-layer') return { ...state, activeLayerId: action.layerId };
  if (action.type === 'replace') {
    return { project: action.project, selectedElementId: null, activeLayerId: 'body4', error: null };
  }

  try {
    if (action.type === 'add') {
      const withElement = applyEmblemProjectCommand(state.project, {
        type: 'add-element', layerId: action.layerId, element: action.element,
      });
      const project = applyEmblemProjectCommand(withElement, {
        type: 'set-layer-visibility', layerId: action.layerId, visible: true,
      });
      return { project, selectedElementId: action.element.id, activeLayerId: action.layerId, error: null };
    }

    const project = applyEmblemProjectCommand(state.project, action.command);
    const selectedElementId = findElement(project, state.selectedElementId) ? state.selectedElementId : null;
    return { ...state, project, selectedElementId, error: null };
  } catch (reason) {
    return { ...state, error: `${action.errorPrefix}: ${describeError(reason)}` };
  }
}

function downloadFile(blob: Blob, fileName: string): void {
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

function requireCatalogReferences(project: EmblemProject): void {
  for (const layerId of EMBLEM_LAYER_ORDER) {
    for (const element of project.layers[layerId].elements) {
      if (element.source.kind !== 'catalog') continue;
      const source = element.source;
      const asset = getEmblemCatalogAsset(source.assetId);
      if (source.url !== asset.publicPath || source.naturalWidth !== asset.width || source.naturalHeight !== asset.height) {
        throw new Error(`Catalog reference ${JSON.stringify(source.assetId)} has URL ${JSON.stringify(source.url)} and dimensions ${source.naturalWidth}×${source.naturalHeight}; expected ${JSON.stringify(asset.publicPath)} and ${asset.width}×${asset.height}.`);
      }
    }
  }
}

async function preloadProjectImages(project: EmblemProject, errorPrefix: string): Promise<void> {
  const urls = new Set<string>();
  for (const layerId of EMBLEM_LAYER_ORDER) {
    for (const element of project.layers[layerId].elements) urls.add(element.source.url);
  }
  await Promise.all([...urls].map(async (url) => {
    try {
      await loadEmblemImage(url);
    } catch (reason) {
      throw new Error(`${errorPrefix}: ${JSON.stringify(url)} — ${describeError(reason)}`);
    }
  }));
}

async function readProjectFile(file: File): Promise<EmblemProject> {
  if (file.size > MAX_EMBLEM_PROJECT_FILE_BYTES) {
    throw new Error(`Project file ${JSON.stringify(file.name)} is ${file.size} bytes; maximum is ${MAX_EMBLEM_PROJECT_FILE_BYTES} bytes.`);
  }
  const project = parseEmblemProjectJson(await file.text());
  requireCatalogReferences(project);
  return project;
}

export function EmblemCreatorWorkbench({ locale, copy }: EmblemCreatorWorkbenchProps) {
  const workbenchId = useId();
  const [state, reducerDispatch] = useReducer(reduceWorkbench, undefined, () => ({
    project: createDefaultEmblemProject(), selectedElementId: null, activeLayerId: 'body4' as const, error: null,
  }));
  const latestState = useRef(state);
  const [activeCategory, setActiveCategory] = useState<EmblemAssetCategory>('body');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('assets');
  const [showEditBounds, setShowEditBounds] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const operationInProgress = useRef(false);
  const tabButtons = useRef<Partial<Record<MobilePanel, HTMLButtonElement | null>>>({});
  const busy = isLoading || isExporting;

  function dispatch(action: WorkbenchAction) {
    latestState.current = reduceWorkbench(latestState.current, action);
    reducerDispatch(action);
  }

  function applyCommand(command: EmblemProjectCommand) {
    dispatch({ type: 'command', command, errorPrefix: copy.errors.operationFailed });
  }

  function setElementTransform(elementId: string, transform: EmblemElementTransform) {
    applyCommand({ type: 'set-element-transform', elementId, transform });
  }

  function addCatalogAsset(candidate: EmblemCatalogAsset, targetLayerId: EmblemLayerId) {
    try {
      const asset = getEmblemCatalogAsset(candidate.id);
      const expectedLayerId = getEmblemTargetLayer(asset.category, latestState.current.project);
      if (targetLayerId !== expectedLayerId) {
        throw new Error(`Asset ${JSON.stringify(asset.id)} target layer is ${JSON.stringify(targetLayerId)}; current project target is ${JSON.stringify(expectedLayerId)}.`);
      }
      const element = createEmblemElement({
        kind: 'catalog', assetId: asset.id, url: asset.publicPath,
        naturalWidth: asset.width, naturalHeight: asset.height,
      }, crypto.randomUUID());
      dispatch({ type: 'add', element, layerId: targetLayerId, errorPrefix: copy.errors.operationFailed });
    } catch (reason) {
      const prefix = candidate.category === 'body' && reason instanceof RangeError &&
        reason.message.startsWith('No empty body layer is available;')
        ? copy.errors.bodyLayersFull
        : copy.errors.operationFailed;
      dispatch({ type: 'error', message: `${prefix}: ${JSON.stringify(candidate.id)} — ${describeError(reason)}` });
    }
  }

  async function addImageUrl(value: string, category: EmblemAssetCategory, targetLayerId: EmblemLayerId) {
    if (operationInProgress.current) throw new Error(`${copy.errors.operationFailed}: ${copy.loadingLabel}`);
    operationInProgress.current = true;
    setIsLoading(true);
    dispatch({ type: 'error', message: null });
    let errorPrefix = copy.errors.invalidImageUrl;
    try {
      const url = requireEmblemImageUrl(value);
      const initialTargetLayerId = getEmblemTargetLayer(category, latestState.current.project);
      if (targetLayerId !== initialTargetLayerId) {
        throw new Error(`URL target layer is ${JSON.stringify(targetLayerId)}; current project target is ${JSON.stringify(initialTargetLayerId)} before image loading.`);
      }
      errorPrefix = copy.errors.loadImageFailed;
      const image = await loadEmblemImage(url);
      errorPrefix = copy.errors.operationFailed;
      const commitLayerId = getEmblemTargetLayer(category, latestState.current.project);
      const element = createEmblemElement({
        kind: 'url', url, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
      }, crypto.randomUUID());
      dispatch({ type: 'add', element, layerId: commitLayerId, errorPrefix });
    } catch (reason) {
      const prefix = category === 'body' && reason instanceof RangeError &&
        reason.message.startsWith('No empty body layer is available;')
        ? copy.errors.bodyLayersFull
        : errorPrefix;
      const message = `${prefix}: ${JSON.stringify(value)} — ${describeError(reason)}`;
      dispatch({ type: 'error', message });
      // The asset panel also needs rejection to preserve its URL input on failure.
      throw new Error(message);
    } finally {
      operationInProgress.current = false;
      setIsLoading(false);
    }
  }

  async function openProject(file: File) {
    if (operationInProgress.current) {
      dispatch({ type: 'error', message: `${copy.errors.operationFailed}: ${copy.loadingLabel}` });
      return;
    }
    operationInProgress.current = true;
    setIsLoading(true);
    dispatch({ type: 'error', message: null });
    try {
      const project = await readProjectFile(file);
      await preloadProjectImages(project, copy.errors.loadImageFailed);
      dispatch({ type: 'replace', project });
    } catch (reason) {
      dispatch({ type: 'error', message: `${copy.errors.invalidProject}: ${JSON.stringify(file.name)} — ${describeError(reason)}` });
    } finally {
      operationInProgress.current = false;
      setIsLoading(false);
    }
  }

  function saveProject() {
    try {
      const contents = serializeEmblemProject(state.project);
      downloadFile(new Blob([contents], { type: 'application/json' }), 'emblem-project.json');
      dispatch({ type: 'error', message: null });
    } catch (reason) {
      dispatch({ type: 'error', message: `${copy.errors.operationFailed}: emblem-project.json — ${describeError(reason)}` });
    }
  }

  async function exportPng() {
    if (operationInProgress.current) {
      dispatch({ type: 'error', message: `${copy.errors.operationFailed}: ${copy.loadingLabel}` });
      return;
    }
    operationInProgress.current = true;
    setIsExporting(true);
    dispatch({ type: 'error', message: null });
    try {
      const blob = await exportEmblemProjectPng(state.project);
      downloadFile(blob, 'emblem.png');
    } catch (reason) {
      dispatch({ type: 'error', message: `${copy.errors.exportFailed}: ${describeError(reason)}` });
    } finally {
      operationInProgress.current = false;
      setIsExporting(false);
    }
  }

  function movePanelFocus(event: KeyboardEvent<HTMLButtonElement>, panel: MobilePanel) {
    const index = mobilePanels.indexOf(panel);
    let nextIndex: number;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % mobilePanels.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index + mobilePanels.length - 1) % mobilePanels.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = mobilePanels.length - 1;
    else return;
    event.preventDefault();
    const nextPanel = mobilePanels[nextIndex];
    setMobilePanel(nextPanel);
    tabButtons.current[nextPanel]?.focus();
  }

  const panelClass = (panel: MobilePanel) => mobilePanel === panel ? 'min-w-0' : 'hidden min-w-0 lg:block';

  return (
    <section lang={locale} aria-label={copy.editorTitle} aria-busy={busy}
      className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <EmblemDocumentToolbar copy={copy} disabled={busy} isExporting={isExporting}
        onOpenProject={openProject} onSaveProject={saveProject} onExportPng={exportPng} />
      {state.error && <div role="alert" className="m-3 break-words rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <p className="font-semibold">{copy.errorTitle}</p><p className="whitespace-pre-wrap break-all">{state.error}</p>
      </div>}
      {isLoading && <p role="status" className="px-4 pt-3 text-sm text-muted-foreground">{copy.loadingLabel}</p>}
      <div inert={busy} className="grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-[16rem_minmax(0,1fr)_17.5rem]">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <div className="mx-auto w-full max-w-[560px]">
            <EmblemCanvas locale={locale} project={state.project} copy={copy}
              selectedElementId={state.selectedElementId} showEditBounds={showEditBounds}
              onSelectElement={(elementId) => dispatch({ type: 'select', elementId })}
              onElementTransform={setElementTransform} />
          </div>
        </div>
        <div role="tablist" aria-label={copy.editorTitle} className="grid grid-cols-3 gap-1 lg:hidden">
          {mobilePanels.map((panel) => (
            <button key={panel} ref={(button) => { tabButtons.current[panel] = button; }} type="button" role="tab"
              id={`${workbenchId}-tab-${panel}`} aria-controls={`${workbenchId}-panel-${panel}`}
              aria-selected={mobilePanel === panel} tabIndex={mobilePanel === panel ? 0 : -1}
              onClick={() => setMobilePanel(panel)} onKeyDown={(event) => movePanelFocus(event, panel)}
              className="min-w-0 rounded-md border border-border px-2 py-2 text-sm aria-selected:border-primary aria-selected:bg-primary/10">
              {copy.panels[panel]}
            </button>
          ))}
        </div>
        <div id={`${workbenchId}-panel-assets`} role="tabpanel" aria-labelledby={`${workbenchId}-tab-assets`}
          className={`${panelClass('assets')} lg:col-start-1 lg:row-start-1`}>
          <EmblemAssetPanel locale={locale} copy={copy} project={state.project} activeCategory={activeCategory}
            onCategoryChange={setActiveCategory} onAddCatalogAsset={addCatalogAsset} onAddImageUrl={addImageUrl} />
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:col-start-3 lg:row-start-1">
          <div id={`${workbenchId}-panel-properties`} role="tabpanel" aria-labelledby={`${workbenchId}-tab-properties`}
            className={panelClass('properties')}>
            <EmblemPropertiesPanel locale={locale} project={state.project} copy={copy}
              selectedElementId={state.selectedElementId} showEditBounds={showEditBounds}
              onElementTransform={setElementTransform}
              onDeleteSelected={() => {
                if (state.selectedElementId !== null) applyCommand({ type: 'remove-element', elementId: state.selectedElementId });
              }}
              onEditBoundsChange={setShowEditBounds} />
          </div>
          <div id={`${workbenchId}-panel-layers`} role="tabpanel" aria-labelledby={`${workbenchId}-tab-layers`}
            className={panelClass('layers')}>
            <EmblemLayerPanel locale={locale} project={state.project} copy={copy} activeLayerId={state.activeLayerId}
              onActiveLayerChange={(layerId) => dispatch({ type: 'activate-layer', layerId })}
              onVisibilityChange={(layerId, visible) => applyCommand({ type: 'set-layer-visibility', layerId, visible })}
              onClearActiveLayer={() => applyCommand({ type: 'clear-layer', layerId: state.activeLayerId })} />
          </div>
        </div>
      </div>
    </section>
  );
}
