'use client';

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ClipboardEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import {
  PERIODIC_TABLE_FIELDS,
  type PeriodicTableCell,
  type PeriodicTableDocument,
  type PeriodicTableField,
} from '@/lib/periodic-table-creator/types';
import type { PeriodicTableCopy } from '@/lib/periodic-table-creator/copy-types';
import { validateTableDocument } from '@/lib/periodic-table-creator/table';

import styles from './PeriodicTableGrid.module.css';

export interface PeriodicTableGridProps {
  document: PeriodicTableDocument;
  copy: PeriodicTableCopy;
  multiSelect: boolean;
  mobile: boolean;
  onSelectCell: (id: string) => void;
  onFocusField: (id: string, field: PeriodicTableField) => void;
  onEditField: (id: string, field: PeriodicTableField, text: string) => void;
}

type FieldElementMap = Map<string, HTMLDivElement>;

const PERIODIC_TABLE_BLOCK_ELEMENTS = new Set(['DIV', 'LI', 'P']);

function describeReceivedValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    return typeof serializedValue === 'string' ? serializedValue : Object.prototype.toString.call(value);
  } catch (serializationFailure: unknown) {
    if (serializationFailure instanceof Error && serializationFailure.message.length > 0) {
      return `${Object.prototype.toString.call(value)} (JSON serialization failed: ${serializationFailure.message})`;
    }

    throw serializationFailure;
  }
}

function requireCopyField(copy: PeriodicTableCopy, field: PeriodicTableField): string {
  const label = copy.fields[field];
  if (typeof label !== 'string' || label.trim().length === 0) {
    throw new Error(
      `Periodic table copy field label ${JSON.stringify(field)} must be a non-empty string. Received ${describeReceivedValue(label)}.`,
    );
  }

  return label;
}

function isFieldTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-field]') !== null;
}

function fieldKey(cellId: string, field: PeriodicTableField): string {
  return `${cellId}:${field}`;
}

function isBlockElement(node: Node): boolean {
  return node.nodeType === 1 && PERIODIC_TABLE_BLOCK_ELEMENTS.has(node.nodeName);
}

function isEmptyBlockPlaceholder(node: Node): boolean {
  return isBlockElement(node) && node.childNodes.length === 1 && node.firstChild?.nodeName === 'BR';
}

function readPlainTextNode(node: Node): string {
  if (node.nodeType === 3) {
    return node.textContent ?? '';
  }

  if (node.nodeName === 'BR') {
    return '\n';
  }

  let plainText = '';
  let previousChildWasBlock = false;
  node.childNodes.forEach((childNode) => {
    const childIsBlock = isBlockElement(childNode);
    const childText = isEmptyBlockPlaceholder(childNode) ? '' : readPlainTextNode(childNode);
    const childStartsWithNewline = childText.startsWith('\n');
    const needsBlockBoundary =
      plainText.length > 0 &&
      (childIsBlock || previousChildWasBlock) &&
      !plainText.endsWith('\n') &&
      !childStartsWithNewline;
    if (needsBlockBoundary) {
      plainText += '\n';
    }
    plainText += childText;
    previousChildWasBlock = childIsBlock;
  });

  return plainText;
}

function readPlainText(node: Node): string {
  if (isEmptyBlockPlaceholder(node)) return '';
  return readPlainTextNode(node);
}

function updateFieldNodeText(fieldNode: HTMLDivElement, expectedText: string): void {
  if (fieldNode.textContent !== expectedText && document.activeElement !== fieldNode) {
    fieldNode.textContent = expectedText;
  }
}

function safeBackgroundImageValue(backgroundImageUrl: string, cellId: string): string | undefined {
  if (backgroundImageUrl.trim().length === 0) return undefined;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(backgroundImageUrl);
  } catch (invalidUrl: unknown) {
    throw new Error(
      `Periodic table cell ${JSON.stringify(cellId)} background image URL is invalid. Received ${JSON.stringify(backgroundImageUrl)}.`,
      { cause: invalidUrl },
    );
  }

  if (!['http:', 'https:', 'data:'].includes(parsedUrl.protocol)) {
    throw new Error(
      `Periodic table cell ${JSON.stringify(cellId)} background image URL must use http, https, or data protocol. Received ${JSON.stringify(backgroundImageUrl)}.`,
    );
  }

  return `url(${JSON.stringify(backgroundImageUrl)})`;
}

function cellInlineStyle(tableCell: PeriodicTableCell): CSSProperties {
  return {
    backgroundColor: tableCell.style.backgroundColor,
    backgroundImage: safeBackgroundImageValue(tableCell.style.backgroundImageUrl, tableCell.id),
    borderColor: tableCell.style.borderVisible ? tableCell.style.borderColor : 'transparent',
    color: tableCell.style.textColor,
  };
}

function fieldClassName(field: PeriodicTableField): string {
  if (field === 'topLeft') return `${styles.field} ${styles.topLeft}`;
  if (field === 'topRight') return `${styles.field} ${styles.topRight}`;
  if (field === 'symbol') return `${styles.field} ${styles.symbol}`;
  if (field === 'name') return `${styles.field} ${styles.name}`;
  if (field === 'bottomLeft') return `${styles.field} ${styles.bottomLeft}`;
  return `${styles.field} ${styles.bottomRight}`;
}

function PeriodicTableFieldElement({
  tableCell,
  field,
  copy,
  editable,
  mobile,
  fieldNodeMap,
  onFocusField,
  onEditField,
}: {
  tableCell: PeriodicTableCell;
  field: PeriodicTableField;
  copy: PeriodicTableCopy;
  editable: boolean;
  mobile: boolean;
  fieldNodeMap: FieldElementMap;
  onFocusField: (id: string, field: PeriodicTableField) => void;
  onEditField: (id: string, field: PeriodicTableField, text: string) => void;
}) {
  const label = requireCopyField(copy, field);
  const elementKey = fieldKey(tableCell.id, field);
  const fieldText = tableCell.text[field];
  const fieldElementRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const fieldElement = fieldElementRef.current;
    if (fieldElement === null) {
      throw new Error(
        `Periodic table field ${JSON.stringify(elementKey)} element is missing. Received null.`,
      );
    }

    updateFieldNodeText(fieldElement, fieldText);
  }, [elementKey, fieldText]);

  function handleFocus(): void {
    onFocusField(tableCell.id, field);
  }

  function handleMobileKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!mobile || editable) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleFocus();
  }

  function handleInput(event: FormEvent<HTMLDivElement>): void {
    if (!editable) return;
    onEditField(tableCell.id, field, readPlainText(event.currentTarget));
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    if (!editable) return;
    onEditField(tableCell.id, field, readPlainText(event.currentTarget));
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>): void {
    if (!editable) return;
    const clipboardData = event.clipboardData;
    if (clipboardData === null) {
      throw new Error(`Periodic table field ${JSON.stringify(elementKey)} paste data is unavailable. Received null.`);
    }

    const clipboardText = clipboardData.getData('text/plain');
    event.preventDefault();
    const fieldElement = event.currentTarget;
    const selection = window.getSelection();

    if (selection === null || selection.rangeCount === 0) {
      fieldElement.append(document.createTextNode(clipboardText));
    } else {
      const selectionRange = selection.getRangeAt(0);
      if (!fieldElement.contains(selectionRange.commonAncestorContainer)) {
        fieldElement.append(document.createTextNode(clipboardText));
      } else {
        selectionRange.deleteContents();
        const insertedTextNode = document.createTextNode(clipboardText);
        selectionRange.insertNode(insertedTextNode);
        selectionRange.setStartAfter(insertedTextNode);
        selectionRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(selectionRange);
      }
    }

    onEditField(tableCell.id, field, readPlainText(fieldElement));
  }

  return (
    <div
      ref={(fieldElement) => {
        fieldElementRef.current = fieldElement;
        if (fieldElement === null) {
          fieldNodeMap.delete(elementKey);
        } else {
          fieldNodeMap.set(elementKey, fieldElement);
        }
      }}
      className={fieldClassName(field)}
      data-field={field}
      contentEditable={editable}
      suppressContentEditableWarning
      role={mobile && !editable ? 'button' : undefined}
      tabIndex={mobile && !editable ? 0 : undefined}
      aria-label={`${label} (${tableCell.id})`}
      onClick={mobile && !editable ? handleFocus : undefined}
      onFocus={editable ? handleFocus : undefined}
      onKeyDown={mobile && !editable ? handleMobileKeyDown : undefined}
      onInput={handleInput}
      onBlur={handleBlur}
      onPaste={handlePaste}
    />
  );
}

function PeriodicTableCellElement({
  tableCell,
  rowIndex,
  columnIndex,
  copy,
  multiSelect,
  mobile,
  fieldNodeMap,
  onSelectCell,
  onFocusField,
  onEditField,
}: {
  tableCell: PeriodicTableCell;
  rowIndex: number;
  columnIndex: number;
  copy: PeriodicTableCopy;
  multiSelect: boolean;
  mobile: boolean;
  fieldNodeMap: FieldElementMap;
  onSelectCell: (id: string) => void;
  onFocusField: (id: string, field: PeriodicTableField) => void;
  onEditField: (id: string, field: PeriodicTableField, text: string) => void;
}) {
  const fieldEditable = !mobile && !multiSelect;

  function handleCellClick(event: MouseEvent<HTMLDivElement>): void {
    if (multiSelect || !isFieldTarget(event.target)) {
      onSelectCell(tableCell.id);
    }
  }

  function handleCellKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (isFieldTarget(event.target)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectCell(tableCell.id);
  }

  const cellClassName = tableCell.selected
    ? `${styles.cell} ${styles.selected}`
    : styles.cell;
  const cellName = tableCell.text.name || tableCell.text.symbol || copy.emptyCell;

  return (
    <div
      className={cellClassName}
      data-cell-id={tableCell.id}
      role="gridcell"
      aria-label={`${cellName} (${tableCell.id})`}
      aria-selected={tableCell.selected}
      aria-rowindex={rowIndex + 1}
      aria-colindex={columnIndex + 1}
      tabIndex={0}
      style={cellInlineStyle(tableCell)}
      onClick={handleCellClick}
      onKeyDown={handleCellKeyDown}
    >
      <div className={styles.topRow}>
        <PeriodicTableFieldElement
          tableCell={tableCell}
          field="topLeft"
          copy={copy}
          editable={fieldEditable}
          mobile={mobile}
          fieldNodeMap={fieldNodeMap}
          onFocusField={onFocusField}
          onEditField={onEditField}
        />
        <PeriodicTableFieldElement
          tableCell={tableCell}
          field="topRight"
          copy={copy}
          editable={fieldEditable}
          mobile={mobile}
          fieldNodeMap={fieldNodeMap}
          onFocusField={onFocusField}
          onEditField={onEditField}
        />
      </div>
      <div className={styles.middleRow}>
        <PeriodicTableFieldElement
          tableCell={tableCell}
          field="symbol"
          copy={copy}
          editable={fieldEditable}
          mobile={mobile}
          fieldNodeMap={fieldNodeMap}
          onFocusField={onFocusField}
          onEditField={onEditField}
        />
        <PeriodicTableFieldElement
          tableCell={tableCell}
          field="name"
          copy={copy}
          editable={fieldEditable}
          mobile={mobile}
          fieldNodeMap={fieldNodeMap}
          onFocusField={onFocusField}
          onEditField={onEditField}
        />
      </div>
      <div className={styles.bottomRow}>
        <PeriodicTableFieldElement
          tableCell={tableCell}
          field="bottomLeft"
          copy={copy}
          editable={fieldEditable}
          mobile={mobile}
          fieldNodeMap={fieldNodeMap}
          onFocusField={onFocusField}
          onEditField={onEditField}
        />
        <PeriodicTableFieldElement
          tableCell={tableCell}
          field="bottomRight"
          copy={copy}
          editable={fieldEditable}
          mobile={mobile}
          fieldNodeMap={fieldNodeMap}
          onFocusField={onFocusField}
          onEditField={onEditField}
        />
      </div>
    </div>
  );
}

export function PeriodicTableGrid({
  document: receivedDocument,
  copy,
  multiSelect,
  mobile,
  onSelectCell,
  onFocusField,
  onEditField,
}: PeriodicTableGridProps) {
  const tableDocument = validateTableDocument(receivedDocument);
  const fieldNodeMap = useMemo<FieldElementMap>(() => new Map(), []);
  const tableFieldLabels = PERIODIC_TABLE_FIELDS.map((field) => requireCopyField(copy, field)).join(', ');

  useLayoutEffect(() => {
    tableDocument.cells.forEach((tableCell) => {
      PERIODIC_TABLE_FIELDS.forEach((field) => {
        const fieldElement = fieldNodeMap.get(fieldKey(tableCell.id, field));
        if (fieldElement !== undefined) {
          updateFieldNodeText(fieldElement, tableCell.text[field]);
        }
      });
    });
  }, [fieldNodeMap, tableDocument]);

  const cellMinimum = mobile ? 72 : 48;
  const tableGap = mobile ? 6.4 : 5.6;
  const tableHorizontalPadding = mobile ? 14.4 : 11.2;
  const tableColumns = `repeat(${tableDocument.columns}, minmax(${cellMinimum}px, 1fr))`;
  const tableStyle: CSSProperties = {
    gridTemplateColumns: tableColumns,
    minWidth: `${tableDocument.columns * cellMinimum + Math.max(tableDocument.columns - 1, 0) * tableGap + tableHorizontalPadding}px`,
    width: '100%',
  };

  return (
    <section
      className={styles.root}
      data-testid="periodic-table-grid"
      data-multi-select={multiSelect}
      aria-label={copy.workspaceLabel}
    >
      <div
        className={styles.scrollFrame}
        role="region"
        aria-label={copy.mobileScrollHint}
        tabIndex={0}
      >
        <div
          className={styles.table}
          role="grid"
          aria-label={`${copy.workspaceLabel}: ${tableFieldLabels}`}
          aria-rowcount={tableDocument.rows}
          aria-colcount={tableDocument.columns}
          style={tableStyle}
        >
          {tableDocument.cells.map((tableCell, cellIndex) => {
            const rowIndex = Math.floor(cellIndex / tableDocument.columns);
            const columnIndex = cellIndex % tableDocument.columns;
            return (
              <PeriodicTableCellElement
                key={tableCell.id}
                tableCell={tableCell}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                copy={copy}
                multiSelect={multiSelect}
                mobile={mobile}
                fieldNodeMap={fieldNodeMap}
                onSelectCell={onSelectCell}
                onFocusField={onFocusField}
                onEditField={onEditField}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
