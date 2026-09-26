# D-en 英文写后检查（Round 1）

## 结论先行

当前英文稿件的三门独立写后检查结果为：

- ResearchTrace：FAIL
- ReaderValue：FAIL
- Repetition：FAIL

因此当前稿不能流入 F 锁稿/标题环节。正文问题只交回 C 修订；修订后 D 需要对新版本全量重跑三门，E 仍需独立审核。当前三张英文图是规则流程图，正文与图中文字/图注能够互相核对，但最新调度要求的“人物图/游戏角色图”尚未完成，单独记为 media-change-pending；本报告不修改图片、不改正文。

## 身份、版本与范围

- 角色：D — 英文写后检查；从未参与 A 研究、B 布局或 C 写作。
- Run：run_39994fa3f53e
- Task：task_ca3fbfa50940
- Dispatch：ctx_deec62d8faef
- Worker terminal：term_9cad03a1-47fb-4b73-9c2d-cbf0722042e5
- Codex session：01a0dc56-1922-7361-9c73-9e9c636f1a7b
- 日期：2026-09-26，Asia/Shanghai
- 主关键词：dnd warlock spells
- 站点：https://www.tokenmaker.one
- 模式：content-only；未写网站、未改数据库/密钥/Hermes、未新增依赖、未提交/push/deploy。
- 检查输入：英文原始搜索记录、英文任务卡、英文规则事实证据、英文 drafts/en/body.md、英文 media/en 的 SVG/WebP。
- 明确未读：作者自评/作者笔记、任何中文稿件或中文审核、验收样稿、历史参考；未以其他语言或旧报告代替本次英文检查。
- 本角色只写本报告及其版本副本，没有修改正文或媒体。

## 版本绑定

正文：

- 文件：editorial/dnd-warlock-spells/drafts/en/body.md
- SHA-256：6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a

英文媒体 SHA-256：

- editorial/dnd-warlock-spells/media/en/concentration-choice.svg：f249fd3531b52c038a15531f3088c1f9c93f65edfedbac04949abea01322c077
- editorial/dnd-warlock-spells/media/en/concentration-choice.webp：4e3c27ffcf1148d6e45f732d3dca8fd5bbf389885206bd2037aed5cb8b9f2b26
- editorial/dnd-warlock-spells/media/en/spell-choice.svg：9e20ae6a74fca03558ff3c23d8b5ff3baab34be19250dcb2b86f0700886743ab
- editorial/dnd-warlock-spells/media/en/spell-choice.webp：2345958984441f751dff3191a5dc9df88ffabb106e81d52b1e95291bbff82704
- editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.svg：a77918258f6d8be37eed6bb2a94d4b4aa4f53c884a99f0c6d3af8d17e1ebf32c
- editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.webp：03032baeb883425db71c69b8bd1ade139050d972a4016423c040ae7542c2d22f

版本副本：editorial/dnd-warlock-spells/reviews/d-en-v1.md；应与本文件内容一致。

## 1. ResearchTrace — FAIL

未发现 Google 排名、SERP 日志、A/B/C/D/E/F 标签、Task/Dispatch ID、私有路径、提示词、作者自评或研究快照泄漏到正文或三张图中；公开来源链接和必要的版本/规则说明是合法读者材料。以下两处仍是编辑者如何组织文章的评论，不是直接帮助读者完成选择的规则说明。

### RT-1：版本段落使用作者视角和内部编辑比喻

- 位置：body.md:11
- 原句：“This article makes 2024 the active ruleset. The 2014 sentence is a guard rail, not a second recommendation guide.”
- 证据：任务卡要求 2024 为主动版本、2014 只作防混版提醒；规则事实证据确认 2014 是 Spells Known、2024 是 Prepared Spells（research/rules/facts.md:61-68）。但原句把“本文如何安排素材”写给读者看，尤其是 “This article” 和 “guard rail / second recommendation guide” 是构稿评论。
- 必要改法：改为直接读者规则，例如：“Use 2024 as the active ruleset. Keep the 2014 note only to prevent version mixing.” 不再解释文章内部如何分配段落。

### RT-2：替换段标题把核验过程写成“证据允许”

- 位置：body.md:118，以及相邻 body.md:120
- 原句：“Replace one choice only when the evidence allows it” / “a class-list entry does not tell you an effect that you have not checked in the 2024 spell text.”
- 证据：公开规则真正支持的是“2024 每升一个 Warlock 等级可替换一个列表法术”，且 always-prepared 例外另计；证据文件把该规则定位在 research/rules/facts.md:61-68。读者不应被要求服从未命名的内部 evidence。
- 必要改法：标题改为 “Replace one choice only when the 2024 class rule permits it”；正文直接写替换触发条件，并把“检查法术正文”改成链接到具体 2024 来源，而不是泛称 evidence。

### ResearchTrace 保留项

- body.md:143-149 的 Sources 是公开来源清单，不是检索日志。
- body.md:25、57、87 的规则来源/版本方法说明服务于读者核验，未发现内部抓取步骤。
- 三张 SVG 的 title/desc、正文图中文字和图注均没有内部任务信息。图内 “selected source” 是版本限定，不是私有路径或研究日志；不过若媒体被替换，须重新核对文字和图注。

## 2. ReaderValue — FAIL

当前稿已经有单一主任务、级别 5 的具体工作表和可执行示例；但以下两项会让读者把资源预算或 Counterspell 的槽位归属读错。

### RV-1：六个基础准备项没有明确排除 always-prepared 特性法术

- 位置：body.md:15、body.md:101、body.md:129；spell-choice.svg 中虽写了 “6 BASE NAMES”，但正文没有把“基础六项”和特性授予的 always-prepared 法术明确分开。
- 原句：“At Warlock level 5, the 2024 table gives you six prepared spells...” / “fill the six spaces...” / “exactly six prepared spell names”
- 证据：research/rules/facts.md:61-68 明确：2024 表头是 Prepared Spells，且其他 Warlock 特性授予的 always prepared 法术不占此表数量。任务卡同样把“六个基础 prepared-spell entries”与 always-prepared feature spells 分开。
- 读者风险：有 Fiend 或其他授予 always-prepared 法术的角色会误以为这些法术必须占六个基础格，或把总可用法术数误报成恰好六个。
- 必要改法：
  - body.md:15 明写 “six base prepared-spell entries; feature-granted always-prepared spells are separate”。
  - body.md:101/129 将 “six spaces / exactly six prepared names” 改成 “six base prepared entries”，并要求把 always-prepared 法术另列。
  - 图片已有 “BASE NAMES”，可保留；附近正文必须提供同样的明确解释。

### RV-2：Counterspell 的两类槽位没有分开，且“失败仍耗槽”过于泛称

- 位置：body.md:44、body.md:114-116；尤其 body.md:116。
- 原句：“A failed save makes the spell fail...” / “If the first spell fails its saving-throw or targeting conditions, the slot is still gone. Counterspell still needs a visible caster within 60 feet using the named components.”
- 证据：research/rules/facts.md:201-205 的 2024 Counterspell 事实明确：被反制的施法者作 Constitution save；失败时其法术失败；如果该法术使用了法术位，被反制的那个槽不消耗。原句的 “the slot is still gone” 没有说明是 Warlock 施放 Counterspell 自己的槽，也没有给出被反制者槽位不消耗的例外。
- 读者风险：读者可能把“法术失败后仍耗槽”误套到被反制者，或把 “targeting conditions” 当作一个未说明的泛化耗槽规则；这直接影响两槽计划。
- 必要改法：
  - body.md:44 将 “A failed save makes the spell fail” 改成 “A failed Constitution save makes the countered spell fail”。
  - 删除或收窄 body.md:116 的泛称；只保留“your Counterspell slot is spent when you cast it”这一主体明确的陈述。
  - 如保留该例外，补一句：“Under the 2024 text, the creature whose spell is countered does not expend that spell slot if it used one.” 不要把两个施法者的槽写成同一个 “the slot”。
  - “or targeting conditions” 没有在本批规则证据中得到独立支持，不能继续作为泛化规则。

### ReaderValue 已核对的通过部分

- body.md:33 明确 Eldritch Blast 是 1-action cantrip；因此没有把“不耗槽”写成“不占动作”。
- body.md:43-49 标明 Misty Step 的 Bonus Action、Counterspell 的 Reaction、Dispel Magic/Hypnotic Pattern/Fly/Invisibility 的关键动作/专注/范围条件。
- body.md:77-83 说明只能维持一个 active concentration；图 concentration-choice 的单 active lane 与四个候选卡一致。
- body.md:87-91 正确区分 2024 “每个 turn 只能消耗一个 spell slot”与笼统“每 turn 只能一个 spell”，并核算 Bonus Action、Action、Reaction；body.md:89 也没有误写成整 round 禁止 Counterspell。
- body.md:97-116 提供了六名法术、两个 level-3 slot job、专注选择和实际场景分支；body.md:51 的 collapsed shaft、body.md:67 的 two-creature infiltration 是可操作示例，不是实战测试。
- 三张图中的数字、法术名、动作/专注关系和图注均能在正文相邻段落找到，未发现图文互相矛盾。

## 3. Repetition — FAIL

### REP-1：同一“不是 universal best/ranking”边界重复过多

以下四处连续承担同一件事：告诉读者这不是排名/最佳六，而不是推进选择动作。

- body.md:1：“not a universal ranking of the ‘best’ spells”
- body.md:39：“The following table is a decision aid, not a tier list.”
- body.md:51：“These are table-facing choices, not universal rankings.”
- body.md:97：“Use this as a conditional example, not as a universal best six.”

必要改法：

- 保留开头 body.md:1 的一次范围定位。
- body.md:39 保留“Each row includes a condition that can make the choice wrong for the session”，删除 “not a tier list”。
- 删除 body.md:51 末尾的 “not universal rankings” 句；前面的条件例子已经完成判断。
- body.md:97 改成直接动作，例如 “Fill the worksheet only after naming the missing job.”，不要再次解释不是 best six。
- upcast-tradeoffs.svg:97-101 的 “NOT A DAMAGE RANKING” 是图内对“属性变化而非伤害”这一独立读图提示，可保留；它不应再在正文重复同一句。

### 非失败的必要重复

- spell-choice 图和 body.md:1、15-25 都复述六项/两槽，但图提供空间关系，正文提供规则条件；这是本任务要求的图文互补，不按同一作用删除。
- concentration-choice 图与 body.md:77-83 都显示一项 active concentration，但图用单线结构说明关系，正文补充受伤/失能/死亡条件；属于必要视觉强化。
- pre-session readback（body.md:124-139）是逐项 pass/revise 检查，不是把前文改写成总结，保留。

## 4. 媒体状态（独立于三门）

- 当前三张英文 WebP/SVG 均为规则流程/比较图，不是人物图或游戏角色图。
- 现图在当前正文中的教学关系成立：spell-choice 对应预算分离；upcast-tradeoffs 对应五行属性变化；concentration-choice 对应单一 active concentration。三张图的实际 WebP 已通过高分辨率视觉检查，文字可读，未见裁切或明显溢出。
- 最新调度要求使用人物图/游戏角色图；因此媒体状态为 media-change-pending / UNVERIFIED，不把现有规则图报告为满足该新要求。
- 该待办不由本 D Worker 处理；新增或替换人物图后，应由负责媒体的角色补充来源、alt/caption 与事实核对，D 对受影响的英文图文关系重新检查并绑定新媒体 SHA。

## 5. 未执行的其他门

- Length/2000 机械计数：本任务不以计数代替质量，未作为本报告三门结论。
- SEOTruth、八层 E 鉴文、标题、页面装配、浏览器页面验收、部署：不属于本 D 角色，均未宣称通过。
- 本次未启动 ego-browser；检查对象是本地英文稿件/媒体，规则事实使用已交接的英文官方来源证据，不作网站在线状态结论。

## 6. 交接与下一步

1. C 修订 RT-1/RT-2、RV-1/RV-2，并压缩 REP-1；不要让 D/E 直接改正文。
2. 媒体角色按最新人物图要求另行处理；不要把 media-change-pending 当作当前 D 通过。
3. C 生成新 body 版本后，D 对新 body 和新媒体 SHA 全量重跑 ResearchTrace、ReaderValue、Repetition。
4. 只有 D、E 对同一最终 hash 都通过，才能交 F；本版明确不可流入 F。


## 7. 验证回执补录（2026-09-26T14:20:45+08:00）

本节是证据补录，不是新一轮内容审核；三门结论仍为 0 PASS / 3 FAIL。正文仍严格绑定旧 SHA 6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a；本次没有把新 hash 当作旧版，也没有读取或修改作者文件。

### 实际核查命令与退出码

1. 时间标记
   命令：date -Iseconds
   退出码：0
   主要输出：2026-09-26T14:20:45+08:00

2. 读稿与英文媒体 SHA-256
   命令：sha256sum editorial/dnd-warlock-spells/drafts/en/body.md editorial/dnd-warlock-spells/media/en/concentration-choice.svg editorial/dnd-warlock-spells/media/en/concentration-choice.webp editorial/dnd-warlock-spells/media/en/spell-choice.svg editorial/dnd-warlock-spells/media/en/spell-choice.webp editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.svg editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.webp
   退出码：0
   主要输出：
   - 6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a  editorial/dnd-warlock-spells/drafts/en/body.md
   - f249fd3531b52c038a15531f3088c1f9c93f65edfedbac04949abea01322c077  editorial/dnd-warlock-spells/media/en/concentration-choice.svg
   - 4e3c27ffcf1148d6e45f732d3dca8fd5bbf389885206bd2037aed5cb8b9f2b26  editorial/dnd-warlock-spells/media/en/concentration-choice.webp
   - 9e20ae6a74fca03558ff3c23d8b5ff3baab34be19250dcb2b86f0700886743ab  editorial/dnd-warlock-spells/media/en/spell-choice.svg
   - 2345958984441f751dff3191a5dc9df88ffabb106e81d52b1e95291bbff82704  editorial/dnd-warlock-spells/media/en/spell-choice.webp
   - a77918258f6d8be37eed6bb2a94d4b4aa4f53c884a99f0c6d3af8d17e1ebf32c  editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.svg
   - 03032baeb883425db71c69b8bd1ade139050d972a4016423c040ae7542c2d22f  editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.webp

3. 报告副本字节一致性
   命令：cmp -s editorial/dnd-warlock-spells/reviews/d-en.md editorial/dnd-warlock-spells/reviews/d-en-v1.md; cmp_exit_code=$?; printf 'cmp_exit_code=%s\n' "$cmp_exit_code"; exit "$cmp_exit_code"
   退出码：0
   主要输出：cmp_exit_code=0

4. 报告空白检查
   命令：awk 'BEGIN {bad=0} /[[:blank:]]+$/ {print FILENAME ":" NR ": trailing blank"; bad=1} END {if (bad==0) print "PASS: no trailing blank characters in both reports"; exit bad}' editorial/dnd-warlock-spells/reviews/d-en.md editorial/dnd-warlock-spells/reviews/d-en-v1.md
   退出码：0
   主要输出：PASS: no trailing blank characters

5. 真实图片视查
   工具：functions.exec 中的 tools.view_image，detail=high；逐一读取：
   - editorial/dnd-warlock-spells/media/en/spell-choice.webp
   - editorial/dnd-warlock-spells/media/en/upcast-tradeoffs.webp
   - editorial/dnd-warlock-spells/media/en/concentration-choice.webp
   工具结果：三次均返回 detail=high 和 image_url_returned=true；该工具无 shell 退出码，不能伪造为 exit 0。实际视觉结果：三张图文字均可读，未见裁切、文字溢出或明显布局破损；图内预算、升环属性和单一专注关系与正文及图注一致。它们仍是规则流程/比较图，不是人物图/游戏角色图，因此新人物图要求继续保持 media-change-pending / UNVERIFIED。

6. Orca 生命周期检查
   命令：orca orchestration check --terminal term_9cad03a1-47fb-4b73-9c2d-cbf0722042e5 --json
   退出码：0
   主要输出：ok=true；runId=run_39994fa3f53e；dispatchId=ctx_ab8dafadf8b9；messages=[]。

以上命令仅补录证据，不改变 ResearchTrace、ReaderValue、Repetition 的任何 FAIL 判定。


### C 并发改稿边界（不改变本报告绑定）

- 在补录后的只读探针时间 2026-09-26T14:25:00+08:00，命令 sha256sum editorial/dnd-warlock-spells/drafts/en/body.md 退出码为 0，主要输出为 4ef4970c20501d6d3631d19cd3901be93eb5b38b077e143b0c187afd8c4ee4cd  editorial/dnd-warlock-spells/drafts/en/body.md。
- 这只是 C 正在产生的新版本的观察，不是本 D 报告的输入版本；本报告仍严格绑定旧 SHA 6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a，未将 4ef4970c... 当作旧版，也未读取或修改正文。
- 命令 git status --short --untracked-files=all | rg 'editorial/dnd-warlock-spells/drafts/en/body\.md|editorial/dnd-warlock-spells/reviews/d-en(-v1)?\.md$' 退出码为 0；主要输出为 ?? editorial/dnd-warlock-spells/drafts/en/body.md、?? editorial/dnd-warlock-spells/reviews/d-en-v1.md、?? editorial/dnd-warlock-spells/reviews/d-en.md。该只读状态不据此推断 C 新稿内容或审核结果。
