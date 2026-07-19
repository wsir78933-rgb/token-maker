### Task 2: Cap the mobile preview backing store

**Files:**
- Create: `src/components/editor/preview-rendering.ts`
- Create: `src/components/editor/preview-rendering.test.ts`
- Modify: `src/components/editor/Canvas.tsx`
- Modify: `src/components/editor/Canvas.test.tsx`

**Interfaces:**
- Produces: `getPreviewBackingSize(cssSize, devicePixelRatio, isMobileEditorLayout): number`.
- Consumes: the preview width observed by `ResizeObserver` and the existing `<1280px` editor boundary.
- Guarantees: mobile backing canvas is at most `1024` pixels in either dimension; desktop remains `round(cssSize * devicePixelRatio)`.

- [ ] **Step 1: Write failing unit tests**

```ts
it('caps a high-DPR mobile preview at 1024 pixels', () => {
  expect(getPreviewBackingSize(512, 3, true)).toBe(1024);
});

it('keeps the full backing resolution on desktop', () => {
  expect(getPreviewBackingSize(512, 3, false)).toBe(1536);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run src/components/editor/preview-rendering.test.ts --reporter=verbose`

Expected: fail because the module does not exist.

- [ ] **Step 3: Implement the smallest pure sizing function**

```ts
export const MAX_MOBILE_PREVIEW_BACKING_SIZE = 1024;

export function getPreviewBackingSize(
  previewCssSize: number,
  devicePixelRatio: number,
  isMobileEditorLayout: boolean,
) {
  const requestedSize = Math.round(previewCssSize * devicePixelRatio);
  return isMobileEditorLayout
    ? Math.min(requestedSize, MAX_MOBILE_PREVIEW_BACKING_SIZE)
    : requestedSize;
}
```

Call it from the existing `ResizeObserver` in `Canvas`; do not change the export pipeline or its dimensions.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `pnpm exec vitest run src/components/editor/preview-rendering.test.ts src/components/editor/Canvas.test.tsx --reporter=verbose`

Expected: all focused tests pass.

