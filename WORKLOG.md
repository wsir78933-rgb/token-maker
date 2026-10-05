# WORKLOG

## 交接单 · 2026-10-05 13:50 CST +0800 · Codex

### 本次目标

收紧 Outfit Creator 三组案例的间距；参考 Army Formation Creator，把使用步骤下方的孤立按钮改成完整 CTA；同步 EN/ZH，将英文完整短语 `Outfit Creator` 和中文对应名称 `服装搭配工具` 的关键词密度调整到 2%–3%；提交合并到本地 main，并通知用户删除唯一新建的「穿搭文案」工作树。

### 已完成

- `src/components/outfit-creator/OutfitCreatorCaseStudies.tsx` 的三组间距改为 `gap-10 sm:gap-12 lg:gap-14`，对应手机 40px、平板 48px、桌面 56px。EN/ZH 共用该组件。
- `src/components/outfit-creator/OutfitCreatorPageView.tsx` 将使用步骤和 CTA 分成独立普通函数，区块顺序为 How To Use → CTA → FAQ。CTA 包含本地化标题、描述、44px 高圆角按钮及箭头，链接为 `#outfit-creator-editor`。`src/lib/outfit-creator/constants.ts` 公开导出编辑器 ID，PageView 与客户端 PageHeading 共用，避免服务端从 Client Component 读取普通常量。中文 CTA 标题为「用服装搭配工具开始搭配角色造型」，英文为「Start styling with Outfit Creator」。
- `src/lib/outfit-creator/copy.ts` 的案例介绍、功能说明、操作步骤、CTA 标题、FAQ 说明与免费使用答案，EN/ZH 各调整 10 个现有字段；未改 meta、alt、ARIA、轮播案例或新增功能。按完整短语出现次数 ÷ 页面分词数计算，正文包含五个 FAQ 答案：英文 21/870 = 2.41%，含导航页脚的全页 21/942 = 2.23%；中文 21/934 = 2.25%，全页 21/1010 = 2.08%。初始折叠 FAQ 的可见关键词为 20 次，其正文和全页也在 2%–3%。
- 提交 `fc3755112b8b80ddfbdf18e679b310a7485b8505`（`feat: refine outfit creator layout and bilingual copy`）包含上述五个文件，58 insertions、30 deletions，已 fast-forward 合入本地 main。本次 offhand 回读 main HEAD 仍为该提交，五个源码 SHA-256 与已验证版本一致；copy.ts 为 `9460f500458caef7a41a7e162fd8c97a5b8efc786acc60bed9dae193aa2c8e3d`。没有推送或部署。
- 原工作树与合并后的 main 均运行三组聚焦 Vitest，分别为 3 files、14/14 tests、exit 0。合并后的 main 另有 `pnpm typecheck` 和五文件 scoped ESLint exit 0。本次 offhand 只回读现状和日志，没有重新跑这些检查。
- 原工作树 40003 的真实 ego-browser 验证覆盖 EN/ZH × 1440×900 / 375×812，CTA 点击、免费 FAQ 展开和横向溢出检查通过。每组四个案例均实际切换显示；按独立组词数计算的 64 种组合全页密度范围为英文约 2.22%–2.25%、中文约 2.07%–2.09%。手机截图已查看，TaskSpace 49 已 finish。本次 offhand 未重新验收 main 的 40001 页面。
- 当前「穿搭文案」目录、本地 `codex/穿搭文案` 分支均不存在，也不在 worktree 清单中；本会话只通知删除，没有执行删除，不归因删除者。当前清单保留主仓库和既有「微标文案」。本会话已停止自建的 40003 服务，本次回读无监听；40001 当前 PID 26609，cwd 为主仓库，本次未操作该服务。
- 当前仍可回读的证据：`/tmp/token-maker-outfit-density-browser.json`、`/tmp/token-maker-outfit-density-vitest.log`、`/tmp/token-maker-outfit-main-merge-vitest.log`、`/tmp/token-maker-outfit-density-en-mobile.png`、`/tmp/token-maker-outfit-density-zh-mobile.png`。系统清理 /tmp 后文件可能消失。

### 做到一半

无未完成编码。本交接单未存档；写入前唯一 dirty 文件是既有 `WORKLOG.md`，暂存区为空，旧条目原样保留。完整仓库测试、完整 Vinext 生产构建链、推送、部署以及合并后 main 的新浏览器验收未执行，不能用上述聚焦检查代替。

### 下一步

下一班输入 `$pickup`，先核对 main HEAD、工作区与本条交接。穿搭改动已合入 main，工作树和分支已不存在，无需再次删除；不处理既有「微标文案」。根据用户的新需求继续，保留 WORKLOG 未提交状态。若用户要求复验 main，用下节命令与浏览器步骤生成对应当前源码的新证据。

### 踩过的坑

- main 中已有与提交完全相同的 CaseStudies 间距改动，首次 fast-forward 被未提交文件阻挡。核对工作文件 blob 与提交 blob 都为 `5d56912a25306b0c6d36ed8d6a30febeb13a751a` 后，仅暂存该文件再合并成功；没有 restore、stash 或处理 WORKLOG。原 WORKLOG 的 SHA-256 在合并前后均为 `e43786dcb7234d845712e474a66a17e621435fd63e46afde104eddaff6370e15`。
- 服务端从带 `use client` 的 PageHeading 导入编辑器 ID，曾使 CTA href 变成 client-reference 函数文本；中性 constants 模块已修正该边界。浏览器导航不能只等 hash 更新，还要等编辑器实际进入可见范围。
- Turbopack 不接受指向工作树根目录之外的 node_modules 符号链接；原工作树改用既有依赖的本地副本，没有新增依赖。此前默认 Next build 编译和类型检查通过后，在收集 `/api/coat-export` 时无法加载 `cloudflare:workers`；该 API 属范围外，未修复，也不声称完整生产构建通过。
- 密度不能按源码所有字符串直接计算：隐藏表格 caption 会重复标题，meta/alt/ARIA 不属于本次正文，案例组的 title/description 未渲染，轮播只统计当前案例。FAQ 含答案与初始折叠可见文本是不同口径，必须分开标明。验收设置 reduced-motion 停止轮播自动播放，减少采样漂移。

### 怎么验证

以下为可重跑步骤，本次 offhand 没有执行测试、Lint、构建或浏览器：

- Git：`git status --short --branch`；`git log -1 --oneline`；`git merge-base --is-ancestor fc3755112b8b80ddfbdf18e679b310a7485b8505 main`；`git worktree list --porcelain`。本交接写完预期仅 WORKLOG.md 为 unstaged，暂存区为空。
- 聚焦测试：`pnpm exec vitest run src/app/outfit-creator-routes.test.tsx src/lib/outfit-creator/copy.test.ts src/components/outfit-creator/OutfitCreatorCaseStudies.test.tsx`。类型：`pnpm typecheck`。Lint：`pnpm exec eslint src/components/outfit-creator/OutfitCreatorCaseStudies.tsx src/components/outfit-creator/OutfitCreatorPageHeading.tsx src/components/outfit-creator/OutfitCreatorPageView.tsx src/lib/outfit-creator/copy.ts src/lib/outfit-creator/constants.ts`。
- UI：先核实 40001 仍对应当前 main，再用 ego-browser 打开 `http://localhost:40001/outfit-creator` 与 `http://localhost:40001/zh/outfit-creator`，以 1440×900 和 375×812 检查案例间距、CTA 标题/描述/按钮、无横向溢出；点击 CTA 应进入编辑器，展开免费使用 FAQ，逐组切换四个案例。
- 密度：从实际渲染的 main 提取 reader 文本，分别统计正文及含导航页脚的全页。主口径计入五个 FAQ 答案，排除 meta、alt、ARIA、sr-only、SVG、调试界面；轮播按当前显示内容。用 `Intl.Segmenter('en'/'zh', { granularity: 'word' })` 的 isWordLike 分词数作分母，完整关键词每次出现计 1，不把英文短语的两个单词乘入分子。FAQ 折叠的实际可见口径另外计算；目标均为 2%–3%。

## 交接单 · 2026-10-05 11:29 CST +0800 · Codex CLI

### 本次目标

为 Outfit Creator 中英文页面增加案例展示模块，放在 What Is 下面，使用用户提供的 CircularTestimonials 切换方式，三组各四张图片，桌面排列为左文案右图片 → 左图片右文案 → 左文案右图片。调整标题、移除三组内部标题与说明，补充线稿、配色和材质影响最终效果的说明，修复后排卡片裁切；完成提交并合并到本地 main，通知用户可删除工作树。

### 已完成

- `src/components/outfit-creator/OutfitCreatorCaseStudies.tsx` 实现三组共 12 个案例；`OutfitCreatorPageView.tsx` 将模块接在 What Is 后、功能介绍前。EN/ZH 共用组件，分组图片位置为 `right / left / right`。中文主标题为「用服装搭配工具能做什么」，英文为「What can you do with Outfit Creator?」。三组内部标题与说明已从渲染中移除，分组保留可访问的轮播名称。
- `src/lib/outfit-creator/copy.ts` 提供两种语言的案例、图片 alt、前后按钮名称，并在 What Is 中说明：服装组合是线稿参考，最终效果取决于对线稿的理解、导出后的绘画、配色和材质表现。`public/outfit-creator/cases/` 中有 12 张 600×500 PNG。
- `src/components/armor-creator/circular-testimonials.tsx` 保留前/左/右叠放、文字动画、5 秒自动播放、手动操作后暂停和聚焦范围内的方向键切换；支持中文分词及 reduced-motion。裁切修复新增公开可选属性 `clipImageStack`，默认 true；Outfit 显式传 false，图片 stage 使用 overflow-visible 并按卡片高度与上移距离预留 min-height。圆角图片 frame 仍使用 overflow-hidden，后排 scale(0.85) 与 rotateY(±15deg) 保留。既有 Armor 调用继续采用默认裁切和高度。
- 提交 `aab49ccfda557308395dee5a9b53377902993de3`（`feat: add bilingual outfit creator case studies`）已通过 fast-forward 合入本地 main，共 20 个文件：8 个代码/测试文件、12 张 PNG。此次 offhand 写入前 main clean，HEAD 仍为该提交；实际回读的 20 个源文件 SHA256 与已验收记录全部相同。没有推送或部署。
- 本会话合并前相关 Vitest 验证为 4 个文件、42/42 测试通过，exit 0；此前 `pnpm typecheck` exit 0，轮播与案例模块的三文件 ESLint exit 0。这些检查在原工作树执行，本次 offhand 没有重新运行测试、类型检查、Lint 或构建。
- 本地 ego-browser 验收记录为 EN/ZH × 360、390、640、767、768、1024、1440px，共 14/14 组几何检查通过：三组可见卡片完整、基础尺寸一致、无文案/按钮交叠和横向溢出。中英文三组共 6/6 轮播完成真实下一页按钮与聚焦方向键返回检查；Armor 两种语言的默认 stage overflow/min-height 兼容检查通过。桌面、手机截图已实际查看；TaskSpace 39 已 finish。
- 当前 Git worktree 清单只剩主仓库，原「穿搭案例展示」目录与本地分支均不存在；本轮没有执行删除，不归因删除者。此次工作树的 40002 预览服务已停止且本轮回读无监听。40001 当前监听 PID 41766，cwd 为本主仓库；本次 offhand 未操作该服务，也未重新验收其页面。
- 当前可回读证据位于 `/tmp/outfit-card-clipping-PiICU1/`：`merge-validation.json`、`final-validation.json`、`responsive-browser-receipts.json`、`controls-browser-receipts.json`、`armor-compatibility-browser-receipts.json`、`worker-height-validation.log` 及 `final-cards-390-zh.png`、`final-cards-390-en.png`、`final-640-zh.png`、`final-1440-zh.png`、`final-1440-en.png`。系统清理 /tmp 后这些文件可能消失。

### 做到一半

无未完成编码。本交接单保持未提交。完整仓库测试、完整生产构建、推送和部署未在本任务执行；不能用局部测试或本地浏览器通过代替这些结果。

### 下一步

下一班输入 `$pickup`，先核对 main HEAD、工作区和本交接单。案例展示及裁切修复已完成，无需再次删除原工作树。根据用户的新需求继续；如需复验合并后的 main，使用下节命令并生成新证据。保留 WORKLOG 未提交状态。

### 踩过的坑

- image stage 的 overflow-hidden 会切掉因 `translateY(-gap × 0.8)` 上移的后排卡片顶部。只取消裁切会在 640px 宽手机视口遮挡文案与按钮，必须同时预留叠放所需高度。前大后小是组件原有 85% 缩放与倾斜效果，不应误当成基础图片尺寸不一致。
- 轮播自动播放会在浏览器滚动到按钮的期间改变 active index；验收时先用聚焦方向键触发手动暂停，再读取索引并执行按钮检查。中文根语言为 zh-CN，不能用严格等于 zh 的断言；圆角应核对实际样式，不硬编码默认 Tailwind 数值。
- 浏览器中的 Monica 扩展向 body 注入 monica-id/monica-version，曾出现 hydration 属性警告；本任务未修改这项范围外行为，不声称全局 console 干净。
- `pnpm dev` 会先执行 `scripts/free-port.mjs 40001`，该脚本会终止占用 40001 的进程。若需要独立临时服务，直接执行 next dev 并选择另一个空闲端口，避免影响现有主仓库服务。

### 怎么验证

本次 offhand 只核对 Git、源码哈希、现有证据和服务状态；下面是可重跑步骤：

- Git：`git status --short --branch`；`git log -1 --oneline`；`git merge-base --is-ancestor aab49ccfda557308395dee5a9b53377902993de3 main`；`git worktree list --porcelain`。本交接完成后预期只有 WORKLOG.md 为 unstaged，暂存区为空。
- 相关测试：`pnpm exec vitest run src/components/armor-creator/circular-testimonials.test.tsx src/components/outfit-creator/OutfitCreatorCaseStudies.test.tsx src/app/outfit-creator-routes.test.tsx src/lib/outfit-creator/copy.test.ts --maxWorkers=2`。
- 类型检查：`pnpm typecheck`。定向 Lint：`pnpm exec eslint src/components/armor-creator/circular-testimonials.tsx src/components/armor-creator/circular-testimonials.test.tsx src/components/outfit-creator/OutfitCreatorCaseStudies.tsx`。
- UI：在核实对应当前 main 的本地服务打开 `http://localhost:40001/zh/outfit-creator#outfit-creator-case-studies` 和英文 `/outfit-creator#outfit-creator-case-studies`。检查 What Is 下三组各四张、桌面图文交替、主标题本地化、分组标题说明未渲染；360–1440px 尤其 640/767px 检查后排顶部圆角完整且不遮挡文案/按钮。点击各组前后按钮，聚焦该组后按左右键，确认图片与文案一起切换。检查 `/armor-creator` 与 `/zh/armor-creator` 的原有轮播默认表现。使用真实 ego-browser 输入和截图保留交互证据。
- 若需临时服务，在已确认空闲端口使用 `pnpm exec next dev --webpack --port 40002 --hostname 127.0.0.1`；40002 当前已停止，重新启动必须绑定当前源码后再做验收。

## 交接单 · 2026-10-04 22:51 CST +0800 · Codex（Orca 会话）

### 本次目标

修复徽标编辑器素材列表的滚动穿透：鼠标位于列表内，滚到顶部或底部后继续滚轮时不再带动外层页面；鼠标移出列表后页面仍可正常滚动。使用一个名为「新工具 1」的工作树及内置子代理实现和审核，随后提交并合并到 main。本次 offhand 用户选择 A（不存档），仅插入本交接单，不提交或处理其他未存档改动。

### 已完成

- 仅修改 `src/components/emblem-creator/EmblemAssetPanel.tsx:98`，在真实素材 `<ul>` 的 `overflow-y-auto` 后添加 `overscroll-y-contain`。主体、细节、图标三类及 EN/ZH 共用该组件；未新增依赖、事件监听器或功能。
- 修复提交为 `de6dcc76d15eb4a4616490a52f8cb21d8fa1b93f`，合并提交为 `dc1a285aca3f1080544bc74a9aa03b1a670c4194`。本次 offhand 核对 main HEAD 为该合并提交，修复是 main 的祖先。当前组件 SHA-256 为 `1593276b3cb7094df458671a76342b2de61084fa4429ea2eb215a91fcbcefe2b`，与本会话浏览器验收源码一致。
- 5 个内置子代理参与：实现、只读根因核查、验证规划、两路独立审核；主代理执行最终命令及真实 ego-browser 验收，没有使用 Orca 编排。
- 本会话历史验证在原「新工具 1」工作树执行：3 个相关 Vitest 文件、61/61 tests 通过；`pnpm typecheck`、`pnpm lint`、`pnpm exec vinext build` 均 exit 0。Lint 为 0 错误、6 条未修改博客测试文件 warning。这些不是本次 offhand 或合并后完整 main 的重新运行结果。
- 本会话历史 ego-browser 验收覆盖 EN/ZH × 1440×1000 桌面 / 390×844 窄屏 × 三个分类，共 12/12 场景通过；记录 96 次真实 `page.mouse.wheel` 输入及 24 张非空截图，截图字节数和 SHA-256 已核对。列表上下边界、反向恢复滚动、鼠标移出列表后的页面滚动均通过；TaskSpace 10 的 finish 回执为 closedSpace=true，临时 41001 服务已停止。
- 提交合并时只带入上述组件，既有 WORKLOG 字节与暂存状态保持不变。本任务没有推送、部署或删除工作树；本次只读核对原「新工具 1」目录不存在，Git worktree 清单仅含主仓库，不归因删除者。

### 做到一半

无待实现的徽标滚动修复。未存档：当前 main 已有 `WORKLOG.md`、`src/components/outfit-creator/OutfitCreatorPageHeading.tsx`、`src/lib/outfit-creator/copy.ts` 改动；本交接单也保持未提交，暂存区为空。本 offhand 不处理 Outfit Creator 改动。未运行完整 Vitest、完整 `build:vinext` 发布门禁或生产验收。

### 下一步

下一班输入 `$pickup`，先核对 branch、HEAD 和工作区；保留现有未存档改动。徽标修复已进入 main，无需继续实现或重复删除已不存在的工作树。如需新的当前 main 验证，按下节命令与真实浏览器步骤生成新证据。原验收文件位于已不存在的 `新工具-1/.wrangler/scroll-boundary-qa/`，当前无法从该路径回读；本条历史结果依据本会话实际命令和浏览器输出，不应将失效路径当作现存证据。

### 踩过的坑

- 原列表没有纵向滚动链限制，浏览器实测底部继续滚动使 windowY 从 1386.5 到 1412.5，顶部从 1008.5 到 982.5；单加 `overscroll-y-contain` 即可保持列表内部滚动并阻止边界穿透。
- `pnpm build --webpack` 在未修改的 `src/app/api/share/route.ts` 导入 `cloudflare:workers` 时以 UnhandledSchemeError 失败、exit 1。README 指明生产编译使用 Vinext；`pnpm exec vinext build` 已通过，但不能将其等同完整 `pnpm build:vinext` 链或部署通过。
- 早期验收脚本因环境参数未传入、滚动稳定性等待以及分类按钮移出视口而失败；调整脚本定位及读取稳定滚动状态后，最终四组均重新执行并通过。先前失败未计为 PASS；每次 pointer 输入前重新读取几何和 elementFromPoint，禁止用合成 WheelEvent 或直接修改 scrollTop 代替真实滚轮。
- 当前存在另一会话范围的未存档 Outfit Creator 改动；不得把这些文件或旧 WORKLOG 顺手加入本交接的 Git 提交。

### 怎么验证

以下是可重跑步骤，本次 offhand 未执行测试、Lint、构建或浏览器：

- 相关测试：`pnpm exec vitest run src/components/emblem-creator/EmblemAssetPanel.test.tsx src/components/emblem-creator/EmblemCreatorWorkbench.test.tsx src/app/emblem-creator-routes.test.tsx`。
- 类型与 Lint：`pnpm typecheck`；`pnpm lint`。生产编译：`pnpm exec vinext build`；本条不授权推送或部署。
- 当前代码：`git merge-base --is-ancestor de6dcc76d15eb4a4616490a52f8cb21d8fa1b93f main`；`shasum -a 256 src/components/emblem-creator/EmblemAssetPanel.tsx` 应与上文记录对应，若源码已改变须重新绑定证据。
- UI：在已核实运行且对应当前源码的本地服务打开 `/emblem-creator`、`/zh/emblem-creator`；分别以桌面和 390px 窄屏检查三个素材分类。鼠标在列表内滚到顶、到底继续滚轮，读取列表 scrollTop、window.scrollY 和祖先 scrollTop，确认外层不动；在边界反向滚轮应能恢复列表滚动；鼠标移出列表后页面应正常滚动。使用本地 ego-browser 真实鼠标滚轮并保留数值、截图和非空输出，不能用页面截图或 HTTP 200 单独证明交互通过。

## 交接单 · 2026-10-04 22:00 CST +0800 · Codex CLI

### 本次目标

新增中英文 Outfit Creator 页面，参考 Armor Creator 的编辑器布局与尺寸，支持服装套装切换动画，并修复鼠标停留在素材列表上滚轮不能继续滚动页面的问题。

### 已完成

- 新增 `/outfit-creator` 和 `/zh/outfit-creator` 页面、编辑器、素材目录与来源说明；预览画布和控件尺寸按 Armor Creator 调整。
- 套装切换时预览内容滑入/滑出；普通素材分类和选择不触发套装切换动画。
- 素材列表保留内部滚动和高度限制，移除了阻断滚轮继续传递的 `overscroll-contain`。
- Outfit Creator 功能提交为 `6dff523`，并入 `main` 的合并提交为 `97a4672`。本地功能分支已删除。
- `工具 2` 工作树当前不在 `git worktree list` 中。当前 `main` HEAD 为 `d3f871c`，其父提交是包含 Outfit Creator 的 `97a4672`。

### 做到一半

无待实现代码。真实浏览器中的滚轮和套装切换交互尚未验收：当时没有可用且匹配本任务的 Ego TaskSpace。

### 下一步

如需补齐 UI 验收，使用可用的 Ego TaskSpace 启动本地页面，分别检查中文和英文路由：在素材列表上滚轮时页面能继续滚动，列表自身能滚动，切换套装 1–4 时只有预览内容执行一致的滑入/滑出效果。

### 踩过的坑

滚动素材列表原先带有 `overscroll-contain`，鼠标位于列表时滚到边界会阻止页面接管滚轮；已移除该类名。浏览器交互没有真实输入回执，不能用构建或 HTTP 200 代替交互验收。

### 怎么验证

- 合并前的 Outfit Creator 工作区在最后一次滚动修复后运行 `pnpm build:vinext`，退出码为 0：225 个测试文件、2454 个测试通过，随后完成 Workers 类型检查、Vinext 构建和 Wrangler dry-run。另有 8 条既有 ESLint warning，位于无关的 StructuredData 测试和博客文件。
- 当时 `/zh/outfit-creator` 与 `/outfit-creator` 的本地路由返回 HTTP 200；这只证明路由响应，不证明鼠标交互。
- 浏览器交互状态为未验证；后续通过真实滚轮和套装按钮完成验收。

## 交接单 · 2026-10-04 21:42 CST +0800 · Codex CLI

### 本次目标

核对并交接徽标编辑器紧凑桌面/中等/移动布局、EN/ZH 页面、资产面板滚动与编辑器原生交互，记录已归档提交、main 合并、历史验证证据和当前目标 worktree 状态。

### 已完成

布局与交互改动已在 feature commit `0f27c1e09f0b03ad893276799af89a941c4de3ec` 完成并合并到 main；交接单写入前 main clean。本交接单首次写入前 main HEAD 是 `d85d55b3178df9181bf924d3c062a0f7e2713d63`，`d6ba3b92fc476c8fb197333d5983de342545f954` 与 `0f27c1e09f0b03ad893276799af89a941c4de3ec` 均为其祖先。相对历史验证基线 `d6ba3b92fc476c8fb197333d5983de342545f954`，首次写入时 d85d55b3178df9181bf924d3c062a0f7e2713d63 的新增归档并行内容来自 `d14bdd4bf52fc2fb474efe5ad3cbeff7f9fd7ea8` 与合并提交 `d85d55b3178df9181bf924d3c062a0f7e2713d63`，涉及 `src/app/emblem-creator-routes.test.tsx`、`src/components/emblem-creator/EmblemCreatorPageView.tsx`、新增 `src/components/emblem-creator/EmblemCreatorWhatIs.tsx`、`src/lib/emblem-creator/copy.ts`；这些新增内容没有在本次 offhand 中重跑验证，也不归功于本次布局/交互任务。原 8 个布局/交互源文件中 7 个在 `d6ba3b9` 与 `d85d55b` 保持相同，`EmblemCreatorPageView.tsx` 是已被并行内容改变的 1 个文件。

校正文字时观察到 main HEAD 为 `97a467234033cd04776e024782b45ed6ba4c81c3`，已并行合并 outfit 分支，未在本 offhand 重跑该版本 QA。

历史紧凑布局验证来自冻结的 feature worktree：验证时 worktree HEAD 是 `45cb80e68345f7d4111f210859643d7fc1e91f4b`，实际使用的是其未提交的冻结源码，随后归档为 feature commit `0f27c1e09f0b03ad893276799af89a941c4de3ec`；3 个相关 Vitest 文件最终顺序复验为 94/94 tests，`pnpm typecheck`、2 文件 scoped ESLint、本地 `vinext build` 和 EN/ZH × wide/medium/mobile 六个 compact browser case 均有 exit 0 receipt。这里不能把这些结果表述为运行在原始 `45cb80e68345f7d4111f210859643d7fc1e91f4b` 提交源码上。合并后的 main 验证绑定 `d6ba3b92fc476c8fb197333d5983de342545f954`：5 个相关 Vitest 文件为 102/102 tests，`pnpm typecheck`、7 个 TSX 文件 scoped ESLint 和 `http://localhost:40001` EN/ZH desktop/mobile 四个 case 有 exit 0/PASS receipt；严格 `http://127.0.0.1:40001` 仍因 403 为 `UNVERIFIED`。`d85d55b3178df9181bf924d3c062a0f7e2713d63` 的 What Is 并行变更以及`21a15269b3f78f9f8b2a501db0eb5a68ff99aae0` 的 WORKLOG 提交均未在本次 offhand 中重跑 QA。

已确认的核心约定：素材缩略图为浅白、画布为白；打开、保存、导出位于右侧图层下；边界默认勾选；旋转箭头随图缩放且位置稳定、靠近图像；Delete/Backspace 不影响输入框；wide 素材 320px、4 列、右侧 280px、间距 16px，medium 素材 256px、3 列，mobile 4 列且列表内部 256px 滚动。

### 做到一半

无。

### 下一步

当前 `refs/heads/emblem-preview-toolbar` 与 `/Users/wusir/orca/workspaces/token-maker-app/emblem-preview-toolbar` 均不存在；这是当前状态观测，不归因删除者，也无需再删除。下一班用 `$pickup` 接手；后续仅在新的明确授权范围内继续，不推送、不部署。

### 踩过的坑

紧凑布局第一次机器报告为 94 tests 中 93 pass、1 fail，原因是英文 215-asset listing 触发 5000ms timeout；冻结源码后按相同执行顺序复验为 94/94，初次失败仍保留为历史证据。

scratch browser 在 mobile page scroll 后使用旧坐标命中 canvas 失败；修复为每次 pointer input 前重新读取 rect/elementFromPoint，并等待图片 `complete && naturalWidth > 0`。早期 scratch 失败日志存在缺口，部分输出已被覆盖且未重建，不能据此补充当前通过结论。

历史 main 浏览器在 `http://localhost:40001` 的 EN/ZH desktop/mobile 四个 case 有 PASS receipt；严格 `http://127.0.0.1:40001` 因 Next dev blockCrossSiteDEV 返回 403，只能标为 `UNVERIFIED`。Monica 扩展注入属性造成的 hydration warning 属现有扩展且在本功能 scope 外。闭合 TaskSpace 6 的 scratch browser 脚本不作为可直接重跑命令。

### 怎么验证

主 repo 的复验命令（本次 offhand 未运行）：

`pnpm exec vitest run src/components/emblem-creator/EmblemCanvas.test.tsx src/components/emblem-creator/EmblemCreatorWorkbench.test.tsx src/components/emblem-creator/EmblemAssetPanel.test.tsx src/components/emblem-creator/EmblemCreatorPageHeading.test.tsx src/app/emblem-creator-routes.test.tsx`

`pnpm typecheck`

`pnpm exec eslint src/components/emblem-creator/EmblemAssetPanel.tsx src/components/emblem-creator/EmblemCanvas.test.tsx src/components/emblem-creator/EmblemCanvas.tsx src/components/emblem-creator/EmblemCreatorPageView.tsx src/components/emblem-creator/EmblemCreatorWorkbench.test.tsx src/components/emblem-creator/EmblemCreatorWorkbench.tsx src/components/emblem-creator/EmblemDocumentToolbar.tsx`

浏览器可打开 `http://localhost:40001/emblem-creator` 与 `http://localhost:40001/zh/emblem-creator`，选择主体 6，检查白底 canvas、bounds/hand 交互，使用 arrow 与 Delete；移动端检查 tabs 且无 horizontal overflow。历史证据路径可回看 `/tmp/emblem-git-release-20261004/merged-checks.json`、`/tmp/emblem-git-release-20261004/merged-browser.json` 和 `/tmp/emblem-compact-layout-20261004/checks-verification.json`。这些是选定文件与历史 localhost browser 证据，未证明完整 repository tests、standard Next build、Workers packaging、部署或生产状态。

## 交接单 · 2026-10-04 16:03 CST · Codex CLI

### 本次目标

修复 Army Formation 选中棋子上方的旋转控件：拖动棋子、平移战场、放大缩小后仍跟随棋子，支持负数及超出原地图范围的坐标；完成提交和合并到 main。用户取消了本会话的棋子大小重置，最终仅处理旋转控件。本次 offhand 用户选择 A（不存档、开始写入），仅将交接单插入项目根目录 WORKLOG.md，保持未存档、未提交。

### 已完成

- 原修复提交 `c0dd4fa9dc23a34b96bed0f730536c3415f1584d`；保留最新 main `eaf091932dc0bd3ee57535438a08830e5b4e1fa0` 的动态顶部预留及滚轮锚点补偿，产生集成提交 `45cb80e68345f7d4111f210859643d7fc1e91f4b`，随后通过 fast-forward 合入 main。本轮再次核对 main HEAD 为该集成提交，原修复是 HEAD 的祖先。
- 相对集成前 main 仅修改 `src/components/army-formation/ArmyFormationCreator.tsx` 和同目录 `ArmyFormationCreator.test.tsx`。控件横向位置按棋子中心计算，移除原地图边界限制；纵向间距结合有效缩放和棋子最大旋转外伸计算，保留约 44 CSS px 的点击区域。EN/ZH 共用组件。
- 本轮回读实际 raw：7 个相关测试文件、244/244 测试通过，Vitest、两个修改文件的 ESLint、`pnpm typecheck` 退出码均为 0。这些检查在集成修复时运行，本次文档交接未重跑。当前 main 两个文件 SHA-256 与验收报告一致：组件 `a09d97c1d9c7db8e062639410cc035959fd59fd76eaf4fc4203346de7184aac7`；测试 `13cf0ec26d4a6be15582fd27e9259f770e92852bca21d54637b0ce42488aea33`。
- 合并后已用本地 ego-browser 的原生鼠标和键盘验收 EN/ZH：地图平移、负坐标棋子、棋子拖动、旋转、缩放、Delete/Backspace 删除均通过。中文测试覆盖 8 倍及 0.25 倍，控件与旋转棋子的实际间距约 16.07px / 8.25px；真实 wheel 锚点偏差约 x=0.000194px、y=-0.002758px。英文旋转约 90.159° 后位置保持。TaskSpace 107 的 finish 回执为 `closedSpace: true`。
- 验收与 Git 报告：`/tmp/army-rotation-control-merge-20261004/verification.md`，同目录保留测试 raw、退出码、浏览器中间失败和最终通过记录、截图。两名内置子代理任务在修复完成时已结束，本任务的临时预览当时已停止；未 push、部署或新增依赖。
- 本轮实际核对 `/Users/wusir/orca/workspaces/token-maker-app/背景图` 目录不存在，Git worktree 清单亦无该路径；没有执行删除，不归因是谁删除。此前已告知用户可自行删除该工作树。

### 做到一半

无。旋转控件修复、范围内验证及 main 合并已完成。本次交接前 main 只有既有 WORKLOG.md 未提交，暂存区和未跟踪文件清单为空；本条和全部旧记录继续保持未存档。未运行完整测试集或生产构建，没有部署验收证据。

### 下一步

下一班输入 `$pickup`，先核对实际 branch、HEAD 和工作区。当前修复无需继续编码；如有新需求，另行对齐范围和验收。保留 WORKLOG 未提交状态及其他会话的旧记录。临时证据在 /tmp，系统清理后可能不可用。

### 踩过的坑

- 将控件横坐标限制在原地图宽度内，会让负坐标或超出范围的棋子与控件分离。棋子与控件应使用相同的地图位置变换。
- main 的动态顶部预留会改变 field top / pane height；固定这两个值的断言已移除，保留控件跟随、点击区域、旋转间距及滚轮锚点验证。
- 浏览器棋子中心位移不能代替真实 wheel 鼠标锚点验证；应读取实际 wheel 坐标。滚动或平移会使缓存坐标过时，真实指针输入前需重新读取位置并确认命中。初始错误断言和误拖动记录保留在 browser 日志中，后续按实际事件重新验收通过。
- 旧交接单中的未完成浏览器验收属于当时状态；本条描述本次合并后 main 的实际验收。不同层级证据不能互相替代，相关测试通过不等于完整构建或部署通过。

### 怎么验证

- 本次只验证文档：旧内容逐字节保留、新条目位于标题下和旧条目前、六段模板完整、只有 WORKLOG.md 修改、HEAD 不变、暂存区为空；执行 `git diff --check -- WORKLOG.md`。原文、新条目、恢复的原文及验证结果保存在 `/tmp/army-rotation-offhand-20261004-e4e7osrl`。
- 既有功能命令（本次 offhand 未重跑）：
  `pnpm exec vitest run src/components/army-formation/ArmyFormationCreator.test.tsx src/lib/army-formation/background-image-geometry.test.ts src/lib/army-formation/background-image-upload.test.ts src/lib/army-formation/browser-saves.test.ts src/lib/army-formation/copy.test.ts src/lib/army-formation/document.test.ts src/lib/army-formation/export-image.test.ts`
  `pnpm exec eslint src/components/army-formation/ArmyFormationCreator.tsx src/components/army-formation/ArmyFormationCreator.test.tsx`
  `pnpm typecheck`
- 若需复验 UI，在可用本地预览打开 `/army-formation-creator` 和 `/zh/army-formation-creator`，选中并拖动棋子，再平移、滚轮缩放、拖动上方 ↻；检查控件始终位于棋子上方并居中，缩放后仍可点击；检查 Delete/Backspace 删除。实际验收原始输出见 `browser/04-main-zh-native.log`、`browser/05-main-zh-anchor-observation.log`、`browser/08-main-en-final.log`、`browser/09-finish.log`。本次未启动、停止或重启任何服务，也未操作其他工作树或用户终端。

## 交接单 · 2026-10-04 15:57 CST · Codex CLI

### 本次目标

将“新工具 1 / Emblem Creator”（独立编辑器容器，EN/ZH）本次会话交接插入 canonical main 的 WORKLOG 标题下。用户已确认 A（不存档、开始写入），本条未存档、未提交，旧记录全部保留；素材使用按本会话用户明确声明的 Roll for Fantasy 作者本地使用许可。实际时区为 Asia/Shanghai（UTC+08:00）。

### 已完成

- 源提交 `12760b71dc01a2f045a2e10d9e7f31dace10e8cd` 经普通 merge `d43aab927f2d3c24ebb300ba9e7c7cc8649bc773` 合入 main；本轮两条 `git merge-base --is-ancestor <上述 SHA> HEAD` 均 exit 0。当前 main 后续合法提交保留。
- 当前素材库实际计数为 215 PNG，旧 20 SVG 保留；源提交实际 229 路径，历史报告细分为 215 PNG + 14 TS/TSX。源码点读确认 EN/ZH 共用 `EmblemCreatorPageView` / `EmblemCreatorWorkbench`；`EmblemLayerPanel.tsx` 在列表隐藏空层，`project.ts:getEmblemTargetLayer` 自动分配至首个空主体层（最多 4 个，满层抛错）及对应 `details` / `crests` 层。
- 已回读 `/tmp/emblem-new-tool-1/main-merge-git/` 的 `report.md`、`result.json`、`merge-verification.json`，及 `/tmp/emblem-new-tool-1/main-merge-final-review/` 的 `report.md`、`result.json`、`commands.json` 和测试 raw。历史 focused 验证：12/12 files、193/193 passed、0 failed、0 skipped；Vitest、14 路径 ESLint、`tsc --noEmit` exit 均为 0。本轮没有重跑。
- 写前 canonical main `/Users/wusir/Desktop/开发项目集合/token-maker-app`：branch `main`、HEAD `45cb80e68345f7d4111f210859643d7fc1e91f4b`，index/untracked 空，只有 `WORKLOG.md` unstaged。原文 191751 bytes，SHA-256 `cedf953456e61f3082c24eea9dd22e7fdd479ba3ba6761c71a79ad445907631a`，旧顶部为 Army `2026-10-04 15:38 CST` 交接。
- 实际 Orca Run `run_48638ac9d26a` 的六个 merge/preflight/fix/review Worker 均 succeeded/completed/released；按该 Run 查询，active 仅本次文档 Dispatch `ctx_f0e6d0e947be`，reclaimable 为 0。历史 retained 继续保留，本 Worker 的结算后 release 由协调者处理。

### 做到一半

- 真实浏览器交互、真实下载/导出、生产部署为 UNVERIFIED，用户已改为自己验收；历史 mock/jsdom、命令和源码证据不能证明这些项目。
- Army Formation 新需求仅整理：三处“重置旋转 / 重置高度 / 重置底色”均简写为“重置”，截图指定位置增加“棋子大小”重置。用户明确“先不要改代码”，本 Run 没有该需求的实现授权，也没有实现；当前 `src/lib/army-formation/copy.ts` 与主组件仍使用上述 ZH 原文和 EN `Reset rotation / Reset height / Reset background color`。大小重置作用于选中棋子还是全部、目标尺寸均未确认；截图位置本轮未重新回读。

### 下一步

- 用户在其当前可用预览自行验收 `/emblem-creator` 和 `/zh/emblem-creator`：四主体层分配、第五主体拒绝且项目不变、清空复用、detail/crest 分配、空层隐藏及真实下载/导出。Army 新需求先确认上述两项决定，再另行对齐 EN/ZH 实现范围。
- 原 feature 历史路径 `/Users/wusir/orca/workspaces/token-maker-app/新工具-1`、branch `新工具-1`：本轮实际目录不存在，Git worktree/local branch/Orca workspace 清单无目标；exact workspace terminal list 返回 `selector_not_found`，当前终端数量 UNVERIFIED，不当作 0。40005 的 lsof exit 1、无监听输出，无当前 PID/cwd 可核对。此前用户仅问能否删，不构成主脑实际删除授权；本轮未删除、恢复或停止资源，删除归因 UNVERIFIED。

### 踩过的坑

- 历史删除评估 `/tmp/emblem-new-tool-1/worktree-deletion-assessment/report.md` 中 source clean/main..source=0、40005 PID60235/cwd、3 retained agent + 1 user preview 只代表当时，不能写为当前事实。Orca 1.4.219 的实际 rm help 说明会尝试同时删 branch，无 keep-branch 参数；后续清理需单独授权及即时核查，不强制 force，不 raw rm/git worktree remove，不擅停服务，保留其他 worktree 与 40001/40006 用户资源。
- 历史 main 40001 EN/ZH GET HTTP 200/curl exit 0 仅当时本地 HTTP 证据；本轮未查询其当前状态，不能宣称 UI/真实下载/部署通过。wireframe `/Users/wusir/Desktop/emblem-creator-wireframe-v2.excalidraw` 本轮 `ls -ld` exit 1/ENOENT，历史 SHA 保护 UNVERIFIED；未寻找、恢复、创建或归因删除。

### 怎么验证

- 本轮仅文档验证：`python3 /tmp/emblem-new-tool-1/offhand-20261004/verify.py` 检查 after = 原 `# WORKLOG` 头 + 新 entry + 原剩余 bytes，去掉本条后与原文逐字节相同；`git diff --check -- WORKLOG.md`，并回读 `git diff --name-only`、`git ls-files --others --exclude-standard`、`git diff --cached --name-only`、HEAD/status。原文、entry、after、恢复字节和实际退出码见该目录 `before.bin`、`entry.md`、`after.bin`、`recovered-before.bin`、`report.md`、`result.json` 及 raw 命令输出。
- 历史功能命令（本轮未运行）：`pnpm exec vitest run src/lib/emblem-creator src/components/emblem-creator`；`pnpm exec eslint` 后接 final-review `commands.json` 中 14 个确切路径；`pnpm exec tsc --noEmit --tsBuildInfoFile /tmp/emblem-new-tool-1/main-merge-final-review/main-review.tsbuildinfo`。原始结果为 `focused-vitest.*`、`scoped-eslint.*`、`typecheck.*`。
- 本轮未跑 typecheck/lint/Vitest/build/浏览器，未 stage/commit/push/merge，未新增业务文件/依赖/工作树，未关闭用户或其他 Run 终端，未停/重启 preview。下一班输入 `$pickup` 可接手；未确认需求和 UNVERIFIED 项继续保留。

## 交接单 · 2026-10-04 15:38 CST · Codex CLI

### 本次目标

Army Formation 棋子可在画布直接旋转：16 CSS px 纯黑、无圆底的 ↻，44 CSS px 透明点击目标；拖动达到 3 CSS px 后选中棋子，并提交合入 main。本次按用户已确认的 offhand 范围，仅将交接单插入 canonical main 的 WORKLOG；用户明确不存档，本交接单保持未存档、未提交。

### 已完成

- 原 source 提交 `46a9836e006712bd2dd3d72eaf3ae79b800d7ce5` 已通过 merge `bed600ecad24f2cf3b6082861818d5f139653391` 合入 main；后续合法的无关工具 merge `d43aab927f2d3c24ebb300ba9e7c7cc8649bc773` 保留。
- main 的缩放手柄间距及 zoom-in / zoom-out / 上下限 no-op 锚点补修已作普通 commit `eaf091932dc0bd3ee57535438a08830e5b4e1fa0`，唯一 parent 为 `d43aab927f2d3c24ebb300ba9e7c7cc8649bc773`。仅改 `src/components/army-formation/ArmyFormationCreator.tsx` 与 `src/components/army-formation/ArmyFormationCreator.test.tsx`；其他路径的 mode/blob 与 parent 相同，Git 范围已完成。
- 写交接前实际读取 canonical main `/Users/wusir/Desktop/开发项目集合/token-maker-app`：branch `main`、HEAD `eaf091932dc0bd3ee57535438a08830e5b4e1fa0`，工作区 clean、index 空。WORKLOG 原全文 SHA-256 为 `4b188ff8f29298a29aec2c3e6da4d10b0ed2e158366ec57ce1d48ec17a28a23c`。
- 最终独立命令验证报告 `/tmp/army-drag-merge-task_4650440584ca.md`：7/7 focused 文件、241/241 测试通过，0 失败、0 跳过；两个指定文件的 ESLint、`pnpm typecheck`、`git diff --check` 实际 inner exit 均为 0。这是提交前冻结补修内容的验证，Git 报告已核对 committed blob 与冻结内容相同；本 offhand 不重跑这些命令。
- 最终代码复核报告 `/tmp/army-drag-merge-task_b66b5413c63b/review-final.md`：0 blocking；36 polygon、216 anchor、4 boundary 纯计算通过，0 失败。属于静态/纯几何证据，不是浏览器验收；Git 证据在 `/tmp/army-drag-merge-task_eae373f78733/commit-final.md`。
- 实现、独立验证、复核及 Git Workers 均已 release；Run `run_3a89f62aa87d` 本写入检查时只有当前文档 Dispatch 活跃，结算后由协调者处理本 Worker 的 release。原 `/Users/wusir/orca/workspaces/token-maker-app/报错` 路径、Git worktree 记录与 local branch `报错` 均实际回读确认不存在；未核对 Orca 软注册，也不归因谁删除。

### 做到一半

最终 main 的真实 EN/ZH 浏览器验收尚未完成，涉及 `/army-formation-creator` 和 `/zh/army-formation-creator` 的 drag selection、rotation、wheel / pan / zoom。此前 `http://127.0.0.1:40001` 的 chunks 请求出现 403，`http://localhost:40001` 已有存档 modal 阻塞真实鼠标操作；这些仅为历史观察，本次未复测，不声称当前仍是相同错误。最终补修未运行 build 或 full suite；新端口 40007 的临时 preview 尚未批准，未启动。被同名后续输出覆盖的历史失败 raw / snapshot 仍为 UNVERIFIED，现有通过证据不能重建它们。

### 下一步

下一班输入 `$pickup` 读取本条，先只读核对实时 HEAD、branch、status 与当前写入窗口，再按已授权验收范围在本地 ego-browser 用真实鼠标验证两种语言的 drag selection、rotation、wheel / pan / zoom。需要新 preview、启动 40007 或变更已有存档时，先取得确认；功能和 Git 范围已经完成，不延伸为新的实现或 commit 授权。WORKLOG 保持未存档，本次只在既有 canonical main 写入，不新建 worktree。

### 踩过的坑

- 动态 gutter 必须结合 `fieldScale × mapZoom`；wheel 锚点补偿要分别计算 current / next 的缩放值，覆盖 zoom-in、zoom-out 与上下限 no-op。
- Slide 必须沿用 outgoing zoom floor，并独立用于 current / next；不能把 current zoom 当作普通 zoom-out 的 next floor。
- 历史同名 raw / snapshot 被覆盖后不能靠后续 green 结果重建；缺失证据保持 UNVERIFIED。
- 静态代码、组件测试、mock DOMRect 与纯几何计算不能表述为真实浏览器通过。真实鼠标操作前刷新几何并确认命中；modal 阻塞时保留未验证结论，不能代替用户决定存档处理。

### 怎么验证

- 已执行的独立验证见上述三个最终报告；需要复验时，先确认工作区与授权范围，在 canonical main 执行具体命令：
  `pnpm exec vitest run src/components/army-formation/ArmyFormationCreator.test.tsx src/lib/army-formation/copy.test.ts src/lib/army-formation/document.test.ts src/lib/army-formation/browser-saves.test.ts src/lib/army-formation/export-image.test.ts src/lib/army-formation/background-image-geometry.test.ts src/lib/army-formation/background-image-upload.test.ts`
  `pnpm exec eslint src/components/army-formation/ArmyFormationCreator.tsx src/components/army-formation/ArmyFormationCreator.test.tsx`
  `pnpm typecheck`
  `git diff --check -- WORKLOG.md`
- 浏览器使用获准且可访问的本地 preview，逐一打开 `/army-formation-creator`、`/zh/army-formation-creator`。真实鼠标拖动未选棋子，检查 3 CSS px 阈值后的选中；拖 ↻ 验证旋转及 pointer capture，读取实际 CSS 确认 16 CSS px 纯黑无圆底图标和 44 CSS px 透明 target。
- 在不同 field scale / map zoom 下检查上边缘旋转手柄间距与命中；用 wheel 分别 zoom-in、zoom-out、到上下限后的 no-op，再 pan，并检查固定鼠标锚点及 slide outgoing floor。每次真实指针输入前刷新位置、确认 `elementFromPoint` 命中；已有存档 modal 的处理需先确认，不以脚本绕过鼠标验收。
- 本 offhand 仅验证六段模板、顶部插入、旧内容逐 byte 保留、仅 WORKLOG dirty、index 空、HEAD 不变及 `git diff --check -- WORKLOG.md`；未运行功能测试、lint、typecheck、build、full suite 或浏览器。文档证据保存在 `/tmp/army-offhand-task_ebd80cc7dd1e/`，临时报告可能被系统清理。

## 交接单 · 2026-10-03 21:58 CST · Codex CLI

### 本次目标

为 Coat of Arms / Family Crest 工具替换经用户审核的六类盾牌素材，完成独立验收并合并到本地 main；本次按 offhand 记录交接。

### 已完成

- 234 个 SVG：Shield 111、Heater 24、French 36、Banner 32、Round 19、Lozenge 12；同步目录、渲染和相关测试，共 242 个路径。Shield 的 111 个几何形状经检查均不同，36 个审核样稿与对应最终 SVG 像素一致。
- 主要集成文件是 `src/lib/coat-of-arms/reference-catalog.ts`、`src/lib/coat-of-arms/shield-material-catalog.json`、`src/lib/coat-of-arms/scene-svg.ts`，另外 5 个变更路径为相关测试。
- 素材提交 `e650989fe136adc6cddec6ac96a474c96d72a5e4`；合并提交 `a3d1ad2cfa000d281cf2250437d0a410f18d0a80`。未 push、未部署。交接时本地 main 为 `66b464c1f0969411ba382625a3ebe63b4ca57c79`；后续其他任务的提交不属于本次盾牌验收范围。
- 在 main 的 `a3d1ad2` 上独立验收：9 个相关测试文件、271 项通过；TypeScript 检查通过；Lint 0 错误、6 个原有警告。静态检查 234/234 SVG、透明角与素材 HTTP 内容通过。
- ego-browser 实际验证英中页面、六类盾牌及 shield-108、Azure 换色、撤销/重做、透明 PNG 导出。两个下载均为 1024×614 RGBA，SHA256 为 `4d7470fb870b2061a5429f02d94927b3076bc48358595289b186ec70fbc3b453`。
- 本次合并 Run `run_470528f06a29` 的 5 个 Codex Worker 已结算并关闭，浏览器 TaskSpace 43 已关闭；40001 服务在验收时保留。

### 做到一半

无。盾牌实现与合并已经完成。用户表示自行删除 `coat-shields-refresh` 工作树，是否实际删除未核对；本交接不执行删除。

### 下一步

下一班用 `$pickup` 读取本条，先核对实际 main、工作区和并行任务状态。若需确认工作树清理，先只读查看 Orca 状态；后续修改、推送或部署须另按用户授权范围执行。本交接单保留为未提交的 `WORKLOG.md` 修改。

### 踩过的坑

- 原素材根 SVG 的 width/height 与场景嵌入属性重复会破坏 XML/PNG，已修复；不可重新引入重复属性。
- 旧自定义 paint-key 草稿的兼容迁移未纳入本次范围，用户草稿未修改。
- 完整构建此前在 `/api/share` 因 `cloudflare:workers` 解析失败；在素材改动前的基线也复现。最终合并阶段未重跑完整构建，不可将局部检查称为全构建通过。
- PNG 与直接栅格化的 DOM SVG 存在抗锯齿差异：7009 个像素不同、最大 alpha 差 106；轮廓与色块边界误差在 1px 内，差异未超出 2px 边缘带，内部色块一致。这不等于 PNG 与参考逐像素相同。
- main 有其他协调者的串行写入窗口；本交接仅在明确移交的文档窗口写入，保留旧 WORKLOG，不重写其他任务的记录。

### 怎么验证

- 已有真实证据：`/tmp/coat-shields-merge-review.md`、`/tmp/coat-shields-merge-review.json`、`/tmp/coat-shields-merge-browser.md`、`/tmp/coat-shields-merge-browser.json`、`/tmp/coat-shields-merge-feature-commit.md`、`/tmp/coat-shields-merge-main.md`。这些临时文件可能在系统清理后消失。
- 需要重新检查代码时，在确认正确工作区后运行：
  `pnpm exec vitest run src/lib/coat-of-arms/shield-material-paints.test.ts src/lib/coat-of-arms/reference-catalog.test.ts src/lib/coat-of-arms/assets.test.ts src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/export.test.ts src/lib/coat-of-arms/layer-colours.test.ts src/lib/coat-of-arms/commands.test.ts src/components/coat-of-arms/SelectedElementColourStrip.test.tsx src/components/coat-of-arms/TargetShieldPalette.test.tsx`
  `pnpm exec tsc --noEmit --incremental false`；`pnpm lint`。
- 浏览器检查 `http://localhost:40001/coat-of-arms-maker` 与 `http://localhost:40001/zh/coat-of-arms-maker`：选六类盾牌及 shield-108，先选中画布盾牌层再换 Azure，检查撤销/重做及透明 PNG 导出。原验收使用独立 origin `http://shield-merge-470528.localhost:40001`，避免读取或覆盖默认 localhost 的用户草稿。
- 本次 offhand 只校验交接单的插入位置、旧条目保留、WORKLOG 单文件差异及 Git HEAD/暂存区不变；不重跑代码或浏览器验收。

## 交接单 · 2026-10-03 19:26 CST · Codex CLI

### 本次目标

按用户确认将 army-bg-download 的卡片下载按钮顺序改动提交合入本地 main，并清理已合并的 army-bg-download/军阵组件工作树、分支和目标终端；本次 offhand 仅写交接记录。

### 已完成

- 功能提交 `317b4851f13753646fc1704a35ceb784ed93a5d5` 已由合并提交 `a1f9e346634a6dc07778ce4d72b6a334ef568542` 合入 main；父提交依次为 `8f29d81f6ac08c17ebf6a76ce3738359b06c3b75` 和 `317b4851f13753646fc1704a35ceb784ed93a5d5`。相对首父只改 `ArmyBackgroundGalleryExplorer.tsx`，9+/9-；下载按钮移到查看来源前并移除 `ml-auto`，测试文件与父提交相同。
- `army-bg-download` 与 `军阵组件` 两个目标的 Git/Orca 工作树绑定、本地分支和目录均已移除；对应两批目标终端回执分别为 `closed=2/stopped=2`。`coat-shields-refresh` 与 `新工具-1` 保留。
- 本次按用户确认不存档：原有 `WORKLOG.md` 未提交内容保留，新交接记录不提交。

### 做到一半

无本目标未完成的实现、合并或清理；现有 WORKLOG 改动保持未存档。

### 下一步

本目标无待办。下一班先用 `$pickup` 核对实际 HEAD、WORKLOG 和工作树清单；远端同步或部署需新的明确授权。

### 踩过的坑

- main 在期间从 `705844817903edefca0a92e09e1dcdfe1e24a56b` 变为 `8f29d81f6ac08c17ebf6a76ce3738359b06c3b75`；Git 回读确认后者以此前者为父且只改 `WORKLOG.md`，本次予以保留。
- 普通 merge 曾因仅 `ArmyBackgroundGalleryExplorer.tsx` 冲突而 exit 1；之后只按授权使用 `317b485` 的该文件内容解决。不要按 Git author/committer 字段推断提交执行者，也不要复用旧 Dispatch ID。
- Orca 标记为 retained/user-owned 的资源不能默认关闭；仅在目标工作树移除已获授权后精确关闭对应终端。

### 怎么验证

- 合并回读：`git show -s --format='%P' a1f9e346` 返回上述两个父；`git diff --name-status 8f29d81 a1f9e346` 仅列 `ArmyBackgroundGalleryExplorer.tsx`，numstat 为 `9 9`。
- 清理回读：`git worktree list --porcelain`、`orca worktree list --repo id:842aae27-292d-4b29-b767-e486603a93f2 --json`、两个目标的 `git branch --list` 和目录存在性检查均确认目标不在；本 Run 报告记录精确终端关闭回执。
- 合并前验证（不是合并后重跑）：定向 ESLint exit 0；Vitest 1 文件、8 测试通过；`pnpm typecheck` exit 0。
- 独立合并后 Git 复核为 8 passed、0 failed、0 required UNVERIFIED。Ego Browser 在 main 的 40001 服务上检查中/英文桌面与移动 4/4；每场景首 12 张卡片，共 48 次卡片观察（同一批素材，不是 48 张不同素材）及首预览 4/4 通过，核对下载/来源顺序、本地图片链接与文件名、语言文案、无重叠和横向溢出。
- 合并后未重跑测试、lint、typecheck 或 build；原生文件下载传输及外部来源响应未触发，仍未验证；未 push/部署。当前 40001 由 PID 99153 的 `next-server (v16.3.3)` 提供，cwd 为本仓库，予以保留。
- 真实报告：`/tmp/army-background-shuffle-release/{download-conflict-completion,download-integration-review,download-integration-ui,download-merge-preparation,military-cleanup,military-cleanup-review}.{md,json}`。

## 交接单 · 2026-10-03 18:27 CST · Codex CLI

### 本次目标

更新 Army Background Gallery 下载功能的交接状态，记录合并、`army-bg-download` 清理结果及验证证据。用户对 offhand 选择不存档；本次只替换本交接单，不提交。

### 已完成

- 原 offhand Task `task_3b20f1138a1f` / Dispatch `ctx_d5f0a83d4c1d` 映射正确；当前可读的原 Dispatch 命令记录未见 `git add` 或 `git commit`，但归档有 8 个工具输入被截断、`contentComplete=false`，无法证明完整记录中不存在这些命令，因此此项标记 **UNVERIFIED**。当前 HEAD 历史中有 `8f29d81f6ac08c17ebf6a76ce3738359b06c3b75`，该提交仅修改 `WORKLOG.md`；Git author/committer 字段均为“吴sir”，这些字段不能证明由谁执行提交。
- 已授权的功能提交 `317b4851f13753646fc1704a35ceb784ed93a5d5` 已由合并提交 `a1f9e346634a6dc07778ce4d72b6a334ef568542` 合入；父提交依次为 `8f29d81`、`317b485`。相对首父的差异仅为 `src/components/army-formation/ArmyBackgroundGalleryExplorer.tsx` 新增 9 行、删除 9 行。
- 合并及清理完成后、更新本交接单前，`main` HEAD 为 `a1f9e346`，工作区干净，相对 `origin/main` ahead 7。`army-bg-download` Git 工作树和本地分支已删除；Git/Orca 工作树清单均无该目标，Orca terminal list 按 worktreePath 和 worktreeId 精确筛选该目标均为 0 条绑定终端。独立复核报告 `/tmp/army-background-shuffle-release/download-integration-review.md` 记录 8 passed、0 failed、0 required UNVERIFIED；bulk close exit 0，回执为 `closed=2/stopped=2/retiredSurfaces=true`，Orca `worktree rm` exit 0、`removed=true`。`coat-shields-refresh` 和 `新工具-1` 工作树仍保留。
- 合并前功能证据见 `/tmp/army-background-shuffle-release/download-merge-preparation.md`：定向 ESLint exit 0；Vitest 1 个文件、8 个测试通过；`pnpm typecheck` exit 0；Ego Browser 中文/英文桌面与移动共 4 个场景通过，每个场景检查 12 张卡片。

### 做到一半

- 合并和工作树清理均已完成。合并后没有重跑测试、构建或浏览器验收，因此没有合并后功能验证证据。

### 下一步

- 无待完成的合并或清理工作。如需合并后验证，应另行运行定向测试、构建或浏览器检查，并将结果与上述合并前证据区分记录。

### 踩过的坑

- `8f29d81` 的 author/committer 字段只记录 Git 元数据，不能据此推断提交执行者，也不能把提交归因于 offhand Dispatch。
- 修正标签的 Dispatch `ctx_073b93f55d5a` 预检曾运行 `git write-tree`（exit 0）来获取基线；其 worker_done 报告和本次实际回读均确认暂存 diff 为空、HEAD 仍为 `a1f9e346`，未提交。
- 合并前测试、类型检查和浏览器结果不代表合并后重验；本次范围内没有运行测试、构建或浏览器。

### 怎么验证

- 合并关系：`git show -s --format='%P' a1f9e346` 返回 `8f29d81` 与 `317b485`；`git diff --numstat a1f9e346^1 a1f9e346` 仅列出 `ArmyBackgroundGalleryExplorer.tsx` 的 `9 9`。当前 HEAD 为 `a1f9e346`，相对 `origin/main` ahead 7。
- 清理状态：`git worktree list --porcelain` 和 `orca worktree list --repo id:842aae27-292d-4b29-b767-e486603a93f2 --json` 不含 `army-bg-download`；`git branch --list army-bg-download` 无匹配；使用 `orca terminal list --json`，并按目标 worktreePath 或 worktreeId 精确过滤，结果为 0。清理回执和 8 项独立复核见 `/tmp/army-background-shuffle-release/download-integration-review.md`。
- 合并前验证命令：`pnpm exec eslint src/components/army-formation/ArmyBackgroundGalleryExplorer.tsx src/components/army-formation/ArmyBackgroundGalleryExplorer.test.tsx`（exit 0）；`pnpm exec vitest run src/components/army-formation/ArmyBackgroundGalleryExplorer.test.tsx`（1 个文件、8 个测试通过）；`pnpm typecheck`（exit 0）。Ego Browser 检查 `/army-formation-creator/backgrounds` 与 `/zh/army-formation-creator/backgrounds` 的桌面和移动场景；这些均为合并前报告记录，本次未重跑。
- 本次文档验收：`git diff --check -- WORKLOG.md` exit 0；`git diff --name-only` 仅为 `WORKLOG.md`，`git status --short --branch` 仅显示本文件修改（main ahead 7）；不提交。

## 交接单 · 2026-10-03 17:36 CST · Codex CLI

### 本次目标

将 Army Formation Creator 的角度和高度自动应用/重置改动合入 main，删除已合并的“军阵组件”工作树，同时保留其他工作树的本地改动。

### 已完成

- 功能提交 `c80072d4262d704df2e6efe3b752fc77dddd6814` 已由合并提交 `1f81259fd0d1bdcdd4cbe9e97b116c684f49ecd8` 合入 main；当前 main 为 `705844817903edefca0a92e09e1dcdfe1e24a56b`。
- 用户选择 A 后，Orca 工作树 `/Users/wusir/orca/workspaces/token-maker-app/军阵组件` 和本地 `refs/heads/军阵组件` 已删除。独立核对确认路径不存在、Git 工作树清单不含该路径、Orca 精确查询返回 `selector_not_found`、`git show-ref --verify` 返回 128（ref 不存在）。清理协调者报告目标下两个空闲终端已关闭。
- main 当前干净；写入本交接单前，暂存区、未暂存区和未跟踪文件均为空。本交接单不提交。
- `army-bg-download` 保留在 `333c7cd56d8f9a7d553055d81d4a85bd5bf68996`，仍有 `ArmyBackgroundGalleryExplorer.tsx` 修改和对应测试文件未跟踪；两文件 SHA-256 与保护基线一致。`coat-shields-refresh` 仍存在。
- 本次清理只做了状态核对，没有运行测试、构建或浏览器验收。

### 做到一半

- `army-bg-download` 的独立只读核查仍在进行：Run `run_3c88f7f2966e`，Dispatch `ctx_453851870675`。它被 Orca 标为 `user_owned/retained`，不要关闭或向其工作树写入；等待核查结果并确认本地改动未变化。
- 本 Run 的只读审计 Dispatch `ctx_5b4a3b1a88fa` 已完成，但终端为 `user_owned/retained` 且状态陈旧，不能由当前协调者关闭。清理 worker `ctx_87d29a64024a` 已 `already_released`，执行记录已归档。

### 下一步

等待 `army-bg-download` 只读核查完成；只记录核查结论，不提交或修改该工作树的本地文件。军阵组件合并和清理已完成，无需再次操作。

### 踩过的坑

- Orca `worktree rm` 可能连带删除工作树检出的本地分支；本次用户明确授权删除已合并的同名分支。下次清理必须重新核对具体路径、分支、干净状态和用户授权。
- `army-bg-download` 有未提交的源码和测试改动，必须保留。Orca 标为 `user_owned/retained` 的终端不能由当前协调者关闭。
- 本次 `git show-ref --verify` 的 128 和 Orca `selector_not_found` 是目标分支/工作树已删除时的预期结果。

### 怎么验证

- 核对 main：`git -C '/Users/wusir/Desktop/开发项目集合/token-maker-app' status --short` 应为空；`git -C '/Users/wusir/Desktop/开发项目集合/token-maker-app' rev-parse HEAD` 应为 `705844817903edefca0a92e09e1dcdfe1e24a56b`。
- 核对清理：`git -C '/Users/wusir/Desktop/开发项目集合/token-maker-app' worktree list --porcelain` 不应含 `军阵组件`；`git -C '/Users/wusir/Desktop/开发项目集合/token-maker-app' show-ref --verify refs/heads/军阵组件` 应报告 ref 不存在；`orca worktree show --worktree 'id:842aae27-292d-4b29-b767-e486603a93f2::/Users/wusir/orca/workspaces/token-maker-app/军阵组件' --json` 应返回 `selector_not_found`。
- 核对受保护改动：检查 `army-bg-download` 的 `git status --short`，并对两个 `ArmyBackgroundGalleryExplorer` 文件运行 `shasum -a 256`；核对值应分别为 `78ce59ad8e58e481b93d2e2e573da803dafe0a684464e1fc9bdf593e611fce75` 和 `54156e54995e566c639e58b0b7ae7909ed4d04ecbc84e8122c487bff0e3c632a`。
- 若需重验功能：运行 `pnpm exec vitest run src/components/army-formation/ArmyFormationCreator.test.tsx src/lib/army-formation/copy.test.ts`；在 `/army-formation-creator` 和 `/zh/army-formation-creator` 中分别修改角度/高度，再使用重置按钮确认恢复默认值。

## 交接单 · 2026-10-03 10:05 CST · Codex CLI

### 本次目标

在 Armor Creator 页面 How to Use 上方增加中英文功能介绍，将正文扩充到约 900 词并使 “armor creator” 密度接近 3%；提交并合并到本地 main，完成验证后删除对应隔离工作树。

### 已完成

- 新增六卡功能介绍组件 ArmorCreatorFeatureGrid.tsx，补充中英文文案；页面顺序为案例展示、功能介绍、How to Use。
- 文案审计为 904 词，精确词组 “armor creator” 出现 25 次，密度约 2.77%。
- 功能提交 acb41cb2 已合入，合并提交为 896d2076；独立审核确认合并仅涉及四个目标文件。
- 合并后 Vitest 1 个文件、4 个测试通过；相关 ESLint 退出码为 0。合并前的 typecheck 退出码为 0。此前 Ego Browser 检查过中英文页面顺序、六张卡片和横向溢出；浏览器检查发生在最后文案调整之前。
- 指定工作树 /Users/wusir/orca/workspaces/token-maker-app/armor-feature-grid-current 已删除；Orca 清单回查目标匹配数为 0。合并提交和功能提交仍是 main 的祖先。
- 当前 main HEAD 为 333c7cd，和 origin/main 状态一致。当前未提交改动仅在 WORKLOG.md，包含其他已存在的交接单；按用户要求保留。此次合并和清理没有执行 push 或部署。

### 做到一半

Armor Creator 功能、合并和工作树删除均已完成。一个已完成的审查 agent 终端 term_e8cdb275-2925-454f-a061-c44d322ee610 被 Orca 标为 user_takeover、归用户所有，因此保留；当前没有 active 或 reclaimable 的 agent 终端。

### 下一步

无待完成的 Armor Creator 工作。若要继续，由下一班先核对当前 main 和工作区状态，再使用 $pickup 接手；不要关闭归用户所有的审查终端。

### 踩过的坑

- Vitest 输出两条 HTMLCanvasElement.getContext() 未实现提示，但测试仍以退出码 0 通过。
- 既有 pnpm build 曾在 /api/share 处因缺少 cloudflare:workers 失败；本次合并后没有重跑 build。
- 合并时 main 上存在其他连接终端；用户知情并明确要求继续。后续操作应保留与本次 Armor Creator 无关的工作区内容。

### 怎么验证

- pnpm exec vitest run src/components/armor-creator/ArmorCreatorPageHeading.test.tsx：退出码 0，1 个文件、4 个测试通过。
- pnpm exec eslint src/components/armor-creator/ArmorCreatorFeatureGrid.tsx src/components/armor-creator/ArmorCreatorPageView.tsx src/components/armor-creator/ArmorCreatorPageHeading.test.tsx src/lib/armor-creator/copy.ts：退出码 0。
- pnpm typecheck：合并前退出码 0。
- git merge-base --is-ancestor 896d2076b2ff3753e67765fc2fe79bc4852935b4 main 与 git merge-base --is-ancestor acb41cb232df8b27bee1489dcef32a1992ad54b4 main：均退出码 0。
- orca worktree list --repo id:842aae27-292d-4b29-b767-e486603a93f2：指定 identity/path 匹配数为 0。
- Ego Browser 曾检查 /armor-creator 和 /zh/armor-creator 的区块顺序、六张卡片和横向溢出；最后文案调整后未重新检查。

## 交接单 · 2026-10-03 10:03 CST · Codex

### 本次目标

核对 Army Formation Creator 中文关键词翻译和路由测试，并确认 Armor Creator 中文页是否也残留英文关键词。

### 已完成

- `src/lib/army-formation/page-copy.ts` 的中文功能介绍和对比表产品名均使用“军队阵型制作器”；提交 `54949fd` 包含这两处文案修改。
- `src/app/army-formation-creator-routes.test.tsx` 的菜单名称断言已与当前导航文案一致，修改包含在 `333c7cd`。运行 `pnpm exec vitest run src/app/army-formation-creator-routes.test.tsx`，退出码 0，1 个测试文件、2/2 项测试通过。
- Ego Browser 检查 `/zh/armor-creator`：比较模块标题和表格产品列各显示一次 `Armor Creator`。对应中文文案位于 `src/lib/armor-creator/copy.ts` 的 `zh.title` 和 `zh.armorCreatorHeading`。
- 用户选择不存档。本交接单不提交。写入前复查时，`main` 与 `origin/main` 均为 `333c7cd`；除 `WORKLOG.md` 外没有其他工作区改动、暂存文件或未跟踪文件。

### 做到一半

护甲中文页比较模块中的两处 `Armor Creator` 尚未翻译；本次没有修改护甲页面文案。

### 下一步

如用户希望统一中文关键词，先确认“Armor Creator”在该比较模块中的目标译法，再只修改 `src/lib/armor-creator/copy.ts` 的中文比较标题和产品列，并核对中文页面显示；英文文案保持原样。

### 踩过的坑

- 路由测试之前的失败与菜单可访问名称不一致有关；当前断言已更新，定向测试通过，不代表页面功能故障。
- 检查过程中工作区状态发生变化：稍早看到的 6 个测试文件修改之后已包含在 `333c7cd`，当前只剩未提交的 `WORKLOG.md`。不要据早先状态推断当前仍有 6 个未提交文件。
- 不要提交 `WORKLOG.md`；本次选择是不存档。

### 怎么验证

- `pnpm exec vitest run src/app/army-formation-creator-routes.test.tsx`：退出码 0，1 个文件、2/2 项测试通过。
- Ego Browser 打开 `http://localhost:40001/zh/armor-creator`：比较模块标题及表格产品列各有一处 `Armor Creator`，页面其他主要关键词使用“护甲搭配工具”。

## 交接单 · 2026-10-03 10:02 CST · Codex CLI

### 本次目标

查明 Token Maker 线上未同步的原因，处理 Cloudflare 构建流水线中阻断发布的测试失败。

### 已完成

- 用户提供的 Cloudflare 构建日志显示 `pnpm test` 有 12 项失败。`build:vinext` 通过 `&&` 串联，因此后续 Workers 类型检查、vinext 构建及 Wrangler dry-run 没有执行。
- 更新 6 个测试文件中的过期导航文案和按钮样式断言；Playwright Chromium 或外部英文文章源文件缺失时，相关用例明确跳过，资源存在时仍执行。
- 聚焦验证：6 个文件、179/179 测试通过。完整 `pnpm run build:vinext` 退出码 0：199 个测试文件、2029/2029 测试通过；lint 0 error、6 warnings；typecheck、Workers 类型检查、vinext 构建及 Wrangler dry-run 均通过。
- 当前 `main`/`origin/main` 为 `333c7cd`；`git ls-remote origin refs/heads/main` 读回同一哈希，且该提交包含上述 6 个测试文件改动。

### 做到一半

尚未核实 Cloudflare 上 `333c7cd` 对应的正式部署是否成功，也没有检查线上页面是否已更新。本地 Wrangler 命令是 dry-run，不代表生产部署完成。

### 下一步

- 下一班输入 `$pickup` 接手。
- 在 Cloudflare Workers Builds 中核对 `333c7cd` 的构建与部署记录，再检查生产域名的目标页面内容是否更新。
- 若没有对应构建或部署失败，读取该次 Cloudflare 日志并核实连接的仓库、分支和 Worker；不要把本地 dry-run 当成线上证据。

### 踩过的坑

- 原 Cloudflare 日志中的测试失败会短路整个 `&&` 构建命令；安装阶段完成不代表应用构建或发布完成。
- CI 没有 Playwright Chromium，也没有本机外部文章源文件；条件缺失的测试已改为显式跳过，其他测试继续执行。
- 先前的 Wrangler deployments API 查询返回错误码 10007（Worker does not exist on your account），当时未能据此确认线上部署状态。

### 怎么验证

- `pnpm exec vitest run --reporter=dot src/app/army-formation-creator-routes.test.tsx src/app/site-routes.test.tsx src/components/army-formation/ArmyFormationCreatorPageHeading.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/CanvasSelectionHandles.test.tsx src/lib/blog/dnd-schools-of-magic.test.ts`：6 个文件、179/179 通过。
- `pnpm run build:vinext`：退出码 0；199 个文件、2029/2029 测试通过，Workers 类型检查、vinext 构建及 Wrangler dry-run 成功。
- 线上验收：Cloudflare 对 `333c7cd` 的部署状态成功；生产域名返回预期更新内容。此项尚未验证。

## 交接单 · 2026-10-02 20:47 CST · Codex CLI

### 本次目标

修复 Armor Creator 英文页缺少 What Is、How To Use、Comparison 和 FAQ 内容的问题，并将改动合并到本地 main。

### 已完成

- `src/components/armor-creator/ArmorCreatorPageView.tsx` 现在为中英文渲染 What Is、Features、How To Use、Comparison 和 FAQ 区块。
- `src/lib/armor-creator/copy.ts` 补充英文 Comparison 文案；`src/components/armor-creator/ArmorCreatorPageHeading.test.tsx` 覆盖英文区块、步骤、表格、FAQ 和区块顺序。
- 提交 `0a3223f`（`fix: localize Armor Creator sections`）已快进合并到本地 main，只包含上述 3 个文件。
- 验证通过：定向 Vitest 1 个文件、4 项测试；ESLint 退出码 0；`pnpm run typecheck` 退出码 0。Ego Browser 检查了 `http://localhost:40002/armor-creator` 和 `http://localhost:40002/zh/armor-creator`，两种语言的内容均可见。
- Orca 的 `18n` 工作树和本地分支已删除。没有 push 或部署。

### 做到一半

代码修改与本地合并均已完成。根目录 `AGENTS.md` 有一项未提交的多语言规则修改；用户选择不存档，因此保留原样。本交接单写入后也不提交。

### 下一步

无。main 比 origin/main 超前 4 个提交；远端同步和部署均未执行。

### 踩过的坑

英文页的下方内容原先被 `locale === 'zh'` 条件包住；英文 Comparison 文案也缺失。合并时保留了 `AGENTS.md` 的未提交修改。

### 怎么验证

- `pnpm exec vitest run src/components/armor-creator/ArmorCreatorPageHeading.test.tsx`：1 个文件、4 项测试通过。
- 对 `ArmorCreatorPageView.tsx`、`ArmorCreatorPageHeading.test.tsx` 和 `copy.ts` 运行 ESLint：退出码 0。
- `pnpm run typecheck`：退出码 0。
- 在 Ego Browser 打开英文 `/armor-creator` 和中文 `/zh/armor-creator`，确认 What Is、How To Use、Comparison、FAQ 内容可见。

## 交接单 · 2026-10-02 16:46 CST · Codex CLI

### 本次目标

调整 Armor Creator 案例轮播的后层图片位置，让插画露出更多；用户限定只改图片堆叠。

### 已完成

- `src/components/armor-creator/circular-testimonials.tsx` 扩大响应式后层图片偏移；图片舞台宽 320、440、560 px 时偏移分别为 80、110、140 px。`src/components/armor-creator/circular-testimonials.test.tsx` 同步更新断言。这两项目前在 HEAD `13d7c43` 中，`main` 比 `origin/main` 超前 1 个提交。
- 聚焦测试 21/21 通过，ESLint 退出码 0，`git diff --check` 通过。
- 按用户选择不存档。当前工作区有 3 个未提交改动：`ArmyFormationCreator.tsx` 给表单输入控件增加 `cursor-pointer`；`ArmyFormationCreatorPageHeading.tsx` 给主按钮增加 `cursor-pointer`；Army Formation 的 `CircularTestimonials.tsx` 给前后按钮增加 `cursor-pointer`。当前无暂存或未跟踪文件；不要提交或 push。

### 做到一半

- Ego Browser 打开 `http://localhost:40001/zh/armor-creator`，确认两个轮播和 600×500 图片资源已加载；1440 px 浏览器视口下，图片舞台宽 412 px，DOM 偏移为 103 px。`Page.captureScreenshot` 多次超时，因此叠放后的实际视觉效果尚未截图确认。
- 上一轮 `pnpm typecheck` 在当时的工作区失败，报 `setBackgroundImage` 不在 `ArmyFormationCreatorCopy` 类型中。当前 HEAD 的 `src/lib/army-formation/copy.ts` 已包含该字段，但新状态尚未重跑 typecheck。

### 下一步

- 先保留上述 3 个未提交文件，不要提交或 push。
- 重跑 `pnpm typecheck`，确认当前 HEAD 和工作区是否还有类型错误。
- 用本地 Ego Browser 打开 `/zh/armor-creator` 检查后层插画是否清楚露出；截图接口仍失败时，明确报告视觉截图未验证，不要把 DOM 检查当作截图验收。

### 踩过的坑

- 仓库已有 Next dev server 使用 40001；再开一个 `next dev` 会因 `.next` 开发锁退出。不要杀掉现有服务或重启它。
- Ego Browser 的 `Page.captureScreenshot` 和裁剪截图调用均超时；页面导航和 DOM 检查可用。
- 上一轮 typecheck 错误对应的 `setBackgroundImage` 字段已在当前 HEAD 的 copy 类型中，旧错误不能直接当作当前结果。

### 怎么验证

- `pnpm exec vitest run src/components/armor-creator/circular-testimonials.test.tsx`：上一轮 21/21 通过。
- `pnpm exec eslint src/components/armor-creator/circular-testimonials.tsx src/components/armor-creator/circular-testimonials.test.tsx`：上一轮退出码 0。
- `pnpm typecheck`：对当前状态重跑；上一轮结果已过时。
- Ego Browser 打开 `http://localhost:40001/zh/armor-creator`，检查桌面和窄屏下主图两侧的后层图案是否可辨、页面是否横向溢出。截图捕获恢复前，视觉确认记为未验证。

## 交接单 · 2026-09-30 21:18 CST · Cursor

### 本次目标

护甲制作器：把「左右肩对称」「胸甲曲线」「清空」「下载图片」放到右侧预览的套装按钮下面，四格撑满那一行。上面「男 / 女」各占半行，「板甲 / 皮甲 / 布甲」三格撑满下一行。用户最后说预览里的人物没了，点击也没反应。未存档。

### 已完成

- 未提交。用户 2026-09-30 21:17 CST 回复「不要」存档。`git status --short` 有改动：`WORKLOG.md`，以及下面 4 个文件。`git diff --stat`：4 个护甲文件合计 242 行新增、164 行删除。不要把 `WORKLOG.md` 加进提交。
- `src/components/armor-creator/ArmorPickerHeader.tsx`：`ArmorPickerHeader` 只渲染两行。第一行 `grid grid-cols-2 gap-2`，男、女按钮 `w-full`。第二行 `grid grid-cols-3 gap-2`，板甲、皮甲、布甲按钮 `w-full`。
- 同文件导出 `ArmorPickerActions`：`grid grid-cols-4 gap-2`，四个按钮都是 `w-full`，顺序是左右肩对称、胸甲曲线、清空、下载图片。
- `src/components/armor-creator/ArmorCreatorWorkbench.tsx`：这四个按钮从选择区拿掉，放在 `ArmorPreview` 里，套装槽 `ArmorPreviewOutfitSlots` 的下面。
- 2026-09-30 08:25 CST 跑过 `npx vitest run src/components/armor-creator/ArmorPickerHeader.test.tsx src/components/armor-creator/ArmorCreatorWorkbench.test.tsx`：2 个文件、27 个测试通过。接着对这 4 个改过的文件跑 `npx eslint`，退出码 0。
- 同一时刻用 ego-browser 在 1440×1000 打开 `http://127.0.0.1:40001/zh/armor-creator`，读到的位置：男 left 114 right 397，女 left 405 right 688；板甲、皮甲、布甲各宽 186，布甲 right 688；套装 1 left 712，套装 4 right 1312；四个操作按钮 top 1744，左右肩对称 left 712，下载图片 right 1312，都在预览区内。这次没有看画布上有没有人物。

### 做到一半

- 用户 21:13 发来页面截图，预览大块是空的米色，并说人物没了、点击处理不了。还没核对原因。
- 21:14 查 `lsof` 时 40001 没有在听。21:15 看到新的 `next dev --port 40001` 进程。随后 `curl http://127.0.0.1:40001/zh/armor-creator` 返回成功。接着用 ego-browser 量画布像素和点「头盔 1」，命令被用户打断，没有结果。
- 绘制仍走 `ArmorCreatorWorkbench` 里的 `drawArmorLayers`。这次改动没有改这个绘制函数。`public/armor-creator/male/body.png` 和 `public/armor-creator/female/body.png` 都在，时间是 9 月 27 日。

### 下一步

- 下一班在项目根输入 `/pickup` 接手。
- 先在 `http://localhost:40001/zh/armor-creator` 看预览里有没有身体，再点一个部件，看按钮 `aria-pressed` 和画布是否变化。页面上若有 `role="alert"`，记下原文。
- 人物和点击恢复之前，不要再改按钮布局。
- 不要提交，除非用户另外说要存档。不要 push。不要把 `WORKLOG.md` 加进提交。

### 踩过的坑

- 四个按钮先被放到左侧部件格子下面，用户指出箭头是预览下方。后又被放回选择区顶部。用户要的是：四个按钮留在套装下面；上面只把男、女和三种材质撑满各自的行。
- 四个按钮曾经缩在套装下面左侧，没有撑满预览宽度。
- 上一张交接单写过：开发脚本要用 `localhost`，不要用 `127.0.0.1`。用户这次截图地址是 `http://127.0.0.1:40001/zh/armor-creator`。这次没有再验证 Next 会不会拦住这个地址。
- 40001 上已经有 `next dev` 时，不要再开一个，也不要杀掉现有进程。

### 怎么验证

- 布局：`npx vitest run src/components/armor-creator/ArmorPickerHeader.test.tsx src/components/armor-creator/ArmorCreatorWorkbench.test.tsx`
- 页面：打开 `http://localhost:40001/zh/armor-creator`。上面第一行只有男、女，第二行只有板甲、皮甲、布甲，三格一样宽。预览下面先是套装 1 到套装 4，再是左右肩对称、胸甲曲线、清空、下载图片，四格和套装左右对齐。预览里要有人物。点「头盔 1」后，按钮变为按下，人物上出现头盔。

## 交接单 · 2026-09-30 07:47 CST · Grok CLI

### 本次目标

军阵制作器改成自动保存到这个浏览器。打开页面时，如果有上次记录，先问要不要回到上次；选「从空白开始」就立刻删掉记录。完成后把未提交改动提交到 main，并删除「军阵」工作树。不推送。

### 已完成

- main 上的新提交是 `f67288a`，说明是 `fix(army-formation): center the restore prompt and clear a bad save`。只包含 `src/components/army-formation/ArmyFormationCreator.tsx` 和 `src/components/army-formation/ArmyFormationCreator.test.tsx`，25 行新增、8 行删除。
- 2026-09-30 07:47 CST 核对：工作区干净，HEAD 是 `f67288a`，main 比 `origin/main` 超前 32 个提交。没有 push。
- 保存钥匙是 `tokenmaker.army-formation-creator.document`。有非空记录时，中文问「发现上次的记录。要回到上次的记录吗？」，按钮是「回到上次」「从空白开始」；英文是 “A previous record was found. Restore it?”，按钮是 Restore、Start blank。「从空白开始」会删掉钥匙，不写入空白 JSON。坏档把原文显示出来，不弹出恢复询问。导出文件、导出图片不会清掉坏档警告；导入空白文档会清掉警告并删掉钥匙。
- 询问框是视口固定层：外层 `fixed inset-0 z-[60] bg-black/60`，卡片 `bg-[var(--card)]`。
- 提交前在同一份改动上跑过 `pnpm exec vitest run src/components/army-formation/ArmyFormationCreator.test.tsx src/lib/army-formation/copy.test.ts src/lib/army-formation/browser-saves.test.ts`：3 个文件、34 个测试通过，开始时间 00:06:09，用时 1.70 秒。提交后没有重跑。
- 在已有的 `http://localhost:40001` 上用 ego-browser 走过中文和英文：摆头盔、刷新、回到上次、换战场、从空白开始、再刷新、导出文件 `army-formation-creator.txt`、导出图片 `army-formation-creator.svg`、坏档原文、导入空白文档。1600×1000 和 390×844 上，询问框的文字和两个按钮都在屏幕内，卡片背景不透明。
- `/Users/wusir/orca/workspaces/token-maker-app/军阵` 已用 `git worktree remove` 删除。`git worktree list` 只剩桌面 main。分支名「军阵」还在，指向 `f6b6c4c`。

### 做到一半

无。这次要求的自动保存、提交和删除工作树都已做完。

### 下一步

- 下一班在项目根输入 `/pickup` 接手。
- 不要自动 push 或部署。
- 不要删除本地分支「军阵」，除非用户另外要求。
- 不要把 `WORKLOG.md` 加入提交，除非用户另行授权。
- 历史里 `d76e685`、`0bc14a8`、`7b83a4b` 的提交说明是 `1`。它们和护甲、页面标题提交夹在一起，没有改写历史。

### 踩过的坑

- 页面地址要用 `localhost`。用 `127.0.0.1` 时，Next 会拦住开发脚本。
- 这个目录里已经有 `next dev` 占着 40001 时，再开一个会立刻退出。不要杀掉 40001 上的进程。
- `orca worktree rm` 会尝试删除工作树对应的本地分支。这次只执行了 `git worktree remove`，分支「军阵」还在。
- 深色主题的 `--site-panel` 是 `rgba(255, 255, 255, 0.03)`。询问框若用这个背景并盖在英雄区上，后面的「免费试用」或 Try for Free 会透进按钮。
- 询问框原先是 `absolute inset-0`，盖住整块编辑器。英雄区把编辑器顶下去后，1000 像素高的屏幕里按钮在首屏下面。

### 怎么验证

- `git status --short --branch`
- `git show --stat --oneline f67288a`
- `git worktree list`
- `git branch --list 军阵`
- `pnpm exec vitest run src/components/army-formation/ArmyFormationCreator.test.tsx src/lib/army-formation/copy.test.ts src/lib/army-formation/browser-saves.test.ts`
- 开发服务器已在 40001 时，打开 `http://localhost:40001/zh/army-formation-creator`：摆一枚棋子，刷新，点「回到上次」，再刷新后点「从空白开始」，然后再刷新。英文页是 `http://localhost:40001/army-formation-creator`。

## 交接单 · 2026-09-29 20:51 CST · Codex CLI

### 本次目标

记录 Armor Creator 分类按钮布局调整、提交到 main，以及清理本协调者创建的 staging 工作树的最终状态。

### 已完成

- 通过 commit 9c7dedc30a089c9ba6ddf721de11d368a448cf9f（fix(armor-creator): adjust slot picker layout）提交到 main；commit 只包含 src/components/armor-creator/ArmorCreatorWorkbench.tsx，6 行新增、3 行删除。
- main 当前工作区干净，HEAD 为该 commit，main 比 origin/main 超前 18 个提交；没有 push 或部署。
- 分类布局顺序为 helm、chest、feet、legs、gloves、shoulderLeft、shoulderRight、cloak、crown、wing；已验证 1440px 为 5 列、1024px 为 3 列、390px 为 2 列，按钮等宽、标签完整、无横向溢出。
- ArmorCreatorWorkbench 测试 17 项通过：pnpm exec vitest run src/components/armor-creator/ArmorCreatorWorkbench.test.tsx；该文件 ESLint 退出码 0。
- 删除前将 armor-hd-all-staging 工作树中的 4 个已跟踪 PNG 和未跟踪 public/armor-creator/generated-highres/（删除前约 26MB、594 个未跟踪文件；连同 4 个已跟踪 PNG 合计 598 个文件）保存为 stash@{0}，对象 f9d76bf3fe52a7cf7e9e31616c01c21fb4916446；这些素材没有进入布局 commit。
- 已删除我创建的 /Users/wusir/orca/workspaces/token-maker-app/armor-hd-all-staging 工作树及 armor-hd-all-staging 分支。main、Armor-creator、第二工具工作树保留。

### 做到一半

无。当前没有进行中的 Armor 布局实现。

### 下一步

- 下一班在项目根输入 $pickup 接手。
- 不要自动 push 或部署。
- 若需要恢复旧 staging 素材，先检查后再使用 git stash apply stash@{0}；不要把它们误加入布局 commit。
- WORKLOG.md 不要加入任何提交，除非用户另行授权。

### 踩过的坑

- 共享 main 工作树会让另一个 agent 的清理操作覆盖未提交改动；本次先核对范围并由独立 Grok 实现/复核，最后才提交。
- 40001 的静态布局测量通过，但 6 个跨域客户端脚本返回 403，React hydration 和浏览器点击交互无法确认；4002 未监听，因此 4002 验收为 UNVERIFIED。
- 全项目 typecheck 退出码 2，唯一错误是范围外 src/components/army-formation/ArmyFormationCreator.test.tsx(214,50) 的 TS2493；未处理范围外错误。

### 怎么验证

- git status --short --branch
- git show --stat --oneline 9c7dedc30a089c9ba6ddf721de11d368a448cf9f
- pnpm exec vitest run src/components/armor-creator/ArmorCreatorWorkbench.test.tsx
- pnpm exec eslint src/components/armor-creator/ArmorCreatorWorkbench.tsx
- pnpm exec tsc --noEmit --pretty false --incremental false（预期仍报告上述 Army 测试的范围外 TS2493）
- 浏览器若要复核布局，使用已存在服务检查 1440、1024、390 宽度；不要因为 4002 未运行而自行启动或重启服务。

## 交接单 · 2026-09-27 13:38 CST (UTC+08:00) · Codex CLI（Grok CLI 代写）

### 本次目标

把第三阶段优化写成交接单。范围是首页作品墙的无损 WebP 展示图、PNG 原图下载、博客分类菜单的键盘焦点，以及 llms.txt 的文章链接。性能基线用户已经明确暂缓。本单只记录现状，不改功能。运行环境是 Grok CLI，按 Codex 本机 handoff skill 代写。

### 已完成

- 写入前母仓库 `/Users/wusir/Desktop/开发项目集合/token-maker-app` 的 `git status --porcelain=v1 --untracked-files=all` 为空。HEAD 是 `c0317a6b7356495e2fdb2693a5cef1ec9dc861e0`，树是 `60de7c069f387b977cfe84cf114ad67c93e48c10`，父提交是 `3d52715c682fc93b1e05ee42a3ddb008fd7e1da6`。`main` 比 `origin/main`（`a8f5adfd7634feaaf47d1bf9f8d322c0eaa5fc18`）超前 3 个提交，`git rev-list --left-right --count origin/main...HEAD` 为 `0 3`。没有 push，没有部署。这次不能写成生产环境已通过。
- 用户明确授权后提交了 64 个文件，说明是 `Optimize gallery assets, keyboard navigation, and llms coverage`。`git show --shortstat` 为 64 files changed, 804 insertions(+), 90 deletions(-)。发布记录写明暂存是 64 次精确路径 `git add`，随后 `git merge --ff-only 优化` 退出码 0。当前 HEAD 的父提交就是合并前的 `3d52715c682fc93b1e05ee42a3ddb008fd7e1da6`。本交接单不在该提交里。
- 复查时优化目录 `/Users/wusir/orca/workspaces/token-maker-app/优化` 不存在，`refs/heads/优化` 也没有。`git worktree list --porcelain` 有两条：母仓库 `main`，以及 `/Users/wusir/orca/workspaces/token-maker-app/Armor-creator` 的分支 `Armor-creator`。两边 HEAD 都是 `c0317a6b7356495e2fdb2693a5cef1ec9dc861e0`。发布记录里 `orca worktree rm` 返回 `removed: true`。这次没有再列 Orca 注册表。
- `public/work-gallery` 有 54 个 PNG 和 54 个同名 WebP。PNG 合计 51,133,146 字节，WebP 合计 20,251,820 字节，少 60.39%。展示用 WebP，下载文件仍是原来的 PNG。写入前再比过一次：`/tmp/token-maker-optimization-acceptance-en-original-download-natural.png` 与 `public/work-gallery/-CHRu5fo-1.png` 逐字节相同，586452 字节，签名 `89504e470d0a1a0a`。验收记录里的取得方式是刷新英文首页、不改页面，Tab 到下载链接后按 Enter。
- 菜单打开状态在 `src/app/globals.css` 里不再过渡 `visibility`。验收记录的冷打开是页面加载完成后，Tab 到箭头按钮，Escape 关到 `visibility: hidden`，再只按一次键。英文 `/blog` 的 ArrowDown 进入 Characters，ArrowUp 进入 Rules & Game Prep。中文 `/zh/blog` 的 ArrowDown 进入「角色」，ArrowUp 进入「规则与游戏准备」。同一轮里，菜单项上向前 Tab 会关闭菜单，Escape 把焦点还回箭头按钮。桌面和 390 宽的手机菜单也在这份验收里操作过。
- 提交里的 `public/llms.txt` 新增 24 条链接、删除 0 条。这 24 条都是文章 URL，英文 12 条、中文 12 条。当前文件有 151 条不重复 Markdown 链接，其中文章 URL 136 条：英文 68 篇、中文 68 篇，两边 slug 相同。`src/lib/llms.test.ts` 用已发布文章名单核对，缺漏、重复或名单外都会抛出具体 URL。
- 这次 64 个文件里没有字体、纹章封面或博客封面。`public` 下现有 10 个 `.woff2` 文件。验收记录抽查过 `/coat-of-arms-maker` 的 `hero-crimson-lion.webp`，以及 `/blog/dnd-ranger` 封面 `dnd-ranger-guide.webp`。
- 复测日志 `/tmp/token-maker-optimization-build-retest.log` 的命令链是 `pnpm lint && pnpm typecheck && pnpm test && pnpm check:workers-types && vinext build && pnpm check:workers-build`，由 `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm build:vinext` 启动。结束行是 `=== RETEST BUILD END exit=0 2026-09-27T04:27:12Z ===`。同一份日志有 `Test Files  170 passed (170)`、`Tests  1780 passed (1780)`、`6 problems (0 errors, 6 warnings)`、`Types at worker-configuration.d.ts are up to date.`，以及 `wrangler deploy --dry-run` 后的 `--dry-run: exiting now.`。验收记录写明这 6 条 warning 在 `src/lib/blog/index.test.ts` 第 40–45 行，是原有项。写交接单时没有重跑这条链。
- 验收记录还核对过首页编辑器：空上传区按 Enter，选中 `public/apple-touch-icon.png` 的副本后主画布出现；`+` 变成 Scale 110%，`-` 回到 Scale 100%；Shift+方向键后画布中心像素有变化；本地下载是 PNG，来源是 `blob:`。清空后按空格再次打开选择器。批量区域按 Enter 放入同一张图。没有点 Start Batch，也没有点分享。
- 没有采集 LCP、INP、CLS、trace、CrUX 或 GSC。性能基线是用户明确暂缓的事项。

### 做到一半

无。画廊展示图、菜单键盘和 llms.txt 已经在提交 `c0317a6b7356495e2fdb2693a5cef1ec9dc861e0` 里。性能基线由用户明确暂缓，当前没有进行中的实现。

### 下一步

- 下一班在项目根输入 `$pickup` 接手。
- 不要自动 push，不要部署。
- 要做性能基线或其他新任务时，先对齐范围。
- 不要把 `WORKLOG.md` 放进任何提交。

### 踩过的坑

- jsdom 里的焦点测试守的是按键调用。真实页面要从菜单关闭且 `visibility: hidden` 开始，只按一次方向键。菜单已经可见再按的记录不能代替这次冷打开。
- 复测 JSON 没有 ArrowLeft、ArrowRight，也没有菜单已经打开之后的 Home / End。组件里 Left 与 Up、Right 与 Down 共用一个函数。浏览器通过记录覆盖的是冷打开的 ArrowDown、ArrowUp，以及同一轮的 Tab 和 Escape。
- 手机画廊截图要先把真正的 work-gallery 区块滚进视口，并回读图片。第一张 390 宽图拍到的是 Frost Ranger 预设。后来滚进视口的是 `en-work-gallery-mobile-390.png` 和 `zh-work-gallery-mobile-390.png`。
- 第一次英文下载改过链接的行内透明度。算数的是后来刷新页面、用 Tab 和 Enter 保存的那份原图。
- Orca 的 user_takeover 状态标签不等于已经有人做了接管操作。
- `//handoff` 曾误开新会话。交班要用本机 handoff skill 写根目录 `WORKLOG.md`。误开的 terminal `term_2054b60c-bdb0-40e0-be06-b88ae55fb3f7` 已由协调者查到 `connected: false`、`writable: false`、`exitCause: operator_close`。这次交接没有操作它。
- 关闭优化工作树终端时，`term_c87010d5-1fee-47e2-9bb7-2c8268457ca2` 的 `exitCause` 是 `cause_unreported`。公开命令没有报告这个进程的退出码。
- 12:58 的发布记录写过 `git worktree list` 只剩母仓库。13:32 这次复查还有 Armor-creator。优化目录和 `refs/heads/优化` 仍然不在。

### 怎么验证

写这份交接单时没有执行下面的产品命令。证据在这四份记录：

- `/tmp/token-maker-optimization-build-retest.log`
- `/tmp/token-maker-optimization-acceptance.md`
- `/tmp/token-maker-optimization-cold-menu-review.md`
- `/tmp/token-maker-optimization-release.md`

```bash
git status --short --branch
git log -1 --oneline
git worktree list --porcelain
CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false pnpm build:vinext
```

浏览器需要重新启动本地服务。验收清理记录写明 `127.0.0.1:40007` 已经释放。起来之后看英文 `/blog` 和中文 `/zh/blog`：从关闭且 hidden 的菜单冷开，各按一次 ArrowDown 和 ArrowUp，再看 Tab 和 Escape。首页和 `/zh` 在约 390 宽看作品墙 12 张、24 张、54 张，确认展示是 WebP、下载是 PNG 原图。首页上传区用 Enter 和空格选文件，并在画布上做本地导出。

## 交接单 · 2026-09-24 07:28 CST · Grok CLI

### 本次目标

公开页顶栏做成一行：左边标志，中间普通链接加博客分类菜单，右边语言切换和打开编辑器。颜色保持深色和金色。按钮不要胶囊，形状按用户贴的 Navbar5：小圆角文字、圆角矩形按钮。

### 已完成

- 工作区干净，没有未提交改动。这些改动已经在 `2d532d4`（提交说明是 `1`）。`main` 与 `origin/main` 一致。本交接单还不在该提交里。
- 首页、内页、纹章制作器共用 `ContentSiteTopbar`。编辑器工作区的 `src/components/layout/Header.tsx` 没有改。
- 导航数据在 `src/lib/content-site-navigation.ts`。博客分类是 4 个：`characters`、`monsters`、`spells`、`rules-and-prep`。没有 `token-vtt`。
- 桌面链接是 `rounded-md`、高 40px、圆角 8px，没有全大写。语言切换和主按钮是 `rounded-lg`、高 40px、圆角 10px。颜色用现有站点变量。
- 手机抽屉里有博客总目录：英文 `/blog`，中文 `/zh/blog`。四个分类在「Blog categories」或「博客分类」下面。
- `.site-topbar` 的 `backdrop-filter: none` 写在 `@media (max-width: 1023px)`。1280px 宽仍是 `blur(8px)`。
- 博客页上 Blog 按钮字色是 `rgb(241, 212, 146)`，底是 `rgba(215, 180, 106, 0.12)`。骰子页上 Blog 不是这个激活色。
- Ego Lite 已从 0.5.1.11 升到 0.5.1.13。升级后 `ego-browser nodejs -e 'console.log("ego-browser ready")'` 没有再提示有更新。
- 已跑过并退出码为 0：`pnpm exec vitest run src/components/site/ContentSiteTopbar.test.tsx src/components/site/HomeSeoContent.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/app/site-performance-styles.test.ts`（4 个文件，137 项）。其中顶栏测试 12 项也单独通过过。
- 交接时 `http://localhost:40001/` 返回 200。1280px 看过首页、`/zh`、`/dice-roller-dnd`、`/coat-of-arms-maker`。390px 从英文抽屉点进 `/blog`，中文抽屉有 `/zh/blog`。900px 遮罩高度铺满视口，点外面能关掉抽屉。

### 做到一半

- 英文顶栏在 1024px 会不会折成两行：审查提过，这次没有在 1024px 打开页面，也没有改。
- 博客菜单没有方向键。Tab 离开后会不会还开着，这次没有单独测。
- 用户发的参考图是白底黑按钮。已经确定只改形状，不改成白底。
- 页面正文的胶囊按钮故意留着。首页大按钮仍用 `site-cta-primary`。

### 下一步

- 无必须接着改的导航代码。除非用户要白底黑按钮，或要处理 1024px 折行和键盘方向键。
- 不要把这份 `WORKLOG.md` 提交进去，除非用户另说。不要 push。

### 踩过的坑

- 用 `127.0.0.1:40001` 打开时，Next 会拦住开发脚本，菜单点了没反应。要用 `http://localhost:40001`。
- `.site-topbar` 有 `backdrop-filter` 时，里面的 `position: fixed` 抽屉相对顶栏而不是整页。只在 767px 以下关掉磨砂时，768px 到 1023px 点外面关不掉。
- 博客按钮同时写 `text-[var(--site-ink-strong)]` 和 `text-[var(--site-accent-strong)]` 时，样式表里普通字色更靠后，金色不生效。激活时只能留一个文字颜色类。
- 胶囊来自全局 `.site-nav-pill`、`.site-switch-chip`、`.site-cta-primary`。顶栏不能改这三条全局规则，正文还在用。
- 用户贴的 Navbar5 依赖 `@/components/ui/sheet`。仓库里没有这个文件。手机抽屉是手写的，没有新装包。
- 博客分类在代码里是 4 个。不要把 `token-vtt` 加回去。

### 怎么验证

```bash
pnpm exec vitest run src/components/site/ContentSiteTopbar.test.tsx src/lib/content-site-navigation.test.ts src/app/site-performance-styles.test.ts
```

开发服务器若已停，在项目根运行 `pnpm dev`，用 `http://localhost:40001` 打开。看首页、`/zh`、`/dice-roller-dnd`、`/coat-of-arms-maker`：中间链接不是圆形胶囊，右边两个是圆角矩形。悬停 Blog，分类是两列。把窗口拉到约 390px，打开菜单，点「Blog」应到 `/blog`；中文点「博客」应到 `/zh/blog`。约 900px 时打开菜单，点页面空白处应关上。

## 交接单 · 2026-09-23 22:09 CST · Grok CLI

### 本次目标

分类页不要把一个分类的文章全放在同一页，要和博客总页一样：宽屏最多两行、每行 5 张，一页 10 篇，多出来的用上一页和下一页。另外修掉终端里的 `ReferenceError: getBlogCategoryPath is not defined`。

### 已完成

- 用户明确选择不存档。未提交，也没有 push。
- 分类页分页和两行文章格已经在当前 `HEAD`（`3d87911`）的 `src/components/site/views/BlogCategoryPageView.tsx` 里，包括 `BlogCategoryPagination`。分类页不再把第一篇抽成页头大卡片。
- 本次会话核对过 `http://127.0.0.1:40001/zh/blog/category/characters`：第一页 10 张，两行各 5 张，有分页；第二页 `/zh/blog/category/characters/page/2` 也是 10 张，和第一页不重复。当时页面正文没有 `getBlogCategoryPath is not defined`。
- 未存档改动只在这两处：
  - `src/lib/blog/index.ts`：本地调用改成别名 `buildBlogCategoryPath` 和 `requireKnownBlogCategorySlug`。对外仍是 `export { getBlogCategoryPath, requireBlogCategorySlug } from './categories'`。分页地址公式没变。
  - 新文件 `src/lib/blog/category-page-path.test.ts`：从 `@/lib/blog-content` 测第 1 页、第 2 页路径，以及页码 0 和超出末页时抛错。
- 已跑过并退出码为 0：`pnpm exec vitest run src/lib/blog/categories.test.ts src/lib/blog/category-page-path.test.ts`（2 个文件，9 项通过）。
- 别名改完后再次请求 `/zh/blog/category/characters` 返回 200。为核对而开的开发服务器日志里没有新的 `ReferenceError`。

### 做到一半

- 角色分类当时数到 21 篇。第三页应剩 1 篇，这次没有单独打开第三页。
- 修完 `ReferenceError` 之后，没有再单独验收英文 `/blog/category/characters`。
- 为核对启动的 `pnpm dev`（端口 40001）已退出，退出码 143。当前不要假设 40001 还开着。
- `WORKLOG.md` 也有未提交改动。不要把它加进提交。

### 下一步

- 若要存档，只提交 `src/lib/blog/index.ts` 和 `src/lib/blog/category-page-path.test.ts`。不要提交 `WORKLOG.md`，不要 push。提交前先再看一遍 `git status`。
- 重新跑 `pnpm dev` 后，打开角色分类第 3 页和英文角色分类页，确认没有 `ReferenceError`，并且第 3 页只有剩下的那 1 篇。
- 不要把 `token-vtt` 分类加回去。上一班已从分类列表移除，直接访问该分类地址应是 404。

### 踩过的坑

- 报错框把位置标成 `src/lib/blog/categories.ts:98` 和 `SiteFooter.tsx`。这两处对不上：第 98 行是分类名单里的文章 slug，`SiteFooter.tsx` 不是调用方。真正调用在 `src/lib/blog/index.ts` 的 `getBlogCategoryPagePath`，页面入口是 `BlogCategoryPageView` 算当前路径。
- 终端里的 `[browser]` 前缀，是服务端渲染错误被 `src/app/error.tsx` 接住后送回开发服务器。`getBlogCategoryPagePath` 没有打进浏览器自己的脚本。请求仍可能是 200。
- `index.ts` 里同名 `import` 再加 `export { 名字 } from './categories'`，调用点会变成未声明变量，于是报 `is not defined`。只改 `getBlogCategoryPath` 时，`requireBlogCategorySlug` 还是同一写法；审查指出后，内部调用也改成了 `requireKnownBlogCategorySlug`。
- Vitest 走 Vite，测得到路径结果，覆盖不到这个打包绑定问题。
- 用 `127.0.0.1` 打开 `localhost:40001` 时，Next 会刷 `allowedDevOrigins` 警告。这和 `ReferenceError` 不是同一件事。
- 分类页曾经把第一篇拿去当页头大卡片，下面的格子变成 5 张加 4 张。这个大卡片已经不在当前 `BlogCategoryPageView` 里。

### 怎么验证

先在项目根目录启动本地站，再看页面。端口以实际启动输出为准，项目脚本默认是 40001。

```bash
pnpm dev
pnpm exec vitest run src/lib/blog/categories.test.ts src/lib/blog/category-page-path.test.ts src/components/site/views/BlogCategoryPageView.test.tsx
```

页面：

- `http://127.0.0.1:40001/zh/blog/category/characters`：10 张卡片，两行各 5 张，下面有「分页」。正文和终端都不应出现 `getBlogCategoryPath is not defined` 或 `requireBlogCategorySlug is not defined`。
- 点「下一页」，地址应为 `/zh/blog/category/characters/page/2`，文章不和第一页重复。
- 再打开第 3 页，确认只剩剩余文章。
- `http://127.0.0.1:40001/blog/category/characters` 做同样的检查。

## 交接单 · 2026-09-23 19:38 CST · Codex CLI

### 本次目标

移除博客下拉菜单中没有内容的 `Token & VTT Guides / Token 与 VTT 指南` 分类页，并让英文、中文入口和路由保持一致。

### 已完成

- 从博客分类类型、分类列表、双语文案和文章分类映射中移除 `token-vtt`。
- 清理对应的未发布 Token 指南占位文章数据。
- 英文和中文分类导航、Blog 下拉菜单、静态参数和 sitemap 均不再包含该分类。
- `/blog/category/token-vtt` 与 `/zh/blog/category/token-vtt` 直接访问返回 404。
- 更新分类、路由和 sitemap 测试。
- 保留此前移动端博客下拉菜单定位修复。
- 当前已核对：工作区干净，`main` 与 `origin/main` 均指向 `3d87911`。

### 做到一半

无。

### 下一步

- 如需继续处理完整测试、typecheck 或 build 的失败，另开范围排查现有文章排序、sitemap 日期和 TypeScript 基线问题，不要回退本次分类移除。
- 不要提交 `WORKLOG.md`；本次未执行生产部署验收。

### 踩过的坑

- Blog 顶部链接点击会进入 Blog 首页；下拉菜单通过顶部链接的 hover/focus 展开，浏览器验收时应使用 focus 或 hover 后再读取 menu。
- 移动端窄屏下拉菜单原先使用 `right: 0` 会向左越界；`globals.css` 中已有针对 430px 以下屏幕的 `left: 0` 修复。
- 完整测试当前仍有 5 个文件、22 个测试失败，失败集中在既有文章顺序和 sitemap 日期断言；不是本次分类相关 focused tests 的失败。

### 怎么验证

```bash
pnpm exec vitest run src/lib/blog/categories.test.ts src/components/site/views/BlogCategoryPageView.test.tsx src/app/sitemap-category.test.ts
pnpm exec eslint src/lib/blog/types.ts src/lib/blog/categories.ts src/lib/blog/registry.ts src/lib/blog/categories.test.ts src/components/site/views/BlogCategoryPageView.test.tsx src/app/sitemap-category.test.ts
git diff --check
pnpm test
pnpm run typecheck
pnpm run build
```

已核对结果：分类相关 focused tests 为 3 个文件、28 个测试全部通过；相关 ESLint 和 diff 检查通过。Ego Browser 本地 40001 验收显示中英文下拉菜单各 4 项，两个 `token-vtt` 路由均为 HTTP 404。完整 test、typecheck 和 build 仍受仓库现有基线错误阻断；build 已编译成功后在 TypeScript 检查阶段失败。


## 交接单 · 2026-09-21 07:36 CST · Codex CLI

### 本次目标

完成 `dnd schools of magic` 中英文博客：中文页面纯中文化、替换中文页面图片、修正中文 metadata 标题后缀，并提交合并到 `main`，清理临时分支和工作树。

### 已完成

- 中文正文、H1、description、OG/Twitter title、图注、来源文案和无障碍文案已完成中文化。
- 中文页面使用两张无文字游戏角色图：中文专用封面和文中施法者插画；英文页面图片保持原样。
- 中文页面不再追加 `| Token Maker`；英文页面仍保留原有标题后缀。
- 功能提交：`08fc690`；合并提交：`8cce019`。
- 目标工作树 `/Users/wusir/orca/workspaces/token-maker-app/博客-dnd-zh-pure` 已删除。
- 本地分支 `博客-dnd-schools-of-magic`、`博客-dnd-zh-pure` 已安全删除；远程只保留 `origin/main`。
- 当前 `main` 为 `31182ea`，与 `origin/main` 一致，工作区干净；40007 本地服务已停止。

### 做到一半

无。

### 下一步

- 如继续处理博客分页测试中的既有 `dnd-kobold` / `dnd-halfling` 断言不一致，需要另开范围，不要回改本次已合并内容。
- 如需生产页面验收，重新启动本地服务或按独立授权执行部署；本次未执行部署操作。

### 踩过的坑

- 新工作树曾默认落在旧基线，缺少目标文章；创建后必须核对基线并快进到当前 `main`。
- 中文页面的英文来源不只是路由问题，还来自正文、图片内文字和公共 metadata 模板；需要分别检查 DOM、图片资源和 metadata。
- 删除本地分支前必须确认 `git branch --merged main`、无关联 worktree，并使用 `git branch -d`，不要用 `-D`。
- 本地服务删除工作树前必须确认 PID/cwd 和端口状态，避免遗留指向已删除目录的进程。

### 怎么验证

```bash
git status --short --branch
git log -1 --oneline --decorate
git branch --format='%(refname:short)'
git branch -r
git worktree list --porcelain
pnpm exec eslint src/lib/blog-posts/dnd-schools-of-magic.ts src/lib/blog-posts/shared.ts src/lib/blog/registry.ts src/lib/blog/dnd-schools-of-magic.test.ts src/lib/blog/index.ts
pnpm exec vitest run src/lib/blog/dnd-schools-of-magic.test.ts
git diff --check
```

已核对的结果：ESLint 和 diff 检查通过；D&D focused test 保留 1 个既有分页断言失败，其余通过。此前本地浏览器在中文/英文、桌面/窄屏四种组合中通过 66/66，中文正文英文命中为 0，图片加载正常且无横向溢出。当前临时服务已停止，原本的 40007 URL 不再提供服务。

## 交接单 · 2026-09-20 08:23 CST · Cursor CLI

### 本次目标

把 Token Maker 生产从 Vercel 切到 Cloudflare Workers（vinext 全站），并停掉 Vercel 对正式域名和 `main` 推送的自动构建。代码改动不在本班新增；本班后半只做控制面切流。

### 已完成

- 生产代码已在 `origin/main` 的 `b7b78f4`（`Move contact and coat-export onto Workers bindings for Cloudflare deploys.`）。Share / contact / coat-export 走 Workers Rate Limit + `SHARE_BUCKET`；contact 的 Resend 变量用 `getServerEnv(env)`。
- Cloudflare 账号 `233c6bfa4790ecd5fd238598658641de`（与 R2 桶 `tokenmaker-shares` 同一账号）。Worker 名 `token-maker-app`；Workers Builds 跟 GitHub `wsir78933-rgb/token-maker`，build `pnpm run build:vinext`，deploy `npx wrangler deploy --config dist/server/wrangler.json`。
- 自定义域名已绑 `www.tokenmaker.one` 和 `tokenmaker.one`。Cloudflare DNS 已删旧 Vercel 记录：`www` CNAME `70f72d15fadb3747.vercel-dns-017.com`、apex A `216.198.79.1`。保留 `r2`、send MX/SPF、`_dmarc`、`resend._domainkey`、Google site-verification TXT。
- Contact 四个 Worker secrets 已通过 Dashboard「Add variable and deploy」写入生产：`RESEND_API_KEY`、`RESEND_FROM_EMAIL`、`CONTACT_TO_EMAIL`、`CONTACT_SUBJECT_PREFIX`。值不要回读到聊天。
- 2026-09-19 晚回读：`https://www.tokenmaker.one/` 与 `https://tokenmaker.one/` 均为 HTTP 200、`server: cloudflare`，无 `x-vercel-id`。Contact 曾测过 `POST /api/contact` 返回 200 `{"ok":true}`。
- Vercel 项目 `token-maker`：已移除自定义域名 `tokenmaker.one`、`www.tokenmaker.one`；已 Disconnect Git。项目仍在，状态 Ready，只剩 `token-maker-eta.vercel.app`。
- 用户明确：xlsx 未存档。当前工作区相对 `main`/`origin/main` 仅有未跟踪/未提交的 `DND-筛选后关键词清单.xlsx`；`WORKLOG.md` 写入后也会变成未存档修改。

### 做到一半

- Vercel 项目未 Pause、未删除。用户说过「要删再说」。
- 无未完成的本次范围内代码改动。

### 下一步

1. 正式站继续以 Cloudflare 为准；推 `main` 只应触发 Workers Builds，不应再触发 Vercel。
2. 若要彻底关掉 Vercel，需单独授权 Pause 或删除项目 `token-maker`；不要重连 Git、不要把 `tokenmaker.one` 加回 Vercel。
3. 不要提交 `WORKLOG.md`，不要提交 `.env.local`，不要 force-push。

### 踩过的坑

- Vercel 上跑 Workers limiter 代码会返回 503 `rate_limiter_unavailable`；切 Cloudflare 前正式 Share 是坏的。
- Worker 自定义域名要求 hostname 无外部 DNS；必须先删 Vercel 的 `www` CNAME 和 apex A，再绑 Worker 域名。删 CNAME 后 apex 仍可能被 Vercel A 记录 308。
- `wrangler secret put` 能列出 secrets，但生产 contact 仍可能 503 `email_not_configured`；必须在 Dashboard 对每个变量点「Add variable and deploy」。
- GitHub sudo OTP 会挡住自动化；Cloudflare GitHub App 当时只有 `open-seo` / `Retouchia`，要手动加 `token-maker`。首次自动部署只打到 `*.workers.dev`。
- Vercel 项目 slug 是 `token-maker`，不是 `token-maker-app`；后者 settings URL 会 404。
- 把整段 dotenv 贴进 Secret 的 Key 会报 invalid name。Workers Rate Limit `period` 只能 10 或 60 秒。

### 怎么验证

```bash
git status -sb
git log --oneline --decorate -3
curl -sS -D - -o /dev/null --max-time 20 -A 'Mozilla/5.0' 'https://www.tokenmaker.one/' | grep -iE '^(HTTP/|server:|x-vercel|cf-ray:)'
curl -sS -D - -o /dev/null --max-time 20 -A 'Mozilla/5.0' 'https://tokenmaker.one/' | grep -iE '^(HTTP/|server:|x-vercel|cf-ray:)'
curl -sS -D - -o /dev/null --max-time 20 -A 'Mozilla/5.0' 'https://token-maker-eta.vercel.app/' | grep -iE '^(HTTP/|server:|x-vercel:)'
```

控制面：

- Cloudflare：Worker `token-maker-app` production 自定义域名含 `www.tokenmaker.one` 和 `tokenmaker.one`。
- Vercel：`https://vercel.com/wsir78933-rgbs-projects/token-maker/settings/git` 显示未连接仓库；Domains 只剩 `token-maker-eta.vercel.app`。
- 浏览器：打开 `https://www.tokenmaker.one/`，编辑器 Share 应出现 Share link ready，不要再出现 503 `rate_limiter_unavailable`。

## 交接单 · 2026-09-18 08:03 CST · Codex CLI

### 本次目标

只调整 Token Maker 移动端最终下载反馈：下载后显示“下载成功”，并提示用户到浏览器下载内容或文件 App 查看；桌面端保持原有可见文案和行为。

### 已完成

- 在下载 payload 中加入可选的下载来源标记；移动端传递 `mobile`，桌面端默认使用 `desktop`。
- 移动端外层下载和分享弹层最终下载均显示：`下载成功，请到浏览器的下载内容或文件 App 中查看。`；桌面端继续显示原有的“下载已开始……”文案。
- 保留普通下载本地生成/保存和分享上传边界；没有把移动端成功文案直接改成桌面端共用文案。
- 相关源文件和测试已在 `main` 的 `e5f2bd8`（`最新`）中；当前最新 HEAD 为 `b789980`（`最新`），`origin/main` 与 HEAD 一致，工作树在写本交接单前干净。
- 本地生产构建、移动端/桌面端 Ego 浏览器回读已完成：移动端 375×812 显示移动端成功文案并触发真实下载；桌面端 1440×1000 未显示移动端文案，仍显示原有文案；两端均无横向溢出。
- 通过证据：下载相关 focused tests 3 files / 38 tests、`pnpm typecheck`、`pnpm build`（171 个页面）、Impeccable detector；`pnpm lint` 0 errors，保留 8 条既有 warning。
- `移动端下载` 工作树和分支已按此前要求删除；当前只剩主工作树。

### 做到一半

无本次范围内的未完成代码或待决定事项。生产 URL 未在本次重新部署或验收；当前证据是本地 `main`、本地 production build 和本地 Ego 浏览器。

### 下一步

1. 如果需要确认线上效果，先按单独授权的部署流程检查生产版本，再回读移动端和桌面端下载流程；不要把 Git 状态或本地构建当成生产已更新。
2. 如需继续改动，先保留桌面默认 `downloadSurface` 分支，只修改移动端来源路径；不要直接改 `shareDownloadStarted` 这类桌面共用文案。

### 踩过的坑

- `ShareDialog` 和 `TemplatePanel` 是桌面/移动共用组件；移动端专属文案必须通过来源标记分流，否则直接改 i18n 共用 key 会改变桌面端。
- `saveAs` 只能证明浏览器下载已触发，网页不能确认手机系统最终写入文件；用户提示应同时指导去浏览器下载内容或文件 App 查看。
- `WORKLOG.md` 是交接记录文件，不要把它加入功能提交；当前交接单写入后它会成为新的未存档修改。

### 怎么验证

```bash
git status -sb
git log --oneline --decorate -4
pnpm exec vitest run src/components/editor/ShareDialog.test.tsx src/components/editor/TemplatePanel.test.tsx src/components/editor/export-token.test.ts
pnpm typecheck
pnpm lint
pnpm build
node /Users/wusir/.codex/skills/designer-skill/references/external-skills/impeccable/scripts/detect.mjs --json src/components/editor/ShareDialog.tsx src/components/editor/TemplatePanel.tsx
git diff --check
```

本地浏览器路径：

- 移动端：`http://localhost:40001/zh`，375×812；打开编辑器，上传 PNG，点击“下载 PNG”，再点击弹层里的“下载”，确认出现“下载成功，请到浏览器的下载内容或文件 App 中查看。”。
- 桌面端：同一地址，1440×1000；完成相同流程，确认仍为“下载已开始，请到浏览器的下载内容或文件 App 中查看。”。

## 交接单 · 2026-09-18 06:36 CST · Codex CLI

### 本次目标

在工作树「分享功能」中，将分享后端迁移到 Cloudflare Workers（vinext）+ 原生 R2 binding + Cloudflare Workers Rate Limiting，完成验证后提交、合并到本地 `main`，并删除该工作树。

### 已完成

- `/api/share` 已改用 `cloudflare:workers` 的 `SHARE_BUCKET` 与 `SHARE_RATE_LIMITER`；分享路径不再使用 Upstash、R2 S3 SDK、Vercel IP 头或运行时 `sharp`。
- 增加了 Cloudflare 限流/IP/R2 适配器，保留严格 PNG 校验、APNG 拒绝、尺寸/像素/5MiB 限制、`shares/{id}.png`、30 天 immutable 缓存和 `{id, shareUrl, imageUrl}` 成功响应契约。
- `@cf-wasm/png` 已改用明确的 `/workerd` 入口；Node/Vitest 测试使用仅测试侧的 `/node` mock，解决本地 Worker 的 Wasm 加载错误。
- `wrangler.jsonc` 已声明 `SHARE_BUCKET`（`tokenmaker-shares`）和 `SHARE_RATE_LIMITER`（20 次/60 秒），并显式开启 observability logs/traces；`namespace_id` 仍是部署前必须替换的非密钥占位值 `999999999`。
- 通过证据：分享 focused tests 60/60、目标 share ESLint 0、`pnpm run check:vinext` 退出 0、`pnpm run build:vinext` 退出 0、`pnpm exec wrangler types` 退出 0；本地 Wrangler `GET /`=200、`GET /api/share`=405，端口已释放。
- 功能提交为 `983bd51`（`feat(share): use Cloudflare native storage and rate limiting`），已通过合并提交 `12e2eae` 合入 `main`。当前 `main` 后续 HEAD 为 `e5f2bd8`（`最新`），工作区干净。
- Orca 工作树 `/Users/wusir/orca/workspaces/token-maker-app/分享功能` 及本地分支 `分享功能` 已删除；当前 Orca 只剩主工作树。

### 做到一半

- 无本次范围内的未完成代码。生产尚未部署，未 push，未执行真实 R2 上传或 Cloudflare 外部写入。
- 此前全局 `tsc`/`lint` 仍有未修改组件、测试和生成产物相关残余；当前 `main` 后续提交 `e5f2bd8` 未在本次交接中重新跑全局检查，部署前需在当前 HEAD 复核。

### 下一步

1. 在当前 `main` 重新跑分享 focused tests、`check:vinext`、`build:vinext` 和 `wrangler types`。
2. 部署前替换 `wrangler.jsonc` 中的 `namespace_id` 占位值，并在 Cloudflare 控制面配置真实 R2/Worker 资源；这些操作需要单独授权。
3. 获得部署授权后再 deploy/push，并回读生产分享按钮、`/api/share` 和 R2 对象；当前没有生产证据。

### 踩过的坑

- `@cf-wasm/png` 默认入口会被打包成内联 `WebAssembly.Module`，本地 Wrangler workerd 返回 500；显式 `/workerd` 入口才通过本地 Worker smoke。
- route 曾经重复解析 base64 并绕过 `parseShareUploadPayload`，且未映射非法 R2 binding；已修复并加入回归测试。
- `wrangler types --check` 在一次只读验收中长时间无输出并被中断；成功证据使用的是 `pnpm exec wrangler types`。
- 工作树删除前已确认提交已在 `main`；不要再假设 `分享功能` 分支或目录存在，也不要重写当前 `main` 历史。

### 怎么验证

```bash
git status -sb
git log --oneline --decorate -4
pnpm exec vitest run src/app/api/share/route.test.ts src/lib/share/server-validation.test.ts src/lib/share/workers-image-sanitizer.test.ts src/lib/share/workers-rate-limit.test.ts src/lib/share/workers-client-ip.test.ts src/lib/share/workers-r2-storage.test.ts
pnpm run check:vinext
pnpm run build:vinext
pnpm exec wrangler types
git diff --check
```

本地 Worker 只读 smoke：启动 `pnpm exec wrangler dev --config dist/server/wrangler.json --local --port 40124` 后，确认 `GET /` 返回 200、`GET /api/share` 返回 405；不要发送 POST，完成后停止进程并确认端口释放。

## 交接单 · 2026-09-17 20:19 CST · Codex CLI

### 本次目标

替换 `dnd-kobold` 中英文页面的全部正文图片，并将变更提交到本地 `main`；不删除旧图，不在本次执行 push 或部署。

### 已完成

- 生成并转换 3 张干净的 Kobold 人物图，已加入：
  - `public/blog/inline/dnd-kobold/kobold-character-study.webp`
  - `public/blog/inline/dnd-kobold/kobold-character-alert.webp`
  - `public/blog/inline/dnd-kobold/kobold-character-ready.webp`
- 英文和中文正文共 6 个 figure 已按 `study → alert → ready` 替换；新增公开路径集合 `DND_KOBOLD_CHARACTER_IMAGE_PATHS`。正文文字、表格、链接、标题、描述、FAQ 和封面未改；旧 6 张图仍保留且页面不再引用。
- 本地 ego-browser 已回读 `http://127.0.0.1:40001/blog/dnd-kobold` 与 `/zh/blog/dnd-kobold`，在 1440×1000、375×812 四种组合中确认新图可见、HTTP 200、natural size 1536×1024、无横向溢出；封面保持原路径。
- 已通过：`pnpm typecheck`、`pnpm lint`（0 errors，8 个既有 warning）、`pnpm exec vitest run src/lib/blog/dnd-kobold.test.ts`（1 file / 2 tests）、`pnpm build`、`git diff --check`。
- 已在本地 `main` 创建 commit `23ea17c60363390ab283248bdd83fc23aee3f6ba`，消息为 `fix(blog): replace kobold body images`。当前工作区干净，`main` 相对 `origin/main` ahead 1；父提交和 `origin/main` 为 `5039872fbe6038589d3c9a3152a5488f4bb44924`。
- 详细报告位于 `/tmp/token-maker-blog-v7-dnd-wizard-spells-e42833429c48/` 下的 `kobold-character-assets-report.md`、`kobold-body-character-rewire-report.md`、`kobold-body-character-browser-review.md`、`kobold-main-commit-report.md`、`kobold-main-commit-review.md`。

### 做到一半

无。本地代码、图片、测试、提交和本地浏览器验收均已完成。`WORKLOG.md` 本条按交接规则不提交。

### 下一步

1. 如需让远程仓库或线上站点更新，先明确授权后执行 `git push origin main`，再按部署平台流程部署。
2. push/deploy 后重新回读生产 URL；当前证据只覆盖本地 `main` 和本地 40001，不能当作线上已更新。

### 踩过的坑

- 本地提交到 `main` 不等于远程或生产已更新；当前 `origin/main` 仍落后 1 个 commit。
- 旧 Kobold 图片是有意保留的历史资产，不能因为页面不再引用就删除。
- 40001 当前由 token-maker-app 的 `next-server` 提供；后续浏览器验收应复用并先核对 PID/cwd，不要停止未知服务。

### 怎么验证

```bash
git status --short --branch
git log -1 --oneline --decorate
git rev-list --left-right --count origin/main...HEAD
pnpm typecheck
pnpm lint
pnpm exec vitest run src/lib/blog/dnd-kobold.test.ts
pnpm build
git diff --check
```

本地页面：

- http://127.0.0.1:40001/blog/dnd-kobold
- http://127.0.0.1:40001/zh/blog/dnd-kobold

## 交接单 · 2026-09-16 07:22 CST · Grok CLI

### 本次目标

查清 `https://www.tokenmaker.one/coat-of-arms-maker` 是否被 GA4 / Clarity 统计；用户选定两者都开，并同步改隐私页。在工作树 `第三方工具` 里实现，提交该分支后合进 `main`，再删除分支和工作树。不部署。

### 已完成

- 当前 `HEAD`：`1ad8eec`（`Merge branch '第三方工具'`）。分支 `main`，工作区干净，与 `origin/main` 一致。本地和远程都没有 `第三方工具` 分支。只剩主工作区 `/Users/wusir/Desktop/开发项目集合/token-maker-app`。本交接未 `git fetch` / push / deploy。
- 只读核实：线上纹章页不加载 `gtag` / Clarity；首页加载 GA 测量 ID `G-6FMX5JSNNX` 和 Clarity 项目 `wlcq64go88`。原因：`CoatMakerDocument` 故意不挂第三方脚本，且纹章页 CSP 为 `connect-src 'self'`。
- 产品提交：
  - `422871d` Enable GA4 and Clarity on Coat Maker pages.（11 文件，+241 / −49）
  - `1ad8eec` 合进 `main` 后 `git push origin main`；`git push origin --delete 第三方工具` 成功。
- 实现要点（已在 `main`）：
  - `CoatMakerDocument` 挂 `MicrosoftClarity` + `Suspense`/`GoogleAnalytics`，带 request nonce；不加 AdSense。
  - `proxy.ts` 拆开分享页 / 纹章页 CSP；纹章页放行 GA/GTM/Clarity，并含 `https://c.bing.com`。分享页仍锁定。
  - 隐私中英说明写明 `/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker` 会加载 Clarity（非开发）和 GA（生产且配置了 `NEXT_PUBLIC_GA_MEASUREMENT_ID`）。
- 合并后在 `main` 上跑过：`pnpm typecheck` 通过；`pnpm exec vitest run src/proxy.test.ts src/app/layout-route-boundaries.test.ts src/components/analytics/GoogleAnalytics.test.tsx src/components/analytics/MicrosoftClarity.test.tsx src/lib/site-page-models.test.ts src/app/sitemap.test.ts` → 6 files / 75 passed。
- 工作树 `/Users/wusir/Desktop/开发项目集合/第三方工具` 已 `git worktree remove`。用户随后要求清掉合并后无用的工作树，把已合进 `main` 的 `/Users/wusir/Desktop/开发项目集合/hero 布局`（detached `b4242ab`）也删了。
- 推 `main` 时，本地原先超前的 `b4242ab Redesign coat of arms hero layout` 一并上去了。

### 做到一半

- 生产未部署。线上纹章页此时仍不应有 GA/Clarity。GA4 / Clarity 后台还看不到这一页的新数据，除非这次 `main` 已经由用户或托管平台发布。
- 本 `WORKLOG.md` 本条未提交。

### 下一步

1. 用户授权后再部署生产。
2. 部署后用浏览器打开 `/coat-of-arms-maker` 与 `/zh/coat-of-arms-maker`，确认有 `googletagmanager.com/gtag/js?id=G-6FMX5JSNNX` 和 `clarity.ms`；分享页 `/share/...` 仍没有。再在 GA4 / Clarity 后台按页面路径核对。
3. 不要把已删除的 `第三方工具` 分支或那两个工作树目录当还存在。

### 踩过的坑

- 只往 `CoatMakerDocument` 塞脚本不够：纹章页 CSP 会拦住发往 Google / Clarity 的请求。分享页和纹章页必须拆 CSP，不能一起放宽。
- 用户先说开分支「数据统计」，后改口开工作树，命名「第三方工具」。git worktree 仍会带一条同名分支。
- Clarity 官方 CSP 还要 `https://c.bing.com`（cookie 缺失时 `c.clarity.ms/c.gif` 会跳到 Bing）。审查后补进 `img-src` / `connect-src`。
- 本地 `pnpm dev` 不会出数：GA 仅 production，Clarity 在 development 返回 null。
- 分支被工作树占用时不能先 `git branch -d`，要先 `git worktree remove`。
- 清工作树时不要误删主仓库；`hero 布局` 是另一份已合入的残留，不是 `第三方工具`。

### 怎么验证

```bash
git rev-parse HEAD
git status -sb
git branch | rg 第三方工具 || true
git branch -r | rg 第三方工具 || true
git worktree list
pnpm typecheck
pnpm exec vitest run src/proxy.test.ts src/app/layout-route-boundaries.test.ts src/components/analytics/GoogleAnalytics.test.tsx src/components/analytics/MicrosoftClarity.test.tsx src/lib/site-page-models.test.ts src/app/sitemap.test.ts
```

部署后浏览器（优先本地 ego-browser 对生产 URL）：

- https://www.tokenmaker.one/coat-of-arms-maker
- https://www.tokenmaker.one/zh/coat-of-arms-maker
- 对照首页 https://www.tokenmaker.one/ 已有 GA/Clarity
- 分享页不应出现这两套脚本

核对运行时 `window.gtag`、`clarity.ms` 脚本、网络请求能发到 `google-analytics.com` / `googletagmanager.com` / `clarity.ms`。仓库检查不能证明线上已更新。不要清用户 localStorage。

## 交接单 · 2026-09-12 07:49 CST · Grok CLI

### 本次目标

按 `/Users/wusir/Desktop/博客-V7修订版` 为 tokenmaker.one 写关键词 **dnd kenku** 的中英独立文章，装进现有网站；开 git 分支 `博客`（不是 worktree/分区）；合进 `main` 后删掉该分支。牧师法术未完成稿不带进本分支。不部署。

### 已完成

- 当前 `git rev-parse HEAD`：`6b1cb54cb82fd528b864c4fde5ae1ac2593e8d2a`（标题 `1`，只改 `WORKLOG.md`）。分支 `main`，工作区干净，与 `origin/main` 一致。本地和远程都没有 `博客` 分支。本交接未 `git fetch` / push / deploy。
- 产品提交链（Kenku 已在 `main` 上）：
  - `0f898a1` 标题 `9.12`：新增双语 Kenku 页、封面/6 张正文 webp、registry、sitemap/分页/index 测试、`public/llms.txt`。当时还带了 `tmp/blog-dnd-kenku/` 内部研究稿。
  - `7541dd8`：从该分支删掉 `tmp/blog-dnd-kenku/` 共 28 个文件，再快进合进当时的 `main`。
  - `6b1cb54`：用户侧把当时的 `WORKLOG.md` 交班条提交为 `1`。
- Kenku 文件现仍在 HEAD：`src/lib/blog-posts/dnd-kenku.ts`、`src/lib/blog/dnd-kenku.test.ts`、封面 `public/blog/covers/en/dnd-kenku-guide.webp`、`public/blog/inline/dnd-kenku/` 六张图。`git ls-tree HEAD` 无 `tmp/blog-dnd-kenku/`。
- 英文 H1/seoTitle：`DnD Kenku: Speech Depends on Volo's or MotM`。中文 title：`dnd kenku：瓦罗只能拟声，灰机缺页不等于魔邓肯不能开口`。slug `dnd-kenku`。用户终审未做，不能记用户通过。
- 本会话写文阶段曾独立跑过：`pnpm exec vitest run src/lib/blog/dnd-kenku.test.ts src/lib/blog/pagination.test.ts src/lib/blog/dnd-campaigns.test.ts src/lib/blog/index.test.ts src/app/sitemap.test.ts` → 5 files / 175 passed；`pnpm typecheck` 通过。本交接轮未重跑。
- 写文时 ego-browser 打开过 `http://localhost:40001/blog/dnd-kenku` 与 `/zh/blog/dnd-kenku`，桌面+手机 390×844。交班时 `40001` 仍有 node 在听（PID 40216）。
- 用户确认后：本地 `博客` 用 `-D` 删除（当时相对 `origin/博客` 多 1 笔删 tmp 的提交，但已是 `main` 祖先）；`git push origin --delete 博客` 已成功。远程 `origin/博客` 已不存在。
- 牧师法术未完成稿在 `stash@{0}`：`On main: preserve dnd-cleric-spells WIP on main before kenku blog branch`（`git stash push -u`）。`git stash show --stat` 可见 xlsx、`llms.txt`、`shared.ts`、registry/测试；未跟踪的 `dnd-cleric-spells.ts` / 封面/内文图因 `-u` 应在该 stash 里，本交接未 `stash show -u` 逐项列出。

### 做到一半

- Kenku 页面：**网站成品已就绪，待用户终审**。用户未在成品页确认通过或提出修改。
- 牧师法术文章：仍在 `stash@{0}`，未恢复、未合入 `main`。
- 无未存档工作区改动。本 `WORKLOG.md` 本条未提交。

### 下一步

1. 用户终审本地 Kenku 页；要改再开修订，不要把技术冻结当成用户批准。
2. 继续牧师法术：在干净 `main` 上 `git stash pop`（先确认 stash@{0}），注意会改 registry / 测试 / llms.txt，可能和已上线的 Kenku 接线冲突，pop 后要跑测试。
3. 不要把已删除的 `博客` 分支当还存在。产品发布需用户另行授权。

### 踩过的坑

- 写 Kenku 前工作区有牧师法术脏文件。从脏 `main` 直接切 `博客` 会把两篇混在一起。已用 `stash -u` 留在 main 侧。
- 子代理曾把牧师法术接线写回 `博客` 工作区，已 `git checkout HEAD --` 清掉，未带进 Kenku 提交。
- `0f898a1` 误把 `tmp/blog-dnd-kenku/` 内部研究稿提交进去。用户选方案 A 后另提交 `7541dd8` 删除再合 main。
- 英文/中文初选标题把 wikidot 转写的「MotM 能说话」写成定论；独立题文复核 REVISE 后才锁现在的 H1。
- 精确美国/中国大陆 Google SERP 未取得（验证码）。正文未编排名。
- 删本地 `博客` 时 `git branch -d` 失败：相对 `origin/博客` 未完全合并。已核它是 `main` 祖先后用 `-D`。远程删除已完成。
- 上一份 07:40 交接单写 HEAD 是 `7541dd8` 且 ahead 2。现在 HEAD 已是 `6b1cb54`，且已与 `origin/main` 同步。不要沿用 07:40 的 ahead 状态。

### 怎么验证

```bash
git rev-parse HEAD
git status -sb
git branch | rg 博客 || true
git branch -r | rg 博客 || true
pnpm typecheck
pnpm exec vitest run src/lib/blog/dnd-kenku.test.ts src/lib/blog/pagination.test.ts src/lib/blog/dnd-campaigns.test.ts src/lib/blog/index.test.ts src/app/sitemap.test.ts
```

浏览器（优先本地 ego-browser；交班时 40001 仍在听）：

- http://localhost:40001/blog/dnd-kenku
- http://localhost:40001/zh/blog/dnd-kenku
- http://localhost:40001/blog （网格第一篇常规文应为 Kenku；featured 仍是 classes-explained）

核对 H1、三张正文图、中英语言切换、手机视口不撑破。仓库检查不能证明线上已更新。不要清用户 localStorage。不要把 stash pop 牧师法术和 Kenku 终审混成一件事。

## 交接单 · 2026-09-12 07:40 CST · Grok CLI

### 本次目标

本会话只回答「上一次改动是做什么」，随后执行 `/handoff`。没有编码授权，没有改产品代码。

### 已完成

- 工作区干净：`git status --porcelain` 为空。当前分支 `main`，`HEAD` 为 `7541dd8d9c42178aa51b753c44628efdb0db25ea`（标题 `Remove Kenku internal research files from the blog branch.`）。相对 `origin/main` **ahead 2**，未 push。本会话未 `git fetch` / push / deploy。
- 本会话只读核对过 git。会话开始时（2026-09-11）当时 HEAD 是 `1337e1e`；到写本交接时，仓库已多出两笔用户侧提交，不是本会话写的：
  - `0f898a1`（2026-09-12 07:35 CST，标题 `9.12`）：新增中英 Kenku 博客页、封面/内文图、registry、sitemap/分页测试、`public/llms.txt`，并把内部研究稿放进 `tmp/blog-dnd-kenku/`。
  - `7541dd8`（2026-09-12 07:40 CST）：从博客分支删掉 `tmp/blog-dnd-kenku/` 共 28 个内部研究文件（3812 行删除）。提交说明写明保留已发布正文、图片和 registry 接线，避免这些编辑笔记进 main。
- 本会话对用户的问答（基于当时 `1337e1e`）：最新提交 `1337e1e` 标题 `1`，只改 `WORKLOG.md` 和 `DND-筛选后关键词清单.xlsx`；再前一次产品提交是 `394f6e8` 双语 `dnd-campaigns` 页。该结论对应当时 HEAD，不是现在的 HEAD。
- 现 HEAD 上 Kenku 页仍在：`src/lib/blog-posts/dnd-kenku.ts`、`src/lib/blog/dnd-kenku.test.ts`、`src/lib/blog/registry.ts`、封面 `public/blog/covers/en/dnd-kenku-guide.webp`。内部研究目录 `tmp/blog-dnd-kenku/` 已不在 `7541dd8`。
- `WORKLOG.md` 旧顶条仍是 2026-09-11 07:10 的编辑器卡顿交接，记录的当时 HEAD 是 `89866f0`。本条只追加文档，不提交。

### 做到一半

- 本会话无未完成编码项。
- `main` 比 `origin/main` 超前 2 个提交（`0f898a1`、`7541dd8`）。未 push、未部署；不能声称线上已有 Kenku 页。
- 本会话未跑 typecheck / lint / test / build，也未开浏览器。Kenku 页与编辑器卡顿优化的当前运行状态 UNVERIFIED。
- 上一份交接里的编辑器四文件优化、F/P 终端、`localhost:40001` 监听：本会话未复查，不得沿用为现在仍成立。

### 下一步

- 下一班输入 `/pickup` 接手。先读本条、`git rev-parse HEAD`、`git status --short --branch`、`git log --oneline origin/main..HEAD`。
- 若继续产品工作：先单独确认是看 Kenku 页、编辑器卡顿，还是别的；push / 部署必须单独授权。
- 不要把 `WORKLOG.md` 加入产品提交。不要 `git fetch` / push / deploy，除非用户本班明确授权。

### 踩过的坑

- 用户问「上一次改动」时，仓库随后又提交了 Kenku 页。下一班不要把本会话问答里的 `1337e1e` / `dnd-campaigns` 当成当前 HEAD。
- `0f898a1` 曾把 Kenku 内部研究稿提交进仓库；`7541dd8` 已删，不要再把 `tmp/blog-dnd-kenku/` 加回 main。
- 旧 WORKLOG 顶条的 HEAD、测试结果、端口监听都是 2026-09-11 的历史记录，不能当成这一班刚验证过。

### 怎么验证

本交接轮未跑产品测试。下一班如需核对仓库现状：

```bash
git rev-parse HEAD
git status --short --branch
git log --oneline -5
git log --oneline origin/main..HEAD
git show --stat --oneline 0f898a1
git show --stat --oneline 7541dd8
```

若要验证 Kenku 页（需先确认本仓库 dev server 仍在听，本会话未查端口）：

- `http://localhost:40001/blog/dnd-kenku`
- `http://localhost:40001/zh/blog/dnd-kenku`

优先本地 ego-browser、自有 task space。不要清用户 localStorage。仓库检查不能证明线上已更新。

## 交接单 · 2026-09-11 07:10 CST · Grok CLI

Codex 协调（Orca Run `run_6d6779be7161` / `term_989a84c7-184c-4f51-94b7-ac595f53e9cc`）监督，Grok CLI 写入本交接。不是所有权移交。用户已确认「不提交，只写 WORKLOG」。Q 与 R 都只改仓库里的 `WORKLOG.md`；不改代码、不重跑产品测试、不启停服务、不关终端。Q 曾额外创建临时旧正文校验副本 `/tmp/worklog-old-body-q-handoff.txt`，超出当时 Task「不得新增临时文件」的执行范围；未改产品，本 R 不删除该副本，留待用户决定。

### 本次目标

上传图片后整页滚到编辑器觉得卡。在不删编辑器功能、不改界面、不降画质、不改原滚轮语义的前提下，只做内部优化。

复现已经明确：预览画布 `wheel` 会 `preventDefault`，页面不跟着滚，图片缩放并触发重绘。本轮**保留**这个行为。不能对外说「已经消除页面滚动接管」或「卡顿已经消失」。

### 已完成

产品改动已在用户侧提交，不归功本交接轮。本交接轮只写文档。

- 当前 `git rev-parse HEAD`：`89866f050ae3d9d40ff6e2d0908d65384401380e`（`Merge branch '博客'`）。写交接前（07:07）工作区干净、无暂存，当时 `origin/main` 是 `ce07434`、`main` 超前 2。插入后复核（07:12）本地 `origin/main` 已等于该 HEAD；本 worker 未 `git fetch` / push，refs 变化来源 UNVERIFIED，不推断远程或线上。不要把历史 N/G 日志里的 `00acc07` 当成现在的 HEAD。
- 用户侧提交 `ce07434` 标题「解决卡顿问题」，含四文件、当时的 `WORKLOG.md`、以及 `DND-筛选后关键词清单.xlsx`。随后 `dd73c6c` / `89866f0` 是博客龙裔页合并，**未改这四文件**。`git diff ce07434 HEAD --` 四文件为空。
- 实现文件（与验收 sha256 一致，本轮 `shasum -a 256` 回读匹配，因此历史 F/P/N/G 证据仍绑定当前这四份源码）：
  - `src/components/editor/Canvas.tsx` `8dd259657289e3483ff5cccbdbe4f1a323dba5966691e2281238f7692e726f39`
  - `src/components/editor/Canvas.test.tsx` `866a14ddaf373dc7525f61f98f86020ffc3bb665510c16e0c7de2de0f7cbe3d5`
  - `src/lib/renderer/pipeline.ts` `1a81e42275abf73f62d3b9a62e2f9f686d19d15c81b8acd7d79a0849530944f6`
  - `src/lib/renderer/pipeline.test.ts` `6caab178ff92758f022418a542d6cab99f77052b06288412d44d0cdbd02da8a7`
- 四文件哈希一致仅确认优化源码版本；N的1560项全量测试和149页构建是合并前历史结果，本交接未对89866f0博客合并后的整仓重跑，当前整仓回归状态UNVERIFIED。
- `pipeline.ts`：按目标 canvas 用 `WeakMap` 复用 base canvas；`ctx.reset` 若存在就调用，否则写 `canvas.width/height` 清 clip 残留；高质量 smoothing 仍开。`Canvas.tsx`：同帧滚轮先累加再 `requestAnimationFrame` 提交；卸载取消；离散 `pointerdown` / `click` / `keydown` 先 `flushPendingImageScaleCommit`；仅 pending 时用 `react-dom` 公开 `flushSync`。仍 `import { flushSync } from 'react-dom'`，经 `useCanvasEditorState` 拿状态，**没有**直接 `@/lib/store/editor-store`。原图、DPR、阴影、文字 overlay、`drawTextBoxes`、PNG 导出 `clipFinalOutputToMask: true` 未删。预览 `wheel` 仍 `preventDefault` + `{ passive: false }`。
- 最终 G **ACCEPT**（历史终审，本交接轮未重跑）：`/tmp/token-maker-g-final-review-task_c00aa241ff00/REPORT.md`。当时审查 HEAD 是 `00acc07` + 脏四文件；四文件哈希与现在相同。
- 历史 N 命令证据（`/tmp/wheel-n-verify-XcWuIh/`，本交接轮未重跑）：`typecheck.exit` 0；`lint.exit` 0，0 error，既有 `CoatMakerSeoContent.tsx:25` `@next/next/no-img-element` warning；`pnpm-test.exit` 0，`Test Files  144 passed (144)` / `Tests  1560 passed (1560)`；`pnpm-build.exit` 0，Next.js 16.3.0，`Generating static pages ... (149/149)`。G 窄复核 59/59：`pnpm exec vitest run --no-cache src/components/editor/Canvas.test.tsx src/lib/renderer/pipeline.test.ts src/lib/architecture-boundaries.test.ts`（Canvas 39 + pipeline 17 + architecture 3）。
- 历史 F（`/tmp/token-maker-f-verify-task_4aa3715c34ba/`）：`pixels/head-vs-new-compare.json` `caseCount=12` `failedCount=0`，每案 `mismatchPixels=0`；PNG 512 双方 `bytes=129869`，PNG 1024 双方 `bytes=67288`。热路径不再每次新建 base canvas。
- 历史 P（`/tmp/token-maker-p-verify.L2WLAE/`）：`pixels/h-clip-reset.json` reset / 无 reset 对比 `mismatchPixels=0`。`counts/en-slider-arrow.json` 与 `zh-slider-arrow.json` 的 **1.17** 只在这组历史 fixture 条件下成立：`imageScale=1`、画布 `wheel` `deltaY=-100` pixel `deltaMode=0`、下一 rAF 提交被保持、焦点在缩放滑块、`nativeArrowRight` 一次；得到 1.17，匹配先提交再按键的顺序路径，不是 1.01。普通任意滚轮不保证 1.17。`counts/en-short-regression.json` 同帧两轮 `persistedScale=1.349858807576003`，`canvasCreateCount=0`。滚轮 `defaultPrevented=true`，EN `scrollY` 保持 776，ZH 保持 734。
- 历史浏览器已测：上传、图片拖动、缩放、边框、重置、撤销/重做、批量预览、PNG。文字拖动真实像素、ZIP/JPG/PDF、外部分享按钮未完整实测。
- Orca 只读：优化 Run `run_6d6779be7161` 上 **15** 个产品 Dispatch 全 `completed` / `succeeded`；对应 **12** 个不同 Grok 终端（不含本交接 worker）。`worker-list`：**10** `released`。F `ctx_23f0e7e5f9ef` / `term_9346d28f-b43b-4914-9c1b-816ce387d202` 与 P `ctx_280481e93f99` / `term_12ac2e11-8358-4787-898d-6b18841e4cd6` 会计仍是 `user_owned` + `user_takeover` retained。当前 `orca terminal list` 里 token-maker-app 只有协调者 `term_989a84c7`、本交接终端 `term_39978508-f84f-4025-95ee-7e1d85625f72`、验证服务 `term_dd3ab45a`；F/P 句柄**不在**当前列表。不能说 F/P 现在仍在跑，也不能说本轮关掉了它们。Q 交接是 `task_e72464148902` / `ctx_ffe94fa3743b`，完整句柄 `term_39978508-f84f-4025-95ee-7e1d85625f72`；Q 已完成，主脑按 `user_requested` retain。当前 R 复用同一终端：`task_471d1937ec92` / `ctx_7761bd96bd66`；结算后主脑再次 retain。历史 12 个优化 Grok 不变，不要把本终端算进那 12 个。
- 写交接时 `lsof`：`localhost:40001` 仍由 PID **18428** `next-server (v16.3.0)` 监听，cwd `/Users/wusir/Desktop/开发项目集合/token-maker-app`，父进程 18422；对应终端 `term_dd3ab45a` 标题 `Token Maker verification dev 40001`。本轮未启停。

### 做到一半

- 产品优化目标内没有未完成的编码项；本交接轮也没有未写完的模板段。
- 未完整浏览器实测：文字拖动像素、ZIP/JPG/PDF、分享/社交。不能保证所有功能场景。
- 不得宣传性能提升百分比、FPS、或卡顿彻底消失。F 的 180 次 wheel 触顶 scale 5、只 2 次 preview reset，和工作负载「每次 wheel 都整帧渲染」不同。
- `WORKLOG.md` 是本交接新增的未存档改动。用户已确认不提交。不要把它加进后续产品 commit。
- 期间出现范围外未暂存改动，本轮未修改、未还原。
- `/tmp` 历史证据这次还在；以后若被系统清理，缺失项必须标 UNVERIFIED，不能默认仍绿。

### 下一步

- 下一班输入 `$pickup` 接手。先读本交接、`git rev-parse HEAD`、四文件 sha256，再决定要不要动代码。
- 若要看页面：先重新 `lsof -nP -iTCP:40001 -sTCP:LISTEN` 确认监听和 cwd，再用 **EGO 自有 task space**。不要碰用户 task space / localStorage。优先 `http://localhost:40001`，不要随便换 `127.0.0.1`。
- 继续改滚轮交互、提交、部署、关闭旧终端：必须单独用户授权。本轮未授权。
- 不要 `git fetch` / push / deploy。不要把本文件塞进产品提交。

### 踩过的坑

- 初次 A 测试 `spyOn` 类型 TS2344；B 直接 `import` store 破坏架构边界。已由 I/J 修。
- 无 `ctx.reset` 时 clip 残留蓝像素。已由 K 修；P `h-clip-reset.json` 0 diff。
- 真实 ControlPanel 滑块 `ArrowRight` 曾把 pending 滚轮盖成 1.01。已由 N `flushSync` 修；P EN/ZH 真实键到 1.17。
- L 全套曾偶发找不到 Coat Maker `Saved Names`。历史记录不可掩盖；优化验收时最终N全绿；不覆盖后续整仓合并。该失败不在四文件内。
- M Header Ctrl+Z 套件顺序隔离是 history store 问题，**不是**四文件产品缺陷。
- 预览滚轮 `preventDefault` 是保留的旧手势，不是本轮新消掉的「页面滚动接管」。
- 本交接是文档轮：无编码授权。历史测试不要当成这一班刚跑过。
- Q 为核对旧正文创建了 `/tmp/worklog-old-body-q-handoff.txt`。这是 Q 历史额外临时写入，不是 R 创建；未改产品，不删除，留待用户决定。

### 怎么验证

下一班如需复测再运行；**交接轮未重跑**。

```bash
git rev-parse HEAD
shasum -a 256 src/components/editor/Canvas.tsx src/components/editor/Canvas.test.tsx src/lib/renderer/pipeline.ts src/lib/renderer/pipeline.test.ts
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec vitest run --no-cache src/components/editor/Canvas.test.tsx src/lib/renderer/pipeline.test.ts src/lib/architecture-boundaries.test.ts
```

浏览器（优先本地 ego-browser，自有 task space）：确认 `localhost:40001` 仍是本仓库后打开

- `http://localhost:40001/#editor-workspace`
- `http://localhost:40001/zh#editor-workspace`

关键动作：上传图片、拖动、滚轮缩放、滑块、边框、重置位置、撤销/重做、批量预览、下载 PNG。滚轮仍应拦住页面滚动并缩放图片。历史 1.17 只在 P 的 fixture 条件下成立：`imageScale=1`、画布 `wheel` `deltaY=-100` pixel `deltaMode=0`、下一 rAF 提交被保持、焦点在缩放滑块、`nativeArrowRight` 一次，结果匹配顺序路径。普通任意滚轮不保证 1.17；不要在正常手工操作里要求这个竞态值。下一班若要复测，复用 P 历史 artifact（`/tmp/token-maker-p-verify.L2WLAE/`）里的自有测试 fixture。不要清用户 localStorage。不要点分享/社交。仓库检查不能证明线上已更新。

## 交接单 · 2026-09-10 20:08 CST · Cursor Grok

### 本次目标

把已锁的 V6 `dnd-backgrounds-lock-r1` 写入现有 `/blog/dnd-backgrounds` 与 `/zh/blog/dnd-backgrounds`（project-write），不新建 slug，不部署。

### 已完成

- Orca Run `run_2c3cffec5e98`：Grok 写页 `task_789686c4fa82` / `ctx_6e012bf7a4bc`，另一个 Grok 只读复核 `task_d6c8c542182e` / `ctx_3d66b633399e`；两个 Task 均为 completed，Worker 均已 release。
- 代码已提交 `00acc07`，仅含 `src/lib/blog-posts/dnd-backgrounds.ts`、`src/lib/blog/registry.ts`、`src/lib/blog/dnd-backgrounds.test.ts`、`src/app/sitemap.test.ts`。`main` 比 `origin/main` 超前 1 个提交。未 push、未部署。
- 页面表面与交接一致：英文 Title `DnD 5e Backgrounds: Confirm the Year, Then Copy Fields`，H1 `Confirm the Rules Year Before You Copy a D&D 5e Background`；中文 Title `DND 5E 背景怎么选：先问年份，再按那一年抄进角色卡`，H1 `DND 5E 背景：先分清你在找什么，再按年份抄进角色卡`。`faqItems` 已去掉。`publishedAt` 仍为 `2026-08-26`，`updatedAt` 为 `2026-09-10`。
- 锁稿 hash 复核时仍为英 `54b5e7ab7cbde706b15b0de92fdd83f9627c0c932ab921013467a8c08f35a034`、中 `e76e247a56610a90109ab3df1404efa0cd797088847debd90c7a0c28028c10df`。
- 独立复核亲自跑过：`pnpm exec vitest run src/lib/blog/dnd-backgrounds.test.ts` 2/2 exit 0；`pnpm typecheck` exit 0；`pnpm lint` 0 errors（仅既有 `CoatMakerSeoContent.tsx:25` img warning）；`pnpm build` exit 0，149/149，含这两条路由。
- ego-browser 回读 `http://127.0.0.1:40001/blog/dnd-backgrounds` 与 `/zh/blog/dnd-backgrounds` HTTP 200；Title/H1/Description/引用 quote 与 href 对齐；无 FAQPage、无「五步筛选法」、无旧 H2 `Start with the rulebook year`。

### 做到一半

- 目标内写页工作无未完成项。
- `DND-筛选后关键词清单.xlsx` 仍是会话前已有的未存档改动，按用户选择未进 `00acc07`。
- 未 push、未部署；线上仍是旧文，不能声称已更新、已收录或已排名。
- 旧 content-only Run `run_f92d3b708837` 的 12 个 Task 此前已 completed；仍留 4 个失败重试的 retained worker（2 个 `user_takeover`、2 个 `identity_unproven`），不在本次写页范围。
- 交接文件里的 `publicFieldsHash` 仍未能独立复算，正文 hash 不受影响。

### 下一步

- 下一班输入 `$pickup` 接手。先读本交接单和 `git show --stat --oneline 00acc07`，再单独决定是否 push 或部署。
- 不要把 `WORKLOG.md` 加入后续代码提交。不要关闭标记为 `user_takeover` 的旧终端。

### 踩过的坑

- `worker-start --agent grok` 首次曾 `agent_prompt_blocked`；等 `tui-idle` 后用 `--retry-of` 加 `--terminal` 才注入成功。
- 第二次 `task-create` 曾卡住，改用 Python 直接传 `--spec` 才建成复核 Task。
- 写页 Grok 不能复核自己，必须另开 Grok。
- 博客列表页 sitemap `lastModified` 取全站最新 `updatedAt`，改这一篇会带动 page/5、page/6 的日期断言。
- 交接写明 Media none required、FAQ none；不要为迎合旧测试把 video/FAQ 塞回正文。中文锁稿已有 H1，页面模板也用 `post.title` 渲染 H1，`bodyHtml` 不能再输出第二个 H1。

### 怎么验证

```bash
git show --stat --oneline 00acc07
git status --short --branch
pnpm exec vitest run src/lib/blog/dnd-backgrounds.test.ts
pnpm typecheck
pnpm lint
pnpm build
```

浏览器优先本地 ego-browser。确认 token-maker-app 的 `pnpm dev --port 40001` 后打开 `http://127.0.0.1:40001/blog/dnd-backgrounds` 与 `http://127.0.0.1:40001/zh/blog/dnd-backgrounds`。核 Title、H1、Description、正文引用链接；确认无 FAQ、无「五步筛选法」。不要清理用户 localStorage。仓库检查不能证明线上已更新。

## 交接单 · 2026-09-06 09:57 CST · Codex CLI

### 本次目标

记录当前 dnd-giants 英文与中文页面重写及中文本地化任务的可核验状态。

### 已完成

- 写入已核对事实：Grok 完成结构性英文/中文重写；Grok 完成中文术语本地化；Cursor 独立复核；中文页无英文解释性括号；英文只保留必要关键词/品牌/来源；当前最新 commit 由 git show 确认为 138987635f366bf3b8fb01e0d4b3c4cd058da709，标题为“重写 DND gaints”，包含 src/lib/blog-posts/dnd-giants.ts、src/lib/blog/registry.ts、src/app/sitemap.test.ts；工作树在写交接单前 clean；未 push/deploy。

### 做到一半

无目标内未完成项。明确记录 V4.1 adapter 层残留：typed claimId/evidenceRefs AST 和 immutable handoff digest 未存入项目 checkout；它们不是本次页面文案范围。记录 coverAlt 中仍保留精确关键词 DND giants、站点侧栏 CTA 的 Token/Roll20/Foundry 属于范围外。

### 下一步

下一班输入 $pickup 接手；如继续修改 coverAlt、站点侧栏 CTA 或把 V4.1 handoff digest 持久化，先单独确认范围。不要把 WORKLOG.md 加入后续代码提交。

### 踩过的坑

必须使用 /Users/wusir/Desktop/obsidian/skill合集/tool-site-content-factory-v4.1，不要使用 AI内容工厂公开版或旧版 content skill；真正的 V4.1 中文计数是 Unicode letters/numbers，不是只数汉字；中文本地化只保留必要品牌/关键词，不能把普通规则术语留成英文；Grok 实现后必须由不同于实现者的 Cursor 只读复核；不要把 worker_done 口头报告当验证，必须记录真实命令/页面回读。

### 怎么验证

记录已经核对的真实证据：
- pnpm lint：exit 0；0 errors，只有范围外 CoatMakerSeoContent.tsx:25 的既有 no-img-element warning。
- pnpm typecheck：exit 0。
- pnpm test：143 files passed、1535 tests passed、exit 0（结构性重写验收前的完整回归）。
- pnpm build：exit 0；Next.js 16.3.0，147/147 静态页面。
- pnpm exec vitest run src/lib/blog/index.test.ts：124/124，exit 0。
- V4.1 zh-CN 本地化复核：unitCount=2253，NFC=true，无英文解释性括号；英文重写计数 2128，中文重写计数 2257。
- 本地页面 ego-browser：/blog/dnd-giants 与 /zh/blog/dnd-giants HTTP 200；H1、description、canonical、Article/FAQ JSON-LD 回读正常。
- git diff --check：exit 0。
- 只写交接单，不运行新功能验证；交接单写入后 WORKLOG.md 会成为唯一未存档改动，禁止提交它。

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
