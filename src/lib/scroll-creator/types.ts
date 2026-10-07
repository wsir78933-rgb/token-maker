export type ScrollLocale = 'en' | 'zh';

export type ScrollTab = 'paper' | 'text' | 'images';

export type ScrollTextAlign = 'left' | 'center' | 'right';

export type ScrollTextStyle = {
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  align: ScrollTextAlign;
};

export type ScrollCustomFont = {
  family: string;
  stylesheetUrl: string;
};

export type ScrollImageGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScrollImage = ScrollImageGeometry & {
  id: string;
  url: string;
};

export type ScrollProject = {
  version: 1;
  paperId: string;
  width: number;
  height: number;
  text: string;
  textStyle: ScrollTextStyle;
  images: ScrollImage[];
  customFonts: ScrollCustomFont[];
};

export const SCROLL_DEFAULT_WIDTH = 600;
export const SCROLL_DEFAULT_HEIGHT = 865;
export const SCROLL_MIN_WIDTH = 160;
export const SCROLL_MAX_WIDTH = 2400;
export const SCROLL_MIN_HEIGHT = 160;
export const SCROLL_MAX_HEIGHT = 3600;
export const SCROLL_MIN_IMAGE_SIZE = 8;
export const SCROLL_MAX_IMAGE_SIZE = 2400;
export const SCROLL_MAX_IMAGE_POSITION = 20_000;
export const SCROLL_MAX_TEXT_LENGTH = 100_000;
export const SCROLL_MAX_PROJECT_JSON_BYTES = 1_048_576;
export const SCROLL_MAX_IMAGES = 50;
export const SCROLL_MAX_CUSTOM_FONTS = 24;
