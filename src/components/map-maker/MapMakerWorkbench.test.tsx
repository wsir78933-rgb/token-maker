// @vitest-environment jsdom

import { cleanup, createEvent, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MAP_MAKER_DEFAULT_ROWS, MAP_MAKER_TILE_SIZE } from '@/lib/map-maker';
import { getMapMakerCopy } from '@/lib/map-maker/copy';

import { MapMakerWorkbench } from './MapMakerWorkbench';

type CanvasViewportLayout = {
  clientWidth: number;
  paddingLeft: number;
  paddingRight: number;
  inspectorWidth: number;
};

let originalClientWidthDescriptor: PropertyDescriptor | undefined;
let updateCanvasViewportLayout: ((nextLayout: CanvasViewportLayout) => void) | null = null;
let rightInspectorRectReadCount = 0;

class WorkbenchResizeObserver implements ResizeObserver {
  readonly observedElements: Element[] = [];

  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(element: Element): void {
    this.observedElements.push(element);
  }

  unobserve(element: Element): void {
    const observedIndex = this.observedElements.indexOf(element);
    if (observedIndex >= 0) this.observedElements.splice(observedIndex, 1);
  }

  disconnect(): void {
    this.observedElements.length = 0;
  }

  takeRecords(): ResizeObserverEntry[] {
    return [];
  }

  notify(): void {
    this.callback(this.observedElements.map((target) => ({ target }) as ResizeObserverEntry), this);
  }
}

function isCanvasViewport(element: Element): element is HTMLDivElement {
  return element instanceof HTMLDivElement
    && element.dataset.testid === 'map-maker-canvas-viewport';
}

function isRightInspector(element: HTMLElement): boolean {
  return element.tagName === 'ASIDE'
    && element.firstElementChild?.id.startsWith('map-maker-inspector-') === true;
}

function createTestBoundingClientRect(width: number): DOMRect {
  return {
    x: 0,
    y: 0,
    top: 0,
    right: width,
    bottom: 560,
    left: 0,
    width,
    height: 560,
    toJSON: () => ({ x: 0, y: 0, width, height: 560 }),
  } as DOMRect;
}

function installCanvasViewportLayout(initialLayout: CanvasViewportLayout): (nextLayout: CanvasViewportLayout) => void {
  let currentLayout = initialLayout;
  rightInspectorRectReadCount = 0;
  originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      if (isCanvasViewport(this)) return currentLayout.clientWidth;
      return originalClientWidthDescriptor?.get?.call(this) ?? 0;
    },
  });

  const readNativeComputedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
    if (isCanvasViewport(element)) {
      return {
        paddingLeft: `${currentLayout.paddingLeft}px`,
        paddingRight: `${currentLayout.paddingRight}px`,
      } as CSSStyleDeclaration;
    }
    return readNativeComputedStyle(element, pseudoElement);
  });

  const readNativeBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function readElementBounds(this: HTMLElement) {
    if (isRightInspector(this)) {
      rightInspectorRectReadCount += 1;
      return createTestBoundingClientRect(currentLayout.inspectorWidth);
    }
    return readNativeBoundingClientRect.call(this);
  });

  return (nextLayout) => {
    currentLayout = nextLayout;
  };
}

function restoreCanvasViewportLayout(): void {
  if (originalClientWidthDescriptor === undefined) {
    Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
  } else {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidthDescriptor);
  }
  originalClientWidthDescriptor = undefined;
  updateCanvasViewportLayout = null;
  rightInspectorRectReadCount = 0;
}

function setCanvasViewportLayout(layout: CanvasViewportLayout): void {
  if (updateCanvasViewportLayout === null) {
    throw new Error('Map Maker Workbench tests require an installed canvas viewport layout fixture.');
  }
  updateCanvasViewportLayout(layout);
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', WorkbenchResizeObserver);
  updateCanvasViewportLayout = installCanvasViewportLayout({
    clientWidth: 1024,
    paddingLeft: 0,
    paddingRight: 0,
    inspectorWidth: 280,
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  restoreCanvasViewportLayout();
});

describe('MapMakerWorkbench', () => {
  it.each(['en', 'zh'] as const)('keeps project actions in the inspector and mobile More in %s', (locale) => {
    const copy = getMapMakerCopy(locale).workspace;
    render(<MapMakerWorkbench copy={copy} />);

    const toolbar = screen.getByTestId('map-maker-toolbar');
    const projectActions = screen.getByTestId('map-maker-project-actions');
    const actionLabels = [
      copy.actions.randomGenerate,
      copy.actions.mapSize,
      copy.actions.resetAndClear,
      copy.actions.saveAndLoad,
      copy.actions.exportImage,
    ];

    expect(within(toolbar).getAllByRole('button')).toHaveLength(1);
    expect(within(toolbar).getByRole('button', { name: copy.actions.help })).toBeTruthy();
    expect(toolbar.textContent).toContain(copy.mapDimensions.gridUnit);
    for (const actionLabel of actionLabels) {
      expect(within(projectActions).getByRole('button', { name: actionLabel })).toBeTruthy();
      expect(within(toolbar).queryByRole('button', { name: actionLabel })).toBeNull();
    }

    fireEvent.click(within(projectActions).getByRole('button', { name: copy.actions.randomGenerate }));
    const statusMessage = screen.getByText(copy.status.mapGenerated);
    expect(statusMessage.textContent).toContain(copy.status.mapGenerated);
    expectFeedbackAboveViewport(statusMessage);

    const firstCanvasImage = screen.getByTestId('map-maker-canvas').querySelector('img');
    if (!(firstCanvasImage instanceof HTMLImageElement)) {
      throw new Error('Expected a rendered map image before checking image-load feedback.');
    }
    fireEvent.error(firstCanvasImage);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage.textContent).toContain(copy.common.errorLabel);
    expectFeedbackAboveViewport(errorMessage);

    fireEvent.click(screen.getByRole('button', { name: copy.common.more }));
    const moreSheet = screen.getByRole('dialog', { name: copy.common.more });
    for (const actionLabel of actionLabels) {
      expect(within(moreSheet).getByRole('button', { name: actionLabel })).toBeTruthy();
    }
  });

  it('adds a label ready for inline editing and safely finishes from the toolbar', () => {
    const copy = getMapMakerCopy('en').workspace;
    render(<MapMakerWorkbench copy={copy} />);

    fireEvent.click(screen.getByRole('button', { name: copy.canvas.addLabel }));
    const labelEditor = screen.getByTestId(/map-maker-label-editor-/);
    const finishButton = screen.getByRole('button', { name: copy.canvas.finishLabelEdit });
    fireEvent.change(labelEditor, { target: { value: 'Mist Sea\nThe Shrouded Coast' } });

    const pointerDown = createEvent.pointerDown(finishButton, { button: 0, pointerId: 1, isPrimary: true });
    fireEvent(finishButton, pointerDown);
    fireEvent.blur(labelEditor, { relatedTarget: finishButton });
    expect(pointerDown.defaultPrevented).toBe(true);
    expect(screen.getByTestId(/map-maker-label-editor-/)).toBeTruthy();

    fireEvent.click(finishButton);
    expect(screen.queryByTestId(/map-maker-label-editor-/)).toBeNull();
    expect(screen.getByRole('button', { name: copy.canvas.editLabel })).toBeTruthy();
  });

  it('keeps the selected asset category and placement mode when a mobile material sheet closes', () => {
    const copy = getMapMakerCopy('zh').workspace;
    render(<MapMakerWorkbench copy={copy} />);

    fireEvent.click(screen.getByRole('button', { name: copy.materials.title }));
    const assetTabs = screen.getAllByRole('tab', { name: copy.materials.elementsTab });
    fireEvent.click(assetTabs[assetTabs.length - 1]!);
    const structuresCategory = screen.getByTestId('map-maker-category-structures');
    fireEvent.click(structuresCategory);
    const freePlaceLabel = screen.getAllByText(copy.materials.placementMode.freePlace).at(-1);
    if (freePlaceLabel === undefined) throw new Error('Expected the free placement option.');
    const freePlaceInput = freePlaceLabel.closest('label')?.querySelector('input');
    if (!(freePlaceInput instanceof HTMLInputElement)) throw new Error('Expected the free placement radio input.');
    expect(freePlaceInput.checked).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: copy.common.close }));
    fireEvent.click(screen.getByRole('button', { name: copy.materials.title }));

    const reopenedStructuresCategory = screen.getByTestId('map-maker-category-structures');
    expect(reopenedStructuresCategory.getAttribute('aria-pressed')).toBe('true');
    const reopenedFreePlaceLabel = screen.getAllByText(copy.materials.placementMode.freePlace).at(-1);
    const reopenedFreePlaceInput = reopenedFreePlaceLabel?.closest('label')?.querySelector('input');
    expect(reopenedFreePlaceInput?.checked).toBe(true);
  });

  it('gives each mounted layer and properties panel its own heading ID', () => {
    const copy = getMapMakerCopy('en').workspace;
    render(<MapMakerWorkbench copy={copy} />);

    const sectionsForHeading = (headingText: string) => Array.from(document.querySelectorAll('section[aria-labelledby]'))
      .filter((section) => section.querySelector('h3')?.textContent === headingText);
    const panels = [
      { title: copy.layers.title, sections: sectionsForHeading(copy.layers.title) },
      { title: copy.properties.title, sections: sectionsForHeading(copy.properties.title) },
    ];

    for (const panel of panels) {
      expect(panel.sections).toHaveLength(2);
      const headingIds = panel.sections.map((section) => section.getAttribute('aria-labelledby'));
      expect(new Set(headingIds).size).toBe(2);
      for (const [index, section] of panel.sections.entries()) {
        const headingId = headingIds[index];
        expect(section.querySelector('h3')?.id).toBe(headingId);
        expect(Array.from(document.querySelectorAll('[id]')).filter((element) => element.id === headingId)).toHaveLength(1);
      }
    }
  });

  it.each([
    { name: 'measures the collapsed canvas at 1440px with the default inspector', layout: { clientWidth: 723, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 13 },
    { name: 'measures the collapsed canvas at 1920px with the default inspector', layout: { clientWidth: 770, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 13 },
    { name: 'measures the collapsed canvas at 1024px with the default inspector', layout: { clientWidth: 307, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 7 },
    { name: 'measures the collapsed canvas at 981px with the default inspector', layout: { clientWidth: 280, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 6 },
    { name: 'leaves the 980px hidden inspector out of the canvas width', layout: { clientWidth: 863, paddingLeft: 12, paddingRight: 12, inspectorWidth: 0 }, columns: 11 },
    { name: 'leaves the 390px hidden inspector out of the canvas width', layout: { clientWidth: 305, paddingLeft: 12, paddingRight: 12, inspectorWidth: 0 }, columns: 6 },
    { name: 'floors the adjusted width below a tile boundary', layout: { clientWidth: 507, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 9 },
    { name: 'includes a tile at the exact adjusted boundary', layout: { clientWidth: 508, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 10 },
    { name: 'keeps the six-column minimum after adjustment', layout: { clientWidth: 227, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 6 },
    { name: 'caps the adjusted width at thirty-five columns', layout: { clientWidth: 2258, paddingLeft: 12, paddingRight: 12, inspectorWidth: 280 }, columns: 35 },
    { name: 'uses the actual 220px inspector width', layout: { clientWidth: 524, paddingLeft: 12, paddingRight: 12, inspectorWidth: 220 }, columns: 9 },
    { name: 'does not add width for an already-collapsed 64px rail', layout: { clientWidth: 524, paddingLeft: 12, paddingRight: 12, inspectorWidth: 64 }, columns: 7 },
    { name: 'does not add width when the inspector is hidden', layout: { clientWidth: 524, paddingLeft: 12, paddingRight: 12, inspectorWidth: 0 }, columns: 7 },
  ])('initializes the visible map size when it $name', ({ layout, columns }) => {
    setCanvasViewportLayout(layout);
    render(<MapMakerWorkbench copy={getMapMakerCopy('en').workspace} />);

    const mapCanvas = screen.getByTestId('map-maker-canvas') as HTMLDivElement;
    expect(mapCanvas.style.width).toBe(`${columns * MAP_MAKER_TILE_SIZE}px`);
    expect(mapCanvas.style.height).toBe(`${MAP_MAKER_DEFAULT_ROWS * MAP_MAKER_TILE_SIZE}px`);
    expect(mapCanvas.style.getPropertyValue('--map-columns')).toBe(String(columns));
    expect(rightInspectorRectReadCount).toBeGreaterThan(0);
  });

  it.each(['en', 'zh'] as const)('renders measured map columns with the %s workspace copy', (locale) => {
    setCanvasViewportLayout({ clientWidth: 910, paddingLeft: 35, paddingRight: 35, inspectorWidth: 280 });
    render(<MapMakerWorkbench copy={getMapMakerCopy(locale).workspace} />);

    expect((screen.getByTestId('map-maker-canvas') as HTMLDivElement).style.width).toBe('1050px');
  });

  it('keeps the first measured columns after viewport resize and inspector collapse', () => {
    const copy = getMapMakerCopy('en').workspace;
    setCanvasViewportLayout({ clientWidth: 840, paddingLeft: 35, paddingRight: 35, inspectorWidth: 280 });
    render(<MapMakerWorkbench copy={copy} />);
    const mapCanvas = screen.getByTestId('map-maker-canvas') as HTMLDivElement;
    const collapseInspectorButton = screen.getByRole('button', { name: copy.layers.collapsePanel });
    expect(collapseInspectorButton.getAttribute('aria-expanded')).toBe('true');
    expect(screen.queryByRole('button', { name: copy.layers.expandPanel })).toBeNull();
    expect(mapCanvas.style.width).toBe('980px');
    const initialInspectorRectReadCount = rightInspectorRectReadCount;
    expect(initialInspectorRectReadCount).toBeGreaterThan(0);

    setCanvasViewportLayout({ clientWidth: 1400, paddingLeft: 35, paddingRight: 35, inspectorWidth: 64 });
    fireEvent(window, new Event('resize'));
    fireEvent.keyDown(screen.getByRole('separator', { name: copy.layers.title }), { key: 'ArrowLeft' });
    expect(mapCanvas.style.width).toBe('980px');
    expect(rightInspectorRectReadCount).toBe(initialInspectorRectReadCount);

    fireEvent.click(collapseInspectorButton);
    expect(mapCanvas.style.width).toBe('980px');
    expect(rightInspectorRectReadCount).toBe(initialInspectorRectReadCount);
    expect(screen.queryByRole('button', { name: copy.layers.collapsePanel })).toBeNull();
    expect(screen.getByRole('button', { name: copy.layers.expandPanel })).toBeTruthy();

    setCanvasViewportLayout({ clientWidth: 840, paddingLeft: 35, paddingRight: 35, inspectorWidth: 280 });
    fireEvent.click(screen.getByRole('button', { name: copy.layers.expandPanel }));
    expect(mapCanvas.style.width).toBe('980px');
    expect(rightInspectorRectReadCount).toBe(initialInspectorRectReadCount);
    expect(screen.getByRole('button', { name: copy.layers.collapsePanel }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.queryByRole('button', { name: copy.layers.expandPanel })).toBeNull();
  });

  it.each([
    { name: 'negative', inspectorWidth: -1, receivedValue: '-1' },
    { name: 'non-finite', inspectorWidth: Number.POSITIVE_INFINITY, receivedValue: 'Infinity' },
  ])('fails with the received $name right inspector width', ({ inspectorWidth, receivedValue }) => {
    setCanvasViewportLayout({ clientWidth: 1024, paddingLeft: 12, paddingRight: 12, inspectorWidth });

    expect(() => render(<MapMakerWorkbench copy={getMapMakerCopy('en').workspace} />)).toThrow(`Received ${receivedValue}`);
  });
});

function expectFeedbackAboveViewport(feedbackMessage: HTMLElement): void {
  const previewFrame = screen.getByTestId('map-maker-preview-frame');
  const displayFrame = screen.getByTestId('map-maker-display-frame');
  const viewport = screen.getByTestId('map-maker-canvas-viewport');
  const feedbackRow = feedbackMessage.parentElement;

  expect(feedbackRow?.parentElement).toBe(previewFrame);
  expect(previewFrame.contains(feedbackMessage)).toBe(true);
  expect(displayFrame.contains(feedbackMessage)).toBe(false);
  expect(feedbackRow?.nextElementSibling).toBe(viewport);
}
