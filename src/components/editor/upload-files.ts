import { trackUploadImage } from '@/lib/analytics';
import { useEditorStore } from '@/lib/store/editor-store';

export const SUPPORTED_IMAGE_NAME = /\.(png|jpe?g|webp)$/i;

export function isSupportedImageFile(file: File | null | undefined): file is File {
  if (!file) return false;
  return file.type.startsWith('image/') || SUPPORTED_IMAGE_NAME.test(file.name);
}

export function getSupportedImageFiles(
  files: ArrayLike<File | null | undefined> | Iterable<File | null | undefined>
) {
  return Array.from(files).filter(isSupportedImageFile);
}

export function extractImageFiles(dataTransfer: DataTransfer) {
  const filesFromFiles = getSupportedImageFiles(dataTransfer.files);
  if (filesFromFiles.length > 0) return filesFromFiles;

  return getSupportedImageFiles(
    Array.from(dataTransfer.items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
  );
}

export function loadEditorImageFile(file: File | null | undefined) {
  if (!isSupportedImageFile(file)) return;

  const requestRevision = useEditorStore.getState().beginImageLoad();
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const store = useEditorStore.getState();
    if (store.imageLoadRevision !== requestRevision) {
      URL.revokeObjectURL(url);
      return;
    }

    store.setImage(url, img);
    trackUploadImage();
  };
  img.onerror = () => {
    const store = useEditorStore.getState();
    if (store.imageLoadRevision === requestRevision) {
      store.cancelImageLoad();
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
