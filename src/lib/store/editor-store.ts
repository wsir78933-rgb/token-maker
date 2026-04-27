import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getBorderById } from '@/lib/templates/borders';
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

const INITIAL_STATE: Omit<EditorState, 'imageElement'> = {
  imageUrl: null,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageScale: 1,

  selectedBorderId: 'thick-ring',
  selectedMaskId: 'circle',
  customBorders: [],
  borderLibraryMode: 'default',

  borderTint: '#8b5cf6', // 默认偏紫色系
  imageBorderTintEnabled: false,
  textColor: '#ffffff',
  overlayTint: '#000000',
  borderOpacity: 1,
  overlayOpacity: 0,

  textBoxes: [],
  selectedTextId: null,
  isImageSelected: false,
  exportSize: 256,
  activePresetId: null,
  renderRevision: 0,
};

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      imageElement: null,

      // --- 图片 ---
      setImage: (url, element) =>
        set({
          imageUrl: url,
          imageElement: element,
          imageOffsetX: 0,
          imageOffsetY: 0,
          imageScale: 1,
          isImageSelected: true,
          selectedTextId: null,
        }),
      clearImage: () => set({ imageUrl: null, imageElement: null, isImageSelected: false }),
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
      resetAll: () => set({ ...INITIAL_STATE, imageElement: null }),
    }),
    {
      name: 'token-maker-storage',
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
