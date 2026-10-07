'use client';

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import type { ScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { getScrollPaper } from '@/lib/scroll-creator/catalog';
import {
  clampScrollPaperSize,
  clampScrollImageDrag,
  resizeScrollImageGeometry,
  type ScrollPaperBounds,
  type ScrollImageResizeCorner,
} from '@/lib/scroll-creator/geometry';
import type { ScrollImage, ScrollImageGeometry, ScrollProject } from '@/lib/scroll-creator/types';

import styles from './ScrollCanvas.module.css';

export interface ScrollCanvasProps {
  project: ScrollProject;
  copy: ScrollCreatorCopy;
  paperResizing: boolean;
  imagesVisible: boolean;
  imagesDraggable: boolean;
  imagesResizable: boolean;
  selectedImageIds: readonly string[];
  onTextChange: (text: string) => void;
  onTextOverflowChange: (hasOverflow: boolean) => void;
  onPaperSizeChange: (width: number, height: number) => void;
  onImageGeometryChange: (id: string, geometry: ScrollImageGeometry) => void;
  onImageSelectionChange: (ids: string[]) => void;
}

type CanvasPoint = { x: number; y: number };

type PaperResizeGesture = {
  pointerId: number;
  handle: 'east' | 'south' | 'corner';
  startClient: CanvasPoint;
  startScale: number;
  startSize: { width: number; height: number };
};

type ImageGesture = {
  pointerId: number;
  mode: 'drag' | 'resize';
  resizeCorner: ScrollImageResizeCorner;
  imageIds: string[];
  clickedImageId: string;
  initiallySelected: boolean;
  startClient: CanvasPoint;
  initialGeometry: Record<string, ScrollImageGeometry>;
  moved: boolean;
};

const POINTER_MOVE_THRESHOLD = 2;
const TEXT_OVERFLOW_TOLERANCE = 1;

const IMAGE_RESIZE_HANDLES: readonly {
  corner: ScrollImageResizeCorner;
  className: string;
}[] = [
  { corner: 'north-west', className: styles.imageResizeNorthWest },
  { corner: 'north-east', className: styles.imageResizeNorthEast },
  { corner: 'south-west', className: styles.imageResizeSouthWest },
  { corner: 'south-east', className: styles.imageResizeSouthEast },
];

const IMAGE_RESIZE_CORNER_SYMBOL: Readonly<Record<ScrollImageResizeCorner, string>> = {
  'north-west': '↖',
  'north-east': '↗',
  'south-west': '↙',
  'south-east': '↘',
};

function getKnownErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  throw error;
}

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

function readEditablePlainTextFromNode(node: Node): string {
  return normalizeLineEndings(node.textContent ?? '');
}

function readEditablePlainText(editableElement: HTMLElement): string {
  return readEditablePlainTextFromNode(editableElement);
}

function readScrollableTextOverflow(editableElement: HTMLElement): boolean | null {
  const visibleHeight = editableElement.clientHeight;
  const contentHeight = editableElement.scrollHeight;
  if (!(visibleHeight > 0) || !(contentHeight > 0)) {
    return null;
  }
  return contentHeight > visibleHeight + TEXT_OVERFLOW_TOLERANCE;
}

function isPrintMediaActive(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('print').matches;
}

function writeEditablePlainText(editableElement: HTMLElement, text: string): void {
  editableElement.textContent = normalizeLineEndings(text);
}

function getEditableSelectionOffset(editableElement: HTMLElement): number | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!editableElement.contains(range.startContainer) || !editableElement.contains(range.endContainer)) {
    return null;
  }

  const textBeforeCaret = range.cloneRange();
  textBeforeCaret.selectNodeContents(editableElement);
  textBeforeCaret.setEnd(range.startContainer, range.startOffset);
  return readEditablePlainTextFromNode(textBeforeCaret.cloneContents()).length;
}

function restoreEditableSelectionOffset(editableElement: HTMLElement, offset: number): void {
  const boundedOffset = Math.max(0, Math.min(offset, readEditablePlainText(editableElement).length));
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const walker = document.createTreeWalker(editableElement, NodeFilter.SHOW_TEXT);
  let remainingOffset = boundedOffset;
  let currentNode: Node | null = walker.nextNode();
  while (currentNode) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      const textLength = currentNode.nodeValue?.length ?? 0;
      if (remainingOffset <= textLength) {
        const range = document.createRange();
        range.setStart(currentNode, remainingOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      remainingOffset -= textLength;
    }
    currentNode = walker.nextNode();
  }

  const range = document.createRange();
  range.selectNodeContents(editableElement);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getEditableSelectionOffsets(editableElement: HTMLElement): { start: number; end: number } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!editableElement.contains(range.startContainer) || !editableElement.contains(range.endContainer)) {
    return null;
  }
  const startRange = range.cloneRange();
  startRange.selectNodeContents(editableElement);
  startRange.setEnd(range.startContainer, range.startOffset);
  const endRange = range.cloneRange();
  endRange.selectNodeContents(editableElement);
  endRange.setEnd(range.endContainer, range.endOffset);
  return {
    start: readEditablePlainTextFromNode(startRange.cloneContents()).length,
    end: readEditablePlainTextFromNode(endRange.cloneContents()).length,
  };
}

function getLogicalPoint(
  paperElement: HTMLElement,
  clientX: number,
  clientY: number,
  project: ScrollProject,
): CanvasPoint {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    throw new Error(`Invalid canvas pointer coordinates: x=${clientX}, y=${clientY}.`);
  }
  const paperRectangle = paperElement.getBoundingClientRect();
  if (!(paperRectangle.width > 0) || !(paperRectangle.height > 0)) {
    throw new Error(`Invalid paper display size: width=${paperRectangle.width}, height=${paperRectangle.height}.`);
  }
  const point = {
    x: ((clientX - paperRectangle.left) / paperRectangle.width) * project.width,
    y: ((clientY - paperRectangle.top) / paperRectangle.height) * project.height,
  };
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`Invalid logical canvas coordinates: x=${point.x}, y=${point.y}.`);
  }
  return point;
}

function getCanvasScale(viewportElement: HTMLElement, width: number, height: number): number {
  if (!(width > 0) || !(height > 0)) {
    throw new Error(`Invalid logical paper size: width=${width}, height=${height}.`);
  }
  const viewportRectangle = viewportElement.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(viewportElement);
  const horizontalPadding =
    Number.parseFloat(computedStyle.paddingLeft) +
    Number.parseFloat(computedStyle.paddingRight);
  const verticalPadding =
    Number.parseFloat(computedStyle.paddingTop) +
    Number.parseFloat(computedStyle.paddingBottom);
  const horizontalBorder =
    Number.parseFloat(computedStyle.borderLeftWidth) +
    Number.parseFloat(computedStyle.borderRightWidth);
  const verticalBorder =
    Number.parseFloat(computedStyle.borderTopWidth) +
    Number.parseFloat(computedStyle.borderBottomWidth);
  const measuredClientWidth = viewportElement.clientWidth > 0
    ? viewportElement.clientWidth
    : viewportRectangle.width - (Number.isFinite(horizontalBorder) ? horizontalBorder : 0);
  const measuredClientHeight = viewportElement.clientHeight > 0
    ? viewportElement.clientHeight
    : viewportRectangle.height - (Number.isFinite(verticalBorder) ? verticalBorder : 0);
  if (!(measuredClientWidth > 0) || !(measuredClientHeight > 0)) {
    return 1;
  }
  const availableWidth = measuredClientWidth - (Number.isFinite(horizontalPadding) ? horizontalPadding : 0);
  const availableHeight = measuredClientHeight - (Number.isFinite(verticalPadding) ? verticalPadding : 0);
  if (!(availableWidth > 0) || !(availableHeight > 0)) {
    throw new Error(
      `Invalid paper board size after insets: width=${availableWidth}, height=${availableHeight}.`,
    );
  }
  return Math.min(1, availableWidth / width, availableHeight / height);
}

function getUpdatedTextFromInput(editableElement: HTMLElement): string {
  return readEditablePlainText(editableElement);
}

function requireImageById(images: readonly ScrollImage[], imageId: string): ScrollImage {
  const image = images.find((candidate) => candidate.id === imageId);
  if (!image) {
    throw new Error(`Cannot update unknown scroll image id: ${JSON.stringify(imageId)}.`);
  }
  return image;
}

function createInitialImageGeometry(images: readonly ScrollImage[], imageIds: readonly string[]): Record<string, ScrollImageGeometry> {
  const initialGeometry: Record<string, ScrollImageGeometry> = {};
  for (const imageId of imageIds) {
    const image = requireImageById(images, imageId);
    initialGeometry[image.id] = { x: image.x, y: image.y, width: image.width, height: image.height };
  }
  return initialGeometry;
}

function getScrollPaperBounds(project: ScrollProject): ScrollPaperBounds {
  return { width: project.width, height: project.height };
}

function getErrorAlertText(copy: ScrollCreatorCopy, error: unknown): string {
  return `${copy.errorTitle}: ${getKnownErrorMessage(error)}`;
}

export function ScrollCanvas({
  project,
  copy,
  paperResizing,
  imagesVisible,
  imagesDraggable,
  imagesResizable,
  selectedImageIds,
  onTextChange,
  onTextOverflowChange,
  onPaperSizeChange,
  onImageGeometryChange,
  onImageSelectionChange,
}: ScrollCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const editableTextRef = useRef<HTMLDivElement>(null);
  const paperResizeGestureRef = useRef<PaperResizeGesture | null>(null);
  const imageGestureRef = useRef<ImageGesture | null>(null);
  const isComposingRef = useRef(false);
  const reportedTextOverflowRef = useRef<boolean | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [paperResizeFrameOffset, setPaperResizeFrameOffset] = useState(0);
  const [hasTextOverflow, setHasTextOverflow] = useState(false);
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [failedImageUrls, setFailedImageUrls] = useState<ReadonlyMap<string, string>>(new Map());

  const paper = getScrollPaper(project.paperId);

  const measureAndReportTextOverflow = useCallback(() => {
    if (isPrintMediaActive()) {
      return;
    }
    const editableElement = editableTextRef.current;
    const nextHasTextOverflow = editableElement ? readScrollableTextOverflow(editableElement) : null;
    if (nextHasTextOverflow === null) {
      return;
    }
    if (reportedTextOverflowRef.current === nextHasTextOverflow) {
      return;
    }
    reportedTextOverflowRef.current = nextHasTextOverflow;
    setHasTextOverflow(nextHasTextOverflow);
    onTextOverflowChange(nextHasTextOverflow);
  }, [onTextOverflowChange]);

  const recalculateCanvasScale = useCallback(() => {
    if (paperResizeGestureRef.current || isPrintMediaActive()) {
      return;
    }
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return;
    }
    try {
      setCanvasScale(getCanvasScale(viewportElement, project.width, project.height));
    } catch (error) {
      setInteractionError(getErrorAlertText(copy, error));
    }
  }, [copy, project.height, project.width]);

  useLayoutEffect(() => {
    recalculateCanvasScale();
    const viewportElement = viewportRef.current;
    if (!viewportElement || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(recalculateCanvasScale);
    observer.observe(viewportElement);
    return () => observer.disconnect();
  }, [recalculateCanvasScale]);

  useLayoutEffect(() => {
    const editableElement = editableTextRef.current;
    if (!editableElement) {
      return;
    }
    if (readEditablePlainText(editableElement) !== project.text) {
      const selectionOffset = getEditableSelectionOffset(editableElement);
      writeEditablePlainText(editableElement, project.text);
      if (selectionOffset !== null && document.activeElement === editableElement) {
        restoreEditableSelectionOffset(editableElement, selectionOffset);
      }
    }
    measureAndReportTextOverflow();
  }, [measureAndReportTextOverflow, project.text]);

  useLayoutEffect(() => {
    measureAndReportTextOverflow();
  }, [
    measureAndReportTextOverflow,
    project.height,
    project.textStyle.bold,
    project.textStyle.fontFamily,
    project.textStyle.fontSize,
    project.textStyle.italic,
    project.width,
  ]);

  useLayoutEffect(() => {
    const editableElement = editableTextRef.current;
    if (!editableElement) {
      return undefined;
    }
    measureAndReportTextOverflow();
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(measureAndReportTextOverflow);
    observer.observe(editableElement);
    return () => observer.disconnect();
  }, [measureAndReportTextOverflow]);

  useLayoutEffect(() => {
    const fontSet = typeof document === 'undefined' ? undefined : document.fonts;
    if (!fontSet || typeof fontSet.addEventListener !== 'function') {
      return undefined;
    }
    fontSet.addEventListener('loadingdone', measureAndReportTextOverflow);
    fontSet.addEventListener('loadingerror', measureAndReportTextOverflow);
    return () => {
      fontSet.removeEventListener('loadingdone', measureAndReportTextOverflow);
      fontSet.removeEventListener('loadingerror', measureAndReportTextOverflow);
    };
  }, [measureAndReportTextOverflow]);

  const clearInteractionError = useCallback(() => {
    setInteractionError(null);
  }, []);

  const finishPaperResizeGesture = useCallback(() => {
    const gesture = paperResizeGestureRef.current;
    if (!gesture) {
      return;
    }
    paperResizeGestureRef.current = null;
    setPaperResizeFrameOffset(0);
    const paperElement = paperRef.current;
    if (paperElement?.hasPointerCapture?.(gesture.pointerId)) {
      paperElement.releasePointerCapture(gesture.pointerId);
    }
    recalculateCanvasScale();
  }, [recalculateCanvasScale]);

  const finishImageGesture = useCallback(() => {
    const gesture = imageGestureRef.current;
    if (!gesture) {
      return;
    }
    imageGestureRef.current = null;
    const paperElement = paperRef.current;
    if (paperElement?.hasPointerCapture?.(gesture.pointerId)) {
      paperElement.releasePointerCapture(gesture.pointerId);
    }
  }, []);

  const handleEditableInput = useCallback((event: FormEvent<HTMLDivElement>) => {
    if (isComposingRef.current) {
      return;
    }
    const editableElement = event.currentTarget;
    const nextText = getUpdatedTextFromInput(editableElement);
    onTextChange(nextText);
    measureAndReportTextOverflow();
  }, [measureAndReportTextOverflow, onTextChange]);

  const handleEditablePaste = useCallback((event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const plainText = event.clipboardData?.getData('text/plain');
    if (typeof plainText !== 'string') {
      throw new Error(`Clipboard text must be a string; received ${typeof plainText}.`);
    }
    const editableElement = event.currentTarget;
    const selection = getEditableSelectionOffsets(editableElement);
    const existingText = readEditablePlainText(editableElement);
    const startOffset = selection?.start ?? existingText.length;
    const endOffset = selection?.end ?? startOffset;
    const nextText = existingText.slice(0, startOffset) + normalizeLineEndings(plainText) + existingText.slice(endOffset);
    writeEditablePlainText(editableElement, nextText);
    restoreEditableSelectionOffset(editableElement, startOffset + normalizeLineEndings(plainText).length);
    onTextChange(nextText);
    measureAndReportTextOverflow();
  }, [measureAndReportTextOverflow, onTextChange]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((event: FormEvent<HTMLDivElement>) => {
    isComposingRef.current = false;
    handleEditableInput(event);
  }, [handleEditableInput]);

  const startPaperResize = useCallback((event: ReactPointerEvent<HTMLButtonElement>, handle: PaperResizeGesture['handle']) => {
    if (event.button !== 0 || paperResizeGestureRef.current || imageGestureRef.current) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const paperElement = paperRef.current;
    if (!paperElement) {
      throw new Error(`Cannot resize paper ${project.paperId}: paper element is unavailable.`);
    }
    if (!(canvasScale > 0) || !Number.isFinite(canvasScale)) {
      throw new Error(`Cannot resize paper ${project.paperId}: invalid canvas scale ${canvasScale}.`);
    }
    paperElement.setPointerCapture(event.pointerId);
    paperResizeGestureRef.current = {
      pointerId: event.pointerId,
      handle,
      startClient: { x: event.clientX, y: event.clientY },
      startScale: canvasScale,
      startSize: { width: project.width, height: project.height },
    };
    setPaperResizeFrameOffset(0);
    clearInteractionError();
  }, [canvasScale, clearInteractionError, project.height, project.paperId, project.width]);

  const selectImageByClick = useCallback((imageId: string) => {
    if (selectedImageIds.includes(imageId)) {
      onImageSelectionChange(selectedImageIds.filter((selectedId) => selectedId !== imageId));
      return;
    }
    onImageSelectionChange([...selectedImageIds, imageId]);
  }, [onImageSelectionChange, selectedImageIds]);

  const startImageGesture = useCallback((
    event: ReactPointerEvent<HTMLElement>,
    image: ScrollImage,
    mode: ImageGesture['mode'],
    resizeCorner: ScrollImageResizeCorner = 'south-east',
  ) => {
    if (event.button !== 0 || paperResizeGestureRef.current || imageGestureRef.current) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const paperElement = paperRef.current;
    if (!paperElement) {
      throw new Error(`Cannot edit image ${image.id}: paper element is unavailable.`);
    }

    const imageIsSelected = selectedImageIds.includes(image.id);
    let gestureImageIds = [...selectedImageIds];
    if (!imageIsSelected && mode === 'drag') {
      gestureImageIds = [...selectedImageIds, image.id];
      onImageSelectionChange(gestureImageIds);
    }

    paperElement.setPointerCapture(event.pointerId);
    imageGestureRef.current = {
      pointerId: event.pointerId,
      mode,
      resizeCorner,
      imageIds: mode === 'resize' ? [image.id] : gestureImageIds,
      clickedImageId: image.id,
      initiallySelected: imageIsSelected,
      startClient: { x: event.clientX, y: event.clientY },
      initialGeometry: createInitialImageGeometry(project.images, mode === 'resize' ? [image.id] : gestureImageIds),
      moved: false,
    };
    clearInteractionError();
  }, [clearInteractionError, onImageSelectionChange, project.images, selectedImageIds]);

  const handlePaperPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const paperElement = paperRef.current;
    if (!paperElement) {
      return;
    }
    const paperResizeGesture = paperResizeGestureRef.current;
    if (paperResizeGesture?.pointerId === event.pointerId) {
      event.preventDefault();
      try {
        const deltaX = (event.clientX - paperResizeGesture.startClient.x) / paperResizeGesture.startScale;
        const deltaY = (event.clientY - paperResizeGesture.startClient.y) / paperResizeGesture.startScale;
        const nextWidth = paperResizeGesture.startSize.width + (paperResizeGesture.handle === 'south' ? 0 : deltaX);
        const nextHeight = paperResizeGesture.startSize.height + (paperResizeGesture.handle === 'east' ? 0 : deltaY);
        const clampedPaperSize = clampScrollPaperSize(nextWidth, nextHeight);
        setPaperResizeFrameOffset(
          (clampedPaperSize.width - paperResizeGesture.startSize.width) * paperResizeGesture.startScale / 2,
        );
        onPaperSizeChange(clampedPaperSize.width, clampedPaperSize.height);
      } catch (error) {
        setInteractionError(getErrorAlertText(copy, error));
        finishPaperResizeGesture();
      }
      return;
    }

    const imageGesture = imageGestureRef.current;
    if (!imageGesture || imageGesture.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    try {
      const deltaX = event.clientX - imageGesture.startClient.x;
      const deltaY = event.clientY - imageGesture.startClient.y;
      if (Math.hypot(deltaX, deltaY) >= POINTER_MOVE_THRESHOLD) {
        imageGesture.moved = true;
      }
      const startPoint = getLogicalPoint(paperElement, imageGesture.startClient.x, imageGesture.startClient.y, project);
      const currentPoint = getLogicalPoint(paperElement, event.clientX, event.clientY, project);
      const logicalDelta = { x: currentPoint.x - startPoint.x, y: currentPoint.y - startPoint.y };
      const paperBounds = getScrollPaperBounds(project);
      if (imageGesture.mode === 'resize') {
        const imageId = imageGesture.imageIds[0];
        if (!imageId) {
          throw new Error('Image resize gesture has no image id.');
        }
        const initialGeometry = imageGesture.initialGeometry[imageId];
        if (!initialGeometry) {
          throw new Error(`Image resize gesture has no starting geometry for ${JSON.stringify(imageId)}.`);
        }
        const resizeDelta = {
          width: imageGesture.resizeCorner.endsWith('west') ? -logicalDelta.x : logicalDelta.x,
          height: imageGesture.resizeCorner.startsWith('north') ? -logicalDelta.y : logicalDelta.y,
        };
        onImageGeometryChange(imageId, resizeScrollImageGeometry(initialGeometry, resizeDelta, paperBounds, imageGesture.resizeCorner));
      } else {
        for (const imageId of imageGesture.imageIds) {
          const initialGeometry = imageGesture.initialGeometry[imageId];
          if (!initialGeometry) {
            throw new Error(`Image drag gesture has no starting geometry for ${JSON.stringify(imageId)}.`);
          }
          onImageGeometryChange(imageId, clampScrollImageDrag({
            ...initialGeometry,
            x: initialGeometry.x + logicalDelta.x,
            y: initialGeometry.y + logicalDelta.y,
          }, paperBounds));
        }
      }
    } catch (error) {
      setInteractionError(getErrorAlertText(copy, error));
      finishImageGesture();
    }
  }, [copy, finishImageGesture, finishPaperResizeGesture, onImageGeometryChange, onPaperSizeChange, project]);

  const handlePaperPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (paperResizeGestureRef.current?.pointerId === event.pointerId) {
      finishPaperResizeGesture();
      return;
    }
    const imageGesture = imageGestureRef.current;
    if (imageGesture?.pointerId === event.pointerId) {
      if (imageGesture.mode === 'drag' && !imageGesture.moved && imageGesture.initiallySelected) {
        onImageSelectionChange(imageGesture.imageIds.filter((imageId) => imageId !== imageGesture.clickedImageId));
      }
      finishImageGesture();
    }
  }, [finishImageGesture, finishPaperResizeGesture, onImageSelectionChange]);

  const handlePaperBackgroundPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.button !== 0) {
      return;
    }
    onImageSelectionChange([]);
  }, [onImageSelectionChange]);

  const handleImageError = useCallback((imageId: string, imageUrl: string) => {
    setFailedImageUrls((currentUrls) => {
      const nextUrls = new Map(currentUrls);
      nextUrls.set(imageId, imageUrl);
      return nextUrls;
    });
  }, []);

  const failedImageDescriptions = project.images.flatMap((image, imageIndex) => {
    if (failedImageUrls.get(image.id) !== image.url) {
      return [];
    }
    return [`${copy.imageLabel} #${imageIndex + 1}: ${image.url}`];
  });

  const paperFrameStyle = {
    width: project.width * canvasScale,
    height: project.height * canvasScale,
    transform: paperResizeFrameOffset === 0 ? undefined : `translateX(${paperResizeFrameOffset}px)`,
  };
  const paperStyle = {
    width: project.width,
    height: project.height,
    transform: `scale(${canvasScale})`,
  };
  const paperContentStyle = {
    backgroundImage: `url(${JSON.stringify(paper.src)})`,
  };
  const textStyle = {
    color: project.textStyle.color,
    fontFamily: project.textStyle.fontFamily,
    fontSize: `${project.textStyle.fontSize}px`,
    fontStyle: project.textStyle.italic ? 'italic' : 'normal',
    fontWeight: project.textStyle.bold ? 700 : 400,
    textAlign: project.textStyle.align,
  } as const;

  return (
    <div
      className={styles.canvasViewport}
      data-print-overflow-message={copy.printOverflowBlocked}
      data-scroll-canvas-viewport
      data-scroll-text-overflow={hasTextOverflow ? 'true' : 'false'}
      ref={viewportRef}
    >
      {interactionError ? <p className={styles.interactionError} role="alert">{interactionError}</p> : null}
      {failedImageDescriptions.length > 0 ? (
        <p className={styles.interactionError} role="alert">
          {copy.operationFailed} {failedImageDescriptions.join('; ')}
        </p>
      ) : null}
      <div className={styles.paperFrame} style={paperFrameStyle}>
        <div
          aria-label={copy.previewTitle}
          className={styles.paper}
          data-scroll-paper
          ref={paperRef}
          style={paperStyle}
          onPointerMove={handlePaperPointerMove}
          onPointerUp={handlePaperPointerUp}
          onPointerCancel={handlePaperPointerUp}
          onPointerDown={handlePaperBackgroundPointerDown}
        >
          <div
            className={styles.paperContent}
            data-scroll-paper-content
            style={paperContentStyle}
            onPointerDown={handlePaperBackgroundPointerDown}
          >
            <div
              aria-label={copy.textPlaceholder}
              aria-multiline="true"
              className={styles.editableText}
              contentEditable="plaintext-only"
              data-placeholder={copy.textPlaceholder}
              data-scroll-text
              ref={editableTextRef}
              role="textbox"
              spellCheck
              suppressContentEditableWarning
              style={textStyle}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onInput={handleEditableInput}
              onPaste={handleEditablePaste}
              onPointerDown={(event) => event.stopPropagation()}
            />

            {imagesVisible ? (
              <div className={styles.imageLayers} data-scroll-image-layers>
                {project.images.map((image, imageIndex) => {
                  const selected = selectedImageIds.includes(image.id);
                  const imageStyle = { left: image.x, top: image.y, width: image.width, height: image.height };
                  return (
                    <div
                      aria-label={`${copy.imageLabel} #${imageIndex + 1}`}
                      className={`${styles.imageLayer} ${selected ? styles.selectedImage : ''}`}
                      data-scroll-image={image.id}
                      key={image.id}
                      role="group"
                      style={imageStyle}
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) {
                          return;
                        }
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onImageSelectionChange(selected ? selectedImageIds.filter((id) => id !== image.id) : [...selectedImageIds, image.id]);
                        }
                      }}
                      onPointerDown={(event) => {
                        if (imagesDraggable) {
                          startImageGesture(event, image, 'drag');
                          return;
                        }
                        event.preventDefault();
                        event.stopPropagation();
                        selectImageByClick(image.id);
                      }}
                    >
                      <img
                        alt={`${copy.imageLabel} #${imageIndex + 1}`}
                        className={styles.imageContent}
                        draggable={false}
                        src={image.url}
                        onError={() => handleImageError(image.id, image.url)}
                      />
                      {selected && imagesResizable ? IMAGE_RESIZE_HANDLES.map(({ corner, className }) => (
                        <button
                          aria-label={`${copy.resizeImage} ${IMAGE_RESIZE_CORNER_SYMBOL[corner]}`}
                          className={`${styles.imageResizeHandle} ${className}`}
                          data-image-resize-corner={corner}
                          data-image-resize-handle={image.id}
                          key={corner}
                          type="button"
                          onPointerDown={(event) => startImageGesture(event, image, 'resize', corner)}
                        />
                      )) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {paperResizing ? (
            <>
              <button
                aria-label={copy.resizePaperEast}
                className={`${styles.paperResizeHandle} ${styles.paperResizeEast}`}
                data-paper-resize-handle="east"
                type="button"
                onPointerDown={(event) => startPaperResize(event, 'east')}
              />
              <button
                aria-label={copy.resizePaperSouth}
                className={`${styles.paperResizeHandle} ${styles.paperResizeSouth}`}
                data-paper-resize-handle="south"
                type="button"
                onPointerDown={(event) => startPaperResize(event, 'south')}
              />
              <button
                aria-label={copy.resizePaperCorner}
                className={`${styles.paperResizeHandle} ${styles.paperResizeCorner}`}
                data-paper-resize-handle="corner"
                type="button"
                onPointerDown={(event) => startPaperResize(event, 'corner')}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
