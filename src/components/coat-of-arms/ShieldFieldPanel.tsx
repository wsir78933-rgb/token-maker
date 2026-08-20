'use client';

import { useState, type ChangeEvent } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { listShieldSilhouetteAssets, requireShieldSilhouetteAssetId } from '@/lib/coat-of-arms/assets';
import type { CoatProjectCommand } from '@/lib/coat-of-arms/commands';
import { useCoatProjectStore } from '@/lib/coat-of-arms/store';
import type { CoatLayer, CoatLocale, ShieldLayer } from '@/lib/coat-of-arms/types';
import { usePanelCommandError } from './usePanelCommandError';
import { createValidatedLocalUpload } from './UploadPanel';
import { getCoatWorkbenchCopy } from './workbench-copy';

const selectedEscutcheonFill = '#e11d2e';
const idleEscutcheonFill = '#64748b';

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
  if (ordinal < 1) {
    throw new Error(`Edited shield is not in the project: ${editedShield.id}`);
  }
  return { shield: editedShield, ordinal };
}

function addNewEscutcheon(
  layers: CoatLayer[],
  run: (command: CoatProjectCommand) => boolean,
  setSelectedLayerIds: (layerIds: string[]) => void,
): void {
  const existingShieldIds = new Set(listShieldLayers(layers).map((layer) => layer.id));
  if (!run({ type: 'add-layer', assetId: 'heater-shield' })) return;
  const addedShield = listShieldLayers(useCoatProjectStore.getState().project.layers)
    .filter((layer) => !existingShieldIds.has(layer.id))
    .at(-1);
  if (!addedShield) {
    throw new Error(`No new escutcheon layer was added for assetId: heater-shield`);
  }
  setSelectedLayerIds([addedShield.id]);
}

function pickEscutcheonShape(
  assetId: string,
  editedShield: ShieldLayer,
  run: (command: CoatProjectCommand) => boolean,
): void {
  const silhouetteAssetId = requireShieldSilhouetteAssetId(assetId);
  if (editedShield.customOutlinePath && !run({ type: 'set-custom-shield-outline', layerId: editedShield.id })) {
    return;
  }
  if (editedShield.customMaskUploadId && !run({ type: 'set-custom-shield-mask', layerId: editedShield.id })) {
    return;
  }
  run({ type: 'update-layer', layerId: editedShield.id, patch: { assetId: silhouetteAssetId } });
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
    <div className="grid grid-cols-4 gap-2">
      {listShieldSilhouetteAssets().map((asset) => {
        const localizedName = asset.name[locale];
        if (typeof localizedName !== 'string' || localizedName.length === 0) {
          throw new Error(`Missing escutcheon name for locale ${locale}: ${asset.id}`);
        }
        const isPressed = editedShield.assetId === asset.id
          && editedShield.customOutlinePath === undefined
          && editedShield.customMaskUploadId === undefined;
        return (
          <button
            key={asset.id}
            aria-label={selectEscutcheonShape(localizedName)}
            aria-pressed={isPressed}
            className={isPressed
              ? 'aspect-square rounded-md border-2 border-[#e11d2e] bg-[color:var(--coat-panel-raised)] p-1.5'
              : 'aspect-square rounded-md border-2 border-transparent bg-[color:var(--coat-panel-raised)] p-1.5'}
            type="button"
            onClick={() => onPickShape(asset.id)}
          >
            <svg aria-hidden="true" className="mx-auto h-full w-full" viewBox="0 0 100 110">
              <path d={asset.svgPath} fill={isPressed ? selectedEscutcheonFill : idleEscutcheonFill} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function EditingEscutcheonCard({
  editingEscutcheon,
  editingEscutcheonName,
  editingLabel,
}: {
  editingEscutcheon: string;
  editingEscutcheonName: string;
  editingLabel: string;
}) {
  return (
    <div
      aria-label={editingEscutcheon}
      className="flex items-center gap-3 rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-3 py-2.5"
    >
      <Pencil aria-hidden="true" className="h-4 w-4 shrink-0 text-[color:var(--coat-text)]" />
      <div className="min-w-0 leading-tight">
        <div className="text-xs text-[color:var(--coat-muted)]">{editingLabel}</div>
        <div className="text-sm font-medium text-[color:var(--coat-text)]">{editingEscutcheonName}</div>
      </div>
    </div>
  );
}

function CustomShieldUploads({
  heading,
  hint,
  uploadLabel,
  uploadStatus,
  onFileChange,
}: {
  heading: string;
  hint: string;
  uploadLabel: string;
  uploadStatus: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[color:var(--coat-text)]">{heading}</h3>
      <p className="text-xs text-[color:var(--coat-muted)]">{hint}</p>
      <input
        accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
        aria-label={uploadLabel}
        className="block w-full text-xs text-[color:var(--coat-text)]"
        type="file"
        onChange={onFileChange}
      />
      {uploadStatus ? <p role="status">{uploadStatus}</p> : null}
    </div>
  );
}

/** Changes the edited shield only through validated project commands. */
export function ShieldFieldPanel({ locale }: { locale: CoatLocale }) {
  const copy = getCoatWorkbenchCopy(locale).panels;
  const project = useCoatProjectStore((state) => state.project);
  const selectedLayerIds = useCoatProjectStore((state) => state.selectedLayerIds);
  const setSelectedLayerIds = useCoatProjectStore((state) => state.setSelectedLayerIds);
  const { error, reportError, run } = usePanelCommandError(locale);
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
    } catch (caught) {
      reportError(caught);
    }
  };

  return (
    <section aria-label={copy.shieldAndField} className="space-y-3">
      {error ? <p role="alert">{error}</p> : null}
      <EditingEscutcheonCard
        editingEscutcheon={copy.editingEscutcheon(editedEscutcheonOrdinal)}
        editingEscutcheonName={copy.editingEscutcheonName(editedEscutcheonOrdinal)}
        editingLabel={copy.editingLabel}
      />
      <button
        className="w-full rounded-md border border-[color:var(--coat-line)] bg-[color:var(--coat-panel-raised)] px-3 py-2.5 text-sm text-[color:var(--coat-text)]"
        type="button"
        onClick={() => {
          try {
            addNewEscutcheon(project.layers, run, setSelectedLayerIds);
          } catch (caught) {
            reportError(caught);
          }
        }}
      >{copy.addNewEscutcheon}</button>
      <details className="group" open>
        <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-medium text-[color:var(--coat-text)] [&::-webkit-details-marker]:hidden">
          <span>{copy.escutcheonLibrary}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="pt-1">
          <EscutcheonShapeThumbGrid
            locale={locale}
            editedShield={shield}
            selectEscutcheonShape={copy.selectEscutcheonShape}
            onPickShape={(assetId) => {
              try {
                pickEscutcheonShape(assetId, shield, run);
              } catch (caught) {
                reportError(caught);
              }
            }}
          />
        </div>
      </details>
      <CustomShieldUploads
        heading={copy.customShieldUploads}
        hint={copy.customShieldUploadHint}
        uploadLabel={copy.uploadCustomShieldMask}
        uploadStatus={customShieldUploadStatus}
        onFileChange={(event) => {
          void onCustomShieldMaskFileChange(event);
        }}
      />
    </section>
  );
}
