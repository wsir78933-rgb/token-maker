# Replace Charges tree last item Ordinaries with working Upload

Read-only map. Do not commit. Do not change `src/` in this task.

Date: 2026-08-22  
Repo: `/Users/wusir/Desktop/开发项目集合/token-maker-app`

## Verdict

Desktop (and mobile) Charges tree currently ends with **Ordinaries**, which flips `selectedChargeKind` to `'ordinary'` and renders `ChargeAndOrdinaryPanel` ordinary catalogue in the library column.

Working local-image upload already exists as `UploadPanel`. It is mounted only in the stacked `CoatOfArmsPanels` toolbox (test harness), **not** in `CoatOfArmsMaker` library column. Tools tree is `text / draw / random / names` only.

Replace the last Charges child `ordinaries` with `upload`. When that child is selected, render existing `UploadPanel` in the Charges library column. Keep animal/object/plant/human/symbol galleries. Keep ordinary assets on disk and keep `ChargeAndOrdinaryPanel` ordinary mode for `CoatOfArmsPanels`. Do not add Upload under Tools.

---

## Re-confirmed current wiring (file:line)

### Charges tree last item is Ordinaries

`src/components/coat-of-arms/CoatOfArmsMaker.tsx`

- `68` — `chargeAssetCategories = ['animal', 'object', 'plant', 'human', 'symbol']`
- `69` — `utilityToolOrder = ['text', 'draw', 'random', 'names']` (no upload)
- `113` — `selectedChargeKind` typed `Extract<GeometryCoatAssetKind, 'charge' | 'ordinary'>`, default `'charge'`
- `112` — `selectedChargeCategory` default `'animal'`
- `130` — Charges library content is **always** `<ChargeAndOrdinaryPanel … selectedKind={selectedChargeKind} />`
- `151-154` — `toolTreeBranches.charges` = five category children + `{ id: 'ordinaries', label: copy.panels.ordinaries }` (`'Ordinaries'` / `'饰带'`)
- `162` — Tools tree = `utilityToolOrder` mapped through `copy.utilityTabs` (Text/Draw/Random/Names)
- `259-266` — handler: `childId === 'ordinaries'` → `setSelectedChargeKind('ordinary')`; else require `isChargeAssetCategory` and set kind `'charge'`
- `316` and `353` — `selectedToolChildren.charges = selectedChargeKind === 'ordinary' ? 'ordinaries' : selectedChargeCategory`
- **No `UploadPanel` import** in this file

`selectedChargeKind` cannot become `'upload'`. It is a geometry asset kind, not a tree-child id.

### Test lock (must invert, but not in-place)

`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx:184`

```ts
expect(within(getDesktopToolRail()).queryByRole('button', { name: 'Upload' })).toBeNull();
```

Context: test `keeps every core tool category reachable from the desktop workbench` (`164-190`). Before this line it expands **Colors** then **Tools** (`selectEditorUtility('Text')`) and asserts Tools children Text/Draw/Random/Names. **Charges is still collapsed.** Tree children only render when the parent is expanded (`ReferenceToolRail.tsx:115-117`).

Tree child accessible name is `child.label` on a `role="button"` (`ReferenceToolRail.tsx:117`). Testing Library `name: 'Upload'` is an **exact** match. Existing copy `panels.uploadImage` is `'Upload image'` and would **not** satisfy this query.

**Landmine:** inverting line 184 in place, without expanding Charges first, stays `null` and the test fails even after the tree child exists.

### Working upload already exists

`src/components/coat-of-arms/UploadPanel.tsx`

- `26-40` — `validateLocalUploadFile` (name, MIME, size vs `COAT_PROJECT_LIMITS.maxLocalUploadBytes`)
- `108-115` — `createValidatedLocalUpload` (read + Base64 + decode check)
- `118-181` — `UploadPanel`
  - file input `aria-label={copy.uploadCrestImage}` (`'Upload crest image'` / `'上传徽章图片'`), `multiple`
  - command `add-local-upload-images` (`131`) — also adds one image layer per file (`commands.ts:920-944`)
  - reuse command `add-image-layer` (`139`)
  - remove command `remove-local-upload` (`145`)
  - region/heading `copy.uploadImage` = `'Upload image'` (not `'Upload'`)

`src/components/coat-of-arms/CoatOfArmsPanels.tsx:31` — stacked toolbox renders `<UploadPanel locale={locale} />` after Settings. This file is **not** used by `CoatOfArmsMaker` (only imported by `CoatOfArmsPanels.test.tsx`). Desktop Charges library never shows it today.

`src/components/coat-of-arms/ShieldFieldPanel.tsx:12` — reuses `createValidatedLocalUpload` for custom shield masks. Unrelated to Charges tree. Do not conflate with crest Upload.

### Ordinary catalogue must stay

- `ChargeAndOrdinaryPanel.tsx:55, 68, 98, 126` — `selectedKind === 'ordinary'` still renders `AssetLibraryPanel` + search + random
- `ChargeAndOrdinaryPanel.test.tsx:49-71` — Gusset WebP ordinary card
- `CoatOfArmsPanels.test.tsx:180-193` — stacked toolbox ordinary search (`Library category` → `ordinary`)
- `webp-material-catalog.ts:250-259` — `createOrdinaryMaterials` / folder `ordinaries`
- `assets.test.ts:80` — `listAssetsByKind('ordinary')` length 27

`CoatOfArmsMaker` is the only production caller that passes `selectedKind="ordinary"` (via tree). After this swap, Maker should pass `'charge'` only. Leave the ordinary prop path in `ChargeAndOrdinaryPanel` for `CoatOfArmsPanels`.

### Tools is not the upload home

- `CoatOfArmsMaker.tsx:39, 69, 162, 370-375, 405-407`
- `workbench-copy.ts:195, 683, 770` — `utilityTabs` keys `text | draw | random | names | layers` (layers is unused copy, not a Tools child)
- Test `opens the matching Tools panel from the left tree` (`CoatOfArmsMaker.test.tsx:223-232`) clicks Draw/Random only

Do not append Upload to `utilityToolOrder`.

---

## Recommended wiring

### 1. Tree child

In `toolTreeBranches.charges`, replace the last item:

```ts
// today
{ id: 'ordinaries', label: copy.panels.ordinaries }

// recommended
{ id: 'upload', label: copy.panels.chargesTreeUpload }
```

Add copy (do **not** reuse `uploadImage`):

| locale | `panels.chargesTreeUpload` | why |
|---|---|---|
| en | `'Upload'` | exact match for the inverted rail query |
| zh | `'上传'` | short tree label; panel heading stays `'上传图片'` |

Keep the five gallery children in this order: Animals, Objects, Plants, Humans, Symbols, then Upload.

### 2. Selection state (Maker only)

Replace `selectedChargeKind` (`'charge' | 'ordinary'`) with one tree-child id:

```ts
type ChargesTreeChildId = ChargeAssetCategory | 'upload';
const [selectedChargesTreeChild, setSelectedChargesTreeChild] = useState<ChargesTreeChildId>('animal');
```

Default `'animal'` keeps:

- `CoatOfArmsMaker.test.tsx:1362-1363` (`selectDesktopTool('Charges')` then `'Add random charges'`)
- `uses the Charges tree branch as the sole charge category control` (`507-517`) clicking Objects

`selectedToolChildren.charges` becomes `selectedChargesTreeChild` on both desktop rail (`316`) and mobile drawer (`353`). Drop the `=== 'ordinary' ? 'ordinaries' : …` ternary.

### 3. Handler

In `selectToolTreeChild`, replace the ordinaries branch (`259-266`):

```ts
if (toolId === 'charges') {
  if (childId === 'upload') {
    setSelectedChargesTreeChild('upload');
  } else {
    if (!isChargeAssetCategory(childId)) {
      throw new Error(`Invalid tool tree charge category: ${childId}`);
    }
    setSelectedChargesTreeChild(childId);
  }
}
```

Fail fast on unknown ids. Do not fall through.

### 4. Library column content

`toolsById.charges.content` (line 130) — swap, do not compose both:

```ts
content: selectedChargesTreeChild === 'upload'
  ? <UploadPanel locale={locale} />
  : <ChargeAndOrdinaryPanel
      locale={locale}
      selectedChargeCategory={selectedChargesTreeChild}
      selectedKind="charge"
    />
```

Import `UploadPanel` from `./UploadPanel`.

Effects:

- animal/object/plant/human/symbol → existing charge galleries (`ReferenceAssetGallery`), in-panel category selects stay hidden (`isControlledByToolTree`)
- upload → existing file input + local upload list + `add-local-upload-images` / `add-image-layer`
- Charges tabpanel name stays `copy.toolTabs.charges` (`'Charges'`). Inner region is `'Upload image'`
- `mobileTools` is derived from the same `tools` array (`164`), so mobile drawer gets the same swap with no `CoatOfArmsMobileDrawer.tsx` edit

### 5. Do not change these

| file | why |
|---|---|
| `UploadPanel.tsx` | already the working upload UI + validation |
| `CoatOfArmsPanels.tsx` | stacked toolbox still mounts UploadPanel + uncontrolled ChargeAndOrdinaryPanel |
| `ChargeAndOrdinaryPanel.tsx` | keep `selectedKind="ordinary"` for CoatOfArmsPanels |
| `commands.ts` | `add-local-upload-images` / `add-image-layer` already work |
| `webp-material-catalog.ts` and `/public/coat-assets/materials/ordinaries/` | ordinary catalogue stays on disk |
| `utilityToolOrder` / `getUtilityContent` / `isUtilityToolId` | Upload is not a Tools child |
| `ReferenceToolRail.tsx` | already renders any `treeBranches` child as a button |
| `CoatOfArmsMobileDrawer.tsx` | already forwards `treeBranches` + `selectedToolChildren` + `tabs[].content` |
| Custom shield upload in `ShieldFieldPanel.tsx` | different control (`Upload custom shield mask`) |

---

## Files to edit (implementer)

1. **`src/components/coat-of-arms/CoatOfArmsMaker.tsx`**
   - import `UploadPanel`
   - drop `selectedChargeKind` / `selectedChargeCategory` (or keep category only if you insist; one union state is enough)
   - last charges tree child `upload`
   - handler `childId === 'upload'`
   - conditional library content
   - `selectedToolChildren.charges`

2. **`src/components/coat-of-arms/workbench-copy.ts`**
   - type + EN/ZH `panels.chargesTreeUpload`
   - do not change `uploadImage` / `uploadCrestImage` / `ordinaries`

3. **`src/components/coat-of-arms/CoatOfArmsMaker.test.tsx`**
   - invert the lock (see below)
   - add Charges → Upload panel assertion
   - assert Ordinaries is gone from the rail
   - keep Tools without Upload

No other production files required.

---

## Tests to update

### Must change

**`CoatOfArmsMaker.test.tsx:184` lock**

Do not invert in place under the Tools expansion. Expand Charges first, then expect the button.

Recommended shape inside `keeps every core tool category reachable from the desktop workbench`:

```ts
// Tools still has no Upload (after selectEditorUtility('Text'))
expect(getDesktopToolTreeItem('Text')).toBeDefined();
expect(getDesktopToolTreeItem('Draw')).toBeDefined();
expect(getDesktopToolTreeItem('Random')).toBeDefined();
expect(getDesktopToolTreeItem('Names')).toBeDefined();

fireEvent.click(getDesktopTool(/charges/i));
expect(getDesktopToolTreeItem('Animals')).toBeDefined();
expect(getDesktopToolTreeItem('Objects')).toBeDefined();
expect(getDesktopToolTreeItem('Plants')).toBeDefined();
expect(getDesktopToolTreeItem('Humans')).toBeDefined();
expect(getDesktopToolTreeItem('Symbols')).toBeDefined();
expect(getDesktopToolTreeItem('Upload')).toBeDefined(); // inverted lock
expect(within(getDesktopToolRail()).queryByRole('button', { name: 'Ordinaries' })).toBeNull();
```

`getDesktopToolTreeItem` (`69-71`) is `within(getDesktopToolRail()).getByRole('button', { name: label })` — same scope as the lock.

### Should add (same file)

New (or extend `uses the Charges tree branch as the sole charge category control` at `507-517`):

1. Click Charges → Upload.
2. `within(getDesktopPanel('Charges')).getByRole('region', { name: 'Upload image' })`
3. `within(getDesktopPanel('Charges')).getByLabelText('Upload crest image')`
4. Charge gallery gone: `queryByRole('button', { name: 'Add charge: Castle Tower' })` is null while Upload is selected.
5. Click Objects: Castle Tower card returns; Upload image region is null.
6. `getDesktopToolTreeItem('Upload').getAttribute('aria-pressed') === 'true'` while selected.

Optional file-input smoke (mirrors `CoatOfArmsPanels.test.tsx:557-566`): change the crest input with a stubbed `createImageBitmap` PNG and expect `project.layers.at(-1).type === 'image'`. Not required if you only prove the existing panel is mounted; `CoatOfArmsPanels.test.tsx` already covers UploadPanel commands.

### Mobile

`reuses the desktop tool tree for mobile shield browsing and charge category selection` (`1088-1102`) already clicks Charges → Objects. After the swap, the same rail should expose `button` named `Upload` and must not expose `Ordinaries`. Same `treeBranches` object.

### Do not invert / do not rewrite

| test | why |
|---|---|
| `CoatOfArmsPanels.test.tsx` upload + ordinary cases (`157-193`, `513-660`) | stacked toolbox still has both panels |
| `ChargeAndOrdinaryPanel.test.tsx` Gusset ordinary (`49-71`) | keep ordinary catalogue API |
| `assets.test.ts` ordinary count | assets stay |
| Tools tests (`223-232`, `1313-1321`) | still Text/Draw/Random/Names |
| Custom shield tests (`CoatOfArmsMaker.test.tsx:613-614`) | different Upload string, not the rail |
| `CoatOfArmsMaker.ssr.test.tsx` | no Ordinaries/Upload assertions |

`CoatOfArmsMaker` currently has **no** test that clicks `Ordinaries` by name. Removing that child will not fail an existing positive assertion.

---

## Suggested implementer snippet (Maker content + tree)

```ts
charges: [
  ...chargeAssetCategories.map((category) => ({
    id: category,
    label: copy.panels.chargeCategories[category],
  })),
  { id: 'upload', label: copy.panels.chargesTreeUpload },
],
```

```ts
charges: {
  id: 'charges',
  content: selectedChargesTreeChild === 'upload'
    ? <UploadPanel locale={locale} />
    : <ChargeAndOrdinaryPanel
        locale={locale}
        selectedChargeCategory={selectedChargesTreeChild}
        selectedKind="charge"
      />,
},
```

---

## Verify after implementation (not this task)

```bash
npx vitest run src/components/coat-of-arms/CoatOfArmsMaker.test.tsx \
  src/components/coat-of-arms/ChargeAndOrdinaryPanel.test.tsx \
  src/components/coat-of-arms/CoatOfArmsPanels.test.tsx
```

Browser (ego-browser, `http://localhost:3000/coat-of-arms-maker` only): Charges → last child is Upload, not Ordinaries; click it; library shows crest file input; Animals/Objects galleries still add charges; Tools tree still Text/Draw/Random/Names.

---

## Out of scope / leftovers

- Ordinary gallery is no longer reachable from the **desktop/mobile Charges tree**. It remains reachable from `CoatOfArmsPanels` (test-only stacked toolbox) and from disk/catalogue tests. If product later wants Ordinaries again, it needs a new home; do not sneak it under Tools or delete assets.
- No CSS change required; tree child is the same `coat-target-tool-tree-branch button` as Animals/Ordinaries.
- No command or store change required.
- This mapping task did not edit `src/`.
