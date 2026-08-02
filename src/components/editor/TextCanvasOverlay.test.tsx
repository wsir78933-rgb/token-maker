// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';
import { TextCanvasOverlay } from './TextCanvasOverlay';

describe('TextCanvasOverlay', () => {
  beforeEach(() => {
    useEditorStore.getState().resetAll();
  });

  afterEach(() => {
    cleanup();
    useEditorStore.getState().resetAll();
  });

  it('passes blank-area pointer events through while keeping text interactive', () => {
    useEditorStore.setState({
      textBoxes: [
        {
          id: 'headline',
          content: 'Headline',
          x: 256,
          y: 256,
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
        },
      ],
    });

    const { container } = render(<TextCanvasOverlay />);
    const overlayRoot = container.firstElementChild;

    expect(overlayRoot?.className).toContain('pointer-events-none');
    expect(screen.getByText('Headline').className).toContain('pointer-events-auto');
  });

  it('moves only the selected text box after a pointer drag', () => {
    useEditorStore.setState({
      textBoxes: [
        {
          id: 'headline',
          content: 'Headline',
          x: 100,
          y: 200,
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
        },
        {
          id: 'caption',
          content: 'Caption',
          x: 300,
          y: 400,
          fontSize: 24,
          fontWeight: 400,
          color: '#000000',
          align: 'left',
        },
      ],
    });

    render(<TextCanvasOverlay previewScale={2} />);
    const headlineElement = screen.getByText('Headline');
    headlineElement.setPointerCapture = () => {};
    headlineElement.releasePointerCapture = () => {};

    fireEvent.pointerDown(headlineElement, { clientX: 160, clientY: 120, pointerId: 1 });
    fireEvent.pointerMove(headlineElement, { clientX: 200, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(headlineElement, { clientX: 200, clientY: 100, pointerId: 1 });

    expect(useEditorStore.getState().selectedTextId).toBe('headline');
    expect(useEditorStore.getState().textBoxes).toEqual([
      {
        id: 'headline',
        content: 'Headline',
        x: 120,
        y: 190,
        fontSize: 48,
        fontWeight: 700,
        color: '#ffffff',
        align: 'center',
      },
      {
        id: 'caption',
        content: 'Caption',
        x: 300,
        y: 400,
        fontSize: 24,
        fontWeight: 400,
        color: '#000000',
        align: 'left',
      },
    ]);
  });

  it('edits the double-clicked text box through the existing store update', () => {
    useEditorStore.setState({
      textBoxes: [
        {
          id: 'headline',
          content: 'Headline',
          x: 256,
          y: 256,
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
        },
      ],
    });

    render(<TextCanvasOverlay />);

    fireEvent.doubleClick(screen.getByText('Headline'));
    const textInput = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(textInput, { target: { value: 'Updated headline' } });

    expect(useEditorStore.getState().selectedTextId).toBe('headline');
    expect(textInput.value).toBe('Updated headline');
    expect(useEditorStore.getState().textBoxes).toEqual([
      {
        id: 'headline',
        content: 'Updated headline',
        x: 256,
        y: 256,
        fontSize: 48,
        fontWeight: 700,
        color: '#ffffff',
        align: 'center',
      },
    ]);
  });

  it('uses the selected catalog font family and supported weight in the DOM preview', () => {
    useEditorStore.setState({
      textBoxes: [
        {
          id: 'headline',
          content: '荣耀 Dragon',
          fontId: 'noto-serif-sc',
          x: 256,
          y: 256,
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
        },
      ],
    });

    render(<TextCanvasOverlay />);

    const textPreview = screen.getByText('荣耀 Dragon');

    expect(textPreview.style.fontFamily).toBe('"Noto Serif SC", serif');
    expect(textPreview.style.fontWeight).toBe('700');
  });

  it('uses the system sans font stack for legacy text without a font ID', () => {
    useEditorStore.setState({
      textBoxes: [
        {
          id: 'legacy',
          content: 'Legacy text',
          x: 256,
          y: 256,
          fontSize: 48,
          fontWeight: 400,
          color: '#ffffff',
          align: 'center',
        },
      ],
    });

    render(<TextCanvasOverlay />);

    expect(screen.getByText('Legacy text').style.fontFamily).toBe(
      'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
    );
  });
});
