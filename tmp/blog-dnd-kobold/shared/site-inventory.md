# 站点盘点：dnd kobold tokenmaker.one

核验日期：2026-09-16  
站点：https://www.tokenmaker.one  
角色：A-SITE（explore 01a0a79a-4220-7c30-9657-8691a4d7681b）只读完成；主调度落盘。  
范围：`src/lib/blog/registry.ts`、`src/lib/blog-posts/`、`src/lib/site-content.ts`、`src/lib/site-seo.ts`、`src/app/sitemap.ts`、`public/llms.txt`、编辑器 i18n；并抓取英文首页。  
未写正文、未选主意图、未生成标题。

## 1. Kobold 旧文检索

结论：**在下列范围内没有 kobold 旧文、没有 slug `dnd-kobold`、正文/封面文件名也没有 kobold 字样。**  
不把这句话扩成「全站任何二进制图里都没有狗头人」——作品廊 54 张 PNG 未做像素辨认。

| 范围 | 关键词 | 结果 |
|---|---|---|
| 仓库文本（`src/`、`public/`、`tmp/` 等，大小写不敏感） | `kobold`、`Kobold`、`狗头人` | 0 命中（检索当时） |
| `src/lib/blog/registry.ts` 全部 `slug:` | `kobold` | 无 |
| `src/lib/blog-posts/` 文件名 | `*kobold*` | 无 |
| `public/llms.txt` 已列博客 | kobold | 无 |
| `public/blog/covers/en/` 封面文件名 | kobold | 无 |

`dnd-races` 英文 FAQ 写明 2024《玩家手册》十个核心 Species：Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc、Tiefling。**该名单不含 Kobold。** 这只是种族总览文的已核验内容，不是 Kobold 规则结论。

## 2. 近邻页面（与 kobold 最相关）

H1 来源：`BlogDetailPageView` 用 `post.title` 作为 `<h1>`。中英各一篇同 slug。

| slug | EN title = H1 | ZH title = H1 | 主意图 | 状态 | updatedAt |
|---|---|---|---|---|---|
| dnd-kenku | DnD Kenku: Speech Depends on Volo's or MotM | dnd kenku：瓦罗只能拟声，灰机缺页不等于魔邓肯不能开口 | 非 2024 PHB 种族：锁书、开口/拟声、Token 留喙 | 已发布 | 2026-09-12 |
| dnd-dragonborn | DnD Dragonborn: Lock the Rulebook, Copy Breath and Names, Crop a Token | dnd dragonborn：龙裔建卡先锁版本，再抄吐息、名字和 Token | 锁 2014/2024、吐息/鳞色/名字、Token 留角 | 已发布 | 2026-09-10 |
| dnd-grung | DND Grung Guide: Traits, Best Classes, Poison Rules, and DM Tips | DND Grung 指南：特性、最佳职业、毒素规则与 DM 建议 | 非核心种族：毒素/水依赖/职业/DM | 已发布 | 2026-04-20 |
| dnd-dhampir | DND Dhampir Guide: Traits, Vampiric Bite, Best Classes, and Roleplay Tips | DND Dhampir 指南：种族特性、咬击机制、最佳职业与跑团演法 | 谱系 | 已发布 | 2026-04-17 |
| dnd-flumph | DnD Flumph Guide: Ally Clues, Telepathy, and VTT Tokens | DND Flumph 指南：盟友线索、心灵感应与 VTT Token | 怪物盟友 + Token | 已发布 | 2026-07-26 |
| dnd-races | DnD Races: Which Species Fits Your Character? | DND 种族怎么选：哪个 Species 适合你的角色？ | 2024 十个 Species vs 2014 race | 已发布 | 2026-08-10 |
| dwelf-dnd | Dwelf DnD: Build a Dwarf-Elf Character With One Rules Chassis | Dwelf DND：用一套规则做出矮人精灵混血角色 | 混血 | 已发布 | 2026-07-27 |
| how-to-build-a-dnd-character-token | How to Turn a DND Character Portrait into a Clean Virtual Tabletop Token | 如何把 DND 角色立绘做成干净好用的虚拟桌面 Token | Token 裁切教程 | **占位，无正文** | 2026-03-27 |
| mind-flayer-dnd | Mind Flayer DnD: CR 7 Matches, The Stun Clock Doesn't | 夺心魔：别把 1 分钟震慑拼上不要求失能的采脑 | 怪物锁年 + Token | 已发布 | 2026-09-12 |
| dnd-beholder | DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action | 眼魔：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作 | 怪物锁年 | 已发布 | 2026-09-13 |
| spectator-dnd | Spectator DnD: Guardian Rules, Eye Rays, and VTT Tokens | Spectator DND：守卫命令、Eye Rays 与 VTT Token | 四柄守卫眼魔 | 已发布 | 2026-08-02 |

Kenku 正文明确写：没有 Kenku 专用模板；裁自己的立绘。Dragonborn / Beholder / Mind Flayer 同样把 Token Maker 放在锁书之后。

注册合计：64 个 slug × 2 locale。已发布 62 × 2。占位 2 × 2（含 `best-dnd-classes-for-small-parties`）。

非博客公开页：`/`、`/zh`、`/faq`、`/privacy`、`/about`、`/changelog`、`/dice-roller-dnd`、`/coat-of-arms-maker`、`/contact`、`/templates/square-token-maker`。编辑器锚点：`/#editor-workspace`、`/zh#editor-workspace`。

## 3. 最近 3 篇标题（七罪套路检查）

排序：registry `updatedAt` 降序。H1 = `title`。

| # | slug | updatedAt | EN title / H1 | ZH title / H1 |
|---|---|---|---|---|
| 1 | dnd-skills | 2026-09-13 | DnD Skills: Eighteen Names, Constitution Has No Skill | dnd 5e 技能：体操对回特技，生存对回求生，观察对回察觉 |
| 2 | dnd-conditions | 2026-09-13 | DnD Conditions: Same Fifteen Names, Lock 2014 or 2024 | dnd 5e 状态：力竭已经 2 级再 +1，升到 3 不是只执行新得到的那 1 级 |
| 3 | dnd-beholder | 2026-09-13 | DnD Beholder: 2014 Cone Is a Trait, 2024 a Bonus Action | 眼魔：挑战等级 13 锁不住年，看反魔锥是特质还是附赠动作 |

同日之后最近的种族近邻：`dnd-kenku`（2026-09-12）、`mind-flayer-dnd`（2026-09-12）、`dnd-dragonborn`（2026-09-10）。只作近邻参照，不是「最近 3 篇」本身。

可观察近文形态：锁 2014/2024、只抄一页、用一个分得开的机制当轴、Token 裁切放在锁书之后、不把 PNG 写成官方模块/零配置导入保证。

## 4. 与 kobold 的冲突判断

- **无同题旧文。**
- **相邻文不构成同题覆盖：** `dnd-races` 名单无 Kobold；dragonborn/kenku/grung/dhampir 主题不同；通用 Token 教程占位未上线。
- **产品页无 Kobold 专用模板/预设。** 风格预设：Warrior / Mage / Rogue / Cleric / Ranger / Undead / Monster / Other。

## 5. 产品关联建议（独立小节，勿写入主搜索意图）

**是否服务本站目标读者：** 是。本站公开读者是需要 VTT Token 的 DnD / Roll20 / Foundry / Owlbear 玩家与 DM。

**本工具能否帮助完成该任务：**

- 能：用户自备 Kobold 立绘（JPG/PNG/WEBP ≤10MB），在浏览器里裁切、选遮罩/边框/文字，导出透明 PNG。
- 不能：Kobold 规则数据库、官方 stat block、专用 Kobold 边框/模板、自动识别角/口鼻、Foundry 模块、Roll20 一键导入、角色数据导出。

建议（只给后续布局）：

1. 主意图保持读者对 D&D Kobold 的规则/建卡/遭遇问题，产品只作锁书之后的可选地图标记。
2. 产品句式对齐 Kenku/Dragonborn/Beholder。
3. 内链候选：`/` 或 `/zh#editor-workspace`、`/faq`、`/privacy`、`/blog/dnd-races`、`/blog/dnd-kenku`、`/blog/dnd-dragonborn`。不要把占位 Token 教程当已上线文内链。
4. 不要声称已测试某张 Kobold 图导入某个具名 Roll20/Foundry 世界。

## 6. 编辑器真实 UI 名称

英文 `src/lib/i18n/en.ts` / 中文 `src/lib/i18n/zh.ts`：Editor Workspace / 编辑工作区；Local-first / 本地优先；Open editor / 打开编辑器；Controls / 控制面板；Image / 图片设置；Scale / 缩放；Reset Position / 重置位置；Clear Workspace / 清空工作区；Text Settings / 文字设置；Add Text / 添加文字；New Text / 新文本；Style / 样式设置；Border Tint / 边框颜色；Presets / 风格预设；Borders / 边框模板；Masks / 遮罩形状；Circle/Square/Hexagon/Octagon/Decagon/Dodecagon；Drop image here to start；JPG, PNG, WEBP up to 10 MB；Export / 导出；Export Size / 导出尺寸；Download PNG / 下载 PNG；Download ZIP / 下载 ZIP；Batch Mode。

导出尺寸：`SIZES = [256, 512, 1024, 2048]`。默认 `exportSize: 256`。自定义边框上限 8。

首页现场抓取（2026-09-16）H1：`Free DnD Token Maker for Roll20 and Foundry VTT`。主 CTA：`Start making tokens` → `#editor-workspace`。

## 7. 未核验项

- 未在生产环境逐一点击编辑器每个按钮。
- 未把导出 PNG 导入某个具名 Roll20 / Foundry / Owlbear 世界。
- 未声称支持 JPG/WEBP/GIF 导出。
- 未声称官方插件、模块、角色 JSON 导出。
- 未对作品廊 54 张图做 Kobold 视觉识别。
- 平台最低像素规格未核验；方形模板页「512 or 1024」是本站建议。
