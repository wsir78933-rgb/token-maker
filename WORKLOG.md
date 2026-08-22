# WORKLOG

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
