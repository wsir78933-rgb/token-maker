# Homepage Work Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the confirmed responsive 54-image homepage work gallery above the feedback section in both locales.

**Architecture:** Keep the image manifest and localized copy in one pure data module. Keep interactive visible-count state in one focused client component, and keep route changes limited to importing and placing that component.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library, `next/image`, `lucide-react`.

## Global Constraints

- Work only in `/Users/wusir/Desktop/开发项目集合/token-maker-app-新功能` on branch `codex/新功能`.
- Do not modify the user's current main checkout.
- Do not add dependencies, commit, push, deploy, or create a gallery destination page.
- Follow high cohesion, low coupling, SRP, interface boundaries, KISS, Fail Fast, YAGNI, and precise naming.
- Do not use generic names such as `data`, `temp`, `helper`, `util`, or `manager`.
- Follow the approved wireframe: desktop six columns, mobile two columns, initial 12, batches of 12, final 54, then hide the button.
- Download controls are bottom-right; desktop hover/focus reveals them and mobile keeps them visible.
- Keep original PNG downloads while using `next/image` responsive display optimization.
- Use TDD: every production behavior starts with a focused failing test that is run and observed before implementation.
- Preserve unrelated files and existing homepage sections.

---

### Task 1: Gallery manifest, copy, and source assets

**Files:**
- Create: `src/lib/home-work-gallery.ts`
- Create: `src/lib/home-work-gallery.test.ts`
- Create: `public/work-gallery/*.png` (54 files copied from `/Users/wusir/Desktop/最终54/`)

**Interfaces:**
- Produces: `HOME_WORK_GALLERY_INITIAL_COUNT = 12`
- Produces: `HOME_WORK_GALLERY_BATCH_SIZE = 12`
- Produces: `HOME_WORK_GALLERY_IMAGES: readonly HomeWorkGalleryImage[]`
- Produces: `getHomeWorkGalleryCopy(locale: SiteLocale): HomeWorkGalleryCopy`

**Exact localized copy:**
- English eyebrow: `Token gallery`
- English title: `See What Your Next Token Could Become`
- English description: `Explore 54 finished designs and find inspiration across different characters, frames, and moods. Download any work you want to keep.`
- English button: `View More`
- Chinese eyebrow: `作品展示`
- Chinese title: `看看你的下一枚 Token，可以是什么样子`
- Chinese description: `浏览 54 个完成作品，从不同角色、边框和氛围中找到灵感。喜欢的作品也可以直接下载。`
- Chinese button: `查看更多`

- [ ] **Step 1: Write the failing manifest contract test**

  Test exact count `54`, unique IDs and paths, `.png` paths under `/work-gallery/`, dimensions `1200x630`, both localized copy objects, and filesystem existence under `public/`.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `pnpm test -- src/lib/home-work-gallery.test.ts`

  Expected: FAIL because `home-work-gallery.ts` and `public/work-gallery/` do not exist.

- [ ] **Step 3: Copy the 54 PNG files and implement the minimal typed manifest**

  Copy every PNG from `/Users/wusir/Desktop/最终54/` into `public/work-gallery/`, excluding `.DS_Store`. Use an explicit readonly manifest so client rendering never depends on filesystem order at runtime.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run: `pnpm test -- src/lib/home-work-gallery.test.ts`

  Expected: PASS with all 54 unique files present.

### Task 2: Interactive gallery component

**Files:**
- Create: `src/components/site/HomeWorkGallerySection.tsx`
- Create: `src/components/site/HomeWorkGallerySection.test.tsx`
- Modify: `src/lib/home-work-gallery.ts`
- Modify: `src/lib/home-work-gallery.test.ts`

**Interfaces:**
- Consumes: manifest constants, images, and `getHomeWorkGalleryCopy(locale)` from Task 1.
- Produces: `HomeWorkGallerySection({ locale }: { locale: SiteLocale })`.

**Exact rendering contract:**
- Section marker: `data-testid="home-work-gallery"`.
- Grid ID: `home-work-gallery-grid` and native list semantics.
- Grid classes include `grid-cols-2`, `md:grid-cols-3`, and `lg:grid-cols-6`.
- Every card uses `aspect-square`, matching the approved wireframe. It uses `next/image` with intrinsic `1200x630`, responsive `sizes`, and centered `object-cover`; only the display is cropped, while download links keep the complete original PNG.
- Each original-PNG download is a native link with `download`, a localized accessible name, and a visible focus state.
- Download control stays visible below `lg`; at `lg` it is hidden until card hover or focus-within, using opacity-only feedback no longer than 200ms.
- Count text uses `aria-live="polite"`; the native load-more button uses `aria-controls="home-work-gallery-grid"`.
- Extend `HomeWorkGalleryCopy` with precise functional labels only: English `Download work`, `Fantasy token artwork`, and `of`; Chinese `下载作品`, `奇幻 Token 作品`, and `/`.
- Reuse the existing homepage visual language: `max-w-6xl`, `px-6 lg:px-8`, display-font heading, stone text, gold eyebrow/accent, hairline white borders, dark cards, and the existing `site-cta-primary` button class. Do not add gradients, JavaScript animation, viewport listeners, or effects.
- Follow the selected UI craft rules: heading uses `text-balance`, description uses `text-pretty`, square controls use `size-*`, and the icon-only download link keeps a practical touch target plus visible focus treatment.

- [ ] **Step 1: Write failing behavior tests**

  Render the real component and assert: 12 images and download links initially; exact localized English and Chinese copy; each click reveals `24`, `36`, `48`, then `54`; the button disappears at 54; every download link points to its original PNG and has a `download` attribute; the load-more button controls the gallery grid; count text updates; grid/list semantics and required responsive class tokens are present.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `pnpm test -- src/components/site/HomeWorkGallerySection.test.tsx`

  Expected: FAIL because `HomeWorkGallerySection` does not exist.

- [ ] **Step 3: Implement the smallest client component**

  Use one `useState` value for the visible count, one bounded increment function, `slice` for render selection, native links for downloads, and a native button for expansion. Use `next/image` with intrinsic `1200x630`, responsive `sizes`, and default lazy loading. Do not add effects, animation libraries, classes, strategy objects, or speculative configuration.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run: `pnpm test -- src/components/site/HomeWorkGallerySection.test.tsx`

  Expected: PASS for both locales and every expansion boundary.

### Task 3: Homepage integration

**Files:**
- Modify: `src/app/(en)/page.tsx`
- Modify: `src/app/(zh)/zh/page.tsx`
- Modify: `src/app/site-routes.test.tsx`

**Interfaces:**
- Consumes: `HomeWorkGallerySection` from Task 2.

- [ ] **Step 1: Add an integration expectation before route changes**

  Extend the existing SSR DOM route test to render both localized homepage components and assert the observable section order `selected work -> work gallery -> feedback content`. Do not use a source-string assertion.

- [ ] **Step 2: Run the focused integration test and verify RED**

  Run: `pnpm test -- src/app/site-routes.test.tsx`

  Expected: FAIL specifically because the gallery is absent from both localized homepage compositions.

- [ ] **Step 3: Insert the component in both localized routes**

  Place `<HomeWorkGallerySection locale="en" />` and `<HomeWorkGallerySection locale="zh" />` immediately after `EditorShowcaseSection` and immediately before `HomeSeoContent`.

- [ ] **Step 4: Run focused tests and verify GREEN**

  Run the manifest, component, and route integration tests together.

### Task 4: Regression and visual verification

**Files:**
- Modify only files required to correct verified defects in Tasks 1-3.

- [ ] **Step 1: Run static and automated verification**

  Run independently and preserve each exit code:

  - `pnpm test -- src/lib/home-work-gallery.test.ts src/components/site/HomeWorkGallerySection.test.tsx src/app/site-routes.test.tsx`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm build`

- [ ] **Step 2: Run Ego desktop checks**

  In a dedicated task space, check English and Chinese homepages at a desktop viewport: section placement, six columns, initial 12, each expansion count, button hidden at 54, hover and focus download controls, and original PNG download behavior.

- [ ] **Step 3: Run Ego mobile checks**

  At `390px`, check two columns, six initial rows, persistent download controls, localized copy, expansion to 54, no horizontal overflow, and button removal.

- [ ] **Step 4: Review the complete diff**

  Dispatch independent correctness and regression review against the confirmed requirements. Resolve Critical and Important findings, re-run affected tests, and do not commit or merge.
