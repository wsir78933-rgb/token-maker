import type { CoatProjectCommand } from '@/lib/coat-of-arms/commands';
import type { CanvasTransform, TextPathPlacement } from '@/lib/coat-of-arms/types';

export const TEXT_CREATION_DRAG_MIME = 'application/x-coat-text-kind';

export type TextCreationCardKind = 'text' | 'curved' | 'ring';

/** Matches scene-svg: UI fontSize 40 renders at ~5.7 scene units. */
const SCENE_FONT_SIZE_DIVISOR = 7;
/** Average Latin glyph width in ems; "Double-click to edit" at size 40 → 57 scene units. */
const LATIN_GLYPH_WIDTH_EMS = 0.5;
const MIN_TEXT_BOX_WIDTH = 8;
const MAX_TEXT_BOX_WIDTH = 100;
const STRAIGHT_TEXT_FONT_SIZE = 40;
const PATH_TEXT_FONT_SIZE = 50;
/** Must stay in lockstep with scene-svg's straight `<text y="102">`. */
export const STRAIGHT_TEXT_SVG_BASELINE_Y = 102;
/** Shield-center Y in the 100×110 scene. */
const STRAIGHT_TEXT_DEFAULT_CENTER_Y = 55;

export function isTextCreationCardKind(value: string): value is TextCreationCardKind {
  return value === 'text' || value === 'curved' || value === 'ring';
}

export function createTextCreationCommand(
  kind: TextCreationCardKind,
  text: string,
  transform?: CanvasTransform,
): Extract<CoatProjectCommand, { type: 'add-text-layer' }> {
  const fontSize = kind === 'text' ? STRAIGHT_TEXT_FONT_SIZE : PATH_TEXT_FONT_SIZE;
  const resolvedTransform = transform ?? (kind === 'text' ? createStraightTextDefaultTransform() : undefined);
  return {
    type: 'add-text-layer',
    text,
    color: '#111111',
    fontSize,
    fontFamily: 'cardinal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    alignment: 'center',
    path: toTextPathPlacement(kind),
    ...(kind === 'text' ? { boxWidth: defaultStraightTextBoxWidth(text, fontSize) } : {}),
    ...(resolvedTransform ? { transform: resolvedTransform } : {}),
  };
}

function createStraightTextDefaultTransform(): CanvasTransform {
  return {
    x: 0,
    y: STRAIGHT_TEXT_DEFAULT_CENTER_Y - STRAIGHT_TEXT_SVG_BASELINE_Y,
    scale: 1,
    rotation: 0,
  };
}

export function defaultStraightTextBoxWidth(text: string, fontSize: number): number {
  if (typeof text !== 'string' || text.length === 0) {
    throw new Error(`Invalid default text for box width: ${JSON.stringify(text)}`);
  }
  if (typeof fontSize !== 'number' || !Number.isInteger(fontSize) || fontSize < 8 || fontSize > 200) {
    throw new Error(`Invalid font size for box width: ${String(fontSize)}`);
  }
  let glyphEms = 0;
  for (const glyph of text) {
    const codePoint = glyph.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error(`Invalid default text glyph in ${JSON.stringify(text)}`);
    }
    glyphEms += codePoint > 0xff ? 1 : LATIN_GLYPH_WIDTH_EMS;
  }
  const boxWidth = Math.round((fontSize / SCENE_FONT_SIZE_DIVISOR) * glyphEms);
  if (boxWidth < MIN_TEXT_BOX_WIDTH || boxWidth > MAX_TEXT_BOX_WIDTH) {
    throw new Error(`Default straight text box width is ${boxWidth} for text ${JSON.stringify(text)}; expected ${MIN_TEXT_BOX_WIDTH}-${MAX_TEXT_BOX_WIDTH} scene units`);
  }
  return boxWidth;
}

function toTextPathPlacement(kind: TextCreationCardKind): TextPathPlacement {
  if (kind === 'text') return { mode: 'none' };
  if (kind === 'curved') {
    return {
      mode: 'curve',
      startX: 28,
      startY: 38,
      controlX: 50,
      controlY: 8,
      endX: 72,
      endY: 38,
    };
  }
  return {
    mode: 'ring',
    radius: 18,
    facing: 'in',
    layout: 'arc',
    spacing: 'natural',
  };
}
