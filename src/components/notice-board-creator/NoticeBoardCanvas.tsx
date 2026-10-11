'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';

import { NOTICE_BOARD_BACKGROUND, NOTICE_PAPER_ASSETS } from '@/lib/notice-board-creator/catalog';
import { getBoardHeight, getNoticeHeight } from '@/lib/notice-board-creator/geometry';
import type { NoticeBoardProject, NoticeResizeHandle } from '@/lib/notice-board-creator/types';
import type { NoticeBoardEditorCopy } from '@/lib/notice-board-creator/editor-copy';

import styles from './NoticeBoardCreatorWorkbench.module.css';

const A4_LANDSCAPE_WIDTH_PX = (297 * 96) / 25.4;
const A4_LANDSCAPE_HEIGHT_PX = (210 * 96) / 25.4;

type NoticeBoardGesture = {
  pointerId: number;
  noticeId: string;
  action: 'move' | NoticeResizeHandle;
  previousClientX: number;
  previousClientY: number;
};

export type NoticeBoardCanvasProps = {
  copy: NoticeBoardEditorCopy;
  project: NoticeBoardProject;
  selectedNoticeIds: readonly string[];
  multiSelectEnabled: boolean;
  dragEnabled: boolean;
  resizeEnabled: boolean;
  onSelectNotice: (noticeId: string, toggleSelection: boolean) => void;
  onMoveNotice: (noticeId: string, deltaX: number, deltaY: number) => void;
  onResizeNotice: (
    noticeId: string,
    deltaX: number,
    deltaY: number,
    handle: NoticeResizeHandle,
  ) => void;
};

export function NoticeBoardCanvas({
  copy,
  project,
  selectedNoticeIds,
  multiSelectEnabled,
  dragEnabled,
  resizeEnabled,
  onSelectNotice,
  onMoveNotice,
  onResizeNotice,
}: NoticeBoardCanvasProps) {
  const canvasId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeGestureRef = useRef<NoticeBoardGesture | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const boardHeight = getBoardHeight(project.boardWidth);
  const boardScale = getNoticeBoardScale(
    viewportSize.width,
    viewportSize.height,
    project.boardWidth,
    boardHeight,
  );
  const printScale = Math.min(
    A4_LANDSCAPE_WIDTH_PX / project.boardWidth,
    A4_LANDSCAPE_HEIGHT_PX / boardHeight,
  );
  const scaledBoardWidth = project.boardWidth * boardScale;
  const scaledBoardHeight = boardHeight * boardScale;
  const boardStyle = {
    width: project.boardWidth,
    height: boardHeight,
    '--board-width': `${project.boardWidth}px`,
    '--board-height': `${boardHeight}px`,
    '--board-scale': boardScale,
    '--board-print-scale': printScale,
    transform: `scale(${boardScale})`,
  } as CSSProperties;

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (viewportElement === null) {
      throw new Error('Notice board canvas viewport must exist before measuring its width.');
    }

    const measureViewport = () => {
      const clientWidth = viewportElement.clientWidth;
      const clientHeight = viewportElement.clientHeight;
      if (clientWidth <= 0 || clientHeight <= 0) {
        setViewportSize((previousSize) => {
          if (previousSize.width === 0 && previousSize.height === 0) return previousSize;
          return { width: 0, height: 0 };
        });
        return;
      }

      const viewportStyle = window.getComputedStyle(viewportElement);
      const horizontalPadding = parsePaddingPair(viewportStyle.paddingLeft, viewportStyle.paddingRight);
      const verticalPadding = parsePaddingPair(viewportStyle.paddingTop, viewportStyle.paddingBottom);
      const viewportWidth = Math.max(0, clientWidth - horizontalPadding);
      const viewportHeight = Math.max(0, clientHeight - verticalPadding);
      setViewportSize((previousSize) => {
        if (previousSize.width === viewportWidth && previousSize.height === viewportHeight) {
          return previousSize;
        }
        return { width: viewportWidth, height: viewportHeight };
      });
    };
    measureViewport();

    if (typeof ResizeObserver !== 'undefined') {
      const viewportObserver = new ResizeObserver(measureViewport);
      viewportObserver.observe(viewportElement);
      return () => viewportObserver.disconnect();
    }

    window.addEventListener('resize', measureViewport);
    return () => window.removeEventListener('resize', measureViewport);
  }, []);

  function startGesture(
    event: PointerEvent<HTMLButtonElement>,
    noticeId: string,
    action: NoticeBoardGesture['action'],
  ): void {
    if (event.button !== 0) return;
    if (action === 'move' && (!dragEnabled || multiSelectEnabled)) return;
    if (action !== 'move' && (!resizeEnabled || multiSelectEnabled)) return;

    activeGestureRef.current = {
      pointerId: event.pointerId,
      noticeId,
      action,
      previousClientX: event.clientX,
      previousClientY: event.clientY,
    };
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function continueGesture(event: PointerEvent<HTMLButtonElement>): void {
    const gesture = activeGestureRef.current;
    if (gesture === null || gesture.pointerId !== event.pointerId) return;

    const deltaX = (event.clientX - gesture.previousClientX) / boardScale;
    const deltaY = (event.clientY - gesture.previousClientY) / boardScale;
    if (deltaX === 0 && deltaY === 0) return;

    if (gesture.action === 'move') {
      onMoveNotice(gesture.noticeId, deltaX, deltaY);
    } else {
      onResizeNotice(gesture.noticeId, deltaX, deltaY, gesture.action);
    }
    activeGestureRef.current = {
      ...gesture,
      previousClientX: event.clientX,
      previousClientY: event.clientY,
    };
  }

  function endGesture(event: PointerEvent<HTMLButtonElement>): void {
    if (activeGestureRef.current?.pointerId === event.pointerId) {
      activeGestureRef.current = null;
    }
  }

  function handleNoticeKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    noticeId: string,
  ): void {
    if (multiSelectEnabled) return;
    const movement = event.shiftKey ? 20 : 5;
    const movementByKey: Record<string, [number, number]> = {
      ArrowLeft: [-movement, 0],
      ArrowRight: [movement, 0],
      ArrowUp: [0, -movement],
      ArrowDown: [0, movement],
    };
    const moveDelta = movementByKey[event.key];
    if (moveDelta !== undefined && dragEnabled) {
      event.preventDefault();
      onMoveNotice(noticeId, moveDelta[0], moveDelta[1]);
      return;
    }

    if ((event.key === '+' || event.key === '=' || event.key === '-') && resizeEnabled) {
      event.preventDefault();
      const widthDelta = event.key === '-' ? -10 : 10;
      onResizeNotice(noticeId, widthDelta, widthDelta * (500 / 347), 'corner');
    }
  }

  function handleResizeKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    noticeId: string,
    handle: NoticeResizeHandle,
  ): void {
    if (multiSelectEnabled || !resizeEnabled) return;
    const widthDeltaByKey: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
    };
    const widthDelta = widthDeltaByKey[event.key];
    if (widthDelta === undefined) return;
    event.preventDefault();
    const scaledHeightDelta = widthDelta * (500 / 347);
    const deltaX = handle === 'bottom' ? 0 : widthDelta;
    const deltaY = handle === 'right' ? 0 : scaledHeightDelta;
    onResizeNotice(noticeId, deltaX, deltaY, handle);
  }

  return (
    <>
      <header className={styles.canvasHeader}>
        <h2 className={styles.canvasHeaderTitle} id={`${canvasId}-title`}>{copy.canvasTitle}</h2>
        <div className={styles.canvasHeaderMeta}>
          <span className={styles.canvasHeaderSelectionCount} aria-live="polite">
            {copy.selectedNoticeCount(selectedNoticeIds.length)}
          </span>
          <span className={styles.canvasDimensions}>
            {copy.boardDimensions(project.boardWidth, boardHeight)}
          </span>
        </div>
      </header>
      <div
        ref={viewportRef}
        className={styles.canvasViewport}
        aria-labelledby={`${canvasId}-title`}
        data-notice-board-canvas
      >
        <div
          className={styles.boardStage}
          style={{
            width: scaledBoardWidth,
            height: scaledBoardHeight,
            '--board-width': `${project.boardWidth}px`,
            '--board-height': `${boardHeight}px`,
            '--board-print-width': `${project.boardWidth * printScale}px`,
            '--board-print-height': `${boardHeight * printScale}px`,
            '--board-print-scale': printScale,
          } as CSSProperties}
          data-notice-board-print-stage
        >
          <div
            className={styles.boardSurface}
            style={boardStyle}
            data-notice-board-print-surface
            data-board-width={project.boardWidth}
            data-board-height={boardHeight}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Keep the SVG board visible in browser print when background graphics are disabled. */}
            <img
              className={styles.boardBackground}
              src={NOTICE_BOARD_BACKGROUND.src}
              width={NOTICE_BOARD_BACKGROUND.width}
              height={NOTICE_BOARD_BACKGROUND.height}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
            {project.notices.length === 0 ? (
              <p className={styles.canvasEmpty}>{copy.canvasEmpty}</p>
            ) : null}
            {project.notices.map((notice, index) => {
                const paperAsset = NOTICE_PAPER_ASSETS.find((asset) => asset.id === notice.paperId);
                if (paperAsset === undefined) {
                  throw new Error(`Notice ${JSON.stringify(notice.id)} has unknown paper id ${JSON.stringify(notice.paperId)}.`);
                }
                const isSelected = selectedNoticeIds.includes(notice.id);
                const noticePositionStyle = {
                  left: notice.x,
                  top: notice.y,
                  width: notice.width,
                  height: getNoticeHeight(notice.width),
                  zIndex: isSelected ? 2 : 1,
                } as CSSProperties;
                const noticeTextStyle: CSSProperties = {
                  color: notice.style.color,
                  fontFamily: notice.style.fontFamily,
                  fontSize: `${notice.style.fontSize}px`,
                  lineHeight: `${notice.style.lineHeight}px`,
                  fontWeight: notice.style.fontStyle.startsWith('bold') ? 700 : 400,
                  fontStyle: notice.style.fontStyle.includes('italic') ? 'italic' : 'normal',
                  textAlign: notice.style.textAlign,
                };

                return (
                  <div
                    className={`${styles.noticeCard} ${isSelected ? styles.noticeCardSelected : ''}`}
                    key={notice.id}
                    style={noticePositionStyle}
                    data-notice-id={notice.id}
                    data-paper-id={notice.paperId}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- Keep each SVG paper visible in browser print when background graphics are disabled. */}
                    <img
                      className={styles.noticePaper}
                      src={paperAsset.src}
                      width={paperAsset.width}
                      height={paperAsset.height}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                    />
                    <button
                      className={styles.noticeSelectButton}
                      type="button"
                      aria-label={copy.selectedNoticeLabel(index + 1)}
                      aria-pressed={isSelected}
                      onClick={() => onSelectNotice(notice.id, multiSelectEnabled)}
                      onKeyDown={(event) => handleNoticeKeyDown(event, notice.id)}
                      onPointerDown={(event) => startGesture(event, notice.id, 'move')}
                      onPointerMove={continueGesture}
                      onPointerUp={endGesture}
                      onPointerCancel={endGesture}
                    >
                      <span className={styles.noticeContent} style={noticeTextStyle}>
                        {notice.text || copy.selectedNoticeLabel(index + 1)}
                      </span>
                    </button>
                    {isSelected && !multiSelectEnabled && resizeEnabled ? (
                      <>
                        <button
                          className={`${styles.resizeHandle} ${styles.resizeRight}`}
                          type="button"
                          aria-label={copy.resizeNoticeRight(index + 1)}
                          style={getResizeHandlePosition(notice, 'right', project.boardWidth, boardHeight, boardScale)}
                          onPointerDown={(event) => startGesture(event, notice.id, 'right')}
                          onPointerMove={continueGesture}
                          onPointerUp={endGesture}
                          onPointerCancel={endGesture}
                          onKeyDown={(event) => handleResizeKeyDown(event, notice.id, 'right')}
                        />
                        <button
                          className={`${styles.resizeHandle} ${styles.resizeBottom}`}
                          type="button"
                          aria-label={copy.resizeNoticeBottom(index + 1)}
                          style={getResizeHandlePosition(notice, 'bottom', project.boardWidth, boardHeight, boardScale)}
                          onPointerDown={(event) => startGesture(event, notice.id, 'bottom')}
                          onPointerMove={continueGesture}
                          onPointerUp={endGesture}
                          onPointerCancel={endGesture}
                          onKeyDown={(event) => handleResizeKeyDown(event, notice.id, 'bottom')}
                        />
                        <button
                          className={`${styles.resizeHandle} ${styles.resizeCorner}`}
                          type="button"
                          aria-label={copy.resizeNoticeCorner(index + 1)}
                          style={getResizeHandlePosition(notice, 'corner', project.boardWidth, boardHeight, boardScale)}
                          onPointerDown={(event) => startGesture(event, notice.id, 'corner')}
                          onPointerMove={continueGesture}
                          onPointerUp={endGesture}
                          onPointerCancel={endGesture}
                          onKeyDown={(event) => handleResizeKeyDown(event, notice.id, 'corner')}
                        />
                      </>
                    ) : null}
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function getNoticeBoardScale(
  viewportWidth: number,
  viewportHeight: number,
  boardWidth: number,
  boardHeight: number,
): number {
  if (viewportWidth <= 0 || viewportHeight <= 0) return 1;
  return Math.min(1, viewportWidth / boardWidth, viewportHeight / boardHeight);
}

function parsePaddingPair(firstPadding: string, secondPadding: string): number {
  const parsedFirstPadding = Number.parseFloat(firstPadding);
  const parsedSecondPadding = Number.parseFloat(secondPadding);
  if (!Number.isFinite(parsedFirstPadding) || !Number.isFinite(parsedSecondPadding)) {
    throw new Error(
      `Canvas viewport padding must be finite CSS lengths; received ${JSON.stringify([firstPadding, secondPadding])}.`,
    );
  }
  return parsedFirstPadding + parsedSecondPadding;
}

function getResizeHandlePosition(
  notice: NoticeBoardProject['notices'][number],
  handle: NoticeResizeHandle,
  boardWidth: number,
  boardHeight: number,
  boardScale: number,
): CSSProperties {
  const noticeHeight = getNoticeHeight(notice.width);
  const handleRadius = 22 / boardScale;
  const desiredX = handle === 'bottom' ? notice.width / 2 : notice.width;
  const desiredY = handle === 'right' ? noticeHeight / 2 : noticeHeight;
  const centerX = clampHandleCenter(notice.x + desiredX, handleRadius, boardWidth - handleRadius);
  const centerY = clampHandleCenter(notice.y + desiredY, handleRadius, boardHeight - handleRadius);
  return {
    left: centerX - notice.x,
    top: centerY - notice.y,
  };
}

function clampHandleCenter(value: number, minimum: number, maximum: number): number {
  if (minimum > maximum) return (minimum + maximum) / 2;
  return Math.min(Math.max(value, minimum), maximum);
}
