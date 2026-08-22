# 编辑器垂直高度视觉验收（只读）

日期：2026-08-22  
任务：只读视觉验收。未改 `src/`、tests、`globals.css`、`WORKLOG`。只写 `tmp/`。  
本机：`http://localhost:3000/coat-of-arms-maker`（localhost，不用 127.0.0.1）  
对照：`tmp/layout-height-ours-recon.md`、`tmp/layout-height-coamaker-recon.md`  
方法：ego-browser task space `layout height visual verify`；`getBoundingClientRect` + `getComputedStyle` + 视口截图  
草稿 overlay：本次 `.coat-workbench-content` **没有** `inert`，`.coat-target-draft` 不在 DOM，未点 Discard。  
视口：`1512×738`，`dpr=2`，`scrollY=0`（与 ours recon 同一桌面口径）

截图：`tmp/layout-height-visual-ours.png`

---

## 总评

recon 点名的硬伤已经不在：顶栏不再是 129，画板不再锁在 480 方卡，wrap 不再上下各垫 14.76。

桌面实测 chrome **99 + 50 + 40 = 189**，舞台槽 **549**，画板 **549** 贴满槽底，画布 **547**（1px 边框）。相对改前画布 478，高了 **69px**。

对照 recon §5 的「约 560px / 视口 ~76%」口径，画布 547 还差 **13px**（74.1% vs 76.0%）。这 13px 不是漏改 token：`100svh − 99 − 50 − 40 = 549`，再扣 artboard 1px 边框就是 547。要到 560 必须再削 chrome 或不再锁 100svh。

---

## 实测 vs recon 口径

视口 `innerHeight = 738`。工作台 `height: 100svh`、`overflow: hidden`，第一屏铺满。

| 带 | 选择器 | recon 改前 | recon 目标 | 现在 | 判定 |
|---|---|---:|---|---:|---|
| 站点顶栏 | `.coat-target-workbench > .site-topbar` | 128.77 | 接近竞品 **99** | **99**（`height/min-height: 99px`，`overflow: hidden`） | 齐 |
| 导出条 | `.coat-target-actionbar` | 50 | **50** 保持 | **50** | 齐 |
| 画布工具条 | `.coat-target-canvas-toolbar` | 40 | **40** 保持 | **40** | 齐 |
| 画板槽 | `.coat-target-artboard-wrap` | 519.23 | 剩余槽 | **549**（y 189 → 738） | 齐（吃满 100svh − 189） |
| wrap 垂直 padding | 同上 | 14.76×2 | 0 或很小 | **0**（`padding: 0 90.72px`，左右 clamp 仍在） | 齐 |
| 画板 | `.coat-target-artboard` | 480（30rem 锁死） | 接近剩余槽，不要 480 | **549×549**，`max-height: 100%` | 齐（贴槽） |
| 画布 | `.coat-canvas` | 478（64.8%） | ~76% ≈ **560**，至少明显高于 478 | **547**（74.1%） | 明显高于 478；比 76%/560 口径还差 **13px** |
| 缩放 | `.coat-target-zoom` | 36 overlay | 继续 overlay | **36**，`position: absolute` | 齐 |
| 底栏 | mobile drawer | display none | 不要占布局的底栏 | `display: none`，高 0 | 齐 |

堆叠（scrollY=0）：

```
y=0      .site-topbar                 99
y=99     .coat-target-actionbar       50
y=149    .coat-target-canvas-toolbar  40   （scene 589 = 40 + 549）
y=189    .coat-target-artboard-wrap  549
         .coat-target-artboard       549   贴槽顶/底
y=190    .coat-canvas                547
y=738    视口底
```

`--coat-editor-chrome-height` 计算值 **189px**。导航仍是 Editor / Dice Roller / Coat Maker / Contact / Blog。

---

## 还差多少 px

| 对照 | 目标 | 现在 | 还差 |
|---|---:|---:|---:|
| recon §5「约 560 / 76%」 | 560（738×0.76） | 画布 547 | **13px**（2.0 个百分点） |
| 剩余槽铺满 | 槽 549 | 画板 549 / 画布 547 | 槽已满；画布少 **2px** 边框 |
| 改前 30rem 卡 | 明显高于 478 | 547 | 已高 **69px** |
| 竞品画布 575 @ 756vh | 同视口换算 738×76.1% ≈ 562 | 547 | **约 15px**（视口不同，不能直接减 575−547） |

截图里舞台白底板贴到工作台底，底下没有改前那种 wrap padding 空带。视觉上不再「小方卡漂在槽中间」。

若还要把画布从 547 拉到 560，需要另开实现：再削顶栏，或把工作台改成竞品那种 **88vh 编辑器 + 头在外面**（会引入整页滚动）。本次验收不改代码。

---

## 截图在记什么

`tmp/layout-height-visual-ours.png`：桌面第一屏，无草稿遮罩。能看见两行顶栏（品牌 + 胶囊）、Export 50px 条、undo/Multi-select 40px 条、纹章画板贴底、右下缩放 overlay。未抄竞品文案/商标/广告。
