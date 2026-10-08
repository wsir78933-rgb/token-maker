'use client';

import { useEffect, useId, useState, type ChangeEvent } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SiteLocale } from '@/lib/site-locale';
import {
  TOWN_SAVE_SLOT_COUNT,
  loadTownSlot,
  parseTownDocument,
  readTownSaveSlots,
  saveTownSlot,
  serializeTownDocument,
  type TownStoredSlot,
} from '@/lib/town-creator/storage';
import type { TownDocument } from '@/lib/town-creator/types';

import styles from './TownDialogs.module.css';

export type TownSaveDialogProps = {
  locale: SiteLocale;
  document: TownDocument;
  onClose: () => void;
  onLoadDocument: (document: TownDocument) => void;
};

type TownSaveCopy = {
  title: string;
  description: string;
  slot: string;
  empty: string;
  savedAt: (value: string) => string;
  save: string;
  load: string;
  download: string;
  importFile: string;
  importLabel: string;
  fileHint: string;
  overwriteTitle: string;
  overwriteDescription: string;
  confirmOverwrite: string;
  cancel: string;
  close: string;
  loading: string;
  loaded: string;
  saved: string;
  downloadReady: string;
  imported: string;
  emptySlot: (slotNumber: number) => string;
  storageError: string;
  projectError: string;
};

const COPY: Record<SiteLocale, TownSaveCopy> = {
  en: {
    title: 'Town project files',
    description: 'Save five browser-local slots or download the project file to continue editing.',
    slot: 'Slot',
    empty: 'Empty',
    savedAt: (value) => `Saved ${value}`,
    save: 'Save',
    load: 'Load',
    download: 'Download .txt',
    importFile: 'Import .txt',
    importLabel: 'Choose a town project text file',
    fileHint: 'The file keeps canvas size, background, asset IDs, materials, layers, positions, sizes, and rotations.',
    overwriteTitle: 'Replace this saved town?',
    overwriteDescription: 'Saving here will replace the existing slot. Confirm to continue.',
    confirmOverwrite: 'Replace slot',
    cancel: 'Cancel',
    close: 'Close',
    loading: 'Reading local slots…',
    loaded: 'Town project loaded. Review the canvas before continuing.',
    saved: 'Town project saved.',
    downloadReady: 'Town project downloaded.',
    imported: 'Town project imported. Review the canvas before continuing.',
    emptySlot: (slotNumber) => `Town save slot ${slotNumber} is empty.`,
    storageError: 'Local save storage is unavailable. No save or load action was completed.',
    projectError: 'The town project could not be accepted.',
  },
  zh: {
    title: '城镇项目文件',
    description: '保存 5 个浏览器存档，或下载项目文件继续编辑。',
    slot: '存档位',
    empty: '空位',
    savedAt: (value) => `保存于 ${value}`,
    save: '保存',
    load: '加载',
    download: '下载 .txt',
    importFile: '导入 .txt',
    importLabel: '选择城镇项目文本文件',
    fileHint: '文件会保留画布尺寸、背景、素材 ID、材质、图层、位置、尺寸和旋转。',
    overwriteTitle: '替换这个存档吗？',
    overwriteDescription: '保存后会替换当前存档位已有内容，请确认继续。',
    confirmOverwrite: '确认替换',
    cancel: '取消',
    close: '关闭',
    loading: '正在读取本地存档…',
    loaded: '城镇项目已加载，请检查画布后继续。',
    saved: '城镇项目已保存。',
    downloadReady: '城镇项目已下载。',
    imported: '城镇项目已导入，请检查画布后继续。',
    emptySlot: (slotNumber) => `存档位 ${slotNumber} 为空。`,
    storageError: '本地存档不可用，未完成保存或加载。',
    projectError: '无法接受这个城镇项目。',
  },
};

function formatFailure(value: unknown): string {
  if (value instanceof Error && value.message.length > 0) return value.message;
  if (value instanceof Error) return `${value.name} with empty message`;
  if (typeof value === 'string' && value.length > 0) return value;
  throw value;
}

function getTownBrowserStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Town save storage requires a browser window.');
  }

  try {
    return window.localStorage;
  } catch (storageFailure: unknown) {
    throw new Error(`Town save storage could not be accessed. Received ${formatFailure(storageFailure)}.`, {
      cause: storageFailure,
    });
  }
}

function formatSavedAt(locale: SiteLocale, savedAt: string): string {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Town save date must be valid. Received ${JSON.stringify(savedAt)}.`);
  }

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function downloadTownProject(document: TownDocument): void {
  if (typeof window === 'undefined' || typeof window.URL?.createObjectURL !== 'function' || typeof window.URL.revokeObjectURL !== 'function') {
    throw new Error('Town project download requires URL.createObjectURL and URL.revokeObjectURL.');
  }

  const file = new Blob([serializeTownDocument(document)], { type: 'text/plain;charset=utf-8' });
  const objectUrl = window.URL.createObjectURL(file);
  try {
    const anchor = window.document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'town-project.txt';
    anchor.click();
  } finally {
    window.URL.revokeObjectURL(objectUrl);
  }
}

function renderStoredAt(locale: SiteLocale, copy: TownSaveCopy, slot: TownStoredSlot | null): string {
  return slot === null ? copy.empty : copy.savedAt(formatSavedAt(locale, slot.savedAt));
}

export function TownSaveDialog({ locale, document, onClose, onLoadDocument }: TownSaveDialogProps) {
  const copy = COPY[locale];
  const fileInputId = `town-project-import-${useId().replace(/:/g, '')}`;
  const [slots, setSlots] = useState<Array<TownStoredSlot | null> | null>(null);
  const [pendingOverwrite, setPendingOverwrite] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const storedSlots = readTownSaveSlots(getTownBrowserStorage());
        if (!cancelled) setSlots(storedSlots);
      } catch (readFailure: unknown) {
        if (!cancelled) {
          setError(`${copy.storageError} ${formatFailure(readFailure)}`);
          setSlots(null);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [copy.storageError]);

  function saveToSlot(slotNumber: number): void {
    if (slots === null) {
      setError(`${copy.storageError}`);
      return;
    }

    if (slots[slotNumber - 1] !== null && pendingOverwrite !== slotNumber) {
      setPendingOverwrite(slotNumber);
      setError(null);
      setStatus(null);
      return;
    }

    try {
      const updatedSlots = saveTownSlot(getTownBrowserStorage(), slotNumber, document);
      setSlots(updatedSlots);
      setPendingOverwrite(null);
      setError(null);
      setStatus(copy.saved);
    } catch (saveFailure: unknown) {
      setPendingOverwrite(null);
      setError(`${copy.storageError} ${formatFailure(saveFailure)}`);
      setStatus(null);
    }
  }

  function loadFromSlot(slotNumber: number): void {
    if (slots === null) {
      setError(`${copy.storageError}`);
      return;
    }

    try {
      const loadedDocument = loadTownSlot(getTownBrowserStorage(), slotNumber);
      if (loadedDocument === null) {
        setError(copy.emptySlot(slotNumber));
        setStatus(null);
        return;
      }

      onLoadDocument(loadedDocument);
      setError(null);
      setStatus(copy.loaded);
    } catch (loadFailure: unknown) {
      setError(`${copy.storageError} ${formatFailure(loadFailure)}`);
      setStatus(null);
    }
  }

  function handleDownload(): void {
    try {
      downloadTownProject(document);
      setError(null);
      setStatus(copy.downloadReady);
    } catch (downloadFailure: unknown) {
      setError(`${copy.projectError} ${formatFailure(downloadFailure)}`);
      setStatus(null);
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = '';
    if (selectedFile === null) return;

    try {
      const serializedDocument = await selectedFile.text();
      const importedDocument = parseTownDocument(serializedDocument);
      onLoadDocument(importedDocument);
      setError(null);
      setStatus(copy.imported);
    } catch (importFailure: unknown) {
      setError(`${copy.projectError} ${formatFailure(importFailure)}`);
      setStatus(null);
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
            {error !== null ? <p className={styles.errorMessage} role="alert">{error}</p> : null}
            {status !== null ? <p className={styles.statusMessage} role="status" aria-live="polite">{status}</p> : null}
            {slots === null ? <p className={styles.hint}>{copy.loading}</p> : null}
            <div className={styles.slotGrid}>
              {Array.from({ length: TOWN_SAVE_SLOT_COUNT }, (_, index) => {
                const slotNumber = index + 1;
                const slot = slots?.[index] ?? null;
                const isConfirming = pendingOverwrite === slotNumber;
                return (
                  <article className={styles.slotCard} key={slotNumber}>
                    <h3 className={styles.slotTitle}>{copy.slot} {slotNumber}</h3>
                    <p className={styles.slotState}>{renderStoredAt(locale, copy, slot)}</p>
                    <div className={styles.slotActions}>
                      <button type="button" className={styles.secondaryButton} disabled={slots === null} onClick={() => saveToSlot(slotNumber)}>
                        {copy.save}
                      </button>
                      <button type="button" className={styles.secondaryButton} disabled={slots === null || slot === null} onClick={() => loadFromSlot(slotNumber)}>
                        {copy.load}
                      </button>
                    </div>
                    {isConfirming ? (
                      <div className={styles.confirmation} role="alertdialog" aria-label={copy.overwriteTitle}>
                        <strong>{copy.overwriteTitle}</strong>
                        <p>{copy.overwriteDescription}</p>
                        <div className={styles.confirmationActions}>
                          <button type="button" className={styles.secondaryButton} onClick={() => setPendingOverwrite(null)}>{copy.cancel}</button>
                          <button type="button" className={styles.primaryButton} onClick={() => saveToSlot(slotNumber)}>{copy.confirmOverwrite}</button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
            <p className={styles.hint}>{copy.fileHint}</p>
            <div className={styles.actionGrid}>
              <button type="button" className={styles.secondaryButton} onClick={handleDownload}>{copy.download}</button>
              <label className={styles.secondaryButton} htmlFor={fileInputId}>
                {copy.importFile}
                <input id={fileInputId} className={styles.fileInput} type="file" accept=".txt,text/plain,application/json" aria-label={copy.importLabel} onChange={(event) => void handleImport(event)} />
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
