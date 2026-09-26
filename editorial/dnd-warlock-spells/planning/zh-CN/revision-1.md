# 中文布局修订记录：Round1

## 结论

`task-card-v1.md` 是本轮 B-zh 的唯一交付布局卡，已替代原 B 产物作为 C/V 输入。旧文件 `editorial/dnd-warlock-spells/planning/zh-CN/task-card.md` 标记为**废弃、非交付依据**；本轮不覆盖、不改写旧文件，C/V 不得读取它来继承结构或结论。

## 作废原因与独立边界

原 B 自行开展 Bing 搜索并以其支持布局，违反 V7 的 A 研究 / B 布局分离，故不沿用其思考。新卡仅依据 `research/zh-CN/evidence.md`、`search-sources.md`、`validation.md`、共享 `research/rules/`、`research/site/site-context.md` 和用户原始范围独立规划；本 Worker 未联网、未开浏览器、未读取旧卡、未生成正文/SEO/图片，中文修订为 Round1，不重置共享三轮修订预算。

## 新卡范围摘要

主意图锁定为：面向 2024 规则的中文 Warlock 读者，按等级、打法与 DM 允许来源，从已核验法术中做条件化选择。卡内明确 `Prepared Spells` 基础数量与 `Pact Magic` 槽、`always prepared` 额外来源不同；1/3/5 级只作示例；不强制任何法术；本轮补入已完整核验的一环 Hellish Rebuke（F05）作为 1 级文字候选，图不扩展；未核验的 Armor of Agathys、Arms of Hadar、Hunger of Hadar 不进入正文；工具关联为无；正文计划至少 2000 合格汉字；一张正文图由独立 V 制作。

## 实际身份与验证

Run `run_39994fa3f53e`；Task `task_1cf6606df6e0`；Dispatch `ctx_f757f9ad95d7`；Worker terminal `term_5e30edbd-f873-49bc-ad8d-0e38927e22b8`；Codex session `01a0dbcb-abf5-7112-be4d-15328377300c`。允许写入仅为 `task-card-v1.md` 与本文件，均用 `apply_patch`；无代码、依赖、数据库、密钥、网站、提交、push、deploy 或测试/构建改动。完成后只做真实读回、结构/空白检查和 SHA-256；不以浏览器或 build 代替布局验收。

交接要求：C/V 直接读取 `task-card-v1.md`；若需要未列事实或改图中文字，先退 A/B，不自行联网或凭记忆补全。旧卡不再作为交付依据。

## Round1 漏项闭环验证（本 Dispatch）

- 改动文件：仅 `planning/zh-CN/task-card-v1.md`、本文件；均以 `apply_patch` 完成。
- 验证命令：Python 标准库只读回两文件，断言 `F05`、Hellish Rebuke 的 2024 PDF 页码 URL、1 级条件性反应示例、图不扩展、当前 Task/Dispatch、末尾换行和无行尾空白；退出码 **0**。关键输出：`PASS: F05 1级补证、条件性反应、官方公开引用、图不扩展、当前 Task/Dispatch、newline/whitespace`；`task-card-v1 sha256=ecf8dc5753b925db0602c09230ad4d83677d4b728e20530915395bfa87abedb1`。
- **PASS**：Hellish Rebuke 已作为完整核验的一环文字候选补入范围、1 级示例与公开引用；图保持原五项，不扩张。**UNVERIFIED/不适用**：未联网、未浏览器、未运行代码测试/构建/网站验收；这些不属于本次漏项闭环。
