'use client';

import { useState, type ChangeEvent } from 'react';
import { listAssetsByKind } from '@/lib/coat-of-arms/assets';
import { fieldDivisionLineStyles, supportsFieldDivisionLine } from '@/lib/coat-of-arms/field-division-line';
import { fieldPatterns, getFieldPatternConfigControls, resolveFieldPatternConfig } from '@/lib/coat-of-arms/field-pattern';
import { resolveFieldRegions } from '@/lib/coat-of-arms/field-regions';
import { createLocalCoatId } from '@/lib/coat-of-arms/id';
import { DEFAULT_CUSTOM_SHIELD_OUTLINE_PATH } from '@/lib/coat-of-arms/shield-outline';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLocale, FieldDivision, FieldDivisionLine, FieldOrnament, FieldOrnamentKind, FieldPattern, FieldPatternConfig, FieldRegionId, FieldRegionStyle, FieldStripeDirection } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { createValidatedLocalUpload } from './UploadPanel';
import { getCoatWorkbenchCopy, type CoatWorkbenchCopy } from './workbench-copy';

const divisions: FieldDivision[] = ['solid', 'per-pale', 'per-fess', 'per-bend', 'per-bend-sinister', 'per-chevron', 'quarterly', 'gyronny', 'tierced-per-pale', 'tierced-per-fess', 'per-saltire', 'barry', 'paly', 'bendy'];
const patterns: readonly FieldPattern[] = fieldPatterns;
const fieldOrnamentKinds: FieldOrnamentKind[] = ['bar', 'base', 'bendlet', 'chief', 'cross', 'fess', 'mountain', 'pale', 'pile', 'escutcheon', 'bordure', 'canton', 'chevron', 'pall', 'saltire', 'fretty'];
const fieldOrnamentWidthKinds: readonly FieldOrnamentKind[] = ['bar', 'base', 'chief', 'fess', 'mountain', 'canton', 'pile', 'chevron'];
const fieldOrnamentHeightKinds: readonly FieldOrnamentKind[] = ['base', 'chief', 'mountain', 'canton'];
const fieldOrnamentThicknessKinds: readonly FieldOrnamentKind[] = ['bar', 'bendlet', 'fess', 'pale', 'chevron', 'pall', 'bordure', 'saltire', 'fretty'];
const fieldOrnamentReversibleKinds: readonly FieldOrnamentKind[] = ['pile', 'chevron', 'pall'];
const fieldOrnamentEdgeKinds: readonly FieldOrnamentKind[] = ['base', 'chief', 'bendlet', 'fess', 'pale'];

function defaultFieldOrnamentWidth(kind: FieldOrnamentKind): number {
  if (kind === 'canton') return 35;
  if (kind === 'pile') return 60;
  return 100;
}

function defaultFieldOrnamentHeight(kind: FieldOrnamentKind): number {
  if (kind === 'base') return 28;
  if (kind === 'chief') return 25;
  if (kind === 'mountain') return 68;
  return 35;
}

function defaultFieldOrnamentThickness(kind: FieldOrnamentKind): number {
  if (kind === 'bordure' || kind === 'fretty') return 8;
  if (kind === 'saltire') return 9;
  if (kind === 'pall') return 22;
  if (kind === 'fess') return 26;
  if (kind === 'pale') return 22;
  if (kind === 'bar') return 10;
  return 14;
}

function PatternConfigControls({
  pattern,
  patternConfig,
  copy,
  labelFor,
  onChange,
}: {
  pattern: FieldPattern;
  patternConfig: FieldPatternConfig | undefined;
  copy: CoatWorkbenchCopy['panels'];
  labelFor: (control: 'count' | 'direction' | 'rows' | 'bricks' | 'columns' | 'symbolSize') => string;
  onChange: (patch: Partial<FieldPatternConfig>) => void;
}) {
  const resolvedConfig = resolveFieldPatternConfig(pattern, patternConfig);
  return <>
    {getFieldPatternConfigControls(pattern).map((control) => {
      const label = labelFor(control);
      if (control === 'direction') {
        return <label key={control}>{label}<select aria-label={label} value={resolvedConfig.direction} onChange={(event) => onChange({ direction: event.target.value as FieldStripeDirection })}>
          {(['bend', 'bend-sinister', 'horizontal', 'vertical'] as const).map((direction) => <option key={direction} value={direction}>{copy.fieldStripeDirections[direction]}</option>)}
        </select></label>;
      }
      const maximum = control === 'symbolSize' ? 20 : pattern === 'gyronny' && control === 'count' ? 16 : 12;
      const minimum = control === 'symbolSize' ? 1 : control === 'count' || control === 'rows' || control === 'bricks' || control === 'columns' ? 2 : 1;
      return <label key={control}>{label}<input aria-label={label} type="number" min={minimum} max={maximum} step="1" value={resolvedConfig[control] ?? ''} onChange={(event) => onChange({ [control]: Number(event.target.value) })} /></label>;
    })}
  </>;
}

function CustomVectorShieldOutlineEditor({
  initialPath,
  copy,
  onApply,
  onReset,
}: {
  initialPath: string;
  copy: CoatWorkbenchCopy['panels'];
  onApply: (path: string) => void;
  onReset: () => void;
}) {
  const [draftPath, setDraftPath] = useState(initialPath);
  return <fieldset>
    <legend>{copy.customVectorShieldOutline}</legend>
    <label>
      {copy.customVectorShieldPath}
      <textarea aria-label={copy.customVectorShieldPath} rows={3} spellCheck={false} value={draftPath} onChange={(event) => setDraftPath(event.target.value)} />
    </label>
    <button type="button" onClick={() => onApply(draftPath)}>{copy.applyCustomVectorShieldOutline}</button>
    <button type="button" onClick={onReset}>{copy.resetCustomVectorShieldOutline}</button>
  </fieldset>;
}

/** Changes the one persisted shield only through validated project commands. */
export function ShieldFieldPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const { error, reportError, run } = usePanelCommandError(locale);
  const [fieldOrnamentKind, setFieldOrnamentKind] = useState<FieldOrnamentKind>('chief');
  const [customShieldUploadStatus, setCustomShieldUploadStatus] = useState<string | null>(null);
  const shield = project.layers.find((layer) => layer.type === 'shield');
  if (!shield || shield.type !== 'shield') return <section aria-label={copy.shieldAndField}><p>{copy.noShieldLayer}</p></section>;
  const outline = shield.field.outline ?? { visible: true, color: '#1E293B', width: 1.5 };
  const divisionLine: FieldDivisionLine = shield.field.divisionLine ?? { style: 'straight', frequency: 3, amplitude: 6 };
  const fieldRegions = resolveFieldRegions(shield.field);

  const updateField = (patch: Partial<typeof shield.field>) => {
    const nextField = { ...shield.field, ...patch };
    if (patch.division !== undefined && patch.division !== shield.field.division) delete nextField.regions;
    if (patch.pattern !== undefined && patch.pattern !== shield.field.pattern) delete nextField.patternConfig;
    if (nextField.regions !== undefined) delete nextField.divisionLine;
    const needsTwoColors = nextField.division !== 'solid' || nextField.pattern !== 'solid';
    if (needsTwoColors && nextField.colors.length < 2) nextField.colors = [nextField.colors[0]!, nextField.colors[0]!];
    if (!supportsFieldDivisionLine(nextField.division)) delete nextField.divisionLine;
    run({ type: 'set-field', layerId: shield.id, field: nextField });
  };
  const updateFieldRegion = (regionId: FieldRegionId, patch: Partial<FieldRegionStyle>) => {
    const nextRegions: Partial<Record<FieldRegionId, FieldRegionStyle>> = {};
    for (const region of fieldRegions) {
      const nextStyle = region.id === regionId ? { ...region.style, ...patch } : region.style;
      if (region.id === regionId && patch.pattern !== undefined && patch.pattern !== region.style.pattern) delete nextStyle.patternConfig;
      const colors = nextStyle.pattern === 'solid'
        ? [nextStyle.colors[0]!]
        : nextStyle.colors.length >= 2
          ? nextStyle.colors
          : [nextStyle.colors[0]!, nextStyle.colors[0]!];
      nextRegions[region.id] = { colors, pattern: nextStyle.pattern, patternScale: nextStyle.patternScale, ...(nextStyle.patternConfig === undefined ? {} : { patternConfig: nextStyle.patternConfig }) };
    }
    updateField({ regions: nextRegions });
  };
  const updateDivisionLine = (patch: Partial<FieldDivisionLine>) => updateField({ divisionLine: { ...divisionLine, ...patch } });
  const addFieldOrnament = () => {
    const ornament: FieldOrnament = { id: createLocalCoatId(), kind: fieldOrnamentKind, color: '#F5E6A1', x: 0, y: 0, scale: 1, rotation: 0 };
    updateField({ ornaments: [...(shield.field.ornaments ?? []), ornament] });
  };
  const updateFieldOrnament = (ornamentId: string, patch: Partial<FieldOrnament>) => updateField({
    ornaments: (shield.field.ornaments ?? []).map((ornament) => ornament.id === ornamentId ? { ...ornament, ...patch } : ornament),
  });
  const moveFieldOrnament = (ornamentId: string, direction: -1 | 1) => {
    const ornaments = [...(shield.field.ornaments ?? [])];
    const currentIndex = ornaments.findIndex((ornament) => ornament.id === ornamentId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ornaments.length) return;
    [ornaments[currentIndex], ornaments[nextIndex]] = [ornaments[nextIndex]!, ornaments[currentIndex]!];
    updateField({ ornaments });
  };
  const onCustomShieldMaskFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setCustomShieldUploadStatus(null);
      const upload = await createValidatedLocalUpload(file);
      if (!run({ type: 'register-local-upload', upload })) return;
      if (!selectCustomShieldMask(upload.id)) return;
      setCustomShieldUploadStatus(copy.customShieldMaskAdded(file.name));
    } catch (caught) {
      reportError(caught);
    }
  };
  const changeShieldOutlineSource = (source: 'library' | 'custom-vector') => {
    if (source === 'library') {
      run({ type: 'set-custom-shield-outline', layerId: shield.id });
      return;
    }
    const starterPath = shield.customOutlinePath ?? DEFAULT_CUSTOM_SHIELD_OUTLINE_PATH;
    run({ type: 'set-custom-shield-outline', layerId: shield.id, path: starterPath });
  };
  const applyCustomOutlinePath = (path: string) => {
    run({ type: 'set-custom-shield-outline', layerId: shield.id, path });
  };
  const resetCustomOutline = () => {
    run({ type: 'set-custom-shield-outline', layerId: shield.id, path: DEFAULT_CUSTOM_SHIELD_OUTLINE_PATH });
  };
  const selectCustomShieldMask = (uploadId?: string) => {
    if (shield.customOutlinePath && !run({ type: 'set-custom-shield-outline', layerId: shield.id })) return false;
    return run({ type: 'set-custom-shield-mask', layerId: shield.id, ...(uploadId ? { uploadId } : {}) });
  };

  return (
    <section aria-label={copy.shieldAndField} className="space-y-2">
      <h2>{copy.shieldAndField}</h2>
      {error ? <p role="alert">{error}</p> : null}
      <label>
        {copy.shieldOutline}
        <select aria-label={copy.shieldOutline} value={shield.assetId} onChange={(event) => run({
          type: 'update-layer', layerId: shield.id, patch: { assetId: event.target.value },
        })}>
          {listAssetsByKind('shield').map((asset) => <option key={asset.id} value={asset.id}>{asset.name[locale]}</option>)}
        </select>
      </label>
      <label>
        {copy.shieldOutlineSource}
        <select aria-label={copy.shieldOutlineSource} value={shield.customOutlinePath ? 'custom-vector' : 'library'} onChange={(event) => changeShieldOutlineSource(event.target.value as 'library' | 'custom-vector')}>
          <option value="library">{copy.shieldOutlineSources.library}</option>
          <option value="custom-vector">{copy.shieldOutlineSources['custom-vector']}</option>
        </select>
      </label>
      {shield.customOutlinePath ? <CustomVectorShieldOutlineEditor key={shield.customOutlinePath} initialPath={shield.customOutlinePath} copy={copy} onApply={applyCustomOutlinePath} onReset={resetCustomOutline} /> : null}
      <label>
        {copy.customShieldMask}
        <select aria-label={copy.customShieldMask} value={shield.customMaskUploadId ?? ''} onChange={(event) => selectCustomShieldMask(event.target.value || undefined)}>
          <option value="">{copy.defaultShieldMask}</option>
          {project.uploads.map((upload) => <option key={upload.id} value={upload.id}>{upload.id}</option>)}
        </select>
      </label>
      <label>
        {copy.uploadCustomShieldMask}
        <input aria-label={copy.uploadCustomShieldMask} type="file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" onChange={onCustomShieldMaskFileChange} />
      </label>
      {customShieldUploadStatus ? <p role="status">{customShieldUploadStatus}</p> : null}
      <label>
        {copy.fieldDivision}
        <select aria-label={copy.fieldDivision} value={shield.field.division} onChange={(event) => updateField({ division: event.target.value as FieldDivision })}>
          {divisions.map((division) => <option key={division} value={division}>{copy.fieldDivisions[division]}</option>)}
        </select>
      </label>
      <label>
        {copy.fieldVariation}
        <select aria-label={copy.fieldVariation} value={shield.field.pattern} onChange={(event) => updateField({ pattern: event.target.value as FieldPattern })}>
          {patterns.map((pattern) => <option key={pattern} value={pattern}>{copy.fieldPatterns[pattern]}</option>)}
        </select>
      </label>
      <PatternConfigControls
        pattern={shield.field.pattern}
        patternConfig={shield.field.patternConfig}
        copy={copy}
        labelFor={(control) => copy.fieldPatternControl(shield.field.pattern, control)}
        onChange={(patternConfig) => updateField({ patternConfig: { ...shield.field.patternConfig, ...patternConfig } })}
      />
      {supportsFieldDivisionLine(shield.field.division) ? <fieldset><legend>{copy.fieldDivisionLine}</legend>
        <label>{copy.fieldDivisionLine}<select aria-label={copy.fieldDivisionLine} value={divisionLine.style} onChange={(event) => updateDivisionLine({ style: event.target.value as FieldDivisionLine['style'] })}>
          {fieldDivisionLineStyles.map((style) => <option key={style} value={style}>{copy.fieldDivisionLineStyles[style]}</option>)}
        </select></label>
        <label>{copy.divisionLineFrequency}<input aria-label={copy.divisionLineFrequency} type="number" min="1" max="30" step="1" value={divisionLine.frequency} onChange={(event) => updateDivisionLine({ frequency: Number(event.target.value) })} /></label>
        <label>{copy.divisionLineAmplitude}<input aria-label={copy.divisionLineAmplitude} type="number" min="1" max="20" step="1" value={divisionLine.amplitude} onChange={(event) => updateDivisionLine({ amplitude: Number(event.target.value) })} /></label>
      </fieldset> : null}
      <label>
        {copy.fieldPrimaryColour}
        <input aria-label={copy.fieldPrimaryColour} type="color" value={shield.field.colors[0]} onChange={(event) => updateField({
          colors: [event.target.value, ...shield.field.colors.slice(1)],
        })} />
      </label>
      {shield.field.division !== 'solid' || shield.field.pattern !== 'solid' ? <label>
        {copy.fieldAccentColour}
        <input aria-label={copy.fieldAccentColour} type="color" value={shield.field.colors[1] ?? shield.field.colors[0]} onChange={(event) => updateField({
          colors: [shield.field.colors[0]!, event.target.value, ...shield.field.colors.slice(2)],
        })} />
      </label> : null}
      {fieldRegions.length > 1 ? <fieldset><legend>{copy.fieldRegions}</legend>
        {fieldRegions.map(({ id, style }) => {
          const regionName = copy.fieldRegionNames[id];
          return <fieldset key={id}><legend>{copy.fieldRegion(regionName)}</legend>
            <label>{copy.fieldRegionVariation(regionName)}<select aria-label={copy.fieldRegionVariation(regionName)} value={style.pattern} onChange={(event) => updateFieldRegion(id, { pattern: event.target.value as FieldPattern })}>{patterns.map((pattern) => <option key={pattern} value={pattern}>{copy.fieldPatterns[pattern]}</option>)}</select></label>
            <PatternConfigControls
              pattern={style.pattern}
              patternConfig={style.patternConfig}
              copy={copy}
              labelFor={(control) => copy.fieldRegionPatternControl(regionName, style.pattern, control)}
              onChange={(patternConfig) => updateFieldRegion(id, { patternConfig: { ...style.patternConfig, ...patternConfig } })}
            />
            <label>{copy.fieldRegionPrimaryColour(regionName)}<input aria-label={copy.fieldRegionPrimaryColour(regionName)} type="color" value={style.colors[0]} onChange={(event) => updateFieldRegion(id, { colors: [event.target.value, ...style.colors.slice(1)] })} /></label>
            {style.pattern !== 'solid' ? <label>{copy.fieldRegionAccentColour(regionName)}<input aria-label={copy.fieldRegionAccentColour(regionName)} type="color" value={style.colors[1] ?? style.colors[0]} onChange={(event) => updateFieldRegion(id, { colors: [style.colors[0]!, event.target.value] })} /></label> : null}
            <label>{copy.fieldRegionPatternScale(regionName)}<input aria-label={copy.fieldRegionPatternScale(regionName)} type="number" min="0.25" max="4" step="0.05" value={style.patternScale} onChange={(event) => updateFieldRegion(id, { patternScale: Number(event.target.value) })} /></label>
          </fieldset>;
        })}
      </fieldset> : null}
      <fieldset><legend>{copy.fieldOrnaments}</legend>
        <label>{copy.fieldOrnament}<select aria-label={copy.fieldOrnament} value={fieldOrnamentKind} onChange={(event) => setFieldOrnamentKind(event.target.value as FieldOrnamentKind)}>{fieldOrnamentKinds.map((kind) => <option key={kind} value={kind}>{copy.fieldOrnamentKinds[kind]}</option>)}</select></label>
        <button type="button" onClick={addFieldOrnament}>{copy.addFieldOrnament}</button>
        {(shield.field.ornaments ?? []).map((ornament, ornamentIndex, ornaments) => <fieldset key={ornament.id}><legend>{copy.fieldOrnamentItem(ornament.kind)}</legend>
          <label>{copy.fieldOrnamentColour}<input aria-label={`${copy.fieldOrnamentColour} ${ornament.id}`} type="color" value={ornament.color} onChange={(event) => updateFieldOrnament(ornament.id, { color: event.target.value, ...(ornament.colors ? { colors: [event.target.value, ...ornament.colors.slice(1)] } : {}) })} /></label>
          {ornament.colors?.map((color, colorIndex) => <fieldset key={`${ornament.id}-colour-${colorIndex}`}><legend>{copy.fieldOrnamentPaletteColour(colorIndex)}</legend>
            {colorIndex > 0 ? <label>{copy.fieldOrnamentPaletteColour(colorIndex)}<input aria-label={`${copy.fieldOrnamentPaletteColour(colorIndex)} ${ornament.id}`} type="color" value={color} onChange={(event) => updateFieldOrnament(ornament.id, { colors: ornament.colors?.map((candidate, candidateIndex) => candidateIndex === colorIndex ? event.target.value : candidate) })} /></label> : null}
            <label>{copy.fieldOrnamentColourAmplitude(colorIndex)}<input aria-label={`${copy.fieldOrnamentColourAmplitude(colorIndex)} ${ornament.id}`} type="number" min="0.1" max="100" step="0.1" value={ornament.colorAmplitudes?.[colorIndex] ?? 1} onChange={(event) => updateFieldOrnament(ornament.id, { colorAmplitudes: ornament.colorAmplitudes?.map((amplitude, amplitudeIndex) => amplitudeIndex === colorIndex ? Number(event.target.value) : amplitude) })} /></label>
            {colorIndex > 0 ? <button type="button" aria-label={`${copy.removeFieldOrnamentColour(colorIndex)} ${ornament.id}`} onClick={() => {
              const reducedColors = ornament.colors?.filter((_, candidateIndex) => candidateIndex !== colorIndex) ?? [];
              const reducedAmplitudes = ornament.colorAmplitudes?.filter((_, candidateIndex) => candidateIndex !== colorIndex) ?? [];
              updateFieldOrnament(ornament.id, reducedColors.length === 1
                ? { color: reducedColors[0]!, colors: undefined, colorAmplitudes: undefined }
                : { colors: reducedColors, colorAmplitudes: reducedAmplitudes });
            }}>{copy.removeFieldOrnamentColour(colorIndex)}</button> : null}
          </fieldset>)}
          {(ornament.colors?.length ?? 1) < 4 ? <button type="button" onClick={() => {
            const colors = ornament.colors ?? [ornament.color];
            const colorAmplitudes = ornament.colorAmplitudes ?? [1];
            updateFieldOrnament(ornament.id, { colors: [...colors, '#F5E6A1'], colorAmplitudes: [...colorAmplitudes, 1] });
          }}>{copy.addFieldOrnamentColour}</button> : null}
          <label>{copy.fieldOrnamentX}<input aria-label={`${copy.fieldOrnamentX} ${ornament.id}`} type="number" value={ornament.x} onChange={(event) => updateFieldOrnament(ornament.id, { x: Number(event.target.value) })} /></label>
          <label>{copy.fieldOrnamentY}<input aria-label={`${copy.fieldOrnamentY} ${ornament.id}`} type="number" value={ornament.y} onChange={(event) => updateFieldOrnament(ornament.id, { y: Number(event.target.value) })} /></label>
          <label>{copy.fieldOrnamentScale}<input aria-label={`${copy.fieldOrnamentScale} ${ornament.id}`} type="number" min="0.1" max="5" step="0.1" value={ornament.scale} onChange={(event) => updateFieldOrnament(ornament.id, { scale: Number(event.target.value) })} /></label>
          {fieldOrnamentWidthKinds.includes(ornament.kind) ? <label>{copy.fieldOrnamentWidth}<input aria-label={`${copy.fieldOrnamentWidth} ${ornament.id}`} type="number" min="5" max="100" value={ornament.width ?? defaultFieldOrnamentWidth(ornament.kind)} onChange={(event) => updateFieldOrnament(ornament.id, { width: Number(event.target.value) })} /></label> : null}
          {fieldOrnamentHeightKinds.includes(ornament.kind) ? <label>{copy.fieldOrnamentHeight}<input aria-label={`${copy.fieldOrnamentHeight} ${ornament.id}`} type="number" min="5" max="110" value={ornament.height ?? defaultFieldOrnamentHeight(ornament.kind)} onChange={(event) => updateFieldOrnament(ornament.id, { height: Number(event.target.value) })} /></label> : null}
          {fieldOrnamentThicknessKinds.includes(ornament.kind) ? <label>{copy.fieldOrnamentThickness}<input aria-label={`${copy.fieldOrnamentThickness} ${ornament.id}`} type="number" min="1" max="50" value={ornament.thickness ?? defaultFieldOrnamentThickness(ornament.kind)} onChange={(event) => updateFieldOrnament(ornament.id, { thickness: Number(event.target.value) })} /></label> : null}
          {fieldOrnamentReversibleKinds.includes(ornament.kind) ? <label><input aria-label={`${copy.fieldOrnamentReversed} ${ornament.id}`} type="checkbox" checked={ornament.reversed ?? false} onChange={(event) => updateFieldOrnament(ornament.id, { reversed: event.target.checked })} />{copy.fieldOrnamentReversed}</label> : null}
          {ornament.kind === 'canton' ? <label><input aria-label={`${copy.fieldOrnamentKeepAspectRatio} ${ornament.id}`} type="checkbox" checked={ornament.keepAspectRatio ?? false} onChange={(event) => updateFieldOrnament(ornament.id, { keepAspectRatio: event.target.checked })} />{copy.fieldOrnamentKeepAspectRatio}</label> : null}
          {ornament.kind === 'mountain' ? <label>{copy.fieldOrnamentOverlap}<input aria-label={`${copy.fieldOrnamentOverlap} ${ornament.id}`} type="number" min="0" max="100" value={ornament.overlap ?? 0} onChange={(event) => updateFieldOrnament(ornament.id, { overlap: Number(event.target.value) })} /></label> : null}
          {ornament.kind === 'cross' ? <>
            <label>{copy.crossHorizontalThickness}<input aria-label={`${copy.crossHorizontalThickness} ${ornament.id}`} type="number" min="1" max="50" value={ornament.crossHorizontalThickness ?? 32} onChange={(event) => updateFieldOrnament(ornament.id, { crossHorizontalThickness: Number(event.target.value) })} /></label>
            <label>{copy.crossVerticalThickness}<input aria-label={`${copy.crossVerticalThickness} ${ornament.id}`} type="number" min="1" max="50" value={ornament.crossVerticalThickness ?? 22} onChange={(event) => updateFieldOrnament(ornament.id, { crossVerticalThickness: Number(event.target.value) })} /></label>
            <label>{copy.crossCentreX}<input aria-label={`${copy.crossCentreX} ${ornament.id}`} type="number" min="0" max="100" value={ornament.crossCenterX ?? 50} onChange={(event) => updateFieldOrnament(ornament.id, { crossCenterX: Number(event.target.value) })} /></label>
            <label>{copy.crossCentreY}<input aria-label={`${copy.crossCentreY} ${ornament.id}`} type="number" min="0" max="110" value={ornament.crossCenterY ?? 55} onChange={(event) => updateFieldOrnament(ornament.id, { crossCenterY: Number(event.target.value) })} /></label>
          </> : null}
          {ornament.kind === 'saltire' ? <>
            <label>{copy.saltireCentreX}<input aria-label={`${copy.saltireCentreX} ${ornament.id}`} type="number" min="0" max="100" value={ornament.saltireCenterX ?? 50} onChange={(event) => updateFieldOrnament(ornament.id, { saltireCenterX: Number(event.target.value) })} /></label>
            <label>{copy.saltireCentreY}<input aria-label={`${copy.saltireCentreY} ${ornament.id}`} type="number" min="0" max="110" value={ornament.saltireCenterY ?? 55} onChange={(event) => updateFieldOrnament(ornament.id, { saltireCenterY: Number(event.target.value) })} /></label>
          </> : null}
          {ornament.kind === 'chevron' ? <>
            <label>{copy.chevronPeakHeight}<input aria-label={`${copy.chevronPeakHeight} ${ornament.id}`} type="number" min="5" max="75" value={ornament.chevronPeakHeight ?? 35} onChange={(event) => updateFieldOrnament(ornament.id, { chevronPeakHeight: Number(event.target.value) })} /></label>
            <label>{copy.chevronVerticalPosition}<input aria-label={`${copy.chevronVerticalPosition} ${ornament.id}`} type="number" min="0" max="110" value={ornament.chevronVerticalPosition ?? 55} onChange={(event) => updateFieldOrnament(ornament.id, { chevronVerticalPosition: Number(event.target.value) })} /></label>
          </> : null}
          {ornament.kind === 'pall' ? <>
            <label>{copy.pallForkX}<input aria-label={`${copy.pallForkX} ${ornament.id}`} type="number" min="11" max="89" value={ornament.pallForkX ?? 50} onChange={(event) => updateFieldOrnament(ornament.id, { pallForkX: Number(event.target.value) })} /></label>
            <label>{copy.pallForkY}<input aria-label={`${copy.pallForkY} ${ornament.id}`} type="number" min="10" max="71" value={ornament.pallForkY ?? 50} onChange={(event) => updateFieldOrnament(ornament.id, { pallForkY: Number(event.target.value) })} /></label>
          </> : null}
          {ornament.kind === 'mountain' ? <>
            <label>{copy.mountainPeakCount}<input aria-label={`${copy.mountainPeakCount} ${ornament.id}`} type="number" min="1" max="8" step="1" value={ornament.mountainPeakCount ?? 2} onChange={(event) => updateFieldOrnament(ornament.id, { mountainPeakCount: Number(event.target.value) })} /></label>
            <label>{copy.mountainSteepness}<input aria-label={`${copy.mountainSteepness} ${ornament.id}`} type="number" min="0.1" max="1" step="0.01" value={ornament.mountainSteepness ?? 0.72} onChange={(event) => updateFieldOrnament(ornament.id, { mountainSteepness: Number(event.target.value) })} /></label>
          </> : null}
          {ornament.kind === 'bendlet' ? <label><input aria-label={`${copy.fieldOrnamentBendSinister} ${ornament.id}`} type="checkbox" checked={ornament.bendSinister ?? false} onChange={(event) => updateFieldOrnament(ornament.id, { bendSinister: event.target.checked })} />{copy.fieldOrnamentBendSinister}</label> : null}
          {fieldOrnamentEdgeKinds.includes(ornament.kind) ? <fieldset><legend>{copy.fieldOrnamentEdge}</legend>
            <label>{copy.fieldOrnamentEdge}<select aria-label={`${copy.fieldOrnamentEdge} ${ornament.id}`} value={ornament.edge?.style ?? 'straight'} onChange={(event) => updateFieldOrnament(ornament.id, { edge: { ...(ornament.edge ?? { frequency: 3, amplitude: 6 }), style: event.target.value as FieldDivisionLine['style'] } })}>{fieldDivisionLineStyles.map((style) => <option key={style} value={style}>{copy.fieldDivisionLineStyles[style]}</option>)}</select></label>
            <label>{copy.divisionLineFrequency}<input aria-label={`${copy.divisionLineFrequency} ${ornament.id}`} type="number" min="1" max="30" value={ornament.edge?.frequency ?? 3} onChange={(event) => updateFieldOrnament(ornament.id, { edge: { ...(ornament.edge ?? { style: 'straight', amplitude: 6 }), frequency: Number(event.target.value) } })} /></label>
            <label>{copy.divisionLineAmplitude}<input aria-label={`${copy.divisionLineAmplitude} ${ornament.id}`} type="number" min="1" max="20" value={ornament.edge?.amplitude ?? 6} onChange={(event) => updateFieldOrnament(ornament.id, { edge: { ...(ornament.edge ?? { style: 'straight', frequency: 3 }), amplitude: Number(event.target.value) } })} /></label>
          </fieldset> : null}
          <button type="button" aria-label={copy.moveFieldOrnamentBackward(ornament.id)} disabled={ornamentIndex === 0} onClick={() => moveFieldOrnament(ornament.id, -1)}>{copy.moveFieldOrnamentBackwardLabel}</button>
          <button type="button" aria-label={copy.moveFieldOrnamentForward(ornament.id)} disabled={ornamentIndex === ornaments.length - 1} onClick={() => moveFieldOrnament(ornament.id, 1)}>{copy.moveFieldOrnamentForwardLabel}</button>
          <button type="button" onClick={() => updateField({ ornaments: (shield.field.ornaments ?? []).filter((candidate) => candidate.id !== ornament.id) })}>{copy.removeFieldOrnament}</button>
        </fieldset>)}
      </fieldset>
      <label>
        {copy.shieldBorderColour}
        <input aria-label={copy.shieldBorderColour} type="color" value={outline.color} onChange={(event) => updateField({ outline: { ...outline, color: event.target.value } })} />
      </label>
      <label>
        {copy.shieldBorderWidth}
        <input aria-label={copy.shieldBorderWidth} min="0.25" max="10" step="0.25" type="number" value={outline.width} onChange={(event) => updateField({ outline: { ...outline, width: Number(event.target.value) } })} />
      </label>
      <label>
        <input aria-label={copy.showShieldBorder} checked={outline.visible} type="checkbox" onChange={(event) => updateField({ outline: { ...outline, visible: event.target.checked } })} />
        {copy.showShieldBorder}
      </label>
    </section>
  );
}
