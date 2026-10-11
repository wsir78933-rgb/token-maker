import {
  isNoticePaperId,
  NOTICE_BOARD_BACKGROUND_HEIGHT,
  NOTICE_BOARD_BACKGROUND_WIDTH,
  NOTICE_BOARD_MAX_WIDTH,
  NOTICE_BOARD_MIN_WIDTH,
  NOTICE_MIN_WIDTH,
  NOTICE_PAPER_HEIGHT,
  NOTICE_PAPER_WIDTH,
} from './catalog';
import { NoticeBoardValidationError, type BoardNotice, type NoticeResizeHandle } from './types';

const NOTICE_WIDTH_TO_HEIGHT_RATIO = NOTICE_PAPER_HEIGHT / NOTICE_PAPER_WIDTH;
const NOTICE_HEIGHT_TO_WIDTH_RATIO = NOTICE_PAPER_WIDTH / NOTICE_PAPER_HEIGHT;

export function getBoardHeight(width: number): number {
  requireBoardWidth(width, 'board width');
  return Math.floor((width * NOTICE_BOARD_BACKGROUND_HEIGHT) / NOTICE_BOARD_BACKGROUND_WIDTH);
}

export function getNoticeHeight(width: number): number {
  requireFiniteNumber(width, 'notice width');
  if (width <= 0 || width > NOTICE_BOARD_MAX_WIDTH) {
    throw new NoticeBoardValidationError(
      'notice width must be greater than 0 and at most ' +
        NOTICE_BOARD_MAX_WIDTH +
        '; received ' +
        describeNoticeValue(width),
    );
  }

  return width * NOTICE_WIDTH_TO_HEIGHT_RATIO;
}

export function clampNoticeToBoard(notice: BoardNotice, boardWidth: number): BoardNotice {
  requireBoardWidth(boardWidth, 'board width');
  requireNoticeGeometry(notice);

  const boardHeight = getBoardHeight(boardWidth);
  const maxBoardFitWidth = Math.max(
    NOTICE_MIN_WIDTH,
    Math.min(boardWidth, boardHeight * NOTICE_HEIGHT_TO_WIDTH_RATIO),
  );
  const width = clampNumber(notice.width, NOTICE_MIN_WIDTH, maxBoardFitWidth);
  const boundedX = clampNumber(notice.x, 0, boardWidth - width);
  const boundedY = clampNumber(notice.y, 0, boardHeight - getNoticeHeight(width));

  return {
    id: notice.id,
    paperId: notice.paperId,
    text: notice.text,
    x: boundedX,
    y: boundedY,
    width,
    style: { ...notice.style },
  };
}

export function moveNoticeWithinBoard(
  notice: BoardNotice,
  deltaX: number,
  deltaY: number,
  boardWidth: number,
): BoardNotice {
  requireFiniteNumber(deltaX, 'horizontal move delta');
  requireFiniteNumber(deltaY, 'vertical move delta');
  const boundedNotice = clampNoticeToBoard(notice, boardWidth);
  const boardHeight = getBoardHeight(boardWidth);
  const maxLeft = boardWidth - boundedNotice.width;
  const maxTop = boardHeight - getNoticeHeight(boundedNotice.width);

  return {
    ...boundedNotice,
    x: clampNumber(boundedNotice.x + deltaX, 0, maxLeft),
    y: clampNumber(boundedNotice.y + deltaY, 0, maxTop),
  };
}

export function resizeNoticeProportionally(
  notice: BoardNotice,
  deltaX: number,
  deltaY: number,
  handle: NoticeResizeHandle,
  boardWidth: number,
): BoardNotice {
  requireFiniteNumber(deltaX, 'horizontal resize delta');
  requireFiniteNumber(deltaY, 'vertical resize delta');
  requireResizeHandle(handle);

  const boundedNotice = clampNoticeToBoard(notice, boardWidth);
  const scaledVerticalDelta = deltaY * NOTICE_HEIGHT_TO_WIDTH_RATIO;
  let widthDelta: number;

  if (handle === 'right') {
    widthDelta = deltaX;
  } else if (handle === 'bottom') {
    widthDelta = scaledVerticalDelta;
  } else if (Math.abs(deltaX) >= Math.abs(scaledVerticalDelta)) {
    widthDelta = deltaX;
  } else {
    widthDelta = scaledVerticalDelta;
  }

  const boardHeight = getBoardHeight(boardWidth);
  const maxWidth = Math.max(
    NOTICE_MIN_WIDTH,
    Math.min(
      boardWidth - boundedNotice.x,
      (boardHeight - boundedNotice.y) * NOTICE_HEIGHT_TO_WIDTH_RATIO,
    ),
  );
  const width = clampNumber(
    boundedNotice.width + widthDelta,
    NOTICE_MIN_WIDTH,
    maxWidth,
  );

  return {
    ...boundedNotice,
    width,
  };
}

function requireBoardWidth(width: number, path: string): void {
  requireFiniteNumber(width, path);
  if (!Number.isInteger(width) || width < NOTICE_BOARD_MIN_WIDTH || width > NOTICE_BOARD_MAX_WIDTH) {
    throw new NoticeBoardValidationError(
      path +
        ' must be an integer from ' +
        NOTICE_BOARD_MIN_WIDTH +
        ' to ' +
        NOTICE_BOARD_MAX_WIDTH +
        '; received ' +
        describeNoticeValue(width),
    );
  }
}

function requireNoticeGeometry(notice: BoardNotice): void {
  if (notice === null || typeof notice !== 'object' || Array.isArray(notice)) {
    throw new NoticeBoardValidationError(
      'notice must be an object; received ' + describeNoticeValue(notice),
    );
  }

  if (typeof notice.id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(notice.id)) {
    throw new NoticeBoardValidationError(
      'notice.id must match [A-Za-z0-9_-]{1,100}; received ' + describeNoticeValue(notice.id),
    );
  }
  if (!isNoticePaperId(notice.paperId)) {
    throw new NoticeBoardValidationError(
      'notice.paperId must be a catalog paper id; received ' + describeNoticeValue(notice.paperId),
    );
  }
  if (typeof notice.text !== 'string') {
    throw new NoticeBoardValidationError(
      'notice.text must be a string; received ' + describeNoticeValue(notice.text),
    );
  }
  if (
    notice.style === null ||
    typeof notice.style !== 'object' ||
    Array.isArray(notice.style)
  ) {
    throw new NoticeBoardValidationError(
      'notice.style must be an object; received ' + describeNoticeValue(notice.style),
    );
  }

  requireFiniteNumber(notice.x, 'notice.x');
  requireFiniteNumber(notice.y, 'notice.y');
  requireFiniteNumber(notice.width, 'notice.width');
}

function requireResizeHandle(handle: NoticeResizeHandle): void {
  if (handle !== 'right' && handle !== 'bottom' && handle !== 'corner') {
    throw new NoticeBoardValidationError(
      'resize handle must be right, bottom, or corner; received ' +
        describeNoticeValue(handle),
    );
  }
}

function requireFiniteNumber(value: number, path: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new NoticeBoardValidationError(
      path + ' must be a finite number; received ' + describeNoticeValue(value),
    );
  }
}

function clampNumber(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function describeNoticeValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'object') {
    const seenValues = new WeakSet<object>();
    const serializedValue = JSON.stringify(value, (_propertyName, nestedValue: unknown) => {
      if (typeof nestedValue === 'bigint') return nestedValue.toString() + 'n';
      if (nestedValue !== null && typeof nestedValue === 'object') {
        if (seenValues.has(nestedValue)) return '[Circular]';
        seenValues.add(nestedValue);
      }
      return nestedValue;
    });
    if (serializedValue === undefined) return Object.prototype.toString.call(value);
    if (serializedValue.length <= 240) return serializedValue;
    return serializedValue.slice(0, 237) + '...';
  }

  return Object.prototype.toString.call(value);
}
