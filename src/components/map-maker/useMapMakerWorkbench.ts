'use client';

import { useEffect, useRef, useState } from 'react';

import {
  MAP_MAKER_DEFAULT_ROWS,
  MAP_MAKER_MAX_COLUMNS,
  MAP_MAKER_MAX_PROJECT_BYTES,
  MAP_MAKER_MIN_COLUMNS,
  MAP_MAKER_TILE_SIZE,
  addMapMakerElement,
  addMapMakerLabel,
  buildMapMakerPng,
  clearMapMakerElementLayer,
  clearMapMakerLabels,
  createDefaultMapMakerProject,
  getMapMakerAsset,
  loadMapMakerSlot,
  parseMapMakerProject,
  preloadMapMakerImage,
  preloadMapMakerProject,
  randomizeMapMakerBase,
  readMapMakerSaveSlots,
  removeMapMakerElements,
  removeMapMakerLabels,
  replaceMapMakerBaseTiles,
  resetMapMakerBaseTiles,
  resetMapMakerProject,
  resizeMapMakerProject,
  saveMapMakerSlot,
  serializeMapMakerProject,
  transformMapMakerBaseTiles,
  updateMapMakerElements,
  updateMapMakerLabels,
  updateMapMakerSettings,
} from '@/lib/map-maker';
import type {
  MapMakerElement,
  MapMakerElementLayer,
  MapMakerGridCell,
  MapMakerLabel,
  MapMakerProject,
  MapMakerRotation,
  MapMakerSaveSlot,
  MapMakerSaveSlots,
  MapMakerProjectSettingsPatch,
} from '@/lib/map-maker';
import type { MapMakerWorkspaceCopy } from '@/lib/map-maker/copy';

import type { MapMakerEditTarget } from './MapMakerLayerPanel';

function emptySaveSlots(): MapMakerSaveSlots {
  return Array.from({ length: 8 }, () => null);
}

function describeFailure(reason: unknown): string {
  if (reason instanceof Error) return reason.message || `${reason.name} with an empty message.`;
  if (typeof reason === 'string') return reason;
  if (reason === undefined) return 'undefined';
  if (reason === null) return 'null';
  return String(reason);
}

function requireRandomId(): string {
  if (typeof globalThis.crypto?.randomUUID !== 'function') {
    throw new Error(`Map Maker object creation requires crypto.randomUUID. Received ${typeof globalThis.crypto?.randomUUID}.`);
  }
  return globalThis.crypto.randomUUID();
}

function requireDownloadApi(): typeof URL {
  if (typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
    throw new Error(`Map Maker download requires URL.createObjectURL and URL.revokeObjectURL. Received create=${typeof URL.createObjectURL}, revoke=${typeof URL.revokeObjectURL}.`);
  }
  return URL;
}

function downloadBlob(blob: Blob, filename: string): void {
  if (!(blob instanceof Blob)) {
    throw new Error(`Map Maker download requires a Blob. Received ${Object.prototype.toString.call(blob)}.`);
  }
  const objectUrl = requireDownloadApi().createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (![value, minimum, maximum].every(Number.isFinite) || minimum > maximum) {
    throw new Error(`Map Maker coordinate clamp has invalid bounds. Received value=${String(value)}, minimum=${String(minimum)}, maximum=${String(maximum)}.`);
  }
  return Math.min(maximum, Math.max(minimum, value));
}

function snapMapCoordinate(value: number, maximum: number, snapToGrid: boolean): number {
  const snappedValue = snapToGrid ? Math.round(value / 2) * 2 : value;
  return clamp(snappedValue, 0, maximum);
}

function mapRotation(rotation: number): MapMakerRotation {
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  if (normalizedRotation !== 0 && normalizedRotation !== 90 && normalizedRotation !== 180 && normalizedRotation !== 270) {
    throw new Error(`Map Maker rotation must normalize to a quarter turn. Received ${String(rotation)}.`);
  }
  return normalizedRotation as MapMakerRotation;
}

function requireMapMakerElement(project: MapMakerProject, id: string): MapMakerElement {
  const element = project.elements.find((candidate) => candidate.id === id);
  if (element === undefined) {
    throw new Error(`Map Maker element was not found for the selected id. Received ${JSON.stringify(id)}.`);
  }
  return element;
}

function requireMapMakerLabel(project: MapMakerProject, id: string): MapMakerLabel {
  const label = project.labels.find((candidate) => candidate.id === id);
  if (label === undefined) {
    throw new Error(`Map Maker label was not found for the selected id. Received ${JSON.stringify(id)}.`);
  }
  return label;
}

function updateElementsPosition(
  project: MapMakerProject,
  ids: readonly string[],
  deltaX: number,
  deltaY: number,
): MapMakerProject {
  let nextProject = project;
  const mapWidth = project.columns * MAP_MAKER_TILE_SIZE;
  const mapHeight = project.rows * MAP_MAKER_TILE_SIZE;
  for (const id of ids) {
    const element = requireMapMakerElement(nextProject, id);
    const x = snapMapCoordinate(element.x + deltaX, mapWidth - element.width, project.settings.snapToGrid);
    const y = snapMapCoordinate(element.y + deltaY, mapHeight - element.height, project.settings.snapToGrid);
    nextProject = updateMapMakerElements(nextProject, [id], { x, y });
  }
  return nextProject;
}

function updateLabelsPosition(
  project: MapMakerProject,
  ids: readonly string[],
  deltaX: number,
  deltaY: number,
): MapMakerProject {
  let nextProject = project;
  const mapWidth = project.columns * MAP_MAKER_TILE_SIZE;
  const mapHeight = project.rows * MAP_MAKER_TILE_SIZE;
  for (const id of ids) {
    const label = requireMapMakerLabel(nextProject, id);
    const x = snapMapCoordinate(label.x + deltaX, mapWidth - label.width, project.settings.snapToGrid);
    const y = snapMapCoordinate(label.y + deltaY, mapHeight - label.height, project.settings.snapToGrid);
    nextProject = updateMapMakerLabels(nextProject, [id], { x, y });
  }
  return nextProject;
}

function updateTileRotation(
  project: MapMakerProject,
  cells: readonly MapMakerGridCell[],
  degrees: number,
): MapMakerProject {
  let nextProject = project;
  for (const cell of cells) {
    const tile = nextProject.baseTiles.find((candidate) => candidate.column === cell.column && candidate.row === cell.row);
    if (tile === undefined) {
      throw new Error(`Map Maker base tile rotation target was not found. Received column=${cell.column}, row=${cell.row}.`);
    }
    nextProject = transformMapMakerBaseTiles(nextProject, [cell], { rotation: mapRotation(degrees) });
  }
  return nextProject;
}

function updateElementRotation(
  project: MapMakerProject,
  ids: readonly string[],
  degrees: number,
): MapMakerProject {
  let nextProject = project;
  for (const id of ids) {
    nextProject = updateMapMakerElements(nextProject, [id], { rotation: mapRotation(degrees) });
  }
  return nextProject;
}

function mirrorSelectedTiles(project: MapMakerProject, cells: readonly MapMakerGridCell[]): MapMakerProject {
  let nextProject = project;
  for (const cell of cells) {
    const tile = nextProject.baseTiles.find((candidate) => candidate.column === cell.column && candidate.row === cell.row);
    if (tile === undefined) {
      throw new Error(`Map Maker base tile mirror target was not found. Received column=${cell.column}, row=${cell.row}.`);
    }
    nextProject = transformMapMakerBaseTiles(nextProject, [cell], { flipHorizontal: !tile.flipHorizontal });
  }
  return nextProject;
}

function restoreSelectedTileTransforms(project: MapMakerProject, cells: readonly MapMakerGridCell[]): MapMakerProject {
  return cells.length === 0
    ? project
    : transformMapMakerBaseTiles(project, cells, { rotation: 0, flipHorizontal: false, flipVertical: false });
}

function restoreSelectedElements(project: MapMakerProject, ids: readonly string[]): MapMakerProject {
  let nextProject = project;
  for (const id of ids) {
    nextProject = updateMapMakerElements(nextProject, [id], { rotation: 0, flipHorizontal: false, flipVertical: false });
  }
  return nextProject;
}

function mirrorSelectedElements(project: MapMakerProject, ids: readonly string[]): MapMakerProject {
  let nextProject = project;
  for (const id of ids) {
    const element = requireMapMakerElement(nextProject, id);
    nextProject = updateMapMakerElements(nextProject, [id], { flipHorizontal: !element.flipHorizontal });
  }
  return nextProject;
}

function requireSelectedFile(file: unknown): File {
  if (!(file instanceof File)) {
    throw new Error(`Map Maker project selection must be a File. Received ${Object.prototype.toString.call(file)}.`);
  }
  return file;
}

function replaceElementImageWithNaturalSize(
  project: MapMakerProject,
  elementId: string,
  url: string,
  naturalWidth: number,
  naturalHeight: number,
): MapMakerProject {
  const element = requireMapMakerElement(project, elementId);
  if (![naturalWidth, naturalHeight].every((dimension) => Number.isFinite(dimension) && dimension > 0)) {
    throw new Error(`Map Maker custom image has invalid natural dimensions. Received width=${String(naturalWidth)}, height=${String(naturalHeight)}.`);
  }
  const mapWidth = project.columns * MAP_MAKER_TILE_SIZE;
  const mapHeight = project.rows * MAP_MAKER_TILE_SIZE;
  const scale = Math.min(1, mapWidth / naturalWidth, mapHeight / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const x = clamp(element.x + (element.width - width) / 2, 0, mapWidth - width);
  const y = clamp(element.y + (element.height - height) / 2, 0, mapHeight - height);
  return updateMapMakerElements(project, [elementId], {
    source: { kind: 'url', url },
    x,
    y,
    width,
    height,
  });
}

export function useMapMakerWorkbench(copy: MapMakerWorkspaceCopy) {
  const [project, setProject] = useState<MapMakerProject>(() => createDefaultMapMakerProject());
  const [editTarget, setEditTargetState] = useState<MapMakerEditTarget>('base');
  const [targetLayer, setTargetLayer] = useState<MapMakerElementLayer>(1);
  const [selectedCells, setSelectedCells] = useState<MapMakerGridCell[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [slots, setSlots] = useState<MapMakerSaveSlots>(() => emptySaveSlots());
  const [busy, setBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const initialProjectRef = useRef(project);
  const projectRef = useRef(project);
  const defaultMapColumnsInitializedRef = useRef(false);
  const previewImageUrlRef = useRef<string | null>(null);
  const exportGenerationRef = useRef(0);

  useEffect(() => {
    try {
      setSlots(readMapMakerSaveSlots());
    } catch (reason) {
      setActionError(describeFailure(reason));
    }
  }, []);

  useEffect(() => () => {
    const currentPreviewUrl = previewImageUrlRef.current;
    if (currentPreviewUrl !== null && typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(currentPreviewUrl);
  }, []);

  useEffect(() => {
    if (!exportOpen) return undefined;
    const generation = ++exportGenerationRef.current;
    setExportBusy(true);
    setActionError(null);
    setPreviewImageUrl(null);
    if (previewImageUrlRef.current !== null) {
      URL.revokeObjectURL(previewImageUrlRef.current);
      previewImageUrlRef.current = null;
    }
    const timeoutId = window.setTimeout(() => {
      void buildMapMakerPng(project).then((pngBlob) => {
        if (generation !== exportGenerationRef.current) return;
        const previewUrl = requireDownloadApi().createObjectURL(pngBlob);
        previewImageUrlRef.current = previewUrl;
        setPreviewImageUrl(previewUrl);
      }).catch((reason: unknown) => {
        if (generation === exportGenerationRef.current) setActionError(describeFailure(reason));
      }).finally(() => {
        if (generation === exportGenerationRef.current) setExportBusy(false);
      });
    }, 120);
    return () => {
      window.clearTimeout(timeoutId);
      if (exportGenerationRef.current === generation) exportGenerationRef.current += 1;
    };
  }, [exportOpen, project]);

  function reportFailure(reason: unknown): void {
    setActionError(describeFailure(reason));
    setActionStatus(null);
  }

  function reportInteraction(message: string): void {
    setActionStatus(message);
    setActionError(null);
  }

  function commitProject(nextProject: MapMakerProject, statusMessage?: string): void {
    projectRef.current = nextProject;
    setProject(nextProject);
    setActionError(null);
    setActionStatus(statusMessage ?? null);
  }

  function runProjectChange(
    operation: (currentProject: MapMakerProject) => MapMakerProject,
    statusMessage?: string,
  ): boolean {
    try {
      commitProject(operation(projectRef.current), statusMessage);
      return true;
    } catch (reason) {
      reportFailure(reason);
      return false;
    }
  }

  function clearSelection(): void {
    setSelectedCells([]);
    setSelectedElementIds([]);
    setSelectedLabelIds([]);
  }

  function setEditTarget(target: MapMakerEditTarget): void {
    if (target === editTarget) return;
    setEditTargetState(target);
    if (target === 'layer-1') setTargetLayer(1);
    else if (target === 'layer-2') setTargetLayer(2);
    clearSelection();
  }

  function handleSelectCells(cells: readonly MapMakerGridCell[], additive: boolean): void {
    setSelectedElementIds([]);
    setSelectedLabelIds([]);
    setSelectedCells((currentCells) => {
      if (!additive) return [...cells];
      const selectedKeys = new Set(currentCells.map((cell) => `${cell.column}:${cell.row}`));
      for (const cell of cells) {
        const key = `${cell.column}:${cell.row}`;
        if (selectedKeys.has(key)) selectedKeys.delete(key);
        else selectedKeys.add(key);
      }
      const allCells = [...currentCells, ...cells];
      const uniqueCells = new Map(allCells.map((cell) => [`${cell.column}:${cell.row}`, cell]));
      return [...uniqueCells].filter(([key]) => selectedKeys.has(key)).map(([, cell]) => cell);
    });
  }

  function handleSelectElements(ids: readonly string[]): void {
    setSelectedCells([]);
    setSelectedLabelIds([]);
    setSelectedElementIds([...ids]);
  }

  function handleSelectLabels(ids: readonly string[]): void {
    setSelectedCells([]);
    setSelectedElementIds([]);
    setSelectedLabelIds([...ids]);
  }

  function handleChangeSettings(settingsPatch: MapMakerProjectSettingsPatch): void {
    runProjectChange((currentProject) => updateMapMakerSettings(currentProject, settingsPatch));
  }

  function handleRandomGenerate(): void {
    runProjectChange((currentProject) => randomizeMapMakerBase(currentProject), copy.status.mapGenerated);
  }

  function handleApplySize(columns: number, rows: number): void {
    if (runProjectChange((currentProject) => resizeMapMakerProject(currentProject, columns, rows))) clearSelection();
  }

  function initializeDefaultMapColumns(columns: number): void {
    if (!Number.isInteger(columns) || columns < MAP_MAKER_MIN_COLUMNS || columns > MAP_MAKER_MAX_COLUMNS) {
      throw new RangeError(`Map Maker default columns must be an integer from ${MAP_MAKER_MIN_COLUMNS} to ${MAP_MAKER_MAX_COLUMNS}. Received ${String(columns)}.`);
    }
    if (defaultMapColumnsInitializedRef.current) return;

    const currentProject = projectRef.current;
    if (currentProject !== initialProjectRef.current) {
      defaultMapColumnsInitializedRef.current = true;
      return;
    }

    if (columns !== currentProject.columns) {
      commitProject(resizeMapMakerProject(currentProject, columns, MAP_MAKER_DEFAULT_ROWS));
      clearSelection();
    }
    defaultMapColumnsInitializedRef.current = true;
  }

  function handleResetMap(): void {
    if (runProjectChange((currentProject) => resetMapMakerProject(currentProject), copy.status.mapReset)) clearSelection();
  }

  function handleClearLayer(layer: MapMakerElementLayer): void {
    runProjectChange((currentProject) => clearMapMakerElementLayer(currentProject, layer), copy.status.elementsCleared);
    setSelectedElementIds((ids) => ids.filter((id) => projectRef.current.elements.some((element) => element.id === id)));
  }

  function handleClearLabels(): void {
    runProjectChange((currentProject) => clearMapMakerLabels(currentProject));
    setSelectedLabelIds([]);
  }

  function handleReplaceSelectedTiles(assetId: string): void {
    if (selectedCells.length === 0) {
      reportInteraction(copy.canvas.baseTileHint);
      return;
    }
    runProjectChange((currentProject) => replaceMapMakerBaseTiles(currentProject, selectedCells, { kind: 'asset', assetId }));
  }

  function handleRestoreSelectedTiles(): void {
    if (selectedCells.length === 0) return;
    runProjectChange((currentProject) => resetMapMakerBaseTiles(currentProject, selectedCells));
  }

  function handlePlaceElement(assetId: string, layer: MapMakerElementLayer): void {
    try {
      const asset = getMapMakerAsset(assetId);
      const maximumAssetDimension = Math.max(asset.width, asset.height);
      const scale = Math.min(1, MAP_MAKER_TILE_SIZE / maximumAssetDimension);
      const width = asset.width * scale;
      const height = asset.height * scale;
      const mapWidth = projectRef.current.columns * MAP_MAKER_TILE_SIZE;
      const mapHeight = projectRef.current.rows * MAP_MAKER_TILE_SIZE;
      const element: MapMakerElement = {
        id: requireRandomId(),
        source: { kind: 'asset', assetId: asset.id },
        layer,
        x: Math.max(0, (mapWidth - width) / 2),
        y: Math.max(0, (mapHeight - height) / 2),
        width,
        height,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
      };
      commitProject(addMapMakerElement(projectRef.current, element));
      setTargetLayer(layer);
      setEditTargetState(layer === 1 ? 'layer-1' : 'layer-2');
      setSelectedCells([]);
      setSelectedLabelIds([]);
      setSelectedElementIds([element.id]);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleAddLabel(): string | null {
    try {
      const mapWidth = projectRef.current.columns * MAP_MAKER_TILE_SIZE;
      const mapHeight = projectRef.current.rows * MAP_MAKER_TILE_SIZE;
      const label: MapMakerLabel = {
        id: requireRandomId(),
        text: '',
        x: Math.max(0, (mapWidth - 160) / 2),
        y: Math.max(0, (mapHeight - 32) / 2),
        width: Math.min(160, mapWidth),
        height: 32,
        fontSize: 16,
      };
      commitProject(addMapMakerLabel(projectRef.current, label), copy.status.labelAdded);
      setEditTargetState('labels');
      setSelectedCells([]);
      setSelectedElementIds([]);
      setSelectedLabelIds([label.id]);
      return label.id;
    } catch (reason) {
      reportFailure(reason);
      return null;
    }
  }

  async function handleApplyCustomImage(url: string): Promise<void> {
    const appliesToBaseTiles = editTarget === 'base' && selectedCells.length > 0;
    const appliesToElement = (editTarget === 'layer-1' || editTarget === 'layer-2') && selectedElementIds.length === 1;
    if ((!appliesToBaseTiles && !appliesToElement) || busy) {
      if (!appliesToBaseTiles && !appliesToElement) reportInteraction(copy.properties.customImageTargetHint);
      return;
    }
    setBusy(true);
    try {
      const image = await preloadMapMakerImage(url);
      const nextProject = appliesToBaseTiles
        ? replaceMapMakerBaseTiles(projectRef.current, selectedCells, { kind: 'url', url })
        : replaceElementImageWithNaturalSize(projectRef.current, selectedElementIds[0]!, url, image.naturalWidth, image.naturalHeight);
      commitProject(nextProject, copy.status.imageApplied);
      setCustomImageUrl('');
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setBusy(false);
    }
  }

  function handleRotateSelected(degrees: number): void {
    if (editTarget === 'base' && selectedCells.length > 0) {
      runProjectChange((currentProject) => updateTileRotation(currentProject, selectedCells, degrees));
    } else if ((editTarget === 'layer-1' || editTarget === 'layer-2') && selectedElementIds.length > 0) {
      runProjectChange((currentProject) => updateElementRotation(currentProject, selectedElementIds, degrees));
    }
  }

  function handleMirrorSelected(): void {
    if (editTarget === 'base' && selectedCells.length > 0) {
      runProjectChange((currentProject) => mirrorSelectedTiles(currentProject, selectedCells));
    } else if ((editTarget === 'layer-1' || editTarget === 'layer-2') && selectedElementIds.length > 0) {
      runProjectChange((currentProject) => mirrorSelectedElements(currentProject, selectedElementIds));
    }
  }

  function handleRestoreSelected(): void {
    if (editTarget === 'base') {
      runProjectChange((currentProject) => restoreSelectedTileTransforms(currentProject, selectedCells));
    } else if ((editTarget === 'layer-1' || editTarget === 'layer-2') && selectedElementIds.length > 0) {
      runProjectChange((currentProject) => restoreSelectedElements(currentProject, selectedElementIds));
    }
  }

  function handleDeleteSelectedElements(): void {
    if (selectedElementIds.length === 0) return;
    runProjectChange((currentProject) => removeMapMakerElements(currentProject, selectedElementIds));
    setSelectedElementIds([]);
  }

  function handleDeleteSelectedLabels(): void {
    if (selectedLabelIds.length === 0) return;
    runProjectChange((currentProject) => removeMapMakerLabels(currentProject, selectedLabelIds));
    setSelectedLabelIds([]);
  }

  function handleMoveElements(ids: readonly string[], deltaX: number, deltaY: number): void {
    runProjectChange((currentProject) => updateElementsPosition(currentProject, ids, deltaX, deltaY));
  }

  function handleMoveLabels(ids: readonly string[], deltaX: number, deltaY: number): void {
    runProjectChange((currentProject) => updateLabelsPosition(currentProject, ids, deltaX, deltaY));
  }

  function handleResizeElement(id: string, width: number, height: number): void {
    runProjectChange((currentProject) => updateMapMakerElements(currentProject, [id], { width, height }));
  }

  function handleResizeLabel(id: string, width: number, height: number): void {
    runProjectChange((currentProject) => updateMapMakerLabels(currentProject, [id], { width, height }));
  }

  function handleUpdateLabelText(id: string, text: string): void {
    runProjectChange((currentProject) => updateMapMakerLabels(currentProject, [id], { text }));
  }

  function handleImageLoadError(url: string): void {
    reportFailure(`Image failed to load. Received URL ${JSON.stringify(url)}.`);
  }

  function handleSaveSlot(slot: MapMakerSaveSlot): void {
    try {
      const savedSlots = saveMapMakerSlot(slot, projectRef.current);
      setSlots(savedSlots);
      setActionStatus(copy.status.saveSlotSaved);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleDownloadProjectFile(): void {
    try {
      const projectText = serializeMapMakerProject(projectRef.current);
      downloadBlob(new Blob([projectText], { type: 'text/plain;charset=utf-8' }), 'fantasy-map-project.txt');
      setActionStatus(copy.status.projectFileDownloaded);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function handleChooseProjectFile(receivedFile: File): void {
    try {
      const file = requireSelectedFile(receivedFile);
      if (file.size > MAP_MAKER_MAX_PROJECT_BYTES) {
        throw new Error(`Map Maker project file ${JSON.stringify(file.name)} is ${file.size} bytes; maximum is ${MAP_MAKER_MAX_PROJECT_BYTES}.`);
      }
      setSelectedFile(file);
      setActionError(null);
      setActionStatus(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  async function handleLoadProjectFile(): Promise<void> {
    if (selectedFile === null || busy) return;
    setBusy(true);
    try {
      const importedProject = parseMapMakerProject(await selectedFile.text());
      await preloadMapMakerProject(importedProject);
      commitProject(importedProject, copy.status.projectFileLoaded);
      clearSelection();
      setSelectedFile(null);
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setBusy(false);
    }
  }

  async function handleLoadSlot(slot: MapMakerSaveSlot): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      const loadedProject = loadMapMakerSlot(slot);
      await preloadMapMakerProject(loadedProject);
      commitProject(loadedProject, copy.status.saveSlotLoaded);
      clearSelection();
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownloadImage(): Promise<void> {
    if (exportBusy) return;
    setExportBusy(true);
    try {
      let exportProject = projectRef.current;
      let pngBlob = await buildMapMakerPng(exportProject);
      if (projectRef.current !== exportProject) {
        exportProject = projectRef.current;
        pngBlob = await buildMapMakerPng(exportProject);
        if (projectRef.current !== exportProject) {
          throw new Error('Map Maker changed again while creating the image. Received multiple project revisions. Click download again to export the latest map.');
        }
      }
      downloadBlob(pngBlob, 'fantasy-map.png');
      setActionStatus(copy.status.imageDownloaded);
      setActionError(null);
    } catch (reason) {
      reportFailure(reason);
    } finally {
      setExportBusy(false);
    }
  }

  return {
    project,
    editTarget,
    targetLayer,
    selectedCells,
    selectedElementIds,
    selectedLabelIds,
    customImageUrl,
    selectedFileName: selectedFile?.name ?? null,
    slots,
    busy,
    exportBusy,
    actionError,
    actionStatus,
    previewImageUrl,
    exportOpen,
    setExportOpen,
    setCustomImageUrl,
    setTargetLayer,
    setEditTarget,
    clearSelection,
    handleSelectCells,
    handleSelectElements,
    handleSelectLabels,
    handleChangeSettings,
    handleRandomGenerate,
    handleApplySize,
    initializeDefaultMapColumns,
    handleResetMap,
    handleClearLayer,
    handleClearLabels,
    handleReplaceSelectedTiles,
    handleRestoreSelectedTiles,
    handlePlaceElement,
    handleAddLabel,
    handleApplyCustomImage,
    handleRotateSelected,
    handleMirrorSelected,
    handleRestoreSelected,
    handleDeleteSelectedElements,
    handleDeleteSelectedLabels,
    handleMoveElements,
    handleMoveLabels,
    handleResizeElement,
    handleResizeLabel,
    handleUpdateLabelText,
    handleImageLoadError,
    handleSaveSlot,
    handleDownloadProjectFile,
    handleChooseProjectFile,
    handleLoadProjectFile,
    handleLoadSlot,
    handleDownloadImage,
  };
}
