import { useCallback, useMemo } from 'react';
import { resolveEditorFontId } from '@/lib/editor-fonts/catalog';
import { useEditorStore } from '@/lib/store/editor-store';
import type { BatchAddFilesOptions } from '@/lib/store/batch-store';
import type { EditorState, TextBox } from '@/types/editor';

export function useHasEditorImage() {
  return useEditorStore((state) => Boolean(state.imageElement));
}

export function useCanvasEditorState() {
  return {
    imageUrl: useEditorStore((state) => state.imageUrl),
    imageElement: useEditorStore((state) => state.imageElement),
    imageOffsetX: useEditorStore((state) => state.imageOffsetX),
    imageOffsetY: useEditorStore((state) => state.imageOffsetY),
    imageScale: useEditorStore((state) => state.imageScale),
    selectedBorderId: useEditorStore((state) => state.selectedBorderId),
    selectedMaskId: useEditorStore((state) => state.selectedMaskId),
    customBorders: useEditorStore((state) => state.customBorders),
    borderTint: useEditorStore((state) => state.borderTint),
    imageBorderTintEnabled: useEditorStore((state) => state.imageBorderTintEnabled),
    overlayTint: useEditorStore((state) => state.overlayTint),
    borderOpacity: useEditorStore((state) => state.borderOpacity),
    overlayOpacity: useEditorStore((state) => state.overlayOpacity),
    isImageSelected: useEditorStore((state) => state.isImageSelected),
    renderRevision: useEditorStore((state) => state.renderRevision),
    setImageOffset: useEditorStore((state) => state.setImageOffset),
    setImageScale: useEditorStore((state) => state.setImageScale),
    setSelectedText: useEditorStore((state) => state.setSelectedText),
  };
}

export function useControlPanelState() {
  return {
    imageScale: useEditorStore((state) => state.imageScale),
    imageElement: useEditorStore((state) => state.imageElement),
    selectedTextId: useEditorStore((state) => state.selectedTextId),
    selectedTextFontSize: useEditorStore((state) => {
      const text = state.selectedTextId
        ? state.textBoxes.find((textBox) => textBox.id === state.selectedTextId)
        : null;
      return text?.fontSize ?? null;
    }),
    selectedTextColor: useEditorStore((state) => {
      const text = state.selectedTextId
        ? state.textBoxes.find((textBox) => textBox.id === state.selectedTextId)
        : null;
      return text?.color ?? null;
    }),
    selectedTextFontId: useEditorStore((state) => {
      const selectedText = state.selectedTextId
        ? state.textBoxes.find((textBox) => textBox.id === state.selectedTextId)
        : null;
      return resolveEditorFontId(selectedText?.fontId);
    }),
    borderTint: useEditorStore((state) => state.borderTint),
    overlayTint: useEditorStore((state) => state.overlayTint),
    borderOpacity: useEditorStore((state) => state.borderOpacity),
    overlayOpacity: useEditorStore((state) => state.overlayOpacity),
    setImageScale: useEditorStore((state) => state.setImageScale),
    addTextBox: useEditorStore((state) => state.addTextBox),
    removeTextBox: useEditorStore((state) => state.removeTextBox),
    updateTextBox: useEditorStore((state) => state.updateTextBox),
    setBorderTint: useEditorStore((state) => state.setBorderTint),
    setOverlayTint: useEditorStore((state) => state.setOverlayTint),
    setBorderOpacity: useEditorStore((state) => state.setBorderOpacity),
    setOverlayOpacity: useEditorStore((state) => state.setOverlayOpacity),
    resetPosition: useEditorStore((state) => state.resetPosition),
    clearImage: useEditorStore((state) => state.clearImage),
  };
}

export function useTemplatePanelState() {
  return {
    activePresetId: useEditorStore((state) => state.activePresetId),
    exportSize: useEditorStore((state) => state.exportSize),
    imageElement: useEditorStore((state) => state.imageElement),
    applyPreset: useEditorStore((state) => state.applyPreset),
    setExportSize: useEditorStore((state) => state.setExportSize),
  };
}

export function useBorderTemplatesState() {
  return {
    activePresetId: useEditorStore((state) => state.activePresetId),
    selectedBorderId: useEditorStore((state) => state.selectedBorderId),
    customBorders: useEditorStore((state) => state.customBorders),
    borderLibraryMode: useEditorStore((state) => state.borderLibraryMode),
    setSelectedBorder: useEditorStore((state) => state.setSelectedBorder),
    addCustomBorder: useEditorStore((state) => state.addCustomBorder),
    removeCustomBorder: useEditorStore((state) => state.removeCustomBorder),
  };
}

export function useBatchEditorBridge() {
  const exportSize = useEditorStore((state) => state.exportSize);
  const getEditorSnapshot = useCallback((): EditorState => useEditorStore.getState(), []);

  const firstImagePreviewOptions = useMemo<BatchAddFilesOptions>(
    () => createFirstImagePreviewOptions(),
    []
  );

  return { exportSize, getEditorSnapshot, firstImagePreviewOptions };
}

export function getEditorImageFilePreviewOptions(): BatchAddFilesOptions {
  return createFirstImagePreviewOptions();
}

function createFirstImagePreviewOptions(): BatchAddFilesOptions {
  return {
    shouldUseFirstImagePreview: () => !useEditorStore.getState().imageElement,
    onFirstImageReady: ({ url, element }) => {
      const store = useEditorStore.getState();
      if (!store.imageElement) {
        store.setImage(url, element);
        return;
      }

      URL.revokeObjectURL(url);
    },
  };
}

export function useTextCanvasOverlayState() {
  return {
    textBoxes: useEditorStore((state) => state.textBoxes),
    setSelectedText: useEditorStore((state) => state.setSelectedText),
  };
}

export function useDraggableTextState(text: TextBox) {
  const selectedTextId = useEditorStore((state) => state.selectedTextId);
  return {
    isSelected: selectedTextId === text.id,
    setSelectedText: useEditorStore((state) => state.setSelectedText),
    updateTextBox: useEditorStore((state) => state.updateTextBox),
  };
}

export function deleteCurrentEditorSelection() {
  const { selectedTextId, removeTextBox, isImageSelected, imageElement, clearImage } =
    useEditorStore.getState();

  if (selectedTextId) {
    removeTextBox(selectedTextId);
    return true;
  }

  if (isImageSelected && imageElement) {
    clearImage();
    return true;
  }

  return false;
}

export function getCurrentEditorState() {
  return useEditorStore.getState();
}
