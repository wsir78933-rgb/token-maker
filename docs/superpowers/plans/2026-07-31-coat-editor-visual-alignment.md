# Coat Editor Visual Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for this approved inline implementation. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the homepage Token Maker editor's dark visual system to the Coat Maker workbench without changing Coat Maker behavior or exported artwork.

**Architecture:** Keep `CoatOfArmsMaker`'s existing semantic class structure and scope all presentation changes below `.coat-target-workbench` in the global stylesheet. Replace the isolated grey/Arial skin with aliases to the application semantic tokens, then style existing action, panel, canvas-stage, asset, input, and zoom selectors using those aliases. The inner artboard remains an explicit white output surface.

**Tech Stack:** Next.js, React, TypeScript, global CSS, Vitest, ESLint.

## Global Constraints

- Preserve the public `ContentSiteTopbar` and its route/i18n contract.
- Preserve all Coat Maker domain commands, data, export rendering, and responsive layout rules.
- Do not add dependencies, stage, commit, push, or touch unrelated dirty changes.
- Change only Coat Maker scoped CSS and its direct visual-contract test.

---

### Task 1: Lock the visual boundary with a failing contract test

**Files:**
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx:213-217`

**Interfaces:**
- Consumes: the stylesheet at `src/app/globals.css`.
- Produces: a regression contract for the CSS variables that distinguish editor chrome from the output artboard.

- [x] **Step 1: Write the failing test**

Replace the old Arial-specific stylesheet assertion with a test named `uses the homepage editor visual tokens without recolouring the output artboard`. It must assert that the Coat workbench declares `font-family: var(--font-sans)`, that the workbench canvas surround uses `--coat-stage`, and that the artboard/inner application retains `background: #fff`.

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --no-file-parallelism --maxWorkers=1`

Expected: one failure because the current workbench still declares `Arial, Helvetica, sans-serif` and has no `--coat-stage` contract.

### Task 2: Apply the minimum scoped visual-system change

**Files:**
- Modify: `src/app/globals.css:1337-1534`

**Interfaces:**
- Consumes: existing `.coat-target-*` selectors rendered by `CoatOfArmsMaker`.
- Produces: a dark-and-gold visual skin that leaves `.coat-target-artboard` and its inner canvas output surface white.

- [x] **Step 1: Introduce scoped semantic aliases**

Replace the separate greys and Arial stack in `.coat-target-workbench` with `--coat-stage`, panel, raised-panel, line, text, muted, accent, and danger aliases derived from the app's existing semantic variables. Set `font-family: var(--font-sans)`.

- [x] **Step 2: Style existing chrome selectors**

Update only existing scoped selectors for the action bar, tool tree, library panels, inputs, buttons, asset cards, canvas toolbar, zoom controller, and mobile drawer. Use the aliases, rounded corners, gold selected/focus states, and the homepage editor's restrained shadow depth.

- [x] **Step 3: Preserve output rendering**

Keep the artboard and nested `.coat-canvas` / `[role='application']` backgrounds explicitly `#fff`; only change its surround and border treatment.

- [x] **Step 4: Run the focused test to verify it passes**

Run: `pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --no-file-parallelism --maxWorkers=1`

Expected: all tests pass, including the new visual-boundary contract.

### Task 3: Verify the unchanged behavior and responsive presentation

**Files:**
- No production files beyond Task 2.

**Interfaces:**
- Consumes: the completed workbench CSS and route.
- Produces: fresh automated and browser evidence.

- [x] **Step 1: Run static verification**

Run: `pnpm lint`, `pnpm build`, and `git diff --check`.

- [x] **Step 2: Inspect the actual route in a browser**

Check `/coat-of-arms-maker` and `/zh/coat-of-arms-maker` at desktop width and 390px. Confirm the public navigation remains unchanged; the workbench below it is dark/gold; panels scroll; selected/focused controls are legible; zoom, export, and project dialog are reachable; and the artboard stays white.

- [x] **Step 3: Independent code review**

Have a reviewer inspect only the final changed files for scope drift, visual-boundary violations, and regression risks. Do not make follow-up edits without reporting any new defect first.
