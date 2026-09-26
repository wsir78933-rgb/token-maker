# D-zh-CN v2：当前中文 body 全量复检摘要

## 身份与版本绑定

- Run：`run_39994fa3f53e`
- Task：`task_82f4243885e9`
- Dispatch：`ctx_b1bb9280c87a`
- Worker terminal：`term_dc7aa449-0a80-434b-8464-92e739dd2078`
- Codex session：`01a0dbef-6ee5-74e0-9497-058e80370228`
- 审查文件：`drafts/zh-CN/body.md`
- body SHA-256：`485392c3ff51df38e1a2a43eaaa1ad22d7fdd80234d1f46e44685aa62f2d485b`
- `media/zh-CN/spell-choice.svg` SHA-256：`9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0`
- `media/zh-CN/spell-choice.webp` SHA-256：`eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893`
- 机械汉字计数：`3143`；仅为机械信息，不是质量 PASS。

`planning/zh-CN/task-card-v1.md` 是唯一任务卡。`drafts/zh-CN/revision-2.md` 当前不存在，结论直接绑定实际 `body.md`；未读作者自评、旧任务卡、旧 D 报告、英文材料、验收样稿和历史参考。

## 三门结论

| 门 | 结论 | 独立证据与位置 | 必要改法 |
|---|---|---|---|
| ResearchTrace | **PASS** | body 第 1–92 行与 SVG 第 2–154 行只有读者方法、公开来源和规则说明；内部残留精确扫描无命中（`rg` 子命令退出 1 表示无匹配） | 无 |
| ReaderValue | **FAIL** | 第 1–40 行完成版本/资源/字段筛选；第 44–60 行覆盖远程、控制、位移、反应；第 66–84 行给出 1/3/5 级可填卡例子，但第 84 行只排除了第二个 slot，没有提醒 Eldritch Blast 仍占 Action；A facts F14/F01/R07 明确两者均需 Action 且动作预算须单独满足 | 交 C 补第 84 行：说明 Hypnotic Pattern 已占 Action 时无额外 Action 不能同 turn 再用 Eldritch Blast；给出后续 turn 或 Hex（Bonus Action）+ Eldritch Blast（Action）合法顺序 |
| Repetition | **PASS** | 资源表、等级例子、结尾检查各自承担速查/应用/提交前复核；字段表与四类战术分支各自承担输入/决策；未见同作用可删重复 | 无 |

## 实际场景与媒体

按正文方法重做真实 ledger：5 级单职业 2024 Warlock，2×3 环位，T1 用 Bonus Action 施放 Hex（消耗 1 slot、开始专注）后用 Action 施放 Eldritch Blast（戏法、5 级两束、不耗 slot），T1 不再消耗第二 slot；T2 敌方在 60 英尺内且可见、以 V/S/M 施法时，用 Reaction 施放 Counterspell（消耗剩余 1 slot），Hex 继续专注。命令退出码 0，具体输出为 `T1 Hex=Bonus Action + EB=Action; slots 2->1`、`T2 Counterspell=Reaction; slots 1->0`、`verdict=PASS`；这只证明替代场景合法，不挽救第 84 行的 Action 预算缺口。

第 84 行原句“用 Eldritch Blast 这样的戏法则不触发这条法术位限制”**FAIL**：A facts F14 第 223 行写明 Hypnotic Pattern 是 `Action`，F01 第 131 行写明 Eldritch Blast 是 `1 Action`，R07 第 103 行要求 Action/Bonus Action/Reaction 另行满足；该句紧跟已用 Action 的 Hypnotic Pattern，可能诱导读者误用，必须交 C 局部澄清。

本次使用已读 A 官方事实文件，不新增浏览器事实；`facts.md` R07/R08、D01、F01/F02/F11/F14 的原文定位已回读。WebP 实际视觉读回为 `780×2100`，文字无裁切或不可读块；媒体 hash 已绑定上表。

## D 交接

当前 body 为 **ResearchTrace PASS / ReaderValue FAIL / Repetition PASS**；第 84 行必须交 C 修订，当前版本不能流入 F，修订后须以新 body hash 由 D 全量重跑三门，再交 E。本摘要与完整报告均只承担 D，不代替 E、页面验收或用户终审；若 body 或媒体 hash 改变，也必须绑定新版本重跑。
