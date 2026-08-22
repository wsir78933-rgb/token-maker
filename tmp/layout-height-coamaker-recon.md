# 竞品编辑器上下高度（只读测量）

Date: 2026-08-22  
Repo: `/Users/wusir/Desktop/开发项目集合/token-maker-app`  
本机约束：只用 `http://localhost:3000/coat-of-arms-maker`（本任务未开本机，只量竞品）  
竞品：`https://coamaker.com/` 首页嵌入的 Coat editor（`#coaroot.reactapp.viteapp`）  
截图：`tmp/layout-height-coamaker.png`（scrollY=0 视口；底栏那块是广告 overlay，只记高度，不抄文案/商标/CTA）  
原始数字：`tmp/layout-height-coamaker-raw.json`  
方法：ego-browser 实机 `getBoundingClientRect` / `getComputedStyle` + 竞品 CSS `App-BrsK35bl.css`  
本任务未改 `src/`、tests、`globals.css`、WORKLOG、Contact/SEO 文件。未新建 worktree，未 commit / push。

Viewport（本次会话）：`innerWidth 1496 × innerHeight 756`，`devicePixelRatio 2`，根字号 `17px`，`visualViewport.scale 1`。  
`documentElement.clientWidth = 1481` → 垂直滚动条占 **15px**。

---

## 结论（先看这个）

竞品编辑器 **不是** `100vh` 铺满窗口。桌面宽度 `≥1025px` 时，`#coaroot` 被写成 **`height/max-height: 88vh`**。

在这次 756px 高的视口里：

| 层 | 高度 |
|---|---|
| 站点产品头（两行） | **99px**（28 + 71） |
| 编辑器整块 `#coaroot` | **665.27px = 88vh** |
| 头 + 编辑器 | **764.27px** |
| 视口 | **756px** |
| 头+编辑器超出视口 | **8.27px** |

所以：页面 **有垂直滚动条**。不是画布内部在滚，是 WordPress 整页在滚——底下还有 **546.87px 页脚** + `body` **padding-bottom 154px**（广告预留）。`documentElement.scrollHeight = 1465`。

画布本身在布局上是编辑器里最高的一块：**575px**（舞台包 575.27px）。它上面压了两根编辑器水平栏（50 + 40），再上面是 99px 站点头。画布 **没有** 全宽底栏；右下角缩放是 36px overlay，不吃高度。本次会话另有一条 **231px 固定广告 overlay** 盖住画布下沿，也不吃布局高度。

用户觉得竞品「上下更合适」，对应的可核对数字是：

- 编辑器壳 = **88vh（665px）**，不是 `100vh - 站点头`（那样会是 657px）。
- 真正舞台 = **88vh − 50 − 40 = 575px**。
- 视口里能看见的舞台 = **567px**（底部 8px 被整页滚动裁掉）。
- 若算上本次固定广告 overlay，未被挡住的舞台只剩 **336px**。这条广告是会话态，布局上舞台仍是 575px。

---

## 从上到下每一条水平 chrome（scrollY = 0）

```
y=0      ┌─────────────────────────────────────────────┐
         │ ① 跨站条 nav.coa-other-sites     28px 黑底  │
y=28     ├─────────────────────────────────────────────┤
         │ ② 产品导航（logo / 菜单 / Login）  71px     │
y=99     ├─────────────────────────────────────────────┤  ← header.elementor-location-header 合计 99px
         │ ③ .coa-top-bar  编辑器第二行         50px   │  Export
y=149    ├──────────────┬──────────────────────────────┤
         │ 左栏 615.27  │ ④ .coa-toolbar 画布工具条 40 │  undo / Multi-Select
y=189    │  （非水平条） ├──────────────────────────────┤
         │              │ ⑤ 舞台 .coa-canvas-scroll    │
         │              │    wrap 575.27 / canvas 575  │
y=525    │              │    ⑥ 固定广告 overlay 231    │  盖住舞台，不占布局
y=716    │              │    ⑦ 缩放 overlay 36         │  bottom:12px / right:12px
y=756    └──────────────┴──────────────────────────────┤  ← innerHeight；舞台还往下 8.27px
y=764.27                                                │  #coaroot / footer 交界
         ⑧ footer 546.87px（视口外）
         ⑨ body padding-bottom 154px（视口外）
```

| # | 部位 | 选择器 | y | 计算高度 | 底色 | padding | 边 |
|---|---|---|---:|---:|---|---|---|
| 1 | 最顶跨站条 | `header … .elementor-element-ba9694c` → `nav.coa-other-sites` | 0 | **28px** | `#000` | 容器 `5px 5px 5px 25px`；nav 内容高 18px | 无 |
| 2 | 产品头第二行 | `header … .elementor-element-5edbb134` | 28 | **71px** | `rgb(43,43,43)` | `10px` | 无 |
| 1+2 | 最顶产品头合计 | `header.elementor-location-header` | 0 | **99px** | 透明（两行自己上色） | 0 | 无 |
| 3 | 编辑器第二行工具条 | `.coa-top-bar.flex.items-center.h-[50px]` | 99 | **50px** | `rgb(71,71,71)`（`--color-chrome`） | `0 8.5px` | **底边 1px** `#636363` |
| 4 | 画布上方工具条 | `.coa-toolbar` | 149 | **40px**（`min-height:40px`，含底边） | `rgb(71,71,71)` | `0 8px` | **底边 1px** `var(--color-border)` |
| 5 | 舞台包 | `.coa-workspace` 第二子节点 / `.coa-canvas-scroll` | 189 | **575.27px** | `rgb(240,236,226)` | **0** | 无 |
| 5b | Fabric 画布 | `canvas.lower-canvas` + `.canvas-container` | 189 | **575px** | 透明 | 上下 **0 / 0.27px**；左右各 **6px** | 无 |
| 6 | 底栏（布局） | — | — | **0** | — | — | 编辑器 **没有** 全宽状态栏 |
| 7 | 缩放条（overlay） | `.coa-zoom-controls` | 716.27 | **36px**（宽 220） | `rgb(58,58,58)` | `6px 12px` | 无；`position:absolute; bottom:12px; right:12px; z-index:10` |
| 8 | 广告槽 overlay | `ins.adsbygoogle-noablate` | 525 | **231px** | 白 | — | `position:fixed; bottom:0; z-index:2147483647`。只记高度 |
| 9 | 左栏广告槽 | `.flag-top-ad` | 157 | **184px** | — | 0 | 在 library 里，**不是** 水平 chrome |
| 10 | 页脚 | `footer.elementor-location-footer` | 764.27 | **546.87px** | — | 0 | scrollY=0 时整块在视口外 |
| 11 | 页底 padding | `body` | — | **154px** | — | `padding-bottom:154px` | 页脚之下，广告预留 |

左栏（对照，不是水平条）：rail **170×615.27**，library `.coa-sidepanel-content` **289×615.27**，二者合在 `.pro-side-panel` **460×615.27**，y=149 与 `#4` 对齐。

---

## 画布 / 舞台

`.coa-workspace`（`x=460, y=149, 1021×615.27`，`flex-direction:column`，`overflow:hidden`）三层：

1. `.coa-toolbar` 40px，不伸缩。
2. 匿名节点 `flex:1 1 0%; overflow:hidden; background:#f0ece2` → **575.27px**。
3. `.coa-zoom-controls` `position:absolute`，不占 flex 高度。

舞台内部：

- `.coa-canvas-scroll`：`position:absolute; inset:0; overflow:auto; scrollbar-gutter: stable both-edges`
- `offsetWidth 1021` / `clientWidth 1009` → 左右各留 **6px** gutter，**不是** `padding`
- `.canvas-container`：`1009×575`，`position:sticky; top:0`
- `canvas.lower-canvas` CSS **1009×575**；backing store **2018×1150**（dpr=2）
- 画布相对 workspace：**上 padding 0、下 0.27px（亚像素）、左 6、右 6**
- 工具条底到画布顶：**0px**（无空隙）

视口可见：

- 画布顶 `y=189`，视口底 `756` → 能看见 **567px** 舞台（8px 在视口外）。
- 本次固定广告从 `y=525` 盖到视口底，挡住舞台 **231px**；未被挡住 **336px**。广告关掉后布局高度不变，仍是 575px。

---

## 100vh / 滚动条

**`#page { display:flex; flex-direction:column; min-height:100vh }`** → 计算 `min-height:756px`，实际高度 **1311.14px**（被页脚撑开）。

`html` / `body` **都不是** 100vh：高度 1465.14px，`body { overflow-y:auto; padding-bottom:154px }`。

编辑器 CSS（桌面，本次命中；文件 `App-BrsK35bl.css`）：

```css
#coaroot {
  --fc-app-viewport-height: 88vh;
  height: var(--fc-app-viewport-height) !important;
  max-height: var(--fc-app-viewport-height) !important;
  overflow: hidden !important;
}
```

`width<=1024px` 才改成 `calc(100vh - 80px)`，有 `100svh` 时用 `calc(100svh - 80px)`。本次宽度 1496，走 **88vh**。

核对：`756 × 0.88 = 665.28`，与 `#coaroot` 计算 `max-height:665.28px`、实测高度 `665.273px` 一致。

| 问 | 答 |
|---|---|
| 编辑器是 100vh 吗？ | **不是**。是 **88vh**。 |
| `#page` 是 100vh 吗？ | 只有 `min-height:100vh`，实际更高。 |
| 有页面滚动条吗？ | **有**。`scrollHeight 1465 > innerHeight 756`，槽宽 15px。 |
| 画布自己滚吗？ | `.coa-canvas-scroll` 设了 `overflow:auto`，本次 `scrollHeight === clientHeight === 575`，**没出现画布滚动条**。 |
| 头+编辑器能装进视口吗？ | **不能**。99+665.27=764.27，超出 **8.27px**。 |

`#content` 是 `#page` 的 `flex:1 1 auto`，但高度被 `#coaroot` 的 88vh 钉死，不会吃掉页脚。页脚在编辑器下面，一滚就离开工作台。

---

## 各栏内部（高度相关，不抄文案）

**① 28px 跨站条**：黑底，内容行 18px。禁止把友站名抄进我们 UI。

**② 71px 产品导航**：`padding:10px`，`align-items:center`，`justify-content:space-between`。右侧 Login/Go Pro 簇高 40px；Go Pro 按钮高 34px。禁止抄商标和付费 CTA。

**③ 50px `.coa-top-bar`**：class 自带 `h-[50px] shrink-0`。内层 flex 高 38.25px（`h-9` 量级），垂直居中。本次左侧工具组宽度 0，右侧只有 Export。`overflow:auto`。

**④ 40px `.coa-toolbar`**：只铺在 workspace（从 x=460 起），**不是** 全宽。四个子节点：三个 34×34 图标按钮 + 右侧 Multi-Select。`z-index:100`。底边含在 40px 内。

**⑦ 36px 缩放 overlay**：子节点为 range（120×18）+ `50 %` 文本（36×18）+ 24×24 按钮。绝对定位，不挤压舞台。

**⑧ 231px 固定广告**：`ins.adsbygoogle-noablate`，`position:fixed; bottom:0`。截图里能看见，实现时不要抄。它不是编辑器底栏。

---

## 高度从哪来（给对齐用）

```
innerHeight                         756
- 站点头                            99
= 若用剩余视口当编辑器              657     ← 竞品没用这个
竞品编辑器                          665.27  ← 88vh
- 第二行工具条                      50
= .coa-app-container                615.27
- 画布工具条                        40
= 舞台                              575.27
```

对齐时不要猜「少了一条栏」。桌面竞品是：**站点头 99 在 88vh 外面**，所以整页必然略高于视口。把编辑器改成 `100vh` 会和竞品不一致；改成 `100vh - 99px` 会比竞品舞台矮约 8px。

本任务只测量竞品，不改 `src/`。
