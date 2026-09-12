# Independent review — dnd cleric spells (EN)

- Reviewer: independent (did not draft `body-en.html`)
- Date: 2026-09-12
- Genre: 教程/指南
- ReaderTask: Prepare tomorrow’s Cleric spell list for the table’s rules year. Success: legal prepare count, Domain not double-booked, one concentration job, one non-concentration rescue.
- Body: `tmp/blog-dnd-cleric-spells/body-en.html`
- Count file on disk: `tmp/blog-dnd-cleric-spells/count-en.md`
- sha256 of that count file (verified this session): `ac13781efb3b2b867be0652f726fa5058c4affcea871a2d88a92fca8b9c2c941`
- Mechanical length: 5308 EN words excluding FAQ (already run). Floor 2000 met. This review judges semantic qualification only.
- Layer 8 user review: 尚未进行. Content review is not page-ready, deploy, or live-site pass.
- Titles/descriptions: not in this file; not generated here. No Google ranks claimed (research: US Google SERP 未取得).

**Verdict: REVISE.** Do not bind PASS to `ac13781efb3b2b867be0652f726fa5058c4affcea871a2d88a92fca8b9c2c941`. Pending new hash after the local patches below.

The year gate, Life subtraction tables, Healing Word vs official four, and 2014/2024 Spiritual Weapon split are usable. The fail points are: three alts/captions that describe cards, stamps, VTT grids, and Bless markers that are not in the planned photos; one always-prepared Bless treated as if it can leave the list; the 2014 Life level 1 example re-booking Shield of Faith as a backup Bless after the body forbids that; 2024 Spiritual Weapon sitting in the Fallback row that requires a non-concentration name; the 2024 Life level 5 nine preparing Hold Person beside Spirit Guardians for the same fight.

---

## 1. 22-rule table

“命中” quotes the original sentence. “未命中” means this pass did not find a real instance of that failure, not a detector score. Necessary year splits, job labels, and tables are protected.

| # | Rule | Result | Evidence |
|---|---|---|---|
| 1 | 堵住所有反驳 | 未命中 | Bard/Paladin/no-healer/undead/travel branches change the sheet. Not invented rebuttals. |
| 2 | 知识全部输出 | 未命中 | Stays on prepare count, Domain subtraction, four jobs, L1/L5 lists, pick-changing 2014 vs 2024 diffs. L7–L9 Life names sit in the official subtraction table, not as a 9th-level encyclopedia. |
| 3 | 匀速排比 | 未命中 | Swap lines and tables are parallel because the fields match. Content is not synonym-only. |
| 4 | 让步模板反复出现 | 未命中 | No mechanical “although…however…” loop. |
| 5 | 反复给概念命名 | 未命中 | “Counted,” “always-prepared,” and the four jobs are the sheet language. No “I call this…” ritual. |
| 6 | 情绪曲线太光滑 | 不适用 | Procedure, not a fake journey. |
| 7 | 虚构读者错误再反驳 | 未命中 | “Ugly 2024 mistake” and the fake “four” of Bless + Cure Wounds + Guiding Bolt + Shield of Faith are specific illegal sheets, not “everyone thinks.” |
| 8 | 高密度“不是X而是Y” | 未命中 | Many not-X distinctions (cantrip vs prepared, Channel vs spell, 2014 SW vs 2024 SW). They are the task. Do not strip them for rhythm. |
| 9 | 没有任何犹豫 | 未命中 | Toll the Dead / Word of Radiance limited to Free Rules. Other domains: open the printed table, do not invent Light/War lists. |
| 10 | 虚假精确 | 未命中 | Prepare counts, Healing Word dice, Life tables, and Cleric 3 slot example match `official-cleric-spell-facts.md`. “Next six hours” is session talk, not a rule duration. |
| 11 | 脆弱经历只为论点服务 | 不适用 | “I write / I put / I cut” is procedure, not a failure memoir. |
| 12 | 复杂问题突然变万能步骤 | 命中 | The jobs table defines Fallback as a turn that “must work without concentration,” then parks 2024 Spiritual Weapon there. The body forbids Shield of Faith as a backup Bless, then the 2014 Life level 1 example prepares it as the backup opener. 2024 Life 3 tells the reader to take Spiritual Weapon only if Bless is “coming off,” which always-prepared Bless cannot do. |
| 13 | 每段都收束成金句 | 未命中 | Closers are checks and names, not profundity. Recap waste is Repetition, not this rule. |
| 14 | 句子节奏过于均匀 | 未命中 | Mix of short job lines and long worked lists. |
| 15 | 感受替代论证 | 未命中 | Dice, table counts, and official pages carry the rules claims. |
| 16 | 开头只剩钩子、痛点、承诺 | 未命中 | First paragraph is the four checks. |
| 17 | 连接词固定且密集 | 未命中 | No “值得注意 / 事实上” filler stack. |
| 18 | 刻意同义替换 | 未命中 | Domain vs subclass follows the year. Counted / always-prepared stay stable. |
| 19 | 中文翻译腔或非母语表达 | 未命中 | Natural English. Spell names un-translated, correctly. |
| 20 | 虚构故事或案例 | 未命中 | L1/L5 lists labeled examples. No “we tested.” |
| 21 | 通用祝福结尾 | 未命中 | Ends on checks, not a blessing. |
| 22 | 强行追求深刻 | 未命中 | Stays on tonight’s card. |

**Original sentences for rule 12 (命中):**

> Fallback … 2024 Spiritual Weapon only if Bless or Spirit Guardians is not running  
> This is the turn you still have after the opener is up … It must work without concentration.

> I also stop preparing Shield of Faith as a “backup Bless.” It needs the same slot in your concentration budget.

> Example Life list: Healing Word, Guiding Bolt, Shield of Faith, and a utility name such as Detect Magic or Protection from Evil and Good. That is one concentration job (Bless, free from Domain, or Shield of Faith if you recast)

> Pick Spiritual Weapon only if Bless is coming off for the day, because both need concentration in 2024.

Site voice (`src/lib/blog/index.test.ts` forbidden search-intent / ranking-planning phrases): none present.

---

## 2. Six form fingerprints

| Fingerprint | Result | Note |
|---|---|---|
| 破折号过密 | 未命中 | No em dashes. En dashes only in table ranges `1–2`, `3–4`, `5–6`. |
| 粗体过密 | 轻度 | One keyword bold in sentence 1; four job labels in the first table; ten `<strong>` labels on the post-FAQ list. Body paragraphs are not bold-stuffed. Shrink the recap list (patch 8) and this drops. |
| 无用装饰符号 | 未命中 | No emoji, stars, or fake icons. |
| 助手残留 | 命中 | “That live HTML table lists 4 prepared spells…” is researcher process (`official-cleric-spell-facts.md` F-2024-03 limitation: parsed from live HTML). Readers need the Cleric Features table, not the scrape. `${…}` URL slots are assembly tokens, expected in this file. |
| 填充短语 | 未命中 | “Ugly 2024 mistake” names a real double-book. |
| 泛泛积极结尾 | 未命中 | Last block is a card check, not “you’ve got this.” |

---

## 3. Fact / citation check vs `official-cleric-spell-facts.md`

Checked numbers and year labels against that file (not against memory). Wrong year or unsourced number listed. Derived arithmetic from a sourced formula is noted, not treated as a new source.

### Sourced and correct

| Claim in body | Fact-id |
|---|---|
| 2014 prepare = Wisdom modifier + Cleric level, min 1; slot-legal levels | F-2014-02 |
| Wis 16 Cleric 1/2/3/4/5 → 4/5/6/7/8 | F-2014-02 + F-DIFF-PREP-COUNT (Cleric 3 example F-2014-04) |
| 2014 Cleric 3 Wis 16: four 1st-level slots, two 2nd-level slots, six prepared 1st or 2nd | F-2014-04 |
| Casting does not un-prepare; full list after Long Rest; ≥1 minute per spell level | F-2014-05, F-2014-06 |
| 2024 count is Prepared Spells column: 4, 5, 6, 7, 9 through level 5; choose four 1st-level at 1; level 3 mix of 1st and 2nd = 6 | F-2024-02, F-2024-03, F-2024-04 |
| 2024 replace any after Long Rest | F-2024-05 |
| Wis 16 L1 matches 4 vs 4; Wis 16 L5 is 8 vs 9; Wis 20 L1 is 6 vs 4; no “2024 always prepares more” | F-DIFF-PREP-COUNT |
| Cantrips known, not in the daily 1+ count; 2014 Basic Rules no swap-on-level; 2024 swap one when you gain a Cleric level; extra at 4 and 10 | F-2014-07, F-2024-07, F-DIFF-CANTRIP-SWAP |
| 2024 recommended cantrips Guidance, Sacred Flame, Thaumaturgy; recommended four Bless, Cure Wounds, Guiding Bolt, Shield of Faith | F-2024-14 |
| Free Rules cantrips = those seven; no Toll the Dead, no Word of Radiance | F-2024-LIST-CANTRIPS, C-01 |
| Thaumaturge = one extra Cleric cantrip; Protector does not | F-DIFF-THAUMATURGE |
| Healing Word both lists; 2014 1d4+mod, Bonus Action, 60 ft; 2024 2d4+mod, same action/range | F-DIFF-HW, F-2014-HEALING-WORD-EXISTS, F-2024-HEALING-WORD-EXISTS. URLs `2140-healing-word` and `2619143-healing-word` match. |
| 2014 Spiritual Weapon no concentration; 2024 concentration (`C`). URLs `2263-spiritual-weapon` and `2619081-spiritual-weapon` match. | F-DIFF-SW-CONCENTRATION |
| 2014 Domain at 1, always prepared, do not count; Basic Rules names seven domains, prints Life only | F-2014-08, F-2014-09, F-DIFF-SUBCLASS-LEVEL |
| 2014 Life table Bless/Cure Wounds; Lesser Restoration/Spiritual Weapon; Beacon of Hope/Revivify; Death Ward/Guardian of Faith; Mass Cure Wounds/Raise Dead | F-2014-10 |
| 2024 subclass at 3; Life 3 Aid/Bless/Cure Wounds/Lesser Restoration; 5 Mass Healing Word/Revivify; 7 Aura of Life/Death Ward; 9 Greater Restoration/Mass Cure Wounds; no Spiritual Weapon | F-2024-10, F-2024-11, F-DIFF-LIFE-DOMAIN-SPELLS |
| Ritual needs prepared + Ritual tag, both years | F-2014-11, F-2024-12 |
| Channel Divinity / Divine Spark / Turn Undead are not prepared spells | F-DIFF-CHANNEL |
| 2024 Divine Intervention: level 10, Magic action, Cleric spell ≤5 that is not a Reaction, no slot, no Materials, 1/Long Rest. 2014: percentile, DM resolves. Neither is a prepared spell. | F-DIFF-DIVINE-INTERVENTION |
| Example spell names used in lists exist on F-2014-LIST / F-2024-LIST-1..3 | existence only |

Wis 14 Cleric 1 → 3 vs 4 is not a worked example in the facts file. It is +2 + 1 vs table 4. Accept as arithmetic from F-2014-02 + F-2024-03.

“Copy nine names at 5 onto Wis 16 2014 = one illegal spell” and “copy Wis 20 2014 level 1 six onto 2024 = two illegal spells” are 9−8 and 6−4. Accept.

### Unsourced vs this facts file (not shown as wrong years)

1. **“A 2024 Paladin replaces one prepared spell after a Long Rest.”** Not a fact-id in `official-cleric-spell-facts.md`. F-2024-06 only quotes Cleric = Any. `research-en.md` records Paladin/Ranger = One from the same 2024 Spell Preparation by Class table. Not a wrong year. Citation gap vs the assigned facts file. Body also says “The Paladin cannot rebuild tomorrow morning,” which overstates “replace one.”
2. **Concentration tags** for Bless, Shield of Faith, Spirit Guardians, Hold Person, Protection from Energy, Protection from Evil and Good, Enhance Ability, Silence are not extracted as fact-ids. Only Spiritual Weapon’s `C` is (F-2024-LIST-2). Names are on the verified lists. Do not treat as unsourced integers. Do not paste spell blocks to “fix” this.
3. **“Next six hours”** is not a rule number. Leave or drop; do not cite it as handbook text.

### Wrong mechanism (year is right; the sheet action is wrong)

1. **2024 Life 3: “Pick Spiritual Weapon only if Bless is coming off for the day.”** F-2024-08 / F-2024-10 / F-2024-11: Bless is always prepared from subclass 3 and does not count, which means it also cannot be un-prepared. The clash is at cast time, not on the counted six.
2. **2014 Life level 1 example prepares Shield of Faith while Bless is already always prepared**, after the failed-save section and the 2024 level 1 section both reject a second concentration buff on a tight list.
3. **Jobs table Fallback row includes 2024 Spiritual Weapon**, which F-DIFF-SW-CONCENTRATION marks concentration. Fallback’s own “why” cell requires a non-concentration name.
4. **2024 Life level 5 counted nine includes Hold Person and Spirit Guardians for the same dungeon day**, with “cast Hold Person only if Spirit Guardians is not the plan that round.” That is two fight-time concentration jobs on the default list the ReaderTask uses as success.

No 2014/2024 year swap found on prepare formula, subclass timing, Life packages, Healing Word dice, or Divine Intervention.

Unused official fact, not a fail: 2024 Spare the Dying range 15 ft vs 2014 Touch (F-DIFF-SPARE). Body already says the cantrip does not replace Healing Word.

---

## 4. ReaderValue / Repetition / ResearchTrace

### ReaderValue

Main sub-questions 1–5 are answered: year count, four jobs, Domain subtraction, labeled L1/L5 lists, pick-changing diffs. A reader can write a legal 2024 level 1 list (Bless, Cure Wounds, Guiding Bolt, Healing Word) and can subtract 2024 Life names at 3 and 5.

They cannot trust every worked list as a success sheet:

- 2014 Life L1 as written: Bless (free, concentration) + Shield of Faith (counted, concentration). Fails “one concentration job” the same way the official 2024 four fails it.
- 2024 Life L3 as written: Spiritual Weapon only if Bless “comes off.” Bless does not come off.
- 2024 Life L5 as written: Spirit Guardians + Hold Person (+ Protection from Energy, + Protection from Evil and Good). Default dungeon day should show one opener, leftover names that still work while it is up, and Long Rest swaps labeled as swaps.

Jobs table + Domain table + year count table are the actual gain vs list-dump SERP pages. Keep those.

### Repetition

Same job is done too many times:

| Keep | Duplicate to cut |
|---|---|
| Opening four-check paragraph + first jobs table | — |
| H2 prepare-count + Wis table | FAQ “How many Cleric spells do I prepare?” may keep a short copy |
| H2 Domain tables | FAQ Life-domain answer may keep a short copy |
| H2 legal lists (examples) | Level 3 checkpoint paragraph is extra but still earns its slot (the 2024 Life landing) |
| H2 2014 vs 2024 diffs (SW concentration, DI) | SW already taught in jobs + lists; keep the dedicated H2, do not add a third recap |
| FAQ five questions | **Post-FAQ 10-bullet `<ul>` (body lines 179–189) repeats year, subtract, four jobs, L1, L5, three swaps, Paladin, DI.** Same function as FAQ + opening. Delete or cut to the four checks only. |

### ResearchTrace

Hit: “That **live HTML** table lists 4 prepared spells…”

No SERP ranks, no PAA invention, no wikidot/RPGBOT as rules, no internal repo paths, no “if you searched for.” Public D&D Beyond links and in-site Bless/Paladin/Druid/Bard/Constitution/editor links are legitimate.

Forbidden voice phrases from `index.test.ts` lines 65–110: none.

---

## 5. Figure alt vs planned photos

Planned set (EN body): job piles; 2014 vs 2024 concentration miniatures; circular Cleric token. Inspected the files actually sitting in `tmp/blog-dnd-cleric-spells/webp/`.

### Figure 1 — job piles (`cleric-spell-jobs.webp`)

**Photo:** Cleric miniature on a wood table; four stacks of blank parchment. Props: linen bandages, a candle in a holder, a mace, an open compass. No spell cards, no writing, no prepared-list sheet, no separate holy-symbol token (sunburst is on the miniature’s tabard/shield only).

**Alt now:** `Tabletop Cleric spell cards sorted into rescue, concentration, fallback, and utility piles beside a prepared-list sheet and a holy symbol`

**Caption now:** `Sort the cards by job before you count slots. Rescue and concentration are not the same pile, and Domain cards do not go in the daily count.`

**Flag:** Alt and caption describe **cards**, a **sheet**, and **Domain cards** that are not in the photo.

### Figure 2 — circular Cleric token (`cleric-token-crop.webp`)

**Photo:** Physical circular painted Cleric portrait with a gold sunburst border, standing on a green cutting mat next to a matching miniature, lamp, dice. No VTT grid. No allied tokens. No Bless markers.

**Alt now:** `Circular VTT Cleric token with a holy-symbol border on a dungeon grid beside Bless markers on allied tokens`

**Caption now:** `After the names are legal, the map still has to show who is the Cleric and who is under Bless.`

**Flag:** Alt describes a **VTT dungeon grid** and **Bless markers on allied tokens** that are not in the photo. Caption talks about a map and Bless that the frame does not show.

### Figure 3 — 2014 vs 2024 concentration miniatures (`cleric-concentration-clash.webp`)

**Photo:** Split diorama on map sheets. Warm left: Cleric miniature, spectral hammer, golden ring around allied minis (legal 2014 stack). Cool right: same Cleric, spectral hammer, ghostly guardian figures, strained pose (2024 clash). No cards. No “Concentration” stamp.

**Alt now:** `2014 Spiritual Weapon card stacked with Spirit Guardians beside a 2024 Spiritual Weapon card stamped Concentration, showing the clash`

**Caption now:** `The 2014 stack is legal. The 2024 stack is not. One concentration job per day, then a fallback that does not need the same box.`

**Flag:** Alt describes **cards** and a **stamped Concentration** mark that are not in the photo. Caption’s legal/illegal teaching matches the miniatures; only the alt must drop cards/stamps. Optional: “box” → opener/concentration job.

---

## 6. Required LOCAL patches (old → new)

Author applies these. Do not replace the article.

### Patch 1 — ResearchTrace

**Old:**
```
That live HTML table lists 4 prepared spells at level 1, 5 at 2, 6 at 3, 7 at 4, and 9 at 5.
```

**New:**
```
That Cleric Features table lists 4 prepared spells at level 1, 5 at 2, 6 at 3, 7 at 4, and 9 at 5.
```

### Patch 2 — Jobs table (2024 Spiritual Weapon is not Fallback)

**Old (Concentration picks cell):**
```
Bless at low levels; Spirit Guardians when 3rd-level slots exist; Shield of Faith only when one ally must live and Bless is not the plan
```

**New:**
```
Bless at low levels; Spirit Guardians when 3rd-level slots exist; Shield of Faith only when one ally must live and Bless is not the plan; 2024 Spiritual Weapon only as that day’s opener, never stacked with Bless or Spirit Guardians
```

**Old (Fallback picks cell):**
```
Guiding Bolt, Command, Inflict Wounds; 2014 Spiritual Weapon; 2024 Spiritual Weapon only if Bless or Spirit Guardians is not running
```

**New:**
```
Guiding Bolt, Command, Inflict Wounds; 2014 Spiritual Weapon
```

### Patch 3 — Figure 1 alt + caption (no cards)

**Old alt:**
```
Tabletop Cleric spell cards sorted into rescue, concentration, fallback, and utility piles beside a prepared-list sheet and a holy symbol
```

**New alt:**
```
Cleric miniature behind four unlabeled parchment piles on a wood table, marked with bandages, a candle, a mace, and a compass
```

**Old caption:**
```
Sort the cards by job before you count slots. Rescue and concentration are not the same pile, and Domain cards do not go in the daily count.
```

**New caption:**
```
Sort tonight’s names into those four piles before you count slots. Rescue and concentration are not the same pile, and Domain names do not go in the daily count.
```

### Patch 4 — Figure 2 alt + caption (no VTT grid, no Bless markers)

**Old alt:**
```
Circular VTT Cleric token with a holy-symbol border on a dungeon grid beside Bless markers on allied tokens
```

**New alt:**
```
Circular painted Cleric portrait token with a gold holy-symbol border on a cutting mat beside a matching miniature
```

**Old caption:**
```
After the names are legal, the map still has to show who is the Cleric and who is under Bless.
```

**New caption:**
```
After the names are legal, export a circular Cleric token with the holy-symbol border so the caster stays readable in the pile. Mark Bless on allies with a second token, not by crowding this portrait.
```

### Patch 5 — Figure 3 alt (no cards, no stamp)

**Old alt:**
```
2014 Spiritual Weapon card stacked with Spirit Guardians beside a 2024 Spiritual Weapon card stamped Concentration, showing the clash
```

**New alt:**
```
Split miniature scene: 2014 Cleric with a spectral hammer and a golden ring around allies; 2024 Cleric with the same hammer plus surrounding spirit figures
```

Caption may stay. Optional one-word fix: “same box” → “same concentration job”.

### Patch 6 — 2014 Life level 1 example (stop the backup Bless)

**Old:**
```
Example Life list: Healing Word, Guiding Bolt, Shield of Faith, and a utility name such as Detect Magic or Protection from Evil and Good. That is one concentration job (Bless, free from Domain, or Shield of Faith if you recast), one Bonus Action rescue (Healing Word), one non-concentration attack (Guiding Bolt), and one utility.
```

**New:**
```
Example Life list: Healing Word, Guiding Bolt, Command, and Detect Magic. That is one concentration job (Bless, already always prepared), one Bonus Action rescue (Healing Word), one non-concentration attack (Guiding Bolt), one non-concentration control (Command), and one ritual utility (Detect Magic). Shield of Faith stays off this four; it is a second concentration buff beside Bless.
```

### Patch 7 — 2024 Life 3: Bless does not come off

**Old:**
```
so the six counted jobs should look like Healing Word, Guiding Bolt, Detect Magic, Spiritual Weapon or Hold Person, Protection from Evil and Good, and one leftover such as Silence or Enhance Ability. Pick Spiritual Weapon only if Bless is coming off for the day, because both need concentration in 2024.
```

**New:**
```
so the six counted jobs should look like Healing Word, Guiding Bolt, Detect Magic, Command, Protection from Evil and Good, and one leftover such as Sending or Silence. Life still always has Bless prepared; it cannot come off. Prepare 2024 Spiritual Weapon or Hold Person only as a Long Rest swap for a day you will not cast Bless or Spirit Guardians. Do not put them on the six beside a Bless you still intend to run.
```

### Patch 8 — 2024 Life level 5 nine (one dungeon opener)

**Old:**
```
Example counted nine for 2024 Life, default dungeon: Healing Word, Guiding Bolt, Command, Detect Magic, Protection from Evil and Good, Hold Person, Spirit Guardians, Dispel Magic, Protection from Energy. Jobs: Healing Word is the cheap rescue (Mass Healing Word is always prepared but spends a 3rd-level slot). Guiding Bolt and Command are non-concentration fallback. Detect Magic is utility. Protection from Evil and Good is the undead flex you can swap off on a travel day. Hold Person is optional control that you cast only if Spirit Guardians is not the plan that round. Spirit Guardians is the one concentration job. Dispel Magic is the magic answer. Protection from Energy is the save-fail flex for a dragon, a trap corridor, or a glowing glyph.
```

**New:**
```
Example counted nine for 2024 Life, default dungeon: Healing Word, Guiding Bolt, Command, Detect Magic, Protection from Evil and Good, Sending, Spirit Guardians, Dispel Magic, Warding Bond. Jobs: Healing Word is the cheap rescue (Mass Healing Word is always prepared but spends a 3rd-level slot). Guiding Bolt and Command are non-concentration fallback. Detect Magic is utility. Sending is the split-party name that does not use concentration. Warding Bond is a second-protect name that does not use concentration. Spirit Guardians is the one concentration job. Dispel Magic is the magic answer. Protection from Evil and Good is an undead-day flex: keep it on this default dungeon list as a Long Rest swap for Spirit Guardians, not as a second opener in the same fight. Hold Person and Protection from Energy wait on the swap list for a day Spirit Guardians is off.
```

### Patch 9 — Paladin contrast is 2024; do not overstate “cannot rebuild”

**Old:**
```
They do not use the same prepare count, they do not grant Domain spells at the same Cleric level, and they do not let you rebuild the list the same way a Paladin does.
```

**New:**
```
They do not use the same prepare count, they do not grant Domain spells at the same Cleric level, and a 2024 Cleric does not rebuild the list the same way a 2024 Paladin does.
```

**Old:**
```
The Paladin cannot rebuild tomorrow morning; you can.
```

**New:**
```
The 2024 Paladin replaces one prepared spell after a Long Rest; you can replace any.
```

(Paladin “one” is still only in `research-en.md` / the Spells chapter table, not as a fact-id in `official-cleric-spell-facts.md`. Keep the sentence if you are willing to rest it on that research row. Do not leave it smeared across 2014.)

### Patch 10 — Post-FAQ recap list

Delete the entire `<ul>` after the Divine Intervention FAQ (the ten `<li>` starting “Year first”). FAQ plus the opening four checks already close the task.

If a closer is required, replace that `<ul>` with one paragraph, not ten bold labels:

**New (only if you refuse a bare FAQ ending):**
```
<p>Write the year, the counted number, the always-prepared block, one concentration opener, and one non-concentration rescue. If those five lines exist, stop adding names.</p>
```

Also fix the checklist’s current L1 line if you keep any of it. It still presents Bless, Cure Wounds, Guiding Bolt, Shield of Faith as the default four. That set fails rescue unless someone else already has Healing Word. The body already chose Healing Word in place of Shield of Faith for a table with no other pickup.

---

## 7. What to protect (do not “humanize” away)

- Opening four checks.
- Wis 14 / 16 / 20 table showing 2024 is not always more.
- 2024 L3 “if Bless and Cure Wounds stay on that 6, you are paying twice.”
- Official recommended four missing Healing Word.
- 2014 Life always-prepares Spiritual Weapon; 2024 Life does not; 2024 SW is concentration.
- Toll the Dead / Word of Radiance off Free Rules.
- Channel Divinity and Divine Intervention are not prepared spells.
- Examples labeled as examples; other domains: open the printed table.
- Single Token Maker beat after the lists (Cleric preset). Do not move it to the intro.

---

## 8. Residual risk

- Layer 8 user review of a live assembled page: 尚未进行.
- Paladin “replace one” is not a numbered claim in `official-cleric-spell-facts.md`.
- 2014 L3 / L5 leftover concentration names (Shield of Faith or Protection from Energy beside Bless / Spirit Guardians) are milder than the required patches. Revisit if those examples still read as second openers after patch 6–8.
- Alts must track the webp files, not a remembered card-table prompt. If photos are regenerated as actual cards/stamps, rewrite this figure section; do not keep the new alts on the current miniatures.
- No title/description review. No US Google rank claims.

---

## Final

**REVISE**

Pending new hash after patches. Do not bind PASS to `ac13781efb3b2b867be0652f726fa5058c4affcea871a2d88a92fca8b9c2c941`.
