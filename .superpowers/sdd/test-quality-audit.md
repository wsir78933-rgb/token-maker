# Current-diff test quality audit

## Scope and fresh evidence

Read-only review of the current changes and the four requested test files:

- `src/components/layout/DeferredEditorLayout.test.tsx`
- `src/components/editor/Canvas.test.tsx`
- `src/components/editor/preview-rendering.test.ts`
- `src/components/site/SiteTopbarVisibility.test.tsx`

The focused current command was run after this review:

```text
pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx \
  src/components/editor/preview-rendering.test.ts \
  src/components/editor/Canvas.test.tsx \
  src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose

4 files passed, 35 tests passed, 0 failed (exit 0).
```

This is not an acceptance verdict. One P2 remains untested and is still present in the
production code; the all-green command is therefore a false green for the direct-hash
contract.

## Eight-requirement verdict

| Requirement | Verdict | Evidence |
| --- | --- | --- |
| High cohesion | Partial | `SiteTopbarVisibility.test.tsx` mixes source-boundary inspection with topbar visibility and scrolling behavior (lines 3, 93-110). |
| Low coupling | Partial | The topbar test reads a source file by a working-directory-relative path and asserts an internal import (lines 105-110), rather than an observable boundary. |
| Single responsibility | Partial | The topbar source-boundary assertion belongs in a focused server-boundary test, not in the visibility suite (lines 93-110). |
| Module interfaces | Partial | `source.startsWith()` and an import-string assertion couple the test to file text and a chosen child component, not the topbar's rendered interface (lines 105-110). |
| KISS | Partial | The two large, duplicated media-query harnesses add maintenance surface without a shared narrow test utility: `DeferredEditorLayout.test.tsx:14-93` and `Canvas.test.tsx:35-97`. |
| Fail fast | Partial | `Canvas.test.tsx` calls the test observer with optional chaining (lines 235 and 268); a missing observer produces a later size mismatch instead of an immediate, named harness failure. |
| YAGNI | Pass | The new pure preview helper is small and its current production use is limited to the preview sizing path (`preview-rendering.ts:1-13`, `Canvas.tsx:64-98`). No test-driven extra abstraction was introduced. |
| Precise names | Partial | `does not observe or mount the editor after passive mobile scrolling` claims a scroll behavior but performs no scroll (DeferredEditorLayout test lines 120-129). The positive hash test is precise, but its missing negative complement leaves the URL contract incomplete (lines 196-214). |

## Findings

### P2 — unrelated fragment plus a preset still mounts the editor, but the suite is green

**Production evidence:**

- `src/components/layout/DeferredEditorLayout.tsx:36-40` defines `hasDirectEditorIntent()` as
  `#editor-workspace` **or** any supported editor search parameter.
- `src/components/layout/DeferredEditorLayout.tsx:96-104` invokes that broad predicate from a
  `hashchange` listener intended to react to editor fragments.

On an already-mounted mobile homepage, set the URL to `/?preset=warrior` with
`history.replaceState()` (which neither remounts nor emits `hashchange`), then navigate to
`#details`. The listener sees the unrelated fragment, the preset makes the broad predicate true,
and it schedules the editor. This is a verified consequence of the two conditions above.

**Why the tests are false green:**

- `src/components/layout/DeferredEditorLayout.test.tsx:196-214` covers only the positive
  `#editor-workspace` transition.
- `src/components/layout/DeferredEditorLayout.test.tsx:228-241` covers only cold-start search
  parameters. It cannot exercise a search parameter being present before a later unrelated
  same-document fragment.

The current project report had already recorded this exact P2 as "CHANGES REQUESTED" in
`.superpowers/sdd/task-1-review.md:3-15`. It conflicts with the later unconditional claims of
"None observed" in `.superpowers/sdd/task-1-report.md:39-41` and "No blockers" in
`.superpowers/sdd/integration-validation.md:22-25`. The source still has the reviewed condition,
so those reports must not be used as the acceptance record.

**Required regression test:** Start at `/` on mobile and assert the launch control is visible.
Use `window.history.replaceState(null, '', '/?preset=warrior')`, then perform a real
`#details` hash transition and flush the zero-delay timer. Assert the launch control remains and
`editor-layout` is absent. Keep the existing positive `#editor-workspace` test separately. The
production correction should make the hash listener test the editor hash specifically; any
reactive search-parameter support needs its own trigger and test.

### P3 — mobile “passive scrolling” is named but not exercised

`src/components/layout/DeferredEditorLayout.test.tsx:120-129` asserts initial mobile state and
the absence of an `IntersectionObserver`, but it never dispatches a scroll event or waits for
queued work. That is enough to prove the current implementation does not construct that observer;
it is not enough to protect the stated behavior if a future change introduces a scroll-based
autoload path.

**Test improvement:** Rename the current case to `does not create the desktop preload observer on
initial mobile render`. Add a second behavior test that dispatches one or more scroll events after
mobile render, advances pending timers, and asserts that the launch control remains while the
editor stays absent. This keeps each test to one clear responsibility.

### P3 — canvas lifecycle tests do not verify cleanup

The breakpoint tests exercise valid resize and both layout directions
(`src/components/editor/Canvas.test.tsx:216-283`), which is valuable regression coverage. Their
harness cannot prove the lifecycle cleanup, however: `MockResizeObserver.disconnect()` is empty
at lines 44-46, and the media-query object returns opaque `removeEventListener` mocks at
lines 66-85. The production effect removes both listeners at `Canvas.tsx:92-97`, but no test
would fail if either removal were deleted.

**Test improvement:** Make `disconnect`, `addEventListener`, and `removeEventListener` spies on a
per-instance media-query mock. Render, unmount, and assert the exact resize observer disconnect
and exact `change` listener removal. Then dispatch a viewport change and verify it does not cause
another render. This covers the leak/stale-update regression without coupling to React internals.

### P3 — preview helper has only two happy-path unit cases and misses the fallback contract claimed by the report

`src/components/editor/preview-rendering.test.ts:4-12` checks only one high-DPR capped mobile
value and one desktop value. It does not cover a mobile value below the cap, the rounding boundary,
or invalid observed widths. Yet `.superpowers/sdd/task-2-report.md:30-32` claims that zero,
negative, and `NaN` observer widths clear the retained width and preserve the 512 fallback.

The fallback lives across the callback and breakpoint handler in
`src/components/editor/Canvas.tsx:76-90`, so it needs an integration-level test rather than just
another helper expectation.

**Test improvement:** Parameterize pure-helper checks for an uncapped mobile value and a fractional
rounding value. In `Canvas.test.tsx`, first observe a valid 512px width, then observe `0`, a
negative width, and `NaN`; after each, change the breakpoint and assert the render size remains the
512 reference fallback. This makes the report's stated edge-case guarantee executable.

### P3 — topbar server-boundary test is brittle and tests an implementation detail

`src/components/site/SiteTopbarVisibility.test.tsx:3` imports Node file I/O inside a jsdom
visibility suite. Lines 105-110 read a path relative to the process working directory, only check
the first bytes for a single-quoted directive, and require a specific `TrackedEditorLink` import.

This can pass when a valid `'use client'` directive is preceded by whitespace or a comment, and it
would fail after a server-safe internal refactor that uses another analytics island. Neither outcome
matches the actual server-boundary contract. The test also makes this visibility suite responsible
for unrelated source-text policy.

**Test improvement:** Move the check to a small Node-environment
`ContentSiteTopbar.server-boundary.test.ts` that resolves the source path from `import.meta.url`.
If a static check is retained, make it directive-aware (leading whitespace and comments) and remove
the child-import assertion. Verify the observable analytics/link behavior through the existing
topbar render tests, and retain `pnpm build` as the integration proof for Next's real server/client
boundary.

### P3 — observer invocation hides the primary diagnostic

`src/components/editor/Canvas.test.tsx:235` and `:268` use
`resizeObserverInstances[0]?.triggerWidth(512)`. The later size expectation will fail if no
observer was created, so this is not a silent pass. It does, however, report the secondary
"received 512" symptom instead of the real "Canvas did not install a ResizeObserver" harness
failure.

**Test improvement:** Capture the first observer, assert it is defined, and invoke it without
optional chaining. This follows fail-fast testing and makes future setup regressions actionable.

## Positive coverage retained

- `DeferredEditorLayout.test.tsx:131-157` covers the server-render to mobile-hydration observer
  boundary.
- `DeferredEditorLayout.test.tsx:168-194` covers disconnect/recreate behavior across the 1280px
  breakpoint, although it should additionally assert the recreated observer can mount the editor.
- `Canvas.test.tsx:243-283` covers both breakpoint directions without a second resize callback.
- `preview-rendering.test.ts:5-10` keeps the core mobile-cap versus desktop-unbounded contract
  compact and readable.

## Verification record

- Focused Vitest command above: exit 0, 4 files, 35 tests.
- `git diff --check`: exit 0.
- No application source, dependency, configuration, or commit was changed by this audit. The only
  created artifact is this report.
