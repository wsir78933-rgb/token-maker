# Visual verify: Names align + upload compress

Date: 2026-08-23  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost only; HTTP 200; not 127.0.0.1)  
Method: ego-browser task space `visual names compress verify` (id 38)  
Did not change `src/`. Did not commit.

Screenshot: `tmp/visual-names-align.png`

Viewport: **1512×738**.

---

## Checklist

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Discard draft / overlay gone (`inert` not blocking workbench) | **PASS** | On load: status “Draft available”, buttons Restore/Discard. Clicked **Discard draft**. After: `inert=false`, no draft status/buttons. |
| 2 | Tools → Names: no project identity block | **PASS** | Panel text has no “Generated project name / Generated motto / Use project name / Add generated motto / Generate identity”. Only h2 Names + type/language + Generate. |
| 3 | Before generate, name list empty; Generate shows 5 cards + copy | **PASS** | Before: `ol[aria-label="Generated names"]` items=0. After Generate City Names: **5** cards. Each has copy `aria-label="Copy name …"`. |
| 4 | Copy → Saved Names | **PASS** | Clicked copy on Raven Harbor. Status: “Copied Raven Harbor”. Heading **Saved Names**, chip “Raven Harbor” + × (`Remove saved name Raven Harbor`). |
| 5 | × deletes saved name | **PASS** | After ×: `.coat-target-name-saved` gone, “Saved Names” not in panel text, 5 generated cards remain. |
| 6 | Screenshot `tmp/visual-names-align.png` | **PASS** | 183096 bytes. Shows two dropdowns (City / English), red Generate (content-width, left), 5 outline cards with clipboard, Saved Names chip. No identity block. |
| 7 | Chrome still 99 / 50 / 40 | **PASS** | `.site-topbar` **99px** y=0; `.coat-target-actionbar` **50px** y=99; `.coat-target-canvas-toolbar` **40px** y=149. |
| 8 | Upload PNG >256KB compresses and canvas still draws | **PASS** | Constructed `/tmp/oversized-coat-upload.png` **2 431 153 bytes**. Charges → Upload → Upload crest image. Status: `Compressed oversized upload oversized-coat-upload.png from 2431153 to 23492 bytes.` No alert. SVG still `1800×1080`. Clicked **Add local image 1**: canvas image nodes 3→4, new `data:image/png` layer present. |

Overall: **PASS** (8/8). No code changes.

---

## Names vs competitor structure (copy not cloned)

| Structure | Competitor | Ours (measured) | Notes |
|---|---|---|---|
| Visible type/language labels | none | none (`aria-label` only) | PASS |
| Two dropdowns on one row | type flex-1 ~192×34, language ~62px EN/DE | type **163.6×36.9**, language **90.7×36.9**, options **English / German** | Language wider because we keep English/German, not EN/DE |
| Generate | refresh + content width ~199, left, `#bb212c`, r~3.19 | **183.98×38.25**, not full width, `rgb(187,33,44)`, radius **3.1875px** | PASS |
| Empty until generate | empty | empty ol | PASS |
| After generate | 5 outline cards, h~52, 1px `#636363`, alt `#3a3a3a`/`#555`, pad 6×8, r 4, copy on right | **5** cards, h **52**, border `1px rgb(99,99,99)`, bg `#3a3a3a`/`#555`, pad `6px 8px`, r `4px`, clipboard buttons | PASS |
| Saved Names after copy | small label + × chip | “Saved Names” + chip + × | PASS |
| Identity block | none | none | PASS |
| Option copy | City Names / EN / DE | City / English / German; button “Generate City Names” | Did not copy competitor option strings |

Utility shell still has h2 “Names” (same as Draw/Text). Not a fail.

---

## Compression

File: `/tmp/oversized-coat-upload.png` (constructed for this check; valid PNG, 900×900, **2 431 153 > 262 144**).  
Path: Tools was Names; switched to **Charges → Upload** (“上传图片” / Upload crest image).  
Status text (exact): `Compressed oversized upload oversized-coat-upload.png from 2431153 to 23492 bytes.`  
Canvas after: SVG `1800×1080` still present; adding the upload created a `data:image/png` image node. No error alert.

---

## Not in scope / leftovers

- Did not open coamaker.com this run; structure compared to the already-recorded competitor Names spec.
- Did not change `src/` or git.
- Left rail “Names” label was clipped in the Tools tree at this viewport; the Names **panel** itself was complete. Not part of this Names-controls checklist.
