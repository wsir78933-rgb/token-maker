# T9 浏览器再真拖 · Text / Curved Text / Ring Text

Date: 2026-08-23  
URL: `http://localhost:3000/coat-of-arms-maker`（只用 localhost；HTTP 200；未用 127.0.0.1）  
Method: 本地 ego-browser task space `usage2 text tools browser` (id 71)，viewport **1512×738**  
Draft overlay: 进入时有 Restore/Discard；已点 **Discard draft**。之后 `inertCount=0`。  
进入后画板无文字图层。每种文字都是删掉上一个再点一张新卡，画布上同时只留一种。  
操作是真实 `dragMouse`（pointer down→move→up），抓字前用 `elementFromPoint` 确认打到 `<text>` / `<textPath>`，不是只点卡截图。  
未改 `src/`，未 commit，未改端口。

---

## 总表

| # | 步骤 | 结果 | 截图 |
|---|---|---|---|
| 1 | Text：点卡 → 抓住字上拖、下拖 → 拉右边宽度条 | **通过** | `tmp/usage2-straight.png` |
| 2a | Curved Text：点卡立刻截。金色上部能读出 Curved Text，看得出弯 | **通过** | `tmp/usage2-curve-default.png` |
| 2b | 抓住字上拖 → 中间控制点上拉。工具条在画板底部，不挡三个点 | **通过** | `tmp/usage2-curve-drag.png` |
| 3a | Ring Text：点卡立刻截。字正着排在上半圈（圆心上方），不是下半圈 | **通过** | `tmp/usage2-ring-default.png` |
| 3b | 抓住字上拖 → 上拉半径。工具条在底部，不挡半径点 | **通过** | `tmp/usage2-ring-drag.png` |

总体：**通过**（5/5）。拖动、默认几何、工具条位置都是产品表现，不是脚本没拖到。

---

## 预备

- `curl`：`http://localhost:3000/coat-of-arms-maker` → 200  
- Discard draft 后 overlay 消失。  
- 画板 `text` 节点 0 个，无需再删已有文字。  
- 左栏 Tools 已展开，Text 子栏可见。点卡用 `button[aria-label="Text"|"Curved Text"|"Ring Text"]`。  
- 画板 `.coat-canvas` **854×512**（屏幕 551.7,207.4–1405.3,719.6）。

---

## 1. 直线文字 — 通过

操作：点 `Text` 卡 → `elementFromPoint(978.5, 454)` 打到 `<text>`（内容 `Double-click to edit`）→ 上拖 80px → 下拖 110px → 拉 `[data-text-box-width-handle=right]` 向右 50px。

截图：`tmp/usage2-straight.png`（177907 bytes）

| 时刻 | transform y | 屏幕 cy | 字宽 |
|---|---|---|---|
| 点卡后 | `translate(0 -47)` | 454.00 | 265.38 |
| 上拖后 | `translate(0 -64.18)` | 374.00（上移 80px） | 265.38 |
| 下拖后 | `translate(0 -40.99)` | 482.00（下移 108px） | 265.38 |
| 拉宽后 | 同下拖 | 482.00 | **292.65** |

右边条中心 X：1111.18 → 1124.82。左右宽条仍在，`[data-resize-handle]` = 0。截图里字在盾中下部，蓝框 + 左右宽条 + 旋转点都在。

---

## 2. 弧形文字

### 2a 默认（不拉手柄）— 通过

操作：删直线 → 点 `Curved Text` → 立刻截图（约 0.35s 后，未拖）。

截图：`tmp/usage2-curve-default.png`（195544 bytes）

| 检查 | 实测 |
|---|---|
| 路径 | overlay `d="M28 38 Q50 8 72 38"`（拱形，控制点 Y=8，在场景上部） |
| 三点 | `curve-start` (876, 384)、`curve-control` (978.5, 245)、`curve-end` (1081, 384) |
| 字 | `Curved Text`，`<textPath>`。bbox 中心 (978.8, 318.4)。画板顶=207，字在画板高度约 **22%** 处。左右/中采样 `elementFromPoint` 都打到 `textPath` |
| 工具条 | `[data-coat-editor-overlay=selection-toolbar]` class 含 `bottom-2 top-auto`；屏幕 y=675–712，距画板底 **8px**。三点都不与之相交 |

截图能在金色盾顶读出 **Curved T**，弯明显贴虚线拱。`ext` 右侧略压到龙翼，但不挡整句，也不是压在狮子深色身体上。相对 T4 默认（黑字压狮身、读不出）这次能读。

### 2b 拖字 + 拉控制点 + 工具条 — 通过

操作：抓住字中心（确认 hit=`textPath`，不是手柄）上拖 50px → 再把 `curve-control` 上拉 40px。

截图：`tmp/usage2-curve-drag.png`（196430 bytes）

| 检查 | 实测 |
|---|---|
| 字上移 | transform y：0 → **-11.73**；bbox cy：318.4 → 263.8（上移 55px） |
| 控制点上拉 | 路径 `Q50 8` → 叠加位移后 `Q49.958 -11.73`；手柄 cy：245 → **153**（再上移 37px） |
| 拖后字贴弧 | 金色盾顶能完整读出 “Curved Text”，字跟着拱走，部分字母略出盾沿 |
| 工具条 vs 三点 | 工具条仍在画板底 y=675–712，`handleOverlapsToolbar=[]`。起点/终点在盾上 (876/1081, 330)，未被挡 |

拖动本身有效。中间点拉过画板上沿后，手柄屏幕 cy=153，画板顶=207，**点到了画板上方空白/顶栏一带，不在工具条上**。这是往上拉的结果，不是工具条挡住。工具条钉在底部，三个点都不与之相交。

---

## 3. 环形文字

### 3a 默认 IN+ARC 上半圈 — 通过

操作：删弧 → 点 `Ring Text` → 立刻截图。

截图：`tmp/usage2-ring-default.png`（194040 bytes）

顶栏实测：IN `pressed=true`，OUT false，ARC `pressed=true`，EVEN false。默认确实是 IN+ARC。

| 检查 | 实测 |
|---|---|
| 路径 | defs `d="M32 50 A18 18 0 0 1 68 50"`（从西到东、sweep=1 → **上半圆 / 北弧**） |
| 虚线圆 | `circle cx=50 cy=50 r=18`，屏幕直径 168px，圆心屏幕 cy=**440.2** |
| 字 bbox | cy=**355.4**，在圆心**上方 85px**（`textAboveCircleCenter=true`） |
| 字符几何 | 9 个字 sceneY=24.4–30.1（圆心 scene Y=50，圆顶 Y=32）。全部在圆心上方 |
| 半径点 | 1 个，在圆顶 (978.5, 356)，与工具条不相交 |

截图里字沿盾顶金色上弧，不是倒在圆底。部分字母压到龙颈，对比度一般，但位置是上半圈正字。相对 T4 默认（`sweep=0` 南弧、bbox 在圆心下方 63px）这次已改过来。

### 3b 拖字 + 拉半径 — 通过

操作：字中心与半径点几乎重合（都在 ~978,356），会误抓半径。改从字母 **R**（919, 365，hit=`textPath`）上拖 60px → 再把 `ring-radius`（确认 `data-text-path-handle=ring-radius`）上拉 40px。

截图：`tmp/usage2-ring-drag.png`（199405 bytes）

| 检查 | 实测 |
|---|---|
| 字上移 | transform y：0 → **-12.89**；bbox cy：355.4 → 295.4（上移 60px）；圆中心跟着到 cy=380 |
| 半径放大 | r：18 → **26.593**；屏幕直径 168 → **248**；路径 `M23.407 50 A26.593 26.593 0 0 1 76.593 50` |
| 工具条 vs 半径点 | 放大后半径点 cy=256，工具条 y=675–712，不相交。截图白点在盾顶「g」「T」之间，小黑条在画板底 |

拖动和放大有效。工具条钉在底部，不挡半径点。截图能在金色上部读出正着的 “Ring Text”。

---

## 结论

T9 真用跑完。直线文字的抓字移动和拉宽可用。弧形默认已到金色上部，能读出弯字。环形默认 IN+ARC 走北弧，字在圆心上方。弧/环选中后小黑工具条在画板底部（`artboard-bottom` / `bottom-2`），上拉控制点或半径点时不再被工具条压住。

与 T4 对照（当时 2/6 通过）：T6 北弧、默认弧上移、工具条改底部之后，本轮 5/5 通过。

备注（不记失败）：弧中间点拉过画板上沿后会离开画板可视区；那是点被拖出画板，不是工具条遮挡。
