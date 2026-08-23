# Visual verify: Custom panel A-scope

Date: 2026-08-22  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost only; never 127.0.0.1)  
HTTP: **200**  
Title: `Coat of Arms Maker — Free Online Heraldry Creator`  
Method: local ego-browser task space `visual custom field controls` (id 35)  
Viewport: **1512×738**  
Draft overlay: present on load (`coat-workbench-content[inert]`, `.coat-target-draft`). Clicked **Discard draft**. After that: `inert=false`, no draft node.  
Did not change `src/`, tests, `package.json`, or git. Did not open coamaker. Did not copy ads/paywall.

Wait: UI task `task_a8da93e04d1f` dispatch `ctx_8d69e6b95a9b` was already **completed** before this verify started.

---

## Result

| # | Check | Result |
|---|---|---|
| 1 | Custom tab: division icons look bright gold/red, not muddy brown | **PASS** |
| 2 | Per Bend: Bend Sinister appears and mirrors; Division Line Style; Wavy shows Frequency and Amplitude; canvas line is not a straight cut | **PASS** |
| 3 | Per Pale: Overall (on top) + Dexter (Left Side) + Sinister (Right Side); each side can pick a different variation; Keep pattern to field on those sides | **PASS** |
| 4 | Per Chevron: Edge Y / Point Y must not appear; Keep pattern to field must not appear | **PASS** |
| 5 | Settings Line Width / Show Border still work; no Upgrade Now in Custom uploads | **PASS** |
| 6 | Chrome still 99 / 50 / 40 | **PASS** |

Overall: **PASS** (6/6). No code changes.

---

## Screenshots

| File | What it shows |
|---|---|
| `tmp/visual-custom-01-custom-tab.png` | After Discard draft; Custom tab open (escutcheon shape grid first) |
| `tmp/visual-custom-02-division-icons.png` | Division of the Field icon grid: gold/red, not muddy brown |
| `tmp/visual-custom-03-per-bend.png` | Per Bend selected; Bend Sinister unchecked; Division Line Style Straight; diagonal split |
| `tmp/visual-custom-04-bend-sinister.png` | Bend Sinister checked; split mirrored |
| `tmp/visual-custom-05-wavy.png` | Wavy + Division line frequency 10 + amplitude 6; wavy canvas seam |
| `tmp/visual-custom-06-per-pale-accordions.png` | Per Pale; Overall (on top) + Dexter (Left Side) visible |
| `tmp/visual-custom-07-per-pale-dexter-barry.png` | Dexter Barry + Keep pattern to field; left side striped |
| `tmp/visual-custom-08-per-pale-sinister-chequy.png` | Sinister Chequy + Keep pattern to field; right side chequered |
| `tmp/visual-custom-09-per-chevron.png` | Per Chevron; Overall + Chief (Upper Section); no Edge Y / Point Y |
| `tmp/visual-custom-10-per-chevron-base.png` | Base (Chevron Section): Variation / Colors / Charges only; no Keep pattern |
| `tmp/visual-custom-11-line-width-20.png` | Settings Line Width 20px; thick navy border |
| `tmp/visual-custom-12-show-border-off.png` | Show Border unchecked; outline gone |
| `tmp/visual-custom-13-uploads.png` | Custom Shield Uploads + green Upload Shield; no Upgrade Now |
| `tmp/visual-custom-14-chrome.png` | Workbench `scrollTop=0`; chrome stack visible |

---

## 1. Division icons gold/red — PASS

Custom tab `#coat-tab-custom` selected. Inner scroller is `.coat-escutcheon-panel` (`scrollHeight` 1613, `clientHeight` 589).

Division buttons (`aria-label` Undivided / Per Pale / Per Fess / Per Bend / Per Chevron / Per Cross / Per Saltire) use SVG fills **`#F5E6A1`** (gold) and **`#B11F24`** (red). No brown fills on those SVGs.

Pixel sample of `tmp/visual-custom-02-division-icons.png` crop of the icon grid (1512×738 PNG):

- gold-like pixels: **9713**, average RGB `(242, 230, 168)` ≈ `#F2E6A8` (screenshot compression of `#F5E6A1`)
- bright-red pixels: **5698**, average RGB `(163, 47, 44)` ≈ `#A32F2C` (compression of `#B11F24`)
- muddy-brown pixels in that crop: **47** (anti-alias / chrome, not icon fills)

Visual: icons read as bright cream-gold and heraldic red, not muddy brown. Screenshot `tmp/visual-custom-02-division-icons.png`.

Note (out of this check): the **escutcheon shape** thumbs at the top of Custom (`idleEscutcheonFill` `#5b5347`) are still muddy brown. Checklist item 1 is the **division** icons.

---

## 2. Per Bend + Bend Sinister + Wavy — PASS

Clicked `button[aria-label="Per Bend"]` (`aria-pressed="true"`).

Controls that appeared:

- checkbox `aria-label="Bend Sinister"` (unchecked)
- select `aria-label="Division Line Style"` value `straight`, options include Straight / Wavy / Indented / …
- accordion labels: **Overall (on top)**, **Dexter (Upper Left)**, **Sinister (Lower Right)**

Canvas field path before sinister: `M100 0 H0 V110 Z` fill `#B11F24` over gold `#F6C700`. Screenshot `tmp/visual-custom-03-per-bend.png`: red upper-left, gold lower-right.

Checked Bend Sinister. Path became `M0 0 H100 V110 Z`. Accordion renamed to **Sinister (Upper Right)**. Screenshot `tmp/visual-custom-04-bend-sinister.png`: gold upper-left, red upper-right — split mirrored.

Set Division Line Style to **Wavy**. New fields:

- `input[aria-label="Division line frequency"]` type number, value **10** (min 1 max 30)
- `input[aria-label="Division line amplitude"]` type number, value **6** (min 1 max 20)

Canvas path gained `data-field-division-line-style="wavy"` `frequency="10"` `amplitude="6"` and a sampled polyline (`L101.386 107.065 L102.178 104.671 …`), not a two-point cut. Screenshot `tmp/visual-custom-05-wavy.png`: visible wavy seam.

---

## 3. Per Pale accordions + independent variations — PASS

Clicked Per Pale. Summaries in `#coat-panel-custom`:

1. Escutcheon
2. **Overall (on top)** — Charges / Add Charge only (no Keep pattern)
3. **Dexter (Left Side)** — Variation of the Field + **Keep pattern to field** (checked)
4. **Sinister (Right Side)** — Variation of the Field + **Keep pattern to field** (checked)

Keep-pattern inputs: **2**, both inside Dexter/Sinister, none inside Overall.

Picked **Barry** on Dexter (`data-field-region="dexter"` `data-field-region-pattern="barry"` `pattern-scale="1"`).  
Picked **Chequy** on Sinister (`data-field-region="sinister"` `data-field-region-pattern="checks"` `pattern-scale="1"`).  
Sinister second colour set to `#f6c700` so the chequy is visible (both colours had been `#b11f24`).

Screenshots:

- `tmp/visual-custom-06-per-pale-accordions.png` — Overall + Dexter headers
- `tmp/visual-custom-07-per-pale-dexter-barry.png` — Dexter Barry + Keep pattern to field; left horizontal bars
- `tmp/visual-custom-08-per-pale-sinister-chequy.png` — Sinister Chequy + Keep pattern to field; left bars + right chequy

---

## 4. Per Chevron out-of-scope controls absent — PASS

Clicked Per Chevron (`aria-pressed="true"`). Canvas field: gold rect + `M0 0 H100 L50 55 Z` red chevron chief.

Summaries:

- Overall (on top)
- **Chief (Upper Section)**
- **Base (Chevron Section)**

Full Custom panel `innerText` search:

- `Edge Y`: **false**
- `Point Y`: **false**
- `Keep pattern to field`: **false**
- `input[aria-label="Keep pattern to field"]` count: **0**

Chief/Base inner text is Variation / Colors / Charges only. Screenshots `tmp/visual-custom-09-per-chevron.png` and `tmp/visual-custom-10-per-chevron-base.png`.

---

## 5. Line Width / Show Border / no Upgrade Now — PASS

Settings in Custom panel: Line Width range `0–25` and Show Border checkbox.

| Step | Control | Canvas |
|---|---|---|
| Start | Line Width **9**, Show Border checked | outline `stroke="#1E293B"` `stroke-width="1.5"` |
| Set Line Width to **20** | label **20px** | `stroke-width="20"`; thick navy border (`tmp/visual-custom-11-line-width-20.png`) |
| Uncheck Show Border | `checked=false` | no `path[stroke]` outline; border gone (`tmp/visual-custom-12-show-border-off.png`) |

Custom Shield Uploads (`.coat-custom-shield-uploads`):

- Heading: **Custom Shield Uploads**
- Hint: **Upload your own shield outline**
- Control: green **Upload Shield** wrapping `input[type=file]` `aria-label="Upload custom shield mask"` accept png/jpeg/webp/svg
- Panel/page text: **Upgrade Now** = false; **upgrade** = false; paywall/premium/pro plan/subscribe = false

Screenshot `tmp/visual-custom-13-uploads.png`.

---

## 6. Chrome 99 / 50 / 40 — PASS

Did not measure competitor. After `document.querySelector('.coat-target-workbench').scrollTop = 0`:

| Band | Selector | top | height |
|---|---|---:|---:|
| Site topbar | `.coat-target-workbench > .site-topbar` | 0 | **99** (`height: 99px`) |
| Export action bar | `.coat-target-actionbar` | 99 | **50** |
| Canvas toolbar | `.coat-target-canvas-toolbar` | 149 | **40** |

Viewport `1512×738`. Stack 99+50+40 = 189. Screenshot `tmp/visual-custom-14-chrome.png`.

---

## Residual notes (not fails)

- Escutcheon **shape** thumbs in Custom remain muddy brown (`#5b5347`). Out of A-scope item 1 (division icons).
- Default Line Width label was 9px while the live outline was `stroke-width="1.5"` until the slider moved; after moving to 20 both matched. Changing the control still updates the canvas.
- First CSS click on Per Chevron hit a non-visible duplicate; coordinate click on the desktop Custom panel applied it. Product UI is present.

No `src/` edits. Localhost stayed up.
