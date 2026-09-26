# B-en Layout Revision 1 — `dnd warlock spells`

## Revision identity and scope

- **Role:** B-en successor; English layout-only revision.
- **Run:** `run_39994fa3f53e`
- **Task:** `task_7a86b80000ed`
- **Dispatch:** `ctx_0a84857266b2`
- **Worker terminal:** `term_b61f38d1-d7ae-4baa-860c-4270cfd2143c`
- **Codex session:** `01a0dbc4-f883-74e3-a0ac-f32c04c5cdf6`
- **Coordinator terminal:** `term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`
- **Date:** 2026-09-26 (Asia/Shanghai)
- **Revision:** Round 1; merged into the existing English task card. The shared revision count is not reset.
- **Scope:** only `planning/en/task-card.md` and this report. No article body, Chinese layout/body, research, website, dependencies, database, secrets, Hermes, commit, push, or deploy changes.

## Evidence-bound correction

The A-en evidence states that 2024 Invisibility adds one target for each slot level above 2nd (F14), and its derived example explicitly calculates a 3rd-level cast as two total targets (G02). The prior English layout card had the wrong 3rd-level Invisibility target count in its section-3 guidance and `upcast-tradeoffs` figure plan; Round 1 corrects both and makes the G02 information-gain row explicit.

The adjacent Fly calculation remains unchanged and correct: Fly starts at 3rd level, so a 3rd-level slot still affects one target; its additional-target rule begins above 3rd. Hex remains an 8-hour maximum-duration example at 3rd level, Dispel Magic retains its automatic ending through 3rd level, and Misty Step retains no listed upcast improvement in the selected 2024 text.

The section-3 title and figure caption now compare the actual upcast change with the spell’s job and opportunity cost. Misty Step’s lack of a listed upcast improvement is a decision constraint, not a prohibition on choosing its verified movement job when that job is worth the slot.

### Before/after readback

- **Before edit:** the original task-card hash was `80e4489aefb05bf908eaf05a1ac49a421829b95344c68d76db7aee73a597484a`. Its section-3 guidance and `upcast-tradeoffs` row both treated a 3rd-level Invisibility cast as affecting only one target; the adjacent 3rd-level Fly row correctly remained one target.
- **After edit:** section 3 now says that 3rd-level Invisibility adds one target for two total, and the figure row says `Invisibility → two targets at 3rd (one extra target)`; the Fly row remains `one target at 3rd`. The final task-card hash is recorded in the validation table; the report’s self-hash is intentionally not embedded.

## Files changed

1. `editorial/dnd-warlock-spells/planning/en/task-card.md`
   - Added the Round 1 revision marker.
   - Corrected the section-3 Invisibility calculation to two total targets at 3rd level.
   - Updated G02 so the planned comparison names the two-target result.
   - Corrected the `upcast-tradeoffs.webp` row to two targets at 3rd level.
   - Reframed the section-3 heading and figure caption so no upcast improvement is compared with task value rather than treated as an automatic exclusion.
   - Clarified that six is the level-5 base table count, always-prepared feature spells are separate, and level 5 is a worked example rather than the keyword’s only level.
   - Made the country gate consistent: the user target remains unspecified, while the actual evidence is a US national sample.
   - Added a final numeric gate requiring 3rd-level Invisibility = two total targets, 3rd-level Fly = one target, and no stale one-target Invisibility wording.
2. `editorial/dnd-warlock-spells/planning/en/revision-1.md`
   - Durable Round 1 report and evidence record.

## Cross-checks against the permitted evidence

| Check | Result | Evidence used |
|---|---|---|
| 2024 level-5 preparation budget | **PASS** — six prepared spells; additional always-prepared features are separate. | `research/en/evidence.md` F02; R24 |
| Pact Magic budget | **PASS** — two level-3 Pact Magic slots at Warlock 5; a lower-level spell uses the level-3 slot, with its own upcast text controlling any effect change. | F01/F02; R24 and SPELL |
| Invisibility at a level-3 slot | **PASS** — two total targets: the base target plus one additional target for being one level above 2nd. | F14; G02 |
| Fly at a level-3 slot | **PASS** — one target; additional targets begin above 3rd. | F15 |
| Other planned upcast rows | **PASS** — Hex duration 8 hours; Dispel Magic automatically ends spells through 3rd; Misty Step has no listed improvement in the selected text. | F11, F13, F17; G02 |
| Concentration branch | **PASS** — Hex, Hypnotic Pattern, Invisibility, and Fly compete for one active concentration; starting another concentration spell ends the first. | F09, F11–F15; CONC |
| Version condition | **PASS** — 2024 is active; 2014 is only a short Spells Known guard rail. | F03/F06; R24/R14 |
| Search-country wording | **PASS** — user target country unspecified; recorded A-en sample is explicitly Google US national (`hl=en`, `gl=us`, `pws=0`), not city-level or universal ranking evidence. | `research/en/search-evidence.md` lines 8–14 |
| Public references | **PASS** — the card retains all 13 existing IDs: R24, R14, SPELL, CONC, LIST, EB, HEX, HP, MS, INV, FLY, CS, DM. | `task-card.md` section 7 |
| Figure plan | **PASS** — exactly the existing three service visuals remain; only the Invisibility row’s numeric label changed. | `task-card.md` section 8 |

## Validation record

The following commands are the Round 1 readback commands; their final outputs are recorded below after the edit.

| Validation | Command / method | Exit code | Key output / status |
|---|---|---:|---|
| Stale incorrect numeric phrase | `rg -n 'Invisibility[^;[:cntrl:]]*(remains one target|one target at 3rd)' editorial/dnd-warlock-spells/planning/en/task-card.md` | 1 | No match; **PASS** |
| Correct Invisibility/Fly rows | `rg -n -C 1 'Invisibility.*two target|Fly.*one target|two total targets' editorial/dnd-warlock-spells/planning/en/task-card.md` | 0 | Correct section-3, G02, figure, and acceptance-gate wording; **PASS** |
| Section-3 condition wording | `rg -n 'Spend a level-3 slot only when|higher slot is useful only when' editorial/dnd-warlock-spells/planning/en/task-card.md` | 1 | No obsolete “only when” heading/caption; current wording compares job and opportunity cost; **PASS** |
| Required reference count | `rg -n '^[|] (R24|R14|SPELL|CONC|LIST|EB|HEX|HP|MS|INV|FLY|CS|DM) [|]' editorial/dnd-warlock-spells/planning/en/task-card.md | wc -l` | 0 | 13; **PASS** |
| Figure count | `rg -n '^\\| `\\.\\./\\.\\./media/en/[^`]+\\.webp`' editorial/dnd-warlock-spells/planning/en/task-card.md | wc -l` | 0 | 3; **PASS** |
| Markdown whitespace | `awk '/[[:blank:]]$/{print FNR ":" $0; bad=1} END{exit bad}' editorial/dnd-warlock-spells/planning/en/task-card.md editorial/dnd-warlock-spells/planning/en/revision-1.md` | 0 | No trailing whitespace; **PASS** |
| Hash readback | `shasum -a 256 editorial/dnd-warlock-spells/planning/en/task-card.md editorial/dnd-warlock-spells/planning/en/revision-1.md` | 0 | `task-card.md` final SHA-256 = `b3db5e92bab30ae22947421ae4f4d07c1825cb16677cea9384999fc6ca9d79c7`; the report does not embed its own self-hash because that would change the bytes being hashed; exact command remains rerunnable; **PASS** |
| Scope readback | `git status --short --untracked-files=all -- editorial/dnd-warlock-spells/planning/en/task-card.md editorial/dnd-warlock-spells/planning/en/revision-1.md` and `git diff --name-only` | 0 | Filtered status shows only `?? .../planning/en/revision-1.md` and `?? .../planning/en/task-card.md`; `git diff --name-only` is empty. Other editorial research/internal files were present before this worker and remain untouched; **PASS** |
| Code/UI checks | No typecheck/lint/test/build or ego-browser run | N/A | Editorial-only change; code/UI validation is **UNVERIFIED / NOT APPLICABLE** for this revision. |

## Final status and limitations

- **PASS:** the targeted Round 1 layout correction is applied; the 13-reference plan, three-figure plan, version gate, five-level example budget, concentration conditions, and US-sample wording are internally consistent with the permitted A-en/shared evidence.
- **FAIL:** none found in the checked Round 1 scope.
- **UNVERIFIED / not in scope:** English body text, image files, final public-reference occurrences, D/E review, page assembly, rendered browser layout, deployment, ranking performance, city-level SERP, and user final approval. No new fact research was performed because F14/G02 already supplied the exact correction.
