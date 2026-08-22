# Placement scale recon (read-only)

Date: 2026-08-22  
Repo: `/Users/wusir/Desktop/开发项目集合/token-maker-app`  
Ours: `http://localhost:3000/coat-of-arms-maker` (localhost only). Draft overlay: **absent** (`.coat-workbench-content` has no `inert`, no `.coat-target-draft`).  
Competitor: `https://coamaker.com/` coat editor. Ads hidden only to click library tiles; no ad/paywall/copy taken.  
No edits under `src/`, tests, `package.json`, or git.

Screenshots:

- `tmp/recon-scale-coamaker.png` — competitor default-sized gold heater on white artboard
- `tmp/recon-scale-coamaker-lion.png` — competitor after placing library lions
- `tmp/recon-scale-ours.png` — our showcase gold heater on current 1200×1200 square
- `tmp/recon-scale-ours-new-charge.png` — our newly placed Wolf Rampant at `transform.scale = 1` filling the square

---

## Recommended numbers (for 1800×1080)

| Token | Value | Why |
|---|---:|---|
| **defaultShieldScale** | **0.935** | Match competitor heater **height** on the same 5:3 landscape |
| **newlyPlacedLibraryAssetScale** | **0.6** | Match competitor new-charge **max side** = 60% of canvas height |

They are **not** the same. Competitor shields are ~90% of canvas height; new library charges are ~60% of canvas height (longer side capped). Using 0.6 for the default shield would make it ~58% of canvas height, much smaller than the competitor heater.

Both are finite, `> 0`, and `< 1`.

### Pixel math (do not round away the inputs)

Competitor live store (fabric/editor, zoom-independent):

```
canvasW = 1665
canvasH = 999          // 1665/999 = 5/3, same aspect as 1800/1080
shieldW = 736.0876897133221
shieldH = 900
lionW   = 471.42857142857144
lionH   = 600
batW    = 600
batH    = 407.68
```

Competitor % of white canvas:

```
shield width  = 736.0876897133221 / 1665 = 0.4420935073365304  → 44.21%
shield height = 900 / 999               = 0.9009009009009009  → 90.09%

lion  width   = 471.42857142857144 / 1665 = 0.2831402831402831 → 28.31%
lion  height  = 600 / 999                 = 0.6006006006006006 → 60.06%

bat   width   = 600 / 1665 = 0.36036036036036034 → 36.04%
bat   height  = 407.68 / 999 = 0.4080880880880881 → 40.81%
```

Lion is portrait; Bat is landscape. Both have `max(width, height) = 600`.

```
newAssetMaxSide / canvasH = 600 / 999 = 0.6006006006006006
```

Our scene is `viewBox="0 0 100 110"` with `preserveAspectRatio="xMidYMid meet"`. After canvas becomes **1800×1080**:

```
pixelPerSceneUnit = min(1800/100, 1080/110) = min(18, 9.818181...) = 1080/110
                 = 9.818181818181818
```

Heater path `M50 2 L94 16 … C24 94 6 80 6 58 V16 Z` bbox (measured via `path.getBBox()` on the live SVG):

```
heaterNativeW = 88
heaterNativeH = 106
```

At `transform.scale = 1` on 1800×1080:

```
heaterPxW = 88  * (1080/110) = 864
heaterPxH = 106 * (1080/110) = 1040.727272...
heaterW%  = 864 / 1800 = 0.48            → 48.00% of canvas width
heaterH%  = 1040.727... / 1080 = 106/110 → 96.36% of canvas height
```

Library raster charges are `<image x="0" y="0" width="100" height="110" preserveAspectRatio="xMidYMid meet"/>`. Live measure after clicking **Add charge: Wolf Rampant**: SVG transform `scale(1)`, image client box **100% of canvas height** and **90.91% of canvas width** on the current square (`100/110` of the letterboxed scene). On 1800×1080 that same scale-1 box is:

```
chargeH%_at_1 = 110/110 = 1.0             → 100% of canvas height
chargeW%_at_1 = 100 * (1080/110) / 1800   → 54.55% of canvas width
```

**defaultShieldScale** (match competitor heater height):

```
0.9009009009009009 / (106/110)
= 0.9009009009009009 / 0.9636363636363636
= 0.9349031986531986
→ recommend 0.935
```

Check width at 0.935:

```
0.935 * 48.00% = 44.88%   vs competitor 44.21%
0.935 * 96.36% = 90.10%   vs competitor 90.09%
```

**newlyPlacedLibraryAssetScale** (match competitor new-charge max side = 60.06% of canvas height):

```
0.6006006006006006 / 1.0 = 0.6006006006006006
→ recommend 0.6
```

At 0.6 on 1800×1080 a portrait raster charge is 60% of canvas height and 32.73% of canvas width. Competitor portrait lion is 60.06% × 28.31%. The extra width is our 100×110 image **element** box, not the opaque pixels; we cannot match both axes with one uniform `transform.scale`. Height is the axis the user called unfriendly.

This 0.6 is the same numeric value as existing `RANDOM_CHARGE_SCALE`. Random coat **sets** scale to 0.6 after `add-layer`; it does not multiply. Leave `RANDOM_CHARGE_SCALE` unchanged.

---

## Competitor measurements (source)

Method: ego-browser, `store.width/height` and `store.children[]` on the fabric React fiber (same numbers as Arrange X/Y/Width/Height). Pixel scan of `canvas.lower-canvas` agreed on the white artboard aspect (exact-white bbox 1648×988 backing at dpr=2 ≈ 5:3). Zoom control showed `50%`; Arrange numbers are document pixels, not zoomed CSS.

Default empty canvas was white-on-white (no visible shield). First library place of **Undivided** (gold heater under Shields → Shield) produced the size above. That is the competitor default **placement** size.

Settings panel copy still says “default proportions (1080 × 1080 px)” and the Width/Height inputs were empty. **Live canvas is not that square.** Live store is **1665×999** landscape 5:3. Do not use the 1080×1080 settings blurb as the measurement.

White canvas = `store` `{ width: 1665, height: 999, background: "white" }`. Beige around it is editor chrome, not the artboard.

---

## Ours measurements (current 1200×1200, before canvas change)

Artboard `.coat-target-artboard` 567×567 CSS, inner `.coat-canvas` / SVG 565×565, `viewBox 0 0 100 110`, `width/height` attrs 1200, `--coat-canvas-aspect-ratio: 1200 / 1200`.

| Object | transform.scale | % of white canvas W | % of white canvas H | how |
|---|---:|---:|---:|---|
| Showcase gold heater (outline path) | 1 | **80.00%** | **96.36%** | path client 452×544.45 in 565×565; bbox 88×106 |
| Showcase dragon | 0.75 | 68.18% | 75.00% | hardcoded in `createShowcaseLayers` |
| Showcase wolf | 0.72 | 65.45% | 72.00% | hardcoded in `createShowcaseLayers` |
| Newly placed Wolf Rampant | **1** | **90.91%** | **100%** | full 100×110 image box; SVG `scale(1)` |

On a square this is the “fills the canvas” complaint. After the canvas becomes 1800×1080, scale 1 still fills **96% / 100% of height**; only the width % drops because of landscape letterboxing.

---

## Code paths that place a library asset at scale 1

Two identical helpers:

```ts
// src/lib/coat-of-arms/assets.ts:376
function createCenteredTransform(): CanvasTransform {
  return { x: 0, y: 0, scale: 1, rotation: 0 };
}

// src/lib/coat-of-arms/commands.ts:2144
function defaultTransform() {
  return { x: 0, y: 0, scale: 1, rotation: 0 };
}
```

| Path | File | What it does | MUST change? |
|---|---|---|---|
| **createDefaultProject** → `createProjectWithIds` | `assets.ts:260-358` | Default shield `heater-shield` uses `createCenteredTransform()` **scale 1**. Canvas still `{ width: 1200, height: 1200 }` here (canvas change is a separate task). | **YES — default shield** |
| **createShowcaseLayers** / **createCoatMakerShowcaseProject** / **createInitialCoatProject** | `assets.ts:273-320` | Copies that default shield (scale 1). Dragon `0.75`, wolf `0.72` — not scale 1. Coat-maker route calls `initializeShowcaseProject` (`store.ts:174`, `CoatOfArmsMaker.tsx:208`). | **YES for the inherited default shield.** Do not retune dragon/wolf unless asked. |
| **add-layer** → `addAssetLayer` → `createAssetLayer` | `commands.ts:161-162, 457-465, 1074-1114` | Every new shield / ordinary / charge / top gets `transform: defaultTransform()` **scale 1**. UI callers: `ChargeAndOrdinaryPanel.tsx:72`, `TopPanel.tsx:75`, `ShieldFieldPanel.tsx:65` (new escutcheon), `ColorBackgroundPanel.tsx:247` (background charge). | **YES — newly placed library assets** |
| **upload** → `addLocalUploadImages` → `addImageLayer` | `commands.ts:920-980` | Same `defaultTransform()` scale 1. Not a library asset. | **No** (unless someone changes `defaultTransform()` in place — then upload/draw/text would shrink too). Split the helper. |
| **random coat** → `createRandomCoatProject` / `assembleRandomCoatProject` | `commands.ts:302, 359-403` | Starts from `createDefaultProject` (shield scale 1), `add-layer` (charge scale 1), then **`update-layer` sets `scale: RANDOM_CHARGE_SCALE` (0.6)**. | Shield follows createDefaultProject (**YES**). Charge already ends at 0.6. **Do not change `RANDOM_CHARGE_SCALE`.** |
| **add-drawing-layer / add-text-layer** | `commands.ts:845-901` | Also `defaultTransform()` scale 1. Not library assets. | **No** |
| **ShieldFieldPanel `addChargeToEscutcheon`** | `ShieldFieldPanel.tsx:217-238` | `add-layer` then **overwrites** transform with `{ scale: 1, clipToField: true, ... }`. | **YES if field-embedded library charges should follow the new library scale** — this patch would undo an add-layer change. |
| Settings reset | `SettingsPanel.tsx:74-76` | `replaceProject(createDefaultProject(locale))` | Follows createDefaultProject (**YES** for default shield) |

Implementation note: introduce named constants (or pass scale into `createCenteredTransform` / `createAssetLayer`) rather than editing shared `defaultTransform()` used by upload/draw/text.

---

## What this recon did not change

- Did not edit `src/`, tests, `package.json`, git.
- Did not change `RANDOM_CHARGE_SCALE`.
- Did not implement 1800×1080 (user already decided that separately; Settings preset `3-5` is already `{ width: 1800, height: 1080 }` in `editor-preferences.ts`).
- Opaque-pixel bbox of our WebP wolf (inside the 100×110 image element) was not scanned; competitor Arrange size is the object box, which we matched via max-side = 60% of canvas height.
