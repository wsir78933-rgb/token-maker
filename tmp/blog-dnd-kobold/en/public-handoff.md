# PublicBlogHandoff — EN `dnd kobold`（已冻结，供 G 装配）

Role: F-EN。Date: 2026-09-16.  
Mode: project-write。**已 freeze。** E 题文 PASS（`tmp/blog-dnd-kobold/en/e-title-review.md`）。G 可按本文件装配现有网站。  
内部 10 候选只在 `title-candidates.md`，不进入本文件、不渲染到页面。

未改 `src/` / `public/`。未 commit。正文未改。

---

## locale / country

- locale: `en`
- country: `US`
- site: https://www.tokenmaker.one
- 建议路由: `/blog/dnd-kobold`

## body

- 锁定文本: `tmp/blog-dnd-kobold/en/draft-body.html`
- 格式: HTML fragment（无 Title/H1、无封面插入、无 import）
- bodyHash: `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`
- NFC / UTF-8 / LF: 已对齐；规范化不改字节
- 装配槽（G 替换为真实 public URL，替换后若写入 body 须重算 hash）:
  - `${DND_KOBOLD_LOCK_IMAGE_PATH}`
  - `${DND_KOBOLD_PACK_GRID_IMAGE_PATH}`
  - `${DND_KOBOLD_TOKEN_CROP_IMAGE_PATH}`
  - `${EN_DND_DRAGONBORN_PATH}` → `/blog/dnd-dragonborn`
  - `${EN_DND_RACES_PATH}` → `/blog/dnd-races`
  - `${EN_DND_KENKU_PATH}` → `/blog/dnd-kenku`
  - `${EN_EDITOR_PATH}` → `/#editor-workspace`
- 正文已有真实路径: `/faq`
- 不得改写正文句子、图注、链接锚文本或图中事实。

## seo

E 题文已通过。G 可写入 registry，不得改 Title / H1 / Description / slug。

| 字段 | 值 |
|---|---|
| slug | `dnd-kobold` |
| title / H1 | Matching CR 1/8 Does Not Make One DnD Kobold |
| seoTitle | Matching CR 1/8 Does Not Make One DnD Kobold |
| metaDescription | Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only. |
| excerpt | A dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Same CR 1/8 does not make those one creature. |
| coverLabel | Monster Guide |
| relatedSlugs | `dnd-kenku`, `dnd-dragonborn`, `dnd-races` |
| ogTitle | `{seoTitle} \| Token Maker`（现有 `createBlogPostMetadata` 模板；不要把后缀写进 seoTitle） |
| canonical | `/blog/dnd-kobold` |

FAQ（与正文 FAQ 同承诺；G 填 `faqItems`，不要另写新主张）：

1. Q: Are kobolds good or evil in D&D?  
   A: The 2014 monster is Lawful Evil. The 2024 Kobold Warrior is Neutral. Volo's player errata removed the Alignment trait and set the player Ability Score Increase to +2 Dexterity only. MotM dropped a racial Alignment trait. Do not average those answers into one moral default.
2. Q: Can you play D&D as a kobold?  
   A: Yes if the table allows *Volo's Guide to Monsters* (Legacy) or *Mordenkainen Presents: Monsters of the Multiverse*. Kobold is not one of the 2024 PHB ten. Copy that player page. Do not copy the 2014 Kobold or 2024 Kobold Warrior monster onto the character sheet.
3. Q: Is a 2024 kobold still a Humanoid?  
   A: The 2024 **Warrior** monster is Small **Dragon**. The 2014 monster is Small Humanoid (kobold). Copy a player creature type from the printed Volo's or MotM page. Do not invent a PC type from either monster.
4. Q: Do Small kobolds share a square with a second Small creature by default?  
   A: No. Small is one square, the same as Medium. Tiny is the size that can put four creatures in one square. Neither official monster in this lock is Tiny.

H2/H3（TOC 由正文生成，不要另写主张）：

- What a 5e kobold is on the table
- Lock 2014 Kobold or 2024 Kobold Warrior
  - 2014 — Small Humanoid, Lawful Evil
  - 2024 — Small Dragon, Neutral, renamed Warrior
  - Copy one column
- Pack Tactics is why a CR 1/8 pack still hurts
  - Advantage from an ally within 5 feet
  - Sunlight is not the same sentence in both books
  - Small still takes one square
- A playable kobold is a different book
- Crop a token that still reads as a small reptile
  - What must stay in the circle
  - Failure branches — recrop
- Mix-ups that break the identification
- Session check
- FAQ about dnd kobold
- Sources

CTA：正文在锁年之后可选进入 Token Maker editor。页面底栏沿用现有模板（editor / dice），不要新编“已导入某战役”承诺。无 Kobold 专用模板。预设名 Warrior ≠ 2024 统计块。

## publicReferences

定位：HTML 正文，`{quote, occurrence}`。quote 是 `draft-body.html` NFC 原文精确片段；occurrence 从 1 计。引用 ID 不渲染到文章。

| id | label | url | quote | occurrence | versionNote |
|---|---|---|---|---|---|
| REF-FAN | Fan Content Policy | https://company.wizards.com/en/legal/fancontentpolicy | This is unofficial Fan Content permitted under the Wizards of the Coast | 1 | Last updated 2017-11-15; unofficial, no logos |
| REF-DDB-2014 | Kobold monster (D&D Beyond, Legacy / 2014) | https://www.dndbeyond.com/monsters/16939-kobold | 2014 Kobold monster</a> | 1 | Basic Rules (2014) p.142; Legacy |
| REF-SRD51-KOB | SRD 5.1 Kobold (CC-BY PDF) | https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf | SRD 5.1 Kobold</a> (CC-BY) | 1 | p.324 Kobold; p.92 size; CC-BY-4.0 Wizards of the Coast LLC |
| REF-DDB-2024 | Kobold Warrior (D&D Beyond) | https://www.dndbeyond.com/monsters/5195096-kobold-warrior | Kobold Warrior monster</a> are the matching official entries | 1 | Monster Manual p.185 on that entry |
| REF-SRD521-WAR | SRD 5.2.1 Kobold Warrior (CC-BY PDF) | https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf | SRD 5.2.1 Kobold Warrior</a> (CC-BY) | 1 | ~p.302; CC-BY-4.0 Wizards of the Coast LLC |
| REF-ROLL20-2014 | Roll20 5e Compendium Kobold | https://roll20.net/compendium/dnd5e/Kobold#content | Roll20 5e Compendium Kobold</a> is a Free Basic Rules (2014) reprint | 1 | 2014 reprint cross-check |
| REF-BR2014-K | Basic Rules (2014) Monster Stat Blocks (K) | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/monster-stat-blocks-k | That flavor sentence sits on the Basic Rules / D&amp;D Beyond 2014 monster page | 1 | Trap-flavor sentence; not SRD; paraphrase only |
| REF-SIZE-2024 | Playing the Game — Creature Size (2024 free rules) | https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game | 2024 free rules Creature Size</a> table is the same occupancy | 1 | Small = 5×5 ft / 1 square |
| REF-DDB-10SP | The 10 Species in the 2024 Player's Handbook | https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook | 10 species in the 2024 Player | 1 | Kobold not in core ten; older species usable |
| REF-DDB-SPECIES-SEARCH | D&D Beyond species search kobold | https://www.dndbeyond.com/species?filter-search=kobold | species search for kobold</a> shows a MotM card and a Volo | 1 | Listing only; no 2024 PHB species card |
| REF-DDB-MOTM-POST | Exploring Goblin, Hobgoblin, and Kobold in MotM | https://www.dndbeyond.com/posts/1248-exploring-the-new-goblin-hobgoblin-and-kobold | Exploring the New Goblin, Hobgoblin, and Kobold</a> | 1 | Volo Pack Tactics vs MotM Draconic Cry; names only |
| REF-DDB-LEGACY | Legacy Content — D&D Beyond | https://www.dndbeyond.com/legacy | Legacy Content</a> page is what the Legacy badge means | 1 | Volo Legacy badge |
| REF-VOLO-ERRATA | Volo’s Guide Sage Advice & Errata | https://www.dndbeyond.com/sources/dnd/sae/volos-guide-to-monsters | player errata</a> removed the Alignment trait | 1 | Kobold Traits ~p.119; +2 Dex only |
| REF-WINGED-2024 | Winged Kobold (Roll20, MM 2024) | https://roll20.net/compendium/dnd5e/Monsters:Winged%20Kobold?expansion=34653 | Winged Kobold on Roll20 (Monster Manual 2024)</a> | 1 | Separate card, CR 1/4, Fly 30 ft; not SRD Warrior |
| REF-SRD-HUB | D&D Beyond SRD hub | https://www.dndbeyond.com/srd | SRD 5.2 FAQ that names such as Tiamat are kept out of SRD 5.2 | 1 | License path; not a kobold sheet |
| REF-CREATOR-FAQ | Creator FAQ | https://www.dndbeyond.com/creator-faq | Creator FAQ: Basic Rules is not the SRD publishing license | 1 | Basic Rules ≠ SRD |
| REF-FOUNDRY-TOKENS | Foundry Tokens | https://foundryvtt.com/article/tokens | Foundry&rsquo;s token Dimensions field is the occupancy | 1 | Dimensions = occupancy; Scale is art |
| REF-FOUNDRY-RINGS | Foundry Dynamic Token Rings | https://foundryvtt.com/article/dynamic-token-rings | 512-pixel subject for a single square | 1 | Software suggestion, not Tiny occupancy |
| REF-ROLL20-TOKEN | Roll20 Token Features | https://help.roll20.net/hc/en-us/articles/360039674573-Token-Features | 70 pixels per unit is also software, not a fifth-edition export law | 1 | 1 unit = 70 px is Roll20, not D&D |
| REF-TM-HOME | Token Maker home | https://www.tokenmaker.one/ | Token Maker can crop a reader-owned JPG, PNG, or WEBP file (up to 10 MB) | 1 | Optional crop after lock; no kobold template |
| REF-TM-FAQ | Token Maker FAQ | https://www.tokenmaker.one/faq | Token Maker FAQ</a> is the public page for transparent PNG export | 1 | Transparent PNG; image-token VTTs; local-first |
| REF-TM-EDITOR | Token Maker editor | https://www.tokenmaker.one/#editor-workspace | Open the <a href="${EN_EDITOR_PATH}" rel="noreferrer noopener">Token Maker editor</a> | 1 | UI names from public editor; not a live walkthrough |

完整公开引用清单与任务卡一致，22 条均保留。不要把 Wikidot、Norse Foundry build、FR wiki、5esrd race、dnd-wiki Frightened 行写入 Sources。

## publicRequirements

### 封面（不插入正文）

| 项 | 值 |
|---|---|
| 源文件 | `tmp/blog-dnd-kobold/en/figures/cover-kobold.png` |
| 尺寸 | 1280×720 |
| 建议 public | `/blog/covers/en/dnd-kobold-guide.webp` |
| alt | Small rusty-orange reptilian kobold standing in a torchlit dungeon corridor, dog-like snout and small brow horns readable, patched leather and a spear; not a Warcraft candle-miner and not a dragonborn hero |
| 规则 | 身份装饰。不承担锁年数字、5 英尺几何或编辑器截图 |

### 正文图

| ID | 源文件 | 尺寸 | 正文槽 | 建议 public | alt（已锁正文） | caption（已锁正文） |
|---|---|---|---|---|---|---|
| FIG-01 | `tmp/blog-dnd-kobold/en/figures/fig-01-lock-2014-2024.png` | 1536×1024 | H2 Lock，source line 之后 | `/blog/inline/dnd-kobold/lock-2014-2024.webp` | Two-column lock diagram: 2014 Kobold labeled Small Humanoid, Lawful Evil, AC 12, HP 5 on the left; 2024 Kobold Warrior labeled Small Dragon, Neutral, AC 14, HP 7 on the right; center note lock one year | Left column is the 2014 Kobold. Right column is the 2024 Kobold Warrior. Matching challenge rating 1/8 is not permission to mix type or alignment. This is a lock diagram, not a D&D Beyond screenshot. |
| FIG-02 | `tmp/blog-dnd-kobold/en/figures/fig-02-pack-tactics-grid.png`（矢量源 `fig-02-pack-tactics-grid.svg`） | 1536×1024 | H2 Pack Tactics | `/blog/inline/dnd-kobold/pack-tactics-grid.webp` | Five-foot grid: two kobolds on squares adjacent to a fighter labeled pack tactics advantage, and one kobold in a neighboring cell with no ally labeled no pack tactics | Count the squares. Pack Tactics needs an ally within 5 feet of the target who is not incapacitated. Each Small kobold still occupies one square. This is a range diagram, not a session log and not a VTT screenshot. |
| FIG-03 | `tmp/blog-dnd-kobold/en/figures/fig-03-snout-crop.png` | 1536×1024 | H2 Crop，无专用模板句之后 | `/blog/inline/dnd-kobold/snout-crop.webp` | Circular crop diagram of a small reptilian kobold with snout and horn-frill inside the ring, marked not a Warcraft candle miner and not a dragonborn | Crop diagram, not a Token Maker screenshot. If the mask shaves the snout or the art is a candle-miner or a dragonborn, recrop or replace the file. There is no Kobold-specific template on this site. |

FIG-02 必须用可控格子图（现有 PNG/SVG）。不要换成生成混战图。封面不要复用进 H2。无 D&D logo。

### 内链（正文已有）

- `/blog/dnd-dragonborn` — 不是短龙裔
- `/blog/dnd-races` — 2024 核心十种，无 kobold
- `/blog/dnd-kenku` — 可玩锁书同形，不是 kobold 规则
- `/#editor-workspace` — 可选裁切
- `/faq` — 透明 PNG / 面向图片 Token 的 VTT
- 不要链占位文 `how-to-build-a-dnd-character-token`
- 正文未链 `/templates/square-token-maker`：不要在组页时补进正文

### 其它装配

- 类名保持 `inline-figure inline-figure--wide-crop` / `inline-figure__image inline-figure__image--wide`
- width/height 保持 1536 / 1024
- Fan Content 与 SRD CC-BY 署名已在正文；不要另造作者名或发布日期占位
- 无 Kobold 模板；预设 Warrior / Mage / Rogue / Cleric / Ranger / Undead / Monster / Other

## integrity

| 项 | 状态 |
|---|---|
| bodyHash | `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac` |
| 计数 | 3750 en 单词 ≥ 2000（`lock-record.md`） |
| D 正文 | PASS，同 hash（`d-check-r1.md`） |
| E 正文 | PASS，同 hash（`e-review.md`）；第 8 层用户终审未做 |
| E 题文 | PASS（`e-title-review.md`），Title 与 locked-seo 一致 |
| freezePublicBlogHandoff | **已冻结** 2026-09-16 |
| 用户终审 | 未进行 |
| 页面审核 | 未做；组页后交 E 看真实页面 |
| 部署 | 未授权 |

G 只装配已锁字段与已审媒体。正文或图中事实若变，作废本 hash，退回 D/E，不静默改文。本冻结不是用户终审，也不是页面图文审通过。
