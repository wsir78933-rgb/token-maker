# Coat of Arms Maker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Add a bilingual, full-screen Coat Maker route whose editor reproduces all core CoaMaker editing workflows while making every editor capability available without an account or paid tier.

**Architecture:** Keep the new maker isolated from the Token Maker domain. A pure coat-of-arms domain layer owns validated project state, command history, sample and uploaded assets, field generation, and local project persistence. A separate SVG scene renderer is shared by the interactive canvas and the local PNG, PDF, batch, and print export actions. React components only translate visible controls and pointer or keyboard events into the domain command interface.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Zustand, JSZip, browser SVG and canvas APIs. Add \`jspdf\` only for the local PDF export action.

## Global Constraints

- Implement every core editor workflow visible in CoaMaker: shield and field editing, ordinary and charge placement, colours and palettes, backgrounds, text and motto, user uploads, canvas transformation, copy/paste/grouping, layer management, undo/redo, random generation, local projects, project import/export, PNG/PDF/print/batch export.
- Do not reproduce CoaMaker source code, brand assets, remote asset URLs, login, Pro labels, payment, external saving, community, article content, or a footer.
- Use independently authored geometry and legally reusable icons or user-supplied uploads. Sample assets are local and must never trigger a CoaMaker network request.
- Keep the Token Maker route, editor store, renderer, share flow, and local-storage key untouched. New state persists only under \`coat-of-arms-maker-storage\`.
- Each public function validates its input at the boundary and throws an error naming the invalid value. Do not silently discard invalid commands, corrupt project JSON, or failed exports.
- Preserve the existing site visual system: its CSS variables, typography, radii, buttons, and dark mode. Reproduce CoaMaker’s workbench hierarchy, not its copyrighted artwork or brand styling.
- Desktop workbench order is tool rail and panels on the left, scene canvas in the centre, inspector and layer/project controls on the right. Mobile exposes the same panels in a bottom sheet or tabbed drawer with no horizontal page overflow.
- Write a failing Vitest test before each production behavior. Run the focused test red, implement the smallest behavior, then run it green.
- Do not create a commit during this task unless the user later authorizes one.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| \`src/lib/coat-of-arms/types.ts\` | Domain types shared by pure logic, renderer, store, and UI. |
| \`src/lib/coat-of-arms/assets.ts\` | Safe shield, charge, ordinary, and pattern catalog definitions. |
| \`src/lib/coat-of-arms/field.ts\` | Field division, pattern, and colour geometry calculation. |
| \`src/lib/coat-of-arms/commands.ts\` | Validated immutable project commands and history snapshots. |
| \`src/lib/coat-of-arms/project-storage.ts\` | Browser-local project collection serialization, migration, import, and export. |
| \`src/lib/coat-of-arms/store.ts\` | Zustand bridge that exposes only the command API to UI components. |
| \`src/lib/coat-of-arms/scene-svg.ts\` | Deterministic scene-to-SVG generation. |
| \`src/lib/coat-of-arms/export.ts\` | Local PNG, PDF, print, and ZIP batch export. |
| \`src/components/coat-of-arms/*\` | Workbench shell and focused panels. Each component owns one visible surface. |
| \`src/app/(en)/coat-of-arms-maker/page.tsx\` | English metadata and full-screen workbench route. |
| \`src/app/(zh)/zh/coat-of-arms-maker/page.tsx\` | Chinese metadata and full-screen workbench route. |

## Task 1: Establish the coat-of-arms domain and safe core catalog

**Files:**
- Create: \`src/lib/coat-of-arms/types.ts\`
- Create: \`src/lib/coat-of-arms/assets.ts\`
- Create: \`src/lib/coat-of-arms/field.ts\`
- Create: \`src/lib/coat-of-arms/assets.test.ts\`
- Create: \`src/lib/coat-of-arms/field.test.ts\`

**Interfaces:**
- Produces \`CoatProject\`, \`CoatLayer\`, \`ShieldLayer\`, \`ChargeLayer\`, \`TextLayer\`, \`CanvasTransform\`, and \`CoatAsset\`.
- Produces \`getCoatAsset(assetId: string): CoatAsset\`, \`listAssetsByKind(kind)\`, \`createDefaultProject(locale)\`, and \`buildFieldSvg(projectField, shieldPath)\`.
- Later tasks consume only these exported values. They must not inspect catalog implementation details.

- [ ] **Step 1: Write failing catalog tests**

\`\`\`ts
import { describe, expect, it } from 'vitest';
import { getCoatAsset, listAssetsByKind } from './assets';

describe('coat asset catalog', () => {
  it('exposes a local shield and a local charge without a remote source', () => {
    const shield = getCoatAsset('heater-shield');
    const charge = getCoatAsset('golden-lion');

    expect(shield.kind).toBe('shield');
    expect(charge.kind).toBe('charge');
    expect(shield.sourceUrl).toBeUndefined();
    expect(charge.sourceUrl).toBeUndefined();
  });

  it('rejects an unknown asset id with the invalid id in the error', () => {
    expect(() => getCoatAsset('not-an-asset')).toThrow('not-an-asset');
  });

  it('keeps categories available for the full editor workflow', () => {
    expect(listAssetsByKind('ordinary').length).toBeGreaterThan(0);
    expect(listAssetsByKind('charge').length).toBeGreaterThan(0);
  });
});
\`\`\`

- [ ] **Step 2: Run the focused test to verify red**

Run: \`pnpm test src/lib/coat-of-arms/assets.test.ts\`  
Expected: FAIL because the catalog module does not exist.

- [ ] **Step 3: Implement the minimal typed catalog**

\`\`\`ts
export function getCoatAsset(assetId: string): CoatAsset {
  const coatAsset = coatAssets.find((candidate) => candidate.id === assetId);
  if (!coatAsset) {
    throw new Error(\`Unknown coat asset id: \${assetId}\`);
  }
  return coatAsset;
}
\`\`\`

Use independently authored shield paths and generic heraldic geometry. Cover shield, ordinary, charge, pattern, and background categories with local definitions. Never include a CoaMaker URL, filename, logo, or copied SVG path.

- [ ] **Step 4: Write failing field-generation tests**

\`\`\`ts
it('clips a per-pale field to the selected shield path', () => {
  const fieldSvg = buildFieldSvg(
    { division: 'per-pale', colors: ['#B11F24', '#F5E6A1'], pattern: 'solid' },
    'M50 0 L100 18 V62 C100 84 78 97 50 110 C22 97 0 84 0 62 V18 Z',
  );

  expect(fieldSvg).toContain('clipPath');
  expect(fieldSvg).toContain('#B11F24');
  expect(fieldSvg).toContain('#F5E6A1');
});
\`\`\`

- [ ] **Step 5: Run the field test red, implement, and run green**

Run: \`pnpm test src/lib/coat-of-arms/field.test.ts\`  
Expected before implementation: FAIL because \`buildFieldSvg\` is missing.  
Expected after implementation: PASS.

- [ ] **Step 6: Run both domain suites**

Run: \`pnpm test src/lib/coat-of-arms/assets.test.ts src/lib/coat-of-arms/field.test.ts\`  
Expected: PASS.

## Task 2: Implement validated project commands, history, and local project storage

**Files:**
- Create: \`src/lib/coat-of-arms/commands.ts\`
- Create: \`src/lib/coat-of-arms/project-storage.ts\`
- Create: \`src/lib/coat-of-arms/store.ts\`
- Create: \`src/lib/coat-of-arms/commands.test.ts\`
- Create: \`src/lib/coat-of-arms/project-storage.test.ts\`

**Interfaces:**
- Consumes: domain types and \`getCoatAsset\`.
- Produces \`applyProjectCommand(project, command): CoatProject\`, \`undoProject(history)\`, \`redoProject(history)\`, \`saveProjectRecord(record)\`, \`loadProjectRecord(projectId)\`, \`exportProjectDocument(project)\`, and \`importProjectDocument(serializedProject)\`.
- Valid project commands are \`add-layer\`, \`update-layer\`, \`remove-layer\`, \`move-layer\`, \`set-layer-visibility\`, \`set-layer-lock\`, \`group-layers\`, \`ungroup-layers\`, \`set-field\`, \`set-background\`, and \`set-project-name\`.

- [ ] **Step 1: Write failing command tests**

\`\`\`ts
it('creates unique independent instances when the same charge is added twice', () => {
  const initialProject = createDefaultProject('en');
  const once = applyProjectCommand(initialProject, {
    type: 'add-layer',
    assetId: 'golden-lion',
  });
  const twice = applyProjectCommand(once, {
    type: 'add-layer',
    assetId: 'golden-lion',
  });

  expect(twice.layers).toHaveLength(3);
  expect(twice.layers[1]?.id).not.toBe(twice.layers[2]?.id);
});

it('rejects updates to locked layers with the locked layer id', () => {
  const projectWithLockedLayer = createProjectWithLockedCharge('charge-1');

  expect(() =>
    applyProjectCommand(projectWithLockedLayer, {
      type: 'update-layer',
      layerId: 'charge-1',
      patch: { transform: { x: 20, y: 20, scale: 1, rotation: 0 } },
    }),
  ).toThrow('charge-1');
});
\`\`\`

- [ ] **Step 2: Run the command test red**

Run: \`pnpm test src/lib/coat-of-arms/commands.test.ts\`  
Expected: FAIL because the command module does not exist.

- [ ] **Step 3: Implement immutable commands and history**

\`\`\`ts
export function applyProjectCommand(
  project: CoatProject,
  command: CoatProjectCommand,
): CoatProject {
  switch (command.type) {
    case 'add-layer':
      return addAssetLayer(project, command.assetId);
    case 'update-layer':
      return updateProjectLayer(project, command.layerId, command.patch);
    default:
      return assertNeverCommand(command);
  }
}
\`\`\`

Implement each command in a separate named function. Validate layer IDs, asset IDs, finite transforms, colour values, group membership, and project names before state mutation.

- [ ] **Step 4: Write failing persistence tests**

\`\`\`ts
it('round-trips a saved project through browser storage', () => {
  const project = createDefaultProject('zh');
  saveProjectRecord({ id: project.id, name: '徽章测试', project });

  expect(loadProjectRecord(project.id)?.project).toEqual(project);
});

it('rejects imported JSON that references an unknown asset', () => {
  const invalidDocument = JSON.stringify({
    version: 1,
    layers: [{ id: 'x', kind: 'charge', assetId: 'unknown-charge' }],
  });

  expect(() => importProjectDocument(invalidDocument)).toThrow('unknown-charge');
});
\`\`\`

- [ ] **Step 5: Run persistence tests red, implement, and run green**

Run: \`pnpm test src/lib/coat-of-arms/project-storage.test.ts\`  
Expected before implementation: FAIL because storage APIs are missing.  
Expected after implementation: PASS.

Persist JSON model data only. Do not persist DOM nodes, Blob URLs, canvas objects, remote URLs, or a Token Maker key.

- [ ] **Step 6: Run all Task 2 tests**

Run: \`pnpm test src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/project-storage.test.ts\`  
Expected: PASS.

## Task 3: Build deterministic SVG scene rendering and all local export formats

**Files:**
- Create: \`src/lib/coat-of-arms/scene-svg.ts\`
- Create: \`src/lib/coat-of-arms/export.ts\`
- Create: \`src/lib/coat-of-arms/scene-svg.test.ts\`
- Create: \`src/lib/coat-of-arms/export.test.ts\`
- Modify: \`package.json\`
- Modify: \`pnpm-lock.yaml\`

**Interfaces:**
- Consumes: \`CoatProject\` and domain assets.
- Produces \`renderCoatSceneSvg(project, options): string\`, \`exportCoatPng(project, size): Promise<Blob>\`, \`exportCoatPdf(project, size): Promise<Blob>\`, \`exportCoatBatch(projects, size): Promise<Blob>\`, and \`printCoatScene(project, size): void\`.
- \`renderCoatSceneSvg\` is deterministic and performs no DOM access. Browser-only export code is isolated in \`export.ts\`.

- [ ] **Step 1: Write failing renderer tests**

\`\`\`ts
it('renders visible layers in order and omits hidden layers', () => {
  const svg = renderCoatSceneSvg(projectWithVisibleAndHiddenLayers, {
    width: 512,
    height: 512,
  });

  expect(svg).toContain('visible-charge');
  expect(svg).not.toContain('hidden-charge');
});

it('renders project text with XML-safe content', () => {
  const svg = renderCoatSceneSvg(projectWithText('A < B'), {
    width: 512,
    height: 512,
  });

  expect(svg).toContain('A &lt; B');
});
\`\`\`

- [ ] **Step 2: Run renderer tests red**

Run: \`pnpm test src/lib/coat-of-arms/scene-svg.test.ts\`  
Expected: FAIL because the renderer does not exist.

- [ ] **Step 3: Implement the renderer**

Use one renderer for shield field clipping, ordinary paths, charges, text, background motifs, group opacity, and layer transforms. XML-escape all text and refuse a project with invalid finite geometry.

- [ ] **Step 4: Add the PDF dependency and write failing export tests**

Run: \`pnpm add jspdf\`

\`\`\`ts
it('exports a non-empty PNG blob with image/png type', async () => {
  const png = await exportCoatPng(createDefaultProject('en'), 1024);

  expect(png.type).toBe('image/png');
  expect(png.size).toBeGreaterThan(0);
});

it('rejects an unsupported export size with the received value', async () => {
  await expect(exportCoatPng(createDefaultProject('en'), 123)).rejects.toThrow('123');
});
\`\`\`

- [ ] **Step 5: Run export tests red, implement, and run green**

Run: \`pnpm test src/lib/coat-of-arms/export.test.ts\`  
Expected before implementation: FAIL because export APIs are missing.  
Expected after implementation: PASS.

Convert the generated SVG to a canvas for PNG. Build a PDF with the same rendered image. Use the existing JSZip dependency for a batch ZIP. Throw a visible error when browser canvas, PDF generation, or image decoding fails.

- [ ] **Step 6: Run Task 3 suites**

Run: \`pnpm test src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/export.test.ts\`  
Expected: PASS.

## Task 4: Implement the workbench canvas, selection, transformations, and keyboard editor commands

**Files:**
- Create: \`src/components/coat-of-arms/CoatOfArmsCanvas.tsx\`
- Create: \`src/components/coat-of-arms/CanvasSelectionHandles.tsx\`
- Create: \`src/components/coat-of-arms/useCoatKeyboardShortcuts.ts\`
- Create: \`src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx\`
- Create: \`src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx\`

**Interfaces:**
- Consumes: \`renderCoatSceneSvg\` plus the command-oriented store API.
- Produces: an accessible interactive canvas that selects an unlocked layer and emits \`update-layer\` commands for pointer drag, resize, and rotate.
- Keyboard command interface: Delete/Backspace removes selection, Arrow keys move selection, Cmd/Ctrl+C copies, Cmd/Ctrl+V pastes, Cmd/Ctrl+G groups, Cmd/Ctrl+Shift+G ungroups, Cmd/Ctrl+Z undoes, Cmd/Ctrl+Shift+Z redoes.

- [ ] **Step 1: Write failing component tests**

\`\`\`tsx
it('moves only the selected unlocked layer during a canvas drag', async () => {
  render(<CoatOfArmsCanvas />);
  await selectLayer('charge-1');
  await dragLayer('charge-1', { from: [100, 100], to: [140, 120] });

  expect(getLayerTransform('charge-1')).toMatchObject({ x: 40, y: 20 });
});

it('does not delete a selected layer while a text input owns focus', async () => {
  render(<CoatOfArmsCanvas />);
  await focusProjectNameInput();
  await pressKey('Backspace');

  expect(getProjectLayerIds()).toContain('charge-1');
});
\`\`\`

- [ ] **Step 2: Run canvas tests red**

Run: \`pnpm test src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx\`  
Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement pointer and keyboard behavior**

Keep pointer-coordinate conversion in one hook. Keep selection handles presentational. The shortcut hook must first reject editable targets and locked/no-selection cases, then invoke one command. Do not update React state on every unrelated pointer movement.

- [ ] **Step 4: Run focused tests green**

Run: \`pnpm test src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx\`  
Expected: PASS.

## Task 5: Implement all core tool panels and their accessible control contracts

**Files:**
- Create: \`src/components/coat-of-arms/AssetLibraryPanel.tsx\`
- Create: \`src/components/coat-of-arms/ShieldFieldPanel.tsx\`
- Create: \`src/components/coat-of-arms/ChargeAndOrdinaryPanel.tsx\`
- Create: \`src/components/coat-of-arms/ColorBackgroundPanel.tsx\`
- Create: \`src/components/coat-of-arms/TextMottoPanel.tsx\`
- Create: \`src/components/coat-of-arms/LayerPanel.tsx\`
- Create: \`src/components/coat-of-arms/UploadPanel.tsx\`
- Create: \`src/components/coat-of-arms/CoatOfArmsPanels.test.tsx\`

**Interfaces:**
- Consumes only the store command interface and asset selectors.
- Produces the target editor’s core tool categories: shields, field divisions and patterns, ordinaries, charges, colours/palettes, backgrounds, text/motto, image upload, layers, and random generation.
- A panel may not mutate another panel’s local state directly.

- [ ] **Step 1: Write failing panel tests**

\`\`\`tsx
it('adds a charge from the library and exposes it in layers', async () => {
  render(<CoatOfArmsPanels />);
  await user.click(screen.getByRole('button', { name: /add lion/i }));

  expect(screen.getByRole('option', { name: /golden lion/i })).toBeVisible();
});

it('updates every matching colour when the replace-colour action is confirmed', async () => {
  render(<CoatOfArmsPanels project={projectWithTwoRedLayers} />);
  await chooseReplacementColor('#004E89');

  expect(getProjectLayerColor('first')).toBe('#004E89');
  expect(getProjectLayerColor('second')).toBe('#004E89');
});
\`\`\`

- [ ] **Step 2: Run panel tests red**

Run: \`pnpm test src/components/coat-of-arms/CoatOfArmsPanels.test.tsx\`  
Expected: FAIL because the panels do not exist.

- [ ] **Step 3: Implement core panel actions**

Implement the full panel set without Pro gates:

1. Shield outline selection and field division or variation controls.
2. Ordinary and charge catalogue search, category selection, add-to-canvas, and random choice.
3. Used colours, saved local palettes, custom palette creation, per-layer editing, and replace-all-colour action.
4. Background colour, motif, opacity, and transparent export background.
5. Text and motto content, typography, alignment, curve/ring mode, colour, and transform.
6. Safe user image or SVG upload that validates filename, MIME type, size, and parse failure before adding a local layer.
7. Layer reorder, visibility, lock, duplicate, group, ungroup, and delete.

- [ ] **Step 4: Run panel tests green**

Run: \`pnpm test src/components/coat-of-arms/CoatOfArmsPanels.test.tsx\`  
Expected: PASS.

## Task 6: Compose the full workbench, projects, export menu, and responsive UI

**Files:**
- Create: \`src/components/coat-of-arms/CoatOfArmsMaker.tsx\`
- Create: \`src/components/coat-of-arms/ProjectLibraryDialog.tsx\`
- Create: \`src/components/coat-of-arms/ExportMenu.tsx\`
- Create: \`src/components/coat-of-arms/CoatOfArmsMobileDrawer.tsx\`
- Create: \`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx\`
- Modify: \`src/app/globals.css\`

**Interfaces:**
- Consumes canvas and focused panel components. It owns only responsive panel placement and the selected active panel tab.
- Produces the page-level editor shell: left tool rail and panel, centre scene, right inspector/layer/project dock, top action bar, and mobile drawer.

- [ ] **Step 1: Write failing shell tests**

\`\`\`tsx
it('keeps every core tool category reachable from the desktop workbench', () => {
  render(<CoatOfArmsMaker locale="en" />);

  expect(screen.getByRole('tab', { name: /shields/i })).toBeVisible();
  expect(screen.getByRole('tab', { name: /charges/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /export/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /projects/i })).toBeVisible();
});

it('contains no account or paid-tier action', () => {
  render(<CoatOfArmsMaker locale="en" />);

  expect(screen.queryByText(/pro|upgrade|login|subscription/i)).toBeNull();
});
\`\`\`

- [ ] **Step 2: Run shell tests red**

Run: \`pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx\`  
Expected: FAIL because the workbench shell does not exist.

- [ ] **Step 3: Implement shell and project or export surfaces**

Use the existing site CSS variables and shadcn components. The workbench must fit desktop viewport height after the shared site topbar, preserve keyboard focus, show useful empty and error states, and keep action labels on one line. Add local project create, save, save-as, rename, delete, JSON import/export, PNG/PDF/print/batch export and visible export failure messages. On mobile, the scene stays first and each tool panel opens through a labeled drawer tab.

- [ ] **Step 4: Run shell tests green**

Run: \`pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx\`  
Expected: PASS.

## Task 7: Add bilingual routes, navigation, metadata, sitemap, and integration tests

**Files:**
- Create: \`src/app/(en)/coat-of-arms-maker/page.tsx\`
- Create: \`src/app/(zh)/zh/coat-of-arms-maker/page.tsx\`
- Modify: \`src/components/site/HomeSeoContent.tsx\`
- Modify: \`src/components/site/InnerPageChrome.tsx\`
- Modify: \`src/lib/site-content.ts\`
- Modify: \`src/app/sitemap.ts\`
- Modify: \`src/app/site-routes.test.tsx\`
- Modify: \`src/app/sitemap.test.ts\`

**Interfaces:**
- Consumes \`CoatOfArmsMaker\` and existing locale helpers.
- Produces \`/coat-of-arms-maker\` and \`/zh/coat-of-arms-maker\`, canonical metadata, language alternates, sitemap entries, and nav links between Dice Roller and Blog.

- [ ] **Step 1: Write failing route and sitemap tests**

\`\`\`tsx
it('renders the English coat maker route with the required canonical', () => {
  expect(englishCoatMakerMetadata.alternates?.canonical).toBe('/coat-of-arms-maker');
  render(<EnglishCoatMakerPage />);
  expect(screen.getByRole('main', { name: /coat maker workspace/i })).toBeVisible();
});

it('adds bilingual coat maker URLs to the sitemap', () => {
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain('https://www.tokenmaker.one/coat-of-arms-maker');
  expect(urls).toContain('https://www.tokenmaker.one/zh/coat-of-arms-maker');
});
\`\`\`

- [ ] **Step 2: Run route tests red**

Run: \`pnpm test src/app/site-routes.test.tsx src/app/sitemap.test.ts\`  
Expected: FAIL because the route and sitemap entries do not exist.

- [ ] **Step 3: Implement routes and navigation**

Add \`coatMaker\` to \`NavLabels\` with values \`Coat Maker\` and \`纹章制作器\`. Insert it after Dice Roller in both navigation arrays. Render \`ContentSiteTopbar\` directly above the workbench, with no Footer or long-form content. Use only locale-owned visible copy and preserve language switching.

- [ ] **Step 4: Run route tests green**

Run: \`pnpm test src/app/site-routes.test.tsx src/app/sitemap.test.ts\`  
Expected: PASS.

## Task 8: Execute integration verification and full regression checks

**Files:**
- Modify: tests created above only when a real behavior gap is found.

**Interfaces:**
- Verifies the complete public editor contract without modifying unrelated Token Maker behavior.

- [ ] **Step 1: Run the focused coat-maker suite**

Run: \`pnpm test src/lib/coat-of-arms src/components/coat-of-arms src/app/site-routes.test.tsx src/app/sitemap.test.ts\`  
Expected: PASS.

- [ ] **Step 2: Run project quality gates**

Run: \`pnpm lint && pnpm test && pnpm build\`  
Expected: PASS.

- [ ] **Step 3: Browser verification**

At desktop width 1440 and mobile width 375, verify:

1. Both localized routes load from their navigation item.
2. Shield, field, ordinary, charge, background, colour, text, upload, layer, random, project, and export controls are reachable.
3. Add, transform, copy/paste, group, hide, lock, undo/redo, save, refresh recovery, JSON import/export, PNG, PDF, print, and ZIP batch work without account or network calls to CoaMaker.
4. The desktop panel relationship matches the target workbench and mobile has no horizontal overflow.

- [ ] **Step 4: Confirm visual and copy pre-flight**

Check every visible English and Chinese label, button contrast, keyboard focus, empty state, error state, dark mode, and reduced-motion behavior. Do not claim completion until each core tool panel has evidence from tests or browser verification.

## Task 9: Close the full-editor acceptance gaps found by independent review

**Files:**
- Modify only the Coat Maker domain, store, panel, canvas, project-library, and workbench files directly needed by these gaps, plus their behavioral tests.

**Interfaces:**
- Keeps the existing Token Maker independent. All limits and recovery are local browser behavior; all visible controls use the route locale.

- [ ] **Step 1: Restore editor integrity and accessible manipulation**

Correct layer ordering and centred scale rendering, protect base shield/background from irrecoverable deletion, and make selection plus transform operations usable through the keyboard as well as pointer input. Add regression tests for each behavior.

- [ ] **Step 2: Close local data-boundary and recovery gaps**

Enforce bounded JSON import/document/model resources at the shared validation boundary. Persist a separate recoverable local draft, hydrate it on reload, and provide explicit recovery or discard behavior without overwriting named saved projects. Add behavioral tests.

- [ ] **Step 3: Complete creator workflows and localized UI**

Add an explicit whole-project randomize action, make all Maker tool-panel labels/actions locale-owned for English and Chinese, and add tests that prove both routes expose localized controls.

- [ ] **Step 4: Re-run Task 8 against the corrected editor**

Repeat the complete focused suite, lint, full tests, build, and real Chrome desktop/mobile flows with a decodable local test asset. No issue from this review may remain Critical or Important.
