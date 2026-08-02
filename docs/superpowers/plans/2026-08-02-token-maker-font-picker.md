# Token Maker Font Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one existing default font plus ten locally hosted, commercially usable open-source Chinese font choices to the homepage Token Maker, with matching DOM preview, PNG/share/batch rendering, persistence, and bilingual controls.

**Architecture:** Keep font IDs and rendering metadata in one pure catalog. `TextBox` stores only a stable optional font ID; UI, DOM preview, Canvas rendering, and export preloading consume catalog interfaces instead of duplicating CSS family strings. Font files and licenses live under `public/fonts/editor`, and the browser loads only fonts actually selected by a text layer.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand, Canvas 2D, CSS `@font-face`, Font Loading API, Vitest, Testing Library.

## Global Constraints

- Preserve and remain compatible with the existing uncommitted text-overlay pointer-event changes in `src/components/editor/TextCanvasOverlay.tsx` and `src/components/editor/TextCanvasOverlay.test.tsx`.
- Do not modify the Coat of Arms font system, image/border/mask behavior, navigation, SEO content, CSP, deployment configuration, or unrelated UI.
- Do not add runtime or development dependencies.
- Do not commit or push; the user has not authorized either action.
- Follow high cohesion and low coupling. Each function and module has one responsibility and communicates through exported interfaces.
- Follow KISS and YAGNI. Use plain functions and direct conditionals; do not introduce classes, strategy objects, or future-facing abstractions.
- Follow Fail Fast. Font-loading errors must name the failing font ID and must not silently export with a fallback font.
- Use precise names. Do not introduce names such as `data`, `temp`, `helper`, `util`, or `manager`.
- Use test-driven development: failing focused test, observed failure, minimal implementation, observed pass.

## File Structure

- Create `src/types/editor-font.ts`: owns the closed `EditorFontId` runtime list and union type.
- Create `src/lib/editor-fonts/catalog.ts`: owns labels, CSS families, local file paths, supported weights, and resolution functions.
- Create `src/lib/editor-fonts/catalog.test.ts`: validates the closed catalog, local asset files, and license files.
- Create `src/lib/editor-fonts/load.ts`: derives unique required fonts from text boxes and waits for browser font loading.
- Create `src/lib/editor-fonts/load.test.ts`: validates default-font bypass, unique loading, and fail-fast errors.
- Create `src/app/editor-fonts.css`: owns local `@font-face` declarations only.
- Modify `src/app/globals.css`: imports `editor-fonts.css` before non-import rules.
- Add `public/fonts/editor/**`: ten upstream font binaries, per-family license files, and a provenance README.
- Modify `src/types/editor.ts`: adds optional `fontId` to `TextBox` for old-storage compatibility.
- Modify `src/lib/store/editor-store.ts` and tests: gives new text an explicit default font and preserves old text records.
- Modify `src/lib/batch/editor-draft.ts` and tests: includes resolved font identity in visual equality.
- Modify `src/lib/renderer/text.ts` and add `src/lib/renderer/text.test.ts`: uses catalog-generated Canvas font shorthand.
- Modify `src/lib/renderer/pipeline.ts` and tests: preloads fonts together with image assets before export.
- Modify `src/components/editor/editor-store-hooks.ts`: exposes the selected text font ID.
- Modify `src/components/editor/ControlPanel.tsx` and tests: renders and updates the bilingual font selector.
- Modify `src/components/editor/TextCanvasOverlay.tsx` and its existing untracked test: applies the catalog font stack without altering the approved pointer-event fix.
- Modify `src/lib/i18n/en.ts` and `src/lib/i18n/zh.ts`: adds the field label only.

---

### Task 1: Local Font Assets and Closed Catalog

**Files:**
- Create: `src/types/editor-font.ts`
- Create: `src/lib/editor-fonts/catalog.ts`
- Create: `src/lib/editor-fonts/catalog.test.ts`
- Create: `src/app/editor-fonts.css`
- Modify: `src/app/globals.css`
- Create: `public/fonts/editor/README.md`
- Create: `public/fonts/editor/<font-id>/<upstream-font-file>.ttf`
- Create: `public/fonts/editor/<font-id>/OFL.txt`

**Interfaces:**
- Produces: `EDITOR_FONT_IDS`, `EditorFontId`, `DEFAULT_EDITOR_FONT_ID`, `EDITOR_FONT_DEFINITIONS`, `resolveEditorFontId`, `getEditorFontDefinition`, `getEditorFontLabel`, `getEditorFontCssStack`, `resolveEditorFontWeight`, and `getEditorFontCanvasShorthand`.
- Consumes: no application modules; the catalog remains pure and dependency-free.

- [ ] **Step 1: Write the closed-ID and catalog tests**

Create tests that require exactly these IDs and one default plus ten local definitions:

```ts
expect(EDITOR_FONT_IDS).toEqual([
  'system-sans',
  'noto-sans-sc',
  'noto-serif-sc',
  'lxgw-wenkai',
  'ma-shan-zheng',
  'zcool-xiaowei',
  'zcool-kuaile',
  'zcool-qingke-huangyou',
  'zhi-mang-xing',
  'long-cang',
  'liu-jian-mao-cao',
]);
expect(new Set(EDITOR_FONT_DEFINITIONS.map(({ id }) => id)).size).toBe(11);
expect(resolveEditorFontId(undefined)).toBe('system-sans');
expect(resolveEditorFontId('unknown-font')).toBe('system-sans');
expect(getEditorFontCanvasShorthand('noto-serif-sc', 700, 48))
  .toContain('700 48px "Noto Serif SC"');
expect(resolveEditorFontWeight('ma-shan-zheng', 700)).toBe(400);
```

Use Node `fs.statSync` in the same test to require every non-default `filePath` and `licensePath` to exist and have a positive byte size.

- [ ] **Step 2: Run the catalog test and observe the expected failure**

Run: `pnpm test -- src/lib/editor-fonts/catalog.test.ts`

Expected: FAIL because the ID type, catalog, and assets do not exist.

- [ ] **Step 3: Add the exact font ID type and catalog interfaces**

Implement the closed list in `src/types/editor-font.ts`:

```ts
export const EDITOR_FONT_IDS = [
  'system-sans', 'noto-sans-sc', 'noto-serif-sc', 'lxgw-wenkai',
  'ma-shan-zheng', 'zcool-xiaowei', 'zcool-kuaile',
  'zcool-qingke-huangyou', 'zhi-mang-xing', 'long-cang',
  'liu-jian-mao-cao',
] as const;

export type EditorFontId = typeof EDITOR_FONT_IDS[number];
```

Define `EditorFontDefinition` with `id`, `family`, `cssStack`, `labels`, `filePath`, `licensePath`, and `supportedWeights`. Keep the default definition asset-free. Use `system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif` as its exact stack. Use `"Noto Sans SC", sans-serif` and `"Noto Serif SC", serif` for the two Noto definitions. Each remaining local stack starts with its quoted family name, then uses `"Noto Sans SC", sans-serif` for sans/display families or `"Noto Serif SC", serif` for serif/handwriting families. Implement lookup functions with one module-local `Map`; `resolveEditorFontId` accepts `unknown` and returns the default for old or corrupted persisted values. `getEditorFontLabel(fontId, locale)` returns the approved Chinese label plus the family in parentheses for `zh`, and the family name for `en`.

- [ ] **Step 4: Download the ten upstream binaries and licenses without adding dependencies**

Use the exact upstream sources below and place each file in its catalog directory:

```text
https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf
https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/mashanzheng/MaShanZheng-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolqingkehuangyou/ZCOOLQingKeHuangYou-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/zhimangxing/ZhiMangXing-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/longcang/LongCang-Regular.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/liujianmaocao/LiuJianMaoCao-Regular.ttf
```

For nine Google families, use the matching `https://raw.githubusercontent.com/google/fonts/main/ofl/<family>/OFL.txt`. For LXGW WenKai, use `https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/OFL.txt`. Record family, version/date, source URL, file name, and license URL in `public/fonts/editor/README.md`. Fail immediately on any non-2xx response.

- [ ] **Step 5: Declare local fonts and import the declarations**

Add one `@font-face` for each family in `src/app/editor-fonts.css`. Use `font-display: swap`; use `font-weight: 100 900` for the two Noto variable fonts and `font-weight: 400` for the other eight. Point `src` only at local `/fonts/editor/...` paths. Add `@import "./editor-fonts.css";` with the existing import block at the top of `globals.css`.

- [ ] **Step 6: Run the catalog test and verify it passes**

Run: `pnpm test -- src/lib/editor-fonts/catalog.test.ts`

Expected: PASS with 11 unique catalog entries and all ten font/license pairs present.

- [ ] **Step 7: Review checkpoint without committing**

Run: `git diff --check` and `git status --short`. Confirm no dependency files, CSP files, Coat of Arms files, or existing text-overlay changes were altered by this task.

---

### Task 2: Text State, Persistence, and Batch Draft Compatibility

**Files:**
- Modify: `src/types/editor.ts`
- Modify: `src/lib/store/editor-store.ts`
- Modify: `src/lib/store/editor-store.test.ts`
- Modify: `src/lib/batch/editor-draft.ts`
- Modify: `src/lib/batch/editor-draft.test.ts`

**Interfaces:**
- Consumes: `EditorFontId`, `DEFAULT_EDITOR_FONT_ID`, and `resolveEditorFontId` from Task 1.
- Produces: `TextBox.fontId?: EditorFontId`; all existing `TextBox` consumers remain source-compatible.

- [ ] **Step 1: Write failing tests for new and old text records**

Add assertions that a new text box has `fontId: 'system-sans'`, and an old persisted text box without `fontId` still hydrates and resolves to `system-sans` without losing its content, position, size, color, weight, or alignment.

Add batch equality tests:

```ts
expect(areBatchVisualDraftsEqual(
  draftWithFont(undefined),
  draftWithFont('system-sans')
)).toBe(true);
expect(areBatchVisualDraftsEqual(
  draftWithFont('noto-serif-sc'),
  draftWithFont('lxgw-wenkai')
)).toBe(false);
```

- [ ] **Step 2: Run focused state tests and observe failure**

Run: `pnpm test -- src/lib/store/editor-store.test.ts src/lib/batch/editor-draft.test.ts`

Expected: FAIL because `TextBox.fontId` and font-aware equality do not exist.

- [ ] **Step 3: Add the optional font ID and explicit new-text default**

Add `fontId?: EditorFontId` to `TextBox`. Import the type with `import type`. In `addTextBox`, set `fontId: DEFAULT_EDITOR_FONT_ID`. Do not add a Zustand store version or rewrite old localStorage records; optional-field resolution is the compatibility mechanism.

- [ ] **Step 4: Make batch visual equality compare resolved font IDs**

In `areBatchVisualDraftsEqual`, add exactly one comparison:

```ts
resolveEditorFontId(leftTextBox.fontId) === resolveEditorFontId(rightTextBox.fontId)
```

Keep cloning unchanged because the font ID is a primitive string.

- [ ] **Step 5: Run focused state tests and verify pass**

Run: `pnpm test -- src/lib/store/editor-store.test.ts src/lib/batch/editor-draft.test.ts src/lib/batch/editor-session.test.ts src/lib/batch/rendering.test.ts`

Expected: PASS, including old records without `fontId`.

- [ ] **Step 6: Review checkpoint without committing**

Run: `git diff --check`. Confirm the only production changes in this task are the type, new-text default, and font-aware equality.

---

### Task 3: Shared Font Loading and Canvas Rendering

**Files:**
- Create: `src/lib/editor-fonts/load.ts`
- Create: `src/lib/editor-fonts/load.test.ts`
- Modify: `src/lib/renderer/text.ts`
- Create: `src/lib/renderer/text.test.ts`
- Modify: `src/lib/renderer/pipeline.ts`
- Modify: `src/lib/renderer/pipeline.test.ts`

**Interfaces:**
- Consumes: `TextBox`, `getEditorFontDefinition`, `getEditorFontCanvasShorthand`, and `resolveEditorFontId`.
- Produces: `preloadEditorFonts(textBoxes, fontFaceSet?) => Promise<void>`; `drawTextBoxes` keeps its existing signature.

- [ ] **Step 1: Write failing loader and renderer tests**

Test these behaviors independently:

```ts
await preloadEditorFonts([textBox({ fontId: 'system-sans' })], fontFaceSet);
expect(fontFaceSet.load).not.toHaveBeenCalled();

await preloadEditorFonts([
  textBox({ fontId: 'noto-serif-sc', content: '龙 Dragon' }),
  textBox({ fontId: 'noto-serif-sc', content: '盾 Shield' }),
], fontFaceSet);
expect(fontFaceSet.load).toHaveBeenCalledTimes(1);

fontFaceSet.load.mockResolvedValue([]);
await expect(preloadEditorFonts([
  textBox({ fontId: 'zhi-mang-xing', content: '荣耀' }),
], fontFaceSet)).rejects.toThrow('zhi-mang-xing');
```

Mock a Canvas context and assert `drawTextBoxes` assigns a Noto Serif family for `noto-serif-sc`, resolves a 400-only art font to weight 400, and keeps `sans-serif` for an old text box without `fontId`.

- [ ] **Step 2: Run loader and renderer tests and observe failure**

Run: `pnpm test -- src/lib/editor-fonts/load.test.ts src/lib/renderer/text.test.ts src/lib/renderer/pipeline.test.ts`

Expected: FAIL because font preloading and catalog-driven `ctx.font` do not exist.

- [ ] **Step 3: Implement the minimal font preloader**

Define a narrow testable interface:

```ts
export interface EditorFontFaceSet {
  load(font: string, text?: string): Promise<readonly unknown[]>;
}
```

`preloadEditorFonts` must:

1. Resolve every `TextBox.fontId`.
2. Skip `system-sans`.
3. Deduplicate by resolved font ID.
4. Use the first non-empty text content for each font as its load probe.
5. Obtain `document.fonts` only when a local font is required.
6. Throw `Editor font loading is unavailable for font "<font-id>"` if the API is absent.
7. Await `fontFaceSet.load(getEditorFontCanvasShorthand(fontId, fontWeight, 48), probeText)`.
8. Throw `Editor font failed to load: "<font-id>"` if the returned face list is empty.

Do not catch these errors inside `load.ts`.

- [ ] **Step 4: Route Canvas text rendering through the catalog**

Replace the hard-coded `sans-serif` assignment with:

```ts
ctx.font = getEditorFontCanvasShorthand(text.fontId, text.fontWeight, fontSize);
```

Do not change stroke, fill, alignment, or coordinate behavior.

- [ ] **Step 5: Preload image and font assets together before export**

In `preloadTokenRenderAssets`, await both responsibilities:

```ts
await Promise.all([
  Promise.all(getTokenRenderAssetUrls(state).map((url) => preloadImageToCache(url))),
  preloadEditorFonts(state.textBoxes),
]);
```

Keep the public function signature unchanged so single export, share preview, and batch export all receive the fix through their existing interface. Ensure the existing export warning includes the thrown message containing the font ID; do not add a fallback export.

- [ ] **Step 6: Run focused loading and rendering tests and verify pass**

Run: `pnpm test -- src/lib/editor-fonts/load.test.ts src/lib/renderer/text.test.ts src/lib/renderer/pipeline.test.ts src/lib/batch/rendering.test.ts`

Expected: PASS; a missing font rejects before Canvas rendering.

- [ ] **Step 7: Review checkpoint without committing**

Run: `git diff --check`. Confirm no renderer behavior beyond `ctx.font` and asset preloading changed.

---

### Task 4: Bilingual Font Selector and DOM Preview

**Files:**
- Modify: `src/lib/i18n/en.ts`
- Modify: `src/lib/i18n/zh.ts`
- Modify: `src/components/editor/editor-store-hooks.ts`
- Modify: `src/components/editor/ControlPanel.tsx`
- Modify: `src/components/editor/ControlPanel.test.tsx`
- Modify: `src/components/editor/TextCanvasOverlay.tsx`
- Modify: `src/components/editor/TextCanvasOverlay.test.tsx`

**Interfaces:**
- Consumes: `EDITOR_FONT_DEFINITIONS`, `getEditorFontLabel`, `resolveEditorFontId`, `getEditorFontCssStack`, and `resolveEditorFontWeight`.
- Produces: selected-text font control through the existing `updateTextBox` interface; no new store action.

- [ ] **Step 1: Write failing control-panel and overlay tests**

Extend the control-panel i18n mock with `fontFamily`. Select a text box, assert a combobox named `字体`/`Font Family` has 11 options, change it to `noto-serif-sc`, and assert the selected store text box now has `fontId: 'noto-serif-sc'`.

Extend the existing untracked overlay test without removing its pointer-event tests:

```ts
expect(screen.getByText('荣耀 Dragon')).toHaveStyle({
  fontFamily: '"Noto Serif SC", serif',
});
```

Also assert an old text record without `fontId` resolves to the system sans stack.

- [ ] **Step 2: Run focused component tests and observe failure**

Run: `pnpm test -- src/components/editor/ControlPanel.test.tsx src/components/editor/TextCanvasOverlay.test.tsx`

Expected: FAIL because the selector, hook field, and preview font style do not exist.

- [ ] **Step 3: Add the bilingual field label and selected-font hook**

Add `fontFamily: 'Font Family'` in English and `fontFamily: '字体'` in Chinese. In `useControlPanelState`, expose:

```ts
selectedTextFontId: resolveEditorFontId(selectedText?.fontId)
```

Keep the selector derivation focused; do not add a new Zustand action.

- [ ] **Step 4: Add the native font selector in the approved position**

Place a labeled native `<select>` after the font-size control and before text color. Use `locale` to obtain each catalog label. On change, cast only after confirming the value is in the closed catalog via `resolveEditorFontId`, then call:

```ts
updateTextBox(selectedTextId, { fontId: resolveEditorFontId(event.target.value) });
```

Use the existing input visual language and a full-width control that cannot overflow the 390px panel.

- [ ] **Step 5: Apply the same catalog values to the DOM overlay**

Add only these style responsibilities to the existing `DraggableText` style object:

```ts
fontFamily: getEditorFontCssStack(text.fontId),
fontWeight: resolveEditorFontWeight(text.fontId, text.fontWeight),
```

Preserve `pointer-events-none` on the overlay root, `pointer-events-auto` on text elements, and every existing drag/edit handler.

- [ ] **Step 6: Run focused component tests and verify pass**

Run: `pnpm test -- src/components/editor/ControlPanel.test.tsx src/components/editor/TextCanvasOverlay.test.tsx src/components/editor/Canvas.test.tsx`

Expected: PASS, including the pre-existing blank-area image-drag contract.

- [ ] **Step 7: Review checkpoint without committing**

Run: `git diff --check` and inspect `git diff -- src/components/editor/TextCanvasOverlay.tsx`. Confirm the earlier pointer-event changes remain present and the font work only adds catalog-derived font styles.

---

### Task 5: Full Regression and Browser Acceptance

**Files:**
- Verify all files from Tasks 1–4.
- Do not create product files unless a verified failure directly requires a scoped fix.

**Interfaces:**
- Consumes: the completed font catalog, state, loader, renderer, and UI interfaces.
- Produces: verification evidence only.

- [ ] **Step 1: Run all automated quality gates**

Run in this order:

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
```

Expected: every command exits 0. Record exact test-file/test counts and the generated route count from the build.

- [ ] **Step 2: Audit scope and asset provenance**

Run `git status --short` and inspect the complete diff. Confirm:

- exactly ten font binaries and ten license files exist;
- no package manifest or lockfile changed;
- no CSP, Coat of Arms, navigation, SEO, border, mask, or deployment file changed;
- the pre-existing text-overlay pointer-event work remains intact;
- the two documentation files created for this feature are present.

- [ ] **Step 3: Start the correct local production server and identify its port**

Inspect listeners before starting. Run the built app on an unused loopback port and verify the process belongs to this repository. Do not reuse a port owned by another project.

- [ ] **Step 4: Browser-check English and Chinese desktop flows**

Using the local Hermes CDP browser, verify `/` and `/zh`:

1. Upload a local test image.
2. Add text containing `荣耀 Dragon`.
3. Confirm the selector contains the default plus ten fonts.
4. Switch between Noto Serif SC, LXGW WenKai, and Zhi Mang Xing.
5. Verify the computed `font-family` changes and the text remains draggable/editable.
6. Refresh and verify the selected font restores from localStorage.
7. Download PNG and visually compare its glyph style with the canvas.

- [ ] **Step 5: Browser-check 390px and batch rendering**

At 390px width, confirm the font selector stays inside the card with no horizontal overflow. In batch mode, render one item using a different font from the first text layer and verify the output uses that font while blank-area image dragging and text dragging remain independent.

- [ ] **Step 6: Run delegated review gates**

Dispatch separate read-only subagents for:

- spec compliance and scope drift;
- correctness, edge cases, and fail-fast behavior;
- regression and test coverage;
- license/security/CSP boundaries;
- code quality against high cohesion, low coupling, SRP, KISS, YAGNI, and precise naming.

Resolve only verified in-scope findings. If a reviewer finds an unrelated issue, report it and ask before expanding scope.

- [ ] **Step 7: Final verification after any review fixes**

Re-run every command from Step 1 and repeat the browser path affected by any fix. Do not claim completion without fresh passing evidence.
