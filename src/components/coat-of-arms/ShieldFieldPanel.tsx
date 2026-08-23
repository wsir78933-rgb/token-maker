'use client';

import { useState, type ChangeEvent } from 'react';
import { ChevronDown, Pencil, Plus } from 'lucide-react';
import { listShieldSilhouetteAssets, NEWLY_PLACED_LIBRARY_ASSET_SCALE, requireShieldSilhouetteAssetId } from '@/lib/coat-of-arms/assets';
import { fieldDivisionLineStyles, supportsFieldDivisionLine } from '@/lib/coat-of-arms/field-division-line';
import { buildFieldInteriorMarkup } from '@/lib/coat-of-arms/field';
import { getFieldPatternConfigControls, resolveFieldPatternConfig, type FieldPatternConfigControl } from '@/lib/coat-of-arms/field-pattern';
import { getFieldRegionIds, resolveFieldRegions } from '@/lib/coat-of-arms/field-regions';
import type { CoatProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore, type CoatProjectDispatchResult } from '@/lib/coat-of-arms/store';
import type {
  CoatField,
  CoatLayer,
  CoatLocale,
  FieldDivision,
  FieldDivisionLine,
  FieldDivisionLineStyle,
  FieldPattern,
  FieldPatternConfig,
  FieldPlacement,
  FieldRegionId,
  FieldRegionStyle,
  FieldStripeDirection,
  ShieldLayer,
} from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { createValidatedLocalUpload } from './UploadPanel';
import { getCoatWorkbenchCopy, type CustomFieldRegionId } from './workbench-copy';

type ShieldFieldPanelCopy = ReturnType<typeof getCoatWorkbenchCopy>['panels'];

const selectedEscutcheonFill = '#bb212c';
const idleEscutcheonFill = '#5b5347';
const fallbackFieldAccentColor = '#B11F24';
const fieldPreviewColors = ['#F5E6A1', '#B11F24'] as const;
const defaultShieldOutline = { visible: true, color: '#1E293B', width: 1.5 } as const;
const defaultCustomLineWidth = 9;
const embeddedChargeAssetId = 'material-animal-wolf-rampant';
const defaultDivisionLineFrequency = 10;
const defaultDivisionLineAmplitude = 6;
const patternScaleKeptToField = 1;
const patternScaleOutsideField = 2;
const fieldStripeDirectionValues: readonly FieldStripeDirection[] = ['bend', 'bend-sinister', 'horizontal', 'vertical'];
const fieldPlacementValues: readonly FieldPlacement[] = ['overall', 'dexter', 'sinister', 'chief', 'base', 'q1', 'q2', 'q3', 'q4'];

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

function requireEditableCustomDivision(value: unknown): FieldDivision {
  if (value === 'per-bend-sinister') return 'per-bend-sinister';
  return requireCustomFieldDivision(value);
}

function isPerBendDivision(division: FieldDivision): boolean {
  return division === 'per-bend' || division === 'per-bend-sinister';
}

function isDivisionThumbPressed(division: FieldDivision, thumbDivision: FieldDivision): boolean {
  if (thumbDivision === 'per-bend') return isPerBendDivision(division);
  return division === thumbDivision;
}

function isFieldPlacement(regionId: FieldRegionId): regionId is FieldPlacement {
  return fieldPlacementValues.includes(regionId as FieldPlacement);
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

function fieldWithoutRegions(field: CoatField): CoatField {
  const nextField = { ...field };
  delete nextField.regions;
  return nextField;
}

function fieldWithoutDivisionLine(field: CoatField): CoatField {
  const nextField = { ...field };
  delete nextField.divisionLine;
  return nextField;
}

function persistRegionStyle(style: FieldRegionStyle): FieldRegionStyle {
  const persistedStyle: FieldRegionStyle = {
    colors: [...style.colors],
    pattern: style.pattern,
  };
  if (style.patternConfig !== undefined) persistedStyle.patternConfig = { ...style.patternConfig };
  if (style.patternScale !== undefined && style.patternScale !== patternScaleKeptToField) {
    persistedStyle.patternScale = style.patternScale;
  }
  return persistedStyle;
}

function getResolvedRegionStyle(shield: ShieldLayer, regionId: FieldRegionId): FieldRegionStyle {
  const selectedRegion = resolveFieldRegions(shield.field).find((region) => region.id === regionId);
  if (!selectedRegion) throw new Error(`Custom field target is not available for ${shield.field.division}: ${regionId}`);
  return selectedRegion.style;
}

function writeFieldRegionStyle(
  shield: ShieldLayer,
  regionId: FieldRegionId,
  nextStyle: FieldRegionStyle,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const validTarget = requireFieldTarget(regionId, shield.field.division);
  if (validTarget === 'overall') throw new Error(`Custom field region style cannot target overall for ${shield.field.division}`);
  const nextRegions: Partial<Record<FieldRegionId, FieldRegionStyle>> = { ...shield.field.regions };
  nextRegions[validTarget] = persistRegionStyle(nextStyle);
  return run({
    type: 'set-field',
    layerId: shield.id,
    field: { ...shield.field, regions: nextRegions },
  });
}

function updateFieldDivision(
  shield: ShieldLayer,
  value: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const division = requireEditableCustomDivision(value);
  if (division === shield.field.division) return true;
  const field = fieldWithoutRegions({
    ...shield.field,
    division,
    colors: normalizeFieldColors(shield.field.colors, division, shield.field.pattern),
  });
  if (!supportsFieldDivisionLine(division)) delete field.divisionLine;
  return run({ type: 'set-field', layerId: shield.id, field });
}

function updateBendSinister(
  shield: ShieldLayer,
  checked: boolean,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  if (!isPerBendDivision(shield.field.division)) {
    throw new Error(`Bend Sinister is not available for division: ${shield.field.division}`);
  }
  return updateFieldDivision(shield, checked ? 'per-bend-sinister' : 'per-bend', run);
}

function requireDivisionLineStyle(value: unknown): FieldDivisionLineStyle {
  if (!fieldDivisionLineStyles.includes(value as FieldDivisionLineStyle)) {
    throw new Error(`Invalid field division line style: ${String(value)}`);
  }
  return value as FieldDivisionLineStyle;
}

function requireIntegerValue(value: unknown, label: string): number {
  if (typeof value === 'string' && value.trim() === '') {
    throw new Error(`Invalid ${label}: ${value}`);
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(parsed) || !Number.isFinite(parsed)) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
  return parsed;
}

function requireIntegerInRange(value: unknown, minimum: number, maximum: number, label: string): number {
  const parsed = requireIntegerValue(value, label);
  if (parsed < minimum || parsed > maximum) {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
  return parsed;
}

function defaultDivisionLine(style: FieldDivisionLineStyle, existing: FieldDivisionLine | undefined): FieldDivisionLine {
  return {
    style,
    frequency: existing?.frequency ?? defaultDivisionLineFrequency,
    amplitude: existing?.amplitude ?? defaultDivisionLineAmplitude,
  };
}

function updateDivisionLineStyle(
  shield: ShieldLayer,
  value: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const style = requireDivisionLineStyle(value);
  if (!supportsFieldDivisionLine(shield.field.division)) {
    throw new Error(`Field division ${shield.field.division} does not support a configurable division line`);
  }
  if (style === 'straight') {
    return run({ type: 'set-field', layerId: shield.id, field: fieldWithoutDivisionLine(shield.field) });
  }
  return run({
    type: 'set-field',
    layerId: shield.id,
    field: {
      ...shield.field,
      divisionLine: defaultDivisionLine(style, shield.field.divisionLine),
    },
  });
}

function updateDivisionLineMeasurement(
  shield: ShieldLayer,
  key: 'frequency' | 'amplitude',
  value: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const existingLine = shield.field.divisionLine;
  if (!existingLine) throw new Error(`Custom field has no division line to update for division: ${shield.field.division}`);
  const range = key === 'frequency' ? ([1, 30] as const) : ([1, 20] as const);
  const nextLine: FieldDivisionLine = {
    ...existingLine,
    [key]: requireIntegerInRange(value, range[0], range[1], `field division line ${key}`),
  };
  return run({
    type: 'set-field',
    layerId: shield.id,
    field: { ...shield.field, divisionLine: nextLine },
  });
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
    delete field.patternConfig;
    return run({ type: 'set-field', layerId: shield.id, field });
  }

  const selectedStyle = getResolvedRegionStyle(shield, validTarget);
  const selectedStyleWithoutConfig = { ...selectedStyle };
  delete selectedStyleWithoutConfig.patternConfig;
  return writeFieldRegionStyle(shield, validTarget, {
    ...selectedStyleWithoutConfig,
    pattern,
    colors: normalizeRegionColors(selectedStyle.colors, pattern),
  }, run);
}

function updateKeepPatternToField(
  shield: ShieldLayer,
  regionId: FieldRegionId,
  keepToField: boolean,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  if (shield.field.division === 'per-chevron') {
    throw new Error(`Keep pattern to field is not available for division: ${shield.field.division}`);
  }
  const selectedStyle = getResolvedRegionStyle(shield, regionId);
  return writeFieldRegionStyle(shield, regionId, {
    ...selectedStyle,
    patternScale: keepToField ? patternScaleKeptToField : patternScaleOutsideField,
  }, run);
}

function updateRegionColour(
  shield: ShieldLayer,
  regionId: FieldRegionId,
  colourIndex: number,
  value: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  if (!Number.isInteger(colourIndex) || colourIndex < 0) {
    throw new Error(`Invalid Custom field region color index: ${String(colourIndex)}`);
  }
  const selectedStyle = getResolvedRegionStyle(shield, regionId);
  const nextColors = [...selectedStyle.colors];
  nextColors[colourIndex] = requireColour(value, 'Custom field region color');
  return writeFieldRegionStyle(shield, regionId, {
    ...selectedStyle,
    colors: normalizeRegionColors(nextColors, selectedStyle.pattern),
  }, run);
}

function requireStripeDirection(value: unknown): FieldStripeDirection {
  if (!fieldStripeDirectionValues.includes(value as FieldStripeDirection)) {
    throw new Error(`Invalid field stripe direction: ${String(value)}`);
  }
  return value as FieldStripeDirection;
}

function withPatternConfigControl(
  pattern: FieldPattern,
  current: FieldPatternConfig | undefined,
  control: FieldPatternConfigControl,
  rawValue: unknown,
): FieldPatternConfig {
  const nextValue = control === 'direction'
    ? requireStripeDirection(rawValue)
    : requireIntegerValue(rawValue, `field pattern ${control}`);
  return { ...resolveFieldPatternConfig(pattern, current), [control]: nextValue };
}

function updatePatternConfigControl(
  shield: ShieldLayer,
  target: FieldRegionId,
  control: FieldPatternConfigControl,
  rawValue: unknown,
  run: (command: CoatProjectCommand) => boolean,
): boolean {
  const validTarget = requireFieldTarget(target, shield.field.division);
  const allowedControls = getFieldPatternConfigControls(
    validTarget === 'overall' ? shield.field.pattern : getResolvedRegionStyle(shield, validTarget).pattern,
  );
  if (!allowedControls.includes(control)) {
    throw new Error(`Invalid field pattern control ${control} for ${validTarget === 'overall' ? shield.field.pattern : getResolvedRegionStyle(shield, validTarget).pattern}`);
  }
  if (validTarget === 'overall') {
    return run({
      type: 'set-field',
      layerId: shield.id,
      field: {
        ...shield.field,
        patternConfig: withPatternConfigControl(shield.field.pattern, shield.field.patternConfig, control, rawValue),
      },
    });
  }
  const selectedStyle = getResolvedRegionStyle(shield, validTarget);
  return writeFieldRegionStyle(shield, validTarget, {
    ...selectedStyle,
    patternConfig: withPatternConfigControl(selectedStyle.pattern, selectedStyle.patternConfig, control, rawValue),
  }, run);
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
  fieldRegionId: FieldRegionId = 'overall',
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
    fieldRegionId,
    clipToField: true,
    ...(isFieldPlacement(fieldRegionId) ? { fieldPlacement: fieldRegionId } : {}),
  };
  if (!runWithResult({ type: 'update-layer', layerId: result.createdLayerId, patch: { transform: scopedTransform } })) return;
  setSelectedLayerIds([shield.id]);
}

function FieldPreview({ division, pattern, previewId }: { division: FieldDivision; pattern: FieldPattern; previewId: string }) {
  const previewField: CoatField = { division, colors: [...fieldPreviewColors], pattern };
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

function getDivisionLineStyleLabel(copy: ShieldFieldPanelCopy, style: FieldDivisionLineStyle): string {
  const label = copy.fieldDivisionLineStyles[style];
  if (!label) throw new Error(`Missing Custom field division line style label: ${style}`);
  return label;
}

function getStripeDirectionLabel(copy: ShieldFieldPanelCopy, direction: FieldStripeDirection): string {
  const label = copy.fieldStripeDirections[direction];
  if (!label) throw new Error(`Missing Custom field stripe direction label: ${direction}`);
  return label;
}

function getCustomRegionSectionTitle(copy: ShieldFieldPanelCopy, regionId: FieldRegionId): string {
  const title = copy.customFieldRegionSectionNames[regionId as CustomFieldRegionId];
  if (!title) throw new Error(`Missing Custom field region section name: ${regionId}`);
  return title;
}

function listSplitFieldRegionIds(division: FieldDivision): FieldRegionId[] {
  return getFieldRegionIds(division).filter((regionId) => regionId !== 'overall');
}

function FieldVariationGrid({
  copy,
  division,
  selectedPattern,
  previewIdPrefix,
  onPick,
}: {
  copy: ShieldFieldPanelCopy;
  division: FieldDivision;
  selectedPattern: FieldPattern;
  previewIdPrefix: string;
  onPick: (pattern: FieldPattern) => void;
}) {
  return (
    <section aria-label={copy.variationOfField} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.variationOfField}</h3>
      <div aria-label={copy.variationOfField} className="grid grid-cols-4 gap-2" role="group">
        {customFieldVariationChoices.map((pattern) => {
          const label = getCustomFieldLabel(copy.customFieldVariationNames, pattern, 'variation');
          return (
            <button
              key={pattern}
              aria-label={label}
              aria-pressed={selectedPattern === pattern}
              className="grid aspect-square min-w-0 place-items-center rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-1 aria-pressed:border-[color:var(--coat-accent)]"
              title={copy.fieldVariationChoice(label)}
              type="button"
              onClick={() => onPick(pattern)}
            >
              <FieldPreview division={division} pattern={pattern} previewId={`${previewIdPrefix}-${pattern}`} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PatternConfigFields({
  copy,
  pattern,
  patternConfig,
  onControlChange,
}: {
  copy: ShieldFieldPanelCopy;
  pattern: FieldPattern;
  patternConfig: FieldPatternConfig | undefined;
  onControlChange: (control: FieldPatternConfigControl, value: string) => void;
}) {
  const controls = getFieldPatternConfigControls(pattern);
  if (controls.length === 0) return null;
  const resolvedConfig = resolveFieldPatternConfig(pattern, patternConfig);
  return (
    <div className="mt-3 grid gap-2">
      {controls.map((control) => {
        const controlLabel = copy.fieldPatternControl(pattern, control);
        if (control === 'direction') {
          return (
            <label key={control} className="grid gap-1 text-sm text-[color:var(--coat-muted)]">
              <span>{controlLabel}</span>
              <select
                aria-label={controlLabel}
                className="min-h-8 px-2 text-sm"
                value={resolvedConfig.direction ?? 'bend'}
                onChange={(event) => onControlChange(control, event.target.value)}
              >
                {fieldStripeDirectionValues.map((direction) => (
                  <option key={direction} value={direction}>{getStripeDirectionLabel(copy, direction)}</option>
                ))}
              </select>
            </label>
          );
        }
        const numericValue = resolvedConfig[control];
        return (
          <label key={control} className="grid gap-1 text-sm text-[color:var(--coat-muted)]">
            <span>{controlLabel}</span>
            <input
              aria-label={controlLabel}
              className="min-h-8 px-2 text-sm"
              type="number"
              value={numericValue ?? ''}
              onChange={(event) => onControlChange(control, event.target.value)}
            />
          </label>
        );
      })}
    </div>
  );
}

function DivisionLineControls({
  copy,
  shield,
  run,
  reportError,
}: {
  copy: ShieldFieldPanelCopy;
  shield: ShieldLayer;
  run: (command: CoatProjectCommand) => boolean;
  reportError: (error: unknown) => void;
}) {
  const selectedStyle = shield.field.divisionLine?.style ?? 'straight';
  return (
    <div className="mt-3 grid gap-2">
      <label className="grid gap-1 text-sm text-[color:var(--coat-muted)]">
        <span>{copy.divisionLineStyle}</span>
        <select
          aria-label={copy.divisionLineStyle}
          className="min-h-8 px-2 text-sm"
          value={selectedStyle}
          onChange={(event) => {
            try { updateDivisionLineStyle(shield, event.target.value, run); } catch (caught) { reportError(caught); }
          }}
        >
          {fieldDivisionLineStyles.map((style) => (
            <option key={style} value={style}>{getDivisionLineStyleLabel(copy, style)}</option>
          ))}
        </select>
      </label>
      {selectedStyle === 'straight' ? null : (
        <>
          <label className="grid gap-1 text-sm text-[color:var(--coat-muted)]">
            <span>{copy.divisionLineFrequency}</span>
            <input
              aria-label={copy.divisionLineFrequency}
              className="min-h-8 px-2 text-sm"
              type="number"
              min={1}
              max={30}
              value={shield.field.divisionLine?.frequency ?? defaultDivisionLineFrequency}
              onChange={(event) => {
                try { updateDivisionLineMeasurement(shield, 'frequency', event.target.value, run); } catch (caught) { reportError(caught); }
              }}
            />
          </label>
          <label className="grid gap-1 text-sm text-[color:var(--coat-muted)]">
            <span>{copy.divisionLineAmplitude}</span>
            <input
              aria-label={copy.divisionLineAmplitude}
              className="min-h-8 px-2 text-sm"
              type="number"
              min={1}
              max={20}
              value={shield.field.divisionLine?.amplitude ?? defaultDivisionLineAmplitude}
              onChange={(event) => {
                try { updateDivisionLineMeasurement(shield, 'amplitude', event.target.value, run); } catch (caught) { reportError(caught); }
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}

function OverallColoursSection({
  copy,
  shield,
  run,
  reportError,
}: {
  copy: ShieldFieldPanelCopy;
  shield: ShieldLayer;
  run: (command: CoatProjectCommand) => boolean;
  reportError: (error: unknown) => void;
}) {
  const colours = listEditedShieldColours(shield);
  return (
    <section aria-label={copy.embeddedColors} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.embeddedColors}</h3>
      <div className="flex flex-wrap gap-2">
        {colours.map((colour) => (
          <label key={colour.toUpperCase()} className="inline-flex h-10 w-10 overflow-hidden rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-0.5" style={{ backgroundColor: colour }}>
            <input
              aria-label={copy.embeddedColorSwatch(colour)}
              className="h-full w-full cursor-pointer border-0 p-0"
              type="color"
              value={colour.toLowerCase()}
              onChange={(event) => {
                try {
                  const nextColour = requireColour(event.target.value, 'Custom escutcheon color');
                  if (nextColour.toUpperCase() !== colour.toUpperCase()) run({ type: 'replace-layer-colour', layerId: shield.id, fromColor: colour, toColor: nextColour });
                } catch (caught) { reportError(caught); }
              }}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function RegionColoursSection({
  copy,
  colours,
  onColourChange,
}: {
  copy: ShieldFieldPanelCopy;
  colours: readonly string[];
  onColourChange: (colourIndex: number, value: string) => void;
}) {
  return (
    <section aria-label={copy.embeddedColors} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.embeddedColors}</h3>
      <div className="flex flex-wrap gap-2">
        {colours.map((colour, colourIndex) => (
          <label key={`${colourIndex}-${colour.toUpperCase()}`} className="inline-flex h-10 w-10 overflow-hidden rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-0.5" style={{ backgroundColor: colour }}>
            <input
              aria-label={copy.embeddedColorSwatch(colour)}
              className="h-full w-full cursor-pointer border-0 p-0"
              type="color"
              value={colour.toLowerCase()}
              onChange={(event) => onColourChange(colourIndex, event.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function EmbeddedChargesSection({
  copy,
  shield,
  fieldRegionId,
  runWithResult,
  setSelectedLayerIds,
  reportError,
}: {
  copy: ShieldFieldPanelCopy;
  shield: ShieldLayer;
  fieldRegionId: FieldRegionId;
  runWithResult: (command: CoatProjectCommand) => CoatProjectDispatchResult | null;
  setSelectedLayerIds: (layerIds: string[]) => void;
  reportError: (error: unknown) => void;
}) {
  return (
    <section aria-label={copy.embeddedCharges} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
      <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.embeddedCharges}</h3>
      <button
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded bg-[#bb212c] px-3 text-sm font-medium text-white"
        type="button"
        onClick={() => {
          try { addChargeToEscutcheon(shield, runWithResult, setSelectedLayerIds, fieldRegionId); } catch (caught) { reportError(caught); }
        }}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />{copy.addChargeToEscutcheon}
      </button>
    </section>
  );
}

function RegionAccordion({
  copy,
  shield,
  regionId,
  run,
  runWithResult,
  setSelectedLayerIds,
  reportError,
}: {
  copy: ShieldFieldPanelCopy;
  shield: ShieldLayer;
  regionId: FieldRegionId;
  run: (command: CoatProjectCommand) => boolean;
  runWithResult: (command: CoatProjectCommand) => CoatProjectDispatchResult | null;
  setSelectedLayerIds: (layerIds: string[]) => void;
  reportError: (error: unknown) => void;
}) {
  const title = getCustomRegionSectionTitle(copy, regionId);
  const regionStyle = getResolvedRegionStyle(shield, regionId);
  const keepPatternToField = (regionStyle.patternScale ?? patternScaleKeptToField) === patternScaleKeptToField;
  return (
    <details className="mt-3 border-t border-[color:var(--coat-line)] pt-2" open>
      <summary className="cursor-pointer text-sm font-semibold text-[color:var(--coat-text)]">{title}</summary>
      <FieldVariationGrid
        copy={copy}
        division="solid"
        selectedPattern={regionStyle.pattern}
        previewIdPrefix={`custom-variation-${regionId}`}
        onPick={(pattern) => {
          try { updateFieldVariation(shield, regionId, pattern, run); } catch (caught) { reportError(caught); }
        }}
      />
      <PatternConfigFields
        copy={copy}
        pattern={regionStyle.pattern}
        patternConfig={regionStyle.patternConfig}
        onControlChange={(control, value) => {
          try { updatePatternConfigControl(shield, regionId, control, value, run); } catch (caught) { reportError(caught); }
        }}
      />
      {shield.field.division === 'per-chevron' ? null : (
        <label className="mt-3 flex items-center gap-2 text-sm text-[color:var(--coat-muted)]">
          <input
            aria-label={copy.keepPatternToField}
            type="checkbox"
            checked={keepPatternToField}
            onChange={(event) => {
              try { updateKeepPatternToField(shield, regionId, event.target.checked, run); } catch (caught) { reportError(caught); }
            }}
          />
          {copy.keepPatternToField}
        </label>
      )}
      <RegionColoursSection
        copy={copy}
        colours={regionStyle.colors}
        onColourChange={(colourIndex, value) => {
          try { updateRegionColour(shield, regionId, colourIndex, value, run); } catch (caught) { reportError(caught); }
        }}
      />
      <EmbeddedChargesSection
        copy={copy}
        shield={shield}
        fieldRegionId={regionId}
        runWithResult={runWithResult}
        setSelectedLayerIds={setSelectedLayerIds}
        reportError={reportError}
      />
    </details>
  );
}

function CustomFieldControls({
  copy,
  shield,
  run,
  runWithResult,
  setSelectedLayerIds,
  reportError,
}: {
  copy: ShieldFieldPanelCopy;
  shield: ShieldLayer;
  run: (command: CoatProjectCommand) => boolean;
  runWithResult: (command: CoatProjectCommand) => CoatProjectDispatchResult | null;
  setSelectedLayerIds: (layerIds: string[]) => void;
  reportError: (error: unknown) => void;
}) {
  const division = shield.field.division;
  return (
    <>
      <section aria-label={copy.divisionOfField} className="mt-4 border-t border-[color:var(--coat-line)] pt-3">
        <h3 className="mb-2 text-base font-semibold text-[color:var(--coat-text)]">{copy.divisionOfField}</h3>
        <div aria-label={copy.divisionOfField} className="grid grid-cols-4 gap-2" role="group">
          {customFieldDivisionChoices.map((choice) => {
            const label = getCustomFieldLabel(copy.customFieldDivisionNames, choice.labelKey, 'division');
            const isPressed = isDivisionThumbPressed(division, choice.value);
            return (
              <button
                key={choice.value}
                aria-label={label}
                aria-pressed={isPressed}
                className="grid aspect-square min-w-0 place-items-center rounded border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] p-1 aria-pressed:border-[color:var(--coat-accent)]"
                title={copy.fieldDivisionChoice(label)}
                type="button"
                onClick={() => {
                  try {
                    if (isPressed) return;
                    updateFieldDivision(shield, choice.value, run);
                  } catch (caught) { reportError(caught); }
                }}
              >
                <FieldPreview division={choice.value} pattern="solid" previewId={`custom-division-${choice.value}`} />
              </button>
            );
          })}
        </div>
        {isPerBendDivision(division) ? (
          <label className="mt-3 flex items-center gap-2 text-sm text-[color:var(--coat-muted)]">
            <input
              aria-label={copy.bendSinister}
              type="checkbox"
              checked={division === 'per-bend-sinister'}
              onChange={(event) => {
                try { updateBendSinister(shield, event.target.checked, run); } catch (caught) { reportError(caught); }
              }}
            />
            {copy.bendSinister}
          </label>
        ) : null}
        {supportsFieldDivisionLine(division) ? (
          <DivisionLineControls copy={copy} shield={shield} run={run} reportError={reportError} />
        ) : null}
      </section>
      {division === 'solid' ? (
        <>
          <FieldVariationGrid
            copy={copy}
            division={division}
            selectedPattern={shield.field.pattern}
            previewIdPrefix="custom-variation"
            onPick={(pattern) => {
              try { updateFieldVariation(shield, 'overall', pattern, run); } catch (caught) { reportError(caught); }
            }}
          />
          <PatternConfigFields
            copy={copy}
            pattern={shield.field.pattern}
            patternConfig={shield.field.patternConfig}
            onControlChange={(control, value) => {
              try { updatePatternConfigControl(shield, 'overall', control, value, run); } catch (caught) { reportError(caught); }
            }}
          />
          <OverallColoursSection copy={copy} shield={shield} run={run} reportError={reportError} />
          <EmbeddedChargesSection
            copy={copy}
            shield={shield}
            fieldRegionId="overall"
            runWithResult={runWithResult}
            setSelectedLayerIds={setSelectedLayerIds}
            reportError={reportError}
          />
        </>
      ) : (
        <>
          <details className="mt-3 border-t border-[color:var(--coat-line)] pt-2" open>
            <summary className="cursor-pointer text-sm font-semibold text-[color:var(--coat-text)]">{copy.overallOnTop}</summary>
            <EmbeddedChargesSection
              copy={copy}
              shield={shield}
              fieldRegionId="overall"
              runWithResult={runWithResult}
              setSelectedLayerIds={setSelectedLayerIds}
              reportError={reportError}
            />
          </details>
          {listSplitFieldRegionIds(division).map((regionId) => (
            <RegionAccordion
              key={regionId}
              copy={copy}
              shield={shield}
              regionId={regionId}
              run={run}
              runWithResult={runWithResult}
              setSelectedLayerIds={setSelectedLayerIds}
              reportError={reportError}
            />
          ))}
        </>
      )}
    </>
  );
}

function ShieldSettingsSection({ copy, shield, run, reportError }: { copy: ShieldFieldPanelCopy; shield: ShieldLayer; run: (command: CoatProjectCommand) => boolean; reportError: (error: unknown) => void }) {
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
  const editedEscutcheon = resolveEditedShield(project.layers, selectedLayerIds);
  if (!editedEscutcheon) return <section aria-label={copy.shieldAndField}><p>{copy.noShieldLayer}</p></section>;
  const { shield, ordinal: editedEscutcheonOrdinal } = editedEscutcheon;

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
          run={run}
          runWithResult={runWithResult}
          setSelectedLayerIds={setSelectedLayerIds}
          reportError={reportError}
        />
        <ShieldSettingsSection copy={copy} shield={shield} run={run} reportError={reportError} />
      </div>
    </section>
  );
}
