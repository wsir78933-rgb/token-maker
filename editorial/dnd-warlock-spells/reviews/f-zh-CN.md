# dnd warlock spells：F-zh-CN 锁稿、标题与交接记录

## 结论先行

**正文技术锁定：PASS。标题与公开交接已生成，但 SEO/交接独立复核：PENDING_E；本报告不冻结交接，也不签自有 SEO PASS。** 当前正文继续绑定 D/E 已通过的同一版本，正文没有被 F 改写；公开署名、正文引用定位、媒体元数据和读者可见 `article.md` 已实际写入 allowlist。content-only 不写网站、不生成 `AssemblyManifest`，页面路由、用户终审和部署保持 UNVERIFIED / NOT EXECUTED。

## 真实身份、输入与边界

- Run：`run_39994fa3f53e`
- Task：`task_d5660cc2348d`
- Dispatch：`ctx_73d1b7c575a1`
- Worker terminal：`term_4e1f2ff8-aa8d-4b44-bae3-c43de917f764`
- Codex session：`01a0dc1b-c146-7b71-b7b2-0c6034680a84`
- Coordinator terminal：`term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`
- Orca runtime：`74a69eea-06aa-4604-bb3f-acad7c782697`
- cwd：`/Users/wusir/orca/workspaces/token-maker-app/博客`；branch：`博客`
- 输入：关键词 `dnd warlock spells`；网站 `https://www.tokenmaker.one`；`locale=zh-CN`；用户未指定 `country`，公开交接使用 `country: null`。
- 模式：英文与简体中文 content-only 图文博客；本 F 任务只锁中文，不写网站，不提交/push/deploy，不新增依赖，不动数据库、密钥、Hermes 或原始工作区。
- 当前中文唯一有效 B 卡：`planning/zh-CN/task-card-v1.md`；没有使用旧 `planning/zh-CN/task-card.md`，没有读取验收样稿或历史参考作为素材。
- 已完整读取并按本阶段使用：`执行入口.md`、`01-统一工作流.md`、`04-公开交接与页面装配.md`、`参考规则/标题与描述规则.md`、`参考规则/七罪引擎.md`、`参考规则/事实核验与公开引用.md`、有效中文任务卡、`脚本/正文计数.py`；浏览器能力先读 `/Users/wusir/.mirasim/skills/ego-browser/SKILL.md`。站内最近标题证据只取 `research/site/site-context.md`，没有臆造近期标题。

## D/E 同版门前置核对

本任务启动前先读取并核对 `reviews/d-zh-CN.md`、`reviews/d-zh-CN-v3.md`、`reviews/e-zh-CN.md`、`reviews/e-zh-CN-v2.md`。D 对同一 body/media 版本的 ResearchTrace、ReaderValue、Repetition 均 PASS；E-v2 将正文门明确判为 PASS，并把尚未生成的 PublicBlogHandoff/SEO/读者可见署名归为 F 后续 PENDING，不把前版阶段归属 FAIL 误当正文字节失败。E-v2 明确要求从 `research/rules/facts.md:34-38` 带出完整 SRD 5.2.1 归属文字；本任务已按此要求生成 `final/zh-CN/attribution.md`、`article.md` 和 handoff attribution 字段。

实际当前文件回读命令：

```text
$ shasum -a 256 drafts/zh-CN/body.md media/zh-CN/spell-choice.svg media/zh-CN/spell-choice.webp
7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330  drafts/zh-CN/body.md
9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0  media/zh-CN/spell-choice.svg
eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893  media/zh-CN/spell-choice.webp
exit_code=0
```

D 与 E 报告中的 body SHA、SVG SHA、WebP SHA 与上述当前实际输出逐项相等，因此门前条件 **PASS**；未发现不符，也没有自行修正文稿或媒体。

## 正文 NFC、SHA 与机械长度锁定

当前 draft body 的只读 NFC/LF 核对：

```text
bytes=13827 nfc_lf_bytes=13827 nfc_equal=True raw_sha=7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330 nfc_lf_sha=7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330
exit_code=0
```

按已读取脚本原命令对纯 body 计数：

```text
$ python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/drafts/zh-CN/body.md --locale zh-CN
{
  "mechanical_units": 3210,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "sha256_raw": "7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330",
  "sha256_nfc_lf": "7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330"
}
exit_code=0
```

计数只针对 `drafts/zh-CN/body.md` 纯正文；标题、媒体 alt/caption、来源和署名没有计入 3210。F 未替 C 改写 body。

以 `apply_patch` 将 body 写入 `final/zh-CN/body.md` 后实际回读：

```text
cmp drafts/zh-CN/body.md final/zh-CN/body.md
cmp_exit=0
final body SHA=7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330
```

因此 final body 与当前 D/E 版本字节一致，正文锁定 **PASS**。

## 七罪标题与描述执行

### 正文承诺抽取

- 读者实际得到：先分开 2024 契术师的基础准备数量、Pact Magic 法术位和始终准备来源，再按战斗任务与动作、射程、目标/豁免、专注、升环字段留下可替换候选。
- 最大的实际结果：1/3/5 级分别给出可回算的 2/4/6 项基础准备法术与 1/2/2 个对应环阶的 Pact Magic 位，并把远程、控场、位移和反应的选择条件写清楚。
- 本文独有的可执行观点：法术名不是选择完成标志；把资源账、字段和战斗任务并列，才能解释为什么保留或替换候选。
- 绝不能承诺：无条件“最强”清单、胜率或伤害提升、每场都适用的固定六项、免费/最快/最佳效果、精确地区 SERP 或排名。

本报告的“10 组候选与归类筛选”记录区实际保留了先自由生成、后归类的 10 组标题/Description；这些内部记录只在 `reviews/f-zh-CN.md`，不是正文，也没有写入 `PublicBlogHandoff.json`。十组分别归入反差数字、自我颠覆、悬念场景、损失进入、结论前置、群体点名中的适用类别，并记录具体停留要素与七类驱动；不要求六种机制全部出现。

| 编号 | 自由生成标题 | Description 方向 | 归类 / 停留 / 驱动 | 筛选 |
|---:|---|---|---|---|
| 1 | DND 契术师法术（Warlock）：按等级与战斗任务填好准备栏 | 从 2024 契术师的准备数量与 Pact Magic 法术位开始，再用动作、射程、专注和触发条件筛出 1/3/5 级候选。 | 结论前置 / 捷径 / 懒惰 | 通过，备选 |
| 2 | 查 dnd warlock spells，先把准备数和法术位分开 | 这份 2024 选择表按 1/3/5 级拆开基础准备法术、Pact Magic 和始终准备来源，并给出远程、控场、位移和反应的替代理由。 | 损失进入 / 异常、捷径 / 懒惰 | 通过，备选 |
| 3 | 为什么你的契术师法术表总要多留一栏？ | 2024 规则中，戏法、基础准备法术、Pact Magic 法术位和始终准备来源承担不同工作；用字段和等级例子重新核对你的候选。 | 悬念场景 / 窥探、异常 / 傲慢 | 淘汰：“总要”过度泛化 |
| 4 | 一回合只能消耗一个法术位：契术师法术选择的关键检查 | 用 Hex、Eldritch Blast、Hypnotic Pattern、Misty Step 和 Counterspell 说明动作、附赠动作、反应与专注怎样改变 1/3/5 级准备。 | 结论前置 / 异常、终结 / 懒惰 | 淘汰：只覆盖一个检查点 |
| 5 | 如果只记住法术名字，契术师仍然选不完 | 把每个候选补上环阶、动作、射程、目标/豁免、专注和升环变化，再按战斗任务写出可替换的准备栏。 | 自我颠覆 / 异常 / 傲慢 | 通过，备选 |
| 6 | DND 契术师法术（Warlock）：远程、控场、位移、反应怎么选 | 同一篇表格里比较 Eldritch Blast、Hex、Hypnotic Pattern、Misty Step、Counterspell 和 Hellish Rebuke 的条件；示例不是无条件最强榜。 | 群体点名 / 捷径 / 懒惰 | **通过，选定** |
| 7 | 1、3、5级契术师怎么填法术？先算资源再选候选 | 用 2/4/6 项基础准备法术和 1/2/2 个 Pact Magic 位做三档记录，再按专注与动作成本替换不合适的名字。 | 结论前置 / 捷径 / 懒惰 | 通过，次选；问句接近站内新手提问 |
| 8 | 把 Hex、Misty Step 和 Hypnotic Pattern 放一起，先看你要解决什么 | 远程持续伤害、脱离危险和范围控制不能同时成为一回合计划；按场景选择，并保留 Counterspell 的反应条件。 | 悬念场景 / 冲突、窥探 / 懒惰 | 淘汰：“放一起”可能暗示固定同备 |
| 9 | 契术师法术最容易算错的不是强度，而是资源 | 区分准备数量、法术位环阶、附赠动作、反应和专注，最后用 1/3/5 级示例检查角色资料是否能回算。 | 自我颠覆 / 异常 / 傲慢、懒惰 | 通过，备选；句式接近站内同日标题 |
| 10 | dnd warlock spells 选择清单：写下这六个字段再落笔 | 准备数量之外，记录环阶、动作、射程、目标/豁免、专注和升环效果；2024 等级示例帮助你留下条件化候选。 | 结论前置 / 捷径 / 懒惰 | 淘汰：正文是五个标签，数字不兑现 |

选定方向为第 6 组：

- H1：`DND 契术师法术（Warlock）：远程、控场、位移、反应怎么选`
- SEO Title：`dnd warlock spells：远程、控场、位移、反应怎么选 | Token Maker`
- Description：`用 2024 规则把 dnd warlock spells 按远程、控场、位移和反应拆开：先分基础准备数、Pact Magic 法术位与始终准备来源，再按动作、射程、专注和触发条件保留可替换候选。`
- slug：`dnd-warlock-spells`

选定标题的停留检查 **PASS**：具体点名读者马上要解决的四类战斗任务，正文确有四个对应小节与条件化选择，不靠空泛“最强”情绪。适配检查 **PASS**：没有虚构数字或结果，`远程、控场、位移、反应` 在 body 中逐项出现，Description 的 2024 规则、三栏资源、字段和条件化候选均有正文承接。

### 近期 3 篇去套路证据

以下只使用 `research/site/site-context.md` 的线上元数据记录（最近更新排序；不是博客入口注册顺序）：

1. `dnd-campaigns`，2026-09-24 更新：`DND入门模组：第一次带朋友，从哪部开始？`
2. `dnd-halfling`，2026-09-20 更新：`DND 半身人：25 英尺还是 30 英尺？先锁 2014/2024 规则再填卡`
3. `greenhouse-stardew`，2026-09-19 更新：`星露谷物语温室怎么解锁：社区中心与 Joja 路线`

三篇分别使用新手提问/比较、数字对照加“先锁规则”、how-to 加路线结构。选定标题改用四类具体战斗任务的群体点名与结论式选择，不复用“第一次带朋友，从哪部开始”“先锁……再填卡”“怎么解锁：两条路线”等标题骨架；也没有使用同日并列样本 `dnd-wizard-spells` 的“X 不等于 Y”句式。站内证据真实存在，但不代表任何排名效果。

## 公开引用、署名与媒体

`final/zh-CN/public-references.json` 含 10 个公开来源，每项 `appliesTo` 都使用原 body 精确 quote 与从 1 开始的 occurrence，并绑定 bodyHash；其中 SRD 5.2.1 的 Hellish Rebuke/Hold Person 各自使用 PDF 页码 URL，公开署名不依赖内部事实编号。

引用定位实际回读：

```text
json_valid=True for seo.json, public-references.json, PublicBlogHandoff.json
refs_count=10
quotes_all_pass=True
每个 quote 的实际 body occurrence 均为声明的 1
git diff --check -- editorial/dnd-warlock-spells/final/zh-CN：exit=0
```

`final/zh-CN/attribution.md` 与 `article.md` 尾注逐字保留 `research/rules/facts.md:34-36` 的必要文字：

> This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

媒体真实回读：

| 公开资源路径（包内相对路径） | 格式 | 尺寸 | bytes | SHA-256 | alt/caption |
|---|---|---:|---:|---|---|
| `../../media/zh-CN/spell-choice.webp` | WebP | 780×2100 | 133876 | `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893` | 使用正文已有决策图 alt；caption 为“先核对准备数量和 Pact Magic，再按动作、专注与目标条件筛选；示例不构成必选清单。” |
| `../../media/zh-CN/spell-choice.svg` | SVG | 780×2100 | 13461 | `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0` | 与 WebP 使用同一已核验 alt/caption；标作 source-image，不替代正文 WebP 页面资源。 |

`article.md` 的组合规则已实际执行并记录：`H1 + "\n\n" + body.md 字节 + "\n---\n\n## 公开署名\n\n" + attribution text`。在该规则下，body segment 与 `final/zh-CN/body.md` 的字节比较为 `segment_cmp=True`，body segment SHA 仍为 `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330`；署名不计入正文 3210 计数。

## PublicBlogHandoff 实际绑定

`final/zh-CN/PublicBlogHandoff.json` 字段完整包含 `locale`、可空 `country`、实际 `body`、`bodyHash`、`seo`、`publicReferences`、`publicRequirements` 和 `integrity`。实际回读：

| 对象 | SHA-256 | 结果 |
|---|---|---|
| `final/zh-CN/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` | PASS |
| `final/zh-CN/seo.json` | `34c4abb5eea95dbffa0d107a19ecefe66534e3d20be56ef716383aca96b0f6bd` | PASS |
| `final/zh-CN/public-references.json` | `9f5d5db454f807586c22da4acbaa493a04f5be506d57425ea6025160fc8f0dee` | PASS |
| `final/zh-CN/article.md` | `63d813d9a29f288e6b03a38305dd2473c61ec2c55cd614c49aef1e679a9db826` | PASS |
| `final/zh-CN/attribution.md` | `c1d87a906c68bbc9b046d009cdbd190fbebe77be8a2793534eb051bb6441a173` | PASS |

`PublicBlogHandoff.json` 的 `body` 字段实际 UTF-8 回读与 `final/zh-CN/body.md` 完全相等，bodyHash 相等；publicReferences 的 10 个定位 quote 均能在该 body 出现一次；media bytes、尺寸和 SHA 与实际文件相等。公开字段扫描未命中 `operation-store`、`research/`、`private`、`canary`、`Task`、`Dispatch`、`session` 等内部标记；公开字段只保留官方 URL、包内相对媒体路径、正文、SEO、引用、署名和完整性摘要。

Handoff 的 `integrity.status`、`seoReview`、`handoffFreeze` 均为 `PENDING_E`，不是 PASS 或冻结声明。`country` 为 `null`；不能把中文 Google 的 `gl=CN` 查询偏好写成已验证中国地区。

最终整体验证第一次探针因把 Python `str` 与 `bytes` 混用于文章禁词断言而退出 1（`TypeError: a bytes-like object is required, not 'str'`）；该探针只读、没有文件或状态副作用。修正为统一 bytes 断言后原范围重跑退出 0，输出 `PASS final body/hash/NFC/handoff/reference/article/public-field checks`；随后计数、SVG `xmllint` 与 `git diff --check` 也分别退出 0。

## 验收矩阵

| 项目 | 结论 | 真实依据 / 限制 |
|---|---|---|
| D 同版 body/media 门前条件 | PASS | D 当前报告及实际 shasum：body、SVG、WebP 全部与当前文件相等；D 三门报告为 PASS。 |
| E 同版正文门前条件 | PASS | E-v2 当前正文 PASS；同一 body/media SHA；E 的 F handoff/SEO 仍待独立复核。 |
| NFC 与正文 SHA 锁定 | PASS | `nfc_equal=True`、raw/nfc SHA 相同；final body `cmp_exit=0`。 |
| zh-CN 机械计数 | PASS | 原命令退出 0；`mechanical_units=3210`、`required_floor=2000`、`meets_mechanical_floor=true`。 |
| 七罪 10 候选实际筛选 | PASS | 本报告的候选记录区保存自由生成、六机制归类、停留/适配逐项检查；选定方向有 body 对应。 |
| 近期 3 篇去套路 | PASS（限定证据范围） | 使用 `research/site/site-context.md` 的 dnd-campaigns、dnd-halfling、greenhouse-stardew 实际元数据；不作排名结论。 |
| PublicReference quote/occurrence | PASS | 10 项；每个 occurrence 实际为 1；bodyHash 绑定。 |
| SRD 5.2.1 公开署名 | PASS（材料已生成） | `attribution.md`、`article.md` 尾注和 Handoff `publicRequirements.attribution.text` 均存在；仍待 E 复核 handoff。 |
| 媒体路径/尺寸/alt/caption/hash | PASS | WebP 780×2100/133876 bytes、SVG 780×2100/13461 bytes，实际 SHA 相等。 |
| PublicBlogHandoff 字段与完整性 | PASS（技术） | JSON 可解析；body、refs、SEO、article、attribution 哈希及状态已绑定；最终冻结仍 PENDING_E。 |
| SEOTruth / 标题独立复核 | **PENDING_E** | 本 F 只生成，不代签后续 E；Handoff 显式 `seoReview=PENDING_E`。 |
| 精确中国地区 SERP、PAA、搜索量 | UNVERIFIED | 用户未指定 country；研究记录明确 `gl=CN` 只是查询偏好。 |
| 网站写入、真实页面、桌面/手机页面验收 | UNVERIFIED / NOT EXECUTED | content-only 且本任务禁止写站；没有造最终 URL。 |
| 用户终审与生产部署 | UNVERIFIED / NOT EXECUTED | 不属于本任务授权范围。 |

## 本任务写入文件

- `editorial/dnd-warlock-spells/final/zh-CN/body.md`
- `editorial/dnd-warlock-spells/final/zh-CN/article.md`
- `editorial/dnd-warlock-spells/final/zh-CN/attribution.md`
- `editorial/dnd-warlock-spells/final/zh-CN/seo.json`
- `editorial/dnd-warlock-spells/final/zh-CN/public-references.json`
- `editorial/dnd-warlock-spells/final/zh-CN/PublicBlogHandoff.json`
- `editorial/dnd-warlock-spells/reviews/f-zh-CN.md`

未修改 draft body、媒体、B 卡、D/E 报告、网站源码或任何 allowlist 外文件；未新增依赖、未提交、未 push、未 deploy、未写数据库/密钥/Hermes。
