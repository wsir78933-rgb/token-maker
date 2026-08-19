import { create } from 'zustand';
import {
  getDefaultEditorPreferences,
  loadEditorPreferences,
  updateEditorPreferences,
  type EditorPreferences,
} from './editor-preferences';

export interface EditorPreferencesSession {
  preferences: EditorPreferences;
  loadFromBrowser: () => EditorPreferences;
  patchPreferences: (update: (preferences: EditorPreferences) => EditorPreferences) => EditorPreferences;
}

/** In-memory session for editor chrome preferences already persisted in this browser. */
export const useEditorPreferencesStore = create<EditorPreferencesSession>((set) => ({
  preferences: getDefaultEditorPreferences(),
  loadFromBrowser: () => {
    const preferences = loadEditorPreferences();
    set({ preferences });
    return preferences;
  },
  patchPreferences: (update) => {
    const preferences = updateEditorPreferences(update);
    set({ preferences });
    return preferences;
  },
}));
