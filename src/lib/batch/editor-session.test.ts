// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BatchVisualDraft } from '@/lib/batch/editor-draft';
import type { BatchItem } from '@/lib/batch/types';
import { useEditorStore } from '@/lib/store/editor-store';
import type { TextBox } from '@/types/editor';

const imageFileMocks = vi.hoisted(() => ({
  loadBatchImageFile: vi.fn(),
}));

const analyticsMocks = vi.hoisted(() => ({
  trackUploadImage: vi.fn(),
}));

vi.mock('@/lib/batch/image-files', () => ({
  loadBatchImageFile: imageFileMocks.loadBatchImageFile,
}));

vi.mock('@/lib/analytics', () => ({
  trackUploadImage: analyticsMocks.trackUploadImage,
}));

import {
  captureCurrentBatchDraft,
  createDefaultBatchDraft,
  loadBatchItemIntoEditor,
} from './editor-session';

const editorOwnedImage = document.createElement('img');
const savedTextBox: TextBox = {
  id: 'caption',
  content: 'Saved caption',
  x: 42,
  y: 28,
  fontSize: 24,
  fontWeight: 700,
  color: '#112233',
  align: 'center',
};

function createDraft(overrides: Partial<BatchVisualDraft> = {}): BatchVisualDraft {
  return {
    imageOffsetX: 18,
    imageOffsetY: -12,
    imageScale: 1.4,
    selectedBorderId: 'gold-ring',
    selectedMaskId: 'hexagon',
    borderLibraryMode: 'competitor',
    borderTint: '#b8860b',
    imageBorderTintEnabled: false,
    textColor: '#ffffff',
    overlayTint: '#17243a',
    borderOpacity: 0.7,
    overlayOpacity: 0.25,
    textBoxes: [{ ...savedTextBox }],
    activePresetId: 'golden-hour',
    ...overrides,
  };
}

function createBatchItem(id: string, overrides: Partial<BatchItem> = {}): BatchItem {
  return {
    id,
    file: new File(['image'], `${id}.png`, { type: 'image/png' }),
    fileName: `${id}.png`,
    previewUrl: `blob:queue-preview-${id}`,
    imageElement: document.createElement('img'),
    renderedUrl: null,
    blob: null,
    draft: null,
    status: 'pending',
    ...overrides,
  };
}

function setEditorVisualState(draft: BatchVisualDraft) {
  useEditorStore.setState({
    imageUrl: 'blob:current-editor-image',
    imageElement: document.createElement('img'),
    imageLoadRevision: 10,
    ...draft,
    selectedTextId: savedTextBox.id,
    isImageSelected: false,
    customBorders: [{ id: 'shared-border', name: 'Shared border', type: 'image' }],
    exportSize: 1024,
    renderRevision: 8,
  });
}

function getEditorVisualState() {
  const editorState = useEditorStore.getState();
  return {
    imageUrl: editorState.imageUrl,
    imageElement: editorState.imageElement,
    imageOffsetX: editorState.imageOffsetX,
    imageOffsetY: editorState.imageOffsetY,
    imageScale: editorState.imageScale,
    selectedBorderId: editorState.selectedBorderId,
    selectedMaskId: editorState.selectedMaskId,
    borderLibraryMode: editorState.borderLibraryMode,
    borderTint: editorState.borderTint,
    imageBorderTintEnabled: editorState.imageBorderTintEnabled,
    textColor: editorState.textColor,
    overlayTint: editorState.overlayTint,
    borderOpacity: editorState.borderOpacity,
    overlayOpacity: editorState.overlayOpacity,
    textBoxes: editorState.textBoxes.map((textBox) => ({ ...textBox })),
    activePresetId: editorState.activePresetId,
    selectedTextId: editorState.selectedTextId,
    isImageSelected: editorState.isImageSelected,
  };
}

describe('editor batch session adapter', () => {
  let revokeObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(),
      revokeObjectURL,
    });
    imageFileMocks.loadBatchImageFile.mockReset();
    analyticsMocks.trackUploadImage.mockReset();
    setEditorVisualState(createDraft());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('captures the editor visual draft with independent text boxes', () => {
    const capturedDraft = captureCurrentBatchDraft();

    expect(capturedDraft).toEqual(createDraft());
    capturedDraft.textBoxes[0]!.content = 'Changed outside the editor';

    expect(useEditorStore.getState().textBoxes[0]!.content).toBe('Saved caption');
  });

  it('creates a default draft that preserves shared style and resets image-specific fields', () => {
    const defaultDraft = createDefaultBatchDraft(useEditorStore.getState());

    expect(defaultDraft).toEqual(
      createDraft({
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
        textBoxes: [],
      })
    );
  });

  it('loads an editor-owned image URL instead of the queue preview URL', async () => {
    const item = createBatchItem('first');
    imageFileMocks.loadBatchImageFile.mockResolvedValue({
      url: 'blob:editor-owned-first',
      element: editorOwnedImage,
    });

    const loadResult = await loadBatchItemIntoEditor(item, createDraft());

    const editorState = useEditorStore.getState();
    expect(loadResult).toBe('loaded');
    expect(editorState.imageUrl).toBe('blob:editor-owned-first');
    expect(editorState.imageUrl).not.toBe(item.previewUrl);
    expect(editorState.imageElement).toBe(editorOwnedImage);
  });

  it('restores the stored visual draft without sharing its text boxes or replacing shared editor state', async () => {
    const storedDraft = createDraft();
    const originalCustomBorders = useEditorStore.getState().customBorders;
    imageFileMocks.loadBatchImageFile.mockResolvedValue({
      url: 'blob:editor-owned-draft',
      element: editorOwnedImage,
    });

    await loadBatchItemIntoEditor(createBatchItem('draft'), storedDraft);

    const editorState = useEditorStore.getState();
    expect(getEditorVisualState()).toMatchObject({
      imageUrl: 'blob:editor-owned-draft',
      ...storedDraft,
      selectedTextId: null,
      isImageSelected: true,
    });
    expect(editorState.textBoxes).not.toBe(storedDraft.textBoxes);
    expect(editorState.textBoxes[0]).not.toBe(storedDraft.textBoxes[0]);
    expect(editorState.customBorders).toBe(originalCustomBorders);
    expect(editorState.exportSize).toBe(1024);

    editorState.textBoxes[0]!.content = 'Editor-only change';
    expect(storedDraft.textBoxes[0]!.content).toBe('Saved caption');
  });

  it('uses the current shared style with default transform and no text when the item has no draft', async () => {
    imageFileMocks.loadBatchImageFile.mockResolvedValue({
      url: 'blob:editor-owned-default',
      element: editorOwnedImage,
    });

    await loadBatchItemIntoEditor(createBatchItem('default'), null);

    expect(getEditorVisualState()).toMatchObject({
      imageUrl: 'blob:editor-owned-default',
      ...createDraft({
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
        textBoxes: [],
      }),
      selectedTextId: null,
      isImageSelected: true,
    });
  });

  it('revokes a stale editor-owned URL without overwriting the newer selection', async () => {
    let resolveFirstImage: ((result: { url: string; element: HTMLImageElement }) => void) | undefined;
    let resolveSecondImage: ((result: { url: string; element: HTMLImageElement }) => void) | undefined;
    imageFileMocks.loadBatchImageFile
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirstImage = resolve;
          })
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecondImage = resolve;
          })
      );

    const firstLoad = loadBatchItemIntoEditor(createBatchItem('first'), createDraft());
    const secondLoad = loadBatchItemIntoEditor(
      createBatchItem('second'),
      createDraft({ imageOffsetX: 4, imageOffsetY: 6, imageScale: 1.2 })
    );

    resolveSecondImage?.({ url: 'blob:editor-owned-second', element: editorOwnedImage });
    const secondLoadResult = await secondLoad;
    resolveFirstImage?.({ url: 'blob:editor-owned-first', element: document.createElement('img') });
    const firstLoadResult = await firstLoad;

    expect(secondLoadResult).toBe('loaded');
    expect(firstLoadResult).toBe('superseded');
    expect(useEditorStore.getState().imageUrl).toBe('blob:editor-owned-second');
    expect(useEditorStore.getState().imageOffsetX).toBe(4);
    expect(useEditorStore.getState().imageOffsetY).toBe(6);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:editor-owned-first');
  });

  it('propagates image load failures with the file name and preserves the current editor image and visual state', async () => {
    const beforeLoad = getEditorVisualState();
    const failedItem = createBatchItem('broken');
    imageFileMocks.loadBatchImageFile.mockRejectedValue(new Error('Failed to load: broken.png'));

    await expect(loadBatchItemIntoEditor(failedItem, createDraft())).rejects.toThrow(
      'Failed to load: broken.png'
    );

    expect(getEditorVisualState()).toEqual(beforeLoad);
  });

  it('does not report internal batch-item switching as an upload', async () => {
    imageFileMocks.loadBatchImageFile.mockResolvedValue({
      url: 'blob:editor-owned-no-analytics',
      element: editorOwnedImage,
    });

    await loadBatchItemIntoEditor(createBatchItem('no-analytics'), createDraft());

    expect(analyticsMocks.trackUploadImage).not.toHaveBeenCalled();
  });
});
