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

