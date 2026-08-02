// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BatchVisualDraft } from '@/lib/batch/editor-draft';
import type { BatchItem } from '@/lib/batch/types';

const editorSessionMocks = vi.hoisted(() => ({
  captureCurrentBatchDraft: vi.fn(),
  loadBatchItemIntoEditor: vi.fn(),
}));

const editorBridgeMocks = vi.hoisted(() => ({
  getEditorSnapshot: vi.fn(),
  editorSnapshot: { snapshot: 'current-editor' },
}));

vi.mock('@/lib/i18n', () => {
  const messages: Record<string, string> = {
    batchEditItem: 'Edit',
    batchCurrentItem: 'Editing',
    batchDraftSaved: 'Draft',
    batchStatusDone: 'Done',
    batchStatusError: 'Failed',
    batchStatusRendering: 'Processing',
    batchCompleteCurrent: 'Complete & Next',
    batchEditorLoadError: 'Unable to open image',
    batchProcess: 'Start Batch',
    batchDownloadZip: 'Download ZIP',
    batchExit: 'Exit Batch',
    batchProgress: 'Processing...',
    batchDone: 'All done!',
    batchRetry: 'Retry',
    batchRemove: 'Remove',
    batchItemCount: 'images',
    batchClearAll: 'Clear All',
    batchOrClick: 'or click to select files',
    batchTokenFileSuffix: 'token',
    batchZipFileBaseName: 'tokens_batch',
  };

  return {
    useI18n: () => ({
      locale: 'en',
      t: (key: string) => messages[key] ?? key,
    }),
  };
});

vi.mock('@/lib/analytics', () => ({
  trackUploadImage: vi.fn(),
}));

vi.mock('@/lib/batch/editor-session', () => editorSessionMocks);

vi.mock('./editor-store-hooks', () => ({
  useBatchEditorBridge: () => ({
    exportSize: 512,
    getEditorSnapshot: editorBridgeMocks.getEditorSnapshot,
    firstImagePreviewOptions: {},
  }),
}));

vi.mock('./upload-files', () => ({
  getSupportedImageFiles: vi.fn((files: File[]) => files),
  loadEditorImageFile: vi.fn(),
}));

import { loadBatchItemIntoEditor } from '@/lib/batch/editor-session';
import { useBatchStore, type BatchStore } from '@/lib/store/batch-store';
import { BatchPanel } from './BatchPanel';

const originalBatchStoreState = useBatchStore.getState();

function createDraft(imageOffsetX: number): BatchVisualDraft {
  return {
    imageOffsetX,
    imageOffsetY: 2,
    imageScale: 1.25,
    selectedBorderId: 'ring',
    selectedMaskId: 'circle',
    borderLibraryMode: 'default',
    borderTint: '#ffffff',
    imageBorderTintEnabled: true,
    textColor: '#111111',
    overlayTint: '#222222',
    borderOpacity: 0.9,
    overlayOpacity: 0.2,
    textBoxes: [],
    activePresetId: null,
  };
}

function createBatchItem(
  id: string,
  status: BatchItem['status'] = 'pending',
  draft: BatchVisualDraft | null = null,
): BatchItem {
  return {
    id,
    file: new File([id], `${id}.png`, { type: 'image/png' }),
    fileName: `${id}.png`,
    previewUrl: `blob:${id}-preview`,
    imageElement: document.createElement('img'),
    renderedUrl: status === 'done' ? `blob:${id}-rendered` : null,
    blob: status === 'done' ? new Blob([id], { type: 'image/png' }) : null,
    draft,
    status,
    error: status === 'error' ? `${id} render failed` : undefined,
  };
}

function setBatchState(
  items: BatchItem[],
  selectedItemId: string | null,
  overrides: Partial<BatchStore> = {},
): void {
  useBatchStore.setState(
    {
      ...originalBatchStoreState,
      isActive: true,
      items,
      isProcessing: false,
      selectedItemId,
      ...overrides,
    },
    true,
  );
}

function getButton(name: string): HTMLButtonElement {
  return screen.getByRole('button', { name }) as HTMLButtonElement;
}

function expectButtonsDisabled(names: string[]): void {
  names.forEach((name) => {
    expect(getButton(name).disabled, `${name} should be disabled`).toBe(true);
  });
}

function getAccessibleDescription(button: HTMLButtonElement): string {
  const descriptionIds = button.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
  return descriptionIds
    .map((descriptionId) => document.getElementById(descriptionId)?.textContent ?? '')
    .join(' ')
    .trim();
}

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

describe('BatchPanel item editing workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    editorSessionMocks.captureCurrentBatchDraft.mockReset();
    editorSessionMocks.loadBatchItemIntoEditor.mockReset();
    editorBridgeMocks.getEditorSnapshot.mockReset();
    editorSessionMocks.captureCurrentBatchDraft.mockReturnValue(createDraft(40));
    editorSessionMocks.loadBatchItemIntoEditor.mockResolvedValue('loaded');
    editorBridgeMocks.getEditorSnapshot.mockReturnValue(editorBridgeMocks.editorSnapshot);
    setBatchState([], null);
  });

  afterEach(() => {
    cleanup();
    useBatchStore.setState(originalBatchStoreState, true);
  });

  it('loads the initial selected item once when unrelated item status changes', async () => {
    const firstItem = createBatchItem('first');
    setBatchState([firstItem], firstItem.id);

    render(<BatchPanel />);

    await waitFor(() => {
      expect(loadBatchItemIntoEditor).toHaveBeenCalledWith(firstItem, firstItem.draft);
    });

    act(() => {
      useBatchStore.setState({
        items: [{ ...firstItem, status: 'done', renderedUrl: 'blob:first-new-render' }],
      });
    });

    await waitFor(() => {
      expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1);
    });
  });

  it('keeps initial selection and exposes the concrete initial load failure', async () => {
    const firstItem = createBatchItem('first');
    editorSessionMocks.loadBatchItemIntoEditor.mockRejectedValueOnce(
      new Error('first image is corrupt'),
    );
    setBatchState([firstItem], firstItem.id);

    render(<BatchPanel />);

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Unable to open image: first image is corrupt',
    );
    expect(useBatchStore.getState().selectedItemId).toBe(firstItem.id);
  });

  it('autosaves the loaded item and loads the target before selecting it', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    const callOrder: string[] = [];
    const saveItemDraft = vi.fn((id: string) => callOrder.push(`save:${id}`));
    const selectItem = vi.fn((id: string) => {
      callOrder.push(`select:${id}`);
      useBatchStore.setState({ selectedItemId: id });
    });
    editorSessionMocks.captureCurrentBatchDraft.mockImplementation(() => {
      callOrder.push('capture');
      return createDraft(41);
    });
    setBatchState([firstItem, secondItem], firstItem.id, { saveItemDraft, selectItem });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();
    editorSessionMocks.loadBatchItemIntoEditor.mockImplementation(async (item: BatchItem) => {
      callOrder.push(`load:${item.id}`);
      return 'loaded';
    });

    fireEvent.click(getButton('Edit second.png'));

    await waitFor(() => {
      expect(getButton('Edit second.png').getAttribute('aria-pressed')).toBe('true');
    });
    expect(callOrder).toEqual(['capture', 'save:first', 'load:second', 'select:second']);
    expect(saveItemDraft).toHaveBeenCalledWith(firstItem.id, createDraft(41));
  });

  it('retries one superseded target load once before selecting the loaded target', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    setBatchState([firstItem, secondItem], firstItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();
    editorSessionMocks.loadBatchItemIntoEditor
      .mockResolvedValueOnce('superseded')
      .mockResolvedValueOnce('loaded');

    fireEvent.click(getButton('Edit second.png'));

    await waitFor(() => {
      expect(getButton('Edit second.png').getAttribute('aria-pressed')).toBe('true');
    });
    expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(2);
    expect(loadBatchItemIntoEditor).toHaveBeenNthCalledWith(1, secondItem, secondItem.draft);
    expect(loadBatchItemIntoEditor).toHaveBeenNthCalledWith(2, secondItem, secondItem.draft);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps the loaded selection and names the target after two superseded loads', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    setBatchState([firstItem, secondItem], firstItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();
    editorSessionMocks.loadBatchItemIntoEditor
      .mockResolvedValueOnce('superseded')
      .mockResolvedValueOnce('superseded');

    fireEvent.click(getButton('Edit second.png'));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Unable to open image');
    expect(alert.textContent).toContain(secondItem.fileName);
    expect(useBatchStore.getState().selectedItemId).toBe(firstItem.id);
    expect(getButton('Edit first.png').getAttribute('aria-pressed')).toBe('true');
    expect(getButton('Complete & Next').disabled).toBe(false);
    expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(2);

    fireEvent.click(getButton('Edit first.png'));
    expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(2);
  });

  it('keeps the prior selection and exposes the concrete target load failure', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    setBatchState([firstItem, secondItem], firstItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockRejectedValueOnce(
      new Error('second image decoder failed'),
    );

    fireEvent.click(getButton('Edit second.png'));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Unable to open image: second image decoder failed',
    );
    expect(useBatchStore.getState().selectedItemId).toBe(firstItem.id);
    expect(getButton('Edit first.png').getAttribute('aria-pressed')).toBe('true');
  });

  it('marks the selected card and distinguishes a saved pending draft', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second', 'pending', createDraft(12));
    setBatchState([firstItem, secondItem], firstItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    expect(getButton('Edit first.png').getAttribute('aria-pressed')).toBe('true');
    expect(getButton('Edit second.png').getAttribute('aria-pressed')).toBe('false');
    expect(getButton('Edit first.png').textContent).toContain('Editing');
    expect(getButton('Edit second.png').textContent).toContain('Draft');
  });

  it('exposes card states and concrete errors through accessible descriptions', async () => {
    const currentDraftItem = createBatchItem('current-draft', 'pending', createDraft(12));
    const doneItem = createBatchItem('done', 'done', createDraft(13));
    const renderingItem = createBatchItem('rendering', 'rendering', createDraft(14));
    const errorItem = createBatchItem('error', 'error');
    errorItem.error = 'error.png decoder failed';
    setBatchState(
      [currentDraftItem, doneItem, renderingItem, errorItem],
      currentDraftItem.id,
    );

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    expect(getAccessibleDescription(getButton('Edit current-draft.png'))).toContain('Editing');
    expect(getAccessibleDescription(getButton('Edit current-draft.png'))).toContain('Draft');
    expect(getAccessibleDescription(getButton('Edit done.png'))).toContain('Done');
    expect(getAccessibleDescription(getButton('Edit rendering.png'))).toContain('Processing');
    expect(getAccessibleDescription(getButton('Edit error.png'))).toContain('Failed');
    expect(getAccessibleDescription(getButton('Edit error.png'))).toContain(
      'error.png decoder failed',
    );
  });

  it('does not select an item when its remove or retry control is clicked', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second', 'error');
    const removeItem = vi.fn();
    const retryItem = vi.fn().mockResolvedValue(undefined);
    const selectItem = vi.fn();
    setBatchState([firstItem, secondItem], firstItem.id, { removeItem, retryItem, selectItem });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    fireEvent.click(getButton('Remove first.png'));
    fireEvent.click(getButton('Retry second.png'));

    expect(removeItem).toHaveBeenCalledWith(firstItem.id);
    expect(retryItem).toHaveBeenCalledWith(secondItem.id, editorBridgeMocks.editorSnapshot, 512);
    expect(selectItem).not.toHaveBeenCalled();
  });

  it('keeps the remove control visible and outlined for keyboard focus', async () => {
    const firstItem = createBatchItem('first');
    setBatchState([firstItem], firstItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    const removeButton = getButton('Remove first.png');
    removeButton.focus();

    expect(document.activeElement).toBe(removeButton);
    expect(removeButton.classList.contains('focus-visible:opacity-100')).toBe(true);
    expect(removeButton.classList.contains('focus-visible:ring-2')).toBe(true);
  });

  it('disables every queue mutation while Store processing is active', async () => {
    const firstItem = createBatchItem('first', 'error');
    const secondItem = createBatchItem('second', 'done');
    setBatchState([firstItem, secondItem], firstItem.id, { isProcessing: true });

    render(<BatchPanel />);

    expectButtonsDisabled([
      'Exit Batch',
      'Clear All',
      'Edit first.png',
      'Remove first.png',
      'Retry first.png',
      'Edit second.png',
      'Remove second.png',
      'or click to select files',
      'Complete & Next',
      'Start Batch',
      'Download ZIP',
    ]);
  });

  it('disables every queue mutation while a target item is loading', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second', 'error');
    const thirdItem = createBatchItem('third', 'done');
    const targetLoad = createDeferredPromise<'loaded'>();
    setBatchState([firstItem, secondItem, thirdItem], firstItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockImplementationOnce(() => targetLoad.promise);

    fireEvent.click(getButton('Edit second.png'));

    await waitFor(() => {
      expectButtonsDisabled([
        'Exit Batch',
        'Clear All',
        'Edit first.png',
        'Remove first.png',
        'Edit second.png',
        'Remove second.png',
        'Retry second.png',
        'Edit third.png',
        'Remove third.png',
        'or click to select files',
        'Complete & Next',
        'Start Batch',
        'Download ZIP',
      ]);
    });

    await act(async () => targetLoad.resolve('loaded'));
    await waitFor(() => {
      expect(getButton('Edit second.png').getAttribute('aria-pressed')).toBe('true');
    });
  });

  it('saves and processes the current item before loading and selecting the next incomplete item', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    const callOrder: string[] = [];
    const saveItemDraft = vi.fn((id: string) => callOrder.push(`save:${id}`));
    const processItem = vi.fn(async (id: string) => {
      callOrder.push(`process:${id}`);
      useBatchStore.setState({
        items: [
          { ...firstItem, status: 'done', draft: createDraft(51), renderedUrl: 'blob:first-rendered' },
          secondItem,
        ],
      });
      return 'done' as const;
    });
    const selectItem = vi.fn((id: string) => {
      callOrder.push(`select:${id}`);
      useBatchStore.setState({ selectedItemId: id });
    });
    editorSessionMocks.captureCurrentBatchDraft.mockImplementation(() => {
      callOrder.push('capture');
      return createDraft(51);
    });
    editorBridgeMocks.getEditorSnapshot.mockImplementation(() => {
      callOrder.push('snapshot');
      return editorBridgeMocks.editorSnapshot;
    });
    setBatchState([firstItem, secondItem], firstItem.id, {
      saveItemDraft,
      processItem,
      selectItem,
    });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();
    editorSessionMocks.loadBatchItemIntoEditor.mockImplementation(async (item: BatchItem) => {
      callOrder.push(`load:${item.id}`);
      return 'loaded';
    });

    fireEvent.click(getButton('Complete & Next'));

    await waitFor(() => {
      expect(getButton('Edit second.png').getAttribute('aria-pressed')).toBe('true');
    });
    expect(callOrder).toEqual([
      'capture',
      'save:first',
      'snapshot',
      'process:first',
      'capture',
      'save:first',
      'load:second',
      'select:second',
    ]);
    expect(processItem).toHaveBeenCalledWith(firstItem.id, editorBridgeMocks.editorSnapshot, 512);
  });

  it('keeps the current item selected when rendering returns an error', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    const processItem = vi.fn(async () => {
      useBatchStore.setState({
        items: [
          { ...firstItem, status: 'error', error: 'first render failed' },
          secondItem,
        ],
      });
      return 'error' as const;
    });
    setBatchState([firstItem, secondItem], firstItem.id, { processItem });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();

    fireEvent.click(getButton('Complete & Next'));

    await waitFor(() => expect(processItem).toHaveBeenCalledTimes(1));
    expect(useBatchStore.getState().selectedItemId).toBe(firstItem.id);
    expect(getButton('Edit first.png').getAttribute('aria-pressed')).toBe('true');
    expect(loadBatchItemIntoEditor).not.toHaveBeenCalled();
  });

  it('keeps an unloaded image selected and stores an error containing its file name', async () => {
    const unloadedItem = createBatchItem('unloaded');
    unloadedItem.imageElement = null;
    const secondItem = createBatchItem('second');
    setBatchState([unloadedItem, secondItem], unloadedItem.id);

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();

    fireEvent.click(getButton('Complete & Next'));

    await waitFor(() => {
      expect(useBatchStore.getState().items[0]).toMatchObject({
        status: 'error',
        error: 'Batch image not loaded: "unloaded.png"',
      });
    });
    expect(useBatchStore.getState().selectedItemId).toBe(unloadedItem.id);
    expect(getButton('Edit unloaded.png').getAttribute('aria-pressed')).toBe('true');
    expect(loadBatchItemIntoEditor).not.toHaveBeenCalled();
  });

  it('autosaves edits made during rendering and does not advance after output invalidation', async () => {
    const initialDraft = createDraft(20);
    const editedDuringRenderDraft = createDraft(99);
    const firstItem = createBatchItem('first', 'pending', initialDraft);
    const secondItem = createBatchItem('second');
    const renderGate = createDeferredPromise<void>();
    const processItem = vi.fn(async () => {
      await renderGate.promise;
      useBatchStore.setState({
        items: [
          {
            ...firstItem,
            status: 'done',
            draft: createDraft(20),
            blob: new Blob(['first-rendered']),
            renderedUrl: 'blob:first-rendered',
          },
          secondItem,
        ],
      });
      return 'done' as const;
    });
    editorSessionMocks.captureCurrentBatchDraft
      .mockReturnValueOnce(initialDraft)
      .mockReturnValueOnce(editedDuringRenderDraft);
    setBatchState([firstItem, secondItem], firstItem.id, { processItem });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();

    fireEvent.click(getButton('Complete & Next'));
    await waitFor(() => expect(processItem).toHaveBeenCalledTimes(1));
    await act(async () => renderGate.resolve());

    await waitFor(() => {
      expect(useBatchStore.getState().items[0]).toMatchObject({
        status: 'pending',
        draft: expect.objectContaining({ imageOffsetX: 99 }),
        blob: null,
        renderedUrl: null,
      });
    });
    expect(editorSessionMocks.captureCurrentBatchDraft).toHaveBeenCalledTimes(2);
    expect(useBatchStore.getState().selectedItemId).toBe(firstItem.id);
    expect(getButton('Edit first.png').getAttribute('aria-pressed')).toBe('true');
    expect(loadBatchItemIntoEditor).not.toHaveBeenCalled();
  });

  it('saves the current draft before processing all eligible items with the current snapshot', async () => {
    const firstItem = createBatchItem('first');
    const callOrder: string[] = [];
    const saveItemDraft = vi.fn(() => callOrder.push('save'));
    const processAll = vi.fn(async () => {
      callOrder.push('process-all');
    });
    editorSessionMocks.captureCurrentBatchDraft.mockImplementation(() => {
      callOrder.push('capture');
      return createDraft(61);
    });
    editorBridgeMocks.getEditorSnapshot.mockImplementation(() => {
      callOrder.push('snapshot');
      return editorBridgeMocks.editorSnapshot;
    });
    setBatchState([firstItem], firstItem.id, { saveItemDraft, processAll });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    fireEvent.click(getButton('Start Batch'));

    await waitFor(() => expect(processAll).toHaveBeenCalledTimes(1));
    expect(callOrder).toEqual(['capture', 'save', 'snapshot', 'process-all']);
    expect(processAll).toHaveBeenCalledWith(editorBridgeMocks.editorSnapshot, 512);
  });

  it('invalidates stale done output before downloading the localized ZIP', async () => {
    const storedDraft = createDraft(10);
    const editedDraft = createDraft(90);
    const firstItem = createBatchItem('first', 'done', storedDraft);
    const callOrder: string[] = [];
    let itemAtDownload: BatchItem | undefined;
    const downloadZip = vi.fn(async () => {
      callOrder.push('download');
      itemAtDownload = useBatchStore.getState().items[0];
    });
    editorSessionMocks.captureCurrentBatchDraft.mockImplementation(() => {
      callOrder.push('capture');
      return editedDraft;
    });
    setBatchState([firstItem], firstItem.id, { downloadZip });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    fireEvent.click(getButton('Download ZIP'));

    await waitFor(() => expect(downloadZip).toHaveBeenCalledTimes(1));
    expect(callOrder).toEqual(['capture', 'download']);
    expect(itemAtDownload?.status).toBe('pending');
    expect(itemAtDownload?.renderedUrl).toBeNull();
    expect(downloadZip).toHaveBeenCalledWith({
      tokenFileSuffix: 'token',
      zipFileBaseName: 'tokens_batch',
    });
  });

  it('loads the Store fallback after removing the selected item without exiting one-item batch mode', async () => {
    const firstItem = createBatchItem('first');
    const secondItem = createBatchItem('second');
    const deactivate = vi.fn();
    setBatchState([firstItem, secondItem], firstItem.id, { deactivate });

    render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));
    editorSessionMocks.loadBatchItemIntoEditor.mockClear();

    fireEvent.click(getButton('Remove first.png'));

    await waitFor(() => {
      expect(loadBatchItemIntoEditor).toHaveBeenCalledWith(secondItem, secondItem.draft);
    });
    expect(useBatchStore.getState().items).toHaveLength(1);
    expect(useBatchStore.getState().selectedItemId).toBe(secondItem.id);
    expect(deactivate).not.toHaveBeenCalled();
  });

  it('uses sibling card controls instead of nesting interactive buttons', async () => {
    const firstItem = createBatchItem('first', 'error');
    setBatchState([firstItem], firstItem.id);

    const { container } = render(<BatchPanel />);
    await waitFor(() => expect(loadBatchItemIntoEditor).toHaveBeenCalledTimes(1));

    expect(container.querySelector('button button')).toBeNull();
  });
});
