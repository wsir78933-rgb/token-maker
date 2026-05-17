// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}));

vi.mock('@/lib/analytics', () => ({
  trackUseBatchMode: vi.fn(),
}));

vi.mock('./export-token', () => ({
  downloadCurrentToken: vi.fn(),
}));

import { ControlPanel } from './ControlPanel';

function resetStore() {
  useEditorStore.getState().resetAll();
}

describe('ControlPanel', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
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
    resetStore();
    vi.unstubAllGlobals();
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

  it('shows text editing controls when a text box is selected', () => {
    const img = new Image();
    useEditorStore.setState({
      imageElement: img,
      imageUrl: 'blob:test',
      textBoxes: [{ id: 'txt-1', text: 'Hello', x: 0, y: 0, fontSize: 32, color: '#ffffff', fontWeight: 400, textAlign: 'center' }],
      selectedTextId: 'txt-1',
    });
    render(<ControlPanel />);
    expect(screen.getAllByText('32px').length).toBeGreaterThan(0);
    expect(screen.getAllByText('delete').length).toBeGreaterThan(0);
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
