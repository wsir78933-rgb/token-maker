import { create, type StateCreator } from 'zustand';
import type { EditorState } from '@/types/editor';
import { getSupportedImageFiles } from '@/lib/utils/imageValidation';
import type { BatchItem } from '@/lib/batch/types';
import {
  areBatchVisualDraftsEqual,
  cloneBatchVisualDraft,
  createDefaultBatchDraft,
  type BatchVisualDraft,
} from '@/lib/batch/editor-draft';
import {
  createBatchItem,
  loadBatchImageFile,
  revokeBatchItemUrls,
  revokeObjectUrl,
} from '@/lib/batch/image-files';
import { renderBatchItem } from '@/lib/batch/rendering';
import { downloadBatchZip, type BatchZipExportCopy } from '@/lib/batch/zip-export';

// ============================================================
// 批处理 Store — 独立于编辑器主 Store
// ============================================================

export type { BatchItem } from '@/lib/batch/types';

export interface BatchAddFilesOptions {
  shouldUseFirstImagePreview?: () => boolean;
  onFirstImageReady?: (image: { url: string; element: HTMLImageElement }) => void | Promise<void>;
}

export type BatchItemProcessOutcome = 'done' | 'error' | 'superseded';

interface BatchState {
  isActive: boolean;
  items: BatchItem[];
  isProcessing: boolean;
  selectedItemId: string | null;
}

interface BatchActions {
  activate: () => void;
  deactivate: () => void;
  addFiles: (files: File[], options?: BatchAddFilesOptions) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  selectItem: (id: string) => void;
  saveItemDraft: (id: string, draft: BatchVisualDraft) => void;
  processItem: (
    id: string,
    editorState: EditorState,
    exportSize: number
  ) => Promise<BatchItemProcessOutcome>;
  processAll: (editorState: EditorState, exportSize: number) => Promise<void>;
  retryItem: (id: string, editorState: EditorState, exportSize: number) => Promise<void>;
  downloadZip: (copy: BatchZipExportCopy) => Promise<void>;
}

export type BatchStore = BatchState & BatchActions;

type BatchStoreSet = Parameters<StateCreator<BatchStore>>[0];
type BatchStoreGet = Parameters<StateCreator<BatchStore>>[1];

interface BatchProcessingCommand {
  token: symbol;
  generation: number;
}

let activeBatchProcessingCommand: BatchProcessingCommand | null = null;
let batchQueueGeneration = 0;

function getBatchItemOrThrow(items: BatchItem[], id: string): BatchItem {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`Batch item not found: "${id}"`);
  }
  return item;
}

function getBatchProcessingError(id: string): Error {
  return new Error(`Batch processing already in progress: "${id}"`);
}

function assertBatchProcessingIsAvailable(get: BatchStoreGet, id: string): void {
  if (activeBatchProcessingCommand || get().isProcessing) {
    throw getBatchProcessingError(id);
  }
}

function beginBatchProcessingCommand(
  set: BatchStoreSet,
  get: BatchStoreGet,
  id: string
): BatchProcessingCommand {
  assertBatchProcessingIsAvailable(get, id);
  const command = { token: Symbol('batch-processing'), generation: batchQueueGeneration };
  activeBatchProcessingCommand = command;
  set({ isProcessing: true });
  return command;
}

function canBatchProcessingCommandWrite(command: BatchProcessingCommand): boolean {
  return (
    activeBatchProcessingCommand?.token === command.token &&
    activeBatchProcessingCommand.generation === command.generation &&
    batchQueueGeneration === command.generation
  );
}

function finishBatchProcessingCommand(set: BatchStoreSet, command: BatchProcessingCommand): void {
  if (activeBatchProcessingCommand?.token !== command.token) {
    return;
  }

  activeBatchProcessingCommand = null;
  set({ isProcessing: false });
}

function getBatchItemErrorMessage(error: unknown, fileName: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return `Batch processing failed: "${fileName}"`;
}

function invalidateBatchItemRenderedOutput(
  item: Pick<BatchItem, 'blob' | 'renderedUrl'>
): Pick<BatchItem, 'blob' | 'renderedUrl'> {
  if (item.renderedUrl) {
    revokeObjectUrl(item.renderedUrl);
  }

  return {
    blob: null,
    renderedUrl: null,
  };
}

function setBatchItemPendingAfterDraftMismatch(
  set: BatchStoreSet,
  item: BatchItem
): void {
  const invalidatedOutput = invalidateBatchItemRenderedOutput(item);
  set((state) => ({
    items: state.items.map((candidate) =>
      candidate.id === item.id
        ? {
            ...candidate,
            ...invalidatedOutput,
            status: 'pending' as const,
            error: undefined,
          }
        : candidate
    ),
  }));
}

async function renderItemInStore(
  set: BatchStoreSet,
  get: BatchStoreGet,
  command: BatchProcessingCommand,
  item: BatchItem,
  editorState: EditorState,
  exportSize: number,
  draft: BatchVisualDraft
): Promise<BatchItemProcessOutcome> {
  if (!canBatchProcessingCommandWrite(command)) {
    return 'superseded';
  }

  const currentItemAtRenderStart = get().items.find(
    (currentItem) => currentItem.id === item.id
  );
  if (!currentItemAtRenderStart) {
    return 'superseded';
  }
  const invalidatedOutputAtRenderStart = invalidateBatchItemRenderedOutput(
    currentItemAtRenderStart
  );

  set((state) => ({
    items: state.items.map((currentItem) =>
      currentItem.id === item.id
        ? {
            ...currentItem,
            ...invalidatedOutputAtRenderStart,
            status: 'rendering' as const,
            error: undefined,
          }
        : currentItem
    ),
  }));

  try {
    const { blob, renderedUrl } = await renderBatchItem(item, editorState, exportSize, draft);
    if (!canBatchProcessingCommandWrite(command)) {
      revokeObjectUrl(renderedUrl);
      return 'superseded';
    }

    const currentItem = get().items.find((candidate) => candidate.id === item.id);
    if (!currentItem) {
      revokeObjectUrl(renderedUrl);
      return 'superseded';
    }

    const currentDraft = currentItem.draft ?? createDefaultBatchDraft(editorState);
    if (!areBatchVisualDraftsEqual(draft, currentDraft)) {
      revokeObjectUrl(renderedUrl);
      setBatchItemPendingAfterDraftMismatch(set, currentItem);
      return 'superseded';
    }

    if (currentItem.previewUrl && currentItem.previewUrl !== item.previewUrl) {
      revokeObjectUrl(currentItem.previewUrl);
    }

    set((state) => ({
      items: state.items.map((currentItem) =>
        currentItem.id === item.id
          ? {
              ...currentItem,
              status: 'done' as const,
              blob,
              renderedUrl,
              draft: cloneBatchVisualDraft(draft),
              imageElement: item.imageElement,
              previewUrl: item.previewUrl,
              error: undefined,
            }
          : currentItem
      ),
    }));
    return 'done';
  } catch (error) {
    if (!canBatchProcessingCommandWrite(command)) {
      return 'superseded';
    }
    const currentItem = get().items.find((candidate) => candidate.id === item.id);
    if (!currentItem) {
      return 'superseded';
    }
    const currentDraft = currentItem.draft ?? createDefaultBatchDraft(editorState);
    if (!areBatchVisualDraftsEqual(draft, currentDraft)) {
      setBatchItemPendingAfterDraftMismatch(set, currentItem);
      return 'superseded';
    }
    const errorMessage = getBatchItemErrorMessage(error, item.fileName);
    const invalidatedCurrentOutput = invalidateBatchItemRenderedOutput(currentItem);
    set((state) => ({
      items: state.items.map((candidate) =>
        candidate.id === item.id
          ? {
              ...candidate,
              ...invalidatedCurrentOutput,
              status: 'error' as const,
              error: errorMessage,
            }
          : candidate
      ),
    }));
    return 'error';
  }
}

export function getNextIncompleteItemId(items: BatchItem[], currentId: string): string | null {
  const currentIndex = items.findIndex((item) => item.id === currentId);
  if (currentIndex === -1) {
    return null;
  }

  const followingItem = items.slice(currentIndex + 1).find((item) => item.status !== 'done');
  if (followingItem) {
    return followingItem.id;
  }

  const wrappedItem = items.slice(0, currentIndex).find((item) => item.status !== 'done');
  return wrappedItem?.id ?? null;
}

export const useBatchStore = create<BatchStore>()((set, get) => ({
  isActive: false,
  items: [],
  isProcessing: false,
  selectedItemId: null,

  activate: () => set({ isActive: true }),

  deactivate: () => {
    const { items } = get();
    // 清理所有 object URLs
    items.forEach(revokeBatchItemUrls);
    batchQueueGeneration += 1;
    set({ isActive: false, items: [], selectedItemId: null });
  },

  addFiles: (files: File[], options) => {
    const imageFiles = getSupportedImageFiles(files);

    const newItems = imageFiles.map(createBatchItem);

    set((state) => {
      const hasValidSelection =
        state.selectedItemId !== null && state.items.some((item) => item.id === state.selectedItemId);
      return {
        items: [...state.items, ...newItems],
        selectedItemId: hasValidSelection ? state.selectedItemId : newItems[0]?.id ?? state.selectedItemId,
      };
    });

    // 判断是否是首批图片（当前列表为空时为首批）
    const isFirstBatch = get().items.length === newItems.length;

    // 异步加载每张图片
    newItems.forEach(async (item, index) => {
      try {
        const { url, element } = await loadBatchImageFile(item.file);
        const currentItem = get().items.find((i) => i.id === item.id);
        if (!currentItem) {
          revokeObjectUrl(url);
          return;
        }

        if (currentItem.previewUrl && currentItem.previewUrl !== url) {
          revokeObjectUrl(currentItem.previewUrl);
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, previewUrl: url, imageElement: element, status: 'pending' as const }
              : i
          ),
        }));

        // 首批的第一张图片自动设置到编辑器，作为实时预览
        if (isFirstBatch && index === 0 && options?.onFirstImageReady) {
          if (options.shouldUseFirstImagePreview?.() ?? false) {
            let previewImage: { url: string; element: HTMLImageElement } | null = null;
            try {
              previewImage = await loadBatchImageFile(item.file);
              const itemStillPresent = get().items.some((currentItem) => currentItem.id === item.id);

              if (itemStillPresent && (options.shouldUseFirstImagePreview?.() ?? false)) {
                await options.onFirstImageReady(previewImage);
                previewImage = null;
              } else {
                revokeObjectUrl(previewImage.url);
                previewImage = null;
              }
            } catch (error) {
              revokeObjectUrl(previewImage?.url);
              console.warn(`Batch editor preview failed: "${item.fileName}"`, error);
            }
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error && error.message
            ? error.message
            : `Batch image load failed: "${item.fileName}"`;
        set((state) => ({
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error' as const, error: errorMessage }
              : i
          ),
        }));
      }
    });
  },

  removeItem: (id: string) => {
    const { items } = get();
    const itemIndex = items.findIndex((item) => item.id === id);
    const item = itemIndex === -1 ? undefined : items[itemIndex];
    if (item) revokeBatchItemUrls(item);
    if (!item) return;

    const remainingItems = items.filter((item) => item.id !== id);
    const selectedItemId =
      get().selectedItemId === id
        ? remainingItems[itemIndex]?.id ?? remainingItems[itemIndex - 1]?.id ?? null
        : get().selectedItemId;
    set({ items: remainingItems, selectedItemId });
  },

  clearAll: () => {
    const { items } = get();
    items.forEach(revokeBatchItemUrls);
    set({ items: [], selectedItemId: null });
  },

  selectItem: (id: string) => {
    getBatchItemOrThrow(get().items, id);
    set({ selectedItemId: id });
  },

  saveItemDraft: (id: string, draft: BatchVisualDraft) => {
    const item = getBatchItemOrThrow(get().items, id);
    if (item.draft && areBatchVisualDraftsEqual(item.draft, draft)) {
      return;
    }

    const savedDraft = cloneBatchVisualDraft(draft);
    const invalidatedOutput = invalidateBatchItemRenderedOutput(item);

    set((state) => ({
      items: state.items.map((currentItem) =>
        currentItem.id === id
          ? {
              ...currentItem,
              ...invalidatedOutput,
              draft: savedDraft,
              status: 'pending' as const,
              error: undefined,
            }
          : currentItem
      ),
    }));
  },

  processItem: async (id: string, editorState: EditorState, exportSize: number) => {
    const item = getBatchItemOrThrow(get().items, id);
    const command = beginBatchProcessingCommand(set, get, id);
    try {
      return await renderItemInStore(
        set,
        get,
        command,
        item,
        editorState,
        exportSize,
        item.draft ?? createDefaultBatchDraft(editorState)
      );
    } finally {
      finishBatchProcessingCommand(set, command);
    }
  },

  processAll: async (editorState: EditorState, exportSize: number) => {
    const command = beginBatchProcessingCommand(set, get, 'all');
    try {
      const itemIdsToProcess = get()
        .items.filter((item) => item.status === 'pending' || item.status === 'error')
        .map((item) => item.id);

      const batchSize = 3;
      for (let index = 0; index < itemIdsToProcess.length; index += batchSize) {
        const itemBatchIds = itemIdsToProcess.slice(index, index + batchSize);
        const itemBatch = itemBatchIds
          .map((id) => get().items.find((item) => item.id === id))
          .filter(
            (item): item is BatchItem =>
              item !== undefined && (item.status === 'pending' || item.status === 'error')
          );
        await Promise.all(
          itemBatch.map((item) =>
            renderItemInStore(
              set,
              get,
              command,
              item,
              editorState,
              exportSize,
              item.draft ?? createDefaultBatchDraft(editorState)
            )
          )
        );

        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    } finally {
      finishBatchProcessingCommand(set, command);
    }
  },

  retryItem: async (id: string, editorState: EditorState, exportSize: number) => {
    assertBatchProcessingIsAvailable(get, id);

    const { items } = get();
    const item = items.find((currentItem) => currentItem.id === id);
    if (!item || item.status !== 'error') return;
    let loadedPreviewUrl: string | null = null;
    const command = beginBatchProcessingCommand(set, get, id);
    try {
      let imageElement = item.imageElement;
      let previewUrl = item.previewUrl;
      if (!imageElement) {
        const result = await loadBatchImageFile(item.file);
        imageElement = result.element;
        previewUrl = result.url;
        loadedPreviewUrl = result.url;
      }

      if (!get().items.some((it) => it.id === id)) {
        revokeObjectUrl(loadedPreviewUrl);
        return;
      }

      const updatedItem = { ...item, imageElement, previewUrl };
      const renderOutcome = await renderItemInStore(
        set,
        get,
        command,
        updatedItem,
        editorState,
        exportSize,
        updatedItem.draft ?? createDefaultBatchDraft(editorState)
      );
      if (renderOutcome !== 'done') {
        revokeObjectUrl(loadedPreviewUrl);
      }
    } catch (error) {
      revokeObjectUrl(loadedPreviewUrl);
      if (!canBatchProcessingCommandWrite(command)) {
        return;
      }
      const errorMessage = getBatchItemErrorMessage(error, item.fileName);
      set((state) => ({
        items: state.items.map((currentItem) =>
          currentItem.id === id
            ? {
                ...currentItem,
                status: 'error' as const,
                error: errorMessage,
              }
            : currentItem
        ),
      }));
    } finally {
      finishBatchProcessingCommand(set, command);
    }
  },

  downloadZip: async (copy) => {
    await downloadBatchZip(get().items, copy);
  },
}));
