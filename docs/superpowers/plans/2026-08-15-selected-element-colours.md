# Selected Element Colours Implementation Plan

> **For agentic workers:** Execute each implementation task with a fresh subagent and an independent read-only review. Do not create commits: the project rules prohibit commits without separate authorization.

**Goal:** Add a competitor-inspired top colour-chip strip that lets a user recolour every matching occurrence of one rendered colour inside the single selected editable vector layer.

**Architecture:** Keep rendered-colour discovery and replacement in one pure domain module, expose replacement through one new store command, and make the toolbar component consume only the public store interface plus the domain colour-query function. The UI is selection-derived and transient; no persisted project schema changes are needed.

**Tech Stack:** Next.js 16.3, React, TypeScript, Zustand-style external store, CSS, Vitest, React Testing Library, Ego Browser.

## Global Constraints

- Preserve all existing unrelated modified and untracked files. Modify only the files listed in the tasks below.
- Do not stage, commit, push, deploy, install dependencies, create a branch/worktree, or alter project configuration.
- The user explicitly authorized implementation in the current checkout; therefore adapt the subagent workflow to this shared dirty worktree and use path-scoped diffs for review.
- Show the strip only when exactly one unlocked, colour-editable layer is selected.
- Colour-editable layers are vector shields, vector charges, vector ordinaries, vector tops, text, and draw layers. Hide the strip for background, image/upload, static-image shields, active raster assets/variants, no selection, locked selection, and multi-selection.
- For vector shields, expose the effective rendered field colours, region colours, ornament colours, and visible outline colour. The existing default visible outline colour `#1E293B` is editable even when it has not yet been materialized in project data.
- For multipart vector assets, expose the effective rendered part colours after `colorReplacements`, the first-part `layer.color` fallback, and source-colour fallbacks are applied.
- Deduplicate colours case-insensitively while preserving first-rendered order.
- Changing a chip replaces every case-insensitive match of that effective colour inside only the selected layer. It must not recolour other layers or mutate the project palette.
- Clicking a chip uses the existing browser/system picker via `<input type="color">`; do not add a custom popover or dependency.
- Desktop places the strip between the existing history/project group and Export/Multi-select. Mobile gives the strip its own horizontally scrollable toolbar row without changing the editor's other tool behavior.
- One replacement is one `replace-layer-colour` command and one undo/redo history entry. Do not dispatch when the picker returns the same colour case-insensitively.
- Fail fast on invalid colours, missing layers, locked layers, unsupported layers, and source colours that are not currently editable on the target layer. Error messages must include the offending value or layer id.
- Do not add the competitor's floating object toolbar, change Delete/Lock/Hide, change the existing project-wide Colors panel, or change persisted schema/import/export.
- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise naming. Use ordinary functions and explicit branches; do not add speculative abstraction.

---

### Task 1: Add rendered-colour discovery and selected-layer replacement command

**Files:**

- Create: `src/lib/coat-of-arms/layer-colours.ts`
- Create: `src/lib/coat-of-arms/layer-colours.test.ts`
- Modify: `src/lib/coat-of-arms/commands.ts`
- Modify: `src/lib/coat-of-arms/commands.test.ts`

**Interfaces:**

- Export: `getEditableLayerColours(layer: CoatLayer): string[]`.
- Export: `replaceEditableLayerColour(layer: CoatLayer, fromColor: string, toColor: string): CoatLayer`.
- Add command: `{ type: 'replace-layer-colour'; layerId: string; fromColor: string; toColor: string }`.
- The command validates exact keys and both colours, resolves the requested layer, rejects locked/unsupported/source-missing cases, replaces one layer immutably, and returns the updated project through the existing command dispatcher.

- [ ] **Step 1: Write focused failing domain tests**

Cover ordered case-insensitive deduplication and extraction for: vector shield regions/ornaments/default visible outline, multipart vector effective colours, text, and draw. Cover empty extraction for every raster/static/image/background case.

- [ ] **Step 2: Prove the domain tests are red**

Run: `pnpm vitest run src/lib/coat-of-arms/layer-colours.test.ts`

Expected: failure because the domain module does not exist or does not satisfy the new contract.

- [ ] **Step 3: Implement pure rendered-colour discovery and replacement**

Reuse existing asset lookup interfaces. Match the colour precedence already used by `scene-svg.ts`; do not duplicate unrelated scene rendering. When replacing an implicit default shield outline, materialize the current outline defaults with the requested new colour. For multipart vector assets, update every source part whose current effective colour matches the source, including multiple parts sharing that colour.

- [ ] **Step 4: Write focused failing command tests**

Cover selected-layer-only replacement, every matching region/part changing, no palette/other-layer mutation, locked/missing/unsupported/source-missing failures, invalid colour failures, and undo/redo as one history step through the existing store/command test pattern.

- [ ] **Step 5: Prove the command tests are red**

Run: `pnpm vitest run src/lib/coat-of-arms/commands.test.ts`

Expected: the new command cases fail before dispatcher support is added.

- [ ] **Step 6: Add the command and make focused tests green**

Route the command to the pure replacement function. Preserve the existing global `replace-all-colour` behavior unchanged.

Run: `pnpm vitest run src/lib/coat-of-arms/layer-colours.test.ts src/lib/coat-of-arms/commands.test.ts`

Expected: both files pass.

- [ ] **Step 7: Run task-level static checks**

Run: `pnpm exec eslint src/lib/coat-of-arms/layer-colours.ts src/lib/coat-of-arms/layer-colours.test.ts src/lib/coat-of-arms/commands.ts src/lib/coat-of-arms/commands.test.ts`

Expected: zero errors.

---

### Task 2: Add the responsive selected-element colour strip

**Files:**

- Create: `src/components/coat-of-arms/SelectedElementColourStrip.tsx`
- Create: `src/components/coat-of-arms/SelectedElementColourStrip.test.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`
- Modify: `src/components/coat-of-arms/workbench-copy.ts`
- Modify: `src/app/globals.css`

**Interfaces:**

- Component: `SelectedElementColourStrip({ locale }: { locale: CoatLocale })`.
- Copy: add an English and Chinese accessible group label plus `changeElementColour(fromColor: string): string`.
- The component reads `project.layers`, `selectedLayerIds`, and `dispatch` through `useCoatProjectStore`; it queries colours with `getEditableLayerColours` and dispatches exactly one `replace-layer-colour` command per actual change.

- [ ] **Step 1: Write focused failing component tests**

Cover: hidden for zero/multiple/locked/unsupported selections; one input per deduplicated rendered colour for a supported selection; exact current `value`; localized accessible labels; one command with the selected layer id/from/to on change; no command for a case-insensitively identical colour.

- [ ] **Step 2: Prove the component tests are red**

Run: `pnpm vitest run src/components/coat-of-arms/SelectedElementColourStrip.test.tsx`

Expected: failure because the component does not exist or does not satisfy the contract.

- [ ] **Step 3: Implement the focused client component**

Use a labelled container and native colour inputs styled as compact colour chips. Keep selection checks and dispatch orchestration in the component; keep colour semantics in `layer-colours.ts`. Surface dispatch failures through the existing editor error pattern rather than swallowing them.

- [ ] **Step 4: Add maker integration and CSS contract tests**

Verify the strip renders between the two existing toolbar groups. Verify CSS preserves one desktop toolbar row and creates a dedicated horizontally scrollable colour row at `max-width: 639px`, with the scene grid toolbar row changing from a fixed height to content-sized height on mobile.

- [ ] **Step 5: Integrate and make focused tests green**

Insert the component in `CoatOfArmsMaker.tsx`, add bilingual copy, and add only the selectors required for the desktop/mobile placement and native-chip appearance.

Run: `pnpm vitest run src/components/coat-of-arms/SelectedElementColourStrip.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`

Expected: both files pass.

- [ ] **Step 6: Run task-level static checks**

Run: `pnpm exec eslint src/components/coat-of-arms/SelectedElementColourStrip.tsx src/components/coat-of-arms/SelectedElementColourStrip.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/workbench-copy.ts`

Expected: zero errors.

---

### Task 3: Verify the complete scoped feature

**Files:**

- Verify only; no planned source edits.

**Interfaces:**

- The final feature is the composition of Task 1's command/domain interface and Task 2's selection-derived UI.

- [ ] **Step 1: Run the focused regression suite**

Run: `pnpm vitest run src/lib/coat-of-arms/layer-colours.test.ts src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/scene-svg.test.ts src/components/coat-of-arms/SelectedElementColourStrip.test.tsx src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/ArrangePanel.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`

Expected: all tests pass.

- [ ] **Step 2: Run repository quality gates**

Run separately: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

Expected: each command exits successfully. Preserve each result separately; a later pass must not mask an earlier failure.

- [ ] **Step 3: Run desktop Ego Browser acceptance**

Start a fresh local production server and open a new Ego task space. At a 1440px-wide viewport, select a colourable vector object and confirm the strip appears between the existing toolbar groups, all unique effective colours appear, a chip opens the native picker, replacement affects every matching occurrence only inside the selected object, and undo/redo treats it as one step. Confirm no strip for multi-selection, a locked layer, and a raster/image layer.

- [ ] **Step 4: Run mobile Ego Browser acceptance**

At a 390px-wide viewport, confirm the colour strip has its own toolbar row, remains horizontally scrollable without page horizontal overflow, opens the native picker, updates the selected object, and does not break the existing mobile tool drawer or canvas interaction.

- [ ] **Step 5: Run a final independent path-scoped review**

Review only the files listed in Tasks 1 and 2 for spec compliance, correctness, regression risk, accessibility, and adherence to the stated coding constraints. Do not modify unrelated files and do not commit.
