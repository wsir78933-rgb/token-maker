# Batch wheel zoom fix

## Goal

Make mouse-wheel and touchpad zoom in batch item editing behave exactly like normal single-image editing.

## Global constraints

- Modify only `src/components/editor/Canvas.tsx` and `src/components/editor/Canvas.test.tsx`.
- Reuse the existing wheel normalization, scale bounds, and editor-store setter.
- Batch wheel events over a loaded preview must prevent page scrolling and update `imageScale`.
- Wheel events outside the preview or with no loaded image remain unchanged.
- Preserve all unrelated working-tree changes.
- Do not add dependencies, commit, push, or create a PR.
- Follow SRP, high cohesion/low coupling, KISS, Fail Fast, YAGNI, and precise naming.

## Task 1: Enable wheel zoom in batch preview

1. RED: Replace the test that expects batch wheel events to be ignored with a test that expects the same zoom behavior as normal mode. Run the focused test and record the expected failure.
2. GREEN: Make the smallest production change so a loaded batch preview installs the existing non-passive wheel listener.
3. Verify the focused Canvas tests.
4. Do not change batch draft or Store code; existing draft capture already persists `imageScale` when switching items.

## Acceptance

- Wheel up over a selected batch image increases `imageScale`.
- Wheel down continues to use the same shared calculation and lower bound.
- The wheel event is prevented from scrolling the page while over the loaded preview.
- Normal single-image behavior remains green.
- Relevant tests, typecheck, lint, build, and a real browser batch-wheel path pass.
