import { resolveEditorFontId } from '@/lib/editor-fonts/catalog';
import type { BorderLibraryMode, EditorState, TextBox } from '@/types/editor';

export interface BatchVisualDraft {
  imageOffsetX: number;
  imageOffsetY: number;
  imageScale: number;
  selectedBorderId: string;
  selectedMaskId: string;
  borderLibraryMode: BorderLibraryMode;
  borderTint: string;
  imageBorderTintEnabled: boolean;
  textColor: string;
  overlayTint: string;
  borderOpacity: number;
  overlayOpacity: number;
  textBoxes: TextBox[];
  activePresetId: string | null;
}

function cloneTextBoxes(textBoxes: TextBox[]): TextBox[] {
  return textBoxes.map((textBox) => ({ ...textBox }));
}

export function captureBatchVisualDraft(editorState: EditorState): BatchVisualDraft {
  return {
    imageOffsetX: editorState.imageOffsetX,
    imageOffsetY: editorState.imageOffsetY,
    imageScale: editorState.imageScale,
    selectedBorderId: editorState.selectedBorderId,
    selectedMaskId: editorState.selectedMaskId,
    borderLibraryMode: editorState.borderLibraryMode,
    borderTint: editorState.borderTint,
    imageBorderTintEnabled: editorState.imageBorderTintEnabled,
    textColor: editorState.textColor,
    overlayTint: editorState.overlayTint,
    borderOpacity: editorState.borderOpacity,
    overlayOpacity: editorState.overlayOpacity,
    textBoxes: cloneTextBoxes(editorState.textBoxes),
    activePresetId: editorState.activePresetId,
  };
}

export function createDefaultBatchDraft(editorState: EditorState): BatchVisualDraft {
  return {
    ...captureBatchVisualDraft(editorState),
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageScale: 1,
    textBoxes: [],
  };
}

export function cloneBatchVisualDraft(draft: BatchVisualDraft): BatchVisualDraft {
  return {
    ...draft,
    textBoxes: cloneTextBoxes(draft.textBoxes),
  };
}

export function areBatchVisualDraftsEqual(
  left: BatchVisualDraft,
  right: BatchVisualDraft
): boolean {
  return (
    left.imageOffsetX === right.imageOffsetX &&
    left.imageOffsetY === right.imageOffsetY &&
    left.imageScale === right.imageScale &&
    left.selectedBorderId === right.selectedBorderId &&
    left.selectedMaskId === right.selectedMaskId &&
    left.borderLibraryMode === right.borderLibraryMode &&
    left.borderTint === right.borderTint &&
    left.imageBorderTintEnabled === right.imageBorderTintEnabled &&
    left.textColor === right.textColor &&
    left.overlayTint === right.overlayTint &&
    left.borderOpacity === right.borderOpacity &&
    left.overlayOpacity === right.overlayOpacity &&
    left.activePresetId === right.activePresetId &&
    left.textBoxes.length === right.textBoxes.length &&
    left.textBoxes.every((leftTextBox, index) => {
      const rightTextBox = right.textBoxes[index];
      return (
        rightTextBox !== undefined &&
        leftTextBox.id === rightTextBox.id &&
        leftTextBox.content === rightTextBox.content &&
        resolveEditorFontId(leftTextBox.fontId) === resolveEditorFontId(rightTextBox.fontId) &&
        leftTextBox.x === rightTextBox.x &&
        leftTextBox.y === rightTextBox.y &&
        leftTextBox.fontSize === rightTextBox.fontSize &&
        leftTextBox.fontWeight === rightTextBox.fontWeight &&
        leftTextBox.color === rightTextBox.color &&
        leftTextBox.align === rightTextBox.align
      );
    })
  );
}

export function buildBatchRenderState(
  editorState: EditorState,
  imageElement: HTMLImageElement,
  draft: BatchVisualDraft
): EditorState {
  return {
    ...editorState,
    ...cloneBatchVisualDraft(draft),
    imageUrl: null,
    imageElement,
    selectedTextId: null,
    isImageSelected: false,
  };
}
