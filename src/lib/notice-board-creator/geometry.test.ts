import { describe, expect, it } from 'vitest';

import {
  clampNoticeToBoard,
  getBoardHeight,
  getNoticeHeight,
  moveNoticeWithinBoard,
  resizeNoticeProportionally,
} from '@/lib/notice-board-creator/geometry';
import { NoticeBoardValidationError, createBoardNotice } from '@/lib/notice-board-creator/project';
import type { BoardNotice } from '@/lib/notice-board-creator/types';

describe('notice board geometry', () => {
  it('uses the board background and paper aspect ratios without rounding notice dimensions', () => {
    expect(getBoardHeight(960)).toBe(679);
    expect(getBoardHeight(1696)).toBe(1200);
    expect(getNoticeHeight(347)).toBe(500);
    expect(getNoticeHeight(200)).toBeCloseTo((200 * 500) / 347);
  });

  it('clamps an oversized notice while keeping it inside the board and preserving its paper ratio', () => {
    const notice = {
      ...createBoardNotice('paper-01', 'oversized', 960),
      x: 0,
      y: 0,
      width: 2000,
    };
    const clampedNotice = clampNoticeToBoard(notice, 960);
    const boardHeight = getBoardHeight(960);
    const maximumFittingNoticeWidth = (boardHeight * 347) / 500;

    expect(clampedNotice.width).toBeCloseTo(maximumFittingNoticeWidth);
    expect(clampedNotice.x).toBeGreaterThanOrEqual(0);
    expect(clampedNotice.y).toBeGreaterThanOrEqual(0);
    expect(clampedNotice.x + clampedNotice.width).toBeLessThanOrEqual(960);
    expect(clampedNotice.y + getNoticeHeight(clampedNotice.width)).toBeLessThanOrEqual(boardHeight);
    expect(getNoticeHeight(clampedNotice.width)).toBeCloseTo(clampedNotice.width * (500 / 347));
    expect(notice.width).toBe(2000);
  });

  it('moves an in-range notice back inside the board without shrinking it', () => {
    const notice = {
      ...createBoardNotice('paper-01', 'position-boundary', 960),
      x: 900,
      y: 0,
    };
    const clampedNotice = clampNoticeToBoard(notice, 960);

    expect(clampedNotice.x).toBe(960 - notice.width);
    expect(clampedNotice.width).toBe(notice.width);
  });

  it('keeps the entire notice on the board when moving beyond each edge', () => {
    const notice = createBoardNotice('paper-02', 'move-boundary', 960);
    const rightBottomNotice = moveNoticeWithinBoard(notice, 10000, 10000, 960);
    const leftTopNotice = moveNoticeWithinBoard(rightBottomNotice, -10000, -10000, 960);

    expect(rightBottomNotice.x).toBe(960 - notice.width);
    expect(rightBottomNotice.y + getNoticeHeight(notice.width)).toBeCloseTo(getBoardHeight(960));
    expect(rightBottomNotice.width).toBe(notice.width);
    expect(leftTopNotice.x).toBe(0);
    expect(leftTopNotice.y).toBe(0);
    expect(notice.x).toBe(0);
    expect(notice.y).toBe(0);
  });

  it('resizes horizontally and vertically while preserving the paper ratio', () => {
    const notice = createBoardNotice('paper-03', 'resize-boundary', 960);
    const rightResizedNotice = resizeNoticeProportionally(notice, 40, 100, 'right', 960);
    const bottomResizedNotice = resizeNoticeProportionally(notice, 100, 50, 'bottom', 960);

    expect(rightResizedNotice.width).toBe(240);
    expect(bottomResizedNotice.width).toBeCloseTo(234.7);
    expect(getNoticeHeight(rightResizedNotice.width)).toBeCloseTo(rightResizedNotice.width * (500 / 347));
    expect(getNoticeHeight(bottomResizedNotice.width)).toBeCloseTo(bottomResizedNotice.width * (500 / 347));
  });

  it('uses the stronger corner delta and enforces minimum and board-edge width limits', () => {
    const notice = createBoardNotice('paper-04', 'corner-boundary', 960);
    const cornerResizedNotice = resizeNoticeProportionally(notice, 40, 100, 'corner', 960);
    const minimumWidthNotice = resizeNoticeProportionally(notice, -10000, 0, 'right', 960);
    const rightEdgeNotice = { ...notice, x: 700 };
    const boardEdgeResizedNotice = resizeNoticeProportionally(rightEdgeNotice, 10000, 0, 'right', 960);

    expect(cornerResizedNotice.width).toBeCloseTo(200 + 100 * (347 / 500));
    expect(minimumWidthNotice.width).toBe(80);
    expect(boardEdgeResizedNotice.width).toBe(960 - rightEdgeNotice.x);
  });

  it('reports a safe JSON summary for a malformed notice id', () => {
    const noticeWithObjectId = {
      ...createBoardNotice('paper-05', 'invalid-id', 960),
      id: { bad: 1 },
    } as unknown as BoardNotice;

    expect(() => moveNoticeWithinBoard(noticeWithObjectId, 0, 0, 960)).toThrow(
      NoticeBoardValidationError,
    );
    expect(() => moveNoticeWithinBoard(noticeWithObjectId, 0, 0, 960)).toThrow('{"bad":1}');
  });
});
