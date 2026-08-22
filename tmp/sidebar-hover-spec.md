# coamaker.com 左栏嵌套项 hover 规格

来源：https://coamaker.com/（Coat editor 左栏，Charges 展开后的 `menu-sub-button`）  
侦察：本地 ego-browser task space `sidebar hover parity`（公开站点，未用 127.0.0.1）  
日期：2026-08-22  
视口：`innerWidth 1496 × innerHeight 756`，`devicePixelRatio 2`，根字号 `17px`，`visualViewport.scale 1`

对照图：

- `tmp/sidebar-hover-coamaker-rest.png` — Charges 展开、指针离开嵌套项
- `tmp/sidebar-hover-coamaker-animals.png` — 指针停在 **Animal**（竞品标签；对应本地「Animals」）
- `tmp/sidebar-hover-coamaker-ordinaries.png` — 指针停在 **Object**（见下方标签说明）

本文件只记录实测值。没有观测到的属性会写「未观测到」，不编造。

---

## 标签对照（必须先读）

竞品 Charges 下的嵌套项实测为：

`Animal` / `Object` / `Plant` / `Human` / `Symbol` / `Upload`

- 全页文本搜索 **没有** `Ordinaries` / `Ordinary` / `Animals`（复数）。
- 本地「Animals」对应竞品 **Animal**（单数）。截图文件名按任务要求使用 `animals`。
- 本地「Ordinaries」在竞品左栏 **不存在**。`tmp/sidebar-hover-coamaker-ordinaries.png` 记录的是 **Charges > Object** 的 hover。Object 与 Animal 使用同一套 class（`data-sidebar="menu-sub-button"`），hover 计算样式与 Animal 相同。不能把 Object 当成 Ordinaries 文案或信息架构。

---

## 结论（给实现对齐）

嵌套项 hover **不是** 铜色 / 黄色模糊发光。

它是同一颗 `a[data-sidebar="menu-sub-button"]` 上的浅一档深灰圆角条：

| 层 | 颜色 |
|---|---|
| 左栏底 | `--sidebar: #474747` → 计算 `rgb(71, 71, 71)` |
| hover / :active / `[data-active=true]` | `--sidebar-accent: #5a5a5a` → 计算 `rgb(90, 90, 90)` |

`background-image: none`，`box-shadow: none`，`filter: none`。圆角来自 Tailwind `rounded-md` → `border-radius: var(--radius-md)`，`--radius-md: .1875rem`，计算 **`3.1875px`**。

用户截图估计的「约 6–8px 圆角」：在 `devicePixelRatio = 2` 下，`3.1875 CSS px` = **6.375 设备像素**，和「看起来大约 6–8px」一致。实现应对齐 **CSS 像素 3.1875px / 0.1875rem**，不要写成 6–8px。

---

## 目标节点

```
a[data-sidebar="menu-sub-button"]
class 含：
  flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden
  rounded-md px-2 cursor-pointer text-sm
  text-sidebar-foreground
  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
  active:bg-sidebar-accent active:text-sidebar-accent-foreground
  data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground
```

父级嵌套列表：

```
ul[data-sidebar="menu-sub"]
class: mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5
```

左栏容器：

```
div.flex.h-full.w-(--sidebar-width).flex-col.bg-sidebar.text-sidebar-foreground.border-r.border-sidebar-border
--sidebar-width: 170px
```

---

## 1. 嵌套项 hover（主目标）

来源默认是 **计算样式**（`getComputedStyle` + CDP `CSS.getMatchedStylesForNode` + `CSS.forcePseudoState(['hover'])`）。  
「CSS 规则」指匹配到的声明原文。  
「CSS 变量」指元素上读到的 custom property。  
截图只用来核对有无发光，不发明数值。

| property | value | source |
|---|---|---|
| background-color | `rgb(90, 90, 90)` | 计算样式。规则 `.hover\:bg-sidebar-accent:hover { background-color: var(--sidebar-accent) !important }`。变量 `--sidebar-accent: #5a5a5a` |
| background-image | `none` | 计算样式 |
| border-radius | `3.1875px`（四角相同） | 计算样式。规则 `.rounded-md { border-radius: var(--radius-md) !important }`。变量 `--radius-md: .1875rem`。根字号 17px → `0.1875 × 17 = 3.1875` |
| box-shadow | `none` | 计算样式。截图 nested hover 条上也看不到外发光 |
| filter | `none` | 计算样式 |
| outline | `rgb(243, 240, 235) none 0px`（hover 时） | 计算样式。`outline-style: none`，不可见。class 有 `outline-hidden` |
| padding | `0px 8.5px`（上下 0 / 左右 8.5） | 计算样式。规则 `.px-2 { padding-inline: calc(var(--spacing) * 2) !important }`。`--spacing: .25rem` → `0.5rem = 8.5px` |
| height | `29.75px` | 计算样式。规则 `.h-7 { height: calc(var(--spacing) * 7) !important }`。`7 × 0.25rem = 1.75rem = 29.75px` |
| width | `111px` | 计算样式 / `getBoundingClientRect`。这是当前栏宽下的布局结果，不是写死的 token。换栏宽会变 |
| color | `rgb(243, 240, 235)` | 计算样式。规则 `.hover\:text-sidebar-accent-foreground:hover { color: var(--sidebar-accent-foreground) !important }`。变量 `--sidebar-accent-foreground: #f3f0eb` |
| font-size | `14.875px` | 计算样式。规则 `.text-sm { font-size: var(--text-sm) !important }`。`--text-sm: .875rem` → `0.875 × 17 = 14.875` |
| font-weight | `400` | 计算样式 |
| transition | `all 0.2s linear`（计算 `transition: 0.2s linear`） | 计算样式。匹配规则是站点主题 `a { transition: all .2s linear }`，**不是** Tailwind sidebar utility。嵌套项是 `<a>`，所以吃到这条 |

未单独作为计算属性列出、但 class / 布局里能读到的：

| property | value | source |
|---|---|---|
| display | `flex` | 计算样式 |
| align-items | `center` | 计算样式 |
| gap | `8.5px` | 计算样式（`gap-2`） |
| overflow | `hidden` | 计算样式 |
| cursor | `pointer` | 计算样式 |
| transform | `none`（计算） | 计算样式。class 有 `-translate-x-px`，但当前计算 `transform: none`（可能被后续规则抵消）。未把「1px 左移」当 hover token |
| border | `0px solid rgb(243, 240, 235)` | 计算样式。无可见边框 |
| opacity | `1` | 计算样式 |
| 图标颜色 | class `[&>svg]:text-sidebar-accent-foreground` | 只观测到 class，未对 SVG 再跑一遍计算样式 |

截图核对（非数值来源）：Object hover 与 Animal 选中态都是左栏里一块略浅的深灰圆角条，无铜色、无黄边、无模糊光晕。

---

## 2. 嵌套项 rest（未选中、未悬停）

以 Charges > Object / Plant 在指针离开左栏时为准。

| property | value | source |
|---|---|---|
| background-color | `rgba(0, 0, 0, 0)` | 计算样式 |
| background-image | `none` | 计算样式 |
| border-radius | `3.1875px` | 计算样式（圆角常在，不只 hover 才有） |
| box-shadow | `none` | 计算样式 |
| filter | `none` | 计算样式 |
| outline | `rgb(255, 255, 255) none 3px` | 计算样式。style 仍是 `none`，不可见。宽度 3px 是 `outline-hidden` 的预留，不是画出来的环 |
| padding | `0px 8.5px` | 计算样式 |
| height | `29.75px` | 计算样式 |
| width | `111px` | 计算样式 |
| color | `rgb(255, 255, 255)` | 计算样式。`--sidebar-foreground: #fff` + `.text-sidebar-foreground` |
| font-size | `14.875px` | 计算样式 |
| font-weight | `400` | 计算样式 |
| transition | `0.2s linear`（`all`） | 计算样式，同源 `a { transition: all .2s linear }` |

Rest → hover 真正变的只有：**背景透明 → `rgb(90, 90, 90)`**，**文字 `#fff` → `#f3f0eb` / `rgb(243, 240, 235)`**。圆角、尺寸、阴影、滤镜不变。

---

## 3. 选中 / 按下（和 hover 比）

| 状态 | 怎么测 | background-color | color | box-shadow / filter | 与 hover 是否相同 |
|---|---|---|---|---|---|
| hover（未选中项） | 真鼠标 hover Object；CDP `forcePseudoState(['hover'])` | `rgb(90, 90, 90)` | `rgb(243, 240, 235)` | `none` / `none` | 基准 |
| :active 按下 | CDP `forcePseudoState(['active'])`；真实 `mousePressed` 未松开 | `rgb(90, 90, 90)` | `rgb(243, 240, 235)` | `none` / `none` | **相同**。规则 `.active\:bg-sidebar-accent:active` 与 hover 都指向 `--sidebar-accent` |
| hover + :active | CDP `['hover','active']` | `rgb(90, 90, 90)` | `rgb(243, 240, 235)` | `none` / `none` | **相同** |
| 选中 `[data-active=true]` | Animal 默认选中；点击 Object 后 Object `data-active="true"`，指针离开 | `rgb(90, 90, 90)` | `rgb(243, 240, 235)` | `none` / `none` | **相同**。规则 `.data-\[active=true\]\:bg-sidebar-accent[data-active="true"]` |
| 选中 + hover | 指针停在已选中的 Animal | `rgb(90, 90, 90)` | `rgb(243, 240, 235)` | `none` / `none` | **相同**（所以 `animals.png` 和 rest 里 Animal 条几乎看不出差别） |

没有观测到第二套「按下更亮 / 更暗」或「选中描边」。  
`font-weight` 在嵌套选中态仍是 `400`。顶级按钮 class 里有 `data-[active=true]:font-medium`，嵌套按钮 class **没有** 这条。

---

## 4. 父级左栏背景

| property | value | source |
|---|---|---|
| 左栏 `bg-sidebar` background-color | `rgb(71, 71, 71)` | 计算样式。变量 `--sidebar: #474747` |
| 左栏 color | `rgb(255, 255, 255)` | 计算样式。`--sidebar-foreground: #fff` |
| 左栏宽度 | `170px` | 计算 / `--sidebar-width: 170px` |
| 左栏右边框 | class `border-r border-sidebar-border`；`--sidebar-border: #636363` | 变量。嵌套 ul 的左边线计算为 `1px solid rgb(99, 99, 99)`（`#636363`） |
| 嵌套 ul 背景 | `rgba(0, 0, 0, 0)` | 计算样式 |
| 嵌套 li 背景 | `rgba(0, 0, 0, 0)` | 计算样式。高亮画在 `a` 上，不在 `li` |
| 更外层 `.pro-side-panel` | `rgb(58, 58, 58)` | 计算样式。这是左栏 + 图库的整块侧栏，不是 menu 本身 |

相关变量（在 sidebar 节点上读取，不是猜的）：

| variable | value | source |
|---|---|---|
| `--sidebar` | `#474747` | 计算 custom property |
| `--sidebar-foreground` | `#fff` | 同上 |
| `--sidebar-accent` | `#5a5a5a` | 同上 |
| `--sidebar-accent-foreground` | `#f3f0eb` | 同上 |
| `--sidebar-border` | `#636363` | 同上 |
| `--sidebar-ring` | `#94a3b8` | 同上（focus ring；本次 hover 未出现可见 ring） |
| `--radius-md` | `.1875rem` | 同上 |
| `--spacing` | `.25rem` | 同上 |
| `--text-sm` | `.875rem` | 同上 |

`:root` 上的 `--sidebar` 是浅色 `#faf8f5`。左栏实际用的是组件范围内覆盖后的深色 token。对齐左栏时用组件内这组，不要用 `:root` 浅色组。

---

## 5. 顶级项 hover（只作对照，不是主目标）

测了 **Charges**（`data-state="open"`）和 **Top**（`data-state="closed"`），节点是 `button[data-sidebar="menu-button"]`。CDP `forcePseudoState(['hover'])`：

| property | Charges / Top hover | 嵌套项 hover | source |
|---|---|---|---|
| background-color | `rgb(90, 90, 90)` | `rgb(90, 90, 90)` | 计算样式。同样 `hover:bg-sidebar-accent` |
| color | `rgb(243, 240, 235)` | `rgb(243, 240, 235)` | 计算样式 |
| border-radius | `3.1875px` | `3.1875px` | 计算样式 |
| box-shadow | `none` | `none` | 计算样式 |
| filter | `none` | `none` | 计算样式 |
| padding | `8.5px`（四边） | `0px 8.5px` | 计算样式。顶级 `p-2`，嵌套 `px-2` |
| height | `34px`（class `h-8`） | `29.75px`（class `h-7`） | 计算样式 |
| width | `163px` | `111px` | 计算样式 / 布局 |
| font-weight | `400` | `400` | 计算样式 |
| transition | `width/height/padding 0.15s cubic-bezier(0.4, 0, 0.2, 1)` | `all 0.2s linear` | 计算样式。顶级是 `<button>` + `transition-[width,height,padding]`，**背景不在 transition 列表里** |

所以：颜色 token 与嵌套项 hover 相同；尺寸更大；背景切换在顶级上没有观测到 200ms 过渡（属性列表不含 background）。未再对顶级做截图（任务只要嵌套三张）。

---

## 6. 明确不是 hover 的东西

| 猜测 | 实测 |
|---|---|
| 铜色 / 黄色模糊光晕 | 未观测到。`box-shadow: none`，`filter: none`，`background-image: none` |
| 额外边框 | `border-width: 0` |
| 缩放 | `transform: none` |
| 换字重 | 嵌套项 hover/选中仍 `400` |
| 另一层伪元素光晕 | 未观测到。高亮就是 `a` 自己的 `background-color` |
| Ordinaries 专用样式 | 竞品左栏无此标签；同 class 的 Object 与 Animal hover 计算值相同 |

---

## 7. 实现时应对齐的 hover token（嵌套项）

```
background-color: #5a5a5a;          /* rgb(90, 90, 90) */
color: #f3f0eb;                     /* rgb(243, 240, 235) */
border-radius: 0.1875rem;           /* 计算 3.1875px @ 17px root */
box-shadow: none;
filter: none;
background-image: none;
height: 1.75rem;                    /* h-7；计算 29.75px @ 17px root */
padding-inline: 0.5rem;             /* px-2；计算 8.5px */
font-size: 0.875rem;                /* text-sm；计算 14.875px */
font-weight: 400;
```

父栏：

```
background-color: #474747;          /* rgb(71, 71, 71) */
```

过渡：嵌套 `<a>` 上观测到 `all 0.2s linear`（来自主题全局 `a` 规则，不是 sidebar 组件自己的 hover transition）。若本地嵌套项不是 `<a>`，不要假设竞品 sidebar 组件本身带了 200ms 背景动画。

---

## 方法边界

- 未导出竞品文案 / 商标 / 素材进 `src/`。本文件和三张截图只在 `tmp/`。
- 未改 `src/`，未 commit。
- `width: 111px` 是当前 170px 左栏 + 嵌套缩进后的布局结果，不是独立设计 token。
- 未测键盘 focus ring 的完整计算值（class 有 `focus-visible:ring-2` + `--sidebar-ring: #94a3b8`，hover 路径下 `outline-style: none`）。
- 未测触屏 / `@media (hover: hover)`。桌面指针 hover 已测。
