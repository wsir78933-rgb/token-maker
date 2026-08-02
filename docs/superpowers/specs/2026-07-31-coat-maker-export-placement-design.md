# Coat Maker Export Button Placement Design

## Goal

Move the existing Export menu trigger from the separate action bar into the canvas toolbar, immediately to the left of the Multi-select button.

## Approved Placement

- Desktop and mobile use the same component order: Export first, Multi-select second.
- Both controls sit in the right-hand group of `.coat-target-canvas-toolbar`.
- Undo, redo, and local project library controls remain in the left-hand group.

## Scope

- Move the existing `ExportMenu` instance; do not duplicate or recreate it.
- Preserve all export menu behavior, labels, focus restoration, and menu contents.
- Preserve Multi-select behavior and styling.
- Remove the now-empty `.coat-target-actionbar` markup only if nothing else uses it in this component.
- Do not change editor data, exports, navigation, SEO content, or unrelated styling.

## Implementation Shape

Wrap `ExportMenu` and the existing Multi-select button in one right-hand toolbar container. The DOM order is the acceptance contract: Export immediately precedes Multi-select inside that container.

## Verification

- Add a failing component test that locates the canvas toolbar, confirms both controls belong to its right-hand group, and confirms Export precedes Multi-select.
- Run the focused test before and after the implementation.
- Run lint and TypeScript checks for the touched files.
- Browser-check `/coat-of-arms-maker` and `/zh/coat-of-arms-maker` to confirm the visual placement and unchanged menu interaction.

## Non-Goals

- No redesign of either button.
- No export menu content changes.
- No commit, push, or deployment.
