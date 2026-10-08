'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SiteLocale } from '@/lib/site-locale';
import { buildTownPng } from '@/lib/town-creator/export-image';
import type { TownDocument } from '@/lib/town-creator/types';

import styles from './TownDialogs.module.css';

export type TownExportDialogProps = {
  locale: SiteLocale;
  document: TownDocument;
  onClose: () => void;
};

const COPY = {
  en: {
    title: 'Export town PNG',
    description: 'A clean canvas export uses the current visible layers, rotations, repeats, and background.',
    size: 'Output size',
    generating: 'Generating preview…',
    generate: 'Regenerate preview',
    download: 'Download PNG',
    edit: 'Back to editor',
    failed: 'PNG export failed. No previous preview is kept.',
    ready: 'Preview ready.',
    close: 'Close',
    downloadFailed: 'PNG download failed.',
    noPreview: 'No preview is available.',
  },
  zh: {
    title: '导出城镇 PNG',
    description: '干净画布导出会使用当前可见图层、旋转、重复规则和背景。',
    size: '输出尺寸',
    generating: '正在生成预览…',
    generate: '重新生成预览',
    download: '下载 PNG',
    edit: '回到编辑器',
    failed: 'PNG 导出失败，已清除旧预览。',
    ready: '预览已生成。',
    close: '关闭',
    downloadFailed: 'PNG 下载失败。',
    noPreview: '暂无可用预览。',
  },
} as const;

function formatFailure(value: unknown): string {
  if (value instanceof Error && value.message.length > 0) return value.message;
  if (value instanceof Error) return `${value.name} with empty message`;
  if (typeof value === 'string' && value.length > 0) return value;
  throw value;
}

function requireDownloadUrlApi(): Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'> {
  if (typeof URL !== 'function' || typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
    throw new Error('Town PNG download requires URL.createObjectURL and URL.revokeObjectURL.');
  }

  return URL;
}

export function TownExportDialog({ locale, document, onClose }: TownExportDialogProps) {
  const copy = COPY[locale];
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const generationIdRef = useRef(0);

  const clearPreview = useCallback((): void => {
    const objectUrl = previewUrlRef.current;
    if (objectUrl !== null && typeof URL === 'function' && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(objectUrl);
    }
    previewUrlRef.current = null;
    setPreviewUrl(null);
    setPreviewBlob(null);
  }, []);

  const generatePreview = useCallback(async (): Promise<void> => {
    const generationId = generationIdRef.current + 1;
    generationIdRef.current = generationId;
    clearPreview();
    setIsGenerating(true);
    setError(null);
    setStatus(null);

    try {
      const pngBlob = await buildTownPng(document);
      if (generationIdRef.current !== generationId) return;
      const objectUrl = requireDownloadUrlApi().createObjectURL(pngBlob);
      previewUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      setPreviewBlob(pngBlob);
      setStatus(copy.ready);
    } catch (generationFailure: unknown) {
      if (generationIdRef.current !== generationId) return;
      setError(`${copy.failed} ${formatFailure(generationFailure)}`);
      setStatus(null);
    } finally {
      if (generationIdRef.current === generationId) {
        setIsGenerating(false);
      }
    }
  }, [clearPreview, copy.failed, copy.ready, document]);

  useEffect(() => {
    void generatePreview();
    return () => {
      generationIdRef.current += 1;
      clearPreview();
    };
  }, [clearPreview, generatePreview]);

  function downloadPreview(): void {
    if (previewBlob === null) {
      setError(`${copy.failed} ${copy.noPreview}`);
      setStatus(null);
      return;
    }

    let objectUrl: string | null = null;
    try {
      objectUrl = requireDownloadUrlApi().createObjectURL(previewBlob);
      const anchor = window.document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'town-map.png';
      anchor.click();
    } catch (downloadFailure: unknown) {
      setError(`${copy.downloadFailed} ${formatFailure(downloadFailure)}`);
      setStatus(null);
    } finally {
      if (objectUrl !== null) {
        requireDownloadUrlApi().revokeObjectURL(objectUrl);
      }
    }
  }

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.dialogPanel}>
          <header className={styles.dialogHeader}>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
            <DialogClose className={styles.closeButton} aria-label={copy.close}>{copy.close}</DialogClose>
          </header>
          <div className={styles.dialogScroll}>
            <p className={styles.exportSize}>{copy.size}: {document.width} × {document.height}px</p>
            {error !== null ? <p className={styles.errorMessage} role="alert">{error}</p> : null}
            {status !== null ? <p className={styles.statusMessage} role="status" aria-live="polite">{status}</p> : null}
            <div className={styles.previewFrame} aria-busy={isGenerating}>
              {previewUrl !== null ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.previewImage} src={previewUrl} alt={copy.title} />
              ) : <p className={styles.previewEmpty}>{isGenerating ? copy.generating : copy.failed}</p>}
            </div>
            <div className={styles.actionGrid}>
              <button type="button" className={styles.primaryButton} disabled={isGenerating} onClick={() => void generatePreview()}>{copy.generate}</button>
              <button type="button" className={styles.secondaryButton} disabled={isGenerating || previewBlob === null} onClick={downloadPreview}>{copy.download}</button>
              <button type="button" className={styles.secondaryButton} onClick={onClose}>{copy.edit}</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
