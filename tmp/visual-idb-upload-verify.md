# Visual verify: original ~2MB PNG custom-shield upload (IndexedDB)

Date: 2026-08-23  
URL: `http://localhost:3000/coat-of-arms-maker` (localhost only; HTTP 200; not 127.0.0.1)  
Method: ego-browser task space `idb original shield upload verify` (id 45)  
Did not change `src/`. Did not commit. Did not change chrome 99/50/40.

Viewport: **1512×738**. Chrome (unchanged): `.site-topbar` **99px** y=0; `.coat-target-actionbar` **50px** y=99; `.coat-target-canvas-toolbar` **40px** y=149.

---

## Fixtures

| File | Bytes | Notes |
|---|---|---|
| `/tmp/idb-original-shield-2mb.png` (copied to `tmp/visual-idb-upload-source.png`) | **2,282,558** | Valid PNG, 720×792 RGBA, PIL `compress_level=0`. Heater silhouette + 2px checker + 4px hole grid + yellow/red/blue markers. Not canvas-compressed. `> 256KB` and `< 8MB`. |
| `/tmp/idb-reject-over-8mb.png` | **8,388,609** | Valid 1×1 PNG padded to `COAT_PROJECT_LIMITS.maxLocalUploadBytes + 1`. |

Old smash baseline (previous Names/compress run, not this flow): a 2,431,153-byte PNG was canvas-compressed to **23,492** bytes with status `Compressed oversized upload …`. A ~195KB smash would be the same class of failure.

---

## PASS/FAIL

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Custom shield upload of PNG >256KB, ideally ~2MB, without self-compressing | **PASS** | Discarded draft overlay first (`inert` true → false). Custom tab → `input[aria-label="Upload custom shield mask"]`. Uploaded `/tmp/idb-original-shield-2mb.png` (**2,282,558** bytes, 720×792). |
| 2 | Status must NOT say Compressed. Should say added/uploaded. No size alert if file ≤8MB | **PASS** | `role=status` exact: `Custom shield mask selected: idb-original-shield-2mb.png`. No `role=alert`. `document.body` does not contain `Compressed`. |
| 3 | Canvas must not look like the old 195KB smash | **PASS** | Live SVG `<image>` href length **3,043,434** (`data:image/png;base64,…`). IHDR / `naturalWidth×naturalHeight` **720×792** (same as source). Decoded payload matches 2,282,558 bytes, not ~23KB/~195KB. Native 1:1 crop still shows a sharp 4px hole grid and a hard-edged red square. |
| 4 | Refresh, restore draft, upload still there and still sharp | **PASS** | Draft `localStorage['coat-of-arms-maker-draft']` is only **1,247** bytes with `encoding: "indexed-db"`, `byteLength: 2282558`, `customMaskUploadId` set. Reload showed `Draft available`. Clicked **Restore draft**. After restore: `inert=false`, overlay gone, custom mask present, href still **3,043,434**, decode still **720×792**, crop still sharp. |
| 5 | Discard draft, not stuck; optional re-upload still works | **PASS** | Reloaded, clicked **Discard draft**. After: `inert=false`, no Restore/Discard, no custom mask. Custom tab opened; upload input present. Re-uploaded the 2MB PNG: status `Custom shield mask selected: idb-original-shield-2mb.png`, href **3,043,434**, no Compressed. |
| 6 | File over 8MB rejected with a message that includes the byte size | **PASS** | Uploaded `/tmp/idb-reject-over-8mb.png` (**8,388,609**). `role=alert` exact: `Editor action failed: Invalid upload file size: 8388609; fileName is idb-reject-over-8mb.png; mimeType is image/png`. No Compressed. |

Overall: **PASS** (6/6). No product-code changes.

---

## Screenshots

`Page.captureScreenshot` CDP timed out at 15s (live SVG embeds four copies of a 3,043,434-char data URL). Visual proof is the original bitmap plus 1:1 / preview crops of that same live href — not a canvas recompress of the upload.

| Path | What it shows |
|---|---|
| `tmp/visual-idb-upload-source.png` | Original 2,282,558-byte PNG used for upload (720×792). |
| `tmp/visual-idb-upload-native-crop.png` | 160×160 1:1 crop after first upload: sharp hole grid + hard red square. |
| `tmp/visual-idb-upload-preview.png` | 360px-wide preview of the stored original (heater + markers + holes). |
| `tmp/visual-idb-upload-artboard.png` | Same original drawn at artboard display size. |
| `tmp/visual-idb-upload-after-restore-crop.png` | 160×160 1:1 crop after refresh → Restore draft: still sharp, same crop. |

---

## Commands

```bash
# Dev server already listening on :3000 (HTTP 200)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/coat-of-arms-maker

# Fixtures (Python/PIL, compress_level=0; not canvas-compressed)
# /tmp/idb-original-shield-2mb.png  2282558
# /tmp/idb-reject-over-8mb.png      8388609

# Browser: ego-browser task space "idb original shield upload verify" (id 45)
# URL: http://localhost:3000/coat-of-arms-maker
```

Key in-page measurements (ego-browser `js`):

- After first upload: status `Custom shield mask selected: idb-original-shield-2mb.png`; PNG href length `3043434`; `naturalWidth/Height` `720×792`.
- Draft JSON: `uploads[0] = { encoding: "indexed-db", mimeType: "image/png", byteLength: 2282558 }`.
- After restore: same href length and dimensions.
- After discard: `inert=false`; Custom panel usable.
- Oversize: alert includes `8388609`.

---

## Not in scope / leftovers

- Did not change `src/` or git.
- Did not change chrome 99 / 50 / 40 (measured after upload).
- Full-page CDP screenshot helper timed out; used native crops of the live original data URL instead.
- After the optional re-upload + 8MB reject, the 2MB mask is still on the canvas and the size alert is showing (reject does not replace the successful upload).
