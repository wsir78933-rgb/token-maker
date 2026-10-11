// @vitest-environment jsdom

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createDefaultMapMakerProject,
  MAP_MAKER_DEFAULT_COLUMNS,
  MAP_MAKER_DEFAULT_ROWS,
  resizeMapMakerProject,
  saveMapMakerSlot,
} from '@/lib/map-maker';
import { getMapMakerCopy } from '@/lib/map-maker/copy';

import { useMapMakerWorkbench } from './useMapMakerWorkbench';

function installImmediateImageLoading(): void {
  class ImmediateImage {
    naturalWidth = 80;
    naturalHeight = 80;
    crossOrigin: string | null = null;
    onload: ((event: Event) => void) | null = null;
    onerror: ((event: Event | string) => void) | null = null;
    private imageUrl = '';

    set src(receivedUrl: string) {
      this.imageUrl = receivedUrl;
      this.onload?.(new Event('load'));
    }

    get src(): string {
      return this.imageUrl;
    }
  }

  vi.stubGlobal('Image', ImmediateImage);
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useMapMakerWorkbench default column initialization', () => {
  it('initializes only once and retains the default row count', () => {
    const { result } = renderHook(() => useMapMakerWorkbench(getMapMakerCopy('en').workspace));

    act(() => result.current.initializeDefaultMapColumns(9));
    act(() => result.current.initializeDefaultMapColumns(11));

    expect(result.current.project.columns).toBe(9);
    expect(result.current.project.rows).toBe(MAP_MAKER_DEFAULT_ROWS);
    expect(result.current.project.baseTiles).toHaveLength(9 * MAP_MAKER_DEFAULT_ROWS);
  });

  it('preserves a manually resized project when initial columns arrive later', () => {
    const { result } = renderHook(() => useMapMakerWorkbench(getMapMakerCopy('en').workspace));

    act(() => result.current.handleApplySize(8, MAP_MAKER_DEFAULT_ROWS));
    const manuallyResizedProject = result.current.project;
    act(() => result.current.initializeDefaultMapColumns(10));

    expect(result.current.project).toBe(manuallyResizedProject);
    expect(result.current.project.columns).toBe(8);
  });

  it('preserves a project edited before initial columns arrive', () => {
    const { result } = renderHook(() => useMapMakerWorkbench(getMapMakerCopy('en').workspace));

    act(() => {
      result.current.handleChangeSettings({ hexGridVisible: true });
      result.current.initializeDefaultMapColumns(9);
    });

    expect(result.current.project.columns).toBe(MAP_MAKER_DEFAULT_COLUMNS);
    expect(result.current.project.settings.hexGridVisible).toBe(true);
  });

  it('preserves a loaded save slot when initial columns arrive later', async () => {
    const loadedProject = resizeMapMakerProject(
      createDefaultMapMakerProject(),
      8,
      MAP_MAKER_DEFAULT_ROWS,
    );
    saveMapMakerSlot(1, loadedProject, window.localStorage);
    installImmediateImageLoading();
    const { result } = renderHook(() => useMapMakerWorkbench(getMapMakerCopy('en').workspace));

    await act(async () => {
      await result.current.handleLoadSlot(1);
    });
    const projectFromSaveSlot = result.current.project;
    act(() => result.current.initializeDefaultMapColumns(10));

    expect(result.current.actionError).toBeNull();
    expect(result.current.project).toBe(projectFromSaveSlot);
    expect(result.current.project.columns).toBe(8);
    expect(result.current.project.rows).toBe(MAP_MAKER_DEFAULT_ROWS);
  });
});
