import type { EditorState } from '@/types/editor';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import type { BatchItem } from './types';

export function buildBatchRenderState(
  editorState: EditorState,
  imageElement: HTMLImageElement
): EditorState {
  return {
    ...editorState,
    imageElement,
    imageUrl: null,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageScale: 1,
    textBoxes: [],
    selectedTextId: null,
    isImageSelected: false,
  };
}

export async function renderBatchItem(
  item: BatchItem,
  editorState: EditorState,
  exportSize: number
): Promise<{ blob: Blob; renderedUrl: string }> {
  if (!item.imageElement) {
    throw new Error('Image not loaded');
  }

  const virtualState = buildBatchRenderState(editorState, item.imageElement);
  const blob = await exportTokenAsPNG(virtualState, exportSize);
  if (!blob) {
    throw new Error('Render failed');
  }

  return {
    blob,
    renderedUrl: URL.createObjectURL(blob),
  };
}
