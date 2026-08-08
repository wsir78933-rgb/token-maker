// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

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
  trackUseBatchMode: vi.fn(),
}));

import { ControlPanel } from './ControlPanel';

function resetStore() {
  useEditorStore.getState().resetAll();
}

describe('ControlPanel', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    i18nMockState.locale = 'en';
    i18nMockState.messages = {};
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
  });

  it('uses the editor layout side panel width on desktop', () => {
    const { container } = render(<ControlPanel />);

    const controlPanelRoot = container.firstElementChild;

    expect(controlPanelRoot?.className).toContain('xl:w-[var(--editor-side-panel-width)]');
    expect(controlPanelRoot?.className).not.toContain('xl:w-80');
  });

  it('renders section headings', () => {
    render(<ControlPanel />);
    expect(screen.getByText('imageSettings')).toBeDefined();
    expect(screen.getByText('textSettings')).toBeDefined();
    expect(screen.getByText('styleSettings')).toBeDefined();
  });

  it('displays current image scale percentage', () => {
    useEditorStore.setState({ imageScale: 2.0 });
    render(<ControlPanel />);
    expect(screen.getAllByText('200%').length).toBeGreaterThan(0);
  });

  it('disables add text button when no image is loaded', () => {
    render(<ControlPanel />);
    const addTextBtns = screen.getAllByText(/addText/);
    expect(addTextBtns[0].closest('button')?.disabled).toBe(true);
  });

  it('enables add text button when image is loaded', () => {
    const img = new Image();
    useEditorStore.setState({ imageElement: img, imageUrl: 'blob:test' });
    render(<ControlPanel />);
    const addTextBtns = screen.getAllByText(/addText/);
    expect(addTextBtns[0].closest('button')?.disabled).toBe(false);
  });

  it('does not render a download control when an image is loaded', () => {
    i18nMockState.messages = { download: 'Download' };
    const imageElement = new Image();
    useEditorStore.setState({ imageElement, imageUrl: 'blob:test' });

    render(<ControlPanel />);

    expect(screen.queryByRole('button', { name: 'Download' })).toBeNull();
  });

  it('adds Chinese default text content from the control panel copy', () => {
    i18nMockState.locale = 'zh';
    i18nMockState.messages = {
      addText: '添加文字',
      defaultTextContent: '新文本',
    };
    const img = new Image();
    useEditorStore.setState({ imageElement: img, imageUrl: 'blob:test' });

    render(<ControlPanel />);
    const addTextButtons = screen.getAllByRole('button', { name: /\+ 添加文字/ });
    fireEvent.click(addTextButtons.at(-1)!);

    expect(useEditorStore.getState().textBoxes[0]?.content).toBe('新文本');
  });

  it('shows text editing controls when a text box is selected', () => {
    const img = new Image();
    useEditorStore.setState({
      imageElement: img,
      imageUrl: 'blob:test',
      textBoxes: [
        {
          id: 'txt-1',
          content: 'Hello',
          x: 0,
          y: 0,
          fontSize: 32,
          color: '#ffffff',
          fontWeight: 400,
          align: 'center',
        },
      ],
      selectedTextId: 'txt-1',
    });
    render(<ControlPanel />);
    expect(screen.getAllByText('32px').length).toBeGreaterThan(0);
    expect(screen.getAllByText('delete').length).toBeGreaterThan(0);
  });

  it.each([
    { locale: 'en' as const, fontFamilyLabel: 'Font Family' },
    { locale: 'zh' as const, fontFamilyLabel: '字体' },
  ])('updates the selected text font through the $locale font selector', ({ locale, fontFamilyLabel }) => {
    i18nMockState.locale = locale;
    i18nMockState.messages = { fontFamily: fontFamilyLabel };
    const imageElement = new Image();
    useEditorStore.setState({
      imageElement,
      imageUrl: 'blob:test',
      textBoxes: [
        {
          id: 'txt-1',
          content: 'Hello',
          x: 0,
          y: 0,
          fontSize: 32,
          color: '#ffffff',
          fontWeight: 400,
          align: 'center',
        },
      ],
      selectedTextId: 'txt-1',
    });

    render(<ControlPanel />);

    const fontFamilySelector = screen.getByRole('combobox', { name: fontFamilyLabel });

    expect(fontFamilySelector.querySelectorAll('option')).toHaveLength(11);

    fireEvent.change(fontFamilySelector, { target: { value: 'noto-serif-sc' } });

    expect(useEditorStore.getState().textBoxes[0]?.fontId).toBe('noto-serif-sc');
  });

  it('keeps the font selector available when the selected text color is empty', () => {
    i18nMockState.messages = { fontFamily: 'Font Family' };
    useEditorStore.setState({
      textBoxes: [
        {
          id: 'txt-empty-color',
          content: 'Hello',
          x: 0,
          y: 0,
          fontSize: 32,
          color: '',
          fontWeight: 400,
          align: 'center',
        },
      ],
      selectedTextId: 'txt-empty-color',
    });

    render(<ControlPanel />);

    expect(screen.getByRole('combobox', { name: 'Font Family' })).toBeDefined();
  });

  it('calls clearImage when clear button is clicked', () => {
    const img = new Image();
    useEditorStore.setState({ imageElement: img, imageUrl: 'blob:test' });
    render(<ControlPanel />);
    const clearBtns = screen.getAllByTitle('clearWorkspace');
    fireEvent.click(clearBtns[0]);
    expect(useEditorStore.getState().imageElement).toBeNull();
  });

  it('calls resetPosition when reset button is clicked', () => {
    const img = new Image();
    useEditorStore.setState({ imageElement: img, imageUrl: 'blob:test', imageOffsetX: 50, imageOffsetY: 30 });
    render(<ControlPanel />);
    const resetBtns = screen.getAllByTitle('resetPosition');
    fireEvent.click(resetBtns[0]);
    expect(useEditorStore.getState().imageOffsetX).toBe(0);
    expect(useEditorStore.getState().imageOffsetY).toBe(0);
  });
});
