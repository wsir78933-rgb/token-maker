// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import {
  EDITOR_PREFERENCES_STORAGE_KEY,
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
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: ['not-a-colour'],
      backgroundGradient: null,
    })).toThrow('not-a-colour');
    expect(() => saveEditorPreferences({
      version: 1,
      canvasPreset: 'square',
      jpegQuality: 'high',
      customPalette: [],
      backgroundGradient: { angle: 361, startColor: '#004E89', endColor: '#B11F24' },
    })).toThrow('361');
  });

  it('applies each patch to the latest validated browser-local preferences', () => {
    saveEditorPreferences({
      version: 1,
      canvasPreset: 'square',
      jpegQuality: 'ultra',
      customPalette: [],
      backgroundGradient: null,
    });

    updateEditorPreferences((preferences) => ({ ...preferences, canvasPreset: 'instagram-story' }));
    updateEditorPreferences((preferences) => ({ ...preferences, customPalette: ['#123456'] }));

    expect(loadEditorPreferences()).toMatchObject({
      canvasPreset: 'instagram-story',
      jpegQuality: 'ultra',
      customPalette: ['#123456'],
    });
  });
});
