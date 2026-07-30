import { create } from 'zustand';
import { createCoatMakerShowcaseProject, createDefaultProject, createInitialCoatProject } from './assets';
import {
  applyProjectCommand,
  assertCoatProject,
  createRandomCoatProject,
  type CoatProjectCommand,
  type RandomValueSource,
} from './commands';
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

export interface CoatDrawingSettings {
  isActive: boolean;
  color: string;
  strokeWidth: number;
}

export interface CoatProjectStore {
  project: CoatProject;
  history: CoatProjectHistory;
  isInitialDocument: boolean;
  selectedLayerIds: string[];
  drawingSettings: CoatDrawingSettings;
  setSelectedLayerIds: (layerIds: string[]) => void;
  setDrawingSettings: (settings: CoatDrawingSettings) => void;
  dispatch: (command: CoatProjectCommand) => void;
  undo: () => void;
  redo: () => void;
  replaceProject: (project: CoatProject) => void;
  initializeLocale: (locale: CoatLocale) => void;
  initializeShowcaseProject: (locale: CoatLocale) => void;
  hydrateDraft: (locale: CoatLocale) => boolean;
  readDraft: () => CoatProject | null;
  inspectDraft: () => CoatProjectDraftInspection;
  saveDraft: () => void;
  discardDraft: () => void;
  randomizeProject: (randomValue?: RandomValueSource) => void;
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
    drawingSettings: { isActive: false, color: '#004E89', strokeWidth: 3 },
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
      const nextHistory = applyProjectHistoryCommand(get().history, command);
      persistProjectDraft(nextHistory.present);
      set({
        history: nextHistory,
        project: nextHistory.present,
        isInitialDocument: false,
        selectedLayerIds: keepExistingSelectedLayerIds(nextHistory.present, get().selectedLayerIds),
      });
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
    discardDraft: () => {
      if (hasCoatProjectBrowserStorage()) discardProjectDraft();
    },
    randomizeProject: (randomValue) => {
      const randomProject = createRandomCoatProject(get().project.locale, randomValue);
      const randomHistory = createProjectHistory(randomProject);
      persistProjectDraft(randomHistory.present);
      set({ history: randomHistory, project: randomHistory.present, isInitialDocument: false, selectedLayerIds: [] });
    },
  };
});

function persistProjectDraft(project: CoatProject): void {
  if (hasCoatProjectBrowserStorage()) saveProjectDraft(project);
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
  if (!isRecord(settings) || Object.keys(settings).length !== 3
    || typeof settings.isActive !== 'boolean'
    || typeof settings.color !== 'string'
    || !/^#[0-9A-Fa-f]{6}$/.test(settings.color)
    || typeof settings.strokeWidth !== 'number'
    || !Number.isFinite(settings.strokeWidth)
    || settings.strokeWidth < 0.5
    || settings.strokeWidth > 20) {
    throw new Error(`Invalid drawing settings: ${String(settings)}`);
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
