# T4 浏览器真用 · Text / Curved Text / Ring Text

Date: 2026-08-23  
URL: `http://localhost:3000/coat-of-arms-maker`（只用 localhost；HTTP 200；未用 127.0.0.1）  
Method: 本地 ego-browser task space `usage text tools browser` (id 69)，viewport **1512×738**  
Draft overlay: 进入时有 Restore/Discard；已点 **Discard draft**。之后 `inertCount=0`。  
进入后画板无文字图层（Discard 后默认金盾+狮子）。每种文字都是删掉上一个再点一张新卡，画布上同时只留一种。  
操作是真实 `dragMouse`（pointer down→move→up），不是只点卡截图。  
未改 `src/`，未 commit，未改端口。

---

## 总表

| # | 步骤 | 结果 | 截图 |
|---|---|---|---|
| 1 | Text：点卡 → 抓住字上拖、下拖 → 拉右边宽度条 | **通过** | `tmp/usage-straight-moved.png` |
| 2a | Curved Text：点卡，不拉手柄先截默认。必须一眼看得出弯、字贴弧 | **失败** | `tmp/usage-curve-default.png` |
| 2b | 抓住字往上拖 → 中间控制点往上拉。小黑工具条不挡三个点 | **失败**（拖动本身通过；拉高后控制点与工具条重叠） | `tmp/usage-curve-drag.png` |
| 3a | Ring Text：默认字必须正着排在上半圈（IN+ARC），不是倒在圆底 | **失败** | `tmp/usage-ring-default.png` |
| 3b | 抓住字往上拖 → 拉半径点放大。工具条不挡半径点 | **失败**（拖动/放大本身通过；放大后半径点与工具条重叠） | `tmp/usage-ring-drag.png` |
| 3c | 点 OUT / EVEN 仍能切换 | **通过** | `tmp/usage-ring-out.png`、`tmp/usage-ring-even.png` |

总体：**未通过**（6 项里 2 项通过、4 项失败）。失败都是产品表现，不是脚本没拖到。

---

## 预备

- `curl`：`http://localhost:3000/coat-of-arms-maker` → 200  
- Discard draft 后 overlay 消失。  
- 画板 `text` 节点 0 个，无需再删已有文字。  
- 左栏 Tools 已展开，Text 子栏可见。点卡用 `button[aria-label="Text"|"Curved Text"|"Ring Text"]`。

---

## 1. 直线文字 — 通过

操作：点 `Text` 卡 → `elementFromPoint` 打到 `<text>`（layer `0bddce69-…`）→ 上拖 80px → 下拖 110px → 拉 `[data-text-box-width-handle=right]` 向右 50px。

截图：`tmp/usage-straight-moved.png`（179641 bytes）

| 时刻 | transform y | 屏幕 cy | 字宽 |
|---|---|---|---|
| 点卡后 | `translate(0 -47)` | 453.75 | 270.04 |
| 上拖后 | `translate(0 -63.89)` | 373.75（上移 80px） | 270.04 |
| 下拖后 | `translate(0 -40.98)` | 482.25（下移 108px） | 270.04 |
| 拉宽后 | 同下拖 | 482.25 | **297.31** |

右边条中心 X：1121.02 → 1134.65。左右宽条仍在，无 8 个缩放方块。

---

## 2. 弧形文字

### 2a 默认（不拉手柄）— 失败

操作：删直线 → 点 `Curved Text` → 立刻截图。

截图：`tmp/usage-curve-default.png`（193626 bytes）

| 检查 | 实测 |
|---|---|
| 路径 | overlay / scene `d="M28 62 Q50 28 72 62"`（拱形，控制点 Y=28） |
| 三点 | `curve-start` (882, 497)、`curve-control` (986, 336)、`curve-end` (1090, 497) |
| 字 | `Curved Text`，`<textPath>`。bbox 中心 (986, 421)。左右/顶采样 `elementFromPoint` 都打到 `textPath` |
| 工具条 | 画板上沿 y=215–243；三点都不与之相交 |

失败原因：验收要求「必须一眼看得出弯，字贴弧」。三点确实成拱，字也在路径上，但默认黑字 `#111111` 压在狮子深色身体上，截图里几乎读不出 “Curved Text”。这不是「一眼」。

### 2b 拖字 + 拉控制点 + 工具条 — 失败

操作：抓住字中心（确认 hit=`textPath`，不是手柄）上拖 70px → 再把 `curve-control` 上拉 50px。

截图：`tmp/usage-curve-drag.png`（194588 bytes）

| 检查 | 实测 |
|---|---|
| 字上移 | transform y：0 → **-14.78**；bbox cy：421 → 351 |
| 控制点上拉 | 路径 `Q50 28` → `Q51.609 16.526`；overlay 控制点 Y：13.22 → **1.75** |
| 拖后字贴弧 | 金色盾顶能读出 “rved T”，字跟着拱走 | **这项通过** |
| 工具条 vs 三点 | 起点/终点仍在盾上，未被挡。**控制点 cy=216 与工具条 y=220–248 相交**（`handleOverlapsToolbar=["curve-control"]`）。截图里白点压在黑条上 |

拖动本身有效。失败点是：把中间点往上拉之后，小黑工具条挡住了控制点。默认位置并不挡；是拉到画板上沿之后挡。

---

## 3. 环形文字

### 3a 默认 IN+ARC 上半圈 — 失败

操作：删弧 → 点 `Ring Text` → 立刻截图。

截图：`tmp/usage-ring-default.png`（195610 bytes）

顶栏实测：IN `pressed=true`，OUT false，ARC `pressed=true`，EVEN false。默认确实是 IN+ARC。

| 检查 | 实测 |
|---|---|
| 路径 | `M32 50 A18 18 0 0 0 68 50`（从左到右、sweep=0=逆时针 → **下半圆**） |
| 虚线圆 | `circle cx=50 cy=50 r=18`，屏幕直径 168px |
| 字 bbox | cy=**503.7**，圆中心 cy=**440.2**，字在圆心**下方 63px** |
| 字符几何 | 9 个字 y=62.7–68.1（圆心 scene Y=50，圆底 Y=68）。旋转约 +38°…-42°，贴下弧 |
| 半径点 | 1 个，在圆顶 (978.5, 356)，默认不与工具条相交 |

截图能读出下弧上的 “ing Tex”，不在上半圈。验收要求「正着排在上半圈（IN+ARC），不是倒在圆底」——失败。

根因（只读代码核对）：`getRingTextPathData` 在 `layout==='arc'` 且 `facing==='in'` 时画 `M(50-r) 50 A r r 0 0 0 (50+r) 50`，从西点逆时针到东点，走的是南弧（下半圈）。

### 3b 拖字 + 拉半径 — 失败

操作：抓住字（hit=`textPath`）上拖 60px → 把 `ring-radius` 再往上拉 40px 放大。

截图：`tmp/usage-ring-drag.png`（197359 bytes）

| 检查 | 实测 |
|---|---|
| 字上移 | bbox cy：503.7 → **439.7**（上移 64px）；圆中心跟着到 cy=376 |
| 半径放大 | r：18 → **26.59**；屏幕直径 168 → **248**；路径 `A26.592 26.592` |
| 工具条 vs 半径点 | 默认/仅上移后不挡。放大后半径点 cy=252 与工具条 y=220–248 相交。截图白点压在黑条上 |

拖动和放大有效。失败点同样是：半径点拉到画板上沿后被小黑工具条挡住。

### 3c OUT / EVEN 切换 — 通过

在 3b 之后点顶栏按钮（不是只看默认态）。

| 动作 | 按钮 | 路径 / 属性 |
|---|---|---|
| 点 OUT 前 | IN=true OUT=false | `M23.408 50 A26.592 26.592 0 0 0 76.592 50` |
| 点 OUT 后 | IN=false **OUT=true** | `M76.592 50 A26.592 26.592 0 0 1 23.408 50`。字旋转翻到 ~154°…-152°（倒着） |
| 点 EVEN 后 | **EVEN=true** | 路径不变；`textLength="83.5413"` `lengthAdjust="spacing"`。字沿弧拉开（R 在 y=49.7，中间字 y=76.6，t 在 y=52.0） |

辅助截图：`tmp/usage-ring-out.png`、`tmp/usage-ring-even.png`（任务未要求，作切换证据）。

---

## 结论

T4 真用跑完。直线文字的抓字移动和拉宽可用。弧形/环形也能拖，路径跟着走。

产品未过项：

1. **环形默认 IN+ARC 排在下半圈**，不是上半圈正字。  
2. **弧形默认字对比度不够**，截图不能一眼看出字贴弧（拖到金色区域后才能读）。  
3. **小黑工具条钉在画板上沿**：默认不挡三点/半径点；把控制点或半径点往上拉到上沿后会压住手柄。

后续若修环形上半圈，应改 `getRingTextPathData` 的 arc 起点/sweep，使 IN+ARC 走北弧，再跑一遍本脚本。
