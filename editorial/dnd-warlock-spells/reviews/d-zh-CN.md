# dnd warlock spells：D-zh 独立三门写后检查（当前结论）

结论：当前中文 body 与中文媒体绑定版本的 ResearchTrace、ReaderValue、Repetition 均 PASS。本文没有新增修订；这是 Round3 后的独立 D 复检，不沿用旧检查结论，也不以 2000 字计数代替质量判断。

## 版本与身份

- 关键词：dnd warlock spells；网站：https://www.tokenmaker.one；locale=zh-CN；content-only；未取得精确中国地区 SERP，不作排名结论。
- 正文：drafts/zh-CN/body.md；SHA-256：7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330。
- 媒体：media/zh-CN/spell-choice.svg；SHA-256：9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0；spell-choice.webp；SHA-256：eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893。
- 当前唯一中文布局卡：planning/zh-CN/task-card-v1.md；SHA-256：ecf8dc5753b925db0602c09230ad4d83677d4b728e20530915395bfa87abedb1。旧 task-card.md 不作为依据。
- Run：run_39994fa3f53e；Task：task_79c650631c45；Dispatch：ctx_c869b891f8b1；Worker 会话终端：term_a0ca2ccb-4d4e-4d4f-a5bf-33aba1bf202f；Codex session：01a0dc03-9648-7740-b989-9752d7ff3d08；Orca runtime：74a69eea-06aa-4604-bb3f-acad7c782697；ego-browser 自有 TaskSpace：51 / p1。
- 只读输入：中文原始搜索 search-sources.md、task-card-v1.md、body.md、spell-choice.svg/webp，以及必要的 rules/facts.md；未将旧 D 结论、作者自评、验收样稿、英文材料或历史参考作为依据。未修改正文、媒体、任务卡或网站。

## ResearchTrace：PASS

- body.md:1-92 与 SVG 文本没有检索日志、SERP/内部路径、Worker/Dispatch、作者指令或自评残留；公开 D&D Beyond/SRD 链接是读者可核对来源，不是研究过程。
- 图中文字与图注只承担规则决策图功能，没有把搜索过程或内部证据写入读者面。
- 直接扫描命令退出 0：rg 未命中内部过程标记，输出 PASS。

## ReaderValue：PASS

主任务仍是：按 2024 规则、Warlock 等级、DM 允许来源和实际打法，从已核验候选中选出可填入角色资料、并能复核资源/动作/专注冲突的一组；没有被 Token Maker 产品需求改写。正文给出 1/3/5 级准备数、Pact Magic 槽、always prepared 分栏、候选字段、战术分支、替代理由和最终复核顺序；搜索文件只把中国参数标成偏好，正文没有冒充地区排名。

### 逐步资源与动作账

事实底账：2024 每个 turn 只能消耗一个法术位；Action、Bonus Action、Reaction 仍须分别满足；不能同时维持两个专注法术。已核验字段为：Hex＝1环/附赠动作/占一槽/专注；Eldritch Blast＝戏法/动作/无槽/不专注；Hypnotic Pattern＝3环/动作/占一槽/专注；Misty Step＝2环/附赠动作/占一槽/不专注；Hellish Rebuke＝1环/反应/占一槽/不专注；Counterspell＝3环/反应/占一槽/不专注；Hold Person＝2环/动作/占一槽/专注。

| 正文场景 | 逐步 ledger | 判定 |
|---|---|---|
| body.md:40 的 Hex → Eldritch Blast | Hex：附赠动作 + 1 个 Pact Magic 槽 + 开始专注；随后 EB：动作 + 戏法无槽 + 不专注。一个 turn 只耗一个槽，动作资源不冲突。 | PASS，正文给出合法同 turn 例。 |
| body.md:84 的 Hypnotic Pattern → Eldritch Blast | HP：动作 + 3 环槽 + 专注；EB：仍需动作。无本篇范围外的额外动作时，同 turn 动作冲突；即使只看槽账，HP 已耗一个槽，也不能再用第二个槽法术。 | PASS，正文明确判为不能同 turn 同用。 |
| body.md:84 的 Hex → Eldritch Blast 替代例 | Hex：附赠动作 + 1 个 3 环 Pact Magic 槽（升环施放）+ 专注；EB：动作 + 无槽 + 不专注。不是同时施放 HP 的分支；一个 turn 只耗一个槽。 | PASS，正文明确为合法替代例。 |
| body.md:40 的第二槽 Counterspell | 若本 turn 已用槽施放 Hex，Counterspell 仍是反应 + 槽 + 触发/60 英尺条件；第二个槽在同 turn 不合法。正文没有错误地扩成整 round 禁止。 | PASS。 |
| body.md:38、82 的专注分支 | Hex、Hypnotic Pattern、Hold Person 都需专注；正文说按场景互相替代，不把它们写成同时维持。Misty Step/Hellish Rebuke/Counterspell 不需专注，但仍各有附赠动作/反应与槽成本。 | PASS。 |
| body.md:66、74、82 的 1/3/5 级列表 | 这些是准备清单，不是同 turn 联合施法：准备数 2/4/6 对上等级；槽为 1×1环、2×2环、2×3环；EB 独立为戏法。3/5 级用高环槽施放低环法术时，正文另写升环效果，不虚构自动伤害升级。 | PASS。 |

动作账没有引入 Action Surge 或其他本篇无依据例外。图片同样标出 Action/附赠动作/反应、槽阶、专注和 one-slot-per-turn 检查；webp 实际为 780×2100，未发现与 SVG 文字不一致的视觉内容。

## Repetition：PASS

- 资源表是快速记账；字段表是逐法术筛选；战术段是按任务取舍；1/3/5 级段是带替代理由的示例；结尾是复核顺序，承担作用不同。
- body.md:19-21 的图和图注压缩呈现三栏/字段流程；不是复制正文段落。SVG/webp 的文字是同一视觉决策图，不构成无功能重复。
- 未发现应删除的重复段、表格或图中文字。

## 真实验证命令

- shasum -a 256 body/media/task-card：退出 0；输出为本报告“版本与身份”中的四个 SHA-256。
- awk 行尾空白检查：退出 0；body、SVG、task-card 均无行尾空白。
- xmllint --noout media/zh-CN/spell-choice.svg：退出 0。
- file media/zh-CN/spell-choice.webp：退出 0；RIFF Web/P image，780x2100。
- rg ledger/规则关键词：退出 0；命中 body.md:40、84、90 等动作/槽/专注/turn 账句。
- ego-browser nodejs 官方来源核对：退出 0；TaskSpace 51/p1 打开 https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn，页面显示 One Spell with a Spell Slot per Turn 规则，且明确区分 Magic action 与 Bonus Action 的同 turn 槽限制。
- 未运行正文计数脚本；2000 不是本次三门质量门。

## 最终门结论

- ResearchTrace：PASS
- ReaderValue：PASS
- Repetition：PASS

当前 D 三门对该 body/media 版本可通过；仍需 E 对同一 body SHA 做独立鉴文/事实引用审核后，才可进入 F。
