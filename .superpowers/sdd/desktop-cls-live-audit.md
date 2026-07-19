# 首页桌面 CLS 只读实测审计

审计时间：2026-07-19（Asia/Shanghai）  
范围：`/` 首页、宽度 `>= 1280px` 下 `DeferredEditorLayout` 占位态切换到动态 `EditorLayout` 的过程。  
约束：未修改应用源码、配置或依赖；未提交。

## 结论

目前**不能把“占位符替换为 EditorLayout 导致 document height 改变”列为已实测的 CLS 根因**。

已实测的本地首页初始 HTML 中，编辑器位置是 `data-testid="deferred-editor-placeholder"` 的占位容器；静态源码确认桌面交叉观察器会把它替换成动态编辑器。但是，本轮没有得到可操作的浏览器会话，因而没有采集到真实的 `layout-shift` 条目、其 `sources`，或替换前后的 `document.documentElement.scrollHeight` 时间序列。

反而从当前高度契约看，根节点的高度本意是稳定一屏：占位态为 `min-h-[100svh]`，编辑器态为 `min-h-[100svh] xl:h-screen`。在普通桌面浏览器中 `100svh` 与 `100vh` 通常相等，所以仅凭代码不能证明这里存在高度差；也不能排除实际环境中由 viewport 单位、滚动条、字体、动态子树或其它页面资源引起的 shift。

## 已实测证据

### 本地运行页

- 发现目标仓库自己的 Next 16.2.4 开发服务器正在 `127.0.0.1:3000` 监听，进程工作目录为本仓库。
- 对 `http://127.0.0.1:3000/` 发起只读 HTTP 请求，收到 `200 OK`。
- 响应 HTML 已包含：

  ```html
  <div id="editor-workspace" data-testid="deferred-editor-placeholder"
       class="editor-shell flex min-h-[100svh] ...">
  ```

  此初始 HTML 中该位置是 skeleton，不是 `EditorLayout` 的 Header / ControlPanel / Canvas / TemplatePanel 结构。因此“初始页面先占位、随后由客户端挂载编辑器”是实测事实。

- 响应同时引用了 `EditorLayout` 的客户端 chunk。这说明客户端资源可被预取/下载；但 HTTP 响应本身不能证明它何时执行、DOM 何时替换，不能用于计算 CLS。

### 浏览器测量可用性

- 本机 `127.0.0.1:9222` 有 Chrome 150 的 DevTools 端点，且当时只有 `about:blank` 页面目标。
- 本会话提供的浏览器控制运行时返回的可用浏览器列表为 `[]`。按该运行时的约束，不能绕过空绑定改用另一套控制方式。
- 因此以下数值均**未测量**：CLS 总值、每个 `layout-shift` 的 `value`/`hadRecentInput`/`sources`、替换时刻、替换前后 `scrollHeight` 与元素几何尺寸。

## 已验证的代码路径

1. 首页在 Hero 后、展示区前渲染 `<DeferredEditorLayout />`：
   - `src/app/(en)/page.tsx:68-72`
   - `src/app/(zh)/zh/page.tsx:68-72`
2. 首屏 `shouldLoadEditor` 为 `false`，因此返回 skeleton 占位容器；它有 `min-h-[100svh]`：
   - `src/components/layout/DeferredEditorLayout.tsx:50-54`
   - `src/components/layout/DeferredEditorLayout.tsx:127-154`
3. 宽度 `>=1280px` 时，组件用 `IntersectionObserver` 观察占位容器；进入视口或距视口 120px 时设置 `shouldLoadEditor=true`：
   - `src/components/layout/DeferredEditorLayout.tsx:10-12`
   - `src/components/layout/DeferredEditorLayout.tsx:69-97`
4. 状态为真时，原占位节点被 `EditorLayout` 取代：
   - `src/components/layout/DeferredEditorLayout.tsx:123-125`
5. 编辑器根节点在移动端为 `min-h-[100svh]`，在 `xl` 为 `h-screen` 且 `overflow-hidden`：
   - `src/components/layout/EditorLayout.tsx:47-51`
6. 现有组件测试只覆盖“初始不挂载”和桌面 `rootMargin: 120px` 的意图，没有测试真实尺寸、文档高度或 PerformanceObserver 条目：
   - `src/components/layout/DeferredEditorLayout.test.tsx:111-117`
   - `src/components/layout/DeferredEditorLayout.test.tsx:158-165`

## 归因判断

| 候选原因 | 结论 | 依据 |
| --- | --- | --- |
| 动态替换确实发生 | 已验证 | 状态分支和现有测试明确覆盖。 |
| 替换发生在桌面首屏/近首屏 | 已验证为设计意图；具体时刻未实测 | 桌面观察器的 `rootMargin` 为 `120px 0px`。 |
| 替换造成 document height 改变 | 未证实 | 两态都以一屏高为设计目标；没有浏览器几何记录。 |
| 替换是当前 CLS 的归因来源 | 未证实 | 没有 `layout-shift` 条目及受影响节点 `sources`。 |
| 占位/编辑器根高度契约不完全一致 | 已验证 | 一个是 `min-h-[100svh]`，另一个在桌面额外指定 `h-screen`。这是一项值得消除的风险，不等于已证明的故障。 |

## 最小修复方向（仅在浏览器复测证实高度差后执行）

先只收紧桌面占位态的高度契约，使它与现有桌面编辑器根节点一致：在 `DeferredEditorLayout` 的占位容器上增加 `xl:h-screen`（必要时与编辑器一致地增加 `xl:overflow-hidden`），而保留现有 `min-h-[100svh]` 作为移动端高度策略。

这项改动的边界应当是：

- 保留桌面 `IntersectionObserver`、`120px` 预加载和动态 import；不要为消除 CLS 而将编辑器改为首屏同步挂载。
- 保留移动端“显式打开编辑器”的按钮和其 `min-h-[100svh]` 行为；不要把 `xl` 专用规则扩大到移动端。
- 不改变 `EditorLayout` 的 `xl:h-screen xl:overflow-hidden` 桌面工作区策略，避免 ControlPanel/Canvas/TemplatePanel 的可视区域回归。

若复测显示两态的根高度已经相同而仍有 CLS，修复不应猜测性地改高度；应以 `layout-shift` 的 `sources` 为准，另查 Header、字体换行、图片固有尺寸或位于编辑器之后的内容。

## 建议的浏览器复测脚本

在能控制 Chrome 的会话中，以至少 `1280x800` 和一个常用桌面高度各跑一次冷加载；注入如下只读观测器，再访问 `/`：

```js
const samples = [];
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      samples.push({
        value: entry.value,
        startTime: entry.startTime,
        sources: entry.sources.map((source) => ({
          node: source.node?.outerHTML?.slice(0, 220) ?? null,
          previousRect: source.previousRect,
          currentRect: source.currentRect,
        })),
      });
    }
  }
}).observe({ type: 'layout-shift', buffered: true });

const snapshot = (label) => {
  const placeholder = document.querySelector('[data-testid="deferred-editor-placeholder"]');
  const editor = document.querySelector('#editor-workspace.editor-shell');
  return {
    label,
    now: performance.now(),
    documentHeight: document.documentElement.scrollHeight,
    bodyHeight: document.body.scrollHeight,
    placeholder: placeholder?.getBoundingClientRect().toJSON() ?? null,
    editor: editor?.getBoundingClientRect().toJSON() ?? null,
  };
};
```

采样点至少包括：解析初始 HTML 后、hydrate 后、占位观察器触发前、`EditorLayout` 出现后，以及页面静止 1 秒后。验收应同时满足：两态 `documentHeight` 不变（允许浏览器像素舍入），无非用户输入 CLS，且 `sources` 不包含占位符、编辑器或其后的展示区/SEO 区块。

## 本轮未执行事项

- 未修改任何应用代码、测试、配置或依赖。
- 未运行构建、生产启动或会写入构建缓存的命令。
- 未报告未经浏览器测量支持的 CLS 数值或 root-cause 结论。
