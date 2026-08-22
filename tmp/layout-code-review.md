# Arrange / Name / Upload / globals.css 代码审查

日期：2026-08-22  
范围：`src/components/coat-of-arms/ArrangePanel.tsx`、`NamePanel.tsx`、`UploadPanel.tsx`、`src/app/globals.css`，以及本次 diff 涉及的 Arrange/Name/CoatOfArmsMaker 测试。  
边界：未审查或修改 Contact/SEO 残留文件，也未审查未列入范围的脏工作树变更；未修改源码、测试或配置。

## 结论

本次 diff 的主要阻塞问题在第 5 条 Fail Fast：Arrange 的数字边界允许空字符串和非有限数，Upload 的 Base64/XML/栅格解码错误没有带出导致失败的文件或原始值。另有一个测试耦合问题：`CoatOfArmsMaker.test.tsx` 通过精确匹配 `globals.css` 源文本来验证样式，测试与 CSS 排版方式强耦合。

## Findings

### [高][第 5 条 Fail Fast] Arrange 数字解析没有拒绝空字符串和非有限数

- 是什么：`readArrangeNumberInput` 只检查 `Number.isNaN`；`Number('')` 和 `Number('   ')` 会得到 `0`，`Number('Infinity')` 会得到 `Infinity`。`formatArrangeNumberForDisplay` 也只拒绝 `NaN`，会把 `Infinity` 格式化为字符串 `"Infinity"`。清空 X/Y/Rotation 输入时会直接把 0 写入命令，而不是立即报告非法原始输入；非有限值则要等命令层才失败。
- 位置：`src/components/coat-of-arms/ArrangePanel.tsx:168-180`；受控输入调用点 `:83-87`、`:106-110`、`:117`、`:131`。
- 证据：当前实现是 `const parsed = Number(rawValue)` 后仅 `if (Number.isNaN(parsed))`；本地只读验证输出 `{ empty: 0, infinity: Infinity, displayInfinity: 'Infinity' }`。新增测试 `src/components/coat-of-arms/ArrangePanel.test.tsx:118-123` 只覆盖 `not-a-number` 与 `NaN`，未覆盖空字符串、空白或 `Infinity`。
- 如何验证：在相同模块测试中调用 `readArrangeNumberInput('')`、`readArrangeNumberInput('Infinity')`、`formatArrangeNumberForDisplay(Number.POSITIVE_INFINITY)`；当前结果分别为 `0`、`Infinity`、`'Infinity'`。再对 Position X 的 number input 派发 `{ target: { value: '' } }`，观察 store 的 X 是否变为 `0`。
- 最小修复方向：解析前拒绝 `rawValue.trim() === ''`，并用 `Number.isFinite(parsed)` 作为唯一数值通过条件；显示格式化也应拒绝非有限数。错误信息保留原始字符串，例如 `Invalid arrange number input: ${rawValue}`，以满足坏值可定位要求。

### [高][第 5 条 Fail Fast] Upload 解码失败没有包含导致失败的文件/值

- 是什么：非法 Base64 分支抛出固定的 `Invalid upload Base64 data`，没有包含非法 Base64 值；Malformed SVG 分支抛出固定的 `Invalid SVG XML document`，没有文件名或导致失败的 XML/字节上下文；两条栅格解码失败分支只包含 MIME 类型，也没有文件名或坏数据上下文。`createValidatedLocalUpload` 没有在这些异常上补充 `file.name`。
- 位置：`src/components/coat-of-arms/UploadPanel.tsx:42-49`（Base64）；`:73-78`（SVG XML）；`:81-94`（栅格解码）；入口 `:108-114`。
- 证据：`extractStrictBase64('data:image/png;base64,not base64!', 'image/png')` 命中 `:47` 的固定错误字符串，错误文本不含 `not base64!`；`assertWellFormedSvg` 的 `:77` 固定错误不含上传文件名；`:87`、`:92` 只插入 `mimeType`。现有上传测试 `src/components/coat-of-arms/CoatOfArmsPanels.test.tsx:513-555` 只断言 `unsafe|svg` 或 `decode|image`，没有断言错误包含坏文件/值。
- 如何验证：调用 `extractStrictBase64` 传入上述坏 Base64 并检查 `toThrow` 的 message；用 `new File(['<svg><path d="M0 0">'], 'broken.svg', { type: 'image/svg+xml' })` 调用 `createValidatedLocalUpload`，检查错误 message 是否包含 `broken.svg`；将 `createImageBitmap` stub 为 reject 后上传 `broken.png`，检查错误 message 是否包含 `broken.png`。当前实现均缺少对应文件/值上下文。
- 最小修复方向：在 `createValidatedLocalUpload` 的文件边界统一补充文件名和 MIME 上下文，并让底层校验错误携带安全、有限的坏值诊断（例如非法原始字段/文件名；不要把完整大文件内容回显到 UI）。测试应逐条断言坏值或文件名在错误链路中保留。

### [中][第 1、3 条 高内聚/低耦合、公开接口] CSS 测试精确依赖 globals.css 源文本排版

- 是什么：`CoatOfArmsMaker.test.tsx` 读取 `src/app/globals.css` 的完整文本，并用 `toContain` 匹配一整行精确声明。新增的 pointer-cursor 测试同样精确匹配换行和声明顺序；CSS 只要换行、空格、声明顺序或等价变量写法变化，测试就会失败，即使浏览器计算样式没有变化。
- 位置：`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx:496-507`，尤其 `:497`、`:499`、`:504`、`:506-507`。
- 证据：测试直接 `readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')`，然后匹配完整 CSS 字符串，而不是从渲染页面读取计算样式或验证用户可见行为。本次 4 个目标相关测试文件当前虽通过，但该测试契约验证的是源码格式，不是公开 UI 行为。
- 如何验证：保持选择器和声明含义不变，只把 `:499` 的声明拆成多行或交换两个无关声明的顺序；当前测试会失败，而浏览器计算出的 `display/min-height/gap/cursor` 可以保持不变。更可靠的验证是启动本地页面后通过真实 DOM/计算样式断言关键选择器，或把 CSS 规则契约放进专门的样式测试并做规范化解析。
- 最小修复方向：删除对整行源码格式的依赖，改为行为/计算样式验证；如果必须做静态契约检查，先解析并规范化选择器与声明集合，不匹配空白和顺序。

## 按第 1–7 条逐条对照

1. **高内聚、低耦合**：Arrange 的数值格式化/解析各自是单一职责；Name/Upload 仍通过项目已有公开 hook/store/command 边界通信。上面的 CSS 源文本测试是确认到的低耦合问题。
2. **单一职责**：本次新增的 `scaleToPercent`、`formatArrangeNumberForDisplay`、`readArrangeNumberInput` 各自职责清楚；未发现本次 diff 新增的多职责函数问题。
3. **公开接口通信**：生产代码没有发现跨模块访问私有实现或私有状态；面板使用 `usePanelCommandError`、`useCoatProjectStore` 等公开边界。测试直接读取 `globals.css` 源文件的耦合问题见上。
4. **KISS**：本次改动没有发现需要 Strategy/class/额外抽象才能解决的实现；数字校验可以用简单的空值 + `Number.isFinite` 条件收紧。
5. **Fail Fast**：有上述两个高优先级问题：非有限/空 Arrange 数值未在输入边界拒绝；Upload 解码错误缺少坏值/文件上下文。命令层最终会拒绝部分 `Infinity`，但不能替代输入边界校验，也不能修复清空输入被转成 0 的语义。
6. **YAGNI**：指定 diff 未发现为未来扩展新增字段、依赖或抽象层；Contact/SEO 变更属于明确排除范围，未纳入判断。
7. **精确命名**：本次 diff 的新增/改动行中未发现 `data`、`temp`、`helper`、`util`、`manager` 这些禁止的通用变量名。`UploadPanel.tsx:112` 的 `const data` 不在本次 diff 的改动行内，因此未将其归责为本次实现改动。

## 验证记录

- `pnpm exec vitest run src/components/coat-of-arms/ArrangePanel.test.tsx src/components/coat-of-arms/NamePanel.test.tsx src/components/coat-of-arms/CoatOfArmsPanels.test.tsx src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`：4 files passed，150 tests passed。
- `pnpm typecheck`：通过。
- `pnpm lint`：通过。
- `git diff --check --`（目标文件）：通过，无 whitespace error。
- 使用本地 ego-browser 打开 `http://localhost:3000/coat-of-arms-maker`：页面可加载；本次运行的 `.coat-workbench-content` 为 `inert=true`，点击 Position/Charges 后 aria-selected 未变化，因此无法把该次浏览器运行当作交互验收证据。该静态/inert 运行时状态不在本次 Arrange/Name/Upload/globals.css 代码审查范围内，未据此新增源码问题。

## Verdict

**不建议按当前实现通过第 5 条 Fail Fast 审查。** 先修复 Arrange 的空值/非有限数边界和 Upload 解码错误上下文，再补对应测试；CSS 测试的源文本耦合应在后续一起收紧。除上述问题外，本次 diff 在第 1–4、6–7 条未发现新的可验证阻塞问题。
