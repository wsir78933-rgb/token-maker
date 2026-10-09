'use client';

import type { CastleCreatorCopy } from '@/lib/castle-creator/copy';
import type { CastleSaveSlotNumber } from '@/lib/castle-creator/types';
import type { RefObject } from 'react';

export interface CastleDocumentToolbarProps {
  copy: CastleCreatorCopy;
  activeSlot: CastleSaveSlotNumber | null;
  disabled: boolean;
  isSaving: boolean;
  isExporting: boolean;
  browserSavesTriggerRef?: RefObject<HTMLButtonElement | null>;
  projectTriggerRef?: RefObject<HTMLButtonElement | null>;
  pngTriggerRef?: RefObject<HTMLButtonElement | null>;
  onQuickSave(): void;
  onOpenSaves(): void;
  onOpenProjectFiles(): void;
  onExportPng(): void;
  onOpenHelp(): void;
}

function toolbarButtonClass(): string {
  return 'min-h-11 min-w-0 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm';
}

export function CastleDocumentToolbar({
  copy,
  activeSlot,
  disabled,
  isSaving,
  isExporting,
  browserSavesTriggerRef,
  projectTriggerRef,
  pngTriggerRef,
  onQuickSave,
  onOpenSaves,
  onOpenProjectFiles,
  onExportPng,
  onOpenHelp,
}: CastleDocumentToolbarProps) {
  const desktopQuickSaveLabel = activeSlot === null
    ? copy.toolbar.quickSaveLabel
    : copy.toolbar.quickSaveActiveLabel(activeSlot);

  return (
    <div
      role="toolbar"
      aria-label={copy.toolbar.editorHeading}
      className="grid min-w-0 grid-cols-4 gap-2 border-b border-border p-3 sm:p-4 lg:grid-cols-5"
      data-castle-document-toolbar
    >
      <button
        type="button"
        className={toolbarButtonClass()}
        disabled={disabled}
        aria-describedby="castle-status-row"
        aria-label={desktopQuickSaveLabel}
        data-castle-action="quick-save"
        onClick={onQuickSave}
      >
        <span className="sm:hidden">{isSaving ? '…' : copy.toolbar.quickSaveLabel}</span>
        <span className="hidden sm:inline">{isSaving ? '…' : desktopQuickSaveLabel}</span>
      </button>
      <button
        type="button"
        className={toolbarButtonClass()}
        ref={browserSavesTriggerRef}
        disabled={disabled}
        aria-label={copy.toolbar.browserSaveLabel}
        data-castle-action="browser-saves"
        onClick={onOpenSaves}
      >
        {copy.toolbar.browserSaveLabel}
      </button>
      <button
        type="button"
        className={toolbarButtonClass()}
        ref={projectTriggerRef}
        disabled={disabled}
        aria-label={copy.toolbar.projectFileLabel}
        data-castle-action="project-files"
        onClick={onOpenProjectFiles}
      >
        {copy.toolbar.projectFileLabel}
      </button>
      <button
        type="button"
        className={toolbarButtonClass()}
        ref={pngTriggerRef}
        disabled={disabled || isExporting}
        aria-label={copy.toolbar.imageDownloadLabel}
        data-castle-action="download-png"
        onClick={onExportPng}
      >
        {isExporting ? '…' : copy.toolbar.imageDownloadLabel}
      </button>
      <button
        type="button"
        className={`${toolbarButtonClass()} hidden lg:inline-flex`}
        disabled={disabled}
        aria-label={copy.toolbar.helpLabel}
        data-castle-action="help"
        onClick={onOpenHelp}
      >
        {copy.toolbar.helpLabel}
      </button>
    </div>
  );
}
