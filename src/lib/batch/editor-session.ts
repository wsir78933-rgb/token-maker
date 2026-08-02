import {
  captureBatchVisualDraft,
  cloneBatchVisualDraft,
  createDefaultBatchDraft,
  type BatchVisualDraft,
} from '@/lib/batch/editor-draft';
import { loadBatchImageFile } from '@/lib/batch/image-files';
import type { BatchItem } from '@/lib/batch/types';
import { useEditorStore } from '@/lib/store/editor-store';

export type BatchEditorLoadResult = 'loaded' | 'superseded';

export { createDefaultBatchDraft };

export function captureCurrentBatchDraft(): BatchVisualDraft {
  return captureBatchVisualDraft(useEditorStore.getState());
}

export async function loadBatchItemIntoEditor(
  item: BatchItem,
  draft: BatchVisualDraft | null
): Promise<BatchEditorLoadResult> {
  if (!item.file) {
    throw new Error(`Batch image file is missing: "${item.fileName}"`);
  }

  const effectiveDraft = draft
    ? cloneBatchVisualDraft(draft)
    : createDefaultBatchDraft(useEditorStore.getState());
  const requestRevision = useEditorStore.getState().beginImageLoad();
  const { url, element } = await loadBatchImageFile(item.file);
  const editorState = useEditorStore.getState();

  if (editorState.imageLoadRevision !== requestRevision) {
    URL.revokeObjectURL(url);
    return 'superseded';
  }

  editorState.setImage(url, element);
  useEditorStore.setState({
    ...cloneBatchVisualDraft(effectiveDraft),
    selectedTextId: null,
    isImageSelected: true,
  });
  return 'loaded';
}
