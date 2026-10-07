'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import type { PeriodicTableCopy } from '@/lib/periodic-table-creator/copy-types';
import {
  PERIODIC_TABLE_FIELDS,
  type PeriodicTableCell,
  type PeriodicTableDocument,
  type PeriodicTableField,
  type PeriodicTableScope,
  type PeriodicTableStyle,
} from '@/lib/periodic-table-creator/types';

import styles from './PeriodicTableInspector.module.css';

type InspectorTab = 'content' | 'appearance';
type SummaryValue<T> =
  | { kind: 'empty' }
  | { kind: 'mixed' }
  | { kind: 'uniform'; value: T };

export interface PeriodicTableInspectorProps {
  document: PeriodicTableDocument;
  activeCellId: string | null;
  copy: PeriodicTableCopy;
  activeTab: InspectorTab;
  scope: PeriodicTableScope;
  focusField: PeriodicTableField | null;
  mobile: boolean;
  onTabChange: (tab: InspectorTab) => void;
  onScopeChange: (scope: PeriodicTableScope) => void;
  onEditField: (cellId: string, field: PeriodicTableField, value: string) => void;
  onStyleChange: (patch: Partial<PeriodicTableStyle>) => void;
  onInvertBorders: () => void;
  onResetSelected: () => void;
  onClose: () => void;
}

interface ContentEditorProps {
  cell: PeriodicTableCell | undefined;
  multipleSelection: boolean;
  copy: PeriodicTableCopy;
  registerFieldRef: (field: PeriodicTableField, element: HTMLTextAreaElement | null) => void;
  onEditField: (cellId: string, field: PeriodicTableField, value: string) => void;
}

interface AppearanceEditorProps {
  affectedCells: PeriodicTableCell[];
  activeCellId: string | null;
  scope: PeriodicTableScope;
  selectedCount: number;
  copy: PeriodicTableCopy;
  onScopeChange: (scope: PeriodicTableScope) => void;
  onStyleChange: (patch: Partial<PeriodicTableStyle>) => void;
  onInvertBorders: () => void;
}

interface ColorSettingProps {
  label: string;
  valueSummary: SummaryValue<string>;
  transparentLabel?: string;
  disabled: boolean;
  inputId: string;
  onChange: (color: string) => void;
}

const INSPECTOR_TABS: readonly InspectorTab[] = ['content', 'appearance'];

function summarizeStyleValue<T extends keyof PeriodicTableStyle>(
  cells: readonly PeriodicTableCell[],
  styleField: T,
): SummaryValue<PeriodicTableStyle[T]> {
  if (cells.length === 0) return { kind: 'empty' };

  const firstValue = cells[0].style[styleField];
  if (cells.every((cell) => cell.style[styleField] === firstValue)) {
    return { kind: 'uniform', value: firstValue };
  }

  return { kind: 'mixed' };
}

function requireActiveCell(
  documentValue: PeriodicTableDocument,
  activeCellId: string | null,
): PeriodicTableCell | undefined {
  if (activeCellId === null) return undefined;

  const activeCell = documentValue.cells.find((cell) => cell.id === activeCellId);
  if (activeCell === undefined) {
    throw new Error(
      `Periodic table inspector activeCellId ${JSON.stringify(activeCellId)} does not exist in document cells.`,
    );
  }

  return activeCell;
}

function getColorInputValue(valueSummary: SummaryValue<string>): string {
  if (valueSummary.kind === 'uniform' && /^#[0-9a-f]{6}$/i.test(valueSummary.value)) {
    return valueSummary.value;
  }

  return '#ffffff';
}

function getColorDisplayLabel(
  valueSummary: SummaryValue<string>,
  transparentLabel?: string,
): string {
  if (valueSummary.kind === 'mixed') return '—';
  if (valueSummary.kind === 'empty') return '';
  if (valueSummary.value === 'transparent' && transparentLabel !== undefined) return transparentLabel;
  return valueSummary.value;
}

function getTabIndex(tab: InspectorTab): number {
  const tabIndex = INSPECTOR_TABS.indexOf(tab);
  if (tabIndex === -1) {
    throw new Error(`Periodic table inspector tab ${JSON.stringify(tab)} is not supported.`);
  }

  return tabIndex;
}

function getNextTab(currentTab: InspectorTab, key: string): InspectorTab | null {
  const currentIndex = getTabIndex(currentTab);
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return INSPECTOR_TABS[(currentIndex + 1) % INSPECTOR_TABS.length];
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return INSPECTOR_TABS[(currentIndex - 1 + INSPECTOR_TABS.length) % INSPECTOR_TABS.length];
  }
  if (key === 'Home') return INSPECTOR_TABS[0];
  if (key === 'End') return INSPECTOR_TABS[INSPECTOR_TABS.length - 1];
  return null;
}

function TextField({
  cell,
  field,
  label,
  disabled,
  registerFieldRef,
  onEditField,
}: {
  cell: PeriodicTableCell | undefined;
  field: PeriodicTableField;
  label: string;
  disabled: boolean;
  registerFieldRef: (field: PeriodicTableField, element: HTMLTextAreaElement | null) => void;
  onEditField: (cellId: string, field: PeriodicTableField, value: string) => void;
}) {
  const fieldId = useId();
  const fieldValue = cell?.text[field] ?? '';

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={fieldId} className={styles.fieldLabel}>{label}</label>
      <textarea
        id={fieldId}
        ref={(element) => { registerFieldRef(field, element); }}
        value={fieldValue}
        rows={2}
        disabled={disabled}
        aria-label={label}
        className={styles.textarea}
        onChange={(event) => {
          if (cell === undefined) {
            throw new Error(`Cannot edit periodic table field ${JSON.stringify(field)} without an active cell.`);
          }
          onEditField(cell.id, field, event.target.value);
        }}
      />
    </div>
  );
}

function ContentEditor({ cell, multipleSelection, copy, registerFieldRef, onEditField }: ContentEditorProps) {
  const disabled = cell === undefined || multipleSelection;

  return (
    <section className={styles.section} aria-labelledby="periodic-table-inspector-content-heading">
      <div className={styles.sectionHeading}>
        <h3 id="periodic-table-inspector-content-heading" className={styles.sectionTitle}>{copy.content}</h3>
      </div>
      {multipleSelection && <p className={styles.notice} role="status">{copy.editorMultiple}</p>}
      {!multipleSelection && cell === undefined && <p className={styles.notice} role="status">{copy.editorEmpty}</p>}
      <div className={styles.fieldGrid}>
        {PERIODIC_TABLE_FIELDS.map((field) => (
          <TextField
            key={field}
            cell={cell}
            field={field}
            label={copy.fields[field]}
            disabled={disabled}
            registerFieldRef={registerFieldRef}
            onEditField={onEditField}
          />
        ))}
      </div>
    </section>
  );
}

function ColorSetting({
  label,
  valueSummary,
  transparentLabel,
  disabled,
  inputId,
  onChange,
}: ColorSettingProps) {
  return (
    <div className={styles.settingGroup}>
      <label htmlFor={inputId} className={styles.fieldLabel}>{label}</label>
      <div className={styles.colorRow}>
        <input
          id={inputId}
          type="color"
          value={getColorInputValue(valueSummary)}
          disabled={disabled}
          aria-label={label}
          className={styles.colorInput}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={styles.valueLabel} title={getColorDisplayLabel(valueSummary, transparentLabel)}>
          {getColorDisplayLabel(valueSummary, transparentLabel)}
        </span>
      </div>
    </div>
  );
}

function ScopeSelector({
  scope,
  selectedCount,
  copy,
  onScopeChange,
}: {
  scope: PeriodicTableScope;
  selectedCount: number;
  copy: PeriodicTableCopy;
  onScopeChange: (scope: PeriodicTableScope) => void;
}) {
  const selectedScopeDisabled = selectedCount === 0;

  return (
    <div className={styles.settingGroup}>
      <span className={styles.fieldLabel}>{copy.scope}</span>
      <div className={styles.scopeGroup} role="group" aria-label={copy.scope}>
        <button
          type="button"
          className={styles.scopeButton}
          aria-pressed={scope === 'selected'}
          disabled={selectedScopeDisabled}
          onClick={() => onScopeChange('selected')}
        >
          <span>{copy.selectedScope}</span>
          <span aria-hidden="true"> ({selectedCount})</span>
        </button>
        <button
          type="button"
          className={styles.scopeButton}
          aria-pressed={scope === 'all'}
          onClick={() => onScopeChange('all')}
        >
          {copy.allScope}
        </button>
      </div>
      {selectedScopeDisabled && <p className={styles.inlineHint} role="status">{copy.noSelection}</p>}
    </div>
  );
}

function AppearanceEditor({
  affectedCells,
  activeCellId,
  scope,
  selectedCount,
  copy,
  onScopeChange,
  onStyleChange,
  onInvertBorders,
}: AppearanceEditorProps) {
  const controlId = useId();
  const controlsDisabled = affectedCells.length === 0;
  const backgroundSummary = summarizeStyleValue(affectedCells, 'backgroundColor');
  const textSummary = summarizeStyleValue(affectedCells, 'textColor');
  const borderColorSummary = summarizeStyleValue(affectedCells, 'borderColor');
  const borderVisibleSummary = summarizeStyleValue(affectedCells, 'borderVisible');
  const imageSummary = summarizeStyleValue(affectedCells, 'backgroundImageUrl');
  const affectedCellKey = affectedCells.map((cell) => cell.id).join('|');
  const imageSummaryKey = imageSummary.kind === 'uniform' ? imageSummary.value : imageSummary.kind;
  const imageTargetKey = `${activeCellId ?? 'none'}:${scope}:${affectedCellKey}:${imageSummaryKey}`;
  const [imageDraftState, setImageDraftState] = useState<{ targetKey: string; value: string }>({
    targetKey: imageTargetKey,
    value: imageSummary.kind === 'uniform' ? imageSummary.value : '',
  });
  const imageDraft = imageDraftState.targetKey === imageTargetKey
    ? imageDraftState.value
    : imageSummary.kind === 'uniform'
      ? imageSummary.value
      : '';

  function updateImageDraft(value: string) {
    setImageDraftState({ targetKey: imageTargetKey, value });
  }

  return (
    <section className={styles.section} aria-labelledby="periodic-table-inspector-appearance-heading">
      <div className={styles.sectionHeading}>
        <h3 id="periodic-table-inspector-appearance-heading" className={styles.sectionTitle}>{copy.appearance}</h3>
      </div>
      <ScopeSelector scope={scope} selectedCount={selectedCount} copy={copy} onScopeChange={onScopeChange} />
      <div className={styles.controlStack} aria-disabled={controlsDisabled}>
        <ColorSetting
          label={copy.backgroundColor}
          valueSummary={backgroundSummary}
          transparentLabel={copy.transparentBackground}
          disabled={controlsDisabled}
          inputId={`${controlId}-background`}
          onChange={(color) => onStyleChange({ backgroundColor: color })}
        />
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={controlsDisabled}
          onClick={() => onStyleChange({ backgroundColor: 'transparent' })}
        >
          {copy.transparentBackground}
        </button>
        <ColorSetting
          label={copy.textColor}
          valueSummary={textSummary}
          disabled={controlsDisabled}
          inputId={`${controlId}-text`}
          onChange={(color) => onStyleChange({ textColor: color })}
        />
        <ColorSetting
          label={copy.borderColor}
          valueSummary={borderColorSummary}
          disabled={controlsDisabled}
          inputId={`${controlId}-border`}
          onChange={(color) => onStyleChange({ borderColor: color })}
        />
        <div className={styles.settingGroup}>
          <span className={styles.fieldLabel}>{copy.borderState}</span>
          <p className={styles.inlineHint} role="status">
            {borderVisibleSummary.kind === 'mixed'
              ? copy.borderMixed
              : borderVisibleSummary.kind === 'uniform' && borderVisibleSummary.value
                ? copy.borderShown
                : copy.borderHidden}
          </p>
          <div className={styles.buttonGrid}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={controlsDisabled}
              onClick={() => onStyleChange({ borderVisible: true })}
            >
              {copy.showBorders}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={controlsDisabled}
              onClick={() => onStyleChange({ borderVisible: false })}
            >
              {copy.hideBorders}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={controlsDisabled}
              onClick={onInvertBorders}
            >
              {copy.invertBorders}
            </button>
          </div>
        </div>
        <div className={styles.settingGroup}>
          <label htmlFor={`${controlId}-image`} className={styles.fieldLabel}>{copy.imageUrl}</label>
          <input
            id={`${controlId}-image`}
            type="url"
            value={imageDraft}
            disabled={controlsDisabled}
            placeholder={imageSummary.kind === 'mixed' ? copy.borderMixed : undefined}
            className={styles.textInput}
            onChange={(event) => updateImageDraft(event.target.value)}
          />
          <div className={styles.buttonGrid}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={controlsDisabled}
              onClick={() => onStyleChange({ backgroundImageUrl: imageDraft })}
            >
              {copy.applyImage}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={controlsDisabled}
              onClick={() => { updateImageDraft(''); onStyleChange({ backgroundImageUrl: '' }); }}
            >
              {copy.removeImage}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PeriodicTableInspector({
  document: documentValue,
  activeCellId,
  copy,
  activeTab,
  scope,
  focusField,
  mobile,
  onTabChange,
  onScopeChange,
  onEditField,
  onStyleChange,
  onInvertBorders,
  onResetSelected,
  onClose,
}: PeriodicTableInspectorProps) {
  const inspectorId = useId();
  const fieldRefs = useRef<Partial<Record<PeriodicTableField, HTMLTextAreaElement | null>>>({});
  const tabButtons = useRef<Partial<Record<InspectorTab, HTMLButtonElement | null>>>({});
  const activeCell = requireActiveCell(documentValue, activeCellId);
  const selectedCells = useMemo(
    () => documentValue.cells.filter((cell) => cell.selected),
    [documentValue.cells],
  );
  const affectedCells = scope === 'all' ? documentValue.cells : selectedCells;

  function registerFieldRef(field: PeriodicTableField, element: HTMLTextAreaElement | null) {
    fieldRefs.current[field] = element;
  }

  useEffect(() => {
    if (!mobile || focusField === null || activeTab !== 'content') return;
    const textarea = fieldRefs.current[focusField];
    if (textarea === null || textarea === undefined) return;
    textarea.focus();
    if (typeof textarea.scrollIntoView === 'function') {
      textarea.scrollIntoView({ block: 'nearest' });
    }
  }, [activeCellId, activeTab, focusField, mobile]);

  function changeTabFromKeyboard(event: KeyboardEvent<HTMLButtonElement>, currentTab: InspectorTab) {
    const nextTab = getNextTab(currentTab, event.key);
    if (nextTab === null) return;
    event.preventDefault();
    onTabChange(nextTab);
    tabButtons.current[nextTab]?.focus();
  }

  return (
    <aside
      className={`${styles.inspector} ${mobile ? styles.mobile : styles.desktop}`}
      aria-label={copy.workspaceLabel}
      data-periodic-table-inspector="true"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{copy.workspaceLabel}</h2>
        {mobile && (
          <button type="button" className={styles.closeButton} onClick={onClose}>
            {copy.close}
          </button>
        )}
      </div>
      <div className={styles.tabList} role="tablist" aria-label={copy.workspaceLabel}>
        {INSPECTOR_TABS.map((tab) => {
          const tabId = `${inspectorId}-tab-${tab}`;
          const panelId = `${inspectorId}-panel-${tab}`;
          return (
            <button
              key={tab}
              id={tabId}
              ref={(element) => { tabButtons.current[tab] = element; }}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={panelId}
              tabIndex={activeTab === tab ? 0 : -1}
              className={styles.tabButton}
              onClick={() => onTabChange(tab)}
              onKeyDown={(event) => changeTabFromKeyboard(event, tab)}
            >
              {tab === 'content' ? copy.content : copy.appearance}
            </button>
          );
        })}
      </div>
      <div className={styles.scrollContent}>
        <div
          id={`${inspectorId}-panel-content`}
          role="tabpanel"
          aria-labelledby={`${inspectorId}-tab-content`}
          hidden={activeTab !== 'content'}
          tabIndex={0}
        >
          <ContentEditor
            cell={activeCell}
            multipleSelection={selectedCells.length > 1}
            copy={copy}
            registerFieldRef={registerFieldRef}
            onEditField={onEditField}
          />
        </div>
        <div
          id={`${inspectorId}-panel-appearance`}
          role="tabpanel"
          aria-labelledby={`${inspectorId}-tab-appearance`}
          hidden={activeTab !== 'appearance'}
          tabIndex={0}
        >
          <AppearanceEditor
            affectedCells={affectedCells}
            activeCellId={activeCellId}
            scope={scope}
            selectedCount={selectedCells.length}
            copy={copy}
            onScopeChange={onScopeChange}
            onStyleChange={onStyleChange}
            onInvertBorders={onInvertBorders}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.resetButton}
            disabled={selectedCells.length === 0}
            onClick={onResetSelected}
          >
            {copy.resetSelected}
          </button>
          {mobile ? <button type="button" className={styles.doneButton} onClick={onClose}>{copy.done}</button> : null}
        </div>
      </div>
    </aside>
  );
}
