# dnd warlock spells：简体中文 B 阶段布局任务卡

> 状态：B-zh 布局完成，交给 C-zh 写作；本文件是编辑任务卡，不是正文、SEO 成稿、独立审核或网站交付。
>
> 本卡只为一个读者任务服务：让读者在确认规则版本、DM 允许的来源、Warlock 职业等级和自己的战斗任务后，选出一套可回查、可解释、不会把资源栏混在一起的法术。它不承诺“最强法术”，不制作跨版本穷尽清单，也不把产品需求添加到搜索意图中。

## 1. 身份、输入与读取边界

- Run：run_39994fa3f53e
- B Task：task_2859004e2a04
- B Dispatch：ctx_2787ecd8be1c
- B Worker terminal：term_e0e913cf-c68c-483f-a7a9-605f8a3a21eb
- B Codex session：01a0dbba-fcec-75f2-86e1-f102ad80d2f4
- Coordinator terminal：term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10
- 网站：<https://www.tokenmaker.one>
- 模式：content-only；只交付英文与简体中文的编辑材料，不写入网站，不装配页面。
- 本卡语言：locale=zh-CN；用户没有指定国家，不能把中文自动写成某个国家的精确 SERP。
- 原始关键词（必须保留英文原文）：dnd warlock spells
- 允许读取：用户原始要求、research/zh-CN/evidence.md、research/rules/、research/site/site-context.md、V7 的 执行入口.md、01-统一工作流.md、02-内容生产与质量门.md、03-博客页面生成整合.md 及本阶段事实核验/公开引用规则。
- 未读取：其他语言布局或正文、验收样稿、历史参考素材；没有把其他语言的搜索排名、例子或正文迁移到本卡。
- 本卡不写正文；C 只能依据本卡和已核验事实写读者稿，不能用记忆补齐研究交接中标明的缺口。

## 2. 语言表达与版本决定

### 中文主表达

- 主表达：**DND 邪术师法术**。DND 契术师法术作为可回查的同义入口在首次解释中出现一次；不声称“邪术师”“契术师”“魔契师”有唯一官方中文译名。
- 英文实体名在中文正文中保留，尤其是 Warlock、Pact Magic、Prepared Spells、Hex、Hellish Rebuke、Misty Step、Hypnotic Pattern、Counterspell、Eldritch Blast。中文名与英文名对不上时，读者应以英文名回查规则条目。
- Hex 的中文译名在中文样本和本站既有页中不一致；正文只把它作为英文规则名和选法术案例，不写译名认证或译名史。

### 主线版本

- **主线选 2024 修订规则**，以 D&D Beyond 的 br-2024 Warlock 职业页和 SRD 5.2.1 的已核验法术正文为事实基线。
- **2014/Legacy 只在会改变选择动作的地方对照**：2014 使用 known spells 的表述，2024 职业表使用 Prepared Spells；2014 的 Bonus Action 施法限制与 2024 的“每个 turn 只能消耗一个法术位施法”也不同。两版不能把职业表、法术效果和施法限制交叉拼接。
- 读者不知道 DM 使用哪一版、允许哪些书时，完成标志不是“先给一套推荐”，而是先锁版本和允许来源；没有这两个条件，文章中的选择示例只能作为 2024 示例，不能冒充通用答案。
- 2024 是编辑主线的选择，不是“中文搜索者都偏好 2024”的结论；精确国家/地区 SERP 未验证。

## 3. 唯一主意图与 ReaderTask

### 主关键词

- 原始主关键词：dnd warlock spells。
- 中文主表达：DND 邪术师法术；DND 契术师法术只作为首次解释时的可回查变体，不替换原始英文关键词。

### 读者已有条件

- 读者正在创建或调整一个桌面 D&D Warlock 角色，至少能取得 Warlock 职业等级、角色卡上的法术栏和 DM 的允许来源；如果还没有角色卡，正文先让他按 2024 主线建立这三个输入，不假定他已经知道法术位规则。
- 读者不必先懂英文规则或知道每个法术的最佳用法；正文会保留英文法术名并把关键动作、距离、专注和目标限制写成可检查字段。
- 读者是在桌面 D&D 规则语境中查找/选择法术，不是 BG3、其他电子游戏、兼职业优化或自创规则。

### 范围边界

- 纳入：2024 基础 Warlock 的版本确认、准备数量、Pact Magic 槽、戏法/专注/动作经济，以及能够支持选择的少量法术案例；2014 只做会改变选择的局部对照。
- 不纳入：全书法术穷举、所有扩展书、所有子职业、兼职业、伤害模拟、DPR/胜率、BG3、完整职业创建、VTT 同步、Token Maker 操作、最终 SEO 和网页装配。
- “列表”“法术位”“法术选择”是完成一个选择任务的必要子问题，不另起全文覆盖它们的独立搜索意图。

### 主导搜索意图

**选择型指南意图：** 读者搜索 dnd warlock spells，实际要从 Warlock 法术列表中找出当前角色能用、并且符合自己战斗任务的一套法术；他需要知道先核对什么、哪些资源不能混淆、如何用条件和限制排除不合适的候选。

这不是以下意图：

- 不是完整 Warlock 法术字典或所有书目/扩展的穷尽清单；
- 不是“Best Warlock Spells”无条件排名；
- 不是整篇讲法术位、整套职业创建、兼职业或 BG3；
- 不是 Token Maker 教程，也不是用图片编辑器自动选法术。

### 最强证据

- 官方 2024 Warlock 职业表同时给出 Prepared Spells、Pact Magic 槽数量/环阶、Magical Cunning 和 Mystic Arcanum；它能直接支撑“准备数量、槽数量、槽环阶不能混成一个数字”这一核心判断。
- 官方 2024 法术与 Concentration 正文能支撑 Hex、Hellish Rebuke、Misty Step、Hypnotic Pattern、Counterspell 的动作、距离、目标和专注边界；这些字段能直接转成工作位矩阵和三个分级例子。
- 当日 Bing 的原始关键词与中文变体真实结果同时出现法术列表、选择/构筑讨论、法术位问题和视频，因此“列表查找 + 选择动作 + 资源前提”是有搜索形态依据的组合；它不构成规则证据，也不构成精确地区排名。

### 必要子问题

只纳入完成 ReaderTask 必需的五个子问题：

1. 2014/Legacy 与 2024 应先锁什么，中文译名不一致时怎样回查英文名？
2. 当前 Warlock 等级的准备数量、Pact Magic 槽数量/环阶、戏法和 Mystic Arcanum 怎样分栏？
3. 法术的持续、反击、位移、控场和反制工作位分别要看哪些动作、距离、目标与专注条件？
4. 在 1/3/5 级示例中，怎样把候选压成一套并解释取舍，而不是给无条件排名？
5. 开团前如何处理版本、DM 书目、槽数、专注和中文名对不上等失败分支？

### ReaderTask（正文必须可执行）

读者看完后，能够按以下顺序完成一次选择：

1. 在角色卡或 DM 约定中确认 2014/Legacy 还是 2024，并确认可用书目；不确定时停止混抄。
2. 写下 Warlock 职业等级、准备/已知栏位和 Pact Magic 槽数量与环阶；把戏法、准备法术、法术位、11 级后的 Mystic Arcanum 分开。
3. 先决定本轮需要的法术工作位：持续单体、受伤反击、位移、反应打断、范围控场等；再用施法时间、距离、目标条件和专注标记过滤候选。
4. 留下至少一个主要专注工作、一个非专注补位或反应工作，并检查同一施法者不能同时维持两个专注法术。
5. 用“版本、允许来源、等级、准备数量、槽环阶、动作经济、专注、射程/目标”清单回算，而不是照抄“最强榜”。

### 完成标志

- 能说出自己使用的规则版次和 DM 允许来源。
- 能在一个小表中分别填出准备/已知数量、Pact Magic 槽数量、槽环阶和戏法，不把它们当成同一个数字。
- 能为每个保留的法术写出“它承担的任务”和至少一个会让它失效或不合适的条件。
- 能解释一个具体冲突：例如同一施法者先维持 Hex，再开始 Hypnotic Pattern，后者开始时前者专注结束；因此不能把两个专注法术当成同时在线的两项效果。
- 能在开团前得到一套有取舍的 2024 示例，而不是只得到法术名称堆。

## 4. 真实搜索与主意图依据

### 搜索记录

- 日期：2026-09-26（Asia/Shanghai）。
- 提供方：本 Worker 专用本地 ego-browser，Bing 网页搜索；TaskSpace 30，Page p1。
- 参数：Bing 查询均使用 setlang=zh-cn&cc=cn。这是真实参数回读，不等于中国境内精确排名。
- Google 同日尝试 hl=zh-CN&gl=CN&pws=0，实际进入 Google reCAPTCHA/异常流量页；没有绕过验证，也没有把 Google 结果伪写成已取得。
- 结论：中文候选表达和结果形态有真实搜索依据；Google 中国精确 SERP、搜索量、代表性和排名稳定性均 **UNVERIFIED**。

| 实际查询 | 可回读结果形态 | 对布局的有效依据 |
|---|---|---|
| [dnd warlock spells](https://www.bing.com/search?q=dnd%20warlock%20spells&setlang=zh-cn&cc=cn) | 第一屏同时出现法术列表/索引、D&D Beyond Warlock Spells、以“Best”为导向的指南、法术位视频；相关搜索出现 dnd warlock spells list、dnd 5e warlock spells、dnd warlock spells best。 | 主词混合了“查列表”和“怎么选”；文章应选定选择型主任务，用列表事实支持选择而不拼成全量百科。 |
| [DND 邪术师法术](https://www.bing.com/search?q=DND%20%E9%82%AA%E6%9C%AF%E5%B8%88%E6%B3%95%E6%9C%AF&setlang=zh-cn&cc=cn) | 可见灰机的“邪术师法术 Warlock Spells”、职业页、中文法术列表和玩家讨论。 | “邪术师法术”是最直接的中文查表表达；正文首段把它与英文 Warlock 对齐。 |
| [DND 邪术师法术选择](https://www.bing.com/search?q=DND%20%E9%82%AA%E6%9C%AF%E5%B8%88%E6%B3%95%E6%9C%AF%E9%80%89%E6%8B%A9&setlang=zh-cn&cc=cn) | 可见构筑/技能选择讨论、法术列表、职业指南和中文规则页。 | “选择”是可观察的读者动作；可写按等级、角色任务、专注与资源做取舍，但不能升格为有统一答案的强度榜。 |
| [DND 邪术师法术位](https://www.bing.com/search?q=DND%20%E9%82%AA%E6%9C%AF%E5%B8%88%E6%B3%95%E6%9C%AF%E4%BD%8D&setlang=zh-cn&cc=cn) | 可见职业页、法术列表、法术位回复和“短休能回吗”的讨论。 | 法术位是选择任务的必要前提；只解释会改变选法术的槽数量、槽环阶和回复方式，不扩写成独立施法教程。 |
| [DND 契术师法术](https://www.bing.com/search?q=DND%20%E5%A5%91%E6%9C%AF%E5%B8%88%E6%B3%95%E6%9C%AF&setlang=zh-cn&cc=cn) | 可见“魔契师法术列表”、称为“契术师/邪术师”的中文百科、繁体“契術師 Warlock”等混合表达。 | 需要在正文首次保留英文名，避免中文译名差异导致查表错配；不把搜索结果中的第三方译名当官方翻译。 |

前五/第一屏只是当日 Bing 结果的观察，不是规则证据。规则事实一律回到下表的官方来源；搜索摘要、论坛、BG3 或第三方攻略不能支持职业规则。

## 5. 文章类型与正文结构

文章类型：**选型/决策指南**，带一个小型资源核对表、一个按任务选择的候选矩阵和三个带限制的工作示例。正文不写成法术百科，不列所有环阶，不在末尾追加泛泛 FAQ。

临时工作题（仅供编辑定位，不能视为 F 阶段最终 Title/H1）：**DND 邪术师法术：先锁版本，再按等级和战斗任务挑一套**。

### 开头：先给答案和前提

- 前三句先说：没有脱离版次、等级和队伍需求的“通用最佳法术表”；先锁 2014/2024 与 DM 允许来源，再按 Warlock 等级和战斗任务选择。
- 直接告诉读者本卡以 2024 为主线；如果手里的资料是 2014/Legacy，先进入版本分流。
- 开头不放产品介绍，不放“随着科技发展”式铺垫，不把搜索过程写给读者。

### H2 一：先锁规则版本、允许书目和中文对应

必要动作：

- 让读者先写下 2014/Legacy 或 2024，再写 DM 允许的来源范围。
- 用一句有证据的对照说明：2014 的 known spells 与 2024 的 Prepared Spells 表述不同；2024 也不是每次长休都把整张职业表自由重选。
- 第一次出现时写“邪术师/契术师（Warlock）”，之后优先用 Warlock；Hex 等法术保留英文名。

必要限制：

- 不要用 2024 法术正文去填 2014 缺口，也不要把旧版 Bonus Action 规则写成新版“每回合只能施一个法术”。
- 未确认 DM 书目时，不把子职业扩展列表当成全体 Warlock 通用名单；Fiend 的 2014/2024 获取方式有版本差异。

删掉影响：删除本节后，读者无法判断“可选”来自哪一版，也无法解释中文名称与英文条目不一致，ReaderTask 不能合法开始。

### H2 二：把准备数量、法术位、戏法和玄奥秘法分开

用一张简短表展示 2024 主线的三个检查点（数字来自官方职业表，不写成“最佳等级”）：

| Warlock 职业等级 | Prepared Spells 数量 | Pact Magic 槽 | 每槽环阶 | 本节给读者的判断 |
|---:|---:|---:|---:|---|
| 1 | 2 | 1 | 1 环 | 两个准备名额不等于同时拥有两个法术位；需要按任务选一攻一应急，或按 DM 允许清单替换。 |
| 3 | 4 | 2 | 2 环 | 可以增加位移/控场工作，但两个槽仍要按一次遭遇的取舍使用。 |
| 5 | 6 | 2 | 3 环 | 可以纳入三环控场或反应法术；槽数量与准备数量仍是两栏。 |

配套解释：

- Pact Magic 槽是同环阶；完成短休或长休恢复已消耗的 Pact Magic 槽。5 级示例用两个 3 环槽，不把它写成“拥有两个三环法术”。
- 2024 的 Magical Cunning 是 2 级起用 1 分钟、最多恢复最大槽数一半并向上取整的已消耗槽；长休后才能再用。它不是战斗中自动刷新，也不是 Mystic Arcanum。
- 11/13/15/17 级的 Mystic Arcanum 要另列；它是不消耗法术位、各自长休恢复一次的高环能力，不当作 6–9 环 Pact Magic 槽。
- 戏法（尤其 Eldritch Blast）不消耗法术位；不能把戏法数量、准备数量和槽数量相加。

删掉影响：删除本节后，读者会把“准备 6 个”“有 2 个槽”“每槽 3 环”误读成同一资源，无法完成选型或回算例子。

### H2 三：按法术工作位筛选，不先背“最强列表”

正文用下表做可执行矩阵；候选是“承担某种工作”的核验案例，不是无条件排名：

| 读者工作位 | 2024 候选 | 读者要核对的事实 | 明确边界 |
|---|---|---|---|
| 持续单体压力/属性检定干扰 | Hex | 1 环、附赠动作、90 英尺、专注至多 1 小时；命中目标时的额外伤害与属性检定劣势要分开写。 | 需要专注；升环只改变持续时间，不凭此写成额外 1d6。 |
| 受伤后的反击 | Hellish Rebuke | 1 环、Reaction、60 英尺；触发条件是受到 60 英尺内可见生物的伤害；无专注。 | 不是任何受伤都自动可用；会占用 Reaction。 |
| 退出危险位置 | Misty Step | 2 环、附赠动作、最多 30 英尺；目的地须可见且未被占据；无专注。 | 不是带队友传送，也不能因 Pact 槽更高就擅自增加距离。 |
| 范围控场 | Hypnotic Pattern | 3 环、Action、120 英尺、30 英尺立方、专注至多 1 分钟；看到图案的每个生物都需考虑。 | 不能写成只影响敌人；受伤或别人用 Action 摇醒可解除。 |
| 对施法反应 | Counterspell | 3 环、Reaction、60 英尺；2024 结算是目标作 Constitution save，不能套旧版低环自动反制。 | 2024 的同一 turn 法术位限制要单独核对；被反制者的槽不消耗不能写成反制者不消耗。 |
| 不占槽的持续输出基线 | Eldritch Blast | 戏法、Action、120 英尺；每束独立远程法术攻击，角色等级 5/11/17 级为 2/3/4 束。 | Agonizing Blast 是祈唤，不是戏法自带；不要把多束写成一次 2d10 命中。 |

必要的规则连接：

- Hex、Hypnotic Pattern 等都需要专注；同一施法者不能同时维持两个专注法术。选择“一个主要专注工作”比把专注法术全塞进准备栏更可执行。
- 2014 的 Bonus Action 施法限制与 2024 的“一回合只能消耗一个法术位施法”不是同一句规则；例子必须标明版次。
- Action、Bonus Action、Reaction 是不同资源栏；矩阵中的动作名不能只当作标签，必须用于判断同一回合能否完成动作。

删掉影响：删除本节后，文章退化成法术名称列表，读者看不到为何保留某个候选，也无法根据队伍需求更换法术。

### H2 四：用三个有前提的选择例子压成一套

这些是写作必须落实的“方法演示”，不是排行榜；每个例子必须同时写输入、取舍和限制。

#### 例子 A：1 级，只有一个 1 环 Pact Magic 槽

- 输入：2024、Warlock 1 级、DM 允许基础来源；准备栏有 2 个位置，Pact Magic 有 1 个 1 环槽。
- 选择演示：把 Hex 作为持续单体/属性检定工作，把 Hellish Rebuke 作为受伤后的 Reaction 工作；不是说两者永远都应选，而是让读者按“我是否需要专注持续工作”与“我是否经常在 60 英尺内挨打”做取舍。
- 限制：准备 2 个名字不等于能同时施放 2 次；一个槽的使用次数要单独计算，Reaction 也可能已经被别的规则占用。

#### 例子 B：3 级，加入位移或单目标控场

- 输入：准备数量为 4、2 个 2 环 Pact Magic 槽；已确认 DM 允许所选法术。
- 选择演示：若队伍常需要脱离近身，保留 Misty Step；若需要控制 Humanoid，才比较 Hold Person；若用 Hex，就把它标成专注主位，不能与另一个专注法术同时维持。
- 限制：Misty Step 的 30 英尺目标空间必须可见且未被占据；Hold Person 需要目标是 Humanoid、可见并通过/失败 Wisdom save 的规则分支，不能把“长得像人”当成生物类型。

#### 例子 C：5 级，三环槽与范围控场

- 输入：准备数量为 6、2 个 3 环 Pact Magic 槽；仍以 2024 为主线。
- 选择演示：Hypnotic Pattern 可承担范围控场，Counterspell 可承担 Reaction 反制，Misty Step 可承担位移，Eldritch Blast 作为不占槽的戏法基线；需要持续单体工作时，再把 Hex 与范围控场的专注取舍写清。
- 限制：Hypnotic Pattern 的 30 英尺立方可能包括队友，受伤或用 Action 摇醒可解除；不能把“控场”写成保证命中或永久锁定。2024 同一 turn 的法术位限制也不能被“有两个槽”绕过。

删掉影响：删除本节后，ReaderTask 只剩抽象筛选步骤，没有输入、动作、可观察条件和失败分支；2000 合格单位也会被迫用百科背景或泛泛推荐填充。

### H2 五：开团前核对表与分支处理

正文结尾落到一张短核对表：

1. 规则年份：2014/Legacy 或 2024；DM 允许哪些来源？
2. Warlock 职业等级：准备/已知数量是多少？
3. Pact Magic：有几个槽、每槽是什么环阶；是否把短休/长休恢复写对？
4. 每个候选法术：需要什么 Action、距离、目标条件、Reaction 或 Bonus Action？
5. 专注：准备栏中有几个专注法术？本次实际工作只保留一个主要专注位。
6. 版本特殊分支：2014 的 Bonus Action 规则、2024 的单回合槽限制是否被混写？
7. 中文名不确定：回到英文名和同版本官方来源，不根据第三方译名猜测。

分支处理：

- 版次不明：停在版本确认，不给跨版“通用答案”。
- 允许书目不明：先问 DM；子职业扩展列表不自动变成全体 Warlock 通用名单。
- 槽数对不上：重新按 Warlock 职业等级核对，不用总角色等级或准备数量替代。
- 两个候选都需要专注：选择主要工作，另一个只能作为替换方案，不能写成同时维持。
- 法术名称/中文名对不上：用英文名、环阶、施法时间和版本回查；不编译名。

删掉影响：删除本节后，读者不能把文章方法迁移到自己的角色，也没有发现版本、书目、槽位和专注冲突的停止条件。

## 6. 可验证的信息增益

本篇必须把增益落到正文材料，不用“更全面”“更适合新手”这种不可核验的话：

1. **版本先行的过滤器**：把 2014/2024 的差异放在选择之前；读者先知道哪些规则可直接使用，减少中文旧资料与新版职业表混读。
2. **三栏资源核对表**：用 1/3/5 级具体数字同时显示准备数量、槽数量和槽环阶；每个数字都能回查官方 Warlock 表，读者能判断“我能准备什么”和“我现在有几次施法”不是一个问题。
3. **工作位矩阵**：把持续单体、反击、位移、控场、反制和戏法映射到施法时间/距离/专注等条件；读者可按队伍需要换候选，而不依赖无条件强度榜。
4. **专注冲突的演示**：用 Hex 与 Hypnotic Pattern 的先后施放说明“同名单不等于同场同时有效”，并把“受伤/摇醒可解除”放在控场候选附近。
5. **三个分级例子**：1 级只处理一个槽与两个准备名额，3 级加入位移/目标限制，5 级加入范围控场/反制；每个例子都给前提、取舍和失败分支，不能靠复制法术描述凑长度。
6. **可迁移核对表**：将“版次、DM 来源、职业等级、槽环阶、动作经济、专注和目标条件”变成读者可以在角色卡旁逐项填写的检查动作。

长度策略：中文正文最终至少达到 **2000 个合格汉字单位**；标题、目录、H1/H2/H3、FAQ、来源清单、CTA、URL、图注、alt、元数据不计。达到长度只能依靠上述表格旁的解释、三个带限制的选择例子、版本分支和读者可执行检查，禁止重复定义或扩写完整法术百科。若已核验材料不足以支持自然的 2000 合格单位，应退回 B/A 缩小承诺或补证，不用空话凑数。

## 7. 工具关联、内链与 CTA

- 工具的自然使用位置：**无**。
- 原因：Token Maker 官网已核验的是角色图制作、裁切、加框和导出 PNG；没有证据表明它能选 Warlock 法术、计算槽位、验证角色卡或同步 VTT 状态。把图片编辑器硬塞进法术选型会改写 ReaderTask。
- 本篇不加 CTA，不为凑转化添加 token 制作分支。
- 如 C 确实使用站内单法术页，只允许在读者已经做出法术选择、且该页能帮助核对同一法术时使用自然补充链接；当前任务卡不要求内链。最接近的 /zh/blog/dnd-hex 是 Hex 单法术页，不能让新文重复成 Hex 专文。

## 8. 图文布局计划

正文必须有至少一张服务主意图的随文图；封面（如后续页面需要）不算这张图。只写计划，不在本 Task 生成媒体。

### 图位 G1：版本—资源—工作位选择流程图

- 放置：H2 二“资源分栏”表之后、H2 三“工作位矩阵”之前；读者先看清资源，再沿箭头选择工作位。
- 媒体路径：../../media/zh-CN/spell-choice.webp，相对于 drafts/zh-CN/body.md。
- 形式：V 用可控的矩形节点、箭头和短标签绘制一张 1600×900 的扁平示意图，再导出 WebP；不用 AI 生成角色插画，不冒充游戏截图，不画未核验的范围形状。
- 精确图意：从左到右四段，顺序不可交换：
  1. **锁版次**：2024 主线；2014/Legacy 只在对应分支核对；下方小字“先问 DM 允许来源”。
  2. **看等级与资源**：三个等宽节点，文字必须逐字可读：1级：准备2｜1个1环槽；3级：准备4｜2个2环槽；5级：准备6｜2个3环槽。这三个数字只代表 2024 Warlock 基础表。
  3. **选工作位**：五个分支标签：持续单体：Hex｜专注；受伤反击：Hellish Rebuke｜Reaction；位移：Misty Step｜Bonus Action；范围控场：Hypnotic Pattern｜专注；施法反应：Counterspell｜Reaction。
  4. **最后核对**：同一施法者不能同时维持两个专注法术；2024 同一 turn 只能消耗一个法术位施法；查距离、目标、动作。
- 图中不得出现：Best、必选、最高伤害、未经核验的百分比、整张法术表、第三方排名、中文官方译名断言、Token Maker CTA。

### 图中文字的逐条事实与来源

| 图中文字/节点 | 事实边界 | 公开来源 |
|---|---|---|
| 2024 Warlock 1/3/5 级的准备数量 2/4/6 | 这是 2024 基础 Warlock 表；不能外推到多职业、额外来源或 2014 术语。 | [D&D Beyond 2024 Warlock](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock)，对应 Warlock Features / Pact Magic；事实卡 R01、R02。 |
| 1/3/5 级 Pact Magic 槽为 1×1 环、2×2 环、2×3 环 | “职业等级”是 Warlock 等级；同环阶，不含 Mystic Arcanum、多职业或物品槽。 | [D&D Beyond 2024 Warlock](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock)，对应职业表；事实卡 R01。 |
| Hex 为持续单体/专注案例 | 2024：1 环、Bonus Action、90 英尺、专注至多 1 小时；升环条款只改变持续时间，不在图中承诺伤害增加。 | [D&D Beyond Hex](https://www.dndbeyond.com/spells/2618988-hex)；[SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140)，事实卡 F02。 |
| Hellish Rebuke 为受伤后的 Reaction 案例 | 1 环、Reaction、60 英尺、无专注；触发和伤害结算不能缩写成“任何受伤都能用”。 | [SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=140)，事实卡 F05。 |
| Misty Step 为位移案例 | 2 环、Bonus Action、最多 30 英尺；目的地可见且未被占据；无专注。 | [D&D Beyond Misty Step](https://www.dndbeyond.com/spells/2619133-misty-step)；[SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=150)，事实卡 F06。 |
| Hypnotic Pattern 为范围控场案例 | 3 环、Action、120 英尺、30 英尺立方、专注至多 1 分钟；范围内能看到图案的每个生物都须考虑。 | [D&D Beyond Hypnotic Pattern](https://www.dndbeyond.com/spells/2619168-hypnotic-pattern)；[SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=141)，事实卡 F14。 |
| Counterspell 为施法反应案例 | 3 环、Reaction、60 英尺；2024 采用 Constitution save 的结算，不套旧版自动反制。 | [D&D Beyond Counterspell](https://www.dndbeyond.com/spells/2619072-counterspell)；[SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=120)，事实卡 F11。 |
| 两个专注法术不能同时维持 | 2024 开始施放另一个需专注法术时，原专注立即结束；受伤/失能/死亡还有其他结束条件。 | [D&D Beyond 2024 Concentration](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration)；[SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=179)，事实卡 R08。 |
| 2024 同一 turn 只能消耗一个法术位施法 | 这是 2024 一般施法规则；不改写成“每回合只能施一个法术”，也不套到无槽戏法或未核对的其他资源。 | [D&D Beyond 2024 Spells](https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn)，事实卡 R07。 |

### 图注与 alt

- 图注：**“示意：先锁 2024/2014 版次，再按 Warlock 职业等级核对准备数量与 Pact Magic 槽，最后按持续、反应、位移或控场工作位筛选；图中数字与法术条件按 2024 基础规则示例。”**
- alt：**“D&D Warlock 法术选择流程图：先确认 2024 或 2014 版次，再核对 1、3、5 级的准备数量和 Pact Magic 槽，最后按 Hex、Hellish Rebuke、Misty Step、Hypnotic Pattern 或 Counterspell 的战斗工作位选择，并检查专注和法术位限制。”**
- alt 不写“最佳”“高伤害”或图片没有呈现的法术；图注不替代正文中的事实引用。

## 9. 关键事实来源与 PublicReference 交接

所有规则主张必须使用紧邻对应主张的描述性链接；本卡的内部事实 ID 只帮助 C/E 对照，不渲染到读者正文。引用清单不能新增正文没有核验的结论。

| PublicReference id | label | url | appliesTo | versionNote |
|---|---|---|---|---|
| zh-warlock-2024 | D&D Beyond：2024 Warlock | https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock | 2024 职业表、Pact Magic、Prepared Spells、Magical Cunning、Mystic Arcanum、Fiend Spells | 2024 修订规则；基础职业字段 |
| zh-warlock-2014 | D&D Beyond：Warlock Legacy Class Details | https://www.dndbeyond.com/classes/7-warlock | 2014/Legacy known spells、Pact Magic、Mystic Arcanum、Fiend Expanded Spell List | 2014 对照；不与 2024 字段混用 |
| zh-spellcasting-2014 | D&D Beyond：Basic Rules 2014 Spellcasting | https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spellcasting | 2014 Bonus Action 施法限制、2014 Concentration | 仅对应 2014；不改写为 2024 规则 |
| zh-spells-2024 | D&D Beyond：2024 Spells | https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn | 2024 每个 turn 一个法术位施法的限制 | 2024 一般施法规则 |
| zh-srd-5-2-1 | D&D Beyond：System Reference Document 5.2.1 | https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf | 2024 Hex、Hellish Rebuke、Misty Step、Hypnotic Pattern、Counterspell、Eldritch Blast、Concentration 的正文 | PDF 页码随事实卡；不把 SRD 未收录解释成职业不能选 |
| zh-hex-2024 | D&D Beyond：Hex | https://www.dndbeyond.com/spells/2618988-hex | Hex 的 2024 施法时间、距离、专注、命中与属性检定条件 | 2024；事实卡 F02 |
| zh-eldritch-blast-2024 | D&D Beyond：Eldritch Blast | https://www.dndbeyond.com/spells/2619161-eldritch-blast | 戏法动作、距离、每束攻击和等级增束 | 2024；事实卡 F01 |
| zh-hypnotic-pattern-2024 | D&D Beyond：Hypnotic Pattern | https://www.dndbeyond.com/spells/2619168-hypnotic-pattern | 三环控场、30 英尺立方、专注、受伤/摇醒结束 | 2024；事实卡 F14 |
| zh-misty-step-2024 | D&D Beyond：Misty Step | https://www.dndbeyond.com/spells/2619133-misty-step | 二环位移、Bonus Action、30 英尺、可见且未占据 | 2024；事实卡 F06 |
| zh-counterspell-2024 | D&D Beyond：Counterspell | https://www.dndbeyond.com/spells/2619072-counterspell | 三环 Reaction、60 英尺、Constitution save 结算 | 2024；事实卡 F11 |
| zh-concentration-2024 | D&D Beyond：2024 Concentration | https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration | 不能同时维持两个专注法术、受伤/失能/死亡结束条件 | 2024；事实卡 R08 |

若正文采用 SRD 的许可材料而非仅作链接概括，后续公开交接必须保留事实研究中登记的 CC BY 4.0 归属要求；本卡不复制法术原文。

## 10. 事实缺口与停用规则

- 已核验可用于本卡的核心候选：2024/2014 Pact Magic 表、2024 Prepared Spells 表、2024 Magical Cunning、Mystic Arcanum、Eldritch Blast、2024 Hex、Hellish Rebuke、Misty Step、Invisibility、Hold Person、Darkness、Hypnotic Pattern、Counterspell、Dispel Magic、Fly、Banishment、Dimension Door 的对应字段。
- **禁止自行补齐**：2014 Hex 的完整效果与升环、两版 Armor of Agathys 的完整效果、两版 Arms of Hadar 的完整效果、两版 Hunger of Hadar 的完整效果及互动；若正文把它们当核心候选，必须退 A 补官方正文，或删掉该候选。
- 本卡选择不依赖 Armor of Agathys、Arms of Hadar 或 Hunger of Hadar；这样 C 不必用未核验字段填充长度。
- 不把论坛、BG3、UA/Playtest、搜索摘要、中文译名或站内博客当作 D&D 规则的一手事实来源。
- 不做游戏实战、伤害模拟、胜率、DPR、强度排名、搜索量或用户比例主张；研究交接没有这些证据。

## 11. V7 布局验收与交接

### B 阶段验收

- [x] 主关键词保留原英文：dnd warlock spells。
- [x] 语言与国家分开记录：locale=zh-CN；country 未指定；精确 CN SERP 为 UNVERIFIED。
- [x] 读者已有条件、ReaderTask、完成标志和范围边界已写明。
- [x] 只有一个主搜索意图；法术列表、法术位和法术选择只作为完成该意图的必要子问题。
- [x] 主线版本已选择：2024；2014 仅在改变选择的规则点对照。
- [x] 每节均写明删除后是否会妨碍 ReaderTask；无关百科、BG3、全职业和产品分支未纳入。
- [x] 文章结构、H2/H3、可观察输入/动作/限制/结果已安排；不写正文。
- [x] 信息增益有可核对材料：资源三栏、工作位矩阵、专注冲突、三个分级例子和可迁移核对表。
- [x] 工具自然使用位置已独立判断为“无”；无自然 CTA。
- [x] 图位、图中每条事实及来源、精确图意、图注、alt、V 可实现的简单示意图方案均已写明。
- [x] 媒体路径为 ../../media/zh-CN/spell-choice.webp，相对于 drafts/zh-CN/body.md。
- [x] 关键事实映射到已读官方来源，PublicReference 字段齐全；真实搜索查询、日期、提供方、参数与限制已记录。
- [x] 明确 2000 合格中文汉字的实质材料来源；禁止用标题、来源、图注、FAQ、CTA 或重复定义凑数。

### 后续交接

- C-zh：只写正文与正文内紧邻引用；不要把本卡的内部身份、搜索排名、Task/Dispatch、失败日志、路径或验收勾选搬进正文。
- A-zh：若 C 需要使用本卡已列 UNVERIFIED 的法术机制，先补真实官方来源；不能让 C 依据记忆填空。
- D/E：分别对同一正文版本检查 ResearchTrace、ReaderValue、Repetition、22 条鉴文、事实/引用和图文含义；不能用本卡替代独立审核。
- F：待 D/E 对同版正文通过后再锁稿、计数、生成 Title/H1/Description；本卡的临时工作题不是最终 SEO。
- 页面阶段：本任务是 content-only，不授权网站写入、媒体落盘、页面装配、部署或用户终审。
