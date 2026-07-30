# CoaMaker Free Local-Parity Design

## Product decision

Recreate the publicly observable CoaMaker editor as a free, local-first Coat
Maker route in Token Maker. The replica targets interaction and layout parity,
not a copy of CoaMaker source code, branding, paid service, account system, or
copyrighted asset files. All editor data, projects, uploads, and preferences
remain in the browser.

The accepted scope is the user-selected **A: free local function and interaction
1:1**. This document supersedes any earlier idea of a right-hand inspector dock:
the current reference editor uses a collapsible left library and central canvas.

## Reference contract

The public reference deployment exposes these free-editor surfaces:

- A 50px dark app bar with information links and an Export entry point.
- A collapsible desktop tool rail and library: Shields, Charges, Top, Colors,
  Tools, Arrange, Settings, tutorial, Flags, and Tokens.
- A central selectable artwork canvas with undo/redo and multi-select.
- A mobile horizontal bottom tool rail and expanded bottom panel.
- Searchable categorized galleries for shields, charges, exterior ornaments,
  flags, and tokens.
- Shield field/background patterns, element colors, custom palettes, text,
  freehand drawing, randomization, heraldic names, layers, grouping, transforms,
  keyboard shortcuts, and canvas presets.
- Local design lifecycle: new, rename, save/save-as, local import/export and
  restoration; export to PNG/JPG/PDF, copy/share/print, and quality/background
  preferences.

The public asset manifest observed on 2026-07-29 contains 1,295 records with
shield, charge, and exterior categories. The new local catalog must provide the
same category navigation and comparable card volume using only original or
commercially permitted material. It must not download CoaMaker assets at runtime
or represent subscription-gated records as paid.

## Architecture

### Route shell

`/(en)/coat-of-arms-maker` and `/zh/coat-of-arms-maker` render the same focused
workbench with route-localized visible and accessible text. The workbench owns
only shell state: active tool, collapsed rail, mobile drawer, fullscreen,
transient dialogs, and layout. It does not own project mutation logic.

### Editor state and commands

`src/lib/coat-of-arms` remains the sole public state boundary. Components issue
typed commands and subscribe to selectors; they do not mutate layer internals.
Command handlers validate inputs before writing, produce one history checkpoint
per user action, and throw a descriptive error for invalid IDs, dimensions,
uploads, or imported projects.

Vertical capability modules remain small and focused:

- `assets`: local asset manifest, category search, field/pattern definitions.
- `commands` and `store`: project changes, history and selection.
- `project-storage`: browser-local durable projects and draft recovery.
- `export`: image/PDF/print/share/copy primitives and persisted preferences.
- `components/coat-of-arms`: presentation and interaction modules only.

### Local persistence

Project JSON and metadata use browser storage with versioned validation and
explicit size limits. User uploads use browser-local storage only. There is no
login, server save, subscription check, remote asset fetch, or dead paid-entry
point. Import failure never overwrites an existing project.

## Delivery slices

1. **Reference shell parity.** Match the actual desktop/mobile workbench
   composition, rail behavior, tool order, top/action bars, canvas controls,
   accessible tab semantics, and full Chinese localization.
2. **Library and canvas parity.** Build the reference category tree, search,
   selected-library behavior, field/pattern colors, local asset manifest,
   add/select/drag/resize/rotate/crop, layers, grouping, and keyboard contract.
3. **Tools and arrangement parity.** Complete text variants, drawing,
   random/name helpers, colors/palettes/backgrounds, arrange/alignment,
   visibility/locking, preset/custom canvases, and reset.
4. **Free local lifecycle parity.** Complete new/save/save-as/rename/delete,
   draft recovery, JSON import/export, local upload organization, and export
   preferences/formats without paid or server flows.
5. **Responsive and verification parity.** Exercise desktop and mobile flows in
   CDP, detect external CoaMaker requests and horizontal overflow, compare
   reference/local screenshots, then run the complete lint/test/build suite.

## Error handling

Every user-visible boundary gives an actionable, localized error. Invalid local
JSON, duplicate uploads, unsupported media, over-limit storage, missing layers,
unavailable clipboard/share/fullscreen APIs, and failed exports must fail before
partial project writes. Unknown errors are surfaced rather than silently ignored.

## Test and acceptance contract

Each delivery slice follows RED → GREEN → REFACTOR:

1. Add the smallest behavior test that fails for the missing reference contract.
2. Run that focused test and verify the intended failure.
3. Implement the smallest cohesive command/component change.
4. Run the focused suite, then relevant component/library suites.

Completion requires all of the following evidence:

- Every reference tool group is reachable on desktop and mobile, with correct
  panel behavior, keyboard access, and route-localized labels.
- The local asset manifest has no CoaMaker URL, source asset, or subscription
  branch and exposes the reference navigation taxonomy at the agreed volume.
- The canvas passes add → select → transform → duplicate → group/ungroup →
  undo/redo → delete and all documented shortcuts.
- A project passes create → save → save-as → rename → load → JSON export/import
  → delete without remote traffic or data loss.
- PNG, JPG, PDF, copy, share, print, and quality/background settings each use
  their intended primitive and surface failure states.
- CDP checks both locales at 1440px and 375px for core flows, no horizontal
  overflow, and no CoaMaker requests. If CDP is unavailable, the limitation is
  reported and the goal is not declared complete.
- `pnpm lint`, `pnpm test`, and `pnpm build` all pass in the `复刻` worktree.

## Explicit exclusions

No login, Go Pro, payment, account/user artwork, remote save, cloud sharing,
server palette storage, paid upsell, or copyrighted CoaMaker source/asset reuse.
These are removed rather than shown as disabled controls.
