# Homepage Work Gallery Design

## Goal

Add a localized 54-image work gallery to the homepage between the existing selected-work section and the feedback section. The gallery proves the breadth of finished Token Maker output, gives visitors visual inspiration, and lets them download the original PNG artwork.

## Confirmed behavior

- Use all 54 unique `1200x630` PNG files from `/Users/wusir/Desktop/最终54/`.
- Desktop uses six columns; mobile uses two columns. Tablet may use three columns to bridge the confirmed breakpoints without changing their geometry.
- Every visible gallery card is square, matching the approved wireframe. The centered subject is cropped from the `1200x630` preview with `object-cover`; the download remains the complete original PNG.
- Render 12 works initially.
- `View More` / `查看更多` reveals the next 12 works on the same homepage: `12 -> 24 -> 36 -> 48 -> 54`.
- Hide the load-more button after all 54 works are visible.
- The download control sits at the bottom-right of each image. It appears on hover or keyboard focus on desktop and remains visible on mobile.
- Gallery display uses responsive `next/image` output. Download links point to the original PNG files.
- Do not create a gallery destination page.

## Localized copy

English:

- Eyebrow: `Token gallery`
- Title: `See What Your Next Token Could Become`
- Description: `Explore 54 finished designs and find inspiration across different characters, frames, and moods. Download any work you want to keep.`
- Button: `View More`

Chinese:

- Eyebrow: `作品展示`
- Title: `看看你的下一枚 Token，可以是什么样子`
- Description: `浏览 54 个完成作品，从不同角色、边框和氛围中找到灵感。喜欢的作品也可以直接下载。`
- Button: `查看更多`

## Architecture

- `src/lib/home-work-gallery.ts` owns the immutable 54-image manifest and localized copy.
- `src/components/site/HomeWorkGallerySection.tsx` is the only client boundary. It owns the visible-count state and renders native download links plus one native load-more button.
- English and Chinese homepage route files import and place the section between `EditorShowcaseSection` and `HomeSeoContent`.
- `public/work-gallery/` owns the copied original PNG assets.

This keeps gallery state, content, routing, and assets separated by responsibility without introducing an abstraction layer that no current requirement needs.

## Accessibility and failure boundaries

- Download links have localized accessible names and visible keyboard focus.
- The count is announced politely after expansion.
- The load-more control uses a native `button` and exposes the controlled grid through `aria-controls`.
- `next/image` receives the intrinsic `1200x630` dimensions while the card reserves a square display area.
- A test verifies exactly 54 manifest entries, unique paths, PNG extensions, and an existing file for each entry. A missing or duplicated source asset fails immediately.

## Verification

- TDD component and manifest tests cover all count transitions, button removal, localization, and original PNG download links.
- `pnpm typecheck`, focused tests, `pnpm lint`, and `pnpm build` must pass.
- A dedicated Ego task space verifies English and Chinese desktop/mobile geometry, hover/focus behavior, downloads, and absence of horizontal overflow.

## Scope exclusions

- No new gallery page.
- No change to the existing selected-work cards, editor, feedback section, footer, metadata, or navigation.
- No dependencies, commits, pushes, or deployment.
