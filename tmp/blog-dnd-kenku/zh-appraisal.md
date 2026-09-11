# 独立鉴文（复验）：zh-body.md（天狗 Kenku）

- 状态：**PASS**
- 评审身份：原独立中文鉴文者。未参与本次局部修订，未改正文。旧 PASS 不自动覆盖新版本。
- 复验范围：只复核 `citation-audit.md` 的 ZH-F1..F4 与 `zh-revision-log.md` 声明的改动；未改段落抽查未发现新硬伤。
- 复验日期：2026-09-12
- 被审文件：`/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kenku/zh-body.md`
- 正文版本 hash：
  - 要求 `sha256_nfc_lf` = `46ed76373a95c9d5e8f802addd27916ab5c71fc4dce18dde4bf1b0f45d69e1d2`
  - 实测 `sha256_nfc_lf` = `46ed76373a95c9d5e8f802addd27916ab5c71fc4dce18dde4bf1b0f45d69e1d2`
  - 与旧稿 `9dc03e70…` 不同，本报告只绑定新 hash
- 计数（本评审重跑）：
  ```
  python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" \
    "/Users/wusir/Desktop/开发项目集合/token-maker-app/tmp/blog-dnd-kenku/zh-body.md" \
    --locale zh-CN --exclude-heading Sources
  ```
  机械单位 **3277**（门槛 2000）；`meets_mechanical_floor: true`；Sources 已排除。
- 主意图 / 体裁：未改。仍是已决定玩之后的中文上桌核对，不是英文种族指南译本。
- 用户终审：尚未进行。Title/H1/Description 未生成，SEOTruth 不适用。
- 本轮不改正文。无必须修订项，不另写 `zh-revision-requests.md`。

---

## ZH-F1..F4 复验

对照 `citation-audit.md` 必须改的原句，与 `zh-revision-log.md` 声称的四处。本评审自行打开 DDB 1787、Roll20 2024 Kenku，并全文检索残留词。

| ID | 审计要求 | 新稿实际 | 判定 |
| --- | --- | --- | --- |
| ZH-F1 官方侧栏 | 删「官方这篇侧栏」；勿假装已读 PHB/DDB 侧栏原文。可改成 RPGBOT 只处理加值、未裁决失语 | 全文无「官方这篇侧栏 / 官方侧栏」。第 44 句改绑英文 [D&D Beyond 博文 1787](https://www.dndbeyond.com/posts/1787-how-to-create-a-character-using-the-2024-players)：旧物种忽略种族加值、改由背景给 +2/+1 或三个 +1。「该说明只处理加值，没有写废除瓦罗失语。」RPGBOT 同指加值。对照表第 9 行改为「失语仍跟锁的那本书走」 | **通过** |
| ZH-F2 2024 怪物 | 删未引用的 60 尺黑暗视觉 / 原初语 / 诅咒传说 / 怪兽；或补允许来源且标明怪物≠玩家 | 第 46 句标明 [Roll20 2024《怪物图鉴》Kenku](https://roll20.net/compendium/dnd5e/Monsters:Kenku?expansion=34653) 是怪物页不是玩家种族；60 尺黑暗视觉、诅咒只能模仿发声、通用语和原初语（风族语方言）、Monstrosity（怪兽）均绑该页。玩家无黑暗视觉仍留（灰机两页未列） | **通过** |
| ZH-F3 德拉诺鸦人 | 删除「首先指向魔兽德拉诺鸟人」。可留「不要用鸦人当 Kenku 主词」 | 全文无「德拉诺」。表第 61 行：「不要用鸦人当 Kenku 主词」。撞车列名仍是「魔兽鸦人」，未展开未打开的百科正文 | **通过** |
| ZH-F4 开拓者长鼻羽扇 | 删除长鼻、羽扇、部分传承能飞。可留「开拓者条目也叫天狗，不是 DND Kenku」 | 全文无「长鼻 / 羽扇 / 部分传承能飞」。表第 59 行、第 67 句、Sources 开拓者条均为「开拓者条目也叫天狗，对应 Tengu，不是 DND Kenku」。四格 alt 与 Token 裁切句已去掉这些形态 | **通过** |

### 来源是否支持新措辞

**ZH-F1 / DDB 1787（本次打开）：** 文内转换框原文：

> For your species, ignore any Ability Score Increases the older species you chose provides.  
> For your background, increase one score of your choice by 2 and another by 1, or increase three scores by 1.

该框未写 Kenku、未写 Mimicry、未写废除失语。正文「写明忽略种族加值、改由背景给加值」「没有写废除瓦罗失语」与该框一致。未再把主张安到未引用的纸书侧栏上。

**ZH-F2 / Roll20 2024 Kenku（本次打开）：** Source = Monster Manual (2024)。数据：`Senses Darkvision 60 ft.`；`Languages Common, Primordial (Auran)`；`Medium Monstrosity`。传说：`The curse affecting kenku allows them to vocally communicate only by mimicking sounds they’ve heard.` 与正文四项一一对应。玩家卡禁抄写在同一句。

**ZH-F3：** 未再引用 `unverifiedAccess` 的百度百科正文。

**ZH-F4：** 主张收缩到条目标题级「天狗 = Tengu，不是 DND Kenku」，与审计允许保留的范围一致。

Sources 已补 1787 与 Roll20 两条，与正文主张对应。

---

## 指定检查点（抽查未改动主线）

| 重点 | 判定 |
| --- | --- |
| 独立中文任务（开口+撞名+不拖桌+token） | 仍成立；未改成英文种族指南 |
| 主词「天狗 Kenku」，无肯库 | 成立；无「肯库 / 克库」 |
| 灰机 MotM 无语言条 | 第 32 句仍写清 |
| 瓦罗失语不是所有天狗 | 第 24 句仍限定瓦罗玩家风味 |
| 四格划开 | 仍成立：Kenku / 阿兰寇拉 / 开拓者 Tengu / 日本天狗或鸦人。开拓者格改为专名划开，不再写未核形态 |
| 拟声三条可执行 | 未改，仍可执行 |
| 短称呼标明桌子约定 | 未改 |
| 无 FAQ 模块 | 仍无「常见问题」H2；仅工具内链 `/zh/faq` |
| 工具句不越权 | 工具段未改 |

---

## 五门

| 门 | 结果 | 依据 |
| --- | --- | --- |
| ResearchTrace | 通过 | 无检索日志。ZH-F1 已去掉「官方这篇侧栏」的已读伪装。第 34 句「对照已打开的英文 MotM 条目」仍是轻量过程口吻，不升为必须修订 |
| ReaderValue | 通过 | 锁书→开口→不混页→拟声三条→短称呼→Token 仍可执行 |
| Repetition | 通过 | 局部修订未新增同义段 |
| Length | 通过 | 3277 ≥ 2000 |
| SEOTruth | 不适用 | 锁后题文未生成 |

---

## 22 条（本轮）

未改段落沿用上次通读：无必须修订命中。与本轮改动相关的条目：

| 编号 | 判定 | 说明 |
| --- | --- | --- |
| 9 确定程度 | 未命中 | 失语效力改绑「锁的那本书」+「1787 只处理加值」，不再写成已读官方侧栏原文 |
| 10 虚假精确 | 未命中 | 2024 怪物数字改绑已打开的 Roll20 页 |
| 18 同义替换 | 未命中 | 「鸦人」只作禁止主词，不再展开魔兽设定 |
| 其余 1–8、11–17、19–22 | 未发现新命中 | 拟声三条、折树者示例、工具句、无祝福结尾均未改坏 |

六类指纹：无破折号堆砌、无 FAQ 模块、无填充祝福。粗体仍落在开口/无语言条/三条执行/桌子约定。

---

## 保护的有效判断（仍成立）

- 灰机缺语言条 ≠ 魔邓肯也不能说话。
- 瓦罗失语不是所有第五版天狗的共同禁令。
- 2024 转换说明不自动废除瓦罗失语；失语跟锁的书走。
- 短称呼是桌子约定。
- 2024 怪物页数据不填玩家卡。
- 不要用鸦人当 Kenku 主词；开拓者「天狗」是 Tengu，不是 DND Kenku。

---

## 剩余风险

1. 第 34 句「已打开的英文 MotM 条目」、第 95 句「未核验的汉字」仍是轻量作者口吻，非本轮硬伤。
2. 1787 转换框另有 Origin feat 一句；正文用「只处理加值」是相对失语规则而言，未把 feat 写成已读细节。不构成措辞失败。
3. `zh-public-references.json` 仍是写作前候选池，未列入 1787/Roll20；读者正文 Sources 已列。装配时以正文 Sources 为准。
4. 图文件尚未组进现有网站。用户终审未开始。

---

## 结论

**PASS。** 绑定 hash `46ed76373a95c9d5e8f802addd27916ab5c71fc4dce18dde4bf1b0f45d69e1d2`。ZH-F1 至 ZH-F4 已按审计改掉，新句有已打开来源支撑。无必须修订硬伤。
