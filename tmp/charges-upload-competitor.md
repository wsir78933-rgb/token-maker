# Charges → Upload competitor structure

Source: https://coamaker.com/ (editor, logged-out)  
Method: local ego-browser task space `charges upload parity`  
Date: 2026-08-22  
Viewport: `innerWidth 1512 × innerHeight 738`  
Screenshot: `tmp/charges-upload-coamaker.png` (cropped to left rail + library column; ad iframes hidden)

This file records **layout and chrome only**. It does not copy paywall wording, ads, CTA labels, or trademarks.

**Product constraint:** our editor must **implement working local file upload** in this slot. Do not clone the competitor’s locked CTA.

---

## 1. Where Upload sits

Charges expanded nested list (`a[data-sidebar="menu-sub-button"]`), in order:

| index | label  | `data-active` when Upload is selected |
|------:|--------|----------------------------------------|
| 0     | Animal | `false` |
| 1     | Object | `false` |
| 2     | Plant  | `false` |
| 3     | Human  | `false` |
| 4     | Symbol | `false` |
| 5     | **Upload** | **`true`** |

Upload is the **last item, immediately after Symbol**. Same control type as the five gallery categories (anchor + icon + label). No extra divider, badge, or nested submenu.

Selected chrome (same tokens as other active nested items in earlier hover spec):

- `data-active="true"`
- computed background `rgb(90, 90, 90)` (`--sidebar-accent`)
- size `111 × 29.8` (`h-7`, `rounded-md`)
- inactive Animal: background `transparent`, color `rgb(255, 255, 255)`

---

## 2. Adjacent library column when Upload is selected

The column to the right of the 170px tool rail is **not a file picker and not a dropzone**.

For a logged-out session it is a **locked CTA card** inside the same Charges library chrome used by Animal.

| Probe | Result |
|---|---|
| `input[type=file]` in the library column | none (only an unrelated hidden Export input: `accept=".json,.txt"`) |
| dropzone / `ondrop` / upload-named node in the tabpanel | none |
| images in the tabpanel | 0 |
| search field | **removed from the DOM** (Animal’s `.search-container` is gone) |
| tabpanel children | **one** centered card: `h3` + `p` + `button[data-variant="pro"]` |

Visual structure (top → bottom of `.coaChargesContainer`):

1. `.flag-top-ad` slot still present (`277 × 184`). This is ad chrome, not a drop area. The screenshot hid the iframe, so this reads as empty dark padding — do not implement that gap as a dropzone.
2. No `.search-container`.
3. `[role="tabpanel"].coa-panel-body` with a single card:
   - heading **present** (`h3`, centered)
   - body paragraph present
   - one primary button (`data-variant="pro"`, `min-width: 200px`, `min-height: 40px`, computed `200 × 40`)

DOM shape of the card (classes only):

```html
<div class="coa-panel-body" role="tabpanel">
  <div class="rounded-lg border border-border bg-accent p-4 shadow-sm"
       style="text-align: center; width: 95%; margin: 16px auto;">
    <h3 class="text-lg font-semibold text-foreground">…</h3>
    <p class="mb-3">…</p>
    <button data-slot="button" data-variant="pro" data-size="default">…</button>
  </div>
</div>
```

Card computed tokens:

| token | value |
|---|---|
| size | `249.8 × 220.3` |
| width | inline `95%`; margin `16px auto` |
| padding | `17px` (`p-4` at 17px root) |
| background | `rgb(90, 90, 90)` |
| border | `1px solid rgb(99, 99, 99)` |
| radius | `4.25px` (`rounded-lg`) |
| text-align | `center` |
| heading | `h3`, `19.125px` / weight `600` / line-height `29.75px` / centered |
| CTA | green fill `rgb(22, 163, 74)`, white text, radius `3.1875px` (`rounded-md`) |

---

## 3. Layout tokens vs Animal gallery

Shared column (does not change when switching Animal ↔ Upload):

| node | width | height | notes |
|---|---|---|---|
| tool rail (`w-(--sidebar-width)`) | **170px** | 599.4 | `bg rgb(71,71,71)`, `border-right 1px solid rgb(99,99,99)` |
| `.coa-sidepanel-content` | **289px** | 599.4 | `bg rgb(58,58,58)`, `padding-top 8px`, `overflow-y: scroll` |
| `.coaChargesContainer` | **283px** | 591.4 | `display: flex; flex-direction: column; overflow-y: auto` |
| `.coa-desktop-layout` | 459px | 599.4 | rail + library; collapse handle `24×46` at x=447 |

Panel body (does change):

| | Animal (gallery) | Upload (locked card) |
|---|---|---|
| `.coa-panel-body` width | **277px** (inner scrollbar on the tall grid) | **283px** (short content, no inner scrollbar) |
| `.coa-panel-body` padding | `6px 10px` | `6px 10px` (same) |
| `.coa-panel-body` height | content-sized (~6541px of cards) | **264.3px** |
| Search | `.search-container` `277 × 45`; input `257 × 36`, placeholder `Search Charges` | **absent** |
| Heading in column | **yes** (`h3` above the grid; upsell slot — do not copy text) | **yes** (`h3` inside the locked card) |
| Body | image grid; first card `59.8 × 56`, 3px padding, `rgb(85,85,85)` | locked CTA card, no grid |
| File picker / dropzone | no | no |
| Ad slot above body | `.flag-top-ad` 184px | same 184px slot |

Parity takeaway for our library column: keep the **same 289 / 283 width chrome** as the Animal gallery. Swap the **body**: Animal = search + heading + grid; Upload should be **working local upload UI** (file input and/or dropzone), not a paywall card. Search may be omitted on Upload (competitor removes it).

---

## 4. What we should implement (not copy)

Competitor (logged-out): Charges → Upload → locked CTA.

Ours today (read-only check, no `src/` edits):

- Charges nested branch is categories + Ordinaries. **No Upload item.**
- Desktop rail test currently asserts `queryByRole('button', { name: 'Upload' })` is **null**.
- Working local upload already exists under **Custom** (`UploadPanel`: real `input[type=file]`, PNG/JPEG/WebP/SVG, `add-local-upload-images`).

Parity target: add **Charges → Upload as the last nested item after Symbol**, and put a **functioning local upload surface** in that same library column (reuse existing upload commands). Do not ship a locked upgrade card.

---

## 5. Not verified

- Logged-in / paid session. This capture is the public logged-out editor (`Login` visible). A paid account might replace the locked card with a real picker; that was not opened.
- Drag-and-drop of a file onto the card (no drop listeners in the tabpanel DOM).
- Mobile layout.
