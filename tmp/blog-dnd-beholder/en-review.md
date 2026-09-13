# 独立鉴文：dnd beholder 英文候选

- 评审角色：未参与写作的独立鉴文员（本会话只读候选与规则；未改 `src/`，未改 `en-body.html`）
- 被审文件：`tmp/blog-dnd-beholder/en-body.html` + `en-faq.json`
- 正文 SHA-256：`1a5797ee2ebb6a090333de70f0d675015396c6918c38600f4f901c3f536a5c55`（UTF-8，NFC 后相同）
- 体裁：教程 + 同年对照（锁书 → 抄锥/射线/传奇 → 裁 token）
- 主意图：今晚把 CR13 真 Beholder 放到 5e 桌：锁 2014 或 2024 MM，从同一本抄 Antimagic Cone、Eye Rays、legendary actions；不是 spectator；token 留十柄+中央眼
- 对照文风：已读 `src/lib/blog-posts/mind-flayer-dnd.ts` 英文开头与骨架（need-to-know 表 → 锁年 → 对照表 → 动作程序 → 裁切 → mix-ups → session check → FAQ → Sources）
- 作者 `en-notes.md` 不作独立通过依据
- 用户终审：尚未进行（内容审稿阶段）

## 结论

**FAIL**

没有发现与锁表/已打开公开转写冲突的致命数字错误，因此 **未改正文**。不能标 PASS。未通过位置如下，改完须绑定新 hash 再审。

| 位置 | 失败门/规则 | 为什么不够过 |
| --- | --- | --- |
| 开篇 p1 末 + p2 | W10 / ResearchTrace / 规则 1、8 | 任务卡围栏写成「本文不是某任务」：P1 已排除 spectator / Death Tyrant，又加 BG3；P2 再堆 Realms / kin catalog / video-game walkthrough。对照夺心魔开篇有一条可核验事实（不在 2024 PHB 十种族），本篇 P2 没有同等载荷。 |
| spectator 段 | W10 | 「Do not rewrite a spectator vault scene here」是给作者的范围指令，不是读者今晚要执行的动作。 |
| token 段 | ResearchTrace | 「This page does not name unobserved editor buttons」是内部写作约束漏进读者正文。 |
| Eye Rays 导入段 | 规则 9 边缘 / 操作清晰度 | 「2024 rerolls a ray already used this turn **on the Eye Rays action**」把 Roll20 的 *during this turn* 收窄成「在该动作上」，可能让人以为三次 Multiattack 各自单独 1d10、不互斥。对照表与后文程序是对的；这一句会教错。 |
| 「Matching challenge rating is the trap」 | Repetition | 速查表与后段各出现一次，第二次才解释。 |

致命事实：无。数字与 2014 AideDD / 2024 Roll20 / 2024 AideDD 页头一致，故无 HTML diff。

---

## 1. 完整 22 条

判定标准：命中必须引原句并说明阅读问题。对照表、2014/2024 平行步骤、规格字段相同 **不** 自动算机器味。

| # | 规则 | 判定 | 原句与依据 |
| --- | --- | --- | --- |
| 1 | 堵住所有反驳 | **命中** | 「It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough。」「Do not rewrite a spectator vault scene here」。这些不是今晚操作的例外，是在挡假想错文。应删/压。真正改战斗的例外（锥是 trait 还是 Bonus Action、2014 无 LR）保留。 |
| 2 | 知识全部输出 | **命中（轻）** | 十射线全文服务「今晚能结算」，保留。偏出的是 flumph 段：「If you need a gentle floating-eye creature instead of a tyrant, that job belongs to a flumph… One calm eye-stalk silhouette on a flumph token does not make this CR 13 card friendly。」主任务不需要温和漂浮眼。压成一句内链即可。mind flayer 一段是同年锁书对照，可留一句。 |
| 3 | 匀速排比 | **未命中实质** | 2014/2024 例程、对照表、mix-ups 标题平行，是对照体裁允许的结构，内容数字不同。 |
| 4 | 让步模板反复出现 | **未命中** | 无机械「虽然…但是…」链。 |
| 5 | 反复给概念命名 | **未命中** | 「Matching challenge rating is the trap」「Shared names are the trap」是判断句，不是「我把这叫作…」仪式。重复问题记在 Repetition，不记本条。 |
| 6 | 情绪曲线太光滑 | **不适用** | 操作文，无编造经历转折。 |
| 7 | 虚构读者错误再反驳 | **未命中** | 「The usual failure is a CR 13 token with a mixed sheet: 2024 Fly 40 feet (hover), a 2014 one-minute Fear Ray, and 2024 Legendary Resistance…」是具体混卡，不是「所有人都以为」。 |
| 8 | 高密度「不是 X 而是 Y」 | **命中** | 开篇连续：「This is not a spectator, not a Death Tyrant pasted onto a CR 13 card, and not a Baldur's Gate 3 boss recap。」下一句再：「It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough。」另有 33 处 `Do not`。spectator / Death Tyrant / SRD 排除是主意图需要的区别；BG3 + Realms + catalog + walkthrough + vault scene 是堆出来的反转。 |
| 9 | 没有任何犹豫 | **未命中**（另有一句过确定） | 「Confirm numbers on the printed *Monster Manual*.」「This transcription does not list Legendary Resistance.」「Confirm on the printed page whether a later legendary ray in the same round uses that same reroll sentence.」这些分寸正确。问题句是把 2024 reroll 写成只作用于「the Eye Rays action」，见上。 |
| 10 | 虚假精确 | **未命中** | HP/速度/AC/CR/咬击/射线骰与已打开转写一致。256/512/1024/2048 与本工具 `ExportSize` 一致。无无来源百分比。 |
| 11 | 脆弱经历只为论点服务 | **不适用** | 无「我也曾失败」。例程标了 not a session log。 |
| 12 | 复杂问题突然变万能步骤 | **未命中** | 分年、分锥/射线/传奇、分巢穴 3/4 LR、token 失败分支都在。 |
| 13 | 每段都收束成金句 | **未命中实质** | 「Pick a column. Stop.」只出现一次，承担选列动作。不是段段升华。 |
| 14 | 句子节奏过于均匀 | **未命中实质** | 短禁令句服务于对照，不是为均句而拆。 |
| 15 | 感受替代论证 | **未命中** | 无「凭直觉」。token 效果写成读者可看的裁切失败，并写明未实测某世界导入。 |
| 16 | 开头只剩钩子、痛点、承诺 | **未命中** | 前三句已给出：抄同一本的锥/射线/传奇、写 2014 或 2024、两版锥与射线程序不同、十柄+中央眼。符合对照文风。 |
| 17 | 连接词固定且密集 | **未命中** | 无「值得注意 / 事实上」填充链。If/then 是操作条件。 |
| 18 | 刻意同义替换 | **命中（轻）** | 同一张怪物卡轮换 sheet / card / block / page / transcription。射线部位 eyestalks / stalks 混用。功能名 Antimagic Cone / Eye Rays / Multiattack / Chomp / Glare 保持稳定，不改术语。 |
| 19 | 中文翻译腔或非母语表达 | **命中（轻）** | 「then run as Antimagic Cone, Eye Rays, and legendary actions」是站点句模，可读但别扭。「the 2014 levitation-only body」容易让人想到 *levitate* 法术（2014 夺心魔才有）；2014 眼魔是 Speed 0 + fly 20 hover，应写 hover-only / no walk speed。「unobserved editor buttons」不像给 DM 看的英语。 |
| 20 | 虚构故事或案例 | **未命中** | 「Example setup, 2014, not a session log.」「Example setup, 2024, not a session log.」四处都标明示例。 |
| 21 | 通用祝福结尾 | **未命中** | 收在 session check：「If any line is blank, you do not have a finished beholder for tonight.」 |
| 22 | 强行追求深刻 | **未命中** | 无宏大命题。 |

---

## 2. 六类形式指纹

| 指纹 | 判定 | 证据 |
| --- | --- | --- |
| 破折号过密 | **未命中（正文）** | `&mdash;` 共 15 处，全部在 Sources 五条（每条 3 个字段分隔），与对照文 Sources 模板相同。正文叙述不用 em dash 堆句。 |
| 粗体过密 | **未命中实质** | `<strong>` 42：速查表行名、1–10 射线名、mix-ups 标题。是信息层级，不是装饰加粗。 |
| 无用装饰符号 | **未命中** | 无 emoji、无装饰分隔符。 |
| 助手残留 | **命中** | 「This page does not name unobserved editor buttons」；「Do not rewrite a spectator vault scene here」。无 As an AI / delve / 内部路径。 |
| 填充短语 | **未命中** | 无 it's worth noting / in conclusion / when it comes to。 |
| 泛泛积极结尾 | **未命中** | 结尾是可勾选清单，不是祝福。 |

必要 H2/H3、对照表、编号清单、失败分支 **保留**（误判保护）。

---

## 3. 五项质量门（本轮审正文）

### ResearchTrace — **FAIL**

不是检索日志，是范围指令漏进读者文。

1. 「It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough.」
2. 「This is not a spectator, not a Death Tyrant pasted onto a CR 13 card, and not a Baldur's Gate 3 boss recap.」中的 BG3 一句（spectator / Death Tyrant 是主意图身份，可留）。
3. 「Do not rewrite a spectator vault scene here」
4. 「This page does not name unobserved editor buttons」

应保留的方法说明（不是研究痕迹）：「The AideDD 2024 beholder shows the 2024 header … with the ray body not expanded on that page。」「The 2014 transcription used here does not list Legendary Resistance。」「Confirm numbers on the printed *Monster Manual*.」Sources 清单。

### ReaderValue — **通过（有局部噪音）**

按主意图走一遍：能锁年、能抄锥/射线/传奇、能把 spectator 划开、能裁十柄+中央眼。对照表 + 两套程序 + session check 可直接上桌。图 1 锁书、图 2 锥朝向、图 3 裁切，都服务主任务。

噪音：flumph 段、任务卡围栏、作者按钮约束。不阻止完成主任务，但使 ResearchTrace / Repetition 失败。

### Repetition — **FAIL（局部）**

| 重复对 | 可留一处 | 其余 |
| --- | --- | --- |
| 「Matching challenge rating is the trap.」（速查表 What it is + 锁年段） | 锁年段那句，后面有解释 | 删表内那句 |
| spectator 身份 | 速查表一行 + H2 一段 + FAQ（FAQ 必须与 h3/p 字面相同） | 删 vault scene；mix-ups / session check 可各留一句失败观察，不要再解释一遍「不是小眼魔」 |
| 锁年 / 锥 / 三射线程序 | 对照表是主存储；cone H2 与 rays H2 是程序 | mix-ups 与 session check 与对照夺心魔同骨架，**保护**；不要再在开篇和 P2 各复述一遍任务卡 |

FAQ 与 FAQ 区 h3/p 相同是规格，不记本门失败。

### Length

鉴文阶段不作淬文硬门槛。本轮机械计数（去掉 FAQ+Sources、figcaption/img/h2/h3，表单元格计入）：**5507** 英文词。作者笔记写 5462，口径略不同；两者都远高于 2000。本门不单独通过整篇。

### SEOTruth

本轮不审七罪定稿标题。`en-meta.json` 仍是 draft。draftDescription 的承诺（两书都是 CR 13、锁年、不要 spectator、十柄+中央眼）能在正文找到。标题锁后须另审。

---

## 4. 事实与公开引用

打开并核对（2026-09-13）：

- 2014 AideDD：https://www.aidedd.org/dnd/monstres.php?vo=beholder
- 2024 AideDD 页头：https://www.aidedd.org/monster/beholder（射线正文未展开）
- 2024 Roll20：https://roll20.net/compendium/dnd5e/Monsters:Beholder?expansion=34653
- Spectator 2014 AideDD：https://www.aidedd.org/dnd/monstres.php?vo=spectator
- Wikipedia Beholder 页：Product Identity / 未进 OGL
- D&D Beyond SRD 5.2 FAQ：明文排除 Beholder

### 锁表数字（不得用记忆改；正文一致）

| 项 | 锁表 / 转写 | 正文 |
| --- | --- | --- |
| 2014 HP | 180 (19d10+76) | 一致 |
| 2014 Speed | 0, fly 20 hover | 「Speed 0 feet, fly 20 feet (hover)」 |
| 2014 AC | 18 natural | 「AC 18 (natural armor)」 |
| 2014 CR | 13 | 一致；XP 10,000 |
| 2014 锥 | trait，回合开始朝向/开关 | 一致 |
| 2014 射线 | 一动作三道随机，重骰重复 | 一致 |
| 2014 传奇 | 3，仅 Eye Ray | 一致 |
| 2014 LR | 该转写无 | 「Not listed on the 2014 transcription used here」 |
| 2014 Bite | +5, 14 (4d6) | 一致 |
| 2024 HP | 190 (20d10+80) | 一致 |
| 2024 Speed | 5, Fly 40 hover | 一致 |
| 2024 Init | +12 | 「Initiative +12 (22)」与 Roll20 / AideDD 2024 页头一致 |
| 2024 LR | 3/day（巢穴 4） | 一致 |
| 2024 Multiattack | Eye Rays ×3，每道 1d10，本回合已用则重骰 | 对照表与程序段一致；导入段多了有害限定 |
| 2024 锥 | Bonus Action，持续到其下回合开始 | 一致 |
| 2024 传奇 | Chomp / Glare | 一致 |
| 2024 Bite | +8, 13 (3d6+3) | 一致 |

### 其他已核射线（非锁表，但正文写了）

2014 AideDD：Charm 无伤 1 小时或至其伤害目标；Paralyzing Con 1 分钟；Fear Wis 1 分钟；Slowing Dex、半速/无反应/动作或附赠不可兼、1 分钟；Enervation 36 (8d8) necrotic 成功半伤；Telekinetic Str、30 英尺、300 磅物件；Sleep Wis，构装/亡灵无效；Petrify Dex 两段至 *greater restoration*；Disintegration 45 (10d8) force **成功无半伤**；Death 55 (10d10) necrotic **成功无半伤**。正文列表与表一致。

2024 Roll20：Charm 13 (3d8) Psychic + Charmed 至受伤，成功仅半伤；Paralyzing Con，1 分钟后自动成功；Fear 14 (4d6) Psychic + Frightened 至目标下回合结束；Slowing Con 18 (4d8) Necrotic 至下回合结束；Enervation 13 (3d8) Poison + Poisoned 不能回血；Telekinetic Gargantuan 自动成功；Sleep 构装/亡灵自动成功、5 英尺唤醒；Petrify Con 两段；Disintegration 36 (8d8) Force 成功半伤；Death 55 (10d10) 成功半伤。正文一致。

2024 AideDD 仅页头（HP/速度/Init/LR/Multiattack/Bite/Eye Rays/Bonus Action 锥/Chomp/Glare），射线未展开：正文如此声明，正确。

### spectator / SRD

- Spectator：CR 3，四柄，无 antimagic cone，90 英尺射线，Spell Reflection（2014 转写）。正文划界正确，未把 spectator 写成小 Beholder。
- SRD 5.2：官方 FAQ 点名排除 Beholder。正文「Beholder is excluded from SRD 5.2」正确。未贴完整属性块。
- Wikipedia：名称 + Product Identity，正文写明不是规则源。正确。

### 非错误、需保护的限制

- 2014 无 Legendary Resistance：**只对「本转写」下结论**，并叫读者对印刷页。保留。
- 传奇射线是否沿用「本回合已用则重骰」：叫读者看印刷页。保留。
- Glare = 使用 Eye Rays = 一道随机射线，不是 2014 三射线动作。保留。
- 2024 非巢穴用 3/Day 与 10,000 XP，不用 4 与 11,500。保留。
- PNG 不是某 VTT 零配置承诺、不是 WotC 授权。保留（删「unobserved」即可）。

### 非致命措辞（不改 HTML，写入局部替换）

- 「2014 levitation-only body」：2014 眼魔没有 *levitate*；是 fly 20 hover + Speed 0。
- 「2024 rerolls a ray already used this turn on the Eye Rays action」：见上。

无虚构「我们测过」。

---

## 5. FAQ 与正文 h3/p

5 条。`question` 对 `<h3>` inner HTML、`answer` 对随后 `<p>` inner HTML，**逐字相同**（含 `&rsquo;`、`&times;`、`<em>`、`<code>`）。

| # | 结果 |
| --- | --- |
| Which Monster Manual do I use for a CR 13 beholder? | 相同 |
| How many eye rays does a beholder shoot on its turn? | 相同 |
| Is a spectator a small beholder? | 相同 |
| Is the beholder in the SRD 5.2? | 相同 |
| What has to stay inside the beholder token? | 相同 |

改 FAQ 区任何一句必须同步 `en-faq.json`。本轮不要求改 FAQ 内容。

---

## 6. 图位

3 张 `figure.inline-figure.inline-figure--wide-crop`，均 `loading="lazy"`、`decoding="async"`、`width="1536"` `height="1024"`。无 `fetchpriority`。无 `iframe`。

| # | 位置 | 作用 |
| --- | --- | --- |
| 1 | H2 Lock the Monster Manual year first 下 | 两本闭合 MM + 锁年 |
| 2 | H2 Antimagic Cone… 下 | 中央眼 150 英尺锥，柄射线打锥外 |
| 3 | H2 Crop ten stalks… 下 | 十柄+中央眼在圈内 |

图注标明 lesson / 不是 session log / 不是导入实测，没有把插画冒充截图。主任务图位无缺口。

---

## 7. 研究痕迹与「本文不是某任务」

**有「本文不是某任务」——本项 FAIL。**

| 原句 | 归类 |
| --- | --- |
| 「This is not a spectator, not a Death Tyrant pasted onto a CR 13 card, and not a Baldur's Gate 3 boss recap.」 | spectator / Death Tyrant = 主意图身份（可留）。BG3 = 任务卡围栏。 |
| 「It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough.」 | W10。对照夺心魔 P2 有 PHB 十种族事实；此处没有。 |
| 「Do not rewrite a spectator vault scene here」 | W10 / 给作者的范围指令。 |
| 「This page does not name unobserved editor buttons」 | 助手/写作约束残留。 |
| 「This is a facing lesson, not a session log.」「This is a crop lesson, not a license…」 | 示例边界 + 授权边界，**保留**。 |
| 「It is not a ranking claim and not a commercial license…」 | 授权边界，**保留**。 |
| 「The SRD 5.2 page is an exclusion check, not a monster sheet.」「It is not a rules source for hit points, cones, or rays.」 | 来源范围，**保留**。 |

无 SERP 排名、抓取日志、who searched、内部磁盘路径、提示词。

---

## 8. 对照文风（mind-flayer 英文）

骨架对齐：关键词加粗开篇、锁年、need-to-know 表、对照表、「Pick a column. Stop.」、例程标 not a session log、裁切失败分支、mix-ups、session check、FAQ、Sources。这是保护项，不要为去 AI 味拆平行结构。

本篇相对对照文多出来的、导致 FAIL 的，是开篇双层任务卡围栏、vault scene、unobserved buttons。夺心魔开篇只有一条「不是怪奇物语」+ P2 带 PHB 事实。

---

## 9. 必要局部改法（可粘贴；不要整篇重写）

只改这些。FAQ 五条不动。改完重算 hash。

### A. 开篇 p1 末句 — 去掉 BG3，留下身份

**原文：**

> Crop the token so ten eyestalks and the central eye stay inside the frame. This is not a spectator, not a Death Tyrant pasted onto a CR 13 card, and not a Baldur&rsquo;s Gate 3 boss recap.

**替换：**

> Crop the token so ten eyestalks and the central eye stay inside the frame. This is not a spectator, and it is not a Death Tyrant pasted onto a CR 13 card.

### B. 开篇 p2 — 删任务卡围栏

**原文：**

> This page is for a DM or player who is putting that creature on a 5e table or VTT tonight. It is not a Realms history, not a catalog of beholder-kin, and not a video-game walkthrough. Lock the book, copy cone, rays, and legendary actions from that book, and crop a ten-stalk tyrant that still reads at map size. Confirm numbers on the printed <em>Monster Manual</em>. Public transcriptions are linked in Sources.

**替换：**

> This page is for a DM or player who is putting that creature on a 5e table or VTT tonight. Lock the book, copy cone, rays, and legendary actions from that book, and crop a ten-stalk tyrant that still reads at map size. Confirm numbers on the printed <em>Monster Manual</em>. Public transcriptions are linked in Sources.

### C. 速查表 — 去掉重复金句

**原文（What it is 行）：**

> Large aberration (2014) / Large Aberration (2024), lawful evil, CR 13 (10,000 XP; 2024 also lists 11,500 in a lair), AC 18, Darkvision 120 feet, Deep Speech, Undercommon, immune to being knocked prone, passive Perception 22. Matching challenge rating is the trap. Cone timing, ray procedure, and legendary options sit in the comparison table below.

**替换：**

> Large aberration (2014) / Large Aberration (2024), lawful evil, CR 13 (10,000 XP; 2024 also lists 11,500 in a lair), AC 18, Darkvision 120 feet, Deep Speech, Undercommon, immune to being knocked prone, passive Perception 22. Cone timing, ray procedure, and legendary options sit in the comparison table below.

锁年段「Matching challenge rating is the trap. It does not make the cone…」保留。

### D. 2024 reroll 一句 — 与 Roll20 对齐

**原文：**

> Both years tell you to roll. 2014 rerolls duplicates among the three rays in that action. 2024 rerolls a ray already used this turn on the Eye Rays action. Confirm on the printed page whether a later legendary ray in the same round uses that same reroll sentence. Do not import the other year&rsquo;s duplicate rule onto that line.

**替换：**

> Both years tell you to roll. 2014 rerolls duplicates among the three rays in that action. 2024 rerolls a ray already used this turn. Confirm on the printed page whether a later legendary ray in the same round uses that same reroll sentence. Do not import the other year&rsquo;s duplicate rule onto that line.

### E. spectator 段 — 去掉「不要在本文写」

**原文：**

> A spectator is not a CR 13 tyrant with fewer hit points. It is a CR 3 guardian with four eyestalks, a central eye, and no antimagic cone. Keep that job on the <a href="${EN_SPECTATOR_DND_PATH}" rel="noreferrer noopener">spectator dnd page</a>. Do not rewrite a spectator vault scene here, and do not borrow spectator Spell Reflection, 90-foot rays, or a four-ray list to &ldquo;tone down&rdquo; tonight&rsquo;s beholder. If the map needs a weaker floating eye, use the spectator page and a four-stalk token. If the map needs this CR 13 card, use ten stalks, the cone, and the year you wrote on the tracker.

**替换：**

> A spectator is not a CR 13 tyrant with fewer hit points. It is a CR 3 guardian with four eyestalks, a central eye, and no antimagic cone. Use the <a href="${EN_SPECTATOR_DND_PATH}" rel="noreferrer noopener">spectator dnd page</a> for that creature. Do not borrow spectator Spell Reflection, 90-foot rays, or a four-ray list to &ldquo;tone down&rdquo; tonight&rsquo;s beholder. If the map needs the weaker four-stalk guardian, use that page and a four-stalk token. If the map needs this CR 13 card, use ten stalks, the cone, and the year you wrote on the tracker.

### F. flumph 段 — 压成一句

**原文：**

> If you need a gentle floating-eye creature instead of a tyrant, that job belongs to a <a href="${EN_DND_FLUMPH_PATH}" rel="noreferrer noopener">flumph</a>, not to a beholder with the cone switched off. One calm eye-stalk silhouette on a flumph token does not make this CR 13 card friendly. Do not run flumph telepathy as a replacement for Antimagic Cone.

**替换：**

> A <a href="${EN_DND_FLUMPH_PATH}" rel="noreferrer noopener">flumph</a> is a different floating-eye creature; it is not this CR 13 card with the cone switched off.

### G. token 段 — 去掉 unobserved，改 2014 用词

**原文：**

> Cropping can stay local-first. Use the circle first. If the stalk tips hit the ring, switch to a square mask so the corners keep the ten-stalk crown, or a polygon mask that follows the stalks. This page does not name unobserved editor buttons, and it does not claim a tested import into a named Roll20, Foundry, or Owlbear world. Those VTTs accept image tokens. A transparent PNG is not a promise that a world file will need zero extra setup after you drop it in.

**替换：**

> Cropping can stay local-first. Use the circle first. If the stalk tips hit the ring, switch to a square mask so the corners keep the ten-stalk crown, or a polygon mask that follows the stalks. A transparent PNG is not a promise that a named Roll20, Foundry, or Owlbear world will import with zero extra setup.

**原文（锁年段）：**

> Do not give the 2024 creature Speed 0 feet because you remember the 2014 levitation-only body.

**替换：**

> Do not give the 2024 creature Speed 0 feet because you remember the 2014 fly-20 hover body.

---

## 10. 保护的有效判断（不要在改写里删掉）

- 两书都是 CR 13 / AC 18 **不能**拿来混锥、射线程序、传奇选项。
- 2014 锥是回合开始 trait（含开关）；2024 锥是 Bonus Action，持续到其下回合开始；跳过 Bonus Action 不会留下 2014 常开锥。
- 2014 一动作三射线（重复重骰，1–3 个目标）；2024 Multiattack 三次 Eye Rays（每次一道、本回合已用则重骰、每次一个可见目标）。
- 2014 传奇只有 Eye Ray；2024 是 Chomp（两次 Bite）或 Glare（使用 Eye Rays = 一道）。
- 2014 本转写无 Legendary Resistance；2024 非巢穴 3/Day，巢穴 4。
- 2014 Disintegration / Death 本转写成功无半伤；2024 有。
- 2014 Slowing / Petrification 是 Dex；2024 是 Con。
- 2014 Enervation 36 (8d8) necrotic；2024 是 13 (3d8) Poison + 不能回血。
- Beholder 不在 SRD 5.2；不要当 SRD 全文转载。
- 例程标 not a session log。
- 「Pick a column. Stop.」
- 印刷书与转写冲突时以印刷书为准。

---

## 11. 图文讲解缺口

无。三张图分别钉死锁年、锥朝向、十柄裁切。不要为凑图再加。

---

## 12. 剩余风险

- 2014 Legendary Resistance：只核了对 AideDD 转写；印刷 MM 仍以桌面书为准（正文已如此要求）。
- 传奇动作是否共用「本回合已用射线」重骰：正文已要求看印刷页，不要在改写里写死。
- 用户终审、七罪标题、组页后的真实页面图文：未做。
- 本报告绑定 hash `1a5797ee2ebb6a090333de70f0d675015396c6918c38600f4f901c3f536a5c55`。局部改写后旧 FAIL 记录不得当作通过。

**en-body.html：未改（无致命事实错误）。状态：FAIL。**
