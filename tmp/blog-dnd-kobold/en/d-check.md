# D-EN 写后检查 — `dnd kobold` EN

Role: D-EN（写后检查，非 C，非 E）。Date: 2026-09-16。  
检查门：ResearchTrace / ReaderValue / Repetition（`02-内容生产与质量门.md` 第五节前三门）。  
未改正文。未改 `src/` / `public/`。未 commit。本文件不是 E 的八层鉴文，也不签发 E 通过。

## 版本

- 文件：`tmp/blog-dnd-kobold/en/draft-body.html`
- SHA-256：`ba6b38b60ea9682dd49cf0ca288074aeb065bb4b3dd6c8ab5de63086295884c2`
- 简述：C 首次英文候选 HTML 片段（无 Title/H1、无封面图；图位为 `${DND_KOBOLD_*_IMAGE_PATH}` 装配槽）。336 行，44638 字节。图核对照 `tmp/blog-dnd-kobold/en/figures/` 的 FIG-01/02/03 与 caption。

## 1. ResearchTrace — FAIL

**结论：FAIL。** 无 SERP 排名、无 `tmp/` 路径、无助手自我介绍。合法引用、CC-BY、Fan Content、以及“这是示例不是 session log / 不是截图”的方法说明予以保留。失败点是给作者的范围指令，以及来源清单里的“未打开 / 未使用”检索残留。

### 通过（保留，不误杀）

| 位置 | 原句（摘） | 为何保留 |
|---|---|---|
| 开头第 2 段 | `This is unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy.` | 合法声明 |
| 开头第 3 段 | `The SRD 5.1 Kobold (CC-BY) and the SRD 5.2.1 Kobold Warrior (CC-BY) are the open check pages used here.` | 读者需要的出处与核对方法，不是检索日志 |
| FIG-01 caption | `This is a lock diagram, not a D&D Beyond screenshot.` | 图注方法说明；与实图页脚一致 |
| FIG-02 caption | `This is a range diagram, not a session log and not a VTT screenshot.` | 同上；FIG-02 为可数格子图 |
| Pack Tactics 各例 | `Example, dark corridor pack, not a session log.` | 标明设计例子 ≠ 实测日志（第四节要求） |
| Sources 条目体例 `ddb-kobold-2014` 等 | 站点已发布文（beholder/kenku）同用稳定 id + Supports | 公开引用来源标签，不是内部路径 |

`${EN_DND_RACES_PATH}` 等是装配槽，不按内部研究路径判失败。

### 失败命中

**命中 1 — 给作者的成文指令**  
位置：开头第 3 段（Fan Content 段之后，need-to-know 表之前）  
原句：`Paraphrase the lines that change identity or the fight. Do not paste a full stat block as the article, and do not average the two years into a generic kobold.`  
为何失败：`as the article` 是写作者约束（不要把 SRD 整块贴进博文）。读者动作是锁书、抄手卡。后文 Copy one column 已有 `Do not paste the full attack formulas from either PDF as a handout`，那句才是读者向。

**命中 2 — 给作者的范围指令**  
位置：H2 `What a 5e kobold is on the table` 第 2 段  
原句：`Do not invent a 2024 Monster Manual ecology paragraph, winged-clan names, or a dragon-god origin and call that the SRD Warrior.`  
为何失败：这是提纲给 C 的禁写（不要发明 urd/Tiamat 生态当 SRD）。读者不是在写 SRD 条目。合法方法说明止于“这句 flavor 不在 SRD 5.1、不要当 CC-BY”。有翼/生态已有 mix-ups 子弹。

**命中 3 — 给作者的出版范围**  
位置：H2 `A playable kobold is a different book` 第 4 段  
原句：`The official MotM article … is the check page for names, not a license to dump trait text.`  
同段：`Size, speed, darkvision, and height are not reprinted here.`  
为何失败：`dump trait text` / `not reprinted here` 是作者在交代本文没转载什么。读者需要的是：用该文核对特质名称，体型等行去抄自己那本印刷页。

**命中 4 — 作者未点击 / 未导入（过程残留）**  
位置：H2 `Crop a token that still reads as a small reptile` → H3 `Failure branches — recrop` 列表后一段  
原句：`There are no button coordinates to follow, and there is no claim that a specific PNG was imported into a named campaign world.`  
为何失败：提纲原文“No live editor click-through this pass: no button coordinates, no we imported this PNG…”灌进正文。前句“不要把生成裁切图当编辑器截图”可留（图注已写）；坐标与“未导入战役”是作者过程。

**命中 5 — 检索日志：作者未打开**  
位置：H2 `Sources`，`ddb-volo-errata` 条  
原句：`Full race page not opened.`  
为何失败：读者来源清单出现“本篇未打开某页”。这是研究过程，不是该 errata 页实际支持的结论。

**命中 6 — 检索日志：作者未使用**  
位置：H2 `Sources`，`ddb-species-search-kobold` 条  
原句：`Trait pages not used.`  
为何失败：同上。该条已说明 listing 里有 MotM + Volo Legacy、没有 2024 PHB 物种卡；“trait pages not used”是研究取舍，不是读者出处。

## 2. ReaderValue — PASS

**结论：PASS。** 主意图仍是锁 2014 Kobold vs 2024 Kobold Warrior，没有被 tokenmaker.one 改写成做 Token 教程。读者能完成任务卡动作。三张正文图帮助理解，且未冒充截图。

### 对照依据

- 用户原词：`dnd kobold tokenmaker.one`。任务卡主词 `dnd kobold`；域名为品牌查询，不得并入主意图。
- SERP（A-EN，2026-09-16，`hl=en&gl=us&pws=0`）：头词 organic #1/#4 是 2014 怪物页；related 有 `Dnd kobold 2024`；2024 Warrior 不在该 top five。品牌查询首页/博客索引有 tokenmaker.one，没有狗头人规则文。PAA 含 playable / good or evil / how they work — 任务卡把 playable 收成栅栏，不收成主文。
- 任务卡 ReaderTask：写出源行；Humanoid+LE vs Dragon+Neutral 不混；解释 CR 1/8 为何疼（Pack Tactics + 数量 + 日光）；playable 是 Volo/MotM，不是 2024 PHB 十核心，也不是本怪物块。

### 为何通过（命中原句）

| 位置 | 原句 | 作用 |
|---|---|---|
| 开头第 1 段 | `Tonight it is either the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Same challenge rating 1/8 does not make those one creature. Write the source line, then copy that page only.` | 前三句给出锁年、不平均、下一步 |
| H2 `Lock 2014 Kobold or 2024 Kobold Warrior` | 源行示例 + 对照表 + FIG-01 | 主决定 |
| H2 `Pack Tactics is why a CR 1/8 pack still hurts` | 走廊包 / 日照路 / 单独一只 标示例；FIG-02 可数 5-ft 格 | 子问题 3 |
| H2 `A playable kobold is a different book` | `That permission is not this monster entry.` | 栅栏，不是种族攻略 |
| H2 `Session check` | 7 条可写清单 | 完成标志 |

产品首次出现在锁年、Pack Tactics、可玩栅栏之后的可选 H2 `Crop a token…`。删掉 Token Maker 句仍能锁年。符合任务卡“锁书之后的可选 PNG 裁切 / 无 kobold 模板”。不是 Candidate 5 主导，也不是 class 优化。

### 图核（服务主意图，未冒充截图）

| 图 | 实图 | caption / alt | 判定 |
|---|---|---|---|
| FIG-01 `fig-01-lock-2014-2024.png` | 左 2014 Kobold Small Humanoid Lawful Evil AC 12 HP 5；右 2024 Kobold Warrior Small Dragon Neutral AC 14 HP 7；中栏 Lock one year；页脚 Diagram, not a D&D Beyond screenshot | 与 caption 一致 | 锁年示意图，非 DDB 截图 |
| FIG-02 `fig-02-pack-tactics-grid.png`（SVG 同源） | 左 K1–Fighter–K2，ally within 5 ft → Pack Tactics；右邻格孤只，lone kobold → no Pack Tactics；1 square = 5 ft | 与 caption 一致；右栏“相邻但无盟友”比 alt 更精确，但不与 caption 冲突 | 可数规则图，非 VTT 截图、非战斗插画 |
| FIG-03 `fig-03-snout-crop.png` | 圈内吻部/角冠；X candle miner；X dragonborn；页脚 Crop diagram, not a Token Maker screenshot | 与 caption 一致 | 裁切示意图，无编辑器 UI |

封面 `cover-kobold.png` 未插入正文。正确。

本门无“必须改”项。产品段偏说明书、可玩 H2 偏长，见下方可选口气。

## 3. Repetition — FAIL

**结论：FAIL。** 提纲允许的双结构（开头速查表 ≠ 锁年表；mix-ups = 错混清单；session check = 开场清单；FAQ = 一两句 PAA）不判失败。失败的是两处正文段落承担同一讲解职责。

**命中 1 — Small/Tiny 占用课讲了两遍**  
保留：H3 `Small still takes one square`（SRD 尺寸表 + 走廊占格 + 再数 5 英尺）。  
重复：H2 `What a 5e kobold is on the table` 第 5 段  
原句：`Do not read it as Tiny. Tiny is the size that can put four creatures in one 5-foot square. Both the 2014 Kobold and the 2024 Kobold Warrior are Small. Small and Medium each control one square. A corridor that holds two Medium guards holds two Small kobolds the same way…`  
H3 同职原句：`Tiny is the size that can put four creatures in one square. Neither the 2014 Kobold nor the 2024 Kobold Warrior is Tiny. … A 10-foot corridor still holds two Small kobolds abreast the way it holds two Medium creatures.`  
身份节职责是“不是 Tiny familiar”。占用课只留 H3。FAQ 分享格子已是一两句，可留。

**命中 2 — 2014 陷阱 flavor + “不是 2024 生态”讲了两遍**  
保留：身份 H2 第 2 段（Basic Rules 有这句、不在 SRD、当画面用）。  
重复：H3 `Advantage from an ally within 5 feet` 末段  
原句：`The 2014 Basic Rules flavor says these dungeon dwellers lean on trap-making cleverness because the body is weak. That is a one-line picture, not a trap workshop and not a 2024 Monster Manual unique ecology.`  
Pack Tactics 只保留“陷阱是额外压力、不能代替 5 英尺盟友判定”一句。

**命中 3 — 锁年数字：H3 散文与对照表同一抄写职责**  
保留：H3 `Copy one column` 对照表（Name/Type/Alignment/AC/HP/Sunlight/Weapons/Pack Tactics/Frightened）。  
重复：H3 `2014 — Small Humanoid, Lawful Evil` 第 2 段  
原句：`Copy these identity lines from that 2014 page: Small Humanoid (kobold), Lawful Evil, Armor Class 12, hit points 5 (2d6−2), speed 30 feet, Darkvision 60 feet, passive Perception 8, Common and Draconic, challenge 1/8 (25 XP). … Sunlight Sensitivity on the 2014 block is narrower than 2024: while in sunlight, the kobold has disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight.`  
同职：H3 `2024 — Small Dragon, Neutral, renamed Warrior` 第 2 段逐条再念一遍 2024 同行。  
2014/2024 H3 应留来源页、Warrior 改名、Initiative +2 (12)、不要把另一列搬过来。逐格数字只在表里抄。共用速度/黑暗视觉/六维已在锁年 H2 导言。

**命中 4 — 两版日光句子讲了两遍，然后才给例子**  
保留：对照表 Sunlight 行 + H3 `Sunlight is not the same sentence in both books` 的日照路例子。  
重复：该 H3 第 1 段  
原句：`The 2014 Kobold has disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight while in sunlight. The 2024 Kobold Warrior has disadvantage on ability checks and attack rolls while in sunlight.`  
这两句已在 2014 H3 第 2 段、2024 H3 第 3 段和表里。日光 H3 从例子起笔。

**命中 5 — 圈内要留吻部：Crop 导言与 H3 同一课**  
保留其一：H3 `What must stay in the circle`，或 Crop 第 2 段，不要两段。  
Crop 第 2 段原句：`Keep the snout inside the ring. Keep a horn-frill, crest, or scaly head. Keep enough shoulder that the stance is a person, not a Tiny familiar and not a wildlife token.`  
H3 原句：`Keep the snout as a primary shape, not a pixel in the corner. Keep one readable eye. Keep the horn-frill or crest if the portrait has one. Keep enough of the shoulders or collar that the body is a Small person standing in one square. Drop a candle-on-the-head miner silhouette. Drop huge dragonborn horns plus breath effects as the only read.`  
Failure branches 是“若 X 则重裁”，职责不同，可留。

**命中 6 — VTT 像素 ≠ 规则：占用节与裁切节同一软件课**  
保留：Crop 里若需要，Foundry 512 建议 / Roll20 70 px 是软件不是 D&D 导出法（提纲把 512/70 放在 crop）。  
重复：H3 `Small still takes one square` 第 3 段  
原句：`Foundry’s token Dimensions field is the occupancy; Scale only resizes art. The dnd5e system’s Small dynamicTokenScale of 0.8 shrinks the artwork, not the square. Roll20’s help text says a token dropped on a grid is fitted to one unit; one unit is 70 pixels on that software, which is not a D&D export law.`  
同职：H3 `What must stay in the circle` 第 2 段 `Foundry’s dynamic token-ring documentation suggests a 512-pixel subject for a single square. … Roll20’s 70 pixels per unit is also software…`  
提纲：占用节 Foundry/Roll20 **最多一句**。占用只留 Dimensions≠Scale / 缩小图 ≠ Tiny；70 px 与 512 不要两处各讲一遍。

**命中 7 — 错误 Pack Tactics 变体：例子节与 mix-ups 同一清单**  
保留：H2 `Mix-ups that break the identification` 中 Draconic Cry 与 once-per-rest / 10-foot 两条。  
重复：H3 `Advantage from an ally within 5 feet` 第 1 段  
原句：`Do not turn the trait into a once-per-rest burst. Do not turn it into a 10-foot aura. Do not replace it with the MotM player trait Draconic Cry while you are running a monster card.`  
该 H3 只数格子（从目标起算、10 英尺不够、incapacitated 不算）。变体禁令只留 mix-ups。

不判失败（职责不同）：开头 need-to-know 表（定向）vs 锁年表（抄一列）；mix-ups（错混+修）；session check（开场可写）；FAQ 四条均为一两句、无新主张。

## 必须改的问题清单（给 C）

1. **原句：** `Do not paste a full stat block as the article`  
   **位置：** 开头第 3 段  
   **要求：** 改成对手卡/tracker 的读者动作，或删 `as the article`（Copy one column 已有 handout 句）。不要对读者下写作禁令。

2. **原句：** `Do not invent a 2024 Monster Manual ecology paragraph, winged-clan names, or a dragon-god origin and call that the SRD Warrior.`  
   **位置：** H2 `What a 5e kobold is on the table` 第 2 段  
   **要求：** 删作者范围指令。最多保留：SRD Warrior 没有这段生态。有翼/专名已在 mix-ups。

3. **原句：** `…not a license to dump trait text.` 以及 `Size, speed, darkvision, and height are not reprinted here.`  
   **位置：** H2 `A playable kobold is a different book` 第 4 段  
   **要求：** 改成读者动作：用该文核对名称，体型等行抄印刷的 Volo/MotM 页。不要写“本文未转载/未获准倾倒”。

4. **原句：** `There are no button coordinates to follow, and there is no claim that a specific PNG was imported into a named campaign world.`  
   **位置：** H2 Crop → Failure branches 列表后  
   **要求：** 删除。图注已说明是 crop diagram 不是截图。

5. **原句：** `Full race page not opened.`  
   **位置：** Sources `ddb-volo-errata`  
   **要求：** 删除检索日志。该条只保留 errata 实际支持的内容（+2 Dex；Alignment 特质移除）。

6. **原句：** `Trait pages not used.`  
   **位置：** Sources `ddb-species-search-kobold`  
   **要求：** 删除。保留 listing 可见 MotM + Volo Legacy、该列表无 2024 PHB 物种卡。

7. **原句：** `Do not read it as Tiny. Tiny is the size that can put four creatures in one 5-foot square… A corridor that holds two Medium guards holds two Small kobolds the same way…`  
   **位置：** H2 `What a 5e kobold is on the table` 第 5 段  
   **要求：** 身份节只留一句对比（不是 Tiny familiar / 不是四只一格）。完整占用课只留 H3 `Small still takes one square`。

8. **原句：** `The 2014 Basic Rules flavor says these dungeon dwellers lean on trap-making cleverness because the body is weak. That is a one-line picture, not a trap workshop and not a 2024 Monster Manual unique ecology.`  
   **位置：** H3 `Advantage from an ally within 5 feet` 末段  
   **要求：** 删对身份节 flavor 的复述。Pack Tactics 只留一句：陷阱不能代替 5 英尺盟友判定。

9. **原句：** `Copy these identity lines from that 2014 page: Small Humanoid (kobold), Lawful Evil, Armor Class 12…`（2024 H3 第 2 段同行复述）  
   **位置：** H3 2014 第 2 段；H3 2024 第 2 段  
   **要求：** 不要在散文里再念对照表。H3 留来源页、改名、Initiative、不要混列。数字只在 `Copy one column` 表。

10. **原句：** `The 2014 Kobold has disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight while in sunlight. The 2024 Kobold Warrior has disadvantage on ability checks and attack rolls while in sunlight.`  
    **位置：** H3 `Sunlight is not the same sentence in both books` 第 1 段  
    **要求：** 删开篇复述。从 2014/2024 日照路例子起笔。句子以表和锁年 H3 为准。

11. **原句：** `Keep the snout inside the ring. Keep a horn-frill, crest, or scaly head. Keep enough shoulder…`  
    **位置：** H2 Crop 第 2 段（与 H3 `What must stay in the circle` 同职）  
    **要求：** 圈内识别只留一处。建议留 H3，导言只写“锁年之后标记仍须读成 Small 爬行类人，圈不能当第二份属性”。

12. **原句：** `…one unit is 70 pixels on that software…`（占用 H3）与 `Roll20’s 70 pixels per unit is also software…`（Crop H3）  
    **位置：** H3 `Small still takes one square` 第 3 段；H3 `What must stay in the circle` 第 2 段  
    **要求：** 占用节最多一句：Foundry Dimensions 是占格，Scale/`dynamicTokenScale` 只缩图，不是 Tiny。512 与 70 px 只留 crop 一处。

13. **原句：** `Do not turn the trait into a once-per-rest burst. Do not turn it into a 10-foot aura. Do not replace it with the MotM player trait Draconic Cry while you are running a monster card.`  
    **位置：** H3 `Advantage from an ally within 5 feet` 第 1 段  
    **要求：** 删。变体禁令只留 mix-ups 对应子弹。本段只数 5 英尺几何。

事实补查：不退 A。布局：不退 B（H2 职责仍对；是 C 把同一课写了两遍）。改完必须交 D 复验新 hash；旧稿通过记录不得沿用。E 尚未审本版。

## 可选口气问题（仍由 C 改，不单独构成门失败）

- `not a session log` 在四个例子标题各出现一次。留一处即可，其余用 `Example:`。
- 身份 H2 末段 `Weak alone still matters when you set the scene…` 只是把下一节 Pack Tactics 再说一遍，可删。
- Crop 产品段罗列全部 mask 名、Add Text / New Text、四档像素。任务卡允许这些工具事实；若保留，压成读者裁吻部时真正用到的输入/输出，避免像编辑器规格表。
- 可玩 H2 五段对“栅栏”偏密（errata + Legacy 页 + species search）。不要扩成种族攻略；可把 +2 Dex / Alignment 移除留给 FAQ 那一条。
- FIG-01 实图有 AC/HP 标签，draft alt 未写；可补进 alt，不改正文主张。
- FIG-02 右栏实际课是“邻格但没有盟友 → 无 Pack Tactics”；alt 可写明，避免读成“孤只离得很远”。

## 总评

**FAIL。** ResearchTrace FAIL，ReaderValue PASS，Repetition FAIL。三门未全部通过。

必须改：**13** 条。不签发 E 鉴文通过。
