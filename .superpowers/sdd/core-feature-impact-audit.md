# 当前移动端性能改动：核心功能影响审查

## 结论

**未发现已验证的核心功能回归。** 本次未提交改动没有改动上传实现、PNG 导出实现、编辑器状态或分析事件实现；聚焦回归测试 `36/36` 通过，且相关的上传、导出和桌面布局测试 `10/10` 通过。

唯一会改变用户可见流程的行为是有意为之：在 `<1280px` 的普通首页访问中，完整编辑器不再因滚动/接近视口而被动加载，用户须点击“打开编辑器”；初始直达链接、同页 `#editor-workspace` 锚点和预设 URL 仍会加载编辑器。移动端高 DPR 预览画布也被有意限制在每边最多 `1024px`，但 PNG 导出仍独立按 `state.exportSize` 离屏渲染。

本审查是代码与 Vitest/构建证据审查，未进行真实浏览器的手工上传、下载或生产分析网络事件观察；这些是剩余验证风险，不是已复现缺陷。

## 审查范围和依据

- 已阅读当前 `git diff` 的 8 个已跟踪文件，以及两个未跟踪的预览尺寸文件：
  `src/components/editor/preview-rendering.ts`、`src/components/editor/preview-rendering.test.ts`。
- 本次生产改动仅位于 `DeferredEditorLayout.tsx`、`Canvas.tsx`、`ContentSiteTopbar.tsx`、两份 i18n 字典和新预览尺寸帮助函数；PNG 导出、上传、编辑器状态和 analytics 源文件不在 diff 内。
- `git diff --check`：退出码 `0`。
- 本审查运行的聚焦验证：

  ```text
  pnpm exec vitest run src/components/layout/DeferredEditorLayout.test.tsx src/components/editor/Canvas.test.tsx src/components/editor/preview-rendering.test.ts src/components/site/SiteTopbarVisibility.test.tsx --reporter=verbose
  # 4 files, 36 tests passed, exit 0

  pnpm exec vitest run src/components/editor/ImageUploader.test.tsx src/components/editor/export-token.test.ts src/components/layout/EditorLayout.test.tsx --reporter=verbose
  # 3 files, 10 tests passed, exit 0
  ```

- 既有最终集成记录还显示：完整 `pnpm test` 为 `49 files / 294 tests`、`pnpm lint` 无诊断、`pnpm build` 完成编译、类型检查和 92 个静态页面生成；见 `.superpowers/sdd/integration-validation.md:29-41`。

## 已验证未影响

| 核心功能 | 已验证证据 |
| --- | --- |
| 桌面正常启动与接近视口预加载 | `DeferredEditorLayout` 仍使用同一动态导入的 `EditorLayout`（`src/components/layout/DeferredEditorLayout.tsx:7-10`），并仅在桌面保留 `120px 0px` 的观察器预加载契约（`:67-85`）。聚焦测试断言初始不加载和该 root margin（`src/components/layout/DeferredEditorLayout.test.tsx:111-118,159-166`），并断言跨越断点时桌面观察器被正确重建（`:168-194`）。实际编辑器布局、控制面板、Canvas 与模板面板的组合未改（`src/components/layout/EditorLayout.tsx:46-89`）；其布局测试通过（`src/components/layout/EditorLayout.test.tsx:61-84`）。 |
| 同页 `#editor-workspace` 锚点 | 已挂载的首页会监听原生 `hashchange`，且只接受准确的 `#editor-workspace`（`src/components/layout/DeferredEditorLayout.tsx:97-113`）。移动端同页锚点加载编辑器的测试通过（`src/components/layout/DeferredEditorLayout.test.tsx:196-214`）；“后来带上 `?preset` 但跳到非编辑器锚点”不会错误加载的反向测试也通过（`:216-236`）。首页 CTA 本身仍指向该锚点（`src/components/site/HomeSeoContent.tsx:244-247`）。 |
| 初始直达与预设直达 | 初始加载仍把编辑器锚点或 `preset`、`mask`、`border`、`borderTint`、`size` 任一查询参数视为直接编辑意图（`src/components/layout/DeferredEditorLayout.tsx:14-18,36-42,62-65`）。冷启动锚点和五种查询参数均有通过用例（`src/components/layout/DeferredEditorLayout.test.tsx:238-263`）。预设 URL 构造器仍生成这些参数加 `#editor-workspace`（`src/components/site/home-showcase-shared.ts:59-79`）。 |
| 上传后画布预览与编辑交互 | `Canvas` 仍在无图片时渲染 `ImageUploader`，有图片时渲染主 canvas 和文字覆盖层（`src/components/editor/Canvas.tsx:244-267`）；对应用例通过（`src/components/editor/Canvas.test.tsx:157-169`）。上传文件入口及其 `setImage`/`trackUploadImage` 逻辑未改（`src/components/editor/upload-files.ts:24-47`）；单图 input 仍调用加载函数的测试通过（`src/components/editor/ImageUploader.test.tsx:66-75`）。画布渲染仍将编辑状态传入 `renderToken`（`src/components/editor/Canvas.tsx:111-164`），且现有拖拽、文字覆盖、缩放显示与异步资源刷新用例均在本次聚焦运行中通过（`src/components/editor/Canvas.test.tsx:171-214,285-343`）。 |
| PNG 导出 | 生产导出仍直接把 `state.exportSize` 传给 `exportTokenAsPNG`（`src/components/editor/export-token.ts:73-80,82-111`），该函数仍新建离屏 canvas 并以传入的导出尺寸渲染（`src/lib/renderer/pipeline.ts:434-450`）。二者均不在当前 diff 中，也不依赖 `preview-rendering.ts`。导出/分享/直接保存的 3 个用例通过，包括 `exportSize` 传递与下载追踪（`src/components/editor/export-token.test.ts:68-127`）。 |
| 顶部导航与编辑器点击追踪 | `ContentSiteTopbar` 的唯一生产变化是移除文件首行的 `'use client'`；品牌链接仍以相同 `href`、`prefetch={false}` 和 children 使用 `TrackedEditorLink`（`src/components/site/ContentSiteTopbar.tsx:1-5,49-60`）。实际点击追踪仍位于未改动的客户端子组件：它对编辑器锚点调用 `trackStartEditor`，并在博客路径调用 `trackBlogToEditorClick`（`src/components/site/TrackedEditorLink.tsx:22-36`）。顶栏 source-boundary 与首页/内页可见性用例通过（`src/components/site/SiteTopbarVisibility.test.tsx:105-177`）；全量构建也通过，证明 Server Component -> Client Component 边界可编译。 |

## 已验证的刻意行为变化

1. **移动端普通打开改为显式启动。** 当真实媒体查询结果为非桌面且没有初始直达意图时，页面渲染“打开编辑器”按钮，而不创建 `IntersectionObserver`（`src/components/layout/DeferredEditorLayout.tsx:62-86,135-157`）。该按钮显示加载文案并在下一任务调度中挂载编辑器（`:115-121`）。测试明确覆盖“移动端被动滚动不观察/不加载”及按钮启动/卸载取消计时器（`src/components/layout/DeferredEditorLayout.test.tsx:120-129,265-294`）。

2. **移动端高 DPR 预览有像素上限。** 新帮助函数只在移动编辑器布局下把预览 backing canvas 限制为 `1024px`，桌面仍为 `round(cssSize * devicePixelRatio)`（`src/components/editor/preview-rendering.ts:1-13`）。`Canvas` 只把结果用作预览 `canvasSize`（`src/components/editor/Canvas.tsx:63-98,100-145`）；聚焦用例验证移动 cap、桌面未裁剪，以及不触发新 resize 时两种断点切换（`src/components/editor/Canvas.test.tsx:216-283`；`src/components/editor/preview-rendering.test.ts:4-12`）。这会降低高 DPR 移动端的预览清晰度上限，但不改变导出 PNG 尺寸。

3. **内容页顶栏成为服务端外壳。** 移除了顶栏级客户端边界，但保留 `TrackedEditorLink` 这个最小客户端追踪岛；链接文案、地址、DOM 结构与追踪逻辑均未改（`src/components/site/ContentSiteTopbar.tsx:28-84`，`src/components/site/TrackedEditorLink.tsx:17-36`）。

## 仍有未验证风险（非已发现缺陷）

1. **没有真实浏览器端到端证据。** 当前覆盖使用 jsdom、mock 的 `next/dynamic`、`IntersectionObserver`、`ResizeObserver` 和 `matchMedia`。因此尚未在真实移动设备/浏览器观察：点击同页锚点后的焦点与滚动位置、实际图片上传后的像素预览、浏览器文件下载，以及断点切换时的视觉效果。代码与构建/单测均通过，但这不是替代真实设备验证。

2. **没有生产 analytics 网络请求断言。** `TrackedEditorLink` 和 analytics 实现不在 diff 中，且客户端追踪岛被保留；不过本轮没有在配置了生产 GA 环境变量的浏览器中捕获 `start_editor` 或 `blog_to_editor_click` 请求。该风险仅限运行时观测层，非本 diff 已证实的逻辑回归。

3. **`matchMedia` 是新增的运行时前提。** `DeferredEditorLayout` 与 `Canvas` 现在都会调用 `window.matchMedia`（分别见 `src/components/layout/DeferredEditorLayout.tsx:20-33`、`src/components/editor/Canvas.tsx:67-97`）。目标现代浏览器支持该 API，构建和 mock 覆盖均通过；但本轮未在不支持它的旧浏览器上运行，因此未验证其降级行为。
