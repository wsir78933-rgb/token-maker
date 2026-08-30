# Coat Maker SEO — 用例 + 工具对比 layout plan

Read-only. No product files edited. Scope: `CoatMakerSeoContent` on `/coat-of-arms-maker` and `/zh/coat-of-arms-maker` only.

Page order already locked by `src/app/(maker-en)/coat-of-arms-maker/page.tsx` and `site-routes.test.tsx`: workbench (`CoatOfArmsMaker`) → `[data-testid="coat-maker-seo-content"]` → footer. Keep that.

---

## 0. What is on the page now (verified)

**Compact landing (committed `HEAD`):** H1 + one short intro; 2-col steps (3 short lines) | 3 feature chips; 2-col 4 short use-case chips | privacy card; FAQ in `lg:grid-cols-3` (3 items); related pill links.

**Rejected working tree:** H1 + intro + **three `overviewParagraphs` stacked under the H1**; lengthened step bodies; `featuresIntro` / `useCasesIntro`; use-case chips turned into paragraph dumps; privacy lengthened; FAQ grown to 6 items and `lg:grid-cols-2`.

User rejection: the extra words were poured into the old compact slots. They asked for **用例** and **工具对比** as real sections, not a text wall.

---

## 1. Visual structure

Two different shapes. Do not use the same chip-or-paragraph treatment for both.

### 用例 → titled cards (not chips, not essay)

Reuse the FAQ card chrome already in this file:

`article` + `rounded-2xl border border-white/10 bg-black/20 p-5`

Each card:

- `h3` = short job name (the old compact chip titles: tabletop houses, guild/club, fantasy / family banners, worldbuilding props)
- one `p` (`text-sm leading-6 text-stone-300`) = what you make + where the file goes (handout / VTT / sticker / map). Two sentences max.
- no icons, no homepage `SectionEyebrow`, no extra CTA inside the card

Grid: `mt-5 grid gap-4 sm:grid-cols-2` (same breakpoint habit as the current use-case list). Full width of `max-w-6xl`, **not** squeezed into the left half of a 2-col with privacy.

Do **not** use a definition list here. Four jobs need equal visual weight; `dt/dd` reads like a glossary.

### 工具对比 → table on desktop, stacked rows on mobile (recommend mode A)

**Desktop (`hidden lg:block`):** one HTML `table` inside a wrapper that already matches this block:

`mt-5 rounded-2xl border border-white/10 bg-black/20`

Cells: `px-4 py-3 text-sm leading-6`, header row `font-semibold text-stone-100`, body `text-stone-300`, row rules `border-t border-white/10`. Highlight the “this page” row with the existing gold wash: `bg-[#d7b46a]/[0.06]`.

Four columns, four rows (plus header):

| Approach | Job it finishes | You leave with | Stay on this page? |
|---|---|---|---|
| This coat of arms maker | Original shield graphic | PNG / JPEG / PDF from the editor above | Yes — scroll up |
| Token Maker (on-site) | Map / VTT portrait token | Token file from that tool | No — related chip |
| Design software (no brand) | Any graphic, heavier setup | File from another app | No |
| Surname / family-history lookup (no brand) | Historical record, not a blank canvas | A citation or a found image, not proof of official arms | No |

**Mobile (`lg:hidden`):** same four rows as stacked cards, same FAQ `article` class. Each card: `h3` = approach name; three short lines labeled with the column headers (`font-semibold text-stone-100` + `text-sm`). This is a definition-list *shape* without adding a new component: one `dl` per card, `dt`/`dd` pairs, or three `p` lines. Prefer `dl` for the stacked rows so screen readers get name/value pairs.

Do **not** use a wide `overflow-x-auto` table on small screens. That class exists on the workbench (`overflow-x-auto` in `globals.css`), not in this SEO block; stacking is the existing mobile pattern (`lg:hidden` / `hidden lg:flex` already used in `CoatOfArmsMaker.tsx`).

---

## 2. What stays from the compact landing

Keep these, in this order, still **below** the live editor:

1. **H1** — one `h1`, current classes. Title string can stay whatever copy/metadata task lands; layout does not add a second heading above the editor (route test: exactly one `h1`, workbench project name is `sr-only` span).
2. **One short intro** — the single `p` under the H1 (`mt-5 text-base leading-8 text-stone-300`). This is `introduction` / `metadataDescription`. No second or third paragraph in that `max-w-3xl` stack.
3. **3 steps** — left column of the first `lg:grid-cols-2`. Restore **one-line** descriptions (HEAD length). Keep `ol` + `stepsAriaLabel` (test requires 3 `li`).
4. **Features** — right column: three `rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3` chips. Drop `featuresIntro`.
5. **Privacy** — gold card `rounded-[28px] border border-[#d7b46a]/20 bg-[#d7b46a]/[0.06] p-6`. Restore the short export line (HEAD). Move it **out** of a shared 2-col with use cases; place it after comparison, still inside the same `max-w-6xl` wrapper.
6. **FAQ** — existing `article` cards. Restore **3 items** and `lg:grid-cols-3` (HEAD). Official-arms / account / “what to lock first” belong in 用例 or 对比 cells, not as padding FAQ.
7. **Related chips** — unchanged `flex flex-wrap gap-3` pills (Square Token Maker, Dice Roller, FAQ). These are navigation, not the comparison section.

Wrapper stays: `mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20` + `border-t border-white/10 bg-[#100d08]`.

---

## 3. What gets removed or shrunk

Remove from the H1 block:

- `overviewParagraphs` (all three). Do not relocate them as a “guide” under the H1. Any leftover fact (field vs charge, contrast, export formats, not official arms) goes into a **card cell** or a **table cell**, one clause each.

Shrink back to compact:

- Step descriptions → one sentence each
- Feature list → 3 chips, no lead paragraph
- Use-case strings → title + ≤2 sentences (not the current colon-essays)
- Privacy `exportExplanation` → one sentence
- FAQ → 3 short Q/A; drop the 3 items added for word-count

Do not add homepage SEO sections, icons, or `site-content-section` wrappers.

Schema (`coat-maker-seo-schema.ts`) stays WebApplication only; route tests forbid HowTo / FAQPage. Layout must not imply new JSON-LD types.

---

## 4. Where 用例 and 对比 sit (still below the workbench)

```
[CoatOfArmsMaker workbench]
[CoatMakerSeoContent]
  H1 + one intro
  steps | features          (lg: 2-col)
  用例                     (full width, own <section>, H2)
  工具对比                 (full width, own <section>, H2)
  privacy                  (full width gold card)
  FAQ                      (border-t, 3 cards)
  related chips            (border-t)
[SiteFooter]
```

Both new sections stay **inside** `data-testid="coat-maker-seo-content"`. They do not move beside the canvas, into the topbar, or onto Token Maker / Dice routes. Related chips stay last so “go use another tool” happens after “this page vs those jobs.”

Vertical rhythm: `mt-12` before 用例, `mt-12` before 对比 — same as today’s section gaps. Optional `border-t border-white/10 pt-12` on 对比 only if it needs a harder break from the cards; not required.

---

## 5. Comparison mode — recommend A

Coordinator options (from the rejected pass):

| | Mode | Verdict |
|---|---|---|
| **A** | Category: this browser maker vs design software vs surname / family-history lookup; no brand names. Can include one on-site Token Maker row. | **Recommend** |
| B | Named SERP coat-of-arms tools | Reject for this layout. Needs competitor research that was not finished; naming brands is out of the user’s earlier C choice. |
| C | “When to use this maker” checklist only | Reject as the *only* compare block. It collapses back into chips/FAQ and looks like the rejected dump. |

**How A looks on the page:** one H2 (e.g. “Which tool for which job” / “这个制作器和别的做法怎么选”), one optional one-line intro, then the 4×4 table (desktop) / four stacked cards (mobile). First body row is this page and uses the gold wash so the eye lands on “stay here.” Token Maker is the only on-site product row (already linked in related chips). Dice Roller is **not** a comparison row — it is not a crest tool; leave it as a related chip.

Copy rules for implementers (layout, not prose): each cell is a clause, not a paragraph. No brand names. No “official arms,” accounts, or paid plans. Keyphrase may appear once in the H2 or the this-page row, not in every cell.

---

## 6. Mobile / desktop (existing classes only)

No new CSS file, no new design tokens, no `overflow-x-auto` table on phone.

| Surface | Classes already in this block or this product |
|---|---|
| Page column | `mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20` |
| H1 / H2 | `font-display text-4xl … sm:text-5xl` / `text-2xl … sm:text-3xl` |
| Intro | `mt-5 text-base leading-8 text-stone-300` |
| Steps + features | `mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12` |
| 用例 grid | `mt-5 grid gap-4 sm:grid-cols-2` — 1 col default, 2 col from `sm` |
| Cards | `rounded-2xl border border-white/10 bg-black/20 p-5` |
| Feature chips | `rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3` |
| Compare table (lg+) | `hidden lg:block` + table in `rounded-2xl border border-white/10` |
| Compare cards (mobile) | `lg:hidden` + same FAQ `article` stack `space-y-3` or `grid gap-4` |
| Privacy | existing gold `rounded-[28px] … p-6` |
| FAQ | restore `mt-5 grid gap-4 lg:grid-cols-3` |
| Related | `mt-4 flex flex-wrap gap-3` + `rounded-full` pills |

`hidden lg:block` / `lg:hidden` are already used on this route’s workbench. Do not import homepage section components.

---

## 7. Ego screenshots after implementation — this URL only

**URL:** `http://localhost:3000/coat-of-arms-maker`  
(If the current `next dev` is on 3001, same path on that origin. Do not open Token Maker, Dice, home, blog, or `/zh/coat-of-arms-maker` for this check — ZH is the same component.)

Discard any inert draft overlay first so the workbench is not blocking scroll.

Shots (EN page only):

1. **Desktop ~1280+:** full SEO block in one scroll sequence — H1 + single intro visible; no paragraph stack under the H1.
2. **Desktop crop:** 用例 — four titled cards in 2×2, not a chip paragraph dump.
3. **Desktop crop:** 工具对比 — table with four columns; this-page row gold-washed; no brand names.
4. **Desktop crop:** privacy + 3 FAQ + related pills still present and not lengthened.
5. **Mobile ~390:** 用例 stacked (or 2-col if `sm` hits); 对比 as four stacked cards / `dl` rows, no sideways-scroll table.

Pass: two real sections, compact landing pieces still short, editor still above the SEO block. Fail: essay under H1, or 用例/对比 looking like more chips in the old 2-col with privacy.
