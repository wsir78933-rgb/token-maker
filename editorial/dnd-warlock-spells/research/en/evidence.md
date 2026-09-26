# A-en：dnd warlock spells 事实与意图交接

本文件供 B 选定唯一主意图及 C/E 核对事实；不是大纲或正文。核验日均为 **2026-09-26**。公开规则主张采用下列一手来源，社区页只用于研究需求。所有内容为简要概括，不能将来源评论区当规则正文。

## 来源账本与公开引用候选

下列 ID 可作为后续 `PublicReference.id`；label 取来源名称，url 为公开地址，appliesTo 见事实表。C 确定实际使用段落后再补正文精确定位，A 不虚构正文 occurrence。

| ID | label / 发布方 | url | versionNote / 已读位置 |
|---|---|---|---|
| R24 | Warlock — D&D Beyond Basic Rules / Wizards of the Coast | https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock | 2024；Warlock Features、Pact Magic、Magical Cunning、Mystic Arcanum |
| R14 | Warlock — Basic Rules (2014) / Wizards of the Coast | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes#Warlock | 2014；Pact Magic、Spells Known、施法属性 |
| SPELL | Spellcasting rules / Wizards of the Coast | https://www.dndbeyond.com/sources/dnd/br-2024/spells | 2024；Preparing Spells、Spell Slots、Casting without Slots |
| CONC | Concentration / Wizards of the Coast | https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration | 2024；Concentration 正文 |
| EB | Eldritch Blast / Wizards of the Coast | https://www.dndbeyond.com/spells/2619161-eldritch-blast | 2024；元数据及规则正文，非评论 |
| HEX | Hex / Wizards of the Coast | https://www.dndbeyond.com/spells/2618988-hex | 2024；元数据及规则正文 |
| HP | Hypnotic Pattern / Wizards of the Coast | https://www.dndbeyond.com/spells/2619168-hypnotic-pattern | 2024；元数据及规则正文 |
| MS | Misty Step / Wizards of the Coast | https://www.dndbeyond.com/spells/2619133-misty-step | 2024；元数据及规则正文 |
| INV | Invisibility / Wizards of the Coast | https://www.dndbeyond.com/spells/2619116-invisibility | 2024；元数据及规则正文 |
| FLY | Fly / Wizards of the Coast | https://www.dndbeyond.com/spells/2618909-fly | 2024；元数据及规则正文 |
| CS | Counterspell / Wizards of the Coast | https://www.dndbeyond.com/spells/2619072-counterspell | 2024；元数据、反应触发条件、规则正文 |
| DM | Dispel Magic / Wizards of the Coast | https://www.dndbeyond.com/spells/2619103-dispel-magic | 2024；元数据及规则正文 |
| LIST | Warlock Spells / Wizards of the Coast | https://www.dndbeyond.com/spells/class/7-warlock | 混合版本官方数据库；浏览器实际读取 |

## 已核验主题事实

下表均属“主题知识”，可公开，适用角色为使用相应规则的 Warlock；不能把所有法术名称都当成免费全文。不得删掉版本、范围或条件。

| ID | 准确事实概括 | 来源 / 限制 |
|---|---|---|
| F01 | 2024 Pact Magic 法术位同环阶，短休或长休恢复。五级 Warlock 有两个三环法术位；用其施放一环法术也按三环。 | R24，Pact Magic；仅该特性，不概括多职业或其他施法来源 |
| F02 | 2024 五级的 Pact Magic 准备数为 6；三/七/九级分别有二/四/五环法术位，均为 2 个。 | R24，Warlock Features；额外总是准备的法术另计 |
| F03 | 2024 每升一个 Warlock 等级可替换准备清单的一项，并按表增加数量；“准备”不表示长休随意换整张清单。 | SPELL，Spell Preparation by Class；R24 |
| F04 | 2024 二级获得 Magical Cunning：花 1 分钟恢复至多最大 Pact Magic 位数的一半（向上取整），长休后才能再用。 | R24；不是战斗中的瞬间补位 |
| F05 | 2024 十一级起 Mystic Arcanum 分别在 11/13/15/17 级授予六/七/八/九环选择；每个以该方式施放后须长休恢复，不消耗法术位。 | R24；不要画成六至九环 Pact Magic 位 |
| F06 | 2014 使用 Spells Known；一级选两个一环法术，升级可替换一个合规已知法术；Pact Magic 也在短休/长休恢复。 | R14；与 2024 准备术语分开，不借新名称推导新更换频率 |
| F07 | 2014 Warlock 施法属性为 Charisma，法术攻击为熟练加值加魅力调整值，豁免 DC 为 8 再加两者。 | R14；不是武器攻击通用公式 |
| F08 | 戏法不消耗法术位；2024 已准备且带 Ritual 标签的法术可以多花 10 分钟以仪式施放而不耗位。 | SPELL；不要自动套回 2014 Warlock |
| F09 | 2024 开始施放另一项专注法术即结束原专注；受伤需体质豁免，DC 为 10 或伤害一半向下取整中的较大值，上限 30；失能或死亡也结束专注。 | CONC；只适用 2024，不能遗漏开始施放这一时点 |

## 已核验的 2024 法术候选

这些是事实材料库，非“最佳法术排名”；B 只应选择服务主任务的项目。下列八个在官方 Warlock 清单可用范围内，正文效果已打开核对。

| ID | 法术与可核对参数/条件 | 可支持的取舍（作者分析，非官方排名） |
|---|---|---|
| F10 / EB | 戏法；Action、120 ft.；每束独立远程法术攻击，命中 1d10 Force；角色等级 5/11/17 时为 2/3/4 束，可分配目标。 | 作为不耗位的常规攻击候选；不能把无位等同于无需攻击检定或自动命中 |
| F11 / HEX | 一环；Bonus Action、90 ft.、专注至多 1 小时；对该目标攻击检定命中额外 1d6 Necrotic，选定属性的能力检定劣势；目标降至 0 HP 后可在以后回合用 Bonus Action 换目标。二/三至四/五环以上最长分别 4/8/24 小时。 | 升环增加维持时长，不把 1d6 变成更多骰；能力检定劣势不能写成豁免劣势 |
| F12 / HP | 三环；Action、120 ft.、30 ft. Cube、专注至多 1 分钟；区域内能看见图案的每个生物进行 Wisdom 豁免，失败则 Charmed，同时 Incapacitated、Speed 0；受任何伤害或他者花动作摇醒即结束该目标效果。 | 群体控制候选；需要考虑同伴位置和后续伤害目标，不宜把此效果说成纯伤害增益 |
| F13 / MS | 二环；Bonus Action、自身、瞬间；传送至 30 ft. 内自己能看见的空位。 | 位移/脱离危险候选；本次正文没有升环增强条款，高环位仍有机会成本 |
| F14 / INV | 二环；Action、Touch、专注至多 1 小时；目标获得 Invisible，作攻击检定、造成伤害或施法后立即提前结束；每高于二环一环多一个目标。 | 潜入候选；不能保证隐匿检定成功，也不能说攻击后仍维持 |
| F15 / FLY | 三环；Action、Touch、专注至多 10 分钟；自愿目标获得 60 ft. 飞行速度且可悬浮；结束时仍在空中会坠落，除非能阻止；每高于三环一环多一个目标。 | 越障或空中移动候选；与攻击专注法术争夺同一个专注资源 |
| F16 / CS | 三环；Reaction；看见 60 ft. 内生物使用 V/S/M 成分施法时触发；目标作 Constitution 豁免，失败则法术无效并浪费原施法动作，若用了法术位则该位不消耗。 | 2024 不能写成升环自动打断；预留反应和法术位是有成本的选择 |
| F17 / DM | 三环；Action、120 ft.；结束目标上的三环以下持续法术，四环以上逐项作施法属性检定，DC 10+该法术环阶；使用更高环位会自动结束不高于所耗位环阶的法术。 | 与 Counterspell 的即时打断分工不同；升环有明确阈值收益，不能泛称消除一切魔法 |

## 分析判断与可用信息增益依据

- **G01 — 合法清单与选择动作之间的缺口。** 搜索前五的四个列表能查名字，但不能单独完成有限选择；论坛原问题明确担心升环价值和少量法术位。可以据 F01–F17 比较“哪一个解决当前队伍尚未解决的任务”，而非重复巨大名称表。此为分析，不声称所有读者都想要相同配表。
- **G02 — 升环收益不是单一伤害数字。** F11 是时长，F14/F15 是人数，F17 是自动解除的环阶阈值，F13 则未列增强；这些官方差别可以给真正的选择依据。示例计算：三环 Invisibility 可选两名目标；四环 Fly 可选两名目标。属于按已核验文本演算的示例，不是实战测试。
- **G03 — 两种预算。** F01 与 F09 说明“有两个位”不等于“能同时维持两个专注法术”；F11/F12/F14/F15 的并列给出具体冲突实例。不能替读者把整张准备清单都塞满同一类型选项。
- **G04 — 版本筛选直接影响选择。** 搜索官方列表的 Legacy 重复行、2014/2024 相关搜索，加上 F03/F06、F16，支持在使用建议前交代采用哪版；证据不支持把整篇写成历史版本百科。
- **G05 — 阶段性例子可以核算。** 五级 2024 的 6 项准备、2 个三环位，和三环控制/工具法术已核验，足够支持 B 判断是否聚焦一个等级段；A 不生成最终配表或规定章节。若 B 选择全等级/全部扩展书，需要再补证，不能称本材料覆盖全部。

## 产品事实、观察与网站关联

- 站点首页、英文博客首页及 Spells 分类已读取。站点为 DnD/VTT token 工具，博客明确服务桌游角色、法术与规则读者；读者相关性成立。
- 工具能否直接帮助“选 Warlock 法术”：本研究没有证据支持其能算伤害、自动配法术或校验角色合法性。**CTA 可为空**，不要硬塞 token 制作章节改变搜索意图。未做上传、导出或性能测试，不提供实测宣称。
- 本站冲突及近期标题见 `report.md`；旧正文只做必要的页面身份/主任务核对，不用作新文素材。

## 明确未核验与禁止外推

- Armor of Agathys、Hunger of Hadar 的现行单法术官方链接本次跳转购买页；只核验到 LIST 中名称和参数、职业表归属，未得到完整效果。不得从记忆补冷伤数值、黑暗/目盲细节或升环算法；若 B 必用，退 A 补查可公开一手来源。
- 未覆盖所有 Patron、Pact、Invocation、扩展书法术、SRD 所有变化、多职业优化或 2014 单法术全文。只将已有来源条件用于它们确实支持的主张。
- 未取得 PAA，不生成假问题列表。没有做伤害模拟、游戏实测或排名实验；所有取舍意见必须保留条件。
- 研究与素材采取逻辑隔离；未验证操作系统读权限隔离；未读取验收样稿/历史参考作为素材。
