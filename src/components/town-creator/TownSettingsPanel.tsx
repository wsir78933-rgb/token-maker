'use client';

import { useId, useState } from 'react';

import type { SiteLocale } from '@/lib/site-locale';
import {
  TOWN_DEFAULT_CANVAS_HEIGHT,
  TOWN_MAX_CANVAS_SIZE,
  TOWN_MIN_CANVAS_SIZE,
} from '@/lib/town-creator/document';
import type { TownDocument, TownLayerId } from '@/lib/town-creator/types';

import styles from './TownCreatorWorkbench.module.css';

const LAYER_ORDER: readonly TownLayerId[] = ['lower', 'middle', 'upper'];
const DEFAULT_CANVAS_HEIGHT = TOWN_DEFAULT_CANVAS_HEIGHT;

const COPY = {
  en: {
    heading: 'Layers & canvas',
    layers: 'Layers',
    activeLayer: 'Editing layer',
    visible: 'Visible',
    lower: 'Lower',
    middle: 'Middle',
    upper: 'Upper',
    canvas: 'Canvas',
    width: 'Width',
    height: 'Height',
    applySize: 'Apply size',
    fitWidth: 'Fit display width',
    restoreHeight: 'Restore height',
    snap: 'Snap to 5 px',
    resize: 'Resize handles',
    background: 'Background',
    color: 'Color',
    imageUrl: 'Background image URL',
    loadBackground: 'Load background',
    clearBackground: 'Clear image',
    clear: 'Clear objects',
    clearCurrent: 'Clear current layer',
    clearAll: 'Clear all layers',
    confirmCurrent: 'Confirm clear current layer',
    confirmAll: 'Confirm clear all objects',
    cancel: 'Cancel',
    clearHint: 'Only objects are cleared; canvas settings stay unchanged.',
  },
  zh: {
    heading: '图层与画布',
    layers: '图层',
    activeLayer: '编辑图层',
    visible: '可见',
    lower: '下层',
    middle: '中层',
    upper: '上层',
    canvas: '画布',
    width: '宽度',
    height: '高度',
    applySize: '应用尺寸',
    fitWidth: '适配显示宽度',
    restoreHeight: '恢复高度',
    snap: '吸附到 5 px',
    resize: '显示调整手柄',
    background: '背景',
    color: '颜色',
    imageUrl: '背景图片 URL',
    loadBackground: '加载背景',
    clearBackground: '清除图片',
    clear: '清除对象',
    clearCurrent: '清除当前图层',
    clearAll: '清除全部图层',
    confirmCurrent: '确认清除当前图层',
    confirmAll: '确认清除全部对象',
    cancel: '取消',
    clearHint: '只清除对象，画布设置会保留。',
  },
} as const;

type TownSettingsPanelProps = {
  readonly locale: SiteLocale;
  readonly document: TownDocument;
  readonly snapEnabled: boolean;
  readonly resizeEnabled: boolean;
  readonly onSnapEnabledChange: (enabled: boolean) => void;
  readonly onResizeEnabledChange: (enabled: boolean) => void;
  readonly onActiveLayerChange: (layerId: TownLayerId) => void;
  readonly onLayerVisibilityChange: (layerId: TownLayerId, visible: boolean) => void;
  readonly onResizeCanvas: (width: number, height: number) => void;
  readonly onWidthFit: () => void;
  readonly onRestoreHeight: () => void;
  readonly onBackgroundApply: (color: string, imageUrl: string) => void;
  readonly onClearLayer: () => void;
  readonly onClearAll: () => void;
  readonly onError: (message: string) => void;
};

function requireCanvasDimension(value: string, label: string): number {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be a number from ${TOWN_MIN_CANVAS_SIZE} to ${TOWN_MAX_CANVAS_SIZE}. Received an empty value.`);
  }

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < TOWN_MIN_CANVAS_SIZE || numberValue > TOWN_MAX_CANVAS_SIZE) {
    throw new Error(
      `${label} must be from ${TOWN_MIN_CANVAS_SIZE} to ${TOWN_MAX_CANVAS_SIZE}. Received ${JSON.stringify(value)}.`,
    );
  }

  return Math.round(numberValue);
}

export function TownSettingsPanel({
  locale,
  document,
  snapEnabled,
  resizeEnabled,
  onSnapEnabledChange,
  onResizeEnabledChange,
  onActiveLayerChange,
  onLayerVisibilityChange,
  onResizeCanvas,
  onWidthFit,
  onRestoreHeight,
  onBackgroundApply,
  onClearLayer,
  onClearAll,
  onError,
}: TownSettingsPanelProps) {
  const copy = COPY[locale];
  const widthId = useId();
  const heightId = useId();
  const colorId = useId();
  const imageUrlId = useId();
  const [drafts, setDrafts] = useState({
    widthExternal: document.width,
    width: String(document.width),
    heightExternal: document.height,
    height: String(document.height),
    colorExternal: document.backgroundColor,
    color: document.backgroundColor,
    imageUrlExternal: document.backgroundImageUrl,
    imageUrl: document.backgroundImageUrl,
  });
  const [confirmAction, setConfirmAction] = useState<'current' | 'all' | null>(null);

  const widthDraft = drafts.widthExternal === document.width ? drafts.width : String(document.width);
  const heightDraft = drafts.heightExternal === document.height ? drafts.height : String(document.height);
  const backgroundColorDraft = drafts.colorExternal === document.backgroundColor ? drafts.color : document.backgroundColor;
  const backgroundUrlDraft = drafts.imageUrlExternal === document.backgroundImageUrl ? drafts.imageUrl : document.backgroundImageUrl;

  const applyCanvasSize = () => {
    try {
      onResizeCanvas(
        requireCanvasDimension(widthDraft, copy.width),
        requireCanvasDimension(heightDraft, copy.height),
      );
    } catch (reason) {
      if (reason instanceof Error) {
        onError(reason.message);
        return;
      }

      throw reason;
    }
  };

  const applyBackground = () => {
    if (backgroundColorDraft.trim().length === 0) {
      onError(`${copy.color} must be a non-empty value.`);
      return;
    }

    onBackgroundApply(backgroundColorDraft, backgroundUrlDraft.trim());
  };

  const confirmClear = () => {
    if (confirmAction === 'current') {
      onClearLayer();
    } else if (confirmAction === 'all') {
      onClearAll();
    }
    setConfirmAction(null);
  };

  return (
    <section className={styles.settingsPanel} aria-labelledby="town-settings-heading">
      <div className={styles.panelHeading}>
        <div>
          <p className={styles.eyebrow}>03</p>
          <h2 id="town-settings-heading">{copy.heading}</h2>
        </div>
      </div>

      <div className={styles.fieldSection}>
        <h3>{copy.layers}</h3>
        <label className={styles.fieldLabel} htmlFor="town-active-layer">{copy.activeLayer}</label>
        <select
          id="town-active-layer"
          className={styles.textInput}
          value={document.activeLayer}
          onChange={(event) => onActiveLayerChange(event.target.value as TownLayerId)}
        >
          {LAYER_ORDER.map((layerId) => (
            <option value={layerId} key={layerId}>{copy[layerId]}</option>
          ))}
        </select>
        <div className={styles.layerVisibilityList}>
          {LAYER_ORDER.map((layerId) => {
            const layer = document.layers.find((candidate) => candidate.id === layerId);
            if (!layer) {
              throw new Error(`Town settings cannot find layer ${JSON.stringify(layerId)}.`);
            }
            return (
              <label className={styles.toggleRow} key={layerId}>
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={(event) => onLayerVisibilityChange(layerId, event.target.checked)}
                />
                <span>{copy[layerId]}</span>
                <span className={styles.toggleCaption}>{copy.visible}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className={styles.fieldSection}>
        <h3>{copy.canvas}</h3>
        <div className={styles.compactFieldGrid}>
          <label className={styles.compactField} htmlFor={widthId}>
            <span>{copy.width}</span>
            <input
              id={widthId}
              className={styles.textInput}
              type="number"
              min={TOWN_MIN_CANVAS_SIZE}
              max={TOWN_MAX_CANVAS_SIZE}
              value={widthDraft}
              onChange={(event) => setDrafts((current) => ({
                ...current,
                widthExternal: document.width,
                width: event.target.value,
              }))}
            />
          </label>
          <label className={styles.compactField} htmlFor={heightId}>
            <span>{copy.height}</span>
            <input
              id={heightId}
              className={styles.textInput}
              type="number"
              min={TOWN_MIN_CANVAS_SIZE}
              max={TOWN_MAX_CANVAS_SIZE}
              value={heightDraft}
              onChange={(event) => setDrafts((current) => ({
                ...current,
                heightExternal: document.height,
                height: event.target.value,
              }))}
            />
          </label>
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.secondaryButton} type="button" onClick={applyCanvasSize}>{copy.applySize}</button>
          <button className={styles.tertiaryButton} type="button" onClick={onWidthFit}>{copy.fitWidth}</button>
          <button className={styles.tertiaryButton} type="button" onClick={() => {
            setDrafts((current) => ({
              ...current,
              heightExternal: document.height,
              height: String(DEFAULT_CANVAS_HEIGHT),
            }));
            onRestoreHeight();
          }}>{copy.restoreHeight}</button>
        </div>
        <label className={styles.toggleRow}>
          <input type="checkbox" checked={snapEnabled} onChange={(event) => onSnapEnabledChange(event.target.checked)} />
          <span>{copy.snap}</span>
        </label>
        <label className={styles.toggleRow}>
          <input type="checkbox" checked={resizeEnabled} onChange={(event) => onResizeEnabledChange(event.target.checked)} />
          <span>{copy.resize}</span>
        </label>
      </div>

      <div className={styles.fieldSection}>
        <h3>{copy.background}</h3>
        <label className={styles.fieldLabel} htmlFor={colorId}>{copy.color}</label>
        <input
          id={colorId}
          className={styles.textInput}
          type="text"
          value={backgroundColorDraft}
          onChange={(event) => setDrafts((current) => ({
            ...current,
            colorExternal: document.backgroundColor,
            color: event.target.value,
          }))}
        />
        <label className={styles.fieldLabel} htmlFor={imageUrlId}>{copy.imageUrl}</label>
        <input
          id={imageUrlId}
          className={styles.textInput}
          type="url"
          value={backgroundUrlDraft}
          onChange={(event) => setDrafts((current) => ({
            ...current,
            imageUrlExternal: document.backgroundImageUrl,
            imageUrl: event.target.value,
          }))}
          placeholder="https://…"
        />
        <div className={styles.buttonRow}>
          <button className={styles.secondaryButton} type="button" onClick={applyBackground}>{copy.loadBackground}</button>
          <button className={styles.tertiaryButton} type="button" onClick={() => {
            setDrafts((current) => ({
              ...current,
              imageUrlExternal: document.backgroundImageUrl,
              imageUrl: '',
            }));
            onBackgroundApply(backgroundColorDraft, '');
          }}>{copy.clearBackground}</button>
        </div>
      </div>

      <div className={styles.fieldSection}>
        <h3>{copy.clear}</h3>
        <p className={styles.fieldHint}>{copy.clearHint}</p>
        {confirmAction ? (
          <div className={styles.confirmationBox} role="alert">
            <strong>{confirmAction === 'current' ? copy.confirmCurrent : copy.confirmAll}</strong>
            <div className={styles.buttonRow}>
              <button className={styles.dangerButton} type="button" onClick={confirmClear}>
                {confirmAction === 'current' ? copy.confirmCurrent : copy.confirmAll}
              </button>
              <button className={styles.tertiaryButton} type="button" onClick={() => setConfirmAction(null)}>
                {copy.cancel}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.buttonRow}>
            <button className={styles.dangerButton} type="button" onClick={() => setConfirmAction('current')}>
              {copy.clearCurrent}
            </button>
            <button className={styles.dangerOutlineButton} type="button" onClick={() => setConfirmAction('all')}>
              {copy.clearAll}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
