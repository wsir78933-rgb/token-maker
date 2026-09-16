# E-EN 题文复核 — `dnd kobold` EN

Role: E-EN（标题/SEOTruth，非 F）。Date: 2026-09-16。  
未改正文。未改 Title。未改 `src/` / `public/`。未 commit。F 不得自行宣布本题通过。

## 绑定

- 正文 hash（D/E 已过）：`31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`
- 本层重算 SHA-256：相同。
- 表面：`tmp/blog-dnd-kobold/en/locked-seo.md`
- 候选过程（对照，非页面）：`tmp/blog-dnd-kobold/en/title-candidates.md`
- 交接草稿：`tmp/blog-dnd-kobold/en/public-handoff.md`
- 用户终审：尚未进行。

## 选定表面（复核对象）

| 字段 | 值 |
|---|---|
| Title / H1 / seoTitle | Matching CR 1/8 Does Not Make One DnD Kobold |
| Description | Tonight's dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Copy that page only. |
| excerpt | A dnd kobold is the 2014 Kobold (Small Humanoid, Lawful Evil) or the 2024 Kobold Warrior (Small Dragon, Neutral). Same CR 1/8 does not make those one creature. |
| slug | `dnd-kobold` |
| OG（模板） | `{seoTitle} \| Token Maker`（后缀不进 seoTitle） |

本层实测长度：Title 44 字符；Description 142 字符。与 F 记录一致。

## 1. 承诺能否在正文找到

| 表面用词 | 正文支撑 | 判定 |
|---|---|---|
| Matching CR 1/8 | 开篇 `Same challenge rating 1/8`；锁年段 `Matching challenge rating 1/8 is the trap`；FIG-01 caption 同句；need-to-know「Why CR 1/8 hurts」 | 数字在正文 |
| Does Not Make One | 开篇 `Same challenge rating 1/8 does not make those one creature.` 锁年段 `Those shared lines do not make type Humanoid in 2014 and type Dragon in 2024 into one creature.` | 同一判断，标题压缩掉 those，不改承诺 |
| DnD Kobold / dnd kobold | 开篇 `<strong>dnd kobold</strong>`；FAQ H2 `FAQ about dnd kobold` | 主词在正文 |
| 2014 Kobold (Small Humanoid, Lawful Evil) | 开篇、need-to-know、H3 `2014 — Small Humanoid, Lawful Evil`、对照表 | 接住 |
| 2024 Kobold Warrior (Small Dragon, Neutral) | 开篇、need-to-know、H3 `2024 — Small Dragon, Neutral, renamed Warrior`、对照表 | 接住 |
| Copy that page only | 开篇 `Write the source line, then copy that page only.` | 方法在正文 |
| excerpt `Same CR 1/8 does not make those one creature` | 开篇原句（challenge rating 写出全称） | 同承诺 |

Title / H1 / seoTitle 同一句，无第二套“Lock 2014 or 2024”叠加承诺。Description 没有往标题里没有的第二个主任务（可玩 walkthrough、Pack Tactics 专文、裁 Token）。

handoff FAQ 四条与已锁正文 FAQ 同文，未在 SEO 阶段另写主张。本层不把正文可选口气项（MotM Alignment 合成句、FAQ +2 Dex 位置）升为题文失败。

## 2. 主词是否自然

Title 用 `DnD Kobold`（与近邻 `DnD Skills` / `DnD Beholder` 标题大小写一致）。Description 用 `dnd kobold`（与正文开篇加粗一致）。各出现一次，无同义堆砌（kobold 5e / playable kobold / kobold token 未塞进 Title）。

## 3. 缺依据最高级

无 best / fastest / #1 / 实测 / 保证 / 免费导出次数。CR 1/8 是统计块挑战等级，不是效果百分比。

## 4. 正文没有的产品或效果主张

Title、H1、seoTitle、Description、excerpt **均无** Token Maker、零配置导入、Kobold 模板、速度/质量承诺。OG 品牌后缀 `\| Token Maker` 是现有 `createBlogPostMetadata` 模板，未预写入 seoTitle。与正文“锁年后可选裁切、无专用模板”不冲突。

## 5. slug

`dnd-kobold` 对应头词 `dnd kobold`，建议路由 `/blog/dnd-kobold`。本层检索 `src/lib/blog/registry.ts`：**无** `dnd-kobold`。站点盘点同结论。合理。

## 6. 最近 3 篇去套路

来源：`tmp/blog-dnd-kobold/shared/site-inventory.md`（registry `updatedAt` 降序）。最近 3 篇标题**已取得**，未捏造。

| # | slug | EN title |
|---|---|---|
| 1 | dnd-skills | DnD Skills: Eighteen Names, Constitution Has No Skill |
| 2 | dnd-conditions | DnD Conditions: Same Fifteen Names, Lock 2014 or 2024 |
| 3 | dnd-beholder | DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action |

选定句不是 `DnD X: …` 冒号目录，不是 “Same N Names, Lock 2014 or 2024”，不是 “2014 A is a Trait, 2024 a B”。

近邻（非最近 3 篇）`Mind Flayer DnD: CR 7 Matches, The Stun Clock Doesn't` 也用“CR 对得上 ≠ 同一套打法”，但句式仍是冒号双子句，轴是震慑钟不是 Warrior 改名。本 Title 是完整判断句，未撞到不可接受。Kenku “Depends on”、Dragonborn “Lock, Copy, Crop” 亦未套用。

## 停留与主意图

目标读者今晚要确认桌上那只 kobold 是什么。标题指出可核验信息差：挑战等级同为 1/8，仍不是同一只官方怪物。这是正文开篇与锁年节的主判断，不是空“有吸引力”。主意图仍是锁 2014 Kobold vs 2024 Kobold Warrior，未扩成可玩专文或 token 教程。

## 必须改

无。

## 总评

**PASS。** 允许 F freeze 本题文交接（绑定正文 hash `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`）。本 PASS 不是用户终审，也不是组页后的页面图文审。
