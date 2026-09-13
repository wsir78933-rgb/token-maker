# 独立复验：en-body.html（A–G 补丁后）

- 角色：独立复验员（未写正文、未做 A–G 补丁；本轮未改 `src/`）
- 被审：`tmp/blog-dnd-beholder/en-body.html` + `en-faq.json` + `en-seo.json`
- 对照：`en-review.md` §9 A–G、`en-patch.md`
- 正文 SHA-256：`c3ddc51786b96ea9439a341036202200752238fa858347862de04e4829abca37`（UTF-8 原始字节；NFC 后相同）
- 旧 FAIL hash `1a5797ee2ebb6a090333de70f0d675015396c6918c38600f4f901c3f536a5c55` 作废，不得当作通过依据
- 范围：只复核受影响项，不整篇重写

本轮另打开核对（2026-09-13）：

- 2014 AideDD：https://www.aidedd.org/dnd/monstres.php?vo=beholder
- 2024 Roll20：https://roll20.net/compendium/dnd5e/Monsters:Beholder?expansion=34653（Eye Rays 原文：`reroll if the beholder has already used that ray during this turn`）

## 结论

**PASS**

A–G 要求删除的围栏、重复 trap 句、收窄 reroll 均已不在正文。FAQ 五条仍与 `h3`/`p` 字面相同。对照表与射线数字仍与上述转写一致。`en-seo.json` 的 Title / Description 承诺能在正文兑现。

| 项 | 判定 | 证据 |
| --- | --- | --- |
| 1. ResearchTrace / W10 | **通过** | 禁句检索计数均为 0，见下 |
| 2. Repetition（trap） | **通过** | `Matching challenge rating is the trap` 全文 1 次，在锁年段 |
| 3. 2024 reroll | **通过** | 已无 `on the Eye Rays action`；现句与 Roll20 `during this turn` 同范围 |
| 4. FAQ 字面相同 | **通过** | 5 组 `question`=`<h3>`、`answer`=`<p>` 逐字相等 |
| 5. 数字未被补丁改坏 | **通过** | 锁表数字仍在；2014 AideDD / 2024 Roll20 抽核一致 |
| 6. SEOTruth | **通过** | Title / Description 的锥动作槽与射线程序都能在开篇与对照表找到 |

---

## 1. ResearchTrace / W10

检索补丁点名的原文，正文出现次数：

| 原文 | 次数 |
| --- | --- |
| `Baldur` / `Gate 3` / `BG3` | 0 |
| `Realms history` / `beholder-kin` / `video-game` / `walkthrough` | 0 |
| `vault scene` | 0 |
| `unobserved` | 0 |
| `This page does not` / `It is not a Realms` | 0 |
| `levitation-only` / `gentle floating` / `flumph telepathy` | 0 |

开篇现句（身份，原审允许保留）：

> This is not a spectator, and it is not a Death Tyrant pasted onto a CR 13 card.

P2 现以「今晚上桌 → 锁书 → 印刷页」起，无任务卡围栏。spectator 段无 vault scene。token 段无 unobserved buttons。flumph 压成一句内链。锁年段为 `2014 fly-20 hover body`。

仍保留、不记本项失败（原审 §7 保护）：facing/crop lesson、授权边界、SRD exclusion check、not a session log。

---

## 2. Repetition

`Matching challenge rating is the trap` 全文 **1** 次，位置锁年段：

> Matching challenge rating is the trap. It does not make the cone an action-free trait, it does not make Eye Rays a three-ray bundle, and it does not make legendary actions a single Eye Ray option.

速查表 What it is 行现为数字后接「Cone timing, ray procedure, and legendary options sit in the comparison table below.」无 trap 句。

---

## 3. 2024 reroll 与 `during this turn`

导入段现句：

> 2014 rerolls duplicates among the three rays in that action. 2024 rerolls a ray already used this turn.

已删除 `on the Eye Rays action`。对照表、2024 程序、mix-ups、session check、FAQ 均为 `already used this turn` / `already used this turn`，与 Roll20 `during this turn` 同范围（跨三次 Eye Rays 使用互斥，不按「单次动作各自 1d10」）。

传奇射线是否沿用该句：正文仍要求看印刷页。保留，不改死。

---

## 4. FAQ 与 h3/p

FAQ 区 5 组与 `en-faq.json` 逐字相同（含 `<em>`、`<code>`、`&rsquo;`、`&times;`）。补丁声称未改 FAQ，复验确认未改。

---

## 5. 数字

A–G 替换未改对照表、射线列表、Sources。抽核与本轮打开的转写一致，例如：

| 项 | 正文 | 转写 |
| --- | --- | --- |
| 2014 HP / Speed / AC / Bite | 180 (19d10+76)；0 ft., fly 20 hover；AC 18 (natural armor)；+5, 14 (4d6) | AideDD 2014 同 |
| 2014 锥 / 射线 / 传奇 | trait，回合开始朝向/开关；一动作三道随机（重骰重复）；传奇 3 仅 Eye Ray；该转写无 LR | 同 |
| 2014 Disintegration / Death | 45 (10d8) force / 55 (10d10) necrotic；本转写成功无半伤 | 同 |
| 2024 HP / Speed / Init / LR | 190 (20d10+80)；5 ft., Fly 40 hover；+12 (22)；3/Day 或巢穴 4 | Roll20 同 |
| 2024 锥 / Multiattack / 传奇 | Bonus Action 至其下回合开始；Eye Rays ×3；Chomp / Glare；CR 13（10,000 或巢穴 11,500） | 同 |
| 2024 Charm / Fear / Slowing / Enervation / Disintegration / Death | 13 (3d8) Psychic；14 (4d6) Psychic；18 (4d8) Necrotic；13 (3d8) Poison；36 (8d8) Force 成功半伤；55 (10d10) 成功半伤 | 同 |

---

## 6. SEOTruth（`en-seo.json`）

**Title / seoTitle / h1：** `DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action`

正文兑现：

> The 2014 cone is a trait you set at the start of each turn; the 2024 cone is a Bonus Action wave that lasts until the start of the beholder’s next turn.

对照表 Antimagic Cone 行、H2「The 2014 cone is a trait. The 2024 cone is a Bonus Action.」同事实。

**Description：** `A dnd beholder's cone is a start-of-turn trait in 2014 and a Bonus Action in 2024. Copy that year's Eye Rays: three-ray action, or Multiattack three times.`

| 描述承诺 | 正文 |
| --- | --- |
| 2014 锥 = start-of-turn trait | 「trait you set at the start of each turn」 |
| 2024 锥 = Bonus Action | 开篇、对照表、程序段 |
| 抄该年 Eye Rays | 锁年 + 「Run Eye Rays from one book」 |
| three-ray action | 「The 2014 Eye Rays action shoots three random rays」 |
| Multiattack three times | 「the 2024 Multiattack uses Eye Rays three times, and each use is one random ray」 |

描述里的 `Multiattack three times` 是压缩；开篇已写成 Multiattack **uses Eye Rays** three times，不是三次 Multiattack。不构成未兑现或相反事实。

---

## 剩余风险（不挡 PASS）

- 2014 Legendary Resistance：只对 AideDD 转写下结论；正文已要求对印刷页。
- 传奇动作是否共用「本回合已用则重骰」：正文未写死。
- 用户终审、组页后的真实 H1/图文：未做。

**状态：PASS。绑定 hash `c3ddc51786b96ea9439a341036202200752238fa858347862de04e4829abca37`。**
