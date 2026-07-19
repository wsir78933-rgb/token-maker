# Desktop Editor Stable Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve an already loaded editor's React subtree when the viewport crosses the `1280px` desktop breakpoint, while retaining the desktop-only loading fallback that prevents CLS.

**Architecture:** Replace the two viewport-selected `next/dynamic` wrappers with one stable `DeferredEditor` wrapper. Its loading component subscribes to the existing viewport interface: it renders the full-height desktop fallback only at `>=1280px` and returns `null` for mobile. After the editor resolves, parent viewport updates keep rendering the same dynamic component type, so `EditorLayout` is not unmounted.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Vitest.

## Global Constraints

- Work in the user-authorized current `main` checkout; do not create a commit.
- Modify only `src/components/layout/DeferredEditorLayout.tsx` and `src/components/layout/DeferredEditorLayout.test.tsx`.
- Preserve `EDITOR_PRELOAD_MARGIN = '120px 0px'`, `ssr: false`, direct hash/search-parameter behavior, observer ownership, and mobile explicit-launch timing.
- Desktop loading fallback remains visible only at `>=1280px` and keeps `min-h-[100svh]`, `xl:h-screen`, and `xl:overflow-hidden`.
- Mobile loading must remain visually empty while the dynamic module is unresolved; do not mount a second editor or add a mobile skeleton.
- Do not add dependencies, routes, telemetry, global state migration, keys, or eager editor downloads.
- Use TDD: verify the new regression test is RED against the current two-wrapper code before changing production code.

---

### Task 1: Keep the loaded editor mounted across breakpoint changes

**Files:**

- Modify: `src/components/layout/DeferredEditorLayout.tsx`
- Modify: `src/components/layout/DeferredEditorLayout.test.tsx`

**Interfaces:**

- Consumes: `subscribeToDesktopEditorLayout`, `getDesktopEditorLayoutSnapshot`, `getServerDesktopEditorLayoutSnapshot`, `DesktopEditorLoadingFallback`, and the existing `loadEditorLayout` import function.
- Produces: one stable `DeferredEditor` dynamic component; `EditorLoadingFallback` that returns the desktop fallback only when the viewport snapshot is `true`.

- [ ] **Step 1: Extend the dynamic mock with stateful editor contents**

In `DeferredEditorLayout.test.tsx`, import `useState` from React and add a module-level `shouldRenderStatefulEditor` flag, resetting it to `false` in `beforeEach`.

Inside the existing `next/dynamic` mock factory, define this shared stateful child:

```tsx
function StatefulEditorContents() {
  const [draftTokenName, setDraftTokenName] = useState('');

  return (
    <input
      data-testid="stateful-editor-input"
      value={draftTokenName}
      onChange={(event) => setDraftTokenName(event.target.value)}
    />
  );
}
```

Keep returning a newly declared wrapper component for every `dynamic()` invocation. In that wrapper:

```tsx
const loadingFallback = options?.loading?.();
if (shouldRenderDynamicLoadingFallback && loadingFallback !== null && loadingFallback !== undefined) {
  return loadingFallback;
}

if (shouldRenderStatefulEditor) {
  return <StatefulEditorContents />;
}

return <div data-testid="editor-layout" />;
```

This retains the existing desktop fallback tests, treats a mobile `null` loading view as visually empty, and makes wrapper replacement observable through real child state.

- [ ] **Step 2: Add the P1 failing regression test**

Add this test after the current viewport-observer test:

```tsx
it('keeps loaded editor state when the viewport crosses the desktop breakpoint', async () => {
  installViewportMatchMedia(true);
  shouldRenderStatefulEditor = true;
  const { DeferredEditorLayout } = await import('./DeferredEditorLayout');

  render(<DeferredEditorLayout />);
  const desktopObserver = intersectionObserverInstances[0];
  if (!desktopObserver) {
    throw new Error('Expected a desktop IntersectionObserver');
  }
  desktopObserver.triggerIntersection(true);

  const statefulEditorInput = await screen.findByTestId('stateful-editor-input');
  fireEvent.change(statefulEditorInput, { target: { value: 'draft-token' } });

  act(() => {
    changeViewport(false);
  });

  expect(screen.getByTestId('stateful-editor-input')).toHaveValue('draft-token');
});
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
```

Expected: the new test fails because the current `DeferredDesktopEditor` and `DeferredMobileEditor` are different component types. On `changeViewport(false)`, React unmounts the stateful child and the input value becomes an empty string.

- [ ] **Step 4: Replace the two dynamic wrappers with one stable wrapper**

In `DeferredEditorLayout.tsx`, retain `loadEditorLayout`, `EditorWorkspaceSkeleton`, and `DesktopEditorLoadingFallback`. Add this loading component after `DesktopEditorLoadingFallback`:

```tsx
function EditorLoadingFallback() {
  const isDesktopEditorLayout = useSyncExternalStore(
    subscribeToDesktopEditorLayout,
    getDesktopEditorLayoutSnapshot,
    getServerDesktopEditorLayoutSnapshot,
  );

  if (isDesktopEditorLayout !== true) return null;

  return <DesktopEditorLoadingFallback />;
}
```

Replace `DeferredDesktopEditor` and `DeferredMobileEditor` with:

```tsx
const DeferredEditor = dynamic(loadEditorLayout, {
  ssr: false,
  loading: () => <EditorLoadingFallback />,
});
```

Change the `shouldLoadEditor` branch to:

```tsx
if (shouldLoadEditor) {
  return <DeferredEditor />;
}
```

Place the media-query constants and snapshot/subscription functions before `EditorLoadingFallback` so its browser boundary is explicit and the component reads naturally. Keep their behavior unchanged.

- [ ] **Step 5: Run focused regression checks and verify GREEN**

Run:

```bash
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
pnpm exec eslint src/components/layout/DeferredEditorLayout.tsx src/components/layout/DeferredEditorLayout.test.tsx
git diff --check
```

Expected: all tests pass, including the new loaded-editor breakpoint test; ESLint and `git diff --check` exit `0`.

### Task 2: Validate integration and browser behavior

**Files:**

- No production files required.

**Interfaces:**

- Verifies that the stable wrapper preserves the P1 regression contract without weakening desktop CLS containment or mobile behavior.

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
git diff --check
```

Expected: each command exits `0`.

- [ ] **Step 3: Browser acceptance**

At a desktop viewport of `1280px` width, open `/#editor-workspace` on the same origin as the local dev server and verify the resolved editor has `xl:h-screen` and hidden vertical overflow. The local dynamic chunk may resolve too quickly to visually capture the fallback; the unresolved desktop and no-mobile-fallback contracts are covered by automated tests. Do not claim an immediate CrUX CLS value because it is rolling 28-day field data.

