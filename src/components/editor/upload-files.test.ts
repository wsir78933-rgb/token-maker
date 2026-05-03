// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useEditorStore } from '@/lib/store/editor-store';
import { loadEditorImageFile } from './upload-files';

class MockImage {
  static instances: MockImage[] = [];

  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private currentSrc = '';

  constructor() {
    MockImage.instances.push(this);
  }

  set src(value: string) {
    this.currentSrc = value;
  }

  get src() {
    return this.currentSrc;
  }
}

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

function resetEditorStore() {
  useEditorStore.getState().resetAll();
}

describe('loadEditorImageFile', () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;
  let localStorageMock: Storage;

  beforeEach(() => {
    MockImage.instances = [];
    vi.stubGlobal('Image', MockImage);
    localStorageMock = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      length: 0,
    };
    vi.stubGlobal('localStorage', localStorageMock);
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: localStorageMock,
    });

    let urlIndex = 0;
    createObjectURL = vi.fn(() => {
      urlIndex += 1;
      return `blob:image-${urlIndex}`;
    });
    revokeObjectURL = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });

    resetEditorStore();
  });

  afterEach(() => {
    resetEditorStore();
    vi.unstubAllGlobals();

    if (originalCreateObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: originalCreateObjectURL,
      });
    } else {
      Reflect.deleteProperty(URL, 'createObjectURL');
    }

    if (originalRevokeObjectURL) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        configurable: true,
        value: originalRevokeObjectURL,
      });
    } else {
      Reflect.deleteProperty(URL, 'revokeObjectURL');
    }
  });

  it('keeps the newest image when an older load finishes later', () => {
    const firstFile = new File(['first'], 'first.png', { type: 'image/png' });
    const secondFile = new File(['second'], 'second.png', { type: 'image/png' });

    loadEditorImageFile(firstFile);
    loadEditorImageFile(secondFile);

    MockImage.instances[1]?.onload?.();
    expect(useEditorStore.getState().imageUrl).toBe('blob:image-2');

    MockImage.instances[0]?.onload?.();
    expect(useEditorStore.getState().imageUrl).toBe('blob:image-2');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:image-1');
  });

  it('does not restore a pending image after the workspace is cleared', () => {
    const file = new File(['first'], 'first.png', { type: 'image/png' });

    loadEditorImageFile(file);
    useEditorStore.getState().clearImage();
    MockImage.instances[0]?.onload?.();

    expect(useEditorStore.getState().imageUrl).toBeNull();
    expect(useEditorStore.getState().imageElement).toBeNull();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:image-1');
  });
});
