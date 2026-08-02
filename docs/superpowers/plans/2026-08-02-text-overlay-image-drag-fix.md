# Text Overlay Image Drag Fix

## Goal

After text is added, dragging a blank part of the preview moves the image, while dragging a text element continues to move only that text. The behavior must be identical in normal and batch editing because both use the shared canvas.

## Confirmed interaction

- Blank preview area: drag the image.
- Text element area: drag the text.
- Existing text editing and selection behavior stays intact.

## Scope

- `src/components/editor/TextCanvasOverlay.tsx`
- `src/components/editor/TextCanvasOverlay.test.tsx`

## Out of scope

- Canvas image-offset calculations
- Batch item state, drafts, export, layout, styling, dependencies, and localization
- Unrelated refactors

## Implementation

1. Add a focused failing test that describes the pointer-event contract:
   - the full-size text overlay does not intercept blank-area pointer events;
   - each text element remains pointer-interactive.
2. Make the overlay root transparent to pointer events.
3. Make each draggable text element explicitly pointer-interactive.
4. Remove the overlay-root click handler because the underlying canvas already clears text selection when image dragging starts.

## Verification

- Focused overlay and canvas tests
- TypeScript, lint, complete test suite, and production build
- Browser verification in batch mode:
  - blank-area drag changes the base canvas image while text position is unchanged;
  - text drag changes text position while the base canvas image is unchanged;
  - no browser errors or warnings are introduced.

## Constraints

- Use the smallest direct fix; do not add abstractions or dependencies.
- Functions and variables must remain single-purpose and precisely named.
- Do not commit or push.
