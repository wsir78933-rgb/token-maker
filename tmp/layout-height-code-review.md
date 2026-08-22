# 编辑器高度实现代码审查（只读）

日期：2026-08-22  
仓库：`/Users/wusir/Desktop/开发项目集合/token-maker-app`  
范围：本次高度实现涉及的 `src/app/globals.css` 与 `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`，以及顶栏高度契约在 `CoatOfArmsMaker.tsx` 的调用侧。  
边界：未修改产品源代码、测试或配置；只写入本报告。未审查或处理 Contact/SEO 残留文件，也未把 Shields 文案、Upload 或其他脏工作树变更归入本次高度审查。

## 结论

桌面 `1512×738` 的正常视口高度链已对齐到 `99 + 50 + 40 = 189px`，画板实测填满 `549px` 场；但短桌面视口会触发工作台 `min-height: 38rem`，此时画板仍按 `100svh` 计算，和实际 grid 场高度脱节。另一个问题是高度回归测试读取并精确匹配 `globals.css` 源文本，没有验证真实布局，因此当前聚焦测试全绿不能覆盖该短视口问题。

## Findings

### [中高][规则 1：高内聚、低耦合] 画板尺寸依赖视口高度而不是实际场容器高度

- **位置**：`src/app/globals.css:1350-1354`（工作台 `height: 100svh` 与 `min-height: 38rem`）；`src/app/globals.css:1592-1594`（画板宽度用 `100svh - var(--coat-editor-chrome-height)` 计算）。
- **问题**：工作台允许自身高度被 `min-height: 38rem` 撑到 608px，但画板公式仍使用视口的 `100svh`。当视口低于 608px 时，实际 `.coat-target-artboard-wrap` 高度与公式使用的可用高度不是同一个布局边界，画板因此不能填满现有场。
- **证据**：正常桌面 `1512×738` 实测 `.coat-target-workbench=738px`、`.coat-target-scene=589px`、`.coat-target-artboard-wrap=549px`、`.coat-target-artboard=549px`；同一页面将视口设为 `1512×500` 后，工作台仍为 `608px`、scene 为 `459px`、wrap 为 `419px`，但画板只有 `311px`（`y=243`、`bottom=554`），wrap 内留下 `108px` 的垂直空白。`1512×600` 也可复现：wrap 为 `419px`，画板只有 `411px`。
- **如何验证**：用本地 `http://localhost:3000/coat-of-arms-maker`，确认 `.coat-workbench-content` 不带 `inert`、没有草稿 overlay 后，在真实浏览器分别测量 `getBoundingClientRect()` 的 `.coat-target-workbench`、`.coat-target-artboard-wrap`、`.coat-target-artboard`；通过 CDP 将桌面视口设为 `1512×500` 或 `1512×600`，即可复现上述尺寸差异。不要用 `127.0.0.1`。
- **最小修复方向**：让画板的高度约束直接取 `.coat-target-artboard-wrap` 的实际可用高度（保留画布 `aspect-ratio` 和水平空间限制），不要用独立的 `100svh - 189px` 复制 grid 高度；并补一条低于 `38rem` 的真实布局回归。

### [中][规则 1、3：低耦合与公开边界] 高度测试耦合 `globals.css` 源文本，没有测试公开布局行为

- **位置**：`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx:432-456`、`:1294-1320`，尤其 `:433-436`、`:1295-1299`、`:1317-1320`。
- **问题**：测试通过 `readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')`，再用 `toContain` 精确匹配整段 CSS 字符串。它验证的是选择器、换行、声明顺序和源码排版，而不是画板是否填满实际场；当前 `1512×500` 的布局缺陷不会让这些测试失败。
- **证据**：`pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx` 当前为 **1 file / 95 tests passed**，`pnpm typecheck` 通过；但真实浏览器在 `1512×500` 仍测得 wrap `419px`、画板 `311px`。这说明静态字符串契约与用户可见布局之间缺少公开行为验证。
- **如何验证**：打开上述测试文件，确认高度断言均来自 `readFileSync(...globals.css...)` 与 `toContain`，没有 `getComputedStyle`、`getBoundingClientRect` 或真实浏览器断言；再按上一条验证步骤复测短视口即可得到“测试全绿、布局不填满”的组合结果。
- **最小修复方向**：保留必要的静态 CSS 契约时，另加基于真实浏览器或可布局的 E2E 几何断言，至少覆盖 `1512×738` 和低于 `38rem` 的桌面视口；不要把 CSS 空白/换行/声明顺序当作高度行为接口。

## 按规则 1–7 对照

1. **高内聚、低耦合**：有上面两项确认问题：画板公式与实际 grid 场脱钩；测试与 CSS 源文本排版强耦合。
2. **单一职责**：本次高度 diff 中未发现新的多职责函数问题；高度变化主要由现有 CSS 规则承担。
3. **公开接口通信**：生产高度代码未发现跨模块访问私有状态；但高度测试直接读取 `globals.css` 内部源文本，见第二项。
4. **KISS**：未发现新增 class、Strategy 或不必要抽象；第一项应优先修正高度来源，而不是继续增加魔法数字。
5. **Fail Fast**：高度代码没有可见的数据边界输入；本次未发现可归因于高度 diff 的 silent fail。
6. **YAGNI**：未发现高度 diff 新增未来扩展字段、依赖或抽象层。
7. **精确命名**：`--coat-editor-chrome-height` 能描述其用途；本次高度 diff 未发现通用的 `data` / `temp` / `helper` / `util` / `manager` 变量命名问题。

## 验证记录

- 本地页面：`http://localhost:3000/coat-of-arms-maker`；桌面正常视口 `1512×738` 实测顶栏 `99px`、actionbar `50px`、canvas toolbar `40px`、画板 `549px`；草稿 overlay 未使 workbench 保持 inert。
- 短视口：真实浏览器 CDP 测量 `1512×600` 与 `1512×500`，复现第一项中的实际尺寸与空白。
- `pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`：1 file、95 tests passed。
- `pnpm typecheck`：通过。
- `git diff --check -- src/app/globals.css src/components/coat-of-arms/CoatOfArmsMaker.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx src/components/coat-of-arms/workbench-copy.ts`：通过。

## Verdict

**不建议按当前实现通过高度代码审查。** 正常 `1512×738` 视觉口径已达到目标，但必须先处理 `min-height` 与 `100svh` 分裂造成的短桌面空白，并补真实布局回归；静态 CSS 字符串测试不能单独作为高度验收证据。
