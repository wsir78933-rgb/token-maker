'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Download, HelpCircle, MoreHorizontal, Plus, Save, Shuffle, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getPeriodicTableCopy } from '@/lib/periodic-table-creator/copy';
import { parsePeriodicTableHtml, serializePeriodicTableHtml } from '@/lib/periodic-table-creator/html';
import { readPeriodicTableSlots, savePeriodicTableSlot } from '@/lib/periodic-table-creator/storage';
import { applyCellStyle, createBlankTable, hasTableEdits, invertCellBorders, resetSelectedCells, selectAllCells, selectCell, updateCellText, validateTableDocument } from '@/lib/periodic-table-creator/table';
import { createRandomPeriodicTable, createRealPeriodicTable, randomizeCurrentTable } from '@/lib/periodic-table-creator/templates';
import { MAX_PERIODIC_TABLE_FILE_BYTES, PERIODIC_TABLE_SLOT_COUNT, type PeriodicTableDocument, type PeriodicTableField, type PeriodicTableScope, type PeriodicTableStyle } from '@/lib/periodic-table-creator/types';
import type { SiteLocale } from '@/lib/site-locale';

import { PeriodicTableDialogs, type PeriodicTableConfirmation, type PeriodicTablePanel } from './PeriodicTableDialogs';
import { usePeriodicTableCaseLoad, usePeriodicTableCaseLoadWorkspaceId } from './PeriodicTableCreatorCaseLoadProvider';
import { PeriodicTableGrid } from './PeriodicTableGrid';
import { PeriodicTableInspector } from './PeriodicTableInspector';
import styles from './PeriodicTableCreatorWorkbench.module.css';

type SavedTableSlot = { document: PeriodicTableDocument; savedAt: string } | null;
type ReplacementCommitCallback = () => void;
type RequestReplacement = (
  next: PeriodicTableDocument,
  message?: string | null,
  onCommitted?: ReplacementCommitCallback,
) => void;

function subscribeToMobileViewport(onChange: () => void) {
  const query = window.matchMedia('(max-width: 767px)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function subscribeToEditorViewport(onChange: () => void) {
  window.addEventListener('resize', onChange);
  window.visualViewport?.addEventListener('resize', onChange);
  window.visualViewport?.addEventListener('scroll', onChange);
  return () => {
    window.removeEventListener('resize', onChange);
    window.visualViewport?.removeEventListener('resize', onChange);
    window.visualViewport?.removeEventListener('scroll', onChange);
  };
}

function getEditorViewport() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  const keyboardInset = Math.max(0, window.innerHeight - height - (window.visualViewport?.offsetTop ?? 0));
  return `${height}:${keyboardInset}`;
}

function downloadTableFile(table: PeriodicTableDocument) {
  const html = serializePeriodicTableHtml(table);
  const objectUrl = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  try {
    link.href = objectUrl;
    link.download = 'periodicTable.txt';
    document.body.append(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }
}

function requireDimension(input: string, field: string) {
  if (!/^\d+$/.test(input)) throw new Error(`${field} must be an integer from 1 to 50; received ${JSON.stringify(input)}.`);
  return Number(input);
}

function prefersReducedMotionForCaseLoad(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function requireCaseLoadWorkspace(workspaceId: string): HTMLElement {
  if (workspaceId.trim().length === 0) {
    throw new Error(`Periodic table case load workspaceId must be non-empty. Received ${JSON.stringify(workspaceId)}.`);
  }

  const workspace = document.getElementById(workspaceId);
  if (!(workspace instanceof HTMLElement)) {
    throw new Error(`Periodic table case load workspace is missing. id=${JSON.stringify(workspaceId)}.`);
  }

  return workspace;
}

function focusCaseLoadWorkspace(workspaceId: string): void {
  const workspace = requireCaseLoadWorkspace(workspaceId);
  workspace.scrollIntoView({
    behavior: prefersReducedMotionForCaseLoad() ? 'instant' : 'smooth',
    block: 'start',
  });
  if (!workspace.hasAttribute('tabindex')) workspace.tabIndex = -1;
  workspace.focus({ preventScroll: true });
}

function blurActiveTableFieldBeforeReplacement(): void {
  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement) || !activeElement.matches('[data-field]')) return;
  activeElement.blur();
}

export function PeriodicTableCreatorWorkbench({ locale }: { locale: SiteLocale }) {
  const copy = getPeriodicTableCopy(locale);
  const caseLoad = usePeriodicTableCaseLoad();
  const caseLoadWorkspaceId = usePeriodicTableCaseLoadWorkspaceId();
  const importHintId = useId();
  const [table, setTable] = useState(createBlankTable);
  const [tableRevision, setTableRevision] = useState(0);
  const currentTable = useRef(table);
  const edited = useRef(false);
  const importInProgress = useRef(false);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [multiSelect, setMultiSelect] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'appearance'>('content');
  const [scope, setScope] = useState<PeriodicTableScope>('selected');
  const [focusField, setFocusField] = useState<PeriodicTableField | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [panel, setPanel] = useState<PeriodicTablePanel>(null);
  const [confirmation, setConfirmation] = useState<PeriodicTableConfirmation | null>(null);
  const [rowsInput, setRowsInput] = useState('7');
  const [columnsInput, setColumnsInput] = useState('18');
  const [slots, setSlots] = useState<SavedTableSlot[]>(() => Array.from({ length: PERIODIC_TABLE_SLOT_COUNT }, () => null));
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const handledCaseRequestId = useRef<number | null>(null);
  const requestReplacementRef = useRef<RequestReplacement | null>(null);
  const mobile = useSyncExternalStore(subscribeToMobileViewport, getMobileViewport, () => false);
  const editorViewport = useSyncExternalStore(subscribeToEditorViewport, getEditorViewport, () => '0:0');
  const [editorHeight, keyboardInset] = editorViewport.split(':').map(Number);
  const selectedCount = table.cells.filter((cell) => cell.selected).length;

  useEffect(() => {
    if (!mobile || !editorOpen) return;
    const scrollFrame = window.requestAnimationFrame(() => {
      const focusedField = document.activeElement;
      if (focusedField instanceof HTMLTextAreaElement) {
        focusedField.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }
    });
    return () => window.cancelAnimationFrame(scrollFrame);
  }, [editorViewport, mobile, editorOpen]);

  const caseLoadRequest = caseLoad?.request ?? null;

  useEffect(() => {
    if (caseLoadRequest === null || handledCaseRequestId.current === caseLoadRequest.requestId) return;

    const requestReplacement = requestReplacementRef.current;
    if (requestReplacement === null) {
      throw new Error(
        `Periodic table case load request ${caseLoadRequest.requestId} cannot be handled before replacement is ready.`,
      );
    }
    if (caseLoadWorkspaceId === null) {
      throw new Error(
        `Periodic table case load request ${caseLoadRequest.requestId} is missing its workspaceId.`,
      );
    }

    handledCaseRequestId.current = caseLoadRequest.requestId;
    requestReplacement(caseLoadRequest.document, caseLoadRequest.statusMessage, () => {
      focusCaseLoadWorkspace(caseLoadWorkspaceId);
    });
  }, [caseLoadRequest, caseLoadWorkspaceId]);

  function reportFailure(reason: unknown) {
    if (!(reason instanceof Error)) throw reason;
    setError(reason.message);
    setStatus(null);
  }

  function clearMessages() {
    setError(null);
    setStatus(null);
  }

  function setCurrentTable(next: PeriodicTableDocument) {
    currentTable.current = next;
    setTable(next);
  }

  function changeTable(transform: (previous: PeriodicTableDocument) => PeriodicTableDocument, marksEdited = true) {
    try {
      setCurrentTable(transform(currentTable.current));
      if (marksEdited) edited.current = true;
      clearMessages();
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function commitReplacement(
    next: PeriodicTableDocument,
    message: string | null,
    onCommitted?: ReplacementCommitCallback,
  ) {
    blurActiveTableFieldBeforeReplacement();
    setCurrentTable(next);
    setTableRevision((revision) => revision + 1);
    edited.current = hasTableEdits(next);
    const selected = next.cells.filter((cell) => cell.selected);
    setActiveCellId(selected.length === 1 ? selected[0].id : null);
    setFocusField(null);
    setConfirmation(null);
    setPanel(null);
    setError(null);
    setStatus(message);
    onCommitted?.();
  }

  function requestReplacement(
    next: PeriodicTableDocument,
    message: string | null = null,
    onCommitted?: ReplacementCommitCallback,
  ) {
    const checkedTable = validateTableDocument(next);
    if (edited.current || hasTableEdits(currentTable.current)) {
      setConfirmation({
        kind: 'replace',
        onConfirm: () => commitReplacement(checkedTable, message, onCommitted),
        onSaveFirst: downloadCurrentTable,
      });
      return;
    }
    commitReplacement(checkedTable, message, onCommitted);
  }

  requestReplacementRef.current = requestReplacement;

  function openPanel(next: PeriodicTablePanel) {
    setEditorOpen(false);
    setPanel(next);
    if (next === null) return;
    clearMessages();
    if (next === 'slots') {
      try {
        setSlots(readPeriodicTableSlots(window.localStorage));
      } catch (reason) {
        reportFailure(reason);
      }
    }
  }

  function selectGridCell(cellId: string) {
    try {
      const next = selectCell(currentTable.current, cellId, multiSelect);
      setCurrentTable(next);
      const selected = next.cells.filter((cell) => cell.selected);
      setActiveCellId(selected.length === 1 ? selected[0].id : null);
      clearMessages();
      if (mobile && !multiSelect) {
        setFocusField('symbol');
        setEditorOpen(true);
      }
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function focusGridField(cellId: string, field: PeriodicTableField) {
    if (multiSelect) return;
    changeTable((previous) => selectCell(previous, cellId, false), false);
    setActiveCellId(cellId);
    setFocusField(field);
    setActiveTab('content');
    if (mobile) setEditorOpen(true);
  }

  function editField(cellId: string, field: PeriodicTableField, value: string) {
    const cell = currentTable.current.cells.find((candidate) => candidate.id === cellId);
    if (cell?.text[field] === value) return;
    changeTable((previous) => updateCellText(previous, cellId, field, value));
  }

  function styleCells(patch: Partial<PeriodicTableStyle>) {
    changeTable((previous) => applyCellStyle(previous, scope, patch));
  }

  function selectAll(selected: boolean) {
    changeTable((previous) => selectAllCells(previous, selected), false);
    setActiveCellId(null);
    setFocusField(null);
  }

  function requestReset() {
    if (currentTable.current.cells.every((cell) => !cell.selected)) {
      reportFailure(new Error(copy.noSelection));
      return;
    }
    setConfirmation({ kind: 'reset', onConfirm: () => {
      changeTable(resetSelectedCells);
      setTableRevision((revision) => revision + 1);
      setConfirmation(null);
    } });
  }

  function createBlank() {
    try {
      requestReplacement(createBlankTable(requireDimension(rowsInput, copy.rows), requireDimension(columnsInput, copy.columns)));
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function loadRealTemplate() {
    try {
      requestReplacement(createRealPeriodicTable(locale));
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function generateRandom(defaultLayout: boolean) {
    try {
      requestReplacement(defaultLayout ? createRandomPeriodicTable() : randomizeCurrentTable(currentTable.current));
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function downloadCurrentTable() {
    try {
      downloadTableFile(currentTable.current);
      setError(null);
      setStatus(copy.statusDownloaded);
      if (panel === 'more') setPanel(null);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function writeSlot(slotNumber: number) {
    try {
      setSlots(savePeriodicTableSlot(window.localStorage, slotNumber, currentTable.current));
      setConfirmation(null);
      setError(null);
      setStatus(copy.statusSaved.replace('{slot}', String(slotNumber)));
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function saveSlot(slotNumber: number) {
    try {
      const storedSlots = readPeriodicTableSlots(window.localStorage);
      setSlots(storedSlots);
      if (storedSlots[slotNumber - 1] !== null) {
        setConfirmation({ kind: 'overwrite', onConfirm: () => writeSlot(slotNumber) });
        return;
      }
      writeSlot(slotNumber);
    } catch (reason) {
      reportFailure(reason);
    }
  }

  function loadSlot(slotNumber: number) {
    try {
      const storedSlots = readPeriodicTableSlots(window.localStorage);
      const savedSlot = storedSlots[slotNumber - 1];
      if (!savedSlot) throw new Error(`${copy.emptySlot}: ${slotNumber}.`);
      requestReplacement(savedSlot.document, copy.statusLoaded.replace('{slot}', String(slotNumber)));
    } catch (reason) {
      reportFailure(reason);
    }
  }

  async function importTable(file: File) {
    if (importInProgress.current) {
      reportFailure(new Error(`An import is already in progress; received file ${JSON.stringify(file.name)}.`));
      return;
    }
    importInProgress.current = true;
    try {
      if (file.size > MAX_PERIODIC_TABLE_FILE_BYTES) {
        throw new Error(`File ${JSON.stringify(file.name)} is ${file.size} bytes; maximum is ${MAX_PERIODIC_TABLE_FILE_BYTES} bytes.`);
      }
      const next = parsePeriodicTableHtml(await file.text());
      clearMessages();
      requestReplacement(next, copy.statusImported);
    } catch (reason) {
      reportFailure(reason);
    } finally {
      importInProgress.current = false;
    }
  }

  const inspector = (
    <PeriodicTableInspector
      document={table} activeCellId={activeCellId} copy={copy} activeTab={activeTab}
      scope={scope} focusField={focusField} mobile={mobile}
      onTabChange={setActiveTab} onScopeChange={setScope} onEditField={editField}
      onStyleChange={styleCells} onInvertBorders={() => changeTable((previous) => invertCellBorders(previous, scope))}
      onResetSelected={requestReset} onClose={() => setEditorOpen(false)}
    />
  );

  return (
    <section className={styles.workbench} aria-label={copy.workspaceLabel} data-testid="periodic-table-workbench">
      <div className={styles.toolbar}>
        <Button className={styles.toolButton} variant="outline" onClick={() => openPanel('new')}><Plus />{copy.newTable}</Button>
        <Button className={styles.toolButton} variant="outline" onClick={() => openPanel('random')}><Shuffle />{copy.random}</Button>
        <div className={styles.desktopActions}>
          <Button className={styles.toolButton} variant="outline" onClick={() => openPanel('slots')}><Save />{copy.slots}</Button>
          <Tooltip>
            <label className={styles.importButton}><Upload size={16} />{copy.importFile}
              <TooltipTrigger render={<input aria-label={copy.fileInputLabel} aria-describedby={importHintId} title="" type="file" accept=".txt,.html,.htm,text/plain,text/html" onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = '';
                if (file) void importTable(file);
              }} />} />
            </label>
            <TooltipContent id={importHintId} role="tooltip" side="bottom" sideOffset={8}>{copy.fileHint}</TooltipContent>
          </Tooltip>
          <Button className={`${styles.toolButton} ${styles.downloadButton}`} onClick={downloadCurrentTable}><Download />{copy.download}</Button>
          <Button className={styles.toolButton} variant="ghost" onClick={() => openPanel('help')}><HelpCircle />{copy.help}</Button>
        </div>
        <Button className={`${styles.toolButton} ${styles.mobileMore}`} variant="outline" onClick={() => openPanel('more')}><MoreHorizontal />{copy.more}</Button>
      </div>
      <div className={styles.selectionBar}>
        <Button className={styles.toolButton} variant={multiSelect ? 'secondary' : 'outline'} aria-pressed={multiSelect} onClick={() => setMultiSelect(!multiSelect)}>{copy.multiSelect}</Button>
        <Button className={styles.toolButton} variant="ghost" onClick={() => selectAll(true)}>{copy.selectAll}</Button>
        <Button className={styles.toolButton} variant="ghost" disabled={selectedCount === 0} onClick={() => selectAll(false)}>{copy.clearSelection}</Button>
        <span className={styles.selectionSummary}>{copy.selectedCount.replace('{count}', String(selectedCount))}</span>
      </div>
      {error !== null && panel === null && confirmation === null && !editorOpen ? <p role="alert" className={styles.error}>{copy.errorPrefix} {error}</p> : null}
      {status !== null && panel === null && confirmation === null && !editorOpen ? <p role="status" className={styles.status}>{status}</p> : null}
      <div className={styles.workspace}>
        <div className={styles.canvasColumn}>
          <div className={styles.canvasHeading}>
            <span>{copy.tableSize.replace('{rows}', String(table.rows)).replace('{columns}', String(table.columns))}</span>
            {mobile ? <Button className={styles.toolButton} variant="ghost" onClick={() => { setActiveTab('appearance'); setFocusField(null); setEditorOpen(true); }}>{copy.appearance}</Button> : null}
          </div>
          <PeriodicTableGrid key={tableRevision} document={table} copy={copy} multiSelect={multiSelect} mobile={mobile} onSelectCell={selectGridCell} onFocusField={focusGridField} onEditField={editField} />
          <p className={styles.hint}>{mobile ? copy.mobileScrollHint : copy.selectionHint}</p>
        </div>
        {!mobile ? <aside className={styles.inspector}>{inspector}</aside> : null}
      </div>
      <button type="button" className={styles.helpLink} onClick={() => openPanel('help')}><HelpCircle size={16} />{copy.help}</button>
      <Dialog open={mobile && editorOpen && confirmation === null} onOpenChange={setEditorOpen}>
        <DialogContent className={styles.editorSheet} style={mobile && editorHeight > 0 ? { height: Math.min(editorHeight * 0.92, 760), maxHeight: editorHeight * 0.92, marginBottom: keyboardInset } : undefined}>
          <div className={styles.sheetHeading}><DialogTitle>{activeTab === 'content' ? copy.content : copy.appearance}</DialogTitle><DialogDescription>{copy.selectedCount.replace('{count}', String(selectedCount))}</DialogDescription><DialogClose aria-label={copy.close} /></div>
          {error !== null ? <p role="alert" className={styles.error}>{copy.errorPrefix} {error}</p> : null}
          {inspector}
        </DialogContent>
      </Dialog>
      <PeriodicTableDialogs
        panel={panel} copy={copy} rowsInput={rowsInput} columnsInput={columnsInput}
        onRowsInput={setRowsInput} onColumnsInput={setColumnsInput} onCreateBlank={createBlank}
        onLoadReal={loadRealTemplate} onRandomDefault={() => generateRandom(true)} onRandomCurrent={() => generateRandom(false)}
        slots={slots} onSaveSlot={saveSlot} onLoadSlot={loadSlot} onImportFile={(file) => { void importTable(file); }}
        onDownload={downloadCurrentTable} onPanelChange={openPanel} confirmation={confirmation}
        onCancelConfirmation={() => setConfirmation(null)} error={error} status={status}
      />
    </section>
  );
}
