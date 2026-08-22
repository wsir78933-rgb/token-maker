# WORKLOG

## 交接单 · 2026-08-22 19:10 CST · Grok worker

### 本次目标

按 `tmp/layout-arrange-recon.md`、`tmp/layout-names-recon.md`、`tmp/layout-upload-recon.md` 把 Position 嵌套间距、Arrange 属性栏、Names chrome、Charges→Upload 控件对齐竞品布局/字号/间距。保留自己的可用上传，不抄付费墙。不提交。

### 已完成

- Arrange：DISPLAY 取整 X/Y/Rotation/Size；store 保持精度；`Number` 得到 NaN 立刻抛出原始字符串。
- `globals.css`：左栏 `.coat-target-tool-tree-branch` 用竞品计算 px；Arrange 段头/按钮/输入；Names 下拉+主按钮+名单卡片；Upload 继续用资料栏 padding。
- NamePanel：藏掉可见标签、Generate 内容宽左对齐、名单卡片行。保留 use project name / add motto，未改 `generateCoatNames`。
- UploadPanel：真实 `input[type=file]` 藏进现成主按钮 class，无 PRO 卡。

### 做到一半

无。浏览器对照还要在本机 `http://localhost:3000/coat-of-arms-maker` 点 Position/Tools/Charges→Upload 看一眼。

### 下一步

未提交。Contact/SEO 残留文件不要混进来。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/ArrangePanel.test.tsx src/components/coat-of-arms/NamePanel.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/CoatOfArmsPanels.test.tsx
pnpm typecheck
```

---

## 交接单 · 2026-08-22 18:15 CST · Cursor CLI

### 本次目标

C：修偏好加载吞错，并按关注点分开提交。不提交 Contact/SEO，不提交 `tmp/`。

### 已完成

- `readStoredEditorPreferences` 不再吞 `Error`。加载失败时工作台顶栏下出现 `role="alert"`（`Editor action failed: …`），工作台仍可开；非 Error 仍立刻抛出并带原值。
- 验证：`vitest` Maker + commands 175/175；`tsc --noEmit`；eslint 相关文件。
- 四个 commit（未 push）：
  1. `968eaa6` unused-var displayName
  2. `5f3c744` 左栏 hover/pointer
  3. `29ab291` Charges → Upload
  4. `849c04b` 偏好加载失败可见

### 做到一半

无。

### 下一步

工作区仍有别的会话的 Contact 导航（`site-content.ts`、`InnerPageChrome.tsx`、`HomeSeoContent*`、`site-routes.test.tsx`，以及 Maker 里一行未提交的 Contact）。`tmp/` 截图未提交。需要的话再单独授权。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/lib/coat-of-arms/commands.test.ts
pnpm typecheck
```

损坏的 `localStorage['coat-maker-editor-preferences']`（例如 `{`）打开工作台应看到 alert，外观仍是 dark 默认值。

---

## 交接单 · 2026-08-22 18:05 CST · Cursor CLI（主脑）

### 本次目标

把盾徽编辑器 Charges 树最后一项从 **Ordinaries** 换成能用的 **Upload / 上传**。竞品同槽位是付费锁；我们复用已有 `UploadPanel` 做本地上传，不加 paywall。Orca Run `run_84ca07e575dc`。不提交。

### 已完成

- grok 竞品（`tmp/charges-upload-competitor.md` + `tmp/charges-upload-coamaker.png`）：Charges 最后一项是 Upload，右侧是锁定 CTA，没有 file input。产品要求实现真上传，不抄付费卡。
- grok 我方接线（`tmp/charges-upload-ours.md`）：桌面 Charges 树原先以 Ordinaries 收尾；真上传只在 stacked `CoatOfArmsPanels` 里。推荐把最后一项换成 `upload`，库栏挂现有 `UploadPanel`。
- grok 实现（`task_80e730e61130`）：只改
  - `src/components/coat-of-arms/CoatOfArmsMaker.tsx`（`ChargesTreeChildId`、树末项 `upload`、选中时渲染 `UploadPanel`、未知 childId fail-fast）
  - `src/components/coat-of-arms/workbench-copy.ts`（EN `Upload` / ZH `上传`）
  - `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`（桌面/移动树断言 + Charges→Upload 面板测试）
- 实现方自报：相关 vitest 151/151；typecheck；eslint；ego-browser 桌面 EN/ZH + 移动。未提交。
- grok 实机（`task_8cc2bfa1fcc2`，只读）：localhost Charges 末项是 Upload，cursor pointer；点开后库栏是 `Upload crest image` 文件选择，无 paywall；切回 Animals 恢复图库。截图 `tmp/charges-upload-ours-after.png`。未实际选文件（没有夹具 PNG）。
- codex 复审（`task_81dd0300b859`）：范围内无缺陷。vitest `CoatOfArmsMaker.test.tsx` 93/93；相关测试 84/84；typecheck/lint 通过。指出范围外预存在问题：`readStoredEditorPreferences` 在 `CoatOfArmsMaker.tsx:427-434` 吞掉 `Error`。

### 做到一半

无。本 Run 五个任务均 completed。

### 下一步

未提交。工作区同时有多单未提交改动，**不要混进同一个 commit**：

1. 本单：`CoatOfArmsMaker.tsx` / `workbench-copy.ts` / `CoatOfArmsMaker.test.tsx`
2. 左栏 hover + pointer：`globals.css`（及该测试里的 CSS 字符串）
3. unused-var：`commands.ts`
4. 范围外（别的会话）：Contact 导航 / SEO（`InnerPageChrome.tsx`、`site-content.ts`、`HomeSeoContent.tsx`、对应测试）

需要授权再说。饰带图库仍在磁盘和 `ChargeAndOrdinaryPanel` ordinary 模式里，只是桌面 Charges 树不再入口。

### 踩过的坑

- 旧测试 `queryByRole('button', { name: 'Upload' })` 在 Charges 未展开时恒为 null；必须先展开 Charges 再断言，标签必须是精确 `Upload` 而不是 `Upload image`。
- Codex 复审一度心跳停、preview 乱码；实际还在跑 ego-browser，最终 `worker_done` succeeded。不要按超时杀。
- 实现中途 Contact-nav 覆盖过 Maker；实现方已把 Upload 接线重新打上。Contact 仍留在工作区，与本单无关。

### 怎么验证

桌面宽度打开 http://localhost:3000/coat-of-arms-maker （必须 localhost）：展开 Charges，最后一项是 Upload / 上传，点开后出现真实文件选择（PNG/JPEG/WebP/SVG，单文件 ≤256KB，合计 ≤512KB，最多 8 个），没有 Upgrade。Animals/Objects 图库仍可用。Tools 仍是 Text/Draw/Random/Names。

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/ChargeAndOrdinaryPanel.test.tsx src/components/coat-of-arms/CoatOfArmsPanels.test.tsx
pnpm typecheck
```

---

## 交接单 · 2026-08-22 17:28 CST · Cursor CLI（主脑）

### 本次目标

把盾徽编辑器左栏 **嵌套项**（Charges → Animals / Ordinaries 等）的鼠标悬浮，对齐 coamaker.com：浅一档深灰圆角条，不要铜色/黄色光晕。Orca Run `run_3fc87487e242`。不提交。

### 已完成

- grok 竞品实测（`tmp/sidebar-hover-spec.md`）：嵌套 hover/选中都是 `#5a5a5a`，栏底 `#474747`，圆角 `0.1875rem`，无 box-shadow/filter。竞品无 Ordinaries 文案，同 class 的 Object 作对照。
- grok 我方实测（`tmp/sidebar-hover-ours.md`）：未选中 hover 是 `--coat-panel-raised` → `rgb(30,33,39)` 更暗；选中是 `--coat-active` 铜色 `rgba(86,76,57,0.26)`（用户看到的光晕）。顶级 hover 本来就是 `#5a5a5a`。
- agy：只改 `src/app/globals.css` 嵌套规则 + `CoatOfArmsMaker.test.tsx` 字符串断言。hover 与 `aria-pressed` 共用 `#5a5a5a`，圆角 `0.1875rem`，去掉选中专用 `margin-right`/`0.5rem`。未动全局 `--coat-panel-raised`。
- 实现方验证：vitest 2 文件 / 103 通过；`tsc --noEmit` 通过。
- grok 改后实机（localhost）：Ordinaries hover `rgb(90,90,90)`，无金色像素；Animals 选中同灰。PASS。`tmp/sidebar-hover-ours-after.md`。
- codex 复审：目标 CSS 与竞品一致。指出工作区还有上一单未提交的 `commands.ts` / 旧 WORKLOG（与本次 hover 无关，不要混进同一 commit）。

### 做到一半

无。

### 下一步

未提交。工作区同时有：1) 本单 CSS/测试；2) 上一单 `commands.ts` unused-var。分开提交。需要授权再说。

### 踩过的坑

- 用户截图估的 6–8px 圆角 = `3.1875 CSS px` × dpr2。实现用 `0.1875rem`，不要写成 6–8px。
- 铜黄光晕主要来自选中态 `--coat-active`，不只 hover。
- 本地「Draft available」会把工作台 `inert`，ego-browser 点不到左栏。

### 怎么验证

桌面宽度打开 http://localhost:3000/coat-of-arms-maker （必须 localhost）：展开 Charges，悬停 Ordinaries / Animals，应是比栏底略浅的深灰圆角条，无金色光晕。选中项同样是灰条。

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/ReferenceToolRail.test.tsx
```

---

## 交接单 · 2026-08-22 17:08 CST · Cursor CLI（主脑）

### 本次目标

清掉 `commands.ts` 里 `_removedDisplayName` 的 ESLint unused-vars **警告**（不是运行时错误）。Orca Run `run_07cc1abe6fb0`：agy 改代码，grok + codex 只读复审。不提交。

### 已完成

- agy（`task_e8040d6e2a54`）：`setLayerDisplayName` 空名称分支改为先拷贝图层再 `delete displayName`，去掉未使用绑定。只改 `src/lib/coat-of-arms/commands.ts`。
- 实现方自报：`eslint` 该文件 0 problems；`pnpm typecheck` 通过；`vitest run src/lib/coat-of-arms/commands.test.ts` 81/81 通过。
- grok 复审（`task_8f27a7290a19`）：对照 HEAD diff 后重跑 eslint（`--max-warnings 0` exit 0）和同一 vitest；结论无缺陷。空/空白名称仍 `not.toHaveProperty('displayName')`。
- codex 复审（`task_a099f0786cb0`）：最小 5 行改动；eslint 该文件 exit 0 空输出；typecheck + 显示名相关测试通过；结论无缺陷。指出工作区另有未提交的上一班 `WORKLOG.md`（与本次 lint 无关）。

### 做到一半

无。

### 下一步

无必须项。未提交。可选：hover 名称条加 pointer media guard（上一班留下的可选增强，本次未做）。需要的话再单独授权 commit。

### 踩过的坑

- agy 仍不走 `dispatch --inject`（沿用 `return-preamble` + `terminal send`）。本次 agy 自己发了 `worker_done`，无需 `task-update` 补结算。
- grok `worker-release` 返回 `retained / user_takeover`：终端被占用时不要强关。

### 怎么验证

```bash
pnpm exec eslint src/lib/coat-of-arms/commands.ts
pnpm typecheck
pnpm exec vitest run src/lib/coat-of-arms/commands.test.ts
```

---

## 交接单 · 2026-08-22 16:57 CST · Cursor CLI

### 本次目标

两件事合一单（Orca 编排：Cursor 主脑统筹，grok/codex/agy 执行）：1) 把用户准备好的 `/Users/wusir/Desktop/临时素材` 素材落地进项目；2) 素材图库卡片名称从"图片下方常显"改为"悬浮显示"，交互对齐竞品 coamaker.com。

### 已完成

- 203 个 WebP 进入 `public/coat-assets/materials/` 10 个类目，与 `webp-material-catalog.ts` 清单逐名一致（脚本核对）。
- `webp-material-catalog.ts`：supporters 4→19（新增 15 个 paired-*），顶部注释 188→203；`assets.test.ts` top 数量断言 42→57。
- 悬浮名称条（规格实测自 coamaker.com：静止无文字；悬浮时图片底部 rgba(0,0,0,0.6) 名称条、白字 10px 居中、两行截断；aria-label 保留、名称条 aria-hidden；触屏不常显）：`ReferenceAssetGallery.tsx`、`TargetTokenPalette.tsx`、`TargetFlagPalette.tsx`，样式类 `coat-gallery-card` 在 `globals.css`。
- ordinaries 图库由列表行改为 3 列图卡网格＋悬浮显名（`AssetLibraryPanel.tsx`，唯一使用方 `ChargeAndOrdinaryPanel.tsx`）。
- 验证全绿：`pnpm typecheck`、`pnpm lint`（仅既有 warning）、`pnpm test`（126 文件/1244 测试）、`pnpm build`（134 页）；ego-browser 实测盾形图库悬浮、Top→supporters 添加 paired-dragons、ordinaries 悬浮＋添加 billetty。
- 竞品规格与诊断文档：`tmp/t3-competitor-hover-spec.md`、`tmp/t6-diagnosis.md` 及若干截图。
- 以上改动连同另一单 "Coat Maker random rework" 的遗留改动，已由用户本人在 commit `11003fc`（"8.22"）一并提交。

### 做到一半

无。

### 下一步

无必须项。可选清理：`commands.ts:581` 既有 lint warning `_removedDisplayName`（random rework 遗留）；hover 仅用 `:hover` 选择器、无 pointer media guard（触屏不常显文字的需求已满足，属可选增强）。

### 踩过的坑

- Orca 对 agy（Antigravity CLI）终端 `dispatch --inject` 必现 `agent_prompt_stalled`（两次复现），任务书要改用 `orca terminal send` 手动发送，完成后由协调者人工核验并 `task-update` 结算。
- ego-browser 用 `127.0.0.1` 访问 next dev 页面不水合（allowedDevOrigins 拦截 `/_next/static`），整个工作台 `inert=true`、点击无效；必须用 `localhost`。这曾被误判为 P0 回归。
- 素材数量变化会让 `assets.test.ts` 的硬编码数量断言过期，扩素材时要同步更新。

### 怎么验证

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

浏览器（务必 localhost，勿用 127.0.0.1）：打开 http://localhost:3000/coat-of-arms-maker ——任一素材图库卡片默认无文字、悬浮出现底部名称条；Top→supporters 应有 19 个素材且可添加到画布；Charges→ordinaries 应为 3 列图卡网格。

---

## 交接单 · 2026-08-22 09:37 CST · Grok CLI

### 本次目标

按用户给的《Vercel 爬虫与 Scraper 资源占用检查 SOP》只读排查 Hobby 额度为什么一直被占；确认后再按方案 A：保持 Vercel，只在 Cloudflare 加缓存规则，挡 HTML 和 `/_next/image`。用户明确要求没同意不改代码；缓存规则是后来单独授权的。

### 已完成

1. **Vercel 账期用量（团队 `wsir78933-rgb's projects`，Hobby，Jul 22–Aug 21）**
   - Fluid Active CPU：3h 10m / 4h（79%）
   - Edge Requests：751K / 1M（75%）
   - 按项目：`token-maker` 吃掉 Edge 的 91.8%（688,993）、流量 94.6%（13 GB）、Function 71.8%（66,838）、CPU 55.2%（1h 45m）
   - 已删除的 `needscan` 仍计入本账期 CPU 27.3%；`samurai-sudoku` 17.5%

2. **token-maker 流量结论（不是 API 被打爆）**
   - 过去 24h 允许 25.3k 请求，第一路径是 `/_next/image`（10.6k，约 42%）
   - 首页 `/` + `/zh` 共 661 次，约等于每次打开首页拉 16 张优化图，和 8 张 showcase + 12 张作品图对得上
   - Top UA 主要是 Chrome/Edge/Firefox；GPTBot / Ahrefs / Semrush / CCBot 不在 24h Top
   - 明确异常：AWS HeadlessChrome 304 次打 `*.vercel.app`；假 UA `Mozlila` 76 次；`Amzn-SearchBot` 184；`Google-Extended` 96
   - Bot Protection = Off，AI Bots = Allow，Custom Rules = 0
   - 最近 12h Function 只有 11 次，CPU 几乎全是 `/coat-of-arms-maker`（该页 `private, no-store`，每次 MISS）
   - 线上已在 Cloudflare 反代后面，但 HTML 和 `/_next/image` 的 `cache-control: max-age=0`，CF 显示 DYNAMIC，请求仍打到 Vercel 计费

3. **方案 A 已落地（只改 Cloudflare，未改仓库代码）**
   - 账号：`Wsir78933@gmail.com's Account`，站点 `tokenmaker.one`（Free）
   - Cache Rules 三条，均为 Active：
     1. `Cache Next.js image optimizer`：GET + path 以 `/_next/image` 开头；Eligible；忽略 origin cache-control，Edge TTL 1 天
     2. `Cache HTML pages`：GET HTML（排除 `/_next/`、`/api`、`/share`、`/zh/share`、中英文 coat-of-arms-maker；排除 `RSC: 1`）；Edge TTL 2 小时；Browser TTL = Bypass（浏览器不存页面）
     3. `Bypass API share coat-of-arms`：上述动态路径强制 Bypass（最后一条，后匹配覆盖）
   - 部署后执行过一次 Purge Everything
   - 实测（purge 后同一 POP 连打两次）：
     - `/_next/image?...`：MISS → HIT
     - 首页 `/`：MISS → HIT，`cache-control` 为 `max-age=0, no-store`
     - `/coat-of-arms-maker`：两次都是 DYNAMIC / Vercel MISS（正确不缓存）

### 做到一半

无代码做到一半。仓库 `grok` 工作区干净，这次没有 git 改动，**不需要合并到 main**。缓存规则只存在于 Cloudflare 后台。

### 下一步

1. 过 24 小时看 Vercel Usage：Edge Requests 是否下降（SOP 要求封/缓存后必须看 Usage，不能只看 CF HIT）。
2. 发新版本后若页面看起来旧：Cloudflare → Caching → Purge Cache（HTML Edge TTL 最长 2 小时）。
3. 未做、需另授权：Bot Protection / AI Bots 改 Log；处理 AWS HeadlessChrome 和假 UA；减少 `/_next/image` 的代码改动；整站迁 Cloudflare Pages。

### 踩过的坑

- Cloudflare 已经接上 ≠ 已经挡请求。HTML 和 `/_next/image` 默认不缓存；origin `max-age=0` 时 CF 为 DYNAMIC，Vercel `HIT` 仍计 Edge Request。
- 站点级 Browser Cache TTL 默认是 **4 小时**。HTML 规则若不单独设 Browser TTL = Bypass，用户浏览器会把首页存 4 小时。已改成 Bypass。
- Next.js App Router 的客户端导航带 `RSC: 1`。HTML 规则必须排除该头，否则可能把 RSC 响应和 HTML 缓存成同一份。
- `/_next/image` 没有文件扩展名，不要开 Cache deception armor，否则可能反而缓存不上。
- Hobby Observability 只能看 12 小时；Firewall UA 弹窗大约只有 Top 50。30 天 Bot 明细看不到。
- 本机 `WORKLOG.md` 在全局 gitignore 里，只存在主目录 `/Users/wusir/Desktop/开发项目集合/token-maker-app/WORKLOG.md`，orca worktree `minnow` 里没有这份文件。

### 怎么验证

不需要跑测试或 build。缓存是否生效看响应头：

```bash
# 同一 URL 连打两次，第二次 cf-cache-status 应为 HIT
curl -sI -H 'Accept: text/html' https://www.tokenmaker.one/ | grep -iE 'cf-cache-status|cache-control|x-vercel-cache'
curl -sI 'https://www.tokenmaker.one/_next/image?url=%2Fshowcase%2Fradiant-paladin-circle.webp&w=384&q=75' | grep -iE 'cf-cache-status|x-vercel-cache'

# 纹章页必须仍是 DYNAMIC
curl -sI -H 'Accept: text/html' https://www.tokenmaker.one/coat-of-arms-maker | grep -iE 'cf-cache-status|cache-control|x-vercel-cache'
```

后台核对：Cloudflare → tokenmaker.one → Caching → Cache Rules，应看到上面 3 条 Active。  
用量核对：Vercel → Usage → Edge Requests（看规则生效之后的新账期或次日曲线，不要用已经花掉的本账期总数判断成败）。

---

## 2026-08-21 交接单：Coat of Arms Maker 竞品对齐（coamaker.com）

### 本次做了什么

1. **竞品功能对齐（P0 范围：Tools、文本交互、Custom 面板）**
   - `TextMottoPanel`：重构为三张创建卡片（Text / Curved Text / Ring Text），支持拖拽到画布创建文本（新增 `text-creation-drag.ts`）。
   - 新增 `TextSelectionToolbar`：选中文本图层时的上下文工具栏（字体搜索选择、字号步进、颜色、样式、对齐、描边），字体清单在新增的 `text-font-registry.ts`。
   - `CoatOfArmsCanvas`：直排文本双击内联编辑；曲线/环形文字的贝塞尔/半径拖拽手柄。
   - `DrawPanel`：笔刷大小/颜色/不透明度与描边预览（透明度逻辑在新增的 `drawing-opacity` 模块）。
   - `NamePanel`：14 种名字生成器类型 + 语言选择（`name-generator.ts` 扩展）。
   - `ShieldFieldPanel`：盾面分割（divisions）、field variations、内嵌颜色/纹章、线宽和边框控制。
   - 调色板：新增 `heraldic-palettes.ts`，store/commands 支持原子化调色板替换。
   - 布局：`globals.css` 大量改动对齐竞品编辑器布局（左侧工具栏 460px/170px 折叠、画布工具条 40px、actionbar 50px 等）。

2. **按 8 条工程规范做了全量代码审查并修完全部 18 条发现**（3 blocker / 11 should-fix / 4 nit），包括：字号校验 fail-fast、字体可用性不再静默接受、创建图层命令返回图层 ID 的公开契约、注册表数据深冻结、无障碍修复（颜色选择器按钮嵌套、listbox 键盘行为）等。

3. **今天最后一件事：移除冗余 Export 按钮**
   - 之前 DOM 有两个 `ExportMenu`（桌面 actionbar + 移动端画布工具栏，靠媒体查询互相隐藏）。现在只保留 actionbar 一个实例；移动端不再隐藏 actionbar，Export 在移动端显示于工具栏上方的操作条里。
   - 类名 `coat-target-desktop-export` → `coat-target-export`，菜单 id → `coat-export-options`。
   - 同步更新 `CoatOfArmsMaker.test.tsx`（helper 改名 `getExportTrigger`，断言全页单 Export）和 `site-routes.test.tsx`（恢复单按钮断言）。

### 做到一半的

- 没有写到一半的代码。所有改动都已通过 typecheck 和全量测试。
- **全部改动均未提交**（约 54 个修改文件 + 10 个新文件，见 `git status`）。另有 1 个本地 commit（`3a8baf8 feat: match coat maker editor layout`）尚未 push。

### 下一步该做什么

1. 决定是否提交/推送当前工作树（见下方"存档"问题）。
2. 用户此前明确限定范围为 P0（Tools、Text 交互、Custom），以下项审计时发现但**明确不做**，勿扩大范围：顶部导航/品牌区差异、本地多出的 Ordinaries/Flags/Tokens/自定义调色板/图层重命名等功能的去留。
3. 如需继续对齐，可让用户在真机/浏览器上过一遍移动端布局（Export 条在移动端是新出现的 UI 位置）。

### 有什么坑要注意

- **`workbench-copy.ts` 是多面板共享的文案文件**，多个 agent/任务并行编辑时曾出现语法错误导致 dev server 编译挂掉。改它时避免并行任务同时写。
- **jsdom 不应用 CSS 媒体查询**：响应式"双实例靠 CSS 隐藏"的写法在测试里会看到两个元素。现在 Export 已是单实例，但其他控件若走这种模式要注意。
- **草稿恢复弹窗**：页面加载后若有本地草稿，会弹出恢复提示并用 inert 挡住整个工作台，自动化测试/浏览器脚本需先点 "Restore draft"。
- **dev server 端口**：3000 之前挂掉了；3001 被另一个项目占用；当前后台跑的是 **3002**（`pnpm dev --port 3002`，日志在 `/tmp/coamaker-dev-3002.log`）。
- `ExportMenu.test.tsx` 里保留了双实例渲染的组件能力测试（用它自己的 `desktop-export-options`/`mobile-export-options` id），这与页面上只挂一个实例不矛盾，不要"顺手"删掉。
- 工作树里还有两处与代码无关的改动：`DND-筛选后关键词清单.xlsx`（修改）和 `需求文档.md`（删除），提交时注意是否要一并纳入。

### 怎么验证功能是好的

```bash
pnpm typecheck        # 应无错误
pnpm test             # 全量 1236 个测试应全绿（2026-08-21 08:00 实测通过）
pnpm dev --port 3002  # 若 3000/3001 被占用
```

浏览器关键路径（ego-browser 或手动，访问 `/coat-of-arms-maker`）：

1. 全页只有一个 Export 按钮（`aria-controls="coat-export-options"`，位于顶部 actionbar），桌面 1440px 与移动 390px 均可见可点。
2. Tools > Text：三张创建卡片可点击创建，也可拖拽到画布创建。
3. 选中文本图层：画布工具条切换为文本工具栏（字体/字号/颜色/样式/对齐/描边）；双击直排文本可内联编辑；曲线/环形文本有拖拽手柄。
4. Tools > Draw / Names、Custom（盾面分割/变体/颜色）各面板控件可用。
5. 撤销/重做在上述操作后行为正常（命令均走 store 的原子历史）。
