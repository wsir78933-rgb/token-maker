# T6 浏览器验收 · 紧凑文字三件套

Date: 2026-08-23  
URL: `http://localhost:3000/coat-of-arms-maker`（只用 localhost；HTTP 200；未用 127.0.0.1）  
Method: 本地 ego-browser task space `compact text browser verify` (id 65)，viewport **1512×738**  
Draft overlay: 进入时有 Restore/Discard；已点 **Discard draft**。之后 `inertCount=0`，无 Restore/Discard。  
未改 `src/`，未 commit，未改端口。

Chrome（未改）: `.site-topbar` **99px**；`.coat-target-actionbar` **50px**；`.coat-target-canvas-toolbar` **40px**。

---

## 总表

| # | 步骤 | 结果 | 截图 |
|---|---|---|---|
| 1 | Tools → Text → Text 卡。字在盾中部；左右宽条 + 旋转；无 8 个方块 | **通过** | `tmp/compact-text-straight.png` |
| 2 | Curved Text。弧是一小段（三点贴字），不是铺到白边的大拱；无 8 点框；虚线贴弧 | **通过** | `tmp/compact-text-curve.png` |
| 3 | Ring Text。虚线圆圈住字，不是罩住整块画板；无 8 点框；1 个半径点 | **通过** | `tmp/compact-text-ring.png` |
| 4 | 顶栏可见字体/字号；环选中时有 IN OUT ARC EVEN；不抄竞品广告/PRO | **通过** | 三张图的 canvas toolbar + DOM |

总体：**通过**（4/4）。三种物件大小均有截图证据。

---

## 1. 直线文字 — 通过

操作：Discard draft → 左栏 Tools → 子栏 Text → 点 `button[aria-label="Text"]`。

截图：`tmp/compact-text-straight.png`（180113 bytes）

| 检查 | 实测 |
|---|---|
| 字内容 | `Double-click to edit` |
| 字位置 | SVG `translate(0 -47)`，基线 102 → 场景中心 Y=55。宽条中心屏幕 Y=454；画板 Y=206–721。相对画板高度 **48%**，压在盾面狮子身上，不是画布底边 |
| 左右宽条 | `[data-text-box-width-handle]` = `left`, `right`（各 24×40） |
| 旋转 | `button[aria-label="Rotate selected layer"]` 1 个，在字上方 |
| 8 个缩放方块 | `[data-resize-handle]` **空** |
| 选中框 | 蓝色矩形贴字，不是整块白画板 |

---

## 2. 弧形文字 — 通过

操作：点 `button[aria-label="Curved Text"]`。

截图：`tmp/compact-text-curve.png`（183691 bytes）

| 检查 | 实测 |
|---|---|
| 路径 | overlay / scene `d="M30 56 Q50 42 70 56"`（场景 100×110） |
| 虚线 | `stroke-dasharray="3 3"`，`stroke="#7eb6ff"`。bbox `x=30 y=49 w=40 h=7` |
| 三点 | `curve-start` / `curve-control` / `curve-end` 各 1。屏幕 X≈808 / 979 / 1149；画板 X=551–1406，对应约 **30% / 50% / 70%**，全在盾内，不到白边 |
| 8 点框 | `[data-resize-handle]` **空**；无宽条 |
| 对比旧大拱 | 旧值为 `M10 72 Q50 30 90 72`。现宽 40 场景单位，高 7，是贴字短弧 |

---

## 3. 环形文字 — 通过

操作：点 `button[aria-label="Ring Text"]`。

截图：`tmp/compact-text-ring.png`（185988 bytes）

| 检查 | 实测 |
|---|---|
| 虚线圆 | `<circle cx="50" cy="50" r="18" stroke-dasharray="3 3">`。场景 bbox 32,32,36×36 |
| 屏幕大小 | 圆 168×168 px；画板 856×514。直径约画板宽 **20%**，圈在盾内文字上，不是罩住白画板 |
| 文字路径 | `M50 32 A18 18 0 1 1 49.99 32`，内容 `Ring Text` |
| 半径点 | `[data-text-path-handle="ring-radius"]` **1** 个（圆顶） |
| 8 点框 | `[data-resize-handle]` **空** |

---

## 4. 顶栏字体/字号 + IN OUT ARC EVEN + 不抄 PRO — 通过

直线选中时 canvas toolbar：`aria-label="Font"`（value `cardinal`）、`aria-label="Font size"` = **40**，另有 B/I/U 与对齐。截图可见「Display Serif (system fallback)」下拉与 `- 40 +`。

环形选中时同一条 40px toolbar：

- Font + size **50**
- 按钮 **IN** / **OUT**（`aria-pressed=true`）/ **ARC** / **EVEN**
- 文案：Face text inward / outward、Arc text、Space letters evenly
- 无 Upgrade、无 `\bPRO\b`、无广告条。`document.body.innerText` 广告/PRO 扫描为 false

未抄竞品 City Names 广告或 PRO 付费条。

---

## Chrome 风险（不挡三种物件结论）

- 左栏 Tools 子项在 1512×738 下 **Random 被裁成 `N…dom`，压到 Names**。工具卡本身完整。
- 画布浮动小工具条（复制/翻转/删除）会压到弧/环的虚线，但不改变物件尺寸。
- 字体下拉显示 `Display Serif (system fallback)`，value 仍是 `cardinal`。属回退显示，不是 PRO。
- 直线/弧/环叠在同一枚默认金盾上，后加的环仍可辨认。

---

## 命令

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/coat-of-arms-maker
# 200

# ego-browser task space "compact text browser verify" (id 65)
# Discard draft → Tools → Text → Text / Curved Text / Ring Text
```
