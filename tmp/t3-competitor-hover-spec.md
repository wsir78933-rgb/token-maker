# CoaMaker Charges 图库：素材卡片名称 hover 交互规格

来源：https://coamaker.com/ （Charges → Animal 图库）  
侦察方式：本地 ego-browser 实机 hover + 计算样式 + MutationObserver / `getAnimations()`  
对照图：`tmp/t3-coamaker-rest.png`、`tmp/t3-coamaker-hover-short.png`、`tmp/t3-coamaker-hover-long.png`  
侦察日期：2026-08-22

本文件是可直接照做的实现规格，不是观感描述。

---

## 结论（对应 5 个考察点）

| # | 问题 | 实测结论 |
|---|---|---|
| 1 | 非悬浮状态卡片上是否有文字 | **没有。** 卡片只显示素材图。名称只存在于 `title` 和 `img[alt]`，不渲染可见文本。 |
| 2 | 悬浮时名称出现的位置 | **覆盖图片底部。** 卡片内部 `position: absolute; bottom/left/right: 0` 的名称条，不是顶部、不是整卡遮罩、不是卡片外浮层。 |
| 3 | 名称条背景 / 透明度 / 文字 / 字号 | 背景 `rgba(0,0,0,0.6)`（黑 60% 不透明）；文字纯白 `#fff`；字号 **10px**、字重 400、行高 1.2（计算 12px）；左右 padding 4px、上下 2px；居中。单行高 16px，两行高 28px。 |
| 4 | 出现 / 消失是否有过渡及时长 | **名称条无过渡**：hover 时立刻挂载，leave 时立刻卸载（约 0ms）。**卡片高亮有 200ms 过渡**：`background` 与 `box-shadow` 各 200ms，进出相同。 |
| 5 | 卡片本身 hover 高亮 | **有阴影发光 + 径向提亮，无边框、无缩放。** `transform` 保持 `none`；`border` 保持 `0`。 |

---

## 1. 非悬浮（rest）

DOM 只有一层可拖拽卡片 + 一张图，没有 label 节点。

```html
<div
  draggable="true"
  title="Ape"
  style="
    cursor: pointer;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    background: var(--color-card); /* 图库面板内实测 #555 / rgb(85,85,85) */
    padding: 3px;
    box-shadow: rgba(16, 22, 26, 0.3) 0px 0px 5px;
    transition: background 0.2s, box-shadow 0.2s;
  "
>
  <img
    alt="Ape"
    loading="lazy"
    src="…"
    style="
      width: 100%;
      display: block;
      max-height: 100px;
      min-height: 50px;
      object-fit: contain;
      opacity: 1;
    "
  />
</div>
```

照做要点：

- 可见层 = 图片。不要在卡片下方、内部或角落常驻名称。
- `overflow: hidden` + `border-radius: 5px`，为底部名称条切圆角做准备。
- 保留 `title`（辅助，不是主展示）。1.5s 持续 hover 后未见额外浏览器 tooltip；不要依赖 native tooltip。
- 卡片默认阴影：`0 0 5px rgba(16, 22, 26, 0.3)`。
- 图库列宽约 60px（含 3px padding）；图片 `min-height: 50px`、`max-height: 100px`，高度随素材变化。

---

## 2. 悬浮：名称位置

名称条是卡片的第二个子节点，盖在图片底部，宽度与卡片相同。

短名「Ape」：单行，贴底，不超出卡片。  
长名「Boar Head Erased」：两行折行（`Boar Head` / `Erased`），仍贴底、仍在卡片内，最多 2 行。

不要做成：

- 卡片下方的独立 caption
- 顶部条
- 整张卡半透明遮罩
- 跟着鼠标的外部 tooltip

---

## 3. 名称条样式（照抄）

仅在 `:hover` / `onMouseEnter` 时渲染该节点；leave 时卸载，不要 `visibility/opacity` 隐藏。

```css
.charge-card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: normal;
  padding: 2px 4px;
  text-align: center;
  pointer-events: none;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
```

实测计算值：

| 属性 | 值 |
|---|---|
| 背景 | `rgba(0, 0, 0, 0.6)` |
| 文字 | `rgb(255, 255, 255)` |
| 字号 | `10px` |
| 字重 | `400` |
| 字体 | `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| 行高 | `1.2` → 计算 `12px` |
| padding | `2px 4px` |
| 单行高度 | `16px`（2+12+2） |
| 两行高度 | `28px`（2+12+12+2） |
| 最大行数 | 2（`-webkit-line-clamp: 2`） |
| 圆角 | 仅底部 `0 0 5px 5px`，与卡片 5px 对齐 |

---

## 4. 出现 / 消失动画

名称条：

- enter：mouseenter 当帧挂载，`opacity: 1`，无 fade / slide。`getAnimations()` 不包含 label。MutationObserver 记录为 `childList` 增加 `DIV:名称`。
- leave：约 133ms 内（含鼠标移出）卸载，无 fade-out。不要给 label 加 `transition`。

卡片高亮：

```css
.charge-card {
  transition: background 0.2s, box-shadow 0.2s;
}
```

- 时长 **200ms**，进出相同。
- 过渡属性只有 `background` 和 `box-shadow`。
- 不要给卡片加 `transform` transition。

---

## 5. 卡片 hover 高亮（照抄）

无边框变化、无 `scale`。

```css
.charge-card {
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  background: var(--color-card); /* 图库内 #555 */
  padding: 3px;
  box-shadow: rgba(16, 22, 26, 0.3) 0 0 5px;
  transition: background 0.2s, box-shadow 0.2s;
  transform: none;
  border: 0;
}

.charge-card:hover {
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--color-card) 65%, white) 0%,
    var(--color-card) 100%
  );
  box-shadow:
    rgba(255, 255, 255, 0.12) 0 0 20px,
    rgba(255, 255, 255, 0.05) 0 0 15px inset;
}
```

在 `--color-card: #555` 下，径向中心计算为约 `rgb(145,145,145)`，边缘 `rgb(85,85,85)`。

| 状态 | 背景 | 阴影 | 边框 | 缩放 |
|---|---|---|---|---|
| rest | 实色 `#555` | `0 0 5px rgba(16,22,26,0.3)` | 无 | 无 |
| hover | 中心提亮的径向渐变 | 外发光 `0 0 20px rgba(255,255,255,0.12)` + 内发光 `inset 0 0 15px rgba(255,255,255,0.05)` | 无 | 无 |

---

## 推荐实现（最小结构）

```tsx
function ChargeCard({ name, src }: { name: string; src: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      draggable
      title={name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 5,
        overflow: "hidden",
        position: "relative",
        background: hovered
          ? "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-card) 65%, white) 0%, var(--color-card) 100%)"
          : "var(--color-card)",
        padding: 3,
        boxShadow: hovered
          ? "rgba(255,255,255,0.12) 0 0 20px, rgba(255,255,255,0.05) 0 0 15px inset"
          : "rgba(16,22,26,0.3) 0 0 5px",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
    >
      <img
        alt={name}
        src={src}
        style={{
          width: "100%",
          display: "block",
          maxHeight: 100,
          minHeight: 50,
          objectFit: "contain",
        }}
      />
      {hovered ? (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: 10,
            lineHeight: 1.2,
            padding: "2px 4px",
            textAlign: "center",
            pointerEvents: "none",
            borderRadius: "0 0 5px 5px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {name}
        </div>
      ) : null}
    </div>
  );
}
```

面板需提供 `--color-card`（CoaMaker 图库内为 `#555`）。若我方图库底色不同，保持公式 `color-mix(in srgb, var(--color-card) 65%, white)`，不要写死 rgb(145,145,145)。

---

## 不要做

- 非 hover 时显示名称
- 名称条 fade / slide（竞品是挂载/卸载）
- hover `scale` 或加描边
- 卡片外 tooltip 作为主名称
- 整卡遮罩
- 超过 2 行的名称（用 line-clamp 截断）

---

## 证据摘要

- rest 截图：全部卡片无文字（`tmp/t3-coamaker-rest.png`）
- 短名 hover：Ape 底部单行白字黑条 + 卡片发光（`tmp/t3-coamaker-hover-short.png`）
- 长名 hover：Boar Head Erased 底部两行（`tmp/t3-coamaker-hover-long.png`）
- hover HTML 实测名称条 inline style 与上表一致
- enter：50ms 内 label 已存在，`getAnimations()` 仅 `background-color` 200ms + `box-shadow` 200ms
- leave：label 立即移除；卡片 `background`/`box-shadow` 200ms 回到 rest
