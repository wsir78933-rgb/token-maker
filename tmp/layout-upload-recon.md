# Charges → Upload 资料栏 chrome 侦察

只读测量。未改 `src/`、tests、`globals.css`、`WORKLOG`。未 commit / push。

日期：2026-08-22  
本机：`http://localhost:3000/coat-of-arms-maker`（禁止 127.0.0.1）  
竞品：`https://coamaker.com`（公开未登录编辑器）  
方法：ego-browser task space `layout upload recon`；`getComputedStyle` + `getBoundingClientRect`；草稿 overlay 未出现（`.coat-workbench-content[inert]` = false）  
视口：本机与竞品均为 `innerWidth 1496 × innerHeight 756`，`devicePixelRatio 2`  
根字号：本机 `16px`，竞品 `17px`

**产品约束（实现必须遵守）：** Upload 继续是可用的本地文件选择（PNG / JPEG / WebP / 安全 SVG；现有大小与数量上限不变）。竞品 Upload 是锁住的 PRO 卡、栏内没有 `input[type=file]`。禁止把竞品文案、商标、广告、付费墙 CTA 抄进我们的 UI。禁止建议付费墙。禁止去掉校验。禁止改文件数量 / 大小上限。禁止删除 ordinary 资源。

---

## 结论（给实现）

本机 Charges → Upload 已经挂上可用的 `UploadPanel`，但资料栏看起来像「原生 file input 扔在暗盒里」：

1. **栏 padding 已有**，不必新开一套。`.coat-target-library-panel > section` 已经是 `padding: 0.85rem`（13.6px）+ `gap: 0.68rem`（10.88px）。
2. **标题层级已经是资料栏 `h2`**，和 Draw / Animals 同一条规则。不要改成竞品 Upload 卡里的居中 `h3`。
3. **控件是未包装的原生 `input[type=file]`**。资料栏全局 input 规则给它加了暗底圆角，系统仍画出「选择文件 / 未选择任何文件」。实测高 21.92px，远低于现成主按钮 40px。
4. **空白**：控件底到栏底 **362px（栏高的 62.7%）**。原因是 `min-height: 100%` + `align-content: start` + 只有三块矮内容，再叠加 `space-y-2` 与 grid gap。不要用居中营销卡去填这个洞。
5. **视觉化文件控件只用现成 class**：`.coat-target-form-field` + `.coat-target-action-button`（主按钮用 `--primary`，我们的红 `#c0392b`）。真实 `input[type=file]` 继续留在 DOM，改成现成的隐藏 input class。  
   **不要**套 `.coat-custom-shield-uploads`（那是 Custom 里已经做成的竞品 PRO 卡：`#5a5a5a` / `17px` / 绿 200×40）。

对照对象：栏 padding / 标题 / 卡片间距量竞品 Upload；**可点控件**对照竞品 Charges → Animal（搜索条 + 灰底图块），以及本机 Tools → Draw 的主按钮。

---

## 截图

| 文件 | 内容 | 裁切 |
|---|---|---|
| `tmp/layout-upload-ours.png` | 本机 Charges → Upload | 左栏 170px + 资料栏 290px |
| `tmp/layout-upload-coamaker.png` | 竞品 Charges → Upload（广告槽 `display:none`） | 左栏 170px + 资料栏 289px |
| `tmp/layout-upload-coamaker-animals.png` | 竞品 Charges → Animal（广告槽关掉，避免把广告当成栏 chrome） | 同上 |

---

## 1. 本机 Charges → Upload（实测）

挂载：`CoatOfArmsMaker.tsx:133-134` 在 `selectedChargesTreeChild === 'upload'` 时渲染 `<UploadPanel locale={locale} />`。树末项是 `chargesTreeUpload` = `'Upload'`（`workbench-copy.ts:744`）。

DOM 现状（`UploadPanel.tsx:150-157`）：

```tsx
<section aria-label={copy.uploadImage} className="space-y-2">
  <h2>{copy.uploadImage}</h2>
  <p>{copy.uploadDescription}</p>
  <label>
    {copy.uploadCrestImage}
    <input aria-label={copy.uploadCrestImage} type="file" multiple accept="..." onChange={onFileChange} />
  </label>
```

空列表时没有 `h3` / 本地素材列表。校验与命令未动：`validateLocalUploadFile`（`UploadPanel.tsx:26-40`）+ `add-local-upload-images`；上限仍是 `COAT_PROJECT_LIMITS.maxLocalUploadCount = 8`、`maxLocalUploadBytes = 262_144`、`maxTotalLocalUploadBytes = 524_288`（`commands.ts:69-71`）。文案墙：`uploadDescription`（`workbench-copy.ts:751`）。

### 栏 chrome

| 节点 | 尺寸 | padding | 背景 | 来源 |
|---|---|---|---|---|
| `.coat-target-reference-rail` | **170 × 577.23** | 0 | 透明（树底 `#474747`） | 现成左栏 |
| `.coat-target-library-panel` | **290 × 577.23** | **0** | `rgb(58, 58, 58)` | `globals.css:1477` |
| `section[aria-label="Upload image"]` | 290 × 577.23（`min-height: 100%`） | **13.6px**（`0.85rem`） | 透明 | `globals.css:1646-1647`；`display: grid; align-content: start; gap: 10.88px`（`0.68rem`） |

资料栏内容宽 264px（290 − 13.6×2）。

### 标题 / 说明 / 控件

| 节点 | 盒 | 字号 / 字重 | 颜色 | margin |
|---|---|---|---|---|
| `h2`「Upload image」 | 264 × 25.2 | **16.8px / 400**（`1.05rem`） | `rgb(245, 241, 234)` = `--coat-text` | `0 0 8.8px`（`0.55rem`，`globals.css:1645`） |
| `p` 限制说明 | 264 × **96**（4 行 × 24px） | 16px / 400 / lh 24 | 同标题，**不是** `--coat-muted` | `0 0 8px`（来自 `space-y-2` 的非末子 `margin-block-end`） |
| `label`「Upload crest image」 | 264 × 41.84 | 13.28px / 400 = `--coat-muted` `rgb(171, 164, 151)` | `globals.css:1648` | 0 |
| `input[type=file]` | 264 × **21.92** | 13.28px | 暗底 `oklab(0.123…)` ≈ `--coat-stage`；边框 1px `--coat-line`；**radius 10px**（`0.625rem`） | `appearance: none` 仍露出 UA 按钮 |

文件控件仍真实存在：`accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"`，`multiple=true`，`aria-label="Upload crest image"`，可见。

间距叠加（h2 底 → p 顶 = 19.67px）：`h2 margin-bottom 8.8` + **grid gap 10.88**。p 底 → label 顶 = 18.88px：`p margin-bottom 8` + gap 10.88。`space-y-2` 与资料栏 grid gap **叠了两层**。

### 空白

| | px |
|---|---|
| 栏顶 → 控件底 | 215.18 |
| 控件底 → 栏底 | **362.05** |
| 空白占栏高 | **62.7%** |

`emptyBelow.leftover` 用 section 对 panel 的高度差是 0，因为 section 被 `min-height: 100%` 拉满；空白是 **grid 在 `align-content: start` 下的未占用轨道**，不是另一个节点。

### 同栏对照：本机 Animals / Draw

Charges → Animals 用同一条资料栏规则：`h2` 同样 16.8px/400、section padding 13.6 / gap 10.88。栏被搜索 + 图块填满（section 高 705.85，可滚动）。搜索框 247.81 × 46.47，padding `11.2px 12px 11.2px 35.2px`，radius 10px。图块 `coat-gallery-card` 约 79.94 × 86.93，padding 4px，radius 4px。

Tools → Draw（现成「标题 + 说明 + 主按钮」）：

| 节点 | 实测 |
|---|---|
| `.coat-target-utility-form` gap | 11.2px（`0.7rem`） |
| `h2` | 16.8px / 400，**margin 0**（`DrawPanel.tsx:43` `style={{ marginBottom: 0 }}`） |
| 主按钮 `.coat-target-action-button--primary` | **262.81 × 40**，padding `8.8px 11.2px`，radius **8px**，字 13.28px / **600**，底 **`rgb(192, 57, 43)`**，白字 |
| `.coat-target-form-field` | 字 13.28px muted，gap 5.6px |
| 控件底剩余空白 | 100.89px（内容多，所以洞小） |
| 隐藏控件 | `input.sr-only`（`DrawPanel.tsx:51-57`） |

---

## 2. 竞品 Upload（只量栏 padding / 标题 / 卡片间距）

**栏内没有 file input。** 唯一 `input[type=file]` 是隐藏的 Export（`accept=".json,.txt"`），不在 tabpanel 里。搜索槽从 DOM 去掉。`.coa-panel-body` 只有 **一张** 居中卡。

**下面的标题 / 段落 / 按钮文案是付费墙，只用来量间距。实现不得抄。**

### 栏 padding（与 Animal 共用）

| 节点 | 宽 | padding | 背景 |
|---|---|---|---|
| 工具轨 `--sidebar-width` | **170** | 0 | `rgb(71, 71, 71)` |
| `.coa-sidepanel-content` | **289** | **`8px 0 0`** | `rgb(58, 58, 58)` |
| `.coaChargesContainer` | **283** | 0 | 透明 |
| `.coa-panel-body` | 283（Upload 短内容） / Animal 时 277 | **`6px 10px`**（Animal ↔ Upload 相同） | 透明 |

广告槽 `.flag-top-ad` 默认 277 × 184。测量 Upload 时已 `display:none`，避免把广告空隙当成 dropzone。截图同样关掉广告。

### 标题层级（间距，不抄文案）

| 节点 | 盒 | 字 | 对齐 |
|---|---|---|---|
| 卡内 `h3.text-lg.font-semibold` | 213.84 × 59.5（两行） | **19.125px / 600** / lh 29.75 | center |
| 卡内 `p.mb-3` | 213.84 × 72 | 16px / 400 / lh 24；`margin-bottom 12.75px`（`0.75rem` @ 17px） | center |
| 卡内 `button`（PRO CTA） | **200 × 40**（`min-width: 200px; min-height: 40px`） | 14.875px / 500；padding `8.5px 17px`；radius 3.1875px | center |

我们的主按钮高度已经是 40px，与这颗 CTA **同高**。颜色不要用它的 `rgb(22, 163, 74)`；用现成 `--primary` 红。

### 卡片间距

内联：`style="text-align: center; width: 95%; margin: 16px auto;"`  
class：`rounded-lg border border-border bg-accent p-4 shadow-sm`

| token | 计算值 |
|---|---|
| 卡尺寸 | **249.84 × 220.25** |
| 水平边距 | `6.58px`（`auto` 落在 tabpanel 内容宽 263 的 95%） |
| 垂直边距 | **16px** |
| padding | **17px**（`p-4` @ 17px 根） |
| 边框 | `1px solid rgb(99, 99, 99)` |
| 半径 | **4.25px**（`rounded-lg`） |
| 背景 | `rgb(90, 90, 90)` |
| tabpanel 高 | 264.25；卡以下到栏底大约 **360px** 空暗底（量级与本机 362px 接近） |

**不要**把这张卡当 Upload 的目标布局。本机 `.coat-custom-shield-uploads`（`globals.css:1770-1812`）已经是同一套：`margin: 16px auto`、`padding: 17px`、`background: #5a5a5a`、`border-radius: 4.25px`、绿钮 `width: min(200px, 100%); height: 40px; background: #43aa53`。那是 Custom 盾形上传用的。Charges → Upload **不要复用这个包装**。

---

## 3. 竞品 Animal（可点控件样式，给文件控件对照）

广告关掉后：搜索贴在栏顶（y=157），图块紧跟在搜索下 **13px**（含 tabpanel 上 padding 6px）。

| 控件 | 尺寸 | 边框 / 半径 / 底 | padding |
|---|---|---|---|
| `.search-container` | 277 × 44.5（含左右 10px） | — | `0 10px` |
| 搜索 input | **257 × 36** | `1px solid rgb(99, 99, 99)`；radius **3.1875px**；底 `rgb(58, 58, 58)`（与栏同色） | `6.375px 34px`；字 14.875px |
| 图块 wrap | **59.75 × 56** | 无描边；半径 **5px**；底 **`rgb(85, 85, 85)`** | **3px** |
| 图块 img | 53.75 × 50 | — | 0 |
| `.coa-panel-body` | padding **`6px 10px`** | 与 Upload 相同 | |

Animal **没有**栏顶 `h2`/`h3`（中部图墙里的 upsell `h3` 是付费墙，不抄）。栏身是「紧搜索 + 满网格」，所以没有 Upload / 本机 Upload 那种大块空暗底。

给实现的映射（不是新设计系统）：

- 「满宽、可点、填满栏内容区」→ 本机 `.coat-target-action-button`（已是满宽 40px 高），不要做 60×56 图块当选文件钮。
- 「字段说明在控件上方」→ `.coat-target-form-field`（muted 13.28px + gap 5.6px）。
- 「栏内边距」→ 继续用资料栏 `0.85rem`，不要再套竞品卡的 17px / 16px auto / 95% 宽。

---

## 4. 建议 DOM / CSS

只动 `UploadPanel.tsx` 的 JSX class。**不必新写 globals 规则。** `input[type=file]` 必须留下，`accept` / `multiple` / `aria-label` / `onChange` → `createValidatedLocalUpload` 不变。

参考本机已有写法：

- Draw 主按钮 + 隐藏 input：`DrawPanel.tsx:45-57`
- 表字段：`DrawPanel.tsx:58-69`、`NamePanel.tsx:45-57`
- 隐藏 file input 的现成 clip class：`globals.css:1813-1821`（`coat-custom-shield-upload-input`）。可以用它，**不要**连同 `.coat-custom-shield-uploads` 绿卡一起用。

建议（class 名都已存在）：

```tsx
<section aria-label={copy.uploadImage}>
  <h2 style={{ marginBottom: 0 }}>{copy.uploadImage}</h2>
  <label className="coat-target-form-field">
    <span>{copy.uploadCrestImage}</span>
    <span className="coat-target-action-button coat-target-action-button--primary">
      {copy.uploadCrestImage}
      <input
        className="coat-custom-shield-upload-input"
        aria-label={copy.uploadCrestImage}
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={onFileChange}
      />
    </span>
  </label>
  <p>{copy.uploadDescription}</p>
  {uploads.length > 0 ? (
    <section aria-label={copy.localUploads} className="coat-target-utility-output">
      <h3>{copy.localUploads}</h3>
      <ul aria-label={copy.localUploads}>
        {uploads.map((upload, index) => (
          <li key={upload.id} aria-label={copy.localUploadItem(index, upload.mimeType)}>
            <span>{copy.localUploadItem(index, upload.mimeType)}</span>
            <span className="coat-target-form-actions">
              <button className="coat-target-action-button" type="button" aria-label={copy.addLocalImage(index)} onClick={() => addExistingUpload(upload.id)}>
                {copy.addLocalImage(index)}
              </button>
              <button className="coat-target-action-button" type="button" aria-label={copy.removeLocalUpload(index)} onClick={() => removeExistingUpload(upload.id)}>
                {copy.removeLocalUpload(index)}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  ) : null}
  {error ? <p role="alert">{error}</p> : null}
  {status ? <p role="status">{status}</p> : null}
</section>
```

要点：

1. **去掉 `space-y-2`。** 资料栏规则已经是 grid + `gap: 0.68rem` + `padding: 0.85rem`（`globals.css:1646-1647`）。再留 `space-y-2` 会继续把 8px 加在 gap 上。
2. **`h2` 用 `marginBottom: 0`**，与 Draw 一致，避免再叠 `0.55rem`（`globals.css:1645`）。
3. **file input 不是 `form-field` 的直接子节点。** 否则会命中 `globals.css:1984-1996` 的 `> input:not([type='checkbox']):not([type='range'])`（`min-height: 2.25rem` + 可见边框），原生按钮会再次露出来。把它放在 `span.coat-target-action-button` 里，用 `coat-custom-shield-upload-input` clip 掉。
4. **主按钮颜色用 `--primary` 红**，满资料栏内容宽（Draw 实测 262.81 × 40）。不要 200px 居中绿钮。
5. **限制说明保留原文**，放在按钮下面（先给可点控件，再给限制）。不要改 8 个 / 256 KB / 512 KB。
6. **不要**给 section 加居中卡、`width: 95%`、`margin: 16px auto`、`padding: 17px`、`background: #5a5a5a`。栏底空白与竞品 Upload 同量级；Draw 也留空。填洞的方式是让顶部控件像 Draw，不是铺一张 PRO 卡。
7. 本地列表的 Add / Remove 用 `.coat-target-action-button`（非 primary），与 Names 的 `.coat-target-form-actions` 一致。

### 为什么不用竞品 Animal 的 3.1875px 半径

Animal 搜索半径 3.1875px、图块 5px，是竞品自己的 token。本机资料栏控件已经是 `0.5rem`（8px）按钮 / `0.625rem`（10px）input。对齐本机 Draw / Names，不要为 Upload 单独引入竞品半径。

---

## 5. file:line

| 用途 | 位置 |
|---|---|
| 面板 DOM（h2 / 说明墙 / 裸 file input） | `src/components/coat-of-arms/UploadPanel.tsx:150-157` |
| 校验（保留） | `UploadPanel.tsx:26-40`、`108-115` |
| 文案 | `src/components/coat-of-arms/workbench-copy.ts:744`（树标 `'Upload'`）、`:751`（`uploadImage` / `uploadDescription` / `uploadCrestImage`） |
| 数量 / 字节上限（保留） | `src/lib/coat-of-arms/commands.ts:69-71` |
| Maker 挂载 | `src/components/coat-of-arms/CoatOfArmsMaker.tsx:133-134`、`:157`、`:325` |
| 资料栏宽 / 底 | `src/app/globals.css:1477` |
| 资料栏 padding / gap / h2 / 裸 input 圆角 | `globals.css:1645-1650` |
| form-field | `globals.css:1974-1996` |
| action-button / --primary | `globals.css:2051-2072` |
| Draw 对照 | `src/components/coat-of-arms/DrawPanel.tsx:41-69` |
| 不要复用的 PRO 形包装 | `globals.css:1770-1812`；`ShieldFieldPanel.tsx:292-299` |
| 可复用的隐藏 file input | `globals.css:1813-1821` |

---

## 6. 不要做

- 付费墙卡、绿 CTA、`Upgrade` / `PRO` 文案、广告槽、竞品商标。
- 复用 `.coat-custom-shield-uploads` 当 Charges Upload 外壳。
- 新设计系统、新颜色、新半径。
- 改 `accept` / 校验 / 8 个文件 / 256 KB / 512 KB。
- 删 ordinary 资源或 ordinary 代码路径。
- 为填 362px 空白做巨大 dropzone（本任务只要把文件控件视觉化）。
- 把 `input[type=file]` 从 DOM 拿掉只留假按钮。

---

## 7. 未覆盖

- 中文 locale 栏（本机截到的 UA 文案「选择文件」来自系统 file picker，隐藏原生 input 后不会再出现）。
- 已有本地上传列表的实测（本次空项目，`uploads.length === 0`）。
- 真的选一张 PNG 的命令路径（`CoatOfArmsPanels.test.tsx` 已覆盖；本任务只量 chrome）。
- 手机资料栏。
- 竞品已付费会话（公开未登录只有锁卡）。
