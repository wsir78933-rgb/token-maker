// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import {
  areBatchVisualDraftsEqual,
  buildBatchRenderState,
  captureBatchVisualDraft,
  cloneBatchVisualDraft,
  createDefaultBatchDraft,
} from './editor-draft';
import type { EditorState } from '@/types/editor';

function createEditorState(overrides: Partial<EditorState> = {}): EditorState {
  return {
    imageUrl: 'blob:original-image',
    imageElement: new Image(),
    imageLoadRevision: 7,
    imageOffsetX: 12,
    imageOffsetY: -8,
    imageScale: 1.75,
    selectedBorderId: 'gold-ring',
    selectedMaskId: 'hexagon',
    customBorders: [{ id: 'custom-border', name: 'Custom', type: 'image' }],
    borderLibraryMode: 'competitor',
    borderTint: '#b8860b',
    imageBorderTintEnabled: false,
    textColor: '#d8c77a',
    overlayTint: '#18243a',
    borderOpacity: 0.65,
    overlayOpacity: 0.3,
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
    exportSize: 1024,
    activePresetId: 'golden-hour',
    renderRevision: 9,
    ...overrides,
  };
}

describe('captureBatchVisualDraft', () => {
  it('captures only visual settings and deep-clones text boxes', () => {
    const editorState = createEditorState();

    const capturedDraft = captureBatchVisualDraft(editorState);

    expect(capturedDraft).toEqual({
      imageOffsetX: 12,
      imageOffsetY: -8,
      imageScale: 1.75,
      selectedBorderId: 'gold-ring',
      selectedMaskId: 'hexagon',
      borderLibraryMode: 'competitor',
      borderTint: '#b8860b',
      imageBorderTintEnabled: false,
      textColor: '#d8c77a',
      overlayTint: '#18243a',
      borderOpacity: 0.65,
      overlayOpacity: 0.3,
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
      activePresetId: 'golden-hour',
    });
    expect(capturedDraft.imageScale).toBe(1.75);
    expect(capturedDraft.textBoxes).toEqual(editorState.textBoxes);
    expect(capturedDraft.textBoxes).not.toBe(editorState.textBoxes);
    expect(capturedDraft.textBoxes[0]).not.toBe(editorState.textBoxes[0]);
  });
});

describe('createDefaultBatchDraft', () => {
  it('keeps shared style choices while resetting image composition and text', () => {
    const editorState = createEditorState();

    const defaultDraft = createDefaultBatchDraft(editorState);

    expect(defaultDraft).toEqual({
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageScale: 1,
      selectedBorderId: 'gold-ring',
      selectedMaskId: 'hexagon',
      borderLibraryMode: 'competitor',
      borderTint: '#b8860b',
      imageBorderTintEnabled: false,
      textColor: '#d8c77a',
      overlayTint: '#18243a',
      borderOpacity: 0.65,
      overlayOpacity: 0.3,
      textBoxes: [],
      activePresetId: 'golden-hour',
    });
    expect(editorState.imageScale).toBe(1.75);
    expect(editorState.textBoxes).toHaveLength(1);
    expect(editorState.customBorders).toEqual([
      { id: 'custom-border', name: 'Custom', type: 'image' },
    ]);
  });
});

describe('cloneBatchVisualDraft', () => {
  it('returns an independent copy of nested text boxes', () => {
    const originalDraft = captureBatchVisualDraft(createEditorState());

    const clonedDraft = cloneBatchVisualDraft(originalDraft);
    clonedDraft.textBoxes[0]!.content = 'Navigator';

    expect(originalDraft.textBoxes[0]!.content).toBe('Captain');
    expect(clonedDraft.textBoxes).not.toBe(originalDraft.textBoxes);
    expect(clonedDraft.textBoxes[0]).not.toBe(originalDraft.textBoxes[0]);
  });
});

describe('areBatchVisualDraftsEqual', () => {
  it('detects nested text changes', () => {
    const capturedDraft = captureBatchVisualDraft(createEditorState());

    expect(
      areBatchVisualDraftsEqual(capturedDraft, {
        ...capturedDraft,
        textBoxes: [{ ...capturedDraft.textBoxes[0]!, content: 'Changed' }],
      })
    ).toBe(false);
  });
});

describe('buildBatchRenderState', () => {
  it('combines the item image and draft with shared caller resources', () => {
    const editorState = createEditorState();
    const imageElement = new Image();
    const draft = captureBatchVisualDraft(editorState);
    draft.imageScale = 2;
    draft.textBoxes[0]!.content = 'Per-item title';

    const renderState = buildBatchRenderState(editorState, imageElement, draft);

    expect(renderState).toMatchObject({
      imageUrl: null,
      imageElement,
      imageOffsetX: 12,
      imageOffsetY: -8,
      imageScale: 2,
      selectedBorderId: 'gold-ring',
      selectedMaskId: 'hexagon',
      borderLibraryMode: 'competitor',
      borderTint: '#b8860b',
      imageBorderTintEnabled: false,
      textColor: '#d8c77a',
      overlayTint: '#18243a',
      borderOpacity: 0.65,
      overlayOpacity: 0.3,
      activePresetId: 'golden-hour',
      selectedTextId: null,
      isImageSelected: false,
      exportSize: 1024,
    });
    expect(renderState.customBorders).toBe(editorState.customBorders);
    expect(renderState.textBoxes).toEqual(draft.textBoxes);
    expect(renderState.textBoxes).not.toBe(draft.textBoxes);
    expect(renderState.textBoxes[0]).not.toBe(draft.textBoxes[0]);
  });
});
