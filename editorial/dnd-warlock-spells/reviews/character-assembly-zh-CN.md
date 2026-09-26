# zh-CN 图像绑定与 content-only 交付机械报告

## 执行身份与范围

- Run：`run_39994fa3f53e`
- Task：`task_ee6cf6f30ebd`
- Dispatch：`ctx_5d6495a59509`
- Worker terminal/session：`term_fdd4dd42-3759-474c-8efc-de26a50b3d12`
- Runtime：`74a69eea-06aa-4604-bb3f-acad7c782697`
- 工作树：`/Users/wusir/orca/workspaces/token-maker-app/博客`
- 范围：zh-CN 图片绑定与 content-only 交付；不写网站、不启动页面或浏览器验收、不提交/push/deploy、不改数据库/密钥/Hermes/原始工作区、不新增依赖。
- 已读取：`/Users/wusir/Desktop/博客-V7修订版/执行入口.md`、`01-统一工作流.md`、`04-公开交接与页面装配.md`、`参考规则/事实核验与公开引用.md`、`research/rules/facts.md`、三个 `reviews/image-*.md` 及三个实际 WebP 文件；未把验收样稿或历史参考作为素材。
- 状态：`userReview=PENDING`；`independentReview=SKIPPED_BY_USER`。本报告只记录制作自检和机械检查，不声明内容通过或 `CONTENT_FROZEN`。

## 交付变更

- 正文唯一图位由旧流程图改为已有 `../../media/characters/eldritch-blast.webp`；未新增其他图位，旧 `spell-choice.webp` 与 `spell-choice.svg` 均保留。
- 规则正文其他段落保持不变；只同步更新该图位的实际画面 alt、中文 caption 和旧图衔接。
- 选定 WebP 实际为 1536×1024、284060 bytes、SHA-256 `28340a878a3b507a9858a91414c35b8ba48ff1c2035795434a985ee3569cee68`。
- `PublicBlogHandoff.body` 已回写与 final body 完全相同的 UTF-8 文本；`publicRequirements.media` 仅保留这一项；`public-references.json` 的 13 个 quote/occurrence 重新绑定到新 `bodyHash`。
- `final/zh-CN/seo.json` 保持字节不变，SHA-256 仍为 `34c4abb5eea95dbffa0d107a19ecefe66534e3d20be56ef716383aca96b0f6bd`；`attribution.md` 保持字节不变，SHA-256 仍为 `c1d87a906c68bbc9b046d009cdbd190fbebe77be8a2793534eb051bb6441a173`。

最终回读 SHA-256：

| 文件 | SHA-256 |
|---|---|
| `drafts/zh-CN/body.md` | `31df1846c4bc36a50535fc4f0d3e2d2c30468c42c585d60b540f7434cb610e3e` |
| `drafts/zh-CN/author-notes.md` | `b6a3d5c655b0c0df57bdd6542e2811a4b44aad7cd778090aa1d128f50bd70cf6` |
| `final/zh-CN/body.md` | `31df1846c4bc36a50535fc4f0d3e2d2c30468c42c585d60b540f7434cb610e3e` |
| `final/zh-CN/article.md` | `8800dd257f6ed5c8a03bfb29821880e362cd95fab28d21302e87f9e3ab2f1448` |
| `final/zh-CN/public-references.json` | `ad402a25956306e69a0c2011999d735b029b200b79787bdf825a2a4adae2df25` |
| `final/zh-CN/PublicBlogHandoff.json` | `cd3731a2710b40d8e1dcf10097e32795974fb23eb0d7834eb7d9e05c35264f10` |

## 原版备份

本次写入前已新增且未覆盖以下专属备份目录：
`editorial/dnd-warlock-spells/internal/pre-character-20260926/zh-CN/内/`

| 备份 | 写入前 SHA-256 |
|---|---|
| `drafts/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| `drafts/author-notes.md` | `7225d79bd93ef227d51cdd50f33a7501f84ab0d851549548b0b0ba5037d74360` |
| `final/body.md` | `7732341ce960c9d0eaa3feaa5310b0a22b98f482328b3c7664ef01467171b330` |
| `final/article.md` | `63d813d9a29f288e6b03a38305dd2473c61ec2c55cd614c49aef1e679a9db826` |
| `final/public-references.json` | `9f5d5db454f807586c22da4acbaa493a04f5be506d57425ea6025160fc8f0dee` |
| `final/PublicBlogHandoff.json` | `714860d7da7f411bf1df1c78ae4be9eee617cc9f4b7972a2c484b9807c8fcc69` |

## 视觉与媒体制作自检

- `view_image` 实际读取了 `eldritch-blast.webp`、`arcane-flight.webp`、`focused-concentration.webp`。选定的 Eldritch Blast WebP 可见一名主体、清晰面部和张开的施法手、单束紫色能量、完整画面；未见文字、面板、表格或水印。该结果是制作自检，不是独立内容审阅。
- `file`：exit `0`，WebP/VP8，1536×1024。
- `sips -g pixelWidth -g pixelHeight -g format -g space ...eldritch-blast.webp`：exit `0`，1536×1024，webp，RGB。
- `ffprobe ...eldritch-blast.webp`：exit `0`，`codec_name=webp`、`width=1536`、`height=1024`、`pix_fmt=yuv420p`。
- `stat` 与 `shasum -a 256`：均 exit `0`，`bytes=284060`，SHA-256 为 `28340a878a3b507a9858a91414c35b8ba48ff1c2035795434a985ee3569cee68`。

## 机械验证

| 检查 | 命令/退出码 | 真实结果 |
|---|---|---|
| 正文计数 | `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py editorial/dnd-warlock-spells/drafts/zh-CN/body.md --locale zh-CN --exclude-heading FAQ --exclude-heading 来源`；exit `0` | `mechanical_units=3224`，`required_floor=2000`；raw/NFC-LF hash 均为 `31df1846c4bc36a50535fc4f0d3e2d2c30468c42c585d60b540f7434cb610e3e`。这是机械长度结果，不是内容质量结论。 |
| draft/final body | `cmp -s drafts/zh-CN/body.md final/zh-CN/body.md`；exit `0` | 字节一致；body bytes `13811`。 |
| UTF-8/LF/NFC | 只读 Node `TextDecoder(fatal)`、CR 检查、NFC 等值检查；exit `0` | body、article、author-notes、两份 JSON、attribution 均 UTF-8、LF、NFC，均有末尾 LF。 |
| article 拼接 | 只读 Node 按 `# seo.h1 + body + attribution` 比较；exit `0` | `articleAssembly=PASS`；article SHA-256 `8800dd257f6ed5c8a03bfb29821880e362cd95fab28d21302e87f9e3ab2f1448`。 |
| JSON 与引用 | `jq empty` 两份 JSON；exit `0`；只读 Node 校验引用/哈希；exit `0` | JSON 可解析；13 个 quote/occurrence 均精确定位；`publicReferencesHash=ad402a25956306e69a0c2011999d735b029b200b79787bdf825a2a4adae2df25`。 |
| Handoff integrity | 只读 Node 复算递归 key-sort、数组保序、compact UTF-8、排除 integrity 的 canonical hash；exit `0` | `publicFieldsHash=f9ca9a2f6607da18ba6d87192e3a1ce4232b3e9e30760bd3967e00d9a67c63aa`；body 字段与 final body 字节相同；status=`USER_REVIEW_PENDING`；mechanical=`MECHANICAL_CHECKED`；无 `CONTENT_FROZEN` 或旧 `PASS` 断言。 |
| 媒体绑定/旧图 | 只读 Node 路径、尺寸、bytes、SHA、alt/caption 与旧引用检查；exit `0` | 新 WebP 文件存在且哈希匹配；旧图引用 `0`；旧 WebP/SVG 文件仍存在。 |
| 空白字符 | `awk` 扫描 allowlist 文本文件；exit `0` | `trailing_whitespace=0`。 |

相对原版 body 的 `diff -u` exit `1` 是预期差异，定位到恰好两行：旧图 Markdown 与其图注；不是失败。第一次组合验证命令因验证器把 `attribution.md` 的 `## 公开署名` 标题误当作 facts 中的逐字归属文本而 exit `1`，修正为比较归属正文后，最终组合机械验证 exit `0`，没有因此改动署名或正文。

## 文件与状态结论

- `PASS（机械）`：UTF-8/LF/NFC、draft/final cmp、计数 3224、article 拼接、JSON parse、bodyHash、publicReferences 定位、媒体路径/尺寸/bytes/SHA、旧图保留、canonical `publicFieldsHash`、无明显内部污染。
- `UNVERIFIED`：独立 D/E 内容审阅、语义事实复核、浏览器页面呈现、网站路由、部署、精确地区 SERP；这些不在本次用户已确认的 content-only 制作角色内。
- `PENDING`：用户终审；`independentReview=SKIPPED_BY_USER` 按用户明确指令记录。
- 未运行 typecheck/lint/test/build：本次只改 Markdown/JSON 交付包和绑定报告，不改应用代码，不写网站。
