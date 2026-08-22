# Ours: desktop tool-tree nested hover (measured)

Date: 2026-08-22  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost, not 127.0.0.1)  
Viewport: 1440×900, `html.dark`, workbench `data-appearance="dark"`, English copy  
Method: ego-browser real mouse hover + `getComputedStyle` + stylesheet `:hover` rule match  
Raw dump: `tmp/sidebar-hover-ours-raw.json`  
Shots: `tmp/sidebar-hover-ours-rest.png`, `tmp/sidebar-hover-ours-animals.png`, `tmp/sidebar-hover-ours-ordinaries.png`

Setup note: a local “Draft available” overlay had `coat-workbench-content[inert]`. Discarded in the browser (localStorage only, no repo change) so hover could hit the desktop rail.

---

## Verdict

Nested unselected hover is **not** `#5a5a5a` and **not** gold. It is a **darker** fill than the tree.

| Target | State | Computed `background-color` | Visual on tree `#474747` / `rgb(71,71,71)` |
|---|---|---|---|
| Top-level tab (`#coat-tab-custom`) | hover | `rgb(90, 90, 90)` = `#5a5a5a` | lighter gray lift |
| Nested **Ordinaries** (`aria-pressed="false"`) | rest | `rgba(0, 0, 0, 0)` | tree `rgb(71, 71, 71)` |
| Nested **Ordinaries** | hover | `rgb(30, 33, 39)` = `#1e2127` | **darker** navy/charcoal sink |
| Nested **Animals** (`aria-pressed="true"`) | rest | `oklab(0.421806 0.00257813 0.032105 / 0.262118)` → `rgba(86, 76, 57, 0.2621)` | composited `rgb(75, 72, 67)` warm bronze wash |
| Nested **Animals** | hover | **same as rest** | pressed rule wins; hover does not change fill |

Shared (all of the above, rest and hover):

| Property | Computed |
|---|---|
| `box-shadow` | `none` |
| `border` | `0` / none |
| `transform` | `none` |
| `filter` | `none` |
| `opacity` | `1` |
| `transition-duration` | `0s` (`transition-property: all`, no animation) |
| `getAnimations()` | `[]` |
| nested `font-size` | `14px` |
| nested `font-weight` | `400` |
| nested `padding` | `0px 8px` |
| nested rest `border-radius` | `6px` (`0.375rem`); selected Animals `8px` (`0.5rem`) |
| nested `color` | `lab(95.3978 0.346065 3.80774)` (`--coat-text`) |

---

## Which CSS variables resolved

Workbench tokens (dark appearance, `.dark` root):

| Variable | Specified | Probe / hover resolved |
|---|---|---|
| `--coat-panel-raised` | `color-mix(in oklab, var(--accent) 82%, var(--card))` | `oklab(0.247399 -0.00167258 -0.0118769)` = **`rgb(30, 33, 39)`** |
| `--accent` | `.dark` `oklch(0.26 0.012 262)` → `lab(14.1086% -.351101 -4.44042)` | **not gold** — dark cool gray |
| `--card` | `.dark` `oklch(0.19 0.012 262)` → `lab(6.1494% -.24014 -4.13035)` | near-black |
| `--coat-active` | `color-mix(in oklab, var(--site-accent-bg) 84%, var(--card))` | `oklab(0.421806 0.00257813 0.032105 / 0.262118)` = **`rgba(86, 76, 57, 0.2621)`** |
| `--site-accent-bg` / `--coat-accent-bg` | `#d7b46a1f` | **`rgba(215, 180, 106, 0.12)` gold** |
| `--coat-accent` | `#f1d492` | `rgb(241, 212, 146)` |
| tree background (literal) | `#474747` | `rgb(71, 71, 71)` |

Source cascade in `src/app/globals.css`:

```css
/* ~1341 — workbench token. Used by many chrome surfaces. Do not retune globally. */
.coat-target-workbench {
  --coat-panel-raised: color-mix(in oklab, var(--accent) 82%, var(--card));
  --coat-active: color-mix(in oklab, var(--site-accent-bg) 84%, var(--card));
}

/* ~1431 — top-level already correct */
.coat-target-workbench .coat-target-tool-tree-node > button:hover,
.coat-target-workbench .coat-target-tool-tree-node > button[aria-selected='true'] { background: #5a5a5a; }

/* ~1445 — nested hover. This is the mismatch. */
.coat-target-workbench .coat-target-tool-tree-branch button:hover { background: var(--coat-panel-raised); }

/* ~1446 — selected nested item. Wins over :hover. Test-locked. */
.coat-target-workbench .coat-target-tool-tree-branch button[aria-pressed='true'] {
  margin-right: 0.4rem; border-radius: 0.5rem; background: var(--coat-active);
}
```

Matched `:hover` rules in the live stylesheet (`src_app_globals_162hn9o.css`):

- Nested branch: `.coat-target-workbench .coat-target-tool-tree-branch button:hover` → `background: var(--coat-panel-raised)`
- Top-level tab: `.coat-target-workbench .coat-target-tool-tree-node > button:hover` → `background: rgb(90, 90, 90)`

Markup: `src/components/coat-of-arms/ReferenceToolRail.tsx` — branch children are `<button>` inside `.coat-target-tool-tree-branch`. No extra class. CSS-only fix is enough.

Coordinator note: `--accent` is gold only on the **light** `:root`. This page is `.dark` + `data-appearance="dark"`, so `--coat-panel-raised` is a dark mix, not bronze. The warm wash on **Animals** is selected `--coat-active` (gold `--site-accent-bg`), not the nested hover rule.

---

## What implementers must touch

1. **`src/app/globals.css` ~1445 only**  
   Change nested hover off `--coat-panel-raised`. To match top-level, use `#5a5a5a` / `rgb(90, 90, 90)` on  
   `.coat-target-workbench .coat-target-tool-tree-branch button:hover`.  
   Keep `[aria-pressed='true']` on `--coat-active` (rule at ~1446 is more specific in source order and currently wins).

2. **`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`**  
   Tests already string-lock nearby CSS. There is **no** lock today on `tool-tree-branch button:hover`. After the CSS change, add one `toContain(...)` for the new hover declaration (same style as the pressed lock around line 490).  
   Do not weaken the existing pressed lock:

   `.coat-target-workbench .coat-target-tool-tree-branch button[aria-pressed='true'] { margin-right: 0.4rem; border-radius: 0.5rem; background: var(--coat-active); }`

3. **`ReferenceToolRail.tsx`** — no markup change required.

Watch: the desktop hover selector is not scoped to `lg`. Mobile drawer branch buttons (`globals.css` ~2088–2089) inherit it. If mobile should stay different, add a mobile override in the same file; do not leave that accidental.

---

## What NOT to change

- **`--coat-panel-raised` token** (`.coat-target-workbench` ~1341 and light override `#ffffff` at ~1363). Collapse, export, multi-select, settings fields, colour chips, shield/token grid rest fills, and more all use it.
- **Gallery cards**: `.coat-gallery-card` / `.coat-gallery-card-name` hover nameplate; compact gallery / shield-grid hover (`background: var(--coat-active)` at ~1601–1606).
- **Top-level tree hover `#5a5a5a`** (~1431–1433) and Tokens nav hover.
- **Selected nested `--coat-active`** (~1446) unless product explicitly wants selected hover to also go gray.
- **Cloudflare cache rules**, Vercel headers, or any non-CSS chrome.
- **Custom-shield uploads `background: #5a5a5a`** (~1758) — different surface.
- Other `--coat-panel-raised` className usages in `SettingsPanel.tsx`, `ShieldFieldPanel.tsx`, `TextSelectionToolbar.tsx`, `TextMottoPanel.tsx`.

---

## Screenshot checklist

- `tmp/sidebar-hover-ours-rest.png` — Charges open; Animals selected (bronze wash); Ordinaries idle; pointer off the tree.
- `tmp/sidebar-hover-ours-animals.png` — pointer on Animals; fill unchanged vs rest (pressed wins).
- `tmp/sidebar-hover-ours-ordinaries.png` — pointer on Ordinaries; row is visibly **darker** than the `#474747` tree, not `#5a5a5a`.
