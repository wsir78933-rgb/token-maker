// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEmblemCreatorCopy } from '@/lib/emblem-creator/copy';
import { createDefaultEmblemProject } from '@/lib/emblem-creator/project';
import type { EmblemElement, EmblemElementTransform, EmblemLocale, EmblemProject } from '@/lib/emblem-creator/types';
import { EmblemCanvas, type EmblemCanvasProps } from './EmblemCanvas';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function createElement(id: string, transform: Partial<EmblemElementTransform> = {}): EmblemElement {
  return {
    id,
    source: { kind: 'url', url: `/emblem-creator/${id}.svg`, naturalWidth: 200, naturalHeight: 100 },
    transform: { x: 400, y: 400, scale: 1, rotation: 0, mirrorX: false, ...transform },
  };
}

function createProject(elements: readonly EmblemElement[]): EmblemProject {
  const project = createDefaultEmblemProject();
  return { ...project, layers: { ...project.layers, details: { visible: true, elements } } };
}

function renderCanvas(overrides: Partial<EmblemCanvasProps> = {}) {
  const props: EmblemCanvasProps = {
    locale: 'en', copy: getEmblemCreatorCopy('en'),
    project: createProject([createElement('first'), createElement('second', { x: 700 })]),
    selectedElementId: null, showEditBounds: true,
    onSelectElement: vi.fn(), onElementTransform: vi.fn(), ...overrides,
  };
  const rendered = render(<EmblemCanvas {...props} />);
  const svg = screen.getByRole('group', { name: props.copy.canvasLabel }) as unknown as SVGSVGElement;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 10, top: 20, width: 512, height: 512, right: 522, bottom: 532, x: 10, y: 20, toJSON: () => ({}),
  });
  svg.setPointerCapture = vi.fn();
  svg.releasePointerCapture = vi.fn();
  svg.hasPointerCapture = vi.fn(() => true);
  return { ...rendered, props, svg };
}

function getElement(container: HTMLElement, id: string): SVGGElement {
  const element = container.querySelector<SVGGElement>(`[data-element-id="${id}"]`);
  if (!element) throw new Error(`Test element is missing: ${id}.`);
  return element;
}

function pointer(target: Element, type: string, clientX: number, clientY: number, pointerId = 1, additions: Partial<PointerEvent> = {}) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY, button: 0 });
  Object.defineProperties(event, {
    pointerId: { value: pointerId }, pointerType: { value: 'touch' }, isPrimary: { value: true },
    ...Object.fromEntries(Object.entries(additions).map(([key, value]) => [key, { value }])),
  });
  fireEvent(target, event);
}

describe('EmblemCanvas', () => {
  it('renders a transparent 1024 scene in the reverse six-layer drawing order without deleting hidden objects', () => {
    const original = createDefaultEmblemProject();
    const project: EmblemProject = {
      ...original,
      layers: {
        crests: { visible: true, elements: [createElement('crests')] },
        details: { visible: true, elements: [createElement('details')] },
        body1: { visible: true, elements: [createElement('body1')] },
        body2: { visible: true, elements: [createElement('body2')] },
        body3: { visible: true, elements: [createElement('body3')] },
        body4: { visible: true, elements: [createElement('body4')] },
      },
    };
    const { container, svg, rerender, props } = renderCanvas({ project });
    expect(svg.getAttribute('viewBox')).toBe('0 0 1024 1024');
    expect(svg.style.background).toBe('');
    expect(container.querySelectorAll('svg rect')).toHaveLength(0);
    expect([...container.querySelectorAll('[data-layer-id]')].map((layer) => layer.getAttribute('data-layer-id')))
      .toEqual(['body4', 'body3', 'body2', 'body1', 'details', 'crests']);

    const hidden = { ...project, layers: { ...project.layers, details: { ...project.layers.details, visible: false } } };
    rerender(<EmblemCanvas {...props} project={hidden} />);
    expect(container.querySelector('[data-element-id="details"]')).toBeNull();
    expect(hidden.layers.details.elements).toHaveLength(1);
    expect(project.layers.details.visible).toBe(true);
    rerender(<EmblemCanvas {...props} project={project} />);
    expect(container.querySelector('[data-element-id="details"]')).not.toBeNull();
  });

  it('visually applies translation, rotation, uniform scale and mirroring, with bounds only for the one selection', () => {
    const first = createElement('first', { x: 100, y: 250, scale: 2, rotation: 45, mirrorX: true });
    const { container, props, rerender } = renderCanvas({ project: createProject([first, createElement('second')]), selectedElementId: 'first' });
    expect(getElement(container, 'first').getAttribute('transform')).toBe('translate(100 250) rotate(45) scale(-2 2)');
    expect(container.querySelector('image')?.getAttribute('x')).toBe('-100');
    expect(container.querySelector('image')?.getAttribute('height')).toBe('100');
    const bounds = container.querySelector('[data-edit-bounds]');
    expect(bounds?.getAttribute('transform')).toBe('translate(100 250) rotate(45)');
    expect(bounds?.querySelector('rect')?.getAttribute('width')).toBe('400');
    expect(bounds?.querySelector('rect')?.getAttribute('height')).toBe('200');
    expect(container.querySelectorAll('[data-edit-bounds]')).toHaveLength(1);
    expect(getElement(container, 'first').getAttribute('aria-pressed')).toBe('true');
    expect(getElement(container, 'second').getAttribute('aria-pressed')).toBe('false');
    rerender(<EmblemCanvas {...props} selectedElementId="second" />);
    expect(container.querySelector('[data-edit-bounds]')?.getAttribute('data-edit-bounds')).toBe('second');
  });

  it('selects and drags only the touched object with bounds hidden, using DOM coordinates and pointer capture', () => {
    const { container, svg, props } = renderCanvas({ showEditBounds: false });
    const first = getElement(container, 'first');
    expect(container.querySelector('[data-edit-bounds]')).toBeNull();
    pointer(first.querySelector('image')!, 'pointerdown', 210, 220, 7);
    expect(props.onSelectElement).toHaveBeenCalledExactlyOnceWith('first');
    expect(svg.setPointerCapture).toHaveBeenCalledExactlyOnceWith(7);
    pointer(svg, 'pointermove', 999, 999, 8);
    expect(props.onElementTransform).not.toHaveBeenCalled();
    pointer(svg, 'pointermove', 235, 205, 7);
    pointer(svg, 'pointermove', 260, 200, 7);
    expect(props.onElementTransform).toHaveBeenNthCalledWith(1, 'first', { x: 450, y: 370, scale: 1, rotation: 0, mirrorX: false });
    expect(props.onElementTransform).toHaveBeenNthCalledWith(2, 'first', { x: 500, y: 360, scale: 1, rotation: 0, mirrorX: false });
    pointer(svg, 'pointerup', 260, 200, 7);
    expect(svg.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(7);
    pointer(svg, 'pointermove', 280, 250, 7);
    expect(props.onElementTransform).toHaveBeenCalledTimes(2);
    expect(props.project.layers.details.elements.map((element) => element.transform.x)).toEqual([400, 700]);
  });

  it('uses the inverse SVG screen matrix, including skew and translation, rather than the DOM rectangle', () => {
    const { container, svg, props } = renderCanvas();
    const inverse = vi.fn(() => ({ a: 2, b: 0.5, c: -0.25, d: 3, e: -10, f: -20 }));
    Object.defineProperty(svg, 'getScreenCTM', { value: () => ({ inverse }) });
    pointer(getElement(container, 'first'), 'pointerdown', 50, 60);
    pointer(svg, 'pointermove', 70, 70);
    expect(inverse).toHaveBeenCalledTimes(2);
    expect(props.onElementTransform).toHaveBeenCalledExactlyOnceWith('first', {
      x: 437.5, y: 440, scale: 1, rotation: 0, mirrorX: false,
    });
  });

  it('accounts for centered SVG letterboxing when mapping DOM coordinates for direct scaling', () => {
    const { container, svg, props } = renderCanvas({ selectedElementId: 'first' });
    vi.mocked(svg.getBoundingClientRect).mockReturnValue({
      left: 10, top: 20, width: 512, height: 256, right: 522, bottom: 276, x: 10, y: 20, toJSON: () => ({}),
    });
    // The 1024 viewBox occupies x=138..394 at 0.25 client pixels per logical pixel.
    const handle = container.querySelector('[data-scale-handle]')!;
    pointer(handle, 'pointerdown', 263, 132.5);
    pointer(svg, 'pointermove', 288, 145);
    const expected = { x: 400, y: 400, scale: 2, rotation: 0, mirrorX: false };
    expect(props.onElementTransform).toHaveBeenCalledExactlyOnceWith('first', expected);
    expect(200 * expected.scale / (100 * expected.scale)).toBe(2);
  });

  it('scales the single rotated, mirrored selection uniformly from its center without a handle hit-area jump', () => {
    const first = createElement('first', { rotation: 90, mirrorX: true, scale: 2 });
    const { container, svg, props } = renderCanvas({ project: createProject([first, createElement('second')]), selectedElementId: 'first' });
    const handle = container.querySelector('[data-scale-handle]')!;
    // At 90 degrees the corner is (-100,200) from the center; start slightly off the visual handle.
    pointer(handle, 'pointerdown', 165, 325, 3);
    pointer(svg, 'pointermove', 165, 325, 3);
    expect(props.onElementTransform).toHaveBeenLastCalledWith('first', first.transform);
    pointer(svg, 'pointermove', 120, 430, 3);
    expect(props.onElementTransform).toHaveBeenLastCalledWith('first', { ...first.transform, scale: 4 });
    pointer(svg, 'pointermove', 210, 220, 3);
    const lastTransform = vi.mocked(props.onElementTransform).mock.calls.at(-1)![1];
    expect(lastTransform.scale).toBeGreaterThan(0);
    expect(lastTransform.x).toBe(400);
    expect(lastTransform.y).toBe(400);
    expect(lastTransform.rotation).toBe(90);
    expect(lastTransform.mirrorX).toBe(true);
    expect(props.project.layers.details.elements[1].transform.scale).toBe(1);
  });

  it('cancels touch gestures and stops moving an object if its layer becomes hidden', () => {
    const { container, svg, props, rerender } = renderCanvas();
    pointer(getElement(container, 'first'), 'pointerdown', 210, 220);
    pointer(svg, 'pointercancel', 215, 225);
    pointer(svg, 'pointermove', 260, 260);
    expect(props.onElementTransform).not.toHaveBeenCalled();
    pointer(getElement(container, 'first'), 'pointerdown', 210, 220, 2);
    const hidden = { ...props.project, layers: { ...props.project.layers, details: { ...props.project.layers.details, visible: false } } };
    rerender(<EmblemCanvas {...props} project={hidden} />);
    pointer(svg, 'pointermove', 260, 260, 2);
    expect(props.onElementTransform).not.toHaveBeenCalled();
    expect(svg.releasePointerCapture).toHaveBeenCalledTimes(2);
  });

  it.each(['move', 'scale'] as const)('stops the active %s gesture after Escape clears the controlled selection', (mode) => {
    const { container, svg, props, rerender } = renderCanvas({ selectedElementId: 'first' });
    vi.mocked(props.onSelectElement).mockImplementation((selectedElementId) => {
      rerender(<EmblemCanvas {...props} selectedElementId={selectedElementId} />);
    });
    const target = mode === 'move' ? getElement(container, 'first') : container.querySelector('[data-scale-handle]')!;
    pointer(target, 'pointerdown', 260, 245, 7);
    pointer(svg, 'pointermove', 285, 270, 7);
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(svg, { key: 'Escape' });
    expect(props.onSelectElement).toHaveBeenLastCalledWith(null);
    expect(screen.getByText(props.copy.noSelection)).not.toBeNull();
    pointer(svg, 'pointermove', 310, 295, 7);
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);
    expect(svg.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(7);
    pointer(svg, 'pointerup', 310, 295, 7);
    expect(svg.releasePointerCapture).toHaveBeenCalledTimes(1);
  });

  it.each([
    { pointerType: 'mouse', mode: 'move' },
    { pointerType: 'mouse', mode: 'scale' },
    { pointerType: 'touch', mode: 'move' },
    { pointerType: 'touch', mode: 'scale' },
  ] as const)('focuses the canvas from BODY for $pointerType $mode so Escape cancels further movement', ({ pointerType, mode }) => {
    const { container, svg, props, rerender } = renderCanvas({ selectedElementId: mode === 'scale' ? 'first' : null });
    vi.mocked(props.onSelectElement).mockImplementation((selectedElementId) => {
      rerender(<EmblemCanvas {...props} selectedElementId={selectedElementId} />);
    });
    expect(document.activeElement).toBe(document.body);
    const target = mode === 'move' ? getElement(container, 'first').querySelector('image')! : container.querySelector('[data-scale-handle]')!;
    pointer(target, 'pointerdown', 260, 245, 7, { pointerType });
    expect(document.activeElement).toBe(svg);
    expect(props.onSelectElement).toHaveBeenLastCalledWith('first');
    expect(svg.setPointerCapture).toHaveBeenCalledExactlyOnceWith(7);
    pointer(svg, 'pointermove', 285, 270, 7, { pointerType });
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(props.onSelectElement).toHaveBeenLastCalledWith(null);
    expect(screen.getByText(props.copy.noSelection)).not.toBeNull();
    expect(container.querySelector('[data-edit-bounds]')).toBeNull();
    pointer(svg, 'pointermove', 310, 295, 7, { pointerType });
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);
    expect(svg.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(7);
    pointer(svg, 'pointerup', 310, 295, 7, { pointerType });
    expect(svg.releasePointerCapture).toHaveBeenCalledTimes(1);
  });

  it.each(['move', 'scale'] as const)('stops the old %s gesture when keyboard selection changes from A to B', (mode) => {
    const { container, svg, props, rerender } = renderCanvas({ selectedElementId: 'first' });
    vi.mocked(props.onSelectElement).mockImplementation((selectedElementId) => {
      rerender(<EmblemCanvas {...props} selectedElementId={selectedElementId} />);
    });
    const target = mode === 'move' ? getElement(container, 'first') : container.querySelector('[data-scale-handle]')!;
    pointer(target, 'pointerdown', 260, 245, 7);
    pointer(svg, 'pointermove', 285, 270, 7);
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(getElement(container, 'second'), { key: 'Enter' });
    expect(getElement(container, 'second').getAttribute('aria-pressed')).toBe('true');
    pointer(svg, 'pointermove', 310, 295, 7);
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);
    expect(svg.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(7);

    pointer(getElement(container, 'second'), 'pointerdown', 360, 220, 8);
    pointer(svg, 'pointermove', 385, 245, 8);
    expect(props.onElementTransform).toHaveBeenLastCalledWith('second', {
      x: 750, y: 450, scale: 1, rotation: 0, mirrorX: false,
    });
    pointer(svg, 'pointerup', 385, 245, 7);
    expect(svg.releasePointerCapture).toHaveBeenCalledTimes(1);
    pointer(svg, 'pointercancel', 385, 245, 8);
    expect(svg.releasePointerCapture).toHaveBeenNthCalledWith(2, 8);
  });

  it.each([null, 'second'])('allows a newly selected drag while the parent selection is still %s', (selectedElementId) => {
    const { container, svg, props, rerender } = renderCanvas({ selectedElementId });
    pointer(getElement(container, 'first'), 'pointerdown', 210, 220, 7);
    expect(props.onSelectElement).toHaveBeenCalledExactlyOnceWith('first');
    pointer(svg, 'pointermove', 235, 245, 7);
    expect(props.onElementTransform).toHaveBeenCalledExactlyOnceWith('first', {
      x: 450, y: 450, scale: 1, rotation: 0, mirrorX: false,
    });

    rerender(<EmblemCanvas {...props} selectedElementId="first" />);
    pointer(svg, 'pointermove', 260, 270, 7);
    expect(props.onElementTransform).toHaveBeenNthCalledWith(2, 'first', {
      x: 500, y: 500, scale: 1, rotation: 0, mirrorX: false,
    });
    expect(svg.releasePointerCapture).not.toHaveBeenCalled();
    pointer(svg, 'pointerup', 260, 270, 7);
    expect(svg.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(7);
  });

  it('supports keyboard selection, movement, proportional scaling and clearing through public callbacks', () => {
    const { container, svg, props, rerender } = renderCanvas({ selectedElementId: 'first' });
    const first = getElement(container, 'first');
    fireEvent.keyDown(first, { key: 'Enter' });
    expect(props.onSelectElement).toHaveBeenCalledExactlyOnceWith('first');
    fireEvent.keyDown(first, { key: 'ArrowRight', shiftKey: true });
    expect(props.onElementTransform).toHaveBeenLastCalledWith('first', { x: 410, y: 400, scale: 1, rotation: 0, mirrorX: false });
    fireEvent.keyDown(getElement(container, 'second'), { key: 'ArrowRight' });
    expect(props.onElementTransform).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Width / Height: first' }), { key: 'ArrowUp' });
    expect(props.onElementTransform).toHaveBeenLastCalledWith('first', { x: 400, y: 400, scale: 1.05, rotation: 0, mirrorX: false });
    fireEvent.keyDown(svg, { key: 'Escape' });
    expect(props.onSelectElement).toHaveBeenLastCalledWith(null);
    pointer(svg, 'pointerdown', 20, 30);
    expect(props.onSelectElement).toHaveBeenLastCalledWith(null);
    rerender(<EmblemCanvas {...props} selectedElementId={null} />);
    expect(screen.getByText(props.copy.noSelection)).not.toBeNull();
  });

  it.each<EmblemLocale>(['en', 'zh'])('labels the selection with its localized layer and position within that layer instead of its UUID in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const selectedElementId = '71bf7457-8547-4db0-8839-7e33b5df06dc';
    const original = createProject([createElement('first'), createElement(selectedElementId)]);
    const project: EmblemProject = {
      ...original,
      layers: { ...original.layers, crests: { visible: true, elements: [createElement('icon-first'), createElement('icon-second')] } },
    };
    const { container, props, rerender } = renderCanvas({ locale, copy, project, selectedElementId });
    const selectionNotice = container.querySelector('p[aria-live="polite"]')!;
    expect(selectionNotice.textContent).toBe(`${copy.selectedLabel}: ${copy.layers.names.details} · 2`);
    expect(selectionNotice.textContent).not.toContain(selectedElementId);
    expect(selectionNotice.textContent).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    expect(getElement(container, selectedElementId).getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-edit-bounds]')?.getAttribute('data-edit-bounds')).toBe(selectedElementId);

    rerender(<EmblemCanvas {...props} selectedElementId="icon-second" />);
    expect(selectionNotice.textContent).toBe(`${copy.selectedLabel}: ${copy.layers.names.crests} · 2`);
    rerender(<EmblemCanvas {...props} selectedElementId="first" />);
    expect(selectionNotice.textContent).toBe(`${copy.selectedLabel}: ${copy.layers.names.details} · 1`);

    const hidden = { ...project, layers: { ...project.layers, details: { ...project.layers.details, visible: false } } };
    rerender(<EmblemCanvas {...props} project={hidden} />);
    expect(selectionNotice.textContent).toBe(`${copy.selectedLabel}: ${copy.layers.names.details} · 2`);
    expect(container.querySelector('[data-edit-bounds]')).toBeNull();
  });

  it.each<EmblemLocale>(['en', 'zh'])('keeps the existing no-selection notice for an empty or missing selection in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container, props, rerender } = renderCanvas({ locale, copy });
    const selectionNotice = container.querySelector('p[aria-live="polite"]')!;
    expect(selectionNotice.textContent).toBe(copy.noSelection);
    rerender(<EmblemCanvas {...props} selectedElementId="b9580ec2-2fcb-41d2-91c6-57095c6f82cb" />);
    expect(selectionNotice.textContent).toBe(copy.noSelection);
  });

  it.each<EmblemLocale>(['en', 'zh'])('shows localized accessible names and visible URL-specific image errors in %s', (locale) => {
    const copy = getEmblemCreatorCopy(locale);
    const { container, props, rerender } = renderCanvas({ locale, copy, selectedElementId: 'first' });
    expect(container.firstElementChild?.getAttribute('lang')).toBe(locale);
    expect(screen.getByRole('button', { name: `${copy.assets.chooseAsset}: ${copy.layers.names.details} — first` })).not.toBeNull();
    expect(screen.getByRole('button', { name: `${copy.properties.width} / ${copy.properties.height}: first` })).not.toBeNull();
    const image = getElement(container, 'first').querySelector('image')!;
    fireEvent.error(image);
    expect(screen.getByRole('alert').textContent).toContain(copy.errorTitle);
    expect(screen.getByRole('alert').textContent).toContain(`${copy.errors.loadImageFailed}: /emblem-creator/first.svg`);
    fireEvent.load(image);
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.error(image);
    const hidden = { ...props.project, layers: { ...props.project.layers, details: { ...props.project.layers.details, visible: false } } };
    rerender(<EmblemCanvas {...props} project={hidden} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows precise coordinate conversion failures and leaves the project untouched', () => {
    const { container, svg, props } = renderCanvas();
    vi.mocked(svg.getBoundingClientRect).mockReturnValue({
      left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}),
    });
    pointer(getElement(container, 'first'), 'pointerdown', 20, 20);
    expect(screen.getByRole('alert').textContent).toContain('Invalid canvas rectangle: width=0, height=0.');
    expect(props.onElementTransform).not.toHaveBeenCalled();
    expect(props.onSelectElement).not.toHaveBeenCalled();
  });
});
