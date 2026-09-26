# dnd warlock spells：共享规则事实包

本文件是 A-rules 的研究交接，不是布局、文章正文或推荐榜。英文与简体中文链可以共享下列事实；选题取舍由 B 决定。核验日：2026-09-26（Asia/Shanghai）。主题知识以英文官方规则为准，中文是自主概括，不声称官方中文译名。

- Role: A-rules；Run: `run_39994fa3f53e`
- Task: `task_392f78caef5a`；Dispatch: `ctx_408e9c51f5db`
- Terminal: `term_9c0b4c8c-e659-4ef9-aab8-ab2f5c374480`
- Codex session: `01a0dbac-ff32-75b1-a32d-60f3ae756368`
- 工作树：`/Users/wusir/orca/workspaces/token-maker-app/博客`；branch `博客`；起始 HEAD `eb65956921988db3e6a16164e747d2e517429ad0`。

## 使用合同与核验结论

PASS 表示**该条明确写出的字段**已经读到官方正文；不代表完整规则书、所有边缘互动或整篇内容验收通过。UNVERIFIED 字段禁止用常识或另一版本补齐。下文共覆盖 16 个候选法术（含 Eldritch Blast）：12 个已核对两版核心机制，Hex 的 2024 正文已核对而 2014 仅核对公开目录字段，另 3 个只有公开目录/职业列表层面的证据。缺口详情见末节。

“2014”指 Legacy / Basic Rules (2014)；“2024”指修订规则，以 D&D Beyond `br-2024` 与 SRD 5.2.1 为证。官方目前也使用 5e / 5.5e 标签；文章仍应明确年份，不能将网页当前版本默认为 2014。SRD 的法术收录不等于完整 PHB：本次没有将 SRD 未收录解释为职业不能选。

所有事实的默认类型为「主题知识」，公开权限为「可用自主概括及公开官方链接」，对应正文位置为「待 B/C 选用后绑定，不预设段落」。标有 D 的条目为规则推导/示例，不是实战测试。这里只核验规则，没有 SERP 地区判断、工具功能实测、游戏战斗测试或强度排名。

## 官方来源登记

下列 S 编号与章节组成逐条可定位出处。出版者均为 Wizards of the Coast / D&D Beyond；均在本次实际打开，目录与正文的区别单独注明。

| ID | 来源标题及公开 URL | 已读取位置 / 适用版本 |
|---|---|---|
| S14C | [Warlock — Legacy Class Details](https://www.dndbeyond.com/classes/7-warlock) | The Warlock Table；Pact Magic；Eldritch Invocations；Mystic Arcanum；The Fiend → Expanded Spell List。2014；忽略下方用户评论。 |
| S24C | [Character Classes — Warlock](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock) | Warlock Features；Level 1: Pact Magic；Level 2: Magical Cunning；Level 11: Mystic Arcanum；Invocation Options；Warlock Spell List；Fiend Spells。2024。 |
| S14R | [Basic Rules (2014), Chapter 10: Spellcasting](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting) | Casting Time → Bonus Action；Duration → Concentration。2014。 |
| S24R | [Basic Rules, Spells](https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn) | Casting Time → One Spell with a Spell Slot per Turn。2024。 |
| S14S | [Basic Rules (2014), Chapter 11: Spells](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells) | Warlock Spells 列表和下列法术同名描述；各行给出锚点。2014。 |
| S24P | [System Reference Document 5.2.1](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf) | 2024 修订机制。下文页码是 PDF 印刷页码（第一页为 1），每条附章节/法术名。PDF 实际打开并读取文字。 |
| SCAT | [D&D Beyond, Spells](https://www.dndbeyond.com/spells?page=3) | 公开目录内同名新版/Legacy 两行；只验证展示字段，不等于读到付费描述。另有各词筛选 URL。 |
| SSRD | [System Reference Document 下载页](https://www.dndbeyond.com/srd) | 5.2.1 下载与版本说明；5.1 / 5.2 区分。未用下载页代替法术正文。 |

SRD 5.2.1 首页提供 CC-BY-4.0 条款。若后续公开稿使用该许可材料，保留其要求的归属文字：

> This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

除该许可归属文字外，本交接采用自主概括，不转载法术正文。公开稿的引用应紧邻实际采用的主张；不要把本文件、命令编号或审核标签搬入读者正文。

## 职业资源、施法与专注

### R01 — Pact Magic 槽位进度（2014 / 2024；PASS）

条件：表中等级是 **Warlock 职业等级**；只列本职业 Pact Magic 槽，不含多职业、物品、专长或额外能力。

| Warlock 等级 | Pact Magic 槽数量 | 每槽环阶 |
|---|---:|---:|
| 1 | 1 | 1 |
| 2 | 2 | 1 |
| 3–4 | 2 | 2 |
| 5–6 | 2 | 3 |
| 7–8 | 2 | 4 |
| 9–10 | 2 | 5 |
| 11–16 | 3 | 5 |
| 17–20 | 4 | 5 |

两版该进度相同。Pact Magic 槽同环阶，完成短休或长休恢复所有已消耗的 Pact Magic 槽。5 级 Warlock 用本职业槽施放一环法术时，消耗的是三环槽；效果是否增强取决于该法术的升环条款，不能把所有法术都说成伤害自动增加。

来源：S14C → The Warlock Table / Pact Magic；S24C → Warlock Features / Level 1: Pact Magic。两张完整 1–20 表已读取。

### R02 — 学会/准备法术（分版；PASS）

- 2014：Pact Magic 使用已知法术；每升一个 Warlock 等级可将一个已知 Warlock 法术换成可选环阶内的另一个。1 级已知 2 个一环法术。
- 2024：表头称 Prepared Spells，但仍是每升 Warlock 等级可替换列表中一个法术；**不能写成长休后随意重选整张准备表**。其他 Warlock 特性授予的 always prepared 法术不占此表数量。
- 两版基础数量相同：等级 1–9 分别为 2、3、4、5、6、7、8、9、10；10 级 10；11–12 级 11；13–14 级 12；15–16 级 13；17–18 级 14；19–20 级 15。不能把数量当作可用槽数。
- 两版施法属性为 Charisma。2014 公开职业规则明确 DC = 8 + proficiency bonus + Charisma modifier，法术攻击加值 = proficiency bonus + Charisma modifier。

来源：S14C → Pact Magic；S24C → Level 1: Pact Magic / Warlock Features。范围只到基础职业，不补写未核验子职业。

### R03 — 戏法与 invocations（分版；PASS）

- 两版 Pact Magic 初始选 2 个 Warlock 戏法，Warlock 4 级增至 3 个、10 级增至 4 个。Eldritch Blast 是可选戏法；2024 文中“recommended”不等于自动获得。
- 2024 每升 Warlock 等级可更换本特性授予的一个戏法。2014 本次基准职业正文未给这一条；不据此对其他扩展书可选规则下结论。
- 2014 Agonizing Blast 以已知 Eldritch Blast 为前提，为其命中伤害加 Charisma modifier；该版基础职业 2 级才得到 invocations。
- 2024 Agonizing Blast 要求 Warlock 2+，选择一个造成伤害的已知 Warlock 戏法，将 Charisma modifier 加到其伤害掷骰；可重复选但必须选不同合格戏法。不能把该版写成只能增强 Eldritch Blast。
- 2024 戏法不消耗法术位；来源 S24P p.104 → Casting without Slots / p.178 → Cantrip。2014 Eldritch Blast 的零环分类见 S14S。

来源：S14C → Pact Magic / Agonizing Blast；S24C → Level 1: Pact Magic / Agonizing Blast。戏法伤害与射线数量另见 F01。

### R04 — Magical Cunning（2024；PASS）

Warlock 2 级获得。进行 1 分钟仪式，恢复不超过最大 Pact Magic 槽数一半（向上取整）的已消耗槽；用后须完成长休才能再用。20 级 Eldritch Master 将这次恢复改为全部已消耗 Pact Magic 槽。

条件：不是战斗中一个 Action 自动刷新；不是每次短休以外无限恢复；也不恢复 Mystic Arcanum。2014 表无该 2 级特性；其 20 级 Eldritch Master 本身是花 1 分钟恢复所有 Pact Magic 槽、长休后再用。

来源：S24C → Level 2: Magical Cunning / Level 20: Eldritch Master；S14C → Eldritch Master。

### R05 — Mystic Arcanum（2014 / 2024；PASS）

Warlock 11、13、15、17 级分别选择六、七、八、九环的一个 Warlock 法术作为该环 arcanum。每个通过此特性不消耗法术位施放一次，长休恢复使用。它们不是六至九环 Pact Magic 槽，不能写成可拿来给任何低环法术升环的资源，也不能说短休恢复。2024 额外明确每升 Warlock 等级可换一个 arcanum，替换法术须同环。

来源：S14C → Mystic Arcanum (6th level) 及后续条目；S24C → Level 11: Mystic Arcanum。未核验全部高环候选的效果；本包不提供高环强度排名。

### R06 — 子职业法术不是通用名单（2014 / 2024；PASS）

已核验例仅为 Fiend：2014 Expanded Spell List 是扩展可学习选择，不能自动视为全都已知；2024 Fiend Spells 达到表列职业等级后 always prepared。Fireball 在这些 Fiend 表中出现，不在本次读到的两版基础 Warlock 通用三环列表里。不要用 Fiend 专属获得方式说所有 Warlock 都能直接选 Fireball。

来源：S14C → The Fiend / Expanded Spell List；S24C → Fiend Spells；S14S → Warlock Spells；S24C → Level 3 Warlock Spells。其他子职业未逐个核对。

### R07 — 同一 turn 的施法资源限制（分版；PASS）

- 2014：在一个 turn 内用 Bonus Action 施法，该 turn 不能再施放其他法术，例外是施法时间为 1 Action 的戏法。规则的触发点是 Bonus Action 施法，不是笼统“每 turn 只能一个有环法术”，也不限于消耗槽的 Bonus Action 法术。
- 2024：同一个 turn，只能消耗一个法术位来施法。不要改写成“每 round 一个法术”或“每 turn 一个非戏法”。无槽施法的来源与 Action / Bonus Action / Reaction 的可用性仍须分别满足。

来源：[S14R → Bonus Action](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting#BonusAction)；[S24R → One Spell with a Spell Slot per Turn](https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn)。

### R08 — 专注（分版；PASS）

- 两版均不能同时维持两个需要专注的法术；受伤通常需 Constitution saving throw；失能或死亡结束专注；可主动结束且无需动作。普通移动或攻击本身不等于失去专注（2014 规则明确列出）。
- 2014 受伤专注豁免 DC 为 10 或伤害的一半取较高者；不同伤害来源分别检定。该节没有 30 的上限条款。
- 2024 在**开始施放**另一个需专注法术、或激活另一需专注效果时，就失去原有专注。受伤 DC 为 10 或伤害一半向下取整，取较高者，上限 30。

来源：[S14R → Concentration](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting#Concentration)；S24P p.179 → Concentration。不要把专注说成“每回合再花一个动作维持”。

### D01 — 可公开的规则推导示例（条件成立时 PASS；不是实战测试）

- 初次用槽施放 Hex，再用 Action 施放 Eldritch Blast：两版公开目录均确认 Hex 为 Bonus Action、Eldritch Blast 为 Action 戏法；按 R07 可成立。不要由此把 Hex + 另一个需要专注的法术写成可并存。
- 用槽 Misty Step + 用槽另一个 Action 法术：2014 触发 Bonus Action 限制，2024 将消耗第二个施法槽，均不成立。
- 2024 在自己的 turn 已消耗一个槽施法，就不能在**同一 turn** 再消耗槽 Counterspell；换成别人的 turn 时不能沿用“整 round 禁止”这一错误结论，仍要有 Reaction、槽、可见触发及距离。
- 2024 arcanum 不消耗槽，因此不能仅凭“它不是戏法”就排除其与一个用槽 Bonus Action 法术同 turn 的组合；须另核所选 arcanum 的施法时间、专注及其他条件，本包不提供具体未核验组合。
- 2024 Hex 与 Darkness、Hold Person、Invisibility、Hunger of Hadar、Fly、Hypnotic Pattern、Banishment 都需要专注；同一施法者不能同时维持。非专注不等于无资源花费。

推导依据：R05、R07、R08 和 F01–F16 对应字段；Hunger of Hadar 这里只采用公开列表明确显示的 Concentration，未采用其受限正文。

## 法术事实卡

下文 Action / Bonus Action / Reaction 是不同资源；“最早等级”只按基础 Warlock Pact Magic 表推得，不涵盖额外施法来源。每张卡均独立标版、条件和出处。省略的材料成本、状态细节及其他互动不得自行补入。

### F01 — Eldritch Blast（2014 / 2024；PASS）

两版：零环，1 Action，120 ft，瞬间，无专注；每束单独作远程法术攻击，命中 1d10 force。等级 5/11/17 时共 2/3/4 束，可同目标或分配目标。2014 描述目标为 creature；2024 为 creature **or object**。2024 多职业规则明确戏法增强按角色总等级，除非法术另有规定；不要把这一来源伪称为已核对 2014 多职业条款。

条件：不能把“掷两次攻击”简化成一次必中 2d10，也不能将 Agonizing Blast 视为戏法自带。来源：[S14S → Eldritch Blast](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#EldritchBlast)；[S24P p.127 → Eldritch Blast](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=127)；S24P p.25 → Multiclassing / Cantrips。

### F02 — Hex（2024 正文 PASS；2014 部分字段 PASS / 效果 UNVERIFIED）

2024：一环，Bonus Action，90 ft，专注至多 1 小时；选择能看见的生物，每次以攻击掷骰命中该目标时额外 1d6 necrotic。选择一个属性，使目标该属性的 **ability checks** 具有劣势；不是 saving throws。目标降至 0 HP 后，可在后续 turn 用 Bonus Action 诅咒新目标。二环槽将专注最长时长增至 4 小时，三/四环 8 小时，五环以上 24 小时；该升环条款不增加每次的 1d6。

2014：本次只核实目录为一环、Bonus Action、90 ft、Concentration、1 Hour；描述入口跳商城，伤害/能力检定/转移/升环细节不在本包核验范围。不能把上段全部标成两版通用，也不能在此证据下断言“2014 二环槽也 4 小时”。

来源：[S24P p.140 → Hex](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140)；[SCAT → Hex 两版本行](https://www.dndbeyond.com/spells?filter-search=Hex)；2014 受限入口 `https://www.dndbeyond.com/spells/2317-hex`。最早基础职业等级 1。

### F03 — Armor of Agathys（两版目录 PASS；完整效果 UNVERIFIED）

两版目录：一环、Self、1 Hour、cold；2024 职业表明确无专注。2014 显示 1 Action，2024 显示 1 Bonus Action。该动作时间变化有直接公开字段证据。

限制：两版详情均跳商城，2024 列表展开也明确要求购买 PHB。没有核验临时 HP 数量、反伤触发、临时 HP 来源替换、提前结束条件或升环数值，不允许用记忆补写。这些若是正文核心，则先退 A 补证；也可不选此法术。

来源：[SCAT → Armor of Agathys 新版/Legacy 行](https://www.dndbeyond.com/spells?page=3)；S24C → Level 1 Warlock Spells。受限详情 `https://www.dndbeyond.com/spells/2310-armor-of-agathys`、`https://www.dndbeyond.com/spells/2618870-armor-of-agathys`。

### F04 — Arms of Hadar（两版目录 PASS；完整效果 UNVERIFIED）

两版公开目录：一环，Action，Self (10 ft.)，瞬间，Strength save，necrotic；2024 职业表无专注。只把 10 ft. 记作目录字段，未核形状正文，不把它写成直径或自行绘制精确范围图。

限制：没有读到完整效果，不能写伤害骰、失败后阻断 reactions、成功结果或升环。来源：[SCAT → 两版本 Arms of Hadar 行](https://www.dndbeyond.com/spells?filter-search=Arms%20of%20Hadar)；S24C → Level 1 Warlock Spells。目录详情入口分别为 `https://www.dndbeyond.com/spells/2311-arms-of-hadar`、`https://www.dndbeyond.com/spells/2618871-arms-of-hadar`；本次未成功逐一打开这两个详情，不能将它们写成已读证据。

### F05 — Hellish Rebuke（2014 / 2024；PASS）

两版：一环，Reaction，60 ft，瞬间，无专注。触发是受到来自 60 ft 内能看见的生物的伤害；不是任何一次受伤都能使用。该生物 Dexterity save，失败 2d10 fire，成功减半；每高于一环一阶多 1d10。正常用 Pact Magic 施放仍消耗槽，并使用 Reaction。

来源：[S14S → Hellish Rebuke](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#HellishRebuke)；[S24P p.140 → Hellish Rebuke](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140)。最早 Warlock 1 级。

### F06 — Misty Step（2014 / 2024；PASS）

两版：二环，Bonus Action，Self，瞬间，无专注；传送至至多 30 ft 内**能看见、未被占据**的位置。正文无升环增距条款。不能说带走队友，也不能把传送距离随 Pact 槽提高。

来源：[S14S → Misty Step](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#MistyStep)；[S24P p.150 → Misty Step](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=150)。最早 Warlock 3 级；同 turn 施法限制见 R07。

### F07 — Invisibility（2014 / 2024；PASS）

两版：二环，Action，Touch，专注至多 1 小时；每高于二环一阶可多选一个生物。2014 对攻击或施法的目标结束；2024 明确在目标作攻击掷骰、造成伤害或施法之后立即提前结束。2024 的“造成伤害”不能在对照中遗漏。

条件：不能许诺隐形就等于无人知道位置；本包没做潜行/Hide 机制审核。来源：[S14S → Invisibility](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Invisibility)；[S24P p.143 → Invisibility](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=143)。最早 Warlock 3 级。

### F08 — Hold Person（2014 / 2024；PASS）

两版：二环，Action，60 ft，专注至多 1 分钟；只选能看见的 **Humanoid**，Wisdom save 失败陷入 Paralyzed，每个自己的 turn 结束重作豁免，成功结束。每高于二环一阶多一个 Humanoid。2014 升环目标彼此须在 30 ft 内；2024 条目没有该相互距离限制，但每个目标仍须符合射程/可见等基本条件。

条件：不能用“人形外观”替代生物类型，不能说失败一次就锁满 1 分钟。来源：[S14S → Hold Person](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#HoldPerson)；[S24P p.141 → Hold Person](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=141)。最早 Warlock 3 级。

### F09 — Darkness（2014 / 2024；PASS）

两版：二环，Action，60 ft，专注至多 10 分钟；定点区域为半径 15 ft 的球形魔法黑暗，普通 Darkvision 看不穿、非魔法光不能照亮。不能把它写成直接伤害法术。

2014 可把源点设在自己持有物或未被穿戴/携带的物上，黑暗随物移动；2024 的物体施法选项要求该物品未被穿戴/携带，形成源于该物品的 15 ft Emanation。两版均可用不透明物完全遮住源物以阻挡黑暗；本次不推导复杂边界遮挡。

两版 Devil’s Sight 都写明可看穿 120 ft 内魔法/非魔法 Darkness，2024 另明确 Dim Light。能力只授予拥有该 invocation 的角色，不能推广为队友也能看见。此结论不自动适用于 Hunger of Hadar。

来源：[S14S → Darkness](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Darkness)；[S24P p.122 → Darkness](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=122)；S14C/S24C → Devil’s Sight。最早 Warlock 3 级。

### F10 — Hunger of Hadar（两版目录 PASS；完整效果 UNVERIFIED）

两版目录：三环，Action，150 ft，Concentration，1 Minute，显示 20 ft 范围字段和 Dexterity save；2024 基础 Warlock 三环名单明确收录。最早基础职业等级 5。

未读到两版完整正文，因此不核定伤害触发时点、冷/酸伤害骰、困难地形、blinded 与 darkness 的关系、升环以及 Devil’s Sight 互动。不能以 BG3、论坛或 UA 代替正式桌面规则；若 B 选此项作核心，必须再补官方正文。

来源：[SCAT → 两版本 Hunger of Hadar 行](https://www.dndbeyond.com/spells?filter-search=Hunger%20of%20Hadar)；S24C → Level 3 Warlock Spells。目录入口为 `https://www.dndbeyond.com/spells/2339-hunger-of-hadar` / `https://www.dndbeyond.com/spells/2619162-hunger-of-hadar`，本次批量打开在前一个 Hex 导航超时即停止，不能伪称这两页均已打开。

### F11 — Counterspell（2014 / 2024；PASS）

两版：三环，Reaction，60 ft，瞬间，无专注；须看见施法生物。2014 对三环及以下自动打断，较高环需施法属性检定 DC 10 + 对方法术环阶；升环后对不高于 Counterspell 槽环阶的法术自动生效。

2024 触发明确要求对方在施放带 V/S/M 成分的法术；由该生物作 Constitution saving throw，失败则法术无效，所花 Action/Bonus Action/Reaction 浪费；如果用槽施放，被打断的那个槽**不消耗**。2024 描述没有旧版按环阶自动打断或升环自动成功条款。不要把 Counterspell 的槽不消耗写到反制者自己身上。

来源：[S14S → Counterspell](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Counterspell)；[S24P p.120 → Counterspell](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=120)。最早 Warlock 5 级；同 turn 使用限制见 R07。

### F12 — Dispel Magic（2014 / 2024；PASS）

两版：三环，Action，120 ft，瞬间，无专注；选择一个生物、物体或魔法效果，终止目标上三环及以下法术；较高环逐个作施法属性检定 DC 10 + 法术环阶。升环可自动结束不高于所用槽环阶的法术。2024 明确措辞为 ongoing spell。

条件：不是 Counterspell，不是在对手施法时用 Reaction；“可选 magical effect”不等于能抹除任意非 spell 超自然能力或魔法物品本身。

来源：[S14S → Dispel Magic](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#DispelMagic)；[S24P p.124 → Dispel Magic](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=124)。最早 Warlock 5 级。

### F13 — Fly（2014 / 2024；PASS）

两版：三环，Action，Touch，专注至多 10 分钟；愿意的目标得到 60 ft 飞行速度；法术结束而目标仍在空中则坠落，除非能阻止坠落；每高于三环一阶多一个目标。2024 明确允许 hover；2014 该法术描述没有授予 hover。

条件：2024 hover 不意味着法术结束后仍悬空；维持 Fly 会占用专注。来源：[S14S → Fly](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Fly)；[S24P p.133 → Fly](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=133)。最早 Warlock 5 级。

### F14 — Hypnotic Pattern（2014 / 2024；PASS）

两版：三环，Action，120 ft，专注至多 1 分钟；范围为 30 ft cube。范围内看到图案的每个生物作 Wisdom save；失败则 Charmed，受该魅惑时 Incapacitated 且速度为 0。受任何伤害或别人花 Action 摇醒便结束该目标的效果；文本没有每 turn 自动重投豁免。正文无升环增益条款。

条件：没有“只影响敌人”的选择性；不能把它的 Charmed 机制写成对魅惑免疫仍保证有效。来源：[S14S → Hypnotic Pattern](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#HypnoticPattern)；[S24P p.141 → Hypnotic Pattern](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=141)。最早 Warlock 5 级。

### F15 — Banishment（2014 / 2024；PASS）

两版：四环，Action，专注至多 1 分钟，Charisma save；每高于四环一阶多一个目标。2014 射程 60 ft：当前位面原生目标进入无害半位面并失能，法术结束返回；外来位面原生目标被送回原生位面，维持满 1 分钟则不返回。

2024 射程 **30 ft**：失败目标进入无害半位面并失能，通常结束返回；若是 Aberration、Celestial、Elemental、Fey 或 Fiend 且维持满 1 分钟，则送往 DM 选定的与类型关联位面的随机地点，不返回。这里不能沿用旧版“所有非本位面原生目标”条件，也不能添入本次正文没有的每 turn 重复豁免。

来源：[S14S → Banishment](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#Banishment)；[S24P p.112 → Banishment](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=112)。最早 Warlock 7 级。

### F16 — Dimension Door（2014 / 2024；PASS）

两版：四环，Action，500 ft，瞬间，无专注；目的地可凭看见、想象或距离方向描述，不要求一定可见。可带一名愿意且开始时在 5 ft 内的生物；2014 要求对方体型不大于自己，2024 该限制已不在正文，并规定同伴到达目的空间 5 ft 内的位置。

2014 若目的地被生物或物体占据，同行者各受 4d6 force 并传送失败；2024 明确若任一到达空间被生物占据或被物体完全填满，双方各受 4d6 force 且传送失败。不能建议把“无需看见”当作没有落点风险。

来源：[S14S → Dimension Door](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells#DimensionDoor)；[S24P pp.123–124 → Dimension Door](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=123)。最早 Warlock 7 级；无已核验升环增距条款。

## 后续作者/审核者边界

1. 可从已核验候选中选取足够完成主意图的法术；本研究不要求文章把 16 项全收录，不给“最佳”排名。
2. 需要准确范围图时，已有完整证据可支持 Darkness 的 15 ft radius、Hypnotic Pattern 的 30 ft cube，以及两种传送的距离/可见性差别；这只是可用事实，不指定布局或图位。Arms/Hunger 的图形机制未读正文，不能由目录括号补画。
3. 戏法、Pact Magic、Mystic Arcanum 是三类不同资源；Prepared Spells 数量、槽数、槽环阶、职业等级必须分开。
4. 2014 Hex 效果与升环、两版 Armor of Agathys / Arms of Hadar / Hunger of Hadar 的具体机制均保留 UNVERIFIED。需要时补公开官方正文或用户有权提供的规则材料；不得以本文的缺口标记作为公开文章内容，也不得从另一版复制填空。
5. 官方网页评论与 forums 即便同域名也不是官方规则。研究中曾出现旧职业页下方用户评论，已排除，未用于任何结论；UA/Playtest、BG3 及第三方攻略同样未作规则证据。
6. 状态仅为「规则研究完成并显式保留证据缺口」；不代表布局、两语言正文、独立审核、图片或网站页面完成。
