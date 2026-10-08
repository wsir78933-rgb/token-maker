'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { ScrollCanvas } from '@/components/scroll-creator/ScrollCanvas';
import { ScrollHelpDialog } from '@/components/scroll-creator/ScrollHelpDialog';
import { ScrollSaveDialog } from '@/components/scroll-creator/ScrollSaveDialog';
import { ScrollSettingsPanel } from '@/components/scroll-creator/ScrollSettingsPanel';
import {
  loadScrollFont,
  requireScrollFont,
} from '@/lib/scroll-creator/fonts';
import { requireScrollImageGeometry } from '@/lib/scroll-creator/geometry';
import {
  loadScrollImage,
  requireScrollImageUrl,
} from '@/lib/scroll-creator/image-loading';
import type { ScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import {
  readScrollSaveSlots,
  saveScrollToSlot,
  type ScrollSaveSlot,
} from '@/lib/scroll-creator/storage';
import {
  createDefaultScrollProject,
  requireScrollProject,
} from '@/lib/scroll-creator/project';
import type {
  ScrollImageGeometry,
  ScrollLocale,
  ScrollProject,
  ScrollTab,
  ScrollTextStyle,
} from '@/lib/scroll-creator/types';
import {
  SCROLL_DEFAULT_HEIGHT,
  SCROLL_DEFAULT_WIDTH,
} from '@/lib/scroll-creator/types';

import styles from './ScrollCreatorWorkbench.module.css';

export type ScrollCreatorWorkbenchProps = {
  locale: ScrollLocale;
  copy: ScrollCreatorCopy;
};

type DialogMode = 'save' | 'load';
type FeedbackTone = 'error' | 'success';
type AsyncOperationKind = 'font' | 'image' | 'load';

type FeedbackMessage = {
  tone: FeedbackTone;
  text: string;
};

type ActiveAsyncOperation = {
  kind: AsyncOperationKind;
  token: number;
};

const SCROLL_TABS: readonly ScrollTab[] = ['paper', 'text', 'images'];

function describeFailure(reason: unknown): string {
  if (reason instanceof Error && reason.message.trim().length > 0) {
    return reason.message;
  }

  if (typeof reason === 'string' && reason.trim().length > 0) {
    return reason;
  }

  throw reason;
}

function requireBrowserStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Scroll save storage is unavailable during server rendering. Received undefined window.');
  }

  const browserStorage = window.localStorage;
  if (browserStorage === null || browserStorage === undefined) {
    throw new Error(
      `Scroll save storage is unavailable. Received ${browserStorage === undefined ? 'undefined' : 'null'}.`,
    );
  }

  return browserStorage;
}

function tabLabel(copy: ScrollCreatorCopy, tab: ScrollTab): string {
  if (tab === 'paper') return copy.paperTab;
  if (tab === 'text') return copy.textTab;
  if (tab === 'images') return copy.imagesTab;

  const unexpectedTab: never = tab;
  throw new Error(`Unknown scroll creator tab. Received ${JSON.stringify(unexpectedTab)}.`);
}

function createScrollImageId(existingImages: readonly { id: string }[]): string {
  const randomUuid = globalThis.crypto?.randomUUID;
  if (typeof randomUuid === 'function') {
    const candidateId = randomUuid.call(globalThis.crypto);
    if (!existingImages.some((image) => image.id === candidateId)) {
      return candidateId;
    }
  }

  for (let sequence = 1; sequence <= 1000; sequence += 1) {
    const candidateId = `scroll-image-${sequence}`;
    if (!existingImages.some((image) => image.id === candidateId)) {
      return candidateId;
    }
  }

  throw new Error(`Could not create a unique scroll image id. Received ${existingImages.length} existing images.`);
}

function createInitialImageGeometry(
  imageWidth: number,
  imageHeight: number,
  project: Pick<ScrollProject, 'width' | 'height'>,
): ScrollImageGeometry {
  if (!Number.isFinite(imageWidth) || imageWidth <= 0) {
    throw new Error(`Loaded scroll image width must be a positive finite number. Received ${imageWidth}.`);
  }
  if (!Number.isFinite(imageHeight) || imageHeight <= 0) {
    throw new Error(`Loaded scroll image height must be a positive finite number. Received ${imageHeight}.`);
  }

  const scale = Math.min(1, (project.width * 0.48) / imageWidth, (project.height * 0.28) / imageHeight);
  const width = Math.max(8, Math.round(imageWidth * scale));
  const height = Math.max(8, Math.round(imageHeight * scale));

  return {
    x: Math.max(0, Math.round((project.width - width) / 2)),
    y: Math.max(0, Math.round((project.height - height) / 2)),
    width,
    height,
  };
}

function isKnownOperationFailure(reason: unknown): reason is Error | string {
  return reason instanceof Error || typeof reason === 'string';
}

export function ScrollCreatorWorkbench({
  locale,
  copy,
}: ScrollCreatorWorkbenchProps) {
  const workbenchId = useId();
  const [project, setProject] = useState<ScrollProject>(() => createDefaultScrollProject());
  const projectRef = useRef(project);
  const projectRevisionRef = useRef(0);
  const asyncTokenRef = useRef(0);
  const activeOperationRef = useRef<ActiveAsyncOperation | null>(null);
  const [activeTab, setActiveTab] = useState<ScrollTab>('paper');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [paperResizing, setPaperResizing] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(true);
  const [imagesDraggable, setImagesDraggable] = useState(true);
  const [imagesResizable, setImagesResizable] = useState(true);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [saveSlots, setSaveSlots] = useState<ScrollSaveSlot[]>([]);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [hasTextOverflow, setHasTextOverflow] = useState(false);
  const [fontPending, setFontPending] = useState(false);
  const [imagePending, setImagePending] = useState(false);
  const [loadPending, setLoadPending] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);
  const helpTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileSheetTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileSheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const settingsTabRefs = useRef<Partial<Record<ScrollTab, HTMLButtonElement | null>>>({});

  const updateProject = (changeProject: (currentProject: ScrollProject) => ScrollProject): void => {
    const nextProject = requireScrollProject(changeProject(projectRef.current));
    projectRef.current = nextProject;
    projectRevisionRef.current += 1;
    setProject(nextProject);
  };

  const showExpectedFailure = (reason: unknown): void => {
    if (!isKnownOperationFailure(reason)) {
      throw reason;
    }

    setFeedback({
      tone: 'error',
      text: `${copy.operationFailed} ${describeFailure(reason)}`,
    });
  };

  const beginAsyncOperation = (kind: AsyncOperationKind): number | null => {
    if (activeOperationRef.current !== null) {
      const busyMessage = kind === 'font' ? copy.fontLoading : kind === 'image' ? copy.imageLoading : copy.load;
      setFeedback({
        tone: 'error',
        text: `${copy.operationFailed} ${busyMessage}`,
      });
      return null;
    }

    const token = asyncTokenRef.current + 1;
    asyncTokenRef.current = token;
    activeOperationRef.current = { kind, token };
    return token;
  };

  const finishAsyncOperation = (token: number): void => {
    if (activeOperationRef.current?.token === token) {
      activeOperationRef.current = null;
    }
  };

  const isCurrentAsyncOperation = (token: number): boolean => {
    const currentOperation = activeOperationRef.current;
    return currentOperation !== null && currentOperation.token === token;
  };

  const readSlotsFromBrowser = (): ScrollSaveSlot[] => {
    const slots = readScrollSaveSlots(requireBrowserStorage());
    setSaveSlots(slots);
    return slots;
  };

  const closeDialog = (): void => {
    setDialogMode(null);
    const triggerButton = dialogTriggerRef.current;
    dialogTriggerRef.current = null;
    queueMicrotask(() => triggerButton?.focus());
  };

  const openDialog = (mode: DialogMode, triggerButton?: HTMLButtonElement): void => {
    try {
      readSlotsFromBrowser();
      dialogTriggerRef.current = triggerButton ?? null;
      setDialogMode(mode);
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const saveProjectToSlot = (slot: number): void => {
    try {
      const slots = saveScrollToSlot(requireBrowserStorage(), slot, projectRef.current);
      setSaveSlots(slots);
      setFeedback({ tone: 'success', text: copy.saveSuccess });
      closeDialog();
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const loadProjectFromSlot = async (slot: number): Promise<void> => {
    if (activeOperationRef.current !== null) {
      setFeedback({
        tone: 'error',
        text: `${copy.operationFailed} ${copy.load}`,
      });
      return;
    }

    let slots: ScrollSaveSlot[];
    try {
      slots = readSlotsFromBrowser();
    } catch (reason: unknown) {
      showExpectedFailure(reason);
      return;
    }

    const selectedSlot = slots.find((candidate) => candidate.slot === slot);
    if (selectedSlot === undefined || selectedSlot.project === null) {
      setFeedback({ tone: 'error', text: `${copy.operationFailed} ${copy.emptySlot}` });
      return;
    }

    const token = beginAsyncOperation('load');
    if (token === null) return;

    const revisionAtLoadStart = projectRevisionRef.current;
    setLoadPending(true);
    setFeedback(null);

    try {
      const savedProject = requireScrollProject(selectedSlot.project);
      await Promise.all(savedProject.customFonts.map((font) => loadScrollFont(font)));
      await Promise.all(savedProject.images.map((image) => loadScrollImage(image.url)));

      if (!isCurrentAsyncOperation(token)) return;
      if (projectRevisionRef.current !== revisionAtLoadStart) {
        setFeedback({
          tone: 'error',
          text: copy.operationFailed,
        });
        return;
      }

      projectRef.current = savedProject;
      projectRevisionRef.current += 1;
      setProject(savedProject);
      setSelectedImageIds([]);
      setFeedback({ tone: 'success', text: copy.loadSuccess });
      closeDialog();
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    } finally {
      finishAsyncOperation(token);
      setLoadPending(false);
    }
  };

  const addFontToProject = async (source: string, family: string): Promise<void> => {
    const token = beginAsyncOperation('font');
    if (token === null) {
      throw new Error(
        `${copy.operationFailed} ${copy.fontLoading} for source ${JSON.stringify(source)} and family ${JSON.stringify(family)}.`,
      );
    }

    setFontPending(true);
    setFeedback(null);

    try {
      const font = requireScrollFont(source, family);
      await loadScrollFont(font);
      if (!isCurrentAsyncOperation(token)) return;

      if (projectRef.current.customFonts.some((savedFont) => savedFont.family === font.family)) {
        throw new Error(`Scroll font family is already present. Received ${JSON.stringify(font.family)}.`);
      }

      updateProject((currentProject) => ({
        ...currentProject,
        customFonts: [...currentProject.customFonts, font],
        textStyle: { ...currentProject.textStyle, fontFamily: font.family },
      }));
      setFeedback({ tone: 'success', text: copy.fontSuccess });
    } catch (reason: unknown) {
      showExpectedFailure(reason);
      if (isKnownOperationFailure(reason)) {
        throw reason instanceof Error ? reason : new Error(reason);
      }
      throw reason;
    } finally {
      finishAsyncOperation(token);
      setFontPending(false);
    }
  };

  const addImageToProject = async (imageUrl: string): Promise<void> => {
    const token = beginAsyncOperation('image');
    if (token === null) {
      throw new Error(
        `${copy.operationFailed} ${copy.imageLoading} for URL ${JSON.stringify(imageUrl)}.`,
      );
    }

    setImagePending(true);
    setFeedback(null);

    try {
      const validatedUrl = requireScrollImageUrl(imageUrl);
      const loadedImage = await loadScrollImage(validatedUrl);
      if (!isCurrentAsyncOperation(token)) return;

      const currentProject = projectRef.current;
      const imageGeometry = createInitialImageGeometry(
        loadedImage.width,
        loadedImage.height,
        currentProject,
      );
      const newImage = {
        id: createScrollImageId(currentProject.images),
        url: validatedUrl,
        ...imageGeometry,
      };

      updateProject((latestProject) => ({
        ...latestProject,
        images: [...latestProject.images, newImage],
      }));
      setSelectedImageIds([newImage.id]);
      setFeedback({ tone: 'success', text: copy.imageSuccess });
    } catch (reason: unknown) {
      showExpectedFailure(reason);
      if (isKnownOperationFailure(reason)) {
        throw reason instanceof Error ? reason : new Error(reason);
      }
      throw reason;
    } finally {
      finishAsyncOperation(token);
      setImagePending(false);
    }
  };

  const handleTextStyleChange = (patch: Partial<ScrollTextStyle>): void => {
    try {
      updateProject((currentProject) => ({
        ...currentProject,
        textStyle: { ...currentProject.textStyle, ...patch },
      }));
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const handlePaperChoice = (paperId: string): void => {
    try {
      updateProject((currentProject) => ({ ...currentProject, paperId }));
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const handlePaperSizeChange = (width: number, height: number): void => {
    try {
      updateProject((currentProject) => ({ ...currentProject, width, height }));
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const resetPaperSize = (): void => {
    try {
      updateProject((currentProject) => ({
        ...currentProject,
        width: SCROLL_DEFAULT_WIDTH,
        height: SCROLL_DEFAULT_HEIGHT,
      }));
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const handleTextChange = (text: string): void => {
    try {
      updateProject((currentProject) => ({ ...currentProject, text }));
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const handleTextOverflowChange = (nextHasTextOverflow: boolean): void => {
    if (typeof nextHasTextOverflow !== 'boolean') {
      throw new Error(
        `Scroll text overflow state must be boolean. Received value ${String(nextHasTextOverflow)} with type ${typeof nextHasTextOverflow}.`,
      );
    }
    setHasTextOverflow(nextHasTextOverflow);
  };

  const handleImageGeometryChange = (imageId: string, geometry: ScrollImageGeometry): void => {
    try {
      const checkedGeometry = requireScrollImageGeometry(geometry);
      updateProject((currentProject) => {
        if (!currentProject.images.some((image) => image.id === imageId)) {
          throw new Error(`Cannot update missing scroll image. Received ${JSON.stringify(imageId)}.`);
        }
        return {
          ...currentProject,
          images: currentProject.images.map((image) =>
            image.id === imageId ? { ...image, ...checkedGeometry } : image,
          ),
        };
      });
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const deleteSelectedImages = (): void => {
    try {
      updateProject((currentProject) => ({
        ...currentProject,
        images: currentProject.images.filter((image) => !selectedImageIds.includes(image.id)),
      }));
      setSelectedImageIds([]);
      setFeedback(null);
    } catch (reason: unknown) {
      showExpectedFailure(reason);
    }
  };

  const selectDesktopTab = (tab: ScrollTab): void => {
    setActiveTab(tab);
  };

  const closeMobileSheet = (): void => {
    setMobileSheetOpen(false);
    const triggerButton = mobileSheetTriggerRef.current;
    mobileSheetTriggerRef.current = null;
    queueMicrotask(() => triggerButton?.focus());
  };

  const selectMobileTab = (tab: ScrollTab, triggerButton: HTMLButtonElement): void => {
    mobileSheetTriggerRef.current = triggerButton;
    setActiveTab(tab);
    setMobileSheetOpen(true);
  };

  const handleDesktopTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    tab: ScrollTab,
  ): void => {
    const currentIndex = SCROLL_TABS.indexOf(tab);
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % SCROLL_TABS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + SCROLL_TABS.length) % SCROLL_TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = SCROLL_TABS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = SCROLL_TABS[nextIndex];
    setActiveTab(nextTab);
    settingsTabRefs.current[nextTab]?.focus();
  };

  const printScroll = (): void => {
    if (hasTextOverflow) {
      setFeedback({ tone: 'error', text: copy.printOverflowBlocked });
      return;
    }

    if (typeof window === 'undefined' || typeof window.print !== 'function') {
      setFeedback({ tone: 'error', text: `${copy.operationFailed} window.print is unavailable.` });
      return;
    }

    const printBodyClass = 'scrollCreatorPrintActive';
    const clearPrintState = (): void => {
      document.body.classList.remove(printBodyClass);
      window.removeEventListener('afterprint', clearPrintState);
    };

    document.body.classList.add(printBodyClass);
    window.addEventListener('afterprint', clearPrintState, { once: true });
    window.print();
  };

  useEffect(() => {
    const beforePrint = (): void => {
      document.body.classList.add('scrollCreatorPrintActive');
    };
    const afterPrint = (): void => {
      document.body.classList.remove('scrollCreatorPrintActive');
    };

    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
      document.body.classList.remove('scrollCreatorPrintActive');
    };
  }, []);

  useEffect(() => {
    if (!mobileSheetOpen) return;

    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeMobileSheet();
    };

    document.addEventListener('keydown', closeOnEscape);
    queueMicrotask(() => mobileSheetCloseRef.current?.focus());
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileSheetOpen]);

  const panelProps = {
    project,
    copy,
    activeTab,
    paperResizing,
    imagesVisible,
    imagesDraggable,
    imagesResizable,
    selectedImageIds,
    imagePending: imagePending || loadPending,
    fontPending: fontPending || loadPending,
    onPaperChoice: handlePaperChoice,
    onPaperSizeChange: handlePaperSizeChange,
    onPaperSizeReset: resetPaperSize,
    onPaperResizingChange: setPaperResizing,
    onTextStyleChange: handleTextStyleChange,
    onImageVisibilityChange: setImagesVisible,
    onImageDraggingChange: setImagesDraggable,
    onImageResizingChange: setImagesResizable,
    onAddImage: addImageToProject,
    onDeleteSelectedImages: deleteSelectedImages,
    onAddFont: addFontToProject,
  };

  return (
    <div className={styles.workbench} data-scroll-workbench data-scroll-locale={locale}>
      <div className={styles.toolbar} aria-label={copy.toolTitle}>
        <div className={styles.toolbarTitle}>
          <span className={styles.toolbarEyebrow}>{copy.navTitle}</span>
          <span className={styles.toolbarProjectSize}>
            {project.width} × {project.height}
          </span>
        </div>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={(event) => openDialog('save', event.currentTarget)}
          >
            {copy.save}
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={(event) => openDialog('load', event.currentTarget)}
          >
            {copy.load}
          </button>
          <button type="button" className={styles.toolbarButton} onClick={printScroll}>
            {copy.print}
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={(event) => {
              helpTriggerRef.current = event.currentTarget;
              setHelpOpen(true);
            }}
          >
            {copy.help}
          </button>
        </div>
      </div>

      {feedback !== null && (
        <div
          className={feedback.tone === 'error' ? styles.feedbackError : styles.feedbackSuccess}
          role={feedback.tone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          <strong>{feedback.tone === 'error' ? copy.errorTitle : copy.toolTitle}</strong>
          <span>{feedback.text}</span>
        </div>
      )}

      <div className={styles.editorLayout}>
        <aside className={styles.settingsColumn} data-mobile-sheet-open={mobileSheetOpen}>
          <div className={styles.settingsHeader}>
            <span>{copy.toolTitle}</span>
            <button
              type="button"
              className={styles.mobileSheetClose}
              ref={mobileSheetCloseRef}
              onClick={closeMobileSheet}
              aria-label={copy.closePanel}
            >
              ×
            </button>
          </div>
          <nav
            className={styles.settingsTabs}
            aria-label={copy.toolTitle}
            role="tablist"
          >
            {SCROLL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={tab === activeTab ? styles.settingsTabActive : styles.settingsTab}
                id={`${workbenchId}-tab-${tab}`}
                ref={(button) => {
                  settingsTabRefs.current[tab] = button;
                }}
                aria-selected={tab === activeTab}
                aria-controls={`${workbenchId}-panel`}
                tabIndex={tab === activeTab ? 0 : -1}
                role="tab"
                onClick={() => selectDesktopTab(tab)}
                onKeyDown={(event) => handleDesktopTabKeyDown(event, tab)}
              >
                {tabLabel(copy, tab)}
              </button>
            ))}
          </nav>
          <div
            className={styles.settingsContent}
            id={`${workbenchId}-panel`}
            role="tabpanel"
            aria-labelledby={`${workbenchId}-tab-${activeTab}`}
            tabIndex={0}
          >
            <ScrollSettingsPanel {...panelProps} />
          </div>
        </aside>

        <main className={styles.previewColumn}>
          <div className={styles.previewHeader}>
            <div>
              <h2>{copy.previewTitle}</h2>
              <p>{copy.previewHint}</p>
            </div>
            <span className={styles.previewDimensions}>
              {project.width} × {project.height}
            </span>
          </div>
          {hasTextOverflow ? (
            <p className={styles.textOverflowWarning} role="status" aria-live="polite">
              {copy.textOverflowWarning}
            </p>
          ) : null}
          <div className={styles.canvasFrame}>
            <div data-scroll-print-surface>
              <ScrollCanvas
                project={project}
                copy={copy}
                paperResizing={paperResizing}
                imagesVisible={imagesVisible}
                imagesDraggable={imagesDraggable}
                imagesResizable={imagesResizable}
                selectedImageIds={selectedImageIds}
                onTextChange={handleTextChange}
                onTextOverflowChange={handleTextOverflowChange}
                onPaperSizeChange={handlePaperSizeChange}
                onImageGeometryChange={handleImageGeometryChange}
                onImageSelectionChange={setSelectedImageIds}
              />
            </div>
          </div>
        </main>
      </div>

      <nav className={styles.mobileTabBar} aria-label={copy.toolTitle}>
        {SCROLL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? styles.mobileTabActive : styles.mobileTab}
            aria-pressed={tab === activeTab}
            onClick={(event) => selectMobileTab(tab, event.currentTarget)}
          >
            {tabLabel(copy, tab)}
          </button>
        ))}
      </nav>

      {dialogMode !== null ? (
        <ScrollSaveDialog
          copy={copy}
          mode={dialogMode}
          open
          slots={saveSlots}
          busy={loadPending}
          onClose={closeDialog}
          onSave={saveProjectToSlot}
          onLoad={(slot) => void loadProjectFromSlot(slot)}
        />
      ) : null}
      <ScrollHelpDialog
        copy={copy}
        open={helpOpen}
        onClose={() => {
          setHelpOpen(false);
          const triggerButton = helpTriggerRef.current;
          helpTriggerRef.current = null;
          queueMicrotask(() => triggerButton?.focus());
        }}
      />
    </div>
  );
}
