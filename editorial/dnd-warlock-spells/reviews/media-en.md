# English media review — `dnd-warlock-spells`

- **Role:** V — independent English rule-diagram worker
- **Run:** `run_39994fa3f53e`
- **Task:** `task_f46927342863`
- **Dispatch:** `ctx_8de10101ff81`
- **Worker terminal:** `term_12c91460-57ec-422b-8e33-5ceb3696696b`
- **Codex session:** `01a0dbc4-2b85-7df2-a4c6-73b17a31a9df`
- **Date:** 2026-09-26 (Asia/Shanghai)
- **Mode:** content-only; no site, public, database, dependency, secret, deployment, or source-worktree writes.

This review records the hand-authored English rule diagrams and the actual local raster checks. The SVGs use no third-party image assets and are not generated illustrations; WebP files were produced from the SVGs with the installed system tools `sips` and `cwebp`.

## Asset status

| Asset | Planned role | Dimensions | Status |
|---|---|---:|---|
| `media/en/spell-choice.svg` | After the budget explanation: six base prepared names versus two level-3 Pact Magic slots | 1200 × 1660 | PASS |
| `media/en/spell-choice.webp` | WebP delivery of the same diagram | 1200 × 1660 | PASS |
| `media/en/concentration-choice.svg` | Beside the concentration branch: one active concentration choice at a time | 1200 × 1520 | PASS |
| `media/en/concentration-choice.webp` | WebP delivery of the same diagram | 1200 × 1520 | PASS |
| `media/en/upcast-tradeoffs.svg` | Beside the upcast comparison: five property-by-property rows | 1200 × 1820 | PASS |
| `media/en/upcast-tradeoffs.webp` | WebP delivery of the same comparison | 1200 × 1820 | PASS |

## Public-facing media text and source mapping

### `spell-choice`

- **Caption:** “At level 5, the six prepared choices and the two level-3 Pact Magic slots solve different planning problems.”
- **Alt:** “Diagram separating six prepared Warlock spell choices from two level-3 Pact Magic slots at level 5.”
- **Facts shown:** The 2024 level-5 case has six base prepared-spell entries; spells made always prepared by another feature are separate. It also has two level-3 Pact Magic slots. A lower-level spell can be cast with a level-3 Pact Magic slot; the effect changes only when that spell's own upcast rule says it does. The footer adds the separate one-active-concentration limit.
- **Public sources:** [Warlock — D&D Beyond Basic Rules](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock), [Spellcasting rules](https://www.dndbeyond.com/sources/dnd/br-2024/spells), and [Concentration — Rules Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration).
- **Original-production note:** Hand-authored vector diagram; no third-party image or generated illustration used.

### `concentration-choice`

- **Caption:** “Prepare several concentration options if useful, but plan to maintain only one at a time.”
- **Alt:** “Concentration diagram showing one active Warlock concentration spell and four mutually competing examples.”
- **Facts shown:** Hex, Hypnotic Pattern, Invisibility, and Fly are shown as concentration options. Starting another concentration spell ends the first; damage may trigger a Constitution saving throw, and incapacitation or death ends concentration.
- **Public sources:** [Concentration — Rules Glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration), [Hex](https://www.dndbeyond.com/spells/2618988-hex), [Hypnotic Pattern](https://www.dndbeyond.com/spells/2619168-hypnotic-pattern), [Invisibility](https://www.dndbeyond.com/spells/2619116-invisibility), and [Fly](https://www.dndbeyond.com/spells/2618909-fly).
- **Original-production note:** Hand-authored vector diagram; no third-party image or generated illustration used.

### `upcast-tradeoffs`

- **Caption:** “Compare the property change with the job and opportunity cost; no listed upcast improvement does not automatically exclude Misty Step.”
- **Alt:** “Five-row diagram comparing what selected 2024 Warlock spells actually change when cast with a level-3 slot.”
- **Facts shown:** At a level-3 slot, Hex reaches an 8-hour maximum concentration duration; Invisibility has two targets total; Fly remains one target at 3rd; Dispel Magic ends spells through 3rd automatically; Misty Step has no listed improvement in the selected source. The diagram is explicitly not a damage ranking.
- **Public sources:** [Hex](https://www.dndbeyond.com/spells/2618988-hex), [Invisibility](https://www.dndbeyond.com/spells/2619116-invisibility), [Fly](https://www.dndbeyond.com/spells/2618909-fly), [Dispel Magic](https://www.dndbeyond.com/spells/2619103-dispel-magic), and [Misty Step](https://www.dndbeyond.com/spells/2619133-misty-step).
- **Original-production note:** Hand-authored vector diagram; no third-party image or generated illustration used.

## Actual checks

1. `xmllint --noout editorial/dnd-warlock-spells/media/en/spell-choice.svg` — exit `0`.
2. `xmllint --noout editorial/dnd-warlock-spells/media/en/concentration-choice.svg` — exit `0`.
3. `xmllint --noout editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.svg` — exit `0`.
4. `sips -s format png ...svg --out <temporary PNG>` — exit `0` for all three SVGs; output dimensions were respectively `1200 × 1660`, `1200 × 1520`, and `1200 × 1820`.
5. `cwebp -quiet -q 88 <temporary PNG> -o ...webp` — exit `0` for all three WebP files; `file` and `sips` read back the same dimensions.
6. Local `view_image` inspection at high detail — PASS: panels, large headings, card text, explicit arrows, and the lower rule notes were visible; no text was clipped in the inspected renders. The concentration diagram shows one active token and a single red replacement branch rather than multiple simultaneous active lines. The upcast table keeps each spell, slot level, and property-change column visually separate.
7. `sips --resampleWidth 390` on PNG readbacks — exit `0` for all three mobile-width renders; output dimensions were `390 × 539`, `390 × 494`, and `390 × 591`. Local `view_image` inspection of those renders — PASS: the vertical layouts retain the rule labels, arrows, and row/card boundaries without clipping.

## Integrity hashes

| File | SHA-256 |
|---|---|
| `media/en/spell-choice.svg` | `9e20ae6a74fca03558ff3c23d8b5ff3baab34be19250dcb2b86f0700886743ab` |
| `media/en/spell-choice.webp` | `2345958984441f751dff3191a5dc9df88ffabb106e81d52b1e95291bbff82704` |
| `media/en/concentration-choice.svg` | `f249fd3531b52c038a15531f3088c1f9c93f65edfedbac04949abea01322c077` |
| `media/en/concentration-choice.webp` | `4e3c27ffcf1148d6e45f732d3dca8fd5bbf389885206bd2037aed5cb8b9f2b26` |
| `media/en/upcast-tradeoffs.svg` | `a77918258f6d8be37eed6bb2a94d4b4aa4f53c884a99f0c6d3af8d17e1ebf32c` |
| `media/en/upcast-tradeoffs.webp` | `03032baeb883425db71c69b8bd1ade139050d972a4016423c040ae7542c2d22f` |

## Scope limitations

- The upcast comparison was drawn only after the coordinator delivered the revised B card (`b3db5e92bab30ae22947421ae4f4d07c1825cb16677cea9384999fc6ca9d79c7`), which records two total Invisibility targets at 3rd level and treats Misty Step's unchanged upcast text as an opportunity-cost flag rather than an automatic exclusion.
- No website, public page, database, dependency, secret, deployment, or original worktree was touched. This is media evidence for the content-only handoff, not a page or SEO acceptance result.
