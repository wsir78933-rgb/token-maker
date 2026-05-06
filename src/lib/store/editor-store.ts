import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getBorderById } from '@/lib/templates/borders';
import { STYLE_PRESETS } from '@/lib/templates/presets';
import type { BorderLibraryMode, EditorStore, EditorState, StylePreset } from '@/types/editor';

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
  if (!url || url === nextUrl || !url.startsWith('blob:') || typeof URL === 'undefined') {
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
        set((state) => ({
          customBorders: state.customBorders.filter((b) => b.id !== id),
          selectedBorderId: state.selectedBorderId === id ? 'none' : state.selectedBorderId,
          imageBorderTintEnabled: state.selectedBorderId === id ? true : state.imageBorderTintEnabled,
        })),
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
      addTextBox: () =>
        set((state) => {
          const newId = Date.now().toString();
          return {
            textBoxes: [
              ...state.textBoxes,
              {
                id: newId,
                content: 'New Text',
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

          return {
            ...INITIAL_STATE,
            imageElement: null,
            imageLoadRevision: state.imageLoadRevision + 1,
          };
        }),
    }),
    {
      name: 'token-maker-storage',
      storage: createJSONStorage(getBrowserStorage),
      // 不持久化 imageElement (因为是 DOM 对象) 和 imageUrl (如果是 objectURL)
      partialize: (state) => {
        return {
          imageUrl: state.imageUrl?.startsWith('blob:') ? null : state.imageUrl,
          imageOffsetX: state.imageOffsetX,
          imageOffsetY: state.imageOffsetY,
          imageScale: state.imageScale,
          selectedBorderId: state.selectedBorderId,
          selectedMaskId: state.selectedMaskId,
          customBorders: state.customBorders,
          borderLibraryMode: state.borderLibraryMode,
          borderTint: state.borderTint,
          imageBorderTintEnabled: state.imageBorderTintEnabled,
          textColor: state.textColor,
          overlayTint: state.overlayTint,
          borderOpacity: state.borderOpacity,
          overlayOpacity: state.overlayOpacity,
          textBoxes: state.textBoxes,
          selectedTextId: state.selectedTextId,
          activePresetId: state.activePresetId,
        };
      },
    }
  )
);
