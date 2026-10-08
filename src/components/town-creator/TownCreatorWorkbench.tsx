'use client';

import { useRef, useState, type KeyboardEvent } from 'react';

import { TownExportDialog } from './TownExportDialog';
import { TownHelpDialog } from './TownHelpDialog';
import { TownSaveDialog } from './TownSaveDialog';
import { TownCanvas } from './TownCanvas';
import { TownAssetLibrary } from './TownAssetLibrary';
import { TownObjectPanel } from './TownObjectPanel';
import { TownSettingsPanel } from './TownSettingsPanel';
import type { SiteLocale } from '@/lib/site-locale';
import { getTownCreatorCopy } from '@/lib/town-creator/copy';
import {
  TOWN_ASSETS,
  getTownAsset,
} from '@/lib/town-creator/catalog';
import {
  addTownObject,
  clearTownLayer,
  clearTownObjects,
  copyTownObject,
  createTownDocument,
  deleteTownObject,
  resizeTownCanvas,
  selectTownObject,
  setTownActiveLayer,
  setTownBackground,
  setTownLayerVisibility,
  updateTownObject,
  TOWN_DEFAULT_CANVAS_HEIGHT,
} from '@/lib/town-creator/document';
import type {
  TownAsset,
  TownDocument,
  TownLayerId,
  TownMaterial,
  TownObjectPatch,
} from '@/lib/town-creator/types';

import styles from './TownCreatorWorkbench.module.css';

const DEFAULT_TOWN_HEIGHT = TOWN_DEFAULT_CANVAS_HEIGHT;

const COPY = {
  en: {
    product: 'Town Creator',
    eyebrow: 'Fantasy town builder',
    project: 'Project',
    save: 'Save',
    output: 'Output',
    help: 'Help',
    collapseAssets: 'Collapse asset library',
    expandAssets: 'Expand asset library',
    collapseObject: 'Collapse object panel',
    expandObject: 'Expand object panel',
    assets: 'Assets',
    object: 'Object',
    layers: 'Layers',
    canvas: 'Canvas',
    controls: 'Quick controls',
    snap: 'Snap 5 px',
    resizeHandles: 'Resize handles',
    added: 'Added to active layer.',
    backgroundLoading: 'Loading background image…',
    backgroundLoaded: 'Background applied.',
    backgroundFailed: 'Background image could not be loaded',
    widthFitFailed: 'Display container has no measurable width.',
    invalidSelection: 'Select an object in the active visible layer first.',
    hiddenLayer: (layer: string) => `The active layer “${layer}” is hidden. Show it before adding an asset.`,
    error: 'Error',
    canvasSize: 'Canvas',
    activeLayer: 'Editing',
    materials: {
      wood: 'Wood',
      stone: 'Stone',
      clay: 'Clay',
      sandstone: 'Sandstone',
    },
    layerNames: { lower: 'Lower', middle: 'Middle', upper: 'Upper' },
  },
  zh: {
    product: '城镇创建器',
    eyebrow: '幻想城镇搭建',
    project: '项目',
    save: '保存',
    output: '输出',
    help: '帮助',
    collapseAssets: '收起素材库',
    expandAssets: '展开素材库',
    collapseObject: '收起对象面板',
    expandObject: '展开对象面板',
    assets: '素材',
    object: '对象',
    layers: '图层',
    canvas: '画布',
    controls: '常用控制',
    snap: '吸附 5 px',
    resizeHandles: '调整手柄',
    added: '已添加到当前图层。',
    backgroundLoading: '正在加载背景图片……',
    backgroundLoaded: '背景已应用。',
    backgroundFailed: '背景图片加载失败',
    widthFitFailed: '显示容器没有可测量的宽度。',
    invalidSelection: '请先选择当前可见图层中的对象。',
    hiddenLayer: (layer: string) => `当前图层“${layer}”已隐藏，请先显示后再添加素材。`,
    error: '错误',
    canvasSize: '画布',
    activeLayer: '编辑',
    materials: {
      wood: '木材',
      stone: '石材',
      clay: '陶土',
      sandstone: '砂岩',
    },
    layerNames: { lower: '下层', middle: '中层', upper: '上层' },
  },
} as const;

type TownPanelId = 'none' | 'assets' | 'object' | 'layers' | 'canvas';
type TownDialogId = 'save' | 'export' | 'help';

function createTownObjectId(document: TownDocument): string {
  const existingIds = new Set(document.layers.flatMap((layer) => layer.objects.map((object) => object.id)));
  const randomUuid = globalThis.crypto?.randomUUID;
  if (typeof randomUuid === 'function') {
    const candidateId = randomUuid.call(globalThis.crypto);
    if (!existingIds.has(candidateId)) return candidateId;
  }

  for (let sequence = 1; sequence <= 10000; sequence += 1) {
    const candidateId = `town-object-${sequence}`;
    if (!existingIds.has(candidateId)) return candidateId;
  }

  throw new Error(`Could not create a unique town object ID for ${existingIds.size} existing objects.`);
}

function findTownObjectLocation(document: TownDocument, objectId: string | null): { layerId: TownLayerId; assetId: string } | null {
  if (!objectId) return null;
  for (const layer of document.layers) {
    const object = layer.objects.find((candidate) => candidate.id === objectId);
    if (object) return { layerId: layer.id, assetId: object.assetId };
  }
  return null;
}

function findActiveVisibleTownObjectLocation(
  document: TownDocument,
  objectId: string | null,
): { layerId: TownLayerId; assetId: string } | null {
  const location = findTownObjectLocation(document, objectId);
  if (!location || location.layerId !== document.activeLayer) {
    return null;
  }

  const activeLayer = document.layers.find((layer) => layer.id === location.layerId);
  return activeLayer?.visible ? location : null;
}

function requireActiveVisibleTownObject(document: TownDocument, objectId: string, message: string): void {
  if (!findActiveVisibleTownObjectLocation(document, objectId)) {
    throw new Error(`${message} Received ${JSON.stringify(objectId)}.`);
  }
}

function readTownSelectionObjectId(objectId: string): string {
  if (typeof objectId !== 'string' || objectId.length === 0) {
    throw new Error(`Town object id must be a non-empty string, received ${JSON.stringify(objectId)}.`);
  }

  return objectId;
}

function selectTownObjectOnVisibleLayer(
  document: TownDocument,
  objectId: string,
  layerId: TownLayerId,
): TownDocument {
  const validatedObjectId = readTownSelectionObjectId(objectId);
  const documentOnLayer = setTownActiveLayer(document, layerId);
  const layer = documentOnLayer.layers.find((candidate) => candidate.id === documentOnLayer.activeLayer);
  if (layer === undefined) {
    throw new Error(`Town active layer ${JSON.stringify(layerId)} is unavailable.`);
  }
  if (!layer.visible) {
    throw new Error(
      `Town layer ${JSON.stringify(layer.id)} is hidden, so object ${JSON.stringify(validatedObjectId)} cannot be selected.`,
    );
  }

  const objectIsInLayer = layer.objects.some((object) => object.id === validatedObjectId);
  if (!objectIsInLayer) {
    throw new Error(
      `Town layer ${JSON.stringify(layer.id)} does not contain object ${JSON.stringify(validatedObjectId)}.`,
    );
  }

  return selectTownObject(documentOnLayer, validatedObjectId);
}

function isTownTextEntryElement(element: Element): boolean {
  if (
    element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
    || element instanceof HTMLSelectElement
  ) {
    return true;
  }

  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const contentEditable = element.getAttribute('contenteditable');
  return contentEditable !== null && contentEditable.toLowerCase() !== 'false';
}

function isTownTextEntryTarget(target: EventTarget | null, boundary: Node): boolean {
  let node: Node | null = target instanceof Node ? target : null;
  while (node !== null) {
    if (node instanceof Element && isTownTextEntryElement(node)) {
      return true;
    }
    if (node === boundary) {
      return false;
    }
    node = node.parentNode;
  }

  return false;
}

function isTownDeleteShortcutBlocked(
  event: KeyboardEvent<HTMLElement>,
  dialogOrMenuOpen: boolean,
): boolean {
  if (event.nativeEvent.isComposing || event.key === 'Process' || event.defaultPrevented) {
    return true;
  }
  if (event.key !== 'Delete' && event.key !== 'Backspace') {
    return true;
  }
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return true;
  }
  if (dialogOrMenuOpen) {
    return true;
  }
  if (!(event.currentTarget instanceof HTMLElement)) {
    return true;
  }

  return isTownTextEntryTarget(event.target, event.currentTarget);
}

function describeFailure(reason: unknown): string {
  if (reason instanceof Error && reason.message.trim().length > 0) {
    return reason.message;
  }

  if (typeof reason === 'string' && reason.trim().length > 0) {
    return reason;
  }

  throw reason;
}

export type TownCreatorWorkbenchProps = {
  readonly locale: SiteLocale;
};

export function TownCreatorWorkbench({ locale }: TownCreatorWorkbenchProps) {
  const copy = { ...COPY[locale], product: getTownCreatorCopy(locale).navTitle };
  const [document, setDocument] = useState<TownDocument>(() => createTownDocument());
  const documentRef = useRef(document);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const selectedObjectIdRef = useRef<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<TownMaterial>('wood');
  const [copyTarget, setCopyTarget] = useState<TownLayerId>('middle');
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [resizeEnabled, setResizeEnabled] = useState(true);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<TownPanelId>('none');
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'info'; message: string } | null>(null);
  const [backgroundPending, setBackgroundPending] = useState(false);
  const [dialog, setDialog] = useState<TownDialogId | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const canvasColumnRef = useRef<HTMLElement | null>(null);
  const backgroundRequestRef = useRef(0);

  const commitDocument = (nextDocument: TownDocument): void => {
    documentRef.current = nextDocument;
    setDocument(nextDocument);
  };

  const showFailure = (reason: unknown): void => {
    setFeedback({ tone: 'error', message: `${copy.error}: ${describeFailure(reason)}` });
  };

  const selectObject = (objectId: string | null): void => {
    try {
      if (objectId !== null) {
        requireActiveVisibleTownObject(documentRef.current, objectId, copy.invalidSelection);
        commitDocument(selectTownObject(documentRef.current, objectId));
        setActivePanel('object');
      }
      selectedObjectIdRef.current = objectId;
      setSelectedObjectId(objectId);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const selectObjectInLayer = (objectId: string, layerId: TownLayerId): void => {
    try {
      const nextDocument = selectTownObjectOnVisibleLayer(documentRef.current, objectId, layerId);
      commitDocument(nextDocument);
      selectedObjectIdRef.current = objectId;
      setSelectedObjectId(objectId);
      setActivePanel('object');
    } catch (reason) {
      showFailure(reason);
    }
  };

  const addAsset = (asset: TownAsset): void => {
    try {
      const activeLayer = documentRef.current.layers.find((layer) => layer.id === documentRef.current.activeLayer);
      if (!activeLayer) {
        throw new Error(`Active layer ${JSON.stringify(documentRef.current.activeLayer)} is missing.`);
      }
      if (!activeLayer.visible) {
        throw new Error(copy.hiddenLayer(copy.layerNames[activeLayer.id]));
      }

      const objectId = createTownObjectId(documentRef.current);
      const material = asset.materials.includes(selectedMaterial) ? selectedMaterial : 'neutral';
      const objectX = Math.max(0, Math.round((documentRef.current.width - asset.width) / 2));
      const objectY = Math.max(0, Math.round((documentRef.current.height - asset.height) / 2));
      const nextDocument = addTownObject(documentRef.current, asset.id, material, objectId, { x: objectX, y: objectY });
      commitDocument(nextDocument);
      setFeedback(null);
      selectObject(objectId);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const updateObject = (objectId: string, patch: TownObjectPatch): void => {
    try {
      requireActiveVisibleTownObject(documentRef.current, objectId, copy.invalidSelection);
      commitDocument(updateTownObject(documentRef.current, objectId, patch));
    } catch (reason) {
      showFailure(reason);
    }
  };

  const copySelectedObject = (targetLayerId: TownLayerId): void => {
    const currentObjectId = selectedObjectIdRef.current;
    if (!currentObjectId) {
      showFailure(new Error('Select an object before copying it.'));
      return;
    }

    try {
      requireActiveVisibleTownObject(documentRef.current, currentObjectId, copy.invalidSelection);
      const copiedObjectId = createTownObjectId(documentRef.current);
      commitDocument(copyTownObject(documentRef.current, currentObjectId, targetLayerId, copiedObjectId));
      setFeedback(null);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const deleteSelectedObject = (): void => {
    const currentObjectId = selectedObjectIdRef.current;
    if (!currentObjectId) {
      showFailure(new Error('Select an object before deleting it.'));
      return;
    }

    try {
      requireActiveVisibleTownObject(documentRef.current, currentObjectId, copy.invalidSelection);
      commitDocument(deleteTownObject(documentRef.current, currentObjectId));
      selectObject(null);
      setFeedback(null);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const applyBackground = (color: string, imageUrl: string): void => {
    const requestId = backgroundRequestRef.current + 1;
    backgroundRequestRef.current = requestId;
    setBackgroundPending(false);

    if (color.trim().length === 0) {
      showFailure(new Error('Background color must be a non-empty value.'));
      return;
    }

    if (imageUrl.length === 0) {
      try {
        commitDocument(setTownBackground(documentRef.current, { color, imageUrl: '' }));
      } catch (reason) {
        showFailure(reason);
        return;
      }
      setFeedback(null);
      return;
    }

    if (typeof window === 'undefined') {
      showFailure(new Error('Background image loading requires a browser window.'));
      return;
    }

    setBackgroundPending(true);
    setFeedback({ tone: 'info', message: copy.backgroundLoading });
    const image = new window.Image();
    image.onload = () => {
      if (backgroundRequestRef.current !== requestId) {
        return;
      }

      try {
        commitDocument(setTownBackground(documentRef.current, { color, imageUrl }));
        setFeedback(null);
      } catch (reason) {
        showFailure(reason);
      } finally {
        setBackgroundPending(false);
      }
    };
    image.onerror = () => {
      if (backgroundRequestRef.current !== requestId) {
        return;
      }

      setBackgroundPending(false);
      setFeedback({ tone: 'error', message: `${copy.backgroundFailed}: ${imageUrl}` });
    };
    image.src = imageUrl;
  };

  const fitCanvasWidth = (): void => {
    const container = canvasColumnRef.current;
    if (!container) {
      showFailure(new Error(copy.widthFitFailed));
      return;
    }

    const measuredWidth = Math.round(container.getBoundingClientRect().width || container.clientWidth);
    if (measuredWidth <= 0) {
      showFailure(new Error(copy.widthFitFailed));
      return;
    }

    try {
      commitDocument(resizeTownCanvas(documentRef.current, measuredWidth, documentRef.current.height));
    } catch (reason) {
      showFailure(reason);
    }
  };

  const activeLayer = document.activeLayer;
  const selectedLocation = findActiveVisibleTownObjectLocation(document, selectedObjectId);
  const selectedAsset = selectedLocation ? getTownAsset(selectedLocation.assetId) : null;
  const settingsOpen = activePanel === 'layers' || activePanel === 'canvas';

  const loadDocument = (loadedDocument: TownDocument): void => {
    backgroundRequestRef.current += 1;
    setBackgroundPending(false);
    documentRef.current = loadedDocument;
    setDocument(loadedDocument);
    selectedObjectIdRef.current = null;
    setSelectedObjectId(null);
    setFeedback(null);
  };

  const setActiveLayer = (layerId: TownLayerId): void => {
    try {
      commitDocument(setTownActiveLayer(documentRef.current, layerId));
      selectObject(null);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const setLayerVisibility = (layerId: TownLayerId, visible: boolean): void => {
    try {
      commitDocument(setTownLayerVisibility(documentRef.current, layerId, visible));
      if (!visible && selectedLocation?.layerId === layerId) {
        selectObject(null);
      }
    } catch (reason) {
      showFailure(reason);
    }
  };

  const resizeCanvas = (width: number, height: number): void => {
    try {
      commitDocument(resizeTownCanvas(documentRef.current, width, height));
    } catch (reason) {
      showFailure(reason);
    }
  };

  const clearCurrentLayer = (): void => {
    try {
      commitDocument(clearTownLayer(documentRef.current, documentRef.current.activeLayer));
      selectObject(null);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const clearEveryLayer = (): void => {
    try {
      commitDocument(clearTownObjects(documentRef.current));
      selectObject(null);
    } catch (reason) {
      showFailure(reason);
    }
  };

  const handleWorkbenchKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (isTownDeleteShortcutBlocked(event, dialog !== null || moreOpen)) {
      return;
    }
    if (!findActiveVisibleTownObjectLocation(documentRef.current, selectedObjectIdRef.current)) {
      return;
    }

    event.preventDefault();
    deleteSelectedObject();
  };

  return (
    <section
      className={styles.workbench}
      data-town-workbench="true"
      data-left-collapsed={leftCollapsed}
      data-right-collapsed={rightCollapsed}
      data-mobile-panel={activePanel}
      onKeyDown={handleWorkbenchKeyDown}
    >
      <header className={styles.toolbar}>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.product}</h1>
        </div>
        <div className={styles.toolbarStats} aria-label={copy.canvasSize}>
          <span>{document.width} × {document.height}</span>
          <span>{copy.activeLayer}: {copy.layerNames[activeLayer]}</span>
        </div>
        <nav className={styles.toolbarActions} aria-label={copy.project}>
          <button className={styles.toolbarButton} type="button" onClick={() => setDialog('save')}>{copy.save}</button>
          <button className={styles.toolbarButton} type="button" onClick={() => setDialog('export')}>{copy.output}</button>
          <button className={styles.toolbarButton} type="button" onClick={() => setDialog('help')}>{copy.help}</button>
          <button className={styles.toolbarButton} type="button" onClick={() => setActivePanel(activePanel === 'layers' ? 'none' : 'layers')}>{copy.layers}</button>
          <button className={styles.toolbarButton} type="button" onClick={() => setActivePanel(activePanel === 'canvas' ? 'none' : 'canvas')}>{copy.canvas}</button>
        </nav>
        <button className={styles.moreButton} type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((open) => !open)}>
          {locale === 'zh' ? '更多' : 'More'}
        </button>
        {moreOpen ? (
          <div className={styles.moreMenu} role="menu">
            <button type="button" role="menuitem" onClick={() => { setDialog('save'); setMoreOpen(false); }}>{copy.save}</button>
            <button type="button" role="menuitem" onClick={() => { setDialog('export'); setMoreOpen(false); }}>{copy.output}</button>
            <button type="button" role="menuitem" onClick={() => { setDialog('help'); setMoreOpen(false); }}>{copy.help}</button>
          </div>
        ) : null}
      </header>

      {feedback ? (
        <p className={`${styles.feedback} ${styles[`feedback-${feedback.tone}`]}`} role={feedback.tone === 'error' ? 'alert' : 'status'}>
          {feedback.message}
          {backgroundPending ? <span className={styles.feedbackProgress} aria-hidden="true" /> : null}
        </p>
      ) : null}

      <div className={styles.editorGrid}>
        <aside className={`${styles.sidePanel} ${styles.leftPanel}`} aria-label={copy.assets}>
          <button
            className={styles.collapseButton}
            type="button"
            aria-expanded={!leftCollapsed}
            aria-label={leftCollapsed ? copy.expandAssets : copy.collapseAssets}
            title={leftCollapsed ? copy.expandAssets : copy.collapseAssets}
            onClick={() => setLeftCollapsed((collapsed) => !collapsed)}
          >
            {leftCollapsed ? '›' : '‹'}
          </button>
          <div className={styles.sidePanelContent}>
            <TownAssetLibrary
              locale={locale}
              assets={TOWN_ASSETS}
              selectedMaterial={selectedMaterial}
              onMaterialChange={setSelectedMaterial}
              onAddAsset={addAsset}
            />
          </div>
        </aside>

        <main className={styles.canvasColumn} ref={canvasColumnRef}>
          <div className={styles.canvasToolbar} aria-label={copy.controls}>
            <label className={styles.canvasToolbarField} htmlFor="town-quick-layer">
              <span>{copy.activeLayer}</span>
              <select
                id="town-quick-layer"
                className={styles.canvasToolbarSelect}
                value={document.activeLayer}
                onChange={(event) => setActiveLayer(event.target.value as TownLayerId)}
              >
                <option value="lower">{copy.layerNames.lower}</option>
                <option value="middle">{copy.layerNames.middle}</option>
                <option value="upper">{copy.layerNames.upper}</option>
              </select>
            </label>
            <label className={styles.canvasToolbarToggle}>
              <input type="checkbox" checked={snapEnabled} onChange={(event) => setSnapEnabled(event.target.checked)} />
              <span>{copy.snap}</span>
            </label>
            <label className={styles.canvasToolbarToggle}>
              <input type="checkbox" checked={resizeEnabled} onChange={(event) => setResizeEnabled(event.target.checked)} />
              <span>{copy.resizeHandles}</span>
            </label>
          </div>
          <div className={styles.canvasRegion}>
            <TownCanvas
              document={document}
              selectedObjectId={selectedObjectId}
              snapEnabled={snapEnabled}
              resizeEnabled={resizeEnabled}
              locale={locale}
              onSelectObject={selectObject}
              onSelectObjectInLayer={selectObjectInLayer}
              onUpdateObject={updateObject}
            />
          </div>
          {settingsOpen ? (
            <TownSettingsPanel
              locale={locale}
              document={document}
              snapEnabled={snapEnabled}
              resizeEnabled={resizeEnabled}
              onSnapEnabledChange={setSnapEnabled}
              onResizeEnabledChange={setResizeEnabled}
              onActiveLayerChange={setActiveLayer}
              onLayerVisibilityChange={setLayerVisibility}
              onResizeCanvas={resizeCanvas}
              onWidthFit={fitCanvasWidth}
              onRestoreHeight={() => resizeCanvas(documentRef.current.width, DEFAULT_TOWN_HEIGHT)}
              onBackgroundApply={applyBackground}
              onClearLayer={clearCurrentLayer}
              onClearAll={clearEveryLayer}
              onError={(message) => showFailure(new Error(message))}
            />
          ) : null}
        </main>

        <aside className={`${styles.sidePanel} ${styles.rightPanel}`} aria-label={copy.object}>
          <button
            className={styles.collapseButton}
            type="button"
            aria-expanded={!rightCollapsed}
            aria-label={rightCollapsed ? copy.expandObject : copy.collapseObject}
            title={rightCollapsed ? copy.expandObject : copy.collapseObject}
            onClick={() => setRightCollapsed((collapsed) => !collapsed)}
          >
            {rightCollapsed ? '‹' : '›'}
          </button>
          <div className={styles.sidePanelContent}>
            <TownObjectPanel
              locale={locale}
              document={document}
              selectedObjectId={selectedLocation ? selectedObjectId : null}
              selectedObjectLayerId={selectedLocation?.layerId ?? null}
              selectedAssetName={selectedAsset ? selectedAsset.name[locale] : null}
              selectedResizeMode={selectedAsset?.resizeMode ?? null}
              selectedAssetWidth={selectedAsset?.width ?? null}
              selectedAssetHeight={selectedAsset?.height ?? null}
              copyTarget={copyTarget}
              onCopyTargetChange={setCopyTarget}
              onCopy={copySelectedObject}
              onDelete={deleteSelectedObject}
              onUpdateObject={updateObject}
              onError={(message) => showFailure(new Error(message))}
            />
          </div>
        </aside>
      </div>

      <nav className={styles.mobileNavigation} aria-label={copy.product}>
        {([
          ['assets', copy.assets],
          ['object', copy.object],
          ['layers', copy.layers],
          ['canvas', copy.canvas],
        ] as const).map(([panelId, label]) => (
          <button
            className={`${styles.mobileNavigationButton} ${activePanel === panelId ? styles.mobileNavigationButtonActive : ''}`}
            key={panelId}
            type="button"
            aria-pressed={activePanel === panelId}
            onClick={() => setActivePanel(activePanel === panelId ? 'none' : panelId)}
          >
            <span className={styles.mobileNavigationIcon} aria-hidden="true">{panelId === 'assets' ? '▦' : panelId === 'object' ? '◇' : panelId === 'layers' ? '≡' : '□'}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {dialog === 'save' ? (
        <TownSaveDialog
          locale={locale}
          document={document}
          onClose={() => setDialog(null)}
          onLoadDocument={loadDocument}
        />
      ) : null}
      {dialog === 'export' ? (
        <TownExportDialog locale={locale} document={document} onClose={() => setDialog(null)} />
      ) : null}
      {dialog === 'help' ? <TownHelpDialog locale={locale} onClose={() => setDialog(null)} /> : null}
    </section>
  );
}
