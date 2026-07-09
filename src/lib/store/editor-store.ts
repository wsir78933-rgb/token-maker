import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type PersistStorage,
  type StorageValue,
} from 'zustand/middleware';
import { getBorderById } from '@/lib/templates/borders';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import type { BorderLibraryMode, EditorStore, EditorState, StylePreset } from '@/types/editor';

type PersistedEditorState = Partial<Omit<EditorState, 'imageElement'>>;

function isImageBorderSelection(
  borderId: string,
  customBorders: EditorState['customBorders']
) {
  const border = getBorderById(borderId) ?? customBorders.find((item) => item.id === borderId);
  return border?.type === 'image';
}

function getLinkedMaskId(
  borderId: string,
  customBorders: EditorState['customBorders']
) {
  const border = getBorderById(borderId) ?? customBorders.find((item) => item.id === borderId);
  return border?.linkedMaskId ?? null;
}

function getBorderLibraryModeForPreset(preset: StylePreset): BorderLibraryMode {
  return preset.id === 'other' ? 'competitor' : 'default';
}

function revokeOwnedObjectUrl(url: string | null, nextUrl?: string | null) {
  if (
    !url ||
    url === nextUrl ||
    !url.startsWith('blob:') ||
    typeof URL === 'undefined' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return;
  }

  URL.revokeObjectURL(url);
}

const DEFAULT_PRESET = STYLE_PRESETS.find((preset) => preset.id === 'other') ?? STYLE_PRESETS[0]!;

function getBrowserStorage() {
  const storage = typeof window === 'undefined' ? undefined : window.localStorage;

  if (
    !storage ||
    typeof storage.getItem !== 'function' ||
    typeof storage.setItem !== 'function' ||
    typeof storage.removeItem !== 'function'
  ) {
    throw new Error('localStorage is unavailable');
  }

  return storage;
}

function isTemporaryCustomBorderId(borderId: string) {
  return borderId.startsWith('custom-border-');
}

function isTemporaryCustomBorderSelection(
  borderId: string,
  customBorders: EditorState['customBorders']
) {
  return isTemporaryCustomBorderId(borderId) || customBorders.some((border) => border.id === borderId);
}

function revokeCustomBorderObjectUrls(customBorders: EditorState['customBorders']) {
  customBorders.forEach((border) => revokeOwnedObjectUrl(border.customImageUrl ?? null));
}

const INITIAL_STATE: Omit<EditorState, 'imageElement'> = {
  imageUrl: null,
  imageLoadRevision: 0,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageScale: 1,

  selectedBorderId: DEFAULT_PRESET.borderId,
  selectedMaskId: DEFAULT_PRESET.maskId,
  customBorders: [],
  borderLibraryMode: getBorderLibraryModeForPreset(DEFAULT_PRESET),

  borderTint: DEFAULT_PRESET.borderTint,
  imageBorderTintEnabled: !isImageBorderSelection(DEFAULT_PRESET.borderId, []),
  textColor: '#ffffff',
  overlayTint: DEFAULT_PRESET.overlayTint,
  borderOpacity: DEFAULT_PRESET.borderOpacity,
  overlayOpacity: DEFAULT_PRESET.overlayOpacity,

  textBoxes: [],
  selectedTextId: null,
  isImageSelected: false,
  exportSize: 256,
  activePresetId: DEFAULT_PRESET.id,
  renderRevision: 0,
};

function getPersistedTemplateState(state: EditorState) {
  if (!isTemporaryCustomBorderSelection(state.selectedBorderId, state.customBorders)) {
    return {
      selectedBorderId: state.selectedBorderId,
      selectedMaskId: state.selectedMaskId,
      borderLibraryMode: state.borderLibraryMode,
      imageBorderTintEnabled: state.imageBorderTintEnabled,
      activePresetId: state.activePresetId,
    };
  }

  return {
    selectedBorderId: DEFAULT_PRESET.borderId,
    selectedMaskId: DEFAULT_PRESET.maskId,
    borderLibraryMode: getBorderLibraryModeForPreset(DEFAULT_PRESET),
    imageBorderTintEnabled: !isImageBorderSelection(DEFAULT_PRESET.borderId, []),
    activePresetId: null,
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasPersistedCustomBorder(persistedState: Record<string, unknown>) {
  const persistedSelectedBorderId = persistedState.selectedBorderId;
  const persistedCustomBorders = persistedState.customBorders;

  return (
    (typeof persistedSelectedBorderId === 'string' &&
      isTemporaryCustomBorderId(persistedSelectedBorderId)) ||
    (Array.isArray(persistedCustomBorders) && persistedCustomBorders.length > 0)
  );
}

function sanitizePersistedEditorState(persistedState: Record<string, unknown>): PersistedEditorState {
  const sanitizedPersistedState = { ...persistedState };
  delete sanitizedPersistedState.customBorders;

  if (
    typeof sanitizedPersistedState.selectedBorderId === 'string' &&
    isTemporaryCustomBorderId(sanitizedPersistedState.selectedBorderId)
  ) {
    return {
      ...sanitizedPersistedState,
      selectedBorderId: DEFAULT_PRESET.borderId,
      selectedMaskId: DEFAULT_PRESET.maskId,
      borderLibraryMode: getBorderLibraryModeForPreset(DEFAULT_PRESET),
      imageBorderTintEnabled: !isImageBorderSelection(DEFAULT_PRESET.borderId, []),
      activePresetId: null,
    };
  }

  return sanitizedPersistedState;
}

function sanitizeStoredEditorValue(
  storedValue: StorageValue<PersistedEditorState> | null
): StorageValue<PersistedEditorState> | null {
  if (!storedValue || !isObjectRecord(storedValue.state)) {
    return storedValue;
  }

  if (!hasPersistedCustomBorder(storedValue.state)) {
    return storedValue;
  }

  return {
    ...storedValue,
    state: sanitizePersistedEditorState(storedValue.state),
  };
}

function createEditorStorage(): PersistStorage<PersistedEditorState> | undefined {
  const jsonStorage = createJSONStorage<PersistedEditorState>(getBrowserStorage);
  if (!jsonStorage) {
    return undefined;
  }

  return {
    getItem: (name) => {
      const storedValue = jsonStorage.getItem(name);
      if (storedValue instanceof Promise) {
        return storedValue.then((resolvedStoredValue) => {
          const sanitizedStoredValue = sanitizeStoredEditorValue(resolvedStoredValue);
          if (sanitizedStoredValue && sanitizedStoredValue !== resolvedStoredValue) {
            jsonStorage.setItem(name, sanitizedStoredValue);
          }
          return sanitizedStoredValue;
        });
      }

      const sanitizedStoredValue = sanitizeStoredEditorValue(storedValue);
      if (sanitizedStoredValue && sanitizedStoredValue !== storedValue) {
        jsonStorage.setItem(name, sanitizedStoredValue);
      }
      return sanitizedStoredValue;
    },
    setItem: jsonStorage.setItem,
    removeItem: jsonStorage.removeItem,
  };
}

function mergePersistedEditorState(persistedState: unknown, currentState: EditorStore): EditorStore {
  if (!isObjectRecord(persistedState)) {
    return currentState;
  }

  const mergedState = {
    ...currentState,
    ...persistedState,
    imageElement: null,
    customBorders: [],
  } as EditorStore;

  if (isTemporaryCustomBorderId(mergedState.selectedBorderId)) {
    return {
      ...mergedState,
      ...getPersistedTemplateState({
        ...mergedState,
        customBorders: [],
      }),
    };
  }

  return mergedState;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      imageElement: null,

      // --- 图片 ---
      beginImageLoad: () => {
        let nextRevision = 0;
        set((state) => {
          nextRevision = state.imageLoadRevision + 1;
          return { imageLoadRevision: nextRevision };
        });
        return nextRevision;
      },
      cancelImageLoad: () =>
        set((state) => ({ imageLoadRevision: state.imageLoadRevision + 1 })),
      setImage: (url, element) =>
        set((state) => {
          revokeOwnedObjectUrl(state.imageUrl, url);

          return {
            imageUrl: url,
            imageElement: element,
            imageLoadRevision: state.imageLoadRevision + 1,
            imageOffsetX: 0,
            imageOffsetY: 0,
            imageScale: 1,
            isImageSelected: true,
            selectedTextId: null,
          };
        }),
      clearImage: () =>
        set((state) => {
          revokeOwnedObjectUrl(state.imageUrl);

          return {
            imageUrl: null,
            imageElement: null,
            imageLoadRevision: state.imageLoadRevision + 1,
            isImageSelected: false,
          };
        }),
      setImageSelected: (selected) => set({ isImageSelected: selected }),
      setImageOffset: (x, y) => set({ imageOffsetX: x, imageOffsetY: y }),
      setImageScale: (scale) => set({ imageScale: scale }),
      resetPosition: () => set({ imageOffsetX: 0, imageOffsetY: 0, imageScale: 1, isImageSelected: true }),

      // --- 模板 ---
      setSelectedBorder: (id) =>
        set((state) => ({
          selectedBorderId: id,
          selectedMaskId: getLinkedMaskId(id, state.customBorders) ?? state.selectedMaskId,
          imageBorderTintEnabled: !isImageBorderSelection(id, state.customBorders),
          activePresetId: null,
        })),
      setSelectedMask: (id) =>
        set({
          selectedMaskId: id,
          activePresetId: null,
        }),
      addCustomBorder: (template) =>
        set((state) => ({ customBorders: [...state.customBorders, template] })),
      removeCustomBorder: (id) =>
        set((state) => {
          const removedBorder = state.customBorders.find((border) => border.id === id);
          revokeOwnedObjectUrl(removedBorder?.customImageUrl ?? null);

          return {
            customBorders: state.customBorders.filter((border) => border.id !== id),
            selectedBorderId: state.selectedBorderId === id ? 'none' : state.selectedBorderId,
            imageBorderTintEnabled: state.selectedBorderId === id ? true : state.imageBorderTintEnabled,
          };
        }),
      setBorderLibraryMode: (mode) => set({ borderLibraryMode: mode }),

      // --- 样式 ---
      setBorderTint: (color) =>
        set({ borderTint: color, imageBorderTintEnabled: true, activePresetId: null }),
      setTextColor: (color) => set({ textColor: color }),
      setOverlayTint: (color) => set({ overlayTint: color, activePresetId: null }),
      setBorderOpacity: (opacity) => set({ borderOpacity: opacity, activePresetId: null }),
      setOverlayOpacity: (opacity) => set({ overlayOpacity: opacity, activePresetId: null }),

      // --- 文字 ---
      setSelectedText: (id) => set({ selectedTextId: id, isImageSelected: id === null }),
      addTextBox: (defaultContent) =>
        set((state) => {
          const newId = Date.now().toString();
          return {
            textBoxes: [
              ...state.textBoxes,
              {
                id: newId,
                content: defaultContent,
                x: 256, // 默认居中 (基于 512 预览尺寸)
                y: 450,
                fontSize: 48,
                fontWeight: 700,
                color: state.textColor,
                align: 'center',
              },
            ],
            selectedTextId: newId,
            isImageSelected: false,
          };
        }),
      removeTextBox: (id) =>
        set((state) => ({
          textBoxes: state.textBoxes.filter((t) => t.id !== id),
          selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
          isImageSelected: state.selectedTextId === id ? true : state.isImageSelected,
        })),
      updateTextBox: (id, updates) =>
        set((state) => ({
          textBoxes: state.textBoxes.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      // --- 导出 ---
      setExportSize: (size) => set({ exportSize: size }),

      // --- 预设 ---
      applyPreset: (preset: StylePreset) =>
        set((state) => ({
          selectedBorderId: preset.borderId,
          selectedMaskId: preset.maskId,
          borderTint: preset.borderTint,
          imageBorderTintEnabled: !isImageBorderSelection(preset.borderId, state.customBorders),
          overlayTint: preset.overlayTint,
          borderOpacity: preset.borderOpacity,
          overlayOpacity: preset.overlayOpacity,
          borderLibraryMode: getBorderLibraryModeForPreset(preset),
          activePresetId: preset.id,
        })),

      // --- 全局 ---
      resetAll: () =>
        set((state) => {
          revokeOwnedObjectUrl(state.imageUrl);
          revokeCustomBorderObjectUrls(state.customBorders);

          return {
            ...INITIAL_STATE,
            imageElement: null,
            imageLoadRevision: state.imageLoadRevision + 1,
          };
        }),
    }),
    {
      name: 'token-maker-storage',
      storage: createEditorStorage(),
      merge: mergePersistedEditorState,
      // 不持久化 imageElement (因为是 DOM 对象) 和 imageUrl (如果是 objectURL)
      partialize: (state) => {
        const persistedTemplateState = getPersistedTemplateState(state);

        return {
          imageUrl: state.imageUrl?.startsWith('blob:') ? null : state.imageUrl,
          imageOffsetX: state.imageOffsetX,
          imageOffsetY: state.imageOffsetY,
          imageScale: state.imageScale,
          selectedBorderId: persistedTemplateState.selectedBorderId,
          selectedMaskId: persistedTemplateState.selectedMaskId,
          borderLibraryMode: persistedTemplateState.borderLibraryMode,
          borderTint: state.borderTint,
          imageBorderTintEnabled: persistedTemplateState.imageBorderTintEnabled,
          textColor: state.textColor,
          overlayTint: state.overlayTint,
          borderOpacity: state.borderOpacity,
          overlayOpacity: state.overlayOpacity,
          textBoxes: state.textBoxes,
          selectedTextId: state.selectedTextId,
          activePresetId: persistedTemplateState.activePresetId,
        };
      },
    }
  )
);
