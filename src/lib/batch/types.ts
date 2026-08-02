import type { BatchVisualDraft } from './editor-draft';

export type BatchItemStatus = 'loading' | 'pending' | 'rendering' | 'done' | 'error';

export interface BatchItem {
  id: string;
  file: File;
  fileName: string;
  /** 原始图片的 object URL，用于显示缩略图 */
  previewUrl: string;
  /** 已加载的 HTMLImageElement */
  imageElement: HTMLImageElement | null;
  /** 渲染后的缩略图 object URL */
  renderedUrl: string | null;
  /** 渲染后的 PNG Blob */
  blob: Blob | null;
  /** 此图片独有的可视化编辑草稿 */
  draft: BatchVisualDraft | null;
  status: BatchItemStatus;
  error?: string;
}
