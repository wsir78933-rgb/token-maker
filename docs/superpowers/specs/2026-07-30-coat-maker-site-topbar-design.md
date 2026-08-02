# Coat Maker Site Topbar Design

## Goal

Replace the standalone Coat Maker header with the project's shared site navigation while preserving the Coat Maker workbench and its export action bar.

## Scope

- Apply the shared `ContentSiteTopbar` to `/coat-of-arms-maker` and `/zh/coat-of-arms-maker`.
- Show the existing Token Maker brand, primary site links, and locale switcher.
- Mark the Coat Maker link active on both localized routes.
- Keep the locale switcher on the equivalent Coat Maker route.
- Keep the screen-reader project heading immediately after the shared navigation; keep the existing action bar, including its Export control, visually directly below that navigation.
- Allow the navigation height to grow when its links wrap on smaller viewports.

## Exclusions

- Do not reuse the stateful Token editor `Header`; its keyboard handling and history store belong only to the Token editor.
- Do not change the homepage, existing site-page navigation, Coat Maker tools, export behavior, or localization copy.
- Do not modify unrelated files already present in the working tree.

## Architecture

`CoatOfArmsMaker` will construct the same localized navigation inputs that `InnerPageChrome` uses and pass them to `ContentSiteTopbar`. The layout will retain its dedicated workbench document boundary and action bar. The workbench grid will allow the first row to size to the shared navigation instead of fixing it to the previous 71px standalone header.

## Verification

- Component and route tests cover English and Chinese navigation links, current-route activation, locale switching, preservation of the Export action bar, and server rendering without Coat Maker browser-state access.
- Run the focused Coat Maker test file, then lint and the full test suite.
- Perform a browser check on both localized Coat Maker routes at desktop and narrow viewport widths.
