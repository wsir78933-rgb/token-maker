# Share security and low-risk performance implementation plan

## Goal

Close the confirmed share/contact privacy and abuse-control gaps, and deliver the approved low-risk performance work without changing the editor's visual design or deploying external configuration.

## Confirmed scope

- Remove third-party analytics from public share pages and stop share events from carrying capability IDs or complete share URLs.
- Replace per-process share and contact limits with an Upstash Redis REST fixed-window limiter. The app runs directly on Vercel and trusts only Vercel's `x-vercel-forwarded-for` header.
- Gate contact and share writes before reading JSON. Require JSON and same-origin browser requests, and return a clear service-unavailable response when Redis is not configured.
- Add direct `sharp` dependency. Fully decode, dimension-check, and re-encode share PNGs before R2 upload.
- Incrementally render the Coat raster gallery, lazy-load its images, dynamically import JSZip only for ZIP exports, and bound image-border mask cache memory by bytes.
- Document only the new environment-variable names; do not write real credentials, change Vercel settings, change R2 lifecycle, deploy, commit, or push.

## Architecture and module boundaries

- `src/lib/share/client-ip.ts` owns Vercel header normalization only.
- `src/lib/share/rate-limit.ts` exposes a small `RateLimiter` interface and the Upstash REST implementation. Routes consume only the interface.
- `src/lib/request-validation.ts` owns content-type, origin, and byte-limited body validation shared by both POST routes.
- `src/lib/share/server-validation.ts` owns share payload normalization plus `sharp` decoding/re-encoding. The route only orchestrates request checks, rate checks, image parsing, and storage.
- `src/lib/renderer/image-border-mask-cache.ts` owns byte-aware canvas retention and releases backing stores on eviction. `pipeline.ts` only asks it for/get/set masks.

## Global constraints

- Keep the existing `/api/share` response shape and R2 object keys.
- Keep existing contact validation, honeypot behavior, and Resend request fields.
- Do not add a memory limiter fallback: a missing or unavailable shared limiter returns `503` so the production protection cannot silently degrade.
- Do not add a worker, image service, new gallery thumbnails, font conversion, virtualizer dependency, or any unrelated refactor.
- Use test-first red/green cycles. Do not commit, push, or deploy in this task.

## Task 1: Remove public-share analytics and tighten its CSP

**Files:**
- Modify: `src/app/(share-en)/layout.tsx`
- Modify: `src/app/(share-zh)/layout.tsx`
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/editor/ShareDialog.tsx`
- Modify: `src/proxy.ts`
- Modify: `src/app/layout-route-boundaries.test.tsx`
- Create/modify: focused analytics tests if no coverage exists

1. RED: assert both public-share layouts render neither GA nor Clarity; assert `share_copy_link`, `share_social`, and `share_page_cta_click` never receive `id` or `page_location`.
2. GREEN: remove the third-party layout scripts and nonce lookup. Change the three share trackers and their callers to pass only non-sensitive event fields.
3. GREEN: use the public-share CSP branch to allow only self/nonce/strict-dynamic scripts, self/data/blob/R2 images, self connections, and no frames. Preserve the non-share policy.
4. Verify the layout and analytics tests.

## Task 2: Build the Vercel + Upstash request boundary

**Files:**
- Modify: `src/lib/share/client-ip.ts`, `src/lib/share/client-ip.test.ts`
- Modify: `src/lib/share/rate-limit.ts`, `src/lib/share/rate-limit.test.ts`
- Create: `src/lib/request-validation.ts`, `src/lib/request-validation.test.ts`
- Modify: `README.md`

1. RED: test that only a valid `x-vercel-forwarded-for` address is selected and untrusted CF/real/XFF headers are ignored.
2. RED: test an Upstash fixed-window command response, invalid responses, and hashed rate-limit keys. The limiter returns `{ limited, retryAfterSeconds }`.
3. GREEN: implement a single `RateLimiter.check({ key, maxRequests, windowSeconds })` contract and an Upstash REST `EVAL` implementation that atomically increments and sets the TTL. Missing URL/token or a failed Upstash response throws a specific unavailable error.
4. RED/GREEN: add shared request helpers that (a) accept only `application/json` with optional charset, (b) require an `Origin` exactly equal to `request.nextUrl.origin`, and (c) bound stream reads. Error functions return explicit error codes; they do not parse the body.
5. Document `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` without adding values or touching `.env.local`.

## Task 3: Apply the request boundary to contact and share APIs

**Files:**
- Modify: `src/app/api/contact/route.ts`, `src/app/api/contact/route.test.ts`
- Modify: `src/app/api/share/route.ts`, `src/app/api/share/route.test.ts`

1. RED: test invalid content type/origin, absent limiter configuration, an unavailable limiter, and `429` with `Retry-After` before invalid JSON is parsed.
2. GREEN: make each route orchestrate header checks -> IP limiter -> bounded body -> JSON -> payload-specific validation -> downstream service.
3. Preserve share's `20/minute` IP policy and contact's five-per-ten-minute IP and hashed-email policies using distinct Redis key prefixes.
4. Catch only the known `RateLimiterUnavailableError` to return `503`; retain explicit upstream service failures for R2 and Resend.
5. Verify focused API tests.

## Task 4: Decode and sanitize share PNGs with sharp

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`
- Modify: `src/lib/share/constants.ts`
- Modify: `src/lib/share/server-validation.ts`, `src/lib/share/server-validation.test.ts`
- Modify: share route tests as necessary

1. RED: replace the signature-only fixture with real PNG fixtures and add tests for truncated input, non-PNG data, mismatched square dimensions, a non-1200x630 social image, oversized bytes, and re-decodable sanitized output.
2. Install direct `sharp` dependency using pnpm.
3. GREEN: reject malformed base64 before decoder work; enforce source byte limit; use sharp with a pixel limit, require PNG/single-page dimensions matching the declared export size, and upload its re-encoded PNG output.
4. Return `invalid_image` for decoder/dimension failures and `image_too_large` for input/output byte violations.
5. Verify focused server-validation and API tests.

## Task 5: Incrementally render Coat raster materials

**Files:**
- Modify: `src/components/coat-of-arms/ReferenceAssetGallery.tsx`
- Modify: `src/components/coat-of-arms/ReferenceAssetGallery.test.tsx`
- Modify: `src/components/coat-of-arms/workbench-copy.ts`

1. RED: render 25 raster entries and assert only the first 24 cards/images mount; assert a localized load-more control reveals the next page; assert a category/search change resets the visible count.
2. GREEN: add one local page-size constant and component state. Slice after existing filtering/card expansion. Add native `loading="lazy"`, `decoding="async"`, and stable 100x110 dimensions to raster `<img>` tags.
3. Add minimal English/Chinese load-more copy without changing existing labels or styling.
4. Verify focused gallery tests.

## Task 6: Defer ZIP code and bound canvas-mask retention

**Files:**
- Modify: `src/lib/batch/zip-export.ts`, `src/lib/batch/zip-export.test.ts`
- Modify: `src/lib/coat-of-arms/export.ts`, `src/lib/coat-of-arms/export.test.ts`
- Create: `src/lib/renderer/image-border-mask-cache.ts`, `src/lib/renderer/image-border-mask-cache.test.ts`
- Modify: `src/lib/renderer/pipeline.ts`, `src/lib/renderer/pipeline.test.ts`

1. RED/GREEN: replace static JSZip imports with `await import('jszip')` inside the two ZIP entrypoints; keep existing ZIP behavior and tests.
2. RED: test a byte-aware canvas cache evicts the least-recently-used canvas, clears its backing store, and never retains more than the defined byte budget.
3. GREEN: implement the canvas-only cache with `get`/`set`, exact `width * height * 4` accounting, and backing-store release on eviction/replacement. Set a 32 MiB image-border-mask budget.
4. Replace the generic count-only LRU use in the image-border code and preserve distinct cache keys for inset ratios.
5. Verify focused ZIP/export/cache/renderer tests.

## Task 7: Integrated verification and handoff

1. Run all focused tests from Tasks 1-6, then `pnpm lint`, `pnpm test`, and `pnpm build`.
2. Start the local app only after environment-safe API mocks/tests have passed. Use Ego browser to verify a share route has no GA/Clarity requests, normal page analytics remain intact, and gallery load-more works.
3. Report the exact commands/results plus the still-manual production steps: create/configure the Upstash database and set its two Vercel variables, then rotate the existing locally discovered R2/Resend credentials.
