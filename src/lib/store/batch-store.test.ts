// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { captureBatchVisualDraft } from '@/lib/batch/editor-draft';
import type { BatchItem } from '@/lib/batch/types';
import type { EditorState } from '@/types/editor';

const renderingMocks = vi.hoisted(() => ({
  renderBatchItem: vi.fn(),
}));

vi.mock('@/lib/batch/rendering', () => ({
  renderBatchItem: renderingMocks.renderBatchItem,
}));

import { getNextIncompleteItemId, useBatchStore } from '@/lib/store/batch-store';

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
    selectedItemId: null,
  });
}

function createEditorState(overrides: Partial<EditorState> = {}): EditorState {
  return {
    imageUrl: 'blob:editor-image',
    imageElement: new Image(),
    imageLoadRevision: 3,
    imageOffsetX: 12,
    imageOffsetY: -8,
    imageScale: 1.5,
    selectedBorderId: 'gold-ring',
    selectedMaskId: 'hexagon',
    customBorders: [{ id: 'shared-border', name: 'Shared border', type: 'image' }],
    borderLibraryMode: 'competitor',
    borderTint: '#b8860b',
    imageBorderTintEnabled: false,
    textColor: '#ffffff',
    overlayTint: '#17243a',
    borderOpacity: 0.7,
    overlayOpacity: 0.25,
    textBoxes: [
      {
        id: 'title',
        content: 'Captain',
        x: 50,
        y: 20,
        fontSize: 32,
        fontWeight: 700,
        color: '#ffffff',
        align: 'center',
      },
    ],
    selectedTextId: 'title',
    isImageSelected: true,
    exportSize: 512,
    activePresetId: 'golden-hour',
    renderRevision: 4,
    ...overrides,
  };
}

function createBatchItem(id: string, overrides: Partial<BatchItem> = {}): BatchItem {
  return {
    id,
    file: new File(['image'], `${id}.png`, { type: 'image/png' }),
    fileName: `${id}.png`,
    previewUrl: `blob:preview-${id}`,
    imageElement: new Image(),
    renderedUrl: null,
    blob: null,
    draft: null,
    status: 'pending',
    ...overrides,
  };
}

function setBatchItems(items: BatchItem[], selectedItemId: string | null = null) {
  useBatchStore.setState({
    isActive: true,
    items,
    isProcessing: false,
    selectedItemId,
  });
}

describe('batch store object URLs', () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    resetBatchStore();
    vi.stubGlobal('Image', MockImage);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    renderingMocks.renderBatchItem.mockReset();

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
    vi.restoreAllMocks();
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

  it('首图预览回调失败时会释放额外创建的 preview URL', async () => {
    const file = new File(['image'], 'token.png', { type: 'image/png' });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const onFirstImageReady = vi.fn(async () => {
      throw new Error('preview failed');
    });

    useBatchStore.getState().addFiles([file], {
      shouldUseFirstImagePreview: () => true,
      onFirstImageReady,
    });

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(0);
    await vi.waitFor(() => {
      expect(onFirstImageReady).toHaveBeenCalled();
    });

    expect(createObjectURL).toHaveBeenCalledTimes(2);
    expect(useBatchStore.getState().items[0]?.previewUrl).toBe('blob:test-1');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-2');
    expect(warn).toHaveBeenCalledWith(
      'Batch editor preview failed: "token.png"',
      expect.any(Error)
    );
  });

  it('records the file name when an image fails to load', async () => {
    class FailingImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        window.setTimeout(() => {
          this.onerror?.();
        }, 0);
      }
    }

    vi.stubGlobal('Image', FailingImage);
    useBatchStore.getState().addFiles([new File(['broken'], 'broken.png', { type: 'image/png' })]);

    await vi.advanceTimersByTimeAsync(0);

    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'error',
      error: 'Failed to load: broken.png',
    });
  });
});

describe('batch store selection and drafts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetBatchStore();
    vi.stubGlobal('Image', MockImage);

    let urlIndex = 0;
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => {
        urlIndex += 1;
        return `blob:selection-${urlIndex}`;
      }),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
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

  it('selects the first added image and preserves a valid existing selection on later additions', () => {
    useBatchStore.getState().addFiles([
      new File(['first'], 'first.png', { type: 'image/png' }),
      new File(['second'], 'second.png', { type: 'image/png' }),
    ]);

    const firstItemId = useBatchStore.getState().items[0]?.id;
    expect(firstItemId).toBeDefined();
    expect(useBatchStore.getState().selectedItemId).toBe(firstItemId);

    useBatchStore.getState().addFiles([new File(['third'], 'third.png', { type: 'image/png' })]);

    expect(useBatchStore.getState().selectedItemId).toBe(firstItemId);
  });

  it('rejects selecting an item ID that is absent from the queue', () => {
    setBatchItems([createBatchItem('present')]);

    expect(() => useBatchStore.getState().selectItem('missing-item')).toThrow(
      'Batch item not found: "missing-item"'
    );
  });

  it('moves selected removal forward then backward and clears selection on clear or deactivate', () => {
    const first = createBatchItem('first');
    const second = createBatchItem('second');
    const third = createBatchItem('third');
    setBatchItems([first, second, third], second.id);

    useBatchStore.getState().removeItem(second.id);
    expect(useBatchStore.getState().selectedItemId).toBe(third.id);

    useBatchStore.getState().removeItem(third.id);
    expect(useBatchStore.getState().selectedItemId).toBe(first.id);

    useBatchStore.getState().clearAll();
    expect(useBatchStore.getState().selectedItemId).toBeNull();

    setBatchItems([createBatchItem('replacement')], 'replacement');
    useBatchStore.getState().deactivate();
    expect(useBatchStore.getState().selectedItemId).toBeNull();
  });

  it('keeps completed output when saving an equal draft', () => {
    const editorState = createEditorState();
    const existingDraft = captureBatchVisualDraft(editorState);
    const completedItem = createBatchItem('complete', {
      draft: existingDraft,
      status: 'done',
      blob: new Blob(['rendered']),
      renderedUrl: 'blob:rendered-complete',
    });
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    setBatchItems([completedItem], completedItem.id);

    useBatchStore.getState().saveItemDraft(completedItem.id, captureBatchVisualDraft(editorState));

    const savedItem = useBatchStore.getState().items[0]!;
    expect(savedItem.status).toBe('done');
    expect(savedItem.blob).toBe(completedItem.blob);
    expect(savedItem.renderedUrl).toBe('blob:rendered-complete');
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('invalidates a changed completed draft and revokes only its rendered URL', () => {
    const editorState = createEditorState();
    const completedItem = createBatchItem('complete', {
      draft: captureBatchVisualDraft(editorState),
      status: 'done',
      blob: new Blob(['rendered']),
      previewUrl: 'blob:preview-complete',
      renderedUrl: 'blob:rendered-complete',
      error: 'old error',
    });
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    setBatchItems([completedItem], completedItem.id);

    useBatchStore.getState().saveItemDraft(completedItem.id, {
      ...captureBatchVisualDraft(editorState),
      imageScale: 2,
    });

    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'pending',
      blob: null,
      renderedUrl: null,
      previewUrl: 'blob:preview-complete',
      error: undefined,
    });
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:rendered-complete');
  });
});

describe('batch store rendering commands', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetBatchStore();
    vi.stubGlobal('Image', MockImage);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    renderingMocks.renderBatchItem.mockReset();
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
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

  it('processes only the requested item', async () => {
    const requestedItem = createBatchItem('requested');
    const untouchedItem = createBatchItem('untouched');
    const editorState = createEditorState();
    setBatchItems([requestedItem, untouchedItem], requestedItem.id);
    renderingMocks.renderBatchItem.mockResolvedValue({
      blob: new Blob(['requested']),
      renderedUrl: 'blob:rendered-requested',
    });

    const outcome = await useBatchStore
      .getState()
      .processItem(requestedItem.id, editorState, 512);

    expect(outcome).toBe('done');
    expect(renderingMocks.renderBatchItem).toHaveBeenCalledTimes(1);
    expect(renderingMocks.renderBatchItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: requestedItem.id }),
      editorState,
      512,
      expect.objectContaining({
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
        selectedBorderId: 'gold-ring',
        selectedMaskId: 'hexagon',
        textBoxes: [],
      })
    );
    expect(editorState.customBorders).toEqual([
      { id: 'shared-border', name: 'Shared border', type: 'image' },
    ]);
    expect(useBatchStore.getState().items).toEqual([
      expect.objectContaining({ id: requestedItem.id, status: 'done', renderedUrl: 'blob:rendered-requested' }),
      expect.objectContaining({ id: untouchedItem.id, status: 'pending', renderedUrl: null }),
    ]);
  });

  it('persists the exact default draft so reopening without edits preserves completed output', async () => {
    const editorState = createEditorState();
    const item = createBatchItem('default-draft-owner', { draft: null });
    const renderedBlob = new Blob(['default-draft-owner']);
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    setBatchItems([item], item.id);
    renderingMocks.renderBatchItem.mockResolvedValue({
      blob: renderedBlob,
      renderedUrl: 'blob:rendered-default-draft-owner',
    });

    await useBatchStore.getState().processItem(item.id, editorState, 512);

    const completedItem = useBatchStore.getState().items[0]!;
    expect(completedItem).toMatchObject({
      status: 'done',
      blob: renderedBlob,
      renderedUrl: 'blob:rendered-default-draft-owner',
      draft: {
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
        selectedBorderId: 'gold-ring',
        selectedMaskId: 'hexagon',
        textBoxes: [],
      },
    });

    const reopenedEditorState = {
      ...editorState,
      ...completedItem.draft!,
      textBoxes: completedItem.draft!.textBoxes.map((textBox) => ({ ...textBox })),
    };
    useBatchStore
      .getState()
      .saveItemDraft(item.id, captureBatchVisualDraft(reopenedEditorState));

    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'done',
      blob: renderedBlob,
      renderedUrl: 'blob:rendered-default-draft-owner',
    });
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('stores an independent clone of the draft that produced completed output', async () => {
    const editorState = createEditorState();
    const renderDraft = captureBatchVisualDraft(editorState);
    const item = createBatchItem('cloned-draft-owner', { draft: renderDraft });
    setBatchItems([item], item.id);
    renderingMocks.renderBatchItem.mockResolvedValue({
      blob: new Blob(['cloned-draft-owner']),
      renderedUrl: 'blob:rendered-cloned-draft-owner',
    });

    await useBatchStore.getState().processItem(item.id, editorState, 512);

    const storedDraft = useBatchStore.getState().items[0]!.draft!;
    expect(storedDraft).toEqual(renderDraft);
    expect(storedDraft).not.toBe(renderDraft);
    expect(storedDraft.textBoxes).not.toBe(renderDraft.textBoxes);
    expect(storedDraft.textBoxes[0]).not.toBe(renderDraft.textBoxes[0]);

    renderDraft.textBoxes[0]!.content = 'Mutated after render';
    expect(storedDraft.textBoxes[0]!.content).toBe('Captain');
  });

  it('returns error only after storing the concrete item render failure', async () => {
    const item = createBatchItem('render-error');
    setBatchItems([item], item.id);
    renderingMocks.renderBatchItem.mockRejectedValue(
      new Error('Renderer rejected render-error.png'),
    );

    const outcome = await useBatchStore
      .getState()
      .processItem(item.id, createEditorState(), 512);

    expect(outcome).toBe('error');
    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'error',
      error: 'Renderer rejected render-error.png',
    });
  });

  it('uses a stored draft before the fallback editor draft for all-item rendering', async () => {
    const editorState = createEditorState();
    const storedDraft = captureBatchVisualDraft(editorState);
    storedDraft.imageScale = 2.5;
    storedDraft.textBoxes[0]!.content = 'Per-item title';
    const draftedItem = createBatchItem('drafted', { draft: storedDraft });
    const fallbackItem = createBatchItem('fallback', { draft: null });
    setBatchItems([draftedItem, fallbackItem], draftedItem.id);
    renderingMocks.renderBatchItem.mockImplementation((item: BatchItem) =>
      Promise.resolve({ blob: new Blob([item.id]), renderedUrl: `blob:rendered-${item.id}` })
    );

    await useBatchStore.getState().processAll(editorState, 512);

    expect(renderingMocks.renderBatchItem.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({ id: draftedItem.id }),
          editorState,
          512,
          expect.objectContaining({ imageScale: 2.5, textBoxes: [expect.objectContaining({ content: 'Per-item title' })] }),
        ],
        [
          expect.objectContaining({ id: fallbackItem.id }),
          editorState,
          512,
          expect.objectContaining({
            imageOffsetX: 0,
            imageOffsetY: 0,
            imageScale: 1,
            selectedBorderId: 'gold-ring',
            selectedMaskId: 'hexagon',
            textBoxes: [],
          }),
        ],
      ])
    );
    expect(editorState.customBorders).toEqual([
      { id: 'shared-border', name: 'Shared border', type: 'image' },
    ]);
  });

  it('uses default composition with shared style when retrying an item without a draft', async () => {
    const editorState = createEditorState();
    const retryableItem = createBatchItem('retry-default', {
      status: 'error',
      error: 'failed once',
      draft: null,
    });
    setBatchItems([retryableItem], retryableItem.id);
    renderingMocks.renderBatchItem.mockResolvedValue({
      blob: new Blob(['retry-default']),
      renderedUrl: 'blob:rendered-retry-default',
    });

    await useBatchStore.getState().retryItem(retryableItem.id, editorState, 512);

    expect(renderingMocks.renderBatchItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: retryableItem.id }),
      editorState,
      512,
      expect.objectContaining({
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
        selectedBorderId: 'gold-ring',
        selectedMaskId: 'hexagon',
        textBoxes: [],
      })
    );
    expect(editorState.customBorders).toEqual([
      { id: 'shared-border', name: 'Shared border', type: 'image' },
    ]);
  });

  it('keeps a newly saved draft pending when an older render settles', async () => {
    const editorState = createEditorState();
    const originalDraft = captureBatchVisualDraft(editorState);
    const item = createBatchItem('draft-race', { draft: originalDraft });
    setBatchItems([item], item.id);
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    let resolveRender: ((value: { blob: Blob; renderedUrl: string }) => void) | undefined;
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
          resolveRender = resolve;
        })
    );

    const processing = useBatchStore.getState().processItem(item.id, editorState, 512);
    useBatchStore.getState().saveItemDraft(item.id, {
      ...originalDraft,
      imageScale: 2.25,
    });

    resolveRender?.({ blob: new Blob(['stale']), renderedUrl: 'blob:stale-draft-race' });
    const outcome = await processing;

    expect(outcome).toBe('superseded');
    expect(useBatchStore.getState().items[0]).toMatchObject({
      draft: expect.objectContaining({ imageScale: 2.25 }),
      status: 'pending',
      blob: null,
      renderedUrl: null,
    });
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:stale-draft-race');
  });

  it('returns superseded and preserves a newer draft when the older render rejects', async () => {
    const editorState = createEditorState();
    const originalDraft = captureBatchVisualDraft(editorState);
    const newerDraft = { ...originalDraft, imageScale: 2.5 };
    const item = createBatchItem('rejected-draft-race', { draft: originalDraft });
    let rejectRender: ((error: Error) => void) | undefined;
    setBatchItems([item], item.id);
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((_resolve, reject) => {
          rejectRender = reject;
        })
    );

    const processing = useBatchStore.getState().processItem(item.id, editorState, 512);
    useBatchStore.getState().saveItemDraft(item.id, newerDraft);
    rejectRender?.(new Error('older draft render failed'));

    expect(await processing).toBe('superseded');
    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'pending',
      draft: expect.objectContaining({ imageScale: 2.5 }),
      blob: null,
      renderedUrl: null,
      error: undefined,
    });
  });

  it('invalidates completed output before re-rendering and keeps it cleared after an error', async () => {
    const editorState = createEditorState();
    const completedDraft = captureBatchVisualDraft(editorState);
    const completedBlob = new Blob(['completed-output']);
    const item = createBatchItem('failed-rerender', {
      draft: completedDraft,
      status: 'done',
      blob: completedBlob,
      renderedUrl: 'blob:old-failed-rerender-output',
      previewUrl: 'blob:failed-rerender-preview',
    });
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    let rejectRender: ((error: Error) => void) | undefined;
    setBatchItems([item], item.id);
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((_resolve, reject) => {
          rejectRender = reject;
        })
    );

    const processing = useBatchStore.getState().processItem(item.id, editorState, 512);
    const itemDuringRender = useBatchStore.getState().items[0];
    const revokedUrlsDuringRender = revokeObjectURL.mock.calls.map(([url]) => url);
    rejectRender?.(new Error('failed re-render'));
    const outcome = await processing;

    expect(itemDuringRender).toMatchObject({
      status: 'rendering',
      blob: null,
      renderedUrl: null,
      previewUrl: 'blob:failed-rerender-preview',
    });
    expect(revokedUrlsDuringRender).toEqual(['blob:old-failed-rerender-output']);
    expect(outcome).toBe('error');

    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'error',
      error: 'failed re-render',
      blob: null,
      renderedUrl: null,
      previewUrl: 'blob:failed-rerender-preview',
    });
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalledWith('blob:failed-rerender-preview');
  });

  it('revokes old and stale new output once each when the draft changes during re-rendering', async () => {
    const editorState = createEditorState();
    const completedDraft = captureBatchVisualDraft(editorState);
    const newerDraft = { ...completedDraft, imageScale: 2.25 };
    const item = createBatchItem('mismatched-rerender', {
      draft: completedDraft,
      status: 'done',
      blob: new Blob(['completed-output']),
      renderedUrl: 'blob:old-mismatched-rerender-output',
      previewUrl: 'blob:mismatched-rerender-preview',
    });
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    let resolveRender: ((value: { blob: Blob; renderedUrl: string }) => void) | undefined;
    setBatchItems([item], item.id);
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
          resolveRender = resolve;
        })
    );

    const processing = useBatchStore.getState().processItem(item.id, editorState, 512);
    useBatchStore.getState().saveItemDraft(item.id, newerDraft);
    resolveRender?.({
      blob: new Blob(['stale-new-output']),
      renderedUrl: 'blob:stale-new-mismatched-rerender-output',
    });

    expect(await processing).toBe('superseded');
    expect(useBatchStore.getState().items[0]).toMatchObject({
      status: 'pending',
      draft: expect.objectContaining({ imageScale: 2.25 }),
      blob: null,
      renderedUrl: null,
      previewUrl: 'blob:mismatched-rerender-preview',
    });
    expect(
      revokeObjectURL.mock.calls.filter(
        ([url]) => url === 'blob:old-mismatched-rerender-output'
      )
    ).toHaveLength(1);
    expect(
      revokeObjectURL.mock.calls.filter(
        ([url]) => url === 'blob:stale-new-mismatched-rerender-output'
      )
    ).toHaveLength(1);
    expect(revokeObjectURL).not.toHaveBeenCalledWith('blob:mismatched-rerender-preview');
  });

  it('re-reads a later batch item before rendering it', async () => {
    const editorState = createEditorState();
    const first = createBatchItem('first');
    const second = createBatchItem('second');
    const third = createBatchItem('third');
    const later = createBatchItem('later');
    setBatchItems([first, second, third, later], first.id);

    const resolveRenderRequests: Array<() => void> = [];
    renderingMocks.renderBatchItem.mockImplementation((item: BatchItem) =>
      new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
        resolveRenderRequests.push(() =>
          resolve({ blob: new Blob([item.id]), renderedUrl: `blob:rendered-${item.id}` })
        );
      })
    );

    const processing = useBatchStore.getState().processAll(editorState, 512);
    expect(renderingMocks.renderBatchItem).toHaveBeenCalledTimes(3);

    const laterDraft = captureBatchVisualDraft(editorState);
    laterDraft.imageScale = 2.75;
    useBatchStore.getState().saveItemDraft(later.id, laterDraft);
    resolveRenderRequests.splice(0, 3).forEach((resolveRequest) => resolveRequest());
    await vi.advanceTimersByTimeAsync(0);

    try {
      expect(renderingMocks.renderBatchItem).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({ id: later.id }),
        editorState,
        512,
        expect.objectContaining({ imageScale: 2.75 })
      );
    } finally {
      resolveRenderRequests.splice(0, 1).forEach((resolveRequest) => resolveRequest());
      await processing;
    }
  });

  it('renders pending and error items in batches of three while leaving other statuses untouched', async () => {
    const pendingOne = createBatchItem('pending-one');
    const pendingTwo = createBatchItem('pending-two');
    const pendingThree = createBatchItem('pending-three');
    const failedItem = createBatchItem('failed', { status: 'error', error: 'load failed' });
    const completeItem = createBatchItem('complete', { status: 'done', renderedUrl: 'blob:old-complete' });
    const loadingItem = createBatchItem('loading', { status: 'loading' });
    setBatchItems([pendingOne, pendingTwo, pendingThree, failedItem, completeItem, loadingItem], pendingOne.id);

    const resolveRenderRequests: Array<() => void> = [];
    renderingMocks.renderBatchItem.mockImplementation((item: BatchItem) =>
      new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
        resolveRenderRequests.push(() =>
          resolve({ blob: new Blob([item.id]), renderedUrl: `blob:rendered-${item.id}` })
        );
      })
    );

    const processing = useBatchStore.getState().processAll(createEditorState(), 512);
    expect(renderingMocks.renderBatchItem).toHaveBeenCalledTimes(3);

    resolveRenderRequests.splice(0, 3).forEach((resolveRequest) => resolveRequest());
    await vi.advanceTimersByTimeAsync(0);
    expect(renderingMocks.renderBatchItem).toHaveBeenCalledTimes(4);

    resolveRenderRequests.splice(0, 1).forEach((resolveRequest) => resolveRequest());
    await processing;

    expect(useBatchStore.getState().items).toEqual([
      expect.objectContaining({ id: pendingOne.id, status: 'done' }),
      expect.objectContaining({ id: pendingTwo.id, status: 'done' }),
      expect.objectContaining({ id: pendingThree.id, status: 'done' }),
      expect.objectContaining({ id: failedItem.id, status: 'done' }),
      expect.objectContaining({ id: completeItem.id, status: 'done', renderedUrl: 'blob:old-complete' }),
      expect.objectContaining({ id: loadingItem.id, status: 'loading' }),
    ]);
  });

  it('fails a retry request while another item command is processing', async () => {
    const retryableItem = createBatchItem('retryable', { status: 'error', error: 'failed once' });
    setBatchItems([retryableItem], retryableItem.id);
    let resolveRender: ((value: { blob: Blob; renderedUrl: string }) => void) | undefined;
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
          resolveRender = resolve;
        })
    );

    const firstRequest = useBatchStore.getState().processItem(retryableItem.id, createEditorState(), 512);

    await expect(
      useBatchStore.getState().retryItem(retryableItem.id, createEditorState(), 512)
    ).rejects.toThrow('Batch processing already in progress: "retryable"');

    resolveRender?.({ blob: new Blob(['retry']), renderedUrl: 'blob:rendered-retryable' });
    await firstRequest;
  });

  it('keeps an unresolved command locked after deactivate and blocks a reactivated queue', async () => {
    const originalItem = createBatchItem('original');
    setBatchItems([originalItem], originalItem.id);
    let resolveFirstRender: ((value: { blob: Blob; renderedUrl: string }) => void) | undefined;
    renderingMocks.renderBatchItem.mockImplementation((item: BatchItem) => {
      if (item.id !== originalItem.id) {
        return Promise.resolve({ blob: new Blob([item.id]), renderedUrl: `blob:rendered-${item.id}` });
      }
      return new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
        resolveFirstRender = resolve;
      });
    });

    const firstCommand = useBatchStore.getState().processItem(originalItem.id, createEditorState(), 512);
    useBatchStore.getState().deactivate();
    useBatchStore.getState().activate();
    useBatchStore.getState().addFiles([new File(['replacement'], 'replacement.png', { type: 'image/png' })]);
    const replacementItemId = useBatchStore.getState().items[0]?.id;
    expect(replacementItemId).toBeDefined();

    try {
      await expect(
        useBatchStore.getState().processItem(replacementItemId!, createEditorState(), 512)
      ).rejects.toThrow(`Batch processing already in progress: "${replacementItemId}"`);
    } finally {
      resolveFirstRender?.({ blob: new Blob(['original']), renderedUrl: 'blob:rendered-original' });
      expect(await firstCommand).toBe('superseded');
    }
  });

  it('revokes a newly rendered URL when its item is deleted during rendering', async () => {
    const item = createBatchItem('deleted');
    setBatchItems([item], item.id);
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL);
    let resolveRender: ((value: { blob: Blob; renderedUrl: string }) => void) | undefined;
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((resolve) => {
          resolveRender = resolve;
        })
    );

    const processing = useBatchStore.getState().processItem(item.id, createEditorState(), 512);
    useBatchStore.getState().removeItem(item.id);
    resolveRender?.({ blob: new Blob(['deleted']), renderedUrl: 'blob:rendered-deleted' });
    const outcome = await processing;

    expect(outcome).toBe('superseded');
    expect(useBatchStore.getState().items).toHaveLength(0);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:rendered-deleted');
    expect(useBatchStore.getState().isProcessing).toBe(false);
  });

  it('returns superseded when a deleted item render rejects before an error can be stored', async () => {
    const item = createBatchItem('deleted-error');
    setBatchItems([item], item.id);
    let rejectRender: ((error: Error) => void) | undefined;
    renderingMocks.renderBatchItem.mockImplementationOnce(
      () =>
        new Promise<{ blob: Blob; renderedUrl: string }>((_resolve, reject) => {
          rejectRender = reject;
        })
    );

    const processing = useBatchStore
      .getState()
      .processItem(item.id, createEditorState(), 512);
    useBatchStore.getState().removeItem(item.id);
    rejectRender?.(new Error('deleted item failed'));

    expect(await processing).toBe('superseded');
    expect(useBatchStore.getState().items).toHaveLength(0);
  });
});

describe('getNextIncompleteItemId', () => {
  it('finds the next incomplete item, wraps, and returns null for complete or absent selections', () => {
    const first = createBatchItem('first', { status: 'pending' });
    const second = createBatchItem('second', { status: 'done' });
    const third = createBatchItem('third', { status: 'error' });
    const completedItems = [
      createBatchItem('complete-first', { status: 'done' }),
      createBatchItem('complete-second', { status: 'done' }),
    ];

    expect(getNextIncompleteItemId([first, second, third], first.id)).toBe(third.id);
    expect(getNextIncompleteItemId([first, second, third], third.id)).toBe(first.id);
    expect(getNextIncompleteItemId(completedItems, completedItems[0]!.id)).toBeNull();
    expect(getNextIncompleteItemId([first, second, third], 'missing-item')).toBeNull();
  });
});
