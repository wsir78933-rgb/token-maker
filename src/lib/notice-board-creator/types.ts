export type NoticePaperId =
  | 'paper-01'
  | 'paper-02'
  | 'paper-03'
  | 'paper-04'
  | 'paper-05'
  | 'paper-06'
  | 'paper-07'
  | 'paper-08'
  | 'paper-09'
  | 'paper-10'
  | 'paper-11'
  | 'paper-12';

export type NoticePaperAsset = {
  id: NoticePaperId;
  src: string;
  width: number;
  height: number;
};

export type NoticeBoardBackgroundAsset = {
  src: string;
  width: number;
  height: number;
};

export type NoticeBoardFontOption = {
  label: string;
  family: string;
};

export type NoticeTextStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontStyle: 'normal' | 'italic' | 'bold' | 'bold-italic';
};

export type BoardNotice = {
  id: string;
  paperId: NoticePaperId;
  text: string;
  x: number;
  y: number;
  width: number;
  style: NoticeTextStyle;
};

export type NoticeBoardFont = {
  family: string;
  stylesheetUrl: string;
};

export type NoticeBoardProject = {
  version: 1;
  boardWidth: number;
  notices: BoardNotice[];
  customFonts: NoticeBoardFont[];
};

export type NoticeBoardSlotIndex = 1 | 2 | 3 | 4;

export type NoticeResizeHandle = 'right' | 'bottom' | 'corner';

export class NoticeBoardValidationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'NoticeBoardValidationError';
  }
}
