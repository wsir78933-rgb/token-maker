# Visual verify: Per Pale + Wavy + left Barry

Date: 2026-08-22  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost only; never 127.0.0.1)  
HTTP: **200** (`curl` `time_total=0.118s`)  
Title: `Coat of Arms Maker — Free Online Heraldry Creator`  
Method: local ego-browser task space `visual division line regions` (id 36)  
Viewport: **1512×738**  
Draft overlay: present on load (`.coat-target-draft`, `.coat-workbench-content[inert]`). Clicked **Discard draft**. After that: `inert=false`, no draft node.  
Did not change `src/`, tests, `package.json`, or git. Did not commit.

Wait: panel task `task_b2abb2038bdf` dispatch `ctx_b05a0da75d6e` was already **completed** (`completed_at=2026-08-22 15:44:02`) before this verify started.

---

## Result

| # | Check | Result |
|---|---|---|
| 1 | Custom → Per Pale → Division Line Style Wavy: seam is wavy | **PASS** |
| 2 | Dexter (Left Side) → Barry: LEFT has barry, RIGHT stays other colour/pattern, seam is STILL wavy (not a straight cut) | **PASS** |
| 3 | Changing Frequency still keeps both sides' patterns | **PASS** |

Overall: **PASS** (3/3). No code changes.

---

## Screenshots

| File | What it shows |
|---|---|
| `tmp/visual-division-line-regions-01-wavy.png` | Per Pale + Wavy (frequency 10, amplitude 6). Vertical seam is a visible sine wave, not a straight cut. |
| `tmp/visual-division-line-regions-02-wavy-barry.png` | Dexter Barry selected. Left side horizontal bars; right side solid red; seam still wavy. |
| `tmp/visual-division-line-regions-03-frequency.png` | Frequency changed 10 → 4. Fewer/larger waves. Left still Barry, right still solid red. |

---

## 1. Per Pale + Wavy seam — PASS

Clicked Custom (`#coat-tab-custom` `aria-selected="true"`), then `button[aria-label="Per Pale"]` (`aria-pressed="true"`).

Set `select[aria-label="Division Line Style"]` to **wavy**. Controls that appeared:

- `input[aria-label="Division line frequency"]` value **10**
- `input[aria-label="Division line amplitude"]` value **6**

Live canvas (`svg[width="1800"]` inside `.overflow-hidden`) field markup (no region patterns yet):

- gold full-field rect `#F6C700`
- red path `data-field-division-line-style="wavy"` `frequency="10"` `amplitude="6"`
- path starts `M50 0 L47 0.917 L44.804 1.833 L44 2.75 …` and closes `L100 110 L100 0 Z`
- **not** the straight split `<rect width="50" height="110">` / `M0 0H50V110H0Z`

Screenshot `tmp/visual-division-line-regions-01-wavy.png`: gold left, red right, clearly wavy mid-line.

---

## 2. Dexter Barry keeps the wavy seam — PASS

Opened **Dexter (Left Side)** and clicked `button[aria-label="Barry"]` (`aria-pressed="true"`). Sinister variation stayed **None**.

Canvas after Barry:

| Region | pattern | line style | freq | amp | clip path end | L count |
|---|---|---|---:|---:|---|---:|
| dexter | **barry** | wavy | 10 | 6 | `L50 110 L0 110 L0 0 Z` (left half) | 122 |
| sinister | **solid** | wavy | 10 | 6 | `L50 110 L100 110 L100 0 Z` (right half) | 122 |

Division Line Style select still **wavy**. Straight-cut markers (`width="50"`, `M0 0H50V110H0Z`, `M50 0H100V110H50Z`) **absent**. Both region clips share the same wavy polyline (`M50 0 L47 0.917 …`), not a vertical `H50` cut.

Screenshot `tmp/visual-division-line-regions-02-wavy-barry.png`: left gold/red horizontal bars; right solid red; wavy join still visible through the charges.

---

## 3. Frequency change keeps both patterns — PASS

Changed `input[aria-label="Division line frequency"]` from **10** to **4**. Amplitude stayed 6. Style stayed Wavy.

| After | dexter | sinister |
|---|---|---|
| pattern | **barry** | **solid** |
| line style | wavy | wavy |
| frequency attr | **4** | **4** |
| L count on clip path | **50** (was 122) | **50** (was 122) |
| variation button | Barry pressed | None pressed |

Fewer `L` segments matches wavy `frequency * 12` (4×12=48 plus endpoints). Both sides’ patterns remained. Screenshot `tmp/visual-division-line-regions-03-frequency.png`: larger waves, left still Barry, right still solid red.

---

## Residual notes (not fails)

- Showcase charges (dragon / wolf) sit on top of the field and hide some of the mid-shield seam; the wave is still obvious at chief and base, and SVG path data is wavy in both regions.
- Frequency 4 vs 10 is a visible geometry change (122 → 50 polyline segments), not just a label change.

No `src/` edits. Localhost stayed up.
