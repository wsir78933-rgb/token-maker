# WORKLOG

## 交接单 · 2026-09-02 20:02 CST · Codex CLI

### 本次目标

将 `/coat-of-arms-maker` 从深色混合新拟态纯化为更正统的新拟态：编辑器局部 surface 使用同色系材质，减少非必要硬边框、渐变和普通状态金色，用左上高光与右下暗影表达 raised/inset；保留黑金语义、白色作品画布、功能、布局、SEO 和无关 dirty changes。

### 已完成

- `src/app/globals.css:1400-1428` 将 Coat Maker 局部 material 收敛到深色同色系 surface，编辑器范围不再使用站点渐变或普通 idle gold；保留 dark 高光/暗影 token。
- `src/app/globals.css:1493-1567` 保留控件级拟态，并将 actionbar/canvas toolbar 做 raised、scene/library 做 inset；workbench/content/editor-grid 保持结构性 none；artboard 与 `[role='application']` 保持白色和无阴影。
- `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx:1293` 增加 pure material/no-gradient/no-idle-gold 契约；` :1241` 修正 CSS cascade helper 的 last-wins 读取并加入 grouped-selector fixture。
- 已提交 `1db08a4 feat: refine coat maker neumorphic styling`，commit 只包含 `src/app/globals.css` 和 `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`，未 push、未部署。
- TDD 先得到真实 RED（3 failed / 109 passed），最终 Coat Maker focused 113/113；相关 SSR/route/API 126/126；完整 `pnpm test` 1535/1535；Names 隔离 3 次 1/1；typecheck、lint、build、`git diff --check` 均通过。lint 只有既有 `no-img-element` warning。
- Ego Browser 在 `127.0.0.1:3101` 对 EN/ZH、1496×767 和 390×844 做了真实 QA：同色 material、左上/右下阴影、raised/inset、无 idle gold、白色 artboard、无横向溢出和 storage 未变化均通过；task space 已关闭、3101 listener 已清理。错误态和 blocked-inert 路径没有触发，保持未验证记录。
- Impeccable detector 已运行：退出码 2，仅报告既有 video bounce easing（`globals.css:792`）和 SEO side-tab（当前约 `:2625`）两个 warning；没有本轮纯拟态相关 finding，测试文件无 finding。
- 本轮 Run 的 10 个 Task 全部 completed；所有本轮可安全关闭的 agent 已关闭，当前不应保留 worker terminal。

### 做到一半

- 无目标内未完成的功能工作。
- 错误态、部分浏览器 reduced-motion 交互和旧的 44px/对比度债务没有纳入本轮修复；如要处理，需单独扩大范围。
- `WORKLOG.md` 是本交接单新增的未存档改动，按规则不要把它加入后续代码 commit，除非用户单独授权。

### 下一步

- 下一班输入 `$pickup` 接手；先读取本交接单和 commit `1db08a4`，再决定是否继续视觉迭代。
- 若继续验证，打开 `/coat-of-arms-maker`，确认当前暗色同色 material、控件和外壳 raised/inset，以及白色作品画布边界；不要未经新授权改站点整体主题或编辑器功能。

### 踩过的坑

- 只给按钮加阴影会得到“控件新拟态”，不等于编辑器外壳新拟态；本轮已分别处理 shell surface 和 control surface。
- `finalCssDeclarationValueForWorkbenchRoot` 原先只读取第一个规则，无法可靠验证后置 grouped selector；已在测试 helper 中改为 last-wins，并清理 media-query 前缀。
- `localhost:3000` 可能有用户 draft overlay 导致 workbench inert；浏览器 QA 使用 `127.0.0.1:3101` clean origin，不能清理 localStorage/IndexedDB，也不要点击 Restore/Discard。
- 纯新拟态必须依靠有 offset 和 blur 的双向阴影，不能用零偏移彩色 halo、宽阴影叠硬边框或大面积 idle gold；白色 artboard/application 不要套拟态。
- Impeccable 的两个 detector warning 属于既有视频/SEO样式，不要为了清零 detector 顺手修改范围外页面。

### 怎么验证

```bash
git show --stat --oneline 1db08a4
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx
pnpm test
pnpm typecheck
pnpm lint
pnpm build
git diff --check
node /Users/wusir/.codex/skills/designer-skill/references/external-skills/impeccable/scripts/detect.mjs --json src/app/globals.css src/components/coat-of-arms/CoatOfArmsMaker.test.tsx
```

浏览器（优先本地 ego-browser）：启动并确认 token-maker-app server 后，打开 `http://127.0.0.1:3101/coat-of-arms-maker` 和 `/zh/coat-of-arms-maker`；检查 1496×767 与 390×844 下编辑器同色材质、左上/右下阴影、raised/inset、focus/active/disabled、白色画布和无横向溢出。不要清除 localStorage/IndexedDB，不要把历史 hydration/error-state 未验证项当成已通过。

## 交接单 · 2026-09-01 07:18 CST · Codex CLI

### 本次目标

在 Coat Maker 编辑器中实现受控的新拟态混合视觉层：保留现有黑金主题、白色输出画布、布局、交互、导出、SEO 和无关 dirty changes。

### 已完成

- 已提交 `9509105 feat: add hybrid neumorphic coat maker chrome`，提交只包含 `src/app/globals.css` 与 `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`；`WORKLOG.md` 明确未进 commit，未 push。
- `globals.css:1411-1414` 新增 `--coat-shadow-hi/lo/raised/inset`；局部应用于 actionbar button、collapse、multi-select、zoom，pressed multi-select 使用 inset；结构边框、金色选中/焦点、错误/禁用状态和白色 artboard 保持。
- TDD 已核对：先有真实 RED（2 failed），实现后 GREEN（2 passed）。新测试位于 `CoatOfArmsMaker.test.tsx:600` 和 `:641`。
- 验证已通过：Coat Maker 与 SSR 2 个测试文件共 107/107；route/layout/API 5 个测试文件共 74 个；`pnpm typecheck` exit 0；`pnpm lint` exit 0（1 个既有 `no-img-element` warning）；`pnpm build` exit 0（147 static pages）；`git diff --check` exit 0。
- Ego Browser 实测 `http://127.0.0.1:3101/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker`：桌面 1496×767、移动 390×844；阴影 token 解析为有限的 -1/-1 2px 与 1/2 4px 层；画布和 `[role=application]` 为 `rgb(255,255,255)`；scrollWidth 等于 viewport；导出、多选、移动抽屉、定位/盾牌切换、错误态可读回且 `storageChanged=[]`。QA 结束时只停止了自己启动的 3101 server。
- 本次编排 9 个 Task 全部 completed；首个 Cursor 复核 Dispatch 曾 `agent_prompt_stalled`，retry 成功；可安全关闭的 worker 已关闭。一个 Grok terminal 因 Orca `user_takeover` 保留，两个更早的历史 terminal 未触碰。

### 做到一半

- 本次目标没有未完成项；容器本身保持 `computed boxShadow:none` 是刻意的混合方案，拟态只用于控件层次，不替代结构边框和状态反馈。
- 以下是复核报告的非阻塞、范围外债务，未改：selected tree child 对比度约 1.17:1、editor 内旧 160ms transition 未接入 reduced-motion、部分既有控件小于 44px、full-suite 历史 1518 passed/4 failures（几何与非确定性 Names 问题）。
- 当前工作树预期仍只有未提交的 `WORKLOG.md`；不要把它加入后续代码 commit，除非用户单独授权。

### 下一步

- 无必需后续动作；如继续迭代，先从 commit `9509105` 检查实际页面，再单独决定是否开启“容器级阴影”或无障碍债务修复范围，不要混入本次已归档的视觉改动。
- 浏览器验证需重新确认 token-maker-app server 身份；上一轮使用的是 `127.0.0.1:3101`，该 server 已由 QA 停止。

### 踩过的坑

- 不能对整个编辑器或白色输出画布套经典新拟态；工具树逐行阴影、主按钮灰化、画布阴影都会削弱状态或破坏导出预览。
- `localhost:3000` 在 QA 时存在既有 draft overlay，workbench 为 inert；未清理用户 storage，改用同一 server 的 `127.0.0.1:3101` 干净 origin 验证。
- actionbar 后代选择器会让导出菜单按钮继承 raised 阴影，移动 collapse 也有非阻断的阴影覆盖差异；这是复核报告事项，不要未经新授权顺手扩大修复。
- 首次 Cursor 无障碍 Dispatch 因 prompt stalled 失败，retry 后成功；原 stalled terminal 已核实并关闭。不要强制关闭 Orca 标记为 `user_takeover` 的 Grok terminal。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx --reporter=dot
pnpm typecheck
pnpm lint
pnpm build
git diff --check
```

浏览器（本地 ego-browser）：启动并确认 token-maker-app server 后，打开 `http://127.0.0.1:3101/coat-of-arms-maker` 和 `http://127.0.0.1:3101/zh/coat-of-arms-maker`；检查 1496×767 与 390×844 下 actionbar、collapse、multi-select、zoom 的软阴影，确认选中/焦点/禁用/错误态、白色画布和无横向溢出。不要清除 localStorage/IndexedDB，不要把历史 full-suite 失败归因给本次拟态改动。

## 交接单 · 2026-08-31 22:59 CST · Codex CLI

### 本次目标

排查用户截图中 Coat Maker 出现“没有盾牌图层”、素材卡消失和白色画布空白的问题，确认是否由本轮主题换肤或 GitHub/静态素材损坏导致。本次选择 B：未存档，不提交、不 push。

### 已完成

- 未存档；本轮诊断没有改代码或浏览器数据。当前工作树仍有 `WORKLOG.md`、`src/app/globals.css`、`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx` 三项改动。
- 根因已定位到运行时项目状态：截图中的“没有盾牌图层。”正是 `TargetShieldPalette.tsx:44-50` 在 `project.layers` 找不到 `type: 'shield'` 时的提前返回；该分支不会挂载 `ReferenceAssetGallery`，所以不是图片请求失败。
- 默认项目仍会创建 `heater-shield`：[src/lib/coat-of-arms/assets.ts:322]；Coat Maker 生产代码、Canvas 渲染代码和 assets.ts 相对 HEAD 未改，未引入新的 asset URL、display/visibility/opacity/z-index 或 SVG 层级变化。
- 产品当前允许删除最后一个盾牌：[src/components/coat-of-arms/LayerPanel.tsx:163]、`src/lib/coat-of-arms/commands.ts:1157`；每次 dispatch 会把项目写入 `coat-of-arms-maker-draft`：[src/lib/coat-of-arms/store.ts:126]。因此“0 盾牌项目”可以被本地草稿合法保存并恢复。
- 若恢复的是 0 盾牌草稿，`CoatOfArmsMaker` 会保留该项目，不会重新插入默认盾牌；这解释了三个盾牌相关面板同时显示空状态。白色背景层仍可能存在，因此白画板看起来为空不一定代表背景素材丢失。
- 当前仓库静态素材完整：`git ls-tree` 统计 `public/coat-assets` 446 个跟踪文件，工作树同为 446 个，缺失列表为空；目录内盾牌 SVG 与 WebP 文件均存在。
- Ego Browser 独立 task space 实测正常：盾牌面板 24 张缩略图全部 `complete=true`、`naturalWidth=125`、`naturalHeight=150`；画布有 4 个逻辑图层和两个动物素材 `<image>`。该 task space 与用户浏览器 profile 的 localStorage/IndexedDB 隔离，不能替代读取用户自己的草稿。
- 相关资源/状态测试独立通过：4 个测试文件、92/92 passed；覆盖 assets、store、Canvas、ReferenceAssetGallery。
- 本轮并行使用 6 个只读子代理；所有子代理已停止。Ego Browser task spaces 282/283 已关闭。

### 做到一半

- 本次没有目标内未完成的诊断项；尚未实现修复，因为用户只要求深度排查，没有授权改变项目数据或修改空状态行为。
- 单凭截图不能区分“用户手动删除了最后一个盾牌”和“恢复了一个原本就没有盾牌的本地草稿”；但可以确定当前渲染分支的直接条件就是活动项目没有 shield layer。
- 当前实现存在一个产品行为冲突：系统允许 0 盾牌项目，但盾牌素材库只支持更新现有盾牌，0 盾牌时没有创建入口。

### 下一步

- 如要立即恢复当前项目：在“自定义”面板点击“添加新盾形”，这是现有非破坏性入口；不要先点击“丢弃草稿”，除非用户明确接受删除本地草稿。
- 如要修代码，先让用户选择行为：
  - 推荐 A：保留 0 盾牌合法性，在 `TargetShieldPalette` 空状态提供“添加新盾形”入口，并为该空状态加测试。
  - B：禁止删除最后一个盾牌；会改变现有命令/测试合同。
  - C：加载 0 盾牌草稿时静默插入默认盾牌；不推荐，会未经确认改变用户项目。
- 用户选择后再做执行前对齐；未获确认前不修改 `TargetShieldPalette.tsx`、commands、store 或本地存储。

### 踩过的坑

- “没有盾牌图层”不是素材 404 的错误文案；若只是 URL 404，素材卡 DOM 仍会存在，只是图片加载失败。
- 默认项目初始化只在无草稿动作时执行；存在草稿时会优先展示/恢复草稿，所以刷新不会自动修复 0 盾牌项目。
- localStorage/IndexedDB 按 origin 和浏览器 profile 隔离；localhost、正式域名、不同浏览器空间之间不能互相推断用户草稿内容。
- 不要通过 `git restore`、`reset`、清除 localStorage 或丢弃草稿来“试试看”；这些操作可能覆盖或删除用户数据。
- 本轮主题换肤的 CSS diff 仅改颜色 token；它没有改变素材路径或画布渲染逻辑。历史主题调整的未存档 CSS 仍保持原边界。

### 怎么验证

```bash
git ls-tree -r --name-only HEAD -- public/coat-assets | wc -l
find public/coat-assets -type f | wc -l
pnpm exec vitest run src/lib/coat-of-arms/assets.test.ts src/lib/coat-of-arms/store.test.ts src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/ReferenceAssetGallery.test.tsx --reporter=dot
git diff --quiet HEAD -- src/components/coat-of-arms/CoatOfArmsMaker.tsx src/components/coat-of-arms/CoatOfArmsCanvas.tsx src/lib/coat-of-arms/assets.ts; echo $?
```

浏览器（优先本地 ego-browser）：打开 `http://localhost:3000/zh/coat-of-arms-maker`，检查 `TargetShieldPalette` 是否出现“没有盾牌图层。”；在不丢弃草稿的前提下进入“自定义”并点“添加新盾形”，确认盾牌素材库重新出现、画布恢复盾牌。不要输出或清除用户 localStorage/IndexedDB 内容。

## 交接单 · 2026-08-31 22:43 CST · Codex CLI

### 本次目标

把 `/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker` 的 Coat Maker 编辑器外壳对齐当前页面黑金主题；只调整视觉样式和对应视觉契约，不改布局、交互、导出、SEO、导航或白色输出画板。本次选择 B：未存档，不提交、不 push。

### 已完成

- 未存档。当前工作树只有两项改动：`src/app/globals.css`、`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`。
- `globals.css` 的 `.coat-target-workbench` 局部样式已把 actionbar、工具树、素材栏、画布外围、canvas toolbar、移动 sheet、表单、上传区和 Names 区的中性灰/米色皮肤改为现有 `--coat-*` 主题变量；悬停/选中/主操作改用 `--coat-active` / `--coat-accent`。
- `.coat-target-artboard` 与其 `[role='application']` 仍保持 `background: #fff`；素材本身颜色、错误红、上传成功绿保留。
- 测试先 RED 后 GREEN：`CoatOfArmsMaker.test.tsx` 新增最终 CSS 声明读取 helper，并把 actionbar/tool-tree/library/scene/canvas-toolbar 与选中子项改为断言 `--coat-*` 变量；未改几何合同。
- Ego Browser 实测：英文桌面、中文桌面、中文 `390×844` 移动端均显示深色编辑器外壳；actionbar/tool-tree/library/scene/canvas-toolbar 计算样式为主题变量解析后的深色；画板和实际应用画布均为 `rgb(255,255,255)`；移动端 `document.documentElement.scrollWidth === 390`，无横向溢出。
- `pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx -t "uses coat theme tokens|keeps the selected desktop tree choice" --no-file-parallelism --maxWorkers=1 --reporter=verbose`：exit 0，2 passed。
- `pnpm exec vitest run src/app/layout-route-boundaries.test.ts src/app/site-routes.test.tsx src/app/site-performance-styles.test.ts --reporter=dot`：exit 0，53/53 passed。
- `pnpm typecheck`：exit 0。
- `pnpm lint`：exit 0；仅有既有 `CoatMakerSeoContent.tsx:25` 的 `@next/next/no-img-element` warning。
- `pnpm build`：exit 0；147/147 静态页面生成。
- `git diff --check`：exit 0。
- 本轮已编排并停止 11 个子代理；当前无 running agent。Ego Browser task space 279 已关闭。

### 做到一半

- 本次主题换肤没有目标内未完成项；代码仍是未存档状态，尚未 commit。
- Coat Maker 单文件完整测试当前为 97 passed / 3 failed；3 项均为既有画板几何合同：测试解析到移动覆盖 `min(28rem, 76vw)`，以及 1512×738 浏览器 fixture 的 `artboardHeight === 0`。主题相关测试均通过；不要为本次换肤修改这些几何合同。
- 全量 `pnpm test -- --reporter=dot` 当前为 1518 passed / 4 failed：上述 3 项几何失败，另有 `generates five local names and copies one into saved names` 仅在整套运行时失败，单独运行该测试为 1/1 passed；未归因或修改该范围外问题。
- Impeccable detector（仅扫描本次两个目标文件）exit 2，报告两个既有范围外 warning：`src/app/globals.css:792` bounce easing、`src/app/globals.css:2429` SEO capabilities 的 2px side-tab；本次未处理。

### 下一步

- 下一班先复核两文件 diff 和未存档边界；如要提交，必须重新列出这两个文件并获得单独 commit 授权，`WORKLOG.md` 不入 commit，且不 push。
- 若继续验证，可重复主题 focused test、路由测试、typecheck、lint、build，以及 `localhost:3000` 的 EN desktop / ZH mobile Ego Browser 检查；不要把范围外几何、Names、detector warning 顺手纳入本单。
- 若用户要修复那 3 项几何或整套 Names 失败，另开独立任务并先重新对齐范围。

### 踩过的坑

- 当前接口没有 Grok 模型或连接器；已明确告知用户，未冒充 Grok，实际使用可用的 Codex 子代理。
- 只改 token 定义无效：后置的 `#474747/#636363/#3a3a3a/#f0ece2/#5a5a5a` 声明会以同等特异性覆盖前面的 `--coat-*`；必须替换最终 selector 声明，且不能按字面值全局替换。
- `#fff` 是真实输出画板合同，不可随主题换肤；`html.dark` 是 Coat Maker 文档边界，不能借此改全局 `:root` / `.dark`。
- `CoatOfArmsMaker.test.tsx` 的旧 `cssDeclarationsForSelector` 会把嵌套 media 的移动 width 当成桌面最终声明，导致 3 个既有几何失败；本单没有触碰它。
- `pnpm test` 全量的 Names 失败可单独通过，不能把整套运行结果当成 CSS 回归证据。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx -t "uses coat theme tokens|keeps the selected desktop tree choice" --no-file-parallelism --maxWorkers=1 --reporter=verbose
pnpm exec vitest run src/app/layout-route-boundaries.test.ts src/app/site-routes.test.tsx src/app/site-performance-styles.test.ts --reporter=dot
pnpm typecheck
pnpm lint
pnpm build
git diff --check
```

浏览器（优先本地 ego-browser）：`http://localhost:3000/coat-of-arms-maker` 用 `1512×738` 检查英文桌面；`http://localhost:3000/zh/coat-of-arms-maker` 用 `390×844` 检查中文移动端。确认 actionbar/tool tree/library/scene/canvas toolbar 统一深色主题、选中态使用金色、无横向溢出，且 `.coat-target-artboard` 与 `[role='application']` 均为白色。不要把当前 3 项画板几何失败误判成主题换肤失败。

## 交接单 · 2026-08-31 20:09 CST · Cursor Grok

### 本次目标

把纹章页现有 H1 + 描述原样挪到编辑器上方（英文、中文），文案不改、不另写标题；其余 SEO 长文留在编辑器下面；排版由实现方处理。

### 已完成

- 未存档。用户选 A，本班不提交。
- 新组件 `src/components/coat-of-arms/CoatMakerPageHeading.tsx`：渲染 `copy.heading` + `copy.introduction`（与 metadata 同一组现有文案）。
- EN `/coat-of-arms-maker`、ZH `/zh/coat-of-arms-maker` 顺序改为：`coat-maker-first-screen`（标题 → 编辑器）→ `CoatMakerSeoContent` → footer。
- `CoatMakerSeoContent.tsx` 去掉下方那组 H1 + 导语；用例段改为 SEO 区第一块。
- `globals.css`：首屏 `100svh` 分栏，标题条在上，工作台吃剩余高度。
- 测试已改：`CoatMakerPageHeading.test.tsx`（新）、`CoatMakerSeoContent.test.tsx`、`site-routes.test.tsx`。相关 Vitest：`CoatMakerPageHeading` + `CoatMakerSeoContent` + `site-routes` + `CoatOfArmsMaker.ssr` **69/69**。
- `http://127.0.0.1:3000` 实测：EN/ZH HTML 各 1 个 H1，文案与原来一致，DOM 顺序标题 → `#coat-editor-workspace` → SEO；SEO 内无 H1。Ego 桌面 EN 标题高约 192px、工作台约 546px、首屏高等于视口；ZH 桌面标题约 123px；手机 390 宽无横向溢出。

### 做到一半

- 排版未过：用户看过实页后认为当前标题条不对，并问有没有加载对应 skill。实现前 `designer-skill` 路径不存在（`~/.cursor/skills/designer-skill/SKILL.md` 未找到）；`frontend-design` / `impeccable` / `improve-ui` 也没读。标题条只是把 SEO 展示字缩小后堆在工作台上面（clamp 1.7–2.5rem + 左栏 `max 52rem` + `#100d08` 通栏），用户明确否了。
- 用户后两条消息（skill 质问）还没答完就下了 `/handoff`。
- 工作区另有非本班标题活、也未提交：`WORKLOG.md`（含今早 07:19 交接单）、`src/app/api/coat-export/route.test.ts`、`src/lib/coat-of-arms/cloud-export/r2-storage.test.ts`、`tmp/coat-*-heading.png` 四张核实截图。

### 下一步

- 先加载实际存在的排版 skill（至少 `frontend-design`：`~/.claude/plugins/cache/claude-plugins-official/frontend-design/b392f5189934/skills/frontend-design/SKILL.md`；designer 相关 skill 以本机现有路径为准），用**现有**标题和描述重做标题条，不要新写标题。
- 动文件须用户再说「开始执行」。
- 不要把 `tmp/coat-*-heading.png` 和 `WORKLOG.md` 推进提交。

### 踩过的坑

- 第一次对齐误提「只留短标题 / 另写一条」，用户纠正：要挪现有标题+描述，不是创造新标题。
- `ego-browser` 的 `captureScreenshot` 会挂（任务 229707 已杀）；改用 `cdp('Page.captureScreenshot')` + 写文件。
- `CoatOfArmsMaker.test.tsx` 里 3 个画板宽度断言在 **HEAD 的 globals.css** 上同样失败（CSS 解析器先吃到 `@media (max-width: 1023px)` 的 `min(28rem, 76vw)`），不是这班标题 CSS 引入的。
- 全量 `pnpm typecheck` 仍在 `coat-export/route.test.ts:215`、`r2-storage.test.ts:17` 失败；工作区里这两文件有未提交的类型补丁，本班标题活没改它们，也没把 tsc 修绿。
- token-maker-app 的 `pnpm dev` 在 `:3000`；`:3003` 是别的项目（AI image editor）。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatMakerPageHeading.test.tsx src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/app/site-routes.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx
```

浏览器（优先本地 ego-browser）：`http://127.0.0.1:3000/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker`。首屏应是现有 H1 + 现有描述，紧接着编辑器；往下滚才是用例等长文。当前标题条排版用户已否，下一班不要当验收通过。

## 交接单 · 2026-08-31 07:19 CST · Cursor Grok

### 本次目标

重做 `/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker` 的 SEO 区块：用例 + 对比表卖点、锁死 metadata、WebApplication JSON-LD、3 条 FAQ 后扩到 5 条、整段排版、用例图不被裁切、FAQ 在真实浏览器能点开。关键词密度 2%–4%；字数要求已取消。

### 已完成

- 文案与结构已在仓库里：H1 + 导语 → 4 张用例卡 → 步骤 + 工具 → 3 列×4 行对比表（Our coat of arms maker / CoaMaker / Roll for Fantasy）→ CTA → FAQ → 相关链接。标题「Why choose our coat of arms maker」/「为什么选择我们的纹章制作器」。
- 用例图 `public/coat-of-arms-maker/use-cases/*.webp` 均为 1254×1254；`CoatMakerSeoContent.tsx` 用 `aspect-square` + `object-cover`，不再 16:9 裁切。Ego 桌面实测卡片约 492×492，狮鹫/盾尖完整。
- FAQ 最终是原生 `<details>`/`<summary>`（`name="coat-maker-faq"`），文件 `src/components/coat-of-arms/CoatMakerFaqAccordion.tsx`。Base UI 与纯 `useState` 按钮在 ego-browser 里点了不展开。Ego 在 `http://127.0.0.1:3000` 桌面 1280：EN 第一条能开、点第二条第一条关上、ZH 第一条能开。
- 用户已提交并与 `origin/main` 同步：`6cef7b3`（第二工具内页优化，含 SEO/排版/图/FAQ/globals 作用域样式，以及一批 `tmp/coat-maker-*` 草稿）、`8c8d952`（最新，3 个文件的小改）。工作区干净。
- 验收过的数字：Vitest `CoatMakerSeoContent.test.tsx` + `site-routes.test.tsx` **62/62**；密度 EN **3.387%**、ZH **3.239%**。Codex 复核过 details FAQ 与方形图。

### 做到一半

- `src/components/ui/accordion.tsx` 已进 `6cef7b3`，本页 FAQ 已不再引用；用户未决定是否删除。
- `tmp/` 下大量对比草稿、ego 截图、编排报告随 `6cef7b3` 进了 git；未单独清理。
- 全量 `tsc` 仍可能在无关文件失败：`src/app/api/coat-export/route.test.ts:215`、`src/lib/coat-of-arms/cloud-export/r2-storage.test.ts:17`（复核时看到，本班未修）。
- 编排 Run `run_b17b7ba66708` 里还有历史 blocked/failed 任务；本班相关 worker 已 release。未再开新功能。

### 下一步

- 若不要 Base UI 手风琴：删 `src/components/ui/accordion.tsx`（先确认无其它引用）。
- 若不要研究草稿进仓库：从 git 拿掉 `tmp/coat-maker-*` / `tmp/ego-*`（需用户授权）。
- 可选：修那两个无关 tsc 测试错误；查清本页 Next client 在 ego-browser 里是否水合（工作台 SSR 自带 `inert`，不能当水合证据）。
- 用户要继续改纹章页再说；本班没有未提交代码。

### 踩过的坑

- 对比表从 4 列（含 Crest and Arms）改成 3 列攻击表，又砍过「姓氏/官方纹章」「When to stay」行；竞品缺点只许用 ego 核实过的事实。
- 字数带 1050–1150 反复超限，用户后来取消字数、密度放宽到 2%–4%。
- 三 agent 一致投票成本高；后改成起草+复核、2-1 可取多数。
- Base UI Accordion 实页 `data-index="-1"`、trigger id 变成 `base-ui-*`；抽出 client 岛仍不行。`useState` 按钮 jsdom 过、ego 点到仍不切换。原生 `details` 不依赖 React 水合。
- 本机 `:3000` 曾是停掉的别的 next-server；ego 有时要用 `:3001`。后一次核实 live 在 `:3000`、`:3001` 是别的 Vite 应用。先确认哪个端口是 token-maker-app。
- `orca orchestration worker-stop` 常回 `stop_unknown`，retry 的 grok 终端要用 `orca terminal close --terminal <handle>`。
- 同一 Run 上 `check --wait` 会 `waiter_exists`，先 `--peek`/`--ack` 再等。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatMakerSeoContent.test.tsx src/app/site-routes.test.tsx --reporter=verbose --color=false
```

浏览器（优先本地 ego-browser）：打开 `/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker`。看用例图是否正方形且盾徽完整；点 FAQ 第一条应展开，再点第二条第一条应合上。对比表第一列应是金色「Our coat of arms maker」/「我们的纹章制作器」。

## 交接单 · 2026-08-30 10:25 CST · Cursor Grok

### 本次目标

纹章编辑器点 Download 后：本地下载同一份 PNG/JPEG/PDF，并静默上传到现有 R2 桶 `tokenmaker-shares` 的 `coats/` 前缀。界面只报成功/失败，不给链接。不改 Token `/api/share`。顺带把上一班 Token 左下角撤销/重做（去掉重做快捷键）一并存档。

### 已完成

- 纹章云导出已实现并提交：`2ec8b2c`（未 push）。`main` 比 `origin/main` 超前 1。
- 新模块 `src/lib/coat-of-arms/cloud-export/`：常量、服务端校验（矩形最长边 256/512/1024/2048）、R2 `PutObject`（只回 `{ key }`）、浏览器 `POST /api/coat-export`。
- 新接口 `src/app/api/coat-export/route.ts`：同源、限流 key `coat-export:ip`、成功 `{ ok: true }`，无 URL/key。
- `ExportMenu` Download 先 `downloadCoatBlob` 再上传；失败保留本地下载并 `cloudExportFailed`。Share/Print 不上传。文案在 `workbench-copy.ts`。
- R2 密钥只在服务端 `getShareStorageEnv()` 读取，未进客户端。
- Token 撤销/重做：左下角 ControlPanel 同一组；Header 只保留 Cmd/Ctrl+Z 撤销，已删 Shift+Z / Ctrl+Y 重做。同在 `2ec8b2c`。
- 编排 Run `run_82aaab715ffb`：agy 常量/文案，grok 校验/R2/UI/复核，Codex 写 API。复核 vitest 6 文件 59 通过。
- `WORKLOG.md` 未进该提交。

### 做到一半

- 纹章 SEO 改动**未存档**（用户选 C，排除）：`coat-maker-seo-copy.ts`、`coat-maker-seo-schema.ts`、`CoatMakerSeoContent.tsx`、`CoatMakerSeoContent.test.tsx`、`src/app/site-routes.test.tsx`。内容是把 metadata title/description 改成跟 heading/introduction 对齐，与云导出无关，未做完整验收。
- `tmp/t7-coat-cloud-export-review.md` 未提交（复核草稿）。
- 未在浏览器实点 Download（会打到真实 R2）。未跑全量 `pnpm typecheck` / `pnpm lint` / `pnpm test`。
- 未 push。

### 下一步

- 若要上线：先 `git push`（需用户明确授权）。生产需已有 R2 与 Upstash 环境变量（与 Token share 同一套）。
- SEO 那 5 个文件：单独决定提交、还原或继续改，不要和 `2ec8b2c` 混在一起。
- 可选：补复核里的低优先级测试缺口（非法 PDF 头、重编码后超 5MB 的 413、route 层 jpeg/pdf 透传）。
- 可选：本地点一次 `/coat-of-arms-maker` Download，到 R2 控制台确认出现 `coats/`。

### 踩过的坑

- 现有 `/api/share` 只收正方形 PNG，纹章是长方形，不能复用该接口校验。
- R2「文件夹」只是前缀；控制台不必预建 `coats/`。
- 复用 agy 终端派 T4 时 `agent_prompt_stalled`（CLI 问卷挡住），已改新 grok 重试。
- 工作区曾同时存在另一班 Token 撤销改动和 SEO 改动；提交时按用户 C 拆开，只装云导出 + Token 快捷键。
- 客户端看不到对象 URL；文件仍在公开域上，知道 key 就能打开。

### 怎么验证

- `pnpm exec vitest run src/lib/coat-of-arms/cloud-export src/app/api/coat-export src/components/coat-of-arms/ExportMenu.test.tsx`（复核时 59 passed）
- `pnpm exec vitest run src/components/layout/Header.test.tsx src/components/editor/ControlPanel.test.tsx`
- 页面：`/coat-of-arms-maker` 打开 Export → Download PNG/JPG/PDF，应本地下载；菜单出现 `Export saved.` / `已保存。` 且无 URL。R2 桶根下应出现 `coats/`。Share/Print 不应新增对象。
- Token 编辑器：左下角撤销/重做/清空同一行；Cmd+Z 撤销；Cmd+Shift+Z / Ctrl+Y 不重做。

## 交接单 · 2026-08-30 09:54 CST · Cursor Grok

### 本次目标

Token 编辑器：把「清空工作区」和「撤销 / 重做」放到一起。用户更正为**左下角 ControlPanel 底栏**，不是顶栏右侧。随后要求去掉重做快捷键（Cmd+Shift+Z / Ctrl+Y），保留 Cmd+Z 撤销和左下角重做按钮。

### 已完成

- 左下角同一组：撤销、重做、清空。下一行「重置位置」，分隔线下落「批量模式」。文件：`src/components/editor/ControlPanel.tsx`。
- 顶栏不再放这三个按钮。`Header` 仍处理 Delete/Backspace 删选中，以及 **Cmd/Ctrl+Z（无 Shift）撤销**。已删除 Shift+Z 与 Ctrl+Y 重做。文件：`src/components/layout/Header.tsx`。
- 重做按钮 `title` 现为 `t('redo')`，不再写 `(Cmd+Shift+Z)`。
- 测试：`Header.test.tsx` 断言顶栏无三按钮，并覆盖 meta/ctrl+z 会 undo、shift+z 与 ctrl+y 不 redo。`ControlPanel.test.tsx` 按 `getByTitle('redo')` 找按钮。
- Orca Run `run_95ed4360eccc`：grok 改、Codex 查。T1/T2 曾按右上角做错；T3–T6 因需求更正取消；T7/T8 纠偏到左下角；T11 `pnpm typecheck` / `pnpm lint` / 当时 19 测通过；T13 去重做快捷键；T14 Codex 要求补键盘测；T15 补完后 Header 6 + ControlPanel 15 = **21 通过**。
- **未存档**：用户选 B，这 4 个编辑器文件未 commit、未 push。`WORKLOG.md` 不进产品提交。

### 做到一半

- 工作区还有**本次范围外**未提交：`src/components/coat-of-arms/workbench-copy.ts`（已改）、未跟踪 `src/lib/coat-of-arms/cloud-export/`。本班未核对其内容。
- 本终端仍绑定 Orca Run `run_95ed4360eccc`（objective 仍写着已废弃的「方案 A 顶栏」）。相关 worker 已 release。
- 用户曾回 A（只提交 4 个编辑器文件），随后改口 B，因此没有 commit。

### 下一步

- 若要存档：只加 `Header.tsx`、`Header.test.tsx`、`ControlPanel.tsx`、`ControlPanel.test.tsx`。不要把 `WORKLOG.md`、徽章文件、`cloud-export/` 塞进这次提交。不要默认 push。
- 不要把清空/撤销再挪回顶栏。
- 徽章相关脏文件与旧 WORKLOG 里的 coat-of-arms 残留，本班未处理。

### 踩过的坑

- 截图红箭头方向歧义：第一轮按「清空进顶栏」做了。`architecture-boundaries.test.ts` 禁止 Header 出现 `@/lib/store/editor-store`；T1 因此架构测试红，T7 去掉顶栏按钮后恢复绿。
- Codex 曾指出 Cmd+Shift+Z 的 `key` 可能是大写 `Z`。用户不要重做快捷键，已整段删掉，不是改大小写。
- 开工口令用户写成「开始知悉」再补「执行」；本班按执行处理。

### 怎么验证

- 命令：`pnpm exec vitest run src/components/layout/Header.test.tsx src/components/editor/ControlPanel.test.tsx src/lib/architecture-boundaries.test.ts`；可选 `pnpm typecheck`、`pnpm lint`。
- 页面：Token 编辑器（不要用徽章页）。左下角应看到撤销、重做、清空同一行；顶栏没有这三个按钮。改一处后 Cmd+Z 应撤销；Cmd+Shift+Z / Ctrl+Y 不应重做；点左下角重做按钮应能重做。

## 交接单 · 2026-08-23 22:21 CST · Grok CLI


### 本次目标

纹章制作器 Tools → Text / Curved Text / Ring Text 的**实际画布用法**对齐 coamaker（不抄 PRO/广告）。本会话后半：环形手柄「往外拉放大、绕圈转位置」；直线文字「字不动、头顶点旋转」；旋转拖动太快要减半。不改 chrome 99/50/40。用户后来说推 GitHub，并把 `tmp/` 验证文件也提交。

### 已完成

- **环形文字极坐标手柄**：`startAngle`（0=正上、顺时针度）。往外拉改 `radius`（10–50）；绕圆拖改文字在环上的位置。IN/OUT/ARC/EVEN 切换会保留 `startAngle`。旧稿无该字段时 migrate 成 `0`。默认仍 `radius: 18, facing: 'in', layout: 'arc', spacing: 'natural', startAngle: 0`。
- **直线文字原地转**：SVG `rotate` 绕文字锚点 `(alignment x, 102)`，不是盾心 `(50, 55)`。导出 `straightTextLocalRotateOrigin`。拖头顶旋转点时手势绕测量字盒中心算角度；`transform.x/y` 不因旋转被甩走。抓住字仍可挪；左右拉宽仍在。
- **工具条不挡旋转点**：`above-selection` 从 `mb-9` 改成 `mb-14`。弧/环仍用 `artboard-bottom`。
- **旋转拖动手感减半**：`ROTATE_HANDLE_POINTER_ANGLE_SCALE = 0.5`。直线文字和 charge/盾共用。键盘逗号/句号仍每次 15°。
- **GitHub**：`main` 已与 `origin/main` 同步。相关提交：`38934c0`（文字工具）、`d88248c`（D&D Fighter 博客，同工作区一并推的）、`f1880ce`（`tmp/` 截图 + T5 审查 md）。工作区干净。
- **子代理**：用户要求移除后，本仓库里本会话/此前徽章编排留下的 grok/agy 标签已关。当前这扇 Grok 与 `Cursor ready` 未关。
- Orca Run `run_5d10607509d9`（直线原地转）任务均 completed。收件箱 check 多次为 0 条。

### 做到一半

- **左右对齐直线文字**：SVG 绕锚点 x=8 或 92 转；手势绕整段字盒中心。居中没问题。审查 Medium，未改。
- **90° 单测**：`x/y` 不变并不能单独证明枢轴（旧盾心旋转也能绿）；真正锁 SVG 的是 `scene-svg.test.ts` 的 `rotate(90 50 102)`。
- **Cardinal 字体**：工具条显示 Display Serif / 系统回退，不是竞品黑信体。上一轮范围外。
- **其它残留（更早班）**：`CoatOfArmsMaker.test.tsx` 约 3 条 CSS 画板几何失败；`last-shield` / `fieldShieldLayerId` High；Settings 深色半宽；自定义盾仍是亮度遮罩不是原图。
- `workbench-copy` 仍可能有未使用的 `localUploadCompressed`（上一条交接单，本班未再核对该符号）。

### 下一步

- 用户若还要左/右对齐也绕整段字中心转：再对齐范围后改 `straightTextLocalRotateOrigin` 与手势枢轴，使二者同一点。
- 若还要更慢/更快旋转：只改 `ROTATE_HANDLE_POINTER_ANGLE_SCALE`（现 0.5）。
- 不要把 `WORKLOG.md` 放进产品 commit。`tmp/` 已经在 `f1880ce`。
- 不要默认再开一堆 Orca worker；用户刚要求清掉子代理。

### 踩过的坑

- 只用 `http://localhost:3000/coat-of-arms-maker`，不要 `127.0.0.1`。进页先 **Discard draft**，否则 workbench `inert`。
- 直线文字画在 `y=102`，默认 `transform.y=-47`。`rotate(θ 50 55)` 会把字甩到约 `(3,8)`。必须绕 `(50, 102)`（居中）。
- 旋转点离字盒很近（约 `-translate-y-8`），1:1 角度映射会显得极快；减半是方案 A。
- `agy` 派发易 `agent_prompt_stalled`；失败 dispatch 的 `worker_done` 会被 capability revoked 拒收，文件可能已经改了。
- `worker-release` 对 `user_takeover` / `external_terminal` 关不掉进程；用户明确要求移除后用 `orca terminal close --tab`。
- 编排 check 提示「有 N 条消息」但 inbox 已 ack 时会是 0 条，属旧通知。

### 怎么验证

- 命令：`pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/commands.test.ts src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx src/components/coat-of-arms/TextSelectionToolbar.test.tsx src/components/coat-of-arms/text-creation-drag.test.ts`；`pnpm typecheck`。
- 页面：`http://localhost:3000/coat-of-arms-maker` → Discard draft → Tools → Text。
  - **文字**：点卡，拖头顶白点应原地慢慢转；抓住字能挪；左右蓝条能拉宽；工具条不压住旋转点。
  - **环形文字**：点卡，往外拉圆变大，绕虚线圆拖字跟着转位置。IN/OUT/ARC/EVEN 还在。
- 截图：`tmp/ring-polar-*.png`、`tmp/straight-rotate-*.png`。审查：`tmp/t5-straight-text-rotate-review.md`。

## 交接单 · 2026-08-23 11:30 CST · Cursor Grok

### 本次目标

纹章制作器：大图按原样上传（方案 A，浏览器 IndexedDB，不上云），以及 Tools → Names 对齐 coamaker 对照组（5 张可复制卡片 + Saved Names，去掉额外 identity）。不改 chrome 99/50/40。不抄 PRO/广告文案。本交接班只写交接单；用户已确认把产品改动存档。

### 已完成

- 新上传走 `encoding: 'indexed-db'` + `byteLength`，原 File 进 IndexedDB（库名 `coat-of-arms-local-upload-blobs`）。草稿 JSON 仍 ≤1 MB，不再塞大图 Base64。限额 **8_388_608** / **16_777_216** / 最多 8 个。旧草稿 `encoding: 'base64'` 仍能校验。
- 已删除 canvas 自动压缩路径（`local-upload-compress` 未进 git）。`createValidatedLocalUpload` 不再缩小 PNG。
- Names：默认生成 5 条；空列表直到 Generate；卡片可复制；Saved Names；identity UI 与 `createCoatIdentity` 等已删。
- Codex 复审 High：`void deleteLocalUploadBlob` 破坏 undo、失败 register 留下孤儿 blob、restore 无 catch、无效草稿 `catch { return [] }`。Grok 已修：remove 不删 blob（undo 要留）、replace/randomize/discard 删未引用 blob、失败 put/register 回滚、restore 可见报错、无效草稿 discard 清整个 blob store。
- 浏览器（ego-browser，`http://localhost:3000/coat-of-arms-maker`，先 Discard draft）自定义盾形 **2,282,558** 字节 PNG：**6/6 PASS**。状态无 Compressed；href 仍 720×792；草稿 JSON 约 1247 字节且 `byteLength: 2282558`；刷新 Restore 仍清晰；>8 MB 报 `Invalid upload file size: 8388609`。报告 `tmp/visual-idb-upload-verify.md`（未进 git）。
- 存档：`c3928d2`（24 files，`main` 比 `origin/main` 超 1）。**未 push**。`WORKLOG.md` 与 `tmp/` 未进该 commit。
- Worker 自报（本交接班提交后未再跑）：blobs 13；commands 88；scene-svg 相关 98；panels 54；Fail Fast 修复 5 文件 98 tests；`pnpm typecheck` exit 0。

### 做到一半

- `workbench-copy` 仍有未使用的 `localUploadCompressed`。
- `CoatOfArmsMaker.test.tsx` 里约 3 条 CSS 画板几何失败，worker 归因于已有 `globals.css`（Names 表单），不是 IndexedDB。全量 `pnpm test` 此前非全绿。
- 没有单独用 indexed-db 上传跑导出 PNG/JPEG 的测试。
- 大图以内嵌 data URL 画在 SVG 里（避免 blob: 套进 data: SVG 导致导出画布污染）；整页 CDP 截图曾超时。
- Orca Run `run_4262b8039656`（IndexedDB）与更早的 `run_43a09352b9fb`（压缩/Names）可能仍绑着旧 worker 终端；agy 文案任务 `agent_prompt_stalled`，改由 Grok 完成。

### 下一步

- 用户若要发布：`git push`（需另说）。不要把 `WORKLOG.md` 放进产品 commit。
- 可选：删 `localUploadCompressed`；补 indexed-db 导出测试；修 Names/`globals.css` 相关 CSS 测试。
- 自定义盾形仍是亮度遮罩：画布上颜色是底纹透出来的，不是星云原色。原图像素不再被 ×0.7 砸碎。

### 踩过的坑

- 只用 `http://localhost:3000/coat-of-arms-maker`，不要 `127.0.0.1`。草稿 overlay 会 `inert` 工作台，量之前 Discard。
- 把 2.2 MB PNG 压进 256 KB：PNG 无质量旋钮，只能反复 ×0.7，星云软边变成脏遮罩。
- 方案 A 不是上云，是本机 IndexedDB；localStorage 1 MB 装不下原文件。
- `agy` 派发两次 `agent_prompt_stalled`；失败 dispatch 的 `worker_done` 会被 `dispatch_capability_invalid` 拒绝，文件可能已经改了。
- `store.dispatch` 里 `void deleteLocalUploadBlob` 会先清内存再删 IDB，undo 后 `requireLocalUploadDataUrl` 失败。
- 不要抄 coamaker PRO / ads / `City Names` / 把语言选项改成 EN/DE 标签（本次 Names 未改词库语言标签）。

### 怎么验证

```bash
pnpm exec vitest run src/lib/coat-of-arms/local-upload-blobs.test.ts src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/project-storage.test.ts src/lib/coat-of-arms/store.test.ts src/lib/coat-of-arms/scene-svg.test.ts src/components/coat-of-arms/CoatOfArmsPanels.test.tsx src/components/coat-of-arms/LayerPanel.test.tsx src/components/coat-of-arms/NamePanel.test.tsx
pnpm typecheck
```

页面：`http://localhost:3000/coat-of-arms-maker`（localhost；关掉草稿 overlay）→ Custom Shield Upload 传一张 >256 KB 且 ≤8 MB 的 PNG，状态不应出现 Compressed，画布边缘不应发方发脏。刷新后 Restore draft 图还在。Tools → Names：Generate 出 5 张卡，Copy 后出现 Saved Names。chrome 仍 99/50/40。

---

## 交接单 · 2026-08-23 08:43 CST · Cursor Grok

### 本次目标

Custom 盾面：分割线样式（Wavy 等）与分区花纹（如左侧 Barry）同时保存、同时画出来。Orca `run_91e479b6b9cf` 编排多 agent；不抄 PRO/广告；chrome 仍 99/50/40。本交接班只写交接单，不新开功能。

### 已完成

- 引擎允许 `per-pale` / `per-fess` / `per-bend` / `per-bend-sinister` 同时有 `regions` 和 `divisionLine`。区域裁切走 `fieldRegionDivisionLinePath`，不是直缝 `H50`。
- Custom 改一侧花纹或 Frequency/Amplitude 不再互相删字段；换分割类型仍清旧区域；Straight / 不支持线样式的分割仍去掉 `divisionLine`。
- Custom A UI（此前同 run）：亮色分割图标、Bend Sinister、Division Line Style、分区 accordion、Keep pattern to field。
- 徽记：Overall `fieldRegionId=overall` 裁整盾，不抛错；仅有 `fieldPlacement` 的旧徽记在匹配分割上也跟波浪缝；Pale 上 Dexter 徽记再改成 Fess 时不再因过期 `dexter` 崩画布（`getMatchingDivisionLineRegionPath`）。
- 代码在 `df602c2`（message `最新`，2026-08-23 08:40 +0800）。工作区干净。`HEAD` = `origin/main` = `df602c24171d7e6ad70f148f793bdfb5f7cd9443`。上一笔 `b8c71dc`（`2`）是画板 overflow 淡出 + 默认 1800×1080 + 缩放 0.935/0.6。
- Worker 当时自报：`field-division-line` 9；`field`+`commands`+line 150；`scene-svg` 46；escutcheon 24；`pnpm typecheck` exit 0。目检 `http://localhost:3000/coat-of-arms-maker`（Discard draft）Per Pale + Wavy + 左 Barry + 改 Frequency **3/3 PASS**。报告/图在 commit 里：`tmp/visual-division-line-regions.md` 及 `-01/-02/-03` png。本交接班未再跑命令。

### 做到一半

无产品半截。Orca 任务 `task_1e82a8c5d0ba`（Codex 复审 High-fix）当时卡在启动 MCP，没有 `worker_done`；Grok 已另做复审（无剩余 High）。过夜后该 Codex 终端是否仍开着，本班未查。

### 下一步

- 用户若要 B 范围再单开：Chevron Edge/Point Y、Gyron 6–16、Add Color、barry Pieces。不要抄 PRO。
- 共存测试仍以 per-pale 为主；per-fess / per-bend 几何已实现，覆盖较薄。
- `CoatOfArmsMaker.test.tsx` 点 3:5 再断言 1800×1080，默认改成 3-5 后同义反复。另有 3 条 CSS 几何失败（当时全量里 3 条，非本次 Custom 引入）。
- 不要把 `WORKLOG.md` 放进产品 commit。本文件未随 `df602c2` 提交。

### 踩过的坑

- 只用 `http://localhost:3000/coat-of-arms-maker`，不要 `127.0.0.1`。草稿 overlay 会把 workbench 设成 `inert`，量之前 Discard/关草稿。
- 旧引擎 `assertFieldRegions` 禁止 `regions`+`divisionLine` 并存；Custom 保存一侧会删另一侧。竞品是两边都留。
- Custom Overall 加徽记带 `fieldRegionId=overall`，曾对波浪线调用 `fieldRegionDivisionLinePath` 抛 `Unsupported field division line region overall`。
- Pale→Fess 后 `divisionLine` 仍在、charge 仍 `dexter`，曾把 `CoatOfArmsCanvas` 卸掉。
- 第一次 `worker-release` T4 grok 会卡住；重跑才释放成功。不要因 `check --wait` 超时杀还在干活的 worker。
- 不要抄 coamaker「Upload … with PRO」/ Upgrade。Show Border 不是付费墙。

### 怎么验证

```bash
pnpm exec vitest run src/lib/coat-of-arms/field-division-line.test.ts src/lib/coat-of-arms/field.test.ts src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/scene-svg.test.ts src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx
pnpm typecheck
```

页面：`http://localhost:3000/coat-of-arms-maker`（localhost；关掉草稿 overlay）→ Custom → Per Pale → Division Line Style **Wavy** → Dexter (Left Side) **Barry** → 改 Frequency。左 Barry、右另一色、缝仍是波浪。Overall Add Charge 不应白屏。chrome 仍 99/50/40。

---

## 交接单 · 2026-08-22 22:02 CST · Cursor Grok coordinator

### 本次目标

Orca `run_91e479b6b9cf`：三件 coamaker 对齐——画板外 overflow 只淡出越界部分；默认画布 1800×1080 横图；默认盾 + 新放图库资产更小。颜色保持（artboard `#fff`，stage `#f0ece2`）。不改 chrome 99/50/40。不抄广告/付费墙文案。不 push。

用户选择：A 默认画布 1800×1080；B 同时缩小默认盾 **和** 新放图库资产；overflow 只淡越界部分（不是整层）。

### 已完成

- Overflow：双 SVG（画板内不透明；画板外 opacity 0.5 米色 veil）。
- 默认画布 1800×1080，preset `3-5`。`1:1` preset 仍是 1080×1080。
- `DEFAULT_SHIELD_SCALE` **0.935**；`NEWLY_PLACED_LIBRARY_ASSET_SCALE` **0.6**。上传 / 手绘 / 文字仍 scale 1。
- Worker 自报（本交接班未再跑）：overflow + scene-svg **74 passed**；canvas/scale 相关 **225 passed**；11 个测试文件 review **281 passed**；test-proof holes（叠层顺序 + escutcheon scale）**48 passed**；实现 typecheck 通过。实机 `http://localhost:3000/coat-of-arms-maker` 视觉 **4/4 PASS**（`tmp/visual-canvas-align-verify.md`）。
- 未提交：本次 `src/` 改动 + `WORKLOG.md` + `tmp/` recon/visual。`main` 比 `origin/main` 超此前 6 个 commit，外加这些未提交文件。本班不 commit、不 push。

未提交的 `src/`（本次产品项）：

- `src/app/globals.css`
- `src/components/coat-of-arms/CoatOfArmsCanvas.tsx` + `.test.tsx`
- `src/components/coat-of-arms/ColorBackgroundPanel.test.tsx`
- `src/components/coat-of-arms/ExportMenu.test.tsx`
- `src/components/coat-of-arms/SettingsPanel.test.tsx`
- `src/components/coat-of-arms/ShieldFieldPanel.tsx` + `.escutcheon.test.tsx`
- `src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx`
- `src/lib/coat-of-arms/assets.ts` + `.test.ts`
- `src/lib/coat-of-arms/commands.ts` + `.test.ts`
- `src/lib/coat-of-arms/editor-preferences.ts`
- `src/lib/coat-of-arms/export.test.ts`
- `src/lib/coat-of-arms/scene-svg.ts` + `.test.ts`
- `src/lib/coat-of-arms/store.test.ts`

### 做到一半

无。三件产品项都做完。

### 下一步

- 用户若要上远程，再自行 commit/push。本班未 commit、未 push。
- 残留：`CoatOfArmsMaker.test.tsx` 的 3:5 点击在默认改成 `3-5` 后变成同义反复。
- 不要把 `1512×738` 画布从 ~547 缩回 480。
- 不要抄 coamaker 广告。

### 踩过的坑

- 本机必须用 `http://localhost:3000/coat-of-arms-maker`，不要 `127.0.0.1`。草稿 overlay 会把 workbench 设成 `inert`，量之前先关掉。
- Overflow 是叠两份 SVG，不是整层 opacity。
- 不要用乘法去改 `RANDOM_CHARGE_SCALE`。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/lib/coat-of-arms/scene-svg.test.ts
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsCanvas.test.tsx src/components/coat-of-arms/ColorBackgroundPanel.test.tsx src/components/coat-of-arms/ExportMenu.test.tsx src/components/coat-of-arms/SettingsPanel.test.tsx src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx src/lib/coat-of-arms/assets.test.ts src/lib/coat-of-arms/commands.test.ts src/lib/coat-of-arms/export.test.ts src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/store.test.ts
pnpm typecheck
```

页面：`http://localhost:3000/coat-of-arms-maker`（localhost，关掉草稿 overlay）。

- 默认画布 1800×1080，preset 3-5；1:1 仍 1080×1080
- 默认金盾约 canvas 高度 90%；新放图库资产 scale 0.6
- 拖出画板：板内不透明，板外 50% 米色 veil；选框/手柄仍可用
- chrome 仍 topbar 99 / actionbar 50 / toolbar 40
- artboard `#fff`，stage `#f0ece2`

Worker 自报数字：overflow+scene-svg **74**；canvas/scale **225**；11 文件 review **281**；叠层+escutcheon **48**；typecheck 通过；视觉 **4/4 PASS**。本交接班未再跑。

---

## 交接单 · 2026-08-22 20:49 CST · Cursor Grok

### 本次目标

把未提交的编辑器高度、Shields 树短名、Contact 导航按用户选 C 存档，再写交接单。不 push。

### 已完成

- 提交 `263841f`（未 push；`main` 比 `origin/main` 超 6 个 commit）。含：工作台顶栏桌面 99px；画板宽度 `min(100%, calc(100cqh * aspect-ratio))`，wrap `container-type: size`、垂直 padding 0；Shields 树短名（EN: Shield/Heater/French/Banner/Round/Lozenge；ZH: 盾/熨斗/法式/旗帜/圆/菱形）；Contact 进顶栏（maker / InnerPageChrome / HomeHero）和对应测试。
- 未进提交：`WORKLOG.md`、`tmp/`。
- 高度编排 `run_d0b9d2919a1e` 6 个任务均为 completed；inbox 空。短视口空白已按 wrap 实测高度修掉。
- 更早已提交且仍未 push：`f0b03b9` Arrange/Names/Upload chrome；`849c04b` prefs 加载失败不再静默；`29ab291` Charges→Upload；`5f3c744` 树 hover + pointer；`968eaa6` 清层名 unused binding。

### 做到一半

无产品半成品。工作区只剩本文件与未跟踪的 `tmp/` 测量图/报告。

### 下一步

- 用户若要上远程，再 push；本班未 push。
- 不要把 `1512×738` 画布从 ~547 缩回 480；不要改 actionbar 50px / canvas-toolbar 40px。
- Contact 页本身是否还要补内容：本班只加了导航链接，未改联系页正文。

### 踩过的坑

- 画板用独立的 `100svh - 189` 会和工作台 `min-height: 38rem` 打架：`1512×500` 时 wrap 与 artboard 曾差约 108px。要对齐 wrap 的 `100cqh`，不要复制一份 svh 公式。
- 本机编辑器必须用 `http://localhost:3000/coat-of-arms-maker`，不要 `127.0.0.1`。草稿 overlay 会把 workbench 设成 `inert`，量高度前先关掉。
- 几何回归不要只 `toContain` 整段 `globals.css`；jsdom 量不到，现有测试用已有 `@playwright/test` 夹具（未加新依赖）。
- 不要抄 coamaker 广告、付费墙、文案。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx
pnpm typecheck
```

页面：`http://localhost:3000/coat-of-arms-maker`（无草稿 overlay）。桌面顶栏 99 / actionbar 50 / toolbar 40。无草稿时：

- `1512×738`：wrap 549 / artboard 549 / canvas 547，高度差 0
- `1512×500` 与 `1512×600`：wrap 与 artboard 高度差 0（不再是 108px）
- Shields 树显示短名；图库仍是全名（如 Kite shield）
- 顶栏 Contact 在 Blog 前

上次 worker 自报：该 vitest 文件 96 passed；`pnpm typecheck` 通过。本交接班未再跑一遍。

---

## 交接单 · 2026-08-22 20:45 CST · Grok worker

### 本次目标

对照 `tmp/layout-height-code-review.md`，只修已验证的短视口画板空白：画板跟 `.coat-target-artboard-wrap` 实际高度走，不再用独立的 `100svh - 189`。不提交。

### 已完成

- `.coat-target-artboard-wrap` 设 `container-type: size`；`.coat-target-artboard` 宽度改为 `min(100%, calc(100cqh * var(--coat-canvas-aspect-ratio)))`，保留 aspect-ratio / `max-width` / `max-height`。去掉未再使用的 `--coat-editor-chrome-height`。
- 未改 actionbar 50px、canvas-toolbar 40px、Shields 短名、Upload、Contact/SEO。
- `CoatOfArmsMaker.test.tsx`：用规则声明而不是整段 `toContain`；并用已有 Playwright 量 1512×738 / 600 / 500 夹具几何（jsdom 量不到）。禁止 `100svh` 回潮。

### 做到一半

无。

### 下一步

未提交。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx
pnpm typecheck
```

实机 `http://localhost:3000/coat-of-arms-maker`（localhost，不用 127.0.0.1），无草稿 overlay：

- `1512×738`：wrap **549** / artboard **549** / canvas **547**，高度差 **0**（未缩回 480）
- `1512×600`：wrap **419** / artboard **419**，高度差 **0**（原 8px）
- `1512×500`：wrap **419** / artboard **419**，高度差 **0**（原 108px）
- chrome 仍是 topbar 99 / actionbar 50 / toolbar 40

vitest：1 file / **96 tests passed**（含短视口几何 4230ms）。`pnpm typecheck` 通过。

---

## 交接单 · 2026-08-22 20:20 CST · Grok worker

### 本次目标

按 `tmp/layout-height-coamaker-recon.md`、`tmp/layout-height-ours-recon.md` 把 coat-maker 编辑器上下 chrome / 画布垂直空间对齐竞品计算高度。只改 recon 点名的高度 token。不提交。

### 已完成

- `.coat-target-workbench > .site-topbar` 锁 **99px**（padding 8.5px，nav `margin-top: 0`）。Maker 顶栏 class 去掉 `py-4` / `mt-4`。CONTACT 链接仍在。
- `.coat-target-actionbar` **50px**、`.coat-target-canvas-toolbar` / scene 第一行 **40px** 未改。
- `.coat-target-artboard-wrap` 垂直 padding 改为 **0**，左右 clamp 保留。
- `.coat-target-artboard` 去掉 `30rem` 方卡：`width: min(100%, calc((100svh - 189px) * aspect-ratio))`，`max-height: 100%`。189 = 99+50+40。
- 更新 `CoatOfArmsMaker.test.tsx` 锁死字符串。未改 Contact/SEO、Shields 短名、Arrange/Names/Upload、cursor。

### 做到一半

无。桌面 `1512×738` 已量：topbar 99 / actionbar 50 / toolbar 40 / wrap 垂直 padding 0 / artboard 549 / canvas 547（74.1% 视口）。手机 390 顶栏长到 141.68，导航未裁切。

### 下一步

未提交。

### 怎么验证

```bash
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx
pnpm typecheck
```

---

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
