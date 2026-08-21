// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import { DrawPanel } from './DrawPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

describe('DrawPanel', () => {
  beforeEach(() => {
    useCoatProjectStore.getState().setDrawingSettings({
      isActive: false,
      color: '#004E89',
      strokeWidth: 10,
      opacity: 1,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('presents drawing mode first, followed by size, colour, opacity, and a live preview', () => {
    const copy = getCoatWorkbenchCopy('en').panels;
    render(<DrawPanel locale="en" />);
    const panel = screen.getByRole('region', { name: copy.draw });
    const firstControl = panel.querySelector('button');

    expect(firstControl?.textContent).toContain(copy.enableDrawingMode);
    expect(firstControl?.getAttribute('aria-pressed')).toBe('false');
    const strokeWidthInput = screen.getByRole('slider', { name: copy.drawingStrokeWidth });
    expect(strokeWidthInput.getAttribute('min')).toBe('1');
    expect(strokeWidthInput.getAttribute('max')).toBe('100');
    expect((strokeWidthInput as HTMLInputElement).value).toBe('10');
    const opacityInput = screen.getByRole('slider', { name: copy.drawingOpacity });
    expect(opacityInput.getAttribute('min')).toBe('0');
    expect(opacityInput.getAttribute('max')).toBe('1');
    expect((opacityInput as HTMLInputElement).value).toBe('1');
    expect(screen.getByText(copy.previewStroke)).toBeDefined();
    expect(screen.getByRole('img', { name: copy.previewStroke }).classList.contains('coat-target-draw-preview')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: copy.enableDrawingMode }));
    fireEvent.change(screen.getByRole('slider', { name: copy.drawingStrokeWidth }), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(copy.drawingColour), { target: { value: '#112233' } });
    fireEvent.change(screen.getByRole('slider', { name: copy.drawingOpacity }), { target: { value: '0.35' } });

    expect(useCoatProjectStore.getState().drawingSettings).toEqual({
      isActive: true,
      color: '#112233',
      strokeWidth: 25,
      opacity: 0.35,
    });
    expect(within(panel).getByText('35%')).toBeDefined();
  });

  it('keeps the controls localized in Chinese', () => {
    const copy = getCoatWorkbenchCopy('zh').panels;
    render(<DrawPanel locale="zh" />);

    expect(screen.getByRole('button', { name: copy.enableDrawingMode })).toBeDefined();
    expect(screen.getByRole('slider', { name: copy.drawingOpacity })).toBeDefined();
    expect(screen.queryByText('Enable Drawing Mode')).toBeNull();
  });
});
