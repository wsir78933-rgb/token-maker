import { create } from 'zustand';
import { createCoatMakerShowcaseProject, createDefaultProject, createInitialCoatProject } from './assets';
import {
  applyProjectCommand,
  assertCoatProject,
  createRandomCoatProject,
  type CoatProjectCommand,
  type RandomValueSource,
} from './commands';
import { deleteLocalUploadBlobsNotInProjects } from './local-upload-blobs';
import {
  discardProjectDraft,
  hasCoatProjectBrowserStorage,
  inspectProjectDraft,
  loadProjectDraft,
  saveProjectDraft,
  type CoatProjectDraftInspection,
} from './project-storage';
import type { CoatLocale, CoatProject } from './types';

export interface CoatProjectHistory {
  past: CoatProject[];
  present: CoatProject;
  future: CoatProject[];
}

export interface CoatProjectDispatchResult {
  createdLayerId?: string;
}

export interface CoatDrawingSettings {
  isActive: boolean;
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface CoatProjectStore {
  project: CoatProject;
  history: CoatProjectHistory;
  isInitialDocument: boolean;
  selectedLayerIds: string[];
  drawingSettings: CoatDrawingSettings;
  setSelectedLayerIds: (layerIds: string[]) => void;
  setDrawingSettings: (settings: CoatDrawingSettings) => void;
  dispatch: (command: CoatProjectCommand) => CoatProjectDispatchResult;
  undo: () => void;
  redo: () => void;
  replaceProject: (project: CoatProject) => Promise<void>;
  initializeLocale: (locale: CoatLocale) => void;
  initializeShowcaseProject: (locale: CoatLocale) => void;
  hydrateDraft: (locale: CoatLocale) => boolean;
  readDraft: () => CoatProject | null;
  inspectDraft: () => CoatProjectDraftInspection;
  saveDraft: () => void;
  discardDraft: () => Promise<void>;
  randomizeProject: (randomValue?: RandomValueSource) => Promise<void>;
}

export function createProjectHistory(project: CoatProject): CoatProjectHistory {
  assertCoatProject(project);
  return freezeHistory({ past: [], present: cloneProject(project), future: [] });
}

export function applyProjectHistoryCommand(
  history: CoatProjectHistory,
  command: CoatProjectCommand,
): CoatProjectHistory {
  assertCoatProjectHistory(history);
  const isolatedHistory = cloneHistory(history);
  const nextProject = applyProjectCommand(isolatedHistory.present, command);
  return freezeHistory({
    past: [...isolatedHistory.past, cloneProject(isolatedHistory.present)],
    present: cloneProject(nextProject),
    future: [],
  });
}

export function undoProject(history: CoatProjectHistory): CoatProjectHistory {
  assertCoatProjectHistory(history);
  const isolatedHistory = cloneHistory(history);
  const previousProject = isolatedHistory.past.at(-1);
  if (!previousProject) return freezeHistory(isolatedHistory);
  return freezeHistory({
    past: isolatedHistory.past.slice(0, -1),
    present: cloneProject(previousProject),
    future: [cloneProject(isolatedHistory.present), ...isolatedHistory.future],
  });
}

export function redoProject(history: CoatProjectHistory): CoatProjectHistory {
  assertCoatProjectHistory(history);
  const isolatedHistory = cloneHistory(history);
  const nextProject = isolatedHistory.future[0];
  if (!nextProject) return freezeHistory(isolatedHistory);
  return freezeHistory({
    past: [...isolatedHistory.past, cloneProject(isolatedHistory.present)],
    present: cloneProject(nextProject),
    future: isolatedHistory.future.slice(1),
  });
}

export const useCoatProjectStore = create<CoatProjectStore>()((set, get) => {
  const initialHistory = createProjectHistory(createInitialCoatProject());
  return {
    project: initialHistory.present,
    history: initialHistory,
    isInitialDocument: true,
    selectedLayerIds: [],
    drawingSettings: { isActive: false, color: '#000000', strokeWidth: 10, opacity: 1 },
    setSelectedLayerIds: (layerIds) => {
      if (!Array.isArray(layerIds)) throw new Error(`Invalid selected layer ids: ${String(layerIds)}`);
      const selectedIds = new Set<string>();
      for (const layerId of layerIds) {
        if (typeof layerId !== 'string' || layerId.trim().length === 0) {
          throw new Error(`Invalid selected layer id: ${String(layerId)}`);
        }
        selectedIds.add(layerId);
      }
      set({ selectedLayerIds: get().project.layers.filter((layer) => selectedIds.has(layer.id)).map((layer) => layer.id) });
    },
    setDrawingSettings: (settings) => {
      assertDrawingSettings(settings);
      set({ drawingSettings: { ...settings, color: settings.color.toUpperCase() } });
    },
    dispatch: (command) => {
      const currentHistory = get().history;
      const nextHistory = applyProjectHistoryCommand(currentHistory, command);
      const createdLayerId = findCreatedLayerId(currentHistory.present, nextHistory.present, command);
      persistProjectDraft(nextHistory.present);
      set({
        history: nextHistory,
        project: nextHistory.present,
        isInitialDocument: false,
        selectedLayerIds: keepExistingSelectedLayerIds(nextHistory.present, get().selectedLayerIds),
      });
      return createdLayerId === undefined ? {} : { createdLayerId };
    },
    undo: () => {
      const nextHistory = undoProject(get().history);
      persistProjectDraft(nextHistory.present);
      set({
        history: nextHistory,
        project: nextHistory.present,
        isInitialDocument: false,
        selectedLayerIds: keepExistingSelectedLayerIds(nextHistory.present, get().selectedLayerIds),
      });
    },
    redo: () => {
      const nextHistory = redoProject(get().history);
      persistProjectDraft(nextHistory.present);
      set({
        history: nextHistory,
        project: nextHistory.present,
        isInitialDocument: false,
        selectedLayerIds: keepExistingSelectedLayerIds(nextHistory.present, get().selectedLayerIds),
      });
    },
    replaceProject: (project) => {
      const nextHistory = createProjectHistory(project);
      persistProjectDraft(nextHistory.present);
      set({ history: nextHistory, project: nextHistory.present, isInitialDocument: false, selectedLayerIds: [] });
      return deleteLocalUploadBlobsNotInProjects(projectsInHistory(nextHistory));
    },
    initializeLocale: (locale) => {
      assertCoatLocale(locale);
      if (!get().isInitialDocument) return;
      const localizedHistory = createProjectHistory(createDefaultProject(locale));
      set({
        history: localizedHistory,
        project: localizedHistory.present,
        isInitialDocument: false,
        selectedLayerIds: [],
      });
    },
    initializeShowcaseProject: (locale) => {
      assertCoatLocale(locale);
      if (!get().isInitialDocument) return;
      const showcaseHistory = createProjectHistory(createCoatMakerShowcaseProject(locale));
      set({
        history: showcaseHistory,
        project: showcaseHistory.present,
        isInitialDocument: false,
        selectedLayerIds: [],
      });
    },
    hydrateDraft: (locale) => {
      assertCoatLocale(locale);
      if (!hasCoatProjectBrowserStorage()) return false;
      const projectDraft = loadProjectDraft();
      if (!projectDraft || projectDraft.locale !== locale) return false;
      const draftHistory = createProjectHistory(projectDraft);
      set({ history: draftHistory, project: draftHistory.present, isInitialDocument: false, selectedLayerIds: [] });
      return true;
    },
    readDraft: () => hasCoatProjectBrowserStorage() ? loadProjectDraft() : null,
    inspectDraft: () => hasCoatProjectBrowserStorage() ? inspectProjectDraft() : { status: 'missing' },
    saveDraft: () => {
      if (hasCoatProjectBrowserStorage()) saveProjectDraft(get().project);
    },
    discardDraft: async () => {
      const remainingProjects = projectsInHistory(get().history);
      if (hasCoatProjectBrowserStorage()) {
        await discardProjectDraft();
      }
      await deleteLocalUploadBlobsNotInProjects(remainingProjects);
    },
    randomizeProject: (randomValue) => {
      const randomProject = createRandomCoatProject(get().project.locale, randomValue);
      const randomHistory = createProjectHistory(randomProject);
      persistProjectDraft(randomHistory.present);
      set({ history: randomHistory, project: randomHistory.present, isInitialDocument: false, selectedLayerIds: [] });
      return deleteLocalUploadBlobsNotInProjects(projectsInHistory(randomHistory));
    },
  };
});

function persistProjectDraft(project: CoatProject): void {
  if (hasCoatProjectBrowserStorage()) saveProjectDraft(project);
}

function projectsInHistory(history: CoatProjectHistory): CoatProject[] {
  return [...history.past, history.present, ...history.future];
}

function findCreatedLayerId(
  previousProject: CoatProject,
  nextProject: CoatProject,
  command: CoatProjectCommand,
): string | undefined {
  if (command.type !== 'add-layer' && command.type !== 'add-drawing-layer' && command.type !== 'add-text-layer' && command.type !== 'add-image-layer') {
    return undefined;
  }
  const previousLayerIds = new Set(previousProject.layers.map((layer) => layer.id));
  const createdLayers = nextProject.layers.filter((layer) => !previousLayerIds.has(layer.id));
  if (createdLayers.length !== 1) {
    throw new Error(`Expected one created layer for command ${command.type}, received ${createdLayers.length}`);
  }
  return createdLayers[0]!.id;
}

function keepExistingSelectedLayerIds(project: CoatProject, selectedLayerIds: string[]): string[] {
  const currentLayerIds = new Set(project.layers.map((layer) => layer.id));
  return selectedLayerIds.filter((layerId) => currentLayerIds.has(layerId));
}

function assertCoatLocale(locale: unknown): asserts locale is CoatLocale {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Invalid coat locale: ${String(locale)}`);
  }
}

function assertDrawingSettings(settings: unknown): asserts settings is CoatDrawingSettings {
  if (!isRecord(settings)) throw new Error(`Invalid drawing settings: ${String(settings)}`);
  assertExactKeys(settings, ['isActive', 'color', 'strokeWidth', 'opacity'], 'drawing settings');
  if (typeof settings.isActive !== 'boolean') throw new Error(`Invalid drawing active state: ${String(settings.isActive)}`);
  assertDrawingColor(settings.color);
  assertDrawingStrokeWidth(settings.strokeWidth);
  assertDrawingOpacity(settings.opacity);
}

function assertDrawingColor(color: unknown): asserts color is string {
  if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error(`Invalid drawing color: ${String(color)}`);
  }
}

function assertDrawingStrokeWidth(strokeWidth: unknown): asserts strokeWidth is number {
  if (typeof strokeWidth !== 'number' || !Number.isFinite(strokeWidth) || strokeWidth < 1 || strokeWidth > 100) {
    throw new Error(`Invalid drawing stroke width: ${String(strokeWidth)}`);
  }
}

function assertDrawingOpacity(opacity: unknown): asserts opacity is number {
  if (typeof opacity !== 'number' || !Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new Error(`Invalid drawing opacity: ${String(opacity)}`);
  }
}

function assertCoatProjectHistory(history: unknown): asserts history is CoatProjectHistory {
  if (!isRecord(history)) throw new Error(`Invalid coat project history: ${String(history)}`);
  assertExactKeys(history, ['past', 'present', 'future'], 'coat project history');
  if (!Array.isArray(history.past) || !Array.isArray(history.future)) {
    throw new Error(`Invalid coat project history checkpoints: ${String(history)}`);
  }
  assertCoatProject(history.present);
  for (const project of history.past) assertCoatProject(project);
  for (const project of history.future) assertCoatProject(project);
}

function cloneHistory(history: CoatProjectHistory): CoatProjectHistory {
  return {
    past: history.past.map(cloneProject),
    present: cloneProject(history.present),
    future: history.future.map(cloneProject),
  };
}

function cloneProject(project: CoatProject): CoatProject {
  return JSON.parse(JSON.stringify(project)) as CoatProject;
}

function freezeHistory(history: CoatProjectHistory): CoatProjectHistory {
  return deepFreeze(history);
}

function deepFreeze<Value>(value: Value): Value {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertExactKeys(record: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const recordKey of Object.keys(record)) {
    if (!allowedKeys.includes(recordKey)) throw new Error(`Invalid ${label} property: ${recordKey}`);
  }
}
