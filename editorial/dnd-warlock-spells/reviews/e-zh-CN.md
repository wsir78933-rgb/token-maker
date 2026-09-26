# E-zh-CN 独立内容鉴文报告

## 结论先行

**当前正文门：PASS。F 的 PublicBlogHandoff/SEO 门：PENDING。** 当前正文没有发现 22 条鉴文规则的命中问题；研究痕迹、ReaderValue、重复、图文相关性、事实与正文内公开引用均通过，机械计数为 3210 个合格汉字单位。SRD 5.2.1 的 Hellish Rebuke 与 Hold Person 归属文字是 `PublicBlogHandoff.publicRequirements` 的强制读者可见署名项，不是当前 body 必须改字的事实或语义缺陷；F 尚未生成交接，因此不能把尚不存在的交接产物判成当前正文 FAIL。

用户终审：**尚未进行**。本任务是 content-only，尚无网站成品页面，不能把本报告写成页面通过或用户通过。

## 身份、范围与版本绑定

- Run：`run_39994fa3f53e`
- Task：`task_7eff0516341b`（本次澄清续审）
- Dispatch：`ctx_1770d37dab90`（本次澄清续审）
- Worker terminal：`term_7244c719-9249-435b-b5be-fbc28b2a9deb`
- Codex session：`01a0dc0b-defb-7d51-98f0-4243ce9b356a`
- Coordinator terminal：`term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`
- 关键词：`dnd warlock spells`
- 语言/地区：`locale=zh-CN`；`country=CN` 仅为 Google 查询偏好，不是精确中国境内 SERP 证明
- 体裁：英文与简体中文 content-only 图文博客；本报告只审中文 E
- 前版 E 报告：`task_d925d9bace02` / `ctx_ac3d3a228341`，保留于 `reviews/e-zh-CN-v1.md`；本次为同一 E-zh 真实会话的阶段门澄清续审
- 当前中文修订状态：协调者已确认 Round3，正文修订预算为 3/3；本续审没有改正文，也没有发起 Round4
- 唯一有效 B 卡：`planning/zh-CN/task-card-v1.md`；未读取旧 `planning/zh-CN/task-card.md` 作为依据

绑定对象的真实摘要：

| 对象 | 路径 | SHA-256 / 观察 |
|---|---|---|
| 正文 | `drafts/zh-CN/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| 正文计数 | 同上 | `zh-CN` 机械计数 `3210`，要求 `2000`，脚本判定 `meets_mechanical_floor=true` |
| 中文图 WebP | `media/zh-CN/spell-choice.webp` | `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893`；原生 `780x2100` |
| 中文图 SVG | `media/zh-CN/spell-choice.svg` | `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0`；`780x2100` |

未读取验收样稿、历史参考作为素材；未读取作者自评，也未用 D 的 PASS 代替本次独立判断。实际阅读了执行入口、01、02、22 条规则、事实核验与公开引用规则、有效中文任务卡、中文搜索证据、共享规则事实/证据、站内上下文、当前 body 与中文媒体。

## 原始关键词与主任务核对

### 搜索证据

A-zh 的真实台账记录了 Q1 `DND 邪术师 法术`、Q2 `DND 契术师 法术`、Q3 `DND 邪术师 法术选择`、Q4 `DND 邪术师 法术位` 等中文表达；`hl=zh-CN&gl=CN&pws=0` 的结果不是精确中国境内排名。Q1 前五网页结果实际读到灰机法术索引、知乎职业页、Reddit 法术表、灰机职业页、百度百科；它们主要提供索引、2014 框架或需求线索，没有提供“按打法、动作、专注和法术位作选择”的完整方法。Q6 `DND 魔契师 法术` 到 Google `/sorry/`，没有被伪造为成功结果；PAA、搜索量、精确地区排名均保持 UNVERIFIED。

本 E 使用本地 ego-browser 自有 TaskSpace `53`、Page `p1`，实际重新打开 Q1 URL：

`https://www.google.com/search?q=DND%20邪术师%20法术&hl=zh-CN&gl=CN&pws=0`

浏览器真实返回标题“DND 邪术师 法术 - Google 搜索”，并返回灰机“邪术师法术 Warlock Spells”、知乎职业邪术师、Reddit 术士专用法术表、灰机职业页与 Bilibili 结果链接。该证据支持中文读者需要版本/法术位/选择方法的任务背景，但不支持排名或搜索量结论。

### 任务卡与正文是否同一主意图

有效 B 卡把唯一主意图锁为：在 2024 规则、Warlock 等级、DM 允许来源和实际打法条件下，从已核验法术中选出可填入角色资料的候选，并复核准备数量、Pact Magic 法术位、动作、专注和反应条件。正文从第 1–3 行锁版本/等级/来源，再在第 7–17 行分开准备数量、槽和 always prepared，随后在第 23–40 行贴字段标签，最后在第 62–90 行用 1/3/5 级示例和检查顺序完成选择。

未发现把 Token Maker 产品、CTA、DPR、BG3、兼职业或无条件强度榜加入任务的情况。正文明确“示例不构成必选清单”，与任务卡的条件化选择合同一致。

## ReaderValue：实际执行一个明确场景

### 场景输入

假定读者是**单职业、2024 规则、Warlock 3 级**，DM 允许正文列出的法术，主要需要远程攻击和脱离危险位置；读者尚未决定是否为另一个专注法术保留位置。

### 按正文方法执行

1. 第 7–17 行先写资源：4 项基础准备法术、2 个 2 环 Pact Magic 法术位；Eldritch Blast 另列为戏法，不占 4 项。
2. 第 23–40 行为候选补字段：Hex 是附赠动作/90 英尺/专注；Misty Step 是附赠动作/最多 30 英尺/可见且未占据落点/不专注；Hellish Rebuke 是受伤触发的反应；Hold Person 需要 Humanoid 和专注；每一项都能查到动作、射程和专注/豁免条件。
3. 第 72–78 行给出可填卡的 4 项示例：Hex、Hellish Rebuke、Misty Step、Hold Person。数量与基础准备数相等，两个 2 环位与名单数量没有混淆。
4. 如果地图确有可见未占据的落点，保留 Misty Step；若目标不是 Humanoid，按第 78 行替换 Hold Person；若要维持另一个专注效果，按第 78 行重新评估 Hex；若遭遇不易触发 Hellish Rebuke，按第 70 行不强行占一格。
5. 第 88–90 行再次核对版本、准备数、Pact Magic、动作、距离、专注、反应触发和同一 turn 的一个法术位限制。

### ReaderValue 结果

**PASS。** 输入、动作、候选数、字段检查、替代分支和可观察完成标志均存在；读者能得到一套 4 项候选，并能指出至少一个未选/替代理由。该方法没有把个人偏好伪装成最优解，也没有用“有步骤”替代条件和结果判断。

## 图文实际检查

已用 `view_image` 实际查看 `media/zh-CN/spell-choice.webp`，不是只检查文件名或 SVG 源码。图为竖向 780×2100 决策图，清楚呈现：

- 先确认 2024、Warlock 等级、DM 来源与打法；
- 分开“基础准备数 / Pact Magic / always prepared”；
- 按动作、附赠动作、反应、射程/位置、专注/目标/豁免筛选；
- 用 Eldritch Blast、Hex、Hypnotic Pattern、Misty Step、Counterspell 展示字段；
- 底部明确专注不可叠加、2024 同一 turn 只消耗一个法术位、没有无条件必选法术。

图中文字与正文/已核验字段一致：Eldritch Blast 120 英尺、5 级两束；Hex 1 环/附赠动作/90 英尺/至多 1 小时专注；Hypnotic Pattern 3 环/动作/120 英尺/30 英尺立方/感知豁免/至多 1 分钟专注；Misty Step 2 环/附赠动作/至多 30 英尺/可见且未占据/无专注；Counterspell 3 环/反应/60 英尺/看到施法生物/体质豁免。图没有内部 Task、研究路径、SERP 或作者评价。

图片承担主任务中的“资源账与字段筛选”关系，正文在图前后解释其使用方式；不是封面、装饰或占位图。内容审查未执行窄屏布局/页面缩放验收，页面阶段仍未开始。

## 五项质量门

| 质量门 | 结论 | 证据与定位 |
|---|---|---|
| ResearchTrace | PASS | 正文未发现 Task、Dispatch、session、worker、editorial/research 内部路径、SERP 日志、作者自评或给作者的范围指令；全文扫描无命中。官方链接与必要方法说明属于合法公开引用，不是检索日志。 |
| ReaderValue | PASS | 上述 3 级远程+脱离场景实际执行成功；第 66–84 行还有 1/3/5 级资源账、替代理由与动作/法术位区分。 |
| Repetition | PASS | 资源数字在第 7–17 行首次解释、在第 66/74/82 行作为不同等级示例、在第 88–90 行作为最终检查；专注和同 turn 规则分别承担概念、示例与复核作用，不是同作用重复。 |
| Length | PASS（机械）/UNVERIFIED（F 语义锁定） | `正文计数.py ... --locale zh-CN` 退出码 0，输出 `mechanical_units=3210`、`required_floor=2000`、`meets_mechanical_floor=true`；脚本明确要求独立语义审核，F 尚未锁稿。 |
| SEOTruth | UNVERIFIED | 当前输入只有 body，没有 F 生成的最终 Title/H1/Description/FAQ/身份元数据；不能提前替 F 或后续 E 题文复核签字。 |

## 22 条鉴文逐项结果

状态含义：`未命中`=未发现规则所描述的问题；`不适用`=该规则在当前正文没有可审对象；`命中`=需修改的问题。本表是对当前 body SHA 的判断，不是对旧版本或作者自评的沿用。

| # | 状态 | 原句/位置与理由 | 修订要求 |
|---:|---|---|---|
| 1 | 未命中 | 第 3、17、38、52、60、78、88–90 行保留了版本、子职来源、队友范围、反应触发、Humanoid 和专注等会改变选择的例外；没有大篇幅处理无关反驳。 | 无。 |
| 2 | 未命中 | 第 5–17、23–40、42–90 行的知识均直接服务“选一套可回算的法术候选”；未扩展完整职业百科、BG3、兼职业或强度排名。 | 无。 |
| 3 | 未命中 | 第 27–34 行表格使用统一字段是速查表必要结构，22 条规则的误判保护明确允许规格表统一字段；各段正文没有连续换词排比。 | 无。 |
| 4 | 未命中 | 全文未出现重复的“虽然……但是……”让步模板；第 48、60、70、78 行是真实的条件分支，不是机械让步。 | 无。 |
| 5 | 未命中 | 未反复制造“我把这叫作……”等概念命名；`Pact Magic`、`Hex`、`Misty Step` 等术语保持一致。 | 无。 |
| 6 | 不适用/未命中 | 正文没有第一人称经历或编排情绪曲线；教程采用平静说明，符合规则允许的准确教程语气。 | 无。 |
| 7 | 未命中 | 没有“所有人都以为……”式无来源读者错误；第 48、56、60、78 行用可观察条件替代泛化反驳。 | 无。 |
| 8 | 未命中 | `不是/而是` 仅在第 1、3、38、48、56、92 行承担榜单、专注、升环、位移和结论区分；没有在短篇中以同一模板高密度堆叠。 | 无。 |
| 9 | 未命中 | 第 48、60、70、78、82 行明确“如果/若/未必/替代”，没有把战术建议写成无条件规则；已核实数字则直接陈述。 | 无。 |
| 10 | 未命中 | 1/3/5 级数量、槽阶、距离、伤害骰、束数、持续时间和豁免均有对应官方事实证据；没有速度、成功率、性能等无来源精确数字。 | 无。 |
| 11 | 不适用/未命中 | 没有“我也失败过”或个人成长故事；示例在第 66、74、82 行标为可核对/偏向打法的设计示例。 | 无。 |
| 12 | 未命中 | 第 66–84 行的等级示例没有把复杂选择压成万能清单：保留专注、动作、反应、Humanoid、可见落点和同 turn slot 分支；第 88–90 行提供可复核检查。 | 无。 |
| 13 | 未命中 | 第 92 行只有一个收束判断，并且仍然落到条件、牺牲和复核；前文没有每段都用宏大金句收尾。 | 无。 |
| 14 | 未命中 | 段落长度与句式随解释、表格、示例和检查任务变化；没有靠随机拆句制造节奏。 | 无。 |
| 15 | 未命中 | 没有“凭感觉就知道”；“位置价值高”“优先级更稳定”等属于明示前提后的分析判断，且与动作、专注、槽和落点条件相连。 | 无。 |
| 16 | 未命中 | 开头第 1–3 行先给版本、等级、DM 来源、三类资源和下一步，虽有“先别从最强法术开始”的引导，但不是只剩钩子或承诺。 | 无。 |
| 17 | 未命中 | 没有密集重复“值得注意/事实上”等连接词；转折均对应条件改变。 | 无。 |
| 18 | 未命中 | 第 1 行一次性说明“契术师/Warlock/邪术师”译名观察，之后主要术语稳定，没有为同一功能反复换名。 | 无。 |
| 19 | 未命中 | 中文句子整体自然；英文法术名、`Pact Magic`、`always prepared` 和 `Humanoid` 为必要规则标识，不是翻译腔混用。 | 无。 |
| 20 | 未命中 | 第 66、74、82 行明确是等级示例；没有“某客户”“我们测试”“实战发现”等虚构案例或实测声称。 | 无。 |
| 21 | 未命中 | 第 92 行不是通用祝福，而是回到版本、等级、DM 书目和条件化选择的可执行结论。 | 无。 |
| 22 | 未命中 | 正文没有突然上升到宏大人生/行业命题；全部回到角色资料、动作、槽、专注、反应和替代分支。 | 无。 |

## 六类形式指纹

| 指纹 | 结论 | 实际核对 |
|---|---|---|
| 破折号过密 | 未命中 | body 无 em dash/en dash；Markdown 表格分隔线不是正文破折号。 |
| 粗体过密 | 未命中 | body 无 `**` 粗体标记。 |
| 无用装饰符号 | 未命中 | 未发现表情符号或装饰性图标；列表、表格和标题均有信息作用。 |
| 助手残留 | 未命中 | 内部标记扫描无命中；正文没有“作为 AI/以下是/任务回执/作者提示”等残留。 |
| 填充短语 | 未命中 | 未发现“在当今数字时代”“值得注意的是”等可删而不损逻辑的成套填充。 |
| 泛泛积极结尾 | 未命中 | 结尾只给条件化复核结论，没有祝福、鼓励或宏大升华。 |

## 事实、版本、数字、因果与引用复核

### 已独立打开的官方来源

本 E 使用 ego-browser TaskSpace 53 实际打开并提取 DOM 正文：

- 2024 Warlock：职业表明确 1 级 Prepared Spells 2 / 1 个 1 环位，3 级 4 / 2 个 2 环位，5 级 6 / 2 个 3 环位；Pact Magic 槽同环阶，短休或长休恢复；升级时可替换一项；always prepared 不计入该数量。
- Eldritch Blast：戏法、1 Action、120 ft、命中 1d10 Force；5 级两束且逐束攻击，可同一或不同目标。
- Hex：1 环、1 Bonus Action、90 ft、Concentration 1 Hour；命中攻击检定额外 1d6；目标指定属性的 ability checks 具有 Disadvantage；升环增加专注时长而不增加 1d6。
- Hypnotic Pattern：3 环、1 Action、120 ft、30-foot Cube、Wisdom save、Concentration 1 Minute；受影响生物受到伤害或被他人用 Action 摇醒时结束。
- Misty Step：2 环、1 Bonus Action、最多 30 ft，落点需可见且未占据，无专注。
- Counterspell：3 环、1 Reaction、60 ft、看到带 V/S/M 成分施法的生物；目标作 Constitution save；失败时法术消散且其动作/附赠动作/反应浪费，目标若用了法术位则该位不消耗。
- 2024 Spellcasting：一个 turn 只能消耗一个法术位；没有被改写成每 round 一个法术。
- 2024 Concentration：开始施放另一个需专注法术时失去原专注；受伤时 DC 为 10 或伤害一半向下取整的较高者，上限 30；失能或死亡也结束。

Hellish Rebuke 与 Hold Person 使用正文链接到 SRD 5.2.1 PDF；A-rules 的原始 PDF 证据明确覆盖两者的 2024 字段。正文中没有把未核验的 Armor of Agathys、Arms of Hadar、Hunger of Hadar 机制补进来。

### F 必须完成的公开署名交接项

正文第 36 行链接 SRD 5.2.1 的 Hellish Rebuke，第 74 行链接同一 SRD 的 Hold Person。`research/rules/facts.md:34-38` 明确：公开稿使用 SRD 5.2.1 许可材料时须保留 CC-BY-4.0 归属文字；该文字当前尚未出现在任何已生成的 PublicBlogHandoff 中，但这不构成当前 body 的事实/语义失败。

按 `04-公开交接与页面装配.md`，F 必须在 `PublicBlogHandoff.publicRequirements` 中携带“必要公开署名”，并另附读者可见的 attribution 文本；同时冻结 `body`、原 bodyHash、SEO、PublicReference 和 integrity。F 必须从 `research/rules/facts.md:34-38` 取完整归属文字，不将内部事实 ID、Task/Dispatch、抓取日志或私有路径带入读者面；不能静默豁免，也不能以内部报告代替读者可见署名。

本次续审不生成署名附件、不修改 body/media、不生成 AssemblyManifest。后续 E 必须核对同一 bodyHash 下的实际文本、PublicReference 的 `{quote, occurrence}` 与 URL/appliesTo、`publicRequirements` 的公开署名附件，以及 content-only 交付包中的最终读者可见署名；页面实际回读在本 content-only 任务中保持未执行，不因该未执行要求越权写站或伪称页面通过。若未来把署名字节直接加入 body，才会形成新 body 版本并触发 D/E 受影响项复验；仅按 04 的 handoff 槽携带，不改变当前 body 字节。

## 八层独立鉴文

| 层 | 结论 | 证据与限制 |
|---:|---|---|
| 1. 完整 22 条逐项检查 | PASS（逐项结果见上） | 22 条均已给出命中/未命中/不适用与定位；未以“整体读起来不错”代替逐项判断。 |
| 2. 六类形式指纹 | PASS | 破折号、粗体、装饰符号、助手残留、填充短语、泛泛结尾逐项扫描并记录。 |
| 3. 站点语气与明确禁词 | PASS（有限范围） | 站内上下文记录中文站使用“契术师（Warlock）”并与“术士（Sorcerer）”区分；正文采用具体、克制、条件化说明，无内部词和作者自评。项目未提供独立的完整禁词表，因此不能声称禁词合同已穷尽验证。 |
| 4. 工具/主题/观察证据与版本、数字、因果、引用 | PASS（当前正文门） | 规则事实与正文内官方链接逐项支持，版本和数字通过；SRD 5.2.1 的 CC-BY 归属属于尚未生成的 PublicBlogHandoff.publicRequirements 强制项，不反向判 body 失败。 |
| 5. 限制、反例、不确定与真正需要的例外 | PASS | 2014/2024 分开、子职来源、专注冲突、Hypnotic Pattern 队友风险、Hellish Rebuke 触发、Hold Person 的 Humanoid、Misty Step 落点、同 turn slot 均保留。未把精确地区 SERP 或未核验法术写进正文。 |
| 6. 承担判断作用的有效表达 | PASS | 第 48、56、60、70、78、84 行的建议都绑定战术条件和可观察字段，没有以模板金句替代判断。 |
| 7. 局部修订与独立复核链 | PENDING（F handoff） | E 不直接改正文；F 尚未生成 PublicBlogHandoff，必须补齐读者可见 SRD 归属后才能冻结。正文修订预算已为 Round3 3/3，不能由本 Worker 自发 Round4；若只写 handoff 署名槽，bodyHash 不变，后续 E 核对 handoff；若改变 body，才重新绑定 SHA 并由 D/E 复核受影响项。 |
| 8. 用户终审 | UNVERIFIED（尚未进行） | 当前为 content-only，无完整网站页面；不能记录用户确认、修改、跳过或通过。 |

## 交付状态与剩余风险

- **内容语义**：PASS；未发现 22 条问题命中，ReaderValue 场景通过，图与正文关系通过。
- **事实核心**：PASS（限定于当前引用的 2024 官方规则和 SRD 字段）；没有把作者自评或 D PASS 当证据。
- **正文内公开引用**：PASS；关键事实、链接、标签和版本支持均已核对。
- **PublicBlogHandoff/公开署名**：PENDING；F 必须把 SRD 5.2.1 CC-BY-4.0 归属放入 `publicRequirements` 的读者可见 attribution 附件后才能冻结，不能静默豁免。
- **长度**：机械 PASS；F 尚未执行最终淬文、语义剔除和锁稿。
- **SEO 表面**：UNVERIFIED；Title/H1/Description 尚待 F，不能做题文真实性结论。
- **页面/用户终审**：UNVERIFIED；没有写网站、没有页面路由、没有桌面/手机页面验收。
- **地区 SERP/PAA/搜索量**：UNVERIFIED；报告只使用实际中文 Google 结果证据，不作排名结论。

本 E 只写入本报告与同前缀版本报告，不修改正文、媒体、布局、网站源码、数据库、密钥、依赖、Hermes 或原始工作区，不提交/push/deploy。

本任务实际新增文件：

1. `editorial/dnd-warlock-spells/reviews/e-zh-CN.md`
2. `editorial/dnd-warlock-spells/reviews/e-zh-CN-v2.md`

`e-zh-CN-v1.md` 保留为前版历史记录，未覆盖；本次只更新当前报告的阶段门结论并新增 v2 澄清报告。

## 实际验证命令与退出码

| 验证 | 实际结果 |
|---|---|
| `sha256sum editorial/dnd-warlock-spells/drafts/zh-CN/body.md` | 退出码 0；`7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/drafts/zh-CN/body.md --locale zh-CN` | 退出码 0；`mechanical_units=3210`，`required_floor=2000`，`meets_mechanical_floor=true`，raw SHA 与上绑定一致 |
| `file .../spell-choice.webp .../spell-choice.svg` | 退出码 0；WebP 为 780×2100，SVG 为 780×2100 |
| `shasum -a 256 .../spell-choice.webp .../spell-choice.svg` | 退出码 0；输出与本报告媒体表一致 |
| `rg` 内部标记扫描 body 与 SVG | 退出码 0；无命中 |
| `rg -o` 形式指纹统计 | 退出码 0；body em/en dash 0、`**` 0、装饰符号 0；`不是` 计数 12，但未形成规则 8 所说的同构高密度模板 |
| ego-browser Q1、官方 Warlock/法术/2024 rules pages | 各 Node 命令退出码 0；TaskSpace 53 / p1；已调用 `finish({keep:[]})`，无页面保留 |
| `orca orchestration check --terminal term_7244c719-9249-435b-b5be-fbc28b2a9deb --json` | 退出码 0；本续审确认 Run `run_39994fa3f53e`、Dispatch `ctx_1770d37dab90`，消息批次为空；前版身份保留在 v1 |
