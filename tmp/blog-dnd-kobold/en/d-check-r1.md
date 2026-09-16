# D-EN 写后检查 r1 — `dnd kobold` EN

Role: D-EN（写后检查，非 C，非 E）。Date: 2026-09-16。  
对象：C 按 `d-check.md` 13 条改稿后的新正文。旧报告（hash `ba6b38b6…584c2`）不可沿用。  
未改正文。未改 `src/` / `public/`。未 commit。本文件不是 E 的八层鉴文，也不签发 E 通过。

## 版本

- 文件：`tmp/blog-dnd-kobold/en/draft-body.html`
- 声称 hash：`31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`
- 实测 SHA-256：`31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`
- 哈希：**对齐。**

## 上轮 13 条核对

| # | 原要求 | 本版 | 结果 |
|---|---|---|---|
| 1 | 删/改 `as the article` | 开头第 3 段改为 `Copy type, alignment, and the fight lines from that one page onto the tracker.` | 消失/已改写 |
| 2 | 删作者生态禁令 | 身份 H2 第 2 段改为 `The SRD 5.2.1 Kobold Warrior has no matching ecology paragraph.` | 已改写 |
| 3 | 删 dump trait / not reprinted here | 可玩 H2 第 4 段：`Use the official MotM article … to check trait names.` / `Copy size, speed, darkvision, and height from the printed Volo’s or MotM page you own.` | 已改写 |
| 4 | 删 button coordinates / 未导入战役 | Failure branches 后整段已删 | 消失 |
| 5 | Sources `Full race page not opened.` | `ddb-volo-errata` 只留 +2 Dex 与 Alignment 移除 | 消失 |
| 6 | Sources `Trait pages not used.` | `ddb-species-search-kobold` 只留 listing 可见内容 | 消失 |
| 7 | 身份节 Tiny 占用课缩成一句对比 | `Do not read it as a Tiny familiar you stack four to a cell. Both official monsters are Small, not Tiny.` | 已改写 |
| 8 | Pack Tactics 勿复述 trap flavor | `Traps sit next to that math, not instead of it. Do not skip the 5-foot ally check because a pit trap exists somewhere on the map.` | 已改写 |
| 9 | 2014/2024 H3 勿再念对照表 | 指向 Copy one column 表；留来源页、改名、Initiative、不要混列 | 已改写 |
| 10 | 日光 H3 删开篇复述 | 开篇 `Write the sunlight sentence from the same book… The examples below use one locked year each.` 随即进入日照路例子 | 已改写 |
| 11 | Crop 导言与 H3 圈内识别只留一处 | 导言只留锁年后标记须可读；圈内课在 H3 `What must stay in the circle` | 已改写 |
| 12 | 70 px / 512 不要占用节与 crop 各讲一遍 | 占用节只留 Dimensions≠Scale / 缩小图≠Tiny；512 与 70 px 只在 crop H3 | 已改写 |
| 13 | H3 Advantage 删 once-per-rest / 10-foot aura / Draconic Cry 清单 | 该段只数 5 英尺几何；变体禁令只在 mix-ups | 已改写 |

## 1. ResearchTrace — PASS

**结论：PASS。** 上轮 6 条作者指令/检索日志已不在正文。无 SERP、无 `tmp/`、无助手残留。合法引用与方法说明保留。

### 为何通过

| 位置 | 原句（摘） | 判定 |
|---|---|---|
| 开头第 2 段 | Fan Content Policy | 合法声明，保留 |
| 开头第 3 段 | `open check pages used here` + `onto the tracker` | 核对方法 + 读者动作，不是成文禁令 |
| FIG-01/02/03 caption | lock / range / crop diagram，不是截图 | 图注方法说明；实图页脚一致 |
| Pack Tactics 走廊例 | `Example, dark corridor pack, not a session log.` | 标明设计例子 ≠ 实测，保留 |
| 可玩 H2 第 4 段 | `to check trait names` / `Copy size… from the printed… page` | 读者动作 |
| Sources `ddb-volo-errata` | 无 `not opened` | 只报 errata 支持的结论 |
| Sources `ddb-species-search-kobold` | 无 `not used` | 只报 listing 可见内容 |

未误杀：mix-ups `Do not invent a 2014 winged block` / FAQ `Do not invent a PC type` 是读者不要造飞行块、不要从怪物 invent PC 类型，不是作者范围指令。`2014 official pages used here`（Frightened 条）是本篇引用范围，不是检索日志。

### 本门必须改

无。

## 2. ReaderValue — PASS

**结论：PASS。** 主意图仍是锁 2014 Kobold vs 2024 Kobold Warrior。用户原词 `dnd kobold tokenmaker.one` 未被改写成做 Token。读者能完成任务卡。图文帮助理解，未冒充截图。

### 对照

- 开头第 1 段仍是：`Tonight it is either the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Same challenge rating 1/8 does not make those one creature. Write the source line, then copy that page only.`
- SERP 头词仍是 2014 怪物页 + 2024 改写缺口；品牌域不是主任务。
- 锁年表 + FIG-01、Pack Tactics 格子例 + FIG-02、可玩栅栏、mix-ups、session check 7 条均在。
- 产品仍在锁年、Pack Tactics、可玩栅栏之后的可选 H2 Crop。删产品句仍能锁年。无 kobold 模板。FIG-03 仍是裁切示意图。

### 图核（对照 `figures/`）

| 图 | caption / 本版 alt | 判定 |
|---|---|---|
| FIG-01 | alt 现含 AC 12 / HP 5 与 AC 14 / HP 7；caption 仍声明非 DDB 截图 | 与实图标签一致 |
| FIG-02 | alt 写 neighboring cell with no ally | 与右栏“邻格无盟友”一致；可数格，非 VTT 截图 |
| FIG-03 | crop diagram，非 Token Maker 截图 | 与实图一致 |

封面未插入正文。

### 本门必须改

无。

## 3. Repetition — PASS

**结论：PASS。** 上轮 7 处同职重复已拆开。提纲允许的双结构不判失败。

| 职责 | 唯一承担处 | 他处为何不是同职 |
|---|---|---|
| Small=1 格占用课 | H3 `Small still takes one square` | 身份节只留 Tiny familiar 一句对比；FAQ 一两句 PAA |
| 2014 trap flavor | 身份 H2 第 2 段 | Pack Tactics 只留“陷阱不能代替 5 英尺判定” |
| 抄一列数字 | `Copy one column` 表 | 2014/2024 H3 指表、来源、Initiative、不要混 |
| 日光范围差怎么用 | 日照路两个例子 | 开篇不再复述两句全文；表仍是抄写参考 |
| 圈内须留吻部 | H3 `What must stay in the circle` | Crop 导言只说锁年后标记须可读 |
| 512 / 70 px 软件事实 | Crop H3 第 2 段 | 占用节无 70 px，只讲 Dimensions≠Scale |
| 错误 Pack Tactics 变体 | mix-ups once-per-rest / 10-foot / Draconic Cry | H3 Advantage 只数几何（10 英尺不够触发 ≠ 10-foot aura 禁令） |

不判失败：need-to-know 表（定向）vs 锁年表（抄一列）；mix-ups（错混+修）；session check（开场可写）；FAQ 四条仍是一两句、无新主张。日光例子中出现 2014/2024 句子是在应用表，不是开篇再讲一遍课。

### 本门必须改

无。

## 必须改的问题清单（给 C）

无。上轮 13 条已处理。本轮全量重查无新的必须改项。

## 可选口气问题（不构成门失败）

- FAQ `Are kobolds good or evil` 现夹带 `player Ability Score Increase to +2 Dexterity only`。阵营问答可只留 Alignment 移除；+2 Dex 更贴 `Can you play` 那条。
- 占用节 VTT 仍是三句同一意思（占格、Scale 缩图、不是 Tiny）。可压成一句。
- Sources `token-maker-editor` 的 `not a live walkthrough` 略像过程注。可改成该页支持的 UI 名称。

## 总评

**PASS。** ResearchTrace PASS，ReaderValue PASS，Repetition PASS。三门全部通过。

必须改：**0** 条。新问题：**0** 条。不签发 E 鉴文通过。E 须独立审核本 hash `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`。
