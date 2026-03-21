'use client';

import { useEffect, useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useI18n } from '@/lib/i18n';
import { trackUploadImage } from '@/lib/analytics';
import { ImageUploaderShowcaseStrip } from '@/components/site/ImageUploaderShowcaseStrip';

const SUPPORTED_IMAGE_NAME = /\.(png|jpe?g|webp)$/i;

function isSupportedImageFile(file: File | null | undefined): file is File {
  if (!file) return false;
  return file.type.startsWith('image/') || SUPPORTED_IMAGE_NAME.test(file.name);
}

function isSupportedImageSource(value: string | null | undefined) {
  if (!value) return false;
  return value.startsWith('data:image/') || SUPPORTED_IMAGE_NAME.test(value);
}

function hasTransferPayload(dataTransfer: DataTransfer | null) {
  if (!dataTransfer) return false;
  return (
    dataTransfer.files.length > 0 ||
    dataTransfer.items.length > 0 ||
    dataTransfer.types.length > 0
  );
}

function extractImageFile(dataTransfer: DataTransfer) {
  const fileFromFiles = Array.from(dataTransfer.files).find(isSupportedImageFile);
  if (fileFromFiles) return fileFromFiles;

  return (
    Array.from(dataTransfer.items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
      .find(isSupportedImageFile) ?? null
  );
}

function extractImageUrl(dataTransfer: DataTransfer) {
  const uriList = dataTransfer
    .getData('text/uri-list')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => isSupportedImageSource(line) && !line.startsWith('#'));

  if (uriList) return uriList;

  const html = dataTransfer.getData('text/html');
  if (html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const imageUrl = doc.querySelector('img')?.getAttribute('src');
    if (isSupportedImageSource(imageUrl)) {
      return imageUrl;
    }
  }

  const plainText = dataTransfer.getData('text/plain').trim();
  if (isSupportedImageSource(plainText)) {
    return plainText;
  }

  return null;
}

function createFileNameFromUrl(url: string, mimeType: string) {
  const extensionFromUrl = url.match(/\.(png|jpe?g|webp)(?=([?#].*)?$)/i)?.[0];
  if (extensionFromUrl) {
    return `dropped-image${extensionFromUrl.toLowerCase()}`;
  }

  switch (mimeType) {
    case 'image/jpeg':
      return 'dropped-image.jpg';
    case 'image/webp':
      return 'dropped-image.webp';
    default:
      return 'dropped-image.png';
  }
}

export function ImageUploader() {
  const { t, locale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const setImage = useEditorStore((state) => state.setImage);

  const handleFile = (file: File | null | undefined) => {
    if (!isSupportedImageFile(file)) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(url, img);
      trackUploadImage();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleImageUrl = async (url: string) => {
    if (!isSupportedImageSource(url)) return;

    try {
      const response = await fetch(url);
      if (!response.ok) return;

      const blob = await response.blob();
      const mimeType =
        blob.type || (url.endsWith('.webp') ? 'image/webp' : url.match(/\.jpe?g(?=([?#].*)?$)/i) ? 'image/jpeg' : 'image/png');
      const file = new File([blob], createFileNameFromUrl(url, mimeType), { type: mimeType });
      handleFile(file);
    } catch (error) {
      console.warn('Failed to read dropped image URL.', error);
    }
  };

  useEffect(() => {
    const preventBrowserFileDrop = (event: DragEvent) => {
      if (!hasTransferPayload(event.dataTransfer)) return;
      event.preventDefault();
    };

    window.addEventListener('dragover', preventBrowserFileDrop);
    window.addEventListener('drop', preventBrowserFileDrop);

    return () => {
      window.removeEventListener('dragover', preventBrowserFileDrop);
      window.removeEventListener('drop', preventBrowserFileDrop);
    };
  }, []);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!hasTransferPayload(e.dataTransfer)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragActive(true);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!hasTransferPayload(e.dataTransfer)) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!hasTransferPayload(e.dataTransfer)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    if (!hasTransferPayload(e.dataTransfer)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragActive(false);

    const droppedFile = extractImageFile(e.dataTransfer);
    if (droppedFile) {
      handleFile(droppedFile);
      return;
    }

    const droppedUrl = extractImageUrl(e.dataTransfer);
    if (droppedUrl) {
      await handleImageUrl(droppedUrl);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex h-full min-h-[400px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]'
          : 'border-border bg-muted/20 hover:bg-muted/40'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        className="hidden"
      />
      <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            {t('dropHint')}
          </h3>
          <p className="text-sm">
            {t('orClickToUpload')}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          {t('supportedFormats')}
        </div>
        <ImageUploaderShowcaseStrip locale={locale} />
      </div>
    </div>
  );
}
