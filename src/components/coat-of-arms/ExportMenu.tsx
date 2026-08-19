'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown, Download, Printer, Share2 } from 'lucide-react';
import {
  coatJpegEncoderQualityByLevel,
  exportCoatJpeg,
  exportCoatPdf,
  exportCoatPng,
  formatCoatExportDimensionsLabel,
  getCoatExportDimensions,
  getCoatExportQualityForSize,
  getCoatExportSizeForQuality,
  printCoatScene,
  type CoatExportQuality,
  type CoatExportSize,
} from '@/lib/coat-of-arms/export';
import {
  getDefaultEditorPreferences,
  loadEditorPreferences,
  updateEditorPreferences,
  type EditorPreferences,
} from '@/lib/coat-of-arms/editor-preferences';
import { sanitizeCoatFileBaseName } from '@/lib/coat-of-arms/file-name';
import type { CoatLocale, CoatProject } from '@/lib/coat-of-arms/types';
import { Button } from '@/components/ui/button';
import { getCoatWorkbenchCopy } from './workbench-copy';

const exportMenuId = 'coat-local-export-options';
const coatExportQualitySliderStops = ['low', 'medium', 'high', 'ultra'] as const;
type CoatExportFileType = 'png' | 'jpeg' | 'pdf';

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

function parseCoatExportFileType(rawValue: string): CoatExportFileType {
  if (rawValue === 'png' || rawValue === 'jpeg' || rawValue === 'pdf') return rawValue;
  throw new Error(`Unsupported coat export file type: ${rawValue}`);
}

function parseCoatExportQualitySliderValue(rawValue: string): CoatExportQuality {
  if (rawValue === 'low' || rawValue === 'medium' || rawValue === 'high' || rawValue === 'ultra') {
    return rawValue;
  }
  const sliderIndex = Number(rawValue);
  if (!Number.isInteger(sliderIndex) || sliderIndex < 0 || sliderIndex >= coatExportQualitySliderStops.length) {
    throw new Error(`Unsupported coat export quality: ${rawValue}`);
  }
  const quality = coatExportQualitySliderStops[sliderIndex];
  if (!quality) throw new Error(`Unsupported coat export quality: ${rawValue}`);
  return quality;
}

function getDownloadSuccessMessage(
  fileType: CoatExportFileType,
  copy: ReturnType<typeof getCoatWorkbenchCopy>,
): string {
  if (fileType === 'jpeg') return copy.jpegExported;
  if (fileType === 'pdf') return copy.pdfExported;
  if (fileType === 'png') return copy.pngExported;
  throw new Error(`Unsupported coat export file type: ${String(fileType)}`);
}

function getCoatExportQualitySliderIndex(quality: CoatExportQuality): number {
  const sliderIndex = coatExportQualitySliderStops.indexOf(quality);
  if (sliderIndex === -1) throw new Error(`Unsupported coat export quality: ${String(quality)}`);
  return sliderIndex;
}

function resolvePersistedExportQuality(preferences: EditorPreferences): CoatExportQuality {
  if (preferences.exportSize !== undefined) return getCoatExportQualityForSize(preferences.exportSize);
  return preferences.jpegQuality;
}

function resolvePersistedExportSize(preferences: EditorPreferences): CoatExportSize {
  if (preferences.exportSize !== undefined) return getCoatExportSizeForQuality(getCoatExportQualityForSize(preferences.exportSize));
  return getCoatExportSizeForQuality(preferences.jpegQuality);
}

function readLatestExportPreferences(): { size: CoatExportSize; quality: CoatExportQuality } {
  const latestPreferences = loadEditorPreferences();
  return {
    size: resolvePersistedExportSize(latestPreferences),
    quality: resolvePersistedExportQuality(latestPreferences),
  };
}

function getCoatExportRenderOptions(transparentBackground: boolean): { transparentBackground: boolean } {
  return { transparentBackground };
}

/** UI for existing local export primitives, with its own popup focus lifecycle. */
export function ExportMenu({ locale, project }: ExportMenuProps) {
  const copy = getCoatWorkbenchCopy(locale);
  const [open, setOpen] = useState(false);
  const [exportQuality, setExportQuality] = useState<CoatExportQuality>(
    resolvePersistedExportQuality(getDefaultEditorPreferences()),
  );
  const [fileType, setFileType] = useState<CoatExportFileType>('png');
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fileTypeSelectRef = useRef<HTMLSelectElement>(null);
  const baseName = sanitizeCoatFileBaseName(project.name);
  const exportSize = getCoatExportSizeForQuality(exportQuality);
  const dimensionsLabel = formatCoatExportDimensionsLabel(getCoatExportDimensions(project, exportSize));

  useEffect(() => {
    if (open) fileTypeSelectRef.current?.focus();
  }, [open]);

  useEffect(() => {
    let isCurrent = true;
    void Promise.resolve().then(() => {
      try {
        const storedPreferences = loadEditorPreferences();
        if (isCurrent) setExportQuality(resolvePersistedExportQuality(storedPreferences));
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

  const persistExportQuality = (nextQuality: CoatExportQuality) => {
    try {
      const updatedPreferences = updateEditorPreferences((currentPreferences) => ({
        ...currentPreferences,
        exportSize: getCoatExportSizeForQuality(nextQuality),
        jpegQuality: nextQuality,
      }));
      setExportQuality(resolvePersistedExportQuality(updatedPreferences));
      setError(null);
    } catch (caught) {
      setError(copy.exportOperationFailed(getErrorMessage(caught)));
    }
  };

  const changeExportFileType = (rawValue: string) => {
    const nextFileType = parseCoatExportFileType(rawValue);
    setFileType(nextFileType);
    if (nextFileType === 'jpeg') setTransparentBackground(false);
  };

  const downloadSelectedExport = async () => {
    const { size, quality } = readLatestExportPreferences();
    const renderOptions = getCoatExportRenderOptions(transparentBackground);
    if (fileType === 'png') {
      downloadCoatBlob(await exportCoatPng(project, size, renderOptions), `${baseName}-${size}.png`);
      return;
    }
    if (fileType === 'jpeg') {
      downloadCoatBlob(await exportCoatJpeg(project, size, coatJpegEncoderQualityByLevel[quality]), `${baseName}-${size}.jpg`);
      return;
    }
    if (fileType === 'pdf') {
      downloadCoatBlob(await exportCoatPdf(project, size, renderOptions), `${baseName}-${size}.pdf`);
      return;
    }
    throw new Error(`Unsupported coat export file type: ${String(fileType)}`);
  };

  const shareSelectedPng = async () => {
    const { size } = readLatestExportPreferences();
    await shareCoatImage(
      await exportCoatPng(project, size, getCoatExportRenderOptions(transparentBackground)),
      `${baseName}-${size}.png`,
      project.name,
    );
  };

  const printSelectedScene = () => {
    const { size } = readLatestExportPreferences();
    printCoatScene(project, size, getCoatExportRenderOptions(transparentBackground));
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
        <label>
          {copy.exportFileType}
          <select
            ref={fileTypeSelectRef}
            aria-label={copy.exportFileType}
            value={fileType}
            onChange={(event) => changeExportFileType(event.target.value)}
          >
            <option value="png">{copy.exportFileTypeNames.png}</option>
            <option value="jpeg">{copy.exportFileTypeNames.jpeg}</option>
            <option value="pdf">{copy.exportFileTypeNames.pdf}</option>
          </select>
        </label>
        <label className="coat-workbench-export-quality">
          {copy.exportQuality}
          <input
            type="range"
            aria-label={copy.exportQuality}
            min={0}
            max={3}
            step={1}
            value={getCoatExportQualitySliderIndex(exportQuality)}
            onChange={(event) => persistExportQuality(parseCoatExportQualitySliderValue(event.target.value))}
          />
          <span className="coat-workbench-export-quality-ticks" aria-hidden="true">
            {coatExportQualitySliderStops.map((quality) => <span key={quality}>{copy.jpegQualities[quality]}</span>)}
          </span>
        </label>
        <label className="coat-workbench-export-transparent">
          <input
            aria-label={copy.exportTransparentBackground}
            type="checkbox"
            checked={transparentBackground}
            disabled={fileType === 'jpeg'}
            onChange={(event) => setTransparentBackground(event.target.checked)}
          />
          {copy.exportTransparentBackground}
        </label>
        <p className="coat-workbench-export-dimensions">{dimensionsLabel}</p>
        {error ? <p role="alert">{error}</p> : null}
        {status ? <p role="status">{status}</p> : null}
        <Button
          className="coat-workbench-export-download"
          type="button"
          onClick={() => void runExport(downloadSelectedExport, getDownloadSuccessMessage(fileType, copy))}
        ><Download aria-hidden="true" /><span>{copy.downloadExport(fileType)}</span></Button>
        <div className="coat-workbench-export-secondary">
          <Button type="button" variant="outline" onClick={() => void runExport(shareSelectedPng, copy.imageShared)}><Share2 aria-hidden="true" /><span>{copy.exportShare}</span></Button>
          <Button type="button" variant="outline" onClick={() => void runExport(printSelectedScene, copy.printOpened)}><Printer aria-hidden="true" /><span>{copy.exportPrint}</span></Button>
        </div>
      </section> : null}
    </div>
  );
}
