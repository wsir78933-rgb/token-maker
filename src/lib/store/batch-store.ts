import { create } from 'zustand';
import type { EditorState } from '@/types/editor';
import { getSupportedImageFiles } from '@/lib/utils/imageValidation';
import type { BatchItem } from '@/lib/batch/types';
import {
  createBatchItem,
  loadBatchImageFile,
  revokeBatchItemUrls,
  revokeObjectUrl,
} from '@/lib/batch/image-files';
import { renderBatchItem } from '@/lib/batch/rendering';
import { downloadBatchZip } from '@/lib/batch/zip-export';

// ============================================================
// 批处理 Store — 独立于编辑器主 Store
// ============================================================

export type { BatchItem } from '@/lib/batch/types';

export interface BatchAddFilesOptions {
  shouldUseFirstImagePreview?: () => boolean;
  onFirstImageReady?: (image: { url: string; element: HTMLImageElement }) => void | Promise<void>;
}

interface BatchState {
  isActive: boolean;
  items: BatchItem[];
  isProcessing: boolean;
}

interface BatchActions {
  activate: () => void;
  deactivate: () => void;
  addFiles: (files: File[], options?: BatchAddFilesOptions) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  processAll: (editorState: EditorState, exportSize: number) => Promise<void>;
  retryItem: (id: string, editorState: EditorState, exportSize: number) => Promise<void>;
  downloadZip: () => Promise<void>;
}

export type BatchStore = BatchState & BatchActions;

export const useBatchStore = create<BatchStore>()((set, get) => ({
  isActive: false,
  items: [],
  isProcessing: false,

  activate: () => set({ isActive: true }),

  deactivate: () => {
    const { items } = get();
    // 清理所有 object URLs
    items.forEach(revokeBatchItemUrls);
    set({ isActive: false, items: [], isProcessing: false });
  },

  addFiles: (files: File[], options) => {
    const imageFiles = getSupportedImageFiles(files);

    const newItems = imageFiles.map(createBatchItem);

    set((state) => ({ items: [...state.items, ...newItems] }));

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
            } catch {
              revokeObjectUrl(previewImage?.url);
              // Batch thumbnails still work; the editor preview is only a convenience.
            }
          }
        }
      } catch {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error' as const, error: 'Failed to load image' }
              : i
          ),
        }));
      }
    });
  },

  removeItem: (id: string) => {
    const { items } = get();
    const item = items.find((i) => i.id === id);
    if (item) revokeBatchItemUrls(item);
    set({ items: items.filter((i) => i.id !== id) });
  },

  clearAll: () => {
    const { items } = get();
    items.forEach(revokeBatchItemUrls);
    set({ items: [] });
  },

  processAll: async (editorState: EditorState, exportSize: number) => {
    set({ isProcessing: true });
    const { items } = get();

    // 只处理 pending 和 error 状态的项
    const toProcess = items.filter((i) => i.status === 'pending' || i.status === 'error');

    // 分批处理，每批 3 张
    const BATCH_SIZE = 3;
    for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
      const batch = toProcess.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (item) => {
          // 标记为 rendering
          set((state) => ({
            items: state.items.map((it) =>
              it.id === item.id ? { ...it, status: 'rendering' as const } : it
            ),
          }));

          try {
            const { blob, renderedUrl } = await renderBatchItem(item, editorState, exportSize);
            const currentItem = get().items.find((it) => it.id === item.id);
            if (!currentItem) {
              revokeObjectUrl(renderedUrl);
              return;
            }

            if (currentItem.renderedUrl && currentItem.renderedUrl !== renderedUrl) {
              revokeObjectUrl(currentItem.renderedUrl);
            }

            set((state) => ({
              items: state.items.map((it) =>
                it.id === item.id
                  ? { ...it, status: 'done' as const, blob, renderedUrl, error: undefined }
                  : it
              ),
            }));
          } catch (err) {
            set((state) => ({
              items: state.items.map((it) =>
                it.id === item.id
                  ? {
                      ...it,
                      status: 'error' as const,
                      error: err instanceof Error ? err.message : 'Unknown error',
                    }
                  : it
              ),
            }));
          }
        })
      );

      // 每批之间 yield 一帧，防止阻塞 UI
      await new Promise((r) => requestAnimationFrame(r));
    }

    set({ isProcessing: false });
  },

  retryItem: async (id: string, editorState: EditorState, exportSize: number) => {
    const { items } = get();
    const item = items.find((i) => i.id === id);
    if (!item || item.status !== 'error') return;
    let loadedPreviewUrl: string | null = null;

    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, status: 'rendering' as const, error: undefined } : it
      ),
    }));

    try {
      // 如果图片没加载成功，先重新加载
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
      const { blob, renderedUrl } = await renderBatchItem(updatedItem, editorState, exportSize);
      const currentItem = get().items.find((it) => it.id === id);
      if (!currentItem) {
        revokeObjectUrl(loadedPreviewUrl);
        revokeObjectUrl(renderedUrl);
        return;
      }

      if (currentItem.previewUrl && currentItem.previewUrl !== previewUrl) {
        revokeObjectUrl(currentItem.previewUrl);
      }
      if (currentItem.renderedUrl && currentItem.renderedUrl !== renderedUrl) {
        revokeObjectUrl(currentItem.renderedUrl);
      }

      set((state) => ({
        items: state.items.map((it) =>
          it.id === id
            ? { ...it, status: 'done' as const, blob, renderedUrl, imageElement, previewUrl, error: undefined }
            : it
        ),
      }));
    } catch (err) {
      revokeObjectUrl(loadedPreviewUrl);
      set((state) => ({
        items: state.items.map((it) =>
          it.id === id
            ? {
                ...it,
                status: 'error' as const,
                error: err instanceof Error ? err.message : 'Unknown error',
              }
            : it
        ),
      }));
    }
  },

  downloadZip: async () => {
    await downloadBatchZip(get().items);
  },
}));
