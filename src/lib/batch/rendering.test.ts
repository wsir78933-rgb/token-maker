// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { captureBatchVisualDraft } from './editor-draft';
import { renderBatchItem } from './rendering';
import type { BatchItem } from './types';
import type { EditorState } from '@/types/editor';

const pipelineMocks = vi.hoisted(() => ({
  exportTokenAsPNG: vi.fn(),
}));

const originalCreateObjectURL = URL.createObjectURL;

vi.mock('@/lib/renderer/pipeline', () => ({
  exportTokenAsPNG: pipelineMocks.exportTokenAsPNG,
}));

function createEditorState(overrides: Partial<EditorState> = {}): EditorState {
  return {
    imageUrl: 'blob:editor-image',
    imageElement: new Image(),
    imageLoadRevision: 2,
    imageOffsetX: 4,
    imageOffsetY: -6,
    imageScale: 1.25,
    selectedBorderId: 'thin-gold',
    selectedMaskId: 'circle',
    customBorders: [{ id: 'shared-border', name: 'Shared border', type: 'image' }],
    borderLibraryMode: 'competitor',
    borderTint: '#b8860b',
    imageBorderTintEnabled: true,
    textColor: '#ffffff',
    overlayTint: '#001122',
    borderOpacity: 0.8,
    overlayOpacity: 0.2,
    textBoxes: [
      {
        id: 'caption',
        content: 'Original',
        x: 50,
        y: 80,
        fontSize: 24,
        fontWeight: 600,
        color: '#ffffff',
        align: 'center',
      },
    ],
    selectedTextId: 'caption',
    isImageSelected: true,
    exportSize: 512,
    activePresetId: 'golden-hour',
    renderRevision: 8,
    ...overrides,
  };
}

function createBatchItem(overrides: Partial<BatchItem> = {}): BatchItem {
  return {
    id: 'batch-item',
    file: new File(['image'], 'knight.png', { type: 'image/png' }),
    fileName: 'knight.png',
    previewUrl: 'blob:preview-knight',
    imageElement: new Image(),
    renderedUrl: null,
    blob: null,
    draft: null,
    status: 'pending',
    ...overrides,
  };
}

describe('renderBatchItem', () => {
  beforeEach(() => {
    pipelineMocks.exportTokenAsPNG.mockReset();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:rendered-knight'),
    });
  });

  afterEach(() => {
    if (originalCreateObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: originalCreateObjectURL,
      });
    } else {
      Reflect.deleteProperty(URL, 'createObjectURL');
    }
  });

  it('renders the item draft while preserving shared custom borders from the editor state', async () => {
    const editorState = createEditorState();
    const item = createBatchItem();
    const draft = captureBatchVisualDraft(editorState);
    draft.imageOffsetX = 19;
    draft.imageScale = 2;
    draft.textBoxes[0]!.content = 'Knight';
    const renderedBlob = new Blob(['png'], { type: 'image/png' });
    pipelineMocks.exportTokenAsPNG.mockResolvedValue(renderedBlob);

    await renderBatchItem(item, editorState, 512, draft);

    const renderedState = pipelineMocks.exportTokenAsPNG.mock.calls[0]?.[0] as EditorState;
    expect(renderedState).toMatchObject({
      imageUrl: null,
      imageElement: item.imageElement,
      imageOffsetX: 19,
      imageOffsetY: -6,
      imageScale: 2,
      selectedTextId: null,
      isImageSelected: false,
      textBoxes: [expect.objectContaining({ content: 'Knight' })],
    });
    expect(renderedState.customBorders).toBe(editorState.customBorders);
    expect(pipelineMocks.exportTokenAsPNG).toHaveBeenCalledWith(renderedState, 512);
  });

  it('includes the item file name when the queued image is not loaded', async () => {
    const editorState = createEditorState();
    const unloadedItem = createBatchItem({ fileName: 'unloaded.png', imageElement: null });

    await expect(
      renderBatchItem(unloadedItem, editorState, 512, captureBatchVisualDraft(editorState))
    ).rejects.toThrow('Batch image not loaded: "unloaded.png"');
    expect(pipelineMocks.exportTokenAsPNG).not.toHaveBeenCalled();
  });

  it('includes the item file name when PNG rendering returns no Blob', async () => {
    const editorState = createEditorState();
    const item = createBatchItem({ fileName: 'empty.png' });
    pipelineMocks.exportTokenAsPNG.mockResolvedValue(null);

    await expect(
      renderBatchItem(item, editorState, 512, captureBatchVisualDraft(editorState))
    ).rejects.toThrow('Batch render failed: "empty.png"');
  });
});
