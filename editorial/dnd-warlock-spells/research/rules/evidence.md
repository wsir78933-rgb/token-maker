# A-rules 证据与交付记录

日期：2026-09-26（Asia/Shanghai）。这是内部研究证据，不是公开稿。

## 身份、权限、文件

- Role `A-rules`；Run `run_39994fa3f53e`；Task `task_392f78caef5a`；Dispatch `ctx_408e9c51f5db`。
- Terminal `term_9c0b4c8c-e659-4ef9-aab8-ab2f5c374480`；`printenv CODEX_THREAD_ID` 退出 0，输出 `01a0dbac-ff32-75b1-a32d-60f3ae756368`。
- cwd `/Users/wusir/orca/workspaces/token-maker-app/博客`；`git branch --show-current` 输出 `博客`；`git rev-parse HEAD` 输出 `eb65956921988db3e6a16164e747d2e517429ad0`，均退出 0。
- 仅新增本目录 `facts.md` 和 `evidence.md`，均使用 `apply_patch`。无代码、新依赖、网站、数据库、提交或部署改动。初次 `git status --short` 无输出；并行 Worker 后续文件不能归为本 Worker 改动。
- 未派发子代理；没有使用付费会话、登录、绕过付费限制或抓取个人角色卡。

## 已读规则

已读取指定的 `执行入口.md`、`01-统一工作流.md`、`参考规则/事实核验与公开引用.md`、`03-博客页面生成整合.md` 研究部分；读取 ego-browser SKILL 与 goto 参数参考；运行并读取 `orca skills get orchestration`。没有读验收样稿、历史文章素材或替其他阶段写稿。

曾快速搜索 memory registry，未将历史记录用于任何主题事实。文件系统仅有逻辑范围约束，未验证底层读权限隔离。

## 真实浏览器与文档证据

全部网页使用自己的 ego-browser TaskSpace `25`，名称 `A-rules dnd warlock spells`，Page `p1`，未操作其他 Worker 标签。PDF 使用 web 文档读取器打开官方文件并按页/章节读取；未把搜索摘要当成法术正文。表中 chunk 是本会话真实命令回执，便于协调者回看；正文来源定位见 facts.md 的 S 编号。

| 证据 | 命令/工具与退出状态 | 真实关键结果 | 覆盖 |
|---|---|---|---|
| E01 | `ego-browser nodejs`，初始 shell session 33246，最终 exit 0；chunk `5ed345` | `spaceId: 25, page: p1`；free-rules 页面实际重定向到 `br-2024/character-classes`，可见 Warlock、Pact Magic、Magical Cunning 章节 | 工具真实可用，当前类页面版本 |
| E02 | ego-browser DOM 读取，exit 0；`614583` | 完整 Warlock Features 表 1–20；5 级 slots=2 / level=3；11 级 slots=3 / level=5；Magical Cunning 为 1 minute、half maximum round up；Mystic Arcanum 为无槽且 long rest；完整 Warlock 名单 | R01–R06，2024 职业规则及各候选的职业归属 |
| E03 | ego-browser → `br-2024/spells`，exit 0；`b23a1a`、`07c45f` | 看见 One Spell with a Spell Slot per Turn 条款；该页面只含一般施法规则，无独立法术描述，故没有误报读过法术正文 | R07 2024 |
| E04 | ego-browser → Legacy 类页，exit 0；`bfcb7d`、`b01ef1` | Pact Magic、Spells Known、Agonizing Blast 正文；完整 1–20 表；11/13/15/17 等级的 Mystic Arcanum 和长休条款 | R01–R06 2014 |
| E05 | ego-browser → 2014 spellcasting，exit 0；`7d51ec` | Bonus Action 法术仅允许同 turn 的 Action 戏法例外；Concentration 的替换、受伤、失能/死亡条件 | R07–R08 2014 |
| E06 | ego-browser → 2014 spells，exit 0；`705832` | 打开并抽取 12 个法术同名段落；缺失项明确返回 `missing: true`：Armor、Arms、Hex、Hunger | F01、F05–F09、F11–F16 2014；其余未冒充完整规则 |
| E07 | ego-browser → 2014 spells，exit 0；`9e3090` | Warlock Spells 列表实际包含上述 12 项对应环阶 | 基础职业可选，不以其他职业列表误证 |
| E08 | web `open` 官方 SRD 5.2.1 PDF，成功；总 364 页 | p.1 CC-BY-4.0；p.25 Cantrips；p.112 Banishment；p.120 Counterspell；p.122 Darkness；pp.123–124 Dimension Door / Dispel Magic；p.127 Eldritch Blast；p.133 Fly；p.140 Hellish Rebuke / Hex；p.141 Hold Person / Hypnotic Pattern；p.143 Invisibility；p.150 Misty Step；p.179 Concentration | F01、F02、F05–F09、F11–F16 2024，R08；逐段正文已读取 |
| E09 | ego-browser → public spells page=3，exit 0；`e45875`、`1afd9f`、`8fcc2d` | Armor 两版为 Action / Bonus Action；新版列表展开显示购买 PHB 提示；新版与 Legacy 详情均重定向商城 | F03 部分字段与访问缺口 |
| E10 | ego-browser 逐词目录查询，exit 0；`7d4836` | Arms 新版/Legacy 都是一环、Action、Self (10 ft.)、STR；Hunger 都是三环、Action、150 ft、Concentration、1 Minute；Hex 都是一环、Bonus Action、90 ft、Concentration、1 Hour | F02/F04/F10 仅目录字段 |
| E11 | ego-browser 详情序列，shell session 17622，exit 1；`ea5ce6` | 第一项 `2317-hex` 已导航提交到 `marketplace.dndbeyond.com/category/players-handbook?pid=SRC-00002`，等待 load 15000ms 超时；随后序列没有执行 | 2014 Hex 未读正文；不能将未执行的 Arms/Hunger 详情记为已读 |
| E12 | ego-browser → 2014 customization-options，exit 0；`1a9e74`、`5ed873` | 未找到要求核对的总角色等级戏法增强句；故 facts.md 只把该明文条款归到已读 2024 SRD，不跨版本声称核验 | F01 限制 |

### PDF 中直接决定版本差异的定位

以下是自主概括，非正文摘抄；web 的内部行号只供回放核对，公开引用用 PDF 页码及章节。

- p.112 Banishment，读取行 9499–9517：30 ft，按五种生物类型及维持整分钟决定是否不返回，没有逐 turn 重投条款。
- p.120 Counterspell，10326–10338：受反制生物作 Constitution save；失败的施法动作损失，但该生物用于该法术的槽不扣除。
- p.122 Darkness，10453–10470：物体选项要求未穿戴/携带，15-foot Emanation；不能复用旧版持有物初次施放措辞。
- p.140 Hex，12220–12236：额外 1d6 necrotic 是每次攻击掷骰命中；ability checks；二环 4 小时、三/四环 8 小时、五环以上 24 小时。
- p.141 Hold Person，12271–12285：Humanoid、Wisdom save、每 turn 末重投；升环没有旧版目标相互 30 ft 条款。
- p.133 Fly，11537–11549：60 ft，hover；结束仍可能坠落。
- p.143 Invisibility，12521–12532：攻击掷骰、造成伤害、施法均是结束条件。
- p.179 Concentration，15960–15975：开始另一个专注法术时原专注即结束；伤害豁免 DC 上限 30。

## 检索及访问限制

1. 本角色不负责 SERP 地区或搜索意图；未取得也未声称精确地区 SERP。web 搜索仅用于发现官方来源，混入的论坛、BG3、UA、角色卡全部排除。
2. PDF 的网页读取器可用，本机 `pypdf`、`fitz`、`pdfminer`、`PyPDF2`、`Quartz`、`pdftotext` 不存在，未安装任何依赖。未把工具缺失说成 PDF 不可读。
3. 2014 类页包含用户评论，曾在全文 lastIndexOf 抽取中出现非官方评论；后续转向实际标题/表格和主规则段，未引用评论为规则。
4. 一个多页访问序列因首项 Legacy Hex 导航超时而终止；保留失败事实，没有把剩余项目记为访问成功。Armor 两版的直接商城重定向与目录展开购买提示已真实观察；Hunger 同样的阻塞在独立 en Worker 文件有记录，但本包不拿其自报代替自己的正文阅读。
5. 已读同批 `research/en/evidence.md`、`research/zh-CN/evidence.md` 的相关片段，仅做交接交叉检查；两者也保留 Armor/Hunger 缺口，未因此扩大或虚构本次覆盖。

## 验证与状态

- PASS：已授权 allowlist 内形成分版共享事实；8 条 R 规则卡、1 条 D 推导卡、16 条 F 法术卡均有出处/条件/边界。
- PASS：12 个法术的两版核心字段与效果、2024 Hex 正文已读官方来源；目录级项目单独限制。
- UNVERIFIED：2014 Hex 完整效果；两版 Armor of Agathys / Arms of Hadar / Hunger of Hadar 的完整效果与互动；2014 多职业戏法增强明文。
- 不适用：typecheck/lint/test/build（没有代码改动）；游戏实战、伤害模拟、网站浏览器验收和部署未执行，不能从研究文件推定通过。
- 初次 `rg --files editorial/dnd-warlock-spells/research/rules` 退出 2，因为目录尚不存在；不是内容检查失败。后续使用 apply_patch 创建，未覆盖旧文件。
- `git diff --check` 退出 0，但它不覆盖未跟踪新增文件；另外必须读回文件并做专项结构/空白检查，见后续回读记录。

本阶段可向 B 交付已验证候选，不以等待非必要受限法术无限延长研究。如果 B 必须用未核验的机制，先补证或删去该具体主张；本包不授权作者补猜。

### 最终文件回读

执行只读 Python 检查，退出 0（chunk `18313c`）：逐项断言 F01–F16 存在，统计 R=8、D=1、F=16，确认显式 UNVERIFIED、两个 Markdown 均有结尾换行且无行尾空白。输出：

```text
facts.md: bytes=27130
sha256=5da435d08ab1ea426ddc4515684434f4e0ba51c58ea38e52466dd6aa6257a70a
PASS: 8 rule cards, 1 derived-example card, 16 spell cards, required identifiers, explicit gaps, no trailing whitespace
```

此校验是文件结构与交接完整性检查，不能替代后续 E 对实际正文的独立事实审核。evidence.md 本身在追加本记录前为 8598 bytes；不将其旧 hash 当成本记录最终 hash。
