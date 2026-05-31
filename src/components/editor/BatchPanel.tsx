'use client';

import { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  Download,
  Play,
  Trash2,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ImagePlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBatchStore } from '@/lib/store/batch-store';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { trackUploadImage } from '@/lib/analytics';
import { getSupportedImageFiles, loadEditorImageFile } from './upload-files';
import { useBatchEditorBridge } from './editor-store-hooks';

// ============================================================
// BatchPanel — 批处理主面板
// 替换中间画布区域，提供多文件上传、预览、批量渲染和 ZIP 下载
// ============================================================

export function BatchPanel() {
  const { t } = useI18n();
  const items = useBatchStore((state) => state.items);
  const isProcessing = useBatchStore((state) => state.isProcessing);
  const deactivate = useBatchStore((state) => state.deactivate);
  const addFiles = useBatchStore((state) => state.addFiles);
  const removeItem = useBatchStore((state) => state.removeItem);
  const clearAll = useBatchStore((state) => state.clearAll);
  const processAll = useBatchStore((state) => state.processAll);
  const retryItem = useBatchStore((state) => state.retryItem);
  const downloadZip = useBatchStore((state) => state.downloadZip);
  const { exportSize, getEditorSnapshot, firstImagePreviewOptions } = useBatchEditorBridge();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragDepthRef = useRef(0);

  const doneCount = items.filter((i) => i.status === 'done').length;
  const errorCount = items.filter((i) => i.status === 'error').length;
  const totalCount = items.length;
  const allDone = totalCount > 0 && doneCount === totalCount;
  const hasItems = totalCount > 0;

  // 进度百分比
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (isProcessing || totalCount !== 1) return;
    const singleItem = items[0];
    if (!singleItem) return;

    loadEditorImageFile(singleItem.file);
    deactivate();
  }, [deactivate, isProcessing, items, totalCount]);

  const handleFiles = (files: File[]) => {
    const imageFiles = getSupportedImageFiles(files);
    if (imageFiles.length === 0) return;

    if (!hasItems && imageFiles.length === 1) {
      deactivate();
      loadEditorImageFile(imageFiles[0]);
      return;
    }

    trackUploadImage(imageFiles.length, 'batch_add');
    addFiles(imageFiles, firstImagePreviewOptions);
  };

  // ── 拖拽事件处理 ──
  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragActive(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragActive(false);

    handleFiles(Array.from(e.dataTransfer.files));
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  };

  const handleProcess = () => {
    const snapshot = getEditorSnapshot();
    processAll(snapshot, exportSize);
  };

  const handleRetry = (id: string) => {
    const snapshot = getEditorSnapshot();
    retryItem(id, snapshot, exportSize);
  };

  return (
    <div className="flex h-full flex-col bg-background/10 p-4 sm:p-6">

      {/* ── 顶部操作栏 (flow layout, not absolute) ── */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <button
          onClick={deactivate}
          className="flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('batchExit' as I18nKey)}
        </button>

        {hasItems && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted/60 px-3 py-1 text-xs tabular-nums text-muted-foreground backdrop-blur">
              {totalCount} {t('batchItemCount' as I18nKey)}
              {doneCount > 0 && ` · ${doneCount} ✓`}
              {errorCount > 0 && ` · ${errorCount} ✗`}
            </span>
            <button
              onClick={clearAll}
              className="rounded-full border border-border/50 bg-background/80 p-2 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-destructive/10 hover:text-destructive"
              title={t('batchClearAll' as I18nKey)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── 主内容区域 ── */}
      {!hasItems ? (
        /* 空状态 — 上传区 */
        <div className="flex flex-1 items-center justify-center">
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
              isDragActive
                ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]'
                : 'border-border/50 bg-muted/10 hover:border-primary/40 hover:bg-muted/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
              className="hidden"
              multiple
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              {t('batchDropHint' as I18nKey)}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('batchOrClick' as I18nKey)}
            </p>
            <p className="mt-4 text-xs text-muted-foreground/60">
              {t('batchStartHint' as I18nKey)}
            </p>
          </div>
        </div>
      ) : (
        /* 有图片 — 网格预览 + 操作区 */
        <>
          {/* 缩略图网格 */}
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex-1 overflow-y-auto rounded-xl border p-4 transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border/30 bg-muted/5'
            }`}
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {items.map((item) => (
                <BatchItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onRetry={() => handleRetry(item.id)}
                  t={t}
                />
              ))}

              {/* 添加更多按钮 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <ImagePlus className="h-6 w-6" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
              className="hidden"
              multiple
            />
          </div>

          {/* 底部操作栏 */}
          <div className="mt-4 flex shrink-0 flex-col gap-3">
            {/* 进度条 */}
            {isProcessing && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {t('batchProgress' as I18nKey)}
                  </span>
                  <span className="tabular-nums">{progressPercent}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* 完成提示 */}
            {allDone && !isProcessing && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-2 text-sm font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {t('batchDone' as I18nKey)}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                className="flex-1 gap-2 font-medium"
                onClick={handleProcess}
                disabled={isProcessing || items.filter((i) => i.status === 'pending' || i.status === 'error').length === 0}
              >
                <Play className="h-4 w-4" />
                {t('batchProcess' as I18nKey)}
              </Button>

              <Button
                variant="outline"
                className="flex-1 gap-2 font-medium"
                onClick={downloadZip}
                disabled={doneCount === 0}
              >
                <Download className="h-4 w-4" />
                {t('batchDownloadZip' as I18nKey)}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// BatchItemCard — 单个批处理图片的缩略图卡片
// ============================================================

interface BatchItemCardProps {
  item: {
    id: string;
    fileName: string;
    previewUrl: string;
    renderedUrl: string | null;
    status: string;
    error?: string;
  };
  onRemove: () => void;
  onRetry: () => void;
  t: (key: I18nKey) => string;
}

function BatchItemCard({ item, onRemove, onRetry, t }: BatchItemCardProps) {
  const displayUrl = item.renderedUrl || item.previewUrl;

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border/30 bg-background/50 transition-all hover:border-border/60">
      {/* 缩略图 */}
      {displayUrl ? (
        // Blob/object URLs are generated locally and cannot be optimized by next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={item.fileName}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
        </div>
      )}

      {/* 状态遮罩 */}
      {item.status === 'rendering' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {item.status === 'done' && (
        <div className="absolute bottom-1 right-1">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-md" />
        </div>
      )}

      {item.status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-background/70 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <button
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RotateCw className="h-3 w-3" />
            {t('batchRetry' as I18nKey)}
          </button>
        </div>
      )}

      {/* 悬浮删除按钮 */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 shadow backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/80 hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>

      {/* 文件名 tooltip */}
      <div className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4 text-[9px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
        {item.fileName}
      </div>
    </div>
  );
}
