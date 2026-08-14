# Blog Coat Maker CTA Implementation Plan

> **For agentic workers:** Execute with fresh subagents and an independent review after each task. Do not create commits: the project rules prohibit commits without separate authorization.

**Goal:** Add localized Coat of Arms Maker links to both CTA areas of every English and Chinese blog detail page.

**Architecture:** `BlogDetailPageView` remains the single renderer for both localized blog routes. Keep all visible strings in its locale copy object, use `getLocalizedPath` for localized hrefs, and add no component abstraction because this is a two-location, one-page change.

**Tech Stack:** Next.js 16.3, React, TypeScript, Tailwind CSS, Vitest, React Testing Library.

## Global Constraints

- Modify only the shared blog detail CTA component and its focused test; do not modify blog content, metadata, dependencies, configuration, or user-owned dirty files.
- English CTA label and href: `Coat of Arms Maker`, `/coat-of-arms-maker`.
- Chinese CTA label and href: `纹章制作器`, `/zh/coat-of-arms-maker`.
- Top action card remains vertically ordered: editor, dice roller, coat maker.
- Bottom CTA at `md` and wider: coat maker is left of editor; dice roller is below editor. Below `md`: editor, dice roller, coat maker remain vertically ordered.
- Keep existing editor and dice CTA behavior and `prefetch={false}` on standard links.
- Use the existing Lucide icon library only; do not add a dependency or a reusable abstraction.
- Do not commit, push, deploy, or alter unrelated dirty worktree changes.

---

### Task 1: Add a regression test for both localized CTA areas

**Files:**

- Create: `src/components/site/views/BlogDetailPageView.test.tsx`

**Interfaces:**

- Consumes: `BlogDetailPageView({ locale, slug })` with existing bilingual slug `dnd-meaning`.
- Produces: a regression test that fails until both CTA areas render the localized coat-maker route.

- [ ] **Step 1: Write the failing test**

```tsx
const localeCases = [
  {
    locale: 'en' as const,
    actionCardLabel: 'What to do next',
    bottomCtaHeading: 'Start building your adventure',
    coatMakerLabel: 'Coat of Arms Maker',
    diceLabel: 'Dice Roller',
    expectedHref: '/coat-of-arms-maker',
    expectedDiceHref: '/dice-roller-dnd',
  },
  {
    locale: 'zh' as const,
    actionCardLabel: '现在可以做什么',
    bottomCtaHeading: '开启你的下一次冒险',
    coatMakerLabel: '纹章制作器',
    diceLabel: '骰子工具',
    expectedHref: '/zh/coat-of-arms-maker',
    expectedDiceHref: '/zh/dice-roller-dnd',
  },
];

it.each(localeCases)('renders localized coat-maker links in both $locale CTA areas', (testCase) => {
  render(<BlogDetailPageView locale={testCase.locale} slug="dnd-meaning" />);

  const actionCard = screen.getByText(testCase.actionCardLabel).closest('aside');
  const bottomCta = screen.getByRole('heading', { name: testCase.bottomCtaHeading, level: 2 }).closest('section');

  if (!actionCard || !bottomCta) {
    throw new Error(`Expected CTA regions for locale ${testCase.locale}.`);
  }

  expect(within(actionCard).getByRole('link', { name: testCase.coatMakerLabel })).toHaveAttribute('href', testCase.expectedHref);
  expect(within(bottomCta).getByRole('link', { name: testCase.coatMakerLabel })).toHaveAttribute('href', testCase.expectedHref);
  expect(within(actionCard).getByRole('link', { name: testCase.diceLabel })).toHaveAttribute('href', testCase.expectedDiceHref);
  expect(within(bottomCta).getByRole('link', { name: testCase.diceLabel })).toHaveAttribute('href', testCase.expectedDiceHref);
});
```

Mock only `next/navigation` so the real `EditorLaunchButton` can render without a router provider. Add `cleanup()` in `afterEach`.

- [ ] **Step 2: Verify the new test is red**

Run: `pnpm vitest run src/components/site/views/BlogDetailPageView.test.tsx`

Expected: both locale cases fail because the coat-maker CTA link is absent.

### Task 2: Render the localized coat-maker CTA with the confirmed responsive layout

**Files:**

- Modify: `src/components/site/views/BlogDetailPageView.tsx`
- Test: `src/components/site/views/BlogDetailPageView.test.tsx`

**Interfaces:**

- Consumes: `getLocalizedPath(locale, '/coat-of-arms-maker')` and `copy.coatMaker`.
- Produces: two standard `<Link>` elements per blog detail page, one in each CTA area.

- [ ] **Step 1: Add locale copy and icon import**

Add `Shield` to the existing Lucide import. Add `coatMaker` to both locale objects with the exact values in Global Constraints.

- [ ] **Step 2: Add the top action-card link**

After the existing dice link, render a `Link` using `getLocalizedPath(locale, '/coat-of-arms-maker')`, `prefetch={false}`, `site-cta-secondary w-full justify-center`, a `Shield` icon, and `{copy.coatMaker}`.

- [ ] **Step 3: Add the bottom CTA link and responsive grid layout**

Keep the existing JSX order `EditorLaunchButton`, dice `Link`, coat-maker `Link`. Replace the bottom button wrapper with a one-column grid that becomes a two-column `md` grid. Place the editor in desktop column 2 row 1, dice in desktop column 2 row 2, and coat maker in desktop column 1 row 1. Preserve full-width vertical ordering before `md`.

Add `min-w-0` to the adjacent bottom-CTA copy container so it can shrink instead of forcing horizontal overflow when the desktop grid is active.

- [ ] **Step 4: Verify the test is green**

Run: `pnpm vitest run src/components/site/views/BlogDetailPageView.test.tsx`

Expected: both English and Chinese cases pass, with both CTA areas pointing to their localized coat-maker and dice paths.

- [ ] **Step 5: Run focused static checks**

Run:

```bash
pnpm lint src/components/site/views/BlogDetailPageView.tsx src/components/site/views/BlogDetailPageView.test.tsx
pnpm typecheck
```

Expected: zero lint errors and a successful TypeScript check.

- [ ] **Step 6: Verify the visual contract in the local browser**

Start the production-equivalent local site, then use Ego Browser to inspect `/blog/dnd-meaning` and `/zh/blog/dnd-meaning` at 1440px and 390px widths.

Expected at 1440px: the bottom CTA reads as `[coat maker] [editor]` on the first row and `[empty] [dice]` on the second. Expected at 390px: editor, dice, coat maker are vertically ordered. In both locales, top and bottom coat-maker links navigate to localized paths.
