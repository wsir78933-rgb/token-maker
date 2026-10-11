'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import type { SiteLocale } from '@/lib/site-locale';
import {
  clampNoticeToBoard,
  moveNoticeWithinBoard,
  resizeNoticeProportionally,
} from '@/lib/notice-board-creator/geometry';
import {
  createBoardNotice,
  createEmptyNoticeBoardProject,
  parseNoticeBoardFile,
  serializeNoticeBoardFile,
  NOTICE_BOARD_MAX_CUSTOM_FONTS,
  NOTICE_BOARD_MAX_NOTICES,
} from '@/lib/notice-board-creator/project';
import {
  loadNoticeBoardFont,
  NoticeBoardFontError,
} from '@/lib/notice-board-creator/fonts';
import {
  loadNoticeBoardSlot,
  readNoticeBoardSlots,
  saveNoticeBoardSlot,
  NoticeBoardStorageError,
  type NoticeBoardSlotReadResult,
} from '@/lib/notice-board-creator/storage';
import {
  NoticeBoardValidationError,
  type BoardNotice,
  type NoticeBoardFont,
  type NoticeBoardProject,
  type NoticeBoardSlotIndex,
  type NoticePaperId,
  type NoticeResizeHandle,
  type NoticeTextStyle,
} from '@/lib/notice-board-creator/types';
import { getNoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import { NoticeBoardCanvas } from './NoticeBoardCanvas';
import { NoticeBoardFilesDialog } from './NoticeBoardFilesDialog';
import { NoticeBoardFontsDialog } from './NoticeBoardFontsDialog';
import { NoticeBoardHelpDialog } from './NoticeBoardHelpDialog';
import { NoticeBoardInspector } from './NoticeBoardInspector';
import { NoticeBoardPalette } from './NoticeBoardPalette';
import { NoticeBoardSettingsDialog } from './NoticeBoardSettingsDialog';
import styles from './NoticeBoardCreatorWorkbench.module.css';

type NoticeBoardDialogName = 'settings' | 'files' | 'fonts' | 'help' | null;
type NoticeBoardMobilePanel = 'papers' | 'edit' | null;

function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  ) {
    return true;
  }

  const contentEditableAncestor = target.closest('[contenteditable]');
  if (contentEditableAncestor === null) return false;
  const contentEditableValue = contentEditableAncestor.getAttribute('contenteditable');
  return contentEditableValue !== null && contentEditableValue.toLowerCase() !== 'false';
}

function isNoticeDeleteShortcut(
  event: KeyboardEvent<HTMLDivElement>,
  dialogIsOpen: boolean,
): boolean {
  const isDeleteKey = event.key === 'Delete' || event.key === 'Backspace';
  const hasShortcutModifier = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
  return !event.defaultPrevented &&
    isDeleteKey &&
    !hasShortcutModifier &&
    !event.nativeEvent.isComposing &&
    event.nativeEvent.keyCode !== 229 && // IME boundary only; regular key matching still uses event.key.
    !dialogIsOpen &&
    !isEditableShortcutTarget(event.target);
}

export type NoticeBoardCreatorWorkbenchProps = {
  locale: SiteLocale;
};

export function NoticeBoardCreatorWorkbench({ locale }: NoticeBoardCreatorWorkbenchProps) {
  const copy = getNoticeBoardEditorCopy(locale);
  const [project, setProject] = useState<NoticeBoardProject>(createEmptyNoticeBoardProject);
  const projectRef = useRef(project);
  const workbenchRef = useRef<HTMLDivElement>(null);
  const createdFontLinksRef = useRef(new Map<string, HTMLLinkElement>());
  const noticeSequenceRef = useRef(1);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>([]);
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const [focusNoticeTextOnSelection, setFocusNoticeTextOnSelection] = useState(false);
  const [noticeTextFocusRequestId, setNoticeTextFocusRequestId] = useState(0);
  const [workbenchFocusRequestId, setWorkbenchFocusRequestId] = useState(0);
  const [dragEnabled, setDragEnabled] = useState(true);
  const [resizeEnabled, setResizeEnabled] = useState(true);
  const [activeDialog, setActiveDialog] = useState<NoticeBoardDialogName>(null);
  const [mobilePanel, setMobilePanel] = useState<NoticeBoardMobilePanel>('papers');
  const [mobileControlsVisible, setMobileControlsVisible] = useState(false);
  const [inspectorDraftRevision, setInspectorDraftRevision] = useState(0);
  const [savedProjects, setSavedProjects] = useState<NoticeBoardSlotReadResult[] | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [operationStatus, setOperationStatus] = useState<string | null>(null);

  useEffect(() => () => {
    for (const createdFontLink of createdFontLinksRef.current.values()) {
      createdFontLink.remove();
    }
    createdFontLinksRef.current.clear();
  }, []);

  useEffect(() => {
    const workbenchElement = workbenchRef.current;
    if (workbenchElement === null) {
      throw new Error('Notice board workbench must exist before observing mobile controls visibility.');
    }

    if (typeof IntersectionObserver !== 'undefined') {
      let workbenchObserver: IntersectionObserver | null = null;

      const observeWorkbenchWithinViewport = () => {
        if (workbenchObserver !== null) {
          workbenchObserver.disconnect();
          workbenchObserver = null;
        }
        const viewportHeight = window.innerHeight;
        if (!Number.isFinite(viewportHeight) || viewportHeight < 0) {
          throw new Error(`Viewport height must be a finite non-negative number; received ${viewportHeight}.`);
        }
        workbenchObserver = new IntersectionObserver((entries) => {
          const workbenchEntry = entries[0];
          if (workbenchEntry === undefined) {
            throw new Error('Notice board visibility observer returned no entries.');
          }
          setMobileControlsVisible(workbenchEntry.isIntersecting);
        }, { rootMargin: `-64px 0px -${viewportHeight / 2}px 0px` });
        workbenchObserver.observe(workbenchElement);
      };

      observeWorkbenchWithinViewport();
      window.addEventListener('resize', observeWorkbenchWithinViewport);
      return () => {
        window.removeEventListener('resize', observeWorkbenchWithinViewport);
        workbenchObserver?.disconnect();
      };
    }

    const updateMobileControlsVisibility = () => {
      const workbenchBounds = workbenchElement.getBoundingClientRect();
      setMobileControlsVisible(
        workbenchBounds.top < window.innerHeight * 0.5 && workbenchBounds.bottom > 64,
      );
    };
    updateMobileControlsVisibility();
    window.addEventListener('scroll', updateMobileControlsVisibility, { passive: true });
    window.addEventListener('resize', updateMobileControlsVisibility);
    return () => {
      window.removeEventListener('scroll', updateMobileControlsVisibility);
      window.removeEventListener('resize', updateMobileControlsVisibility);
    };
  }, []);

  useEffect(() => {
    if (workbenchFocusRequestId === 0) return;
    const workbenchElement = workbenchRef.current;
    if (workbenchElement === null) {
      throw new Error('Cannot restore notice board editor focus because the workbench element is null.');
    }
    workbenchElement.focus({ preventScroll: true });
  }, [workbenchFocusRequestId]);

  const selectedNotices = project.notices.filter((notice) => selectedNoticeIds.includes(notice.id));
  const inspectorDraftKey = `${multiSelectEnabled ? 'multi' : 'single'}:${inspectorDraftRevision}:${selectedNoticeIds.join(',')}`;

  function clearFeedback(): void {
    setOperationError(null);
    setOperationStatus(null);
  }

  function commitProject(nextProject: NoticeBoardProject): void {
    projectRef.current = nextProject;
    setProject(nextProject);
  }

  function getBrowserStorage(): Storage {
    if (typeof window === 'undefined') {
      throw new NoticeBoardStorageError('window.localStorage requires a browser window; received undefined.');
    }
    try {
      return window.localStorage;
    } catch (storageFailure: unknown) {
      if (
        typeof DOMException !== 'undefined' &&
        storageFailure instanceof DOMException &&
        storageFailure.name === 'SecurityError'
      ) {
        throw new NoticeBoardStorageError(
          `window.localStorage raised ${storageFailure.name}: ${storageFailure.message}`,
        );
      }
      throw storageFailure;
    }
  }

  function showKnownOperationFailure(failure: NoticeBoardStorageError | NoticeBoardValidationError | NoticeBoardFontError): void {
    setOperationError(`${copy.errorTitle} ${failure.message}`);
    setOperationStatus(null);
  }

  function createNoticeId(existingNotices: readonly BoardNotice[]): string {
    let noticeId = '';
    do {
      const sequenceNumber = noticeSequenceRef.current;
      noticeSequenceRef.current += 1;
      noticeId = `notice-${Date.now().toString(36)}-${sequenceNumber.toString(36)}`;
    } while (existingNotices.some((notice) => notice.id === noticeId));
    return noticeId;
  }

  function addPaper(paperId: NoticePaperId): void {
    clearFeedback();
    const currentProject = projectRef.current;
    if (currentProject.notices.length >= NOTICE_BOARD_MAX_NOTICES) {
      setOperationError(copy.noticeLimitReached(NOTICE_BOARD_MAX_NOTICES));
      return;
    }
    const newNotice = clampNoticeToBoard(
      createBoardNotice(paperId, createNoticeId(currentProject.notices), currentProject.boardWidth),
      currentProject.boardWidth,
    );
    commitProject({ ...currentProject, notices: [...currentProject.notices, newNotice] });
    setSelectedNoticeIds([newNotice.id]);
    setMultiSelectEnabled(false);
    setFocusNoticeTextOnSelection(true);
    setMobilePanel('edit');
  }

  function selectNotice(noticeId: string, toggleSelection: boolean): void {
    const noticeExists = projectRef.current.notices.some((notice) => notice.id === noticeId);
    if (!noticeExists) {
      throw new Error(`Cannot select unknown notice id ${JSON.stringify(noticeId)}.`);
    }
    setFocusNoticeTextOnSelection(false);
    setSelectedNoticeIds((selectedIds) => {
      if (!toggleSelection) return [noticeId];
      if (selectedIds.includes(noticeId)) {
        return selectedIds.filter((selectedId) => selectedId !== noticeId);
      }
      return [...selectedIds, noticeId];
    });
    setMobilePanel('edit');
  }

  function handleNoticeDoubleClick(noticeId: string): void {
    const noticeExists = projectRef.current.notices.some((notice) => notice.id === noticeId);
    if (!noticeExists) {
      throw new Error(`Cannot focus text for unknown notice id ${JSON.stringify(noticeId)}.`);
    }
    if (multiSelectEnabled) return;

    setSelectedNoticeIds((selectedIds) => (
      selectedIds.length === 1 && selectedIds[0] === noticeId ? selectedIds : [noticeId]
    ));
    setFocusNoticeTextOnSelection(true);
    setNoticeTextFocusRequestId((requestId) => requestId + 1);
    setMobilePanel('edit');
  }

  function toggleMultiSelect(): void {
    if (multiSelectEnabled) {
      setMultiSelectEnabled(false);
      setSelectedNoticeIds((selectedIds) => selectedIds.slice(0, 1));
      setFocusNoticeTextOnSelection(true);
    } else {
      setMultiSelectEnabled(true);
      setFocusNoticeTextOnSelection(false);
    }
    setMobilePanel('edit');
  }

  function deleteSelectedNotices(): boolean {
    if (selectedNoticeIds.length === 0) return false;
    const currentProject = projectRef.current;
    const existingNoticeIds = new Set(currentProject.notices.map((notice) => notice.id));
    const missingSelectedIds = selectedNoticeIds.filter((noticeId) => !existingNoticeIds.has(noticeId));
    if (missingSelectedIds.length > 0) {
      throw new Error(`Cannot delete missing notice ids ${JSON.stringify(missingSelectedIds)}.`);
    }

    const selectedIdSet = new Set(selectedNoticeIds);
    const remainingNotices = currentProject.notices.filter((notice) => !selectedIdSet.has(notice.id));
    if (remainingNotices.length === currentProject.notices.length) {
      throw new Error(`Cannot delete selected notice ids ${JSON.stringify(selectedNoticeIds)}; no matching notices were removed.`);
    }
    commitProject({ ...currentProject, notices: remainingNotices });
    setSelectedNoticeIds([]);
    setMultiSelectEnabled(false);
    setFocusNoticeTextOnSelection(false);
    return true;
  }

  function handleWorkbenchKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!isNoticeDeleteShortcut(event, activeDialog !== null) || selectedNoticeIds.length === 0) return;
    event.preventDefault();
    if (deleteSelectedNotices()) {
      setWorkbenchFocusRequestId((requestId) => requestId + 1);
    }
  }

  function updateNoticeText(noticeId: string, text: string): void {
    const currentProject = projectRef.current;
    let matchedNotice = false;
    const notices = currentProject.notices.map((notice) => {
      if (notice.id !== noticeId) return notice;
      matchedNotice = true;
      return { ...notice, text };
    });
    if (!matchedNotice) {
      throw new Error(`Cannot update text for unknown notice id ${JSON.stringify(noticeId)}.`);
    }
    commitProject({ ...currentProject, notices });
  }

  function applySelectedNoticeStyle(style: NoticeTextStyle): void {
    const currentProject = projectRef.current;
    const targetIds = multiSelectEnabled ? selectedNoticeIds : selectedNoticeIds.slice(0, 1);
    if (targetIds.length === 0) {
      throw new Error('Cannot apply notice formatting without a selected notice; received an empty selection.');
    }

    const matchedNoticeIds = new Set<string>();
    const notices = currentProject.notices.map((notice) => {
      if (!targetIds.includes(notice.id)) return notice;
      matchedNoticeIds.add(notice.id);
      return { ...notice, style };
    });
    if (matchedNoticeIds.size !== targetIds.length) {
      const missingIds = targetIds.filter((noticeId) => !matchedNoticeIds.has(noticeId));
      throw new Error(`Cannot format missing notice ids ${JSON.stringify(missingIds)}.`);
    }
    commitProject({ ...currentProject, notices });
  }

  function moveNotice(noticeId: string, deltaX: number, deltaY: number): void {
    if (!dragEnabled || multiSelectEnabled) return;
    const currentProject = projectRef.current;
    let matchedNotice = false;
    const notices = currentProject.notices.map((notice) => {
      if (notice.id !== noticeId) return notice;
      matchedNotice = true;
      return moveNoticeWithinBoard(notice, deltaX, deltaY, currentProject.boardWidth);
    });
    if (!matchedNotice) {
      throw new Error(`Cannot move unknown notice id ${JSON.stringify(noticeId)}.`);
    }
    commitProject({ ...currentProject, notices });
  }

  function resizeNotice(
    noticeId: string,
    deltaX: number,
    deltaY: number,
    handle: NoticeResizeHandle,
  ): void {
    if (!resizeEnabled || multiSelectEnabled) return;
    const currentProject = projectRef.current;
    let matchedNotice = false;
    const notices = currentProject.notices.map((notice) => {
      if (notice.id !== noticeId) return notice;
      matchedNotice = true;
      return resizeNoticeProportionally(
        notice,
        deltaX,
        deltaY,
        handle,
        currentProject.boardWidth,
      );
    });
    if (!matchedNotice) {
      throw new Error(`Cannot resize unknown notice id ${JSON.stringify(noticeId)}.`);
    }
    commitProject({ ...currentProject, notices });
  }

  function openSettingsDialog(): void {
    clearFeedback();
    setMobilePanel(null);
    setActiveDialog('settings');
  }

  function openFilesDialog(): void {
    clearFeedback();
    setMobilePanel(null);
    setActiveDialog('files');
    refreshSavedProjects();
  }

  function refreshSavedProjects(): void {
    try {
      setSavedProjects(readNoticeBoardSlots(getBrowserStorage()));
      setOperationError(null);
    } catch (storageFailure: unknown) {
      if (storageFailure instanceof NoticeBoardStorageError) {
        setSavedProjects(null);
        showKnownOperationFailure(storageFailure);
        return;
      }
      throw storageFailure;
    }
  }

  function handleSaveSlot(slotIndex: NoticeBoardSlotIndex): void {
    clearFeedback();
    try {
      const currentProject = projectRef.current;
      saveNoticeBoardSlot(getBrowserStorage(), slotIndex, currentProject);
      setSavedProjects(readNoticeBoardSlots(getBrowserStorage()));
      setOperationStatus(copy.savedSuccessfully);
    } catch (saveFailure: unknown) {
      if (saveFailure instanceof NoticeBoardStorageError || saveFailure instanceof NoticeBoardValidationError) {
        showKnownOperationFailure(saveFailure);
        return;
      }
      throw saveFailure;
    }
  }

  function applyLoadedProject(loadedProject: NoticeBoardProject, successMessage: string): void {
    try {
      synchronizeProjectFonts(loadedProject.customFonts);
      setOperationError(null);
    } catch (fontFailure: unknown) {
      if (fontFailure instanceof NoticeBoardFontError) {
        showKnownOperationFailure(fontFailure);
      } else {
        throw fontFailure;
      }
    }
    commitProject(loadedProject);
    setSelectedNoticeIds(loadedProject.notices[0] === undefined ? [] : [loadedProject.notices[0].id]);
    setMultiSelectEnabled(false);
    setFocusNoticeTextOnSelection(loadedProject.notices.length > 0);
    setInspectorDraftRevision((revision) => revision + 1);
    setMobilePanel(loadedProject.notices.length === 0 ? null : 'edit');
    setOperationStatus(successMessage);
  }

  function handleLoadSlot(slotIndex: NoticeBoardSlotIndex): void {
    clearFeedback();
    try {
      const loadedProject = loadNoticeBoardSlot(getBrowserStorage(), slotIndex);
      if (loadedProject === null) {
        setOperationError(copy.emptySlotError(slotIndex));
        return;
      }
      applyLoadedProject(loadedProject, copy.loadedSuccessfully);
    } catch (loadFailure: unknown) {
      if (loadFailure instanceof NoticeBoardStorageError || loadFailure instanceof NoticeBoardValidationError) {
        showKnownOperationFailure(loadFailure);
        return;
      }
      throw loadFailure;
    }
  }

  function handleApplyBoardWidth(boardWidth: number): void {
    const currentProject = projectRef.current;
    if (currentProject.boardWidth === boardWidth) return;
    const notices = currentProject.notices.map((notice) => clampNoticeToBoard(notice, boardWidth));
    commitProject({ ...currentProject, boardWidth, notices });
  }

  function handleAddFont(font: NoticeBoardFont): void {
    const currentProject = projectRef.current;
    if (currentProject.customFonts.length >= NOTICE_BOARD_MAX_CUSTOM_FONTS) {
      throw new NoticeBoardFontError(
        copy.fontLimitReached(font.family, currentProject.customFonts.length, NOTICE_BOARD_MAX_CUSTOM_FONTS),
      );
    }
    const isAlreadyAdded = currentProject.customFonts.some(
      (customFont) =>
        customFont.family.toLowerCase() === font.family.toLowerCase() ||
        customFont.stylesheetUrl === font.stylesheetUrl,
    );
    if (isAlreadyAdded) {
      throw new NoticeBoardFontError(`Font ${JSON.stringify(font.family)} is already in this project.`);
    }

    synchronizeProjectFonts([...currentProject.customFonts, font]);
    commitProject({ ...currentProject, customFonts: [...currentProject.customFonts, font] });
    setOperationError(null);
  }

  function synchronizeProjectFonts(fonts: readonly NoticeBoardFont[]): void {
    if (typeof document === 'undefined' || document.head === null) {
      throw new NoticeBoardFontError('Custom notice board fonts require document.head.');
    }
    const wantedStylesheets = new Set(fonts.map((font) => font.stylesheetUrl));
    for (const [stylesheetUrl, createdFontLink] of createdFontLinksRef.current) {
      if (wantedStylesheets.has(stylesheetUrl)) continue;
      createdFontLink.remove();
      createdFontLinksRef.current.delete(stylesheetUrl);
    }

    for (const font of fonts) {
      const existingStylesheet = Array.from(document.head.getElementsByTagName('link')).some(
        (stylesheetLink) =>
          stylesheetLink.rel === 'stylesheet' && stylesheetLink.href === font.stylesheetUrl,
      );
      const loadedFontLink = loadNoticeBoardFont(font, document);
      if (loadedFontLink.dataset.noticeBoardFont === 'true') {
        createdFontLinksRef.current.set(font.stylesheetUrl, loadedFontLink);
      }
      if (!existingStylesheet) {
        loadedFontLink.addEventListener('error', () => {
          setOperationError(copy.fontLoadFailure(font.stylesheetUrl));
          setOperationStatus(null);
        }, { once: true });
      }
    }
  }

  function handleSaveTxt(): void {
    clearFeedback();
    try {
      const projectText = serializeNoticeBoardFile(projectRef.current);
      downloadNoticeBoardText(projectText);
      setOperationStatus(copy.txtDownloaded);
    } catch (saveFailure: unknown) {
      if (saveFailure instanceof NoticeBoardValidationError) {
        showKnownOperationFailure(saveFailure);
        return;
      }
      throw saveFailure;
    }
  }

  function downloadNoticeBoardText(projectText: string): void {
    if (
      typeof window === 'undefined' ||
      typeof URL.createObjectURL !== 'function' ||
      typeof URL.revokeObjectURL !== 'function'
    ) {
      throw new Error('TXT download requires window, URL.createObjectURL and URL.revokeObjectURL.');
    }
    const projectFile = new Blob([projectText], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(projectFile);
    const downloadLink = document.createElement('a');
    downloadLink.href = objectUrl;
    downloadLink.download = 'notice-board-project.txt';
    document.body.append(downloadLink);
    try {
      downloadLink.click();
    } finally {
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
    }
  }

  function handleLoadTxt(projectText: string, fileName: string): void {
    clearFeedback();
    try {
      const loadedProject = parseNoticeBoardFile(projectText);
      applyLoadedProject(loadedProject, copy.txtLoaded);
    } catch (loadFailure: unknown) {
      if (loadFailure instanceof NoticeBoardValidationError) {
        setOperationError(`${copy.errorTitle} ${JSON.stringify(fileName)}: ${loadFailure.message}`);
        setOperationStatus(null);
        return;
      }
      throw loadFailure;
    }
  }

  function printNoticeBoard(): void {
    if (typeof window === 'undefined' || typeof window.print !== 'function') {
      throw new Error('Notice board printing requires window.print; received unavailable.');
    }
    window.print();
  }

  function selectMobilePanel(panel: 'papers' | 'edit'): void {
    setActiveDialog(null);
    setMobilePanel((currentPanel) => currentPanel === panel ? null : panel);
  }

  return (
    <div
      ref={workbenchRef}
      className={styles.workbench}
      tabIndex={-1}
      onKeyDown={handleWorkbenchKeyDown}
      data-notice-board-editor
      data-notice-board-workbench
      data-notice-board-locale={locale}
      data-mobile-controls-visible={mobileControlsVisible ? 'true' : 'false'}
    >
      <header className={styles.toolbar}>
        <button
          className={`${styles.toolbarButton} ${styles.toolbarMultiButton}`}
          type="button"
          aria-pressed={multiSelectEnabled}
          onClick={() => {
            clearFeedback();
            toggleMultiSelect();
          }}
        >
          {multiSelectEnabled ? copy.finishMultiSelect : copy.multiSelect}
        </button>
        <div className={styles.toolbarHeading}>
          <h2 className={styles.visuallyHidden}>{copy.toolTitle}</h2>
          <p className={styles.toolbarHint}>
            <span className={styles.desktopToolbarHint}>{copy.selectionInstruction}</span>
            <span className={styles.mobileToolbarHint}>{copy.selectionInstructionMobile}</span>
          </p>
        </div>
        <div className={styles.toolbarActions}>
          <button className={`${styles.toolbarButton} ${styles.desktopOnly}`} type="button" onClick={openSettingsDialog}>
            {copy.settings}
          </button>
          <button className={`${styles.toolbarButton} ${styles.desktopOnly}`} type="button" onClick={openFilesDialog}>
            {copy.saveOpen}
          </button>
          <button
            className={styles.toolbarButton}
            type="button"
            onClick={() => {
              clearFeedback();
              setActiveDialog('help');
            }}
          >
            {copy.help}
          </button>
        </div>
      </header>

      {operationError !== null ? <p className={styles.feedbackError} role="alert">{operationError}</p> : null}
      {operationStatus !== null ? <p className={styles.feedbackSuccess} role="status">{operationStatus}</p> : null}

      <div className={styles.workspace}>
        <div className={`${styles.paletteColumn} ${styles.mobilePaperSheet} ${mobilePanel === 'papers' ? styles.mobileSheet : ''}`}>
          <NoticeBoardPalette
            copy={copy}
            onAddPaper={addPaper}
            onClosePanel={() => setMobilePanel(null)}
          />
        </div>
        <section className={styles.canvasColumn} aria-label={copy.canvasTitle}>
          <NoticeBoardCanvas
            copy={copy}
            project={project}
            selectedNoticeIds={selectedNoticeIds}
            multiSelectEnabled={multiSelectEnabled}
            dragEnabled={dragEnabled}
            resizeEnabled={resizeEnabled}
            onSelectNotice={selectNotice}
            onDoubleClickNotice={handleNoticeDoubleClick}
            onMoveNotice={moveNotice}
            onResizeNotice={resizeNotice}
          />
        </section>
        <div className={`${styles.inspectorColumn} ${styles.mobileEditSheet} ${mobilePanel === 'edit' ? styles.mobileSheet : ''}`}>
          <NoticeBoardInspector
            key={inspectorDraftKey}
            copy={copy}
            project={project}
            selectedNotices={selectedNotices}
            multiSelectEnabled={multiSelectEnabled}
            focusNoticeTextOnSelection={focusNoticeTextOnSelection}
            noticeTextFocusRequestId={noticeTextFocusRequestId}
            onClosePanel={() => setMobilePanel(null)}
            onNoticeTextChange={updateNoticeText}
            onApplyFormatting={applySelectedNoticeStyle}
            onOpenFonts={() => setActiveDialog('fonts')}
          />
        </div>
      </div>

      <section className={styles.inlineHelp} aria-label={copy.help}>
        <div className={styles.inlineHelpCard}>
          <h2 className={styles.inlineHelpTitle}>{copy.quickStartTitle}</h2>
          <p className={styles.inlineHelpText}>{copy.quickStartSteps}</p>
        </div>
        <div className={styles.inlineHelpCard}>
          <h2 className={styles.inlineHelpTitle}>{copy.savingOutputTitle}</h2>
          <p className={styles.inlineHelpText}>{copy.savingOutputDescription}</p>
        </div>
      </section>

      <nav className={styles.mobileTabs} aria-label={copy.mobileNavigation}>
        <button
          className={styles.mobileTab}
          type="button"
          aria-pressed={mobilePanel === 'papers'}
          onClick={() => selectMobilePanel('papers')}
        >
          {copy.papersTab}
        </button>
        <button
          className={styles.mobileTab}
          type="button"
          aria-pressed={mobilePanel === 'edit'}
          onClick={() => selectMobilePanel('edit')}
        >
          {copy.editTab}
        </button>
        <button className={styles.mobileTab} type="button" onClick={openSettingsDialog}>
          {copy.setupTab}
        </button>
        <button className={styles.mobileTab} type="button" onClick={openFilesDialog}>
          {copy.saveOpen}
        </button>
      </nav>

      <NoticeBoardSettingsDialog
        open={activeDialog === 'settings'}
        copy={copy}
        boardWidth={project.boardWidth}
        dragEnabled={dragEnabled}
        resizeEnabled={resizeEnabled}
        onOpenChange={(open) => setActiveDialog(open ? 'settings' : null)}
        onApplyBoardWidth={handleApplyBoardWidth}
        onDragEnabledChange={setDragEnabled}
        onResizeEnabledChange={setResizeEnabled}
      />
      <NoticeBoardFilesDialog
        open={activeDialog === 'files'}
        copy={copy}
        slots={savedProjects}
        error={operationError}
        status={operationStatus}
        onOpenChange={(open) => setActiveDialog(open ? 'files' : null)}
        onRefreshSlots={refreshSavedProjects}
        onSaveSlot={handleSaveSlot}
        onLoadSlot={handleLoadSlot}
        onSaveTxt={handleSaveTxt}
        onLoadTxt={handleLoadTxt}
        onPrint={printNoticeBoard}
      />
      <NoticeBoardFontsDialog
        open={activeDialog === 'fonts'}
        copy={copy}
        customFonts={project.customFonts}
        onOpenChange={(open) => setActiveDialog(open ? 'fonts' : null)}
        onAddFont={handleAddFont}
      />
      <NoticeBoardHelpDialog
        open={activeDialog === 'help'}
        copy={copy}
        onOpenChange={(open) => setActiveDialog(open ? 'help' : null)}
      />
    </div>
  );
}
