import { describe, expect, it, vi } from 'vitest';

import type { TextBox } from '@/types/editor';
import { drawTextBoxes } from './text';

function createTextBox(overrides: Partial<TextBox>): TextBox {
  return {
    id: 'caption',
    content: 'Token Maker',
    x: 256,
    y: 256,
    fontSize: 32,
    fontWeight: 400,
    color: '#ffffff',
    align: 'center',
    ...overrides,
  };
}

function createCanvasContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    strokeText: vi.fn(),
    fillText: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

describe('drawTextBoxes', () => {
  it('uses the selected Noto Serif family for Canvas text', () => {
    const canvasContext = createCanvasContext();

    drawTextBoxes(
      canvasContext,
      [createTextBox({ fontId: 'noto-serif-sc', fontWeight: 700 })],
      512,
    );

    expect(canvasContext.font).toBe('700 32px "Noto Serif SC", serif');
  });

  it('uses the regular weight for 400-only art fonts', () => {
    const canvasContext = createCanvasContext();

    drawTextBoxes(
      canvasContext,
      [createTextBox({ fontId: 'zhi-mang-xing', fontWeight: 700 })],
      512,
    );

    expect(canvasContext.font).toBe('400 32px "Zhi Mang Xing", "Noto Serif SC", serif');
  });

  it('keeps the system sans-serif fallback for text boxes stored before font selection', () => {
    const canvasContext = createCanvasContext();

    drawTextBoxes(canvasContext, [createTextBox({ fontId: undefined })], 512);

    expect(canvasContext.font).toContain('sans-serif');
  });
});
