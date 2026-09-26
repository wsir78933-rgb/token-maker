# dnd warlock spells：独立中文研究证据

状态：**A-zh 研究完成，有明确验证限制；不是布局、正文、独立审稿或网站交付。**

日期：2026-09-26（Asia/Shanghai）。网站：<https://www.tokenmaker.one>。内容模式：content-only，简体中文。本任务唯一写入范围为 `editorial/dnd-warlock-spells/research/zh-CN/`。

真实身份：Run `run_39994fa3f53e`；Task `task_e555362d8c0d`；Dispatch `ctx_2db2cea67c00`；Codex Worker 会话终端 `term_68e30f8e-b825-4798-a7b5-c3f515b41687`。未另派 Agent，未兼任 B–F。浏览器为自有 ego-browser TaskSpace 24 / p1。详细查询、URL、失败与回读见 [search-sources.md](search-sources.md)。

已读规则：执行入口、01-统一工作流、03-博客页面生成整合研究部分、事实核验与公开引用、ego-browser 技能；按 live preamble 使用 Orca 通信。历史记忆仅快速检索确认无本次 warlock 资料，未采用其事实、样稿或旧结论；没有读取其他语言研究。隔离是任务边界与角色上下文约束，**没有验证底层文件读取权限隔离**。

## 语言、国家与本地表达

`locale=zh-CN`。用户未指定国家，本次采用 `country=CN` 作为简体中文国家偏好探索；Google URL 保留 `hl=zh-CN&gl=CN&pws=0`，但页脚“无法确定位置”。**PASS：参数和结果真实；UNVERIFIED：中国境内精确 SERP、台湾/香港等其他地区代表性、搜索量。** 不把简体语言自动等同中国居民，不把繁体页面自动等同台湾排名。

| 候选表达 | 真实依据 | 适用与风险 |
|---|---|---|
| DND 邪术师法术 | Q1 排首的灰机正文标题“邪术师法术 Warlock Spells”；知乎、百度正文也明确 Warlock | 最直接的法术查询表达，建议给 B 优先考虑；中文索引主要含旧版和扩展内容，不能省略版本。 |
| DND 契术师法术 | Q2 首条已读 Google Sites 明确“契術師 Warlock”；本站当前源码职业与 Hex 页使用简体“契术师” | 能维持本站用语一致，也确有外部中文对应；繁体原站不是简体地区搜索量证明。正文首次可同时说明邪术师/契术师对应 Warlock。 |
| DND 邪术师法术选择 | Q3 真实结果出现法术选择问题和构筑讨论；Q1 视频详情把菜刀与魔能爆分开 | 是候选任务表达，不是已证明高搜索量的精确匹配词。适合“如何挑一套法术”的读者动作；不得承诺通用最强排名。 |
| DND 邪术师法术位 | Q4 命中职业表、法术表以及已读专用角色表讨论；官方 O1/O2 可回答 | 是选择任务的重要前提；若独立扩成全套施法教程，会偏離主词。把可用法术、消耗次数和环阶混为一谈是本轮有证据的解释缺口。 |

“魔契师”确实出现在 Q2 搜索标题、Bilibili 相关推荐，但本次对应正文尚未核验，Q6 又遇 Google 验证，因此不把它列为已验证候选或宣称官方新译名。“术士”单独使用易与 Sorcerer 混淆；已读 Reddit 机翻把 Warlock 叫术士，不能采用其译名体系。所有译名都不声称为唯一官方中文译法。

## 候选主意图与信息增益（由 B 最终定案）

**候选 I1：为自己的 D&D 桌游 Warlock 查找可用法术，并选出适合当前等级与打法的一套法术。** 依据是 Q1 首条为逐环法术索引、Q3 有选法术问题、Q1 视频详情区分打法。推荐此候选，但“最优”必须依赖规则年份、DM 允许书目、打法与队伍需求；本轮没有证明所有中文检索者都想优化构筑。

候选 I2：弄清 Warlock 法术位如何工作并正确填入角色卡。依据是 Q4 与 Reddit 讨论的直接困惑；作为 I1 的必要子问题很强，独立成为全文主意图则会弱化 spells 的查找/选择需求。

候选 I3：查完整法术名称与环阶清单。依据是中简/繁两张索引；适合纯速查，若承诺“完整”需要先锁版本和授权书目，本次不能交付跨所有书籍的穷尽清单。

以下是研究判断，不是 B 的提纲或 C 的正文：

- **中文名字对回英文与规则年。** 灰机把 Hex 叫“脆弱诅咒”，本站已有页叫“巫术印记”；同一英文条目可以对齐，不能当两种法术。信息增益是减少查表错配，不是写一节译名史。
- **分清可用名单、法术位、专注和特殊来源。** 样本表格虽列数字，仍有读者提出施法资源问题。用官方允许条件支撑选择理由，比无条件强度榜更可验证。
- **解释为什么“同在名单”不等于“同场可同时维持”。** O3/O5/O8 能支持 Hex 与 Hypnotic Pattern 的专注取舍；是否选它们仍是场景分析。
- **把旧版宗主扩展列表与新版始终准备分开。** 同样 Fiend 名称下，2014 与 2024 获取方式不同；这是会直接改变选法术空间的差异，不只是年份免责声明。
- **表格中有 6–9 环不代表 Pact Magic 给了这些法术位。** O1 的 Mystic Arcanum 可解释高环使用方式；如果 B 选择新手低等级范围，只需短说明，不因此自动展开高等级法术排行。
- 可以作准确图解的已核验关系是“专注切换”“一个法术位的消耗”“30 英尺立方的目标限制”。这些只是证据可支撑的视觉含义，图位、数量、布局和实际图稿属于后续角色。

## 已核验事实表

所有下列事实核验日期均为 2026-09-26，允许以自己的措辞公开并附直接来源；适用地区为桌游规则本身，无国家差异主张。未形成正文，因此“对应段落”统一为**待 B/C 分配，不能伪造段落定位**。来源 ID 对应搜索来源记录中的直接公开链接和证据位置。

| ID | 类型 / 适用版本 | 可使用的准确结论 | 来源与边界 |
|---|---|---|---|
| ZF01 | 主题知识 / 2024 | Pact Magic 法术位同环；短休或长休恢复。5 级 Warlock 有两个 3 环位。 | O1，Pact Magic 与职业表；不推广为兼职业角色的所有法术位。 |
| ZF02 | 主题知识 / 2024 | 1 级有两项准备法术；升级时可换一项；其他特性给的始终准备法术不占此名额。 | O1，Prepared Spells；不能把 prepared 理解为每次长休自由重选全部。 |
| ZF03 | 主题知识 / 2024 | 2 级 Magical Cunning 花 1 分钟，最多恢复法术位上限的一半、向上取整；长休恢复此能力使用。 | O1；它不是短休，也非每场战斗免费恢复。 |
| ZF04 | 主题知识 / 2024 | 11/13/15/17 级分别取得 6/7/8/9 环玄奥秘法，各不用位施放一次，长休恢复。 | O1，Mystic Arcanum；不称为同环的高环 Pact Magic 法术位。 |
| ZF05 | 主题知识 / 2014 对照 2024 | 2014 Fiend 扩展可选列表；2024 Fiend 对应等级的宗主法术始终准备。 | O2 Expanded Spell List；O1 Fiend Spells。两个表的条目也不能直接混抄。 |
| ZF06 | 主题知识 / 2024 | Hex：1 环、附赠动作、90 英尺、专注最多 1 小时；攻击检定命中该目标加 1d6 黯蚀伤害；选定属性的属性检定劣势。 | [O3](https://www.dndbeyond.com/spells/2618988-hex)。不是该属性豁免劣势；不是所有伤害都触发。 |
| ZF07 | 主题知识 / 2024 | Hex 用 2 环位可专注最多 4 小时，3–4 环位 8 小时，5 环以上 24 小时；文本没有增加这项 1d6。 | O3，Using a Higher-Level Spell Slot；不把升环延时改写成额外伤害提高。 |
| ZF08 | 主题知识 / 2024 | Eldritch Blast：动作、120 英尺、远程法术攻击，单束命中 1d10 力场；5/11/17 级分别 2/3/4 束，每束独立攻击，可分配目标。 | [O4](https://www.dndbeyond.com/spells/2619161-eldritch-blast)。本次核验的是 2024 可指生物或物体的文本；伤害骰不自动含魅力加值。 |
| ZF09 | 主题知识 / 2024 | Agonizing Blast 是祈唤：Warlock 2 级起，选择已知的有伤害 Warlock 戏法，把魅力调整值加入该法术伤害掷骰。 | O1，Agonizing Blast。不是所有 Warlock 自动获得，也不是所有法术的被动加值。 |
| ZF10 | 主题知识 / 2024 | Hypnotic Pattern：3 环、动作、120 英尺、30 英尺立方、专注最多 1 分钟；范围内能看见图纹者做感知豁免，失败魅惑，受此魅惑时失能且速度 0；受伤或别人用动作摇醒可解除。 | [O5](https://www.dndbeyond.com/spells/2619168-hypnotic-pattern)。原文不是只写敌人；应考虑队友。未写每回合重复豁免。 |
| ZF11 | 主题知识 / 2024 | Misty Step：2 环、附赠动作、立即生效；传送最多 30 英尺到可见且未被占据的空间；不需要专注。 | [O6](https://www.dndbeyond.com/spells/2619133-misty-step)。不由此推演未核验的穿窗/全掩护争议。 |
| ZF12 | 主题知识 / 2024 | Counterspell：3 环、反应、60 英尺；看到范围内生物以语言、姿势或材料成分施法时触发。目标体质豁免失败则施法无效，施法所用动作等浪费；若原法术用位施放，该位不消耗。 | [O7](https://www.dndbeyond.com/spells/2619072-counterspell)。不可套旧版低环自动反制的结算。 |
| ZF13 | 主题知识 / 2024 | 开始施放另一个需专注的法术，原专注立即结束；受伤需体质豁免维持，DC 为 10 与伤害一半向下取整的较大者，上限 30；失能或死亡也终止。 | [O8](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration)。只声称 2024 这段，不把 DC 上限等细节外推旧版。 |
| ZF14 | 实际观察 / 本次中文样本 | Hex 的中文名存在“脆弱诅咒”和本站“巫术印记”两种；Warlock 有邪术师与契术师对应。 | Q1 灰机正文、Q2 Google Sites、本站已读页面与源码；属于译名观察，不是官方翻译认证。 |
| ZF15 | 工具事实 / 本次官网自述 | Token Maker 首页说明可把角色图裁切、加框并导出 PNG；中文博客覆盖 DnD 法术/职业读者。 | [官网](https://www.tokenmaker.one/zh)与[博客](https://www.tokenmaker.one/zh/blog)。未实测功能，也不能证明工具能选法术、算伤害或自动同步 VTT 状态。 |

**示例推理，不能伪称实测：**依据 ZF01、ZF06、ZF10、ZF13，假定一个 5 级 2024 单职业 Warlock 用一个 Pact Magic 位施放 Hex，再用另一个位施放 Hypnotic Pattern，则两位均已消耗，开始第二个专注法术时 Hex 终止。该例不说明每次都应这样做，只适合演示资源与专注是两件事。

**场景建议，不能归给官方：**如果读者主要用远程戏法攻击，ZF08 是持续攻击选项的依据；若队伍需要暂时控制多个可受魅惑且能看见图纹的目标，ZF10 可作为比较对象；需要退出危险位置时，ZF11 是另一种需求。不能从这些规则得出无条件“必选前三”或未经计算的每轮伤害优势。

## 公开引用交接候选

以下为可复用的 PublicReference 候选；不是已绑定正文的冻结交接。C 用到哪个主张，就把直接链接放在相应论断附近，并在正文形成后补精确 quote/occurrence。不公开研究排名、内部 Task ID、失败日志或私有路径。

| id | label | url | appliesTo | versionNote |
|---|---|---|---|---|
| zh-warlock-2024 | D&D Beyond：2024 Warlock 规则 | https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock | ZF01–05、ZF09 中新版部分 | 2024 修订规则 |
| zh-warlock-2014 | D&D Beyond：Warlock 旧版规则 | https://www.dndbeyond.com/classes/7-warlock | ZF05 旧版部分 | Legacy/2014 |
| zh-hex-2024 | D&D Beyond：Hex | https://www.dndbeyond.com/spells/2618988-hex | ZF06–07 | 2024 |
| zh-eldritch-blast-2024 | D&D Beyond：Eldritch Blast | https://www.dndbeyond.com/spells/2619161-eldritch-blast | ZF08 | 2024 |
| zh-hypnotic-pattern-2024 | D&D Beyond：Hypnotic Pattern | https://www.dndbeyond.com/spells/2619168-hypnotic-pattern | ZF10 | 2024 |
| zh-misty-step-2024 | D&D Beyond：Misty Step | https://www.dndbeyond.com/spells/2619133-misty-step | ZF11 | 2024 |
| zh-counterspell-2024 | D&D Beyond：Counterspell | https://www.dndbeyond.com/spells/2619072-counterspell | ZF12 | 2024 |
| zh-concentration-2024 | D&D Beyond：专注规则 | https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration | ZF13 | 2024 |

## 交给后续角色的边界

- 中文研究样本主体为旧版社区材料；采用 2024 主线是依据已核验新版规则的编辑选择，不得包装成“中文搜索结果都偏好 2024”。若 B 选 2014 主线，必须补齐相应版本的单法术正文证据，不能直接复用本表新版参数。
- 主词是 Warlock 的 spells；完整职业、兼职业伤害优化、宗主世界观、BG3 构筑和 Token 教程是其他任务。本站相关性成立不等于必须塞入 CTA。
- 已有 Hex/Counterspell 页与本题在“选一套法术”层面可区分；只在必要时链接单法术深解，勿重复其整体内容。源码/当时 sitemap 未找到同主题 Warlock 专页，只作有限范围无直接冲突判断。
- Armor of Agathys、Hunger of Hadar 的官方独立正文未取得；其他未列法术的效果、高环强度、所有宗主/扩展许可均未核验。需要它们就向 A 补证，不让 C 靠记忆补写。
- 不编造 PAA、搜索量、当地读者比例、经验反馈、视频全文内容或图片。未制作图稿、布局、大纲、正文或 SEO 标题。

## A 阶段验收

| 项目 | 结论 | 证据 |
|---|---|---|
| 独立中文研究与四个真实表达候选 | PASS | 自有浏览器查询、已读中文正文、本站用语对照；无英文研究输入 |
| 主查询前五可访问网页自然结果 | PASS | 灰机法术表、知乎、Reddit、灰机职业页、百度百科最终均正文可读；视频模块另外记录，全文未观看 |
| 国家/语言分别记录，参数真实 | PASS | Q1 URL 与页脚；精确地理定位另列 UNVERIFIED |
| 官方一手规则逐条对应 | PASS（本表范围） | O1–O8；无法核验独有法术明确排除 |
| 网站/已有页/最近标题核对 | PASS（限定范围） | 首页、中文列表、两个相关页、182 项 sitemap、只读源码 |
| 精确中国境内排名 / PAA / 搜索量 / 视频全部内容 | UNVERIFIED | 不影响候选证据交接，不用模型补造 |
| 布局、成稿、媒体、独立审核、网站页面 | 未执行 | 不属于本角色授权 |

命令、真实退出码、输出要点和文件验证见 [validation.md](validation.md)。
