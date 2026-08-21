// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import {
  EDITOR_PREFERENCES_STORAGE_KEY,
  getMatchingEditorCanvasPresetId,
  loadEditorPreferences,
  saveEditorPreferences,
  updateEditorPreferences,
} from './editor-preferences';

describe('editor preferences', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('migrates the known version zero browser payload into the current version', () => {
    window.localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      jpegQuality: 'ultra',
      customPalette: ['#004E89'],
    }));

    expect(loadEditorPreferences()).toEqual({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      exportSize: 1024,
      jpegQuality: 'ultra',
      customPalette: ['#004E89'],
      backgroundGradient: null,
    });
    expect(JSON.parse(window.localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({ version: 1 });
  });

  it('adds the default export size to an existing version one local preference document', () => {
    window.localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    }));

    expect(loadEditorPreferences()).toMatchObject({ exportSize: 1024 });
    expect(JSON.parse(window.localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) ?? '')).toMatchObject({ exportSize: 1024 });
  });

  it('rejects an invalid persisted export quality with its value', () => {
    window.localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, '{"jpegQuality":"bad"}');

    expect(() => loadEditorPreferences()).toThrow('bad');
  });

  it('rejects malformed colours and gradient values instead of replacing them with defaults', () => {
    expect(() => saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: ['not-a-colour'],
      backgroundGradient: null,
    })).toThrow('not-a-colour');
    expect(() => saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: { angle: 361, startColor: '#004E89', endColor: '#B11F24' },
    })).toThrow('361');
  });

  it('applies each patch to the latest validated browser-local preferences', () => {
    saveEditorPreferences({
      version: 1,
      appearance: 'dark',
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'ultra',
      customPalette: [],
      backgroundGradient: null,
    });

    updateEditorPreferences((preferences) => ({ ...preferences, canvasPreset: '3-5' }));
    updateEditorPreferences((preferences) => ({ ...preferences, customPalette: ['#123456'] }));

    expect(loadEditorPreferences()).toMatchObject({
      canvasPreset: '3-5',
      jpegQuality: 'ultra',
      customPalette: ['#123456'],
    });
  });

  it('adds appearance and color picker defaults to an existing version one document', () => {
    window.localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      canvasPreset: 'square',
      exportSize: 1024,
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    }));

    expect(loadEditorPreferences()).toMatchObject({
      appearance: 'dark',
      colorPickerMode: 'simple',
    });
  });

  it('rewrites a retired canvas preset id to custom', () => {
    window.localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify({
      version: 1,
      canvasPreset: 'portrait',
      exportSize: 1024,
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    }));

    expect(loadEditorPreferences().canvasPreset).toBe('custom');
  });

  it('rejects an invalid appearance with its value', () => {
    expect(() => saveEditorPreferences({
      version: 1,
      appearance: 'neon' as never,
      colorPickerMode: 'simple',
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: null,
    })).toThrow('neon');
  });

  it('matches a competitor canvas preset by exact width and height', () => {
    expect(getMatchingEditorCanvasPresetId(1800, 1080)).toBe('3-5');
    expect(getMatchingEditorCanvasPresetId(1200, 1200)).toBe('custom');
  });
});
