# Nested sidebar hover — after visual verify

Date: 2026-08-22  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost only)  
Viewport: 1512×738 CSS px, `devicePixelRatio 2`, `html.dark`, `data-appearance="dark"`  
Method: ego-browser real mouse `hover` + `getComputedStyle` + PNG pixel sample  
Spec: `tmp/sidebar-hover-spec.md`  
Shot: `tmp/sidebar-hover-ours-after.png` (full viewport, Ordinaries hovered)  
Rail crop: `tmp/sidebar-hover-ours-after-rail.png`  
Read-only `src`. No commit. No fix.

## Verdict: PASS

Nested hover is a solid slightly-lighter dark rounded rect. No gold/bronze glow, no `box-shadow` halo. Background RGB matches competitor `#5a5a5a` exactly. Parent top-level hover was not gold-washed.

## Nested hover vs spec

| token | competitor spec | ours (Ordinaries, `aria-pressed=false`, `:hover`) | match |
|---|---|---|---|
| tree / rail bg | `rgb(71, 71, 71)` `#474747` | `rgb(71, 71, 71)` | exact |
| hover background-color | `rgb(90, 90, 90)` `#5a5a5a` | `rgb(90, 90, 90)` | exact |
| background-image | `none` | `none` | exact |
| box-shadow | `none` | `none` | exact |
| filter | `none` | `none` | exact |
| border-radius | `3.1875px` (`0.1875rem` @ 17px root) | `3px` (`0.1875rem` @ 16px root) | rem-same; CSS-px rounding |
| color (computed RGB) | `rgb(243, 240, 235)` | `rgb(245, 241, 234)` from `lab(95.3978 0.346065 3.80774)` | Δ(2,1,1); not gold |
| height | `29.75px` (1.75rem @ 17px) | `28px` (1.75rem @ 16px) | rem-same |
| padding-inline | `8.5px` | `8px` | rem-same |
| font-size | `14.875px` | `14px` | rem-same |
| font-weight | `400` | `400` | exact |

Lighter than tree: 90 − 71 = **+19** on each channel.

## Animals (selected nested)

`aria-pressed="true"`. Rest and hover both `background-color: rgb(90, 90, 90)`, `box-shadow: none`, `filter: none`, `border-radius: 3px`. No bronze/gold wash (previously `rgba(86, 76, 57, 0.26)` via `--coat-active`).

## Top-level (parent not gold-washed)

| item | state | background-color | box-shadow / filter |
|---|---|---|---|
| Custom | hover | `rgb(90, 90, 90)` | none / none |
| Top | hover | `rgb(90, 90, 90)` | none / none |
| Charges (selected + expanded) | hover | `rgba(0, 0, 0, 0)` (expanded override `background: none`) | none / none |

No gold/bronze on parent.

## Pixel sample (PNG 1512×738 = 1 CSS px / image px)

Ordinaries row CSS rect ≈ `(11, 644, 143×28)`:

- Fill inside row: **3506 px `rgb(90, 90, 90)`**
- Tree above / below / left of row: `rgb(71, 71, 71)`
- Animals selected guess sample: `rgb(90, 90, 90)`
- Gold halo pixels in 8px ring around row: **0**
- Warmest R−B in that ring: **9** on text antialias `rgb(231, 228, 222)`, sat 0.039

Live stylesheet rule:

`.coat-target-workbench .coat-target-tool-tree-branch button:hover, .coat-target-workbench .coat-target-tool-tree-branch button[aria-pressed="true"] { background: rgb(90, 90, 90); }`
