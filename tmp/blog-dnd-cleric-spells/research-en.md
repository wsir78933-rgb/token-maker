# Research: dnd cleric spells (EN)

- Site: https://www.tokenmaker.one
- Locale: en
- Requested country: US
- Date: 2026-09-12
- Proposed slug: `dnd-cleric-spells`
- Status: research only. No article written. No `src/` or `public/` edits.

## SERP acquisition (do not overclaim)

| Provider | Query | Country | Language | Date | Obtained? |
| --- | --- | --- | --- | --- | --- |
| Google Search (`gl=us&hl=en&pws=0&udm=14`) | dnd cleric spells | US requested | en | 2026-09-12 | **未取得.** HTTP 200 JS interstitial, no organic results, no PAA. |
| Bing (`cc=US&setlang=en-US`) | dnd cleric spells | US parameterized | en-US | 2026-09-12 | **Yes.** Organic ranks parsed from `<li class="b_algo">`. This is **not** a US Google SERP. |
| xAI `web_search` | dnd cleric spells | not localized | unspecified | 2026-09-12 | Yes, but **generic**. Do not treat as US Google. |

PAA: **未取得.** Do not invent People Also Ask questions.

Evidence files:

- `tmp/blog-dnd-cleric-spells/serp-evidence.json`
- `tmp/blog-dnd-cleric-spells/google-us-serp.html` (blocked interstitial)
- `tmp/blog-dnd-cleric-spells/bing-us-serp.html`
- `tmp/blog-dnd-cleric-spells/official-sources.json`
- `tmp/blog-dnd-cleric-spells/official-2024-cleric-features-table.json`

---

## ReaderTask card

| Field | Value |
| --- | --- |
| Locale | en-US |
| Keyword | dnd cleric spells |
| Article type | 教程/指南 |
| Primary ReaderTask | **Prepare tomorrow’s Cleric spell list** so session one is not a scavenger hunt across the whole class list. |
| Who | A player who already chose Cleric (or is filling the sheet tonight) and needs to pick cantrips plus prepared 1st–3rd-level spells. |
| Success | They can write a legal list for **their table’s rules year**, leave Domain/subclass always-prepared spells off the daily count, keep one concentration job, keep one non-concentration rescue, and know which Channel Divinity / Divine Intervention options are **not** spells. |
| Not the job | Full Cleric build, Domain encyclopedia, every PHB/Xanathar spell, multiclass dips, power ranking the class, or a Token Maker ad. |

### Required sub-questions (only these)

1. Is this table using **2014** or **2024** Cleric spellcasting, and how many **level 1+** spells do I prepare?
2. What jobs must the list cover for one adventuring day (rescue, concentration opener, non-concentration fallback, one ritual/utility)?
3. Which Domain / subclass spells are **already prepared** so I do not spend a daily pick on them?
4. What is a legal **level 1** list and a legal **level 5** default-day list for each rules year?
5. Which 2014 vs 2024 changes actually change **today’s picks** (prepared-count formula, subclass timing, Spiritual Weapon concentration, Divine Intervention as a free Cleric spell)?

### Out of scope (do not expand)

- Full class guide (Divine Order, armor, feats, species).
- Every Domain’s full spell table beyond “always prepared, don’t double-book.”
- Spell-by-spell encyclopedia through 9th level.
- Baldur’s Gate 3 / Dungeon World / 3.5 lists.
- Copying copyrighted spell text.

---

## Existing site pages (no duplicate slug)

Confirmed: **no current slug `dnd-cleric-spells`.**

Searched `src/lib/blog/registry.ts`, `src/lib/blog-posts/`, and the repo for `dnd-cleric-spells`. Zero matches in the live tree. `WORKLOG.md` mentions a **stashed WIP** (`stash@{0}`: “preserve dnd-cleric-spells WIP”), but that slug is not registered now. Do not treat the stash as a published page.

### Related existing site pages

| Slug | EN title (registry) | Relation to this article | Overlap risk |
| --- | --- | --- | --- |
| `dnd-bless` | Bless DnD Guide: 2014 vs 2024 Rules, Best Targets, and VTT Tips | Bless is the default 1st-level concentration pick. Link out; do not rewrite Bless. | Medium if this article restates Bless components. Keep one sentence + link. |
| `paladin-2024-spells-dnd` | Paladin 2024 Spells DnD Guide: Best Picks, Smites, and Prepared Lists | Same “prepare by job” pattern; Paladin prepares fewer spells and changes only one after a Long Rest. | Low. Contrast, don’t copy Paladin lists. |
| `dnd-classes-explained` | DND Classes Explained: How to Choose the Right Class in Dungeons & Dragons | Cleric is “heal, protect, fight, solve problems.” Class-choice page, not a spell picker. | Low. |
| `dnd-bard-spells` | dnd bard spells: Best Picks for Support, Control, and Social Play | Sibling full-caster pick guide (Bard). | Low if we stay on Cleric jobs. |
| `dnd-druid-spells` | D&D Druid Spells Guide: Best Cantrips, Prepared Lists, and Circle Magic | Closest template: prepared Wisdom caster, concentration traps, example lists. | Medium. Do not reuse Druid control spells as Cleric defaults. |
| `dnd-ranger-spells` | DND Ranger Spells Guide: Best Picks, Prepared Lists, and Hunter's Mark Choices | 2014 known vs 2024 prepared contrast. | Low. |
| `dnd-character-sheet` | Fill a DnD Character Sheet in Creation Order, Not Top Down | Worked example is a **2024 level 1 Human Acolyte Cleric** copying 3 cantrips + 4 prepared spells from the Free Rules recommendations. | Medium. This article should **use** that example, not redo sheet filling. |
| `dnd-classes-comparison` | DND Classes Compared: All 13 by Party Job and First Combat Turn | Cleric as the kneeling healer on turn one. | Low. |
| `dnd-constitution-guide` | D&D Constitution Guide | Concentration checks for Bless / Spirit Guardians. | Link only. |
| `dnd-mace` | (mace equipment guide) | Cleric starting weapon, not spells. | Out of scope except a one-line equipment nod if needed. |
| `dnd-paladin` / `dnd-druid` | class pages | Adjacent divine/primal casters. | Out of scope. |
| `how-to-build-a-dnd-character-token` | token guide | Placeholder in registry. | Do not send readers to a placeholder as the main CTA. |

Live URLs (EN): `https://www.tokenmaker.one/blog/{slug}`

---

## Keyword / site relevance

tokenmaker.one is a VTT token maker. The editor has a **Cleric style preset**:

- File: `src/lib/templates/presets.ts`
- `id: 'cleric'`, `borderId: 'cleric-border-01'`, overlay tint `#f5e6c8` at 0.08 opacity
- i18n EN label: `Cleric`

The article must serve **spell preparation**, not become a token ad.

### Natural tool-use moment (one place)

After the reader locks **Bless** (ally buff) or **Spirit Guardians** (self emanation), they still have to **see those effects on the map**. That is the only honest Token Maker beat:

> Once Bless is on three tokens, or Spirit Guardians is a 15-foot bubble around the Cleric, swap the Cleric portrait onto the **Cleric border preset** and export a second “Blessed” ring/token for the affected allies. Put that **after** the prepared-list examples, not in the intro.

Editor deep-link already used on sibling posts: `EN_EDITOR_PATH` = `/{locale}/#editor-workspace`.

---

## SERP sample table

Primary sample = **Bing US-parameterized organic** (Google US 未取得).

| Rank | URL | Page type | Problem it solves | Version | Leaves unanswered | Opened? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | https://dnd5e.wikidot.com/spells:cleric | Fan list / database | “What names are on a Cleric list?” including Tasha optional + UA | 2014-mixed (says Tasha optional; includes UA cantrips) | How many to prepare; 2014 vs 2024 prep formula; Domain always-prepared; which jobs to cover tomorrow | Yes |
| 2 | https://www.dndbeyond.com/spells/class/2-cleric | Official filter UI | Search/filter Cleric spells; shows Legacy + 2024 duplicates | Mixed 2014 Legacy + 2024 | Preparation rules; Domain extras; which four to pick at level 1; mixes third-party and splat | Yes |
| 3 | https://rpgbot.net/dnd5/characters/classes/cleric/spells/ | Optimization guide (ratings) | Color-rated “best” Cleric spells for 2014 optimization | **2014** (page breadcrumb: 2014 Rules; last-updated note in intro) | 2024 prepared table; 2024 Spiritual Weapon concentration; Divine Intervention rewrite; session-ready short lists | Yes (Bing `/dnd5e/` URL 404’d; live page is `/dnd5/`) |
| 4 | http://dnd2024.wikidot.com/cleric:spell-list | Fan 2024 list (claimed) | Would be a 2024 name list | 2024 (title only) | Entire page | **未取得** (redirect loop) |
| 5 | https://5thsrd.org/spellcasting/spell_lists/cleric_spells/ | 2014 SRD name list | SRD Cleric names + school | 2014 SRD (page points to 5e24srd.com for 2024) | Prep counts, Domain spells, advice, 2024 list gaps (no Toll the Dead here) | Yes |
| 6 (next reachable) | https://dnd5e.wikidot.com/spells:cleric-core | Fan “core” list | Name list without some Tasha/UA | Still 2014-era; still includes Toll the Dead / Word of Radiance / Ceremony | Same prep-job gap as rank 1 | Yes |

### Generic web_search extras (not US Google ranks)

Opened only if needed for contrast; **not** claimed as Google US:

- https://www.wargamer.com/dnd/cleric-spells-5e — 2014-style name tables by level (snippet dated 2023). Encyclopedia, not a prep guide.
- https://www.dndlounge.com/cleric-spells-5e/ — “best by level” ratings (2014).
- https://rpgbot.net/2024-dnd/classes/cleric/cleric-spells/ — 2024 optimization encyclopedia (exists; **not** in Bing top 5). Closest competitor for 2024 advice, still not a short “prepare tomorrow” task.
- https://wastedwizardgames.com/dnd/character-creation/dnd-2024-classes/cleric/ — 2024 **class** guide with a reprinted features table and beginner builds. Opened as a **secondary reprint**, not official.

Typical SERP intent split: **list dumps** (wikidot, DDB filter, SRD) vs **optimization encyclopedias** (RPGBOT, Lounge). Almost nobody in the opened set starts with “how many do you prepare today, and which Domain spells are already on the sheet.”

---

## Official sources actually opened

### 2014 Basic Rules — Cleric exists

- URL: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Cleric
- Spell list: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#ClericSpells
- Status: **Opened.** Cleric class text and Cleric spell list are present.

### 2024 Free Rules — Cleric exists

- URL: https://www.dndbeyond.com/sources/dnd/free-rules/character-classes (Cleric heading `#Cleric`)
- Duplicate fetch: https://www.dndbeyond.com/sources/dnd/br-2024/character-classes
- Spells chapter: https://www.dndbeyond.com/sources/dnd/free-rules/spells
- Status: **Opened.** Free Rules include the full Cleric class (Life Domain only), the Cleric spell list, and the general ritual/preparation rules.

Limitation: Free Rules 2024 **cantrip list** on the class page is Guidance, Light, Mending, Resistance, Sacred Flame, Spare the Dying, Thaumaturgy. Toll the Dead and Word of Radiance appear on the D&D Beyond **class filter** as 2024 entries and in a DDB forum post as 2024 PHB-not-Free-Rules. Do not present the filter as the Free Rules list.

---

## What the official pages actually say (facts, not advice)

Spell **names** may be used. Do **not** copy full spell descriptions into the article.

### Spellcasting ability

| Version | Claim | Source |
| --- | --- | --- |
| 2014 | Wisdom is the spellcasting ability for cleric spells. Spell save DC = 8 + proficiency bonus + Wisdom modifier. Spell attack modifier = proficiency bonus + Wisdom modifier. | 2014 Basic Rules, Cleric Spellcasting |
| 2024 | Wisdom is the spellcasting ability for Cleric spells. General 2024 formula in the Spells chapter: DC = 8 + spellcasting ability modifier + Proficiency Bonus; attack = modifier + Proficiency Bonus. | 2024 Free Rules Cleric; Spells chapter |

### Prepared vs known

| Version | Level 1+ spells | Cantrips | Source |
| --- | --- | --- | --- |
| 2014 | **Prepared**, not known. Number = Wisdom modifier + Cleric level (minimum 1). Must be of a level for which you have slots. Example: 3rd-level Cleric, Wisdom 16 → **six** 1st- or 2nd-level spells in any combination. Casting does not un-prepare the spell. | Known: 3 at 1st, more at 4th and 10th per the Cleric table. | 2014 Basic Rules |
| 2024 | **Prepared** from the Cleric list. At 1st level **choose four** 1st-level spells (recommended: Bless, Cure Wounds, Guiding Bolt, Shield of Faith). Count comes from the **Prepared Spells** column. Example: level 3 Cleric list can include **six** spells of levels 1 and 2 in any combination. | Known: 3 at level 1 (recommended Guidance, Sacred Flame, Thaumaturgy). May replace one cantrip whenever you gain a Cleric level. Extra cantrip at levels 4 and 10. | 2024 Free Rules Cleric |

**Official 2024 Prepared Spells column** (parsed from live HTML `#ClericFeatures` on 2026-09-12, URL above):

| Level | Prepared Spells | Cantrips | Channel Divinity uses |
| --- | --- | --- | --- |
| 1 | 4 | 3 | — |
| 2 | 5 | 3 | 2 |
| 3 | 6 | 3 | 2 |
| 4 | 7 | 4 | 2 |
| 5 | 9 | 4 | 2 |
| 6 | 10 | 4 | 3 |
| 7 | 11 | 4 | 3 |
| 8 | 12 | 4 | 3 |
| 9 | 14 | 4 | 3 |
| 10 | 15 | 5 | 3 |
| 11–12 | 16 | 5 | 3 |
| 13–14 | 17 | 5 | 3 |
| 15–16 | 18 | 5 | 3 |
| 17 | 19 | 5 | 3 |
| 18 | 20 | 5 | 4 |
| 19 | 21 | 5 | 4 |
| 20 | 22 | 5 | 4 |

### Changing the list

| Version | When | How many |
| --- | --- | --- |
| 2014 | Finish a long rest | Whole list. Preparing a new list takes at least 1 minute per spell level for each spell on the list. |
| 2024 class text | Finish a Long Rest | Replace **any** of the prepared Cleric spells with other Cleric spells you have slots for. |
| 2024 Spells chapter table | Cleric: change when you finish a Long Rest | Number of spells: **Any** (contrast Paladin/Ranger: One; Bard/Sorcerer/Warlock: One when you gain a level). |

### Domain / subclass extra spells

| Version | When you choose subclass | Always prepared? | Counts against daily prep? |
| --- | --- | --- | --- |
| 2014 | **1st level** Divine Domain (Basic Rules lists Knowledge, Life, Light, Nature, Tempest, Trickery, War; Life is fully printed) | “Once you gain a domain spell, you always have it prepared” | “it doesn’t count against the number of spells you can prepare each day.” Off-list domain spells are still cleric spells for you. |
| 2024 | **Level 3** Cleric Subclass. Free Rules print **Life Domain** only. | Life Domain Spells: when you reach the listed Cleric level, you thereafter **always have the listed spells prepared**. | Class Spellcasting: always-prepared spells from another Cleric feature **don’t count** against the prepared number, but still count as Cleric spells. Same rule in the Spells chapter “Always-Prepared Spells.” |

**2014 Life Domain Spells** (Basic Rules):

| Cleric Level | Spells |
| --- | --- |
| 1st | Bless, Cure Wounds |
| 3rd | Lesser Restoration, Spiritual Weapon |
| 5th | Beacon of Hope, Revivify |
| 7th | Death Ward, Guardian of Faith |
| 9th | Mass Cure Wounds, Raise Dead |

**2024 Life Domain Spells** (Free Rules):

| Cleric Level | Prepared Spells |
| --- | --- |
| 3 | Aid, Bless, Cure Wounds, Lesser Restoration |
| 5 | Mass Healing Word, Revivify |
| 7 | Aura of Life, Death Ward |
| 9 | Greater Restoration, Mass Cure Wounds |

This is a **spell-choice** conflict: a 2014 Life Cleric should not spend a daily pick on Bless/Cure Wounds from level 1; a 2024 Life Cleric does not get those always-prepared until **level 3**, and then they include Aid instead of Spiritual Weapon.

### Ritual

| Version | Rule | Source |
| --- | --- | --- |
| 2014 Cleric | Cast a cleric spell as a ritual if it has the ritual tag **and you have it prepared**. | 2014 Basic Rules, Ritual Casting |
| 2024 general | Ritual tag: 10 minutes longer, **doesn’t expend a spell slot**. “To cast a spell as a Ritual, a spellcaster must have it prepared.” | 2024 Free Rules Spells chapter |
| 2024 Cleric class entry | No separate “Ritual Casting” subclass-style bullet (unlike 2014). Rituals still work through the general rule **if prepared**. | 2024 Cleric Spellcasting vs Spells chapter |

2024 Free Rules Cleric list marks ritual with **R** on Detect Magic, Detect Poison and Disease, Purify Food and Drink, Augury, Gentle Repose, Silence, Meld into Stone, Water Walk, Divination, Commune, Forbiddance (and others at higher levels).

### Channel Divinity vs spells

| Version | Fact |
| --- | --- |
| 2014 | Level 2 feature, **not** a spell. Start with Turn Undead + a domain effect. One use per short or long rest; two at 6th; three at 18th. DC = cleric spell save DC. |
| 2024 | Level 2 feature, **not** a spell. Start with **Divine Spark** and **Turn Undead**. Two uses at level 2; regain one on a Short Rest, all on a Long Rest; more uses on the table. DC = this class’s spell save DC. Divine Spark is a Magic action: 1d8 + Wisdom modifier as healing **or** Necrotic/Radiant damage (Con save, half on success), extra d8 at 7/13/18. |

Do not tell readers to “prepare Turn Undead.”

### Divine Intervention vs spells

| Version | Fact |
| --- | --- |
| 2014 | Level 10. Action. Describe aid, roll percentile; succeed if roll ≤ Cleric level. DM chooses the nature; “the effect of any cleric spell or cleric domain spell would be appropriate.” Success → cannot use again for **7 days**; failure → again after a long rest. Level 20: succeeds automatically. |
| 2024 | Level 10. Magic action: choose any **Cleric spell of level 5 or lower that doesn’t require a Reaction**, and cast it **without a spell slot or Material components**. Can’t use again until a Long Rest. Level 20 Greater Divine Intervention: may choose **Wish**; if so, can’t use Divine Intervention again until **2d4 Long Rests**. |

Spell-choice implication (fact, not ranking): 2024 Divine Intervention can supply one 5th-or-lower Cleric spell per day without a slot. It is still not a reason to skip preparing Revivify if you need that spell **before** level 10, or when the feature is already spent.

### Cantrips (Free Rules lists)

2014 Basic Rules Cleric cantrips: Guidance, Light, Mending, Resistance, Sacred Flame, Spare the Dying, Thaumaturgy.

2024 Free Rules Cleric cantrips: same seven names. Recommended start: Guidance, Sacred Flame, Thaumaturgy. 2024 Thaumaturge Divine Order (level 1, **not** a Domain) grants **one extra Cleric cantrip**. That is a cantrip-count fact, not a build guide.

### 2014 vs 2024 differences that affect SPELL CHOICE (not the whole class)

Verified from opened pages:

1. **Prepared count formula** — 2014: Wis mod + level. 2024: table (4 at 1, 5 at 2, 6 at 3, 9 at 5, 15 at 10, 22 at 20). A Wisdom 16 Cleric 1 is **4** in both. A Wisdom 16 Cleric 5 is **8** in 2014 (5+3) vs **9** in 2024. A Wisdom 20 Cleric 10 is **15** in both (10+5 vs table 15). Do not say “2024 always prepares more.”
2. **How many you can swap** — both can rebuild after a Long Rest (2024 class: any; 2024 Paladin comparison: only one).
3. **Subclass timing** — 2014 Domain at 1 (always-prepared Bless/Cure Wounds for Life immediately). 2024 subclass at 3 (level 1 list is entirely daily picks).
4. **Life always-prepared package changed** — 2014 has Spiritual Weapon / Beacon of Hope / Guardian of Faith / Raise Dead; 2024 has Aid / Mass Healing Word / Aura of Life / Greater Restoration.
5. **Spiritual Weapon** — 2014 Basic Rules list does not mark it concentration in the class list presentation; 2024 Free Rules Cleric list marks Spiritual Weapon **C** (Concentration). That changes whether it shares a slot with Bless or Spirit Guardians. Do not paste either spell’s full text; point at the lists.
6. **Channel Divinity toolbox** — 2024 Divine Spark is a no-slot heal/damage button; 2014 Life Preserve Life is domain-gated. 2024 Turn Undead inflicts Frightened + Incapacitated; 2014 is the older turned-undead behavior. Neither is a prepared spell.
7. **Divine Intervention** — 2014 percentile + DM fiat vs 2024 guaranteed Cleric spell ≤ 5 (no Reaction). Changes whether you treat 4th–5th utility (Greater Restoration, Raise Dead, Commune) as “must always prepare.”
8. **Ritual access** — both require the spell prepared; 2024 just moved the sentence to the Spells chapter.
9. **Free Rules vs PHB 2024 list** — Free Rules Cleric list through 9th is printed on the class page (opened). DDB class filter adds Toll the Dead, Word of Radiance, Aura of Vitality, Circle of Power, Summon Celestial, Power Word Fortify, etc., including Legacy duplicates. Article must say which source the table is using.

Not for this article (class-wide, not spell-choice): Divine Order Protector vs Thaumaturge armor; Sear Undead; Blessed Strikes; Destroy Undead vs Sear Undead.

---

## Fact table

Type: `rule` = printed mechanic. `advice` = editorial pick. `meta` = SERP/site observation.

| id | type | claim | source URL | version | limitation | public |
| --- | --- | --- | --- | --- | --- | --- |
| F01 | rule | 2014 Cleric prepares Wisdom modifier + Cleric level (min 1) level 1+ cleric spells of slot-legal levels. | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Cleric | 2014 Basic Rules | Basic Rules, not full 2014 PHB splat | yes |
| F02 | rule | 2014 example: Cleric 3, Wisdom 16 → six prepared 1st/2nd-level spells. | same | 2014 | Example assumes Wisdom 16 | yes |
| F03 | rule | 2014: change prepared list after a long rest; 1 minute per spell level for each spell on the list. | same | 2014 | Time cost is 2014-only in the class text | yes |
| F04 | rule | 2014/2024: Wisdom is Cleric spellcasting ability; holy symbol can be the focus. | 2014 Cleric; 2024 Cleric | both | 2024 class text does not reprint the DC formula; Spells chapter does | yes |
| F05 | rule | 2014: ritual only if ritual tag **and** prepared. | 2014 Cleric Ritual Casting | 2014 | — | yes |
| F06 | rule | 2014 Domain at 1st; domain spells always prepared and do not count against daily prep. | 2014 Domain Spells | 2014 | Basic Rules prints Life fully; other domains named only | yes |
| F07 | rule | 2014 Life domain spells: Bless/Cure Wounds (1); Lesser Restoration/Spiritual Weapon (3); Beacon of Hope/Revivify (5); Death Ward/Guardian of Faith (7); Mass Cure Wounds/Raise Dead (9). | 2014 Life Domain Spells table | 2014 | Life only | yes |
| F08 | rule | 2014 Channel Divinity is a class feature (Turn Undead + domain), not a prepared spell. | 2014 Channel Divinity | 2014 | — | yes |
| F09 | rule | 2014 Divine Intervention (10): percentile ≤ level; DM picks nature (cleric/domain spell effect appropriate); 7 days after success. Auto-success at 20. | 2014 Divine Intervention | 2014 | Not a spell on the list | yes |
| F10 | rule | 2024 level 1: prepare four 1st-level Cleric spells. Recommended Bless, Cure Wounds, Guiding Bolt, Shield of Faith. | https://www.dndbeyond.com/sources/dnd/free-rules/character-classes | 2024 Free Rules | Recommendation is official, not mandatory | yes |
| F11 | rule | 2024 prepared count is the table column (4/5/6/7/9/10/11/12/14/15/16/16/17/17/18/18/19/20/21/22). | same, HTML `#ClericFeatures` | 2024 Free Rules | Markdown fetch dropped columns; numbers taken from live HTML 2026-09-12 | yes |
| F12 | rule | 2024: after a Long Rest, replace **any** prepared Cleric spells with other slot-legal Cleric spells. | 2024 Cleric; Spells chapter table (Cleric = Any) | 2024 | — | yes |
| F13 | rule | 2024 always-prepared feature spells do not count against the prepared number. | 2024 Cleric Spellcasting; Spells chapter Always-Prepared Spells | 2024 | — | yes |
| F14 | rule | 2024 subclass at level 3. Life Domain always-prepared from the Life Domain Spells table starting at 3. | 2024 Life Domain | 2024 Free Rules | Only Life is in Free Rules | yes |
| F15 | rule | 2024 Life always-prepared: 3 Aid/Bless/Cure Wounds/Lesser Restoration; 5 Mass Healing Word/Revivify; 7 Aura of Life/Death Ward; 9 Greater Restoration/Mass Cure Wounds. | 2024 Life Domain Spells table | 2024 | Different package than 2014 Life | yes |
| F16 | rule | 2024 ritual: prepared + Ritual tag; +10 minutes; no slot. | https://www.dndbeyond.com/sources/dnd/free-rules/spells | 2024 | Class entry has no extra ritual bullet | yes |
| F17 | rule | 2024 Channel Divinity (Divine Spark, Turn Undead) is not a spell; 2 uses at level 2. | 2024 Cleric Channel Divinity | 2024 | — | yes |
| F18 | rule | 2024 Divine Intervention: Magic action, Cleric spell ≤ 5 that is not a Reaction, no slot, no Materials, 1/Long Rest. L20 may pick Wish, then 2d4 Long Rests. | 2024 Divine Intervention / Greater Divine Intervention | 2024 | Wish is not a Cleric-list spell; it is a special DI option at 20 | yes |
| F19 | rule | 2024 Free Rules Cleric list marks Spiritual Weapon as concentration (`C`). | 2024 Cleric Spell List | 2024 Free Rules | Do not copy the spell block | yes |
| F20 | rule | 2014 Basic Rules Cleric spell list (names through 9th) is printed under `#ClericSpells`. | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#ClericSpells | 2014 | Basic Rules list, not Xanathar/Tasha | yes |
| F21 | rule | 2024 Free Rules Cleric spell list (names + school + C/R/M) is printed on the class page. | 2024 Cleric Spell List | 2024 Free Rules | Not the full 2024 PHB list | yes |
| F22 | meta | No live slug `dnd-cleric-spells` in registry or blog-posts. | repo grep 2026-09-12 | site | Stash mentioned in WORKLOG only | no (internal) |
| F23 | meta | Editor has Cleric preset `cleric` / `cleric-border-01`. | `src/lib/templates/presets.ts` | site | Product fact | no (internal), public on live editor |
| A01 | advice | Cover four jobs: concentration opener, bonus-action rescue, non-concentration fallback, one ritual/utility. | editorial; jobs mapped to named spells that appear on official lists | n/a | Advice | n/a |
| A02 | advice | Do not spend a 2024 daily pick on Bless if you are a Life Cleric **level 3+** (always prepared). Do spend it at 2024 level 1. | follows F10+F15 | mixed | Advice built on rules | n/a |
| A03 | advice | 2014 Spiritual Weapon can sit beside Bless; 2024 Spiritual Weapon competes for concentration with Bless and Spirit Guardians. | F19 + 2014 list presentation | mixed | Confirm table’s spell text; don’t paste it | n/a |

---

## Source conflicts (flag these in the article)

1. **Prepared count** — 2014 formula vs 2024 table. Same at some breakpoints (Wis 16 level 1 = 4; Wis 20 level 10 = 15), different at others (Wis 16 level 5: 8 vs 9). Never quote one formula for both years.
2. **Domain always-prepared timing** — 2014 Life at **level 1** vs 2024 Life at **level 3**.
3. **Life domain spell packages** — Spiritual Weapon / Beacon of Hope / Guardian of Faith / Raise Dead (2014) vs Aid / Mass Healing Word / Aura of Life / Greater Restoration (2024).
4. **Spiritual Weapon concentration** — 2024 Free Rules list marks `C`; 2014 Basic Rules class list does not. This is the highest-impact pick change for 2nd-level combat.
5. **Divine Intervention** — percentile + DM (2014) vs guaranteed ≤5th Cleric spell (2024).
6. **List completeness** — Wikidot “core” still includes Xanathar cantrips. 5thsrd matches 2014 SRD. DDB filter mixes Legacy, 2024, and partnered content. Free Rules 2024 omits some 2024 PHB Cleric spells (forum + filter). Article must name the source under each sample list.
7. **RPGBOT 2014 vs RPGBOT 2024** — two different sites; Bing top 5 was the **2014** guide. Do not mix ratings.
8. **WWG reprinted 2024 table** — matches the official HTML table we parsed, but WWG is **not** the citation. Cite D&D Beyond Free Rules.
9. **WWG’s 2014 aside** (“about 5 at L1, 25 at L20”) is **wrong** against official 2014 text (Wis mod + level; Wis 16 L1 = 4, Wis 20 L20 = 25). Do not copy that sentence.

---

## Information gain vs typical SERP

Keep the article **narrower** than RPGBOT/Wikidot, not larger.

What top opened results lack:

- A single **ReaderTask**: write tonight’s prepared list.
- A **version gate** in the first screen (2014 formula vs 2024 table, with official numbers).
- **Always-prepared Domain spells** as a subtraction step before picking.
- Treating **Channel Divinity / Divine Intervention as slot substitutes**, not as spells to prepare.
- Two **short legal lists** (level 1 and level 5) per rules year, not 9 levels of ratings.
- The **2024 Spiritual Weapon concentration** collision with Bless / Spirit Guardians.
- A pointer to this site’s existing **Bless** article and **character-sheet Cleric example** instead of repeating them.

What **not** to add just to out-rank: Domain encyclopedia, feat paths, species, every 6th–9th spell, BG3, 3.5.

---

## Recommended H2 plan (editing outline, not the article)

1. **Prepare a Cleric list for one adventuring day** — task, not a dictionary. Link 2014 + 2024 official class pages.
2. **Confirm 2014 vs 2024 before you pick names** — prepared-count table vs Wis+level; what you can swap after a Long Rest.
3. **Subtract spells you already have prepared** — Domain/subclass always-prepared; 2024 Life table vs 2014 Life table.
4. **Four jobs, then names** — concentration opener / bonus-action rescue / non-concentration turn / ritual-or-utility. (Advice section; names from official lists only.)
5. **Cantrips that stay on the card** — official recommended 2024 trio; 2014 same seven-name Free/Basic list; Thaumaturge extra cantrip as a count, not a build.
6. **Level 1 prepared list (2014 and 2024)** — four names; note 2014 Life already has Bless + Cure Wounds.
7. **Level 5 default-day list (2014 and 2024)** — include Spirit Guardians, Revivify, Dispel Magic as named options; show concentration conflict.
8. **What not to spend a pick on** — Channel Divinity, Divine Intervention, duplicating always-prepared Domain spells, stacking two concentration openers.
9. **Mark Bless and Spirit Guardians on the VTT** — **single Token Maker CTA** (Cleric preset + Blessed ally tokens). Then stop selling the tool.
10. **FAQ** — how many prepared; is Cleric a known-spell caster (no); can I ritual without preparing (no); does Divine Intervention replace Revivify on the list (no before 10; at 10 it is a once-per-day backup in 2024).
11. **Sources** — official URLs only in the body; wikidot/RPGBOT as “lists and ratings exist” if needed, not as rules.

Skip: “every Cleric spell by level,” “best Domain,” “Cleric DPS ranking.”

---

## Natural Token Maker CTA (one place)

**Where:** end of H2 9, after the reader has a Bless + Spirit Guardians plan.

**Why it is not forced:** those two spells are area/status effects that are easy to lose on a crowded VTT. The product already has a Cleric border preset.

**What to say (editorial, not copy-final):** export the Cleric on the Cleric preset; export a second token or ring for Blessed allies; do not rebuild the character in the editor.

Do **not** put a CTA in the intro, FAQ, or cantrip section.

---

## Public references

| id | label | url | Supports | versionNote |
| --- | --- | --- | --- | --- |
| R1 | 2014 Basic Rules — Cleric | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Cleric | F01–F09, ability, prep, ritual, domain, CD, DI | 2014 Basic Rules |
| R2 | 2014 Basic Rules — Cleric spell list | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#ClericSpells | F20, names for sample lists | 2014 Basic Rules |
| R3 | 2024 Free Rules — Cleric | https://www.dndbeyond.com/sources/dnd/free-rules/character-classes | F10–F15, F17–F19, F21, features table | 2024 Free Rules (Life Domain only) |
| R4 | 2024 Free Rules — Spells | https://www.dndbeyond.com/sources/dnd/free-rules/spells | F12 (prep-by-class table), F16 ritual, always-prepared, combining identical spells (Bless doesn’t stack) | 2024 |
| R5 | 2024 br-2024 classes (same Cleric text in this fetch) | https://www.dndbeyond.com/sources/dnd/br-2024/character-classes | Duplicate of R3 | 2024 |
| R6 | DDB Cleric spell filter | https://www.dndbeyond.com/spells/class/2-cleric | Existence of Legacy vs 2024 duplicates; PHB-only names | Mixed; not a prep rule |
| R7 | tokenmaker.one Bless guide | https://www.tokenmaker.one/blog/dnd-bless | Bless targeting / 2014 vs 2024 component | site |
| R8 | tokenmaker.one Paladin 2024 spells | https://www.tokenmaker.one/blog/paladin-2024-spells-dnd | Contrast: Paladin prepares fewer, swaps one | site |
| R9 | tokenmaker.one character sheet | https://www.tokenmaker.one/blog/dnd-character-sheet | Level 1 2024 Cleric worked example | site |
| R10 | tokenmaker.one Druid spells | https://www.tokenmaker.one/blog/dnd-druid-spells | Sibling prepared-Wisdom pattern | site |
| R11 | tokenmaker.one Bard spells | https://www.tokenmaker.one/blog/dnd-bard-spells | Sibling caster picker | site |
| R12 | tokenmaker.one Ranger spells | https://www.tokenmaker.one/blog/dnd-ranger-spells | 2014 known vs 2024 prepared contrast | site |
| R13 | tokenmaker.one classes explained | https://www.tokenmaker.one/blog/dnd-classes-explained | Cleric as useful support-fighter | site |
| R14 | 5thsrd Cleric list | https://5thsrd.org/spellcasting/spell_lists/cleric_spells/ | 2014 SRD names | 2014 SRD; not 2024 |
| R15 | Wikidot Cleric list | https://dnd5e.wikidot.com/spells:cleric | SERP competitor; Tasha/UA mixed | unofficial |
| R16 | RPGBOT 2014 Cleric spells | https://rpgbot.net/dnd5/characters/classes/cleric/spells/ | SERP competitor; ratings | 2014 optimization, unofficial |
| R17 | RPGBOT 2024 Cleric spells | https://rpgbot.net/2024-dnd/classes/cleric/cleric-spells/ | Closest 2024 encyclopedia competitor; **not** Bing top 5 | 2024 optimization, unofficial |

Do not cite WWG as rules. Do not cite Dungeon World, d20srd 3.5, or BG3 for this keyword.

---

## Suggested sample lists (advice; names only)

These are **editorial starting lists**, not official “best.” Every name appears on the corresponding official list opened above. Domain always-prepared names are omitted from the daily count when the reader’s subclass already grants them.

### 2024 Free Rules — level 1 (4 prepared)

Bless, Cure Wounds, Guiding Bolt, Healing Word  
(Official recommended set is Bless, Cure Wounds, Guiding Bolt, Shield of Faith. Healing Word vs Shield of Faith is a job choice: rescue vs AC. Cantrips: Guidance, Sacred Flame, Thaumaturgy.)

### 2014 Basic Rules — level 1, **not** Life (Wis 16 → 4 prepared)

Same four jobs. If the character **is** 2014 Life, Bless and Cure Wounds are already always prepared; spend the daily picks on Healing Word, Guiding Bolt, Shield of Faith, and Detect Magic (ritual).

### 2024 — level 5 (9 prepared) default dungeon day

Keep: Healing Word, Guiding Bolt, Detect Magic (ritual), Aid *if not Life 3+*, Spiritual Weapon *or* Hold Person (concentration budget), Lesser Restoration *if not Life*, Spirit Guardians, Revivify, Dispel Magic.  
Drop whatever Life already always-prepares (Aid, Bless, Cure Wounds, Lesser Restoration, Mass Healing Word, Revivify at 5).

### 2014 — level 5 Life (Wis 16 → 8 prepared)

Do not re-prepare Bless, Cure Wounds, Lesser Restoration, Spiritual Weapon, Beacon of Hope, Revivify. Spend daily picks on Healing Word, Shield of Faith or Guiding Bolt, Detect Magic, Aid, Spiritual **Guardians**, Dispel Magic, plus one flex (Silence ritual or Protection from Energy).

Exact final lists belong in the article draft, not here.

---

## Article risks / legal

- Use spell **names** and mechanical **facts** from opened official pages.
- Do not paste full spell text (Bless, Spirit Guardians, Revivify, etc.).
- Label 2014 vs 2024 on every list.
- Label advice vs rule.
- Free Rules 2024 ≠ full 2024 PHB list.

---

## Verification of this research

- Registry/blog-posts grep: no `dnd-cleric-spells`.
- Official 2014 Cleric + spell list: opened.
- Official 2024 Free Rules Cleric + Spells chapter: opened.
- 2024 features table: parsed from live HTML (not the broken markdown table).
- Bing US-parameterized SERP: saved; first 5 organic attempted; rank 4 未取得; ranks 1–3, 5, 6 opened.
- Google US SERP: 未取得.
- PAA: 未取得.
