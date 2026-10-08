'use client';

import { useEffect, useId, useState } from 'react';

import type { SiteLocale } from '@/lib/site-locale';
import type {
  TownDocument,
  TownLayerId,
  TownObject,
  TownObjectPatch,
  TownResizeMode,
} from '@/lib/town-creator/types';

import styles from './TownCreatorWorkbench.module.css';

const LAYER_ORDER: readonly TownLayerId[] = ['lower', 'middle', 'upper'];

const COPY = {
  en: {
    heading: 'Object',
    none: 'Select an object on the map to edit it.',
    position: 'Position and size',
    x: 'X',
    y: 'Y',
    width: 'Width',
    height: 'Height',
    rotation: 'Angle',
    applyRotation: 'Apply absolute angle',
    copyTarget: 'Copy to layer',
    copyHint: 'Target selection is independent from the editing layer.',
    resizeHint: 'Regular and connector assets keep their ratio; line height stays at native thickness.',
    copy: 'Copy object',
    delete: 'Delete object',
    deleteShortcutTitle: 'Delete or Backspace removes the selected object, and does not run while typing.',
    currentLayer: 'Current layer',
    layers: { lower: 'Lower', middle: 'Middle', upper: 'Upper' },
    copied: 'Copy target',
  },
  zh: {
    heading: '对象',
    none: '在地图上选择对象后可编辑。',
    position: '位置与尺寸',
    x: 'X',
    y: 'Y',
    width: '宽度',
    height: '高度',
    rotation: '角度',
    applyRotation: '应用绝对角度',
    copyTarget: '复制到图层',
    copyHint: '复制目标独立于当前编辑图层。',
    resizeHint: '普通和连接素材保持比例；线型素材保持原生厚度。',
    copy: '复制对象',
    delete: '删除对象',
    deleteShortcutTitle: 'Delete 或 Backspace 删除选中对象，正在输入时不会触发。',
    currentLayer: '当前图层',
    layers: { lower: '下层', middle: '中层', upper: '上层' },
    copied: '复制目标',
  },
} as const;

type TownObjectPanelProps = {
  readonly locale: SiteLocale;
  readonly document: TownDocument;
  readonly selectedObjectId: string | null;
  readonly selectedObjectLayerId: TownLayerId | null;
  readonly selectedAssetName: string | null;
  readonly selectedResizeMode: TownResizeMode | null;
  readonly selectedAssetWidth: number | null;
  readonly selectedAssetHeight: number | null;
  readonly copyTarget: TownLayerId;
  readonly onCopyTargetChange: (layerId: TownLayerId) => void;
  readonly onCopy: (layerId: TownLayerId) => void;
  readonly onDelete: () => void;
  readonly onUpdateObject: (objectId: string, patch: TownObjectPatch) => void;
  readonly onError: (message: string) => void;
};

function findTownObject(document: TownDocument, objectId: string | null): TownObject | null {
  if (!objectId) {
    return null;
  }

  for (const layer of document.layers) {
    const object = layer.objects.find((candidate) => candidate.id === objectId);
    if (object) {
      return object;
    }
  }

  return null;
}

function requireNumberDraft(value: string, label: string): number {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be a finite number. Received an empty value.`);
  }

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    throw new Error(`${label} must be a finite number. Received ${JSON.stringify(value)}.`);
  }

  return numberValue;
}

function ObjectNumberField({
  label,
  value,
  onCommit,
  onError,
  commitLabel,
  disabled = false,
}: {
  readonly label: string;
  readonly value: number;
  readonly onCommit: (value: number) => void;
  readonly onError: (message: string) => void;
  readonly commitLabel?: string;
  readonly disabled?: boolean;
}) {
  const inputId = useId();
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    try {
      onCommit(requireNumberDraft(draft, label));
    } catch (reason) {
      if (reason instanceof Error) {
        onError(reason.message);
        return;
      }

      throw reason;
    }
  };

  return (
    <div className={styles.compactField}>
      <label htmlFor={inputId}><span>{label}</span></label>
      <input
        id={inputId}
        className={styles.textInput}
        type="number"
        inputMode="decimal"
        value={draft}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitDraft();
          }
        }}
      />
      {commitLabel ? <button className={styles.tertiaryButton} type="button" onClick={commitDraft}>{commitLabel}</button> : null}
    </div>
  );
}

export function TownObjectPanel({
  locale,
  document,
  selectedObjectId,
  selectedObjectLayerId,
  selectedAssetName,
  selectedResizeMode,
  selectedAssetWidth,
  selectedAssetHeight,
  copyTarget,
  onCopyTargetChange,
  onCopy,
  onDelete,
  onUpdateObject,
  onError,
}: TownObjectPanelProps) {
  const copy = COPY[locale];
  const selectedObject = findTownObject(document, selectedObjectId);

  const updateSelectedWidth = (value: number): void => {
    if (!selectedObject) return;
    const keepsRatio = selectedResizeMode === 'regular' || selectedResizeMode === 'connector';
    const nextHeight = keepsRatio && selectedAssetWidth && selectedAssetHeight
      ? value * selectedAssetHeight / selectedAssetWidth
      : selectedObject.height;
    onUpdateObject(selectedObject.id, { width: value, height: nextHeight });
  };

  const updateSelectedHeight = (value: number): void => {
    if (!selectedObject) return;
    const keepsRatio = selectedResizeMode === 'regular' || selectedResizeMode === 'connector';
    const nextWidth = keepsRatio && selectedAssetWidth && selectedAssetHeight
      ? value * selectedAssetWidth / selectedAssetHeight
      : selectedObject.width;
    onUpdateObject(selectedObject.id, { height: value, width: nextWidth });
  };

  return (
    <section className={styles.objectPanel} aria-labelledby="town-object-heading">
      <div className={styles.panelHeading}>
        <div>
          <p className={styles.eyebrow}>02</p>
          <h2 id="town-object-heading">{copy.heading}</h2>
        </div>
        {selectedObject ? <span className={styles.statusDot} aria-label={copy.currentLayer} /> : null}
      </div>

      {!selectedObject ? <p className={styles.emptyState}>{copy.none}</p> : (
        <>
          <div className={styles.selectedObjectCard}>
            <strong>{selectedAssetName ?? selectedObject.assetId}</strong>
            <span>{selectedObjectLayerId ? copy.layers[selectedObjectLayerId] : copy.currentLayer}</span>
          </div>

          <div className={styles.fieldSection}>
            <h3>{copy.position}</h3>
            <div className={styles.compactFieldGrid}>
              <ObjectNumberField
                label={copy.x}
                value={selectedObject.x}
                onCommit={(value) => onUpdateObject(selectedObject.id, { x: value })}
                onError={onError}
              />
              <ObjectNumberField
                label={copy.y}
                value={selectedObject.y}
                onCommit={(value) => onUpdateObject(selectedObject.id, { y: value })}
                onError={onError}
              />
              <ObjectNumberField
                label={copy.width}
                value={selectedObject.width}
                onCommit={updateSelectedWidth}
                onError={onError}
              />
              <ObjectNumberField
                label={copy.height}
                value={selectedObject.height}
                onCommit={updateSelectedHeight}
                onError={onError}
                disabled={selectedResizeMode === 'line'}
              />
            </div>
            <p className={styles.fieldHint}>{copy.resizeHint}</p>
          </div>

          <div className={styles.fieldSection}>
              <ObjectNumberField
                label={copy.rotation}
                value={selectedObject.rotationDegrees}
                onCommit={(value) => onUpdateObject(selectedObject.id, { rotationDegrees: value })}
                onError={onError}
                commitLabel={copy.applyRotation}
              />
          </div>

          <div className={styles.fieldSection}>
            <h3>{copy.copyTarget}</h3>
            <p className={styles.fieldHint}>{copy.copyHint}</p>
            <div className={styles.layerChoiceList} role="radiogroup" aria-label={copy.copied}>
              {LAYER_ORDER.map((layerId) => (
                <label className={styles.layerChoice} key={layerId}>
                  <input
                    type="radio"
                    name="town-copy-target"
                    value={layerId}
                    checked={copyTarget === layerId}
                    onChange={() => onCopyTargetChange(layerId)}
                  />
                  <span>{copy.layers[layerId]}</span>
                </label>
              ))}
            </div>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => onCopy(copyTarget)}
            >
              {copy.copy}
            </button>
          </div>

          <button
            className={styles.dangerButton}
            type="button"
            onClick={onDelete}
            aria-keyshortcuts="Delete Backspace"
            title={copy.deleteShortcutTitle}
          >
            {copy.delete}
          </button>
        </>
      )}
    </section>
  );
}
