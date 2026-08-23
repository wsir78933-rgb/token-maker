# T3 last-shield delete verification

## Code

- `useCoatKeyboardShortcuts.ts`: `canRemoveSelectedLayers` now only requires a remaining background. Last shield is no longer blocked in the UI. Last background still skipped (engine still rejects).
- `CanvasSelectionToolbar.tsx` / `LayerPanel.tsx`: no production intercept found; both already `run({ type: 'remove-layers' | 'remove-layer' })` and surface engine failures via `usePanelCommandError`.
- Tests updated to allow last-shield delete and keep last-background Fail Fast.

## vitest

Command:

```
pnpm exec vitest run src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx src/components/coat-of-arms/LayerPanel.test.tsx src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx src/components/coat-of-arms/CanvasSelectionToolbar.tsx
```

Output:

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/components/coat-of-arms/useCoatKeyboardShortcuts.test.tsx (11 tests) 94ms
 ✓ src/components/coat-of-arms/LayerPanel.test.tsx (5 tests) 170ms
 ✓ src/components/coat-of-arms/CanvasSelectionToolbar.test.tsx (10 tests) 215ms

 Test Files  3 passed (3)
      Tests  26 passed (26)
   Start at  12:23:45
   Duration  1.39s (transform 504ms, setup 0ms, import 994ms, tests 478ms, environment 1.79s)
```

`CanvasSelectionToolbar.tsx` has no in-file tests; the existing `CanvasSelectionToolbar.test.tsx` was run.

## typecheck

```
> token-maker-app@0.1.0 typecheck /Users/wusir/Desktop/开发项目集合/token-maker-app
> tsc --noEmit
```

exit 0

## Browser (localhost:3000/coat-of-arms-maker, Discard draft)

- Layer-row Delete on last Heater shield: shield gone, no alert; Custom shows existing `No shield layer.`
- Delete Ivory: still present; alert `Editor action failed: Cannot remove the sole base background layer: …`
- Toolbar trash on last shield after Reset editor: shield gone, no alert
- Delete key on last shield after Reset editor: shield gone, no alert

T1 engine change was already in this workspace (`assertBaseLayerCanBeRemoved` / `assertRequiredBaseLayers` allow 0 shields).
