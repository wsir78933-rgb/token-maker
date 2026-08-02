import type { BatchItem } from './types';

export function createBatchItem(file: File): BatchItem {
  return {
    id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    fileName: file.name,
    previewUrl: '',
    imageElement: null,
    renderedUrl: null,
    blob: null,
    draft: null,
    status: 'loading',
  };
}

export function loadBatchImageFile(file: File): Promise<{ url: string; element: HTMLImageElement }> {
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

export function revokeObjectUrl(url: string | null | undefined) {
  if (!url || typeof URL === 'undefined') return;
  URL.revokeObjectURL(url);
}

export function revokeBatchItemUrls(item: Pick<BatchItem, 'previewUrl' | 'renderedUrl'>) {
  revokeObjectUrl(item.previewUrl);
  revokeObjectUrl(item.renderedUrl);
}
