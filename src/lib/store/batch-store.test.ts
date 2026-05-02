// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBatchStore } from '@/lib/store/batch-store';

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private currentSrc = '';

  set src(value: string) {
    this.currentSrc = value;
    window.setTimeout(() => {
      this.onload?.();
    }, 0);
  }

  get src() {
    return this.currentSrc;
  }
}

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

function resetBatchStore() {
  useBatchStore.setState({
    isActive: false,
    items: [],
    isProcessing: false,
  });
}

describe('batch store object URLs', () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    resetBatchStore();
    vi.stubGlobal('Image', MockImage);

    let urlIndex = 0;
    createObjectURL = vi.fn(() => {
      urlIndex += 1;
      return `blob:test-${urlIndex}`;
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
  });

  afterEach(() => {
    resetBatchStore();
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
    vi.useRealTimers();
  });

  it('移除条目后异步加载完成会释放刚创建的 preview URL', async () => {
    const file = new File(['image'], 'token.png', { type: 'image/png' });

    useBatchStore.getState().addFiles([file]);
    const item = useBatchStore.getState().items[0];
    expect(item).toBeDefined();

    useBatchStore.getState().removeItem(item!.id);
    await vi.advanceTimersByTimeAsync(0);

    expect(useBatchStore.getState().items).toHaveLength(0);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-1');
  });
});
