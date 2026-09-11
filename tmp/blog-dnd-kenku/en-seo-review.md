# EN SEO 独立题文复核 — dnd kenku

| 项 | 值 |
|---|---|
| 角色 | 独立题文复核。未写 `en-body.md`，未做 10 组标题。 |
| 被审 SEO | `tmp/blog-dnd-kenku/en-seo.md` |
| 已锁正文 | `tmp/blog-dnd-kenku/en-body.md` |
| 要求 hash（NFC + LF） | `8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b` |
| 本机 `shasum -a 256` | 同要求 hash，与 `en-lock.json` 一致 |
| 规则 | `标题与描述规则.md`、`七罪引擎.md` |
| 改正文 | **无。** 本题只审题文槽位。 |
| 三态 | **REVISE** |

---

## 1. 终稿原句

| 字段 | 草案选定 |
|---|---|
| title / h1 | DnD Kenku: Volo's Speaks Only by Mimicry; MotM Can Talk |
| seoTitle | DnD Kenku: Volo's Speaks by Mimicry; MotM Can Talk |
| metaDescription | Ask the DM which Kenku page is legal. Copy that speech and Mimicry line, not a Volo's-MotM mix. Crop a wingless raven-person. Kenku is not in the 2024 PHB. |
| excerpt | A dnd kenku is a wingless raven-person copied from Volo's or MotM, not from the 2024 Player's Handbook. Ask the DM which page is legal, copy that speech and Mimicry check, and keep the beak inside the token. |

页面 H1 = `title`。`<title>` / OG 主句 = `seoTitle`；OG 实际显示 `seoTitle \| Token Maker`（`createBlogPostMetadata`）。

---

## 2. 正文承诺（复核自抽，不沿用草案四问当证据）

读者点开后实际得到：向 DM 锁 Volo’s 或 MotM（2024 桌是 MotM 特性 + 背景加值，不是 2024 PHB 核心物种），按**那一页印刷文**抄语言 / Mimicry / 技能包，再裁无翼鸦人 token。

正文最大已核验事实：2024 PHB 核心十物种没有 Kenku。D&D Beyond 公开索引有 Volo’s（Legacy）与 MotM 两条，**都不印 Languages**。说话分叉每次都挂 unofficial lineage transcription，并要求 confirm on printed Volo’s / MotM。PC 无黑暗视觉。混书是常见失败。

绝对不能写成定论的：Kenku 在 2024 PHB；**所有** Kenku 都不能说话或都能说话；把 wikidot 转写当成已核对印刷原文；免费 / 最快 / 最佳 / 实测 / 百分比。

核心承诺只能是：没有一条全 5e 通用的 Kenku 说话规则；锁一页，抄那一页，印刷页为准。

---

## 3. 过冲判定：过冲

问的是：正文带「unofficial transcription / confirm on print」，标题写成「Volo's Speaks Only by Mimicry; MotM Can Talk」是否过冲。

**是过冲。** 标题把未打开的印刷语言句，写成已成立的规则分叉。

正文同一主张的实际限定（开篇第 1 段、总表 `Can it speak?`、`Languages, copied from the locked page`、FAQ `Can a Kenku speak in 5e?`）：

1. 免费 D&D Beyond 索引 **没有** Kenku Languages 行。
2. 失语 / 能讲 Common+1 来自 **unofficial** [Kenku lineage transcription](https://dnd5e.wikidot.com/lineage:kenku)。
3. 每次都要求 **confirm on printed Volo’s or MotM**。
4. 「That is Lock A **if printed Volo’s matches**. It is not “all 5e Kenku.”」
5. Session-zero：2024 桌若锁 Volo’s，失语是否仍适用 **unresolved until the DM answers**。
6. 2024 MM 怪物语言栏写 Common and Primordial (Auran)，传说段仍写 mimic-only。标题里的 `MotM Can Talk` 未标明是 **MotM 玩家页**，会被读成「MotM / 怪物也能开口」。

草案适配检查写「标题陈述的是本页工作区分，没有写成已核对印刷页逐字 → 通过」。这是误判。工作区分可以写进正文并加限定；标题把限定拿掉后，读者读到的是官方定论。七罪：「标题可以狠，不能骗。」`标题与描述规则.md`：「标题里的结果是否真实。」wikidot 上有这两句 ≠ 印刷 Volo’s / MotM 已核验为这两句。

`seoTitle` 去掉 `Only` 是第二次承诺漂移，不是缩写。MotM 玩家转写里 Mimicry 仍在；「Volo's Speaks by Mimicry」两边都能说，H1 的信息差全靠 `Only`。规则要求 H1 / Title / seoTitle **同一承诺**。草案写「承诺不变」不成立。

metaDescription **不过冲**：问 DM、抄该页、禁止混书、裁切、2024 PHB 无 Kenku，都能在开篇三句 + 混书段 + FAQ 找到。它没有把转写说成印刷事实。缺口是没补「from print」，与过冲标题绑在一起时，描述无法把标题拉回来。

excerpt **不过冲**：没有写 Volo’s 失语 / MotM 能说话为定论。可保留。

---

## 4. 主意图与停留（选定稿）

主搜索意图是已决定玩 **dnd kenku** 之后：锁哪一页、会不会开口、怎么裁。选定 H1 的停留点（全体失语迷思 vs 两页分叉）对准主意图，这点成立。失败在兑现层级：停留用的那条信息差，正文拒绝写成已核验印刷结果。

---

## 5. 最近 3 篇去套路（独立读取，不沿用草案名单）

来源：`src/lib/blog/registry.ts`。草案写的是 Dragonborn / Druid / Backgrounds，**漏了数组第 2 条 Cleric Spells**，也未按 `publishedAt` 计入 Campaigns。

**首页数组前三（读者先看到的英文标题）：**

| # | slug | publishedAt | title | seoTitle |
|---|---|---|---|---|
| 1 | dnd-dragonborn | 2026-09-10 | DnD Dragonborn: Lock the Rulebook, Copy Breath and Names, Crop a Token | DnD Dragonborn: Lock 2014 or 2024, Then Copy Traits |
| 2 | dnd-cleric-spells | 2026-09-11 | DND Cleric Spells: Prepare Tomorrow's List by Job, Not Rank | DND Cleric Spells: Prepare by Job, Not Rank |
| 3 | dnd-druid | 2026-08-28 | DnD Druid: Build a Level 1 Caster, Then Unlock Wild Shape at Level 2 | DnD Druid: Level 1 Is Spells; Wild Shape Starts at 2 |

**按 `publishedAt` 最近三：** Cleric Spells（2026-09-11）、Campaigns「Pick a Premade DnD Campaign by Matching the Product to Your Table」（2026-09-11）、Dragonborn（2026-09-10）。Backgrounds 的 `publishedAt` 是 2026-08-26，只是 `updatedAt` 为 2026-09-10。

选定稿相对上述套路：**结构上没有撞** Lock/Copy/Crop 三拍、Cleric 的「by Job, Not Rank」、德鲁伊的 1 级再解锁 2 级、背景的 Confirm the year then copy、Campaigns 的 Match product to table。去套路不是本份 REVISE 的主因。草案对照集不完整，记录在案，不把漏检写成已通过。

---

## 6. 未核验的最快 / 最佳 / 实测

选定 title / h1 / seoTitle / metaDescription / excerpt / coverAlt：**无** 免费、最快、最佳、实测、百分比、虚构日期。

正文里的 `best` 是「no official best Kenku class」否定句，未进入题文。此项 **PASS**。

---

## 7. 两道检查（选定稿）

| 检查 | 结果 | 说明 |
|---|---|---|
| 停留 | 方向对，兑现失败 | 会停，因为打「全体失语」。停下来后标题给出的是印刷定论，正文给的是转写 + 对印刷书。 |
| 数字 | PASS | 终稿无数字。 |
| 结果是否真实 | **FAIL** | `Volo's Speaks Only by Mimicry; MotM Can Talk` 不是已核验印刷结果。 |
| 点名对象 | PASS | 已决定玩 Kenku 的 5e 玩家。 |
| 方法是否给全 | 描述 PASS，标题越权 | 描述覆盖锁页 / 禁混 / 裁切 / 非 2024 PHB。标题把转写内容升成方法结论。 |
| 情绪是否夸张 | **FAIL** | 不是灾难恐吓，是确定性夸张。 |
| H1 与 seoTitle 同一承诺 | **FAIL** | 丢掉 `Only` 改变 Volo’s 那一侧。 |
| 描述加料 | PASS | 未塞第二篇承诺，也未写最快最佳实测。 |

正文接得住「说话跟锁的书走、印刷页为准」。正文接不住「Volo’s 只能拟声、MotM 能说话」作为无限定标题。按规则：只是不当标题 → 改标题，**不撤销正文锁**。

---

## 8. 替换（不改正文；仍用七罪；仍去龙裔套路）

改法：保留两书对照这个停留点，**不再引用转写里的具体语言句**。改用正文 FAQ 已写明、且不依赖印刷页逐字的判断：`It depends on the book.`

| 字段 | 替换 |
|---|---|
| title | DnD Kenku: Speech Depends on Volo's or MotM |
| h1 | DnD Kenku: Speech Depends on Volo's or MotM |
| seoTitle | DnD Kenku: Speech Depends on Volo's or MotM |
| metaDescription | Ask the DM which Kenku page is legal. Copy that speech and Mimicry line from print, not a Volo's-MotM mix. Crop a wingless raven-person. Not in the 2024 PHB. |

长度（字符，含空格）：title / h1 / seoTitle 43；metaDescription 157。无品牌后缀。OG 将显示 `DnD Kenku: Speech Depends on Volo's or MotM \| Token Maker`。

excerpt、slug、coverAlt、coverLabel **不改**。

### 七罪归类（替换句，后贴标签）

- 机制：**结论前置**。不是「Lock / Copy / Crop」，不是正确废话「Kenku 要看规则书」。
- 停留要素：**异常**（不是一条全 5e 失语规则）、**冲突**（Volo’s 页 vs MotM 页）。
- 人性驱动：傲慢（以为已经懂 mute Kenku）；懒惰（不想读两页再混抄）。
- 正文原句：FAQ「It depends on the book.」；开篇「Ask the DM which Kenku page is legal, copy that page onto the sheet」；索引两条是 Volo’s 与 MotM；Lock C 仍是 MotM 玩家页，不是 2024 PHB Kenku。

### 停留检查（替换句）

目标读者已经决定玩 Kenku，正在查会不会开口、该抄哪一页。刷到「Speech Depends on Volo's or MotM」会停：流行记忆是全体失语，标题说开口跟这两本走，不是一条 5e 通例。信息差具体。正文用锁页 + 转写对照 + 对印刷书兑现，不再把转写句写进 H1。

### 适配检查（替换句）

| 项 | 结果 |
|---|---|
| 数字 | 无。 |
| 结果是否真实 | 「depends」是 FAQ 原句，不是印刷失语/能说话定论。 |
| 点名 | 搜 dnd kenku、已决定玩的人。 |
| 方法 | 描述补：问 DM、from print、禁混、裁无翼、不在 2024 PHB。 |
| 情绪 | 无灾难句。 |
| 与近 3 篇 | 无 Lock/Copy/Crop 三拍；无「by Job, Not Rank」；无 1 级再解锁 2 级；无 Confirm the year；无 Match the product to your table。两书并列是 Kenku 索引事实，不是把龙裔的 2014/2024 换词。 |
| 未承诺 | 无免费最快最佳实测；无「MotM Can Talk」；无「Speaks Only by Mimicry」；seoTitle 与 H1 同一句。 |

未采用更狠但仍过冲的改法（例如加 `Unofficial:` 却继续写 mute / can talk 当事实，或把 `MotM Can Talk` 缩成 seoTitle）。未把主标题改成 Token 裁切或 Mimicry DC，以免偏离主意图或滑回龙裔末拍。

---

## 9. 结论

**REVISE。** 只改题文，不改正文，不撤锁。

过冲点是选定 H1 / Title 把 unofficial transcription 的说话差异写成印刷规则；seoTitle 丢掉 `Only` 后又与 H1 不是同一承诺。描述方向可用，补 `from print` 并与新标题对齐。最近 3 篇去套路在独立补名单后，选定稿结构未撞套路，但对照集曾漏 Cleric Spells。无未核验最快 / 最佳 / 实测进入终稿槽位。
