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

