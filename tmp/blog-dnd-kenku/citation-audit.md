# Citation re-audit — dnd kenku

- 角色：原独立引用审计员。未改正文。
- 审计日：2026-09-12（相对旧 ISSUES 的复审）
- 新哈希（SHA-256，已复算，与任务给定值一致）
  - `en-body.md` = `8b80188c2d964b6f35de9cd54b9fc3d5bc1400f842afafd3a44c738914a9e01b`
  - `zh-body.md` = `46ed76373a95c9d5e8f802addd27916ab5c71fc4dce18dde4bf1b0f45d69e1d2`
- 对照：`en-revision-log.md`、`zh-revision-log.md`、旧 FAIL 编号 EN-F1–F9 / ZH-F1–F4
- 规则：来源不支持该措辞即仍开；转写须标明非官方且不把 DDB 索引当全文。wikidot 现已写入英文 Sources，并标 Not official。

## 结论：CLEAN

先前 13 条 FAIL 均为 **FIXED**。未发现须删改的新硬伤。

---

## 旧 FAIL 结算

| ID | 旧问题 | 状态 | 现稿依据 |
|---|---|---|---|
| EN-F1 | MotM「speak/read/write Common + 1」写成已核验玩家规则，索引无该句 | **FIXED** | 开篇、对照表、Lock B、语言节、FAQ 均挂 unofficial [Kenku lineage](https://dnd5e.wikidot.com/lineage:kenku)，并写 confirm on printed MotM。Sources 写明索引 **不** 印 Languages。wikidot MotM Languages 句与正文转写一致。 |
| EN-F2 | Volo 玩家语言条当索引/勘误原文；与 2014 怪物句混 | **FIXED** | Lock A：索引只列 +2 Dex/+1 Wis 与三特性名，无 size/speed/Languages。语言句只作 wikidot 转写 + 对印刷 Volo（勘误仅作 p.111 定位）。2014 怪物「speaks only through Mimicry」仍绑 AideDD 怪物页。 |
| EN-F3 | 玩家两套 Mimicry 公式当桌上官方数字 | **FIXED** | 对照表/FAQ/拟声节：索引只有特性名；对抗检定与 `8 + PB + Cha` 标 unofficial transcription，confirm on print。怪物 DC 14 仍绑 Roll20/AideDD。 |
| EN-F4 | EGtW 转载 Volo（含失语）当已核验锁 | **FIXED** | 开篇与 source line 已删转载句。Wildemount 只写「桌上若用该页，对印刷书；本页只锁索引两条」，不当第三条已核验锁。 |
| EN-F5 | 5 feet / 90–120 pounds 安到 public index | **FIXED** | 该句已删。体型/速度改挂 wikidot + confirm on print。索引风味改用 robbed of their wings / Shadowfell，与 DDB 卡片一致。 |
| EN-F6 | MotM 第一章 ASI、Humanoid、Medium or Small、Recall 次数当可抄 | **FIXED** | 已无 “chapter 1”。Lock B 与对照表：索引只列三特性名；其余标 unofficial lineage transcription + 印刷 MotM。DDB MotM 专页仍跳转商城，正文保留 “not a free page”。 |
| EN-F7 | Training 四技能与 Forgery 效果写成索引已给出 | **FIXED** | 「index confirms the name」只用于名称。四技能名单与效果句标 unofficial transcription；示例加 if printed page matches。 |
| EN-F8 | “third-party… unused wings” 无来源 | **FIXED** | 该句已删。失败分支不再写 unused-wings drawing。无翼仍绑 Volo 索引 “robbed of their wings”。 |
| EN-F9 | 学法术以求飞行，英文允许源无此句 | **FIXED** | 该句已删。保留「规则没有禁止施法」与 2024 Verbal 组件（DDB Spells）。 |
| ZH-F1 | 「官方这篇侧栏」未读 PHB/DDB 侧栏原文 | **FIXED** | 已删「官方这篇侧栏」。改为链 [DDB 1787](https://www.dndbeyond.com/posts/1787-how-to-create-a-character-using-the-2024-players)（只处理旧 ASI）+ RPGBOT 同样只处理加值。对照表改为「失语仍跟锁的那本书走」。 |
| ZH-F2 | 2024 怪物 60 尺黑暗视觉等，中文允许源无 MM 页 | **FIXED** | 数字绑 [Roll20 2024 Kenku](https://roll20.net/compendium/dnd5e/Monsters:Kenku?expansion=34653)，并写明是怪物页不是玩家种族。该页有 Darkvision 60 ft.、诅咒只能模仿发声、Languages Common / Primordial (Auran)、Medium Monstrosity。Sources 已列。 |
| ZH-F3 | 「鸦人首先指向魔兽德拉诺鸟人」（百度 unverifiedAccess） | **FIXED** | 德拉诺句已删。表内只留「不要用鸦人当 Kenku 主词」。 |
| ZH-F4 | 开拓者长鼻、羽扇、部分传承能飞（页未打开） | **FIXED** | 形态细节已从对照表、段、alt、Token 句删除。只留「开拓者条目也叫天狗，对应 Tengu，不是 DND Kenku」，与条目标题「天狗族裔」及 JSON 标注一致。 |

无 **STILL OPEN**。无 **NEW ISSUE**。

---

## 十项盯梢（复审）

| # | 主张 | 现稿 |
|---|---|---|
| 1 MotM 可说话 | EN 转写+对印刷；ZH 灰机无语言条 + wikidot 语言条 | 支持 |
| 2 Volo 只能 Mimicry | EN 转写+对印刷；ZH 灰机语言条原文 | 支持 |
| 3 Mimicry DC 两套 | 玩家公式：灰机/wikidot 转写+对印刷；怪物 DC 14：Roll20/AideDD | 支持 |
| 4 2024 PHB 无 Kenku | 十物种博文、Creating a Character、Character Origins、本站种族文 | 支持 |
| 5 2024 忽略旧 ASI | DDB 1787；ZH 已链该博文，不再冒充未打开的 PHB 侧栏 | 支持 |
| 6 PC 无黑暗视觉 / 2024 怪物有 | 索引/灰机未列 Darkvision；2024 怪物有，EN 原有、ZH 已补 Roll20 | 支持 |
| 7 Forgery vs Duplication 名称 | DDB 索引 + 灰机专名；效果不冒充索引全文 | 支持 |
| 8 灰机 MotM 无语言条 | 中文仍写缺页；raw 文止于拟声 | 支持 |
| 9 「天狗 Kenku」 | 灰机/weebly/dndlogs 标题并列 | 支持 |
| 10 Token Maker | 工具段未改；仍对照 tool-facts / 首页 / FAQ | 支持 |

---

## 非阻塞观察（不构成 FAIL）

- 英文图 alt 仍写 “Volo’s mute Kenku traits / MotM speaking Kenku traits”，未写 unofficial。可见图注已改为 “Left column is Volo’s.” 正文锁书段已把开口差异挂转写。不单列必须改。
- `en-public-references.json` 仍无 wikidot 条；英文正文 Sources 已列并标 Not official。以正文引用为准，不因此翻成 ISSUES。

本次未改正文。
