# Task 2: Mobile Preview Backing Store Report

## Scope completed

- Added `getPreviewBackingSize(previewCssSize, devicePixelRatio, isMobileEditorLayout)` in `src/components/editor/preview-rendering.ts`.
- The function caps only mobile editor layouts at `1024` backing pixels per dimension.
- `Canvas` applies the sizing function from its existing `ResizeObserver` and from `(min-width: 1280px)` media-query changes, using the latest observed preview width for breakpoint-only transitions.
- PNG export code and editor store state were not changed.

## Red evidence

1. `pnpm exec vitest run src/components/editor/preview-rendering.test.ts --reporter=verbose`
   - Failed as expected before implementation: `Cannot find module './preview-rendering'`.
2. `pnpm exec vitest run src/components/editor/Canvas.test.tsx --reporter=verbose`
   - Failed as expected before the Canvas change: mobile DPR-3, CSS-512 preview received `1536`; the required backing size was `1024`.
   - The corresponding desktop test already received `1536`.
3. `pnpm exec vitest run src/components/editor/Canvas.test.tsx --reporter=verbose`
   - Failed as expected for the P2 review regression: with a fixed CSS width of `512` and DPR `3`, desktop-to-mobile retained `1536` instead of `1024`, and mobile-to-desktop retained `1024` instead of `1536`.
   - Neither assertion invoked `ResizeObserver` after the media-query change.

## Green evidence

`pnpm exec vitest run src/components/editor/preview-rendering.test.ts src/components/editor/Canvas.test.tsx --reporter=verbose`

- Passed: 2 test files, 15 tests.
- Covers mobile cap at `1024`, unchanged desktop backing size at `1536`, direct `Canvas` `ResizeObserver` integration, and both directions of an in-session 1280px breakpoint transition without an additional resize callback.

## P2 review correction

- `Canvas` retains the latest positive observed preview CSS width in a ref.
- It subscribes to `(min-width: 1280px)` changes and recomputes the backing size from that width when the editor layout changes.
- A zero, negative, or `NaN` observer width clears the retained width and keeps the `512` reference-size fallback when a later breakpoint change occurs.

## Final check

- `git diff --check` passed.
- `pnpm exec eslint src/components/editor/Canvas.tsx src/components/editor/Canvas.test.tsx src/components/editor/preview-rendering.ts src/components/editor/preview-rendering.test.ts` passed.

## Issues

None found within Task 2 scope.
