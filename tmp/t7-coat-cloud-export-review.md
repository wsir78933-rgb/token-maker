# T7 只读复核：纹章云导出

- 任务：task_fa77a1498fee / dispatch ctx_03ed8e9be73c
- 范围：只读。未改产品文件。未 commit。
- 结论：**通过（无 High / 无产品缺陷）。** Download 后静默 `coats/` 三格式上传、冻结合约、Token share 未改、Fail Fast、失败可见均成立。残留是测试缺口。

## 验证命令（完整输出）

```
pnpm exec vitest run src/lib/coat-of-arms/cloud-export src/app/api/coat-export src/components/coat-of-arms/ExportMenu.test.tsx
```

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/cloud-export/constants.test.ts (14 tests) 4ms
 ✓ src/lib/coat-of-arms/cloud-export/r2-storage.test.ts (6 tests) 4ms
 ✓ src/app/api/coat-export/route.test.ts (10 tests) 101ms
 ✓ src/lib/coat-of-arms/cloud-export/server-validation.test.ts (9 tests) 84ms
 ✓ src/lib/coat-of-arms/cloud-export/client-upload.test.ts (11 tests) 10ms
 ✓ src/components/coat-of-arms/ExportMenu.test.tsx (9 tests) 223ms

 Test Files  6 passed (6)
      Tests  59 passed (59)
   Start at  10:17:38
   Duration  1.16s (transform 286ms, setup 0ms, import 535ms, tests 426ms, environment 1.02s)
```

补充（回归，非任务指定）：

```
pnpm exec vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx -t "JPG-specific success|every export format|transparent background option|PNG export cannot|Chinese-only project and export"
```

```
 Test Files  1 passed (1)
      Tests  5 passed | 93 skipped (98)
```

```
node --input-type=module -e 'import { jsPDF } from "jspdf"; ...'
```

输出：`{"header":"%PDF-1.3","startsWithPercentPdf":true,"byteLength":3544}`

`git diff --stat -- src/lib/share src/app/api/share src/lib/coat-of-arms/export.ts`：空。

---

## 核对清单

### 1. 冻结公开合约（名称和语义）

| 合约 | 结果 | 验证 |
|---|---|---|
| `COAT_EXPORT_OBJECT_PREFIX = 'coats'` | 通过 | `constants.ts:1`；`constants.test.ts` `defines frozen export constants` |
| `COAT_EXPORT_ID_LENGTH = 10` | 通过 | 同上 |
| `COAT_EXPORT_MAX_FILE_BYTES = 5 * 1024 * 1024` | 通过 | 同上 |
| `COAT_EXPORT_MAX_REQUEST_BODY_BYTES = 8 * 1024 * 1024` | 通过 | 同上 |
| `COAT_EXPORT_CACHE_CONTROL = 'public, max-age=2592000, immutable'` | 通过 | 同上；`r2-storage.test.ts` PutObject CacheControl |
| `COAT_EXPORT_LONGEST_EDGES = [256, 512, 1024, 2048]` | 通过 | `constants.ts:6`；测试 `toEqual([256, 512, 1024, 2048])` |
| `CoatCloudExportFileType = 'png' \| 'jpeg' \| 'pdf'` | 通过 | `constants.ts:8` |
| `assertCoatCloudExportFileType` 非法值 throw 且含实际值 | 通过 | `constants.ts:14-16`；测试 webp/jpg/null/123 |
| `isCoatExportLongestEdge` | 通过 | `constants.ts:19-24`；拒绝 `'512'`、128 |
| `getCoatExportObjectExtension` jpeg→jpg | 通过 | `constants.ts:30-33` |
| `getCoatExportObjectKey` → `coats/{id}.{ext}`，trim 后长度必须为 10，throw 含实际 id | 通过 | `constants.ts:40-45`；空/短/长/null 均 throw |
| `getCoatExportContentType` png/jpeg/pdf MIME | 通过 | `constants.ts:48-58` |
| `parseCoatExportUploadPayload`：file 为 raw base64（禁 `data:`）、fileType、width/height、locale? | 通过 | `server-validation.ts:176-248`；`data:` 测试 400 |
| locale 缺省或非 zh → en | 通过 | `normalizeLocale`；JPEG 省略 locale → en；PDF `locale:'fr'` → en |
| width/height 正整数；max 属于 LONGEST_EDGES | 通过 | `isPositiveInteger` + `isCoatExportLongestEdge`；300×400 → 400 |
| PNG/JPEG：sharp metadata 匹配、拒 APNG、再重编码；超限 413 `file_too_large` | 通过 | `sanitizeRasterExportFile`；APNG 测试 400；oversized source 413 |
| PDF：`%PDF` 开头、不重编码、仍要合法宽高 | 通过 | `fileBuffer.equals(sourceFile)`；jsPDF 实输出 `%PDF-1.3` |
| `uploadCoatExportObject` 返回 `{ key }`，不返回 imageUrl | 通过 | `r2-storage.ts:51`；测试 `not.toHaveProperty('imageUrl')` |
| env = `NonNullable<ReturnType<typeof getShareStorageEnv>>` | 通过 | `r2-storage.ts:2,10`；`import type` only |
| `CoatExportUploadError` + `uploadCoatExportToCloud(...): Promise<void>` | 通过 | `client-upload.ts:21-29,108-120`；成功返回 `undefined` |
| POST `/api/coat-export`；body `{ file, fileType, width, height, locale }` | 通过 | `client-upload.ts:135-144` |
| 成功 `{ ok: true }`，禁止 imageUrl/shareUrl/key | 通过 | `route.ts:112`；`route.test.ts` 显式 `not.toHaveProperty` |
| 限流 key `coat-export:ip` | 通过 | `route.ts:62`；测试 `/^coat-export:ip:[a-f0-9]{24}$/` |
| 文案 `cloudExportSaved` / `cloudExportFailed` | 通过 | `workbench-copy.ts` en/zh；ExportMenu 使用 |

未改 `@/lib/share` 运行时实现。`r2-storage.ts` 只 type-import `getShareStorageEnv`。route 复用公开的 `getShareStorageEnv` / `createUpstashRateLimiter` / `getClientIp`，符合「对齐 share route」。

### 2. Download + 静默 `coats/` 上传

`ExportMenu.tsx` `downloadSelectedExportThenUpload`：

1. 本地 `createCoatExportBlob` → `downloadCoatBlob`
2. 先 `setStatus(getDownloadSuccessMessage(...))`
3. 再 `uploadCoatExportToCloud`
4. 成功把 status 改成 `本地成功文案 + cloudExportSaved`
5. 上传失败进内层 catch：保留本地下载，`setError(cloudExportFailed(...))`

验证：`ExportMenu.test.tsx` `downloads locally before uploading...` 用 `downloadedBeforeUpload` 锁顺序；status 含 `Export saved.` 且不含 `https?://` / `blob:` / `imageUrl` / `shareUrl`。失败用例：alert `Cloud save failed: storage_not_configured`，本地 click 仍发生，status 仍是 `PNG exported locally.`

Share / Print 不上传：同一文件 `uploads JPEG and PDF... does not upload Share or Print`，upload 调用次数保持 2。

对象键前缀：`coats/`。Token share 仍是 `shares/`（`src/lib/share/constants.ts` `SHARE_OBJECT_PREFIX = 'shares'`）。同 bucket、不同前缀，无碰撞。

「静默」= 不暴露 URL、不另开确认、不走 Token share 对话框。成功/失败仍有 `cloudExportSaved` / `cloudExportFailed`，与冻结文案一致。

### 3. 三格式

| 层 | png | jpeg | pdf |
|---|---|---|---|
| constants 扩展名/MIME | png / image/png | jpg / image/jpeg | pdf / application/pdf |
| server-validation | sharp 重编码 | sharp 重编码 | `%PDF` 原样 |
| r2 PutObject | `coats/{id}.png` | `coats/{id}.jpg` | `coats/{id}.pdf` |
| client POST fileType | `'png'` | `'jpeg'`（不是 jpg） | `'pdf'` |
| ExportMenu Download | Download PNG | Download JPG | Download PDF |

验证：`r2-storage.test.ts` `it.each` 三格式；`client-upload.test.ts` jpeg 保持 JSON `fileType:'jpeg'`；`ExportMenu.test.tsx` 切 jpeg/pdf 后 upload 的 `fileType`。

### 4. 未改 Token share

验证：

- `git status` / `git diff --name-only`：无 `src/lib/share/**`、无 `src/app/api/share/**`
- `git diff --stat -- src/lib/share src/app/api/share`：空
- `src/app/api/share/route.ts` 仍返回 `{ id, shareUrl, imageUrl }`（约 110–116 行）
- `uploadShareImage` 仍返回 `{ key, imageUrl }`
- `rg uploadShareImage` 仅 share 模块与 share route
- coat 客户端只 POST `/api/coat-export`，不调 `/api/share`

工作区另有 **无关** 脏文件：`Header.tsx` / `ControlPanel.tsx` 及其测试（去掉 Cmd+Shift+Z / Ctrl+Y 重做）。不是 Token share，也不是本任务。

### 5. Fail Fast

客户端（throw，消息含实际值）：

- 非法 fileType：`Invalid coat cloud export file type: "jpg"`
- width/height：`Invalid coat export width: 0` / `height: -1` / `1024.5`
- 最长边：`Invalid coat export longest edge: 1080`
- 空 Blob：`Coat export file is empty; received 0 bytes`
- 非法 id：`Invalid coat export id: "short"`
- 非 Buffer：`Invalid coat export file buffer: "not-a-buffer"`

验证：`client-upload.test.ts`、`constants.test.ts`、`r2-storage.test.ts`。

HTTP 边界对齐 share：不 throw 给用户，返回 `{ error }`。`invalid_file` / `file_too_large` 不回显攻击 payload，与 `parseShareUploadPayload` 相同。sharp `Error` → 400 `invalid_file`，非 Error 再 throw，与 share `sanitizePngImage` 相同。

route：`SyntaxError` → `invalid_json`；其它 JSON 异常再 throw。`RateLimiterUnavailableError` → 503；其它限流异常再 throw。`uploadCoatExportObject` **无 catch**（R2 失败变 500，不装成成功）。

ExportMenu：本地导出失败 → `exportOperationFailed`；云上传失败 → `cloudExportFailed`。内层 catch 不是吞错，是保留已发生的本地下载并显示云失败。测试锁了这一点。

client-upload：`fetch` 失败 → `CoatExportUploadError('network_error')`；HTTP 非 2xx → 映射 API code；`200` 但没有 `ok:true` → `unknown_error`（即使 body 里有 imageUrl 也不当成功暴露）。验证：`client-upload.test.ts` `treats a successful HTTP response without ok:true as unknown_error`。

### 6. 测试锁了什么 / 没锁什么

已锁：

- 冻结常量与 throw 信息
- jpeg→jpg 对象键
- PNG/JPEG 重编码与维度/格式匹配
- APNG 400
- `data:` 前缀 400
- 源文件超 5MB → 413
- PDF 原样接受
- R2 三格式、无 imageUrl
- 客户端 raw base64、void 返回、忽略成功体内 URL
- API `{ ok:true }` 无 imageUrl/shareUrl/key
- 限流 `coat-export:ip`、415/403/429/503/413/400
- Download 先于 upload；失败保留本地；Share/Print 不上传

未锁（见 findings）：

- 非 `%PDF` 的 PDF 拒绝
- 重编码后才超 5MB 的 413
- route 层 jpeg/pdf `fileType` 透传（parser mock 写死 png）
- `COAT_EXPORT_SIZES` 与 `COAT_EXPORT_LONGEST_EDGES` 必须保持相等
- `CoatOfArmsMaker.test.tsx` 点击 Download 未 mock 云上传

### 7. 失败是否吞错

未发现 silent fail。

- 校验失败有 error code + HTTP status
- R2 失败不返回 `{ ok: true }`
- 客户端把非 ok 映射成 `CoatExportUploadError`
- UI 显示 `cloudExportFailed(message)`，message 为 error code（如 `storage_not_configured`）
- 本地下载失败走 `exportOperationFailed`，不会假装成功后再上传

---

## Findings

### F1 — 测试缺口（Low）：非 `%PDF` 的 PDF 拒绝未锁

- 代码：`server-validation.ts` `isPdfFileBuffer`，非 `%PDF` → `{ error:'invalid_file', status:400 }`。
- 测试：只有「接受以 %PDF 开头的 PDF」。没有「`fileType:'pdf'` 但字节是 `not-a-pdf` → 400」。
- 生产路径：本机 `jspdf` `output('arraybuffer')` 头是 `%PDF-1.3`，会通过校验。
- 验证：读 `server-validation.ts:122-127,212-215`；`rg` `server-validation.test.ts` 无 reject-PDF 用例；node 打印 jsPDF header。

### F2 — 测试缺口（Low）：重编码后超 5MB 的 413 未锁

- 代码：`sanitizeRasterExportFile` 在 sharp 重编码后再比 `COAT_EXPORT_MAX_FILE_BYTES`。
- 测试：只覆盖 **解码后、重编码前** 的源字节超限。
- 验证：`server-validation.ts:165-167` vs 测试名 `rejects file bytes above the source byte limit before decoding`（名称还不准确：实际是 decode 之后检查）。

### F3 — 测试缺口（Low）：API route 未锁 jpeg/pdf 透传

- `route.test.ts` `loadRoute` 把 `parseCoatExportUploadPayload` mock 成永远 `fileType:'png'`。
- 成功用例只断言 `uploadCoatExportObject` 收到 png。
- 若有人把 route 写死 `fileType: 'png'`，该文件仍绿；`r2-storage.test.ts` 仍会锁三格式，但那是直接调 storage。
- 验证：`route.test.ts:80-88,240-263`。

### F4 — 测试隔离（Low）：`CoatOfArmsMaker.test.tsx` 点击 Download 未 mock 云上传

- `rg uploadCoatExportToCloud src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`：无匹配。
- `reports the JPG-specific success message...` 断言 textContent **精确等于** `JPG exported locally.`。jsdom 里 `fetch('/api/coat-export')` 失败，内层 catch 让 status 停在本地成功文案，所以测试仍绿。若将来 fetch 被全局 mock 成 `{ ok:true }`，文案会变成 `JPG exported locally. Export saved.`，该测试会红。
- 该文件也不断言「没有 cloudExportFailed alert」。
- `ExportMenu.test.tsx` 有正确 mock，产品行为仍被锁住。
- 验证：跑了 5 条 workbench 导出测试，5 passed。

### F5 — 残留风险（Low）：两套尺寸常量无等式锁

- `src/lib/coat-of-arms/export.ts` `COAT_EXPORT_SIZES = [256, 512, 1024, 2048]`
- `cloud-export/constants.ts` `COAT_EXPORT_LONGEST_EDGES` 同值
- 无测试要求二者相等。若只给导出尺寸加 4096，本地下载成功，上传会 throw `Invalid coat export longest edge: 4096`，UI 走 `cloudExportFailed`（Fail Fast，用户仍有本地文件）。
- 验证：两边源码对照；无跨模块断言。

---

## 非缺陷说明

- HTTP `invalid_file` 不带 offending value：与 Token share `invalid_image` 同策略，避免回显上传内容。
- 解析结果里的 `locale` 校验后未再用于 URL：冻结合约要求收该字段；coat 成功体禁止 URL，因此不用 locale 拼 shareUrl。
- 客户端有 `upload_failed` code，API 不返回它：R2 失败直接 500，客户端变成 `unknown_error`。share route 同样不 catch 上传。
- 隐私文案仍只写 `/api/share`：不在本次冻结合约里；静默上传是需求本身。
- `Header`/`ControlPanel` 脏文件：上一班 Token 编辑器撤销快捷键，与本复核无关。

## 未做

- 未改文件（除本报告）
- 未 commit / push
- 未跑全量 `pnpm test` / typecheck / lint
- 未在浏览器点真实 Download（无开工范围外的 UI 验证；单元测试已覆盖该点击路径）
