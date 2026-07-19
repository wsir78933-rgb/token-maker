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

