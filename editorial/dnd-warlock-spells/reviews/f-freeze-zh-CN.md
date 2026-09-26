# dnd warlock spells：F-zh-CN 公开交接技术冻结报告

## 结论

**技术冻结：PASS。** 当前 D-zh-CN v3、E-zh-CN 正文门、E-zh-CN v2 阶段续审和 E-SEO-zh-CN 均绑定同一正文/媒体版本；我只更新 `PublicBlogHandoff.json` 的 `integrity` 状态与确定性摘要，并新增本报告。

`integrity.status=CONTENT_FROZEN`、`integrity.seoReview=PASS`、`integrity.handoffFreeze=CONTENT_FROZEN`。这是 content-only 技术冻结，不是用户终审、网站成品通过或生产发布；网站页面、用户终审和部署仍为 **UNVERIFIED / NOT EXECUTED**。

## 本次身份与范围

- Run：`run_39994fa3f53e`
- 当前 Task：`task_f9247a6bbc7c`
- 当前 Dispatch：`ctx_483621019eab`
- 当前 Worker terminal：`term_7ab2d400-cc4a-4865-9d4c-96b0c36ff1fd`
- 当前 Codex session：`01a0dc3a-c5a9-7b43-b0d7-58b74654d530`
- Coordinator terminal：`term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`
- locale：`zh-CN`；模式：英文与简体中文 content-only 图文博客
- 关键词：`dnd warlock spells`；网站输入：`https://www.tokenmaker.one`

本任务只允许写入：

1. `editorial/dnd-warlock-spells/final/zh-CN/PublicBlogHandoff.json`
2. `editorial/dnd-warlock-spells/reviews/f-freeze-zh-CN.md`

未修改 body、article、SEO、publicReferences、署名、媒体、D/E 报告、网站源码、数据库、密钥、依赖、Hermes 或原始工作区；未提交、push 或 deploy。

## 冻结前置门与同版证明

- D-zh-CN v3：`ResearchTrace=PASS`、`ReaderValue=PASS`、`Repetition=PASS`；绑定正文 `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330`、SVG `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0`、WebP `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893`。
- E-zh-CN 当前正文门：`PASS`；E-zh-CN v2 将正文事实、引用、ReaderValue、重复和图文门保持为 `PASS`，并明确公开交接/SEO 是后续阶段门。两者均绑定上述正文/媒体 SHA。
- E-SEO-zh-CN：Title/H1/Description/slug、PublicReference 定位与支持性、SRD 5.2.1 署名、article 组合、公开媒体文字与资源 hash 均为 `PASS`；其报告仍将页面、用户终审和部署列为未执行项。
- 旧阶段报告中的 `PENDING_E` 已由当前 E-SEO 实际 PASS 覆盖；没有把旧历史结论当作当前版本结论，也没有改正文以绕过 Round3 3/3。

## 公开文件实际 hash 与版本绑定

以下均为本次冻结前读取并在冻结后重新计算的 SHA-256；除 Handoff 外，公开内容字段前后不变。

| 文件 | 冻结前 | 冻结后 | 结果 |
|---|---|---|---|
| `final/zh-CN/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` | PASS |
| `final/zh-CN/seo.json` | `34c4abb5eea95dbffa0d107a19ecefe66534e3d20be56ef716383aca96b0f6bd` | `34c4abb5eea95dbffa0d107a19ecefe66534e3d20be56ef716383aca96b0f6bd` | PASS |
| `final/zh-CN/public-references.json` | `9f5d5db454f807586c22da4acbaa493a04f5be506d57425ea6025160fc8f0dee` | `9f5d5db454f807586c22da4acbaa493a04f5be506d57425ea6025160fc8f0dee` | PASS |
| `final/zh-CN/article.md` | `63d813d9a29f288e6b03a38305dd2473c61ec2c55cd614c49aef1e679a9db826` | `63d813d9a29f288e6b03a38305dd2473c61ec2c55cd614c49aef1e679a9db826` | PASS |
| `final/zh-CN/attribution.md` | `c1d87a906c68bbc9b046d009cdbd190fbebe77be8a2793534eb051bb6441a173` | `c1d87a906c68bbc9b046d009cdbd190fbebe77be8a2793534eb051bb6441a173` | PASS |
| `media/zh-CN/spell-choice.svg` | `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0` | `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0` | PASS |
| `media/zh-CN/spell-choice.webp` | `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893` | `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893` | PASS |
| `final/zh-CN/PublicBlogHandoff.json` | `7f8369a772d790a35597964f1f09e4d91f25dafe9c08dae1429ff962d886c006` | `714860d7da7f411bf1df1c78ae4be9eee617cc9f4b7972a2c484b9807c8fcc69` | PASS，完整性字段按本任务更新 |

正文 draft/final 字节一致，固定正文 SHA 为用户指定的 `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330`；Handoff 的 `body` 字符串也与 `final/zh-CN/body.md` 精确相等。

## 编码、引用、署名与媒体验收

### UTF-8 / NFC / LF 与正文字节

实际读取六个 `final/zh-CN` 公开文件及 draft body：UTF-8 严格解码、NFC 等值、无 CR 字节，均通过。JSON 的 Handoff、SEO、publicReferences 均可解析；`final/zh-CN/body.md` 与 draft body 的 `cmp` 为 `0`。

### PublicReference 定位

- `public-references.json`：10 个来源、13 个 `{quote, occurrence}` 定位。
- 每个 quote 在当前规范化 body 的实际出现次数均等于声明 occurrence（本版均为 1）。
- 每个公开 URL 均存在于正文，Handoff 内嵌 `publicReferences` 与外部文件对象精确相等，二者 `bodyHash` 均为固定正文 SHA。

### 署名与 article

`research/rules/facts.md` 中 SRD 5.2.1 的完整 CC-BY-4.0 归属文字，与 `attribution.md`、Handoff `publicRequirements.attribution.text` 字节一致。`article.md` 按 `# H1 + 两个 LF + body 原字节 + 一个 LF + --- + 两个 LF + attribution.md 原字节` 重算通过，article hash 保持不变。

### 媒体

| 资源 | 实际观察 | 结果 |
|---|---|---|
| `spell-choice.webp` | `780×2100`，`133876` bytes，SHA `eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893` | PASS |
| `spell-choice.svg` | 根元素 `width=780 height=2100 viewBox=0 0 780 2100`，`13461` bytes，SHA `9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0` | PASS |

Handoff 的媒体路径、尺寸、bytes、SHA、alt、caption 与实际文件/正文一致；`xmllint --noout` 通过。未把 SVG source-image 当作页面 WebP 资源替代。

## 确定性完整性摘要

组件字段继续使用各公开文件**实际 UTF-8 原始字节**的 SHA-256：`bodyHash`、`seoHash`、`publicReferencesHash`、`articleHash`、`attributionHash`。不对 JSON 进行格式化后再声称等同于原文件 hash。

另计算 `integrity.publicFieldsHash`，规则如下：

1. 取 Handoff 顶层 `locale`、`country`、`body`、`bodyHash`、`seo`、`publicReferences`、`publicRequirements`。
2. 排除整个顶层 `integrity` 字段，因此不包含 `publicFieldsHash` 自身，也不包含任何完整性字段、Task、Dispatch、会话、报告路径或时间日志。
3. 对对象键递归使用 JavaScript 默认字典序（UTF-16 code-unit lexicographic order）排序；数组保持原顺序；标量按 JSON 字符串规则序列化。
4. 连接为无空白、无尾 LF 的 canonical JSON，以 UTF-8 编码后计算 SHA-256。

本次 canonical JSON 为 `21286` bytes，`publicFieldsHash=a584ffa2494326f86ea5a90b25d07eee1d40af8f89de930f9fbde190eab5475d`。因此完整性摘要不自引用，且所有公开内容字段保持在同一版本。

## 实际验证命令、退出码与关键输出

| 验证 | 退出码 | 关键真实输出 |
|---|---:|---|
| `cmp drafts/zh-CN/body.md final/zh-CN/body.md` + `shasum -a 256` | 0 | `cmp_exit=0`；draft/final 均为 `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/drafts/zh-CN/body.md --locale zh-CN` | 0 | `mechanical_units=3210`，`required_floor=2000`，`meets_mechanical_floor=true`；raw/nfc_lf SHA 均为固定正文 SHA |
| 只读 Node UTF-8/NFC/LF、body/SEO/ref/article/署名/media/hash、quote/occurrence、E/D 同版和 canonical summary audit | 0 | `status=PASS`；`citationLocations=13`；`publicFieldsHash=a584ffa2494326f86ea5a90b25d07eee1d40af8f89de930f9fbde190eab5475d`；`status=CONTENT_FROZEN`、`seoReview=PASS`、`handoffFreeze=CONTENT_FROZEN` |
| `file ...spell-choice.svg ...spell-choice.webp` | 0 | SVG 为 SVG image；WebP 为 `780x2100` |
| `xmllint --noout editorial/dnd-warlock-spells/media/zh-CN/spell-choice.svg` | 0 | `xmllint_exit=0`；根元素为 `780×2100`、`viewBox=0 0 780 2100` |
| `jq empty` 三个 JSON | 0 | Handoff、publicReferences、SEO 均可解析 |
| 公开面精确污染扫描（8 个 body/article/SEO/ref/handoff/署名/SVG/WebP 文件） | 0 | 每个文件 `NO_MATCH exit=1`；包装脚本 `scan_command_exit=0` |
| `orca orchestration check --terminal term_7ab2d400-cc4a-4865-9d4c-96b0c36ff1fd --json` | 0 | Run `run_39994fa3f53e`、Dispatch `ctx_483621019eab` 可回读；消息批次为空 |

## 状态边界

- 内容技术冻结：**PASS**。
- D/E 同版及 E-SEO 版本对应：**PASS**。
- 精确地区 SERP、PAA、搜索量：**UNVERIFIED**；没有把 `gl=CN` 查询偏好写成中国地区排名。
- 网站写入、真实文章路由、桌面/手机页面回读：**UNVERIFIED / NOT EXECUTED**。
- 用户终审：**UNVERIFIED / NOT EXECUTED**。
- 生产部署：**UNVERIFIED / NOT EXECUTED**。

