# Desktop CLS Task 1 Independent Review

## Verdict

**APPROVED.** The production change remains narrowly scoped and the reviewed desktop pending-state implementation meets the intended geometry contract. The two earlier P2 test-coverage gaps are now covered by focused tests that exercise the requested post-hydration desktop direct-link path and the mobile explicit-launch no-fallback path. No current production defect was found in hydration/direct-link selection, duplicate chunk loading, SSR/SEO output, or the existing mobile behavior.

No product source, configuration, dependencies, or Git commit was changed during this review. I attempted to allocate a separate test-coverage reviewer as required by the repository policy, but the Codex agent-thread limit had already been reached; the checks below were therefore performed directly and independently.

## Verified design evidence

| Review focus | Result | Evidence |
| --- | --- | --- |
| Hydrated desktop direct hash/search must choose the desktop fallback | **Pass** | `useSyncExternalStore` is declared before all effects at `DeferredEditorLayout.tsx:90-94`. The server snapshot is `null` (`:58-60`), but React 19.2.3 registers its store-subscription/snapshot-update effects before the component's direct-intent effect. The direct intent then uses a `setTimeout(..., 0)` at `:96-99` / `:78-82`; the desktop snapshot update is scheduled in the preceding passive-effect work and runs before the next timer task. The focused `hydrateRoot` regression at `DeferredEditorLayout.test.tsx:166-199` then verifies that the next-timer direct hash path selects `DeferredDesktopEditor`'s loading fallback, not the mobile no-loading wrapper. |
| Two dynamic wrappers / one import loader | **No duplicate eager request or conflicting render path found** | Both wrappers use the same `loadEditorLayout` function (`:7-9`, `:39-44`) and the render branch is exclusive (`:157-159`). Next 16's `React.lazy` initializer invokes its loader when that wrapper is rendered, rather than at the two `dynamic()` declarations; the unused wrapper therefore does not eagerly fetch the chunk. A viewport crossing after loading starts can mount the other wrapper, but the identical `import()` specifier is served through the browser module map rather than a second chunk transfer; the mobile wrapper deliberately has no fallback. |
| Desktop fallback geometry | **Pass** | The pending root has `min-h-[100svh]`, `xl:h-screen`, and `xl:overflow-hidden` at `DeferredEditorLayout.tsx:27-36`. The resolved root has the same desktop height and overflow constraints at `EditorLayout.tsx:46-52`. Both use `editor-shell` and `w-full`; the fallback's internal padding is contained by the global border-box model and cannot increase its `xl:h-screen` outer size. |
| SSR / technical SEO | **Pass** | `shouldLoadEditor` starts `false` (`DeferredEditorLayout.tsx:84-88`), so SSR continues to return the existing placeholder at `:161-183`. Both editor entries remain `ssr: false` (`:39-44`); no server-rendered editor or new dependency was introduced. |
| Existing mobile workflow | **Pass** | The only changed run-time choice is at `DeferredEditorLayout.tsx:157-159`; `isDesktopEditorLayout === true` is required to select the new fallback wrapper. Mobile observer gate (`:101-120`), launch timer (`:149-155`), initial URL/hash branch (`:96-99`), and hash-change handler (`:131-147`) are unchanged. Existing tests exercise passive mobile scroll, mobile hydration, same-document hash, direct hash/search links, launch feedback, and timer cleanup; the new unresolved-state explicit-launch test at `DeferredEditorLayout.test.tsx:341-356` additionally proves that the mobile wrapper has no loading fallback. |
| Code quality / scope | **Pass** | `loadEditorLayout`, `EditorWorkspaceSkeleton`, and `DesktopEditorLoadingFallback` each have one clear responsibility (`DeferredEditorLayout.tsx:7-37`). The shared skeleton removes duplicate JSX without creating a new abstraction or dependency. The diff changes only the planned component and its test. |

## Resolved findings

### P2-1 — Resolved: hydrated desktop direct link retains the fallback while unresolved

- **Risk level before resolution:** Medium test-coverage gap.
- **Location:** `src/components/layout/DeferredEditorLayout.test.tsx:166-199`; production selection remains `src/components/layout/DeferredEditorLayout.tsx:90-99` and `:157-159`.
- **Verification evidence:** The test starts from server markup (`renderToString`), hydrates at a desktop match-media result, sets `/#editor-workspace`, and enables the dynamic unresolved-state simulation before the component is imported. It then advances the zero-delay direct-load timer and requires `desktop-editor-loading-fallback` while requiring `editor-layout` to be absent. The initial placeholder has neither assertion target; a mobile-wrapper selection would instead render the mocked `editor-layout`. The test therefore cannot pass unless the post-hydration timer has selected `DeferredDesktopEditor` and its configured loading fallback.
- **Result:** Pass. The new focused test completed in the reviewed 18-test run.

### P2-2 — Resolved: mobile explicit launch remains a no-fallback entry while unresolved

- **Risk level before resolution:** Medium test-coverage gap.
- **Location:** `src/components/layout/DeferredEditorLayout.test.tsx:341-356`; protected production distinction is `src/components/layout/DeferredEditorLayout.tsx:39-44` and `:157-159`.
- **Verification evidence:** The test uses a mobile match-media result and the same unresolved-state simulation, clicks `mobile-editor-launch`, then advances the actual zero-delay launch timer. It requires `editor-layout` and requires `desktop-editor-loading-fallback` to be absent. Because the mock calls a supplied `options.loading` only when the flag is true (`test.tsx:10-17`), adding a loading option to `DeferredMobileEditor` would make this test fail.
- **Result:** Pass. The new focused test completed in the reviewed 18-test run.

## Commands run

```text
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx --reporter=verbose
```

Result: exit `0`; 1 test file, 18 tests passed. This rerun includes both resolved P2 cases.

```text
pnpm exec eslint src/components/layout/DeferredEditorLayout.tsx src/components/layout/DeferredEditorLayout.test.tsx
git diff --check
```

Result: both exit `0` with no output. The current diff contains only the two planned source/test files.

## Approval basis

P2-1 and P2-2 are now covered and pass; ESLint and `git diff --check` also pass. The tracked production diff remains limited to `DeferredEditorLayout.tsx` and its directly related test, with no dependency, route, SEO/SSR, observer-margin, URL/hash, or mobile-timer change beyond the approved Task 1 fallback split. Browser-level CLS measurement remains a Task 2 acceptance activity, not a blocker for this narrowly scoped code review.
