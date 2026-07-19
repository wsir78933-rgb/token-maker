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

