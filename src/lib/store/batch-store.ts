import { create } from 'zustand';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { EditorState } from '@/types/editor';
import { exportTokenAsPNG } from '@/lib/renderer/pipeline';

// ============================================================
// 批处理 Store — 独立于编辑器主 Store
// ============================================================

export interface BatchItem {
  id: string;
  file: File;
  fileName: string;
  /** 原始图片的 object URL，用于显示缩略图 */
  previewUrl: string;
  /** 已加载的 HTMLImageElement */
  imageElement: HTMLImageElement | null;
  /** 渲染后的缩略图 dataURL */
  renderedUrl: string | null;
  /** 渲染后的 PNG Blob */
  blob: Blob | null;
  status: 'loading' | 'pending' | 'rendering' | 'done' | 'error';
  error?: string;
}

interface BatchState {
  isActive: boolean;
  items: BatchItem[];
  isProcessing: boolean;
}

interface BatchActions {
  activate: () => void;
  deactivate: () => void;
  addFiles: (files: File[]) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  processAll: (editorState: EditorState, exportSize: number) => Promise<void>;
  retryItem: (id: string, editorState: EditorState, exportSize: number) => Promise<void>;
  downloadZip: () => Promise<void>;
}

export type BatchStore = BatchState & BatchActions;

/**
 * 加载图片文件为 HTMLImageElement
 */
function loadImageFromFile(file: File): Promise<{ url: string; element: HTMLImageElement }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ url, element: img });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * 构造虚拟 EditorState 用于批量渲染
 * 保留当前编辑器的模板样式，替换图片相关字段
 */
function buildVirtualState(
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
    // 批量模式下不渲染文字（每张图不同，文字意义不大）
    textBoxes: editorState.textBoxes,
    selectedTextId: null,
    isImageSelected: false,
  };
}

/**
 * 渲染单张图片为 PNG Blob + 缩略图 dataURL
 */
async function renderSingleItem(
  item: BatchItem,
  editorState: EditorState,
  exportSize: number
): Promise<{ blob: Blob; renderedUrl: string }> {
  if (!item.imageElement) {
    throw new Error('Image not loaded');
  }

  const virtualState = buildVirtualState(editorState, item.imageElement);
  const blob = await exportTokenAsPNG(virtualState, exportSize);
  if (!blob) {
    throw new Error('Render failed');
  }

  // 生成缩略图预览用的 dataURL
  const renderedUrl = URL.createObjectURL(blob);

  return { blob, renderedUrl };
}

export const useBatchStore = create<BatchStore>()((set, get) => ({
  isActive: false,
  items: [],
  isProcessing: false,

  activate: () => set({ isActive: true }),

  deactivate: () => {
    const { items } = get();
    // 清理所有 object URLs
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.renderedUrl) URL.revokeObjectURL(item.renderedUrl);
    });
    set({ isActive: false, items: [], isProcessing: false });
  },

  addFiles: (files: File[]) => {
    const imageFiles = files.filter(
      (f) => f.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(f.name)
    );

    const newItems: BatchItem[] = imageFiles.map((file) => ({
      id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      fileName: file.name,
      previewUrl: '',
      imageElement: null,
      renderedUrl: null,
      blob: null,
      status: 'loading' as const,
    }));

    set((state) => ({ items: [...state.items, ...newItems] }));

    // 异步加载每张图片
    newItems.forEach(async (item) => {
      try {
        const { url, element } = await loadImageFromFile(item.file);
        set((state) => ({
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, previewUrl: url, imageElement: element, status: 'pending' as const }
              : i
          ),
        }));
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
    if (item) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.renderedUrl) URL.revokeObjectURL(item.renderedUrl);
    }
    set({ items: items.filter((i) => i.id !== id) });
  },

  clearAll: () => {
    const { items } = get();
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.renderedUrl) URL.revokeObjectURL(item.renderedUrl);
    });
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
            const { blob, renderedUrl } = await renderSingleItem(item, editorState, exportSize);

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
        const result = await loadImageFromFile(item.file);
        imageElement = result.element;
        previewUrl = result.url;
      }

      const updatedItem = { ...item, imageElement, previewUrl };
      const { blob, renderedUrl } = await renderSingleItem(updatedItem, editorState, exportSize);

      set((state) => ({
        items: state.items.map((it) =>
          it.id === id
            ? { ...it, status: 'done' as const, blob, renderedUrl, imageElement, previewUrl, error: undefined }
            : it
        ),
      }));
    } catch (err) {
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
    const { items } = get();
    const doneItems = items.filter((i) => i.status === 'done' && i.blob);

    if (doneItems.length === 0) return;

    const zip = new JSZip();
    const usedNames = new Set<string>();

    doneItems.forEach((item) => {
      // 确保文件名唯一
      let baseName = item.fileName.replace(/\.[^.]+$/, '');
      let finalName = `${baseName}_token.png`;
      let counter = 1;
      while (usedNames.has(finalName)) {
        finalName = `${baseName}_token_${counter++}.png`;
      }
      usedNames.add(finalName);
      zip.file(finalName, item.blob!);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `tokens_batch_${Date.now()}.zip`);
  },
}));
