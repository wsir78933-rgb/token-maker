# T11 浏览器再验 · 紧凑文字三件套（T8/T9/T10 之后）

Date: 2026-08-23  
URL: `http://localhost:3000/coat-of-arms-maker`（只用 localhost；HTTP 200；未用 127.0.0.1）  
Method: 本地 ego-browser task space `compact text browser reverify` (id 68)，viewport **1512×738**  
Draft overlay: 进入时有 Restore/Discard；已点 **Discard draft**。之后 `inertCount=0`，无 Restore/Discard。  
未改 `src/`，未 commit。

画板实测：canvas **854×512**（宽高比 1.667，不是 100:110）。meet 盒子 `data-text-path-meet-box` **466×512**，左右 letterbox。

---

## 总表

| # | 步骤 | 结果 | 截图 |
|---|---|---|---|
| 1 | Tools → Text。字在盾中部；左右宽条 + 旋转；无 8 点 | **通过** | `tmp/compact-text-straight-after.png` |
| 2 | Curved Text。短弧三点贴虚线；无 8 点；宽画布上左右点不偏出虚线 | **通过** | `tmp/compact-text-curve-after.png` |
| 3 | Ring Text。小虚线圆 + 1 半径点；IN/OUT/ARC/EVEN | **通过** | `tmp/compact-text-ring-after.png` |
| 4 | （可选）拖弧起点：虚线跟着点走，不跳开 | **通过** | `tmp/compact-text-curve-drag-after.png` |

总体：**通过**（4/4）。

---

## 1. 直线文字 — 通过

操作：Discard draft → 左栏 Tools → 点 `button[aria-label="Text"]`。

截图：`tmp/compact-text-straight-after.png`（180007 bytes）

| 检查 | 实测 |
|---|---|
| 字内容 | `Double-click to edit` |
| 字位置 | 图层 bbox 265×37，中心屏幕 Y=454；画板 Y=207–719。相对画板高度 **48%**，压在盾面狮子身上 |
| 左右宽条 | `[data-text-box-width-handle]` = `left`, `right`（各 24×40） |
| 旋转 | `button[aria-label="Rotate selected layer"]` 1 个，在字上方 |
| 8 个缩放方块 | `[data-resize-handle]` **空** |
| 路径手柄 | `[data-text-path-handle]` **空** |

---

## 2. 弧形文字 — 通过

操作：点 `button[aria-label="Curved Text"]`。

截图：`tmp/compact-text-curve-after.png`（182375 bytes）

| 检查 | 实测 |
|---|---|
| 路径 | overlay `d="M30 56 Q50 42 70 56"`，`viewBox="0 0 100 110"`，`preserveAspectRatio="xMidYMid meet"` |
| 虚线 | `stroke-dasharray="3 3"` |
| 三点 | `curve-start` / `curve-control` / `curve-end` 各 1 |
| 贴虚线 | SVG `getScreenCTM` 映射 vs 手柄中心：dx/dy ≤ **0.01px** |
| 宽画布对照 | 若按整块画板线性映射，起点会偏 **77.6px**（naive X=807.79，实际/虚线 X=885.38）。左右点在盾内短弧上，不到白边 |
| 8 点框 | `[data-resize-handle]` **空**；无宽条；无旋转柄 |

---

## 3. 环形文字 — 通过

操作：点 `button[aria-label="Ring Text"]`。

截图：`tmp/compact-text-ring-after.png`（186055 bytes）

| 检查 | 实测 |
|---|---|
| 虚线圆 | `<circle cx="50" cy="50" r="18" stroke-dasharray="3 3">`。屏幕 168×168；画板 854×512。直径约画板宽 **20%**，圈在盾内 |
| 半径点 | `[data-text-path-handle="ring-radius"]` **1** 个；与场景点 (50, 32) 的屏幕映射 **dx=0 dy=0** |
| 8 点框 | `[data-resize-handle]` **空** |
| 顶栏 | `IN`（Face text inward, pressed=false）、`OUT`（pressed=true）、`ARC`、`EVEN` |

---

## 4. 拖弧起点 — 通过

操作：再点 Curved Text 得到选中短弧，把 `curve-start` 从 (891.25, 468.23) 拖到 (841.25, 448.23)。

截图：`tmp/compact-text-curve-drag-after.png`（188803 bytes）

| 检查 | 实测 |
|---|---|
| 拖前 | `d="M30 56 Q50 42 70 56"`，手柄与虚线起点重合 |
| 拖后 | `d="M19.4459… 51.7784… Q50 42 70 56"`，手柄中心与新虚线起点 **dx=0 dy=0** |
| 未跳开 | 虚线端点跟着指针走；没有落到整块画板线性映射（那种写法起点会停在约 scene X=24，而不是 19.4） |

---

## 结论

T8 视觉 meet 对齐、T10 路径拖动映射，在默认宽画布 letterbox 上浏览器再验通过。T9 拖放基线未在本轮单独点测（本次只点卡片添加，未做从卡片拖到画板）。
