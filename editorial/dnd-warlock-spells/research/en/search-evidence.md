# A-en：英文搜索与竞品观察记录

仅编辑侧研究，不是读者正文、布局任务卡或排名效果报告。

## 查询回执

- 日期：2026-09-26；DOM 读取时间 `2026-09-26T03:06:34.195Z`（UTC）。
- 原词：`dnd warlock spells`；目标 `locale=en, country=US`。
- 提供方：Google；执行工具：本地 `ego-browser nodejs`，独立 TaskSpace `23`（A-en warlock research），页面 `p1`。
- 实际地址：https://www.google.com/search?q=dnd+warlock+spells&hl=en&gl=us&pws=0
- DOM 回执：页标题 `dnd warlock spells - Google Search`；页脚 `Results are not personalized`、`United States - From your IP address`（原 DOM 空格含 NBSP）。
- 地区结论：**PASS，取得 Google 界面确认的美国国家级、英文搜索样本**。没有城市级定位证据，也不代表所有美国用户同一排名。浏览器扩展 AITDK/Monica 的插入内容未作为自然结果。
- PAA：**未取得**。未把普通论坛提问或相关搜索假写成 People Also Ask。
- 实际可见的 People also search for：`Dnd Warlock spell slots`、`DnD Warlock spells 2024`、`Dnd warlock spells level 1`、`DnD Warlock spells RPGBOT`、`Warlock 5e`、`Dnd warlock spells wikidot`、`Dnd Warlock spells 2014`、`DND warlock spell cards`。

## 自然结果顺序

下列按本次 DOM 中结果标题顺序记录；不含 AI Mode 插入卡、广告或站内附加链接。前五个均取得正文，没有替补样本。

| 位次 | 可见标题 | 结果 URL | 正文打开结果 |
|---|---|---|---|
| 1 | Warlock Spell List - DND 5th Edition - Wikidot | https://dnd5e.wikidot.com/spells:warlock | 可读；导航等待 load 超时，已提交 interactive 文档；随后同页 DOM 读取成功 |
| 2 | Warlock Spells for Dungeons & Dragons ... | https://www.dndbeyond.com/spells/class/7-warlock | 可读；去掉 Google 跟踪参数后打开同一列表 |
| 3 | What are some of the best spells for a warlock? : r/3d6 | https://www.reddit.com/r/3d6/comments/14ecojw/what_are_some_of_the_best_spells_for_a_warlock/ | 可读，原问题及评论均取得 |
| 4 | Warlock Spells - D&D 5th Edition - Wikidot | http://dnd5ed.wikidot.com/spells:warlock | 跳转 https；interactive 后 DOM 可读 |
| 5 | Warlock Spell List - 5th Edition SRD | https://5thsrd.org/spellcasting/spell_lists/warlock_spells/ | interactive 后 DOM 可读 |

同页后续可见自然结果包含 YouTube `Top 10 Warlock Spells in DnD 5e`、Fandom Warlock Spells、RPGBOT 的 Warlock Spells 5e 指南、Quora 的按等级选法术问答。它们仅证明搜索页存在这些内容类型，本任务未打开，未用于事实核验。

## 前五页逐项观察

### 1. dnd5e.wikidot.com

- 类型：社区法术表；任务：按环阶查询名称、学派、施法时间、射程、持续时间及成分。
- 实读位置：页首说明、Cantrip 至 9th Level 标签、当前可见戏法表。
- 前提/限制：明确含 Tasha's Cauldron of Everything 的可选法术，并提供不含可选法术的另一个列表；当前表可见 UA 项目。不能当成纯 2024 官方清单，也不能宣称所有收录项获本桌允许。
- 例子：Eldritch Blast 和 Minor Illusion 有参数行；On/Off 带 UA 标记。仅用于观察列表形式，不据此搬运规则。
- 未满足需求（本页已读范围）：没有解释有限 Pact Magic 法术位如何影响取舍；没有组合清单或专注冲突决策。未逐个点开所有环阶或法术。

### 2. D&D Beyond

- 类型：官方可筛选数据库；任务：检索/比较具体法术参数。
- 实读位置：Warlock Spells 标题、筛选器及连续列表。
- 前提/限制：同名法术同时列出现行与 Legacy；数据库收录不等于同一角色可无条件混用所有版本或来源。列表可读不代表每个法术全文免费。
- 例子：Armor of Agathys 分别显示 Legacy 的 Action 和非 Legacy 的 Bonus Action；Chill Touch 两行分别显示 120 ft. 与 Touch。具体全文未核验者不扩写效果。
- 未满足需求：列表把版本辨认留给读者，没有替玩家决定少量已准备/已知法术怎样覆盖实际任务。

### 3. Reddit r/3d6

- 类型：讨论帖；任务：在有限法术位和升环施法条件下，寻找值得选择的法术。
- 实读位置：原问题和多条评论。原问题明确询问哪些法术随升环成长、哪些值得稀少法术位。
- 前提/限制：搜索显示约三年前；讨论包含旧版选项和未经核验的强度意见，不作 2024 规则来源，也不将评论共识当普遍最优。
- 例子：评论讨论 Armor of Agathys、Invisibility、召唤法术、Hypnotic Pattern；有人指出 Darkness 会影响没有配套视觉能力的同伴。以上是用户问题与观点证据，不是本文获准采用的规则事实。
- 未满足需求：建议散落、彼此前提不同，不能直接得出某等级、某规则版本的合法可抄清单；缺少一致的来源与版本核对。

### 4. dnd5ed.wikidot.com

- 类型：分环阶链接索引；任务：从戏法到九环找到法术页面。
- 实读位置：整张等级索引。
- 前提/限制：含 UA 标签及不同资料选项；没有清楚的统一 2024 适用承诺。
- 例子：一环列 Hex、Armor of Agathys，同时包含 Healing Elixir (UA)；三环列 Counterspell、Hypnotic Pattern。
- 未满足需求：没有参数比较、来源许可筛选、何时替换旧法术或专注预算说明。它解决“去哪里查”，不解决“这次选哪几个”。

### 5. 5thSRD

- 类型：SRD 5.1 范围的精简法术表；任务：查环阶、名称、学派。
- 实读位置：全表、页首版本提示和页脚许可。
- 前提/限制：页脚明确 SRD 5.1；页首引导 2024 读者去 5e24SRD.com。不是全部扩展书清单，也不是 2024 清单。
- 例子：有 Eldritch Blast、Invisibility、Fly、Hypnotic Pattern；当前整表没有 Hex 和 Armor of Agathys 条目。不能由此推断这两项不是 Warlock 法术。
- 未满足需求：缺少选择建议，也没有解释 SRD 范围与完整职业列表的差异。

## 供 B 独立决策的候选意图证据

1. **查自己可选的 Warlock 法术**：前五中四个是列表/数据库，证据最直接；版本、来源和环阶是完成此动作的前提。
2. **从可选法术中选出适合有限法术位的清单**：第三位原帖明确提出，相关搜索中也有 level 1 与 spell slots；可形成决策型图文文章，但应保留便于查找的法术名称与等级。
3. **只弄懂 Warlock 法术位**：有相关搜索支持，却不是多数前五页面的完整任务；不能以此独占整篇并弱化关键词里的 spells。
4. **只比较 2014 与 2024**：相关搜索及列表重复项证明版本筛选有需要；本样本不足以证明版本差异本身就是唯一主任务。

以上是候选及权重，不是 A 代 B 选定主意图；B 必须选一个 ReaderTask，其余仅在完成该任务确有必要时纳入。

## 原始观察方法与异常

真实执行：`ego-browser nodejs` 内 `taskSpace(23)`、`page.goto(url)`、`page.snapshot({scope:"full_page"})` 和 `page.evaluate()` 提取 `h3` / 页脚 / 正文。

三个静态列表出现 `PageNavigationTimeoutError ... waiting for load ... document.readyState="interactive"`，退出码 1；遵照回执在同一页面读取 DOM，读取退出码均为 0。未绕过验证码、未切换他人标签页、未把超时等同于来源不可读或 HTTP 失败。具体 HTTP 状态未由这些 DOM 读取证明。
