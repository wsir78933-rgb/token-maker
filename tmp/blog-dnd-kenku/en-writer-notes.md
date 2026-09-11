# EN writer notes — dnd kenku

不是读者正文。装配/SEO/鉴文用。

## 工作题（不是最终 Title/H1）

Lock the Kenku book, copy mimicry, crop a beak-readable token

## 主意图是否写偏

否。路径仍是：已决定玩 Kenku → 向 DM 锁 Volo/EGtW 或 MotM（2024 桌 = MotM 特性 + 背景加值）→ 按那一页抄说话/拟声/技能包 → 裁一枚无翼鸦人 token。未写 AD&D 有翼 hawk 专章、未写 Kiri 剧情、未写全职业配色、未写名字 d100、未把怪物块当玩家种族、未声称 2024 PHB 核心 species 含 Kenku。

## 完成标志落点

| 标志 | 正文位置 |
|---|---|
| 规则来源一行 | 开篇三句；Lock A/B/C；示例 source line；Session-zero 第 1 条 |
| 会不会正常说话 | 开篇第 2 句；对照表；Languages；Mimicry 两套流程 |
| Mimicry 用哪套判定 | 对照表；Volo opposed Insight/Deception；MotM DC 8+PB+Cha（标转写）；怪物 DC 14 |
| Training vs Recall | 对照表；Kenku Training versus Kenku Recall |
| 体型是否可选 Small | 对照表；Size and speed；Volo 仅 Medium，MotM Medium or Small |
| PC 有无黑暗视觉 | 对照表；No Darkvision on the player；2024 怪物 60 英尺不可抄到 PC |
| token 喙与头羽、不画能飞的翅膀 | 开篇第 3 句；辨认图；裁切节 + 失败分支 |

## 图位

| 文件 | 位置 | 读者判断 | 禁令 |
|---|---|---|---|
| `/blog/inline/dnd-kenku/kenku-book-lock.webp` | H2 Lock the Kenku book first | 两栏 Volo vs MotM，中间问 DM、不要混 | 示意图，不是 SERP/排名图 |
| `/blog/inline/dnd-kenku/kenku-vs-aarakocra.webp` | H2 What a 5e Kenku is on the map | 无翼 kenku vs 有翼 aarakocra | caption 已写 unofficial，非 MM 原画 |
| `/blog/inline/dnd-kenku/kenku-token-crop.webp` | H2 Crop a beak-readable Kenku token | 圆框内必须有喙和头羽 | caption 已写不是 Token Maker 截图 |

装配阶段换成真实 webp。正文未假装编辑器 UI。

## 内链（已写入）

- `/blog/dnd-races` — 并写明该名单无 Kenku
- `/#editor-workspace`
- `/blog/dnd-classes-explained`
- `/dice-roller-dnd`
- `/faq`
- `/blog/dnd-dragonborn` — 仅一句结构对照

未链 `/editor`、不存在的 `/blog/dnd-kenku` 旧页、placeholder 博客。

## 引用与版本标记

公开主链只用 `en-public-references.json` 十一条。

正文里必须带版本/转写标记的句子：

- Volo’s Languages「只能用 Mimicry 说话」：Volo’s/EGtW 玩家；标 trait transcription；勘误块标题 p. 111
- MotM 可 speak/read/write Common+1：MotM 第一章总则，不是 2024 PHB
- MotM Mimicry DC 8+PB+Cha、Recall 次数：MotM transcription；专页付费墙，要求对印刷 MotM Kenku 条目
- 2024 用旧物种：忽略旧 ASI；侧栏**没有**废除 Volo 失语（未决，要求问 DM）
- 2014 MM vs 2024 MM：怪物 ≠ PC；2024 语言栏与传说两句并列，不塌缩
- Expert Forgery / Expert Duplication 全文：转写 + DDB 索引确认名称

## 未采用主张（F27 及范围外）

- Kenku 是 2024 PHB species
- 所有 5e Kenku 都不能说话 / 都能正常说话
- Kenku 有飞行；Volo/MotM PC 有黑暗视觉
- Expert Forgery 复制魔法物品功能
- Mimicry 是一个 Action
- 官方最佳职业是 Rogue
- 2024 已废除 Volo 失语
- FR Wiki 数字当规则
- Jeremy Crawford 推文原文（未打开）
- DMG 2014 p.282 NPC Kenku 黑暗视觉（未开 PDF）
- AD&D 有翼 hawk 出版史、tengu 民俗、Kiri/Exandria 剧情、名字生成大表、全职业配色
- 「我们实测 Foundry」；Kenku 专用模板；商用授权；`/editor` 路径

## 计数

脚本：`python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" ".../en-body.md" --locale en --exclude-heading FAQ --exclude-heading Sources`

结果写入 `en-count.json`。`mechanical_units` = 4039（≥ 2000）。未因不足而补民俗史。
