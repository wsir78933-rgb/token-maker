'use client';

import { useState, type ChangeEvent } from 'react';
import { ChevronDown, Pencil, Plus } from 'lucide-react';
import { listShieldSilhouetteAssets, NEWLY_PLACED_LIBRARY_ASSET_SCALE, requireShieldSilhouetteAssetId } from '@/lib/coat-of-arms/assets';
import { buildFieldInteriorMarkup } from '@/lib/coat-of-arms/field';
import { getFieldRegionIds, resolveFieldRegions } from '@/lib/coat-of-arms/field-regions';
import type { CoatProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore, type CoatProjectDispatchResult } from '@/lib/coat-of-arms/store';
import type { CoatField, CoatLayer, CoatLocale, FieldDivision, FieldPattern, FieldRegionId, FieldRegionStyle, ShieldLayer } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { createValidatedLocalUpload } from './UploadPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

const selectedEscutcheonFill = '#bb212c';
const idleEscutcheonFill = '#5b5347';
const fallbackFieldAccentColor = '#B11F24';
const defaultShieldOutline = { visible: true, color: '#1E293B', width: 1.5 } as const;
const defaultCustomLineWidth = 9;
const embeddedChargeAssetId = 'material-animal-wolf-rampant';

const customFieldDivisionChoices: readonly { value: FieldDivision; labelKey: string }[] = [
  { value: 'solid', labelKey: 'solid' },
  { value: 'per-pale', labelKey: 'per-pale' },
  { value: 'per-fess', labelKey: 'per-fess' },
  { value: 'per-bend', labelKey: 'per-bend' },
  { value: 'per-chevron', labelKey: 'per-chevron' },
  { value: 'quarterly', labelKey: 'quarterly' },
  { value: 'per-saltire', labelKey: 'per-saltire' },
];

const customFieldVariationChoices: readonly FieldPattern[] = [
  'solid', 'barry', 'paly', 'bendy', 'masoned', 'checks', 'lozengy', 'chevronelly',
  'vair', 'vair-in-pointe', 'vair-in-pale', 'paly-bendy', 'barry-bendy', 'gyronny',
  'papelonny', 'honeycomb', 'seme',
];

function listShieldLayers(layers: CoatLayer[]): ShieldLayer[] {
  return layers.filter((layer): layer is ShieldLayer => layer.type === 'shield');
}

function resolveEditedShield(layers: CoatLayer[], selectedLayerIds: string[]): { shield: ShieldLayer; ordinal: number } | undefined {
  const shieldLayers = listShieldLayers(layers);
  if (shieldLayers.length === 0) return undefined;
  let editedShield = shieldLayers[0];
  for (const layerId of selectedLayerIds) {
    const selectedShield = shieldLayers.find((layer) => layer.id === layerId);
    if (selectedShield) {
      editedShield = selectedShield;
      break;
    }
  }
  if (!editedShield) {
    throw new Error(`Unable to resolve an edited shield from selected layer ids: ${selectedLayerIds.join(',') || '(none)'}`);
  }
  const ordinal = shieldLayers.findIndex((layer) => layer.id === editedShield.id) + 1;
  if (ordinal < 1) throw new Error(`Edited shield is not in the project: ${editedShield.id}`);
  return { shield: editedShield, ordinal };
}

function addNewEscutcheon(
  runWithResult: (command: CoatProjectCommand) => CoatProjectDispatchResult | null,
  setSelectedLayerIds: (layerIds: string[]) => void,
): void {
  const result = runWithResult({ type: 'add-layer', assetId: 'heater-shield' });
  if (!result) return;
  if (!result.createdLayerId) throw new Error('No new escutcheon layer was added for assetId: heater-shield');
  setSelectedLayerIds([result.createdLayerId]);
}

function pickEscutcheonShape(
  assetId: string,
  editedShield: ShieldLayer,
  run: (command: CoatProjectCommand) => boolean,
): void {
  const silhouetteAssetId = requireShieldSilhouetteAssetId(assetId);
  if (editedShield.customOutlinePath && !run({ type: 'set-custom-shield-outline', layerId: editedShield.id })) return;
  if (editedShield.customMaskUploadId && !run({ type: 'set-custom-shield-mask', layerId: editedShield.id })) return;
  run({ type: 'update-layer', layerId: editedShield.id, patch: { assetId: silhouetteAssetId } });
}

function requireCustomFieldDivision(value: unknown): FieldDivision {
  if (!customFieldDivisionChoices.some((choice) => choice.value === value)) {
    throw new Error(`Invalid Custom field division selection: ${String(value)}`);
  }
  return value as FieldDivision;
}

function requireCustomFieldVariation(value: unknown): FieldPattern {
  if (!customFieldVariationChoices.includes(value as FieldPattern)) {
    throw new Error(`Invalid Custom field variation selection: ${String(value)}`);
  }
  return value as FieldPattern;
}

function requireFieldTarget(value: unknown, division: FieldDivision): FieldRegionId {
  const validTargets = listFieldTargets(division);
  if (!validTargets.includes(value as FieldRegionId)) {
    throw new Error(`Invalid Custom field target selection for ${division}: ${String(value)}`);
  }
  return value as FieldRegionId;
}

function listFieldTargets(division: FieldDivision): FieldRegionId[] {
  const regionIds = getFieldRegionIds(division).filter((regionId) => regionId !== 'overall');
  return ['overall', ...regionIds];
}

function requireColour(value: unknown, label: string): string {
  if (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
  return value;
}

function normalizeFieldColors(colors: readonly string[], division: FieldDivision, pattern: FieldPattern): string[] {
  const primaryColor = colors[0];
  if (!primaryColor) throw new Error(`Custom field has no primary color for ${division}/${pattern}`);
  const secondaryColor = colors[1] ?? fallbackFieldAccentColor;
  return division === 'solid' && pattern === 'solid' ? [primaryColor] : [primaryColor, secondaryColor];
}

function normalizeRegionColors(colors: readonly string[], pattern: FieldPattern): string[] {
  const primaryColor = colors[0];
  if (!primaryColor) throw new Error(`Custom field region has no primary color for ${pattern}`);
  return pattern === 'solid' ? [primaryColor] : [primaryColor, colors[1] ?? fallbackFieldAccentColor];
}

function updateFieldDivision(
  shield: ShieldLayer,
  value: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const division = requireCustomFieldDivision(value);
  const field: CoatField = {
    ...shield.field,
    division,
    colors: normalizeFieldColors(shield.field.colors, division, shield.field.pattern),
  };
  delete field.regions;
  delete field.divisionLine;
  return run({ type: 'set-field', layerId: shield.id, field });
}

function updateFieldVariation(
  shield: ShieldLayer,
  target: FieldRegionId,
  value: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const pattern = requireCustomFieldVariation(value);
  const validTarget = requireFieldTarget(target, shield.field.division);
  if (validTarget === 'overall') {
    const field: CoatField = {
      ...shield.field,
      pattern,
      colors: normalizeFieldColors(shield.field.colors, shield.field.division, pattern),
    };
    delete field.regions;
    return run({ type: 'set-field', layerId: shield.id, field });
  }

  const resolvedRegions = resolveFieldRegions(shield.field);
  const selectedRegion = resolvedRegions.find((region) => region.id === validTarget);
  if (!selectedRegion) throw new Error(`Custom field target is not available for ${shield.field.division}: ${validTarget}`);
  const nextRegions: Partial<Record<FieldRegionId, FieldRegionStyle>> = { ...shield.field.regions };
  const selectedStyleWithoutConfig = { ...selectedRegion.style };
  delete selectedStyleWithoutConfig.patternConfig;
  nextRegions[validTarget] = {
    ...selectedStyleWithoutConfig,
    pattern,
    colors: normalizeRegionColors(selectedRegion.style.colors, pattern),
  };
  return run({ type: 'set-field', layerId: shield.id, field: { ...shield.field, regions: nextRegions } });
}

function listEditedShieldColours(shield: ShieldLayer): string[] {
  const sourceColours = [
    ...shield.field.colors,
    ...Object.values(shield.field.regions ?? {}).flatMap((region) => region?.colors ?? []),
    ...(shield.field.ornaments ?? []).flatMap((ornament) => ornament.colors ?? [ornament.color]),
  ];
  const seenColours = new Set<string>();
  return sourceColours.filter((colour) => {
    const canonicalColour = colour.toUpperCase();
    if (seenColours.has(canonicalColour)) return false;
    seenColours.add(canonicalColour);
    return true;
  });
}

function updateShieldOutline(
  shield: ShieldLayer,
  patch: Partial<{ visible: boolean; width: number }>,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const outline = { ...getEffectiveShieldOutline(shield), ...patch };
  return run({ type: 'set-field', layerId: shield.id, field: { ...shield.field, outline } });
}

function getEffectiveShieldOutline(shield: ShieldLayer): { visible: boolean; color: string; width: number } {
  return {
    ...defaultShieldOutline,
    ...shield.field.outline,
    ...(shield.field.outline === undefined ? { width: defaultCustomLineWidth } : {}),
  };
}

function requireLineWidth(value: unknown): number {
  const lineWidth = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(lineWidth) || lineWidth < 0 || lineWidth > 25) {
    throw new Error(`Invalid Custom shield line width (expected 0-25): ${String(value)}`);
  }
  return lineWidth;
}

function addChargeToEscutcheon(
  shield: ShieldLayer,
  runWithResult: (command: CoatProjectCommand) => CoatProjectDispatchResult | null,
  setSelectedLayerIds: (layerIds: string[]) => void,
): void {
  const result = runWithResult({ type: 'add-layer', assetId: embeddedChargeAssetId });
  if (!result) return;
  if (!result.createdLayerId) {
    throw new Error(`Unable to add Custom charge for escutcheon ${shield.id}: ${embeddedChargeAssetId}`);
  }
  const scopedTransform = {
    x: 0,
    y: 0,
    scale: NEWLY_PLACED_LIBRARY_ASSET_SCALE,
    rotation: 0,
    fieldShieldLayerId: shield.id,
    fieldPlacement: 'overall' as const,
    fieldRegionId: 'overall' as const,
    clipToField: true,
  };
  if (!runWithResult({ type: 'update-layer', layerId: result.createdLayerId, patch: { transform: scopedTransform } })) return;
  setSelectedLayerIds([shield.id]);
}

function FieldPreview({ division, pattern, previewId }: { division: FieldDivision; pattern: FieldPattern; previewId: string }) {
  const previewField: CoatField = { division, colors: ['#A0822B', '#98343A'], pattern };
  return <svg aria-hidden="true" viewBox="0 0 100 110" dangerouslySetInnerHTML={{ __html: buildFieldInteriorMarkup(previewField, previewId) }} />;
}

function EscutcheonShapeThumbGrid({
  locale,
  editedShield,
  selectEscutcheonShape,
  onPickShape,
}: {
  locale: CoatLocale;
  editedShield: ShieldLayer;
  selectEscutcheonShape: (name: string) => string;
  onPickShape: (assetId: string) => void;
}) {
  return (
    <div aria-label="Escutcheon shapes" className="coat-escutcheon-grid" role="group">
      {listShieldSilhouetteAssets().map((asset) => {
        const localizedName = asset.name[locale];
        if (typeof localizedName !== 'string' || localizedName.length === 0) throw new Error(`Missing escutcheon name for locale ${locale}: ${asset.id}`);
        const isPressed = editedShield.assetId === asset.id
          && editedShield.customOutlinePath === undefined
          && editedShield.customMaskUploadId === undefined;
        return (
          <button
            key={asset.id}
            aria-label={selectEscutcheonShape(localizedName)}
            aria-pressed={isPressed}
            className={`coat-escutcheon-option${isPressed ? ' is-selected' : ''}`}
            data-selected={isPressed}
            type="button"
            onClick={() => onPickShape(asset.id)}
          >
            <svg aria-hidden="true" viewBox="0 0 100 110"><path d={asset.svgPath} fill={isPressed ? selectedEscutcheonFill : idleEscutcheonFill} /></svg>
          </button>
        );
      })}
    </div>
  );
}

function EditingEscutcheonCard({ editingEscutcheon, editingEscutcheonName, editingLabel }: { editingEscutcheon: string; editingEscutcheonName: string; editingLabel: string }) {
  return (
    <div aria-label={editingEscutcheon} className="coat-escutcheon-editing-card">
      <Pencil aria-hidden="true" className="h-4 w-4 shrink-0 text-[color:var(--coat-text)]" />
      <div className="min-w-0 leading-tight"><div className="text-xs text-[color:var(--coat-muted)]">{editingLabel}</div><div className="text-sm font-medium text-[color:var(--coat-text)]">{editingEscutcheonName}</div></div>
    </div>
  );
}

function CustomShieldUploads({ actionLabel, heading, hint, uploadLabel, uploadStatus, onFileChange }: { actionLabel: string; heading: string; hint: string; uploadLabel: string; uploadStatus: string | null; onFileChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="coat-custom-shield-uploads">
      <h3 className="text-sm font-medium text-[color:var(--coat-text)]">{heading}</h3>
      <p className="text-xs text-[color:var(--coat-muted)]">{hint}</p>
      <label className="coat-custom-shield-upload-control"><span>{actionLabel}</span><input accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" aria-label={uploadLabel} className="coat-custom-shield-upload-input" type="file" onChange={onFileChange} /></label>
      {uploadStatus ? <p role="status">{uploadStatus}</p> : null}
    </div>
  );
}

function getCustomFieldLabel(labels: Record<string, string>, key: string, kind: string): string {
  const label = labels[key];
  if (!label) throw new Error(`Missing Custom field ${kind} label: ${key}`);
  return label;
}

function getEffectiveFieldTarget(division: FieldDivision, selectedTarget: FieldRegionId): FieldRegionId {
  return listFieldTargets(division).includes(selectedTarget) ? selectedTarget : 'overall';
}

function CustomFieldControls({
  copy,
  shield,
  selectedTarget,
  onTargetChange,
  onDivisionChange,
  onVariationChange,
}: {
  copy: ReturnType<typeof getCoatWorkbenchCopy>['panels'];
  shield: ShieldLayer;
  selectedTarget: FieldRegionId;
  onTargetChange: (target: FieldRegionId) => void;
  onDivisionChange: (division: FieldDivision) => void;
  onVariationChange: (pattern: FieldPattern) => void;
}) {
  const activeTarget = getEffectiveFieldTarget(shield.field.division, selectedTarget);
  const activePattern = activeTarget === 'overall'
    ? shield.field.pattern
    : resolveFieldRegions(shield.field).find((region) => region.id === activeTarget)?.style.pattern ?? shield.field.pattern;
  return (
    <>
      <section aria-label={copy.divisionOfField} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
        <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.divisionOfField}</h3>
        <label className="mb-3 flex items-center justify-between gap-2 text-sm text-[color:var(--coat-muted)]">
          <span className="sr-only">{copy.overallFieldTarget}</span>
          <select aria-label={copy.overallFieldTarget} className="min-h-8 min-w-0 flex-1 px-2 text-sm" value={activeTarget} onChange={(event) => onTargetChange(requireFieldTarget(event.target.value, shield.field.division))}>
            {listFieldTargets(shield.field.division).map((target) => <option key={target} value={target}>{target === 'overall' ? copy.overallFieldTarget : copy.fieldRegionNames[target]}</option>)}
          </select>
        </label>
        <div aria-label={copy.divisionOfField} className="grid grid-cols-4 gap-2" role="group">
          {customFieldDivisionChoices.map((choice) => {
            const label = getCustomFieldLabel(copy.customFieldDivisionNames, choice.labelKey, 'division');
            return <button key={choice.value} aria-label={label} aria-pressed={shield.field.division === choice.value} className="grid aspect-square min-w-0 place-items-center rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-1 aria-pressed:border-[color:var(--coat-accent)]" title={copy.fieldDivisionChoice(label)} type="button" onClick={() => onDivisionChange(choice.value)}><FieldPreview division={choice.value} pattern="solid" previewId={`custom-division-${choice.value}`} /></button>;
          })}
        </div>
      </section>
      <section aria-label={copy.variationOfField} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
        <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.variationOfField}</h3>
        <div aria-label={copy.variationOfField} className="grid grid-cols-4 gap-2" role="group">
          {customFieldVariationChoices.map((pattern) => {
            const label = getCustomFieldLabel(copy.customFieldVariationNames, pattern, 'variation');
            return <button key={pattern} aria-label={label} aria-pressed={activePattern === pattern} className="grid aspect-square min-w-0 place-items-center rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-1 aria-pressed:border-[color:var(--coat-accent)]" title={copy.fieldVariationChoice(label)} type="button" onClick={() => onVariationChange(pattern)}><FieldPreview division={shield.field.division} pattern={pattern} previewId={`custom-variation-${pattern}`} /></button>;
          })}
        </div>
      </section>
    </>
  );
}

function EmbeddedColoursSection({ copy, shield, run, reportError }: { copy: ReturnType<typeof getCoatWorkbenchCopy>['panels']; shield: ShieldLayer; run: (command: CoatProjectCommand) => boolean; reportError: (error: unknown) => void }) {
  const colours = listEditedShieldColours(shield);
  return (
    <section aria-label={copy.embeddedColors} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.embeddedColors}</h3>
      <div className="flex flex-wrap gap-2">
        {colours.map((colour) => <label key={colour.toUpperCase()} className="inline-flex h-10 w-10 overflow-hidden rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-0.5" style={{ backgroundColor: colour }}>
          <input aria-label={copy.embeddedColorSwatch(colour)} className="h-full w-full cursor-pointer border-0 p-0" type="color" value={colour.toLowerCase()} onChange={(event) => {
            try {
              const nextColour = requireColour(event.target.value, 'Custom escutcheon color');
              if (nextColour.toUpperCase() !== colour.toUpperCase()) run({ type: 'replace-layer-colour', layerId: shield.id, fromColor: colour, toColor: nextColour });
            } catch (caught) { reportError(caught); }
          }} />
        </label>)}
      </div>
    </section>
  );
}

function EmbeddedChargesSection({ copy, shield, runWithResult, setSelectedLayerIds, reportError }: { copy: ReturnType<typeof getCoatWorkbenchCopy>['panels']; shield: ShieldLayer; runWithResult: (command: CoatProjectCommand) => CoatProjectDispatchResult | null; setSelectedLayerIds: (layerIds: string[]) => void; reportError: (error: unknown) => void }) {
  return (
    <section aria-label={copy.embeddedCharges} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.embeddedCharges}</h3>
      <button className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-[#bb212c] px-3 text-sm font-medium text-white" type="button" onClick={() => { try { addChargeToEscutcheon(shield, runWithResult, setSelectedLayerIds); } catch (caught) { reportError(caught); } }}><Plus aria-hidden="true" className="h-4 w-4" />{copy.addChargeToEscutcheon}</button>
    </section>
  );
}

function ShieldSettingsSection({ copy, shield, run, reportError }: { copy: ReturnType<typeof getCoatWorkbenchCopy>['panels']; shield: ShieldLayer; run: (command: CoatProjectCommand) => boolean; reportError: (error: unknown) => void }) {
  const outline = getEffectiveShieldOutline(shield);
  const applyLineWidth = (rawValue: string) => {
    try { updateShieldOutline(shield, { width: requireLineWidth(rawValue) }, run); } catch (caught) { reportError(caught); }
  };
  return (
    <section aria-label={copy.settings} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.settings}</h3>
      <label className="grid gap-1 text-sm text-[color:var(--coat-muted)]"><span>{copy.lineWidth}</span><input aria-label={copy.lineWidth} className="w-full accent-[#bb212c]" type="range" min="0" max="25" step="1" value={outline.width} onChange={(event) => applyLineWidth(event.target.value)} /><span className="text-center text-sm text-[color:var(--coat-text)]">{copy.lineWidthValue(outline.width)}</span></label>
      <label className="mt-3 flex items-center gap-2 text-sm text-[color:var(--coat-muted)]"><input aria-label={copy.showBorder} type="checkbox" checked={outline.visible} onChange={(event) => { try { updateShieldOutline(shield, { visible: event.target.checked }, run); } catch (caught) { reportError(caught); } }} />{copy.showBorder}</label>
    </section>
  );
}

/** Changes the edited shield only through validated project commands. */
export function ShieldFieldPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const addNewEscutcheonLabel = copy.addNewEscutcheon.replace(/^\+\s*/, '');
  const customShieldUploadActionLabel = locale === 'zh' ? '上传盾形' : 'Upload Shield';
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const { error, reportError, run, runWithResult } = usePanelCommandError(locale);
  const [customShieldUploadStatus, setCustomShieldUploadStatus] = useState<string | null>(null);
  const [selectedFieldTarget, setSelectedFieldTarget] = useState<FieldRegionId>('overall');
  const editedEscutcheon = resolveEditedShield(project.layers, selectedLayerIds);
  if (!editedEscutcheon) return <section aria-label={copy.shieldAndField}><p>{copy.noShieldLayer}</p></section>;
  const { shield, ordinal: editedEscutcheonOrdinal } = editedEscutcheon;
  const effectiveSelectedFieldTarget = getEffectiveFieldTarget(shield.field.division, selectedFieldTarget);

  const onCustomShieldMaskFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setCustomShieldUploadStatus(null);
      const upload = await createValidatedLocalUpload(file);
      if (!run({ type: 'register-local-upload', upload })) return;
      if (shield.customOutlinePath && !run({ type: 'set-custom-shield-outline', layerId: shield.id })) return;
      if (!run({ type: 'set-custom-shield-mask', layerId: shield.id, uploadId: upload.id })) return;
      setCustomShieldUploadStatus(copy.customShieldMaskAdded(file.name));
    } catch (caught) { reportError(caught); }
  };

  return (
    <section aria-label={copy.shieldAndField} className="coat-escutcheon-panel">
      {error ? <p role="alert">{error}</p> : null}
      <div className="pl-3">
        <EditingEscutcheonCard editingEscutcheon={copy.editingEscutcheon(editedEscutcheonOrdinal)} editingEscutcheonName={copy.editingEscutcheonName(editedEscutcheonOrdinal)} editingLabel={copy.editingLabel} />
        <button className="coat-escutcheon-add-button" type="button" onClick={() => { try { addNewEscutcheon(runWithResult, setSelectedLayerIds); } catch (caught) { reportError(caught); } }}><Plus aria-hidden="true" />{addNewEscutcheonLabel}</button>
        <details className="coat-escutcheon-library" open>
          <summary className="coat-escutcheon-library-summary"><span>{copy.escutcheonLibrary}</span><ChevronDown aria-hidden="true" /></summary>
          <div className="pt-1"><EscutcheonShapeThumbGrid locale={locale} editedShield={shield} selectEscutcheonShape={copy.selectEscutcheonShape} onPickShape={(assetId) => { try { pickEscutcheonShape(assetId, shield, run); } catch (caught) { reportError(caught); } }} /></div>
        </details>
        <CustomShieldUploads actionLabel={customShieldUploadActionLabel} heading={copy.customShieldUploads} hint={copy.customShieldUploadHint} uploadLabel={copy.uploadCustomShieldMask} uploadStatus={customShieldUploadStatus} onFileChange={(event) => { void onCustomShieldMaskFileChange(event); }} />
        <CustomFieldControls
          copy={copy}
          shield={shield}
          selectedTarget={effectiveSelectedFieldTarget}
          onTargetChange={(target) => setSelectedFieldTarget(target)}
          onDivisionChange={(division) => { try { if (updateFieldDivision(shield, division, run)) setSelectedFieldTarget('overall'); } catch (caught) { reportError(caught); } }}
          onVariationChange={(pattern) => { try { updateFieldVariation(shield, effectiveSelectedFieldTarget, pattern, run); } catch (caught) { reportError(caught); } }}
        />
        <EmbeddedColoursSection copy={copy} shield={shield} run={run} reportError={reportError} />
        <EmbeddedChargesSection copy={copy} shield={shield} runWithResult={runWithResult} setSelectedLayerIds={setSelectedLayerIds} reportError={reportError} />
        <ShieldSettingsSection copy={copy} shield={shield} run={run} reportError={reportError} />
      </div>
    </section>
  );
}
