import type { BackgroundGradient } from './types';

export const EDITOR_PREFERENCES_STORAGE_KEY = 'coat-maker-editor-preferences';
export const EDITOR_PREFERENCES_VERSION = 1;

export const editorCanvasPresets = [
  { id: 'square', width: 1200, height: 1200 },
  { id: 'instagram-story', width: 1080, height: 1920 },
  { id: 'portrait', width: 1080, height: 1350 },
  { id: 'landscape', width: 1920, height: 1080 },
] as const;

export type EditorCanvasPresetId = typeof editorCanvasPresets[number]['id'] | 'custom';
export type EditorJpegQuality = 'low' | 'medium' | 'high' | 'ultra';
export const editorExportSizes = [256, 512, 1024, 2048] as const;
export type EditorExportSize = typeof editorExportSizes[number];

export type EditorBackgroundGradient = BackgroundGradient;

export interface EditorPreferences {
  version: typeof EDITOR_PREFERENCES_VERSION;
  canvasPreset: EditorCanvasPresetId;
  exportSize?: EditorExportSize;
  jpegQuality: EditorJpegQuality;
  customPalette: string[];
  backgroundGradient: EditorBackgroundGradient | null;
}

const defaultEditorPreferences: EditorPreferences = {
  version: EDITOR_PREFERENCES_VERSION,
  canvasPreset: 'square',
  exportSize: 1024,
  jpegQuality: 'high',
  customPalette: [],
  backgroundGradient: null,
};

export function getDefaultEditorPreferences(): EditorPreferences {
  return cloneEditorPreferences(defaultEditorPreferences);
}

/** Loads only a known, validated browser-local preference document. */
export function loadEditorPreferences(): EditorPreferences {
  const browserStorage = getBrowserLocalStorage();
  const serializedPreferences = browserStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY);
  if (serializedPreferences === null) return getDefaultEditorPreferences();
  const parsedPreferences = parseEditorPreferences(serializedPreferences);
  const isVersionZeroPreferences = isRecord(parsedPreferences) && !Object.hasOwn(parsedPreferences, 'version');
  const isVersionOnePreferencesWithoutExportSize = isRecord(parsedPreferences)
    && parsedPreferences.version === EDITOR_PREFERENCES_VERSION
    && !Object.hasOwn(parsedPreferences, 'exportSize');
  const preferences = isVersionZeroPreferences
    ? migrateVersionZeroEditorPreferences(parsedPreferences)
    : isVersionOnePreferencesWithoutExportSize
      ? migrateVersionOneEditorPreferences(parsedPreferences)
    : assertCurrentEditorPreferences(parsedPreferences);
  if (preferences.version !== EDITOR_PREFERENCES_VERSION) {
    throw new Error(`Unsupported editor preferences version: ${String(preferences.version)}`);
  }
  if (isVersionZeroPreferences || isVersionOnePreferencesWithoutExportSize) {
    browserStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }
  return cloneEditorPreferences(preferences);
}

/** Persists validated settings only in this browser; no remote storage is used. */
export function saveEditorPreferences(preferences: EditorPreferences): void {
  assertEditorPreferences(preferences);
  getBrowserLocalStorage().setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

/** Reads, validates, and rewrites one browser-local preference document without using a UI snapshot. */
export function updateEditorPreferences(
  update: (preferences: EditorPreferences) => EditorPreferences,
): EditorPreferences {
  if (typeof update !== 'function') throw new Error(`Invalid editor preferences update: ${String(update)}`);
  const currentPreferences = loadEditorPreferences();
  const updatedPreferences = update(currentPreferences);
  saveEditorPreferences(updatedPreferences);
  return cloneEditorPreferences(updatedPreferences);
}

export function getEditorCanvasPreset(presetId: EditorCanvasPresetId) {
  const preset = editorCanvasPresets.find((candidate) => candidate.id === presetId);
  if (!preset) throw new Error(`Unknown editor canvas preset: ${String(presetId)}`);
  return preset;
}

function parseEditorPreferences(serializedPreferences: string): unknown {
  try {
    return JSON.parse(serializedPreferences);
  } catch {
    throw new Error(`Invalid editor preferences JSON: ${serializedPreferences}`);
  }
}

function migrateVersionZeroEditorPreferences(preferences: Record<string, unknown>): EditorPreferences {
  assertExactKeys(preferences, ['jpegQuality', 'customPalette', 'backgroundGradient'], 'version zero editor preferences');
  const migratedPreferences: EditorPreferences = {
    version: EDITOR_PREFERENCES_VERSION,
    canvasPreset: 'square',
    exportSize: 1024,
    jpegQuality: preferences.jpegQuality as EditorJpegQuality,
    customPalette: preferences.customPalette as string[],
    backgroundGradient: (preferences.backgroundGradient ?? null) as EditorBackgroundGradient | null,
  };
  assertEditorPreferences(migratedPreferences);
  return migratedPreferences;
}

function migrateVersionOneEditorPreferences(preferences: Record<string, unknown>): EditorPreferences {
  const migratedPreferences: EditorPreferences = { ...preferences, exportSize: 1024 } as EditorPreferences;
  assertEditorPreferences(migratedPreferences);
  return migratedPreferences;
}

function assertCurrentEditorPreferences(preferences: unknown): EditorPreferences {
  assertEditorPreferences(preferences);
  return preferences;
}

function assertEditorPreferences(preferences: unknown): asserts preferences is EditorPreferences {
  if (!isRecord(preferences)) throw new Error(`Invalid editor preferences: ${String(preferences)}`);
  assertExactKeys(preferences, ['version', 'canvasPreset', 'exportSize', 'jpegQuality', 'customPalette', 'backgroundGradient'], 'editor preferences');
  if (preferences.version !== EDITOR_PREFERENCES_VERSION) {
    throw new Error(`Unsupported editor preferences version: ${String(preferences.version)}`);
  }
  if (preferences.canvasPreset !== 'custom' && !editorCanvasPresets.some((preset) => preset.id === preferences.canvasPreset)) {
    throw new Error(`Invalid editor canvas preset: ${String(preferences.canvasPreset)}`);
  }
  if (preferences.exportSize !== undefined && !editorExportSizes.includes(preferences.exportSize as EditorExportSize)) {
    throw new Error(`Invalid editor export size: ${String(preferences.exportSize)}`);
  }
  if (!['low', 'medium', 'high', 'ultra'].includes(preferences.jpegQuality as string)) {
    throw new Error(`Invalid editor JPEG quality: ${String(preferences.jpegQuality)}`);
  }
  assertCustomPalette(preferences.customPalette);
  assertBackgroundGradient(preferences.backgroundGradient);
}

function assertCustomPalette(customPalette: unknown): asserts customPalette is string[] {
  if (!Array.isArray(customPalette)) throw new Error(`Invalid editor custom palette: ${String(customPalette)}`);
  const normalizedColors = new Set<string>();
  for (const color of customPalette) {
    assertHexColor(color, 'editor custom palette color');
    const normalizedColor = color.toUpperCase();
    if (normalizedColors.has(normalizedColor)) {
      throw new Error(`Duplicate editor custom palette color: ${color}`);
    }
    normalizedColors.add(normalizedColor);
  }
}

function assertBackgroundGradient(gradient: unknown): asserts gradient is EditorBackgroundGradient | null {
  if (gradient === null) return;
  if (!isRecord(gradient)) throw new Error(`Invalid editor background gradient: ${String(gradient)}`);
  assertExactKeys(gradient, ['angle', 'startColor', 'endColor'], 'editor background gradient');
  if (typeof gradient.angle !== 'number' || !Number.isFinite(gradient.angle) || gradient.angle < 0 || gradient.angle > 360) {
    throw new Error(`Invalid editor background gradient angle: ${String(gradient.angle)}`);
  }
  assertHexColor(gradient.startColor, 'editor background gradient start color');
  assertHexColor(gradient.endColor, 'editor background gradient end color');
}

function assertHexColor(color: unknown, label: string): asserts color is string {
  if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error(`Invalid ${label}: ${String(color)}`);
  }
}

function cloneEditorPreferences(preferences: EditorPreferences): EditorPreferences {
  return {
    ...preferences,
    customPalette: [...preferences.customPalette],
    backgroundGradient: preferences.backgroundGradient ? { ...preferences.backgroundGradient } : null,
  };
}

function getBrowserLocalStorage(): Storage {
  const browserStorage = globalThis.localStorage;
  if (!browserStorage || typeof browserStorage.getItem !== 'function' || typeof browserStorage.setItem !== 'function') {
    throw new Error('Browser localStorage is unavailable for editor preferences');
  }
  return browserStorage;
}

function assertExactKeys(record: Record<string, unknown>, allowedKeys: readonly string[], label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowedKeys.includes(key)) throw new Error(`Invalid ${label} property: ${key}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
