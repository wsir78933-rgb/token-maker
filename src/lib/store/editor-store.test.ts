// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BorderTemplate } from '@/types/editor';

type EditorStoreApi = typeof import('./editor-store')['useEditorStore'];

const temporaryCustomBorder: BorderTemplate = {
  id: 'custom-border-test',
  name: 'Custom',
  type: 'image',
  isCustom: true,
  customImageUrl: 'blob:custom-border-test',
};

function createLocalStorageMock(persistedValue: string | null): Storage {
  return {
    getItem: vi.fn(() => persistedValue),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(() => null),
    length: 0,
  };
}

describe('editor store persistence', () => {
  let localStorageMock: Storage;
  let useEditorStore: EditorStoreApi;

  function resetEditorStore() {
    useEditorStore.getState().resetAll();
  }

  async function loadEditorStore(persistedValue: string | null = null) {
    vi.resetModules();
    localStorageMock = createLocalStorageMock(persistedValue);
    vi.stubGlobal('localStorage', localStorageMock);
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: localStorageMock,
    });

    ({ useEditorStore } = await import('./editor-store'));
  }

  beforeEach(async () => {
    await loadEditorStore();
    resetEditorStore();
    vi.mocked(localStorageMock.setItem).mockClear();
  });

  afterEach(() => {
    resetEditorStore();
    vi.unstubAllGlobals();
  });

  it('does not persist temporary custom border images or selections', () => {
    useEditorStore.getState().addCustomBorder(temporaryCustomBorder);
    useEditorStore.getState().setSelectedBorder(temporaryCustomBorder.id);

    const persistedValue = vi.mocked(localStorageMock.setItem).mock.calls.at(-1)?.[1];

    expect(persistedValue).toBeDefined();
    expect(persistedValue).not.toContain('customBorders');
    expect(persistedValue).not.toContain(temporaryCustomBorder.id);
    expect(persistedValue).not.toContain(temporaryCustomBorder.customImageUrl);
    expect(JSON.parse(persistedValue as string).state.selectedBorderId).toBe('plain-thin-ring');
  });

  it('rewrites old persisted custom borders without stored images', async () => {
    const oldCustomBorderUrl = 'data:image/png;base64,old-custom-border';
    const oldPersistedValue = JSON.stringify({
      state: {
        selectedBorderId: 'custom-border-old',
        selectedMaskId: 'circle',
        customBorders: [
          {
            id: 'custom-border-old',
            name: 'Custom',
            type: 'image',
            isCustom: true,
            customImageUrl: oldCustomBorderUrl,
          },
        ],
      },
    });

    await loadEditorStore(oldPersistedValue);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const persistedValue = vi.mocked(localStorageMock.setItem).mock.calls.at(-1)?.[1];

    expect(useEditorStore.getState().customBorders).toEqual([]);
    expect(useEditorStore.getState().selectedBorderId).toBe('plain-thin-ring');
    expect(persistedValue).toBeDefined();
    expect(persistedValue).not.toContain('customBorders');
    expect(persistedValue).not.toContain('custom-border-old');
    expect(persistedValue).not.toContain(oldCustomBorderUrl);
  });
});
