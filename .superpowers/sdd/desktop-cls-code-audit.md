# Desktop homepage CLS code audit

## Verdict

**Confirmed primary mechanism:** on desktop, the `IntersectionObserver` sets
`shouldLoadEditor` before the `ssr: false` editor chunk has resolved. That
immediately replaces the full-viewport placeholder with `DeferredEditor`, but
the `next/dynamic` call supplies no `loading` component. Next's runtime then
uses a `null` Suspense fallback while the chunk is pending. The placeholder is
therefore removed from normal flow; `EditorShowcaseSection` and everything
after it jump upward by about one viewport height, then jump back when
`EditorLayout` resolves.

This is a code-proven CLS mechanism. It can account for a large desktop CLS
such as 0.26, but the exact contribution to that reported score still requires
the browser trace (network timing and the viewport determine the score).

## Evidence chain

1. `src/app/(en)/page.tsx:68-73` (and the Chinese equivalent at
   `src/app/(zh)/zh/page.tsx:68-73`) puts the editor placeholder before the
   showcase and all remaining homepage content. Those later sections are in
   normal document flow.
2. At `src/components/layout/DeferredEditorLayout.tsx:74-85`, the desktop
   observer uses the 120px root margin and calls `setShouldLoadEditor(true)` at
   line 77. There is no wait for the import promise.
3. At `src/components/layout/DeferredEditorLayout.tsx:123-124`, that state
   update unmounts the placeholder and renders only the dynamic component.
4. The dynamic declaration at `src/components/layout/DeferredEditorLayout.tsx:7-10`
   sets `ssr: false` but has no `loading` fallback.
5. The installed Next 16.2.4 runtime verifies the missing fallback is `null`:
   `node_modules/next/dist/shared/lib/dynamic.js:58-79` provides the default
   loading function that returns `null`; `node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js:40-72`
   uses that result as the Suspense fallback for a non-SSR dynamic component.
6. The removed element reserves at least one viewport at
   `DeferredEditorLayout.tsx:128-158` (`min-h-[100svh]` at line 133). The
   resolved desktop editor again reserves a viewport through
   `src/components/layout/EditorLayout.tsx:46-52` (`xl:h-screen` at line 51).
   Thus the intermediate null fallback, rather than a final placeholder/editor
   height mismatch, is the shift.

The 120px observer margin only begins loading the chunk shortly before the
workspace is visible; it does not reserve geometry during an unresolved import
and is not a correctness guard against a cold or delayed chunk.

## Candidate review

| Candidate | Result | Evidence |
| --- | --- | --- |
| Dynamic editor null interval | **Confirmed primary** | Chain above: full-height placeholder is removed before the lazy module resolves, and Next's default fallback is null. |
| Final desktop placeholder vs editor height | Ruled out as the primary mechanism | Placeholder has `min-h-[100svh]` (`DeferredEditorLayout.tsx:133`); resolved desktop root has `xl:h-screen` (`EditorLayout.tsx:51`). The likely one-viewport upward/downward jump exists only during the null interval. |
| Editor `Header`, canvas, panels, or batch state | Not a source of the above flow shift | They render only after the dynamic chunk resolves (`EditorLayout.tsx:53-87`). The desktop editor root is height-constrained at `xl:h-screen`, so their internal layout cannot move the following homepage sections through the observed pre-resolution gap. |
| HomeHero/topbar hydration | No code path found that can cause the reported full-width shift | HomeHero is synchronous local data and normal static markup (`HomeSeoContent.tsx:198-264`); `ContentSiteTopbar.tsx:42-83` has no client state/effect/scroll transform. Its `SiteMark` has explicit 36×36 dimensions (`SiteMark.tsx:10-17`). |
| Homepage images / dynamic content below the editor | No unreserved-image candidate found | Showcase cards specify `width={512}`, `height={512}`, and `aspect-square` (`HomeShowcase.tsx:82-92`). Feedback images specify 260×260 and are absolutely positioned inside a fixed-height wrapper (`HomeSeoContent.tsx:145-170`). No external webfont is configured; the CSS uses system font stacks (`globals.css:50-53`) and both root layouts import no `next/font` or font stylesheet. |

## Relation to the July 19 mobile change

The current mobile diff did **not** introduce the desktop null-fallback path:

- `git blame` attributes the dynamic declaration, observer state update, return
  branch, and placeholder to `f6cc4e7` (2026-06-07). The mobile commit
  `ca76b94` changes the breakpoint policy but retains those desktop lines.
- The new guard at `DeferredEditorLayout.tsx:67` deliberately keeps the same
  observer behaviour for `>=1280px`; the observer body still sets the state at
  line 77 with the same 120px root margin.
- The July 19 `Canvas` change affects only backing-store pixel dimensions after
  `Canvas` has mounted (`Canvas.tsx:64-98`); it does not change CSS layout
  dimensions (`Canvas.tsx:229-242`) and cannot fill the pre-import gap.
- Removing `'use client'` from `ContentSiteTopbar.tsx` changes the rendering
  boundary, not the markup or geometry. It is not a CLS cause in this chain.

So the mobile work correctly preserves the desktop policy, but it also
preserves this older desktop CLS defect. It is neither evidence against the
mobile work nor a reason to weaken its `<1280px` lazy-load gate.

## Smallest repair

Keep the existing desktop observer and 120px preload. Add a `loading`
component to the `next/dynamic` declaration that renders the same
`#editor-workspace` full-height shell as the current placeholder (including
`min-h-[100svh]`; an inert skeleton is sufficient). Prefer one small reusable
`EditorWorkspaceLoadingFallback` component used by both the initial placeholder
and `dynamic({ loading })`, so their geometry cannot drift.

This changes one responsibility only: the lazy-module pending state retains
space. It does not change the breakpoint, direct-link behaviour, observer
threshold, editor state, preview resolution, or topbar rendering.

## Required regression coverage

1. In `DeferredEditorLayout.test.tsx`, replace the current synchronous
   `next/dynamic` mock (`lines 8-12`) with a controllable delayed loader, or
   add a focused test that exposes the supplied `loading` option. After a
   desktop observer trigger but before resolving the editor promise, assert
   that one `#editor-workspace` loading shell remains in the DOM and has the
   reserved-height class; after resolving, assert the real editor replaces it.
   The current mock returns the editor synchronously, so all 15 layout tests
   miss the defective interval.
2. Browser regression at a desktop viewport (1280px or wider): delay the
   `EditorLayout` dynamic chunk, inject a `PerformanceObserver` for
   `layout-shift`, load `/`, and wait through observer trigger plus chunk
   resolution. Assert no layout-shift entry has sources in the following
   homepage sections and cumulative non-input CLS stays within the agreed
   budget (recommended `0`). Repeat once with an uncached/cold load.
3. Retain the existing desktop preload assertion (`DeferredEditorLayout.test.tsx:159-166`)
   and direct URL tests (`238-263`) to prove the repair does not alter the
   mobile requirements.

## Commands run

```text
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/layout/EditorLayout.test.tsx \
  src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose
```

Result: exit 0; 3 files and 23 tests passed. This validates the present
breakpoint/topbar contracts but cannot validate the async gap because the
layout test deliberately mocks `next/dynamic` as an immediate component.

## Audit limits

No application source, configuration, dependency, or Git state was changed.
This report is a code/runtime audit; a real-browser trace is still needed to
attribute the exact 0.26 score numerically.
