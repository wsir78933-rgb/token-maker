// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getScrollCreatorCopy } from '@/lib/scroll-creator/copy';
import { createDefaultScrollProject } from '@/lib/scroll-creator/project';
import type { ScrollImage, ScrollProject } from '@/lib/scroll-creator/types';

import { ScrollCanvas, type ScrollCanvasProps } from './ScrollCanvas';

const copy = getScrollCreatorCopy('en');

function makeProject(images: ScrollImage[] = []): ScrollProject {
  return {
    ...createDefaultScrollProject(),
    images,
  };
}

function renderCanvas(overrides: Partial<ScrollCanvasProps> = {}) {
  const project = overrides.project ?? makeProject();
  const props: ScrollCanvasProps = {
    project,
    copy,
    paperResizing: false,
    imagesVisible: true,
    imagesDraggable: true,
    imagesResizable: true,
    selectedImageIds: [],
    onTextChange: vi.fn(),
    onTextOverflowChange: vi.fn(),
    onPaperSizeChange: vi.fn(),
    onImageGeometryChange: vi.fn(),
    onImageSelectionChange: vi.fn(),
    ...overrides,
  };
  return { ...render(<ScrollCanvas {...props} />), props };
}

function stubPointerCapture(element: HTMLElement): void {
  element.setPointerCapture = vi.fn();
  element.hasPointerCapture = vi.fn(() => true);
  element.releasePointerCapture = vi.fn();
}

function stubPaperRectangle(element: HTMLElement): void {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 600,
    bottom: 865,
    width: 600,
    height: 865,
    toJSON: () => ({}),
  });
}

function stubViewportMeasurement(
  element: HTMLElement,
  clientWidth: number,
  clientHeight: number,
  rectangleWidth = clientWidth,
  rectangleHeight = clientHeight,
): void {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: clientWidth });
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: clientHeight });
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: rectangleWidth,
    bottom: rectangleHeight,
    width: rectangleWidth,
    height: rectangleHeight,
    toJSON: () => ({}),
  });
}

function stubTextMeasurement(element: HTMLElement, clientHeight: number, scrollHeight: number): void {
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: clientHeight });
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: scrollHeight });
}

describe('ScrollCanvas', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('keeps pasted content as plain multiline text and reports it to the workbench', () => {
    const onTextChange = vi.fn();
    renderCanvas({ onTextChange });
    const editableText = screen.getByRole('textbox');

    fireEvent.paste(editableText, {
      clipboardData: {
        getData: () => '<strong>Notice</strong>\nSecond line',
      },
    });

    expect(onTextChange).toHaveBeenCalledWith('<strong>Notice</strong>\nSecond line');
    expect(editableText.textContent).toBe('<strong>Notice</strong>\nSecond line');
    expect(editableText.querySelector('strong')).toBeNull();
    expect(editableText.querySelector('br')).toBeNull();
  });

  it('preserves an intentional trailing line break and keeps the DOM through a parent text update', () => {
    const onTextChange = vi.fn();
    const initialProject = makeProject();
    const view = renderCanvas({ project: initialProject, onTextChange });
    const editableText = screen.getByRole('textbox');

    fireEvent.paste(editableText, {
      clipboardData: {
        getData: () => 'First line\n',
      },
    });

    expect(onTextChange).toHaveBeenLastCalledWith('First line\n');
    const updatedProject = { ...initialProject, text: 'First line\n' };
    view.rerender(<ScrollCanvas {...view.props} project={updatedProject} />);

    expect(screen.getByRole('textbox').textContent).toBe('First line\n');
    expect(screen.getByRole('textbox').querySelector('br')).toBeNull();
  });

  it('restores multiline text from a loaded project as plain text', () => {
    const loadedProject = makeProject();
    loadedProject.text = 'First line\nSecond line';
    renderCanvas({ project: loadedProject });

    const editableText = screen.getByRole('textbox');
    expect(editableText.getAttribute('contenteditable')).toBe('plaintext-only');
    expect(editableText.textContent).toBe('First line\nSecond line');
    expect(editableText.querySelector('*')).toBeNull();
  });

  it('reports loaded text overflow and clears it after the text area gets more logical height', () => {
    const onTextOverflowChange = vi.fn();
    const initialProject = makeProject();
    const view = renderCanvas({ project: initialProject, onTextOverflowChange });
    const editableText = screen.getByRole('textbox');
    const paperFrame = editableText.parentElement?.parentElement?.parentElement;
    const viewport = editableText.closest('[data-scroll-canvas-viewport]');
    if (!(paperFrame instanceof HTMLElement) || !(viewport instanceof HTMLElement)) {
      throw new Error('Missing paper frame for text overflow test.');
    }
    stubTextMeasurement(editableText, 100, 140);

    const loadedProject = { ...initialProject, text: 'A long loaded message.' };
    view.rerender(<ScrollCanvas {...view.props} project={loadedProject} />);

    expect(editableText.textContent).toBe(loadedProject.text);
    expect(viewport.getAttribute('data-scroll-text-overflow')).toBe('true');
    expect(viewport.getAttribute('data-print-overflow-message')).toBe(copy.printOverflowBlocked);
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(true);
    expect(paperFrame.style.width).toBe('600px');
    expect(paperFrame.style.height).toBe('865px');

    stubTextMeasurement(editableText, 140, 140);
    const resizedProject = { ...loadedProject, width: 720 };
    view.rerender(<ScrollCanvas {...view.props} project={resizedProject} />);

    expect(viewport.getAttribute('data-scroll-text-overflow')).toBe('false');
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(false);
  });

  it('rechecks text overflow for input, paste, IME completion, and text area resize', () => {
    const onTextOverflowChange = vi.fn();
    const resizeObservers: Array<{ trigger: () => void }> = [];
    class TestResizeObserver {
      private readonly callback: () => void;

      constructor(callback: () => void) {
        this.callback = callback;
        resizeObservers.push({ trigger: () => this.callback() });
      }

      observe(): void {}

      disconnect(): void {}
    }
    vi.stubGlobal('ResizeObserver', TestResizeObserver);

    renderCanvas({ onTextOverflowChange });
    const editableText = screen.getByRole('textbox');
    stubTextMeasurement(editableText, 100, 140);
    editableText.textContent = 'First line';
    fireEvent.input(editableText);
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(true);

    fireEvent.paste(editableText, {
      clipboardData: {
        getData: () => 'Second line',
      },
    });
    expect(editableText.textContent).toContain('Second line');

    stubTextMeasurement(editableText, 140, 140);
    fireEvent.compositionStart(editableText);
    editableText.textContent = '输入中';
    fireEvent.input(editableText);
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(true);
    fireEvent.compositionEnd(editableText);
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(false);

    stubTextMeasurement(editableText, 100, 140);
    const textAreaResizeObserver = resizeObservers.at(-1);
    if (!textAreaResizeObserver) {
      throw new Error('Missing text area ResizeObserver.');
    }
    textAreaResizeObserver.trigger();
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(true);
  });

  it('preserves known overflow through print zero measurements and remeasures after screen restore', () => {
    let printMediaActive = false;
    vi.stubGlobal('matchMedia', (mediaQuery: string) => {
      if (mediaQuery !== 'print') {
        throw new Error(`Unexpected media query in print overflow test: ${mediaQuery}`);
      }
      return { matches: printMediaActive };
    });
    const onTextOverflowChange = vi.fn();
    const view = renderCanvas({ onTextOverflowChange });
    const editableText = screen.getByRole('textbox');
    const viewport = editableText.closest('[data-scroll-canvas-viewport]');
    if (!(viewport instanceof HTMLElement)) {
      throw new Error('Missing canvas viewport for print overflow test.');
    }

    stubTextMeasurement(editableText, 100, 140);
    editableText.textContent = 'Long text';
    fireEvent.input(editableText);
    expect(viewport.getAttribute('data-scroll-text-overflow')).toBe('true');

    printMediaActive = true;
    stubTextMeasurement(editableText, 0, 0);
    fireEvent.input(editableText);
    expect(viewport.getAttribute('data-scroll-text-overflow')).toBe('true');
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(true);

    printMediaActive = false;
    stubTextMeasurement(editableText, 120, 120);
    view.rerender(
      <ScrollCanvas
        {...view.props}
        project={{ ...view.props.project, width: 720 }}
      />,
    );

    expect(viewport.getAttribute('data-scroll-text-overflow')).toBe('false');
    expect(onTextOverflowChange).toHaveBeenLastCalledWith(false);
  });

  it('adds and removes images with ordinary clicks while image dragging is disabled', () => {
    const images: ScrollImage[] = [
      { id: 'one', url: 'https://example.com/one.png', x: 20, y: 20, width: 100, height: 80 },
      { id: 'two', url: 'https://example.com/two.png', x: 140, y: 20, width: 100, height: 80 },
    ];
    const onImageSelectionChange = vi.fn();
    const firstRender = renderCanvas({
      project: makeProject(images),
      imagesDraggable: false,
      onImageSelectionChange,
    });

    fireEvent.pointerDown(screen.getByLabelText(`${copy.imageLabel} #1`), { button: 0 });
    expect(onImageSelectionChange).toHaveBeenLastCalledWith(['one']);
    firstRender.rerender(
      <ScrollCanvas
        {...firstRender.props}
        selectedImageIds={['one']}
      />,
    );
    fireEvent.pointerDown(screen.getByLabelText(`${copy.imageLabel} #2`), { button: 0 });
    expect(onImageSelectionChange).toHaveBeenLastCalledWith(['one', 'two']);
    firstRender.rerender(
      <ScrollCanvas
        {...firstRender.props}
        selectedImageIds={['one', 'two']}
      />,
    );
    fireEvent.pointerDown(screen.getByLabelText(`${copy.imageLabel} #1`), { button: 0 });
    expect(onImageSelectionChange).toHaveBeenLastCalledWith(['two']);
  });

  it('keeps drag and resize as independent image controls', () => {
    const image: ScrollImage = { id: 'one', url: 'https://example.com/one.png', x: 20, y: 30, width: 100, height: 80 };
    const onImageGeometryChange = vi.fn();
    const { props } = renderCanvas({
      project: makeProject([image]),
      selectedImageIds: ['one'],
      imagesDraggable: false,
      imagesResizable: false,
      onImageGeometryChange,
    });
    const paper = screen.getByLabelText(copy.previewTitle);
    const imageLayer = screen.getByLabelText(`${copy.imageLabel} #1`);
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    expect(screen.queryByRole('button', { name: copy.resizeImage })).toBeNull();
    fireEvent.pointerDown(imageLayer, { button: 0, pointerId: 1, clientX: 40, clientY: 50 });
    expect(onImageGeometryChange).not.toHaveBeenCalled();
    expect(props.imagesDraggable).toBe(false);
  });

  it('moves a selected image in logical paper coordinates', () => {
    const image: ScrollImage = { id: 'one', url: 'https://example.com/one.png', x: 20, y: 30, width: 100, height: 80 };
    const onImageGeometryChange = vi.fn();
    renderCanvas({
      project: makeProject([image]),
      selectedImageIds: ['one'],
      onImageGeometryChange,
    });
    const paper = screen.getByLabelText(copy.previewTitle);
    const imageLayer = screen.getByLabelText(`${copy.imageLabel} #1`);
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    fireEvent.pointerDown(imageLayer, { button: 0, pointerId: 1, clientX: 40, clientY: 50 });
    fireEvent.pointerMove(paper, { pointerId: 1, clientX: 100, clientY: 100 });

    expect(onImageGeometryChange).toHaveBeenLastCalledWith('one', {
      x: 80,
      y: 80,
      width: 100,
      height: 80,
    });
  });

  it('resizes a selected image from its handle with width and height deltas', () => {
    const image: ScrollImage = { id: 'one', url: 'https://example.com/one.png', x: 20, y: 30, width: 100, height: 80 };
    const onImageGeometryChange = vi.fn();
    renderCanvas({
      project: makeProject([image]),
      selectedImageIds: ['one'],
      onImageGeometryChange,
    });
    const paper = screen.getByLabelText(copy.previewTitle);
    const resizeHandle = document.querySelector('[data-image-resize-corner="south-east"]');
    if (!(resizeHandle instanceof HTMLElement)) {
      throw new Error('Missing south-east image resize handle.');
    }
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    fireEvent.pointerDown(resizeHandle, { button: 0, pointerId: 2, clientX: 120, clientY: 110 });
    fireEvent.pointerMove(paper, { pointerId: 2, clientX: 180, clientY: 160 });

    expect(onImageGeometryChange).toHaveBeenLastCalledWith('one', {
      x: 20,
      y: 30,
      width: 160,
      height: 130,
    });
  });

  it('resizes only the targeted image when several images are selected', () => {
    const images: ScrollImage[] = [
      { id: 'one', url: 'https://example.com/one.png', x: 20, y: 30, width: 100, height: 80 },
      { id: 'two', url: 'https://example.com/two.png', x: 180, y: 30, width: 90, height: 70 },
    ];
    const onImageGeometryChange = vi.fn();
    const { container } = renderCanvas({
      project: makeProject(images),
      selectedImageIds: ['one', 'two'],
      onImageGeometryChange,
    });
    const paper = screen.getByLabelText(copy.previewTitle);
    const resizeHandle = document.querySelector('[data-image-resize-handle="one"][data-image-resize-corner="south-east"]');
    if (!(resizeHandle instanceof HTMLElement)) {
      throw new Error('Missing south-east image resize handle for selected image.');
    }
    const imageLayers = container.querySelector('[data-scroll-image-layers]');
    if (!(imageLayers instanceof HTMLElement) || resizeHandle.parentElement?.parentElement !== imageLayers) {
      throw new Error('Selected image handles must share one stacking container.');
    }
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    fireEvent.pointerDown(resizeHandle, { button: 0, pointerId: 4, clientX: 120, clientY: 110 });
    fireEvent.pointerMove(paper, { pointerId: 4, clientX: 180, clientY: 160 });

    expect(onImageGeometryChange).toHaveBeenLastCalledWith('one', {
      x: 20,
      y: 30,
      width: 160,
      height: 130,
    });
    expect(onImageGeometryChange).not.toHaveBeenCalledWith('two', expect.anything());
  });

  it('keeps the opposite image corner anchored for all four resize handles', () => {
    const image: ScrollImage = { id: 'one', url: 'https://example.com/one.png', x: 20, y: 30, width: 100, height: 80 };
    const onImageGeometryChange = vi.fn();
    const { container } = renderCanvas({
      project: makeProject([image]),
      selectedImageIds: ['one'],
      onImageGeometryChange,
    });
    const paper = screen.getByLabelText(copy.previewTitle);
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    const expectedGeometryByCorner = {
      'north-west': { x: 80, y: 80, width: 40, height: 30 },
      'north-east': { x: 20, y: 80, width: 160, height: 30 },
      'south-west': { x: 80, y: 30, width: 40, height: 130 },
      'south-east': { x: 20, y: 30, width: 160, height: 130 },
    } as const;
    for (const [index, corner] of (['north-west', 'north-east', 'south-west', 'south-east'] as const).entries()) {
      const resizeHandle = container.querySelector(`[data-image-resize-handle="one"][data-image-resize-corner="${corner}"]`);
      if (!(resizeHandle instanceof HTMLElement)) {
        throw new Error(`Missing ${corner} image resize handle.`);
      }
      const pointerId = 10 + index;
      fireEvent.pointerDown(resizeHandle, { button: 0, pointerId, clientX: 120, clientY: 110 });
      fireEvent.pointerMove(paper, { pointerId, clientX: 180, clientY: 160 });
      fireEvent.pointerUp(paper, { pointerId });
      expect(onImageGeometryChange).toHaveBeenLastCalledWith('one', expectedGeometryByCorner[corner]);
    }
  });

  it('does not toggle image selection when Enter bubbles from a resize handle', () => {
    const image: ScrollImage = { id: 'secret-id', url: 'https://example.com/one.png', x: 20, y: 30, width: 100, height: 80 };
    const onImageSelectionChange = vi.fn();
    renderCanvas({
      project: makeProject([image]),
      selectedImageIds: ['secret-id'],
      onImageSelectionChange,
    });
    const resizeHandle = document.querySelector('[data-image-resize-handle="secret-id"][data-image-resize-corner="south-east"]');
    if (!(resizeHandle instanceof HTMLElement)) {
      throw new Error('Missing south-east image resize handle for keyboard test.');
    }
    fireEvent.keyDown(resizeHandle, { key: 'Enter' });

    expect(onImageSelectionChange).not.toHaveBeenCalled();
  });

  it('shows a friendly image number and URL when an image fails to load', () => {
    const image: ScrollImage = { id: 'secret-id', url: 'https://example.com/missing.png', x: 20, y: 30, width: 100, height: 80 };
    const { container } = renderCanvas({ project: makeProject([image]) });
    const imageElement = container.querySelector('img');
    if (!imageElement) {
      throw new Error('Missing image element for load failure test.');
    }
    fireEvent.error(imageElement);

    const alertText = screen.getByRole('alert').textContent ?? '';
    expect(alertText).toContain(`${copy.imageLabel} #1`);
    expect(alertText).toContain(image.url);
    expect(alertText).not.toContain(image.id);
  });

  it('resizes paper only along the enabled handle axis', () => {
    const onPaperSizeChange = vi.fn();
    renderCanvas({ paperResizing: true, onPaperSizeChange });
    const paper = screen.getByLabelText(copy.previewTitle);
    const eastHandle = screen.getByRole('button', { name: copy.resizePaperEast });
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    fireEvent.pointerDown(eastHandle, { button: 0, pointerId: 3, clientX: 600, clientY: 400 });
    fireEvent.pointerMove(paper, { pointerId: 3, clientX: 660, clientY: 460 });

    expect(onPaperSizeChange).toHaveBeenLastCalledWith(660, 865);
  });

  it('keeps the paper scale and west anchor stable during a rerender, then fits after release', () => {
    let currentProject = makeProject();
    let canvasView: ReturnType<typeof renderCanvas> | null = null;
    const onPaperSizeChange = vi.fn((width: number, height: number) => {
      currentProject = { ...currentProject, width, height };
      if (!canvasView) {
        throw new Error('Paper resize callback ran before the canvas was rendered.');
      }
      canvasView.rerender(
        <ScrollCanvas
          {...canvasView.props}
          project={currentProject}
          onPaperSizeChange={onPaperSizeChange}
        />,
      );
    });
    canvasView = renderCanvas({ project: currentProject, paperResizing: true, onPaperSizeChange });

    const viewport = canvasView.container.querySelector('[data-scroll-canvas-viewport]');
    const paper = screen.getByLabelText(copy.previewTitle);
    const eastHandle = screen.getByRole('button', { name: copy.resizePaperEast });
    if (!(viewport instanceof HTMLElement)) {
      throw new Error('Missing scroll canvas viewport for scale test.');
    }
    stubViewportMeasurement(viewport, 300, 400, 320, 420);
    stubPointerCapture(paper);
    stubPaperRectangle(paper);

    fireEvent.pointerDown(eastHandle, { button: 0, pointerId: 11, clientX: 600, clientY: 400 });
    fireEvent.pointerMove(paper, { pointerId: 11, clientX: 660, clientY: 400 });

    expect(onPaperSizeChange).toHaveBeenLastCalledWith(660, 865);
    expect(paper.style.transform).toBe('scale(1)');
    expect(paper.parentElement?.getAttribute('style')).toContain('transform: translateX(30px)');

    fireEvent.pointerUp(paper, { pointerId: 11 });

    expect(paper.style.transform).toBe(`scale(${300 / 660})`);
    expect(paper.parentElement?.style.transform).toBe('');

    const scaleAfterRelease = 300 / 660;
    fireEvent.pointerDown(eastHandle, { button: 0, pointerId: 12, clientX: 660, clientY: 400 });
    fireEvent.pointerMove(paper, { pointerId: 12, clientX: 660 + 60 * scaleAfterRelease, clientY: 400 });

    expect(onPaperSizeChange).toHaveBeenLastCalledWith(720, 865);
    fireEvent.pointerCancel(paper, { pointerId: 12 });
    expect(paper.parentElement?.style.transform).toBe('');
  });

  it('clamps paper size independently for east, south, and corner handles', () => {
    const resizeCases = [
      {
        handleName: copy.resizePaperEast,
        project: { ...makeProject(), width: 2400 },
        start: { x: 600, y: 400 },
        end: { x: 700, y: 400 },
        expected: [2400, 865],
      },
      {
        handleName: copy.resizePaperSouth,
        project: { ...makeProject(), height: 3600 },
        start: { x: 300, y: 400 },
        end: { x: 300, y: 500 },
        expected: [600, 3600],
      },
      {
        handleName: copy.resizePaperCorner,
        project: { ...makeProject(), width: 160, height: 160 },
        start: { x: 600, y: 400 },
        end: { x: 500, y: 300 },
        expected: [160, 160],
      },
    ] as const;

    for (const [index, resizeCase] of resizeCases.entries()) {
      const onPaperSizeChange = vi.fn();
      const canvasView = renderCanvas({
        project: resizeCase.project,
        paperResizing: true,
        onPaperSizeChange,
      });
      const paper = screen.getByLabelText(copy.previewTitle);
      const resizeHandle = screen.getByRole('button', { name: resizeCase.handleName });
      stubPointerCapture(paper);

      fireEvent.pointerDown(resizeHandle, {
        button: 0,
        pointerId: 20 + index,
        clientX: resizeCase.start.x,
        clientY: resizeCase.start.y,
      });
      fireEvent.pointerMove(paper, {
        pointerId: 20 + index,
        clientX: resizeCase.end.x,
        clientY: resizeCase.end.y,
      });

      expect(onPaperSizeChange).toHaveBeenLastCalledWith(...resizeCase.expected);
      fireEvent.pointerUp(paper, { pointerId: 20 + index });
      canvasView.unmount();
    }
  });
});
