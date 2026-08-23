// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultProject } from './assets';
import {
  clearLocalUploadBlobMemoryForTests,
  getLocalUploadBlob,
  putLocalUploadBlob,
  requireLocalUploadDataUrl,
} from './local-upload-blobs';
import { discardProjectDraft, saveProjectDraft } from './project-storage';
import {
  applyProjectHistoryCommand,
  createProjectHistory,
  redoProject,
  undoProject,
  useCoatProjectStore,
} from './store';

describe('coat project history and Zustand bridge', () => {
  beforeEach(async () => {
    localStorage.clear();
    clearLocalUploadBlobMemoryForTests();
    await useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));
  });
  it('isolates history checkpoints from original and returned-document mutation', () => {
    const originalProject = createDefaultProject('en');
    const history = createProjectHistory(originalProject);
    originalProject.name = 'Mutated original';

    expect(history.present.name).toBe('My Coat of Arms');
    expect(() => { history.present.name = 'Mutated history'; }).toThrow();
    const changed = applyProjectHistoryCommand(history, { type: 'set-project-name', name: 'Royal Arms' });
    expect(undoProject(changed).present.name).toBe('My Coat of Arms');
    expect(redoProject(undoProject(changed)).present.name).toBe('Royal Arms');
  });

  it('dispatches commands and undo/redo through the dedicated Coat Maker Zustand bridge', async () => {
    const initialProject = createDefaultProject('en');
    await useCoatProjectStore.getState().replaceProject(initialProject);

    useCoatProjectStore.getState().dispatch({ type: 'set-project-name', name: 'Bridge Arms' });
    expect(useCoatProjectStore.getState().project.name).toBe('Bridge Arms');
    useCoatProjectStore.getState().undo();
    expect(useCoatProjectStore.getState().project.name).toBe('My Coat of Arms');
    useCoatProjectStore.getState().redo();
    expect(useCoatProjectStore.getState().history.present.name).toBe('Bridge Arms');
  });

  it('undoes and redoes a local upload selection as one history checkpoint', () => {
    const initialHistory = createProjectHistory(createDefaultProject('en'));
    const uploads = [
      { id: 'batch-crest-one', mimeType: 'image/svg+xml' as const, encoding: 'base64' as const, data: 'PHN2Zz48L3N2Zz4=' },
      { id: 'batch-crest-two', mimeType: 'image/svg+xml' as const, encoding: 'base64' as const, data: 'PHN2Zz48L3N2Zz4=' },
    ];

    const uploadedHistory = applyProjectHistoryCommand(initialHistory, {
      type: 'add-local-upload-images', uploads,
    });
    const undoneHistory = undoProject(uploadedHistory);
    const redoneHistory = redoProject(undoneHistory);

    expect(uploadedHistory.past).toHaveLength(1);
    expect(uploadedHistory.present.uploads).toHaveLength(2);
    expect(uploadedHistory.present.layers.filter((layer) => layer.type === 'image')).toHaveLength(2);
    expect(undoneHistory.present).toEqual(initialHistory.present);
    expect(redoneHistory.present).toEqual(uploadedHistory.present);
  });

  it('freezes nested field colors and transforms inside history checkpoints', () => {
    const history = createProjectHistory(createDefaultProject('en'));
    const shield = history.present.layers[1];
    if (!shield || shield.type !== 'shield') throw new Error('Expected default shield');

    expect(() => { shield.field.colors[0] = '#B11F24'; }).toThrow();
    expect(() => { shield.transform.x = 99; }).toThrow();
    expect(history.present.layers[1]).toMatchObject({
      field: { colors: ['#1855A5'] }, transform: { x: 0, y: 0, scale: 0.935, rotation: 0 },
    });
  });

  it('hydrates a locale-matching draft and keeps a route with another locale on its default project', async () => {
    const chineseDraft = { ...createDefaultProject('zh'), name: '恢复的徽章' };
    saveProjectDraft(chineseDraft);

    expect(useCoatProjectStore.getState().hydrateDraft('en')).toBe(false);
    expect(useCoatProjectStore.getState().hydrateDraft('zh')).toBe(true);
    expect(useCoatProjectStore.getState().project).toEqual(chineseDraft);
    await useCoatProjectStore.getState().discardDraft();
    expect(useCoatProjectStore.getState().hydrateDraft('zh')).toBe(false);
    await discardProjectDraft();
  });

  it('keeps the indexed-db blob after remove-local-upload so undo can restore it', async () => {
    const uploadId = 'store-remove-blob';
    const blob = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 3])], { type: 'image/png' });
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'store-remove.png',
      blob,
    });
    await useCoatProjectStore.getState().replaceProject({
      ...createDefaultProject('en'),
      uploads: [
        {
          id: uploadId,
          mimeType: 'image/png',
          encoding: 'indexed-db',
          byteLength: blob.size,
        },
      ],
    });

    useCoatProjectStore.getState().dispatch({ type: 'remove-local-upload', uploadId });

    expect(useCoatProjectStore.getState().project.uploads).toEqual([]);
    expect((await getLocalUploadBlob(uploadId)).size).toBe(blob.size);

    useCoatProjectStore.getState().undo();

    expect(useCoatProjectStore.getState().project.uploads).toEqual([
      {
        id: uploadId,
        mimeType: 'image/png',
        encoding: 'indexed-db',
        byteLength: blob.size,
      },
    ]);
    expect(requireLocalUploadDataUrl(uploadId).startsWith('data:image/png;base64,')).toBe(true);
    expect(useCoatProjectStore.getState().readDraft()?.uploads).toEqual([
      {
        id: uploadId,
        mimeType: 'image/png',
        encoding: 'indexed-db',
        byteLength: blob.size,
      },
    ]);
  });

  it('does not delete an indexed-db blob when remove-local-upload throws', async () => {
    const uploadId = 'store-keep-blob';
    const blob = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 6])], { type: 'image/png' });
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'store-keep.png',
      blob,
    });
    await useCoatProjectStore.getState().replaceProject({
      ...createDefaultProject('en'),
      uploads: [
        {
          id: uploadId,
          mimeType: 'image/png',
          encoding: 'indexed-db',
          byteLength: blob.size,
        },
      ],
    });
    useCoatProjectStore.getState().dispatch({ type: 'add-image-layer', uploadId });

    expect(() => useCoatProjectStore.getState().dispatch({ type: 'remove-local-upload', uploadId }))
      .toThrow(uploadId);
    expect((await getLocalUploadBlob(uploadId)).size).toBe(blob.size);
  });

  it('writes command edits as an independent browser draft', () => {
    useCoatProjectStore.getState().dispatch({ type: 'set-project-name', name: 'Drafted Arms' });

    expect(useCoatProjectStore.getState().readDraft()?.name).toBe('Drafted Arms');
  });

  it('replaces the current document with a deterministic local random project', async () => {
    await useCoatProjectStore.getState().randomizeProject(() => 0);

    expect(useCoatProjectStore.getState().project.layers.map((layer) => layer.type))
      .toEqual(['background', 'shield', 'charge']);
    expect(useCoatProjectStore.getState().project.layers.at(-1)).toMatchObject({ type: 'charge', rasterTint: true });
    expect(useCoatProjectStore.getState().project.uploads).toEqual([]);
    expect(useCoatProjectStore.getState().readDraft()).toEqual(useCoatProjectStore.getState().project);
  });

  it('deletes indexed-db blobs that replaceProject no longer references', async () => {
    const uploadId = 'store-replaced-blob';
    const blob = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 4])], { type: 'image/png' });
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'store-replaced.png',
      blob,
    });
    await useCoatProjectStore.getState().replaceProject({
      ...createDefaultProject('en'),
      uploads: [
        {
          id: uploadId,
          mimeType: 'image/png',
          encoding: 'indexed-db',
          byteLength: blob.size,
        },
      ],
    });

    await useCoatProjectStore.getState().replaceProject(createDefaultProject('en'));

    expect(useCoatProjectStore.getState().project.uploads).toEqual([]);
    await expect(getLocalUploadBlob(uploadId)).rejects.toThrow(uploadId);
  });

  it('deletes indexed-db blobs that randomizeProject no longer references', async () => {
    const uploadId = 'store-randomized-blob';
    const blob = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 5])], { type: 'image/png' });
    await putLocalUploadBlob({
      uploadId,
      mimeType: 'image/png',
      fileName: 'store-randomized.png',
      blob,
    });
    await useCoatProjectStore.getState().replaceProject({
      ...createDefaultProject('en'),
      uploads: [
        {
          id: uploadId,
          mimeType: 'image/png',
          encoding: 'indexed-db',
          byteLength: blob.size,
        },
      ],
    });

    await useCoatProjectStore.getState().randomizeProject(() => 0);

    expect(useCoatProjectStore.getState().project.uploads).toEqual([]);
    await expect(getLocalUploadBlob(uploadId)).rejects.toThrow(uploadId);
  });
});
