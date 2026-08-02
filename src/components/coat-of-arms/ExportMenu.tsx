'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { COAT_EXPORT_SIZES, exportCoatBatch, exportCoatJpeg, exportCoatPdf, exportCoatPng, printCoatScene } from '@/lib/coat-of-arms/export';
import {
  getDefaultEditorPreferences,
  loadEditorPreferences,
  updateEditorPreferences,
  type EditorExportSize,
  type EditorJpegQuality,
} from '@/lib/coat-of-arms/editor-preferences';
import { sanitizeCoatFileBaseName } from '@/lib/coat-of-arms/file-name';
import { listProjectRecords } from '@/lib/coat-of-arms/project-storage';
import type { CoatLocale, CoatProject } from '@/lib/coat-of-arms/types';
import { Button } from '@/components/ui/button';
import { getCoatWorkbenchCopy } from './workbench-copy';

const exportMenuId = 'coat-local-export-options';
const jpegQualityValues = { low: 0.55, medium: 0.72, high: 0.86, ultra: 0.96 } as const;
type JpegQuality = EditorJpegQuality;

interface ExportMenuProps {
  locale: CoatLocale;
  project: CoatProject;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Downloads a completed local export and guarantees object URL revocation. */
export function downloadCoatBlob(blob: Blob, fileName: string): void {
  if (!(blob instanceof Blob) || blob.size === 0) throw new Error('Export produced an empty file');
  const urlApi = globalThis.URL;
  if (!urlApi || typeof urlApi.createObjectURL !== 'function' || typeof urlApi.revokeObjectURL !== 'function') {
    throw new Error('Export download is unavailable in this browser');
  }
  const objectUrl = urlApi.createObjectURL(blob);
  try {
    const anchor = globalThis.document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
  } finally {
    urlApi.revokeObjectURL(objectUrl);
  }
}

/** Copies a completed PNG to the system clipboard through the browser API. */
export async function copyCoatImage(blob: Blob): Promise<void> {
  if (!(blob instanceof Blob) || blob.size === 0 || blob.type !== 'image/png') {
    throw new Error(`Clipboard image must be a non-empty PNG Blob; received ${blob.type || 'unknown'} (${blob.size} bytes)`);
  }
  const clipboard = globalThis.navigator?.clipboard;
  const ClipboardItemConstructor = globalThis.ClipboardItem;
  if (!clipboard || typeof clipboard.write !== 'function' || !ClipboardItemConstructor) {
    throw new Error('Image copy is unavailable in this browser');
  }
  await clipboard.write([new ClipboardItemConstructor({ 'image/png': blob })]);
}

/** Shares a completed PNG through the native browser share sheet when files are supported. */
export async function shareCoatImage(blob: Blob, fileName: string, title: string): Promise<void> {
  if (!(blob instanceof Blob) || blob.size === 0 || blob.type !== 'image/png') {
    throw new Error(`Shared image must be a non-empty PNG Blob; received ${blob.type || 'unknown'} (${blob.size} bytes)`);
  }
  const navigatorApi = globalThis.navigator;
  const FileConstructor = globalThis.File;
  if (!navigatorApi || typeof navigatorApi.share !== 'function' || !FileConstructor) {
    throw new Error('Image sharing is unavailable in this browser');
  }
  const file = new FileConstructor([blob], fileName, { type: 'image/png' });
  if (typeof navigatorApi.canShare === 'function' && !navigatorApi.canShare({ files: [file] })) {
    throw new Error('Image sharing does not support PNG files in this browser');
  }
  await navigatorApi.share({ files: [file], title });
}

/** UI for existing local export primitives, with its own popup focus lifecycle. */
export function ExportMenu({ locale, project }: ExportMenuProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const [open, setOpen] = useState(false);
  const [exportSize, setExportSize] = useState<EditorExportSize>(getDefaultEditorPreferences().exportSize ?? 1024);
  const [jpegQuality, setJpegQuality] = useState<JpegQuality>(getDefaultEditorPreferences().jpegQuality);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const baseName = sanitizeCoatFileBaseName(project.name);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    let isCurrent = true;
    void Promise.resolve().then(() => {
      try {
        const storedPreferences = loadEditorPreferences();
        if (isCurrent) {
          setExportSize(storedPreferences.exportSize ?? getDefaultEditorPreferences().exportSize ?? 1024);
          setJpegQuality(storedPreferences.jpegQuality);
        }
      } catch (caught) {
        if (isCurrent) setError(copy.exportOperationFailed(getErrorMessage(caught)));
      }
    });
    return () => { isCurrent = false; };
  }, [copy]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const menuContainer = menuContainerRef.current;
      if (menuContainer?.contains(event.target as Node)) return;
      closeMenu();
    };
    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, [closeMenu, open]);

  const onMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    }
  };

  const runExport = async (operation: () => Promise<void> | void, successMessage: string) => {
    try {
      setError(null);
      await operation();
      setStatus(successMessage);
    } catch (caught) {
      setStatus(null);
      setError(copy.exportOperationFailed(getErrorMessage(caught)));
    }
  };
  const updateJpegQuality = (nextQuality: JpegQuality) => {
    try {
      const updatedPreferences = updateEditorPreferences((currentPreferences) => ({ ...currentPreferences, jpegQuality: nextQuality }));
      setJpegQuality(updatedPreferences.jpegQuality);
      setError(null);
    } catch (caught) {
      setError(copy.exportOperationFailed(getErrorMessage(caught)));
    }
  };
  const updateExportSize = (nextExportSize: number) => {
    try {
      const updatedPreferences = updateEditorPreferences((currentPreferences) => ({
        ...currentPreferences,
        exportSize: nextExportSize as EditorExportSize,
      }));
      setExportSize(updatedPreferences.exportSize ?? getDefaultEditorPreferences().exportSize ?? 1024);
      setError(null);
    } catch (caught) {
      setError(copy.exportOperationFailed(getErrorMessage(caught)));
    }
  };
  const getCurrentExportPreferences = () => {
    const latestPreferences = loadEditorPreferences();
    return {
      size: latestPreferences.exportSize ?? getDefaultEditorPreferences().exportSize ?? 1024,
      jpegQuality: latestPreferences.jpegQuality,
    };
  };

  return (
    <div ref={menuContainerRef} className="relative">
      <Button
        ref={triggerRef}
        aria-controls={exportMenuId}
        aria-expanded={open}
        type="button"
        variant="outline"
        onClick={() => open ? closeMenu() : setOpen(true)}
      ><Download aria-hidden="true" /><span>{copy.export}</span><ChevronDown aria-hidden="true" /></Button>
      {open ? <section
        data-coat-editor-overlay
        id={exportMenuId}
        aria-label={copy.exportOptions}
        className="coat-workbench-export-menu"
        onKeyDown={onMenuKeyDown}
        role="region"
      >
        <div className="flex items-center justify-between gap-2">
          <span>{copy.exportOptions}</span>
          <Button ref={closeButtonRef} type="button" variant="ghost" onClick={closeMenu}>{copy.closeExportMenu}</Button>
        </div>
        <label>
          {copy.exportSize}
          <select aria-label={copy.exportSize} value={exportSize} onChange={(event) => updateExportSize(Number(event.target.value))}>
            {COAT_EXPORT_SIZES.map((exportSize) => <option key={exportSize} value={exportSize}>{exportSize}px</option>)}
          </select>
        </label>
        <label>
          {copy.jpegQuality}
          <select aria-label={copy.jpegQuality} value={jpegQuality} onChange={(event) => updateJpegQuality(event.target.value as JpegQuality)}>
            {(Object.keys(jpegQualityValues) as JpegQuality[]).map((quality) => <option key={quality} value={quality}>{copy.jpegQualities[quality]}</option>)}
          </select>
        </label>
          {error ? <p role="alert">{error}</p> : null}
          {status ? <p role="status">{status}</p> : null}
          <div className="coat-workbench-action-row">
          <Button type="button" onClick={() => void runExport(async () => {
            const { size } = getCurrentExportPreferences();
            downloadCoatBlob(await exportCoatPng(project, size), `${baseName}-${size}.png`);
          }, copy.pngExported)}>{copy.exportPng}</Button>
          <Button type="button" variant="outline" onClick={() => void runExport(async () => {
            const { size } = getCurrentExportPreferences();
            await copyCoatImage(await exportCoatPng(project, size));
          }, copy.imageCopied)}>{copy.copyImage}</Button>
          <Button type="button" variant="outline" onClick={() => void runExport(async () => {
            const { size } = getCurrentExportPreferences();
            await shareCoatImage(await exportCoatPng(project, size), `${baseName}-${size}.png`, project.name);
          }, copy.imageShared)}>{copy.shareImage}</Button>
          <Button type="button" variant="outline" onClick={() => void runExport(async () => {
            const { size, jpegQuality: currentJpegQuality } = getCurrentExportPreferences();
            downloadCoatBlob(await exportCoatJpeg(project, size, jpegQualityValues[currentJpegQuality]), `${baseName}-${size}.jpg`);
          }, copy.jpegExported)}>{copy.exportJpeg}</Button>
          <Button type="button" variant="outline" onClick={() => void runExport(async () => {
            const { size } = getCurrentExportPreferences();
            downloadCoatBlob(await exportCoatPdf(project, size), `${baseName}-${size}.pdf`);
          }, copy.pdfExported)}>{copy.exportPdf}</Button>
          <Button type="button" variant="outline" onClick={() => void runExport(() => {
            const { size } = getCurrentExportPreferences();
            printCoatScene(project, size);
          }, copy.printOpened)}>{copy.print}</Button>
          <Button type="button" variant="outline" onClick={() => void runExport(async () => {
            const { size } = getCurrentExportPreferences();
            const storedProjects = listProjectRecords().map((record) => record.project).filter((record) => record.id !== project.id);
            downloadCoatBlob(await exportCoatBatch([project, ...storedProjects], size), `${baseName}-${size}-batch.zip`);
          }, copy.batchExported)}>{copy.exportBatch}</Button>
        </div>
      </section> : null}
    </div>
  );
}
