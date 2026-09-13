# 中文眼魔稿备注

未改 `src/`。稿只写在 `tmp/blog-dnd-beholder/`。

## 汉字粗估

计数脚本：去掉全部 `<figure>…</figure>`（图注、alt 一并剔除）、`<h2>来源</h2>` 及其后清单、所有 `h1–h6`，再剥标签，数 `\u4e00–\u9fff`。表格单元格计入。

- 合格汉字：4531（门槛 2000）
- 其中对照表贡献：926
- 全文汉字（含标题、图注、来源）：4951
- `relatedSlugs`：`spectator-dnd`、`mind-flayer-dnd`、`dnd-flumph`

正文无 FAQ、无「常见问题」、无英文 FAQ 标题。开头 `<p>` 含 `<strong>dnd beholder</strong>` 与「眼魔」。两处设计示例写明「设计走位，不是某次跑团记录」。

## 引用

印本为准。下列为转写，冲突听印本。

- 2014 AideDD `https://www.aidedd.org/dnd/monstres.php?vo=beholder`（占位 `${BEHOLDER_2014_AIDEDD_URL}`）
  - 大型异怪，守序邪恶，AC 18（天生护甲），HP 180（19d10+76），速度 0、飞行 20（悬浮）
  - 豁免 智力+8 感知+7 魅力+8；察觉+12；免疫倒地；黑暗视觉 120；被动察觉 22；深潜语、地底通用语；挑战等级 13
  - 未列传奇抗性
  - 反魔锥为特质；啮咬 +5，14（4d6）穿刺；一个动作随机三条眼射线（重复重骰）；传奇 3，仅 Eye Ray
  - 十条射线 DC 16 与失败/半伤行，按该页抄入对照表
- 2024 AideDD `https://www.aidedd.org/monster/beholder`（占位 `${BEHOLDER_2024_AIDEDD_URL}`）
  - 结构核对：先攻 +12（22），HP 190，飞行 40（悬浮），附赠动作反魔锥，多重攻击，传奇抗性，Chomp / Glare
  - 该页正文缩略，射线细则以 Roll20 为准
- 2024 Roll20 `https://roll20.net/compendium/dnd5e/Monsters:Beholder?expansion=34653`（占位 `${BEHOLDER_2024_ROLL20_URL}`）
  - 力量 16；体质豁免 +9、感知 +7；挑战等级 13（巢穴 XP 11500）
  - 传奇抗性 3/日（巢穴 4）；多重攻击：眼射线三次；啮咬 +8，13（3d6+3）穿刺
  - 每次随机一条（1d10，本回合已用则重骰）；反魔锥为附赠动作
  - 传奇 3（巢穴 4）：Chomp、Glare
  - Charm/Fear 带心灵伤害且成功半伤；Fear 只到目标下回合结束；Slowing 改体质且带暗蚀；Enervation 毒素+中毒不能回血；解离 36（8d8）力场成功半伤；死亡射线成功半伤
- 灰机《怪物图鉴（2025）》目录 `https://dnd.huijiwiki.com/wiki/怪物图鉴（2025）`
  - 只核译名：眼魔、观察者眼魔、亡眼暴君、眼魔丧尸
  - 灰机「眼魔」专页停在验证/请稍候，未采数字
- 中文维基无「眼魔」条目，英文维基未作规则来源
- 珊娜萨只点名，无未核验数值

射线中文名用通行译名（魅惑/麻痹/恐惧/迟缓/衰弱/心灵传动/睡眠/石化/解离/死亡），不从灰机专页取数。

## 图位

规格：`figure.inline-figure.inline-figure--wide-crop`，`img.inline-figure__image.inline-figure__image--wide`，1536×1024，`loading="lazy"` `decoding="async"`，无 `fetchpriority`、无 iframe。

1. `${BEHOLDER_NAME_COLLISION_ZH_IMAGE_PATH}` — H2「先把今晚这只从观察者眼里摘出来」后。打勾真眼魔（中央眼+十柄）；否决观察者眼魔、亡眼暴君、眼魔丧尸。
2. `${BEHOLDER_CONE_LOCK_ZH_IMAGE_PATH}` — H2「反魔锥不是两版同一份工」内。左 2014 特质，右 2024 附赠动作。
3. `${BEHOLDER_TOKEN_STALKS_ZH_IMAGE_PATH}` — H2「Token 留下十根眼柄」内。圆框里留下中央眼和十根眼柄。

## 内链占位

`${ZH_SPECTATOR_DND_PATH}` `${ZH_MIND_FLAYER_DND_PATH}` `${ZH_EDITOR_PATH}` `${ZH_SQUARE_TOKEN_MAKER_PATH}` `${ZH_DICE_ROLLER_PATH}`

接入 `src/` 时需补 `ZH_SPECTATOR_DND_PATH` 与三张中文配图常量；本稿未改 `src/`。
