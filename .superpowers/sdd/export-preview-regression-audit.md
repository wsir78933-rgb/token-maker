# Export and preview backing-size regression audit

## Scope and method

- Reviewed the current working-tree diff, focusing on the Canvas mobile backing-size cap, `renderToken` call sites, PNG export paths, editor-state ownership, and existing/new tests.
- This was a read-only product-code audit. No production or test code was changed and no commit was created.
- A nested reviewer could not be started: all four available team slots were already occupied. The fallback was an independent source-path review plus the repository test and lint commands below.

## Conclusion

**Pass — no core regression found.** The new `1024px` cap changes only the backing resolution of the on-screen Canvas when the editor is below the `1280px` desktop breakpoint. It does not constrain the PNG download, share-preview, social-image, or batch-export canvases, and it does not write to editing state.

The visible trade-off is intentional: on a mobile editor whose CSS preview is `512px` wide and DPR is `3`, the preview is rasterized at `1024px` instead of `1536px`. PNG export continues to use the user-selected `256 | 512 | 1024 | 2048` output size.

## Verified call chain and state boundary

| Concern | Verified evidence | Result |
| --- | --- | --- |
| Preview cap scope | `Canvas` stores `canvasSize` only in local React state, derives it from `getPreviewBackingSize`, and passes it only to the preview `renderToken` invocation. [`Canvas.tsx:48`](../../src/components/editor/Canvas.tsx#L48), [`Canvas.tsx:63`](../../src/components/editor/Canvas.tsx#L63), [`Canvas.tsx:142`](../../src/components/editor/Canvas.tsx#L142) | The cap is confined to the displayed Canvas and checkerboard. |
| Desktop/mobile alignment | Both the deferred editor layout and Canvas use the exact media query `(min-width: 1280px)`. [`DeferredEditorLayout.tsx:13`](../../src/components/layout/DeferredEditorLayout.tsx#L13), [`Canvas.tsx:13`](../../src/components/editor/Canvas.tsx#L13) | Resize across the real editor-layout breakpoint recomputes the backing size; desktop keeps the uncapped DPR resolution. |
| PNG download | The download path snapshots the editor store and calls `exportTokenAsPNG(state, state.exportSize)`. [`export-token.ts:73`](../../src/components/editor/export-token.ts#L73), [`export-token.ts:82`](../../src/components/editor/export-token.ts#L82) | It does not read Canvas `canvasSize`. |
| Physical export canvas | `exportTokenAsPNG` creates a new offscreen canvas and calls `renderToken` with its `exportSize`. [`pipeline.ts:434`](../../src/lib/renderer/pipeline.ts#L434), [`pipeline.ts:445`](../../src/lib/renderer/pipeline.ts#L445) | The preview canvas cannot downsize the encoded PNG. |
| Share and batch variants | Share dialog preview, social image, and batch rendering all call `exportTokenAsPNG` with their own explicit sizes. [`export-token.ts:57`](../../src/components/editor/export-token.ts#L57), [`social-image.ts:87`](../../src/lib/share/social-image.ts#L87), [`batch/rendering.ts:32`](../../src/lib/batch/rendering.ts#L32) | These paths are likewise independent from preview backing size. |
| Editing state and drag coordinates | Image offset/scale remain store fields; the Canvas reads them and only writes via `setImageOffset`. [`editor-store.ts:279`](../../src/lib/store/editor-store.ts#L279), [`Canvas.tsx:116`](../../src/components/editor/Canvas.tsx#L116), [`Canvas.tsx:213`](../../src/components/editor/Canvas.tsx#L213) | Changing backing resolution does not reset, rescale, or persist a different edit state. Dragging still uses CSS preview size divided by the fixed `512` editor coordinate system, not backing resolution. |
| Preview/export rendering parity | `renderToken` maps offsets from the same `512` coordinate system by `outputSize / 512`. [`pipeline.ts:350`](../../src/lib/renderer/pipeline.ts#L350), [`pipeline.ts:378`](../../src/lib/renderer/pipeline.ts#L378), [`pipeline.ts:391`](../../src/lib/renderer/pipeline.ts#L391) | A lower-resolution preview and a larger export retain the same crop position and scale. |

## Test evidence

The following read-only commands passed:

```text
pnpm test -- src/components/editor/Canvas.test.tsx src/components/editor/preview-rendering.test.ts src/components/editor/export-token.test.ts src/lib/renderer/pipeline.test.ts
49 test files passed, 294 tests passed

pnpm lint
passed
```

Relevant test coverage:

- The new helper test proves the high-DPR mobile cap (`512 * 3 -> 1024`) and uncapped desktop result (`1536`). [`preview-rendering.test.ts:4`](../../src/components/editor/preview-rendering.test.ts#L4)
- Canvas tests assert both initial mobile/desktop backing sizes and live breakpoint transitions. [`Canvas.test.tsx:216`](../../src/components/editor/Canvas.test.tsx#L216), [`Canvas.test.tsx:243`](../../src/components/editor/Canvas.test.tsx#L243)
- Export-flow tests assert the download call receives `state.exportSize` rather than any preview value. [`export-token.test.ts:68`](../../src/components/editor/export-token.test.ts#L68)

## Residual risk / coverage gap

There is **no identified functional blocker**. The remaining gap is integration-level evidence, not a source defect:

1. The Canvas size tests mock `renderToken`; the export-flow tests mock `exportTokenAsPNG`. They prove parameter isolation, but do not encode a real PNG after a mobile-capped preview and inspect its dimensions or crop pixels.
2. The breakpoint tests use mocked `ResizeObserver` and `matchMedia`; this audit did not run a browser/CDP viewport-resize check on a physical high-DPR mobile device.

If stronger release evidence is required, add one browser/integration test that sets a high DPR mobile viewport, makes an edit, exports `2048px`, and verifies the PNG dimensions plus a recognizable crop position. That would close the test gap without changing the implementation.
