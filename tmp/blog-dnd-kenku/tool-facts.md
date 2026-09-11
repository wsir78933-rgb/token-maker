# Token Maker 工具事实（供 DnD Kenku 文内链）

- 类型：工具事实
- 核验日期：2026-09-11
- 产品：Token Maker（https://www.tokenmaker.one / https://www.tokenmaker.one/zh）
- 本地仓库：`/Users/wusir/Desktop/开发项目集合/token-maker-app`
- 规则：只写页面文案或代码里能核对的能力。没观察到的按钮、格式、价格、速度、兼容实测、商用授权，一律不当成事实。
- 方法：读了 `src/lib/site-content.ts`、`src/lib/i18n/{en,zh}.ts`、编辑器上传/导出/批处理代码、博客 registry；打开了线上首页、`/zh`、FAQ、隐私、骰子页、方形模板页、职业文、种族文。Kenku 在仓库与线上检索均为 0 条。
- 局限：首页编辑器是客户端延迟加载（`DeferredEditorLayout`，`ssr: false`）。2026-09-11 线上 HTML 快照能核对首页/FAQ/CTA 文案与 `#editor-workspace` 链接，但快照里看不到编辑器按钮。编辑器按钮用词以仓库 i18n（即线上会加载的文案）为准，并在表里标明。

## 事实表

| 事实ID | 拟用措辞 | 来源 | 证据位置 | 是否允许公开 | 局限 |
|---|---|---|---|---|---|
| TF-01 | Token Maker 的编辑器在英文首页，锚点是 `#editor-workspace`。中文编辑器在 `/zh`，锚点同样是 `#editor-workspace`。没有独立 `/editor` 路由。 | 线上 https://www.tokenmaker.one ；https://www.tokenmaker.one/zh ；本地 `src/lib/site-locale.ts`、`src/components/layout/EditorLayout.tsx`、`src/app/(en)/page.tsx` | 线上首页 CTA `[Start making tokens](#editor-workspace)`；中文 `[开始制作 Token](#editor-workspace)`。代码 `id="editor-workspace"`。`src/app/(en)/` 下无 `editor/` 目录。 | 允许 | 不要写成 `/editor`。博客 CTA 按钮文案是 `Open Editor` / `打开编辑器`，首页主 CTA 是 `Start making tokens` / `开始制作 Token`。 |
| TF-02 | 编辑器上传区文案：英文 `JPG, PNG, WEBP up to 10 MB`；中文 `支持 10MB 内 JPG、PNG、WEBP`。拖放提示：`Drop image here to start` / `拖拽图片到这里开始`。 | 本地 `src/lib/i18n/en.ts`、`src/lib/i18n/zh.ts`、`src/lib/utils/imageValidation.ts`、`src/components/editor/ImageUploader.tsx` | i18n `supportedFormats`、`dropHint`。校验：扩展名 `.png/.jpg/.jpeg/.webp`，MIME `image/png` `image/jpeg` `image/webp`，上限 `10 * 1024 * 1024`。 | 允许 | 这是编辑器立绘上传规则。未在线上 HTML 快照里看见该提示（编辑器延迟加载）。不要写 GIF、BMP、SVG 立绘上传。 |
| TF-03 | 单枚 Token 导出是透明 PNG。按钮文案：`Download PNG` / `下载 PNG`。下载文件名形如 `token_{时间戳}.png`。 | 线上 FAQ https://www.tokenmaker.one/faq ；本地 `src/lib/i18n/en.ts`、`src/components/editor/export-token.ts`、`src/lib/renderer/pipeline.ts` | FAQ：「Yes. Token Maker exports transparent PNG tokens…」。`exportTokenAsPNG` 使用 `canvas.toBlob(..., 'image/png', 1.0)`。 | 允许 | Token 编辑器没有 JPEG/WebP/PDF/SVG 导出。纹章制作器另有其它格式，禁止混写成 Token 能力。未实测透明通道质量。 |
| TF-04 | 导出尺寸可选 256、512、1024、2048。首页写「Transparent PNG export up to 2048」/「透明 PNG 导出最高 2048」。方形模板页建议：多数实战 512，归档或近距 1024，资源包或长期库才用 2048。 | 线上 https://www.tokenmaker.one ；https://www.tokenmaker.one/templates/square-token-maker ；本地 `src/components/editor/TemplatePanel.tsx` | 首页亮点与 Signals `Up to 2048` / `最高 2048`。`SIZES: [256, 512, 1024, 2048]`。方形页 FAQ「What size should a square VTT token be?」。 | 允许 | 256 出现在编辑器尺寸条，首页营销文案强调最高 2048。不要把「512 适合所有 VTT」写成保证。 |
| TF-05 | 编辑器有批量模式。英文按钮 `Batch Mode`，中文 `批量模式`。批量可多选 JPG/PNG/WEBP，完成后 `Download ZIP` / `下载 ZIP`。ZIP 内是 PNG。 | 本地 `src/lib/i18n/en.ts`、`src/components/editor/ControlPanel.tsx`、`src/components/editor/BatchPanel.tsx`、`src/lib/batch/zip-export.ts` | ControlPanel 按钮 `t('batchMode')`。多文件上传会 `activate()` 批处理。`downloadBatchZip` 用 JSZip，文件名 `{原名}_token.png`。 | 允许，但 Kenku 文不必主动推销批量 | 线上 HTML 快照未见该按钮。不要写批量上限数量（未在公开文案里核到）。不要写「一键导入 Foundry」。 |
| TF-06 | 官方首页能力用词：英文 `token borders, masks, and text`；中文 `Token 边框、遮罩和文字`。FAQ：支持 circular tokens、square tokens、polygon masks、built-in token borders、tint controls、custom border artwork。 | 线上首页与 https://www.tokenmaker.one/faq ；本地 `src/lib/site-content.ts` `homeCopyByLocale`、`faqItems` | 首页 hero：「Add token borders, masks, and text」。FAQ 第四问完整句。 | 允许 | 用站点实际词：mask/遮罩、border/边框、text/文字。不要发明「Kenku 边框」。 |
| TF-07 | 编辑器形状数据：Circle / Square / Hexagon / Octagon / Decagon / Dodecagon（中文：圆形、方形、六边形、八边形、十边形、十二边形）。首页对外概括为 circular、square、polygon，以及「Circle to d12」/「圆形到十二边」。 | 本地 `src/lib/templates/masks.ts`、`src/lib/i18n/en.ts`；线上首页 Signals | `MASK_TEMPLATES` 六项。首页 `Masks` 值 `Circle to d12`。 | 允许概括为圆形、方形、多边形 | 编辑器组件里没有使用 `maskTemplates`（Masks / 遮罩形状）作为独立面板标题。形状主要靠带 `linkedMaskId` 的边框、URL `?mask=`、方形模板 CTA 切换。不要写「点 Masks 面板选 Kenku 形状」。 |
| TF-08 | 边框区标题：`Borders` / `边框模板`。可 `Upload Custom Border` / `上传自定义边框`。自定义边框接受 PNG、JPEG、SVG、WEBP，最多 8 个。内置风格预设名：Warrior / Mage / Rogue / Cleric / Ranger / Undead / Monster / Other（中文：战士、法师、盗贼、牧师、游侠、亡灵、怪物、其他）。 | 本地 `src/lib/i18n/en.ts`、`src/components/editor/TemplatePanel.tsx`、`src/lib/templates/presets.ts` | `MAX_CUSTOM_BORDERS = 8`；`accept="image/png,image/jpeg,image/svg+xml,image/webp"`。`STYLE_PRESETS` 列表。 | 允许写「可选边框、自定义边框、风格预设」 | 预设是职业/题材风格，不是种族模板。Rogue 预设 ≠ Kenku 模板。i18n 有 `uploadCustomMask`，但 Token 编辑器未使用，禁止写自定义遮罩上传。 |
| TF-09 | 文字功能按钮：`Add Text` / `添加文字`。控件名：Font Size / Font Family、Text Color、Border Tint、Overlay Tint（中文：字号、字体、文字颜色、边框颜色、叠加层颜色）。 | 本地 `src/lib/i18n/en.ts`、`src/components/editor/ControlPanel.tsx` | ControlPanel「文字设置」与「样式设置」区块。 | 允许 | 不要写具体字体清单，除非另核 `src/lib/editor-fonts/catalog.ts`。Kenku 文若提到标签，只说「可以加文字」，不要承诺自动生成鸟语/拟声标签。 |
| TF-10 | 全仓库与线上检索均无 Kenku / kenku。没有 Kenku 专用模板、预设、边框包或种族页。种族文列出的 2024 核心 Species 是 Aasimar、Dragonborn、Dwarf、Elf、Gnome、Goliath、Halfling、Human、Orc、Tiefling，不含 Kenku。 | 本地全库 grep；线上 https://www.tokenmaker.one/blog/dnd-races 与 https://www.tokenmaker.one/zh/blog/dnd-races | 仓库 `Kenku\|kenku` 0 命中。种族文 FAQ「How many races are in the 2024 Player's Handbook?」十个名单。 | 允许写「没有 Kenku 专用模板；用自己的立绘做 Token」 | 不要暗示工具内置鸟人裁切、喙部识别或 Kenku 种族规则。种族文可内链，但不能说「种族文讲了 Kenku」。 |
| TF-11 | 官方 VTT 表述是：导出的 PNG「are designed for Roll20, Foundry VTT, Owlbear Rodeo, and similar virtual tabletop workflows that accept image tokens」。中文：「导出的 PNG Token 面向 Roll20、Foundry VTT、Owlbear Rodeo 这类虚拟桌面和地图工具」。首页标题：`Free DnD Token Maker for Roll20 and Foundry VTT` / `免费 DnD Token Maker，适合 Roll20 和 Foundry VTT`。 | 线上 https://www.tokenmaker.one/faq ；https://www.tokenmaker.one ；本地 `src/lib/site-content.ts` `faqItems` / `faqItemsZh` / `siteConfig` | FAQ 第二问原文。首页 H1 与 description。 | 允许，必须带「接受图片 Token 的工作流」这一条件 | 不是官方插件、不是认证兼容、不是「导入后零修改」。首页反馈区仍写用户可能遇到 Roll20/Foundry 还需二次调整。禁止写「适合所有 Foundry 版本」。 |
| TF-12 | 默认裁切、加框和普通 PNG 下载是本地优先：立绘可以留在浏览器里，普通 PNG 在浏览器本地生成。复制分享链接或分享到 X / Pinterest / Reddit 会把生成后的 PNG 经 `/api/share` 上传到 R2，得到公开链接；有链接的人都能看。该页不提供自助删除或保留承诺。 | 线上 https://www.tokenmaker.one/privacy ；https://www.tokenmaker.one/zh/faq | Privacy「Default local editing」「Public share links」「Public access boundary」。 | 允许在涉及上传隐私时引用 | 不要写成「图片永远不上网」。分享动作会上传。不要 invent 保留天数（README 写 R2 生命周期 30 天，公开隐私页未写，文章勿用）。 |
| TF-13 | 站点以免费工具对外宣传：首页 H1 含 Free / 免费；首页 JSON-LD `Offer.price` 为 `0`、`priceCurrency` `USD`。公开页没有标出 Token 导出的商用授权范围。仓库 LICENSE 约束的是源码个人非商业使用，不是用户导出图。 | 线上首页；本地 `src/app/(en)/page.tsx`、`LICENSE`、`README.md` | `offers.price: '0'`。LICENSE 标题 `TOKEN MAKER PERSONAL NON-COMMERCIAL LICENSE`，对象是 Covered Materials（源码）。 | 「免费在线制作」允许；「免费商用导出图」不允许 | 禁止承诺导出 Token 可商用、可上架、可卖素材包。第三方立绘版权仍归原作者。 |
| TF-14 | 骰子是独立页，不是编辑器内功能。英文 `/dice-roller-dnd`，中文 `/zh/dice-roller-dnd`。线上可见 d4–d20、d100、Bonus、Roll、Clear，以及 4d6 drop lowest 说明。 | 线上 https://www.tokenmaker.one/dice-roller-dnd ；本地 `src/lib/site-content.ts` changelog、`src/lib/blog-posts/shared.ts` | 页面标题 `DnD Dice Roller`。导航文案 `Dice Roller` / `骰子`。 | 允许 | 不要把掷骰写进 Token 编辑器功能。不要写「物理真实骰」；页面是浏览器托盘。 |
| TF-15 | 职业总览文已上线：`/blog/dnd-classes-explained` 与 `/zh/blog/dnd-classes-explained`。种族/Species 文已上线：`/blog/dnd-races` 与 `/zh/blog/dnd-races`。博客侧栏 CTA：`Open Editor`、`Dice Roller`、`Coat of Arms Maker`（中文：打开编辑器、骰子工具、纹章制作器）。 | 线上上述 URL；本地 `src/lib/blog/registry.ts`、`src/components/site/views/BlogDetailPageView.tsx` | 种族文 H1「DnD Races: Which Species Fits Your Character?」。职业文 H1「DND Classes Explained…」。 | 允许作自然内链 | 职业文提到 Rogue/Bard/Ranger 等，不是 Kenku 专文。不要把职业文说成 Kenku 职业推荐引擎。 |
| TF-16 | 方形 Token 工作流页：`/templates/square-token-maker` 与 `/zh/templates/square-token-maker`。CTA 打开 `/?mask=square&border=plain-square-thin#editor-workspace`（中文首页等价 `/zh?mask=square&border=plain-square-thin#editor-workspace`）。 | 线上 https://www.tokenmaker.one/templates/square-token-maker ；本地 `src/lib/site-content.ts` `query` | 按钮「Open square token maker」。`templatePages[0].query`。 | 允许，仅当正文在讲方形棋子/网格标记 | Kenku 头像默认更常走圆形。不要把方形页写成 Kenku 默认入口。 |
| TF-17 | 站点有广告与分析披露：可能展示 Google AdSense；Clarity 在非开发环境加载；GA 仅生产且配置了测量 ID 时启用。联系表单走 Resend。 | 线上 https://www.tokenmaker.one/privacy | 「Google advertising cookies」「Analytics and operations」「Contact form and Resend」。 | 一般不进 Kenku 正文 | 不要在攻略里写「无广告」「无追踪」。 |
| TF-18 | 纹章制作器是另一条工具：`/coat-of-arms-maker`、`/zh/coat-of-arms-maker`。导航名 `Coat Maker` / `纹章制作器`。 | 线上首页导航；sitemap；`src/lib/site-content.ts` `navLabelsByLocale` | 首页 nav 含该链接。 | 仅当纹章与 Kenku 家族标记相关时可用 | 禁止把纹章导出格式（代码里有 JPEG/PDF/SVG）写成 Token Maker 能力。 |

## 文章可自然插入的内链

路径写相对路径。英文文链英文，中文文链 `/zh…`。锚文本用描述性短语，不要用「点击这里」。

| 场景 | EN 路径 | ZH 路径 | 建议锚文本 | 出现位置 |
|---|---|---|---|---|
| 做完角色概念后裁一张能认出喙和羽冠的地图头像 | `/#editor-workspace` | `/zh#editor-workspace` | EN: Token Maker editor / make a VTT token；ZH: Token Maker 编辑器 / 做成 VTT Token | 外貌、Token 裁切、备战收尾。这是主 CTA。 |
| 需要网格标记、肩部/道具更多构图，而不是贴脸圆标 | `/templates/square-token-maker` | `/zh/templates/square-token-maker` | square token workflow / 方形 Token 流程 | 仅当正文对比圆标 vs 方标。 |
| Session zero 掷属性，或 4d6 drop lowest | `/dice-roller-dnd` | `/zh/dice-roller-dnd` | DnD dice roller / 骰子工具 | 建卡、属性数组。不要插在拟声规则段。 |
| 从 Kenku 玩法转到职业选择（Rogue/Bard/Ranger 等） | `/blog/dnd-classes-explained` | `/zh/blog/dnd-classes-explained` | DND classes guide / DND 职业详解 | 「Kenku 适合什么职业」段。职业文讲的是职业手感，不是 Kenku。 |
| 需要先锁定 2014 race vs 2024 species 再谈旧种族来源 | `/blog/dnd-races` | `/zh/blog/dnd-races` | DnD races / species guide / DND 种族指南 | 版本边界段。必须说明该文核心名单不含 Kenku。 |
| 读者要核导出格式、Foundry/Roll20 官方说法、本地处理 | `/faq` | `/zh/faq` | Token Maker FAQ | 工具段脚注式一句即可。 |
| 读者问立绘会不会上传 | `/privacy` | `/zh/privacy` | privacy facts / 隐私说明 | 仅隐私段。 |
| 职业分叉（可选，不超过主链） | `/blog/dnd-ranger`、`/blog/dnd-fighter`、`/blog/dnd-bard-spells` | 对应 `/zh/blog/...` | 各文标题原句缩短 | 仅当 Kenku 文真的写到该职业。没有独立 Rogue 职业文。 |
| 博客通用侧栏已有的第二 CTA | `/dice-roller-dnd`、`/coat-of-arms-maker` | `/zh/dice-roller-dnd`、`/zh/coat-of-arms-maker` | Dice Roller / Coat of Arms Maker | 纹章只在「家族标记/旗帜」时用。 |

不要链：`/blog/how-to-build-a-dnd-character-token`、`/blog/best-dnd-classes-for-small-parties`（registry 里是 placeholder，未作为已发布正文）。不要链不存在的 `/blog/dnd-kenku` 或 `/editor`。

## 绝对不能写的产品句子

1. Token Maker 有 Kenku 模板 / Kenku 预设 / 鸟人专用边框。
2. 打开 Masks 面板选 Kenku 形状。（未见独立 Masks 面板；也无 Kenku 形状。）
3. 工具会自动识别喙、羽毛或拟声文字。
4. 一键生成 Kenku 立绘 / AI 出图。
5. 导出 JPEG、WebP、GIF、PSD、Foundry JSON、Roll20 角色表。
6. 上传 GIF/SVG/BMP 立绘。（立绘是 JPG/PNG/WEBP，≤10MB。SVG 只出现在自定义边框，不是立绘。）
7. 自定义遮罩上传。（i18n 有词条，Token 编辑器未接。）
8. 官方 Foundry 模块 / Roll20 插件 / 认证兼容 / 导入后不用改尺寸。
9. 「我们实测 Foundry v13 / Roll20 完美显示」。本次未做平台实测。
10. 导出只要 X 秒 / 速度提升 N%。未测。
11. 导出图免费商用、可卖 Token 包、已获 Wizards 授权。
12. 图片永远不离开浏览器。（普通下载本地；分享链接会上传公开 PNG。）
13. 无广告、无 Cookie、无分析。
14. 把纹章制作器的 JPEG/PDF/SVG 导出说成 Token 能力。
15. 把仓库源码的个人非商业许可证说成用户作品授权。
16. 种族文「覆盖 Kenku」或「2024 核心种族包含 Kenku」。
17. 批量「一键同步到 VTT 素材库」。批量只下载 ZIP PNG。
18. 免费商用范围、价格档、登录墙、额度。公开页只宣传 Free / price 0，没有导出授权条款。

## 写 Kenku 文时建议用的最短工具段（可公开）

英文可用：

> Token Maker is a free browser editor on the homepage. Upload JPG, PNG, or WEBP art (up to 10 MB), add a border, mask, and optional text, then download a transparent PNG. The site says those PNGs are designed for Roll20, Foundry VTT, Owlbear Rodeo, and similar tabletops that accept image tokens. There is no Kenku-specific template; crop your own portrait so the beak and crest stay readable.

中文可用：

> Token Maker 是浏览器里的免费编辑器，入口在中文首页。上传 10MB 内的 JPG、PNG 或 WEBP 立绘，加边框、遮罩和可选文字，再导出透明 PNG。官方说明这些 PNG 面向 Roll20、Foundry VTT、Owlbear Rodeo 等接受图片 Token 的虚拟桌面。没有 Kenku 专用模板；用自己的立绘裁切，让喙和羽冠在小地图上仍能认出。

不要把上段扩成兼容保证或商用许可。
