import type {
  NoticeBoardBackgroundAsset,
  NoticeBoardFontOption,
  NoticePaperAsset,
  NoticePaperId,
} from './types';

export const NOTICE_PAPER_WIDTH = 347;
export const NOTICE_PAPER_HEIGHT = 500;
export const NOTICE_BOARD_BACKGROUND_WIDTH = 1696;
export const NOTICE_BOARD_BACKGROUND_HEIGHT = 1200;
export const NOTICE_BOARD_DEFAULT_WIDTH = 960;
export const NOTICE_BOARD_MIN_WIDTH = 320;
export const NOTICE_BOARD_MAX_WIDTH = 4096;
export const NOTICE_MIN_WIDTH = 80;

export const NOTICE_PAPER_ASSETS = [
  { id: 'paper-01', src: '/notice-board-creator/papers/paper-01.svg', width: 347, height: 500 },
  { id: 'paper-02', src: '/notice-board-creator/papers/paper-02.svg', width: 347, height: 500 },
  { id: 'paper-03', src: '/notice-board-creator/papers/paper-03.svg', width: 347, height: 500 },
  { id: 'paper-04', src: '/notice-board-creator/papers/paper-04.svg', width: 347, height: 500 },
  { id: 'paper-05', src: '/notice-board-creator/papers/paper-05.svg', width: 347, height: 500 },
  { id: 'paper-06', src: '/notice-board-creator/papers/paper-06.svg', width: 347, height: 500 },
  { id: 'paper-07', src: '/notice-board-creator/papers/paper-07.svg', width: 347, height: 500 },
  { id: 'paper-08', src: '/notice-board-creator/papers/paper-08.svg', width: 347, height: 500 },
  { id: 'paper-09', src: '/notice-board-creator/papers/paper-09.svg', width: 347, height: 500 },
  { id: 'paper-10', src: '/notice-board-creator/papers/paper-10.svg', width: 347, height: 500 },
  { id: 'paper-11', src: '/notice-board-creator/papers/paper-11.svg', width: 347, height: 500 },
  { id: 'paper-12', src: '/notice-board-creator/papers/paper-12.svg', width: 347, height: 500 },
] as const satisfies readonly NoticePaperAsset[];

export const NOTICE_BOARD_BACKGROUND: NoticeBoardBackgroundAsset = {
  src: '/notice-board-creator/board.svg',
  width: NOTICE_BOARD_BACKGROUND_WIDTH,
  height: NOTICE_BOARD_BACKGROUND_HEIGHT,
};

export const NOTICE_BOARD_FONTS = [
  { label: 'Trebuchet', family: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
  { label: 'Courier New', family: 'Courier New, Courier, monospace' },
  { label: 'Lucida', family: 'Lucida Console, Monaco, monospace' },
  { label: 'Impact', family: 'Impact, Charcoal, sans-serif' },
  { label: 'Comic Sans', family: 'Comic Sans MS, cursive, sans-serif' },
  { label: 'Arial Black', family: 'Arial Black, Gadget, sans-serif' },
  { label: 'Times New Roman', family: 'Times New Roman, Times, serif' },
] as const satisfies readonly NoticeBoardFontOption[];

export function isNoticePaperId(value: unknown): value is NoticePaperId {
  return (
    typeof value === 'string' &&
    NOTICE_PAPER_ASSETS.some((paperAsset) => paperAsset.id === value)
  );
}
