# CoaMaker Free Local-Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Coat Maker route match the publicly observable free CoaMaker editor’s layout, core editing workflow, local lifecycle, desktop/mobile behavior, and library navigation without copying its code, branding, paid features, or assets.

**Architecture:** Keep the existing `src/lib/coat-of-arms` command/store/renderer boundary. Add only focused catalog, preference, and browser-verification modules. React panels consume typed state and issue commands; they never mutate layers or browser storage directly. The workbench owns layout and transient UI state only.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand, Vitest, jsdom, JSZip, jsPDF, browser SVG/canvas APIs, CDP Browser verification.

## Global Constraints

- Work only in `/Users/wusir/Desktop/开发项目集合/token-maker-app-复刻` on branch `复刻`.
- Existing unrelated dirty changes belong to the user; do not reset, overwrite, or stage them.
- Reproduce the reference’s free editor behavior and structural layout; do not copy CoaMaker source, logo, SVG paths, asset files, account data, or remote APIs.
- Replace login, Pro, payment, server saves, cloud sharing, and remote uploads with no UI entry point. Persist projects, uploads, and preferences in the browser only.
- Local catalog cards are original or commercially permitted. Every catalog entry declares a non-empty local `licenseId`; no entry may have `sourceUrl` or a CoaMaker domain string.
- Desktop layout is a dark app/action bar, collapsible left library, central canvas, and canvas zoom control. Mobile uses a horizontal bottom tool rail and expandable drawer. Do not add an unobserved right inspector dock.
- Visible and accessible text always comes from `getCoatWorkbenchCopy(locale)`. Chinese routes expose no English editor labels except user-created text or asset proper names accompanied by Chinese labels.
- Public functions validate untrusted values at their boundary and throw an error that includes the invalid value or identifier. Never silently skip invalid commands, imports, uploads, or export failures.
- Follow RED → GREEN → REFACTOR for every new behavior. Do not create a Git commit unless the user separately authorizes it.
- Completion requires CDP checks at 1440px and 375px, no CoaMaker network requests, `pnpm lint`, `pnpm test`, and `pnpm build`.

## Current Delta

The existing route already has local projects, SVG canvas manipulation, basic panels, export, and a 50-item charge catalog. It does not yet prove parity with the reference library scale, reference tool order, full locale ownership, desktop ARIA behavior, local file lifecycle, or browser-level reference checks. Each task below changes only that delta.

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/lib/coat-of-arms/reference-catalog.ts` | Local-only catalog taxonomy, declared asset provenance, and deterministic original variants. |
| `src/lib/coat-of-arms/assets.ts` | Existing typed asset lookup and default-project creation; consumes catalog entries. |
| `src/lib/coat-of-arms/editor-preferences.ts` | Versioned browser-local export/canvas preferences with strict parsing. |
| `src/components/coat-of-arms/workbench-copy.ts` | Sole bilingual UI/aria copy source. |
| `src/components/coat-of-arms/CoatOfArmsMaker.tsx` | Reference-shaped workbench shell, tool rail, mobile orchestration, and no domain mutation. |
| `src/components/coat-of-arms/ReferenceToolRail.tsx` | Accessible desktop tool rail with roving focus and reference tool order. |
| `src/components/coat-of-arms/ReferenceAssetGallery.tsx` | Search/filter/grid behavior shared by shield, charge, top, flag, and token panels. |
| `src/components/coat-of-arms/ArrangePanel.tsx` | Alignment, distribution, ordering, grouping, visibility, and lock controls. |
| `src/components/coat-of-arms/ProjectLibraryDialog.tsx` | Local project lifecycle only. |
| `src/components/coat-of-arms/ExportMenu.tsx` | Output formats and local preference-bound UI. |
| `src/app/globals.css` | Scoped reference workbench desktop/mobile styles only. |
| `src/components/coat-of-arms/*.test.tsx` and `src/lib/coat-of-arms/*.test.ts` | Unit/component contracts for each changed behavior. |

---

### Task 1: Lock the reference contract and testable catalog taxonomy

**Files:**
- Create: `src/lib/coat-of-arms/reference-catalog.ts`
- Create: `src/lib/coat-of-arms/reference-catalog.test.ts`
- Modify: `src/lib/coat-of-arms/assets.ts`
- Modify: `src/lib/coat-of-arms/assets.test.ts`

**Interfaces:**
- Produces `ReferenceCatalogSection`, `ReferenceCatalogEntry`, `listReferenceCatalogEntries(section, category)`, and `assertReferenceCatalogEntry(entry)`.
- `ReferenceCatalogEntry` has `id`, `section`, `category`, `name`, `nameZh`, `licenseId`, and local `svgParts` only.
- `assets.ts` consumes `listReferenceCatalogEntries`; panels never access raw catalog arrays.

- [ ] **Step 1: Write the failing taxonomy test.**

```ts
import { describe, expect, it } from 'vitest';
import { listReferenceCatalogEntries } from './reference-catalog';

describe('reference catalog', () => {
  it('matches the reference navigation taxonomy with local licensed entries', () => {
    expect(listReferenceCatalogEntries('shield', 'shield')).toHaveLength(111);
    expect(listReferenceCatalogEntries('charge', 'animal')).toHaveLength(369);
    expect(listReferenceCatalogEntries('top', 'crown')).toHaveLength(73);

    for (const entry of listReferenceCatalogEntries('charge', 'symbol')) {
      expect(entry.licenseId).not.toBe('');
      expect(JSON.stringify(entry)).not.toContain('coamaker.com');
      expect('sourceUrl' in entry).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run the focused test and confirm RED.**

Run: `pnpm test src/lib/coat-of-arms/reference-catalog.test.ts`  
Expected: FAIL because `reference-catalog.ts` does not exist.

- [ ] **Step 3: Implement the local catalog generator and validation.**

```ts
export function listReferenceCatalogEntries(
  section: ReferenceCatalogSection,
  category: string,
): readonly ReferenceCatalogEntry[] {
  return referenceCatalogEntries.filter(
    (entry) => entry.section === section && entry.category === category,
  );
}

export function assertReferenceCatalogEntry(entry: unknown): asserts entry is ReferenceCatalogEntry {
  if (!entry || typeof entry !== 'object') throw new Error(`Invalid local catalog entry: ${String(entry)}`);
  if (!('licenseId' in entry) || typeof entry.licenseId !== 'string' || entry.licenseId.length === 0) {
    throw new Error(`Invalid local catalog license: ${JSON.stringify(entry)}`);
  }
}
```

Use original parametric SVG geometry and documented `CC0-1.0` or `MIT` source records. Generate variants from explicit category seeds; never fetch or transform a source-site asset.

- [ ] **Step 4: Wire the catalog into typed asset lookup and add a failing integration assertion.**

```ts
it('makes reference shield and exterior categories available through the public asset lookup', () => {
  expect(listAssetsByKind('shield')).toHaveLength(234);
  expect(listAssetsByKind('top')).toHaveLength(245);
});
```

- [ ] **Step 5: Implement the smallest `assets.ts` adapter and run GREEN.**

Run: `pnpm test src/lib/coat-of-arms/reference-catalog.test.ts src/lib/coat-of-arms/assets.test.ts`  
Expected: PASS; catalog returns 234 shields, 813 charges, and 245 top/exterior entries with only local geometry.

---

### Task 2: Make all editor copy and tool identity locale-owned

**Files:**
- Modify: `src/components/coat-of-arms/workbench-copy.ts`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.tsx`
- Modify: `src/components/coat-of-arms/TargetShieldPalette.tsx`
- Modify: `src/components/coat-of-arms/TargetTokenPalette.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`
- Create: `src/components/coat-of-arms/TargetTokenPalette.test.tsx`

**Interfaces:**
- `CoatWorkbenchCopy.toolTabs` produces reference IDs: `shields`, `charges`, `top`, `colours`, `tools`, `arrange`, `settings`, `howTo`, `flags`, `tokens`.
- Panels receive `locale` and use only `getCoatWorkbenchCopy(locale)` for visible and aria text.

- [ ] **Step 1: Write the failing Chinese shell test.**

```tsx
it('renders every reference tool label from Chinese workbench copy', () => {
  render(<CoatOfArmsMaker locale="zh" />);

  expect(screen.getByRole('tab', { name: '盾牌' })).toBeTruthy();
  expect(screen.getByRole('tab', { name: '排列' })).toBeTruthy();
  expect(screen.getByRole('tab', { name: '旗帜' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Collapse tools' })).toBeNull();
});
```

- [ ] **Step 2: Run RED.**

Run: `pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`  
Expected: FAIL because the workbench exposes hard-coded English labels and `position` instead of `arrange`.

- [ ] **Step 3: Centralize missing copy and replace hard-coded strings.**

```ts
const toolOrder = ['shields', 'charges', 'top', 'colours', 'tools', 'arrange', 'settings', 'howTo', 'flags', 'tokens'] as const;
type ReferenceToolId = (typeof toolOrder)[number];
```

Create a localized label and aria label for every shell/palette action. Keep user-entered project names and names of original assets separate from UI chrome.

- [ ] **Step 4: Add token and shield localized aria regression tests.**

```tsx
it('uses localized asset action labels for the token gallery', () => {
  render(<TargetTokenPalette locale="zh" />);
  expect(screen.getByLabelText('添加纹章令牌：展翅鹰')).toBeTruthy();
});
```

- [ ] **Step 5: Run GREEN.**

Run: `pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/TargetShieldPalette.test.tsx src/components/coat-of-arms/TargetTokenPalette.test.tsx`  
Expected: PASS with no hard-coded English control name in the Chinese cases.

---

### Task 3: Replace the shell with the reference desktop and mobile workbench contract

**Files:**
- Create: `src/components/coat-of-arms/ReferenceToolRail.tsx`
- Create: `src/components/coat-of-arms/ReferenceToolRail.test.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMobileDrawer.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`

**Interfaces:**
- `ReferenceToolRail({ activeToolId, locale, onToolChange, onCollapseChange })` owns focus movement only.
- Parent `CoatOfArmsMaker` maps a `ReferenceToolId` to an already focused panel and owns selected tool state.

- [ ] **Step 1: Write the failing rail keyboard test.**

```tsx
it('uses a tablist and moves focus from Shields to Charges with ArrowDown', async () => {
  const user = userEvent.setup();
  render(<ReferenceToolRail activeToolId="shields" locale="en" onCollapseChange={vi.fn()} onToolChange={vi.fn()} />);

  const shields = screen.getByRole('tab', { name: 'Shields' });
  shields.focus();
  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('tab', { name: 'Charges' })).toHaveFocus();
});
```

- [ ] **Step 2: Run RED.**

Run: `pnpm test src/components/coat-of-arms/ReferenceToolRail.test.tsx`  
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the rail and scoped CSS geometry.**

```tsx
<nav aria-label={copy.toolRailLabel} role="tablist" aria-orientation="vertical">
  {toolOrder.map((toolId) => (
    <button
      aria-controls={`coat-panel-${toolId}`}
      aria-selected={toolId === activeToolId}
      id={`coat-tab-${toolId}`}
      key={toolId}
      role="tab"
      type="button"
      onClick={() => onToolChange(toolId)}
    >
      {copy.toolTabs[toolId]}
    </button>
  ))}
</nav>
```

Use 50px header, collapsible 170px desktop rail, central canvas, and mobile 58px horizontally scrollable tool rail. Scope every selector under `.coat-target-workbench`.

- [ ] **Step 4: Add mobile drawer panel and no-right-dock assertions.**

```tsx
expect(screen.getByRole('tablist', { name: 'Coat maker tools' })).toBeTruthy();
expect(screen.queryByLabelText('Project and layers inspector')).toBeNull();
```

- [ ] **Step 5: Run GREEN.**

Run: `pnpm test src/components/coat-of-arms/ReferenceToolRail.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`  
Expected: PASS for desktop roving focus, mobile tool rail, and reference-shaped shell.

---

### Task 4: Build shared searchable galleries and reference tool panels

**Files:**
- Create: `src/components/coat-of-arms/ReferenceAssetGallery.tsx`
- Create: `src/components/coat-of-arms/ReferenceAssetGallery.test.tsx`
- Modify: `src/components/coat-of-arms/TargetShieldPalette.tsx`
- Modify: `src/components/coat-of-arms/ChargeAndOrdinaryPanel.tsx`
- Modify: `src/components/coat-of-arms/TopPanel.tsx`
- Modify: `src/components/coat-of-arms/TargetFlagPalette.tsx`
- Modify: `src/components/coat-of-arms/TargetTokenPalette.tsx`

**Interfaces:**
- `ReferenceAssetGallery({ section, categories, locale, onSelect })` consumes `listReferenceCatalogEntries`.
- `onSelect(assetId: string)` is the only integration point for a panel; command dispatch remains in the panel.

- [ ] **Step 1: Write the failing search/category test.**

```tsx
it('filters the shield gallery by category and localized search term', async () => {
  const user = userEvent.setup();
  render(<ReferenceAssetGallery categories={['shield', 'heater']} locale="zh" onSelect={vi.fn()} section="shield" />);

  await user.click(screen.getByRole('tab', { name: 'Heater' }));
  await user.type(screen.getByRole('searchbox', { name: '搜索盾形' }), '尖顶');

  expect(screen.getByRole('button', { name: '选择盾形：尖顶纹章盾' })).toBeTruthy();
});
```

- [ ] **Step 2: Run RED.**

Run: `pnpm test src/components/coat-of-arms/ReferenceAssetGallery.test.tsx`  
Expected: FAIL because the reusable gallery does not exist.

- [ ] **Step 3: Implement gallery filtering with one deterministic predicate.**

```ts
export function matchesCatalogSearch(entry: ReferenceCatalogEntry, rawQuery: string): boolean {
  const normalizedQuery = rawQuery.trim().toLocaleLowerCase();
  if (normalizedQuery.length === 0) return true;
  return [entry.id, entry.name, entry.nameZh, ...entry.searchTerms]
    .join(' ')
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}
```

Render all cards from local manifest data, preserve selected state, and announce zero results with localized text.

- [ ] **Step 4: Adapt each panel and test real add behavior.**

```tsx
it('adds the selected lion from Charges as an independent layer', async () => {
  const user = userEvent.setup();
  render(<ChargeAndOrdinaryPanel locale="en" />);
  await user.click(screen.getByRole('button', { name: 'Add charge: Lion rampant' }));
  expect(useCoatProjectStore.getState().project.layers.filter((layer) => layer.assetId === 'lion-rampant')).toHaveLength(1);
});
```

- [ ] **Step 5: Run GREEN.**

Run: `pnpm test src/components/coat-of-arms/ReferenceAssetGallery.test.tsx src/components/coat-of-arms/CoatOfArmsPanels.test.tsx src/components/coat-of-arms/TargetFlagPalette.test.tsx src/components/coat-of-arms/TargetTokenPalette.test.tsx`  
Expected: PASS for local search, categories, and add commands.

---

### Task 5: Complete colors, tools, arrangement, and canvas preset behavior

**Files:**
- Create: `src/components/coat-of-arms/ArrangePanel.tsx`
- Create: `src/components/coat-of-arms/ArrangePanel.test.tsx`
- Create: `src/lib/coat-of-arms/editor-preferences.ts`
- Create: `src/lib/coat-of-arms/editor-preferences.test.ts`
- Modify: `src/components/coat-of-arms/ColorBackgroundPanel.tsx`
- Modify: `src/components/coat-of-arms/SettingsPanel.tsx`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.tsx`
- Modify: `src/lib/coat-of-arms/commands.ts`
- Modify: `src/lib/coat-of-arms/commands.test.ts`

**Interfaces:**
- `ArrangePanel` issues existing or extended `CoatProjectCommand` variants only.
- `loadEditorPreferences()` returns validated `EditorPreferences`; `saveEditorPreferences(preferences)` validates before storage.

- [ ] **Step 1: Write failing arrangement command tests.**

```ts
function createProjectWithTwoMovableLayers(): CoatProject {
  const project = createCoatMakerShowcaseProject('en');
  const movableLayers = project.layers.filter((layer) => layer.type === 'charge');
  return {
    ...project,
    layers: project.layers.map((layer, index) => {
      if (layer.id === movableLayers[0]?.id) return { ...layer, transform: { ...layer.transform, x: 20 } };
      if (layer.id === movableLayers[1]?.id) return { ...layer, transform: { ...layer.transform, x: 80 } };
      return layer;
    }),
  };
}

it('aligns explicit movable layer ids to their shared horizontal centre', () => {
  const project = createProjectWithTwoMovableLayers();
  const movableLayerIds = project.layers.filter((layer) => layer.type === 'charge').map((layer) => layer.id);
  const aligned = applyProjectCommand(project, { type: 'align-layer-ids', axis: 'horizontal-centre', layerIds: movableLayerIds });

  const alignedLayers = aligned.layers.filter((layer) => movableLayerIds.includes(layer.id));
  expect(alignedLayers.map((layer) => layer.transform.x)).toEqual([50, 50]);
});

it('rejects an alignment command with no movable layer ids', () => {
  expect(() => applyProjectCommand(createDefaultProject('en'), { type: 'align-layer-ids', axis: 'left', layerIds: [] }))
    .toThrow('[]');
});
```

- [ ] **Step 2: Run RED.**

Run: `pnpm test src/lib/coat-of-arms/commands.test.ts`  
Expected: FAIL because `align-selected-layers` is not accepted.

- [ ] **Step 3: Implement each arrangement command as a separate function.**

```ts
function alignLayerIds(project: CoatProject, layerIds: readonly string[], axis: LayerAlignmentAxis): CoatProject {
  if (layerIds.length === 0) throw new Error('Cannot align movable layer ids: []');
  return updateLayerTransforms(project, layerIds, axis);
}
```

Implement `align-layer-ids`, `distribute-layer-ids`, front/back, visibility, lock, group, ungroup, opacity, and aspect-locked size through typed commands. The store resolves its selected IDs and calls these explicit command variants; command code never reads UI selection.

- [ ] **Step 4: Write preference and preset RED tests.**

```ts
it('rejects an invalid persisted export quality with its value', () => {
  window.localStorage.setItem('coat-maker-editor-preferences', '{"jpegQuality":"bad"}');
  expect(() => loadEditorPreferences()).toThrow('bad');
});

it('applies the Instagram Story canvas preset', async () => {
  render(<SettingsPanel locale="en" />);
  await userEvent.setup().click(screen.getByRole('button', { name: 'Instagram Story' }));
  expect(useCoatProjectStore.getState().project.canvas).toMatchObject({ width: 1080, height: 1920 });
});
```

- [ ] **Step 5: Implement validated preferences, palettes, background controls, and presets.**

Keep custom color palette editing browser-local. Validate hex colors, palette names, gradient values, canvas width, and height before applying commands.

- [ ] **Step 6: Run GREEN.**

Run: `pnpm test src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/editor-preferences.test.ts src/components/coat-of-arms/ArrangePanel.test.tsx src/components/coat-of-arms/CoatOfArmsPanels.test.tsx`  
Expected: PASS for colors, presets, background changes, and arrange commands.

---

### Task 6: Close local project, upload, import, and export lifecycle gaps

**Files:**
- Modify: `src/components/coat-of-arms/ProjectLibraryDialog.tsx`
- Modify: `src/components/coat-of-arms/UploadPanel.tsx`
- Modify: `src/components/coat-of-arms/ExportMenu.tsx`
- Modify: `src/lib/coat-of-arms/project-storage.ts`
- Modify: `src/lib/coat-of-arms/export.ts`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`
- Modify: `src/lib/coat-of-arms/project-storage.test.ts`
- Modify: `src/lib/coat-of-arms/export.test.ts`

**Interfaces:**
- Project actions use `saveProjectRecord`, `loadProjectRecord`, `deleteProjectRecord`, `exportProjectDocument`, and `importProjectDocument`.
- Export actions use `exportCoatPng`, `exportCoatJpeg`, `exportCoatPdf`, `printCoatScene`, and `exportCoatBatch`.

- [ ] **Step 1: Write a full local project lifecycle RED test.**

```tsx
it('saves, saves as, renames, reloads, and deletes only local project records', async () => {
  const user = userEvent.setup();
  render(<ProjectLibraryDialog locale="en" open project={createDefaultProject('en')} onOpenChange={vi.fn()} onProjectChange={vi.fn()} />);

  await user.click(screen.getByRole('button', { name: 'Save project locally' }));
  await user.click(screen.getByRole('button', { name: 'Save as local copy' }));
  await user.click(screen.getByRole('button', { name: 'Rename saved project' }));
  expect(listProjectRecords()).toHaveLength(2);
});
```

- [ ] **Step 2: Run RED.**

Run: `pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/lib/coat-of-arms/project-storage.test.ts`  
Expected: FAIL because the lifecycle does not assert the complete local workflow.

- [ ] **Step 3: Implement failure-atomic local lifecycle behavior.**

When a file import is invalid, preserve the selected project and show localized error status. Store uploads in a local browser backend only; reject forbidden MIME types, malformed SVG, duplicate IDs, and size-limit violations before one command creates layers.

- [ ] **Step 4: Write format-specific export RED tests.**

```tsx
it('exports 512px low-quality JPEG at 0.55 and persists the choice locally', async () => {
  const jpegExport = vi.spyOn(exportModule, 'exportCoatJpeg').mockResolvedValue(new Blob());
  render(<ExportMenu locale="en" project={createDefaultProject('en')} />);

  await userEvent.setup().click(screen.getByRole('button', { name: 'JPEG' }));
  await userEvent.setup().click(screen.getByRole('button', { name: '512px' }));
  await userEvent.setup().click(screen.getByRole('button', { name: 'Low quality' }));
  expect(jpegExport).toHaveBeenCalledWith(expect.anything(), 512, 0.55);
});
```

- [ ] **Step 5: Implement preference-backed PNG/JPEG/PDF/copy/share/print/ZIP controls and run GREEN.**

Run: `pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/lib/coat-of-arms/project-storage.test.ts src/lib/coat-of-arms/export.test.ts`  
Expected: PASS for successful local workflow and each failure path.

---

### Task 7: Add CDP acceptance verification and final regression gate

**Files:**
- Create: `docs/superpowers/verification/2026-07-29-coamaker-cdp-checklist.md`
- Modify: `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- The checklist is evidence only; it does not replace tests.
- CDP uses the selected Browser tab capability and does not modify the reference website.

- [ ] **Step 1: Write failing component contracts for overflow and the complete tool sequence.**

```tsx
it('keeps the full reference tool sequence reachable from the mobile drawer', async () => {
  render(<CoatOfArmsMaker locale="en" />);
  for (const label of ['Shields', 'Charges', 'Top', 'Colors', 'Tools', 'Arrange', 'Settings', 'How-to', 'Flags', 'Tokens']) {
    expect(screen.getByRole('tab', { name: label })).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run RED and implement only the missing mobile tab wiring/styles.**

Run: `pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`  
Expected before implementation: FAIL for any missing tool.  
Expected after implementation: PASS.

- [ ] **Step 3: Record CDP evidence at 1440px and 375px.**

Use a reference tab and a `localhost:3001/coat-of-arms-maker` tab. At both widths:

1. Capture viewport and full-page screenshots.
2. Verify the tool order, collapse/expand behavior, gallery selection, drag/select/transform, group/undo/redo, local save/reload, import/export, and one PNG/PDF action.
3. Evaluate `document.documentElement.scrollWidth <= document.documentElement.clientWidth` on mobile.
4. Inspect browser request events and confirm no request URL contains `coamaker.com` from the local tab.
5. Write observed values, screenshot paths, and any failed contract into the checklist.

If CDP is unavailable, record the exact tool error and keep the task incomplete; do not claim parity from unit tests.

- [ ] **Step 4: Run the final repository checks.**

Run: `pnpm lint && pnpm test && pnpm build`  
Expected: each command exits 0. Report actual output and any unverified CDP condition.

## Plan Self-Review

- Spec coverage: Tasks 1–7 cover reference layout, tool hierarchy, original local asset catalog, canvas/arrange/colors/tools, local lifecycle/export, mobile behavior, CDP comparison, and build/test gates.
- Intentional exclusions: paid/account/cloud/source asset functionality remains removed, matching the accepted free-local scope.
- Consistency: catalog queries flow through `reference-catalog.ts`; UI text flows through `workbench-copy.ts`; mutations flow through `CoatProjectCommand`; persistence flows through `project-storage.ts` and `editor-preferences.ts`.
- No placeholders: every task names files, interfaces, a focused RED assertion, exact command, and green evidence.
