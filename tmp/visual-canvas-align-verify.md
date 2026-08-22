# Visual verify: canvas align (1800×1080, scale, overflow fade, chrome)

Date: 2026-08-22  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost only; HTTP 200)  
Method: local ego-browser task space `visual canvas align verify` (id 33)  
Draft overlay: present on load (`coat-workbench-content[inert]`, `.coat-target-draft`). Clicked **Discard draft** (localStorage only). After that: `inert=false`, no draft node.  
Did not change `src/`, tests, `package.json`, or git. Did not open coamaker. Did not copy ads/paywall.

Viewport used for checklist 1 and 4: **1512×738**, `devicePixelRatio=2`.

Screenshots:

- `tmp/visual-canvas-align-fresh.png` — after Discard draft, default gold heater on landscape white artboard
- `tmp/visual-canvas-align-place-charge.png` — library **Bear Rampant** just placed (`scale(0.6)`)
- `tmp/visual-canvas-align-overflow.png` — same bear dragged so it hangs off the white artboard; overflow faded; handles visible

---

## Result

| # | Check | Result |
|---|---|---|
| 1 | Fresh load: landscape ~1800/1080, beige stage, white artboard, gold shield smaller than canvas height | **PASS** |
| 2 | Place a library animal/charge at the smaller scale, not full-bleed | **PASS** |
| 3 | Drag charge off artboard: only the outside portion is semi-transparent; inside stays opaque; selection handles still usable | **PASS** |
| 4 | Desktop chrome still topbar 99 / actionbar 50 / toolbar 40 | **PASS** |

Overall: **PASS** (4/4). No code changes.

---

## 1. Fresh load — PASS

HTTP: `200` at `http://localhost:3000/coat-of-arms-maker`. Title: `Coat of Arms Maker — Free Online Heraldry Creator`.

After Discard draft:

| Token | Measured |
|---|---|
| SVG `width` / `height` | **1800** / **1080** |
| `.coat-target-artboard` `aspect-ratio` | **`1800 / 1080`** |
| Artboard CSS box | **855.56 × 514.13** (ratio 1.664 = 1800/1080) |
| Artboard background | `rgb(255, 255, 255)` = `#fff` |
| `.coat-target-scene` background | `rgb(240, 236, 226)` = `#f0ece2` |
| Scene | 1037 × 589 at (460, 149) |

Not square: CSS box is landscape, not 1:1. Design canvas is 1800×1080, not 1200×1200.

Default gold heater path client box **383.08 × 461.43** on canvas **853.56 × 512.13**:

- height = **90.1%** of canvas height (not full-bleed)
- width = **44.9%** of canvas width

Screenshot `tmp/visual-canvas-align-fresh.png`: white landscape page, beige workspace around it, gold shield with clear margin above and below.

---

## 2. Place library charge — PASS

Clicked Charges → Animals → **Add charge: Bear Rampant**.

New layer `bear-rampant.webp` transform:

```
translate(0 0) rotate(0 50 55) translate(50 55) scale(0.6) translate(-50 -55)
```

Client box **279.35 × 307.28** on canvas **853.56 × 512.13**:

| | px | % of canvas |
|---|---:|---:|
| width | 279.35 | **32.73%** |
| height | 307.28 | **60.00%** |

Not full-bleed. Matches intended newly-placed scale `0.6` (longest side 60% of canvas height). Showcase wolf/dragon stay at 0.72 / 0.75.

Screenshot `tmp/visual-canvas-align-place-charge.png`: selection box is a fraction of the landscape page.

---

## 3. Overflow fade + handles — PASS

Dragged the selected bear to the right until the image box hung **84.5px** past the artboard right edge (artboard right 1391.2, bear right 1475.7). Scene beige continues to 1481.

Live structure:

| Node | Style |
|---|---|
| `.coat-canvas-overflow-fade` | `opacity: 0.5`, `overflow: visible`, `pointer-events: none` |
| `[data-coat-scene-pass="artboard"]` | `overflow: hidden` |

Screenshot `tmp/visual-canvas-align-overflow.png`: inside the white page the bear is solid brown; the strip that crosses into beige is washed out; blue selection box and handles still draw, including east/NE/SE handles past the page edge.

Pixel samples from that PNG (CSS px, capture was 1:1 with the 1496×767 window at capture time; artboard right ≈ 1391):

| Sample | xy | RGB | Read |
|---|---|---|---|
| Inside bear (opaque) | 1360,500 | `(148, 115, 69)` | solid brown, not mixed with white |
| Inside bear | 1380,500 | `(149, 114, 69)` | same |
| Artboard edge | 1390,500 | `(173, 151, 117)` | transition |
| Overflow bear | 1394,384 | `(177, 162, 141)` | brown mixed with beige |
| Empty beige | 1450,360 | `(239, 235, 226)` | `#f0ece2` neighborhood |
| Empty white | 600,400 | `(255, 255, 255)` | artboard |

Grid search: **2452** opaque-brown pixels with x&lt;1390; **342** faded-brown pixels with x in **1392–1412** (the artwork that actually crosses the edge; the image element is larger than the opaque bear).

Expected 50% mix of `(150,115,70)` over `(240,236,226)` is ~(195,176,148). Overflow samples sit in that washed-brown band (outlines pull them darker). Inside samples stay at the unmixed brown, so the fade is **only** the outside portion.

Handles after the hang-off drag: **9** resize/rotate controls, `pointer-events: auto`. East / NE / SE were **outside** the artboard (`right` 1487.7 vs artboard 1391.2).

Handle use: dragged **Resize selected layer east** (center 1476,482 → 1426,482). Scale **0.6 → 0.5404**; box width **274.74 → 247.47**. Handles remained (still 9). So they are usable on the overflowing selection, not just painted.

A follow-up full-page `captureScreenshot` for a fourth “after resize” PNG timed out in CDP; overflow PNG + the scale change are the evidence. Did not treat that timeout as a product failure.

---

## 4. Desktop chrome 99 / 50 / 40 — PASS

At **1512×738** (fresh load, after Discard, and again after restoring that viewport):

| Chrome | Selector | height | y |
|---|---|---:|---:|
| topbar | `.site-topbar` | **99** | 0 |
| actionbar | `.coat-target-actionbar` | **50** | 99 |
| canvas toolbar | `.coat-target-canvas-toolbar` | **40** | 149 |

CSS: topbar `height/min-height: 99px`; actionbar `50px`; toolbar `40px`. Scene still `#f0ece2`. Artboard still `#fff`.

A later capture attempt shrank the window to 748×384 (not desktop); topbar there was 97.77px. Checklist asks for **desktop**. Restored 1512×738 and re-measured **99 / 50 / 40**.

---

## Notes / leftovers

- Default project is still the showcase (gold heater + dragon + wolf). Fresh-load check used that, then added Bear Rampant on top.
- Did not change code. Did not commit or push.
- No coamaker page was opened.
