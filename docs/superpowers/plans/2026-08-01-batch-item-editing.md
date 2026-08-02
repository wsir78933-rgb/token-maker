# Batch Item Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-image editing and confirmation to batch mode while preserving one-click processing for all remaining images.

**Architecture:** Store serializable per-item visual drafts in the batch store, keep editor loading/capture behind a dedicated adapter, and render each item from an explicit draft. `BatchPanel` remains an orchestrator over these interfaces and does not own state conversion or rendering rules.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand 5, Vitest, Testing Library, Tailwind CSS.

## Global Constraints

- Preserve all existing uncommitted user changes; do not edit `Canvas.tsx` or `EditorLayout.tsx`.
- Do not add dependencies and do not create commits.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise naming.
- No silent catches. Boundary errors must include the invalid item ID or file name.
- Export size remains batch-wide; per-item drafts contain visual settings only.
- Existing ZIP names, PNG format, regular single-image editing, and unrelated site surfaces must not change.

---

### Task 1: Define the Per-Item Visual Draft Interface

**Files:**
- Modify: `src/lib/batch/types.ts`
- Create: `src/lib/batch/editor-draft.ts`
- Create: `src/lib/batch/editor-draft.test.ts`

**Interfaces:**
- Produces: `BatchVisualDraft`
- Produces: `captureBatchVisualDraft(editorState: EditorState): BatchVisualDraft`
- Produces: `cloneBatchVisualDraft(draft: BatchVisualDraft): BatchVisualDraft`
- Produces: `areBatchVisualDraftsEqual(left: BatchVisualDraft, right: BatchVisualDraft): boolean`
- Produces: `buildBatchRenderState(editorState: EditorState, imageElement: HTMLImageElement, draft: BatchVisualDraft): EditorState`

- [ ] **Step 1: Write failing pure-function tests**

Test that capture includes image transform, selected border/mask, tint/opacity fields, active preset and deep-cloned text boxes, while excluding image URL/element, export size and transient selection fields. Test that equality detects a nested text change and that render-state construction combines the item image with the draft and the caller's shared custom-border resources.

```ts
const capturedDraft = captureBatchVisualDraft(editorState);
expect(capturedDraft.imageScale).toBe(1.75);
expect(capturedDraft.textBoxes).toEqual(editorState.textBoxes);
expect(capturedDraft.textBoxes).not.toBe(editorState.textBoxes);
expect(areBatchVisualDraftsEqual(capturedDraft, {
  ...capturedDraft,
  textBoxes: [{ ...capturedDraft.textBoxes[0]!, content: 'Changed' }],
})).toBe(false);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- src/lib/batch/editor-draft.test.ts`

Expected: FAIL because `editor-draft.ts` and its exports do not exist.

- [ ] **Step 3: Implement the minimal visual draft type and pure functions**

Use an explicit interface rather than `Partial<EditorState>` so runtime-only fields cannot leak into queue state.

```ts
export interface BatchVisualDraft {
  imageOffsetX: number;
  imageOffsetY: number;
  imageScale: number;
  selectedBorderId: string;
  selectedMaskId: string;
  borderLibraryMode: BorderLibraryMode;
  borderTint: string;
  imageBorderTintEnabled: boolean;
  textColor: string;
  overlayTint: string;
  borderOpacity: number;
  overlayOpacity: number;
  textBoxes: TextBox[];
  activePresetId: string | null;
}
```

`BatchItem` gains `draft: BatchVisualDraft | null`. Equality compares these explicit fields and text boxes; no generic serializer abstraction is introduced.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test -- src/lib/batch/editor-draft.test.ts`

Expected: PASS.

---

### Task 2: Add Store-Owned Selection, Draft Invalidation, and Render Commands

**Files:**
- Modify: `src/lib/batch/image-files.ts`
- Modify: `src/lib/batch/rendering.ts`
- Modify: `src/lib/store/batch-store.ts`
- Modify: `src/lib/store/batch-store.test.ts`
- Create: `src/lib/batch/rendering.test.ts`

**Interfaces:**
- Consumes: `BatchVisualDraft`, `areBatchVisualDraftsEqual`, `buildBatchRenderState`
- Produces: `selectItem(id: string): void`
- Produces: `saveItemDraft(id: string, draft: BatchVisualDraft): void`
- Produces: `processItem(id: string, editorState: EditorState, exportSize: number): Promise<void>`
- Produces: `processAll(editorState: EditorState, exportSize: number): Promise<void>`
- Produces: `getNextIncompleteItemId(items: BatchItem[], currentId: string): string | null`

- [ ] **Step 1: Write failing store and renderer tests**

Cover these exact behaviors:

```ts
expect(useBatchStore.getState().selectedItemId).toBe(firstItem.id);

useBatchStore.getState().saveItemDraft(doneItem.id, unchangedDraft);
expect(useBatchStore.getState().items[0]?.status).toBe('done');

useBatchStore.getState().saveItemDraft(doneItem.id, changedDraft);
expect(useBatchStore.getState().items[0]).toMatchObject({
  status: 'pending',
  blob: null,
  renderedUrl: null,
});
expect(URL.revokeObjectURL).toHaveBeenCalledWith(previousRenderedUrl);
```

Also cover invalid selection ID, selected-item removal fallback, clear/deactivate selection reset, processing mutual exclusion, one-item processing, all-item processing with stored drafts and fallback draft, and render errors containing the file name.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `pnpm test -- src/lib/store/batch-store.test.ts src/lib/batch/rendering.test.ts`

Expected: FAIL because selection, drafts and single-item render commands do not exist.

- [ ] **Step 3: Implement minimal store actions and rendering**

Add `selectedItemId: string | null` to state. Keep orchestration functions short:

```ts
processItem: async (id, editorState, exportSize) => {
  assertProcessingCanStart(get().isProcessing, id);
  set({ isProcessing: true });
  try {
    await renderAndStoreItem(id, editorState, exportSize, get, set);
  } finally {
    set({ isProcessing: false });
  }
},
```

`renderAndStoreItem` validates the item ID and loaded image, chooses `item.draft ?? captureBatchVisualDraft(editorState)`, and delegates to the pure renderer. It must preserve the existing deleted-item object-URL guards. Known per-item render errors become that item's `error` state and are rethrown only where the UI needs a blocking failure; unknown exceptions are not swallowed. Keeping `processAll(editorState, exportSize)` preserves the existing `BatchPanel` call contract while stored item drafts override the fallback state.

`removeItem`, `clearAll`, and `deactivate` update selection in the same state transition. Remove the `BatchPanel` effect that exits batch mode when only one item remains.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `pnpm test -- src/lib/store/batch-store.test.ts src/lib/batch/rendering.test.ts`

Expected: PASS.

---

### Task 3: Add the Editor Session Adapter

**Files:**
- Create: `src/lib/batch/editor-session.ts`
- Create: `src/lib/batch/editor-session.test.ts`

**Interfaces:**
- Consumes: `BatchItem`, `BatchVisualDraft`, `captureBatchVisualDraft`
- Produces: `captureCurrentBatchDraft(): BatchVisualDraft`
- Produces: `loadBatchItemIntoEditor(item: BatchItem, draft: BatchVisualDraft | null): Promise<void>`
- Produces: `createDefaultBatchDraft(editorState: EditorState): BatchVisualDraft`

- [ ] **Step 1: Write failing adapter tests**

Test that the adapter creates an editor-owned object URL from `item.file`, calls the editor's revision boundary, restores the explicit visual fields, deep-clones text boxes, and revokes a stale URL when a newer selection wins. Test that a null draft keeps current shared style but resets transform to `0, 0, 1` and starts with no text.

```ts
await loadBatchItemIntoEditor(item, storedDraft);
expect(useEditorStore.getState()).toMatchObject({
  imageOffsetX: storedDraft.imageOffsetX,
  imageOffsetY: storedDraft.imageOffsetY,
  imageScale: storedDraft.imageScale,
  selectedBorderId: storedDraft.selectedBorderId,
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- src/lib/batch/editor-session.test.ts`

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement the adapter as the only editor/batch boundary**

Use `beginImageLoad()` and verify `imageLoadRevision` before applying the loaded image. Use the public `setImage` action for image ownership, then apply only the explicit `BatchVisualDraft` fields in one Zustand state update. Do not reuse `BatchItem.previewUrl`, call upload analytics, or import the batch store into the adapter.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test -- src/lib/batch/editor-session.test.ts`

Expected: PASS.

---

### Task 4: Wire the Dual Workflow into BatchPanel

**Files:**
- Modify: `src/components/editor/BatchPanel.tsx`
- Create: `src/components/editor/BatchPanel.test.tsx`
- Modify: `src/lib/i18n/zh.ts`
- Modify: `src/lib/i18n/en.ts`

**Interfaces:**
- Consumes: Store actions from Task 2 and editor-session functions from Task 3
- Produces: Clickable, accessible batch item cards and “complete current / process all / download ZIP” controls

- [ ] **Step 1: Write failing component tests**

Cover:

```ts
fireEvent.click(screen.getByRole('button', { name: /编辑 second\.png/i }));
expect(loadBatchItemIntoEditor).toHaveBeenCalledWith(secondItem, secondItem.draft);
expect(saveItemDraft).toHaveBeenCalledWith(firstItem.id, currentDraft);
```

Also verify selected-card `aria-pressed`, draft/done/error labels, remove/retry event isolation, disabled interactions during processing, “完成当前并下一张” processing and next selection, and “全部处理” passing the current fallback draft without discarding stored drafts.

- [ ] **Step 2: Run the focused component test and verify RED**

Run: `pnpm test -- src/components/editor/BatchPanel.test.tsx`

Expected: FAIL because card selection and the current-item action are absent.

- [ ] **Step 3: Implement the minimal UI orchestration**

`BatchPanel` handlers each perform one workflow and delegate conversions:

```ts
async function switchToItem(nextItemId: string) {
  saveCurrentDraftIfSelected();
  selectItem(nextItemId);
  await loadSelectedItem(nextItemId);
}
```

Make the card itself an accessible button surface with a visible selected ring. Nested remove/retry controls must stop propagation. Keep the existing ZIP button and grid layout; add only the current-item button and state labels required by the confirmed design.

- [ ] **Step 4: Run the focused component test and verify GREEN**

Run: `pnpm test -- src/components/editor/BatchPanel.test.tsx`

Expected: PASS.

---

### Task 5: Regression and Browser Verification

**Files:**
- Modify only files from Tasks 1-4 if a verified regression requires a scoped fix.

**Interfaces:**
- Consumes: completed dual-workflow feature
- Produces: verification evidence; no new product behavior

- [ ] **Step 1: Run all batch-focused tests**

Run:

```bash
pnpm test -- src/lib/batch/editor-draft.test.ts src/lib/batch/rendering.test.ts src/lib/batch/editor-session.test.ts src/lib/store/batch-store.test.ts src/components/editor/BatchPanel.test.tsx src/components/layout/EditorLayout.test.tsx src/components/editor/Canvas.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run repository checks**

Run:

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
```

Expected: all commands exit 0. If an unrelated existing worktree failure occurs, record the exact command and evidence; do not change unrelated files.

- [ ] **Step 3: Verify the desktop interaction in the local browser**

Start the existing dev server and use the local Hermes CDP browser. Upload at least three local images and verify:

1. First image is selected automatically.
2. Adjust image 1, click image 2, then return to image 1 and confirm restoration.
3. Complete image 1 and confirm automatic movement to the next incomplete image.
4. Process all remaining images and confirm every item reaches done.
5. Reopen a done item, modify it, switch away, and confirm its old output becomes pending.
6. Confirm ZIP enables when at least one item is done.
7. Delete the selected item and confirm deterministic next/previous selection.

- [ ] **Step 4: Review final scope and worktree preservation**

Run `git status --short` and `git diff -- <feature files>`. Confirm no unrelated file was modified and pre-existing changes remain intact. Do not commit.
