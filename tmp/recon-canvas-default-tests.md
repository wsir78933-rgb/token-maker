# Recon: default coat canvas 1200×1200 → 1800×1080

Read-only. No `src/` edits. No git changes.

## Product fact (verified in source)

- Default **project** canvas is authored once in `createProjectWithIds` (`src/lib/coat-of-arms/assets.ts:353`): `{ width: 1200, height: 1200 }`.
- That factory is shared by `createDefaultProject`, `createCoatMakerShowcaseProject`, and `createInitialCoatProject`. Changing that one object updates all three.
- Settings preset **`3-5` already exists** in `editorCanvasPresets`: `{ id: '3-5', width: 1800, height: 1080 }`.
- Settings preset **`square` is 1080×1080**, label `1:1 (Switzerland, Vatican City)`. It is **not** 1200×1200.
- Today `getMatchingEditorCanvasPresetId(1200, 1200)` returns `'custom'`. After the change, `getMatchingEditorCanvasPresetId(1800, 1080)` returns `'3-5'`.
- Editor-preference default is still `canvasPreset: 'square'` (`editor-preferences.ts:45`). Project canvas and preference preset are already mismatched (1200×1200 custom vs 1080×1080 square). Aligning the product default with preset `3-5` means **also** changing `defaultEditorPreferences.canvasPreset` to `'3-5'` if Reset editor should match.
- Colors / chrome: out of scope. Do not touch artboard `#fff`, scene `#f0ece2`, chrome 99/50/40.

Export longest-edge math (`scaleCanvasToLongestEdge`): for 1800×1080, `height = round(size * 1080/1800)` = `round(size * 0.6)`.

| export size | current square default | new 1800×1080 default |
| --- | --- | --- |
| 256 | 256×256 | 256×154 |
| 512 | 512×512 | 512×307 |
| 1024 | 1024×1024 | 1024×614 |
| 2048 | 2048×2048 | 2048×1229 |

---

## MUST CHANGE (will fail after default canvas is 1800×1080)

### `src/lib/coat-of-arms/assets.test.ts`

| test name | current expected | new expected |
| --- | --- | --- |
| `creates a localized renderable project with a canvas and local background` | `project.canvas` `{ width: 1200, height: 1200 }` | `{ width: 1800, height: 1080 }` |

`createCoatMakerShowcaseProject` / `createInitialCoatProject` inherit this canvas. See Misses.

### `src/components/coat-of-arms/SettingsPanel.test.tsx`

| test name | current expected | new expected |
| --- | --- | --- |
| `keeps invalid manual dimensions out of the project and exposes their value as an error` | after Width `4097` + Apply, canvas stays `{ width: 1200, height: 1200 }` | `{ width: 1800, height: 1080 }` |
| `resets the unsaved editor project and local canvas preference` | `resetProject.canvas` `{ width: 1200, height: 1200 }` | `{ width: 1800, height: 1080 }` |

Reset also asserts `loadEditorPreferences().canvasPreset === 'square'`. That is **not** the project canvas size.

- If Reset keeps `getDefaultEditorPreferences()` and you **do not** change `canvasPreset: 'square'` → keep `'square'`.
- If the new product default is preset `3-5` and you **do** change `defaultEditorPreferences.canvasPreset` to `'3-5'` → new expected `'3-5'`.

### `src/lib/coat-of-arms/export.test.ts`

| test name | current expected | new expected |
| --- | --- | --- |
| `formats a square default project at 512 like CoaMaker` | `'512 × 512 px'` | `'512 × 307 px'` (rename: default is no longer square) |
| `exports a non-empty PDF through the controlled jsPDF adapter` | `addImage(..., 0, 0, 512, 512)` | `addImage(..., 0, 0, 512, 307)` |

Comment / title: `formats a square default project at 512 like CoaMaker` is a square-default comment. Rewrite when the default is 3:5.

### `src/components/coat-of-arms/ExportMenu.test.tsx`

| test name | current expected | new expected |
| --- | --- | --- |
| `updates the live dimensions label when the quality slider changes` | `'1024 × 1024 px'` then `'256 × 256 px'` | `'1024 × 614 px'` then `'256 × 154 px'` |

This uses `createDefaultProject('en')` plus default export size 1024, then quality `0` → 256. Square labels are implied, not hardcoded 1200.

---

## KEEP (must still expect the listed value)

### `src/components/coat-of-arms/SettingsPanel.test.tsx`

| test name | keep expected | why |
| --- | --- | --- |
| `applies the 3:5 canvas preset and persists that browser-local preference` | canvas `{ width: 1800, height: 1080 }`, stored `canvasPreset: '3-5'` | user **clicks** 3:5 |
| `applies the 2:3 canvas preset` | `{ width: 1620, height: 1080 }` | user clicks 2:3 |
| `marks the 3:5 canvas preset as pressed after it is applied` | `aria-pressed=true` on 3:5 | user clicks 3:5 |
| `does not overwrite an interleaved JPEG quality change while saving a canvas preset` | fixture `canvasPreset: 'square'` in saved prefs | stored document, not default project canvas |

After default is already 1800×1080, the 3:5 click tests still pass (no-op apply). They do **not** prove the click changed size. Do not weaken them to “default without click.”

### `src/components/coat-of-arms/ColorBackgroundPanel.test.tsx`

| test name | keep expected | why |
| --- | --- | --- |
| `applies a canvas size preset from the Background panel` | canvas `{ width: 1800, height: 1080 }`, `canvasPreset: '3-5'` | **applies** select value `'3-5'`; not the factory default |
| `adds a restored custom swatch to a fresh project once without a duplicate error` | saved `canvasPreset: 'square'` | stored prefs fixture |

### `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`

| test name | keep expected | why |
| --- | --- | --- |
| `uses the 3:5 canvas preset dimensions for both canvas geometry and serialized SVG` | `--coat-canvas-aspect-ratio: 1800 / 1080` and `width="1800" height="1080"` | **clicks** Settings → 3:5 before asserting |
| `uses the homepage editor visual tokens without recolouring the output artboard` | artboard `background: #fff` | color, not size |
| `uses the exact desktop editor geometry and preserves the mobile drawer contract` | chrome 99 / 50 / 40 | do not change |
| JPEG / appearance fixtures with `canvasPreset: 'square'` | keep `'square'` | stored prefs, not factory canvas |

There is **no** CoatOfArmsMaker assertion of default (no-click) `--coat-canvas-aspect-ratio: 1200 / 1200` or `width="1200"`. See Misses.

### `src/lib/coat-of-arms/editor-preferences.test.ts`

| test name | keep expected | why |
| --- | --- | --- |
| `matches a competitor canvas preset by exact width and height` | `(1800, 1080) → '3-5'` | preset table |
| `matches a competitor canvas preset by exact width and height` | `(1200, 1200) → 'custom'` | **1200×1200 is not a named preset** (square is 1080×1080). Still true after the default change |
| v0 migrate / v1 field migrate / save-reject fixtures using `canvasPreset: 'square'` | keep `'square'` | explicit stored documents / v0 migration **hardcodes** `'square'` in `migrateVersionZeroEditorPreferences` |

If empty-storage default `canvasPreset` is changed to `'3-5'`, there is **no** current test of `loadEditorPreferences()` on empty `localStorage` that would fail. Only SettingsPanel reset would fail (see MUST CHANGE).

### `src/lib/coat-of-arms/export.test.ts` (non-default canvas)

| test name | keep expected | why |
| --- | --- | --- |
| `maps Instagram 1080×1920 at 1024 to 576×1024` | `{ width: 576, height: 1024 }` | overrides canvas to 1080×1920 |
| `scales raster, PDF, and print output from the project canvas aspect ratio` | 576×1024 canvases / jsPDF / print | same override |
| `rejects an unknown export size with the received value` | throw `'1080'` | 1080 is an invalid **export size**, not canvas height |
| `closes an already-open popup when scene validation fails` | `canvas: { width: Number.NaN, height: 1200 }` | invalid fixture; 1200 is the surviving valid edge, not the default |

### `src/lib/coat-of-arms/commands.test.ts`

| test name | keep expected | why |
| --- | --- | --- |
| `changes the local canvas dimensions through a validated dedicated command` | `{ width: 1600, height: 900 }`; throw `'4097'` | explicit `set-canvas-size`, not default |

### `src/components/coat-of-arms/CoatOfArmsPanels.test.tsx`

| test name | keep expected | why |
| --- | --- | --- |
| `applies local canvas dimensions through the settings panel` | `{ width: 1600, height: 900 }` | user types Width/Height and Apply |

### Clicking 1:1 / Switzerland — **no such test exists**

Pattern searched: `Switzerland`, `1:1 (Switzerland`, `getByRole('button', { name: '1:1` in `**/*.{test,spec}.{ts,tsx}`.

If someone adds “user clicks 1:1”, the canvas must be **`{ width: 1080, height: 1080 }`**, **not** 1200×1200. The Switzerland preset is `square` at 1080×1080.

---

## Geometry fixture (will not fail by itself; baked square aspect)

### `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`

Helper `desktopArtboardFillDocument` (line 189) hardcodes:

```html
--coat-canvas-aspect-ratio: 1
```

Used by:

| test name | current expected | if fixture is updated to default 1800/1080 |
| --- | --- | --- |
| `fills the wrap at 1512x738 and leaves no 108px blank at 1512x500 or 1512x600` | `artboardHeight > 540` at 738; `heightGap < 2` at 738/600/500 | **will fail at 1512×738** unless CSS/wrap also changes |

This helper is **not** wired to `createDefaultProject`. Changing factory canvas does not fail the test. The baked `1` is the square-default aspect.

If the fill test is meant to represent the **default** canvas, change the fixture to `1800 / 1080`. Then at wrap `800×549` (1512×738):

- `width = min(800, 549 × 1800/1080) = 800`
- `height = 800 × 1080/1800 = 480`
- `heightGap ≈ 69`

So `artboardHeight > 540` and `heightGap < 2` at 738 become wrong. 600/500 wraps (`800×419`) stay height-limited (`heightGap ≈ 0`).

Related CSS-only tests (`uses the project canvas aspect ratio for the artboard and interaction canvas`, `keeps the default artboard within a short desktop scene viewport`) assert `var(--coat-canvas-aspect-ratio)`, not 1:1. Keep.

---

## Misses (pattern searched, no test name)

Fail Fast: these factories/behaviors have **no assertion** of default canvas size.

| path | pattern | result |
| --- | --- | --- |
| `src/lib/coat-of-arms/assets.test.ts` | `createInitialCoatProject` | **not imported**. `createInitialCoatProject` is only used in `store.ts` initial history. Canvas is only covered indirectly via `createProjectWithIds` / `createDefaultProject`. |
| `src/lib/coat-of-arms/assets.test.ts` | `createCoatMakerShowcaseProject` + `project.canvas` | test **`creates the target editor showcase with local bundled layers` exists** but asserts layers only, not canvas. |
| `src/lib/coat-of-arms/store.test.ts` | `createInitialCoatProject` or `project.canvas` | no canvas assertion. Store tests use `createDefaultProject`. |
| `src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx` | `width="1200"` / `1800` / `canvas` | SSR markup will change with `createInitialCoatProject`, but **no dimension assertion**. |
| `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx` | default (no Settings click) `--coat-canvas-aspect-ratio: 1200 / 1200` or `width="1200"` | **no match**. Only the 3:5 **click** test asserts 1800/1080. |
| `src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx` | `project.canvas` / `1200` | uses `createDefaultProject` then mocks client rect `{ width: 100, height: 110 }`. SVG will become `width="1800" height="1080"` with no assertion. |
| `src/components/coat-of-arms/ColorBackgroundPanel.test.tsx` | default Canvas Size select / `1200×1200` custom option | **no match**. Today 1200×1200 shows custom option; after change the select matches `'3-5'` with no custom option. Unasserted. |
| `src/lib/coat-of-arms/editor-preferences.test.ts` | `getDefaultEditorPreferences` / empty `localStorage` default `canvasPreset` | **no match**. Empty-storage default is untested. |
| `**/*.{test,spec}.{ts,tsx}` | `Switzerland` / click `1:1` | **no match**. |

`createDefaultProject` is used as a **fixture seed** in many other tests (`commands.test.ts`, `scene-svg.test.ts`, `project-storage.test.ts`, `store.test.ts`, `drawing-opacity.test.ts`, `shield-outline.test.ts`, canvas/panels tests). Those tests do not assert `project.canvas` and pass explicit render sizes (e.g. scene SVG `{ width: 512, height: 512 }`). They will not fail solely from the default size change.

---

## Out of scope (1200 is not coat-canvas default)

Do not retarget these to 1800×1080:

- Site OG / social cards `1200×630` (`src/lib/share/*`, `home-work-gallery*`, `site-og-image.tsx`, `site-metadata.ts`).
- Blog SVG `width="1200"` / paladin `1200×1200` article images.
- Token editor `src/components/editor/Canvas.test.tsx` `canvas: { width: 512, height: 512 }`.
- Dice timer `1200` ms.
- `tmp/layout-height-ours-recon.md` comment `本页 1200/1200 → 1:1` (recon note, not a test).

---

## Implementer notes

1. One production write: `createProjectWithIds` canvas `{ width: 1800, height: 1080 }` covers default / showcase / initial / randomize (`assembleRandomCoatProject` starts from `createDefaultProject`).
2. If Reset editor and Background “Canvas Size” should show **3:5** as the default match, also set `defaultEditorPreferences.canvasPreset` to `'3-5'`. Leave v0 migration hardcoding `'square'`.
3. Do not add a 1200×1200 named preset. 1:1 click stays 1080×1080.
4. Do not change chrome 99/50/40 or artboard `#fff`.
5. After default is 1800×1080, add (optional, currently missing) a no-click CoatOfArmsMaker assertion: `--coat-canvas-aspect-ratio: 1800 / 1080` and `width="1800" height="1080"`.
