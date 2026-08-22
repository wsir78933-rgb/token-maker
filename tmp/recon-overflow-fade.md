# Overflow fade recon

Date: 2026-08-22  
Read-only. Did not change `src/`, tests, `package.json`, or git.  
Ours: `http://localhost:3000/coat-of-arms-maker` (localhost, not 127.0.0.1)  
Competitor: `https://coamaker.com/` editor (`#coaroot`)  
Draft overlay: ours `coat-workbench-content` had **no** `inert`; no restore/discard dialog.  
Viewport: 1496×756, `devicePixelRatio = 2`.

Evidence:

- `tmp/overflow-coamaker.png` — charge/shield dragged across the white page; overflow is faded, in-page is opaque; handles + floating toolbar still solid
- `tmp/overflow-ours.png` — charge dragged across the white artboard; overflow is **clipped away**; selection box / handles / toolbar still draw off-canvas

Do not copy competitor ads, paywall, copy, or trademarks.

---

## 1. Competitor: overflow is a 50% beige veil, not layer opacity

### What you see

A layer that straddles the white page stays fully opaque **inside** the page. The part that hangs into the beige workspace looks semi-transparent. Selection handles and the floating toolbar on that overflow stay fully opaque.

### What it is not

Live Fabric object state (two images + page rect):

| Field | Overflowing image | Page rect |
|---|---|---|
| `opacity` | `1` | `1` |
| `clipPath` | `null` | `null` |
| `globalCompositeOperation` | `source-over` | `source-over` |
| `canvas.clipPath` | `null` | |
| CSS `mask` / `clip-path` on `.lower-canvas` / `.upper-canvas` | `none` | |

No SVG mask. No per-object opacity. The whole-layer `opacity` field in their store stays `1`.

### Technique

Fabric.js dual canvas (`canvas.lower-canvas` + `canvas.upper-canvas` inside `.canvas-container`).

1. The Fabric canvas **is the whole beige workspace**, not the white page. Measured: `1009×575` CSS px at `(466, 189)`, covering `.coa-workspace`. Background: `rgba(245, 240, 226, 0.9)`.
2. White page is a Fabric `rect` with `_isPageRect = true`, `left:0 top:0`, `originX/Y: left/top`, size = design `width×height` (here `1665×999`), `selectable: false`, `evented: false`, fill white.
3. Layers draw at full opacity on that canvas, including pixels outside the page rect.
4. `after:render` on the **lower** canvas paints a scrim in the four rectangles around the page:

```js
n.on(`after:render`, t => {
  if (n._isExporting) return;
  // ...
  r.fillStyle = `rgba(240, 236, 226, 0.5)`;
  c > 0 && r.fillRect(0, 0, d, c);                 // above page
  c + u < f && r.fillRect(0, c + u, d, f - c - u); // below page
  s > 0 && r.fillRect(0, c, s, u);                 // left of page
  s + l < d && r.fillRect(s + l, c, d - s - l, u); // right of page
  r.strokeStyle = `rgba(0, 0, 0, 0.15)`;
  r.lineWidth = 1;
  r.strokeRect(s, c, l, u);                        // page border
});
```

Source (minified Vite chunk, misleading name):  
`https://coamaker.com/wp-content/coamakerbasic/static-vite/v20260809-200439/assets/spinner-9Fuhn-TA.js`  
(page-rect setup + this listener). Store also tags the rect in `CoaMakerStore-BceC54en.js` (`_isPageRect`, skipped during `_isExporting` export).

`rgba(240, 236, 226, 0.5)` is `#f0ece2` at **alpha 0.5**. That matches our workspace beige (`.coat-target-scene { background: #f0ece2 }`).

Export skips the veil (`if (n._isExporting) return`), so overflow fade is editor-only.

### Numeric pixels (lower canvas `getImageData`)

Page right edge in CSS: `917` (zoom `0.4955`, `vpt[4]=92`).

| Sample | CSS x | RGB | A |
|---|---|---|---|
| In-page yellow (opaque layer) | 905–915 | `247, 199, 2` | 255 |
| Edge | 917 | `207, 186, 97` | 255 |
| Overflow yellow | 919–941 | `243, 218, 114` | 255 |
| Beige workspace (no layer) | 20, 20 | `242, 237, 226` | 243 |

Source-over of `rgba(240,236,226,0.5)` on opaque yellow `(247,199,2)`:

`0.5*(240,236,226) + 0.5*(247,199,2) = (243.5, 217.5, 114)` → measured `(243, 218, 114)`.

**Overflow opacity to implement: `0.5` as a beige veil (`rgba(240, 236, 226, 0.5)` / `#f0ece2` @ 50%), not `layer.transform.opacity`.**  
Equivalent look if overflow pixels are drawn at object alpha `0.5` over opaque `#f0ece2`.

### Selection UI off-canvas: yes, stays visible and usable

- Transform handles / selection box: drawn on **upper-canvas** (same size as lower). Veil is only on `contextContainer` (lower). Handles are not faded.
- Floating toolbar: HTML `.coa-quick-actions`, `position: absolute`, `z-index: 1001`, `pointer-events: auto`. Still fully opaque when the selection hangs off the page (see `tmp/overflow-coamaker.png`).
- Hit testing: overflowing objects stay `evented: true` with no clipPath, and the Fabric canvas covers the beige workspace, so you can grab the faded overflow.

Parent overflow: `.canvas-container` `overflow: visible`; workspace `.coa-workspace` `overflow: hidden` (clips at the beige stage, not at the white page).

---

## 2. Ours: overflow is clipped (invisible), not faded

Confirmed live computed styles and by dragging the showcase charge off the white artboard (`tmp/overflow-ours.png`): lion paws vanish at the artboard edge; they do not fade.

### Clip stack

| Node | File | Overflow |
|---|---|---|
| Inner scene wrapper | `CoatOfArmsCanvas.tsx:517` `<div className="absolute inset-0 overflow-hidden rounded-[inherit]">` wrapping `dangerouslySetInnerHTML={{ __html: sceneSvg }}` | **`hidden`** — this is the hard clip of layer pixels to the white artboard |
| Scene `<svg>` | `scene-svg.ts:48` (no `overflow` attr). Live computed `overflow: hidden` (SVG replaced-element default) | **`hidden`** |
| `.coat-canvas` | `CoatOfArmsCanvas.tsx:504` `overflow-visible` | `visible` |
| `.coat-target-artboard` | `globals.css:1592` | `visible` |
| `.coat-target-artboard-wrap` | `globals.css:1591` | `auto` |
| `.coat-target-scene` | `globals.css:1501` `overflow: hidden; background: #f0ece2` | `hidden` (workspace bounds) |

`renderCoatSceneSvg` uses `viewBox="0 0 100 110"` and per-layer `opacity` only from `transform.opacity` / group opacity (`scene-svg.ts` `renderTransformedLayer`). There is **no** outside-artboard fade.

Live: clip wrapper `565×565` at `(688, 190)`, same box as `.coat-canvas`. `mask: none`, `clip-path: none`.

### Selection UI off-canvas on ours today

Handles and toolbar are **siblings** of the clipped SVG wrapper, inside overflow-visible `.coat-canvas`:

- `CanvasSelectionHandles` (`z-20`, positioned from measured bounds)
- `CanvasSelectionToolbar` inside that overlay (`z-30`, `data-coat-editor-overlay="selection-toolbar"`)

`tmp/overflow-ours.png`: the blue box and east/south handles already paint on the beige wrap after the charge is clipped. Toolbar stayed solid.

Layer **pixels** cannot be grabbed off-canvas because they are not painted and because pointer handlers live on `.coat-canvas`, which **is** the white artboard (unlike competitor, whose Fabric canvas is the whole workspace).

---

## 3. Files / functions to change later

Primary:

1. **`src/components/coat-of-arms/CoatOfArmsCanvas.tsx`**  
   Line 517 wrapper is the clip. Keep handles/toolbar as siblings above the scene.
2. **`src/app/globals.css`**  
   `.coat-target-artboard .coat-canvas svg` (`:1595`) should allow `overflow: visible` on the faded pass.  
   `.coat-target-artboard-wrap` (`overflow: auto`) may grow scrollbars once SVG paints outside the artboard; scene `overflow: hidden` already matches competitor workspace clip.  
   Workspace beige is already `#f0ece2`.
3. **`src/lib/coat-of-arms/scene-svg.ts`** — only if the opaque/fade passes need `overflow="visible"` on the root SVG. **Do not** bake the fade into export (`export.ts` also calls `renderCoatSceneSvg`). Competitor skips the veil when `_isExporting`.

Related, probably unchanged:

- `CanvasSelectionHandles.tsx` / `CanvasSelectionToolbar.tsx` — already unclipped HTML overlay. Keep them above any veil.
- Do **not** fade via `transform.opacity` / `set-layer-ids-opacity` — that would fade the in-canvas pixels too.

Tests to extend when implementing: `CoatOfArmsCanvas.test.tsx` (wrapper class / overflow), any scene SVG snapshot that assumes clip.

### Simplest implementation (do not fade the whole layer)

Match the **look** (in-artboard alpha 1, overflow alpha 0.5 over `#f0ece2`) without a Fabric canvas.

**Recommended: two stacked scene copies in `CoatOfArmsCanvas`**

```tsx
{/* overflow only: same SVG, visible outside artboard, alpha 0.5 */}
<div className="pointer-events-none absolute inset-0 overflow-visible opacity-50" dangerouslySetInnerHTML={{ __html: sceneSvg }} />
{/* in-artboard: clipped, alpha 1 */}
<div className="absolute inset-0 overflow-hidden" dangerouslySetInnerHTML={{ __html: sceneSvg }} />
{/* existing handles + toolbar stay here, above both */}
```

Plus `svg { overflow: visible }` on the faded copy (inline style or a class). In-artboard pixels: top copy covers the 0.5 copy. Overflow pixels: only the 0.5 copy, composited on `#f0ece2` ≈ competitor veil.

Do not set `opacity` on the selected layer.

**Closer clone of their veil** (optional): keep layers at 1, paint `rgba(240, 236, 226, 0.5)` in the four strips around the artboard. That overlay has to sit **above layer pixels and below handles**. Handles are inside `.coat-canvas` (the artboard box), so a wrap-level veil either covers handles too or sits under overflowing SVG. Dual SVG avoids that stacking fight.

### Interaction note

Competitor hit-tests overflow because the canvas **is** the workspace. Ours `.coat-canvas` **is** the artboard: even after overflow is painted, `onPointerDown` on the artboard div will not see clicks on beige. `setPointerCapture` already keeps an in-progress drag. Starting a drag from the faded overflow (and clicking overflow) needs either:

- hit-testing on `.coat-target-scene` / wrap, or
- making the faded copy receive pointer events outside the artboard (`pointer-events-auto` on the 0.5 copy, `none` on empty beige)

Handles already overflow the artboard DOM box (`overflow: visible` on `.coat-canvas`) and should keep working if we do not put a veil above them.

Export must stay clipped/unfaded (competitor `_isExporting` skip).

---

## 4. Acceptance for a later implementer

- In-artboard layer pixels: visual alpha **1** (RGB unchanged).
- Off-artboard layer pixels: look like **0.5** over `#f0ece2` (`rgba(240, 236, 226, 0.5)` veil **or** equivalent object alpha 0.5 on beige).
- Do not fade the entire layer.
- Selection handles + floating toolbar remain fully opaque and clickable when the selection hangs off the artboard.
- Export / download does not include the fade.
