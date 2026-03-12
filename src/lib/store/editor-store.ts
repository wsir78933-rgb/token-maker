import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorStore, EditorState, StylePreset } from '@/types/editor';

const INITIAL_STATE: Omit<EditorState, 'imageElement'> = {
  imageUrl: null,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageScale: 1,

  selectedBorderId: 'thick-ring',
  selectedMaskId: 'circle',
  customBorders: [],
  customMasks: [],

  borderTint: '#8b5cf6', // 默认偏紫色系
  backgroundColor: '#09090b',
  textColor: '#ffffff',
  overlayTint: '#000000',
  borderOpacity: 1,
  overlayOpacity: 0,

  textBoxes: [],
  selectedTextId: null,
  isImageSelected: false,
  exportSize: 512, // 默认导出 512
  activePresetId: null,
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
      setSelectedBorder: (id) => set({ selectedBorderId: id, activePresetId: null }),
      setSelectedMask: (id) => set({ selectedMaskId: id, activePresetId: null }),
      addCustomBorder: (template) =>
        set((state) => ({ customBorders: [...state.customBorders, template] })),
      removeCustomBorder: (id) =>
        set((state) => ({
          customBorders: state.customBorders.filter((b) => b.id !== id),
          selectedBorderId: state.selectedBorderId === id ? 'none' : state.selectedBorderId,
        })),
      addCustomMask: (template) =>
        set((state) => ({ customMasks: [...state.customMasks, template] })),
      removeCustomMask: (id) =>
        set((state) => ({
          customMasks: state.customMasks.filter((m) => m.id !== id),
          selectedMaskId: state.selectedMaskId === id ? 'circle' : state.selectedMaskId,
        })),

      // --- 样式 ---
      setBorderTint: (color) => set({ borderTint: color, activePresetId: null }),
      setBackgroundColor: (color) => set({ backgroundColor: color, activePresetId: null }),
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
        set({
          selectedBorderId: preset.borderId,
          selectedMaskId: preset.maskId,
          borderTint: preset.borderTint,
          backgroundColor: preset.backgroundColor,
          overlayTint: preset.overlayTint,
          borderOpacity: preset.borderOpacity,
          overlayOpacity: preset.overlayOpacity,
          activePresetId: preset.id,
        }),

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
          customMasks: state.customMasks,
          borderTint: state.borderTint,
          backgroundColor: state.backgroundColor,
          textColor: state.textColor,
          overlayTint: state.overlayTint,
          borderOpacity: state.borderOpacity,
          overlayOpacity: state.overlayOpacity,
          textBoxes: state.textBoxes,
          selectedTextId: state.selectedTextId,
          exportSize: state.exportSize,
          activePresetId: state.activePresetId,
        };
      },
    }
  )
);
