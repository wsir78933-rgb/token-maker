// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { useEditorStore } from '@/lib/store/editor-store';

const navigationMockState = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => navigationMockState.searchParams,
}));

import { EditorSearchParamsSync } from './EditorSearchParamsSync';

function resetStore() {
  useEditorStore.getState().resetAll();
}

describe('EditorSearchParamsSync', () => {
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
    navigationMockState.searchParams = new URLSearchParams();
    resetStore();
  });

  afterEach(() => {
    cleanup();
    resetStore();
    vi.unstubAllGlobals();
  });

  it('applies a border tint from editor URL search params', () => {
    navigationMockState.searchParams = new URLSearchParams(
      'preset=rogue&mask=circle&border=plain-thin-ring&borderTint=%238F0F0F'
    );

    render(<EditorSearchParamsSync />);

    expect(useEditorStore.getState().selectedBorderId).toBe('plain-thin-ring');
    expect(useEditorStore.getState().selectedMaskId).toBe('circle');
    expect(useEditorStore.getState().borderTint).toBe('#8F0F0F');
  });
});
