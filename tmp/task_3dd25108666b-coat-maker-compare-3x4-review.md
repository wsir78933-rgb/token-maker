# Independent review: 3×4 selling-point comparison table

Reviewer: Grok (read-only worker `task_3dd25108666b`)
Date: 2026-08-30
Scope: `src/components/coat-of-arms/coat-maker-seo-copy.ts` comparison block (EN + ZH), checked against `tmp/coat-maker-comp-coamaker.md` and `tmp/coat-maker-comp-rollforfantasy.md`. Renderer/tests read only to confirm what ships.
No product file was edited.

Verdict: **not clean**. Structure, coding rules, our-column bans, Crest and Arms absence, leftover-row absence, EN/ZH meaning, and the RFF Start *cell text* pass. Three medium content defects and one low overreach.

---

## Defects

### D1 — Medium — comparison lead recasts every competitor cell as a stop, including the required-neutral RFF Start cell

- File: `src/components/coat-of-arms/coat-maker-seo-copy.ts:121-122` (EN), `:247` (ZH)
- EN: `Each row below shows where the other makers stop.`
- ZH: `下面每行看清别家在哪儿卡住。`
- Why: The RFF Start cell is correctly a neutral fact (see C5). The lead still tells the reader that every row is where the other makers stop / get stuck. That is a fake weakness *by framing*, even though the cell text is not.
- Verified: read copy lines 121-122, 130, 247, 255; read RFF note lines 27-31 and 66-68 (inline load, no login, no paywall).

### D2 — Medium — CoaMaker Export is a shared format fact dressed as their weakness

- File: `src/components/coat-of-arms/coat-maker-seo-copy.ts:145` (EN), `:270` (ZH)
- EN: `Its live export dialog offers PNG, JPG, and PDF only — no SVG.`
- ZH: `实测导出对话框只有 PNG、JPG、PDF——没有 SVG.`
- Why: The live-dialog file list and “no SVG” are in the CoaMaker note. That is not a relative Export weakness. Our own Export cell and `verifiedCapabilities` also only claim PNG/JPEG/PDF plus print and batch ZIP — no SVG. CoaMaker’s live dialog *does* offer PNG, JPG, PDF, and Print. The punchline “no SVG” is a shared absence, not a place CoaMaker stops.
- Verified: read copy `:88-89`, `:142-145`, `:213-216`, `:268-270`; read CoaMaker note §5 lines 98-108 (PNG/JPG/PDF, Print, no SVG in that dialog).

### D3 — Medium — RFF Edit “fixed built-in asset set” is stronger than the note

- File: `src/components/coat-of-arms/coat-maker-seo-copy.ts:138` (EN), `:263` (ZH)
- EN: `A fixed built-in asset set on a tiny 248×275 canvas, and its images cannot be reused in another coat-of-arms creator.`
- ZH: `固定内置素材集，画布仅 248×275，且其图片不得用于另一个纹章制作器。`
- Why:
  - Canvas `248 x 275` is in the note. Supported.
  - Reuse of *individual images* in another coat-of-arms creator is in the note (usage/license block). Supported as a legal fact; it is not an Edit-control fact.
  - “Fixed built-in asset set” claims you cannot bring outside images. The same note records a control for `entering a custom-image value`. That control was not shown to fail or to be paywalled. “Fixed” overreaches.
  - EN “tiny” is editorial; the note only records the pixel size. ZH “仅” is closer to the evidence.
- Verified: read copy `:138`, `:263`; read RFF note lines 27-30 (canvas + custom-image control) and 64-69 (license / reuse).

### D4 — Low — CoaMaker Start groups header “Go Pro” with in-editor “Upgrade Now” cards

- File: `src/components/coat-of-arms/coat-maker-seo-copy.ts:129` (EN), `:254` (ZH)
- EN: `…already carries ads and Go Pro / Upgrade Now upsell cards.`
- ZH: `…已经被广告和 Go Pro / Upgrade Now 升级卡包围。`
- Why: Ads on the free editor are in the note. In-editor `Upgrade Now` paywall *cards* are in the note. `Go Pro` is header chrome, not a card. Ads + upsell as a Start-chrome weakness is fair; calling Go Pro an upsell card is a small overreach. ZH “包围” is hotter than EN “carries”; same items.
- Verified: read copy `:129`, `:254`; read CoaMaker note §2 lines 47-54 (header Go Pro, ads) and §4 lines 81-82 (Upgrade Now cards).

No High defects. No fabrication of a visit that did not happen. No banned claim in our column. No Crest and Arms column. No leftover “Surname and official arms” / “When to stay” rows.

---

## Structure (required confirms)

| Check | Result | Verification |
|---|---|---|
| Columns exactly 3 | Pass | Read copy `:123`, `:248`. Grep `comparisonColumns` in `src/`. Test expects `Our coat of arms maker` / `我们的纹章制作器`, `CoaMaker`, `Roll for Fantasy` (`CoatMakerSeoContent.test.tsx:201-226`). Renderer maps `comparisonColumns` to `th[scope="col"]` (`CoatMakerSeoContent.tsx:42-49`). |
| Rows exactly 4 | Pass | Read copy EN `:125-156` Start/Edit/Export/Account; ZH `:250-281` 开始/编辑/导出/账号. Assert `comparisonRows.length !== 4` at `:389-391`. Test `:78`, `:89`, `:244-253`. |
| Crest and Arms nowhere in product copy | Pass | `rg "Crest and Arms" src/components/coat-of-arms/coat-maker-seo-copy.ts` — no match. `rg "Crest and Arms" src/**/*.{ts,tsx}` — only `CoatMakerSeoContent.test.tsx:206` as the *forbidden* column string. |
| No leftover “Surname and official arms” / “When to stay” | Pass | `rg "Surname and official\|When to stay on this\|Genealogy and surname" src/**/*.{ts,tsx}` — no match. Those strings remain only in old `tmp/` drafts and in the ego notes’ snapshot of the *previous* live headings. |
| EN and ZH same meaning per cell | Pass | Pair-read every cell below. Same facts in each pair. Tone only: EN “tiny” vs ZH “仅”; EN “carries” vs ZH “包围”; EN “suggests a screenshot” vs ZH “只建议截图”. |
| RFF Start cell is a neutral fact, not a fake weakness | Pass (cell text) | EN `:130` `Loads inline with no login or paywall.`; ZH `:255` `内嵌加载，免登录、免付费墙。` Matches RFF note lines 27-31, 66-68. Does not invent a start wall. Fail is D1 (lead), not the cell. |

---

## Cell-by-cell content

Column index 0 = us, 1 = CoaMaker, 2 = Roll for Fantasy.

### Start

**Us** EN `:128` / ZH `:253`

- Claims: open page, editor already on canvas, no login, no paywall.
- Banned scan: not official/inherited arms; not “account required”; not our paid plan; not AI; not cloud save; not surname lookup; no traffic/DR.
- Result: Pass.

**CoaMaker** EN `:129` / ZH `:254`

- “Editor opens too” — CoaMaker note §2 line 47: opening the root URL puts you in the editor. Supported.
- Ads on the free workspace — §2 lines 54-55. Supported.
- Upgrade Now cards — §4 lines 81-82. Supported.
- Go Pro as an “upsell card” — overreach (D4).
- Result: Pass with D4.

**RFF** EN `:130` / ZH `:255`

- Inline load, no login, no paywall. RFF note lines 27-31, 66-68. Neutral fact. Required. Pass (cell). Lead D1 still applies.

### Edit

**Us** EN `:136` / ZH `:261`

- Local images free, no PRO gate, shields / field patterns / charges / text / layers / drawing tools.
- “No PRO gate” is us *not* selling a paid plan. Not a banned “paid plans as our product”.
- Result: Pass.

**CoaMaker** EN `:137` / ZH `:262`

- Own-image upload PRO — note §4 line 82 `Upload Your Own Elements` / Upgrade Now. Supported.
- Custom shield outline PRO — §4 line 81 `Upload your own shield outline with PRO.` Supported.
- Extra element packs PRO — §4 line 82 `624 Extra Elements` / Upgrade Now. Copy does **not** paste the “624” count. Supported, not overreach.
- Result: Pass.

**RFF** EN `:138` / ZH `:263`

- 248×275 canvas — note line 29. Supported.
- Image reuse in another coat-of-arms creator — note line 69. Supported as license text; Edit-row placement is a stretch, not fabrication.
- “Fixed built-in asset set” — overreach vs custom-image control (D3).
- Result: Fail D3.

### Export

**Us** EN `:143-144` / ZH `:269`

- One-click PNG, JPEG, PDF; print and batch ZIP in the same menu.
- No SVG claim. No cloud-save claim. Pass.

**CoaMaker** EN `:145` / ZH `:270`

- Live dialog PNG/JPG/PDF, no SVG — note §5 lines 100-108. Factually true.
- Dressed as the Export weakness while we also do not offer SVG, and CoaMaker’s live export of PNG/JPG/PDF plus Print actually works. Fail D2.
- Correctly does **not** copy the stale docs line “You won’t see the Export button in the free version” (note §5 lines 115-117, §10 item 8).

**RFF** EN `:146` / ZH `:271`

- “Turn to image” then right-click save — note lines 59-60. Supported.
- Live test: no image, no download link — note lines 62-63. Supported.
- Screenshot when conversion fails — note lines 60-61. Supported. ZH “只” is slightly hotter than EN; same fallback.
- Result: Pass.

### Account

**Us** EN `:151-152` / ZH `:277`

- No login, no paywall, local-first, browser draft restore after reload.
- Draft restore is local, not cloud save. Pass.

**CoaMaker** EN `:152-153` / ZH `:278`

- Save designs / templates PRO — note §4 line 86 How-to `How to Save Designs (PRO)`, `How to Use Thousands of Templates (PRO)`; §9 lines 198-203. Supported.
- Uploads PRO — already in Edit; still true here. Supported.
- Ads on free editor — §2, §6, §9. Supported.
- Default license non-commercial — §9 lines 208-210. Supported. This is *their* default, not copied as our terms (note §10 item 7).
- Does not paste $5.99 / $18.99 / $99. Pass.

**RFF** EN `:154` / ZH `:279`

- No paywall — note lines 66-68. Neutral, correctly kept.
- Page runs ads and asks for support — line 68. Supported.
- Commercial use needs owner’s permission — line 69. Supported.
- Result: Pass.

---

## Our-column banned-claim scan

Scanned comparison heading, lead, four us cells, EN and ZH.

| Banned claim | Present? | Verification |
|---|---|---|
| Official / inherited arms | No. Lead says “original shield” / “原创的盾”. | read `:121-122`, `:247` |
| Account required | No. Opposite: “no login”. | read `:128`, `:151`, `:253`, `:277` |
| Paid plans as our product | No. “no paywall”, “no PRO gate”. PRO only names CoaMaker’s gate. | read `:128-137`, `:151-153`, `:253-262`, `:277-278` |
| AI generation | No. | grep `AI` in comparison block — none |
| Cloud save | No. “local-first”, “browser draft”. | read `:121-122`, `:151-152`, `:247`, `:277` |
| Surname lookup as a feature | No. | grep `surname` / `姓氏` in `coat-maker-seo-copy.ts` comparison block — none |
| Traffic / DR numbers | No. | grep comparison block; CoaMaker note line 8 and RFF note line 85 say not to use them; copy does not |

---

## Coding rules (1–8)

Judged on the new comparison types, strings, and asserts in `coat-maker-seo-copy.ts`, plus the table renderer that reads them.

1. **Cohesion / low coupling — Pass.** Comparison strings live in the existing locale copy record. Renderer only reads `comparisonColumns` / `comparisonRows` (`CoatMakerSeoContent.tsx:35-80`). No competitor URLs or note parsers in product code.
2. **Single responsibility — Pass.** `getCoatMakerSeoCopy` still only loads + asserts copy. `renderComparisonTable` only renders the table.
3. **Public exports only — Pass.** Public: `CoatMakerSeoComparisonRow`, `CoatMakerSeoCopy`, `getCoatMakerSeoCopy`. Locale map and `assert*` stay unexported (`:315-430`). Content file uses `getCoatMakerSeoCopy`, not the map.
4. **KISS — Pass.** Three string columns, four rows, `cellText: readonly string[]`. No extra comparison component or strategy.
5. **Fail Fast — Pass.** `assertCoatMakerSeoLocale` throws `Unsupported Coat Maker SEO locale: ${locale}` (`:315-318`). Empty comparison strings throw `Missing Coat Maker SEO field ${fieldName} for locale: ${locale}` with paths `comparisonColumns[i]`, `comparisonRows[i].rowLabel`, `comparisonRows[i].cellText[j]` (`:381-402`). Shape asserts: columns === 3, rows === 4, cells === 3. No `catch` in `coat-maker-seo-copy.ts` or `CoatMakerSeoContent.tsx` (grep). Length-mismatch messages follow this file’s existing “Missing field” style (same as steps/useCases).
6. **YAGNI — Pass.** No Crest and Arms column, no fifth row, no schema for the table (`coat-maker-seo-schema.ts` still only WebApplication featureList).
7. **Precise names — Pass.** `comparisonColumns`, `comparisonRows`, `rowLabel`, `cellText`, `comparisonColumn`. No `data` / `temp` / `helper` / `util` / `manager` in the new block.
8. **All followed — Pass** for the coding rules. Content defects D1–D4 are copy-correctness, not structure/API violations.

---

## What is left

Product files were not changed. A later edit pass should:

1. Rewrite the comparison lead so it does not claim every competitor cell is a stop (D1), while keeping RFF Start as a neutral fact.
2. Replace the CoaMaker Export punchline. A note-backed relative gap is batch ZIP / one-click file vs their dialog — not “no SVG” (D2).
3. Drop or qualify “fixed built-in asset set” unless a later visit shows the custom-image control is unusable (D3). Keep 248×275 and the image-reuse license if still wanted; license sits more honestly on Account.
4. Optional: say header Go Pro + in-editor Upgrade Now cards, not “Go Pro / Upgrade Now upsell cards” (D4).
