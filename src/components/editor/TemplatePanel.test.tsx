// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';

const i18nMockState = vi.hoisted(() => ({
  locale: 'en' as 'en' | 'zh',
  messages: {} as Record<string, string>,
}));

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => i18nMockState.messages[key] ?? key,
    locale: i18nMockState.locale,
  }),
}));

vi.mock('@/lib/analytics', () => ({
  trackApplyBorder: vi.fn(),
}));

vi.mock('@/lib/renderer/borders', () => ({
  drawBorderThumbnail: vi.fn(),
}));

vi.mock('@/lib/utils/imageCache', () => ({
  preloadImageToCache: vi.fn(async () => new Image()),
}));

vi.mock('./export-token', () => ({
  downloadCurrentTokenWithSharePrompt: vi.fn(),
  getLocalizedName: (key: string, t: (key: string) => string) => t(key),
}));

import { TemplatePanel } from './TemplatePanel';
import { preloadImageToCache } from '@/lib/utils/imageCache';

const preloadImageToCacheMock = vi.mocked(preloadImageToCache);
const originalCreateObjectURL = URL.createObjectURL;
let scrollIntoViewMock: ReturnType<typeof vi.fn>;

function getBorderScrollRegion(borderButton: HTMLElement) {
  const borderGridElement = borderButton.parentElement?.parentElement;
  const borderScrollRegion = borderGridElement?.parentElement;

  if (!(borderScrollRegion instanceof HTMLDivElement)) {
    throw new Error(`Could not find border scroll region for: ${borderButton.getAttribute('aria-label')}`);
  }

  return borderScrollRegion;
}

function setElementNumberProperty(element: Element, propertyName: string, value: number) {
  Object.defineProperty(element, propertyName, {
    configurable: true,
    value,
  });
}

function setElementRect(
  element: Element,
  rect: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>
) {
  element.getBoundingClientRect = vi.fn(() => ({
    ...rect,
    x: rect.left,
    y: rect.top,
    toJSON: () => rect,
  })) as unknown as typeof element.getBoundingClientRect;
}

function resetStore() {
  useEditorStore.getState().resetAll();
}

describe('TemplatePanel preset border assets', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    i18nMockState.locale = 'en';
    i18nMockState.messages = {
      customBorderName: 'Custom',
    };
    vi.stubGlobal('CSS', { escape: (value: string) => value });
    scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView =
      scrollIntoViewMock as typeof Element.prototype.scrollIntoView;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fill: vi.fn(),
      strokeStyle: '',
      fillStyle: '',
      lineWidth: 0,
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    localStorageMock = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    };
    vi.stubGlobal('localStorage', localStorageMock);
    resetStore();
  });

  afterEach(() => {
    cleanup();
    resetStore();
    vi.unstubAllGlobals();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    });
    vi.clearAllMocks();
  });

  it('uses the editor layout side panel width on desktop', () => {
    const { container } = render(<TemplatePanel />);

    const templatePanelRoot = container.firstElementChild;

    expect(templatePanelRoot?.className).toContain('xl:w-[var(--editor-side-panel-width)]');
    expect(templatePanelRoot?.className).not.toContain('xl:w-80');
  });

  it('uses compact desktop preset buttons to leave more room for border templates', () => {
    render(<TemplatePanel />);

    const warriorPresetButton = screen.getByTitle('warrior');
    const presetGrid = warriorPresetButton.parentElement;

    expect(presetGrid?.className).toContain('xl:grid-cols-4');
    expect(presetGrid?.className).not.toContain('xl:grid-cols-3');
    expect(warriorPresetButton.className).toContain('xl:h-16');
    expect(warriorPresetButton.className).toContain('xl:aspect-auto');
    expect(warriorPresetButton.className).not.toContain('xl:aspect-square');
  });

  it('shows warrior borders inside the border templates after the warrior preset is selected', () => {
    render(<TemplatePanel />);

    fireEvent.click(screen.getByTitle('warrior'));

    expect(screen.getByRole('button', { name: 'border.warrior.01' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'border.tff-weathered-copper-ring' })).toBeNull();
  });

  it('does not scroll the page when the border templates mount', () => {
    render(<TemplatePanel />);

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('keeps the border templates list position when a visible lower border is selected', async () => {
    render(<TemplatePanel />);

    const lowerBorderButton = screen.getByRole('button', { name: 'border.tff-arcane-lightning-ring' });
    const borderScrollRegion = getBorderScrollRegion(lowerBorderButton);
    const scrollToMock = vi.fn();

    Object.defineProperty(borderScrollRegion, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });
    borderScrollRegion.scrollTop = 300;
    borderScrollRegion.scrollLeft = 0;
    setElementNumberProperty(borderScrollRegion, 'clientHeight', 280);
    setElementNumberProperty(borderScrollRegion, 'clientWidth', 240);
    setElementNumberProperty(lowerBorderButton, 'offsetTop', 0);
    setElementNumberProperty(lowerBorderButton, 'offsetLeft', 0);
    setElementNumberProperty(lowerBorderButton, 'offsetHeight', 100);
    setElementNumberProperty(lowerBorderButton, 'offsetWidth', 100);
    setElementRect(borderScrollRegion, {
      top: 100,
      right: 340,
      bottom: 380,
      left: 100,
      width: 240,
      height: 280,
    });
    setElementRect(lowerBorderButton, {
      top: 280,
      right: 220,
      bottom: 380,
      left: 120,
      width: 100,
      height: 100,
    });

    fireEvent.click(lowerBorderButton);

    await waitFor(() => expect(scrollToMock).toHaveBeenCalled());
    expect(scrollToMock).toHaveBeenLastCalledWith({
      left: 0,
      top: 300,
      behavior: 'smooth',
    });
  });

  it('switches preset border templates when mage is selected', () => {
    render(<TemplatePanel />);

    fireEvent.click(screen.getByTitle('mage'));

    expect(screen.getByRole('button', { name: 'border.mage.01' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'border.warrior.01' })).toBeNull();
  });

  it('keeps the selected preset border family visible after a generated border is selected', () => {
    render(<TemplatePanel />);

    fireEvent.click(screen.getByTitle('warrior'));
    fireEvent.click(screen.getByRole('button', { name: 'border.warrior.01' }));

    expect(useEditorStore.getState().selectedBorderId).toBe('warrior-border-01');
    expect(screen.getByRole('button', { name: 'border.warrior.01' })).toBeDefined();
  });

  it('shows the original border library under the other preset', () => {
    render(<TemplatePanel />);

    fireEvent.click(screen.getByTitle('other'));

    expect(screen.getByRole('button', { name: 'border.metalbarbarian' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'border.tff-weathered-copper-ring' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'border.warrior.01' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'border.mage.01' })).toBeNull();
  });

  it('uses a black preview surface for generated preset border thumbnails', () => {
    render(<TemplatePanel />);

    fireEvent.click(screen.getByTitle('warrior'));

    expect(screen.getByTestId('border-thumbnail-surface-warrior-border-01').className).toContain('bg-black');
  });

  it('uses Chinese alt text for image border thumbnails', () => {
    i18nMockState.locale = 'zh';
    i18nMockState.messages = {
      ...i18nMockState.messages,
      other: '其他',
      'border.metalbarbarian': '野蛮金属',
    };

    render(<TemplatePanel />);

    expect(screen.getByAltText(/野蛮金属.*Token 边框/)).toBeDefined();
    expect(screen.queryByAltText(/Spiked barbarian metal token frame/)).toBeNull();
  });

  it('accepts large custom borders as temporary browser object URLs', async () => {
    const createObjectURL = vi.fn(() => 'blob:custom-border');
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    const customBorderFile = new File(['border'], 'large-border.webp', { type: 'image/webp' });
    Object.defineProperty(customBorderFile, 'size', {
      configurable: true,
      value: 2 * 1024 * 1024,
    });

    render(<TemplatePanel />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [customBorderFile] } });

    expect(await screen.findByRole('button', { name: 'Custom' })).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(createObjectURL).toHaveBeenCalledWith(customBorderFile);
    expect(preloadImageToCacheMock).toHaveBeenCalledWith('blob:custom-border');
    expect(useEditorStore.getState().customBorders[0]?.customImageUrl).toBe('blob:custom-border');
  });

  it('uses a Chinese default name for uploaded custom borders', async () => {
    i18nMockState.locale = 'zh';
    i18nMockState.messages = {
      ...i18nMockState.messages,
      customBorderName: '自定义边框',
    };
    const createObjectURL = vi.fn(() => 'blob:custom-border');
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    const customBorderFile = new File(['border'], 'custom-border.webp', { type: 'image/webp' });

    render(<TemplatePanel />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [customBorderFile] } });

    expect(await screen.findByRole('button', { name: '自定义边框' })).toBeDefined();
    expect(useEditorStore.getState().customBorders[0]?.name).toBe('自定义边框');
  });
});
