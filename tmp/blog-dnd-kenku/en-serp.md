# SERP / 意图研究：dnd kenku

- 核验日期：2026-09-11
- 目标站：https://www.tokenmaker.one
- 主词：dnd kenku
- locale=en, country=US（研究目标；**未取得**精确美国 Google SERP）
- 本文件：内部研究记录。禁止把检索过程、排名或本文件句子改写成读者正文。

---

## 1. 查询日志

| 序号 | 查询 | 日期 | 提供方 | 地区/语言参数 | 回执 |
|---|---|---|---|---|---|
| Q1 | `dnd kenku` | 2026-09-11 | xAI `web_search` | 工具无 gl=US / hl=en 回执 | 返回英文可访问自然结果列表。结果顺序是该工具排序，**不是** Google 美国前五。 |
| Q2 | `dnd kenku 5e` | 2026-09-11 | xAI `web_search` | 同上 | 偏向 5e 种族指南（Wargamer、WWG、wikidot、RPGBOT、Muse Dungeon）。 |
| Q3 | `kenku 5e traits mimicry` | 2026-09-11 | xAI `web_search` | 同上 | 强化 Mimicry / 能否说话 / Volo vs MotM。 |
| Q4 | `kenku dnd beyond race` | 2026-09-11 | xAI `web_search` | 同上 | 多为 D&D Beyond **论坛**，不是官方种族页。 |
| Q5 | `https://www.google.com/search?q=dnd+kenku&hl=en&gl=us&pws=0` | 2026-09-11 | `web_fetch` | 请求了 hl=en、gl=us、pws=0 | **未取得。** Google 返回 unusual traffic / CAPTCHA。IP `9.142.9.112`，时间 `2026-09-11T15:58:13Z`。未绕过验证码。 |
| Q6 | `https://www.dndbeyond.com/races/kenku` | 2026-09-11 | `web_fetch` | — | **未取得。** HTTP 页面为 Not found。 |
| Q7 | `https://www.dndbeyond.com/races/14-kenku` | 2026-09-11 | `web_fetch` | — | **未取得。** HTTP 页面为 Not found。 |

说明：仅在查询中使用英文 ≠ 已取得美国 Google SERP。下列样本按 Q1 工具返回顺序记录，并打开正文核验。不得把该顺序写成“美国排名”。

---

## 2. 本站与项目观察（只读）

观察日期：2026-09-11。范围：线上首页、FAQ、sitemap、llms.txt、四篇指定博客；本地 `src/lib/blog-posts/`、`src/lib/blog/registry.ts`、全库 `kenku` 字符串、`public/`。

### 2.1 首页 / 编辑器（工具事实，仅官方页可见能力）

来源：https://www.tokenmaker.one/ 、https://www.tokenmaker.one/faq 、https://www.tokenmaker.one/llms.txt 。本次**没有**点击进入编辑器实际导出一张 kenku token，也没有在 Roll20 / Foundry / Owlbear 里实测导入。

站点自称能做：

- 浏览器 VTT token：上传立绘 → 裁切 / 定位 → 遮罩 → 边框 → 文字 → 导出。
- 遮罩：圆形、方形、多边形（首页写 “Circle to d12”）。
- 边框、tint、内置边框、自定义边框图。
- 文字 overlay / labels。
- 透明 PNG，导出上限 2048。
- 默认流程 local-first：裁切与导出时立绘可留在浏览器。
- 导出文件面向接受图片 token 的 Roll20、Foundry VTT、Owlbear Rodeo。
- 同站另有 Dice Roller、Coat of Arms Maker、方形 token 模板页。

不得承诺（本次未观察或站点未写）：

- kenku 专用预设、种族滤镜、自动生成鸟人立绘。
- 已实测某 VTT 客户端透明通道 / 缩放。
- 导出速度、画质评分、隐私以外的第三方政策。
- 把 Grung 旧文里的 “hex mask” 写成已核验独立六边形产品名；官方文案是 circle / square / polygon。

### 2.2 已有博客与 kenku 专页

| 页面 | 线上 URL | 本地 slug | 与 kenku 关系 |
|---|---|---|---|
| 种族总览 | https://www.tokenmaker.one/blog/dnd-races | `dnd-races` | 2024 PHB 十个 species。Kenku **不在**该十个名单。任务是选 species，不是建 kenku。 |
| Dragonborn | https://www.tokenmaker.one/blog/dnd-dragonborn | `dnd-dragonborn` | 已决定玩该种族后：锁 2014/2024、抄特性、裁 token。结构可参考，内容不覆盖 kenku。 |
| Grung | https://www.tokenmaker.one/blog/dnd-grung | `dnd-grung` | 核心书外的官方可选种族：特性、DM 批准、token。无 kenku。 |
| Dhampir | https://www.tokenmaker.one/blog/dnd-dhampir | `dnd-dhampir` | 谱系 / 咬击 / 职业。无 kenku。 |

冲突检查：

- 线上 sitemap（2026-09-11 抓取）含 `dnd-races`、`dnd-dragonborn`、`dnd-grung`、`dnd-dhampir`，**不含** `dnd-kenku` 或任何 kenku URL。
- 本地 `src/lib/blog-posts/` 无 kenku 文件。
- 全库 grep `kenku`（ts/tsx/md/json）：**无匹配**。
- `public/` 无 kenku 资源。
- `llms.txt` 博客清单无 kenku。

结论：**当前观察范围内没有 kenku 专页。** 不是“全互联网没有”，是本站 sitemap + 本地 registry + 字符串检索范围内没有。

---

## 3. SERP 样本表

前五个为 Q1 返回且已打开正文的自然结果。排名只描述工具返回顺序。

### 样本 1

- URL：https://en.wikipedia.org/wiki/Kenku
- 页面类型：百科（出版史 + 设定，不是 5e 建卡表）
- 解决的问题：kenku 是什么；各版外观（早期有翼 hawk → 后期无翼 raven/crow）；tengu 灵感；Volo 诅咒叙事（失翼、失声、失创造力）；可玩种族出自 *Volo's Guide to Monsters*。
- 前提 / 限制：二手综述；5e 段落停在 Volo / 2014 MM，**未展开** *Monsters of the Multiverse* 可说人话的改写；无职业搭配、无 token。
- 例子：Fiend Folio 1981；2e Monstrous Manual；3.5 MM III；4e MM2；5e MM + Volo。Jeremy Crawford 关于拼贴已听声音交流的引述。
- 未回答：Volo vs MotM 特性对照；2024 PHB 是否收录；Mimicry 检定写法；建卡步骤；VTT 辨识。

### 样本 2

- URL：https://wastedwizardgames.com/dnd/5e/races/kenku/
- 页面类型：商业站 5e 种族指南（夹 PDF 角色卡 / 状态环销售）
- 解决的问题：按“偷盗/伪造/拟声”卖点讲特性、职业、命名、FAQ；文末把 MotM 说话限制放松写成 2024 旁注。
- 前提 / 限制：主体按 **Volo 固定 +2 Dex / +1 Wis、Kenku Training 四选二** 写。FAQ 才说 2021 重印可正常说话。文中写 “Kenku have wings but can't fly”，与本次打开的 Wikipedia / wikidot 5e「无翼」描写冲突——写作者必须用官方书核验，不能跟这篇。
- 例子：Rogue / Ranger / Monk；拟声名 Smasher、Clang；FAQ：无黑暗视觉、不能飞。
- 未回答：两套规则如何抄到同一张卡而不混；token 裁切；2024 背景加值如何接 MotM；与 aarakocra 外观差。

### 样本 3

- URL：https://www.wargamer.com/dnd/kenku-5e
- 页面类型：游戏媒体种族指南（标注 Updated Sep 26, 2022）
- 解决的问题：名字三类（战斗声 / 动物暗号 / 职业声）；MotM 摘要（可变加值、Medium or Small、Expert Duplication、Kenku Recall、Mimicry）；点出旧版只能拟声；职业以 Bard 为 MotM 首选、Rogue 为跨版本稳妥。
- 前提 / 限制：2022 文；加值那一行把 “any two **skills**” 写成 ability 表，措辞不严谨；无建卡检查清单；无 token。
- 例子：Whistler、Crasher、Door Slam、Rat Scratch。
- 未回答：2024 规则下 ASI 改走背景；拟声在桌面上的操作流程；无黑暗视觉的地下城准备；token。

### 样本 4

- URL：https://dnd5e.wikidot.com/lineage:kenku
- 页面类型：非官方规则转写（MotM 块 + Volo 块）
- 解决的问题：把两套可玩条目并排抄出来，便于对照。
- 前提 / 限制：粉丝转写，不是 Wizards 原文页。本次未打开对应官方 PDF / D&D Beyond 种族页（Beyond 两 URL 404）。写作者引用具体数字前须对官方来源。
- 例子：MotM：Humanoid；Medium or Small；Expert Duplication；Kenku Recall（任两技能 + 熟练项优势，次数=熟练加值）；Mimicry DC = 8 + PB + Cha；语言为 Common + 自选。Volo：+2 Dex / +1 Wis；仅 Medium；Expert Forgery；Kenku Training 四选二；Mimicry 为 Insight vs Deception；读写真 Common 和 Auran，说话只能用 Mimicry。
- 未回答：选哪一套；拟声会不会拖慢桌子；职业；token；怪物 CR 块。

### 样本 5

- URL：https://criticalrole.miraheze.org/wiki/Kenku
- 页面类型：设定 wiki（仅 Exandria / Critical Role）
- 解决的问题：Exandria 外观与起源（曾为鸦后天使，Calamity 后失翼、失忆、只能拟声）；NPC Kiri。
- 前提 / 限制：页首声明只覆盖 Exandria。Wildemount 起源 ≠ 被遗忘国度 / Volo 无名主神诅咒。不能当通用 5e 建卡页。
- 例子：Kiri（Mighty Nein）；引用 EGtW p.176–177；链到 D&D Beyond kenku（该 Beyond URL 本次 404）。
- 未回答：Volo vs MotM 表；通用桌怎么锁书；token；非 CR 战役。

### 额外打开（非 Q1 前五，用于判断版本意图）

- URL：https://rpgbot.net/dnd5/characters/races/kenku/
- 页面类型：优化手册（更新标注 2025-10-29）
- 解决的问题：三套 kenku（Volo/EGtW、Tasha 自定义起源、MotM）；拟声在桌面上常被演成“只会复读整句”是最差情况；2024 玩 kenku 时忽略 MotM 的 ASI、改用背景加值；分 Custom Origin 与 Classic 两套职业评级。
- 前提 / 限制：优化导向，几乎无 token；拟声“音节库”段落是作者分析，不是规则原文。
- 未回答：VTT 辨识；与 aarakocra 的视觉差；本站工具流程。

### Q1 列表中未整页打开的结果（禁止当已读样本）

| URL | 状态 |
|---|---|
| https://1d6chan.miraheze.org/wiki/Kenku | 仅搜索摘要：跨版历史。未整页打开。 |
| https://adnd2e.fandom.com/wiki/Kenku | 仅摘要：2e 有翼 hawk。未整页打开。 |
| https://roll20.net/compendium/dnd5e/Monsters:Kenku?expansion=34653 | 仅摘要：2024 怪物块（Medium Monstrosity 等）。未整页打开。 |
| https://dice-scroller.com/en/kenku-in-dnd/ | 仅摘要：AI 插画 + 混用特性名。未整页打开。 |
| https://mythopedia.com/name-generator/dnd-kenku-names/ | 仅摘要：拟声名字生成。未整页打开。 |

---

## 4. 相关搜索 / PAA

| 项 | 状态 |
|---|---|
| Google People Also Ask | **未取得。** 美国 Google SERP 遇 CAPTCHA。禁止编造 PAA。 |
| Google 相关搜索 | **未取得。** 同上。 |
| 工具“相关搜索”模块 | **未取得。** `web_search` 不返回 Google 相关搜索条。 |

研究者自行加查（不是 Google 相关搜索，只作意图材料）：

- `dnd kenku 5e`：建卡 / 特性 / 职业。
- `kenku 5e traits mimicry`：说话限制与 Mimicry 判定。
- D&D Beyond 论坛可见玩家问题（论坛 ≠ 官方种族页）：MotM 还能不能只靠拟声说话；该抄 Volo 还是 MotM。

这些扩展问题用于判断主意图，**不是**必须写进正文的目录。

---

## 5. 主意图（只选一个）

已经决定玩一只 **dnd kenku** 的 5e 玩家：先向 DM 锁抄哪一本（Volo / EGtW 旧块，或 MotM 新块；2024 桌则 MotM 特性 + 背景加值），再按那一页抄拟声/语言/技能包，最后裁一枚能看出「无翼鸦人、不是 aarakocra」的 VTT token。

不选的相邻意图（留给别篇或内链一句）：

- 跨版出版史 / tengu 考据（Wikipedia）。
- Exandria / Kiri 剧情（CR wiki）。
- 全职业配色优化（RPGBOT）。
- 拟声名字生成器（Mythopedia）。
- 作为敌人的怪物 CR 块（Roll20 摘要，未打开）。

文章类型：单一种族操作指南（与现有 `dnd-dragonborn` 同型：锁书 → 抄块 → 裁 token），不是 2024 十种族总览（那是 `dnd-races`）。

---

## 6. ReaderTask

| 字段 | 内容 |
|---|---|
| 主词 | dnd kenku |
| 读者条件 | 英文桌、准备建 5e 角色的玩家或临时要出 kenku NPC 的 DM；已听说是鸦人，需要落到**一张不混书的角色卡 + 一枚能认出来的 token**。不要求已买齐书，但必须能说出自己抄的是哪一页。 |
| 完成标志 | 读者能写出：规则来源一行；会不会正常说话；Mimicry 用哪套判定；技能包是 Training 四选二还是 Recall 任两技能+优势；体型是否可选 Small；有无黑暗视觉；token 上保留喙与羽毛头、不画能飞的翅膀。 |
| 范围边界 | 不写 AD&D 有翼 hawk 专章；不写 CR 战役回顾；不写全职业评级长文；不写名字生成大表；不把怪物 stat block 当玩家种族；不承诺 2024 PHB 核心十种里有 kenku（本站 `dnd-races` 已列十种，无 kenku）。 |
| 完成主任务必需的子问题 | 1. 5e kenku 是什么、与 aarakocra 差在哪。2. 锁 Volo/EGtW 还是 MotM，2024 桌 ASI 怎么处理。3. 说话：只能拟声还是可正常说话仍保留 Mimicry。4. 按锁定书抄特性（伪造/复制、技能、体型、语言）。5. 无黑暗视觉要带什么光。6. 裁 token：喙、羽、无翼剪影。 |
| 工具关联（必须服务主任务） | 锁书与抄特性之后，用 Token Maker 把已有鸦人立绘裁成可读 token。能力以首页/FAQ 为准，见第 9 节。 |

---

## 7. 信息增益

### 现有前五已覆盖

| 覆盖 | 谁覆盖 |
|---|---|
| 词义：鸦/乌鸦类人、拟声、失翼诅咒叙事 | Wikipedia、WWG、Wargamer |
| MotM 与 Volo 两套数字并排 | wikidot（最完整的表）；Wargamer（MotM 摘要）；WWG（Volo 主体 + 文末 MotM） |
| 职业印象：Rogue / Ranger / Monk / Bard | WWG、Wargamer |
| 拟声命名习惯 | Wargamer、WWG |
| Exandria 特殊起源 | CR wiki（**不是**通用 5e 任务） |

### 前五缺口（本篇只补服务主任务的）

1. **锁书动作**：一张表写清「问 DM 抄哪页，禁止 Volo 失声 + MotM Recall 混搭」。前五有并排数字，没有本站 dragonborn 那种决策步骤。
2. **2024 桌接法**：kenku 不在 2024 PHB 十 species（本站 `dnd-races` 已核）。RPGBOT 写了“忽略 MotM ASI、用背景加值”；前五没把这句接到建卡顺序。
3. **拟声的桌面流程**：判定是 Insight vs Deception 还是固定 DC；MotM 可说话时 Mimicry 还在；如何避免整场只复读梗。服务「抄对语言行」，不是另开扮演专章。
4. **外观与 token 辨识**：5e 无翼鸦人 vs 有翼 aarakocra；喙和头羽必须进圆框；不要画能飞的翅膀。WWG 还写了“有翅膀不能飞”，本篇应用官方描写纠正这一常见混法（须再核官方书，不把 Wikipedia 当规则）。
5. **无黑暗视觉**：前五 FAQ 有一句。本篇只保留「地下城要带灯/靠队友」，不扩成照明规则文。
6. **本站工具**：上传立绘、圆/方/多边形遮罩、边框与文字、透明 PNG。前五全是纯规则站，没有 VTT 裁切步骤。

不要为了凑字写：tengu 民俗长考、Kiri 剧情、全职业配色、名字 d100。

---

## 8. H2 计划草案（给写作者，不是最终标题）

1. **先锁书再抄 kenku**  
   开篇表：Volo/EGtW 一块、MotM 一块、2024 桌（MotM 特性 + 背景加值）。问 DM。禁止混搭。

2. **5e kenku 是什么（以及不是 aarakocra）**  
   无翼鸦人、拟声、城市边缘。一眼可认：喙、羽、没有飞行翅膀。

3. **按锁定页抄特性**  
   对照：加值、体型、Expert Forgery vs Duplication、Training vs Recall、语言、Mimicry 判定。只解释会写错的差，不复述两套全文。

4. **拟声在桌上怎么用**  
   旧块：说话=已听过的声音。新块：可正常说话，Mimicry 仍是工具。各给一个标明「示例」的短场面。点出无黑暗视觉。

5. **职业只写到能填卡**  
   锁 Volo 时 Dex/Wis 指向 Rogue/Ranger/Monk；锁 MotM 后职业面变宽。不写全职业配色表。内链 `dnd-classes-explained`。

6. **裁一枚还能看出是 kenku 的 token**  
   圆框保喙和头羽；边框别切掉喙；标签用短称呼；和有翼鸟人、纯乌鸦宠物区分。指向编辑器，不写未点过的按钮坐标。

7. **常见混法（短）**  
   当成 2024 核心种；混两套说话规则；token 画成 aarakocra；把 CR 鸦后起源写进被遗忘国度卡。

每节必须推进「锁书 → 抄块 → 能认的 token」。不要把 PAA 拼成大纲。

---

## 9. 图位草案

正文锁前需要服务主任务的图，不是装饰封面。精确规则图用示意图；外观辨认可用生成插画并标明是插画；**禁止假装截图**。

| 位置 | 读者要看懂什么 | 图类型 | 依据 / 禁令 |
|---|---|---|---|
| H2-1 锁书 | 两列：Volo 块 vs MotM 块，中间「问 DM、不要混」 | 示意图（表或两栏流程图） | 数字以写作者核过的官方条目为准。不是搜索排名图。 |
| H2-2 辨认 | 无翼 kenku 剪影 vs 有翼 aarakocra 剪影 | 生成插画或平面剪影，caption 写明非官方图 | 禁止当官方 MM 原画。禁止把早期有翼 kenku 标成现行 5e 玩家外观，除非单独标注旧版。 |
| H2-3 或 H2-6 | 圆 token 裁切：喙、眼、头羽在框内；翅膀不是焦点 | 示意图（裁切框叠在插画上） | 示意图。若用编辑器真界面，必须实拍本站编辑器，禁止用生成图假冒 UI。 |
| H2-6 可选 | 边框对比：厚框切掉喙 vs 留气口的可读框 | 示意图或**真实**编辑器截图 | 本次研究**未**实操编辑器。写作/装配阶段若要截图，须当场导出；没有实拍就不要写按钮路径。 |
| 封面 | 一只无翼鸦人冒险者，喙和羽毛可读 | 生成插画 | 与 dragonborn/grung 封面同类。不假装官方艺术。 |
| 禁止 | D&D Beyond 角色生成器、Google SERP、未拍摄的 Token Maker 面板 | — | 本次 Beyond 种族页 404；Google CAPTCHA；编辑器未点击。 |

表格可承担 Volo vs MotM 精确对照，不能代替「喙必须进圆框」的空间图。

---

## 10. 工具关联（写作者可用句，须保持条件）

允许（有官方页）：

- 上传已有 kenku 立绘，裁切后加圆形/方形/多边形遮罩、边框、文字，导出透明 PNG（上限 2048）。
- 默认裁切导出路径是 local-first。
- 文件用于接受图片 token 的 Roll20、Foundry VTT、Owlbear Rodeo。
- 需要掷 Mimicry 相关 Insight / Deception 时，可链到同站 Dice Roller；不要写成“本工具内置 kenku 拟声规则”。

禁止：

- kenku 一键预设、自动生成官方鸟人、已测 VTT 导入。
- “我们导出后在 Foundry 里更清晰”类实测句（未测）。
- 用工具页证明 Volo/MotM 规则。

内链候选（真实已有）：`/blog/dnd-races`（kenku 不在 2024 十种）、`/blog/dnd-dragonborn`（同型锁书流程）、`/blog/dnd-classes-explained`、`/#editor-workspace`、`/faq`、`/dice-roller-dnd`。不要链不存在的 `/blog/dnd-kenku` 旧页。

---

## 11. 未取得项

| 项 | 实际错误 / 状态 |
|---|---|
| 美国 Google SERP 前五 | `web_fetch` Google 搜索 URL 返回 CAPTCHA / unusual traffic。未绕过。不得把 xAI `web_search` 顺序标成美国前五。 |
| Google PAA | 未取得。 |
| Google 相关搜索 | 未取得。 |
| D&D Beyond 官方 kenku 种族页 | `https://www.dndbeyond.com/races/kenku` 与 `.../races/14-kenku` 均为 Not found。论坛提到 MotM 现页，本次未解析到可打开的官方 URL。 |
| 官方 PDF（Volo、MotM、2024 PHB kenku 条目） | 未打开。wikidot 仅作竞品结构，不足以为正文数字背书。 |
| Q1 第 6 名及以后整页 | 1d6chan、2e fandom、Roll20 怪物、Dice Scroller、Mythopedia 仅摘要。 |
| 本站编辑器实操 | 未点击 workspace，未导出 kenku PNG，未导入任何 VTT。 |
| 本站 kenku 专页 | 观察范围内不存在（见第 2.2 节）。 |

写作者：规则数字必须另开官方来源核验后再进正文。本文件只定意图与信息增益，不提供已核验的规则摘录。
