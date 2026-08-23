# task_2be338ad6798 re-review

READ-ONLY defect-first re-review of the High-fix for overall/placement charge clips.

## Files read

- `src/lib/coat-of-arms/scene-svg.ts`
- `src/lib/coat-of-arms/scene-svg.test.ts`
- `src/lib/coat-of-arms/field-division-line.ts`
- `src/lib/coat-of-arms/field-division-line.test.ts`
- `src/lib/coat-of-arms/field-regions.ts`
- `src/lib/coat-of-arms/field.ts`
- `src/lib/coat-of-arms/field.test.ts`
- `src/lib/coat-of-arms/types.ts`
- `src/lib/coat-of-arms/commands.ts` (`assertCoatField`, `assertFieldDivisionLine`, `assertTransform`)
- `src/lib/coat-of-arms/commands.test.ts`
- `src/components/coat-of-arms/ShieldFieldPanel.tsx` (`addChargeToEscutcheon`, `updateFieldDivision`, Overall accordion)
- `src/components/coat-of-arms/ShieldFieldPanel.escutcheon.test.tsx`
- `src/components/coat-of-arms/ArrangePanel.tsx`
- `src/components/coat-of-arms/CoatOfArmsCanvas.tsx`
- `tmp/task_49e17027d67f-verification.md`

## Must-confirm

### 1. `fieldRegionId=overall` + `divisionLine` does not throw; clip is `M0 0H100V110H0Z`

Confirmed.

- `field-division-line.ts:42` returns `getFieldRegionPath('overall')` before the unsupported-pair switch.
- `scene-svg.ts:647-649` also short-circuits overall and never calls `fieldRegionDivisionLinePath`.
- `field-regions.ts:38` authors `overall: 'M0 0H100V110H0Z'`.
- Unit tests: `field-division-line.test.ts:28-31`, `scene-svg.test.ts:486-518`.
- Live jiti render of the exact Custom Overall transform (`fieldRegionId: 'overall'`, `fieldPlacement: 'overall'`, `clipToField: true`, `fieldShieldLayerId`, scale `0.6`): clipPath inner HTML is `<path d="M0 0H100V110H0Z"/>`; no throw.

### 2. `fieldPlacement=dexter` without `fieldRegionId` on per-pale wavy uses `fieldRegionDivisionLinePath`, not a 50×110 rect

Confirmed.

- `scene-svg.ts:641-643` only uses the region-id path when `fieldRegionId` is set.
- `scene-svg.ts:660-665` maps `fieldPlacement` onto `fieldRegionDivisionLinePath` when the placement is one of `getFieldRegionIds(division)` (`per-pale` → `dexter`/`sinister`).
- Unit test: `scene-svg.test.ts:520-553`.
- Live jiti: clip equals `<path d="${wavyDexterPath}"/>`; SVG does not contain `<rect x="0" y="0" width="50" height="110"/>`; `data-field-region` is absent.

### 3. Unknown style / bad frequency/amplitude throw with the actual value; unsupported pairs throw with division+regionId

Confirmed. Live messages:

- `Unknown field division line style: bogus`
- `Invalid field division line frequency: 0` / `NaN` / `31`
- `Invalid field division line amplitude: Infinity` / `21`
- `Unsupported field division line region dexter for division quarterly`
- `Unsupported field division line region q1 for division per-pale`

Tests: `field-division-line.test.ts:33-76`. Overall + bogus style does **not** throw (`field-division-line.ts:42`); that is the High-fix, not a remaining defect.

### 4. Custom Overall Add Charge (`fieldRegionId` overall) would render

Confirmed.

- `ShieldFieldPanel.tsx:997-1014` passes `fieldRegionId="overall"` into `EmbeddedChargesSection`.
- `addChargeToEscutcheon` (`ShieldFieldPanel.tsx:476-498`) writes `fieldRegionId`, `clipToField: true`, and `fieldPlacement: 'overall'`.
- UI test: `ShieldFieldPanel.escutcheon.test.tsx:205-223`.
- Live `renderCoatSceneSvg` of that transform succeeded with full-field clip `M0 0H100V110H0Z`.

## Remaining High/Medium defects

**No remaining High.** The original overall throw is gone; Custom Overall Add Charge renders.

### Medium — `src/lib/coat-of-arms/scene-svg.ts:647`

`getChargeFieldRegionClipPath` calls `fieldRegionDivisionLinePath(field.division, fieldRegionId, field.divisionLine)` whenever `fieldRegionId !== 'overall'` and a division line exists. It does **not** check `supportsFieldDivisionLine` or `getFieldRegionIds(field.division)`, unlike the placement path at `scene-svg.ts:660-665`.

Custom Dexter Add Charge persists `fieldRegionId: 'dexter'` (`ShieldFieldPanel.tsx:493`, test at `ShieldFieldPanel.escutcheon.test.tsx:449-459`). Switching Per Pale → Per Fess keeps `divisionLine` (`ShieldFieldPanel.tsx:231`, test at `ShieldFieldPanel.escutcheon.test.tsx:350-352`). `renderCoatSceneSvg` then throws `Unsupported field division line region dexter for division per-fess`. `CoatOfArmsCanvas.tsx:135-137` calls that in `useMemo` with no error boundary, so the canvas unmounts.

Placement-only `fieldPlacement: 'dexter'` on per-fess wavy does **not** throw; it falls back to `<rect x="0" y="0" width="50" height="110"/>`.

How verified: jiti script `/tmp/verify-charge-clips.mts` — `staleDexterOnPerFessRender: Unsupported field division line region dexter for division per-fess`; `placementMismatchClip=<rect x="0" y="0" width="50" height="110"/>`. The library throw itself matches must-confirm 3; the Medium is that a persistable Custom charge after a supported division switch hits it at scene render.

No other Medium found in the four named files.

## Verification commands

```
pnpm exec vitest run src/lib/coat-of-arms/scene-svg.test.ts src/lib/coat-of-arms/field-division-line.test.ts
```

```
 RUN  v4.1.5 /Users/wusir/Desktop/开发项目集合/token-maker-app

 ✓ src/lib/coat-of-arms/field-division-line.test.ts (9 tests) 3ms
 ✓ src/lib/coat-of-arms/scene-svg.test.ts (45 tests) 18ms

 Test Files  2 passed (2)
      Tests  54 passed (54)
   Start at  00:29:06
   Duration  333ms
```

Plus live jiti render of Custom Overall transform, legacy dexter placement, throw messages, and the Per Pale→Per Fess stale-region crash path.
