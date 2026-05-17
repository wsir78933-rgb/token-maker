// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@/lib/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}));

vi.mock('@/lib/store/batch-store', () => ({
  useBatchStore: { getState: () => ({ activate: vi.fn(), addFiles: vi.fn() }) },
}));

vi.mock('@/lib/analytics', () => ({
  trackUploadImage: vi.fn(),
  trackUseBatchMode: vi.fn(),
}));

vi.mock('@/components/site/ImageUploaderShowcaseStrip', () => ({
  ImageUploaderShowcaseStrip: () => null,
}));

vi.mock('./upload-files', () => ({
  extractImageFiles: vi.fn(() => []),
  getSupportedImageFiles: vi.fn((files: File[]) => files.filter((f) => f.type.startsWith('image/'))),
  loadEditorImageFile: vi.fn(),
}));

import { ImageUploader } from './ImageUploader';
import { loadEditorImageFile } from './upload-files';

describe('ImageUploader', () => {
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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders upload prompt text', () => {
    render(<ImageUploader />);
    expect(screen.getAllByText('dropHint').length).toBeGreaterThan(0);
    expect(screen.getAllByText('orClickToUpload').length).toBeGreaterThan(0);
    expect(screen.getAllByText('supportedFormats').length).toBeGreaterThan(0);
  });

  it('opens file input on click', () => {
    render(<ImageUploader />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.className).toContain('hidden');
  });

  it('calls loadEditorImageFile when a single image is selected via input', () => {
    render(<ImageUploader />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['img'], 'test.png', { type: 'image/png' });

    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    expect(loadEditorImageFile).toHaveBeenCalledWith(file);
  });

  it('activates drag state on dragEnter and clears on dragLeave', () => {
    render(<ImageUploader />);
    const dropZone = screen.getAllByText('dropHint')[0].closest('div[class*="border-dashed"]')!;

    const dataTransfer = { files: [new File([], 'x.png')], items: [], types: ['Files'] };

    fireEvent.dragEnter(dropZone, { dataTransfer });
    expect(dropZone.className).toContain('border-primary');

    fireEvent.dragLeave(dropZone, { dataTransfer });
    expect(dropZone.className).not.toContain('border-primary');
  });

  it('accepts multiple attribute on file input', () => {
    render(<ImageUploader />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.multiple).toBe(true);
  });
});
