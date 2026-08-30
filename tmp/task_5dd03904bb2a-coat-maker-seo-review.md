# Coat Maker SEO review — task_5dd03904bb2a

Scope: read-only review of
`src/components/coat-of-arms/coat-maker-seo-copy.ts`,
`CoatMakerSeoContent.tsx`,
`CoatMakerSeoContent.test.tsx`.

No product edits. Probe file was created, run, and deleted.

Baseline for “metadata unchanged”: committed `HEAD` copy, not live SERP group 9.
Title/desc proposals in `tmp/coat-maker-title-desc-proposals.md` and
`tmp/task_796c82dffe29-coat-maker-title-desc.md` veto Family Crest / icons / 家徽.

## Verdict

**FAIL — 1 blocker remains.** Structure and density match the approved plan.
Metadata/H1/intro were rewritten to vetoed Family Crest / 家徽 / icons strings.

## Plan checklist

| Check | Result | Evidence |
|---|---|---|
| Dump gone (`overviewParagraphs`) | PASS | No `overviewParagraphs` / `featuresIntro` / `useCasesIntro` in copy. Component H1 block is one `h1` + one `p` (`CoatMakerSeoContent.tsx:46-48`). Tests assert `copy.not.toHaveProperty('overviewParagraphs')` and `h1 + p + p` is null (`CoatMakerSeoContent.test.tsx:176-182`). |
| 4 use-case cards | PASS | `useCases.length === 4` asserted at copy getter (`coat-maker-seo-copy.ts:330-331`). Rendered as 4 `article` cards (`CoatMakerSeoContent.tsx:8-14, 76-79`). Tests require 4 articles + 4 h3 (`CoatMakerSeoContent.test.tsx:130-131`). |
| 3 category comparison cards | PASS | Titles: this browser maker / general design software / genealogy lookup. No Token Maker or Dice row. Grid `lg:grid-cols-3` (`CoatMakerSeoContent.tsx:85`). Tests require 3 articles (`CoatMakerSeoContent.test.tsx:165-166`). |
| No brand names; no Token Maker/Dice comparison rows | PASS | Comparison titles have no product names. `Square Token Maker` / `Dice Roller` remain related chips only (`coat-maker-seo-copy.ts:162-165`). |
| Metadata unchanged | **BLOCKER** | See Finding B1. |
| 3 FAQ; free question unchanged | PASS | EN/ZH FAQ questions and answers match `HEAD`. Free question still `Is this coat of arms maker free to use?` / `纹章制作器可以免费使用吗？`. |
| No official arms / cloud / paid claims | PASS for this copy | No “official arms”. No cloud-product claim. “without a paid plan” is the required unchanged free FAQ (`coat-maker-seo-copy.ts:147-148`). |
| Density 1050–1150 / 2.7–3.3% | PASS | Rendered semantic text (same collector as the unit test): EN **1090 tokens, 8 hits, 2.936%**; ZH **1118 tokens, 7 hits, 3.131%**. Tests lock the band (`CoatMakerSeoContent.test.tsx:227-230`). |

## Findings

### B1 — BLOCKER: metadata / H1 / intro changed to vetoed Family Crest copy

`coat-maker-seo-copy.ts:30-34`, `62-67`, `173-177`

`HEAD`:

- EN H1 `Coat of Arms Maker`
- EN metadata title `Coat of Arms Maker — Free Online Heraldry Creator`
- EN metadata description `Use this free coat of arms maker to customize shields, colours, charges, text, and layers in your browser, then export PNG, JPEG, or PDF files.`
- EN intro was a separate paragraph
- ZH H1 `纹章制作器`
- ZH metadata title `纹章制作器 | 免费徽章编辑器`
- ZH metadata description `使用这款免费纹章制作器，在浏览器中自定义盾牌、颜色、图形、文字和图层，并导出 PNG、JPEG 或 PDF 文件.`

Working tree (also used as on-page H1 and intro; getter forces `heading === metadataTitle` and `introduction === metadataDescription` at `coat-maker-seo-copy.ts:305-311`):

- EN `Free Family Crest and Coat of Arms Maker`
- EN `Make your own family crest or coat of arms with editable shields and icons. Free to create and export in the browser.`
- ZH `免费家族纹章与纹章制作器`
- ZH `用可编辑的盾和图形做自己的家徽或纹章。在浏览器里免费创建并导出。`

This is not “metadata unchanged.” It is also not any approved title/desc group. Both proposal docs veto Family Crest / icons / 家徽 in title and description.

Tests now lock the new strings (`CoatMakerSeoContent.test.tsx:59, 68`). Adjacent unscoped lock-in: `src/app/site-routes.test.tsx` and `coat-maker-seo-schema.ts` (`name: copy.metadataTitle`). Revert is not a three-file-only fix, so this review did not patch it.

### N1 — Non-blocking: use-case bodies are 3-sentence essays

`coat-maker-seo-copy.ts:93-109` (EN), `202-217` (ZH)

Layout plan said title + ≤2 sentences. Every EN/ZH body is 3 sentences. Coordinator density band (1050–1150 / 2.7–3.3%) likely required this padding. Not a blocker against the dispatch checklist.

### N2 — Non-blocking: comparison cells unlabeled

`CoatMakerSeoContent.tsx:28-31`

Three fields dump as bare `<li>` text. No “Job / You leave with / Stay on this page?” labels. Coordinator asked for 3 category cards (not the 4-row desktop table), so missing table is not a fail. Labels would still help scan.

### N3 — Non-blocking: gold wash keyed by array index

`CoatMakerSeoContent.tsx:22-23`

First comparison item is highlighted because `comparisonIndex === 0`, not because copy marks it as “this page.” Breaks if locale arrays are reordered.

## Coding rules (1–8)

None of these are blockers.

| Rule | File:line | Note |
|---|---|---|
| Public exports / YAGNI | `coat-maker-seo-copy.ts:18-28` | `CoatMakerSeoUseCase` and `CoatMakerSeoComparisonItem` are exported but unused outside this file. `CoatMakerSeoStep` / `FaqItem` / `Link` stay private. |
| Fail Fast | `coat-maker-seo-copy.ts:305-311`, `313-351` | Mismatch and wrong-length errors say `Missing Coat Maker SEO field …` and omit the actual value / length. |
| KISS / SRP | `CoatMakerSeoContent.tsx:8-35` | Helpers are small and fine. Component only renders. |
| Precise names | copy + component | Field names (`youLeaveWith`, `stayOnThisPage`) match the job. |
| Cohesion | copy vs component | Copy + asserts in one module; render in the other. OK. |

## Verification

```
pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/app/site-routes.test.tsx
```

Result: **2 files, 54 tests passed** (vitest 4.1.5).

Density probe (same collector as the unit test, then deleted):

- EN 1090 / 8 / 2.936%
- ZH 1118 / 7 / 3.131%
- 7 `h2`, 10 `article` (4 use-case + 3 comparison + 3 FAQ)

Did not revert metadata (would need `site-routes.test.tsx` outside the allowed three files).
Did not browser-verify; this was a copy/structure review.

## Residual (out of plan, not a fail)

`exportExplanation` still says exports stay on device without sending to an account or shared workspace (`coat-maker-seo-copy.ts:142-143`, same as `HEAD`). Silent R2 upload now exists on Download. Plan said keep that short HEAD line and not claim cloud. Flag only.
