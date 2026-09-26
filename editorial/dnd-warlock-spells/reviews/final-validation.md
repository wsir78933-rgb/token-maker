# dnd warlock spells：Q 最终交付核验报告

## 结论

整体状态：**PARTIAL**。

- **中文旧版技术冻结独立核验：PASS（本任务范围）**。旧版冻结中文正文与 C 稿字节一致，D/E/F 记录、SEO、公开引用、署名、媒体和污染扫描均绑定同一正文版本。
- **当前中文视觉要求：PENDING**。用户要求如配图使用人物图或游戏角色图；现有 `spell-choice` 只是规则／流程决策图，不满足该新要求。人物图尚未生成，替换、图注／alt 变化及额外复审均待用户确认；因此不能称当前中文入口为最终成品，也不启动 Round4 或改冻结包。
- **英文：UNVERIFIED / 待修订后复审**。D 新 Dispatch `ctx_deec62d8faef` 已完成，ResearchTrace、ReaderValue、Repetition 三门均 FAIL；C Round 2 已开始修订，E/F 尚未开始，本报告不创建英文 final、SEO 或 handoff。
- **本次仅机械纠正失败：0**。该数只对应本 Q 的 allowlist、JSON、链接与空白检查；英文 D 的三门内容 FAIL 是独立的当前交接状态，不能被本 Q 的机械 PASS 混淆。

## 本次续验修正身份与范围

| 项目 | 实际值 |
|---|---|
| Run | `run_39994fa3f53e` |
| 本次续验 Task | `task_ded89f2bcf0b` |
| 本次续验 Dispatch | `ctx_6d220c76bed0` |
| 本次续验 Worker terminal | `term_1b398c2e-31ba-4528-b908-2ec15d586405` |
| 本次续验 terminal incarnation | `842aae27-292d-4b29-b767-e486603a93f2::/Users/wusir/orca/workspaces/token-maker-app/博客@@1d3302a7:71f5cdc1-b6c5-415e-9f13-91188ecc96e1` |
| Codex session | live 元数据未暴露；不虚构 UUID |
| 协调者 terminal | `term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10` |
| 本次范围 | 仅修正报告、入口和内部 provenance／预算记录；不改 body、SEO、media、handoff 或网站 |

前一份报告纠正的 Task/Dispatch 为 `task_40116d07f843` / `ctx_6f88eadb5f7d`；本次只在四个 allowlist 文件中继续做机械状态纠正。

协调者当前真实回读与 D 报告显示：旧 D `ctx_51ae0b294818` 为 `process_exited/failed`，`terminationReason=operator_close`；新 D `ctx_deec62d8faef`、terminal `term_9cad03a1-47fb-4b73-9c2d-cbf0722042e5` 已于 `2026-09-26T06:18:47.543Z` 完成，Task 结果为 `succeeded`，但三门结论均 FAIL。C Round 2 当前使用 Task `task_108b799a2d77`、Dispatch `ctx_f2f3d728361d`、terminal `term_c1844d9d-8d3c-4d73-9900-8fe43536198f`，`worker=ready`、projection `live/in_progress`；本 Q 不等待 C、不代改正文。

本次还按计数脚本真实支持的 `--exclude-heading` 重新计算英文正文，并把当前视觉要求列为待办；两者均是报告纠正，不计入任何语言的正文修订轮次。

## 真实身份与范围

| 项目 | 实际值 |
|---|---|
| Run | `run_39994fa3f53e` |
| 本 Q Task | `task_cb15486ac00b` |
| 本 Q Dispatch | `ctx_070a0fbc8272` |
| 本 Q Worker terminal | `term_1b398c2e-31ba-4528-b908-2ec15d586405` |
| 本 Q terminal incarnation | `842aae27-292d-4b29-b767-e486603a93f2::/Users/wusir/orca/workspaces/token-maker-app/博客@@1d3302a7:71f5cdc1-b6c5-415e-9f13-91188ecc96e1` |
| 协调者 terminal | `term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10` |
| Orca runtime | `74a69eea-06aa-4604-bb3f-acad7c782697` |
| 工作树 | `/Users/wusir/orca/workspaces/token-maker-app/博客`，branch `博客` |
| 模式 | `content-only`；关键词 `dnd warlock spells`；网站输入 `https://www.tokenmaker.one` |

本 Q 的 live preamble/Orca terminal metadata 没有暴露 Codex session UUID，因此不虚构 Q 的 session；实际 Task、Dispatch、terminal、terminal incarnation 和 Orca 回读记录均保留。未写网站、未提交/push/deploy、未新增依赖、未动数据库/密钥/Hermes/原始工作区；未运行与内容无关的 typecheck/build。

## A–F provenance 核对

以下身份来自本 Run 的 `task-list`、`worker-list`、`dispatch-show`、必要的 `worker-show/worker-read` 只读回读；完整结构化记录在 [internal/provenance.json](../internal/provenance.json)。`taskId`、`dispatchId`、Worker terminal 和 process incarnation 均按实际记录填写，角色名不作为独立性证据。

### English

| 环节 | Task / Dispatch / Worker terminal | Codex session（若实际记录） | 真实状态 |
|---|---|---|---|
| A research | `task_13dcbf516d2b` / `ctx_ea15ee159736` / `term_9c4d2ecc-d60a-46f3-8937-741f1fe6a3c0` | 未在 A 报告或 live 元数据暴露 | completed / succeeded；资源仍由该 dispatch `user_owned` 保留 |
| B layout（Round1 修订） | `task_7a86b80000ed` / `ctx_0a84857266b2` / `term_b61f38d1-d7ae-4baa-860c-4270cfd2143c` | `01a0dbc4-f883-74e3-a0ac-f32c04c5cdf6` | completed / succeeded |
| C writing | `task_c728c96b9f81` / `ctx_1d4fe8027dfa` / `term_7a6934ae-d5e8-4c0d-832e-aedda53b5e9b` | `01a0dbc4-264e-77d3-8c4a-e19c158fbe84` | completed / succeeded；仅 draft |
| C writing（Round2 当前修订） | `task_108b799a2d77` / `ctx_f2f3d728361d` / `term_c1844d9d-8d3c-4d73-9900-8fe43536198f` | 未暴露 | **IN PROGRESS**：针对 D Round1 三门 FAIL 修订；当前无新 body hash |
| D post-write（旧尝试） | `task_ca3fbfa50940` / `ctx_51ae0b294818` / `term_5c60b856-6f7b-429a-ad9f-86dc56bae4b2` | 未暴露 | **UNVERIFIED**：真实回读为 terminal `exited`、projection `failed/process_exited`、`terminationReason=operator_close`；旧资源 retained/user-owned 仅是历史记录，没有 `worker_done` |
| D post-write（新调度） | `task_ca3fbfa50940` / `ctx_deec62d8faef` / `term_9cad03a1-47fb-4b73-9c2d-cbf0722042e5` | `01a0dc56-1922-7361-9c73-9e9c636f1a7b` | **completed / FAIL**：`2026-09-26T06:18:47.543Z` 完成；ResearchTrace、ReaderValue、Repetition 均 FAIL，报告绑定旧 body hash |
| E independent review | `task_b3e9663fcf97` / 无 dispatch / 无 terminal | — | **UNVERIFIED / NOT STARTED**：pending |
| F lock/title | `task_59e54beaf2f9` / 无 dispatch / 无 terminal | — | **UNVERIFIED / NOT STARTED**：pending |

A-en 的 retained/user-owned 行按 `resource.ownerDispatch` 与真实 terminal 归属核对；旧 D-en retained 行只是已退出尝试的历史资源，不是活跃窗口。新 D-en `ctx_deec62d8faef` 已完成并记录三门 FAIL；C Round2 `ctx_f2f3d728361d` 当前 live/in-progress。本 Q 不停止、abandon、重派或关闭任何 Worker。

本 Q 发送 `worker_done` 前的 Orca 快照应以最新真实回读为准：A-en 仍按其 owner dispatch 核对；旧 D-en 已退出，新 D-en 已 settled/succeeded；C Round2 由 `ctx_f2f3d728361d` 真实持有并处于 live/in-progress。该快照不声称所有 agent 已关闭，Q 结束后的 release 由主协调者处理。

### 简体中文

| 环节 | Task / Dispatch / Worker terminal | Codex session（若实际记录） | 真实状态 |
|---|---|---|---|
| A research | `task_e555362d8c0d` / `ctx_2db2cea67c00` / `term_68e30f8e-b825-4798-a7b5-c3f515b41687` | 未在 A 报告或 live 元数据暴露 | completed / succeeded |
| B layout（最终有效卡） | `task_639b0d17b04e` / `ctx_209927af25c4` / `term_5e30edbd-f873-49bc-ad8d-0e38927e22b8` | `01a0dbcb-abf5-7112-be4d-15328377300c` | completed / succeeded |
| C writing（Round3） | `task_fe32a32bcfce` / `ctx_b1f14c974eb4` / `term_3f734e55-73f9-4930-8b8e-46c7a5ae548c` | `01a0dbfe-f3d0-75a3-9371-b5da018961ce` | completed / succeeded |
| D post-write（Round3） | `task_79c650631c45` / `ctx_c869b891f8b1` / `term_a0ca2ccb-4d4e-4d4f-a5bf-33aba1bf202f` | `01a0dc03-9648-7740-b989-9752d7ff3d08` | completed / succeeded；ResearchTrace / ReaderValue / Repetition PASS |
| E content review | `task_7eff0516341b` / `ctx_1770d37dab90` / `term_7244c719-9249-435b-b5be-fbc28b2a9deb` | `01a0dc0b-defb-7d51-98f0-4243ce9b356a` | completed / succeeded；正文门 PASS |
| E SEO/handoff review | `task_3dba4a301145` / `ctx_ec796c51eda4` / `term_c33d7a28-6c8f-4b91-af6b-faa6b697ec1e` | 未暴露；报告明确不虚构 | completed / succeeded；SEO、引用、署名、公开媒体 PASS |
| F lock/title/freeze | `task_f9247a6bbc7c` / `ctx_483621019eab` / `term_7ab2d400-cc4a-4865-9d4c-96b0c36ff1fd` | `01a0dc3a-c5a9-7b43-b0d7-58b74654d530` | completed / succeeded；CONTENT_FROZEN |

中文最终链的 A/B/C/D/E/F dispatch 均不同，且均不等于协调者 terminal；英文已有 A/B/C 与中断 D 也不同。媒体任务是独立 V，不替代 D/E/F：中文 `task_796f0e17d7d7` / `ctx_239c53e1e3e1`，英文 `task_f46927342863` / `ctx_8de10101ff81`。

## 修订预算

共享预算没有重置，记录在 [internal/revision-budget.json](../internal/revision-budget.json)：

- 中文：Round1 布局、Round2 正文、Round3 正文，`used=3/max=3`。Round3 只澄清 Hypnotic Pattern 与 Eldritch Blast 的 Action 预算，并与“一回合一个法术位”分开；没有自行开启 Round4。
- 英文：Round1 为布局修订；D Round1 三门 FAIL 后，C 的 **Round2 已启动**（`used=2/max=3`，当前待完成），升环目标数校正属于 Round1。新正文尚未交 D 复跑，不把 draft 计为 final。
- 中文 D 场景补正、E 署名阶段澄清、SEO/公开交接复核、媒体报告归位、F 交接冻结和候选记录归位均未计为正文修订轮次。
- 前一 Q 的报告纠正、英文 `Sources` 排除计数和人物／游戏角色配图待办均为报告／交接状态更新，未计入正文修订；本次只记录 D FAIL 与 C Round2 的真实状态，不自行开启中文 Round4、不重置预算。

## 中文旧版技术冻结包核验：PASS（不等于当前视觉要求通过）

以下证据仍证明旧版中文技术冻结完整，但不把旧版规则／流程图升级为当前要求的人物图或游戏角色图。当前视觉要求单列为 **PENDING**：尚未生成人物／游戏角色图，替换图片、图注／alt 以及额外复审等待用户确认；本 Q 未修改冻结包。

### 正文、编码与 hash

| 对象 | 实际结果 |
|---|---|
| `drafts/zh-CN/body.md` ↔ `final/zh-CN/body.md` | `cmp_exit=0`；13827 bytes；SHA-256 `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| NFC/LF | raw 与 NFC/LF SHA 相同；`bodyNfcEqual=true` |
| Handoff body | 与 final body 精确相等；`bodyHash` 同上 |
| Handoff integrity | `status=CONTENT_FROZEN`、`seoReview=PASS`、`handoffFreeze=CONTENT_FROZEN` |
| Handoff SHA-256 | `714860d7da7f411bf1df1c78ae4be9eee617cc9f4b7972a2c484b9807c8fcc69` |
| canonical public fields | `publicFieldsHash=a584ffa2494326f86ea5a90b25d07eee1d40af8f89de930f9fbde190eab5475d` |

其余中文公开文件当前 SHA：

- `seo.json`: `34c4abb5eea95dbffa0d107a19ecefe66534e3d20be56ef716383aca96b0f6bd`
- `public-references.json`: `9f5d5db454f807586c22da4acbaa493a04f5be506d57425ea6025160fc8f0dee`
- `article.md`: `63d813d9a29f288e6b03a38305dd2473c61ec2c55cd614c49aef1e679a9db826`
- `attribution.md`: `c1d87a906c68bbc9b046d009cdbd190fbebe77be8a2793534eb051bb6441a173`

### 计数

实际运行随包脚本，未把元数据当正文：

```text
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/final/zh-CN/body.md --locale zh-CN
exit=0; mechanical_units=3210; required_floor=2000; meets_mechanical_floor=true
omitted_line_counts: headings=12, code=0, excluded_sections=0, non_body=42, frontmatter=0
sha256_raw=7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330
sha256_nfc_lf=7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330
```

### 引用、SEO、署名与媒体

- PublicReference 共 **10** 个来源、**13** 个 `{quote, occurrence}` 定位；每个 quote 在当前规范化 body 的实际出现次数都等于声明 occurrence（本版均为 1），10/10 URL 在 body 中存在，外部文件与 Handoff 内嵌引用对象一致，且 `bodyHash` 一致。
- E-SEO 对当前 Title/H1/Description/slug 的题文兑现为 PASS；无排名、免费、最快、最强、胜率或其他正文未支持的承诺。SRD 5.2.1 公开署名在 `attribution.md`、`article.md` 和 handoff `publicRequirements` 中逐字一致。
- `media/zh-CN/spell-choice.webp`：存在，WebP，780×2100，133876 bytes，SHA `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893`；作为 `page-image` 被正文引用，alt/caption 均在正文和 handoff 中存在。
- `media/zh-CN/spell-choice.svg`：存在，SVG，780×2100，13461 bytes，SHA `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0`；作为 `source-image` 交付资源存在。`xmllint --noout` 退出码 0，未把 source-image 错当成正文页面 WebP。
- `view_image` 原图实看：中文旧版规则／流程图完整显示标题、流程卡、5 个候选和底部边界，无裁切；这是媒体原图检查，不是网站页面验收，也不证明该图满足人物／游戏角色视觉要求。

## 英文旧 hash 核验快照：UNVERIFIED（不代表当前版本）

> **旧快照 UTC 时间：2026-09-26T06:07:47.792Z**（前一 Q Task `task_cb15486ac00b` 的实际 `worker_done` 记录时间）。本节的英文 body hash、2594 排除来源计数以及前一 Q 的 `passCount=22 / failCount=0` 都只绑定该时点的旧 hash `6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a`；它们不是当前 D 三门结论，也不是 C Round2 修订后的计数承诺。

- `drafts/en/body.md` 存在，19551 bytes，SHA-256 `6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a`；NFC/LF 等值。
- 旧快照中的英文 body 为 19551 bytes，raw/NFC-LF SHA 均为 `6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a`。本节保留整文件机械数和排除 `Sources` 后的旧正文数，不能把任一旧数当作 C Round2 修订稿的当前计数。

- 整文件机械计数（诊断值，包含文末 `Sources`）：

```text
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/drafts/en/body.md --locale en
exit=0; mechanical_units=2631; required_floor=2000; meets_mechanical_floor=true; excluded_heading_sections=[]
omitted_line_counts: headings=16, code=0, excluded_sections=0, non_body=59, frontmatter=0
sha256_raw=6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a
sha256_nfc_lf=6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a
```

- 合格正文计数（按脚本 `--exclude-heading Sources` 排除来源节）：

```text
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/drafts/en/body.md --locale en --exclude-heading Sources
exit=0; mechanical_units=2594; required_floor=2000; meets_mechanical_floor=true; excluded_heading_sections=["Sources"]
omitted_line_counts: headings=16, code=0, excluded_sections=8, non_body=58, frontmatter=0
sha256_raw=6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a
sha256_nfc_lf=6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a
```

排除边界是标题 `Sources` 对应的节，从该标题至下一个同级／更高级标题或文件末尾；旧快照输出显示 `excluded_sections=8`。C 报告中的 `2594` 与前一 Q 旧快照结果仅作历史交叉核对；本节不把它转写为当前 C Round2 的计数。

- draft 的 3 个 WebP 图片链接均可解析：`spell-choice.webp` 1200×1660、SHA `2345958984441f751dff3191a5dc9df88ffabb106e81d52b1e95291bbff82704`；`upcast-tradeoffs.webp` 1200×1820、SHA `03032baeb883425db71c69b8bd1ade139050d972a4016423c040ae7542c2d22f`；`concentration-choice.webp` 1200×1520、SHA `4e3c27ffcf1148d6e45f732d3dca8fd5bbf389885206bd2037aed5cb8b9f2b26`。三张图均已实看，原图边界和文字完整；这不替代英文 D/E/F，也不改变中文旧版规则／流程图对当前人物／游戏角色要求仍为 PENDING。
- `final/en/body.md`、`final/en/seo.json`、`final/en/PublicBlogHandoff.json` 均不存在；这是按当前校正保留的真实状态，不是缺失待 Q 补造的文件。

## 当前英文 D/C 状态：UNVERIFIED

- D-en 当前报告文件 `reviews/d-en.md` 的三门结论为 **ResearchTrace FAIL、ReaderValue FAIL、Repetition FAIL**；它绑定旧 body hash `6aedded0bb8304de05dde67cc900227bc7942f8b69cdbf88ddce529b96373f1a`，D Dispatch 为 `ctx_deec62d8faef`，Codex session 为 `01a0dc56-1922-7361-9c73-9e9c636f1a7b`，实际完成时间为 `2026-09-26T06:18:47.543Z`。
- C Round2 已启动：Task `task_108b799a2d77`、Dispatch `ctx_f2f3d728361d`、terminal `term_c1844d9d-8d3c-4d73-9900-8fe43536198f`；Orca 当前回读为 `worker=ready`、projection `live/in_progress`。本 Q 不等待、不代改正文、不抄写新 hash。
- C 生成新 body 后，D 必须对新 body 与受影响媒体全量复跑三门，E 仍须独立审核，之后才可进入 F；当前没有英文 final、SEO 或 PublicBlogHandoff。

## 公开面与 canary 核验

- 对中文公开 body/article/SEO/publicReferences/Handoff/署名、英文 draft/author-notes 及中英文媒体共 **16** 个文件，按 operation-store 的两个精确 canary 字段扫描；只报告计数：`canary_hits=0`，命令退出码 0，未输出 canary 原文。
- 对中文交接与媒体共 **8** 个文件的内部/process 扫描：**0 命中**。没有发现内部报告路径、Agent/TaskID、session、SERP/PAA 过程、作者自评、operation-store 或 canary；正常 D&D Beyond/SRD 来源链接未被误杀。
- 该扫描只证明指定精确字串未出现，不能证明改写污染不存在，也不能证明底层文件系统权限隔离。

## 验证命令、退出码与边界

| 验证 | 退出码 / 关键输出 |
|---|---|
| `python3 .../正文计数.py ...final/zh-CN/body.md --locale zh-CN` | 0；3210、SHA 上述 |
| `python3 .../正文计数.py ...drafts/en/body.md --locale en` | 0；整文件 2631（包含 `Sources`，仅诊断），SHA 上述 |
| `python3 .../正文计数.py ...drafts/en/body.md --locale en --exclude-heading Sources` | 0；排除来源节后正文 2594，`excluded_sections=8`，SHA 上述 |
| `cmp drafts/zh-CN/body.md final/zh-CN/body.md` | 0 |
| `shasum -a 256` 中文正文、SEO、引用、Handoff、article、署名、媒体；英文 draft/媒体 | 0；与本报告 hash 表一致 |
| `jq -e .` 及状态断言（provenance.json、revision-budget.json） | 0；四个交付文件范围断言、D session/三门 FAIL、C Round2、`used=2` 均通过 |
| README 相对链接与稳定语义 Node 回读 | 0；12 个相对链接，`missing=[]`；无旧 2594 当前承诺、无“重新审核中”旧状态 |
| `xmllint --noout media/zh-CN/spell-choice.svg` | 0；780×2100 根元素 |
| `file` / `sips` 中文与英文 WebP | 0；格式与尺寸如上 |
| 前一 Q 旧 hash 快照的只读 inline Node assertion（hash、NFC/LF、quote、media、公开面、provenance、README、canary） | 0；该旧快照 `status=PARTIAL`，`passCount=22`，`failCount=0`，`unverifiedCount=4`，`locations=13`，`contamination=0`，`canaryHits=0`；不覆盖当前 D 三门 FAIL |
| `orca orchestration task-list --run run_39994fa3f53e`、`dispatch-show --task task_ca3fbfa50940`、`worker-show --dispatch ctx_deec62d8faef`、`dispatch-show --task task_108b799a2d77`、`worker-show --dispatch ctx_f2f3d728361d` | 0（各实际调用）；D `ctx_deec62d8faef` completed/succeeded 且三门 FAIL，C `ctx_f2f3d728361d` 为 `ready`、projection `live/in_progress`；真实记录已写入本报告与 provenance |
| `awk` 行尾空白检查（本 Q 写入文件） | 0；无空白错误；另行运行 `git diff --check` 退出 0，但因文件仍 untracked 不把空 diff 当作文件内容证据 |
| `git diff --name-only` | 0；空；网站源码无 tracked diff |

## 工作树边界与本 Q 写入

本 Q 只新增或修改以下 allowlist 文件：

- `editorial/dnd-warlock-spells/README.md`
- `editorial/dnd-warlock-spells/internal/provenance.json`
- `editorial/dnd-warlock-spells/internal/revision-budget.json`
- `editorial/dnd-warlock-spells/reviews/final-validation.md`

当前工作树 `git status --short` 仅显示 `?? editorial/`；`git diff --name-only` 为空，未发现网站源码变化。原始工作区只读核对显示既有脏文件为 `DND-...xlsx`，本 Q 未读取内容、未修改或清理它。

## 未完成项与交接方向

1. D-en Round1 已完成且三门 FAIL；C Round2 已启动（`ctx_f2f3d728361d`）但本 Q 不等待、不代改，修订后须由 D/E/F 重新绑定新版本；当前保持英文 draft-only、整体 PARTIAL。
2. 人物／游戏角色配图尚未生成；替换图片、图注／alt 与中文额外复审等待用户确认，不执行制图、不自行开启 Round4、不改中文冻结包。
3. 精确中国地区 SERP、PAA、搜索量未取得；`country` 未指定，不能从 `gl=CN` 或中文语言推断。
4. 网站写入、真实路由、桌面/手机页面验收、用户终审和部署都未执行；本交付不是网站成品声明。
5. 底层文件系统权限隔离未验证，只能记录逻辑隔离。

本报告不修改任何被审正文或 SEO；若后续发现内容问题，应按原 owner 路由回到相应阶段，不由 Q 越权修复。
