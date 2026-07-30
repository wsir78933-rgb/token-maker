# Task 6：本地项目与导出生命周期证据

## 范围

本次只覆盖免费、纯浏览器本地的项目与导出生命周期。没有新增远程请求、账户、登录、付费、云端存储或源站资产/品牌。

## 预检结论

以下能力在开始修改前已经存在，并由现有测试或实现边界确认：

- `project-storage.ts` 使用专用浏览器 `localStorage` 键保存具名项目和独立草稿；没有服务端或云端后端。
- `ProjectLibraryDialog` 在 `importProjectDocument()` 验证成功前不会调用 `onProjectChange`；超大 JSON 会在读取文件内容前拒绝。
- `UploadPanel` 先检查 MIME、文件名和大小，再检查 SVG/XML 或栅格可解码性；命令边界还会验证字节签名、安全 SVG、累计大小、数量和重复上传 ID，并以一条命令原子写入。
- 导出实现已有 PNG/JPG/PDF、实际 JSZip ZIP 互操作、同名 ZIP 条目去重、项目纵横比换算，以及复制、分享、打印能力不可用时的显式失败。
- SSR 首次渲染不会读取草稿；编辑器没有 `fetch`、账户或付费入口。

确认的缺口只有一个：导出尺寸原来只保存在 `ExportMenu` 的 React state，未进入版本化本地偏好；各导出动作也没有在触发时重新读取最新偏好。因此质量和尺寸不能共同保证使用最新的原子本地设置。

## 实施

- `src/lib/coat-of-arms/editor-preferences.ts`
  - 增加受限的 `exportSize` 偏好（256、512、1024、2048）。
  - 保持版本 1 兼容：缺少该字段的既有 v1 本地文档会补入 1024 并写回；v0 迁移也写入该默认值。
  - 非法持久化尺寸会以实际非法值失败，例如 `123`。
- `src/components/coat-of-arms/ExportMenu.tsx`
  - 尺寸选择与 JPG 质量一起通过 `updateEditorPreferences` 写入同一份浏览器本地偏好。
  - PNG、JPG、复制、分享、PDF、打印、ZIP 均在点击时读取最新本地偏好快照；JPG 从同一快照取得质量。
- `src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`
  - 验证完整本地保存、另存为、重命名、加载、非法 JSON 导入不丢当前项目/记录、删除指定记录。
  - 验证所有输出格式使用最新的 2048/ultra 快照，且无效持久化尺寸显示 `123` 并保持活动项目。
- `src/lib/coat-of-arms/editor-preferences.test.ts`
  - 验证既有 v1 本地文档升级时补入默认导出尺寸。

## RED 证据

在实现前运行：

```text
pnpm test src/components/coat-of-arms/CoatOfArmsMaker.test.tsx --reporter=verbose
```

结果：2 个新增合同失败。

1. 改为 512px 后，持久化偏好中没有 `exportSize`。
2. 包含 `exportSize: 123` 的本地偏好只报出字段名 `exportSize`，未报告非法值 `123`。

## GREEN 与回归证据

```text
pnpm test src/lib/coat-of-arms/project-storage.test.ts \
  src/lib/coat-of-arms/export.test.ts \
  src/lib/coat-of-arms/editor-preferences.test.ts \
  src/components/coat-of-arms/CoatOfArmsMaker.test.tsx \
  src/components/coat-of-arms/CoatOfArmsPanels.test.tsx \
  src/components/coat-of-arms/SettingsPanel.test.tsx --reporter=dot
```

- 退出码：0
- 结果：6 个测试文件、155 个测试全部通过。
- 包含实际 `JSZip.loadAsync()` ZIP 读取验证、项目画布纵横比的 PNG/JPG/PDF/打印验证、项目存储/导入验证和上传原子校验。

```text
pnpm lint
```

- 退出码：0。

```text
git diff --check
```

- 退出码：0。

```text
pnpm exec tsc --noEmit
```

- 退出码：1；未通过原因不在本次改动范围：
  - `src/components/site/home-showcase-shared.test.ts` 第 57–59 行：`borderTint` 不存在及 `string | undefined` 不能传给 `string`（3 个错误）。
  - `src/lib/coat-of-arms/field.test.ts:98`：只读颜色元组不能赋给可变 `string[]`（1 个错误）。

## 已知浏览器限制

- 原生复制、分享和打印取决于浏览器能力、用户手势和弹窗策略。实现会检测能力，并在不可用时显示本地化错误；不会静默吞掉失败。
- jsdom 无法完成下载锚点导致的跨文档导航，因此聚焦测试会输出 4 条 `Not implemented: navigation to another Document`。这不影响断言：该命令退出 0，且测试已验证对象 URL、下载名、URL 回收和相应导出调用。真实系统分享面板、系统剪贴板和打印对话框仍需在具备相应浏览器能力的交互会话中确认。

## 测试夹具复核（2026-07-30）

本节以当前结果取代上一节中“聚焦测试会输出 4 条导航错误”的描述：该测试夹具缺陷现已在源头被覆盖，不再接受或静默忽略该错误。

- P1：`CoatOfArmsMaker.test.tsx` 的全格式导出测试先通过 jsdom `VirtualConsole` 收集 `jsdomError`。未替身时 RED 证据为 4 条 `Not implemented: navigation to another Document`；现在仅替身该测试触发的下载锚点 `click()`，并断言确实调用 4 次及收集到的 `jsdomError` 为空。没有全局压制 `console.error`。既有项目 JSON 下载测试仍独立断言下载名、`URL.createObjectURL()` 和 `URL.revokeObjectURL()`。
- P2：`CoatOfArmsMaker.ssr.test.tsx` 现为 `@vitest-environment node`，使用 `react-dom/server` 的 `renderToString()`。渲染期间 `globalThis.window`、`globalThis.document` 与 `globalThis.localStorage` 均为抛错 getter；所以 Maker 的任一直接浏览器 API 访问会失败。最初 RED 堆栈唯一来自依赖 `@base-ui/react/esm/utils/useRenderElement.js:57`（由生产 `Button` 触发的 `document` 访问）。测试仅以带 ref 的原生 `button` 替身隔离该依赖，未修改生产 Button，且没有剩余 Maker/项目生命周期直接访问堆栈。
- 最新聚焦回归：

```text
pnpm test src/lib/coat-of-arms/project-storage.test.ts \
  src/lib/coat-of-arms/export.test.ts \
  src/lib/coat-of-arms/editor-preferences.test.ts \
  src/components/coat-of-arms/CoatOfArmsMaker.test.tsx \
  src/components/coat-of-arms/CoatOfArmsMaker.ssr.test.tsx \
  src/components/coat-of-arms/CoatOfArmsPanels.test.tsx \
  src/components/coat-of-arms/SettingsPanel.test.tsx --reporter=dot
```

  - 退出码：0；7 个测试文件、157 个测试全部通过；没有导航错误输出。
  - `pnpm lint`：退出码 0。
  - `git diff --check`：退出码 0。
  - `pnpm exec tsc --noEmit` 仍为上文列出的 4 个既存、范围外错误；本次测试夹具未新增类型错误。
