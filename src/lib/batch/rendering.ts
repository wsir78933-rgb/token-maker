import type { EditorState } from '@/types/editor';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';
import { buildBatchRenderState, type BatchVisualDraft } from './editor-draft';
import type { BatchItem } from './types';

export async function renderBatchItem(
  item: BatchItem,
  editorState: EditorState,
  exportSize: number,
  draft: BatchVisualDraft
): Promise<{ blob: Blob; renderedUrl: string }> {
  if (!item.imageElement) {
    throw new Error(`Batch image not loaded: "${item.fileName}"`);
  }

  const virtualState = buildBatchRenderState(editorState, item.imageElement, draft);
  const blob = await exportTokenAsPNG(virtualState, exportSize);
  if (!blob) {
    throw new Error(`Batch render failed: "${item.fileName}"`);
  }

  return {
    blob,
    renderedUrl: URL.createObjectURL(blob),
  };
}
