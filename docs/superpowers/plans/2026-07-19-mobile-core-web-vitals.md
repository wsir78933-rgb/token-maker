# Mobile Core Web Vitals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the homepage's mobile Core Web Vitals without changing the desktop editor layout or its automatic near-viewport preload.

**Architecture:** Treat `<1280px` as the mobile/tablet editor boundary already used by `EditorLayout`. On those viewports, passive scrolling must not mount the large editor; an explicit launch shows a fast loading state before the editor mounts. Keep the preview responsive while constraining only its mobile backing-store pixel budget. Convert the static shell of the topbar to server rendering while retaining the existing tracked-link client island.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Zustand, Vitest.

## Global Constraints

- Change mobile/tablet behavior only at widths below `1280px`; preserve desktop layout and `120px` `IntersectionObserver` preload.
- Preserve direct `#editor-workspace` and editor search-param links.
- Preserve PNG export resolution and editor state behavior; only preview rendering may have a mobile backing-store cap.
- Do not add dependencies, background telemetry, route changes, or a mobile-only border-library interaction.
- Use test-first red-green cycles. Do not create a commit in this task.

---

### Task 1: Gate passive mobile editor mounting

**Files:**
- Modify: `src/components/layout/DeferredEditorLayout.tsx`
- Modify: `src/components/layout/DeferredEditorLayout.test.tsx`
- Modify: `src/lib/i18n/en.ts`
- Modify: `src/lib/i18n/zh.ts`

**Interfaces:**
- Consumes: browser `matchMedia('(min-width: 1280px)')`, current URL hash/search parameters, and `useI18n().t`.
- Produces: a mobile launch control with `data-testid="mobile-editor-launch"`; direct editor URLs still mount the editor; desktop still observes with `rootMargin: '120px 0px'`.

- [ ] **Step 1: Write failing tests**

Add a matchMedia harness and assert:

```tsx
it('does not observe or mount the editor after passive mobile scrolling', async () => {
  installViewportMatchMedia(false);
  render(<DeferredEditorLayout />);
  expect(screen.getByTestId('mobile-editor-launch')).toBeDefined();
  expect(intersectionObserverInstances).toHaveLength(0);
  expect(screen.queryByTestId('editor-layout')).toBeNull();
});

it('keeps the desktop near-viewport preload contract', async () => {
  installViewportMatchMedia(true);
  render(<DeferredEditorLayout />);
  expect(observedRootMargins).toEqual(['120px 0px']);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose`

Expected: the mobile launch-control assertion fails because the current component always creates an observer.

- [ ] **Step 3: Implement the smallest mobile launch flow**

Add focused helpers in `DeferredEditorLayout.tsx`:

```ts
const DESKTOP_EDITOR_MEDIA_QUERY = '(min-width: 1280px)';

function isDesktopEditorLayout() {
  return window.matchMedia(DESKTOP_EDITOR_MEDIA_QUERY).matches;
}

function hasDirectEditorIntent() {
  return window.location.hash === '#editor-workspace'
    || hasEditorSearchParam(new URLSearchParams(window.location.search));
}
```

Use the existing observer only on desktop. On mobile, render a localized launch button until the user requests the editor. In the same click handler, set a visible loading state, then schedule `setShouldLoadEditor(true)` after yielding the click event so the launch feedback can render before the large module mounts. Keep direct URL intent eager on every viewport.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose`

Expected: all tests pass, including desktop preload and direct-link coverage.

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

### Task 3: Reduce the homepage topbar client boundary

**Files:**
- Modify: `src/components/site/ContentSiteTopbar.tsx`
- Modify: `src/components/site/SiteTopbarVisibility.test.tsx`

**Interfaces:**
- Consumes: the existing `TrackedEditorLink` client component for click analytics.
- Produces: a server-renderable `ContentSiteTopbar` whose only client island remains `TrackedEditorLink`.

- [ ] **Step 1: Write a failing source-boundary test**

```ts
it('keeps the topbar shell server-renderable', async () => {
  const source = await readFile('src/components/site/ContentSiteTopbar.tsx', 'utf8');
  expect(source.startsWith("'use client'")).toBe(false);
  expect(source).toContain("from '@/components/site/TrackedEditorLink'");
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose`

Expected: fail because the topbar file currently begins with `'use client'`.

- [ ] **Step 3: Remove only the topbar-wide client directive**

Delete the `'use client'` directive from `ContentSiteTopbar.tsx`. Keep `TrackedEditorLink` unchanged so existing analytics, URLs, and visual output stay intact.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `pnpm exec vitest run src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose`

Expected: all topbar visibility and server-boundary checks pass.

### Task 4: Verify the integrated mobile behavior

**Files:**
- No production files required unless a preceding task's verification reveals a defect.

- [ ] **Step 1: Run targeted regression tests**

Run:

```bash
pnpm exec vitest run \
  src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/editor/preview-rendering.test.ts \
  src/components/editor/Canvas.test.tsx \
  src/components/site/SiteTopbarVisibility.test.tsx \
  --reporter=verbose
```

Expected: all targeted tests pass.

- [ ] **Step 2: Run project validation**

Run:

```bash
pnpm test
pnpm lint
pnpm build
```

Expected: each command exits successfully.

- [ ] **Step 3: Validate actual responsive behavior**

At 390×844, 480px, and 768px wide, passively scroll through the editor placeholder and confirm that it does not mount until the localized launch control is activated. At 1280px, confirm that the existing near-viewport preload remains. Record `layout-shift` entries for both flows when browser instrumentation is available.
