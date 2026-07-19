# Desktop Editor CLS Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the desktop homepage's dynamic-editor loading gap while preserving its existing `120px` near-viewport preload.

**Architecture:** Keep the mobile and desktop dynamic-editor entry points separate. The desktop entry point renders a full-height, overflow-contained fallback while the existing EditorLayout module resolves; the mobile entry point preserves its existing explicit launch behavior. Both entry points load the same EditorLayout module.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Vitest.

## Global Constraints

- Apply the new loading fallback only to desktop layouts at `>=1280px`.
- Keep `EDITOR_PRELOAD_MARGIN = '120px 0px'`, `ssr: false`, direct hash/search-parameter paths, and all mobile launch behavior unchanged.
- The desktop fallback outer geometry must match `EditorLayout` at `xl`: `xl:h-screen` and `xl:overflow-hidden`.
- Reuse one module import function for both dynamic entry points; do not add dependencies, routes, telemetry, or an eager editor download.
- Use a test-first red-green cycle. Do not create a commit in this task.

---

### Task 1: Preserve desktop workspace geometry while the editor chunk resolves

**Files:**
- Modify: `src/components/layout/DeferredEditorLayout.tsx`
- Modify: `src/components/layout/DeferredEditorLayout.test.tsx`

**Interfaces:**
- Consumes: existing `isDesktopEditorLayout`, `EDITOR_PRELOAD_MARGIN`, browser `IntersectionObserver`, and the EditorLayout dynamic module.
- Produces: `DeferredDesktopEditor` with a loading fallback marked `data-testid="desktop-editor-loading-fallback"`; `DeferredMobileEditor` retains the existing no-fallback loading behavior.

- [ ] **Step 1: Make the dynamic mock able to simulate an unresolved desktop module**

In `DeferredEditorLayout.test.tsx`, add a module-level `shouldRenderDynamicLoadingFallback` flag. Change the existing `next/dynamic` mock so a wrapper configured with `options.loading` calls that function only when the flag is true; otherwise it renders the existing `data-testid="editor-layout"` mock.

Add this test:

```tsx
it('keeps desktop workspace geometry while the editor module resolves', async () => {
  installViewportMatchMedia(true);
  shouldRenderDynamicLoadingFallback = true;
  const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

  render(<DeferredEditorLayout />);
  const desktopObserver = intersectionObserverInstances[0];
  if (!desktopObserver) {
    throw new Error('Expected a desktop IntersectionObserver');
  }
  desktopObserver.triggerIntersection(true);

  const loadingFallback = await screen.findByTestId('desktop-editor-loading-fallback');
  expect(loadingFallback.className).toContain('xl:h-screen');
  expect(loadingFallback.className).toContain('xl:overflow-hidden');
  expect(screen.queryByTestId('editor-layout')).toBeNull();
});
```

Reset `shouldRenderDynamicLoadingFallback` to `false` in `beforeEach`.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
```

Expected: the new test fails because the current dynamic editor has no loading fallback and renders no `desktop-editor-loading-fallback`.

- [ ] **Step 3: Add separate desktop and mobile dynamic entry points**

In `DeferredEditorLayout.tsx`:

```tsx
function loadEditorLayout() {
  return import('@/components/layout/EditorLayout').then((module) => module.EditorLayout);
}

function DesktopEditorLoadingFallback() {
  return (
    <div
      data-testid="desktop-editor-loading-fallback"
      aria-busy="true"
      className="editor-shell flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground xl:h-screen"
    >
      <EditorWorkspaceSkeleton />
    </div>
  );
}

const DeferredDesktopEditor = dynamic(loadEditorLayout, {
  ssr: false,
  loading: () => <DesktopEditorLoadingFallback />,
});

const DeferredMobileEditor = dynamic(loadEditorLayout, { ssr: false });
```

Extract the current desktop/unknown skeleton markup into `EditorWorkspaceSkeleton`. In the `shouldLoadEditor` branch, render `DeferredDesktopEditor` only when `isDesktopEditorLayout === true`; render `DeferredMobileEditor` otherwise. Keep all current URL, observer, timer, and mobile-button logic unchanged.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
pnpm exec eslint src/components/layout/DeferredEditorLayout.tsx src/components/layout/DeferredEditorLayout.test.tsx
git diff --check
```

Expected: all tests pass, ESLint exits 0, and `git diff --check` exits 0.

### Task 2: Verify integrated desktop behavior

**Files:**
- No production files required.

**Interfaces:**
- Verifies the fallback contract from Task 1 without changing the mobile editor path.

- [ ] **Step 1: Run targeted regressions**

```bash
pnpm exec vitest run \
  src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/layout/EditorLayout.test.tsx \
  src/components/editor/Canvas.test.tsx \
  --reporter=verbose
```

Expected: all targeted tests pass.

- [ ] **Step 2: Run complete validation**

```bash
pnpm test
pnpm lint
pnpm build
```

Expected: each command exits 0.

- [ ] **Step 3: Browser acceptance**

At 1280×844, load the homepage from the top, scroll until the desktop preload begins, and verify that a full-height fallback remains present until `EditorLayout` appears. Record `layout-shift` entries when a compatible browser session is available. At 390×844, confirm the `mobile-editor-launch` control still appears before a user explicitly starts the editor.
