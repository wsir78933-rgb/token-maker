import type { CoatProjectCommand } from '@/lib/coat-of-arms/commands';
import type { CanvasTransform, TextPathPlacement } from '@/lib/coat-of-arms/types';

export const TEXT_CREATION_DRAG_MIME = 'application/x-coat-text-kind';

export type TextCreationCardKind = 'text' | 'curved' | 'ring';

export function isTextCreationCardKind(value: string): value is TextCreationCardKind {
  return value === 'text' || value === 'curved' || value === 'ring';
}

export function createTextCreationCommand(
  kind: TextCreationCardKind,
  text: string,
  transform?: CanvasTransform,
): Extract<CoatProjectCommand, { type: 'add-text-layer' }> {
  return {
    type: 'add-text-layer',
    text,
    color: '#111111',
    fontSize: 40,
    fontFamily: 'cardinal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    alignment: 'center',
    path: toTextPathPlacement(kind),
    ...(transform ? { transform } : {}),
  };
}

function toTextPathPlacement(kind: TextCreationCardKind): TextPathPlacement {
  if (kind === 'text') return { mode: 'none' };
  if (kind === 'curved') return { mode: 'curve', curve: 'upper' };
  return { mode: 'ring', curve: 'clockwise' };
}
