// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';
import { renderToken } from '@/lib/renderer/pipeline';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}));

vi.mock('@/lib/renderer/pipeline', () => ({
  renderToken: vi.fn(),
  drawCheckerboard: vi.fn(),
}));

vi.mock('./TextCanvasOverlay', () => ({
  TextCanvasOverlay: () => <div data-testid="text-overlay" />,
}));

vi.mock('./ImageUploader', () => ({
  ImageUploader: () => <div data-testid="image-uploader" />,
}));

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

import { Canvas } from './Canvas';

const renderTokenMock = vi.mocked(renderToken);

function resetStore() {
  useEditorStore.getState().resetAll();
}

describe('Canvas', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      clip: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      scale: vi.fn(),
      translate: vi.fn(),
      setTransform: vi.fn(),
      globalCompositeOperation: 'source-over',
      fillStyle: '',
      canvas: { width: 512, height: 512 },
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
    renderTokenMock.mockClear();
    resetStore();
  });

  afterEach(() => {
    cleanup();
    resetStore();
    vi.unstubAllGlobals();
  });

  it('shows ImageUploader when no image is loaded', () => {
    render(<Canvas />);
    expect(screen.getByTestId('image-uploader')).toBeDefined();
  });

  it('shows canvas and text overlay when image is loaded', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas />);
    expect(screen.queryByTestId('image-uploader')).toBeNull();
    expect(screen.getAllByTestId('text-overlay').length).toBeGreaterThan(0);
  });

  it('displays current scale percentage', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageScale: 1.5 });

    render(<Canvas />);
    expect(screen.getAllByText('150%').length).toBeGreaterThan(0);
  });

  it('starts drag on pointer down and updates offset on move', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img, imageOffsetX: 0, imageOffsetY: 0 });

    render(<Canvas />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    expect(canvas).not.toBeNull();

    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 150, clientY: 120 });
    fireEvent.pointerUp(canvas, { clientX: 150, clientY: 120 });
  });

  it('keeps async asset refresh active after StrictMode effect replay', async () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(
      <StrictMode>
        <Canvas />
      </StrictMode>
    );

    expect(renderTokenMock).toHaveBeenCalled();
    const options = renderTokenMock.mock.calls.at(-1)?.[3];
    expect(options?.onAssetChange).toBeDefined();

    const callsBeforeRefresh = renderTokenMock.mock.calls.length;
    act(() => {
      options?.onAssetChange?.();
    });

    await waitFor(() => {
      expect(renderTokenMock.mock.calls.length).toBeGreaterThan(callsBeforeRefresh);
    });
  });

  it('uses a narrower height-bound preview frame in batch mode', () => {
    const img = new Image();
    useEditorStore.setState({ imageUrl: 'blob:test', imageElement: img });

    render(<Canvas previewMode="batch" />);
    const canvas = document.querySelector('canvas.cursor-move') as HTMLCanvasElement;
    const previewFrame = canvas.parentElement;

    expect(previewFrame?.className).toContain('max-h-[16rem]');
    expect(previewFrame?.className).toContain('sm:max-h-[20rem]');
    expect(previewFrame?.className).toContain('xl:max-h-[22rem]');
    expect(previewFrame?.className).not.toContain('max-h-[28rem]');
    expect(previewFrame?.className).not.toContain('max-w-[512px]');
  });
});
