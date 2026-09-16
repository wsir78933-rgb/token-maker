# US English SERP research — `dnd kobold tokenmaker.one`

Role: A-EN. Locale=`en`. Country=`US`. Verified: **2026-09-16**.  
Provider: **ego-browser Google** (task space `dnd-kobold-en-serp-research`, id 87).  
Search URL pattern: `https://www.google.com/search?q=QUERY&hl=en&gl=us&pws=0`.  
`web_search` was **not** used. No captcha `/sorry` page on any required query.

主词按用户原词收集。未为推广 tokenmaker.one 改写搜索意图。品牌查询单独记录它实际返回什么。

## Capture evidence (every query)

| Field | Observed |
|---|---|
| `hl` | `en` in URL; `document.documentElement.lang` = `en`; UI chrome in English |
| `gl` | `gl=us` in URL |
| `pws` | `pws=0` in URL |
| Footer | `Results are not personalized` |
| Location chip | `California` / `From your IP address` |
| Account chip | Google account visible, but footer still said not personalized |
| Captcha | none |

This is a US-parameter snapshot from a California IP. Ranking is one capture, not a market-size claim.

---

## Query 1 — `dnd kobold`

- Capture URL: <https://www.google.com/search?q=dnd+kobold&hl=en&gl=us&pws=0>
- Visible count: `About 2,360,000 results` (page text only)
- Modules seen: AI Mode, All, Images, Videos, Shopping, Forums, Short videos, Web results, People also ask, Discussions and forums, Images, What people are saying, People also search for
- AI Overview / AI Mode replied: present on later snapshot of this query

### People Also Ask (on-page)

- Can you play D&D as a kobold?
- Are kobolds good or evil in D&D?
- Did D&D invent kobolds?
- How do kobolds work in D&D?

PAA answers were not expanded; only the visible questions are recorded.

### People also search for (on-page `q=` values)

- DnD kobold race
- Dnd kobold 2024
- Dnd kobold height
- Dnd kobold 5e
- DnD kobold names
- Dnd kobold stat block
- Dnd kobold dragonshield
- Dnd Kobold age

### Organic web results in visible order (h3)

1. **Kobold - Monsters** — D&D Beyond — <https://www.dndbeyond.com/monsters/16939-kobold>
2. **Kobold - DND 5th Edition - Wikidot** — <https://dnd5e.wikidot.com/lineage:kobold>
3. **Kobold - Forgotten Realms Wiki - Fandom** — <https://forgottenrealms.fandom.com/wiki/Kobold>
4. **Kobold \| D&D 5th Edition on Roll20 Compendium** — <https://roll20.net/compendium/dnd5e/Kobold>
5. **Kobolds : r/DnDBehindTheScreen** — <https://www.reddit.com/r/DnDBehindTheScreen/comments/359ejs/kobolds/>
6. **Meet the Monsters: Kobold** — DDO — <https://www.ddo.com/news/ddo-meet-the-monsters-kobold>

Forums module (not counted as the same as the web list): Reddit `r/DnDBehindTheScreen` thread `9051w4`; also headings `Kobold Culture - Story & Lore` and `Kobold builds - General Discussion`.

Videos seen (not organic web): YouTube `D&D5E: KOBOLD GUIDE` (`watch?v=3Yj_ilZfF2A`), Shorts `PLAYABLE KOBOLD Character in #dnd5e`, `The Complete Guide to Kobolds` (`watch?v=4m40wJMvoUk`).

### Top 5 organic — opened-page samples

#### 1. D&D Beyond monster — opened 2026-09-16

- URL: <https://www.dndbeyond.com/monsters/16939-kobold>
- Title: `Kobold - Monsters - D&D Beyond`
- H1: `Kobold`
- Page type: official 2014/Legacy monster reference
- Problem it solves: CR 1/8 dungeon minion stat block + one-paragraph flavor
- Version on page: badge `Legacy`; source line `Basic Rules (2014), pg. 142`; type `Small Humanoid (Kobold), Lawful Evil`
- Evidence (short): “Kobolds are craven reptilian humanoids that commonly infest dungeons. They make up for their physical ineptitude with a cleverness for trap making.” Stats visible: AC 12, HP 5 (2d6 - 2), Speed 30 ft., Darkvision 60 ft., Common and Draconic, CR 1/8. Traits: Sunlight Sensitivity, Pack Tactics. Actions: Dagger, Sling.
- Limits: 2014/Legacy monster, not a playable species page; comments mention Volo’s PC traits but comments are not rules.
- Unanswered: 2024 monster rewrite; playable MotM/Volo traits; how to use them as PCs.

#### 2. Wikidot lineage — SERP visible, **page 未取得**

- SERP URL: <https://dnd5e.wikidot.com/lineage:kobold>
- SERP title: `Kobold - DND 5th Edition - Wikidot`
- SERP snippet (not opened-page fact): “Some of the smallest draconic creatures in the multiverse, kobolds display their draconic ancestry…”
- Open attempts: ego-browser `https` → `net::ERR_CONNECTION_CLOSED`; `http` → HTTP failure; `web_fetch` failed; Wayback `429 Too Many Requests`.
- Do not treat Wikidot body as verified.

#### 3. Forgotten Realms Wiki — opened 2026-09-16

- URL: <https://forgottenrealms.fandom.com/wiki/Kobold>
- Title: `Kobold | Forgotten Realms Wiki | Fandom`
- H1: `Kobold`
- Page type: setting wiki / lore encyclopedia
- Problem it solves: what kobolds are in Forgotten Realms across editions
- Version notes on infobox: 5e Size Small; Type Humanoid; Type (revised) Dragon; Alignment Lawful evil; Alignment (revised) Neutral; CR kobold 1/8 and “revised” Kobold warrior 1/8; patron Kurtulmak; lifespan “Usually up to 50 years, max 120 years”; height 2–2.5 ft.
- Evidence (short): “Kobolds were aggressive, insular, yet industrious small humanoid creatures. They were noted for their skill at building traps and preparing ambushes, and mining.”
- Limits: fan wiki, multi-edition blend; “revised” rows look like 2024 MM naming but are wiki synthesis, not a Wizards page.
- Unanswered: which book a table should use tonight.

#### 4. Roll20 5e Compendium — opened 2026-09-16

- URL: <https://roll20.net/compendium/dnd5e/Kobold#content>
- Title: `Kobold | D&D 5th Edition on Roll20 Compendium`
- Page type: VTT compendium reprint of 2014 Basic Rules monster
- Source line on page: `Free Basic Rules (2014)`
- Evidence: same 2014 traits (Sunlight Sensitivity, Pack Tactics) and Dagger/Sling actions as D&D Beyond 16939.
- Limits: explicitly a fraction of Roll20 content; not playable-race rules; upsells Monster Manual token artwork.
- Unanswered: 2024 block; PC species.

#### 5. Reddit ecology thread — opened 2026-09-16

- URL: <https://www.reddit.com/r/DnDBehindTheScreen/comments/359ejs/kobolds/>
- Title: `Kobolds : r/DnDBehindTheScreen`
- Date on page: ~12 years ago
- Page type: forum / GM flavor
- Problem it solves: how to *run* kobolds as nasty trap-using ecology, not a stat dump
- Evidence (short): opener frames them as “Dog-faced baby-snatchers” / trap-and-bleed hunters. Subreddit rules forbid art/memes and want full text.
- Limits: not official; old; tone is DM advice.
- Unanswered: 5e/2024 numbers.

---

## Query 2 — `kobold 5e`

- Capture URL: <https://www.google.com/search?q=kobold%205e&hl=en&gl=us&pws=0>
- Visible count: `About 1,500,000 results`
- Footer: not personalized; California from IP; `gl=us` in URL

### People Also Ask

- Are kobolds playable in 5e?
- Do kobolds have skin or scales?
- What is the best class to build a kobold in D&D 5e?
- What is the average lifespan of a kobold in D&D 5th edition?

### People also search for

- Kobold 5e stats
- Kobold 5e race
- Winged kobold 5e
- Kobold DnD
- Kobold 5e species
- DnD kobold race
- Kobold 5e wikidot
- Kobold warrior 5e

### Organic web (h3 order)

1. Kobold - Monsters — <https://www.dndbeyond.com/monsters/16939-kobold>
2. Kobold | D&D 5th Edition on Roll20 Compendium — <https://roll20.net/compendium/dnd5e/Kobold>
3. Kobold - DND 5th Edition - Wikidot — <https://dnd5e.wikidot.com/lineage:kobold> (**page 未取得**)
4. Kobold race info : r/DnD5e — <https://www.reddit.com/r/DnD5e/comments/1f1chju/kobold_race_info/>
5. D&D 5e: Let's Build A Kobold! — <https://www.norsefoundry.com/blogs/how-to-build-series/d-d-5e-let-s-build-a-kobold>
6. D&D 5e: The Kobold Personality 5 — <https://www.brandesstoddard.com/2016/09/dd-5e-the-kobold-personality/>
7. D&D 5E Ultimate guide to Kobolds — YouTube Pack Tactics — <https://www.youtube.com/watch?v=2qMLtDGeKWA>
8. Kobold Press: for 5th Edition D&D Players and GMs/DMs — <https://koboldpress.com/> (publisher brand collision, not the D&D creature)

### Top 5 — opened-page samples

#1 D&D Beyond and #2 Roll20: same opened pages as Query 1.  
#3 Wikidot: 未取得.

#### 4. Reddit `Kobold race info` — opened 2026-09-16

- URL: <https://www.reddit.com/r/DnD5e/comments/1f1chju/kobold_race_info/>
- Title: `Kobold race info : r/DnD5e`
- Page type: forum / player-race help
- Problem it solves: “I want PC traits and class advice; free race text is hard to find”
- Evidence: OP cannot find free race info. Comment: “The rules from Mordenkainen Present: Monsters of the Multiverse are the most recent iteration of kobold as a player species.” Another comment links the Wikidot lineage URL (destination still 未取得).
- Limits: forum pointers, not the rulebook.

#### 5. Norse Foundry build article — opened 2026-09-16

- URL: <https://www.norsefoundry.com/blogs/how-to-build-series/d-d-5e-let-s-build-a-kobold>
- Title: `D&D 5e: Let’s Build A Kobold! – Norse Foundry`
- H1: `D&D 5E: LET’S BUILD A KOBOLD!`
- Page type: commercial blog / 2014-style race build guide
- Problem it solves: which class to pick for a small Dex kobold
- Evidence: lists `Ability Score Increase: DEX + 2, STR - 2`; adulthood at 6 / live up to 120; Darkvision, Grovel Cower and Beg, Pack Tactics, Sunlight Sensitivity; recommends Dex classes, long Bard/Fighter sections.
- Limits: **mechanics on this page do not match the 2014 monster Pack Tactics text** (it describes Pack Tactics as once per rest / 10 ft). Treat as a build-intent sample, not a rules source. Source book is not clearly labeled 2014 vs MotM.
- Unanswered: MotM rewrite (Draconic Cry / Kobold Legacy); 2024 Background ASI.

Also opened (same query cluster, not top-five): Brandes Stoddard 2016 personality traits article — RP flavor, not stats.

---

## Query 3 — `kobold dnd 5e`

- Capture URL: <https://www.google.com/search?q=kobold%20dnd%205e&hl=en&gl=us&pws=0>
- Visible count: `About 474 results`
- AI Overview: present

### People Also Ask

- Are kobolds playable in 5e?
- What class is best for kobold?
- Are kobolds good or evil in D&D?
- How do kobolds work in D&D?

### People also search for

- DnD 5e Kobold player race
- DnD kobold race
- Kobold dnd 5e build
- Dnd 5e kobold stat block
- DnD 5e kobold player race stats
- Kobold dnd 5e 2014
- Dnd 5e kobold height
- Kobold warrior 5e

### Organic web (h3)

1. D&D Beyond monster 16939
2. Wikidot lineage (**page 未取得**)
3. Roll20 Compendium
4. Reddit `Kobold race info`
5. Norse Foundry Let’s Build
6. Brandes Stoddard personality
7. Kobold - D&D 5e Wiki - Fandom — <https://dnd-5e.fandom.com/wiki/Kobold>

Forums module: UnearthedArcana homebrew race; D&D Beyond forum `Kobold Player Race?`.

Opened extra: D&D 5e Wiki monster page <https://dnd-5e.fandom.com/wiki/Kobold> — Fandom chrome-heavy; categories mention Volo’s. Weak as a rules source.

---

## Query 4 — `playable kobold 5e`

- Capture URL: <https://www.google.com/search?q=playable%20kobold%205e&hl=en&gl=us&pws=0>
- This query is **player-species**, not dungeon minion.

### People Also Ask

- Are kobolds playable in 5e?
- Can I play as a kobold?
- Can I play a kobold as a player race in D&D 5e?
- What class is best for a kobold?

### People also search for

- Playable kobold 5e race
- Playable kobold 5e stat block
- Playable kobold 5e stats
- Kobold race 5e Monsters of the Multiverse
- Playable kobold 5e build
- Best playable kobold 5e
- Playable kobold 5e reddit
- DnD 5e kobold player race stats

### Organic web (h3)

1. Wikidot lineage (**page 未取得**)
2. Reddit `Kobold race info`
3. Kobold Player Race? - Rules & Game Mechanics — D&D Beyond forum — <https://www.dndbeyond.com/forums/dungeons-dragons-discussion/rules-game-mechanics/87764-kobold-player-race>
4. Norse Foundry Let’s Build
5. D&D Race Guide: How to Play a Kobold — Bell of Lost Souls — <https://www.belloflostsouls.net/2023/08/dd-race-guide-how-to-play-a-kobold.html> (**Cloudflare block when opened**)
6. Kobold Playable Race Guide for D&D 5e 2014 — Dungeon Mister — <https://dungeonmister.com/guides/kobold-race-in-dnd-5e/> (**429 / Whoops when opened**)
7. Kobold as a playable race in 5e. Which stats? — Giant in the Playground — <https://forums.giantitp.com/showthread.php?392588-Kobold-as-a-playable-race-in-5e-Which-stats>
8. Kobold: DnD 5e Race/Species Guide — RPGBOT — <https://rpgbot.net/dnd5/characters/races/kobold/>
9. Kobold (Race) - D&D 5e Wiki - Fandom — <https://dnd-5e.fandom.com/wiki/Kobold_(Race)>

Official D&D Beyond **species** URLs did **not** occupy these organic h3 slots. They were found later via D&D Beyond site search, not this Google top list.

### Opened pages from this cluster

#### RPGBOT race guide — opened 2026-09-16

- URL: <https://rpgbot.net/dnd5/characters/races/kobold/>
- Title/H1: `Kobold: DnD 5e Race/Species Guide`
- Updated line on page: October 29, 2025
- Page type: optimization guide (2014 meta)
- Evidence: “The Kobold effectively has 4 versions” (Volo original with Strength decrease; errata 1.1; Tasha’s custom origin; MotM rewrite with Draconic Cry / Kobold Legacy). MotM “removing both Pack Tactics and Sunlight Sensitivity”. **2024 section:** “Kobolds were most recently updated in Monsters of the Multiverse, and have not yet been updated for the 2024 DnD rules. To play a Kobold in the 2024 DnD rules, ignore the Ability Score Increases described in Monsters of the Multiverse. Instead, use the Ability Score Increases provided by your Background in the 2024 rules.”
- Limits: third-party optimizer, not Wizards. Useful as version-map, not as a substitute for the book.

#### D&D 5e Wiki race page — opened 2026-09-16

- URL: <https://dnd-5e.fandom.com/wiki/Kobold_(Race)>
- Title: `Kobold (Race) | D&D 5e Wiki | Fandom`
- Categories: Volo's Guide to Monsters; Mordenkainen Presents: Monsters of the Multiverse; Unearthed Arcana
- Page type: community rules transcription
- Evidence (MotM block on page): Humanoid, Small, 30-foot walk, Darkvision 60 ft., Draconic Cry (bonus action, 10 feet, advantage for you and allies, PB uses / long rest), Kobold Legacy choice of Craftiness / Defiance / Draconic Sorcery; flexible ASI (+2/+1 or +1/+1/+1).
- Limits: fan wiki copying book text. Not a license to republish full traits in a new article.

#### Bell of Lost Souls / Dungeon Mister

- BoLS: Cloudflare `Sorry, you have been blocked`. Content 未取得.
- Dungeon Mister: WordPress.com 429. Content 未取得.
- GiantITP thread: listed on SERP (2015 stats debate). Not opened in this pass.

---

## Query 5 — `kobold token`

- Capture URL: <https://www.google.com/search?q=kobold%20token&hl=en&gl=us&pws=0>
- Visible count: `About 972,000 results`
- This query is **mostly Magic: The Gathering**, not D&D.

### People Also Ask

- Is kobolds of Kher keep a token?
- Are kobolds good or bad?
- Where can I find kobold?
- What is a kobold MTG?

### People also search for

- Kobold token price
- 0 1 kobold token
- Kobolds of kher keep edh
- Kobold Overlord
- Kobolds of Kher Keep commander
- Kobolds of Kher Keep future sight
- Token maker
- Kobolds of kher keep scryfall

### Organic web (h3)

1. Kobold Token - Time Spiral: Remastered - Magic — TCGplayer
2. Time Spiral Remastered: Kobold Token — Card Kingdom
3. Kobolds of Kher Keep (Masters 25 Tokens #10) — Scryfall
4. KOBOLD TOKEN PACK - SET 1 — Roll20 Marketplace
5. Name of Kobold token? : r/mtgrules
6. Rules Text: Kobold creature token — Gatherer
7. Kobold Token Mtg — Etsy
8. Kobold - 2-Minute Token Editor — 2-Minute Tabletop

Intent split is real: MTG card token vs one Roll20/VTT pack vs a token editor.

---

## Query 6 — `dnd kobold token`

- Capture URL: <https://www.google.com/search?q=dnd%20kobold%20token&hl=en&gl=us&pws=0>
- Visible count: `About 194,000 results`
- AI Overview headings seen: `Digital VTT Tokens`, `Physical Tokens and Miniatures`

### People Also Ask

- Is kobolds of Kher keep a token?
- Are kobolds playable in D&D 5e?
- What class is best for kobold?
- Are kobolds good or evil in D&D?

MTG PAA still leaks into a D&D-token query.

### People also search for

**未取得** — snapshot had no `People also search for` heading.

### Organic web (h3)

1. KOBOLD TOKEN PACK - SET 1 — <https://marketplace.roll20.net/browse/set/43514/kobold-token-pack-set-1>
2. Kobold Tokens — Etsy market
3. Kobold Token — Pinterest
4. r/DnD - [Art] [Token] Intrigue — Reddit
5. Kobolds! — Roll20 set 9161
6. Kobold DnD token / NPC token set. Part 2 — AFilinkov
7. Kobold Tokens by Taellosse — DeviantArt

### Opened: Roll20 token pack — 2026-09-16

- Title: `KOBOLD TOKEN PACK - SET 1 | Roll20 Marketplace...`
- Type: store / VTT art pack
- Evidence: “This pack includes 36 Kobold tokens in 4 color variations… PNG format (350x350 pixels)”.
- Limits: paid marketplace art, not rules.

### Opened: 2-Minute Token Editor kobold tag — 2026-09-16

- URL: <https://tools.2minutetabletop.com/token-editor/index?tag=kobold>
- Title: `2-Minute Token Editor`
- Evidence: filter `Results for "kobold"` with class-labeled portraits (Artificer, Barbarian, Bard, … Wizard, plus Deathknight / Vampire variants). Showing 0–41 of 41.
- Type: token tool + stock art, not a D&D rules page.

---

## Query 7 — `dnd kobold tokenmaker.one` (brand query, unmodified)

- Capture URL: <https://www.google.com/search?q=dnd%20kobold%20tokenmaker.one&hl=en&gl=us&pws=0>
- Visible count: `About 684 results`
- People Also Ask: **未取得**
- People also search for: **未取得**
- AI Overview heading seen: `How to Use Token Maker`

### Organic web (h3)

1. **DnD Token Maker | Free VTT Token Maker for Roll20 ...** — <https://www.tokenmaker.one/>
2. Kobold - 2-Minute Token Editor — 2-Minute Tabletop
3. r/DnD - [Art] [Token] Intrigue
4. **DnD Token Maker Guides, VTT Tools, and Tabletop Resources** — <https://www.tokenmaker.one/blog>
5. KOBOLD TOKEN PACK - SET 1 — Roll20 Marketplace
6. FREE: Kobolds DnD token / NPC token set. Part 1 | AFilinkov — Patreon
7. Kobolds token — ArtStation
8. Kobold #1 TCG Token Custom Altered — Etsy (MTG/TCG leak)

Brand query **does** return tokenmaker.one homepage as organic #1 and the blog index later. It does **not** return a kobold rules article. Remaining results are still VTT/art tokens, not 5e stat blocks.

### Opened: tokenmaker.one home — 2026-09-16

- URL: <https://www.tokenmaker.one/>
- Title: `DnD Token Maker | Free VTT Token Maker for Roll20 & Foundry VTT`
- H1: `Free DnD Token Maker for Roll20 and Foundry VTT`
- Type: tool page
- Evidence: circular/square/transparent PNG VTT tokens; borders/masks/text; local-first; export up to 2048. No kobold-specific monster or race guide on the H1/hero.
- Do not invent a “we made a kobold token” test. This page was opened as a SERP destination, not as a product demo writeup.

---

## Official / primary-source follow-up (opened; not always in Google top five)

These are knowledge clues. Unopened URLs are not used as facts.

| Source | Opened URL | Version | What was actually visible |
|---|---|---|---|
| D&D Beyond 2014 monster | <https://www.dndbeyond.com/monsters/16939-kobold> | 2014 Basic Rules / Legacy, Small Humanoid, LE, CR 1/8 | Full 2014-style block + flavor sentence |
| D&D Beyond 2024-style monster | <https://www.dndbeyond.com/monsters/5195096-kobold-warrior> | Page cites `Monster Manual, pg. 185`; Small **Dragon**, **Neutral**, CR 1/8 | AC 14, HP 7 (3d6−3), Pack Tactics, Sunlight Sensitivity, Dagger melee or ranged +4 / 4 (1d4+2). Comment dated Feb 5, 2025 notes dragon type |
| D&D Beyond winged kobold 2024 id | <https://www.dndbeyond.com/monsters/5195271-winged-kobold> | Redirected to **Monster Manual (5.5e)** shop | Stat block **未取得** (paywall/shop) |
| D&D Beyond 2014 winged kobold | <https://www.dndbeyond.com/monsters/17210-winged-kobold> | Redirected to **Monster Manual (5e)** shop | Stat block **未取得** |
| D&D Beyond species search | <https://www.dndbeyond.com/species?filter-search=kobold> | Listing only | Card 1: `Kobold` / `Mordenkainen Presents: Monsters of the Multiverse` / “Some of the smallest draconic creatures in the multiverse…” → `/species/1026395-kobold`. Card 2: `Kobold` / `Volo's Guide to Monsters` / `Legacy` → `/species/516426-kobold`. **No 2024 Player’s Handbook species card in this search result list.** |
| MotM species deep page | `/species/1026395-kobold` | Redirected to MotM shop $59.95 | Traits **未取得** |
| Volo species deep page | `/species/516426-kobold` | Redirected to <https://www.dndbeyond.com/legacy> | Traits **未取得**. Legacy explainer: content that “does not reflect the latest rules and lore” is labeled Legacy |
| D&D Beyond SRD hub | <https://www.dndbeyond.com/srd> | SRD v5.2.1 hub, page says last updated March 02, 2026; English SRD v5.2.1 published May 01, 2025 | **Kobold entry inside the PDF was not opened.** D&D Beyond search `kobold srd` returned 0 results |
| 5esrd.com creature | <https://www.5esrd.com/database/creature/kobold/> | Matches 2014 SRD-style block (Small humanoid (kobold), LE, AC 12, HP 5, Pack Tactics, Dagger/Sling) | Third-party SRD site, not Wizards |
| 5esrd.com race | <https://www.5esrd.com/database/race/kobold/> | Ancestral/Cultural traits, 40 ft speed, Natural Caretakers | **Not** Volo/MotM. Looks like OGN/Level Up material. Do not cite as official 5e PC race |
| Roll20 2014 monster | Roll20 Compendium | Free Basic Rules (2014) | Same 2014 block |
| Forgotten Realms Wiki | FR wiki Kobold | Multi-edition lore | Lore + infobox “revised” dragon/neutral/warrior |
| DDO news 2016 | <https://www.ddo.com/news/ddo-meet-the-monsters-kobold> | DDO/Eberron MMO | Trapmaking, iredar/irvhir lore. **Not 5e tabletop** |

Wizards.com standalone announcement page: **未打开**.

---

## Version map (only what opened pages support)

### 2014 monster — verified

D&D Beyond 16939 + Roll20 Basic Rules (2014) + 5esrd creature reprint:

- Small Humanoid (Kobold), Lawful Evil
- CR 1/8, AC 12, HP 5, Pack Tactics, Sunlight Sensitivity, Dagger + Sling
- Flavor: craven dungeon pests who compensate with traps

### 2024 monster — partially verified

D&D Beyond `Kobold Warrior` (`5195096`):

- Small **Dragon**, **Neutral**
- CR 1/8, AC 14, HP 7, still Pack Tactics + Sunlight Sensitivity
- Source on page: Monster Manual p.185
- Named “Warrior” rather than bare “Kobold”
- Full 2024 MM lore text beyond the stat block: not captured (comments exist; flavor paragraph not clearly present in the extracted block)

### Playable 2014 (Volo) — partially verified

- D&D Beyond species search shows a **Legacy** Volo’s card; deep page redirected to Legacy policy.
- Norse Foundry and D&D Beyond monster comments still circulate DEX +2 / STR −2, Grovel, Pack Tactics, Sunlight Sensitivity. Norse Foundry’s Pack Tactics wording is **unsafe**.
- Community wiki (D&D 5e Wiki race page) has a Volo section; MotM section was the part fully extracted.

### Playable MotM — verified from community wiki + listings, **not** from D&D Beyond body

- D&D Beyond search card exists and is paywalled.
- D&D 5e Wiki race page transcribes MotM p.25: flexible ASI, Humanoid, Small, Draconic Cry, Kobold Legacy.
- Reddit 2024-era thread calls MotM “the most recent iteration of kobold as a player species.”
- RPGBOT: MotM is the fourth version; not updated as a 2024 species.

### Playable 2024 PHB species — **未核验 as official**

- Not in D&D Beyond species search results for `kobold`.
- RPGBOT (third party) says MotM is the last PC update and to use 2024 Background ASI if playing MotM in 2024 games.
- Do not claim “2024 PHB has / does not have a kobold species” beyond: no PHB species card was visible in that DDB search.

---

## Intent signals from this SERP (not a chosen brief)

Google is mixing **four jobs** under “kobold”:

1. **Monster identity / ecology** — DDB/Roll20 2014 block, FR wiki, old DM Reddit, DDO.
2. **Playable species + version** — PAA “Can you play…”, related `race` / `Monsters of the Multiverse` / `2014`, Wikidot lineage titles, RPGBOT, forums.
3. **Build/class** — PAA “best class”, Norse Foundry, related `build`.
4. **Tokens** — only when the query contains `token` (VTT packs, art) or the brand `tokenmaker.one`. Bare `kobold token` is MTG-first.

Related search `Dnd kobold 2024` exists on the head query; 2024 official PC page was not in the organic top lists.

---

## 未取得 / failed opens

| Item | Status |
|---|---|
| Wikidot `lineage:kobold` and `kobold` bodies | 未取得 (connection closed / HTTP failure / fetch fail / Wayback 429) |
| Bell of Lost Souls race guide | 未取得 (Cloudflare block) |
| Dungeon Mister 2014 race guide | 未取得 (429) |
| D&D Beyond MotM and Volo species bodies | 未取得 (shop / legacy redirect) |
| D&D Beyond 2024 winged kobold body | 未取得 (5.5e shop) |
| SRD 5.2.1 PDF kobold listing | 未打开 PDF，不能当已核验 |
| PAA answers (expanded text) | 未展开 |
| `dnd kobold token` related searches | 未取得 |
| `dnd kobold tokenmaker.one` PAA and related searches | 未取得 |
| GiantITP playable-stats thread body | 未打开 |
| Wizards.com news post | 未打开 |
| Captcha | 无。无需 web_search 回退 |

Do not fill those gaps from model memory.
