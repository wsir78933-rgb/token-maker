# E-EN 独立审核 — `dnd kobold` EN

Role: E-EN（八层鉴文，非 A/B/C/D/F，非主 Agent）。Date: 2026-09-16。  
未改正文。未改 `src/` / `public/`。未 commit。不接收 C 自评，不以 D 的 PASS 代替本层。

## 版本与输入

- 正文：`tmp/blog-dnd-kobold/en/draft-body.html`
- 声称 hash：`31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`
- 本层实测 SHA-256：`31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`
- 哈希：**对齐。** 审核绑定该 hash。
- D 对照（非证据）：`tmp/blog-dnd-kobold/en/d-check-r1.md`（D 对该 hash 三门 PASS；本层独立重判）
- 用户原词：`dnd kobold tokenmaker.one`
- 搜索证据：`tmp/blog-dnd-kobold/en/serp-research.md`、`candidate-intents.md`
- 任务卡：`tmp/blog-dnd-kobold/en/task-card.md`
- 体裁：概念解释 + 版本锁（非教程、非 build、非 token walkthrough）
- 主意图：锁今晚桌上的官方怪物是 **2014 Kobold** 还是 **2024 Kobold Warrior**，不平均两块、不把可玩页抄进怪物

本层抽查（打开来源正文，不只看任务卡）：

- D&D Beyond `16939-kobold`：Small Humanoid (Kobold), Lawful Evil；AC 12；HP 5 (2d6−2)；Pack Tactics；2014 日光；匕首 + 投石索 30/120
- D&D Beyond `5195096-kobold-warrior`：Small Dragon, Neutral；AC 14；Initiative +2 (12)；HP 7；Pack Tactics（Incapacitated 条件句）；日光 = ability checks and attack rolls；Daggers (3) 20/60；无 Immunities 行
- DDB 10 species 文：核心十种无 Kobold；ASI 改由背景；旧书物种仍可用（侧栏未打开）
- DDB MotM 介绍文：Volo 有 Pack Tactics / 日光 / Grovel；MotM 用 Draconic Cry 换 Pack Tactics、用 Kobold Legacy 换 Grovel。文中**没有**“MotM dropped Alignment”
- Volo errata：Kobold Traits p.119 Alignment 删除；ASI 改为 +2 Dexterity only

## 0. 任务卡是否偏移（先于正文）

**不退 B。**

用户原词含域名，但 US SERP（2026-09-16）上 `dnd kobold` 头词有机结果是 2014 怪物页、未打开的 Wikidot *lineage* 标题、设定 wiki、Roll20 2014 转载。`tokenmaker.one` 只在查询已含域名或 `token` 时进 SERP；裸 `kobold token` 以万智牌为主。

任务卡主意图 = Candidate 1（怪物身份 + 2014/2024 并列表述）。明确拒绝把 Candidate 5 并进主任务；产品放在锁年之后、可整段删除。Candidate 2 只保留短栅栏，避免 SERP #2 的可玩标题污染怪物块。这不是“为了挂工具而改写读者需求”。

任务卡新增的走廊包抄、日照路、Warcraft / dragonborn 对比，有头词 PAA（how they work / good or evil）和有机页身份缺口支撑，不是写作者用演示例子倒推搜索需求。

正文开头仍是锁年，不是做 Token。删掉 Crop H2 的产品句，ReaderTask 仍能完成。

---

## 1. 22 条逐项

体裁已定为概念解释 + 版本锁。对照表、平行“不要混”和 mix-up 清单是该体裁的信息组织，不自动算机器味。

| # | 检查项 | 判定 | 理由 |
|---|---|---|---|
| 1 | 堵住所有反驳 | 未命中 | Mix-ups / session check 处理的是会抄错块的真实混用（平均类型、投石索换年、MotM 喊叫进怪物、wiki 免疫、5esrd 种族页），不是与任务无关的假想抬杠。这些例外应保留。 |
| 2 | 知识全部输出 | 未命中 | 年龄、名字、起源、“best class”、完整可玩特质、urd/Tiamat 生态未展开。可玩 H2 停在书名 + 替换关系。Crop 在锁年之后，删除测试仍通过。十核心物种名单服务于“2024 PHB 没有 Kobold”的可核对列表，不是百科加料。 |
| 3 | 匀速排比 | 未命中 | 身份节三条 “Do not read it as…” 是三个不同近邻概念（dragonborn / Warcraft / Tiny），不是同句换词。Mix-up 统一 “错混 + Fix” 是清单，每条事实不同。 |
| 4 | 让步模板反复出现 | 未命中 | 无机械 “虽然…但是…” 往返。取舍都是版本锁：抄哪一列、日光用哪一句。 |
| 5 | 反复给概念命名 | 未命中 | “source line / tracker / lock” 是操作名，前后一致。未发明私有术语替代 Pack Tactics、Sunlight Sensitivity、Kobold Warrior。 |
| 6 | 情绪曲线太光滑 | 未命中 | 无亲历转折、无成长叙事。走廊例标明 `Example, dark corridor pack, not a session log.` |
| 7 | 虚构读者错误再反驳 | 未命中 | 未写 “everyone thinks”。10 英尺光环 / once-per-rest 来自已打开的第三方 build 文与怪物原文的冲突；Frightened 来自已否定的 wiki。 |
| 8 | 高密度“不是X而是Y” | 未命中 | 英文无汉字阈值。文中 “not a solo boss / not a dragonborn / not Warcraft” 是身份课本身，不是修辞翻盘。不机械删除。 |
| 9 | 没有任何犹豫 | 未命中 | 已核验数字写死。未打开的玩家体型/速度/黑暗视觉/身高明确要求抄印刷页。2014 有翼块明确不要发明。2024 适配写了 paraphrase + 对印刷侧栏。 |
| 10 | 虚假精确 | 未命中 | AC/HP/射程/CR/先攻来自已打开怪物页。Foundry `0.8` 在主题事实库有 dnd5e 源码依据（见第 3 节引用缝，不作本条命中）。无“快 40%”类无源性能。 |
| 11 | 脆弱经历只为论点服务 | 未命中 | 无 “我也曾失败”。 |
| 12 | 复杂问题突然变万能步骤 | 未命中 | Session check 按空白分流。日光有室内火把例外。Crop 失败枝按症状分。未把“上传-下载”当成万能。 |
| 13 | 每段都收束成金句 | 未命中 | `Pick a column. Stop.` 是可执行停止条件，不是升华。结尾落到 tracker 空白，无鸡汤。 |
| 14 | 句子节奏过于均匀 | 未命中 | 锁年段长句堆限定；例子段按格子动作写；清单短句。不是等长换词。 |
| 15 | 感受替代论证 | 未命中 | “because it feels fairer” 是警告不要凭感觉改 2024 日光，随后指向该年句子。无“凭直觉就知道更强”。 |
| 16 | 开头只剩钩子、痛点、承诺 | 未命中 | 首段直接给出两种官方怪物、CR 不能合并、下一步写 source line。无时代焦虑开场。 |
| 17 | 连接词固定且密集 | 未命中 | 无 “值得注意 / 事实上 / in today’s landscape” 填充链。 |
| 18 | 刻意同义替换 | 未命中 | 2014 只称 Kobold，2024 只称 Kobold Warrior。预设名 Warrior 与统计块 Warrior 被点名拆开。 |
| 19 | 中文翻译腔或非母语表达 | 未命中 | 英语是锁年版技术说明，不是中文句式硬译。专业名词未乱改。 |
| 20 | 虚构故事或案例 | 未命中 | 走廊/日照路标成 Example。无 “we tested / 某客户”。图注写明非截图、非 session log。 |
| 21 | 通用祝福结尾 | 未命中 | Session check 后是 FAQ 与 Sources。无 “你值得更好”。 |
| 22 | 强行追求深刻 | 未命中 | 未升到文化寓言或“何为怪物”。停在抄哪一列、数哪 5 英尺。 |

命中：**0**。未命中：**22**。不适用：**0**。

---

## 2. 六类形式指纹

| 指纹 | 判定 | 说明 |
|---|---|---|
| 破折号过密 | 未过密 | 正文段落几乎不用破折号。H3 标题三处 `—`、Sources 用 `—` 分字段，属于列表格式，不是散文堆砌。 |
| 粗体过密 | 未过密 | 粗体用于头词、两个官方名、表头、FAQ 里必须锁住的 Dragon / Warrior。不是每句加粗。 |
| 无用装饰符号 | 无 | 无 emoji、无装饰对勾。代码块只包 source line 与短标签。 |
| 助手残留 | 无 | 无 “as an AI”、无 `tmp/`、无检索日志、无给作者的范围指令。`2014 official pages used here` 是本篇引用范围，不是抓取过程。 |
| 填充短语 | 无 | 无 “delve / tapestry / in conclusion / it is worth noting”。 |
| 泛泛积极结尾 | 无 | 最后读者动作是填空白，然后来源清单。 |

必要对照表、H2/H3、编号 session check、mix-up 列表保留。不因“像模板”删除。

站点语气：用户未提供品牌语料。正文是具体说明语气，无虚构人格、无口号体。

---

## 3. 事实与引用

### 版本 / 数字 / 因果（抽查通过）

| 主张 | 本层核对 | 结果 |
|---|---|---|
| 2014：Small Humanoid (kobold), LE, AC 12, HP 5, 匕首+投石索 30/120, Pack Tactics, 日光=攻击+视觉 Perception | 打开 DDB 16939 | 支持 |
| 2024 Warrior：Small Dragon, Neutral, AC 14, HP 7, Initiative +2 (12), 三匕首 20/60, 无投石索, Pack Tactics 保留, 日光=ability checks and attack rolls, 无 Frightened 行 | 打开 DDB 5195096 | 支持 |
| 两版六维 7/15/9/8/7/8、速度 30、Darkvision 60、Common+Draconic、CR 1/8 | 两页对照 | 支持；正文把共用项写成 mix-trap，因果正确 |
| Small = 5×5 / 1 square，同 Medium；Tiny 才四只一格 | 任务卡/SRD 事实库；正文有 2024 free rules 链 | 支持 |
| 2024 PHB 十物种无 Kobold | 打开 DDB 1783 表 | 支持 |
| Volo 玩家勘误：+2 Dex only；Alignment 删除 | 打开 Volo SAE Kobold Traits p.119 | 支持 |
| MotM：Draconic Cry 替换 Pack Tactics；Kobold Legacy 替换 Grovel | 打开 DDB 1248 | 支持；正文只用电名，未整段抄规则句 |
| 无 kobold 模板；JPG/PNG/WEBP ≤10 MB；透明 PNG 256/512/1024/2048；local-first vs share | `tool-facts.json` TF-003/006/008/009/018 | 支持 |
| 2024 有翼是另一张卡，CR 1/4，Fly 30 | 任务卡 REF-WINGED-2024；正文未把 urd/Tiamat 当 SRD | 支持本篇所用上限 |

因果没有写反：共用 CR 不是可混的证明；Pack Tactics 不关闭日光；Scale 不改占用；火把不是阳光。

禁止虚构亲历：**无** “我用过 / 我们测过 / 导入了某战役”。

### 引用是否支持措辞

主锁年数字、日光范围、Pack Tactics 几何、可玩书名、Fan Content、SRD CC-BY 署名，与 `public-references.json` 及文内描述性链接匹配。

两处**不构成必须改**、但引用比正文略窄，记在这里以免 F 误当成已用该链证明了额外条款：

1. **可玩 H2**：“The same official overview says … ignore the old species ability score increase and take the background increase instead. That is a paraphrase of the D&D Beyond article.”  
   打开的 1783 文支持：2024 ASI 改由背景、旧物种仍可用、角色创建章有适配侧栏。它**没有**写出 “ignore the old species ASI” 这句操作。正文已标 paraphrase 并要求核对印刷侧栏，方向与 2024 设计一致，故不升为必须改。若 C 愿意收紧：把 “ignore…” 从 “overview says” 里拆出，只留给印刷侧栏。

2. **FAQ**：“MotM dropped a racial Alignment trait.”  
   打开的 MotM 介绍文未写 Alignment。Volo 勘误才删除 Alignment。MotM 玩家块通常不再带种族 Alignment，但是合成判断，不是该文原句。阵营问答的负载已由 2014 LE / 2024 Neutral / Volo 勘误承担。

3. **占用段** `dynamicTokenScale` **0.8**：主题事实库来自 foundryvtt/dnd5e `config.mjs`，为真。公开引用里的 Foundry Tokens 页只支撑 Dimensions≠Scale，不支撑 0.8。数字不是臆造，只是公开清单未挂源码链。

Sources 末条 `not a live walkthrough` 是证据边界，略像过程注，不是检索日志进正文。

未把 Wikidot 正文、未打开的 Volo/MotM 种族页、2014 有翼官方块写成已核验。

---

## 4. 保护的有效限制 / 反例

以下是读者完成锁年真正需要的边界，**不要当“堵反驳”或金句删掉**：

- 同一 CR 1/8 不是平均 Humanoid/Dragon 或 LE/Neutral 的许可
- 2014 投石索 30/120 与 2024 三匕首 20/60 不可换年；90 英尺是可用的射程反例
- 2014 日光留下非 Perception 检定缺口；2024 没有该缺口
- 火把 / 提灯 / 地道黑暗 ≠ 阳光
- Pack Tactics 数的是目标 5 英尺内未incapacitated 的盟友；10 英尺不够；陷阱不能代替这步
- MotM Draconic Cry 不上怪物卡；怪物 Pack Tactics 不上 MotM 玩家
- 官方页无 Frightened 免疫；忽略 fan-wiki 行
- 5esrd “kobold race”（Level Up / OGN）不是 Volo/MotM
- 2024 Winged Kobold 是另一张 CR 1/4 / Fly 30 的卡；不要发明 2014 有翼块；独特生态名不当 SRD
- Small 占 1 格，不是 Tiny 四只一格；Foundry Scale 缩图 ≠ 改占用
- 512 px / 70 px 是软件，不是五版导出法
- 无 Kobold 专用模板；预设 Warrior ≠ 2024 统计块
- 不承诺某命名 VTT 世界零配置导入
- 2014 陷阱风味句在 Basic Rules，不在 SRD 5.1，不是 CC 开放句
- 玩家体型/速度/黑暗视觉/身高：抄印刷 Volo/MotM，不靠记忆或第三方种族页

承担判断作用、应保留的句子：`Matching challenge rating 1/8 is the trap`；`Pick a column. Stop.`；`If you always give advantage because “kobolds swarm,” you stopped counting 5 feet.`

---

## 5. 图文是否服务主意图

封面 `cover-kobold.png` **未**插入正文，正确。

| 图 | 位置 | 是否服务主意图 | 核对 |
|---|---|---|---|
| FIG-01 `fig-01-lock-2014-2024.png` | 锁年 H2，source line 之后 | 是。两列 2014 Humanoid/LE/AC12/HP5 vs 2024 Warrior/Dragon/Neutral/AC14/HP7，中栏 Lock one year | 页脚 “Diagram, not a D&D Beyond screenshot.” Alt 含数字，与画面标签一致。插画姿态相似，不冒充两页截图。 |
| FIG-02 `fig-02-pack-tactics-grid.png` | Pack Tactics H2 | 是。可数 5 英尺格；每只 Small 一格。右栏是“贴着战士但没有盟友 → 无 Pack Tactics”，比“远处一只孤怪”更解主意图 | 非 VTT 截图。Alt “neighboring cell with no ally” 与右栏一致。 |
| FIG-03 `fig-03-snout-crop.png` | 可选 Crop H2 | 是身份课，不是产品截图。吻部/头冠留在圈内；蜡烛矿工与龙裔打 X | 页脚 “Crop diagram, not a Token Maker screenshot.” 四只 Tiny 头只在文字失败枝，图上未画，不损害主锁年。 |

生成插画未冒充操作截图或实测。FIG-02 是可控格子图，承担精确几何。三张图各自解一个点：锁哪一年、5 英尺怎么数、圈里要像 Small 爬虫人。

---

## 6. 局部改法（给 C；本层不改）

**必须改：0 条。**

可选（改了不必重开研究；若改，须新 hash 再走 D→E，旧 PASS 不能沿用）：

1. 可玩 H2：把 “ignore the old species ability score increase” 从 “the same official overview says” 拆开，改为 1783 只负责“旧物种仍可用 + 2024 ASI 在背景”，忽略旧物种 ASI 去印刷 2024 侧栏确认。
2. FAQ「good or evil」：可删 `MotM dropped a racial Alignment trait`（MotM 介绍文未写）；`+2 Dexterity only` 更贴「Can you play」而不是阵营问。
3. 占用段：`0.8` 要么在 Sources 增加 dnd5e `config.mjs` 公开链，要么删掉常数、只留 Dimensions≠Scale（公开 Foundry Tokens 页已够）。
4. Sources `token-maker-editor`：删 `not a live walkthrough`，改成该页实际支撑的 UI 名。
5. FIG-02 alt 可写成 “adjacent to the fighter but no ally”，与右栏课文完全同句。非错误。

不要为“更像人”加犹豫、失败故事或情绪曲线。不要把 Crop 扩成 VTT 导入教程。不要把可玩栅栏写成 MotM 特质 walkthrough。

---

## 7. 总评

**PASS。**

本层是内容审核（八层鉴文 1–7）。**第 8 层用户终审 = 尚未进行。** 内容 PASS 不代表用户或组页通过。

- 任务卡未擅自把 token 或 class build 并进 `dnd kobold` 主意图；不退 B；不退 A。
- 22 条：命中 0 / 未命中 22 / 不适用 0。
- 六类指纹无需要处理的过密或残留。
- 锁年数字、日光范围、Pack Tactics 几何、可玩书名与抽查来源一致；无虚构亲历。
- 有效限制已保护。图文服务主意图。
- **必须改条数：0。**
- 剩余风险：1783 文未打开 PHB 适配侧栏全文；MotM/Volo 种族页仍未打开（正文已要求抄印刷页）；`0.8` 未挂进公开引用。均不阻断本 hash 的内容审核。

D 与 E 现绑定同一候选 hash `31e9d41d39b9d1e7fd8d6be8b4b9695b2ba852288f69fac248534988839477ac`，可交 F 锁稿。F 生成 Title/描述后须再交 E 做 SEOTruth；G 组页后再交 E 看真实页面图文。本 PASS 不得沿用为标题 PASS 或页面 PASS。
