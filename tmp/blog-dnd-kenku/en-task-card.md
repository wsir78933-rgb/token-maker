# EN ReaderTask — dnd kenku

locale=en, country=US (SERP 未取得精确当地前五；意图来自已打开英文页)
核验日：2026-09-11
工作题（不是最终 Title/H1）：Lock the Kenku book, copy mimicry, crop a beak-readable token

## 主意图
已经决定玩 dnd kenku 的 5e 玩家：先向 DM 锁抄 Volo/EGtW 还是 MotM（2024 桌用 MotM 特性 + 背景加值），再按那一页抄语言/拟声/技能包，最后裁一枚能看出无翼鸦人、不是 aarakocra 的 VTT token。

## 完成标志
读者能写出：规则来源一行；会不会正常说话；Mimicry 用哪套判定；技能包是 Training 还是 Recall；体型是否可选 Small；PC 有无黑暗视觉；token 上保留喙与头羽、不画能飞的翅膀。

## 范围边界
不写 AD&D 有翼 hawk 专章；不写 Critical Role/Kiri 剧情；不写全职业配色；不写名字 d100；不把怪物 stat block 当玩家种族；不声称 2024 PHB 核心 species 含 Kenku。

## 必须使用的已核验事实（见 en-facts.md）
- 2024 PHB / Free Rules **没有** Kenku species。
- Volo’s PC：只能用 Mimicry 说话；+2 Dex/+1 Wis；Medium；Expert Forgery；Kenku Training；Mimicry = Insight **opposed by** Deception；无黑暗视觉。
- MotM PC：可 speak/read/write Common + 1；Expert Duplication；Kenku Recall；Mimicry = Insight vs DC 8+PB+Cha（全文页未打开，写对比时标明来自 MotM 条目转写/索引，不要假装已读付费专页）。
- 2024 用旧物种：忽略旧种族 ASI，背景给加值。侧栏**没有**写废除 Volo 失语。
- 2014 怪物 vs 2024 怪物 ≠ PC。2024 怪物有 Darkvision 60；PC 没有。
- 禁止混搭：Volo 失语 + MotM Recall。

## 工具（tool-facts.md）
编辑器在 `/#editor-workspace`。JPG/PNG/WEBP ≤10MB。透明 PNG 256/512/1024/2048。边框/遮罩/文字。无 Kenku 模板。面向接受图片 token 的 Roll20/Foundry/Owlbear，不是兼容保证。禁止实测句、商用授权、/editor 路径。

## 内链
`/#editor-workspace`、`/blog/dnd-races`（须说明名单无 kenku）、`/blog/dnd-classes-explained`、`/dice-roller-dnd`、`/faq`。可选 `/blog/dnd-dragonborn` 一句结构对照。

## 公开引用优先
D&D Beyond species 索引、2024 Creating a Character / Character Origins、官方博文 10 species 与 2024 旧物种转换、Volo/MM2014 errata、Roll20 2024 MM Kenku、AideDD 2014 怪物。不要把 wikidot 当官方原文主链。

## 图位（正文锁前必须有，caption 服务任务）
1. 锁书两栏示意图（Volo vs MotM，中间「问 DM、不要混」）
2. 无翼 kenku vs 有翼 aarakocra 辨认插画（caption 写明非官方图）
3. 圆 token 裁切：喙和头羽在框内

## 文风
像 dnd-dragonborn：前三句给答案；具体、可执行；不要「If you searched for」；不要虚构亲历测试；示例标明示例。自然使用主词 dnd kenku。

## 交付
- `tmp/blog-dnd-kenku/en-body.md` 纯 Markdown 正文（H2/H3，无 YAML）。FAQ 单独一节标题必须是 `FAQ`，计数时排除。
- 文末附录：使用的公开引用列表（id, label, url, 支撑的句子）。
- 用 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py en-body.md --locale en --exclude-heading FAQ --exclude-heading Sources` 达到 mechanical_units >= 2000。不足则只在主意图内补真实决策/例子/限制，不跑题。
