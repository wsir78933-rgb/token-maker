'use client';

import { useId, type ChangeEvent, type ReactNode } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MAX_PERIODIC_TABLE_DIMENSION,
  PERIODIC_TABLE_SLOT_COUNT,
  type PeriodicTableDocument,
} from '@/lib/periodic-table-creator/types';
import type { PeriodicTableCopy } from '@/lib/periodic-table-creator/copy-types';

import styles from './PeriodicTableDialogs.module.css';

export type PeriodicTablePanel = 'new' | 'random' | 'slots' | 'help' | 'more' | null;

export type PeriodicTableConfirmation = {
  kind: 'replace' | 'reset' | 'overwrite';
  onConfirm: () => void;
  onSaveFirst?: () => void;
};

export interface PeriodicTableDialogsProps {
  panel: PeriodicTablePanel;
  copy: PeriodicTableCopy;
  rowsInput: string;
  columnsInput: string;
  onRowsInput: (value: string) => void;
  onColumnsInput: (value: string) => void;
  onCreateBlank: () => void;
  onLoadReal: () => void;
  onRandomDefault: () => void;
  onRandomCurrent: () => void;
  slots: Array<{ document: PeriodicTableDocument; savedAt: string } | null>;
  onSaveSlot: (slotNumber: number) => void;
  onLoadSlot: (slotNumber: number) => void;
  onImportFile: (file: File) => void;
  onDownload: () => void;
  onPanelChange: (panel: PeriodicTablePanel) => void;
  confirmation: PeriodicTableConfirmation | null;
  onCancelConfirmation: () => void;
  error: string | null;
  status: string | null;
}

function isValidDimensionInput(value: string): boolean {
  if (value.trim() === '') return false;

  const dimension = Number(value);
  return Number.isInteger(dimension) && dimension >= 1 && dimension <= MAX_PERIODIC_TABLE_DIMENSION;
}

function formatSlotLabel(slotTemplate: string, slotNumber: number): string {
  return slotTemplate.replace('{slot}', String(slotNumber));
}

function formatSavedAtLabel(savedAtTemplate: string, savedAt: string): string {
  const parsedSavedAt = new Date(savedAt);
  if (Number.isNaN(parsedSavedAt.getTime())) {
    throw new Error(`Periodic table save date must be valid. Received ${JSON.stringify(savedAt)}.`);
  }

  const formattedSavedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedSavedAt);
  return savedAtTemplate.replace('{date}', formattedSavedAt);
}

function renderMessage(copy: PeriodicTableCopy, error: string | null, status: string | null): ReactNode {
  return (
    <div className={styles.messageStack}>
      {error !== null ? (
        <p className={styles.errorMessage} role="alert">
          <span className={styles.messageLabel}>{copy.errorPrefix}</span> {error}
        </p>
      ) : null}
      {status !== null ? (
        <p className={styles.statusMessage} role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function requireSlotList(slots: Array<{ document: PeriodicTableDocument; savedAt: string } | null>): void {
  if (slots.length !== PERIODIC_TABLE_SLOT_COUNT) {
    throw new Error(
      `Periodic table save slots must contain ${PERIODIC_TABLE_SLOT_COUNT} entries. Received ${slots.length}.`,
    );
  }

  slots.forEach((slot, slotIndex) => {
    if (slot === null) return;

    if (typeof slot.savedAt !== 'string') {
      throw new Error(
        `Periodic table save slot ${slotIndex + 1} savedAt must be a string. Received ${String(slot.savedAt)}.`,
      );
    }

    if (slot.document === null || typeof slot.document !== 'object') {
      throw new Error(
        `Periodic table save slot ${slotIndex + 1} document must be a document object. Received ${String(slot.document)}.`,
      );
    }
  });
}

function PanelHeader({ copy, title, description }: { copy: PeriodicTableCopy; title: string; description: string }) {
  return (
    <header className={styles.panelHeader}>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
      <DialogClose aria-label={copy.close} className={styles.closeButton} />
    </header>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  primary = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`${styles.actionButton} ${primary ? styles.primaryButton : styles.secondaryButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function DimensionInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.dimensionField} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        className={styles.textInput}
        type="number"
        min={1}
        max={MAX_PERIODIC_TABLE_DIMENSION}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

function NewPanel({
  copy,
  rowsInput,
  columnsInput,
  onRowsInput,
  onColumnsInput,
  onCreateBlank,
  onLoadReal,
}: Pick<
  PeriodicTableDialogsProps,
  'copy' | 'rowsInput' | 'columnsInput' | 'onRowsInput' | 'onColumnsInput' | 'onCreateBlank' | 'onLoadReal'
>) {
  const rowsAreValid = isValidDimensionInput(rowsInput);
  const columnsAreValid = isValidDimensionInput(columnsInput);

  return (
    <div className={styles.panelBody}>
      <div className={styles.dimensionGrid}>
        <DimensionInput id="periodic-table-rows" label={copy.rows} value={rowsInput} onChange={onRowsInput} />
        <DimensionInput
          id="periodic-table-columns"
          label={copy.columns}
          value={columnsInput}
          onChange={onColumnsInput}
        />
      </div>
      <p className={styles.hint}>{copy.dimensionHint}</p>
      <div className={styles.actionGrid}>
        <ActionButton
          primary
          disabled={!rowsAreValid || !columnsAreValid}
          onClick={onCreateBlank}
        >
          {copy.createBlank}
        </ActionButton>
        <ActionButton onClick={onLoadReal}>{copy.realTemplate}</ActionButton>
      </div>
    </div>
  );
}

function RandomPanel({
  copy,
  onRandomDefault,
  onRandomCurrent,
}: Pick<PeriodicTableDialogsProps, 'copy' | 'onRandomDefault' | 'onRandomCurrent'>) {
  return (
    <div className={styles.panelBody}>
      <p className={styles.longHint}>{copy.randomHint}</p>
      <div className={styles.actionGrid}>
        <ActionButton primary onClick={onRandomDefault}>
          {copy.randomDefault}
        </ActionButton>
        <ActionButton onClick={onRandomCurrent}>{copy.randomCurrent}</ActionButton>
      </div>
    </div>
  );
}

function SlotsPanel({
  copy,
  slots,
  onSaveSlot,
  onLoadSlot,
}: Pick<PeriodicTableDialogsProps, 'copy' | 'slots' | 'onSaveSlot' | 'onLoadSlot'>) {
  requireSlotList(slots);

  return (
    <div className={styles.panelBody}>
      <p className={styles.longHint}>{copy.storageHint}</p>
      <div className={styles.slotGrid}>
        {slots.map((slot, index) => {
          const slotNumber = index + 1;
          const slotLabel = formatSlotLabel(copy.slot, slotNumber);
          const saveLabel = `${copy.save} ${slotLabel}`;
          const loadLabel = `${copy.load} ${slotLabel}`;
          const savedAtLabel = slot === null ? copy.emptySlot : formatSavedAtLabel(copy.savedAt, slot.savedAt);

          return (
            <article key={slotNumber} className={styles.slotCard} data-periodic-table-slot={slotNumber}>
              <h3 className={styles.slotTitle}>{slotLabel}</h3>
              <p className={styles.slotState}>{savedAtLabel}</p>
              <div className={styles.slotActions}>
                <ActionButton onClick={() => onSaveSlot(slotNumber)}>{saveLabel}</ActionButton>
                <ActionButton disabled={slot === null} onClick={() => onLoadSlot(slotNumber)}>
                  {loadLabel}
                </ActionButton>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function HelpPanel({ copy }: Pick<PeriodicTableDialogsProps, 'copy'>) {
  const fieldDiagram = [
    copy.fields.topLeft,
    copy.fields.topRight,
    copy.fields.symbol,
    copy.fields.name,
    copy.fields.bottomLeft,
    copy.fields.bottomRight,
  ];

  return (
    <div className={styles.panelBody}>
      <p className={styles.longHint}>{copy.helpIntro}</p>
      <div className={styles.helpDiagram} aria-label={copy.fields.symbol}>
        {fieldDiagram.map((fieldLabel, index) => (
          <span key={`${fieldLabel}-${index}`} className={styles.diagramCell}>
            {fieldLabel}
          </span>
        ))}
      </div>
      <div className={styles.helpSections}>
        {copy.helpSections.map((section) => (
          <section key={section.title} className={styles.helpSection}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function MorePanel({
  copy,
  fileInputId,
  onPanelChange,
  onImportFile,
  onDownload,
}: Pick<PeriodicTableDialogsProps, 'copy' | 'onPanelChange' | 'onImportFile' | 'onDownload'> & {
  fileInputId: string;
}) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = '';

    if (selectedFile !== null) {
      onImportFile(selectedFile);
    }
  }

  function handleDownload(): void {
    onDownload();
    onPanelChange(null);
  }

  return (
    <div className={styles.panelBody}>
      <div className={styles.moreActions}>
        <ActionButton onClick={() => onPanelChange('slots')}>{copy.slots}</ActionButton>
        <label className={`${styles.actionButton} ${styles.secondaryButton}`} htmlFor={fileInputId}>
          {copy.importFile}
          <input
            id={fileInputId}
            className={styles.fileInput}
            type="file"
            accept=".txt,.html,.htm,text/html,text/plain"
            aria-label={copy.fileInputLabel}
            onChange={handleFileChange}
          />
        </label>
        <ActionButton primary onClick={handleDownload}>
          {copy.download}
        </ActionButton>
        <ActionButton onClick={() => onPanelChange('help')}>{copy.help}</ActionButton>
      </div>
      <p className={styles.hint}>{copy.fileHint}</p>
    </div>
  );
}

function ConfirmationDialog({
  copy,
  confirmation,
  onCancelConfirmation,
  error,
  status,
}: Pick<PeriodicTableDialogsProps, 'copy' | 'confirmation' | 'onCancelConfirmation' | 'error' | 'status'>) {
  if (confirmation === null) return null;

  const title =
    confirmation.kind === 'replace'
      ? copy.confirmReplaceTitle
      : confirmation.kind === 'reset'
        ? copy.confirmResetTitle
        : copy.confirmOverwriteTitle;
  const description =
    confirmation.kind === 'replace'
      ? copy.confirmReplaceDescription
      : confirmation.kind === 'reset'
        ? copy.confirmResetDescription
        : copy.confirmOverwriteDescription;
  const confirmLabel = confirmation.kind === 'reset' ? copy.resetSelected : copy.replace;

  return (
    <Dialog open onOpenChange={(open) => (!open ? onCancelConfirmation() : undefined)}>
      <DialogContent role="alertdialog" className={styles.dialogContent}>
        <div className={styles.panel}>
          <PanelHeader copy={copy} title={title} description={description} />
          <div className={styles.panelScroll}>
            {renderMessage(copy, error, status)}
            <div className={styles.confirmationActions}>
              <ActionButton onClick={onCancelConfirmation}>{copy.cancel}</ActionButton>
              {confirmation.kind === 'replace' && confirmation.onSaveFirst !== undefined ? (
                <ActionButton onClick={confirmation.onSaveFirst}>{copy.saveFirst}</ActionButton>
              ) : null}
              <ActionButton primary onClick={confirmation.onConfirm}>
                {confirmLabel}
              </ActionButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PeriodicTableDialogs({
  panel,
  copy,
  rowsInput,
  columnsInput,
  onRowsInput,
  onColumnsInput,
  onCreateBlank,
  onLoadReal,
  onRandomDefault,
  onRandomCurrent,
  slots,
  onSaveSlot,
  onLoadSlot,
  onImportFile,
  onDownload,
  onPanelChange,
  confirmation,
  onCancelConfirmation,
  error,
  status,
}: PeriodicTableDialogsProps) {
  const fileInputId = `periodic-table-import-${useId().replace(/:/g, '')}`;
  const panelIsOpen = panel !== null && confirmation === null;

  function renderPanelBody(activePanel: Exclude<PeriodicTablePanel, null>): ReactNode {
    if (activePanel === 'new') {
      return (
        <NewPanel
          copy={copy}
          rowsInput={rowsInput}
          columnsInput={columnsInput}
          onRowsInput={onRowsInput}
          onColumnsInput={onColumnsInput}
          onCreateBlank={onCreateBlank}
          onLoadReal={onLoadReal}
        />
      );
    }

    if (activePanel === 'random') {
      return <RandomPanel copy={copy} onRandomDefault={onRandomDefault} onRandomCurrent={onRandomCurrent} />;
    }

    if (activePanel === 'slots') {
      return <SlotsPanel copy={copy} slots={slots} onSaveSlot={onSaveSlot} onLoadSlot={onLoadSlot} />;
    }

    if (activePanel === 'help') {
      return <HelpPanel copy={copy} />;
    }

    return (
      <MorePanel
        copy={copy}
        fileInputId={fileInputId}
        onPanelChange={onPanelChange}
        onImportFile={onImportFile}
        onDownload={onDownload}
      />
    );
  }

  return (
    <>
      <Dialog open={panelIsOpen} onOpenChange={(open) => (!open ? onPanelChange(null) : undefined)}>
        <DialogContent className={styles.dialogContent}>
          {panel !== null ? (
            <div className={styles.panel}>
              <PanelHeader
                copy={copy}
                title={panel === 'new' ? copy.newTable : panel === 'random' ? copy.random : panel === 'slots' ? copy.slots : panel === 'help' ? copy.help : copy.more}
                description={panel === 'new' ? copy.newDescription : panel === 'random' ? copy.randomHint : panel === 'slots' ? copy.storageHint : panel === 'help' ? copy.helpIntro : copy.fileHint}
              />
              <div className={styles.panelScroll}>
                {renderMessage(copy, error, status)}
                {renderPanelBody(panel)}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        copy={copy}
        confirmation={confirmation}
        onCancelConfirmation={onCancelConfirmation}
        error={error}
        status={status}
      />
    </>
  );
}
