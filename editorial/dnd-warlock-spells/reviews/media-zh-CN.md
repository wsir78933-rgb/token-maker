# dnd warlock spells：中文正文示意图交接

## 身份与范围

- Run：`run_39994fa3f53e`
- Task：`task_796f0e17d7d7`
- Dispatch：`ctx_239c53e1e3e1`
- Worker 会话/终端：`term_99937249-9bbf-45c7-9ad3-ffd126042df5`
- 协调者终端：`term_2b5c6082-1ffd-43b2-9816-0e0baf5eea10`
- 独立浏览器：ego-browser TaskSpace `36`，页面 `p1`

本任务只按 `planning/zh-CN/task-card-v1.md`、`research/rules/facts.md` 及其已列官方来源制作简体中文精确规则图；没有读取旧中文布局卡、验收样稿或历史参考作为素材。未修改正文、布局、英文媒体或网站项目；未启动网站、未写入网站、未提交/push/deploy、未新增依赖。

## 交付文件

| 文件 | 说明 | 尺寸 / SHA-256 |
|---|---|---|
| `editorial/dnd-warlock-spells/media/zh-CN/spell-choice.svg` | 原创、可控的纵向规则图 | 780×2100；`9560eb09ada1771eb8e271a0919085adeebca8b9842b183f967dd4f2588797c0` |
| `editorial/dnd-warlock-spells/media/zh-CN/spell-choice.webp` | SVG 的 WebP 衍生资源 | 780×2100，133876 bytes；`eeaf1525ebb8b4270118fd264ed16e20dafea92d479e86ae420fd5b2d7455893` |

图中保持 B 卡指定顺序：先确认规则年份、等级、允许来源和打法；再区分基础准备数、Pact Magic、always prepared；随后按动作/射程/位置/专注/目标/豁免贴字段；最后比较 Eldritch Blast、Hex、Hypnotic Pattern、Misty Step、Counterspell，并以条件化候选收尾。图中明确保留 1/3/5 级的 2/4/6 项基础准备数、1/3/5 级的 1×1 环/2×2 环/2×3 环 Pact Magic，以及“专注不能叠加”和“2024 同一 turn 只消耗一个法术位”。

## 公开文字

**alt**：2024 D&D Warlock 选法术决策图，区分基础准备法术数量、Pact Magic 法术位、always prepared 来源，并比较 Eldritch Blast、Hex、Hypnotic Pattern、Misty Step 与 Counterspell。

**caption**：先核对准备数量和 Pact Magic，再按动作、专注与目标条件筛选；示例不构成必选清单。

## 图中文字与事实来源对应

| 图中内容 | 事实依据 | 公开来源 |
|---|---|---|
| 基础准备数 1/3/5 级为 2/4/6；always prepared 额外来源不占基础数 | `facts.md` R02；B 卡 ZF02、ZF05 | [2024 Warlock](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock) |
| Pact Magic：1 级 1×1 环、3 级 2×2 环、5 级 2×3 环 | `facts.md` R01；B 卡 ZF01 | [2024 Warlock](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Warlock) |
| Eldritch Blast：戏法、动作、120 英尺、无专注；5 级 2 束 | `facts.md` F01；B 卡 ZF08 | [Eldritch Blast](https://www.dndbeyond.com/spells/2619161-eldritch-blast) |
| Hex：1 环、附赠动作、90 英尺、专注至多 1 小时 | `facts.md` F02；B 卡 ZF06–07 | [Hex](https://www.dndbeyond.com/spells/2618988-hex) |
| Hypnotic Pattern：3 环、动作、120 英尺、30 英尺立方、感知豁免、专注至多 1 分钟 | `facts.md` F14；B 卡 ZF10 | [Hypnotic Pattern](https://www.dndbeyond.com/spells/2619168-hypnotic-pattern) |
| Misty Step：2 环、附赠动作、至多 30 英尺、可见且未被占据、无专注 | `facts.md` F06；B 卡 ZF11 | [Misty Step](https://www.dndbeyond.com/spells/2619133-misty-step) |
| Counterspell：3 环、反应、60 英尺、看见施法生物、体质豁免 | `facts.md` F11；B 卡 ZF12 | [Counterspell](https://www.dndbeyond.com/spells/2619072-counterspell) |
| 不能同时维持两个需专注法术 | `facts.md` R08；B 卡 ZF13 | [Concentration](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration) |
| 2024 同一 turn 只能消耗一个法术位施法 | `facts.md` R07；B 卡 R07/S24R | [2024 Spells：One Spell with a Spell Slot per Turn](https://www.dndbeyond.com/sources/dnd/br-2024/spells#OneSpellwithaSpellSlotperTurn) |

图中只使用上述已核验字段，没有绘制 `facts.md` 标记为 UNVERIFIED 的法术效果、未核验范围或强度排名；“没有必选法术”是 B 卡规定的条件化选择边界，不是官方规则主张。

## 原创制作说明

SVG 为本任务手工编写的可控矢量规则图，不是生成插画，也不是操作截图或实战测试。WebP 仅由 SVG 栅格化后转换得到：`/usr/bin/sips` 将 SVG 转为临时 PNG，已安装的 `/opt/homebrew/bin/cwebp` 以质量 88 转为 WebP；未安装依赖或改动 `package.json`。图片文字、颜色区块、顺序箭头和候选字段均由已核验规则与 B 卡图位要求构成，无第三方图片素材或额外事实。

## 验证记录

| 检查 | 命令 / 实际证据 | 结果 |
|---|---|---|
| SVG 解析 | `xmllint --noout editorial/dnd-warlock-spells/media/zh-CN/spell-choice.svg`，退出码 0 | PASS |
| SVG → PNG | `sips -s format png .../spell-choice.svg --out <临时路径>/spell-choice.png`，回显 `sips_exit=0`；PNG 为 780×2100 | PASS |
| PNG → WebP | `/opt/homebrew/bin/cwebp <临时 PNG> -q 88 -o .../spell-choice.webp`，回显 `cwebp_exit=0` | PASS |
| 资源回读 | `file` 确认 SVG 为 SVG、WebP 为 780×2100 WebP；`wc -c` 回读 SVG 13461 bytes、WebP 133876 bytes；`shasum -a 256` 已记录于上表 | PASS |
| 文本合同 | `rg` 回读标题、三类资源、五个候选、专注/法术位检查和“没有必选法术” | PASS |
| 实际视觉检查 | `view_image` 检查 WebP 原图/高质量视图；ego-browser TaskSpace 36 / p1 打开 SVG，标题与全部图中文字在 snapshot 中可读 | PASS |
| 窄屏检查 | ego-browser 在 390px CSS 视口用独立 `<img width="390px">` 回读：`viewport.width=390`、`scrollWidth=390`、`image.width=390`、`image.height=1050`；截图 `/tmp/dnd-warlock-zh-390-scaled.png` 实际查看 | PASS：无横向溢出、无裁切，流程箭头和五张候选卡可辨 |

## 验收结论

- **PASS**：精确 SVG 与 WebP 均生成；规则、资源分栏、顺序箭头、五个候选、专注/法术位/术语和条件化结论均与 B 卡及 `research/rules/` 对应；实际原图与 390px 缩放视觉检查无裁切。
- **FAIL**：无本任务范围内的已确认失败。
- **UNVERIFIED**：尚未装入正文或现有网站页面，因此未验证真实页面中的图位、响应式组件裁切、公开 URL、页面 alt/caption 渲染和用户终审；这符合本 Worker 仅制作媒体、不启动网站的范围。

