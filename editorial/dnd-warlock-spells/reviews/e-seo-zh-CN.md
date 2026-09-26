# E-SEO-zh-CN 独立标题、SEO、公开引用与署名复核

## 结论先行

本报告只对当前 F 产物及其绑定的中文正文执行 E 的标题、SEO、公开引用、署名、公开媒体文字与交接污染复核；不改任何被审文件，也不冻结交接。

| 审计门 | 结论 | 说明 |
|---|---|---|
| Title / H1 / Description / slug | **PASS** | 当前最终字段逐项能在同一版正文找到支撑；没有 best、排名、免费、最快、实测或收益承诺。 |
| 近期 3 篇标题去套路 | **PASS（证据范围限定）** | 读取站内最近更新的 3 篇 zh-CN 实际标题；选定标题没有复用其问题比较、`先锁规则再填卡` 或双路线 how-to 骨架。 |
| PublicReference URL / quote / occurrence | **PASS（结构与支持性）** | 10 个来源、13 个定位；全部 quote 在当前正文出现 1 次，均绑定同一 bodyHash；D&D Beyond 页面和 SRD PDF 已实际打开核对。 |
| SRD 5.2.1 署名 | **PASS** | `facts.md` 的完整归属文字与 `attribution.md`、`article.md` 尾注、`publicRequirements.attribution.text` 字节一致。 |
| article 组合 | **PASS** | 仅为最终 H1 + 字节不变 body + 公开署名段，无 front matter、Task/Dispatch、研究路径或作者自评。 |
| 公开媒体文字 / 资源 hash | **PASS** | WebP/SVG 路径、尺寸、bytes、SHA-256、alt/caption 均与 handoff 实际文件一致；SVG 公开文字无内部污染命中。 |
| PublicBlogHandoff 冻结状态 | **PENDING（按要求不冻结）** | 文件仍明确为 `PENDING_E_SEO` / `PENDING_E`；本 E 不改其状态。 |
| 网站页面、用户终审、部署 | **UNVERIFIED / NOT EXECUTED** | content-only 范围不写站、不做页面回读、不产生用户通过或部署结论。 |

### 当前签字范围

对当前实际版本，E 的标题/SEO、公开引用、署名、article 组成与公开媒体门通过；`PublicBlogHandoff.json` 的技术字段仍保留 F 写入的待 E 状态，本报告不把该状态改成冻结或 PASS。正文语义门沿用已有 E-zh-CN-v2 的同 body 版本结论；本报告没有新增正文审稿轮次，也没有改变 Round3 已满（3/3）的事实。

具体差异/FAIL：本 scope 未发现字段、定位、署名、article 组成、公开媒体或公开污染缺陷；唯一的未完成状态是 handoff 仍待 E 冻结以及页面/用户终审未执行，均不是本 content-only E-SEO 报告可自行改写的对象。

## 真实身份、输入与边界

- Run：`run_39994fa3f53e`
- Task：`task_3dba4a301145`
- Dispatch：`ctx_ec796c51eda4`
- Worker terminal：`term_c33d7a28-6c8f-4b91-af6b-faa6b697ec1e`
- Coordinator terminal：`term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`
- Dispatch process incarnation：`842aae27-292d-4b29-b767-e486603a93f2::/Users/wusir/orca/workspaces/token-maker-app/博客@@1427ddf8:e37f2886-1f5b-4647-8665-07ed0fbdd805`
- Dispatch pane：`9630df46-4e63-4ce6-9fe7-1a634ec5dd8e:0f63463b-6751-4dcf-9a25-37d54360a324`
- Codex session：live preamble 和当前 dispatch 元数据未暴露独立 session UUID；不虚构。上述 Task、Dispatch、terminal、process incarnation 和 pane 为本次可回读的真实标识。
- Ego-browser：独立 TaskSpace `63`、Page `p1`；已打开官方页面和 SRD PDF，最后以 `finish({keep:[]})` 结束，未保留页面。
- 关键词：`dnd warlock spells`
- 网站输入：`https://www.tokenmaker.one`
- 交付模式：英文与简体中文 `content-only` 图文博客；本报告只审 `zh-CN` E-SEO。
- locale / country：`zh-CN` / `null`。没有把中文语言、`gl=CN` 查询偏好或任何搜索参数写成确认的中国地区 SERP。
- 只读对象：`final/zh-CN/body.md`、`article.md`、`seo.json`、`public-references.json`、`PublicBlogHandoff.json`、`attribution.md`、中文媒体、`facts.md`、站内最近标题证据与既有 E/F 报告。
- 本次写入：仅本文件 `editorial/dnd-warlock-spells/reviews/e-seo-zh-CN.md`；未改正文、SEO、引用、署名、媒体、handoff、网站、数据库、密钥、依赖、Hermes、原始工作区；未提交、push 或 deploy。

## 当前审计对象 hash

以下值由当前工作树实际 `sha256` 重算，不采用 F 报告口头或固定输出作为证据。

| 对象 | SHA-256 |
|---|---|
| `drafts/zh-CN/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| `final/zh-CN/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| `final/zh-CN/article.md` | `63d813d9a29f288e6b03a38305dd2473c61ec2c55cd614c49aef1e679a9db826` |
| `final/zh-CN/seo.json` | `34c4abb5eea95dbffa0d107a19ecefe66534e3d20be56ef716383aca96b0f6bd` |
| `final/zh-CN/public-references.json` | `9f5d5db454f807586c22da4acbaa493a04f5be506d57425ea6025160fc8f0dee` |
| `final/zh-CN/PublicBlogHandoff.json` | `7f8369a772d790a35597964f1f09e4d91f25dafe9c08dae1429ff962d886c006` |
| `final/zh-CN/attribution.md` | `c1d87a906c68bbc9b046d009cdbd190fbebe77be8a2793534eb051bb6441a173` |
| `media/zh-CN/spell-choice.webp` | `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893` |
| `media/zh-CN/spell-choice.svg` | `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0` |
| `research/rules/facts.md` | `5da435d08ab1ea426ddc4515684434f4e0ba51c58ea38e52466dd6aa6257a70a` |
| `research/site/site-context.md` | `16d5d806d19240c2afd1f41df048521c618b7a3bf3f573a815be2046620c4958` |

Draft/final body `cmp` 退出码为 `0`，两者和 handoff body 均绑定 `7732341...b330`；body 原始字节为 `13827`，NFC + LF 重算相等。

## SEOTruth 逐项核对

### 实际最终字段

- Title：`dnd warlock spells：远程、控场、位移、反应怎么选 | Token Maker`
- H1：`DND 契术师法术（Warlock）：远程、控场、位移、反应怎么选`
- Description：`用 2024 规则把 dnd warlock spells 按远程、控场、位移和反应拆开：先分基础准备数、Pact Magic 法术位与始终准备来源，再按动作、射程、专注和触发条件保留可替换候选。`
- OG Title：与 H1 相同。
- OG Description：`按 2024 规则分开准备数量、Pact Magic 法术位与始终准备来源，再按战斗任务和规则字段选择契术师法术候选。`
- slug：`dnd-warlock-spells`
- `seo.json` 与 handoff 内嵌 `seo` 的对象比较通过；两者均为 `locale=zh-CN`、`country=null`。

| 字段承诺 | 正文支持位置 | 结论 |
|---|---|---|
| 关键词 `dnd warlock spells` | body 第 1 行开头；同一正文主题贯穿全文 | PASS |
| 2024 规则 | body 第 1、3、7、15、38、40 行；引用 2024 Warlock、Concentration、One Spell with a Spell Slot | PASS |
| 远程 | body 第 44–48 行，Eldritch Blast / Hex | PASS |
| 控场 | body 第 50–52 行，Hypnotic Pattern；第 72–78 行，Hold Person 条件 | PASS |
| 位移 | body 第 54–56、74–78 行，Misty Step 和可见未占据落点 | PASS |
| 反应 | body 第 58–60 行，Hellish Rebuke；第 27–34 行反应字段；Counterspell 条件 | PASS |
| 准备数量、Pact Magic、始终准备来源 | body 第 7–17 行、表格第 9–13 行 | PASS |
| 动作、射程、专注、触发条件与可替换候选 | body 第 23–40、66–90 行；替代分支明确落在第 70、78、82、90 行 | PASS |
| OG 概括“规则字段选择候选” | body 第 23–40、88–90 行 | PASS |

标题和 Description 没有 `best`、`最强`、排名、第一、最快、免费、保证、胜率、伤害提升或精确 SERP 承诺。正文第 1 行虽提到“最强法术”，是拒绝无条件榜单的读者引导，不是 SEO 字段的正面承诺。Title/H1 没有 Task、研究、字段审计、来源快照、Agent、内部方法或日期痕迹；“远程、控场、位移、反应”是正文公开的四类战斗任务。

`5级两束`等内容处于正文第 3 行声明的“单职业 2024 契术师”范围；本审核没有把文章扩展解释成多职业 cantrip scaling 结论。`country=null` 且 handoff/SEO 无日期字段，没有发现身份、日期或 URL 虚构。

## 近期 3 篇标题去套路

实际读取 `research/site/site-context.md` 的最近更新排序和 zh-CN 标题（该文件 hash 见上）：

1. `dnd-campaigns`，2026-09-24 修改：`DND入门模组：第一次带朋友，从哪部开始？`
2. `dnd-halfling`，2026-09-20 修改：`DND 半身人：25 英尺还是 30 英尺？先锁 2014/2024 规则再填卡`
3. `greenhouse-stardew`，2026-09-19 修改：`星露谷物语温室怎么解锁：社区中心与 Joja 路线`

选定标题使用“职业主题 + 公开战斗任务分组 + 怎么选”，没有复用：

- 第 1 篇的“第一次带朋友，从哪部开始？”新手提问骨架；
- 第 2 篇的数字二选一和“先锁规则再填卡”骨架；
- 第 3 篇的“怎么解锁：双路线”骨架。

F 记录的 10 个候选实际位于 `reviews/f-zh-CN.md`，共 10 行；`final/zh-CN/title-candidates.md` 实际不存在（`test ! -e` 退出码 `0`）。候选 10 组未进入公开 handoff 或 reader article；最终公开字段只保留选定 H1/Title/Description/slug。

## PublicReference 独立定位与支持性

### 机械定位结果

`public-references.json` 实际 JSON 解析成功，含 `10` 个 `items`、共 `13` 个 `{quote, occurrence}` 定位；`bodyHash` 与当前 body 相等。每条 quote 在规范化当前 body 中出现次数均为 `1`，声明 occurrence 均为 `1`，handoff 内嵌 `publicReferences` 与外部文件对象完全相等；每个公开 URL 也在正文链接中出现。

| 来源 ID | 当前正文行 | 支持性核对 |
|---|---:|---|
| `warlock-2024` | 3、7（两处） | 2024 Warlock 页面 DOM 实际读到 Prepared Spells 表及 Pact Magic 同环阶、短休/长休恢复和逐级准备规则；版本边界属于正文读者说明。 |
| `eldritch-blast-2024` | 15 | D&D Beyond 页面实际读到 Cantrip、1 Action、120 ft、1d10 Force、5级两束且逐束攻击。 |
| `hex-2024` | 30、48 | 页面实际读到 1 Bonus Action、90 ft、Concentration 1 Hour、ability-check disadvantage；升环 2 环最长 4 小时。 |
| `hypnotic-pattern-2024` | 52 | 页面实际读到 3rd、1 Action、120 ft、30-foot Cube、Wisdom save、Concentration 1 Minute，以及受伤/Action 摇醒结束。 |
| `misty-step-2024` | 56 | 页面实际读到 2nd、1 Bonus Action、最多 30 feet、unoccupied space you can see。 |
| `counterspell-2024` | 34 | 页面实际读到 3rd、1 Reaction、60 ft、Constitution save、V/S/M 触发；关于“不把不消耗写给反制者”的主体区分与 `facts.md:199-205` 对读。正文“你的法术位仍按施法消耗”指施法者自己的槽，不是被反制目标的槽。 |
| `hellish-rebuke-srd-521` | 60 | Ego PDF 视觉页 140 实际读到 Reaction、60 feet、可见伤害触发、Dexterity save、2d10 Fire、成功减半和升环每阶 +1d10；`facts.md:157-161` 同步记录。 |
| `hold-person-srd-521` | 74 | Ego PDF 视觉页 141 实际读到 2nd、Action、60 feet、可见 Humanoid、Wisdom save、Concentration 1 minute；`facts.md:175-179` 同步记录。 |
| `concentration-2024` | 38 | D&D Beyond Rules Glossary DOM 实际读到替换专注、受伤 DC 为 10 或伤害一半向下取整较高者、上限 30、失能/死亡结束。 |
| `one-slot-per-turn-2024` | 40 | D&D Beyond Spells DOM 实际读到一个 turn 只能消耗一个 spell slot，不能同回合以 Magic action 与 Bonus Action 各消耗一个。 |

Ego-browser 真实打开的页面标题包括 `Character Classes - D&D Beyond Basic Rules`、`Eldritch Blast - Spells - D&D Beyond`、`Hex - Spells - D&D Beyond`、`Hypnotic Pattern - Spells - D&D Beyond`、`Misty Step - Spells - D&D Beyond`、`Counterspell - Spells - D&D Beyond`、`Rules Glossary - D&D Beyond Basic Rules` 和 `Spells - D&D Beyond Basic Rules`。PDF viewer 的 DOM 文本长度为 0，未把空 DOM 当作支持证据；改用同一 Ego TaskSpace 的 PDF 页 140/141 视觉回读，并与 `facts.md` 的已核验文字对照。

### 引用定位详细回读

以下为实际脚本逐条输出，`count` 为正文精确 quote 出现次数：

```text
warlock-2024 line=3 count=1 occurrence=1
warlock-2024 line=7 count=1 occurrence=1
warlock-2024 line=7 count=1 occurrence=1
eldritch-blast-2024 line=15 count=1 occurrence=1
hex-2024 line=30 count=1 occurrence=1
hex-2024 line=48 count=1 occurrence=1
hypnotic-pattern-2024 line=52 count=1 occurrence=1
misty-step-2024 line=56 count=1 occurrence=1
counterspell-2024 line=34 count=1 occurrence=1
hellish-rebuke-srd-521 line=60 count=1 occurrence=1
hold-person-srd-521 line=74 count=1 occurrence=1
concentration-2024 line=38 count=1 occurrence=1
one-slot-per-turn-2024 line=40 count=1 occurrence=1
locations=13
```

`facts.md:34-38` 明确公开稿必须保留完整 CC-BY-4.0 归属；本报告没有把 `facts.md`、命令编号、审计标签或内部路径搬进读者交付。

## 署名、article 与公开要求

署名实际文本（未改写、未缩写）为：

> This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

逐字比较结果：`facts.md:36` → `final/zh-CN/attribution.md`，退出码 `0`；同一文本实际位于 `article.md` 最后公开署名段，退出码 `0`。`PublicBlogHandoff.publicRequirements` 不是只有状态词，实际字段为：

- `readerArticle.path = article.md`
- `readerArticle.bodyBytesPreserved = true`
- `readerArticle.attributionIncluded = true`
- `attribution.required = true`
- `attribution.path = attribution.md`
- `attribution.text` 与附件正文逐字相等

article 组合规则独立重算为：`# ` + `seo.h1` + `\n\n` + `final/zh-CN/body.md` 原字节 + `\n---\n\n` + `attribution.md` 原字节。比较退出码 `0`，article bytes=`14251`，article SHA=`63d813...b826`。article 不以 front matter 开头，未发现编辑元数据或 `PENDING_E`；它只含 H1、正文和公开署名。

## 媒体与公开文字

| 资源 | 实际检查 | 结论 |
|---|---|---|
| `../../media/zh-CN/spell-choice.webp` | 存在；`file` 退出码 0，780×2100；133876 bytes；SHA=`eeaf...5893`；handoff alt/caption 均在 body | PASS |
| `../../media/zh-CN/spell-choice.svg` | 存在；XML `xmllint --noout` 退出码 0；根元素 `width=780 height=2100 viewBox=0 0 780 2100`；13461 bytes；SHA=`9560...97c0`；handoff alt/caption 均在 body | PASS |

SVG 可见文字只公开说明 `2024 BASIC RULES · WARLOCK SPELLS`、资源三栏、动作/射程/专注/目标/豁免、五个读者候选和“没有必选法术”；这些承诺均能在正文第 7–90 行找到对应内容。逐文件污染扫描对 SVG 和 WebP 均为 `NO_MATCH exit=1`；WebP 为二进制，未把无文本匹配误判为资源不存在。

## 公开污染与内部痕迹扫描

按协调者要求没有使用 `rg || true`。对每个公开文件分别运行 `rg`，真实区分退出码 `1`（无命中）与大于 `1`（命令错误）；所有文件均为 `NO_MATCH exit=1`，总扫描脚本退出码为 `0`：

```text
final/zh-CN/body.md: NO_MATCH exit=1
final/zh-CN/article.md: NO_MATCH exit=1
final/zh-CN/seo.json: NO_MATCH exit=1
final/zh-CN/public-references.json: NO_MATCH exit=1
final/zh-CN/PublicBlogHandoff.json: NO_MATCH exit=1
final/zh-CN/attribution.md: NO_MATCH exit=1
media/zh-CN/spell-choice.svg: NO_MATCH exit=1
media/zh-CN/spell-choice.webp: NO_MATCH exit=1
scan_command_exit=0
```

扫描词覆盖 `Task`、`Dispatch`、Run/ctx/terminal 标记、`Codex`、`session`、`research/`、`/Users/`、`operation-store`、`canary`、污染标记、作者自评、内部/私有路径、worker/agent 自评等。扫描只证明这些精确字串无命中，不把扫描结果扩大成底层权限证明；内部 `operation-store` 未读、未打印。

## 状态、限制与未执行项

- Title / H1 / Description / slug：PASS；各项承诺有正文原句或结构支撑。
- SEO OG 字段：PASS；与正文及 handoff 内嵌 SEO 一致。
- PublicReference：PASS；10 items / 13 locations，所有 quote count=1、occurrence=1、bodyHash 一致，URL/appliesTo/版本字段实际回读。
- SRD 5.2.1：PASS；完整归属来自 `facts.md:34-36`，实际出现在 `article.md` 尾注、`attribution.md` 和 `publicRequirements` 文本字段。
- 公开媒体：PASS；路径、bytes、尺寸、SHA、alt/caption 一致；SVG XML 合法且无内部标记命中。
- Handoff 技术冻结：PENDING；handoff 实际 `integrity.status=PENDING_E_SEO`、`seoReview=PENDING_E`、`handoffFreeze=PENDING_E`。本报告不改状态，不能把 E 审核写成 F 冻结。
- content-only 页面门：UNVERIFIED / NOT EXECUTED；未启动网站服务、未打开 `tokenmaker.one` 文章路由、未做桌面/手机页面回读。
- 用户终审与生产部署：UNVERIFIED / NOT EXECUTED；没有用户确认、跳过或生产发布证据。
- 精确中国地区 SERP、PAA、搜索量：UNVERIFIED；本报告不把 `zh-CN` 或 `gl=CN` 当地区确认。

## 实际验证命令、退出码与关键输出

| 验证 | 退出码 | 关键真实输出 |
|---|---:|---|
| `shasum -a 256` 当前 body/article/SEO/ref/handoff/attribution/media | 0 | 本报告“当前审计对象 hash”表中的全部值 |
| Node body cmp、NFC/LF、handoff body/hash、refs bodyHash | 0 | `draft_final_cmp=true`、`body_nfc_lf_equal=true`、`handoff_body_exact=true`、`handoff_bodyHash=true`、`refs_bodyHash=true` |
| Node article 组合重算 | 0 | `article_combo_rule_h1_body_separator_attribution=PASS`；`article_bytes=14251` |
| Node quote/occurrence 定位 | 0 | `refs_count=10`、`locations=13`、`ref_errors=0`；逐项 count=1 |
| Node handoff refs/SEO/署名字段比较 | 0 | `handoff_refs_exact=true`、`handoff_seo_exact=true`、`handoff_attribution_exact=true` |
| `file` WebP/SVG | 0 | WebP `780x2100`；SVG 可解析 |
| `xmllint --noout` SVG | 0 | 无输出、退出码 0 |
| Node media path/bytes/hash/alt/caption | 0 | 两个资源 `exists=true`、`bytesOk=true`、`hashOk=true`、`altInBody=true`、`captionInBody=true` |
| `rg` 逐文件公开污染扫描 | 0（各 rg 无命中为 1） | 每个文件 `NO_MATCH exit=1`；无 `RG_ERROR` |
| `test ! -e final/zh-CN/title-candidates.md` | 0 | 候选文件不在公开交付目录 |
| F 候选行扫描 | 0 | `f_candidate_rows=10` |
| `orca orchestration check --terminal ... --json` | 0 | Run/Dispatch 可回读；协调者消息为 F 已完成及扫描要求 |
| Ego-browser 官方网页 + PDF 视觉回读 | 0 | TaskSpace 63 / p1；官方页面 DOM 字段实际读到；SRD 页 140/141 实际显示；最后 `finish({keep:[]})` |
| `git diff --check -- editorial/dnd-warlock-spells/reviews/e-seo-zh-CN.md` | 0 | 无空白错误；本报告为唯一写入文件 |

**E-SEO-zh-CN 当前实际版本结论：标题/SEO、引用/定位、署名、article、公开媒体与污染门 PASS；PublicBlogHandoff 仍 PENDING、未冻结；页面和用户终审未执行。**
