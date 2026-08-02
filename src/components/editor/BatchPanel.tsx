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
import { captureCurrentBatchDraft, loadBatchItemIntoEditor } from '@/lib/batch/editor-session';
import type { BatchItem } from '@/lib/batch/types';
import { getNextIncompleteItemId, useBatchStore } from '@/lib/store/batch-store';
import { useI18n, type I18nKey } from '@/lib/i18n';
import { trackUploadImage } from '@/lib/analytics';
import { getSupportedImageFiles, loadEditorImageFile } from './upload-files';
import { useBatchEditorBridge } from './editor-store-hooks';

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : String(error);
}

async function loadBatchItemWithSingleRetry(item: BatchItem) {
  const firstLoadResult = await loadBatchItemIntoEditor(item, item.draft);
  if (firstLoadResult === 'loaded') {
    return firstLoadResult;
  }

  return loadBatchItemIntoEditor(item, item.draft);
}

export function BatchPanel() {
  const { t } = useI18n();
  const items = useBatchStore((state) => state.items);
  const isProcessing = useBatchStore((state) => state.isProcessing);
  const selectedItemId = useBatchStore((state) => state.selectedItemId);
  const deactivate = useBatchStore((state) => state.deactivate);
  const addFiles = useBatchStore((state) => state.addFiles);
  const removeItem = useBatchStore((state) => state.removeItem);
  const clearAll = useBatchStore((state) => state.clearAll);
  const selectItem = useBatchStore((state) => state.selectItem);
  const saveItemDraft = useBatchStore((state) => state.saveItemDraft);
  const processItem = useBatchStore((state) => state.processItem);
  const processAll = useBatchStore((state) => state.processAll);
  const retryItem = useBatchStore((state) => state.retryItem);
  const downloadZip = useBatchStore((state) => state.downloadZip);
  const { exportSize, getEditorSnapshot, firstImagePreviewOptions } = useBatchEditorBridge();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorLoadedItemIdRef = useRef<string | null>(null);
  const editorLoadingItemIdRef = useRef<string | null>(null);
  const dragDepthRef = useRef(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [editorLoadErrorMessage, setEditorLoadErrorMessage] = useState<string | null>(null);

  const doneCount = items.filter((item) => item.status === 'done').length;
  const errorCount = items.filter((item) => item.status === 'error').length;
  const processableCount = items.filter(
    (item) => item.status === 'pending' || item.status === 'error',
  ).length;
  const totalCount = items.length;
  const allDone = totalCount > 0 && doneCount === totalCount;
  const hasItems = totalCount > 0;
  const selectedItem = items.find((item) => item.id === selectedItemId);
  const isSelectedItemLoaded =
    selectedItemId !== null && editorLoadedItemIdRef.current === selectedItemId;
  const isMutationLocked = isProcessing || isSwitching;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (selectedItemId === null) {
      editorLoadedItemIdRef.current = null;
      editorLoadingItemIdRef.current = null;
      return;
    }

    if (
      editorLoadedItemIdRef.current === selectedItemId ||
      editorLoadingItemIdRef.current === selectedItemId
    ) {
      return;
    }

    const itemToLoad = useBatchStore
      .getState()
      .items.find((item) => item.id === selectedItemId);
    if (!itemToLoad) {
      return;
    }

    editorLoadingItemIdRef.current = selectedItemId;

    const loadInitialSelection = async () => {
      setIsSwitching(true);
      try {
        const loadResult = await loadBatchItemWithSingleRetry(itemToLoad);
        if (useBatchStore.getState().selectedItemId === selectedItemId) {
          if (loadResult === 'loaded') {
            editorLoadedItemIdRef.current = selectedItemId;
            setEditorLoadErrorMessage(null);
          } else {
            setEditorLoadErrorMessage(itemToLoad.fileName);
          }
        }
      } catch (error) {
        if (useBatchStore.getState().selectedItemId === selectedItemId) {
          setEditorLoadErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (editorLoadingItemIdRef.current === selectedItemId) {
          editorLoadingItemIdRef.current = null;
        }
        setIsSwitching(false);
      }
    };

    void loadInitialSelection();
  }, [selectedItemId]);

  const saveLoadedItemDraft = (itemId: string | null) => {
    if (itemId === null || editorLoadedItemIdRef.current !== itemId) {
      return;
    }

    saveItemDraft(itemId, captureCurrentBatchDraft());
  };

  const loadAndSelectItem = async (targetItemId: string, shouldSaveCurrentDraft: boolean) => {
    const currentSelectedItemId = useBatchStore.getState().selectedItemId;
    if (
      targetItemId === currentSelectedItemId &&
      editorLoadedItemIdRef.current === currentSelectedItemId
    ) {
      return;
    }

    const targetItem = useBatchStore
      .getState()
      .items.find((item) => item.id === targetItemId);
    if (!targetItem) {
      throw new Error(`Batch item not found: "${targetItemId}"`);
    }

    if (shouldSaveCurrentDraft) {
      saveLoadedItemDraft(currentSelectedItemId);
    }

    setIsSwitching(true);
    try {
      const loadResult = await loadBatchItemWithSingleRetry(targetItem);
      if (loadResult === 'loaded') {
        selectItem(targetItemId);
        editorLoadedItemIdRef.current = targetItemId;
        setEditorLoadErrorMessage(null);
      } else {
        setEditorLoadErrorMessage(targetItem.fileName);
      }
    } catch (error) {
      setEditorLoadErrorMessage(getErrorMessage(error));
    } finally {
      setIsSwitching(false);
    }
  };

  const handleFiles = (files: File[]) => {
    if (isMutationLocked) {
      return;
    }

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

  const onDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMutationLocked) return;
    dragDepthRef.current += 1;
    setIsDragActive(true);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = isMutationLocked ? 'none' : 'copy';
  };

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMutationLocked) return;
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragActive(false);
    handleFiles(Array.from(event.dataTransfer.files));
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const handleCompleteCurrent = async () => {
    if (!selectedItemId || editorLoadedItemIdRef.current !== selectedItemId) {
      return;
    }

    saveLoadedItemDraft(selectedItemId);
    const snapshot = getEditorSnapshot();
    const processOutcome = await processItem(selectedItemId, snapshot, exportSize);
    saveLoadedItemDraft(selectedItemId);

    const completedItem = useBatchStore
      .getState()
      .items.find((item) => item.id === selectedItemId);
    if (processOutcome !== 'done' || completedItem?.status !== 'done') {
      return;
    }

    const nextItemId = getNextIncompleteItemId(
      useBatchStore.getState().items,
      selectedItemId,
    );
    if (nextItemId) {
      await loadAndSelectItem(nextItemId, false);
    }
  };

  const handleProcessAll = async () => {
    saveLoadedItemDraft(selectedItemId);
    const snapshot = getEditorSnapshot();
    await processAll(snapshot, exportSize);
  };

  const handleRetry = async (id: string) => {
    const snapshot = getEditorSnapshot();
    await retryItem(id, snapshot, exportSize);
  };

  const handleDownloadZip = async () => {
    saveLoadedItemDraft(selectedItemId);
    await downloadZip({
      tokenFileSuffix: t('batchTokenFileSuffix'),
      zipFileBaseName: t('batchZipFileBaseName'),
    });
  };

  return (
    <div className="flex h-full flex-col bg-background/10 p-4 sm:p-6">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <button
          onClick={deactivate}
          disabled={isMutationLocked}
          className="flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('batchExit')}
        </button>

        {hasItems && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted/60 px-3 py-1 text-xs tabular-nums text-muted-foreground backdrop-blur">
              {totalCount} {t('batchItemCount')}
              {doneCount > 0 && ` · ${doneCount} ✓`}
              {errorCount > 0 && ` · ${errorCount} ✗`}
            </span>
            <button
              onClick={clearAll}
              disabled={isMutationLocked}
              aria-label={t('batchClearAll')}
              title={t('batchClearAll')}
              className="rounded-full border border-border/50 bg-background/80 p-2 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {editorLoadErrorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {t('batchEditorLoadError')}: {editorLoadErrorMessage}
        </div>
      )}

      {!hasItems ? (
        <div className="flex flex-1 items-center justify-center">
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => {
              if (!isMutationLocked) fileInputRef.current?.click();
            }}
            className={`flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
              isMutationLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } ${
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
              disabled={isMutationLocked}
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">{t('batchDropHint')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('batchOrClick')}</p>
            <p className="mt-4 text-xs text-muted-foreground/60">{t('batchStartHint')}</p>
          </div>
        </div>
      ) : (
        <>
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex-1 overflow-y-auto rounded-xl border p-4 transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border/30 bg-muted/5'
            }`}
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {items.map((item) => (
                <BatchItemCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedItemId}
                  disabled={isMutationLocked}
                  onSelect={() => void loadAndSelectItem(item.id, true)}
                  onRemove={() => removeItem(item.id)}
                  onRetry={() => void handleRetry(item.id)}
                  t={t}
                />
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isMutationLocked}
                aria-label={t('batchOrClick')}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={isMutationLocked}
            />
          </div>

          <div className="mt-4 flex shrink-0 flex-col gap-3">
            {isProcessing && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {t('batchProgress')}
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

            {allDone && !isProcessing && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-2 text-sm font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {t('batchDone')}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1 gap-2 font-medium"
                onClick={handleCompleteCurrent}
                disabled={
                  isMutationLocked ||
                  !isSelectedItemLoaded ||
                  !selectedItem ||
                  selectedItem.status === 'loading'
                }
              >
                <CheckCircle2 className="h-4 w-4" />
                {t('batchCompleteCurrent')}
              </Button>

              <Button
                className="flex-1 gap-2 font-medium"
                onClick={handleProcessAll}
                disabled={isMutationLocked || processableCount === 0}
              >
                <Play className="h-4 w-4" />
                {t('batchProcess')}
              </Button>

              <Button
                variant="outline"
                className="flex-1 gap-2 font-medium"
                onClick={handleDownloadZip}
                disabled={isMutationLocked || doneCount === 0}
              >
                <Download className="h-4 w-4" />
                {t('batchDownloadZip')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface BatchItemCardProps {
  item: BatchItem;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onRetry: () => void;
  t: (key: I18nKey) => string;
}

function BatchItemCard({
  item,
  isSelected,
  disabled,
  onSelect,
  onRemove,
  onRetry,
  t,
}: BatchItemCardProps) {
  const displayUrl = item.renderedUrl || item.previewUrl;
  const statusDescriptionId = `batch-item-status-${item.id}`;
  const statusDescriptions = [
    isSelected ? t('batchCurrentItem') : null,
    item.draft && item.status !== 'done' ? t('batchDraftSaved') : null,
    item.status === 'done' ? t('batchStatusDone') : null,
    item.status === 'rendering' ? t('batchStatusRendering') : null,
    item.status === 'error' ? t('batchStatusError') : null,
    item.status === 'error' ? item.error : null,
  ].filter((description): description is string => Boolean(description));

  return (
    <div
      className={`group relative aspect-square rounded-lg border bg-background/50 transition-all ${
        isSelected
          ? 'border-primary ring-2 ring-primary/60'
          : 'border-border/30 hover:border-border/60'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        aria-label={`${t('batchEditItem')} ${item.fileName}`}
        aria-describedby={statusDescriptionId}
        aria-pressed={isSelected}
        className="relative h-full w-full overflow-hidden rounded-lg text-left disabled:cursor-not-allowed"
      >
        {displayUrl ? (
          // Blob/object URLs are generated locally and cannot be optimized by next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt={item.fileName} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-muted/20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
          </span>
        )}

        {item.status === 'rendering' && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </span>
        )}

        {item.status === 'done' && (
          <span className="absolute bottom-1 right-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-md" />
          </span>
        )}

        {item.status === 'error' && (
          <span
            title={item.error}
            className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          >
            <AlertCircle className="h-5 w-5 text-destructive" />
          </span>
        )}

        <span className="absolute left-1 top-1 flex flex-col items-start gap-1">
          {isSelected && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground shadow">
              {t('batchCurrentItem')}
            </span>
          )}
          {item.draft && item.status !== 'done' && (
            <span className="rounded bg-background/80 px-1.5 py-0.5 text-[9px] font-medium text-foreground shadow backdrop-blur">
              {t('batchDraftSaved')}
            </span>
          )}
        </span>

        <span
          title={item.fileName}
          className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4 text-[9px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {item.fileName}
        </span>
      </button>

      <span id={statusDescriptionId} className="sr-only">
        {statusDescriptions.join('. ')}
      </span>

      {item.status === 'error' && (
        <button
          type="button"
          onClick={onRetry}
          disabled={disabled}
          aria-label={`${t('batchRetry')} ${item.fileName}`}
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 translate-y-3 items-center gap-1 rounded-full bg-muted/80 px-2.5 py-1 text-[10px] font-medium text-foreground shadow transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCw className="h-3 w-3" />
          {t('batchRetry')}
        </button>
      )}

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`${t('batchRemove')} ${item.fileName}`}
        className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 shadow backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/80 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
